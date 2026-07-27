import type { MobileVenueCompact } from "../../lib/mobile-api/contracts";

export type SelectionMode = "discover" | "decide" | "map-list";

export interface DiscoveryCardModel {
  venue: MobileVenueCompact;
  reasonShown: string;
  whyThisPlace: string;
  skipIf: string | null;
  tags: string[];
  freshnessLabel: string;
  mediaCount: number;
}

export interface DecisionInputs {
  area: string;
  company: string;
  moment: string;
  budget: string;
  ending: string;
}

export interface CandidateUniverseFilters {
  district?: string;
  category?: string;
}

export interface CandidateUniversePage {
  items: MobileVenueCompact[];
  nextCursor: string | null;
  end: boolean;
}

interface CandidateCursor {
  version: 1;
  offset: number;
  previousId: string;
}

export interface FeedResumeSnapshot {
  sessionId: string;
  version: string;
  cursor: string;
  lastSeenEntityId: string;
  position: number;
  updatedAt: string;
}

export type FeedResumeResolution =
  | { status: "restored"; snapshot: FeedResumeSnapshot }
  | { status: "unavailable"; reason: "version_mismatch" | "candidate_unavailable" };

export const MOBILE_FEED_POLICY_VERSION = "mobile-organic-v1" as const;

export const EMPTY_DECISION_INPUTS: DecisionInputs = {
  area: "",
  company: "",
  moment: "",
  budget: "",
  ending: "",
};

export function buildSharedCandidateUniverse(
  venues: readonly MobileVenueCompact[],
  filters: CandidateUniverseFilters = {},
): MobileVenueCompact[] {
  const seen = new Set<string>();
  return venues.filter((venue) => {
    if (seen.has(venue.id)) return false;
    if (filters.district && venue.district !== filters.district) return false;
    if (filters.category && venue.category !== filters.category) return false;
    seen.add(venue.id);
    return true;
  });
}

function encodeCandidateCursor(cursor: CandidateCursor): string {
  return btoa(JSON.stringify(cursor))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

function decodeCandidateCursor(value: string): CandidateCursor | null {
  if (!/^[A-Za-z0-9_-]{1,500}$/.test(value)) return null;
  try {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const parsed: unknown = JSON.parse(atob(padded));
    if (
      !parsed
      || typeof parsed !== "object"
      || Array.isArray(parsed)
      || Object.keys(parsed).sort().join(",") !== "offset,previousId,version"
    ) return null;
    const candidate = parsed as Partial<CandidateCursor>;
    if (
      candidate.version !== 1
      || !Number.isSafeInteger(candidate.offset)
      || (candidate.offset ?? -1) < 1
      || typeof candidate.previousId !== "string"
      || !candidate.previousId
      || candidate.previousId.length > 200
    ) return null;
    return candidate as CandidateCursor;
  } catch {
    return null;
  }
}

export function pageCandidateUniverse(
  universe: readonly MobileVenueCompact[],
  options: { cursor: string | null; limit: number },
): CandidateUniversePage {
  if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 50) {
    throw new Error("Candidate page limit must be between 1 and 50");
  }
  let offset = 0;
  if (options.cursor !== null) {
    const decoded = decodeCandidateCursor(options.cursor);
    if (
      !decoded
      || decoded.offset > universe.length
      || universe[decoded.offset - 1]?.id !== decoded.previousId
    ) {
      throw new Error("Invalid candidate cursor");
    }
    offset = decoded.offset;
  }
  const items = universe.slice(offset, offset + options.limit);
  const nextOffset = offset + items.length;
  const end = nextOffset >= universe.length;
  const last = items.at(-1);
  return {
    items: [...items],
    nextCursor: !end && last
      ? encodeCandidateCursor({ version: 1, offset: nextOffset, previousId: last.id })
      : null,
    end,
  };
}

function boundedText(value: unknown, maxLength: number): value is string {
  return typeof value === "string"
    && value.length > 0
    && value.length <= maxLength
    && value.trim() === value;
}

export function parseFeedResumeSnapshot(input: unknown): FeedResumeSnapshot | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  if (
    Object.keys(input).sort().join(",")
    !== "cursor,lastSeenEntityId,position,sessionId,updatedAt,version"
  ) return null;
  const value = input as Partial<FeedResumeSnapshot>;
  if (
    !boundedText(value.sessionId, 100)
    || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value.sessionId)
    || !boundedText(value.version, 120)
    || !boundedText(value.cursor, 500)
    || !boundedText(value.lastSeenEntityId, 200)
    || !Number.isSafeInteger(value.position)
    || (value.position ?? -1) < 0
    || !boundedText(value.updatedAt, 40)
    || !Number.isFinite(Date.parse(value.updatedAt))
    || new Date(value.updatedAt).toISOString() !== value.updatedAt
  ) return null;
  return value as FeedResumeSnapshot;
}

export function resolveFeedResumeSnapshot(
  snapshot: FeedResumeSnapshot,
  options: { expectedVersion: string; candidateIds: readonly string[] },
): FeedResumeResolution {
  if (snapshot.version !== options.expectedVersion) {
    return { status: "unavailable", reason: "version_mismatch" };
  }
  const position = options.candidateIds.indexOf(snapshot.lastSeenEntityId);
  if (position < 0) {
    return { status: "unavailable", reason: "candidate_unavailable" };
  }
  return {
    status: "restored",
    snapshot: position === snapshot.position ? snapshot : { ...snapshot, position },
  };
}

/**
 * Presentation adapter only. It preserves the server-provided order and never
 * computes a second fit/rank. Agent 1's v1.2 feed contract will replace the
 * conservative fallback labels when it lands.
 */
export function toDiscoveryCards(
  venues: readonly MobileVenueCompact[],
  updatedAt: string | null,
): DiscoveryCardModel[] {
  const freshnessLabel = updatedAt
    ? `Guide snapshot · ${new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(updatedAt))}`
    : "Check before going";

  return venues.map((venue) => ({
    venue,
    reasonShown: venue.bestFor
      ? `Shown from the published guide for ${venue.bestFor.toLowerCase()}.`
      : `Shown from the published ${venue.district} guide.`,
    whyThisPlace: venue.bestFor ?? "Open the details for the published editorial context.",
    skipIf: null,
    tags: [venue.district, venue.category.replaceAll("_", " "), venue.subarea]
      .filter((value): value is string => Boolean(value))
      .slice(0, 3),
    freshnessLabel,
    mediaCount: venue.photoUrl ? 1 : 0,
  }));
}

export function filterMapListCards(
  cards: readonly DiscoveryCardModel[],
  district: string,
  category: string,
): DiscoveryCardModel[] {
  return cards.filter(({ venue }) => (
    (!district || venue.district === district)
    && (!category || venue.category === category)
  ));
}

export function clampFeedPosition(position: number, itemCount: number): number {
  if (!Number.isFinite(position) || itemCount < 1) return 0;
  return Math.min(Math.max(0, Math.trunc(position)), itemCount - 1);
}

export function nextFeedPosition(
  current: number,
  direction: "next" | "previous",
  itemCount: number,
): number {
  return clampFeedPosition(current + (direction === "next" ? 1 : -1), itemCount);
}

export function decisionRequestReady(inputs: DecisionInputs): boolean {
  return Object.values(inputs).every((value) => value.trim().length > 0);
}
