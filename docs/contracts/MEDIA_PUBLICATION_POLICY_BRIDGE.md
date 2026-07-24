# MEDIA-PUBLICATION-POLICY-BRIDGE

Task: `MEDIA-PUBLICATION-POLICY-BRIDGE`  
Decision: `MEDIA-002`  
Scope: runtime bridge only; no canonical `venue_photos` backfill

## Policy contract

`lib/photo-policy.ts` now resolves the venue-bound `photo_url` carrier through
`resolveVenuePhoto()` and `venuePhotoUrlForDisplay()`.

The public image is `ready` only when all of the following hold:

- venue `status` is `active`;
- venue `publication_status` is `published`;
- the URL is the venue's exact `photo_url` carrier;
- the URL is HTTPS on `egkdapqwkfprtyqvvnso.supabase.co`;
- the bucket is `venue-photos` or `owner-photo-candidates`;
- the URL is not the legacy project host;
- no explicit hard-block photo state is supplied (`blocked`, `rejected`,
  `removed`, `archived`, `revoked`, `expired`, `broken` or `deleted`).

`missing`, `needs_verification`, `provisional` and a `draft/` storage prefix
are not hard blocks under MEDIA-002 when the venue-bound current-project URL
passes the policy. This does not publish arbitrary bucket objects: the helper
receives the exact venue carrier from `venues.photo_url` and requires the
venue publication gate.

## Component boundary

`components/VenueImage.tsx` no longer makes a publication decision based on a
storage folder name. It preserves Next Image optimization, alt text, sizing,
fallback-on-error and existing crop behavior. Publication decisions remain in
`lib/photo-policy.ts` and the venue mapping boundary in `lib/data.ts`.

## Explicit non-scope

No database, storage, schema, migration, route, redirect, navigation, money,
ranking, RLS, cache or production changes are part of this bridge. The existing
`publicImageForSchema()` contract remains conservative: provisional candidate
photos are still excluded from OG, JSON-LD and sitemap imagery.

