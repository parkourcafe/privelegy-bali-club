---
name: geo-seo
description: >
  Generative Engine Optimization for otherbali.com — making the site
  discoverable, extractable and citable by AI answer engines (ChatGPT,
  Perplexity, Claude, Gemini, Google AI Overviews) rather than only by Google's
  blue links. Use for AI-search visibility work: "will ChatGPT cite this page",
  "why don't we show up in AI answers", "check AI crawler access", "audit our
  llms.txt", "score this page for citability", "GEO audit", "AEO", "answer
  engine optimization", "почему нас не цитирует ChatGPT", "проверь доступ
  AI-краулеров", "GEO-аудит". Vendored from an external GEO toolkit and
  reconciled against AGENTS.md — several upstream recommendations are guardrail
  violations here, so read references/otherbali-overlay.md before acting on any
  scoring output. For venue or guide JSON-LD use otherbali-schema-markup; for
  venue copy use otherbali-venue-record-standard; for which URLs should exist
  use otherbali-district-seo-pipeline.
---

# GEO for Other Bali

This file is the canonical standard and is agent-neutral: Claude Code, Codex
and any other agent working in this repository read this same file. Claude Code
reaches it through the thin entrypoint at `.claude/skills/geo-seo/SKILL.md`;
OpenAI-style agents through `agents/openai.yaml` beside this file.

Vendored from `zubair-trabzada/geo-seo-claude` (MIT). Provenance, what was
changed and what was deliberately dropped: `UPSTREAM.md`.

## The one idea

**An AI answer engine cannot cite a page it cannot fetch, cannot parse, or
cannot extract a self-contained sentence from — and Other Bali's answer to all
three is data, not prose.**

A GEO score is a diagnosis. On a site whose public pages are assembled at
render time from `venues` rows, almost every diagnosis resolves to a field that
is empty, unverified, or written as narrative where it needed to be a stated
fact. The rubrics here are for locating that field. They are not a licence to
write the fact.

That distinction is the whole reason this skill needed reconciling rather than
installing. Upstream's advice — add statistics, add ratings, add author
credentials — is sound for a consultancy and forbidden here by `AGENTS.md` §4
and §13. **Read `references/otherbali-overlay.md` before acting on any output
from the rubrics below.** It is not optional context; it is the list of
recommendations this repository refuses.

## Before you start

| If the task is… | The owning skill is… |
|---|---|
| Venue or guide JSON-LD, any field → markup wiring | `otherbali-schema-markup` |
| Venue copy — `why_its_here`, `best_for`, `not_for`, `price_anchor` | `otherbali-venue-record-standard` |
| Whether a listing page is publishable, block order, pass/fail | `otherbali-guide-page-standard` |
| Which district URLs should exist, cannibalization, claim ledger | `otherbali-district-seo-pipeline` |
| Filling a field across many venue records | `otherbali-data-ops-run` |
| Writing any of it to Supabase | `otherbali-supabase-write` |
| **Whether AI answer engines can reach, parse and quote what we publish** | **this skill** |

This skill owns the AI-surface question only. When a finding lands in another
skill's territory — and most do — hand it over there rather than fixing it
here.

## Routing

There is no slash-command runtime for this in the repository; upstream's
`/geo <verb> <url>` commands are a Claude Code convention, not a script. Treat
the table as a map from question to reference file.

| Question | Reference |
|---|---|
| Can AI crawlers fetch us at all? | `references/crawlers.md` |
| Is our llms.txt right? | `references/llmstxt.md` |
| Would an AI quote this passage? | `references/citability.md` |
| Does our markup describe the entity? | `references/schema.md` + `otherbali-schema-markup` |
| Can a bot see content without running JS? | `references/technical.md` |
| Does the content read as trustworthy? | `references/content-eeat.md` |
| Why ChatGPT but not Perplexity? | `references/platforms.md` |
| Do we exist off-site as an entity? | `references/brand-mentions.md` |
| All of it, scored | `references/audit.md` |

## Composite score

Upstream's weighting, kept so numbers stay comparable to an upstream run:

```txt
GEO = Citability·0.25 + Brand·0.20 + E-E-A-T·0.20
    + Technical·0.15 + Schema·0.10 + Platform·0.10
```

Two cautions before you quote a number from it.

The score is **advisory and self-assessed**. Every input is a judgement an
agent made against a rubric, not a measurement. Two agents scoring the same
page will not agree within ten points. It is useful for tracking one site
against itself over time and worthless as a precise claim.

The E-E-A-T and Brand components **systematically under-score this site** for
reasons that are not defects — no personal bylines, no Wikipedia entity, no
Reddit strategy. See overlay §4. Do not open a work item to "raise E-E-A-T to
80" without first reading which of its rows are not-applicable here.

## Order of work

Diagnose in dependency order. A citability rewrite on a page no crawler can
reach is wasted.

1. **Reachable** — `references/crawlers.md`. If AI crawlers cannot fetch the
   page, nothing downstream matters. Measured state and the standing decision:
   overlay §6.
2. **Parseable** — `references/technical.md`, SSR section. Content that needs
   JavaScript is invisible to most AI fetchers. We are Next.js 16 App Router
   with Server Components for public data (`AGENTS.md` §7), so this should pass
   — verify rather than assume, with `curl -s <url> | grep`, not a browser.
3. **Findable** — `references/llmstxt.md`, sitemap and internal linking. We
   already serve a dynamic llms.txt; overlay §5.
4. **Extractable** — `references/citability.md`. Where most real findings land,
   and where most of them turn out to be missing record fields.
5. **Attributable** — `references/schema.md`, deferring to
   `otherbali-schema-markup` for anything venue-shaped.
6. **Corroborated** — `references/brand-mentions.md`, `references/platforms.md`.
   Off-site entity presence. Slowest to move, least controllable.

## Scripts

`scripts/` carries four upstream Python utilities, re-pathed for this
repository. They are **optional analysis helpers, not part of any gate** — no
npm script runs them and no test depends on them.

They need dependencies this container does not have by default:

```bash
python3 -m venv .agents/skills/geo-seo/scripts/.venv
.agents/skills/geo-seo/scripts/.venv/bin/pip install -r \
  .agents/skills/geo-seo/scripts/requirements.txt
```

The venv path is git-ignored. Invoke with that interpreter:

```bash
V=.agents/skills/geo-seo/scripts/.venv/bin/python
$V .agents/skills/geo-seo/scripts/fetch_page.py https://www.otherbali.com/canggu page
$V .agents/skills/geo-seo/scripts/citability_scorer.py <text-file>
$V .agents/skills/geo-seo/scripts/llmstxt_generator.py validate https://www.otherbali.com/llms.txt
$V .agents/skills/geo-seo/scripts/brand_scanner.py "Other Bali" otherbali.com
```

`fetch_page.py` earns its place: `WebFetch` converts HTML to markdown and drops
`<head>`, which discards every JSON-LD block. To inspect our own emitted
structured data you need raw HTML, and this fetches it and parses the
`application/ld+json` scripts out.

`brand_scanner.py` performs outbound requests to third-party platforms. It
reads public pages only and stores nothing, but it is still outbound traffic
from a work machine — check before running it in a loop.

## What this skill must never do

- Add `aggregateRating` or `review` to any markup. Overlay §1, guardrail #2.
- Invent a statistic, price, rating or date to raise a citability score.
  Overlay §2, guardrail #10.
- Write `public/llms.txt`. Overlay §5.
- Hand-write `robots.txt`. It is generated by `app/robots.ts` and asserted by
  `app/robots.test.ts`. Overlay §6.
- Republish upstream's market statistics as an Other Bali claim. Overlay §8.
- Fabricate an author persona or credential to score E-E-A-T points. Overlay §4.
- Edit a `.tsx` page when the weakness is in a `venues` row. Overlay §3.
