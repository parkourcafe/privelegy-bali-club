---
name: otherbali-schema-markup
description: >
  What an Other Bali venue page may state in its structured data, where each
  field comes from, and what is forbidden. Use this when adding or changing
  JSON-LD on a place or guide page, wiring a new database column through to the
  markup, or answering "why don't our cards show up", "add rating stars", "add
  hours/geo/phone to the markup", "почему карточки не отдают факты", "добавить
  рейтинг в разметку", "подключить поле к разметке". Two invisible bugs shipped
  from this area in one day — a venue published as open twelve hours early, and
  operator working notes published as a postal address — so the refusal rules
  here matter more than the emission rules.
---

# Other Bali Schema Markup — Claude Code entrypoint

This file is intentionally thin, for the same reason `CLAUDE.md` is: the
standard must exist once, so it cannot drift between agents.

**Read `.agents/skills/otherbali-schema-markup/SKILL.md` now** — it is the
canonical version, shared by every agent that works in this repository.

The one idea, in case you read nothing else: **A card that answers nothing Google Maps already answers has no reason to exist — but a card that answers wrongly is worse than one that stays silent.** Both halves shipped in a single day. Neither is visible on the page.
