import assert from "node:assert/strict";
import test from "node:test";

type OfflineRouteProfile = "driving" | "walking" | "cycling";

interface RoutePoint {
  latitude: number;
  longitude: number;
}

interface NativeRouteRequest {
  regionId: string;
  version: string;
  profile: OfflineRouteProfile;
  origin: RoutePoint;
  destination: RoutePoint;
}

interface NativeRouteResult extends NativeRouteRequest {
  distanceMeters: number;
  durationSeconds: number;
  geometry: RoutePoint[];
  generatedAt: string;
  trafficAware: false;
}

interface OfflineRoutingPlugin {
  route(request: NativeRouteRequest): Promise<NativeRouteResult>;
}

interface OfflineRoutingRuntime {
  route(request: NativeRouteRequest): Promise<NativeRouteResult>;
}

interface RuntimeAdapterModule {
  createMapboxOfflineRoutingRuntime?: (
    plugin: OfflineRoutingPlugin,
  ) => OfflineRoutingRuntime;
}

const modulePath = "../src/offline-routing-runtime";
async function loadRuntimeAdapter(): Promise<RuntimeAdapterModule> {
  try {
    return await import(modulePath) as RuntimeAdapterModule;
  } catch {
    return {};
  }
}

const request: NativeRouteRequest = {
  regionId: "south-bali",
  version: "2026-07",
  profile: "walking",
  origin: { latitude: -8.65, longitude: 115.12 },
  destination: { latitude: -8.55, longitude: 115.22 },
};

const result: NativeRouteResult = {
  ...request,
  distanceMeters: 12_345,
  durationSeconds: 1_800,
  geometry: [
    request.origin,
    { latitude: -8.60, longitude: 115.17 },
    request.destination,
  ],
  generatedAt: "2026-07-28T08:00:00.000Z",
  trafficAware: false,
};

test("Mapbox routing adapter passes the exact typed request and maps the strict native result", async () => {
  const adapter = await loadRuntimeAdapter();
  assert.equal(typeof adapter.createMapboxOfflineRoutingRuntime, "function");
  let received: NativeRouteRequest | null = null;
  const runtime = adapter.createMapboxOfflineRoutingRuntime!({
    async route(options) {
      received = options;
      return result;
    },
  });

  assert.deepEqual(await runtime.route(request), result);
  assert.deepEqual(received, request);
});

test("Mapbox routing adapter rejects malformed or mismatched native route results", async () => {
  const adapter = await loadRuntimeAdapter();
  assert.equal(typeof adapter.createMapboxOfflineRoutingRuntime, "function");
  const invalidResults: unknown[] = [
    { ...result, version: "2026-06" },
    { ...result, regionId: "east-bali" },
    { ...result, profile: "scooter" },
    { ...result, origin: { latitude: -8.66, longitude: 115.12 } },
    { ...result, distanceMeters: Number.NaN },
    { ...result, durationSeconds: -1 },
    { ...result, geometry: [request.origin] },
    { ...result, generatedAt: "not-a-timestamp" },
    { ...result, trafficAware: true },
  ];

  for (const invalid of invalidResults) {
    const runtime = adapter.createMapboxOfflineRoutingRuntime!({
      async route() {
        return invalid as NativeRouteResult;
      },
    });
    await assert.rejects(
      runtime.route(request),
      /native|route|result|mismatch|invalid/i,
    );
  }
});
