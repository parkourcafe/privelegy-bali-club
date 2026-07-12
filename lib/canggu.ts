// Canggu district product (master §6a.3 — district_guide surfaces). Mirrors the
// Uluwatu launch structure, with two deliberate differences:
//  1. Canggu is the active_deep district — the money loop stays ON. Cards keep
//     Reserve (TablePilot handoff) + offer hints via PlaceCard, driven purely by
//     each venue's own `tablepilotSlug` / confirmed perk (guardrail #3/#4).
//  2. There is no hand-verified Canggu evidence registry yet, so content is
//     sourced ONLY from the existing DB editorial fields (why_its_here, best_for,
//     jobs, tags) — nothing invented (brief §4). Venue detail pages therefore
//     stay noindex until the same evidence pass runs for Canggu.

import type { VenueWithPerk } from "@/lib/data";
import { getPublishedVenues, isPublicReadyVenue } from "@/lib/data";
import type { PlaceCardData } from "@/components/PlaceCard";

export const CANGGU_SLUG = "canggu";

// Canggu already uses its public name as the DB slug — no URL/DB mapping needed
// (unlike Uluwatu's uluwatu ↔ uluwatu-bukit).
export async function getCangguVenues(): Promise<VenueWithPerk[]> {
  const all = await getPublishedVenues();
  return all
    .filter((v) => v.district === CANGGU_SLUG && isPublicReadyVenue(v))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Build a PlaceCard from a DB venue. hasOffer/tablepilotSlug keep the Canggu
// money loop one tap from the editorial surfaces (active_deep, guardrail #4).
export function toCangguPlaceCard(v: VenueWithPerk): PlaceCardData {
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
    tablepilotSlug: v.tablepilotSlug,
    hasOffer: Boolean(v.perk),
  };
}

export function venueHasJob(v: VenueWithPerk, jobs: string[]): boolean {
  const own = v.jobs ?? [];
  return jobs.some((j) => own.includes(j));
}

export function hasTag(v: VenueWithPerk, tag: string, kind: "vibe" | "practical"): boolean {
  return (kind === "vibe" ? v.vibeTags ?? [] : v.practicalTags ?? []).includes(tag);
}
