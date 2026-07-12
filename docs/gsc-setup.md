# Google Search Console (GSC) — setup & measurement runbook

Everything technical is already in place. This doc is the checklist to finish the
connection and the plan for using the data. GSC is the demand-data layer the SEO
strategy (`docs/seo-strategy.md` §5) is waiting on — until it's on, we optimise
by venue-density heuristic instead of real search demand.

## Status — what's already done (in the repo / on prod)

- ✅ **Verification file** committed: `public/google701d47690a232c57.html`
  (serves at `https://otherbali.com/google701d47690a232c57.html`). This is the
  HTML-file verification method for a **URL-prefix** property.
- ✅ **Sitemap** live at `https://otherbali.com/sitemap.xml` — enumerates
  homepage, `/plan`, `/places`, the 4 district pillars + children, the `/bali`
  hubs + intent spokes, scenario landing pages, routes, and indexable venue
  pages. Regenerates per request (always current).
- ✅ **robots.txt** references the sitemap and allows all tourist surfaces
  (`app/robots.ts`); operational surfaces (`/admin`, `/api`, `/onboard`, `/me`,
  `/v`, `/partner`) are disallowed.
- ✅ **GA4** live (`G-F3TEVWTWX4`).

## Founder steps to finish the connection

These need a logged-in browser (can't be done from this environment).

1. **Verify the property in GSC.** In [search.google.com/search-console](https://search.google.com/search-console):
   add a **URL-prefix** property for `https://otherbali.com`. Choose the
   *HTML file* method — Google will look for the file above, which is already
   deployed, so verification should pass immediately. (Optional but recommended:
   also add a **Domain** property via DNS TXT for full-subdomain coverage.)
2. **Submit the sitemap.** GSC → *Sitemaps* → enter `sitemap.xml` → Submit.
3. **Link GSC to GA4** (optional, useful): GA4 Admin → *Product links* → *Search
   Console links* → link the property. Surfaces organic queries inside GA4.
4. **Authorize the Windsor.ai connector** (this is the piece flagged as blocked
   in earlier sessions). Windsor.ai needs an OAuth grant to read the GSC
   property; do it from the connector settings in an interactive session. Once
   authorized, GSC impressions/clicks/positions flow into our reporting and the
   measurement loop below becomes data-driven.

## What to watch once data flows (measurement loop)

Group performance by URL pattern (GSC → *Search results* → filter by page):

| URL group | Pattern | What it tells us |
|---|---|---|
| District pillars | `/canggu`, `/uluwatu`, `/ubud`, `/sanur` (+ children) | Head-term district demand |
| Programmatic hubs | `/bali/*` (Seminyak, Jimbaran, Nusa Dua) | Whether thin hubs earn impressions |
| Intent spokes | `/bali/*/*` | Long-tail "best {intent} in {district}" demand |
| Scenario pages | `/first-time-in-bali`, `/bali-for-a-month`, … | Trip-situation demand |
| Venue pages | `/places/*` (Uluwatu only, indexable) | Per-venue queries |

**The weekly/monthly workflow:**

1. **Striking distance.** Filter positions **5–15**: these pages already rank and
   a small on-page improvement can move them onto page one. Prioritise them.
2. **Query mining → new spokes.** Read the *Queries* for each district. Recurring
   "best X in {district}" queries with no dedicated page are candidates for a new
   intent spoke (extend `lib/intents.ts` / tag `jobs`) — the highest-ROI new
   pages, because demand is proven.
3. **Thin-page check.** Any hub/spoke with impressions but ~0 clicks over 8+
   weeks: improve the title/intro or merge it.
4. **Coverage.** GSC → *Pages*: confirm indexable pages are *Indexed* and that
   `noindex` pages (non-Uluwatu venue detail, `/list/*`, review rows) are
   correctly *Excluded by noindex* — not accidentally indexed or blocked.
5. **CTR.** Pages with high impressions but low CTR → rewrite the title/meta
   description (both are per-page and easy to change).

## Notes / gotchas

- Positions in GSC lag ~2–3 days; don't react to single-day swings.
- After a deploy that adds pages, re-submit or wait for GSC to recrawl the
  sitemap (usually days). Use *URL Inspection → Request indexing* for a priority
  page.
- Keep the verification file in `public/` forever — removing it un-verifies the
  property.
