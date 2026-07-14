# Prompt — Session 4: Admin, Freshness, Integration and Final QA

You are **Session 4**, the partner/admin freshness owner and the sole final integration owner for the Other Bali four-session loop.

## Repository and branch

Repository: `parkourcafe/privelegy-bali-club`  
Required branch/worktree: `loop/04-admin-integration`  
Start from the frozen baseline SHA recorded in `docs/loop/STATUS_BOARD.md`.

Do not merge other branches until your own parallel admin phase is green and every session handoff is ready.

## Read first

1. `AGENTS.md`
2. `Other_Bali_Master_Architecture.md`
3. `PARALLEL_LOOP_EXECUTION_PLAN.md`
4. `lib/contracts/menu-action.ts`
5. `CLAUDE.md`
6. current admin, partner onboarding, token/ownership, publication, source evidence and validation code
7. every completed session handoff before integration
8. relevant Next.js 16 docs under `node_modules/next/dist/docs/`

## Mission

Deliver two things:

1. maintainability: admin/partner workflows for menus, action capabilities and freshness;
2. one integrated, tested product from all four branches.

You are the only session allowed to merge the other loop branches.

## Hard boundaries

Do not:

- create migrations; Session 1 owns schema;
- weaken RLS or token boundaries to make a form convenient;
- let partners edit Other Bali editorial fields;
- treat unguessable URLs as strong authentication without documenting the limitation;
- create internal booking/order/payment/fulfilment states;
- add Google Maps navigation logic;
- invent menu/action facts;
- publish stale or unverified data;
- merge a branch without a complete handoff and passing owned-scope tests;
- resolve conflicts by replacing a whole file with whichever version is newer.

## Owned files during parallel phase

```txt
app/admin/menus/*
app/admin/capabilities/*
app/admin/freshness/*
app/onboard/* only for menu/action draft submission
components/admin/* created by this session
scripts/validate-menus.*
scripts/validate-capabilities.*
lib/publication.ts only when needed for freshness/publication rules
docs/loop/*
final docs after integration
```

Do not edit public place-page/action files during the parallel phase.

## Loop mode

Repeat:

```txt
READ → INSPECT → DOCUMENT → IMPLEMENT → TEST → REVIEW DIFF → HANDOFF → REPEAT
```

Then switch into integration loops only after merge gates pass.

### Loop 1 — Admin and security audit

Inspect:

- current `/admin` routes;
- onboarding tokens;
- partner ownership/write model;
- photo/perk confirmation;
- publication gates;
- source evidence;
- lack/presence of real admin auth;
- current manual founder workflow.

Write the smallest safe workflow to `docs/loop/handoffs/session-4.md` before coding.

### Loop 2 — Freshness and validation

Implement operator-facing queues/reports for:

- stale menus;
- menu expiry approaching;
- action expiry approaching;
- invalid/broken provider URLs;
- missing source/verification;
- menu with no sections/items;
- unconfirmed action;
- publication blockers;
- place missing verified Maps handoff.

Add validation scripts for pre-publish or CI use.

Do not silently delete stale data; archive/suppress it according to architecture.

### Loop 3 — Partner/admin maintenance

Implement the safest supported workflow for:

- creating a draft menu version;
- editing partner-owned menu facts;
- submitting action capabilities;
- testing the handoff URL;
- operator review/publish/archive;
- preserving prior published menu until replacement is approved;
- preventing partner writes to `editorial_pick` and `editorial_note`.

If current authorization cannot safely support partner self-service, implement reviewed draft submission rather than broad writes. State the limitation clearly.

Session 1 owns migrations. Submit any schema gap through `docs/loop/requests/` rather than creating SQL.

### Loop 4A — Own branch verification

Before integration:

- run focused tests;
- run `npm run lint`;
- run `npm run build`;
- complete Session 4 handoff;
- confirm no public page/action/migration files were changed in the parallel phase.

### Loop 4B — Review merge readiness

For Sessions 1, 2 and 3:

- read handoff;
- verify final SHA;
- inspect diff;
- confirm file ownership;
- confirm tests;
- confirm migrations only from Session 1;
- confirm architecture compliance;
- list expected conflicts.

Reject the branch from integration until the merge gate is met.

### Loop 5 — Merge in fixed order

Merge into `loop/04-admin-integration`:

```txt
1. loop/01-data-foundation
2. loop/03-action-gateway
3. loop/02-menu-place-ui
```

Resolve conflicts using the master architecture and stable contract.

After each merge:

```bash
npm run lint
npm run build
```

If a merge breaks, fix the integration before merging the next branch.

### Loop 6 — Final wiring

Wire the complete vertical slice:

- Session 1 menu/action repositories into the place-detail read path;
- Session 2 menu UI into real data;
- Session 3 action panel into Session 2’s integration slot;
- Session 3 event adapter into Session 1 `log_event_v2` path;
- Session 4 admin/freshness workflow into Session 1 schema;
- existing saves, TablePilot, Google Maps, perk and publication behaviour retained.

Keep the glue narrow. Do not opportunistically refactor unrelated architecture.

### Loop 7 — Full verification

From a clean install/state:

```bash
npm ci
npm run lint
npm run build
```

Run all focused tests and validate the master acceptance matrix.

Browser QA must cover:

- fresh structured menu;
- stale menu;
- official menu link only;
- no menu;
- Canggu TablePilot reserve;
- planning-only official booking;
- delivery provider handoff;
- no delivery capability;
- takeaway;
- pre-order confirmation note;
- Google Maps;
- save/share;
- mobile sticky actions;
- keyboard/focus;
- no horizontal overflow;
- admin freshness queue;
- partner cannot edit editorial fields;
- metadata/indexability/JSON-LD.

Record what was actually verified. Do not imply browser verification if unavailable.

### Loop 8 — Final handoff and status

Update:

- `docs/SESSION-HANDOFF.md` to current truth;
- `docs/loop/STATUS_BOARD.md`;
- production migration apply checklist;
- environment variable checklist;
- known limitations;
- final integrated commit SHA;
- root status notes only if they remain thin and non-duplicative.

Do not re-expand `CLAUDE.md` into a second architecture.

## Required output

1. safe admin/freshness workflow;
2. validation scripts;
3. integrated branch with Sessions 1–3 merged;
4. full verification evidence;
5. migration/env/manual founder checklist;
6. updated current handoff;
7. final commit SHA and merge-ready summary.

## Exit criteria

- all branches integrated in the specified order;
- schema, repositories, UI, gateway and admin form one coherent flow;
- no guardrail regression;
- no unresolved migration collision;
- production apply steps are explicit;
- lint/build pass after clean install;
- focused tests pass;
- browser QA is completed or its precise limitation is stated;
- current docs match code;
- fresh session can continue from the handoff without this conversation.

---

### v2 addendum (2026-07-13)

- Publish gate must enforce the photo-consent rule: no venue photo goes public without a logged owner consent record (see AGENTS.md "Content publication rule" and `docs/DATA_OPS_TRACK.md`).
- Freshness queue must surface captured-at / verified-at from the Data Ops workflow.
- Development mock data: import ONLY from `lib/contracts/menu-action.fixtures.ts`.
