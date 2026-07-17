import assert from "node:assert/strict";
import test from "node:test";
import { isIdentityFreePublicPath } from "./public-request-policy";

test("mobile and health reads remain identity-free", () => {
  assert.equal(isIdentityFreePublicPath("/api/mobile/v1/bootstrap"), true);
  assert.equal(isIdentityFreePublicPath("/api/mobile/v1/venues/cafe"), true);
  assert.equal(isIdentityFreePublicPath("/api/health/live"), true);
  assert.equal(isIdentityFreePublicPath("/api/health/ready"), true);
  assert.equal(isIdentityFreePublicPath("/.well-known/apple-app-site-association"), true);
  assert.equal(isIdentityFreePublicPath("/.well-known/assetlinks.json"), true);
});

test("lookalike and identity-bearing routes are not exempted", () => {
  assert.equal(isIdentityFreePublicPath("/api/mobile/v10/bootstrap"), false);
  assert.equal(isIdentityFreePublicPath("/api/healthy"), false);
  assert.equal(isIdentityFreePublicPath("/api/event"), false);
  assert.equal(isIdentityFreePublicPath("/places"), false);
  assert.equal(isIdentityFreePublicPath("/.well-known/unrelated"), false);
});
