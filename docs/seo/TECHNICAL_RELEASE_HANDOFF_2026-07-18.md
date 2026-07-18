# Technical SEO release handoff — 2026-07-18

## Release result

Branch: `agent/seo-top5-foundation`

This release establishes the technical boundary required before the frozen
ten-page content and earned-link cycle begins. It does not merge, deploy, change
DNS or Vercel domains, enable analytics, publish founder identity, or send
outreach.

Implemented:

- valid `/places?page=N` pages receive page-specific canonical and Open Graph
  URLs;
- invalid, malformed and out-of-range catalogue pages return `404`;
- filtered catalogue states are `noindex,follow` and consolidate to a stable
  canonical;
- static and venue sitemap dates use reviewed dates or
  `venues.last_verified_at`, never the build date;
- production Vercel aliases redirect to `https://www.otherbali.com`, while
  review and preview hosts fail closed with `noindex, nofollow, noarchive`;
- Maps, Reserve, WhatsApp, Menu and Delivery retain PII-free event contracts;
- GA4 loading now requires explicit analytics consent;
- TablePilot Reserve emits the safe acquisition event without changing
  TablePilot's role as the fulfilment source of truth;
- the GSC baseline, frozen ten-page set and founder-review trust copy are
  recorded under `docs/seo/`.

## Validation performed

| Command or check | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run lint` | Passed; one pre-existing unrelated `<img>` warning in the partner photo review panel |
| `npm test` | Passed: 129 tests, 0 failures |
| `npm run build` | Passed with Next.js 16.2.10 |
| `git diff --check` | Passed |
| invalid catalogue page smoke | `404` |
| production Vercel-host smoke | `308` to canonical `www` URL with path/query preserved |
| review-host smoke | `200` plus `X-Robots-Tag: noindex, nofollow, noarchive` |
| catalogue metadata smoke | canonical, `og:url` and robots match the requested state |
| sitemap smoke | reviewed `lastmod` values present; unknown dates omitted |

## Search Console truth

The `https://www.otherbali.com/` property was read with the **28 days** control
selected. Google currently exposes only 2026-07-11 through 2026-07-16:

- 3 clicks;
- 141 impressions;
- 2.1% CTR;
- average position 28.4;
- 68 queries and 47 pages with data.

The first complete rolling 28-day baseline can exist no earlier than
2026-08-08, subject to Search Console delay. That checkpoint must update the
baseline document without silently replacing the six-day starting record.

## Founder-only release sequence

1. Review and merge the PR through the protected `main` branch after CI passes.
2. Deploy the merged `main` SHA to the production Vercel project.
3. Detach `review.otherbali.com` from the production project and keep it on an
   isolated password-gated, noindex deployment. Remove redundant production
   aliases where Vercel permits; the code redirect remains a safety net.
4. Run production smoke checks for `/places`, valid pagination, an invalid page,
   `/plan`, sitemap dates, all known aliases and the review host.
5. Approve the privacy wording, set `NEXT_PUBLIC_ENABLE_ANALYTICS=1`, and redeploy
   from `main`. Verify that **Essential only** loads no Google script.
6. In GA4, create event-scoped custom dimensions for `action`, `provider` and
   `venue_slug`; verify Maps, Reserve, WhatsApp, Menu and Delivery from a
   consenting Organic Search session.
7. Request indexing for changed URLs in the frozen ten-page set only after the
   production smoke passes.
8. Approve the exact Founder/Editor name, biography, experience claims, portrait
   rights, official profiles and corrections inbox before trust pages become
   public routes.

## Next cycle gate

Content strengthening and earned-link work starts only after steps 1–7 above
are confirmed. The first content batch is:

1. `/canggu/work-friendly-cafes`
2. `/canggu/best-brunch`
3. `/canggu/best-restaurants`

No backlink or venue outreach is authorized by this handoff.
