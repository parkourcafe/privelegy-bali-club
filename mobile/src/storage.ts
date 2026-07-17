import { Preferences } from "@capacitor/preferences";
import type {
  MobileRouteDetail,
  MobileVenue,
  MobileVenueCompact,
} from "../../lib/mobile-api/contracts";
import {
  parseMobileBootstrap,
  parseMobileRouteDetail,
  parseMobileVenue,
  parseMobileVenueCompact,
  type MobileBootstrapPayload,
} from "./contracts";

export const MOBILE_STORAGE_KEYS = {
  bootstrap: "otherbali.mobile.public-bootstrap.v1",
  savedVenues: "otherbali.mobile.saved-venue-ids.v1",
  savedRoutes: "otherbali.mobile.saved-route-ids.v1",
  savedVenueSnapshots: "otherbali.mobile.saved-venue-summaries.v1",
  savedRouteSnapshots: "otherbali.mobile.saved-route-details.v1",
  savedVenueState: "otherbali.mobile.saved-venue-state.v2",
  savedRouteState: "otherbali.mobile.saved-route-state.v2",
  navigation: "otherbali.mobile.navigation-state.v2",
  legacyNavigation: "otherbali.mobile.navigation-state.v1",
} as const;

export const MAX_SAVED_ROUTE_SNAPSHOTS = 100;
const MAX_SAVED_ROUTE_SNAPSHOT_CANDIDATES = 500;

export type MobileSurface = "places" | "routes" | "saved";

export interface MobileNavigationState {
  surface: MobileSurface;
  selectedVenueId: string | null;
  selectedRouteId: string | null;
  scrollY: number;
}

export interface SavedVenueSnapshot {
  venue: MobileVenueCompact;
  updatedAt: string;
  detail: MobileVenue | null;
  detailUpdatedAt: string | null;
}

export interface SavedRouteSnapshot {
  route: MobileRouteDetail;
  updatedAt: string;
}

export interface MobileStorageState {
  bootstrap: MobileBootstrapPayload | null;
  savedVenueIds: string[];
  savedRouteIds: string[];
  savedVenueSnapshots: SavedVenueSnapshot[];
  savedRouteSnapshots: SavedRouteSnapshot[];
  navigation: MobileNavigationState;
}

export interface PreferenceStore {
  get(options: { key: string }): Promise<{ value: string | null }>;
  set(options: { key: string; value: string }): Promise<void>;
  remove(options: { key: string }): Promise<void>;
}

export interface MobileStorageOptions {
  preferences?: PreferenceStore;
  legacyStorage?: Storage | null;
}

export const DEFAULT_NAVIGATION_STATE: MobileNavigationState = {
  surface: "places",
  selectedVenueId: null,
  selectedRouteId: null,
  scrollY: 0,
};

function browserLegacyStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function dependencies(options: MobileStorageOptions) {
  return {
    preferences: options.preferences ?? Preferences,
    legacyStorage: options.legacyStorage === undefined
      ? browserLegacyStorage()
      : options.legacyStorage,
  };
}

function pendingWriteKey(key: string): string {
  return `${key}.pending-write-v1`;
}

// App state persistence is intentionally fire-and-forget at several lifecycle
// boundaries. Serialize writes for each native Preferences key so an older,
// slower completion can never overwrite (or recreate the fallback for) a
// newer save/remove/navigation state.
const preferenceWriteQueues = new WeakMap<PreferenceStore, Map<string, Promise<void>>>();

function enqueuePreferenceWrite(
  preferences: PreferenceStore,
  key: string,
  write: () => Promise<void>,
): Promise<void> {
  let queues = preferenceWriteQueues.get(preferences);
  if (!queues) {
    queues = new Map();
    preferenceWriteQueues.set(preferences, queues);
  }
  const previous = queues.get(key) ?? Promise.resolve();
  const current = previous.catch(() => {}).then(write);
  queues.set(key, current);
  return current.finally(() => {
    if (queues?.get(key) === current) queues.delete(key);
  });
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
}

function parseBootstrap(raw: string | null): MobileBootstrapPayload | null {
  if (!raw) return null;
  try {
    return parseMobileBootstrap(JSON.parse(raw));
  } catch {
    return null;
  }
}

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? [...new Set(value.slice(0, 500).filter((entry): entry is string => (
          typeof entry === "string" && entry.length > 0 && entry.length <= 160
        )))]
      : [];
  } catch {
    return [];
  }
}

function parseSavedVenueSnapshots(raw: string | null): SavedVenueSnapshot[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const unique = new Map<string, SavedVenueSnapshot>();
    for (const entry of value.slice(0, 500)) {
      try {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
        const candidate = entry as Record<string, unknown>;
        const venue = parseMobileVenueCompact(candidate.venue);
        if (!isIsoTimestamp(candidate.updatedAt)) continue;
        let detail: MobileVenue | null = null;
        let detailUpdatedAt: string | null = null;
        if (candidate.detail != null) {
          try {
            const parsedDetail = parseMobileVenue(candidate.detail);
            const parsedTimestamp = candidate.detailUpdatedAt;
            if (
              parsedDetail.id === venue.id
              && parsedDetail.slug === venue.slug
              && isIsoTimestamp(parsedTimestamp)
            ) {
              detail = parsedDetail;
              detailUpdatedAt = parsedTimestamp;
            }
          } catch {
            // Keep the compact saved summary when a full-detail snapshot is corrupt.
          }
        }
        unique.set(venue.id, {
          venue,
          updatedAt: candidate.updatedAt,
          detail,
          detailUpdatedAt,
        });
      } catch {
        // Ignore one corrupt public snapshot without discarding the others.
      }
    }
    return [...unique.values()];
  } catch {
    return [];
  }
}

function parseSavedRouteSnapshots(raw: string | null): SavedRouteSnapshot[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const unique = new Map<string, SavedRouteSnapshot>();
    for (const entry of value.slice(0, MAX_SAVED_ROUTE_SNAPSHOT_CANDIDATES)) {
      try {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
        const candidate = entry as Record<string, unknown>;
        if (!isIsoTimestamp(candidate.updatedAt)) continue;
        const parsed = parseMobileRouteDetail({
          schemaVersion: 1,
          updatedAt: candidate.updatedAt,
          data: { route: candidate.route },
        });
        const stopVenueIds = new Set(parsed.data.route.stops.map((stop) => stop.venue.id));
        const stopVenueSlugs = new Set(parsed.data.route.stops.map((stop) => stop.venue.slug));
        if (
          stopVenueIds.size !== parsed.data.route.stops.length
          || stopVenueSlugs.size !== parsed.data.route.stops.length
        ) {
          continue;
        }
        unique.set(parsed.data.route.id, {
          route: parsed.data.route,
          updatedAt: parsed.updatedAt,
        });
      } catch {
        // Ignore one corrupt route detail without discarding other saved routes.
      }
    }
    return [...unique.values()]
      .sort((left, right) => left.updatedAt.localeCompare(right.updatedAt))
      .slice(-MAX_SAVED_ROUTE_SNAPSHOTS);
  } catch {
    return [];
  }
}

function parseSavedVenueState(raw: string | null): {
  ids: string[];
  snapshots: SavedVenueSnapshot[];
} | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const candidate = value as Record<string, unknown>;
    const ids = parseIds(JSON.stringify(candidate.ids));
    const snapshots = parseSavedVenueSnapshots(JSON.stringify(candidate.snapshots));
    const idSet = new Set(ids);
    return {
      ids,
      snapshots: snapshots.filter((snapshot) => idSet.has(snapshot.venue.id)),
    };
  } catch {
    return null;
  }
}

function parseSavedRouteState(raw: string | null): {
  ids: string[];
  snapshots: SavedRouteSnapshot[];
} | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const candidate = value as Record<string, unknown>;
    const ids = parseIds(JSON.stringify(candidate.ids));
    const idSet = new Set(ids);
    return {
      ids,
      snapshots: parseSavedRouteSnapshots(JSON.stringify(candidate.snapshots))
        .filter((snapshot) => idSet.has(snapshot.route.id)),
    };
  } catch {
    return null;
  }
}

function parseNavigation(raw: string | null): MobileNavigationState {
  if (!raw) return DEFAULT_NAVIGATION_STATE;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return DEFAULT_NAVIGATION_STATE;
    const candidate = value as Record<string, unknown>;
    const surface = candidate.surface;
    const selectedVenueId = candidate.selectedVenueId ?? null;
    const selectedRouteId = candidate.selectedRouteId ?? null;
    const scrollY = candidate.scrollY;
    const boundedId = (id: unknown) => id === null
      || (typeof id === "string" && id.length > 0 && id.length <= 160);
    if (
      !["places", "routes", "saved"].includes(String(surface))
      || !boundedId(selectedVenueId)
      || !boundedId(selectedRouteId)
      || (selectedVenueId !== null && selectedRouteId !== null)
      || typeof scrollY !== "number"
      || !Number.isFinite(scrollY)
      || scrollY < 0
      || scrollY > 10_000_000
    ) {
      return DEFAULT_NAVIGATION_STATE;
    }
    return {
      surface: surface as MobileSurface,
      selectedVenueId: selectedVenueId as string | null,
      selectedRouteId: selectedRouteId as string | null,
      scrollY,
    };
  } catch {
    return DEFAULT_NAVIGATION_STATE;
  }
}

async function readRawWithMigration(
  key: string,
  preferences: PreferenceStore,
  legacyStorage: Storage | null,
  legacyKey = key,
): Promise<string | null> {
  const fallbackKeys = legacyKey === key ? [key] : [key, legacyKey];
  const pendingKey = pendingWriteKey(key);

  // A failed native write is recorded as a small local write-ahead entry. It
  // must win over an older Preferences value on recovery or the last save /
  // navigation action would be silently rolled back.
  let pendingValue: string | null = null;
  try {
    pendingValue = legacyStorage?.getItem(pendingKey) ?? null;
  } catch {
    // Continue with the native value when WebView storage is unavailable.
  }
  if (pendingValue !== null) {
    try {
      await preferences.set({ key, value: pendingValue });
      for (const fallbackKey of [...fallbackKeys, pendingKey]) {
        try {
          legacyStorage?.removeItem(fallbackKey);
        } catch {
          // Preferences now contains the recovered authoritative copy.
        }
      }
    } catch {
      // Keep and return the pending write until native storage recovers.
    }
    return pendingValue;
  }

  try {
    const { value } = await preferences.get({ key });
    if (value !== null) {
      for (const fallbackKey of [...fallbackKeys, pendingKey]) {
        try {
          legacyStorage?.removeItem(fallbackKey);
        } catch {
          // The authoritative Preferences value is already durable.
        }
      }
      return value;
    }
  } catch {
    // A complete pending/legacy value may still keep the shell usable, but a
    // failed authoritative read must never be treated as a confirmed empty
    // saved state. Track the failure and fail closed if no fallback exists.
    let legacyValue: string | null = null;
    for (const fallbackKey of fallbackKeys) {
      try {
        legacyValue = legacyStorage?.getItem(fallbackKey) ?? null;
      } catch {
        throw new Error("mobile_storage_read_unavailable");
      }
      if (legacyValue !== null) break;
    }
    if (legacyValue === null) throw new Error("mobile_storage_read_unavailable");
    try {
      await preferences.set({ key, value: legacyValue });
      for (const fallbackKey of [...fallbackKeys, pendingKey]) {
        try {
          legacyStorage?.removeItem(fallbackKey);
        } catch {
          // Preferences now contains the recovered authoritative copy.
        }
      }
    } catch {
      // Keep the complete legacy value until the native store recovers.
    }
    return legacyValue;
  }

  let legacyValue: string | null = null;
  for (const fallbackKey of fallbackKeys) {
    try {
      legacyValue = legacyStorage?.getItem(fallbackKey) ?? null;
    } catch {
      // A successful empty Preferences read does not prove that an older
      // WebView-only save is absent during an upgrade. Do not let an
      // unreadable migration source collapse into a destructive empty state.
      throw new Error("mobile_storage_read_unavailable");
    }
    if (legacyValue !== null) break;
  }
  if (legacyValue === null) return null;

  try {
    await preferences.set({ key, value: legacyValue });
    for (const fallbackKey of [...fallbackKeys, pendingKey]) {
      try {
        legacyStorage?.removeItem(fallbackKey);
      } catch {
        // Preferences now contains the authoritative copy.
      }
    }
  } catch {
    // Keep the legacy value until a future successful migration.
  }
  return legacyValue;
}

async function writeRaw(
  key: string,
  value: string,
  options: MobileStorageOptions,
): Promise<void> {
  const { preferences, legacyStorage } = dependencies(options);
  const pendingKey = pendingWriteKey(key);
  return enqueuePreferenceWrite(preferences, key, async () => {
    try {
      await preferences.set({ key, value });
      try {
        legacyStorage?.removeItem(key);
        legacyStorage?.removeItem(pendingKey);
      } catch {
        // Preferences is already authoritative.
      }
    } catch {
      if (!legacyStorage) throw new Error("mobile_storage_unavailable");
      try {
        // The pending entry alone is a complete durable copy. The compatibility
        // key is best-effort after that write succeeds.
        legacyStorage.setItem(pendingKey, value);
      } catch {
        throw new Error("mobile_storage_unavailable");
      }
      try {
        legacyStorage.setItem(key, value);
      } catch {
        // Hydration still recovers the complete pending entry.
      }
    }
  });
}

export async function hydrateMobileStorage(
  options: MobileStorageOptions = {},
): Promise<MobileStorageState> {
  const { preferences, legacyStorage } = dependencies(options);
  const [
    bootstrapRaw,
    savedVenueStateRaw,
    savedRouteStateRaw,
    savedVenueIdsRaw,
    savedRouteIdsRaw,
    snapshotsRaw,
    routeSnapshotsRaw,
    navigationRaw,
  ] = await Promise.all([
    readRawWithMigration(MOBILE_STORAGE_KEYS.bootstrap, preferences, legacyStorage),
    readRawWithMigration(MOBILE_STORAGE_KEYS.savedVenueState, preferences, legacyStorage),
    readRawWithMigration(MOBILE_STORAGE_KEYS.savedRouteState, preferences, legacyStorage),
    readRawWithMigration(MOBILE_STORAGE_KEYS.savedVenues, preferences, legacyStorage),
    readRawWithMigration(MOBILE_STORAGE_KEYS.savedRoutes, preferences, legacyStorage),
    readRawWithMigration(MOBILE_STORAGE_KEYS.savedVenueSnapshots, preferences, legacyStorage),
    readRawWithMigration(MOBILE_STORAGE_KEYS.savedRouteSnapshots, preferences, legacyStorage),
    readRawWithMigration(
      MOBILE_STORAGE_KEYS.navigation,
      preferences,
      legacyStorage,
      MOBILE_STORAGE_KEYS.legacyNavigation,
    ),
  ]);
  const savedVenueState = parseSavedVenueState(savedVenueStateRaw);
  const savedRouteState = parseSavedRouteState(savedRouteStateRaw);
  const savedVenueIds = savedVenueState?.ids ?? parseIds(savedVenueIdsRaw);
  const savedRouteIds = savedRouteState?.ids ?? parseIds(savedRouteIdsRaw);
  const savedRouteIdSet = new Set(savedRouteIds);
  return {
    bootstrap: parseBootstrap(bootstrapRaw),
    savedVenueIds,
    savedRouteIds,
    savedVenueSnapshots: savedVenueState?.snapshots ?? parseSavedVenueSnapshots(snapshotsRaw),
    savedRouteSnapshots: savedRouteState?.snapshots
      ?? parseSavedRouteSnapshots(routeSnapshotsRaw)
        .filter((snapshot) => savedRouteIdSet.has(snapshot.route.id)),
    navigation: parseNavigation(navigationRaw),
  };
}

export function writeCachedBootstrap(
  payload: MobileBootstrapPayload,
  options: MobileStorageOptions = {},
): Promise<void> {
  return writeRaw(MOBILE_STORAGE_KEYS.bootstrap, JSON.stringify(payload), options);
}

function boundedIds(ids: string[]): string[] {
  return [...new Set(ids.filter((id) => id.length > 0 && id.length <= 160))].slice(0, 500);
}

export function writeSavedVenueIds(
  ids: string[],
  options: MobileStorageOptions = {},
): Promise<void> {
  return writeRaw(MOBILE_STORAGE_KEYS.savedVenues, JSON.stringify(boundedIds(ids)), options);
}

export function writeSavedRouteIds(
  ids: string[],
  options: MobileStorageOptions = {},
): Promise<void> {
  return writeRaw(MOBILE_STORAGE_KEYS.savedRoutes, JSON.stringify(boundedIds(ids)), options);
}

export function writeSavedVenueSnapshots(
  snapshots: SavedVenueSnapshot[],
  options: MobileStorageOptions = {},
): Promise<void> {
  const unique = new Map(snapshots.map((snapshot) => [snapshot.venue.id, snapshot]));
  return writeRaw(
    MOBILE_STORAGE_KEYS.savedVenueSnapshots,
    JSON.stringify([...unique.values()].slice(0, 500)),
    options,
  );
}

export function writeSavedRouteSnapshots(
  snapshots: SavedRouteSnapshot[],
  options: MobileStorageOptions = {},
): Promise<void> {
  const normalized = parseSavedRouteSnapshots(JSON.stringify(snapshots));
  return writeRaw(
    MOBILE_STORAGE_KEYS.savedRouteSnapshots,
    JSON.stringify(normalized),
    options,
  );
}

export function writeSavedVenueState(
  ids: string[],
  snapshots: SavedVenueSnapshot[],
  options: MobileStorageOptions = {},
): Promise<void> {
  const normalizedIds = boundedIds(ids);
  const idSet = new Set(normalizedIds);
  const normalizedSnapshots = parseSavedVenueSnapshots(JSON.stringify(snapshots))
    .filter((snapshot) => idSet.has(snapshot.venue.id));
  return writeRaw(
    MOBILE_STORAGE_KEYS.savedVenueState,
    JSON.stringify({ ids: normalizedIds, snapshots: normalizedSnapshots }),
    options,
  );
}

export function writeSavedRouteState(
  ids: string[],
  snapshots: SavedRouteSnapshot[],
  options: MobileStorageOptions = {},
): Promise<void> {
  const normalizedIds = boundedIds(ids);
  const idSet = new Set(normalizedIds);
  const normalizedSnapshots = parseSavedRouteSnapshots(JSON.stringify(snapshots))
    .filter((snapshot) => idSet.has(snapshot.route.id));
  return writeRaw(
    MOBILE_STORAGE_KEYS.savedRouteState,
    JSON.stringify({ ids: normalizedIds, snapshots: normalizedSnapshots }),
    options,
  );
}

export function writeNavigationState(
  state: MobileNavigationState,
  options: MobileStorageOptions = {},
): Promise<void> {
  return writeRaw(MOBILE_STORAGE_KEYS.navigation, JSON.stringify(state), options);
}
