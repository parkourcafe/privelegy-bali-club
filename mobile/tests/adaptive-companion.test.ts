import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCompanionSuggestions,
  createNavigationSession,
  parseNavigationSession,
  transitionNavigationSession,
} from "../../lib/journey/adaptive-companion";

const venues = [
  { id: "a", slug: "a", name: "A", category: "cafe", district: "ubud", subarea: null, photoUrl: null, bestFor: null, isSponsored: true },
  { id: "b", slug: "b", name: "B", category: "cafe", district: "sanur", subarea: null, photoUrl: null, bestFor: null, isSponsored: false },
  { id: "c", slug: "c", name: "C", category: "cafe", district: "ubud", subarea: null, photoUrl: null, bestFor: null, isSponsored: false },
];

test("Companion ranks only the shared candidate universe and paid status has no effect", () => {
  const result = buildCompanionSuggestions(venues, {
    manualArea: "ubud",
    online: true,
    now: "2026-07-27T04:00:00.000Z",
    todayVenueIds: ["c"],
    tripVenueIds: ["b"],
    visitedVenueIds: [],
    savedVenueIds: ["a"],
  });
  assert.deepEqual(result.map((item) => item.venueId), ["c", "a", "b"]);
  const withoutPaidFlag = buildCompanionSuggestions(
    venues.map((venue) => ({ ...venue, isSponsored: false })),
    {
      manualArea: "ubud",
      online: true,
      now: "2026-07-27T04:00:00.000Z",
      todayVenueIds: ["c"],
      tripVenueIds: ["b"],
      visitedVenueIds: [],
      savedVenueIds: ["a"],
    },
  );
  assert.deepEqual(
    withoutPaidFlag.map((item) => item.venueId),
    result.map((item) => item.venueId),
  );
  assert.doesNotMatch(result.map((item) => item.reason).join(" "), /sponsor|paid/i);
});

test("Companion excludes visited places and never claims live state offline", () => {
  const result = buildCompanionSuggestions(venues, {
    manualArea: null,
    online: false,
    now: "2026-07-27T04:00:00.000Z",
    todayVenueIds: [],
    tripVenueIds: [],
    visitedVenueIds: ["a"],
    savedVenueIds: [],
  });
  assert.deepEqual(result.map((item) => item.venueId), ["b", "c"]);
  assert.ok(result.every((item) => item.freshness === "cached_public_snapshot"));
  assert.ok(result.every((item) => /require internet/i.test(item.caveat)));
});

test("Navigation session records handoff and safe return without coordinates or URL", () => {
  const session = createNavigationSession({
    id: "12345678-1234-1234-1234-123456789abc",
    targetType: "place",
    targetId: "venue-a",
    targetName: "Venue A",
    sourceSurface: "today",
    mode: "external_maps",
    now: new Date("2026-07-27T04:00:00.000Z"),
  });
  const away = transitionNavigationSession(session, "away", new Date("2026-07-27T04:01:00.000Z"));
  const returned = transitionNavigationSession(away, "returned", new Date("2026-07-27T04:30:00.000Z"));
  assert.equal(parseNavigationSession(returned)?.state, "returned");
  assert.doesNotMatch(JSON.stringify(returned), /latitude|longitude|mapsUrl|https:/i);
  assert.throws(() => transitionNavigationSession(returned, "failed"), /invalid_navigation_transition/);
});
