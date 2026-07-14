import { NextResponse } from "next/server";
import {
  ANALYTICS_CONSENT_VERSION,
  CONSENT_COOKIE,
  consentCookieOptions,
  parseConsentRequest,
} from "@/lib/privacy/consent";
import { readBoundedJson } from "@/lib/api/request";
import { readGuestRef } from "@/lib/guest-server";
import { recordGuestConsent } from "@/lib/privacy/server-rpc";
import { serviceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_CONSENT_BODY_BYTES = 128;
const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

export async function POST(req: Request) {
  const body = await readBoundedJson(req, MAX_CONSENT_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }
  const state = parseConsentRequest(body.value);
  if (!state) return errorResponse("invalid_consent_request", 422);

  const existingRef = await readGuestRef();
  if (state === "analytics_allowed" && !existingRef) {
    return errorResponse("guest_identity_required", 409);
  }
  const identity = { ref: existingRef };
  const client = serviceClient();

  // Opt-in fails closed: no analytics cookie or new GuestRef is committed
  // unless append-only server consent evidence was written successfully.
  if (state === "analytics_allowed") {
    if (!client || !identity.ref || !await recordGuestConsent(client, {
      state,
      version: ANALYTICS_CONSENT_VERSION,
      guestRef: identity.ref,
      userAgent: req.headers.get("user-agent"),
    })) {
      return errorResponse("consent_backend_unavailable", 503);
    }
  } else if (client && identity.ref) {
    // Opt-out is fail-safe. Even if the evidence write fails, setting the
    // essential-only cookie immediately stops browser and first-party events.
    await recordGuestConsent(client, {
      state,
      version: ANALYTICS_CONSENT_VERSION,
      guestRef: identity.ref,
      userAgent: req.headers.get("user-agent"),
    });
  }

  const response = NextResponse.json(
    { ok: true, state, consentVersion: ANALYTICS_CONSENT_VERSION },
    { headers: NO_STORE },
  );
  response.cookies.set(CONSENT_COOKIE, state, consentCookieOptions());
  return response;
}
