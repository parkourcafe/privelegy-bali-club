import { NextResponse } from "next/server";
import { logEvent } from "@/lib/data";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "landing_open",
  "venue_card_open",
  "perk_open",
  "reservation_click",
  "similar_open",
]);

// Funnel logging from the client (§18). Guest id comes from the cookie; only
// the safe non-proof event types are accepted here.
export async function POST(req: Request) {
  let body: { type?: string; venueSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!body.type || !ALLOWED.has(body.type)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { ref, created } = await resolveGuestRef();
  await logEvent({ type: body.type, guestRef: ref, venueSlug: body.venueSlug });

  const res = NextResponse.json({ ok: true });
  if (created) res.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return res;
}
