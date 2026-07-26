import assert from "node:assert/strict";
import test from "node:test";
import { JourneyError, type RouteRequest } from "../journey/contracts";
import { googleMapsDirectionsHandoff } from "../journey/routing";
import {
  assertProviderCanBeEnabled,
  ExternalDirectionsOnlyRouteService,
  ROUTING_PROVIDER_CAPABILITIES,
} from "./routing-provider";

const request: RouteRequest = {
  origin: { latitude: -8.6478, longitude: 115.1385 },
  destination: { latitude: -8.6913, longitude: 115.1682 },
  transportMode: "scooter",
};

test("Google Maps universal handoff encodes Bali coordinates and two-wheeler mode", () => {
  const url = new URL(googleMapsDirectionsHandoff(request));
  assert.equal(url.origin, "https://www.google.com");
  assert.equal(url.pathname, "/maps/dir/");
  assert.equal(url.searchParams.get("api"), "1");
  assert.equal(url.searchParams.get("origin"), "-8.6478,115.1385");
  assert.equal(url.searchParams.get("destination"), "-8.6913,115.1682");
  assert.equal(url.searchParams.get("travelmode"), "two-wheeler");
  assert.equal(url.searchParams.has("key"), false);
});

test("handoff rejects finite but invalid WGS84 coordinates", () => {
  assert.throws(
    () => googleMapsDirectionsHandoff({
      ...request,
      destination: { latitude: 91, longitude: 115 },
    }),
    (error: unknown) => error instanceof JourneyError && error.code === "DEEP_LINK_INVALID",
  );
});

test("external-only service never invents an estimate or offline capability", async () => {
  const service = new ExternalDirectionsOnlyRouteService();
  await assert.rejects(
    service.getTravelEstimate(request),
    (error: unknown) => error instanceof JourneyError && error.code === "ROUTE_PROVIDER_UNAVAILABLE",
  );
  assert.equal(await service.getOfflineRouteCapability(), "unsupported");
  assert.match(await service.getDirectionsHandoff(request), /^https:\/\/www\.google\.com\/maps\/dir\//);
});

test("credentialed and unverified providers remain fail-closed", () => {
  assert.equal(assertProviderCanBeEnabled("google_maps_url").productionStatus, "available");
  for (const provider of ["google_routes", "mapbox", "grab"] as const) {
    assert.equal(ROUTING_PROVIDER_CAPABILITIES[provider].productionStatus, "blocked");
    assert.throws(
      () => assertProviderCanBeEnabled(provider),
      (error: unknown) => error instanceof JourneyError && error.code === "ROUTE_PROVIDER_UNAVAILABLE",
    );
  }
});
