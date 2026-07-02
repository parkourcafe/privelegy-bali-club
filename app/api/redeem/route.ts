import { NextResponse } from "next/server";
import { recordRedemption } from "@/lib/data";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { venueSlug?: string; consentGranted?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const { venueSlug, consentGranted } = body;
  if (!venueSlug) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
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
