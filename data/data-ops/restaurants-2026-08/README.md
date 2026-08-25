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
website and a public menu — not literally "what Reddit recommends," but the
same kind of result the spa/rental harvests produced.

## The result is honestly small: 4 new venues

Not 200. Two things explain the gap:

1. **The category is already deep.** 941 restaurants/cafes/warungs/bars/
   beach clubs are already published. A district+pattern search mostly
   rediscovers what's already on the site — of 116 raw candidates, 527
   already-published domains were excluded before crawling even started, and
   after crawling the 59 new-to-us domains, most turned out to be content
   *about* restaurants, not restaurant sites.

2. **Two rounds of contamination, both caught before publish, not after:**
   - `travelfish.org`, `baliuntold.com`, `water-sports-bali.com` — a travel
     directory, an "unusual restaurants" listicle, and a watersports
     company's seafood-dinner tour package — all got flagged
     `is_restaurant_venue: true` by the extraction model and would have
     published as fake venues (one literally named itself "Jimbaran," the
     district, because the source was a directory page, not a restaurant).
   - `balifoodandtravel.com`, `remoteandafloat.com`, `almostlanding-bali.com`
     — three personal food-blog "X places to eat in Y" roundup posts. Their
     titles say it outright: "8 Kuta and Seminyak Warungs Where The Locals
     Eat," "Cheap eats in Sanur," "Jimbaran Seafood: Where To Eat." The model
     merged several different restaurants' menu items into one fake venue
     per blog post.

   Both classes slipped past discovery's listicle/directory filter (it only
   catches `best-`/`top-`/`guide`-style URL slugs) and had to be caught by
   hand in `restaurants/make_cards.py` — a domain blocklist plus a check
   that rejects a venue whose name is literally the district name (a
   directory-page tell).

Of the remaining 41 crawled venues, 30 had fewer than 3 priced menu items to
publish (restaurant sites lean on PDF/image menus or Instagram far more than
spa price lists do — text extraction has less to work with), and a further
4 were real businesses outside Bali (Los Angeles, Sydney, Newquay, and an
"Uttara" address that didn't map to a district) caught by the same
geographic guard built for the spa harvest.

## The 4 that survived, apply with `new_venue_cards.sql`

| Venue | District | Anchor |
|---|---|---|
| Fire Restaurant | Seminyak | Fresh Lombok oysters, 75K IDR |
| Gajah Putih | Ubud | Pairing Wine Malam, 400K IDR |
| The Laneway Restaurant (at Peppers Seminyak) | Seminyak | Arak Cocktail, 100K IDR |
| myCHEF (private dining) | Canggu | Wine Pairing, 850K IDR |

Dry-run against production (one row, `begin`/`rollback`) done before this
file was written: `fire-restaurant-seminyak` inserted, verified, rolled
back cleanly.

## Data files

| File | What it is |
|---|---|
| `new_venue_cards.sql` | the 4 venue-record inserts, apply this |
| `bali_restaurant_venues.csv` | all 45 built venues (4 published + 41 held back) |
| `bali_restaurant_items.csv` | 655 menu item rows |
| `bali_restaurant_excluded.csv` | domains dropped before build (no name, no items) |
| `new_cards_rejected.json` | the 41 rejected cards with each reason |
