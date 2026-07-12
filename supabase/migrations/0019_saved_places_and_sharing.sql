-- Traveller saves & sharing (master §6c). Anonymous by default: keyed by the
-- existing guest_refs (httpOnly cookie, guardrail #10 — no localStorage, no PII).
-- Written through SECURITY DEFINER RPCs like record_redemption, so the app never
-- needs the service_role secret. Tables have RLS enabled with NO policies —
-- direct anon access is denied; the definer RPCs are the only way in.
--
-- Manual release step: apply this migration in production Supabase after 0018.

create table if not exists saved_places (
  guest_ref_id uuid not null references guest_refs(id) on delete cascade,
  venue_slug   text not null,
  created_at   timestamptz not null default now(),
  primary key (guest_ref_id, venue_slug)
);
alter table saved_places enable row level security;

create table if not exists shared_lists (
  id           text primary key,
  guest_ref_id uuid references guest_refs(id) on delete set null,
  venue_slugs  text[] not null,
  created_at   timestamptz not null default now()
);
alter table shared_lists enable row level security;

-- Resolve-or-create the guest, then toggle a saved place. Returns { ok, saved }.
create or replace function public.toggle_saved_place(p_guest_ref text, p_venue_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_exists boolean;
begin
  if p_guest_ref is null or length(p_guest_ref) < 4 or coalesce(length(p_venue_slug), 0) = 0 then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  select id into v_guest_id from guest_refs where ref = p_guest_ref;
  if v_guest_id is null then
    insert into guest_refs(ref) values (p_guest_ref) returning id into v_guest_id;
  end if;

  select true into v_exists from saved_places
    where guest_ref_id = v_guest_id and venue_slug = p_venue_slug;

  if v_exists then
    delete from saved_places where guest_ref_id = v_guest_id and venue_slug = p_venue_slug;
    return jsonb_build_object('ok', true, 'saved', false);
  else
    insert into saved_places(guest_ref_id, venue_slug) values (v_guest_id, p_venue_slug);
    return jsonb_build_object('ok', true, 'saved', true);
  end if;
end;
$$;

-- The guest's saved venue slugs, newest first. Returns a jsonb array of text.
create or replace function public.saved_places_for(p_guest_ref text)
returns jsonb
language sql
security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(sp.venue_slug order by sp.created_at desc), '[]'::jsonb)
  from saved_places sp
  join guest_refs g on g.id = sp.guest_ref_id
  where g.ref = p_guest_ref;
$$;

-- Create a shareable, read-only list snapshot. Returns the new list id.
create or replace function public.create_shared_list(p_guest_ref text, p_slugs text[])
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_id text;
  v_slugs text[];
begin
  v_slugs := (select array_agg(s) from unnest(coalesce(p_slugs, '{}')) as s where coalesce(length(s), 0) > 0);
  if v_slugs is null or array_length(v_slugs, 1) is null then
    return null;
  end if;
  v_slugs := v_slugs[1:200]; -- cap

  select id into v_guest_id from guest_refs where ref = p_guest_ref;
  v_id := 'l_' || substr(md5(random()::text || clock_timestamp()::text), 1, 12);
  insert into shared_lists(id, guest_ref_id, venue_slugs) values (v_id, v_guest_id, v_slugs);
  return v_id;
end;
$$;

-- Read a shared list's venue slugs (public, read-only, no identity). jsonb array.
create or replace function public.shared_list_slugs(p_id text)
returns jsonb
language sql
security definer
set search_path = public, pg_temp
as $$
  select coalesce(to_jsonb(venue_slugs), '[]'::jsonb) from shared_lists where id = p_id;
$$;

revoke all on function public.toggle_saved_place(text, text) from public;
revoke all on function public.saved_places_for(text) from public;
revoke all on function public.create_shared_list(text, text[]) from public;
revoke all on function public.shared_list_slugs(text) from public;
grant execute on function public.toggle_saved_place(text, text) to anon, authenticated;
grant execute on function public.saved_places_for(text) to anon, authenticated;
grant execute on function public.create_shared_list(text, text[]) to anon, authenticated;
grant execute on function public.shared_list_slugs(text) to anon, authenticated;
