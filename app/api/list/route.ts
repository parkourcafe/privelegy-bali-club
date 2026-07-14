import { NextResponse } from "next/server";
import { createSharedList, getSavedSlugs } from "@/lib/data";
import { readGuestRef } from "@/lib/guest-server";
import { readBoundedJson } from "@/lib/api/request";
import { parseSharedListRequest } from "@/lib/api/public-post-contracts";
import { logRequestFailure } from "@/lib/server-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_LIST_BODY_BYTES = 32 * 1024;
const MAX_SHARED_LIST_VENUES = 50;
const NO_STORE = { "Cache-Control": "no-store" };

function errorResponse(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status, headers: NO_STORE });
}

// Create a read-only shareable list (master §6c, Rung 2). No identity is needed
// to open it later. Uses the given slugs, or the guest's own saved list.
export async function POST(req: Request) {
  const body = await readBoundedJson(req, MAX_LIST_BODY_BYTES);
  if (!body.ok) {
    const status = body.error === "payload_too_large"
      ? 413
      : body.error === "invalid_content_type"
        ? 415
        : 400;
    return errorResponse(body.error, status);
  }
  const parsed = parseSharedListRequest(body.value);
  if (!parsed) return errorResponse("invalid_request", 400);

  try {
    const ref = await readGuestRef();
    if (!ref) return errorResponse("guest_identity_required", 409);
    const slugs = parsed.slugs?.length ? parsed.slugs : await getSavedSlugs(ref);
    if (slugs.length === 0) return errorResponse("empty_list", 422);
    if (slugs.length > MAX_SHARED_LIST_VENUES) {
      return errorResponse("list_too_large", 422);
    }

    const id = await createSharedList(ref, slugs);
    if (!id) {
      logRequestFailure(req, "public_list_unavailable");
      return errorResponse("list_unavailable", 503);
    }

    return NextResponse.json({ ok: true, id }, { headers: NO_STORE });
  } catch {
    logRequestFailure(req, "public_list_unavailable");
    return errorResponse("list_unavailable", 503);
  }
}
