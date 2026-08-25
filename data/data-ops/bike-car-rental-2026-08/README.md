# Bike & car rental — new venue category, 2026-08-25

Brand-new category on the site — zero rental venues existed before this
harvest. Collected with Firecrawl from each venue's **own website** (never
an aggregator, never review platforms — guardrail #2). Every row carries its
`verification_source`.

## How to apply

Run **`new_venue_cards.sql`** in the Supabase SQL editor. Idempotent — a
re-run inserts nothing new, guarded on slug and on name+district.

Dry-run against production (one row, `begin`/`rollback`) already done before
this file was written: `cv-tara-bali-denpasar` inserted, verified, rolled
back cleanly.

## Schema notes

- `category = 'rental'` — `venues.category` has no check constraint, so this
  needed no migration. `venues.venue_type` **is** a fixed enum
  (`venues_venue_type_check`) that does not include "rental", so `venue_type`
  is left `NULL` — the same pattern already used for `villa` and `attraction`.
- Code-side, `VenueCategory` (`lib/types.ts`), the rendering allowlist
  (`lib/venue-validation.ts`), and the category label/schema.org maps
  (`lib/venue-presentation.ts` and five duplicated `categoryLabel` maps in
  `components/VenueCard.tsx`, `components/SimilarPlaces.tsx`,
  `app/PlanView.tsx`, `app/list/[slug]/page.tsx`, `app/places/PlacesView.tsx`)
  all needed `rental` added. Without the `lib/venue-validation.ts` entry
  specifically, every one of these rows would insert successfully and then
  render as **zero results everywhere** — `venueStructuralIssues()` drops any
  row whose category isn't in the allowlist before it reaches a public list,
  silently. `npm run lint`, `npx tsc --noEmit`, `npm run test` (591/592,
  1 pre-existing skip) and `npm run build` all pass with these changes.
- schema.org type is `AutoRental` (a real schema.org type, subtype of
  `AutomotiveBusiness`) — covers both car and scooter/motorbike rental
  businesses; there is no separate schema.org type for two-wheeler rental.

## What this covers, and what it does not

**63 new venue cards.** By district: Legian 15, Canggu 12, Ubud 10,
Seminyak 8, Denpasar 5, Nusa Dua 4, Sanur 3, Uluwatu/the Bukit 3,
Jimbaran 3. 27 candidates were rejected and recorded with a reason in
`new_cards_rejected.json` — 20 for fewer than 2 priced vehicles, the rest for
geography (5 non-Bali addresses — Taiwan, Thalang/Phuket, Batumi in Georgia,
Tunisia, Denver CO, all caught by the same geographic guard built for the
spa harvest, see `../spa-harvest-2026-08/README.md`) or a document/social
host as the only "official site".

`price_anchor` is the **cheapest priced vehicle** on the venue's own fleet
list, not the most expensive — a reader comparing rental shops wants to know
the entry price, not the top-end SUV.

No prices for businesses that only take walk-ins or Instagram DMs with no
published rate — this method only finds businesses with their own website
and a public price. Not every Bali scooter-rental stall has either.

## A phone-number bug caught before publish

`whatsapp`/`phone` fields sometimes came back as a full `wa.me/...` or
`api.whatsapp.com/send?phone=...&text=...` URL rather than a bare number.
Stripping non-digits from the whole string pulled query-string text into the
number — `adventures-bike-rental-bali-canggu` initially came back with
whatsapp `628180430777720` instead of the real `6281804307777`. Fixed by
matching the Indonesian mobile shape (`(?:\+?62|0)8\d{7,11}`) instead of
stripping non-digits blindly. Checked already-published spa/yoga/fitness/
beauty venues in production for the same pattern (`length(whatsapp) > 15`) —
none found, so this did not reach the site through the earlier harvest.

## Data files

| File | What it is |
|---|---|
| `new_venue_cards.sql` | the 63 venue-record inserts, apply this |
| `bali_rental_venues.csv` | all 90 built venues (63 published + 27 held back), identity, booking provider |
| `bali_rental_vehicles.csv` | 1 824 individual vehicle/rate rows |
| `bali_rental_excluded.csv` | domains dropped before build (no name, no vehicles) |
| `new_cards_rejected.json` | the 27 rejected cards with each rejection reason |
