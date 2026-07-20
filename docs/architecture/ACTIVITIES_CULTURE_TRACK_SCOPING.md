# Activities & Culture track — scoping proposal (for founder approval)

**Status:** DRAFT — design only. No schema, no migration, no code beyond this
doc. Requires an explicit architecture amendment before implementation
(AGENTS.md guardrail #13: no new domain entity without master approval).
**Date:** 2026-07-20
**Author session:** `claude/new-session-pbevlv`
**Decision owner:** Selena (founder)

---

## 1. Why this exists

Feedback from a live walkthrough of `/places`: the `MOMENT` filter is
time-of-day only (golden hour → after dark), which answers *when* but never
*what you actually want to do* — a day out with the family and small kids, an
active/adventure day, or learning about Bali (history, culture, temples).

Four **situational moments** that existing data already supports shipped
immediately (Date night · With family · Work-friendly · Active day). This
document scopes the part that existing data does **not** support: a genuine
**Activities & Culture** layer — attractions, cultural sites, experiences and
day-trips — which today's catalogue has no venues or entity for.

## 2. The gap, precisely

The catalogue's venue `category` enum is F&B + wellness only:

```
cafe · warung · restaurant · beach_club · bar · spa · fitness · yoga · beauty · surf
```

There is **no** category or entity for a temple, a museum, a waterfall, a rice-
terrace walk, a cooking class, a dive trip, a family theme park, or a guided
cultural tour. So "learn about Bali / culture / history / adventure" cannot be
a `moment` chip over the current data — a chip that matches nothing is worse
than no chip. This is a **content-model gap**, not a filter tweak.

## 3. Boundary check (does this fit Other Bali at all?)

Other Bali owns *decision · explanation · trusted action · attribution*;
partners own fulfilment; Google Maps owns navigation. An activities/culture
layer fits **only if** we stay on our side of that line:

| Fits (we do) | Does NOT fit (we must not) |
| --- | --- |
| Curate & explain which places/experiences suit which traveller & moment | Become a tours/tickets marketplace or OTA |
| Hand off to the official site / verified provider / WhatsApp / Google Maps | Sell tickets, take deposits, or process tourist payments (guardrail #6) |
| Editorial fit-context ("who it's for", "when to go") | Republish Google review prose/ratings (guardrail #2) |
| Real, sourced facts (hours, official entry info) with capture date | Invent hours/prices or claim live availability (guardrails #10, #11) |

**Conclusion:** it fits as an *editorial + handoff* layer, the same shape as
the rest of the product. It must **not** grow a booking/ticketing engine. Any
monetisation stays gated to `active_deep` exactly as venues are (guardrail #8).

## 4. Data-model options

### Option A — extend `Venue` with new categories (lightest)
Add categories like `attraction`, `cultural_site`, `activity`, `nature`,
`class_workshop`, `day_trip` to the existing venue enum; reuse all existing
fields (whyItsHere, bestFor, area, district, action capabilities).

- **Pro:** no new entity → **no guardrail #13 amendment for the entity itself**
  (only the enum extension); reuses cards, filters, actions, RLS, importer.
- **Con:** some venue fields fit awkwardly (an attraction has no `menu`, a
  cooking class has a session time not opening hours); `category` semantics
  stretch.

### Option B — new `Experience` entity (cleanest, heaviest)
A first-class entity with its own fields (duration, meeting point, difficulty,
season, official booking URL, indoor/outdoor, suitable-for-kids).

- **Pro:** models the domain honestly; keeps Venue clean.
- **Con:** **requires guardrail #13 amendment** (new domain entity), a new
  table + RLS + importer + card + detail route + sitemap wiring. Big.

### Recommendation
**Start with Option A** for the first, lower-risk categories that are
"place-like" (attraction, cultural_site, nature — things with a fixed location
and a Google Maps handoff). Defer Option B until we actually need
session/duration/difficulty semantics (classes, guided adventure day-trips).
This lets a "Culture & history" and a "Family day out" moment go live over
**real** curated places without a schema-heavy build, and keeps the door open
to the richer entity later. This staging still needs sign-off because even
Option A extends a published enum and adds public content.

## 5. Moments this unlocks (once data exists)

- **With family — day out:** kid-friendly attractions, calm beaches, easy
  nature (adds to the venue-level "With family" moment shipped today).
- **Active / adventure:** surf, dive, snorkel, hike, waterfall, cycle.
- **Culture & history:** temples, palaces, museums, traditional villages,
  craft workshops — the "learn about Bali" intent.

Each stays an honest any-match over real editorial/tag fields, never invented.

## 6. Content sourcing (the hard part, non-negotiable)

Every factual claim must come from an allowed source (AGENTS.md §13): official
site/provider, editorial visit, or approved evidence record. For this track:

- **Allowed:** official temple/attraction info pages, provider official sites,
  our own on-the-ground research, Google Maps **handoff** (a deep link, not
  scraped content).
- **Forbidden:** copying Google/aggregator review prose or ratings (guardrail
  #2); inventing hours, entry fees, or "best time"; presenting fallback art as
  a real photo of the site.
- Hours / entry facts follow the menu-freshness rule: source attribution +
  captured-at date, and never shown as "current" past a staleness window.

**This track is gated on a content pipeline, not on code.** A dozen well-
sourced cultural/attraction entries beat a scraped hundred.

## 7. Guardrails engaged (must all be satisfied)

- **#13** new domain entity / enum change → this amendment.
- **#1** no routing/ETA — Google Maps handoff only.
- **#2** no review scraping/republishing.
- **#6** no tourist payments / ticketing.
- **#8** no monetisation outside `active_deep`.
- **#10** unknown = `null` / hidden; no invented facts.
- **#9** fit-context allowed; no invented negative claims.
- **Migration rules §9:** Session 1 is schema owner; any new table/enum is one
  numbered, RLS'd, additive migration — not authored in this session.

## 8. Proposed phasing

1. **Approve this doc** (founder) — pick Option A staging vs full Option B.
2. **Content spec** — define the first 2–3 categories, the exact fields, and
   the sourcing checklist; identify ~10 seed places with real sources.
3. **Schema (Session-1 owned)** — additive enum/columns, RLS, importer path.
4. **Surface** — cards + the new moment chips + `/places` filter wiring +
   sitemap/canonical, reusing existing components.
5. **Locale** — the new chrome strings into the 6-locale dictionaries.

## 9. Open questions for founder

1. **Scope of first slice:** culture/temples first, or family-day-out first?
2. **Option A vs B:** OK to start by extending Venue categories (A), or do you
   want the full `Experience` entity (B) from the start?
3. **Monetisation:** confirm this stays editorial + neutral handoff only
   (no tickets/commission), consistent with guardrail #6/#8.
4. **Sourcing capacity:** who supplies the first verified entries (editorial
   visit vs official-site research), and at what volume?

---

*Nothing in this document has been implemented. It exists to be approved,
amended, or rejected before any schema or code work begins.*
