# SESSION 0 — AI DATA OPS

**Branch:** `loop/00-data-ops`  
**Working directory:** `otherbali-session-data-ops`  
**Baseline:** `51ab700` (implementation baseline `1d77f1e`)  
**Role:** research and structured content preparation only; no application or schema ownership.

## Mission

Prepare a source-backed Wave 1 dataset of real venue menus and action links while Sessions 1–4 build the product infrastructure. The result must be reviewable, import-ready, and safe to keep unpublished until the required verification and owner-consent gates are satisfied.

## Read before working

1. `AGENTS.md`
2. `Other_Bali_Master_Architecture.md`
3. `PARALLEL_LOOP_EXECUTION_PLAN.md`
4. `docs/DATA_OPS_TRACK.md`
5. `lib/contracts/menu-action.ts`
6. `lib/contracts/menu-action.fixtures.ts`
7. Existing venue data and launch/audit documents relevant to Canggu

Record a short discovery note in `docs/loop/handoffs/session-0.md` before collecting data.

## Hard ownership boundary

You may create or edit only:

- `data/data-ops/**`
- `docs/data-ops/**`
- `docs/loop/handoffs/session-0.md`

Do not edit application code, migrations, shared contracts, fixtures, root authority documents, the shared status board, or handoffs belonging to Sessions 1–4. If the contract cannot represent a verified fact safely, record a request in your handoff; do not change the contract yourself.

## Wave 1 scope

Build a first wave of 10–15 Canggu-area venues already present in the repository. Prefer venues that are important to the current product and have usable official menu sources. Do not invent venues or silently replace the founder's existing shortlist. If the repository contains multiple candidate lists, document the evidence used to choose the Wave 1 list.

Process venues incrementally. A fully evidenced venue is more valuable than several incomplete venues.

## Allowed sources

Use only source material that the venue or fulfilment provider officially controls:

1. venue's official website or official menu PDF;
2. venue's official booking/order/menu page;
3. venue's clearly identified official social account, only when the website is insufficient;
4. official TablePilot, WhatsApp, Google Maps, GoFood, or GrabFood destination for action-link verification.

Search results are discovery aids, not evidence. Do not use Google reviews, review prose, ratings, TripAdvisor, blogs, scraped menu aggregators, AI summaries, or unattributed reposts as factual sources.

## Collection rules

For every venue and every menu/action source, retain:

- canonical venue slug and displayed venue name;
- official source URL and human-readable source label;
- exact UTC `capturedAt` timestamp;
- `verifiedAt: null` until a human/operator or owner verifies it;
- menu title/version/status/expiry assumptions;
- section and item names as shown by the source;
- descriptions and prices only when explicitly present;
- currency and any availability wording;
- action kind, provider, destination URL, confirmation requirement, and evidence;
- collection notes, ambiguities, broken links, and missing fields.

Unknown values remain `null` or are omitted according to the frozen contract. Never infer allergens, dietary suitability, availability, service area, fees, popularity, or editorial recommendations. Do not set `partnerRecommended` or `editorialPick` without explicit approved evidence.

Preserve source wording for factual menu fields, but do not copy promotional essays or third-party prose. Validate links without completing reservations, orders, payments, messages, or any other external transaction.

## Photos and media

Do not publish or add venue photos to public product paths. Do not treat website availability as reuse permission. For Wave 1, record candidate official media URLs and provenance only in a private research manifest when useful. Mark every candidate `publicationAllowed: false` until versioned owner consent evidence exists. Never bypass access controls or download restricted assets.

## Required outputs

Create:

1. `data/data-ops/wave-1/venues.json` — machine-readable venue/menu/action drafts aligned as closely as possible with `lib/contracts/menu-action.ts`, plus provenance and review state;
2. `data/data-ops/wave-1/source-manifest.json` — every consulted source, capture timestamp, outcome, and venue mapping;
3. `docs/data-ops/wave-1-review.md` — concise operator review queue, missing evidence, ambiguities, stale/broken sources, and recommended next action per venue;
4. `docs/loop/handoffs/session-0.md` — progress, exact files, venues completed, validation performed, risks, contract gaps, and final commit SHA.

JSON must be valid, deterministic, and contain no secrets, tokens, personal contact details, copied reviews, or owner-consent claims that have not actually been obtained. A WhatsApp deep link may be recorded only when it is already an official public venue contact/action link; do not send a message.

## Validation

Before each commit:

- validate all JSON files;
- check required provenance fields and timestamps;
- check for duplicate venue slugs and duplicate item IDs within a menu;
- check that every factual record maps to a source-manifest entry;
- check that unverified records have `verifiedAt: null`;
- check that no photo is marked publishable without consent evidence;
- inspect the diff and confirm that only Session 0-owned paths changed.

## Loop and completion rule

Work in small loops of 2–3 venues. After each loop, update the handoff and commit the coherent result on `loop/00-data-ops`. Continue until 10–15 venues are complete or official evidence is genuinely unavailable. Do not fabricate data to reach the target.

The session is complete only when the outputs are committed, validation results are recorded, unresolved issues are explicit, and the handoff contains the final SHA for Session 1 and Session 4.
