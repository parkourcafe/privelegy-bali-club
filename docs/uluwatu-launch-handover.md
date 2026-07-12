# Uluwatu district launch — handover (2026-07-12)

> **Русское резюме для Селены.** Улувату теперь — полноценный продукт
> района: страница-гид `/uluwatu`, пять SEO-страниц (рестораны, бранч,
> клубы/закат, date night, план на 48 часов), полные страницы всех мест
> (`/places/[slug]`), новая редакционная карточка, форма лид-магнита с
> честным хранением лидов, аналитика, sitemap. 24 места опубликованы с
> проверкой фактов и источниками; 1 (Ulu Artisan Ungasan) держим в review
> из-за конфликта названия бренда. Деньги/QR в Улувату НЕ включались —
> только проверенные официальные ссылки на бронь. Что делать руками:
> (1) применить миграцию 0018 в прод-Supabase; (2) прогнать 30-дневный
> план (`docs/uluwatu-30-day-launch.md`); (3) полевые проверки из gap
> register (часы работы, номера домов на Labuansait). Canggu-контур
> (перки, QR, TablePilot) не тронут.

## What shipped (branch `claude/uluwatu-district-launch-jnhgwu`)

### Pages
- `/uluwatu` — district pillar (micro-areas, quick picks, FAQ, practical
  limits, CTA to 48h). Static-prerendered.
- `/uluwatu/best-restaurants`, `/uluwatu/best-brunch`,
  `/uluwatu/beach-clubs-sunset`, `/uluwatu/date-night-restaurants`,
  `/uluwatu/48-hours` — five SEO children, each with unique intent,
  metadata, canonical, OG/Twitter, BreadcrumbList + ItemList (+ FAQPage for
  visible FAQs), answer-first intro, comparison content, internal links, CTA,
  dated editorial review line.
- `/places/[slug]` — full venue template for EVERY venue (breadcrumbs,
  editorial hero, sticky mobile action bar, quick-decision block, why it's
  here / what to expect / what to order, confirmed offer (Canggu only),
  owner voice (attributed), practical block with verified links, similar
  places, "Information last checked" note, LocalBusiness JSON-LD with
  verified facts only).

### Data integrity layer
- `lib/uluwatu/venues.ts` — editorial + evidence registry (per-fact source
  type/URL/date/status). THE source of truth for Uluwatu publication.
- `lib/publication.ts` — explicit publication policy replacing the old
  3-field predicate: Uluwatu = evidence-gated registry; other districts keep
  the legacy display bar but their venue pages are noindex (no evidence layer
  yet). `?all=1` internal review preserved.
- `supabase/migrations/0018_uluwatu_launch.sql` — venue columns
  (official_url, instagram_url, booking_url, opening_hours, price_band,
  book_ahead, last_verified_at, publication_status), `venue_fact_sources`
  mirror (default-deny RLS), `guide_leads` + `submit_guide_lead` RPC,
  verified Uluwatu backfill. **NOT applied to prod — founder action** (after
  the still-pending 0013; all idempotent).
- URL mapping: public `uluwatu` ↔ internal `uluwatu-bukit`
  (`normalizeDistrictParam`), no duplicated rows.

### Components
- `PlaceCard` (editorial card: cover/typographic plate, name, category ·
  micro-area, one line, Best for, price band, sponsored label, View place +
  Reserve/Directions secondary) — used on /places + all guide pages. Old
  `VenueCard` remains ONLY on /plan and /route (Canggu money-loop surfaces,
  untouched).
- `PlaceCover` (explicitly typographic cover — card + hero monogram
  variants; replaces the abstract placeholder on public surfaces),
  `Breadcrumbs` (+JSON-LD), `VenueActionBar` (sticky mobile),
  `TrackedOutboundLink`, `PageViewTracker`, `GuideLeadForm`, `GuideBlocks`
  (FAQ/ItemList/picks/related/footer).

### Analytics (documented dual-sink, brief §21)
- `lib/analytics.ts` — one call → internal `/api/event` (funnel system of
  record) + GA4 custom event. Partner-proof events (`reservation_click`,
  redemption) stay internal-only, unchanged.
- New allowed internal events: district_page_view, editorial_page_view,
  venue_detail_view, venue_card_click, booking_click,
  official_website_click, instagram_click, menu_click, partner_offer_click,
  guide_form_started, guide_form_submitted, whatsapp_guide_click,
  internal_guide_click. (`direction_click` reused for directions.)

### Lead magnet (brief §18)
- Form: consent NOT preselected, validation, loading/error/success states,
  honeypot, duplicate handling (server-side upsert), UTM + source capture,
  consent timestamp. Storage via SECURITY DEFINER RPC, default-deny RLS.
- **No delivery provider wired** — success copy never claims a send; web
  guide is always visible; WhatsApp self-share deep link offered. Email/WA
  copies: `docs/uluwatu-48h-guide-versions.md` (manual send rules + log).

### SEO
- Sitemap: pillar + 5 children + 24 indexable venue pages (36 URLs total).
- Index/noindex verified: published venue → index,follow; review venue →
  noindex,nofollow; non-evidence districts → noindex.
- Internal linking: homepage Around-Bali card → /uluwatu; /places district
  banner → /uluwatu; pillar ↔ children ↔ venue pages ↔ 48h (varied blocks).

## QA record

- `npm run lint` ✅ 0 problems · `tsc --noEmit` ✅ · production build ✅
  (all 6 Uluwatu pages static-prerendered).
- Internal-link crawl over the 6 guide pages: 46 unique internal links, all
  200. Sitemap fetch ✅. Canonicals ✅. JSON-LD present (Breadcrumb,
  Restaurant/LocalBusiness, ItemList, FAQPage on rendered FAQs only).
- API tests: event API accepts new types / rejects junk (400); guide-lead
  API — consent required, email/WhatsApp validation, honeypot returns fake
  success without storing, unconfigured DB returns honest 503 (client shows
  guide anyway), bad email 400.
- Visual QA (Chromium, 1366px + 390px): no horizontal overflow on any new
  page; sticky mobile bar present; typographic covers; light editorial theme
  per brief §11. Only console error = GA4 CDN blocked by sandbox proxy
  (environmental).
- Canggu flows: /plan, /route/[slug], /v/[venue]/redeem, partner/onboard/
  admin untouched (diff-verified); /places keeps Reserve (TablePilot handoff
  with `source=bali_privilege` + internal reservation_click) one tap deep on
  cards and on venue pages; perk display still active_deep-only.
- Lighthouse: not run in this sandbox (GA4 blocked by proxy would skew
  scores). Pages are static/SSR with system-loaded fonts, no video, no
  layout shift sources (fixed aspect media boxes); run Lighthouse on the
  Vercel preview — targets §22.

## Founder actions (in order)

1. Apply migrations in prod Supabase: pending `0013`, then `0014–0017` (if
   not yet), then **`0018_uluwatu_launch.sql`** (idempotent).
2. Merge/deploy branch; submit sitemap in Search Console.
3. Run `docs/uluwatu-30-day-launch.md` (promotion is staged even though all
   pages ship at once).
4. Field passes from `docs/uluwatu-gap-register.md` — hours confirmations,
   Labuansait house numbers, Ulu Artisan naming (flips it to published).
5. Decide the lead-delivery provider; until then manual sends only per
   `docs/uluwatu-48h-guide-versions.md`.
6. Master-doc one-liners (guardrail #11 hygiene, flagged in the audit):
   `venue_fact_sources` + `guide_leads` as internal infrastructure tables.

## Document map

| Deliverable | Where |
|---|---|
| Repository audit | `docs/uluwatu-launch-audit.md` |
| Evidence ledger + data-readiness matrix | `docs/uluwatu-evidence-ledger.md` (+ `lib/uluwatu/venues.ts`) |
| Gap register | `docs/uluwatu-gap-register.md` |
| Deferred pages backlog | `docs/uluwatu-deferred-backlog.md` |
| Social package (IG + Pinterest) | `docs/uluwatu-social-launch.md` |
| 30-day plan | `docs/uluwatu-30-day-launch.md` |
| Guide email/WhatsApp versions | `docs/uluwatu-48h-guide-versions.md` |
| This handover | `docs/uluwatu-launch-handover.md` |
