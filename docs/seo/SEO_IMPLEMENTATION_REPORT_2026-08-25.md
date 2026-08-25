# SEO Implementation Report - Other Bali - 2026-08-25

## Scope

This report covers on-site SEO implementation work for `otherbali.com` performed in `/Users/msnigmatullaeva/Code/other-bali-current`.

## Implemented Changes

| Area | Files | Change |
|---|---|---|
| Canonical site facts | `lib/site-origin-policy.ts` | Added one canonical brand/origin/contact fact source, including `CANONICAL_SITE_ORIGIN`, `OTHER_BALI_BRAND_NAME`, and `OTHER_BALI_SITE_FACTS`. |
| Sitemap | `app/sitemap.ts` | Replaced local hard-coded `BASE` with `CANONICAL_SITE_ORIGIN`. |
| Robots | `app/robots.ts` | Replaced hard-coded sitemap URL with `CANONICAL_SITE_ORIGIN`. |
| Sitewide metadata / Schema.org | `app/layout.tsx` | Organization and WebSite JSON-LD now use canonical constants and `hello@otherbali.com`. |
| Metadata titles | `app/page.tsx`, `app/for-venues/page.tsx`, `app/hotels/page.tsx`, `app/villas/page.tsx`, `app/list-your-property/page.tsx`, `app/my-day/page.tsx`, `app/admin/*`, `app/plan/shared/page.tsx` | Prevented duplicate `Other Bali` suffixes where titles already include the brand. |
| Logo accessibility | `components/OtherBaliLogo.tsx` | Added a complete accessible brand name and hid visual-only wordmark pieces from assistive text. |
| Regression tests | `components/OtherBaliLogo.test.mjs`, `lib/site-origin-policy-seo.test.mjs`, `lib/metadata-title-template.test.mjs`, `package.json` | Added fast SEO/accessibility contract tests to `test:t0:unit`. |
| SEO OS governance | `docs/seo/os/page-registry.json` | Refreshed registry from live sitemap with approved drift handling. |

## Verification

| Command | Result |
|---|---|
| `npm install` | Pass; dependencies installed. Full audit with dev dependencies currently reports 22 vulnerabilities. |
| `npm audit fix --omit=dev` | Partially applied; updated only transitive `nanoid` under `postcss` from 3.3.15 to 3.3.18. |
| `npm audit --omit=dev --audit-level=moderate` | Fails with 3 production vulnerabilities: Next, PostCSS, sharp. Fix requires `npm audit fix --force` and Next 16.3.2. |
| `npm run lint` | Pass with 1 warning: `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx` uses `<img>`. |
| `npm run typecheck` | Pass. |
| `npm run test:t0:unit` | Pass, 48 tests. |
| `npm test` | Pass, 252 tests plus `seo-os validate`. |
| `npm run seo:os:validate` | Pass, 1435 registry entries. |
| `npm run seo:os:check` | Pass, no sitemap drift. |
| `npm run seo:os:audit` | Pass, 39/39 production checks. |
| `npx impeccable detect` | Pass, no findings printed. |
| `VERCEL_ENV=production npm run build` | Pass. |
| Local production-like browser QA | Pass. |

## Local Browser QA Sample

| URL | Status | Title | Canonical | JSON-LD |
|---|---:|---|---|---:|
| `/` | 200 | `Other Bali - Curated Places, Routes & Trip Plans` | `https://www.otherbali.com` | 2 |
| `/my-day` | 200 | `Today in Bali - find a place for the moment you're in - Other Bali` | `https://www.otherbali.com/my-day` | 3 |
| `/seminyak/best-restaurants` | 200 | `Best restaurants in Seminyak - resident-curated dinner picks - Other Bali` | `https://www.otherbali.com/seminyak/best-restaurants` | 4 |

Note: the browser renders punctuation from the source title. This table uses ASCII punctuation for documentation only.

## Remaining Risks

- Production dependency audit still reports 3 vulnerabilities: Next, PostCSS, and sharp. The available fix requires `npm audit fix --force` and Next 16.3.2, which is outside the current `next: 16.2.10` pin and needs a separate compatibility pass.
- Full dependency audit including dev packages reports 22 vulnerabilities after dev dependencies are installed.
- The local metadata fixes are not live on production until deployment.
- No Google Search Console, GA4, Cloudflare/WAF logs, or GBP account data were available in this session.
