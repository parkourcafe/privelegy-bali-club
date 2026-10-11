#!/usr/bin/env node
// Runs the Stage A check catalogue over crawl.mjs + parse.mjs + outbound.mjs output.
//
//   node checks.mjs --crawl <crawl-out> --parsed <parsed.jsonl> --outbound <outbound.jsonl> --out <dir>
//
// Writes pages.csv, places.csv, instances.csv, outbound.csv, dupes.csv and
// stats.json. Every instance row is one (check × URL × field) observation; the
// report counts only from instances.csv. Severity follows docs/AUDIT_GENERAL_TZ.md;
// "cand." rows are leads for Stage B, not assertions.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { spawnSync } from "node:child_process";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { publishableStreetAddress } from "../../../../lib/venue-presentation.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../../../..");
const ORIGIN = "https://www.otherbali.com";
const TODAY = "2026-09-28";

const args = process.argv.slice(2);
const val = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const CRAWL = resolve(val("--crawl", "crawl-out"));
const PARSED = resolve(val("--parsed", join(CRAWL, "parsed.jsonl")));
const OUTBOUND = resolve(val("--outbound", join(CRAWL, "outbound.jsonl")));
const OUT = resolve(val("--out", "."));

const readJsonl = async (f) => (await readFile(f, "utf8")).split("\n").filter(Boolean).map((l) => JSON.parse(l));
const csvCell = (v) => {
  if (v === null || v === undefined) return "";
  const s = typeof v === "string" ? v : Array.isArray(v) ? v.join("; ") : typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toCsv = (header, rows, preamble) =>
  `${preamble ? `# ${preamble}\n` : ""}${header.join(",")}\n${rows.map((r) => header.map((h) => csvCell(r[h])).join(",")).join("\n")}\n`;

const norm = (s) => (s ?? "").normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const pathOf = (url) => {
  try {
    const u = new URL(url);
    let p = u.pathname;
    if (p !== "/") p = p.replace(/\/+$/u, "");
    return p + u.search;
  } catch {
    return url;
  }
};

const instances = [];
function hit(check, severity, { url = null, slug = null, field = null, observed = null, rule, reproduce = null, reference = null, evidence = "посчитано" }) {
  instances.push({ check, severity, url, slug, field, observed: typeof observed === "string" ? observed.slice(0, 400) : observed, rule, evidence, reproduce, reference, measured_at: TODAY, recheck: "" });
}

// ---------------------------------------------------------------- load

const crawlRecords = await readJsonl(join(CRAWL, "pages.jsonl"));
const sitemaps = JSON.parse(await readFile(join(CRAWL, "sitemaps.json"), "utf8"));
const tags = JSON.parse(await readFile(join(CRAWL, "tags.json"), "utf8"));
const parsedAll = await readJsonl(PARSED);
let outbound = [];
try {
  outbound = await readJsonl(OUTBOUND);
} catch {
  outbound = [];
}

const primary = crawlRecords.filter((r) => !r.recordTag);
const recByUrl = new Map(primary.map((r) => [r.url, r]));
const statusByPath = new Map();
for (const r of primary) {
  statusByPath.set(pathOf(r.url), r.status);
  if (r.finalUrl) statusByPath.set(pathOf(r.finalUrl), r.status);
}
const parsed = parsedAll.filter((p) => !p.recordTag);
const parsedByUrl = new Map(parsed.map((p) => [p.requestUrl, p]));
const sitemapUrls = new Set(Object.values(sitemaps).flatMap((s) => s.locations));
const sitemapLastmod = Object.assign({}, ...Object.values(sitemaps).map((s) => s.lastmod));

// ---------------------------------------------------------------- T1–T3, T9, T10: technical

const htmlRecords = primary.filter((r) => /html/i.test(r.headers?.["content-type"] ?? ""));
let fiveXX = 0;
for (const url of sitemapUrls) {
  const r = recByUrl.get(url);
  if (!r) {
    hit("T1", "P1", { url, field: "status", observed: "не запрошен", rule: "URL из sitemap должен отдавать 200" });
    continue;
  }
  if (r.status >= 500 || r.status === 0) fiveXX += 1;
  if (r.status !== 200) {
    hit("T1", "P1", { url, field: "status", observed: `${r.status}${r.error ? ` ${r.error}` : ""} после ${r.attempts} попыток`, rule: "URL из sitemap должен отдавать 200", reproduce: `curl -sI ${url}` });
  }
  if (r.chain?.length) {
    hit("T2", "P2", { url, field: "redirect", observed: r.chain.map((c) => `${c.status}→${c.location}`).join(" "), rule: "URL в sitemap не должен редиректить", reproduce: `curl -sI ${url}` });
  }
  const p = parsedByUrl.get(url);
  if (!p || r.status !== 200) continue;
  const xr = r.headers?.["x-robots-tag"] ?? "";
  if (/noindex/i.test(p.robotsMeta ?? "") || /noindex/i.test(xr)) {
    hit("T2", "P1", { url, field: "robots", observed: `${p.robotsMeta ?? ""} ${xr}`.trim(), rule: "URL в sitemap не должен быть noindex", reproduce: `curl -s ${url} | grep -io 'name="robots"[^>]*'` });
  }
  const canon = p.canonicals ?? [];
  if (canon.length !== 1 || pathOf(canon[0]) !== pathOf(r.finalUrl ?? url) || !canon[0].startsWith(ORIGIN)) {
    const staticPage = (r.headers?.["x-matched-path"] ?? "").endsWith(".html") || canon.length === 0;
    hit("T2", staticPage ? "P2" : "P1", { url, field: "canonical", observed: canon.join(" | ") || "нет", rule: "ровно один self-canonical на https://www.otherbali.com", reproduce: `curl -s ${url} | grep -o 'rel="canonical"[^>]*'` });
  }
}
if (sitemapUrls.size && fiveXX / sitemapUrls.size > 0.05) {
  hit("T1", "P0", { field: "status", observed: `${fiveXX} из ${sitemapUrls.size}`, rule: ">5% URL sitemap отдают 5xx/сбой" });
}

for (const p of parsed) {
  if (p.status !== 200) continue;
  if ((p.h1 ?? []).some((h) => /not found|didn.t load|does ?n.t exist|no longer available|route not found/i.test(h))) {
    hit("T3", "P1", { url: p.requestUrl, field: "h1", observed: p.h1.join(" | "), rule: "страница-ошибка отдаёт 200 (soft-404)", reproduce: `curl -sI ${p.requestUrl}` });
  }
}

// T9 deploy drift
const noStore = htmlRecords.filter((r) => r.status === 200 && /no-store/i.test(r.headers?.["cache-control"] ?? ""));
const cacheable = htmlRecords.filter((r) => r.status === 200 && /s-maxage|public/i.test(r.headers?.["cache-control"] ?? "") && !/no-store/i.test(r.headers?.["cache-control"] ?? ""));
if (noStore.length) {
  hit("T9", "P2", {
    field: "cache-control",
    observed: `${noStore.length} из ${htmlRecords.filter((r) => r.status === 200).length} HTML-страниц отдают no-store (кешируемых: ${cacheable.length})`,
    rule: "публичные страницы должны кешироваться (исправлено в main PR #309, на прод не выкачено)",
    reference: "PR #309; docs/HANDOFF_2026-09-02.md §1",
    reproduce: "curl -sI https://www.otherbali.com/places/single-fin | grep -i cache-control",
  });
}
for (const p of parsed) {
  if (p.status !== 200) continue;
  if ((p.breadcrumbLd ?? 0) > 1) hit("T9", "P3", { url: p.requestUrl, field: "BreadcrumbList", observed: String(p.breadcrumbLd), rule: "не больше одного BreadcrumbList", reference: "PR #309; handoff 02.09 §4" });
  for (const list of p.itemLists ?? []) {
    const rendered = new Set((p.links ?? []).filter((l) => !l.external && !l.chrome && !l.similar && l.path?.startsWith("/places/")).map((l) => l.path));
    if (list.items > 0 && rendered.size > 0 && list.items !== rendered.size) {
      hit("T9", "P2", { url: p.requestUrl, field: "ItemList", observed: `ItemList ${list.items} vs отрисовано ${rendered.size}`, rule: "ItemList должен совпадать с отрисованным списком", reference: "PR #309" });
    } else if (list.items > 100) {
      hit("T9", "P2", { url: p.requestUrl, field: "ItemList", observed: `ItemList ${list.items} элементов`, rule: "подборка, а не каталог (курированный лимит 30–36)", reference: "PR #309; handoff 02.09 §2" });
    }
  }
}

// T10 weight + TTFB
const ttfbs = htmlRecords.filter((r) => r.status === 200 && r.ttfbMs).map((r) => r.ttfbMs).sort((a, b) => a - b);
const pct = (arr, q) => (arr.length ? arr[Math.min(arr.length - 1, Math.floor(q * arr.length))] : null);
for (const r of htmlRecords) {
  if (r.status === 200 && r.bytes > 500_000) hit("T10", "P2", { url: r.url, field: "html bytes", observed: String(r.bytes), rule: "HTML > 500 КБ" });
}

// ---------------------------------------------------------------- T4 titles/descriptions

const indexable = parsed.filter((p) => p.status === 200 && sitemapUrls.has(p.requestUrl));
const titleGroups = new Map();
const descGroups = new Map();
for (const p of indexable) {
  if (!p.title) hit("T4", "P2", { url: p.requestUrl, field: "title", observed: "нет", rule: "title обязателен" });
  if (!p.metaDescription) hit("T4", "P2", { url: p.requestUrl, field: "description", observed: "нет", rule: "meta description обязателен" });
  const bare = (p.title ?? "").replace(/\s*·\s*Other Bali$/, "");
  if ((p.title ?? "").length > 60) hit("T4", "P3", { url: p.requestUrl, field: "title", observed: `${p.title.length}: ${p.title}`, rule: "title ≤ 60 символов (WARN стандарта)" });
  if (p.title) titleGroups.set(p.title, [...(titleGroups.get(p.title) ?? []), p.requestUrl]);
  if (p.metaDescription) descGroups.set(p.metaDescription, [...(descGroups.get(p.metaDescription) ?? []), p.requestUrl]);
  if (p.place && p.metaDescription && p.place.verdict) {
    const d = p.metaDescription.trim();
    const v = p.place.verdict.trim();
    if (v.length > d.length && v.startsWith(d) && !/[.!?…]$/.test(d)) {
      hit("T4", "P3", { url: p.requestUrl, slug: p.place.slug, field: "description", observed: `…${d.slice(-40)}`, rule: "описание обрезано посреди слова/фразы", reference: "PR #311 (черновик) — исправление в работе", reproduce: `curl -s ${p.requestUrl} | grep -o 'name="description"[^>]*'` });
    }
  }
  void bare;
}
for (const [title, urls] of titleGroups) if (urls.length > 1) hit("T4", "P2", { url: urls.join(" | "), field: "title", observed: title, rule: "дубль title у разных URL" });
for (const [desc, urls] of descGroups) if (urls.length > 1) hit("T4", "P2", { url: urls.slice(0, 6).join(" | ") + (urls.length > 6 ? ` (+${urls.length - 6})` : ""), field: "description", observed: `${urls.length} URL: ${desc}`, rule: "дубль meta description у разных URL" });

// ---------------------------------------------------------------- T5–T8 markup

const BALI = { lat: [-8.95, -8.05], lng: [114.4, 115.75] };
const DISTRICT_BOX = {
  Canggu: { lat: [-8.69, -8.6], lng: [115.09, 115.18] },
  Ubud: { lat: [-8.58, -8.4], lng: [115.21, 115.32] },
  Uluwatu: { lat: [-8.87, -8.74], lng: [115.03, 115.25] },
};
const decimals = (n) => (String(n).split(".")[1] ?? "").length;
const places = parsed.filter((p) => p.place && p.status === 200 && (tags[p.requestUrl] ?? []).some((t) => t === "sitemap:places"));
const placeBySlug = new Map(places.map((p) => [p.place.slug, p]));

for (const p of parsed) {
  if (p.status !== 200) continue;
  for (const b of p.ld ?? []) {
    if (!b.ok) hit("T5", "P1", { url: p.requestUrl, field: "JSON-LD", observed: b.error, rule: "JSON-LD должен парситься" });
  }
  for (const f of p.forbiddenLd ?? []) {
    const isAvail = f.kind.startsWith("availability");
    hit("T5", "P0", {
      url: p.requestUrl,
      field: f.path,
      observed: f.value ?? f.kind,
      rule: isAvail ? "утверждение о live availability запрещено (AGENTS.md §5, §11)" : "рейтинги/отзывы в разметке запрещены (guardrail #2)",
      reference: isAvail ? "handoff 02.09 §3 (исправлено в main #309, не выкачено)" : "AGENTS.md §4.2",
      reproduce: `curl -s ${p.requestUrl} | grep -o 'schema.org/InStock\\|aggregateRating\\|"review"'`,
    });
  }
}

const geoPoints = new Map();
const phones = new Map();
for (const p of places) {
  const pl = p.place;
  const ld = pl.ld;
  const where = pl.blocks?.Practical?.pairs?.find((x) => x.label === "Where")?.value ?? null;
  if (ld?.streetAddress && !publishableStreetAddress(ld.streetAddress)) {
    hit("T6", "P1", { url: p.requestUrl, slug: pl.slug, field: "ld.streetAddress", observed: ld.streetAddress, rule: "streetAddress не проходит publishableStreetAddress" });
  }
  if (where && /\b(verify|verified|tbc|todo|check|confirm|boundary|approx)\b/i.test(where)) {
    hit("T6", "P1", { url: p.requestUrl, slug: pl.slug, field: "Practical.Where", observed: where, rule: "служебная заметка оператора в видимом адресе" });
  }
  if (ld?.geo && ld.geo.lat !== undefined) {
    const lat = Number(ld.geo.lat);
    const lng = Number(ld.geo.lng);
    if (!(lat >= BALI.lat[0] && lat <= BALI.lat[1] && lng >= BALI.lng[0] && lng <= BALI.lng[1])) {
      hit("T7", "P1", { url: p.requestUrl, slug: pl.slug, field: "geo", observed: `${lat},${lng}`, rule: "координаты вне Бали" });
    } else {
      const box = DISTRICT_BOX[ld.containedInPlace ?? ""];
      if (box && !(lat >= box.lat[0] && lat <= box.lat[1] && lng >= box.lng[0] && lng <= box.lng[1])) {
        hit("T7", "P2", { url: p.requestUrl, slug: pl.slug, field: "geo", observed: `${lat},${lng} (${ld.containedInPlace})`, rule: "координаты вне рамки района, указанного на карточке (acceptance-rules.md) — неверный район или неверная точка", evidence: "посчитано; канд." });
      }
    }
    if (decimals(ld.geo.lat) < 5 || decimals(ld.geo.lng) < 5) {
      hit("T7", "P3", { url: p.requestUrl, slug: pl.slug, field: "geo", observed: `${ld.geo.lat},${ld.geo.lng}`, rule: "точность координат < 5 знаков (центр района, а не место)" });
    }
    const key = `${Number(lat).toFixed(5)},${Number(lng).toFixed(5)}`;
    geoPoints.set(key, [...(geoPoints.get(key) ?? []), pl.slug]);
  }
  if (ld?.telephone) {
    const t = String(ld.telephone).replace(/[\s()-]/g, "");
    if (!/^\+62\d{7,13}$/.test(t)) hit("T7", "P3", { url: p.requestUrl, slug: pl.slug, field: "telephone", observed: ld.telephone, rule: "телефон не в формате +62" });
    const key = t.replace(/^\+?62|^0/, "");
    phones.set(key, [...(phones.get(key) ?? []), pl.slug]);
  }
  // T8 implausible hours (candidate)
  const spec = Array.isArray(ld?.openingHoursSpecification) ? ld.openingHoursSpecification : ld?.openingHoursSpecification ? [ld.openingHoursSpecification] : [];
  const type = (ld?.type ?? []).join(",");
  const reasons = new Set();
  for (const s of spec) {
    const o = s.opens ?? "";
    const c = s.closes ?? "";
    if (o === "14:00" && c === "23:59") reasons.add("14:00–23:59 (похоже на заселение отеля)");
    if (o === "00:00" && (c === "23:59" || c === "24:00")) reasons.add("круглосуточно");
    if (/CafeOrCoffeeShop/.test(type) && (o < "05:00" || (c < "14:00" && c > o))) reasons.add(`кафе ${o}–${c}`);
    if (/HealthAndBeauty/.test(type) && o >= "14:00") reasons.add(`спа открывается ${o}`);
  }
  for (const reason of reasons) hit("T8", "P2", { url: p.requestUrl, slug: pl.slug, field: "openingHoursSpecification", observed: reason, rule: "неправдоподобные часы для категории", evidence: "посчитано; канд." });
}
for (const [key, slugs] of geoPoints) if (new Set(slugs).size > 1) hit("T7", "P2", { slug: slugs.join(" | "), field: "geo", observed: key, rule: "одна точка у нескольких мест" });
for (const [key, slugs] of phones) {
  const names = new Set(slugs.map((s) => norm(placeBySlug.get(s)?.place.name).split(" ")[0]));
  if (new Set(slugs).size > 1 && names.size > 1) hit("T7", "P2", { slug: slugs.join(" | "), field: "telephone", observed: `+62${key}`, rule: "один телефон у разных брендов/филиалов" });
}

// ---------------------------------------------------------------- G1–G6 guardrails & text

const RATING = /\b[1-5][.,]\d\s*(?:★|\/\s*5\b|out of 5\b|stars?\b)|\b[1-5]\s*★|\b[1-5](?:[.,]\d)?\s*out of 5\b|google (?:rating|reviews?)\b|\b\d{2,}(?:,\d{3})*\s+(?:google\s+)?reviews\b|\brated\s+[1-5](?:[.,]\d)?\b/gi;
const AGGREGATOR = /\b(tripadvisor|wanderlog|happycow|zomato|yelp|foursquare)\b/gi;
const REVIEW_DERIVED = /\b(highly[- ]rated|top[- ]rated|well[- ]reviewed|well[- ]regarded|reviewers|guests rave|rave reviews|five[- ]star reviews|cult following)\b/i;
const QUALITY_WARN = /\b(slow service|rude|dirty|overpriced|poor service|mediocre|disappointing|unhygienic|unfriendly|not worth|bad food)\b/i;
const HYPE = /\b(stunning|hidden gem|must-visit|world-class|nestled|vibrant|unforgettable|iconic|breathtaking)\b/gi;
const INTERNAL = ["Media pending", "verified details below", "verified details only", "Approved venue photo", "Supabase Storage media library", "Internal review"];
const PLACEHOLDER = /\b(TODO|TBD|lorem ipsum|\[object Object\]|NaN|undefined)\b/;

for (const p of parsed) {
  if (p.status !== 200 || !p.authoredText) continue;
  const t = p.authoredText;
  const m1 = positiveMatches(t, RATING)[0];
  if (m1) hit("G1", "P0", { url: p.requestUrl, slug: p.place?.slug ?? null, field: "text", observed: around(t, m1.index), rule: "рейтинг/число отзывов в публичном тексте (guardrail #2)", evidence: "посчитано; нужен ручной разбор" });
  const agg = positiveMatches(t, AGGREGATOR)[0];
  if (agg) hit("G1", "P1", { url: p.requestUrl, slug: p.place?.slug ?? null, field: "text", observed: around(t, agg.index), rule: "агрегатор отзывов назван источником факта в публичном тексте (AGENTS.md §13; guardrail #2)", evidence: "посчитано; нужен ручной разбор" });
  const m2 = t.match(REVIEW_DERIVED);
  if (m2 && !negated(t, m2.index)) hit("G1", "P1", { url: p.requestUrl, slug: p.place?.slug ?? null, field: "text", observed: around(t, m2.index), rule: "формулировка, выведенная из отзывов (guardrail #2)", evidence: "посчитано; нужен ручной разбор" });
  // Labels only (capitalised badge words); sentences about "paid placement" are policy statements.
  const spons = positiveMatches(t, /\b(Sponsored|Promoted|Advertorial|Featured partner|Paid partner)\b/g)[0];
  if (p.place?.sponsoredLabel || spons) {
    hit("G2", "P0", { url: p.requestUrl, slug: p.place?.slug ?? null, field: "label", observed: spons ? around(t, spons.index) : "span.sponsored-label", rule: "платная видимость запрещена (guardrail #7)", evidence: "посчитано; нужен ручной разбор" });
  }
  for (const label of INTERNAL) if (t.includes(label)) hit("G4", "P2", { url: p.requestUrl, field: "text", observed: label, rule: "служебная метка на публичной странице" });
  const ph = t.match(PLACEHOLDER);
  if (ph) hit("G4", "P2", { url: p.requestUrl, slug: p.place?.slug ?? null, field: "text", observed: around(t, ph.index), rule: "заглушка/служебный токен в тексте", evidence: "посчитано; нужен ручной разбор" });
  const hype = [...new Set((t.match(HYPE) ?? []).map((w) => w.toLowerCase()))];
  if (hype.length) hit("G6", "P3", { url: p.requestUrl, slug: p.place?.slug ?? null, field: "text", observed: hype.join(", "), rule: "рекламные слова в нашем тексте (без навигации и общих карточек)" });
}
function negated(t, i) {
  return /\b(not|no|never|without|nor|don't|doesn't|do not|does not|isn't|is not|we do not|rather than|instead of|separate from)\b[^.]{0,40}$/i.test(t.slice(Math.max(0, i - 60), i));
}
function formLabel(t, i, len) {
  return /^\s*\((optional|required)/i.test(t.slice(i + len, i + len + 14));
}
function positiveMatches(t, re) {
  const out = [];
  for (const m of t.matchAll(re)) if (!negated(t, m.index) && !formLabel(t, m.index, m[0].length)) out.push(m);
  return out;
}
function around(t, i) {
  return `…${t.slice(Math.max(0, i - 60), i + 80)}…`;
}

for (const p of places) {
  const pl = p.place;
  const notFor = pl.blocks?.["Quick decision"]?.pairs?.find((x) => x.label === "Not for")?.value ?? "";
  const m = notFor.match(QUALITY_WARN);
  if (m) hit("G3", "P1", { url: p.requestUrl, slug: pl.slug, field: "Not for", observed: notFor, rule: "качественное предупреждение вместо fit-контекста (guardrail #9)", evidence: "посчитано; нужен ручной разбор" });
  if (pl.photoSrc && decodeURIComponent(pl.photoSrc).includes("/draft/")) {
    hit("G4", "P3", { url: p.requestUrl, slug: pl.slug, field: "photo", observed: "venue-photos/draft/…", rule: "публичное фото отдаётся из папки draft" });
  }
}

// G5 placeholders / boilerplate
const field = (pl, label) => pl.blocks?.["Quick decision"]?.pairs?.find((x) => x.label === label)?.value ?? null;
const bestForGroups = new Map();
const verdictGroups = new Map();
for (const p of places) {
  const pl = p.place;
  const bf = field(pl, "Best for");
  if (bf) bestForGroups.set(norm(bf), [...(bestForGroups.get(norm(bf)) ?? []), pl]);
  if (pl.verdict) verdictGroups.set(norm(pl.verdict), [...(verdictGroups.get(norm(pl.verdict)) ?? []), pl]);
  if (pl.verdict && pl.verdict.length < 25) hit("G5", "P2", { url: p.requestUrl, slug: pl.slug, field: "verdict", observed: pl.verdict, rule: "вердикт короче 25 символов" });
  if (bf && bf.length < 12) hit("G5", "P2", { url: p.requestUrl, slug: pl.slug, field: "Best for", observed: bf, rule: "Best for короче 12 символов" });
}
const brands = (list) => new Set(list.map((pl) => norm(pl.name).split(" ").slice(0, 2).join(" ")));
for (const [, list] of bestForGroups) {
  if (list.length >= 3 && brands(list).size >= 3) hit("G5", "P2", { slug: list.map((x) => x.slug).join(" | "), field: "Best for", observed: `${list.length} мест: ${list[0].blocks["Quick decision"].pairs.find((x) => x.label === "Best for").value}`, rule: "одинаковый Best for у 3+ разных брендов (шаблон)" });
}
for (const [, list] of verdictGroups) {
  if (list.length >= 3 && brands(list).size >= 3) hit("G5", "P2", { slug: list.map((x) => x.slug).join(" | "), field: "verdict", observed: `${list.length} мест: ${list[0].verdict}`, rule: "одинаковый вердикт у 3+ разных брендов (шаблон)" });
}
// near-duplicate verdict clusters (5-gram word shingles, Jaccard >= 0.8)
const shingles = (s) => {
  const w = norm(s).split(" ").filter(Boolean);
  const out = new Set();
  for (let i = 0; i + 5 <= w.length; i += 1) out.add(w.slice(i, i + 5).join(" "));
  return out;
};
const withSh = places.filter((p) => p.place.verdict).map((p) => ({ p, sh: shingles(p.place.verdict) })).filter((x) => x.sh.size >= 3);
const parent = withSh.map((_, i) => i);
const findRoot = (i) => (parent[i] === i ? i : (parent[i] = findRoot(parent[i])));
for (let i = 0; i < withSh.length; i += 1) {
  for (let j = i + 1; j < withSh.length; j += 1) {
    const a = withSh[i].sh;
    const b = withSh[j].sh;
    let inter = 0;
    for (const x of a) if (b.has(x)) inter += 1;
    if (inter === 0) continue;
    const jac = inter / (a.size + b.size - inter);
    if (jac >= 0.8 && norm(withSh[i].p.place.verdict) !== norm(withSh[j].p.place.verdict)) parent[findRoot(i)] = findRoot(j);
  }
}
const clusters = new Map();
withSh.forEach((x, i) => clusters.set(findRoot(i), [...(clusters.get(findRoot(i)) ?? []), x.p.place]));
for (const list of clusters.values()) {
  if (list.length >= 5) hit("G5", "P2", { slug: list.map((x) => x.slug).join(" | "), field: "verdict", observed: `${list.length} почти одинаковых вердиктов, пример: ${list[0].verdict}`, rule: "кластер похожих вердиктов (Jaccard 5-грамм ≥ 0.8)" });
}

// ---------------------------------------------------------------- G7–G9 data completeness, freshness, menus

const districtOf = (pl) => pl.ld?.containedInPlace ?? (pl.breadcrumbs?.[1] && pl.breadcrumbs[1] !== "Places" ? pl.breadcrumbs[1] : "(не указан)");
const completeness = {};
const dateCounts = {};
for (const p of places) {
  const pl = p.place;
  const d = districtOf(pl);
  const c = (completeness[d] ??= { places: 0, why: 0, bestFor: 0, notFor: 0, priceDigits: 0, hours: 0, streetAddress: 0, website: 0, lastChecked: 0, telephone: 0, geo: 0, photo: 0, menu: 0 });
  c.places += 1;
  const practical = pl.blocks?.Practical?.pairs ?? [];
  const spend = practical.find((x) => x.label === "Spend")?.value ?? "";
  if (pl.sections?.["Why it's here"] || field(pl, "Why go") || pl.verdict) c.why += 1;
  if (field(pl, "Best for")) c.bestFor += 1;
  if (field(pl, "Not for")) c.notFor += 1;
  if (/\d/.test(spend)) c.priceDigits += 1;
  if (practical.find((x) => x.label === "Hours") || pl.ld?.openingHours) c.hours += 1;
  if (pl.ld?.streetAddress) c.streetAddress += 1;
  if (practical.find((x) => x.label === "Website")) c.website += 1;
  if (pl.lastChecked) c.lastChecked += 1;
  if (pl.ld?.telephone) c.telephone += 1;
  if (pl.ld?.geo) c.geo += 1;
  if (pl.hasPhoto) c.photo += 1;
  if ((pl.menus ?? []).length) c.menu += 1;
  if (pl.lastChecked) dateCounts[pl.lastChecked] = (dateCounts[pl.lastChecked] ?? 0) + 1;
  if (!pl.lastChecked) hit("G8", "P3", { url: p.requestUrl, slug: pl.slug, field: "last checked", observed: "нет даты", rule: "у карточки нет даты последней проверки" });
  else {
    const age = (Date.parse(TODAY) - Date.parse(pl.lastChecked)) / 86_400_000;
    if (age > 180) hit("G8", "P2", { url: p.requestUrl, slug: pl.slug, field: "last checked", observed: pl.lastChecked, rule: "проверка старше 180 дней" });
    else if (age > 90) hit("G8", "P3", { url: p.requestUrl, slug: pl.slug, field: "last checked", observed: pl.lastChecked, rule: "проверка 90–180 дней назад" });
  }
  const lm = sitemapLastmod[p.requestUrl];
  if (lm && pl.lastChecked && lm.slice(0, 10) !== pl.lastChecked) {
    hit("G8", "P3", { url: p.requestUrl, slug: pl.slug, field: "lastmod vs last checked", observed: `sitemap ${lm.slice(0, 10)} ≠ страница ${pl.lastChecked}`, rule: "дата в sitemap не совпадает с видимой датой проверки" });
  }
  for (const m of pl.menus ?? []) {
    if (!m.currentUntil) continue;
    const until = Date.parse(m.currentUntil);
    const days = (until - Date.parse(TODAY)) / 86_400_000;
    if (days < 0) hit("G9", "P1", { url: p.requestUrl, slug: pl.slug, field: "menu", observed: `current until ${m.currentUntil}`, rule: "меню показано как актуальное после срока (AGENTS.md §10)" });
    else if (days <= 7) hit("G9", "P2", { url: p.requestUrl, slug: pl.slug, field: "menu", observed: `current until ${m.currentUntil} (через ${Math.round(days)} дн.)`, rule: "срок актуальности меню истекает в ближайшие 7 дней" });
  }
}
const massStamps = Object.entries(dateCounts).filter(([, n]) => n >= 50).sort((a, b) => b[1] - a[1]);
for (const [date, n] of massStamps) hit("G8", "P3", { field: "last checked", observed: `${date}: ${n} карточек`, rule: "одна дата проверки у ≥50 карточек — похоже на массовый штамп, а не на проверку по месту" });

// G7 — the sitemap gate in main (lib/publication.ts) requires non-empty why_its_here AND best_for.
// Count sitemap cards where the rendered card shows no Best for / no verdict.
const noBestFor = places.filter((p) => !field(p.place, "Best for"));
const noVerdict = places.filter((p) => !p.place.verdict);
for (const p of noBestFor) hit("G7", "P3", { url: p.requestUrl, slug: p.place.slug, field: "Best for", observed: "нет на карточке", rule: "карточка в sitemap без Best for" });
for (const p of noVerdict) hit("G7", "P3", { url: p.requestUrl, slug: p.place.slug, field: "verdict", observed: "нет на карточке", rule: "карточка в sitemap без вердикта/why_its_here" });
if (noBestFor.length) hit("G7", "P1", { field: "Best for", observed: `${noBestFor.length} из ${places.length} карточек в sitemap/places без видимого Best for (по районам: ${Object.entries(noBestFor.reduce((a, p) => ((a[districtOf(p.place)] = (a[districtOf(p.place)] ?? 0) + 1), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([d, n]) => `${d} ${n}`).join(", ")})`, rule: "гейт индексируемости требует непустой best_for (lib/publication.ts:34-70) — на проде он не срабатывает или поле заполнено значением, которое не отрисовывается", reference: "docs/HANDOFF_2026-09-02.md §6, §9.1 (открытый вопрос)", evidence: "посчитано", reproduce: "curl -s https://www.otherbali.com/places/sisi-gege-restaurant-at-pramana-zahill | grep -c 'Best for'" });
if (noVerdict.length) hit("G7", "P2", { field: "verdict", observed: `${noVerdict.length} карточек без вердикта (why_its_here)`, rule: "гейт требует непустой why_its_here", reference: "lib/publication.ts" });
const TEMPLATE_VERDICT = /^(Restaurant|Cafe|Café|Bar|Spa|Warung|Hotel|Villa|Yoga studio|Gym|Beach club|Bakery|Coffee shop)\b[^.]{0,80}\b(on|in|at) (Jl\.?|Jalan|Gang|Banjar)/i;
const templated = places.filter((p) => p.place.verdict && TEMPLATE_VERDICT.test(p.place.verdict));
if (templated.length) hit("G5", "P2", { field: "verdict", observed: `${templated.length} вердиктов по шаблону «<Категория> on Jl. … in <район>[, open daily …]»; примеры: ${templated.slice(0, 3).map((p) => p.place.slug).join(", ")}`, rule: "сгенерированный шаблонный вердикт вместо редакционного (guardrail: no bulk-generated descriptions — acceptance-rules.md)", evidence: "посчитано" });
for (const p of templated) hit("G5", "P3", { url: p.requestUrl, slug: p.place.slug, field: "verdict", observed: p.place.verdict, rule: "шаблонный вердикт" });

// ---------------------------------------------------------------- D1 duplicates

const dupKeys = { website: new Map(), instagram: new Map(), phone: new Map(), name: new Map() };
const websiteKey = (u) => {
  try {
    const x = new URL(u);
    return `${x.host.replace(/^www\./, "")}${x.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return null;
  }
};
for (const p of places) {
  const pl = p.place;
  const practical = pl.blocks?.Practical?.pairs ?? [];
  const web = practical.find((x) => x.label === "Website")?.links?.[0];
  const ig = practical.find((x) => x.label === "Instagram")?.links?.[0];
  const add = (map, key) => key && map.set(key, [...(map.get(key) ?? []), pl]);
  add(dupKeys.website, web ? websiteKey(web) : null);
  add(dupKeys.instagram, ig ? (ig.match(/instagram\.com\/([^/?#]+)/i)?.[1] ?? "").toLowerCase() || null : null);
  add(dupKeys.phone, pl.ld?.telephone ? String(pl.ld.telephone).replace(/\D/g, "").replace(/^62|^0/, "") : null);
  add(dupKeys.name, norm(pl.name) || null);
}
const dupes = [];
for (const [kind, map] of Object.entries(dupKeys)) {
  for (const [key, list] of map) {
    const slugs = [...new Set(list.map((x) => x.slug))];
    if (slugs.length < 2) continue;
    const districts = [...new Set(list.map(districtOf))];
    const names = [...new Set(list.map((x) => x.name))];
    const AREA = /\b(canggu|berawa|pererenan|seseh|batu bolong|echo beach|tibubeneng|umalas|kerobokan|seminyak|petitenget|legian|kuta|tuban|jimbaran|uluwatu|bukit|pecatu|bingin|padang padang|ungasan|nusa dua|benoa|sanur|renon|denpasar|ubud|penestanan|pengosekan|nyuh kuning|tegallalang|mas|amed|sidemen|munduk|lovina|beach road|shortcut|bali|recovery|yoga|spa|studio|wellness|hotel|resort|restaurant|cafe|bar|kitchen|club)\b/g;
    const core = (n) => norm(n).replace(AREA, " ").replace(/\s+/g, " ").trim();
    const areaTokens = (n) => (norm(n).match(AREA) ?? []).sort().join(",");
    const sameCore = new Set(list.map((x) => core(x.name))).size === 1;
    const branchLikely = names.length > 1 && (districts.length > 1 || (sameCore && new Set(list.map((x) => areaTokens(x.name))).size > 1));
    const compact = list.map((x) => norm(x.name).replace(/\s+/g, ""));
    const shortest = compact.reduce((a, b) => (a.length <= b.length ? a : b));
    const contained = compact.every((c) => c.includes(shortest)) && shortest.length >= 6;
    const strong = !branchLikely && districts.length === 1 && (new Set(compact).size === 1 || contained);
    const note = branchLikely ? "вероятно филиалы (разный район или район в названии)" : strong ? "вероятный дубль: одно название в одном районе" : "общий ключ, разные названия — возможно разные услуги одного объекта (отель: спа/йога/ресторан)";
    dupes.push({ key_type: kind, key, slugs, names, districts, note, strength: strong ? "strong" : branchLikely ? "branch" : "weak" });
    if (strong) hit("D1", "P2", { slug: slugs.join(" | "), field: kind, observed: `${key} → ${names.join(" / ")}`, rule: "одно место под несколькими slug: одинаковое название в одном районе и общий ключ (сайт/Instagram/телефон/имя)", evidence: "посчитано; нужен ручной разбор" });
  }
}

// ---------------------------------------------------------------- O1 outbound

// A short link resolving to its booking provider, or a file served from a CDN, is not a domain change.
const SHORTLINK_OK = /(^|\.)(cho\.pe|bit\.ly|linktr\.ee|wa\.me|t\.co)$/i;
const CDN_OK = /(squarespace\.com|wixstatic\.com|cloudfront\.net|shopify\.com|myshopify\.com|amazonaws\.com|googleusercontent\.com|canva\.site|webflow\.io|cdn\.)/i;
let retryByUrl = new Map();
try {
  retryByUrl = new Map((await readJsonl(OUTBOUND.replace(/\.jsonl$/, "-retry.jsonl"))).map((r) => [r.url, r]));
} catch {
  retryByUrl = new Map();
}
for (const o of outbound) {
  const refs = (o.refs ?? []).map((r) => `${r.slug}:${r.kind}`).join("; ");
  const retry = retryByUrl.get(o.url);
  let verdict = o.verdict;
  let observed = `${o.verdict} ${o.status ?? ""} ${o.error ?? ""}`.trim();
  if (retry) {
    if (retry.retryStatus >= 200 && retry.retryStatus < 300 && !retry.cf) {
      verdict = "ok_on_retry";
    } else if (retry.cf || [401, 403, 429, 503].includes(retry.retryStatus)) {
      verdict = "not_checked";
      observed += ` → повтор ${retry.retryStatus}${retry.cf ? " (Cloudflare challenge)" : ""}: бот-защита, не проверено`;
    } else {
      observed += ` → повтор ${retry.retryStatus || retry.retryError}`;
    }
  }
  o.finalVerdict = verdict;
  if (verdict === "redirect_other_domain") {
    let toHost = "";
    try {
      toHost = new URL(o.finalUrl).host;
    } catch {
      toHost = "";
    }
    const fromHost = new URL(o.url).host;
    if (SHORTLINK_OK.test(fromHost) || CDN_OK.test(toHost)) {
      o.finalVerdict = "ok";
      continue;
    }
  }
  if (["not_found", "dns_fail", "parked"].includes(verdict)) hit("O1", "P1", { url: o.url, slug: refs, field: "outbound", observed, rule: "ссылка с карточки ведёт в никуда", reproduce: `curl -sIL '${o.url}'` });
  if (verdict === "redirect_other_domain") hit("O1", "P2", { url: o.url, slug: refs, field: "outbound", observed: `→ ${o.finalUrl} (${o.title ?? ""})`, rule: "ссылка уводит на другой домен — ребрендинг/закрытие/чужой сайт?", evidence: "посчитано; нужен ручной разбор" });
  if (verdict === "server_error") hit("O1", "P2", { url: o.url, slug: refs, field: "outbound", observed, rule: "официальный сайт отвечает 5xx дважды (обход + повтор)" });
  if (verdict === "other") hit("O1", "P2", { url: o.url, slug: refs, field: "outbound", observed, rule: "ссылка отдаёт 4xx (часто испорченный URL: закодированный #utm)", reproduce: `curl -sI '${o.url}'` });
}

// ---------------------------------------------------------------- L1 links, orphans, registry, pagination

const inboundAny = new Map();
const inboundEditorial = new Map();
const brokenLinks = new Map(); // target -> sources
for (const p of parsed) {
  if (p.status !== 200) continue;
  const srcPath = pathOf(p.requestUrl);
  for (const l of p.links ?? []) {
    if (l.external || l.invalid || !l.path) continue;
    const target = l.path + (l.search ?? "");
    if (l.path === srcPath) continue;
    if (l.path.startsWith("/places/")) {
      inboundAny.set(l.path, new Set([...(inboundAny.get(l.path) ?? []), srcPath]));
      if (!l.chrome && !l.similar && !srcPath.startsWith("/places/")) inboundEditorial.set(l.path, new Set([...(inboundEditorial.get(l.path) ?? []), srcPath]));
    }
    const st = statusByPath.get(target) ?? statusByPath.get(l.path);
    if (st !== undefined && (st >= 400 || st === 0)) brokenLinks.set(target, new Set([...(brokenLinks.get(target) ?? []), srcPath]));
  }
}
for (const [target, sources] of brokenLinks) {
  const src = [...sources];
  const fromHub = src.some((s) => !s.startsWith("/places"));
  hit("L1", fromHub ? "P1" : "P2", { url: `${ORIGIN}${target}`, field: "internal link", observed: `${statusByPath.get(target)} ← ${src.slice(0, 5).join(", ")}${src.length > 5 ? ` (+${src.length - 5})` : ""}`, rule: "внутренняя ссылка на несуществующую страницу" });
}
for (const url of sitemaps.places?.locations ?? []) {
  const path = pathOf(url);
  const others = [...(inboundAny.get(path) ?? [])].filter((s) => s !== path);
  if (path === "/places") continue;
  if (others.length === 0 && recByUrl.get(url)?.status === 200) hit("L1", "P2", { url, slug: path.split("/").pop(), field: "inbound", observed: "0 входящих ссылок", rule: "место в sitemap, но на него не ссылается ни одна страница (сирота)" });
}
const registry = JSON.parse(await readFile(join(REPO, "docs/seo/os/page-registry.json"), "utf8"));
for (const e of registry.entries) {
  const url = e.pathname === "/" ? ORIGIN : `${ORIGIN}${e.pathname}`;
  if (sitemapUrls.has(url)) continue;
  const r = recByUrl.get(url);
  if (!r) continue;
  if (r.status === 200) {
    const p = parsedByUrl.get(url);
    const noindex = /noindex/i.test(p?.robotsMeta ?? "") || /noindex/i.test(r.headers?.["x-robots-tag"] ?? "");
    if (!noindex) hit("L1", "P2", { url, field: "sitemap", observed: `200, индексируема, была в реестре 21.07 (${e.route_type}), нет в sitemap`, rule: "живая индексируемая страница выпала из sitemap" });
  }
}
// /places pagination coverage
const catalogueLinks = new Set();
for (const p of parsed) {
  if (!/^\/places(\?page=\d+)?$/.test(pathOf(p.requestUrl)) || p.status !== 200) continue;
  for (const l of p.links ?? []) if (!l.external && l.path?.startsWith("/places/")) catalogueLinks.add(l.path);
}
const missingFromCatalogue = (sitemaps.places?.locations ?? []).map(pathOf).filter((x) => x !== "/places" && !catalogueLinks.has(x));
if (missingFromCatalogue.length) hit("L1", "P2", { field: "/places pagination", observed: `${missingFromCatalogue.length} мест из sitemap не видны ни на /places, ни на /places?page=N; примеры: ${missingFromCatalogue.slice(0, 5).join(", ")}`, rule: "каталог должен показывать все опубликованные места", reference: "PR #303 (открыт) — pagination gap" });

// S1 llms.txt
const llms = primary.find((r) => r.url === `${ORIGIN}/llms.txt`);
let llmsLinks = [];
if (llms?.raw) {
  const body = gunzipSync(await readFile(join(CRAWL, llms.raw))).toString("utf8");
  llmsLinks = [...body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
  for (const u of llmsLinks) {
    if (!u.startsWith(ORIGIN)) continue;
    const st = statusByPath.get(pathOf(u));
    if (st !== undefined && st !== 200) hit("S1", "P2", { url: u, field: "llms.txt", observed: String(st), rule: "ссылка из llms.txt не отдаёт 200" });
    if (st === undefined) hit("S1", "P3", { url: u, field: "llms.txt", observed: "не обойдена", rule: "ссылка из llms.txt вне sitemap/обхода" });
  }
}

// ---------------------------------------------------------------- C1 guide-page standard gate

const C1_TARGETS = parsed.filter((p) => p.status === 200 && (/^\/best-[a-z-]+-in-bali$/.test(pathOf(p.requestUrl)) || pathOf(p.requestUrl) === "/where-to-watch-sunset-in-bali" || /^\/(canggu|uluwatu|ubud|sanur|seminyak|nusa-dua|jimbaran)\/[a-z0-9-]+$/.test(pathOf(p.requestUrl))));
const c1Results = [];
const checkPage = join(REPO, ".agents/skills/otherbali-guide-page-standard/scripts/check-page.mjs");
for (const p of C1_TARGETS) {
  const rec = recByUrl.get(p.requestUrl);
  if (!rec?.raw) continue;
  const tmp = join(tmpdir(), `c1-${Buffer.from(p.requestUrl).toString("hex").slice(-40)}.html`);
  await writeFile(tmp, gunzipSync(await readFile(join(CRAWL, rec.raw))));
  const run = spawnSync(process.execPath, [checkPage, "--file", tmp, "--json"], { encoding: "utf8" });
  let res = null;
  try {
    res = JSON.parse(run.stdout);
  } catch {
    res = null;
  }
  if (!res) continue;
  const fails = res.results.filter((r) => !r.ok && r.level === "FAIL");
  for (const f of fails) {
    let falseFail = null;
    if (f.name.includes("last-checked") && /Last checked \d{4}-\d{2}-\d{2}/.test(p.mainText)) falseFail = "ложный FAIL: дата в ISO, а регэксп ждёт «4 August 2026»";
    if (f.name.includes("hype")) {
      const words = String(f.detail).split(/,\s*/);
      const inAuthored = words.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(p.authoredText));
      if (!inAuthored.length) falseFail = "ложный FAIL: слово только в навигации/общих карточках";
    }
    c1Results.push({ url: p.requestUrl, check: f.name, detail: f.detail, falseFail });
    if (!falseFail) hit("C1", "P2", { url: p.requestUrl, field: f.name, observed: f.detail, rule: "стандарт страницы-подборки (check-page.mjs)", reproduce: `node .agents/skills/otherbali-guide-page-standard/scripts/check-page.mjs ${p.requestUrl}` });
  }
}

// ---------------------------------------------------------------- outputs

await mkdir(OUT, { recursive: true });
const pagesRows = primary.map((r) => {
  const p = parsedByUrl.get(r.url);
  const renderedPlaces = p ? new Set((p.links ?? []).filter((l) => !l.external && !l.chrome && !l.similar && l.path?.startsWith("/places/")).map((l) => l.path)).size : "";
  return {
    url: r.url,
    tags: (tags[r.url] ?? []).join(" "),
    status: r.status,
    final_url: r.finalUrl !== r.url ? r.finalUrl : "",
    redirects: (r.chain ?? []).map((c) => c.status).join(">"),
    content_type: r.headers?.["content-type"] ?? "",
    cache_control: r.headers?.["cache-control"] ?? "",
    x_vercel_cache: r.headers?.["x-vercel-cache"] ?? "",
    x_robots_tag: r.headers?.["x-robots-tag"] ?? "",
    ttfb_ms: r.ttfbMs,
    bytes: r.bytes,
    attempts: r.attempts,
    error: r.error ?? "",
    title: p?.title ?? "",
    h1_count: p ? (p.h1 ?? []).length : "",
    canonical: p ? (p.canonicals ?? []).join(" | ") : "",
    robots_meta: p?.robotsMeta ?? "",
    ld_types: p ? Object.keys(p.ldTypeCounts ?? {}).join(" ") : "",
    itemlist_items: p ? (p.itemLists ?? []).map((l) => l.items).join(" ") : "",
    place_links_rendered: renderedPlaces,
    faq_summaries: p?.faqSummaries ?? "",
    parse_error: p?.parseError ?? "",
  };
});
await writeFile(join(OUT, "pages.csv"), toCsv(Object.keys(pagesRows[0]), pagesRows, "одна строка = один запрошенный URL (без повторных контрольных запросов), обход 2026-09-28"));

const placeRows = places.map((p) => {
  const pl = p.place;
  const practical = pl.blocks?.Practical?.pairs ?? [];
  const get = (label) => practical.find((x) => x.label === label);
  return {
    slug: pl.slug,
    url: p.requestUrl,
    name: pl.name,
    district: districtOf(pl),
    kicker: pl.kicker,
    ld_type: (pl.ld?.type ?? []).join(" "),
    verdict: pl.verdict,
    why_its_here: pl.sections?.["Why it's here"] ?? "",
    what_to_expect: pl.sections?.["What to expect"] ?? "",
    best_for: field(pl, "Best for"),
    not_for: field(pl, "Not for"),
    practical_note: field(pl, "Practical note"),
    reservations: field(pl, "Reservations"),
    where: get("Where")?.value ?? "",
    hours_visible: get("Hours")?.value ?? "",
    spend: get("Spend")?.value ?? "",
    good_to_know: get("Good to know")?.value ?? "",
    website: get("Website")?.links?.[0] ?? "",
    instagram: get("Instagram")?.links?.[0] ?? "",
    ld_street_address: pl.ld?.streetAddress ?? "",
    ld_telephone: pl.ld?.telephone ?? "",
    ld_geo: pl.ld?.geo ? `${pl.ld.geo.lat},${pl.ld.geo.lng}` : "",
    ld_opening_hours: pl.ld?.openingHours ?? "",
    ld_price_range: pl.ld?.priceRange ?? "",
    last_checked: pl.lastChecked ?? "",
    sitemap_lastmod: sitemapLastmod[p.requestUrl] ?? "",
    has_photo: pl.hasPhoto,
    menus: (pl.menus ?? []).map((m) => `${m.eyebrow} until ${m.currentUntil ?? "?"}`).join(" | "),
    actions: (pl.actions ?? []).map((a) => a.label).join(" | "),
    inbound_any: [...(inboundAny.get(pathOf(p.requestUrl)) ?? [])].length,
    inbound_editorial: [...(inboundEditorial.get(pathOf(p.requestUrl)) ?? [])].length,
    title: p.title,
    meta_description: p.metaDescription,
  };
});
await writeFile(join(OUT, "places.csv"), toCsv(Object.keys(placeRows[0]), placeRows, "одна строка = одна карточка места из sitemap/places, отдавшая 200 (видимые поля + JSON-LD), 2026-09-28"));

const instHeader = ["check", "severity", "url", "slug", "field", "observed", "rule", "evidence", "reproduce", "reference", "measured_at", "recheck"];
await writeFile(join(OUT, "instances.csv"), toCsv(instHeader, instances, "одна строка = одно наблюдение (проверка × URL × поле); P0..P3 по docs/AUDIT_GENERAL_TZ.md; «канд.» = наводка, не утверждение"));

const outRows = outbound.map((o) => ({ url: o.url, verdict: o.finalVerdict ?? o.verdict, first_verdict: o.verdict, status: o.status ?? "", final_url: o.finalUrl ?? "", error: o.error ?? "", title: o.title ?? "", refs: (o.refs ?? []).map((r) => `${r.slug}:${r.kind}`).join("; "), checked_at: o.checkedAt ?? "" }));
if (outRows.length) await writeFile(join(OUT, "outbound.csv"), toCsv(Object.keys(outRows[0]), outRows, "одна строка = один внешний URL с карточек мест; not_checked = заблокировано/недоступно из среды, не находка"));
if (dupes.length) await writeFile(join(OUT, "dupes.csv"), toCsv(["strength", "key_type", "key", "slugs", "names", "districts", "note"], dupes, "одна строка = один общий ключ у 2+ slug"));
await writeFile(join(OUT, "check-page-results.json"), JSON.stringify(c1Results, null, 2));

const bySev = {};
const byCheck = {};
for (const i of instances) {
  bySev[i.severity] = (bySev[i.severity] ?? 0) + 1;
  byCheck[`${i.check} ${i.severity}`] = (byCheck[`${i.check} ${i.severity}`] ?? 0) + 1;
}
const stats = {
  measured_at: TODAY,
  requests: primary.length,
  sitemapUrls: sitemapUrls.size,
  statusCounts: primary.reduce((a, r) => ((a[r.status] = (a[r.status] ?? 0) + 1), a), {}),
  htmlPages200: htmlRecords.filter((r) => r.status === 200).length,
  noStore: noStore.length,
  cacheable: cacheable.length,
  ttfb: { p50: pct(ttfbs, 0.5), p90: pct(ttfbs, 0.9), p95: pct(ttfbs, 0.95), max: ttfbs.at(-1) ?? null, n: ttfbs.length, edge: [...new Set(htmlRecords.map((r) => (r.headers?.["x-vercel-id"] ?? "").split("::").slice(0, 2).join("::")).filter(Boolean))] },
  places: places.length,
  completeness,
  lastCheckedTop: Object.entries(dateCounts).sort((a, b) => b[1] - a[1]).slice(0, 10),
  outbound: outbound.reduce((a, o) => ((a[o.finalVerdict ?? o.verdict] = (a[o.finalVerdict ?? o.verdict] ?? 0) + 1), a), {}),
  dupes: dupes.length,
  missingFromCatalogue: missingFromCatalogue.length,
  llmsLinks: llmsLinks.length,
  c1: { pages: C1_TARGETS.length, fails: c1Results.length, falseFails: c1Results.filter((r) => r.falseFail).length },
  instancesBySeverity: bySev,
  instancesByCheck: byCheck,
};
await writeFile(join(OUT, "stats.json"), JSON.stringify(stats, null, 2));
console.log(JSON.stringify({ instances: instances.length, bySev, places: places.length }, null, 1));
