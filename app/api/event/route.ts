import { NextResponse } from "next/server";
import { logEvent } from "@/lib/data";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "landing_open",
  "venue_card_open",
  "perk_open",
  "direction_click",
  "reservation_click",
  "similar_open",
  // Bali-wide planning layer: map-open on a planning_only area card. The slug
  // carried in venueSlug is a district slug (events.venue_slug has no FK and
  // Phase 0 stats join venues by slug, so these stay growth-only signals).
  "district_open",
  // Uluwatu district-product launch (2026-07): editorial/growth events only —
  // none of these ever enter partner-proof or the Phase 0 money gate.
  // District/editorial page views carry a page slug in venueSlug.
  "district_page_view",
  "editorial_page_view",
  "venue_detail_view",
  "venue_card_click",
  // Outbound commercial clicks on verified official links (no fee loop —
  // booking_click is an official-site/booking-page handoff, NOT TablePilot).
  "booking_click",
  "official_website_click",
  "instagram_click",
  "menu_click",
  "partner_offer_click",
  // 48-hours guide lead magnet funnel.
  "guide_form_started",
  "guide_form_submitted",
  "whatsapp_guide_click",
  "internal_guide_click",
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
