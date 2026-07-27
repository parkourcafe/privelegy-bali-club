import type { OfflinePackState, OfflineRegionManifest } from "../../lib/journey/offline-bali";

export interface OfflineMapRuntimeCapability {
  available: boolean;
  provider: string | null;
  reason: string | null;
}

export interface OfflineMapRuntime {
  capability(): Promise<OfflineMapRuntimeCapability>;
  download(region: OfflineRegionManifest): Promise<OfflinePackState>;
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

export async function getOfflineMapCapability(
  runtime: OfflineMapRuntime = unavailableOfflineMapRuntime,
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
