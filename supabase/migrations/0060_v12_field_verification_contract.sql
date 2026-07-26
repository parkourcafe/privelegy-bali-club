-- Owner-approved v1.2 evidence contract.
-- REVIEW ARTIFACT ONLY: historical duplicate migration numbers and the live
-- migration ledger must be reconciled before this file is applied anywhere.
-- Additive only; it does not replace venues, venue_fact_sources, action
-- capabilities, or submission-media evidence.

begin;

create table if not exists public.field_verifications (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null
    check (entity_type in ('place','place_action','place_media','event_occurrence')),
  entity_id text not null check (length(btrim(entity_id)) > 0),
  field_name text not null check (length(btrim(field_name)) > 0),
  source_url text not null check (source_url ~ '^https://[^[:space:]]+$'),
  source_type text not null
    check (source_type in ('official','partner','editorial','provider')),
  verified_at timestamptz not null,
  expires_at timestamptz,
  confidence text not null check (confidence in ('low','medium','high')),
  status text not null
    check (status in ('unverified','needs_review','verified','expired','rejected')),
  conflict_group_id uuid,
  created_at timestamptz not null default now(),
  check (expires_at is null or expires_at > verified_at),
  check (status <> 'verified' or confidence in ('medium','high'))
);

create unique index if not exists field_verifications_version_key
  on public.field_verifications(entity_type, entity_id, field_name, verified_at, source_url);
create index if not exists field_verifications_public_resolution
  on public.field_verifications(entity_type, entity_id, field_name, status, expires_at);
create index if not exists field_verifications_conflicts
  on public.field_verifications(conflict_group_id)
  where conflict_group_id is not null;

alter table public.field_verifications enable row level security;
revoke all on table public.field_verifications from public, anon, authenticated;
grant select, insert, update on table public.field_verifications to service_role;

-- Read-only compatibility projection: the v1.2 PlaceAction contract is backed
-- by the existing canonical capability table, not a second action model.
create or replace view public.place_actions_v1_2
with (security_invoker = true)
as
select
  capability.id,
  capability.venue_slug as place_id,
  case capability.kind
    when 'reserve' then 'booking'
    when 'maps' then 'directions'
    else capability.kind
  end as action_type,
  capability.label,
  capability.url,
  capability.provider,
  null::text as target_entity_id,
  capability.provider in ('tablepilot','official','whatsapp') as is_official,
  capability.status = 'confirmed'
    and capability.verified_at is not null
    and capability.expires_at > now() as is_verified,
  case
    when capability.status in ('disabled','archived') then 'rejected'
    when capability.verified_at is null then 'needs_review'
    when capability.expires_at <= now() then 'expired'
    when capability.status = 'confirmed' then 'verified'
    else 'unverified'
  end as verification_status,
  capability.verified_at as last_checked_at,
  null::text as availability,
  capability.priority as display_priority,
  capability.source_url,
  'not_applicable'::text as rights_status,
  null::text as failure_reason
from public.venue_action_capabilities capability;

revoke all on public.place_actions_v1_2 from public, anon, authenticated;
grant select on public.place_actions_v1_2 to service_role;

commit;
