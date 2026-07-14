# Other Bali — Four Parallel Sessions in Loop Mode

**Version:** 1.0  
**Date:** 2026-07-13  
**Goal:** implement the structured menu and trusted action layer without turning four parallel sessions into four competing architectures.

---

## 1. Outcome

The four-session program delivers one integrated vertical slice:

```txt
Moment / place discovery
→ decision-ready place page
→ verified structured menu
→ capability-driven Reserve / Delivery / Takeaway / Pre-order / Maps / Save
→ external provider fulfilment
→ safe action attribution
→ partner/admin freshness maintenance
```

The program extends the current Other Bali codebase. It does not rebuild it.

---

## 2. Non-negotiable boundaries

All sessions follow `AGENTS.md` and `Other_Bali_Master_Architecture.md`.

The loop may not introduce:

- an internal booking engine;
- an Other Bali cart/order/payment/refund system;
- a courier fleet;
- a Google Maps clone;
- tourist-side payments;
- a tourist AI chatbot;
- paid organic ranking;
- review scraping;
- monetized partner logic outside `active_deep`.

---

## 3. Coordinator preflight — before the four sessions start

This is setup, not a fifth implementation session.

### 3.1 Freeze the baseline

From the current default branch:

```bash
git switch main
git pull --ff-only
npm ci
npm run lint
npm run build
BASE_SHA=$(git rev-parse HEAD)
echo "$BASE_SHA"
```

If the default branch is not `main`, use the repository’s actual protected branch. Record `BASE_SHA` in `docs/loop/STATUS_BOARD.md`.

### 3.2 Install the canonical documents

Place these files at repository root:

```txt
AGENTS.md
AGENT.md
CLAUDE.md
Other_Bali_Master_Architecture.md
PARALLEL_LOOP_EXECUTION_PLAN.md
```

Add the frozen cross-session contract:

```txt
lib/contracts/menu-action.ts
```

Create:

```txt
docs/loop/STATUS_BOARD.md
docs/loop/handoffs/
docs/loop/requests/
```

Commit this as the baseline documentation/contract commit:

```bash
git add AGENTS.md AGENT.md CLAUDE.md Other_Bali_Master_Architecture.md \
  PARALLEL_LOOP_EXECUTION_PLAN.md lib/contracts/menu-action.ts docs/loop
git commit -m "docs: freeze Other Bali action-layer architecture and loop contracts"
BASE_SHA=$(git rev-parse HEAD)
```

All four branches must start from this exact SHA.

### 3.3 Create isolated worktrees

```bash
git worktree add ../ob-loop-1-data -b loop/01-data-foundation "$BASE_SHA"
git worktree add ../ob-loop-2-menu-ui -b loop/02-menu-place-ui "$BASE_SHA"
git worktree add ../ob-loop-3-actions -b loop/03-action-gateway "$BASE_SHA"
git worktree add ../ob-loop-4-integration -b loop/04-admin-integration "$BASE_SHA"
```

### 3.4 Reserve authority

- Session 1 is the only migration/schema owner.
- Session 4 is the only integration/merge owner.
- Root architecture files are coordinator-owned after baseline.
- Sessions request cross-owned changes through `docs/loop/requests/`.

---

## 4. Shared loop protocol

Every session repeats:

```txt
READ
→ INSPECT
→ WRITE DISCOVERY NOTE
→ IMPLEMENT SMALLEST COMPLETE SLICE
→ TEST
→ SELF-REVIEW DIFF
→ UPDATE STATUS + HANDOFF
→ LOOP AGAIN
```

### 4.1 Loop record

After each loop, update the session handoff with:

```txt
Loop number
Objective
Files changed
Behaviour delivered
Tests run + exact result
Known risks
Cross-session contract requests
Migration/env/manual steps
Next loop objective
```

### 4.2 Failure rule

Do not stack new work on a failing loop.

When tests fail:

1. classify whether the failure is pre-existing or introduced;
2. record evidence;
3. fix introduced failures before continuing;
4. do not delete another feature merely to make the build green.

### 4.3 Blocker rule

A blocker is valid when it names:

- exact missing input or authority conflict;
- exact file/owner involved;
- evidence;
- safest next action.

“Could not finish” is not a useful blocker.

---

## 5. File ownership matrix

| Area | Session 1 | Session 2 | Session 3 | Session 4 |
|---|---:|---:|---:|---:|
| Supabase migrations / RLS / RPC | **OWNER** | no | no | request only |
| `lib/types.ts`, DB row mapping | **OWNER** | no | no | integration fixes only |
| menu/action repositories | **OWNER** | consume | consume | integration fixes only |
| menu UI components | no | **OWNER** | no | integration fixes only |
| place-page editorial/menu layout | no | **OWNER** | no | final wiring only |
| action resolver/provider adapters | no | no | **OWNER** | integration fixes only |
| action UI/sticky bar | no | no | **OWNER** | final wiring only |
| event API/client tracking | schema support | no | **OWNER** | integration fixes only |
| partner/admin menu & capability UI | no | no | no | **OWNER** |
| freshness/publication QA scripts | contract support | no | no | **OWNER** |
| final branch merges/conflicts | no | no | no | **OWNER** |
| final E2E/browser QA | focused only | focused only | focused only | **OWNER** |
| root authority docs | no | no | no | update after integration only |

A session may read any file. It may only edit owned files before integration.

---

## 6. Session 1 — Data Foundation and Contracts

**Branch:** `loop/01-data-foundation`  
**Role:** sole schema owner and public read-contract owner.

### 6.1 Mission

Implement the durable, backward-compatible data layer for:

- versioned menus;
- menu sections/items;
- venue action capabilities;
- safe event payloads;
- typed public repositories;
- RLS and write separation.

### 6.2 Owned files

Expected ownership:

```txt
supabase/migrations/*
lib/types.ts
lib/data.ts when required for compatibility
lib/domain/menu.ts
lib/domain/actions.ts
lib/data/menu-repository.ts
lib/data/action-repository.ts
lib/data/public-venue-detail.ts
tests or scripts specific to mapping/schema
```

Do not edit place-page UI, action components, admin pages or provider adapters.

### 6.3 Loop sequence

#### Loop 1 — Discovery and schema contract

- find the current highest migration number;
- inspect `venues`, events, RLS/RPC patterns, partner onboarding and publication code;
- verify production-pending migrations from current docs;
- write `docs/loop/handoffs/session-1.md` discovery section;
- confirm schema against the frozen contract.

No migration until this inspection is complete.

#### Loop 2 — Additive schema and RLS

Create new migrations for:

- `menus`;
- `menu_sections`;
- `menu_items`;
- `venue_action_capabilities`;
- `events.payload jsonb`;
- backwards-compatible `log_event_v2` RPC;
- indexes, checks and RLS;
- partner write boundaries that exclude editorial fields.

Do not edit any applied migration.

#### Loop 3 — Domain mapping and repositories

Implement:

```txt
getPublishedMenu(venueSlug)
getPublishedActionCapabilities(venueSlug)
getPublicVenueDetailExtension(venueSlug)
```

Requirements:

- fresh published data only;
- deterministic ordering;
- empty-state returns, not exceptions;
- compatibility with existing external menu links, `tablepilot_slug` and WhatsApp;
- no hidden active-deep bypass.

#### Loop 4 — Backfill strategy and verification

- add idempotent backfill for TablePilot/WhatsApp capabilities where safe;
- do not invent structured menu items from URLs;
- add mapping tests;
- run lint/build;
- document manual production migration steps;
- publish final commit SHA and handoff.

### 6.4 Exit criteria

- schema matches master architecture;
- RLS exists and is reviewed;
- public reads suppress draft/stale/expired records;
- partner write path cannot set `editorial_pick`/`editorial_note`;
- old code continues to build;
- event source meaning remains intact;
- lint/build pass;
- no UI files changed.

---

## 7. Session 2 — Place and Structured Menu Experience

**Branch:** `loop/02-menu-place-ui`  
**Role:** own the public place-page/menu experience.

### 7.1 Mission

Build a mobile-first structured menu experience that strengthens the decision page without turning it into a restaurant POS.

### 7.2 Owned files

Expected ownership:

```txt
app/places/[slug]/page.tsx
app/places/[slug]/loading.tsx if needed
components/menu/*
components/place-detail/* created by this session
app/globals.css or narrowly scoped existing styles
focused UI tests
```

Do not edit migrations, repositories, event API, provider adapters, `VenueActionBar`, `ReserveButton` or admin/onboarding pages.

### 7.3 Loop sequence

#### Loop 1 — Existing-page audit

Inspect:

- place detail structure;
- metadata/indexability;
- existing `What to order`;
- current external menu links;
- mobile sticky action behaviour;
- Uluwatu static content fallback;
- empty/photo-less states.

Write the intended component tree before editing.

#### Loop 2 — Menu components

Build components for:

- menu header/source/freshness note;
- sections;
- menu items;
- dietary/allergen badges;
- editorial pick vs partner recommendation;
- no-menu and external-menu fallback;
- collapsed/expand behaviour where useful.

Do not claim allergen safety from absent data.

#### Loop 3 — Place-page integration

Wire the menu view into the canonical page order:

```txt
Why it fits
→ quick read/practical
→ What to order
→ structured menu or official fallback
→ action integration slot
→ related places
```

Preserve:

- metadata;
- JSON-LD accuracy;
- publication gate;
- save control;
- confirmed active-deep offer;
- owner attribution;
- related guides;
- responsive layout.

Because Session 3 owns the action component, leave a stable integration slot and document the expected props. Do not edit Session 3 files.

#### Loop 4 — UI hardening

Verify:

- mobile 320/375/430 widths;
- desktop;
- long item names/descriptions;
- no price;
- stale/no menu;
- many sections;
- keyboard/focus;
- reduced motion where relevant;
- no horizontal overflow;
- lint/build.

### 7.4 Exit criteria

- structured menu is readable and clearly sourced;
- editorial and partner voices are distinct;
- external-menu fallback still works;
- place without menu is not degraded;
- no fulfilment claim is added;
- mobile action area remains available;
- metadata/indexability remain correct;
- lint/build pass;
- no schema/action/admin files changed.

---

## 8. Session 3 — Action Gateway and Attribution

**Branch:** `loop/03-action-gateway`  
**Role:** own provider resolution, outbound actions and safe analytics.

### 8.1 Mission

Create one capability-driven action interface for:

```txt
Reserve · Delivery · Takeaway · Pre-order · Website · WhatsApp · Google Maps
```

without owning fulfilment.

### 8.2 Owned files

Expected ownership:

```txt
lib/actions/*
lib/integrations/tablepilot.ts
lib/integrations/google-maps.ts
lib/integrations/whatsapp.ts
lib/integrations/external-ordering.ts
components/actions/*
components/VenueActionBar.tsx
components/ReserveButton.tsx when needed
components/TrackedOutboundLink.tsx when needed
components/TrackedDirectionsLink.tsx when needed
app/api/event/route.ts
lib/analytics.ts when needed
focused resolver/event tests
```

Do not edit migrations, `lib/data.ts`, place-page layout or admin pages.

### 8.3 Loop sequence

#### Loop 1 — Provider and URL contract

- inspect current TablePilot, WhatsApp, Maps and outbound tracking code;
- define provider/domain validation;
- define resolution priority and disclosure labels;
- verify active-deep rules;
- write discovery note.

#### Loop 2 — Pure resolver and adapters

Implement pure functions that:

- accept capability records plus existing venue fallbacks;
- reject disabled/stale/expired/invalid capabilities;
- apply coverage policy;
- return primary action plus alternatives;
- generate TablePilot, WhatsApp and Maps links safely;
- never claim provider state unavailable to the app.

Add unit tests around the resolver before UI wiring.

#### Loop 3 — Action components

Build a reusable action panel/sticky bar:

- primary action hierarchy;
- provider disclosure;
- reserve/delivery/takeaway/pre-order semantics;
- `confirmation required` note;
- Maps always clearly external;
- accessible labels and 44–46 px targets;
- no empty button slots.

Expose a stable component API for Session 4 to integrate into the place page.

#### Loop 4 — Analytics

- extend event allowlist for `menu_open`, `menu_item_open`, `action_handoff`, `delivery_click`, `takeaway_click`, `preorder_click` as appropriate;
- use `log_event_v2` when Session 1 contract is available after merge;
- preserve the old event path as fallback until integration;
- never overwrite acquisition source;
- never log PII;
- analytics failure may not block navigation;
- run lint/build and focused tests;
- publish final handoff.

### 8.4 Exit criteria

- action resolution is deterministic and tested;
- no unverified action appears;
- active-deep billing boundary is preserved;
- TablePilot flow still logs `reservation_click` and opens correctly;
- Google Maps remains external;
- delivery/takeaway/pre-order are handoffs, not confirmed orders;
- safe event metadata is produced;
- lint/build pass;
- no migration/place-page/admin files changed.

---

## 9. Session 4 — Admin, Freshness, Integration and Final QA

**Branch:** `loop/04-admin-integration`  
**Role:** parallel admin work first; sole integration owner second.

### 9.1 Mission

Make the new data maintainable, then merge all sessions into one verified product.

### 9.2 Owned files during parallel phase

```txt
app/admin/menus/*
app/admin/capabilities/*
app/admin/freshness/*
app/onboard/* only for narrowly scoped menu/action maintenance
components/admin/* created by this session
scripts/validate-menus.*
scripts/validate-capabilities.*
lib/publication.ts only when needed for freshness/publication gates
docs/loop/*
final handoff docs after integration
```

During the parallel phase, do not edit migrations, public place-page layout or action components.

### 9.3 Loop sequence

#### Loop 1 — Operator workflow audit

Inspect:

- existing admin and onboarding routes;
- token/ownership model;
- current photo/perk confirmation workflow;
- publication gate;
- source/evidence records;
- current lack of formal admin auth.

Choose the smallest safe maintenance surface. Do not pretend unguessable URLs are full authorization.

#### Loop 2 — Freshness and validation tools

Implement operator-facing queues or reports for:

- stale menus;
- expiring actions;
- broken/invalid URLs;
- missing sources;
- menu missing sections/items;
- action missing verification;
- publication blockers.

Add validation scripts suitable for CI or manual pre-publish checks.

#### Loop 3 — Partner/admin maintenance

Implement the safest supported workflow for:

- creating a draft menu version;
- editing non-editorial menu fields;
- submitting action capabilities;
- operator publishing/archiving;
- preventing partner edits to editorial fields.

If existing auth cannot support safe partner writes, keep partner submission as a reviewed draft workflow and document the limitation. Do not weaken security for convenience.

#### Loop 4A — Prepare integration

Before merging:

- ensure Session 4’s own branch passes lint/build;
- review every session handoff;
- confirm all branches started from the same baseline;
- confirm Session 1 owns every migration;
- list expected conflicts.

#### Loop 4B — Merge in fixed order

Merge into Session 4 branch:

```txt
1. loop/01-data-foundation
2. loop/03-action-gateway
3. loop/02-menu-place-ui
```

Why this order:

- data contracts first;
- action component/API second;
- page/menu UI third;
- final wiring happens with both dependencies present.

Resolve conflicts by architecture, not by choosing the newest file wholesale.

#### Loop 5 — Final wiring

- replace the Session 2 action integration slot with Session 3’s component;
- wire Session 1 repositories into the public page;
- wire Session 4 admin to Session 1 data layer;
- preserve existing TablePilot/Maps/save/perk flows;
- add only the glue needed for the target vertical slice.

#### Loop 6 — Full verification

Run:

```bash
npm ci
npm run lint
npm run build
```

Run focused tests and browser QA for the acceptance matrix in the master architecture.

Update:

- `docs/SESSION-HANDOFF.md`;
- current status in `CLAUDE.md` only if needed, keeping it thin;
- migration apply checklist;
- env requirements;
- known limitations;
- final commit SHA.

### 9.4 Exit criteria

- all four branches are integrated;
- no unresolved ownership conflict;
- schema/UI/action/admin form one coherent flow;
- production migration steps are explicit;
- browser QA evidence exists;
- lint/build pass from clean install;
- no guardrail regression;
- final handoff is sufficient for a fresh session.

---

## 10. Cross-session contract requests

Use one file per request:

```txt
docs/loop/requests/S{requester}-to-S{owner}-{short-name}.md
```

Template:

```md
# Contract request

From: Session X
To: Session Y
Date:
Blocking: yes/no

## Need

## Why existing contract is insufficient

## Proposed minimal change

## Files owned by receiver

## Acceptance test
```

No session edits another owner’s files to bypass this process.

---

## 11. Merge gates

A branch is merge-ready only when:

- handoff is complete;
- branch has no unrelated changes;
- owned-file boundary was respected;
- focused tests pass;
- lint/build pass or a documented baseline-only failure is proven;
- no architecture conflict is open;
- migration/env/manual steps are listed;
- commit SHA is recorded.

Session 4 may reject a branch from integration until these are true.

---

## 12. Final acceptance matrix

| Scenario | Required result |
|---|---|
| Fresh structured menu | sections/items render with source and verification |
| Stale menu | structured current-price view suppressed or downgraded |
| Official menu link only | link remains available, no invented items |
| No menu | place page remains complete |
| TablePilot Canggu venue | Reserve logs intent and hands off correctly |
| Official booking outside active-deep | neutral handoff, no billable claim |
| Delivery capability | correct provider and disclosure, outbound event |
| No delivery capability | no delivery button |
| Takeaway | request/handoff semantics, no fake confirmation |
| Pre-order | confirmation-required semantics visible |
| Google Maps | external handoff, no internal routing |
| Saved place | existing GuestRef flow remains intact |
| Partner edit | cannot alter Other Bali editorial fields |
| Analytics | source preserved, payload safe, action not blocked on failure |
| Mobile | no overflow, usable sticky actions, readable menu |
| SEO | metadata/indexability/JSON-LD remain evidence-based |
| Planning-only district | no active-deep perk/QR/money-loop leakage |

---

## 13. Final deliverables

Expected integrated repository output:

```txt
Other_Bali_Master_Architecture.md
AGENTS.md
thin CLAUDE.md
new additive migrations
structured menu domain/data layer
capability/action resolver
menu and action UI
admin/freshness maintenance
focused tests/validation scripts
updated session handoff
production apply checklist
```

The integrated result should feel like one product, not four branches sharing a logo.

---

## Track 0 — Data Ops (added in package v2, 2026-07-13)

Runs in parallel with Sessions 1–4. Owned by humans + assistant AI, not a Claude Code session. Collects verified venue content (menus, photos, action links) via the pre-fill → owner-approval workflow so integration lands with real data instead of empty tables.

Rules, roles, owner message template and wave-1 acceptance criteria: `docs/DATA_OPS_TRACK.md` (shipped in `02_REPOSITORY_UPDATE/docs/`, commit with the baseline).

Hard rule inherited by all sessions: photos are consent-gated; menu facts publish with source attribution (see AGENTS.md, "Content publication rule").
