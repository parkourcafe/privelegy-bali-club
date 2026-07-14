import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_PHOTO_BYTES,
  PHOTO_CONSENT_TERMS_VERSION,
  approvedPhotoDeliveryUrl,
  boundedClientIp,
  detectPhotoMime,
  photoObjectPath,
  validatePhotoSubmissionFields,
} from "./photo-submission-policy";

const token = "a".repeat(64);

test("requires an explicit rights grant and bounded identity", () => {
  const base = {
    token,
    submitterName: "Made, manager",
    submitterContact: "+62 812 0000 0000",
    rightsGranted: true,
    honeypot: "",
    fileSize: 1024,
    declaredMime: "image/jpeg",
  };
  assert.equal(validatePhotoSubmissionFields(base).ok, true);
  assert.deepEqual(validatePhotoSubmissionFields({ ...base, rightsGranted: false }), { ok: false, error: "rights_required" });
  assert.deepEqual(validatePhotoSubmissionFields({ ...base, honeypot: "bot" }), { ok: false, error: "bad_request" });
  assert.deepEqual(validatePhotoSubmissionFields({ ...base, fileSize: MAX_PHOTO_BYTES + 1 }), { ok: false, error: "invalid_file" });
  assert.ok(PHOTO_CONSENT_TERMS_VERSION.startsWith("venue-photo-rights-v1"));
});

test("detects supported image signatures instead of trusting Content-Type", () => {
  assert.equal(detectPhotoMime(Uint8Array.from([0xff, 0xd8, 0xff, 0x00])), "image/jpeg");
  assert.equal(detectPhotoMime(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), "image/png");
  assert.equal(detectPhotoMime(Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50])), "image/webp");
  assert.equal(detectPhotoMime(Uint8Array.from([0, 0, 0, 0, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66])), "image/avif");
  assert.equal(detectPhotoMime(new TextEncoder().encode("<script>alert(1)</script>")), null);
});

test("constructs only venue-scoped object and HTTPS delivery paths", () => {
  const id = "11111111-1111-4111-8111-111111111111";
  assert.equal(photoObjectPath("fixture-venue", id, "image/webp"), `fixture-venue/${id}.webp`);
  assert.equal(photoObjectPath("../escape", id, "image/webp"), null);
  assert.equal(approvedPhotoDeliveryUrl(id, "https://www.otherbali.com"), `https://www.otherbali.com/api/venue-photo/${id}`);
  assert.equal(approvedPhotoDeliveryUrl(id, "http://otherbali.com"), null);
  assert.equal(approvedPhotoDeliveryUrl(id, "https://user:secret@otherbali.com"), null);
  assert.equal(approvedPhotoDeliveryUrl("not-an-id", "https://www.otherbali.com"), null);
  assert.equal(approvedPhotoDeliveryUrl(id, null), null);
});

test("accepts only syntactically valid forwarded client IP values", () => {
  assert.equal(boundedClientIp("203.0.113.9, 10.0.0.1"), "203.0.113.9");
  assert.equal(boundedClientIp("2001:db8::1"), "2001:db8::1");
  assert.equal(boundedClientIp("not-an-ip"), null);
});
