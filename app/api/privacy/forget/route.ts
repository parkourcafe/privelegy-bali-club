import { NextResponse } from "next/server";
import {
  GUEST_COOKIE,
  resolveExistingGuestRef,
  type ExistingGuestRefResolution,
} from "@/lib/guest-server";
import { CONSENT_COOKIE } from "@/lib/consent";
import {
  RETAINED_PRIVACY_RECORDS,
  eraseGuestData,
  type GuestErasureResult,
} from "@/lib/mobile-privacy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GuestResolver = () => Promise<ExistingGuestRefResolution>;
type GuestEraser = (guestRef: string) => Promise<GuestErasureResult>;

// "Forget this device" from /privacy/choices. Erases legacy website state and
// all v1.2 mobile/cloud state tied to the current browser guest. Retained
// redemption proof and its supporting consent evidence are disclosed rather
// than silently deleted.
export function createWebPrivacyForgetHandler(
  resolveGuest: GuestResolver = () => resolveExistingGuestRef(),
  eraseGuest: GuestEraser = eraseGuestData,
) {
  return async function webPrivacyForget() {
    let guest: ExistingGuestRefResolution;
    try {
      guest = await resolveGuest();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "temporarily_unavailable",
            message: "The privacy service is temporarily unavailable.",
          },
        },
        { status: 503, headers: { "Cache-Control": "private, no-store" } },
      );
    }

    if (guest.ref) {
      let result: GuestErasureResult;
      try {
        result = await eraseGuest(guest.ref);
      } catch {
        result = {
          ok: false,
          deleted: false,
          retainedRedemptions: 0,
          retainedConsents: 0,
          error: "privacy_store_unavailable",
        };
      }
      if (!result.ok) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: result.error === "invalid_guest"
                ? "invalid_request"
                : "temporarily_unavailable",
              message: "Deletion could not be confirmed. Please try again.",
            },
          },
          {
            status: result.error === "invalid_guest" ? 400 : 503,
            headers: { "Cache-Control": "private, no-store" },
          },
        );
      }
      const response = NextResponse.json(
        {
          ok: true,
          deleted: true,
          retained: {
            scope: RETAINED_PRIVACY_RECORDS,
            redemptionRecords: result.retainedRedemptions,
            correspondingConsentRecords: result.retainedConsents,
          },
        },
        { headers: { "Cache-Control": "private, no-store" } },
      );
      response.cookies.set(GUEST_COOKIE, "", { path: "/", maxAge: 0 });
      response.cookies.set(CONSENT_COOKIE, "", { path: "/", maxAge: 0 });
      return response;
    }

    const response = NextResponse.json(
      {
        ok: true,
        deleted: false,
        retained: {
          scope: RETAINED_PRIVACY_RECORDS,
          redemptionRecords: 0,
          correspondingConsentRecords: 0,
        },
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
    response.cookies.set(GUEST_COOKIE, "", { path: "/", maxAge: 0 });
    response.cookies.set(CONSENT_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  };
}

export const POST = createWebPrivacyForgetHandler();
