// Ubud district product (master §6a.3). Ubud is next_deep / planning — the
// money loop is OFF (guardrail #4): cards never carry Reserve/offer, venues hand
// off to their own channels only. Like Canggu here, content is sourced from the
// existing DB editorial fields (why_its_here/best_for) — nothing invented (§4).
// Ubud carries NO `jobs` tags yet, so guides organise by category, not decision.
// Verified facts + venue-page indexing arrive with the Ubud evidence pass
// (loaded separately); until then venue detail pages stay noindex.

import type { VenueWithPerk } from "@/lib/data";
import { getPublishedVenues, isPublicReadyVenue } from "@/lib/data";
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
