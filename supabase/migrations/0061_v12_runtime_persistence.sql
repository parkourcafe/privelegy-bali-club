-- v1.2 anonymous runtime persistence.
-- APPLY ORDER: reconcile the live ledger, apply 0060, then apply this file,
-- deploy the API routes last. This file is not evidence of production apply.
begin;

create table if not exists public.v12_decision_runs (
  id uuid primary key default gen_random_uuid(),
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  context jsonb not null check (jsonb_typeof(context) = 'object' and pg_column_size(context) <= 16384),
  result jsonb not null check (jsonb_typeof(result) = 'object'),
  policy_version text not null default 'v1-editorial',
  facts_as_of timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 minutes'),
  created_at timestamptz not null default now()
);

create table if not exists public.v12_feed_sessions (
  id uuid primary key default gen_random_uuid(),
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  feed_type text not null check (feed_type in (
    'for_you','near_you','open_now','sunset_tonight','rainy_day',
    'new_on_other_bali','worth_the_drive','quiet_places','with_kids',
    'under_budget','saved_by_you','similar_to_places_you_loved'
  )),
  active_context jsonb not null default '{}' check (jsonb_typeof(active_context) = 'object' and pg_column_size(active_context) <= 16384),
  last_seen_entity_id text,
  in_session_position integer not null default 0 check (in_session_position >= 0),
  cross_session_resume_position integer not null default 0 check (cross_session_resume_position >= 0),
  cursor integer not null default 0 check (cursor >= 0),
  version bigint not null default 1,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists v12_feed_sessions_guest_updated
  on public.v12_feed_sessions(guest_ref_id, updated_at desc);

create table if not exists public.v12_today_sessions (
  id uuid primary key default gen_random_uuid(),
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  context jsonb not null default '{}' check (jsonb_typeof(context) = 'object'),
  selected_state jsonb not null default '{}' check (jsonb_typeof(selected_state) = 'object' and pg_column_size(selected_state) <= 16384),
  plan jsonb not null default '{"orderedStops":[],"alternatives":[],"state":"draft"}'
    check (jsonb_typeof(plan) = 'object' and pg_column_size(plan) <= 49152),
  result_version text not null default 'v1',
  version bigint not null default 1,
  expires_at timestamptz not null default (now() + interval '36 hours'),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.v12_trips (
  id uuid primary key default gen_random_uuid(),
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 120),
  start_date date not null,
  end_date date not null,
  home_area text,
  travel_style text,
  state jsonb not null default '{"days":[]}' check (jsonb_typeof(state) = 'object'),
  status text not null default 'draft' check (status in ('draft','active','completed','archived')),
  version bigint not null default 1,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  check (end_date >= start_date and end_date - start_date <= 30)
);
create index if not exists v12_trips_guest_updated on public.v12_trips(guest_ref_id, updated_at desc);

create table if not exists public.v12_sync_mutations (
  id uuid primary key default gen_random_uuid(),
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  idempotency_key text not null check (length(idempotency_key) between 1 and 160),
  entity_type text not null check (entity_type in ('saved','visited','note','trip_stop')),
  entity_id text not null check (length(entity_id) between 1 and 200),
  operation text not null check (length(operation) between 1 and 80),
  payload jsonb not null default '{}' check (jsonb_typeof(payload) = 'object' and pg_column_size(payload) <= 16384),
  base_version text,
  status text not null default 'accepted' check (status in ('accepted','applied','conflict')),
  server_version bigint not null,
  created_at timestamptz not null default now(),
  unique (guest_ref_id, idempotency_key)
);

create table if not exists public.v12_runtime_idempotency (
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  idempotency_key text not null check (length(idempotency_key) between 1 and 160),
  operation text not null,
  response jsonb not null,
  created_at timestamptz not null default now(),
  primary key (guest_ref_id, idempotency_key)
);

alter table public.v12_decision_runs enable row level security;
alter table public.v12_feed_sessions enable row level security;
alter table public.v12_today_sessions enable row level security;
alter table public.v12_trips enable row level security;
alter table public.v12_sync_mutations enable row level security;
alter table public.v12_runtime_idempotency enable row level security;
revoke all on public.v12_decision_runs, public.v12_feed_sessions,
  public.v12_today_sessions, public.v12_trips, public.v12_sync_mutations,
  public.v12_runtime_idempotency from public, anon, authenticated;
grant select, insert, update, delete on public.v12_decision_runs,
  public.v12_feed_sessions, public.v12_today_sessions, public.v12_trips,
  public.v12_sync_mutations, public.v12_runtime_idempotency to service_role;

create or replace function public.v12_runtime_mutate(
  p_guest_ref text,
  p_operation text,
  p_input jsonb,
  p_idempotency_key text
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_id uuid;
  v_response jsonb;
  v_existing jsonb;
  v_existing_operation text;
  v_version bigint;
  v_context jsonb;
begin
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
     or p_operation not in ('decision.create','feed.create','feed.update','today.create',
       'today.update','trip.create','trip.update','sync.push')
     or p_idempotency_key is null or length(p_idempotency_key) not between 1 and 160
     or jsonb_typeof(p_input) <> 'object' or pg_column_size(p_input) > 49152 then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;
  perform pg_advisory_xact_lock(hashtextextended('v12:' || p_guest_ref || ':' || p_idempotency_key, 0));
  select id into v_guest_id from public.guest_refs where ref = p_guest_ref;
  if v_guest_id is null then
    insert into public.guest_refs(ref) values (p_guest_ref) returning id into v_guest_id;
  end if;
  select operation, response into v_existing_operation, v_existing
    from public.v12_runtime_idempotency
    where guest_ref_id = v_guest_id and idempotency_key = p_idempotency_key;
  if v_existing is not null then
    if v_existing_operation <> p_operation then
      return jsonb_build_object('ok', false, 'error', 'idempotency_conflict');
    end if;
    return v_existing || '{"replayed":true}'::jsonb;
  end if;

  if p_operation = 'decision.create' then
    v_context := coalesce(p_input->'context', p_input);
    if jsonb_typeof(v_context) <> 'object' or pg_column_size(v_context) > 16384 then
      return jsonb_build_object('ok', false, 'error', 'bad_request');
    end if;
    with candidates as (
      select v.slug, v.name, v.why_its_here, v.best_for, v.not_for,
        row_number() over (order by v.tier asc, v.name asc, v.slug asc) as rn
      from public.venues v
      where v.status = 'active' and v.publication_status = 'published'
        and (coalesce(v_context->>'area','') = '' or v.district = v_context->>'area' or v.area = v_context->>'area')
        and (coalesce(v_context->>'moment','') = '' or v.jobs @> array[v_context->>'moment'])
      limit 3
    ), result as (
      select jsonb_build_object(
        'bestFit', (select jsonb_build_object('placeId',slug,'name',name,'why',why_its_here,'notIdealIf',not_for) from candidates where rn=1),
        'backup', (select jsonb_build_object('placeId',slug,'name',name,'why',why_its_here,'notIdealIf',not_for) from candidates where rn=2),
        'contrast', (select jsonb_build_object('placeId',slug,'name',name,'why',why_its_here,'notIdealIf',not_for) from candidates where rn=3),
        'emptyStateReason', case when exists(select 1 from candidates) then null else 'insufficient_verified_candidates' end
      ) value
    )
    insert into public.v12_decision_runs(guest_ref_id, context, result)
      select v_guest_id, v_context, value from result
      returning id, result into v_id, v_response;
    v_response := jsonb_build_object('ok', true, 'decisionId', v_id, 'result', v_response,
      'policyVersion', 'v1-editorial', 'expiresAt', now() + interval '30 minutes');

  elsif p_operation = 'feed.create' then
    if coalesce(p_input->>'feedType','') not in (
      'for_you','near_you','open_now','sunset_tonight','rainy_day','new_on_other_bali',
      'worth_the_drive','quiet_places','with_kids','under_budget','saved_by_you',
      'similar_to_places_you_loved') then return jsonb_build_object('ok',false,'error','bad_request'); end if;
    insert into public.v12_feed_sessions(guest_ref_id, feed_type, active_context)
      values (v_guest_id, p_input->>'feedType', coalesce(p_input->'activeContext','{}'))
      returning id, version into v_id, v_version;
    v_response := jsonb_build_object('ok',true,'sessionId',v_id,'cursor',0,'version',v_version);

  elsif p_operation = 'feed.update' then
    update public.v12_feed_sessions set
      last_seen_entity_id = coalesce(p_input->>'lastSeenEntityId', last_seen_entity_id),
      in_session_position = coalesce((p_input->>'position')::integer, in_session_position),
      cross_session_resume_position = coalesce((p_input->>'position')::integer, cross_session_resume_position),
      cursor = coalesce((p_input->>'cursor')::integer, cursor), version = version + 1, updated_at = now()
    where id = (p_input->>'sessionId')::uuid and guest_ref_id = v_guest_id
      and (p_input->>'baseVersion')::bigint = version
    returning id, version into v_id, v_version;
    if v_id is null then
      if exists (select 1 from public.v12_feed_sessions where id=(p_input->>'sessionId')::uuid and guest_ref_id=v_guest_id)
        then return jsonb_build_object('ok',false,'error','version_mismatch');
      end if;
      return jsonb_build_object('ok',false,'error','not_found');
    end if;
    v_response := jsonb_build_object('ok',true,'sessionId',v_id,'version',v_version);

  elsif p_operation = 'today.create' then
    insert into public.v12_today_sessions(guest_ref_id, context, selected_state, plan)
      values (v_guest_id, coalesce(p_input->'context','{}'), coalesce(p_input->'selectedState','{}'),
        coalesce(p_input->'plan','{"orderedStops":[],"alternatives":[],"state":"draft"}'))
      returning id, version into v_id, v_version;
    v_response := jsonb_build_object('ok',true,'sessionId',v_id,'version',v_version);

  elsif p_operation = 'today.update' then
    update public.v12_today_sessions set
      selected_state = coalesce(p_input->'selectedState', selected_state),
      plan = coalesce(p_input->'plan', plan), version = version + 1, updated_at = now()
    where id = (p_input->>'sessionId')::uuid and guest_ref_id = v_guest_id
      and (p_input->>'baseVersion')::bigint = version
    returning id, version into v_id, v_version;
    if v_id is null then
      if exists (select 1 from public.v12_today_sessions where id=(p_input->>'sessionId')::uuid and guest_ref_id=v_guest_id)
        then return jsonb_build_object('ok',false,'error','version_mismatch');
      end if;
      return jsonb_build_object('ok',false,'error','not_found');
    end if;
    v_response := jsonb_build_object('ok',true,'sessionId',v_id,'version',v_version);

  elsif p_operation = 'trip.create' then
    insert into public.v12_trips(guest_ref_id,title,start_date,end_date,home_area,travel_style,state)
      values (v_guest_id, p_input->>'title', (p_input->>'startDate')::date,
        (p_input->>'endDate')::date, p_input->>'homeArea', p_input->>'travelStyle',
        coalesce(p_input->'state','{"days":[]}'))
      returning id, version into v_id, v_version;
    v_response := jsonb_build_object('ok',true,'tripId',v_id,'version',v_version);

  elsif p_operation = 'trip.update' then
    update public.v12_trips set title = coalesce(p_input->>'title',title),
      state = coalesce(p_input->'state',state), status = coalesce(p_input->>'status',status),
      version = version + 1, updated_at = now()
    where id = (p_input->>'tripId')::uuid and guest_ref_id = v_guest_id
      and (p_input->>'baseVersion')::bigint = version
    returning id, version into v_id, v_version;
    if v_id is null then
      if exists (select 1 from public.v12_trips where id=(p_input->>'tripId')::uuid and guest_ref_id=v_guest_id)
        then return jsonb_build_object('ok',false,'error','version_mismatch');
      end if;
      return jsonb_build_object('ok',false,'error','not_found');
    end if;
    v_response := jsonb_build_object('ok',true,'tripId',v_id,'version',v_version);

  else
    v_version := extract(epoch from clock_timestamp())::bigint;
    insert into public.v12_sync_mutations(guest_ref_id,idempotency_key,entity_type,entity_id,
      operation,payload,base_version,server_version)
    values (v_guest_id,p_idempotency_key,p_input->>'entityType',p_input->>'entityId',
      p_input->>'operation',coalesce(p_input->'payload','{}'),p_input->>'baseVersion',v_version)
    returning id into v_id;
    v_response := jsonb_build_object('ok',true,'mutationId',v_id,'status','accepted',
      'serverVersion',v_version);
  end if;

  insert into public.v12_runtime_idempotency(guest_ref_id,idempotency_key,operation,response)
    values (v_guest_id,p_idempotency_key,p_operation,v_response);
  return v_response;
exception
  when invalid_text_representation or check_violation or not_null_violation or string_data_right_truncation then
    return jsonb_build_object('ok',false,'error','bad_request');
end;
$$;

create or replace function public.v12_runtime_read(
  p_guest_ref text, p_resource text, p_id text default null
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_guest_id uuid; v_data jsonb;
begin
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
     or p_resource not in ('feed','today','trip','sync') then
    return jsonb_build_object('ok',false,'error','bad_request');
  end if;
  select id into v_guest_id from public.guest_refs where ref=p_guest_ref;
  if v_guest_id is null then return jsonb_build_object('ok',true,'items','[]'::jsonb); end if;
  if p_resource='feed' then
    select coalesce(jsonb_agg(to_jsonb(x) order by x.updated_at desc),'[]') into v_data
      from (select id,feed_type,active_context,last_seen_entity_id,in_session_position,
        cross_session_resume_position,cursor,version,updated_at from public.v12_feed_sessions
        where guest_ref_id=v_guest_id and (p_id is null or id=p_id::uuid) limit 50) x;
  elsif p_resource='today' then
    select coalesce(jsonb_agg(to_jsonb(x) order by x.updated_at desc),'[]') into v_data
      from (select id,context,selected_state,plan,result_version,version,expires_at,updated_at
        from public.v12_today_sessions where guest_ref_id=v_guest_id
        and (p_id is null or id=p_id::uuid) and expires_at>now() limit 20) x;
  elsif p_resource='trip' then
    select coalesce(jsonb_agg(to_jsonb(x) order by x.updated_at desc),'[]') into v_data
      from (select id,title,start_date,end_date,home_area,travel_style,state,status,version,updated_at
        from public.v12_trips where guest_ref_id=v_guest_id
        and (p_id is null or id=p_id::uuid) limit 30) x;
  else
    select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at),'[]') into v_data
      from (select id,idempotency_key,entity_type,entity_id,operation,payload,base_version,
        status,server_version,created_at from public.v12_sync_mutations
        where guest_ref_id=v_guest_id and server_version > coalesce(p_id::bigint,0)
        order by server_version limit 100) x;
  end if;
  return jsonb_build_object('ok',true,'items',v_data);
exception when invalid_text_representation then
  return jsonb_build_object('ok',false,'error','bad_request');
end;
$$;

revoke all on function public.v12_runtime_mutate(text,text,jsonb,text) from public;
revoke all on function public.v12_runtime_read(text,text,text) from public;
revoke all on function public.v12_runtime_mutate(text,text,jsonb,text) from anon, authenticated;
revoke all on function public.v12_runtime_read(text,text,text) from anon, authenticated;
grant execute on function public.v12_runtime_mutate(text,text,jsonb,text) to service_role;
grant execute on function public.v12_runtime_read(text,text,text) to service_role;

commit;
