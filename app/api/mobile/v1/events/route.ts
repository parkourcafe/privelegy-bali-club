import { NextResponse } from "next/server";
import { getActiveMobileEvents } from "@/lib/mobile-api/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, X-Other-Bali-Mobile-Shell",
  "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
  "X-Content-Type-Options": "nosniff",
};

export async function GET() {
  return NextResponse.json({
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    data: { events: await getActiveMobileEvents() },
  }, { headers });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers });
}
