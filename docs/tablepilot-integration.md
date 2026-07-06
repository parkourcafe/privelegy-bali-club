# TablePilot ↔ Bali Privilege integration — handoff

Written 2026-07-06 for the follow-up session that has BOTH repos in scope:
`parkourcafe/privelegy-bali-club` (BP) and `parkourcafe/tablepilot-id` (TablePilot).
Context: money model v0.3 (`docs/money-model.md`) — BP earns a fixed fee per
**confirmed seated reservation** made through TablePilot. Read that file first.

## State as of handoff

**BP side — DONE (commit 784ed44):**
- `venues.tablepilot_slug` (migration `0010_tablepilot_bridge.sql`; may still
  need applying to the live DB — check).
- `components/ReserveButton.tsx`: bookable venue → 
  `{NEXT_PUBLIC_TABLEPILOT_URL|https://tablepilot-id.vercel.app}/book/<slug>?source=bali_privilege`,
  logs `reservation_click` event. WhatsApp fallback for non-bookable venues.
- `reservation_click` accepted by `/api/event` (demand signal, shifted Phase 0).

**TablePilot side — NOT DONE (repo was out of scope). This is the work.**

## Step 1 — TablePilot patch (small, exact)

Work on a branch, not main. TablePilot is a Vite/React app, state in
Supabase JSONB (`app_state` table, project `tablepilot horeca` /
`xcuxaufecmsizgutukqa`). Deployed at https://tablepilot-id.vercel.app.

1. `src/lib/types.ts` (~line 10): add `"bali_privilege"` to the `BookingSource`
   union (after `"manual"`).
2. `src/lib/domain.ts` (~line 277, `sourceLabel`): add
   `bali_privilege: "Bali Privilege"` to the labels record.
3. `src/App.tsx` (~lines 772–779, the public `/book/:slug` submit currently
   hardcoding `source: "widget"`): read `?source=` from the URL:
   ```ts
   const spParams = new URLSearchParams(window.location.search);
   const refSource: BookingSource =
     spParams.get("source") === "bali_privilege" ? "bali_privilege" : "widget";
   // ...
   source: refSource,
   ```
4. Run existing tests (`npm test`), build, push branch, deploy.

Note: `src/App.tsx:106` has a `sources` array used for admin dropdowns — decide
whether `bali_privilege` should appear there (probably yes, read-only display;
staff shouldn't hand-pick it for manual bookings — judgement call).

## Step 2 — seated report-back (the fee loop)

Goal: BP can count reservations where `source = "bali_privilege"` AND the
reservation reached seated. Options (pick pragmatically after reading
`server/app.ts`):
- **Pull (simplest):** a read-only endpoint (or reuse
  `GET /api/admin/reservations` with a source filter + auth token) that BP polls;
  BP stores/aggregates counts per venue.
- **Push:** TablePilot POSTs to a BP endpoint when a bali_privilege reservation
  is marked seated.

Keep aggregate-only in BP partner surfaces (privacy guardrail #9). The perk/QR
redemption remains an independent arrival proof to reconcile against.

## Step 3 — wire one real venue

- Put the venue's TablePilot slug into BP:
  `update venues set tablepilot_slug='<slug>' where slug='<bp-slug>';`
- Verify: BP card shows "Reserve a table" → TablePilot booking page → created
  reservation carries `source=bali_privilege` → mark seated in admin → count
  visible via the report-back path.

## Guardrails that still bind

- Tourist never pays. Fee = fixed per confirmed seated reservation only.
- BP builds no internal booking engine — integrate TablePilot (CLAUDE.md #3).
- Partner surfaces: aggregates only (#9). Attribution buckets stay separate (#8).
- Scope discipline (#11): this integration, nothing extra.
