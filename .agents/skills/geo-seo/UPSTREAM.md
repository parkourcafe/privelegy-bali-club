# Provenance

Vendored from **[`zubair-trabzada/geo-seo-claude`](https://github.com/zubair-trabzada/geo-seo-claude)**,
MIT licensed, at commit `e5d4a4a4f7bb10142f558b1df1308471948fb37c` (2026-08-15),
vendored 2026-08-17.

This is a fork in substance, not a mirror. Upstream is a toolkit for a GEO
consultancy auditing arbitrary client sites; Other Bali is a product with
guardrails that make several upstream recommendations violations. Do not
`git pull` upstream over this directory — re-read the diff and re-apply the
reconciliation deliberately.

## Structure change

Upstream ships 14 sibling skills plus a `geo` orchestrator. Vendored here as
**one** skill with a `references/` directory, matching this repository's
`otherbali-district-seo-pipeline` layout.

The reason is trigger collision, not tidiness. Skills are selected by
description matching, and upstream's `geo-schema`, `geo-content` and
`geo-technical` would compete with `otherbali-schema-markup`,
`otherbali-venue-record-standard` and `otherbali-guide-page-standard` on
exactly the prompts where the `otherbali-*` skill is the correct one and the
`geo-*` skill is the one that recommends forbidden markup. One skill with an
explicit hand-off table in `SKILL.md` removes that failure mode.

## Mapping

| Upstream | Here |
|---|---|
| `geo/SKILL.md` | `SKILL.md` |
| `skills/geo-citability/` | `references/citability.md` |
| `skills/geo-crawlers/` | `references/crawlers.md` |
| `skills/geo-llmstxt/` | `references/llmstxt.md` |
| `skills/geo-schema/` | `references/schema.md` |
| `skills/geo-technical/` | `references/technical.md` |
| `skills/geo-content/` | `references/content-eeat.md` |
| `skills/geo-platform-optimizer/` | `references/platforms.md` |
| `skills/geo-brand-mentions/` | `references/brand-mentions.md` |
| `skills/geo-audit/` + `skills/geo-report/` | `references/audit.md` |
| `agents/*.md` (5 subagent defs) | folded into `references/audit.md` sequencing |
| `scripts/{fetch_page,citability_scorer,brand_scanner,llmstxt_generator}.py` | `scripts/`, unmodified |
| `schema/*.json` | `assets/schema-templates/`, two dropped, one edited |
| — | **`references/otherbali-overlay.md`** (new; the reconciliation) |

## Not vendored

| Upstream | Why |
|---|---|
| `skills/geo-prospect/` | Agency CRM. No client exists. Triggers on "prospect"/"lead"/"pipeline", colliding with `venue-reverse-magnet`, which owns owner outreach here. |
| `skills/geo-proposal/` | Generates priced service packages. Guardrails #6 and #8 leave nothing to price. |
| `skills/geo-compare/` | Monthly client retention report. Same reason. |
| `skills/geo-report-pdf/` | Hard-codes `/Applications/Google Chrome.app/` and needs `pandoc`. Neither exists here. |
| `skills/geo-platform-optimizer` PDF/report chrome | Superseded by `references/audit.md` output rules. |
| `skills/geo-update/` | Pulls from upstream `main`. Would silently undo every reconciliation in this directory. |
| `scripts/crm_dashboard.py`, `scripts/webapp/` | Flask CRM UI for the prospect pipeline. |
| `templates/geo-report-*.{css,html}` | PDF pipeline chrome. |
| `install.sh`, `install-win.sh`, `uninstall.sh` | Install globally to `~/.claude/skills/geo/`. This is a repo-vendored skill. |
| `schema/product-ecommerce.json`, `schema/software-saas.json` | Inapplicable, and both carry `aggregateRating`. |

## Content changes

- **`assets/schema-templates/local-business.json`** — `aggregateRating` block
  removed; US placeholders replaced with Bali/Indonesia ones; gate annotations
  added pointing at `otherbali-schema-markup`. This is the single most
  important edit: upstream's version ships a populated `"ratingValue": "4.8"`.
- **`references/schema.md`** — upstream's "recommended for GEO:
  `aggregateRating`, `review`" removed from the LocalBusiness section and
  replaced with the refusal and its reason.
- **`references/content-eeat.md`** — rows requiring personal bylines, author
  pages, speaker credentials and press quotes marked `N/A` with the reason,
  rather than left as scoreable gaps that would invite fabricated provenance.
- **`references/llmstxt.md`** — generation-to-static-file reframed as audit of
  the existing `app/llms.txt/route.ts`.
- **`references/crawlers.md`** — robots.txt editing reframed as `app/robots.ts`
  plus its test; measured current state added; upstream's blanket "block
  Bytespider for Western sites" flagged as not transferring to our audience.
- **`references/brand-mentions.md`** — Wikipedia creation removed as a work
  item (notability not met); Reddit reframed from task to founder decision.
- **All references** — upstream market statistics kept where they explain a
  threshold, and marked throughout as unverified third-party claims that may
  not be republished as ours.
- **Italian trigger vocabulary** dropped (guardrail #15).

## Upstream licence

```
MIT License

Copyright (c) 2026 Zubair Trabzada

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
