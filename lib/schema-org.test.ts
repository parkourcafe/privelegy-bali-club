import assert from "node:assert/strict";
import test from "node:test";
import { schemaTypeForVenueCategory } from "./schema-org";

test("route JSON-LD maps venue categories to honest schema.org types", () => {
  assert.equal(schemaTypeForVenueCategory("cafe"), "CafeOrCoffeeShop");
  assert.equal(schemaTypeForVenueCategory("bar"), "BarOrPub");
  assert.equal(schemaTypeForVenueCategory("spa"), "HealthAndBeautyBusiness");
  assert.equal(schemaTypeForVenueCategory("yoga"), "SportsActivityLocation");
  assert.equal(schemaTypeForVenueCategory("restaurant"), "Restaurant");
});

test("unknown or malformed categories fail safely to LocalBusiness", () => {
  assert.equal(schemaTypeForVenueCategory("unknown"), "LocalBusiness");
  assert.equal(schemaTypeForVenueCategory(null), "LocalBusiness");
});
