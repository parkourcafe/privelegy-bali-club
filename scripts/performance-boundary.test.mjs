import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("public cache has a bounded five-minute revalidation window", async () => {
  const source = await read("lib/data/public-cache.ts");
  assert.match(source, /PUBLIC_CACHE_REVALIDATE_SECONDS = 300/);
  for (const tag of ["public-venues", "public-menus", "public-actions", "public-routes", "public-plans"]) {
    assert.match(source, new RegExp(`"${tag}"`));
  }
});

test("published reads are cached while guest identity remains outside cache scopes", async () => {
  const source = await read("lib/data.ts");
  assert.match(source, /unstable_cache\(\s*fetchPublishedVenues/);
  assert.match(source, /unstable_cache\(\s*fetchVenueWithPerk/);
  assert.match(source, /export async function getSavedSlugs/);
  assert.doesNotMatch(source, /unstable_cache\(\s*getSavedSlugs/);
  assert.doesNotMatch(source, /reactCache\(\s*getSavedSlugs/);
});

test("venue detail does not load the complete catalogue for similar places", async () => {
  const source = await read("app/places/[slug]/page.tsx");
  assert.match(source, /getSimilarVenues\(venue, 3\)/);
  assert.doesNotMatch(source, /getPublishedVenues/);
});

test("catalogue renders a bounded server-side page instead of hydrating every venue", async () => {
  const page = await read("app/places/page.tsx");
  const view = await read("app/places/PlacesView.tsx");
  const card = await read("components/PlaceCard.tsx");
  assert.match(page, /const PAGE_SIZE = 24/);
  assert.match(page, /paginatedMatches\.slice/);
  assert.doesNotMatch(view, /^"use client";/);
  assert.doesNotMatch(card, /^"use client";/);
  assert.match(view, /<form action="\/places" method="get"/);
});

test("public venue photos use responsive optimization without weakening consent delivery", async () => {
  const image = await read("components/VenueImage.tsx");
  const config = await read("next.config.ts");
  const protectedPhotoRoute = await read("app/api/venue-photo/[id]/route.ts");
  assert.match(image, /from "next\/image"/);
  assert.match(image, /src\.startsWith\("\/api\/venue-photo\/"\)\) return false/);
  assert.match(image, /sizes=\{sizesByVariant\[variant\]\}/);
  assert.match(config, /hostname: "\*\*\.supabase\.co"/);
  assert.match(config, /stale-while-revalidate=604800/);
  assert.match(protectedPhotoRoute, /max-age=300, s-maxage=300/);
});

test("large menus defer closed-section items and keep publication gates", async () => {
  const item = await read("components/menu/MenuItem.tsx");
  const summaryRepository = await read("lib/data/menu-summary-repository.ts");
  const sectionRoute = await read("app/api/public/menu-section/route.ts");
  assert.doesNotMatch(item, /^"use client";/);
  assert.match(item, /data-menu-item-id/);
  assert.match(summaryRepository, /LARGE_SECTION_ITEM_THRESHOLD/);
  assert.match(summaryRepository, /index > 0 && itemCount > LARGE_SECTION_ITEM_THRESHOLD/);
  assert.match(summaryRepository, /items: deferred \? \[\] : section\.items/);
  assert.match(summaryRepository, /\.eq\("status", "published"\)/);
  assert.match(summaryRepository, /\.eq\("completeness", "full"\)/);
  assert.match(sectionRoute, /getPublishedMenuSection/);
});

test("venue detail uses request rendering for locale while public data stays cached", async () => {
  const venuePage = await read("app/places/[slug]/page.tsx");
  const saveRoute = await read("app/api/save/route.ts");
  assert.match(venuePage, /export const dynamic = "force-dynamic"/);
  assert.doesNotMatch(venuePage, /export async function generateStaticParams\(\)/);
  assert.doesNotMatch(venuePage, /readGuestRef|getSavedSlugs/);
  assert.match(saveRoute, /export async function GET/);
  assert.match(saveRoute, /private, no-store/);
});

test("routes are pre-generated and public plan and Uluwatu reads revalidate", async () => {
  const route = await read("app/route/[slug]/page.tsx");
  const plan = await read("app/plan/page.tsx");
  const uluwatu = await read("app/uluwatu/layout.tsx");
  assert.match(route, /export async function generateStaticParams/);
  assert.match(plan, /export const revalidate = 300/);
  assert.doesNotMatch(plan, /force-dynamic/);
  assert.match(uluwatu, /export const revalidate = 300/);
  assert.doesNotMatch(uluwatu, /force-dynamic/);
});

test("homepage suppresses the inner-page header before hydration", async () => {
  const landing = await read("app/page.tsx");
  const globalHeader = await read("components/GlobalHeader.tsx");
  const styles = await read("app/globals.css");
  assert.match(landing, /data-page-shell="landing"/);
  assert.match(globalHeader, /if \(!pathname \|\| pathname === "\/"\) return null/);
  assert.match(
    styles,
    /body:has\(> \[data-page-shell="landing"\]\) > \.ob-site-header\s*\{\s*display: none;/,
  );
});

test("isolated review host fails closed and analytics disclosure matches the consent gate", async () => {
  const proxy = await read("proxy.ts");
  const privacy = await read("app/privacy/page.tsx");
  const choices = await read("app/privacy/choices/PrivacyChoices.tsx");
  assert.match(proxy, /if \(isReviewHost\(host\)\)/);
  assert.match(proxy, /if \(!reviewToken \|\| !hasBasicAccess/);
  assert.match(privacy, /Google Analytics 4 is off until you choose Accept/);
  assert.match(privacy, /Advertising storage, ad personalization, and cross-app tracking/);
  assert.match(choices, /Google Analytics loads only when this setting is On/);
});
