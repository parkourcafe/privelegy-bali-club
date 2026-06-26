import { logEvent } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set(["landing_open", "venue_card_open", "perk_open"]);

// Funnel logging from the client (§18). Only the safe, non-proof event types are
// accepted here; redemption itself is written server-side in record_redemption.
export async function POST(req: Request) {
  let body: { type?: string; guestRef?: string; venueSlug?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (!body.type || !ALLOWED.has(body.type)) {
    return Response.json({ ok: false }, { status: 400 });
  }
  await logEvent({
    type: body.type,
    guestRef: body.guestRef,
    venueSlug: body.venueSlug,
    source: body.source,
  });
  return Response.json({ ok: true });
}
