import test from "node:test";
import assert from "node:assert/strict";
import { resolveRouteStops, summarizeResolvableRoutes } from "./route-stops";
import type { VenueWithPerk } from "./data";
import type { RouteDef } from "./types";

// Synthetic venues only — no production rows.
function venue(overrides: Partial<VenueWithPerk> & Pick<VenueWithPerk, "slug" | "name">): VenueWithPerk {
  return {
    id: overrides.slug,
    category: "cafe",
    district: "canggu",
    address: "Bali",
    gmapsUrl: "https://maps.google.com/",
    tier: "editorial_seed",
    isSponsored: false,
    publicationStatus: "published",
    perk: null,
    blurb: "Editorial",
    ...overrides,
  };
}

function route(overrides: Partial<RouteDef> & Pick<RouteDef, "slug" | "district">): RouteDef {
  return { title: overrides.slug, rank: 1, stops: [], ...overrides };
}

test("a route whose stops are not in the published catalogue is not listed", () => {
  const defs = [
    route({ slug: "explicit-unpublished", district: "canggu", stops: [{ venueSlug: "gone" }, { venueSlug: "also-gone" }] }),
    route({ slug: "first-day", district: "ubud" }),
  ];
  // Nothing published in either district: the detail page would say
  // "Route not found", so the listing must agree.
  const published = [venue({ slug: "elsewhere", name: "Elsewhere", district: "seminyak" })];

  assert.deepEqual(summarizeResolvableRoutes(defs, published), []);
  for (const d of defs) assert.equal(resolveRouteStops(d, published).length, 0);
});

test("listed stop count equals what the detail page resolves", () => {
  const published = [
    venue({ slug: "a", name: "A" }),
    venue({ slug: "b", name: "B", category: "restaurant" }),
    venue({ slug: "c", name: "C", district: "ubud" }),
  ];
  const defs = [
    // Two of three explicit stops published.
    route({ slug: "explicit", district: "canggu", stops: [{ venueSlug: "a" }, { venueSlug: "missing" }, { venueSlug: "b" }] }),
    // No explicit stops: stage fallback picks from the district's published venues.
    route({ slug: "cafe-work", district: "canggu" }),
    // No explicit stops and no fallback stages for this slug.
    route({ slug: "no-stages", district: "canggu" }),
  ];

  const listed = summarizeResolvableRoutes(defs, published);
  assert.deepEqual(
    listed.map((r) => [r.slug, r.stopCount]),
    [
      ["explicit", 2],
      ["cafe-work", 2],
    ],
  );
  for (const r of listed) {
    const d = defs.find((x) => x.slug === r.slug)!;
    assert.equal(resolveRouteStops(d, published).length, r.stopCount);
  }
});

test("explicit stops never pull a venue from another district", () => {
  const published = [venue({ slug: "c", name: "C", district: "ubud" })];
  const d = route({ slug: "explicit", district: "canggu", stops: [{ venueSlug: "c" }] });
  assert.deepEqual(summarizeResolvableRoutes([d], published), []);
});
