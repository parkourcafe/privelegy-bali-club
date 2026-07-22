# Uluwatu implementation report — 2026-07-23

## Scope

Implemented one evidence-ready page: `P0_UPDATE https://www.otherbali.com/uluwatu`. No new public URL, redirect, alias or HOLD page was created.

## Claims

Public copy uses only `P0-ULU-PILLAR-001` through `006`. It removes legacy claims about rankings, walkability, scooter necessity, journey patterns, family suitability, prices, hours, booking and venue policies.

## Architecture

The pillar owns base fit and planning-label scope. Existing children retain food, sunset and itinerary decisions. Future where-to-stay, hotel, things-to-do and beach pages remain HOLD and absent from routes, registries and sitemap.

## Technical changes

- Unique metadata, absolute canonical and matching Open Graph URL.
- Visible breadcrumbs plus `BreadcrumbList` JSON-LD.
- Visible copy aligned with `Article` and `TravelGuide` JSON-LD.
- Active `uluwatu-area-base-fit` intent owner linked to the existing page-registry row.
- Sitemap source remains unchanged; `/uluwatu` already exists exactly once.
- Focused source-level boundary test added.

## Validation

- District CSV validator: pass.
- Skill validator: pass.
- Uluwatu boundary tests: 2/2 pass.
- SEO OS tests: 25/25 pass; validation and live sitemap drift check pass.
- Full repository tests: 252/252 pass (plus 46/46 pretest wave).
- Lint: pass with one pre-existing warning outside Uluwatu.
- Typecheck: pass.
- Production build: pass.

## Runtime gate repair

The venue-roster completeness gate moved from the shared `/uluwatu` layout to nested layouts on the six existing venue-dependent child guides. The evidence-backed pillar no longer returns 404 when unrelated venue data is incomplete; child publication protection remains unchanged.
