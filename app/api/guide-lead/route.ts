import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase/service";
import { readBoundedJson } from "@/lib/api/request";
import { parseGuideLeadRequest } from "@/lib/api/public-post-contracts";
import { interpretGuideLeadRpcResult } from "@/lib/guide-lead-rpc";
import { logRequestFailure } from "@/lib/server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_GUIDE_LEAD_BODY_BYTES = 4 * 1024;
const NO_STORE = { "Cache-Control": "no-store" };

// 48-hours guide lead capture (brief §18). Validates, applies the honeypot,
// then stores via the service-role-only submit_guide_lead SECURITY DEFINER RPC
// (migration 0038). Honest failure modes: without a configured DB or migration
// the API reports stored:false — the client then still shows the web guide
// but NEVER claims anything was saved or sent.

function errorResponse(error: string, status: number) {
  return NextResponse.json(
    { ok: false, error },
    { status, headers: NO_STORE },
  );
}

function acceptedResponse() {
  // Stored, duplicate, rate-limited and honeypot submissions are deliberately
  // indistinguishable so this public endpoint cannot enumerate contact data.
  return NextResponse.json(
    { ok: true, accepted: true },
    { status: 202, headers: NO_STORE },
  );
}

export async function POST(req: Request) {
  const body = await readBoundedJson(req, MAX_GUIDE_LEAD_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }
  const parsed = parseGuideLeadRequest(body.value);
  if (!parsed) return errorResponse("invalid_request", 400);

  // Honeypot: pretend success to the bot, store nothing.
  if (parsed.spam) {
    return acceptedResponse();
  }

  const lead = parsed.value;
  if (!lead.consent) return errorResponse("consent_required", 400);

  const sb = serviceClient();
  if (!sb) {
    // No DB configured: be honest — the guide is still readable on the page.
    logRequestFailure(req, "guide_lead_storage_unavailable");
    return errorResponse("lead_storage_unconfigured", 503);
  }

  try {
    const { data, error } = await sb.rpc("submit_guide_lead", {
      p_first_name: lead.firstName,
      p_channel: lead.channel,
      p_email: lead.email,
      p_whatsapp: lead.whatsapp,
      p_travel_date: lead.travelDate,
      p_interests: lead.interests,
      p_language: lead.language,
      p_source: lead.source,
      p_utm: lead.utm,
      p_consent: true,
      p_user_agent: req.headers.get("user-agent")?.substring(0, 400) ?? null,
    });

    if (error) {
      logRequestFailure(req, "guide_lead_storage_unavailable");
      return errorResponse("lead_write_failed", 503);
    }
    const result = interpretGuideLeadRpcResult(data);
    if (result.status === "stored" || result.status === "rate_limited") {
      return acceptedResponse();
    }
    return errorResponse("lead_write_failed", 503);
  } catch {
    logRequestFailure(req, "guide_lead_storage_unavailable");
    return errorResponse("lead_write_failed", 503);
  }
}
