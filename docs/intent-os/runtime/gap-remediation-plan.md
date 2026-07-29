# Gap Remediation Plan — NO_BUILD

**Generated:** 2026-07-29T18:40:43.727Z
**Terminal state:** `NO_BUILD`
**Machine-readable reason:** `docs/intent-os/runtime/no-build-reason.json`

## 1. Why the pipeline stopped

The pipeline completed ingest, normalization, reconciliation, canonicalization, surface mapping and
data readiness. It stopped at the `DATA_READINESS` state via the `no_ready_data` edge because
**zero of 157 canonical intents** reached a readiness allowed for a pilot
(`READY` or `READY_WITH_LIMITED_DISTRICTS`).

| Readiness | Intents |
|---|---|
| `BLOCKED_BY_DATA` | 104 |
| `HIGH_RISK_NOT_READY` | 31 |
| `NEEDS_ENRICHMENT` | 22 |

This is a data-availability outcome, not a taxonomy failure. The canonical library is complete and
validated; there is simply nothing observable to answer the jobs with.

## 2. The single blocking fact

Venue selection reads from **Supabase table "venues" via lib/data.ts**.

- `.env.local` is **absent** → live Supabase read **not possible**.
- The only venue records observable in the repository are **53** rows in
  `data/resort-import/venues.json`.
- Of those: **0 published**, **0 carry `jobs` tags**, covering districts
  `nusa-dua`, `tanjung-benoa`.

Selection in `lib/intents.ts` keys off `jobs` slugs (`date_night_special`, `quiet_work_cafe`,
`sunset_drinks_view`, …). With zero observable job-tagged published venues, no venue-dependent
intent can be shown to return a complete result.

Marking any of them `READY` would require inferring coverage that was not observed — forbidden by
Stage 6 and by `forbidden_behaviors: invent_evidence`.

## 3. What unblocks it

Exactly one condition gates the entire venue-dependent branch (104 intents):

> **observable published venues carrying `jobs` tags**

Any one of these satisfies it:

1. **Configure read-only Supabase access** in the run environment, so the pipeline can observe live
   aggregate counts per district and job slug. Read-only aggregate queries are explicitly allowed by
   `08_SECURITY_AND_RELEASE_POLICY.md`.
2. **Commit a coverage snapshot** — an aggregate, non-PII count of published venues per
   `(district, job_slug)` — into the repository as observable evidence.
3. **Publish and job-tag venues** in the existing fixture pipeline so repository evidence alone
   supports selection.

Option 1 or 2 requires no product change and is the fastest path.

## 4. Independent secondary gaps

These do not block the pilot branch but bound what could ever be built:

- **31 intents are `HIGH_RISK_NOT_READY`** (SAFETY / MEDICAL /
  LEGAL_REGULATORY). These are *permanently* not auto-buildable under `risk_policy`
  (`auto_build_allowed: false`, `publication_status: RESEARCH_ONLY`). They need explicit owner
  authority plus authoritative answer evidence. No amount of venue data changes this.
- **22 intents are `NEEDS_ENRICHMENT`** — editorial topics needing a
  sourced record with `verified_at`.

## 5. Unblock priority

Once the blocking fact is resolved, these single-job candidates would be re-evaluated first. Ordering
uses source breadth, evidence strength and whether an existing runtime key can be reused.

**This is not the Stage 7 scorecard and selects no winner.** Stage 7 never ran; `serp_opportunity`
was never measured and remains `UNKNOWN`. No candidate here has been scored against the
`>= 85` winner threshold.

| # | Canonical ID | Intent | Sources | Strong | Reuses engine | Internal support |
|---|---|---|---|---|---|---|
| 1 | `OB-CAN-0025` | Find what to do in Bali on a rainy day | 5 | 5 | yes | MATCHED |
| 2 | `OB-CAN-0007` | Find breakfast open before 7 AM | 4 | 4 | yes | MATCHED |
| 3 | `OB-CAN-0011` | Choose a romantic dinner in Ubud | 3 | 3 | yes | PARTIAL |
| 4 | `OB-CAN-0056` | Find vegan restaurants in Ubud | 3 | 3 | yes | PARTIAL |
| 5 | `OB-CAN-0012` | Choose a special-occasion / birthday dinner | 2 | 2 | yes | MATCHED |
| 6 | `OB-CAN-0019` | Buy a coworking day pass (drop-in, no membership) | 2 | 2 | yes | PARTIAL |
| 7 | `OB-CAN-0024` | Watch sunrise at Sanur beach walk | 2 | 2 | yes | PARTIAL |
| 8 | `OB-CAN-0026` | Find family cafe / restaurant with kids' play area | 3 | 3 | no | MATCHED |
| 9 | `OB-CAN-0031` | Find a private / secluded spot to propose | 2 | 2 | yes | MATCHED |
| 10 | `OB-CAN-0043` | Learn to surf as a beginner (safe waves) | 2 | 2 | yes | MATCHED |
| 11 | `OB-CAN-0132` | Book yoga and meditation retreat in Bali | 4 | 2 | no | PARTIAL |
| 12 | `OB-CAN-0039` | Find affordable clean 1-hour massage anywhere | 2 | 2 | yes | PARTIAL |
| 13 | `OB-CAN-0015` | Eat after midnight in Canggu | 3 | 2 | no | PARTIAL |
| 14 | `OB-CAN-0023` | Do Mount Batur sunrise trek | 1 | 1 | yes | PARTIAL |
| 15 | `OB-CAN-0001` | Find where to go on arrival day when jet-lagged | 1 | 1 | yes | MATCHED |
| 16 | `OB-CAN-0004` | Sleep near airport before/after red-eye flight | 1 | 1 | yes | MATCHED |
| 17 | `OB-CAN-0005` | Kill 3–6 hours near airport before flight | 1 | 1 | yes | MATCHED |
| 18 | `OB-CAN-0008` | Grab a quick, cheap lunch mid-day between activities | 1 | 1 | yes | PARTIAL |
| 19 | `OB-CAN-0010` | Order food to villa via Grab/Gojek when tired | 1 | 1 | yes | MATCHED |
| 20 | `OB-CAN-0014` | Find a fine-dining tasting-menu experience | 1 | 1 | yes | MATCHED |
| 21 | `OB-CAN-0016` | Find a really good specialty coffee shop | 2 | 2 | no | UNMATCHED_EXTERNAL |
| 22 | `OB-CAN-0017` | Find quiet cafe suitable for Zoom / video calls | 1 | 1 | yes | MATCHED |
| 23 | `OB-CAN-0018` | Find laptop-friendly cafe with power outlets and fast Wi-Fi | 1 | 1 | yes | MATCHED |
| 24 | `OB-CAN-0020` | Choose a sunset dinner in Uluwatu | 1 | 1 | yes | PARTIAL |
| 25 | `OB-CAN-0021` | Find a quiet sunset spot away from big beach clubs | 1 | 1 | yes | PARTIAL |

## 6. Re-run

The pipeline is idempotent and re-runnable in place:

```bash
node scripts/intent-os/bootstrap.mjs && node scripts/intent-os/ingest.mjs && node scripts/intent-os/normalize.mjs && node scripts/intent-os/reconcile.mjs && node scripts/intent-os/canonicalize.mjs && node scripts/intent-os/map-surfaces.mjs && node scripts/intent-os/data-readiness.mjs
node scripts/intent-os/validate_all.mjs
```

Source IDs `OB-INT-0001`..`OB-INT-0200` are preserved verbatim in the ledger across re-runs, so a
re-run reclassifies without renumbering.
