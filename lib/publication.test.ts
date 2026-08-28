import assert from "node:assert/strict";
import test from "node:test";
import type { Venue } from "./types";
import {
  assessVenuePublication,
  decideVenuePublication,
  getPublicationStatus,
  isVenueIndexable,
  isVenueIndexableInMode,
  VENUE_PUBLICATION_GATE_MODE,
} from "./publication";

function venue(overrides: Partial<Venue> = {}): Venue {
  return {
    id: "venue-1",
    slug: "decision-ready-venue",
    name: "Decision Ready Venue",
    category: "restaurant",
    district: "ubud",
    address: "Ubud, Bali",
    gmapsUrl: "https://maps.google.com/?q=Ubud",
    tier: "editorial_seed",
    status: "active",
    publicationStatus: "published",
    isSponsored: false,
    whyItsHere: "A verified editorial reason to choose this place.",
    bestFor: "A calm dinner.",
    priceAnchor: "Mains from IDR 90k",
    ...overrides,
  };
}

test("shadow mode keeps hard publication blockers enforced", () => {
  const published = venue();
  assert.equal(VENUE_PUBLICATION_GATE_MODE, "shadow");
  assert.equal(getPublicationStatus(published), "published");
  assert.equal(isVenueIndexable(published), true);

  for (const candidate of [
    venue({ status: "inactive" }),
    venue({ publicationStatus: "review" }),
    venue({ category: "future_typo" as Venue["category"] }),
  ]) {
    assert.equal(getPublicationStatus(candidate), "review");
    assert.equal(isVenueIndexable(candidate), false);
  }
});

test("reports quality gaps without mass-removing pages during shadow rollout", () => {
  const candidate = venue({
    address: "",
    gmapsUrl: "",
    whatToOrder: "",
    priceAnchor: "",
  });
  const assessment = assessVenuePublication(candidate);

  assert.deepEqual(assessment, {
    status: "review",
    issues: ["missing_address", "missing_verified_map", "missing_offering_anchor"],
  });
  assert.deepEqual(decideVenuePublication(candidate), {
    mode: "shadow",
    effectiveStatus: "published",
    strictStatus: "review",
    issues: ["missing_address", "missing_verified_map", "missing_offering_anchor"],
  });
  assert.equal(getPublicationStatus(candidate), "published");
  assert.equal(isVenueIndexable(candidate), true);
  assert.equal(decideVenuePublication(candidate, "enforce").effectiveStatus, "review");
  assert.equal(isVenueIndexableInMode(candidate, "enforce"), false);
});

test("does not treat a generated Maps search fallback as verified evidence", () => {
  const candidate = venue({
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Example+Ubud+Bali",
    mapsHandoffKind: "search_fallback",
  } as Partial<Venue> & { mapsHandoffKind: "search_fallback" });

  assert.deepEqual(assessVenuePublication(candidate).issues, ["missing_verified_map"]);
  assert.equal(decideVenuePublication(candidate).effectiveStatus, "published");
});

test("shadow assessment keeps template and internal-copy reason codes", () => {
  for (const candidate of [
    venue({ whyItsHere: "Found online as a restaurant in the DB entry." }),
    venue({ bestFor: "Travellers looking for a current place to eat in Ubud." }),
    venue({ priceAnchor: "Unknown", whatToOrder: "undefined" }),
  ]) {
    const decision = decideVenuePublication(candidate);
    assert.equal(decision.strictStatus, "review");
    assert.equal(decision.effectiveStatus, "published");
    assert.ok(decision.issues.length > 0);
  }
});

test("keeps the Uluwatu evidence registry authoritative for registered venues", () => {
  const held = venue({
    slug: "ulu-artisan-ungasan",
    district: "uluwatu-bukit",
  });
  const published = venue({
    slug: "alchemy-uluwatu",
    district: "uluwatu-bukit",
  });

  assert.deepEqual(decideVenuePublication(held).issues, ["registry_not_published"]);
  assert.equal(isVenueIndexable(held), false);
  assert.equal(isVenueIndexable(published), true);
});

test("a complete Bali-wide villa remains indexable without weakening editorial gates", () => {
  const villa = venue({
    slug: "big-dragon-villas-ubud",
    name: "Big Dragon Villas Ubud",
    category: "villa",
  });

  assert.equal(isVenueIndexable(villa), true);
});

test("an unknown runtime category cannot be indexed outside the catalogue boundary", () => {
  const invalid = venue({
    slug: "future-category-typo",
    category: "future_typo" as Venue["category"],
  });

  assert.equal(getPublicationStatus(invalid), "review");
  assert.equal(isVenueIndexable(invalid), false);
});
