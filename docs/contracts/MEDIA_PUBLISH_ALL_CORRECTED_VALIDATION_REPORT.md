# MEDIA-PUBLISH-ALL — Corrected Validation Report

Phase: `CORRECTED_PRE_WRITE_DRY_RUN_ONLY`  
Evidence: current-project read-only inventory generated 2026-07-24T17:43:32.353Z UTC

| Validation | Result |
|---|---|
| Legacy reference count = 91 | PASS |
| Current objects found = 91 | PASS |
| Exact path matches = 91 | PASS |
| Missing current objects = 0 | PASS |
| `venue_photo_submissions.image_path` exact matches = 91 | PASS |
| Duplicate venue mapping = 0 | PASS |
| Target project is `egkdapqwkfprtyqvvnso` | PASS |
| Target bucket is `venue-photos` | PASS |
| Target object path exists exactly | PASS |
| Public target URL HEAD check = 91/91 HTTP success | PASS |
| MIME allowlist (JPEG/PNG/WebP/AVIF) | PASS |
| No source row omitted | PASS |
| Every proposed update has original URL rollback | PASS |
| Primary/gallery status inferred or changed | NO — correctly not performed |
| `owner-photo-candidates` modified | NO |

The corrected CSV and rollback manifest are generated from the same 91-row
source set, so row counts and venue keys are parity-checked. The target URL is
constructed only from the exact current `storage.objects.name` path.

## Runtime dependency map

| Carrier | Readers found | Finding |
|---|---|---|
| `venues.photo_url` | `lib/data.ts`, `lib/mobile-api/service.ts`, venue/place surfaces | Public venue read model depends on this field; replacing the project host removes the legacy dependency |
| `venue_photo_submissions.image_path` | admin photo review, partner photo API, `/api/venue-photo/[id]`, onboarding | Current bucket is already `venue-photos`; no path rewrite is required |
| `photo_status` | no public runtime reader found | Do not modify in this task |
| `venue_photos` | no public runtime reader found | Canonical registry backfill is separate; not required for URL host correction |
