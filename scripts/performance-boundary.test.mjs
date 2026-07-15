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
