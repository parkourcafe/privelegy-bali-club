# Chope-607 DB-Aware Dedup Report

Date: 2026-07-22
Mode: read-only. No production writes. No candidate publication.

## Executive result

A first DB-aware dedup pass was completed against the live production public venue API snapshot.

Confirmed counts from the public snapshot pass:

| Metric | Count |
|---|---:|
| Chope candidates processed | 607 |
| Production public venues compared | 93 |
| `matched` | 6 |
| `possible_match` | 1 |
| `new_candidate` against public snapshot | 600 |
| `publishable` | 0 |

Important limitation: this is not a final full-catalogue dedup verdict. The production database has 800 `venues` rows and 596 rows with `publication_status='published'`, while the public mobile API snapshot exposes 93 public venues. Therefore `new_candidate` here means “not found in the current public API snapshot”, not “safe to insert as new”.

## Matched / possible-match rows

| Candidate | Chope name | Bucket | Suggested action | Existing venue | Score | Evidence |
|---|---|---|---|---|---:|---|
| chope-607-081 | Boy'N'Cow | matched | update_existing | boyncow | 145 | name_slug_exact, name_exact, base_name_exact, district_match |
| chope-607-201 | Gong Restaurant (Kayumanis Sanur) | possible_match | create_branch | gong-restaurant | 55 | base_name_exact, district_match |
| chope-607-232 | Hujan Locale | matched | update_existing | hujan-locale | 200 | slug_exact, name_slug_exact, name_exact, base_name_exact, district_match |
| chope-607-281 | Kilo Kitchen Bali (Seminyak) | matched | update_existing | kilo-kitchen-bali-seminyak | 200 | slug_exact, name_slug_exact, name_exact, base_name_exact, district_match |
| chope-607-312 | Ling Ling's Bali | matched | update_existing | ling-lings-bali | 145 | name_slug_exact, name_exact, base_name_exact, district_match |
| chope-607-347 | Moonlite Kitchen and Bar | matched | update_existing | moonlite-kitchen-and-bar | 135 | slug_exact, name_slug_exact, base_name_contains, district_match |
| chope-607-606 | Zali (Uluwatu) | matched | update_existing | zali-uluwatu | 178 | slug_exact, name_slug_exact, name_exact, base_name_contains, district_family_match |

## Guardrails verified

- No production database writes were performed.
- No candidate is publishable: `publishable=0`.
- All rows remain `publication_status=draft`, `verification_status=verification_pending`, `editorial_status=editorial_pending`, `seo_status=hold`, `partner_status=not_contacted`, `photo_permission_status=not_granted`.
- Chope descriptions/photos/ratings/reviews remain excluded from public venue content.
- The result recommends `update_existing` only for high-confidence public matches and `create_branch` only for a possible branch collision.

## Artifacts

- `scripts/chope-607-classify-public-snapshot.mjs` — local classifier against the production public API snapshot.
- `data/data-ops/chope-607/production-public-venues-snapshot.json` — read-only public venue snapshot from `https://www.otherbali.com/api/mobile/v1/venues`.
- `data/data-ops/chope-607/db-aware-dedup-output-public.json` — full candidate-level public snapshot classification.
- `scripts/chope-607-db-aware-dedup.mjs` — generator for full private Supabase read-only SQL.
- `data/data-ops/chope-607/db-aware-dedup-input.json` — compact Chope candidate signals used by the SQL generator.
- `data/data-ops/chope-607/db-aware-dedup-readonly.sql` — SELECT-only SQL for a full private pass against `public.venues`.

## Required next private-pass step

Run `data/data-ops/chope-607/db-aware-dedup-readonly.sql` through a non-truncated Supabase SQL export path and save the returned JSON as:

`data/data-ops/chope-607/db-aware-dedup-output-private.json`

That private pass should classify against all 800 production `venues` rows, including review/inactive/draft rows not exposed by the public API.

Until that private pass exists, do not insert the 600 public-snapshot `new_candidate` rows. They remain `needs_private_dedup` operationally even if they are `new_candidate` against public pages.

## Recommended operational queue

| Queue | Rule | Action |
|---|---|---|
| update_existing_review | Public `matched` rows | Review whether Chope adds factual/action evidence to an existing card; do not auto-update public copy. |
| possible_branch_review | Public `possible_match` rows | Manually confirm branch identity / parent-child relationship. |
| needs_private_dedup | Public `new_candidate` rows | Run private 800-row Supabase dedup before any draft import. |
| rejected | Invalid, closed, duplicate, off-scope, or rights-problem rows | Exclude from import. |

## Production safety conclusion

The next safe technical move is a private read-only dedup export, not a production import. No Chope row is publish-ready.
