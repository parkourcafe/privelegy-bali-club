# Other Bali platform architecture — 2026-07-15

Status: architecture checkpoint for the partner-platform loop. This document
describes the repository/runtime state inspected on 2026-07-15 and the
approved target boundary. It does not authorize a production migration,
deployment, publication, or TablePilot data write.

## Executive decision

Other Bali has four distinct surfaces and one external fulfilment boundary:

```text
Traveller         -> www.otherbali.com                  -> public published data
Restaurant owner  -> partners.otherbali.com             -> venue-scoped workspace
Other Bali team   -> admin.otherbali.com                 -> review/publish/operations
Developer/QA      -> review.otherbali.com                -> isolated preview/staging
Restaurant staff  -> TablePilot                          -> reservation system of record
```

The restaurant workspace is not the Other Bali operator admin, and a
reservation table must not be duplicated inside Other Bali. Other Bali owns
decision support, verified menus, action handoffs, attribution, and aggregate
reporting. TablePilot owns availability, reservations, confirmation, arrival,
completion, cancellation, and floor operations.

## Repository/runtime state found

### Public traveller surface — implemented

- `www.otherbali.com` serves the public catalogue and venue pages.
- Public structured menus are read only when the parent venue and menu are
  publishable, sourced, fresh, and verified.
- Actions are resolved from verified capabilities and handed off to TablePilot,
  official booking, delivery providers, WhatsApp, official websites, or Google
  Maps. Other Bali does not fulfil the order or booking.
- The live public site currently renders at least the published KYND menu; an
  exact current count still requires a fresh production SQL snapshot.

### Operator surface — implemented, but still a pilot control

`/admin` is an Other Bali-only Field Kit. It covers invitations, freshness and
publication review, photo review, QR/source operations, and aggregate reports.
It is protected by a shared Basic-auth secret (`ADMIN_ACCESS_TOKEN`), not by a
user/role model. Keep it as a break-glass path only while role-based access is
introduced.

### Restaurant surface — onboarding only

`/onboard/[token]` is a tokenized invitation flow, not a reusable account. A
holder can see a card preview, confirm the listing, submit a limited factual
menu/action draft, and submit photo choices. The token proves possession of a
link; it does not identify a person or establish a durable venue membership.

`/partner/[venue]` is named as a partner report, but it currently requires the
operator admin guard. A restaurant owner cannot sign in and cannot maintain a
menu, actions, photos, or reporting from a persistent workspace.

### Review surface — not release-safe

Review routes exist in the restaurateur-preview branch, but that branch is not
merged into the current default production branch. `review.otherbali.com` has
also been assigned to the same production deployment as `www.otherbali.com`;
the current review routes therefore return `404` when production is redeployed.
Review must be a separate Vercel project/environment with its own deployment,
secrets, data target, password gate, and `noindex` policy.

### Data boundary — live state not yet provable from this session

The Supabase connector available to this session does not expose production
project `egkdapqwkfprtyqvvnso`; only unrelated projects are visible. The
2026-07-14 read-only report is useful evidence of historical drift, but is not
a current schema snapshot. A new read-only SQL export is required before
applying Auth/RLS migrations or claiming exact production counts.

## Target route map

### Public traveller

```text
/places
/places/[slug]
/menus/[slug]
```

The public page shows only publishable content. It may show a badge such as
`Published · awaiting owner confirmation` when an operator has approved
official-source facts but the owner has not yet completed the confirmation.

### Authenticated restaurant workspace

```text
/partner/sign-in
/partner/claim/[token]             one-time claim only
/partner/venues/[slug]
/partner/venues/[slug]/preview    exact public-page preview
/partner/venues/[slug]/menu
/partner/venues/[slug]/actions
/partner/venues/[slug]/photos
/partner/venues/[slug]/bookings
/partner/venues/[slug]/analytics
/partner/venues/[slug]/approvals
```

The owner should use Supabase Auth magic-link/OTP. A one-time onboarding token
may claim an invitation, but it must not remain the long-term credential. Every
read and write must be scoped through a venue membership and RLS.

### Operator workspace

```text
/admin/venues
/admin/freshness
/admin/photos
/admin/approvals
/admin/bookings
/admin/analytics
```

The operator can review and publish; the owner can propose factual changes and
confirm ownership, but cannot publish editorial content or alter another venue.

### External reservation system

```text
Other Bali Reserve button
  -> TablePilot /book/[tablepilotSlug]?source=bali_privilege
  -> TablePilot staff dashboard marks confirmed/arrived/completed
  -> protected aggregate report to Other Bali
```

The Other Bali partner workspace can show aggregate counts and an explicit
`Open TablePilot dashboard` link. It must not mirror guest names, phone
numbers, payments, cancellation state, or table inventory into a second local
reservation table.

## State model

These are separate facts and must not be collapsed into `verifiedAt`:

```text
draft
  -> operator_reviewed
  -> published
  -> owner_confirmed       (independent confirmation, not a prerequisite for
                             official-source publication when policy permits)
  -> needs_correction
  -> stale / superseded
```

For photos, rights/consent is an additional independent gate. A photo may be
visible in a protected owner review gallery without becoming publicly usable.

## Required identity/data additions

The architecture already names `User / Role`, but the current runtime has no
durable restaurant identity or membership. The next schema change must be
forward-only and must be reviewed against the live migration history before it
is applied. Conceptually it needs:

- a venue membership mapping (`user_id`, `venue_slug`, role, status);
- a one-time claim record for onboarding invitations;
- operator/owner audit fields for review and confirmation;
- explicit content-version approval fields rather than overloading
  `verifiedAt`;
- RLS policies using authenticated ownership, not editable user metadata;
- server-only service-role access for operator publication actions.

Do not use a user-editable `user_metadata` value as an authorization claim.
Role data belongs in a server-controlled membership table or
`raw_app_meta_data`, with RLS predicates that also scope the venue.

## Fix order and release gates

### P0 — release and evidence boundary

1. Choose one protected production branch and require PR + CI before deploy.
2. Detach `review.otherbali.com` from the production Vercel project and pin it
   to an isolated review deployment.
3. Obtain a current read-only production SQL snapshot and reconcile migration
   history, especially duplicated legacy versions and the forward-repair range.

### P1 — partner identity and workspace

4. Add the reviewed Auth/membership migration after the live snapshot gate.
5. Convert `/onboard/[token]` into a one-time claim flow.
6. Add the persistent workspace and exact public preview.
7. Add full menu, action, and photo review/edit flows with draft-only writes.
8. Separate operator review, publication, owner confirmation, and photo rights.

### P2 — fulfilment and operations

9. Add the Bookings workspace card with TablePilot aggregate reporting and
   deep link to the staff dashboard.
10. Replace the shared operator Basic secret with authenticated roles, keeping
    a restricted break-glass path during migration.
11. Merge review features only after they run from the same release line and
    pass public, owner, operator, and TablePilot smoke checks.

## Acceptance criteria for the partner-platform release

- an owner can sign in without a long-lived bearer URL;
- an owner can see the exact public preview for only their venue;
- owner edits create draft versions and cannot publish directly;
- operator approval and owner confirmation are independently auditable;
- photos require their own rights/consent state;
- Reserve opens TablePilot and the owner can reach its staff dashboard;
- Other Bali stores only aggregate TablePilot proof, never guest PII;
- public pages show only publishable, fresh, source-backed data;
- review deployment cannot share production aliases, secrets, or write paths;
- every schema change has a forward migration, RLS tests, and a read-only
  production reconciliation before apply.

## Evidence files

- `Other_Bali_Master_Architecture.md`
- `docs/loop/RELEASE_RECONCILIATION_2026-07-14.md`
- `docs/tablepilot-bridge-handoff.md`
- `app/admin/page.tsx`
- `app/onboard/[token]/page.tsx`
- `app/partner/[venue]/page.tsx`
- `supabase/migrations/0011_partner_onboarding.sql`
