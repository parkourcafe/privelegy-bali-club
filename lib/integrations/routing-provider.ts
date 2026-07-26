import { JourneyError, type RouteRequest, type RouteSummary, type TravelEstimate } from "../journey/contracts";
import { googleMapsDirectionsHandoff, type RouteService } from "../journey/routing";

export type RoutingProviderId = "google_maps_url" | "google_routes" | "mapbox" | "grab";

export interface RoutingProviderCapability {
  id: RoutingProviderId;
  directionsHandoff: boolean;
  estimates: boolean;
  traffic: boolean;
  embeddedNavigation: boolean;
  offlineMap: boolean;
  offlineNavigation: boolean;
  credentialRequired: boolean;
  productionStatus: "available" | "blocked";
  blockReason: string | null;
}

/**
 * Audited capabilities, not feature flags. A blocked provider must not be
 * promoted to a live adapter merely because a client-side token exists.
 */
export const ROUTING_PROVIDER_CAPABILITIES: Readonly<Record<RoutingProviderId, RoutingProviderCapability>> = {
  google_maps_url: {
    id: "google_maps_url",
    directionsHandoff: true,
    estimates: false,
    traffic: false,
    embeddedNavigation: false,
    offlineMap: false,
    offlineNavigation: false,
    credentialRequired: false,
    productionStatus: "available",
    blockReason: null,
  },
  google_routes: {
    id: "google_routes",
    directionsHandoff: false,
    estimates: true,
    traffic: true,
    embeddedNavigation: false,
    offlineMap: false,
    offlineNavigation: false,
    credentialRequired: true,
    productionStatus: "blocked",
    blockReason: "Billing, server credentials, attribution UI and Bali route-quality acceptance are not configured.",
  },
  mapbox: {
    id: "mapbox",
    directionsHandoff: false,
    estimates: true,
    traffic: true,
    embeddedNavigation: true,
    offlineMap: true,
    offlineNavigation: true,
    credentialRequired: true,
    productionStatus: "blocked",
    blockReason: "Account terms, tokens, telemetry consent, storage budget and Bali device acceptance are not configured.",
  },
  grab: {
    id: "grab",
    directionsHandoff: false,
    estimates: false,
    traffic: false,
    embeddedNavigation: false,
    offlineMap: false,
    offlineNavigation: false,
    credentialRequired: true,
    productionStatus: "blocked",
    blockReason: "No verified public consumer ride deep-link or routing API contract is approved.",
  },
};

/**
 * Production-safe Phase 1 service. It provides only the verified universal
 * handoff and fails closed for provider-owned calculations.
 */
export class ExternalDirectionsOnlyRouteService implements RouteService {
  async getTravelEstimate(): Promise<TravelEstimate> {
    throw unavailable();
  }

  async getRoute(): Promise<RouteSummary> {
    throw unavailable();
  }

  async getRouteMatrix(): Promise<TravelEstimate[]> {
    throw unavailable();
  }

  async getTransportOptions(): Promise<TravelEstimate[]> {
    throw unavailable();
  }

  async getDirectionsHandoff(request: RouteRequest): Promise<string> {
    return googleMapsDirectionsHandoff(request);
  }

  async getTrafficAdvisory(): Promise<string | null> {
    return null;
  }

  async getOfflineRouteCapability(): Promise<"unsupported"> {
    return "unsupported";
  }
}

export function assertProviderCanBeEnabled(provider: RoutingProviderId): RoutingProviderCapability {
  const capability = ROUTING_PROVIDER_CAPABILITIES[provider];
  if (capability.productionStatus !== "available") {
    throw new JourneyError(
      "ROUTE_PROVIDER_UNAVAILABLE",
      capability.blockReason ?? `${provider} has not passed provider acceptance`,
      false,
    );
  }
  return capability;
}

function unavailable(): JourneyError {
  return new JourneyError(
    "ROUTE_PROVIDER_UNAVAILABLE",
    "Live route estimates require an approved provider; open Google Maps for current directions.",
    true,
  );
}
