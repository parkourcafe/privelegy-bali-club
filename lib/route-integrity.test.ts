import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolveExactRouteStops, routesWithDuplicateStopRanks } from "./route-integrity";

const venues = [
  { slug: "morning-cafe", blurb: "Venue copy", status: "active" },
  { slug: "sunset-stop", blurb: "Sunset copy", status: "active" },
];

test("explicit route stops preserve order and only explicit editorial notes", () => {
  const result = resolveExactRouteStops({
    slug: "honest-day",
    stops: [
      { venueSlug: "sunset-stop", note: "Arrive before sunset." },
      { venueSlug: "morning-cafe" },
    ],
  }, venues);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.stops.map(({ slug, blurb }) => ({ slug, blurb })), [
    { slug: "sunset-stop", blurb: "Arrive before sunset." },
    { slug: "morning-cafe", blurb: "Venue copy" },
  ]);
});

test("an empty route fails closed instead of inventing category-based stops", () => {
  assert.deepEqual(resolveExactRouteStops({ slug: "empty", stops: [] }, venues), {
    ok: false,
    code: "route_stops_empty",
  });
});

test("a missing, closed, archived, or invalid public venue rejects the whole route", () => {
  assert.deepEqual(resolveExactRouteStops({
    slug: "broken",
    stops: [{ venueSlug: "morning-cafe" }, { venueSlug: "closed-or-missing" }],
  }, venues), {
    ok: false,
    code: "route_stop_missing_public_venue",
    stopIndex: 1,
    venueSlug: "closed-or-missing",
  });
});

test("duplicate venue stops reject the whole route", () => {
  assert.deepEqual(resolveExactRouteStops({
    slug: "duplicate",
    stops: [{ venueSlug: "morning-cafe" }, { venueSlug: "morning-cafe" }],
  }, venues), {
    ok: false,
    code: "route_stop_duplicate_venue",
    stopIndex: 1,
    venueSlug: "morning-cafe",
  });
});

test("route ordering rejects duplicate ranks per route but permits the same rank across routes", () => {
  assert.deepEqual(
    [...routesWithDuplicateStopRanks([
      { routeSlug: "morning", rank: 10 },
      { routeSlug: "morning", rank: 10 },
      { routeSlug: "evening", rank: 10 },
      { routeSlug: "evening", rank: 20 },
    ])],
    ["morning"],
  );
});

test("the production data layer has no category or first-unused route synthesis", () => {
  const dataLayer = readFileSync(new URL("./data.ts", import.meta.url), "utf8");
  assert.match(dataLayer, /resolveExactRouteStops/);
  assert.doesNotMatch(dataLayer, /ROUTE_FALLBACK_STAGES|fallbackRouteStops|findRouteVenue/);
  assert.doesNotMatch(dataLayer, /venues\.find\(\(v\) => !used\.has\(v\.slug\)\)/);
});
