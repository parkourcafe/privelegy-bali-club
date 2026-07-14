import assert from "node:assert/strict";
import test from "node:test";
import { parsePublicPerkRow } from "./schema/perk";
import { parsePublicRows } from "./schema/public-boundary";
import {
  parsePlanEntryRow,
  parseRouteRow,
  parseRouteStopRow,
} from "./schema/route";
import { parseLegacyPublicVenueRow } from "./schema/venue";
import { readFileSync } from "node:fs";
import { getPublicationStatus } from "./publication";
import type { Venue } from "./types";

function validVenue(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "venue-boundary-1",
    slug: "boundary-cafe",
    name: "Boundary Cafe",
    category: "cafe",
    district: "canggu",
    address: "Jl. Pantai, Canggu",
    gmaps_url: "https://www.google.com/maps/search/?api=1&query=Boundary+Cafe+Bali",
    official_url: null,
    instagram_url: null,
    tier: "editorial_seed",
    status: "active",
    is_sponsored: false,
    vibe_tags: ["quiet"],
    price_anchor: "$$",
    what_to_order: null,
    photo_url: null,
    area: "Berawa",
    why_its_here: "A runtime boundary fixture.",
    best_for: "Regression tests.",
    not_for: null,
    practical_tags: ["fast wifi"],
    jobs: ["work"],
    owner_note: null,
    publication_status: "published",
    wellness_categories: [],
    ...overrides,
  };
}

test("public venue boundary rejects a numeric address even with a valid Maps URL", () => {
  const result = parseLegacyPublicVenueRow(validVenue({ address: 42 }));
  assert.equal(result.ok, false);
  assert.equal(result.data, null);
  assert.ok(result.issues.some(({ code, path }) =>
    code === "venue.address.invalid_type" && path === "address",
  ));
});

test("public venue boundary rejects invalid arrays before they reach UI helpers", () => {
  const wrongContainer = parseLegacyPublicVenueRow(validVenue({ vibe_tags: "quiet" }));
  assert.ok(wrongContainer.issues.some(({ code, path }) =>
    code === "venue.vibe_tags.invalid_type" && path === "vibe_tags",
  ));

  const wrongItem = parseLegacyPublicVenueRow(validVenue({ jobs: ["work", 42] }));
  assert.ok(wrongItem.issues.some(({ code, path }) =>
    code === "venue.jobs.item_invalid" && path === "jobs[1]",
  ));
});

test("perk and plan parsers accept nullable DB text but reject malformed rows", () => {
  assert.deepEqual(parsePublicPerkRow({
    id: "perk-1",
    venue_slug: "boundary-cafe",
    title: "Welcome drink",
    terms: null,
  }).data, {
    id: "perk-1",
    venueSlug: "boundary-cafe",
    title: "Welcome drink",
    terms: "",
  });
  const badPerk = parsePublicPerkRow({
    id: "perk-2",
    venue_slug: "boundary-cafe",
    title: 99,
    terms: null,
  });
  assert.ok(badPerk.issues.some(({ code, path }) =>
    code === "perk.title.invalid_type" && path === "title",
  ));

  assert.deepEqual(parsePlanEntryRow({
    venue_slug: "boundary-cafe",
    slot: "morning",
    rank: 10,
    blurb: null,
  }).data, {
    venueSlug: "boundary-cafe",
    slot: "morning",
    rank: 10,
    blurb: "",
  });
  const badPlan = parsePlanEntryRow({
    venue_slug: "boundary-cafe",
    slot: "breakfast",
    rank: "10",
    blurb: [],
  });
  const planIssues = new Set(badPlan.issues.map(({ code, path }) => `${code}:${path}`));
  assert.ok(planIssues.has("plan_entry.slot.unknown:slot"));
  assert.ok(planIssues.has("plan_entry.rank.invalid_type:rank"));
  assert.ok(planIssues.has("plan_entry.blurb.invalid_type:blurb"));
});

test("route and stop parsers reject malformed independent rows", () => {
  assert.deepEqual(parseRouteRow({
    slug: "first-day",
    title: "First day",
    subtitle: null,
    rank: 10,
  }).data, {
    slug: "first-day",
    title: "First day",
    rank: 10,
  });
  const badRoute = parseRouteRow({
    slug: "first-day",
    title: ["First day"],
    subtitle: null,
    rank: 10,
  });
  assert.ok(badRoute.issues.some(({ code, path }) =>
    code === "route.title.invalid_type" && path === "title",
  ));

  const badStop = parseRouteStopRow({
    route_slug: "first-day",
    venue_slug: "boundary-cafe",
    rank: "10",
    note: ["Coffee"],
  });
  const stopIssues = new Set(badStop.issues.map(({ code, path }) => `${code}:${path}`));
  assert.ok(stopIssues.has("route_stop.rank.invalid_type:rank"));
  assert.ok(stopIssues.has("route_stop.note.invalid_type:note"));
});

test("mixed DB rows exclude only malformed records and log bounded code/path evidence", () => {
  const lines: string[] = [];
  const rows = parsePublicRows([
    { id: "perk-1", venue_slug: "boundary-cafe", title: "Welcome drink", terms: null },
    { id: "perk-2", venue_slug: "boundary-cafe", title: { unsafe: true }, terms: null },
  ], parsePublicPerkRow, {
    entity: "perk",
    context: "contract_test",
    sink: (line) => lines.push(line),
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0]?.id, "perk-1");
  assert.equal(lines.length, 1);
  assert.deepEqual(JSON.parse(lines[0]), {
    event: "public_data_row_rejected",
    entity: "perk",
    context: "contract_test",
    index: 1,
    id: "perk-2",
    slug: "boundary-cafe",
    issues: [{ code: "perk.title.invalid_type", path: "title" }],
  });
  assert.equal(lines[0].includes("unsafe"), false);
});

test("all mapped public paths apply the editorial publication gate", () => {
  const sparse = {
    id: "sparse",
    slug: "sparse-published-row",
    name: "Sparse row",
    category: "cafe",
    district: "canggu",
    address: "Canggu",
    gmapsUrl: "https://www.google.com/maps/place/Sparse",
    tier: "editorial_seed",
    status: "active",
    isSponsored: false,
    publicationStatus: "published",
  } satisfies Venue;
  assert.equal(getPublicationStatus(sparse), "review");

  const source = readFileSync(new URL("./data.ts", import.meta.url), "utf8");
  assert.match(source, /map\(mapVenue\)\.filter\(isPublicReadyVenue\)/);
  assert.match(source, /venues = uniqueBy\(venues\.filter\(isPublicReadyVenue\)/);
  assert.match(source, /if \(!venue \|\| !isPublicReadyVenue\(venue\)\) return null/);
  assert.match(
    source,
    /const renderable = keepRenderableVenues\(\[\.\.\.venues, \.\.\.uluwatuFallback\]\);[\s\S]*?uniqueBy\(renderable[\s\S]*?filter\(isPublicReadyVenue\)/
  );
  assert.match(source, /uniqueBy\(venues, \(x\) => x\.slug\)\.filter\(isPublicReadyVenue\)/);
});
