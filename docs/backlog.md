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
**Use:** against delivery-aggregator commissions, our flat Tier A reads as cheap
and predictable. Add to the partner pitch / message templates. Reinforces the
fixed model (§5.1a); does not change it.

## Rejected (do not implement without a master-doc change)

- **Per-cheque / per-redemption commission (10–15% or $1.50–2.00/guest).**
  Conflicts with §5.1a and guardrail #5. Per-redemption billing incentivises
  partners to suppress scans and us to inflate them. If ever reconsidered, it is
  a master-doc decision, not a backlog item.
- **$3–4k/mo opEx + $40–60k raise break-even model.** A funded-startup cost
  structure; ours is founder-led (§23). Kept only as a "what if we hire" scenario.
