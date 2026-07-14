export interface ExactRouteStop {
  venueSlug: string;
  note?: string;
}

export interface ExactRouteDefinition {
  slug: string;
  stops: readonly ExactRouteStop[];
}

export interface RelatedRouteDefinition extends ExactRouteDefinition {
  title: string;
  subtitle?: string;
}

export interface ExactRelatedRouteSummary {
  slug: string;
  title: string;
  subtitle?: string;
  stopCount: number;
  venuePosition: number;
}

export interface RouteVenueLike {
  slug: string;
  blurb: string;
}

export type RouteIntegrityFailure =
  | { ok: false; code: "route_stops_empty" }
  | { ok: false; code: "route_stop_duplicate_rank" }
  | { ok: false; code: "route_stop_duplicate_venue"; stopIndex: number; venueSlug: string }
  | { ok: false; code: "route_stop_missing_public_venue"; stopIndex: number; venueSlug: string };

export type RouteIntegrityResult<T extends RouteVenueLike> =
  | { ok: true; stops: T[] }
  | RouteIntegrityFailure;

export function routesWithDuplicateStopRanks(
  stops: readonly { routeSlug: string; rank: number }[],
): Set<string> {
  const seenByRoute = new Map<string, Set<number>>();
  const duplicates = new Set<string>();
  for (const stop of stops) {
    const seen = seenByRoute.get(stop.routeSlug) ?? new Set<number>();
    if (seen.has(stop.rank)) duplicates.add(stop.routeSlug);
    else seen.add(stop.rank);
    seenByRoute.set(stop.routeSlug, seen);
  }
  return duplicates;
}

/**
 * Resolves only the explicit editorial route definition. Missing, duplicate,
 * closed, archived, or otherwise unpublished venues make the whole route
 * unavailable; the public product must never synthesize a replacement stop.
 */
export function resolveExactRouteStops<T extends RouteVenueLike>(
  definition: ExactRouteDefinition,
  publicVenues: readonly T[],
): RouteIntegrityResult<T> {
  if (definition.stops.length === 0) return { ok: false, code: "route_stops_empty" };

  const bySlug = new Map(publicVenues.map((venue) => [venue.slug, venue]));
  const seen = new Set<string>();
  const stops: T[] = [];

  for (const [stopIndex, stop] of definition.stops.entries()) {
    if (seen.has(stop.venueSlug)) {
      return {
        ok: false,
        code: "route_stop_duplicate_venue",
        stopIndex,
        venueSlug: stop.venueSlug,
      };
    }
    seen.add(stop.venueSlug);

    const venue = bySlug.get(stop.venueSlug);
    if (!venue) {
      return {
        ok: false,
        code: "route_stop_missing_public_venue",
        stopIndex,
        venueSlug: stop.venueSlug,
      };
    }
    stops.push({ ...venue, blurb: stop.note ?? venue.blurb });
  }

  return { ok: true, stops };
}

const PUBLIC_VENUE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function matchExactRelatedRoutes<T extends RouteVenueLike>(
  definitions: readonly RelatedRouteDefinition[],
  publicVenues: readonly T[],
  venueSlug: string,
): ExactRelatedRouteSummary[] {
  if (venueSlug.length > 120 || !PUBLIC_VENUE_SLUG.test(venueSlug)) return [];

  return definitions.flatMap((definition) => {
    const resolved = resolveExactRouteStops(definition, publicVenues);
    if (!resolved.ok) return [];
    const venueIndex = resolved.stops.findIndex((venue) => venue.slug === venueSlug);
    if (venueIndex < 0) return [];
    return [{
      slug: definition.slug,
      title: definition.title,
      subtitle: definition.subtitle,
      stopCount: resolved.stops.length,
      venuePosition: venueIndex + 1,
    }];
  });
}
