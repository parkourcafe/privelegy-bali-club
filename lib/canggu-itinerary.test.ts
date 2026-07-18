import test from "node:test";
import assert from "node:assert/strict";
import type { VenueWithPerk } from "@/lib/data";

const { buildItinerary } = (await import(
  new URL("./canggu-itinerary.ts", import.meta.url).href
)) as typeof import("./canggu-itinerary");

// Minimal venue factory — only the fields the itinerary logic reads.
function v(
  slug: string,
  category: VenueWithPerk["category"],
  extra: Partial<VenueWithPerk> = {}
): VenueWithPerk {
  return {
    id: slug,
    slug,
    name: slug,
    category,
    district: "canggu",
    address: "",
    gmapsUrl: "",
    tier: "editorial_seed",
    isSponsored: false,
    perk: null,
    blurb: "",
    ...extra,
  } as VenueWithPerk;
}

// A catalogue rich enough to fill all three days.
function fullCatalogue(): VenueWithPerk[] {
  return [
    v("cafe-1", "cafe"),
    v("cafe-2", "cafe"),
    v("cafe-3", "cafe"),
    v("surf-1", "surf"),
    v("beach-1", "beach_club"),
    v("beach-2", "beach_club"),
    v("bar-1", "bar"),
    v("spa-1", "spa"),
    v("restaurant-1", "restaurant"),
    v("restaurant-2", "restaurant"),
    v("restaurant-3", "restaurant"),
    v("warung-1", "warung"),
  ];
}

test("builds a three-day arc from a full catalogue", () => {
  const days = buildItinerary(fullCatalogue());
  assert.equal(days.length, 3);
  for (const day of days) assert.ok(day.stops.length > 0, `day ${day.n} has stops`);
});

test("never repeats a venue across the whole itinerary", () => {
  const days = buildItinerary(fullCatalogue());
  const slugs = days.flatMap((d) => d.stops.map((s) => s.venue.slug));
  assert.equal(slugs.length, new Set(slugs).size, "all stops are distinct venues");
});

test("each stop's venue actually fits its block role", () => {
  const days = buildItinerary(fullCatalogue());
  const roleOk: Record<string, (c: string) => boolean> = {
    Morning: (c) => c === "cafe",
    Midday: (c) => ["beach_club", "surf", "warung", "restaurant"].includes(c),
    Afternoon: (c) => ["spa", "yoga"].includes(c),
    Sunset: (c) => ["beach_club", "bar"].includes(c),
    Dinner: (c) => c === "restaurant",
  };
  for (const day of days) {
    for (const stop of day.stops) {
      assert.ok(
        roleOk[stop.label]?.(stop.venue.category),
        `${stop.label} stop got a ${stop.venue.category} (${stop.venue.slug})`
      );
    }
  }
});

test("leads with the best-evidenced venue for a role", () => {
  const days = buildItinerary([
    v("cafe-plain", "cafe"),
    v("cafe-strong", "cafe", { photoUrl: "x.webp", tier: "founding", whyItsHere: "great", bestFor: "coffee" }),
    v("restaurant-1", "restaurant"),
  ]);
  assert.equal(days[0].stops[0].venue.slug, "cafe-strong");
});

test("degrades honestly: only real stops, drops empty blocks and days", () => {
  // Only cafés + one restaurant: no beach/sunset/spa venues exist.
  const days = buildItinerary([v("cafe-1", "cafe"), v("restaurant-1", "restaurant")]);
  const labels = days.flatMap((d) => d.stops.map((s) => s.label));
  assert.ok(!labels.includes("Sunset"), "no Sunset block without a sunset venue");
  assert.ok(!labels.includes("Afternoon"), "no reset block without a spa/yoga venue");
  // The single restaurant fills exactly one dinner, never repeated.
  const dinnerSlugs = days.flatMap((d) => d.stops.filter((s) => s.label === "Dinner").map((s) => s.venue.slug));
  assert.deepEqual(dinnerSlugs, ["restaurant-1"]);
});

test("empty catalogue yields no days (page renders its fallback)", () => {
  assert.deepEqual(buildItinerary([]), []);
});
