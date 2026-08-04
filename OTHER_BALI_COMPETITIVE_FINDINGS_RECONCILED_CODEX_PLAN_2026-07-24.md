# Other Bali — Reconciled Competitive Findings Implementation Plan for Codex

**Version:** 1.0  
**Date:** 24 July 2026  
**Status:** EXECUTION-READY ADDENDUM  
**Public product language:** English  
**Internal reports:** Russian  

---

## 0. Purpose

This document reconciles the competitive-audit pack with the accepted Other Bali architecture.

It is **not a new independent roadmap**.

It does not replace:

1. the canonical decision log;
2. Unified Master v3.2;
3. Data Dictionary;
4. Taxonomy;
5. Migration Map;
6. Public Experience Architecture v1.1;
7. the existing T0–T10 execution sequence;
8. Launch Stabilization requirements.

Its purpose is to convert validated competitive findings into changes carried by existing workstreams, without creating a second architecture, changing the money model silently, breaking URLs, or turning Other Bali into a directory, discount card, review platform, or booking marketplace.

---

# 1. Executive verdict

```text
COMPETITIVE_AUDIT_STATUS: USEFUL_BUT_PARTIAL
IMPLEMENTATION_STATUS: READY_AFTER_RECONCILIATION
NEW_INDEPENDENT_ROADMAP: FORBIDDEN
POSITIONING_CHANGE_REQUIRED: NO
POSITIONING_CLARIFICATION_REQUIRED: YES
MONEY_MODEL_CHANGE_ALLOWED: NO
```

## Main conclusion

Other Bali should not compete by offering:

- the largest venue database;
- the most discounts;
- the largest review volume;
- the widest booking inventory;
- the greatest number of articles.

The defensible product position remains:

> **Other Bali is the Bali decision layer: it turns tourist uncertainty into a short, trusted next step.**

The competitive audit confirms that Other Bali’s strongest opportunity is the missing layer between inspiration and transaction:

```text
situation
→ short choice
→ reason and trade-off
→ trusted next action
```

The execution priority is therefore not feature accumulation. It is making the existing decision promise visible, short, visual, trustworthy and operational.

---

# 2. Source hierarchy

When instructions conflict, use this order:

1. Canonical Decision Log
2. Unified Master v3.2
3. Data Dictionary / Taxonomy / Migration Map
4. Public Experience Architecture v1.1
5. Launch Stabilization brief and accepted T0–T10 sequence
6. This reconciled competitive addendum
7. Individual competitive-audit files
8. Live page copy and local implementation

Competitive observations may recommend a change, but they may not silently override an accepted decision.

Any conflict with levels 1–5 must be reported as:

```text
CANON_CONFLICT
Requires explicit Decision Log amendment
Do not implement automatically
```

---

# 3. Audit-pack reliability assessment

## 3.1. Files accepted as useful evidence

- `OTHER_BALI_COMPETITOR_LANDSCAPE.md`
- `OTHER_BALI_COMPETITOR_EVIDENCE_REGISTER.csv`
- `OTHER_BALI_VISUAL_COMPETITOR_AUDIT.md`
- `OTHER_BALI_FEATURE_GAP_MATRIX(1).csv`
- `OTHER_BALI_POSITIONING_RECOMMENDATION.md`
- `OTHER_BALI_30_DAY_COMPETITIVE_UPGRADE_PLAN.md`

## 3.2. Scorecard limitation

`OTHER_BALI_COMPETITOR_SCORECARD.csv` contains a structural CSV defect:

- the final descriptive evidence text is stored under `ability_to_scale_across_bali`;
- `evidence_note` is empty;
- scores for blocked or non-live-tested products are mixed with live-tested scores;
- grouped product classes are scored as if they were individual products.

Therefore:

```text
SCORECARD_STATUS: DIRECTIONAL_ONLY
DO_NOT_USE_FOR_PUBLIC_CLAIMS
DO_NOT_TREAT_AS_STATISTICALLY_PRECISE
```

Before using the scorecard in future reporting:

1. repair the shifted columns;
2. add `evidence_quality`;
3. add `live_test_status`;
4. distinguish individual products from grouped classes;
5. downgrade confidence for blocked, timeout and non-live-tested products.

## 3.3. Evidence labels

Every claim derived from the pack must retain one of:

- `LIVE_BROWSER`
- `USER_PROVIDED_SOURCE`
- `PARTIAL_LIVE_BROWSER`
- `BLOCKED`
- `TIMEOUT`
- `NOT_LIVE_TESTED`

No recommendation may imply that blocked or untested products were fully audited.

---

# 4. Fixed product boundaries

Codex must preserve all of the following.

## 4.1. Other Bali is not

- a paid tourist membership;
- a physical card;
- a discount-first product;
- an A–Z directory as the main experience;
- a review-ranking site;
- a full booking marketplace;
- a generic AI concierge;
- a paid organic-ranking system.

## 4.2. Tourist promise

```text
The right place for the moment you're in.
```

Supporting product promise:

```text
Choose the right Bali place, area or day plan — without endless lists.
```

## 4.3. Decision standard

Every public surface must answer within 10–30 seconds:

1. What decision is this page helping me make?
2. Why should I trust this recommendation?
3. What should I do next?

## 4.4. Navigation

Primary surfaces remain:

```text
Today
Explore
Plan
Saved
```

Do not add top-level navigation for:

- Beauty;
- Fitness;
- Kids;
- Nightlife;
- Shopping;
- Visa;
- Delivery;
- Hookah;
- Tattoo;
- Rental;
- Member Benefits.

These may exist as taxonomic filters, practical pages or scenario shortcuts only where supported by real decision value and verified data.

## 4.5. Ranking trust

Organic recommendation cannot be bought.

Sponsored or commercial surfaces, if present, must be clearly separated and labelled.

Confirmed extras may never affect:

- best-choice selection;
- organic rank;
- editorial inclusion;
- `Best for` claims.

---

# 5. Competitive findings accepted into the product

## Accepted without strategic change

1. Explain the product mechanism in four short steps.
2. Convert Today output to a short triptych.
3. Add issue reporting to place pages.
4. Simplify venue claim/update entry.
5. Establish an honest media-placeholder policy.
6. Add filtered maps only after narrowing.
7. Expose freshness as product UI.
8. Add source-labelled short venue video.
9. Demonstrate villa/hotel QR distribution visually.
10. Show an evidence-safe partner-report example.

## Accepted after correction

1. Trust strip.
2. Confirmed extras.
3. Positioning wording.
4. Freshly checked module.
5. Quantitative social proof.

## Rejected

1. Paid tourist card.
2. Physical card logistics.
3. Discount-first home page.
4. Featured paid partners in organic results.
5. Full booking marketplace.
6. Public reviews as ranking basis.
7. A–Z directory as primary navigation.
8. Unbounded AI assistant.
9. Static trust statistics manually embedded in copy.
10. A new parallel 30-day roadmap.

---

# 6. Canonical execution sequence

## Gate 0 — T0 remains first

No competitive feature implementation starts before documented T0 diagnostics confirm:

- route inventory;
- canonical URLs;
- redirects;
- sitemap state;
- indexability;
- publication state;
- live data fields;
- action-link types;
- analytics events;
- existing components;
- existing media fields;
- existing claim/update flows;
- existing map components;
- current consent and guest-save behaviour.

T0 must produce a reusable implementation map:

```text
finding
→ existing component / route / table
→ reuse or modification
→ migration needed?
→ regression risk
→ acceptance test
```

No duplicate route, table or component may be introduced where a canonical equivalent exists.

---

# 7. Reconciled task map

## T1 — Homepage decision proof

### 7.1. Preserve accepted hero

Use the accepted hero structure:

```text
Eyebrow:
The right place for the moment you're in.

H1:
Choose the right Bali place, area or day plan — without endless lists.

Primary CTA:
Find a place for today

Secondary CTA:
Plan my Bali trip
```

Do not replace the hero with the competitive-audit phrase containing bare `resident-curated`.

`Resident-curated` is permitted only next to an explanation of the editorial process.

### 7.2. Product demo

Implement or preserve `Try a Bali decision`.

The demo must use real published content and must show:

```text
situation
→ three useful paths or choices
→ why each fits
→ one next action
```

No volatile fact may be asserted without evidence.

### 7.3. How Other Bali works

Add immediately after the product demo, unless usability review shows that the two blocks duplicate each other excessively.

Copy:

```text
How Other Bali works

1. Tell us your moment
Choose your area, company, mood and timing.

2. Get a short choice
See a few places or plans that actually fit.

3. Understand the trade-offs
See why it fits, when it does not and what to check.

4. Save it or go
Add it to My Bali, open Maps or use a verified official action.
```

### 7.4. Trust strip

Do not hardcode:

```text
518 places
16 districts
official actions verified
```

Use one of two safe modes.

#### Mode A: non-numeric

```text
Selected, not exhaustive
No paid organic ranking
Official actions shown only when verified
Unknown stays unknown
```

#### Mode B: dynamic numeric

Numbers must be queried from canonical data:

```text
{published_place_count} published places
{published_area_count} Bali areas
```

Dynamic counts must update automatically and must have regression tests.

### Acceptance criteria

- hero communicates product in five seconds;
- exactly two tourist CTAs;
- partner entry remains secondary;
- no unsupported social-proof claim;
- no duplicate explanatory sections;
- all demo links resolve directly to canonical targets;
- mobile first viewport remains usable.

---

## T4 — Today / My Day decision engine

### 7.5. Visible selected state

Always display:

```text
Your shortlist:
[Area] · [Company] · [Mood] · [Budget] · [Ending]
```

### 7.6. Exactly three result roles

Primary output must contain no more than:

1. Best first choice
2. Backup nearby
3. Something different instead

Each card must contain:

- Why this fits
- Not ideal if
- Check before going
- Next action
- media or an honest media state
- verified-action status

### 7.7. No hidden cross-district filling

If the selected district does not contain enough decision-ready results:

- do not silently fill with another district;
- show a truthful empty or partial state;
- offer an explicitly labelled nearby alternative.

### 7.8. Map behaviour

Do not build a general pin map.

Map is shown only after results exist and contains only:

- the three result cards;
- or the filtered shortlist explicitly selected by the user.

### Acceptance criteria

- output changes with selected filters;
- no more than three primary recommendations;
- Sanur family test passes;
- Uluwatu couple/view/sunset test passes;
- empty-state test passes;
- no `open now` unless current verified hours are available;
- Maps action is entity URL or labelled search;
- mobile output remains scannable without long lists.

---

## T3 + T4 — Place-page trust and decision layer

### 7.9. Canonical page order

1. Hero media or honest pending state
2. Decision summary
3. Best for / Not ideal if
4. Why go
5. What to check before going
6. Official actions
7. Confirmed extra, if eligible
8. Last checked / owner confirmed
9. Something changed?
10. Plan around it
11. Similar choices

### 7.10. Honest media policy

Allowed states:

```text
Original media by Other Bali
Venue-provided media
Creator contribution
Media pending · verified details only
```

Do not use decorative placeholders that look like missing proof.

### 7.11. Something changed?

Add an issue CTA with prefilled:

- venue name;
- canonical page URL;
- issue category.

Categories:

- Wrong hours
- Broken Maps link
- Booking or WhatsApp link does not work
- Place appears closed
- Confirmed extra not recognised
- Other

Support boundaries must be visible:

- Other Bali corrects information and verifies handoffs;
- Other Bali does not own external refunds, cancellations or booking disputes.

### 7.12. Confirmed extras

Implement only after confirming canonical offer fields and operational ownership.

Required fields:

- benefit text;
- conditions;
- start/end dates where applicable;
- confirmation source;
- confirmed date;
- venue;
- status;
- redemption method;
- expiry or review date.

Public block:

```text
A confirmed extra

[Benefit]

Confirmed by the venue: [date]
Conditions: [conditions]

[Use this extra]
```

Rules:

- no ranking effect;
- no publication without venue confirmation;
- expired or stale extras auto-hide;
- conditions appear before activation;
- public copy must not imply membership.

### Acceptance criteria

- every displayed action has a valid action type;
- unknown remains explicit;
- last checked is visible where available;
- issue report opens with correct page context;
- media provenance is visible;
- confirmed extras cannot affect ranking queries.

---

## T6 — Venue partner experience

### 7.13. Quick claim/update entry

First step:

```text
Is your place already on Other Bali?

Place name
WhatsApp

[Find my page]
```

Second path:

```text
Not listed yet?

[Request editorial review]
```

Do not remove verification. The two-field step begins the flow; it does not grant edit access.

### 7.14. Claim verification

Prevent:

- unauthorised claims;
- duplicate claims;
- duplicate venues;
- branch collisions;
- edits without audit trail.

Use existing auth, evidence and publication mechanisms where available.

### 7.15. Partner report sample

Show a clearly labelled fictional or aggregated example.

Allowed metrics only when already tracked:

- page views;
- saves;
- Maps clicks;
- WhatsApp clicks;
- booking-action clicks;
- menu clicks;
- freshness status;
- owner-confirmed status.

Do not claim:

- visits;
- seated guests;
- bookings;
- revenue;
- redemptions;

unless the event and attribution are actually captured.

### 7.16. Money model conflict rule

The competitive pack proposes a broad paid B2B layer.

The accepted PEA states:

```text
fixed fee per confirmed seated reservation
```

Codex must not invent a new billing model.

If the live product and canonical architecture still conflict, output:

```text
MONEY_MODEL_CONFLICT
No commercial copy changed
Decision Log amendment required
```

### Acceptance criteria

- venue can begin with two fields;
- no unauthorised edit path;
- duplicate branch handling exists;
- report sample uses only real event definitions;
- organic ranking independence is explicit;
- money-model copy matches canonical decision or is blocked.

---

## T8 — Visual decision components

### 7.17. Reuse visual primitives

Prefer extending existing components:

- `DecisionDemo`
- `ResultTriptych`
- `ItineraryTimeline`
- media gallery
- filter summary
- freshness badge
- action status
- map snippet

Do not create a competing component family with slightly different names and contracts.

### 7.18. Fifteen-second venue video

Add only where media provenance is stored.

Public label:

```text
See it in 15 seconds
```

Video should communicate:

- arrival;
- space;
- density/noise;
- seating;
- key view or activity;
- realistic atmosphere.

Do not label venue advertising as independent Other Bali editorial footage.

### Acceptance criteria

- provenance displayed;
- poster image available;
- mobile performance budget respected;
- no autoplay with sound;
- fallback works without video;
- rights status stored.

---

## B-track — Villa and hotel distribution

### 7.19. Demo before platform expansion

Build a visual demo using a real or clearly labelled sample property.

Guest entry:

```text
Welcome to [area]

Your first easy day
Breakfast nearby
Sunset and dinner
Rainy backup
With kids
No-scooter plan
Property contact
```

### 7.20. Distribution, not accommodation inventory

Villas and hotels are distribution partners.

Do not:

- turn the QR guide into a hotel booking catalogue;
- fake concierge endorsements;
- rank venues based on villa payment;
- expose guest-identifiable data to unrelated venues.

### 7.21. Reporting

Use anonymous aggregate source attribution:

- QR scans;
- landing sessions;
- route opens;
- saves;
- official-action clicks.

### Acceptance criteria

- QR resolves to property-context page;
- property identity is visible;
- recommendations remain editorially independent;
- property contact fallback is available;
- privacy boundaries are documented;
- source attribution is recorded.

---

## F-track — Freshness and QA

### 7.22. Freshly checked

Add only when freshness status is generated from canonical fields.

Card requirements:

- last checked date;
- what was checked;
- owner-confirmed state if applicable.

Do not label a place `Freshly checked` because its page was merely edited.

### 7.23. QA row extensions

Add or verify:

```text
media_status
media_provenance
last_checked
owner_confirmed
action_status
confirmed_extra_status
issue_count
issue_last_received
claim_status
```

### 7.24. Public claim scan

Block prohibited claims:

- verified, without status/date;
- open now, without verified current hours;
- official Maps, for search URLs;
- resident-curated, without process explanation nearby;
- family-friendly, without evidence;
- walkable, without transport evidence;
- book now, without official booking path.

---

# 8. Priority classification

## P0 before serious marketing

These are not all new features. Several are completion work for existing accepted requirements.

1. Finish T0 diagnostics.
2. Complete Today best/backup/contrast.
3. Enforce honest media states in top modules.
4. Add issue reporting to place pages.
5. Add quick claim/update entry.
6. Ensure homepage product mechanism is immediately understandable.
7. Correct unsafe trust claims.
8. Resolve or block money-model copy conflict.

## P1 after P0 passes

1. Filtered shortlist map.
2. Freshly checked.
3. Source-labelled short venue video.
4. Villa QR guest-guide demo.
5. Partner report sample.
6. Confirmed extras, only with complete data and operations.

## P2 later

1. Offline saved list.
2. Multilingual rollout.
3. AI planner on verified structured data.
4. Events, only with freshness operations.
5. Practical Bali service layer.

---

# 9. Explicit non-goals

Do not implement in this sprint:

- a paid tourist plan;
- card payment for tourist membership;
- Apple/Google Wallet membership card;
- physical card delivery;
- reward points;
- broad loyalty programme;
- user-review collection;
- public star ranking;
- full booking checkout;
- cancellation or refund management;
- uncontrolled AI recommendations;
- island-wide events inventory;
- broad service marketplace;
- new top-level navigation categories;
- paid placement in Today recommendations.

---

# 10. Required regression tests

## Homepage

- exactly two primary tourist CTAs;
- secondary venue entry remains visible;
- dynamic counts cannot render stale hardcoded values;
- all demo links resolve to canonical pages;
- mobile first screen is unobstructed.

## Today

Test at minimum:

1. Uluwatu · Couple · A view · Sunset
2. Sanur · Family · Quiet · Mid-range · Early night
3. Ubud · Solo · Reset · Mid-range · Something special
4. district with insufficient decision-ready data
5. no results
6. browser back/forward state
7. refresh with URL/state persistence if supported

## Place pages

- known vs unknown price;
- verified Maps entity vs labelled search;
- official booking vs no official booking;
- media available vs media pending;
- confirmed extra active vs expired;
- issue-report context;
- owner-confirmed vs not confirmed.

## Venue claim

- existing exact match;
- spelling variation;
- duplicate branch name;
- unauthorised claimant;
- already claimed venue;
- new venue request.

## Villa QR

- valid property source;
- unknown property;
- expired QR;
- privacy and analytics events;
- property contact fallback.

---

# 11. Analytics requirements

Use canonical event names where already defined.

Minimum event coverage:

- homepage decision-demo action;
- Today filters submitted;
- Today result viewed;
- Today best/backup/contrast clicked;
- item saved;
- item added to trip;
- Maps clicked;
- WhatsApp clicked;
- booking action clicked;
- issue report opened;
- issue report submitted;
- venue claim started;
- venue claim completed;
- confirmed extra opened;
- confirmed extra used or redemption recorded, only if real;
- villa QR landing;
- villa route opened.

Do not rename existing events without migration and reporting updates.

---

# 12. Codex execution rules

1. Inspect the repository before changing anything.
2. Reuse existing routes, data models and components.
3. Do not stop at analysis.
4. Implement the smallest compliant changes.
5. Add regression tests.
6. Verify desktop and mobile in a real browser.
7. Preserve canonical URLs and redirect rules.
8. Do not invent content, links, images, metrics or partner claims.
9. Mark blocked data honestly.
10. Produce evidence for every completed task.
11. Do not declare completion when only source code was inspected.
12. Do not change the money model without an explicit decision.
13. Do not create a new parallel roadmap file inside the repository.

---

# 13. Required deliverables from Codex

Create:

1. `OTHER_BALI_COMPETITIVE_ADDENDUM_IMPLEMENTATION_REPORT.md`
2. `OTHER_BALI_COMPETITIVE_ADDENDUM_TEST_RESULTS.md`
3. `OTHER_BALI_COMPETITIVE_ADDENDUM_ROUTE_AND_DATA_MAP.csv`
4. `OTHER_BALI_COMPETITIVE_ADDENDUM_OPEN_CONFLICTS.md`

The report must include:

- files changed;
- routes changed;
- schema or migrations;
- components reused;
- tests added;
- browser verification;
- mobile verification;
- screenshots or evidence references;
- unresolved blockers;
- canonical conflicts;
- final verdict.

---

# 14. Final verdict format

```text
T0_DIAGNOSTICS: PASS | FAIL | BLOCKED

HOMEPAGE_DECISION_PROOF: READY | NOT_READY | BLOCKED
TODAY_SHORTLIST: READY | NOT_READY | BLOCKED
PLACE_PAGE_TRUST: READY | NOT_READY | BLOCKED
VENUE_CLAIM_FLOW: READY | NOT_READY | BLOCKED
VILLA_QR_DEMO: READY | NOT_READY | DEFERRED | BLOCKED
CONFIRMED_EXTRAS: READY | NOT_READY | DEFERRED | BLOCKED

CANONICAL_URL_SAFETY: PASS | FAIL
DATA_TRUTHFULNESS: PASS | FAIL
ORGANIC_RANKING_INDEPENDENCE: PASS | FAIL
MONEY_MODEL_CONSISTENCY: PASS | FAIL | BLOCKED
DESKTOP_QA: PASS | FAIL
MOBILE_QA: PASS | FAIL

LOCAL_IMPLEMENTATION: READY | NOT_READY | BLOCKED
PUBLIC_MARKETING_READINESS: GO | CONDITIONAL | NO_GO
```

---

# 15. Final product formula

> Other Bali does not win by listing more Bali.  
> It wins by helping a traveller decide faster, trust the recommendation and take the correct next action.

Competitive mechanics are allowed only when they strengthen that formula.
