-- v1.2 durable offline mutation application.
-- APPLY ORDER: after 0061_v12_runtime_persistence.sql and
-- 0063_v12_event_occurrences.sql. This file is not evidence of production apply.
begin;

-- Keep entity versions separate from the ordered pull cursor. Tombstones are
-- retained so an offline remove cannot reset a saved entity's version to zero.
create table if not exists public.v12_saved_states (
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  venue_slug text not null references public.venues(slug) on update cascade on delete cascade,
  is_saved boolean not null,
  version bigint not null default 0 check (version >= 0),
  updated_at timestamptz not null default now(),
  primary key (guest_ref_id, venue_slug)
);

create table if not exists public.v12_today_items (
  id uuid primary key default gen_random_uuid(),
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  item_type text not null check (item_type in ('place', 'event_occurrence')),
  venue_slug text references public.venues(slug) on update cascade on delete cascade,
  event_occurrence_id uuid references public.v12_event_occurrences(id) on delete cascade,
  version bigint not null default 0 check (version >= 0),
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (item_type = 'place' and venue_slug is not null and event_occurrence_id is null)
    or
    (item_type = 'event_occurrence' and venue_slug is null and event_occurrence_id is not null)
  )
);
create unique index if not exists v12_today_items_place_unique
  on public.v12_today_items(guest_ref_id, venue_slug)
  where item_type = 'place';
create unique index if not exists v12_today_items_event_unique
  on public.v12_today_items(guest_ref_id, event_occurrence_id)
  where item_type = 'event_occurrence';

create table if not exists public.v12_visited_states (
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  venue_slug text not null references public.venues(slug) on update cascade on delete cascade,
  is_visited boolean not null default true,
  visited_at timestamptz,
  version bigint not null default 0 check (version >= 0),
  updated_at timestamptz not null default now(),
  primary key (guest_ref_id, venue_slug)
);

create table if not exists public.v12_note_states (
  guest_ref_id uuid not null references public.guest_refs(id) on delete cascade,
  venue_slug text not null references public.venues(slug) on update cascade on delete cascade,
  note text not null check (length(note) between 1 and 2000),
  version bigint not null default 0 check (version >= 0),
  updated_at timestamptz not null default now(),
  primary key (guest_ref_id, venue_slug)
);

create sequence if not exists public.v12_sync_cursor_seq as bigint;

-- 0061 did not bind idempotency keys to the request body. New sync writes keep
-- the canonical JSON input so equality checks are collision-free; null marks a
-- pre-0064 row that must be reconciled against the legacy mutation ledger.
alter table public.v12_runtime_idempotency
  add column if not exists request_input jsonb;

-- 0061 issued epoch-based cursor values directly into the ledger. On upgrade,
-- advance the dedicated sequence past that deployed high-water mark. Comparing
-- both last_value and is_called prevents setval from moving an existing
-- sequence backwards or reissuing a cursor equal to the ledger maximum.
do $$
declare
  v_ledger_max bigint;
  v_sequence_last bigint;
  v_sequence_called boolean;
begin
  select coalesce(max(m.server_version), 0)
    into v_ledger_max
    from public.v12_sync_mutations m;
  select last_value, is_called
    into v_sequence_last, v_sequence_called
    from public.v12_sync_cursor_seq;
  if v_ledger_max > v_sequence_last
     or (
       v_ledger_max = v_sequence_last
       and v_ledger_max > 0
       and not v_sequence_called
     ) then
    perform setval('public.v12_sync_cursor_seq', v_ledger_max, true);
  end if;
end;
$$;

alter table public.v12_saved_states enable row level security;
alter table public.v12_today_items enable row level security;
alter table public.v12_visited_states enable row level security;
alter table public.v12_note_states enable row level security;

revoke all on public.v12_saved_states from public, anon, authenticated;
revoke all on public.v12_today_items from public, anon, authenticated;
revoke all on public.v12_visited_states from public, anon, authenticated;
revoke all on public.v12_note_states from public, anon, authenticated;

grant select, insert, update, delete on public.v12_saved_states to service_role;
grant select, insert, update, delete on public.v12_today_items to service_role;
grant select, insert, update, delete on public.v12_visited_states to service_role;
grant select, insert, update, delete on public.v12_note_states to service_role;

-- Preserve the already-deployed non-sync behavior behind the new validator.
-- The renamed implementation is callable only by its owner; app roles can use
-- only the service-role-only wrapper created below.
alter function public.v12_runtime_mutate(text, text, jsonb, text)
  rename to v12_runtime_mutate_legacy;
revoke all on function public.v12_runtime_mutate_legacy(text,text,jsonb,text)
  from public, anon, authenticated, service_role;

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
  v_existing_operation text;
  v_existing jsonb;
  v_existing_request_input jsonb;
  v_reconcile_legacy boolean := false;
  v_legacy_mutation_id uuid;
  v_entity_type text;
  v_entity_id text;
  v_mutation_operation text;
  v_payload jsonb;
  v_base_version bigint;
  v_version bigint := 0;
  v_cursor bigint;
  v_response jsonb;
  v_mutation_id uuid;
  v_trip jsonb;
  v_trip_id uuid;
  v_event_id uuid;
  v_visited_at timestamptz;
begin
  if p_guest_ref is null
     or p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
     or p_operation is null
     or p_operation not in ('decision.create','feed.create','feed.update','today.create',
       'today.update','trip.create','trip.update','sync.push')
     or p_input is null
     or p_idempotency_key is null
     or length(p_idempotency_key) not between 1 and 160
     or jsonb_typeof(p_input) <> 'object'
     or pg_column_size(p_input) > 49152 then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('v12:' || p_guest_ref || ':' || p_idempotency_key, 0)
  );
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
    select request_input into v_existing_request_input
      from public.v12_runtime_idempotency
      where guest_ref_id = v_guest_id and idempotency_key = p_idempotency_key;
    if p_operation = 'sync.push' then
      if v_existing_request_input is not null then
        if v_existing_request_input <> p_input then
          return jsonb_build_object('ok', false, 'error', 'idempotency_conflict');
        end if;
      elsif v_existing->>'status' = 'accepted' then
        -- A 0061 accepted row described intent but never applied it. Only the
        -- exact ledger mutation may leave the legacy terminal-return path.
        select id into v_legacy_mutation_id
          from public.v12_sync_mutations
          where guest_ref_id = v_guest_id
            and idempotency_key = p_idempotency_key
            and status = 'accepted'
            and entity_type = p_input->>'entityType'
            and entity_id = p_input->>'entityId'
            and operation = p_input->>'operation'
            and payload = p_input->'payload'
            and base_version is not distinct from p_input->>'baseVersion';
        if v_legacy_mutation_id is null then
          return jsonb_build_object('ok', false, 'error', 'idempotency_conflict');
        end if;
        v_reconcile_legacy := true;
        v_existing := null;
      else
        -- No pre-0064 terminal sync response can be safely request-bound.
        return jsonb_build_object('ok', false, 'error', 'idempotency_conflict');
      end if;
    end if;
    if not v_reconcile_legacy then
      return v_existing;
    end if;
  end if;

  if p_operation = 'sync.push' then
    -- Continue into the closed sync validator below.
    null;
  else
    return public.v12_runtime_mutate_legacy(
      p_guest_ref, p_operation, p_input, p_idempotency_key
    );
  end if;

  -- The sync envelope is intentionally closed: unknown keys and oversized
  -- payloads are rejected rather than being acknowledged without application.
  if not (p_input ? 'entityType')
     or not (p_input ? 'entityId')
     or not (p_input ? 'operation')
     or not (p_input ? 'payload')
     or (p_input - array[
       'entityType','entityId','operation','payload','baseVersion','createdAt'
     ]::text[]) <> '{}'::jsonb
     or jsonb_typeof(p_input->'payload') <> 'object'
     or pg_column_size(p_input->'payload') > 16384 then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  v_entity_type := p_input->>'entityType';
  v_entity_id := p_input->>'entityId';
  v_mutation_operation := p_input->>'operation';
  v_payload := p_input->'payload';

  if v_entity_type not in ('saved','visited','note','trip_stop')
     or coalesce(length(v_entity_id), 0) not between 1 and 200
     or coalesce(length(v_mutation_operation), 0) not between 1 and 80 then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;
  if p_input ? 'baseVersion' and p_input->'baseVersion' <> 'null'::jsonb then
    if jsonb_typeof(p_input->'baseVersion') <> 'string'
       or (p_input->>'baseVersion') !~ '^(0|[1-9][0-9]{0,18})$' then
      return jsonb_build_object('ok', false, 'error', 'bad_request');
    end if;
    v_base_version := (p_input->>'baseVersion')::bigint;
  end if;

  -- Validate the exact mutation vocabulary before looking up or changing state.
  if v_entity_type = 'saved' then
    if v_mutation_operation not in ('save','remove')
       or v_payload <> jsonb_build_object(
         'entityType', 'place', 'entityId', v_entity_id
       )
       or v_entity_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
      return jsonb_build_object('ok', false, 'error', 'bad_request');
    end if;
  elsif v_entity_type = 'trip_stop' then
    if v_mutation_operation = 'add_to_day' then
      if v_payload->>'entityType' not in ('place','event_occurrence')
         or v_payload->>'day' <> 'today'
         or (v_payload - array['entityType','day']::text[]) <> '{}'::jsonb then
        return jsonb_build_object('ok', false, 'error', 'bad_request');
      end if;
      if v_payload->>'entityType' = 'place'
         and v_entity_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
        return jsonb_build_object('ok', false, 'error', 'bad_request');
      end if;
      if v_payload->>'entityType' = 'event_occurrence' then
        v_event_id := v_entity_id::uuid;
      end if;
    elsif v_mutation_operation = 'trip_replace' then
      if (v_payload - 'trip') <> '{}'::jsonb
         or jsonb_typeof(v_payload->'trip') <> 'object' then
        return jsonb_build_object('ok', false, 'error', 'bad_request');
      end if;
      v_trip := v_payload->'trip';
      if (v_trip - array[
        'id','title','startDate','endDate','homeArea','travelStyle','status','days'
      ]::text[]) <> '{}'::jsonb
         or v_trip->>'id' <> v_entity_id
         or coalesce(length(btrim(v_trip->>'title')), 0) not between 1 and 120
         or v_trip->>'status' not in ('draft','active','completed','archived')
         or jsonb_typeof(v_trip->'days') <> 'array'
         or pg_column_size(v_trip->'days') > 45000 then
        return jsonb_build_object('ok', false, 'error', 'bad_request');
      end if;
      v_trip_id := v_entity_id::uuid;
      if (v_trip->>'endDate')::date < (v_trip->>'startDate')::date
         or (v_trip->>'endDate')::date - (v_trip->>'startDate')::date > 30 then
        return jsonb_build_object('ok', false, 'error', 'bad_request');
      end if;
    else
      return jsonb_build_object('ok', false, 'error', 'bad_request');
    end if;
  elsif v_entity_type = 'visited' then
    if v_mutation_operation <> 'visited'
       or (v_payload - array['entityType','visited','visitedAt']::text[]) <> '{}'::jsonb
       or coalesce(v_payload->>'entityType', 'place') <> 'place'
       or v_entity_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
       or (v_payload ? 'visited' and jsonb_typeof(v_payload->'visited') <> 'boolean') then
      return jsonb_build_object('ok', false, 'error', 'bad_request');
    end if;
    if v_payload ? 'visitedAt' then
      v_visited_at := (v_payload->>'visitedAt')::timestamptz;
    end if;
  elsif v_entity_type = 'note' then
    if v_mutation_operation <> 'note'
       or (v_payload - array['entityType','note']::text[]) <> '{}'::jsonb
       or coalesce(v_payload->>'entityType', 'place') <> 'place'
       or v_entity_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
       or coalesce(length(v_payload->>'note'), 0) not between 1 and 2000 then
      return jsonb_build_object('ok', false, 'error', 'bad_request');
    end if;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    'v12-sync-state:' || v_guest_id::text || ':' || v_entity_type || ':' || v_entity_id,
    0
  ));

  -- Resolve the current entity version without modifying canonical state.
  if v_entity_type = 'saved' then
    select version into v_version from public.v12_saved_states
      where guest_ref_id = v_guest_id and venue_slug = v_entity_id;
  elsif v_entity_type = 'trip_stop' and v_mutation_operation = 'add_to_day' then
    if v_payload->>'entityType' = 'place' then
      select version into v_version from public.v12_today_items
        where guest_ref_id = v_guest_id and venue_slug = v_entity_id;
    else
      select version into v_version from public.v12_today_items
        where guest_ref_id = v_guest_id and event_occurrence_id = v_event_id;
    end if;
  elsif v_entity_type = 'trip_stop' and v_mutation_operation = 'trip_replace' then
    select version into v_version from public.v12_trips
      where guest_ref_id = v_guest_id and id = v_trip_id;
  elsif v_entity_type = 'visited' then
    select version into v_version from public.v12_visited_states
      where guest_ref_id = v_guest_id and venue_slug = v_entity_id;
  elsif v_entity_type = 'note' then
    select version into v_version from public.v12_note_states
      where guest_ref_id = v_guest_id and venue_slug = v_entity_id;
  end if;
  v_version := coalesce(v_version, 0);

  -- A baseVersion mismatch is durable and idempotent, but never applies state.
  if v_base_version is not null and v_base_version <> v_version then
    v_cursor := nextval('public.v12_sync_cursor_seq');
    v_response := jsonb_build_object(
      'ok', true,
      'status', 'conflict',
      'idempotencyKey', p_idempotency_key,
      'serverVersion', v_version::text
    );
    if v_reconcile_legacy then
      update public.v12_sync_mutations
        set status = 'conflict',
            server_version = v_cursor
        where id = v_legacy_mutation_id
        returning id into v_mutation_id;
      update public.v12_runtime_idempotency
        set response = v_response,
            request_input = p_input
        where guest_ref_id = v_guest_id and idempotency_key = p_idempotency_key;
    else
      insert into public.v12_sync_mutations(
        guest_ref_id, idempotency_key, entity_type, entity_id, operation,
        payload, base_version, status, server_version
      ) values (
        v_guest_id, p_idempotency_key, v_entity_type, v_entity_id,
        v_mutation_operation, v_payload, p_input->>'baseVersion', 'conflict', v_cursor
      ) returning id into v_mutation_id;
      insert into public.v12_runtime_idempotency(
        guest_ref_id, idempotency_key, operation, response, request_input
      ) values (
        v_guest_id, p_idempotency_key, p_operation, v_response, p_input
      );
    end if;
    return v_response;
  end if;

  v_version := v_version + 1;

  if v_entity_type = 'saved' then
    insert into public.v12_saved_states(
      guest_ref_id, venue_slug, is_saved, version, updated_at
    ) values (
      v_guest_id, v_entity_id, v_mutation_operation = 'save', v_version, now()
    )
    on conflict (guest_ref_id, venue_slug) do update
      set is_saved = excluded.is_saved,
          version = excluded.version,
          updated_at = excluded.updated_at;
    if v_mutation_operation = 'save' then
      insert into public.saved_places(guest_ref_id, venue_slug)
        values (v_guest_id, p_input->>'entityId')
        on conflict (guest_ref_id, venue_slug) do nothing;
    else
      delete from public.saved_places
        where guest_ref_id = v_guest_id and venue_slug = v_entity_id;
    end if;

  elsif v_entity_type = 'trip_stop' and v_mutation_operation = 'add_to_day' then
    if v_payload->>'entityType' = 'place' then
      insert into public.v12_today_items(
        guest_ref_id, item_type, venue_slug, version, updated_at
      ) values (v_guest_id, 'place', v_entity_id, v_version, now())
      on conflict (guest_ref_id, venue_slug) where item_type = 'place' do update
        set version = excluded.version, updated_at = excluded.updated_at;
    else
      insert into public.v12_today_items(
        guest_ref_id, item_type, event_occurrence_id, version, updated_at
      ) values (v_guest_id, 'event_occurrence', v_event_id, v_version, now())
      on conflict (guest_ref_id, event_occurrence_id)
        where item_type = 'event_occurrence' do update
        set version = excluded.version, updated_at = excluded.updated_at;
    end if;

  elsif v_entity_type = 'trip_stop' and v_mutation_operation = 'trip_replace' then
    if exists (
      select 1 from public.v12_trips
      where guest_ref_id = v_guest_id and id = v_trip_id
    ) then
      update public.v12_trips
        set title = v_trip->>'title',
            start_date = (v_trip->>'startDate')::date,
            end_date = (v_trip->>'endDate')::date,
            home_area = v_trip->>'homeArea',
            travel_style = v_trip->>'travelStyle',
            state = jsonb_build_object('days', v_trip->'days'),
            status = v_trip->>'status',
            version = v_version,
            updated_at = now()
        where guest_ref_id = v_guest_id and id = v_trip_id;
    else
      insert into public.v12_trips(
        id, guest_ref_id, title, start_date, end_date, home_area,
        travel_style, state, status, version, updated_at
      ) values (
        v_trip_id, v_guest_id, v_trip->>'title',
        (v_trip->>'startDate')::date, (v_trip->>'endDate')::date,
        v_trip->>'homeArea', v_trip->>'travelStyle',
        jsonb_build_object('days', v_trip->'days'),
        v_trip->>'status', v_version, now()
      );
    end if;

  elsif v_entity_type = 'visited' then
    insert into public.v12_visited_states(
      guest_ref_id, venue_slug, is_visited, visited_at, version, updated_at
    ) values (
      v_guest_id, v_entity_id, coalesce((v_payload->>'visited')::boolean, true),
      v_visited_at, v_version, now()
    )
    on conflict (guest_ref_id, venue_slug) do update
      set is_visited = excluded.is_visited,
          visited_at = excluded.visited_at,
          version = excluded.version,
          updated_at = excluded.updated_at;

  elsif v_entity_type = 'note' then
    insert into public.v12_note_states(
      guest_ref_id, venue_slug, note, version, updated_at
    ) values (
      v_guest_id, v_entity_id, v_payload->>'note', v_version, now()
    )
    on conflict (guest_ref_id, venue_slug) do update
      set note = excluded.note,
          version = excluded.version,
          updated_at = excluded.updated_at;
  end if;

  v_cursor := nextval('public.v12_sync_cursor_seq');
  v_response := jsonb_build_object(
    'ok', true,
    'status', 'applied',
    'idempotencyKey', p_idempotency_key,
    'serverVersion', v_version::text
  );
  if v_reconcile_legacy then
    update public.v12_sync_mutations
      set status = 'applied',
          server_version = v_cursor
      where id = v_legacy_mutation_id
      returning id into v_mutation_id;
    update public.v12_runtime_idempotency
      set response = v_response,
          request_input = p_input
      where guest_ref_id = v_guest_id and idempotency_key = p_idempotency_key;
  else
    insert into public.v12_sync_mutations(
      guest_ref_id, idempotency_key, entity_type, entity_id, operation,
      payload, base_version, status, server_version
    ) values (
      v_guest_id, p_idempotency_key, v_entity_type, v_entity_id,
      v_mutation_operation, v_payload, p_input->>'baseVersion', 'applied', v_cursor
    ) returning id into v_mutation_id;
    insert into public.v12_runtime_idempotency(
      guest_ref_id, idempotency_key, operation, response, request_input
    ) values (
      v_guest_id, p_idempotency_key, p_operation, v_response, p_input
    );
  end if;
  return v_response;
exception
  when invalid_text_representation
    or invalid_datetime_format
    or datetime_field_overflow
    or check_violation
    or foreign_key_violation
    or not_null_violation
    or string_data_right_truncation
    or numeric_value_out_of_range then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
end;
$$;

revoke all on function public.v12_runtime_mutate(text,text,jsonb,text) from public;
revoke all on function public.v12_runtime_mutate(text,text,jsonb,text)
  from anon, authenticated;
grant execute on function public.v12_runtime_mutate(text,text,jsonb,text) to service_role;

commit;
