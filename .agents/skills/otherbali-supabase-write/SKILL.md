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

# Other Bali Supabase write

This file is the canonical checklist and is agent-neutral: Claude Code, Codex
and any other agent working in this repository read this same file. Claude Code
reaches it through the thin entrypoint at
`.claude/skills/otherbali-supabase-write/SKILL.md`; OpenAI-style agents through
`agents/openai.yaml` beside this file.

## The one idea

**The table does not tell you what it will accept.**

Column types and nullability are visible in the Supabase table editor. The
rules that actually reject writes — check constraints, conditional evidence
requirements, RLS policies — are not. On 2026-08-04 three separate bulk writes
were rejected in a row, each by a rule invisible from the interface, and each
rejection cost a round trip through a human running the query by hand.

Worse: one of those rules, `venues_published_requires_verification_check`,
**appears in no migration file in this repository.** It exists only in
production. So the checklist below has two halves — what you can learn from
the repository, and what only a dry run can tell you.

## Before writing

### 1. Read the constraints for every table you touch

```bash
rg "add constraint|check \(" supabase/migrations/*.sql | rg "<table>"
```

Known ones are catalogued in `references/known-constraints.md`. Read it — it
is short, and it is the list of things that have actually bitten.

### 2. Dry-run exactly one row, and roll it back

This is the step that catches production-only rules.

```sql
begin;
update venues
set <column> = '<one real value>'
where slug = '<one real slug>'
  and status = 'active'
  and publication_status = 'published';
-- expect: UPDATE 1
rollback;
```

If this fails, the batch would have failed. If it succeeds, the shape of the
write is accepted — constraints, triggers and policies included.

Never skip this because the batch "is the same as last time". Last time is not
evidence about a table whose rules live outside the repository.

### 3. Guard the row filter

Every bulk write carries, at minimum:

```sql
and status = 'active'
and publication_status = 'published'
```

A batch import is not the place to change a venue's publication state. Without
this filter an import silently resurrects de-published rows, and nothing in the
output says so.

### 4. State the expected row count before running

Write the number down in a comment first, then compare. `UPDATE 29` against an
expectation of 29 is a result; `UPDATE 29` with no expectation is a number.

A short count almost always means slugs did not match — not that "some were
already correct". Check which:

```sql
select d.slug
from (values ('<slug-1>'),('<slug-2>')) as d(slug)
left join venues v on v.slug = d.slug
where v.slug is null;
```

## Migrations

- **Never modify an applied migration.** Add a new one with the next number
  after verifying the current highest.
- New tables require RLS, with public-read and partner-write policies stated
  explicitly.
- Partner write paths may never update Other Bali editorial fields —
  `why_its_here`, `best_for`, `not_for`, warnings, rank.
- Prefer additive nullable columns; they keep old readers working.
- A migration file existing is not evidence it is applied in production.
  Record production-apply requirements explicitly in the handoff.

## Refusals

Stop and ask rather than improvise when:

- the write would change `publication_status` for rows you were not asked to
  publish or de-publish;
- the write would set a field partners may not control;
- production constraint state is unknown and the dry run cannot be performed;
- a value would have to be invented to satisfy a NOT NULL or an evidence
  constraint. Satisfying `verified_at` with today's date on data nobody
  verified turns a guard into a lie.

That last one is the real trap. Every evidence constraint in this schema can be
satisfied by typing a plausible date. The constraint is there to make you go
and check.
