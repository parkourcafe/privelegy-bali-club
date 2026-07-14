import { NextResponse } from "next/server";
import { parseEventRequest } from "@/lib/actions/event-safety";
import { asEventV3RpcClient } from "@/lib/actions/event-compat";
import { storeRateLimitedEvent } from "@/lib/actions/event-rate-limit";
import { readGuestRef } from "@/lib/guest-server";
import { serviceClient } from "@/lib/supabase/service";
import { readServerConsentState } from "@/lib/privacy/server-consent";
import { readBoundedJson } from "@/lib/api/request";
import { logRequestFailure } from "@/lib/server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_EVENT_BODY_BYTES = 8 * 1024;
const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(
  error: string,
  status: number,
  headers?: Readonly<Record<string, string>>,
) {
  return NextResponse.json(
    { ok: false, error },
    { status, headers: { ...NO_STORE, ...headers } },
  );
}

// Funnel logging from the client (§18). Guest id comes from the cookie; only
// allowlisted, runtime-validated event shapes are accepted here.
export async function POST(req: Request) {
  if (await readServerConsentState() !== "analytics_allowed") {
    return errorResponse("analytics_consent_required", 403);
  }
  const body = await readBoundedJson(req, MAX_EVENT_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }

  const parsed = parseEventRequest(body.value);
  if (!parsed.ok) {
    return errorResponse("invalid_event", 400);
  }

  const sb = serviceClient();
  if (!sb) {
    logRequestFailure(req, "event_storage_unavailable");
    return errorResponse("event_storage_unavailable", 503);
  }

  try {
    const ref = await readGuestRef();
    if (!ref) return errorResponse("analytics_consent_required", 403);
    const stored = await storeRateLimitedEvent(asEventV3RpcClient(sb), {
      type: parsed.event.type,
      guestRef: ref,
      venueSlug: parsed.event.venueSlug,
      payload: parsed.event.payload,
    });
    if (stored.status === "rate_limited") {
      return errorResponse("rate_limited", 429, {
        "Retry-After": String(stored.retryAfterSeconds),
      });
    }
    if (stored.status === "consent_required") {
      return errorResponse("analytics_consent_required", 403);
    }
    if (stored.status === "unavailable") {
      logRequestFailure(req, "event_storage_unavailable");
      return errorResponse("event_storage_unavailable", 503);
    }

    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch {
    logRequestFailure(req, "event_storage_unavailable");
    return errorResponse("event_storage_unavailable", 503);
  }
}
