-- Wave 1 T2/T9: extend SavedPlace and SharedList into an anonymous itinerary.
-- This is additive and backward-compatible with legacy slug-only shared lists.
-- Rollout order is migration first, then application deploy. Apply to
-- production separately only after verification and explicit approval.

begin;

alter table public.saved_places
  add column if not exists day_number smallint,
  add column if not exists position integer;

alter table public.shared_lists
  add column if not exists trip_entries jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.saved_places'::regclass
      and conname = 'saved_places_day_number_check'
  ) then
    alter table public.saved_places
      add constraint saved_places_day_number_check
      check (day_number is null or day_number between 1 and 30);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.saved_places'::regclass
      and conname = 'saved_places_position_check'
  ) then
    alter table public.saved_places
      add constraint saved_places_position_check
      check (position is null or position > 0);
  end if;
end;
$$;

create index if not exists saved_places_guest_day_position_idx
  on public.saved_places(guest_ref_id, day_number, position, created_at);

create or replace function public.set_saved_place(
  p_guest_ref text,
  p_venue_slug text,
  p_saved boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
begin
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
     or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
     or length(p_venue_slug) > 160
     or p_saved is null then
    return jsonb_build_object('ok', false, 'saved', false, 'error', 'bad_request');
  end if;
  if p_saved and not exists (
    select 1 from public.venues
    where slug = p_venue_slug and status = 'active' and publication_status = 'published'
  ) then
    return jsonb_build_object('ok', false, 'saved', false, 'error', 'venue_unavailable');
  end if;

  perform pg_advisory_xact_lock(hashtextextended('saved-place:' || p_guest_ref || ':' || p_venue_slug, 0));
  select id into v_guest_id from public.guest_refs where ref = p_guest_ref;
  if v_guest_id is null and p_saved then
    insert into public.guest_refs(ref) values (p_guest_ref) returning id into v_guest_id;
  end if;
  if v_guest_id is null then
    return jsonb_build_object('ok', true, 'saved', false);
  end if;

  if p_saved then
    insert into public.saved_places(guest_ref_id, venue_slug)
    values (v_guest_id, p_venue_slug)
    on conflict (guest_ref_id, venue_slug) do nothing;
  else
    delete from public.saved_places
    where guest_ref_id = v_guest_id and venue_slug = p_venue_slug;
  end if;
  return jsonb_build_object('ok', true, 'saved', p_saved);
end;
$$;

create or replace function public.saved_trip_for(p_guest_ref text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$' then return '[]'::jsonb; end if;
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'venue_slug', sp.venue_slug,
      'day_number', sp.day_number,
      'position', coalesce(sp.position, 2147483647)
    ) order by sp.day_number nulls first, sp.position nulls last, sp.created_at), '[]'::jsonb)
    from public.saved_places sp
    join public.guest_refs g on g.id = sp.guest_ref_id
    join public.venues v on v.slug = sp.venue_slug
    where g.ref = p_guest_ref and v.status = 'active' and v.publication_status = 'published'
  );
end;
$$;

create or replace function public.upsert_trip_place(
  p_guest_ref text,
  p_venue_slug text,
  p_day_number smallint
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_position integer;
  v_existing_day smallint;
  v_existing_position integer;
  v_exists boolean;
begin
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
     or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
     or length(p_venue_slug) > 160
     or p_day_number is null or p_day_number not between 1 and 30 then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;
  if not exists (
    select 1 from public.venues
    where slug = p_venue_slug and status = 'active' and publication_status = 'published'
  ) then
    return jsonb_build_object('ok', false, 'error', 'venue_unavailable');
  end if;

  perform pg_advisory_xact_lock(hashtextextended('saved-trip:' || p_guest_ref, 0));
  select id into v_guest_id from public.guest_refs where ref = p_guest_ref;
  if v_guest_id is null then
    insert into public.guest_refs(ref) values (p_guest_ref) returning id into v_guest_id;
  end if;
  select day_number, position into v_existing_day, v_existing_position
  from public.saved_places
  where guest_ref_id = v_guest_id and venue_slug = p_venue_slug;
  v_exists := found;
  if v_exists and v_existing_day = p_day_number then
    return jsonb_build_object(
      'ok', true, 'saved', true, 'day', p_day_number, 'position', v_existing_position
    );
  end if;
  select coalesce(max(position), 0) + 1 into v_position
  from public.saved_places
  where guest_ref_id = v_guest_id and day_number = p_day_number;

  insert into public.saved_places(guest_ref_id, venue_slug, day_number, position)
  values (v_guest_id, p_venue_slug, p_day_number, v_position)
  on conflict (guest_ref_id, venue_slug) do update
    set day_number = excluded.day_number, position = excluded.position;
  return jsonb_build_object('ok', true, 'saved', true, 'day', p_day_number, 'position', v_position);
end;
$$;

create or replace function public.move_trip_place(
  p_guest_ref text,
  p_venue_slug text,
  p_day_number smallint
)
returns jsonb
language sql
security definer
set search_path = public, pg_temp
as $$
  select public.upsert_trip_place(p_guest_ref, p_venue_slug, p_day_number);
$$;

create or replace function public.reorder_trip_place(
  p_guest_ref text,
  p_venue_slug text,
  p_direction text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_day smallint;
  v_position integer;
  v_other_slug text;
  v_other_position integer;
begin
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
     or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
     or length(p_venue_slug) > 160 then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;
  if p_direction not in ('up', 'down') then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;
  perform pg_advisory_xact_lock(hashtextextended('saved-trip:' || p_guest_ref, 0));
  select g.id, sp.day_number, sp.position into v_guest_id, v_day, v_position
  from public.guest_refs g join public.saved_places sp on sp.guest_ref_id = g.id
  where g.ref = p_guest_ref and sp.venue_slug = p_venue_slug and sp.day_number is not null;
  if v_guest_id is null then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;

  if p_direction = 'up' then
    select venue_slug, position into v_other_slug, v_other_position
    from public.saved_places
    where guest_ref_id = v_guest_id and day_number = v_day and position < v_position
    order by position desc limit 1;
  else
    select venue_slug, position into v_other_slug, v_other_position
    from public.saved_places
    where guest_ref_id = v_guest_id and day_number = v_day and position > v_position
    order by position limit 1;
  end if;
  if v_other_slug is null then return jsonb_build_object('ok', true, 'moved', false); end if;
  update public.saved_places set position = case
    when venue_slug = p_venue_slug then v_other_position else v_position end
  where guest_ref_id = v_guest_id and venue_slug in (p_venue_slug, v_other_slug);
  return jsonb_build_object('ok', true, 'moved', true);
end;
$$;

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
  v_id := 'l_' || substr(encode(gen_random_bytes(16), 'hex'), 1, 24);
  insert into public.shared_lists(id, guest_ref_id, venue_slugs, trip_entries)
  values (v_id, v_guest_id, v_slugs, v_entries);
  return v_id;
end;
$$;

create or replace function public.shared_list_trip(p_id text)
returns jsonb
language sql
security definer
set search_path = public, pg_temp
as $$
  select coalesce(sl.trip_entries, (
    select coalesce(jsonb_agg(jsonb_build_object(
      'venue_slug', legacy.slug, 'day_number', null, 'position', legacy.ordinality
    ) order by legacy.ordinality), '[]'::jsonb)
    from unnest(sl.venue_slugs) with ordinality as legacy(slug, ordinality)
  ), '[]'::jsonb)
  from public.shared_lists sl
  where p_id ~ '^l_[a-f0-9]{12,24}$' and sl.id = p_id;
$$;

-- Extend the existing bounded, payload-free growth event path. The route is
-- consent-gated and invokes this RPC only through the server service client.
create or replace function public.log_event(
  p_type text,
  p_guest_ref text,
  p_venue_slug text,
  p_source text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  if p_type not in (
    'source_scan','landing_open','venue_card_open','perk_open',
    'direction_click','reservation_click','similar_open','district_open',
    'district_page_view','editorial_page_view','venue_detail_view',
    'venue_card_click','booking_click','official_website_click',
    'instagram_click','menu_click','partner_offer_click',
    'guide_form_started','guide_form_submitted','whatsapp_guide_click',
    'internal_guide_click','menu_open','menu_item_open','action_handoff',
    'delivery_click','takeaway_click','preorder_click','save','route_add'
  )
    or (p_guest_ref is not null and p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$')
    or (p_venue_slug is not null and (
      length(p_venue_slug) > 120
      or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$'
    )) then
    return;
  end if;
  if p_source is not null and not exists (
    select 1 from public.attribution_sources s where s.id = p_source and s.active
  ) then
    return;
  end if;
  if p_type = 'source_scan' and p_source is null then return; end if;

  select id into v_id from public.guest_refs where ref = p_guest_ref;
  if exists (
    select 1 from public.events e
    where e.type = p_type
      and e.guest_ref_id is not distinct from v_id
      and e.venue_slug is not distinct from p_venue_slug
      and e.source is not distinct from p_source
      and e.ts > clock_timestamp() - interval '5 seconds'
  ) then return; end if;
  insert into public.events(type, guest_ref_id, venue_slug, source)
  values (p_type, v_id, p_venue_slug, p_source);
end;
$$;

revoke all on function public.set_saved_place(text,text,boolean) from public, anon, authenticated;
revoke all on function public.saved_trip_for(text) from public, anon, authenticated;
revoke all on function public.upsert_trip_place(text,text,smallint) from public, anon, authenticated;
revoke all on function public.move_trip_place(text,text,smallint) from public, anon, authenticated;
revoke all on function public.reorder_trip_place(text,text,text) from public, anon, authenticated;
revoke all on function public.create_shared_trip(text) from public, anon, authenticated;
revoke all on function public.shared_list_trip(text) from public, anon, authenticated;
revoke all on function public.log_event(text,text,text,text) from public, anon, authenticated;
grant execute on function public.set_saved_place(text,text,boolean) to service_role;
grant execute on function public.saved_trip_for(text) to service_role;
grant execute on function public.upsert_trip_place(text,text,smallint) to service_role;
grant execute on function public.move_trip_place(text,text,smallint) to service_role;
grant execute on function public.reorder_trip_place(text,text,text) to service_role;
grant execute on function public.create_shared_trip(text) to service_role;
grant execute on function public.shared_list_trip(text) to service_role;
grant execute on function public.log_event(text,text,text,text) to service_role;

commit;
