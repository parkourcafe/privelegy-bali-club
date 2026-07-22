---
name: otherbali-district-seo-pipeline
description: Run the complete evidence-gated Other Bali district SEO workflow from repository inventory and live intent research through entity closure, unified URL decisions, P0 briefs, implementation, technical QA, independent review, Git and preview reporting. Use for any district-level SEO audit, cluster build, district guide update, district URL proposal or autonomous district SEO pipeline in the Other Bali repository.
---

# Other Bali district SEO pipeline

Work on exactly one district at a time when shared registries, sitemap or intent ownership may change. Maintain `.agent/PLANS.md`. Never merge or deploy to production unless the user separately authorizes it.

Read before acting:

1. repository `AGENTS.md`, architecture and relevant Next.js 16 local docs;
2. `references/workflow.md` for phase outputs and role contracts;
3. `references/schemas.md` before creating CSV/registry files;
4. `references/publication-gates.md` before assigning readiness;
5. `references/templates.md` before creating district documents or final report.

Use `scripts/validate-district-seo.mjs <district-folder>` before implementation and again before handoff.

## Non-negotiable rules

- Give each URL one primary intent.
- Treat AI output as research assistance, never evidence.
- Do not create thin district or micro-area clones.
- Do not create a URL before repository, sitemap, registry, canonical, link and cannibalization checks.
- Do not publish a factual claim unless its claim-ledger row is approved and every cited source exists.
- Use only `P0_UPDATE`, `P0_CREATE`, `P1_UPDATE`, `P1_CREATE`, `MERGE_INTO_EXISTING`, `HOLD`, or `REJECT` for topic decisions.
- Put a blocked topic on `HOLD`, record the blocker and continue other topics.
- Prefer `UPDATE` or `MERGE_INTO_EXISTING` over a new URL; prefer `HOLD` over unsupported publication.
- Leave unknown Place IDs `null` with `NEEDS_MANUAL_MAPS_CONFIRMATION`.
- Do not modify unrelated districts.
- Do not deploy production until all required gates pass.

## Phases

### Phase 0 — workspace and repository verification

Confirm root, remote, branch, clean/dirty state, authority docs, package scripts and working-tree integrity. Create the required branch and ExecPlan. If files are placeholders or Git is unhealthy, do not overwrite them; recover into a healthy clone/worktree and document the recovery.

### Phase 1 — existing URL and content inventory

Inventory routes, pages, registries, sitemap, canonicals, metadata, schema, breadcrumbs and internal links. Record SSR/static behavior. Include global pages that can compete with district intent.

### Phase 2 — SERP and intent research

Run dated live searches when network is available. Record result types, competitors, query clusters, user job and observed gaps. Separate `EXTRACTED`, `INTERPRETED`, and `UNVERIFIED`. Do not use AI summaries as evidence or invent rank/volume.

### Phase 3 — evidence and entity closure

Create source registry, entity master, fact matrix, claim ledger, volatility register, Maps audit, owner queue and field queue. Prefer government and first-party sources. Treat prices, hours, schedules, safety, access, transport time and policies as volatile.

### Phase 4 — unified cluster decision

Resolve repository, SERP, evidence and cannibalization findings into one canonical topic table. Assign exactly one allowed decision per topic, one primary intent per URL, assumptions, confidence and blockers.

### Phase 5 — P0 briefs and claim ledger

Create briefs only when intent is approved, evidence is sufficient, and no owner, field or Maps identity dependency remains for the planned copy/action layer. Mark eligible briefs `READY_FOR_CODEX_DRAFT`. Keep blocked claims out even when the page itself can proceed.

### Phase 6 — draft and implementation

Implement only `P0_*` pages with `READY_FOR_CODEX_DRAFT`. Preserve existing URLs where possible. Add public English copy, metadata, unique canonical, relevant schema, breadcrumbs, internal links, registry/intent ownership, sitemap inclusion, SSR HTML and usable mobile layout.

### Phase 7 — technical SEO QA

Validate CSVs and references, then canonical and intent uniqueness, lint, typecheck, tests and production build. Inspect rendered HTML, robots/noindex, schema, sitemap, links and mobile rendering. Fix only current-task regressions.

### Phase 8 — independent review

Require a reviewer independent from implementation to inspect SEO ownership, factual claims, status gates and diff. Resolve conflicts conservatively; a reviewer cannot promote readiness without evidence.

### Phase 9 — Git, preview and final report

Review the diff, add only related files, commit, push the branch and capture the safe preview state. Do not merge or production deploy. Use the final-report template and report HOLD queues explicitly.
