# Uluwatu Maps entity audit

Checked: 2026-07-23. No Google Places API credential or reliable manual entity-share capture was available. Search URLs, coordinate URLs and CIDs are not Place IDs.

Every unresolved Place ID remains `null` in `ULUWATU_ENTITY_MASTER.csv` and `ULUWATU_MAPS_MANUAL_CONFIRMATION_QUEUE.csv`. The highest-risk identity is Padang Padang versus Labuan Sait. Beach pins must identify the public entrance rather than an adjacent club, parking business or broad surf area. The temple and Kecak performance require separate identity review if separate action layers are ever shown.

This gap does not block the district pillar because the P0 slice does not add a new Maps action. It blocks beach/access action layers and any new entity-specific routing.
