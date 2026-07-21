# Other Bali Repository Reality Map — 2026-07-21

## 0. Scope, snapshot, and evidence rules

This document records Phase 0 repository reality before any new source-code or test changes in the `codex/otherbali-phase0-t0-2026-07-21` branch.

| Item | Fact |
|---|---|
| Repository | `parkourcafe/privelegy-bali-club` |
| Inspected source snapshot | remote `main` at `5d62fbdd94be63e01dac8dfdcab28b2b94133fc2` |
| Production deployment tied to that SHA | Vercel deployment `dpl_3yTWNPQMzRJhhsqqkfvd6NLpaxdD`, created 2026-07-21 12:48:34 WITA, aliased to `www.otherbali.com` |
| Working branch | `codex/otherbali-phase0-t0-2026-07-21` in `/private/tmp/otherbali-phase0-source` |
| Original local checkout | initially referenced as `/Users/msnigmatullaeva/Documents/Bali vali/Бали Вали/otherbali-release`; during inspection it was found under `/Users/msnigmatullaeva/Documents/OTHER BALI_BALI VALI/Бали Вали/otherbali-release` |
| Original checkout status | inaccessible for content verification at the observed location: the checkout, including `.git/HEAD`, `package.json`, and `node_modules`, remains iCloud `compressed,dataless` |
| Runtime evidence date | 2026-07-21, Asia/Makassar (WITA) |
| Production database evidence | read-only SQL against Supabase project `bali-privilege` (`egkdapqwkfprtyqvvnso`) |

Evidence labels used below:

- **FACT** — directly observed in a file, Git object, production HTTP response, Vercel log, or read-only database query.
- **INTERPRETATION** — a product or engineering conclusion derived from one or more facts.
- **UNVERIFIED** — requires an external system, unavailable local file, or authenticated check that was not available.

No production data, deployment, migration, secret, or original local checkout was changed during Phase 0 discovery.

## 1. Authority and document availability

### 1.1 Current authority chain

**FACT.** `AGENTS.md` defines the repository authority order: `AGENTS.md` → `Other_Bali_Master_Architecture.md` → `CLAUDE.md` → focused documents → implementation and migrations. The canonical-product index also marks old Bali Privilege architecture documents as superseded.

Current documents inspected in full or for their relevant operational sections:

- `AGENTS.md`
- `Other_Bali_Master_Architecture.md`
- `CLAUDE.md`
- `README.md`
- `docs/canonical-product/README_START_HERE.md`
- `docs/canonical-product/Other_Bali_Product_Constitution_v1.1.md`
- `docs/canonical-product/PATCH_NOTES_v2.md`
- `docs/money-model.md`
- `docs/DATA_OPS_TRACK.md`
- `docs/seo-strategy.md`
- `docs/SEO_STRATEGY.md`
- `docs/seo/TECHNICAL_SEO_DISCOVERY_2026-07-18.md`
- `docs/seo/TECHNICAL_RELEASE_HANDOFF_2026-07-18.md`
- `docs/gsc-setup.md`
- `docs/audit-2026-07.md`
- `supabase/migrations/*`

### 1.2 Requested documents that are unavailable

**FACT.** These exact requested files do not exist in the current workspace materialized files or remote `main`:

- `Bali_Privilege_Master_Architecture-3.md`
- `Bali_Privilege_v0.1_Canggu.md`
- `Bali_Privilege_Master_Architecture-2.md`
- `Bali_Privilege_Master_Architecture.md`

`Bali_Privilege_Master_Architecture.md` exists only in historical documentation branches. Remote `main` contains `docs/archive/Bali_Privilege_Master_Architecture_legacy.md`, explicitly marked archived and non-authoritative. No exact document named “audit corrections V1.1” was found; the closest current evidence is `docs/audit-2026-07.md`, `docs/canonical-product/PATCH_NOTES_v2.md`, and `docs/canonical-product/Other_Bali_Product_Constitution_v1.1.md`.

**UNVERIFIED.** The dataless original checkout may contain unpushed files or a different local branch. Its parent folder was moved/renamed while the session was active, but the file placeholders remain visible at the new path. This map must be reconciled with the materialized checkout; no claim below treats the remote snapshot as proof of unpushed local state.

## 2. Stack and application shape

| Capability | Repository evidence | Reality |
|---|---|---|
| Web framework | `package.json`, `next.config.ts`, `app/` | Next.js 16.2.10 App Router |
| UI runtime | `package.json` | React 19.2.4 |
| Language | `package.json`, `tsconfig.json` | TypeScript 5 |
| Styling | `package.json`, `postcss.config.mjs`, `app/globals.css` | Tailwind CSS 4 plus project CSS |
| Data/auth | `package.json`, `lib/supabase/*`, `supabase/migrations/*` | Supabase/Postgres with server, browser, admin, RLS, and RPC boundaries |
| Hosting | `vercel.json`, production deployment metadata | Vercel |
| Mobile shell | `capacitor.config.ts`, `android/`, `ios/`, `mobile/` | Capacitor 8.4.1 for Android/iOS |
| Runtime | `package.json`, `.github/workflows/ci.yml` | Node.js 22 |
| Tests | `package.json`, `lib/**/*.test.ts`, `mobile/tests/*.test.ts`, `scripts/*.test.*` | Node test runner is the standard suite; `scripts/smoke-public-preview.mjs` provides an optional Puppeteer-based smoke path |

**INTERPRETATION.** This is one product with web, mobile-shell, public editorial, partner, admin, and data-ops surfaces. T0 should be fixed at the existing publication/rendering boundary, not by creating a second venue application.

## 3. Route inventory

Every `app/**/page.tsx` route present in the inspected snapshot is listed below: 151 page routes in total, including 11 admin pages, 7 partner/onboarding pages, and 3 development-only previews. The snapshot also contains 31 `/api/*` route handlers and 2 non-API route handlers. File paths are the route evidence.

### 3.1 Core public product routes

| Route | File | Purpose observed |
|---|---|---|
| `/` | `app/page.tsx` | product promise and planning/discovery entry |
| `/places` | `app/places/page.tsx` | filterable venue discovery |
| `/places/[slug]` | `app/places/[slug]/page.tsx` | public venue detail |
| `/plan` | `app/plan/page.tsx` | Canggu-oriented plan slots |
| `/plan/shared` | `app/plan/shared/page.tsx` | query-backed shared plan summary |
| `/my-day` | `app/my-day/page.tsx` | location-aware day builder |
| `/route/[slug]` | `app/route/[slug]/page.tsx` | curated route and ordered stops |
| `/me` | `app/me/page.tsx` | anonymous saved venues and redemption state |
| `/list/[slug]` | `app/list/[slug]/page.tsx` | read-only shared saved-list snapshot |
| `/collections` | `app/collections/page.tsx` | editorial collection index |
| `/collections/[taste]` | `app/collections/[taste]/page.tsx` | collection detail |
| `/guides` | `app/guides/page.tsx` | planning/editorial guide index |
| `/for-venues` | `app/for-venues/page.tsx` | venue-facing product explanation |
| `/list-your-property` | `app/list-your-property/page.tsx` | property submission |
| `/hotels` | `app/hotels/page.tsx` | hotel/resort partner and barter acquisition |
| `/villas` | `app/villas/page.tsx` | villa partner and barter acquisition |
| `/review` | `app/review/page.tsx` | noindex App Store review landing |
| `/support` | `app/support/page.tsx` | support information |
| `/privacy` | `app/privacy/page.tsx` | privacy policy |
| `/privacy/choices` | `app/privacy/choices/page.tsx` | privacy controls |
| `/terms` | `app/terms/page.tsx` | terms |
| `/v/[venue]/redeem` | `app/v/[venue]/redeem/page.tsx` | signed QR/perk redemption |

### 3.2 Dynamic Bali discovery and SEO families

| Route | File |
|---|---|
| `/bali` | `app/bali/page.tsx` |
| `/bali/[district]` | `app/bali/[district]/page.tsx` |
| `/bali/[district]/[intent]` | `app/bali/[district]/[intent]/page.tsx` |
| `/brunches/[slug]` | `app/brunches/[slug]/page.tsx` |
| `/day-passes/[slug]` | `app/day-passes/[slug]/page.tsx` |

### 3.3 Bali-wide planning/editorial routes

| Routes | Files |
|---|---|
| `/bali-day-trips`, `/bali-for-a-month`, `/bali-for-digital-nomads`, `/bali-free-beach-clubs` | `app/bali-day-trips/page.tsx`, `app/bali-for-a-month/page.tsx`, `app/bali-for-digital-nomads/page.tsx`, `app/bali-free-beach-clubs/page.tsx` |
| `/bali-hotel-brunches`, `/bali-itinerary-7-days`, `/bali-itinerary-10-days`, `/bali-on-a-budget` | `app/bali-hotel-brunches/page.tsx`, `app/bali-itinerary-7-days/page.tsx`, `app/bali-itinerary-10-days/page.tsx`, `app/bali-on-a-budget/page.tsx` |
| `/bali-rainy-day`, `/bali-resort-day-passes`, `/bali-retreat-reset`, `/bali-sunset-clubs` | `app/bali-rainy-day/page.tsx`, `app/bali-resort-day-passes/page.tsx`, `app/bali-retreat-reset/page.tsx`, `app/bali-sunset-clubs/page.tsx` |
| `/bali-temples-which-one`, `/bali-travel-guide`, `/bali-with-kids` | `app/bali-temples-which-one/page.tsx`, `app/bali-travel-guide/page.tsx`, `app/bali-with-kids/page.tsx` |
| `/best-area-to-stay-in-bali-for-couples`, `/best-area-to-stay-in-bali-for-families` | matching `app/*/page.tsx` files |
| `/best-beach-clubs-in-bali`, `/best-cafes-in-bali`, `/best-coffee-in-bali`, `/best-restaurants-in-bali`, `/best-spas-in-bali`, `/best-warungs-in-bali` | matching `app/best-*/page.tsx` files |
| `/best-time-to-visit-bali`, `/first-time-in-bali`, `/how-many-days-in-bali`, `/how-to-get-around-bali`, `/is-bali-safe` | matching `app/*/page.tsx` files |
| `/east-bali-temples-water-palaces`, `/mount-batur-sunrise-jeep-hot-spring`, `/nusa-penida-day-trip` | matching `app/*/page.tsx` files |
| `/romantic-bali`, `/things-to-do-in-bali`, `/where-to-stay-in-bali`, `/where-to-watch-sunset-in-bali` | matching `app/*/page.tsx` files |
| `/canggu-first-day`, `/canggu-vs-uluwatu`, `/seminyak-vs-canggu`, `/sanur-or-nusa-dua`, `/ubud-vs-canggu` | matching `app/*/page.tsx` files |
| `/ubud-culture-rice-terraces-waterfalls`, `/ubud-one-day`, `/uluwatu-sunset-kecak`, `/jimbaran-seafood` | matching `app/*/page.tsx` files |
| `/hotel-restaurants` | `app/hotel-restaurants/page.tsx` |

### 3.4 District route trees

| District | Routes | Evidence root |
|---|---|---|
| Canggu | `/canggu`, `/canggu/beach-club-day-passes`, `/canggu/beach-clubs-sunset`, `/canggu/best-brunch`, `/canggu/best-restaurants`, `/canggu/best-spas`, `/canggu/best-warungs`, `/canggu/work-friendly-cafes` | `app/canggu/**/page.tsx` |
| Jimbaran | `/jimbaran`, `/jimbaran/best-restaurants`, `/jimbaran/hotel-brunches`, `/jimbaran/resort-day-passes`, `/jimbaran/spas-wellness`, `/jimbaran/sunset-seafood`, `/jimbaran/things-to-do` | `app/jimbaran/**/page.tsx` |
| Nusa Dua | `/nusa-dua`, `/nusa-dua/best-restaurants`, `/nusa-dua/hotel-brunches`, `/nusa-dua/hotel-restaurants`, `/nusa-dua/resort-day-passes`, `/nusa-dua/spas-wellness`, `/nusa-dua/things-to-do` | `app/nusa-dua/**/page.tsx` |
| Sanur | `/sanur`, `/sanur/best-hotels`, `/sanur/best-restaurants`, `/sanur/cafes-and-bars`, `/sanur/hotel-brunches`, `/sanur/resort-day-passes`, `/sanur/spas-wellness`, `/sanur/things-to-do` | `app/sanur/**/page.tsx` |
| Seminyak | `/seminyak`, `/seminyak/beach-club-day-passes`, `/seminyak/beach-clubs-sunset`, `/seminyak/best-restaurants`, `/seminyak/cafes-coffee`, `/seminyak/hotel-brunches`, `/seminyak/spas-salons-wellness` | `app/seminyak/**/page.tsx` |
| Ubud | `/ubud`, `/ubud/best-cafes-coffee`, `/ubud/best-restaurants`, `/ubud/best-warungs`, `/ubud/best-yoga-wellness`, `/ubud/hotel-brunches`, `/ubud/itinerary`, `/ubud/jungle-pool-day-passes`, `/ubud/things-to-do` | `app/ubud/**/page.tsx` |
| Uluwatu | `/uluwatu`, `/uluwatu/48-hours`, `/uluwatu/beach-clubs-sunset`, `/uluwatu/best-brunch`, `/uluwatu/best-restaurants`, `/uluwatu/date-night-restaurants`, `/uluwatu/resort-pool-day-passes` | `app/uluwatu/**/page.tsx` |
| Other district pillars | `/amed`, `/lovina`, `/munduk`, `/nusa-penida`, `/sidemen` | `app/amed/page.tsx`, `app/lovina/page.tsx`, `app/munduk/page.tsx`, `app/nusa-penida/page.tsx`, `app/sidemen/page.tsx` |

### 3.5 Admin routes

| Route | File | Access evidence |
|---|---|---|
| `/admin` | `app/admin/page.tsx` | guarded by `app/admin/layout.tsx` and `isCurrentAdminRequestAuthorized()` |
| `/admin/coverage` | `app/admin/coverage/page.tsx` | same admin layout |
| `/admin/freshness` | `app/admin/freshness/page.tsx` | same admin layout |
| `/admin/invite/[venue]` | `app/admin/invite/[venue]/page.tsx` | same admin layout |
| `/admin/invites` | `app/admin/invites/page.tsx` | same admin layout |
| `/admin/phase0` | `app/admin/phase0/page.tsx` | same admin layout |
| `/admin/photos` | `app/admin/photos/page.tsx` | same admin layout |
| `/admin/profile-drafts` | `app/admin/profile-drafts/page.tsx` | same admin layout |
| `/admin/qr/[venue]` | `app/admin/qr/[venue]/page.tsx` | same admin layout |
| `/admin/qr/source/[source]` | `app/admin/qr/source/[source]/page.tsx` | same admin layout |
| `/admin/submissions` | `app/admin/submissions/page.tsx` | same admin layout |

### 3.6 Partner and onboarding routes

| Route | File | Reality |
|---|---|---|
| `/partner` | `app/partner/page.tsx` | authenticated partner entry |
| `/partner/sign-in` | `app/partner/sign-in/page.tsx` | Supabase OTP sign-in |
| `/partner/claim/[token]` | `app/partner/claim/[token]/page.tsx` | claim-token flow |
| `/partner/venues/[venue]` | `app/partner/venues/[venue]/page.tsx` | partner venue dashboard |
| `/partner/venues/[venue]/[section]` | `app/partner/venues/[venue]/[section]/page.tsx` | section editor/workflow |
| `/partner/[venue]` | `app/partner/[venue]/page.tsx` | legacy operator-only dashboard; protected by admin authorization |
| `/onboard/[token]` | `app/onboard/[token]/page.tsx` | tokenized venue onboarding |

### 3.7 Development-only page routes present in source

- `/dev/hotel-preview` — `app/dev/hotel-preview/page.tsx`
- `/dev/restaurant-grouping-preview` — `app/dev/restaurant-grouping-preview/page.tsx`
- `/dev/route-preview` — `app/dev/route-preview/page.tsx`

Each preview calls `notFound()` unless `NODE_ENV === "development"`. They are source-visible development tools, not production tourist entries.

### 3.8 API routes

| Area | Routes and exact files |
|---|---|
| Admin data ops | `/api/admin/data-ops-import` — `app/api/admin/data-ops-import/route.ts` |
| Health and telemetry | `/api/health/live`, `/api/health/ready`, `/api/event`, `/api/csp-report` — matching `app/api/**/route.ts` files |
| Save/share | `/api/save` — `app/api/save/route.ts`; `/api/list` — `app/api/list/route.ts` |
| Public data/actions | `/api/dish`, `/api/source`, `/api/public/menu-section`, `/api/venue-photo/[id]` — matching files under `app/api/` |
| Property submission/media | `/api/venue-submission`, `/api/list-your-property/media/create-upload`, `/api/list-your-property/media/finalize` — matching files under `app/api/` |
| Mobile API | `/api/mobile/v1/bootstrap`, `/api/mobile/v1/config`, `/api/mobile/v1/routes`, `/api/mobile/v1/routes/[slug]`, `/api/mobile/v1/venues`, `/api/mobile/v1/venues/[slug]` — `app/api/mobile/v1/**/route.ts` |
| Onboarding | `/api/onboard/confirm`, `/api/onboard/draft`, `/api/onboard/jtbd`, `/api/onboard/photo`, `/api/onboard/profile` — `app/api/onboard/**/route.ts` |
| Partner drafts | `/api/partner/action-draft`, `/api/partner/menu-draft`, `/api/partner/photos` — `app/api/partner/**/route.ts` |
| Privacy | `/api/privacy/forget` — `app/api/privacy/forget/route.ts` |
| Redemption | `/api/redeem` — `app/api/redeem/route.ts` |
| Lead capture | `/api/guide-lead` — `app/api/guide-lead/route.ts` |

### 3.9 Non-API handlers and generated crawler endpoints

| Route | Evidence | Reality |
|---|---|---|
| `/auth/callback` | `app/auth/callback/route.ts` | Supabase auth-code exchange; validated same-origin continuation or partner sign-in error redirect |
| `/llms.txt` | `app/llms.txt/route.ts` | machine-readable product/site description |
| `/robots.txt` | `app/robots.ts` | generated crawler policy |
| `/sitemap.xml` | `app/sitemap.ts` | generated URL inventory |
| generated social/icon assets | `app/favicon.ico`, `app/icon.svg`, `app/opengraph-image.tsx`, `app/twitter-image.tsx` | App Router metadata assets |

Static public endpoints outside the App Router inventory:

| Route | File | Purpose |
|---|---|---|
| `/.well-known/apple-app-site-association` | `public/.well-known/apple-app-site-association` | iOS universal-link association |
| `/.well-known/assetlinks.json` | `public/.well-known/assetlinks.json` | Android app-link association |
| `/manifest.webmanifest` | `public/manifest.webmanifest` | install metadata |
| `/sw.js` | `public/sw.js` | current service-worker kill switch |
| `/google701d47690a232c57.html` | `public/google701d47690a232c57.html` | Google ownership verification file |

### 3.10 Permanent redirects and host aliases

`next.config.ts` defines permanent redirects for:

| Source | Destination |
|---|---|
| apex `otherbali.com/:path*` | `https://www.otherbali.com/:path*` |
| `/bali-without-scooter` | `/how-to-get-around-bali` |
| `/local-food-in-bali` | `/best-warungs-in-bali` |
| `/beach-clubs-by-mood` | `/best-beach-clubs-in-bali` |
| `/uluwatu-sunset` | `/where-to-watch-sunset-in-bali` |
| `/canggu-or-ubud`, `/ubud-or-canggu` | `/ubud-vs-canggu` |
| `/seminyak-or-canggu` | `/seminyak-vs-canggu` |
| `/uluwatu-or-canggu` | `/canggu-vs-uluwatu` |
| `/privacy-policy` | `/privacy` |
| `/terms-of-service` | `/terms` |
| `/cookie-policy` | `/privacy` |

`proxy.ts` additionally redirects production `*.vercel.app` hostnames to `https://www.otherbali.com` while preserving the parsed path/query. No `rewrites()` configuration exists in `next.config.ts`.

## 4. Product mechanisms actually present

### 4.1 Planning, route, Save, and shared plan

| Mechanism | Repository facts | Interpretation |
|---|---|---|
| Planning entry | `app/page.tsx` uses `components/DayIntentBuilder.tsx`; links feed `/places` discovery queries | planning already exists and must be extended, not replaced |
| Plan page | `app/plan/page.tsx` models Canggu-oriented plan slots | useful planning UI, not a general day-based itinerary data model |
| My Day | `app/my-day/page.tsx` uses curated collections and location context | existing execution loop |
| Curated routes | `app/route/[slug]/page.tsx`, route reads in `lib/data.ts`, `routes`/`route_stops` migrations | route engine exists; T10 should use it |
| Anonymous Save | `components/SaveButton.tsx`, `app/api/save/route.ts`, `lib/guest-server.ts` | Save works through an HTTP-only guest reference without early registration |
| Saved state | `app/me/page.tsx`, saved-venue reads in `lib/data.ts` | saved venues are visible, but account merge/restore is not evident |
| Shared list | `components/ShareButton.tsx`, `app/api/list/route.ts`, `app/list/[slug]/page.tsx` | persisted read-only list snapshot exists |
| Shared plan | `app/plan/shared/page.tsx` | query-backed mobile summary is separate from persisted list sharing |
| Add to trip | no day/reorder itinerary persistence model found in Save/List routes or migrations | **INTERPRETATION:** T9 is a confirmed gap, but should extend Save rather than create a parallel bookmarking store |

### 4.2 Venue detail and publication/indexability gates

| Boundary | Repository evidence | Fact |
|---|---|---|
| Base publication status | `lib/publication.ts`, `lib/data.ts` | public venue candidates require `status='active'` and `publication_status='published'` |
| Editorial predicate | `lib/publication.ts` | non-registry venues require non-empty `whyItsHere` and `bestFor`; Uluwatu registry publication state can override the editorial predicate |
| Structural validation | `lib/venue-validation.ts` | slug/name/district/category must pass application validation |
| Detail-route gate | `app/places/[slug]/page.tsx` | a non-indexable venue resolves to 404/noindex rather than a thin indexed page |
| Rendering mode | `app/places/[slug]/page.tsx` | current route declares `dynamic = 'force-dynamic'` |
| Metadata | `app/places/[slug]/page.tsx` | indexable details get a clean self canonical and `index, follow`; rejected entries receive noindex/404 behavior |
| Sitemap | `app/sitemap.ts` | venue URLs pass `isVenueIndexable`; sitemap uses hourly revalidation |
| Robots | `app/robots.ts`, `proxy.ts` | tourist surfaces are allowed in production; admin/partner/onboard/API/private surfaces are disallowed or noindexed |
| Canonical origin | `app/layout.tsx`, `proxy.ts` | canonical production origin is `https://www.otherbali.com`; host/protocol redirects consolidate to it |

**INTERPRETATION.** The code gate is narrower than the full architecture rule in `Other_Bali_Master_Architecture.md`, which also asks for offering/source/verification completeness. The T0 rule is to preserve the current gate while documenting this gap; weakening it to inflate index counts is prohibited.

### 4.3 Venue card data and decision content

`app/places/[slug]/page.tsx`, `lib/data.ts`, and related domain types conditionally render or expose `whyItsHere`, `bestFor`, `notFor`, `whatToOrder`, price information, practical notes, actions, menu summaries, and verification/freshness data. Empty values are generally not intended as headings. However, the repository does not consistently prove that `whatToOrder` is backed by a verified menu/source or that every venue-level verification date is shown. Those are T3/T4 gaps, not T0 fixes.

### 4.4 PWA and mobile infrastructure

| Fact | Evidence |
|---|---|
| Web manifest exists | `public/manifest.webmanifest` |
| Registration component exists | `app/ServiceWorkerRegister.tsx` |
| Current web service worker is a kill switch that clears caches and unregisters itself | `public/sw.js` |
| Native shells exist | `capacitor.config.ts`, `android/`, `ios/`, `mobile/` |
| Mobile API boundary exists | `app/api/mobile/v1/**/route.ts` |

**INTERPRETATION.** The product has install/native infrastructure but no active offline web cache. T7 must verify PWA navigation without assuming offline behavior exists.

### 4.5 Analytics events

**FACT.** `lib/actions/event-safety.ts` defines the exact internal event allowlist:

`landing_open`, `venue_card_open`, `perk_open`, `direction_click`, `reservation_click`, `similar_open`, `district_open`, `district_page_view`, `editorial_page_view`, `venue_detail_view`, `venue_card_click`, `booking_click`, `official_website_click`, `instagram_click`, `menu_click`, `partner_offer_click`, `guide_form_started`, `guide_form_submitted`, `whatsapp_guide_click`, `internal_guide_click`, `menu_open`, `menu_item_open`, `action_handoff`, `delivery_click`, `takeaway_click`, and `preorder_click`.

**FACT.** `app/api/event/route.ts` validates event shapes and skips storage unless the consent cookie is `granted`; it does not mint an analytics guest reference before consent. `components/Analytics.tsx` additionally loads GA only when `VERCEL_ENV === "production"` and `NEXT_PUBLIC_ENABLE_ANALYTICS === "1"`; `AnalyticsClient` retains the client-side consent gate. Thus internal event storage and GA script loading are separate, gated paths.

**FACT.** Dedicated Save, shared-list, and route-addition events were not found in this boundary.

**INTERPRETATION.** The measurement base is reusable; T2/T9 should add events to it rather than introduce another analytics sink.

### 4.6 Perk, QR, and redemption flow

| Capability | Evidence |
|---|---|
| QR generation and source attribution | `app/admin/qr/[venue]/page.tsx`, `app/admin/qr/source/[source]/page.tsx` |
| Signed redemption token | `lib/redemption-token.ts` |
| Visitor redemption UI | `app/v/[venue]/redeem/page.tsx` |
| Redemption mutation | `app/api/redeem/route.ts` |
| Partner/operator outcome view | `app/partner/[venue]/page.tsx`, `app/partner/venues/[venue]/**` |
| Active-deep district gate | current architecture and operational code constrain commercial depth to Canggu |

**INTERPRETATION.** Canggu-deep execution is already materially present. It should be preserved while Bali-wide public venue cards remain valid.

### 4.7 Staged-candidates/data-ops pipeline

| Pipeline part | Evidence | Reality |
|---|---|---|
| Batch inputs and generated artifacts | `data/data-ops/batches/*` | existing staged batch structure |
| Compiler | `scripts/data-ops-compiler-core.mjs`, `scripts/compile-data-ops.mjs` | normalizes and compiles draft candidates |
| Import boundary | `scripts/data-ops-import-core.mjs`, `scripts/import-data-ops.mjs`, `app/api/admin/data-ops-import/route.ts` | apply path is staging/admin controlled |
| Existing KORA leads | `data/data-ops/kora-leads/*` | precedent for candidate research and matching |
| Publication guard | compiler/import fields and checks | generated records are marked `readyForPublish:false` and `forbiddenToPublish:true`; production project import is blocked |
| Chope data | repository-wide search | no Chope-607 source or mapping exists in inspected `main` |

**FACT.** The current KORA candidate shape does not implement all required separate axes (`publication_status`, `verification_status`, `editorial_status`, `seo_status`, `partner_status`, `photo_permission_status`) or the full requested identity/dedup evidence. Some artifacts contain both a positive-sounding ready flag and a publication prohibition.

**INTERPRETATION.** Chope should extend this pipeline with explicit axes and stronger dedup, not create a parallel importer. `import_ready` must remain distinct from `publish_ready`; no Chope row may auto-publish.

### 4.8 Actual money model

**FACT.** `docs/money-model.md`, `README.md`, `app/page.tsx`, `app/plan/page.tsx`, `components/SiteFooter.tsx`, and `app/for-venues/page.tsx` describe a fixed fee per confirmed seated TablePilot reservation and reject paid ranking/featured placement.

**FACT.** The principal’s current task freezes all paid placement, billing, sponsored inventory, and user-facing paid offers until 2026-09-21. Existing commercial entities are to remain inactive, with status `reserved — monetization decision pending after 2-month pilot`.

**INTERPRETATION.** The task-specific freeze is the winning rule. Existing public fee copy is a documented conflict for T6/content hygiene; it is not part of T0 and is not changed in this phase.

## 5. Architecture conflict register

| statement | source_document | repository_evidence | status | winning_rule | required_action |
|---|---|---|---|---|---|
| Old `Bali_Privilege_*` files are the current product architecture | historical file names in the brief | `docs/canonical-product/README_START_HERE.md`; `docs/archive/Bali_Privilege_Master_Architecture_legacy.md` | obsolete | `AGENTS.md` → `Other_Bali_Master_Architecture.md` | retain missing-file disclosure; do not implement from archived rules |
| Full venue pages are allowed only in Canggu | archived Bali Privilege model | `Other_Bali_Master_Architecture.md`; `app/places/[slug]/page.tsx`; Bali-wide sitemap/live pages | contradicted | Bali-wide verified cards plus Canggu active-deep | preserve full cards outside Canggu |
| “Canggu-first” means Canggu-only coverage | `docs/canonical-product/Other_Bali_Product_Constitution_v1.1.md` | current master separates Bali-wide planning from Canggu operational depth | partially_confirmed | interpret “first” as depth and rollout order | keep Canggu as first active-deep district without deleting Bali-wide coverage |
| Paid tiers, Featured Partner, or sponsored placement may launch now | historical commercial appendix | `docs/money-model.md`; current task freeze | obsolete | task freeze through 2026-09-21 | leave commercial entities inactive; no paid ordering or user-facing paid offer |
| Current publication code fully implements the written decision-ready rule | `Other_Bali_Master_Architecture.md`; `docs/SEO_STRATEGY.md` | `lib/publication.ts`, `lib/venue-validation.ts`, `app/sitemap.ts` check fewer content/source fields | partially_confirmed | do not weaken current gate during T0; reconcile deliberately later | create an explicit publication-policy test/spec before widening the predicate |
| Canonical venue path should be `/place/[slug]` | `docs/seo-strategy.md` | actual route is `app/places/[slug]/page.tsx`; live canonicals use `/places/[slug]` | obsolete | repository route and current canonical behavior | do not create a parallel route family; later mark the proposal obsolete |
| Photos may be published only after explicit consent | `docs/DATA_OPS_TRACK.md` | `AGENTS.md` contains a narrow interim pre-launch exception | partially_confirmed | task-specific Chope rule is stricter | never publish Chope photos without documented rights |
| There is one canonical SEO strategy document | documentation naming | both `docs/seo-strategy.md` and `docs/SEO_STRATEGY.md` exist and differ | needs_verification | code and higher authority control current behavior | nominate/merge a canonical SEO source in a later documentation task |
| Only Uluwatu venue details are indexable | `docs/gsc-setup.md` | `lib/publication.ts`, `app/sitemap.ts`, production sitemap and live pages are Bali-wide | obsolete | Bali-wide decision-ready indexation | update GSC documentation after T0 |
| Sitemap is generated on every request | `docs/gsc-setup.md` | `app/sitemap.ts` declares hourly revalidation | obsolete | code is authoritative for runtime | correct documentation after T0 |
| GA4 is currently live | `docs/gsc-setup.md` | `components/Analytics.tsx` only proves disabled-by-default, production-env-gated loading; `app/api/event/route.ts` separately gates internal events on consent | needs_verification | runtime/deployment environment is authoritative | inspect the production flag and browser network state before claiming GA4 is live |
| Venue-facing copy may advertise current per-seated-guest fees | `README.md`, `docs/money-model.md`, current public components | current principal freeze explicitly forbids paid offers until 2026-09-21 | contradicted | principal’s dated freeze | change public copy in T6 only after T0 closes |
| `source found` is equivalent to import-ready or publish-ready | possible legacy data-ops interpretation | compiler/import guards in `scripts/data-ops-*`; current Chope brief | contradicted | separate source, import, publication, editorial, SEO, partner, and photo states | extend KORA pipeline with independent status axes and dry-run only |
| “Open now” can be inferred from prose or a booking button | no valid current authority | no verified structured-hours engine satisfying timezone/overnight/holiday/freshness requirements | contradicted | current verified-hours rule | use editorial moment matching only; do not claim “Open now” |

## 6. T0–T10 implementation reality at Phase 0

No T1–T10 changes are authorized until T0 is fully documented and verified.

| Task | Status before this branch | Repository evidence | Verified gap / next boundary |
|---|---|---|---|
| T0 Indexability | **fix present; closure incomplete** | `app/places/[slug]/page.tsx`; commits `0b33cc0`, `5d62fbd`; Vercel production logs; `app/sitemap.ts` | root cause and live recovery are now evidenced, but diagnosis/report/regression/GSC artifacts are not yet complete |
| T1 Home | **partial** | `app/page.tsx`, `components/DayIntentBuilder.tsx` | promise/planning exist; the exact six scenario entrances and hierarchy require a later verified-gap pass |
| T2 Save | **partial** | `components/SaveButton.tsx`, `app/api/save/route.ts`, `lib/guest-server.ts`, `app/me/page.tsx` | anonymous Save exists; login recovery/account merge and end-to-end state guarantees are not proven |
| T3 Venue completeness | **partial** | `app/places/[slug]/page.tsx`, `lib/data.ts`, venue types | conditional fields exist; verified-menu/source binding and verification-date presentation need validation |
| T4 QuickDecision | **partial** | quick-read sections in `app/places/[slug]/page.tsx` | not all required decision fields form one compact evidence-safe component |
| T5 Start your shortlist | **missing as specified** | no matching five-page pilot component/flow found | create only after T0 and page analytics baseline |
| T6 `/for-venues` | **partial/conflicted** | `app/for-venues/page.tsx`, partner/onboard routes | page exists; copy conflicts with monetization freeze and required assurance language |
| T7 Hygiene | **needs verification** | route tree, metadata, error/loading states | 12 broken links were observed on live `/bali/kuta-legian`; full mobile/a11y/link pass not done |
| T8 Canggu Now | **missing as specified** | `app/canggu/page.tsx` | Canggu pillar exists; requested scenario grid, Saved/My perks entry, and Near-me fallback are absent |
| T9 Add to trip | **missing** | Save/List/Plan code has no day/reorder itinerary model | extend Save and route stops; do not build booking engine |
| T10 Plan navigation/content | **partial** | `lib/navigation.ts`; existing 7/10-day and district routes | Plan entry and route engine exist; requested 3/5-day and Canggu route content needs a duplicate check and editorial work |

## 7. T0 reality summary before diagnosis report

### 7.1 Proven production counters

Read-only production SQL on 2026-07-21 WITA returned:

| Counter | Value | Definition |
|---|---:|---|
| `total_venue_records` | 800 | all rows in `public.venues` |
| `published_venue_records` | 595 | `status='active' AND publication_status='published'` |
| raw decision-ready rows | 519 | published rows with non-empty `why_its_here` and `best_for` |
| route-level `index,follow` predicate | 518 | current `getVenueWithPerk()` + `isVenueIndexable()` behavior after the one Uluwatu registry review override |
| sitemap-eligible venue records | 517 | route predicate plus the structural/category filtering applied by `getPublishedVenues()` before `app/sitemap.ts` |

The 519-to-518 difference is one Uluwatu registry entry whose registry publication state is `review`. The further 518-to-517 difference is `big-dragon-villas-ubud`, whose database category is `villa`, outside the current `VenueCategory`/structural allowlist. The detail fetch does not apply that structural guard: live `/places/big-dragon-villas-ubud` returns HTTP 200 with `index, follow` and a self canonical, while the list/sitemap path drops it. The live sitemap contains exactly 517 unique `/places/*` URLs.

**FACT.** The brief asks for `indexable_venue_records`, but the repository currently has two different indexability results. Reporting only 517 would hide this gate mismatch. T0 must align the route and sitemap without deleting the valid full card merely because it is outside Canggu.

Limitations: counts are point-in-time production results; they do not prove future freshness or GSC index membership. Table estimates were not used as counts.

### 7.2 Proven prior failure and current recovery

**FACT.** Before the current production deployment, two production deployments served `/places/*` as prerendered/ISR output. A capped Vercel query returned at least 500 HTTP 500 entries across 36 venue paths. Every sampled failure had `DYNAMIC_SERVER_USAGE`, cold cache `MISS` behavior. The intermediate deployment that added secondary-read fallbacks still produced the same failures.

**FACT.** In the failing source, `app/places/[slug]/page.tsx` used `revalidate = 300` and empty `generateStaticParams()`. `app/layout.tsx` calls `getLocale()`, and `lib/i18n/server.ts` calls request-bound `headers()`. The final source declares `dynamic = 'force-dynamic'` and removes the empty static-params path.

**FACT.** The final deployment is tied to source SHA `5d62fbdd94be63e01dac8dfdcab28b2b94133fc2`. After it reached production, the equivalent Vercel 500 query returned zero `/places/*` failures in the checked window.

**INTERPRETATION.** The demonstrated root cause is a rendering-mode conflict: on-demand ISR attempted to prerender a route whose root locale path requires request headers. Cold misses therefore failed with `DYNAMIC_SERVER_USAGE`. Request rendering is the already-deployed, narrowly scoped recovery. Secondary read resilience is useful but was not sufficient to recover the route.

### 7.3 Current production HTTP verification

On 2026-07-21, a stratified 12-page sample covering Canggu and other districts, categories, ages, and action types produced:

- HTTP 200 for browser, generic crawler, and Googlebot Smartphone;
- byte-for-byte identical server HTML across all three user agents per URL;
- a useful server-rendered H1 and primary content;
- `index, follow` with no `X-Robots-Tag` conflict;
- self-referencing canonical;
- inclusion in the 517-venue sitemap.
- at least one server-rendered inbound link from the 150 non-venue sitemap URLs crawled for internal-link evidence.

The sample slugs were:

`monkey-bar-bali`, `desa-wisata-penglipuran`, `amo-spa-canggu-canggu`, `atlas-beach-club`, `baked-pererenan`, `donna-ubud`, `pantai-lovina`, `nusa-dua-beach-grill`, `crumb-and-coaster-kuta`, `alchemy-uluwatu`, `koa-shala-sanur`, and `kilo-kitchen-bali-seminyak`.

The published-but-not-decision-ready negative control `/places/adda-yoga` returned the same 404/noindex HTML to all three user agents and is absent from the sitemap. This confirms that recovery did not weaken the publication gate.

Production `robots.txt` returns 200 and does not disallow `/places`. The XML sitemap returns 200 with 667 unique locations, including 517 unique venue details. HTTP→HTTPS, apex→`www`, and trailing-slash normalization return 308. Query-string variants retain HTTP 200 but canonicalize to the clean path. Confirmed inbound sources include `/places` for the broad sample, district/category guides for the targeted sample, and `/bali/kuta-legian` for `crumb-and-coaster-kuta`; exact per-slug sources are retained in `OTHERBALI_T0_INDEXABILITY_DIAGNOSIS.md`.

### 7.4 Items not yet proven at this checkpoint

- **UNVERIFIED:** authenticated Google Search Console Live URL Test. HTTP recovery is not a claim that Google has indexed every eligible page.
- A source-contract regression already exists in `scripts/performance-boundary.test.mjs`, and focused SEO unit tests exist in `lib/seo/`; comprehensive route integration and three-user-agent regression coverage plus the final T0 report have not yet been added at this Phase 0 checkpoint.
- The original dataless local checkout has not yet been reconciled with the remote snapshot.
- The 12 broken live links from `/bali/kuta-legian` are a confirmed T7 hygiene issue, not the T0 root cause; they remain deliberately untouched in this phase.

## 8. Phase 0 verdict and next authorized action

**FACT.** The repository already contains and production already runs the narrow source fix that recovered venue-detail rendering. No second speculative rendering fix is justified. One additional proven consistency gap remains: the route considers 518 records indexable while the sitemap/list boundary admits 517.

**INTERPRETATION.** The next authorized work is to:

1. write `OTHERBALI_T0_INDEXABILITY_DIAGNOSIS.md` with the historical/runtime causal proof;
2. align the proven 518-route/517-sitemap gate mismatch while preserving the full Ubud property card;
3. add regression coverage for publication rules, detail rendering contracts, three-user-agent equivalence, sitemap, canonical, and a negative noindex control;
4. run the relevant existing suite, typecheck, lint, and production build while separating pre-existing failures;
5. write `OTHERBALI_T0_VERIFICATION_REPORT.md`, explicitly marking GSC Live URL Test as pending unless authenticated evidence becomes available;
6. keep T1–T10 and Chope implementation out of the T0 commits.
