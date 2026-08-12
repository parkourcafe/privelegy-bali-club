# Batch canggu-boilerplate-01

First batch of the editorial-recovery restart. Rewrites boilerplate
`why_its_here` / `best_for` on live Canggu Place Pages with facts collected from
each venue's **own** official sources. Selected from the editorial-only interim
queue (`../../out/queue-editorial-interim.csv`), class `P1_REWRITE_BOILERPLATE`,
Canggu first (public pages) — see `../../RECOVERY_REPORT.md` §5–6.

> **Interim selection.** GSC was not supplied, so membership was ranked on
> editorial debt + gate proximity only (owner chose to proceed without GSC).
> When a GSC export lands, the composite may reorder later batches; this batch
> is already fact-checked and stands on its own.

## Candidate pool (12) — before acceptance

The 12 live boilerplate venues are in `exact-old-snapshot.csv` (pulled read-only
from prod `bali-privilege` on 2026-08-12). Typical old copy:

- `why_its_here`: address-only — *"Restaurant on Jl. … in Canggu, open daily …"*
- `best_for`: generic — *"Travellers looking for a current place to eat in Canggu"*
  or the Chope line *"…check availability and reserve a table through Chope."*

## Process (otherbali-data-ops-run + otherbali-venue-record-standard)

1. **Collect** facts per venue from official site / IG / own menu only. No
   Google reviews/ratings (guardrail #2), no aggregators, no booking engines.
2. **Accept row by row** — the collector's `ready` is not evidence. Each row is
   checked against: is the source the venue's own page? is the copy rung 1/2
   (never rung 3 invention)? is `not_for` fit-context, not a quality complaint?
   Rejects go to the rejected block **with reasons**, not silently dropped.
3. **Generate SQL** — `preflight.sql` (dry-run one row, rolled back),
   `apply.sql`, `rollback.sql`. Applied by the **founder**, not from this
   session (venue-record-standard §5). Nothing here is applied to prod.

## Guard design (the fix for the zero-update Batch 01)

The old batch guarded on texts **+ price_anchor + last_verified_at** and matched
zero rows once any of those drifted. This batch guards each UPDATE **only on the
single field it rewrites**, still equal to its exact-old boilerplate value:

```sql
update venues set why_its_here = :new
where slug = :slug and status='active' and publication_status='published'
  and why_its_here = :exact_old_boilerplate;   -- no-clobber; skips if drifted
```

`last_verified_at` and `price_anchor` are **not** part of the guard and are
**not** written (editorial rewrite over public copy is not a re-verification
visit; bumping `last_verified_at` would churn sitemap lastmod). `price_anchor`
is set only where an official menu price was actually seen, as a separate,
clearly-sourced line.

## Files

| File | State |
|---|---|
| `exact-old-snapshot.csv` / `.json` | ✅ done (read-only prod pull) |
| `source-ledger.csv` | after acceptance — one row per venue incl. not_found |
| `editorial-changes.csv` | after acceptance — accepted new field values |
| `preflight.sql` · `apply.sql` · `rollback.sql` | after acceptance |
| `qa-report.md` | after acceptance — counts, rejects w/ reasons, expected UPDATE count |
