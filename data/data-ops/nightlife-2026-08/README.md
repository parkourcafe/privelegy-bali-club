# Nightlife — bars, nightclubs, beach clubs, hookah lounges — 2026-08-25

Founder-requested: today's earlier harvests (spa, rental, restaurants) skewed
daytime-usable venues; nightlife is a real gap, not a perception —
pre-harvest the site had **bar: 17 (zero in Seminyak)**, **beach_club: 13**,
**nightclub: 0**, **hookah_lounge: 0**. Budget: ~1,417 Firecrawl credits
remaining on the subscription (expires 2026-08-28); this harvest spent 735,
leaving 682 in reserve.

New categories `nightclub` and `hookah_lounge` — `venues.venue_type` is a
fixed enum without them, so `venue_type` is `NULL` for these two, same
pattern as `rental`/`villa`/`attraction`. `bar` and `beach_club` already
existed in both `category` and the enum. Code changes: `VenueCategory`
(`lib/types.ts`), the rendering allowlist (`lib/venue-validation.ts`), the
label/schema.org maps (`lib/venue-presentation.ts` and the five duplicated
`categoryLabel` maps in `components/VenueCard.tsx`,
`components/SimilarPlaces.tsx`, `app/PlanView.tsx`, `app/list/[slug]/page.tsx`,
`app/places/PlacesView.tsx`) — schema.org type `NightClub` for nightclub (a
real schema.org type), `BarOrPub` for hookah_lounge (no exact type exists;
closest LocalBusiness subtype, same reasoning as `beach_club` → `LocalBusiness`
already in the codebase). `npx tsc --noEmit` and `npm run lint` both pass.

## Discovery and crawl

One discovery pass across 16 nightlife-heavy areas × 4 query patterns (bar,
nightclub, beach club, hookah lounge) → 129 raw venue hits → 58 unique new
domains after excluding 1,028 domains already in `venues.official_url`
(extracted from a live production query, so this doesn't rediscover what's
already published under any category) → crawled all 58 → 45 real venues, 329
priced/described items.

## Three rounds of hand-caught contamination — a harder case than today's earlier harvests

The first build produced **39 candidate cards**, all passing the same guards
that worked cleanly for spa/rental/restaurants (own-site check, geographic
sanity, district mapping). Spot-checking a sample before publishing surfaced
problems those guards don't catch, so two new guards were added and the
batch was rebuilt twice:

1. **"Nightlife" and "beach clubs" as a topic, not a place.** GetYourGuide's
   "Seminyak Nightlife & bars" *activity-listing* page came back as a venue
   named "Kuta Nightlife" (the district in the extracted name didn't even
   match the page it was scraped from — itself proof it isn't one business).
   `thebeatbali.com`'s "Canggu Nightlife: Complete Party and Clubbing Guide"
   and `baliholidaysecrets.com`'s "Best beach clubs in Uluwatu" round-up were
   the same pattern — an editorial guide to *several* venues, not one.
   `balibeachclubpass.com` was a multi-club day-pass product, not a physical
   venue at all. Fixed with a source-domain blocklist
   (`NIGHTLIFE_JUNK_SOURCES` in `make_cards.py`) — 8 cards dropped.
2. **A real venue, but sourced from someone else's write-up about it.** The
   subtler failure: **FINNS Beach Club** — a real, well-known Canggu venue —
   first built with `official_url = bestbeachclubsbali.com`, a "best beach
   clubs" comparison site, because that page's own description of FINNS was
   detailed enough to pass the "is this a real venue" check. Same pattern hit
   **Potato Head** (sourced from a travel-attraction app, not
   `potatohead.co`), **Single Fin** (sourced from a DJ-booking agency site),
   **CP Lounge** and 8 others. A domain blocklist can't catch this — the
   domain has no relationship to the venue's name at all, by design (it's a
   third party writing *about* the venue). Fixed by requiring at least one
   non-generic word from the venue's own name to appear in its `official_url`
   host before trusting that host as "the venue's own site" — 12 more cards
   dropped, including two duplicate attempts at the same real business
   (**Cretya Ubud**, see below) sourced from a booking-partner domain instead
   of its own `cretyaubud.com`.
3. **Beach club in a district with no coastline.** Two cards — **Cretya
   Ubud** (a real "day club" in Tegallalang, rice terraces, no beach) and
   **CP Lounge** (Ubud) — were classified `beach_club` by the extraction
   model despite being inland. Not a naming guess: Ubud/Tegallalang having no
   coastline is a geographic fact, independent of what either specific
   business actually is (unlike this afternoon's Macau false-positive, which
   was pure name-pattern matching against real, ignored address evidence).
   Neither fits `bar`/`nightclub`/`beach_club`/`hookah_lounge` accurately, so
   both are held out rather than mislabeled — recorded in
   `new_cards_rejected.json` in case a `day_club` category gets approved
   later, not silently discarded.

A fourth, narrower guard: a venue whose own site lists **several districts at
once** (Eden Hookah Club's own homepage: "Seminyak, Canggu, Ubud, Uluwatu")
has no single address to anchor one card to — held out rather than guessed
at which branch.

## The 12 that survived, apply with `new_venue_cards.sql`

| Venue | Category | District | Priced fact? |
|---|---|---|---|
| MESA BALI | nightclub | Canggu | Yes — cocktail 95K IDR |
| THE GOAT | bar | Seminyak | Yes — item 75K IDR |
| Azul Beach Club | beach_club | Kuta-Legian | Already published (`azul-beach-club-legian`) — insert skipped by the idempotency guard, not an error |
| The Shisha House | hookah_lounge | Seminyak | No — vibe description only |
| Hubble | hookah_lounge | Canggu | No |
| Pavilion Surf Club | bar | Kuta-Legian | No — happy-hour fact only |
| White Rabbit Lounge | bar | the Bukit | No |
| Ours Bali | bar | the Bukit | No — happy-hour fact only |
| Banana Lounge Bali | beach_club | the Bukit | No |
| Pinstripe Bar | bar | Ubud | No |
| UBUD SHISHA | hookah_lounge | Ubud | No |
| Impresario Clubhouse | nightclub | Nusa Dua | No |

**11 actually inserted** — Azul Beach Club already existed under
`azul-beach-club-legian` (published, but with `official_url` empty); the
guard correctly skipped a duplicate rather than creating a second row. Its
existing record could be enriched with the richer facts this harvest found
(official site, Instagram, booking link, a price) in a future pass — not
done here, since that's an edit to an existing published row, not a new
insert, and wasn't asked for.

Cards without a numeric price still publish real facts — self-description,
address where printed, opening hours, happy-hour terms, booking channel —
with every price field left `NULL` rather than guessed, same rule as every
harvest today.

Dry-run against production (two rows, `begin`/`rollback`) done before this
file was applied: one `bar` row (confirms `venue_type` populates from the
existing enum) and one `nightclub` row (confirms `venue_type` stays `NULL`
for the new category) — both inserted, verified, rolled back cleanly. The
full batch was then applied directly (11 of 12 inserted, verified against
production afterward).

## Data files

| File | What it is |
|---|---|
| `new_venue_cards.sql` | **applied** — the 12 venue-record inserts (11 landed) |
| `bali_nightlife_venues.csv` | all 45 crawled venues, published or not |
| `bali_nightlife_items.csv` | 329 priced/described items for all 45 |
| `new_cards_rejected.json` | the 33 rejected cards with each rejection reason |

## What's not covered

- Many real Bali nightclubs/beach clubs run almost entirely on Instagram with
  no independent website — this method structurally can't reach them without
  inventing facts.
- `day_club` (Cretya Ubud and similar inland pool/lounge venues) isn't a
  category the schema currently supports; two real, well-evidenced venues are
  sitting in `new_cards_rejected.json` for exactly this reason.
- Second-wave discovery (deeper sub-district search, the way spa's wave 2
  expanded coverage) wasn't run — 682 credits remain if the founder wants to
  continue before the subscription resets 2026-08-28.
