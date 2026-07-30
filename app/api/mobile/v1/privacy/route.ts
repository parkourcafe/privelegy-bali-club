import { NextResponse } from "next/server";
import {
  GUEST_COOKIE,
  MOBILE_GUEST_HEADER,
  resolveMobilePrivacyGuestRef,
  type ExistingGuestRefResolution,
} from "@/lib/guest-server";
import {
  RETAINED_PRIVACY_RECORDS,
  eraseGuestData,
  type GuestErasureResult,
} from "@/lib/mobile-privacy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MOBILE_ORIGINS = new Set([
  "capacitor://localhost",
  "http://localhost",
  "https://localhost",
]);

type GuestResolver = (request: Request) => Promise<ExistingGuestRefResolution>;
type GuestEraser = (guestRef: string) => Promise<GuestErasureResult>;

function allowedOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  return origin && MOBILE_ORIGINS.has(origin) ? origin : null;
}

function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

function errorResponse(
  origin: string,
  status: number,
  code: "invalid_request" | "origin_not_allowed" | "temporarily_unavailable",
  message: string,
) {
  return NextResponse.json(
    { ok: false, error: { code, message } },
    {
      status,
      headers: {
        ...corsHeaders(origin),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export function createMobilePrivacyDeleteHandler(
  resolveGuest: GuestResolver = resolveMobilePrivacyGuestRef,
  eraseGuest: GuestEraser = eraseGuestData,
) {
  return async function mobilePrivacyDelete(request: Request) {
    const origin = allowedOrigin(request);
    if (!origin) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "origin_not_allowed",
            message: "This privacy action is available only from the Other Bali mobile app.",
          },
        },
        {
          status: 403,
          headers: {
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
            Vary: "Origin",
          },
        },
      );
    }

    let guest: ExistingGuestRefResolution;
    try {
      guest = await resolveGuest(request);
    } catch {
      return errorResponse(
        origin,
        503,
        "temporarily_unavailable",
        "The privacy service is temporarily unavailable.",
      );
    }
    if (guest.invalid || !guest.ref) {
      return errorResponse(
        origin,
        400,
        "invalid_request",
        `A valid ${MOBILE_GUEST_HEADER} header is required.`,
      );
    }

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
      const invalid = result.error === "invalid_guest";
      return errorResponse(
        origin,
        invalid ? 400 : 503,
        invalid ? "invalid_request" : "temporarily_unavailable",
        invalid
          ? "The pseudonymous guest reference is invalid."
          : "Deletion could not be confirmed. No success has been recorded.",
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
      {
        status: 200,
        headers: {
          ...corsHeaders(origin),
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
    response.cookies.set(GUEST_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  };
}

export const DELETE = createMobilePrivacyDeleteHandler();

export function OPTIONS(request: Request) {
  const origin = allowedOrigin(request);
  return new Response(null, {
    status: origin ? 204 : 403,
    headers: origin
      ? {
          ...corsHeaders(origin),
          "Access-Control-Allow-Headers": [
            "Content-Type",
            MOBILE_GUEST_HEADER,
            "X-Other-Bali-Mobile-Shell",
          ].join(", "),
          "Access-Control-Allow-Methods": "DELETE, OPTIONS",
          "Cache-Control": "public, max-age=86400",
          "X-Content-Type-Options": "nosniff",
        }
      : {
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
          Vary: "Origin",
        },
  });
}
