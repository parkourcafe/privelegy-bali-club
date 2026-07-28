import assert from "node:assert/strict";
import test from "node:test";
import type {
  OfflineBaliManifest,
  OfflinePackState,
} from "../../lib/journey/offline-bali";

type OfflineRouteProfile = "driving" | "walking" | "cycling";

interface RoutePoint {
  latitude: number;
  longitude: number;
}

interface OfflineRoute {
  regionId: string;
  version: string;
  profile: OfflineRouteProfile;
  origin: RoutePoint;
  destination: RoutePoint;
  distanceMeters: number;
  durationSeconds: number;
  geometry: RoutePoint[];
  generatedAt: string;
  trafficAware: false;
}

interface OfflineRoutingRuntime {
  route(request: {
    regionId: string;
    version: string;
    profile: OfflineRouteProfile;
    origin: RoutePoint;
    destination: RoutePoint;
  }): Promise<OfflineRoute>;
}

interface OfflineRoutingModule {
  parseOfflineRouteCache?: (
    value: unknown,
    context: {
      manifest: OfflineBaliManifest;
      packs: readonly OfflinePackState[];
      now: Date;
      maxAgeMs: number;
    },
  ) => OfflineRoute[];
  resolveOfflineRoute?: (options: {
    manifest: OfflineBaliManifest;
    pack: OfflinePackState | undefined;
    profile: string;
    origin: RoutePoint;
    destination: RoutePoint;
    cache: readonly OfflineRoute[];
    runtime: OfflineRoutingRuntime;
    now: Date;
  }) => Promise<
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
    }
  >;
}

const modulePath = "../src/offline-routing";
async function loadOfflineRouting(): Promise<OfflineRoutingModule> {
  try {
    return await import(modulePath) as OfflineRoutingModule;
  } catch {
    return {};
  }
}

const manifest: OfflineBaliManifest = {
  schemaVersion: 1,
  updatedAt: "2026-07-28T08:00:00.000Z",
  providerStatus: "available",
  capabilities: {
    mapTiles: true,
    gpsOnDownloadedMap: true,
    onboardRouting: true,
  },
  regions: [{
    id: "south-bali",
    name: "South Bali",
    coverageRef: "mapbox:bbox:115.0,-8.8,115.3,-8.4",
    version: "2026-07",
    styleVersion: "mapbox-11.26",
    estimatedBytes: 1_000,
    expiresAt: "2026-08-28T08:00:00.000Z",
  }],
  reason: null,
};

const pack: OfflinePackState = {
  regionId: "south-bali",
  version: "2026-07",
  status: "ready",
  progress: 1,
  downloadedBytes: 1_000,
  totalBytes: 1_000,
  updatedAt: "2026-07-28T07:00:00.000Z",
  lastError: null,
};

const origin = { latitude: -8.65, longitude: 115.12 };
const destination = { latitude: -8.55, longitude: 115.22 };
const cachedRoute: OfflineRoute = {
  regionId: "south-bali",
  version: "2026-07",
  profile: "driving",
  origin,
  destination,
  distanceMeters: 12_345,
  durationSeconds: 1_800,
  geometry: [
    origin,
    { latitude: -8.60, longitude: 115.17 },
    destination,
  ],
  generatedAt: "2026-07-28T07:30:00.000Z",
  trafficAware: false,
};

test("offline route cache accepts only unique current exact in-bounds routes", async () => {
  const routing = await loadOfflineRouting();
  assert.equal(typeof routing.parseOfflineRouteCache, "function");
  const parse = routing.parseOfflineRouteCache!;
  const context = {
    manifest,
    packs: [pack],
    now: new Date("2026-07-28T08:00:00.000Z"),
    maxAgeMs: 24 * 60 * 60 * 1_000,
  };

  assert.deepEqual(parse([cachedRoute], context), [cachedRoute]);

  const invalidCaches: unknown[] = [
    [cachedRoute, { ...cachedRoute }],
    [{ ...cachedRoute, version: "2026-06" }],
    [{ ...cachedRoute, regionId: "east-bali" }],
    [{
      ...cachedRoute,
      destination: { latitude: -8.55, longitude: 115.31 },
    }],
    [{
      ...cachedRoute,
      geometry: [origin],
    }],
    [{
      ...cachedRoute,
      geometry: Array.from({ length: 5_001 }, (_, index) => (
        index === 0
          ? origin
          : index === 5_000
            ? destination
            : { latitude: -8.60, longitude: 115.17 }
      )),
    }],
    [{
      ...cachedRoute,
      geometry: [
        origin,
        { latitude: -8.60, longitude: 115.31 },
        destination,
      ],
    }],
    [{
      ...cachedRoute,
      generatedAt: "2026-07-26T08:00:00.000Z",
    }],
    [{
      ...cachedRoute,
      distanceMeters: Number.POSITIVE_INFINITY,
    }],
    [{
      ...cachedRoute,
      profile: "scooter",
    }],
    [{
      ...cachedRoute,
      trafficAware: true,
    }],
  ];
  for (const invalid of invalidCaches) {
    assert.throws(
      () => parse(invalid, context),
      /cache|duplicate|route|region|bounds|geometry|stale|profile|traffic/i,
    );
  }
});

test("exact cached routes are used offline with a cached label and native results are strictly validated", async () => {
  const routing = await loadOfflineRouting();
  assert.equal(typeof routing.resolveOfflineRoute, "function");
  const resolve = routing.resolveOfflineRoute!;
  let calls = 0;
  const mustNotRoute: OfflineRoutingRuntime = {
    async route() {
      calls += 1;
      throw new Error("native routing must not be called");
    },
  };

  const cached = await resolve({
    manifest,
    pack,
    profile: "driving",
    origin,
    destination,
    cache: [cachedRoute],
    runtime: mustNotRoute,
    now: new Date("2026-07-28T08:00:00.000Z"),
  });
  assert.equal(calls, 0);
  assert.equal(cached.status, "ready");
  if (cached.status === "ready") {
    assert.equal(cached.source, "cached");
    assert.match(cached.label, /cached/i);
    assert.doesNotMatch(cached.label, /live|traffic/i);
    assert.equal(cached.trafficAware, false);
    assert.deepEqual(cached.route, cachedRoute);
  }

  const nativeRuntime: OfflineRoutingRuntime = {
    async route(request) {
      calls += 1;
      return {
        ...request,
        distanceMeters: 12_345,
        durationSeconds: 1_800,
        geometry: [origin, destination],
        generatedAt: "2026-07-28T08:00:00.000Z",
        trafficAware: false,
      };
    },
  };
  const native = await resolve({
    manifest,
    pack,
    profile: "walking",
    origin,
    destination,
    cache: [],
    runtime: nativeRuntime,
    now: new Date("2026-07-28T08:00:00.000Z"),
  });
  assert.equal(calls, 1);
  assert.equal(native.status, "ready");
  if (native.status === "ready") {
    assert.equal(native.source, "native");
    assert.equal(native.route.regionId, pack.regionId);
    assert.equal(native.route.version, pack.version);
    assert.equal(native.route.profile, "walking");
    assert.deepEqual(native.route.origin, origin);
    assert.deepEqual(native.route.destination, destination);
    assert.equal(native.route.trafficAware, false);
  }

  await assert.rejects(
    resolve({
      manifest,
      pack,
      profile: "cycling",
      origin,
      destination,
      cache: [],
      runtime: {
        async route(request) {
          return {
            ...request,
            destination: { latitude: -8.55, longitude: 115.31 },
            distanceMeters: Number.NaN,
            durationSeconds: -1,
            geometry: [origin],
            generatedAt: "not-a-timestamp",
            trafficAware: false,
          };
        },
      },
      now: new Date("2026-07-28T08:00:00.000Z"),
    }),
    /native|route|result|bounds|geometry|distance|duration/i,
  );
});

test("unsupported, unavailable and out-of-region requests block before native routing", async () => {
  const routing = await loadOfflineRouting();
  assert.equal(typeof routing.resolveOfflineRoute, "function");
  const resolve = routing.resolveOfflineRoute!;
  let calls = 0;
  const runtime: OfflineRoutingRuntime = {
    async route() {
      calls += 1;
      throw new Error("must not route");
    },
  };
  const base = {
    manifest,
    pack,
    origin,
    destination,
    cache: [],
    runtime,
    now: new Date("2026-07-28T08:00:00.000Z"),
  };

  assert.deepEqual(await resolve({ ...base, profile: "scooter" }), {
    status: "blocked",
    reason: "profile_unsupported",
  });
  assert.deepEqual(await resolve({
    ...base,
    pack: { ...pack, status: "stale" },
    profile: "driving",
  }), {
    status: "blocked",
    reason: "offline_pack_unavailable",
  });
  assert.deepEqual(await resolve({
    ...base,
    destination: { latitude: -8.55, longitude: 115.31 },
    profile: "driving",
  }), {
    status: "blocked",
    reason: "outside_downloaded_region",
  });
  assert.equal(calls, 0);
});
