import { configuredGuestRefSecret } from "./guest-ref-proof";
import { exactReleaseSchemaProbe } from "./release-schema-probe";

export type ReadinessClient = {
  from(table: string): {
    select(columns: string, options: { head: boolean; count: "exact" }): PromiseLike<{
      count: number | null;
      error: { code?: string; message?: string } | null;
    }>;
  };
};

export type ServiceReadinessClient = {
  rpc(name: "release_readiness_v2"): PromiseLike<{
    data: unknown;
    error: { code?: string; message?: string } | null;
  }>;
};

export type ReadinessResult =
  | { ready: true }
  | { ready: false; reason: "not_configured" | "dependency_unavailable" | "timeout" };

export function releaseIdentityConfigured(
  guestRefSigningSecret = process.env.GUEST_REF_SIGNING_SECRET,
): boolean {
  return Boolean(configuredGuestRefSecret(guestRefSigningSecret));
}

function readinessRpcOk(data: unknown): boolean {
  return exactReleaseSchemaProbe(data, 2, "0041");
}

export async function checkReadiness(
  publicClient: ReadinessClient | null,
  serviceClient: ServiceReadinessClient | null,
  identityConfigured: boolean,
  timeoutMs = 3000,
): Promise<ReadinessResult> {
  if (!publicClient || !serviceClient || !identityConfigured) {
    return { ready: false, reason: "not_configured" };
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const check = Promise.all([
      Promise.resolve(
        publicClient.from("districts").select("slug", { head: true, count: "exact" }),
      ),
      Promise.resolve(serviceClient.rpc("release_readiness_v2")),
    ]).then(([publicResult, serviceResult]) => (
      publicResult.error
        || !Number.isInteger(publicResult.count)
        || (publicResult.count ?? 0) <= 0
        || serviceResult.error
        || !readinessRpcOk(serviceResult.data)
        ? ({ ready: false, reason: "dependency_unavailable" } as const)
        : ({ ready: true } as const)
    ));
    const timeout = new Promise<ReadinessResult>((resolve) => {
      timer = setTimeout(() => resolve({ ready: false, reason: "timeout" }), timeoutMs);
    });
    return await Promise.race([check, timeout]);
  } catch {
    return { ready: false, reason: "dependency_unavailable" };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function publicReleaseId(value = process.env.VERCEL_GIT_COMMIT_SHA): string {
  return value && /^[a-f0-9]{7,40}$/i.test(value) ? value.slice(0, 12) : "local";
}
