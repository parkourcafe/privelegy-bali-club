import { setGuestSource, logEvent } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called when a guest arrives via a source QR (villa/coliving/Reels): we attach
// the source to the anonymous guest (first-touch) and log a source_scan event.
export async function POST(req: Request) {
  let body: { guestRef?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const { guestRef, source } = body;
  if (!guestRef || !source) return Response.json({ ok: false }, { status: 400 });

  await setGuestSource(guestRef, source);
  await logEvent({ type: "source_scan", guestRef, source });
  return Response.json({ ok: true });
}
