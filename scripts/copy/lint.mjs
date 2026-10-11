#!/usr/bin/env node
// Copy lint over every public-copy surface — venue fields from the crawl or a
// DB export CSV, hand-written prose in code, the generated resort F&B pages —
// into one queue the rewrite loop works through. One row per unit in
// queue.csv, counts in summary.json. Patterns live in patterns.mjs; this file
// loads, masks, runs and aggregates.
//
//   node scripts/copy/lint.mjs --places <csv> [--export <csv>] [--code] [--resort]
//        --date YYYY-MM-DD [--out <dir>] [--new] [--allowlist <json>] [--stage-b <csv>]
//   node scripts/copy/lint.mjs --text "<sentence>" --field best_for [--places <csv>] [--new]
//
// The output directory defaults to docs/audits/copy-lint/<--date>. The date is
// never read from the clock, so a baseline re-run lands in the same folder.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { lintText, familyOf, FAMILIES, countWords, stripHtml } from "./patterns.mjs";
import { extractProse, defaultCodeFiles, REPO } from "./extract-code-prose.mjs";

const QUEUE_HEADER = ["unit_id", "surface", "path_or_slug", "field", "district", "text", "codes", "severity", "words", "family", "pinned", "priority"];
const SEVERITY_RANK = { FAIL: 0, WARN: 1, OK: 2 };
const SURFACE_RANK = { db: 0, code: 1, resort: 2 };
// Short fact fragments (table cells, card key/values) are linted only when
// they read as a sentence; prose fields are linted whole.
const FRAGMENT_FIELDS = new Set(["table", "card_kv", "card_meta"]);

// ---------------------------------------------------------------- csv (ported from the audit tools)

export function parseCsv(text) {
  // Full CSV state machine: quoted fields may contain commas, quotes and newlines.
  text = text.replace(/^(#[^\n]*\n)+/, "");
  const records = [];
  let row = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cur);
      cur = "";
      if (!(row.length === 1 && row[0] === "") && !(row.length === 1 && row[0].startsWith("#"))) records.push(row);
      row = [];
    } else cur += ch;
  }
  if (cur !== "" || row.length) {
    row.push(cur);
    records.push(row);
  }
  const header = records[0] ?? [];
  return records.slice(1).map((r) => Object.fromEntries(r.map((v, i) => [header[i], v])));
}

const csvCell = (v) => {
  if (v === null || v === undefined) return "";
  const s = typeof v === "string" ? v : Array.isArray(v) ? v.join(" ") : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toCsv = (header, rows, preamble) => `${preamble ? `# ${preamble}\n` : ""}${header.join(",")}\n${rows.map((r) => header.map((h) => csvCell(r[h])).join(",")).join("\n")}\n`;

export const norm = (s) => (s ?? "").normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// ---------------------------------------------------------------- inputs

const readCsv = async (file) => parseCsv(await readFile(resolve(file), "utf8"));

async function loadPriority(file) {
  try {
    return new Map((await readCsv(file)).map((r) => [r.slug, Number(r.score) || 0]));
  } catch {
    return new Map();
  }
}

// Regex-extracted rather than imported: venues.ts is TypeScript and this lint
// must not depend on a TS loader.
async function loadUluwatuNames(file) {
  try {
    return [...(await readFile(file, "utf8")).matchAll(/displayName:\s*"([^"\n]+)"/g)].map((m) => m[1]);
  } catch {
    return [];
  }
}

export async function loadAllowlist(file) {
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    return Array.isArray(parsed) ? parsed : Array.isArray(parsed.entries) ? parsed.entries : [];
  } catch {
    return [];
  }
}

const splitDishes = (s) => String(s ?? "").split(";").map((d) => d.trim()).filter(Boolean);

// The crawl CSV shows the card's verdict line where the DB has why_its_here.
const placesRow = (r) => ({
  slug: r.slug,
  name: r.name ?? "",
  district: r.district ?? "",
  area: "",
  dishes: [],
  fields: { why_its_here: r.why_its_here || r.verdict || "", what_to_expect: r.what_to_expect ?? "", best_for: r.best_for ?? "", not_for: r.not_for ?? "" },
});

const exportRow = (r) => ({
  slug: r.slug,
  name: r.name ?? "",
  district: r.district ?? "",
  area: r.area ?? "",
  dishes: splitDishes(r.what_to_order),
  fields: { why_its_here: r.why_its_here ?? "", best_for: r.best_for ?? "", not_for: r.not_for ?? "", price_anchor: r.price_anchor ?? "", what_to_order: r.what_to_order ?? "" },
});

export function resortUnits(pages) {
  const out = [];
  const add = (page, path, field, raw) => {
    const text = stripHtml(raw);
    if (!text || (FRAGMENT_FIELDS.has(field) && countWords(text) < 4)) return;
    out.push({ slug: page.slug, path, field, text });
  };
  for (const page of pages) {
    add(page, "title", "title", page.title);
    add(page, "metaTitle", "meta_title", page.metaTitle);
    add(page, "h1", "heading", page.h1);
    add(page, "description", "description", page.description);
    add(page, "sub", "sub", page.sub);
    add(page, "intro", "intro", page.intro);
    add(page, "answer", "answer", page.answer);
    add(page, "callout", "callout", page.callout);
    add(page, "checkedNote", "checked_note", page.checkedNote);
    (page.cards ?? []).forEach((c, i) => {
      add(page, `cards[${i}].h3`, "heading", c.h3);
      add(page, `cards[${i}].meta`, "card_meta", c.meta);
      add(page, `cards[${i}].body`, "card_body", c.body ?? c.text);
      add(page, `cards[${i}].why`, "card_body", c.why);
      (c.kv ?? []).forEach(([k, v], j) => add(page, `cards[${i}].kv[${j}]`, "card_kv", `${k}: ${v}`));
    });
    (page.sections ?? []).forEach((s, i) => {
      add(page, `sections[${i}].heading`, "heading", s.heading ?? s.h2);
      add(page, `sections[${i}].body`, "section_body", s.body ?? s.text ?? s.html);
    });
    (page.faq ?? []).forEach((f, i) => {
      add(page, `faq[${i}].q`, "faq_q", f.q_text ?? f.q);
      add(page, `faq[${i}].a`, "faq_a", f.a_html ?? f.a);
    });
    (page.tableRows ?? []).forEach((row, i) => row.forEach((cell, j) => add(page, `tableRows[${i}][${j}]`, "table", cell)));
  }
  return out;
}

// ---------------------------------------------------------------- units

function lintUnit(base, { names, dishes, areas, allowlist, isNew }) {
  const res = lintText(base.text, { field: base.field, names, dishes, areas, allowlist, isNew, unit: base.unit_id });
  return finishUnit({ ...base, family: familyOf(base.text), fails: res.fails, warns: res.warns, stats: res.stats, words: res.stats.words });
}

function finishUnit(u) {
  u.codes = [...new Set([...u.fails.map((f) => f.code), ...u.warns.map((w) => w.code)])].join(" ");
  u.severity = u.fails.length ? "FAIL" : u.warns.length ? "WARN" : "OK";
  return u;
}

// Exact-duplicate groups per field over the DB surface: the same normalised
// text under two or more slugs. Always reported in summary.json; added to the
// unit as D1 only on a --new run, where a rewrite must not reuse a sentence.
export function exactDuplicates(units) {
  const groups = new Map();
  for (const u of units) {
    if (u.surface !== "db" || !u.text) continue;
    const key = `${u.field}\u0000${norm(u.text)}`;
    groups.set(key, [...(groups.get(key) ?? []), u]);
  }
  return [...groups.values()].filter((list) => new Set(list.map((u) => u.path_or_slug)).size >= 2);
}

export function exactDuplicateOf(text, field, units, { excludeSlug = null } = {}) {
  const key = norm(text);
  return [...new Set(units.filter((u) => u.surface === "db" && u.field === field && u.path_or_slug !== excludeSlug && norm(u.text) === key).map((u) => u.path_or_slug))];
}

// Ported from checks.mjs G5: one best_for shared by three or more slugs across
// three or more brands (first two words of the name) is a template, not a fit.
export function duplicateBestForGroups(rows) {
  const groups = new Map();
  for (const r of rows) {
    const bf = r.fields.best_for;
    if (bf) groups.set(norm(bf), [...(groups.get(norm(bf)) ?? []), r]);
  }
  const brands = (list) => new Set(list.map((r) => norm(r.name).split(" ").slice(0, 2).join(" ")));
  return [...groups.values()]
    .filter((list) => list.length >= 3 && brands(list).size >= 3)
    .sort((a, b) => b.length - a.length)
    .map((list) => ({ text: list[0].fields.best_for, count: list.length, slugs: list.map((r) => r.slug) }));
}

// ---------------------------------------------------------------- summary

// `fails`/`warns` count hits (a unit may hold two S1 matches); `unitsWithCode`
// counts units, which is what the queue's row count reproduces.
const bucket = () => ({ units: 0, words: 0, FAIL: 0, WARN: 0, OK: 0, fails: {}, warns: {}, unitsWithCode: {}, densityPer1000: {} });
function addTo(b, u) {
  b.units += 1;
  b.words += u.words;
  b[u.severity] += 1;
  for (const f of u.fails) b.fails[f.code] = (b.fails[f.code] ?? 0) + 1;
  for (const w of u.warns) b.warns[w.code] = (b.warns[w.code] ?? 0) + 1;
  for (const code of new Set([...u.fails, ...u.warns].map((h) => h.code))) b.unitsWithCode[code] = (b.unitsWithCode[code] ?? 0) + 1;
}
function finish(b) {
  for (const [code, n] of [...Object.entries(b.fails), ...Object.entries(b.warns)]) b.densityPer1000[code] = b.words ? Math.round((n / b.words) * 1000 * 100) / 100 : 0;
  return b;
}
const finishAll = (obj) => Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, finish(v)]));

export function summarize(units, { date = null, inputs = {}, isNew = false, dbRows = [] } = {}) {
  const totals = bucket();
  const bySurface = {};
  const byGroup = { db: {}, code: {}, resort: {} };
  const families = { total: Object.fromEntries(FAMILIES.map((f) => [f.family, 0])), bySurface: {} };
  for (const u of units) {
    addTo(totals, u);
    addTo((bySurface[u.surface] ??= bucket()), u);
    addTo((byGroup[u.surface][u.group] ??= bucket()), u);
    if (u.family) {
      families.total[u.family] += 1;
      const s = (families.bySurface[u.surface] ??= {});
      s[u.family] = (s[u.family] ?? 0) + 1;
    }
  }
  const dupGroups = duplicateBestForGroups(dbRows);
  const exact = exactDuplicates(units);
  const exactByField = {};
  for (const list of exact) {
    const f = (exactByField[list[0].field] ??= { groups: 0, units: 0 });
    f.groups += 1;
    f.units += list.length;
  }
  return {
    date,
    isNew,
    inputs,
    totals: finish(totals),
    bySurface: finishAll(bySurface),
    byDistrict: finishAll(byGroup.db),
    byFile: finishAll(byGroup.code),
    byPage: finishAll(byGroup.resort),
    families,
    duplicateBestFor: { groups: dupGroups.length, slugs: dupGroups.reduce((n, g) => n + g.count, 0), samples: dupGroups.slice(0, 15).map((g) => ({ text: g.text, count: g.count, slugs: g.slugs.slice(0, 5) })) },
    exactDuplicates: { groups: exact.length, units: exact.reduce((n, l) => n + l.length, 0), byField: exactByField },
  };
}

// ---------------------------------------------------------------- run

export async function run(opts) {
  const repo = opts.repoRoot ?? REPO;
  const allowlist = await loadAllowlist(opts.allowlist ?? join(repo, "scripts/copy/allowlist.json"));
  const priority = await loadPriority(opts.stageB ?? join(repo, "docs/audits/2026-09-28-web/stage-b-queue.csv"));
  const isNew = Boolean(opts.isNew);

  // Export wins over the crawl when both are given; the crawl still lends its names to the mask.
  const placesRows = opts.places ? (await readCsv(opts.places)).map(placesRow) : [];
  const exportRows = opts.export ? (await readCsv(opts.export)).map(exportRow) : [];
  const dbRows = exportRows.length ? exportRows : placesRows;
  const names = [...new Set([...placesRows, ...exportRows].map((r) => r.name).concat(await loadUluwatuNames(join(repo, "lib/uluwatu/venues.ts"))).filter(Boolean))];
  const areas = [...new Set(dbRows.flatMap((r) => [r.district, r.area]).filter(Boolean))];
  const ctx = { names, areas, allowlist, isNew };

  const units = [];
  for (const r of dbRows) {
    for (const [field, text] of Object.entries(r.fields)) {
      if (!text) continue;
      units.push(lintUnit({ unit_id: `${r.slug}#${field}`, surface: "db", path_or_slug: r.slug, field, district: r.district, text, pinned: false, priority: priority.get(r.slug) ?? 0, group: r.district || "(none)" }, { ...ctx, dishes: r.dishes }));
    }
  }
  if (opts.code) {
    for (const file of defaultCodeFiles(repo)) {
      for (const u of extractProse(file)) units.push(lintUnit({ unit_id: u.id, surface: "code", path_or_slug: `${u.file}::${u.path}`, field: u.field, district: "", text: u.text, pinned: u.pinned, priority: 0, group: u.file }, { ...ctx, dishes: [] }));
    }
  }
  if (opts.resort) {
    const pages = JSON.parse(await readFile(opts.resortPath ?? join(repo, "data/resort-fnb/pages.generated.json"), "utf8"));
    for (const u of resortUnits(pages)) units.push(lintUnit({ unit_id: `${u.slug}#${u.path}`, surface: "resort", path_or_slug: `${u.slug}::${u.path}`, field: u.field, district: "", text: u.text, pinned: false, priority: 0, group: u.slug }, { ...ctx, dishes: [] }));
  }
  if (isNew) {
    for (const list of exactDuplicates(units)) {
      for (const u of list) {
        u.fails.push({ code: "D1", match: u.text.slice(0, 80), index: 0 });
        finishUnit(u);
      }
    }
  }
  units.sort((a, b) => SURFACE_RANK[a.surface] - SURFACE_RANK[b.surface] || b.priority - a.priority || SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || a.unit_id.localeCompare(b.unit_id));

  const summary = summarize(units, { date: opts.date ?? null, isNew, dbRows, inputs: { places: opts.places ?? null, export: opts.export ?? null, code: Boolean(opts.code), resort: Boolean(opts.resort), names: names.length, areas: areas.length, allowlist: allowlist.length } });

  if (opts.out) {
    await mkdir(opts.out, { recursive: true });
    await writeFile(join(opts.out, "queue.csv"), toCsv(QUEUE_HEADER, units, `one row = one copy unit (db field, code string or resort page field); codes are space-separated rule codes from scripts/copy/patterns.mjs; ${opts.date ?? "undated"}`));
    await writeFile(join(opts.out, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  }
  return { units, summary };
}

// ---------------------------------------------------------------- cli

function parseArgs(argv) {
  const o = { code: false, resort: false, isNew: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    const next = () => {
      i += 1;
      if (argv[i] === undefined) throw new Error(`${a} needs a value`);
      return argv[i];
    };
    if (a === "--places") o.places = next();
    else if (a === "--export") o.export = next();
    else if (a === "--code") o.code = true;
    else if (a === "--resort") o.resort = true;
    else if (a === "--resort-json") o.resortPath = next();
    else if (a === "--text") o.text = next();
    else if (a === "--field") o.field = next();
    else if (a === "--out") o.out = next();
    else if (a === "--date") o.date = next();
    else if (a === "--new") o.isNew = true;
    else if (a === "--allowlist") o.allowlist = next();
    else if (a === "--stage-b") o.stageB = next();
    else throw new Error(`unknown argument ${a}`);
  }
  return o;
}

const USAGE = "usage: lint.mjs (--places <csv> | --export <csv> | --code | --resort)... --date YYYY-MM-DD [--out <dir>] [--new]\n       lint.mjs --text \"<sentence>\" --field <field> [--places <csv>] [--new]";

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`${e.message}\n${USAGE}`);
    process.exit(2);
  }
  if (opts.text !== undefined) {
    // With a corpus the single unit is masked with the catalogue's names and,
    // on --new, checked for an exact duplicate against it.
    const corpus = opts.places || opts.export ? await run({ ...opts, out: null, text: undefined, code: false, resort: false }) : null;
    const allowlist = await loadAllowlist(opts.allowlist ?? join(REPO, "scripts/copy/allowlist.json"));
    const names = corpus ? await namesFromCorpus(opts) : await loadUluwatuNames(join(REPO, "lib/uluwatu/venues.ts"));
    const areas = corpus ? [...new Set(corpus.units.map((u) => u.district).filter(Boolean))] : [];
    const res = lintText(opts.text, { field: opts.field ?? null, names, areas, allowlist, isNew: opts.isNew });
    if (opts.isNew && corpus && opts.field) {
      const dupes = exactDuplicateOf(opts.text, opts.field, corpus.units);
      if (dupes.length) res.fails.push({ code: "D1", match: opts.text.slice(0, 80), index: 0, slugs: dupes });
    }
    console.log(JSON.stringify({ text: opts.text, field: opts.field ?? null, family: familyOf(opts.text), ...res }, null, 2));
    process.exit(res.fails.length ? 1 : 0);
  }
  if (!opts.places && !opts.export && !opts.code && !opts.resort) {
    console.error(USAGE);
    process.exit(2);
  }
  if (!opts.out) {
    if (!opts.date) {
      console.error(`--date is required when --out is not given\n${USAGE}`);
      process.exit(2);
    }
    opts.out = join(REPO, "docs/audits/copy-lint", opts.date);
  }
  const { units, summary } = await run(opts);
  const s = summary.totals;
  console.log(`${units.length} units · ${s.words} words · FAIL ${s.FAIL} · WARN ${s.WARN} · OK ${s.OK} → ${opts.out}`);
}

async function namesFromCorpus(opts) {
  const rows = [...(opts.places ? await readCsv(opts.places) : []), ...(opts.export ? await readCsv(opts.export) : [])];
  return [...new Set(rows.map((r) => r.name).concat(await loadUluwatuNames(join(REPO, "lib/uluwatu/venues.ts"))).filter(Boolean))];
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((e) => {
    console.error(e.stack ?? e.message);
    process.exit(1);
  });
}
