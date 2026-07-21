import { NextResponse } from "next/server";
import { addTripPlace, getSavedTrip, getVenueWithPerk, isPublicReadyVenue, moveTripPlace, reorderTripPlace, setSavedPlace } from "@/lib/data";
import { GUEST_COOKIE, guestCookieOptions, readGuestRef, resolveGuestRef } from "@/lib/guest-server";
import { normalizeTripDay, normalizeVenueSlug } from "@/lib/trip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function isPublicVenue(venueSlug: string): Promise<boolean> {
  const venue = await getVenueWithPerk(venueSlug);
  return Boolean(venue && isPublicReadyVenue(venue));
}

export async function GET() {
  const ref = await readGuestRef();
  return NextResponse.json(
    { entries: await getSavedTrip(ref) },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function PUT(req: Request) {
  let body: { venueSlug?: unknown; day?: unknown };
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const venueSlug = normalizeVenueSlug(body.venueSlug);
  const day = normalizeTripDay(body.day);
  if (!venueSlug || day == null) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (!(await isPublicVenue(venueSlug))) {
    return NextResponse.json({ ok: false, error: "venue_unavailable" }, { status: 404 });
  }
  const { ref, created } = await resolveGuestRef();
  const result = await addTripPlace(ref, venueSlug, day);
  const response = NextResponse.json(result, { status: result.ok ? 200 : 422 });
  if (created) response.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return response;
}

export async function PATCH(req: Request) {
  let body: { venueSlug?: unknown; action?: unknown; day?: unknown };
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const venueSlug = normalizeVenueSlug(body.venueSlug);
  if (!venueSlug) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const ref = await readGuestRef();
  if (!ref) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  if (body.action === "up" || body.action === "down") {
    const result = await reorderTripPlace(ref, venueSlug, body.action);
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  }
  if (body.action === "move-day") {
    const day = normalizeTripDay(body.day);
    if (day == null) {
      return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    }
    if (!(await isPublicVenue(venueSlug))) {
      return NextResponse.json({ ok: false, error: "venue_unavailable" }, { status: 404 });
    }
    const result = await moveTripPlace(ref, venueSlug, day);
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  }
  return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
}

export async function DELETE(req: Request) {
  let body: { venueSlug?: unknown };
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const venueSlug = normalizeVenueSlug(body.venueSlug);
  if (!venueSlug) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const ref = await readGuestRef();
  if (!ref) return NextResponse.json({ ok: true, saved: false });
  const result = await setSavedPlace(ref, venueSlug, false);
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
