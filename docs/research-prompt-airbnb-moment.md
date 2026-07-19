# Research prompt — "Airbnb moment" article (P1-3)

**Date:** 2026-07-18
**Purpose:** Source the facts for the topical `/bali-airbnb-august-2026` article
(the eGTM "Airbnb moment" content wave). This replaces the missing
`other-bali-egtm-airbnb-moment-content-pack-v1.md`. Run the prompt below with a
research assistant; feed the returned research back to the editor, who builds the
page from **verified, sourced facts only** (guardrail #10 — nothing invented; no
legal advice; fit-context, not anti-lists; English; Article + FAQPage schema).

The prompt is deliberately "facts first, article second": the topic is live and
regulatory, so the assistant discovers the current situation with dated sources
rather than assuming it.

---

```
ROLE
You are a research assistant gathering sourced facts for an editorial article on
"Other Bali" (otherbali.com) — a resident-curated Bali decision & planning guide.
Your output is raw, verifiable research that a human editor will turn into the page.
Do NOT write the finished article. Do NOT invent anything.

TOPIC & ANGLE
The article is the "Airbnb moment" for Bali travellers, timed to August 2026.
Travellers are seeing news/rumours about short-term rentals ("Airbnb villas") in
Bali — regulation, licensing, tourism levies, construction moratoriums, enforcement
— and are anxious about how it affects a trip they've already booked or are planning.
The article's job: calmly explain what is ACTUALLY happening (fact vs rumour), what
it does and doesn't mean for a normal traveller's trip, and how to plan around it —
then hand off to planning. Reassuring, specific, honest. NOT alarmist.

OTHER BALI'S LANE (respect these — do not stray)
- Other Bali helps people DECIDE and plan what to do in Bali (places, moments,
  routes). It does NOT book accommodation, is NOT an Airbnb alternative, and takes
  NO traveller payments. So the article informs and routes to planning — it does not
  sell or replace lodging.
- NO legal advice. Report what authoritative sources say; never instruct a reader on
  how to comply with law, what's "legal for them", visas, or taxes owed.
- NO anti-lists, no naming/shaming specific hosts, platforms or areas as "bad."
- English output. Mobile-first, calm, plain — no hype adjectives.

WHAT TO RESEARCH (each item: only sourced facts, with a URL + publication date)
1. THE ACTUAL DEVELOPMENT: What specific short-term-rental / Airbnb / villa /
   tourism development in Bali (or Indonesia) is topical as of mid-2026? Identify
   the real story behind the "August 2026" hook. Distinguish clearly:
   (a) CONFIRMED & in force, (b) announced/proposed but not yet in force,
   (c) rumour / misreported. Give exact dates and the issuing body.
2. WHAT CHANGED, PRECISELY: regulations, licences/permits for short-term rentals,
   any construction moratorium (which areas), the Bali tourism levy (amount, who
   pays, how), enforcement actions. Numbers, effective dates, geographic scope.
3. PLATFORM & OFFICIAL STATEMENTS: anything Airbnb, the Bali provincial government,
   or Indonesia's tourism ministry have publicly stated. Quote sparingly with source.
4. PRACTICAL TRAVELLER IMPACT (sourced, not advice): According to reputable
   sources, what does this mean in practice for someone with a villa/Airbnb booking
   this year — does it typically affect the guest or the host/owner? What do sources
   say travellers should simply be aware of? Flag where the honest answer is
   "unclear / not yet decided."
5. THE REAL QUESTIONS TRAVELLERS ASK (for the FAQ): harvest the actual phrasings
   people use (TripAdvisor Bali forum, Reddit r/bali if reachable, Google "People
   Also Ask"). 6–10 questions, verbatim style. Mark high-volume ones [HV].
6. TIMELINE: a short dated timeline of the key events leading to the mid-2026
   situation.
7. WHAT IS UNKNOWN / DISPUTED: explicitly list what is NOT settled or is contested,
   so the article can say "unknown" instead of guessing.

SOURCE RULES
- Prefer: official Indonesian/Bali government sources, the tourism ministry, Airbnb
  official, and established news (Reuters, AP, Jakarta Post, Bali-based outlets).
- Use Indonesian-language official sources too; summarise in English with the link.
- EVERY factual claim must carry: the source URL + publication date + a
  status tag (CONFIRMED / PROPOSED / RUMOUR).
- Do NOT copy Google/Airbnb review text or star ratings.
- If you cannot verify something, say so — never fill the gap with a guess.

OUTPUT FORMAT (return exactly this)
A) SITUATION SUMMARY — 4–6 sentences, plain, what's really going on (fact vs rumour).
B) TITLE OPTIONS — 3 candidate H1s (specific, calm, no clickbait).
C) META DESCRIPTION — one ~150-char option.
D) SHORT ANSWER — 2–3 sentences answering "What's happening with Airbnb in Bali,
   and does it affect my trip?" (the AEO answer block).
E) BODY OUTLINE — 4–6 section headings, each with 2–4 bullet points of the sourced
   facts that belong under it.
F) FAQ — the 6–10 harvested questions, each with a 2–4 sentence answer built ONLY
   from sourced facts (or "not yet decided" where true). Cite the source per answer.
G) TIMELINE — dated bullets.
H) UNKNOWNS — bullet list of what's unsettled.
I) SOURCE LEDGER — a numbered list: claim → URL → date → status.
J) INTERNAL-LINK IDEAS — where in the article it would be natural to link to a Bali
   day-planner or a Canggu guide (topic-level suggestions only).
```

---

## After the research comes back

The editor builds `/bali-airbnb-august-2026` from the returned pack:
Article + FAQPage JSON-LD, canonical + own OpenGraph, internal links to the
day-planner and Canggu guide, CTA "Open the guide", English only. Only claims that
carry a source in the ledger are published; unverified items are dropped or written
as "not yet decided".
