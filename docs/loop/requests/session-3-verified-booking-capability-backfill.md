# Verified booking capability backfill

- Requester: Session 3 — Action gateway
- Affected sessions: Session 1, Session 4
- Status: open

## Motivation

The frozen `VenueActionFallbacks` contract intentionally has no `bookingUrl`.
Baseline Uluwatu data already contains evidence-backed `venues.booking_url`
values, but Session 1 migration `0026_menu_action_foundation.sql` backfills only
TablePilot, WhatsApp and Google Maps capabilities. If Session 4 removes the
legacy raw booking-link paths now, those verified direct-booking actions would
disappear; if it keeps them, they bypass the capability resolver.

## Proposed additive change

Session 1 should add an idempotent, data-owned backfill that creates a
`kind = 'reserve'` capability for a published venue only when:

- `booking_url` is non-empty HTTPS;
- the matching `venue_fact_sources` booking evidence is `VERIFIED`;
- the venue has a usable verification timestamp;
- the record is non-TablePilot and makes no partnership or monetisation claim.

Use a canonical provider when the verified host is one of Session 3's supported
booking providers; otherwise use `official`. Set `confirmation_required = true`
and preserve the evidence URL/label/timestamps. The resolver already accepts
verified official booking outside `active_deep` and validates provider hosts.

## Compatibility impact

No frozen TypeScript contract change is required. The public action repository
will return the new row through the existing `VenueActionCapabilityRecord[]`.
Until the backfill is merged, Session 4 must not synthesize an unverified record
or pass `booking_url` around the resolver; it should retain the legacy booking
CTA only as a documented temporary compatibility path.

## Resolution

Open. Session 1 owns the additive migration/backfill; Session 4 owns final
integration and removal of the temporary legacy bypass after that data lands.
