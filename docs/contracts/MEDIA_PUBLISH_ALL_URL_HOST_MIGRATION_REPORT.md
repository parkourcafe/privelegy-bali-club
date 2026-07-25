# MEDIA-PUBLISH-ALL — URL Host Migration Report

Task: `MEDIA-PUBLISH-ALL-URL-HOST-MIGRATION`  
Phase: `WRITE_COMPLETE`  
Executed: 2026-07-25, Asia/Makassar  
Project: `egkdapqwkfprtyqvvnso`

## Result

The approved 91-row manifest was applied successfully. Only
`public.venues.photo_url` was updated: each previous-project URL was replaced
with the identical object path under the current project’s public
`venue-photos` bucket.

| Check | Result |
|---|---:|
| Rows attempted | 91 |
| Rows updated | 91 |
| Post-write target URL matches | 91 |
| Legacy URLs remaining in `venues.photo_url` | 0 |
| `venue_photo_submissions` rows after write | 101 |
| Storage objects changed | 0 |
| Bucket visibility changed | 0 |
| `photo_status` changed | 0 |
| `venue_photos` changed | 0 |

The original values and per-row rollback SQL are preserved in
`MEDIA_PUBLISH_ALL_CORRECTED_ROLLBACK_MANIFEST.csv`.

## Scope boundary

No schema, migration, route, UI, primary/gallery status, submission record,
storage object, bucket policy or production deployment was changed. A future
canonical `venue_photos` backfill remains a separate task for multi-image
status/provenance; it was not needed for this URL-host migration.

