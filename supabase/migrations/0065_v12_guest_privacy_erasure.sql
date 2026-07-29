-- Confirmed erasure and revocation for anonymous website + v1.2 mobile state.
-- APPLY ORDER: after 0064_v12_sync_apply.sql. This file is not evidence of
-- production apply.
--
-- Exact retained scope:
--   * a bare revoked guest reference + erasure timestamp, used only to prevent
--     an old installation from recreating state after confirmed deletion;
--   * existing redemption_events, detached from the installation reference and
--     moved to a new unreachable pseudonymous proof anchor;
--   * granted redemption_tracking_v1 consent rows only when redemption proof
--     actually exists, moved to the same proof anchor.
-- Venue-photo rights consent has guest_ref_id = null and is outside traveller
-- erasure. No other guest consent rows are retained by this function.
begin;

alter table public.guest_refs
  add column if not exists privacy_erased_at timestamptz;

comment on column public.guest_refs.privacy_erased_at is
  'Revokes a pseudonymous guest reference so delayed or replayed writes cannot recreate erased state.';

-- A tombstone is immutable. The erasure transaction may set it and clear
-- source/first_district in one update; later code cannot revive or enrich it.
create or replace function public.guard_guest_ref_privacy_tombstone()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.privacy_erased_at is not null then
    if tg_op = 'DELETE' then
      raise exception using
        errcode = '23514',
        message = 'privacy-erased guest reference cannot be deleted';
    end if;
    if new is distinct from old then
      raise exception using
        errcode = '23514',
        message = 'privacy-erased guest reference is immutable';
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_guest_ref_privacy_tombstone
  on public.guest_refs;
create trigger guard_guest_ref_privacy_tombstone
before update or delete on public.guest_refs
for each row execute function public.guard_guest_ref_privacy_tombstone();

-- All writes tied to a guest row lock that row and check its tombstone. The row
-- lock gives both possible races a safe outcome:
--   write first -> erase waits, then deletes that write;
--   erase first -> write waits, sees privacy_erased_at, and is rejected.
create or replace function public.guard_privacy_erased_guest_write()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_erased_at timestamptz;
begin
  if new.guest_ref_id is null then
    return new;
  end if;

  select g.privacy_erased_at
    into v_erased_at
    from public.guest_refs g
    where g.id = new.guest_ref_id
    for update;

  if v_erased_at is not null then
    raise exception using
      errcode = '23514',
      message = 'privacy-erased guest reference cannot receive new data';
  end if;
  return new;
end;
$$;

do $$
declare
  v_table text;
begin
  foreach v_table in array array[
    'events',
    'saved_places',
    'shared_lists',
    'consent_log',
    'redemption_events',
    'v12_saved_states',
    'v12_today_items',
    'v12_visited_states',
    'v12_note_states',
    'v12_decision_runs',
    'v12_feed_sessions',
    'v12_today_sessions',
    'v12_trips',
    'v12_sync_mutations',
    'v12_runtime_idempotency'
  ] loop
    -- Some older installations never created the optional legacy
    -- saved_places/shared_lists tables. Required v1.2 tables are established
    -- by 0061-0064; skipping an absent legacy relation keeps this migration
    -- deployable across both historical schema shapes.
    if to_regclass(format('public.%I', v_table)) is null then
      continue;
    end if;
    execute format(
      'drop trigger if exists guard_privacy_erased_guest_write on public.%I',
      v_table
    );
    execute format(
      'create trigger guard_privacy_erased_guest_write
       before insert or update on public.%I
       for each row execute function public.guard_privacy_erased_guest_write()',
      v_table
    );
  end loop;
end;
$$;

revoke all on function public.guard_guest_ref_privacy_tombstone()
  from public, anon, authenticated, service_role;
revoke all on function public.guard_privacy_erased_guest_write()
  from public, anon, authenticated, service_role;

-- Put all v1.2 runtime mutations and erasure behind the same per-reference
-- transaction lock. The conditional rename makes the migration safe to
-- refresh in preview without wrapping the wrapper a second time.
do $$
begin
  if to_regprocedure(
    'public.v12_runtime_mutate_privacy_impl(text,text,jsonb,text)'
  ) is null then
    if to_regprocedure(
      'public.v12_runtime_mutate(text,text,jsonb,text)'
    ) is null then
      raise exception 'v12_runtime_mutate must be installed before 0065';
    end if;
    execute
      'alter function public.v12_runtime_mutate(text, text, jsonb, text)
       rename to v12_runtime_mutate_privacy_impl';
  end if;
end;
$$;
revoke all on function public.v12_runtime_mutate_privacy_impl(text,text,jsonb,text)
  from public, anon, authenticated, service_role;

create or replace function public.v12_runtime_mutate(
  p_guest_ref text,
  p_operation text,
  p_input jsonb,
  p_idempotency_key text
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_erased_at timestamptz;
begin
  if p_guest_ref ~ '^g_[A-Za-z0-9_-]{16}$' then
    perform pg_advisory_xact_lock(
      hashtextextended('v12-guest-privacy:' || p_guest_ref, 0)
    );
    select g.privacy_erased_at
      into v_erased_at
      from public.guest_refs g
      where g.ref = p_guest_ref
      for update;
    if v_erased_at is not null then
      return jsonb_build_object('ok', false, 'error', 'privacy_erased');
    end if;
  end if;

  return public.v12_runtime_mutate_privacy_impl(
    p_guest_ref, p_operation, p_input, p_idempotency_key
  );
end;
$$;

revoke all on function public.v12_runtime_mutate(text,text,jsonb,text)
  from public, anon, authenticated;
grant execute on function public.v12_runtime_mutate(text,text,jsonb,text)
  to service_role;

create or replace function public.forget_guest_v12(p_guest_ref text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_proof_guest_id uuid;
  v_proof_ref text;
  v_now timestamptz := clock_timestamp();
  v_retained_redemptions integer := 0;
  v_retained_consents integer := 0;
begin
  if p_guest_ref is null
     or p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$' then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('v12-guest-privacy:' || p_guest_ref, 0)
  );

  -- UPSERT is deliberate: it also wins safely when a legacy writer was already
  -- creating this guest without taking the v1.2 advisory lock. A missing guest
  -- still gets a tombstone, so an erase-first request revokes future retries.
  insert into public.guest_refs(
    ref, first_district, source, created_at, privacy_erased_at
  ) values (
    p_guest_ref, null, null, v_now, v_now
  )
  on conflict (ref) do update
    set first_district = null,
        source = null,
        created_at = case
          when public.guest_refs.privacy_erased_at is null
            then excluded.privacy_erased_at
          else public.guest_refs.created_at
        end,
        privacy_erased_at = coalesce(
          public.guest_refs.privacy_erased_at,
          excluded.privacy_erased_at
        )
  returning id into v_guest_id;

  select count(*)
    into v_retained_redemptions
    from public.redemption_events
    where guest_ref_id = v_guest_id;

  if v_retained_redemptions > 0 then
    -- Move retained proof away from the installation token. The random proof
    -- anchor is never returned and is tombstoned after the move.
    loop
      v_proof_ref :=
        'g_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 16);
      begin
        insert into public.guest_refs(ref)
        values (v_proof_ref)
        returning id into v_proof_guest_id;
        exit;
      exception when unique_violation then
        null;
      end;
    end loop;

    update public.redemption_events
      set guest_ref_id = v_proof_guest_id
      where guest_ref_id = v_guest_id;

    -- At most one granted consent evidence row is retained per actual proof.
    -- Any surplus/orphan consent rows remain on the original guest and are
    -- deleted below.
    with retained_consent_ids as (
      select id
      from public.consent_log
      where guest_ref_id = v_guest_id
        and consent_type = 'redemption_tracking_v1'
        and granted
      order by ts desc, id desc
      limit v_retained_redemptions
    )
    update public.consent_log consent
      set guest_ref_id = v_proof_guest_id,
          user_agent = null,
          venue_slug = null,
          actor_name = null,
          actor_contact = null,
          terms_version = null,
          scope = null,
          submission_ids = null,
          submitted_ip = null
      from retained_consent_ids retained
      where consent.id = retained.id;
    get diagnostics v_retained_consents = row_count;

    update public.guest_refs
      set first_district = null,
          source = null,
          created_at = v_now,
          privacy_erased_at = v_now
      where id = v_proof_guest_id;
  end if;

  -- Any guest-linked consent not moved above is not required by actual retained
  -- redemption proof. Venue-photo consent has a null guest_ref_id and remains.
  delete from public.consent_log
    where guest_ref_id = v_guest_id;

  -- v1.2 derived state and mutable traveller content.
  delete from public.v12_saved_states
    where guest_ref_id = v_guest_id;
  delete from public.v12_today_items
    where guest_ref_id = v_guest_id;
  delete from public.v12_visited_states
    where guest_ref_id = v_guest_id;
  delete from public.v12_note_states
    where guest_ref_id = v_guest_id;
  delete from public.v12_decision_runs
    where guest_ref_id = v_guest_id;
  delete from public.v12_feed_sessions
    where guest_ref_id = v_guest_id;
  delete from public.v12_today_sessions
    where guest_ref_id = v_guest_id;
  delete from public.v12_trips
    where guest_ref_id = v_guest_id;
  delete from public.v12_sync_mutations
    where guest_ref_id = v_guest_id;
  delete from public.v12_runtime_idempotency
    where guest_ref_id = v_guest_id;

  -- Legacy mutable traveller state and publicly addressable share snapshots.
  -- The latter two relations are optional in older installations.
  if to_regclass('public.events') is not null then
    execute 'delete from public.events where guest_ref_id = $1'
      using v_guest_id;
  end if;
  if to_regclass('public.saved_places') is not null then
    execute 'delete from public.saved_places where guest_ref_id = $1'
      using v_guest_id;
  end if;
  if to_regclass('public.shared_lists') is not null then
    execute 'delete from public.shared_lists where guest_ref_id = $1'
      using v_guest_id;
  end if;

  return jsonb_build_object(
    'ok', true,
    'deleted', true,
    'retainedRedemptions', v_retained_redemptions,
    'retainedConsents', v_retained_consents
  );
end;
$$;

revoke all on function public.forget_guest_v12(text)
  from public, anon, authenticated;
grant execute on function public.forget_guest_v12(text)
  to service_role;

commit;
