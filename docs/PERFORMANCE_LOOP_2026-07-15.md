# Other Bali performance loop — 2026-07-15

## Discovery baseline

- Branch: `loop/11-performance`, based on `origin/main` at `01d8fdf`.
- Production sitemap: 509/509 URLs returned HTTP 200.
- Production total time: p50 1,629.7 ms; p95 2,162.1 ms.
- Production TTFB: p50 1,412.5 ms; p95 1,915.5 ms.
- `/places`: 1,361,677 bytes of HTML and 438 image elements.
- 437 venue detail pages: median response time about 1.64 seconds.
- Public Supabase reads are uncached and repeated between metadata/page renders.
- Venue detail loads the entire published catalogue to select three similar venues.
- Large structured menus render and hydrate every item, including collapsed sections.

## Safety boundary

- Cache public, published data only.
- Never cache GuestRef, saved-place state, partner data, admin data or other request identity.
- Preserve fail-closed publication filters and public provenance gates.
- Preserve metadata, canonical URLs, robots rules, analytics and public action boundaries.
- Validate each performance batch with lint, typecheck, tests and build before merge.

## Planned batches

1. Public-data caching and query deduplication.
2. Server-side catalogue pagination and reduced hydration.
3. Responsive image delivery and browser caching.
4. Menu, route, plan and Uluwatu rendering improvements.
5. Repeat the full URL audit and record before/after evidence.

## Completed evidence

### Batch 1 — public data cache

- Added five-minute caches for published venues, menus, actions, plans and routes.
- Kept GuestRef, saved-place, partner and admin reads outside cache scopes.
- Deduplicated venue reads and limited Similar Places to three results from at
  most eight ranked candidates.
- Validation: lint passed with one pre-existing image warning; typecheck passed;
  11/11 tests passed; production build passed.

### Batch 2 — catalogue rendering

- Server-side filtering and URL-driven pagination now bound `/places` to 24
  result cards per response.
- Top-three intent ranking still runs over the complete filtered result set
  before pagination.
- `PlacesView` and `PlaceCard` are Server Components; only analytics-enabled
  links hydrate on the client.
- Local no-database shell response: HTTP 200, 29,966 bytes, 81 ms total. A
  database-backed preview measurement remains required after deployment.
- Validation: lint passed with one pre-existing image warning; typecheck passed;
  12/12 tests passed; production build passed.
