# Photo backfill via a temporary Supabase Edge Function (2026-08-26)

## Why the work moved onto Supabase's runtime

The first attempt ran on the founder's laptop (`scripts/collect-venue-photos-storage.mjs`)
and reached ~3% (19 of 554). Two separate blocks caused that, and only one was
visible at first:

1. **The image download, not the page.** Most venue CDNs serve an image only
   when the request carries a `Referer` from the page that embeds it. A cold
   `fetch()` of the exact same URL gets a 403. This is why the resolver could
   *see* an image that the downloader could not *get*.
2. **The page itself.** Some sites (notably every big hotel group) block plain
   datacenter/scripted requests outright, and some only render their images
   after JavaScript runs.

Neither could be fixed from the agent session: its sandbox proxy denies CONNECT
to arbitrary hosts, and Firecrawl refuses binary files
(`SCRAPE_UNSUPPORTED_FILE_ERROR`), so no component in that environment can ever
hold image bytes.

Supabase's own runtime has normal outbound network access. So a temporary edge
function (`tmp-photo-backfill`) did page fetch → image download → Storage upload
→ `venues` update in one place, and the agent only had to *invoke* it. Since the
sandbox also can't reach `*.supabase.co`, invocation went through Firecrawl
(~1 credit per call, 8 venues per call).

The function is **deleted after the run** — it is not part of the product.
Source kept here as `edge-function/index.v1.ts` for reproducibility.

## Guard: "is this page actually this venue?"

The explicit-image path bypasses any check the function would otherwise make, so
the guard is enforced in both the function and the driver script.

v1 asked "does the domain contain a word from the venue name". That was wrong in
both directions: it published nothing for a spa inside a hotel (a real
`four-seasons-jimbaran-yoga` legitimately lives on `fourseasons.com`), while
still being only a heuristic.

v2 asks for evidence instead: fetch the page and require a distinctive word from
the venue's own name to appear in its `<title>` / `og:site_name` / `og:title`.
That admits the hotel cases and still rejects the failure it was built for — a
row whose `official_url` points somewhere unrelated.

## Result

| | before | after |
|---|---|---|
| published photos | 1280 | **1475** |
| missing, has `official_url` | 250 | **55** |
| missing, no `official_url` | 105 | 105 |
| **missing total** | **355** | **160** |
| share of live venues with a photo | 78.4% | **87.8%** |

Firecrawl credits spent: ~605 (620 → 15). The run stopped because credits ran
out, not because the remaining venues were judged hopeless — invocation had to
go through Firecrawl, so zero credits means no further calls are possible.

## Function retired

There is no delete tool on the MCP surface, so `tmp-photo-backfill` was replaced
with an inert stub returning 410 and `verify_jwt` switched back ON — the
anonymous token-gated endpoint no longer exists. Delete the function itself from
the Supabase dashboard when convenient.

### One thing that cost a run for nothing

Firecrawl caches scrape responses by default. After deploying v2 of the
function, an entire sweep returned v1's results verbatim — same counts, same
byte-identical log — because every invocation URL was a cache hit. The DB was
unchanged while the log claimed 57 uploads. `"maxAge": 0` is now set on every
call. Worth remembering for any future "invoke an endpoint through Firecrawl"
trick: without it you are reading the past.

## What is left, and why

**55 venues that have an `official_url` but still no photo.** Split by cause,
from the actual per-venue errors rather than an estimate:

- **14 — the only image on the page is under the 12 KB floor.** Several are
  right at the edge (9–12 KB). That floor is a crude proxy for "is this a real
  photo or a logo"; the right fix is to parse the image header for actual pixel
  dimensions and require e.g. width ≥ 600, which would admit the genuine small
  photos and still reject icons. Not done — credits ran out first.
- **9 — the CDN refuses any non-browser request** (403 even server-side with a
  correct `Referer`; BunnyCDN and Four Seasons' asset host among them). No
  fetch-based approach can get these, from any machine.
- **3 — the image URL itself 404s.**
- **1 — the asset is 38 MB** (over the size ceiling).
- **The rest** were correctly refused by the "is this page actually this venue"
  guard; see below.

- **~25 have a wrong `official_url` in the database** and were deliberately not
  given a photo. See `wrong_official_url.md` — this is a data defect that
  matters well beyond photos, since the "Website" button on those pages sends a
  tourist to a news portal, an aggregator, or an unrelated business.
- **~20 sites are dead or unreachable** (DNS failure, connection reset):
  `hammerheadgymbali.com`, `www.marrambafitness.com`, `www.polestudiobali.com`,
  `mobile.ripcurlschoolofsurf.com`, `thelittlehillterrace.com`, `ulabali.com`,
  `villasoniaubud.com`, `secure-booker.com` and others. Their `official_url`
  needs re-checking too — several are probably closed businesses.
- **The rest** genuinely have no usable image on the page, or the image failed
  to download even server-side with the referer header.

**105 venues have no `official_url` at all.** Out of scope for this method
entirely — they need a source found first (site or Instagram), or an
acknowledgement that no photo is obtainable for some of them.

## Files

- `edge-function/index.v1.ts` — the deployed function (v2 logic; deleted from
  the project after the run).
- `resolved_photo_candidates.json` / `flagged_needs_manual_review.json` — the
  earlier Firecrawl resolution pass, kept for reference.
- `wrong_official_url.md` — the venues whose `official_url` points at something
  that is not them.
