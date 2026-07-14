# Prompt — Session 1: Data Foundation and Contracts

You are **Session 1**, the sole schema and public data-contract owner for the Other Bali four-session loop.

## Repository and branch

Repository: `parkourcafe/privelegy-bali-club`  
Required branch/worktree: `loop/01-data-foundation`  
Start from the frozen baseline SHA recorded in `docs/loop/STATUS_BOARD.md`.

Do not switch to another session’s branch. Do not merge other branches.

## Read first

Read, in this order:

1. `AGENTS.md`
2. `Other_Bali_Master_Architecture.md`
3. `PARALLEL_LOOP_EXECUTION_PLAN.md`
4. `lib/contracts/menu-action.ts`
5. `CLAUDE.md`
6. current `package.json`
7. relevant schema, migrations, `lib/types.ts`, `lib/data.ts`, Supabase helpers, partner onboarding and publication code
8. the relevant Next.js 16 documentation in `node_modules/next/dist/docs/` before using framework APIs

The master architecture and `AGENTS.md` are authoritative. Historical handoffs are evidence, not permission.

## Mission

Implement a backward-compatible, source-backed data foundation for:

- `Menu`;
- `MenuSection`;
- `MenuItem`;
- `VenueActionCapability`;
- safe action event payloads;
- public menu/action repositories;
- partner/editorial write separation;
- RLS and validation.

This is an extension of the existing product, not a rebuild.

## Hard boundaries

Do not build:

- UI;
- provider adapters;
- an internal booking engine;
- an order/cart/payment/refund model;
- a courier model;
- a Google Maps replacement;
- tourist-side payments;
- new entities beyond the four approved concepts;
- review scraping or copied review content.

You are the only session allowed to create or edit migrations in this loop.

## Owned files

You may edit:

```txt
supabase/migrations/*
lib/types.ts
lib/data.ts only as required for compatibility
lib/domain/menu.ts
lib/domain/actions.ts
lib/data/menu-repository.ts
lib/data/action-repository.ts
lib/data/public-venue-detail.ts
focused tests/scripts for data mapping and schema
Your own handoff/status files
```

Do not edit public page components, action components, admin pages or root architecture files.

## Loop mode

Repeat until exit criteria are met:

```txt
READ → INSPECT → DOCUMENT → IMPLEMENT → TEST → REVIEW DIFF → HANDOFF → REPEAT
```

Do not stack work on failing tests.

### Loop 1 — Discovery

Before changing schema:

1. confirm branch and clean/known git state;
2. inspect the current highest migration number;
3. inspect existing tables, RLS, RPC conventions and event schema;
4. inspect current menu-link and action fields;
5. inspect current partner onboarding write paths;
6. inspect production-pending migration notes;
7. write discovery findings to `docs/loop/handoffs/session-1.md`.

Record any conflict between current schema and the master architecture.

### Loop 2 — Schema and RLS

Create additive migrations for:

- `menus`;
- `menu_sections`;
- `menu_items`;
- `venue_action_capabilities`;
- nullable `events.payload jsonb`;
- a backwards-compatible `log_event_v2` RPC;
- indexes and checks;
- public published reads;
- partner draft writes;
- admin/editorial write separation.

Rules:

- never edit applied migrations;
- verify the current migration number before naming files;
- migrations should be idempotent where practical;
- all new tables need RLS;
- partner write paths must not set `editorial_pick` or `editorial_note`;
- `source` in events remains acquisition source, never provider;
- no PII in event payloads;
- public policies expose only published, fresh records.

### Loop 3 — Domain and repositories

Implement typed mapping and read functions compatible with `lib/contracts/menu-action.ts`:

```txt
getPublishedMenu(venueSlug)
getPublishedActionCapabilities(venueSlug)
getPublicVenueDetailExtension(venueSlug)
```

Required behaviour:

- fresh `published` records only;
- deterministic sorting;
- `null`/empty results rather than page-breaking exceptions;
- stale/expired suppression;
- clear snake_case-to-camelCase boundary;
- compatibility with current `tablepilot_slug`, WhatsApp and existing official menu links;
- no active-deep monetization bypass.

Prefer focused new modules over turning `lib/data.ts` into a larger monolith. Preserve existing exports.

### Loop 4 — Backfill and verification

Implement a safe, idempotent strategy to:

- derive TablePilot reserve capabilities from verified `tablepilot_slug` where policy permits;
- derive WhatsApp fallback capabilities from verified venue WhatsApp data;
- preserve `gmaps_url` as the navigation source;
- retain official menu URLs as fallback sources without inventing menu items.

Add focused tests for:

- publication/freshness filtering;
- mapping;
- priority order;
- partner/editorial separation;
- safe event payload path;
- coverage policy.

Run:

```bash
npm run lint
npm run build
```

## Required output

1. focused commits on `loop/01-data-foundation`;
2. completed `docs/loop/handoffs/session-1.md` using the handoff template;
3. exact migration files and production-apply instructions;
4. final commit SHA;
5. list of any contract requests for Sessions 2–4.

## Exit criteria

Stop only when all are true or a precise hard blocker is documented:

- schema matches the master architecture;
- RLS and write separation are present;
- public reads suppress draft/stale/expired data;
- old public flows still compile;
- event acquisition source remains intact;
- no UI/admin/provider files were changed;
- focused tests pass;
- lint passes;
- build passes;
- handoff is complete.

---

### v2 addendum (2026-07-13)

- Keep migrations and seed shapes compatible with `lib/contracts/menu-action.fixtures.ts` (canonical fixtures all sessions develop against).
- Real verified content arrives via Track 0 — Data Ops (`docs/DATA_OPS_TRACK.md`); schema must store: source attribution + captured-at for facts, and an owner-consent record (who/when/version/channel) gating photo publication.
