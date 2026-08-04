# Worked example — `/canggu/best-brunch`

The standard applied to a real page, with the measured state that motivated each
rule. Dates and counts are from 2026-08-04.

## Starting state

Position 47, 73 impressions, 0 clicks. Every automated technical check passed —
canonical correct, in the sitemap, server-rendered, no `noindex`. So the problem
was not visibility. Google could see the page perfectly well and nobody, human
or model, had a reason to use it.

The page opened directly into a list. A reader who searched "best brunch in
Canggu" got no answer in the first screen — only categories to browse.

## What the audit found first

Before writing a word, we read the records. This inverted the whole task:

| Field | Populated | Rendered |
|---|---|---|
| `not_for` | 36 of 43 venues | nowhere |
| `last_verified_at` | 36 of 43 | nowhere |
| `opening_hours_json` | 501 of 1185 site-wide | nowhere |

The facts were not missing. The card component simply never read them. **Check
this before deciding a page needs new copy** — the cheapest large improvement is
usually rendering what you already hold.

## Block 1 — the opening

**Before:**

```
Best brunch in Canggu
Café brunch & specialty coffee
Bowls, eggs, good coffee — and a seat that lasts.
[list begins]
```

**After:**

```
Best brunch in Canggu

Short answer
  Specialty coffee            Hungry Bird — roasts its own beans in
                              Tibubeneng, direct from local farms, since 2013.
  A long table with friends   Brunch Club — all-day brunch under a big mango
                              tree in Pererenan.
  A laptop morning            ZIN Cafe — free coworking near Nelayan Beach,
                              with power at most tables.
  Vegan brunch                Secret Spot — fully plant-based, vegan
                              croissants included.
  Brunch by the water         The Lawn — directly on the black sand at Batu
                              Bolong Beach.

  Plates start around 35,000–70,000 IDR at Crate Cafe and run to
  100,000–250,000 IDR for mains at Milu by Nook.
  7AM Bakers in Umalas opens at 07:00, ahead of most of the neighbourhood.

  43 places, chosen by us and checked on the record. Nobody can pay to be on
  this list or to sit higher on it. Last checked 29 July 2026.
```

Each pick is addressed by slug in code and filtered against the venues the page
actually renders, so an unpublished venue drops out of the copy by itself rather
than leaving a promise the page cannot keep.

## Block 3 — a venue card

**Before** — one sentence carrying four things, two of them impressions:

```
A high-energy, industrial-style all-day breakfast institution on Jl. Batu
Bolong, known for big smoothie bowls and a rotating menu chalked on the wall
behind the counter.

Best for: Backpackers and surfers wanting a lively, affordable brunch after a
morning in the water; people who like buzz and don't mind a crowd.

35k-70k IDR
```

**After** — same facts, nothing researched, each one liftable:

```
Crate Cafe · Batu Bolong
All-day breakfast on Jl. Batu Bolong. Smoothie bowls, and a menu rewritten
daily on the wall behind the counter.
Best for: surfers and backpackers after a morning in the water.
Not for: a quiet table or focused laptop work — it is loud and busy.
$$ · plates 35–70K
```

The move that does the work: "high-energy" and "don't mind a crowd" were not
deleted, they were **relocated to `Not for`**, where the same observation
becomes a decision a reader can act on and an answer to "where not to work from
a laptop in Canggu".

## Block 5 — Good to know

Went from 3 questions to 8, covering the sub-queries an engine actually
generates: what time, how much, do I need to book, vegan, laptop work, with
kids, which area.

The replaced answer is instructive. The old copy read *"Most cafés open early
(around 7–8am)"* — an estimate written as a fact, sourced from nothing. We hold
exactly two opening times, so the new answer states those and stops:

> 7AM Bakers in Umalas opens at 07:00, earlier than most of the neighbourhood.
> Nook Umalas runs 08:00 to 23:00. Most places on this list serve an all-day
> menu, so a late brunch is easy.

Opening hours for the other 41 venues stay unsaid. That is the correct
outcome, not a gap to paper over.

## What the gate caught afterwards

Running `check-page.mjs` on the finished page found two things review had
missed, one of them in copy written to this very standard:

- A 30-word FAQ sentence bundling three facts — the exact failure the standard
  forbids, surviving because it read fluently.
- `<title>` at 72 characters once the site suffix is appended.

Both are the point of having a mechanical gate: fluent prose hides length, and
nobody counts characters by eye.

## What is still open on this page

- "Beachfront brunch" is a heading backed by one venue — it promises more than
  it delivers.
- 40 of 43 venues carry a price band with no numeric anchor. That is missing
  data, not a formatting fault, and it is not fixable by writing.
- Hours exist for 3 of 43, and no public surface reads the column at all.

Recording these is deliberate. A page standard that only describes the finished
state, with no honest list of what remains, quietly becomes a claim that the
page is done.
