-- Non-destructive operational rollback for migration 0039.
--
-- Switch the application away from saves, source capture and list creation
-- before running this file. The erasure tombstones, write guards, owned-list
-- constraint, route-rank constraint and privacy export/deletion RPCs are
-- deliberately retained. Removing or weakening them would resurrect deleted
-- identities, orphan guest-created content, or disable data-subject rights.

begin;

revoke all on function public.set_saved_place(text,text,boolean)
  from public, anon, authenticated, service_role;
revoke all on function public.capture_source_scan(text,text)
  from public, anon, authenticated, service_role;
revoke all on function public.create_shared_list(text,text[])
  from public, anon, authenticated, service_role;
revoke all on function public.release_readiness_v1()
  from public, anon, authenticated, service_role;

-- Keep export_guest_data and delete_guest_data service-only and callable so an
-- application rollback never disables access/erasure. Keep all tables,
-- triggers, constraints and tombstone rows in place.

commit;
