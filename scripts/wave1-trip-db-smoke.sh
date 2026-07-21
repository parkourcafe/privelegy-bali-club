#!/usr/bin/env bash
set -euo pipefail

command -v docker >/dev/null 2>&1 || {
  echo "error: docker is required" >&2
  exit 1
}

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
migration="$repo_root/supabase/migrations/0056_saved_place_trip_extension.sql"
container="otherbali-wave1-trip-smoke-${$}-$(date +%s)"

cleanup() {
  docker rm -f "$container" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

docker run --detach --name "$container" \
  --env POSTGRES_PASSWORD=wave1-smoke \
  --env POSTGRES_DB=otherbali_smoke \
  postgres:17-alpine >/dev/null

for _ in $(seq 1 60); do
  if docker exec "$container" pg_isready -U postgres -d otherbali_smoke >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
docker exec "$container" pg_isready -U postgres -d otherbali_smoke >/dev/null

docker exec -i "$container" psql -v ON_ERROR_STOP=1 -U postgres -d otherbali_smoke <<'SQL'
create role anon nologin;
create role authenticated nologin;
create role service_role nologin;
create extension if not exists pgcrypto;

create table public.venues (
  id text primary key,
  slug text unique not null,
  name text not null,
  status text not null,
  publication_status text not null
);
create table public.guest_refs (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  created_at timestamptz not null default now()
);
create table public.saved_places (
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  venue_slug text not null,
  created_at timestamptz not null default now(),
  primary key (guest_ref_id, venue_slug)
);
create table public.shared_lists (
  id text primary key,
  guest_ref_id uuid references public.guest_refs(id) on delete set null,
  venue_slugs text[] not null,
  created_at timestamptz not null default now()
);
create table public.attribution_sources (
  id text primary key,
  active boolean not null default true
);
create table public.events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  guest_ref_id uuid references public.guest_refs(id) on delete set null,
  venue_slug text,
  source text,
  ts timestamptz not null default now()
);
SQL

docker exec -i "$container" psql -v ON_ERROR_STOP=1 -U postgres -d otherbali_smoke < "$migration"

docker exec -i "$container" psql -v ON_ERROR_STOP=1 -U postgres -d otherbali_smoke <<'SQL'
insert into public.venues(id, slug, name, status, publication_status) values
  ('v-published-1', 'published-one', 'Published One', 'active', 'published'),
  ('v-published-2', 'published-two', 'Published Two', 'active', 'published'),
  ('v-review', 'review-only', 'Review Only', 'active', 'review');

do $assertions$
declare
  guest constant text := 'g_1234567890abcdef';
  result jsonb;
  first_position integer;
  shared_id text;
  shared_trip jsonb;
  legacy_trip jsonb;
  fn regprocedure;
begin
  foreach fn in array array[
    'public.set_saved_place(text,text,boolean)'::regprocedure,
    'public.saved_trip_for(text)'::regprocedure,
    'public.upsert_trip_place(text,text,smallint)'::regprocedure,
    'public.move_trip_place(text,text,smallint)'::regprocedure,
    'public.reorder_trip_place(text,text,text)'::regprocedure,
    'public.create_shared_trip(text)'::regprocedure,
    'public.shared_list_trip(text)'::regprocedure,
    'public.log_event(text,text,text,text)'::regprocedure
  ] loop
    if has_function_privilege('anon', fn, 'EXECUTE')
       or has_function_privilege('authenticated', fn, 'EXECUTE')
       or not has_function_privilege('service_role', fn, 'EXECUTE') then
      raise exception 'unexpected grants for %', fn;
    end if;
  end loop;

  result := public.upsert_trip_place(guest, 'published-one', 1::smallint);
  if result ->> 'ok' <> 'true' or result ->> 'position' <> '1' then
    raise exception 'published venue was not accepted: %', result;
  end if;
  result := public.upsert_trip_place(guest, 'review-only', 1::smallint);
  if result ->> 'error' <> 'venue_unavailable' then
    raise exception 'review venue was not rejected: %', result;
  end if;

  perform public.upsert_trip_place(guest, 'published-two', 1::smallint);
  select position into first_position
  from public.saved_places sp join public.guest_refs g on g.id = sp.guest_ref_id
  where g.ref = guest and sp.venue_slug = 'published-one';
  result := public.upsert_trip_place(guest, 'published-one', 1::smallint);
  if (result ->> 'position')::integer <> first_position then
    raise exception 'same-day retry changed position: before %, result %', first_position, result;
  end if;

  result := public.reorder_trip_place(guest, 'published-two', 'up');
  if result ->> 'moved' <> 'true' then
    raise exception 'reorder did not move: %', result;
  end if;
  if not exists (
    select 1 from public.saved_places sp join public.guest_refs g on g.id = sp.guest_ref_id
    where g.ref = guest and sp.venue_slug = 'published-two' and sp.position = 1
  ) then
    raise exception 'reorder did not swap positions';
  end if;

  shared_id := public.create_shared_trip(guest);
  shared_trip := public.shared_list_trip(shared_id);
  if shared_id !~ '^l_[a-f0-9]{24}$'
     or jsonb_array_length(shared_trip) <> 2
     or shared_trip #>> '{0,venue_slug}' <> 'published-two'
     or shared_trip #>> '{1,venue_slug}' <> 'published-one' then
    raise exception 'new shared snapshot is invalid: id %, trip %', shared_id, shared_trip;
  end if;

  insert into public.shared_lists(id, guest_ref_id, venue_slugs)
  select 'l_1234567890ab', id, array['published-one', 'published-two']
  from public.guest_refs where ref = guest;
  legacy_trip := public.shared_list_trip('l_1234567890ab');
  if jsonb_array_length(legacy_trip) <> 2
     or legacy_trip #>> '{0,venue_slug}' <> 'published-one'
     or legacy_trip #>> '{0,position}' <> '1'
     or legacy_trip #> '{0,day_number}' <> 'null'::jsonb then
    raise exception 'legacy shared snapshot is invalid: %', legacy_trip;
  end if;
end;
$assertions$;

do $anon_denial$
declare
  denied boolean := false;
begin
  begin
    set local role anon;
    perform public.saved_trip_for('g_1234567890abcdef');
  exception when insufficient_privilege then
    denied := true;
  end;
  reset role;
  if not denied then
    raise exception 'anon unexpectedly executed saved_trip_for';
  end if;
end;
$anon_denial$;
SQL

echo "Wave 1 trip database smoke test passed."
