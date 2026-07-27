import assert from "node:assert/strict";
import test from "node:test";
import {
  addTripStop,
  createEmptyTrip,
  isEventUsable,
  moveTripStop,
  removeTripStop,
  setTripStopState,
} from "../src/trip-planner";

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
    endsAt: "2026-08-01T13:00:00.000Z",
    expiresAt: "2026-08-01T12:30:00.000Z",
  }, now), true);
  assert.equal(isEventUsable({
    endsAt: "2026-08-01T11:59:59.000Z",
    expiresAt: "2026-08-01T13:00:00.000Z",
  }, now), false);
  assert.equal(isEventUsable({
    endsAt: "2026-08-01T13:00:00.000Z",
    expiresAt: "2026-08-01T11:59:59.000Z",
  }, now), false);
});
