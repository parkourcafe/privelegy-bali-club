#!/usr/bin/env node
// Offline parser for pages stored by crawl.mjs.
//
//   PARSE5_DIR=<dir containing node_modules/parse5> \
//   node parse.mjs --crawl <crawl-out> --out <parsed.jsonl>
//
// parse5 is installed outside the repository (no package.json change):
//   mkdir -p /tmp/deps && cd /tmp/deps && npm init -y && npm i parse5@7
//
// Anchors on page semantics first (h1, h2 text, dt labels, the "Information
// last checked" line, the JSON-LD node whose url is the page) and on the
// semantic class names the live markup carries second.

import { readFile, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

const ORIGIN = "https://www.otherbali.com";

let parse5;
export function loadParse5(dir = process.env.PARSE5_DIR) {
  if (parse5) return parse5;
  if (!dir) throw new Error("Set PARSE5_DIR to a directory containing node_modules/parse5");
  parse5 = createRequire(join(resolve(dir), "package.json"))("parse5");
  return parse5;
}

// ---------------------------------------------------------------- DOM helpers

const SKIP_TEXT = new Set(["script", "style", "noscript", "template"]);

export function attrs(node) {
  const out = {};
  for (const a of node.attrs ?? []) out[a.name] = a.value;
  return out;
}

export function classes(node) {
  const c = attrs(node).class;
  return new Set(c ? c.split(/\s+/).filter(Boolean) : []);
}

export function walk(node, fn, parents = []) {
  if (fn(node, parents) === false) return;
  const kids = node.childNodes ?? (node.content ? node.content.childNodes : []);
  for (const child of kids ?? []) walk(child, fn, [...parents, node]);
}

export function findAll(root, pred) {
  const out = [];
  walk(root, (n, parents) => {
    if (n.tagName && pred(n, parents)) out.push(n);
  });
  return out;
}

export function find(root, pred) {
  let hit = null;
  walk(root, (n, parents) => {
    if (hit) return false;
    if (n.tagName && pred(n, parents)) {
      hit = n;
      return false;
    }
    return undefined;
  });
  return hit;
}

const byTag = (tag) => (n) => n.tagName === tag;
const byClass = (tag, cls) => (n) => (!tag || n.tagName === tag) && classes(n).has(cls);

export function text(node, { exclude } = {}) {
  const parts = [];
  walk(node, (n) => {
    if (n.tagName && SKIP_TEXT.has(n.tagName)) return false;
    if (n.tagName && exclude && exclude(n)) return false;
    if (n.nodeName === "#text") parts.push(n.value);
    if (n.tagName && /^(p|div|li|dt|dd|h[1-6]|section|article|br|tr|td|th|summary|details|figcaption|blockquote)$/.test(n.tagName)) parts.push(" ");
    return undefined;
  });
  return parts.join("").replace(/\s+/g, " ").trim();
}

function rawText(node) {
  return (node.childNodes ?? []).map((c) => c.value ?? "").join("");
}

function normalizePath(href, base) {
  try {
    const u = new URL(href, base);
    if (u.origin !== ORIGIN) return { external: true, url: u.toString(), host: u.host };
    u.hash = "";
    let path = u.pathname;
    if (path !== "/") path = path.replace(/\/+$/u, "");
    return { external: false, path, search: u.search, url: `${ORIGIN}${path}${u.search}` };
  } catch {
    return { invalid: true, raw: href };
  }
}

// Regions whose text is site chrome or shared, not authored for this page.
export function isChrome(n) {
  const c = classes(n);
  if (n.tagName === "footer" || n.tagName === "nav") return true;
  for (const name of ["ob-site-header", "ob-mega", "ob-mega-panel", "ob-compact-nav", "ob-compact-panel",
    "related-guides", "breadcrumbs", "action-gateway", "venue-action-bar", "sr-only", "ob-locale-switcher"]) {
    if (c.has(name)) return true;
  }
  if (n.tagName === "header" && c.has("ob-site-header")) return true;
  return false;
}

// ---------------------------------------------------------------- JSON-LD

function jsonLdBlocks(doc) {
  return findAll(doc, (n) => n.tagName === "script" && (attrs(n).type ?? "") === "application/ld+json").map((n) => {
    const raw = rawText(n);
    try {
      return { ok: true, data: JSON.parse(raw) };
    } catch (error) {
      return { ok: false, error: String(error.message).slice(0, 200), raw: raw.slice(0, 300) };
    }
  });
}

export function flattenLd(value, out = []) {
  if (Array.isArray(value)) {
    for (const v of value) flattenLd(v, out);
  } else if (value && typeof value === "object") {
    if (value["@type"]) out.push(value);
    if (value["@graph"]) flattenLd(value["@graph"], out);
    for (const [k, v] of Object.entries(value)) {
      if (k === "@graph") continue;
      if (v && typeof v === "object") flattenLd(v, out);
    }
  }
  return out;
}

const ldTypes = (node) => [].concat(node["@type"] ?? []);

// ---------------------------------------------------------------- page parse

export function parsePage(html, pageUrl) {
  const { parse } = loadParse5();
  const doc = parse(html);
  const head = find(doc, byTag("head")) ?? doc;
  const body = find(doc, byTag("body")) ?? doc;
  const main = find(body, byTag("main")) ?? body;
  const metas = findAll(head, byTag("meta")).map(attrs);
  const linksRel = findAll(head, byTag("link")).map(attrs);
  const meta = (key, val) => metas.find((m) => m[key] === val)?.content ?? null;

  const ld = jsonLdBlocks(doc);
  const ldNodes = ld.filter((b) => b.ok).flatMap((b) => flattenLd(b.data));
  const ldTypeCounts = {};
  for (const n of ldNodes) for (const t of ldTypes(n)) ldTypeCounts[t] = (ldTypeCounts[t] ?? 0) + 1;
  const itemLists = ldNodes.filter((n) => ldTypes(n).includes("ItemList")).map((n) => ({
    name: n.name ?? null,
    items: Array.isArray(n.itemListElement) ? n.itemListElement.length : 0,
    urls: Array.isArray(n.itemListElement) ? n.itemListElement.map((e) => e.url ?? e.item?.url ?? e.item?.["@id"] ?? (typeof e.item === "string" ? e.item : null)).filter(Boolean) : [],
  }));

  // links in main with context
  const links = [];
  walk(main, (n, parents) => {
    if (n.tagName !== "a") return undefined;
    const a = attrs(n);
    if (!a.href) return undefined;
    const target = normalizePath(a.href, pageUrl);
    const chrome = parents.some(isChrome);
    const section = [...parents].reverse().find((p) => p.tagName === "section" || p.tagName === "aside" || p.tagName === "article");
    const sectionH2 = section ? find(section, (x) => x.tagName === "h2" || x.tagName === "h3") : null;
    const similar = parents.some((p) => {
      if (p.tagName !== "section") return false;
      const h2 = find(p, byTag("h2"));
      return h2 && /similar places nearby/i.test(text(h2));
    });
    links.push({
      ...target,
      text: text(n).slice(0, 120),
      chrome,
      similar,
      context: sectionH2 ? text(sectionH2).slice(0, 80) : null,
      rel: a.rel ?? null,
    });
    return undefined;
  });

  const page = {
    url: pageUrl,
    title: text(find(head, byTag("title")) ?? { childNodes: [] }),
    metaDescription: meta("name", "description"),
    robotsMeta: meta("name", "robots"),
    canonicals: linksRel.filter((l) => (l.rel ?? "").split(/\s+/).includes("canonical")).map((l) => l.href),
    ogTitle: meta("property", "og:title"),
    ogDescription: meta("property", "og:description"),
    ogUrl: meta("property", "og:url"),
    htmlLang: attrs(find(doc, byTag("html")) ?? { attrs: [] }).lang ?? null,
    h1: findAll(body, byTag("h1")).map((n) => text(n)),
    h2: findAll(main, byTag("h2")).map((n) => text(n)).slice(0, 60),
    ld: ld.map((b) => (b.ok ? { ok: true, types: flattenLd(b.data).flatMap(ldTypes) } : b)),
    ldTypeCounts,
    itemLists,
    breadcrumbLd: ldNodes.filter((n) => ldTypes(n).includes("BreadcrumbList")).length,
    faqSummaries: findAll(main, (n, parents) => n.tagName === "summary" && parents.some((p) => classes(p).has("faq-list"))).length,
    faqLd: ldNodes.filter((n) => ldTypes(n).includes("FAQPage")).length,
    mainText: text(main),
    authoredText: text(main, { exclude: isChrome }),
    links,
    lastCheckedText: (text(main).match(/last checked:?\s*([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{1,2} [A-Z][a-z]+ [0-9]{4})/i) ?? [])[1] ?? null,
    images: findAll(main, byTag("img")).map((n) => ({ src: attrs(n).src ?? null, alt: attrs(n).alt ?? null })).slice(0, 40),
  };

  const placeName = find(main, byClass("h1", "venue-masthead-title"));
  if (placeName) page.place = parsePlace(main, ldNodes, pageUrl, placeName);
  page.forbiddenLd = findForbiddenLd(ld);
  return page;
}

function findForbiddenLd(ld) {
  const hits = [];
  const scan = (value, path) => {
    if (Array.isArray(value)) value.forEach((v, i) => scan(v, `${path}[${i}]`));
    else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) {
        if (["aggregateRating", "review", "reviewRating", "ratingValue", "reviewCount"].includes(k)) hits.push({ path: `${path}.${k}`, kind: k });
        if (k === "availability") hits.push({ path: `${path}.${k}`, kind: "availability", value: String(v) });
        scan(v, `${path}.${k}`);
      }
    } else if (typeof value === "string" && /schema\.org\/(InStock|LimitedAvailability|PreOrder|InStoreOnly|OutOfStock)/.test(value)) {
      hits.push({ path, kind: "availability-value", value });
    }
  };
  ld.forEach((b, i) => b.ok && scan(b.data, `ld[${i}]`));
  // de-duplicate availability key + value double hits
  const seen = new Set();
  return hits.filter((h) => {
    const key = `${h.path.replace(/\.availability$/, "")}|${h.value ?? h.kind}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dlPairs(dl) {
  const pairs = [];
  for (const dt of findAll(dl, byTag("dt"))) {
    // dt and dd are siblings inside a wrapper div
    const parentKids = (dt.parentNode?.childNodes ?? []).filter((k) => k.tagName);
    const idx = parentKids.indexOf(dt);
    const dd = parentKids.slice(idx + 1).find((k) => k.tagName === "dd");
    pairs.push({
      label: text(dt),
      value: dd ? text(dd) : null,
      links: dd ? findAll(dd, byTag("a")).map((a) => attrs(a).href).filter(Boolean) : [],
    });
  }
  return pairs;
}

function parsePlace(main, ldNodes, pageUrl, h1) {
  const slug = new URL(pageUrl).pathname.split("/").pop();
  const placeUrl = `${ORIGIN}/places/${slug}`;
  const placeNodes = ldNodes.filter((n) => (n.url ?? "").replace(/\/+$/u, "") === placeUrl && !ldTypes(n).includes("WebPage") && !ldTypes(n).includes("BreadcrumbList"));
  const sections = {};
  for (const sec of findAll(main, byClass("section", "guide-section"))) {
    const h2 = find(sec, byTag("h2"));
    if (!h2) continue;
    const heading = text(h2);
    sections[heading] = text(sec, { exclude: (n) => n === h2 });
  }
  const blocks = {};
  for (const qb of findAll(main, byClass(null, "quick-block"))) {
    const h2 = find(qb, byTag("h2"));
    const heading = h2 ? text(h2) : "(untitled)";
    const dl = find(qb, byTag("dl"));
    blocks[heading] = {
      pairs: dl ? dlPairs(dl) : [],
      buttons: findAll(qb, byTag("a")).filter((a) => classes(a).has("button-primary")).map((a) => ({ text: text(a), href: attrs(a).href })),
      text: text(qb, { exclude: (n) => n === h2 }).slice(0, 2000),
    };
  }
  const gateway = find(main, byClass("section", "action-gateway"));
  const actions = gateway
    ? findAll(gateway, (n) => n.tagName === "a" && classes(n).has("action-link")).map((a) => ({
        label: text(find(a, byClass("span", "action-link-label")) ?? a),
        disclosure: text(find(a, byClass("span", "action-link-disclosure")) ?? { childNodes: [] }),
        href: attrs(a).href ?? null,
        primary: classes(a).has("action-link-primary"),
      }))
    : [];
  const menus = findAll(main, (n) => n.tagName === "div" && classes(n).has("structured-menu")).map((m) => {
    const source = text(find(m, byClass("p", "structured-menu-source")) ?? { childNodes: [] });
    return {
      eyebrow: text(find(m, byClass("p", "structured-menu-eyebrow")) ?? { childNodes: [] }),
      source,
      currentUntil: (source.match(/current until ([A-Z][a-z]{2} \d{1,2}, \d{4})/) ?? [])[1] ?? null,
      pricesAsOf: (source.match(/prices as of ([A-Z][a-z]{2} \d{1,2}, \d{4})/) ?? [])[1] ?? null,
      sections: findAll(m, (n) => n.tagName === "details" && classes(n).has("structured-menu-section")).length,
      items: findAll(m, (n) => n.tagName === "details" && classes(n).has("structured-menu-item")).length,
      prices: findAll(m, byClass("span", "structured-menu-price")).map((p) => text(p)),
      sourceLinks: findAll(m, byTag("a")).map((a) => attrs(a).href).filter(Boolean),
    };
  });
  const verification = find(main, byClass("p", "verification-note"));
  const kicker = find(main, byClass("p", "venue-masthead-kicker"));
  const masthead = find(main, byClass("header", "venue-masthead"));
  const pn = placeNodes[0] ?? null;
  return {
    slug,
    name: text(h1),
    kicker: kicker ? text(kicker) : null,
    sponsoredLabel: Boolean(kicker && find(kicker, byClass("span", "sponsored-label"))),
    verdict: text(find(main, byClass("p", "venue-masthead-verdict")) ?? { childNodes: [] }) || null,
    hasPhoto: masthead ? classes(masthead).has("has-photo") : null,
    photoSrc: masthead ? attrs(find(masthead, byTag("img")) ?? { attrs: [] }).src ?? null : null,
    sections,
    blocks,
    actions,
    menus,
    lastChecked: verification ? (text(verification).match(/(\d{4}-\d{2}-\d{2})/) ?? [])[1] ?? null : null,
    verificationText: verification ? text(verification) : null,
    breadcrumbs: (() => {
      const nav = find(main, (n) => n.tagName === "nav" && classes(n).has("breadcrumbs"));
      return nav ? findAll(nav, byTag("li")).map((li) => text(li)) : [];
    })(),
    ldCount: placeNodes.length,
    ld: pn
      ? {
          type: ldTypes(pn),
          name: pn.name ?? null,
          description: pn.description ?? null,
          dateModified: pn.dateModified ?? null,
          streetAddress: pn.address?.streetAddress ?? null,
          addressLocality: pn.address?.addressLocality ?? null,
          telephone: pn.telephone ?? null,
          geo: pn.geo ? { lat: pn.geo.latitude, lng: pn.geo.longitude } : null,
          openingHours: pn.openingHours ?? null,
          openingHoursSpecification: pn.openingHoursSpecification ?? null,
          priceRange: pn.priceRange ?? null,
          sameAs: [].concat(pn.sameAs ?? []),
          image: pn.image ?? null,
          hasMap: pn.hasMap ?? null,
          containedInPlace: pn.containedInPlace?.name ?? null,
          keys: Object.keys(pn).sort(),
        }
      : null,
  };
}

// ---------------------------------------------------------------- CLI

async function main() {
  const args = process.argv.slice(2);
  const val = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
  const crawlDir = resolve(val("--crawl", "./crawl-out"));
  const outFile = resolve(val("--out", join(crawlDir, "parsed.jsonl")));
  loadParse5();
  const lines = (await readFile(join(crawlDir, "pages.jsonl"), "utf8")).split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const out = [];
  let parsed = 0;
  let failed = 0;
  for (const rec of lines) {
    const ct = rec.headers?.["content-type"] ?? "";
    if (!rec.raw || !/html/i.test(ct)) continue;
    try {
      const html = gunzipSync(await readFile(join(crawlDir, rec.raw))).toString("utf8");
      const page = parsePage(html, rec.finalUrl ?? rec.url);
      out.push(JSON.stringify({ requestUrl: rec.url, recordTag: rec.recordTag, status: rec.status, ...page }));
      parsed += 1;
    } catch (error) {
      failed += 1;
      out.push(JSON.stringify({ requestUrl: rec.url, recordTag: rec.recordTag, status: rec.status, parseError: String(error.message) }));
    }
  }
  await writeFile(outFile, out.join("\n") + "\n");
  console.log(JSON.stringify({ parsed, failed, outFile }));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
