import type { PluginListenerHandle } from "@capacitor/core";
export interface OfflineMapboxRegion { id: string; west: number; south: number; east: number; north: number; version: string; }
export interface OfflineMapboxPoint { latitude: number; longitude: number; }
export type OfflineMapboxRouteProfile = "driving" | "walking" | "cycling";
export interface OfflineMapboxRouteRequest {
  regionId: string;
  version: string;
  profile: OfflineMapboxRouteProfile;
  origin: OfflineMapboxPoint;
  destination: OfflineMapboxPoint;
}
export interface OfflineMapboxRoute extends OfflineMapboxRouteRequest {
  distanceMeters: number;
  durationSeconds: number;
  geometry: OfflineMapboxPoint[];
  generatedAt: string;
  trafficAware: false;
}
export interface OfflineMapboxPack { regionId: string; version: string; completedResourceCount: number; completedResourceSize: number; requiredResourceCount: number; progress: number; }
export interface OfflineMapboxPlugin {
  capability(): Promise<{ available: boolean; provider: "mapbox"; mapTiles: boolean; gpsOnDownloadedMap: boolean; onboardRouting: boolean; telemetryOptOutAvailable: boolean; maxDeviceBytes: number }>;
  download(options: OfflineMapboxRegion): Promise<OfflineMapboxPack>;
  route(options: { regionId: string; version: string; profile: OfflineMapboxRouteProfile; origin: OfflineMapboxPoint; destination: OfflineMapboxPoint }): Promise<OfflineMapboxRoute>;
  remove(options: { regionId: string }): Promise<void>;
  open(options: { regionId: string; routeGeometry?: OfflineMapboxPoint[]; destinationLabel?: string }): Promise<{ opened: boolean }>;
  list(): Promise<{ packs: OfflineMapboxPack[] }>;
  setTelemetryConsent(options: { enabled: boolean }): Promise<void>;
  addListener(eventName: "progress", listener: (event: OfflineMapboxPack) => void): Promise<PluginListenerHandle>;
}
export declare const OfflineMapbox: OfflineMapboxPlugin;
