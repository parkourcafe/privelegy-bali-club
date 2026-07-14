# Prompt — Session 3: Action Gateway and Attribution

You are **Session 3**, the provider action-gateway, action UI and safe-attribution owner for the Other Bali four-session loop.

## Repository and branch

Repository: `parkourcafe/privelegy-bali-club`  
Required branch/worktree: `loop/03-action-gateway`  
Start from the frozen baseline SHA recorded in `docs/loop/STATUS_BOARD.md`.

Do not switch branches. Do not merge other sessions.

## Read first

1. `AGENTS.md`
2. `Other_Bali_Master_Architecture.md`
3. `PARALLEL_LOOP_EXECUTION_PLAN.md`
4. `lib/contracts/menu-action.ts`
5. `CLAUDE.md`
6. current `VenueActionBar`, `ReserveButton`, tracked outbound/directions links, event API, analytics and TablePilot code
7. current coverage/district logic
8. relevant Next.js 16 docs under `node_modules/next/dist/docs/`

## Mission

Create one capability-driven action gateway for:

```txt
Reserve · Delivery · Takeaway · Pre-order · Website · WhatsApp · Google Maps
```

Other Bali owns the decision and handoff. Providers own fulfilment.

## Hard boundaries

Do not:

- create/edit migrations;
- edit `lib/data.ts` or Session 1 repositories;
- edit the public place-page layout;
- edit admin/onboarding pages;
- create an internal reservation/order/cart/payment/refund model;
- claim a request is confirmed;
- claim live stock, service area, fee or ETA without provider data;
- alter acquisition source semantics;
- log PII;
- replace Google Maps navigation;
- monetize outside active-deep.

## Owned files

Expected ownership:

```txt
lib/actions/*
lib/integrations/tablepilot.ts
lib/integrations/google-maps.ts
lib/integrations/whatsapp.ts
lib/integrations/external-ordering.ts
components/actions/*
components/VenueActionBar.tsx
components/ReserveButton.tsx when required
components/TrackedOutboundLink.tsx when required
components/TrackedDirectionsLink.tsx when required
app/api/event/route.ts
lib/analytics.ts when required
focused resolver/event tests
Your own handoff/status files
```

## Loop mode

Repeat:

```txt
READ → INSPECT → DOCUMENT → IMPLEMENT → TEST → REVIEW DIFF → HANDOFF → REPEAT
```

### Loop 1 — Audit and contract

Inspect:

- current TablePilot URL construction and `reservation_click` event;
- current WhatsApp fallback;
- current Google Maps handoff;
- generic outbound tracking;
- active-deep coverage rules;
- event allowlist and RPC limitations;
- mobile sticky action bar.

Document:

- action resolution priority;
- provider/domain validation rules;
- provider disclosure labels;
- fallback behaviour;
- contract expected from Session 1.

### Loop 2 — Pure resolver and provider adapters

Implement pure, testable logic that:

- receives `VenueActionCapabilityRecord[]` plus existing venue fallbacks;
- rejects draft/review/stale/disabled/expired/invalid records;
- applies district/commercial policy;
- sorts by explicit priority;
- returns primary and alternative actions;
- builds TablePilot links safely;
- builds WhatsApp prefilled links safely;
- validates official ordering/provider URLs;
- builds or validates Google Maps links;
- never claims unavailable provider state.

Required cases:

- active-deep TablePilot reserve;
- official booking outside active-deep;
- direct venue delivery;
- GrabFood/GoFood/ShopeeFood handoff;
- WhatsApp delivery/takeaway fallback;
- pre-order with `confirmationRequired = true`;
- no capability;
- expired capability;
- malformed URL;
- Google Maps direction.

### Loop 3 — Action UI

Build a reusable component such as:

```txt
components/actions/VenueActionPanel.tsx
```

It must support:

- clear primary hierarchy;
- Reserve;
- Delivery;
- Takeaway;
- Pre-order request;
- Website/WhatsApp alternatives;
- Open in Google Maps;
- provider disclosure;
- confirmation-required note;
- 44–46px mobile targets;
- sticky mobile presentation without horizontal clipping;
- no placeholder buttons when data is absent.

Expose a stable prop contract for Session 4 integration. Do not edit the place page.

### Loop 4 — Attribution and event safety

Update client/API tracking for approved events:

```txt
menu_open
menu_item_open
action_handoff
delivery_click
takeaway_click
preorder_click
```

Preserve existing:

```txt
reservation_click
direction_click
booking_click
menu_click
```

Rules:

- provider/action details go into safe payload;
- acquisition `source` is never overwritten;
- no name, phone, address, message body, payment data or token is logged;
- analytics failure never blocks outbound navigation;
- `reservation_click` remains partner-proof intent only for TablePilot;
- delivery/takeaway/preorder clicks remain intent/growth until provider-confirmed architecture exists.

Session 1 owns the database/RPC migration. If your branch cannot call `log_event_v2` yet, implement a typed compatibility adapter and document the final integration step rather than creating a migration.

Run focused tests, then:

```bash
npm run lint
npm run build
```

## Required output

1. focused commits on `loop/03-action-gateway`;
2. pure resolver/provider adapters and tests;
3. reusable action panel/sticky UI;
4. safe event/API changes;
5. `docs/loop/handoffs/session-3.md`;
6. exact integration instructions for Session 4;
7. final commit SHA.

## Exit criteria

- only verified capabilities resolve;
- active-deep billing boundary remains intact;
- TablePilot reserve flow is preserved;
- Google Maps remains an external handoff;
- delivery/takeaway/preorder are requests/handoffs, not fulfilled orders;
- analytics payload is safe and source-preserving;
- UI has no empty buttons or clipped mobile actions;
- focused tests pass;
- lint/build pass;
- no migration/place-page/admin files changed.

---

### v2 addendum (2026-07-13)

- Development mock data: import ONLY from `lib/contracts/menu-action.fixtures.ts`. Do not invent local mock shapes — identical fixtures across worktrees keep sessions compatible before real data lands.
- The Session 2 ↔ Session 3 integration slot is frozen as `VenueActionBarProps` in `lib/contracts/menu-action.ts`. Session 2 renders the slot and passes exactly these props; Session 3 implements the component consuming exactly these props. Changes only via contract-change request.
