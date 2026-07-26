# v1.2 Trip, Route and Offline contract

Status: implementation stub; no production schema or provider has been selected.

This slice adds framework-independent contracts for Today, Trip, verified event
occurrences, routing, and Level 1/2 local state. It deliberately does not add
database migrations because the parallel data agent owns schema.

## Existing compatibility

- The current guest trip remains the persisted compatibility path
  (`saved_places.day_number/position`).
- `Trip`, `TripDay`, and `TripStop` are richer target contracts. A later
  migration/adaptor must map the guest-trip rows rather than creating a second
  source of place truth.
- Existing public route definitions remain editorial route templates.
  `RouteService` only estimates travel between already selected entities.

## Provider boundary

No Google Routes, Mapbox, or Grab provider is selected. `RouteService` is the
only target interface. The current fallback is a coordinate-specific external
Google Maps URL. A provider spike must resolve pricing, quotas, caching/offline
rights, attribution, Bali route quality, two-wheel behavior, iOS/Android parity,
storage, telemetry, and privacy before a provider adapter can be production
enabled.

## Offline boundary

Level 1 stores Saved/Today essentials and queued user actions. Level 2 extends
that snapshot to TripDays, TripStops, selected event occurrences, thumbnails,
alternatives, and a precomputed route summary. These levels are not an offline
map and must never be called offline navigation. Map tiles, GPS-on-downloaded-map
and onboard routing are Level 3 and remain blocked on the provider spike.

Every offline mutation has an idempotency key. Notes are never silently deleted;
version mismatch becomes an explicit conflict. Official actions, opening data,
events, and evidence remain server-authoritative. Offline screens must show
their last-updated timestamp; booking, delivery, website, Instagram, WhatsApp,
live directions, and live traffic require a connection.

## Schema requests for the data owner

- Stable IDs and version columns for Trip/TripDay/TripStop and EventOccurrence.
- Private-note isolation and deletion semantics.
- Idempotency-key uniqueness for sync mutations.
- Event occurrence expiry/cancellation publication query.
- ETag/version cursor for pull/push sync.
- No provider response metadata mixed into editorial place truth.

