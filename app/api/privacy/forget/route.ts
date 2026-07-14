import { NextResponse } from "next/server";
import { readGuestRef, GUEST_COOKIE } from "@/lib/guest-server";
import { CONSENT_COOKIE } from "@/lib/consent";
import { forgetGuest } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// "Forget this device" from /privacy/choices (audit 2026-07). Erases the
// device's behavioural + preference data server-side (best-effort; see
// lib/data.forgetGuest) and unlinks the device now by dropping the functional
// guest reference and resetting the analytics choice to undecided.
export async function POST() {
  const ref = await readGuestRef();
  if (ref) await forgetGuest(ref);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(GUEST_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(CONSENT_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
