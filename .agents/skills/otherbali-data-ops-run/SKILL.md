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

# Other Bali data-ops run

This file is the canonical playbook and is agent-neutral: Claude Code, Codex and
any other agent working in this repository read this same file. Claude Code
reaches it through the thin entrypoint at
`.claude/skills/otherbali-data-ops-run/SKILL.md`; OpenAI-style agents through
`agents/openai.yaml` beside this file. Change the playbook here and nowhere
else.

## The one idea

**A collection run is an acceptance problem, not a collection problem.**

Getting a value is easy — an agent, an API or a person will always return
something. Deciding whether that something is true is the whole job, and it is
the step every run skips under time pressure.

Two real runs in this repository:

- **Opening hours, 2026-08-04.** The collector marked 33 rows `ready`. Three
  were wrong. Two took `Mo-Su 14:00-23:59` from a hotel's Cloudbeds booking
  engine — 14:00 was the *check-in* time, proven by the collector's own note
  quoting the check-out policy. The third returned `09:30-12:00` for a café.
  Nothing in the CSV flagged them; the status column said `ready` on all three.
- **Coordinates, same day.** Before collecting anything, a measurement showed
  `google_place_id` was null for *every* venue missing coordinates, closing the
  cheap route through Google Places, and that 22 coordinates were already
  sitting inside stored Maps URLs. Twenty minutes of measurement removed a
  wrong plan and produced 22 free rows.

## The eight steps

Do them in order. Steps 1–2 are what stop you collecting the wrong thing;
steps 5–6 are where the day's real mistakes happened.

### 1. Measure the gap before collecting

Two numbers side by side: what the database holds, and what reaches the page.

```sql
select
  count(*) as published,
  count(*) filter (where <field> is not null) as have_field
from venues
where publication_status = 'published';
```

Then check whether the field is actually selected and mapped — grep the column
name in `lib/data.ts`. A field can be 60% populated and 0% visible.

This is not optional throat-clearing. It found that coordinates, phones and
hours were present for hundreds of venues and reaching zero pages, which meant
the correct first task was wiring, not collecting.

### 2. Prioritise by traffic, not by alphabet

A list of several hundred rows is never worked end to end. Cut it to the rows
that already earn attention:

- venues in districts that have public pages (`canggu`, `ubud`,
  `uluwatu-bukit`) before the long tail;
- venues that already rank or appear in a guide before those nobody reaches.

Say out loud what is being deferred and why. A silently truncated run reads
later as "we covered everything".

### 3. Brief the collector with a source order, not a wish

The brief must state, in order, **where to look** and **what does not count**.
For a venue fact the order is almost always:

1. the venue's own website — contact / find-us / footer, embedded map, JSON-LD;
2. its Instagram — profile geotag, bio link;
3. a licensed structured source (for geocoding: OpenStreetMap, whose licence
   permits storing the result with attribution — Google's does not, beyond 30
   days).

What never counts: review aggregators, TripAdvisor, directory clones, a hotel
booking engine, a ClassPass or Playtomic listing page. These are the sources
that produced every bad row so far.

See `references/acceptance-rules.md` for the per-field version of this.

### 4. Fix the hand-back format before work starts

CSV, one row per venue, **including the ones that were not found**:

```csv
slug,value,source_url,source_type,status,note
seniman-coffee-studio,Mo-Su 07:30-22:00,https://senimancoffee.com/,website,ready,
some-warung,,,,not_found,site does not resolve
other-place,,,https://example.com/contact,website,unclear,map pin sits one block away
```

- `status` is `ready` · `unclear` · `not_found`.
- **A row without `source_url` is not accepted.** In a month nobody will
  remember where a value came from, and an unattributed fact cannot be
  defended or re-checked.
- Not-found rows matter as much as found ones: they are the record of what was
  attempted, and without them a rerun repeats the same dead ends.

### 5. Accept row by row — the status column is not evidence

Read every row against three questions:

1. **Is the source the venue's own page?** Open the URL. A booking engine, an
   aggregator or a link-tree is not the venue.
2. **Is the value plausible for this kind of place?** A café open 09:30–12:00,
   a spa opening at 14:00, a restaurant open 24 hours — each is possible and
   each is usually a fragment of something else (a class timetable, a check-in
   policy, a placeholder).
3. **Does it fall inside its plausibility bound?** Every field type has one —
   see `references/acceptance-rules.md`. A coordinate outside its district's
   bounding box is not "slightly off", it is a different place.

Anything failing any question goes to a rejected list **with the reason
written out**, not silently dropped. The rejection list is how the next run
gets better.

### 6. Generate the UPDATE with its rejections attached

Use `assets/apply-TEMPLATE.sql`. The pattern that matters:

- a `values` list joined on `slug`, so a typo'd slug updates nothing rather
  than something;
- `and status = 'active' and publication_status = 'published'` in the `where`,
  so drafts are never touched;
- a verification `select count(*)` immediately after, with the **expected
  number stated in a comment beforehand**;
- a commented block at the end listing every rejected row and why.

Before running it, follow `otherbali-supabase-write` — the constraints are not
all discoverable from the repository.

### 7. Publish the field, with a test for refusal

A collected field is worthless until something renders it. When wiring it into
the page or the markup, follow `otherbali-schema-markup`, and write the test
for the **refusal** case, not only the success case. Every invisible bug this
repository has shipped was a value that should have been omitted and was not.

### 8. Verify on the live page

Rich Results Test (`search.google.com/test/rich-results`) on one affected URL.
No terminal needed, and it shows the page as Google parses it rather than as
the code intends it.

## Refusals

Stop and ask rather than improvise when:

- the only available source is a review aggregator (guardrail #2 — no scraping
  or republishing Google review content, ratings included);
- filling the field would require inventing a plausible value (guardrail #10 —
  unknown means null);
- the run would write to a field partners may not control — `best_for`,
  `not_for`, warnings, organic rank;
- the same venue appears under two slugs. Collecting twice costs twice and
  publishes two cards for one place; resolve the duplicates first.

## What good looks like

At the end of a run you can answer, without opening anything: how many rows
were collected, how many were rejected and for what reason, what the expected
row count of the UPDATE was and what it actually returned, and which URL was
checked on the live site.

If any of those is missing, the run is not finished — it is just over.
