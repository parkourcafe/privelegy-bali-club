import type { OfflinePackState, OfflineRegionManifest } from "../../lib/journey/offline-bali";
import { Capacitor } from "@capacitor/core";
import { OfflineMapbox } from "@other-bali/offline-mapbox";

export interface OfflineMapRuntimeCapability {
  available: boolean;
  provider: string | null;
  reason: string | null;
}

export interface OfflineMapRuntime {
  capability(): Promise<OfflineMapRuntimeCapability>;
  download(
    region: OfflineRegionManifest,
    onProgress?: (state: OfflinePackState) => void,
  ): Promise<OfflinePackState>;
  remove(regionId: string): Promise<void>;
  open(regionId: string): Promise<boolean>;
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
    return (await OfflineMapbox.open({ regionId })).opened;
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
