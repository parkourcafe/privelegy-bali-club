import { NextResponse } from "next/server";
import {
  GUEST_COOKIE,
  GUEST_PROOF_COOKIE,
  guestCookieOptions,
  resolveGuestRefAccess,
  resolveGuestRef,
} from "@/lib/guest-server";
import { isTrustedSameOriginMutation } from "@/lib/same-origin-mutation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store" };

// This is the sole GuestRef minting boundary. It creates only the httpOnly
// functional cookie; no database identity or analytics record is written.
export async function POST(req: Request) {
  if (!isTrustedSameOriginMutation(req)) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403, headers: NO_STORE },
    );
  }
  try {
    const access = await resolveGuestRefAccess();
    if (access.status === "invalid") {
      // Keep the cookies intact: this may be a key-rotation configuration
      // error, and silently overwriting would orphan existing user data.
      return NextResponse.json(
        { ok: false, error: "guest_identity_proof_invalid" },
        { status: 409, headers: NO_STORE },
      );
    }
    if (access.status === "legacy") {
      return NextResponse.json(
        { ok: false, error: "legacy_identity_migration_required" },
        { status: 409, headers: NO_STORE },
      );
    }
    if (access.status === "unavailable") throw new Error("identity_check_unavailable");
    if (access.status === "verified") {
      const response = NextResponse.json({ ok: true }, { headers: NO_STORE });
      if (access.refreshedProof) {
        response.cookies.set(GUEST_PROOF_COOKIE, access.refreshedProof, guestCookieOptions());
      }
      return response;
    }
    const { ref, proof, created } = await resolveGuestRef();
    const response = NextResponse.json({ ok: true }, { headers: NO_STORE });
    if (proof) {
      if (created) response.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
      response.cookies.set(GUEST_PROOF_COOKIE, proof, guestCookieOptions());
    }
    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "guest_identity_unavailable" },
      { status: 503, headers: NO_STORE },
    );
  }
}
