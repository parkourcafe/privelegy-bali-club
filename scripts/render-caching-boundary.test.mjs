import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

// One dynamic API read in the ROOT layout opts every route in the app out of
// static/ISR rendering. That is exactly what happened: getLocale() read
// headers() there, so all 210 routes were re-rendered per request and no HTML
// was cacheable at the edge (2026-08-24 audit). These assertions keep the root
// layout request-independent and the public routes cached.

test("the root layout reads no request state", async () => {
  const layout = await read("app/layout.tsx");
  // Ignore prose: only real imports and calls matter.
  const code = layout.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  assert.doesNotMatch(code, /from "@\/lib\/i18n\/server"/);
  assert.doesNotMatch(code, /await getLocale\(\)/);
  assert.doesNotMatch(code, /next\/headers/);
  assert.doesNotMatch(code, /\bcookies\(\)/);
  // It must also not become an async component again for the same reason.
  assert.match(layout, /export default function RootLayout/);
});

test("the chrome resolves the locale on the client", async () => {
  const hook = await read("lib/i18n/use-locale.ts");
  assert.match(hook, /^"use client";/);
  assert.match(hook, /LOCALE_CHANGE_EVENT/);
  for (const component of ["components/GlobalHeader.tsx", "components/MobileNav.tsx", "components/LocaleSwitcher.tsx"]) {
    const source = await read(component);
    assert.match(source, /useLocale\(\)/, `${component} must read the locale client-side`);
  }
  // Switching language must notify the mounted chrome; nothing re-renders on
  // the server any more.
  const switcher = await read("components/LocaleSwitcher.tsx");
  assert.match(switcher, /dispatchEvent\(new Event\(LOCALE_CHANGE_EVENT\)\)/);
});

test("public content routes are cached, not request-rendered", async () => {
  const cached = [
    ["app/places/[slug]/page.tsx", /export const revalidate = 300/],
    ["app/bali/[district]/page.tsx", /export const revalidate = 3600/],
    ["app/bali/[district]/[intent]/page.tsx", /export const revalidate = 3600/],
    ["app/route/[slug]/page.tsx", /export const revalidate = 300/],
  ];
  for (const [path, revalidatePattern] of cached) {
    const source = await read(path);
    assert.match(source, revalidatePattern, `${path} must declare a revalidate window`);
    assert.doesNotMatch(source, /export const dynamic = "force-dynamic"/, `${path} must not force request rendering`);
  }
  // Next 16 needs generateStaticParams present (even empty) for a dynamic
  // segment to be ISR-cached at runtime instead of rendered per request.
  const venuePage = await read("app/places/[slug]/page.tsx");
  assert.match(venuePage, /export async function generateStaticParams/);
});

test("guest-personal surfaces stay request-rendered", async () => {
  // /me reads the httpOnly guest cookie; caching it would serve one visitor's
  // saved places to another.
  const me = await read("app/me/page.tsx");
  assert.match(me, /export const dynamic = "force-dynamic"/);
  assert.match(me, /guest-server|resolveGuestRef/);
});
