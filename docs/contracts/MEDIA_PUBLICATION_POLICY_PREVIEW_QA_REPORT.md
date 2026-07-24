# MEDIA-002 Preview QA report

Date: 2026-07-25  
Source commit: `8ec148a`  
Deployment URL: https://other-bali-t0-diagnostics-nww9ly96c-yulaboober.vercel.app

## Scope and evidence

This is an explicit Vercel preview deployment. The public preview remains on
its `vercel.app` host and does not redirect to production. No database,
storage, schema, route, ranking, or production change was made.

- `/`, `/places`, and `/places/7am-bakers-umalas` render successfully.
- `/places` reports 534 curated places; desktop (1440×900/1280×800) and mobile
  (390×844/375×812) layouts render without console warnings.
- The direct venue page renders an authorized `owner-photo-candidates` WebP via
  Next Image with non-empty dimensions and descriptive alt text.
- Six migrated `venue-photos` slugs tested directly
  (`therapy-day-spa-pererenan`, `samesa-canggu`, `isla-by-earth-island`,
  `rite-bali`, `casa-luna`, `the-shady-shack`) return the honest 404 state. No
  public `venue-photos` object was observed in the sampled published cards.

## Verdict

`MEDIA_PUBLICATION_POLICY_PREVIEW_ACCEPTANCE: BLOCKED`

The preview is now reachable, but the required positive sample of 10
`venue-photos` objects (including six `/draft/` objects) is absent from the
published runtime. This is a data-coverage blocker, not a reason to relax the
policy, activate 404 slugs, or mock data.

## Final fields

PREVIEW_DEPLOYMENT: PASS  
PREVIEW_PUBLIC_DATA_ACCESS: PASS  
VENUE_PHOTOS_SAMPLE: BLOCKED (0/10 reachable; sampled migrated slugs 404)  
OWNER_PHOTO_CANDIDATES_SAMPLE: PARTIAL (direct WebP proof; full 10-object matrix pending)  
JPEG_RENDERING: PARTIAL  
PNG_RENDERING: NOT_TESTED  
WEBP_RENDERING: PASS  
AVIF_RENDERING: NOT_TESTED  
DESKTOP_RENDERING: PASS  
MOBILE_RENDERING: PASS  
NEXT_IMAGE_OPTIMIZATION: PASS (direct WebP rendered through `/_next/image`)  
FALLBACK_BEHAVIOUR: PASS  
ALT_TEXT: PASS  
LAYOUT_STABILITY: PASS  
UNASSIGNED_OBJECT_PROTECTION: PASS  
UNPUBLISHED_VENUE_PROTECTION: PASS  
LEGACY_HOST_PROTECTION: PASS  
HARD_BLOCK_PROTECTION: PASS  
ORGANIC_RANKING_UNCHANGED: PASS  
DATABASE_CHANGED: NO  
STORAGE_CHANGED: NO  
SCHEMA_CHANGED: NO  
PRODUCTION_DEPLOYED: NO (no `--prod` promotion was run)
