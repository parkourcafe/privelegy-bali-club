import { NextResponse } from "next/server";
import { logDishFeedback } from "@/lib/data";
import { readGuestRef } from "@/lib/guest-server";
import { readBoundedJson } from "@/lib/api/request";
import { parseDishFeedback } from "@/lib/actions/dish-feedback";
import { logRequestFailure } from "@/lib/server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DISH_BODY_BYTES = 1024;
const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

// Dish feedback after a redemption (§18). Guest id from cookie.
export async function POST(req: Request) {
  const body = await readBoundedJson(req, MAX_DISH_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }
  const feedback = parseDishFeedback(body.value);
  if (!feedback) return errorResponse("invalid_feedback", 400);

  // Feedback is available only after a redemption has already created the
  // essential GuestRef. A direct API call must never mint analytics identity.
  const guestRef = await readGuestRef();
  if (!guestRef) return errorResponse("redemption_required", 403);
  const stored = await logDishFeedback({ guestRef, ...feedback });
  if (!stored) {
    logRequestFailure(req, "dish_feedback_unavailable");
    return errorResponse("temporarily_unavailable", 503);
  }
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}
