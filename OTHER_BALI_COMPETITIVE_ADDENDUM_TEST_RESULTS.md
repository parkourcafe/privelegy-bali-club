# Other Bali Competitive Addendum — T0 Test Results

Date: 2026-07-24  
Baseline: `291414c`  
Scope: diagnostics only; no addendum implementation.

## Automated verification

| Check | Result | Evidence |
|---|---|---|
| Dependency install | PASS | `npm ci`: 505 packages, 0 vulnerabilities |
| T0 unit/boundary suite | PASS | `npm run test:t0:unit`: 48/48 |
| Production T0 live smoke | PASS | `npm run test:t0:live`: 12 positive + 1 negative, 39 fetches, 0 violations |
| Robots | PASS | 200 for browser, generic crawler and Googlebot smartphone |
| Sitemap | PASS | 200; 690 URLs |
| TypeScript | PASS | `npm run typecheck` |
| ESLint | PASS WITH WARNING | 0 errors; one pre-existing `@next/next/no-img-element` warning in `PhotoReviewPanel.tsx` |
| Production build | PASS | Next.js 16.2.11; 153 static pages generated; route table emitted |

Build side effect: `prebuild` downloaded scene assets, including `public/scenes/venues-story.mp4`. These are generated local artifacts, not intentional T0 product changes.

Clean-local media note: the initial `npm run dev` browser run preceded `prebuild`, so scene image requests returned local 404s. The subsequent production build fetched the required scene assets and passed. Production browser QA rendered the scene media. The generated MP4 was removed after testing and is not part of the report diff.

## Production T0 sample evidence

The live smoke verified HTTP 200, meaningful initial HTML, title, canonical, robots, sitemap inclusion and three-UA content equivalence for twelve positive samples across Bali, including:

- `monkey-bar-bali`;
- `desa-wisata-penglipuran`;
- `amo-spa-canggu-canggu`;
- `atlas-beach-club`;
- `baked-pererenan`;
- `donna-ubud`;
- `pantai-lovina`;
- `nusa-dua-beach-grill`;
- `crumb-and-coaster-kuta`;
- `alchemy-uluwatu`;
- `koa-shala-sanur`;
- `kilo-kitchen-bali-seminyak`.

Negative control:

- `/places/adda-yoga` → 404 for all three UAs, absent from sitemap, no canonical.

## Browser verification method

Browser: Codex in-app Chromium surface.  
Desktop viewport: `1440 × 900`.  
Mobile viewport: `390 × 844`.  
Targets: local Next.js development server and `https://www.otherbali.com`.

For each requested route, verification captured:

- final URL;
- title;
- H1;
- canonical;
- robots;
- key actions;
- place links;
- media/freshness labels;
- horizontal overflow.

## Desktop results

| Route | Local | Production | Canonical/robots | Overflow | Result |
|---|---|---|---|---|---|
| `/` | Renders | Renders | canonical home | None | PASS |
| `/my-day` | Renders; no prod dataset | Renders real shortlist | self-canonical | None | PASS |
| `/places` | 0-state | 68 published places observed | self-canonical, index/follow | None | PASS |
| `/plan` | Renders | Renders routes/data | self-canonical | None | PASS |
| `/for-venues` | Renders | Renders | self-canonical | None | ROUTE PASS |
| `/villas` | Renders | Renders | self-canonical | None | PASS |
| `/my-bali` | 404 | 404 | no canonical, noindex | None | FAIL |
| `/me` | Renders | Renders | noindex/nofollow | None | PASS as AS-IS private carrier |

## Mobile results

At `390 × 844`, no horizontal overflow was detected on:

- `/`;
- `/my-day`;
- `/places`;
- `/places/12-kitchen-and-wine`;
- `/plan`;
- `/for-venues`;
- `/villas`;
- `/my-bali`;
- `/me`.

### Homepage

- H1: `The right place for the moment you’re in.`
- Main actions: `Find a place now`, `Plan my trip`.
- Canonical: home.
- Result: responsive PASS; addendum copy/mechanism PARTIAL.

### `/my-day`

- H1: `Find a place for today in Bali`.
- Real cards and Maps actions render.
- Entity Maps URLs label `Open in Google Maps`.
- Search fallbacks label `Search in Google Maps`.
- Honest media pending label observed.
- Result: responsive/action PASS; result-role and cross-district requirements FAIL.

### `/places`

- H1: `Explore Bali`.
- 68 published places observed in structured/live page content.
- Honest media-pending labels observed.
- Result: responsive/publication PASS.

### `/places/12-kitchen-and-wine`

- HTTP-rendered page visible.
- H1 and self-canonical correct.
- index/follow.
- Save and Add to trip visible.
- official website and Maps action visible.
- quick decision and similar places visible.
- no “Something changed?” issue flow found.
- no public media provenance label or scoped freshness explanation found.
- Result: route/indexability PASS; addendum trust completeness FAIL.

### `/plan`

- Future-planning language visible.
- 3/5/7-day starters and ready-made routes render.
- Add to trip and Maps actions render.
- verified-date labels appear for some records.
- Result: PASS as future planning carrier.

### `/for-venues`

- Listing and owner-update paths visible.
- Results language distinguishes clicks from bookings/visits/sales.
- Current form is not the proposed two-field lookup.
- “2 months free” money-model conflict is visible.
- Result: functional PARTIAL; money-model FAIL.

### `/villas`

- Distribution/partner surface renders.
- No QR guest-guide demo was implemented or tested, as required by Gate 0 restrictions.
- Result: current route PASS; addendum QR requirement DEFERRED.

### `/my-bali` and `/me`

- `/my-bali`: 404, noindex.
- `/me`: private anonymous shortlist, noindex/nofollow.
- Result: canonical target FAIL; AS-IS carrier confirmed.

## Local data limitation

The clean checkout intentionally contains no production Supabase credentials. Local `/places` reports 0 published places. This is a truthful empty state but cannot verify production place data. Production browser checks and the read-only live T0 smoke provide that evidence instead.

## Test gaps identified

No existing automated acceptance coverage was found for:

- `/my-bali` preservation decision;
- exactly three Today roles;
- prohibition of implicit cross-area primary results;
- issue-report context/events;
- media provenance labels;
- public “Freshly checked” derivation;
- canonical Offer/confirmed-extra UI contract;
- two-field claim lookup;
- villa property-context QR;
- canonical money-copy scan rejecting “2 months free”;
- removal/disablement of public sponsored contracts.

These are proposed P0/P1 tests only after the corresponding canonical decisions. No tests were added in Gate 0.

## Final test verdict

```text
ENGINEERING_T0_INDEXABILITY: PASS
LOCAL_BUILD: PASS
DESKTOP_QA: PASS_WITH_PRODUCT_GAPS
MOBILE_QA: PASS_WITH_PRODUCT_GAPS
CANONICAL_URL_SAFETY: FAIL
DATA_TRUTHFULNESS: FAIL
MONEY_MODEL_CONSISTENCY: FAIL
READY_FOR_P0_IMPLEMENTATION: NO
```
