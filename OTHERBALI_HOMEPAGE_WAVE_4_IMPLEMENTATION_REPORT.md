# Other Bali Homepage Wave 4 Implementation Report

Дата: 2026-07-22  
Статус: Phase B implementation complete; release evidence partial because Lighthouse/axe/provider debug were not executed in this environment.  
Scope: `/` homepage only. No migrations, no production deploy, no Chope changes.

## 1. Executive outcome

Реализован утверждённый Gate A reset главной страницы:

- homepage теперь строится вокруг whole-Bali decision journey, а не длинного cinematic landing;
- первый экран содержит один H1, два туристических intent CTA и approved promise;
- scenario layer расположен выше категорий;
- Canggu не получает отдельную глобальную механику;
- `Open now`, paid placement, QR/perks и B2B-питч не добавлены;
- resident picks намеренно не выведены, потому что в `DATA-4.1` не был подтверждён explicit curated venue source;
- ключевой copy и internal links присутствуют в server-rendered HTML;
- добавлены boundary tests для Wave 4 homepage contract;
- production build, typecheck, lint и Wave 1/Wave 4 tests проходят.

## 2. Approved Gate A artifacts

| Artifact | Version | SHA-256 |
|---|---|---|
| WIRE | 4.1 | `a8d7868b4b964e4d3cb4cf56aef0038d1ab4cd25bb012f6bcee4a54f5eeaecae` |
| COPY | 4.1 | `513248ca2745d76e2ce0e7d3b6f7f93eb5a67dd1aa49c183078b03653cece713` |
| DATA | 4.1 | `727cf53bf797ad572ef45a9cff64b2d8cb1f5d30905e3f88f62e9c23fe57050d` |
| ANALYTICS | 4.1 | `c1935c2720a69fcba123bf6ea939f4e49da21dc60a40becdee93f412c4cfbd78` |
| AC | 4.1 | `3ee2c6f61af404b8889dede4716dcf2fd4ec652b2be990d7dba424027877ee8e` |

## 3. Changed files

| File | Reason |
|---|---|
| `app/page.tsx` | Replaced old homepage with approved Wave 4 section order, copy, metadata and safe JSON-LD. |
| `lib/homepage.ts` | Added homepage source-of-truth config: copy, stable IDs, target paths, required links and visible section data. |
| `components/HomeAnalyticsLink.tsx` | Added consent-gated homepage analytics wrapper for approved CTA/click taxonomy. |
| `lib/seo/json-ld.ts` | Added safe JSON-LD serializer to avoid raw `<script>` breakout risk. |
| `app/layout.tsx` | Reused safe JSON-LD serializer for global site schema. |
| `components/GlobalHeader.tsx` | Allowed existing global header to render on `/`; no global redesign. |
| `scripts/wave4-homepage-boundary.test.mjs` | Added Wave 4 homepage contract tests. |
| `scripts/wave1-home-boundary.test.mjs` | Updated old Wave 1 homepage guardrails to the approved Wave 4 product contract. |
| `docs/wave4-homepage-evidence/after/*` | Captured post-implementation screenshots and rendered HTML evidence. |

## 4. Requirement matrix

| Area | Status | Evidence |
|---|---|---|
| One H1 / approved hero | PASS | `app/page.tsx`; `homepage-baseline.json` shows `h1Count: 1`. |
| Whole-Bali alignment | PASS | Hero, moments, areas, plans and categories use Bali-wide language; no Canggu-first module. |
| Scenario layer above categories | PASS | `app/page.tsx` order: hero → moments → plan → categories → trust/save. |
| No `Open now` | PASS | Boundary test and rendered text check pass. |
| No paid/sponsored homepage inventory | PASS | No paid fields or sponsored modules added. |
| No resident picks without source | PASS | `home_picks` omitted because explicit curated source remains unconfirmed. |
| CTA targets avoid 404 by static validation | PASS | `scripts/wave4-homepage-boundary.test.mjs` validates required homepage targets. |
| Server-rendered key copy/internal links | PASS | `docs/wave4-homepage-evidence/after/homepage-rendered.html`. |
| Analytics implementation | PARTIAL | Consent-gated `gtag` dispatch implemented. Real provider debug not executed; no DB event migration added by scope. |
| Accessibility | PARTIAL | Native links/buttons and screenshot QA complete; axe/manual full keyboard audit not executed. |
| Performance | PARTIAL | Production build passes; Lighthouse median not executed. |
| Shared footer B2B separation | PASS WITH NOTE | Homepage did not add B2B modules. Existing shared footer remains unchanged by Gate A default. |
| Production deploy | N/A | Not requested for Phase B. |

## 5. Visual evidence

Post-implementation screenshots:

- `docs/wave4-homepage-evidence/after/homepage-320.png`
- `docs/wave4-homepage-evidence/after/homepage-375.png`
- `docs/wave4-homepage-evidence/after/homepage-768.png`
- `docs/wave4-homepage-evidence/after/homepage-1024.png`
- `docs/wave4-homepage-evidence/after/homepage-1440.png`

Rendered evidence:

- `docs/wave4-homepage-evidence/after/homepage-baseline.json`
  - SHA-256: `c1cb25af958a6b1302bf47bfa1976188b2284b6abe4e5e5bfdab74051d1621c0`
- `docs/wave4-homepage-evidence/after/homepage-rendered.html`
  - SHA-256: `415b0a3de85b7702afdc4bb8e6e834c4f1294ec2bbdb7f0e8eaa527c8392aa14`

Captured checks:

- HTTP status: 200
- title: `Other Bali — Curated Places, Routes & Trip Plans`
- description: approved COPY-4.1 description
- canonical: `https://www.otherbali.com`
- robots: no blocking robots meta found
- console errors: none captured
- horizontal overflow: no overflow relative to captured viewport

## 6. Copy compliance

Implemented approved public English copy:

- H1: `The right Bali for the moment you’re in.`
- Body: `Find places, routes and practical plans for your day or trip — with clear guidance, not endless lists.`
- Primary CTA: `Choose what to do`
- Secondary CTA: `Plan my trip`
- Moments heading: `What do you want to do?`
- Planning heading: `Plan your Bali trip`
- Categories heading: `Explore Bali by category`
- Trust heading: `Curated by people who live here.`
- Save heading: `Keep your Bali shortlist in one place.`

No public Russian copy was added.

## 7. Data-source and publication-gate evidence

Homepage-specific config stores stable IDs, labels, order and canonical targets only. It does not duplicate venue records.

Dynamic venue picks are not rendered because Phase A did not confirm a safe explicit curation mechanism for `home_picks`.

All editorial CTAs use existing routes confirmed during discovery/build. No new route engine, placeholder route, DB table, migration, import or publication status was added.

## 8. Analytics evidence

Implemented events:

- `home_scenario_select`
- `home_area_select`
- `home_plan_select`
- `home_category_select`
- `home_cta_select`

Payload includes:

- `event_id`
- `source_context=homepage`
- `section_id`
- `item_id`
- `item_kind`
- `position`
- `target_path`

Consent rule: dispatch occurs only when existing `analyticsAllowed()` returns true. Raw search text, phone, email and coordinates are not sent.

Known limitation: no internal `/api/event` storage was added because that would require event allowlist/data-model changes outside approved Wave 4 scope.

## 9. Commands and results

| Command | Result |
|---|---|
| `node --test scripts/wave4-homepage-boundary.test.mjs` | PASS, 6/6 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS, 1 pre-existing `<img>` warning in partner photo review panel |
| `npm run build` | PASS |
| `npm run test:wave1` | PASS, 46/46 |
| Local production preview capture on `127.0.0.1:3002` | PASS, screenshots and rendered HTML captured |

## 10. Pre-existing / not-in-scope issues

- `public/scenes/venues-story.mp4` is untracked and was not touched.
- Lint warning in `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx` is pre-existing and unrelated to homepage.
- Shared footer still contains existing venue/partner utility content. Wave 4 did not redesign footer by default.
- Lighthouse and axe were not executed; no new dependency or external audit tooling was installed.
- Real analytics provider debug was not executed in this environment.

## 11. Remaining release blockers / owner decisions

Before calling this production-ready under strict `AC-4.1`, decide:

1. Whether to accept the missing Lighthouse/axe/provider-debug evidence as a release exception or run those tools in a separate QA pass.
2. Whether existing footer B2B content is acceptable unchanged, or should become a separate footer-separation task.
3. Whether homepage `home_*` events should be stored in the internal analytics DB. If yes, that requires a separate migration/event allowlist task.
4. Whether to create branch/commit/PR for Wave 4 now.

## 12. Rollback note

Rollback is straightforward: revert the Wave 4 commit/patch touching `app/page.tsx`, `lib/homepage.ts`, `components/HomeAnalyticsLink.tsx`, `lib/seo/json-ld.ts`, `app/layout.tsx`, `components/GlobalHeader.tsx` and the two test scripts. No database rollback is required.
