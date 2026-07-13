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

## Wellness discovery pass — 2026-07-13 (migration `0025_ubud_wellness_discovery.sql`)

Ubud's signature category was entirely missing from the catalogue (0 rows). This
was a **discovery** task (new venue rows), not enrichment. Two parallel research
passes (yoga/movement/retreat + spa/massage/wellness) found and verified, against
first-party sources, **23 established, currently-operating Ubud wellness venues**:
big drop-in studios (The Yoga Barn, Radiantly Alive, Ubud Yoga Centre), scenic
shalas (Intuitive Flow, Ubud Yoga House), sound healing (Pyramids of Chi), day
spas (Karsa Spa, Sang Spa, Jaens, Svaha, Cantika Zest…), Ayurveda (KUSH, Oneworld
Ayurveda, Bali Botanica) and retreats (The Shala Bali).

- All use the existing `category = 'spa'` umbrella (no new category, #11).
- Guardrails as always: no review text/ratings (#1), WHO/WHEN-only `best_for`/
  `not_for` (#7), prices as bands, Ubud stays planning/next_deep (no money loop, #4).
- Geography honesty: venues that market as "Ubud" but sit elsewhere were **dropped**
  during research — Fivelements (Mambal), Yoga Searcher (Uluwatu), The Practice
  (Canggu), House of Om (Bona), Nirarta (Sidemen).
- One in-research dedup: "Taksu Spa" and "Taksu Yoga" are the same venue/site/
  address — merged into a single `taksu-yoga-ubud` entry (24 verified → 23 rows).

**Surfaced in the same branch commit:** a new `best-yoga-wellness` guide
(`lib/ubud-guides.ts` + `app/ubud/best-yoga-wellness/page.tsx`), a "Yoga & wellness"
section on the `/ubud` pillar, a `spa → /ubud/best-yoga-wellness` breadcrumb on
`/places/[slug]`, and the sitemap entry. Venue detail pages stay noindex (no photos).

Prod apply of `0025` is a founder step (NOT EXISTS-guarded, idempotent).

## What still remains
- **Photos: none.** Venue detail pages stay noindex until a rights-cleared image
  pass (same as every other district).
- Decision-style guides (date-night, work-café, etc.) could now be built for Ubud
  since 32 venues carry real `jobs` values — `lib/ubud-guides.ts` would need new
  guide definitions mirroring `lib/canggu-guides.ts`, gated on Ubud actually having
  enough coverage per job.
- Two inactive/archived duplicate rows (`donna`, `onion-collective-the-onion-co-halal`)
  were left untouched — inactive, not shown, no action needed unless cleanup is
  wanted.
