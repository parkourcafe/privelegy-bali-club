# Partner Auth/RLS staging rehearsal — 2026-07-15

Status: disposable local staging pass; production remains untouched.

## Production read-only preflight

The Supabase connector was asked for the following against production project
`egkdapqwkfprtyqvvnso`:

- migration history;
- verbose public table/column inventory;
- development branches.

All three operations returned `MCP error -32600: You do not have permission to
perform this action`. No production query or write was performed. The available
Supabase account lists only unrelated projects, so the 2026-07-14 report
remains historical evidence rather than a fresh snapshot.

## Disposable staging target

Target: local PostgreSQL 16.14 container `otherbali-release-pg3-20260714`,
database `otherbali_partner_stage_20260715`.

The database was created as a new database and received a schema-only dump from
the existing release rehearsal database. It contains no production data. A
minimal local `auth.users` table was added solely to exercise the foreign keys;
this is not a Supabase Auth production snapshot.

Migration applied:

```text
supabase/migrations/0035_partner_portal_identity.sql
```

The migration uses the repository's four-digit `NNNN_name.sql` convention;
the earlier timestamp filename was renamed before any hosted migration apply.

Apply result: `BEGIN`, all tables/indexes/columns/grants/comments created, and
`COMMIT` with no error.

## Assertions

Passed:

- `venue_memberships` exists and has RLS enabled;
- `venue_onboarding_claims` exists and has RLS enabled;
- `menus`, `venue_action_capabilities`, and `venue_photo_submissions` have the
  new operator-review and owner-confirmation columns;
- `anon`/`authenticated` have no table privileges for membership/claim tables;
- `service_role` has the intended CRUD privileges;
- service-role insert of a test membership and hashed claim succeeds;
- an authenticated-role select/insert attempt fails with permission denied;
- unique membership and hashed-claim indexes exist.

The local target was not connected to the public site, production Supabase,
TablePilot, or any external provider. No production Auth user or venue record
was created.

## Remaining gate

Before applying this migration to any hosted target:

1. obtain a current read-only production SQL snapshot from an account with
   access to `egkdapqwkfprtyqvvnso`;
2. reconcile the live migration ledger with repository forward migrations;
3. replay the complete prerequisite schema on a fresh hosted staging project;
4. run Auth callback, membership RLS, one-time claim, public suppression, and
   operator publish tests there;
5. only then request a separate production approval.
