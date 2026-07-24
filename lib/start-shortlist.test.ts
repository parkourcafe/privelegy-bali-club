import test from "node:test";
import assert from "node:assert/strict";
import { buildStartShortlist } from "./start-shortlist";
import type { VenueWithPerk } from "./data";

function venue(overrides: Partial<VenueWithPerk> & Pick<VenueWithPerk, "slug" | "name">): VenueWithPerk {
  return {
    id: overrides.slug,
    category: "restaurant",
    district: "canggu",
    address: "Bali",
    gmapsUrl: "https://maps.google.com/",
    tier: "editorial_seed",
    isSponsored: false,
    publicationStatus: "published",
    whyItsHere: "A clear editorial reason.",
    bestFor: "Couples and small groups",
    jobs: ["date_night"],
    perk: null,
    blurb: "Editorial",
    ...overrides,
  };
}

test("shortlist requires decision-ready editorial fields", () => {
  const result = buildStartShortlist([
    venue({ slug: "ready", name: "Ready" }),
    venue({ slug: "missing-why", name: "Missing why", whyItsHere: undefined }),
    venue({ slug: "missing-audience", name: "Missing audience", bestFor: undefined }),
  ]);
  assert.deepEqual(result.map((item) => item.slug), ["ready"]);
});

test("sponsored state never changes shortlist order", () => {
  const organic = venue({ slug: "a", name: "Alpha", isSponsored: false });
  const sponsored = venue({ slug: "z", name: "Zulu", isSponsored: true });
  assert.deepEqual(buildStartShortlist([sponsored, organic]).map((item) => item.slug), ["a", "z"]);
});

test("shortlist exposes the four required decision fields", () => {
  const [item] = buildStartShortlist([venue({ slug: "one", name: "One" })]);
  assert.equal(item.whyThisPlace, "A clear editorial reason.");
  assert.equal(item.bestMoment, "Date night");
  assert.equal(item.bestAudience, "Couples and small groups");
  assert.deepEqual(item.primaryAction, { label: "View place", href: "/places/one" });
});
