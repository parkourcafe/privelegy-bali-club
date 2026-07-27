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

export function getOfflineBaliManifest(now = new Date()): OfflineBaliManifest {
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
    reason: "Offline map provider acceptance and Bali device validation are not complete.",
  };
}

export function GET() {
  return NextResponse.json(getOfflineBaliManifest(), { headers });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers });
}
