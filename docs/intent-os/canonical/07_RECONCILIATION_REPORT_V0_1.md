# External / Internal Reconciliation Report V0.1

**Generated:** 2026-07-29T18:35:16.410Z
**Generator:** other-bali-intent-os-autopilot
**Source version:** OB-INT-0001..0200@2026-07-29
**Repository baseline:** worktree `agent/intent-os-autopilot` from `2ebf74e`

## 1. Method

Every one of the 200 normalized external records was matched against the typed
internal model in `scripts/intent-os/internal-model.mjs`. Each internal concept is keyed to the
exact repository file it was observed in, so no internal concept is asserted without evidence.

Matching is alias containment, longest-alias-wins, with fixed decisions outranking observed keys.
The winning alias is recorded per row in `match_basis`, making every match reproducible.

## 2. Outcome

| Status | Count |
|---|---|
| MATCHED | 53 |
| PARTIAL | 47 |
| UNMATCHED_EXTERNAL | 100 |
| AUTO_HOLD | 0 |

Internal type distribution across matched records:

- `USER_JOB`: 29
- `DERIVED_COLLECTION`: 24
- `DAY_SCENARIO`: 12
- `EDITORIAL_PROJECTION`: 12
- `OCCASION`: 7
- `TIME_EVENT`: 6
- `TRIP_MISSION`: 5
- `TIME_MODIFIER`: 4
- `MOOD`: 1

## 3. Fixed decisions applied

The seven fixed decisions in Stage 3 of the master goal are encoded in the internal model and were
not re-derived:

| Concept | Type | Counterpart | Type |
|---|---|---|---|
| `work-session` | USER_JOB | `work-friendly` | VENUE_CAPABILITY |
| `family-outing` | USER_JOB | `family-easy` | VENUE_CAPABILITY |
| `local-food` | USER_JOB | `local-and-calm` | DERIVED_COLLECTION |
| `date-night` | USER_JOB | `romantic` | MOOD |
| `special-occasion` | OCCASION / USER_JOB | — | independent, not a child of date-night |
| `sunset` | TIME_EVENT | `golden-hour` | TIME_MODIFIER |
| save / share / add-to-trip / redeem | PRODUCT_ACTION | — | — |

Where an external record matched both a USER_JOB and its capability or derived collection, the job
was taken as the parent and the capability retained as a requirement. This is the fixed decision, so
it does not raise an `internal_external_conflict` AUTO_HOLD.

## 4. Hermes conflicts

The Hermes duplicate/conflict register flags three conflicts requiring an owner decision. All three
are resolved by fixed decisions already in the master goal, so none needs an owner question:

- **CONFLICT_001** (`date-night`) — date-night is USER_JOB; romantic is MOOD. Fixed decision 4.
- **CONFLICT_002** (`special-occasion`) — special-occasion is an independent OCCASION, not a child of date-night. Fixed decision 5.
- **CONFLICT_003** (`sunset`) — sunset is TIME_EVENT; golden-hour is TIME_MODIFIER and not a canonical parent. Fixed decision 6.

## 5. Findings carried forward

### 5.1 Stale internal evidence: `lib/scenarios.ts`

The Hermes runtime gap register records `DRIFT_004`: *"Trip missions reference scenario slugs but
lib/scenarios.ts is absent."* At this repository baseline the file **exists**
(confirmed present, 201 lines, four scenario slugs).

Master goal Stage 3 instructs inspection of "the live repository sources referenced there", so the
observed repository state is authoritative and `DRIFT_004` is treated as **stale internal evidence**,
not as a live conflict. It is not an `internal_external_conflict`, because the external candidate
set makes no claim about this file at all.

### 5.2 Summary-table discrepancy in the external inputs

Carried from INGEST: both external input files publish evidence-status totals that disagree with
their own per-record tables (declared 86/14 and 70/30; actual 96/4 and 61/39). Per-record values are
authoritative. No source record is affected.

### 5.3 Unmatched external candidates

100 records are UNMATCHED_EXTERNAL. Of these,
46 are HIGH_RISK_GUIDE records that intentionally
have no product-surface counterpart under `risk_policy`, and 54 are genuine
coverage gaps where the external set describes a job the internal model does not yet name.

Unmatched non-risk records are candidates for new canonical parents in Stage 4. They are **not**
evidence that the product should build them; Stage 6 data readiness and Stage 7 scoring decide that.

## 6. Gate

Reconciliation completed with 0 AUTO_HOLD records. Transition: `RECONCILE -> CANONICALIZE`.
