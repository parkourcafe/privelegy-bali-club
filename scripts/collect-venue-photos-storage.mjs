// Run this on your own machine (needs normal internet access — it won't
// work from inside a Claude Code cloud session, which is why this couldn't
// be finished there: the sandbox's network policy blocks direct requests to
// arbitrary venue websites, and Firecrawl refuses to fetch raw image files).
//
// What it does:
//   1. Queries Supabase directly for every published venue with
//      photo_status = 'missing' and an official_url on file (554 as of
//      2026-08-25, includes today's spa/rental/restaurant/nightlife harvest
//      plus everything from before).
//   2. For each, fetches its own site, picks up to 4 candidate images
//      (og:image first, then the largest real <img>/srcset tags — logos,
//      favicons, icons, sprites are filtered out by filename), downloads
//      whichever is the first to actually pan out.
//   3. Resizes to <=1400px wide webp (q78) and uploads it to Supabase
//      Storage under owner-photo-candidates/official-site-scrape-<date>/.
//   4. Updates that venue's photo_url + photo_status='published' — guarded
//      on photo_status still being 'missing', so it never overwrites an
//      owner-submitted or otherwise-approved photo, even if you re-run it.
//
// Setup (one time):
//   cd privelegy-bali-club
//   npm install                     # sharp + @supabase/supabase-js already
//                                    # in package.json, this just installs them
//
// Run:
//   SUPABASE_SERVICE_ROLE_KEY=<paste the key> node collect-photos-local.mjs
//
// The key is never written to disk by this script — pass it as an env var
// each time, or export it in your shell for the session. Get it from
// Supabase dashboard → Project Settings → API → service_role (secret) key,
// project egkdapqwkfprtyqvvnso ("bali-privilege").
//
// Safe to re-run: anything already uploaded/updated is skipped (photo_status
// is no longer 'missing' after a successful update).

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

const BUCKET = "owner-photo-candidates";
const BATCH = `official-site-scrape-${new Date().toISOString().slice(0, 10)}`;
const MAX_CANDIDATES = 4;
const MIN_BYTES = 12_000;
const MAX_BYTES = 12_000_000;
const CONCURRENCY = 6;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 OtherBali-listing-preview";

function decodeHtml(v) {
  return v.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#039;", "'").replaceAll("&#x27;", "'");
}

function pageImages(html, baseUrl) {
  const found = [];
  const add = (raw, score = 0) => {
    if (!raw || raw.startsWith("data:")) return;
    if (/(?:logo|icon|favicon|avatar|sprite|placeholder)/i.test(raw)) return;
    try {
      const href = new URL(decodeHtml(raw), baseUrl).href;
      if (!href.startsWith("http")) return;
      if (!found.some((x) => x.href === href)) found.push({ href, score });
    } catch {}
  };
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const key of ["og:image:secure_url", "og:image", "twitter:image"]) {
    for (const tag of metas) {
      const prop = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (prop !== key) continue;
      add(tag.match(/content=["']([^"']+)["']/i)?.[1], 100);
    }
  }
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const srcset = tag.match(/(?:srcset|data-srcset)=["']([^"']+)["']/i)?.[1];
    if (srcset) {
      const best = decodeHtml(srcset).split(",").map((p) => p.trim().split(/\s+/))
        .map(([u, w]) => ({ u, w: parseInt(w) || 0 })).sort((a, b) => b.w - a.w)[0];
      if (best?.w >= 500) add(best.u, 50);
    } else {
      const w = parseInt(tag.match(/\bwidth=["']?(\d+)/i)?.[1] ?? "0");
      if (w >= 500) add(tag.match(/\bsrc=["']([^"']+)["']/i)?.[1], 30);
    }
  }
  return found.sort((a, b) => b.score - a.score).map((x) => x.href).slice(0, MAX_CANDIDATES);
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html,*/*" }, redirect: "follow", signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`http_${res.status}`);
  return { html: await res.text(), finalUrl: res.url };
}

async function fetchImage(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "image/*,*/*" }, redirect: "follow", signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`http_${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < MIN_BYTES || buf.length > MAX_BYTES) throw new Error(`size_${buf.length}`);
  return buf;
}

async function processVenue(v) {
  try {
    const page = await fetchText(v.official_url);
    const candidates = pageImages(page.html, page.finalUrl);
    for (const imgUrl of candidates) {
      try {
        const raw = await fetchImage(imgUrl);
        const meta = await sharp(raw).metadata();
        if ((meta.width ?? 0) < 500) throw new Error("too_small");
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
        continue; // try the next candidate from the same page fetch
      }
    }
    return { slug: v.slug, ok: false, error: "no usable image among candidates" };
  } catch (e) {
    return { slug: v.slug, ok: false, error: String(e.message || e) };
  }
}

const { data: roster, error } = await supabase
  .from("venues")
  .select("slug, official_url")
  .eq("photo_status", "missing")
  .eq("status", "active")
  .eq("publication_status", "published")
  .not("official_url", "is", null)
  .neq("official_url", "");
if (error) { console.error(error); process.exit(1); }
console.log(`roster: ${roster.length} venues missing a photo`);

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
console.log(JSON.stringify({ roster: roster.length, uploaded: ok.length, failed: results.length - ok.length }, null, 2));
console.log("Failed venues (no image found or site unreachable):");
for (const r of results.filter((x) => !x.ok)) console.log(`  ${r.slug}: ${r.error}`);
