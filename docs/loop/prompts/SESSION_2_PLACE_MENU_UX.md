# Prompt — Session 2: Place and Structured Menu Experience

You are **Session 2**, the public place-page and structured-menu UX owner for the Other Bali four-session loop.

## Repository and branch

Repository: `parkourcafe/privelegy-bali-club`  
Required branch/worktree: `loop/02-menu-place-ui`  
Start from the frozen baseline SHA recorded in `docs/loop/STATUS_BOARD.md`.

Do not switch branches. Do not merge other sessions.

## Read first

1. `AGENTS.md`
2. `Other_Bali_Master_Architecture.md`
3. `PARALLEL_LOOP_EXECUTION_PLAN.md`
4. `lib/contracts/menu-action.ts`
5. `CLAUDE.md`
6. current place page, menu links, publication code, metadata, styles and save/action components
7. relevant Next.js 16 docs under `node_modules/next/dist/docs/`

## Mission

Build a polished mobile-first menu and place-detail experience that helps the user decide and act, while preserving the existing editorial trust, SEO, save, TablePilot, Google Maps and active-deep perk flows.

You own the **menu and place-page presentation**, not the schema or action gateway.

## Hard boundaries

Do not:

- create migrations;
- edit `lib/data.ts` or schema repositories;
- edit the event API;
- edit provider adapters;
- edit `VenueActionBar`, `ReserveButton`, tracked link components or Session 3 files;
- build an order/cart/payment system;
- claim fulfilment or live availability;
- generate menu facts;
- scrape reviews;
- add thin dish SEO pages;
- weaken metadata/indexability or coverage rules.

## Owned files

Expected ownership:

```txt
app/places/[slug]/page.tsx
app/places/[slug]/loading.tsx if useful
components/menu/*
components/place-detail/* created by this session
narrowly scoped place/menu styles in app/globals.css
focused UI tests
Your own handoff/status files
```

## Loop mode

Repeat:

```txt
READ → INSPECT → DOCUMENT → IMPLEMENT → TEST → REVIEW DIFF → HANDOFF → REPEAT
```

### Loop 1 — Audit the current place page

Inspect and document:

- current server data inputs;
- Uluwatu static-content fallback;
- `What to order` presentation;
- official menu links;
- metadata, robots and JSON-LD;
- quick-read aside;
- mobile sticky actions;
- save control;
- confirmed offers;
- owner voice;
- related guides/similar places;
- photo and no-photo states;
- responsive breakpoints.

Write the proposed component tree to `docs/loop/handoffs/session-2.md` before editing.

### Loop 2 — Build menu components

Implement components for:

- menu header;
- source and verification line;
- sections;
- items;
- price/no-price states;
- dietary tags;
- allergen tags with “verified only” semantics;
- partner recommendation;
- Other Bali editorial pick;
- editorial note;
- availability note;
- official-menu fallback;
- no-menu state;
- stale-menu state supplied by the view model.

Design rules:

- editorial and partner voices must look distinct;
- do not overwhelm the page with every tag;
- long menus must remain scannable;
- item selection may exist only as in-memory UI preparation for a later provider handoff; do not persist a cart or imply checkout;
- missing allergen data is unknown, not safe.

### Loop 3 — Integrate into the place page

Use the canonical content order:

```txt
Editorial masthead
→ Why it fits
→ Quick read / practical facts
→ What to order
→ Structured menu or official fallback
→ action integration slot
→ confirmed offer where allowed
→ owner voice
→ similar places / related routes
→ verification note
```

Preserve existing behaviour:

- page metadata and canonical;
- decision-ready indexability;
- accurate JSON-LD;
- save control;
- confirmed active-deep offer;
- owner attribution;
- related guides;
- similar-place ranking;
- current action bar until Session 4 integrates Session 3’s replacement.

Create a stable integration slot and document the props expected from Session 3. Do not edit Session 3 files.

### Loop 4 — Hardening and QA

Verify at minimum:

- 320px, 375px and 430px mobile widths;
- desktop layout;
- place with fresh structured menu;
- place with official menu link only;
- place with no menu;
- stale menu view model;
- long section/item names;
- missing prices;
- many sections;
- keyboard navigation;
- focus visibility;
- no horizontal overflow;
- no accidental public internal labels;
- public English only.

Run:

```bash
npm run lint
npm run build
```

Use browser verification when available and record exactly what was verified. Do not claim rendered QA without evidence.

## Required output

1. focused commits on `loop/02-menu-place-ui`;
2. menu/place components;
3. documented action integration slot;
4. complete `docs/loop/handoffs/session-2.md`;
5. final commit SHA;
6. screenshots or precise browser QA notes when available.

## Exit criteria

- structured menu is readable, sourced and freshness-aware;
- editorial and partner content are distinct;
- no-menu and link-only places remain useful;
- no fulfilment claim or internal checkout is introduced;
- current action/save/perk flows remain intact on the branch;
- metadata/indexability remain correct;
- mobile and accessibility checks pass;
- lint/build pass;
- no schema/action/admin files changed.

---

### v2 addendum (2026-07-13)

- Development mock data: import ONLY from `lib/contracts/menu-action.fixtures.ts`. Do not invent local mock shapes — identical fixtures across worktrees keep sessions compatible before real data lands.
- The Session 2 ↔ Session 3 integration slot is frozen as `VenueActionBarProps` in `lib/contracts/menu-action.ts`. Session 2 renders the slot and passes exactly these props; Session 3 implements the component consuming exactly these props. Changes only via contract-change request.
