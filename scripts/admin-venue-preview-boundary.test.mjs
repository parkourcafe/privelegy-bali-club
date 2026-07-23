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

test("protected preview is admin-gated and noindex", () => {
  assert.match(adminLayout, /isCurrentAdminRequestAuthorized/);
  assert.match(page, /robots:\s*\{\s*index:\s*false/);
  assert.match(page, /PropertyMediaUploader/);
});

test("protected preview reads the staged research source only", () => {
  assert.match(data, /\.from\("venue_submissions"\)/);
  assert.match(data, /\.eq\("source", DEMO_PREVIEW_SOURCE\)/);
  assert.match(data, /otherbali-research-2026-07-23/);
  assert.doesNotMatch(data, /\.from\("venues"\)/);
  assert.doesNotMatch(data, /\.update\(/);
  assert.doesNotMatch(data, /\.insert\(/);
});

test("accepted submission upload requires independent operator authorization", () => {
  assert.match(uploadRoute, /status === "accepted"/);
  assert.match(uploadRoute, /isCurrentAdminRequestAuthorized/);
  assert.match(uploadRoute, /acceptedOperatorPreview/);
});
