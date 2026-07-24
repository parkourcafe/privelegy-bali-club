import assert from "node:assert/strict";
import test from "node:test";
import {
  PRODUCTION_SUPABASE_PROJECT_REF,
  PROTECTED_PREVIEW_MEDIA_APPROVAL,
  PROTECTED_VENUE_PREVIEW_BRANCH,
  isProtectedPreviewProductionMediaAllowed,
} from "./protected-preview-media-policy";

const productionUrl = `https://${PRODUCTION_SUPABASE_PROJECT_REF}.supabase.co`;

test("permits only the explicitly approved protected preview branch", () => {
  assert.equal(
    isProtectedPreviewProductionMediaAllowed({
      url: productionUrl,
      vercelEnv: "preview",
      gitCommitRef: PROTECTED_VENUE_PREVIEW_BRANCH,
      approval: PROTECTED_PREVIEW_MEDIA_APPROVAL,
    }),
    true,
  );
});

test("rejects production, other branches and missing approval", () => {
  const base = {
    url: productionUrl,
    vercelEnv: "preview",
    gitCommitRef: PROTECTED_VENUE_PREVIEW_BRANCH,
    approval: PROTECTED_PREVIEW_MEDIA_APPROVAL,
  };

  assert.equal(
    isProtectedPreviewProductionMediaAllowed({
      ...base,
      vercelEnv: "production",
    }),
    false,
  );
  assert.equal(
    isProtectedPreviewProductionMediaAllowed({
      ...base,
      gitCommitRef: "main",
    }),
    false,
  );
  assert.equal(
    isProtectedPreviewProductionMediaAllowed({
      ...base,
      approval: undefined,
    }),
    false,
  );
});

test("rejects lookalike, non-production and malformed Supabase hosts", () => {
  const base = {
    vercelEnv: "preview",
    gitCommitRef: PROTECTED_VENUE_PREVIEW_BRANCH,
    approval: PROTECTED_PREVIEW_MEDIA_APPROVAL,
  };

  for (const url of [
    `http://${PRODUCTION_SUPABASE_PROJECT_REF}.supabase.co`,
    `https://${PRODUCTION_SUPABASE_PROJECT_REF}.supabase.co.evil.example`,
    "https://preview-project.supabase.co",
    "not-a-url",
  ]) {
    assert.equal(
      isProtectedPreviewProductionMediaAllowed({ ...base, url }),
      false,
    );
  }
});
