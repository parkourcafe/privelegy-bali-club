#!/usr/bin/env node
// Deterministic validator between collector and acceptor.
//
//   node validate-claims.mjs <claims.json> [--out <validated.json>]
//
// A claim passes only when its quote is present in the stored snapshot text
// for its source URL, the source is an allowed domain for this venue, and the
// value sits inside the field's plausibility bound
// (.agents/skills/otherbali-data-ops-run/references/acceptance-rules.md).
// Fails are attached with a reason; nothing is silently dropped.

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BATCH = resolve(HERE, "..");

const DENY = /(tripadvisor|wanderlog|airial|wanderboat|happycow|horego|baliready|menustic|zomato|yelp|foursquare|google\.[a-z.]+\/maps|maps\.app\.goo\.gl|cloudbeds|linktr\.ee|linkin\.bio|beacons\.ai|facebook\.com|instagram\.com|otherbali\.com|booking\.com|agoda|expedia|hotels\.com|traveloka|tiket\.com|klook|getyourguide|viator|ubereats|grab\.com|gofood|gojek|shopeefood)/i;
const BOOKING_PROVIDERS = /(sevenrooms\.com|tablecheck\.com|chope\.co|dishcult\.com|opentable\.com|resy\.com|tock\.com|eatigo|quandoo|tablepilot)/i;
const ULU_BOX = { lat: [-8.87, -8.74], lng: [115.03, 115.25] };

const normQuote = (s) => (s ?? "").normalize("NFKC").replace(/[‘’‚‛]/g, "'").replace(/[“”„‟]/g, '"').replace(/[–—−]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();

const registrable = (host) => {
  const l = host.toLowerCase().replace(/^www\./, "").split(".");
  const two = l.slice(-2).join(".");
  return ["co.id", "or.id", "my.id", "co.uk", "com.au", "com.sg"].includes(two) ? l.slice(-3).join(".") : two;
};

function parseTime(s) {
  const m = String(s).trim().match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  const ap = m[3]?.toLowerCase();
  if (ap === "pm" && h < 12) h += 12;
  if (ap === "am" && h === 12) h = 0;
  if (h > 24 || min > 59) return null;
  return h * 60 + min;
}

// value shape for hours claims: {"Monday":["8.00am-10.00pm"], ..., "Sunday":[]} or "until late" text.
function hoursBound(value, category) {
  if (typeof value === "string") return /late|last guest/i.test(value) ? null : "hours as free text must be the open-ended 'until late' form; otherwise use per-day JSON";
  if (!value || typeof value !== "object") return "hours must be per-day JSON";
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  for (const d of days) if (!(d in value)) return `missing day ${d} (closed day must be [])`;
  for (const d of days) {
    for (const span of value[d]) {
      const m = String(span).match(/^(.+?)\s*-\s*(.+?)$/);
      if (!m) return `${d}: '${span}' is not 'open-close'`;
      const trailing = m[2].match(/(am|pm)$/i)?.[1];
      const open = parseTime(/(am|pm)$/i.test(m[1]) || !trailing ? m[1] : `${m[1]}${trailing}`);
      const close = parseTime(m[2]);
      if (open === null || close === null) return `${d}: cannot parse '${span}'`;
      if (category === "cafe" && (open < 5 * 60 || (close <= 14 * 60 && close > open))) return `${d}: implausible café window ${span}`;
      if (open === 14 * 60 && close === 23 * 60 + 59) return `${d}: 14:00–23:59 looks like a hotel check-in window`;
      if (open === 0 && close >= 23 * 60 + 59) return `${d}: 24h window is suspect`;
    }
  }
  return null;
}

function bound(claim) {
  const v = claim.proposed;
  switch (claim.field) {
    case "hours":
    case "opening_hours_json":
      return hoursBound(v, claim.category);
    case "phone":
      return /^\+62\d{7,13}$/.test(String(v).replace(/[\s()-]/g, "")) ? null : "phone must be the venue's own number in +62 form";
    case "address":
    case "full_address":
      return /\b(jl\.?|jalan|gg\.?|gang|banjar|br\.?|street|st\.|road|rd\.)\b/i.test(String(v)) && !/\b(verify|tbc|todo|check|confirm|boundary|approx)\b/i.test(String(v)) ? null : "address needs a street marker (Jl./Jalan/Gang/Banjar) and no working notes";
    case "coordinates": {
      const [lat, lng] = Array.isArray(v) ? v : String(v).split(",").map(Number);
      const dec = (n) => (String(n).split(".")[1] ?? "").length;
      if (!(lat >= ULU_BOX.lat[0] && lat <= ULU_BOX.lat[1] && lng >= ULU_BOX.lng[0] && lng <= ULU_BOX.lng[1])) return "outside the uluwatu-bukit bounding box";
      if (dec(lat) < 5 || dec(lng) < 5) return "fewer than 5 decimals";
      return null;
    }
    case "price_anchor":
      return /\d/.test(String(v)) && /(idr|rp|k\b)/i.test(String(v)) && /[a-z]{3,}/i.test(String(v).replace(/idr|rp/gi, "")) ? null : "price anchor needs a number, a currency marker (IDR/Rp/K) and the named item";
    case "what_to_order":
      return String(v) === String(v).toLowerCase() && !/,/.test(String(v)) ? null : "what_to_order must be lowercase and ';'-separated";
    default:
      return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const file = resolve(args[0]);
  const outIdx = args.indexOf("--out");
  const out = outIdx >= 0 ? resolve(args[outIdx + 1]) : file.replace(/\.json$/, ".validated.json");
  const doc = JSON.parse(await readFile(file, "utf8"));
  const claims = Array.isArray(doc) ? doc : doc.claims;
  const slug = doc.slug ?? claims[0]?.slug;
  const idx = (await readFile(join(BATCH, "snapshots", slug, "index.jsonl"), "utf8").catch(() => "")).split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const officialDomains = new Set((doc.officialDomains ?? []).map((d) => registrable(d)));
  const textCache = new Map();
  const results = [];
  for (const c of claims) {
    const reasons = [];
    if (c.action === "keep") {
      results.push({ ...c, validator: "skip", reasons: ["keep: nothing to verify"] });
      continue;
    }
    if (c.action === "remove") {
      results.push({ ...c, validator: c.quote ? "pass" : "pass", reasons: ["remove: acceptor must try to find support on official domains"] });
      continue;
    }
    if (!c.source_url) reasons.push("no source_url — a row without a source is not accepted");
    else {
      let host = "";
      try {
        host = new URL(c.source_url).host;
      } catch {
        reasons.push("source_url is not a URL");
      }
      if (host) {
        if (DENY.test(c.source_url)) reasons.push("source is an aggregator/social/map/booking-engine host (denylist)");
        else if (BOOKING_PROVIDERS.test(host)) {
          if (!c.booking_link_quote) reasons.push("booking provider allowed only when the official site links to it: add booking_link_quote from an official page");
        } else if (officialDomains.size && !officialDomains.has(registrable(host))) reasons.push(`host ${host} is not among the venue's official domains (${[...officialDomains].join(", ")})`);
      }
      const snap = idx.filter((e) => e.url === c.source_url && e.status === 200 && e.textFile).at(-1);
      if (!snap) reasons.push("no 200 snapshot with text for this source_url (run snapshot.mjs)");
      else if (!c.quote) reasons.push("no quote");
      else {
        let text = textCache.get(snap.textFile);
        if (text === undefined) {
          text = normQuote(await readFile(join(BATCH, "snapshots", slug, snap.textFile), "utf8"));
          textCache.set(snap.textFile, text);
        }
        if (!text.includes(normQuote(c.quote))) reasons.push("quote not found verbatim in the snapshot text");
        if (snap.sha256 !== c.snapshot_sha256) reasons.push("snapshot_sha256 does not match the stored snapshot");
      }
    }
    if (c.class === "E") reasons.push("class E (experiential) needs a recorded visit: HOLD for founder attestation");
    if (c.class === "Q") reasons.push("class Q (quality/review-derived) is a removal candidate, not a value to accept");
    const b = c.action === "add" || c.action === "replace" ? bound(c) : null;
    if (b) reasons.push(`bound: ${b}`);
    if (c.multi_branch && !c.branch_evidence) reasons.push("multi-branch brand: needs branch-specific URL or a quote naming the branch");
    results.push({ ...c, validator: reasons.length ? "fail" : "pass", reasons });
  }
  await writeFile(out, JSON.stringify({ slug, validatedAt: new Date().toISOString(), claims: results }, null, 2));
  const counts = results.reduce((a, r) => ((a[r.validator] = (a[r.validator] ?? 0) + 1), a), {});
  console.log(JSON.stringify({ slug, counts, out }));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
