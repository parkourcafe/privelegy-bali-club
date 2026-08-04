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

# The Other Bali guide page standard

## What this is, and the one honest caveat

This defines the finished artefact: the blocks a public listing page must
carry, how its sentences are built, and the gate it must pass before it ships.

The caveat, said once and plainly: **no document makes a page rank in the top
five.** Ranking is this page plus competition, domain strength, links and time
— and only the first is yours. What the standard does control is that when a
retrieval system reaches your page, it finds facts it can lift and attribute,
instead of prose it has to paraphrase and therefore drops. Pages that get
quoted get clicked. Treat everything below as making the page *eligible*, not
as a guarantee, and measure at eight weeks rather than eight days.

Where it sits: the [venue record standard](../otherbali-venue-record-standard/SKILL.md)
governs the fields; this governs their assembly; `docs/content-style.md`
governs article prose; the district SEO pipeline decides which URLs exist at
all. When they conflict, `AGENTS.md` and the master architecture win.

## The one rule under all the others

**Every sentence must survive being lifted out of the page alone.**

That is the whole test. A model answering "where's good brunch in Canggu" quotes
a sentence with no surrounding context. If the sentence needs the paragraph
above it to make sense, it cannot be quoted, so the page loses even when it
ranks. Read any line you write on its own and ask whether it still says
something true and useful.

Three habits follow, and they are the mechanism, not decoration:

1. **One sentence, one fact.** Bundled sentences are unliftable. "A
   high-energy, industrial-style all-day breakfast institution known for big
   smoothie bowls" carries four things and yields none.
2. **A number beats an adjective, always.** "Affordable" is an opinion no
   engine can cite. "35,000–70,000 IDR" is a fact it will paste into an answer.
3. **Name the venue in the sentence.** "One café opens at 07:00" is unusable.
   "7AM Bakers opens at 07:00" is an answer.

Sentences run under ~25 words. Longer than that and it is carrying more than one
fact — split it.

## The blocks, in order

A page missing any of blocks 1–5 is not finished.

### 0. URL and metadata

- One URL answers exactly one decision. If two decisions live on it, the page
  competes with itself and wins neither.
- `<title>` ≤ 60 chars, keyword first, sentence case.
- Meta description ~150 chars, written for a human, not stuffed.
- Self-canonical, present in the sitemap, no `noindex`.
- Sitemap `lastmod` = the date the content genuinely changed. Not the deploy
  date, not today — a false lastmod is the fastest way to teach a crawler to
  distrust the whole sitemap.
- Server-rendered. If the facts arrive via client JavaScript, assume they are
  not read.

### 1. H1 and the answer, before anything else

The first ~100 words decide whether an engine keeps reading. A page that opens
with a list has answered nothing.

Required, in this order:

1. **H1** — the promise, matching the title.
2. **Short answer** — one line per decision a reader might arrive with, each
   naming one venue and the single fact that settles it.
3. **Extractable numbers** — the price range, and any hours actually held.
   Two or three lines, each one fact.
4. **Trust line** — how the list was chosen, and when it was last checked.

```
Short answer
  Specialty coffee        Hungry Bird — roasts its own beans in Tibubeneng since 2013.
  A long table with friends  Brunch Club — all-day brunch under a big mango tree.
  A laptop morning        ZIN Cafe — free coworking, power at most tables.

  Plates start around 35,000–70,000 IDR at Crate Cafe and run to 100,000–250,000
  IDR for mains at Milu by Nook.

  43 places, chosen by us and checked on the record. Nobody can pay to be on
  this list or to sit higher on it. Last checked 4 August 2026.
```

Every named pick must be addressed by slug in code and filtered against the
venues the page actually renders. Copy that names a venue the page no longer
shows is a promise the page breaks — and it will happen, because venues get
unpublished.

### 2. Grouping by decision

Headings split by the choice a traveller is making — "café brunch and specialty
coffee", "all-day and weekend", "by the beach" — never alphabetically, never by
our internal category names. The heading is how someone finds their own case.

A heading must be backed by enough entries to be worth its promise. A section
called "Beachfront brunch" holding one venue promises more than the page
delivers; either fill it or fold it.

### 3. The venue cards

Same shape every time, so the page is machine-clean and eye-scannable:

```
Name · area
One editorial sentence — what it is, in facts.
Best for: the moment it suits.
Not for: the moment it does not.
Price band · anchor
```

**`Not for` is not optional decoration — it is the differentiator.** Everyone
publishes who a place suits. Almost nobody publishes who it does not, so it is
both novelty a model cannot synthesise from competitors and the answer to a
whole family of sub-queries ("where NOT to work with a laptop"). Render it
wherever the record holds it.

It is fit context, never a quality warning. The test: would the owner read it
and agree it is accurate?

### 4. Price format

One shape everywhere — band plus a concrete anchor where the numbers exist:

```
$$ · plates 35–70K
```

| Band | Per menu item |
|---|---|
| `$` | up to ~50K |
| `$$` | ~50–150K |
| `$$$` | above ~150K |

Judge by where the range sits overall, not by its ceiling. A band with no
anchor is acceptable — that is missing data, not a broken format. A raw range
with no band (`35k-70k IDR`) is not: it cannot be compared across venues.

**Never state a page-wide price range you cannot compute.** If most venues carry
only a band, say "most of this list sits in the mid band" and name the specific
venues that do have numbers. An invented range is the single easiest way to
publish a falsehood at scale.

### 5. Good to know

Five to eight questions that are real sub-queries, each answered in one to
three sentences, each answer naming venues and numbers.

The sub-queries an engine generates from "best brunch in <area>" are
predictable: what time, how much, do I need to book, vegan, with kids, can I
work there, which area. Every one you answer is a separate chance to be the
cited source; every one you skip is a page someone else gets.

Answer only what the records hold. "Most cafés open around 7–8am" is an
estimate wearing a fact's clothing — replace it with the two opening times you
actually have, named to their venues.

Emit `FAQPage` JSON-LD, and only for content actually visible on the page.

### 6. Freshness and internal links

- A visible last-checked date, derived from real evidence dates on the venues
  shown — never a build timestamp. No evidence, no date shown.
- Three to five internal links: up to the district pillar, across to sibling
  guides, down to the venue pages. Descriptive anchor text.

## The gate

Run before publishing, and again after any data change that touches the page.

```bash
node .agents/skills/otherbali-guide-page-standard/scripts/check-page.mjs <url>
```

It checks what a machine can check: canonical, noindex, SSR-visible answer
block, sentence length, adjective-vs-number density, `Not for` coverage, price
format, FAQ count and JSON-LD, freshness date, internal links. It exits non-zero
on a fail, so it can gate a deploy.

What it cannot check, and you must:

- [ ] Every claim traces to a verified record — nothing invented (`AGENTS.md` #10).
- [ ] Each `Not for` is fit context, not a quality warning (#9).
- [ ] No section promises more than it holds.
- [ ] No Google ratings, review counts or review-derived claims (#2).
- [ ] Every named pick is slug-gated against the rendered set.
- [ ] Sitemap `lastmod` moved, and moved to the real change date.

## Worked example

`references/worked-example.md` — `/canggu/best-brunch` before and after, with
the measured state that motivated each block. Read it when you want to see the
standard applied to a real page rather than described.
