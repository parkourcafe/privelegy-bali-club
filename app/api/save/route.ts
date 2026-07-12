import { NextResponse } from "next/server";
import { toggleSavedPlace } from "@/lib/data";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Toggle a saved place (master §6c, Rung 1). Anonymous — guest id from the
// httpOnly cookie; no login, no PII, no localStorage (guardrail #10).
export async function POST(req: Request) {
  let body: { venueSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!body.venueSlug) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { ref, created } = await resolveGuestRef();
  const result = await toggleSavedPlace(ref, body.venueSlug);

  const res = NextResponse.json(result);
  if (created) res.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return res;
}
