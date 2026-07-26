import assert from "node:assert/strict";
import test from "node:test";
import type { MobileVenueCompact } from "../../lib/mobile-api/contracts";
import {
  clampFeedPosition,
  decisionRequestReady,
  filterMapListCards,
  nextFeedPosition,
  toDiscoveryCards,
} from "../src/discovery-model";

const venues: MobileVenueCompact[] = [
  { id: "a", slug: "a", name: "A", category: "cafe", district: "sanur", subarea: "Beach", photoUrl: null, bestFor: "Calm mornings", isSponsored: false },
  { id: "b", slug: "b", name: "B", category: "restaurant", district: "ubud", subarea: null, photoUrl: null, bestFor: null, isSponsored: true },
  { id: "c", slug: "c", name: "C", category: "cafe", district: "sanur", subarea: null, photoUrl: null, bestFor: "Families", isSponsored: false },
];

test("presentation adapter preserves API order regardless of paid flag", () => {
  const baseline = toDiscoveryCards(venues, "2026-07-27T00:00:00.000Z").map((card) => card.venue.id);
  const changed = toDiscoveryCards(
    venues.map((venue) => ({ ...venue, isSponsored: !venue.isSponsored })),
    "2026-07-27T00:00:00.000Z",
  ).map((card) => card.venue.id);
  assert.deepEqual(changed, baseline);
});

test("Map/List uses one result set and never cross-fills a district", () => {
  const cards = toDiscoveryCards(venues, null);
  assert.deepEqual(filterMapListCards(cards, "sanur", "cafe").map((card) => card.venue.id), ["a", "c"]);
  assert.deepEqual(filterMapListCards(cards, "uluwatu", "").map((card) => card.venue.id), []);
});

test("feed next/previous controls stay within bounded cursor page", () => {
  assert.equal(nextFeedPosition(0, "previous", 3), 0);
  assert.equal(nextFeedPosition(0, "next", 3), 1);
  assert.equal(nextFeedPosition(2, "next", 3), 2);
  assert.equal(clampFeedPosition(99, 3), 2);
  assert.equal(clampFeedPosition(Number.NaN, 3), 0);
});

test("decision request requires all explicit inputs before submission", () => {
  assert.equal(decisionRequestReady({ area: "Sanur", company: "Family", moment: "Calm", budget: "Mid", ending: "Early" }), true);
  assert.equal(decisionRequestReady({ area: "Sanur", company: "", moment: "Calm", budget: "Mid", ending: "Early" }), false);
});

