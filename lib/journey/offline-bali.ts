export const OFFLINE_BALI_SCHEMA_VERSION = 1 as const;
export const OFFLINE_BALI_MAX_PACKS = 12;
export const OFFLINE_BALI_MAX_DEVICE_BYTES = 2_147_483_648;

export type OfflineBaliProviderStatus =
  | "blocked_pending_acceptance"
  | "available"
  | "maintenance";

export type OfflinePackStatus =
  | "not_downloaded"
  | "downloading"
  | "ready"
  | "stale"
  | "failed"
  | "deleting";

export interface OfflineRegionManifest {
  id: string;
  name: string;
  coverageRef: string;
  version: string;
  styleVersion: string;
  estimatedBytes: number;
  expiresAt: string;
}

export interface OfflineBaliManifest {
  schemaVersion: typeof OFFLINE_BALI_SCHEMA_VERSION;
  updatedAt: string;
  providerStatus: OfflineBaliProviderStatus;
  capabilities: {
    mapTiles: boolean;
    gpsOnDownloadedMap: boolean;
    onboardRouting: boolean;
  };
  regions: OfflineRegionManifest[];
  reason: string | null;
}

export interface OfflinePackState {
  regionId: string;
  version: string;
  status: OfflinePackStatus;
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
  updatedAt: string;
  lastError: string | null;
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isBoundedId(value: unknown): value is string {
  return typeof value === "string"
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
    && value.length <= 100;
}

export function parseOfflineBaliManifest(value: unknown): OfflineBaliManifest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid Offline Bali manifest");
  }
  const candidate = value as Record<string, unknown>;
  const capabilities = candidate.capabilities;
  const regions = candidate.regions;
  if (
    candidate.schemaVersion !== OFFLINE_BALI_SCHEMA_VERSION
    || !isTimestamp(candidate.updatedAt)
    || !["blocked_pending_acceptance", "available", "maintenance"].includes(String(candidate.providerStatus))
    || !capabilities
    || typeof capabilities !== "object"
    || Array.isArray(capabilities)
    || !Array.isArray(regions)
    || regions.length > OFFLINE_BALI_MAX_PACKS
    || !(candidate.reason === null || (
      typeof candidate.reason === "string" && candidate.reason.length <= 500
    ))
  ) throw new Error("Invalid Offline Bali manifest");

  const capability = capabilities as Record<string, unknown>;
  if (
    typeof capability.mapTiles !== "boolean"
    || typeof capability.gpsOnDownloadedMap !== "boolean"
    || typeof capability.onboardRouting !== "boolean"
  ) throw new Error("Invalid Offline Bali capabilities");

  const parsedRegions = regions.map((entry): OfflineRegionManifest => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("Invalid Offline Bali region");
    }
    const region = entry as Record<string, unknown>;
    if (
      !isBoundedId(region.id)
      || typeof region.name !== "string"
      || !region.name.trim()
      || region.name.length > 120
      || typeof region.coverageRef !== "string"
      || !region.coverageRef
      || region.coverageRef.length > 200
      || typeof region.version !== "string"
      || !region.version
      || region.version.length > 80
      || typeof region.styleVersion !== "string"
      || !region.styleVersion
      || region.styleVersion.length > 80
      || !Number.isInteger(region.estimatedBytes)
      || Number(region.estimatedBytes) <= 0
      || Number(region.estimatedBytes) > OFFLINE_BALI_MAX_DEVICE_BYTES
      || !isTimestamp(region.expiresAt)
    ) throw new Error("Invalid Offline Bali region");
    return region as unknown as OfflineRegionManifest;
  });

  if (new Set(parsedRegions.map((region) => region.id)).size !== parsedRegions.length) {
    throw new Error("Duplicate Offline Bali region");
  }

  const providerStatus = candidate.providerStatus as OfflineBaliProviderStatus;
  const anyCapability = capability.mapTiles || capability.gpsOnDownloadedMap || capability.onboardRouting;
  if (
    providerStatus !== "available"
    && (anyCapability || parsedRegions.length)
  ) throw new Error("Blocked Offline Bali provider cannot advertise capabilities");
  if (
    providerStatus === "available"
    && (!capability.mapTiles || !capability.gpsOnDownloadedMap || !capability.onboardRouting)
  ) throw new Error("Offline Bali Level 3 requires all capabilities");

  return {
    schemaVersion: OFFLINE_BALI_SCHEMA_VERSION,
    updatedAt: candidate.updatedAt as string,
    providerStatus,
    capabilities: {
      mapTiles: capability.mapTiles,
      gpsOnDownloadedMap: capability.gpsOnDownloadedMap,
      onboardRouting: capability.onboardRouting,
    },
    regions: parsedRegions,
    reason: candidate.reason as string | null,
  };
}

export function parseOfflinePackStates(value: unknown): OfflinePackState[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, OfflinePackState>();
  for (const entry of value.slice(-OFFLINE_BALI_MAX_PACKS)) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const pack = entry as Record<string, unknown>;
    if (
      !isBoundedId(pack.regionId)
      || typeof pack.version !== "string"
      || !pack.version
      || pack.version.length > 80
      || !["not_downloaded", "downloading", "ready", "stale", "failed", "deleting"].includes(String(pack.status))
      || typeof pack.progress !== "number"
      || !Number.isFinite(pack.progress)
      || pack.progress < 0
      || pack.progress > 1
      || !Number.isInteger(pack.downloadedBytes)
      || Number(pack.downloadedBytes) < 0
      || Number(pack.downloadedBytes) > OFFLINE_BALI_MAX_DEVICE_BYTES
      || !Number.isInteger(pack.totalBytes)
      || Number(pack.totalBytes) < 0
      || Number(pack.totalBytes) > OFFLINE_BALI_MAX_DEVICE_BYTES
      || Number(pack.downloadedBytes) > Number(pack.totalBytes)
      || !isTimestamp(pack.updatedAt)
      || !(pack.lastError === null || (
        typeof pack.lastError === "string" && pack.lastError.length <= 160
      ))
    ) continue;
    if (pack.status === "ready" && (pack.progress !== 1 || pack.downloadedBytes !== pack.totalBytes)) {
      continue;
    }
    unique.set(pack.regionId, pack as unknown as OfflinePackState);
  }
  return [...unique.values()];
}

export function offlineBaliCanNavigate(
  manifest: OfflineBaliManifest,
  pack: OfflinePackState | undefined,
): boolean {
  if (
    manifest.providerStatus !== "available"
    || !manifest.capabilities.mapTiles
    || !manifest.capabilities.gpsOnDownloadedMap
    || !manifest.capabilities.onboardRouting
    || !pack
    || pack.status !== "ready"
  ) return false;
  return manifest.regions.some((region) => (
    region.id === pack.regionId
    && region.version === pack.version
    && Date.parse(region.expiresAt) > Date.now()
  ));
}
