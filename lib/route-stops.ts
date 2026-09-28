// Route stop resolution, shared by the route detail page and every surface
// that lists routes (Plan, sitemap, mobile feed, static params). Pure: callers
// pass the published catalogue, so a listed route and its detail page can
// never disagree about whether it has stops.
import type { RouteDef, Venue } from "./types";
import type { RouteSummary, VenueWithPerk } from "./data";

type RouteFallbackStage = {
  note: string;
  categories?: Venue["category"][];
  terms?: string[];
};

const ROUTE_FALLBACK_STAGES: Record<string, RouteFallbackStage[]> = {
  "first-day": [
    { note: "Coffee to shake off the flight.", categories: ["cafe"], terms: ["coffee", "breakfast", "slow"] },
    { note: "Easy first daytime stop.", categories: ["surf", "beach_club"], terms: ["surf", "beach", "day"] },
    { note: "Sunset anchor.", categories: ["beach_club", "bar"], terms: ["sunset", "view"] },
    { note: "Dinner to close the day.", categories: ["restaurant", "warung"], terms: ["dinner", "evening"] },
  ],
  "cafe-work": [
    { note: "Quiet start with coffee.", categories: ["cafe"], terms: ["coffee", "breakfast", "slow"] },
    { note: "Laptop-friendly second stop.", categories: ["cafe"], terms: ["work", "wifi", "laptop", "sockets"] },
    { note: "Easy lunch between calls.", categories: ["warung", "restaurant"], terms: ["lunch", "quick"] },
  ],
  "sunset-run": [
    { note: "Get there before golden hour.", categories: ["beach_club"], terms: ["sunset", "beach", "view"] },
    { note: "Dinner as the light goes.", categories: ["restaurant", "warung"], terms: ["dinner", "evening"] },
    { note: "Close with a drink nearby.", categories: ["bar", "beach_club"], terms: ["cocktail", "night", "drinks"] },
  ],
  "canggu-food-route": [
    { note: "Start with a Canggu café or brunch base.", categories: ["cafe"], terms: ["breakfast", "brunch", "coffee"] },
    { note: "Move to a proper local or casual lunch stop.", categories: ["warung", "restaurant"], terms: ["local", "lunch", "casual"] },
    { note: "End with the dinner room worth planning around.", categories: ["restaurant"], terms: ["dinner", "date", "group"] },
  ],
  "canggu-rainy-day": [
    { note: "Begin with a covered café or breakfast stop.", categories: ["cafe"], terms: ["breakfast", "coffee", "covered"] },
    { note: "Use the wet-weather window for a reset.", categories: ["spa", "beauty", "yoga"], terms: ["spa", "massage", "reset"] },
    { note: "Stay close for a low-friction dinner.", categories: ["restaurant", "warung"], terms: ["dinner", "comfort", "easy"] },
  ],
};

function routeText(v: VenueWithPerk): string {
  return [
    v.name,
    v.category,
    v.area,
    v.blurb,
    v.whyItsHere,
    v.bestFor,
    v.notFor,
    v.whatToOrder,
    ...(v.jobs ?? []),
    ...(v.vibeTags ?? []),
    ...(v.practicalTags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function findRouteVenue(
  venues: VenueWithPerk[],
  used: Set<string>,
  stage: RouteFallbackStage
): VenueWithPerk | null {
  const byCategory = venues.find(
    (v) => !used.has(v.slug) && stage.categories?.includes(v.category)
  );
  if (byCategory) return byCategory;

  return (
    venues.find((v) => {
      if (used.has(v.slug)) return false;
      const text = routeText(v);
      return stage.terms?.some((term) => text.includes(term)) ?? false;
    }) ?? null
  );
}

function fallbackRouteStops(slug: string, venues: VenueWithPerk[]): VenueWithPerk[] {
  const stages = ROUTE_FALLBACK_STAGES[slug] ?? [];
  const used = new Set<string>();
  const out: VenueWithPerk[] = [];

  for (const stage of stages) {
    const match = findRouteVenue(venues, used, stage) ?? venues.find((v) => !used.has(v.slug));
    if (!match) continue;
    used.add(match.slug);
    out.push({ ...match, blurb: stage.note || match.blurb });
  }

  return out;
}

export function resolveRouteStops(d: RouteDef, venues: VenueWithPerk[]): VenueWithPerk[] {
  const routeVenues = venues.filter((v) => v.district === d.district);
  const bySlug = new Map(routeVenues.map((v) => [v.slug, v]));
  const explicit = d.stops
    .map((s) => {
      const v = bySlug.get(s.venueSlug);
      if (!v) return null;
      return { ...v, blurb: s.note ?? v.blurb };
    })
    .filter((x): x is VenueWithPerk => x !== null);

  return explicit.length > 0 ? explicit : fallbackRouteStops(d.slug, routeVenues);
}

export function summarizeResolvableRoutes(
  defs: RouteDef[],
  venues: VenueWithPerk[]
): RouteSummary[] {
  return defs
    .map((d) => ({
      slug: d.slug,
      district: d.district,
      title: d.title,
      subtitle: d.subtitle,
      stopCount: resolveRouteStops(d, venues).length,
    }))
    .filter((d) => d.stopCount > 0);
}
