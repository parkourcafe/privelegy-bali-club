# Claude Code Master Goal — Other Bali Intent OS Autopilot V1

You are the sole orchestrator and primary executor for this workflow.

Do not ask the owner questions. Do not wait for manual approval. Apply the conservative defaults in `04_AUTONOMOUS_DECISION_POLICY.yaml`, log every material decision, and continue until a terminal state is reached.

## Governing inputs

Read all of these before acting:

```text
docs/intent-os/autopilot/inputs/external/OTHER_BALI_EXTERNAL_INTENTS_0001_0100.md
docs/intent-os/autopilot/inputs/external/OTHER_BALI_EXTERNAL_INTENTS_0101_0200.md
docs/intent-os/autopilot/inputs/internal/hermes/*
docs/intent-os/autopilot/inputs/governance/OTHER_BALI_INTENT_SINGLE_JOB_ARCHITECTURE_V2_0.md
docs/intent-os/autopilot/03_PIPELINE_STATE_MACHINE.yaml
docs/intent-os/autopilot/04_AUTONOMOUS_DECISION_POLICY.yaml
docs/intent-os/autopilot/05_ARTIFACT_CONTRACT.md
docs/intent-os/autopilot/08_SECURITY_AND_RELEASE_POLICY.md
```

## Non-negotiable rules

1. Preserve every original source ID `OB-INT-0001` through `OB-INT-0200` exactly once in the source ledger.
2. Never replace an original source meaning with a new meaning.
3. Do not invent evidence, URLs, dates, search volumes, internal data coverage or implementation status.
4. Separate:
   - canonical user job;
   - child scenario;
   - modifier;
   - supporting job;
   - venue capability;
   - editorial topic;
   - product action;
   - entity query;
   - high-risk guide;
   - reject.
5. External records are candidates, not the canonical source of truth.
6. Internal Hermes files are implementation evidence, not the sole product taxonomy.
7. A canonical intent may project to multiple product surfaces without creating duplicate canonical parents.
8. Do not generate mass SEO pages.
9. Do not modify production database state.
10. Use a dedicated branch or worktree. Keep all changes reviewable and reversible.

## Stage 0 — Bootstrap and durable state

Create:

```text
docs/intent-os/runtime/state.json
docs/intent-os/runtime/event-log.ndjson
docs/intent-os/runtime/decision-log.md
docs/intent-os/runtime/errors.ndjson
```

Initialize state to `INGEST` and record input file hashes.

Create deterministic validation scripts under:

```text
scripts/intent-os/
```

At minimum:

```text
validate_source_ledger
validate_csv_shapes
validate_unique_ids
validate_parent_links
validate_allowed_enums
validate_required_fields
validate_no_orphan_records
validate_surface_mapping
validate_data_readiness
validate_scorecard
validate_all
```

Choose the repository's existing language/tooling where practical. Do not add a large dependency stack for trivial validation.

## Stage 1 — Ingest exactly 200 source records

Create:

```text
docs/intent-os/canonical/01_SOURCE_RECORD_LEDGER_0001_0200.csv
```

Requirements:

- exactly 200 rows plus header;
- each source ID appears exactly once;
- preserve original name, source document, domain, original status/confidence and raw notes;
- parsing failures remain rows with `parse_status=ERROR`, never disappear.

Gate:

```text
source_record_count == 200
unique_source_record_count == 200
missing_ids == 0
extra_ids == 0
```

## Stage 2 — Normalize source records

Assign one normalized record type:

```text
CANONICAL_USER_JOB
CHILD_SCENARIO
MODIFIER
SUPPORTING_JOB
VENUE_CAPABILITY
EDITORIAL_TOPIC
PRODUCT_ACTION
ENTITY_QUERY
HIGH_RISK_GUIDE
REJECT
```

Create:

```text
docs/intent-os/canonical/02_NORMALIZED_SOURCE_RECORDS_V0_1.csv
docs/intent-os/canonical/03_ALIAS_AND_MODIFIER_REGISTER_V0_1.csv
docs/intent-os/canonical/04_SUPPORTING_JOB_REGISTER_V0_1.csv
docs/intent-os/canonical/05_HIGH_RISK_AND_REJECT_REGISTER_V0_1.csv
```

Do not force the output to contain 100 or 200 canonical parents.

## Stage 3 — Reconcile external and internal systems

Read all Hermes audit artifacts and inspect the live repository sources referenced there.

Create a typed internal model that distinguishes:

```text
USER_JOB
TRIP_MISSION
DAY_SCENARIO
VENUE_CAPABILITY
MOOD
OCCASION
TIME_EVENT
TIME_MODIFIER
DERIVED_COLLECTION
EDITORIAL_PROJECTION
SEO_ALIAS
PRODUCT_ACTION
```

Apply these fixed decisions:

- `work-session` = USER_JOB; `work-friendly` = VENUE_CAPABILITY.
- `family-outing` = USER_JOB; `family-easy` = VENUE_CAPABILITY.
- `local-food` = USER_JOB; `local-and-calm` = DERIVED_COLLECTION, not a canonical parent.
- `date-night` = USER_JOB; `romantic` = MOOD/VENUE_ATTRIBUTE.
- `special-occasion` = independent OCCASION/USER_JOB, not a child of date-night.
- `sunset` = TIME_EVENT; `golden-hour` = TIME_MODIFIER, not a canonical parent unless separate demand is proven.
- save/share/add-to-trip/redeem = PRODUCT_ACTION.

Create:

```text
docs/intent-os/canonical/06_EXTERNAL_INTERNAL_RECONCILIATION_V0_1.csv
docs/intent-os/canonical/07_RECONCILIATION_REPORT_V0_1.md
```

## Stage 4 — Build Canonical Intent Library V0.1

Create:

```text
docs/intent-os/canonical/08_CANONICAL_INTENT_LIBRARY_V0_1.csv
docs/intent-os/canonical/08_CANONICAL_INTENT_LIBRARY_V0_1.json
```

Each canonical record must contain:

```text
canonical_intent_id
canonical_name
user_job_statement
domain
source_record_ids
aliases
child_scenarios
allowed_modifiers
required_venue_capabilities
required_data_fields
publication_risk
demand_evidence_status
answer_evidence_requirement
internal_support_status
recommended_surfaces
single_job_candidate
data_readiness
lifecycle_status
auto_decision_reason
```

No canonical record may exist without at least one source record or a clearly marked internal-only product job.

## Stage 5 — Surface mapping

Create:

```text
docs/intent-os/canonical/09_INTENT_SURFACE_MAPPING_V0_1.csv
```

Allowed surfaces:

```text
PLAN
MY_DAY
PLACES_SEARCH
PLACES_FILTER
COLLECTION
SCENARIO_PAGE
DECISION_PAGE
INTERACTIVE_TOOL
ITINERARY_MODULE
PRODUCT_ONLY_NO_URL
NO_BUILD
```

Inspect and map all relevant keys from:

```text
lib/intents.ts
lib/moments.ts
lib/catalogue-moments.ts
lib/trip-missions.ts
lib/scenarios.ts
lib/collections.ts
lib/day-builder.ts
docs/seo/os/intent-registry.json
docs/seo/os/page-registry.json
```

Mapping must be exhaustive, not a sample.

## Stage 6 — Data readiness

Create:

```text
docs/intent-os/canonical/10_INTENT_DATA_READINESS_MATRIX_V0_1.csv
```

Allowed statuses:

```text
READY
READY_WITH_LIMITED_DISTRICTS
NEEDS_ENRICHMENT
BLOCKED_BY_DATA
HIGH_RISK_NOT_READY
```

Use repository and available read-only aggregate evidence only. Never infer row-level coverage that was not observed.

A single-job candidate is not READY unless the product can return a complete result using verified records.

## Stage 7 — Select 20–30 action-job candidates

Create:

```text
docs/intent-os/pilot/11_ACTION_JOB_SHORTLIST_V0_1.csv
```

Only include jobs that can complete in-browser without registration and produce a portable result.

Score each candidate using:

```text
intent_clarity: 20
browser_completion: 15
second_job_strength: 20
repeatability_or_history: 10
serp_opportunity: 10
unique_utility: 10
safety_compliance: 10
maintenance_cost: 5
```

## Stage 8 — Keyword and SERP validation

Use configured web/search/SEO tools if available. Prefer primary or direct sources.

Collect for shortlisted jobs:

```text
query variants
SERP intent
top URLs
interactive tools already ranking
content format
country/market where observable
seasonality where observable
zero-click risk
cannibalization risk
```

Do not invent search volume. If a verified volume source is unavailable, write `UNKNOWN`.

Create:

```text
docs/intent-os/pilot/12_KEYWORD_SERP_SCORECARD_V0_1.csv
docs/intent-os/pilot/13_SERP_RESEARCH_NOTES_V0_1.md
```

Winner rule:

```text
score >= 85
AND data_readiness in [READY, READY_WITH_LIMITED_DISTRICTS]
AND no critical risk blocker
AND reuse decision is feasible
```

If no candidate passes, set state `NO_BUILD` and produce a gap-remediation plan. Do not ask the owner.

## Stage 9 — Reuse gate

For the winner and backup inspect existing `/plan`, `/my-day`, search, collections and route engines.

Choose exactly one:

```text
EXTEND_EXISTING
NEW_ENTRY_SAME_ENGINE
NEW_TOOL
HOLD
```

Create:

```text
docs/intent-os/pilot/14_REUSE_GATE_REPORT_V0_1.md
```

Duplicating an existing planning engine is forbidden.

## Stage 10 — Product brief

If a winner exists, create:

```text
docs/intent-os/pilot/15_FIRST_PILOT_PRODUCT_BRIEF_V1_0.md
```

The brief must define:

- one user job;
- 1–4 required inputs;
- complete free result;
- portable outcome actions;
- second job;
- data selection method;
- privacy and storage;
- analytics without user-content payloads;
- empty/loading/error/offline states;
- accessibility;
- SEO shell;
- feature flag;
- rollback.

## Stage 11 — Implement autonomously

Implement the pilot in an isolated branch/worktree.

Constraints:

- no destructive migration;
- no new backend unless the brief proves it is essential;
- reuse existing engines and components;
- no signup before result;
- no fake data or placeholder recommendations;
- unverified records must not enter the result;
- add tests for deterministic selection and failure states;
- add content-free analytics events;
- add preview deployment configuration if the repository already supports it.

## Stage 12 — Quality and independent review

Run all existing and new checks:

```text
lint
typecheck
unit tests
integration tests
build
route/canonical collision checks
structured-data validation
mobile smoke test
accessibility smoke test
analytics payload inspection
```

If Codex CLI/SDK is available, invoke it as an independent reviewer using `06_CODEX_REVIEW_CONTRACT.md`. It must not rewrite taxonomy. It reviews the diff, tests, security, data correctness and scope.

If Codex is unavailable, use an isolated Claude review subagent with the same contract.

Fix all critical and high findings. Re-run validation.

## Stage 13 — Preview and handoff

Create or update:

```text
docs/intent-os/runtime/final-status.md
docs/intent-os/runtime/implementation-report.md
docs/intent-os/runtime/known-issues.md
docs/intent-os/runtime/next-automatic-actions.md
```

Open a PR if repository credentials permit.

Do not merge a failing PR. Do not silently publish high-risk or thin pages.

## Terminal states

The workflow must end in exactly one state:

```text
READY_FOR_PREVIEW
READY_FOR_PR
NO_BUILD
SAFE_HOLD
FAILED_GATE
```

## Final completion condition

Stop only when all of the following are true:

1. Source ledger contains exactly 200 unique source IDs.
2. All required canonical, reconciliation, surface and data-readiness artifacts exist and pass deterministic validation.
3. Either:
   - a winner and backup are selected, a product brief exists, the pilot is implemented, all required checks pass, and a preview/PR is ready; or
   - the state is `NO_BUILD`, `SAFE_HOLD` or `FAILED_GATE` with a complete machine-readable reason and remediation plan.
4. `scripts/intent-os/validate_all` exits successfully for the artifacts appropriate to the terminal state.
5. `docs/intent-os/runtime/final-status.md` accurately records the terminal state, evidence, checks, changed files and next automatic action.
