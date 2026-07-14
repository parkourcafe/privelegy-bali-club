import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildBackfillVenueReport,
  parseBackfillVenueArgs,
  runBackfillVenueReview,
} from "./backfill-venue-model";

test("backfill CLI is explicit-source and never exposes a write mode", () => {
  assert.throws(() => parseBackfillVenueArgs([]), /source is required/);
  assert.throws(() => parseBackfillVenueArgs(["--write"]), /Unknown argument/);
  assert.throws(
    () => parseBackfillVenueArgs(["--source", "db"]),
    /complete operator snapshot/,
  );
  assert.deepEqual(parseBackfillVenueArgs(["--input", "operator.json"]), {
    source: "snapshot",
    input: "operator.json",
    outputDir: "artifacts/data-audit",
    asOf: null,
    help: false,
  });
});

test("only one-to-one fields are candidates and ambiguous values require review", () => {
  const report = buildBackfillVenueReport([{
    slug: "fixture",
    category: "cafe",
    address: "Jl. Fixture",
    area: "Batu Bolong / Berawa",
    last_verified_at: null,
    publication_status: "published",
    price_anchor: "around 100k",
    jobs: ["date-night"],
    photo_url: "https://images.example/fixture.jpg",
  }], { source: "fixture", asOf: "2026-07-14T00:00:00.000Z" });

  assert.equal(report.mode, "read_only");
  assert.equal(report.ready, false);
  assert.deepEqual(
    report.deterministicCandidates.map(({ field }) => field),
    ["full_address", "photo_status", "venue_type"],
  );
  assert.ok(report.manualReview.some(({ field }) => field === "subarea"));
  assert.ok(report.manualReview.some(({ field }) => field === "verified_at"));
  assert.ok(report.manualReview.some(({ field }) => field === "occasions"));
  assert.ok(report.manualReview.some(({ field }) => field === "photo_status"));
  assert.ok(!report.deterministicCandidates.some(({ field }) => field.startsWith("price_")));
});

test("snapshot output is byte-for-byte deterministic", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "otherbali-backfill-"));
  const first = await runBackfillVenueReview(parseBackfillVenueArgs([
    "--input", "scripts/fixtures/venues.snapshot.json",
    "--output-dir", path.join(root, "first"),
  ]));
  const second = await runBackfillVenueReview(parseBackfillVenueArgs([
    "--input", "scripts/fixtures/venues.snapshot.json",
    "--output-dir", path.join(root, "second"),
  ]));
  assert.equal(await readFile(first.jsonPath, "utf8"), await readFile(second.jsonPath, "utf8"));
  assert.equal(await readFile(first.markdownPath, "utf8"), await readFile(second.markdownPath, "utf8"));
});
