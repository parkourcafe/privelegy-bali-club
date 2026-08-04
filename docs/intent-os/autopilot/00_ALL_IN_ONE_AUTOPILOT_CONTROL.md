# Other Bali Intent OS — Zero-Touch Autopilot

## Решение

Использовать **Claude Code как единственный оркестратор и основной исполнитель**.

- Claude Code нормализует данные, ведёт state machine, создаёт артефакты, проверяет их и реализует пилот.
- Codex подключается автоматически только как независимый reviewer, если Codex CLI/SDK доступен в окружении.
- Manus, GenSpark, Gemini и Hermes больше не принимают архитектурные решения. Их материалы используются только как входные данные.
- Владелец продукта не участвует в промежуточных согласованиях.

## Одно действие для запуска

1. Распаковать эту папку в корень репозитория Other Bali как:

```text
docs/intent-os/autopilot/
```

2. Из корня репозитория запустить Claude Code и передать ему файл:

```text
docs/intent-os/autopilot/02_CLAUDE_CODE_MASTER_GOAL.md
```

Или в non-interactive режиме:

```bash
claude -p "/goal Read docs/intent-os/autopilot/02_CLAUDE_CODE_MASTER_GOAL.md and execute it until its final completion condition is satisfied"
```

## Что будет сделано без участия владельца

1. Проверка входных файлов.
2. Нормализация OB-INT-0001–OB-INT-0200.
3. Создание Canonical Intent Library V0.1.
4. Сопоставление с внутренними слоями Hermes.
5. Surface mapping и data readiness.
6. Отбор 20–30 action jobs.
7. SERP/keyword validation доступными средствами.
8. Автоматический выбор winner/backup либо безопасный статус NO_BUILD.
9. Reuse audit текущих `/plan` и `/my-day`.
10. Product brief.
11. Реализация пилота в изолированной ветке/worktree.
12. Тесты, preview и PR.
13. Независимый review Codex, если доступен.
14. Финальный audit log и следующий автоматический статус.

## Политика отсутствия вопросов

Агент не должен задавать owner questions. При неопределённости он обязан применять консервативный default:

- нет evidence → `UNVERIFIED`;
- конфликт → `AUTO_HOLD`;
- нет данных → `BLOCKED_BY_DATA`;
- medical/legal/safety → `RESEARCH_ONLY`, без автопубликации;
- нет кандидата с проходным баллом → `NO_BUILD`;
- непроходимые тесты → `FAILED_GATE`, без merge/deploy.

Никаких бодрых догадок. Они и раньше прекрасно размножались без приглашения.
# Architecture Decision: Zero-Touch Intent OS Autopilot

**Decision ID:** OB-AUTO-001  
**Status:** APPROVED  
**Date:** 2026-07-29

## 1. Primary orchestrator

Claude Code owns the end-to-end workflow because this phase combines:

- long-form document analysis;
- CSV/JSON normalization;
- repository inspection;
- deterministic validators;
- product architecture;
- code implementation;
- tests and pull-request preparation.

## 2. Codex role

Codex is not a competing taxonomy owner. It is an optional independent specialist:

- code review;
- implementation audit;
- build fallback;
- second-opinion verification.

If Codex is unavailable, Claude Code must use an isolated review subagent and continue.

## 3. External agents

Manus, GenSpark, Gemini and Hermes do not create a new canonical library. Their artifacts are evidence inputs only.

## 4. Human involvement

No intermediate approval is required.

The system must never ask the owner to choose between ambiguous taxonomy options. It must use the policy defaults in `04_AUTONOMOUS_DECISION_POLICY.yaml`, record the decision and continue.

## 5. Production boundary

The pipeline may autonomously:

- edit documentation and machine-readable intent data;
- create validators and tests;
- create a feature branch/worktree;
- implement the selected pilot;
- deploy or generate a preview environment when repository tooling permits;
- open a pull request.

The pipeline must not autonomously:

- perform destructive database writes;
- apply irreversible migrations;
- expose secrets;
- publish medical/legal/safety guidance without authoritative answer evidence;
- auto-index thin or unverified pages;
- merge a failing PR.

When a forbidden action would be needed, the state becomes `SAFE_HOLD`, not `ASK_OWNER`.
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
version: 1
program: other-bali-intent-os-autopilot
initial_state: INGEST
states:
  - INGEST
  - NORMALIZE
  - RECONCILE
  - CANONICALIZE
  - MAP_SURFACES
  - DATA_READINESS
  - SHORTLIST
  - KEYWORD_SERP
  - SELECT_PILOT
  - REUSE_GATE
  - PRODUCT_BRIEF
  - IMPLEMENT
  - QA
  - INDEPENDENT_REVIEW
  - PREVIEW
  - READY_FOR_PR
  - READY_FOR_PREVIEW
  - NO_BUILD
  - SAFE_HOLD
  - FAILED_GATE
terminal_states:
  - READY_FOR_PR
  - READY_FOR_PREVIEW
  - NO_BUILD
  - SAFE_HOLD
  - FAILED_GATE
transitions:
  INGEST:
    pass: NORMALIZE
    fail: FAILED_GATE
  NORMALIZE:
    pass: RECONCILE
    fail: FAILED_GATE
  RECONCILE:
    pass: CANONICALIZE
    fail: SAFE_HOLD
  CANONICALIZE:
    pass: MAP_SURFACES
    fail: FAILED_GATE
  MAP_SURFACES:
    pass: DATA_READINESS
    fail: FAILED_GATE
  DATA_READINESS:
    pass: SHORTLIST
    no_ready_data: NO_BUILD
    fail: FAILED_GATE
  SHORTLIST:
    pass: KEYWORD_SERP
    empty: NO_BUILD
  KEYWORD_SERP:
    pass: SELECT_PILOT
    insufficient_external_data: SAFE_HOLD
    fail: FAILED_GATE
  SELECT_PILOT:
    winner: REUSE_GATE
    no_winner: NO_BUILD
  REUSE_GATE:
    feasible: PRODUCT_BRIEF
    hold: NO_BUILD
  PRODUCT_BRIEF:
    pass: IMPLEMENT
    fail: FAILED_GATE
  IMPLEMENT:
    pass: QA
    fail: FAILED_GATE
  QA:
    pass: INDEPENDENT_REVIEW
    fail: FAILED_GATE
  INDEPENDENT_REVIEW:
    pass: PREVIEW
    fail: FAILED_GATE
  PREVIEW:
    pr_ready: READY_FOR_PR
    preview_only: READY_FOR_PREVIEW
    fail: FAILED_GATE
version: 1
owner_questions_allowed: false
ambiguity_defaults:
  evidence_missing: UNVERIFIED
  evidence_conflict: AUTO_HOLD
  duplicate_uncertain: KEEP_SOURCE_RECORDS_SEPARATE_AND_FLAG
  internal_external_conflict: AUTO_HOLD
  unknown_search_volume: UNKNOWN
  missing_data: BLOCKED_BY_DATA
  high_risk_without_authority: HIGH_RISK_NOT_READY
  score_tie: SELECT_LOWER_RISK_THEN_HIGHER_DATA_READINESS_THEN_LOWER_MAINTENANCE
  no_candidate_over_threshold: NO_BUILD
  tool_unavailable: USE_ALLOWED_FALLBACK_OR_SAFE_HOLD
  codex_unavailable: USE_ISOLATED_CLAUDE_REVIEW_SUBAGENT
  deploy_permission_missing: READY_FOR_PR
forbidden_behaviors:
  - invent_evidence
  - invent_urls
  - invent_search_volume
  - rename_source_ids
  - drop_source_records
  - force_round_canonical_count
  - flatten_user_jobs_and_capabilities
  - create_mass_pages_before_pilot
  - destructive_database_write
  - publish_high_risk_without_authority
  - ask_owner_for_taxonomy_choice
risk_policy:
  LOW:
    auto_build_allowed: true
  OPERATIONAL:
    auto_build_allowed: true
    current_data_required: true
  SAFETY:
    auto_build_allowed: false
    publication_status: RESEARCH_ONLY
  MEDICAL:
    auto_build_allowed: false
    publication_status: RESEARCH_ONLY
  LEGAL_REGULATORY:
    auto_build_allowed: false
    publication_status: RESEARCH_ONLY
pilot_thresholds:
  winner_min_score: 85
  backup_min_score: 80
  allowed_data_readiness:
    - READY
    - READY_WITH_LIMITED_DISTRICTS
release_defaults:
  index_new_page: false
  feature_flag_required: true
  preview_required: true
  rollback_required: true
  auto_merge: false
# Artifact Contract

Every generated artifact must be deterministic, machine-readable where applicable, and traceable to source records.

## Required CSV rules

- UTF-8.
- Header present.
- RFC 4180-compatible quoting.
- Stable column order.
- No embedded unquoted commas.
- Empty unknown values represented as empty string or explicit enum, never invented text.
- Every output includes `created_at`, `generator`, `source_version` where practical.

## Required logs

Every stage appends one event to `event-log.ndjson`:

```json
{
  "timestamp": "ISO-8601",
  "stage": "NORMALIZE",
  "status": "PASS",
  "inputs": [],
  "outputs": [],
  "checks": [],
  "decisions": [],
  "errors": [],
  "next_state": "RECONCILE"
}
```

## Source traceability

Every canonical intent must trace to:

- one or more external `source_record_id`; or
- an internal product job with exact repository evidence.

## Quality score

Each major output receives:

- score out of 100;
- three most critical remaining defects;
- blocking/non-blocking classification;
- terminal recommendation.

Self-scoring alone is not acceptance. Deterministic validators must pass.
# Codex Independent Review Contract

Codex acts only as an independent reviewer of the completed branch/diff.

## Review scope

1. Source-record integrity.
2. Canonical/child/modifier parent-link integrity.
3. CSV/JSON validity.
4. Scope compliance with the approved product brief.
5. Reuse of existing `/plan` or `/my-day` engines.
6. Security and privacy.
7. Analytics payload safety.
8. Route, canonical and sitemap conflicts.
9. Tests, typecheck, lint and build.
10. Rollback and feature-flag behavior.

## Forbidden scope

Codex must not:

- invent or replace external evidence;
- redesign the taxonomy;
- create new canonical intents;
- expand the product scope;
- publish pages;
- merge the PR.

## Output

Create:

```text
docs/intent-os/runtime/codex-independent-review.md
```

Use severity:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

Any CRITICAL or HIGH finding blocks completion until fixed and re-reviewed.
# Run Commands

## Preferred: Claude Code non-interactive goal

From repository root:

```bash
claude -p "/goal Read docs/intent-os/autopilot/02_CLAUDE_CODE_MASTER_GOAL.md and execute it until its final completion condition is satisfied" \
  --output-format stream-json --verbose
```

Claude Code permissions must be configured to allow only the repository/file/test commands needed by the workflow. Do not bypass permission controls globally.

## Interactive fallback

```bash
claude
```

Then:

```text
/goal Read docs/intent-os/autopilot/02_CLAUDE_CODE_MASTER_GOAL.md and execute it until its final completion condition is satisfied
```

Use auto mode only after the repository trust and command allowlist are configured.

## Resume

```bash
claude --continue
```

The durable source of truth is the repository state, not the chat transcript.
# Security and Release Policy

## Allowed automatically

- read repository files;
- create/edit documentation and data artifacts;
- run tests, lint, typecheck and build;
- use isolated branch/worktree;
- create feature-flagged code;
- create preview deployment;
- open pull request;
- query approved read-only aggregate sources when credentials exist.

## Forbidden automatically

- production database writes;
- destructive migrations;
- changing access grants;
- exposing or logging secrets;
- sending personal user data to external models;
- storing user-content analytics;
- publishing medical/legal/safety claims without authoritative answer evidence;
- indexing thin, duplicate or unverified pages;
- auto-merging failing or high-risk changes.

## Safe-stop behavior

A forbidden requirement produces:

```text
SAFE_HOLD
```

The agent records the exact blocker and remediation. It does not ask the owner and does not improvise around the boundary.
