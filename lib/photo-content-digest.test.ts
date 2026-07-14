import assert from "node:assert/strict";
import test from "node:test";

import {
  photoContentSha256,
  photoDigestMatches,
  storedPhotoSha256,
} from "./photo-content-digest";

const bytes = new TextEncoder().encode("exact-image");
const digest = "0df0d25f77b706cc5be2c3fa85ed005ca8c35b46d224f9f2a4b04b91a7a903f9";

test("photo digest is stable and accepts Postgres bytea hex encoding", () => {
  assert.equal(photoContentSha256(bytes), digest);
  assert.equal(storedPhotoSha256(`\\x${digest}`), digest);
  assert.equal(storedPhotoSha256(digest.toUpperCase()), digest);
  assert.equal(photoDigestMatches(bytes, `\\x${digest}`), true);
});

test("photo digest rejects malformed or different evidence", () => {
  assert.equal(storedPhotoSha256("short"), null);
  assert.equal(storedPhotoSha256(null), null);
  assert.equal(photoDigestMatches(new TextEncoder().encode("other"), digest), false);
});
