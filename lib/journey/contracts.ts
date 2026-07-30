export type StopState = "planned" | "in_progress" | "visited" | "skipped" | "replaced";
export type EntityType = "place" | "event_occurrence";

export interface TripStop {
  id: string;
  entityType: EntityType;
  entityId: string;
  order: number;
  state: StopState;
  plannedTime: string | null;
  alternativeId: string | null;
  userNote: string | null;
}

export interface TripDay {
  id: string;
  date: string;
  area: string | null;
  pace: "slow" | "balanced" | "full";
  weatherPlan: string | null;
  stops: TripStop[];
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  homeArea: string | null;
  travelStyle: string | null;
  status: "draft" | "active" | "completed" | "archived";
  days: TripDay[];
}

export interface TodaySession {
  id: string;
  anonymousOrUserId: string;
  context: Record<string, string | number | boolean | null>;
  resultVersion: string;
  createdAt: string;
  expiresAt: string;
}

export interface TodayPlan {
  sessionId: string;
  orderedStops: TripStop[];
  alternativeIds: string[];
  routeSummary: RouteSummary | null;
  state: "draft" | "active" | "completed";
}

export interface EventOccurrence {
  id: string;
  eventId: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "cancelled";
  lastVerifiedAt: string;
  expiresAt: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type TransportMode = "walk" | "drive" | "scooter" | "transit";

export interface RouteRequest {
  origin: Coordinates;
  destination: Coordinates;
  transportMode: TransportMode;
}

export interface TravelEstimate {
  distanceMeters: number;
  durationSeconds: number;
  source: string;
  calculatedAt: string;
  trafficAware: boolean;
}

export interface RouteSummary {
  source: string;
  calculatedAt: string;
  distanceMeters: number;
  durationSeconds: number;
  trafficAware: boolean;
}

export type JourneyErrorCode =
  | "ROUTE_PROVIDER_UNAVAILABLE"
  | "ROUTE_QUOTA_EXCEEDED"
  | "ROUTE_NO_PATH"
  | "EVENT_EXPIRED"
  | "EVENT_CANCELLED"
  | "SYNC_CONFLICT"
  | "SYNC_VERSION_MISMATCH"
  | "LOCATION_PERMISSION_DENIED"
  | "DEEP_LINK_INVALID";

export class JourneyError extends Error {
  constructor(
    readonly code: JourneyErrorCode,
    message: string,
    readonly retryable = false,
  ) {
    super(message);
    this.name = "JourneyError";
  }
}

