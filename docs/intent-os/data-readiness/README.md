# Live Coverage Snapshot

Committed evidence of venue coverage by `(district, job_slug)`. When present and valid, this
snapshot **takes precedence** over the repository fixture in `scripts/intent-os/readiness-model.mjs`.

## Files

| File | Purpose |
|---|---|
| `COVERAGE_SNAPSHOT_BY_DISTRICT_JOB.csv` | one row per `(district, job_slug)` cell |
| `SNAPSHOT_STATUS.json` | machine-readable provenance and outcome of the last attempt |

## Producing it

```bash
NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  node scripts/intent-os/coverage-snapshot.mjs
```

Exit `0` snapshot written · `2` credentials absent or query failed.

### Read-only guarantees

The tool cannot mutate the database:

- every request is an HTTP **GET** against PostgREST; no `POST`/`PATCH`/`PUT`/`DELETE` and no `/rpc/`
  call appears anywhere in the file;
- it **refuses to run** with a non-`anon` key — it decodes the JWT `role` claim and exits if the role
  is anything other than `anon`, so a service-role key cannot be used even by accident;
- reads are therefore additionally constrained server-side by RLS;
- it writes only into this directory.

Use the **anon** key. Never the service-role key.

## Schema

| Column | Meaning |
|---|---|
| `district` | venue district; `(none)` when null |
| `job_slug` | job tag, normalized to snake_case (`normalizeJobs()` parity); `(untagged)` when the venue carries no jobs |
| `total_matching_venues` | venues in this cell, any publication status |
| `published_matching_venues` | subset with `publication_status = 'published'` |
| `verified_matching_venues` | subset both published **and** carrying `last_verified_at` |
| `last_verified_at_coverage_pct` | share of the cell carrying `last_verified_at` |
| `required_field_coverage_pct` | share carrying all of `slug`, `name`, `district`, `jobs`, `publication_status` |
| `readiness_verdict` | `READY` · `NEEDS_ENRICHMENT` · `BLOCKED_BY_DATA` |

A venue tagged with N jobs contributes to N cells; cell totals therefore exceed the venue count.

## Verdict rules

| Condition | Verdict |
|---|---|
| `job_slug = '(untagged)'` | `BLOCKED_BY_DATA` |
| `published_matching_venues = 0` | `BLOCKED_BY_DATA` |
| `verified_matching_venues = 0` | `NEEDS_ENRICHMENT` |
| `required_field_coverage_pct < 100` | `NEEDS_ENRICHMENT` |
| otherwise | `READY` |

## Effect on the pipeline

`data-readiness.mjs` consumes the snapshot automatically when `SNAPSHOT_STATUS.json` reports `OK`:

- **0 READY cells** → all venue-dependent intents `BLOCKED_BY_DATA` → `NO_BUILD`
- **READY cells in fewer than 5 districts** → `READY_WITH_LIMITED_DISTRICTS` → pipeline continues to `SHORTLIST`
- **READY cells in 5+ districts** → `READY` → pipeline continues to `SHORTLIST`

High-risk intents are unaffected: `SAFETY`/`MEDICAL`/`LEGAL_REGULATORY` stay `HIGH_RISK_NOT_READY`
under `risk_policy` no matter how good the venue coverage is.
