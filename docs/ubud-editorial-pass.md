# Ubud editorial evidence pass — 2026-07-13

Same verified-source cycle as the Canggu passes (0021/0022), applied to Ubud.
Migration: `0024_ubud_editorial_pass.sql`, applied to prod.

## Before

32 active Ubud venues (20 restaurants/warungs, 12 cafés — after `dicarik-warung`
landed here via 0023), only **5** carried `why_its_here`/`best_for`
(alchemy, milk-and-madu-ubud, suka-espresso-ubud, watercress-ubud, zest-ubud). The
`/ubud` pillar + its two category guides (best-restaurants, best-cafes-coffee) were
live but sparsely populated. Ubud has **zero `jobs` tags** beyond those 5, so
`lib/ubud-guides.ts` deliberately stays category-organised (no decision groups) —
unchanged by this pass, though the new `jobs` values are stored for future use.

## What was done

Verified web research (official site / official Instagram / reputable non-review
listings — same guardrails as Canggu: no review text/ratings #1, WHO/WHEN-only
`best_for`/`not_for` #7, existing 9-slug `jobs` vocabulary #11) on the remaining
**27 empty active venues**: 7 cafés + 20 restaurants/warungs, split across 3
parallel research passes. All 27 verified, all clear the publication gate.

**Ubud is now at 32 / 32 active venues publishable.**

## District is planning / next_deep — no money loop

Per guardrail #4, Ubud carries no perks/QR/TablePilot handoff — `toUbudPlaceCard`
never sets `tablepilotSlug`/`hasOffer`. Editorial was written with no booking/
reservation-as-feature language.

## Fixes bundled in

- **`manga-madu` → renamed to `Warung Mangga Madu`.** The DB name had dropped a
  letter; the real, verified venue is "Warung Mangga Madu" (honey-glazed grilled
  chicken is the namesake dish). Direct name correction, not a rebrand.
- **`dicarik-warung`** — the row 0023 relocated here from a Canggu mis-file (its
  gmaps coordinates are ~1.2km from Ubud centre on Jl. Kajeng) now has full
  editorial: a rice-field-walk warung best known for its hands-on Balinese cooking
  class.

## Evidence-quality notes (weaker sourcing, flagged not hidden)

- **warung-mendez**: no dedicated official website found; sourced from its Facebook
  page + one long-form food blog + one non-review menu aggregator. Weakest evidence
  base of the 27 — worth a second look if a stricter bar is wanted later.
- **ibu-rai**: several "official-looking" domains turned out to be auto-generated
  SEO scraper sites, not the real venue's site; sourced from Facebook + a travel
  blog instead, `official_url` left null.
- WebFetch was non-functional for most of this pass (403s across official domains,
  including Wikipedia) — verification relied on WebSearch result snippets, which
  quote/paraphrase the same first-party pages rather than a direct page fetch. Still
  first-party-grounded, just via search-result excerpts rather than raw HTML.

## What still remains

- **Zero yoga/spa/wellness/retreat venues exist in the Ubud catalogue at all** —
  despite that being Ubud's signature category (KORA food hall aside). This is a
  **discovery** gap (new venue rows), not an enrichment gap like the above — a
  separate, larger piece of work. The 2026-07-12 launch audit noted the founder had
  found some yoga data destined for a separate chat; unclear if that has landed
  anywhere yet.
- **Photos: none.** Venue detail pages stay noindex until a rights-cleared image
  pass (same as every other district).
- Decision-style guides (date-night, work-café, etc.) could now be built for Ubud
  since 32 venues carry real `jobs` values — `lib/ubud-guides.ts` would need new
  guide definitions mirroring `lib/canggu-guides.ts`, gated on Ubud actually having
  enough coverage per job.
- Two inactive/archived duplicate rows (`donna`, `onion-collective-the-onion-co-halal`)
  were left untouched — inactive, not shown, no action needed unless cleanup is
  wanted.
