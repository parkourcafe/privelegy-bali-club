#!/usr/bin/env node
// Terminal stage for the live-verification run: SAFE_HOLD.
//
// Distinction that matters:
//   NO_BUILD  = "I looked, and there is no pilot-eligible data."
//   SAFE_HOLD = "The check that could overturn that could not be run."
// The live verification is the check that could overturn NO_BUILD, and it is
// blocked by a capability the agent may not create for itself.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  paths, readCsv, readState, writeState, appendEvent, appendDecision,
  nowIso, GENERATOR, SOURCE_VERSION, REPO_ROOT,
} from './lib.mjs';

const R = (p) => join(REPO_ROOT, p);
const snapStatus = JSON.parse(readFileSync(R('docs/intent-os/data-readiness/SNAPSHOT_STATUS.json'), 'utf8'));
const { records: library } = readCsv(paths.libraryCsv);
const { records: ledger } = readCsv(paths.ledger);
const byReadiness = {};
for (const r of library) byReadiness[r.data_readiness] = (byReadiness[r.data_readiness] ?? 0) + 1;

const reason = {
  program: 'other-bali-intent-os-autopilot',
  terminal_state: 'SAFE_HOLD',
  decided_at: nowIso(),
  generator: GENERATOR,
  source_version: SOURCE_VERSION,
  repository_baseline: '2ebf74e',
  branch: 'agent/intent-os-autopilot',
  requested_task: 'read-only live Supabase coverage verification by district and job_slug',
  cause: {
    code: 'BLOCKED_NO_CREDENTIALS',
    statement: 'Supabase anon credentials are not present in any location on this machine, so no live '
      + 'read could be attempted. The verification that could change the NO_BUILD finding did not run.',
    required_env: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    searched: [
      'worktree .env.local (absent)',
      'main checkout .env.local / .env / .env.*.local (none present)',
      'sibling clones (only Documents/actor/other-bali-site/.env.local, containing VERCEL_OIDC_TOKEN only)',
      'process environment (no SUPABASE* variables exported)',
    ],
    query_attempted: false,
    rows_read: 0,
  },
  read_only_compliance: {
    mutating_verbs_used: [],
    database_records_modified: 0,
    migrations_run: 0,
    schema_changes: 0,
    grants_changed: 0,
    venues_published: 0,
    job_tags_written: 0,
    note: 'No connection was opened. Compliance is vacuous but stated explicitly for the audit trail.',
  },
  policy_basis: [
    '04_AUTONOMOUS_DECISION_POLICY.yaml ambiguity_defaults.tool_unavailable: USE_ALLOWED_FALLBACK_OR_SAFE_HOLD',
    '08_SECURITY_AND_RELEASE_POLICY.md safe-stop: record the exact blocker and remediation; do not improvise around the boundary',
  ],
  fallback_evaluated: {
    source: 'repository fixture data/resort-import/venues.json',
    result: 'unchanged: 0 pilot-eligible intents',
    counts_by_readiness: byReadiness,
    note: 'The fallback reproduces the prior NO_BUILD finding but cannot confirm or refute live coverage.',
  },
  id_integrity: {
    source_records: ledger.length,
    source_records_unique: new Set(ledger.map((r) => r.source_record_id)).size,
    canonical_records: library.length,
    canonical_records_unique: new Set(library.map((r) => r.canonical_intent_id)).size,
    canonical_id_range: `${library[0]?.canonical_intent_id} .. ${library[library.length - 1]?.canonical_intent_id}`,
    renumbered: false,
  },
  unblock: {
    statement: 'Export anon credentials and re-run; the pipeline consumes the snapshot automatically.',
    commands: [
      'export NEXT_PUBLIC_SUPABASE_URL=...',
      'export NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # anon, never service-role',
      'node scripts/intent-os/coverage-snapshot.mjs',
      'node scripts/intent-os/data-readiness.mjs',
      'node scripts/intent-os/validate_all.mjs',
    ],
    expected_transitions: {
      ready_cells_zero: 'DATA_READINESS -> NO_BUILD',
      ready_cells_under_5_districts: 'READY_WITH_LIMITED_DISTRICTS -> SHORTLIST -> ... -> READY_FOR_PR',
      ready_cells_5_plus_districts: 'READY -> SHORTLIST -> ... -> READY_FOR_PR',
    },
  },
};
writeFileSync(R('docs/intent-os/runtime/safe-hold-reason.json'), JSON.stringify(reason, null, 2) + '\n', 'utf8');

writeFileSync(R('docs/intent-os/runtime/final-status.md'), `# Final Status

**Terminal state:** \`SAFE_HOLD\`
**Decided at:** ${nowIso()}
**Branch:** \`agent/intent-os-autopilot\` (worktree, baseline \`2ebf74e\`)
**Machine-readable reason:** \`docs/intent-os/runtime/safe-hold-reason.json\`
**Prior finding retained:** \`docs/intent-os/runtime/no-build-reason.json\`

## Why SAFE_HOLD and not NO_BUILD

The requested task was a **read-only live Supabase verification** of coverage by district and
job_slug. That verification is precisely the check capable of overturning the earlier \`NO_BUILD\`
finding.

It could not run: **no Supabase anon credentials exist on this machine.** No connection was opened
and no query was attempted.

Reporting \`NO_BUILD\` again would assert that live coverage was checked and found wanting. It was not
checked. \`SAFE_HOLD\` states the honest position — the blocking check did not execute — per
\`tool_unavailable: USE_ALLOWED_FALLBACK_OR_SAFE_HOLD\`.

## Credential search

| Location | Result |
|---|---|
| worktree \`.env.local\` | absent |
| main checkout \`.env.local\`, \`.env\`, \`.env.*.local\` | none present |
| sibling clones | one \`.env.local\`, containing \`VERCEL_OIDC_TOKEN\` only |
| process environment | no \`SUPABASE*\` variables exported |

\`lib/supabase/server.ts\` gates all reads behind \`NEXT_PUBLIC_SUPABASE_URL\` +
\`NEXT_PUBLIC_SUPABASE_ANON_KEY\`. Neither is available.

## Read-only compliance

No connection opened, so every prohibition held trivially — stated explicitly for the audit trail:

| Constraint | Status |
|---|---|
| database records modified | 0 |
| migrations run | 0 |
| schema changes | 0 |
| grants changed | 0 |
| venues published | 0 |
| job tags written | 0 |
| mutating HTTP verbs used | none |

The snapshot tool is structurally read-only: GET-only against PostgREST, no \`/rpc/\` call, and it
**refuses to run with a non-\`anon\` JWT role**, so a service-role key cannot be used even accidentally.

## Fallback evaluated

The repository fixture was re-evaluated through the snapshot-aware model. Outcome unchanged:

${Object.entries(byReadiness).sort((a, b) => b[1] - a[1]).map(([k, v]) => `- \`${k}\`: ${v}`).join('\n')}

Pilot-eligible intents: **0**. This reproduces the prior finding but cannot confirm or refute live
coverage.

## ID integrity

| | |
|---|---|
| Source records | ${ledger.length} (${new Set(ledger.map((r) => r.source_record_id)).size} unique) |
| Canonical records | ${library.length} (${new Set(library.map((r) => r.canonical_intent_id)).size} unique) |
| Canonical range | \`${library[0]?.canonical_intent_id}\` .. \`${library[library.length - 1]?.canonical_intent_id}\` |
| Renumbered | no |

\`OB-INT-0001\`..\`OB-INT-0200\` and \`OB-CAN-0001\`..\`OB-CAN-0157\` are preserved exactly.

## Changed files

Confined to \`docs/intent-os/\` and \`scripts/intent-os/\`. No homepage-copy file and nothing outside
those two trees was touched.

## Next automatic action

Export anon credentials and re-run — no code change needed:

\`\`\`bash
${reason.unblock.commands.join('\n')}
\`\`\`
`, 'utf8');

const state = readState() ?? {};
state.state = 'SAFE_HOLD';
state.terminal = 'SAFE_HOLD';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'LIVE_VERIFICATION_ATTEMPT'])];
writeState(state);

appendDecision(`
## ${nowIso()} — LIVE_VERIFICATION: SAFE_HOLD

Requested read-only live Supabase coverage verification. **No query was attempted**: neither
\`NEXT_PUBLIC_SUPABASE_URL\` nor \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` exists in the worktree, the main
checkout, sibling clones, or the process environment. The only \`.env.local\` on the machine contains
\`VERCEL_OIDC_TOKEN\` alone.

Terminal state is \`SAFE_HOLD\`, not \`NO_BUILD\`. \`NO_BUILD\` would assert that live coverage was
examined; it was not. Policy basis: \`tool_unavailable: USE_ALLOWED_FALLBACK_OR_SAFE_HOLD\` and the
safe-stop rule in \`08_SECURITY_AND_RELEASE_POLICY.md\`.

Deliberately **not** done: \`vercel env pull\` would have fetched credentials, but it writes
\`.env.local\` at the repository root — outside the permitted \`docs/intent-os/\` and
\`scripts/intent-os/\` scope — and would pull the service-role key the owner forbade using. Improvising
around the boundary is exactly what the safe-stop rule prohibits.

Snapshot tooling and schema are committed, and \`readiness-model.mjs\` now prefers a live snapshot over
the repository fixture, so supplying credentials makes the re-run fully automatic.
`);

appendEvent({
  stage: 'LIVE_VERIFICATION',
  status: 'SAFE_HOLD',
  inputs: ['docs/intent-os/data-readiness/SNAPSHOT_STATUS.json'],
  outputs: [
    'docs/intent-os/data-readiness/README.md',
    'docs/intent-os/data-readiness/SNAPSHOT_STATUS.json',
    'docs/intent-os/runtime/safe-hold-reason.json',
    'docs/intent-os/runtime/final-status.md',
  ],
  checks: [`snapshot_status=${snapStatus.status}`, 'query_attempted=false', 'pilot_eligible=0',
    `source_ids=${ledger.length}`, `canonical_ids=${library.length}`],
  decisions: ['terminal_state=SAFE_HOLD', 'reason=BLOCKED_NO_CREDENTIALS', 'no_env_pull_outside_scope'],
  next_state: 'SAFE_HOLD',
});

console.log('terminal: SAFE_HOLD');
console.log(`snapshot status: ${snapStatus.status}`);
console.log(`ids preserved: ${ledger.length} source, ${library.length} canonical`);
