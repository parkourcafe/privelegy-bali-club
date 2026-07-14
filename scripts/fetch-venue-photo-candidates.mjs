import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const [rosterPath, placesHtmlPath, outputDir = "/tmp/otherbali-photo-candidates"] = process.argv.slice(2);
if (!rosterPath || !placesHtmlPath) {
  throw new Error("Usage: node scripts/fetch-venue-photo-candidates.mjs <roster.json> <places.html> [output-dir]");
}

const roster = JSON.parse(await readFile(rosterPath, "utf8"));
const placesHtml = await readFile(placesHtmlPath, "utf8");
const publishedSlugs = new Set(
  [...placesHtml.matchAll(/\\"slug\\":\\"([^\\"]+?)\\",\\"name\\":\\"([^\\"]+)/g)].map((match) => match[1]),
);
const venues = roster.filter(
  (venue) => publishedSlugs.has(venue.slug) && (venue.official_url || venue.instagram_url) && !venue.photo_url,
);

await mkdir(outputDir, { recursive: true });

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function pageImages(html, baseUrl) {
  const found = [];
  const add = (raw, score = 0) => {
    if (!raw || raw.startsWith("data:") || /(?:logo|icon|favicon|avatar|sprite)/i.test(raw)) return;
    try {
      const href = new URL(decodeHtml(raw), baseUrl).href;
      if (!found.some((item) => item.href === href)) found.push({ href, score });
    } catch {
      // Ignore malformed URLs.
    }
  };
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const preferred = ["og:image:secure_url", "og:image", "twitter:image"];
  preferred.forEach((key, keyIndex) => {
    for (const tag of tags) {
      const property = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (property !== key) continue;
      const content = tag.match(/content=["']([^"']+)["']/i)?.[1];
      add(content, 100 - keyIndex);
    }
  });

  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (!/rel=["'](?:preload|image_src)["']/i.test(tag)) continue;
    add(tag.match(/href=["']([^"']+)["']/i)?.[1], 90);
  }

  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const srcset = tag.match(/(?:srcset|data-srcset)=["']([^"']+)["']/i)?.[1];
    if (srcset) {
      const options = decodeHtml(srcset)
        .split(",")
        .map((item) => item.trim().split(/\s+/))
        .map(([url, descriptor]) => ({ url, width: Number.parseInt(descriptor ?? "0", 10) || 0 }))
        .sort((a, b) => b.width - a.width);
      for (const option of options.slice(0, 2)) add(option.url, 60 + Math.min(option.width / 100, 20));
    }
    add(tag.match(/(?:src|data-src|data-lazy-src)=["']([^"']+)["']/i)?.[1], 40);
  }

  return found.sort((a, b) => b.score - a.score).map((item) => item.href).slice(0, 20);
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`page_${response.status}`);
  return { html: await response.text(), finalUrl: response.url };
}

async function downloadImage(url, slug) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36",
      Accept: "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`image_${response.status}`);
  const contentType = response.headers.get("content-type")?.split(";")[0] ?? "";
  if (!contentType.startsWith("image/")) throw new Error(`not_image_${contentType || "unknown"}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 30_000) throw new Error(`image_too_small_${bytes.length}`);
  const typeExt = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif" }[contentType];
  const urlExt = extname(new URL(response.url).pathname).toLowerCase();
  const extension = typeExt ?? ([".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(urlExt) ? urlExt : ".img");
  const path = join(outputDir, `${slug}${extension}`);
  await writeFile(path, bytes);
  return { path, bytes: bytes.length, contentType, finalUrl: response.url };
}

async function processVenue(venue) {
  const sources = [venue.official_url, venue.instagram_url].filter(Boolean);
  const errors = [];
  for (const source of sources) {
    try {
      const page = await fetchHtml(source);
      const imageUrls = pageImages(page.html, page.finalUrl);
      if (!imageUrls.length) throw new Error("no_page_image");
      const imageErrors = [];
      for (const imageUrl of imageUrls) {
        try {
          const image = await downloadImage(imageUrl, venue.slug);
          return { ...venue, status: "downloaded", source, imageUrl, ...image };
        } catch (error) {
          imageErrors.push(error instanceof Error ? error.message : String(error));
        }
      }
      throw new Error(`no_usable_image_${[...new Set(imageErrors)].slice(0, 4).join(",")}`);
    } catch (error) {
      errors.push(`${source}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return { ...venue, status: "missing", errors };
}

const results = [];
const concurrency = 6;
let cursor = 0;
async function worker() {
  while (cursor < venues.length) {
    const venue = venues[cursor++];
    const result = await processVenue(venue);
    results.push(result);
    process.stdout.write(result.status === "downloaded" ? "." : "x");
  }
}
await Promise.all(Array.from({ length: concurrency }, () => worker()));
process.stdout.write("\n");

results.sort((a, b) => a.district.localeCompare(b.district) || a.name.localeCompare(b.name));
await writeFile(join(outputDir, "manifest.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify({
  eligible: venues.length,
  downloaded: results.filter((item) => item.status === "downloaded").length,
  missing: results.filter((item) => item.status === "missing").length,
  outputDir,
}, null, 2));
