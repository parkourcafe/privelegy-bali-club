import { buildMobileDiscoveryPage } from "@/lib/mobile-api/discovery";
import { getMobileVenuesData } from "@/lib/mobile-api/service";
import type { MobileVenue } from "@/lib/mobile-api/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILTER_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
const CURSOR_PATTERN = /^[A-Za-z0-9_-]{1,500}$/;
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, X-Other-Bali-Mobile-Shell",
  "X-Content-Type-Options": "nosniff",
};

type VenueLoader = () => Promise<MobileVenue[]>;
type Clock = () => Date;

function json(
  body: unknown,
  status: number,
  cacheControl: string,
): Response {
  return Response.json(body, {
    status,
    headers: {
      ...corsHeaders,
      "Cache-Control": cacheControl,
    },
  });
}

function errorBody(
  updatedAt: string,
  code: "invalid_request" | "temporarily_unavailable",
) {
  return {
    schemaVersion: 1,
    updatedAt,
    error: {
      code,
      message: code === "invalid_request"
        ? "The request is invalid."
        : "The service is temporarily unavailable.",
    },
  };
}

export function createFeedGetHandler(
  loadVenues: VenueLoader = async () => (await getMobileVenuesData()).venues,
  clock: Clock = () => new Date(),
) {
  return async function feedGetHandler(request: Request): Promise<Response> {
    const now = clock().toISOString();
    const search = new URL(request.url).searchParams;
    const district = search.get("district");
    const category = search.get("category");
    const cursor = search.get("cursor");
    const rawLimit = search.get("limit");
    const limit = rawLimit && /^\d{1,2}$/.test(rawLimit) ? Number(rawLimit) : Number.NaN;
    if (
      search.size < 3
      || search.size > 4
      || !district
      || !FILTER_PATTERN.test(district)
      || !category
      || !FILTER_PATTERN.test(category)
      || !Number.isInteger(limit)
      || limit < 1
      || limit > 50
      || (cursor !== null && !CURSOR_PATTERN.test(cursor))
      || [...search.keys()].some((key) => !["district", "category", "cursor", "limit"].includes(key))
    ) {
      return json(errorBody(now, "invalid_request"), 400, "no-store");
    }

    let venues: MobileVenue[];
    try {
      venues = await loadVenues();
    } catch {
      return json(errorBody(now, "temporarily_unavailable"), 503, "no-store");
    }
    try {
      const page = buildMobileDiscoveryPage(venues, {
        district: district === "all" ? "" : district,
        category: category === "all" ? "" : category,
        cursor,
        limit,
        updatedAt: now,
      });
      return json(
        { schemaVersion: 1, updatedAt: now, data: { page } },
        200,
        "public, max-age=60",
      );
    } catch {
      return json(errorBody(now, "invalid_request"), 400, "no-store");
    }
  };
}

export const GET = createFeedGetHandler();

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { ...corsHeaders, "Cache-Control": "public, max-age=86400" },
  });
}
