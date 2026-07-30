import type {
  OfflineBaliManifest,
  OfflinePackState,
  OfflineRegionManifest,
} from "../../lib/journey/offline-bali";

export type OfflineRouteProfile = "driving" | "walking" | "cycling";

export interface OfflineRoutePoint {
  latitude: number;
  longitude: number;
}

export interface OfflineRoute {
  regionId: string;
  version: string;
  profile: OfflineRouteProfile;
  origin: OfflineRoutePoint;
  destination: OfflineRoutePoint;
  distanceMeters: number;
  durationSeconds: number;
  geometry: OfflineRoutePoint[];
  generatedAt: string;
  trafficAware: false;
}

export interface OfflineRoutingRuntime {
  route(request: {
    regionId: string;
    version: string;
    profile: OfflineRouteProfile;
    origin: OfflineRoutePoint;
    destination: OfflineRoutePoint;
  }): Promise<OfflineRoute>;
}

export type OfflineRouteResolution =
  | {
    status: "ready";
    source: "cached" | "native";
    label: string;
    trafficAware: false;
    route: OfflineRoute;
  }
  | {
    status: "blocked";
    reason: "offline_pack_unavailable" | "outside_downloaded_region" | "profile_unsupported";
  };

interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

const PROFILES = new Set<OfflineRouteProfile>(["driving", "walking", "cycling"]);
const MAX_OFFLINE_ROUTE_CACHE_AGE_MS = 30 * 24 * 60 * 60 * 1_000;

function parseBounds(region: OfflineRegionManifest): Bounds {
  const match = /^mapbox:bbox:([-.\d]+),([-.\d]+),([-.\d]+),([-.\d]+)$/
    .exec(region.coverageRef);
  if (!match) throw new Error("Invalid offline route region bounds");
  const [west, south, east, north] = match.slice(1).map(Number);
  if (
    ![west, south, east, north].every(Number.isFinite)
    || west! >= east!
    || south! >= north!
    || west! < -180
    || east! > 180
    || south! < -90
    || north! > 90
  ) throw new Error("Invalid offline route region bounds");
  return { west: west!, south: south!, east: east!, north: north! };
}

function isPoint(value: unknown): value is OfflineRoutePoint {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const point = value as Partial<OfflineRoutePoint>;
  return Object.keys(value).sort().join(",") === "latitude,longitude"
    && typeof point.latitude === "number"
    && Number.isFinite(point.latitude)
    && point.latitude >= -90
    && point.latitude <= 90
    && typeof point.longitude === "number"
    && Number.isFinite(point.longitude)
    && point.longitude >= -180
    && point.longitude <= 180;
}

function pointInBounds(point: OfflineRoutePoint, bounds: Bounds): boolean {
  return point.longitude >= bounds.west
    && point.longitude <= bounds.east
    && point.latitude >= bounds.south
    && point.latitude <= bounds.north;
}

function samePoint(left: OfflineRoutePoint, right: OfflineRoutePoint): boolean {
  return left.latitude === right.latitude && left.longitude === right.longitude;
}

function dateTimestamp(date: Date, label: string): number {
  const timestamp = date.getTime();
  if (!Number.isFinite(timestamp)) throw new Error(`Invalid ${label} timestamp`);
  return timestamp;
}

function currentRegion(
  manifest: OfflineBaliManifest,
  pack: OfflinePackState | undefined,
  now: Date,
): OfflineRegionManifest | null {
  if (
    manifest.providerStatus !== "available"
    || !manifest.capabilities.mapTiles
    || !manifest.capabilities.gpsOnDownloadedMap
    || !manifest.capabilities.onboardRouting
    || !pack
    || pack.status !== "ready"
    || pack.progress !== 1
    || pack.downloadedBytes !== pack.totalBytes
  ) return null;
  const nowTimestamp = dateTimestamp(now, "offline route");
  return manifest.regions.find((region) => (
    region.id === pack.regionId
    && region.version === pack.version
    && Date.parse(region.expiresAt) > nowTimestamp
  )) ?? null;
}

function validateRoute(
  input: unknown,
  region: OfflineRegionManifest,
  now: Date,
  maxAgeMs: number,
): OfflineRoute {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Invalid offline route cache entry");
  }
  if (
    Object.keys(input).sort().join(",")
    !== "destination,distanceMeters,durationSeconds,generatedAt,geometry,origin,profile,regionId,trafficAware,version"
  ) throw new Error("Invalid offline route cache shape");
  const route = input as Partial<OfflineRoute>;
  if (
    route.regionId !== region.id
    || route.version !== region.version
    || !PROFILES.has(route.profile as OfflineRouteProfile)
    || route.trafficAware !== false
    || !isPoint(route.origin)
    || !isPoint(route.destination)
    || typeof route.distanceMeters !== "number"
    || !Number.isFinite(route.distanceMeters)
    || route.distanceMeters <= 0
    || typeof route.durationSeconds !== "number"
    || !Number.isFinite(route.durationSeconds)
    || route.durationSeconds <= 0
    || !Array.isArray(route.geometry)
    || route.geometry.length < 2
    || route.geometry.length > 5_000
    || !route.geometry.every(isPoint)
    || typeof route.generatedAt !== "string"
  ) throw new Error("Invalid offline route result");

  const bounds = parseBounds(region);
  if (
    !pointInBounds(route.origin, bounds)
    || !pointInBounds(route.destination, bounds)
    || !route.geometry.every((point) => pointInBounds(point, bounds))
  ) throw new Error("Offline route is outside region bounds");
  if (
    !samePoint(route.geometry[0]!, route.origin)
    || !samePoint(route.geometry.at(-1)!, route.destination)
  ) throw new Error("Offline route geometry endpoints are invalid");

  const generatedAt = Date.parse(route.generatedAt);
  const nowTimestamp = dateTimestamp(now, "offline route");
  const age = nowTimestamp - generatedAt;
  if (
    !Number.isFinite(generatedAt)
    || new Date(generatedAt).toISOString() !== route.generatedAt
    || age < 0
    || age > maxAgeMs
  ) {
    throw new Error("Offline route cache is stale");
  }
  return route as OfflineRoute;
}

function routeKey(route: OfflineRoute): string {
  return [
    route.regionId,
    route.version,
    route.profile,
    route.origin.latitude,
    route.origin.longitude,
    route.destination.latitude,
    route.destination.longitude,
  ].join(":");
}

export function parseOfflineRouteCache(
  value: unknown,
  context: {
    manifest: OfflineBaliManifest;
    packs: readonly OfflinePackState[];
    now: Date;
    maxAgeMs: number;
  },
): OfflineRoute[] {
  if (
    !Array.isArray(value)
    || value.length > 100
    || !Number.isSafeInteger(context.maxAgeMs)
    || context.maxAgeMs < 0
    || context.maxAgeMs > MAX_OFFLINE_ROUTE_CACHE_AGE_MS
  ) throw new Error("Invalid offline route cache");
  dateTimestamp(context.now, "offline route cache");

  const seen = new Set<string>();
  return value.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("Invalid offline route cache entry");
    }
    const candidate = entry as Partial<OfflineRoute>;
    const pack = context.packs.find((item) => item.regionId === candidate.regionId);
    const region = currentRegion(context.manifest, pack, context.now);
    if (!region) throw new Error("Offline route region or pack is unavailable");
    const route = validateRoute(entry, region, context.now, context.maxAgeMs);
    const key = routeKey(route);
    if (seen.has(key)) throw new Error("Duplicate offline route cache entry");
    seen.add(key);
    return route;
  });
}

export async function resolveOfflineRoute(options: {
  manifest: OfflineBaliManifest;
  pack: OfflinePackState | undefined;
  profile: string;
  origin: OfflineRoutePoint;
  destination: OfflineRoutePoint;
  cache: readonly OfflineRoute[];
  runtime: OfflineRoutingRuntime;
  now: Date;
}): Promise<OfflineRouteResolution> {
  if (!PROFILES.has(options.profile as OfflineRouteProfile)) {
    return { status: "blocked", reason: "profile_unsupported" };
  }
  const profile = options.profile as OfflineRouteProfile;
  const region = currentRegion(options.manifest, options.pack, options.now);
  if (!region) return { status: "blocked", reason: "offline_pack_unavailable" };

  const bounds = parseBounds(region);
  if (
    !isPoint(options.origin)
    || !isPoint(options.destination)
    || !pointInBounds(options.origin, bounds)
    || !pointInBounds(options.destination, bounds)
  ) return { status: "blocked", reason: "outside_downloaded_region" };

  const cached = options.cache.find((route) => (
    route.regionId === region.id
    && route.version === region.version
    && route.profile === profile
    && samePoint(route.origin, options.origin)
    && samePoint(route.destination, options.destination)
  ));
  if (cached) {
    const validated = validateRoute(cached, region, options.now, Number.POSITIVE_INFINITY);
    return {
      status: "ready",
      source: "cached",
      label: "Cached offline route",
      trafficAware: false,
      route: validated,
    };
  }

  const native = await options.runtime.route({
    regionId: region.id,
    version: region.version,
    profile,
    origin: options.origin,
    destination: options.destination,
  });
  const validated = validateRoute(native, region, options.now, 0);
  if (
    validated.profile !== profile
    || !samePoint(validated.origin, options.origin)
    || !samePoint(validated.destination, options.destination)
  ) throw new Error("Invalid native offline route result");
  return {
    status: "ready",
    source: "native",
    label: "Offline route",
    trafficAware: false,
    route: validated,
  };
}
