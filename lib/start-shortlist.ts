import type { VenueCategory } from "./types";
import type { VenueWithPerk } from "./data";

export interface StartShortlistItem {
  slug: string;
  name: string;
  whyThisPlace: string;
  bestMoment: string;
  bestAudience: string;
  primaryAction: { label: "View place"; href: string };
}

const CATEGORY_MOMENT: Partial<Record<VenueCategory, string>> = {
  cafe: "A coffee or brunch stop",
  warung: "A casual local meal",
  restaurant: "Lunch or dinner",
  beach_club: "A beach day or sunset",
  bar: "Sunset or evening drinks",
  spa: "A reset between plans",
  yoga: "A slower morning",
  fitness: "An active start",
  surf: "A surf session",
  beauty: "A practical reset",
  hotel: "Choosing a base",
  resort: "A stay-led day",
  villa: "Choosing a private base",
  attraction: "A daytime stop",
  activity: "An active day",
};

function clean(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized || null;
}

function humanizeTag(value: string): string {
  const normalized = value.replace(/[_-]+/g, " ").trim();
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : normalized;
}

function decisionScore(venue: VenueWithPerk): number {
  return Number(Boolean(clean(venue.whyItsHere))) * 4
    + Number(Boolean(clean(venue.bestFor))) * 4
    + Number(Boolean(venue.jobs?.some(clean))) * 2
    + Number(Boolean(venue.vibeTags?.some(clean)))
    + Number(Boolean(venue.lastVerifiedAt));
}

/**
 * Pick a small decision-ready starter set without paid or sponsored weighting.
 * Alphabetical order is the stable tie-breaker; payment never affects rank.
 */
export function buildStartShortlist(
  venues: readonly VenueWithPerk[],
  limit = 3,
): StartShortlistItem[] {
  return venues
    .filter((venue) => clean(venue.whyItsHere) && clean(venue.bestFor))
    .map((venue) => ({ venue, score: decisionScore(venue) }))
    .sort((a, b) => b.score - a.score || a.venue.name.localeCompare(b.venue.name))
    .slice(0, Math.max(0, limit))
    .map(({ venue }) => {
      const moment = venue.jobs?.map(clean).find(Boolean)
        ?? venue.vibeTags?.map(clean).find(Boolean)
        ?? CATEGORY_MOMENT[venue.category]
        ?? "A planned stop";
      return {
        slug: venue.slug,
        name: venue.name,
        whyThisPlace: clean(venue.whyItsHere)!,
        bestMoment: humanizeTag(moment),
        bestAudience: clean(venue.bestFor)!,
        primaryAction: { label: "View place", href: `/places/${venue.slug}` },
      };
    });
}
