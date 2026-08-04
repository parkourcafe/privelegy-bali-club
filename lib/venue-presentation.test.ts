import assert from "node:assert/strict";
import test from "node:test";

import {
  publishableGeoCoordinates,
  publishableStreetAddress,
  venueCategoryLabel,
  venueCoverAssetCategory,
  venueSchemaType,
} from "./venue-presentation";

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

test("publishableGeoCoordinates accepts a real Bali pin", () => {
  // Values written by the coordinate run of 2026-08-04, resolved from the
  // venues' own sites and their stored Maps pins.
  assert.deepEqual(publishableGeoCoordinates(-8.6589493, 115.1381321), {
    latitude: -8.6589493,
    longitude: 115.1381321,
  });
  assert.deepEqual(publishableGeoCoordinates(-8.660204, 115.142973), {
    latitude: -8.660204,
    longitude: 115.142973,
  });
});

test("publishableGeoCoordinates refuses a half-filled pair", () => {
  // 332 of the 336 venues in the launch districts still hold exactly this
  // shape. A lone latitude must publish nothing at all.
  assert.equal(publishableGeoCoordinates(-8.6589493, null), undefined);
  assert.equal(publishableGeoCoordinates(null, 115.1381321), undefined);
  assert.equal(publishableGeoCoordinates(null, null), undefined);
  assert.equal(publishableGeoCoordinates(undefined, undefined), undefined);
});

test("publishableGeoCoordinates refuses non-numbers and non-finite values", () => {
  assert.equal(publishableGeoCoordinates("-8.6589493", "115.1381321"), undefined);
  assert.equal(publishableGeoCoordinates(Number.NaN, 115.1381321), undefined);
  assert.equal(publishableGeoCoordinates(-8.6589493, Number.POSITIVE_INFINITY), undefined);
});

test("publishableGeoCoordinates refuses impossible points and null island", () => {
  // 0,0 is where an empty value lands once something parses it as a number,
  // and it is in the Atlantic rather than in Bali.
  assert.equal(publishableGeoCoordinates(0, 0), undefined);
  assert.equal(publishableGeoCoordinates(91, 115.1381321), undefined);
  assert.equal(publishableGeoCoordinates(-8.6589493, 181), undefined);
});
