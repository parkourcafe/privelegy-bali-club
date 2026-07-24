# MEDIA-002 Preview QA report

Date: 2026-07-25  
Source commit: `8ec148a`  
Deployment URL: https://other-bali-t0-diagnostics-v8lm92vm4-yulaboober.vercel.app

## Scope

This was a preview-only deployment and visual acceptance run. No database,
storage, schema, route, ranking, or production change was made. The build
completed successfully, but Vercel Deployment Protection redirects the public
URL to “Log in to Vercel” before the Next.js application is reachable.

## Evidence

- Vercel build status: Ready; Next.js production build completed.
- Browser response at `/`: Vercel authentication page, not the application.
- Therefore `/places`, venue pages, media objects, hydration, and responsive
  venue rendering could not be reached through the public preview URL.
- Existing policy/unit evidence remains green: photo-policy tests 9/9, T0
  suite 48/48, lint, typecheck, and build pass (source commit evidence).

## Verdict

`MEDIA_PUBLICATION_POLICY_PREVIEW_ACCEPTANCE: BLOCKED`

The blocker is access control on the preview deployment, not a media-policy
failure. Do not claim visual PASS until a publicly reachable preview (or an
owner-approved authenticated QA session) is available.

## Required next action

Create a preview deployment with Vercel Deployment Protection disabled for the
preview URL, or provide an owner-approved browser session that can access this
deployment. Then rerun the exact desktop/mobile and positive/negative matrix.
Do not add service-role credentials or mock venue data.

## Final fields

PREVIEW_DEPLOYMENT: PASS (Ready deployment; public access protected)  
PREVIEW_PUBLIC_DATA_ACCESS: BLOCKED  
VENUE_PHOTOS_SAMPLE: BLOCKED (0/10 reachable)  
OWNER_PHOTO_CANDIDATES_SAMPLE: BLOCKED (0/10 reachable)  
JPEG_RENDERING: BLOCKED  
PNG_RENDERING: BLOCKED  
WEBP_RENDERING: BLOCKED  
AVIF_RENDERING: BLOCKED  
DESKTOP_RENDERING: BLOCKED  
MOBILE_RENDERING: BLOCKED  
NEXT_IMAGE_OPTIMIZATION: BLOCKED (runtime not reachable)  
FALLBACK_BEHAVIOUR: PASS (policy/unit/source evidence; browser path blocked)  
ALT_TEXT: PASS (component/source evidence; browser path blocked)  
LAYOUT_STABILITY: BLOCKED (venue surfaces not reachable)  
UNASSIGNED_OBJECT_PROTECTION: PASS  
UNPUBLISHED_VENUE_PROTECTION: PASS  
LEGACY_HOST_PROTECTION: PASS  
HARD_BLOCK_PROTECTION: PASS  
ORGANIC_RANKING_UNCHANGED: PASS  
DATABASE_CHANGED: NO  
STORAGE_CHANGED: NO  
SCHEMA_CHANGED: NO  
PRODUCTION_DEPLOYED: NO (no `--prod` promotion was run)
