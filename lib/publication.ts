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
//    - Other districts: the legacy decision-ready display predicate
//      (editorial reason + fit + price/order anchor) now doubles as the index
//      bar — a detail page carries index,follow once it clears that bar.
//      isVenueIndexable() works for ALL districts; isIndexableVenueSlug() is
//      the Uluwatu-registry, slug-only variant kept for callers that only
//      have a slug (page/sitemap code with the full Venue should not use it).
//
// 2. REVIEW — internal only. Reachable via /places?all=1 and direct URL,
//    always noindex,nofollow. Archived/uncertain/unverified rows stay here.

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

// Legacy decision-ready predicate (master §6a.5) — retained as the display
// bar for districts that do not yet have an evidence layer.
function legacyDecisionReady(v: Venue): boolean {
  return (
    hasText(v.whyItsHere) &&
    hasText(v.bestFor) &&
    (hasText(v.priceAnchor) || hasText(v.whatToOrder))
  );
}

export function getPublicationStatus(v: Venue): PublicationStatus {
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
    return legacyDecisionReady(v) ? "published" : "review";
  }
  return legacyDecisionReady(v) ? "published" : "review";
}

// A venue detail page carries index,follow when the venue is "published" —
// i.e. it passes getPublicationStatus: the evidence-backed registry for Uluwatu,
// or the decision-ready editorial bar (why-it's-here + best-for + price/order)
// for every other district. Empty/review rows stay noindex,nofollow so we never
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
