import type { MobileVenueCompact } from "../mobile-api/contracts";

export type NavigationMode = "external_maps" | "offline_onboard";
export type NavigationSessionState = "handoff_pending" | "away" | "returned" | "failed" | "completed";

export interface NavigationSession {
  id: string;
  targetType: "place" | "event_occurrence";
  targetId: string;
  targetName: string;
  sourceSurface: "places" | "today" | "routes" | "events" | "saved";
  mode: NavigationMode;
  state: NavigationSessionState;
  startedAt: string;
  updatedAt: string;
  returnedAt: string | null;
}

export interface CompanionContext {
  manualArea: string | null;
  online: boolean;
  now: string;
  todayVenueIds: readonly string[];
  tripVenueIds: readonly string[];
  visitedVenueIds: readonly string[];
  savedVenueIds: readonly string[];
}

export interface CompanionSuggestion {
  venueId: string;
  name: string;
  reason: string;
  caveat: string;
  freshness: "live_public_snapshot" | "cached_public_snapshot";
}

export function createNavigationSession(input: {
  id: string;
  targetType: NavigationSession["targetType"];
  targetId: string;
  targetName: string;
  sourceSurface: NavigationSession["sourceSurface"];
  mode: NavigationMode;
  now?: Date;
}): NavigationSession {
  const now = (input.now ?? new Date()).toISOString();
  if (
    !/^[0-9a-f-]{16,80}$/i.test(input.id)
    || !input.targetId.trim()
    || input.targetId.length > 160
    || !input.targetName.trim()
    || input.targetName.length > 160
  ) throw new Error("invalid_navigation_session");
  return {
    ...input,
    state: "handoff_pending",
    startedAt: now,
    updatedAt: now,
    returnedAt: null,
  };
}

export function transitionNavigationSession(
  session: NavigationSession,
  state: NavigationSessionState,
  now = new Date(),
): NavigationSession {
  const updatedAt = now.toISOString();
  const allowed: Record<NavigationSessionState, NavigationSessionState[]> = {
    handoff_pending: ["away", "failed"],
    away: ["returned", "failed"],
    returned: ["away", "completed"],
    failed: [],
    completed: [],
  };
  if (!allowed[session.state].includes(state)) throw new Error("invalid_navigation_transition");
  return {
    ...session,
    state,
    updatedAt,
    returnedAt: state === "returned" ? updatedAt : session.returnedAt,
  };
}

export function parseNavigationSession(value: unknown): NavigationSession | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  const timestamps = [item.startedAt, item.updatedAt];
  if (
    typeof item.id !== "string"
    || !/^[0-9a-f-]{16,80}$/i.test(item.id)
    || !["place", "event_occurrence"].includes(String(item.targetType))
    || typeof item.targetId !== "string"
    || !item.targetId.trim()
    || item.targetId.length > 160
    || typeof item.targetName !== "string"
    || !item.targetName.trim()
    || item.targetName.length > 160
    || !["places", "today", "routes", "events", "saved"].includes(String(item.sourceSurface))
    || !["external_maps", "offline_onboard"].includes(String(item.mode))
    || !["handoff_pending", "away", "returned", "failed", "completed"].includes(String(item.state))
    || timestamps.some((entry) => typeof entry !== "string" || !Number.isFinite(Date.parse(entry)))
    || !(item.returnedAt === null || (
      typeof item.returnedAt === "string" && Number.isFinite(Date.parse(item.returnedAt))
    ))
  ) return null;
  return item as unknown as NavigationSession;
}

export function buildCompanionSuggestions(
  venues: readonly MobileVenueCompact[],
  context: CompanionContext,
  limit = 3,
): CompanionSuggestion[] {
  const today = new Set(context.todayVenueIds);
  const trip = new Set(context.tripVenueIds);
  const visited = new Set(context.visitedVenueIds);
  const saved = new Set(context.savedVenueIds);
  const scored = venues
    .map((venue, index) => {
      if (visited.has(venue.id)) return null;
      let score = 0;
      const reasons: string[] = [];
      if (today.has(venue.id)) {
        score += 400;
        reasons.push("already in Today");
      } else if (trip.has(venue.id)) {
        score += 300;
        reasons.push("already planned in Trip");
      }
      if (context.manualArea && venue.district === context.manualArea) {
        score += 200;
        reasons.push(`matches your selected area, ${context.manualArea.replaceAll("-", " ")}`);
      }
      if (saved.has(venue.id)) {
        score += 100;
        reasons.push("saved on this device");
      }
      if (!reasons.length) reasons.push("published in the shared Other Bali guide");
      return { venue, index, score, reasons };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, Math.max(0, Math.min(10, limit)));

  return scored.map(({ venue, reasons }): CompanionSuggestion => ({
    venueId: venue.id,
    name: venue.name,
    reason: `Suggested because it is ${reasons.join(" and ")}.`,
    caveat: context.online
      ? "Opening state and travel time are not inferred; check current details before leaving."
      : "Based on cached public data. Current opening state and travel time require internet.",
    freshness: context.online ? "live_public_snapshot" : "cached_public_snapshot",
  }));
}
