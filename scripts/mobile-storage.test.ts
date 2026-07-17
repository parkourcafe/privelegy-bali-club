import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  hydrateMobileStorage,
  MOBILE_STORAGE_KEYS,
  writeNavigationState,
  writeSavedRouteIds,
  writeSavedRouteState,
  writeSavedRouteSnapshots,
  writeSavedVenueState,
  writeSavedVenueSnapshots,
  type PreferenceStore,
} from "../mobile/src/storage";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
  dump() { return [...this.values.values()].join("\n"); }
}

class MemoryPreferences implements PreferenceStore {
  readonly values = new Map<string, string>();

  async get({ key }: { key: string }) { return { value: this.values.get(key) ?? null }; }
  async remove({ key }: { key: string }) { this.values.delete(key); }
  async set({ key, value }: { key: string; value: string }) { this.values.set(key, value); }
}

const savedSnapshot = {
  updatedAt: "2026-07-14T08:00:00.000Z",
  detailUpdatedAt: "2026-07-14T08:05:00.000Z",
  venue: {
    id: "venue-1",
    slug: "sample-cafe",
    name: "Sample Cafe",
    category: "cafe",
    district: "ubud",
    subarea: null,
    photoUrl: null,
    bestFor: "A quiet coffee",
    isSponsored: false,
  },
  detail: {
    id: "venue-1",
    slug: "sample-cafe",
    name: "Sample Cafe",
    category: "cafe",
    district: "ubud",
    subarea: null,
    photoUrl: null,
    bestFor: "A quiet coffee",
    isSponsored: false,
    fullAddress: "1 Sample Road, Ubud",
    mapsUrl: "https://www.google.com/maps/place/Sample+Cafe",
    officialUrl: null,
    instagramUrl: null,
    priceLabel: null,
    whatToOrder: null,
    whyItsHere: null,
    notFor: null,
    practicalTags: [],
    vibes: [],
  },
};

const savedRouteSnapshot = {
  updatedAt: "2026-07-14T08:10:00.000Z",
  route: {
    id: "quiet-ubud",
    slug: "quiet-ubud",
    title: "A quiet Ubud morning",
    subtitle: "Two timestamped public stops",
    stopCount: 2,
    stops: [
      { position: 1, venue: savedSnapshot.venue },
      {
        position: 2,
        venue: {
          ...savedSnapshot.venue,
          id: "venue-2",
          slug: "sample-studio",
          name: "Sample Studio",
          category: "yoga",
          bestFor: "A quiet class",
        },
      },
    ],
  },
};

test("Preferences hydration migrates legacy WebView state without losing saved detail", async () => {
  const legacyStorage = new MemoryStorage();
  const preferences = new MemoryPreferences();
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.savedVenueSnapshots, JSON.stringify([savedSnapshot]));
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.savedRoutes, JSON.stringify(["quiet-ubud"]));
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.legacyNavigation, JSON.stringify({
    surface: "saved",
    selectedVenueId: "venue-1",
    scrollY: 128,
  }));

  const hydrated = await hydrateMobileStorage({ preferences, legacyStorage });
  assert.equal(hydrated.savedVenueSnapshots[0]?.detail?.mapsUrl, savedSnapshot.detail.mapsUrl);
  assert.deepEqual(hydrated.savedRouteIds, ["quiet-ubud"]);
  assert.deepEqual(hydrated.savedRouteSnapshots, []);
  assert.deepEqual(hydrated.navigation, {
    surface: "saved",
    selectedVenueId: "venue-1",
    selectedRouteId: null,
    scrollY: 128,
  });
  assert.equal(legacyStorage.getItem(MOBILE_STORAGE_KEYS.savedVenueSnapshots), null);
  assert.equal(legacyStorage.getItem(MOBILE_STORAGE_KEYS.savedRoutes), null);
  assert.equal(legacyStorage.getItem(MOBILE_STORAGE_KEYS.legacyNavigation), null);
  assert.ok(preferences.values.has(MOBILE_STORAGE_KEYS.savedVenueSnapshots));
  assert.ok(preferences.values.has(MOBILE_STORAGE_KEYS.savedRoutes));
  assert.ok(preferences.values.has(MOBILE_STORAGE_KEYS.navigation));
  assert.doesNotMatch([...preferences.values.values()].join("\n"), /email|guest|token/i);
});

test("saved route details rehydrate with validated ordered stops and ignore corrupt or orphan snapshots", async () => {
  const legacyStorage = new MemoryStorage();
  const preferences = new MemoryPreferences();
  preferences.values.set(
    MOBILE_STORAGE_KEYS.savedRoutes,
    JSON.stringify(["quiet-ubud", "invalid-route", "duplicate-route"]),
  );
  preferences.values.set(MOBILE_STORAGE_KEYS.savedRouteSnapshots, JSON.stringify([
    savedRouteSnapshot,
    {
      ...savedRouteSnapshot,
      route: {
        ...savedRouteSnapshot.route,
        id: "invalid-route",
        slug: "invalid-route",
        stops: savedRouteSnapshot.route.stops.map((stop) => ({ ...stop, position: stop.position + 1 })),
      },
    },
    {
      ...savedRouteSnapshot,
      route: {
        ...savedRouteSnapshot.route,
        id: "duplicate-route",
        slug: "duplicate-route",
        stops: [
          savedRouteSnapshot.route.stops[0],
          { ...savedRouteSnapshot.route.stops[0], position: 2 },
        ],
      },
    },
    {
      ...savedRouteSnapshot,
      route: {
        ...savedRouteSnapshot.route,
        id: "orphan-route",
        slug: "orphan-route",
      },
    },
  ]));

  const hydrated = await hydrateMobileStorage({ preferences, legacyStorage });
  assert.deepEqual(hydrated.savedRouteIds, ["quiet-ubud", "invalid-route", "duplicate-route"]);
  assert.equal(hydrated.savedRouteSnapshots.length, 1);
  assert.equal(hydrated.savedRouteSnapshots[0]?.updatedAt, savedRouteSnapshot.updatedAt);
  assert.deepEqual(
    hydrated.savedRouteSnapshots[0]?.route.stops.map((stop) => [stop.position, stop.venue.slug]),
    [[1, "sample-cafe"], [2, "sample-studio"]],
  );
});

test("saved route writes are Preferences-backed, normalized, bounded, and preserve the ID key", async () => {
  const legacyStorage = new MemoryStorage();
  const preferences = new MemoryPreferences();
  const options = { preferences, legacyStorage };
  const snapshots = Array.from({ length: 101 }, (_, index) => ({
    ...savedRouteSnapshot,
    route: {
      ...savedRouteSnapshot.route,
      id: `route-${index + 1}`,
      slug: `route-${index + 1}`,
      extra: "must-not-persist",
    },
  }));
  const ids = snapshots.map((snapshot) => snapshot.route.id);

  await writeSavedRouteIds(ids, options);
  await writeSavedRouteSnapshots(snapshots, options);

  const storedRouteIds = preferences.values.get(MOBILE_STORAGE_KEYS.savedRoutes);
  const storedSnapshots = preferences.values.get(MOBILE_STORAGE_KEYS.savedRouteSnapshots);
  assert.equal(JSON.parse(storedRouteIds ?? "[]").length, 101);
  assert.equal(JSON.parse(storedSnapshots ?? "[]").length, 100);
  assert.doesNotMatch(storedSnapshots ?? "", /must-not-persist/);
  assert.doesNotMatch(storedSnapshots ?? "", /"id":"route-1"/);
  assert.match(storedSnapshots ?? "", /"id":"route-101"/);
  assert.equal(legacyStorage.dump(), "");

  const hydrated = await hydrateMobileStorage(options);
  assert.equal(hydrated.savedRouteIds.length, 101);
  assert.equal(hydrated.savedRouteSnapshots.length, 100);
  assert.equal(hydrated.savedRouteSnapshots[0]?.route.stops[1]?.venue.slug, "sample-studio");
});

test("Preferences writes preserve route navigation and bounded public snapshots across restart", async () => {
  const legacyStorage = new MemoryStorage();
  const preferences = new MemoryPreferences();
  const options = { preferences, legacyStorage };

  await writeSavedVenueSnapshots([savedSnapshot], options);
  await writeNavigationState({
    surface: "routes",
    selectedVenueId: null,
    selectedRouteId: "quiet-ubud",
    scrollY: 0,
  }, options);

  const hydrated = await hydrateMobileStorage(options);
  assert.equal(hydrated.savedVenueSnapshots[0]?.venue.name, "Sample Cafe");
  assert.deepEqual(hydrated.navigation, {
    surface: "routes",
    selectedVenueId: null,
    selectedRouteId: "quiet-ubud",
    scrollY: 0,
  });
  assert.equal(legacyStorage.dump(), "");
});

test("a Preferences outage retains legacy navigation and rehydrates the newer fallback write", async () => {
  const legacyStorage = new MemoryStorage();
  const unavailablePreferences: PreferenceStore = {
    async get() { throw new Error("Preferences unavailable"); },
    async set() { throw new Error("Preferences unavailable"); },
    async remove() { throw new Error("Preferences unavailable"); },
  };
  const options = { preferences: unavailablePreferences, legacyStorage };
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.bootstrap, "null");
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.savedVenueState, JSON.stringify({ ids: [], snapshots: [] }));
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.savedRouteState, JSON.stringify({ ids: [], snapshots: [] }));
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.savedVenues, "[]");
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.savedRoutes, "[]");
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.savedVenueSnapshots, "[]");
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.savedRouteSnapshots, "[]");
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.legacyNavigation, JSON.stringify({
    surface: "saved",
    selectedVenueId: "venue-1",
    scrollY: 64,
  }));

  const migrated = await hydrateMobileStorage(options);
  assert.equal(migrated.navigation.selectedVenueId, "venue-1");
  assert.notEqual(legacyStorage.getItem(MOBILE_STORAGE_KEYS.legacyNavigation), null);

  await writeNavigationState({
    surface: "routes",
    selectedVenueId: null,
    selectedRouteId: "quiet-ubud",
    scrollY: 32,
  }, options);

  const rehydrated = await hydrateMobileStorage(options);
  assert.deepEqual(rehydrated.navigation, {
    surface: "routes",
    selectedVenueId: null,
    selectedRouteId: "quiet-ubud",
    scrollY: 32,
  });
  assert.notEqual(legacyStorage.getItem(MOBILE_STORAGE_KEYS.navigation), null);
  assert.notEqual(legacyStorage.getItem(MOBILE_STORAGE_KEYS.legacyNavigation), null);
});

test("a pending fallback write wins over stale Preferences after native storage recovers", async () => {
  const legacyStorage = new MemoryStorage();
  const stalePreferences = new MemoryPreferences();
  stalePreferences.values.set(MOBILE_STORAGE_KEYS.savedRoutes, JSON.stringify(["old-route"]));
  const unavailablePreferences: PreferenceStore = {
    async get({ key }) { return stalePreferences.get({ key }); },
    async set() { throw new Error("temporary native write outage"); },
    async remove() { throw new Error("temporary native write outage"); },
  };

  await writeSavedRouteIds(["new-route"], {
    preferences: unavailablePreferences,
    legacyStorage,
  });

  const recovered = await hydrateMobileStorage({
    preferences: stalePreferences,
    legacyStorage,
  });
  assert.deepEqual(recovered.savedRouteIds, ["new-route"]);
  assert.equal(
    stalePreferences.values.get(MOBILE_STORAGE_KEYS.savedRoutes),
    JSON.stringify(["new-route"]),
  );
  assert.equal(legacyStorage.dump(), "");
});

test("same-key native writes are serialized so an older rejection cannot restore stale state", async () => {
  const legacyStorage = new MemoryStorage();
  const durable = new Map<string, string>();
  let releaseFirst!: () => void;
  const firstWrite = new Promise<void>((resolve) => { releaseFirst = resolve; });
  let calls = 0;
  const preferences: PreferenceStore = {
    async get({ key }) { return { value: durable.get(key) ?? null }; },
    async remove({ key }) { durable.delete(key); },
    async set({ key, value }) {
      calls += 1;
      if (calls === 1) {
        await firstWrite;
        throw new Error("older native write failed late");
      }
      durable.set(key, value);
    },
  };
  const options = { preferences, legacyStorage };

  const older = writeSavedRouteIds(["old-route"], options);
  const newer = writeSavedRouteIds([], options);
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.equal(calls, 1, "newer write waits behind the older write for this key");
  releaseFirst();
  await Promise.all([older, newer]);

  assert.equal(durable.get(MOBILE_STORAGE_KEYS.savedRoutes), "[]");
  assert.equal(legacyStorage.dump(), "");
  const hydrated = await hydrateMobileStorage(options);
  assert.deepEqual(hydrated.savedRouteIds, []);
});

test("saved IDs and snapshots commit as one durable state record", async () => {
  const legacyStorage = new MemoryStorage();
  const preferences = new MemoryPreferences();
  const options = { preferences, legacyStorage };

  await writeSavedVenueState([savedSnapshot.venue.id], [savedSnapshot], options);
  await writeSavedRouteState([savedRouteSnapshot.route.id], [savedRouteSnapshot], options);

  assert.ok(preferences.values.has(MOBILE_STORAGE_KEYS.savedVenueState));
  assert.ok(preferences.values.has(MOBILE_STORAGE_KEYS.savedRouteState));
  const hydrated = await hydrateMobileStorage(options);
  assert.deepEqual(hydrated.savedVenueIds, [savedSnapshot.venue.id]);
  assert.equal(hydrated.savedVenueSnapshots[0]?.detail?.mapsUrl, savedSnapshot.detail.mapsUrl);
  assert.deepEqual(hydrated.savedRouteIds, [savedRouteSnapshot.route.id]);
  assert.equal(hydrated.savedRouteSnapshots[0]?.route.stops.length, 2);
});

test("a save rejects when neither Preferences nor the fallback can persist it", async () => {
  const unavailablePreferences: PreferenceStore = {
    async get() { throw new Error("native unavailable"); },
    async set() { throw new Error("native unavailable"); },
    async remove() { throw new Error("native unavailable"); },
  };
  const unavailableStorage = new MemoryStorage();
  unavailableStorage.setItem = () => { throw new Error("quota exceeded"); };

  await assert.rejects(
    writeSavedRouteState([savedRouteSnapshot.route.id], [savedRouteSnapshot], {
      preferences: unavailablePreferences,
      legacyStorage: unavailableStorage,
    }),
    /mobile_storage_unavailable/,
  );
});

test("an unreadable authoritative store is never hydrated as an empty saved state", async () => {
  const unavailablePreferences: PreferenceStore = {
    async get() { throw new Error("native read outage"); },
    async set() { throw new Error("native outage"); },
    async remove() { throw new Error("native outage"); },
  };

  await assert.rejects(
    hydrateMobileStorage({
      preferences: unavailablePreferences,
      legacyStorage: new MemoryStorage(),
    }),
    /mobile_storage_read_unavailable/,
  );
});

test("an unreadable legacy migration source is not mistaken for confirmed absence", async () => {
  const preferences = new MemoryPreferences();
  const unreadableLegacy = new MemoryStorage();
  unreadableLegacy.getItem = () => { throw new Error("WebView storage read outage"); };

  await assert.rejects(
    hydrateMobileStorage({ preferences, legacyStorage: unreadableLegacy }),
    /mobile_storage_read_unavailable/,
  );
});

test("mobile app uses saved route details offline and exposes route-stop compact summaries instead of dead buttons", () => {
  const source = readFileSync(new URL("../mobile/src/App.tsx", import.meta.url), "utf8");
  assert.match(source, /setSavedRouteSnapshots\(state\.savedRouteSnapshots\)/);
  assert.match(source, /if \(savedRouteSet\.has\(requestRouteId\)\)/);
  assert.match(source, /enqueueRouteState\(\(current\) =>/);
  assert.match(source, /enqueueVenueState\(\(current\) =>/);
  assert.match(source, /venuePersistenceQueue\.current/);
  assert.match(source, /routePersistenceQueue\.current/);
  assert.match(source, /Nothing was overwritten/);
  assert.match(source, /setStorageReadFailed\(true\)/);
  assert.match(source, /setStorageReady\(true\)/);
  assert.doesNotMatch(source, /void writeSaved(?:Route|Venue)(?:Ids|Snapshots)/);
  assert.match(source, /This device could not persist that change/);
  assert.match(source, /for \(const stop of routeSnapshot\.route\.stops\)/);
  assert.match(source, /selectedSavedRouteSnapshot/);
  assert.match(source, /Saved offline route/);
  assert.match(source, /travel time, traffic and turn-by-turn navigation are not claimed/);
});
