import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("ordinary document requests do not create a GuestRef", () => {
  const proxy = read("proxy.ts");
  assert.doesNotMatch(proxy, /cookies\.set\(["']bp_guest/);
  assert.doesNotMatch(proxy, /setGuestCookie/);
});

test("usage and source APIs require analytics consent and an authenticated existing identity", () => {
  for (const path of ["app/api/event/route.ts", "app/api/source/route.ts"]) {
    const source = read(path);
    const consent = source.indexOf("analytics_consent_required");
    const identity = source.indexOf("readGuestRef()");
    assert.ok(consent >= 0, `${path} must reject missing consent`);
    assert.ok(identity > consent, `${path} must check consent before reading identity`);
    assert.doesNotMatch(source, /resolveGuestRef\(\)/);
  }
});

test("GuestRef minting is isolated behind a fail-closed Web Locks coordinator", () => {
  const coordinator = read("lib/guest-client.ts");
  const bootstrap = read("app/api/guest/bootstrap/route.ts");
  assert.match(coordinator, /navigator[\s\S]*locks/);
  assert.match(coordinator, /identity_coordination_unavailable/);
  assert.doesNotMatch(coordinator, /localStorage|indexedDB|withLocalQueue|LEASE_MS/);
  assert.match(coordinator, /fetch\("\/api\/guest\/bootstrap"/);
  assert.match(bootstrap, /resolveGuestRef\(\)/);
  assert.match(bootstrap, /GUEST_PROOF_COOKIE/);
  assert.match(bootstrap, /isTrustedSameOriginMutation\(req\)/);

  for (const path of [
    "components/SaveButton.tsx",
    "components/ShareButton.tsx",
    "components/privacy/ConsentBanner.tsx",
    "app/route/[slug]/RouteActions.tsx",
    "app/v/[venue]/redeem/RedeemFlow.tsx",
  ]) {
    assert.match(read(path), /withGuestIdentity/);
  }
  for (const path of [
    "app/api/save/route.ts",
    "app/api/list/route.ts",
    "app/api/redeem/route.ts",
    "app/api/privacy/consent/route.ts",
  ]) {
    const source = read(path);
    assert.match(source, /readGuestRef\(\)/);
    assert.doesNotMatch(source, /resolveGuestRef\(\)/);
  }
});

test("GuestRef cookies are host-bound, duplicate-safe and legacy values are not trust-migrated", () => {
  const guestServer = read("lib/guest-server.ts");
  const deletion = read("app/api/privacy/delete/route.ts");
  assert.match(guestServer, /__Host-bp_guest/);
  assert.match(guestServer, /rawCookieValues/);
  assert.match(guestServer, /refs\.length !== 1 \|\| proofs\.length !== 1/);
  assert.match(guestServer, /legacyPresent \? "legacy" : "absent"/);
  assert.doesNotMatch(guestServer, /legacyGuestRefExists/);
  assert.match(guestServer, /verifyGuestRefProof/);
  assert.match(guestServer, /GUEST_REF_SIGNING_SECRET|configuredGuestRefSecret/);
  assert.match(deletion, /resolveGuestRefAccess\(/);
  assert.doesNotMatch(deletion, /resolveGuestRef\(\)/);
  assert.match(deletion, /cookies\.set\(GUEST_PROOF_COOKIE,[\s\S]*maxAge: 0/);
});

test("GA and initial capture are gated by analytics_allowed", () => {
  const consent = read("lib/privacy/consent.ts");
  assert.match(consent, /__Host-ob_consent/);
  assert.match(consent, /legacy[\s\S]*essential_only/i);
  assert.match(read("components/Analytics.tsx"), /NEXT_PUBLIC_ENABLE_ANALYTICS/);
  assert.match(read("components/AnalyticsClient.tsx"), /analytics_allowed/);
  assert.match(read("app/SourceCapture.tsx"), /analytics_allowed/);
});

test("successful deletion restores an identity-free essential-only browser choice", () => {
  const route = read("app/api/privacy/delete/route.ts");
  const choices = read("components/privacy/PrivacyChoices.tsx");
  assert.match(route, /isTrustedSameOriginMutation\(req\)/);
  assert.match(choices, /legacy_identity_migration_required/);
  const success = choices.indexOf("if (!response.ok)", choices.indexOf('fetch("/api/privacy/delete"'));
  const secondShutdown = choices.indexOf("stopAnalyticsImmediately();", success);
  assert.ok(success >= 0 && secondShutdown > success);
});

test("direct dish feedback is bounded and cannot create a new GuestRef", () => {
  const dish = read("app/api/dish/route.ts");
  assert.match(dish, /readBoundedJson\(req, MAX_DISH_BODY_BYTES\)/);
  assert.match(dish, /readGuestRef\(\)/);
  assert.doesNotMatch(dish, /resolveGuestRef\(\)/);
  assert.doesNotMatch(dish, /GUEST_COOKIE|guestCookieOptions/);
});
