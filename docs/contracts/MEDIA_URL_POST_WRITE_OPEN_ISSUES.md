# MEDIA URL Post-write QA — Open Issues

## QA blockers

### MEDIA-QA-001 — Draft-path suppression

All 91 migrated objects are under `venue-photos/draft/`. The public
`components/VenueImage.tsx` explicitly treats this path as non-renderable and
returns the fallback. This is a source-level blocker, not a broken Storage or
HTTP result.

### MEDIA-QA-002 — Provisional photo policy

`lib/photo-policy.ts` maps `venues.photo_url` to an interim provisional status;
`tourist_public` mode suppresses provisional imagery. The public runtime must
receive an approved canonical media status or an explicitly approved policy
change before visual acceptance.

### MEDIA-QA-003 — Local runtime has no published venue surface

The local `.env.local` contains the service-role inventory credentials but no
`NEXT_PUBLIC_SUPABASE_ANON_KEY`. The local app therefore reports `0 published
places`, and the 12 migrated direct venue routes return the not-found shell.
No key was added and no fixture data was enabled during QA.

### MEDIA-QA-004 — Cache freshness

Venue reads are cached for 300 seconds under the `public-venues` tag. The
direct URL write did not invalidate that tag. Do not purge cache in this task;
re-run the browser QA after the approved publication/runtime fix and normal
delivery procedure.

## Non-issues confirmed

- Supabase current project and `venue-photos` bucket are reachable.
- 91/91 exact object paths exist and are public without signed URLs.
- 91/91 images decode successfully.
- Current hostname is allowed by `next.config.ts` remote patterns.
- No database, storage, schema, route or production changes were made by QA.

