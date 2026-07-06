@AGENTS.md

# CLAUDE.md — Bali Privilege

> **Русское резюме для Селены:** этот файл читает Claude Code перед любой работой в репозитории. Здесь — правила и запреты, не архитектура. Единственный источник правды по продукту — Bali_Privilege_Master_Architecture.md. Если Claude Code предлагает что-то из списка FORBIDDEN — это ошибка, останови его.

---

## Status

**BUILD: UNLOCKED — Phase 1A (Canggu Redemption MVP).** Phase 0 gate passed
(2026-07). Order of work is fixed:

1. **First, close the three reconciliation gaps** (see section below): #8 creator
   bucket, #4 coverage flags, #10 httpOnly cookie. These are integrity, not
   features — they land before any new surface.
2. **Then Phase 1A build (density + hardening), gate-driven, still no calendar:**
   - Density readiness (master §22): ≥30 places · ≥15 perks · ≥3 routes ·
     3–4 categories (≥10 in the strongest) · ≥3–5 places wired into routes.
   - Partner report §11 "Notes": per-source breakdown (villa / coliving / reels /
     in-venue / creator); repeat redemptions.
   - Vibe filter on the execution surface (verified tags only, master §10).
3. **Still OUT of scope until their own gates:** booking engine (guardrail #3),
   AI (#2), paid tiers / billing (Phase 1.5), SEO planning pages (Phase 1B),
   second district (Phase 3), TablePilot. Do not pull these forward.

Every change still respects the HARD GUARDRAILS. Scope creep = stop and flag (#11).

## What this project is (2 paragraphs)

Bali Privilege (technical name) — a free trip-planning guide for Bali tourists that monetizes venues, not tourists. Tourists get curated places, routes, verified vibe tags, price anchors, and real perks (QR redemption). Venues pay a subscription for placement and proven guest flow. Positioning: "Bali-wide planning, Canggu-deep execution" — planning content covers the island; perks, QR, money live ONLY in the active deep district (Canggu first; Ubud next, anchored to KORA food hall opening Dec 2026).

Solo founder + AI build. Speed over completeness. The single source of truth for strategy, product, data model, and roadmap is **Bali_Privilege_Master_Architecture.md** — read it before non-trivial decisions. This file only encodes rules the tool must never violate.

## Stack (decided — do not substitute)

- Next.js + Tailwind + next-pwa
- Supabase (Postgres, Auth, Storage, RLS, Edge Functions)
- Vercel hosting
- Google Maps (navigation links), QR lib
- WhatsApp = transactional only (pre-filled links), one platform number
- Language: **English only** in public UI. Russian only in admin/founder-facing surfaces.

## HARD GUARDRAILS (never do, even if asked casually)

1. **No scraping or republishing Google Maps reviews.** Consensus-check is a manual, internal field process. Never build a review parser/pipeline.
2. **No AI assistant / chatbot** in tourist product. Personalization = verified vibe tags + filters + routes. (AI layer is post-proof, explicit unlock required.)
3. **BP builds no booking engine internally.** Reservations are handled by the external, already-deployed **TablePilot** product (`tablepilot-id.vercel.app`), integrated via a handoff link + seated-reservation report-back (`tablepilot` enrollment on the shared `Venue`). BP does not re-implement a booking engine. (Superseded 2026-07-06 — was "tablepilot mode reserved, NOT implemented"; see `docs/money-model.md`.)
4. **No monetization outside active_deep district.** Enforce via `District.monetization_enabled` / `qr_enabled` at DB level. Outside active_deep: RouteStop allowed; Venue placement, QR, paid listing — blocked by constraints, not by convention.
5. **No tourist-side payments of any kind.** Money comes ONLY from venues, ONLY as a **fixed fee per confirmed seated reservation** made through our reservation system. No listing/featured/route/category/subscription products; no % of cheque; no deposit. The perk/QR is a tourist incentive + arrival proof, NOT the billed event. (Superseded 2026-07-06 — was "two tariffs A/B"; canonical text in `docs/money-model.md`.)
6. **No paid ranking in Organic.** Sponsored is always labeled. "Best of" is editorial only.
7. **No anti-lists** ("don't order X"). Bad options are excluded by absence.
8. **Attribution rule is sacred:** partner-proof counts ONLY externally-attributed redemptions (source QR ≠ in-venue QR ≠ creator perks — three separate buckets).
9. **Privacy default:** partners see aggregates. Identifiable guest data only after explicit guest submission to that venue. GuestRef + ConsentLog required before any PII flows.
10. **No localStorage/sessionStorage** in artifacts/PWA state hacks; use proper state/DB.
11. **Scope discipline:** no new entities, districts, categories, or features beyond master doc. If a request conflicts with master — stop and flag, don't improvise.

## Guardrail reconciliations (Phase 1A — status)

- **#10 localStorage → httpOnly cookie. FIXED (code).** localStorage is gone;
  the anonymous `GuestRef` is a server-set httpOnly cookie (`middleware.ts` +
  `lib/guest-server.ts`). The client no longer holds any identity. Do NOT
  reintroduce localStorage/sessionStorage.
- **#8 attribution — creator bucket. FIXED (code); DB migration pending apply.**
  `_source_class()` splits external / in_venue / **creator**; `partner_report`
  reports creator separately and it is excluded from partner-proof. Ships in
  migration `0006_source_class_and_coverage.sql` — apply it to the DB.
- **#4 coverage flags. FIXED (code); DB migration pending apply.** `districts`
  gains `status` / `monetization_enabled` / `qr_enabled`; `record_redemption`
  refuses redemption when the district's `qr_enabled` is false. Same migration
  0006 (Canggu=active_deep enabled; Ubud=next_deep disabled).
- **Executive-rule note:** PWA shell, partner report, operator dashboard exist
  from the accelerator; grandfathered, not a template for pulling forward more.

## Data model (canonical names — use exactly these)

Venue · VenueProductEnrollment · District · ContentPage · RouteStop · Offer/Perk · Placement · Redemption · Event · User/Role · GuestRef · ConsentLog · VenueReservationConfig
(Definitions live in master §15–16. Do not rename, do not add booleans like `is_partner` — enrollments, not flags.)

## Definition of done for any feature

- Respects coverage policy (works correctly for `planning_only` districts);
- Events wired (growth vs partner-proof metrics separated);
- English-only public strings; no lorem ipsum in tourist-facing UI;
- Mobile-first (tourist context = phone in one hand, scooter helmet in the other).

## Unlock log

- [x] Phase 0 gate passed (2026-07) → `BUILD: UNLOCKED`, Phase 1A spec in Status above.
- [x] #10 httpOnly cookie (code shipped, localStorage removed).
- [x] #8 creator bucket + [x] #4 coverage flags — migration 0006 applied.
- [x] Execution surface: vibe + category filters, routes (§7/§8/§10), partner §11 Notes — code shipped (migrations 0007 routes, 0008 notes; routes fall back to seed).
- [ ] Density readiness (§22) content: ≥30 places · ≥15 perks — field work (real venues/perks), not code.
