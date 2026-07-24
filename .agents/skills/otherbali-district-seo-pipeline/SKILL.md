---
name: otherbali-district-seo-pipeline
description: Run the complete evidence-gated Other Bali district SEO workflow from repository inventory and live intent research through evidence closure, canonical cluster decisions, briefs, implementation, QA, independent review, Git and preview. Use for any district, area, neighbourhood or destination-cluster SEO task in the Other Bali repository, including requests to create, update, reconcile, audit or publish district pages.
---

# Other Bali district SEO pipeline

Run one district at a time. Treat the repository, current public site and approved evidence as separate inputs. Never infer a public fact from an AI output.

## Required reads

Read `AGENTS.md`, `Other_Bali_Master_Architecture.md`, `.agent/PLANS.md`, `docs/seo/os/*`, relevant district files and routes. Read:

- `references/governance.md` for status vocabulary and publication gates;
- `references/artifact-schemas.md` before creating district artifacts;
- `references/templates.md` before writing decisions, briefs or reports.

Run `scripts/validate_district_seo.py <district-folder>` before implementation and after every artifact change.

## Operating rules

- Keep one URL = one primary intent.
- Prefer UPDATE or MERGE over CREATE when the user decision is not distinct.
- Make blocked topics `HOLD`; continue unrelated safe topics.
- Use only claim-ledger rows marked `READY_FOR_CODEX_DRAFT` in public copy.
- Keep `EXTRACTED`, `INTERPRETED` and `UNVERIFIED` explicit.
- Leave unknown Place IDs and Maps URLs null; never fabricate action links.
- Do not let owner, field or Maps blockers stop pages that do not depend on them.
- Do not modify unrelated districts, shared architecture or production without authority.

## Phase 0 — Workspace and repository verification

1. Confirm repository root, branch, status and baseline commit.
2. Create `seo/<district>-autonomous-cluster` unless an approved branch exists.
3. Create or update the ExecPlan in `.agent/PLANS.md`.
4. Record dirty-worktree and File Provider constraints; never erase unrelated work.

Exit: clean ownership boundary and writable branch.

## Phase 1 — Existing URL and content inventory

Inventory routes, rendered pages, page registry, intent registry, sitemap source, canonicals, robots, internal links, comparison pages, hotel pages and programmatic district routes. Record exact file paths and live status.

Exit: `DISTRICT_REPOSITORY_INVENTORY.md` with no proposed URL treated as approved.

## Phase 2 — SERP and intent research

Research live SERPs and current query families. Describe each intent as a user decision, not a keyword. Capture competing page type, search-result pattern, likely owner URL and overlap. Current GSC is required before merge, split or new URL publication; absent GSC becomes a gate, not invented evidence.

Exit: `DISTRICT_INTENT_MAP.md` and `DISTRICT_SERP_GAP_REPORT.md`.

## Phase 3 — Evidence and entity closure

Create source registry, entity master, fact matrix, volatility register, Maps audit, owner confirmation queue and field verification queue. Prefer official providers, government sources and recorded editorial evidence. Do not use search snippets as factual evidence.

Exit: every proposed public claim is sourced, qualified or blocked.

## Phase 4 — Unified cluster decision

Assign exactly one status per topic: `P0_UPDATE`, `P0_CREATE`, `P1_UPDATE`, `P1_CREATE`, `MERGE_INTO_EXISTING`, `HOLD`, or `REJECT`. Specify canonical URL, primary intent, user decision, overlap, evidence readiness, dependencies, schema, internal links and publication gate. Resolve conflicts conservatively.

Exit: `DISTRICT_UNIFIED_CLUSTER_DECISION_V1.md` is the sole decision source.

## Phase 5 — P0 content briefs and claim ledger

Create briefs only for P0 pages with a distinct approved intent. Add claim-ledger rows with allowed and prohibited wording, source references, volatility and refresh requirements. A claim becomes draftable only when `publication_status=READY_FOR_CODEX_DRAFT` and all required dependencies are closed.

Exit: P0 brief and claim ledger validate with no duplicate or dangling IDs.

## Phase 6 — Draft and implementation

Implement only draft-ready P0 pages. Use public English copy, Server Components, unique metadata, exact canonical, visible breadcrumbs, supported schema, reciprocal internal links and verified dates. Update registry, intent owner and sitemap source only for approved URLs. Do not implement HOLD/REJECT pages.

Exit: source-level boundary tests pass.

## Phase 7 — Technical SEO QA

Run CSV validator, focused tests, SEO OS validation, lint, typecheck and production build. Inspect SSR HTML for 200, one canonical, no noindex, useful main content, valid JSON-LD, sitemap membership and internal links. Test 390×844 mobile layout and horizontal overflow.

Exit: all required checks pass or implementation remains unpublishable.

## Phase 8 — Independent review

Use an independent reviewer with raw artifacts. Require claim-by-claim and cannibalization review. Downgrade optimistic readiness; never upgrade without evidence.

Exit: review findings resolved or documented as blockers.

## Phase 9 — Git, preview and final report

Stage only district/pipeline files, inspect cached diff, commit, push and create a safe preview. Never merge or production-deploy without explicit authority. Report branch, commit, preview, files, checks, blockers and next queued district.

Exit: preview-ready handoff.
