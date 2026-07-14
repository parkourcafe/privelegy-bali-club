import assert from "node:assert/strict";
import test from "node:test";
import {
  KNOWN_PRODUCTION_PROJECT_REF,
  validateBrowserStagingEnvironment,
} from "./ci-validate-browser-staging.mjs";

const valid = {
  VERCEL_ENV: "preview",
  NEXT_PUBLIC_SUPABASE_URL: "https://abcdefghijklmnopqrst.supabase.co/",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-key",
  GUEST_REF_SIGNING_SECRET: "a-secure-staging-secret-of-32-characters",
  OTHER_BALI_PREVIEW_SUPABASE_PROJECT_REF: "abcdefghijklmnopqrst",
};

test("accepts only a matching isolated preview Supabase target", () => {
  assert.deepEqual(validateBrowserStagingEnvironment(valid), {
    projectRef: "abcdefghijklmnopqrst",
    hostname: "abcdefghijklmnopqrst.supabase.co",
  });
  assert.throws(() => validateBrowserStagingEnvironment({
    ...valid,
    NEXT_PUBLIC_SUPABASE_URL: `https://${KNOWN_PRODUCTION_PROJECT_REF}.supabase.co/`,
    OTHER_BALI_PREVIEW_SUPABASE_PROJECT_REF: KNOWN_PRODUCTION_PROJECT_REF,
  }), /production Supabase is forbidden/);
  assert.throws(() => validateBrowserStagingEnvironment({
    ...valid,
    NEXT_PUBLIC_SUPABASE_URL: "https://differentprojectref.supabase.co/",
  }), /does not match/);
});

test("fails closed when any protected staging value is absent or unsafe", () => {
  assert.throws(() => validateBrowserStagingEnvironment({
    ...valid,
    SUPABASE_SERVICE_ROLE_KEY: "",
  }), /missing staging configuration/);
  assert.throws(() => validateBrowserStagingEnvironment({
    ...valid,
    VERCEL_ENV: "production",
  }), /VERCEL_ENV=preview/);
  assert.throws(() => validateBrowserStagingEnvironment({
    ...valid,
    GUEST_REF_SIGNING_SECRET: "short",
  }), /at least 32/);
});
