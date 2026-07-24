# MEDIA-PUBLISH-ALL — Dry-run Report

Task: `MEDIA-PUBLISH-ALL`  
Phase: `DRY_RUN_ONLY`  
Recorded: 2026-07-25, Asia/Makassar  
Supabase project: `egkdapqwkfprtyqvvnso`  
Bucket: `owner-photo-candidates`  
Rights grant: `MEDIA-002`

## Dry-run result

The manifest `OTHER_BALI_MEDIA_PUBLISH_ALL_DRY_RUN.csv` contains 1,180 rows and was generated from a recursive service-read inventory plus local byte validation. No row, object or bucket policy was changed.

| Action | Rows | Meaning |
|---|---:|---|
| `READY_FOR_MAPPING` | 906 | valid bytes and a matched venue; target registry record not created |
| `CANONICALIZE_DUPLICATE_PRESERVE_ASSOCIATIONS` | 180 | exact hash duplicate; preserve every logical association |
| `RECOVERY_QUEUE` | 91 | legacy external-project URL unavailable; no silent discard |
| `REMEDIATE_MAPPING` | 3 | `lava-gastrobar-and-grill` needs review against `lava-gastrobar-grill` |
| total | 1,180 | 1,089 storage objects + 91 legacy URL references |

All 1,089 storage objects passed MIME, decode, non-empty, dimension and SHA-256 validation. The snapshot contained 988 unique hashes and 79 duplicate groups (180 assets). Existing `venue_photos` has 48 rows and is preserved as AS-IS target-registry evidence; no new rows were created.

## Required dry-run fields

The CSV includes storage bucket/path, source project, object existence, hash, MIME, byte size, width, height, inferred and matched venue, media scope, duplicate group, rights basis/reference, current DB reference, target record placeholder, primary candidate, migration action, blocker and remediation action.

## Write gate

`DRY_RUN_COMPLETE: YES`  
`WRITE_EXECUTED: NO`  
`BUCKET_VISIBILITY_CHANGED: NO`  
`VENUE_PHOTO_URLS_CHANGED: NO`  
`VENUE_PHOTOS_ROWS_CHANGED: NO`

Before a later write phase, owner/data review must resolve the legacy recovery queue and slug mapping, confirm primary/gallery policy, preserve existing 48 registry rows, and approve a reversible backfill. No image may be silently deleted or dropped from logical associations.
