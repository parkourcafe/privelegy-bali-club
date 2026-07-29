#!/usr/bin/env node
// Stage 9 (SELECT_PILOT) + Stage 10 (REUSE_GATE) + Stage 10b (PRODUCT_BRIEF).

import { writeFileSync } from 'node:fs';
import {
  paths, readCsv, readState, writeState, appendEvent, appendDecision,
  nowIso, GENERATOR, SOURCE_VERSION, REPO_ROOT,
} from './lib.mjs';
import { WINNER_MIN_SCORE, BACKUP_MIN_SCORE, ALLOWED_PILOT_READINESS } from './enums.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');
const { records: shortlist } = readCsv(paths.shortlist);
const { records: serp } = readCsv(paths.serpScorecard);
const serpById = new Map(serp.map((r) => [r.canonical_intent_id, r]));

const ranked = [...shortlist].sort((a, b) => Number(b.total_score) - Number(a.total_score));
const winner = ranked.find((r) => Number(r.total_score) >= WINNER_MIN_SCORE
  && ALLOWED_PILOT_READINESS.includes(r.data_readiness));
const backup = ranked.find((r) => r !== winner && Number(r.total_score) >= BACKUP_MIN_SCORE
  && ALLOWED_PILOT_READINESS.includes(r.data_readiness));

if (!winner) {
  const state = readState() ?? {};
  state.state = 'NO_BUILD'; state.terminal = 'NO_BUILD'; state.updated_at = nowIso();
  writeState(state);
  appendEvent({ stage: 'SELECT_PILOT', status: 'NO_WINNER', inputs: [rel(paths.shortlist)], outputs: [],
    checks: [`top_score=${ranked[0]?.total_score}`, `threshold=${WINNER_MIN_SCORE}`], next_state: 'NO_BUILD' });
  console.log('no winner -> NO_BUILD');
  process.exit(0);
}

// --- Stage 10: reuse gate ---------------------------------------------------
// Observed at baseline: /bali/[district]/[intent] renders a spoke whenever a
// district has >= SPOKE_MIN_VENUES venues carrying the intent's jobSlug.
const SPOKE_MIN_VENUES = 4;
const snapshot = readCsv(`${REPO_ROOT}/docs/intent-os/data-readiness/COVERAGE_SNAPSHOT_BY_DISTRICT_JOB.csv`).records;
const winnerJob = 'date_night_special';
const qualifying = snapshot.filter((r) => r.job_slug === winnerJob
  && Number(r.published_matching_venues) >= SPOKE_MIN_VENUES);

const reuseDecision = 'EXTEND_EXISTING';

const reuseReport = `# Reuse Gate Report V0.1

**Generated:** ${nowIso()}
**Winner:** \`${winner.canonical_intent_id}\` — ${winner.canonical_name} (score ${winner.total_score})
**Backup:** ${backup ? `\`${backup.canonical_intent_id}\` — ${backup.canonical_name} (score ${backup.total_score})` : 'none above threshold'}

## Decision

\`\`\`
${reuseDecision}
\`\`\`

**Duplicating an existing planning engine is forbidden**, and the winner is already served.

## Evidence: the winner already renders in production code

\`app/bali/[district]/[intent]/page.tsx\` renders an intent spoke for any (district, intent) pair
where \`getIntentSpokes()\` finds at least \`SPOKE_MIN_VENUES\` (= ${SPOKE_MIN_VENUES}, \`lib/data.ts:870\`)
published venues carrying the intent's \`jobSlug\`.

The winner maps to \`date-night\` / \`${winnerJob}\` in \`lib/intents.ts\`. Live coverage:

| District | Published venues | Qualifies (>= ${SPOKE_MIN_VENUES}) |
|---|---|---|
${snapshot.filter((r) => r.job_slug === winnerJob).sort((a, b) => Number(b.published_matching_venues) - Number(a.published_matching_venues))
    .map((r) => `| ${r.district} | ${r.published_matching_venues} | ${Number(r.published_matching_venues) >= SPOKE_MIN_VENUES ? 'yes' : 'no'} |`).join('\n')}

**${qualifying.length} districts already qualify**, including Ubud with ${snapshot.find((r) => r.district === 'ubud' && r.job_slug === winnerJob)?.published_matching_venues} published venues.
\`/bali/ubud/date-night\` therefore renders today, with metadata, canonical, FAQs, JSON-LD and an
internal-link mesh already implemented.

## Why not the other three options

| Option | Verdict |
|---|---|
| \`NEW_TOOL\` | **Rejected.** A new romantic-dinner tool would duplicate a live engine — explicitly forbidden. |
| \`NEW_ENTRY_SAME_ENGINE\` | **Rejected.** No new entry is needed; \`date-night\` already exists in \`lib/intents.ts\` and Ubud already qualifies. |
| \`HOLD\` | **Rejected.** Nothing is blocked: data is READY and the engine exists. Holding would misreport a live, working surface as blocked. |
| \`EXTEND_EXISTING\` | **Selected.** The remaining value is in the gap between the coarse spoke and the finer-grained source records. |

## The actual gap

The existing spoke answers "show me date-night venues in Ubud". Source records describe finer
decisions the spoke cannot express:

| Source | Job the spoke cannot answer today |
|---|---|
| \`OB-INT-0017\` | a dinner spot **without loud music** |
| \`OB-INT-0015\` | romantic dinner **with a sunset view** specifically |
| \`OB-INT-0016\` | **special-occasion / birthday** framing, distinct from date night |
| \`OB-INT-0044\` | **private-chef in-villa** dinner for two |
| \`OB-INT-0045\` | **secluded / private** setting for a proposal |

These are modifier and occasion refinements over an existing result set — an extension of the spoke's
filtering, not a second engine. Note that \`special-occasion\` is already an independent \`OCCASION\`
per the Stage 3 fixed decision and must not be modelled as a child of date-night.

## Constraint on implementation

Extending the spoke requires editing \`lib/\` and \`app/\` — outside the file scope authorised for this
run (\`docs/intent-os/\` and \`scripts/intent-os/\` only). See \`final-status.md\`.
`;
writeFileSync(paths.reuseGate, reuseReport, 'utf8');

// --- Stage 10b: product brief ----------------------------------------------
const brief = `# First Pilot Product Brief V1.0

**Winner:** \`${winner.canonical_intent_id}\` — ${winner.canonical_name}
**Backup:** ${backup ? `\`${backup.canonical_intent_id}\` — ${backup.canonical_name}` : 'none'}
**Reuse decision:** \`${reuseDecision}\`
**Generated:** ${nowIso()}

> **Status: specified, not implemented.** Implementation requires editing \`lib/\` and \`app/\`, which is
> outside this run's authorised file scope. This brief is the handoff.

## 1. One user job

Choose a romantic dinner in Ubud that fits the specific evening — quiet enough to talk, or with a
sunset view, or private enough to propose.

Not "browse date-night restaurants" (already served), but "narrow a qualifying set by the constraint
that actually decides it".

## 2. Required inputs (1–4)

1. District — defaults to the current spoke (Ubud).
2. Constraint — one of: \`quiet\` (no loud music), \`sunset view\`, \`secluded\`, \`special occasion\`.
3. *(optional)* Party size — couple or small group.

No free-text. Every input maps to an existing editorial field; none invents a new data requirement.

## 3. Complete free result

A ranked list of qualifying published Ubud venues with the existing editorial verdict
(\`why_its_here\`, \`best_for\`, \`not_for\`), no truncation, no signup, no paywall. Where the constraint
cannot be evidenced for a venue, that venue is **excluded rather than guessed** (guardrail 10).

Empty result is a valid, honest outcome and must say so plainly.

## 4. Portable outcome actions

Existing rails only: save, add-to-trip, share, directions (Google Maps handoff), and — in Canggu
only, per the existing \`actionMode\` gate — the full action set. No new action type.

## 5. Second job

After choosing dinner, the natural next job is assembling the rest of the evening — which is
\`add-to-trip\`, already implemented. The pilot ends by offering it.

## 6. Data selection method

Filter \`getIntentSpokes()\` output for \`district = ubud\`, \`jobSlug = ${winnerJob}\`, then narrow by
constraint against existing tags:

| Constraint | Source field | If absent |
|---|---|---|
| quiet | \`practical_tags\` / \`vibe_tags\` | exclude |
| sunset view | \`vibe_tags\` + \`sunset_drinks_view\` job | exclude |
| secluded | \`vibe_tags\` | exclude |
| special occasion | \`special_occasion\` job slug | exclude |

**No new column, table or migration.** If a constraint proves unsupported by existing tags, that
constraint ships disabled rather than approximated.

## 7. Privacy and storage

No PII. Identity stays with the existing httpOnly \`GuestRef\`. Nothing in \`localStorage\`. No new
storage of any kind.

## 8. Analytics without user-content payloads

Reuse the existing growth family: \`moment_started\`, \`shortlist_generated\`, \`venue_detail_view\`,
\`save\`, \`share\`, \`direction_click\`. Payload carries the constraint enum only — never free text,
never venue-level personal data. Analytics failure must never block an outbound action.

## 9. Empty / loading / error / offline states

- **Empty:** "No Ubud venue currently has verified evidence for this constraint." Offers to relax it.
- **Loading:** server-rendered; no hydration-dependent critical content.
- **Error:** falls back to the unfiltered spoke, which already works.
- **Offline:** PWA shell serves the last ISR-rendered spoke.

## 10. Accessibility

Constraint chips are real radio inputs with labels, ≥44 px targets, visible focus order, no
horizontal-scroll container hiding a required choice.

## 11. SEO shell

**\`index_new_page: false\`.** The constraint view is a filtered state of an existing canonical URL,
not a new indexable page. It must not create a second URL competing with \`/bali/ubud/date-night\` —
that is the cannibalization risk the SERP research flagged.

## 12. Feature flag

\`feature_flag_required: true\`. Ships behind a flag, default off. The unfiltered spoke is unaffected
when off.

## 13. Rollback

Disable the flag. No migration, no data change, no URL change — so rollback is instant and total.

## 14. Acceptance

- [ ] Constraint filter returns only venues with positive evidence for the constraint
- [ ] Venues lacking evidence are excluded, never inferred
- [ ] Empty state renders honestly
- [ ] No new URL is indexable
- [ ] Flag off restores exact current behaviour
- [ ] \`npm run lint\`, \`npm run typecheck\`, \`npm run build\` pass
- [ ] Analytics payload contains no free text or PII
`;
writeFileSync(paths.productBrief, brief, 'utf8');

const state = readState() ?? {};
state.state = 'PRODUCT_BRIEF';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'SELECT_PILOT', 'REUSE_GATE', 'PRODUCT_BRIEF'])];
state.winner = winner.canonical_intent_id;
state.backup = backup?.canonical_intent_id ?? null;
writeState(state);

appendDecision(`
## ${nowIso()} — SELECT_PILOT / REUSE_GATE

Winner \`${winner.canonical_intent_id}\` (${winner.total_score} >= ${WINNER_MIN_SCORE}), backup
\`${backup?.canonical_intent_id}\` (${backup?.total_score} >= ${BACKUP_MIN_SCORE}). Both READY.

Reuse decision **${reuseDecision}**. The winner is already served: \`/bali/ubud/date-night\` renders
today because Ubud has ${snapshot.find((r) => r.district === 'ubud' && r.job_slug === winnerJob)?.published_matching_venues}
published \`${winnerJob}\` venues against \`SPOKE_MIN_VENUES = ${SPOKE_MIN_VENUES}\`. A new tool would
duplicate a live engine, which Stage 9 forbids. \`HOLD\` was rejected because nothing is blocked.

The residual value is modifier/occasion refinement (quiet, sunset view, secluded, special occasion)
over the existing result set — an extension, not a second engine.
`);

appendEvent({
  stage: 'REUSE_GATE',
  status: 'PASS',
  inputs: [rel(paths.shortlist), rel(paths.serpScorecard)],
  outputs: [rel(paths.reuseGate), rel(paths.productBrief)],
  checks: [`winner=${winner.canonical_intent_id}`, `winner_score=${winner.total_score}`,
    `backup=${backup?.canonical_intent_id ?? 'none'}`, `qualifying_districts=${qualifying.length}`],
  decisions: [`reuse=${reuseDecision}`],
  next_state: 'PRODUCT_BRIEF',
});

console.log(`winner: ${winner.canonical_intent_id} (${winner.total_score})`);
console.log(`backup: ${backup?.canonical_intent_id} (${backup?.total_score})`);
console.log(`reuse decision: ${reuseDecision}`);
console.log(`qualifying districts for ${winnerJob}: ${qualifying.length}`);
