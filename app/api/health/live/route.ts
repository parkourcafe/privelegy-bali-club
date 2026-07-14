import { NextResponse } from "next/server";
import { publicReleaseId } from "@/lib/health";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { ok: true, status: "live", release: publicReleaseId() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
