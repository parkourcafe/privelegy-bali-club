"use client";

import { useEffect } from "react";

// Service worker is intentionally DISABLED (2026-07). A poisoned SW cache from
// the domain/SSL cutover repeatedly broke hydration (dead links after
// redeploys). Instead of registering one, we actively unregister any existing
// registration; the kill-switch /sw.js self-destructs and purges its caches.
// Re-enable a correct, versioned SW deliberately later if PWA/offline is wanted.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .getRegistrations?.()
      .then((regs) => regs.forEach((r) => r.unregister().catch(() => {})))
      .catch(() => {});
  }, []);
  return null;
}
