# Chope-607 Pipeline Mapping

Date: 2026-07-22
Scope: staged-candidates preparation only. No automatic publication.

## Input availability

The full 607-row Chope source file was not found in the repository or inspected Downloads paths during Wave 3. The available Chope artifact is `/Users/msnigmatullaeva/Downloads/insert_chope_candidates.sql`, a 12-row candidate insert draft. That SQL is not used as an importer because it writes directly to `venues`.

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
| Chope URL | source evidence / action candidate | Booking-provider evidence only after venue-endorsed verification | not publish-ready |
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
