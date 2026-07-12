@AGENTS.md

# CLAUDE.md — Bali Privilege (public brand: Other Bali)

> **Русское резюме для Селены:** этот файл читает Claude Code перед любой работой в репозитории. Здесь — правила и запреты, не архитектура. Единственный источник правды по продукту — `Bali_Privilege_Master_Architecture.md`. Если Claude Code предлагает что-то из списка FORBIDDEN — это ошибка, останови его.

> ⚠️ **Mirror note (2026-07-08):** this is the repo-authoritative `CLAUDE.md` for `parkourcafe/privelegy-bali-club`. Claude/project mirrors may copy it, but if they diverge, this repo file wins.

---

## Status

**v1 — build unlocked.** Phase 0 field test passed — recorded 2026-07-08. Current stage: **Phase 1A (Canggu Beta)** — visual/PWA upgrade and money-loop dashboard are merged into repo truth; pending production Supabase migration 0013 apply + one real seated-reservation proof. Market-test target 2026-07-20.

`BUILD: UNLOCKED`

## What this project is (2 paragraphs)

Bali Privilege (technical name) — a free trip-planning guide for Bali tourists that monetizes venues, not tourists. Tourists get curated places, routes, verified vibe tags, price anchors, and real perks (QR redemption). **Money model v0.3:** venues pay a fixed fee per confirmed seated reservation made through TablePilot with `source=bali_privilege`. The tourist never pays. Positioning: "Bali-wide planning, Canggu-deep execution" — planning content covers the island; perks, QR, money live ONLY in the active deep district (Canggu first; Ubud next, anchored to KORA food hall opening Dec 2026).

Solo founder + AI build. Speed over completeness. The single source of truth for strategy, product, data model, and roadmap is **`Bali_Privilege_Master_Architecture.md`** — read it before non-trivial decisions. This file only encodes rules the tool must never violate.

**Public brand (decided 2026-07-08):** the tourist-facing product, the domain (`otherbali.com`), and the Google Play listing use **Other Bali**. "Bali Privilege" is the internal/technical name only. Public tagline: **The right place for the moment you're in.** Note: if repo code/public copy/manifest still say Bali Privilege, the Other Bali rebrand is open P0 work unless a later commit proves it is done.

## Stack (decided — do not substitute)

- Next.js 16 App Router + React 19 + Tailwind 4 (+ CSS tokens in `app/globals.css`)
- Supabase (Postgres, RLS, SECURITY DEFINER RPCs)
- Vercel hosting
- Google Maps (navigation links), QR lib
- TablePilot = external reservation product (handoff, not an internal engine)
- WhatsApp = transactional only (pre-filled links), one platform number
- Language: **English only** in public UI. Russian only in admin/founder-facing surfaces.

## HARD GUARDRAILS (never do, even if asked casually)

1. **No scraping or republishing Google Maps reviews.** Consensus-check is a manual, internal field process. Never build a review parser/pipeline.
2. **No AI assistant / chatbot** in tourist product. Personalization = verified vibe tags + filters + routes. (AI layer is post-proof, explicit unlock required.) NB: any "Moment Builder" / "Build my day" flow must be a static/structured recommendation flow, NOT a chatbot.
3. **No internal booking engine.** BP does not build reservations; TablePilot is the external reservation product. BP marks a venue bookable via `venues.tablepilot_slug`, emits a `reservation_click` event, then hands off to `/book/<slug>?source=bali_privilege`. Seated/billable status comes from TablePilot's aggregate report (`lib/tablepilot.ts` → `/admin/phase0`), pulled with `TABLEPILOT_PARTNER_TOKEN`. WhatsApp fallback exists for non-bookable venues but is NOT the fee loop.
4. **No monetization outside active_deep district.** Enforce via District coverage flags at DB level. Outside active_deep: RouteStop/planning allowed; Venue placement, QR, paid listing — blocked by constraints, not by convention.
5. **No tourist-side payments of any kind.** Money model = v0.3 (`docs/money-model.md`): revenue = fixed fee per confirmed seated reservation via TablePilot; the billing event is NOT a QR/perk redemption. QR/perk stays a tourist incentive + independent on-premise arrival proof. Explicitly killed: paid listing products; featured/category/route sponsorship as standalone paid products; subscriptions/tiers as money model; percent-of-cheque; per-redemption billing. Any "Other Bali Credits" idea, if ever built, must be non-cash, internal-only, non-withdrawable, post-legal-review.
6. **No paid ranking in Organic.** Sponsored is always labeled. "Best of" is editorial only. `tier` is relationship stage only — NOT a paid product.
7. **No anti-lists** ("don't order X"). Bad options are excluded by absence. Reaffirmed 2026-07-08: venue "fit context" (`Best for` / `Not for` — WHO and WHEN a place suits) is allowed; dish/place quality warnings ("Mixed feedback", `DishWarning`, "don't go here") are NOT.
8. **Attribution rule is sacred:** partner-proof counts ONLY externally-attributed redemptions (external ≠ in-venue ≠ creator — three separate buckets).
9. **Privacy default:** partners see aggregates. Identifiable guest data only after explicit guest submission to that venue. GuestRef + ConsentLog required before any PII flows.
10. **No localStorage/sessionStorage** for identity or PWA state hacks; use the httpOnly guest cookie / DB.
11. **Scope discipline:** no new entities, districts, categories, or features beyond master doc. If a request conflicts with master — stop and flag, don't improvise.

## Data model (canonical names — use exactly these)

Venue · VenueProductEnrollment · District · ContentPage · RouteStop · Offer/Perk · Placement · Redemption · Event · User/Role · GuestRef · ConsentLog · VenueReservationConfig

Definitions live in master §15–16. Do not rename, do not add booleans like `is_partner` / `is_tablepilot_tenant` — the TablePilot connection rides on `VenueProductEnrollment` / `venues.tablepilot_slug`, not a flag. NB: current code types in `lib/types.ts` — `Venue`, `Perk`, `PlanEntry`, `RouteDef`, `RouteStopDef` — differ from these canonical names; reconcile before schema changes.

## Definition of done for any feature

- Respects coverage policy (works correctly for `planning_only` districts);
- Events wired (growth vs partner-proof metrics separated);
- English-only public strings; no lorem ipsum in tourist-facing UI;
- Mobile-first (tourist context = phone in one hand, scooter helmet in the other).

## Unlock log

- [x] Phase 0 gate passed (2026-07-08) → `BUILD: UNLOCKED`. Current stage: Phase 1A (Canggu Beta).
- [x] Money model reconciled to v0.3 (fee per seated reservation via TablePilot) — 2026-07-08.
- [x] TablePilot handoff is built (guardrail #3 updated from "reserved/not implemented" to the current handoff architecture) — 2026-07-08.
- [x] Master architecture doc rewrite landed as v0.4-current — PR #6, merge `1d6ba6b`, 2026-07-08.
- [x] Phase 0 money-loop dashboard + BP TablePilot aggregate reader landed — PR #7, merge `8a7ff78`, 2026-07-09.
- [x] PWA PNG manifest/icons + visual-system upgrade landed — PR #8, merge `a796aaf`, 2026-07-09.
- [x] Other Bali public rebrand + cinematic homepage redesign shipped (tourist surfaces: metadata, manifest, homepage, /me, redeem; admin QR stickers & partner invite deliberately still on the neutral label until re-printed) — 2026-07-10, `docs/redesign-2026-07.md`.
- [x] Public quality gate on `/places` (`isPublicReadyVenue`) + SEO essentials (branded OG/Twitter image, canonical, apple icon, sitemap) shipped — 2026-07-12, branch `claude/other-bali-positioning-n60hpl`.
- [x] **Trip Missions amendment adopted** (master §6a, 2026-07-12): Trip Missions, trip **duration** axis, and scenario/district landing surfaces are now product canon — implemented as **static config + the existing `ContentPage` entity** (types `scenario` / `district_guide`), NOT new DB entities. Additive nullable venue trip-fit fields (`goodWhen`, `crowdLevel`, `noiseLevel`, `rainSafe`, `bookAhead`, `transportNote`, `dressCode`, `expectedSpend`) approved pending migration. Build is unlocked for these per §6a.7.
- [x] **Uluwatu district product shipped** (2026-07-12, branch `claude/uluwatu-district-launch-jnhgwu`): `/uluwatu` pillar + 5 SEO children + `/places/[slug]` venue template + editorial PlaceCard + evidence-backed publication gate (`lib/uluwatu/venues.ts`, `lib/publication.ts`, migration 0018 — prod apply pending) + 48h lead magnet (`guide_leads`, no delivery provider yet). 24 venues published / 1 in review. Monetization/QR in Uluwatu stays OFF (planning_only; booking CTAs are verified official external links only). Docs: `docs/uluwatu-launch-handover.md`. Flag for master doc: `venue_fact_sources` + `guide_leads` internal tables need a one-line amendment note.
- [ ] Still NOT adopted — each requires its own master-doc amendment before build (guardrail #11): `Curator` / `CuratorList`, `Credits`, `DishRecommendation`, `UserPreference`, and numeric venue fit-scores (`work_score` / `romantic_score` / `quality_score` …).
