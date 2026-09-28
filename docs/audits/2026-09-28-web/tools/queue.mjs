#!/usr/bin/env node
// Builds the Stage B queue: which venues to deep-verify next, in what order.
//
//   node queue.mjs --dir <audit dir with places.csv, instances.csv, dupes.csv>
//
// Priority (highest first): P0/P1 instances on the card → inbound editorial
// links (exposure) → a district with public pages → staleness of "last
// checked" → gaps (no hours, no street address, no website). Batch 1 is fixed
// to the Uluwatu 25 regardless of score; the rest are grouped by district in
// batches of 25. Duplicate pairs are listed so they are resolved before
// collection (collecting twice publishes two cards for one place).

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const val = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const DIR = resolve(val("--dir", ".."));
const TODAY = Date.parse("2026-09-28");

function parseCsv(text) {
  const lines = text.split("\n").filter((l) => l && !l.startsWith("#"));
  const parse = (line) => {
    const out = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (q) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else if (ch === '"') q = false;
        else cur += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") {
        out.push(cur);
        cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out;
  };
  const header = parse(lines[0]);
  return lines.slice(1).map((l) => Object.fromEntries(parse(l).map((v, i) => [header[i], v])));
}

const places = parseCsv(await readFile(join(DIR, "places.csv"), "utf8"));
const instances = parseCsv(await readFile(join(DIR, "instances.csv"), "utf8"));
const dupes = parseCsv(await readFile(join(DIR, "dupes.csv"), "utf8")).filter((d) => d.strength === "strong");
const ULUWATU_25 = ["alchemy-uluwatu", "artisan-uluwatu", "bgs-uluwatu", "el-kabron-bali", "gooseberry-french-restaurant-uluwatu", "kala-uluwatu", "laggas-uluwatu", "mana-uluwatu", "masonry-restaurant", "oneeighty", "papi-sapi", "seed-bingin", "single-fin", "son-of-a-baker", "suka-espresso", "sundays-beach-club", "the-warung-at-alila-villas-uluwatu", "tropical-temptation-adult-only-beach-club", "ulu-artisan-ungasan", "ulu-fishmarket", "ulu-garden", "waatu", "white-rock-beach-club", "yuki-uluwatu", "zali-uluwatu"];
const PUBLIC_DISTRICTS = new Set(["Canggu", "Uluwatu", "Ubud", "Seminyak", "Sanur", "Nusa Dua", "Jimbaran", "Nusa Penida"]);

const bySlug = new Map();
for (const i of instances) {
  for (const s of (i.slug ?? "").split(" | ").map((x) => x.split(":")[0].trim()).filter(Boolean)) {
    const b = bySlug.get(s) ?? { p0: 0, p1: 0, p2: 0 };
    if (i.severity === "P0") b.p0 += 1;
    else if (i.severity === "P1") b.p1 += 1;
    else if (i.severity === "P2") b.p2 += 1;
    bySlug.set(s, b);
  }
}
const dupeSlugs = new Set(dupes.flatMap((d) => d.slugs.split(" | ")));

const rows = places.map((p) => {
  const f = bySlug.get(p.slug) ?? { p0: 0, p1: 0, p2: 0 };
  const age = p.last_checked ? Math.round((TODAY - Date.parse(p.last_checked)) / 86_400_000) : 999;
  const gaps = [];
  if (!p.hours_visible && !p.ld_opening_hours) gaps.push("hours");
  if (!p.ld_street_address) gaps.push("street_address");
  if (!p.website) gaps.push("website");
  if (!p.best_for) gaps.push("best_for");
  if (!p.not_for) gaps.push("not_for");
  if (!/\d/.test(p.spend ?? "")) gaps.push("price_digits");
  const score = f.p0 * 1000 + f.p1 * 200 + f.p2 * 20 + Number(p.inbound_editorial || 0) * 10 + (PUBLIC_DISTRICTS.has(p.district) ? 50 : 0) + Math.min(age, 365) / 10 + gaps.length * 5;
  return { slug: p.slug, name: p.name, district: p.district, batch: ULUWATU_25.includes(p.slug) ? 1 : null, score: Math.round(score), p0: f.p0, p1: f.p1, p2: f.p2, inbound_editorial: p.inbound_editorial, inbound_any: p.inbound_any, last_checked: p.last_checked, age_days: age, gaps: gaps.join(" "), duplicate_candidate: dupeSlugs.has(p.slug) ? "yes" : "", url: p.url };
});

// batch assignment: 1 = Uluwatu 25 (fixed); then by score, grouped by district in blocks of 25
const rest = rows.filter((r) => r.batch !== 1).sort((a, b) => b.score - a.score);
const districtOrder = [...new Set(rest.map((r) => r.district))];
let batch = 2;
for (const d of districtOrder) {
  const group = rest.filter((r) => r.district === d);
  for (let i = 0; i < group.length; i += 25) {
    for (const r of group.slice(i, i + 25)) r.batch = batch;
    batch += 1;
  }
}
rows.sort((a, b) => a.batch - b.batch || b.score - a.score);
const header = Object.keys(rows[0]);
const cell = (v) => (/[",\n]/.test(String(v ?? "")) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? ""));
await writeFile(join(DIR, "stage-b-queue.csv"), `# одна строка = одно опубликованное место; batch 1 = Uluwatu 25 (зафиксирован), далее по убыванию score внутри района блоками по 25; duplicate_candidate — решить дубль до сбора\n${header.join(",")}\n${rows.map((r) => header.map((h) => cell(r[h])).join(",")).join("\n")}\n`);
const perBatch = {};
for (const r of rows) perBatch[r.batch] = (perBatch[r.batch] ?? 0) + 1;
console.log(JSON.stringify({ places: rows.length, batches: batch - 1, firstBatches: Object.entries(perBatch).slice(0, 8), dupeCandidates: dupeSlugs.size }));
