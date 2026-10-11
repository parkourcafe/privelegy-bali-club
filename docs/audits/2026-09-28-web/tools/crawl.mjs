#!/usr/bin/env node
// Read-only crawl of the live Other Bali site for the 2026-09-28 web audit.
//
//   node crawl.mjs --out <dir> [--concurrency 3]
//
// Fetches every URL once and stores the raw body (gzip) plus per-URL metadata.
// Parsing and checks run offline against the stored bodies (parse.mjs,
// checks.mjs) so the live site is not re-crawled while the parser is iterated.
// Only GET requests; robots.txt disallows are respected; `?s=` URLs are never
// requested because they write a source-attribution row.

import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { mkdir, writeFile, appendFile, readFile } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseSitemapLocations } from "../../../../scripts/seo-os-core.mjs";
import { robotsAllowsPath } from "../../../../scripts/t0-indexability-core.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../../../..");
const ORIGIN = "https://www.otherbali.com";
const UA = "OtherBaliAudit/2026-09-28 (read-only site audit; +https://www.otherbali.com)";
const TIMEOUT_MS = 30_000;
const MAX_REDIRECTS = 5;
const RETRY_DELAYS_MS = [2_000, 4_000, 8_000];

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const OUT = resolve(argValue("--out", "./crawl-out"));
const CONCURRENCY = Number(argValue("--concurrency", "3"));
const RAW = join(OUT, "raw");
const PAGES_LOG = join(OUT, "pages.jsonl");

const sha = (algo, data) => createHash(algo).update(data).digest("hex");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const KEEP_HEADERS = [
  "cache-control", "x-vercel-cache", "x-robots-tag", "content-type", "x-matched-path",
  "x-vercel-id", "age", "location", "last-modified", "etag", "content-length",
];

let robotsText = "";

async function fetchOnce(url) {
  const chain = [];
  let current = url;
  const started = performance.now();
  let ttfb = null;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const res = await fetch(current, {
      redirect: "manual",
      headers: { "user-agent": UA, accept: "text/html,application/xml;q=0.9,*/*;q=0.8" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (ttfb === null) ttfb = Math.round(performance.now() - started);
    const headers = {};
    for (const h of KEEP_HEADERS) {
      const v = res.headers.get(h);
      if (v !== null) headers[h] = v;
    }
    const setCookieNames = (res.headers.getSetCookie?.() ?? [])
      .map((c) => c.split("=")[0].trim())
      .filter(Boolean);
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      await res.arrayBuffer().catch(() => null);
      const next = new URL(res.headers.get("location"), current).toString();
      chain.push({ url: current, status: res.status, location: next });
      current = next;
      continue;
    }
    const body = Buffer.from(await res.arrayBuffer());
    return {
      status: res.status,
      finalUrl: current,
      chain,
      headers,
      setCookieNames,
      body,
      ttfbMs: ttfb,
      totalMs: Math.round(performance.now() - started),
    };
  }
  return { status: 0, finalUrl: current, chain, headers: {}, setCookieNames: [], body: Buffer.alloc(0), ttfbMs: ttfb, totalMs: Math.round(performance.now() - started), error: "too_many_redirects" };
}

async function fetchWithRetry(url) {
  let attempt = 0;
  let last;
  while (true) {
    attempt += 1;
    try {
      last = await fetchOnce(url);
      const retryable = last.status >= 500 || last.status === 429;
      if (!retryable || attempt > RETRY_DELAYS_MS.length) return { ...last, attempts: attempt };
    } catch (error) {
      last = { status: 0, error: String(error?.cause?.code ?? error?.name ?? error), chain: [], headers: {}, setCookieNames: [], body: Buffer.alloc(0) };
      if (attempt > RETRY_DELAYS_MS.length) return { ...last, attempts: attempt };
    }
    const base = RETRY_DELAYS_MS[attempt - 1];
    await sleep(base + Math.floor(Math.random() * 500));
  }
}

const fetched = new Map(); // url -> record
const tags = new Map(); // url -> Set(tag)

function tag(url, t) {
  if (!tags.has(url)) tags.set(url, new Set());
  tags.get(url).add(t);
}

async function crawlOne(url, recordTag = null) {
  const key = recordTag ? `${url}#${recordTag}` : url;
  if (fetched.has(key)) return fetched.get(key);
  const r = await fetchWithRetry(url);
  const bodySha = sha("sha256", r.body);
  const rawName = `${sha("sha1", key)}.gz`;
  const contentType = r.headers?.["content-type"] ?? "";
  const textual = /html|xml|text|json/i.test(contentType) || r.body.length === 0;
  if (textual && r.body.length > 0) await writeFile(join(RAW, rawName), gzipSync(r.body));
  const bodyText = textual ? r.body.toString("utf8") : "";
  const dpl = bodyText.match(/dpl_[A-Za-z0-9]+/)?.[0] ?? null;
  const record = {
    url,
    recordTag,
    status: r.status,
    finalUrl: r.finalUrl ?? url,
    chain: r.chain ?? [],
    headers: r.headers ?? {},
    setCookieNames: r.setCookieNames ?? [],
    ttfbMs: r.ttfbMs ?? null,
    totalMs: r.totalMs ?? null,
    bytes: r.body.length,
    sha256: bodySha,
    attempts: r.attempts,
    error: r.error ?? null,
    fetchedAt: new Date().toISOString(),
    raw: textual && r.body.length > 0 ? `raw/${rawName}` : null,
    dpl,
  };
  fetched.set(key, record);
  await appendFile(PAGES_LOG, JSON.stringify(record) + "\n");
  return { record, bodyText };
}

async function pool(items, worker) {
  let index = 0;
  let done = 0;
  const total = items.length;
  const runners = Array.from({ length: Math.min(CONCURRENCY, total) }, async () => {
    while (index < total) {
      const item = items[index++];
      await worker(item);
      done += 1;
      if (done % 100 === 0 || done === total) console.log(`  ${done}/${total}`);
    }
  });
  await Promise.all(runners);
}

function internalLinks(html, baseUrl) {
  const out = new Set();
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const raw = m[1].replace(/&amp;/g, "&");
    let u;
    try {
      u = new URL(raw, baseUrl);
    } catch {
      continue;
    }
    if (u.origin !== ORIGIN) continue;
    u.hash = "";
    if (/\.[a-z0-9]{2,5}$/i.test(u.pathname)) continue; // assets, feeds
    if (u.pathname.startsWith("/_next/")) continue;
    if (u.search) continue; // query variants are not crawled one-hop; /places?page=N is seeded
    if (u.pathname !== "/") u.pathname = u.pathname.replace(/\/+$/u, "");
    out.add(u.pathname === "/" ? ORIGIN : u.toString());
  }
  return out;
}

function allowed(url) {
  const u = new URL(url);
  if (u.searchParams.has("s")) return false;
  return robotsAllowsPath(robotsText, u.pathname + u.search);
}

async function main() {
  await mkdir(RAW, { recursive: true });
  await writeFile(PAGES_LOG, "");
  const startedAt = new Date().toISOString();

  // robots + sitemaps
  const robots = await crawlOne(`${ORIGIN}/robots.txt`);
  robotsText = robots.bodyText;
  tag(`${ORIGIN}/robots.txt`, "robots");
  const index = await crawlOne(`${ORIGIN}/sitemap.xml`);
  tag(`${ORIGIN}/sitemap.xml`, "sitemap-index");
  const childSitemaps = [...index.bodyText.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1]);
  const sitemaps = {};
  for (const child of childSitemaps) {
    const res = await crawlOne(child);
    tag(child, "sitemap-child");
    const section = new URL(child).pathname.split("/").pop();
    const { locations, duplicates, foreignOrigins } = parseSitemapLocations(res.bodyText, { expectedOrigin: ORIGIN });
    const lastmod = {};
    for (const m of res.bodyText.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = m[1].match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1];
      const lm = m[1].match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/)?.[1] ?? null;
      if (loc) lastmod[loc.replace(/\/+$/u, "") || loc] = lm;
    }
    sitemaps[section] = { url: child, count: locations.length, duplicates, foreignOrigins, locations, lastmod };
    for (const loc of locations) tag(loc, `sitemap:${section}`);
  }
  await writeFile(join(OUT, "sitemaps.json"), JSON.stringify(sitemaps, null, 2));

  // seeds
  const seeds = new Set();
  for (const s of Object.values(sitemaps)) for (const loc of s.locations) seeds.add(loc);
  seeds.add(ORIGIN); tag(ORIGIN, "home");
  seeds.add(`${ORIGIN}/places`); tag(`${ORIGIN}/places`, "catalogue");
  for (let p = 2; p <= 72; p += 1) {
    const u = `${ORIGIN}/places?page=${p}`;
    seeds.add(u); tag(u, "places-pagination");
  }
  seeds.add(`${ORIGIN}/llms.txt`); tag(`${ORIGIN}/llms.txt`, "llms");
  const registry = JSON.parse(await readFile(join(REPO, "docs/seo/os/page-registry.json"), "utf8"));
  for (const entry of registry.entries) {
    const u = entry.pathname === "/" ? ORIGIN : `${ORIGIN}${entry.pathname}`;
    seeds.add(u); tag(u, "july-registry");
  }
  const seedList = [...seeds].filter((u) => {
    if (allowed(u)) return true;
    tag(u, "skipped-robots");
    return false;
  });
  console.log(`seeds: ${seedList.length} (sitemap sections: ${Object.entries(sitemaps).map(([k, v]) => `${k}=${v.count}`).join(", ")})`);

  const linkSources = new Map(); // target -> Set(source)
  await pool(seedList, async (url) => {
    const { record, bodyText } = await crawlOne(url);
    if (record.status === 200 && /html/i.test(record.headers["content-type"] ?? "")) {
      for (const link of internalLinks(bodyText, record.finalUrl)) {
        if (!linkSources.has(link)) linkSources.set(link, new Set());
        linkSources.get(link).add(url);
      }
    }
  });

  // one hop from everything fetched
  const oneHop = [...linkSources.keys()].filter((u) => !fetched.has(u) && allowed(u));
  for (const u of oneHop) tag(u, "one-hop");
  console.log(`one-hop: ${oneHop.length}`);
  await pool(oneHop, (url) => crawlOne(url));

  // drift recheck: 20 place pages spread across the sitemap
  const places = sitemaps.places?.locations ?? [];
  const step = Math.max(1, Math.floor(places.length / 20));
  const driftSample = places.filter((_, i) => i % step === 0).slice(0, 20);
  console.log(`drift recheck: ${driftSample.length}`);
  await pool(driftSample, (url) => crawlOne(url, "drift-recheck"));
  const endProbe = await crawlOne(ORIGIN, "end-probe");

  const tagsOut = Object.fromEntries([...tags].map(([u, s]) => [u, [...s].sort()]));
  await writeFile(join(OUT, "tags.json"), JSON.stringify(tagsOut));
  const linksOut = Object.fromEntries([...linkSources].map(([u, s]) => [u, [...s].sort()]));
  await writeFile(join(OUT, "one-hop-links.json"), JSON.stringify(linksOut));
  const summary = {
    startedAt,
    finishedAt: new Date().toISOString(),
    userAgent: UA,
    concurrency: CONCURRENCY,
    fetches: fetched.size,
    seeds: seedList.length,
    oneHop: oneHop.length,
    dplStart: robots.record.dpl ?? [...fetched.values()].find((r) => r.dpl)?.dpl ?? null,
    dplEnd: endProbe.record.dpl,
    dplSet: [...new Set([...fetched.values()].map((r) => r.dpl).filter(Boolean))],
    statusCounts: [...fetched.values()].reduce((acc, r) => ((acc[r.status] = (acc[r.status] ?? 0) + 1), acc), {}),
  };
  await writeFile(join(OUT, "summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
