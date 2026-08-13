# Ubud unified cluster decision — scenario-layer addendum

Date: 2026-08-13. Addendum to `UBUD_UNIFIED_CLUSTER_DECISION_V1.md` (2026-07-23),
which remains the sole decision for the pillar, itinerary, culture-day and
comparison topics it already resolved. This addendum is the sole decision for
the 20 intent owners (I01–I20) and 17 scenarios (S01–S17) proposed in the
externally-built `OtherBali_Ubud_48_to_Scenarios_Registry.xlsx` /
`_Architecture_and_Implementation_Plan.docx` (2026-08-12), reconciled against
the live repository rather than built in isolation from it.

## Method

Every `PROPOSED` route in the source registry was checked against three
things: (1) does a live canonical already own this decision, (2) does the DB
already hold the evidence (`jobs`/`practical_tags`) a module would need, (3)
does V1 already rule on this topic. Per pipeline operating rules: prefer
UPDATE/MERGE over CREATE, HOLD blocked topics without blocking independent
ones, and no claim ships without a source. AI output (the source registry
itself) is not evidence — it is a hypothesis set, checked here against real
migrations and real page code, not accepted at face value.

## Status vocabulary

Same as V1/governance.md: `P0_UPDATE`, `P0_CREATE`, `P1_UPDATE`, `P1_CREATE`,
`MERGE_INTO_EXISTING`, `HOLD`, `REJECT`. Two additions specific to this
addendum's dependency chain: `DONE` (shipped in the 2026-08-12 pilot) and
`HOLD (schema gap)` (blocked on a DB field/tag that doesn't exist yet, not on
a data-collection pass against an existing field).

## Done

| ID | Topic | Canonical | What shipped |
|---|---|---|---|
| I01 | Work-friendly cafés | `/ubud/best-cafes-coffee` | "Laptop-friendly" module, filtered on the real `quiet_work_cafe` job tag (0024 pass). No wifi/socket/call claims. |
| I03 | Long-stay laptop cafés | same module | Folded into I01's module — the DB has no separate max-stay/min-spend field yet (see EV03 below), so this stays a single module, not a duration sub-filter. |
| S01 | Remote work day | `/route/ubud-remote-work-day` | Three real stops (seniman-coffee-studio, anomali-coffee-ubud, bali-buda-ubud), all `quiet_work_cafe`-tagged. |

## P1_UPDATE — evidence-ready now, not yet built

| ID | Topic | Target canonical | Real DB evidence | Gap before shipping |
|---|---|---|---|---|
| I04 | Date-night restaurants | `/ubud/best-restaurants` (module, mirrors I01's pattern) | 8 published Ubud restaurants already carry `date_night_special` and/or `special_occasion`: cascades, donna-ubud, hujan-locale, laka-leke, locavore-nxt, mozaic, room4dessert, whos-who (0024 pass) — well past the plan's own 5-venue bar | None to ship the base module. EV04 (noise by daypart) and EV15 (events schedule) needed only for richer "quiet enough to talk" / "which night has music" claims — omit those claims until then. |
| I05 | Anniversary / special occasion | sub-module within the I04 module (not a separate URL — matches V1's "module, not standalone" scoping) | Same 8 venues; `special_occasion` present on 6 of them | No booking-reliability or cancellation-policy claim without EV10 confirmation. |

**Recommendation:** this is the strongest next-pilot candidate — same shipped pattern as I01 (additive module on an existing canonical, real job-tag evidence, zero new claims). Flagging for the next authorized build round; not built in this pass per the "decision document only" scope agreed for this addendum.

## P0_CREATE-eligible, deferred to next build round

| ID | Topic | Shape | Why it's ready | Why deferred here |
|---|---|---|---|---|
| S08 | Local-food crawl (warungs) | `/route/ubud-<slug>`, same entity as S01/culture-day | `/ubud/best-warungs` already exists and is already populated with real, editorially-verified warung venues (why_its_here/what_to_order) — a route just sequences 2–3 of them | This addendum's scope is decisions, not builds; also depends on I10's REJECT below, which retargets its "guide" half onto the existing canonical first |

## Reject — duplicates a live canonical or contradicts V1

| ID | Topic | Proposed route | Why rejected |
|---|---|---|---|
| I10 | Local warungs | `/ubud/warungs-local-food` | `/ubud/best-warungs` already exists, is indexed, and already owns exactly this intent (lede: "Beyond the health cafés, Ubud has honest, affordable warungs..."). A second URL would cannibalize it. Any deepening is a content refresh of the existing page, not a new owner. |
| I11 | Kid-friendly restaurants | `/ubud/restaurants-with-kids` | Directly contradicts V1's decided row: "With kids — MERGE_INTO_EXISTING `/ubud` — field-verified caveat only; no standalone URL." V1 stands. |
| I12 | Toddler/stroller module | `I11#toddler` | Inherits I11's rejection — no standalone URL; folds into the same `/ubud` merge caveat once EV08 exists. |

## Hold — evidence backlog (existing field, not yet collected/verified)

| ID | Topic | Blocked on | Earliest unblock |
|---|---|---|---|
| I02 | Video-call spots (module on I01) | EV05 (video-call suitability: field audit + owner, separate zone/acoustics/background) | Field visit to the I01 candidate set (seniman-coffee-studio, suka-espresso-ubud, alchemy, per the source registry's own "Candidate evidence" sheet) |
| I06 | Sunset dinner | EV14 (view direction + seating, field audit) | Field visit; a generic "sunset" homepage moment does not establish a real view |
| I07 | Business-meeting places | EV04 (noise by daypart) | Field audit of 3–5 candidates |
| I08 | Team offsite (module on I07) | EV04 + EV10 (capacity/deposit/cancellation) | Same as I07, plus official booking contact |
| I09 | Cheap eats | EV12 (current menu prices/portions as numeric bands) | A pricing data-ops pass on Ubud warungs/restaurants (see `.agents/skills/otherbali-data-ops-run`) |
| I18 | Late-night food | EV06/EV07 (kitchen hours vs. bar hours; live open-now status) | No live-hours infrastructure exists for Ubud in this repo — this is an engineering dependency, not only a content one (see below) |
| I19 | Dinner + drinks | EV15 (events/music schedule, not generalized from one evening) | Official schedule source per venue |
| I20 | Group/birthday dining | EV10 (capacity/deposit/cancellation) | Milk & Madu Ubud already states group booking up to 20 on its live page (partial evidence) — official contact still needed for deposit/cancellation terms before any claim |

## Hold — schema gap (no field exists yet to collect against)

| ID | Topic | Missing field | Note |
|---|---|---|---|
| I13 | Vegan/vegetarian | No vegan/vegetarian job tag in the current 9-slug vocabulary (`quiet_work_cafe, brunch_after_surf, local_food_calm, date_night_special, special_occasion, sunset_drinks_view, group_dinner_share, family_early_dinner, just_landed_easy_dinner`) | Needs a vocabulary decision (new job slug or a separate `dietary_tags` column) before any data-ops pass — cross-session schema request, not a content task |
| I14 | Healthy food | Same — no "healthy" tag; `/ubud/best-yoga-wellness` is wellness, not food | Same schema request as I13 |
| I16 | Specialty coffee (module on `/ubud/best-cafes-coffee`, alongside the shipped I01 module) | No roast/brew-method/retail-beans field on `venues` | EV13 requires this before a distinct "specialty coffee" filter can be honest — right now the page can only show category, not product depth |
| I17 | Local roasters (module on I16) | Same as I16 | — |

## Hold — architecturally blocked (infra, not content)

| ID | Topic | Blocker |
|---|---|---|
| I18 / S15 | Late-night food / late-arrival plan | No dynamic/live-hours pipeline in this repo for any district. Static "kitchen hours" text would go stale and, per the source registry's own warning, "stale data делает страницу вредной." Do not build a static approximation of this page — it is a capability gap, escalate if prioritized. |

## Reject / escalate — high-stakes, do not build under this pipeline

| ID | Topic | Disposition |
|---|---|---|
| I15 / S13 | Dietary restrictions & allergies | Matches the source registry's own `DO NOT PUBLISH until evidence workflow approved`. This is not an SEO-pipeline evidence gate — it needs a dedicated allergy/cross-contact verification workflow decided at the architecture level (AGENTS.md §20: escalate rather than improvise on anything allergy-adjacent). Recommend Selena decide this outside the district pipeline before it re-enters the queue. |

## Scenario layer (S02–S17) — status inherited from parent intent owner

Every scenario's readiness is capped by its parent intent owner(s); a scenario
cannot be `P0_CREATE`-ready while its parent is `HOLD`.

| ID | Scenario | Parent(s) | Status | Note |
|---|---|---|---|---|
| S02 | Romantic evening / first date | I04 (P1_UPDATE, evidence-ready) | HOLD | Build the I04 module first; a route needs the module's venues live to sequence, same dependency order as S01 needed the I01 module |
| S03 | Anniversary evening | I05 | HOLD | Same chain as S02, plus EV10 |
| S04 | Sunset date | I06 (HOLD, EV14) | HOLD | — |
| S05 | Business meeting day | I07 (HOLD, EV04) | HOLD | — |
| S06 | Team offsite half-day | I08 (HOLD, EV04+EV10) | HOLD | — |
| S07 | Budget food day | I09 (HOLD, EV12) | HOLD | — |
| S08 | Local-food crawl | I10 (REJECT as standalone, but `/ubud/best-warungs` already live) | **P0_CREATE-eligible** | See "deferred to next build round" above — the one scenario not gated by its parent's rejection, since the parent canonical already exists |
| S09 | Easy family food day | I11 (REJECT/MERGE) | HOLD | Source registry marks this `DRAFT READY`; not accepted here — EV08/EV09 field audit not done, and an AI-assigned "ready" status is not evidence per this pipeline's rules |
| S10 | Toddler-friendly half-day | I12 | HOLD | Explicitly blocked in the source registry too (physical access audit) |
| S11 | Vegan day | I13 (HOLD, schema gap) | HOLD | — |
| S12 | Healthy/wellness food day | I14 (HOLD, schema gap) | HOLD | — |
| S13 | Dietary-safe eating plan | I15 | **REJECT/ESCALATE** | See above |
| S14 | Specialty coffee morning | I16/I17 (HOLD, schema gap) | HOLD | — |
| S15 | Late-arrival food plan | I18 (HOLD, infra gap) | HOLD | — |
| S16 | Dinner-to-night | I19 (HOLD, EV15) | HOLD | — |
| S17 | Birthday night for ten | I20 (HOLD, EV10) | HOLD | Milk & Madu Ubud is a partial real candidate; night/music fit still unconfirmed |

## Recommended build queue (next authorized rounds, in order)

1. **I04 + I05** — date-night module on `/ubud/best-restaurants`. Same shipped pattern as I01, evidence already exceeds the plan's own bar (8 real venues vs. the 5-venue minimum it set for S01).
2. **S08** — `/route/ubud-<local-food-crawl-slug>`, once I10's "reject as standalone, reuse best-warungs" is accepted; same route pattern as S01/culture-day.
3. **S02** — romantic-evening route, once the I04 module is live (needs its venue set to sequence from).
4. Everything else stays `HOLD` until its named evidence (EV0x), schema field, or infrastructure gap closes — re-run this addendum's relevant section when one does, rather than re-deciding from scratch.

## Cross-session / schema requests

These are requests for the migration-owning session, not actions taken here
(this addendum does not modify schema):

- A vegan/vegetarian/dietary job tag or `dietary_tags` column (blocks I13/I14/S11/S12).
- A coffee product field set — roast/brew methods/retail beans (blocks I16/I17/S14).
- A live/dynamic-hours capability, district-agnostic (blocks I18/S15 everywhere, not just Ubud).

## Constraints carried forward from V1

No HOLD topic is built. No claim ships without a source. `/ubud` itself stays
untouched beyond V1's already-approved claim ledger. No other district is
touched. No production deployment or migration apply from this addendum
(none is needed — it makes no schema or content change by itself).
