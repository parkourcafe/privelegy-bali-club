import { NextResponse } from "next/server";
import { getSavedSlugs, toggleSavedPlace } from "@/lib/data";
import { readGuestRef, resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const venueSlug = new URL(req.url).searchParams.get("venue")?.trim() ?? "";
  if (!venueSlug || venueSlug.length > 160) {
    return NextResponse.json({ saved: false }, { status: 400 });
  }
  const guestRef = await readGuestRef();
  if (!guestRef) return NextResponse.json({ saved: false });
  const savedSlugs = await getSavedSlugs(guestRef);
  return NextResponse.json(
    { saved: savedSlugs.includes(venueSlug) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

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
