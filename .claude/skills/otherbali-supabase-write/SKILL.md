---
name: otherbali-supabase-write
description: >
  The pre-flight check before writing to Other Bali's Supabase tables — the
  check constraints, publication gates and RLS rules that reject a bulk UPDATE
  or INSERT after you have already handed it over. Use this before running or
  handing off any SQL that writes to `venues`, `perks`, menus or action
  capabilities: "apply this batch", "publish these venues", "de-publish the
  thin cards", "import the perks", "прогнать SQL", "залить в базу",
  "опубликовать заведения", "снять с публикации". Reading the migrations is
  necessary but not sufficient — production carries at least one constraint
  that exists in no migration in this repository, so this skill's dry-run step
  is the only reliable check.
---

# Other Bali Supabase Write — Claude Code entrypoint

This file is intentionally thin, for the same reason `CLAUDE.md` is: the
standard must exist once, so it cannot drift between agents.

**Read `.agents/skills/otherbali-supabase-write/SKILL.md` now** — it is the
canonical version, shared by every agent that works in this repository.

Further files, read when the step calls for them:

- `.agents/skills/otherbali-supabase-write/references/known-constraints.md`
  — every constraint that has actually rejected a write, with its migration and what to do instead.

The one idea, in case you read nothing else: **The table does not tell you what it will accept.** Column types are visible in the Supabase editor; the rules that actually reject writes are not. One of them exists only in production, in no migration in this repository — so dry-run one row and roll it back.
