import { Buffer } from "node:buffer";
import type { MobileVenue } from "./contracts";

export interface MobileDiscoveryCard {
  venue: MobileVenue;
  reasonShown: string;
  whyThisPlace: string;
  skipIf: string | null;
  tags: string[];
  freshness: string;
}

export interface MobileDiscoveryPage {
  items: MobileDiscoveryCard[];
  nextCursor: string | null;
  end: boolean;
}

export type MobileDecisionVenue = Omit<MobileVenue, "isSponsored">;

export interface MobileDecisionSlot {
  venue: MobileDecisionVenue;
  explanation: string;
}

export interface MobileDecision {
  best: MobileDecisionSlot | null;
  backup: MobileDecisionSlot | null;
  contrast: MobileDecisionSlot | null;
  emptyStateReason: string | null;
}

interface DiscoveryCursor {
  v: 1;
  offset: number;
  anchor: string;
  scope: string;
}

function assertIsoTimestamp(value: string): void {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString() !== value) {
    throw new Error("updatedAt must be an ISO timestamp");
  }
}

function exactOrganicUniverse(
  venues: readonly MobileVenue[],
  district: string,
  category: string,
): MobileVenue[] {
  const seen = new Set<string>();
  return venues.filter((venue) => {
    if (seen.has(venue.id)) return false;
    if (district && venue.district !== district) return false;
    if (category && venue.category !== category) return false;
    seen.add(venue.id);
    return true;
  });
}

function encodeCursor(cursor: DiscoveryCursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

function decodeCursor(value: string): DiscoveryCursor | null {
  if (!/^[A-Za-z0-9_-]{1,500}$/.test(value)) return null;
  try {
    const bytes = Buffer.from(value, "base64url");
    if (bytes.toString("base64url") !== value) return null;
    const parsed: unknown = JSON.parse(bytes.toString("utf8"));
    if (
      !parsed
      || typeof parsed !== "object"
      || Array.isArray(parsed)
      || Object.keys(parsed).sort().join(",") !== "anchor,offset,scope,v"
    ) return null;
    const cursor = parsed as Partial<DiscoveryCursor>;
    if (
      cursor.v !== 1
      || !Number.isSafeInteger(cursor.offset)
      || (cursor.offset ?? -1) < 1
      || typeof cursor.anchor !== "string"
      || !cursor.anchor
      || cursor.anchor.length > 200
      || typeof cursor.scope !== "string"
      || cursor.scope.length > 500
    ) return null;
    return cursor as DiscoveryCursor;
  } catch {
    return null;
  }
}

function discoveryCard(venue: MobileVenue, updatedAt: string): MobileDiscoveryCard {
  const tags = [...new Set([
    venue.district,
    venue.category.replaceAll("_", " "),
    venue.subarea,
    ...venue.practicalTags,
    ...venue.vibes,
  ].filter((value): value is string => Boolean(value)))].slice(0, 8);
  return {
    venue,
    reasonShown: venue.bestFor
      ? `Included in the published guide for ${venue.bestFor.toLowerCase()}.`
      : `Included in the published ${venue.district} guide.`,
    whyThisPlace: venue.whyItsHere
      ?? venue.bestFor
      ?? "Open the place details for the available editorial context.",
    skipIf: venue.notFor,
    tags,
    freshness: `Guide snapshot · ${updatedAt}`,
  };
}

export function buildMobileDiscoveryPage(
  venues: readonly MobileVenue[],
  options: {
    district: string;
    category: string;
    cursor: string | null;
    limit: number;
    updatedAt: string;
  },
): MobileDiscoveryPage {
  if (!Number.isInteger(options.limit) || options.limit < 1 || options.limit > 50) {
    throw new Error("limit must be between 1 and 50");
  }
  assertIsoTimestamp(options.updatedAt);

  const district = options.district.trim();
  const category = options.category.trim();
  const scope = JSON.stringify([district, category]);
  const universe = exactOrganicUniverse(venues, district, category);
  let offset = 0;
  if (options.cursor !== null) {
    const cursor = decodeCursor(options.cursor);
    if (
      !cursor
      || cursor.scope !== scope
      || cursor.offset > universe.length
      || universe[cursor.offset - 1]?.id !== cursor.anchor
    ) {
      throw new Error("Invalid discovery cursor");
    }
    offset = cursor.offset;
  }

  const venuesPage = universe.slice(offset, offset + options.limit);
  const nextOffset = offset + venuesPage.length;
  const end = nextOffset >= universe.length;
  const anchor = venuesPage.at(-1);
  return {
    items: venuesPage.map((venue) => discoveryCard(venue, options.updatedAt)),
    nextCursor: !end && anchor
      ? encodeCursor({ v: 1, offset: nextOffset, anchor: anchor.id, scope })
      : null,
    end,
  };
}

function normalizedWords(...values: Array<string | null | readonly string[]>): Set<string> {
  const text = values.flatMap((value) => Array.isArray(value) ? value : [value])
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
  return new Set(text.match(/[a-z0-9]+/g) ?? []);
}

function queryWords(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function budgetScore(priceLabel: string | null, budget: string): number {
  const normalized = budget.trim().toLowerCase();
  if (normalized === "budget" || normalized === "low") {
    return priceLabel === "$" ? 4 : priceLabel === "$$$" ? -3 : 0;
  }
  if (normalized === "splurge" || normalized === "premium") {
    return priceLabel === "$$$" ? 4 : priceLabel === "$" ? -1 : 0;
  }
  if (normalized === "mid" || normalized === "medium") return priceLabel === "$$" ? 4 : 0;
  return 0;
}

const COMPANY_WORDS: Readonly<Record<string, readonly string[]>> = {
  solo: ["solo", "alone"],
  couple: ["couple", "couples", "date"],
  family: ["family", "families", "kid", "kids"],
  friends: ["friend", "friends", "group", "groups"],
};

function contextMatches(words: ReadonlySet<string>, value: string): number {
  const query = queryWords(value);
  const expanded = query.flatMap((word) => COMPANY_WORDS[word] ?? [word]);
  return new Set(expanded.filter((word) => words.has(word))).size;
}

function contextScore(
  venue: MobileVenue,
  context: { moment: string; budget: string; company: string },
): number {
  const words = normalizedWords(
    venue.bestFor,
    venue.whyItsHere,
    venue.notFor,
    venue.practicalTags,
    venue.vibes,
  );
  const momentMatches = queryWords(context.moment)
    .filter((word) => words.has(word)).length;
  const companyMatches = contextMatches(words, context.company);
  return momentMatches * 3 + companyMatches * 4 + budgetScore(venue.priceLabel, context.budget);
}

function explanation(
  venue: MobileVenue,
  context: { moment: string; budget: string; company: string },
): string {
  const publishedReason = venue.whyItsHere ?? venue.bestFor ?? `${venue.name} is in the published guide`;
  return `${publishedReason} Compared using your ${context.moment}, ${context.budget} budget and ${context.company} context.`;
}

function decisionVenue(venue: MobileVenue): MobileDecisionVenue {
  const publicVenue: Partial<MobileVenue> = { ...venue };
  delete publicVenue.isSponsored;
  return publicVenue as MobileDecisionVenue;
}

export function createMobileDecision(
  venues: readonly MobileVenue[],
  context: {
    area: string;
    moment: string;
    budget: string;
    company: string;
    updatedAt: string;
  },
): MobileDecision {
  if (
    !context.area.trim()
    || !context.moment.trim()
    || !context.budget.trim()
    || !context.company.trim()
  ) {
    throw new Error("Decision context is incomplete");
  }
  assertIsoTimestamp(context.updatedAt);

  const normalizedContext = {
    area: context.area.trim(),
    moment: context.moment.trim(),
    budget: context.budget.trim(),
    company: context.company.trim(),
  };
  const candidates = exactOrganicUniverse(venues, normalizedContext.area, "")
    .map((venue, organicIndex) => ({
      venue,
      organicIndex,
      score: contextScore(venue, normalizedContext),
    }))
    .sort((left, right) => right.score - left.score || left.organicIndex - right.organicIndex);

  const slots = candidates.slice(0, 3).map(({ venue }) => ({
    venue: decisionVenue(venue),
    explanation: explanation(venue, normalizedContext),
  }));
  return {
    best: slots[0] ?? null,
    backup: slots[1] ?? null,
    contrast: slots[2] ?? null,
    emptyStateReason: slots.length < 3
      ? `Not enough exact-area candidates are available: found ${slots.length} of 3.`
      : null,
  };
}
