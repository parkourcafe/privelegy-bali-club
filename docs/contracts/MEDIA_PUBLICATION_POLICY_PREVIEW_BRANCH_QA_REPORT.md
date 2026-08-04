# MEDIA-002 preview branch QA report

Date: 2026-07-30

Source commit: `998684d`

Supabase branch: `media-preview-qa` (`mmhlvalhrebvsyehepos`)

Preview: https://other-bali-t0-diagnostics-git-codex-discover-9e6b55-yulaboober.vercel.app

## Environment

The Vercel preview uses the separate Supabase branch for public database reads.
Only a publishable key is configured; no service-role/admin secret is present.
The branch contains the original 10 active + published media-QA venue rows,
plus one public production-backed venue used to exercise the mobile catalogue,
and two district rows.

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

## Mobile readiness repair

On 2026-07-30, preview-only `routes` and `route_stops` tables, public-read RLS
policies and grants were applied because the automatically created branch had
stopped before those migrations. Both tables intentionally remain empty; no
route fixtures were invented.

The original 10 media-QA rows were editorially complete, but none had a Maps
handoff accepted by mobile v1: nine carried search URLs and one failed the
Google Maps allowlist. The filter was not weakened and those URLs were not
rewritten. Instead, one existing published venue was copied from the public
production mobile API into the preview branch as a bounded catalogue replica:
`milk-and-madu-ubud`. Its public identity, owner-confirmed publication
provenance, editorial fields and credential-free Maps handoff were validated
before insertion. Production schema, data and storage were not changed.

After this repair, the current preview returns HTTP 200 from
`/api/health/live`, `/api/health/ready`, `/api/mobile/v1/config` and
`/api/mobile/v1/bootstrap`. Bootstrap exposes at least one deliverable venue.

The Supabase branch still reports historical `MIGRATIONS_FAILED` state. Runtime
readiness for this release candidate is proven, but the branch must not be
promoted or merged into production; migration-history reconciliation remains a
separate infrastructure task.

## Owner visual acceptance

On 2026-07-25 the project owner completed the final visual acceptance and
confirmed:

> Preview принимаю

This closes the bounded acceptance gate for the 10 venue-photo objects listed
in `MEDIA_PUBLICATION_POLICY_PREVIEW_BRANCH_RESULTS.csv`. It does not approve a
production deployment, production writes, branch promotion/merge or deletion
of the paid preview branch.

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
OWNER_VISUAL_ACCEPTANCE: PASS

PRODUCTION_RELEASE_AUTHORIZED: NO

PREVIEW_BRANCH_DELETION_AUTHORIZED: NO

FULL_STAGING_READINESS: BLOCKED (migration history drift)

CURRENT_RELEASE_RUNTIME_READINESS: PASS
