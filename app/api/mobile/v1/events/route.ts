import { NextResponse } from "next/server";
import {
  getActiveMobileEvents,
  MobileEventStoreUnavailableError,
  type MobileEventOccurrence,
} from "@/lib/mobile-api/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, X-Other-Bali-Mobile-Shell",
  "X-Content-Type-Options": "nosniff",
};

type EventsLoader = (now: Date) => Promise<MobileEventOccurrence[]>;
type Clock = () => Date;

export function createEventsGetHandler(
  loadEvents: EventsLoader = getActiveMobileEvents,
  clock: Clock = () => new Date(),
) {
  return async function eventsGetHandler() {
    const now = clock();
    try {
      const events = await loadEvents(now);
      return NextResponse.json(
        {
          schemaVersion: 1,
          updatedAt: now.toISOString(),
          data: { events },
        },
        {
          headers: {
            ...corsHeaders,
            "Cache-Control": "public, max-age=60",
          },
        },
      );
    } catch (error) {
      if (!(error instanceof MobileEventStoreUnavailableError)) throw error;
      return NextResponse.json(
        {
          schemaVersion: 1,
          updatedAt: now.toISOString(),
          error: {
            code: "temporarily_unavailable",
            message: "The service is temporarily unavailable.",
          },
        },
        {
          status: 503,
          headers: {
            ...corsHeaders,
            "Cache-Control": "no-store",
          },
        },
      );
    }
  };
}

export const GET = createEventsGetHandler();

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store",
    },
  });
}
