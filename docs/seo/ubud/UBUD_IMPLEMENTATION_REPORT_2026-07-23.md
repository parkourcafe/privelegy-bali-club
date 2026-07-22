# Ubud implementation report — 2026-07-23

## Scope

Implemented one evidence-ready page: `P0_UPDATE https://www.otherbali.com/ubud`. No public URL, redirect, alias, sitemap entry or HOLD page was created.

## Claims and architecture

Public copy uses only `P0-UBUD-PILLAR-001` through `006`. The pillar owns area base fit and high-level planning context. Existing activity, itinerary, comparison, food, coffee and wellness owners remain separate. Unsupported legacy claims about walking, travel times, optimal duration, schedules, prices, rankings, transport and neighbourhood fit were removed from the pillar.

## Technical changes

- Absolute self-canonical and matching Open Graph URL.
- `Article` plus `TravelGuide` JSON-LD; visible breadcrumbs continue to emit `BreadcrumbList`.
- Active `ubud-area-base-fit` intent owner linked to the existing page-registry row.
- Existing sitemap source remains unchanged; `/ubud` was already present once.
- Focused source boundary test added.

## Validation

- District CSV validator: pass.
- Ubud boundary tests: 3/3 pass.
- SEO OS tests: 25/25; validation and live sitemap drift check pass (674/674).
- Full repository tests: 252/252 plus 46/46 pretest wave.
- Lint: pass with one pre-existing warning outside Ubud.
- Typecheck: pass.
- Production build: pass.
- Mobile 390×844: main content visible, canonical correct, no `noindex`, three JSON-LD blocks and no horizontal overflow.
- Protected preview: `https://privelegy-bali-club-git-seo-ubud-autonomous-cluster-yulaboober.vercel.app/ubud`; authenticated SSR returned HTTP 200, the sitemap contained `/ubud` once, and canonical/schema/internal-link checks passed.
