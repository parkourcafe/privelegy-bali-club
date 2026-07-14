# Privacy data operations

## Consent contract

`record_guest_consent(state, version, guestRef, userAgent)` is service-role only and append-only. A fresh `essential_only` choice creates no GuestRef. `analytics_allowed` requires a server-issued GuestRef plus a valid HMAC proof and records an analytics grant before event logging is enabled. Withdrawal records a denial when identity already exists; browser opt-out still succeeds if the evidence backend is temporarily unavailable.

Ordinary document requests never mint identity. Identity-bearing client actions are serialized across tabs with Web Locks, call the exact-same-origin `/api/guest/bootstrap` boundary, then perform the mutation under the same critical section. Browsers without Web Locks fail closed; an expiring IndexedDB/localStorage lease is not accepted because a suspended tab could outlive it and split identity. `GUEST_REF_SIGNING_SECRET` is mandatory and must contain at least 32 characters; `GUEST_REF_PREVIOUS_SIGNING_SECRET` is optional and exists only for a controlled real rotation.

Identity uses Secure, Path `/`, no-Domain `__Host-bp_guest` and `__Host-bp_guest_proof` cookies. The server parses the raw Cookie header and rejects duplicate protected names. It never adopts an unprefixed legacy GuestRef/proof into the protected session: a sibling-domain cookie cannot be distinguished from the old legitimate bearer value, so automatic migration would preserve session fixation. Bootstrap, export and deletion return a migration-required response without clearing or replacing that handle; old browser-linked data needs a separately approved support/migration/erasure procedure rather than either an unsafe automatic bridge or silent orphaning.

The GuestRef analytics-consent RPC accepts no IP address. The separate venue-photo rights flow stores a bounded request IP with exact-image consent evidence; its necessity, legal basis and retention remain explicit legal blockers.

The consent API reads at most 128 bytes of JSON and accepts exactly `{ "state": "essential_only" | "analytics_allowed" }`; extra client identifiers or metadata are rejected. Consent decisions use the effective call time and a deterministic tie-break so rapid grant/withdraw sequences still have one well-defined latest state.

## Export

`GET /api/privacy/export` derives GuestRef only from the two protected httpOnly identity/proof cookies. It never accepts an identifier from query or body. The versioned export includes identity metadata, consent history, first-party events, redemptions, saved places and owned shared lists. Export takes the same per-GuestRef database advisory lock as deletion, then rejects a tombstoned identity before reading. Responses are `no-store` attachments. A visitor without GuestRef receives the same valid empty shape and no identity is created; an unprefixed legacy bearer receives a fail-closed migration-required response.

## Deletion

`POST /api/privacy/delete` requires an exact matching `Origin` (and same-origin Fetch Metadata when present), then derives the current GuestRef from the signed cookies. SameSite alone is not treated as sibling-subdomain CSRF protection. The RPC response is the same whether user data existed or not.

Deletion semantics:

- dish-feedback rows are deleted because their metadata contains user-authored free text;
- owned shared-list snapshots are deleted;
- consent rows, redemptions and saved places cascade with GuestRef;
- remaining bounded usage events keep aggregate facts but the foreign key becomes `NULL`, irreversibly removing the GuestRef link;
- successful deletion clears GuestRef and consent cookies;
- a temporary database failure sets `essential_only` immediately but retains GuestRef so deletion can be retried.
- before deleting, the RPC inserts a SHA-256-only GuestRef tombstone under the same advisory lock used by writes; insert/update guards prevent late writes from resurrecting the deleted identity. The raw GuestRef is not stored in the tombstone table. Tombstone retention remains an owner/legal blocker and a safety rollback must not drop the barrier.

The `/privacy/choices` client stops first-party and Google Analytics sends before a withdrawal/deletion network round-trip, updates Google Consent Mode where available, and expires readable `_ga`, `_ga_*`, `_gid` and `_gat*` cookies across host/path variants. Browser cookie cleanup is best-effort by web-platform design; server-side deletion remains separately retryable.

## Event enforcement

`log_event_v3` is service-role only, requires the latest append-only analytics consent to be granted, validates bounded PII-free payloads and performs deduplication, a fixed 30-event/60-second GuestRef count and insertion under one transaction-level advisory lock. `capture_source_scan` performs source attribution through the same consent/rate/write boundary rather than mutating identity separately. Rate-limit parameters are not caller controlled. Clearing cookies can create a new GuestRef, so this protects only one identity from accidental/local bursts; edge/WAF global quotas and bot controls remain a launch blocker.

Migration `0037` fails early unless the tracked chain includes `events`, `guest_refs`, `consent_log` and `attribution_sources`. This avoids installing a late-bound PL/pgSQL function that would fail only on its first request.

Migration `0039` makes save desired-state idempotent, serializes source/list/delete/export operations on the GuestRef, admits only bounded published slugs to owned lists, enforces non-null list ownership, and installs the hash-only deletion barrier. Migration `0040` extends its service-only `release_readiness_v1` probe through the bounded onboarding schema. Migration `0041` adds `release_readiness_v2`; `/api/health/ready` requires its exact v2/`0041` success payload and fails on unresolved photo lifecycle data.

Consent evidence is idempotent for the same state/version and permits at most 20 ordinary recorded transitions per GuestRef in 24 hours. A grant at the cap fails closed. If the authoritative last state is granted, one additional emergency withdrawal row is allowed so the database state becomes denied; repeated withdrawals cannot grow the table. Dish feedback likewise requires a redemption and is idempotent at one row per GuestRef and venue.

## Guide-lead access and deletion

Migration `0038` revokes `submit_guide_lead` from `public`, `anon` and `authenticated`; only the server service role may execute it through the bounded `/api/guide-lead` route. The function keeps the existing one-row-per-contact deduplication and serializes a fixed 5-submission/15-minute counter with the upsert under one advisory lock. The counter lives on the existing contact row and stores no IP address or separate contact fingerprint.

Guide leads are contact records, not GuestRef records. `/api/privacy/export` and `/api/privacy/delete` therefore do not export or erase them. The manual rights-request path is:

1. the requester emails `support@otherbali.com` and identifies whether the form used email or WhatsApp;
2. an authorized operator locates the exact normalized contact but does not copy it into a public ticket or launch artifact;
3. the operator verifies control through the same stored contact channel before disclosing, correcting or deleting the matching row;
4. the operator records completion without retaining the exported lead in the request log.

An email from an unrelated address, knowledge of a contact value, or possession of a browser GuestRef does not prove that the requester controls that contact. The final verification script, response period, escalation owner and maximum retention period are owner/legal launch blockers. Until they are approved and staffed, the guide form must not be promoted as a launch acquisition surface.

## Venue-photo evidence and cleanup

Venue-photo submissions are not GuestRef records and are outside `/api/privacy/export` and `/api/privacy/delete`. Migration `0041` reserves a staging row, uploads to private Storage, first-writes a SHA-256 of the exact bytes and records exact submission consent before the row becomes reviewable. Approval and public delivery re-download the object and require the digest to match. The application service role has read-only table access; mutation is limited to row-locking RPCs.

An ambiguous upload response does not trigger immediate object deletion because the PUT may still commit late. It only writes an immutable cleanup-request time and returns processing; a bounded protected operator waits through the configured grace, repeats the consent-aware CAS, checks the Storage removal result and only then completes the durable `removed` state. Unconsented cleanup scrubs contact, IP and user-agent fields but keeps the lifecycle tombstone. Consented/reviewed evidence is never swept by this job. This recovery mechanism is not a legally approved retention policy.

All pre-`0041` rows enter `reconcile_required`. An operator must inspect the exact private object, record a digest when present, verify the exact consent link and resolve missing/unconsented state without inventing rights. The live audit's 91 existing draft-path images and 608 private candidates remain blocked from publication until that evidence exists.

## Production evidence still required

- staging RPC and route smoke results;
- production migration application record;
- complete production photo Storage/digest/consent reconciliation, protected cleanup schedule and aggregate dry/apply evidence;
- current production `GUEST_REF_SIGNING_SECRET` provisioning and a successful service/schema readiness probe;
- edge/WAF global quota and bot-control evidence for repeated fresh identities;
- an approved maximum retention/key policy for hash-only GuestRef tombstones;
- retention policy/owner decision for irreversibly anonymous aggregate events;
- guide-lead maximum retention, same-channel verification SOP and named operator owner;
- venue-photo contact/IP/object/consent/review/tombstone retention, representative rights-request SOP and named operator owner;
- final privacy controller/contact and App Store privacy answers.
