# Discovery — remove Chope public handoffs

Date: 2026-07-28

## Finding

Chope was intended as research provenance only. The enrichment/publication
pipeline incorrectly promoted many Chope reservation URLs into `venues.booking_url`
and confirmed `venue_action_capabilities`.

Production read-only audit found:

- 444 venue `booking_url` values on Chope hosts;
- 337 confirmed Chope action capabilities.

## Decision

Chope must never be presented as an Other Bali booking partner or public
handoff. It may remain in internal evidence/source logs. Public actions may use
the venue's official booking page, a verified external engine endorsed by the
venue, WhatsApp, TablePilot, the official website, or Google Maps.

## Safe change

1. Fail closed for Chope in the public action resolver.
2. Snapshot affected production rows.
3. Set Chope `venues.booking_url` values to null.
4. Archive confirmed Chope capabilities; do not delete them.
5. Remove hard-coded Chope booking CTAs from editorial venue records.
6. Verify zero live Chope handoffs, then test, build and deploy.

