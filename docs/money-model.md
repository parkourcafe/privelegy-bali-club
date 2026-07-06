# Money model — v0.3 (canonical decision, 2026-07-06)

Founder decision, supersedes master-doc §5 (v0.2 "two tariffs A/B") and the
"redemption-proof → paid tiers" framing. Recorded here so it stops mutating.

## The rule

**Bali Privilege earns money only from a confirmed, seated table reservation
made by a tourist through our reservation system. Nothing else is a paid
product. The tourist never pays.**

We earn when ALL of these are true:
1. the tourist found the venue through Bali Privilege;
2. the tourist made a table reservation through our reservation system (TablePilot);
3. the venue confirmed the reservation;
4. the guest arrived / was seated (or counted as seated per the venue's rules);
5. the event is provable in the system.

**Fee format:** a fixed fee per confirmed seated reservation.
**Not:** a % of the cheque · not a deposit · not any tourist-side charge · not a
fee for "being in the catalogue".

## What is explicitly killed

- Tariff A (flat monthly) and Tariff B (monthly + per-booking) as the model. Gone.
- Paid listing / Featured / Route Placement / Category Sponsorship / Seasonal
  Campaign as standalone paid products. Gone.
- "redemption-proof → paid tiers" as the monetization path. Archived.

The perk / QR redemption stays — but as a **tourist incentive and an on-premise
arrival proof**, NOT as the billed event.

## The chain

> **Find → Perk → Reserve → Arrive → Redeem → Report → Fee**

| Step | Where it lives |
|---|---|
| Find | Bali Privilege (the guide) |
| Reserve | TablePilot — `/book/:venueSlug` |
| Arrive / Redeem | BP QR redemption = independent arrival proof |
| Report → Fee | BP ↔ TablePilot reconciliation (source = bali_privilege AND seated) |

## Consequences owned on purpose

- **Cafés / walk-ins are not monetized.** Nobody reserves a table for brunch.
  Cafés stay as free curated content + a perk hook — they are the tourist magnet
  and top of funnel, not a revenue line. Revenue = bookable venues only
  (dinner restaurants, beach clubs, spas).
- **Revenue depends on a working reservation layer.** Zero revenue until
  reservations work end-to-end. Mitigated: the reservation engine already exists
  and is deployed (TablePilot, `tablepilot-id.vercel.app`) — integration, not a
  build-from-scratch.
- **Fee cleanliness depends on the venue actually marking "seated" in
  TablePilot.** If a venue only takes the booking and never operates the floor,
  we can only bill on "confirmed" (weaker — no-show risk). This is the real
  ground risk to validate, not a code problem. [ПРОВЕРИМ]

## Phase 0 gate — shifted

The old gate measured perk redemption rate. The real gate for this model is the
**intent → reservation → arrival** chain:
- do tourists reserve through us (not just click)?
- do reservations convert to seated guests?
- will venues pay a fixed fee per seated guest they can see?

Perk redemption remains as the arrival proof, but the money event is the
**confirmed seated reservation**.

## Reservation engine = TablePilot (product #2 on the shared Venue)

One canonical `Venue`; the reservation product is a `VenueProductEnrollment`
(product = `tablepilot`) carrying the venue's TablePilot slug. BP does not build
a booking engine internally (guardrail #3 intent preserved) — it integrates the
existing external TablePilot product via a handoff link + a seated-reservation
report-back.
