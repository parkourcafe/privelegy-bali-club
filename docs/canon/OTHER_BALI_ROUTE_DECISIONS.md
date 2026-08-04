# Other Bali — Route Decisions

Status: reconciled, no implementation authorized  
Recorded: 2026-07-25, Asia/Makassar

## Route matrix

| Decision | Current live canonical | Target canonical | Redirect now | Required gate | Current as-is evidence |
|---|---|---|---|---|---|
| ROUTE-001 | `/my-day` | `/today` | NO | Preservation review + approved Migration Map V1 + regression/analytics/SEO checks | `app/my-day/page.tsx`; production `/my-day` returns 200 and renders Today shortlist |
| ROUTE-002 | `/me` | `/my-bali` | NO | Build/validate target first; state, internal links, canonical and regression review; then Migration Map V1 | `app/me/page.tsx`; production `/me` is private Saved/My list carrier; `/my-bali` is currently 404/noindex |

## Route safety rules

- Do not create either redirect in this stage.
- Do not change canonical metadata or primary navigation.
- Preserve anonymous saved state and GuestRef behavior before any `/me` migration.
- Preserve query/hash state and Today analytics before any `/my-day` migration.
- Keep `/route/[slug]` in the singular form.
- Existing `/places`, `/places/[slug]`, `/plan`, `/collections`, `/guides`, `/bali/[district]/[intent]`, partner and resort-F&B routes remain preserved until mapping.

## Required preservation evidence before implementation

1. Full route inventory and redirect proposal register;
2. incoming/outgoing internal-link graph;
3. title/H1/canonical/robots/sitemap matrix;
4. state and query preservation tests;
5. analytics current-to-target map;
6. production and preview regression checks;
7. approved Migration Map V1 entry with rollback.

## Current route verdict

`ROUTE_DECISIONS: PASS` means owner decisions are now explicit and no unsafe redirect was made. It does not mean either target route is implemented.
