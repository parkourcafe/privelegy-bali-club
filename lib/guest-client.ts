"use client";

const LOCK_NAME = "otherbali-guest-identity-v1";
const TASK_TIMEOUT_MS = 60_000;

type LockManagerLike = {
  request<T>(
    name: string,
    options: { mode: "exclusive" },
    callback: () => Promise<T>,
  ): Promise<T>;
};

async function runBounded<T>(
  task: (signal: AbortSignal) => Promise<T>,
  bootstrapIdentity: boolean,
): Promise<T> {
  const controller = new AbortController();
  const timer = window.setTimeout(
    () => controller.abort(new Error("identity_action_timeout")),
    TASK_TIMEOUT_MS,
  );
  try {
    if (bootstrapIdentity) {
      const requestBootstrap = () => fetch("/api/guest/bootstrap", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        signal: controller.signal,
      });
      let bootstrap = await requestBootstrap();
      if (bootstrap.status === 409) {
        const body: unknown = await bootstrap.json().catch(() => null);
        if (
          body
          && typeof body === "object"
          && !Array.isArray(body)
          && (body as { error?: unknown }).error === "legacy_identity_reset_required"
        ) {
          bootstrap = await requestBootstrap();
        }
      }
      if (!bootstrap.ok) throw new Error("identity_bootstrap_unavailable");
    }
    return await task(controller.signal);
  } finally {
    window.clearTimeout(timer);
  }
}

// Identity-bearing mutations are never attempted without a proven
// same-origin cross-tab critical section. Web Locks ownership follows the
// callback promise even while a tab is suspended. Expiring storage leases are
// deliberately not used: they can split ownership after timer throttling.
function withGuestCoordination<T>(
  task: (signal: AbortSignal) => Promise<T>,
  bootstrapIdentity: boolean,
): Promise<T> {
  if (typeof window === "undefined") throw new Error("identity_coordination_unavailable");
  const locks = (navigator as unknown as { locks?: LockManagerLike }).locks;
  if (!locks?.request) throw new Error("identity_coordination_unavailable");
  return locks.request(LOCK_NAME, { mode: "exclusive" }, () => runBounded(task, bootstrapIdentity));
}

export function withGuestIdentity<T>(
  task: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  return withGuestCoordination(task, true);
}

export function withGuestConsentLock<T>(
  task: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  return withGuestCoordination(task, false);
}
