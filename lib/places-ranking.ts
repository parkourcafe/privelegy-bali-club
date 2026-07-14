export const PLACE_CATEGORY_LABELS: Readonly<Record<string, string>> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Wellness",
  fitness: "Fitness",
  yoga: "Yoga",
  beauty: "Beauty",
  bar: "Bar",
  surf: "Surf",
};

export interface RankablePlace {
  slug: string;
  name: string;
  category: string;
  district: string;
  area?: string;
  wellnessCategories?: readonly string[];
  whyItsHere?: string;
  bestFor?: string;
  vibeTags?: readonly string[];
  practicalTags?: readonly string[];
  jobs?: readonly string[];
  photoUrl?: string;
  priceAnchor?: string;
  whatToOrder?: string;
}

export interface PlaceBriefScore {
  fitScore: number;
  editorialCompleteness: number;
  reasons: string[];
  editorialRankReason: string | null;
}

function editorialCompletenessSignals(venue: RankablePlace): string[] {
  return [
    venue.photoUrl ? "public photo" : null,
    venue.bestFor ? "fit guidance" : null,
    venue.priceAnchor || venue.whatToOrder ? "price/order guidance" : null,
  ].filter((signal): signal is string => signal !== null);
}

export function prettyPlaceSignal(value: string): string {
  return value.replace(/[-_]/g, " ").trim();
}

export function venueSearchText(venue: RankablePlace): string {
  return [
    venue.name,
    venue.area,
    venue.category,
    ...(venue.wellnessCategories ?? []),
    venue.district,
    venue.whyItsHere,
    venue.bestFor,
    ...(venue.vibeTags ?? []),
    ...(venue.practicalTags ?? []),
    ...(venue.jobs ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function scorePlaceForBrief(
  venue: RankablePlace,
  tokens: readonly string[],
  category: string | null,
  district: string | null,
): PlaceBriefScore {
  const text = venueSearchText(venue);
  const reasons: string[] = [];
  let fitScore = 0;

  const categoryMatched = Boolean(
    category
    && (venue.category === category || venue.wellnessCategories?.includes(category)),
  );
  if (categoryMatched && category) {
    fitScore += 30;
    reasons.push(PLACE_CATEGORY_LABELS[category] ?? prettyPlaceSignal(category));
  }

  const categoryWords = new Set([
    venue.category,
    (PLACE_CATEGORY_LABELS[venue.category] ?? "").toLowerCase(),
  ]);
  for (const token of tokens) {
    if (!token || !text.includes(token)) continue;
    fitScore += 20;
    if (!(categoryMatched && categoryWords.has(token))) reasons.push(prettyPlaceSignal(token));
  }

  if (district && venue.district === district) {
    fitScore += 10;
    reasons.push(prettyPlaceSignal(district));
  }

  const completenessSignals = editorialCompletenessSignals(venue);

  const uniqueReasons = [...new Map(
    reasons.map((reason) => [reason.toLowerCase(), reason]),
  ).values()].slice(0, 4);

  return {
    fitScore,
    editorialCompleteness: completenessSignals.length,
    reasons: uniqueReasons,
    // A standalone score cannot know whether a tie exists. The ranking pass
    // fills this only when completeness actually changes an equal-fit order.
    editorialRankReason: null,
  };
}

export function rankPlacesForBrief<T extends RankablePlace>(
  venues: readonly T[],
  tokens: readonly string[],
  category: string | null,
  district: string | null,
  limit = 3,
): Array<{ venue: T } & PlaceBriefScore> {
  const ranked = venues
    .map((venue) => ({ venue, ...scorePlaceForBrief(venue, tokens, category, district) }))
    .filter(({ fitScore }) => fitScore > 0)
    .sort((left, right) => (
      right.fitScore - left.fitScore
      || right.editorialCompleteness - left.editorialCompleteness
      || left.venue.name.localeCompare(right.venue.name)
    ));

  const completenessByFit = new Map<number, Set<number>>();
  for (const item of ranked) {
    const values = completenessByFit.get(item.fitScore) ?? new Set<number>();
    values.add(item.editorialCompleteness);
    completenessByFit.set(item.fitScore, values);
  }

  return ranked.slice(0, Math.max(0, limit)).map((item) => {
    if ((completenessByFit.get(item.fitScore)?.size ?? 0) < 2) return item;
    const signals = editorialCompletenessSignals(item.venue);
    return {
      ...item,
      editorialRankReason: signals.length
        ? `Equal-fit tie-break: public detail (${signals.join(", ")}).`
        : "Equal-fit tie-break: less public detail is available.",
    };
  });
}
