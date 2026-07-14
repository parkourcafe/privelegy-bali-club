-- Non-destructive operational rollback for migration 0041.
--
-- Restoring the 0033 functions would re-open direct DML, upload/consent races
-- and unverified byte replacement. Disable every photo mutation instead. The
-- lifecycle columns, digests, durable quota/tombstone rows, constraints and
-- integrity trigger remain intact so no evidence is discarded or guessed.

begin;

revoke all on table public.venue_photo_submissions
  from public, anon, authenticated, service_role;
grant select on table public.venue_photo_submissions to service_role;
revoke insert, update, delete on table public.consent_log from service_role;
grant select on table public.consent_log to service_role;

revoke all on function public.reserve_venue_photo_submission(uuid,text,text,text,text)
  from public, anon, authenticated, service_role;
revoke all on function public.mark_venue_photo_uploaded(uuid,text,text,text)
  from public, anon, authenticated, service_role;
revoke all on function public.record_venue_photo_consent(
  uuid[],text,text,text,text,text,inet
) from public, anon, authenticated, service_role;
revoke all on function public.request_venue_photo_cleanup(uuid,text,text,text)
  from public, anon, authenticated, service_role;
revoke all on function public.complete_venue_photo_cleanup(uuid,text,text,boolean)
  from public, anon, authenticated, service_role;
revoke all on function public.reconcile_venue_photo_storage(
  uuid,text,text,boolean,text
) from public, anon, authenticated, service_role;
revoke all on function public.reject_venue_photo_submission(uuid,text)
  from public, anon, authenticated, service_role;
revoke all on function public.approve_venue_photo_submission(uuid,text,text)
  from public, anon, authenticated, service_role;
revoke all on function public.release_readiness_v2()
  from public, anon, authenticated, service_role;

comment on function public.release_readiness_v2() is
  'Disabled by the non-destructive 0041 rollback; reapply 0041 before enabling photo mutations.';

commit;
