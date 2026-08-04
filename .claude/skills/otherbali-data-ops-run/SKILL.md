---
name: otherbali-data-ops-run
description: >
  The end-to-end playbook for filling a missing venue field across hundreds of
  Other Bali records — opening hours, coordinates, phones, prices, menus,
  descriptions. Covers measuring the gap before collecting anything,
  prioritising by traffic, briefing a collection agent, the CSV hand-back
  format, row-by-row acceptance, and generating the guarded UPDATE. Use this
  whenever a task sounds like "collect X for all venues", "fill in the missing
  Y", "run the hours/coordinates/phones collection", "why are these fields
  empty", "собери часы", "собрать координаты", "заполнить поля по всем
  заведениям", "прогон сбора", or whenever a collection agent hands back a
  CSV to be imported. A collector's own "ready" status is not evidence — this
  skill exists because trusting it published a hotel's check-in time as a
  café's opening hour.
---

# Other Bali Data-Ops Run — Claude Code entrypoint

This file is intentionally thin, for the same reason `CLAUDE.md` is: the
standard must exist once, so it cannot drift between agents.

**Read `.agents/skills/otherbali-data-ops-run/SKILL.md` now** — it is the
canonical version, shared by every agent that works in this repository.

Further files, read when the step calls for them:

- `.agents/skills/otherbali-data-ops-run/references/acceptance-rules.md`
  — the plausibility bound for each field type — hours, coordinates, phones, prices, addresses — with the real rejections that produced each rule.
- `.agents/skills/otherbali-data-ops-run/assets/apply-TEMPLATE.sql`
  — the guarded UPDATE pattern: dry run, row filter, expected count, and the rejected-rows block.

The one idea, in case you read nothing else: **A collection run is an acceptance problem, not a collection problem.** Getting a value is easy — an agent, an API or a person will always return something. Deciding whether it is true is the whole job, and it is the step every run skips under time pressure.
