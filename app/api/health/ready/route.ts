import { NextResponse } from "next/server";
import { anonClient } from "@/lib/supabase/server";
import { serviceClient } from "@/lib/supabase/service";
import {
  checkReadiness,
  publicReleaseId,
  releaseIdentityConfigured,
  type ReadinessClient,
  type ServiceReadinessClient,
} from "@/lib/health";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await checkReadiness(
    anonClient() as ReadinessClient | null,
    serviceClient() as ServiceReadinessClient | null,
    releaseIdentityConfigured(),
  );
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
