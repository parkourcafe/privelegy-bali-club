import assert from "node:assert/strict";
import test from "node:test";
import type { MobileVenueCompact } from "../../lib/mobile-api/contracts";
import {
  buildSharedCandidateUniverse,
  clampFeedPosition,
  decisionRequestReady,
  filterMapListCards,
  nextFeedPosition,
  pageCandidateUniverse,
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

test("cursor pages come from one deterministic filtered universe without paid influence or cross-fill", () => {
  const input = [...venues, { ...venues[0]!, name: "Duplicate A", isSponsored: true }];
  const universe = buildSharedCandidateUniverse(input, {
    district: "sanur",
    category: "cafe",
  });
  const changedPaid = buildSharedCandidateUniverse(
    input.map((venue) => ({ ...venue, isSponsored: !venue.isSponsored })),
    { district: "sanur", category: "cafe" },
  );

  assert.deepEqual(universe.map((venue) => venue.id), ["a", "c"]);
  assert.deepEqual(
    changedPaid.map((venue) => venue.id),
    universe.map((venue) => venue.id),
  );
  assert.deepEqual(
    buildSharedCandidateUniverse(venues, {
      district: "uluwatu",
      category: "cafe",
    }),
    [],
  );

  const first = pageCandidateUniverse(universe, { cursor: null, limit: 1 });
  assert.deepEqual(first.items.map((venue) => venue.id), ["a"]);
  assert.equal(typeof first.nextCursor, "string");
  assert.equal(first.end, false);

  const second = pageCandidateUniverse(universe, {
    cursor: first.nextCursor,
    limit: 1,
  });
  assert.deepEqual(second.items.map((venue) => venue.id), ["c"]);
  assert.equal(second.nextCursor, null);
  assert.equal(second.end, true);
});
