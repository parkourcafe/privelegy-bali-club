import { NextResponse } from "next/server";
import { parseEventRequest } from "@/lib/actions/event-safety";
import { asEventRpcClient } from "@/lib/actions/event-compat";
import { storeEvent } from "@/lib/actions/event-store";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";
import { serviceClient } from "@/lib/supabase/service";

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

  const { ref, created } = await resolveGuestRef();
  const sb = serviceClient();
  if (sb) {
    await storeEvent(asEventRpcClient(sb), {
      type: parsed.event.type,
      guestRef: ref,
      venueSlug: parsed.event.venueSlug,
      payload: parsed.event.payload,
    });
  }

  const res = NextResponse.json({ ok: true });
  if (created) res.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return res;
}
