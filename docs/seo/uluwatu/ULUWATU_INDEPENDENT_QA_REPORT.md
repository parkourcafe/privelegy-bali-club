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

## Runtime blocker resolution

The shared layout 404 finding was confirmed on the first preview. The venue-completeness gate was then moved to nested layouts for existing venue-dependent child guides, leaving the evidence-backed pillar independent. A replacement preview must still prove HTTP 200, one canonical, no noindex, schema, sitemap membership, internal links and mobile rendering.

## Follow-up backlog

Pre-existing inbound blurbs elsewhere use unrecertified surf, beach and sunset superlatives. They are outside this district-pillar diff and require a separate evidence recertification pass.
