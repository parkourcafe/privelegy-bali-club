# SERP Research Notes V0.1

**Observed:** 2026-07-29T18:58:09.068Z · live web search via the configured tool
**Researched:** 3 of 26 shortlisted candidates

## Method and its limits

Three candidates were researched against live SERPs. The remaining 23
carry `serp_status=UNKNOWN` and `serp_opportunity_score=0`. They are **not** scored low on merit —
they are unscored. Estimating them would breach `forbidden_behaviors: invent_evidence`.

**No search volume is recorded anywhere in this artifact.** No verified volume source was available,
so every `search_volume` cell reads `UNKNOWN` per `unknown_search_volume: UNKNOWN`.

## Findings

### OB-CAN-0011 — score 9/10

- **SERP intent:** commercial-investigational: pick a specific restaurant for a couple occasion
- **Content format:** editorial listicle (top-5 / top-10 / top-25) plus venue-owned pages
- **Interactive tools ranking:** NONE observed
- **Zero-click risk:** MODERATE — listicles attract featured snippets, but the choice itself needs a page visit
- **Cannibalization risk:** REAL — repo already exposes /bali/[district]/date-night via lib/intents.ts; a new tool must reuse that intent, not duplicate it
- **Seasonality:** UNKNOWN (no verified seasonality source)
- **Top URLs observed:**
  - https://sayanvalley.com/romantic-restaurants-in-ubud/
  - https://www.karolinagenova.com/bali-blog/romantic-restaurants-ubud
  - https://indonesia.tripcanvas.co/bali/ubud-restaurants/
  - https://thesamaya.com/ubud/dining
  - https://www.kubuatmandapa.com/

No interactive decision tool ranks at all; the entire first page is static editorial and venue marketing. This is squarely Other Bali's owned territory (selection, editorial verdict, Best for / Not ideal for). Held at 9 not 10 because listicle incumbency is strong and cannibalization against the existing date-night spoke is real.

### OB-CAN-0007 — score 6/10

- **SERP intent:** local-practical: find somewhere actually open at a specific early hour
- **Content format:** single venue running programmatic SEO against the exact query, plus individual venue pages
- **Interactive tools ranking:** NONE observed
- **Zero-click risk:** HIGH — Google Maps answers "open now" natively without a click
- **Cannibalization risk:** LOW — no existing Other Bali route owns opening-hours filtering
- **Seasonality:** UNKNOWN (no verified seasonality source)
- **Top URLs observed:**
  - https://loopbali.com/early-morning-coffee-canggu
  - https://loopbali.com/breakfast-canggu
  - https://www.kayumacoffee.com/
  - https://local-coffee.goto-where.com/

No tool ranks, and the top result openly admits "hours can drift, check Google Maps on the morning you go", which is a genuine freshness gap Other Bali's last_verified_at could close. Scored only 6 because zero-click risk is high and opening-hours filtering sits adjacent to AGENTS.md guardrail 1 (no Google Maps clone).

### OB-CAN-0018 — score 5/10

- **SERP intent:** commercial-investigational: pick a cafe to work from today
- **Content format:** structured comparison tool plus long-form listicle
- **Interactive tools ranking:** YES — geronimo-ai.com ranks a comparison tool with per-cafe work scores, measured WiFi Mbps and feature tables
- **Zero-click risk:** MODERATE
- **Cannibalization risk:** REAL — repo exposes /bali/[district]/work-cafe via lib/intents.ts
- **Seasonality:** UNKNOWN (no verified seasonality source)
- **Top URLs observed:**
  - https://geronimo-ai.com/best-cafes/bali-canggu/ruko-cafe
  - https://geronimo-ai.com/best-cafes/bali-canggu/amolas
  - https://baliuntold.com/destinations/canggu/laptop-friendly-cafes/
  - https://loopbali.com/work-friendly-cafe-canggu

An interactive tool already occupies this SERP and competes on measured WiFi speed, a datum Other Bali does not hold and cannot invent. Entering here would mean losing on the incumbent's axis.


## Cross-cutting observation

The decisive difference between these three is **whether an interactive tool already ranks**.

For romantic dinner in Ubud the entire first page is static editorial and venue marketing, and the
job is an editorial-verdict decision — the exact territory `AGENTS.md` §5 assigns to Other Bali
("selection · editorial verdict · Best for / Not ideal for").

For laptop-friendly cafés an incumbent tool already competes on measured WiFi throughput, a datum
Other Bali does not hold. Competing there would mean losing on the incumbent's axis or inventing
measurements.

For early breakfast the gap is real — the top-ranking page itself tells readers to re-check Google
Maps because hours drift — but the job sits close to guardrail 1 (no Google Maps clone) and carries
high zero-click risk because Maps answers "open now" natively.
