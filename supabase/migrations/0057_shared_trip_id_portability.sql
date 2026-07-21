-- Wave 1 production follow-up: Supabase installs pgcrypto outside `public`,
-- while this SECURITY DEFINER function intentionally has a restricted
-- search_path. Use PostgreSQL's built-in gen_random_uuid() instead of the
-- extension-only gen_random_bytes() so share IDs work without adding the
-- extensions schema to a privileged function's search path.

begin;

create or replace function public.create_shared_trip(p_guest_ref text)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_id text;
  v_slugs text[];
  v_entries jsonb;
begin
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$' then return null; end if;
  perform pg_advisory_xact_lock(hashtextextended('saved-trip:' || p_guest_ref, 0));
  select id into v_guest_id from public.guest_refs where ref = p_guest_ref;
  if v_guest_id is null then return null; end if;
  select array_agg(sp.venue_slug order by sp.day_number nulls first, sp.position nulls last, sp.created_at),
         jsonb_agg(jsonb_build_object('venue_slug', sp.venue_slug, 'day_number', sp.day_number,
           'position', coalesce(sp.position, row_number_value))
           order by sp.day_number nulls first, sp.position nulls last, sp.created_at)
    into v_slugs, v_entries
  from (
    select saved.*, row_number() over (order by saved.day_number nulls first, saved.position nulls last, saved.created_at)::int row_number_value
    from public.saved_places saved
    join public.venues v on v.slug = saved.venue_slug
    where saved.guest_ref_id = v_guest_id
      and v.status = 'active' and v.publication_status = 'published'
  ) sp;
  if v_slugs is null then return null; end if;
  v_id := 'l_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 24);
  insert into public.shared_lists(id, guest_ref_id, venue_slugs, trip_entries)
  values (v_id, v_guest_id, v_slugs, v_entries);
  return v_id;
end;
$$;

revoke all on function public.create_shared_trip(text) from public, anon, authenticated;
grant execute on function public.create_shared_trip(text) to service_role;

commit;
