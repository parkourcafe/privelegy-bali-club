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

# Other Bali GEO — Claude Code entrypoint

This file is intentionally thin, for the same reason `CLAUDE.md` is: the
standard must exist once, so it cannot drift between agents.

**Read `.agents/skills/geo-seo/SKILL.md` now** — it is the canonical version,
shared by every agent that works in this repository. Then read
`.agents/skills/geo-seo/references/otherbali-overlay.md` before acting on
anything the rubrics produce.

The one idea, in case you read nothing else: **an AI answer engine cannot cite
a page it cannot fetch, cannot parse, or cannot extract a self-contained
sentence from — and Other Bali's answer to all three is data, not prose.** A
GEO score is a diagnosis; on a site assembled at render time from `venues`
rows, the fix is almost always an empty or unverified record field.

The specific trap: this skill was vendored from a consultancy toolkit that
recommends adding ratings, statistics and author credentials. Here those are
guardrail #2, #10 and fabricated provenance respectively. A low score is a
reason to collect evidence, never to write a plausible number.
