# Other Bali — Menu and Action Architecture

Status: frozen four-session amendment, 2026-07-13.

This document is a narrow additive amendment to `Bali_Privilege_Master_Architecture.md`.
The existing master and `AGENTS.md` remain authoritative for product, coverage,
monetisation, privacy and publication rules. A conflict must stop implementation and
be recorded in `docs/loop/requests/`.

## Approved concepts

The loop may add exactly four concepts: `Menu`, `MenuSection`, `MenuItem`, and
`VenueActionCapability`. They extend `Venue`; they do not create ordering, booking,
payment, courier, inventory or fulfilment systems.

## Menu model

A venue may have many immutable menu versions. A version moves through
`draft -> review -> published -> archived`. Only one fresh published version is shown.
Publishing a replacement archives the prior published version atomically; the prior
version remains public until replacement approval. Stale or expired content is
suppressed, never silently deleted.

Each menu records venue ownership, source URL/label, captured and verified times,
expiry, status and version. Sections and items have deterministic positions. Prices
are optional and use integer minor units plus ISO currency. Dietary/allergen claims
are displayed only when explicitly verified. Missing allergen data means unknown.

Partner facts and Other Bali editorial voice are separate. Partners may propose menu
facts and a partner recommendation. Only editorial/admin roles may set
`editorial_pick` and `editorial_note`.

## Action capability model

Capabilities describe verified external handoffs: `reserve`, `delivery`, `takeaway`,
`preorder`, `website`, `whatsapp`, and `maps`. A capability stores provider, URL,
priority, status, source/verification evidence, expiry, and whether provider
confirmation is required. Only enabled, confirmed, fresh, policy-allowed records
resolve. Invalid URLs fail closed.

Other Bali owns decision support and attribution; the provider owns fulfilment.
TablePilot is the reserve handoff in active-deep coverage. Planning-only areas may use
verified official booking links without implying partnership or monetisation. Google
Maps remains the navigation source. No UI may claim live availability, confirmation,
stock, fee, ETA or service area without verified provider data.

## Publication and freshness

Public reads require published/confirmed status, valid source evidence, a verification
timestamp, non-expired freshness and a publishable parent venue. Admin queues expose
stale/expiring records, broken URLs, missing evidence, empty menus, unconfirmed
actions, publication blockers and missing verified Maps handoffs.

Owner photo consent is versioned evidence (who, when, version, channel). Photo
publication remains gated by that evidence. Data Ops supplies verified facts through
`docs/DATA_OPS_TRACK.md`; fixtures are development-only and never publication proof.

## Analytics

Approved additive events are `menu_open`, `menu_item_open`, `action_handoff`,
`delivery_click`, `takeaway_click`, and `preorder_click`. Existing events remain.
Acquisition `source` retains its current meaning; provider/action metadata belongs in
a safe JSON payload. No PII, token, free-form message, address or payment data may be
logged. Analytics failure never blocks navigation.

## Integration invariants

- Public code consumes `lib/contracts/menu-action.ts`.
- Session 1 owns schema and repositories; Session 2 owns place/menu presentation;
  Session 3 owns resolution, provider handoff and action UI; Session 4 owns admin,
  freshness and final integration.
- Migrations are additive and owned only by Session 1.
- Saves, perks, TablePilot, Maps, metadata, indexability and publication behaviour are
  preserved unless this amendment explicitly tightens freshness.

