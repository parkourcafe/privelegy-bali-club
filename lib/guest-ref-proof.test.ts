import assert from "node:assert/strict";
import test from "node:test";
import {
  configuredGuestRefSecret,
  configuredPreviousGuestRefSecret,
  signGuestRef,
  verifyGuestRefProof,
} from "./guest-ref-proof";

const secret = "test-only-guest-reference-secret-32-bytes";
const ref = "g_0123456789abcdef";

test("GuestRef proof authenticates the exact server-minted reference", () => {
  const proof = signGuestRef(ref, secret);
  assert.equal(typeof proof, "string");
  assert.equal(proof?.length, 43);
  assert.equal(verifyGuestRefProof(ref, proof, secret), true);
  assert.equal(verifyGuestRefProof("g_fedcba9876543210", proof, secret), false);
  assert.equal(verifyGuestRefProof(ref, `${proof?.slice(0, -1)}A`, secret), false);
});

test("GuestRef proof fails closed without a deployment-grade secret", () => {
  assert.equal(configuredGuestRefSecret("short"), null);
  assert.equal(signGuestRef(ref, "short"), null);
  assert.equal(configuredGuestRefSecret(secret), secret);
  assert.equal(configuredPreviousGuestRefSecret(secret), secret);
});
