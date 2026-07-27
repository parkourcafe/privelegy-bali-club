import type { EntityType, StopState, Trip, TripStop } from "../../lib/journey/contracts";
import type { MobileRouteDetail } from "../../lib/mobile-api/contracts";
import { reorderStop, transitionStop, validateTrip } from "../../lib/journey/trip";

export const SUPPORTED_TRIP_DURATIONS = [3, 5, 7, 10] as const;
export type SupportedTripDuration = typeof SUPPORTED_TRIP_DURATIONS[number];

function dateAtOffset(startDate: string, offset: number): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    throw new Error("Trip start date must use YYYY-MM-DD");
  }
  const date = new Date(`${startDate}T00:00:00.000Z`);
  if (
    !Number.isFinite(date.getTime())
    || date.toISOString().slice(0, 10) !== startDate
  ) {
    throw new Error("Trip start date must be a valid calendar date");
  }
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

export function replaceTripStop(
  trip: Trip,
  dayIndex: number,
  stopId: string,
  entityType: EntityType,
  entityId: string,
): Trip {
  const day = trip.days[dayIndex];
  if (!day) throw new Error("Trip day not found");
  const originalIndex = day.stops.findIndex((stop) => stop.id === stopId);
  if (originalIndex < 0) throw new Error("Trip stop not found");
  const original = day.stops[originalIndex]!;
  if (original.entityType === entityType && original.entityId === entityId) {
    throw new Error("A replacement must differ from the original trip stop");
  }
  const duplicate = trip.days.flatMap((item) => item.stops).find(
    (stop) => stop.entityType === entityType && stop.entityId === entityId,
  );
  const replacement: TripStop = duplicate ?? {
    id: crypto.randomUUID(),
    entityType,
    entityId,
    order: originalIndex + 2,
    state: "planned",
    plannedTime: null,
    alternativeId: null,
    userNote: null,
  };
  const days = trip.days.map((item, index) => {
    if (index !== dayIndex) return item;
    const transitioned = transitionStop(item, stopId, "replaced", replacement.id);
    if (duplicate) return transitioned;
    const stops = [...transitioned.stops];
    stops.splice(originalIndex + 1, 0, replacement);
    return {
      ...transitioned,
      stops: stops.map((stop, order) => ({ ...stop, order: order + 1 })),
    };
  });
  return validateTrip({ ...trip, days });
}

export function setTripStopNote(
  trip: Trip,
  dayIndex: number,
  stopId: string,
  note: string | null,
): Trip {
  const day = trip.days[dayIndex];
  if (!day) throw new Error("Trip day not found");
  const normalized = note?.trim() || null;
  if (normalized && normalized.length > 500) {
    throw new Error("Trip stop note must be 500 characters or fewer");
  }
  let found = false;
  const days = trip.days.map((item, index) => index !== dayIndex ? item : {
    ...item,
    stops: item.stops.map((stop) => {
      if (stop.id !== stopId) return stop;
      found = true;
      return { ...stop, userNote: normalized };
    }),
  });
  if (!found) throw new Error("Trip stop not found");
  return validateTrip({ ...trip, days });
}

export function moveTripStopToDay(
  trip: Trip,
  sourceDayIndex: number,
  stopId: string,
  targetDayIndex: number,
  targetIndex: number,
): Trip {
  const source = trip.days[sourceDayIndex];
  const target = trip.days[targetDayIndex];
  if (!source || !target) throw new Error("Trip day not found");
  const sourceIndex = source.stops.findIndex((stop) => stop.id === stopId);
  if (sourceIndex < 0) throw new Error("Trip stop not found");
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex > target.stops.length) {
    throw new Error("Target index is outside the trip day");
  }
  if (sourceDayIndex === targetDayIndex) {
    if (targetIndex >= source.stops.length) {
      throw new Error("Target index is outside the trip day");
    }
    return validateTrip({
      ...trip,
      days: trip.days.map((day, index) => index === sourceDayIndex
        ? reorderStop(day, stopId, targetIndex)
        : day),
    });
  }
  const moving = source.stops[sourceIndex]!;
  const days = trip.days.map((day, index) => {
    if (index === sourceDayIndex) {
      return {
        ...day,
        stops: day.stops
          .filter((stop) => stop.id !== stopId)
          .map((stop, order) => ({ ...stop, order: order + 1 })),
      };
    }
    if (index === targetDayIndex) {
      const stops = [...day.stops];
      stops.splice(targetIndex, 0, moving);
      return {
        ...day,
        stops: stops.map((stop, order) => ({ ...stop, order: order + 1 })),
      };
    }
    return day;
  });
  return validateTrip({ ...trip, days });
}

export function adaptReadyMadeRoutesToTrip(
  duration: SupportedTripDuration,
  startDate: string,
  routes: readonly MobileRouteDetail[],
): Trip {
  let trip = createEmptyTrip(duration, startDate);
  const seen = new Set<string>();
  routes.forEach((route, routeIndex) => {
    const dayIndex = Math.min(routeIndex, duration - 1);
    [...route.stops]
      .sort((left, right) => left.position - right.position)
      .forEach(({ venue }) => {
        if (seen.has(venue.id)) return;
        seen.add(venue.id);
        trip = addTripStop(trip, dayIndex, "place", venue.id);
      });
  });
  return trip;
}

export function isEventUsable(
  event: { endsAt: string; expiresAt: string; status?: "scheduled" | "cancelled" },
  now = new Date(),
): boolean {
  const current = now.getTime();
  return event.status !== "cancelled"
    && Date.parse(event.endsAt) > current
    && Date.parse(event.expiresAt) > current;
}

export function reconcileTodayEventOccurrences<
  T extends { id: string },
  U extends { id: string },
>(
  cached: readonly T[],
  current: readonly U[],
): Array<T | U> {
  const currentById = new Map(current.map((event) => [event.id, event]));
  return cached.map((event) => currentById.get(event.id) ?? event);
}

export function findTripStop(
  trip: Trip,
  entityType: EntityType,
  entityId: string,
): TripStop | null {
  return trip.days.flatMap((day) => day.stops)
    .find((stop) => stop.entityType === entityType && stop.entityId === entityId) ?? null;
}
