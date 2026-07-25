import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";

const pageSource = await readFile(new URL("../app/canggu/page.tsx", import.meta.url), "utf8");
const cangguDataSource = await readFile(new URL("../lib/canggu.ts", import.meta.url), "utf8");
const cangguNowSource = await readFile(new URL("../components/CangguNow.tsx", import.meta.url), "utf8");
const shortlistSource = await readFile(new URL("../components/StartYourShortlist.tsx", import.meta.url), "utf8");
const guideBlocksSource = await readFile(new URL("../components/GuideBlocks.tsx", import.meta.url), "utf8");
const globalCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const fetchScenesSource = await readFile(new URL("./fetch-scenes.mjs", import.meta.url), "utf8");
const cangguBatch = JSON.parse(
  await readFile(new URL("../docs/media/higgsfield-canggu-visual-first-batch.json", import.meta.url), "utf8"),
);
const combinedCangguSource = `${pageSource}\n${cangguNowSource}`;
const expectedMedia = [
  "canggu-hero-illustrative.webp",
  "canggu-restaurants-illustrative.webp",
  "canggu-cafes-illustrative.webp",
  "canggu-spas-illustrative.webp",
  "canggu-sunset-illustrative.webp",
];

test("Canggu illustrative media is unique, present, and disclosed", async () => {
  for (const filename of expectedMedia) {
    const references = combinedCangguSource.match(new RegExp(filename, "g")) ?? [];
    assert.ok(references.length >= 1, `${filename} must remain mapped to Canggu`);

    const asset = new URL(`../public/scenes/${filename}`, import.meta.url);
    assert.ok((await stat(asset)).size > 0, `${filename} must be a non-empty asset`);
    const bytes = await readFile(asset);
    assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", `${filename} must be a WebP container`);
    assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", `${filename} must be a WebP container`);
  }

  assert.match(combinedCangguSource, /generated with Higgsfield/);
  assert.match(combinedCangguSource, /not evidence of a specific place/);
  assert.match(combinedCangguSource, /not a specific venue/);
});

test("Canggu keeps factual venue cards separate from illustrative media", () => {
  assert.match(pageSource, /<PlaceCard key=\{v\.slug\} place=\{toCangguPlaceCard\(v\)\} visualFirst \/>/);
  assert.doesNotMatch(pageSource, /photoUrl=.*illustrative/);
  assert.doesNotMatch(cangguDataSource, /getCangguApprovedPhotoUrls|isReachableProjectPhoto|\.select\("slug,photo_url"\)/);
  assert.match(cangguDataSource, /const all = await getPublishedVenues\(\)/);
});

test("Canggu top picks do not repeat a venue across decision modules", () => {
  assert.match(pageSource, /usedTopPickSlugs/);
  assert.match(pageSource, /if \(usedTopPickSlugs\.has\(venue\.slug\)\) continue/);
});

test("Canggu now is six media-first choices rather than a twelve-card text directory", () => {
  assert.equal((cangguNowSource.match(/imageSrc:/g) ?? []).length, 6);
  assert.equal((cangguNowSource.match(/data-canggu-moment-card/g) ?? []).length, 1);
  assert.match(cangguNowSource, /data-media-copy/);
  assert.match(cangguNowSource, /Illustrative scenarios/);
  assert.match(cangguNowSource, /const CANGGU_NOW_UTILITIES = \[/);
  for (const utility of ["Near me", "First day", "With kids", "Saved", "My perks"]) {
    assert.match(cangguNowSource, new RegExp(utility));
  }
  assert.match(cangguNowSource, /className="canggu-utility-links"/);
});

test("Canggu shortlist uses factual visual place cards and removes the long definition list", () => {
  assert.match(shortlistSource, /visualPlaces\?: PlaceCardData\[\]/);
  assert.match(shortlistSource, /<PlaceCard key=\{place\.slug\} place=\{place\} visualFirst \/>/);
  assert.match(pageSource, /visualPlaces=\{shortlistPlaces\}/);
  assert.doesNotMatch(shortlistSource, /<dl/);
});

test("Canggu replaces prose, table and dark text CTA with visual decision modules", () => {
  assert.equal((pageSource.match(/data-canggu-area-card/g) ?? []).length, 1);
  assert.equal((pageSource.match(/data-canggu-practical-card/g) ?? []).length, 1);
  assert.equal((pageSource.match(/imageSrc:/g) ?? []).length, 8, "four area and four practical mappings expected");
  assert.match(pageSource, /data-canggu-visual-cta/);
  assert.doesNotMatch(pageSource, /Who Canggu suits|compare-table|className="cta-band"/);
  assert.match(globalCss, /\.canggu-visual-card/);
  assert.match(globalCss, /aspect-ratio:\s*4\s*\/\s*5/);
});

test("Canggu image sizes follow the actual one-to-multi-column breakpoints", () => {
  assert.match(cangguNowSource, /\(max-width: 759px\) calc\(\(100vw - 3\.5rem\) \/ 2\), \(max-width: 1199px\) calc\(\(100vw - 5rem\) \/ 3\), 360px/);
  assert.equal(
    (pageSource.match(/\(max-width: 759px\) calc\(100vw - 2rem\), \(max-width: 1199px\) calc\(\(100vw - 5rem\) \/ 4\), 270px/g) ?? []).length,
    2,
  );
  assert.match(guideBlocksSource, /\(max-width: 759px\) calc\(100vw - 2rem\), \(max-width: 1199px\) calc\(\(100vw - 4rem\) \/ 3\), 360px/);
});

test("Canggu provenance records an ordered UTC window and truthful source retention", () => {
  assert.equal(typeof cangguBatch.generatedStartedAtUtc, "string");
  assert.equal(typeof cangguBatch.generatedCompletedAtUtc, "string");
  const startedAt = Date.parse(cangguBatch.generatedStartedAtUtc);
  const completedAt = Date.parse(cangguBatch.generatedCompletedAtUtc);
  assert.ok(Number.isFinite(startedAt));
  assert.ok(Number.isFinite(completedAt));
  assert.ok(startedAt <= completedAt);
  assert.equal(cangguBatch.generatedAtUtc, undefined);
  assert.match(cangguBatch.sourceUrlRetention, /reproducible from the committed BASE path/);
  assert.doesNotMatch(cangguBatch.sourceUrlRetention, /omitted/i);
});

test("Canggu area and practical media is reproducible and fully decodable", async () => {
  assert.equal(cangguBatch.classification, "AI_ILLUSTRATIVE_ALLOWED");
  assert.equal(cangguBatch.assets.length, 8);
  for (const asset of cangguBatch.assets) {
    assert.match(pageSource, new RegExp(`${asset.sceneId}\\.webp`));
    assert.match(fetchScenesSource, new RegExp(asset.sceneId));
    assert.match(fetchScenesSource, new RegExp(asset.sourceFile.replaceAll(".", "\\.")));

    const output = new URL(`../${asset.output}`, import.meta.url);
    const bytes = await readFile(output);
    assert.equal(bytes.length, asset.bytes, `${asset.sceneId} byte count drifted`);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, `${asset.sceneId} hash drifted`);

    const image = sharp(bytes);
    const metadata = await image.metadata();
    assert.equal(metadata.format, "webp", `${asset.sceneId} is not WebP`);
    assert.equal(metadata.width, 900, `${asset.sceneId} has the wrong width`);
    assert.equal(metadata.height, 1200, `${asset.sceneId} has the wrong height`);
    assert.ok((await image.raw().toBuffer()).length > 0, `${asset.sceneId} did not decode to pixels`);
  }
});

test("Canggu guide grids are media-enabled and use only versioned valid scene paths", () => {
  assert.match(guideBlocksSource, /mediaSrc\?: string/);
  assert.match(guideBlocksSource, /<Image/);
  assert.match(guideBlocksSource, /data-media-copy/);
  assert.match(pageSource, /withCangguGuideMedia/);
  assert.match(pageSource, /home-bali-first-day\.webp/);
  assert.doesNotMatch(combinedCangguSource, /\/scenes\/home-(?!bali-)[a-z-]+\.webp/);
});
