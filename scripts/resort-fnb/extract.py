#!/usr/bin/env python3
"""Extract the resort-F&B hub content from the standalone HTML library into a
structured JSON the Next.js app renders through its own design system.

Fidelity-first: the HTML was hand-curated and guardrail-corrected (honest
"verify" hedges on unproven "free" claims), so we lift content verbatim and only
SANITIZE links:
  - /places/* anchors are stubs -> unlink to plain text (README to-do), and card
    "book" CTAs pointing at /places are dropped.
  - the 3 deferred sunset slugs are repointed to the existing live routes so we
    never create duplicate URLs.
JSON-LD: strip /places urls, point publisher logo at the real icon. Schema price
stays only where the source already emitted it ([OFFICIAL] rows).
"""
import re, json, html, sys, os

SRC = "data/resort-fnb/source"
OUT = "data/resort-fnb/pages.generated.json"

# The 17 pages we build now (the 3 sunset hubs that collide with existing
# /<district>/beach-clubs-sunset are deferred and NOT emitted).
DEFER = {"canggu-sunset-beach-clubs", "seminyak-sunset-beach-clubs", "uluwatu-sunset-clubs"}

# COVERAGE = free traffic hubs (day passes + free beach clubs + island pillars);
# SEATED = the money-model pages (brunches + sunset). Mirrors 00_INDEX.md.
LAYER = {
    "bali-free-beach-clubs": "COVERAGE", "bali-resort-day-passes": "COVERAGE",
    "bali-hotel-brunches": "SEATED", "bali-sunset-clubs": "SEATED",
    "canggu-beach-club-day-passes": "COVERAGE", "nusa-dua-resort-day-passes": "COVERAGE",
    "ubud-jungle-pool-day-passes": "COVERAGE", "sanur-resort-day-passes": "COVERAGE",
    "jimbaran-resort-day-passes": "COVERAGE", "seminyak-beach-club-day-passes": "COVERAGE",
    "uluwatu-resort-pool-day-passes": "COVERAGE",
    "nusa-dua-hotel-brunches": "SEATED", "sanur-hotel-brunches": "SEATED",
    "ubud-hotel-brunches": "SEATED", "seminyak-hotel-brunches": "SEATED",
    "jimbaran-hotel-brunches": "SEATED", "jimbaran-sunset-seafood": "SEATED",
}

# Repoint deferred sunset slugs to the existing live routes (same topic).
LINK_REWRITE = {
    "/canggu/sunset-beach-clubs": "/canggu/beach-clubs-sunset",
    "/seminyak/sunset-beach-clubs": "/seminyak/beach-clubs-sunset",
    "/uluwatu/cliff-clubs-sunset": "/uluwatu/beach-clubs-sunset",
    "/uluwatu/sunset-clubs": "/uluwatu/beach-clubs-sunset",
    "/sanur/sunrise-beach": "/sanur",  # no such route; Sanur pillar carries the sunrise note
}
LOGO = "https://www.otherbali.com/icon-512.png"


def sanitize_html(s):
    if s is None:
        return None
    # unlink /places/* stubs (single OR double quoted) -> keep the inner text only
    s = re.sub(r"""<a\b[^>]*href=['"]/places/[^'"]*['"][^>]*>(.*?)</a>""", r"\1", s, flags=re.S)
    # repoint deferred sunset links (either quote style)
    for a, b in LINK_REWRITE.items():
        s = s.replace(f'href="{a}"', f'href="{b}"').replace(f"href='{a}'", f"href='{b}'")
    return s.strip()


def first(pattern, text, flags=re.S):
    m = re.search(pattern, text, flags)
    return m.group(1).strip() if m else None


def extract(path):
    h = open(path, encoding="utf-8").read()
    h = re.sub(r"<!--.*?-->", "", h, flags=re.S)  # drop HTML comments (build notes/clone hints)
    slug_file = os.path.basename(path)[:-5]
    canonical = first(r'<link rel="canonical" href="https://www\.otherbali\.com([^"]*)"', h)
    url = canonical or "/" + slug_file
    title = first(r"<title>(.*?)</title>", h)
    desc = first(r'<meta name="description" content="([^"]*)"', h)
    bc = first(r'<nav class="bc"[^>]*>(.*?)</nav>', h)
    bc_label = None
    if bc:
        parts = re.split(r"›|&rsaquo;|&#8250;", bc)
        bc_label = re.sub(r"<[^>]+>", "", parts[-1]).strip() if parts else None
    h1 = first(r"<h1>(.*?)</h1>", h)
    sub = first(r'<p class="sub">(.*?)</p>', h)
    answer = first(r'<div class="answer">(.*?)</div>', h)
    callout = first(r'<div class="callout">(.*?)</div>', h)
    checked = first(r'<p class="checked">(.*?)</p>\s*<h2>Frequently', h)

    # ----- comparison table -----
    table = first(r"<table>(.*?)</table>", h)
    thead = [re.sub(r"\s+", " ", c).strip() for c in re.findall(r"<th\b[^>]*>(.*?)</th>", table or "", re.S)]
    rows = []
    tbody = first(r"<tbody>(.*?)</tbody>", table or "") or ""
    for tr in re.findall(r"<tr>(.*?)</tr>", tbody, re.S):
        cells = [sanitize_html(c) for c in re.findall(r"<td\b[^>]*>(.*?)</td>", tr, re.S)]
        if cells:
            rows.append(cells)

    # ----- optional detail cards -----
    cards = []
    for c in re.findall(r'<div class="card">(.*?)</div>\s*(?=<div class="card">|<h2|<p class="note">)', h, re.S):
        card = {
            "h3": first(r"<h3>(.*?)</h3>", c),
            "meta": first(r'<div class="meta">(.*?)</div>', c),
            "body": first(r"</div>\s*<p>(.*?)</p>", c) or first(r"<p>(.*?)</p>", c),
            "kv": [[dt.strip(), sanitize_html(dd)] for dt, dd in
                   re.findall(r"<dt>(.*?)</dt><dd>(.*?)</dd>", c, re.S)],
        }
        book = re.search(r'<a class="book" href="([^"]*)"[^>]*>(.*?)</a>', c, re.S)
        # drop the CTA when it points at a /places stub (dead link)
        card["book"] = None if (not book or book.group(1).startswith("/places")) else \
            {"href": LINK_REWRITE.get(book.group(1), book.group(1)), "label": book.group(2).strip()}
        cards.append(card)

    # ----- FAQ (display html + decoded text for schema) -----
    faq = []
    for q, a in re.findall(r"<details><summary>(.*?)</summary><p>(.*?)</p></details>", h, re.S):
        faq.append({
            "q_text": html.unescape(re.sub(r"<[^>]+>", "", q)).strip(),
            "a_html": sanitize_html(a),
            "a_text": html.unescape(re.sub(r"<[^>]+>", "", a)).strip(),
        })

    # ----- related (clonemap) -----
    related = []
    clone = first(r'<div class="clonemap">(.*?)</div>', h)
    if clone:
        for href, label in re.findall(r"""<a\b[^>]*href=['"]([^'"]*)['"][^>]*>(.*?)</a>""", clone, re.S):
            href = LINK_REWRITE.get(href, href)
            if href.startswith("/places"):
                continue
            related.append({"href": href, "label": re.sub(r"<[^>]+>", "", label).strip()})

    # ----- JSON-LD blocks: strip /places urls, fix logo -----
    jsonld = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        try:
            obj = json.loads(block)
        except Exception:
            continue
        def walk(o):
            if isinstance(o, dict):
                if isinstance(o.get("url"), str) and "/places/" in o["url"]:
                    o.pop("url", None)
                if o.get("@type") == "Organization" and isinstance(o.get("logo"), dict):
                    o["logo"]["url"] = LOGO
                for v in o.values():
                    walk(v)
            elif isinstance(o, list):
                for v in o:
                    walk(v)
        walk(obj)
        jsonld.append(obj)

    return {
        "slug": slug_file,
        "url": url,
        "layer": LAYER.get(slug_file, "COVERAGE"),
        "metaTitle": title,
        "title": re.sub(r"\s*\|\s*Other Bali\s*$", "", title or "").strip(),
        "description": desc,
        "breadcrumbLabel": bc_label,
        "h1": h1,
        "sub": sanitize_html(sub),
        "answer": sanitize_html(answer),
        "callout": sanitize_html(callout),
        "checkedNote": sanitize_html(checked),
        "tableHead": thead,
        "tableRows": rows,
        "cards": cards,
        "faq": faq,
        "related": related,
        "jsonld": jsonld,
    }


def main():
    pages = []
    for f in sorted(os.listdir(SRC)):
        if not f.endswith(".html"):
            continue
        slug = f[:-5]
        if slug in DEFER:
            continue
        pages.append(extract(os.path.join(SRC, f)))
    json.dump(pages, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"emitted {len(pages)} pages -> {OUT}")
    for p in pages:
        print(f"  {p['url']:<40} {p['layer']:<9} rows={len(p['tableRows'])} cards={len(p['cards'])} faq={len(p['faq'])}")


if __name__ == "__main__":
    main()
