import assert from "node:assert/strict";
import test from "node:test";
import type { Venue } from "./types";
import { getPublicationStatus, isVenueIndexable } from "./publication";

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
    ...overrides,
  };
}

test("indexes only active, database-published, decision-ready venues", () => {
  const published = venue();
  assert.equal(getPublicationStatus(published), "published");
  assert.equal(isVenueIndexable(published), true);

  for (const candidate of [
    venue({ status: "inactive" }),
    venue({ publicationStatus: "review" }),
    venue({ whyItsHere: "" }),
    venue({ bestFor: "   " }),
  ]) {
    assert.equal(getPublicationStatus(candidate), "review");
    assert.equal(isVenueIndexable(candidate), false);
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

  assert.equal(getPublicationStatus(invalid), "published");
  assert.equal(isVenueIndexable(invalid), false);
});
