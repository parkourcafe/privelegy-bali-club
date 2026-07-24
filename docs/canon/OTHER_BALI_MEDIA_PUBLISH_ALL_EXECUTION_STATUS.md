# Other Bali — MEDIA-PUBLISH-ALL Execution Status

Status: `PARTIAL INVENTORY / WRITE BLOCKED`  
Recorded: 2026-07-25, Asia/Makassar  
Approved contract: `MEDIA-002` / `OTHER_BALI_MEDIA_CONTRACT_V1.md`

## Authorization

The owner approved Media Contract V1 and authorized a separate `MEDIA-PUBLISH-ALL` execution. The execution must begin with a read-only inventory and must not silently discard any image.

## Current blocker

The requested target Supabase project is:

```text
egkdapqwkfprtyqvvnso
```

The credentials available in `/Users/msnigmatullaeva/.env.local` resolve to a different project:

```text
jenldxisjyhabzhtkhni
```

The target public API was queried read-only. It exposed venue rows and current public photo references, but `venue_photo_submissions` is denied to `anon` and the public list of `owner-photo-candidates` returned zero objects. That response cannot establish the inventory of a restricted bucket.

Partial evidence is recorded in `OTHER_BALI_MEDIA_PUBLISH_ALL_INVENTORY_REPORT.md`: 627 venues, 419 photo references, 328 available target-project images, 91 unavailable legacy-project URLs and 208 venues without a photo.

## No mutation performed

- no storage object was read, copied, deleted or made public;
- no database row was changed in the target project;
- no bucket visibility was changed;
- no runtime dependency or production page was changed;
- no image was discarded.

## Required unblock

Provide or place a read-only-capable credential pair for `egkdapqwkfprtyqvvnso` in the approved local environment. Once the project reference matches, the next execution will complete the service-read inventory:

1. all `owner-photo-candidates` objects;
2. all `venue_photo_submissions` rows;
3. all `venues.photo_url` references;
4. all legacy external-project URLs;
5. duplicate content hashes;
6. unmatched venue slugs.

The inventory output will be checked against `MEDIA-PUBLISH-ALL` acceptance criteria before any write operation is considered.
