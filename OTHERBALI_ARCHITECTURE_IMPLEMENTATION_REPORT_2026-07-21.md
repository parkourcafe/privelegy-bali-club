# Other Bali Architecture Implementation Report — 2026-07-21

Final update: 2026-07-22 01:30 Asia/Makassar
Repository: `parkourcafe/privelegy-bali-club`
Production site: `https://www.otherbali.com`
Production Supabase project: `bali-privilege` / `egkdapqwkfprtyqvvnso`

## 1. Executive verdict

The implementation track from Phase 0 through Wave 3 is complete for the engineering scope that could be executed from the repository and available source files.

Completed:

- Phase 0 repository reality map and conflict register.
- T0 indexability diagnosis, fix, verification and regression coverage.
- Wave 1: T1 homepage, T2 Save, T3 venue card completeness, T9 Add to trip.
- Wave 2: T4 QuickDecision, T5 Start your shortlist pilot, T6 `/for-venues`, T7 product/content hygiene.
- Wave 3: T8 Canggu Now, T10 Plan navigation and missing content.
- Production Supabase migrations `0056`, `0057`, `0058`, `0059`.
- PRs #184, #187 and #188 merged and deployed.
- Chope staged-candidates mapping and dry-run guard with `publishable=0`.

Not completed because the required input is absent or explicitly deferred:

- Full Chope-607 dry run: the complete 607-row source file was not found in the repository or inspected Downloads paths. A controlled sample dry run exists and proves the guard behavior.
- PR #178: unrelated legacy PR remains unmerged/failing and needs separate triage. It is not part of Wave 1–3 completion.
- Long-term GSC monitoring: T0 engineering acceptance is closed, but Google indexing/impressions remain a monitoring activity.

## 2. Repository facts

| Fact | Evidence |
|---|---|
| App stack is Next.js App Router with React 19 and Supabase | `package.json`, `app/`, `lib/data.ts`, `lib/supabase.ts` |
| Public venue detail route is `/places/[slug]` | `app/places/[slug]/page.tsx` |
| Public route/itinerary route is `/route/[slug]` | `app/route/[slug]/page.tsx`, `lib/data.ts` |
| Public catalogue is `/places` | `app/places/page.tsx` |
| Save/list surface is `/me` | `app/me/page.tsx`, `app/api/save/route.ts`, `app/api/trip/route.ts` |
| Plan surface is `/plan` and shared plan is `/plan/shared` | `app/plan/page.tsx`, `app/plan/shared/page.tsx` |
| Canggu active-deep surface is `/canggu` | `app/canggu/page.tsx` |
| Partner/venue owner surfaces exist | `app/partner/*`, `app/onboard/[token]/*`, `app/api/partner/*`, `app/api/onboard/*` |
| Admin/operator surfaces exist | `app/admin/*`, `components/admin/*` |
| Sitemap enumerates indexable venues, guides, routes, district hubs and collections | `app/sitemap.ts` |
| Publication/indexability gates are centralized | `lib/publication.ts`, `lib/seo/places-indexing.test.ts`, `scripts/t0-indexability-core.test.mjs` |
| Staged data-ops pattern exists | `data/data-ops/kora-leads/README.md`, `scripts/data-ops-compiler-core.mjs` |
| Money model remains frozen / no paid ranking introduced | `docs/money-model.md`, `docs/wave2/OTHERBALI_WAVE2_VERIFICATION_REPORT_2026-07-22.md`, `docs/wave3/OTHERBALI_WAVE3_VERIFICATION_REPORT_2026-07-22.md` |

Primary discovery artifact: `OTHERBALI_REPOSITORY_REALITY_MAP_2026-07-21.md`.

## 3. Architecture conflicts

| Statement | Source document | Repository evidence | Status | Winning rule | Required action |
|---|---|---|---|---|---|
| Bali-wide planning plus Canggu-deep execution | Master architecture / user brief | `/canggu`, `/bali`, `/places`, `/route/[slug]`, partner/perk routes | confirmed | Preserve Bali-wide cards; Canggu remains active-deep | Done |
| Do not become Google Maps / TripAdvisor clone | Master architecture / AGENTS | No ratings/reviews product; public cards emphasize fit/actions | confirmed | Decision-first, no broad review clone | Done |
| Do not weaken publication gate for SEO volume | T0 brief / audit corrections | `lib/publication.ts`, sitemap filters by `isVenueIndexable` | confirmed | Index only evidence-backed pages | Done |
| T4 must not infer booking difficulty | Audit corrections V1.1 | `lib/quick-decision.ts`, Wave 2 tests | confirmed | Render only verified fields | Done |
| “Best right now” must become “Fits this moment” | Audit corrections V1.1 | `components/CangguNow.tsx`, Wave 3 test rejects `Open now` | confirmed | No current-open claim without verified hours | Done |
| Paid placement must not launch before Sept 21 2026 | Money model freeze / user brief | No paid-ranking changes in PRs #184/#187/#188 | confirmed | Reserved only; organic order not payment-based | Done |
| Chope source found is not import-ready/publish-ready | User brief / Chope audit | `CHOPE_607_PIPELINE_MAPPING.md`, dry-run output | confirmed | Separate candidate, verification, editorial, SEO, partner, photo axes | Sample done; full 607 blocked by missing source |
| Downloaded `insert_chope_candidates.sql` can be used directly | Downloads artifact | SQL inserts into `venues` directly | contradicted | Staged pipeline only | Not applied |

## 4. T0 root cause

T0 was a route-level indexability incident around public venue detail pages. The accepted diagnosis was repository-grounded and documented in:

- `OTHERBALI_T0_INDEXABILITY_DIAGNOSIS.md`
- `OTHERBALI_T0_VERIFICATION_REPORT.md`

The key corrected interpretation from audit corrections V1.1: Google index absence was not treated as automatic proof that every venue page was crawler-invisible. T0 acceptance used controlled engineering criteria: HTTP 200, meaningful HTML, canonical, no accidental `noindex`, sitemap inclusion, internal links and user-agent parity.

## 5. T0 fix and evidence

Evidence artifacts:

- `OTHERBALI_T0_INDEXABILITY_DIAGNOSIS.md`
- `OTHERBALI_T0_VERIFICATION_REPORT.md`
- `scripts/t0-indexability-core.test.mjs`
- `lib/seo/places-indexing.test.ts`
- GSC live screenshots supplied by owner showing URL indexed / URL available to Google.

Acceptance status: closed.

## 6. T1–T10 status

| Task | Before | Repository evidence | Action | After | Verification |
|---|---|---|---|---|---|
| Phase 0 | Architecture docs existed, but repo state needed confirmation | `OTHERBALI_REPOSITORY_REALITY_MAP_2026-07-21.md` | Mapped routes, gates, data, admin/partner, money model, T0–T10 state | Repository reality documented | Doc exists |
| T0 Indexability | Sampled `/places/[slug]` risk and GSC concern | `OTHERBALI_T0_INDEXABILITY_DIAGNOSIS.md` | Diagnosed/fixed verified cause only, preserved publication gate | Indexable venue pages serve meaningful 200 HTML with canonical/sitemap/internal links | `OTHERBALI_T0_VERIFICATION_REPORT.md`, T0 tests, GSC live sample |
| T1 Homepage | Needed clearer traveller entry modes and six scenarios | `app/page.tsx`, Wave 1 docs | Implemented verified homepage gaps without catalog redesign | Promise and six scenarios preserved; partner entry secondary | PR #184, Wave 1 tests |
| T2 Save | Save/list existed but needed stronger persistence/feedback sync | `app/me/page.tsx`, `app/api/save/route.ts`, `app/api/trip/route.ts` | Extended existing Save architecture | Anonymous saved list/trip state preserved | PR #184, `lib/trip.test.ts`, Wave 1 tests |
| T3 Venue card completeness | Renderer needed evidence-gated fields | `components/PlaceCard.tsx`, venue presentation tests | Render only existing verified fields; no placeholders | why/best/not/order/price/verified rules protected | PR #184, `lib/venue-completeness.test.ts` |
| T4 QuickDecision | Missing compact decision block | `lib/quick-decision.ts`, components from Wave 2 | Added evidence-gated QuickDecision | No inferred booking difficulty/open claims | PR #187, `lib/quick-decision.test.ts` |
| T5 Start your shortlist | Needed pilot, not site-wide blanket rollout | `components/StartYourShortlist.tsx`, `lib/start-shortlist.ts` | Added pilot on priority pages with event guard | Shortlist starts selection without duplicating full catalogue | PR #187, `lib/start-shortlist.test.ts` |
| T6 `/for-venues` | Needed venue-facing copy and frozen money model clarity | `app/for-venues/page.tsx` | Updated offer/confirmation/free pilot copy | No guaranteed traffic/sales or auto-billing claim | PR #187, Wave 2 report |
| T7 Product/content hygiene | Needed broken/empty/CTA/claim cleanup | Wave 2 discovery/report | Fixed verified hygiene gaps only | Existing functionality preserved | PR #187, `npm run build`, `npm test` |
| T8 Canggu Now | `/canggu` lacked scenario-first “now” entry | `app/canggu/page.tsx` | Added `components/CangguNow.tsx` | 12 entries live; uses `Fits this moment`; no `Open now` | PR #188, `scripts/wave3-product-boundary.test.mjs`, live `/canggu` |
| T9 Add to trip | Needed extension of Save, not parallel system | `app/api/trip/route.ts`, `TripPlanner`, tests | Extended Save/trip mechanics | Add/remove/reorder/share/maps supported within existing model | PR #184, Wave 1 tests |
| T10 Plan nav/content | Desktop lacked single-tap Plan; missing 3/5-day and Canggu no-scooter pages; missing food/rainy routes | `lib/navigation.ts`, `lib/guides.ts`, `app/route/[slug]/page.tsx`, `lib/data.ts` | Added Plan action, pages, route records, fixed route resolution to published catalogue | New pages/routes live; no new route engine | PR #188, migration `0059`, live URL checks |
| Chope-607 | No full source in repo/Downloads; only 12-row SQL draft | `CHOPE_607_PIPELINE_MAPPING.md`, `CHOPE_607_DRY_RUN_REPORT.md` | Built staged mapping and sample dry run; did not apply direct SQL | Sample output: 5 rows, `publishable=0` | `node scripts/chope-607-dry-run.mjs`, Wave 3 report |

## 7. Implemented changes

### PR #184 — Wave 1

- URL: `https://github.com/parkourcafe/privelegy-bali-club/pull/184`
- Title: `Complete verified Wave 1 gaps (T1, T2, T3, T9)`
- Merged: 2026-07-21T15:25:09Z
- Merge commit: `00bb1bd81bb283d052f15306c172eb208eb2b017`

### PR #187 — Wave 2

- URL: `https://github.com/parkourcafe/privelegy-bali-club/pull/187`
- Title: `feat: complete verified Wave 2 product gaps`
- Merged: 2026-07-21T16:42:36Z
- Merge commit: `cba73d231e4354bac57cbeb144d451017df3650b`

### PR #188 — Wave 3

- URL: `https://github.com/parkourcafe/privelegy-bali-club/pull/188`
- Title: `feat: implement Other Bali Wave 3`
- Merged: 2026-07-21T17:22:30Z
- Merge commit: `c01a07c8008c7bb0702d3e8bfe62e53f41f0b0af`

Main Wave 3 files:

- `components/CangguNow.tsx`
- `app/canggu/page.tsx`
- `app/bali-itinerary-3-days/page.tsx`
- `app/bali-itinerary-5-days/page.tsx`
- `app/canggu-without-a-scooter/page.tsx`
- `lib/guides.ts`
- `lib/navigation.ts`
- `lib/data.ts`
- `supabase/migrations/0059_wave3_canggu_routes.sql`
- `scripts/chope-607-dry-run.mjs`
- `scripts/wave3-product-boundary.test.mjs`

## 8. Existing functionality intentionally preserved

- Full Bali-wide venue cards remain allowed and are not restricted to Canggu.
- Canggu remains the first active-deep district.
- Existing `/route/[slug]` route engine was extended, not replaced.
- Existing Save/Add-to-trip model was extended, not duplicated.
- Existing partner dashboard/admin workflows were preserved.
- Existing publication/indexability gates were preserved.
- Existing money model remains frozen; no paid ranking, sponsored slots or auto-billing launched.
- `Open now` remains unimplemented without verified structured hours.
- Chope candidates remain staged/non-publishable.

## 9. Chope pipeline dry-run results

Artifacts:

- `CHOPE_607_PIPELINE_MAPPING.md`
- `CHOPE_607_DRY_RUN_REPORT.md`
- `scripts/chope-607-dry-run.mjs`
- `data/data-ops/chope-607/sample-candidates.json`
- `data/data-ops/chope-607/dry-run-output.json`

Dry-run command:

```bash
node scripts/chope-607-dry-run.mjs
```

Result:

| Metric | Count |
|---|---:|
| Input rows processed | 5 |
| Publishable rows | 0 |
| `dedup_pending` rows | 5 |
| `draft` publication rows | 5 |

Limitations:

- Full 607-row source file was not found.
- Available Downloads artifact `insert_chope_candidates.sql` has 12 direct `venues` inserts and was not applied.
- Full Chope-607 dry run remains blocked until the actual source file is provided or located.

## 10. Tests and commands

Verified during implementation:

```bash
node scripts/chope-607-dry-run.mjs
npm run test:wave3
npm run typecheck
npm run lint
npm run build
npm test
```

Final recorded outcomes:

- `npm run test:wave3`: pass, 5/5.
- `npm run typecheck`: pass.
- `npm run lint`: pass with one pre-existing warning about `<img>` in partner photo review.
- `npm run build`: pass; route manifest includes new pages.
- `npm test`: pass, 225/225 after Wave 3 test inclusion.

Production smoke after merge/deploy:

- `https://www.otherbali.com/canggu`: 200, contains `Canggu Now` and `Fits this moment`.
- `https://www.otherbali.com/bali-itinerary-3-days`: 200.
- `https://www.otherbali.com/bali-itinerary-5-days`: 200.
- `https://www.otherbali.com/canggu-without-a-scooter`: 200.
- `https://www.otherbali.com/route/canggu-food-route`: 200 after migration `0059`.
- `https://www.otherbali.com/route/canggu-rainy-day`: 200 after migration `0059`.

## 11. Pre-existing failures

- PR #178 remains separate, unmerged and failing checks in GitHub UI. It is not part of the T0/Wave 1/Wave 2/Wave 3 implementation path and should be triaged separately.
- Lint warning: `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx` uses `<img>`; warning existed outside Wave 3 scope and does not block lint.
- Full Chope-607 source is absent, so full 607 dry-run counts cannot be claimed.

## 12. Remaining content work

Engineering-required missing content from T10 is implemented:

- `Bali itinerary: 3 days`
- `Bali itinerary: 5 days`
- `Canggu without a scooter`
- `Canggu food route`
- `Canggu rainy-day route`

Recommended editorial follow-up:

- Review copy quality on the new 3-day/5-day/no-scooter pages after production analytics start.
- Decide whether `/route/sunset-run` should be renamed or aliased later for clearer “Canggu sunset route” SEO. It was not duplicated because the route already exists and satisfies the product requirement.

## 13. Deferred decisions

| Decision | Status | Reason |
|---|---|---|
| Full Chope-607 processing | deferred | full source file not found |
| Chope candidate import to DB | deferred | staging only; no auto-publication allowed |
| Paid ranking / featured placement | deferred until after 2026-09-21 | money model freeze |
| Open-now / verified hours | deferred | structured verified hours model is not complete |
| PR #178 | separate triage | unrelated failing PR; not part of Wave 1–3 |
| GSC long-term monitoring | ongoing | Google indexing is not an engineering acceptance condition |

## 14. Production deployment checklist

| Item | Status | Evidence |
|---|---|---|
| PR #184 merged | done | GitHub PR #184 |
| PR #187 merged | done | GitHub PR #187 |
| PR #188 merged | done | GitHub PR #188 |
| Production deployment after PR #188 | done | Vercel deployment `dpl_47buv29pq1838ivvj367XiSk3Fxh` |
| Production Supabase `0056` | done | remote migration history |
| Production Supabase `0057` | done | remote migration history |
| Production Supabase `0058` | done | remote migration history |
| Production Supabase `0059` | done | remote migration history `20260721172649 / 0059_wave3_canggu_routes` |
| Live T8 `/canggu` | done | HTTP 200, content contains Canggu Now / Fits this moment |
| Live T10 new pages | done | HTTP 200 |
| Live T10 new routes | done | HTTP 200 after `0059` |
| Chope auto-publication guard | done for sample | dry-run `publishable=0` |
| Full Chope-607 import | not done | no full source file |
| Production secrets exposure | no change | no secrets added |
| Production data destructive changes | none | migration only inserted two route rows idempotently |

## Definition of Done status

| Requirement | Status |
|---|---|
| Repository state documented | complete |
| T0 root cause proved | complete |
| T0 fixed and covered by tests | complete |
| No duplicate existing functions created | complete |
| T1–T10 implemented only for verified gaps | complete |
| Bali-wide cards preserved | complete |
| Canggu active-deep preserved | complete |
| No unverified Open now | complete |
| Paid placement not launched | complete |
| Chope-607 remains staging source | complete for available sample; full source pending |
| No Chope candidate auto-published | complete |
| Production build/typecheck/tests passed | complete |
| Changes listed with evidence | complete |
| Safe production deployment plan/checklist prepared | complete |

Final conclusion: T0–T10 are closed for the implemented repository/product scope. The only remaining items are separate follow-ups: PR #178 triage and full Chope-607 dry-run once the full source file is available.
