# Restaurant/cafe/warung discovery — "top 200 from Reddit", 2026-08-25

## The Reddit source doesn't work

The founder's original ask was a list of Bali's most-mentioned restaurants
from Reddit threads. Found 62 relevant threads (r/bali, r/BaliTravelTips,
r/finedining, etc.) via Firecrawl search, but **61 of 62 came back HTTP 403**
when scraping the thread content — Reddit blocks Firecrawl's scraper almost
completely. Tried `old.reddit.com` and Reddit's own `.json` API as
workarounds; both also 403'd immediately. This is not fixable with Firecrawl
as currently configured — Reddit is not a usable source right now.

**Pivoted to the same district+pattern web search used for the spa and
rental harvests** (founder-approved). This finds restaurants with their own
website — not literally "what Reddit recommends," but the same kind of
result the spa/rental harvests produced.

## The result: 20 new venues, not 200

941 restaurants/cafes/warungs/bars/beach clubs were already published before
this run, so a district+pattern search mostly rediscovers what's already on
the site: of 116 raw candidates, 527 already-published domains were excluded
before crawling even started, leaving 59 new-to-us domains to crawl.

**~830 credits went into discovery + crawling those 59 domains** (60 search
queries + 59 map-and-scrape passes). That spend bought the full picture
below, not just the venues that ended up publishable — every crawled domain
is in `bali_restaurant_venues.csv` whether it published or not, so the
founder can see what ~830 credits actually returned.

### Two rounds of hand-caught contamination

The first pass required a **numeric price** to publish anything, which was
too strict — several real restaurants only publish item *names* (no prices:
PDF/image menus, "market price"), so they were being discarded even though
they're genuine venues with a genuine website. Relaxing that bar (any venue
with 3+ real menu items, priced or not, publishes — price fields stay NULL
when there's no number to publish) surfaced the true issue: **not thin data,
contaminated data**. Of the 59 domains, 25 turned out to be content *about*
restaurants, not restaurant sites:

- `travelfish.org`, `baliuntold.com`, `water-sports-bali.com` — a travel
  directory, an "unusual restaurants" listicle, and a watersports company's
  seafood-dinner tour package — all got flagged `is_restaurant_venue: true`
  by the extraction model (one page literally named itself "Jimbaran," the
  district, because the source was a directory page, not a restaurant).
- `balifoodandtravel.com`, `remoteandafloat.com`, `almostlanding-bali.com`,
  `roadiscalling.com`, `hayleyonholiday.com`, `banbanjara.com`,
  `danielfooddiary.com`, `weareglobaltravellers.com`, `makanmood.com`,
  `balivillaescapes.com.au`, `smh.com.au`, `travel-lush.com`,
  `girleatworld.net`, `dressedincopper.com` — fourteen personal food-blog or
  press "X places to eat in Y" roundup posts. Their own titles say it: "8
  Kuta and Seminyak Warungs Where The Locals Eat," "My 13 Favourite Places To
  Eat and Drink in Legian," "The Best Cafes in Canggu — My Top Picks!" The
  model merged several different restaurants' menu items into one fake
  venue per post.
- `villasongket.com` — the villa's own "restaurants near us" page, about
  other people's restaurants, not itself.
- `bali.com`, `linktr.ee` — a directory (produced a venue literally named
  "Unnamed Restaurant") and a link-in-bio page that named the venue after
  the **page owner** ("Mr. Parker's Menu") rather than the actual business
  linked from it ("ivy cafe").

None of this reached the SQL file — every one is listed with its reason in
`new_cards_rejected.json`. Note on `bali.com`: it was first added to the
same substring blocklist as the others, which was a bug — nearly every real
Bali venue's own domain *ends in* `...bali.com` (firerestaurantbali.com,
gatherbali.com, umagardenbali.com…), so a substring check against `bali.com`
matched almost everything and silently wiped 16 legitimate cards down to 4.
Caught before publish by re-reading the full card list, not after; fixed
with an exact-host check instead of substring matching.

Of the remaining venues, 3 had fewer than 3 menu items of any kind, and 4
were real businesses outside Bali (Los Angeles, Sydney, Newquay, and an
"Uttara" address that didn't map to a district) — caught by the same
geographic guard built for the spa harvest.

## The 20 that survived, apply with `new_venue_cards.sql`

| Venue | District | Has a numeric price? |
|---|---|---|
| Fire Restaurant | Seminyak | Yes — Fresh Lombok oysters, 75K IDR |
| Gajah Putih | Ubud | Yes — Pairing Wine Malam, 400K IDR |
| The Laneway Restaurant (at Peppers Seminyak) | Seminyak | Yes — Arak Cocktail, 100K IDR |
| myCHEF (private dining) | Canggu | Yes — Wine Pairing, 850K IDR |
| Makan Place | Legian | No — menu item names only |
| Melons (at The Samata, via Lifestyle Retreats) | Nusa Dua | No |
| Sundara | Jimbaran | No |
| Mades Warung | Seminyak | No |
| This Is Bali | Ubud | No |
| Kafe | Ubud | No |
| Hidden Gem Uluwatu | the Bukit | No |
| The Cave Restaurant (at The Edge) | the Bukit | No |
| The ONE Legian Hotel | Legian | No |
| Kekeb Restaurant | Nusa Dua | No |
| Santai Beach House | Nusa Dua | No |
| Bella | Canggu | No |
| menjamu | Seminyak | No |
| Gather | Canggu | No |
| Uma Garden | Canggu | No |
| Dua Umalas | Seminyak | No |

The 16 without a number still publish real facts — cuisine, address where
printed, opening hours, booking channel, named menu items — with every price
field left NULL rather than guessed (guardrail: unknown means `null`).

Dry-run against production (one row each, `begin`/`rollback`) done twice
before this file was written: `fire-restaurant-seminyak` (priced) and
`makan-place-kuta-legian` (unpriced) both inserted, verified, rolled back
cleanly.

## Data files

| File | What it is |
|---|---|
| `new_venue_cards.sql` | the 20 venue-record inserts, apply this |
| `bali_restaurant_venues.csv` | **all 45 crawled venues**, published or not — the full return on the ~830 credits spent |
| `bali_restaurant_items.csv` | 655 menu item rows for all 45 |
| `bali_restaurant_excluded.csv` | domains dropped before build (no name, no items at all) |
| `new_cards_rejected.json` | the 25 rejected cards with each reason, including the 17 confirmed blogs/directories |
