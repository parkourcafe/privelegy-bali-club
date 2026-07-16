import assert from "node:assert/strict";
import test from "node:test";
import {
  configuredAdminToken,
  configuredReviewToken,
  hasAdminBasicAccess,
  hasBasicAccess,
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

test("review token rejects weak/example secrets and requires 16+ chars", () => {
  const previous = process.env.REVIEW_ACCESS_TOKEN;
  process.env.REVIEW_ACCESS_TOKEN = "short";
  assert.equal(configuredReviewToken(), null);
  process.env.REVIEW_ACCESS_TOKEN = "review-please-let-me-in";
  assert.equal(configuredReviewToken(), null); // "review" prefix rejected
  process.env.REVIEW_ACCESS_TOKEN = "aptbl-9Qz2Vm7Ns9Lx5";
  assert.equal(configuredReviewToken(), "aptbl-9Qz2Vm7Ns9Lx5");
  delete process.env.REVIEW_ACCESS_TOKEN;
  assert.equal(configuredReviewToken(), null); // unset ⇒ page is public
  if (previous === undefined) delete process.env.REVIEW_ACCESS_TOKEN;
  else process.env.REVIEW_ACCESS_TOKEN = previous;
});

test("generic Basic access matches only the exact configured token", () => {
  assert.equal(hasBasicAccess(basic("aptbl-9Qz2Vm7Ns9Lx5"), "aptbl-9Qz2Vm7Ns9Lx5"), true);
  assert.equal(hasBasicAccess(basic("wrong"), "aptbl-9Qz2Vm7Ns9Lx5"), false);
  assert.equal(hasBasicAccess(basic("anything"), null), false); // no token ⇒ closed
  assert.equal(hasBasicAccess(null, "aptbl-9Qz2Vm7Ns9Lx5"), false);
});

test("verification requires the explicit review value", () => {
  assert.equal(hasExplicitReviewConfirmation(EXPLICIT_REVIEW_CONFIRMATION), true);
  assert.equal(hasExplicitReviewConfirmation("on"), false);
  assert.equal(hasExplicitReviewConfirmation(null), false);
});
