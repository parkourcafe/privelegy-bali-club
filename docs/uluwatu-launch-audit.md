# Uluwatu launch — repository audit (2026-07-12)

> Pre-implementation audit for the Uluwatu complete-district launch.
> Scope: current state only. The implementation record lives in
> `docs/uluwatu-launch-handover.md`; the per-fact evidence ledger lives in
> `lib/uluwatu/venues.ts` (code, mirrored to `venue_fact_sources` in migration
> 0018); the gap register lives in `docs/uluwatu-gap-register.md`.

## 1. Pre-implementation lint & build status

Recorded on branch `claude/uluwatu-district-launch-jnhgwu` at `6679c57`
(before any Uluwatu work):

- `npm run lint` → exit 0, no warnings.
- `npm run build` → exit 0 (Next.js 16.2.9 production build, 10/10 static
  pages, middleware compiles). Built without Supabase env vars — the app
  serves seed data in that mode, which is also how this sandbox runs.

## 2. Existing routes (must not break)

| Route | Purpose | Notes |
|---|---|---|
| `/` | Cinematic Other Bali landing (dark espresso) | `AroundBali` section maps `DISTRICT_GUIDE`; uluwatu-bukit card links to `/places?district=uluwatu-bukit` + Google Maps |
| `/plan` | Canggu day planner (G0) | Uses `PlanView` → `VenueCard`; money-loop surface |
| `/places` | Island catalogue | `getPublishedVenues()` + `isPublicReadyVenue()` display gate; `?all=1` internal review |
| `/route/[slug]` | Curated Canggu routes | Uses `VenueCard` in a timeline |
| `/v/[venue]/redeem` | QR redemption ring (G1) | On-premise proof anchor |
| `/me` | Guest's redeemed offers | httpOnly GuestRef cookie |
| `/partner/[venue]` | Partner aggregate report | Reach/Intent/Proof |
| `/onboard/[token]` | Partner self-onboarding | Photos, JTBD, owner note |
| `/admin`, `/admin/phase0`, `/admin/invite[s]`, `/admin/qr/*` | Operator surfaces | Basic-auth via `proxy.ts` + `ADMIN_ACCESS_TOKEN` |
| `/api/redeem·source·event·dish·onboard/*` | RPC-backed writes | SECURITY DEFINER, anon key only |
| `/opengraph-image`, `/twitter-image`, `/sitemap.xml`, `/robots.txt` | SEO surfaces | Branded OG; sitemap covers `/`, `/plan`, `/places`, `/route/*` |

TablePilot attribution (`ReserveButton` → `/book/<slug>?source=bali_privilege`,
`reservation_click` event, `lib/tablepilot.ts` reader on `/admin/phase0`),
GuestRef cookies, Supabase RLS posture (no service key, RPC writes), the QR
coverage restriction (`record_redemption` rejects non-qr-enabled districts),
and the Canggu partner workflow were all located and are **not modified** by
this launch except where explicitly listed in the handover.

## 3. Reusable components

- `VenueCard` — the overloaded CRM-style card (photo/placeholder, tags, perk
  strip, owner note, order/price, actions, similar places). Kept as-is for
  `/plan` and `/route/[slug]` (Canggu money loop). Replaced on public
  catalogue/editorial surfaces by the new `PlaceCard`.
- `VenueVisual` — photo or abstract geometric `scene-*` placeholder. The
  abstract placeholder is what the brief removes from indexed cards.
- `ReserveButton` (TablePilot handoff + WhatsApp fallback), 
  `TrackedDirectionsLink` (`direction_click`), `DistrictMapLink`
  (`district_open`), `SimilarPlaces`, `Reveal`, `SiteHeader/Footer`,
  landing-only components under `components/landing/*`.
- Design system: light warm-paper editorial theme by default; `.page-dark`
  espresso scope for tourist tool pages; tokens `--paper/--ink/--brass/--ob-*`;
  Fraunces display + Geist body. New Uluwatu surfaces use the light editorial
  theme per the design brief (§11) — token-based, so components stay legible
  in both scopes.

## 4. Current Uluwatu data (migrations 0015 + 0016)

25 rows in district `uluwatu-bukit` (12 restaurants, 6 cafés, 5 beach clubs,
2 bars). Two data generations:

- **13 richer rows** (0015 second import): micro-area recorded
  (Pecatu / Ungasan), real editorial `why_its_here`, `best_for`, jobs,
  practical tags, most with `what_to_order`: single-fin, sundays-beach-club,
  white-rock-beach-club, gooseberry-french-restaurant-uluwatu, suka-espresso,
  mana-uluwatu, artisan-uluwatu, yuki-uluwatu, zali-uluwatu, el-kabron-bali,
  tropical-temptation-adult-only-beach-club, oneeighty,
  the-warung-at-alila-villas-uluwatu.
- **12 sparse rows** (0015 first import): name/category only, generic
  `Uluwatu/Bukit` area, Google-Maps *search* URLs (not pinned places). 0016
  backfilled templated one-liners ("A Uluwatu and the Bukit restaurant for…"),
  jobs and `Price band: $x` strings into `price_anchor`: alchemy-uluwatu,
  bgs-uluwatu, kala-uluwatu, laggas-uluwatu, masonry-restaurant, papi-sapi,
  seed-bingin, son-of-a-baker, ulu-artisan-ungasan, ulu-fishmarket,
  ulu-garden, waatu.

### Data completeness before this launch

| Field | Coverage |
|---|---|
| name / category / district | 25/25 (category per research import; re-verified in this launch) |
| micro-area | 13/25 (12 say only "Uluwatu/Bukit") |
| pinned Google Maps URL | ~2/25 (most are `?api=1&query=` search links) |
| editorial why_its_here | 13/25 real, 12/25 templated |
| best_for / jobs | 25/25 (research import) |
| what_to_order | 21/25 |
| price band | 25/25 (as `Price band: $x` text inside `price_anchor`) |
| photo (approved) | 0/25 |
| official website / Instagram / booking link / WhatsApp | 0/25 |
| opening hours | 0/25 |
| operating-status verification | 0/25 |
| per-fact source evidence | 0/25 |

### Duplicates / conflicts found

- `masonry-restaurant` (uluwatu-bukit) vs `mason` (canggu, whose gmaps URL
  points at "MASONRY. Restaurant Canggu") — suspected duplicate or a
  two-location brand. Resolved by web verification in this launch (see
  evidence ledger; outcome: recorded in gap register / boundary review).
- `yuki-uluwatu` vs `yuki-canggu`, `alchemy-uluwatu` vs `alchemy` (Ubud),
  `artisan-uluwatu`, `suka-espresso` (brand also in Canggu), `son-of-a-baker`
  (brand also in Berawa) — legitimate multi-location brands; the Uluwatu row
  must be pinned to the Bukit location explicitly.
- `masonry-restaurant` name collision with Canggu `mason` is the only case
  where two rows may denote one venue.

### Missing source evidence / images / links

Before this launch **no** Uluwatu fact carried source type, source URL,
verification date or status; there were no approved images (0015 deliberately
imported no photos) and no official/commercial links. This is the gap the
evidence layer (migration 0018 + `lib/uluwatu/venues.ts`) closes for the
published subset; everything else goes to the gap register.

## 5. Publication logic before this launch

`getPublishedVenues()` returns **every** venue row (research, archived,
sparse) — the DB query has no status filter at all; `isPublicReadyVenue()`
(display predicate, master §6a.5) requires only `whyItsHere` + `bestFor` + a
price/order anchor. Consequences:

- The 0016 templated one-liners made all 25 Uluwatu rows "public-ready"
  despite unverified identity/boundary/status and search-URL maps links.
- No operating-status, geography, evidence, image or link requirements.
- `status='archived'` rows would still surface if they carried the 3 fields.

Replaced in this launch by an explicit publication policy
(`lib/publication.ts` + `publication_status` column + per-fact evidence
registry) with an internal review mode preserved (`/places?all=1`).

## 6. Existing SEO surfaces

- Root layout: `metadataBase=https://otherbali.com`, title template, OG +
  Twitter (branded generated image), canonical only on `/`, `/places`, `/plan`.
- `sitemap.ts`: `/`, `/plan`, `/places`, `/route/*` only. `robots.ts`:
  disallows admin/partner/onboard/api/me/v.
- No breadcrumbs, no structured data (no JSON-LD anywhere), no venue-level
  pages, no district pages, `route/[slug]` has **no metadata export**.

## 7. Existing analytics

- GA4 `G-F3TEVWTWX4` via server-rendered gtag (`components/Analytics.tsx`),
  production-only. No custom GA4 events are fired anywhere — GA4 sees
  page_views only.
- Internal event funnel: `/api/event` → `log_event` RPC. Allowed types before
  this launch: `landing_open`, `venue_card_open`, `perk_open`,
  `direction_click`, `reservation_click`, `similar_open`, `district_open`.
  UTM/source attribution: `?s=<source>` captured by `SourceCapture` →
  `/api/source` → `set_guest_source`.
- Intended difference (documented per brief §21): the **internal** event store
  is the partner-proof/funnel system of record (Reach→Intent→Proof, Phase 0
  money gate) and must stay clean; **GA4** is the growth/acquisition view.
  New Uluwatu events are sent to both with the same names, except
  partner-proof events (redemption, reservation_click) which stay
  internal-only as before.

## 8. Systems that must not break — checklist

`/`, `/plan`, `/places`, `/route/[slug]`, `/v/[venue]/redeem`,
`/partner/[venue]`, `/onboard/[token]`, `/admin*`, TablePilot attribution,
GuestRef cookie (httpOnly, no localStorage), source attribution, Supabase RLS
(anon key + SECURITY DEFINER RPCs only), QR restrictions (guardrail #4 at DB
level), Canggu partner workflow, PWA (manifest + sw.js), GA4 install.
None of these are rewritten; verified again in QA after implementation.

## 9. Boundary decision (brief §5)

Public canonical district slug: **`uluwatu`** (URL space `/uluwatu/...`).
Internal DB slug **`uluwatu-bukit`** is preserved — changing it would break
`venues.district` FKs, coverage flags and the 0015/0016 imports. An explicit
mapping lives in `lib/uluwatu/venues.ts` (`ULUWATU_DB_SLUG` /
`ULUWATU_PUBLIC_BASE`) and is used by `/places` (`?district=uluwatu` is
normalised to `uluwatu-bukit`). No venue rows are duplicated.

Included sub-areas: Pecatu, Bingin, Padang Padang, Dreamland, Balangan,
Ungasan, Melasti, SW Bukit. Excluded: Jimbaran (own district `jimbaran`),
Nusa Dua / Benoa / ITDC (own district `nusa-dua`) — already separate in the
data, so exclusion holds structurally; per-venue boundary confirmation is
recorded in the evidence ledger.

## 10. Release scope confirmation (brief §2/§6)

Current inventory supports food / drink / sunset decisions only. No hotel,
villa, spa, gym, yoga, Pilates, attraction or surf-school rows exist for
Uluwatu → those pages are **deferred** (see
`docs/uluwatu-deferred-backlog.md`) and are not created in this release.
No venues or facts are invented to fill counts; venues that fail verification
stay in internal review (noindex).

## 11. Guardrail flags raised by this launch (for the founder)

1. **`venue_fact_sources` table** (evidence provenance) and **`guide_leads`**
   table (lead capture) are new tables. They are internal infrastructure
   (default-deny RLS, no tourist-facing product surface), added because the
   brief explicitly requires per-fact provenance and persistent lead storage.
   Guardrail #11 discipline: worth a one-line master-doc note, same as the
   island-wide districts extension was. Flagged, not improvised silently.
2. Uluwatu monetisation stays **off** (planning_only, `monetization_enabled=false`,
   `qr_enabled=false` untouched). Booking CTAs on Uluwatu venues are verified
   **official external links** (Book direct / WhatsApp / website), never
   TablePilot, never a fee loop — consistent with guardrails #3/#4 and brief §17.
3. Templated 0016 one-liners are treated as *placeholder*, not editorial
   truth; they are superseded by the curated registry copy for published
   venues and do not by themselves publish a venue.
