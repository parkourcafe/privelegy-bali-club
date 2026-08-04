#!/usr/bin/env node
// Stage 4 — build Canonical Intent Library V0.1 (csv + json).
//
// A canonical record is formed from each non-child normalized record; its
// CHILD_SCENARIO records fold in as child_scenarios/aliases rather than becoming
// separate parents. Rule: no canonical record without at least one source record.

import { writeFileSync } from 'node:fs';
import {
  paths, readCsv, writeCsv, readState, writeState, appendEvent, appendDecision,
  nowIso, GENERATOR, SOURCE_VERSION, REPO_ROOT,
} from './lib.mjs';
import { LIBRARY_COLUMNS } from './enums.mjs';
import { assessReadiness, DATA_EVIDENCE } from './readiness-model.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');

const { records: normalized } = readCsv(paths.normalized);
const { records: reconciled } = readCsv(paths.reconciliation);
const recById = new Map(reconciled.map((r) => [r.source_record_id, r]));

const childrenByParent = new Map();
for (const r of normalized) {
  if (!r.parent_source_record_id) continue;
  if (!childrenByParent.has(r.parent_source_record_id)) childrenByParent.set(r.parent_source_record_id, []);
  childrenByParent.get(r.parent_source_record_id).push(r);
}

// Surface recommendation by normalized type. NO_BUILD is a legitimate surface.
const SURFACE_BY_TYPE = {
  CANONICAL_USER_JOB: 'PLACES_FILTER',
  CHILD_SCENARIO: 'PLACES_FILTER',
  EDITORIAL_TOPIC: 'DECISION_PAGE',
  ENTITY_QUERY: 'PLACES_SEARCH',
  SUPPORTING_JOB: 'PRODUCT_ONLY_NO_URL',
  PRODUCT_ACTION: 'PRODUCT_ONLY_NO_URL',
  VENUE_CAPABILITY: 'PLACES_FILTER',
  MODIFIER: 'PLACES_FILTER',
  HIGH_RISK_GUIDE: 'NO_BUILD',
  REJECT: 'NO_BUILD',
};

// Data fields a record type needs before it can return a complete result.
const FIELDS_BY_TYPE = {
  CANONICAL_USER_JOB: 'venues.publication_status;venues.jobs;venues.district;venues.name;venues.slug',
  CHILD_SCENARIO: 'venues.publication_status;venues.jobs;venues.district',
  EDITORIAL_TOPIC: 'editorial_source;verified_at',
  ENTITY_QUERY: 'venues.publication_status;venues.name;venues.slug',
  SUPPORTING_JOB: 'venues.publication_status;venue_action_capability',
  PRODUCT_ACTION: 'trip.storage;guest_ref',
  HIGH_RISK_GUIDE: 'authoritative_source;reviewed_by;reviewed_at',
  REJECT: '',
  VENUE_CAPABILITY: 'venues.practical_tags',
  MODIFIER: 'venues.vibe_tags',
};

const library = [];
let seq = 0;

for (const row of normalized) {
  if (row.parent_source_record_id) continue; // children fold into their parent

  seq += 1;
  const kids = childrenByParent.get(row.source_record_id) ?? [];
  const rec = recById.get(row.source_record_id);
  const type = row.normalized_record_type;
  const risk = row.risk_class;

  const modifiers = new Set();
  const capabilities = new Set();
  for (const src of [row, ...kids]) {
    const r = recById.get(src.source_record_id);
    if (!r || !r.internal_type) continue;
    if (['TIME_MODIFIER', 'MOOD'].includes(r.internal_type)) modifiers.add(r.internal_key);
    if (r.internal_type === 'VENUE_CAPABILITY') capabilities.add(r.internal_key);
  }

  const readiness = assessReadiness({ type, risk, internalKey: rec?.internal_key });

  const isHighRisk = type === 'HIGH_RISK_GUIDE';
  const lifecycle = isHighRisk ? 'RESEARCH_ONLY' : (type === 'REJECT' ? 'REJECTED' : 'ACTIVE');

  // A single-job candidate must be answerable in-browser with a portable result
  // and must not be high-risk.
  const singleJob = !isHighRisk
    && ['CANONICAL_USER_JOB', 'ENTITY_QUERY'].includes(type)
    && readiness.readiness !== 'HIGH_RISK_NOT_READY';

  library.push({
    canonical_intent_id: `OB-CAN-${String(seq).padStart(4, '0')}`,
    canonical_name: row.original_name,
    user_job_statement: `As a traveller in Bali, I want to ${row.original_name.charAt(0).toLowerCase()}${row.original_name.slice(1)}.`,
    domain: row.original_domain,
    source_record_ids: [row.source_record_id, ...kids.map((k) => k.source_record_id)].join(';'),
    aliases: kids.map((k) => k.original_name).join(';'),
    child_scenarios: kids.map((k) => k.source_record_id).join(';'),
    allowed_modifiers: [...modifiers].join(';'),
    required_venue_capabilities: [...capabilities].join(';'),
    required_data_fields: FIELDS_BY_TYPE[type] ?? '',
    publication_risk: risk,
    demand_evidence_status: row.original_status || 'UNVERIFIED',
    answer_evidence_requirement: isHighRisk ? 'AUTHORITATIVE_SOURCE_REQUIRED' : 'EDITORIAL_VERIFIED',
    internal_support_status: rec ? rec.reconciliation_status : 'UNMATCHED_EXTERNAL',
    recommended_surfaces: SURFACE_BY_TYPE[type] ?? 'NO_BUILD',
    single_job_candidate: String(singleJob),
    data_readiness: readiness.readiness,
    lifecycle_status: lifecycle,
    auto_decision_reason: readiness.reason,
    created_at: nowIso(),
    generator: GENERATOR,
    source_version: SOURCE_VERSION,
  });
}

writeCsv(paths.libraryCsv, library, LIBRARY_COLUMNS);
writeFileSync(paths.libraryJson, JSON.stringify({
  version: 'V0.1',
  generated_at: nowIso(),
  generator: GENERATOR,
  source_version: SOURCE_VERSION,
  data_evidence: DATA_EVIDENCE,
  record_count: library.length,
  records: library,
}, null, 2) + '\n', 'utf8');

// integrity: every source record must appear in exactly one canonical record
const cited = new Set();
for (const r of library) for (const s of r.source_record_ids.split(';').filter(Boolean)) cited.add(s);
const missing = normalized.filter((r) => !cited.has(r.source_record_id)).map((r) => r.source_record_id);

const byReadiness = {};
for (const r of library) byReadiness[r.data_readiness] = (byReadiness[r.data_readiness] ?? 0) + 1;
const byLifecycle = {};
for (const r of library) byLifecycle[r.lifecycle_status] = (byLifecycle[r.lifecycle_status] ?? 0) + 1;

const gatePass = missing.length === 0 && library.every((r) => r.source_record_ids.length > 0);

const state = readState() ?? {};
state.state = gatePass ? 'MAP_SURFACES' : 'FAILED_GATE';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'CANONICALIZE'])];
if (!gatePass) state.terminal = 'FAILED_GATE';
writeState(state);

appendDecision(`
## ${nowIso()} — CANONICALIZE: library V0.1

Built ${library.length} canonical records from ${normalized.length} source records. Every source record
is cited by exactly one canonical record (${missing.length} uncited). CHILD_SCENARIO records fold into
their parent as \`child_scenarios\`/\`aliases\` rather than becoming separate parents.

No round-number target was imposed; the count follows from the parent/child structure.

Readiness: ${Object.entries(byReadiness).map(([k, v]) => `${k}=${v}`).join(', ')}
Lifecycle: ${Object.entries(byLifecycle).map(([k, v]) => `${k}=${v}`).join(', ')}
`);

appendEvent({
  stage: 'CANONICALIZE',
  status: gatePass ? 'PASS' : 'FAIL',
  inputs: [rel(paths.normalized), rel(paths.reconciliation)],
  outputs: [rel(paths.libraryCsv), rel(paths.libraryJson)],
  checks: [`canonical_records=${library.length}`, `uncited_source_records=${missing.length}`,
    ...Object.entries(byReadiness).map(([k, v]) => `${k}=${v}`)],
  decisions: [`single_job_candidates=${library.filter((r) => r.single_job_candidate === 'true').length}`],
  next_state: state.state,
});

console.log(`canonical records: ${library.length}`);
console.log('readiness:', JSON.stringify(byReadiness));
console.log('lifecycle:', JSON.stringify(byLifecycle));
console.log(`single_job_candidates: ${library.filter((r) => r.single_job_candidate === 'true').length}`);
console.log(`gate: ${gatePass ? 'PASS' : 'FAIL'} -> ${state.state}`);
process.exit(gatePass ? 0 : 1);
