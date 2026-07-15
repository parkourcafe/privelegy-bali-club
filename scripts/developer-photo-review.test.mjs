import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("developer photo review remains read-only and separately protected", async () => {
  const [proxy, redirectPage, cataloguePage, venuePage, data, placesView, placeCard] = await Promise.all([
    readFile(new URL("proxy.ts", root), "utf8"),
    readFile(new URL("app/developer/photo-review/page.tsx", root), "utf8"),
    readFile(new URL("app/developer/site/page.tsx", root), "utf8"),
    readFile(new URL("app/developer/site/[slug]/page.tsx", root), "utf8"),
    readFile(new URL("lib/developer-photo-review.ts", root), "utf8"),
    readFile(new URL("app/places/PlacesView.tsx", root), "utf8"),
    readFile(new URL("components/PlaceCard.tsx", root), "utf8"),
  ]);

  assert.match(proxy, /PHOTO_REVIEW_ACCESS_TOKEN|configuredPhotoReviewToken/);
  assert.match(proxy, /isPhotoReviewPath/);
  assert.match(data, /requirePhotoReviewRequest/);
  assert.match(data, /createSignedUrls/);
  assert.doesNotMatch(data, /\.upload\(|\.remove\(|\.update\(|\.insert\(|\.upsert\(/);
  assert.match(redirectPage, /redirect\("\/developer\/site"\)/);
  assert.match(cataloguePage, /PlacesView/);
  assert.match(cataloguePage, /343|catalogue\.venues\.length/);
  assert.match(venuePage, /venue-masthead/);
  assert.match(venuePage, /candidates\.map/);
  assert.match(placesView, /detailBasePath/);
  assert.match(placeCard, /disableTracking/);
});
