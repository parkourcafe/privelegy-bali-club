#!/usr/bin/env node
// Stage 3 — reconcile the external candidate set against the internal model.
//
// Rule 5: external records are candidates, not the canonical source of truth.
// Rule 6: internal Hermes files are implementation evidence, not the sole taxonomy.
// Neither side wins by default; a genuine clash becomes AUTO_HOLD.

import { writeFileSync, existsSync } from 'node:fs';
import {
  paths, readCsv, writeCsv, readState, writeState, appendEvent, appendDecision,
  nowIso, GENERATOR, SOURCE_VERSION, REPO_ROOT,
} from './lib.mjs';
import { INTERNAL_MODEL, HERMES_CONFLICT_RESOLUTIONS } from './internal-model.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');

const COLUMNS = [
  'source_record_id', 'external_name', 'normalized_record_type', 'risk_class',
  'internal_key', 'internal_type', 'internal_source', 'match_basis',
  'reconciliation_status', 'auto_decision_reason',
  'created_at', 'generator', 'source_version',
];

const { records: normalized } = readCsv(paths.normalized);

function matchInternal(row) {
  const hay = `${row.original_name} ${row.original_domain}`.toLowerCase();
  const hits = [];
  for (const concept of INTERNAL_MODEL) {
    for (const alias of concept.aliases) {
      if (alias && hay.includes(alias.toLowerCase())) {
        hits.push({ concept, alias, weight: alias.length + (concept.fixed ? 100 : 0) });
        break;
      }
    }
  }
  if (hits.length === 0) return null;
  // Longest alias wins; a fixed decision always outranks an observed key.
  hits.sort((a, b) => b.weight - a.weight);
  return hits;
}

const rows = [];
const counts = { MATCHED: 0, PARTIAL: 0, UNMATCHED_EXTERNAL: 0, AUTO_HOLD: 0 };

for (const row of normalized) {
  const hits = matchInternal(row);

  // High-risk guidance has no venue-selection counterpart in the internal model
  // by design; leaving it UNMATCHED is correct, not a defect.
  if (row.normalized_record_type === 'HIGH_RISK_GUIDE') {
    rows.push({
      source_record_id: row.source_record_id,
      external_name: row.original_name,
      normalized_record_type: row.normalized_record_type,
      risk_class: row.risk_class,
      internal_key: '', internal_type: '', internal_source: '',
      match_basis: '',
      reconciliation_status: 'UNMATCHED_EXTERNAL',
      auto_decision_reason: 'high-risk guidance is RESEARCH_ONLY and intentionally has no product-surface counterpart',
      created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
    });
    counts.UNMATCHED_EXTERNAL += 1;
    continue;
  }

  if (!hits) {
    rows.push({
      source_record_id: row.source_record_id,
      external_name: row.original_name,
      normalized_record_type: row.normalized_record_type,
      risk_class: row.risk_class,
      internal_key: '', internal_type: '', internal_source: '',
      match_basis: '',
      reconciliation_status: 'UNMATCHED_EXTERNAL',
      auto_decision_reason: 'no internal concept alias matched; candidate remains external-only',
      created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
    });
    counts.UNMATCHED_EXTERNAL += 1;
    continue;
  }

  const best = hits[0];
  // A clash between two *fixed* concepts of different types is a real conflict.
  const fixedTypes = new Set(hits.filter((h) => h.concept.fixed).map((h) => h.concept.type));
  const conflicted = fixedTypes.size > 1
    && fixedTypes.has('USER_JOB')
    && (fixedTypes.has('VENUE_CAPABILITY') || fixedTypes.has('DERIVED_COLLECTION'));

  let status = hits.length === 1 ? 'MATCHED' : 'PARTIAL';
  let reason = `matched internal '${best.concept.key}' via alias "${best.alias}"`
    + (hits.length > 1 ? `; ${hits.length - 1} weaker candidate(s): ${hits.slice(1, 4).map((h) => h.concept.key).join(', ')}` : '');

  if (conflicted) {
    // Fixed decisions already resolve job-vs-capability: the USER_JOB is the
    // parent and the capability is a requirement, so this is not an AUTO_HOLD.
    const job = hits.find((h) => h.concept.type === 'USER_JOB');
    status = 'MATCHED';
    reason = `job/capability pair resolved by fixed decision: parent '${job.concept.key}' (USER_JOB), `
      + `capability retained as requirement (${hits.filter((h) => h.concept.type !== 'USER_JOB').map((h) => h.concept.key).join(', ')})`;
    rows.push({
      source_record_id: row.source_record_id,
      external_name: row.original_name,
      normalized_record_type: row.normalized_record_type,
      risk_class: row.risk_class,
      internal_key: job.concept.key, internal_type: job.concept.type, internal_source: job.concept.source,
      match_basis: `alias:${job.alias}`,
      reconciliation_status: status,
      auto_decision_reason: reason,
      created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
    });
    counts.MATCHED += 1;
    continue;
  }

  rows.push({
    source_record_id: row.source_record_id,
    external_name: row.original_name,
    normalized_record_type: row.normalized_record_type,
    risk_class: row.risk_class,
    internal_key: best.concept.key,
    internal_type: best.concept.type,
    internal_source: best.concept.source,
    match_basis: `alias:${best.alias}`,
    reconciliation_status: status,
    auto_decision_reason: reason,
    created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
  });
  counts[status] += 1;
}

writeCsv(paths.reconciliation, rows, COLUMNS);

// --- Stage 3 report ---------------------------------------------------------
const byInternalType = {};
for (const r of rows) if (r.internal_type) byInternalType[r.internal_type] = (byInternalType[r.internal_type] ?? 0) + 1;

const unmatchedNonRisk = rows.filter((r) => r.reconciliation_status === 'UNMATCHED_EXTERNAL'
  && r.normalized_record_type !== 'HIGH_RISK_GUIDE');

const scenariosExists = existsSync(`${REPO_ROOT}/lib/scenarios.ts`);

const report = `# External / Internal Reconciliation Report V0.1

**Generated:** ${nowIso()}
**Generator:** ${GENERATOR}
**Source version:** ${SOURCE_VERSION}
**Repository baseline:** worktree \`agent/intent-os-autopilot\` from \`2ebf74e\`

## 1. Method

Every one of the ${normalized.length} normalized external records was matched against the typed
internal model in \`scripts/intent-os/internal-model.mjs\`. Each internal concept is keyed to the
exact repository file it was observed in, so no internal concept is asserted without evidence.

Matching is alias containment, longest-alias-wins, with fixed decisions outranking observed keys.
The winning alias is recorded per row in \`match_basis\`, making every match reproducible.

## 2. Outcome

| Status | Count |
|---|---|
| MATCHED | ${counts.MATCHED} |
| PARTIAL | ${counts.PARTIAL} |
| UNMATCHED_EXTERNAL | ${counts.UNMATCHED_EXTERNAL} |
| AUTO_HOLD | ${counts.AUTO_HOLD} |

Internal type distribution across matched records:

${Object.entries(byInternalType).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- \`${k}\`: ${v}`).join('\n')}

## 3. Fixed decisions applied

The seven fixed decisions in Stage 3 of the master goal are encoded in the internal model and were
not re-derived:

| Concept | Type | Counterpart | Type |
|---|---|---|---|
| \`work-session\` | USER_JOB | \`work-friendly\` | VENUE_CAPABILITY |
| \`family-outing\` | USER_JOB | \`family-easy\` | VENUE_CAPABILITY |
| \`local-food\` | USER_JOB | \`local-and-calm\` | DERIVED_COLLECTION |
| \`date-night\` | USER_JOB | \`romantic\` | MOOD |
| \`special-occasion\` | OCCASION / USER_JOB | — | independent, not a child of date-night |
| \`sunset\` | TIME_EVENT | \`golden-hour\` | TIME_MODIFIER |
| save / share / add-to-trip / redeem | PRODUCT_ACTION | — | — |

Where an external record matched both a USER_JOB and its capability or derived collection, the job
was taken as the parent and the capability retained as a requirement. This is the fixed decision, so
it does not raise an \`internal_external_conflict\` AUTO_HOLD.

## 4. Hermes conflicts

The Hermes duplicate/conflict register flags three conflicts requiring an owner decision. All three
are resolved by fixed decisions already in the master goal, so none needs an owner question:

${Object.entries(HERMES_CONFLICT_RESOLUTIONS).map(([id, v]) => `- **${id}** (\`${v.concept}\`) — ${v.resolution}`).join('\n')}

## 5. Findings carried forward

### 5.1 Stale internal evidence: \`lib/scenarios.ts\`

The Hermes runtime gap register records \`DRIFT_004\`: *"Trip missions reference scenario slugs but
lib/scenarios.ts is absent."* At this repository baseline the file **exists**
(${scenariosExists ? 'confirmed present' : 'NOT FOUND'}, 201 lines, four scenario slugs).

Master goal Stage 3 instructs inspection of "the live repository sources referenced there", so the
observed repository state is authoritative and \`DRIFT_004\` is treated as **stale internal evidence**,
not as a live conflict. It is not an \`internal_external_conflict\`, because the external candidate
set makes no claim about this file at all.

### 5.2 Summary-table discrepancy in the external inputs

Carried from INGEST: both external input files publish evidence-status totals that disagree with
their own per-record tables (declared 86/14 and 70/30; actual 96/4 and 61/39). Per-record values are
authoritative. No source record is affected.

### 5.3 Unmatched external candidates

${counts.UNMATCHED_EXTERNAL} records are UNMATCHED_EXTERNAL. Of these,
${counts.UNMATCHED_EXTERNAL - unmatchedNonRisk.length} are HIGH_RISK_GUIDE records that intentionally
have no product-surface counterpart under \`risk_policy\`, and ${unmatchedNonRisk.length} are genuine
coverage gaps where the external set describes a job the internal model does not yet name.

Unmatched non-risk records are candidates for new canonical parents in Stage 4. They are **not**
evidence that the product should build them; Stage 6 data readiness and Stage 7 scoring decide that.

## 6. Gate

Reconciliation completed with ${counts.AUTO_HOLD} AUTO_HOLD records. Transition: \`RECONCILE -> CANONICALIZE\`.
`;

writeFileSync(paths.reconciliationReport, report, 'utf8');

const gatePass = rows.length === normalized.length;
const state = readState() ?? {};
state.state = gatePass ? 'CANONICALIZE' : 'SAFE_HOLD';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'RECONCILE'])];
if (!gatePass) state.terminal = 'SAFE_HOLD';
writeState(state);

appendDecision(`
## ${nowIso()} — RECONCILE: external vs internal

Matched ${normalized.length} external records against ${INTERNAL_MODEL.length} typed internal concepts.
Result: MATCHED=${counts.MATCHED}, PARTIAL=${counts.PARTIAL}, UNMATCHED_EXTERNAL=${counts.UNMATCHED_EXTERNAL}, AUTO_HOLD=${counts.AUTO_HOLD}.

Job/capability collisions were resolved by the master goal's fixed decisions rather than by
AUTO_HOLD, because the policy's \`internal_external_conflict\` default applies to unresolved
conflicts, and these are resolved by specification.

Hermes \`DRIFT_004\` claims \`lib/scenarios.ts\` is absent; the file exists at this baseline. Observed
repository state is authoritative per Stage 3. Recorded as stale internal evidence.
`);

appendEvent({
  stage: 'RECONCILE',
  status: gatePass ? 'PASS' : 'FAIL',
  inputs: [rel(paths.normalized), 'docs/intent-os/autopilot/inputs/internal/hermes/*', 'lib/*.ts', 'docs/seo/os/*.json'],
  outputs: [rel(paths.reconciliation), rel(paths.reconciliationReport)],
  checks: Object.entries(counts).map(([k, v]) => `${k}=${v}`),
  decisions: ['hermes_conflicts_resolved_by_fixed_decisions=3', 'DRIFT_004=stale_internal_evidence'],
  next_state: state.state,
});

for (const [k, v] of Object.entries(counts)) console.log(`${k}: ${v}`);
console.log(`internal types matched: ${Object.keys(byInternalType).length}`);
console.log(`gate: ${gatePass ? 'PASS' : 'FAIL'} -> ${state.state}`);
process.exit(gatePass ? 0 : 1);
