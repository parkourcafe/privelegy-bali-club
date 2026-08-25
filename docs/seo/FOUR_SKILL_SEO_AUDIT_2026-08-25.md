# Other Bali Four-Skill SEO Audit - 2026-08-25

Domain: `otherbali.com` / `www.otherbali.com`
Market: Bali, Indonesia
Worktree used for implementation: `/Users/msnigmatullaeva/Code/other-bali-current`
Status date: 2026-08-25, Asia/Makassar

## Executive Verdict

| Area | Verdict | Notes |
|---|---|---|
| Local codebase readiness | `READY_FOR_DEPLOY_REVIEW` | Dependencies reinstalled outside iCloud; lint/typecheck/tests/build/browser QA passed. |
| Public production site | `DEPLOY_PENDING` | Production SEO OS audit now passes, but local metadata fixes are not live until deployment. |
| Sitemap governance | `PASS` | Live sitemap and SEO OS page registry now match: 1427 included URLs, 8 tombstones. |
| Local SEO / GBP operations | `BLOCKED_ON_ELIGIBILITY_AND_ACCESS` | No GBP URL, verification state, staffed address, or service-area facts provided. No live GBP changes made. |
| AI visibility | `TECHNICAL_READY_BASELINE_REQUIRED` | `robots.txt`, indexability, canonical, HTML and `llms.txt` are in good shape; prompt/citation baseline still requires platform runs and/or logs. |

## Skills Applied

1. `$seo-growth-architect` - broad SEO architecture, technical gates, keyword/page mapping, 20/80 priorities.
2. `$local-seo-ai-search-implementation` - on-site Local SEO implementation, canonical, Schema.org, sitemap, robots, analytics readiness.
3. `$local-seo-operations` - GBP/Maps eligibility, profile risks, review policy, 7/30/60/90 operations plan.
4. `$ai-visibility-v2` - AI search accessibility, prompt baseline model, citations/source-gap roadmap.

## Confirmed Work

- Moved active work to `/Users/msnigmatullaeva/Code/other-bali-current` to avoid iCloud `dataless` hangs.
- Reinstalled dependencies with `npm install`.
- Centralized canonical brand/site facts in `lib/site-origin-policy.ts`.
- Updated `sitemap.ts`, `robots.ts`, `layout.tsx`, and `/my-day` to consume canonical origin consistently.
- Fixed metadata title duplication risks on key public/admin pages.
- Improved `OtherBaliLogo` accessible brand name while keeping the visual wordmark unchanged.
- Added regression tests for canonical site facts, metadata title handling, and logo accessibility.
- Refreshed SEO OS page registry from live sitemap with `--approve-drift`.

## Evidence Summary

| Check | Result |
|---|---|
| `npm run lint` | Pass, 0 errors, 1 existing warning on `PhotoReviewPanel.tsx` using `<img>`. |
| `npm run typecheck` | Pass. |
| `npm run test:t0:unit` | Pass, 48 tests. |
| `npm test` | Pass, 252 tests plus `seo-os validate`. |
| `npm run seo:os:validate` | Pass, 1435 registry entries. |
| `npm run seo:os:check` | Pass, 1427 live URLs, 1427 snapshot URLs, 8 tombstones. |
| `npm run seo:os:audit` | Pass, 39/39 production checks, 0 parity failures. |
| `npx impeccable detect` | Pass, exit code 0, no findings printed. |
| `VERCEL_ENV=production npm run build` | Pass. |
| Local browser/SEO QA | Pass for `/`, `/my-day`, `/seminyak/best-restaurants`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`. |
| `npm audit --omit=dev --audit-level=moderate` | Fails with 3 production vulnerabilities requiring `npm audit fix --force` and Next 16.3.2. |

## Priority Findings

| Priority | Finding | Evidence | Action |
|---:|---|---|---|
| P0 | iCloud `dataless` files made git/lint/build/test unreliable in the old path. | Local command hangs in old CloudDocs path; new Code path gates pass. | Use `/Users/msnigmatullaeva/Code/other-bali-current` as the active repo. |
| P0 | Sitemap registry drift existed before refresh. | Before: live 1427 vs snapshot 673; after: live 1427 vs snapshot 1427. | Keep `seo:os:check` in release gate. |
| P1 | Local metadata fixes are not deployed yet. | Local QA title for `/my-day` is correct; prior production sample had duplicate brand suffix. | Deploy only after explicit approval. |
| P1 | Canonical origin and brand facts were scattered. | Hard-coded origins replaced by `CANONICAL_SITE_ORIGIN` in key SEO surfaces. | Keep all new SEO code on `site-origin-policy.ts`. |
| P2 | GBP eligibility is unknown. | No verified profile, public address, service area, category, or ownership state available. | Collect GBP evidence before profile creation or optimization. |
| P2 | AI search baseline is incomplete. | Technical access is checked; no controlled prompt runs or citation logs available. | Run prompt panel across ChatGPT Search, Gemini, Perplexity, Claude/Copilot if available. |
| P2 | Production dependency audit still has vulnerabilities. | Non-force audit fix updated transitive `nanoid`; remaining Next/PostCSS/sharp fixes require forced Next upgrade. | Run a separate Next 16.3.2 upgrade task with full regression gates. |

## Source Quality

- Official Google local ranking and GBP policy: https://support.google.com/business/answer/7091?hl=en and https://support.google.com/business/answer/3038177?hl=en
- Official Google review policy: https://support.google.com/contributionpolicy/answer/7400114?hl=en and https://support.google.com/business/answer/3474122?hl=en
- Official Google AI Search guidance: https://developers.google.com/search/docs/appearance/ai-features and https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Official OpenAI crawler guidance: https://developers.openai.com/api/docs/bots

## Next Decision

Deploy is the next material step, but it is a live publication action and requires explicit approval. Before deployment, review the diff and confirm whether to publish this branch.
