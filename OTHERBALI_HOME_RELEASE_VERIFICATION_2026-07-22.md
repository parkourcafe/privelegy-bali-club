# Other Bali — Home Mobile Release Verification

Дата: 2026-07-22  
Scope: homepage `/` mobile release-quality addendum  
Статус: `code_complete_external_validation_pending`  
Production deploy: не выполнялся  
Commit/push: не выполнялись в этом verification pass

## 1. Executive verdict

Кодовые и лабораторные проверки homepage после addendum проходят:

- Continuous geometry sweep: `134` checks, `0` failures.
- Mobile axe on 320/375/430 normal + 200% zoom: `0` violations, `0` critical/serious.
- Internal homepage links: `59`, failures `0`.
- Wave 4 homepage boundary tests: PASS.
- Wave 1 regression tests: PASS.
- Typecheck: PASS.
- Build: PASS.
- Lint: PASS with one pre-existing non-homepage warning.

Release acceptance remains blocked by evidence, not by known code failure:

- No real iOS Safari / Android Chrome device smoke was available in this session.
- No five-person ten-second comprehension test was available.
- Lighthouse x3 cold mobile runs were not executed in this pass.
- Focus script reports later offscreen elements as under bottom nav during tabbing without scroll-centering; primary journey focus is visible, but full keyboard proof needs manual/device pass.

Verdict: `code_complete_external_validation_pending`. Do not deploy production from this evidence alone if the addendum’s strict 95+ release gate is enforced.

## 2. Proven root cause

The prior “narrow-column collapse” screenshot was not reproduced on the current working tree. The confirmed current responsive defect was footer horizontal overflow.

Evidence before fix:

- At `320px`: `documentElement.clientWidth=320`, `scrollWidth=351`; footer email span extended to `right=350.875`.
- At `640px`: `clientWidth=640`, `scrollWidth=669`; footer contact column overflowed after early `sm:grid-cols-4`.

Root-cause file:

- `components/SiteFooter.tsx`

Fix:

- Footer grid breakpoint changed to avoid dense multi-column layout until it can contain the email/contact text: `min-[430px]:grid-cols-2 min-[900px]:grid-cols-4`.

Regression evidence:

- `docs/wave4-homepage-evidence/mobile-release-quality/mobile-geometry.json`
- Summary: `{ "checked": 134, "failures": 0 }`

## 3. Exact changed files

| File | Reason |
|---|---|
| `app/page.tsx` | Homepage IA, CTAs, accepted scenarios display, Canggu module, neutral trust copy, focus-visible classes, JSON-LD safe serializer usage retained |
| `lib/homepage.ts` | Approved homepage config: explicit hero journeys, six scenarios, four category buckets, trust principles, CTA labels |
| `components/SiteFooter.tsx` | Remove large partner card and monetization claim; keep secondary `For businesses`; fix footer responsive overflow |
| `app/globals.css` | Improve locale trigger contrast |
| `app/layout.tsx` | Separate global JSON-LD description hardening/narrowing |
| `app/plan/page.tsx` | Remove public seated-visit monetization claim |
| `app/terms/page.tsx` | Remove/narrow frozen monetization claim |
| `components/ScenarioView.tsx` | Remove public seated-visit monetization claim |
| `scripts/wave1-home-boundary.test.mjs` | Update Wave 1 regression expectations to accepted Wave 4 homepage semantics |
| `scripts/wave4-homepage-boundary.test.mjs` | Update Wave 4 product/copy/data guard for accepted six scenarios and four categories |
| `scripts/wave4-homepage-mobile-geometry.mjs` | New geometry regression guard and viewport sweep |
| `OTHERBALI_HOME_MOBILE_DIAGNOSIS_2026-07-22.md` | Required diagnosis report |
| `OTHERBALI_HOME_RELEASE_VERIFICATION_2026-07-22.md` | Required verification report |

Unrelated/untracked items intentionally not included in any commit plan:

- `public/scenes/venues-story.mp4`
- Existing recovery pack artifacts under `OTHERBALI_HOMEPAGE_WAVE_4_RECOVERY_REVIEW_PACK*`

## 4. Before/after section map

| Old/current concern | Action | After |
|---|---|---|
| Hero CTAs not sufficiently distinct | Modified | `Find a place now` -> `/my-day`; `Plan my trip` -> `/plan` |
| More than accepted scenario set | Modified | Exactly six accepted scenarios in `HOME_MOMENTS` |
| Generic `Open →` labels | Modified | Object-specific labels or `View {label}` |
| Long category grid | Modified | Four presentation buckets: Eat & Drink, Beach & Pool, Wellness, Things to Do |
| No clear Canggu active-deep explanation in public homepage hierarchy | Added | One bounded Canggu module, not above hero |
| Unsupported trust copy | Removed/replaced | Neutral trust copy: “Built to make choosing Bali simpler.” |
| Large partner card competing with tourist homepage | Removed | Footer-only secondary `For businesses` |
| Footer email/contact overflow | Fixed | Later grid breakpoints prevent overflow |

## 5. Removed, merged and moved content

Removed from homepage/public footer scope:

- `Curated by people who live here`
- `Information is reviewed and date-stamped`
- Large `Partner with us — free` card
- Seated-visit monetization sentence
- Generic unsupported monetization language in affected public pages/components

Merged/reduced:

- Moments reduced to the six accepted scenarios.
- Category shortcuts reduced to four presentation-level buckets.

Moved/deferred:

- Detailed B2B content belongs to `/for-venues`, linked only as secondary `For businesses`.
- Real device checks, Lighthouse x3 and comprehension smoke test remain external validation.

## 6. CTA destination map

| CTA | Destination | Validation |
|---|---|---|
| Find a place now | `/my-day` | Internal-link matrix PASS |
| Plan my trip | `/plan` | PASS |
| First day in Bali | `/first-time-in-bali` | PASS |
| Sunset | `/where-to-watch-sunset-in-bali` | PASS |
| With kids | `/bali-with-kids` | PASS |
| Rainy day | `/bali-rainy-day` | PASS |
| Romantic | `/romantic-bali` | PASS |
| Plan 3 / 5 / 7 days | `/plan` | PASS |
| Ubud | `/ubud` | PASS |
| Canggu | `/canggu` | PASS |
| Sanur | `/sanur` | PASS |
| Uluwatu | `/uluwatu-sunset-kecak` | PASS |
| Seminyak | `/seminyak` | PASS |
| Nusa Dua | `/nusa-dua` | PASS |
| Explore Bali areas | `/bali` | PASS |
| See all Bali plans | `/plan` | PASS |
| Eat & Drink | `/best-restaurants-in-bali` | PASS |
| Beach & Pool | `/best-beach-clubs-in-bali` | PASS |
| Wellness | `/best-spas-in-bali` | PASS |
| Things to Do | `/things-to-do-in-bali` | PASS |
| Open the Canggu guide | `/canggu` | PASS |
| Start with Canggu now | `/canggu-first-day` | PASS |
| Build my shortlist | `/places` | PASS |
| View my shortlist | `/me` | PASS |
| For businesses | `/for-venues` | PASS |

Evidence file:

- `docs/wave4-homepage-evidence/mobile-review/internal-link-validation.json`

## 7. Copy and claim corrections

PASS:

- Public UI remains English.
- Hero keeps exactly one H1: `The right place for the moment you’re in.`
- No homepage `Open now`.
- No homepage paid ranking or automatic billing.
- No homepage seated-visit commission claim.
- Trust copy replaced with:
  - Heading: `Built to make choosing Bali simpler.`
  - Body: `Start with your moment, area or trip plan, then open the guide that fits.`
  - Principles:
    - `Selected, not exhaustive`
    - `No sponsored homepage ranking`
    - `Clear routes to the next step`

## 8. Responsive matrix results

Evidence:

- `docs/wave4-homepage-evidence/mobile-release-quality/mobile-geometry.json`

Summary:

| Check | Result |
|---|---|
| Continuous width sweep 320–1024 step <=8 | PASS |
| Breakpoint boundaries | PASS |
| Named viewports 320×568 through 1440×900 | PASS |
| No page horizontal overflow | PASS |
| Main not collapsed | PASS |
| Mobile section width guard | PASS |
| Fixed UI geometry guard | PASS |

Named mobile review screenshots:

- `docs/wave4-homepage-evidence/mobile-review/homepage-320-normal.png`
- `docs/wave4-homepage-evidence/mobile-review/homepage-320-zoom200.png`
- `docs/wave4-homepage-evidence/mobile-review/homepage-375-normal.png`
- `docs/wave4-homepage-evidence/mobile-review/homepage-375-zoom200.png`
- `docs/wave4-homepage-evidence/mobile-review/homepage-430-normal.png`
- `docs/wave4-homepage-evidence/mobile-review/homepage-430-zoom200.png`

Mobile review metrics:

| Width/state | Overflow | axe critical/serious | Hero bottom | H1 top-bottom |
|---|---|---:|---:|---|
| 320 normal | false | 0 | 446.5 | 125–219.5 |
| 320 200% | false | 0 | 1497 | 282–723 |
| 375 normal | false | 0 | 415 | 125–188 |
| 375 200% | false | 0 | 1319 | 282–597 |
| 430 normal | false | 0 | 389 | 125–188 |
| 430 200% | false | 0 | 1204 | 282–534 |

## 9. Cookie/nav/safe-area results

Lab result:

- Header does not cover H1 at normal mobile widths.
- Bottom nav exists on mobile web and page has bottom padding via `app/page.tsx` `pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]`.
- Cookie/banner + bottom nav intersection was not observed in automated geometry guard.
- `env(safe-area-inset-bottom)` is included in bottom padding.

Remaining evidence gap:

- Real iOS Safari/PWA safe-area smoke is not available in this session.
- Real Android Chrome smoke is not available in this session.

## 10. Accessibility results

Automated:

- `docs/wave4-homepage-evidence/mobile-review/mobile-review-report.json`
- 320/375/430 normal and 200% zoom: `0` axe violations, `0` critical/serious.
- Locale trigger contrast fixed in `app/globals.css`.
- Homepage interactive elements use visible `focus-visible` classes.

Manual/lab limitation:

- The focus script tabs sequentially without scroll-centering all later elements, so it flags later offscreen controls as under the bottom nav. The primary first-screen journey focus is visible. Full keyboard/focus acceptance still needs a manual pass on real browsers/devices.

## 11. Performance and SEO results

SEO preservation:

- Homepage metadata remains in `app/page.tsx`.
- Canonical remains `/`.
- JSON-LD uses `serializeJsonLd`.
- Internal links: 59 checked, 0 failures.
- Build route inventory confirms `/`, `/my-day`, `/plan`, `/canggu`, area/category/plan routes are build-visible.

Performance:

- Production build passes.
- Lighthouse x3 cold mobile runs were not executed in this pass; full performance gate remains pending.
- No new third-party analytics/provider dependency was added.
- No database schema, migration or production data change was made.

## 12. Commands and results

| Command | Result |
|---|---|
| `node scripts/wave4-homepage-mobile-geometry.mjs http://127.0.0.1:3002 docs/wave4-homepage-evidence/mobile-release-quality/mobile-geometry.json` | PASS: 134 checked, 0 failures |
| `node /private/tmp/wave4_mobile_review.mjs http://127.0.0.1:3002 .../mobile-review` | PASS for axe/overflow on 320/375/430 normal + 200%; focus has lab limitation |
| `node /private/tmp/wave4_internal_links.mjs http://127.0.0.1:3002 .../internal-link-validation.json` | PASS: 59 links, 0 failures |
| `node --test scripts/wave4-homepage-boundary.test.mjs` | PASS: 6/6 |
| `npm run test:wave1` | PASS: 46/46 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS with 1 warning |
| `npm run build` | PASS |

Lint warning:

- `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx`: pre-existing `<img>` warning, unrelated to homepage addendum.

## 13. Pre-existing failures separated from introduced failures

Pre-existing / unrelated:

- ESLint warning in partner photo review panel.
- Legacy source attachments missing from accessible workspace search.
- Real device/browser-cloud validation not available.
- Lighthouse x3 not run in this pass.

Introduced failures:

- None found in completed lab checks.

## 14. Final score with evidence

Strict addendum release score cannot honestly reach 95 in this environment because the task reserves evidence for real comprehension/device checks and Lighthouse.

Evidence-based lab score:

| Area | Points | Status |
|---|---:|---|
| Responsive integrity and visual stability | 25/25 | PASS lab |
| First-screen clarity and journey distinction | 12/15 | PASS lab; comprehension test missing |
| IA, deduplication and length | 18/20 | PASS functional; exact before height baseline unavailable |
| Mobile scanability and hierarchy | 10/10 | PASS lab screenshots |
| Header/cookie/bottom nav/safe area | 7/10 | PASS lab; real device safe-area pending |
| Accessibility | 8/10 | axe PASS; manual device focus pending |
| Copy/data trust | 5/5 | PASS |
| Performance and SEO preservation | 3/5 | Build/link/SEO PASS; Lighthouse x3 pending |
| Total | 88/100 lab-complete | Release acceptance pending |

If real-device, comprehension and Lighthouse evidence pass without new issues, expected score can rise to the addendum’s 95+ release floor. Until then: `code_complete_external_validation_pending`.

## 15. Remaining gaps and post-release monitoring

Required before production release under the strict addendum:

1. Real iOS Safari + PWA smoke:
   - rotation;
   - Safari toolbar/visualViewport;
   - safe-area bottom;
   - keyboard focus not hidden by fixed UI.
2. Real Android Chrome smoke.
3. Five-person ten-second comprehension smoke:
   - question: “What are the two main things you can do here, and how are they different?”
   - pass: at least 4/5 distinguish choose-now from plan-trip.
4. Lighthouse mobile x3 cold runs on production build.
5. Manual keyboard/focus pass in Chromium and WebKit.
6. Optional production monitoring after release:
   - p75 INP;
   - homepage CTA events;
   - Search Console indexability/head regression.

## 16. Safe deployment checklist

Before production deploy:

- [ ] Commit only Wave 4 homepage/mobile changes; exclude `public/scenes/venues-story.mp4` and unrelated recovery artifacts unless explicitly approved.
- [ ] Keep `app/layout.tsx` JSON-LD hardening as a clearly labelled global security commit if included.
- [ ] Push branch and open PR.
- [ ] Confirm CI green.
- [ ] Confirm preview URL passes:
  - mobile screenshots 320/375/430;
  - internal links;
  - axe;
  - keyboard/focus;
  - Lighthouse x3;
  - real device smoke.
- [ ] Get explicit production deploy approval.

