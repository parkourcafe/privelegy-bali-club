import assert from "node:assert/strict";
import test from "node:test";
import type { Venue } from "./types";
import { VENUE_CATEGORIES, isRenderableVenue } from "./venue-validation";

test("accepts a complete Ubud villa as a public renderable venue", () => {
  const villa = {
    id: "big-dragon-villas-ubud",
    slug: "big-dragon-villas-ubud",
    name: "Big Dragon Villas Ubud",
    category: "villa",
    district: "ubud",
    address: "Ubud, Gianyar Regency, Bali",
    gmapsUrl: "https://maps.google.com/?q=Big+Dragon+Villas+Ubud",
    tier: "editorial_seed",
    isSponsored: false,
  } satisfies Partial<Venue>;

  const eligibility = {
    categoryIsPublic: VENUE_CATEGORIES.includes(villa.category),
    structurallyRenderable: isRenderableVenue(villa),
  };

  assert.deepEqual(eligibility, {
    categoryIsPublic: true,
    structurallyRenderable: true,
  });
});
