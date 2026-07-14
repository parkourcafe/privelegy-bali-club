// Minimal offline shell for the planning layer. Deliberately tiny — no
// aggressive caching of redemption routes (those must always hit the network
// so proof is recorded server-side).
//
// v5: purge any cache poisoned during the 2026-07 domain/SSL cutover. The
// bump forces activate() to delete every older cache, and navigations only
// ever fall back to a stale HTML shell when the device is truly offline (a
// cached document must never be served with dead JS-chunk references while
// the network is up — that is what stranded users with dead clicks).
const CACHE = "ob-shell-v5";
const SHELL = [
  "/",
  "/manifest.webmanifest?v=4",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Never serve redemption/consent or API from cache.
  if (url.pathname.startsWith("/api/") || url.pathname.includes("/redeem")) return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        caches.match(request).then((r) => {
          if (r) return r;
          // Offline: only navigations fall back to the app shell. A missing
          // JS/CSS chunk must fail loudly, never be answered with HTML — that
          // silent mismatch is exactly what breaks hydration and kills clicks.
          if (request.mode === "navigate") return caches.match("/");
          return Response.error();
        })
      )
  );
});
