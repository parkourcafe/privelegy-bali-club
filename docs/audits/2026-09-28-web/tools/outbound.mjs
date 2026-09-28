#!/usr/bin/env node
// Checks the external links that place cards send people to: official websites,
// booking handoffs and menu sources. One GET per URL, one request at a time per
// host, honest user agent. Instagram and Google Maps are not requested:
// Instagram answers 429 from this environment and Maps is a generated search
// link we never scrape.
//
//   node outbound.mjs --parsed <parsed.jsonl> --out <outbound.jsonl> [--concurrency 6]
//
// A 401/403/429/451, a TLS failure or a reset is recorded as "not_checked":
// a bot wall is not evidence that a link is dead.

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const UA = "OtherBaliAudit/2026-09-28 (read-only link check; +https://www.otherbali.com)";
const TIMEOUT_MS = 25_000;
const args = process.argv.slice(2);
const val = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const PARSED = resolve(val("--parsed", "parsed.jsonl"));
const OUT = resolve(val("--out", "outbound.jsonl"));
const CONCURRENCY = Number(val("--concurrency", "6"));

const SECOND_LEVEL = new Set(["co.id", "or.id", "web.id", "my.id", "biz.id", "ac.id", "co.uk", "com.au", "com.sg", "co.nz", "com.my"]);
export function registrable(host) {
  const labels = host.toLowerCase().replace(/^www\./, "").split(".");
  if (labels.length <= 2) return labels.join(".");
  const last2 = labels.slice(-2).join(".");
  return SECOND_LEVEL.has(last2) ? labels.slice(-3).join(".") : last2;
}

const SKIP_HOSTS = [/(^|\.)instagram\.com$/i, /(^|\.)google\.[a-z.]+$/i, /(^|\.)goo\.gl$/i, /(^|\.)wa\.me$/i, /(^|\.)whatsapp\.com$/i, /(^|\.)facebook\.com$/i];
const PARKED = /(domain (is|may be) for sale|buy this domain|this domain is parked|parkingcrew|sedoparking|domain has expired|hugedomains)/i;

async function check(url) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop <= 5; hop += 1) {
    let res;
    try {
      res = await fetch(current, { redirect: "manual", headers: { "user-agent": UA, accept: "text/html,*/*;q=0.8" }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (error) {
      const code = String(error?.cause?.code ?? error?.name ?? error);
      return { chain, finalUrl: current, status: 0, error: code };
    }
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) {
      await res.arrayBuffer().catch(() => null);
      const next = new URL(loc, current).toString();
      chain.push({ url: current, status: res.status, location: next });
      current = next;
      continue;
    }
    let snippet = "";
    try {
      const buf = Buffer.from(await res.arrayBuffer());
      snippet = buf.subarray(0, 200_000).toString("utf8");
    } catch {
      snippet = "";
    }
    const title = (snippet.match(/<title[^>]*>([\s\S]*?)<\/title>/i) ?? [])[1]?.replace(/\s+/g, " ").trim().slice(0, 160) ?? null;
    return { chain, finalUrl: current, status: res.status, title, parked: PARKED.test(snippet) };
  }
  return { chain, finalUrl: current, status: 0, error: "too_many_redirects" };
}

export function classify(url, r) {
  const from = registrable(new URL(url).host);
  let to = from;
  try {
    to = registrable(new URL(r.finalUrl).host);
  } catch {
    /* keep */
  }
  if (r.error) {
    if (/ENOTFOUND|EAI_AGAIN/.test(r.error)) return "dns_fail";
    return "not_checked";
  }
  if ([401, 403, 407, 429, 451].includes(r.status)) return "not_checked";
  if (r.status === 404 || r.status === 410) return "not_found";
  if (r.status >= 500) return "server_error";
  if (r.parked) return "parked";
  if (r.status >= 200 && r.status < 300) return to === from ? "ok" : "redirect_other_domain";
  return "other";
}

async function main() {
  const pages = (await readFile(PARSED, "utf8")).split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const refs = new Map(); // url -> [{slug, kind}]
  const add = (url, slug, kind) => {
    if (!url || !/^https?:\/\//i.test(url)) return;
    let u;
    try {
      u = new URL(url);
    } catch {
      return;
    }
    if (u.host.endsWith("otherbali.com")) return;
    u.hash = "";
    const key = u.toString();
    if (!refs.has(key)) refs.set(key, []);
    refs.get(key).push({ slug, kind });
  };
  for (const p of pages) {
    if (!p.place || p.status !== 200 || p.recordTag) continue;
    const slug = p.place.slug;
    for (const pair of p.place.blocks?.Practical?.pairs ?? []) for (const l of pair.links) add(l, slug, `practical:${pair.label}`);
    for (const a of p.place.actions ?? []) add(a.href, slug, `action:${a.label}`);
    for (const m of p.place.menus ?? []) for (const l of m.sourceLinks) add(l, slug, "menu-source");
    for (const s of p.place.ld?.sameAs ?? []) add(s, slug, "ld:sameAs");
  }
  const all = [...refs.keys()];
  const skipped = all.filter((u) => SKIP_HOSTS.some((re) => re.test(new URL(u).host)));
  const todo = all.filter((u) => !skipped.includes(u));
  console.log(`external urls: ${all.length}; skipped (instagram/maps/whatsapp/facebook): ${skipped.length}; to check: ${todo.length}`);

  // one in flight per host
  const byHost = new Map();
  for (const u of todo) {
    const h = new URL(u).host;
    if (!byHost.has(h)) byHost.set(h, []);
    byHost.get(h).push(u);
  }
  const hostQueues = [...byHost.values()];
  const results = [];
  let qi = 0;
  let done = 0;
  const runners = Array.from({ length: CONCURRENCY }, async () => {
    while (qi < hostQueues.length) {
      const queue = hostQueues[qi++];
      for (const u of queue) {
        const r = await check(u);
        results.push({ url: u, refs: refs.get(u), ...r, verdict: classify(u, r), checkedAt: new Date().toISOString() });
        done += 1;
        if (done % 50 === 0) console.log(`  ${done}/${todo.length}`);
      }
    }
  });
  await Promise.all(runners);
  for (const u of skipped) results.push({ url: u, refs: refs.get(u), verdict: "skipped_by_policy" });
  await writeFile(OUT, results.map((r) => JSON.stringify(r)).join("\n") + "\n");
  const counts = results.reduce((acc, r) => ((acc[r.verdict] = (acc[r.verdict] ?? 0) + 1), acc), {});
  console.log(JSON.stringify(counts));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
