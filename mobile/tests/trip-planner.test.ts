import assert from "node:assert/strict";
import test from "node:test";
import {
  addTripStop,
  adaptReadyMadeRoutesToTrip,
  createEmptyTrip,
  isEventUsable,
  moveTripStopToDay,
  moveTripStop,
  reconcileTodayEventOccurrences,
  removeTripStop,
  replaceTripStop,
  setTripStopNote,
  setTripStopState,
} from "../src/trip-planner";
import type { MobileRouteDetail } from "../../lib/mobile-api/contracts";

test("offline trip uses the canonical 3/5/7/10-day model and preserves contiguous order", () => {
  let trip = createEmptyTrip(3, "2026-08-01");
  assert.equal(trip.days.length, 3);
  assert.equal(trip.endDate, "2026-08-03");

  trip = addTripStop(trip, 0, "place", "venue-1");
  trip = addTripStop(trip, 0, "event_occurrence", "event-1");
  trip = addTripStop(trip, 0, "place", "venue-1");
  assert.deepEqual(trip.days[0]?.stops.map((stop) => stop.order), [1, 2]);

  const second = trip.days[0]?.stops[1];
  assert.ok(second);
  trip = moveTripStop(trip, 0, second.id, -1);
  assert.deepEqual(trip.days[0]?.stops.map((stop) => stop.entityId), ["event-1", "venue-1"]);

  trip = setTripStopState(trip, 0, second.id, "visited");
  assert.equal(trip.days[0]?.stops[0]?.state, "visited");
  trip = removeTripStop(trip, 0, second.id);
  assert.deepEqual(trip.days[0]?.stops.map((stop) => stop.order), [1]);
});

test("event expiry is enforced against both occurrence end and verification expiry", () => {
  const now = new Date("2026-08-01T12:00:00.000Z");
  assert.equal(isEventUsable({
    status: "scheduled",
    endsAt: "2026-08-01T13:00:00.000Z",
    expiresAt: "2026-08-01T12:30:00.000Z",
  }, now), true);
  assert.equal(isEventUsable({
    status: "scheduled",
    endsAt: "2026-08-01T11:59:59.000Z",
    expiresAt: "2026-08-01T13:00:00.000Z",
  }, now), false);
  assert.equal(isEventUsable({
    status: "scheduled",
    endsAt: "2026-08-01T13:00:00.000Z",
    expiresAt: "2026-08-01T11:59:59.000Z",
  }, now), false);
});

test("cancelled occurrences are unusable and current server lifecycle overrides cached Today state", () => {
  const cached = {
    id: "occurrence-1",
    eventId: "event-1",
    title: "Sunset session",
    venueSlug: "sample-cafe",
    area: "Sanur",
    startsAt: "2026-08-01T10:00:00.000Z",
    endsAt: "2026-08-01T12:00:00.000Z",
    status: "scheduled" as const,
    cancellationReason: null,
    lastVerifiedAt: "2026-07-31T10:00:00.000Z",
    expiresAt: "2026-08-01T12:30:00.000Z",
  };
  const cancelled = {
    ...cached,
    status: "cancelled" as const,
    cancellationReason: "Venue closure",
    lastVerifiedAt: "2026-08-01T08:00:00.000Z",
  };

  assert.equal(
    isEventUsable(cancelled, new Date("2026-08-01T09:00:00.000Z")),
    false,
  );
  assert.deepEqual(
    reconcileTodayEventOccurrences([cached], [cancelled]),
    [cancelled],
  );
});

test("skip and replace preserve the original stop identity and an explicit replacement link", () => {
  let trip = addTripStop(createEmptyTrip(3, "2026-08-01"), 0, "place", "venue-1");
  const original = trip.days[0]!.stops[0]!;

  trip = setTripStopState(trip, 0, original.id, "skipped");
  assert.equal(trip.days[0]!.stops[0]!.id, original.id);
  assert.equal(trip.days[0]!.stops[0]!.entityId, "venue-1");
  assert.equal(trip.days[0]!.stops[0]!.state, "skipped");

  trip = replaceTripStop(trip, 0, original.id, "place", "venue-2");
  const originalAfterReplace = trip.days[0]!.stops.find((stop) => stop.id === original.id);
  const replacement = trip.days[0]!.stops.find((stop) => stop.entityId === "venue-2");
  assert.ok(originalAfterReplace);
  assert.ok(replacement);
  assert.equal(originalAfterReplace.entityId, "venue-1");
  assert.equal(originalAfterReplace.state, "replaced");
  assert.equal(originalAfterReplace.alternativeId, replacement.id);
  assert.deepEqual(trip.days[0]!.stops.map((stop) => stop.order), [1, 2]);
});

test("trip notes are editable and bounded", () => {
  let trip = addTripStop(createEmptyTrip(3, "2026-08-01"), 0, "place", "venue-1");
  const stopId = trip.days[0]!.stops[0]!.id;

  trip = setTripStopNote(trip, 0, stopId, "  Window seat, please  ");
  assert.equal(trip.days[0]!.stops[0]!.userNote, "Window seat, please");
  trip = setTripStopNote(trip, 0, stopId, " ");
  assert.equal(trip.days[0]!.stops[0]!.userNote, null);
  assert.throws(
    () => setTripStopNote(trip, 0, stopId, "x".repeat(501)),
    /note/i,
  );
});

test("moving a stop across days keeps its identity and contiguous order on both days", () => {
  let trip = createEmptyTrip(3, "2026-08-01");
  trip = addTripStop(trip, 0, "place", "venue-1");
  trip = addTripStop(trip, 0, "place", "venue-2");
  trip = addTripStop(trip, 1, "place", "venue-3");
  const moving = trip.days[0]!.stops[0]!;

  trip = moveTripStopToDay(trip, 0, moving.id, 1, 0);

  assert.deepEqual(trip.days[0]!.stops.map((stop) => stop.entityId), ["venue-2"]);
  assert.deepEqual(trip.days[0]!.stops.map((stop) => stop.order), [1]);
  assert.deepEqual(trip.days[1]!.stops.map((stop) => stop.entityId), ["venue-1", "venue-3"]);
  assert.deepEqual(trip.days[1]!.stops.map((stop) => stop.order), [1, 2]);
  assert.equal(trip.days[1]!.stops[0]!.id, moving.id);
});

test("ready-made 3/5/7/10-day adapters never duplicate an entity", () => {
  const venue = (id: string) => ({
    id,
    slug: id,
    name: id,
    category: "cafe",
    district: "ubud",
    subarea: null,
    photoUrl: null,
    bestFor: null,
    isSponsored: false,
  });
  const routes: MobileRouteDetail[] = [
    {
      id: "route-a",
      slug: "route-a",
      title: "Route A",
      subtitle: null,
      stopCount: 3,
      stops: [
        { position: 1, venue: venue("venue-1") },
        { position: 2, venue: venue("venue-2") },
        { position: 3, venue: venue("venue-1") },
      ],
    },
    {
      id: "route-b",
      slug: "route-b",
      title: "Route B",
      subtitle: null,
      stopCount: 2,
      stops: [
        { position: 1, venue: venue("venue-2") },
        { position: 2, venue: venue("venue-3") },
      ],
    },
  ];

  for (const duration of [3, 5, 7, 10] as const) {
    const trip = adaptReadyMadeRoutesToTrip(
      duration,
      "2026-08-01",
      routes,
    );
    const entityIds = trip.days.flatMap((day) => day.stops.map((stop) => stop.entityId));
    assert.equal(trip.days.length, duration);
    assert.deepEqual(entityIds, ["venue-1", "venue-2", "venue-3"]);
    assert.equal(new Set(entityIds).size, entityIds.length);
  }
});
