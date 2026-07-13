import assert from "node:assert/strict";
import test from "node:test";

import { createRedemptionToken, verifyRedemptionToken } from "./redemption-token";

const secret = "release-test-secret-that-is-longer-than-32-characters";
const production = "https://otherbali.com";
const preview = "https://otherbali-audit.vercel.app";
const now = Date.parse("2026-07-14T00:00:00.000Z");

test("redemption tokens are venue-bound and tamper evident", () => {
  const token = createRedemptionToken("home-cafe", secret, production, now);
  assert.ok(token);
  assert.equal(verifyRedemptionToken("home-cafe", token, secret, production, now), true);
  assert.equal(verifyRedemptionToken("other-cafe", token, secret, production, now), false);
  assert.equal(verifyRedemptionToken("home-cafe", token, secret, preview, now), false);
  assert.equal(verifyRedemptionToken("home-cafe", `${token.slice(0, -1)}x`, secret, production, now), false);
  assert.equal(verifyRedemptionToken("home-cafe", token, secret, production, now + 91 * 24 * 60 * 60 * 1000), false);
});

test("redemption token generation fails closed for weak configuration", () => {
  assert.equal(createRedemptionToken("home-cafe", "short", production), null);
  assert.equal(createRedemptionToken("../home-cafe", secret, production), null);
  assert.equal(createRedemptionToken("home-cafe", secret, "https://user:pass@evil.test"), null);
  assert.equal(verifyRedemptionToken("home-cafe", "not-a-token", secret, production), false);
});
