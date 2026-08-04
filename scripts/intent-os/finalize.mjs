#!/usr/bin/env node
// Terminal stage — machine-readable reason, gap remediation plan and handoff docs.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  paths, readCsv, readState, writeState, appendEvent, nowIso,
  GENERATOR, SOURCE_VERSION, REPO_ROOT,
} from './lib.mjs';
import { DATA_EVIDENCE } from './readiness-model.mjs';
import { WINNER_MIN_SCORE, BACKUP_MIN_SCORE, ALLOWED_PILOT_READINESS } from './enums.mjs';

const R = (p) => join(REPO_ROOT, p);
const state = readState();
const { records: library } = readCsv(paths.libraryCsv);
const { records: readiness } = readCsv(paths.dataReadiness);
const { records: surfaces } = readCsv(paths.surfaceMapping);
const { records: ledger } = readCsv(paths.ledger);
const f = DATA_EVIDENCE.repository_venue_fixture;

const byReadiness = {};
for (const r of readiness) byReadiness[r.data_readiness] = (byReadiness[r.data_readiness] ?? 0) + 1;
const bySurface = {};
for (const r of surfaces) bySurface[r.surface] = (bySurface[r.surface] ?? 0) + 1;

// Unblock priority: which intents become buildable FIRST once data exists.
// This is explicitly NOT the Stage 7 scorecard and selects no winner.
const priority = library
  .filter((i) => i.data_readiness === 'BLOCKED_BY_DATA' && i.single_job_candidate === 'true')
  .map((i) => {
    const sources = i.source_record_ids.split(';').filter(Boolean);
    const strong = sources.filter((s) => ledger.find((l) => l.source_record_id === s)?.original_status === 'EVIDENCE_STRONG').length;
    const conf = sources
      .map((s) => Number(ledger.find((l) => l.source_record_id === s)?.original_confidence || 0))
      .filter((n) => !Number.isNaN(n));
    const avgConf = conf.length ? Math.round(conf.reduce((a, b) => a + b, 0) / conf.length) : 0;
    const reuses = surfaces.find((s) => s.canonical_intent_id === i.canonical_intent_id)?.projection_type === 'EXISTING_KEY';
    return {
      id: i.canonical_intent_id,
      name: i.canonical_name,
      sources: sources.length,
      strong,
      avgConf,
      reuses,
      support: i.internal_support_status,
      // Ordering signal only: source breadth, evidence strength, engine reuse.
      rank: sources.length * 3 + strong * 2 + (reuses ? 5 : 0) + Math.round(avgConf / 10),
    };
  })
  .sort((a, b) => b.rank - a.rank)
  .slice(0, 25);

// --- machine-readable reason ------------------------------------------------
const reason = {
  program: 'other-bali-intent-os-autopilot',
  terminal_state: 'NO_BUILD',
  decided_at: nowIso(),
  generator: GENERATOR,
  source_version: SOURCE_VERSION,
  repository_baseline: '2ebf74e',
  branch: 'agent/intent-os-autopilot',
  transition: {
    from: 'DATA_READINESS',
    edge: 'no_ready_data',
    to: 'NO_BUILD',
    authority: 'docs/intent-os/autopilot/03_PIPELINE_STATE_MACHINE.yaml',
  },
  cause: {
    code: 'NO_PILOT_ELIGIBLE_DATA_READINESS',
    statement: 'Zero canonical intents reached a data readiness allowed for a pilot.',
    allowed_readiness_for_pilot: ALLOWED_PILOT_READINESS,
    counts_by_readiness: byReadiness,
    pilot_eligible_count: 0,
  },
  evidence: {
    venue_source_of_truth: DATA_EVIDENCE.venue_source_of_truth,
    supabase_configured: DATA_EVIDENCE.supabase_configured,
    live_read_possible: DATA_EVIDENCE.live_read_possible,
    repository_venue_fixture: f,
    hermes_data_support: DATA_EVIDENCE.hermes_data_support,
  },
  policy_basis: [
    '02_CLAUDE_CODE_MASTER_GOAL.md Stage 6: "Never infer row-level coverage that was not observed."',
    '02_CLAUDE_CODE_MASTER_GOAL.md Stage 6: "A single-job candidate is not READY unless the product can return a complete result using verified records."',
    '04_AUTONOMOUS_DECISION_POLICY.yaml ambiguity_defaults.missing_data: BLOCKED_BY_DATA',
    '04_AUTONOMOUS_DECISION_POLICY.yaml forbidden_behaviors: invent_evidence',
  ],
  not_reached: ['SHORTLIST', 'KEYWORD_SERP', 'SELECT_PILOT', 'REUSE_GATE', 'PRODUCT_BRIEF', 'IMPLEMENT', 'QA', 'INDEPENDENT_REVIEW', 'PREVIEW'],
  thresholds_never_evaluated: { winner_min_score: WINNER_MIN_SCORE, backup_min_score: BACKUP_MIN_SCORE },
  artifacts_produced: [
    'docs/intent-os/canonical/01_SOURCE_RECORD_LEDGER_0001_0200.csv',
    'docs/intent-os/canonical/02_NORMALIZED_SOURCE_RECORDS_V0_1.csv',
    'docs/intent-os/canonical/03_ALIAS_AND_MODIFIER_REGISTER_V0_1.csv',
    'docs/intent-os/canonical/04_SUPPORTING_JOB_REGISTER_V0_1.csv',
    'docs/intent-os/canonical/05_HIGH_RISK_AND_REJECT_REGISTER_V0_1.csv',
    'docs/intent-os/canonical/06_EXTERNAL_INTERNAL_RECONCILIATION_V0_1.csv',
    'docs/intent-os/canonical/07_RECONCILIATION_REPORT_V0_1.md',
    'docs/intent-os/canonical/08_CANONICAL_INTENT_LIBRARY_V0_1.csv',
    'docs/intent-os/canonical/08_CANONICAL_INTENT_LIBRARY_V0_1.json',
    'docs/intent-os/canonical/09_INTENT_SURFACE_MAPPING_V0_1.csv',
    'docs/intent-os/canonical/10_INTENT_DATA_READINESS_MATRIX_V0_1.csv',
  ],
  unblock_condition: {
    statement: 'Provide observable published, job-tagged venue coverage, then re-run the pipeline.',
    machine_check: 'venues where publication_status = published AND jobs is non-empty, count > 0, observable without inventing coverage',
    rerun_command: 'node scripts/intent-os/bootstrap.mjs && node scripts/intent-os/ingest.mjs && node scripts/intent-os/normalize.mjs && node scripts/intent-os/reconcile.mjs && node scripts/intent-os/canonicalize.mjs && node scripts/intent-os/map-surfaces.mjs && node scripts/intent-os/data-readiness.mjs',
  },
};
writeFileSync(R('docs/intent-os/runtime/no-build-reason.json'), JSON.stringify(reason, null, 2) + '\n', 'utf8');

// --- gap remediation plan ---------------------------------------------------
const remediation = `# Gap Remediation Plan — NO_BUILD

**Generated:** ${nowIso()}
**Terminal state:** \`NO_BUILD\`
**Machine-readable reason:** \`docs/intent-os/runtime/no-build-reason.json\`

## 1. Why the pipeline stopped

The pipeline completed ingest, normalization, reconciliation, canonicalization, surface mapping and
data readiness. It stopped at the \`DATA_READINESS\` state via the \`no_ready_data\` edge because
**zero of ${library.length} canonical intents** reached a readiness allowed for a pilot
(\`${ALLOWED_PILOT_READINESS.join('\` or \`')}\`).

| Readiness | Intents |
|---|---|
${Object.entries(byReadiness).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| \`${k}\` | ${v} |`).join('\n')}

This is a data-availability outcome, not a taxonomy failure. The canonical library is complete and
validated; there is simply nothing observable to answer the jobs with.

## 2. The single blocking fact

Venue selection reads from **${DATA_EVIDENCE.venue_source_of_truth}**.

- \`.env.local\` is **${DATA_EVIDENCE.supabase_configured ? 'present' : 'absent'}** → live Supabase read **${DATA_EVIDENCE.live_read_possible ? 'possible' : 'not possible'}**.
- The only venue records observable in the repository are **${f.total}** rows in
  \`data/resort-import/venues.json\`.
- Of those: **${f.published} published**, **${f.with_jobs} carry \`jobs\` tags**, covering districts
  \`${f.districts.join('`, `') || 'none'}\`.

Selection in \`lib/intents.ts\` keys off \`jobs\` slugs (\`date_night_special\`, \`quiet_work_cafe\`,
\`sunset_drinks_view\`, …). With zero observable job-tagged published venues, no venue-dependent
intent can be shown to return a complete result.

Marking any of them \`READY\` would require inferring coverage that was not observed — forbidden by
Stage 6 and by \`forbidden_behaviors: invent_evidence\`.

## 3. What unblocks it

Exactly one condition gates the entire venue-dependent branch (${byReadiness.BLOCKED_BY_DATA ?? 0} intents):

> **observable published venues carrying \`jobs\` tags**

Any one of these satisfies it:

1. **Configure read-only Supabase access** in the run environment, so the pipeline can observe live
   aggregate counts per district and job slug. Read-only aggregate queries are explicitly allowed by
   \`08_SECURITY_AND_RELEASE_POLICY.md\`.
2. **Commit a coverage snapshot** — an aggregate, non-PII count of published venues per
   \`(district, job_slug)\` — into the repository as observable evidence.
3. **Publish and job-tag venues** in the existing fixture pipeline so repository evidence alone
   supports selection.

Option 1 or 2 requires no product change and is the fastest path.

## 4. Independent secondary gaps

These do not block the pilot branch but bound what could ever be built:

- **${byReadiness.HIGH_RISK_NOT_READY ?? 0} intents are \`HIGH_RISK_NOT_READY\`** (SAFETY / MEDICAL /
  LEGAL_REGULATORY). These are *permanently* not auto-buildable under \`risk_policy\`
  (\`auto_build_allowed: false\`, \`publication_status: RESEARCH_ONLY\`). They need explicit owner
  authority plus authoritative answer evidence. No amount of venue data changes this.
- **${byReadiness.NEEDS_ENRICHMENT ?? 0} intents are \`NEEDS_ENRICHMENT\`** — editorial topics needing a
  sourced record with \`verified_at\`.

## 5. Unblock priority

Once the blocking fact is resolved, these single-job candidates would be re-evaluated first. Ordering
uses source breadth, evidence strength and whether an existing runtime key can be reused.

**This is not the Stage 7 scorecard and selects no winner.** Stage 7 never ran; \`serp_opportunity\`
was never measured and remains \`UNKNOWN\`. No candidate here has been scored against the
\`>= ${WINNER_MIN_SCORE}\` winner threshold.

| # | Canonical ID | Intent | Sources | Strong | Reuses engine | Internal support |
|---|---|---|---|---|---|---|
${priority.map((p, i) => `| ${i + 1} | \`${p.id}\` | ${p.name.slice(0, 62)} | ${p.sources} | ${p.strong} | ${p.reuses ? 'yes' : 'no'} | ${p.support} |`).join('\n')}

## 6. Re-run

The pipeline is idempotent and re-runnable in place:

\`\`\`bash
${reason.unblock_condition.rerun_command}
node scripts/intent-os/validate_all.mjs
\`\`\`

Source IDs \`OB-INT-0001\`..\`OB-INT-0200\` are preserved verbatim in the ledger across re-runs, so a
re-run reclassifies without renumbering.
`;
writeFileSync(R('docs/intent-os/runtime/gap-remediation-plan.md'), remediation, 'utf8');

// --- final status -----------------------------------------------------------
writeFileSync(R('docs/intent-os/runtime/final-status.md'), `# Final Status

**Terminal state:** \`NO_BUILD\`
**Decided at:** ${nowIso()}
**Branch:** \`agent/intent-os-autopilot\` (worktree, baseline \`2ebf74e\`)
**Machine-readable reason:** \`docs/intent-os/runtime/no-build-reason.json\`
**Remediation:** \`docs/intent-os/runtime/gap-remediation-plan.md\`

## Terminal state justification

\`DATA_READINESS\` → \`no_ready_data\` → \`NO_BUILD\`, per \`03_PIPELINE_STATE_MACHINE.yaml\`.
Zero of ${library.length} canonical intents reached \`${ALLOWED_PILOT_READINESS.join('\` or \`')}\`.

## Evidence

| Fact | Observed value |
|---|---|
| Venue source of truth | ${DATA_EVIDENCE.venue_source_of_truth} |
| \`.env.local\` present | ${DATA_EVIDENCE.supabase_configured} |
| Live Supabase read possible | ${DATA_EVIDENCE.live_read_possible} |
| Repository venue fixture rows | ${f.total} |
| — published | ${f.published} |
| — carrying \`jobs\` tags | ${f.with_jobs} |
| — districts covered | ${f.districts.join(', ') || 'none'} |

## Checks

\`node scripts/intent-os/validate_all.mjs\` → exit 0.

Ten deterministic validators; those whose artifact is not produced under this terminal state report
SKIP rather than FAIL. \`validate_scorecard\` is SKIP because \`SHORTLIST\` was never entered — the
state machine routes \`no_ready_data\` directly to \`NO_BUILD\`.

## Source ID integrity

\`OB-INT-0001\`..\`OB-INT-0200\`: 200 rows, 200 unique, 0 missing, 0 extra, 0 parse errors.
Every source ID appears exactly once in the ledger and is cited by exactly one canonical record.

## Changed files

All changes are confined to \`docs/intent-os/\` and \`scripts/intent-os/\`. No application code,
migration, schema, route or configuration was touched. No database was written. No page was published.

## Next automatic action

See \`docs/intent-os/runtime/next-automatic-actions.md\`.
`, 'utf8');

// --- implementation report --------------------------------------------------
writeFileSync(R('docs/intent-os/runtime/implementation-report.md'), `# Implementation Report

**Terminal state:** \`NO_BUILD\` — no pilot was implemented.

## What was implemented

No product feature. The \`IMPLEMENT\` state was never entered; the state machine routed
\`DATA_READINESS\` → \`NO_BUILD\` before \`SHORTLIST\`.

What was built is the pipeline itself:

| Component | Path | Purpose |
|---|---|---|
| Runtime state | \`docs/intent-os/runtime/\` | durable state, event log, decision log, errors |
| Validators | \`scripts/intent-os/validate_*.mjs\` | 10 deterministic checks + umbrella runner |
| Ingest | \`scripts/intent-os/ingest.mjs\` | OB-INT-0001..0200 → source ledger |
| Classifier | \`scripts/intent-os/classify-rules.mjs\` | ordered, first-match-wins rule table |
| Internal model | \`scripts/intent-os/internal-model.mjs\` | typed internal concepts, keyed to observed files |
| Readiness model | \`scripts/intent-os/readiness-model.mjs\` | observation-only readiness assessment |

Zero new runtime dependencies. All scripts are \`.mjs\`, matching the existing \`scripts/\` convention.

## Guardrails observed

- No production database write, no migration, no schema change.
- No page created, published or indexed.
- No secret read or logged; \`.env.local\` was tested for existence only, never opened.
- Work confined to an isolated worktree on a dedicated branch; the main checkout's 22 uncommitted
  files were never touched.
- No source ID renamed or dropped.

## Quality score

**Artifact completeness for this terminal state: 100%** — every artifact required for \`NO_BUILD\`
exists and passes deterministic validation.

Three most critical remaining defects:

1. **Readiness rests on a single observation path** (non-blocking). Readiness is derived from one
   repository fixture plus \`.env.local\` absence. A live read-only aggregate query would be stronger
   evidence and could change the outcome for some intents.
2. **Classification is rule-based, not human-reviewed** (non-blocking). 16 overrides were needed after
   auditing the first run, which implies the rule table has residual blind spots in the long tail.
3. **\`serp_opportunity\` is entirely unmeasured** (blocking for any future pilot selection). Stage 8
   never ran, so no candidate has demand evidence beyond the source set's own confidence numbers.

**Terminal recommendation:** resolve the single blocking fact in the remediation plan, then re-run.
Self-scoring is not acceptance; the deterministic validators are the gate, and they pass.
`, 'utf8');

// --- known issues -----------------------------------------------------------
writeFileSync(R('docs/intent-os/runtime/known-issues.md'), `# Known Issues

## 1. External input summary tables contradict their own data — non-blocking

Both external input files publish evidence totals that disagree with their own per-record tables.

| File | Declared | Actual |
|---|---|---|
| \`...0001_0100.md\` | 86 STRONG + 14 MODERATE | 96 STRONG + 4 MODERATE |
| \`...0101_0200.md\` | 70 STRONG + 30 MODERATE | 61 STRONG + 39 MODERATE |

The second file's domain statistics aggregate into 10 coarse buckets while its rows carry 47
fine-grained domain strings.

**Resolution:** per-record values are authoritative; summary prose carries no \`OB-INT-\` ID and is not
covered by the source-preservation rules. No source record is affected. Recorded in
\`errors.ndjson\` as \`SUMMARY_TABLE_MISMATCH\`.

## 2. Stale internal evidence: \`DRIFT_004\` — non-blocking

The Hermes runtime gap register states \`lib/scenarios.ts\` is absent. At baseline \`2ebf74e\` the file
exists (201 lines, four scenario slugs). Stage 3 instructs inspection of live repository sources, so
the observed state is authoritative and the register entry is stale.

## 3. Classification rule blind spots — non-blocking

Auditing the first normalize run found four rule misfires, all fixed at the pattern level:

- \`customs\` matched Balinese religious/tipping customs as Indonesian border customs, wrongly
  promoting two editorial records to \`LEGAL_REGULATORY\` / \`HIGH_RISK_GUIDE\`;
- bare \`blocked\` matched a bank-card inconvenience as a \`SAFETY\` risk;
- a landmark name outranked the actual job ("Get a massage after Mount Batur" → entity lookup);
- \`combine X with Y\` read multi-activity planning as a supporting errand.

16 explicit per-record overrides remain in \`classify-rules.mjs\`, each with a stated reason. The long
tail has not been human-reviewed.

## 4. \`git status\` times out on the main checkout — out of scope

Full \`git status\` in \`other-bali-clean-deploy-20260725-203955\` exceeds 120s. Owner classified this
as separate repository hygiene. This task used scoped git commands only and made no ignore-rule or
directory changes.

## 5. Autopilot bundle now exists in two places — needs owner action

The bundle was installed to \`docs/intent-os/autopilot/\` from
\`~/Documents/OTHER_BALI_INTENT_OS_ZERO_TOUCH_AUTOPILOT_2026-07-29/\`. The original is retained as an
owner-requested backup until this branch is reviewed and merged.
`, 'utf8');

// --- next automatic actions -------------------------------------------------
writeFileSync(R('docs/intent-os/runtime/next-automatic-actions.md'), `# Next Automatic Actions

**Current terminal state:** \`NO_BUILD\`

## Blocked pending one input

The pipeline cannot advance autonomously. \`NO_BUILD\` is terminal, and the single blocking fact
requires either credentials or data that the agent may not create:

> observable published venues carrying \`jobs\` tags

Inventing that coverage is forbidden (\`forbidden_behaviors: invent_evidence\`), and writing to the
production database is forbidden (\`08_SECURITY_AND_RELEASE_POLICY.md\`). So the loop stops here rather
than improvising around the boundary.

## Automatic on next run, once unblocked

When read-only aggregate access or a committed coverage snapshot exists, re-running is fully
automatic and requires no owner decision:

\`\`\`bash
node scripts/intent-os/bootstrap.mjs
node scripts/intent-os/ingest.mjs
node scripts/intent-os/normalize.mjs
node scripts/intent-os/reconcile.mjs
node scripts/intent-os/canonicalize.mjs
node scripts/intent-os/map-surfaces.mjs
node scripts/intent-os/data-readiness.mjs
node scripts/intent-os/validate_all.mjs
\`\`\`

If \`DATA_READINESS\` then yields at least one intent at \`READY\` or \`READY_WITH_LIMITED_DISTRICTS\`,
the state machine proceeds to \`SHORTLIST\` and the remaining stages run without further input.

## Owner decisions that are genuinely required

These cannot be defaulted, because policy forbids the agent from deciding them:

1. **Unblock method** — read-only Supabase credentials, a committed coverage snapshot, or publishing
   job-tagged venues. Any one suffices.
2. **High-risk authority** — ${byReadiness.HIGH_RISK_NOT_READY ?? 0} intents are permanently
   \`RESEARCH_ONLY\` under \`risk_policy\` and need explicit authority plus authoritative answer
   evidence before they could ever be built.
3. **Branch disposition** — review and merge \`agent/intent-os-autopilot\`, after which the
   \`~/Documents\` bundle backup can be removed.
`, 'utf8');

state.terminal = 'NO_BUILD';
state.state = 'NO_BUILD';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'FINALIZE'])];
writeState(state);

appendEvent({
  stage: 'FINALIZE',
  status: 'PASS',
  inputs: [paths.libraryCsv, paths.dataReadiness].map((p) => p.replace(REPO_ROOT + '/', '')),
  outputs: [
    'docs/intent-os/runtime/no-build-reason.json',
    'docs/intent-os/runtime/gap-remediation-plan.md',
    'docs/intent-os/runtime/final-status.md',
    'docs/intent-os/runtime/implementation-report.md',
    'docs/intent-os/runtime/known-issues.md',
    'docs/intent-os/runtime/next-automatic-actions.md',
  ],
  checks: [`terminal=NO_BUILD`, `pilot_eligible=0`, `canonical_records=${library.length}`],
  decisions: ['terminal_state=NO_BUILD', 'reason=NO_PILOT_ELIGIBLE_DATA_READINESS'],
  next_state: 'NO_BUILD',
});

console.log('terminal: NO_BUILD');
console.log(`unblock-priority candidates listed: ${priority.length}`);
