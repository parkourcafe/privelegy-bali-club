# Fable Workflow Audit

**Date:** 2026-07-20
**Workspace analyzed:** `/home/user/privelegy-bali-club` (repo `parkourcafe/privelegy-bali-club`, branch `claude/workspace-automation-audit-juzefw`)
**Method:** read-only. 9 parallel analysis passes (process/docs, data-ops, Supabase, mobile/store, SEO, GTM/outreach, frontend, testing/CI, git history), each followed by an adversarial evidence re-check against the cited files. No file was modified except the creation of this report.

> **Scope note:** the requested path `~/Projects` does not exist in this execution environment (a remote session container where only this repository is cloned). This audit therefore covers the one accessible workspace — this repo. If you have other projects under `~/Projects` on your local machine, re-run this prompt in a local session to extend the audit.

**Inaccessible during this audit:**
- `~/Projects` — does not exist in this environment.
- Git history before commit `66b914b` (2026-07-16) — the clone is shallow (128 commits visible, ~6 days).
- Remote branches other than `origin/main` and the current audit branch.
- The production Supabase database, Vercel, Google Search Console, and the three store consoles (no credentials in session — claims about them come from repo docs only).

**Facts vs interpretations:** every claim below that cites a file path was verified against the file. Statements marked *Interpreted* are inferences from patterns, not directly provable from files.

---

## 1. Executive Summary

The ten highest-leverage improvements, ordered by (impact ÷ effort):

**1. Fix test discovery — 38% of your tests never run.**
- **Problem:** `package.json`'s `test` script hand-enumerates 31 test paths. 20 of the repo's 52 test files are in no runner anywhere — including `lib/admin-auth.test.ts` and publication fail-closed boundary tests. Git history shows the list was hand-edited in 8 commits over 4 days; the orphans were *never* in it.
- **Why it wastes time:** CI stays green while guardrail-critical suites are dormant; every session pays a manual bookkeeping step; "N/N tests passed" in handoffs measures a shifting subset.
- **Fix:** switch to globs (`node --import tsx --test 'lib/**/*.test.{ts,mjs}' 'scripts/*.test.{ts,mjs}' 'mobile/tests/*.test.ts'` — Node 22 supports this) + a tiny self-check script that fails if any `*.test.*` file is undiscovered. Then run the full suite once and fix what surfaces.
- **Expected impact:** recovers 20 dormant suites; deletes a per-session chore forever. **Difficulty: Low**

**2. Migration number allocator + collision guard in CI.**
- **Problem:** `supabase/migrations/` has 54 files with 8 duplicate-prefix groups (0015–0019 ×2 each, 0031 ×3, 0032 ×2, 0035 ×2). `AGENTS.md` §9's "verify the current highest number" is prose-only and demonstrably fails under parallel sessions. `scripts/collect-venue-photos.mjs` still hardcodes writing `0044_local_photo_paths.sql` while `0044_submission_reference.sql` already exists — the next run mints a fresh collision. `README.md:50-54` blocks applying the migration folder until 0015–0019 are reconciled, yet 0035–0045 landed anyway.
- **Why it wastes time:** apply-order ambiguity already cost a dedicated production forward-repair session (`docs/loop/LIVE_PRODUCTION_FORWARD_REPAIR_20260714.md`).
- **Fix:** `scripts/new-migration.mjs` (prints/creates next free number) + `scripts/check-migration-numbers.mjs` failing CI on new duplicate prefixes (grandfather the existing ones) + fix the hardcoded 0044.
- **Expected impact:** permanently ends the defect class that currently blocks schema work. **Difficulty: Low**

**3. Production applied-migration ledger + read-only status probe.**
- **Problem:** which migrations are live is reconstructable only from prose snapshots. `docs/loop/PRODUCTION_SNAPSHOT_2026-07-15.md`: the prod `supabase_migrations` table recorded **12** entries while the repo carried **42** files, with objects from later migrations present anyway. Every release re-answers "is 00NN applied?" by hand-probing tables.
- **Fix:** `supabase/APPLIED.md` append-only ledger (file, date, applied-by) updated at apply time + `scripts/migration-status.mjs` (read-only service-role: probe created objects via `to_regclass`/`pg_proc`, diff vs disk, print a status table).
- **Expected impact:** kills the single biggest recurring archaeology task for both you and every session. **Difficulty: Medium**

**4. Editorial content → migration compiler (stop hand-writing SQL).**
- **Problem:** ~16 data-bearing migrations (~3,500 lines) of venue editorial prose were hand-transcribed into SQL by AI sessions, one district pass at a time (`0021` alone is 382 lines / 34 venues). Downstream tooling (`collect-venue-photos.mjs`) then *regex-parses the SQL back out* to rebuild the venue roster. A FK-ordering mistake in 0039 needed a same-series fix commit.
- **Fix:** generalize the already-existing `scripts/build-wellness-import-sql.mjs`: editorial truth lives in `data/editorial/<district>.json`; `scripts/build-editorial-migration.mjs` validates jobs-slugs against `lib/intents.ts`, emits the idempotent coalesce-style SQL, and allocates the number via the allocator from item 2.
- **Expected impact:** each district pass drops from hours of AI transcription (and a new fragile SQL artifact) to a reviewable data file + one command. **Difficulty: Medium**

**5. `/district-launch` skill + one parameterized `DistrictGuideView`.**
- **Problem:** the deep-district launch has been executed six times (Canggu, Ubud, Seminyak, Sanur, Jimbaran, Nusa Dua — Uluwatu is pre-pattern and bespoke) by copying ~10 files: six near-identical `*GuideView.tsx` components, 21 identical 22-line wrapper pages, per-district maps inside the 774-line `app/places/[slug]/page.tsx`, plus `HUB_EXCLUDE_DISTRICTS`. A forgotten step already caused a real duplicate-content SEO bug (`/canggu` vs `/bali/canggu`, documented in `docs/ubud-launch-audit.md` §0).
- **Fix:** one `components/DistrictGuideView.tsx` + `lib/district-registry.ts` + `scripts/scaffold-district.mjs` + a `.claude/skills/district-launch/SKILL.md` checklist; add a unit test asserting every pillar slug is in `HUB_EXCLUDE_DISTRICTS`.
- **Expected impact:** hours saved per remaining district (Jimbaran deepening, Nusa islands, Denpasar); kills a proven bug class. **Difficulty: Medium**

**6. `/session-start` + `/handoff` commands; archive the finished loop; write `docs/CURRENT_PHASE.md`.**
- **Problem:** every session re-performs an 8-step manual discovery ritual (AGENTS.md §3) and reads a ~2,600-line authority stack, a third of which (`PARALLEL_LOOP_EXECUTION_PLAN.md`, 746 lines, + loop prompts) describes a program that **finished 2026-07-14**. The "current" handoff `docs/SESSION-HANDOFF.md` is frozen at 2026-07-13 and instructs applying `0026_menu_action_foundation.sql` — a file that no longer exists (renumbered to 0032); six more docs repeat the dead reference. Meanwhile the two *live* parallel sessions (PRs #161–#166) have no ownership matrix at all, and duplicate work already happened (a 282-line `HotelSubmissionForm.tsx` added and deleted the same day; the site header built twice and reconciled twice).
- **Fix:** `.claude/commands/session-start.md` (runs git status/branch/log, prints highest + duplicate migration numbers, prints `docs/CURRENT_PHASE.md`); `.claude/commands/handoff.md` (pre-fills the handoff template from git); move loop-era docs to `docs/archive/loop-2026-07/`; write a one-page `docs/CURRENT_PHASE.md` naming active sessions and file ownership; update or retire `SESSION-HANDOFF.md`.
- **Expected impact:** 10–20 min saved per session, stale-instruction hazards removed, parallel-session rework prevented. **Difficulty: Low**

**7. Outreach: one template module, one batch builder, one outreach log.**
- **Problem:** owner WhatsApp copy exists in **five** independently drifting template families (two admin TSX pages, the reverse-magnet skill, a batch file, an ops doc). The Selena→Fadjri sender rename reached one of five. The last 24-venue magnet batch shipped with `{TOKEN}` placeholders and a documented manual merge step. There is **no record anywhere** of who was contacted when — no sent/replied/follow-up state (the DB roster knows only `confirmed`/`has_photo`), while `docs/DATA_OPS_TRACK.md` promises a 7-day follow-up rule.
- **Fix:** `lib/outreach-templates.ts` as single source imported by both admin pages and referenced by the skill; `scripts/build-outreach-batch.mjs` (join skill output with the invites export, fail on any `{TOKEN}`/stale sender); a `venue_outreach_log` table + "mark sent" on `/admin/invites`.
- **Expected impact:** no more broken links/wrong sender to real owners (trust-critical), batch prep drops ~30–60 min, follow-ups become mechanical. **Difficulty: Medium**

**8. Browser QA that actually runs: §18 smoke suite + evidence capture.**
- **Problem:** AGENTS.md §18 mandates ~10 browser checks per menu/action change, but CI has zero browser steps; the only browser script (`scripts/smoke-public-preview.mjs`) is dead code — macOS-hardcoded Chrome path, referenced by nothing, and its expectations now *contradict the live site* (asserts `/uluwatu` must 404). QA evidence is 7 PNGs hand-captured once with no generator or index.
- **Fix:** resurrect the smoke script with route expectations derived from `lib/pillars.ts`/guides (puppeteer-core is already a devDependency and Chromium is available in CI); add `scripts/capture-qa-evidence.mjs` (base URL + route list → dated mobile/desktop screenshots).
- **Expected impact:** the most repeated manual QA loop becomes one command; "Browser QA: pass" claims become honest. **Difficulty: Medium–High**

**9. Release loop consolidation: single status page, single version writer, post-deploy verifier.**
- **Problem:** release state is narrated in prose across docs that keep getting superseded — six docs now carry hand-stamped `SUPERSEDED` banners. Release identity (version/build) is hardcoded in ~6 places that must be bumped in lockstep (`build-ios-release.sh` `VERSION="1.0"` / `BUILD_NUMBER="4"`, `release-artifacts-core.mjs`, Xcode project, manifest…). Post-deploy verification is a manual curl checklist with already-stale pinned counts ("89 venues"). The 07-18 release day produced **9 PRs from the same branch in 16 hours** as the founder hand-drove the guard-failure loop.
- **Fix:** `scripts/release-status.mjs` regenerating one `docs/release/STATUS.md` from the existing validators; `scripts/bump-release-version.mjs` as single writer + consistency assertion; `scripts/verify-production-release.mjs`; `scripts/release-loop.mjs` running the full guard chain locally before any PR.
- **Expected impact:** ends the write-then-supersede doc cycle; the next release (build 5) stops being a 6-edit scavenger hunt; post-deploy checks take seconds. **Difficulty: Medium**

**10. Doc canon linter — stop paying the contradictory-docs tax.**
- **Problem:** `docs/SEO_STRATEGY.md` (Russian, SERP-based) and `docs/seo-strategy.md` (English, DB-based) are two *different strategies* both actively cited by other runbooks; `docs/OTHER_BALI_PLATFORM_ARCHITECTURE_20260715.md` exists at two paths with an 83-line diff; `docs/gsc-setup.md` names the wrong canonical host (apex vs the code's `www`); `docs/first-page-action-plan.md` item 3 contradicts the later www decision with no supersession note. AGENTS.md §1 orders a hard stop on authority conflict — so sessions either stall or silently pick one.
- **Fix:** one merge pass choosing canonical copies (losers → `docs/archive/` with a superseded-by header) + `scripts/check-doc-canon.mjs` in CI: fail on case-insensitive duplicate basenames outside `docs/archive/` and on references to nonexistent `supabase/migrations/NNNN_*.sql` filenames.
- **Expected impact:** each new session stops burning its first hour reconciling contradictions; doc drift becomes a red CI line. **Difficulty: Low**

---

## 2. Repeated Work Patterns

| Workflow | Evidence found | Current pain | Recommended automation | Priority |
|---|---|---|---|---|
| District editorial pass (research prompt → deep-research → validate → hand-write SQL migration) | `docs/research-prompt-{sanur,sanur-eating,seminyak}.md` (near-identical, 103–120 lines); migrations 0019–0029, 0031, 0032, 0039–0042; ~3,500 lines of hand-written data SQL | Hours per district; number collisions; stale prompt refs (two prompts still point at "migration 0021_enrich_thin_venues.sql" — renumbered long ago) | `data/editorial/*.json` + `scripts/build-editorial-migration.mjs` + `/district-research-prompt` skill | P0 |
| Deep-district frontend launch (6× done) | 6 near-identical `*GuideView.tsx`; 21 identical wrapper pages; per-district maps in `app/places/[slug]/page.tsx` (774 lines); `docs/nusa-dua-launch.md` "Sixth deep district, same shape as Seminyak" | ~10 hand-edited files per district; caused the live `/canggu` vs `/bali/canggu` duplicate-content bug | One `DistrictGuideView` + `lib/district-registry.ts` + `scripts/scaffold-district.mjs` + `/district-launch` skill | P0 |
| Session-start discovery ritual | AGENTS.md §3; identical "Read first" blocks in all five loop prompts; discovery notes heading handoffs | 10–20 min of identical tool calls + ~2,600 lines of mandatory reading per session (a third obsolete) | `/session-start` command; archive loop docs; `docs/CURRENT_PHASE.md` | P0 |
| Venue batch ingest (KORA pipeline) | Commits `4941d24`→`d122c99`, all on 2026-07-19: stage → insert migration (0041) → publish migration (0042) → review doc; 26 hand-written batch review docs in `docs/data-ops/` | ~4 hand-authored SQL/doc artifacts per batch; FK-ordering rework (0039 fix) | `/venue-batch-import` skill wrapping `compile-data-ops.mjs` + migration generator; `scripts/render-batch-review.mjs` | P0 |
| Per-PR release checklist (hand-written, Russian) | `docs/RELEASE_CHECKLIST_PR160.md` (96 lines, per-file "накат на Supabase" vs "merge+деплой" table); same structure in 2 more handoff docs | ~1 hour per release; transcription errors are exactly how the stale-0026 class of bug propagates | `scripts/release-checklist.mjs` from `git diff --name-only main...HEAD` + template | P1 |
| Store screenshot evidence rebinding | `docs/release/evidence/*/capture.json` hand-authored; `store-assets/README.md` says Android set "must be recaptured and rebound" | Hand-hashing 5 PNGs and hand-writing schema-validated JSON per recapture | `scripts/write-capture-evidence.mjs` generator | P1 |
| Post-deploy verification (SEO + mobile API) | `docs/release/other-bali-1.0.md:31-44` curl list with pinned "89 venues"; `docs/seo/TECHNICAL_RELEASE_HANDOFF_2026-07-18.md` step 4 | 10–15 min of manual curls per deploy; pinned counts already stale | `scripts/verify-production-release.mjs` + `scripts/seo-smoke-prod.mjs` | P1 |
| Weekly GTM dashboard + partner mini-reports | `docs/gtm/BALI_PRIVILEGE_GROWTH_MEASUREMENT_SPEC.md` §7 ("Monday dashboard 30 мин"); 90-day calendar W4 "first partner mini-reports (manual)" | ~1 founder-hour/week planned for 13 weeks; G6 monetization gate needs ≥4 weeks of reports | `scripts/gtm-funnel-report.mjs` + `scripts/partner-weekly-reports.mjs` looping the existing `getOperatorPartnerReport` | P1 |
| Owner outreach batch prep | `.claude/skills/venue-reverse-magnet/SKILL.md`; `data/data-ops/kora-leads/owner-outreach.md` shipping `{TOKEN}` placeholders + documented manual merge | 30–60 min merge+QA per batch; broken-link/stale-sender risk to real owners | `scripts/build-outreach-batch.mjs` with hard QA gate | P0 |
| i18n chrome-string maintenance | `lib/i18n/dictionaries.ts` (318 lines, 5 hand-sorted dictionaries); hand-synced `CHROME_LITERALS` list in the completeness test | Each new nav label = 5 dictionary edits + possibly a test-list edit | `scripts/i18n-sync.mjs` t()-call-site extractor + stub generator | P1 |
| Registering new test files | `package.json` test line grew 3→31 entries across 8 commits in 4 days | Forgotten entry = test silently never runs (20 already orphaned) | Glob-based test discovery | P0 |
| Sitemap & metadata upkeep | `app/sitemap.ts` edited 10× in 128 commits; 61 pages hand-write `openGraph` blocks; hand-typed `STATIC_LAST_MODIFIED` registry covers 8 of 65+ pages | Every new page = boilerplate edits on high-consequence files; silent SEO regressions | `lib/seo/page-metadata.ts` helper + `scripts/sitemap-diff.mjs` + lastmod check | P1 |
| Resort-F&B price verification | Commit `625a1c8` describes the 4-step manual dance (edit source HTML → sync 2 CSVs → extract → regenerate JSON); 3 verification commits in 4 days | Multi-file desync risk on trust-critical price data | `scripts/resort-fnb/verify-and-regenerate.sh` + staleness report | P1 |
| Russian founder briefs + manual-step lists | "Русское резюме для Селены" pattern across `uluwatu-launch-handover.md`, launch audits, `tablepilot-bridge-handoff.md` | Free-written each time; manual steps scatter across many docs | `/founder-brief` skill appending to one living `docs/FOUNDER_ACTION_QUEUE.md` | P2 |
| Social week production | `docs/social/content-calendar-13-weeks.md` (4–5 posts/week × 13 weeks) + starter-kit formulas; consent ledger specified twice but the file doesn't exist | Hours/week of assembly; consent guardrail unenforced | `/social-week` skill + create the consent ledger now | P2 |

---

## 3. Bugs And Fragile Areas

| Area | Evidence found | Risk | Suggested fix | Priority |
|---|---|---|---|---|
| Test discovery | 20/52 test files in no runner (incl. `lib/admin-auth.test.ts`, publication-boundary tests); never present in any historical `package.json` | Green CI while auth/publication guardrails are untested | Glob discovery + orphan self-check | P0 |
| Migration numbering & ordering | 8 duplicate-prefix groups / 54 files; `README.md:50-54` hard gate being bypassed (0035–0045 landed anyway); `collect-venue-photos.mjs` hardcodes the taken `0044` | Ambiguous apply order in prod/staging/disaster recovery; next photo run mints a new collision | Allocator + CI guard + fix the hardcoded filename | P0 |
| Unknown production applied-state | Prod ledger 12 entries vs 42 repo files (`PRODUCTION_SNAPSHOT_2026-07-15.md`); migrations carry defensive "may already be applied" archaeology (`0031_secure…` lines 1–3) | Partial/duplicate applies of ordered publish-flip pairs (0039→0040, 0041→0042); already caused an emergency lockdown + forward repair | `supabase/APPLIED.md` ledger + `migration-status.mjs` probe | P0 |
| Stale authoritative docs | `SESSION-HANDOFF.md` says apply `0026_menu_action_foundation.sql` (file is now `0032_…`); 6 more docs repeat it; `gsc-setup.md` wrong host + "GA4 live"; two conflicting SEO strategies | Sessions/founder execute wrong or impossible instructions; AGENTS.md §1 mandates a hard stop on conflict | Doc sweep + `check-doc-canon.mjs` in CI | P0 |
| Parallel-session shared surfaces | Header built twice, reconciled twice (`0248134` vs `405027e` → `9141757`); `HotelSubmissionForm.tsx` +282 lines added and deleted same day; no ownership matrix for the current two-session phase | Continued duplicate implementations and merge-order-dependent UI bugs | `docs/CURRENT_PHASE.md` ownership + `scripts/check-session-overlap.mjs` pre-PR | P1 |
| Hub/pillar duplicate-content coupling | The Canggu launch forgot `HUB_EXCLUDE_DISTRICTS` → live `/canggu` + `/bali/canggu` duplication (documented in `ubud-launch-audit.md` §0) | Every future pillar launch can split ranking signals again | Unit test: every `PILLARS` slug ∈ `HUB_EXCLUDE_DISTRICTS` | P0 |
| Root layout `headers()` vs ISR claims | `app/layout.tsx:105` awaits `getLocale()` → `headers()` (dynamic API) while public pages declare ISR with static-caching comments | Possible sitewide loss of static/ISR rendering (perf + crawl budget) — needs one verification pass of the build route table | Verify `npm run build` route table; if dynamic, move locale resolution off the layout critical path | P1 |
| Outreach copy drift + no QA gate | 5 template families; rename reached 1 of 5; `{TOKEN}` placeholders and "This is Selena" in a ready-to-send batch file; one live template still contradicts money-model v0.3 ("First 2 months free" on `/for-venues`) | Broken or contradictory messages to real venue owners during trust-building | Single template module + batch validator + copy audit | P0 |
| Store-package markdown-parsing gate | `validate-store-package.mjs:196-225` extracts listing copy by markdown heading/bold-label conventions (incl. Russian RuStore headings) | Any editorial rewording breaks the release gate — or worse, silently extracts wrong copy | Move listing copy to `store-assets/listing-copy.json`; generate the markdown | P1 |
| Release identity in 6 places | `build-ios-release.sh:6-9` hardcoded VERSION/BUILD; Xcode project; `release-artifacts-core.mjs` contract; manifest; docs | Next bump (build 5) requires 6+ synchronized edits; one miss fails the gate or ships mismatched | `bump-release-version.mjs` single writer + consistency test | P1 |
| Editorial truth only in SQL + prod DB | `collect-venue-photos.mjs` `buildRoster()` regex-parses migration SQL; wellness importer writes `google_rating`/`google_reviews` columns (guardrail #2 adjacency) | Any new SQL formatting silently breaks the roster parse; review-derived data one SELECT from a public path | Canonical `data/editorial/` store; publication-boundary test asserting google_* never reaches public reads | P1 |
| No freshness metadata on editorial prices | `0021` etc. write `price_anchor` with no captured-at; DATA_OPS commits to 45–60-day recheck | "Prices as of <date>" trust promise unenforceable | Additive `editorial_captured_at` + freshness queue script | P1 |
| Dead browser smoke | `smoke-public-preview.mjs`: macOS-only Chrome path, referenced nowhere, asserts `/uluwatu` must 404 (it's live) | The only browser safety net teaches wrong invariants | Rewrite with route fixtures derived from code; run in CI | P1 |
| Hardcoded prod project ref | `egkdapqwkfprtyqvvnso` in ≥8 places incl. inside migration SQL (`0030_photo_consent.sql:40` URL validation) | Same migration on staging silently rejects all photo uploads | Validate storage path prefix instead of host | P2 |
| Tap-target rule unenforced | `app/globals.css` has `min-height: 40px` at 7 locations vs AGENTS.md §7's 44–46px rule | Mobile usability regressions accumulate silently | `--tap-target` token + check script | P2 |
| Backslash-in-path Node ESM breakage | Recorded only inside two handoffs; forced a mirror-path workaround | Future sessions silently can't run tests | Document in `docs/DEV_ENVIRONMENT.md`; check in `/session-start` | P2 |

---

## 4. Missing Skills / Commands

| Skill / Command | Purpose | Where it applies | Input needed | Output | Priority |
|---|---|---|---|---|---|
| `/session-start` | Automate AGENTS.md §3 discovery: git state, recent commits, highest+duplicate migration numbers, current-phase pointer, known env quirks | Every session | none | Discovery note, ready to paste | P0 |
| `/handoff` | Pre-fill the handoff template from git SHAs, diff --stat, captured lint/test/build output | End of every session | base branch | Completed handoff doc | P0 |
| `/district-launch` | Ordered checklist for the full district cycle: DB density check → registry → guides → pillar → `HUB_EXCLUDE_DISTRICTS` → sitemap → audit doc from template | Each remaining district (Jimbaran deep, Nusa islands, Denpasar…) | district slug | Scaffolded files + launch-audit draft | P0 |
| `/district-research-prompt` | Emit the ~110-line deep-research prompt from one template; vocabulary imported from `lib/intents.ts`, venue slugs from data | Before each research run | district, angle, venue list (or "thin venues") | Ready research prompt | P0 |
| `/venue-batch-import` | Drive the KORA pipeline end-to-end: candidates → validated insert+publish migrations → review doc skeleton | Every venue batch | staged candidates file | Migrations + review doc | P0 |
| `/release-checklist` | Generate the PR160-style Russian go-live table from the actual PR diff (migrations in order vs merge+deploy) | Every release PR | PR/branch | Checklist markdown | P1 |
| `/app-store-review-prep` | Run `store:package:verify`, print pending owner gates, emit per-console field-by-field runsheet from the canonical copy | Submission day (14/15 owner gates still pending) | none | Three-console runsheet | P1 |
| `/gtm-monday-dashboard` | Pull events by `utm_source`, render the §7 funnel ladder + kill/keep thresholds | Weekly for 13 weeks | date range | Monday dashboard markdown | P1 |
| `/founder-brief` | Produce the "Русское резюме" + append manual actions to one living `docs/FOUNDER_ACTION_QUEUE.md` | Every launch/handover | branch/PR | RU brief + updated action queue | P2 |
| `/social-week` | Assemble week-N post drafts (caption/ALT/hashtags/CTA) and hard-fail any post whose photo isn't in the consent ledger | Weekly social production | week number | Ready post pack | P2 |
| `/price-verify` | Resort-F&B staleness report + guided verify-and-regenerate | Recurring price passes | none | Stale-rows report + synced files | P1 |
| `/seo-audit` | Run `seo-smoke-prod.mjs` matrix (canonicals, robots, 404s, redirects, sitemap diff) against production | Post-deploy, weekly | origin URL | Pass/fail report | P1 |
| `/project-readiness-check` | One command: lint + typecheck + full test glob + build + orphan-test check + migration-collision check, with handoff-formatted output | Before every PR | none | Paste-ready validation block | P0 |
| `/venue-data-qa` | Freshness + provenance sweep: editorial captured-at ages, expired menus, `needs_verification` backlog | Weekly data ops | none | QA queue | P2 |

---

## 5. Project-Specific Recommendations

Only one repository is accessible, so "projects" here are its major subsystems.

### `app/` + `components/` + `lib/` — the Next.js web product
- **What it is:** Next.js 16 App Router site; ~80 route dirs, 6 public locales (Phase A chrome only), district guides, action gateway, admin surfaces.
- **Bottlenecks:** 6 copy-pasted GuideViews; 21 identical wrappers; 774-line `places/[slug]` god page; 61 hand-written metadata blocks; 9 duplicated `categoryLabel` maps; two divergent `Reveal`/`MobileStickyCTA` implementations; possible sitewide dynamic rendering from `headers()` in the root layout.
- **Best automation:** district registry + scaffold generator; `buildPageMetadata()` + codemod; i18n sync script.
- **Missing docs:** component-usage guide (PlaceCard vs VenueCard vs ArtCard); i18n Phase B plan (grep for "Phase B" in docs/ returns nothing); design-token inventory for the 3,287-line `globals.css`.
- **Next action:** verify the build route table (static vs dynamic) — this is a one-session check with potentially sitewide SEO/perf payoff.

### `supabase/` — schema and data layer
- **What it is:** 54 migration files, RLS + SECURITY DEFINER RPC pattern (boilerplate hand-repeated across 23 files), no Supabase CLI config, no db npm scripts.
- **Bottlenecks:** number collisions; unknown prod applied-state; editorial content embedded in SQL; hand-applied via Studio SQL editor.
- **Best automation:** items 2–4 from the executive summary (allocator, ledger+probe, editorial compiler) + `MIGRATION_TEMPLATE.sql` with the canonical RLS/RPC blocks + a migration linter.
- **Missing docs:** staging-apply runbook (`OTHER_BALI_PREVIEW_SUPABASE_PROJECT_REF` exists in env example, no procedure); resolution record for the README 0015–0019 reconciliation gate.
- **Next action:** build the allocator + CI guard (an afternoon), then the applied-ledger before the next release.

### `mobile/` + `ios/` + `android/` + `store-assets/` — store submission
- **What it is:** Capacitor shell (separate 2,282-line React app, English-only Places/Routes/Saved) with an unusually mature fail-closed verification chain (hash-chained shell→archive→package gates, ~45 test cases). This is the *best-automated* area of the repo.
- **Bottlenecks:** the remaining work is console-and-legal (14/15 owner gates pending); screenshots + evidence JSON are hand-authored; version identity in 6 places; markdown-parsing release gate; shell drifting from the web product (6 locales vs English-only shell).
- **Best automation:** evidence-sidecar generator, version bumper, single release-status page, `/app-store-review-prep`.
- **Missing docs:** submission-day console runbook; a note reconciling the 2026-07-20 multi-locale amendment with the English-only shell and store listings.
- **Next action:** `scripts/release-status.mjs` — it ends the six-SUPERSEDED-docs cycle and gives you one true dashboard for the coming weeks of legal/account gates.

### `docs/data-ops/` + `data/` — venue data pipeline
- **What it is:** deterministic compile/import pipeline for menus/actions (genuinely automated, digests + fail-closed gates) next to a fully manual editorial pipeline; `data/resort-fnb/` CSV+HTML+JSON triple.
- **Bottlenecks:** 26 hand-written batch review docs; two overlapping photo-scrape scripts with a duplicate-migration-number landmine; editorial freshness untracked.
- **Best automation:** editorial compiler; batch-review generator; unified photo pipeline; freshness queue.
- **Missing docs:** a single "how to run a district editorial pass" runbook (currently reverse-engineered from per-district reports each time).
- **Next action:** fix the hardcoded `0044` in `collect-venue-photos.mjs` before its next run.

### `docs/gtm/` + `docs/social/` + outreach surfaces
- **What it is:** 90-day GTM plan, prospect CSVs (70+34+30 rows), 13-week social calendar, the reverse-magnet skill, `/admin/invites`.
- **Bottlenecks:** no pipeline state anywhere (CSVs are read-only, no sent/replied columns); 6 assets the calendar depends on don't exist as files (one-pager, answer bank, perk terms…); GTM funnel events (`optin_submitted`, `trip_dates_set`, referral events) don't exist in code while the calendar assumes them from day 2; consent ledger specified twice, created never.
- **Best automation:** template module + batch builder + outreach log (exec item 7); Monday dashboard; the asset template kit (six files, one session to draft).
- **Next action:** build the three missing funnel events *before* week 1 of the calendar — otherwise the first two weeks of channel tests are unmeasurable and the Friday kill/keep decisions run on vibes.

### `docs/seo/` + SEO code
- **What it is:** two competing strategy docs, dated execution records, hand-typed lastmod registry, per-district launch audits.
- **Bottlenecks:** strategy contradiction; manual GSC reading; manual post-deploy checks; content-map snapshot already stale (14 guides listed vs 30+ routes).
- **Best automation:** `seo-smoke-prod.mjs`; sitemap diff; GSC API report; content-map regenerator; pillar/hub invariant test.
- **Next action:** merge the two strategy docs and fix `gsc-setup.md`'s host/analytics claims — cheap, and it removes a founder-facing trap.

### `.claude/` — AI tooling
- **What it is:** exactly one skill (`venue-reverse-magnet`, 2026-07-18). No commands, no hooks, no settings.
- **Bottlenecks:** the skill already drifted (apex links vs `www` canon; "English public, Russian founder-facing" superseded by the six-locale amendment; hardcoded moment taxonomy).
- **Next action:** this is the highest-leverage empty directory in the repo — the entire Section 4 list belongs here. Point skills at code (`lib/moments.ts`, `lib/outreach-templates.ts`) instead of inlining copies.

---

## 6. My AI Usage Mistakes

- **Sessions write tests that never run.** — **Extracted.** 20 orphaned test files; the enumerated list was hand-grown in 8 commits and the orphans were never added. Nobody instructed sessions to register tests, and no mechanism catches the omission.
- **Parallel sessions without a current ownership map.** — **Extracted.** The ownership matrix covers only the finished four-session loop; the two live sessions (PRs #161–#166) duplicated a header and a 282-line form within days.
- **The same ~110-line research prompt is re-authored per district instead of parameterized.** — **Extracted.** Three near-identical prompt files, one saying "Same shape as the Ubud/Seminyak brunch packages"; two carry a stale migration reference.
- **Sessions imitate the previous artifact instead of following a template.** — **Interpreted** (strongly supported): six launch-audit docs, 26 batch-review docs, and six GuideView copies all show "read the last one and clone it" as the de-facto method. Every clone re-introduces drift.
- **AI transcribes structured data into SQL by hand.** — **Extracted.** ~3,500 lines of editorial prose in migrations, while a working CSV→SQL generator (`build-wellness-import-sql.mjs`) sat unused for the editorial path.
- **New status doc per session instead of updating one.** — **Extracted.** Six store/release docs required later `SUPERSEDED` banner-stamping; two SEO strategies and two architecture-doc copies coexist — almost certainly different sessions unaware of each other (*that cause is Interpreted*).
- **Instructions live in prose rules AI predictably violates under parallelism.** — **Extracted.** "Verify the current highest number" (§9) produced 8 collision groups; "no unregistered tests" isn't even a rule. Mechanical checks beat prose rules for anything two sessions can race on.
- **Skills/docs inline copies of product truth instead of referencing code.** — **Extracted.** The reverse-magnet skill hardcodes the moment taxonomy and language policy (both now stale); the 9-slug jobs vocabulary is duplicated verbatim in 5+ docs while `lib/intents.ts` is the real source.
- **Founder acts as the human clipboard between prod and repo.** — **Extracted** (documented in `docs/jobs-backfill-canggu-ubud.md` steps 1–2: export SQL from prod → hand-edit → paste back).
- **QA claims without a repeatable harness.** — **Extracted.** §18 demands browser checks and forbids claiming QA without a browser; the evidence is 7 unreproducible screenshots and a dead smoke script. *Interpreted:* under deadline pressure (9 release PRs in 16 hours on 07-18, guards loosened mid-stream) manual QA gets skipped exactly when it matters.
- **Weekly measurement cadence planned as manual work that predictably won't happen.** — **Interpreted.** "Monday dashboard (30 мин)" in a sheet, daily GSC checks in three docs — with no script behind any of it, on top of a solo founder's load.
- **No acceptance criteria for recurring artifact types.** — **Interpreted.** Batch reviews, launch audits, and handoffs vary in depth per session because "done" was never templated; the handoff template exists but its fields are filled by hand and drift (stale SHAs, dead migration refs).

---

## 7. Highest ROI Automations To Build First

Ranked. "Model" = who should build it (Sonnet for mechanical scripts, Opus for multi-file code work, Fable for judgment-heavy synthesis/refactors).

| # | Name | What it does | Why it matters | How to build | Est. time | Model |
|---|---|---|---|---|---|---|
| 1 | Glob test discovery + orphan check | Replaces the 31-path test enumeration with globs; self-check fails on undiscovered `*.test.*` | Recovers 20 dormant guardrail suites | Edit `package.json`; 20-line `scripts/check-test-discovery.mjs`; fix whatever the recovered suites surface | 1–3 h (plus fixes) | Sonnet (fixes: Opus) |
| 2 | Migration allocator + collision guard | `new-migration.mjs` prints/creates next free number; CI fails on new duplicate prefixes; fix hardcoded `0044` in photo collector | Ends the collision class blocking schema work | Two ~40-line scripts + one ci.yml step | 2 h | Sonnet |
| 3 | Applied-migration ledger + status probe | `supabase/APPLIED.md` + `migration-status.mjs` probing live objects read-only and diffing vs disk | Kills per-release applied-state archaeology | Node script w/ service-role key server-side; seed ledger from `PRODUCTION_SNAPSHOT_2026-07-15.md` + a fresh probe | 0.5–1 day | Opus |
| 4 | Editorial migration compiler | `data/editorial/*.json` → validated idempotent SQL; slugs checked against `lib/intents.ts` | Biggest recurring time cost (repeated 9+ district passes) | Generalize `build-wellness-import-sql.mjs`; back-convert one district as the test | 1 day | Opus |
| 5 | `/session-start` + `/handoff` commands | Automate §3 discovery and handoff pre-fill | 10–20 min × every session, forever; honest handoffs | Two `.claude/commands/*.md` files wrapping git/npm calls | 2 h | Sonnet |
| 6 | Doc canon cleanup + linter | Merge duplicate docs, archive the loop, `CURRENT_PHASE.md`, CI check for dup basenames + dead migration refs | Removes the first-hour-of-every-session contradiction tax | One curation session (needs your calls on canonical copies) + 60-line script | 0.5 day | Fable (curation) + Sonnet (script) |
| 7 | Outreach template module + batch builder | `lib/outreach-templates.ts` single source; batch script joins tokens, hard-fails on `{TOKEN}`/stale sender/truncation | Protects real owner relationships; kills 5-way copy drift | Extract from the two admin pages; refactor skill to reference it | 0.5 day | Opus |
| 8 | Outreach log + follow-up loop | `venue_outreach_log` table + "mark sent" on `/admin/invites` + weekly follow-up report | Makes the invites page a minimal CRM; gate metrics real | One migration (via #2!) + small RPC + UI button + report script | 1 day | Opus |
| 9 | District registry + scaffold + `/district-launch` skill | One `DistrictGuideView`, registry consumed by places page/breadcrumbs, scaffold script, pillar/hub invariant test | Halves each remaining launch; kills the duplicate-content class | Refactor 6 views into 1 (behavior-preserving), then generator | 1–1.5 days | Fable (refactor) + Sonnet (scaffold) |
| 10 | Release status generator + version bumper | One generated `docs/release/STATUS.md` from existing validators; single-writer version bump w/ consistency test | Ends supersede-cycle; makes build 5 a one-command bump | Wrap `inspect*` functions already exported by the release cores | 0.5–1 day | Opus |
| 11 | Production smoke pack | `verify-production-release.mjs` + `seo-smoke-prod.mjs` (fetch-based: status/canonical/robots/redirect matrix + mobile API counts vs live data) | Replaces two recurring manual checklists per deploy | Plain fetch, route matrix from `lib/pillars.ts`/guides | 0.5 day | Sonnet |
| 12 | §18 browser smoke + QA evidence capture | Resurrected smoke with code-derived fixtures + screenshot capture script; optional CI job | Automates the mandated browser checklist honestly | puppeteer-core already a dep; fixtures from `app/` dir | 1 day | Opus |
| 13 | `/venue-batch-import` skill + review-doc generator | Drives stage→migrations→review-doc from a candidates file using #2 and #4 | The single highest-volume commit chore (all of 07-19) | Skill md + `render-batch-review.mjs` from batch JSON | 0.5 day | Sonnet |
| 14 | GTM measurement pack | The 3 missing funnel events + `gtm-funnel-report.mjs` Monday dashboard + `partner-weekly-reports.mjs` + UTM link minter | 90-day calendar is unmeasurable without it; saves ~1 h/week | Events via existing `log_event_v2` pattern; reports via existing `getOperatorPartnerReport` | 1–1.5 days | Opus |
| 15 | i18n sync + metadata builder | `i18n-sync.mjs` extractor/stub-generator replacing `CHROME_LITERALS`; `buildPageMetadata()` + codemod over 61 pages | Removes two per-page/per-string recurring chores before Phase B multiplies them | Extractor is a grep; codemod is mechanical | 1 day | Sonnet |

---

## 8. Files To Create Next

| File | Purpose | Suggested owner model | Priority |
|---|---|---|---|
| `docs/CURRENT_PHASE.md` | Active sessions, file ownership, merge owner, read order — replaces the dead loop plan on the read path | Fable (with your input) | P0 |
| `.claude/commands/session-start.md` | §3 discovery ritual as one command | Sonnet | P0 |
| `.claude/commands/handoff.md` | Git-pre-filled handoff | Sonnet | P0 |
| `scripts/new-migration.mjs` + `scripts/check-migration-numbers.mjs` | Number allocation + CI collision guard | Sonnet | P0 |
| `supabase/APPLIED.md` + `scripts/migration-status.mjs` | Applied-state ledger + read-only prod probe | Opus | P0 |
| `scripts/check-test-discovery.mjs` (+ `package.json` glob edit) | Test discovery self-check | Sonnet | P0 |
| `data/editorial/README.md` + `scripts/build-editorial-migration.mjs` | Canonical editorial store + SQL compiler | Opus | P0 |
| `lib/outreach-templates.ts` + `scripts/build-outreach-batch.mjs` | Single outreach copy source + QA-gated batch builder | Opus | P0 |
| `.claude/skills/district-launch/SKILL.md` + `docs/templates/district-launch-audit.md` | Repeatable district cycle | Fable | P1 |
| `.claude/skills/district-research-prompt/SKILL.md` + `docs/templates/RESEARCH_PROMPT_TEMPLATE.md` | Parameterized research prompts | Sonnet | P1 |
| `docs/templates/MIGRATION_TEMPLATE.sql` + `scripts/lint-migrations.mjs` | Canonical RLS/RPC blocks; security linter (search_path/revoke/grant) | Opus | P1 |
| `scripts/release-status.mjs` → `docs/release/STATUS.md` | One generated release-state page | Opus | P1 |
| `scripts/bump-release-version.mjs` | Single-writer version bump | Sonnet | P1 |
| `scripts/verify-production-release.mjs` + `scripts/seo-smoke-prod.mjs` | Post-deploy verification pack | Sonnet | P1 |
| `scripts/check-doc-canon.mjs` | CI: duplicate basenames + dead migration refs in docs | Sonnet | P1 |
| `docs/gtm/assets/` (one-pager, perk-terms, answer-bank, QR-card brief, villa-guide template, report template) | The six calendar-required assets that don't exist | Fable (drafts) | P1 |
| `docs/social/consent-ledger.csv` | The mandated-but-missing media consent ledger | Sonnet (structure) | P1 |
| `docs/i18n/PHASE_B_PLAN.md` | Content-shape decision before any long-form translation starts | Fable | P1 |
| `docs/DEV_ENVIRONMENT.md` | Backslash-path bug, macOS-tied release tooling, env prerequisites | Sonnet | P2 |
| `docs/FOUNDER_ACTION_QUEUE.md` | One living list of everything requiring your hands (migrations, consoles, GSC) | Sonnet | P2 |

---

## 9. Final Action Plan (7 days)

**Day 1 — Stop the silent failures.** Build: glob test discovery + orphan check; run the full recovered suite and triage failures. Also fix the hardcoded `0044` in `collect-venue-photos.mjs`. Improves: whole repo. Model: Sonnet (discovery), Opus (failure triage). **Done =** `npm test` runs all 52 files; CI green with real coverage; photo collector allocates numbers safely.

**Day 2 — Migration safety.** Build: `new-migration.mjs`, `check-migration-numbers.mjs` + CI step; seed `supabase/APPLIED.md` from the 07-15 snapshot; build `migration-status.mjs` and run one live probe. Improves: `supabase/`, every release. Model: Sonnet + Opus. **Done =** CI rejects a test collision; the probe's output matches the ledger; README's 0015–0019 gate has a recorded resolution.

**Day 3 — Session infrastructure.** Build: `/session-start`, `/handoff`, `docs/CURRENT_PHASE.md`; archive loop-era docs; update/retire `SESSION-HANDOFF.md`; sweep the seven dead `0026` references; merge the SEO strategy pair; fix `gsc-setup.md`. Model: Fable (curation decisions), Sonnet (commands + sweep). **Done =** a fresh session boots via `/session-start` in under 2 minutes with zero contradictory instructions on the read path.

**Day 4 — Editorial pipeline.** Build: `data/editorial/` store + `build-editorial-migration.mjs`; back-convert one existing district as the fixture; create `/district-research-prompt` skill + template. Improves: data ops, every future district. Model: Opus. **Done =** one command turns a research-output file into a valid, collision-free, idempotent migration matching the 0021 style.

**Day 5 — Outreach integrity.** Build: `lib/outreach-templates.ts` (refactor both admin pages onto it), `build-outreach-batch.mjs` with the QA gate, `venue_outreach_log` migration (via the new allocator) + "mark sent". Audit `/for-venues` pricing copy vs money-model v0.3 — flag, don't silently change. Model: Opus. **Done =** regenerating the KORA batch produces zero `{TOKEN}`s, one sender, real links; every send is loggable.

**Day 6 — Release + verification pack.** Build: `release-status.mjs` → `docs/release/STATUS.md`; `bump-release-version.mjs`; `verify-production-release.mjs` + `seo-smoke-prod.mjs`; move the six SUPERSEDED docs to archive. Improves: mobile/store + SEO. Model: Opus (status/bump), Sonnet (smoke). **Done =** one command answers "can I submit today and what's still pending?"; one command verifies a deploy in <60 s.

**Day 7 — GTM measurement before the calendar starts.** Build: the three missing funnel events, `gtm-funnel-report.mjs`, `partner-weekly-reports.mjs`, UTM link minter; draft the six missing GTM asset files; create the consent ledger. Model: Opus (events/reports), Fable (asset drafts). **Done =** a Monday dashboard renders from real events; a partner mini-report generates for one live venue; week 1 of the 90-day calendar is measurable.

---

*Report generated by a read-only audit. No project files were modified; the only artifact created is this file.*
