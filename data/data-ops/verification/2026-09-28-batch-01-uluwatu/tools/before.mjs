#!/usr/bin/env node
// Batch 1 step 0: the before-state of the Uluwatu 25 and where each visible
// field comes from.
//
//   node before.mjs --parsed <parsed.jsonl from docs/audits/2026-09-28-web/tools> --out <dir>
//
// Writes before.json (live card + main registry entry + field-source verdict per
// venue) and leads.json (URLs only, from the Codex packs, the July batch layer
// and registry evidence). Values from the packs and the July layer are written
// to codex-proposals.json for the survival metric only; collectors get URLs,
// never those values, and acceptors get neither.

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ULUWATU_VENUES } from "../../../../../lib/uluwatu/venues.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../../../../..");
const args = process.argv.slice(2);
const val = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const PARSED = resolve(val("--parsed", "parsed.jsonl"));
const OUT = resolve(val("--out", resolve(HERE, "..")));

const PACKS = join(REPO, "data/data-ops/ai-visible-venues");
const JULY = ["uluwatu-bukit-01", "uluwatu-bukit-02", "uluwatu-bukit-03"].map((b) => join(REPO, "data/data-ops/batches", b));

const norm = (s) => (s ?? "").toString().replace(/\s+/g, " ").trim();
const same = (a, b) => norm(a).toLowerCase() === norm(b).toLowerCase();

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

function collectUrls(value, out = new Set()) {
  if (typeof value === "string") {
    for (const m of value.matchAll(/https?:\/\/[^\s"'<>)]+/g)) out.add(m[0].replace(/[.,;]+$/, ""));
  } else if (Array.isArray(value)) value.forEach((v) => collectUrls(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectUrls(v, out));
  return out;
}

const parsed = (await readFile(PARSED, "utf8")).split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((p) => !p.recordTag);
const liveBySlug = new Map(parsed.filter((p) => p.place).map((p) => [p.place.slug, p]));
const registryBySlug = new Map(ULUWATU_VENUES.map((v) => [v.slug, v]));
const packSlugs = (await readdir(PACKS, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();

const julyVenues = new Map();
const julyManifest = new Map();
for (const dir of JULY) {
  const ev = await readJson(join(dir, "evidence.json"));
  const man = await readJson(join(dir, "source-manifest.json"));
  for (const v of ev?.venues ?? []) julyVenues.set(v.venueSlug ?? v.slug, { batch: dir.split("/").pop(), ...v });
  for (const s of man?.sources ?? []) julyManifest.set(s.id, s);
}

const before = [];
const leads = {};
const codexProposals = {};
for (const slug of packSlugs) {
  const live = liveBySlug.get(slug);
  const reg = registryBySlug.get(slug) ?? null;
  const pl = live?.place;
  const pair = (block, label) => pl?.blocks?.[block]?.pairs?.find((x) => x.label === label) ?? null;
  const liveFields = pl
    ? {
        name: pl.name,
        kicker: pl.kicker,
        verdict: pl.verdict,
        whyHere: pl.sections?.["Why it's here"] ?? null,
        whatToExpect: pl.sections?.["What to expect"] ?? null,
        bestFor: pair("Quick decision", "Best for")?.value ?? null,
        notFor: pair("Quick decision", "Not for")?.value ?? null,
        whatToOrder: pair("Quick decision", "What to order")?.value ?? null,
        practicalNote: pair("Quick decision", "Practical note")?.value ?? null,
        reservations: pair("Quick decision", "Reservations")?.value ?? null,
        where: pair("Practical", "Where")?.value ?? null,
        hours: pair("Practical", "Hours")?.value ?? null,
        phoneVisible: pair("Practical", "Phone")?.value ?? null,
        spend: pair("Practical", "Spend")?.value ?? null,
        goodToKnow: pair("Practical", "Good to know")?.value ?? null,
        website: pair("Practical", "Website")?.links?.[0] ?? null,
        instagram: pair("Practical", "Instagram")?.links?.[0] ?? null,
        menuLink: pair("Practical", "Menu")?.links?.[0] ?? null,
        lastChecked: pl.lastChecked,
        actions: pl.actions,
        menus: pl.menus,
        ld: pl.ld,
        title: live.title,
        metaDescription: live.metaDescription,
      }
    : null;

  // Which layer produced each registry-backed field on the live page.
  const compare = reg && liveFields
    ? {
        name: same(liveFields.name, reg.displayName),
        verdict: same(liveFields.verdict, reg.verdict),
        whyHere: same(liveFields.whyHere, reg.whyHere),
        whatToExpect: same(liveFields.whatToExpect, reg.whatToExpect),
        bestFor: same(liveFields.bestFor, reg.bestFor),
        notFor: reg.notFor ? same(liveFields.notFor, reg.notFor) : liveFields.notFor === null,
        practicalNote: reg.visitContext ? same(liveFields.practicalNote, reg.visitContext) : null,
        reservations: reg.reservation ? same(liveFields.reservations, reg.reservation) : null,
        where: reg.address ? same(liveFields.where, reg.address) : null,
        hours: reg.openingHours ? same(liveFields.hours, reg.openingHours) : null,
        lastChecked: same(liveFields.lastChecked, reg.lastVerifiedAt),
      }
    : null;
  const compared = compare ? Object.values(compare).filter((v) => v !== null) : [];
  const drift = compared.length ? compared.filter((v) => v === false).length / compared.length : null;

  const pack = {
    manifest: await readJson(join(PACKS, slug, "source-manifest.json")),
    draft: await readJson(join(PACKS, slug, "draft-venue-record.json")),
  };
  const july = julyVenues.get(slug) ?? null;
  const urls = new Set();
  collectUrls(pack.manifest, urls);
  collectUrls(pack.draft?.candidate?.actions ?? [], urls);
  for (const e of reg?.evidence ?? []) if (e.sourceUrl?.startsWith("http")) urls.add(e.sourceUrl);
  for (const k of ["officialUrl", "instagramUrl", "bookingUrl", "menuUrl"]) if (reg?.[k]) urls.add(reg[k]);
  if (july) {
    collectUrls(july.actions ?? [], urls);
    for (const id of new Set([...(JSON.stringify(july).matchAll(/"sourceManifestId":"([^"]+)"/g))].map((m) => m[1]))) {
      const src = julyManifest.get(id);
      if (src?.url) urls.add(src.url);
    }
  }
  if (liveFields?.website) urls.add(liveFields.website);
  if (liveFields?.instagram) urls.add(liveFields.instagram);
  const leadUrls = [...urls]
    .filter((u) => !/otherbali\.com|google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(u))
    .sort();
  leads[slug] = leadUrls;
  codexProposals[slug] = { codex: pack.draft?.candidate ?? null, july: july ?? null };

  before.push({
    slug,
    liveUrl: `https://www.otherbali.com/places/${slug}`,
    liveStatus: live?.status ?? "not in crawl (not in sitemap; not linked)",
    live: liveFields,
    registry: reg
      ? {
          displayName: reg.displayName,
          category: reg.category,
          microArea: reg.microArea,
          publication: reg.publication,
          verdict: reg.verdict,
          whyHere: reg.whyHere,
          whatToExpect: reg.whatToExpect,
          bestFor: reg.bestFor,
          notFor: reg.notFor ?? null,
          visitContext: reg.visitContext ?? null,
          reservation: reg.reservation ?? null,
          whatToOrder: reg.whatToOrder ?? null,
          priceBand: reg.priceBand ?? null,
          address: reg.address ?? null,
          openingHours: reg.openingHours ?? null,
          officialUrl: reg.officialUrl ?? null,
          instagramUrl: reg.instagramUrl ?? null,
          bookingUrl: reg.bookingUrl ?? null,
          menuUrl: reg.menuUrl ?? null,
          attributes: reg.attributes ?? [],
          lastVerifiedAt: reg.lastVerifiedAt,
          evidence: reg.evidence,
        }
      : null,
    liveMatchesMainRegistry: compare,
    registryDrift: drift,
  });
}

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, "before.json"), JSON.stringify({ capturedFrom: "docs/audits/2026-09-28-web crawl (dpl_DL37hh8JiQV6NWKGxaV4RyKhnfqL)", mainCommit: "beff274", venues: before }, null, 2));
await writeFile(join(OUT, "leads.json"), JSON.stringify(leads, null, 2));
await writeFile(join(OUT, "codex-proposals.json"), JSON.stringify(codexProposals, null, 2));
const drifts = before.filter((b) => b.registryDrift !== null);
const totalCompared = drifts.reduce((a, b) => a + Object.values(b.liveMatchesMainRegistry).filter((v) => v !== null).length, 0);
const totalMismatch = drifts.reduce((a, b) => a + Object.values(b.liveMatchesMainRegistry).filter((v) => v === false).length, 0);
console.log(JSON.stringify({
  venues: before.length,
  live200: before.filter((b) => b.liveStatus === 200).length,
  inRegistry: before.filter((b) => b.registry).length,
  registryFieldsCompared: totalCompared,
  registryFieldsMismatched: totalMismatch,
  driftShare: totalCompared ? +(totalMismatch / totalCompared).toFixed(3) : null,
  perVenueDrift: Object.fromEntries(before.map((b) => [b.slug, b.registryDrift === null ? null : +b.registryDrift.toFixed(2)])),
  leadsPerVenue: Object.fromEntries(Object.entries(leads).map(([k, v]) => [k, v.length])),
}, null, 1));
