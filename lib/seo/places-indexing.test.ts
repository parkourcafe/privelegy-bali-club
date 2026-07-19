import assert from "node:assert/strict";
import test from "node:test";
import { parsePlacesPageNumber, placesCanonical } from "./places-indexing";

test("catalogue pagination rejects malformed and out-of-range-shaped values", () => {
  assert.equal(parsePlacesPageNumber(""), 1);
  assert.equal(parsePlacesPageNumber("1"), 1);
  assert.equal(parsePlacesPageNumber("27"), 27);
  assert.equal(parsePlacesPageNumber("0"), null);
  assert.equal(parsePlacesPageNumber("-1"), null);
  assert.equal(parsePlacesPageNumber("2abc"), null);
  assert.equal(parsePlacesPageNumber("9007199254740992"), null);
});

test("valid unfiltered pages self-canonical while tools consolidate", () => {
  assert.equal(placesCanonical({ hasFilters: false, requestedPage: 1 }), "/places");
  assert.equal(placesCanonical({ hasFilters: false, requestedPage: 2 }), "/places?page=2");
  assert.equal(placesCanonical({ hasFilters: true, requestedPage: 3 }), "/places");
  assert.equal(placesCanonical({
    hasFilters: true,
    hubPath: "/bali/canggu",
    requestedPage: 1,
  }), "/bali/canggu");
});
