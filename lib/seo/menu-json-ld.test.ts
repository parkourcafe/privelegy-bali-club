import assert from "node:assert/strict";
import test from "node:test";
import type { PublicMenuSummary } from "../data/menu-summary-repository";
import { menuJsonLd } from "./menu-json-ld";

// Per the schema-markup standard, refusal cases matter more than success
// cases here: every bug shipped from this area was a value that should have
// been omitted and was not.

function item(overrides: Partial<PublicMenuSummary["sections"][number]["items"][number]> = {}) {
  return {
    id: "item-1",
    name: "Smoothie bowl",
    description: null,
    priceMinor: 85000,
    currency: "IDR",
    priceText: "Rp 85,000",
    dietaryTags: [],
    verifiedAllergenTags: [],
    partnerRecommended: false,
    editorialPick: false,
    editorialNote: null,
    availabilityNote: null,
    position: 0,
    ...overrides,
  };
}

function summary(overrides: Partial<PublicMenuSummary> = {}): PublicMenuSummary {
  return {
    id: "menu-1",
    venueSlug: "fixture-venue",
    title: "Fixture menu",
    version: 1,
    status: "published",
    completeness: "partial",
    kind: "food",
    sourceUrl: "https://venue.example/menu",
    sourceLabel: "Official menu",
    capturedAt: "2026-07-13T00:00:00.000Z",
    verifiedAt: null,
    expiresAt: "2099-01-01T00:00:00.000Z",
    sections: [
      {
        id: "s1",
        name: "Bowls",
        description: null,
        position: 1,
        items: [item()],
        itemCount: 1,
        deferred: false,
      },
    ],
    ...overrides,
  };
}

test("emits Menu → MenuSection → MenuItem with an IDR offer", () => {
  const node = menuJsonLd(summary());
  assert.equal(node?.["@type"], "Menu");
  const sections = node?.hasMenuSection as Array<Record<string, unknown>>;
  assert.equal(sections.length, 1);
  const items = sections[0].hasMenuItem as Array<Record<string, unknown>>;
  assert.equal(items[0].name, "Smoothie bowl");
  // IDR has zero minor-unit digits: price_minor 85000 is Rp 85,000, not 850.00.
  assert.deepEqual(items[0].offers, { "@type": "Offer", price: "85000", priceCurrency: "IDR" });
});

test("omits offers when price or currency cannot be established", () => {
  const cases = [
    item({ priceMinor: null }),
    item({ currency: null }),
    item({ currency: "   " }),
    item({ currency: "NOT_A_CURRENCY" }),
    item({ priceMinor: Number.NaN }),
  ];
  for (const testItem of cases) {
    const node = menuJsonLd(
      summary({ sections: [{ id: "s1", name: "Bowls", description: null, position: 1, items: [testItem], itemCount: 1, deferred: false }] })
    );
    const sections = node?.hasMenuSection as Array<Record<string, unknown>>;
    const items = sections[0].hasMenuItem as Array<Record<string, unknown>>;
    assert.equal("offers" in items[0], false, JSON.stringify(testItem));
    // priceText is display-only and never leaks into markup as a price.
    assert.equal(JSON.stringify(node).includes("Rp 85,000"), false);
  }
});

test("a deferred section contributes its name but never invented items", () => {
  const node = menuJsonLd(
    summary({ sections: [{ id: "s1", name: "Mains", description: null, position: 1, items: [], itemCount: 40, deferred: true }] })
  );
  const sections = node?.hasMenuSection as Array<Record<string, unknown>>;
  assert.equal(sections[0].name, "Mains");
  assert.equal("hasMenuItem" in sections[0], false);
});

test("returns null (omit the hasMenu key) when no section holds anything", () => {
  assert.equal(menuJsonLd(summary({ sections: [] })), null);
  assert.equal(
    menuJsonLd(summary({ sections: [{ id: "s1", name: "Empty", description: null, position: 1, items: [], itemCount: 0, deferred: false }] })),
    null
  );
});

test("nameless items are dropped rather than emitted blank", () => {
  const node = menuJsonLd(
    summary({
      sections: [{
        id: "s1", name: "Bowls", description: null, position: 1,
        items: [item({ name: "  " }), item({ id: "item-2", name: "Real bowl" })],
        itemCount: 2, deferred: false,
      }],
    })
  );
  const sections = node?.hasMenuSection as Array<Record<string, unknown>>;
  const items = sections[0].hasMenuItem as Array<Record<string, unknown>>;
  assert.equal(items.length, 1);
  assert.equal(items[0].name, "Real bowl");
});
