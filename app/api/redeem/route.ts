import { NextResponse } from "next/server";
import { recordRedemption } from "@/lib/data";
import { readGuestRef } from "@/lib/guest-server";
import { verifyRedemptionToken } from "@/lib/redemption-token";
import { currentSiteOrigin } from "@/lib/site-origin";
import { readBoundedJson } from "@/lib/api/request";
import { parseRedeemRequest } from "@/lib/api/public-post-contracts";
import { logRequestFailure } from "@/lib/server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_REDEEM_BODY_BYTES = 1024;
const NO_STORE = { "Cache-Control": "no-store" };
const REDEMPTION_CLIENT_ERRORS = new Set([
  "consent_required",
  "venue_not_found",
  "no_active_perk",
]);
const REDEMPTION_STORAGE_ERRORS = new Set([
  "redemption_storage_unconfigured",
  "guest_ref_failed",
  "redemption_write_failed",
]);

function errorResponse(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

export async function POST(req: Request) {
  const body = await readBoundedJson(req, MAX_REDEEM_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }
  const parsed = parseRedeemRequest(body.value);
  if (!parsed) return errorResponse("invalid_request", 400);

  let audience: string | null;
  try {
    audience = await currentSiteOrigin();
  } catch {
    logRequestFailure(req, "redemption_storage_unavailable");
    return errorResponse("redemption_write_failed", 503);
  }
  if (
    !audience ||
    !verifyRedemptionToken(
      parsed.venueSlug,
      parsed.qrToken,
      process.env.REDEMPTION_SIGNING_SECRET,
      audience,
    )
  ) {
    return errorResponse("invalid_qr", 403);
  }
  if (!parsed.consentGranted) return errorResponse("consent_required", 422);

  try {
    const ref = await readGuestRef();
    if (!ref) return errorResponse("guest_identity_required", 409);
    const result = await recordRedemption({
      guestRef: ref,
      venueSlug: parsed.venueSlug,
      consentGranted: parsed.consentGranted,
      userAgent: req.headers.get("user-agent") ?? "",
    });
    if (!result.ok) {
      const returnedError = result.error ?? "";
      const clientError = REDEMPTION_CLIENT_ERRORS.has(returnedError);
      const storageError = REDEMPTION_STORAGE_ERRORS.has(returnedError)
        ? returnedError
        : "redemption_write_failed";
      if (!clientError) logRequestFailure(req, "redemption_storage_unavailable");
      return errorResponse(clientError ? returnedError : storageError, clientError ? 422 : 503);
    }

    return NextResponse.json(result, { headers: NO_STORE });
  } catch {
    logRequestFailure(req, "redemption_storage_unavailable");
    return errorResponse("redemption_write_failed", 503);
  }
}
