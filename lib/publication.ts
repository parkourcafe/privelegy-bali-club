// Explicit publication policy (brief §8) — replaces the old 3-field
// "decision-ready" predicate as the gate for public, indexable surfaces.
//
// Two tiers:
//
// 1. PUBLISHED — may appear on indexed pages. Requirements differ by layer:
//    - Uluwatu (`uluwatu-bukit`): the venue must have a registry entry in
//      lib/uluwatu/venues.ts with publication === "published". A registry
//      entry only reaches that state when identity, district boundary,
//      operating status and Google-Maps findability were verified with
//      recorded evidence, an editorial summary + Best for + at least one
//      practical decision detail exist, and a verification date is set.
//      No approved venue photos exist yet, so published venues render the
//      explicitly typographic editorial cover (never a fake image).
//    - Every district also requires the database publication gate:
//      status=active and publication_status=published. Other districts then
//      require the decision-ready editorial predicate; Uluwatu additionally
//      requires its evidence registry. Editorial completeness never promotes
//      a review or inactive row by itself. isVenueIndexable() works for all
//      districts; isIndexableVenueSlug() is the Uluwatu slug-only variant.
//
// 2. REVIEW — internal only, through authenticated operator surfaces.

import type { Venue } from "./types";
import { isRenderableVenue } from "./venue-validation";
import {
  getUluwatuContent,
  publishedUluwatuVenues,
  ULUWATU_DB_SLUG,
} from "./uluwatu/venues";

export type PublicationStatus = "published" | "review";

function hasText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

// The shared editorial gate used by every non-registry layer: a venue is
// decision-ready once it carries an editorial summary and a "Best for" line.
function decisionReadyEditorial(v: Venue): boolean {
  return hasText(v.whyItsHere) && hasText(v.bestFor);
}

export function getPublicationStatus(v: Venue): PublicationStatus {
  if (v.status !== "active" || v.publicationStatus !== "published") return "review";
  if (v.district === ULUWATU_DB_SLUG) {
    const content = getUluwatuContent(v.slug);
    // The Uluwatu registry is the source of truth ONLY for the venues it
    // covers (the food launch). Uluwatu rows that are NOT in the registry
    // (e.g. DB-driven wellness: spa/yoga/fitness/beauty) fall back to the same
    // decision-ready editorial gate every other district uses, so they publish
    // straight from the DB without a registry entry. Registered venues keep
    // their evidence-backed gate unchanged (no regression to the food set).
    if (content) {
      return content.publication === "published" ? "published" : "review";
    }
    return decisionReadyEditorial(v) ? "published" : "review";
  }
  return decisionReadyEditorial(v) ? "published" : "review";
}

// A venue detail page carries index,follow when the venue is "published" —
// i.e. it passes the explicit database gate and the district editorial check.
// Empty/review rows stay noindex,nofollow so we never
// ship thin pages to the index. Prefer this (it works for all districts) over
// isIndexableVenueSlug, which is Uluwatu-registry-only and kept for callers that
// only have a slug.
export function isVenueIndexable(v: Venue): boolean {
  return isRenderableVenue(v) && getPublicationStatus(v) === "published";
}

// Slug-only Uluwatu check (registry). Retained for compatibility; page/sitemap
// code with the full Venue should use isVenueIndexable instead.
export function isIndexableVenueSlug(slug: string): boolean {
  return getUluwatuContent(slug)?.publication === "published";
}

export function indexableVenueSlugs(): string[] {
  return publishedUluwatuVenues().map((v) => v.slug);
}
