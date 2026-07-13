// Minimal offline shell for the planning layer. Deliberately tiny — no
// aggressive caching of redemption routes (those must always hit the network
// so proof is recorded server-side).
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
  if (url.origin !== self.location.origin || request.headers.has("authorization")) return;

  // Operational, token-bearing and personalized HTML is network-only. The
  // cache is an explicit static shell, never a general page cache.
  const staticShell = SHELL.includes(`${url.pathname}${url.search}`) || SHELL.includes(url.pathname);
  const nextStatic = url.pathname.startsWith("/_next/static/");
  if (!staticShell && !nextStatic) return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        const cacheControl = res.headers.get("cache-control") ?? "";
        if (res.ok && !/\b(?:private|no-store)\b/i.test(cacheControl)) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(request).then((r) => r || (request.mode === "navigate" ? caches.match("/") : undefined)))
  );
});
