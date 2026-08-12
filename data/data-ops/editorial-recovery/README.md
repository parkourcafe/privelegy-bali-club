# editorial-recovery

Restarts the boilerplate-rewrite pass over the 1,272 active+published Place
Pages after the previous "Batch 01" applied **zero** rows. Root cause and the
full plan: **`RECOVERY_REPORT.md`**.

This directory produces a **queue and per-batch artifacts only**. It does not
write to production, and it does not enable a global SEO gate. Follows the
`otherbali-data-ops-run` playbook; batch SQL follows that skill's
`apply-TEMPLATE.sql` and the `otherbali-supabase-write` pre-flight.

## Layout

```
inputs/
  production-editorial-diagnostic-2026-08-12.csv   # 1,272 rows — DB diagnostic (source of truth)
  gsc-pages-export.csv                             # GSC "Pages" export — PENDING (see below)
build_queue.py                                     # joins the two, ranks on 5 signals
out/
  queue-editorial-interim.{csv,json}               # editorial-only interim (no GSC yet)
  queue-composite.{csv,json}                       # produced once GSC lands
batches/<N>/                                        # one dir per batch (created downstream)
RECOVERY_REPORT.md
```

## Run

```bash
# Interim (no GSC) — provisional, editorial + gate-proximity only:
python3 build_queue.py

# Full composite once the GSC Pages export is in place:
python3 build_queue.py --gsc inputs/gsc-pages-export.csv
```

## The GSC input (pending)

Export from **GSC → Search results → Pages** (last 3 months), Export → CSV.
Save it as `inputs/gsc-pages-export.csv`. Accepted header spellings:
`Top pages`/`Page`/`URL` · `Clicks` · `Impressions` · `Position`/`Average
position`. Only `/places/<slug>` rows are joined; everything else is ignored.

Until that file exists, the queue is **editorial-only interim** and must be
recomputed with GSC before any Batch membership is fixed — the playbook
prioritises by traffic, and two of the five ranking signals live in GSC.

## Ranking signals (transparent, in `build_queue.py`)

| Signal | Source | Role |
|---|---|---|
| impressions · clicks · position | GSC Pages export | proven search demand (striking-distance 5–15 bonus) |
| editorial blocker severity | diagnostic `queue` class | editorial debt on a live page |
| gate proximity | diagnostic `blockers_and_warnings` | fewer blockers left = quicker, higher-ROI win |

Weights: with GSC `demand 0.50 · editorial 0.30 · proximity 0.20`; interim
(no GSC) `editorial 0.60 · proximity 0.40`.
