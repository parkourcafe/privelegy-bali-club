import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Source-level boundary test for the /canggu/<guide> answer-first rewrite.
// It guards the two things that make the block safe to publish: every named
// pick is gated against the venues actually rendered, and freshness comes from
// recorded venue evidence rather than a build timestamp (AGENTS §13, §18).

const guideView = await readFile(new URL("../components/CangguGuideView.tsx", import.meta.url), "utf8");
const guideData = await readFile(new URL("../lib/canggu-guides.ts", import.meta.url), "utf8");
const placeCard = await readFile(new URL("../components/PlaceCard.tsx", import.meta.url), "utf8");
const cangguData = await readFile(new URL("../lib/canggu.ts", import.meta.url), "utf8");
const globalCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

test("the answer block only promises venues the page actually renders", () => {
  assert.match(guideView, /const shown = new Map\(/);
  assert.match(guideView, /guide\.answer\?\.picks\.filter\(\(p\) => shown\.has\(p\.slug\)\)/);
  assert.match(guideView, /answerPicks\.length > 0 &&/);
  // Names are read from the rendered venue, never re-typed into the copy.
  assert.match(guideView, /shown\.get\(pick\.slug\)!\.name/);
  assert.doesNotMatch(guideData, /name:\s*"/);
});

test("page freshness comes from recorded venue evidence, not the build", () => {
  assert.match(guideView, /publicVenueVerifiedAt\(\{ venueVerifiedAt: v\.lastVerifiedAt \}\)/);
  assert.doesNotMatch(guideView, /Date\.now\(\)|new Date\(\)\.toLocale/);
  // Absent evidence must render no date at all rather than a guessed one.
  assert.match(guideView, /lastChecked\s*\n?\s*\?/);
});

test("fit context shows both halves on the guide card", () => {
  assert.match(placeCard, /notFor\?: string;/);
  assert.match(placeCard, /<strong>Not for:<\/strong> \{place\.notFor\}/);
  // Only when the venue record carries the copy — never a placeholder.
  assert.match(placeCard, /!visualFirst && place\.notFor &&/);
  assert.match(cangguData, /notFor: v\.notFor,/);
  assert.match(globalCss, /\.place-card-fit-not \{/);
});

test("the brunch answer states only facts the venue records carry", () => {
  const brunch = guideData.slice(guideData.indexOf('slug: "best-brunch"'), guideData.indexOf('slug: "best-warungs"'));
  // Slug-addressed picks only.
  for (const slug of ["hungry-bird-coffee", "brunch-club-pererenan", "zin-cafe-canggu", "secret-spot-bali", "the-lawn-canggu-beach-club"]) {
    assert.ok(brunch.includes(`slug: "${slug}"`), `${slug} must be addressed by slug`);
  }
  // No unfilled placeholder may ever reach public copy.
  assert.doesNotMatch(brunch, /\[\?\]|\[дата\]|\bTBD\b|\bTODO\b/);
  // No district-wide opening-hours or price estimate — only named venues.
  assert.doesNotMatch(brunch, /most caf[eé]s open/i);
  assert.doesNotMatch(brunch, /around 7[–-]8\s?am/i);
});

test("the trust line counts places in grammatical English", () => {
  assert.match(guideView, /shown\.size === 1 \? "place" : "places"/);
});

test("the guide answer block has styling and does not overflow mobile", () => {
  assert.match(globalCss, /\.guide-answer \{/);
  assert.match(globalCss, /\.guide-answer-picks \{/);
  assert.match(globalCss, /\.guide-answer-trust \{/);
  const start = globalCss.indexOf(".guide-answer {");
  const block = globalCss.slice(start, globalCss.indexOf("}", globalCss.indexOf(".guide-answer-trust {")) + 1);
  assert.match(block, /max-width:/);
  assert.doesNotMatch(block, /white-space:\s*nowrap|overflow-x:\s*auto|(?<!max-|min-)\bwidth:\s*\d+px/);
});
