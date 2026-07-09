# Session handoff — Bali Privilege / Other Bali (2026-07-09)

Everything a fresh session needs to continue without this chat's context.
Read this first, then `docs/money-model.md`, `docs/tablepilot-integration.md`,
`docs/backlog.md`, and `CLAUDE.md`.

---

## 0. First message to paste in the new session

> Read `docs/SESSION-HANDOFF.md`, `CLAUDE.md`, `docs/money-model.md`,
> `docs/tablepilot-integration.md` and `docs/backlog.md` in privelegy-bali-club,
> then continue. Respect the HARD GUARDRAILS. My designated branch is
> `claude/bali-tourism-platform-fhd0l9`.

---

## 1. What the product is

Bali Privilege — free curated Canggu guide for tourists; monetizes venues, not
tourists. Positioning: **Bali-wide planning, Canggu-deep execution.**
**Money model v0.3 (canonical, `docs/money-model.md`):** revenue = a fixed fee
per **confirmed seated reservation** made through our reservation system
(TablePilot). No listing/featured/subscription/tiers. Perk + QR redemption stay
as tourist incentive + on-premise arrival proof, NOT the billed event.
Chain: **Find → Perk → Reserve → Arrive → Redeem → Report → Fee.**

## 2. Where it lives

- **Repo (BP):** `parkourcafe/privelegy-bali-club`, branch
  `claude/bali-tourism-platform-fhd0l9`. Next.js 16 / React 19 / Tailwind 4.
- **Deploy:** Vercel — `https://privelegy-bali-club.vercel.app` (auto-deploys on
  push to the branch). Env set: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **DB:** Supabase project `bali-privilege`, id `egkdapqwkfprtyqvvnso`
  (org `kora bali` / `huqbxcmbidfqverftqrk`, region ap-southeast-1). Anon
  publishable key only; NO service_role anywhere. Writes go through SECURITY
  DEFINER RPCs. Migrations 0001–0013 in `supabase/migrations/`; production DB
  application of 0013 still needs explicit verification/apply.
- **TablePilot (reservations, separate product):**
  `parkourcafe/tablepilot-id`, deployed `https://tablepilot-id.vercel.app`,
  public booking page `/book/:venueSlug`. Vite/React, state in Supabase JSONB
  (`tablepilot horeca` project). Bridge = BP hands off with
  `?source=bali_privilege`.
- **KORA food hall (separate site):** korafoodhall.com — audit spec exists
  (`kora-site-audit-2026-07-06.md`, delivered as a file, not in this repo).
  Its repo is NOT in scope here.

## 3. Current state — DONE

- G0 planning form (slots, vibe/category filters, routes), G1 QR redemption with
  source attribution (external/in_venue/creator), event funnel, dish-feedback,
  My perks (`/me`), partner report (`/partner/[venue]`, Reach/Intent/Proof +
  Notes), operator dashboards (`/admin`, `/admin/phase0`), PWA. GuestRef =
  httpOnly cookie (no localStorage).
- Money model v0.3 fixed; guardrails #3/#5 reconciled in CLAUDE.md.
- **TablePilot bridge (BP side)**: `venues.tablepilot_slug`, ReserveButton →
  TablePilot with source, `reservation_click` event. TablePilot side (add
  `bali_privilege` source) shipped by a prior session per
  `docs/tablepilot-bridge-handoff.md`.
- **Phase 0 money-loop dashboard (repo side)**: `lib/tablepilot.ts`,
  `/admin/phase0`, `direction_click`, and `0013_phase0_money_gate.sql` landed in
  PR #7. It reads aggregate-only TablePilot data; QR proof remains separate from
  billing.
- **PWA/visual upgrade (repo side)**: PNG manifest/icons and upgraded visual system
  landed in PR #8. Public copy/name still need the separate Other Bali launch pass.
- **Partner self-onboarding**: `/onboard/[token]` (venue sees card preview,
  agrees to policy, uploads own photos), `/admin/invite/[venue]` (invite link +
  WhatsApp message), `/admin` shows onboarding status badges.
- **Venues loaded**: 20 active Canggu venues + 19 Ubud (pipeline, hidden by
  coverage policy). 8 placeholder seeds deactivated. Perks marked "Proposed"
  (data was research/proposed, NOT confirmed — onboarding confirms them).
- Invite links for all 20 Canggu venues generated (`canggu-invites.csv`,
  delivered as a file).
- Live redemption verified once (founder test); Phase 0 (redemption) gate was
  marked passed earlier — but see caveat in §5.

## 4. Current state — TODO (field + follow-ups)

- **Field:** founder sends the 20 invite WhatsApp messages; venues confirm +
  upload photos; print QR posters (`/admin/qr/<slug>`) for confirmed ones.
- **Density (§22):** 20 Canggu active, gate wants ≥30 — load next Canggu batch
  (same CSV template; Ubud rows go to pipeline).
- **Production DB:** apply/verify `supabase/migrations/0013_phase0_money_gate.sql`
  in production Supabase. Without it, live `/admin/phase0` may not match repo code.
- **TablePilot money proof:** one real BP-sourced TablePilot booking must become
  `arrived` or `completed` so `/admin/phase0` shows seated/billable proof.
- **Other Bali launch pass:** public UI/manifest/canonical still use the field-test
  Canggu Perks label. Rebrand/copy/legal/JTBD surfaces are the next launch batch.
- **KORA site:** separate session with that repo + the audit file.
- **Backlog:** `docs/backlog.md` (QR-photo anti-fraud gate; poster-degradation
  revisit check; similar-places fallback — gated on density; rejected per-cheque
  commission).

## 5. Known operational facts / gotchas

- This sandbox's network blocks `*.vercel.app` and `supabase.co`, so the agent
  can't open the live site or reach the DB over HTTP — verify via the Supabase
  MCP (reads) instead. Git and npm work.
- Supabase MCP write calls intermittently fail with "permission stream closed" —
  retry; if it keeps failing, hand the founder the SQL to paste (she applies it
  in the Supabase SQL editor). All migrations are written idempotently.
- `add_repo` is NOT available in this session; GitHub scope is BP only. To touch
  `tablepilot-id` or the KORA repo, start a session that includes them.
- No partner/admin auth yet (deferred, master §19). `/admin/*` and onboarding
  tokens are unguessable-URL-gated only.
- Vibe tags are only set after an on-site visit (master §10) — do NOT bulk-load
  unverified tags from research CSVs.
- Coverage policy (guardrail #4): venue cards/perks/QR only in Canggu; Ubud is
  next_deep (monetization/qr disabled at DB level). Don't surface Ubud to
  tourists without an explicit founder decision to change coverage.

## 6. Migrations (DB) — 0001–0013

init · redemption_rpc · attribution_events · phase0_overview · venue_card_fields ·
source_class_and_coverage · routes · partner_notes · my_perks_and_feedback ·
tablepilot_bridge · partner_onboarding (+ token_fix) · onboard_status ·
phase0_money_gate.

Live DB status: 0001–0012 were applied before this handoff. 0013 is in repo and must
be applied/verified in production Supabase before treating live money-gate analytics
as final.

## 7. Key routes

Tourist: `/` · `/route/[slug]` · `/v/[venue]/redeem` · `/me`
Partner: `/partner/[venue]` · `/onboard/[token]`
Operator: `/admin` · `/admin/phase0` · `/admin/invite/[venue]` ·
`/admin/qr/[venue]` · `/admin/qr/source/[source]`
API: `/api/redeem` · `/api/source` · `/api/event` · `/api/dish` ·
`/api/onboard/confirm` · `/api/onboard/photo`
