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

export function googleMapsDirectionsHandoff(request: RouteRequest): string {
  const values = [
    request.origin.latitude,
    request.origin.longitude,
    request.destination.latitude,
    request.destination.longitude,
  ];
  if (values.some((value) => !Number.isFinite(value))) {
    throw new JourneyError("DEEP_LINK_INVALID", "Directions require finite coordinates");
  }
  const mode = request.transportMode === "scooter" ? "driving" : request.transportMode;
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

