// Seminyak district product (master §6a.3). Seminyak is planning_only — the money
// loop is OFF (guardrail #4): cards never carry Reserve/offer, venues hand off to
// their own channels only. Like Ubud here, content is sourced from the existing DB
// editorial fields (why_its_here/best_for) — nothing invented (§4). Venue detail
// pages stay noindex where they have no evidence/photos; the curated pillar +
// guide surfaces are the indexable layer.

import type { VenueWithPerk } from "@/lib/data";
import { getPublishedVenues, isPublicReadyVenue } from "@/lib/data";
import type { PlaceCardData } from "@/components/PlaceCard";

export const SEMINYAK_SLUG = "seminyak";

export async function getSeminyakVenues(): Promise<VenueWithPerk[]> {
  const all = await getPublishedVenues();
  return all
    .filter((v) => v.district === SEMINYAK_SLUG && isPublicReadyVenue(v))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function toSeminyakPlaceCard(v: VenueWithPerk): PlaceCardData {
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
