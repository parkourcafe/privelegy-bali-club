import assert from "node:assert/strict";
import test from "node:test";

import { isAnonEnvironmentSafe, isSeedFallbackAllowed } from "./server";

test("production and local environments keep their configured Supabase access", () => {
  assert.equal(
    isAnonEnvironmentSafe({
      url: "https://egkdapqwkfprtyqvvnso.supabase.co",
      vercelEnv: "production",
    }),
    true,
  );
  assert.equal(
    isAnonEnvironmentSafe({
      url: "http://127.0.0.1:54321",
      vercelEnv: "development",
    }),
    true,
  );
});

test("preview fails closed without an explicitly matching non-production project", () => {
  assert.equal(
    isAnonEnvironmentSafe({
      url: "https://egkdapqwkfprtyqvvnso.supabase.co",
      vercelEnv: "preview",
    }),
    false,
  );
  assert.equal(
    isAnonEnvironmentSafe({
      url: "https://egkdapqwkfprtyqvvnso.supabase.co",
      vercelEnv: "preview",
      previewProjectRef: "egkdapqwkfprtyqvvnso",
    }),
    false,
  );
  assert.equal(
    isAnonEnvironmentSafe({
      url: "https://different-project.supabase.co",
      vercelEnv: "preview",
      previewProjectRef: "safe-staging-project",
    }),
    false,
  );
  assert.equal(
    isAnonEnvironmentSafe({
      url: "https://safe-staging-project.supabase.co",
      vercelEnv: "preview",
      previewProjectRef: "safe-staging-project",
    }),
    true,
  );
});

test("fixture data is explicit local-development-only and never a deployment fallback", () => {
  assert.equal(isSeedFallbackAllowed({ nodeEnv: "development", allowFixtureData: "YES" }), true);
  assert.equal(isSeedFallbackAllowed({ nodeEnv: "development" }), false);
  assert.equal(
    isSeedFallbackAllowed({
      nodeEnv: "production",
      vercelEnv: "production",
      allowFixtureData: "YES",
    }),
    false,
  );
  assert.equal(
    isSeedFallbackAllowed({
      nodeEnv: "production",
      vercelEnv: "preview",
      allowFixtureData: "YES",
    }),
    false,
  );
});
