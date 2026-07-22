# Workflow and role contracts

## Required outputs by phase

| Phase | Required output |
|---|---|
| 0 | ExecPlan, branch, repository health note |
| 1 | route/content/registry/sitemap/canonical/link inventory |
| 2 | dated SERP and intent map with sources |
| 3 | source registry, entity master, fact matrix, claim ledger, volatility, Maps, owner and field packs |
| 4 | one unified cluster decision |
| 5 | P0 briefs for eligible topics only |
| 6 | code and registry changes for ready P0 topics only |
| 7 | validation and technical QA report |
| 8 | independent claim/SEO review |
| 9 | commit, push, preview state and final report |

## Independent roles

When agent concurrency is available, use these independent zones: Repository Auditor; SERP and Intent Researcher; Evidence and Entity Researcher; Cannibalization and Architecture Reviewer; Content and Implementation Agent; Independent SEO and Claim QA Reviewer. Each returns structured `EXTRACTED`, `INTERPRETED`, `UNVERIFIED`, file/source citations, blockers and confidence. The coordinator resolves conflicts and owns the canonical decision.

## Conservative decision sequence

1. Reuse or update an existing owner URL.
2. Merge a narrower or duplicate topic into an existing owner.
3. Create a new URL only after differentiation and evidence gates pass.
4. Use `HOLD` for a useful topic blocked by evidence, owner, field or Maps work.
5. Use `REJECT` when the topic violates product rules, is a thin clone or has no durable user job.

## Evidence labels

- `EXTRACTED`: directly supported by a captured source.
- `INTERPRETED`: an editorial synthesis with cited inputs and bounded wording.
- `UNVERIFIED`: plausible but not approved for public factual copy.

Record source date, retrieval date, volatility, allowed wording and prohibited wording. Search results and community sources may establish intent but not operational facts.
