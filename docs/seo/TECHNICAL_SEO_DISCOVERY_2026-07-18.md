# Other Bali technical SEO discovery — 2026-07-18

## Release boundary

- Repository: `parkourcafe/privelegy-bali-club`
- Canonical production branch: `main`
- Working branch: `agent/seo-top5-foundation`
- Starting SHA: `42826b6742ec0f6c9c103582f0ef0c59025fb7e1`
- Production origin: `https://www.otherbali.com`
- This release is code, tests, and documentation only. It does not merge, deploy,
  change DNS/Vercel aliases, enable analytics, write to production Supabase, or
  send outreach.

## Authority read before implementation

1. `AGENTS.md`
2. `Other_Bali_Master_Architecture.md`
3. `docs/OTHER_BALI_PLATFORM_ARCHITECTURE_20260715.md`
4. `docs/loop/RELEASE_RECONCILIATION_2026-07-14.md`
5. `docs/seo-strategy.md`
6. `docs/founder-launch-checklist.md`
7. Relevant Next.js 16 local documentation for metadata, `notFound`, sitemap,
   proxy, redirects, and headers.

No database migration is required for this release. The existing
`venues.last_verified_at` column is the only authoritative date available for
venue sitemap freshness.

## Reproduced defects

### Pagination and canonical

- `https://www.otherbali.com/places?page=999` returns `200` and silently renders
  the last available catalogue page.
- `/places` metadata ignores `page`, so every valid page currently canonicalizes
  to `/places` and inherits a non-page-specific Open Graph URL.
- Filtered/search tool states need an explicit `noindex,follow` rule while their
  canonical points to the relevant district hub or the catalogue root.

### Duplicate hosts

The following live hosts returned `200` on 2026-07-18 and did not return an
`X-Robots-Tag` header:

- `https://privelegy-bali-club.vercel.app/`
- `https://otherbali-site.vercel.app/`
- `https://review.otherbali.com/`

Production Vercel aliases should redirect to the canonical `www` origin.
Review and preview hosts must remain `noindex, nofollow, noarchive`. Detaching
`review.otherbali.com` from the production Vercel project is a separate founder
deployment action; code must fail closed until that alias work is complete.

### `lastmod`

The sitemap emits no `lastModified` values. It must not invent freshness. This
release will:

- use `venues.last_verified_at` for venue URLs when the value exists;
- use a checked-in, source-reviewed date registry for the ten priority static
  SEO pages;
- omit `lastmod` where no reliable significant-update date exists.

### Open Graph URL

The root layout declares the homepage URL globally. Routes that do not replace
the Open Graph object can therefore inherit a wrong homepage `og:url`. This
release removes the global URL and assigns explicit URLs to the homepage,
`/plan`, `/places`, and the already-prioritized SEO surfaces. Venue and guide
metadata already emit their own correct URLs.

### Organic action measurement

The code already emits safe, PII-free action events:

- Maps: `direction_click`
- Reserve: `action_handoff` (`action=reserve`), and internal TablePilot
  `reservation_click`
- WhatsApp: `action_handoff` (`action=whatsapp`) plus `booking_click`
- Menu: `menu_open` and `menu_item_open`
- Delivery: `action_handoff` (`action=delivery`) plus `delivery_click`

However, production HTML currently contains neither the GA measurement ID nor
Google Tag Manager, because `NEXT_PUBLIC_ENABLE_ANALYTICS` is off. Therefore
organic-session attribution is not active today. The technical release will
make GA loading consent-gated and give TablePilot Reserve the same safe
`booking_click` acquisition event as other reservation handoffs. Enabling the
production flag remains a founder deployment action after privacy review.

## Search Console baseline

Authenticated read-only property: `https://www.otherbali.com/` under
`parkourcafe@gmail.com`.

The 28-day report was selected on 2026-07-18. Search Console has data only for
2026-07-11 through 2026-07-16 (six data days), so a full 28 calendar-day history
does not yet exist.

- Clicks: 3
- Impressions: 141
- CTR: 2.1%
- Average position: 28.4
- Queries with data: 68
- Pages with data: 47

Top observed URLs include the homepage (2 clicks / 14 impressions),
`/places/jari-menari-seminyak` (1 / 4), and
`/canggu/work-friendly-cafes` (0 / 9). Multiple legacy redemption URLs under
`/v/*/redeem` also have impressions even though their current response correctly
returns `X-Robots-Tag: noindex, nofollow, noarchive`; they remain outside the
SEO target set and should decay after recrawl.

The first true 28-day window can mature no earlier than 2026-08-08, subject to
Search Console reporting delay.

## Files in technical scope

- `app/places/page.tsx`
- `app/plan/page.tsx`
- `app/page.tsx`
- `app/layout.tsx`
- `app/sitemap.ts`
- `components/AnalyticsClient.tsx`
- `lib/analytics.ts`
- `lib/consent.ts`
- `lib/data.ts`
- `lib/site-origin-policy.ts`
- `lib/types.ts`
- `lib/uluwatu/venues.ts`
- `proxy.ts`
- focused tests, package test wiring, and SEO handoff documents

## Explicitly out of this release

- Production merge/deploy and analytics environment changes
- Vercel domain removal or DNS changes
- Search Console sitemap submissions or removal requests
- Public founder biography without founder-approved identity, biography,
  portrait rights, and official profile links
- Content rewrites, backlink outreach, or any external messages
