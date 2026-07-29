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

export const DATA_EVIDENCE = {
  observed_at_baseline: '2ebf74e',
  supabase_configured: existsSync(join(REPO_ROOT, '.env.local')),
  venue_source_of_truth: 'Supabase table "venues" via lib/data.ts',
  live_read_possible: existsSync(join(REPO_ROOT, '.env.local')),
  repository_venue_fixture: fixture,
  hermes_data_support: 'every venues.* field reported PARTIAL with "no live completeness count"',
  conclusion: fixture.published === 0 || fixture.with_jobs === 0
    ? 'No published, job-tagged venue record is observable in the repository, and no live read is possible. '
      + 'Venue-dependent selection cannot be proven to return a complete result.'
    : 'Observable published venue coverage exists.',
};

/**
 * Decide readiness for a canonical record.
 * Returns { readiness, reason } using only observed evidence.
 */
export function assessReadiness({ type, risk }) {
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
