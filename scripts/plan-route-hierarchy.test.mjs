import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";

const planSource = readFileSync("app/plan/page.tsx", "utf8");

async function assertDecodableWebp(path) {
  const image = sharp(path);
  const metadata = await image.metadata();
  assert.equal(metadata.format, "webp", `${path} is not WebP`);
  assert.equal(metadata.width, 1200, `${path} has the wrong width`);
  assert.equal(metadata.height, 896, `${path} has the wrong height`);
  const pixels = await image.clone().raw().toBuffer();
  assert.ok(pixels.length > 0, `${path} did not decode to pixels`);
}

test("Plan separates published routes into Bali-wide and Canggu practical choices", () => {
  assert.match(planSource, /const baliWideRoutes = routes\.filter\(\(route\) => route\.district !== "canggu"\)/);
  assert.match(planSource, /const cangguRoutes = routes\.filter\(\(route\) => route\.district === "canggu"\)/);
  assert.match(planSource, /Bali-wide day routes/);
  assert.match(planSource, /Canggu practical routes/);
});

test("Plan replaces generic section banners with route-specific media cards without public AI labels", () => {
  assert.doesNotMatch(planSource, /GuideSectionMedia seed="plan bali trip length guides"/);
  assert.doesNotMatch(planSource, /GuideSectionMedia seed="plan ready made routes bali"/);
  assert.match(planSource, /<PlanRouteCard key=\{route\.slug\} route=\{route\} \/>/);

  const cardPath = "components/PlanRouteCard.tsx";
  assert.ok(existsSync(cardPath), `missing ${cardPath}`);
  const cardSource = readFileSync(cardPath, "utf8");
  for (const slug of [
    "first-day",
    "ubud-culture-day",
    "bangli-temple-village-day",
    "east-bali-heritage-day",
    "canggu-food-route",
    "canggu-rainy-day",
    "cafe-work",
    "sunset-run",
  ]) {
    assert.match(cardSource, new RegExp(`"${slug}"`), `missing route media mapping: ${slug}`);
  }
  assert.doesNotMatch(cardSource, /Illustrative route/);
  assert.match(cardSource, /route\.district/);
  assert.match(cardSource, /route\.stopCount/);
  assert.match(cardSource, /Open route/);
});

test("Plan route cards use a bounded responsive grid without hidden horizontal choices", () => {
  const css = readFileSync("app/globals.css", "utf8");
  assert.match(css, /\.plan-route-grid\s*\{[\s\S]*?display:\s*grid;/);
  assert.match(css, /\.plan-route-card\s*\{[\s\S]*?position:\s*relative;[\s\S]*?aspect-ratio:\s*4\s*\/\s*3;[\s\S]*?overflow:\s*hidden;/);
  assert.match(css, /@media \(min-width:\s*760px\)[\s\S]*?\.plan-route-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,/);
  assert.doesNotMatch(css, /\.plan-route-grid\s*\{[^}]*overflow-x:/);
  assert.match(css, /\.plan-route-meta\s*\{[\s\S]*?min-height:\s*44px;/);
});

test("Plan explains the choice order before presenting routes", () => {
  assert.match(planSource, /Start with trip length/);
  assert.match(planSource, /Choose the shape of your trip/);
  assert.match(planSource, /Pick one complete day/);
  assert.match(planSource, /className="plan-route-group"/);
  assert.match(planSource, /className="plan-route-group-title"/);
  assert.match(planSource, /Across Bali, with a clear area and a realistic number of stops\./);
  assert.match(planSource, /Lower-friction days using the area with the deepest active guidance\./);
});

test("Every plan route scene has reproducible AI-illustrative provenance", () => {
  const fetchSource = readFileSync("scripts/fetch-scenes.mjs", "utf8");
  const manifestPath = "docs/media/plan-route-media-manifest.md";
  assert.ok(existsSync(manifestPath), `missing ${manifestPath}`);
  const manifest = readFileSync(manifestPath, "utf8");
  for (const scene of [
    "plan-route-first-day",
    "plan-route-ubud-culture",
    "plan-route-bangli-temple-village",
    "plan-route-east-bali-heritage",
    "plan-route-canggu-food",
    "plan-route-canggu-rain",
    "plan-route-cafe-work",
    "plan-route-sunset-run",
  ]) {
    assert.match(fetchSource, new RegExp(`"${scene}"`), `missing fetch source: ${scene}`);
    assert.match(manifest, new RegExp(`\\| \`${scene}\` \\|`), `missing manifest row: ${scene}`);
  }
  assert.match(manifest, /AI illustrative/);
  assert.match(manifest, /must not be used as factual place proof/);
});

test("Every plan route scene fully decodes at the reviewed dimensions", async () => {
  for (const scene of [
    "plan-route-first-day",
    "plan-route-ubud-culture",
    "plan-route-bangli-temple-village",
    "plan-route-east-bali-heritage",
    "plan-route-canggu-food",
    "plan-route-canggu-rain",
    "plan-route-cafe-work",
    "plan-route-sunset-run",
  ]) {
    await assertDecodableWebp(`public/scenes/${scene}.webp`);
  }
});
