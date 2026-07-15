import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("developer photo review remains read-only and separately protected", async () => {
  const [proxy, page, data] = await Promise.all([
    readFile(new URL("proxy.ts", root), "utf8"),
    readFile(new URL("app/developer/photo-review/page.tsx", root), "utf8"),
    readFile(new URL("lib/developer-photo-review.ts", root), "utf8"),
  ]);

  assert.match(proxy, /PHOTO_REVIEW_ACCESS_TOKEN|configuredPhotoReviewToken/);
  assert.match(proxy, /isPhotoReviewPath/);
  assert.match(data, /requirePhotoReviewRequest/);
  assert.match(data, /createSignedUrl/);
  assert.doesNotMatch(data, /\.upload\(|\.remove\(|\.update\(|\.insert\(|\.upsert\(/);
  assert.match(page, /Nothing on this page is public/);
  assert.match(page, /Search venue name or slug/);
});
