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

