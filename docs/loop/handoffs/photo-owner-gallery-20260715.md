# Private owner photo gallery — 2026-07-15

## Discovery

- Branch: `loop/05-release-integration`
- Production Supabase project: `egkdapqwkfprtyqvvnso`
- Source package: `final-strict-current-deduplicated-review-manifest.json`
- Source validation: 343 venue records, 814 selected files, zero missing files, unsafe sources, policy failures or cross-venue duplicates. Of the 343 records, 299 have at least one candidate photo and 44 have no candidate photo in the package.
- Rights state: every candidate is `awaiting_owner_consent`; every candidate has `publicationAllowed=false`.
- Storage target: private `owner-photo-candidates` bucket, candidate namespace `owner-candidates/v1/`.
- Public-card invariant: the import does not update `venues.photo_url`, approved submissions or any public delivery URL.
- Owner workflow: token-bound private preview → exact image selection and rights grant → private pending submission → separate operator approval.

## Run status

### Production probe

- Temporary deployment: `dpl_H1shLSN4sLriCQsPj2DiGcwjPgT4`.
- Exact project ref confirmed: `egkdapqwkfprtyqvvnso`.
- `release_readiness_v1` / migration 0040: not ready.
- `release_readiness_v2` / migration 0041: not ready.
- Existing `venue-photos` bucket exists but is public. It was not modified or used by this run.
- The connected Supabase account does not have access to the production project, and production Vercel has no Postgres/DB-admin credential. Applying 0040/0041 is therefore externally blocked.

### Private staging apply

- Upload deployment: `dpl_DySS82h4t8XnwyrW5uCQnvB6rhtU`.
- Created `owner-photo-candidates` with `public=false`, a 10 MiB object limit and an image-only MIME allowlist.
- Created `owner-photo-consents` with `public=false`, a 64 KiB object limit and an `application/json` allowlist.
- Uploaded and server-revalidated 814/814 selected candidates (317,891,954 bytes).
- Each accepted object matched the deterministic manifest path, byte length, detected MIME and SHA-256 digest.
- Upload failures: 0. Integrity failures: 0. Duplicate/mismatch conflicts: 0.
- Package digest: `81bd3d8670c6771f240ca7597f33f4616c91ab896d429c5f9f39b93390c96d78`.

### Owner gallery

- `/onboard/<token>` resolves only the token-bound venue and receives short-lived signed previews for that venue's candidates.
- The owner sees every candidate mapped to the venue, can tick any number or use `Select all`, and saves the selection without a separate rights checkbox.
- Each choice is written once to the private `owner-photo-consents` bucket as `owner_selected_pending_operator_review`, with `rightsLicenseGranted=false` and `publicationAllowed=false`.
- The checkbox is deliberately a venue selection, not a fabricated legal licence. Any publication agreement remains a separate follow-up with the Other Bali team.
- The import never writes `venues.photo_url`, `published_url`, approved submission state or any public URL.

### Developer final-site preview

- Added `/developer/site` as a read-only, separately Basic-authenticated production preview of the actual Other Bali catalogue and venue layouts.
- The catalogue renders all 343 records with the real site cards, search, district/type filters and links to `/developer/site/<slug>` detail pages.
- 299 records render a signed candidate photo as the card cover. The remaining 44 render the designed category cover because no candidate photo exists for those records in the package; this is not a signing or upload failure.
- Venue detail pages render a masthead and every candidate assigned to that venue. Across the detail pages the complete 814-photo package is available for review.
- `/developer/photo-review` now redirects to `/developer/site` so the former raw gallery cannot be mistaken for the final-site preview.
- The preview creates only short-lived signed URLs from the private candidate bucket; it has no upload, update, delete, approval or publication mutation.
- Unauthenticated production request: HTTP 401. Authenticated catalogue and sample venue requests: HTTP 200. The catalogue response contains 343 `.place-card` elements and 299 signed photo-cover images.
- Desktop browser QA at 1440×1100: 343 cards, sample venue masthead and 2-photo gallery rendered, all sample images loaded, zero horizontal overflow.

### Cleanup and final production state

- Implementation commit: `e990fa57291b2185215fa80c516ed40c1420a479`.
- Permanent deployment: `dpl_CDyGynp6LJrPUf6peoYXCmosojhy`.
- Simplified unlimited owner-selection commit: `c7d97f387d5134e3836989e1a0d657cb4d9429da`.
- Current production deployment: `dpl_BGRhRvsTh2KQntYvB4xoE17W9vCh`.
- Developer gallery commit: `280f113d8826c4560179e45ec03ab8d65b4c5375`.
- Developer gallery production deployment: `dpl_5Z3StaS6ySLt79MEbVvW4ZKFWYSc`.
- Final-site preview implementation commit: `5ce433c`.
- Coverage clarification commit: `b2a4f62c5b3785e4a18a2ce152a7baa2317f55f6`.
- Current final-site preview production deployment: `dpl_B8w8PRZBXqwXCKecSMn6m3cxVmQL` (`https://www.otherbali.com/developer/site`).
- Temporary photo import endpoint removed from the build and returns HTTP 404.
- `PHOTO_CANDIDATE_IMPORT_TOKEN` removed from the production environment.
- `/api/health/live`: HTTP 200.
- `/places`: HTTP 200.
- `/api/health/ready`: HTTP 503 because 0040/0041 remain unapplied; this is the confirmed remaining blocker.
- Local verification: lint passed; TypeScript passed; 411 tests passed; production build passed.

## Gates

- Private candidates ready for owner review: **yes (814/814)**.
- Owner photo selection staging: **yes**.
- Owner legal licence collected by this checkbox: **no — intentionally separate**.
- Canonical admin photo queue ready: **no — blocked on production DB access and migrations 0040/0041**.
- Public cards changed by this run: **no**.
- Candidate publication allowed: **no**.
- Owner receipt publication allowed: **no**.
