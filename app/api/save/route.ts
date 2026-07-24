import { NextResponse } from "next/server";
import { getSavedSlugs, getVenueWithPerk, isPublicReadyVenue, setSavedPlace } from "@/lib/data";
import { readGuestRef, resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";
import { normalizeVenueSlug } from "@/lib/trip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const venueSlug = normalizeVenueSlug(new URL(req.url).searchParams.get("venue"));
  if (!venueSlug) {
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

// Desired-state writes are idempotent, so a retry cannot invert the saved state.
export async function POST(req: Request) {
  let body: { venueSlug?: unknown; saved?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const venueSlug = normalizeVenueSlug(body.venueSlug);
  if (!venueSlug || typeof body.saved !== "boolean") {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (body.saved) {
    const venue = await getVenueWithPerk(venueSlug);
    if (!venue || !isPublicReadyVenue(venue)) {
      return NextResponse.json({ ok: false, saved: false, error: "venue_unavailable" }, { status: 404 });
    }
  }

  const { ref, created } = await resolveGuestRef();
  const result = await setSavedPlace(ref, venueSlug, body.saved);

  const status = result.ok ? 200 : result.error === "venue_unavailable" ? 404 : 503;
  const res = NextResponse.json(result, { status });
  if (created) res.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return res;
}
