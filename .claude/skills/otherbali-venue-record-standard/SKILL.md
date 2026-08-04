---
name: otherbali-venue-record-standard
description: >
  The single content standard for Other Bali venue records — the Supabase
  `venues` fields (why_its_here, best_for, not_for, price_anchor,
  what_to_order, opening_hours_json, last_verified_at) that every public
  district page, guide card and place page is assembled from. Use this
  whenever writing, rewriting, reviewing or backfilling venue copy, even when
  the request sounds page-shaped ("rewrite /canggu/best-brunch", "make this
  page better for Google/AI search", "the descriptions are weak", "add Not
  for", "fill in the missing fields", "переписать страницу", "перепиши
  описания заведений", "заполнить поля", "почему пусто", "дай SQL для
  заведений"). On a data-driven page the fix is almost always in the record,
  not in the page — start here before touching any .tsx.
---

# Other Bali venue record standard — Claude Code entrypoint

This file is intentionally thin, for the same reason `CLAUDE.md` and `AGENT.md`
are: the standard must exist once, so it cannot drift between agents.

**Read `.agents/skills/otherbali-venue-record-standard/SKILL.md` now** — it is
the canonical standard, shared by every agent that works in this repository.
It carries the provenance ladder, the field-by-field standard with real
before/after examples, the pre-write checklist and the guarded SQL pattern.

Two further files, read when the step calls for them:

- `.agents/skills/otherbali-venue-record-standard/references/field-standard.md`
  — per-field format, evidence requirement and before/after.
- `.agents/skills/otherbali-venue-record-standard/assets/venue-record-update-TEMPLATE.sql`
  — the guarded update pattern with its verification blocks.

The one idea, in case you read nothing else: **the unit of content work is the
venue record, not the page.** Public pages are assembled at render time from
`venues` rows, so a field written once improves every surface that reads it —
and a page can look thin while the facts already exist, unwritten only in the
sense that nothing renders them.
