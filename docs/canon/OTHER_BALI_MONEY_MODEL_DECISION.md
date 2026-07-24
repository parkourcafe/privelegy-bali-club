# Other Bali — Money Model Decision

Status: active owner decision; reconciliation only  
Recorded: 2026-07-25, Asia/Makassar  
Authority: `MONEY-001`

## Approved money model

The only paid product is a fixed fee per confirmed seated reservation through a supported attribution path. Discovery, a CTA click and a reservation intent are not a seated outcome. Maps, Instagram, WhatsApp, official website, menu and other outbound actions are intent handoffs unless a supported reservation rail confirms the seated event.

## Forbidden commercial mechanics

The following are not implementation authority:

- sponsored visibility tiers;
- paid organic ranking;
- Featured paid placement;
- paid route placement;
- category sponsorship;
- paid listing or catalogue fees;
- tourist payment, card, wallet or membership mechanics.

`MONEY_MODEL_CONFLICT`  
No commercial copy changed  
Decision Log amendment required

## Legacy/conflicting carriers registered, not changed

The following exact carriers remain as-is evidence only and are marked `HISTORICAL / READ-ONLY / NOT IMPLEMENTATION AUTHORITY` for this stage:

- `venues.is_sponsored` in `supabase/migrations/0001_init.sql`;
- `Venue.isSponsored` in `lib/types.ts`;
- Sponsored label/render path in `components/PlaceCard.tsx`;
- Sponsored mapping in `lib/data.ts`;
- old perks/redemption structures in migrations `0001`, `0009` and `0031`;
- `/for-venues` and `VenueSubmissionForm` copy saying “2 months free” / “first 2 months are a free test”.

No public Sponsored code or route was deleted, renamed or reinterpreted in this commit.

## Future contract acceptance criteria

Before any implementation, the contracts must show only seated-fee language; no paid-rank field may influence read models, UI, admin or partner/sales views; `reservation_click` must remain distinct from a seated outcome; partner reporting may report intent but not claim a seated outcome without supported attribution; and any amendment must be dated in `OTHER_BALI_DECISION_LOG.md`.

## Gate

`MONEY_MODEL_DECISION: PASS` means the owner decision is explicit and usable for contract work. It does not assert that the current legacy code is already money-model consistent.
