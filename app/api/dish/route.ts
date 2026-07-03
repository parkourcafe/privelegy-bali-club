import { NextResponse } from "next/server";
import { logDishFeedback } from "@/lib/data";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERDICTS = new Set(["worth_it", "meh"]);

// Dish feedback after a redemption (§18). Guest id from cookie.
export async function POST(req: Request) {
  let body: { venueSlug?: string; dish?: string; verdict?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!body.venueSlug || !body.verdict || !VERDICTS.has(body.verdict)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { ref, created } = await resolveGuestRef();
  await logDishFeedback({
    guestRef: ref,
    venueSlug: body.venueSlug,
    dish: (body.dish ?? "").slice(0, 120),
    verdict: body.verdict,
  });

  const res = NextResponse.json({ ok: true });
  if (created) res.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return res;
}
