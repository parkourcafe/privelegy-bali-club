import { NextResponse } from "next/server";
import {
  GUEST_PROOF_COOKIE,
  guestCookieOptions,
  resolveGuestRefAccess,
} from "@/lib/guest-server";
import {
  emptyGuestDataExport,
  exportGuestData,
} from "@/lib/privacy/server-rpc";
import { serviceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function exportResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Disposition": "attachment; filename=other-bali-data.json",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET() {
  const client = serviceClient();
  const access = await resolveGuestRefAccess();
  if (access.status === "absent") return exportResponse(emptyGuestDataExport());
  if (access.status === "legacy") {
    return exportResponse({ ok: false, error: "legacy_identity_migration_required" }, 409);
  }
  if (access.status === "invalid") {
    return exportResponse({ ok: false, error: "guest_identity_proof_invalid" }, 409);
  }
  if (access.status !== "verified" || !client) {
    return exportResponse({ ok: false, error: "temporarily_unavailable" }, 503);
  }
  const exported = await exportGuestData(client, access.ref);
  if (!exported) {
    return exportResponse({ ok: false, error: "temporarily_unavailable" }, 503);
  }
  const response = exportResponse(exported);
  if (access.refreshedProof) {
    response.cookies.set(GUEST_PROOF_COOKIE, access.refreshedProof, guestCookieOptions());
  }
  return response;
}
