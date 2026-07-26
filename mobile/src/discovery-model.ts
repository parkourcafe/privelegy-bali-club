import type { MobileVenueCompact } from "../../lib/mobile-api/contracts";

export type SelectionMode = "discover" | "decide" | "map-list";

export interface DiscoveryCardModel {
  venue: MobileVenueCompact;
  reasonShown: string;
  whyThisPlace: string;
  skipIf: string | null;
  tags: string[];
  freshnessLabel: string;
  mediaCount: number;
}

export interface DecisionInputs {
  area: string;
  company: string;
  moment: string;
  budget: string;
  ending: string;
}

export const EMPTY_DECISION_INPUTS: DecisionInputs = {
  area: "",
  company: "",
  moment: "",
  budget: "",
  ending: "",
};

/**
 * Presentation adapter only. It preserves the server-provided order and never
 * computes a second fit/rank. Agent 1's v1.2 feed contract will replace the
 * conservative fallback labels when it lands.
 */
export function toDiscoveryCards(
  venues: readonly MobileVenueCompact[],
  updatedAt: string | null,
): DiscoveryCardModel[] {
  const freshnessLabel = updatedAt
    ? `Guide snapshot · ${new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(updatedAt))}`
    : "Check before going";

  return venues.map((venue) => ({
    venue,
    reasonShown: venue.bestFor
      ? `Shown from the published guide for ${venue.bestFor.toLowerCase()}.`
      : `Shown from the published ${venue.district} guide.`,
    whyThisPlace: venue.bestFor ?? "Open the details for the published editorial context.",
    skipIf: null,
    tags: [venue.district, venue.category.replaceAll("_", " "), venue.subarea]
      .filter((value): value is string => Boolean(value))
      .slice(0, 3),
    freshnessLabel,
    mediaCount: venue.photoUrl ? 1 : 0,
  }));
}

export function filterMapListCards(
  cards: readonly DiscoveryCardModel[],
  district: string,
  category: string,
): DiscoveryCardModel[] {
  return cards.filter(({ venue }) => (
    (!district || venue.district === district)
    && (!category || venue.category === category)
  ));
}

export function clampFeedPosition(position: number, itemCount: number): number {
  if (!Number.isFinite(position) || itemCount < 1) return 0;
  return Math.min(Math.max(0, Math.trunc(position)), itemCount - 1);
}

export function nextFeedPosition(
  current: number,
  direction: "next" | "previous",
  itemCount: number,
): number {
  return clampFeedPosition(current + (direction === "next" ? 1 : -1), itemCount);
}

export function decisionRequestReady(inputs: DecisionInputs): boolean {
  return Object.values(inputs).every((value) => value.trim().length > 0);
}

