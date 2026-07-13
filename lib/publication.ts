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
//      status=active and publication_status=published. Editorial completeness
//      never promotes a review or inactive row by itself.
//
// 2. REVIEW — internal only, through authenticated operator surfaces.

import type { Venue } from "./types";
import {
  getUluwatuContent,
  publishedUluwatuVenues,
  ULUWATU_DB_SLUG,
} from "./uluwatu/venues";

export type PublicationStatus = "published" | "review";

function hasText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function getPublicationStatus(v: Venue): PublicationStatus {
  if (v.status !== "active" || v.publicationStatus !== "published") return "review";
  if (v.district === ULUWATU_DB_SLUG) {
    const content = getUluwatuContent(v.slug);
    return content?.publication === "published" ? "published" : "review";
  }
  return hasText(v.whyItsHere) && hasText(v.bestFor) ? "published" : "review";
}

// A venue detail page carries index,follow when the venue is "published" —
// i.e. it passes the explicit database gate and the district editorial check.
// Empty/review rows stay noindex,nofollow so we never
// ship thin pages to the index. Prefer this (it works for all districts) over
// isIndexableVenueSlug, which is Uluwatu-registry-only and kept for callers that
// only have a slug.
export function isVenueIndexable(v: Venue): boolean {
  return getPublicationStatus(v) === "published";
}

// Slug-only Uluwatu check (registry). Retained for compatibility; page/sitemap
// code with the full Venue should use isVenueIndexable instead.
export function isIndexableVenueSlug(slug: string): boolean {
  return getUluwatuContent(slug)?.publication === "published";
}

export function indexableVenueSlugs(): string[] {
  return publishedUluwatuVenues().map((v) => v.slug);
}
