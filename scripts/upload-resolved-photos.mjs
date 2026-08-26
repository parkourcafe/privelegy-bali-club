// Run this on your own machine (needs normal internet access).
//
// This is the second half of the photo backfill. It does NOT crawl venue
// sites itself -- it reads a list of already-confirmed image URLs (resolved
// server-side via Firecrawl, which can render JS and get past the anti-bot
// blocks that made scripts/collect-venue-photos-storage.mjs fail on most
// sites) from data/data-ops/photo-backfill-2026-08/resolved_photo_candidates.json,
// downloads whichever candidate actually works for each venue, and uploads
// it the same way collect-venue-photos-storage.mjs does.
//
// Because every URL here was already seen inside a fully-rendered page
// fetch, this should succeed far more often than blind page-scraping did.
//
// Setup (one time):
//   cd privelegy-bali-club
//   npm install
//
// Run:
//   SUPABASE_SERVICE_ROLE_KEY=<paste the key> node scripts/upload-resolved-photos.mjs
//
// The key is never written to disk by this script.
//
// Safe to re-run: anything already uploaded/updated is skipped (photo_status
// is no longer 'missing' after a successful update).

import { readFile, writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import crypto from "node:crypto";

const SUPABASE_URL = "https://egkdapqwkfprtyqvvnso.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY) {
  console.error("Set SUPABASE_SERVICE_ROLE_KEY first — see the comment at the top of this file.");
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, KEY);

const CANDIDATES_FILE = new URL(
  "../data/data-ops/photo-backfill-2026-08/resolved_photo_candidates.json",
  import.meta.url,
);
const RESULTS_FILE = new URL(
  "../data/data-ops/photo-backfill-2026-08/upload_results.json",
  import.meta.url,
);

const BUCKET = "owner-photo-candidates";
const BATCH = `resolved-site-photo-${new Date().toISOString().slice(0, 10)}`;
const MIN_BYTES = 12_000;
const MAX_BYTES = 12_000_000;
const CONCURRENCY = 6;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 OtherBali-listing-preview";

async function fetchImage(url, referer) {
  const res = await fetch(url, {
    headers: {
      "user-agent": UA,
      accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      // Many CDNs serve an image only when the request looks like it came from
      // the page that embeds it. Firecrawl saw these URLs from inside the page,
      // so without these two headers the same URL 403s when fetched cold.
      ...(referer ? { referer, origin: new URL(referer).origin } : {}),
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`http_${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < MIN_BYTES || buf.length > MAX_BYTES) throw new Error(`size_${buf.length}`);
  return buf;
}

async function fetchImageEitherWay(url, referer) {
  try {
    return await fetchImage(url, referer);
  } catch (e) {
    // A few CDNs reject a cross-origin referer instead of requiring one.
    return await fetchImage(url, null);
  }
}

async function processVenue(v) {
  const errors = [];
  for (const imgUrl of v.candidates) {
    try {
      const raw = await fetchImageEitherWay(imgUrl, v.official_url);
      const meta = await sharp(raw).metadata();
      if ((meta.width ?? 0) < 400) throw new Error("too_small");
      const webp = await sharp(raw).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
      const hash = crypto.createHash("sha256").update(webp).digest("hex").slice(0, 16);
      const path = `${BATCH}/${v.slug}--hero--${hash}.webp`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, webp, { contentType: "image/webp", upsert: true });
      if (upErr) throw new Error(`upload_${upErr.message}`);
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const { error: dbErr } = await supabase
        .from("venues")
        .update({ photo_url: pub.publicUrl, photo_status: "published" })
        .eq("slug", v.slug)
        .eq("photo_status", "missing"); // never touches an already-approved/owner photo
      if (dbErr) throw new Error(`db_${dbErr.message}`);
      return { slug: v.slug, ok: true, photo_url: pub.publicUrl, from: imgUrl };
    } catch (e) {
      continue; // try the next candidate for this venue
    }
  }
  return { slug: v.slug, ok: false, error: "all candidates failed" };
}

const all = JSON.parse(await readFile(CANDIDATES_FILE, "utf8"));
const roster = all.filter((v) => v.ok && v.candidates?.length);
console.log(`roster: ${roster.length} venues with resolved candidates (of ${all.length} attempted)`);

const results = [];
let cursor = 0;
async function worker() {
  while (cursor < roster.length) {
    const v = roster[cursor++];
    const r = await processVenue(v);
    results.push(r);
    process.stdout.write(r.ok ? "." : "x");
    if (results.length % 50 === 0) {
      const ok = results.filter((x) => x.ok).length;
      console.log(` [${results.length}/${roster.length}] uploaded=${ok}`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log("");

const ok = results.filter((r) => r.ok);
await writeFile(RESULTS_FILE, JSON.stringify(results, null, 1));
console.log(JSON.stringify({ roster: roster.length, uploaded: ok.length, failed: results.length - ok.length }, null, 2));
console.log("Failed venues:");
for (const r of results.filter((x) => !x.ok)) console.log(`  ${r.slug}: ${r.error}`);
