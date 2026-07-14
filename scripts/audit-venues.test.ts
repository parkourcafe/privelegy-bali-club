import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  auditVenueRows,
  legacyPublicVenueRowIssues,
  normalizeVenueRow,
  validatePublishedVenue,
  validateVenueRow,
} from "../lib/schema/venue";
import {
  parseAuditVenueArgs,
  runVenueAudit,
  venueAuditMarkdown,
} from "./audit-venues";

const here = path.dirname(fileURLToPath(import.meta.url));
const launchSnapshot = path.join(here, "fixtures", "venues.snapshot.json");

function validVenue(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "fixture-venue-1",
    slug: "fixture-venue",
    name: "Fixture Venue",
    venue_type: "restaurant",
    district: "canggu",
    subarea: null,
    full_address: "Jl. Pantai, Bali",
    latitude: null,
    longitude: null,
    google_place_id: null,
    gmaps_url: "https://www.google.com/maps/search/?api=1&query=Fixture+Venue+Bali",
    official_url: null,
    instagram_url: null,
    tier: "editorial_seed",
    price_min_idr: 50_000,
    price_max_idr: 150_000,
    price_band: "$$",
    price_anchor: "Rp 50k–150k",
    opening_hours_json: null,
    verified_at: "2026-07-12",
    verification_source: "contract_fixture",
    editorial_status: "published",
    status: "active",
    why_its_here: "A compact contract fixture with recorded facts.",
    best_for: "Schema regression tests.",
    not_for: null,
    practical_tags: [],
    occasions: [],
    meal_periods: [],
    vibes: [],
    photos: [],
    photo_status: "approved_no_photo",
    booking_methods: [],
    is_sponsored: false,
    ...overrides,
  };
}

test("address=null is normalized without throwing and coordinates keep the venue publishable", () => {
  const result = validateVenueRow(validVenue({
    full_address: null,
    latitude: -8.65,
    longitude: 115.13,
    gmaps_url: null,
  }));
  assert.equal(result.normalized?.fullAddress, null);
  assert.match(result.normalized?.gmapsUrl ?? "", /query=-8\.65%2C115\.13/);
  assert.ok(result.published);
  assert.deepEqual(result.issues, []);
});

test("address=null without coordinates fails the publication gate with an exact field and reason", () => {
  const normalized = normalizeVenueRow(validVenue({ full_address: null }));
  assert.ok(normalized.data);
  const published = validatePublishedVenue(normalized.data!);
  assert.equal(published.ok, false);
  assert.ok(published.issues.some((issue) =>
    issue.code === "venue.location.missing" &&
    issue.path === "full_address" &&
    issue.message.includes("address or a complete coordinate pair"),
  ));
});

test("legacy public boundary tolerates null address only with a valid Maps handoff", () => {
  const withMaps = validVenue({ full_address: null, address: null });
  assert.deepEqual(legacyPublicVenueRowIssues(withMaps), []);
  const withoutLocation = validVenue({ full_address: null, address: null, gmaps_url: null });
  assert.ok(legacyPublicVenueRowIssues(withoutLocation).some((issue) =>
    issue.code === "venue.location.missing",
  ));
});

test("full normalized audit gate still rejects malformed taxonomy arrays", () => {
  const result = normalizeVenueRow(validVenue({ vibes: "quiet" }));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) =>
    issue.code === "venue.vibes.invalid_type" && issue.path === "vibes",
  ));
});

test("unknown legacy category is rejected rather than leaking an internal slug", () => {
  const row = validVenue({ venue_type: undefined, category: "dinner_vibes" });
  const result = normalizeVenueRow(row);
  assert.equal(result.data, null);
  assert.ok(result.issues.some((issue) =>
    issue.code === "venue.venue_type.unknown" && issue.path === "venue_type",
  ));
});

test("legacy category, area and address map once into the normalized domain", () => {
  const row = validVenue();
  delete row.venue_type;
  delete row.subarea;
  delete row.full_address;
  row.category = "cafe";
  row.area = "Berawa";
  row.address = "Jl. Pantai Berawa";
  const result = normalizeVenueRow(row);
  assert.equal(result.data?.venueType, "cafe");
  assert.equal(result.data?.subarea, "Berawa");
  assert.equal(result.data?.fullAddress, "Jl. Pantai Berawa");
});

test("malformed Maps URL, inverted price range and duplicate primary photos report stable issue codes", () => {
  const result = normalizeVenueRow(validVenue({
    gmaps_url: "https://evil.example/maps",
    price_min_idr: 200_000,
    price_max_idr: 100_000,
    photos: [
      { id: "one", source_url: "https://cdn.example/one.jpg", is_primary: true, status: "approved" },
      { id: "two", source_url: "https://cdn.example/two.jpg", is_primary: true, status: "approved" },
    ],
  }));
  const codes = new Set(result.issues.map((issue) => issue.code));
  assert.ok(codes.has("venue.gmaps_url.invalid"));
  assert.ok(codes.has("venue.price.range_invalid"));
  assert.ok(codes.has("venue.photos.duplicate_primary"));
});

test("published venue is blocked for missing provenance, photo state and draft offer language", () => {
  const normalized = normalizeVenueRow(validVenue({
    verification_source: null,
    photo_status: "missing",
    why_its_here: "Proposed perk pending partner negotiation.",
  }));
  assert.ok(normalized.data);
  const result = validatePublishedVenue(normalized.data!);
  const codes = new Set(result.issues.map((issue) => issue.code));
  assert.ok(codes.has("venue.verification_source.required"));
  assert.ok(codes.has("venue.photo.indexability_state_required"));
  assert.ok(codes.has("venue.content.draft_offer_language"));
});

test("snapshot audit detects duplicate slugs and excludes the duplicate from public output", () => {
  const report = auditVenueRows([validVenue(), validVenue({ id: "fixture-venue-2" })], {
    source: "contract-test",
    asOf: "2026-07-12T00:00:00.000Z",
  });
  assert.equal(report.ready, false);
  assert.equal(report.summary.duplicateSlugs, 1);
  assert.equal(report.summary.invalidVenues, 1);
  assert.equal(report.records[1].excludedFromPublic, true);
  assert.equal(report.records[1].issues.at(-1)?.code, "venue.snapshot.duplicate_slug");
});

test("CLI requires an explicit source and supports the launch output-dir contract", () => {
  assert.throws(() => parseAuditVenueArgs(["--output-dir", "artifacts/data-audit"]), /source is required/);
  assert.deepEqual(parseAuditVenueArgs([
    "--input",
    "scripts/fixtures/venues.snapshot.json",
    "--output-dir",
    "artifacts/data-audit",
  ]), {
    input: "scripts/fixtures/venues.snapshot.json",
    source: "snapshot",
    outputDir: "artifacts/data-audit",
    jsonPath: null,
    markdownPath: null,
    asOf: null,
    help: false,
  });
});

test("scrubbed launch snapshot produces deterministic READY JSON and Markdown", async () => {
  const firstDir = await mkdtemp(path.join(os.tmpdir(), "otherbali-audit-one-"));
  const secondDir = await mkdtemp(path.join(os.tmpdir(), "otherbali-audit-two-"));
  const options = parseAuditVenueArgs(["--input", launchSnapshot, "--output-dir", firstDir]);
  const first = await runVenueAudit(options);
  const second = await runVenueAudit({ ...options, outputDir: secondDir });
  assert.equal(first.report.ready, true);
  assert.equal(first.report.summary.publishableVenues, 2);
  assert.equal(first.report.summary.errors, 0);
  assert.equal(await readFile(first.jsonPath, "utf8"), await readFile(second.jsonPath, "utf8"));
  assert.equal(await readFile(first.markdownPath, "utf8"), await readFile(second.markdownPath, "utf8"));
  assert.match(venueAuditMarkdown(first.report), /Status: \*\*READY\*\*/);
});
