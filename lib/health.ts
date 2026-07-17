export { publicReleaseId } from "./release-id";

type MobileBackendReadiness =
  | { ready: true }
  | { ready: false; reason: "dependency_unavailable" | "empty_catalog" };

export type MobileReadinessResult =
  | { ready: true }
  | { ready: false; reason: "dependency_unavailable" | "empty_catalog" | "timeout" };

/**
 * Readiness is intentionally tied to the public mobile contract rather than
 * to an unrelated migration number. If the catalogue cannot be loaded, the
 * exact dependency needed by a clean mobile install is not ready.
 */
export async function checkMobileReadiness(
  timeoutMs = 3_000,
  probe?: () => Promise<MobileBackendReadiness>,
): Promise<MobileReadinessResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const effectiveProbe = probe ?? (async () => {
      const service = await import("./mobile-api/service");
      return service.probeMobileBackendReadiness();
    });
    const dependency = effectiveProbe()
      .catch(() => ({ ready: false, reason: "dependency_unavailable" } as const));
    const timeout = new Promise<MobileReadinessResult>((resolve) => {
      timer = setTimeout(() => resolve({ ready: false, reason: "timeout" }), timeoutMs);
    });
    return await Promise.race([dependency, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
