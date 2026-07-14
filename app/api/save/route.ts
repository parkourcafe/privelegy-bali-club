import { NextResponse } from "next/server";
import { setSavedPlace } from "@/lib/data";
import { readGuestRef } from "@/lib/guest-server";
import { readBoundedJson } from "@/lib/api/request";
import { parseSavePlaceRequest } from "@/lib/api/public-post-contracts";
import { logRequestFailure } from "@/lib/server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_SAVE_BODY_BYTES = 512;
const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

// Set the requested saved state idempotently (master §6c, Rung 1). Anonymous —
// guest id from the httpOnly cookie; no login, no PII, no localStorage
// (guardrail #10). A stale tab can repeat the request without removing data.
export async function POST(req: Request) {
  const body = await readBoundedJson(req, MAX_SAVE_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }
  const parsed = parseSavePlaceRequest(body.value);
  if (!parsed) return errorResponse("invalid_request", 400);

  try {
    const ref = await readGuestRef();
    if (!ref) return errorResponse("guest_identity_required", 409);
    const result = await setSavedPlace(ref, parsed.venueSlug, parsed.saved);
    if (!result.ok) {
      logRequestFailure(req, "public_save_unavailable");
      return errorResponse("save_unavailable", 503);
    }

    return NextResponse.json(result, { headers: NO_STORE });
  } catch {
    logRequestFailure(req, "public_save_unavailable");
    return errorResponse("save_unavailable", 503);
  }
}
