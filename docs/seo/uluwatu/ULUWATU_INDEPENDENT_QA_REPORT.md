# Uluwatu independent QA report — 2026-07-23

## Pass

- Six draft-ready claim IDs exist and all source references resolve.
- No HOLD URL was implemented.
- `/uluwatu` remains unique in sitemap; intent ownership is unique.
- Canonical and Open Graph URL match in source.
- BreadcrumbList, Article and TravelGuide contracts are present.
- CSV, focused, SEO OS, lint, typecheck and build checks pass.

## Resolved finding

Internal SEO ownership language was replaced with traveller-facing copy.

## Preview blocker to verify

Local production SSR without the configured catalogue returns 404/noindex because `app/uluwatu/layout.tsx` requires the complete legacy venue roster. A configured Vercel preview must prove HTTP 200, one canonical, no noindex, schema, sitemap membership, internal links and mobile rendering. If preview also returns 404, the preview is not release-ready and the shared layout requires a separate architecture fix.

## Follow-up backlog

Pre-existing inbound blurbs elsewhere use unrecertified surf, beach and sunset superlatives. They are outside this district-pillar diff and require a separate evidence recertification pass.
