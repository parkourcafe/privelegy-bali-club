import { NextResponse } from "next/server";
import { checkMobileReadiness, publicReleaseId } from "@/lib/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const result = await checkMobileReadiness();
  return NextResponse.json(
    {
      ok: result.ready,
      status: result.ready ? "ready" : "not_ready",
      reason: result.ready ? undefined : result.reason,
      release: publicReleaseId(),
    },
    {
      status: result.ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
