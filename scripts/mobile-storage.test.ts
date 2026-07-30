import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  clearMobilePersonalData,
  clearPrivacyDeletionQuarantine,
  hydrateMobileStorage,
  MOBILE_PERSONAL_STORAGE_KEYS,
  MOBILE_STORAGE_KEYS,
  readPrivacyDeletionQuarantine,
  writeNavigationState,
  writeOfflinePackStates,
  writePendingSync,
  writeNavigationSession,
  writeEventsSnapshot,
  writeSavedRouteIds,
  writeSavedRouteState,
  writeSavedRouteSnapshots,
  writeSavedVenueState,
  writeTodayVenueState,
  writeTodayEventState,
  writeTrip,
  writePrivacyDeletionQuarantine,
  writeSavedVenueSnapshots,
  type PreferenceStore,
} from "../mobile/src/storage";
import { addTripStop, createEmptyTrip } from "../mobile/src/trip-planner";

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

const eventOccurrence = {
  id: "occurrence-1",
  eventId: "event-1",
  title: "Sunset session",
  venueSlug: "sample-cafe",
  area: "Sanur",
  startsAt: "2026-08-01T10:00:00.000Z",
  endsAt: "2026-08-01T12:00:00.000Z",
  lastVerifiedAt: "2026-07-31T10:00:00.000Z",
  expiresAt: "2026-08-01T12:30:00.000Z",
};

test("Offline Level 2 hydrates verified events, Today events and canonical Trip", async () => {
  const preferences = new MemoryPreferences();
  const options = { preferences, legacyStorage: null };
  await writeEventsSnapshot({
    updatedAt: "2026-07-31T10:00:00.000Z",
    events: [eventOccurrence],
  }, options);
  await writeTodayEventState([eventOccurrence.id], [eventOccurrence], options);
  const trip = addTripStop(createEmptyTrip(3, "2026-08-01"), 0, "event_occurrence", eventOccurrence.id);
  await writeTrip(trip, options);

  const hydrated = await hydrateMobileStorage(options);
  assert.equal(hydrated.eventsSnapshot?.events[0]?.id, eventOccurrence.id);
  assert.deepEqual(hydrated.todayEventIds, [eventOccurrence.id]);
  assert.equal(hydrated.trip?.days[0]?.stops[0]?.entityType, "event_occurrence");
});

test("Offline Level 3 pack state persists only validated bounded records", async () => {
  const preferences = new MemoryPreferences();
  const options = { preferences, legacyStorage: null };
  await writeOfflinePackStates([{
    regionId: "ubud",
    version: "2026-07",
    status: "ready",
    progress: 1,
    downloadedBytes: 1_000,
    totalBytes: 1_000,
    updatedAt: "2026-07-27T00:00:00.000Z",
    lastError: null,
  }, {
    regionId: "../unsafe",
    version: "1",
    status: "ready",
    progress: 1,
    downloadedBytes: 1,
    totalBytes: 1,
    updatedAt: "2026-07-27T00:00:00.000Z",
    lastError: null,
  }], options);
  const hydrated = await hydrateMobileStorage(options);
  assert.deepEqual(hydrated.offlinePacks.map((pack) => pack.regionId), ["ubud"]);
});

test("Integrated Navigation restores a bounded session without precise location", async () => {
  const preferences = new MemoryPreferences();
  const options = { preferences, legacyStorage: null };
  await writeNavigationSession({
    id: "12345678-1234-1234-1234-123456789abc",
    targetType: "place",
    targetId: "venue-1",
    targetName: "Sample Cafe",
    sourceSurface: "today",
    mode: "external_maps",
    state: "away",
    startedAt: "2026-07-27T04:00:00.000Z",
    updatedAt: "2026-07-27T04:01:00.000Z",
    returnedAt: null,
  }, options);
  const hydrated = await hydrateMobileStorage(options);
  assert.equal(hydrated.navigationSession?.state, "away");
  assert.doesNotMatch(
    preferences.values.get(MOBILE_STORAGE_KEYS.navigationSession) ?? "",
    /latitude|longitude|mapsUrl|https:/i,
  );
});

test("corrupt offline event and Trip state fail closed without erasing other state", async () => {
  const preferences = new MemoryPreferences();
  preferences.values.set(MOBILE_STORAGE_KEYS.eventsSnapshot, JSON.stringify({
    updatedAt: "not-a-date",
    events: [eventOccurrence],
  }));
  preferences.values.set(MOBILE_STORAGE_KEYS.trip, JSON.stringify({
    ...createEmptyTrip(3, "2026-08-01"),
    days: [],
  }));
  const hydrated = await hydrateMobileStorage({ preferences, legacyStorage: null });
  assert.equal(hydrated.eventsSnapshot, null);
  assert.equal(hydrated.trip, null);
});

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

test("Today snapshots and Discover cursor survive restart without precise location data", async () => {
  const legacyStorage = new MemoryStorage();
  const preferences = new MemoryPreferences();
  const options = { preferences, legacyStorage };
  await writeTodayVenueState([savedSnapshot.venue.id], [savedSnapshot], options);
  await writeNavigationState({
    surface: "places",
    selectedVenueId: null,
    selectedRouteId: null,
    scrollY: 240,
    discoveryIndex: 7,
  }, options);

  const hydrated = await hydrateMobileStorage(options);
  assert.deepEqual(hydrated.todayVenueIds, [savedSnapshot.venue.id]);
  assert.equal(hydrated.todayVenueSnapshots[0]?.venue.slug, "sample-cafe");
  assert.equal(hydrated.navigation.discoveryIndex, 7);
  assert.doesNotMatch(preferences.values.get(MOBILE_STORAGE_KEYS.navigation) ?? "", /latitude|longitude|coords/);
});

test("privacy deletion clears personal state without deleting public caches or offline maps", async () => {
  const preferences = new MemoryPreferences();
  const legacyStorage = new MemoryStorage();
  const options = { preferences, legacyStorage };

  for (const key of MOBILE_PERSONAL_STORAGE_KEYS) {
    preferences.values.set(key, `native:${key}`);
    legacyStorage.setItem(key, `legacy:${key}`);
    legacyStorage.setItem(`${key}.pending-write-v1`, `pending:${key}`);
  }
  preferences.values.set(MOBILE_STORAGE_KEYS.bootstrap, "public-bootstrap");
  preferences.values.set(MOBILE_STORAGE_KEYS.eventsSnapshot, "public-events");
  preferences.values.set(MOBILE_STORAGE_KEYS.offlinePacks, "offline-map-downloads");

  await clearMobilePersonalData(options);

  for (const key of MOBILE_PERSONAL_STORAGE_KEYS) {
    assert.equal(preferences.values.has(key), false, `${key} removed from Preferences`);
    assert.equal(legacyStorage.getItem(key), null, `${key} removed from legacy storage`);
    assert.equal(
      legacyStorage.getItem(`${key}.pending-write-v1`),
      null,
      `${key} pending fallback removed`,
    );
  }
  assert.equal(preferences.values.get(MOBILE_STORAGE_KEYS.bootstrap), "public-bootstrap");
  assert.equal(preferences.values.get(MOBILE_STORAGE_KEYS.eventsSnapshot), "public-events");
  assert.equal(preferences.values.get(MOBILE_STORAGE_KEYS.offlinePacks), "offline-map-downloads");
});

test("privacy cleanup still discards the durable sync queue when another key fails", async () => {
  const values = new Map<string, string>(
    MOBILE_PERSONAL_STORAGE_KEYS.map((key) => [key, `value:${key}`]),
  );
  const preferences: PreferenceStore = {
    async get({ key }) { return { value: values.get(key) ?? null }; },
    async set({ key, value }) { values.set(key, value); },
    async remove({ key }) {
      if (key === MOBILE_STORAGE_KEYS.savedVenueState) {
        throw new Error("simulated saved-state removal failure");
      }
      values.delete(key);
    },
  };

  await assert.rejects(
    clearMobilePersonalData({ preferences, legacyStorage: null }),
    /mobile_personal_data_clear_failed/,
  );
  assert.equal(
    values.has(MOBILE_STORAGE_KEYS.pendingSync),
    false,
    "cleanup must attempt and remove pending sync even when an unrelated key fails",
  );
  assert.equal(values.has(MOBILE_STORAGE_KEYS.savedVenueState), true);
});

test("a persisted deletion quarantine suppresses stale personal hydration across relaunch", async () => {
  const preferences = new MemoryPreferences();
  const legacyStorage = new MemoryStorage();
  const options = { preferences, legacyStorage };
  const trip = addTripStop(createEmptyTrip(3, "2026-08-01"), 0, "place", savedSnapshot.venue.id);

  await writeSavedVenueState([savedSnapshot.venue.id], [savedSnapshot], options);
  await writeTodayVenueState([savedSnapshot.venue.id], [savedSnapshot], options);
  await writeTrip(trip, options);
  await writePendingSync([{
    idempotencyKey: "pending-before-delete",
    entityType: "saved",
    entityId: savedSnapshot.venue.slug,
    operation: "save",
    payload: { saved: true },
    baseVersion: null,
    createdAt: "2026-07-30T10:00:00.000Z",
  }], options);
  await writeNavigationState({
    surface: "today",
    selectedVenueId: savedSnapshot.venue.id,
    selectedRouteId: null,
    scrollY: 200,
    discoveryIndex: 4,
  }, options);
  await writePrivacyDeletionQuarantine("pending_server", options);

  const relaunched = await hydrateMobileStorage(options);
  assert.equal(relaunched.privacyDeletionQuarantine, "pending_server");
  assert.deepEqual(relaunched.savedVenueIds, []);
  assert.deepEqual(relaunched.todayVenueIds, []);
  assert.equal(relaunched.trip, null);
  assert.deepEqual(relaunched.pendingSync, []);
  assert.deepEqual(relaunched.navigation, {
    surface: "places",
    selectedVenueId: null,
    selectedRouteId: null,
    scrollY: 0,
    discoveryIndex: 0,
  });
  assert.equal(
    preferences.values.has(MOBILE_STORAGE_KEYS.savedVenueState),
    true,
    "quarantine hides stale state without treating an interrupted cleanup as successful",
  );

  await clearPrivacyDeletionQuarantine(options);
  assert.equal(await readPrivacyDeletionQuarantine(options), null);
  const rolledBack = await hydrateMobileStorage(options);
  assert.deepEqual(rolledBack.savedVenueIds, [savedSnapshot.venue.id]);
  assert.equal(rolledBack.pendingSync.length, 1);
});

test("partial local cleanup retains the confirmed marker and hides the stale key on next launch", async () => {
  const preferences = new MemoryPreferences();
  const legacyStorage = new MemoryStorage();
  const baseOptions = { preferences, legacyStorage };
  await writeSavedVenueState([savedSnapshot.venue.id], [savedSnapshot], baseOptions);
  await writePendingSync([{
    idempotencyKey: "pending-before-partial-cleanup",
    entityType: "saved",
    entityId: savedSnapshot.venue.slug,
    operation: "save",
    payload: { saved: true },
    baseVersion: null,
    createdAt: "2026-07-30T10:00:00.000Z",
  }], baseOptions);
  await writePrivacyDeletionQuarantine("server_confirmed", baseOptions);

  const failingPreferences: PreferenceStore = {
    get: (input) => preferences.get(input),
    set: (input) => preferences.set(input),
    async remove({ key }) {
      if (key === MOBILE_STORAGE_KEYS.savedVenueState) {
        throw new Error("simulated partial cleanup");
      }
      await preferences.remove({ key });
    },
  };
  await assert.rejects(
    clearMobilePersonalData({ preferences: failingPreferences, legacyStorage }),
    /mobile_personal_data_clear_failed/,
  );
  assert.equal(preferences.values.has(MOBILE_STORAGE_KEYS.savedVenueState), true);

  const relaunched = await hydrateMobileStorage({
    preferences: failingPreferences,
    legacyStorage,
  });
  assert.equal(relaunched.privacyDeletionQuarantine, "server_confirmed");
  assert.deepEqual(relaunched.savedVenueIds, []);
  assert.deepEqual(relaunched.pendingSync, []);
  assert.equal(
    await readPrivacyDeletionQuarantine({ preferences: failingPreferences, legacyStorage }),
    "server_confirmed",
  );
});

test("the restart quarantine remains recoverable during a native Preferences outage", async () => {
  const legacyStorage = new MemoryStorage();
  const unavailablePreferences: PreferenceStore = {
    async get() { throw new Error("native read unavailable"); },
    async set() { throw new Error("native write unavailable"); },
    async remove() { throw new Error("native remove unavailable"); },
  };
  const options = { preferences: unavailablePreferences, legacyStorage };
  legacyStorage.setItem(MOBILE_STORAGE_KEYS.bootstrap, "{}");

  await writePrivacyDeletionQuarantine("pending_server", options);
  assert.equal(
    legacyStorage.getItem(MOBILE_STORAGE_KEYS.privacyDeletionQuarantine),
    "pending_server",
  );
  assert.equal(await readPrivacyDeletionQuarantine(options), "pending_server");
  const relaunched = await hydrateMobileStorage(options);
  assert.equal(relaunched.privacyDeletionQuarantine, "pending_server");
  assert.deepEqual(relaunched.pendingSync, []);
});
