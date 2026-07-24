import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/canggu/page.tsx", import.meta.url), "utf8");
const cangguDataSource = await readFile(new URL("../lib/canggu.ts", import.meta.url), "utf8");
const expectedMedia = [
  "canggu-hero-illustrative.webp",
  "canggu-restaurants-illustrative.webp",
  "canggu-cafes-illustrative.webp",
  "canggu-spas-illustrative.webp",
  "canggu-sunset-illustrative.webp",
];

test("Canggu illustrative media is unique, present, and disclosed", async () => {
  for (const filename of expectedMedia) {
    const references = pageSource.match(new RegExp(filename, "g")) ?? [];
    assert.equal(references.length, 1, `${filename} must be referenced exactly once`);

    const asset = new URL(`../public/scenes/${filename}`, import.meta.url);
    assert.ok((await stat(asset)).size > 0, `${filename} must be a non-empty asset`);
  }

  assert.match(pageSource, /generated with Higgsfield/);
  assert.match(pageSource, /not evidence of a specific place/);
  assert.match(pageSource, /not a specific venue/);
});

test("Canggu keeps factual venue cards separate from illustrative media", () => {
  assert.match(pageSource, /<PlaceCard key=\{v\.slug\} place=\{toCangguPlaceCard\(v\)\} visualFirst \/>/);
  assert.doesNotMatch(pageSource, /photoUrl=.*illustrative/);
  assert.match(cangguDataSource, /getCangguApprovedPhotoUrls/);
  assert.match(cangguDataSource, /publication_status", "published"/);
  assert.match(cangguDataSource, /isReachableProjectPhoto/);
});

test("Canggu top picks do not repeat a venue across decision modules", () => {
  assert.match(pageSource, /usedTopPickSlugs/);
  assert.match(pageSource, /if \(usedTopPickSlugs\.has\(venue\.slug\)\) continue/);
});
