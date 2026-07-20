// Resort repository gates (IA spec §13, §19.6, §19.10-12): only whitelisted +
// gated offers are public; hub gate thresholds; the same property carries
// multiple offers without duplicating the property; a hypothetically
// whitelisted+gated offer becomes public.
import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  offersByType,
  hotelRestaurants,
  publicOfferSlugs,
  globalHubPasses,
  districtHubPasses,
  hubDistrict,
  isOfferPublishable,
  getOffer,
} from "./resort-repo.ts";
import { RESORT_PUBLISH_WHITELIST } from "./resort-publication.ts";
import { HUB_GATES } from "./resort.ts";

test("only whitelisted + gated offers are public (§10.3)", () => {
  // Every published slug is exactly the (English-copy-reviewed) whitelist --
  // nothing the importer produces is ever auto-public, and nothing on the
  // whitelist is silently dropped by the gate.
  assert.deepEqual(new Set(publicOfferSlugs()), RESORT_PUBLISH_WHITELIST);
  assert.equal(hotelRestaurants("public").length, 0); // no hotel-restaurant venue reviewed/whitelisted yet
  // A held-back offer (source conflict, unconfirmed price, or an access
  // restriction the schema can't yet express) stays hidden even though it's
  // in the same imported dataset.
  assert.equal(isOfferPublishable(getOffer("the-mulia-bali--soleil-sunday-brunch")!), false);
});

test("preview scope still exposes imported rows (owner-only surface)", () => {
  assert.ok(offersByType("day_pass", "preview").length > 0);
  assert.ok(hotelRestaurants("preview").length >= 30);
});

test("hub gate thresholds come from config, and empty sets fail", () => {
  assert.equal(globalHubPasses([]), false);
  assert.equal(districtHubPasses([]), false);
  // exactly at threshold, enough districts
  const entries = Array.from({ length: HUB_GATES.globalHub.minEntries }, (_, i) => ({
    district: ["nusa-dua", "canggu", "ubud"][i % 3],
  }));
  assert.equal(globalHubPasses(entries), true);
  // enough entries but too few districts
  const oneDistrict = Array.from({ length: HUB_GATES.globalHub.minEntries }, () => ({ district: "nusa-dua" }));
  assert.equal(globalHubPasses(oneDistrict), false);
});

test("tanjung-benoa groups under nusa-dua for hubs", () => {
  assert.equal(hubDistrict("tanjung-benoa"), "nusa-dua");
  assert.equal(hubDistrict("canggu"), "canggu");
});

test("a whitelisted + gated offer would publish; a bare slug would not", () => {
  // pick an imported offer with source + date + includes + a booking channel
  const preview = offersByType("brunch", "preview");
  const candidate = preview.find(
    (o) => o.sourceUrl && o.accessedAt && o.whatsIncluded && (o.bookingChannel || o.priceStatus === "call_to_confirm"),
  );
  assert.ok(candidate, "expected a gate-eligible imported brunch");
  assert.equal(isOfferPublishable(candidate!), false); // not whitelisted yet
  RESORT_PUBLISH_WHITELIST.add(candidate!.slug);
  try {
    assert.equal(isOfferPublishable(getOffer(candidate!.slug)!), true);
  } finally {
    RESORT_PUBLISH_WHITELIST.delete(candidate!.slug);
  }
});

test("multiple offers per property without duplicating the property (§19.12)", () => {
  const all = offersByType("brunch", "preview").concat(offersByType("day_pass", "preview"));
  const kemp = all.filter((o) => o.property?.slug?.includes("apurva-kempinski"));
  assert.ok(kemp.length >= 2, "expected multiple Kempinski offers");
  const propIds = new Set(kemp.map((o) => o.property?.id));
  assert.equal(propIds.size, 1, "property duplicated across its offers");
});
