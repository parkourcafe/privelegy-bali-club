# MEDIA-002 preview branch QA report

Date: 2026-07-25  
Source commit: `4652d00`  
Supabase branch: `media-preview-qa` (`mmhlvalhrebvsyehepos`)  
Preview: https://other-bali-t0-diagnostics-crvu7gwo2-yulaboober.vercel.app

## Environment

The Vercel preview uses the separate Supabase branch for public database reads.
Only a publishable key is configured; no service-role/admin secret is present.
The branch contains 10 active + published QA venue rows and two district rows.

Supabase branch creation reported `MIGRATIONS_FAILED` because production schema
changes are not fully represented in migration history. A branch-only minimal
public-read schema migration was applied for the media QA fields and RLS policy.
Production schema and data were not changed.

The 10 image binaries were not duplicated into branch Storage. Their exact
authorized URLs continue to read the existing public production
`venue-photos` bucket. This is read-only and preserves the policy's exact
venue-bound URL contract.

## Browser results

All 10 requested venue routes rendered on the preview host. Every hero image:

- used the current project `venue-photos/draft/...` object;
- rendered through `/_next/image`;
- completed with non-zero natural width and height;
- had a descriptive venue/category alt value;
- produced no browser console error.

Formats covered: JPEG, PNG, WebP. Districts covered: Canggu and Ubud. Photo
states covered: `published` and `needs_verification`.

Desktop checks used 1440×900 and 1280×800. Mobile checks used 390×844 and
375×812. Mozaic and CutiePai Nails were visually inspected at the desktop and
mobile breakpoints respectively; image crop, headline readability and layout
were acceptable.

## Open issue

`/api/health/ready` remains 503 because the automatically created branch did
not receive the later route/mobile-readiness tables after migration failure.
This does not invalidate the bounded media QA, but the branch is not a complete
application staging database and must not be promoted or merged.

## Verdict

PREVIEW_BRANCH_CREATED: PASS  
PREVIEW_BRANCH_PUBLIC_RLS: PASS  
QA_VENUE_ROWS: 10/10  
VENUE_PHOTOS_SAMPLE: 10/10 PASS  
DRAFT_PATH_SAMPLE: 10/10 PASS  
JPEG_RENDERING: PASS  
PNG_RENDERING: PASS  
WEBP_RENDERING: PASS  
NEXT_IMAGE_OPTIMIZATION: PASS  
ALT_TEXT: PASS  
DESKTOP_RENDERING: PASS  
MOBILE_RENDERING: PASS  
CONSOLE_ERRORS: 0  
PRODUCTION_DATABASE_CHANGED: NO  
PRODUCTION_STORAGE_CHANGED: NO  
SERVICE_ROLE_USED_IN_PREVIEW: NO  
MEDIA_PUBLICATION_POLICY_10_OBJECT_ACCEPTANCE: PASS  
FULL_STAGING_READINESS: BLOCKED (migration history drift)
