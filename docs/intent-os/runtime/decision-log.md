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
