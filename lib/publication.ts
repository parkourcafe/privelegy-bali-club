// Explicit publication policy (brief §8) with a staged quality rollout.
//
// 1. HARD PUBLICATION BOUNDARY — enforced on every public surface:
//    status=active, publication_status=published, a structurally renderable
//    row and (where present) the Uluwatu evidence registry approval.
//
// 2. SHADOW QUALITY GATE — address, verified Maps URL, editorial reason,
//    Best for and an offering/price anchor are measured with stable reason
//    codes. During the staged rollout they populate the remediation queue but
//    do not turn existing active+published pages into 404s. A later explicit
//    code change may switch the mode to `enforce` after a fresh impact export.
//
// Evidence requirements differ by layer:
//    - Uluwatu (`uluwatu-bukit`): the venue must have a registry entry in
//      lib/uluwatu/venues.ts with publication === "published". A registry
//      entry only reaches that state when identity, district boundary,
//      operating status and Google-Maps findability were verified with
//      recorded evidence, an editorial summary + Best for + at least one
//      practical decision detail exist, and a verification date is set.
//      No approved venue photos exist yet, so published venues render the
//      explicitly typographic editorial cover (never a fake image).
//    - Every district also requires the hard database publication boundary.
//      Editorial completeness never promotes a review or inactive row by
//      itself. isVenueIndexable() works for all districts;
//      isIndexableVenueSlug() is the Uluwatu slug-only variant.

import type { Venue } from "./types";
import { validateGoogleMapsUrl } from "./integrations/google-maps";
import { isRenderableVenue, venueStructuralIssues } from "./venue-validation";
import { publicVenueEditorialText } from "./venue-presentation";
import {
  getUluwatuContent,
  publishedUluwatuVenues,
  ULUWATU_DB_SLUG,
} from "./uluwatu/venues";

export type PublicationStatus = "published" | "review";
export type VenuePublicationGateMode = "shadow" | "enforce";

// Fail-safe staged rollout. This is intentionally a reviewed code constant,
// not an environment toggle that could silently mass-remove production URLs.
export const VENUE_PUBLICATION_GATE_MODE: VenuePublicationGateMode = "shadow";

export type VenuePublicationIssueCode =
  | "database_not_published"
  | "inactive"
  | "structural"
  | "registry_not_published"
  | "missing_address"
  | "missing_verified_map"
  | "missing_editorial_reason"
  | "missing_best_for"
  | "missing_offering_anchor";

export type VenuePublicationAssessment = {
  status: PublicationStatus;
  issues: VenuePublicationIssueCode[];
};

export type VenuePublicationDecision = {
  mode: VenuePublicationGateMode;
  effectiveStatus: PublicationStatus;
  strictStatus: PublicationStatus;
  issues: VenuePublicationIssueCode[];
};

const HARD_PUBLICATION_ISSUES = new Set<VenuePublicationIssueCode>([
  "database_not_published",
  "inactive",
  "structural",
  "registry_not_published",
]);

function hasText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function hasOfferingAnchor(v: Venue): boolean {
  return Boolean(
    publicVenueEditorialText(v.priceAnchor) ||
      publicVenueEditorialText(v.whatToOrder),
  );
}

/**
 * Strict candidate assessment used for operator diagnostics and impact
 * exports. In shadow mode its quality issues do not remove an otherwise valid
 * active+published page from public surfaces.
 *
 * Registered Uluwatu venues keep their evidence registry as the authoritative
 * editorial/fact gate. The strict assessment measures every DB-driven venue
 * against the complete decision-ready contract from the master architecture;
 * shadow mode records gaps without treating database flags as proof of quality.
 */
export function assessVenuePublication(v: Venue): VenuePublicationAssessment {
  const issues: VenuePublicationIssueCode[] = [];
  if (v.status !== "active") issues.push("inactive");
  if (v.publicationStatus !== "published") issues.push("database_not_published");
  if (venueStructuralIssues(v).length > 0) issues.push("structural");

  if (v.district === ULUWATU_DB_SLUG) {
    const content = getUluwatuContent(v.slug);
    // The Uluwatu registry is the source of truth ONLY for the venues it
    // covers (the food launch). Uluwatu rows that are NOT in the registry
    // (e.g. DB-driven wellness: spa/yoga/fitness/beauty) fall back to the same
    // decision-ready editorial gate every other district uses, so they publish
    // straight from the DB without a registry entry. Registered venues keep
    // their evidence-backed gate unchanged (no regression to the food set).
    if (content) {
      if (content.publication !== "published") issues.push("registry_not_published");
      return { status: issues.length === 0 ? "published" : "review", issues };
    }
  }

  if (!hasText(v.address)) issues.push("missing_address");
  if (
    v.mapsHandoffKind === "search_fallback" ||
    !validateGoogleMapsUrl(v.gmapsUrl)
  ) {
    issues.push("missing_verified_map");
  }
  if (!publicVenueEditorialText(v.whyItsHere)) issues.push("missing_editorial_reason");
  if (!publicVenueEditorialText(v.bestFor)) issues.push("missing_best_for");
  if (!hasOfferingAnchor(v)) issues.push("missing_offering_anchor");

  return { status: issues.length === 0 ? "published" : "review", issues };
}

export function decideVenuePublication(
  v: Venue,
  mode: VenuePublicationGateMode = VENUE_PUBLICATION_GATE_MODE,
): VenuePublicationDecision {
  const assessment = assessVenuePublication(v);
  const hasHardBlocker = assessment.issues.some((issue) =>
    HARD_PUBLICATION_ISSUES.has(issue),
  );
  const effectiveStatus = mode === "enforce"
    ? assessment.status
    : hasHardBlocker
      ? "review"
      : "published";

  return {
    mode,
    effectiveStatus,
    strictStatus: assessment.status,
    issues: assessment.issues,
  };
}

export function getPublicationStatus(v: Venue): PublicationStatus {
  return decideVenuePublication(v).effectiveStatus;
}

// A venue detail page carries index,follow when it passes the effective rollout
// decision. Shadow mode enforces hard blockers while recording quality gaps;
// enforce mode additionally applies the complete decision-ready assessment.
// Prefer this (it works for all districts) over isIndexableVenueSlug, which is
// Uluwatu-registry-only and kept for callers that only have a slug.
export function isVenueIndexable(v: Venue): boolean {
  return isRenderableVenue(v) && getPublicationStatus(v) === "published";
}

// Explicit simulator for impact reports and tests. Kept separate from the
// one-argument callback above because Array.filter passes its index as the
// second argument.
export function isVenueIndexableInMode(
  v: Venue,
  mode: VenuePublicationGateMode,
): boolean {
  return isRenderableVenue(v) && decideVenuePublication(v, mode).effectiveStatus === "published";
}

// Slug-only Uluwatu check (registry). Retained for compatibility; page/sitemap
// code with the full Venue should use isVenueIndexable instead.
export function isIndexableVenueSlug(slug: string): boolean {
  return getUluwatuContent(slug)?.publication === "published";
}

export function indexableVenueSlugs(): string[] {
  return publishedUluwatuVenues().map((v) => v.slug);
}
