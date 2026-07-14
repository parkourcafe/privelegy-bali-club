import { NextResponse } from "next/server";
import { setVenueJtbd } from "@/lib/data";
import { readBoundedJson } from "@/lib/api/request";
import { parseOnboardJtbdRequest } from "@/lib/api/public-post-contracts";
import { logRequestFailure } from "@/lib/server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_JTBD_BODY_BYTES = 16 * 1024;
const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

// Partners may update only their clearly attributed own-words note. Other
// fit/editorial fields stay operator-owned.
export async function POST(req: Request) {
  const body = await readBoundedJson(req, MAX_JTBD_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }
  const parsed = parseOnboardJtbdRequest(body.value);
  if (!parsed) return errorResponse("invalid_request", 400);

  try {
    const ok = await setVenueJtbd(parsed.token, { ownerNote: parsed.ownerNote });
    return ok
      ? NextResponse.json({ ok: true }, { headers: NO_STORE })
      : errorResponse("update_rejected", 422);
  } catch {
    logRequestFailure(req, "onboarding_jtbd_unavailable");
    return errorResponse("update_unavailable", 503);
  }

}
