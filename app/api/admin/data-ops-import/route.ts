import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

import candidatePackage from "@/data/data-ops/compiled/candidates.json";
import { timingSafeSecretEqual } from "@/lib/admin-auth";
import { serviceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCTION_PROJECT_REF = "egkdapqwkfprtyqvvnso";
const PACKAGE_DIGEST = "ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081";

function canonicalJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalJsonValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([key, nested]) => [key, canonicalJsonValue(nested)]),
    );
  }
  return value;
}

function recomputePackageDigest(): string {
  const payload = structuredClone(candidatePackage) as Record<string, unknown>;
  delete payload.packageDigest;
  return createHash("sha256")
    .update(JSON.stringify(canonicalJsonValue(payload)))
    .digest("hex");
}

function response(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

function isExactProductionEnvironment(): boolean {
  if (process.env.VERCEL_ENV !== "production") return false;
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
    return url.protocol === "https:"
      && url.hostname === `${PRODUCTION_PROJECT_REF}.supabase.co`;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isExactProductionEnvironment()) return response({ ok: false }, 404);

  const expectedToken = process.env.DATA_OPS_IMPORT_TOKEN?.trim();
  const providedToken = request.headers.get("x-other-bali-import-token")?.trim();
  if (
    !expectedToken
    || expectedToken.length < 48
    || !providedToken
    || !timingSafeSecretEqual(providedToken, expectedToken)
  ) {
    return response({ ok: false, error: "unauthorized" }, 401);
  }

  if (
    request.headers.get("x-other-bali-package-digest") !== PACKAGE_DIGEST
    || candidatePackage.packageDigest !== PACKAGE_DIGEST
    || recomputePackageDigest() !== PACKAGE_DIGEST
  ) {
    return response({ ok: false, error: "package_mismatch" }, 409);
  }

  const client = serviceClient();
  if (!client) return response({ ok: false, error: "unavailable" }, 503);

  const { data, error } = await client.rpc("import_data_ops_package", {
    p_package: candidatePackage,
  });
  if (error) return response({ ok: false, error: "import_failed" }, 503);

  const result = data && typeof data === "object"
    ? data as Record<string, unknown>
    : null;
  if (!result || result.ok !== true || result.packageDigest !== PACKAGE_DIGEST) {
    return response({ ok: false, error: "import_rejected" }, 422);
  }

  return response({
    ok: true,
    alreadyImported: result.alreadyImported === true,
    packageDigest: result.packageDigest,
    menus: result.menus,
    sections: result.sections,
    items: result.items,
    capabilities: result.capabilities,
    venueMapsNotApplied: result.venueMapsNotApplied,
  }, 200);
}
