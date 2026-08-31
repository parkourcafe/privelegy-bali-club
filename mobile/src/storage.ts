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
import type { MobileEventOccurrence } from "./api";
import type { Trip } from "../../lib/journey/contracts";
import { validateTrip } from "../../lib/journey/trip";
import type { SyncMutation } from "../../lib/journey/offline-sync";
import {
  parseOfflinePackStates,
  type OfflinePackState,
} from "../../lib/journey/offline-bali";
import {
  parseFeedResumeSnapshot,
  type FeedResumeSnapshot,
} from "./discovery-model";
import {
  parseNavigationSession,
  type NavigationSession,
} from "../../lib/journey/adaptive-companion";

export const MOBILE_STORAGE_KEYS = {
  bootstrap: "otherbali.mobile.public-bootstrap.v1",
  savedVenues: "otherbali.mobile.saved-venue-ids.v1",
  savedRoutes: "otherbali.mobile.saved-route-ids.v1",
  savedVenueSnapshots: "otherbali.mobile.saved-venue-summaries.v1",
  savedRouteSnapshots: "otherbali.mobile.saved-route-details.v1",
  savedVenueState: "otherbali.mobile.saved-venue-state.v2",
  savedRouteState: "otherbali.mobile.saved-route-state.v2",
  todayVenueState: "otherbali.mobile.today-venue-state.v1",
  todayEventState: "otherbali.mobile.today-event-state.v1",
  eventsSnapshot: "otherbali.mobile.events-snapshot.v1",
  trip: "otherbali.mobile.trip.v1",
  pendingSync: "otherbali.mobile.pending-sync.v1",
  offlinePacks: "otherbali.mobile.offline-packs.v1",
  navigationSession: "otherbali.mobile.navigation-session.v1",
  feedResume: "otherbali.mobile.feed-resume.v1",
  navigation: "otherbali.mobile.navigation-state.v3",
  legacyNavigation: "otherbali.mobile.navigation-state.v1",
  privacyDeletionQuarantine: "otherbali.mobile.privacy-deletion-quarantine.v1",
} as const;

export const MOBILE_PERSONAL_STORAGE_KEYS = [
  MOBILE_STORAGE_KEYS.savedVenues,
  MOBILE_STORAGE_KEYS.savedRoutes,
  MOBILE_STORAGE_KEYS.savedVenueSnapshots,
  MOBILE_STORAGE_KEYS.savedRouteSnapshots,
  MOBILE_STORAGE_KEYS.savedVenueState,
  MOBILE_STORAGE_KEYS.savedRouteState,
  MOBILE_STORAGE_KEYS.todayVenueState,
  MOBILE_STORAGE_KEYS.todayEventState,
  MOBILE_STORAGE_KEYS.trip,
  MOBILE_STORAGE_KEYS.pendingSync,
  MOBILE_STORAGE_KEYS.navigationSession,
  MOBILE_STORAGE_KEYS.feedResume,
  MOBILE_STORAGE_KEYS.navigation,
  MOBILE_STORAGE_KEYS.legacyNavigation,
] as const;

export const MAX_SAVED_ROUTE_SNAPSHOTS = 100;
const MAX_SAVED_ROUTE_SNAPSHOT_CANDIDATES = 500;

export type MobileSurface = "places" | "today" | "routes" | "events" | "saved";

export interface MobileNavigationState {
  surface: MobileSurface;
  selectedVenueId: string | null;
  selectedRouteId: string | null;
  scrollY: number;
  discoveryIndex?: number;
  companionArea?: string | null;
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
  todayVenueIds: string[];
  todayVenueSnapshots: SavedVenueSnapshot[];
  todayEventIds: string[];
  todayEventOccurrences: MobileEventOccurrence[];
  eventsSnapshot: { updatedAt: string; events: MobileEventOccurrence[] } | null;
  trip: Trip | null;
  pendingSync: SyncMutation[];
  offlinePacks: OfflinePackState[];
  navigationSession: NavigationSession | null;
  feedResume: FeedResumeSnapshot | null;
  navigation: MobileNavigationState;
  privacyDeletionQuarantine: PrivacyDeletionQuarantinePhase | null;
}

export type PrivacyDeletionQuarantinePhase = "pending_server" | "server_confirmed";

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
  discoveryIndex: 0,
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
const preferenceWriteTokens = new WeakMap<PreferenceStore, Map<string, symbol>>();

function enqueuePreferenceWrite(
  preferences: PreferenceStore,
  key: string,
  write: (isLatest: () => boolean) => Promise<void>,
): Promise<void> {
  let queues = preferenceWriteQueues.get(preferences);
  if (!queues) {
    queues = new Map();
    preferenceWriteQueues.set(preferences, queues);
  }
  let tokens = preferenceWriteTokens.get(preferences);
  if (!tokens) {
    tokens = new Map();
    preferenceWriteTokens.set(preferences, tokens);
  }
  const token = Symbol(key);
  tokens.set(key, token);
  const isLatest = () => tokens?.get(key) === token;
  const previous = queues.get(key) ?? Promise.resolve();
  const current = previous.catch(() => {}).then(() => write(isLatest));
  queues.set(key, current);
  return current.finally(() => {
    if (queues?.get(key) === current) queues.delete(key);
    if (tokens?.get(key) === token) tokens.delete(key);
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

function parseEventsSnapshot(raw: string | null): {
  updatedAt: string;
  events: MobileEventOccurrence[];
} | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    if (!isIsoTimestamp(value.updatedAt) || !Array.isArray(value.events) || value.events.length > 100) return null;
    const events = value.events.filter((entry): entry is MobileEventOccurrence => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
      const item = entry as Record<string, unknown>;
      const legacyLifecycle = item.status === undefined && item.cancellationReason === undefined;
      const currentLifecycle = (
        (item.status === "scheduled" && item.cancellationReason === null)
        || (
          item.status === "cancelled"
          && typeof item.cancellationReason === "string"
          && item.cancellationReason.trim().length > 0
          && item.cancellationReason.length <= 500
        )
      );
      return (legacyLifecycle || currentLifecycle)
        && ["id","eventId","title","startsAt","endsAt","lastVerifiedAt","expiresAt"]
        .every((field) => typeof item[field] === "string" && String(item[field]).length <= 200)
        && (item.venueSlug === null || typeof item.venueSlug === "string")
        && (item.area === null || typeof item.area === "string");
    });
    return { updatedAt: value.updatedAt, events };
  } catch {
    return null;
  }
}

function parseEventState(raw: string | null): {
  ids: string[];
  events: MobileEventOccurrence[];
} | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Record<string, unknown>;
    const ids = parseIds(JSON.stringify(value.ids));
    const parsed = parseEventsSnapshot(JSON.stringify({
      updatedAt: new Date(0).toISOString(),
      events: value.events,
    }));
    if (!parsed) return null;
    const idSet = new Set(ids);
    return { ids, events: parsed.events.filter((event) => idSet.has(event.id)) };
  } catch {
    return null;
  }
}

function parseTrip(raw: string | null): Trip | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Trip;
    if (
      !value
      || typeof value !== "object"
      || typeof value.id !== "string"
      || typeof value.title !== "string"
      || !/^\d{4}-\d{2}-\d{2}$/.test(value.startDate)
      || !/^\d{4}-\d{2}-\d{2}$/.test(value.endDate)
      || !Array.isArray(value.days)
    ) return null;
    return validateTrip(value);
  } catch {
    return null;
  }
}

function parsePendingSync(raw: string | null): SyncMutation[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const unique = new Map<string, SyncMutation>();
    for (const entry of value.slice(-200)) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
      const item = entry as Record<string, unknown>;
      if (
        typeof item.idempotencyKey !== "string"
        || !item.idempotencyKey
        || item.idempotencyKey.length > 160
        || !["saved", "visited", "note", "trip_stop"].includes(String(item.entityType))
        || typeof item.entityId !== "string"
        || typeof item.operation !== "string"
        || !item.payload
        || typeof item.payload !== "object"
        || Array.isArray(item.payload)
        || !isIsoTimestamp(item.createdAt)
        || !(item.baseVersion === null || typeof item.baseVersion === "string")
      ) continue;
      unique.set(item.idempotencyKey, item as unknown as SyncMutation);
    }
    return [...unique.values()].sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  } catch {
    return [];
  }
}

function parseOfflinePacks(raw: string | null): OfflinePackState[] {
  if (!raw) return [];
  try {
    return parseOfflinePackStates(JSON.parse(raw) as unknown);
  } catch {
    return [];
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
      !["places", "today", "routes", "events", "saved"].includes(String(surface))
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
    const discoveryIndex = candidate.discoveryIndex;
    const companionArea = candidate.companionArea;
    if (!(
      companionArea === undefined
      || companionArea === null
      || (
        typeof companionArea === "string"
        && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(companionArea)
        && companionArea.length <= 120
      )
    )) return DEFAULT_NAVIGATION_STATE;
    if (discoveryIndex === undefined) {
      return {
        surface: surface as MobileSurface,
        selectedVenueId: selectedVenueId as string | null,
        selectedRouteId: selectedRouteId as string | null,
        scrollY,
        ...(companionArea === undefined ? {} : { companionArea }),
      };
    }
    if (!Number.isInteger(discoveryIndex) || Number(discoveryIndex) < 0 || Number(discoveryIndex) > 10_000) {
      return DEFAULT_NAVIGATION_STATE;
    }
    return {
      surface: surface as MobileSurface,
      selectedVenueId: selectedVenueId as string | null,
      selectedRouteId: selectedRouteId as string | null,
      scrollY,
      discoveryIndex: Number(discoveryIndex),
      ...(companionArea === undefined ? {} : { companionArea }),
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
  try {
    legacyStorage?.setItem(pendingKey, value);
  } catch {
    // Native Preferences may still persist the value. If it also fails, the
    // queued write below requires a recoverable mirror before it can succeed.
  }
  return enqueuePreferenceWrite(preferences, key, async (isLatest) => {
    try {
      await preferences.set({ key, value });
      try {
        legacyStorage?.removeItem(key);
      } catch {
        // Preferences is already authoritative.
      }
      if (isLatest()) {
        try {
          legacyStorage?.removeItem(pendingKey);
        } catch {
          // Preferences is already authoritative.
        }
      }
    } catch {
      if (!legacyStorage) throw new Error("mobile_storage_unavailable");
      let pendingValue: string | null;
      try {
        pendingValue = legacyStorage.getItem(pendingKey);
        if (pendingValue !== value && isLatest()) {
          legacyStorage.setItem(pendingKey, value);
          pendingValue = value;
        }
      } catch {
        throw new Error("mobile_storage_unavailable");
      }
      if (pendingValue !== value) {
        if (!isLatest()) return;
        throw new Error("mobile_storage_unavailable");
      }
      try {
        // Do not let an older failed native write overwrite the synchronous
        // mirror already reserved by a newer call.
        if (pendingValue === value) legacyStorage.setItem(key, value);
      } catch {
        // Hydration still recovers the complete pending entry.
      }
    }
  });
}

export async function clearMobilePersonalData(
  options: MobileStorageOptions = {},
): Promise<void> {
  const { preferences, legacyStorage } = dependencies(options);
  const results = await Promise.allSettled(
    MOBILE_PERSONAL_STORAGE_KEYS.map((key) => enqueuePreferenceWrite(
      preferences,
      key,
      async () => {
        try {
          await preferences.remove({ key });
        } catch {
          throw new Error("mobile_personal_data_clear_failed");
        }

        try {
          legacyStorage?.removeItem(key);
          legacyStorage?.removeItem(pendingWriteKey(key));
        } catch {
          throw new Error("mobile_personal_data_clear_failed");
        }
      },
    )),
  );
  if (results.some((result) => result.status === "rejected")) {
    throw new Error("mobile_personal_data_clear_failed");
  }
}

export async function readPrivacyDeletionQuarantine(
  options: MobileStorageOptions = {},
): Promise<PrivacyDeletionQuarantinePhase | null> {
  const { preferences, legacyStorage } = dependencies(options);
  const key = MOBILE_STORAGE_KEYS.privacyDeletionQuarantine;
  let legacyRaw: string | null = null;
  let legacyReadable = true;
  try {
    legacyRaw = legacyStorage?.getItem(key) ?? null;
  } catch {
    legacyReadable = false;
  }
  let raw: string | null;
  try {
    raw = (await preferences.get({ key })).value ?? legacyRaw;
  } catch {
    // The marker is deliberately mirrored to WebView storage. When that
    // readable mirror is absent, a failed native read still proves no marker
    // was durably started by this version. If neither store is readable, fail
    // closed instead of hydrating personal state.
    if (!legacyReadable || legacyStorage === null) {
      throw new Error("mobile_privacy_quarantine_read_unavailable");
    }
    raw = legacyRaw;
  }
  if (raw === null) return null;
  if (raw === "server_confirmed") return "server_confirmed";
  // A malformed non-empty marker is still an interrupted deletion. Failing
  // closed prevents stale personal state from being hydrated or synced.
  return "pending_server";
}

export function writePrivacyDeletionQuarantine(
  phase: PrivacyDeletionQuarantinePhase,
  options: MobileStorageOptions = {},
): Promise<void> {
  const { preferences, legacyStorage } = dependencies(options);
  const key = MOBILE_STORAGE_KEYS.privacyDeletionQuarantine;
  return enqueuePreferenceWrite(preferences, key, async () => {
    let nativeWritten = false;
    try {
      await preferences.set({ key, value: phase });
      nativeWritten = true;
    } catch {
      // The mirrored WebView copy can remain authoritative during a temporary
      // native Preferences outage.
    }
    let mirrorWritten = legacyStorage === null;
    try {
      legacyStorage?.setItem(key, phase);
      mirrorWritten = true;
    } catch {
      // Do not contact the deletion endpoint unless the restart marker is
      // durably recoverable from every configured persistence path.
    }
    if (!nativeWritten && !mirrorWritten) {
      throw new Error("mobile_privacy_quarantine_write_failed");
    }
    if (legacyStorage !== null && !mirrorWritten) {
      throw new Error("mobile_privacy_quarantine_write_failed");
    }
  });
}

export async function clearPrivacyDeletionQuarantine(
  options: MobileStorageOptions = {},
): Promise<void> {
  const { preferences, legacyStorage } = dependencies(options);
  const key = MOBILE_STORAGE_KEYS.privacyDeletionQuarantine;
  await enqueuePreferenceWrite(preferences, key, async () => {
    try {
      await preferences.remove({ key });
      legacyStorage?.removeItem(key);
      legacyStorage?.removeItem(pendingWriteKey(key));
    } catch {
      throw new Error("mobile_privacy_quarantine_clear_failed");
    }
  });
}

export async function hydrateMobileStorage(
  options: MobileStorageOptions = {},
): Promise<MobileStorageState> {
  const { preferences, legacyStorage } = dependencies(options);
  const privacyDeletionQuarantine = await readPrivacyDeletionQuarantine(options);
  const readPersonal = (
    key: string,
    legacyKey = key,
  ): Promise<string | null> => privacyDeletionQuarantine
    ? Promise.resolve(null)
    : readRawWithMigration(key, preferences, legacyStorage, legacyKey);
  const [
    bootstrapRaw,
    savedVenueStateRaw,
    savedRouteStateRaw,
    savedVenueIdsRaw,
    savedRouteIdsRaw,
    snapshotsRaw,
    routeSnapshotsRaw,
    todayVenueStateRaw,
    todayEventStateRaw,
    eventsSnapshotRaw,
    tripRaw,
    pendingSyncRaw,
    offlinePacksRaw,
    navigationSessionRaw,
    feedResumeRaw,
    navigationRaw,
  ] = await Promise.all([
    readRawWithMigration(MOBILE_STORAGE_KEYS.bootstrap, preferences, legacyStorage),
    readPersonal(MOBILE_STORAGE_KEYS.savedVenueState),
    readPersonal(MOBILE_STORAGE_KEYS.savedRouteState),
    readPersonal(MOBILE_STORAGE_KEYS.savedVenues),
    readPersonal(MOBILE_STORAGE_KEYS.savedRoutes),
    readPersonal(MOBILE_STORAGE_KEYS.savedVenueSnapshots),
    readPersonal(MOBILE_STORAGE_KEYS.savedRouteSnapshots),
    readPersonal(MOBILE_STORAGE_KEYS.todayVenueState).catch(() => null),
    readPersonal(MOBILE_STORAGE_KEYS.todayEventState).catch(() => null),
    readRawWithMigration(MOBILE_STORAGE_KEYS.eventsSnapshot, preferences, legacyStorage).catch(() => null),
    readPersonal(MOBILE_STORAGE_KEYS.trip).catch(() => null),
    readPersonal(MOBILE_STORAGE_KEYS.pendingSync).catch(() => null),
    readRawWithMigration(MOBILE_STORAGE_KEYS.offlinePacks, preferences, legacyStorage).catch(() => null),
    readPersonal(MOBILE_STORAGE_KEYS.navigationSession).catch(() => null),
    readPersonal(MOBILE_STORAGE_KEYS.feedResume).catch(() => null),
    readPersonal(
      MOBILE_STORAGE_KEYS.navigation,
      MOBILE_STORAGE_KEYS.legacyNavigation,
    ),
  ]);
  const savedVenueState = parseSavedVenueState(savedVenueStateRaw);
  const savedRouteState = parseSavedRouteState(savedRouteStateRaw);
  const todayVenueState = parseSavedVenueState(todayVenueStateRaw);
  const todayEventState = parseEventState(todayEventStateRaw);
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
    todayVenueIds: todayVenueState?.ids ?? [],
    todayVenueSnapshots: todayVenueState?.snapshots ?? [],
    todayEventIds: todayEventState?.ids ?? [],
    todayEventOccurrences: todayEventState?.events ?? [],
    eventsSnapshot: parseEventsSnapshot(eventsSnapshotRaw),
    trip: parseTrip(tripRaw),
    pendingSync: parsePendingSync(pendingSyncRaw),
    offlinePacks: parseOfflinePacks(offlinePacksRaw),
    navigationSession: (() => {
      if (!navigationSessionRaw) return null;
      try {
        return parseNavigationSession(JSON.parse(navigationSessionRaw) as unknown);
      } catch {
        return null;
      }
    })(),
    feedResume: (() => {
      if (!feedResumeRaw) return null;
      try {
        return parseFeedResumeSnapshot(JSON.parse(feedResumeRaw) as unknown);
      } catch {
        return null;
      }
    })(),
    navigation: parseNavigation(navigationRaw),
    privacyDeletionQuarantine,
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

export function writeTodayVenueState(
  ids: string[],
  snapshots: SavedVenueSnapshot[],
  options: MobileStorageOptions = {},
): Promise<void> {
  const normalizedIds = boundedIds(ids);
  const idSet = new Set(normalizedIds);
  const normalizedSnapshots = parseSavedVenueSnapshots(JSON.stringify(snapshots))
    .filter((snapshot) => idSet.has(snapshot.venue.id));
  return writeRaw(
    MOBILE_STORAGE_KEYS.todayVenueState,
    JSON.stringify({ ids: normalizedIds, snapshots: normalizedSnapshots }),
    options,
  );
}

export function writeEventsSnapshot(
  snapshot: { updatedAt: string; events: MobileEventOccurrence[] },
  options: MobileStorageOptions = {},
): Promise<void> {
  const normalized = parseEventsSnapshot(JSON.stringify(snapshot));
  if (!normalized) return Promise.reject(new Error("invalid_events_snapshot"));
  return writeRaw(MOBILE_STORAGE_KEYS.eventsSnapshot, JSON.stringify(normalized), options);
}

export function writeTodayEventState(
  ids: string[],
  events: MobileEventOccurrence[],
  options: MobileStorageOptions = {},
): Promise<void> {
  const normalizedIds = boundedIds(ids);
  const idSet = new Set(normalizedIds);
  const parsed = parseEventsSnapshot(JSON.stringify({
    updatedAt: new Date(0).toISOString(),
    events,
  }));
  if (!parsed) return Promise.reject(new Error("invalid_today_event_state"));
  return writeRaw(
    MOBILE_STORAGE_KEYS.todayEventState,
    JSON.stringify({
      ids: normalizedIds,
      events: parsed.events.filter((event) => idSet.has(event.id)),
    }),
    options,
  );
}

export function writeTrip(
  trip: Trip,
  options: MobileStorageOptions = {},
): Promise<void> {
  try {
    const normalized = validateTrip(structuredClone(trip));
    return writeRaw(MOBILE_STORAGE_KEYS.trip, JSON.stringify(normalized), options);
  } catch {
    return Promise.reject(new Error("invalid_trip"));
  }
}

export function writePendingSync(
  mutations: SyncMutation[],
  options: MobileStorageOptions = {},
): Promise<void> {
  const normalized = parsePendingSync(JSON.stringify(mutations));
  return writeRaw(MOBILE_STORAGE_KEYS.pendingSync, JSON.stringify(normalized), options);
}

export function writeOfflinePackStates(
  packs: OfflinePackState[],
  options: MobileStorageOptions = {},
): Promise<void> {
  return writeRaw(
    MOBILE_STORAGE_KEYS.offlinePacks,
    JSON.stringify(parseOfflinePackStates(packs)),
    options,
  );
}

export function writeNavigationSession(
  session: NavigationSession,
  options: MobileStorageOptions = {},
): Promise<void> {
  const normalized = parseNavigationSession(session);
  if (!normalized) return Promise.reject(new Error("invalid_navigation_session"));
  return writeRaw(
    MOBILE_STORAGE_KEYS.navigationSession,
    JSON.stringify(normalized),
    options,
  );
}

export function writeFeedResumeSnapshot(
  snapshot: FeedResumeSnapshot,
  options: MobileStorageOptions = {},
): Promise<void> {
  const normalized = parseFeedResumeSnapshot(snapshot);
  if (!normalized) return Promise.reject(new Error("invalid_feed_resume_snapshot"));
  return writeRaw(MOBILE_STORAGE_KEYS.feedResume, JSON.stringify(normalized), options);
}

export function writeNavigationState(
  state: MobileNavigationState,
  options: MobileStorageOptions = {},
): Promise<void> {
  return writeRaw(MOBILE_STORAGE_KEYS.navigation, JSON.stringify(state), options);
}
