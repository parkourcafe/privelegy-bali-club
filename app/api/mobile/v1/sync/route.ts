import { mutationResponse } from "@/lib/runtime-v1.2/route-runtime";
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

export async function POST(request: Request) {
  return withMobileCors(request, await mutationResponse(request, "sync.push"));
}

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
