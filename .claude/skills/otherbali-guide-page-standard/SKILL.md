---
name: otherbali-guide-page-standard
description: >
  The specification for what a finished Other Bali guide or district page must
  look like to be quoted by AI answers and ranked by Google — block by block,
  with sentence-level rules, the price format, the required fields, and a
  pass/fail gate you can run. Use this whenever building, rewriting, reviewing
  or signing off a public listing page ("best X in Y"), and whenever someone
  asks how a page should be written, why a page is not ranking, whether a page
  is ready to publish, or what "good" looks like ("как должна выглядеть
  страница", "почему не ранжируется", "готова ли страница", "проверь страницу",
  "сделай как надо"). This is the target; the record standard fills the fields
  and the SEO pipeline decides which URLs exist.
---

# Other Bali guide page standard — Claude Code entrypoint

Thin by design, for the reason `CLAUDE.md` and `AGENT.md` are: the standard
exists once so it cannot drift between agents.

**Read `.agents/skills/otherbali-guide-page-standard/SKILL.md` now** — the
canonical spec, shared by every agent working in this repository. It defines the
required blocks in order, the sentence rules, the price band ladder, and the
gate a page must pass before it ships.

Also available:

- `.agents/skills/otherbali-guide-page-standard/references/worked-example.md`
  — `/canggu/best-brunch` before and after, with the measured state behind each rule.
- `.agents/skills/otherbali-guide-page-standard/scripts/check-page.mjs`
  — the runnable gate. `node <path> <url>` exits non-zero on a fail.

The one idea, if you read nothing else: **every sentence must survive being
lifted out of the page alone.** A model answering a question quotes one sentence
without its surrounding paragraph. A sentence that needs context cannot be
quoted, so the page loses even when it ranks.
