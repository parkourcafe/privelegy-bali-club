import assert from "node:assert/strict";
import test from "node:test";
import { browserConsentState, parseConsentRequest, parseConsentState } from "./consent";

test("consent fails closed for missing and unknown values", () => {
  assert.equal(parseConsentState(undefined), "unknown");
  assert.equal(parseConsentState("yes"), "unknown");
  assert.equal(browserConsentState("foo=bar"), "unknown");
});

test("consent parser accepts only the two persisted states", () => {
  assert.equal(browserConsentState("foo=bar; __Host-ob_consent=essential_only"), "essential_only");
  assert.equal(browserConsentState("__Host-ob_consent=analytics_allowed"), "analytics_allowed");
  assert.equal(browserConsentState("ob_consent=analytics_allowed"), "unknown");
  assert.equal(browserConsentState("ob_consent=essential_only"), "essential_only");
  assert.equal(
    browserConsentState("__Host-ob_consent=analytics_allowed; __Host-ob_consent=essential_only"),
    "essential_only",
  );
});

test("consent request accepts exactly one state and no caller identity", () => {
  assert.equal(parseConsentRequest({ state: "essential_only" }), "essential_only");
  assert.equal(parseConsentRequest({ state: "analytics_allowed" }), "analytics_allowed");
  assert.equal(parseConsentRequest({ state: "analytics_allowed", guestRef: "g_caller_supplied_1" }), null);
  assert.equal(parseConsentRequest({ state: "analytics_allowed", userAgent: "caller" }), null);
  assert.equal(parseConsentRequest({}), null);
  assert.equal(parseConsentRequest(["analytics_allowed"]), null);
});
