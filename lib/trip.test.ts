import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeTripDay,
  normalizeVenueSlug,
  parseSharedTripEntries,
  parseTripEntries,
  resolveSavedTripRead,
} from "./trip";

test("venue slugs are normalized and reject unsafe or oversized input", () => {
  assert.equal(normalizeVenueSlug("  shelter-canggu  "), "shelter-canggu");
  assert.equal(normalizeVenueSlug("Upper_Case"), null);
  assert.equal(normalizeVenueSlug("../venue"), null);
  assert.equal(normalizeVenueSlug("a".repeat(161)), null);
});

test("trip days are bounded positive integers or null for the shortlist", () => {
  assert.equal(normalizeTripDay(null), null);
  assert.equal(normalizeTripDay(1), 1);
  assert.equal(normalizeTripDay(30), 30);
  assert.equal(normalizeTripDay(0), undefined);
  assert.equal(normalizeTripDay(31), undefined);
  assert.equal(normalizeTripDay(1.5), undefined);
});

test("database trip entries are deduplicated and sorted by day and position", () => {
  assert.deepEqual(
    parseTripEntries([
      { venue_slug: "third", day_number: 2, position: 1 },
      { venue_slug: "first", day_number: null, position: 2 },
      { venue_slug: "second", day_number: 1, position: 1 },
      { venue_slug: "second", day_number: 3, position: 99 },
      { venue_slug: "../bad", day_number: 1, position: 1 },
    ]),
    [
      { venueSlug: "first", day: null, position: 2 },
      { venueSlug: "second", day: 1, position: 1 },
      { venueSlug: "third", day: 2, position: 1 },
    ],
  );
});

test("legacy shared slug arrays remain compatible", () => {
  assert.deepEqual(parseSharedTripEntries(null, ["bali-zoo", "shelter-canggu"]), [
    { venueSlug: "bali-zoo", day: null, position: 1 },
    { venueSlug: "shelter-canggu", day: null, position: 2 },
  ]);
});

test("structured shared entries preserve day and order", () => {
  assert.deepEqual(
    parseSharedTripEntries(
      [
        { venue_slug: "sunset-stop", day_number: 2, position: 2 },
        { venue_slug: "breakfast-stop", day_number: 2, position: 1 },
      ],
      ["ignored-legacy"],
    ),
    [
      { venueSlug: "breakfast-stop", day: 2, position: 1 },
      { venueSlug: "sunset-stop", day: 2, position: 2 },
    ],
  );
});

test("saved trip read keeps day grouping and distinguishes an empty trip", async () => {
  const readLegacySlugs = async () => { throw new Error("legacy read should not run"); };
  assert.deepEqual(await resolveSavedTripRead({ data: [], error: null }, readLegacySlugs), {
    status: "ready", entries: [],
  });
  assert.deepEqual(await resolveSavedTripRead({
    data: [{ venue_slug: "breakfast-stop", day_number: 2, position: 1 }],
    error: null,
  }, readLegacySlugs), {
    status: "ready",
    entries: [{ venueSlug: "breakfast-stop", day: 2, position: 1 }],
  });
});

test("saved trip read uses a labelled legacy fallback only for a missing RPC", async () => {
  assert.deepEqual(await resolveSavedTripRead(
    { data: null, error: { code: "PGRST202" } },
    async () => ["breakfast-stop"],
  ), {
    status: "legacy",
    entries: [{ venueSlug: "breakfast-stop", day: null, position: 1 }],
  });
  await assert.rejects(
    resolveSavedTripRead({ data: null, error: { code: "PGRST001" } }, async () => ["breakfast-stop"]),
  );
  await assert.rejects(
    resolveSavedTripRead({ data: null, error: null }, async () => []),
    /saved_trip_unavailable/,
  );
});
