# Chope-607 Pipeline Mapping

Date: 2026-07-22
Scope: staged-candidates preparation only. No automatic publication.

## Input availability

The full 607-row Chope source file is available at `/Users/msnigmatullaeva/Downloads/chope_bali_venues_full.csv` and was processed by the full local dry-run on 2026-07-22. The CSV is treated as an external source artifact and is not committed into the repository.

A separate downloaded 12-row artifact named like an approved import (`insert_chope_candidates.sql` / `approved_import_ready.csv` in prior handoff language) is intentionally not used as an importer because its candidates still require manual verification and direct `venues` inserts would bypass the staged-candidate gate.

## Source-to-candidate mapping

| Source field | Staged field | Rule | Publication implication |
|---|---|---|---|
| name | name, normalized_name, slug candidate | Normalize for dedup; slug is proposed only | never publish by itself |
| category | category | Map to existing `VenueCategory`; unknown becomes hold | never publish by itself |
| district/address | district, address dedup signal | Verify against Maps/official source | draft only |
| Google Place ID | dedup_signals.google_place_id | Strong dedup key when present | draft only |
| coordinates | dedup_signals.coordinates | Dedup/proximity check, not displayed until verified | draft only |
| official website | dedup_signals.official_url | HTTPS only; evidence source | draft only |
| Instagram | dedup_signals.instagram_url | HTTPS only; identity signal | draft only |
| Chope URL | source evidence / action candidate | Retain as Chope source evidence; do not treat as official website | not publish-ready |
| Chope description/photos/ratings | not imported | Excluded by product guardrail | forbidden |

## Candidate states

Allowed candidate state values:

- source_collected
- dedup_pending
- verification_pending
- editorial_pending
- venue_confirmation_pending
- import_ready
- publish_ready
- rejected
- hold

## Independent status axes

| Axis | Allowed initial value | Publish gate |
|---|---|---|
| publication_status | draft | must be `published` only after QA |
| verification_status | verification_pending | must be verified |
| editorial_status | editorial_pending | must pass editorial QA |
| seo_status | hold | must pass indexability/publication rule |
| partner_status | not_contacted | optional for draft, required for confirmed partner claims |
| photo_permission_status | not_granted | required before any photo publication |

## Dedup checks

Every candidate must be compared by:

- normalized name;
- slug;
- Google Place ID;
- coordinates;
- address;
- official website;
- Instagram;
- branch identity;
- parent/child venue relationship.

Allowed dedup actions: `create_new`, `update_existing`, `create_branch`, `attach_as_child`, `hold`, `reject`.

## Publication guard

`import_ready` means the row may be loaded as draft only.

`publish_ready` means factual verification, editorial QA, publication QA and SEO/indexability rules passed.

`photo_publish_ready` requires documented rights. A candidate may be import-ready without a photo.

No Chope-derived row may automatically set `status='active'` or `publication_status='published'`.


## Full dry-run status

The full 607-row dry-run output is `data/data-ops/chope-607/dry-run-output-full.json`. Result: 607 processed, 607 draft insertable, 0 publishable. All rows remain `dedup_pending`, `verification_pending`, `editorial_pending`, `seo_status=hold`, `partner_status=not_contacted`, and `photo_permission_status=not_granted`.

## Route/content boundary note

Chope venue candidates are separate from editorial route stops. Route resolution must support both published venue-backed stops via `venue_id` and standalone editorial `RouteStop` entries such as beaches, temples and viewpoints. Draft or unpublished venues must not render as public venue-backed route stops, but absence of a venue card must not delete a valid standalone editorial stop.
