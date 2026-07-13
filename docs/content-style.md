# Other Bali — content style guide

How we write articles and guides so they are **clickable, scannable, human, and
useful for SEO/AEO** — all at once, without hype or invented facts. This is the
standard every article (the top-30 topic list, district guides, scenarios) is
written to. It sits on top of `docs/seo-strategy.md` (the mechanics) and the
editorial voice from our venue passes (facts, no hype).

Brand voice in one line: **The right place for the moment you're in.** We are the
knowledgeable local friend — specific, honest, calm. Not a hype blog, not a
brochure, not an SEO robot.

---

## 1. The non-negotiables (guardrails, first)

- **Never invent a fact.** Every claim (a dish, a price band, hours, a vibe)
  traces to something verifiable. Unsure → leave it out. (#1, #11)
- **No hype adjectives as filler**: "stunning", "hidden gem", "must-visit",
  "world-class", "nestled". They say nothing and read as spam. Replace with a
  concrete detail.
- **No anti-lists / quality warnings.** Downsides only ever as *fit-context* —
  who/when a place isn't for. "Not for a quiet dinner" ✅. "Service is slow" ❌. (#7)
- **No Google ratings or review counts** anywhere. (#1)
- **Prices as bands** ("$$ · mains ~90–150K"), never a live menu.
- **English only.** Mobile-first: assume a phone, one thumb, half attention.

---

## 2. Headlines (clickable, not clickbait)

The title is the click. It must promise a specific, real payoff — and then the
page must deliver it. No curiosity-gap bait ("You won't believe…").

**Formulas that work for us:**
- *Best {thing} in {area}* — "Best cafés to work from in Canggu"
- *{A} vs {B}* — "Canggu vs Uluwatu: which is right for you"
- *Where to {verb} in {area}* — "Where to watch the sunset in Uluwatu"
- *{Audience}'s {place}* — "Bali for digital nomads: where to live, work & eat"
- *{Number} + specific* — "7 days in Bali: a first-timer's itinerary"

**Voice check — three ways to title the same page, pick the middle one:**
- Too flat / robotic: "Canggu Cafes List"
- ✅ Ours: "Best cafés to work from in Canggu" (specific job + place)
- Too hype / clickbait: "The 10 INSANELY good Canggu cafes you NEED to try"

Rules: front-load the keyword; one clear promise; ≤ ~60 chars for the `<title>`;
sentence case; no emoji in titles; the H1 can differ slightly from the `<title>`
but keep the same promise.

---

## 3. The opening (answer-first — this wins Google AND AI answers)

The first sentence answers the query directly and could be quoted on its own.
AI engines (ChatGPT, Perplexity, AI Overviews) lift that first line; humans
decide in ~8 seconds whether to stay. Same sentence serves both.

- ✅ "Canggu's work-friendly cafés cluster in Batu Bolong and Berawa — here are
  eight with reliable wifi, real food, and where to sit."
- ❌ "Bali is a magical island that has captured the hearts of travellers for
  generations, and Canggu is no exception…" (says nothing, buries the answer)

Then 1–2 short sentences of context, then straight into the substance. No
throat-clearing, no history lesson.

---

## 4. Scannability (the 8-second rule)

Nobody reads top-to-bottom on a phone. Build for skimming:
- **Short paragraphs** — 1–3 sentences. No walls of text.
- **Descriptive subheads** every ~150–200 words, so the page is navigable by
  eye. Subheads carry meaning ("Batu Bolong: the walkable cluster"), not filler
  ("Overview").
- **Lists for anything enumerable** — venues, steps, pros/fits. A structured
  list beats prose for both humans and AI extraction.
- **Per-venue, keep a consistent shape**: name · area · one-line why · what to
  order · price band · best-for. Same order every time → readable + machine-clean.
- **Bold the thing that matters** in a line, sparingly.
- One idea per paragraph. If a sentence runs past ~25 words, split it.

---

## 5. Human voice (write like a person)

- **Talk to one reader** ("you"), not "travellers" or "one".
- **Concrete over abstract.** Not "great atmosphere" → "recycled-boat-wood
  tables, a saltwater pool, oysters at the raw bar."
- **Verbs and nouns do the work.** Cut adverbs and intensifiers ("really",
  "very", "truly", "absolutely").
- **Vary sentence length.** A short one lands. Then a longer one that carries the
  detail and the reasoning. Then short again.
- **Contractions are fine** ("it's", "you'll") — it reads human.
- **Cut throat-clearing**: "It's worth noting that", "When it comes to",
  "Nestled in the heart of", "Look no further".
- **Say the useful thing plainly.** If a place suits a rainy afternoon and not a
  big group, say exactly that.

Before → after:
- ❌ "Nestled in the vibrant heart of Canggu, this stunning café offers a truly
  unforgettable culinary experience for discerning travellers."
- ✅ "A loud, industrial all-day café on Batu Bolong — big smoothie bowls, a
  menu chalked on the wall, and a table you'll actually get before noon if you
  come early."

---

## 6. Structure of a standard article

1. **H1** — the promise (matches the title).
2. **Answer-first intro** — 2–4 sentences.
3. **Body** — subheads by sub-area, intent, or step. Venue picks in the
   consistent per-venue shape. Internal links woven in naturally.
4. **A short "how to choose" / practical note** where it helps (best area for
   X, when to go, rough cost).
5. **FAQ** — 3–5 real questions people actually type, answered in 1–2 sentences
   each ("Is Canggu good for families?"). Feeds FAQPage schema.
6. **Where next** — links onward (the district pillar, sibling guides, the
   filtered `/places` view).

## 7. SEO/AEO checklist (every article ships with all of these)

- [ ] `<title>` ≤ ~60 chars, keyword front-loaded; unique meta description (~150 chars) that reads like a human wrote it.
- [ ] Self-canonical; in the sitemap.
- [ ] Answer-first opening sentence.
- [ ] Consistent structured venue attributes (extractable).
- [ ] 3–5 internal links: **up** to the district pillar, **across** to sibling
  guides, **down** to venue pages. Descriptive anchor text (not "click here").
- [ ] JSON-LD: `Article` (or the page's type) + `BreadcrumbList` + `FAQPage`
  (+ `ItemList`/`Restaurant` for venue lists).
- [ ] Every venue named is real and in our catalogue (link it).
- [ ] No thin content — if we can't say something specific and true, we cut the
  section, we don't pad it.

---

## 8. Length

Write to the topic, not a word count. A tight "Where to watch sunset in Uluwatu"
might be 600 words; "Where to stay in Bali for the first time" earns 1,500+
because it genuinely compares five areas. Never pad to hit a number — padding is
exactly what Google's helpful-content signals punish.

---

*If a draft violates §1, stop and fix it before anything else. Everything else
here is craft; §1 is the line.*
