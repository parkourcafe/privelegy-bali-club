// Nusa Dua district product (master §6a.3). Nusa Dua is planning_only — the money
// loop is OFF (guardrail #4): cards never carry Reserve/offer. It's the gated
// resort enclave on the south-east coast; content is sourced from the existing DB
// editorial fields — nothing invented (§4).

import type { VenueWithPerk } from "@/lib/data";
import { getPublishedVenues, isPublicReadyVenue } from "@/lib/data";
import type { PlaceCardData } from "@/components/PlaceCard";

export const NUSA_DUA_SLUG = "nusa-dua";

export async function getNusaDuaVenues(): Promise<VenueWithPerk[]> {
  const all = await getPublishedVenues();
  return all
    .filter((v) => v.district === NUSA_DUA_SLUG && isPublicReadyVenue(v))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function toNusaDuaPlaceCard(v: VenueWithPerk): PlaceCardData {
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
