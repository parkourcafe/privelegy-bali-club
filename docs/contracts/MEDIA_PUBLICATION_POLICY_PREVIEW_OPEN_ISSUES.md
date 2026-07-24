# Preview open issues

## PREVIEW-BLOCKER-001 — Venue-photos positive sample unavailable

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

Resolution is now: provide a separate preview Supabase project/branch with the
approved QA subset (or approve a separately designed public-read preview
mechanism). Do not add service-role credentials or weaken the guard implicitly.

`vercel env ls` also reports no project environment variables. Once the
deployment is publicly reachable, the preview must receive only the approved
anon/public configuration and the non-production project-ref guard required by
`lib/supabase/server.ts`; without it the application correctly fails closed
instead of using mock data.

## Not blockers

Policy implementation and existing automated checks are green. No production,
database, storage, schema, route, redirect, money, or ranking changes were
made. The policy bridge still requires active + published venue context and an
exact current-project venue-bound URL; legacy hosts, arbitrary objects, and
hard-block statuses remain denied.
