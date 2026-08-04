import { JourneyError, type RouteRequest, type RouteSummary, type TravelEstimate } from "./contracts";

export interface RouteService {
  getTravelEstimate(request: RouteRequest): Promise<TravelEstimate>;
  getRoute(request: RouteRequest): Promise<RouteSummary>;
  getRouteMatrix(requests: RouteRequest[]): Promise<TravelEstimate[]>;
  getTransportOptions(request: RouteRequest): Promise<TravelEstimate[]>;
  getDirectionsHandoff(request: RouteRequest): Promise<string>;
  getTrafficAdvisory(request: RouteRequest): Promise<string | null>;
  getOfflineRouteCapability(): Promise<"unsupported" | "requires_downloaded_pack" | "available">;
}

function assertCoordinates(latitude: number, longitude: number, label: string): void {
  if (
    !Number.isFinite(latitude)
    || !Number.isFinite(longitude)
    || latitude < -90
    || latitude > 90
    || longitude < -180
    || longitude > 180
  ) {
    throw new JourneyError("DEEP_LINK_INVALID", `${label} requires valid WGS84 coordinates`);
  }
}

export function googleMapsDirectionsHandoff(request: RouteRequest): string {
  assertCoordinates(request.origin.latitude, request.origin.longitude, "Origin");
  assertCoordinates(request.destination.latitude, request.destination.longitude, "Destination");
  const mode = request.transportMode === "scooter"
    ? "two-wheeler"
    : request.transportMode === "drive"
      ? "driving"
      : request.transportMode === "walk"
        ? "walking"
        : "transit";
  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api", "1");
  url.searchParams.set("origin", `${request.origin.latitude},${request.origin.longitude}`);
  url.searchParams.set("destination", `${request.destination.latitude},${request.destination.longitude}`);
  url.searchParams.set("travelmode", mode);
  return url.toString();
}

export async function routeWithExternalFallback(
  service: RouteService,
  request: RouteRequest,
): Promise<{ route: RouteSummary | null; handoff: string; fallback: boolean }> {
  try {
    const route = await service.getRoute(request);
    return { route, handoff: await service.getDirectionsHandoff(request), fallback: false };
  } catch (error) {
    if (!(error instanceof JourneyError) || ![
      "ROUTE_PROVIDER_UNAVAILABLE",
      "ROUTE_QUOTA_EXCEEDED",
      "ROUTE_NO_PATH",
    ].includes(error.code)) throw error;
    return { route: null, handoff: googleMapsDirectionsHandoff(request), fallback: true };
  }
}
