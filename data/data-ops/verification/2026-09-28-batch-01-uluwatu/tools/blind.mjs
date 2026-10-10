#!/usr/bin/env node
// Produces the acceptor's input: claims stripped of everything the collector
// concluded, plus canary claims that must be rejected.
//
//   node blind.mjs <slug> [--canaries 3] [--seed <n>]
//
// Reads claims/<slug>/claims.json, writes claims/<slug>/blinded.json (the only
// file an acceptor reads) and claims/<slug>/canaries.json (the answer key; the
// acceptor never opens it). Canary kinds:
//   fabricated_quote — real official URL, quote that is not on the page;
//   aggregator_source — value sourced to a review aggregator;
//   wrong_venue_source — a real quote from another venue's official page.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BATCH = resolve(HERE, "..");
const args = process.argv.slice(2);
const slug = args[0];
const val = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const N = Number(val("--canaries", "3"));
let seed = Number(val("--seed", "7"));
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

const doc = JSON.parse(await readFile(join(BATCH, "claims", slug, "claims.json"), "utf8"));
const officialDomains = doc.officialDomains ?? [];
const index = (await readFile(join(BATCH, "snapshots", slug, "index.jsonl"), "utf8").catch(() => "")).split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((e) => e.status === 200 && e.textFile);
const official = index.find((e) => officialDomains.some((d) => e.url.includes(d)));

const blindOne = (c) => ({ claim_id: c.claim_id, field: c.field, action: c.action, proposed: c.proposed ?? null, claim_text: c.action === "remove" ? c.live_value ?? c.claim_text ?? null : null, source_url: c.source_url ?? null, quote: c.quote ?? null, snapshot_sha256: c.snapshot_sha256 ?? null, category: c.category ?? doc.category ?? null });
const real = (doc.claims ?? []).filter((c) => c.action !== "keep").map(blindOne);

const canaries = [];
const kinds = ["fabricated_quote", "aggregator_source", "wrong_venue_source"];
for (let i = 0; i < N; i += 1) {
  const kind = kinds[i % kinds.length];
  const id = `k-${slug.slice(0, 6)}-${i + 1}`;
  if (kind === "fabricated_quote" && official) {
    canaries.push({ kind, claim: { claim_id: id, field: "hours", action: "add", proposed: { Monday: ["7.00am-11.00pm"], Tuesday: ["7.00am-11.00pm"], Wednesday: ["7.00am-11.00pm"], Thursday: ["7.00am-11.00pm"], Friday: ["7.00am-11.00pm"], Saturday: ["7.00am-11.00pm"], Sunday: ["7.00am-11.00pm"] }, claim_text: null, source_url: official.url, quote: "Open daily 7 AM – 11 PM, kitchen closes 10:30 PM", snapshot_sha256: official.sha256, category: doc.category ?? null } });
  } else if (kind === "aggregator_source") {
    canaries.push({ kind, claim: { claim_id: id, field: "price_anchor", action: "add", proposed: "$$ · mains 85–160K", claim_text: null, source_url: `https://www.tripadvisor.com/Restaurant_Review-${slug}`, quote: "Price range: IDR 85,000 – 160,000", snapshot_sha256: null, category: doc.category ?? null } });
  } else {
    // borrow a real quote from another venue's official snapshot
    const others = (await readdir(join(BATCH, "snapshots"), { withFileTypes: true })).filter((d) => d.isDirectory() && d.name !== slug).map((d) => d.name);
    const other = others[Math.floor(rnd() * others.length)];
    const oi = (await readFile(join(BATCH, "snapshots", other, "index.jsonl"), "utf8").catch(() => "")).split("\n").filter(Boolean).map((l) => JSON.parse(l)).find((e) => e.status === 200 && e.textFile && !/instagram|facebook/.test(e.url));
    if (oi) {
      const text = await readFile(join(BATCH, "snapshots", other, oi.textFile), "utf8");
      const line = text.split("\n").map((l) => l.trim()).find((l) => /\b(am|pm)\b/i.test(l) && l.length > 12 && l.length < 90) ?? text.split("\n").find((l) => l.trim().length > 30)?.trim();
      canaries.push({ kind, claim: { claim_id: id, field: "address", action: "replace", proposed: line, claim_text: null, source_url: oi.url, quote: line, snapshot_sha256: oi.sha256, category: doc.category ?? null }, borrowedFrom: other });
    }
  }
}

const mixed = [...real, ...canaries.map((k) => k.claim)];
for (let i = mixed.length - 1; i > 0; i -= 1) {
  const j = Math.floor(rnd() * (i + 1));
  [mixed[i], mixed[j]] = [mixed[j], mixed[i]];
}
await writeFile(join(BATCH, "claims", slug, "blinded.json"), JSON.stringify({ slug, officialDomains, category: doc.category ?? null, claims: mixed }, null, 2));
await writeFile(join(BATCH, "claims", slug, "canaries.json"), JSON.stringify({ slug, canaries: canaries.map((k) => ({ claim_id: k.claim.claim_id, kind: k.kind, borrowedFrom: k.borrowedFrom ?? null })) }, null, 2));
console.log(JSON.stringify({ slug, real: real.length, canaries: canaries.length }));
