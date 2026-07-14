// KILL SWITCH (2026-07).
//
// A service-worker cache poisoned during the domain/SSL cutover kept serving
// stale HTML that referenced dead JS chunks after redeploys — which broke
// hydration and made every link/button dead. Patching the caching logic was
// not enough because a bad SW is sticky. This SW now does one thing: on load
// it purges ALL caches and UNREGISTERS itself, then reloads open tabs, so any
// browser that fetches it self-heals into a clean, SW-free state.
//
// The app is fully functional without a service worker (the offline shell was
// a nice-to-have, not required). A correct, well-versioned SW can be
// reintroduced later — deliberately, with testing — if PWA/offline is wanted.

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch {}
      try {
        await self.registration.unregister();
      } catch {}
      // Reload any open tabs so they drop the dead SW controller and load fresh.
      try {
        const clients = await self.clients.matchAll({ type: "window" });
        for (const c of clients) {
          if ("navigate" in c) c.navigate(c.url);
        }
      } catch {}
    })()
  );
});

// Pass-through: while this SW is briefly alive, never serve from cache.
self.addEventListener("fetch", () => {});
