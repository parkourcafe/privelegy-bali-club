# Search baseline and final priority pages — 2026-07-18

## GSC baseline

Property: `https://www.otherbali.com/`

The Search Console **28 days** control was selected on 2026-07-18. Google has
only six reportable days so far, 2026-07-11 through 2026-07-16.

| Metric | Baseline |
|---|---:|
| Clicks | 3 |
| Impressions | 141 |
| CTR | 2.1% |
| Average position | 28.4 |
| Queries with data | 68 |
| Pages with data | 47 |

This is the valid starting baseline for the 28-day report window, but not yet a
full 28 calendar-day history. The first complete window can mature no earlier
than 2026-08-08, subject to Google's reporting delay.

Observed page leaders:

- `/` — 2 clicks / 14 impressions
- `/places/jari-menari-seminyak` — 1 click / 4 impressions
- `/canggu/work-friendly-cafes` — 0 clicks / 9 impressions

Observed query leaders include `pizza fabbrica canggu` (5 impressions),
`jari menari seminyak` (3), `crate cafe bali` (3), and `luigi's canggu` (3).

Legacy `/v/*/redeem` URLs account for several impressions. They are not SEO
landing pages and already return `X-Robots-Tag: noindex, nofollow, noarchive`.
They stay outside the target set and should disappear as Google recrawls them.

## Final ten-page set

This list is frozen for the first Top-5 cycle. A page may be replaced only by a
documented GSC decision after the first complete 28-day window.

| # | URL | Primary intent | Why now |
|---:|---|---|---|
| 1 | `/canggu/work-friendly-cafes` | work-friendly cafes Canggu | Already has 9 impressions; closest non-brand opportunity |
| 2 | `/canggu/best-brunch` | best brunch Canggu | Strong local-commercial intent and a complete curated page |
| 3 | `/canggu/best-restaurants` | best restaurants Canggu | Core district dining query and internal-link hub |
| 4 | `/ubud/best-cafes-coffee` | best cafes Ubud | High-fit district/category intent |
| 5 | `/uluwatu/beach-clubs-sunset` | Uluwatu beach clubs / sunset | Distinctive evidence-backed comparison intent |
| 6 | `/seminyak/best-restaurants` | best restaurants Seminyak | Commercial district query with strong venue inventory |
| 7 | `/best-warungs-in-bali` | best warungs Bali | Island-wide local-food authority surface |
| 8 | `/where-to-watch-sunset-in-bali` | best sunset Bali | Island-wide scenario query with district spokes |
| 9 | `/places/jari-menari-seminyak` | Jari Menari Seminyak | First exact venue page with an organic click |
| 10 | `/places/pizza-fabbrica` | Pizza Fabbrica Canggu | Highest observed exact-venue query impressions |

## Gate to content strengthening

Do not start bulk copy or backlink outreach until the technical PR is merged and
the production smoke check confirms:

1. invalid pagination is 404;
2. canonical and Open Graph URLs match;
3. noncanonical hosts redirect or return `noindex`;
4. sitemap `lastmod` is accurate rather than synthetic;
5. consent-gated action measurement is enabled and visible in GA4.

After that gate, work in this order:

1. Improve titles/intros/FAQ/internal links for pages 1–3.
2. Improve pages 4–8 with intent-specific comparisons and official-source
   update blocks.
3. Improve venue pages 9–10 with official facts, menu/actions and clear
   district context.
4. Add About/Methodology/Corrections and the founder-approved author entity.
5. Request indexing for changed URLs.
6. Begin earned-link outreach only after each destination page passes editorial
   and source review.

## KPI cadence

- Daily: crawl/status/canonical/sitemap regressions and production action event
  presence.
- Weekly: clicks, impressions, CTR, position, indexed pages, and organic action
  events for the frozen ten-page set.
- 2026-08-08 or later: capture the first complete rolling 28-day comparison and
  decide whether pages 9–10 remain the best venue opportunities.

