import { test } from "node:test";
import assert from "node:assert/strict";
import { placeDisplayLabel, practicalTagLabel, practicalTagsLine, venueKickerLine } from "./venue-display";

test("a district repeated as the area is shown once", () => {
  assert.equal(
    venueKickerLine({ category: "Restaurant", area: "Canggu", district: "canggu" }),
    "Restaurant · Canggu",
  );
  assert.equal(
    venueKickerLine({ category: "Restaurant", area: "Denpasar", district: "denpasar" }),
    "Restaurant · Denpasar",
  );
});

test("raw slugs are labelled and Unknown is dropped", () => {
  assert.equal(venueKickerLine({ category: "Restaurant", area: "ubud", district: "ubud" }), "Restaurant · Ubud");
  assert.equal(venueKickerLine({ category: "Wellness", area: null, district: "karangasem" }), "Wellness · Karangasem");
  assert.equal(venueKickerLine({ category: "Restaurant", area: "Unknown", district: "bangli" }), "Restaurant · Bangli");
  assert.equal(venueKickerLine({ category: "Cafe", area: "", district: "tabanan" }), "Cafe · Tabanan");
});

test("a distinct area and the price band are kept in order", () => {
  assert.equal(
    venueKickerLine({ category: "Beach club", area: "Berawa", district: "canggu", priceBand: "$$" }),
    "Beach club · Berawa · Canggu · $$",
  );
  assert.equal(
    venueKickerLine({ category: "Restaurant", area: "kuta", district: "kuta-legian" }),
    "Restaurant · Kuta · Kuta & Legian",
  );
});

test("text an editor wrote is shown as written", () => {
  assert.equal(placeDisplayLabel("Batu Bolong / Berawa"), "Batu Bolong / Berawa");
  assert.equal(placeDisplayLabel("unknown"), null);
});

test("known practical tags get short labels that say only what the tag says", () => {
  assert.equal(
    practicalTagsLine(["rain-proof", "quiet-enough-to-talk", "big-groups", "parking"]),
    "Rain-proof · Quiet enough to talk · Good for big groups · Parking",
  );
  assert.equal(practicalTagLabel("walk-in-friendly"), "Walk-in friendly");
  assert.equal(practicalTagLabel("kid-friendly"), "Kid-friendly");
  assert.equal(practicalTagLabel("ac"), "Air-con");
});

test("unknown tags fall back to the slug with spaces", () => {
  assert.equal(practicalTagLabel("rooftop-seating"), "Rooftop seating");
  assert.equal(practicalTagLabel("fast wifi"), "Fast wifi");
});

test("tags that map to the same label are listed once", () => {
  assert.equal(practicalTagsLine(["ac", "air-con", "parking", " "]), "Air-con · Parking");
});
