import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(
  new URL("../app/admin/venue-preview/page.tsx", import.meta.url),
  "utf8",
);
const data = await readFile(
  new URL("../app/admin/venue-preview/data.ts", import.meta.url),
  "utf8",
);
const adminLayout = await readFile(
  new URL("../app/admin/layout.tsx", import.meta.url),
  "utf8",
);
const uploadRoute = await readFile(
  new URL(
    "../app/api/list-your-property/media/create-upload/route.ts",
    import.meta.url,
  ),
  "utf8",
);
const finalizeRoute = await readFile(
  new URL(
    "../app/api/list-your-property/media/finalize/route.ts",
    import.meta.url,
  ),
  "utf8",
);
const serviceModule = await readFile(
  new URL("../lib/supabase/service.ts", import.meta.url),
  "utf8",
);
const mediaPolicy = await readFile(
  new URL(
    "../lib/supabase/protected-preview-media-policy.ts",
    import.meta.url,
  ),
  "utf8",
);
const submissionMediaPolicy = await readFile(
  new URL("../lib/submission-media-policy.ts", import.meta.url),
  "utf8",
);
const uploader = await readFile(
  new URL("../components/PropertyMediaUploader.tsx", import.meta.url),
  "utf8",
);

test("protected preview is admin-gated and noindex", () => {
  assert.match(adminLayout, /isCurrentAdminRequestAuthorized/);
  assert.match(page, /robots:\s*\{\s*index:\s*false/);
  assert.match(page, /PropertyMediaUploader/);
});

test("protected preview reads the staged research source only", () => {
  assert.match(data, /\.from\("venue_submissions"\)/);
  assert.match(data, /\.eq\("source", DEMO_PREVIEW_SOURCE\)/);
  assert.match(mediaPolicy, /otherbali-research-2026-07-23/);
  assert.doesNotMatch(data, /\.from\("venues"\)/);
  assert.doesNotMatch(data, /\.update\(/);
  assert.doesNotMatch(data, /\.insert\(/);
});

test("accepted submission upload requires independent operator authorization", () => {
  assert.match(uploadRoute, /status === "accepted"/);
  assert.match(uploadRoute, /isCurrentAdminRequestAuthorized/);
  assert.match(uploadRoute, /acceptedOperatorPreview/);
});

test("production preview service-role access remains media-capability-only", () => {
  assert.match(data, /submissionMediaServiceClient/);
  assert.match(uploadRoute, /submissionMediaServiceClient/);
  assert.match(finalizeRoute, /submissionMediaServiceClient/);
  assert.match(
    serviceModule,
    /OTHER_BALI_PROTECTED_PREVIEW_PRODUCTION_SUBMISSION_MEDIA_WRITE/,
  );
  assert.match(mediaPolicy, /codex\/protected-venue-preview-2026-07-23/);
  assert.match(mediaPolicy, /egkdapqwkfprtyqvvnso/);
  assert.match(uploadRoute, /PROTECTED_PREVIEW_SUBMISSION_SOURCE/);
  assert.match(finalizeRoute, /PROTECTED_PREVIEW_SUBMISSION_SOURCE/);
  assert.doesNotMatch(
    serviceModule.match(/export function serviceClient[\s\S]*?^}/m)?.[0] ?? "",
    /PROTECTED_PREVIEW_PRODUCTION_SUBMISSION_MEDIA_WRITE/,
  );
});

test("protected uploader and server enforce the same 50-photo limit", () => {
  assert.match(submissionMediaPolicy, /MAX_SUBMISSION_PHOTOS = 50/);
  assert.match(uploader, /MAX_PHOTOS = 50/);
  assert.match(uploader, /Up to 50 photos/);
});
