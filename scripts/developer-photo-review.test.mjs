import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("restaurateur preview uses current production layouts and remains read-only", async () => {
  const [proxy, redirectPage, sitePage, cataloguePage, venueRedirect, productionVenuePage, data, placesView, placeCard] = await Promise.all([
    readFile(new URL("proxy.ts", root), "utf8"),
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
