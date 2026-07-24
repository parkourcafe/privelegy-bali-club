#!/usr/bin/env bash
set -euo pipefail

command -v docker >/dev/null 2>&1 || { echo "error: docker is required" >&2; exit 1; }

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
migration="$repo_root/supabase/migrations/0058_shortlist_generated_event.sql"
container="otherbali-wave2-event-smoke-${$}-$(date +%s)"
cleanup() { docker rm -f "$container" >/dev/null 2>&1 || true; }
trap cleanup EXIT INT TERM

docker run --detach --name "$container" \
  --env POSTGRES_PASSWORD=wave2-smoke \
  --env POSTGRES_DB=otherbali_smoke \
  postgres:17-alpine >/dev/null

for _ in $(seq 1 60); do
  docker exec "$container" pg_isready -U postgres -d otherbali_smoke >/dev/null 2>&1 && break
  sleep 1
done
docker exec "$container" pg_isready -U postgres -d otherbali_smoke >/dev/null

docker exec -i "$container" psql -v ON_ERROR_STOP=1 -U postgres -d otherbali_smoke <<'SQL'
create role anon nologin;
create role authenticated nologin;
create role service_role nologin;
create table public.guest_refs (id uuid primary key default gen_random_uuid(), ref text unique not null);
create table public.attribution_sources (id text primary key, active boolean not null default true);
create table public.events (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  guest_ref_id uuid references public.guest_refs(id),
  venue_slug text,
  source text,
  ts timestamptz not null default now()
);
SQL

docker exec -i "$container" psql -v ON_ERROR_STOP=1 -U postgres -d otherbali_smoke < "$migration"

docker exec -i "$container" psql -v ON_ERROR_STOP=1 -U postgres -d otherbali_smoke <<'SQL'
insert into public.guest_refs(ref) values ('g_1234567890abcdef');
select public.log_event('shortlist_generated', 'g_1234567890abcdef', 'start-shortlist/canggu', null);
select public.log_event('not_allowed', 'g_1234567890abcdef', 'start-shortlist/canggu', null);

do $assertions$
begin
  if (select count(*) from public.events) <> 1
     or not exists (select 1 from public.events where type = 'shortlist_generated' and venue_slug = 'start-shortlist/canggu') then
    raise exception 'bounded shortlist event was not stored exactly once';
  end if;
  if has_function_privilege('anon', 'public.log_event(text,text,text,text)', 'EXECUTE')
     or has_function_privilege('authenticated', 'public.log_event(text,text,text,text)', 'EXECUTE')
     or not has_function_privilege('service_role', 'public.log_event(text,text,text,text)', 'EXECUTE') then
    raise exception 'unexpected log_event grants';
  end if;
end;
$assertions$;
SQL

echo "Wave 2 event database smoke test passed."
