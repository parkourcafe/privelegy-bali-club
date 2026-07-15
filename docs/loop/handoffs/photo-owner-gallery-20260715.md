# Private owner photo gallery — 2026-07-15

## Discovery

- Branch: `loop/05-release-integration`
- Production Supabase project: `egkdapqwkfprtyqvvnso`
- Source package: `final-strict-current-deduplicated-review-manifest.json`
- Source validation: 343 venues, 814 selected files, zero missing files, unsafe sources, policy failures or cross-venue duplicates.
- Rights state: every candidate is `awaiting_owner_consent`; every candidate has `publicationAllowed=false`.
- Storage target: private `venue-photos` bucket, candidate namespace `owner-candidates/v1/`.
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
- The owner can select up to three exact images, enter identity/contact, and grant the exact-image licence.
- While 0041 is unavailable, consent is written once to the private `owner-photo-consents` bucket as `pending_operator_import`, with `publicationAllowed=false`.
- When exact 0041 readiness becomes available, the same route automatically uses the canonical private submission/consent RPC workflow.
- The import never writes `venues.photo_url`, `published_url`, approved submission state or any public URL.

### Cleanup and final production state

- Implementation commit: `e990fa57291b2185215fa80c516ed40c1420a479`.
- Permanent deployment: `dpl_CDyGynp6LJrPUf6peoYXCmosojhy`.
- Temporary photo import endpoint removed from the build and returns HTTP 404.
- `PHOTO_CANDIDATE_IMPORT_TOKEN` removed from the production environment.
- `/api/health/live`: HTTP 200.
- `/places`: HTTP 200.
- `/api/health/ready`: HTTP 503 because 0040/0041 remain unapplied; this is the confirmed remaining blocker.
- Local verification: 409 tests passed; TypeScript passed; production build passed.

## Gates

- Private candidates ready for owner review: **yes (814/814)**.
- Owner exact-image consent staging: **yes**.
- Canonical admin photo queue ready: **no — blocked on production DB access and migrations 0040/0041**.
- Public cards changed by this run: **no**.
- Candidate publication allowed: **no**.
- Owner receipt publication allowed: **no**.
