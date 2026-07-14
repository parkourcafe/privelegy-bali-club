import { NextResponse } from "next/server";

import { readBoundedJson } from "@/lib/api/request";
import { parseOnboardDraftRequest } from "@/lib/api/public-post-contracts";
import { logRequestFailure } from "@/lib/server-log";
import { exactReleaseSchemaProbe } from "@/lib/release-schema-probe";
import { serviceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_DRAFT_BODY_BYTES = 16 * 1024;
const DRAFT_TTL_MS = 60 * 24 * 60 * 60 * 1000;
const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

export async function POST(request: Request) {
  const body = await readBoundedJson(request, MAX_DRAFT_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }
  const parsed = parseOnboardDraftRequest(body.value);
  if (!parsed) return errorResponse("invalid_request", 400);

  const client = serviceClient();
  if (!client) {
    logRequestFailure(request, "onboarding_draft_unavailable");
    return errorResponse("draft_unavailable", 503);
  }

  try {
    const schema = await client.rpc("release_readiness_v1");
    if (schema.error || !exactReleaseSchemaProbe(schema.data, 1, "0040")) {
      logRequestFailure(request, "onboarding_draft_unavailable");
      return errorResponse("draft_unavailable", 503);
    }
    const capturedAt = new Date();
    const expiresAt = new Date(capturedAt.getTime() + DRAFT_TTL_MS);
    if (parsed.draftType === "menu") {
      const { data: draft, error: draftError } = await client.rpc("create_partner_menu_draft", {
        p_token: parsed.token,
        p_title: parsed.title,
        p_source_url: parsed.sourceUrl,
        p_source_label: "Venue-provided menu",
        p_section_name: parsed.section,
        p_item_name: parsed.itemName,
        p_price_minor: parsed.priceMinor,
        p_currency: parsed.priceMinor === null ? null : "IDR",
        p_captured_at: capturedAt.toISOString(),
        p_expires_at: expiresAt.toISOString(),
      });
      if (draftError) {
        logRequestFailure(request, "onboarding_draft_unavailable");
        return errorResponse("draft_unavailable", 503);
      }
      const menuId = draft && typeof draft === "object" && "menu_id" in draft
        ? String(draft.menu_id)
        : "";
      if (!menuId) return errorResponse("draft_rejected", 422);
      return NextResponse.json(
        { ok: true, status: "pending_review" },
        { headers: NO_STORE },
      );
    }

    const { data, error } = await client.rpc("create_partner_action_draft", {
      p_token: parsed.token,
      p_kind: parsed.kind,
      p_provider: parsed.provider,
      p_url: parsed.url,
      p_label: null,
      p_priority: 100,
      p_confirmation_required: ["reserve", "preorder"].includes(parsed.kind),
      p_source_url: parsed.url,
      p_source_label: "Venue-provided official link",
      p_captured_at: capturedAt.toISOString(),
      p_expires_at: expiresAt.toISOString(),
    });
    if (error) {
      logRequestFailure(request, "onboarding_draft_unavailable");
      return errorResponse("draft_unavailable", 503);
    }
    const ok = data && typeof data === "object" && "ok" in data
      ? data.ok === true
      : data === true;
    return ok
      ? NextResponse.json(
          { ok: true, status: "pending_review" },
          { headers: NO_STORE },
        )
      : errorResponse("draft_rejected", 422);
  } catch {
    logRequestFailure(request, "onboarding_draft_unavailable");
    return errorResponse("draft_unavailable", 503);
  }
}
