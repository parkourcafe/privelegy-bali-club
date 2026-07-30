#!/usr/bin/env node
// Stage 5 — exhaustive intent -> surface mapping.
//
// "Mapping must be exhaustive, not a sample." Every canonical intent gets at
// least one row; the validator enforces it.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  paths, readCsv, writeCsv, readState, writeState, appendEvent, appendDecision,
  nowIso, GENERATOR, SOURCE_VERSION, REPO_ROOT,
} from './lib.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');

// Repository surfaces actually inspected for this mapping.
const INSPECTED = [
  'lib/intents.ts', 'lib/moments.ts', 'lib/catalogue-moments.ts', 'lib/trip-missions.ts',
  'lib/scenarios.ts', 'lib/collections.ts', 'lib/day-builder.ts',
  'docs/seo/os/intent-registry.json', 'docs/seo/os/page-registry.json',
];
const inspected = INSPECTED.map((p) => ({ path: p, present: existsSync(join(REPO_ROOT, p)) }));

// Observed runtime keys, read from the files rather than assumed.
function readKeys(file, re) {
  const p = join(REPO_ROOT, file);
  if (!existsSync(p)) return [];
  const text = readFileSync(p, 'utf8');
  return [...new Set([...text.matchAll(re)].map((m) => m[1]))];
}
const OBSERVED = {
  'lib/intents.ts': readKeys('lib/intents.ts', /urlSlug:\s*"([^"]+)"/g),
  'lib/catalogue-moments.ts': readKeys('lib/catalogue-moments.ts', /slug:\s*"([^"]+)"/g),
  'lib/moments.ts': readKeys('lib/moments.ts', /slug:\s*"([^"]+)"/g),
  'lib/trip-missions.ts': readKeys('lib/trip-missions.ts', /slug:\s*"([^"]+)"/g),
  'lib/scenarios.ts': readKeys('lib/scenarios.ts', /slug:\s*"([^"]+)"/g),
  'lib/collections.ts': readKeys('lib/collections.ts', /slug:\s*"([^"]+)"/g),
};

const COLUMNS = [
  'canonical_intent_id', 'canonical_name', 'surface', 'surface_evidence',
  'existing_key', 'projection_type', 'blocking_reason',
  'auto_decision_reason', 'created_at', 'generator', 'source_version',
];

const { records: library } = readCsv(paths.libraryCsv);
const { records: reconciled } = readCsv(paths.reconciliation);
const recBySource = new Map(reconciled.map((r) => [r.source_record_id, r]));

const rows = [];
for (const intent of library) {
  const firstSource = intent.source_record_ids.split(';')[0];
  const rec = recBySource.get(firstSource);
  const internalKey = rec?.internal_key ?? '';

  // Which observed file, if any, already carries this key?
  let evidence = '';
  let existingKey = '';
  for (const [file, keys] of Object.entries(OBSERVED)) {
    if (internalKey && keys.includes(internalKey)) { evidence = file; existingKey = internalKey; break; }
  }

  let surface = intent.recommended_surfaces;
  // CAUTION: EXISTING_KEY means "this runtime key appears in an observed file".
  // It does NOT mean the route that consumes the key resolves for any user.
  // A key can be live in code while every district feeding it is filtered out
  // upstream — that is exactly how OB-CAN-0011 was certified as "already
  // served" against a route that returns 404. Reachability is answered by
  // route-reachability.mjs at the reuse gate, not here.
  let projection = existingKey ? 'EXISTING_KEY' : 'NEW_PROJECTION';
  let blocking = '';

  // High risk never gets a public surface.
  if (intent.data_readiness === 'HIGH_RISK_NOT_READY') {
    surface = 'NO_BUILD';
    projection = 'NONE';
    blocking = 'risk_policy: RESEARCH_ONLY, auto_build_allowed=false';
  } else if (intent.data_readiness === 'BLOCKED_BY_DATA') {
    // The surface stays the honest recommendation, but it is not buildable now.
    blocking = 'BLOCKED_BY_DATA: no observable published, job-tagged venue coverage';
  }

  rows.push({
    canonical_intent_id: intent.canonical_intent_id,
    canonical_name: intent.canonical_name,
    surface,
    surface_evidence: evidence || (rec?.internal_source ?? ''),
    existing_key: existingKey,
    projection_type: projection,
    blocking_reason: blocking,
    auto_decision_reason: existingKey
      ? `internal key '${existingKey}' already exists in ${evidence}; projection reuses it`
      : 'no existing runtime key matched; would require a new projection',
    created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
  });
}

writeCsv(paths.surfaceMapping, rows, COLUMNS);

const bySurface = {};
for (const r of rows) bySurface[r.surface] = (bySurface[r.surface] ?? 0) + 1;
const reuse = rows.filter((r) => r.projection_type === 'EXISTING_KEY').length;

const gatePass = rows.length === library.length;
const state = readState() ?? {};
state.state = gatePass ? 'DATA_READINESS' : 'FAILED_GATE';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'MAP_SURFACES'])];
if (!gatePass) state.terminal = 'FAILED_GATE';
writeState(state);

appendDecision(`
## ${nowIso()} — MAP_SURFACES: exhaustive projection

Mapped all ${rows.length} canonical intents to surfaces (one row per intent, exhaustive as required).
Inspected: ${inspected.map((i) => `${i.path}${i.present ? '' : ' (ABSENT)'}`).join(', ')}.

Surface distribution: ${Object.entries(bySurface).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(', ')}

${reuse} intents map onto a runtime key that already exists; the rest would need a new projection.
Intents at HIGH_RISK_NOT_READY are forced to NO_BUILD regardless of their recommended surface.
`);

appendEvent({
  stage: 'MAP_SURFACES',
  status: gatePass ? 'PASS' : 'FAIL',
  inputs: [rel(paths.libraryCsv), ...INSPECTED],
  outputs: [rel(paths.surfaceMapping)],
  checks: [`mapped=${rows.length}`, `library=${library.length}`, `existing_key_reuse=${reuse}`,
    ...Object.entries(bySurface).map(([k, v]) => `${k}=${v}`)],
  decisions: ['high_risk_forced_to_NO_BUILD'],
  next_state: state.state,
});

console.log('surface distribution:', JSON.stringify(bySurface));
console.log(`existing-key reuse: ${reuse}/${rows.length}`);
console.log(`gate: ${gatePass ? 'PASS' : 'FAIL'} -> ${state.state}`);
process.exit(gatePass ? 0 : 1);
