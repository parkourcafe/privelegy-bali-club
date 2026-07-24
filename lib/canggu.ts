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
import { normalizeJobs } from "@/lib/intents";
import { anonClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { PlaceCardData } from "@/components/PlaceCard";

export const CANGGU_SLUG = "canggu";

function isReachableProjectPhoto(photoUrl: string): boolean {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  return Boolean(projectUrl && photoUrl.startsWith(`${projectUrl}/storage/`));
}

async function getCangguApprovedPhotoUrls(): Promise<Map<string, string>> {
  if (!isSupabaseConfigured()) return new Map();

  try {
    const { data, error } = await anonClient()!
      .from("venues")
      .select("slug,photo_url")
      .eq("district", CANGGU_SLUG)
      .eq("status", "active")
      .eq("publication_status", "published")
      .not("photo_url", "is", null);

    if (error || !data) return new Map();
    return new Map(
      data.flatMap((row) =>
        typeof row.slug === "string" &&
        typeof row.photo_url === "string" &&
        isReachableProjectPhoto(row.photo_url)
          ? [[row.slug, row.photo_url] as const]
          : [],
      ),
    );
  } catch {
    return new Map();
  }
}

// Canggu already uses its public name as the DB slug — no URL/DB mapping needed
// (unlike Uluwatu's uluwatu ↔ uluwatu-bukit).
export async function getCangguVenues(): Promise<VenueWithPerk[]> {
  const [all, approvedPhotoUrls] = await Promise.all([
    getPublishedVenues(),
    getCangguApprovedPhotoUrls(),
  ]);
  return all
    .filter((v) => v.district === CANGGU_SLUG && isPublicReadyVenue(v))
    .map((v) => ({
      ...v,
      photoUrl: approvedPhotoUrls.get(v.slug) ?? v.photoUrl,
    }))
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
    // TablePilot is rendered from the RLS-gated capability store on detail
    // pages, never from the legacy venue column.
    hasOffer: Boolean(v.perk),
  };
}

// Match against the DB's canonical job slugs. The database stores underscore
// slugs (date_night_special); the guides above are authored with hyphen slugs
// (date-night-special). normalizeJobs collapses both to the underscore form so a
// guide group actually slots its venues (the rest of the app normalises on read
// the same way — see lib/data.ts intent spokes).
export function venueHasJob(v: VenueWithPerk, jobs: string[]): boolean {
  const own = normalizeJobs(v.jobs);
  return normalizeJobs(jobs).some((j) => own.includes(j));
}

export function hasTag(v: VenueWithPerk, tag: string, kind: "vibe" | "practical"): boolean {
  return (kind === "vibe" ? v.vibeTags ?? [] : v.practicalTags ?? []).includes(tag);
}
