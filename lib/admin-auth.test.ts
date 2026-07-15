import assert from "node:assert/strict";
import test from "node:test";
import {
  configuredAdminToken,
  configuredPhotoReviewShareToken,
  configuredPhotoReviewToken,
  hasAdminBasicAccess,
  photoReviewSessionValue,
  timingSafeSecretEqual,
} from "./admin-auth";
import {
  EXPLICIT_REVIEW_CONFIRMATION,
  hasExplicitReviewConfirmation,
} from "./admin-review";

test("admin configuration rejects weak or example secrets", () => {
  const previous = process.env.ADMIN_ACCESS_TOKEN;
  process.env.ADMIN_ACCESS_TOKEN = "1234";
  assert.equal(configuredAdminToken(), null);
  process.env.ADMIN_ACCESS_TOKEN = "example-secret-that-is-definitely-long-enough";
  assert.equal(configuredAdminToken(), null);
  process.env.ADMIN_ACCESS_TOKEN = "u8k0C4qPz2Vm7Ns9Lx5Wa1Rd6Ht3YbEf";
  assert.equal(configuredAdminToken(), "u8k0C4qPz2Vm7Ns9Lx5Wa1Rd6Ht3YbEf");
  if (previous === undefined) delete process.env.ADMIN_ACCESS_TOKEN;
  else process.env.ADMIN_ACCESS_TOKEN = previous;
});

test("photo review uses an independent strong token", () => {
  const previous = process.env.PHOTO_REVIEW_ACCESS_TOKEN;
  process.env.PHOTO_REVIEW_ACCESS_TOKEN = "short";
  assert.equal(configuredPhotoReviewToken(), null);
  process.env.PHOTO_REVIEW_ACCESS_TOKEN = "r8VQ2wLt9Hk4mNz6Xs3Pd7Yc5Fa1Bj0E";
  assert.equal(configuredPhotoReviewToken(), "r8VQ2wLt9Hk4mNz6Xs3Pd7Yc5Fa1Bj0E");
  if (previous === undefined) delete process.env.PHOTO_REVIEW_ACCESS_TOKEN;
  else process.env.PHOTO_REVIEW_ACCESS_TOKEN = previous;
});

test("restaurateur share access requires a separate non-trivial secret", () => {
  const previousToken = process.env.PHOTO_REVIEW_SHARE_TOKEN;
  const previousExpiry = process.env.PHOTO_REVIEW_SHARE_EXPIRES_AT;
  process.env.PHOTO_REVIEW_SHARE_EXPIRES_AT = "2099-01-01T00:00:00.000Z";
  process.env.PHOTO_REVIEW_SHARE_TOKEN = "short";
  assert.equal(configuredPhotoReviewShareToken(Date.parse("2026-07-15T00:00:00.000Z")), null);
  process.env.PHOTO_REVIEW_SHARE_TOKEN = "password-that-is-long-but-still-explicitly-weak";
  assert.equal(configuredPhotoReviewShareToken(Date.parse("2026-07-15T00:00:00.000Z")), null);
  process.env.PHOTO_REVIEW_SHARE_TOKEN = "otherbali2026!";
  assert.equal(
    configuredPhotoReviewShareToken(Date.parse("2026-07-15T00:00:00.000Z")),
    "otherbali2026!",
  );
  process.env.PHOTO_REVIEW_SHARE_TOKEN = "OtherBali-Restaurateur-Review-15July2026!";
  assert.equal(
    configuredPhotoReviewShareToken(Date.parse("2026-07-15T00:00:00.000Z")),
    "OtherBali-Restaurateur-Review-15July2026!",
  );
  assert.equal(configuredPhotoReviewShareToken(Date.parse("2099-01-01T00:00:00.000Z")), null);
  assert.equal(photoReviewSessionValue("secret"), photoReviewSessionValue("secret"));
  assert.notEqual(photoReviewSessionValue("secret"), photoReviewSessionValue("different"));
  if (previousToken === undefined) delete process.env.PHOTO_REVIEW_SHARE_TOKEN;
  else process.env.PHOTO_REVIEW_SHARE_TOKEN = previousToken;
  if (previousExpiry === undefined) delete process.env.PHOTO_REVIEW_SHARE_EXPIRES_AT;
  else process.env.PHOTO_REVIEW_SHARE_EXPIRES_AT = previousExpiry;
});

function basic(password: string, username = "operator"): string {
  return `Basic ${Buffer.from(`${username}:${password}`, "utf8").toString("base64")}`;
}

test("admin Basic authentication fails closed", () => {
  assert.equal(hasAdminBasicAccess(null, "correct horse"), false);
  assert.equal(hasAdminBasicAccess(basic("correct horse"), null), false);
  assert.equal(hasAdminBasicAccess("Bearer correct horse", "correct horse"), false);
  assert.equal(hasAdminBasicAccess("Basic !!!", "correct horse"), false);
  assert.equal(hasAdminBasicAccess(basic("wrong"), "correct horse"), false);
});

test("admin Basic authentication accepts only the exact password", () => {
  assert.equal(hasAdminBasicAccess(basic("correct horse"), "correct horse"), true);
  assert.equal(hasAdminBasicAccess(basic("correct horse "), "correct horse"), false);
  assert.equal(hasAdminBasicAccess(basic("päss:word"), "päss:word"), true);
});

test("secret comparison uses exact UTF-8 values", () => {
  assert.equal(timingSafeSecretEqual("same", "same"), true);
  assert.equal(timingSafeSecretEqual("same", "different-length"), false);
  assert.equal(timingSafeSecretEqual("café", "cafe"), false);
});

test("verification requires the explicit review value", () => {
  assert.equal(hasExplicitReviewConfirmation(EXPLICIT_REVIEW_CONFIRMATION), true);
  assert.equal(hasExplicitReviewConfirmation("on"), false);
  assert.equal(hasExplicitReviewConfirmation(null), false);
});
