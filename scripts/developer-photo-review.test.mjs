import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("restaurateur preview uses current production layouts and remains read-only", async () => {
  const [proxy, loginPage, loginRoute, requestAuth, accessConstants, redirectPage, sitePage, cataloguePage, venueRedirect, productionVenuePage, data, placesView, placeCard] = await Promise.all([
    readFile(new URL("proxy.ts", root), "utf8"),
    readFile(new URL("app/review/page.tsx", root), "utf8"),
    readFile(new URL("app/api/review-access/route.ts", root), "utf8"),
    readFile(new URL("lib/photo-review-request-auth.ts", root), "utf8"),
    readFile(new URL("lib/photo-review-access.ts", root), "utf8"),
    readFile(new URL("app/developer/photo-review/page.tsx", root), "utf8"),
    readFile(new URL("app/developer/site/page.tsx", root), "utf8"),
    readFile(new URL("app/developer/site/places/page.tsx", root), "utf8"),
    readFile(new URL("app/developer/site/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("app/places/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("lib/developer-photo-review.ts", root), "utf8"),
    readFile(new URL("app/places/PlacesView.tsx", root), "utf8"),
    readFile(new URL("components/PlaceCard.tsx", root), "utf8"),
  ]);

  assert.match(proxy, /PHOTO_REVIEW_ACCESS_TOKEN|configuredPhotoReviewToken/);
  assert.match(proxy, /isPhotoReviewPath/);
  assert.match(proxy, /photo-review/);
  assert.match(proxy, /PHOTO_REVIEW_COOKIE/);
  assert.match(loginPage, /action="\/api\/review-access"/);
  assert.match(loginPage, /type="password"/);
  assert.match(loginPage, /80 hours/);
  assert.match(loginRoute, /httpOnly: true/);
  assert.match(loginRoute, /PHOTO_REVIEW_COOKIE_MAX_AGE/);
  assert.match(loginRoute, /photoReviewSessionValue/);
  assert.match(loginRoute, /noindex, nofollow, noarchive/);
  assert.match(requestAuth, /timingSafeSecretEqual/);
  assert.match(proxy, /PHOTO_REVIEW_SHARE_EXPIRES_AT|configuredPhotoReviewShareToken/);
  assert.match(accessConstants, /60 \* 60 \* 80/);
  assert.match(data, /requirePhotoReviewRequest/);
  assert.match(data, /createSignedUrls/);
  assert.doesNotMatch(data, /\.upload\(|\.remove\(|\.update\(|\.insert\(|\.upsert\(/);
  assert.match(redirectPage, /redirect\("\/developer\/site"\)/);
  assert.match(sitePage, /Landing/);
  assert.match(sitePage, /Private restaurateur preview/);
  assert.match(cataloguePage, /PlacesView/);
  assert.match(cataloguePage, /live places/);
  assert.match(venueRedirect, /photo-review=1/);
  assert.match(productionVenuePage, /venue-masthead/);
  assert.match(productionVenuePage, /reviewCandidates\.map/);
  assert.match(placesView, /detailBasePath/);
  assert.match(placeCard, /disableTracking/);
});
