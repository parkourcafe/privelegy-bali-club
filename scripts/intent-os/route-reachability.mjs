// Route reachability for the /bali/[district]/[intent] spoke.
//
// WHY THIS EXISTS
//
// Stage 10 (SELECT_PILOT / REUSE_GATE) once returned EXTEND_EXISTING for
// OB-CAN-0011 on the reasoning that "Ubud has 9 published date_night_special
// venues, so /bali/ubud/date-night renders today". It does not. `getIntentSpokes()`
// is built on `getDistrictHubs()`, which drops eight districts outright — Ubud
// among them — so the route calls notFound() no matter how good the data is.
//
// The gate measured DATA READINESS and silently assumed REACHABILITY. They are
// different questions: "is there enough evidence to build this?" and "does the
// surface I plan to extend actually resolve?". A pilot can pass the first and
// fail the second, and that is exactly what happened.
//
// DESIGN NOTE — why the gates are parsed out of lib/data.ts rather than copied
//
// Hardcoding the exclusion list here would reproduce the original failure one
// step later: the constant would drift from the application and this checker
// would confidently certify a route that no longer resolves. Reading the values
// from the source of truth means the checker cannot disagree with the code it
// is checking. If the parse fails, that is reported as an error rather than
// silently defaulted — a checker that guesses is worse than no checker.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { REPO_ROOT } from "./lib.mjs";

const DATA_TS = join(REPO_ROOT, "lib/data.ts");

/**
 * The three gates a (district, jobSlug) pair must clear before
 * /bali/<district>/<intent> resolves, read live from lib/data.ts.
 *
 * @returns {{excluded: Set<string>, hubMin: number, spokeMin: number, source: string}}
 * @throws if any gate cannot be located — never falls back to a guess.
 */
export function loadRouteGates() {
  const src = readFileSync(DATA_TS, "utf8");

  const exclusion = src.match(/HUB_EXCLUDE_DISTRICTS\s*=\s*new Set\(\[([\s\S]*?)\]\)/);
  if (!exclusion) {
    throw new Error(
      "route-reachability: HUB_EXCLUDE_DISTRICTS not found in lib/data.ts. " +
        "The constant was renamed or removed; update this parser rather than assuming no exclusions."
    );
  }
  const excluded = new Set(
    exclusion[1]
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean)
  );

  const hubMin = readNumericConst(src, "HUB_MIN_VENUES");
  const spokeMin = readNumericConst(src, "SPOKE_MIN_VENUES");

  return { excluded, hubMin, spokeMin, source: "lib/data.ts" };
}

function readNumericConst(src, name) {
  const m = src.match(new RegExp(`${name}\\s*=\\s*(\\d+)`));
  if (!m) {
    throw new Error(
      `route-reachability: ${name} not found in lib/data.ts. ` +
        "Update this parser rather than assuming a threshold."
    );
  }
  return Number(m[1]);
}

/**
 * District-level published totals from the coverage snapshot.
 *
 * The snapshot is keyed by (district, job_slug) and a venue carrying several
 * job slugs appears in each of its rows, so the rows cannot simply be summed
 * without double counting. `(untagged)` counts venues with NO job tags at all.
 *
 * That yields a range rather than a number:
 *   lower bound = max(untagged, largest single job row)   — every venue in the
 *                 biggest single bucket certainly exists
 *   upper bound = untagged + sum(job rows)                — only exact if no
 *                 venue carries more than one slug
 *
 * @returns {Map<string, {lower: number, upper: number}>}
 */
export function districtPublishedBounds(rows) {
  const acc = new Map();
  for (const r of rows) {
    const district = r.district;
    const published = Number(r.published_matching_venues) || 0;
    if (!acc.has(district)) acc.set(district, { untagged: 0, jobRows: [] });
    const a = acc.get(district);
    if (r.job_slug === "(untagged)") a.untagged = published;
    else a.jobRows.push(published);
  }
  const out = new Map();
  for (const [district, a] of acc) {
    const largestJobRow = a.jobRows.length ? Math.max(...a.jobRows) : 0;
    out.set(district, {
      lower: Math.max(a.untagged, largestJobRow),
      upper: a.untagged + a.jobRows.reduce((s, n) => s + n, 0),
    });
  }
  return out;
}

/**
 * Can /bali/<district>/<intent> resolve for this (district, jobSlug) pair?
 *
 * Verdicts:
 *   REACHABLE     — clears every gate
 *   UNREACHABLE   — provably fails at least one gate
 *   INDETERMINATE — the hub threshold cannot be decided from the snapshot
 *
 * INDETERMINATE is deliberately NOT treated as reachable by callers. The bug
 * this module exists to prevent was precisely an unproven assumption of
 * reachability, so anything short of proof must not authorise a build.
 */
export function spokeReachability({ district, jobSlug, publishedMatching, bounds, gates }) {
  const reasons = [];

  if (gates.excluded.has(district)) {
    reasons.push(
      `district '${district}' is in HUB_EXCLUDE_DISTRICTS, so getDistrictHubs() skips it and no spoke is ever built`
    );
  }

  if (publishedMatching < gates.spokeMin) {
    reasons.push(
      `${publishedMatching} published venues carry '${jobSlug}', below SPOKE_MIN_VENUES=${gates.spokeMin}`
    );
  }

  let indeterminate = false;
  const b = bounds.get(district);
  if (!b) {
    indeterminate = true;
    reasons.push(`no district totals in the snapshot, so HUB_MIN_VENUES=${gates.hubMin} cannot be checked`);
  } else if (b.upper < gates.hubMin) {
    reasons.push(
      `district holds at most ${b.upper} published venues, below HUB_MIN_VENUES=${gates.hubMin}`
    );
  } else if (b.lower < gates.hubMin) {
    // Between the bounds: cannot prove it either way from this artifact.
    indeterminate = true;
    reasons.push(
      `district published total is between ${b.lower} and ${b.upper}; HUB_MIN_VENUES=${gates.hubMin} is not provable from the snapshot alone`
    );
  }

  const hardFail = reasons.some((r) => !r.includes("not provable") && !r.includes("cannot be checked"));
  const verdict = hardFail ? "UNREACHABLE" : indeterminate ? "INDETERMINATE" : "REACHABLE";

  return { verdict, reachable: verdict === "REACHABLE", district, jobSlug, reasons };
}

/** Convenience: evaluate every (district, jobSlug) cell in a snapshot. */
export function reachabilityForSnapshot(rows, gates = loadRouteGates()) {
  const bounds = districtPublishedBounds(rows);
  return rows
    .filter((r) => r.job_slug && r.job_slug !== "(untagged)")
    .map((r) =>
      spokeReachability({
        district: r.district,
        jobSlug: r.job_slug,
        publishedMatching: Number(r.published_matching_venues) || 0,
        bounds,
        gates,
      })
    );
}
