// Importer gates (IA spec §9, §19.3-5, §19.12): mapping, [NO DATA]
// normalization, money/URL/date validation, determinism, property→venue→offers
// without duplicated places, never-publish.
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  importResortCsv,
  normalizeText,
  parseIdr,
  derivePriceStatus,
  slugify,
  validHttpsUrl,
  validIsoDate,
} from "./resort-import.ts";

const CSV = readFileSync(
  join(process.cwd(), "data/resort-fnb/verified/Bali_Nusa_Dua_FnB_DayUse_20260719.csv"),
  "utf8",
);

test("[NO DATA] and research markers never become business values", () => {
  assert.equal(normalizeText("[NO DATA]"), null);
  assert.equal(normalizeText(""), null);
  assert.equal(normalizeText("[ИНТЕРПРЕТАЦИЯ] пары, honeymoon"), "пары, honeymoon");
  const out = importResortCsv(CSV);
  const all = JSON.stringify([out.properties, out.venues, out.offers]);
  assert.ok(!all.includes("[NO DATA]"), "[NO DATA] leaked into output");
  assert.ok(!all.includes("ИНТЕРПРЕТАЦИЯ"), "research marker leaked into output");
});

test("money parsing: IDR only, ranges, no cross-currency guesses", () => {
  assert.deepEqual(parseIdr("IDR 798,000++ adult; IDR 400,000++ child"), {
    currency: "IDR",
    priceMinor: 798000,
    priceMinMinor: 400000,
    priceMaxMinor: 798000,
  });
  assert.equal(parseIdr("Day AUD 127.85 adult").currency, null);
  assert.equal(parseIdr(null).priceMinor, null);
  assert.equal(parseIdr("IDR 6,000,000 per couple").priceMinor, 6000000);
});

test("URL/date validation drops invalid values instead of inventing", () => {
  assert.equal(validHttpsUrl("http://insecure.example"), null);
  assert.equal(validHttpsUrl("https://ok.example/x"), "https://ok.example/x");
  assert.equal(validIsoDate("2026-07-19"), "2026-07-19");
  assert.equal(validIsoDate("19/07/2026"), null);
});

test("price status: official→verified, blog→call_to_confirm, conflict/call→call_to_confirm", () => {
  assert.equal(derivePriceStatus("IDR 1", "official_hotel", "current_official"), "verified");
  assert.equal(derivePriceStatus("IDR 1", "secondary_blog", "secondary_current_call_required"), "call_to_confirm");
  assert.equal(derivePriceStatus("IDR 1", "official_conflict", "official_conflict_call_required"), "call_to_confirm");
  assert.equal(derivePriceStatus(null, "official_hotel", null), "not_published");
});

test("real CSV: property→venue→offers, no duplicate entities, never published", () => {
  const out = importResortCsv(CSV);
  assert.ok(out.properties.length >= 15, `properties: ${out.properties.length}`);
  assert.ok(out.offers.length >= 10, `offers: ${out.offers.length}`);
  assert.ok(out.venues.length >= 30, `venues: ${out.venues.length}`);
  // One property carries multiple offers without duplicating the property.
  const kemp = out.properties.filter((p) => p.slug.includes("apurva-kempinski"));
  assert.equal(kemp.length, 1, "Kempinski duplicated as a property");
  const kempOffers = out.offers.filter((o) => o.propertyId === kemp[0].id);
  assert.ok(kempOffers.length >= 2, "expected multiple Kempinski offers");
  // Slugs unique across venues+offers.
  const slugs = [...out.venues, ...out.offers].map((x) => x.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slugs");
  // §9.6: nothing auto-published.
  for (const e of [...out.properties, ...out.venues, ...out.offers]) {
    assert.equal(e.publicationStatus, "review");
  }
  // Laguna conflict row must not come out "verified".
  const laguna = out.offers.find((o) => o.slug.includes("arwana-sunday-brunch"));
  assert.ok(laguna, "laguna brunch missing");
  assert.notEqual(laguna!.priceStatus, "verified");
});

test("determinism: same input → identical output", () => {
  const a = JSON.stringify(importResortCsv(CSV));
  const b = JSON.stringify(importResortCsv(CSV));
  assert.equal(a, b);
});

test("slugify is stable and url-safe", () => {
  assert.equal(slugify("The Apurva Kempinski Bali"), "the-apurva-kempinski-bali");
  assert.equal(slugify("Brunchcation at Pala!"), "brunchcation-at-pala");
});
