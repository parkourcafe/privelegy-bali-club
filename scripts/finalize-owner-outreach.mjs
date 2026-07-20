#!/usr/bin/env node
// Finalize data/data-ops/kora-leads/owner-outreach.{csv,md} by swapping the
// `{TOKEN}` placeholder for each venue's REAL onboarding token.
//
// Why this exists as a script and not something done in-session: minting the
// real token requires calling the live `invite_roster()` RPC against
// production Supabase, and this sandbox has no network path to it. Run this
// where NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY point at the
// real project (e.g. `vercel env pull` first, or paste them inline).
//
// Usage:
//   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
//     node scripts/finalize-owner-outreach.mjs
//
// Writes owner-outreach.final.csv / owner-outreach.final.md next to the
// source files — the {TOKEN} templates are left untouched so this can be
// re-run safely (e.g. after adding more venues to the CSV).

import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, "..", "data", "data-ops", "kora-leads");
const CSV_IN = path.join(DIR, "owner-outreach.csv");
const CSV_OUT = path.join(DIR, "owner-outreach.final.csv");
const MD_IN = path.join(DIR, "owner-outreach.md");
const MD_OUT = path.join(DIR, "owner-outreach.final.md");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
      "Run this against the real Supabase project (e.g. `vercel env pull .env.local` first)."
  );
  process.exit(1);
}

// Minimal CSV parser sufficient for this file: double-quoted cells, "" escape,
// commas/newlines allowed inside quotes. Good enough without adding a dep.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (c === "\r") {
      // skip
    } else {
      cell += c;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function csvCell(v) {
  return `"${String(v ?? "").replace(/"/g, '""')}"`;
}

async function main() {
  const sb = createClient(url, key);
  const { data, error } = await sb.rpc("invite_roster");
  if (error) {
    console.error("invite_roster() failed:", error.message);
    process.exit(1);
  }
  const bySlug = new Map((data ?? []).map((r) => [r.slug, r.token]));

  const rawCsv = readFileSync(CSV_IN, "utf8");
  const rows = parseCsv(rawCsv).filter((r) => r.length > 1 || r[0] !== "");
  const header = rows[0];
  const slugIdx = header.indexOf("slug");
  if (slugIdx === -1) throw new Error("owner-outreach.csv has no `slug` column");

  const missing = [];
  const outLines = [header.map(csvCell).join(",")];
  for (const r of rows.slice(1)) {
    const slug = r[slugIdx];
    const token = bySlug.get(slug);
    if (!token) {
      missing.push(slug);
      outLines.push(r.map(csvCell).join(","));
      continue;
    }
    const substituted = r.map((cell) => cell.replaceAll("{TOKEN}", token));
    outLines.push(substituted.map(csvCell).join(","));
  }
  writeFileSync(CSV_OUT, outLines.join("\n") + "\n", "utf8");
  console.log(`Wrote ${CSV_OUT} (${rows.length - 1} rows, ${missing.length} without a live token)`);

  try {
    const nameIdx = header.indexOf("name");
    const nameToToken = new Map(
      rows.slice(1).map((r) => [r[nameIdx], bySlug.get(r[slugIdx]) ?? null])
    );
    const rawMd = readFileSync(MD_IN, "utf8");
    // Each venue is its own "### Name · category · address" section running
    // to the next "### " (or end of file) — replace {TOKEN} within that span
    // using the token resolved for that venue's name.
    const sectionRe = /^### (.+?) ·/gm;
    let outMd = "";
    let cursor = 0;
    let match;
    let currentToken = null;
    while ((match = sectionRe.exec(rawMd))) {
      outMd += currentToken
        ? rawMd.slice(cursor, match.index).replaceAll("{TOKEN}", currentToken)
        : rawMd.slice(cursor, match.index);
      cursor = match.index;
      currentToken = nameToToken.get(match[1]) ?? null;
    }
    outMd += currentToken
      ? rawMd.slice(cursor).replaceAll("{TOKEN}", currentToken)
      : rawMd.slice(cursor);
    writeFileSync(MD_OUT, outMd, "utf8");
    console.log(`Wrote ${MD_OUT}`);
  } catch (e) {
    console.log(`\n(.md finalization skipped: ${e.message})`);
  }

  if (missing.length) {
    console.log(
      "\nNo live token for these slugs (venue not in the venues table yet, or migration 0039/0040 not applied):\n" +
        missing.map((s) => `  - ${s}`).join("\n")
    );
  } else {
    console.log("\nAll rows resolved to a real token.");
  }
}

main();
