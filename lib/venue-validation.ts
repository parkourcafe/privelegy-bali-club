// Venue data validation at the trust boundary (audit 2026-07, P0 "production
// data already caused a 500").
//
// The catalogue is fed by external/hand-maintained data. A single NULL or a
// bad enum in a critical column must never reach the public surface as a crash
// (the /places 500 was `null.toLowerCase()` on a missing address) or as a dead,
// meaningless card. This module is the guard.
//
// Two severities, deliberately separated:
//
//  1. STRUCTURAL — the row cannot be rendered safely at all (no slug/name,
//     unknown category, no district). These would crash sorts/filters or paint
//     a broken card, so they are DROPPED from any public list here and logged.
//
//  2. CONTENT — the row is renderable but thin (no editorial reason, no price
//     anchor, …). These are NOT dropped: they stay reachable for internal
//     review and are simply kept out of the index by the publication gate
//     (lib/publication.ts `isVenueIndexable`). This module does not re-decide
//     that; it only reports content gaps for diagnostics.

import type { Venue, VenueCategory } from "./types";

// Single source of truth for the allowed category enum — kept in lockstep with
// the `VenueCategory` union in lib/types.ts. If you add a category there, add it
// here (the `satisfies` below fails the build if the two drift).
export const VENUE_CATEGORIES = [
  "cafe",
  "warung",
  "restaurant",
  "beach_club",
  "spa",
  "beauty",
  "fitness",
  "yoga",
  "bar",
  "surf",
] as const satisfies readonly VenueCategory[];

const CATEGORY_SET: ReadonlySet<string> = new Set(VENUE_CATEGORIES);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Problems that make a venue row impossible to render safely. A non-empty
 * result means the row must not appear on any public list.
 */
export function venueStructuralIssues(v: Partial<Venue>): string[] {
  const issues: string[] = [];
  if (!isNonEmptyString(v.slug)) issues.push("missing slug");
  if (!isNonEmptyString(v.name)) issues.push("missing name");
  if (!isNonEmptyString(v.district)) issues.push("missing district");
  if (!isNonEmptyString(v.category) || !CATEGORY_SET.has(v.category)) {
    issues.push(`invalid category '${String(v.category)}'`);
  }
  return issues;
}

/** Type guard: the row has every structural field needed to render. */
export function isRenderableVenue(v: Partial<Venue>): v is Venue {
  return venueStructuralIssues(v).length === 0;
}

/**
 * Renderable-but-worth-flagging gaps. Never drops a row — surfaces content
 * holes (missing directions link, no price/order anchor, no editorial reason)
 * for the validation script / logs. The publication gate decides indexability.
 */
export function venueContentIssues(v: Venue): string[] {
  const issues: string[] = [];
  if (!isNonEmptyString(v.gmapsUrl)) issues.push("no directions/gmaps url");
  if (!isNonEmptyString(v.address)) issues.push("no address");
  if (!isNonEmptyString(v.priceAnchor) && !isNonEmptyString(v.whatToOrder)) {
    issues.push("no price anchor or what-to-order");
  }
  if (!isNonEmptyString(v.whyItsHere)) issues.push("no editorial reason (why_its_here)");
  return issues;
}

/**
 * Drop structurally-broken rows from a venue list and report each drop, so the
 * public surface can never 500 or paint a dead card on a bad row. Soft/content
 * gaps are intentionally left in place (see module header). `onDrop` defaults to
 * a console.warn so a bad row is loud in server logs without taking the page
 * down.
 */
export function keepRenderableVenues<T extends Partial<Venue>>(
  venues: T[],
  onDrop: (venue: T, issues: string[]) => void = defaultOnDrop,
): T[] {
  const out: T[] = [];
  for (const v of venues) {
    const issues = venueStructuralIssues(v);
    if (issues.length === 0) {
      out.push(v);
    } else {
      onDrop(v, issues);
    }
  }
  return out;
}

function defaultOnDrop(venue: Partial<Venue>, issues: string[]): void {
  const id = venue.slug || venue.id || venue.name || "<unknown>";
  // eslint-disable-next-line no-console
  console.warn(`[venue-validation] dropped unrenderable venue "${id}": ${issues.join(", ")}`);
}
