# Sanur + Seminyak thin-page editorial pass (2026-07-13)

Closes the last empty active venue rows outside the deep districts so their
`/places/[slug]` pages become indexable. Same verified-source cycle as the
Canggu/Ubud passes, but run **in-session by research agents** rather than from a
founder research upload.

## What ran

Six parallel local-verification research agents, each on a batch of venues,
each verifying against first-party sources (venue website, official
Instagram/Facebook, or the venue's own Google Business listing for
hours/location only). Output → `supabase/migrations/0026_enrich_thin_venues.sql`
(applied to prod).

- **Sanur — 20** (bars, cafés, restaurants, warungs)
- **Seminyak / Umalas food & drink — 13**
- **Umalas wellness — 5** (spa / pilates / salon)

Fields written: `why_its_here`, `best_for`, `not_for`, `what_to_order`,
`price_anchor` (band), `jobs` (canonical 9-slug vocabulary; wellness rows carry
no jobs — the intent vocab is food/drink only), `area`.

## Result

- **37 / 38 clear the decision-ready bar** (`why_its_here` + `best_for` +
  at least one of `what_to_order` / `price_anchor`) → `index,follow` +
  in the sitemap automatically (`lib/publication.ts` → `isVenueIndexable`).
- Verified in prod after apply: 37 pass; 0 invalid job slugs; 0 Sanur
  `sunset_drinks_view` (Sanur is a sunrise coast).

## Held back on purpose

- **`revive-pilates-umalas`** — real editorial written, but no class/drop-in
  price band could be verified (official pricing page 403s). It has its copy but
  **stays noindex** until a price band is confirmed. One line in a follow-up
  migration flips it.
- **`white-rock-beach-club`** — this is the 39th thin page, but it's in
  **Uluwatu**, which is gated by the evidence registry (`lib/uluwatu/venues.ts`),
  not DB editorial. It needs a registry entry (identity, boundary, hours,
  editorial summary + best-for + a practical detail + verification date), i.e.
  the Uluwatu research process — not this pass.

## Guardrails held

- No Google ratings / review counts in any copy (#1).
- Downsides only as `not_for` fit-context — who/when a place doesn't suit —
  never quality warnings or anti-lists (#7).
- Prices as bands, never live menus.
- English only; unverified fields left blank; nothing invented.
- No new entities/categories; wellness sits under the existing `category='spa'`
  umbrella (#11). Sanur/Seminyak stay planning-only — no money loop, QR, or
  booking language (#4).

## Sourcing notes (flagged, not hidden)

A few rows were verified via listing/aggregator pages rather than a clean
first-party site (no official site found): `oranje-bar`, `mona-lisa-cafe`,
`hog-wild-with-chef-bruno`, `nook-umalas`, `red-manna`. Facts were
cross-checked; price bands left blank where a first-party figure wasn't
available. `natys-restaurant-seminyak` had `sunset_drinks_view` dropped — the
ocean view wasn't confirmed by the source.

## Follow-ups

- Photos are still absent for these venues; the publication gate for these
  districts doesn't require them, so pages index, but adding photos later only
  helps.
- When a `revive-pilates-umalas` price band surfaces, one UPDATE flips it.
- Post-deploy: GSC *Request indexing* on a sample of the new venue URLs to speed
  pickup (`docs/gsc-setup.md`).
