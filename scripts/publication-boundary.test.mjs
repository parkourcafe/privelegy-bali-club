import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const [catalogue, detail, publication, data, cards, placeCard, worker, workerRegister, partner, onboarding, analytics, analyticsClient, rootLayout, proxy] = await Promise.all([
  read("app/places/page.tsx"),
  read("app/places/[slug]/page.tsx"),
  read("lib/publication.ts"),
  read("lib/data.ts"),
  read("app/places/PlacesView.tsx"),
  read("components/PlaceCard.tsx"),
  read("public/sw.js"),
  read("app/ServiceWorkerRegister.tsx"),
  read("app/partner/[venue]/page.tsx"),
  read("app/api/onboard/jtbd/route.ts"),
  read("components/Analytics.tsx"),
  read("components/AnalyticsClient.tsx"),
  read("app/layout.tsx"),
  read("proxy.ts"),
]);

test("review and inactive venues cannot cross public route gates", () => {
  assert.doesNotMatch(catalogue, /params\.all|showAll|Internal view/);
  assert.match(detail, /if \(!published\) notFound\(\)/);
  assert.match(publication, /v\.status !== "active"/);
  assert.match(publication, /v\.publicationStatus !== "published"/);
  assert.match(data, /\.eq\("status", "active"\)/);
  assert.match(data, /\.eq\("publication_status", "published"\)/);
  assert.match(data, /renderable\.filter\(isPublicReadyVenue\)/);
  assert.match(data, /keepRenderableVenues\(uniqueBy\([\s\S]*?\)\)\.filter\(isPublicReadyVenue\)/);
  assert.match(data, /\["similar-venues-v2"\]/);
  assert.doesNotMatch(data, /from\("venues"\)\.select\("\*"\)/);
});

test("public cards contain no Google rating or review product", () => {
  assert.doesNotMatch(cards, /googleRating|googleReviews/);
  assert.doesNotMatch(placeCard, /googleRating|googleReviews|Google reviews/);
  assert.doesNotMatch(data, /google_rating|google_reviews|rating_source/);
});

test("TablePilot card handoffs require the active-deep coverage gate", () => {
  assert.doesNotMatch(data, /"tablepilot_slug"/);
  assert.match(cards, /tablepilotSlug:\s*undefined/);
  assert.match(placeCard, /place\.coverageMode === "active_deep"/);
  assert.match(placeCard, /buildTablePilotReservationUrl/);
});

test("service worker kill switch purges caches and unregisters without intercepting requests", () => {
  assert.match(worker, /caches\.keys\(\)/);
  assert.match(worker, /keys\.map\(\(k\) => caches\.delete\(k\)\)/);
  assert.match(worker, /self\.registration\.unregister\(\)/);
  assert.match(worker, /self\.clients\.matchAll/);
  assert.doesNotMatch(worker, /caches\.open|caches\.match|respondWith/);
  assert.match(workerRegister, /getRegistrations/);
  assert.match(workerRegister, /r\.unregister\(\)/);
  assert.doesNotMatch(workerRegister, /serviceWorker\.register/);
});

test("partner metrics are operator-only and venue token edits only owner copy", () => {
  assert.match(partner, /isCurrentAdminRequestAuthorized/);
  assert.match(partner, /notFound\(\)/);
  assert.doesNotMatch(onboarding, /bestFor|notFor|practicalTags|jobs/);
  assert.match(onboarding, /ownerNote/);
});

test("preview deployments never write QA traffic into production analytics", () => {
  assert.match(analytics, /VERCEL_ENV !== "production"/);
  assert.doesNotMatch(analytics, /NODE_ENV !== "production"/);
  for (const prefix of ["admin", "api", "onboard", "partner", "me", "v", "list"]) {
    assert.match(analyticsClient, new RegExp(`/${prefix}`));
  }
  assert.match(analyticsClient, /send_page_view:\s*false/);
  assert.match(analyticsClient, /window\.location\.origin.*pathname/);
  assert.match(rootLayout, /referrer:\s*"origin"/);
  assert.match(proxy, /Cache-Control.*private, no-store/);
  assert.match(proxy, /Referrer-Policy.*no-referrer/);
  assert.match(proxy, /X-Robots-Tag.*noindex, nofollow, noarchive/);
});
