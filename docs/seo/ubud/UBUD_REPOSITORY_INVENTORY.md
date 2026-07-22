# Ubud repository inventory

Date: 2026-07-23. Baseline: production merge `d79aaba`.

## [EXTRACTED] Public owners

All thirteen URLs below return HTTP 200, emit a self-canonical and do not emit `noindex`: `/ubud`, `/ubud/things-to-do`, `/ubud/itinerary`, `/ubud/best-restaurants`, `/ubud/best-warungs`, `/ubud/best-cafes-coffee`, `/ubud/best-yoga-wellness`, `/ubud/hotel-brunches`, `/ubud/jungle-pool-day-passes`, `/ubud-one-day`, `/ubud-vs-canggu`, `/ubud-culture-rice-terraces-waterfalls`, and `/route/ubud-culture-day`.

Each is present in `docs/seo/os/page-registry.json` and the live sitemap. The only active Ubud intent owner in `intent-registry.json` is `/ubud/best-cafes-coffee`. The monthly decision log places that owner on HOLD pending a current GSC window.

## [EXTRACTED] Internal architecture

- `app/ubud/page.tsx` mixes base-fit, neighbourhood choice, attractions, itinerary and venue discovery.
- `/ubud/things-to-do` owns attraction selection.
- `/ubud/itinerary` owns a two-to-three-day sequence.
- `/ubud-one-day` owns a one-day sequence.
- `/ubud-culture-rice-terraces-waterfalls` and `/route/ubud-culture-day` both address a culture-day pattern and require GSC review before consolidation.
- Food, wellness, hotel-brunch and pool-day-pass pages are entity-dependent and volatile.

## [INTERPRETED] Principal risk

The immediate risk is not a missing URL. It is overlapping ownership among the pillar, two itinerary pages and two culture-day pages. No URL should be created, redirected or retired until current query-to-page GSC evidence is available.
