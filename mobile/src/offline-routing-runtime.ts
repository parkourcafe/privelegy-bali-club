import type {
  OfflineRoute,
  OfflineRoutePoint,
  OfflineRouteProfile,
  OfflineRoutingRuntime,
} from "./offline-routing";

export interface OfflineRoutingPlugin {
  route(request: {
    regionId: string;
    version: string;
    profile: OfflineRouteProfile;
    origin: OfflineRoutePoint;
    destination: OfflineRoutePoint;
  }): Promise<OfflineRoute>;
}

function samePoint(left: OfflineRoutePoint, right: OfflineRoutePoint): boolean {
  return left.latitude === right.latitude && left.longitude === right.longitude;
}

function validPoint(value: unknown): value is OfflineRoutePoint {
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

function validateNativeResult(
  value: unknown,
  request: Parameters<OfflineRoutingPlugin["route"]>[0],
): OfflineRoute {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid native route result");
  }
  if (
    Object.keys(value).sort().join(",")
    !== "destination,distanceMeters,durationSeconds,generatedAt,geometry,origin,profile,regionId,trafficAware,version"
  ) throw new Error("Invalid native route result");
  const route = value as Partial<OfflineRoute>;
  const generatedAt = typeof route.generatedAt === "string"
    ? Date.parse(route.generatedAt)
    : Number.NaN;
  if (
    route.regionId !== request.regionId
    || route.version !== request.version
    || route.profile !== request.profile
    || !validPoint(route.origin)
    || !samePoint(route.origin, request.origin)
    || !validPoint(route.destination)
    || !samePoint(route.destination, request.destination)
    || typeof route.distanceMeters !== "number"
    || !Number.isFinite(route.distanceMeters)
    || route.distanceMeters <= 0
    || typeof route.durationSeconds !== "number"
    || !Number.isFinite(route.durationSeconds)
    || route.durationSeconds <= 0
    || !Array.isArray(route.geometry)
    || route.geometry.length < 2
    || route.geometry.length > 5_000
    || !route.geometry.every(validPoint)
    || !samePoint(route.geometry[0]!, request.origin)
    || !samePoint(route.geometry.at(-1)!, request.destination)
    || !Number.isFinite(generatedAt)
    || new Date(generatedAt).toISOString() !== route.generatedAt
    || route.trafficAware !== false
  ) throw new Error("Invalid or mismatched native route result");
  return route as OfflineRoute;
}

export function createMapboxOfflineRoutingRuntime(
  plugin: OfflineRoutingPlugin,
): OfflineRoutingRuntime {
  return {
    async route(request) {
      const result = await plugin.route(request);
      return validateNativeResult(result, request);
    },
  };
}
