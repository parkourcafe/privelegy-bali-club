import type { PluginListenerHandle } from "@capacitor/core";
export interface OfflineMapboxRegion { id: string; west: number; south: number; east: number; north: number; version: string; }
export interface OfflineMapboxPack { regionId: string; completedResourceCount: number; completedResourceSize: number; requiredResourceCount: number; progress: number; }
export interface OfflineMapboxPlugin {
  capability(): Promise<{ available: boolean; provider: "mapbox"; mapTiles: boolean; gpsOnDownloadedMap: boolean; onboardRouting: boolean; telemetryOptOutAvailable: boolean; maxDeviceBytes: number }>;
  download(options: OfflineMapboxRegion): Promise<OfflineMapboxPack>;
  remove(options: { regionId: string }): Promise<void>;
  open(options: { regionId: string }): Promise<{ opened: boolean }>;
  list(): Promise<{ packs: OfflineMapboxPack[] }>;
  setTelemetryConsent(options: { enabled: boolean }): Promise<void>;
  addListener(eventName: "progress", listener: (event: OfflineMapboxPack) => void): Promise<PluginListenerHandle>;
}
export declare const OfflineMapbox: OfflineMapboxPlugin;
