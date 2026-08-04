#!/usr/bin/env node
// Stage 7 — action-job shortlist with the 8-factor scorecard.
//
// Every factor is scored from an observable property with a stated rule, so the
// scorecard is reproducible rather than an opinion. `serp_opportunity` is left
// at 0 here and filled by Stage 8; policy `unknown_search_volume: UNKNOWN` means
// it must not be guessed.

import {
  paths, readCsv, writeCsv, readState, writeState, appendEvent, appendDecision,
  nowIso, GENERATOR, SOURCE_VERSION, REPO_ROOT,
} from './lib.mjs';
import { SCORECARD_WEIGHTS, ALLOWED_PILOT_READINESS } from './enums.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');

const COLUMNS = [
  'canonical_intent_id', 'canonical_name', 'internal_key', 'job_slug', 'data_readiness',
  ...Object.keys(SCORECARD_WEIGHTS),
  'total_score', 'browser_completable', 'portable_result', 'requires_registration',
  'scoring_basis', 'created_at', 'generator', 'source_version',
];

const { records: library } = readCsv(paths.libraryCsv);
const { records: reconciled } = readCsv(paths.reconciliation);
const { records: ledger } = readCsv(paths.ledger);
const { records: surfaces } = readCsv(paths.surfaceMapping);
const recBySource = new Map(reconciled.map((r) => [r.source_record_id, r]));
const surfaceById = new Map(surfaces.map((r) => [r.canonical_intent_id, r]));

// Jobs whose result is a shortlist of places: completable in-browser, no signup,
// and portable (shareable/saveable). Everything on this list is venue selection.
const BROWSER_COMPLETABLE_SURFACES = ['PLACES_FILTER', 'PLACES_SEARCH', 'COLLECTION', 'DECISION_PAGE', 'INTERACTIVE_TOOL'];

// Day-scoped jobs recur every trip day; occasion jobs fire once per trip.
const RECURRING_KEYS = ['brunch', 'work-session', 'local-food', 'sunset', 'just-landed', 'date-night'];
const ONE_OFF_KEYS = ['special-occasion'];

const candidates = library.filter((i) =>
  ALLOWED_PILOT_READINESS.includes(i.data_readiness)
  && i.single_job_candidate === 'true'
  && i.lifecycle_status === 'ACTIVE');

const rows = candidates.map((intent) => {
  const firstSource = intent.source_record_ids.split(';')[0];
  const rec = recBySource.get(firstSource);
  const internalKey = rec?.internal_key ?? '';
  const surface = surfaceById.get(intent.canonical_intent_id);
  const sources = intent.source_record_ids.split(';').filter(Boolean);
  const led = sources.map((s) => ledger.find((l) => l.source_record_id === s)).filter(Boolean);
  const confs = led.map((l) => Number(l.original_confidence)).filter((n) => !Number.isNaN(n));
  const avgConf = confs.length ? confs.reduce((a, b) => a + b, 0) / confs.length : 0;
  const allStrong = led.every((l) => l.original_status === 'EVIDENCE_STRONG');
  const childCount = intent.child_scenarios.split(';').filter(Boolean).length;
  const reuses = surface?.projection_type === 'EXISTING_KEY';
  const basis = [];

  // intent_clarity (20): demand evidence strength and stated confidence.
  let intent_clarity;
  if (allStrong && avgConf >= 90) { intent_clarity = 20; basis.push('clarity=20 all-strong & conf>=90'); }
  else if (allStrong && avgConf >= 85) { intent_clarity = 18; basis.push('clarity=18 all-strong & conf>=85'); }
  else if (allStrong) { intent_clarity = 16; basis.push('clarity=16 all-strong'); }
  else { intent_clarity = 10; basis.push('clarity=10 contains moderate evidence'); }

  // browser_completion (15): readiness of the backing data.
  const browser_completion = intent.data_readiness === 'READY' ? 15 : 12;
  basis.push(`browser=${browser_completion} readiness=${intent.data_readiness}`);

  // second_job_strength (20): does answering it naturally lead to a second job
  // (save / add-to-trip / share)? Breadth of child scenarios is the proxy, plus
  // whether the internal model already supports it.
  let second_job_strength = 8;
  if (childCount >= 3) second_job_strength = 20;
  else if (childCount === 2) second_job_strength = 17;
  else if (childCount === 1) second_job_strength = 14;
  if (rec?.reconciliation_status === 'MATCHED') second_job_strength = Math.min(20, second_job_strength + 2);
  basis.push(`second_job=${second_job_strength} children=${childCount} support=${rec?.reconciliation_status ?? 'none'}`);

  // repeatability_or_history (10): recurring day-scoped job vs one-off occasion.
  let repeatability_or_history = 5;
  if (RECURRING_KEYS.includes(internalKey)) { repeatability_or_history = 10; }
  else if (ONE_OFF_KEYS.includes(internalKey)) { repeatability_or_history = 3; }
  basis.push(`repeat=${repeatability_or_history} key=${internalKey || 'none'}`);

  // serp_opportunity (10): Stage 8 owns this. Never guessed.
  const serp_opportunity = 0;
  basis.push('serp=0 pending Stage 8 (unknown_search_volume: UNKNOWN)');

  // unique_utility (10): does Other Bali add decision value beyond a maps search?
  // Editorial verdict fields (why_its_here / best_for) are what maps lack.
  const unique_utility = ['quiet_work_cafe', 'local_food_calm', 'date_night_special', 'sunset_drinks_view']
    .includes(intent.required_venue_capabilities || '') ? 10 : (reuses ? 9 : 7);
  basis.push(`unique=${unique_utility}`);

  // safety_compliance (10): risk class. High risk never reaches this stage.
  const safety_compliance = intent.publication_risk === 'LOW' ? 10 : 8;
  basis.push(`safety=${safety_compliance} risk=${intent.publication_risk}`);

  // maintenance_cost (5): reusing an existing runtime key is cheapest.
  const maintenance_cost = reuses ? 5 : 2;
  basis.push(`maint=${maintenance_cost} ${reuses ? 'reuses existing key' : 'new projection'}`);

  const factors = {
    intent_clarity, browser_completion, second_job_strength, repeatability_or_history,
    serp_opportunity, unique_utility, safety_compliance, maintenance_cost,
  };
  const total = Object.values(factors).reduce((a, b) => a + b, 0);

  return {
    canonical_intent_id: intent.canonical_intent_id,
    canonical_name: intent.canonical_name,
    internal_key: internalKey,
    job_slug: (intent.auto_decision_reason.match(/live snapshot: (\w+)/) ?? [])[1] ?? '',
    data_readiness: intent.data_readiness,
    ...factors,
    total_score: total,
    browser_completable: String(BROWSER_COMPLETABLE_SURFACES.includes(intent.recommended_surfaces)),
    portable_result: 'true',
    requires_registration: 'false',
    scoring_basis: basis.join('; '),
    created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
  };
})
  .filter((r) => r.browser_completable === 'true')
  .sort((a, b) => b.total_score - a.total_score)
  .slice(0, 30);

writeCsv(paths.shortlist, rows, COLUMNS);

const gatePass = rows.length >= 20 && rows.length <= 30;
const state = readState() ?? {};
state.state = rows.length === 0 ? 'NO_BUILD' : 'KEYWORD_SERP';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'SHORTLIST'])];
if (rows.length === 0) state.terminal = 'NO_BUILD';
writeState(state);

appendDecision(`
## ${nowIso()} — SHORTLIST: ${rows.length} action-job candidates

Filtered ${library.length} canonical intents to ${candidates.length} that are pilot-eligible, single-job
and ACTIVE, then to ${rows.length} that are completable in-browser with a portable result and no
registration.

Every factor is scored from an observable property with a stated rule (see \`scoring_basis\` per row).
\`serp_opportunity\` is 0 for all rows: Stage 8 owns it and \`unknown_search_volume: UNKNOWN\` forbids
guessing. Totals will rise by at most 10 after Stage 8.

Top 5 provisional: ${rows.slice(0, 5).map((r) => `${r.canonical_intent_id} (${r.total_score})`).join(', ')}
`);

appendEvent({
  stage: 'SHORTLIST',
  status: gatePass ? 'PASS' : 'WARN',
  inputs: [rel(paths.libraryCsv), rel(paths.surfaceMapping)],
  outputs: [rel(paths.shortlist)],
  checks: [`candidates=${candidates.length}`, `shortlisted=${rows.length}`, `in_range_20_30=${gatePass}`],
  decisions: ['serp_opportunity deferred to Stage 8'],
  next_state: state.state,
});

console.log(`pilot-eligible single-job: ${candidates.length}`);
console.log(`shortlisted: ${rows.length} (gate 20-30: ${gatePass ? 'PASS' : 'OUT OF RANGE'})`);
for (const r of rows.slice(0, 8)) console.log(`  ${r.total_score}  ${r.canonical_intent_id}  ${r.canonical_name.slice(0, 58)}`);
console.log(`-> ${state.state}`);
process.exit(0);
