#!/usr/bin/env node
// Stage 6 — data readiness matrix.
//
// Decides the DATA_READINESS transition: pass -> SHORTLIST, no_ready_data -> NO_BUILD.

import {
  paths, readCsv, writeCsv, readState, writeState, appendEvent, appendDecision,
  nowIso, GENERATOR, SOURCE_VERSION, REPO_ROOT,
} from './lib.mjs';
import { DATA_EVIDENCE } from './readiness-model.mjs';
import { ALLOWED_PILOT_READINESS } from './enums.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');

const COLUMNS = [
  'canonical_intent_id', 'canonical_name', 'publication_risk', 'required_data_fields',
  'observed_evidence', 'data_readiness', 'blocking_field', 'remediation',
  'auto_decision_reason', 'created_at', 'generator', 'source_version',
];

const { records: library } = readCsv(paths.libraryCsv);
const f = DATA_EVIDENCE.repository_venue_fixture;

const observed = `fixture total=${f.total};published=${f.published};with_jobs=${f.with_jobs};`
  + `districts=${f.districts.join('|') || 'none'};supabase_configured=${DATA_EVIDENCE.supabase_configured}`;

const rows = library.map((intent) => {
  let blocking = '';
  let remediation = '';
  switch (intent.data_readiness) {
    case 'BLOCKED_BY_DATA':
      blocking = 'venues.publication_status=published AND venues.jobs non-empty';
      remediation = 'publish job-tagged venues, or provide read-only aggregate coverage counts per district/job';
      break;
    case 'HIGH_RISK_NOT_READY':
      blocking = 'authoritative_source;reviewed_by;reviewed_at';
      remediation = 'owner authority + authoritative answer evidence required before any publication';
      break;
    case 'NEEDS_ENRICHMENT':
      blocking = 'editorial_source;verified_at';
      remediation = 'create sourced editorial record with capture date';
      break;
    default:
      blocking = '';
      remediation = '';
  }
  return {
    canonical_intent_id: intent.canonical_intent_id,
    canonical_name: intent.canonical_name,
    publication_risk: intent.publication_risk,
    required_data_fields: intent.required_data_fields,
    observed_evidence: observed,
    data_readiness: intent.data_readiness,
    blocking_field: blocking,
    remediation,
    auto_decision_reason: intent.auto_decision_reason,
    created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
  };
});

writeCsv(paths.dataReadiness, rows, COLUMNS);

const byReadiness = {};
for (const r of rows) byReadiness[r.data_readiness] = (byReadiness[r.data_readiness] ?? 0) + 1;

const readyCount = rows.filter((r) => ALLOWED_PILOT_READINESS.includes(r.data_readiness)).length;
const noReadyData = readyCount === 0;

const state = readState() ?? {};
state.state = noReadyData ? 'NO_BUILD' : 'SHORTLIST';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'DATA_READINESS'])];
if (noReadyData) state.terminal = 'NO_BUILD';
writeState(state);

appendDecision(`
## ${nowIso()} — DATA_READINESS: ${noReadyData ? 'no_ready_data -> NO_BUILD' : 'pass -> SHORTLIST'}

Readiness across ${rows.length} canonical intents: ${Object.entries(byReadiness).map(([k, v]) => `${k}=${v}`).join(', ')}.

Intents at a readiness allowed for a pilot (${ALLOWED_PILOT_READINESS.join(' or ')}): **${readyCount}**.

### Observed evidence

${observed}

Venue selection reads from ${DATA_EVIDENCE.venue_source_of_truth}. \`.env.local\` is
${DATA_EVIDENCE.supabase_configured ? 'present' : 'absent'}, so a live read is
${DATA_EVIDENCE.live_read_possible ? 'possible' : 'not possible'}. The only venue records observable in
the repository are the ${f.total} rows in \`data/resort-import/venues.json\`, of which ${f.published} are
published and ${f.with_jobs} carry \`jobs\` tags.

Stage 6 states: "Never infer row-level coverage that was not observed" and "A single-job candidate is
not READY unless the product can return a complete result using verified records." With no observable
published, job-tagged venue, no venue-dependent intent can be shown to return a complete result.
Marking any of them READY would be inventing coverage.

**Transition taken:** \`DATA_READINESS -> ${state.state}\` per 03_PIPELINE_STATE_MACHINE.yaml.
`);

appendEvent({
  stage: 'DATA_READINESS',
  status: noReadyData ? 'NO_READY_DATA' : 'PASS',
  inputs: [rel(paths.libraryCsv)],
  outputs: [rel(paths.dataReadiness)],
  checks: [`ready_for_pilot=${readyCount}`, ...Object.entries(byReadiness).map(([k, v]) => `${k}=${v}`)],
  decisions: [`transition=${noReadyData ? 'no_ready_data' : 'pass'}`],
  next_state: state.state,
});

console.log('readiness:', JSON.stringify(byReadiness));
console.log(`pilot-eligible: ${readyCount}`);
console.log(`transition -> ${state.state}`);
process.exit(0);
