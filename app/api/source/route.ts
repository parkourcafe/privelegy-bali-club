import { NextResponse } from "next/server";
import { readGuestRef } from "@/lib/guest-server";
import { parseSourceCaptureRequest } from "@/lib/source-attribution";
import { readServerConsentState } from "@/lib/privacy/server-consent";
import { readBoundedJson } from "@/lib/api/request";
import { logRequestFailure } from "@/lib/server-log";
import { serviceClient } from "@/lib/supabase/service";
import { asSourceScanRpcClient } from "@/lib/actions/event-compat";
import { storeRateLimitedSourceScan } from "@/lib/actions/event-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_SOURCE_BODY_BYTES = 512;
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

// Guest arrived via a source QR (?s=villa_01). Bind the source to the anonymous
// guest (first-touch) and log a source_scan. Guest id comes from the cookie.
export async function POST(req: Request) {
  if (await readServerConsentState() !== "analytics_allowed") {
    return errorResponse("analytics_consent_required", 403);
  }
  const body = await readBoundedJson(req, MAX_SOURCE_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }
  const source = parseSourceCaptureRequest(body.value);
  if (!source) return errorResponse("invalid_source", 400);

  const sb = serviceClient();
  if (!sb) {
    logRequestFailure(req, "source_storage_unavailable");
    return errorResponse("source_storage_unavailable", 503);
  }

  try {
    const ref = await readGuestRef();
    if (!ref) return errorResponse("analytics_consent_required", 403);
    // One service-only RPC verifies the server-backed consent log, validates
    // the registry, rate-limits/logs the scan and assigns first-touch source in
    // the same transaction. The client-writable cookie is only an early gate.
    const stored = await storeRateLimitedSourceScan(asSourceScanRpcClient(sb), {
      guestRef: ref,
      source,
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
      logRequestFailure(req, "source_storage_unavailable");
      return errorResponse("source_storage_unavailable", 503);
    }

    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch {
    logRequestFailure(req, "source_storage_unavailable");
    return errorResponse("source_storage_unavailable", 503);
  }
}
