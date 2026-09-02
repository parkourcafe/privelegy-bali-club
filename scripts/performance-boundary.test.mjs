import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

// Drop // line and /* block */ comments so a ban on an API cannot be tripped by
// a comment explaining why that API is banned.
const stripComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

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
  const photoPolicy = await read("lib/photo-policy.ts");
  const config = await read("next.config.ts");
  const protectedPhotoRoute = await read("app/api/venue-photo/[id]/route.ts");
  assert.match(image, /from "next\/image"/);
  assert.match(image, /src\.startsWith\("\/api\/venue-photo\/"\)\) return false/);
  assert.doesNotMatch(image, /isDraftVenuePhoto/);
  assert.doesNotMatch(image, /venuePhotoSourceAllowed/);
  assert.doesNotMatch(image, /\/storage\/v1\/object\/public\/venue-photos\/draft\//);
  assert.match(photoPolicy, /parseVenuePublicMediaUrl/);
  assert.match(photoPolicy, /HARD_BLOCKED_MEDIA_STATES/);
  assert.match(image, /sizes=\{sizesByVariant\[variant\]\}/);
  assert.match(config, /hostname: "\*\*\.supabase\.co"/);
  assert.match(config, /stale-while-revalidate=604800/);
  assert.match(protectedPhotoRoute, /max-age=300, s-maxage=300/);
});

test("public venue media does not expose internal fallback or provenance labels", async () => {
  const placeCard = await read("components/PlaceCard.tsx");
  const placeCover = await read("components/PlaceCover.tsx");
  const venueVisual = await read("components/VenueVisual.tsx");
  const venuePage = await read("app/places/[slug]/page.tsx");
  const styles = await read("app/globals.css");
  const publicVenueMedia = `${placeCard}\n${placeCover}\n${venueVisual}\n${venuePage}\n${styles}`;

  for (const forbidden of [
    "Media pending",
    "verified details below",
    "verified details only",
    "media-pending-badge",
    "venue-media-disclosure",
    "type-cover-word",
    "type-cover-category",
    "venue-visual-label",
    "Approved venue photo",
    "Supabase Storage media library",
  ]) {
    assert.doesNotMatch(publicVenueMedia, new RegExp(forbidden, "i"));
  }
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
  assert.match(summaryRepository, /\.in\("status", \["published", "source_snapshot"\]\)/);
  assert.match(summaryRepository, /\.in\("completeness", \["full", "partial"\]\)/);
  assert.match(sectionRoute, /getPublishedMenuSection/);
});

// The root layout must stay free of dynamic APIs. One headers()/cookies() read
// there marks every route below it dynamic, which is what previously answered
// `private, no-cache, no-store` on all 144 public pages and silently defeated
// the `revalidate` exports. This is the regression guard for that.
test("root layout renders statically so public pages can be CDN-cached", async () => {
  // Assert against code, not prose: this file's own comments name the very
  // APIs being banned.
  const rootLayout = stripComments(await read("app/layout.tsx"));
  const proxy = stripComments(await read("proxy.ts"));
  assert.doesNotMatch(rootLayout, /next\/headers/);
  assert.doesNotMatch(rootLayout, /\bheaders\(\)|\bcookies\(\)/);
  assert.doesNotMatch(rootLayout, /getLocale/);
  assert.doesNotMatch(rootLayout, /export default async function RootLayout/);
  // The locale header is gone entirely — nothing may reintroduce a server read.
  assert.doesNotMatch(proxy, /LOCALE_HEADER/);
});

test("chrome locale resolves client-side without breaking hydration", async () => {
  const client = await read("lib/i18n/client.ts");
  const header = await read("components/GlobalHeader.tsx");
  const nav = await read("components/MobileNav.tsx");
  const locales = await read("lib/i18n/locales.ts");
  // First render (server and client alike) must be the default locale, or the
  // prerendered HTML and the hydrated tree disagree.
  assert.match(client, /useState<PublicLocale>\(DEFAULT_LOCALE\)/);
  assert.match(client, /LOCALE_CHANGE_EVENT/);
  assert.match(locales, /export function readLocaleCookie/);
  for (const source of [header, nav]) {
    assert.match(source, /^"use client";/);
    assert.match(source, /const locale = useLocale\(\)/);
    assert.doesNotMatch(source, /\{ locale \}: \{ locale: PublicLocale \}/);
  }
});

test("venue detail is statically rendered while public data stays cached", async () => {
  const venuePage = await read("app/places/[slug]/page.tsx");
  const saveRoute = await read("app/api/save/route.ts");
  assert.match(venuePage, /export const revalidate = 300/);
  assert.doesNotMatch(venuePage, /force-dynamic/);
  // `revalidate` alone leaves a dynamic route out of the incremental cache
  // entirely — Next only registers it when generateStaticParams is declared.
  // Without both, these pages are rendered afresh on every request.
  assert.match(venuePage, /export function generateStaticParams/);
  assert.match(venuePage, /export const dynamicParams = true/);
  assert.match(venuePage, /buildVenueMetadata\(\{/);
  // Guest identity must never enter the cached render scope.
  assert.doesNotMatch(venuePage, /readGuestRef|getSavedSlugs/);
  assert.match(saveRoute, /export async function GET/);
  assert.match(saveRoute, /private, no-store/);
});

test("programmatic Bali hubs revalidate and preserve real 404s", async () => {
  const districtPage = await read("app/bali/[district]/page.tsx");
  const intentPage = await read("app/bali/[district]/[intent]/page.tsx");
  const data = await read("lib/data.ts");
  for (const source of [districtPage, intentPage]) {
    assert.match(source, /export const revalidate = 300/);
    assert.match(source, /export const dynamicParams = true/);
    assert.match(source, /notFound\(\)/);
    assert.doesNotMatch(source, /force-dynamic/);
  }
  assert.match(data, /const getCachedPublishedVenues = unstable_cache/);
});

test("venue detail and sitemap retain one publication boundary", async () => {
  const venuePage = await read("app/places/[slug]/page.tsx");
  const sitemap = await read("app/sitemap.ts");
  const data = await read("lib/data.ts");
  const validation = await read("lib/venue-validation.ts");
  assert.match(venuePage, /isVenueIndexable\(venue\)/);
  assert.match(sitemap, /getPublishedVenues\(\)/);
  assert.match(sitemap, /catalogue\.filter\(isVenueIndexable\)/);
  assert.match(data, /keepRenderableVenues/);
  assert.match(validation, /"villa"/);
});

test("routes are pre-generated and public plan and Uluwatu reads revalidate", async () => {
  const route = await read("app/route/[slug]/page.tsx");
  const plan = await read("app/plan/page.tsx");
  const uluwatu = await read("app/uluwatu/layout.tsx");
  assert.match(route, /export async function generateStaticParams/);
  assert.doesNotMatch(route, /force-dynamic/);
  assert.match(plan, /export const revalidate = 300/);
  assert.doesNotMatch(plan, /force-dynamic/);
  assert.match(uluwatu, /export const revalidate = 300/);
  assert.doesNotMatch(uluwatu, /force-dynamic/);
  assert.doesNotMatch(uluwatu, /notFound/);
  assert.doesNotMatch(uluwatu, /getPublishedVenues/);
  assert.doesNotMatch(uluwatu, /publishedUluwatuVenues/);
});

test("homepage keeps the global header and Explore mega-menu available", async () => {
  const landing = await read("app/page.tsx");
  const globalHeader = await read("components/GlobalHeader.tsx");
  const styles = await read("app/globals.css");
  assert.match(landing, /data-page-shell="landing"/);
  assert.doesNotMatch(globalHeader, /pathname === "\/"/);
  assert.doesNotMatch(styles, /body:has\(> \[data-page-shell="landing"\]\) > \.ob-site-header/);
  assert.match(globalHeader, /NAV_GROUPS\.map/);
  assert.match(globalHeader, /ob-mega-panel/);
  assert.match(globalHeader, /ob-compact-nav/);
  assert.match(globalHeader, /Explore Other Bali/);
  assert.match(styles, /\.ob-compact-panel/);
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
