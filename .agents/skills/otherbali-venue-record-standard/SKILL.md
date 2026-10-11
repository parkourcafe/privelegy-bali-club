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

# Other Bali venue record standard

This file is the canonical standard and is agent-neutral: Claude Code, Codex and
any other agent working in this repository read this same file. Claude Code
reaches it through the thin entrypoint at
`.claude/skills/otherbali-venue-record-standard/SKILL.md`; OpenAI-style agents
through `agents/openai.yaml` beside this file. Change the standard here and
nowhere else — a second copy is how two agents start disagreeing about what is
publishable.

## The one idea

**The unit of content work is the venue record, not the page.**

Every district page, guide card and place page on Other Bali is assembled at
render time from `venues` rows. Prose typed into a page component is a local
patch; a field written once on the record improves every surface that reads it
and stays correct when a venue moves between lists.

This has a corollary that catches people repeatedly: **a page can look thin
while the facts already exist.** Before writing anything new, look at what the
records hold. Two real findings from this repository:

- `not_for` was written and reviewed for 36 of the 43 Canggu brunch venues and
  rendered on **no** public surface — the card component simply never read it.
- `opening_hours_json` holds real hours for **501 of 1185** published venues and
  is read **nowhere**: it is absent from the public column list in `lib/data.ts`
  and absent from the `Venue` domain type.

So the first question is never "what should I write?" It is "what is already
here, and does anything render it?"

## Step 1 — Look before writing

Read the actual rows. Never work from the rendered page alone; the page shows
you what renders, not what exists.

```sql
select name, slug, why_its_here, best_for, not_for, price_anchor,
       what_to_order, opening_hours_json is not null as has_hours, last_verified_at
from venues
where district = '<district>' and status = 'active' and publication_status = 'published'
order by name;
```

Then check the two gates a field must pass to reach a reader:

1. Is the column selected in the public read (`PUBLIC_PLACES_VENUE_COLUMNS` in
   `lib/data.ts`) and mapped in `mapVenue`?
2. Is it on the `Venue` type in `lib/types.ts` and actually rendered by a
   component?

A field that fails either gate is invisible no matter how well written. When
that is the gap, the fix is code, not copy — say so instead of rewriting good
copy that was never the problem.

## Step 2 — The provenance ladder

Every sentence you write sits on one of three rungs. Know which one before you
type it, because the bottom rung is the line that must not be crossed
(`AGENTS.md` guardrail #10 — unknown stays `null`).

**Rung 1 — Verified fact.** From the venue's own site or menu, a partner
submission, or a recorded editorial visit. Publishable. If it is volatile
(price, hours), it needs a date.

**Rung 2 — Restatement.** The same fact the record already carries, said
differently or from the other side. The record says "all-day vegetarian and
vegan cafe", so `not_for: "Diners set on meat or seafood, because the menu is
entirely vegetarian and vegan"` is that fact as fit context, not a new claim.
Publishable, but **it is not fresh verification** — see `last_verified_at`
below.

**Rung 3 — Plausible invention.** Sounds right, traces to nothing. "Usually a
queue between 09:00 and 11:00", "opens around 7–8am", "the best coffee in
Canggu". Not publishable at any confidence. A wrong opening time is the most
damaging thing a travel page can carry, and once a model repeats it the error
outlives the correction.

When a fact would be genuinely useful and you are on rung 3: leave the field
`null` and record what is missing. An empty field renders nothing, which is
correct. A guessed field renders a lie.

## Step 3 — Write the record

Three habits do most of the work, in priority order.

**One claim per sentence.** A sentence that bundles atmosphere, location, menu
and history gives an extraction engine nothing to lift. Split it so each part
is liftable on its own — but join a fact to its consequence when the reader
needs both ("cash only, so bring enough for two"). The failure on the other
side is the staccato: "Day spa in Amed. Eighteen treatments. Booking by
WhatsApp." Three verbless fragments in a row read as a generator, and the
2026-09-28 audit found ~328 cards written exactly that way.

**Numbers instead of adjectives.** "Affordable" is an opinion; "35,000–70,000
IDR" is a fact. Prefer the number wherever the record supports one.

**Impressions are not deleted — they are relocated.** "High-energy", "lively",
"buzzy" are useless in `why_its_here` and genuinely useful in `not_for`, where
the same observation becomes a decision the reader can act on. This is the move
that turns weak copy into the thing no competitor publishes.

### Worked example — Crate Cafe (real record)

**Before** — one sentence carrying four unrelated things, two of them
impressions:

```
why_its_here: A high-energy, industrial-style all-day breakfast institution on
              Jl. Batu Bolong, known for big smoothie bowls and a rotating menu
              chalked on the wall behind the counter.
best_for:     Backpackers and surfers wanting a lively, affordable brunch after
              a morning in the water; people who like buzz and don't mind a crowd.
```

**After** — same facts, nothing added, each one extractable. "High-energy" and
"don't mind a crowd" move to `not_for`, where they answer a question:

```
why_its_here: An all-day breakfast place on Jl. Batu Bolong that has been there
              long enough to be an institution. Smoothie bowls are the order,
              and the menu is rewritten on the wall behind the counter every day.
best_for:     Surfers and backpackers after a morning in the water.
not_for:      A quiet table or focused laptop work, because it is loud and busy.
price_anchor: 35k-70k IDR
```

Nothing was researched to make this change. It is rung 2 throughout.

**A formula is not a voice.** The shape above — what it is, the thing to
order, one practical detail — is a checklist of what the record must carry,
not a sentence pattern to repeat. Written three times on one scheme it becomes
the template the 2026-09-28 audit found on 419 cards ("Restaurant on Jl. X in
Y, open daily…"). Vary the opening, let one sentence carry a reason, and read
the three neighbouring cards before writing the fourth. The machine-pattern
list in `docs/content-style.md` §9 (executable copy: `scripts/copy/patterns.mjs`)
is the floor every field must pass.

## Step 4 — Check before you write

- [ ] Every sentence sits on rung 1 or rung 2, and I can name which.
- [ ] Nothing unknown was filled to make a field look complete.
- [ ] `not_for` is fit context ("not for a quiet table"), never a quality
      warning ("service is slow") — guardrail #9. The test: would the owner
      read it and agree it is accurate? Fit passes that test; quality does not.
- [ ] No machine patterns: `node scripts/copy/lint.mjs --text "<field text>" --field <field>`
      reports 0 FAIL (the list is `docs/content-style.md` §9; hype, review
      language, stubs, "Perfect for" openers, the category formula).
- [ ] No Google ratings, review counts, or review-derived claims — guardrail #2.
- [ ] For a rewrite of an existing field: `node scripts/copy/fact-diff.mjs
      --before "<old>" --after "<new>"` reports PASS — no number, name, dish or
      evaluative word appears that the old text did not hold, and every fact I
      dropped is named as a deliberate deletion in the change list.
- [ ] `last_verified_at` is only bumped if I actually re-checked the source.
- [ ] I know which public surface will render each field I touched.

## Step 5 — Apply it as guarded SQL

Content changes go in `data/data-ops/<scope>-<what>-<date>.sql` and are applied
by the founder, not from an agent session. Three properties make a file safe to
hand over:

**Guard on the current value, so re-running is harmless.** A hand-edit after
the first run must survive a second run. For a field that is empty today, guard
on empty:

```sql
update venues set not_for = 'A budget breakfast -- mains run 100,000-250,000 IDR.'
  where slug = 'milu-by-nook' and (not_for is null or length(trim(not_for)) = 0);
```

For a **rewrite** of a field that already has text, the empty guard is wrong —
it would skip the row silently. Guard on the exact old text instead, and ship
the reverse statement next to it:

```sql
update venues set why_its_here = '<new text>'
  where slug = 'soma-fight-club-canggu'
    and status = 'active' and publication_status = 'published'
    and why_its_here = '<exact old text>';
-- rollback-<date>.sql: the same statement with old and new swapped.
```

`scripts/copy/build-copy-sql.mjs` generates both files from a change list and
a read-only export of the current rows; it refuses a row whose current value no
longer matches the list, so a hand edit made in between is never overwritten.

**Leave `last_verified_at` alone for rung-2 copy.** That date drives the public
"Last checked" line and the sitemap `lastmod`. Bumping it for derived copy
claims evidence that does not exist and quietly corrupts the freshness signal
the whole site depends on.

**Verify without executing.** `explain update ...` parses and plans the
statement without writing, and a slug-count query proves each statement hits
exactly one row before anything runs:

```sql
select s.slug, (select count(*) from venues v where v.slug = s.slug) as rows_matched
from (values ('slug-a'),('slug-b')) as s(slug);
```

Full pattern with header conventions and the verification block:
`assets/venue-record-update-TEMPLATE.sql`.

## Field-by-field detail

`references/field-standard.md` — what each field is for, its format, its
evidence requirement, and a real before/after per field. Read it when writing
or reviewing a specific field, or when a field's format is in question (for
example `price_anchor`, where three incompatible formats currently coexist in
production data).

## What this does not cover

Article and guide-page prose — headlines, answer-first openings, FAQ blocks,
internal linking, JSON-LD — is `docs/content-style.md`. That guide governs the
words a page author writes. This skill governs the fields a page assembles
itself from. When they appear to disagree, `AGENTS.md` and the master
architecture win over both.
