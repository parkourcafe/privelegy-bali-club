# Technical foundations

100 points across eight categories. The SSR category is the one that decides
whether AI fetchers see anything at all — check it first and treat the rest as
ordinary SEO hygiene.

## Category 7 first: server-side rendering — 15 points

Most AI crawlers do not execute JavaScript. A client-rendered page returns a
near-empty shell to them regardless of how good the content is in a browser.
This is the single highest-leverage technical check for GEO.

```bash
curl -s https://www.otherbali.com/canggu | grep -c "<h2"
curl -s https://www.otherbali.com/canggu | grep -o '<title>[^<]*'
curl -s https://www.otherbali.com/canggu | grep -c 'application/ld+json'
```

| Check | Points |
|---|---|
| Main content in raw HTML | 8 |
| Meta tags and structured data in raw HTML | 4 |
| Internal links in raw HTML | 3 |

We are Next.js 16 App Router and `AGENTS.md` §7 requires Server Components for
public data rendering, so this should score 15. **Verify with curl rather than
assuming** — a page that drifted to a Client Component for an interaction and
took its data rendering with it fails silently, looks perfect in a browser, and
is invisible to GPTBot. That is the regression this check exists to catch.

Do not "fix" a low score by adding a prerendering service. The fix is moving
the data render back to a Server Component.

## Category 1: crawlability — 15 points

| Check | Points |
|---|---|
| robots.txt valid and complete | 3 |
| AI crawlers allowed | 5 |
| XML sitemap present and valid | 3 |
| Crawl depth within 3 clicks | 2 |
| No erroneous noindex | 2 |

AI crawler detail is in `references/crawlers.md`. Our sitemap is advertised at
`https://www.otherbali.com/sitemap.xml`.

On noindex: `/v/` redemption pages carry a deliberate `noindex` and must remain
crawlable so engines can read it. That is correct, not a finding.

## Category 2: indexability — 12 points

| Check | Points |
|---|---|
| Canonical tags correct | 3 |
| No duplicate content | 3 |
| Pagination handled | 2 |
| Hreflang correct (if applicable) | 2 |
| No index bloat | 2 |

Duplicate content is the live risk for us, and it is not this skill's to
resolve: programmatic district hubs and intent spokes can converge on the same
intent. `otherbali-district-seo-pipeline` owns cannibalization checks and the
one-URL-one-intent rule. Report overlap here; decide it there.

Hreflang: the repository ships UI chrome in six languages but publishes one
canonical English content set. Translated chrome over identical content is not
an hreflang case. Do not add hreflang annotations for locales that do not have
distinct content URLs — see the locale preservation note in `AGENTS.md`.

## Category 3: security — 10 points

| Header | Value | Points |
|---|---|---|
| HTTPS enforced, valid cert | — | 4 |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | 2 |
| `X-Content-Type-Options` | `nosniff` | 1 |
| `X-Frame-Options` | `DENY` or `SAMEORIGIN` | 1 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` or stricter | 1 |
| `Content-Security-Policy` | appropriate policy | 1 |

```bash
curl -sI https://www.otherbali.com/ | grep -i "strict-transport\|x-content-type\|x-frame\|referrer-policy\|content-security"
```

## Category 4: URL structure — 8 points

| Check | Points |
|---|---|
| Clean, readable URLs | 2 |
| Logical hierarchy | 2 |
| No redirect chains (max 1 hop) | 2 |
| Parameter handling configured | 2 |

Our hierarchy is already intentional — `/bali/<district>/<intent>`,
`/places/<slug>`, `/<pillar>`. Changes to URL shape are
`otherbali-district-seo-pipeline` decisions, not technical-audit decisions:
a URL is an approved artefact there, and renaming one for tidiness breaks
canonical and sitemap state.

## Category 5: mobile — 10 points

| Check | Points |
|---|---|
| Viewport meta correct | 3 |
| Responsive, no horizontal scroll | 3 |
| Tap targets sized | 2 |
| Font sizes legible | 2 |

`AGENTS.md` §7 already requires 44–46 px action targets and forbids
horizontal-scroll UI that hides required choices. These are product rules, not
audit suggestions — a finding here is a bug.

## Category 6: Core Web Vitals — 15 points

| Metric | Good | Needs work | Poor | Points |
|---|---|---|---|---|
| LCP | < 2.5s | 2.5–4.0s | > 4.0s | 5 |
| INP | < 200ms | 200–500ms | > 500ms | 5 |
| CLS | < 0.1 | 0.1–0.25 | > 0.25 | 5 |

INP replaced FID in March 2024 and measures all interactions, not just the
first.

Without CrUX field data, lab estimates only — say which you used. Do not report
a lab number as a field measurement.

Common fixes: LCP — preload the hero image, cut render-blocking CSS, size
images. INP — break long tasks, cut main-thread JS, defer non-critical
hydration. CLS — explicit dimensions on images and embeds, reserve space for
late-loading content, avoid inserting content above existing content.

The repository has `scripts/performance-boundary.test.mjs` in its default test
list; check what it already asserts before adding a new performance gate.

## Category 8: page speed and server — 15 points

| Check | Points |
|---|---|
| TTFB < 800ms | 3 |
| Page weight < 2MB | 2 |
| Images optimised (format, size, lazy) | 3 |
| JS bundles < 200KB compressed | 2 |
| Compression enabled (gzip/brotli) | 2 |
| Cache headers on static resources | 2 |

Image optimisation is the row with the most headroom on a photo-heavy
catalogue. Display routes through `venuePhotoUrlForDisplay` — optimise at that
boundary, and do not bypass it to serve a raw URL, because a future per-photo
gate is designed to take effect there without further code changes.
