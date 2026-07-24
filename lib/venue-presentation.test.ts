import assert from "node:assert/strict";
import test from "node:test";

import {
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
