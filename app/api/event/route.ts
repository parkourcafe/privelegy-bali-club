import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseEventRequest } from "@/lib/actions/event-safety";
import { asEventRpcClient } from "@/lib/actions/event-compat";
import { storeEvent } from "@/lib/actions/event-store";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";
import { getGuestSource } from "@/lib/data";
import { serviceClient } from "@/lib/supabase/service";
import { CONSENT_COOKIE } from "@/lib/consent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Funnel logging from the client (§18). Guest id comes from the cookie; only
// allowlisted, runtime-validated event shapes are accepted here.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = parseEventRequest(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Analytics is opt-in (audit 2026-07). Without explicit consent we neither
  // mint a guest reference nor log the event — no analytics identity before
  // consent. Server-side guard so a bypassed client still can't write. The
  // functional paths (/api/source, /api/redeem) are deliberately not gated here.
  const consent = (await cookies()).get(CONSENT_COOKIE)?.value;
  if (consent !== "granted") {
    return NextResponse.json({ ok: true, skipped: "no-consent" });
  }

  const { ref, created } = await resolveGuestRef();
  const sb = serviceClient();
  if (sb) {
    // Stamp the guest's first-touch acquisition source onto the event so a
    // source breakdown reads directly off the events table (P0-1). A brand-new
    // guest has no bound source yet; downstream events pick it up once
    // /api/source has run.
    const source = created ? null : await getGuestSource(ref);
    await storeEvent(asEventRpcClient(sb), {
      type: parsed.event.type,
      guestRef: ref,
      venueSlug: parsed.event.venueSlug,
      payload: parsed.event.payload,
      source,
    });
  }

  const res = NextResponse.json({ ok: true });
  if (created) res.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return res;
}
