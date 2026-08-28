import assert from "node:assert/strict";
import test from "node:test";
import type { PublicMenuSummary } from "../data/menu-summary-repository";
import { buildPublishedMenuJsonLd } from "./menu-json-ld";

function menu(overrides: Partial<PublicMenuSummary> = {}): PublicMenuSummary {
  return {
    id: "menu-1",
    venueSlug: "venue-1",
    title: "Dinner menu",
    version: 2,
    status: "published",
    completeness: "full",
    sourceUrl: "https://venue.example/menu",
    sourceLabel: "Official menu",
    capturedAt: "2026-08-01",
    verifiedAt: "2026-08-02",
    expiresAt: "2026-10-01",
    sections: [{
      id: "section-1",
      name: "Mains",
      description: null,
      position: 0,
      itemCount: 1,
      deferred: false,
      items: [{
        id: "item-1",
        name: "Nasi campur",
        description: "Rice with seasonal sides",
        priceMinor: 9500000,
        currency: "IDR",
        priceText: null,
        dietaryTags: [],
        verifiedAllergenTags: [],
        partnerRecommended: false,
        editorialPick: false,
        editorialNote: null,
        availabilityNote: null,
        position: 0,
      }],
    }],
    ...overrides,
  };
}

test("builds Menu, MenuSection, MenuItem and Offer from visible verified data", () => {
  const value = buildPublishedMenuJsonLd(menu(), {
    pageUrl: "https://www.otherbali.com/places/venue-1",
    now: new Date("2026-08-28T00:00:00Z"),
  });
  const section = (value?.hasMenuSection as Record<string, unknown>[])[0];
  const item = (section.hasMenuItem as Record<string, unknown>[])[0];

  assert.equal(value?.["@type"], "Menu");
  assert.equal(item.name, "Nasi campur");
  assert.deepEqual(item.offers, {
    "@type": "Offer",
    price: 9500000,
    priceCurrency: "IDR",
  });
});

test("suppresses stale, unpublished and item-empty menu schema", () => {
  const options = {
    pageUrl: "https://www.otherbali.com/places/venue-1",
    now: new Date("2026-08-28T00:00:00Z"),
  };
  assert.equal(buildPublishedMenuJsonLd(menu({ expiresAt: "2026-08-01" }), options), undefined);
  assert.equal(buildPublishedMenuJsonLd(menu({ status: "review" }), options), undefined);
  assert.equal(buildPublishedMenuJsonLd(menu({ sections: [] }), options), undefined);
});
