import type { Trip, TripDay, TripStop } from "./contracts";

function assertDay(day: TripDay): void {
  const ids = new Set<string>();
  day.stops.forEach((stop, index) => {
    if (ids.has(stop.id)) throw new Error(`Duplicate trip stop: ${stop.id}`);
    if (stop.order !== index + 1) throw new Error("Trip stop order must be contiguous");
    ids.add(stop.id);
  });
}

export function validateTrip(trip: Trip): Trip {
  if (![3, 5, 7, 10].includes(trip.days.length)) {
    throw new Error("Trip must use a supported 3/5/7/10-day plan");
  }
  trip.days.forEach(assertDay);
  return trip;
}

export function reorderStop(day: TripDay, stopId: string, targetIndex: number): TripDay {
  const from = day.stops.findIndex((stop) => stop.id === stopId);
  if (from < 0) throw new Error("Trip stop not found");
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= day.stops.length) {
    throw new Error("Target index is outside the trip day");
  }
  const stops = [...day.stops];
  const [moved] = stops.splice(from, 1);
  stops.splice(targetIndex, 0, moved);
  return { ...day, stops: stops.map((stop, index) => ({ ...stop, order: index + 1 })) };
}

export function transitionStop(
  day: TripDay,
  stopId: string,
  state: TripStop["state"],
  replacementId: string | null = null,
): TripDay {
  if (state === "replaced" && !replacementId) throw new Error("A replaced stop needs an alternative");
  let found = false;
  const stops = day.stops.map((stop) => {
    if (stop.id !== stopId) return stop;
    found = true;
    return { ...stop, state, alternativeId: state === "replaced" ? replacementId : stop.alternativeId };
  });
  if (!found) throw new Error("Trip stop not found");
  return { ...day, stops };
}

