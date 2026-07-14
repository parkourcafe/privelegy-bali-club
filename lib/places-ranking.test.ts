import assert from "node:assert/strict";
import test from "node:test";
import {
  rankPlacesForBrief,
  scorePlaceForBrief,
  type RankablePlace,
} from "./places-ranking";

const base: RankablePlace = {
  slug: "base-cafe",
  name: "Base Cafe",
  category: "cafe",
  district: "canggu",
  area: "Berawa",
  whyItsHere: "A quiet morning stop.",
  bestFor: "Laptop work",
  vibeTags: ["quiet"],
  practicalTags: ["fast wifi"],
  jobs: ["work"],
};

const combinations: Array<{
  name: string;
  venue?: Partial<RankablePlace>;
  tokens?: string[];
  category?: string | null;
  district?: string | null;
  expectedFit: number;
}> = [
  { name: "no criteria", expectedFit: 0 },
  { name: "direct category", category: "cafe", expectedFit: 30 },
  { name: "wellness category", venue: { wellnessCategories: ["yoga"] }, category: "yoga", expectedFit: 30 },
  { name: "wrong category", category: "bar", expectedFit: 0 },
  { name: "name token", tokens: ["base"], expectedFit: 20 },
  { name: "area token", tokens: ["berawa"], expectedFit: 20 },
  { name: "category token", tokens: ["cafe"], expectedFit: 20 },
  { name: "district token", tokens: ["canggu"], expectedFit: 20 },
  { name: "editorial token", tokens: ["morning"], expectedFit: 20 },
  { name: "best-for token", tokens: ["laptop"], expectedFit: 20 },
  { name: "vibe token", tokens: ["quiet"], expectedFit: 20 },
  { name: "practical token", tokens: ["wifi"], expectedFit: 20 },
  { name: "job token", tokens: ["work"], expectedFit: 20 },
  { name: "two matching tokens", tokens: ["quiet", "wifi"], expectedFit: 40 },
  { name: "one matching and one absent", tokens: ["quiet", "sunset"], expectedFit: 20 },
  { name: "district criterion", district: "canggu", expectedFit: 10 },
  { name: "wrong district", district: "ubud", expectedFit: 0 },
  { name: "category plus token", category: "cafe", tokens: ["quiet"], expectedFit: 50 },
  { name: "category token is not double-counted as a reason", category: "cafe", tokens: ["cafe"], expectedFit: 50 },
  { name: "all explicit signals", category: "cafe", tokens: ["quiet", "wifi"], district: "canggu", expectedFit: 80 },
];

test("ranking covers twenty explicit brief combinations", async (t) => {
  assert.equal(combinations.length, 20);
  for (const item of combinations) {
    await t.test(item.name, () => {
      const score = scorePlaceForBrief(
        { ...base, ...item.venue },
        item.tokens ?? [],
        item.category ?? null,
        item.district ?? null,
      );
      assert.equal(score.fitScore, item.expectedFit);
    });
  }
});

test("commercial relationship fields cannot affect organic order", () => {
  const founding = { ...base, slug: "founding", name: "Zulu", tier: "founding", isSponsored: true };
  const editorial = { ...base, slug: "editorial", name: "Alpha", tier: "editorial_seed", isSponsored: false };
  const ranked = rankPlacesForBrief([founding, editorial], ["quiet"], null, null);
  assert.deepEqual(ranked.map(({ venue }) => venue.slug), ["editorial", "founding"]);
  assert.equal(ranked[0]?.fitScore, ranked[1]?.fitScore);
  assert.equal(ranked[0]?.editorialCompleteness, ranked[1]?.editorialCompleteness);
});

test("editorial completeness is only a disclosed tie-break after fit", () => {
  const strongerFit = { ...base, slug: "strong", name: "Strong", photoUrl: undefined };
  const completeWeakFit = {
    ...base,
    slug: "weak",
    name: "Weak",
    whyItsHere: "Sunset only.",
    bestFor: "Dinner",
    vibeTags: ["quiet"],
    practicalTags: [],
    jobs: [],
    photoUrl: "https://images.example.org/venue.jpg",
    priceAnchor: "IDR 100k",
  };
  const ranked = rankPlacesForBrief([completeWeakFit, strongerFit], ["quiet", "wifi"], null, null);
  assert.equal(ranked[0]?.venue.slug, "strong");
  assert.equal(ranked[0]?.editorialRankReason, null);
  assert.equal(ranked[1]?.editorialRankReason, null);

  const equalFitIncomplete = {
    ...base,
    slug: "equal-incomplete",
    name: "Equal incomplete",
    bestFor: undefined,
    photoUrl: undefined,
    priceAnchor: undefined,
    whatToOrder: undefined,
  };
  const equalFitComplete = {
    ...base,
    slug: "equal-complete",
    name: "Equal complete",
    photoUrl: "https://images.example.org/venue.jpg",
    priceAnchor: "IDR 100k",
  };
  const tied = rankPlacesForBrief(
    [equalFitIncomplete, equalFitComplete],
    ["quiet"],
    null,
    null,
  );
  assert.deepEqual(tied.map(({ venue }) => venue.slug), ["equal-complete", "equal-incomplete"]);
  assert.match(tied[0]?.editorialRankReason ?? "", /Equal-fit tie-break/);
  assert.match(tied[1]?.editorialRankReason ?? "", /Equal-fit tie-break/);
});
