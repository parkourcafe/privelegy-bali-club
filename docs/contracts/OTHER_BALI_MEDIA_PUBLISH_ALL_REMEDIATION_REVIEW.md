# Other Bali — MEDIA-PUBLISH-ALL Remediation Review

Task: `MEDIA-PUBLISH-ALL-REMEDIATION-REVIEW`  
Phase: `READ_ONLY / DRY_RUN_ONLY`  
Recorded: 2026-07-25, Asia/Makassar  
Project: `egkdapqwkfprtyqvvnso`

## Verdict

The review is complete for planning purposes. No Supabase row, storage object,
bucket policy or production page was changed.

- The 91 legacy URLs are all `RECOVERY_QUEUE` items. They point to the old
  project `xvhxyohqkkpaynrgrvvb` and were inaccessible during the inventory
  run (HTTP 400/error). Their bytes and hashes cannot be truthfully inferred.
- No current target-bucket object has an exact filename prefix matching any of
  the 91 legacy slugs. Therefore no automatic replacement or hash claim is
  allowed.
- The three `lava-gastrobar-and-grill` objects are resolved by an explicit
  alias to venue `lava-gastrobar-grill` (`imp_lava-gastrobar-grill`). The
  current `venues.photo_url` already references the same three target objects.

## Legacy URL disposition

The row-level evidence remains in
`OTHER_BALI_MEDIA_PUBLISH_ALL_DRY_RUN.csv` (`migration_action=RECOVERY_QUEUE`).
The 91 rows have the following uniform disposition:

| Count | Current evidence | Disposition | Write-phase acceptance |
|---:|---|---|---|
| 91 | Legacy project URL inaccessible; no bytes/hash/dimensions available | Keep the logical venue association in remediation queue; recover from an authorized source or replace only with a separately validated authorized asset | No legacy URL remains as a production dependency; replacement has object/hash/dimensions/provenance and explicit mapping |

The recovery queue is not a rights rejection. `MEDIA-002` grants publication
permission for valid project-inventory media. It is a technical/source
availability blocker only. No row may be silently discarded.

Recommended recovery order for each row:

1. Search the current authorized inventory by venue identity and compare
   dimensions/visual identity when a candidate exists.
2. If a candidate is found, validate it as a new canonical media record; do
   not copy the legacy URL or invent a legacy hash.
3. If no candidate exists, request/recover the original bytes from the owner
   or source export and re-run MIME, decode, dimensions and SHA-256 checks.
4. If recovery fails, retain the row in remediation and render an explicit
   missing-media state; never make an unavailable URL public.

## Resolved slug mismatch

| Storage slug | Canonical venue slug | Venue id | Evidence | Decision |
|---|---|---|---|---|
| `lava-gastrobar-and-grill` | `lava-gastrobar-grill` | `imp_lava-gastrobar-grill` | Venue name `Lava Gastrobar & Grill`; `venues.photo_url` points to all three matching target objects | Accept as an explicit alias; no new venue row and no slug change |

The three affected objects are:

- `confirmed-official-2026-07-24/lava-gastrobar-and-grill--01--41c276092086de86.webp`
- `confirmed-official-2026-07-24/lava-gastrobar-and-grill--02--497664bc9fc1241e.jpg`
- `confirmed-official-2026-07-24/lava-gastrobar-and-grill--03--89b39d6269f702b4.webp`

The alias must be represented in the write-phase mapping manifest and must not
alter the public canonical venue URL.

## Canonical media registry strategy

**Confirmed recommendation: Option A — retain `owner-photo-candidates` as the
current publication storage source.** This minimizes copy and rollback risk:

- all 1,089 current objects are in the target project and passed technical
  validation;
- 328 current venue references already resolve to the target project;
- the registry remains the source of truth for entity mapping, hash,
  dimensions, provenance, rights, status, primary/gallery role and alt text;
- storage prefixes remain explicit (`owner-candidates` and
  `confirmed-official-2026-07-24`), with no assumption that a prefix itself is
  a rights gate;
- the existing 48 `venue_photos` rows are preserved and reconciled before any
  new backfill.

A dedicated bucket remains an optional later infrastructure task only if RLS,
intake isolation or lifecycle requirements demonstrate a need. It is not a
precondition for `MEDIA-PUBLISH-ALL` and must not be introduced during this
remediation review.

## Write-phase gate

`MEDIA-PUBLISH-ALL` write-phase remains **BLOCKED** until:

1. each of the 91 rows is either recovered and validated or explicitly closed
   as unresolved with owner-visible remediation status;
2. the `lava` alias is included in the approved mapping manifest;
3. the canonical registry backfill preserves the 48 existing rows and all
   logical duplicate associations;
4. primary/gallery selection and rollback checks are approved;
5. a pre-write and post-write object/hash/count parity report is generated.

This review does not authorize bucket visibility changes, URL replacement in
`venues.photo_url`, registry inserts, deletion, route changes or deployment.

