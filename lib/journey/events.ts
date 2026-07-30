import { JourneyError, type EventOccurrence, type TripStop } from "./contracts";

export function assertOccurrenceActive(
  occurrence: EventOccurrence,
  now = new Date(),
): EventOccurrence {
  if (occurrence.status === "cancelled") {
    throw new JourneyError("EVENT_CANCELLED", "This event occurrence was cancelled");
  }
  if (Date.parse(occurrence.endsAt) <= now.getTime() || Date.parse(occurrence.expiresAt) <= now.getTime()) {
    throw new JourneyError("EVENT_EXPIRED", "This event occurrence has expired");
  }
  return occurrence;
}

export function occurrenceToStop(
  occurrence: EventOccurrence,
  order: number,
  now = new Date(),
): TripStop {
  assertOccurrenceActive(occurrence, now);
  return {
    id: `event-${occurrence.id}`,
    entityType: "event_occurrence",
    entityId: occurrence.id,
    order,
    state: "planned",
    plannedTime: occurrence.startsAt,
    alternativeId: null,
    userNote: null,
  };
}

