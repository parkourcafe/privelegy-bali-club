import {
  OFFLINE_BALI_MAX_DEVICE_BYTES,
  OFFLINE_BALI_MAX_PACKS,
  type OfflinePackState,
  type OfflineRegionManifest,
} from "../../lib/journey/offline-bali";
import { Capacitor } from "@capacitor/core";
import { OfflineMapbox } from "@other-bali/offline-mapbox";

export interface OfflineMapRuntimeCapability {
  available: boolean;
  provider: string | null;
  reason: string | null;
}

export interface NativeOfflinePack {
  regionId: string;
  version: string;
  completedResourceCount: number;
  completedResourceSize: number;
  requiredResourceCount: number;
  progress: number;
}

export interface OfflineMapRuntime {
  capability(): Promise<OfflineMapRuntimeCapability>;
  download(
    region: OfflineRegionManifest,
    onProgress?: (state: OfflinePackState) => void,
  ): Promise<OfflinePackState>;
  remove(regionId: string): Promise<void>;
  open(regionId: string): Promise<boolean>;
  list?(): Promise<NativeOfflinePack[]>;
}

export interface ListableOfflineMapRuntime extends OfflineMapRuntime {
  list(): Promise<NativeOfflinePack[]>;
}

export const unavailableOfflineMapRuntime: OfflineMapRuntime = {
  async capability() {
    return {
      available: false,
      provider: null,
      reason: "blocked_pending_provider_acceptance",
    };
  },
  async download() {
    throw new Error("offline_map_provider_unavailable");
  },
  async remove() {
    throw new Error("offline_map_provider_unavailable");
  },
  async open() {
    return false;
  },
};

function parseBounds(coverageRef: string): {
  west: number; south: number; east: number; north: number;
} {
  const match = /^mapbox:bbox:([-.\d]+),([-.\d]+),([-.\d]+),([-.\d]+)$/.exec(coverageRef);
  if (!match) throw new Error("invalid_mapbox_coverage");
  const [west, south, east, north] = match.slice(1).map(Number);
  if (
    ![west, south, east, north].every(Number.isFinite)
    || west! >= east!
    || south! >= north!
    || west! < -180 || east! > 180
    || south! < -90 || north! > 90
  ) throw new Error("invalid_mapbox_coverage");
  return { west: west!, south: south!, east: east!, north: north! };
}

export const mapboxOfflineMapRuntime: OfflineMapRuntime = {
  async capability() {
    if (!Capacitor.isNativePlatform()) {
      return { available: false, provider: null, reason: "native_runtime_required" };
    }
    const capability = await OfflineMapbox.capability();
    if (
      !capability.available
      || !capability.mapTiles
      || !capability.gpsOnDownloadedMap
      || !capability.onboardRouting
      || !capability.telemetryOptOutAvailable
    ) return { available: false, provider: null, reason: "provider_capability_incomplete" };
    return { available: true, provider: "mapbox", reason: null };
  },
  async download(region, onProgress) {
    const bounds = parseBounds(region.coverageRef);
    const listener = onProgress
      ? await OfflineMapbox.addListener("progress", (result) => {
          if (result.regionId !== region.id) return;
          onProgress({
            regionId: region.id,
            version: region.version,
            status: "downloading",
            progress: result.progress,
            downloadedBytes: Math.min(result.completedResourceSize, region.estimatedBytes),
            totalBytes: region.estimatedBytes,
            updatedAt: new Date().toISOString(),
            lastError: null,
          });
        })
      : null;
    try {
      const result = await OfflineMapbox.download({
        id: region.id,
        version: region.version,
        ...bounds,
      });
      return {
        regionId: region.id,
        version: region.version,
        status: "ready",
        progress: 1,
        downloadedBytes: Math.min(result.completedResourceSize, region.estimatedBytes),
        totalBytes: Math.min(result.completedResourceSize, region.estimatedBytes),
        updatedAt: new Date().toISOString(),
        lastError: null,
      };
    } finally {
      await listener?.remove();
    }
  },
  async remove(regionId) {
    await OfflineMapbox.remove({ regionId });
  },
  async open(regionId) {
    return (await OfflineMapbox.open({
      regionId,
      routeGeometry: [],
      destinationLabel: "Next stop",
    })).opened;
  },
};

export const defaultOfflineMapRuntime = Capacitor.isNativePlatform()
  ? mapboxOfflineMapRuntime
  : unavailableOfflineMapRuntime;

export async function getOfflineMapCapability(
  runtime: OfflineMapRuntime = defaultOfflineMapRuntime,
): Promise<OfflineMapRuntimeCapability> {
  try {
    const result = await runtime.capability();
    if (!result.available || !result.provider?.trim()) {
      return { available: false, provider: null, reason: result.reason ?? "provider_unavailable" };
    }
    return result;
  } catch {
    return { available: false, provider: null, reason: "runtime_unavailable" };
  }
}

export type OfflineRegionDownloadResult =
  | { outcome: "blocked"; reason: string; packs: OfflinePackState[] }
  | { outcome: "ready"; reason: null; packs: OfflinePackState[] }
  | { outcome: "failed"; reason: "download_failed"; packs: OfflinePackState[] };

export interface OfflineRegionDownloadOptions {
  runtime?: OfflineMapRuntime;
  region: OfflineRegionManifest;
  packs: OfflinePackState[];
  persist(packs: OfflinePackState[]): Promise<void>;
  publish(packs: OfflinePackState[]): void;
  now?: () => Date;
}

function replacePack(
  packs: OfflinePackState[],
  replacement: OfflinePackState,
): OfflinePackState[] {
  return [...packs.filter((pack) => pack.regionId !== replacement.regionId), replacement];
}

export async function downloadOfflineRegionIfAvailable({
  runtime = defaultOfflineMapRuntime,
  region,
  packs,
  persist,
  publish,
  now = () => new Date(),
}: OfflineRegionDownloadOptions): Promise<OfflineRegionDownloadResult> {
  const capability = await getOfflineMapCapability(runtime);
  if (!capability.available) {
    return {
      outcome: "blocked",
      reason: capability.reason ?? "provider_unavailable",
      packs,
    };
  }

  const downloading: OfflinePackState = {
    regionId: region.id,
    version: region.version,
    status: "downloading",
    progress: 0,
    downloadedBytes: 0,
    totalBytes: region.estimatedBytes,
    updatedAt: now().toISOString(),
    lastError: null,
  };
  let next = replacePack(packs, downloading);
  publish(next);
  await persist(next);

  try {
    const ready = await runtime.download(region, (progress) => {
      next = replacePack(next, progress);
      publish(next);
      void persist(next).catch(() => {
        // A later progress event or the final state retries persistence. The
        // caller already publishes its durable-storage warning.
      });
    });
    next = replacePack(next, ready);
    publish(next);
    await persist(next);
    return { outcome: "ready", reason: null, packs: next };
  } catch {
    const failed: OfflinePackState = {
      ...downloading,
      status: "failed",
      updatedAt: now().toISOString(),
      lastError: "download_failed",
    };
    next = replacePack(next, failed);
    publish(next);
    await persist(next);
    return { outcome: "failed", reason: "download_failed", packs: next };
  }
}

export interface OfflinePackLifecycleOptions {
  runtime: OfflineMapRuntime;
  packs: OfflinePackState[];
  publish(packs: OfflinePackState[]): void;
  persist(packs: OfflinePackState[]): Promise<void>;
  now?: () => Date;
}

export interface OfflinePackReconciliationOptions
  extends Omit<OfflinePackLifecycleOptions, "runtime"> {
  runtime: ListableOfflineMapRuntime;
}

const OFFLINE_REGION_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isOfflineRegionId(value: unknown): value is string {
  return typeof value === "string"
    && value.length <= 100
    && OFFLINE_REGION_ID_PATTERN.test(value);
}

function validateNativePacks(value: unknown): NativeOfflinePack[] {
  if (!Array.isArray(value) || value.length > OFFLINE_BALI_MAX_PACKS) {
    throw new Error("Invalid native pack list");
  }
  const ids = new Set<string>();
  return value.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("Invalid native pack");
    }
    const pack = entry as Partial<NativeOfflinePack>;
    if (
      !isOfflineRegionId(pack.regionId)
      || typeof pack.version !== "string"
      || !pack.version.trim()
      || pack.version.trim() !== pack.version
      || pack.version.length > 80
      || !Number.isSafeInteger(pack.completedResourceCount)
      || (pack.completedResourceCount ?? -1) < 0
      || !Number.isSafeInteger(pack.completedResourceSize)
      || (pack.completedResourceSize ?? -1) < 0
      || (pack.completedResourceSize ?? 0) > OFFLINE_BALI_MAX_DEVICE_BYTES
      || !Number.isSafeInteger(pack.requiredResourceCount)
      || (pack.requiredResourceCount ?? 0) < 1
      || (pack.completedResourceCount ?? 0) < (pack.requiredResourceCount ?? 0)
      || typeof pack.progress !== "number"
      || pack.progress !== 1
    ) {
      throw new Error("Invalid native pack");
    }
    if (ids.has(pack.regionId)) throw new Error(`Duplicate native pack: ${pack.regionId}`);
    ids.add(pack.regionId);
    return pack as NativeOfflinePack;
  });
}

function readyStateFromNative(
  native: NativeOfflinePack,
  updatedAt: string,
): OfflinePackState {
  return {
    regionId: native.regionId,
    version: native.version,
    status: "ready",
    progress: 1,
    downloadedBytes: native.completedResourceSize,
    totalBytes: native.completedResourceSize,
    updatedAt,
    lastError: null,
  };
}

export async function reconcileOfflinePackStates({
  runtime,
  packs,
  publish,
  persist,
  now = () => new Date(),
}: OfflinePackReconciliationOptions): Promise<OfflinePackState[]> {
  const nativePacks = validateNativePacks(await runtime.list());
  const nativeById = new Map(nativePacks.map((pack) => [pack.regionId, pack]));
  const timestamp = now().toISOString();
  const reconciled = packs.map((durable): OfflinePackState => {
    const native = nativeById.get(durable.regionId);
    if (!native) {
      return {
        ...durable,
        status: "failed",
        updatedAt: timestamp,
        lastError: "native_pack_missing",
      };
    }
    nativeById.delete(durable.regionId);
    return readyStateFromNative(native, timestamp);
  });
  for (const native of nativeById.values()) {
    reconciled.push(readyStateFromNative(native, timestamp));
  }
  publish(reconciled);
  await persist(reconciled);
  return reconciled;
}

export type OfflineRegionRemovalResult =
  | { outcome: "removed"; packs: OfflinePackState[] }
  | { outcome: "failed"; packs: OfflinePackState[] };

export async function removeOfflineRegionSafely({
  runtime,
  regionId,
  packs,
  publish,
  persist,
  now = () => new Date(),
}: OfflinePackLifecycleOptions & { regionId: string }): Promise<OfflineRegionRemovalResult> {
  if (!isOfflineRegionId(regionId)) {
    throw new Error("Invalid offline region id");
  }
  const existing = packs.find((pack) => pack.regionId === regionId);
  if (!existing) return { outcome: "removed", packs };

  const timestamp = now().toISOString();
  const deleting = replacePack(packs, {
    ...existing,
    status: "deleting",
    updatedAt: timestamp,
    lastError: null,
  });
  publish(deleting);
  await persist(deleting);

  try {
    await runtime.remove(regionId);
  } catch {
    const failed = replacePack(deleting, {
      ...existing,
      status: "failed",
      updatedAt: timestamp,
      lastError: "remove_failed",
    });
    publish(failed);
    await persist(failed);
    return { outcome: "failed", packs: failed };
  }

  const removed = deleting.filter((pack) => pack.regionId !== regionId);
  publish(removed);
  await persist(removed);
  return { outcome: "removed", packs: removed };
}
