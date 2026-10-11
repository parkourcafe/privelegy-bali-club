#!/usr/bin/env node
// Re-confirms accepted claims against today's official sources before they are
// applied: re-fetches every source_url of an ACCEPTED row and checks that its
// quote is still on the page verbatim (same normalisation as validate-claims).
// A row whose quote is gone is reported, not applied.
//
//   node tools/reconfirm.mjs --date 2026-10-01
//
// Writes reconfirm-<date>.json and keeps text snapshots under
// snapshots-reconfirm/<slug>/ (raw bytes are gitignored).

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const BATCH = resolve(HERE, "..");
const args = process.argv.slice(2);
const DATE = args[args.indexOf("--date") + 1] ?? new Date().toISOString().slice(0, 10);
const ROOT = "snapshots-reconfirm";

const normQuote = (s) => (s ?? "").normalize("NFKC").replace(/[‘’‚‛]/g, "'").replace(/[“”„‟]/g, '"').replace(/[–—−]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();

function parseCsv(text) {
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
      if (!(row.length === 1 && row[0] === "")) records.push(row);
      row = [];
    } else cur += ch;
  }
  if (cur !== "" || row.length) {
    row.push(cur);
    records.push(row);
  }
  const header = records[0];
  return records.slice(1).map((r) => Object.fromEntries(r.map((v, i) => [header[i], v])));
}

const rows = parseCsv(await readFile(join(BATCH, "change-list.csv"), "utf8")).filter((r) => r.decision === "ACCEPTED");
const fetched = new Map(); // `${slug}|${url}` -> {status, text}
for (const r of rows) {
  const key = `${r.slug}|${r.source_url}`;
  if (fetched.has(key)) continue;
  const run = spawnSync(process.execPath, [join(HERE, "snapshot.mjs"), r.slug, r.source_url, "--force", "--root", ROOT], { encoding: "utf8", timeout: 120_000 });
  const line = (run.stdout ?? "").split("\n")[0];
  let entry = {};
  try {
    entry = JSON.parse(line);
  } catch {
    entry = { status: 0, error: (run.stderr ?? "").slice(0, 200) };
  }
  let text = null;
  if (entry.textFile) text = await readFile(join(BATCH, ROOT, r.slug, entry.textFile), "utf8");
  fetched.set(key, { status: entry.status, sha256: entry.sha256 ?? null, error: entry.error ?? null, text });
}

const results = rows.map((r) => {
  const f = fetched.get(`${r.slug}|${r.source_url}`);
  const found = f?.text ? normQuote(f.text).includes(normQuote(r.quote)) : false;
  return {
    slug: r.slug,
    claim_id: r.claim_id,
    field: r.field,
    target: r.target,
    source_url: r.source_url,
    status: f?.status ?? 0,
    sha256_today: f?.sha256 ?? null,
    sha256_accepted: r.snapshot_sha256 || null,
    quote_found: found,
    result: f?.status === 200 && found ? "RECONFIRMED" : f?.status === 200 ? "QUOTE_GONE" : "SOURCE_UNREACHABLE",
  };
});
const counts = results.reduce((a, r) => ((a[r.result] = (a[r.result] ?? 0) + 1), a), {});
await writeFile(join(BATCH, `reconfirm-${DATE}.json`), JSON.stringify({ date: DATE, counts, results }, null, 2));
console.log(JSON.stringify({ date: DATE, rows: results.length, sources: fetched.size, counts }));
for (const r of results.filter((x) => x.result !== "RECONFIRMED")) console.log(`  ${r.result} ${r.slug} ${r.field} ${r.source_url} (${r.status})`);
