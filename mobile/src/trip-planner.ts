import type { EntityType, StopState, Trip, TripStop } from "../../lib/journey/contracts";
import { reorderStop, transitionStop, validateTrip } from "../../lib/journey/trip";

export const SUPPORTED_TRIP_DURATIONS = [3, 5, 7, 10] as const;
export type SupportedTripDuration = typeof SUPPORTED_TRIP_DURATIONS[number];

function dateAtOffset(startDate: string, offset: number): string {
  const date = new Date(`${startDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function createEmptyTrip(
  duration: SupportedTripDuration,
  startDate = new Date().toISOString().slice(0, 10),
): Trip {
  const endDate = dateAtOffset(startDate, duration - 1);
  return validateTrip({
    id: crypto.randomUUID(),
    title: `${duration} days in Bali`,
    startDate,
    endDate,
    homeArea: null,
    travelStyle: null,
    status: "draft",
    days: Array.from({ length: duration }, (_, index) => ({
      id: crypto.randomUUID(),
      date: dateAtOffset(startDate, index),
      area: null,
      pace: "balanced",
      weatherPlan: null,
      stops: [],
    })),
  });
}

export function addTripStop(
  trip: Trip,
  dayIndex: number,
  entityType: EntityType,
  entityId: string,
): Trip {
  if (!trip.days[dayIndex]) throw new Error("Trip day not found");
  const duplicate = trip.days.some((day) => day.stops.some(
    (stop) => stop.entityType === entityType && stop.entityId === entityId,
  ));
  if (duplicate) return trip;
  const days = trip.days.map((day, index) => index !== dayIndex ? day : {
    ...day,
    stops: [...day.stops, {
      id: crypto.randomUUID(),
      entityType,
      entityId,
      order: day.stops.length + 1,
      state: "planned" as const,
      plannedTime: null,
      alternativeId: null,
      userNote: null,
    }],
  });
  return validateTrip({ ...trip, days });
}

export function moveTripStop(
  trip: Trip,
  dayIndex: number,
  stopId: string,
  direction: -1 | 1,
): Trip {
  const day = trip.days[dayIndex];
  if (!day) throw new Error("Trip day not found");
  const current = day.stops.findIndex((stop) => stop.id === stopId);
  const target = current + direction;
  if (current < 0 || target < 0 || target >= day.stops.length) return trip;
  const days = trip.days.map((item, index) => index === dayIndex
    ? reorderStop(item, stopId, target)
    : item);
  return validateTrip({ ...trip, days });
}

export function setTripStopState(
  trip: Trip,
  dayIndex: number,
  stopId: string,
  state: StopState,
): Trip {
  if (!trip.days[dayIndex]) throw new Error("Trip day not found");
  const days = trip.days.map((day, index) => index === dayIndex
    ? transitionStop(day, stopId, state)
    : day);
  return validateTrip({ ...trip, days });
}

export function removeTripStop(trip: Trip, dayIndex: number, stopId: string): Trip {
  if (!trip.days[dayIndex]) throw new Error("Trip day not found");
  const days = trip.days.map((day, index) => index !== dayIndex ? day : {
    ...day,
    stops: day.stops
      .filter((stop) => stop.id !== stopId)
      .map((stop, order) => ({ ...stop, order: order + 1 })),
  });
  return validateTrip({ ...trip, days });
}

export function isEventUsable(
  event: { endsAt: string; expiresAt: string },
  now = new Date(),
): boolean {
  const current = now.getTime();
  return Date.parse(event.endsAt) > current && Date.parse(event.expiresAt) > current;
}

export function findTripStop(
  trip: Trip,
  entityType: EntityType,
  entityId: string,
): TripStop | null {
  return trip.days.flatMap((day) => day.stops)
    .find((stop) => stop.entityType === entityType && stop.entityId === entityId) ?? null;
}
