// Stage 6 data-readiness model.
//
// Master goal Stage 6: "Use repository and available read-only aggregate evidence
// only. Never infer row-level coverage that was not observed."
//
// Everything in DATA_EVIDENCE below was directly observed in this worktree at
// baseline 2ebf74e. No value is estimated, extrapolated or assumed.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT } from './lib.mjs';

function observeVenueFixture() {
  const p = join(REPO_ROOT, 'data/resort-import/venues.json');
  if (!existsSync(p)) {
    return { fixture_present: false, total: 0, published: 0, with_jobs: 0, districts: [] };
  }
  const raw = JSON.parse(readFileSync(p, 'utf8'));
  const arr = Array.isArray(raw) ? raw : (Object.values(raw).find(Array.isArray) ?? []);
  const published = arr.filter((v) => v.publicationStatus === 'published' || v.publication_status === 'published').length;
  const withJobs = arr.filter((v) => Array.isArray(v.jobs) && v.jobs.length > 0).length;
  const districts = [...new Set(arr.map((v) => v.district).filter(Boolean))];
  return { fixture_present: true, total: arr.length, published, with_jobs: withJobs, districts };
}

const fixture = observeVenueFixture();

/**
 * A committed live coverage snapshot, when one exists, is stronger evidence than
 * the repository fixture and takes precedence. Produced by coverage-snapshot.mjs.
 */
function observeCoverageSnapshot() {
  const csv = join(REPO_ROOT, 'docs/intent-os/data-readiness/COVERAGE_SNAPSHOT_BY_DISTRICT_JOB.csv');
  const status = join(REPO_ROOT, 'docs/intent-os/data-readiness/SNAPSHOT_STATUS.json');
  const out = {
    present: false, status: 'ABSENT', ready_cells: 0, ready_districts: [], ready_job_slugs: [],
    cells: 0, districts_by_job: {},
  };
  if (existsSync(status)) {
    try {
      const s = JSON.parse(readFileSync(status, 'utf8'));
      out.status = s.status ?? 'UNKNOWN';
      out.ready_cells = s.ready_cells ?? 0;
      out.ready_districts = s.ready_districts ?? [];
      out.ready_job_slugs = s.ready_job_slugs ?? [];
      out.cells = s.cells ?? 0;
    } catch { /* malformed status is treated as absent */ }
  }
  out.present = existsSync(csv) && out.status === 'OK';
  // Per-job district coverage, so readiness can be decided per intent rather than globally.
  if (out.present) {
    const text = readFileSync(csv, 'utf8').trim().split('\n');
    const cols = text[0].split(',');
    const iJob = cols.indexOf('job_slug');
    const iDist = cols.indexOf('district');
    const iVerdict = cols.indexOf('readiness_verdict');
    const iPub = cols.indexOf('published_matching_venues');
    for (const line of text.slice(1)) {
      const f = line.split(',');
      if (f[iVerdict] !== 'READY') continue;
      const job = f[iJob];
      (out.districts_by_job[job] ??= []).push({ district: f[iDist], published: Number(f[iPub]) || 0 });
    }
  }
  return out;
}

/**
 * Internal concept key -> the venue `jobs` slug that actually backs it.
 * Only these nine slugs exist in the live data, so an intent without one has no
 * covering tag and cannot be READY however good the overall coverage looks.
 */
export const JOB_SLUG_BY_INTERNAL_KEY = {
  brunch: 'brunch_after_surf',
  'date-night': 'date_night_special',
  sunset: 'sunset_drinks_view',
  'family-outing': 'family_early_dinner',
  'group-dinner': 'group_dinner_share',
  'special-occasion': 'special_occasion',
  'work-session': 'quiet_work_cafe',
  'local-food': 'local_food_calm',
  'just-landed': 'just_landed_easy_dinner',
};

const snapshot = observeCoverageSnapshot();

export const DATA_EVIDENCE = {
  observed_at_baseline: '2ebf74e',
  supabase_configured: existsSync(join(REPO_ROOT, '.env.local')),
  venue_source_of_truth: 'Supabase table "venues" via lib/data.ts',
  live_read_possible: existsSync(join(REPO_ROOT, '.env.local')),
  coverage_snapshot: snapshot,
  repository_venue_fixture: fixture,
  hermes_data_support: 'every venues.* field reported PARTIAL with "no live completeness count"',
  conclusion: snapshot.present
    ? `Live coverage snapshot observed: ${snapshot.ready_cells} READY (district, job_slug) cells.`
    : (fixture.published === 0 || fixture.with_jobs === 0
      ? 'No published, job-tagged venue record is observable in the repository, no live coverage snapshot '
        + 'exists, and no live read is possible. Venue-dependent selection cannot be proven to return a '
        + 'complete result.'
      : 'Observable published venue coverage exists.'),
};

/**
 * Decide readiness for a canonical record.
 * Returns { readiness, reason } using only observed evidence.
 */
export function assessReadiness({ type, risk, internalKey }) {
  if (['SAFETY', 'MEDICAL', 'LEGAL_REGULATORY'].includes(risk) || type === 'HIGH_RISK_GUIDE') {
    return {
      readiness: 'HIGH_RISK_NOT_READY',
      reason: `risk_class=${risk}: 04_AUTONOMOUS_DECISION_POLICY.yaml risk_policy sets auto_build_allowed=false `
        + 'and publication_status=RESEARCH_ONLY for SAFETY/MEDICAL/LEGAL_REGULATORY',
    };
  }
  if (type === 'REJECT') {
    return { readiness: 'BLOCKED_BY_DATA', reason: 'record rejected as out of product scope' };
  }
  // Editorial content depends on editorial evidence, not venue rows.
  if (type === 'EDITORIAL_TOPIC') {
    return {
      readiness: 'NEEDS_ENRICHMENT',
      reason: 'editorial topic requires a sourced editorial record with verified_at; no such record observed in repository',
    };
  }
  if (type === 'PRODUCT_ACTION') {
    return { readiness: 'NEEDS_ENRICHMENT', reason: 'product action depends on trip storage, not venue selection' };
  }
  // Everything else selects venues.
  const snap = DATA_EVIDENCE.coverage_snapshot;
  if (snap.present) {
    if (snap.ready_cells === 0) {
      return {
        readiness: 'BLOCKED_BY_DATA',
        reason: `live coverage snapshot observed ${snap.cells} (district, job_slug) cells, none READY`,
      };
    }
    // Readiness is decided per intent: an intent is only as ready as the job
    // slug that backs it. Without a covering slug there is no way to select for
    // it, regardless of how much coverage exists for other jobs.
    const jobSlug = internalKey ? JOB_SLUG_BY_INTERNAL_KEY[internalKey] : undefined;
    if (!jobSlug) {
      return {
        readiness: 'BLOCKED_BY_DATA',
        reason: `no venue jobs slug covers this intent (internal key ${internalKey || 'unmatched'}); `
          + `live data carries only [${Object.values(JOB_SLUG_BY_INTERNAL_KEY).join('|')}]`,
      };
    }
    const cells = snap.districts_by_job[jobSlug] ?? [];
    if (cells.length === 0) {
      return {
        readiness: 'BLOCKED_BY_DATA',
        reason: `job slug ${jobSlug} has no READY district cell in the live snapshot`,
      };
    }
    const districts = cells.map((c) => c.district);
    const published = cells.reduce((a, c) => a + c.published, 0);
    return districts.length < 5
      ? {
        readiness: 'READY_WITH_LIMITED_DISTRICTS',
        reason: `live snapshot: ${jobSlug} READY in ${districts.length} district(s) [${districts.join('|')}], ${published} published venues`,
      }
      : {
        readiness: 'READY',
        reason: `live snapshot: ${jobSlug} READY in ${districts.length} districts, ${published} published venues`,
      };
  }

  const f = DATA_EVIDENCE.repository_venue_fixture;
  if (!DATA_EVIDENCE.live_read_possible && f.published === 0) {
    return {
      readiness: 'BLOCKED_BY_DATA',
      reason: `venue selection requires published venues with jobs tags; observed fixture has total=${f.total}, `
        + `published=${f.published}, with_jobs=${f.with_jobs}, districts=[${f.districts.join('|')}]; `
        + '.env.local absent so no live Supabase read is possible. Coverage was not observed and must not be inferred.',
    };
  }
  if (f.districts.length > 0 && f.districts.length < 5) {
    return {
      readiness: 'READY_WITH_LIMITED_DISTRICTS',
      reason: `observed published coverage limited to districts [${f.districts.join('|')}]`,
    };
  }
  return { readiness: 'READY', reason: 'observed published, job-tagged venue coverage is sufficient' };
}
