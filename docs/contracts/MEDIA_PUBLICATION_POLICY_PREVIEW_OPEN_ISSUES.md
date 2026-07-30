# Preview open issues

## RESOLVED — Venue-photos positive sample unavailable

The explicit preview deployment is public and the application is reachable.
However, six migrated `venue-photos` slugs tested directly return the app's 404
state, and no `venue-photos` object appears in the sampled published cards. The
required 10-object sample (including six `/draft/` objects) cannot be accepted
without changing publication/data state.

Resolution: reconcile which active + published venues should carry the existing
current-project `venue-photos` URLs, then rerun this QA. Do not bypass policy,
activate 404 slugs, or use fixture data in preview.

### Reconciliation result

Read-only Supabase review confirms that all 91 already belong to active +
published venues and all 91 have exact object/submission mappings. No venue
status or mapping write is required. The remaining blocker is preview data
isolation: `lib/supabase/server.ts` rejects the known production project during
Vercel preview, and the Vercel project has no separate preview Supabase config.

Resolved with Supabase branch `mmhlvalhrebvsyehepos` and an approved 10-row
public-read database subset. The 10 exact image URLs render from the existing
public production bucket without service-role access or production writes.

## PARTIALLY RESOLVED — PREVIEW-ISSUE-002: Branch migration history drift

Automatic branch creation ended in `MIGRATIONS_FAILED`; only the early schema
was present. A branch-only minimal public-read media QA schema was applied.
Media acceptance is complete.

On 2026-07-30 the missing public-read `routes` and `route_stops` schema was
added to this preview branch only. The tables remain empty. The 10 original QA
rows had no mobile-deliverable Maps handoff, so the production-backed public
venue `milk-and-madu-ubud` was copied into preview as a bounded mobile
catalogue replica. Its publication provenance is owner-confirmed in migration
`0061`. No search URL was promoted to an exact place and no production write
occurred.

The current preview now returns HTTP 200 for live, ready, mobile config and
mobile bootstrap, with at least one deliverable venue. This resolves the
release-candidate runtime blocker. It does not repair the branch's historical
migration state: do not merge or promote the Supabase branch, and reconcile
production migration history before using preview-branch promotion as an
infrastructure workflow.

The preview deployment now receives the approved anon/public configuration and
passes the non-production project-ref guard in `lib/supabase/server.ts`. It
contains no service-role/admin secret. Without that bounded configuration the
application correctly fails closed instead of using mock data.

## Not blockers

Policy implementation and existing automated checks are green. No production,
database, storage, schema, route, redirect, money, or ranking changes were
made. The policy bridge still requires active + published venue context and an
exact current-project venue-bound URL; legacy hosts, arbitrary objects, and
hard-block statuses remain denied.
