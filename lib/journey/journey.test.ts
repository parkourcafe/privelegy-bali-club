import assert from "node:assert/strict";
import test from "node:test";
import { assertOccurrenceActive, occurrenceToStop } from "./events";
import { offlineCapability, offlineFreshnessLabel, SyncQueue } from "./offline-sync";
import { googleMapsDirectionsHandoff, routeWithExternalFallback, type RouteService } from "./routing";
import { reorderStop, transitionStop, validateTrip } from "./trip";
import { JourneyError, type EventOccurrence, type RouteRequest, type Trip, type TripStop } from "./contracts";

const stop = (id: string, order: number): TripStop => ({
  id, entityType: "place", entityId: id, order, state: "planned",
  plannedTime: null, alternativeId: null, userNote: null,
});

test("creates and edits a valid three-day trip without losing notes", () => {
  const trip: Trip = {
    id: "trip-1", title: "Three days", startDate: "2026-08-01", endDate: "2026-08-03",
    homeArea: "sanur", travelStyle: "calm", status: "draft",
    days: [1, 2, 3].map((number) => ({
      id: `day-${number}`, date: `2026-08-0${number}`, area: "sanur", pace: "balanced",
      weatherPlan: null, stops: number === 1 ? [{ ...stop("a", 1), userNote: "Keep this" }, stop("b", 2)] : [],
    })),
  };
  validateTrip(trip);
  const reordered = reorderStop(trip.days[0], "b", 0);
  assert.deepEqual(reordered.stops.map((entry) => entry.id), ["b", "a"]);
  assert.equal(reordered.stops[1].userNote, "Keep this");
  assert.equal(transitionStop(reordered, "a", "visited").stops[1].state, "visited");
  assert.equal(transitionStop(reordered, "b", "replaced", "c").stops[0].alternativeId, "c");
});

const occurrence: EventOccurrence = {
  id: "occ-1", eventId: "event-1", startsAt: "2026-08-01T10:00:00.000Z",
  endsAt: "2026-08-01T12:00:00.000Z", status: "scheduled",
  lastVerifiedAt: "2026-07-27T00:00:00.000Z", expiresAt: "2026-08-01T12:00:00.000Z",
};

test("adds only active event occurrences to a plan", () => {
  assert.equal(occurrenceToStop(occurrence, 1, new Date("2026-08-01T11:00:00.000Z")).entityId, "occ-1");
  assert.throws(
    () => assertOccurrenceActive(occurrence, new Date("2026-08-01T12:00:00.000Z")),
    (error: unknown) => error instanceof JourneyError && error.code === "EVENT_EXPIRED",
  );
});

const request: RouteRequest = {
  origin: { latitude: -8.65, longitude: 115.13 },
  destination: { latitude: -8.7, longitude: 115.16 },
  transportMode: "scooter",
};

test("route provider failure falls back to an exact external Maps handoff", async () => {
  const unavailable = {
    getRoute: async () => { throw new JourneyError("ROUTE_PROVIDER_UNAVAILABLE", "offline", true); },
    getDirectionsHandoff: async () => "unused",
  } as unknown as RouteService;
  const result = await routeWithExternalFallback(unavailable, request);
  assert.equal(result.fallback, true);
  assert.equal(result.route, null);
  assert.match(result.handoff, /^https:\/\/www\.google\.com\/maps\/dir\//);
  assert.match(result.handoff, /destination=-8.7%2C115.16/);
  assert.match(googleMapsDirectionsHandoff(request), /travelmode=driving/);
});

test("offline mutations are idempotent and preserve conflicts for resolution", () => {
  const queue = new SyncQueue();
  const mutation = {
    idempotencyKey: "device-1:save:1", entityType: "saved" as const, entityId: "place-1",
    operation: "save", payload: { saved: true }, baseVersion: "v1",
    createdAt: "2026-07-27T00:00:00.000Z",
  };
  assert.equal(queue.enqueue(mutation), true);
  assert.equal(queue.enqueue(mutation), false);
  assert.equal(queue.list().length, 1);
  assert.throws(
    () => queue.resolveVersion(mutation, "v2"),
    (error: unknown) => error instanceof JourneyError && error.code === "SYNC_VERSION_MISMATCH",
  );
  queue.acknowledge(mutation.idempotencyKey);
  assert.equal(queue.list().length, 0);
});

test("offline truth labels cached state and blocks live/provider actions", () => {
  assert.equal(offlineCapability("visited"), "offline_safe");
  assert.equal(offlineCapability("booking"), "online_required");
  assert.equal(offlineCapability("live_traffic"), "online_required");
  assert.equal(
    offlineFreshnessLabel("2026-07-27T00:00:00.000Z", false),
    "Offline · last updated 2026-07-27T00:00:00.000Z",
  );
  assert.equal(offlineFreshnessLabel("2026-07-27T00:00:00.000Z", true), null);
});
