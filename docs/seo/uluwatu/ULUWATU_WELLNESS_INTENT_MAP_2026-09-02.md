# Uluwatu wellness intent map — 2026-09-02

Pipeline phase 2, run for one topic the 2026-07-23 Uluwatu cluster never
evaluated: yoga, pilates and studio wellness. The July artifacts cover food,
sunset, beaches, stay and itinerary. `ULUWATU_UNIFIED_CLUSTER_DECISION_V1.md`
contains no occurrence of wellness, yoga, pilates, spa, gym or fitness. This is
an unexamined topic, not a rejected one.

## Evidence source

Google Search Console API, property `https://www.otherbali.com/`, window
2026-06-01 → 2026-08-30. This is the first run of the pipeline with real GSC
data: the July artifacts and the OS registry record `needs_gsc_review` and
`editorial_hypothesis` precisely because no window was mature enough then.

Two things this run could NOT do, recorded as gates rather than guessed:

- **Live SERP inspection.** Outbound access to Google Search and to
  otherbali.com is blocked by the execution environment's network policy.
  Competitor page types below are inferred from our own positions only.
- **Venue evidence.** No database access in this session, so no drop-in prices,
  timetables or verification dates could be read.

## Measured demand — category queries (no venue name)

| Query | Impressions | Avg position | Clicks |
| --- | --- | --- | --- |
| yoga in uluwatu | 56 | 58 | 0 |
| yoga uluwatu | 55 | 58 | 0 |
| uluwatu yoga | 52 | 63 | 0 |
| yoga class uluwatu | 51 | 46 | 0 |
| yoga uluwatu bali | 49 | 59 | 0 |
| uluwatu yoga classes | 48 | 55 | 0 |
| reformer pilates uluwatu | 46 | 27 | 0 |
| reformer pilates bingin | 45 | 19 | 0 |

Wellness as a whole (gym, fitness, pilates, yoga, spa, recovery) is **6 484
impressions, 18 % of all site impressions, 5 clicks** in the window. The
Uluwatu-scoped subset is 139 queries and 2 675 impressions.

## The finding: self-cannibalization on an unowned intent

No page owns these queries, so Google matches individual venue cards, and
several of ours compete for the same query.

| Query | Pages we surface | Positions |
| --- | --- | --- |
| yoga uluwatu | `/places/morning-light-yoga`, `/places/the-istana-yoga`, `/places/ulu-yoga-bali` | 87, 68, 81 |
| yoga class uluwatu | `/places/morning-light-yoga`, `/places/reform-uluwatu`, `/places/the-istana-yoga` | 80, 93, 51 |
| reformer pilates uluwatu | `/places/reform-pilates-bali`, `/places/reform-uluwatu`, `/places/reform-pilates-bingin` | 29, 22, 50 |
| reformer pilates bingin | `/places/reform-pilates-bali`, `/places/reform-pilates-bingin`, `/places/reform-uluwatu` | 20, 18, 39 |

A single-venue card cannot answer "which yoga in Uluwatu". Three cards splitting
one query is the textbook signal that the category page is missing.

## Comparison: districts where the category page exists

| Page | Avg position |
| --- | --- |
| `/jimbaran/spas-wellness` | 16 |
| `/ubud/best-yoga-wellness` | 18 |
| `/canggu/best-spas` | 58 |
| Uluwatu — no page; venue cards only | 68–87 |

Same site, same authority, same template. Where the page exists the position is
16–18; where it does not, 68–87. Canggu at 58 is the competitive-query case
("best spa canggu" is a contested head term), which is why the recommendation
below is scoped to the thin pilates/yoga tail rather than a broad "best spas".

## Why this niche and not "best restaurants"

The site's restaurant category queries sit at positions 51–65 across the board
(`restaurants in bali` 55, `best restaurant ubud` 62, `best restaurants in bali`
58). The pilates queries already sit at 19–29 with no dedicated page at all.
Same domain strength; the difference is competitive density. Investment belongs
where the field is thin.

## Intent candidates

| Topic | Primary user decision | Nearest existing owner |
| --- | --- | --- |
| Yoga & pilates studios | Which Uluwatu studio to drop into, at what price, on what timetable | none — unowned |
| Day spas & massage | Which Uluwatu spa for a treatment | none — unowned; `/best-spas-in-bali` is Bali-wide |
| Gyms & drop-in fitness | Where to train on a short stay | none — unowned |

Only the first is carried to a decision in this run. The other two are recorded
so a later run does not treat them as new discoveries.
