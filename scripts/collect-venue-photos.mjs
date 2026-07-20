// One-command interim-photo collector (publication rule v3, founder amendment
// 2026-07-19). Run LOCALLY (needs open network):
//
//   node scripts/collect-venue-photos.mjs
//
// What it does, end to end:
//   1. Builds the venue roster straight from supabase/migrations (no DB creds
//      needed): slug, name, district, official_url, instagram_url.
//   2. For each venue fetches its OWN official site / Instagram page and takes
//      up to MAX_PER_VENUE marketing images (og:image first) — the venue's own
//      public marketing photos, per the interim policy.
//   3. Resizes to <=1400px wide webp (q78) via the project's sharp and writes
//      public/venues/<slug>.webp (+ <slug>-2.webp for the second shot).
//   4. Writes a manifest (data/photo-collection/manifest.json) and generates
//      supabase/migrations/0044_local_photo_paths.sql that points photo_url at
//      the committed files for every collected venue that has no APPROVED
//      consented photo (approved submissions always win).
//
// Then: review a few images, `git add public/venues data/photo-collection
// supabase/migrations/0044_local_photo_paths.sql`, commit, push. Deploy makes
// the files live; running 0044 in Supabase flips the catalogue onto them.

import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const MAX_PER_VENUE = 2;
const MIN_BYTES = 12_000; // skip tracking pixels / tiny logos
const MAX_BYTES = 12_000_000;
const CONCURRENCY = 6;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 OtherBali-listing-preview";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT_IMG = join(ROOT, "public", "venues");
const OUT_DATA = join(ROOT, "data", "photo-collection");

// ---------- 1. roster from migrations ----------
function tokensOfValuesTuple(s) {
  // Split a `select gen_random_uuid()::text, $ob$..$ob$, null, array[..]::text[] ...`
  // value list into top-level tokens.
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    if (s.startsWith("$ob$", i)) {
      const end = s.indexOf("$ob$", i + 4);
      tokens.push(s.slice(i + 4, end));
      i = end + 4;
    } else if (s.startsWith("array[", i)) {
      const end = s.indexOf("]::text[]", i);
      tokens.push(null);
      i = end + 9;
    } else if (s.startsWith("null", i)) {
      tokens.push(null);
      i += 4;
    } else if (s.startsWith("gen_random_uuid()::text", i)) {
      tokens.push("__uuid__");
      i += "gen_random_uuid()::text".length;
    } else {
      i += 1;
    }
  }
  return tokens;
}

async function buildRoster() {
  const dir = join(ROOT, "supabase", "migrations");
  const roster = new Map();
  for (const f of (await readdir(dir)).sort()) {
    if (!f.endsWith(".sql")) continue;
    const sql = await readFile(join(dir, f), "utf8");
    // Modern $ob$ inserts: columns list tells us the field order.
    const insertRe =
      /insert into venues \(([^)]+)\)\s*select\s+(.*?)\s+where not exists/gs;
    for (const m of sql.matchAll(insertRe)) {
      const cols = m[1].split(",").map((c) => c.trim());
      const vals = tokensOfValuesTuple(m[2]);
      if (cols.length !== vals.length) continue;
      const row = Object.fromEntries(cols.map((c, idx) => [c, vals[idx]]));
      if (!row.slug) continue;
      roster.set(row.slug, {
        slug: row.slug,
        name: row.name ?? row.slug,
        district: row.district ?? "",
        official_url: row.official_url ?? null,
        instagram_url: row.instagram_url ?? null,
      });
    }
    // 0038-style enrichment updates: instagram_url = coalesce(instagram_url, $ob$URL$ob$)
    const updRe =
      /update venues set[^;]*?instagram_url = coalesce\(instagram_url, \$ob\$(https[^$]+)\$ob\$\)[^;]*?where slug = \$ob\$([a-z0-9-]+)\$ob\$/g;
    for (const m of sql.matchAll(updRe)) {
      const cur = roster.get(m[2]) ?? {
        slug: m[2],
        name: m[2],
        district: "",
        official_url: null,
        instagram_url: null,
      };
      cur.instagram_url = cur.instagram_url ?? m[1];
      roster.set(m[2], cur);
    }
  }
  return [...roster.values()].filter((v) => v.official_url || v.instagram_url);
}

// ---------- 2. page → candidate image urls ----------
function decodeHtml(v) {
  return v
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&#x27;", "'");
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
      const best = decodeHtml(srcset)
        .split(",")
        .map((p) => p.trim().split(/\s+/))
        .map(([u, w]) => ({ u, w: parseInt(w) || 0 }))
        .sort((a, b) => b.w - a.w)[0];
      if (best?.w >= 600) add(best.u, 50);
    } else {
      const w = parseInt(tag.match(/\bwidth=["']?(\d+)/i)?.[1] ?? "0");
      if (w >= 600) add(tag.match(/\bsrc=["']([^"']+)["']/i)?.[1], 30);
    }
  }
  return found.sort((a, b) => b.score - a.score).map((x) => x.href);
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "text/html,*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`http_${res.status}`);
  return { html: await res.text(), finalUrl: res.url };
}

async function fetchImage(url) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "image/*,*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`http_${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < MIN_BYTES || buf.length > MAX_BYTES) throw new Error(`size_${buf.length}`);
  return buf;
}

// ---------- 3. per venue ----------
async function processVenue(v) {
  const sources = [v.official_url, v.instagram_url].filter(Boolean);
  const saved = [];
  const errors = [];
  for (const source of sources) {
    if (saved.length >= MAX_PER_VENUE) break;
    try {
      const page = await fetchText(source);
      for (const imgUrl of pageImages(page.html, page.finalUrl)) {
        if (saved.length >= MAX_PER_VENUE) break;
        try {
          const raw = await fetchImage(imgUrl);
          const img = sharp(raw).rotate().resize({ width: 1400, withoutEnlargement: true });
          const meta = await sharp(raw).metadata();
          if ((meta.width ?? 0) < 500) throw new Error("too_small");
          const file = saved.length === 0 ? `${v.slug}.webp` : `${v.slug}-${saved.length + 1}.webp`;
          await writeFile(join(OUT_IMG, file), await img.webp({ quality: 78 }).toBuffer());
          saved.push({ file, from: imgUrl, source });
        } catch (e) {
          errors.push(`${imgUrl}: ${e.message}`);
        }
      }
    } catch (e) {
      errors.push(`${source}: ${e.message}`);
    }
  }
  return { ...v, photos: saved, status: saved.length ? "downloaded" : "missing", errors: saved.length ? [] : errors.slice(0, 4) };
}

// ---------- main ----------
await mkdir(OUT_IMG, { recursive: true });
await mkdir(OUT_DATA, { recursive: true });
const roster = await buildRoster();
console.log(`roster: ${roster.length} venues with an official/instagram source`);

const results = [];
let cursor = 0;
async function worker() {
  while (cursor < roster.length) {
    const v = roster[cursor++];
    const r = await processVenue(v);
    results.push(r);
    process.stdout.write(r.status === "downloaded" ? "." : "x");
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log("");

results.sort((a, b) => a.district.localeCompare(b.district) || a.slug.localeCompare(b.slug));
await writeFile(join(OUT_DATA, "manifest.json"), JSON.stringify(results, null, 2) + "\n");

// ---------- 4. migration ----------
const ok = results.filter((r) => r.status === "downloaded");
const lines = ok
  .map(
    (r) => `update public.venues v set photo_url = '/venues/${r.photos[0].file}'
where v.slug = '${r.slug}'
  and not exists (
    select 1 from public.venue_photo_submissions s
    join public.consent_log c on c.id = s.consent_log_id
    where s.venue_slug = v.slug and s.status = 'approved' and s.consent_granted
      and c.consent_type = 'venue_photo_rights' and c.granted
  );`,
  )
  .join("\n\n");
const sql = `-- 0044_local_photo_paths.sql (GENERATED by scripts/collect-venue-photos.mjs)
-- Interim pre-launch photos (publication rule v3, founder amendment 2026-07-19):
-- each venue's OWN public marketing photo, re-hosted as a committed webp under
-- /public/venues (stable, no hotlink rot). Approved consented photos are never
-- overwritten (guard below). Idempotent; manual prod apply AFTER the deploy
-- that ships the image files. Source per file: data/photo-collection/manifest.json.

begin;

${lines}

commit;
`;
await writeFile(join(ROOT, "supabase", "migrations", "0044_local_photo_paths.sql"), sql);

console.log(
  JSON.stringify(
    {
      venues: roster.length,
      withPhotos: ok.length,
      twoPlus: ok.filter((r) => r.photos.length >= 2).length,
      missing: results.length - ok.length,
      images: ok.reduce((n, r) => n + r.photos.length, 0),
      migration: "supabase/migrations/0044_local_photo_paths.sql",
      next: "review images in public/venues, then git add public/venues data/photo-collection supabase/migrations/0044_local_photo_paths.sql && commit && push",
    },
    null,
    2,
  ),
);
