# Chope-607 Dry Run Report

Date: 2026-07-22
Environment: local repository dry run; no database writes; no publication.
Source file: `/Users/msnigmatullaeva/Downloads/chope_bali_venues_full.csv`
Command: `node scripts/chope-607-dry-run.mjs /Users/msnigmatullaeva/Downloads/chope_bali_venues_full.csv data/data-ops/chope-607/dry-run-output-full.json`

## Result

| Metric | Count |
|---|---:|
| CSV lines including header | 608 |
| Input venue rows processed | 607 |
| Insertable as draft | 607 |
| Publishable rows | 0 |
| `dedup_pending` rows | 607 |
| `draft` publication rows | 607 |
| `verification_pending` rows | 607 |
| `editorial_pending` rows | 607 |
| `seo_status=hold` rows | 607 |
| `partner_status=not_contacted` rows | 607 |
| `photo_permission_status=not_granted` rows | 607 |

## Candidate classification

This dry run intentionally does not claim final duplicate decisions. Every full-source row is kept in `dedup_pending` until it is compared against the live venue catalogue using the required signals:

- normalized name;
- slug;
- Google Place ID;
- coordinates;
- address;
- official website;
- Instagram;
- branch identity;
- parent/child venue relationship.

Allowed post-dedup outcomes remain: `create_new`, `update_existing`, `create_branch`, `attach_as_child`, `hold`, `reject`. The required operational rollup buckets for the next dedup pass are therefore not asserted yet as facts; they remain `matched / possible_match / new_candidate / rejected / needs_review` outputs for the next DB-aware dedup run.

## Guard proof

- Every row has `publication_status: draft`.
- Every row has `candidate_state: dedup_pending`.
- Every row has `verification_status: verification_pending`.
- Every row has `editorial_status: editorial_pending`.
- Every row has `seo_status: hold`.
- Every row has `partner_status: not_contacted`.
- Every row has `photo_permission_status: not_granted`.
- `publication_guard.can_publish` is false for every row.
- Chope ratings, review counts, descriptions and image URLs are recorded only as excluded-source metadata, not as publishable venue content.
- `chope_url` is retained as source evidence; it is not treated as an official website dedup signal.

## Dry-run output

Machine-readable full output is stored at:

- `data/data-ops/chope-607/dry-run-output-full.json`

The earlier controlled sample output remains at:

- `data/data-ops/chope-607/dry-run-output.json`

## What was not done

- No Chope row was inserted into production Supabase.
- No Chope row was published.
- No Chope description, image, rating or review count was imported as public content.
- The misleading 12-row SQL artifact was not applied.
