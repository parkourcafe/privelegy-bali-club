import { NextResponse } from "next/server";
import { setGuestSource, logEvent } from "@/lib/data";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Guest arrived via a source QR (?s=villa_01). Bind the source to the anonymous
// guest (first-touch) and log a source_scan. Guest id comes from the cookie.
export async function POST(req: Request) {
  let body: { source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { source } = body;
  if (!source) return NextResponse.json({ ok: false }, { status: 400 });

  const { ref, created } = await resolveGuestRef();
  await setGuestSource(ref, source);
  await logEvent({ type: "source_scan", guestRef: ref, source });

  const res = NextResponse.json({ ok: true });
  if (created) res.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return res;
}
