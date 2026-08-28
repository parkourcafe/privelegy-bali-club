import assert from "node:assert/strict";
import test from "node:test";

import {
  publishableStreetAddress,
  publicVenueEditorialText,
  venueCategoryLabel,
  venueCoverAssetCategory,
  venueSchemaType,
} from "./venue-presentation";

test("suppresses import placeholders and internal notes from public editorial copy", () => {
  const rejected = [
    "Travellers looking for a current place to eat in Ubud.",
    "Best for: Travellers looking for a current place to eat in Seminyak.",
    "Travellers who want to check availability and reserve a table through Chope",
    "Ari's is an owner-confirmed dining venue in Seminyak.",
    "Found online as 'Warung Mangga Madu' — note the DB entry drops one g.",
    "Travellers looking for somewhere to eat in Unknown",
    "Unknown",
    "undefined",
  ];

  for (const value of rejected) {
    assert.equal(publicVenueEditorialText(value), undefined);
  }

  assert.equal(
    publicVenueEditorialText("  Quiet courtyard for an unhurried lunch.  "),
    "Quiet courtyard for an unhurried lunch.",
  );
});

test("presents villa venues with lodging metadata and the existing hotel cover", () => {
  assert.equal(venueCategoryLabel("villa"), "Villa");
  assert.equal(venueSchemaType("villa"), "LodgingBusiness");

  const coverAssetCategory = venueCoverAssetCategory("villa");

  assert.equal(coverAssetCategory, "hotel");
  assert.equal(`/covers/${coverAssetCategory}.webp`, "/covers/hotel.webp");
  assert.notEqual(`/covers/${coverAssetCategory}.webp`, "/covers/villa.webp");
});

test("preserves established labels and schema types for existing categories", () => {
  const cases = [
    ["restaurant", "Restaurant", "Restaurant"],
    ["cafe", "Café", "CafeOrCoffeeShop"],
    ["bar", "Bar", "BarOrPub"],
    ["spa", "Wellness", "HealthAndBeautyBusiness"],
    ["hotel", "Hotel", "Hotel"],
    ["resort", "Resort", "Resort"],
    ["attraction", "Attraction", "TouristAttraction"],
  ] as const;

  for (const [category, label, schemaType] of cases) {
    assert.equal(venueCategoryLabel(category), label);
    assert.equal(venueSchemaType(category), schemaType);
    assert.equal(venueCoverAssetCategory(category), category);
  }
});

test("publishableStreetAddress accepts a real address", () => {
  assert.equal(
    publishableStreetAddress("Jl. Pantai Batu Bolong No.10, Canggu"),
    "Jl. Pantai Batu Bolong No.10, Canggu",
  );
  assert.equal(
    publishableStreetAddress("Jalan Labuan Sait, Pecatu, Kuta Selatan, Badung, Bali 80361"),
    "Jalan Labuan Sait, Pecatu, Kuta Selatan, Badung, Bali 80361",
  );
  assert.equal(
    publishableStreetAddress("Br. Nagi, Jl. Lanyahan, Petulu, Ubud, Gianyar, Bali 80571"),
    "Br. Nagi, Jl. Lanyahan, Petulu, Ubud, Gianyar, Bali 80571",
  );
});

test("publishableStreetAddress rejects an area note", () => {
  // These are the values venues.full_address actually holds for most rows.
  assert.equal(publishableStreetAddress("Canggu/Batu Bolong/Berawa"), undefined);
  assert.equal(publishableStreetAddress("Pecatu / uluwatu bukit"), undefined);
  assert.equal(publishableStreetAddress("Ubud"), undefined);
  assert.equal(publishableStreetAddress("Tibubeneng / Canggu / Berawa near Finns"), undefined);
});

test("publishableStreetAddress rejects an operator's working note", () => {
  // Publishing these as a postal address states something false, and an empty
  // field would at least be visible.
  assert.equal(publishableStreetAddress("Berawa boundary / verify pin"), undefined);
  assert.equal(publishableStreetAddress("Canggu shortcut / verify branch"), undefined);
  assert.equal(publishableStreetAddress("Jl. Raya Ubud — verify"), undefined);
});

test("publishableStreetAddress ignores non-strings and blanks", () => {
  assert.equal(publishableStreetAddress(null), undefined);
  assert.equal(publishableStreetAddress(undefined), undefined);
  assert.equal(publishableStreetAddress(""), undefined);
  assert.equal(publishableStreetAddress("   "), undefined);
});
