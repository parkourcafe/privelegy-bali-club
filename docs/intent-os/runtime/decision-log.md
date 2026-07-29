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
