# MEDIA-002 venue-photos mapping review

Date: 2026-07-25  
Supabase project: `egkdapqwkfprtyqvvnso`  
Mode: read-only

## Result

All 91 current-project `venue-photos` URLs already map to venues that are both
`status=active` and `publication_status=published`.

| Classification | Count | Exact object | Exact submission |
|---|---:|---:|---:|
| active + published + photo_status=published | 4 | 4 | 4 |
| active + published + photo_status=needs_verification | 87 | 87 | 87 |
| inactive or unpublished | 0 | 0 | 0 |
| missing object/submission mapping | 0 | 0 | 0 |

The 4 fully published photo records are:

- `locavore-nxt` — WebP, approved submission;
- `mozaic` — JPEG, approved submission;
- `room4dessert` — JPEG, approved submission;
- `the-avocado-factory` — JPEG, approved submission.

The other 87 are `needs_verification` with draft submission status, but MEDIA-002
owner authorization and the implemented policy permit the exact venue-bound
current-project URL when its venue is active + published. Their `/draft/`
storage prefix is not itself a publication blocker.

## Preview QA sample

| Slug | District | Photo status | MIME | Storage path |
|---|---|---|---|---|
| the-avocado-factory | canggu | published | image/jpeg | `draft/the-avocado-factory/bc0397f7498a13d77d8b.jpg` |
| mozaic | ubud | published | image/jpeg | `draft/mozaic/421df8885f017b33c1e4.jpg` |
| room4dessert | ubud | published | image/jpeg | `draft/room4dessert/90adb2562b1944594c0f.jpg` |
| locavore-nxt | ubud | published | image/webp | `draft/locavore-nxt/665011828b3745b36705.webp` |
| 12-kitchen-and-wine | canggu | needs_verification | image/jpeg | `draft/12-kitchen-and-wine/b6912e9d7c108cb59f19.jpg` |
| cutiepai-nails | canggu | needs_verification | image/png | `draft/cutiepai-nails/4037b285c2e3092c3774.png` |
| bottega-italiana | canggu | needs_verification | image/webp | `draft/bottega-italiana/cb1292a73a931722e606.webp` |
| alchemy-yoga-meditation-center | ubud | needs_verification | image/jpeg | `draft/alchemy-yoga-meditation-center/10bfad61db1af3ffb17b.jpg` |
| karsa-spa | ubud | needs_verification | image/png | `draft/karsa-spa/7eed261962e722cce8bc.png` |
| jaens-spa | ubud | needs_verification | image/webp | `draft/jaens-spa/ffe0b22cfe8d24a0f3c5.webp` |

This sample covers all 10 required `venue-photos` objects, all with `/draft/`
paths, plus JPEG/PNG/WebP, Canggu/Ubud, and both photo statuses.

## Why preview still returns 404

The Vercel project has no preview environment variables. More importantly,
`lib/supabase/server.ts` deliberately rejects the known production Supabase
project when `VERCEL_ENV=preview`. Without a separate preview project ref and
matching public anon configuration, `isSupabaseConfigured()` fails closed and
the preview cannot load these 91 production rows.

The 10 selected routes were checked in the public preview; all returned the
honest `Place not found` page and none rendered a `venue-photos` image.

## Decision

`VENUE_MAPPING_REQUIRED: NO`  
`VENUE_STATUS_CHANGE_REQUIRED: NO`  
`PHOTO_STATUS_CHANGE_REQUIRED_FOR_MEDIA_002: NO`  
`PREVIEW_DATA_ENVIRONMENT_REQUIRED: COMPLETE`

`READY_FOR_10_OBJECT_PREVIEW_QA: YES`

`10_OBJECT_PREVIEW_QA: PASS`

Do not weaken the production-project preview guard or add a service-role key.
A separate Supabase preview branch now contains the approved 10-row database
subset. The image binaries remain in the existing public production bucket and
are consumed read-only by exact venue-bound URLs.
