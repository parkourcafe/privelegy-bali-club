# Backlog & field notes

Not a source of truth. Strategy lives in `Bali_Privilege_Master_Architecture.md`;
rules live in `CLAUDE.md`. This file only tracks accepted follow-ups so they
don't get lost. Nothing here is pulled forward past its gate.

## From external review (Manus AI, 2026-07-05) — accepted findings

Three operational findings were worth keeping; the rest either restated the
existing architecture or conflicted with the fixed money model (§5.1a — flat
tiers, no per-cheque commission) and were rejected.

### 1. QR-photo sharing — anti-fraud gate (code)
**Risk:** a guest photographs the printed venue QR and redeems from the villa,
breaking the on-premise proof anchor. Also lets one guest inflate a venue's
count.
**Disposition:** part of the existing anti-fraud gate — must land *before*
redemption counts back a real partner invoice (Phase 1.5), not before. Cheap
mitigations to design then:
- rolling token in the QR URL, rotated on each revisit;
- rate-limit / anomaly check per `guest_ref` per venue per day.
Until counts are billable, minimal anti-fraud is an accepted trade-off (we are
measuring real behaviour, not fighting fraud).

### 2. Poster physical degradation — revisit checklist (field)
**Risk:** printed posters get torn, removed, or hidden by staff — silent data
loss, the #1 field risk.
**Disposition:** add to the Field Kit revisit checklist: *"QR on-site, undamaged,
and scans."* Operational, not code.

### 3. "Aggregators take 28–32%" — B2B pitch lever (GTM)
**Use:** against delivery-aggregator commissions, our pricing reads as cheap and
predictable. Add to the partner pitch / message templates. *(Updated for money
model v0.3: the lever is now "a fixed fee per seated guest you can verify, vs
28–32% of every order" — even sharper than the original flat-tier framing.)*

## Founder ideas — accepted, gated

### 4. "No slots / closed → similar places" fallback (BP side, Phase 1B gate)
**Idea (Selena, 2026-07-06):** when a bookable venue has no availability or is
closed (e.g. Mondays at the pilot venue), BP suggests similar venues — same
category/vibe tags, same or nearby area — each with its own Reserve button, so
the reservation (and attribution) stays inside BP instead of dying on a dead
booking page.
**Why BP, not TablePilot:** `/book/:slug` is the venue's own page; routing its
guests to competitors there is a product conflict for TablePilot's B2B side.
Recommendation is the guide's job.
**Mechanics already available:** TablePilot public availability API
(`GET /api/public/:slug/availability`) + BP category/vibe/district data. No AI
needed (guardrail #2 safe) — tag/category matching only.
**Gate:** needs density (§22, ≥30 places) and >1 bookable venue wired; until
then there is nothing meaningful to recommend. Do not build before the gate.

## Rejected (do not implement without a master-doc change)

- **Per-cheque / per-redemption commission (10–15% or $1.50–2.00/guest).**
  Conflicts with §5.1a and guardrail #5. Per-redemption billing incentivises
  partners to suppress scans and us to inflate them. If ever reconsidered, it is
  a master-doc decision, not a backlog item.
- **$3–4k/mo opEx + $40–60k raise break-even model.** A funded-startup cost
  structure; ours is founder-led (§23). Kept only as a "what if we hire" scenario.
