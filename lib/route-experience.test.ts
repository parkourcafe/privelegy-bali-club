import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  canonicalRoutePath,
  presentRouteStops,
  unsavedRouteStopSlugs,
} from "./route-experience";
import { matchExactRelatedRoutes } from "./route-integrity";

test("route presentation preserves explicit order and only exposes validated directions", () => {
  const stops = presentRouteStops([
    {
      slug: "first-stop",
      name: "First Stop",
      gmapsUrl: "https://www.google.com/maps/place/First+Stop",
    },
    {
      slug: "second-stop",
      name: "Second Stop",
      gmapsUrl: "https://maps.google.com.evil.invalid/maps/place/Second",
    },
  ]);

  assert.deepEqual(stops.map((stop) => ({
    slug: stop.venue.slug,
    position: stop.position,
    anchorId: stop.anchorId,
    detailHref: stop.detailHref,
    directions: stop.directions?.href ?? null,
  })), [
    {
      slug: "first-stop",
      position: 1,
      anchorId: "route-stop-1",
      detailHref: "/places/first-stop",
      directions: "https://www.google.com/maps/place/First+Stop",
    },
    {
      slug: "second-stop",
      position: 2,
      anchorId: "route-stop-2",
      detailHref: "/places/second-stop",
      directions: null,
    },
  ]);
});

test("route paths and save queues fail closed on invalid slugs", () => {
  assert.equal(canonicalRoutePath("slow-canggu-day"), "/route/slow-canggu-day");
  assert.equal(canonicalRoutePath("../admin"), null);
  assert.deepEqual(
    unsavedRouteStopSlugs(
      ["first-stop", "already-saved", "first-stop", "../bad"],
      ["already-saved"],
    ),
    ["first-stop"],
  );
});

test("related routes use exact stops, preserve route order, and exclude broken definitions", () => {
  const venues = [
    { slug: "first-stop", blurb: "First" },
    { slug: "related-stop", blurb: "Related" },
    { slug: "last-stop", blurb: "Last" },
  ];
  const routes = [
    {
      slug: "published-route",
      title: "Published route",
      subtitle: "An explicit sequence",
      rank: 10,
      stops: [
        { venueSlug: "first-stop" },
        { venueSlug: "related-stop" },
        { venueSlug: "last-stop" },
      ],
    },
    {
      slug: "unrelated-route",
      title: "Unrelated route",
      rank: 20,
      stops: [{ venueSlug: "first-stop" }, { venueSlug: "last-stop" }],
    },
    {
      slug: "broken-route",
      title: "Broken route",
      rank: 30,
      stops: [{ venueSlug: "related-stop" }, { venueSlug: "missing-stop" }],
    },
  ];

  assert.deepEqual(matchExactRelatedRoutes(routes, venues, "related-stop"), [{
    slug: "published-route",
    title: "Published route",
    subtitle: "An explicit sequence",
    stopCount: 3,
    venuePosition: 2,
  }]);
  assert.deepEqual(matchExactRelatedRoutes(routes, venues, "../related-stop"), []);
});

test("route UI links stops, describes data limits, and has progressive share fallback", () => {
  const page = readFileSync(new URL("../app/route/[slug]/page.tsx", import.meta.url), "utf8");
  const actions = readFileSync(
    new URL("../app/route/[slug]/RouteActions.tsx", import.meta.url),
    "utf8",
  );

  assert.match(page, /<VenueCard v=\{v\}/);
  assert.match(page, /href=\{detailHref\}/);
  assert.match(page, /routeMapsLabel\(directions\.href, v\.name\)/);
  assert.match(
    page,
    /if \(label === "Search in Google Maps"\) return `Search \$\{venueName\} in Google Maps`/,
  );
  assert.match(page, /no verified live provider data/);
  assert.doesNotMatch(page, /open now|closed now|estimated travel|minutes away/i);
  assert.match(actions, /navigator\.share/);
  assert.match(actions, /navigator\.clipboard/);
  assert.match(actions, /readOnly/);
  assert.match(actions, /aria-live="polite"/);
  assert.match(actions, /fetch\("\/api\/save"/);

  const data = readFileSync(new URL("./data.ts", import.meta.url), "utf8");
  assert.match(data, /export async function getRelatedRoutesForVenue/);
  assert.match(data, /Promise\.all\(\[getRouteDefs\(\), getVenuesList\(\)\]\)/);
});
