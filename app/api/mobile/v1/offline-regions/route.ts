import { NextResponse } from "next/server";
import {
  OFFLINE_BALI_SCHEMA_VERSION,
  type OfflineBaliManifest,
} from "@/lib/journey/offline-bali";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, X-Other-Bali-Mobile-Shell",
  "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
  "X-Content-Type-Options": "nosniff",
};

export function getOfflineBaliManifest(
  now = new Date(),
  enabled = process.env.OFFLINE_MAPBOX_LEVEL3_ENABLED === "true",
): OfflineBaliManifest {
  if (!enabled) {
    return {
      schemaVersion: OFFLINE_BALI_SCHEMA_VERSION,
      updatedAt: now.toISOString(),
      providerStatus: "blocked_pending_acceptance",
      capabilities: {
        mapTiles: false,
        gpsOnDownloadedMap: false,
        onboardRouting: false,
      },
      regions: [],
      reason: "Mapbox Level 3 remains disabled until physical iOS and Android acceptance gates pass.",
    };
  }
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1_000).toISOString();
  return {
    schemaVersion: OFFLINE_BALI_SCHEMA_VERSION,
    updatedAt: now.toISOString(),
    providerStatus: "available",
    capabilities: {
      mapTiles: true,
      gpsOnDownloadedMap: true,
      onboardRouting: true,
    },
    regions: [
      { id: "south-bali", name: "South Bali", coverageRef: "mapbox:bbox:114.98,-8.90,115.31,-8.61", version: "2026-07", styleVersion: "mapbox-11.26", estimatedBytes: 230_686_720, expiresAt },
      { id: "ubud-central", name: "Ubud & Central Bali", coverageRef: "mapbox:bbox:115.17,-8.61,115.36,-8.36", version: "2026-07", styleVersion: "mapbox-11.26", estimatedBytes: 188_743_680, expiresAt },
      { id: "north-bali", name: "North Bali", coverageRef: "mapbox:bbox:114.80,-8.32,115.33,-8.08", version: "2026-07", styleVersion: "mapbox-11.26", estimatedBytes: 209_715_200, expiresAt },
      { id: "east-bali", name: "East Bali", coverageRef: "mapbox:bbox:115.35,-8.58,115.72,-8.20", version: "2026-07", styleVersion: "mapbox-11.26", estimatedBytes: 220_200_960, expiresAt },
      { id: "nusa-penida", name: "Nusa Penida", coverageRef: "mapbox:bbox:115.40,-8.82,115.66,-8.62", version: "2026-07", styleVersion: "mapbox-11.26", estimatedBytes: 157_286_400, expiresAt },
    ],
    reason: "Mapbox mobile offline packs include maps and onboard routing. Live traffic and current opening status still require internet.",
  };
}

export function GET() {
  return NextResponse.json(getOfflineBaliManifest(), { headers });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers });
}
