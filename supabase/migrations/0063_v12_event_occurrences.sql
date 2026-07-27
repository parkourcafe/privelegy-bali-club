-- v1.2 verified event occurrences. Events are distinct from analytics events.
-- Default-deny: public/mobile reads go through the server API and service role.
begin;

create table if not exists public.v12_event_occurrences (
  id uuid primary key default gen_random_uuid(),
  event_id text not null check (length(btrim(event_id)) between 1 and 160),
  title text not null check (length(btrim(title)) between 1 and 200),
  venue_slug text references public.venues(slug) on update cascade on delete set null,
  area text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled','cancelled')),
  source_url text not null check (source_url ~* '^https://'),
  last_verified_at timestamptz not null,
  expires_at timestamptz not null,
  publication_status text not null default 'review'
    check (publication_status in ('draft','review','published','rejected')),
  cancellation_reason text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (event_id, starts_at),
  check (ends_at > starts_at),
  check (expires_at > last_verified_at),
  check (status <> 'cancelled' or cancellation_reason is not null)
);

create index if not exists v12_event_occurrences_active
  on public.v12_event_occurrences(starts_at, ends_at)
  where status = 'scheduled' and publication_status = 'published';

alter table public.v12_event_occurrences enable row level security;
revoke all on public.v12_event_occurrences from public, anon, authenticated;
grant select, insert, update, delete on public.v12_event_occurrences to service_role;

commit;
