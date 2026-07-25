# Other Bali — MEDIA URL Post-write QA Report

Mode: `MEDIA_URL_POST_WRITE_QA_ONLY`  
Scope: read-only verification after commit `5701e20`  
Project: `egkdapqwkfprtyqvvnso`  
Date: 2026-07-25, Asia/Makassar

## Database verification

The current database was compared with the corrected dry-run manifest,
rollback manifest and completed migration report:

- 91 intended venue rows have current-project URLs;
- legacy hostname references: 0;
- exact target/object path matches: 91/91;
- duplicate venue IDs: 0;
- null or malformed target URLs: 0;
- rollback source values match the previous legacy URL: 91/91;
- the write operation was scoped to the 91 manifest venue IDs and the
  `photo_url` field only; no other table or field was written.

## Storage and HTTP verification

All 91 target URLs were fetched directly without a signed URL. Every response
returned HTTP 200, an allowed image MIME, a positive content length, no legacy
redirect, and a successful `sharp` decode. Detailed evidence is in
[MEDIA_URL_POST_WRITE_HTTP_RESULTS.csv](./MEDIA_URL_POST_WRITE_HTTP_RESULTS.csv).

## Runtime dependency finding

`next.config.ts` allows the current hostname through the wildcard Supabase
remote patterns, so `NEXT_IMAGE_HOST_CONFIG` passes. The runtime reads
`venues.photo_url` through `lib/data.ts` and uses the `venue-photos` bucket for
submission/API flows.

Two public-render blockers remain visible in source and are intentionally not
changed in this QA-only run:

1. `components/VenueImage.tsx` suppresses every public URL whose path contains
   `/venue-photos/draft/` and returns the fallback.
2. `lib/photo-policy.ts` treats the interim `photo_url` bridge as provisional;
   `tourist_public` mode does not render provisional photos.

All 91 migrated objects currently use `draft/` paths. Therefore URL, Storage
and HTTP correctness pass, but public image rendering cannot be accepted from
the current runtime until the approved media/publication policy is resolved.

## Browser QA

The local app started successfully and the desktop/mobile shell rendered. The
12 requested migrated venue pages were exercised at default desktop and
390×844 mobile viewports (24 rows). Each route returned the not-found shell
because the local runtime reports `0 published places`; no migrated venue
card/detail was available to render. This is recorded as `BLOCKED`, not as a
visual pass. Screenshots of the available home shell are:

- `docs/qa-evidence/media-url-post-write-home-desktop.png`
- `docs/qa-evidence/media-url-post-write-home-mobile.png`

Detailed rows are in
[MEDIA_URL_POST_WRITE_BROWSER_RESULTS.csv](./MEDIA_URL_POST_WRITE_BROWSER_RESULTS.csv).

## Cache and delivery recommendation

Venue reads use `unstable_cache` with a 300-second revalidation and the
`public-venues` tag. The direct database write did not call `revalidateTag`,
so production may serve a stale cached `photo_url` for up to the configured
revalidation window. No cache purge or deploy was performed. After the runtime
blockers are resolved, use the normal approved revalidation/deploy procedure
and re-run this QA; a production deploy is not needed merely to change the
database URL values.

## Final verdict

```text
MIGRATED_DATABASE_ROWS: 91
LEGACY_URLS_REMAINING: 0
CURRENT_OBJECT_MATCHES: 91/91
HTTP_URLS_VALIDATED: 91/91
HTTP_VALIDATION: PASS
IMAGE_DECODING: PASS
NEXT_IMAGE_HOST_CONFIG: PASS
DESKTOP_RENDERING: BLOCKED
MOBILE_RENDERING: BLOCKED
```

