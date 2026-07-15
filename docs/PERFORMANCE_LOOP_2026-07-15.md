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

### Batch 3 — responsive image delivery

- Public Supabase venue photos now use responsive Next Image widths and
  AVIF/WebP negotiation; rights-gated API delivery and unknown external hosts
  deliberately bypass the optimizer.
- Card, plan visual and venue hero sizes are declared separately; only the
  venue hero receives high-priority loading.
- Local scenes and covers now have one-day browser caching plus seven-day
  stale-while-revalidate.
- Live-source smoke: a 915,442-byte Supabase JPEG became a 34,180-byte 640px
  card response (96.3% smaller) through the local production image route.
- The same route negotiated AVIF successfully; scene headers returned the
  configured cache policy.
- Validation: lint passed with one unrelated partner-review image warning;
  typecheck passed; 13/13 tests passed; production build passed.

### Batch 4 — menu and route rendering

- Venue pages no longer read GuestRef during public rendering. Save state loads
  from a separate private/no-store endpoint, allowing venue pages to use
  on-demand ISR without prebuilding 400+ records.
- Closed structured-menu sections now load on demand through a publication-
  gated endpoint. The first section, every section title, item count, official
  source and freshness evidence remain in the initial page.
- Menu items use native details markup and one delegated analytics listener
  instead of one stateful Client Component per item.
- Route pages use static params; Uluwatu pages and venue pages now appear as
  SSG/ISR in the Next production build. Plan data remains cached even though
  its URL-driven search params keep the page request-dynamic.
- Operator menu/action mutations invalidate their matching public cache tag.
- Validation: lint passed with one unrelated partner-review image warning;
  typecheck passed; 16/16 tests passed; production build passed with 83 static
  pages generated.
