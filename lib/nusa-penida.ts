// Nusa Penida district product. Nusa Penida sits under the `nusa-islands`
// district (master §6a), which is planning_only — the money loop is OFF
// (guardrail #4): cards never carry Reserve/offer. Content is sourced from the
// existing DB editorial fields only; nothing invented (§4). Until real venues
// are curated for the island, getNusaPenidaVenues returns an empty list and the
// pillar's TopPicks sections render nothing (null-safe), which is correct — no
// invented placeholders.

import type { VenueWithPerk } from "@/lib/data";
import { getPublishedVenues, isPublicReadyVenue } from "@/lib/data";
import type { PlaceCardData } from "@/components/PlaceCard";

export const NUSA_PENIDA_DISTRICT_SLUG = "nusa-islands";

export async function getNusaPenidaVenues(): Promise<VenueWithPerk[]> {
  const all = await getPublishedVenues();
  return all
    .filter((v) => v.district === NUSA_PENIDA_DISTRICT_SLUG && isPublicReadyVenue(v))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function toNusaPenidaPlaceCard(v: VenueWithPerk): PlaceCardData {
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
