// Tests for the route-reachability gate.
//
// The bug being guarded: Stage 10 certified /bali/ubud/date-night as a live
// surface on venue-coverage evidence alone. Ubud is in HUB_EXCLUDE_DISTRICTS,
// so the route has never resolved. These tests pin the distinction between
// "enough data" and "the page exists".

import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  loadRouteGates,
  districtPublishedBounds,
  spokeReachability,
  reachabilityForSnapshot,
} from "./route-reachability.mjs";

const GATES = { excluded: new Set(["ubud", "canggu"]), hubMin: 8, spokeMin: 4, source: "test" };

function row(district, job_slug, published) {
  return { district, job_slug, published_matching_venues: String(published) };
}

// --- gates are read from the application, not copied ----------------------

test("gates are parsed from lib/data.ts rather than hardcoded here", () => {
  const g = loadRouteGates();
  assert.equal(g.source, "lib/data.ts");
  assert.ok(g.hubMin > 0, "HUB_MIN_VENUES must be read");
  assert.ok(g.spokeMin > 0, "SPOKE_MIN_VENUES must be read");
  assert.ok(g.excluded.size > 0, "HUB_EXCLUDE_DISTRICTS must be read");
  // If someone renames the constants, the loader must throw rather than
  // silently certify every route as reachable.
  assert.ok(g.excluded.has("ubud"), "ubud is excluded in the current application");
});

// --- the exclusion gate is decisive ---------------------------------------

test("an excluded district is unreachable no matter how good the data is", () => {
  const bounds = districtPublishedBounds([row("ubud", "(untagged)", 216), row("ubud", "date_night_special", 9)]);
  const r = spokeReachability({
    district: "ubud",
    jobSlug: "date_night_special",
    publishedMatching: 9, // comfortably above spokeMin
    bounds,
    gates: GATES,
  });
  assert.equal(r.verdict, "UNREACHABLE");
  assert.match(r.reasons.join(" "), /HUB_EXCLUDE_DISTRICTS/);
});

test("abundant coverage never overrides exclusion", () => {
  const bounds = districtPublishedBounds([row("canggu", "(untagged)", 400), row("canggu", "date_night_special", 29)]);
  const r = spokeReachability({
    district: "canggu",
    jobSlug: "date_night_special",
    publishedMatching: 29,
    bounds,
    gates: GATES,
  });
  assert.equal(r.reachable, false, "29 venues in an excluded district still yields no page");
});

// --- the other two gates ---------------------------------------------------

test("a non-excluded district below the spoke threshold is unreachable", () => {
  const bounds = districtPublishedBounds([row("amed", "(untagged)", 40), row("amed", "date_night_special", 2)]);
  const r = spokeReachability({
    district: "amed",
    jobSlug: "date_night_special",
    publishedMatching: 2,
    bounds,
    gates: GATES,
  });
  assert.equal(r.verdict, "UNREACHABLE");
  assert.match(r.reasons.join(" "), /SPOKE_MIN_VENUES/);
});

test("a district that cannot reach the hub threshold is unreachable", () => {
  const bounds = districtPublishedBounds([row("munduk", "(untagged)", 1), row("munduk", "date_night_special", 1)]);
  const r = spokeReachability({
    district: "munduk",
    jobSlug: "date_night_special",
    publishedMatching: 1,
    bounds,
    gates: GATES,
  });
  assert.equal(r.verdict, "UNREACHABLE");
});

test("a district clearing all three gates is reachable", () => {
  const bounds = districtPublishedBounds([row("sidemen", "(untagged)", 30), row("sidemen", "date_night_special", 6)]);
  const r = spokeReachability({
    district: "sidemen",
    jobSlug: "date_night_special",
    publishedMatching: 6,
    bounds,
    gates: GATES,
  });
  assert.equal(r.verdict, "REACHABLE");
  assert.deepEqual(r.reasons, []);
});

// --- honest uncertainty ----------------------------------------------------

test("an undecidable hub total reports INDETERMINATE, never REACHABLE", () => {
  // Multi-slug venues make the district total a range. When hubMin falls inside
  // that range the answer is genuinely unknown, and an unknown must not be
  // reported as a green light — that is the exact failure this module exists
  // to prevent.
  const bounds = districtPublishedBounds([
    row("lovina", "(untagged)", 3),
    row("lovina", "date_night_special", 5),
    row("lovina", "local_food_calm", 5),
  ]);
  const b = bounds.get("lovina");
  assert.equal(b.lower, 5, "lower bound is the largest single bucket");
  assert.equal(b.upper, 13, "upper bound assumes no venue carries two slugs");

  const r = spokeReachability({
    district: "lovina",
    jobSlug: "date_night_special",
    publishedMatching: 5,
    bounds,
    gates: GATES,
  });
  assert.equal(r.verdict, "INDETERMINATE");
  assert.equal(r.reachable, false, "INDETERMINATE must never count as reachable");
});

// --- district bounds -------------------------------------------------------

test("(untagged) counts venues with no job tags and is not summed as a slug", () => {
  const bounds = districtPublishedBounds([
    row("x", "(untagged)", 10),
    row("x", "a", 4),
    row("x", "b", 3),
  ]);
  assert.deepEqual(bounds.get("x"), { lower: 10, upper: 17 });
});

// --- whole-snapshot sweep --------------------------------------------------

test("the untagged pseudo-slug is never evaluated as a route", () => {
  const cells = reachabilityForSnapshot(
    [row("sidemen", "(untagged)", 30), row("sidemen", "date_night_special", 6)],
    GATES
  );
  assert.equal(cells.length, 1);
  assert.equal(cells[0].jobSlug, "date_night_special");
});

// --- regression pin: the live snapshot ------------------------------------

test("the current live snapshot yields zero reachable spokes", async () => {
  // This is the finding that invalidated pilot OB-CAN-0011. If this test ever
  // starts failing, a district became eligible and the reuse gate should be
  // re-run rather than assumed — that is a signal, not a breakage.
  const { readCsv, paths } = await import("./lib.mjs");
  const { existsSync } = await import("node:fs");
  if (!existsSync(paths.coverageSnapshot)) return; // snapshot is optional

  const { records } = readCsv(paths.coverageSnapshot);
  const cells = reachabilityForSnapshot(records, loadRouteGates());
  const reachable = cells.filter((c) => c.reachable);
  assert.equal(
    reachable.length,
    0,
    `expected no reachable spoke; got ${reachable.map((c) => `${c.district}/${c.jobSlug}`).join(", ")}`
  );
});
