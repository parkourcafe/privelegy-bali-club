// Ubud district product (master §6a.3). Ubud is next_deep / planning — the
// money loop is OFF (guardrail #4): cards never carry Reserve/offer, venues hand
// off to their own channels only. Like Canggu here, content is sourced from the
// existing DB editorial fields (why_its_here/best_for) — nothing invented (§4).
// Verified facts + venue-page indexing arrive with the Ubud evidence pass
// (loaded separately); until then venue detail pages stay noindex.
//
// The 0024 editorial pass did store `jobs` on Ubud venues (quiet_work_cafe
// among them), just not yet surfaced by a guide — venueHasJob below mirrors
// lib/canggu.ts so a guide can filter on that real DB data instead of
// inventing a decision group.

import type { VenueWithPerk } from "@/lib/data";
import { getPublishedVenues, isPublicReadyVenue } from "@/lib/data";
import { normalizeJobs } from "@/lib/intents";
import type { PlaceCardData } from "@/components/PlaceCard";

export const UBUD_SLUG = "ubud";

export async function getUbudVenues(): Promise<VenueWithPerk[]> {
  const all = await getPublishedVenues();
  return all
    .filter((v) => v.district === UBUD_SLUG && isPublicReadyVenue(v))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function toUbudPlaceCard(v: VenueWithPerk): PlaceCardData {
  return {
    slug: v.slug,
    name: v.name,
    category: v.category,
    microArea: v.area,
    editorialLine: v.whyItsHere,
    bestFor: v.bestFor,
    priceBand: v.priceAnchor,
    photoUrl: v.photoUrl,
    isSponsored: v.isSponsored,
    gmapsUrl: v.gmapsUrl,
    // No tablepilotSlug / hasOffer — planning district, no monetization (#4).
  };
}

// Match against the DB's canonical job slugs (underscore form). See
// lib/canggu.ts for the identical helper and the normalizeJobs rationale.
export function venueHasJob(v: VenueWithPerk, jobs: string[]): boolean {
  const own = normalizeJobs(v.jobs);
  return normalizeJobs(jobs).some((j) => own.includes(j));
}
