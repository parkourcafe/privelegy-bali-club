#!/usr/bin/env node
// Registry ↔ DB consistency guard (follow-up to the /uluwatu silent-404).
//
// The Uluwatu guide subtree is all-or-nothing: app/uluwatu/layout.tsx calls
// notFound() for the WHOLE /uluwatu tree if any venue marked
// publication:"published" in the static registry (lib/uluwatu/venues.ts) is not
// active+published in the database. That once took the flagship pillar to a
// silent prod 404 because six warungs were "published" in the registry while
// their DB rows were missing.
//
// This script fails the build with a clear message when that drift exists, so
// it's caught before deploy instead of in production. It runs at prebuild:
//   - no Supabase env (CI's credential-less build, local dev) → SKIP, exit 0;
//   - a query/connection error → WARN, exit 0 (never break a build on a
//     transient DB blip; the app falls back to seed anyway);
//   - a genuine registry↔DB mismatch → ERROR, exit 1.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const ULUWATU_DB_SLUG = "uluwatu-bukit";
const REGISTRY_PATH = new URL("../lib/uluwatu/venues.ts", import.meta.url);

// Extract slugs whose entry is publication:"published". Each venue object lists
// `slug:` before `publication:`, so the nearest preceding slug pairs with each
// published marker. Pure text scan — the registry has no runtime imports and we
// avoid depending on a TS loader (CI runs Node 20).
export function parsePublishedSlugs(src) {
  const slugs = new Set();
  let lastSlug = null;
  for (const line of src.split("\n")) {
    const slugMatch = line.match(/^\s*slug:\s*"([a-z0-9-]+)"/);
    if (slugMatch) {
      lastSlug = slugMatch[1];
      continue;
    }
    if (/^\s*publication:\s*"published"/.test(line) && lastSlug) {
      slugs.add(lastSlug);
    }
  }
  return [...slugs];
}

export function publishedRegistrySlugs() {
  return parsePublishedSlugs(readFileSync(REGISTRY_PATH, "utf8"));
}

// The condition that must fail the build: registry-published slugs with no
// active+published DB row.
export function findMissing(expected, dbSlugs) {
  const present = dbSlugs instanceof Set ? dbSlugs : new Set(dbSlugs);
  return expected.filter((slug) => !present.has(slug));
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.log("[check-registry-db] No Supabase env — skipping (seed-data build).");
    return 0;
  }

  const expected = publishedRegistrySlugs();
  if (expected.length === 0) {
    console.warn("[check-registry-db] No published Uluwatu registry entries found — check the parser.");
    return 0;
  }

  let dbSlugs;
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("venues")
      .select("slug")
      .eq("district", ULUWATU_DB_SLUG)
      .eq("status", "active")
      .eq("publication_status", "published");
    if (error) throw error;
    dbSlugs = new Set((data ?? []).map((r) => r.slug));
  } catch (err) {
    console.warn(
      `[check-registry-db] Could not read the database (${err?.message ?? err}); skipping. ` +
        "The build proceeds; the app falls back to seed data."
    );
    return 0;
  }

  const missing = findMissing(expected, dbSlugs);
  if (missing.length > 0) {
    console.error(
      "\n[check-registry-db] FAIL — registry ↔ DB drift will 404 the whole /uluwatu guide.\n" +
        `  ${missing.length} venue(s) are publication:"published" in lib/uluwatu/venues.ts but NOT ` +
        `active+published in the database (district ${ULUWATU_DB_SLUG}):\n` +
        missing.map((s) => `    - ${s}`).join("\n") +
        "\n\n  Fix: publish these rows in the DB (status=active, publication_status=published), " +
        'or set publication:"review" in the registry until they are ready.\n'
    );
    return 1;
  }

  console.log(
    `[check-registry-db] OK — all ${expected.length} published Uluwatu registry venues are active+published in the DB.`
  );
  return 0;
}

// Run only when invoked directly (`node scripts/check-registry-db.mjs`), not
// when imported by the test.
const isEntry = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isEntry) {
  main()
    .then((code) => process.exit(code))
    .catch((err) => {
      // Never break a build on an unexpected script error — fail open.
      console.warn(`[check-registry-db] Unexpected error, skipping: ${err?.message ?? err}`);
      process.exit(0);
    });
}
