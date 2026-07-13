import { NextResponse } from "next/server";
import { recordRedemption } from "@/lib/data";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";
import { verifyRedemptionToken } from "@/lib/redemption-token";
import { currentSiteOrigin } from "@/lib/site-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { venueSlug?: string; consentGranted?: boolean; qrToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const { venueSlug, consentGranted, qrToken } = body;
  const audience = await currentSiteOrigin();
  if (
    !venueSlug ||
    !audience ||
    typeof qrToken !== "string" ||
    !verifyRedemptionToken(
      venueSlug,
      qrToken,
      process.env.REDEMPTION_SIGNING_SECRET,
      audience,
    )
  ) {
    return NextResponse.json({ ok: false, error: "invalid_qr" }, { status: 403 });
  }

  const { ref, created } = await resolveGuestRef();
  const result = await recordRedemption({
    guestRef: ref,
    venueSlug,
    consentGranted: Boolean(consentGranted),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  const res = NextResponse.json(result, { status: result.ok ? 200 : 422 });
  if (created) res.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return res;
}
