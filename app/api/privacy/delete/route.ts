import { NextResponse } from "next/server";
import {
  GUEST_COOKIE,
  GUEST_PROOF_COOKIE,
  guestCookieOptions,
  resolveGuestRefAccess,
} from "@/lib/guest-server";
import {
  CONSENT_COOKIE,
  consentCookieOptions,
} from "@/lib/privacy/consent";
import { deleteGuestData } from "@/lib/privacy/server-rpc";
import { serviceClient } from "@/lib/supabase/service";
import { isTrustedSameOriginMutation } from "@/lib/same-origin-mutation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store" };

function completedResponse() {
  const response = NextResponse.json(
    { ok: true, status: "completed" },
    { headers: NO_STORE },
  );
  response.cookies.set(GUEST_COOKIE, "", { ...guestCookieOptions(), maxAge: 0 });
  response.cookies.set(GUEST_PROOF_COOKIE, "", { ...guestCookieOptions(), maxAge: 0 });
  response.cookies.set(CONSENT_COOKIE, "", { ...consentCookieOptions(), maxAge: 0 });
  return response;
}

export async function POST(req: Request) {
  if (!isTrustedSameOriginMutation(req)) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403, headers: NO_STORE },
    );
  }
  const client = serviceClient();
  const access = await resolveGuestRefAccess();
  if (access.status === "absent") return completedResponse();
  if (access.status === "legacy") {
    const response = NextResponse.json(
      { ok: false, error: "legacy_identity_migration_required" },
      { status: 409, headers: NO_STORE },
    );
    response.cookies.set(CONSENT_COOKIE, "essential_only", consentCookieOptions());
    return response;
  }
  if (access.status === "invalid") {
    const response = NextResponse.json(
      { ok: false, error: "guest_identity_proof_invalid" },
      { status: 409, headers: NO_STORE },
    );
    response.cookies.set(CONSENT_COOKIE, "essential_only", consentCookieOptions());
    return response;
  }
  if (access.status !== "verified" || !client || !await deleteGuestData(client, access.ref)) {
    // Stop analytics immediately, but retain GuestRef so the user can retry
    // deletion instead of losing the only link to server-side data.
    const response = NextResponse.json(
      { ok: false, error: "temporarily_unavailable" },
      { status: 503, headers: NO_STORE },
    );
    response.cookies.set(CONSENT_COOKIE, "essential_only", consentCookieOptions());
    return response;
  }
  return completedResponse();
}
