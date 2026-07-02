@AGENTS.md

# CLAUDE.md — Bali Privilege

> **Русское резюме для Селены:** этот файл читает Claude Code перед любой работой в репозитории. Здесь — правила и запреты, не архитектура. Единственный источник правды по продукту — Bali_Privilege_Master_Architecture.md. Если Claude Code предлагает что-то из списка FORBIDDEN — это ошибка, останови его.

---

## Status

**BUILD: FROZEN.**

A Phase 0 *accelerator* build already exists and is deployed (Vercel + Supabase):
curated Canggu cards, QR redemption with source-attribution, event funnel,
operator gate dashboard. It is LIVE and has recorded a real redemption. FROZEN
means: **the deployed app stays as-is and may be used to run the Phase 0 field
test, but NO new features are added until the gate passes.** Treat "no build"
from the master doc as "no *further* build" — the accelerator is grandfathered,
not extended.

Do not add features, entities, districts, or surfaces beyond what is deployed.
On gate pass, set `BUILD: UNLOCKED` and add the Phase 1A spec below the unlock log.

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
3. **No booking engine.** Reservation = `mode: none | whatsapp | request_form` only. `tablepilot` mode is reserved, NOT implemented. Only `reservation_click` event exists in MVP.
4. **No monetization outside active_deep district.** Enforce via `District.monetization_enabled` / `qr_enabled` at DB level. Outside active_deep: RouteStop allowed; Venue placement, QR, paid listing — blocked by constraints, not by convention.
5. **No tourist-side payments of any kind.** Two venue tariffs only (A: flat monthly; B: light monthly + fixed per-proven-booking fee — Tariff B gated on a real booking layer, not MVP).
6. **No paid ranking in Organic.** Sponsored is always labeled. "Best of" is editorial only.
7. **No anti-lists** ("don't order X"). Bad options are excluded by absence.
8. **Attribution rule is sacred:** partner-proof counts ONLY externally-attributed redemptions (source QR ≠ in-venue QR ≠ creator perks — three separate buckets).
9. **Privacy default:** partners see aggregates. Identifiable guest data only after explicit guest submission to that venue. GuestRef + ConsentLog required before any PII flows.
10. **No localStorage/sessionStorage** in artifacts/PWA state hacks; use proper state/DB.
11. **Scope discipline:** no new entities, districts, categories, or features beyond master doc. If a request conflicts with master — stop and flag, don't improvise.

## Guardrail reconciliations (shipped frozen build — read before touching)

The accelerator was built before this file existed. Two guardrails have known,
documented gaps in the deployed code. They are latent (no harm at current
zero-data state) and are the FIRST items to fix when `BUILD: UNLOCKED`.

- **#10 localStorage — narrow exception (allowed).** The anonymous `GuestRef`
  token and the first-touch `source` tag persist in `localStorage`
  (`lib/guest.ts`). This is device-local identity, not a state-store hack, and
  it is the only sanctioned localStorage use. Proper fix (server-set httpOnly
  cookie) is deferred to Phase 1A. Do NOT add any other localStorage usage.
- **#8 attribution — third bucket not yet enforced in the DB.** Deployed
  `record_redemption` splits external vs in-venue but does NOT yet separate the
  `creator` bucket; a `creator_*` source would currently miscount as external.
  Safe today (no creator sources exist). Fix (source_class column + creator
  bucket) is prepared in the master doc §21a#1 and must land before any creator
  perk is issued.
- **#4 coverage flags — present intent, enforcement pending.** `District` needs
  `status` / `monetization_enabled` / `qr_enabled` to make non-active districts
  technically un-monetizable. Not yet in the deployed schema. Enforce at Phase 1A.
- **Executive-rule note:** PWA shell, partner report, and an operator dashboard
  exist in the frozen build even though the master doc listed them as
  pre-Phase-0-forbidden. Grandfathered, frozen, not extended.

## Data model (canonical names — use exactly these)

Venue · VenueProductEnrollment · District · ContentPage · RouteStop · Offer/Perk · Placement · Redemption · Event · User/Role · GuestRef · ConsentLog · VenueReservationConfig
(Definitions live in master §15–16. Do not rename, do not add booleans like `is_partner` — enrollments, not flags.)

## Definition of done for any feature

- Respects coverage policy (works correctly for `planning_only` districts);
- Events wired (growth vs partner-proof metrics separated);
- English-only public strings; no lorem ipsum in tourist-facing UI;
- Mobile-first (tourist context = phone in one hand, scooter helmet in the other).

## Unlock log

- [ ] Phase 0 gate passed (redemption rate ≥15–30%, ≥3/5 venues, ≥2 willing to pay) → set `BUILD: UNLOCKED`, add Phase 1A build spec below this line.
- [ ] On unlock, first fix the three reconciliation gaps above (#10 cookie, #8 creator bucket, #4 coverage flags).
