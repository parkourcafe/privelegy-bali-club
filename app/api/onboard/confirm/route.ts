import { NextResponse } from "next/server";
import { confirmOnboarding } from "@/lib/data";
import { readBoundedJson } from "@/lib/api/request";
import { parseConfirmOnboardingRequest } from "@/lib/api/public-post-contracts";
import { logRequestFailure } from "@/lib/server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_CONFIRM_BODY_BYTES = 1024;
const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

export async function POST(req: Request) {
  const body = await readBoundedJson(req, MAX_CONFIRM_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }
  const parsed = parseConfirmOnboardingRequest(body.value);
  if (!parsed) return errorResponse("invalid_request", 400);
  if (!parsed.agreed) return errorResponse("agreement_required", 422);

  try {
    const result = await confirmOnboarding({
      token: parsed.token,
      name: parsed.name,
      agreed: parsed.agreed,
      userAgent: req.headers.get("user-agent") ?? "",
    });
    if (result.ok) return NextResponse.json({ ok: true }, { headers: NO_STORE });

    if (result.error === "bad_token" || result.error === "agreement_required") {
      return errorResponse(result.error, 422);
    }
    logRequestFailure(req, "onboarding_confirmation_unavailable");
    const error = result.error === "unconfigured" ? "confirmation_unavailable" : "confirmation_failed";
    return errorResponse(error, 503);
  } catch {
    logRequestFailure(req, "onboarding_confirmation_unavailable");
    return errorResponse("confirmation_failed", 503);
  }
}
