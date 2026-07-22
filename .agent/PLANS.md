# ExecPlans

Use this file for long-running, self-contained implementation plans. Keep decisions, evidence gaps, validation results and recovery notes current while work proceeds.

## Uluwatu autonomous district SEO pipeline

**Branch:** `seo/uluwatu-autonomous-cluster`

**Started:** 2026-07-23
**Production actions:** forbidden

### Goal

Turn the Sanur process into a reusable repository skill, then complete an evidence-gated Uluwatu audit and implement only P0 work marked `READY_FOR_CODEX_DRAFT`.

### Progress

- [x] Verify repository, authority docs and current Uluwatu URLs.
- [x] Recover from the de-hydrated checkout by cloning `origin/main` into a safe working copy.
- [x] Run repository, SERP, evidence and architecture reviews.
- [x] Create the reusable district skill structure.
- [x] Finish reusable references, templates and validator.
- [x] Create Uluwatu evidence pack, unified decision, briefs and queues.
- [x] Apply registry/maintenance changes; independent review placed all public P0 drafts on HOLD.
- [x] Run schema validation, lint, typecheck, tests and build; record runtime HTML/mobile environment blocker.
- [x] Run independent review; resolve high-severity claim-gate findings by reverting the public page draft.
- [ ] Commit, push and capture preview state.

### Decisions and discoveries

- The original checkout contained iCloud placeholders in `.git`, sitemap and reference files. Editing it risked data loss; work continues from a clean clone of `origin/main`.
- The Sanur workflow is not present on `origin/main`. Available local Sanur evidence-closure, claim-ledger, Maps-audit and P1-launch artifacts are process references only. Missing artifacts are recorded as a provenance gap.
- Uluwatu is an existing cluster. Prefer updates and merges; do not create a second district hub or micro-area clones.
- Public `/uluwatu` maps to internal `uluwatu-bukit`.
- Only evidence-safe P0 copy may change. Operational prices, hours, safety, accessibility, Place IDs and current access remain `HOLD`.

### Recovery

All work is additive on this branch. If a validation step fails, revert only the specific current-task edit; never reset or overwrite the original de-hydrated checkout.
