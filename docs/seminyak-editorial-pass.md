# Seminyak editorial evidence pass — 2026-07-13

Same verified-source cycle as the Canggu/Ubud passes, applied to Seminyak.
Migration: `0026_seminyak_editorial_pass.sql`, applied to prod.

## Before → after

58 active Seminyak-area venues, only ~18 with editorial. Three parallel verified
research passes (food/drink; spa/beauty; fitness/yoga) covered the 40 empty active
venues against first-party sources (official site / official IG / reputable
non-review listings).

**Result: 33 enriched + 7 cleaned up → Seminyak 18 → 51/51 active venues publishable.**

## Cleanup the research surfaced (7 rows deactivated, not enriched)

Duplicates collapsed to one canonical venue each:
- **Soham** — `soham-pilates-class-program`, `soham-yoga`, `soham-wellness-spa` are all
  facets of the single `soham-wellness-center-seminyak` (~2,500 sqm complex). Kept the
  center, deactivated the three facets.
- **Prana** — `prana-spa-yoga-fitness-adjacent` is the yoga arm of Prana Spa → folded
  into `prana-yoga-seminyak` (kept). The day spa `prana-spa-seminyak` stays separate.
- **Bodyworks** — `bodyworks-beauty` is the same venue as `bodyworks-spa-seminyak`
  (one Bodyworks; spa + hair/nails under one roof). Kept the spa row.

Mis-districted (verified real brands, but NOT in Seminyak) — deactivated for honesty
rather than published on the Seminyak surface:
- **cocoon-medical-spa** — Cocoon has no Seminyak clinic (nearest Legian).
- **rejuvie-aesthetic** — Rejuvie's branches are Kuta and Sanur.

## Notes / flags

- Seminyak uses the `beauty`, `fitness` and `yoga` categories (already in the DB) in
  addition to `spa` — no new categories introduced (#11).
- Several venues are geographically Umalas / Kerobokan / Petitenget / Batu Belig
  (greater-Seminyak) — fine on the Seminyak surface, but worth knowing if an Umalas
  micro-grouping is ever wanted.
- Kept as separate venues (share a building/lineage but distinct brands + sites):
  `bali-barber` and `the-shampoo-lounge`.
- Guardrails held: no review text/ratings (#1); `best_for`/`not_for` are WHO/WHEN
  fit-context only (#7); prices as bands; Seminyak is planning_only — no money loop (#4).

## What still remains

- **Seminyak has NO hand-crafted pillar yet** — it sits on the programmatic
  `/bali/seminyak` hub. To bring it to Canggu/Ubud/Uluwatu parity, build a `/seminyak`
  pillar + guides (code) reading these editorial fields, and add it to `lib/pillars.ts`
  + `HUB_EXCLUDE_DISTRICTS`. That's a separate code PR into the deploy branch.
- **Photos: none** — venue detail pages stay `noindex` until the photo-consent flow
  (`docs/venue-photo-consent-brief.md`) lands.
