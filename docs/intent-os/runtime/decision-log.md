# Intent OS Autopilot — Decision Log

Every material autonomous decision is appended here with its policy basis.
Policy source: `docs/intent-os/autopilot/04_AUTONOMOUS_DECISION_POLICY.yaml`.


## 2026-07-29T18:06:59.731Z — INGEST: summary-table vs row-data discrepancy

**Observation.** Both external input files carry summary statistics that disagree with their own
per-record tables.

| File | Declared | Actual (parsed rows) |
|---|---|---|
| `...0001_0100.md` | 86 EVIDENCE_STRONG + 14 EVIDENCE_MODERATE | 96 STRONG + 4 MODERATE |
| `...0101_0200.md` | 70 EVIDENCE_STRONG + 30 EVIDENCE_MODERATE | 61 STRONG + 39 MODERATE |

The second file's per-domain statistics block also aggregates into 10 coarse domains, while its
rows carry 47 distinct fine-grained domain strings.

**Decision.** Per-record values in the ID-bearing tables are treated as authoritative. The summary
blocks are human-written commentary, not source records: they carry no `OB-INT-` ID and therefore
are not covered by non-negotiable rule 1 or rule 2.

**Policy basis.** `evidence_conflict: AUTO_HOLD` applies to a conflict between evidence about a
*source record*. No source record is in conflict here — all 200 parsed cleanly with
`parse_status=OK`. Holding the pipeline on a prose-summary mismatch would block 200 intact records
for a defect in derived commentary.

**Consequence.** No AUTO_HOLD. Discrepancy recorded in `errors.ndjson` as a data-quality finding
and carried into the Stage 3 reconciliation report. Domain normalization in Stage 2 must use the
row-level domain strings, never the summary buckets.

## 2026-07-29T18:23:04.101Z — NORMALIZE: type assignment

Assigned exactly one normalized record type to all 200 source records using an
ordered rule table (`scripts/intent-os/classify-rules.mjs`). First match wins; the winning rule id
is stored per row in `decision_rule`, so every assignment is traceable and reproducible.

Type distribution: CANONICAL_USER_JOB=76, HIGH_RISK_GUIDE=49, CHILD_SCENARIO=24, EDITORIAL_TOPIC=21, ENTITY_QUERY=20, SUPPORTING_JOB=10

Risk distribution: LOW=126, OPERATIONAL=25, SAFETY=22, MEDICAL=16, LEGAL_REGULATORY=11

Risk classification is evaluated before type, and MEDICAL / LEGAL_REGULATORY / SAFETY records become
`HIGH_RISK_GUIDE` regardless of how the text is phrased. Policy basis: `risk_policy` in
`04_AUTONOMOUS_DECISION_POLICY.yaml` sets `auto_build_allowed: false` and
`publication_status: RESEARCH_ONLY` for those three classes. This is why a record such as
"Find medical clinic / hospital in emergency" is not treated as an ordinary venue-selection job.

13 explicit per-record overrides were applied where the rule table misfired:
OB-INT-0031, OB-INT-0033, OB-INT-0047, OB-INT-0063, OB-INT-0064, OB-INT-0065, OB-INT-0066, OB-INT-0068, OB-INT-0069, OB-INT-0070, OB-INT-0144, OB-INT-0146, OB-INT-0165. Each carries a reason in `classify-rules.mjs`.

No target distribution was imposed: Stage 2 explicitly forbids forcing 100 or 200 canonical parents.

## 2026-07-29T18:30:44.189Z — NORMALIZE: type assignment

Assigned exactly one normalized record type to all 200 source records using an
ordered rule table (`scripts/intent-os/classify-rules.mjs`). First match wins; the winning rule id
is stored per row in `decision_rule`, so every assignment is traceable and reproducible.

Type distribution: CANONICAL_USER_JOB=77, HIGH_RISK_GUIDE=46, CHILD_SCENARIO=25, EDITORIAL_TOPIC=23, ENTITY_QUERY=19, SUPPORTING_JOB=10

Risk distribution: LOW=128, OPERATIONAL=26, SAFETY=21, MEDICAL=16, LEGAL_REGULATORY=9

Risk classification is evaluated before type, and MEDICAL / LEGAL_REGULATORY / SAFETY records become
`HIGH_RISK_GUIDE` regardless of how the text is phrased. Policy basis: `risk_policy` in
`04_AUTONOMOUS_DECISION_POLICY.yaml` sets `auto_build_allowed: false` and
`publication_status: RESEARCH_ONLY` for those three classes. This is why a record such as
"Find medical clinic / hospital in emergency" is not treated as an ordinary venue-selection job.

16 explicit per-record overrides were applied where the rule table misfired:
OB-INT-0031, OB-INT-0033, OB-INT-0047, OB-INT-0055, OB-INT-0063, OB-INT-0064, OB-INT-0065, OB-INT-0066, OB-INT-0068, OB-INT-0069, OB-INT-0070, OB-INT-0106, OB-INT-0144, OB-INT-0146, OB-INT-0165, OB-INT-0167. Each carries a reason in `classify-rules.mjs`.

No target distribution was imposed: Stage 2 explicitly forbids forcing 100 or 200 canonical parents.

## 2026-07-29T18:35:16.413Z — RECONCILE: external vs internal

Matched 200 external records against 44 typed internal concepts.
Result: MATCHED=53, PARTIAL=47, UNMATCHED_EXTERNAL=100, AUTO_HOLD=0.

Job/capability collisions were resolved by the master goal's fixed decisions rather than by
AUTO_HOLD, because the policy's `internal_external_conflict` default applies to unresolved
conflicts, and these are resolved by specification.

Hermes `DRIFT_004` claims `lib/scenarios.ts` is absent; the file exists at this baseline. Observed
repository state is authoritative per Stage 3. Recorded as stale internal evidence.

## 2026-07-29T18:37:45.651Z — CANONICALIZE: library V0.1

Built 157 canonical records from 200 source records. Every source record
is cited by exactly one canonical record (0 uncited). CHILD_SCENARIO records fold into
their parent as `child_scenarios`/`aliases` rather than becoming separate parents.

No round-number target was imposed; the count follows from the parent/child structure.

Readiness: BLOCKED_BY_DATA=104, HIGH_RISK_NOT_READY=31, NEEDS_ENRICHMENT=22
Lifecycle: ACTIVE=126, RESEARCH_ONLY=31

## 2026-07-29T18:38:44.125Z — MAP_SURFACES: exhaustive projection

Mapped all 157 canonical intents to surfaces (one row per intent, exhaustive as required).
Inspected: lib/intents.ts, lib/moments.ts, lib/catalogue-moments.ts, lib/trip-missions.ts, lib/scenarios.ts, lib/collections.ts, lib/day-builder.ts, docs/seo/os/intent-registry.json, docs/seo/os/page-registry.json.

Surface distribution: PLACES_FILTER=77, NO_BUILD=31, DECISION_PAGE=22, PLACES_SEARCH=18, PRODUCT_ONLY_NO_URL=9

53 intents map onto a runtime key that already exists; the rest would need a new projection.
Intents at HIGH_RISK_NOT_READY are forced to NO_BUILD regardless of their recommended surface.

## 2026-07-29T18:38:44.162Z — DATA_READINESS: no_ready_data -> NO_BUILD

Readiness across 157 canonical intents: BLOCKED_BY_DATA=104, HIGH_RISK_NOT_READY=31, NEEDS_ENRICHMENT=22.

Intents at a readiness allowed for a pilot (READY or READY_WITH_LIMITED_DISTRICTS): **0**.

### Observed evidence

fixture total=53;published=0;with_jobs=0;districts=nusa-dua|tanjung-benoa;supabase_configured=false

Venue selection reads from Supabase table "venues" via lib/data.ts. `.env.local` is
absent, so a live read is
not possible. The only venue records observable in
the repository are the 53 rows in `data/resort-import/venues.json`, of which 0 are
published and 0 carry `jobs` tags.

Stage 6 states: "Never infer row-level coverage that was not observed" and "A single-job candidate is
not READY unless the product can return a complete result using verified records." With no observable
published, job-tagged venue, no venue-dependent intent can be shown to return a complete result.
Marking any of them READY would be inventing coverage.

**Transition taken:** `DATA_READINESS -> NO_BUILD` per 03_PIPELINE_STATE_MACHINE.yaml.
