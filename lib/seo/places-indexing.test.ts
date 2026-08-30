import assert from "node:assert/strict";
import test from "node:test";
import {
  parsePlacesPageNumber,
  placesCanonical,
  placesPaginationWindow,
} from "./places-indexing";

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

test("directory page reserves page one without skipping catalogue rows", () => {
  assert.deepEqual(placesPaginationWindow({
    itemCount: 1608,
    page: 1,
    pageSize: 24,
    firstPageIsDirectory: true,
  }), { start: 0, end: 0, totalPages: 68 });
  assert.deepEqual(placesPaginationWindow({
    itemCount: 1608,
    page: 2,
    pageSize: 24,
    firstPageIsDirectory: true,
  }), { start: 0, end: 24, totalPages: 68 });
  assert.deepEqual(placesPaginationWindow({
    itemCount: 1608,
    page: 68,
    pageSize: 24,
    firstPageIsDirectory: true,
  }), { start: 1584, end: 1608, totalPages: 68 });
});

test("ordinary catalogue pagination keeps page one as the first data slice", () => {
  assert.deepEqual(placesPaginationWindow({
    itemCount: 25,
    page: 1,
    pageSize: 24,
    firstPageIsDirectory: false,
  }), { start: 0, end: 24, totalPages: 2 });
  assert.deepEqual(placesPaginationWindow({
    itemCount: 25,
    page: 2,
    pageSize: 24,
    firstPageIsDirectory: false,
  }), { start: 24, end: 25, totalPages: 2 });
});
