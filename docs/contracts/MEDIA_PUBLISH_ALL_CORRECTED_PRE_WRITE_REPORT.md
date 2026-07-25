# MEDIA-PUBLISH-ALL — Corrected Pre-write Dry-run

Task: `MEDIA-PUBLISH-ALL`  
Phase: `CORRECTED_PRE_WRITE_DRY_RUN_ONLY`  
Recorded: 2026-07-25, Asia/Makassar  
Project: `egkdapqwkfprtyqvvnso`

## Corrected conclusion

The previous remediation conclusion was incorrect. The 91 database URLs point
to the previous Supabase project, but all 91 corresponding objects already
exist in the current project’s public `venue-photos` bucket under identical
object paths. No archive, replacement selection or re-upload is required.

## Inventory results

| Check | Result |
|---|---:|
| Legacy references | 91 |
| Current `venue-photos` objects | 91 |
| Exact path matches | 91/91 |
| Missing current objects | 0 |
| Matching `venue_photo_submissions.image_path` | 91/91 |
| Duplicate venue mapping | 0 |
| Invalid MIME | 0 |

The row-level corrected manifest is
`MEDIA_PUBLISH_ALL_CORRECTED_DRY_RUN.csv`. Each row contains the original
legacy URL, extracted path, matching submission path, current object path,
target URL, MIME, size, source/target projects and a rollback value.

## Proposed write (not executed)

For each row, the proposed update is limited to:

`public.venues.photo_url: legacy-project URL → current-project public URL`

The object path, venue identity and bucket remain unchanged. No `photo_status`,
primary/gallery flag, submission status, storage object or bucket policy is
changed by this proposal. The original URL is retained in the rollback
manifest for every row.

## Runtime dependency finding

`venues.photo_url` is read by `lib/data.ts` and mapped through
`venuePhotoUrlForDisplay` in `lib/photo-policy.ts`; catalogue and place detail
surfaces consume that mapped `photoUrl`. `components/VenueImage.tsx` recognizes
the `venue-photos/draft/` public path. `venue_photo_submissions.image_path` is
read by admin photo review, partner photo APIs and `/api/venue-photo/[id]`;
those flows use the same `venue-photos` bucket. `photo_status` is not a
runtime field used by the public venue read model in this repository. The
`venue_photos` registry is not read by the public runtime path found in this
audit.

Therefore, for this narrow correction, updating `venues.photo_url` is
sufficient to remove the old-project URL dependency. A canonical `venue_photos`
backfill remains a separate future task for multi-image status/provenance and
primary/gallery semantics; it is not required to make these 91 URLs target the
current project.

## Safety boundary

`WRITE_EXECUTED: NO`  
`DATABASE_ROWS_CHANGED: NO`  
`STORAGE_OBJECTS_CHANGED: NO`  
`BUCKET_VISIBILITY_CHANGED: NO`  
`PRODUCTION_CHANGED: NO`

