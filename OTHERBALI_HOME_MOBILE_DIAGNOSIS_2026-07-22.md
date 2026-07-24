# Other Bali — Home Mobile Diagnosis

Дата: 2026-07-22  
Статус: `code_complete_external_validation_pending`  
Scope: public homepage `/`, mobile responsive quality, homepage hierarchy, CTA/copy hygiene. Production deploy не выполнялся.

## 1. T0 execution gate

T0 не пересоздавался и не смешивался с homepage branch.

Найденные доказательства:

- `OTHERBALI_T0_INDEXABILITY_DIAGNOSIS.md`
- `OTHERBALI_T0_VERIFICATION_REPORT.md`
- Git history: `bf52fb7 Merge pull request #180: T0 indexability recovery`
- Git history: `ad02cb9 Merge pull request #183: close T0 with GSC live verification`
- В отчётах T0 указаны отдельные коммиты `a9fd35d`, `38c34ee`, `62e0193`.

Вывод: addendum не заблокирован T0. Google re-indexing остаётся monitoring, не prerequisite.

## 2. Source availability

Прочитано:

- `AGENTS.md`
- `Other_Bali_Master_Architecture.md`
- `docs/money-model.md`
- `OTHERBALI_T0_INDEXABILITY_DIAGNOSIS.md`
- `OTHERBALI_T0_VERIFICATION_REPORT.md`

Legacy attachment availability:

- Найден только `/Users/msnigmatullaeva/Bali_Privilege_Master_Architecture.md`.
- Не найдены в доступном bounded search: `Bali_Privilege_Master_Architecture-3.md`, `Bali_Privilege_v0.1_Canggu.md`, `Bali_Privilege_Master_Architecture-2.md`.
- Inaccessible system/user areas during search included Photos Library, MobileSync, CloudDocs/TCC-protected Library folders. Эти источники не использовались как evidence.

## 3. Conflict register

| Statement | Source | Repository evidence | Status | Winning rule | Action |
|---|---|---|---|---|---|
| Live brand is Other Bali, not Bali Privilege | Addendum; AGENTS.md | `app/page.tsx`, `lib/homepage.ts`, `components/SiteFooter.tsx` use Other Bali | confirmed | Addendum wins | Preserve Other Bali public UI |
| Preserve promise “The right place for the moment you’re in.” | Addendum; AGENTS.md | `lib/homepage.ts` `HOME_HERO.h1`; `app/page.tsx` H1 | confirmed | Addendum wins | Kept exact H1 |
| Homepage is tourist-first with two distinct journeys | Addendum | `lib/homepage.ts` hero CTAs; `app/page.tsx` hero links | partially_confirmed before, confirmed after patch | Addendum wins | Changed CTAs to `Find a place now` and `Plan my trip` |
| Six accepted scenarios must appear once | Addendum | `lib/homepage.ts` `HOME_MOMENTS`; `scripts/wave1-home-boundary.test.mjs` | contradicted before, confirmed after patch | Addendum wins | Reduced scenarios to accepted six |
| Canggu remains active-deep but not global product centre | Addendum; `Other_Bali_Master_Architecture.md` | `app/page.tsx` Canggu module; no Canggu-first hero | confirmed after patch | Addendum + current architecture | Added one secondary Canggu deep-guide module |
| No `Open now` unless verified structured hours exist | Addendum; AGENTS.md | `scripts/wave4-homepage-boundary.test.mjs` blocks unsupported homepage claims | confirmed | Addendum wins | No `Open now` on homepage |
| Do not publish seated-visit/commission monetization claim | Addendum; money-model freeze | `docs/money-model.md` contains older seated-arrival model; `app/plan/page.tsx`, `app/terms/page.tsx`, `components/ScenarioView.tsx`, `components/SiteFooter.tsx` no longer publish it | contradicted historical docs; confirmed after patch | Latest freeze/addendum wins | Removed/narrowed public claim |
| Partner entrance must be secondary | Addendum | `components/SiteFooter.tsx` contains secondary `For businesses`; no large homepage partner card | confirmed after patch | Addendum wins | Removed large partner card from tourist homepage/footer |
| Do not weaken publication/indexability gates | Addendum; T0 reports | No DB/schema/publication gate changes in diff | confirmed | Addendum wins | No publication/indexability gate changes |

## 4. Root-cause diagnosis

### 4.1 Original narrow-column collapse

The previously supplied “extremely narrow column” mobile failure was not reproduced on current HEAD/local working tree during the addendum run.

Evidence:

- Continuous geometry sweep: `docs/wave4-homepage-evidence/mobile-release-quality/mobile-geometry.json`
- Result: `checked=134`, `failures=0`
- Viewports covered: 320–1024 CSS px with step <= 8 px, named phone/tablet/desktop viewports and breakpoint boundaries.

Classification: `needs_verification` for the original screenshot environment/revision. I did not invent a CSS cause for a failure that could not be reproduced.

### 4.2 Confirmed responsive defect found during diagnosis

A real horizontal overflow was found in the current homepage/footer implementation.

Root cause:

- File: `components/SiteFooter.tsx`
- Rule/component: footer link/contact grid switched to two/four columns too early for the long email address.
- Before fix, at `320px` CSS viewport: `documentElement.clientWidth=320`, `scrollWidth=351`; overflowing element was the footer email span with `right=350.875`.
- Before second fix, at `640px` CSS viewport: `clientWidth=640`, `scrollWidth=669`; the `sm:grid-cols-4` footer layout made the contact column overflow.

Fix:

- `components/SiteFooter.tsx`: footer grid now uses `min-[430px]:grid-cols-2 min-[900px]:grid-cols-4`.

Regression guard:

- Added `scripts/wave4-homepage-mobile-geometry.mjs`.
- Asserts no page horizontal overflow, non-collapsed `main`, mobile section width, and fixed UI geometry.

## 5. Homepage section inventory

| Order | Section/component | User job | Primary audience | CTA/destination | Analytics | Keep/Merge/Move/Remove | Reason |
|---|---|---|---|---|---|---|---|
| 1 | `app/page.tsx` hero | Understand product and choose immediate path | Tourist | `/my-day`, `/plan` | `HomeAnalyticsLink` with `sectionId=home_hero` | Modify | Previous CTA semantics were less explicit |
| 2 | `HOME_MOMENTS` / `CardGrid` | Choose by accepted scenario | Tourist | six published routes/pages | `sectionId=home_moments` | Modify | Reduced to accepted six, removed duplicate moment set |
| 3 | Plan areas/plans | Choose area or trip plan | Tourist | `/bali`, `/plan`, area/plan routes | `home_plan` events | Keep/compact | Fits `scenario → area → plan` model |
| 4 | Categories | Fast presentation buckets | Tourist | four canonical bucket routes | `home_categories` | Modify | Reduced from broad grid to four presentation-level shortcuts |
| 5 | Canggu deep guide | Explain current active-deep district | Tourist/on-island | `/canggu`, `/canggu-first-day` | `home_canggu` | Add | Preserves Canggu deep positioning without making homepage Canggu-first |
| 6 | Trust + Save | Explain safe choice model and shortlist | Tourist | `/places`, `/me` | `home_trust_save` | Modify | Replaced unsupported trust claims with neutral copy |
| 7 | Footer | Secondary utility navigation | Tourist + business utility | `For businesses` -> `/for-venues` | none | Modify | Removed large partner card and active monetization sentence |

## 6. CTA inventory

| Visible label | Accessible name | href/action | Section | Analytics event | Duplicate? | Required change |
|---|---|---|---|---|---|---|
| Find a place now | Find a place now | `/my-day` | Hero | `HomeAnalyticsLink home_hero/hero_now` | No | Implemented |
| Plan my trip | Plan my trip | `/plan` | Hero | `HomeAnalyticsLink home_hero/hero_plan` | No | Implemented |
| First day in Bali | Card label + contextual text | `/first-time-in-bali` | Moments | `home_moments/first_day` | No | Implemented |
| Sunset | Card label + contextual text | `/where-to-watch-sunset-in-bali` | Moments | `home_moments/sunset` | No | Implemented |
| With kids | Card label + contextual text | `/bali-with-kids` | Moments | `home_moments/with_kids` | No | Implemented |
| Rainy day | Card label + contextual text | `/bali-rainy-day` | Moments | `home_moments/rainy_day` | No | Implemented |
| Romantic | Card label + contextual text | `/romantic-bali` | Moments | `home_moments/romantic` | No | Implemented |
| Plan 3 / 5 / 7 days | Card label + contextual text | `/plan` | Moments | `home_moments/plan_days` | Partial with hero Plan | Allowed different journey stage |
| Explore Bali areas | Explore Bali areas | `/bali` | Plan areas | plain Link | No | Validated 200 |
| See all Bali plans | See all Bali plans | `/plan` | Plan | plain Link | Partial with hero Plan | Accepted as section-level all-plans link |
| Eat & Drink | Eat & Drink | `/best-restaurants-in-bali` | Categories | `home_categories` | No | Implemented |
| Beach & Pool | Beach & Pool | `/best-beach-clubs-in-bali` | Categories | `home_categories` | No | Implemented |
| Wellness | Wellness | `/best-spas-in-bali` | Categories | `home_categories` | No | Implemented |
| Things to Do | Things to Do | `/things-to-do-in-bali` | Categories | `home_categories` | No | Implemented |
| Open the Canggu guide | Open the Canggu guide | `/canggu` | Canggu | `home_canggu/canggu_deep` | No | Implemented |
| Start with Canggu now | Start with Canggu now | `/canggu-first-day` | Canggu | `home_canggu/canggu_first_day` | No | Implemented |
| Build my shortlist | Build my shortlist | `/places` | Trust/save | `home_trust_save/save_start` | No | Existing shortlist entry preserved |
| View my shortlist | View my shortlist | `/me` | Trust/save | `home_trust_save/saved_open` | No | Existing saved route preserved |
| For businesses | For businesses | `/for-venues` | Footer | none | No | Secondary footer-only business link |

## 7. Claim inventory

| Claim | Evidence | Status | Action |
|---|---|---|---|
| “Curated by people who live here” on homepage trust block | Previous copy, unsupported for every rendered item | unsupported | Removed |
| “Information is reviewed and date-stamped” on homepage trust block | Not proven item-level on homepage | unsupported | Removed |
| Seated-visit / commission monetization sentence | Conflicts with current freeze/addendum | contradicted | Removed from public homepage/footer-related copy |
| “No sponsored homepage ranking” | Money-model freeze and addendum | verified as policy | Kept as trust principle |
| Canggu deepest active guidance | Architecture/addendum says Canggu active-deep | partially_verified | Kept with bounded wording “right now” and no claim that other districts lack cards |
| `Open now`, verified hours, waiting time, booking difficulty | No structured-hours proof for homepage | unsupported | Not shown |

## 8. Frozen point-level scorecard

Weights follow the addendum.

| Area | Points | Evidence rule | Current status |
|---|---:|---|---|
| Responsive integrity and visual stability | 25 | Geometry sweep + named viewports + no overflow | 25/25 lab |
| First-screen clarity and journey distinction | 15 | H1 + two distinct CTAs visible at 390×844; user comprehension test | 12/15 lab; 3 points reserved for real comprehension test |
| Information architecture, deduplication and length | 20 | Section inventory; duplicates removed/merged | 18/20; exact before height baseline not fully reconstructable |
| Mobile scanability and visual hierarchy | 10 | 320/375/430 screenshots + section widths | 10/10 lab |
| Header/cookie/bottom nav/safe area | 10 | Fixed UI geometry + clickable controls + real device safe area | 7/10 lab; 3 points reserved for real iOS/Android |
| Accessibility | 10 | axe 0 critical/serious + focus/zoom/reflow | 8/10 lab; manual focus/device verification still needed |
| Copy/data trust | 5 | Unsupported claims absent | 5/5 |
| Performance and SEO preservation | 5 | Build, links, head; Lighthouse x3 required for full points | 3/5; Lighthouse x3 not run in this pass |

Honest score cap under this evidence: `88/100–94/100` depending on whether owner accepts lab-only focus evidence. I will use `94 max` only after external validation and Lighthouse are supplied; current status remains blocked for release acceptance.

## 9. Implementation plan executed

1. Confirm T0 gate and repository constraints.
2. Diagnose current responsive geometry without first changing CSS.
3. Add preventive/diagnostic geometry guard.
4. Fix proven footer overflow.
5. Simplify homepage CTA hierarchy and accepted scenarios.
6. Remove unsupported trust and monetization copy.
7. Preserve Canggu active-deep positioning as one bounded module.
8. Validate links, mobile geometry, axe, tests, typecheck, lint and build.

