# Final Status

**Terminal state:** `BLOCKED_UNREACHABLE_ROUTE`
**Branch:** `agent/intent-os-autopilot`
**Winner:** `OB-CAN-0011` — Choose a romantic dinner in Ubud (score 95)
**Backup:** `OB-CAN-0007` — Find breakfast open before 7 AM (score 88)

> ## ⛔ Correction (2026-07-30): the reuse-gate premise was false
>
> Sections further down state that the winner is *"already served in production code"* and that
> *"seven districts qualify"*. **Both claims are wrong.** They are preserved below as the historical
> record of what the run concluded, not as current truth. Read this block first.
>
> `lib/data.ts` excludes eight districts from district hubs:
>
> ```js
> const HUB_EXCLUDE_DISTRICTS = new Set([
>   "uluwatu-bukit", "canggu", "sanur", "ubud",
>   "seminyak", "nusa-dua", "jimbaran", "nusa-islands"
> ]);
> ```
>
> `getIntentSpokes()` is built on `getDistrictHubs()`, which skips those districts. `/bali/ubud/date-night`
> therefore calls `notFound()` regardless of database contents. The line predates this work — it is
> present at baseline `2ebf74e` and on `main`.
>
> Cross-checked against this run's own snapshot (`../data-readiness/COVERAGE_SNAPSHOT_BY_DISTRICT_JOB.csv`),
> **every district holding `date_night_special` venues is on the exclusion list**: canggu (29),
> seminyak (14), uluwatu-bukit (13), ubud (9), nusa-dua (8), jimbaran (5), sanur (4).
>
> The districts that are *not* excluded fail the thresholds (`HUB_MIN_VENUES = 8`,
> `SPOKE_MIN_VENUES = 4`): kuta-legian has 98 published venues but only 1 per job slug; amed, lovina
> and munduk have 1, 3 and 1; sidemen, gili-islands and lombok have no rows.
>
> **No district produces any intent spoke.** The `/bali/[district]/[intent]` route yields zero pages.
> Ubud and Uluwatu are served by bespoke routes (`app/ubud/*`, `app/uluwatu/*`).
>
> **Root cause of the error:** Stage 10 scored raw district × job-slug coverage and never applied the
> hub exclusion. Data readiness was measured; route reachability was not. Any future reuse gate must
> assert that the surface it proposes to extend actually resolves.

## QA Status Summary

| Gate | Status | Result |
|---|---|---|
| Modifier unit tests | ✅ PASS | 15/15 |
| Local integration tests | ✅ PASS | 13/13 |
| Real-browser QA (Chromium, fixtures) | ✅ PASS | 28/28 — `e2e/browser-qa.mjs` |
| Production build | ✅ PASS | No regressions |
| Lint and typecheck | ✅ PASS | Zero violations |
| Feature flag OFF isolation | ✅ VERIFIED | Original markup restored |
| **Route reachability in production** | ❌ **FAIL** | **target route yields no page — see correction above** |
| Real Vercel preview QA | ⏸ BLOCKED | no isolated preview Supabase; SSO blocks automation |

The passing rows establish that the modifier logic is correct. They do not establish that a user can
reach a page where it runs.

**Why the QA missed it:** the fixture branch in `getIntentSpokes()` (gated on `NEXT_PUBLIC_TEST_MODE`)
returns spokes directly and does not call `getDistrictHubs()` — bypassing the exact check that holds
the exclusion. Every fixture-mode assertion therefore exercised an unreachable configuration. Future
QA for this feature must drive the real data path end to end.

## Disposition

The implementation is correct, tested, and inert behind `NEXT_PUBLIC_OB_DATE_NIGHT_MODIFIERS`
(default OFF). It ships no risk, and it also ships no value until its target surface exists.

Three options, all product decisions:

1. **Park it** until the surface is decided — recommended, and the current state.
2. **Move the refinement to a route that renders**, e.g. `/uluwatu/date-night-restaurants`. That page
   uses a different template with no `VenueCard` grid, so this is a rewrite rather than a port.
3. **Remove districts from `HUB_EXCLUDE_DISTRICTS`.** This would make the spoke live, but Ubud and
   Uluwatu already have bespoke pages — creating exactly the URL cannibalization this pilot's own
   SERP research flagged.

---

*Everything below this line is the original run record from 2026-07-29, retained unaltered. The
reuse-gate section it contains is superseded by the correction above.*

## Pipeline path

```
INGEST → NORMALIZE → RECONCILE → CANONICALIZE → MAP_SURFACES → DATA_READINESS
       → SHORTLIST → KEYWORD_SERP → SELECT_PILOT → REUSE_GATE → PRODUCT_BRIEF
       → [IMPLEMENT blocked] → SAFE_HOLD
```

Eleven of thirteen stages completed. The pipeline ran end to end on live data and produced a scored
winner, a resolved reuse decision and a complete product brief.

## Why SAFE_HOLD

Stage 11 (`IMPLEMENT`) requires editing `lib/` and `app/`. The authorised file scope for this run is
`docs/intent-os/` and `scripts/intent-os/` only.

`08_SECURITY_AND_RELEASE_POLICY.md` safe-stop: *"A forbidden requirement produces SAFE_HOLD. The
agent records the exact blocker and remediation. It does not ask the owner and does not improvise
around the boundary."*

Writing product code outside the permitted scope would be improvising around the boundary, so the run
stops with the brief as a complete handoff.

This is **not** a data or quality failure. Data is READY, the winner clears the threshold with room to
spare, and every validator passes.

## Live data changed the outcome

The prior run terminated `NO_BUILD` on repository-fixture evidence. The read-only live snapshot
overturned it:

| | Fixture evidence | Live snapshot |
|---|---|---|
| Venues observed | 53 | **1,122** |
| Published | 0 | 1,122 |
| Districts | 2 | **17** |
| Job-tagged cells | 0 | 81 (**64 READY**) |
| Pilot-eligible intents | 0 | **27** |

## Winner selection

| | Score | Readiness | Threshold |
|---|---|---|---|
| `OB-CAN-0011` Choose a romantic dinner in Ubud | **95** | READY | winner >= 85 ✅ |
| `OB-CAN-0007` Find breakfast open before 7 AM | **88** | READY | backup >= 80 ✅ |
| `OB-CAN-0018` Find laptop-friendly cafe | 84 | READY | below winner threshold |

SERP research was run live for these three. The other 23 shortlisted candidates carry
`serp_status=UNKNOWN` and scored 0 for `serp_opportunity` — unscored, not scored low. No search volume
is recorded anywhere: no verified volume source was available.

## Reuse gate: `EXTEND_EXISTING`

> ⛔ **SUPERSEDED — this section is factually wrong.** The spoke does not render for any district;
> `HUB_EXCLUDE_DISTRICTS` removes every district that has the data. See the correction at the top of
> this file. Retained verbatim as the run record.

The winner is **already served in production code**. `app/bali/[district]/[intent]/page.tsx` renders a
spoke wherever a district has at least `SPOKE_MIN_VENUES` (= 4) published venues carrying the intent's
`jobSlug`. Ubud has **9** published `date_night_special` venues; seven districts qualify in total.

`NEW_TOOL` was rejected because duplicating a live planning engine is forbidden. `HOLD` was rejected
because nothing is blocked. The residual value is modifier/occasion refinement — quiet, sunset view,
secluded, special occasion — over an existing result set.

## Checks

`node scripts/intent-os/validate_all.mjs` → exit 0. **10 passed, 0 skipped, 0 failed.**

Every validator now has a real artifact to check, including `validate_scorecard` (26 shortlist rows,
all factor scores within weight bounds, totals reconciled against their factors).

## Risk policy honoured

31 canonical intents remain `HIGH_RISK_NOT_READY` / `RESEARCH_ONLY` — every SAFETY, MEDICAL and
LEGAL_REGULATORY record. Live venue coverage did not and cannot move them; `risk_policy` sets
`auto_build_allowed: false` regardless of data. `validate_data_readiness` enforces this and passes.

## ID integrity

| | |
|---|---|
| Source records | 200 (200 unique), `OB-INT-0001`..`OB-INT-0200` |
| Canonical records | 157 (157 unique), `OB-CAN-0001`..`OB-CAN-0157` |
| Renumbered | no |

## Read-only compliance

The live snapshot used GET-only PostgREST requests with the anon key under RLS. The tool refuses any
JWT whose `role` claim is not `anon`.

| Constraint | Count |
|---|---|
| database records modified | 0 |
| migrations run | 0 |
| schema changes | 0 |
| grants changed | 0 |
| venues published | 0 |
| job tags written | 0 |

## Changed files

Confined to `docs/intent-os/` and `scripts/intent-os/`. No application code, no homepage-copy file,
nothing outside the two permitted trees.

## To resume

Implementation is fully specified in `docs/intent-os/pilot/15_FIRST_PILOT_PRODUCT_BRIEF_V1_0.md`,
including inputs, selection method, empty/error states, analytics payload shape, feature flag,
rollback and an acceptance checklist.

Authorise edits to `lib/` and `app/` and the run continues from `IMPLEMENT` through `QA`,
`INDEPENDENT_REVIEW` and `PREVIEW` to `READY_FOR_PR`. Policy already fixes the release posture:
`feature_flag_required: true`, `index_new_page: false`, `auto_merge: false`.
