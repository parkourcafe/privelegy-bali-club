import {
  getDistrictsGuide,
  getPublishedVenues,
  getRoute,
  getRoutes,
  isPublicReadyVenue,
} from "../data";
import {
  anonClient,
  isSeedFallbackAllowed,
  isSupabaseConfigured,
} from "../supabase/server";
import {
  MOBILE_API_LIMITS,
  MOBILE_API_MINIMUM_SUPPORTED_VERSION,
  MOBILE_APP_CONFIG,
  MOBILE_CONSENT_VERSION,
  compactMobileVenue,
  toMobileDistrict,
  toMobileRouteDetail,
  toMobileRouteSummary,
  toMobileVenue,
  type MobileBootstrapData,
  type MobileConfigData,
  type MobileRouteData,
  type MobileRouteDetail,
  type MobileRoutesData,
  type MobileVenueData,
  type MobileVenuesData,
} from "./contracts";
import { classifyGoogleMapsHandoff } from "../external-links";
import { MOBILE_DISTRICTS, MOBILE_VENUE_TYPES } from "./taxonomy";

const MOBILE_VENUE_READINESS_COLUMNS = [
  "id",
  "slug",
  "name",
  "category",
  "district",
  "address",
  "gmaps_url",
  "official_url",
  "instagram_url",
  "tier",
  "status",
  "is_sponsored",
  "vibe_tags",
  "price_anchor",
  "what_to_order",
  "photo_url",
  "area",
  "why_its_here",
  "best_for",
  "not_for",
  "practical_tags",
  "jobs",
  "owner_note",
  "publication_status",
  "wellness_categories",
].join(",");

export type MobileBackendReadiness =
  | { ready: true }
  | { ready: false; reason: "dependency_unavailable" | "empty_catalog" };

const MOBILE_VENUE_TYPE_SET = new Set<string>(MOBILE_VENUE_TYPES);
const MOBILE_DISTRICT_SET = new Set<string>(MOBILE_DISTRICTS);

function hasDeliverableMobileVenue(rows: unknown): boolean {
  if (!Array.isArray(rows)) return false;
  return rows.some((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const row = value as Record<string, unknown>;
    const handoff = classifyGoogleMapsHandoff(row.gmaps_url);
    return typeof row.id === "string"
      && typeof row.slug === "string"
      && typeof row.name === "string"
      && MOBILE_VENUE_TYPE_SET.has(String(row.category))
      && MOBILE_DISTRICT_SET.has(String(row.district))
      && handoff !== null
      && handoff !== "search";
  });
}

/**
 * A bounded production probe for the exact tables and legacy columns used by
 * the mobile bootstrap. It avoids loading the whole catalogue on every health
 * poll while still failing closed on schema or RLS drift.
 */
export async function probeMobileBackendReadiness(): Promise<MobileBackendReadiness> {
  if (isSeedFallbackAllowed()) {
    const data = await getMobileBootstrapData();
    return data.venues.length > 0
      ? { ready: true }
      : { ready: false, reason: "empty_catalog" };
  }
  if (!isSupabaseConfigured()) return { ready: false, reason: "dependency_unavailable" };
  const client = anonClient();
  if (!client) return { ready: false, reason: "dependency_unavailable" };

  const [venueSchema, venueCandidates, routes, stops, planEntries] = await Promise.all([
    client
      .from("venues")
      .select(MOBILE_VENUE_READINESS_COLUMNS)
      .eq("status", "active")
      .eq("publication_status", "published")
      .limit(1),
    client
      .from("venues")
      .select("id,slug,name,category,district,gmaps_url")
      .eq("status", "active")
      .eq("publication_status", "published")
      .not("gmaps_url", "is", null)
      .limit(100),
    client.from("routes").select("slug,district,title,subtitle,rank").limit(1),
    client.from("route_stops").select("route_slug,venue_slug,rank,note").limit(1),
    client.from("plan_entries").select("venue_slug,slot,rank,blurb").limit(1),
  ]);
  if (venueSchema.error || venueCandidates.error || routes.error || stops.error || planEntries.error) {
    return { ready: false, reason: "dependency_unavailable" };
  }
  return venueSchema.data?.length && hasDeliverableMobileVenue(venueCandidates.data)
    ? { ready: true }
    : { ready: false, reason: "empty_catalog" };
}

async function assertVenueBackendReady(): Promise<void> {
  if (isSeedFallbackAllowed()) return;
  if (!isSupabaseConfigured()) throw new Error("mobile_data_backend_unavailable");
  const client = anonClient();
  if (!client) throw new Error("mobile_data_backend_unavailable");
  const { error } = await client
    .from("venues")
    .select(MOBILE_VENUE_READINESS_COLUMNS)
    .eq("status", "active")
    .eq("publication_status", "published")
    .limit(1);
  if (error) throw new Error("mobile_data_backend_unavailable");
}

async function assertRouteBackendReady(): Promise<void> {
  if (isSeedFallbackAllowed()) return;
  if (!isSupabaseConfigured()) throw new Error("mobile_data_backend_unavailable");
  const client = anonClient();
  if (!client) throw new Error("mobile_data_backend_unavailable");
  const [
    { error: routesError },
    { error: stopsError },
    { error: planEntriesError },
  ] = await Promise.all([
    client.from("routes").select("slug,district,title,subtitle,rank").limit(1),
    client.from("route_stops").select("route_slug,venue_slug,rank,note").limit(1),
    client.from("plan_entries").select("venue_slug,slot,rank,blurb").limit(1),
  ]);
  if (routesError || stopsError || planEntriesError) {
    throw new Error("mobile_data_backend_unavailable");
  }
}

async function loadPublicMobileVenues() {
  await assertVenueBackendReady();
  const source = await getPublishedVenues();
  return source
    .filter(isPublicReadyVenue)
    .flatMap((venue) => {
      const mapped = toMobileVenue(venue);
      return mapped ? [mapped] : [];
    })
    .sort((a, b) => a.district.localeCompare(b.district) || a.name.localeCompare(b.name))
    .slice(0, MOBILE_API_LIMITS.venues);
}

async function loadPublicMobileRoute(slug: string): Promise<MobileRouteDetail | null> {
  await Promise.all([assertVenueBackendReady(), assertRouteBackendReady()]);
  const source = await getRoute(slug);
  if (!source) return null;
  return toMobileRouteDetail({
    slug: source.slug,
    title: source.title,
    subtitle: source.subtitle,
    stops: source.stops.filter(isPublicReadyVenue),
  });
}

async function loadPublicMobileRoutes(): Promise<MobileRouteDetail[]> {
  await Promise.all([assertVenueBackendReady(), assertRouteBackendReady()]);
  const source = (await getRoutes()).slice(0, MOBILE_API_LIMITS.routes);
  const routes = await Promise.all(source.map(async (route) => {
    const detail = await getRoute(route.slug);
    if (!detail) return null;
    return toMobileRouteDetail({
      slug: detail.slug,
      title: detail.title,
      subtitle: detail.subtitle,
      stops: detail.stops.filter(isPublicReadyVenue),
    });
  }));
  return routes.filter((route): route is MobileRouteDetail => route !== null);
}

export async function getMobileBootstrapData(): Promise<MobileBootstrapData> {
  const [districtSource, venues, routeDetails] = await Promise.all([
    getDistrictsGuide(),
    loadPublicMobileVenues(),
    loadPublicMobileRoutes(),
  ]);
  const districts = districtSource
    .flatMap((district) => {
      const mapped = toMobileDistrict(district);
      return mapped ? [mapped] : [];
    })
    .slice(0, MOBILE_API_LIMITS.districts);
  return {
    config: MOBILE_APP_CONFIG,
    districts,
    venues: venues.map(compactMobileVenue),
    routes: routeDetails.map(toMobileRouteSummary),
    consentVersion: MOBILE_CONSENT_VERSION,
    minimumSupportedApiVersion: MOBILE_API_MINIMUM_SUPPORTED_VERSION,
  };
}

export async function getMobileVenuesData(): Promise<MobileVenuesData> {
  return { venues: await loadPublicMobileVenues() };
}

export async function getMobileVenueData(slug: string): Promise<MobileVenueData | null> {
  const venues = await loadPublicMobileVenues();
  const venue = venues.find((entry) => entry.slug === slug);
  return venue ? { venue } : null;
}

export async function getMobileRoutesData(): Promise<MobileRoutesData> {
  const routes = await loadPublicMobileRoutes();
  return { routes: routes.map(toMobileRouteSummary) };
}

export async function getMobileRouteData(slug: string): Promise<MobileRouteData | null> {
  const route = await loadPublicMobileRoute(slug);
  return route ? { route } : null;
}

export function getMobileConfigData(): MobileConfigData {
  return {
    config: MOBILE_APP_CONFIG,
    consentVersion: MOBILE_CONSENT_VERSION,
    minimumSupportedApiVersion: MOBILE_API_MINIMUM_SUPPORTED_VERSION,
  };
}
