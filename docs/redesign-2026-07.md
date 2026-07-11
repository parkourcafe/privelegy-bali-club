# Other Bali — redesign + Bali-wide planning layer (2026-07)

Record for the `claude/privelegy-bali-club-mjlzwq` branch after reconciling
with the mainline (`claude/bali-tourism-platform-fhd0l9`), which independently
landed its own Other Bali cinematic landing + JTBD/moments content layer.

## Reconciliation decision

The base branch is the mainline and owns the design system and architecture:
- Cinematic landing at `/` (dark espresso + brass, Fraunces/Geist, `--ob-*`
  tokens, `components/landing/*`), the working tool moved to `/plan`.
- `.page-dark` scope for tourist sub-pages; `.moment-*` day scenarios;
  `.fit-context` / `.why-here` JTBD fields; venue `area` sub-areas.
- Migration `0014_venue_areas_jtbd.sql`.

On merge, **base wins wholesale on design/architecture/rebrand.** This
branch's distinct, surviving contribution is the **Bali-wide planning layer**;
the branch's earlier standalone landing/design-system is superseded by base's
and was dropped during the merge (recoverable from history at `9c08704`).

## What this branch adds on top of base

- **`lib/districts.ts`** — 15 areas as an editorial planning layer with fit
  context (region · moment · Best for). Canggu = `active_deep`, Ubud =
  `next_deep`, the rest `planning_only`; Gili Islands & Lombok labelled
  "Beyond Bali · fast boat" (they are a different province — the framing
  stays honest).
- **`AroundBali` section** on the landing (`app/page.tsx`), authored in base's
  dark idiom (`Section`/`Reveal`/`--ob-*`), inserted after Comparison. Canggu
  card links to `/plan`; others link to Google Maps via `DistrictMapLink`.
- **`getDistrictsGuide()`** (`lib/data.ts`) — overrides a district's coverage
  status from the `districts` table when Supabase is configured, so flipping
  a status in the DB reflects without a deploy. (The landing itself uses the
  static list to stay static; this accessor is for `/plan` surfaces.)
- **`district_open`** growth event (`/api/event`) — growth-only, never
  partner-proof.
- **Migrations** `0015_planning_districts.sql` (11 areas) + `0016_gili_lombok.sql`
  — renumbered after base's `0014` so ordering is clean. `planning_only`,
  monetization/QR off (guardrail #4 holds at the DB level). **DB apply is the
  founder's** to run, in order, after the pending `0013`.
- **SEO** — `sitemap.ts` (adds `/`, `/plan`, `/route/*`), `robots.ts`
  (admin/partner/onboard/api/me/v disallowed), `metadataBase` + OpenGraph on
  the root layout.
- Nav gains an "Around Bali" anchor.

## Guardrails / notes

- Coverage discipline: no perks/QR/booking outside `active_deep`. District
  cards carry only a map link + a growth event.
- Master doc names Canggu/Ubud/Seminyak/Sanur/Uluwatu explicitly; the other
  planning_only areas (incl. Gili/Lombok) extend the documented Bali-wide
  planning layer per founder request (2026-07-11). Worth one line in the
  master doc for full guardrail-#11 cleanliness.
- No new entities, no chatbot, no invented numbers/testimonials/offers.
