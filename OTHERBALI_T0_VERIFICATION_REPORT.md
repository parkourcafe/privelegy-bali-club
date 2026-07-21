# Other Bali T0 Indexability Verification Report

- **Verification date:** 2026-07-21 (Asia/Makassar / WITA)
- **Repository:** `parkourcafe/privelegy-bali-club`
- **Working branch:** `codex/otherbali-phase0-t0-2026-07-21`
- **Production/base source:** `5d62fbdd94be63e01dac8dfdcab28b2b94133fc2` (`origin/main` at the start of this T0 branch)
- **T0 implementation commit:** `a9fd35d` (`fix: align venue detail and sitemap eligibility`)
- **T0 regression commit / verified branch HEAD:** `38c34ee` (`test: add T0 indexability regression coverage`)
- **Production origin:** `https://www.otherbali.com`
- **Scope:** T0 venue-detail rendering and indexability consistency only

## 1. Executive verdict

**Pre-deployment engineering acceptance passes; operational closure is still pending.**

The already-deployed request-rendering recovery for `/places/[slug]` remains the demonstrated fix for the historical cold-render HTTP 500 incident. This branch does not replace or broaden that recovery. It closes the separately proven 518-route/517-sitemap consistency gap by admitting the valid `villa` category at the structural boundary, applying the same structural-plus-publication predicate to the detail and catalogue paths, and providing safe venue presentation and metadata for that category.

The production baseline audit passed for the existing 12 positive samples plus one negative control. The local canonical-host branch audit passed for those samples plus `big-dragon-villas-ubud`: HTTP 200, useful server HTML, expected H1, defined title, unique self-canonical, explicit `index,follow`, three-user-agent content equivalence, crawler allowance, and sitemap inclusion. The held `adda-yoga` control remained 404/noindex and absent from the sitemap.

No production deployment was performed by this branch. The projected post-deployment acceptance-complete count of **518** venue URLs and projected sitemap total of **668** are expectations supported by the local audit, not observations of production. Google Search Console (GSC) Live URL inspection is also unverified. Therefore T0 must not be described as operationally closed until deployment, production re-verification, and the GSC check are complete.

## 2. Evidence rules and environments

| Label | Meaning |
|---|---|
| **FACT — production** | Directly observed in production HTTP, deployment/log evidence, or read-only production SQL. |
| **FACT — branch/local** | Directly observed in the current branch source, automated checks, build output, or the local canonical-host audit. |
| **INFERENCE / EXPECTATION** | A conclusion derived from facts, including a predicted production result after deployment. |
| **UNVERIFIED** | Requires a deployment or authenticated external system that was not used. |

The two HTTP acceptance runs are intentionally separate:

- **Production baseline:** current deployed `www.otherbali.com`; checked at `2026-07-21T08:55:37.134Z`; it does not contain this branch's villa-boundary changes.
- **Branch/local:** commit `38c34ee` served at transport `http://127.0.0.1:3100` with `VERCEL_ENV=production`; the audit's custom fetch changed transport only, retained the logical origin `https://www.otherbali.com`, and sent `X-Forwarded-Host: www.otherbali.com`. This preserves the production canonical, robots, and proxy assertions while exercising local branch code. The final clean-build run was checked at `2026-07-21T09:09:28.133Z` and is not a public deployment.

The historical diagnosis and production source/deployment evidence are recorded in `OTHERBALI_T0_INDEXABILITY_DIAGNOSIS.md`. The pre-change repository and counter snapshot are recorded in `OTHERBALI_REPOSITORY_REALITY_MAP_2026-07-21.md`.

## 3. Root-cause recap

### 3.1 Historical HTTP 500 incident

**FACT — production.** The failing venue route combined on-demand ISR/SSG (`revalidate = 300` and an empty `generateStaticParams()`) with request-bound locale resolution through `RootLayout → getLocale() → headers()`. Cold renders failed with `DYNAMIC_SERVER_USAGE` and HTTP 500. A secondary-read fallback deployment retained the static route classification and did not stop those failures.

**FACT — production.** Commit `5d62fbdd…`, already deployed before this branch, removed the venue route's ISR/static-params contract and declared `dynamic = "force-dynamic"`. The Vercel build classification changed from SSG to Dynamic, and the bounded post-recovery production log audit found zero `/places/*` HTTP 500 and zero `DYNAMIC_SERVER_USAGE` events in the checked window.

**CAUSAL INFERENCE.** The intervention evidence identifies the request-bound locale plus on-demand static rendering combination as the root cause. Retained logs do not contain an unsanitized stack naming the exact `headers()` frame, so that frame-level statement is not presented as a direct fact.

The recovery contract remains explicit at `app/places/[slug]/page.tsx:34-39`, and its regression boundary is asserted at `scripts/performance-boundary.test.mjs:67-81`.

### 3.2 Separate gate mismatch addressed by this branch

**FACT — production before this branch.** `big-dragon-villas-ubud` returned HTTP 200 with an H1, self-canonical, and route metadata `index,follow`, but it was absent from the sitemap and the crawled non-venue internal-link graph. Its database category was `villa`, which was missing from the repository `VenueCategory` union and structural allowlist. Its production title consequently contained `undefined`.

This mismatch was not the cause of the historical 500 incident. The branch aligns a valid existing record with the repository's public structural and presentation boundaries; it does not add or publish a database record.

## 4. Exact code changes

### 4.1 One shared eligibility boundary

- `lib/types.ts:22-36` adds `villa` to `VenueCategory`.
- `lib/venue-validation.ts:26-48` adds `villa` to the public category allowlist and adds a compile-time exhaustiveness guard so future `VenueCategory` additions cannot silently be omitted from validation.
- `lib/publication.ts:62-70` makes `isVenueIndexable()` require both structural renderability and the existing publication status. Unknown or malformed runtime categories therefore cannot receive the indexable result merely by having editorial fields.
- `lib/data.ts:587-593` makes the detail-page public-readiness gate delegate to `isVenueIndexable()`. The existing catalogue still passes through `keepRenderableVenues()` at `lib/data.ts:646-657`, while `app/sitemap.ts:21-30` continues to filter that catalogue with the same indexability predicate.

No publication requirement was weakened: active database status, database `published` status, decision-ready editorial fields, and the authoritative Uluwatu registry override remain intact (`lib/publication.ts:38-59`).

### 4.2 Complete, non-invented villa presentation

- `lib/venue-presentation.ts:1-47` centralizes category labels, schema types, and cover fallback mapping. `villa` renders as `Villa`, uses schema type `LodgingBusiness`, and reuses the existing licensed hotel mood-art asset rather than referring to a nonexistent or unapproved villa photo.
- `lib/seo/venue-metadata.ts:14-35` centralizes canonical, robots, Open Graph, Twitter, and title construction. Its branch-target metadata title segment becomes `Big Dragon Villas Ubud — Villa in Pejeng, near Ubud, Ubud`, with no `undefined` token; the root template appends `· Other Bali` in the rendered document title.
- `app/places/[slug]/page.tsx:27-32,149-185,241-245,326-346` uses those shared helpers for metadata, visible category text, and JSON-LD. The already-deployed request-rendering declaration is preserved at lines 34-39.
- `components/PlaceCard.tsx:1-10,55-75` and `components/PlaceCover.tsx:1-3,39-75` use the same labels and safe cover mapping, preventing detail/card/cover drift.

### 4.3 Regression and operator tooling

- `lib/publication.test.ts`, `lib/venue-validation.test.ts`, `lib/venue-presentation.test.ts`, and `lib/seo/venue-metadata.test.ts` cover publication preservation, structural admission, unknown-category rejection, safe cover/schema behavior, defined title, self-canonical, and index/noindex metadata.
- `scripts/t0-indexability-samples.json:3-20` freezes the 12 production positives, `adda-yoga` negative control, and branch-only Big Dragon target.
- `scripts/t0-indexability-core.mjs:317-500` implements a reusable three-user-agent audit of direct status, initial HTML usefulness, expected H1, title, canonical, robots metadata/header, robots.txt allowance, sitemap inclusion/absence, and normalized content equivalence.
- `scripts/t0-indexability-core.test.mjs` proves both the success contract and independent failure detection for status, useful HTML, title, canonical, robots, `X-Robots-Tag`, sitemap, negative control, and user-agent divergence.
- `scripts/t0-indexability-smoke.mjs:9-44` exposes production and branch-target modes. `package.json:13-19` wires the tests and live audit commands.
- `scripts/performance-boundary.test.mjs:67-93` locks the Dynamic venue-rendering contract and the shared detail/sitemap publication boundary.

There is no schema migration, production data mutation, route-family change, or crawler-specific rendering branch in this change set.

## 5. Venue counters: production fact versus deployment expectation

Read-only production SQL and repository-equivalent predicates on 2026-07-21 produced:

| Counter | Pre-deployment production | Definition |
|---|---:|---|
| Total venue records | **800** | All `public.venues` rows. |
| Active + database-published | **595** | `status='active'` and `publication_status='published'`. |
| Raw decision-ready | **519** | Active/published with non-empty `why_its_here` and `best_for`. |
| Route metadata `index,follow` | **518** | Existing detail-route predicate after the Uluwatu review override. |
| Acceptance-complete / sitemap eligible | **517** | Route predicate intersected with the pre-branch structural/category boundary and sitemap inclusion. |

The reconciliation is exact: 519 → 518 excludes `ulu-artisan-ungasan`, held in `review` by the Uluwatu registry; 518 → 517 excludes `big-dragon-villas-ubud` solely because `villa` was absent from the repository structural allowlist.

**INFERENCE / EXPECTATION.** If the database snapshot and all unrelated sitemap inputs remain unchanged through deployment, this branch should align acceptance-complete venue eligibility with route metadata at **518** and increase the full sitemap from **667** to **668** URLs. These values are not yet production facts.

## 6. HTTP audit results

### 6.1 Production baseline — `2026-07-21T08:55:37.134Z`

**FACT — production.** The deployed baseline passed with zero violations:

| Measure | Result |
|---|---:|
| Positive samples | 12 |
| Negative controls | 1 (`adda-yoga`) |
| User agents | 3: browser, generic crawler, Googlebot Smartphone |
| Venue-page fetches | 39 |
| `robots.txt` | HTTP 200 for each user agent; `/places` and targets allowed |
| `sitemap.xml` | HTTP 200; 667 unique locations |
| Violations | 0 |

For every positive sample, all three agents received direct HTTP 200, useful server-rendered HTML, the expected venue H1, a defined title, a unique self-canonical, explicit `index,follow`, no conflicting `X-Robots-Tag`, equivalent normalized primary content, and sitemap inclusion. `adda-yoga` returned 404/noindex for all three agents and remained outside the sitemap.

The positive slugs were `monkey-bar-bali`, `desa-wisata-penglipuran`, `amo-spa-canggu-canggu`, `atlas-beach-club`, `baked-pererenan`, `donna-ubud`, `pantai-lovina`, `nusa-dua-beach-grill`, `crumb-and-coaster-kuta`, `alchemy-uluwatu`, `koa-shala-sanur`, and `kilo-kitchen-bali-seminyak`.

This audit proves the existing deployed cohort; it does not prove that the branch target is fixed in production.

### 6.2 Local canonical-host branch — `2026-07-21T09:09:28.133Z`

**FACT — branch/local.** The branch audit added Big Dragon and passed with zero violations:

| Measure | Result |
|---|---:|
| Positive samples | 13 |
| Negative controls | 1 (`adda-yoga`) |
| User agents | 3: browser, generic crawler, Googlebot Smartphone |
| Venue-page fetches | 42 |
| `robots.txt` | HTTP 200 for each user agent; `/places` and targets allowed |
| `sitemap.xml` | HTTP 200; 668 unique locations |
| Violations | 0 |

For `/places/big-dragon-villas-ubud`, all three user agents received HTTP 200 and equivalent primary content; the response contained H1 `Big Dragon Villas Ubud`, title `Big Dragon Villas Ubud — Villa in Pejeng, near Ubud, Ubud · Other Bali`, canonical `https://www.otherbali.com/places/big-dragon-villas-ubud`, explicit `index,follow`, and sitemap inclusion. The negative control continued to pass unchanged.

The final local server HTML for `/places?district=ubud` also contained a direct `href="/places/big-dragon-villas-ubud"`, closing the branch target's previously observed internal-discoverability gap without adding a parallel navigation system.

### 6.3 One-off initial local 404

An initial one-off local request for Big Dragon returned 404. Follow-up evidence showed that response came from a stale negative result in the venue-detail data cache, whose bounded revalidation period is 300 seconds (`lib/data/public-cache.ts:1`, `lib/data.ts:433-442`, and `scripts/performance-boundary.test.mjs:7-10`). The subsequent canonical-host branch run passed the full contract for the page under all three user agents.

This transient local cache artifact is not the historical production root cause and no new code fix is attributed to it. It is relevant operationally because a newly eligible record may require one cache window before an already-seeded negative local result disappears.

Two discarded diagnostic reruns used a build artifact generated without the required public Supabase configuration; they correctly fell back to the non-production seed surface (127 sitemap URLs and 404s for production-only samples). They are not acceptance evidence. The final result above came from a clean `.next` build with the read-only public production URL/key and production host policy, followed by the same three-user-agent assertions.

## 7. Acceptance matrix

| Acceptance criterion | Evidence | Status |
|---|---|---|
| Historical 500 root cause diagnosed and narrowly recovered | Deployment/build/log intervention record; Dynamic contract preserved | **PASS — already production** |
| Existing positive cohort returns indexable server HTML without UA divergence | 12 × 3 production page fetches, zero violations | **PASS — production sample-bounded** |
| Held venue remains unavailable/noindex/outside sitemap | `adda-yoga` 404/noindex for three agents in both audits | **PASS** |
| Route, list, and sitemap use one structural/publication decision | `isVenueIndexable()` structural check; detail readiness delegates to it; sitemap filters by it | **PASS — source/tests** |
| Valid villa has complete presentation and metadata | Branch Big Dragon 200/H1/title/canonical/schema-safe mapping/sitemap inclusion | **PASS — local pre-deploy** |
| Crawler policy permits public venue pages | Three `robots.txt` HTTP 200 responses and target-path evaluation in both audits | **PASS** |
| Branch target has an internal server-rendered link | `/places?district=ubud` contains the Big Dragon detail href | **PASS — local pre-deploy** |
| Focused regression suite | `npm run test:t0` | **PASS — 48/48** |
| Full repository suite | `npm test` | **PASS — 219/219 tests (198 named subtests)** |
| TypeScript | `npm run typecheck` | **PASS** |
| Lint | `npm run lint` | **PASS — 0 errors; one pre-existing warning** |
| Production build | `npm run build` | **PASS — `/places/[slug]` classified Dynamic** |
| Branch deployed to production | No deploy performed | **PENDING** |
| Post-deploy 13-positive/1-negative production audit | Requires deployed code | **PENDING** |
| GSC Live URL Test | Authenticated GSC evidence unavailable | **UNVERIFIED / PENDING** |

## 8. Commands and verification results

| Command | Final result |
|---|---|
| `npm run test:t0` | 48 tests passed; 0 failed, skipped, or cancelled. |
| `npm test` | 219 tests passed (198 named subtests); 0 failed. |
| `npm run typecheck` | Passed with no TypeScript error. |
| `npm run lint` | 0 errors; 1 warning. |
| `npm run build` | Production build passed; route table classifies `/places/[slug]` as `ƒ` Dynamic. |
| `npm run test:t0:live` | Production baseline: 12 positive + 1 negative, 39 page fetches, sitemap 667, 0 violations. |
| Programmatic `runT0IndexabilityAudit()` with local transport, canonical host semantics, and `branchTargets` | 13 positive + 1 negative, 42 page fetches, sitemap 668, 0 violations. |

The sole lint warning is pre-existing and outside T0: `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx:13:549` uses a raw `<img>` (`@next/next/no-img-element`). An earlier `npm ci` also reported 18 high-severity dependency advisories from the existing lockfile. They were not a T0 test/build failure; no `npm audit fix`, dependency upgrade, or lockfile change was authorized or performed. No T0 test, typecheck, lint-error, or production-build failure remains. The historical immutable-artifact HTTP 500 reproduction and the one-off stale-cache local 404 are evidence cases, not current automated-suite failures.

## 9. Preserved behavior and deferred scope

Preserved:

- request-rendered venue HTML while the venue/menu/action/similar-place data reads retain bounded caches;
- active + database-published checks, decision-ready editorial requirements, and the Uluwatu registry's held/published decisions;
- 404/noindex behavior for review, inactive, incomplete, structurally invalid, and unknown-category venues;
- canonical `/places/[slug]` URLs, all-district full venue cards, existing internal actions, JSON-LD evidence limits, and photo-consent rules;
- no crawler-specific content path and no paid/sponsored ranking change.

Deliberately deferred:

- T1-T10 product work, including the confirmed T7 broken-link set on `/bali/kuta-legian`;
- Chope/candidate imports, migrations, production data edits, publication widening, photo publication, and monetization changes;
- sitewide canonical-collision or internal-link exhaustiveness claims beyond the audited sample;
- GSC indexing claims. HTTP eligibility is not proof that Google has crawled or indexed a URL.

## 10. Deployment, monitoring, and rollback

### Deployment checklist

1. Review and commit only the intended T0 source, tests, scripts, and this report; exclude generated/local artifacts.
2. Deploy the reviewed branch through the normal production pipeline and record the Git SHA and Vercel deployment ID.
3. Confirm the build route table still shows `ƒ /places/[slug]` as Dynamic. A return to `●` SSG/ISR is a stop condition.
4. After the deployment is ready—and after one 300-second public data-cache window if the prior negative cache was seeded—run the production audit including branch targets. Require 13 positive + 1 negative, 42 page fetches, three-UA equivalence, robots 200 for each agent, sitemap 668, and zero violations.
5. Directly verify Big Dragon's HTTP 200, H1, defined title, unique self-canonical, `index,follow`, sitemap membership, and discoverability from `/places`.
6. Run authenticated GSC Live URL inspection for Big Dragon and at least one established positive control. Record crawl allowance, fetched status/render, declared canonical, Google-selected canonical, and any indexing blocker; request indexing only after the live inspection passes.

### Monitoring

- Watch Vercel `/places/*` status and error logs for HTTP 500, `DYNAMIC_SERVER_USAGE`, and new metadata/render exceptions during the first deployment window and again after cache expiry.
- Re-run the production audit after deployment, after the first cache window, and on the next operational check. Any UA content mismatch, positive 404/500, negative 200, canonical conflict, robots block, or sitemap regression is a release blocker.
- Reconfirm production counts if venue data changes during rollout; the expected 518/668 result assumes the dated production snapshot remains otherwise unchanged.
- Treat GSC discovery/indexing as monitored external state, not as a substitute for the HTTP contract.

### Rollback

If the deployment causes a systemic route, catalogue, sitemap, or metadata regression, roll back the T0 branch deployment to the current known-good production deployment `dpl_3yTWNPQMzRJhhsqqkfvd6NLpaxdD` on `5d62fbdd…`, then re-run the 12-positive/1-negative baseline audit. That rollback preserves the already-deployed Dynamic rendering recovery but restores the known Big Dragon route/sitemap mismatch; it must therefore reopen this consistency item rather than mark T0 closed. Do not roll back the historical request-rendering recovery to an ISR/SSG venue-detail version.

## 11. Final status

The T0 branch is **verified and deployment-ready**, with focused, full-suite, type, lint, build, and local HTTP acceptance evidence passing. Production remains on the pre-branch state. T0 is **not operationally closed** until the branch is deployed, the expanded production audit passes, and GSC Live URL inspection is recorded.
