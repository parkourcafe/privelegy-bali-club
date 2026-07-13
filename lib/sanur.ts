// Sanur district venue layer (master §6a.3). Sanur is planning_only — the money
// loop is OFF (guardrail #4): cards never carry Reserve/offer. The Sanur pillar
// also carries a hand-verified hotels + things-to-do registry (lib/sanur/content.ts);
// this module adds the DB-venue guides (restaurants, cafés/bars, spas & wellness)
// sourced from the existing editorial fields — nothing invented (§4).

import type { VenueWithPerk } from "@/lib/data";
import { getPublishedVenues, isPublicReadyVenue } from "@/lib/data";
import type { PlaceCardData } from "@/components/PlaceCard";

export const SANUR_SLUG = "sanur";

export async function getSanurVenues(): Promise<VenueWithPerk[]> {
  const all = await getPublishedVenues();
  return all
    .filter((v) => v.district === SANUR_SLUG && isPublicReadyVenue(v))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function toSanurPlaceCard(v: VenueWithPerk): PlaceCardData {
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
