import { resolveSafeExternalLink, type SafeExternalLink } from "./external-links";

const PUBLIC_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface RouteStopSource {
  slug: string;
  name: string;
  gmapsUrl: string;
}

export interface RouteStopPresentation<T extends RouteStopSource> {
  venue: T;
  position: number;
  anchorId: string;
  detailHref: string;
  directions: SafeExternalLink | null;
}

/**
 * Builds only presentation data that can be derived from the published stops.
 * It deliberately does not infer coordinates, travel times, opening status, or
 * replacement venues.
 */
export function presentRouteStops<T extends RouteStopSource>(
  stops: readonly T[],
): RouteStopPresentation<T>[] {
  return stops.map((venue, index) => ({
    venue,
    position: index + 1,
    anchorId: `route-stop-${index + 1}`,
    detailHref: `/places/${encodeURIComponent(venue.slug)}`,
    directions: resolveSafeExternalLink(venue.gmapsUrl, "google_maps"),
  }));
}

export function canonicalRoutePath(slug: string): string | null {
  return PUBLIC_SLUG.test(slug) ? `/route/${slug}` : null;
}

export function unsavedRouteStopSlugs(
  stopSlugs: readonly string[],
  savedSlugs: readonly string[],
): string[] {
  const saved = new Set(savedSlugs);
  return [...new Set(stopSlugs)].filter((slug) => PUBLIC_SLUG.test(slug) && !saved.has(slug));
}
