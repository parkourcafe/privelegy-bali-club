# Known Issues

## 1. External input summary tables contradict their own data — non-blocking

Both external input files publish evidence totals that disagree with their own per-record tables.

| File | Declared | Actual |
|---|---|---|
| `...0001_0100.md` | 86 STRONG + 14 MODERATE | 96 STRONG + 4 MODERATE |
| `...0101_0200.md` | 70 STRONG + 30 MODERATE | 61 STRONG + 39 MODERATE |

The second file's domain statistics aggregate into 10 coarse buckets while its rows carry 47
fine-grained domain strings.

**Resolution:** per-record values are authoritative; summary prose carries no `OB-INT-` ID and is not
covered by the source-preservation rules. No source record is affected. Recorded in
`errors.ndjson` as `SUMMARY_TABLE_MISMATCH`.

## 2. Stale internal evidence: `DRIFT_004` — non-blocking

The Hermes runtime gap register states `lib/scenarios.ts` is absent. At baseline `2ebf74e` the file
exists (201 lines, four scenario slugs). Stage 3 instructs inspection of live repository sources, so
the observed state is authoritative and the register entry is stale.

## 3. Classification rule blind spots — non-blocking

Auditing the first normalize run found four rule misfires, all fixed at the pattern level:

- `customs` matched Balinese religious/tipping customs as Indonesian border customs, wrongly
  promoting two editorial records to `LEGAL_REGULATORY` / `HIGH_RISK_GUIDE`;
- bare `blocked` matched a bank-card inconvenience as a `SAFETY` risk;
- a landmark name outranked the actual job ("Get a massage after Mount Batur" → entity lookup);
- `combine X with Y` read multi-activity planning as a supporting errand.

16 explicit per-record overrides remain in `classify-rules.mjs`, each with a stated reason. The long
tail has not been human-reviewed.

## 4. `git status` times out on the main checkout — out of scope

Full `git status` in `other-bali-clean-deploy-20260725-203955` exceeds 120s. Owner classified this
as separate repository hygiene. This task used scoped git commands only and made no ignore-rule or
directory changes.

## 5. Autopilot bundle now exists in two places — needs owner action

The bundle was installed to `docs/intent-os/autopilot/` from
`~/Documents/OTHER_BALI_INTENT_OS_ZERO_TOUCH_AUTOPILOT_2026-07-29/`. The original is retained as an
owner-requested backup until this branch is reviewed and merged.
