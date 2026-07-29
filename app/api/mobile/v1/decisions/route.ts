import { createMobileDecision } from "@/lib/mobile-api/discovery";
import { getMobileVenuesData } from "@/lib/mobile-api/service";
import type { MobileVenue } from "@/lib/mobile-api/contracts";
import { MOBILE_GUEST_HEADER } from "@/lib/guest-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MOBILE_ORIGINS = new Set([
  "capacitor://localhost",
  "http://localhost",
  "https://localhost",
]);
const MOBILE_ALLOWED_HEADERS =
  `Content-Type, Idempotency-Key, ${MOBILE_GUEST_HEADER}, X-Other-Bali-Mobile-Shell`;

function corsOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  return origin && MOBILE_ORIGINS.has(origin) ? origin : null;
}

function withMobileCors(request: Request, response: Response): Response {
  const origin = corsOrigin(request);
  if (!origin) return response;
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Headers", MOBILE_ALLOWED_HEADERS);
  response.headers.append("Vary", "Origin");
  return response;
}

type VenueLoader = () => Promise<MobileVenue[]>;
type Clock = () => Date;

const CONTEXT_KEYS = ["area", "budget", "company", "ending", "moment"] as const;
const BODY_KEYS = ["context"] as const;
const VALUE_PATTERN = /^[a-z0-9]+(?:_[a-z0-9]+)*$/;

function hasExactKeys(value: object, expected: readonly string[]): boolean {
  const keys = Object.keys(value).sort();
  return keys.length === expected.length
    && keys.every((key, index) => key === [...expected].sort()[index]);
}

function errorResponse(
  updatedAt: string,
  code: "invalid_request" | "temporarily_unavailable",
  status: 400 | 503,
): Response {
  return Response.json({
    schemaVersion: 1,
    updatedAt,
    error: {
      code,
      message: code === "invalid_request"
        ? "The request is invalid."
        : "The service is temporarily unavailable.",
    },
  }, { status, headers: { "Cache-Control": "no-store" } });
}

async function parseDecisionContext(request: Request): Promise<Record<typeof CONTEXT_KEYS[number], string> | null> {
  const key = request.headers.get("idempotency-key");
  if (!key || key.length > 160) return null;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body) || !hasExactKeys(body, BODY_KEYS)) {
      return null;
    }
    const context = (body as { context?: unknown }).context;
    if (
      !context
      || typeof context !== "object"
      || Array.isArray(context)
      || !hasExactKeys(context, CONTEXT_KEYS)
    ) return null;
    const record = context as Record<string, unknown>;
    if (CONTEXT_KEYS.some((field) => (
      typeof record[field] !== "string"
      || !VALUE_PATTERN.test(record[field])
      || record[field].length > 120
    ))) return null;
    return record as Record<typeof CONTEXT_KEYS[number], string>;
  } catch {
    return null;
  }
}

export function createDecisionPostHandler(
  loadVenues: VenueLoader = async () => (await getMobileVenuesData()).venues,
  clock: Clock = () => new Date(),
) {
  return async function decisionPostHandler(request: Request): Promise<Response> {
    const now = clock().toISOString();
    const context = await parseDecisionContext(request);
    if (!context) {
      return withMobileCors(request, errorResponse(now, "invalid_request", 400));
    }
    let venues: MobileVenue[];
    try {
      venues = await loadVenues();
    } catch {
      return withMobileCors(request, errorResponse(now, "temporarily_unavailable", 503));
    }
    const decision = createMobileDecision(venues, {
      area: context.area,
      moment: context.moment,
      budget: context.budget,
      company: context.company,
      updatedAt: now,
    });
    const slot = (value: typeof decision.best) => value ? {
      placeId: value.venue.slug,
      name: value.venue.name,
      why: value.explanation,
      notIdealIf: value.venue.notFor,
    } : null;
    return withMobileCors(request, Response.json({
      schemaVersion: 1,
      updatedAt: now,
      data: {
        result: {
          bestFit: slot(decision.best),
          backup: slot(decision.backup),
          contrast: slot(decision.contrast),
          emptyStateReason: decision.emptyStateReason,
        },
      },
    }, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }));
  };
}

export const POST = createDecisionPostHandler();

export function OPTIONS(request: Request) {
  const origin = corsOrigin(request);
  return new Response(null, {
    status: origin ? 204 : 403,
    headers: origin ? {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": MOBILE_ALLOWED_HEADERS,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      Vary: "Origin",
    } : undefined,
  });
}
