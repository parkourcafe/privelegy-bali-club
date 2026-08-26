# Brief: find photos for 160 Other Bali venues

Companion file: `venues_missing_photos.csv` (160 rows, one per venue).

These are live, published venues on Other Bali that currently show no photo.
Everything reachable by automated fetching has already been collected — these
160 are what is left, so expect this to need a real browser, Google Maps, or the
venue's Instagram rather than a script.

## What to return

One row per venue, same `slug` as given (the `slug` is the join key — do not
change, translate, or re-derive it):

| column | meaning |
|---|---|
| `slug` | copied verbatim from the input CSV |
| `photo_url` | direct link to ONE image file (`.jpg`/`.jpeg`/`.png`/`.webp`), publicly reachable, no login |
| `source_page_url` | the page the photo was found on |
| `source_type` | `official_site` / `instagram` / `google_maps` / `other` |
| `notes` | anything uncertain, or why no photo was found |

If no photo can be found for a venue, still return the row with `photo_url`
empty and a note. **A blank is a usable answer. A wrong photo is not** — see
below.

## Hard requirements

1. **The photo must be of THAT venue.** Not a stock photo of Bali, not a generic
   spa/massage image, not another branch, not the hotel next door. If the venue
   is a spa or gym inside a hotel, a photo of that spa/gym is right; a generic
   hotel exterior is acceptable only if nothing else exists — say so in `notes`.

2. **Do not trust the `official_url` column.** Roughly 29 of these rows have a
   wrong website on file — it points at a news portal, a booking aggregator, a
   travel blog, or an unrelated company. This is a known defect in our data.
   Verify that the page actually names the venue before taking anything from it.
   **If the site on file is wrong, put the correct one in `notes`** — that is
   valuable to us on its own.

3. **Minimum size 600 px on the long side.** Below that it renders badly. Prefer
   the largest available version. Avoid logos, icons, flags, screenshots of
   menus, and pictures that are mostly text.

4. **A direct image link, not a page.** `https://site.com/img/hero.jpg` — not
   `https://site.com/gallery`. Check the link opens the image on its own.

5. **No Google review photos and no review-derived content.** A photo from the
   venue's own Google Business listing (posted by the venue) is fine; a photo
   uploaded by a reviewer is not.

6. **One photo per venue is enough.** A second is a bonus, not a requirement.

## What is in the CSV

160 venues. What we already have on file for each:

- **55** have a website (but see requirement 2 — some are wrong)
- **44** have an Instagram link
- **73** have a Google Maps link
- **77** have neither website nor Instagram — these are the hard ones and will
  need searching by name + district

By district: Ubud 42, Canggu 20, Seminyak 19, Sanur 17, Uluwatu-Bukit 17,
Kuta-Legian 16, Nusa Dua 11, Jimbaran 8, Tabanan 3, Bangli 2, Lovina 2, Amed 1,
Denpasar 1, Munduk 1.

By type: restaurant 69, spa 25, cafe 19, fitness 18, beauty 7, warung 7, yoga 7,
rental 5, bar 1, surf 1, hookah lounge 1.

## Known-hard cases

Some of these have already been confirmed impossible to fetch automatically, so
do not treat a failure as your mistake:

- A handful of CDNs (e.g. BunnyCDN, Four Seasons' asset host) return 403 to
  anything that is not a real browser. Opening the page in a browser and saving
  the image works; scripted download does not.
- Several sites are simply dead (`hammerheadgymbali.com`,
  `www.marrambafitness.com`, `www.polestudiobali.com`, `thelittlehillterrace.com`,
  `ulabali.com`, `villasoniaubud.com`). Some of these venues may have closed —
  **if a venue looks permanently closed, say so in `notes`.** That is more useful
  to us than a photo.

## Priority if the whole list is too much

Ubud, Canggu and Seminyak first (81 of the 160) — highest traffic. Within those,
restaurants and cafes before fitness and beauty.
