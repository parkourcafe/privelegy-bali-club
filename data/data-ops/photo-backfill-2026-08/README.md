# Photo backfill — resolved via Firecrawl (2026-08-26)

## Why this exists

By 2026-08-25 end of day, 355 published venues had `photo_status = 'missing'`
(250 with an `official_url` on file, 105 without one). The founder ran
`scripts/collect-venue-photos-storage.mjs` locally (plain `fetch()` against
each venue's own site) and got 18/554 uploaded before this file was written,
then 1 more on a second pass — a ~3% hit rate, mostly killed by anti-bot
blocks and JS-rendered image tags a plain `fetch()` can't see. Rejected
explicitly as a final state: **"это вообще исключено"** (leaving venues
without a photo is out of the question).

This session cannot fetch arbitrary venue sites or raw image bytes itself —
confirmed structurally: the sandbox's outbound proxy denies CONNECT to
arbitrary external domains, and Firecrawl explicitly refuses to fetch binary
files (`SCRAPE_UNSUPPORTED_FILE_ERROR`). So the fix is a two-step split:

1. **Server-side (done here):** ask Firecrawl to load each venue's site —
   it renders JS and gets past blocks a plain `fetch()` can't — and read back
   the image URLs it actually saw (`og:image` / `twitter:image` meta tags,
   plus real `![]()` image links in the rendered page). Cost: ~1 credit per
   venue (`formats:["markdown"]`, no JSON-schema extraction — metadata comes
   back free on every scrape).
2. **Locally (founder runs `scripts/upload-resolved-photos.mjs`):** download
   the already-confirmed URLs and upload to Supabase Storage. Much simpler
   and much higher hit rate than blind page-scraping, because every URL here
   was already seen inside a fully-rendered page.

## What this pass covered

Only the **250 venues with an `official_url`** — the 105 with no site on
file need a different approach (find one, or accept there may not be one)
and weren't touched here.

```
attempted:        250
resolved (any candidate found): 219   (88%)
no image found in rendered page: 17
site unreachable / DNS / timeout: 14
```

## Vetting pass — do not skip

219 "resolved" is not 219 safe-to-publish. One live example caught by eye
before any filtering: `2-aces-massage-and-spa-seminyak`'s `official_url` in
the database is `corner.inc` — an unrelated fintech app. Its "photo
candidates" were app-store screenshots. That's not a Firecrawl mistake, it's
a stale/wrong `official_url` already sitting in the row from an earlier
harvest — and it would have been auto-published as this venue's photo.

So every resolved candidate was checked for whether the venue's own name
shares a real word with its resolved domain (same failure class as the
domain/brand-word guards built during today's nightlife harvest). Split:

- **`resolved_photo_candidates.json` — 154 venues, vetted.** Domain clearly
  matches the venue name (e.g. `adda-yoga` → `addayogabali.com`). Safe for
  `scripts/upload-resolved-photos.mjs` to publish automatically.
- **`flagged_needs_manual_review.json` — 65 venues, held back.** No shared
  word between slug and domain. Most of these are very likely correct — a
  hotel-brand spa/gym resolving to the hotel chain's own domain
  (`andaz-bali-fitness-centre` → `hyatt.com`, `st-regis-bali-yoga` →
  `marriott.com`), or a venue housed inside a resort with a different name
  (`chatraka-spa-ubud` → `tejapranaresort.com`, `manori-spa-canggu` →
  `imanivillas.com`) — plus a handful of real venues whose slug is just too
  generic to match anything (`no-1-wellness-seminyak`, `spa-bali-seminyak`).
  But the same filter that would have blocked `corner.inc` also catches
  these, and telling correct-but-differently-named apart from wrong-domain
  automatically isn't reliable at this pass. **Not uploaded.** A person (or
  a future session, spot-checking with a browser) should glance through this
  list before deciding whether to add each one to the vetted file and re-run
  the uploader.

## How to finish this

```
SUPABASE_SERVICE_ROLE_KEY=<paste the key> node scripts/upload-resolved-photos.mjs
```

Same setup as before (`npm install`, key from Supabase dashboard → Project
Settings → API → service_role secret, project `egkdapqwkfprtyqvvnso`). Safe
to re-run — anything already uploaded is skipped (`photo_status` stops being
`'missing'` after a successful update), so re-running after reviewing
`flagged_needs_manual_review.json` and moving some entries into
`resolved_photo_candidates.json` only processes what's newly added.

## What's still not covered

- The **65 flagged** venues above, pending a manual look.
- The **31 unresolved** venues (site down, DNS dead, or genuinely no image
  in the rendered page) — see `resolved_photo_candidates.json`'s source run
  for the full list; a few (`hammerheadgymbali.com`,
  `www.marrambafitness.com`, `www.polestudiobali.com`) look like dead
  domains and may need their `official_url` corrected or cleared.
- The **105 venues with no `official_url` at all** — out of scope for this
  pass; needs either finding each one a website/Instagram or accepting no
  photo is possible for some of them.

## Files

- `resolved_photo_candidates.json` — 154 vetted venues, up to 4 candidate
  image URLs each, ranked best first. Read by
  `scripts/upload-resolved-photos.mjs`.
- `flagged_needs_manual_review.json` — 65 venues held back, with the reason
  (`no_shared_word_between_slug_and_domain`) and the same candidate URLs, for
  a person to check before deciding to publish.
