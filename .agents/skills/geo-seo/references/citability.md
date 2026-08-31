# Citability — would an AI quote this passage?

> Read `otherbali-overlay.md` §2 and §3 first. A low score here is usually a
> missing record field, and the fix is data collection, not rewriting.

## The finding this is built on

AI systems do not cite pages. They extract passages. Upstream reports research
from Princeton, Georgia Tech and IIT Delhi (2024) finding that GEO-optimised
content achieves 30–115% higher visibility in AI-generated responses, and that
extracted passages cluster around **134–167 words**, are **self-contained**,
**fact-rich**, and **answer the question in the first one or two sentences**.

These are upstream's numbers, unverified here — overlay §8. Use them as
thresholds for our own tracking, not as claims.

The practical consequence for Other Bali: a passage that reads well in context
and dies when lifted out of it is a passage no answer engine will use. Our
district pages are lists of venues; each venue block is exactly the unit that
gets lifted.

## Rubric (0–100)

Weighted: Answer Quality 30%, Self-Containment 25%, Structure 20%,
Statistical Density 15%, Uniqueness 10%.

```txt
Block = Answer·0.30 + SelfContain·0.25 + Structure·0.20 + Stats·0.15 + Unique·0.10
Page  = mean(all blocks)
Coverage = % of blocks scoring above 70
```

### 1. Answer block quality — 30%

| Score | Criteria |
|---|---|
| 90–100 | Every section opens with a 1–2 sentence direct answer. "X is…" / "X refers to…" patterns. First 40–60 words stand alone. |
| 70–89 | Most sections have clear answer openings. Some definition patterns. Minor context needed. |
| 50–69 | Some answer-like openings, but many bury the answer mid-paragraph. |
| 30–49 | Answers generally buried. Narrative-driven rather than answer-driven. |
| 0–29 | No identifiable answer blocks. Nothing quotable. |

Look for: definition patterns, answer-first ordering, quantified answers
("the average is $Y", not "many factors affect it"), enumerated comparisons.

**On Other Bali this is `why_its_here`.** A venue block that opens "Tucked down
a quiet lane you might walk past twice…" scores near zero. One that opens
"Home to Canggu's only wood-fired sourdough, baked twice daily from 7am" scores
high — and both are the same field, written differently. The standard for
writing it is `otherbali-venue-record-standard`, not this file.

### 2. Passage self-containment — 25%

| Score | Criteria |
|---|---|
| 90–100 | 80%+ of blocks fully self-contained. Each names its subject. No pronouns reaching backwards. |
| 70–89 | 60–79% self-contained. Occasional backward pronoun references. |
| 50–69 | 40–59%. Mixed explicit subjects and pronouns. |
| 30–49 | 20–39%. Heavy contextual dependence. |
| 0–29 | Under 20%. Continuous narrative; extracting any paragraph loses meaning. |

Per-passage checklist:

1. Does it name the subject explicitly, not "it" / "this" / "they"?
2. Can someone understand the point reading only this passage?
3. Does it contain at least one specific fact, statistic or named entity?
4. Is it 50–200 words?
5. Does it avoid opening on a conjunction ("But", "However") that implies
   prior context?

**The failure mode specific to our pages:** a venue card whose description
opens "It's also great for groups" — meaningful under the heading, meaningless
lifted out. Name the venue in its own description.

### 3. Structural readability — 20%

| Score | Criteria |
|---|---|
| 90–100 | Clean H1 > H2 > H3. Question-based headings. 2–4 sentence paragraphs. Tables for comparisons. Ordered lists for processes. |
| 70–89 | Good hierarchy, minor skips. Some question headings. Mostly short paragraphs. |
| 50–69 | Hierarchy present but inconsistent. Few question headings. |
| 30–49 | Minimal heading structure. Long paragraphs dominate. |
| 0–29 | No hierarchy or broken. Wall of text. |

Practices: never skip heading levels; phrase headings as the question a user
asks; 2–4 sentences per paragraph; tables for any comparison of 3+ items;
ordered lists for sequences, unordered for sets; bold the first use of a key
term.

Block order for our listing pages is fixed by
`otherbali-guide-page-standard` — that skill's `scripts/check-page.mjs` is the
pass/fail authority. This rubric is advisory and does not override it.

### 4. Statistical density — 15%

| Score | Criteria |
|---|---|
| 90–100 | 5+ specific statistics per 500 words, all sourced or dated. Exact numbers. |
| 70–89 | 3–4 per 500 words. Most claims sourced. |
| 50–69 | 1–2 per 500 words. Some sourcing. |
| 30–49 | Under 1 per 500 words. Few sourced claims. |
| 0–29 | None. All quantifiers vague. |

Counts: specific percentages, amounts, timeframes, named studies, exact counts,
comparison data. Does not count: "many companies", "a significant percentage",
"studies show", "experts agree".

> **This is the row that most often triggers a guardrail breach.** Raising it
> means collecting facts with sources (`otherbali-data-ops-run`) and writing
> them into records (`otherbali-venue-record-standard`). It never means adding
> a number that reads plausibly. Overlay §2. On venue records the legitimate
> carriers are `price_anchor`, `what_to_order` and `opening_hours_json`, each
> with `last_verified_at`.

### 5. Uniqueness and original data — 10%

| Score | Criteria |
|---|---|
| 90–100 | First-party research, proprietary data, original datasets. Insights found nowhere else. |
| 70–89 | Some original analysis or a distinct perspective with original examples. |
| 50–69 | Mostly synthesis with some unique commentary. |
| 30–49 | Largely derivative restatement of common knowledge. |
| 0–29 | Entirely derivative; available verbatim on higher-authority sources. |

**This is Other Bali's strongest row and the one to defend.** A recorded
editorial visit that establishes what to order, who a place suits and who it
does not is first-party data that Google Maps does not hold and no aggregator
republishes. `not_for` in particular has no equivalent anywhere — it is the
single most defensible thing the product publishes.

It is also the row guardrail #9 fences: fit context is allowed, invented or
copied negative claims are not.

## Procedure

1. Fetch the page. Use `scripts/fetch_page.py`, not `WebFetch` — `WebFetch`
   converts to markdown and discards `<head>`, so JSON-LD and meta disappear.
2. Segment at H2/H3 into blocks. Per block record: heading, word count,
   paragraph count, lists, tables, data points, whether a definition pattern is
   present, whether the first 60 words stand alone.
3. Score each block on the five categories.
4. Page score is the mean; coverage is the share of blocks above 70.
5. For every block under 60, name the primary weakness and locate the field it
   lives in. On a data-driven page, write the finding as a record field, not a
   suggested paragraph.

## Reported per-engine preferences

Upstream's characterisation, unverified here:

| Engine | Preference |
|---|---|
| ChatGPT Search | Explicit definitions, named sources, recent dates. Cites 2–4 sources. |
| Perplexity | Fact-dense passages with statistics. Cites 4–8. Values recency highly. |
| Claude | Well-structured comprehensive passages. Nuance over brevity. |
| Gemini / AI Overviews | Concise 40–60 word answer blocks. Favours existing top-10 organic. |
| Copilot | Like Gemini. High-authority domains, clear factual claims. |
