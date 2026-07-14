-- P1 release repair: idempotent saved-place writes, consent-backed atomic
-- source capture, deterministic route-stop ordering, owned shared snapshots,
-- and a durable post-erasure identity barrier.

begin;

-- Supabase installs extensions in the locked `extensions` schema, while a
-- clean PostgreSQL replay of 0001 historically installed pgcrypto in `public`.
-- Normalize both histories before SECURITY DEFINER functions bind to digest
-- and random-byte helpers. Moving an extension preserves object OIDs and all
-- existing dependency links.
create schema if not exists extensions;
revoke create on schema extensions from public;
do $pgcrypto_schema$
declare
  v_schema name;
begin
  select namespace.nspname into v_schema
  from pg_extension extension
  join pg_namespace namespace on namespace.oid = extension.extnamespace
  where extension.extname = 'pgcrypto';

  if v_schema is null then
    raise exception using
      errcode = '55000',
      message = '0039 requires the pgcrypto extension from migration 0001';
  end if;
  if v_schema <> 'extensions' then
    execute 'alter extension pgcrypto set schema extensions';
  end if;
end
$pgcrypto_schema$;

do $dependencies$
begin
  if to_regclass('public.guest_refs') is null
    or to_regclass('public.saved_places') is null
    or to_regclass('public.shared_lists') is null
    or to_regclass('public.events') is null
    or to_regclass('public.consent_log') is null
    or to_regclass('public.redemption_events') is null
    or to_regclass('public.route_stops') is null
    or to_regprocedure('public.log_event_v3(text,text,text,text,jsonb)') is null
    or to_regprocedure('extensions.digest(text,text)') is null
    or to_regprocedure('extensions.gen_random_bytes(integer)') is null then
    raise exception using
      errcode = '55000',
      message = '0039 requires guest saves, routes and log_event_v3 through migration 0037';
  end if;
end
$dependencies$;

-- Historical create_shared_list could create ownerless snapshots when the
-- supplied GuestRef had no row. Ownership cannot be reconstructed safely, so
-- refuse to guess: an operator must delete or explicitly reconcile any such
-- rows before this privacy boundary can be installed.
do $shared_list_owner_preflight$
begin
  if exists (
    select 1 from public.shared_lists where guest_ref_id is null
  ) then
    raise exception using
      errcode = '23502',
      message = 'shared_lists contains ownerless rows; reconcile before 0039';
  end if;
end
$shared_list_owner_preflight$;

-- Every snapshot is guest-created content. Keep that invariant at the table
-- boundary and cascade defensively if a privileged caller deletes an owner
-- outside delete_guest_data.
do $shared_list_owner_constraint$
declare
  v_constraint name;
begin
  for v_constraint in
    select constraint_row.conname
    from pg_constraint constraint_row
    where constraint_row.conrelid = 'public.shared_lists'::regclass
      and constraint_row.confrelid = 'public.guest_refs'::regclass
      and constraint_row.contype = 'f'
      and constraint_row.conkey = array[(
        select attribute.attnum
        from pg_attribute attribute
        where attribute.attrelid = 'public.shared_lists'::regclass
          and attribute.attname = 'guest_ref_id'
          and not attribute.attisdropped
      )]
  loop
    execute format(
      'alter table public.shared_lists drop constraint %I',
      v_constraint
    );
  end loop;

  alter table public.shared_lists
    alter column guest_ref_id set not null;
  alter table public.shared_lists
    add constraint shared_lists_guest_ref_id_fkey
    foreign key (guest_ref_id) references public.guest_refs(id) on delete cascade;
end
$shared_list_owner_constraint$;

-- Published order cannot depend on PostgreSQL tie ordering. Refuse to install
-- the constraint until an operator has reconciled any existing duplicate rank.
do $route_rank_preflight$
begin
  if exists (
    select 1
    from public.route_stops
    group by route_slug, rank
    having count(*) > 1
  ) then
    raise exception using
      errcode = '23505',
      message = 'route_stops contains duplicate (route_slug, rank); reconcile before 0039';
  end if;
end
$route_rank_preflight$;

do $route_rank_constraint$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.route_stops'::regclass
      and conname = 'route_stops_route_rank_key'
  ) then
    alter table public.route_stops
      add constraint route_stops_route_rank_key unique (route_slug, rank);
  end if;
end
$route_rank_constraint$;

-- One redeemed guest can leave at most one feedback event for a venue. Refuse
-- to guess which historical duplicate is authoritative; reconcile before the
-- unique boundary is installed.
do $dish_feedback_preflight$
begin
  if exists (
    select 1
    from public.events
    where type = 'dish_feedback'
      and guest_ref_id is not null
      and venue_slug is not null
    group by guest_ref_id, venue_slug
    having count(*) > 1
  ) then
    raise exception using
      errcode = '23505',
      message = 'events contains duplicate dish feedback per guest and venue; reconcile before 0039';
  end if;
end
$dish_feedback_preflight$;

create unique index if not exists events_one_dish_feedback_per_guest_venue_idx
  on public.events(guest_ref_id, venue_slug)
  where type = 'dish_feedback'
    and guest_ref_id is not null
    and venue_slug is not null;

-- Keep only a one-way digest of a deleted random GuestRef. This minimal
-- revocation marker prevents a delayed tab/request from recreating the same
-- identity after erasure without retaining the raw browser identifier.
create table if not exists public.guest_ref_tombstones (
  ref_hash bytea primary key check (octet_length(ref_hash) = 32),
  deleted_at timestamptz not null default clock_timestamp()
);
alter table public.guest_ref_tombstones enable row level security;
alter table public.guest_ref_tombstones force row level security;
revoke all on table public.guest_ref_tombstones
  from public, anon, authenticated, service_role;
grant select, insert on table public.guest_ref_tombstones to service_role;

create or replace function public.guard_guest_ref_insert_after_erasure()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform pg_advisory_xact_lock(
    hashtextextended('guest-data:' || new.ref, 0)
  );
  if exists (
    select 1
    from public.guest_ref_tombstones tombstone
    where tombstone.ref_hash = extensions.digest(new.ref, 'sha256')
  ) then
    raise exception using
      errcode = '55000',
      message = 'guest identity has been revoked';
  end if;
  return new;
end;
$$;

drop trigger if exists guest_refs_erasure_guard on public.guest_refs;
create trigger guest_refs_erasure_guard
before insert or update of ref on public.guest_refs
for each row execute function public.guard_guest_ref_insert_after_erasure();

create or replace function public.guard_guest_child_write_after_erasure()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_ref text;
begin
  if new.guest_ref_id is null then
    return new;
  end if;

  select guest.ref into v_ref
  from public.guest_refs guest
  where guest.id = new.guest_ref_id;
  if v_ref is null then
    raise exception using errcode = '23503', message = 'guest identity is unavailable';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('guest-data:' || v_ref, 0)
  );

  -- Re-read after acquiring the lock. A delete may have completed while this
  -- write was waiting, in which case the stale child write must fail closed.
  if not exists (
    select 1 from public.guest_refs guest
    where guest.id = new.guest_ref_id and guest.ref = v_ref
  ) or exists (
    select 1 from public.guest_ref_tombstones tombstone
    where tombstone.ref_hash = extensions.digest(v_ref, 'sha256')
  ) then
    raise exception using errcode = '55000', message = 'guest identity has been revoked';
  end if;
  return new;
end;
$$;

drop trigger if exists consent_log_erasure_guard on public.consent_log;
create trigger consent_log_erasure_guard
before insert or update of guest_ref_id on public.consent_log
for each row execute function public.guard_guest_child_write_after_erasure();

drop trigger if exists redemption_events_erasure_guard on public.redemption_events;
create trigger redemption_events_erasure_guard
before insert or update of guest_ref_id on public.redemption_events
for each row execute function public.guard_guest_child_write_after_erasure();

drop trigger if exists events_erasure_guard on public.events;
create trigger events_erasure_guard
before insert or update of guest_ref_id on public.events
for each row execute function public.guard_guest_child_write_after_erasure();

drop trigger if exists saved_places_erasure_guard on public.saved_places;
create trigger saved_places_erasure_guard
before insert or update of guest_ref_id on public.saved_places
for each row execute function public.guard_guest_child_write_after_erasure();

drop trigger if exists shared_lists_erasure_guard on public.shared_lists;
create trigger shared_lists_erasure_guard
before insert or update of guest_ref_id on public.shared_lists
for each row execute function public.guard_guest_child_write_after_erasure();

-- Bound append-only analytics consent evidence. Identical state/version writes
-- remain idempotent. At the fixed transition ceiling, a grant fails closed. If
-- the authoritative state is still granted, one emergency withdrawal is
-- appended beyond the ceiling; that durable row keeps every later grant blocked
-- until the rolling window has capacity again.
create or replace function public.record_guest_consent(
  p_state text,
  p_consent_version text,
  p_guest_ref text default null,
  p_user_agent text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_granted boolean;
  v_previous_granted boolean;
  v_previous_version text;
  v_count integer;
  v_oldest timestamptz;
  v_retry_after integer;
  v_now timestamptz := clock_timestamp();
  v_window constant interval := interval '24 hours';
  v_max_transitions constant integer := 20;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_state is null
    or p_state not in ('essential_only', 'analytics_allowed')
    or p_consent_version is null
    or length(btrim(p_consent_version)) not between 1 and 80
    or (p_guest_ref is not null and p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$')
    or (p_state = 'analytics_allowed' and p_guest_ref is null) then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  if p_guest_ref is null then
    return jsonb_build_object(
      'ok', true,
      'state', 'essential_only',
      'recorded', false
    );
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('guest-data:' || p_guest_ref, 0)
  );
  v_now := clock_timestamp();

  select id into v_guest_id
  from public.guest_refs
  where ref = p_guest_ref
  for update;

  if v_guest_id is null and p_state = 'analytics_allowed' then
    insert into public.guest_refs(ref)
    values (p_guest_ref)
    on conflict (ref) do nothing;

    select id into v_guest_id
    from public.guest_refs
    where ref = p_guest_ref
    for update;
  end if;

  if v_guest_id is null then
    return jsonb_build_object(
      'ok', true,
      'state', 'essential_only',
      'recorded', false
    );
  end if;

  v_granted := p_state = 'analytics_allowed';
  select consent.granted, consent.terms_version
    into v_previous_granted, v_previous_version
  from public.consent_log consent
  where consent.guest_ref_id = v_guest_id
    and consent.consent_type = 'analytics'
  order by consent.ts desc, consent.id desc
  limit 1;

  if v_previous_granted is not distinct from v_granted
    and v_previous_version is not distinct from btrim(p_consent_version) then
    return jsonb_build_object(
      'ok', true,
      'state', p_state,
      'recorded', false
    );
  end if;

  select count(*)::integer, min(consent.ts)
    into v_count, v_oldest
  from public.consent_log consent
  where consent.guest_ref_id = v_guest_id
    and consent.consent_type = 'analytics'
    and consent.ts > v_now - v_window;

  if v_count >= v_max_transitions then
    v_retry_after := greatest(
      1,
      ceil(extract(epoch from (v_oldest + v_window - v_now)))::integer
    );
    if not v_granted then
      if v_previous_granted is true then
        insert into public.consent_log(
          guest_ref_id,
          consent_type,
          granted,
          user_agent,
          terms_version,
          scope,
          ts
        ) values (
          v_guest_id,
          'analytics',
          false,
          left(nullif(p_user_agent, ''), 300),
          btrim(p_consent_version),
          'first_party_usage_analytics',
          v_now
        );

        return jsonb_build_object(
          'ok', true,
          'state', 'essential_only',
          'recorded', true,
          'limit_reached', true,
          'retry_after_seconds', v_retry_after
        );
      end if;

      return jsonb_build_object(
        'ok', true,
        'state', 'essential_only',
        'recorded', false,
        'limit_reached', true,
        'retry_after_seconds', v_retry_after
      );
    end if;
    return jsonb_build_object(
      'ok', false,
      'error', 'rate_limited',
      'retry_after_seconds', v_retry_after
    );
  end if;

  insert into public.consent_log(
    guest_ref_id,
    consent_type,
    granted,
    user_agent,
    terms_version,
    scope,
    ts
  ) values (
    v_guest_id,
    'analytics',
    v_granted,
    left(nullif(p_user_agent, ''), 300),
    btrim(p_consent_version),
    'first_party_usage_analytics',
    v_now
  );

  return jsonb_build_object(
    'ok', true,
    'state', p_state,
    'recorded', true
  );
end;
$$;

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
  v_published_count integer;
  v_saved_count integer;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_guest_ref is null
    or p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
    or p_venue_slug is null
    or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or length(p_venue_slug) > 120
    or p_saved is null then
    return jsonb_build_object('ok', false, 'saved', false, 'error', 'bad_request');
  end if;

  -- Serialize essential saves with export/erasure and analytics writes for the
  -- same GuestRef. In-flight delete/save races now have one database order.
  perform pg_advisory_xact_lock(
    hashtextextended('guest-data:' || p_guest_ref, 0)
  );

  if exists (
    select 1 from public.guest_ref_tombstones tombstone
    where tombstone.ref_hash = extensions.digest(p_guest_ref, 'sha256')
  ) then
    return jsonb_build_object(
      'ok', false,
      'saved', false,
      'error', 'identity_revoked'
    );
  end if;

  if p_saved then
    perform venue.slug
    from public.venues venue
    where venue.slug = p_venue_slug
      and venue.status = 'active'
      and venue.publication_status = 'published'
    for key share;
    get diagnostics v_published_count = row_count;
    if v_published_count <> 1 then
      return jsonb_build_object(
        'ok', false,
        'saved', false,
        'error', 'venue_unavailable'
      );
    end if;

    insert into public.guest_refs(ref)
    values (p_guest_ref)
    on conflict (ref) do update set ref = excluded.ref
    returning id into v_guest_id;

    if exists (
      select 1 from public.saved_places saved
      where saved.guest_ref_id = v_guest_id
        and saved.venue_slug = p_venue_slug
    ) then
      return jsonb_build_object('ok', true, 'saved', true);
    end if;

    select count(*)::integer into v_saved_count
    from public.saved_places saved
    where saved.guest_ref_id = v_guest_id;
    if v_saved_count >= 500 then
      return jsonb_build_object(
        'ok', false,
        'saved', false,
        'error', 'save_limit_reached'
      );
    end if;

    insert into public.saved_places(guest_ref_id, venue_slug)
    values (v_guest_id, p_venue_slug)
    on conflict (guest_ref_id, venue_slug) do nothing;
  else
    select id into v_guest_id
    from public.guest_refs
    where ref = p_guest_ref;

    if v_guest_id is not null then
      delete from public.saved_places
      where guest_ref_id = v_guest_id
        and venue_slug = p_venue_slug;
    end if;
  end if;

  return jsonb_build_object('ok', true, 'saved', p_saved);
end;
$$;

-- A share created from explicit slugs by a fresh browser must still belong to
-- that browser so export and deletion cover it. Resolve/create the owner and
-- insert the snapshot inside the same erasure-guarded transaction.
create or replace function public.create_shared_list(
  p_guest_ref text,
  p_slugs text[]
)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_id text;
  v_slugs text[];
  v_attempt integer;
  v_distinct_count integer;
  v_published_count integer;
  v_list_count integer;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_guest_ref is null
    or p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
    or p_slugs is null
    or exists (
      select 1 from unnest(p_slugs) slug
      where slug is null
        or slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
        or length(slug) > 120
    ) then
    return null;
  end if;

  select count(distinct slug)::integer
    into v_distinct_count
  from unnest(p_slugs) slug;
  if v_distinct_count not between 1 and 50 then
    return null;
  end if;

  select array_agg(candidate.slug order by candidate.first_ordinal)
    into v_slugs
  from (
    select slug, min(ordinality) as first_ordinal
    from unnest(p_slugs) with ordinality as input(slug, ordinality)
    group by slug
    order by min(ordinality)
  ) candidate;
  if coalesce(cardinality(v_slugs), 0) <> v_distinct_count then
    return null;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('guest-data:' || p_guest_ref, 0)
  );
  if exists (
    select 1 from public.guest_ref_tombstones tombstone
    where tombstone.ref_hash = extensions.digest(p_guest_ref, 'sha256')
  ) then
    return null;
  end if;

  -- Lock the admitted rows so an operator cannot unpublish one between this
  -- check and the snapshot insert. Application-only editorial registries remain
  -- a stricter rendering boundary; the database admits only its own explicit
  -- active/published catalogue.
  perform venue.slug
  from public.venues venue
  where venue.slug = any(v_slugs)
    and venue.status = 'active'
    and venue.publication_status = 'published'
  for key share;
  get diagnostics v_published_count = row_count;
  if v_published_count <> v_distinct_count then
    return null;
  end if;

  insert into public.guest_refs(ref)
  values (p_guest_ref)
  on conflict (ref) do update set ref = excluded.ref
  returning id into v_guest_id;

  -- A fixed per-owner ceiling bounds durable public snapshots even when a
  -- client retries with new content. There is no resettable cookie-local quota.
  select count(*)::integer into v_list_count
  from public.shared_lists shared
  where shared.guest_ref_id = v_guest_id;
  if v_list_count >= 20 then
    return null;
  end if;

  for v_attempt in 1..5 loop
    v_id := 'l_' || encode(extensions.gen_random_bytes(12), 'hex');
    begin
      insert into public.shared_lists(id, guest_ref_id, venue_slugs)
      values (v_id, v_guest_id, v_slugs);
      return v_id;
    exception when unique_violation then
      -- Retry only the opaque public-list ID collision.
    end;
  end loop;
  return null;
end;
$$;

-- Export participates in the same per-GuestRef critical section as erasure and
-- every identity-bearing write. If erasure won first, expose the same empty,
-- non-probing versioned envelope as an unknown identity.
create or replace function public.export_guest_data(p_guest_ref text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_identity jsonb;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_guest_ref is null or p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$' then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('guest-data:' || p_guest_ref, 0)
  );

  if not exists (
    select 1 from public.guest_ref_tombstones tombstone
    where tombstone.ref_hash = extensions.digest(p_guest_ref, 'sha256')
  ) then
    select guest.id,
      jsonb_build_object(
        'guestRef', guest.ref,
        'firstDistrict', guest.first_district,
        'source', guest.source,
        'createdAt', guest.created_at
      )
      into v_guest_id, v_identity
    from public.guest_refs guest
    where guest.ref = p_guest_ref;
  end if;

  return jsonb_build_object(
    'ok', true,
    'version', 1,
    'data', jsonb_build_object(
      'identity', v_identity,
      'consents', coalesce((
        select jsonb_agg(jsonb_build_object(
          'type', consent.consent_type,
          'granted', consent.granted,
          'version', consent.terms_version,
          'scope', consent.scope,
          'userAgent', consent.user_agent,
          'timestamp', consent.ts
        ) order by consent.ts, consent.id)
        from public.consent_log consent
        where consent.guest_ref_id = v_guest_id
      ), '[]'::jsonb),
      'events', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', event.id,
          'type', event.type,
          'venueSlug', event.venue_slug,
          'source', event.source,
          'payload', event.payload,
          'meta', event.meta,
          'timestamp', event.ts
        ) order by event.ts)
        from public.events event
        where event.guest_ref_id = v_guest_id
      ), '[]'::jsonb),
      'redemptions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'venueSlug', redemption.venue_slug,
          'perkId', redemption.perk_id,
          'confirmCode', redemption.confirm_code,
          'source', redemption.source,
          'sourceClass', redemption.source_class,
          'externallyAttributed', redemption.externally_attributed,
          'timestamp', redemption.ts
        ) order by redemption.ts)
        from public.redemption_events redemption
        where redemption.guest_ref_id = v_guest_id
      ), '[]'::jsonb),
      'savedPlaces', coalesce((
        select jsonb_agg(jsonb_build_object(
          'venueSlug', saved.venue_slug,
          'createdAt', saved.created_at
        ) order by saved.created_at)
        from public.saved_places saved
        where saved.guest_ref_id = v_guest_id
      ), '[]'::jsonb),
      'sharedLists', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', shared.id,
          'venueSlugs', shared.venue_slugs,
          'createdAt', shared.created_at
        ) order by shared.created_at)
        from public.shared_lists shared
        where shared.guest_ref_id = v_guest_id
      ), '[]'::jsonb)
    )
  );
end;
$$;

create or replace function public.delete_guest_data(p_guest_ref text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_guest_ref is null or p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$' then
    return jsonb_build_object('ok', true, 'status', 'completed');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('guest-data:' || p_guest_ref, 0)
  );

  -- Insert even when no guest row exists. A deletion request therefore wins
  -- over any delayed first write that still carries the old browser cookie.
  insert into public.guest_ref_tombstones(ref_hash)
  values (extensions.digest(p_guest_ref, 'sha256'))
  on conflict (ref_hash) do nothing;

  select id into v_guest_id
  from public.guest_refs
  where ref = p_guest_ref
  for update;

  if v_guest_id is not null then
    delete from public.events
    where guest_ref_id = v_guest_id
      and type = 'dish_feedback';

    delete from public.shared_lists
    where guest_ref_id = v_guest_id;

    delete from public.guest_refs
    where id = v_guest_id;
  end if;

  return jsonb_build_object('ok', true, 'status', 'completed');
end;
$$;

-- log_event_v3 is the authoritative server-backed consent/rate/dedupe gate.
-- Assign first-touch source only after it succeeds, inside the same transaction;
-- forged client cookies can no longer create or mutate guest rows.
create or replace function public.capture_source_scan(
  p_guest_ref text,
  p_source text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_result jsonb;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_guest_ref is null
    or p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
    or p_source is null then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  v_result := public.log_event_v3(
    'source_scan',
    p_guest_ref,
    null,
    p_source,
    null
  );

  if coalesce((v_result->>'ok')::boolean, false) then
    update public.guest_refs
    set source = p_source
    where ref = p_guest_ref
      and source is null;
  end if;

  return v_result;
end;
$$;

-- Feedback remains service-only, redemption-gated and first-write-wins. The
-- GuestRef lock plus partial unique index make retries idempotent and bound the
-- durable free-text surface to one row per redeemed guest and venue.
create or replace function public.log_dish_feedback(
  p_guest_ref text,
  p_venue_slug text,
  p_dish text,
  p_verdict text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_guest_ref is null
    or p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
    or p_venue_slug is null
    or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or length(p_venue_slug) > 120
    or p_dish is null
    or char_length(btrim(p_dish)) not between 1 and 120
    or p_verdict is null
    or p_verdict not in ('worth_it','meh') then
    return;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('guest-data:' || p_guest_ref, 0)
  );
  if exists (
    select 1 from public.guest_ref_tombstones tombstone
    where tombstone.ref_hash = extensions.digest(p_guest_ref, 'sha256')
  ) then
    return;
  end if;

  select guest.id into v_guest_id
  from public.guest_refs guest
  where guest.ref = p_guest_ref;
  if v_guest_id is null or not exists (
    select 1 from public.redemption_events redemption
    where redemption.guest_ref_id = v_guest_id
      and redemption.venue_slug = p_venue_slug
  ) then
    return;
  end if;

  if exists (
    select 1 from public.events event
    where event.guest_ref_id = v_guest_id
      and event.venue_slug = p_venue_slug
      and event.type = 'dish_feedback'
  ) then
    return;
  end if;

  insert into public.events(type, guest_ref_id, venue_slug, meta)
  values (
    'dish_feedback',
    v_guest_id,
    p_venue_slug,
    jsonb_build_object('dish', btrim(p_dish), 'verdict', p_verdict)
  );
end;
$$;

-- Read-only service credential + schema probe for the server health endpoint.
-- It intentionally returns no row counts, identifiers or operator data.
create or replace function public.release_readiness_v1()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_ok boolean;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;

  select
    to_regclass('public.venues') is not null
    and to_regclass('public.venue_photos') is not null
    and to_regclass('public.guest_refs') is not null
    and to_regclass('public.consent_log') is not null
    and to_regclass('public.events') is not null
    and to_regclass('public.attribution_sources') is not null
    and to_regclass('public.redemption_events') is not null
    and to_regclass('public.saved_places') is not null
    and to_regclass('public.shared_lists') is not null
    and to_regclass('public.route_stops') is not null
    and to_regclass('public.guide_leads') is not null
    and to_regclass('public.guest_ref_tombstones') is not null
    and to_regprocedure('public.venue_model_backfill_review()') is not null
    and to_regprocedure('public.record_guest_consent(text,text,text,text)') is not null
    and to_regprocedure('public.export_guest_data(text)') is not null
    and to_regprocedure('public.delete_guest_data(text)') is not null
    and to_regprocedure('public.log_event_v3(text,text,text,text,jsonb)') is not null
    and to_regprocedure('public.record_redemption(text,text,boolean,text)') is not null
    and to_regprocedure(
      'public.submit_guide_lead(text,text,text,text,text,text[],text,text,jsonb,boolean,text)'
    ) is not null
    and to_regprocedure('public.set_saved_place(text,text,boolean)') is not null
    and to_regprocedure('public.create_shared_list(text,text[])') is not null
    and to_regprocedure('public.capture_source_scan(text,text)') is not null
    and to_regprocedure('public.log_dish_feedback(text,text,text,text)') is not null
    and to_regprocedure('public.saved_places_for(text)') is not null
    and to_regprocedure('public.shared_list_slugs(text)') is not null
    and to_regprocedure('extensions.digest(text,text)') is not null
    and exists (
      select 1
      from pg_constraint constraint_row
      where constraint_row.conrelid = to_regclass('public.route_stops')
        and constraint_row.conname = 'route_stops_route_rank_key'
        and constraint_row.contype = 'u'
        and constraint_row.convalidated
    )
    and exists (
      select 1
      from pg_attribute attribute
      where attribute.attrelid = to_regclass('public.shared_lists')
        and attribute.attname = 'guest_ref_id'
        and attribute.attnotnull
        and not attribute.attisdropped
    )
    and exists (
      select 1
      from pg_constraint constraint_row
      where constraint_row.conrelid = to_regclass('public.shared_lists')
        and constraint_row.confrelid = to_regclass('public.guest_refs')
        and constraint_row.contype = 'f'
        and constraint_row.confdeltype = 'c'
    )
    and exists (
      select 1
      from pg_class table_row
      where table_row.oid = to_regclass('public.guest_ref_tombstones')
        and table_row.relrowsecurity
        and table_row.relforcerowsecurity
    )
    and (
      select count(*)
      from pg_trigger trigger_row
      where not trigger_row.tgisinternal
        and trigger_row.tgenabled <> 'D'
        and (trigger_row.tgrelid, trigger_row.tgname) in (
          (to_regclass('public.guest_refs'), 'guest_refs_erasure_guard'),
          (to_regclass('public.consent_log'), 'consent_log_erasure_guard'),
          (to_regclass('public.redemption_events'), 'redemption_events_erasure_guard'),
          (to_regclass('public.events'), 'events_erasure_guard'),
          (to_regclass('public.saved_places'), 'saved_places_erasure_guard'),
          (to_regclass('public.shared_lists'), 'shared_lists_erasure_guard')
        )
    ) = 6
    and exists (
      select 1
      from pg_index index_row
      where index_row.indexrelid = to_regclass(
        'public.events_one_dish_feedback_per_guest_venue_idx'
      )
        and index_row.indisvalid
        and index_row.indisready
    )
    into v_ok;

  return jsonb_build_object(
    'ok', coalesce(v_ok, false),
    'version', 1,
    'schemaRevision', '0039'
  );
end;
$$;

-- Retire the old mutation-only RPC so future server code cannot bypass the
-- database consent gate accidentally.
drop function if exists public.set_guest_source(text, text);

revoke all on function public.guard_guest_ref_insert_after_erasure()
  from public, anon, authenticated, service_role;
revoke all on function public.guard_guest_child_write_after_erasure()
  from public, anon, authenticated, service_role;

revoke all on function public.record_guest_consent(text,text,text,text)
  from public, anon, authenticated, service_role;
grant execute on function public.record_guest_consent(text,text,text,text)
  to service_role;

revoke all on function public.set_saved_place(text,text,boolean)
  from public, anon, authenticated, service_role;
grant execute on function public.set_saved_place(text,text,boolean)
  to service_role;

revoke all on function public.capture_source_scan(text,text)
  from public, anon, authenticated, service_role;
grant execute on function public.capture_source_scan(text,text)
  to service_role;

revoke all on function public.create_shared_list(text,text[])
  from public, anon, authenticated, service_role;
grant execute on function public.create_shared_list(text,text[])
  to service_role;

revoke all on function public.export_guest_data(text)
  from public, anon, authenticated, service_role;
grant execute on function public.export_guest_data(text)
  to service_role;

revoke all on function public.delete_guest_data(text)
  from public, anon, authenticated, service_role;
grant execute on function public.delete_guest_data(text)
  to service_role;

revoke all on function public.log_dish_feedback(text,text,text,text)
  from public, anon, authenticated, service_role;
grant execute on function public.log_dish_feedback(text,text,text,text)
  to service_role;

revoke all on function public.release_readiness_v1()
  from public, anon, authenticated, service_role;
grant execute on function public.release_readiness_v1()
  to service_role;

comment on function public.set_saved_place(text,text,boolean) is
  'Service-only idempotent saved-place state setter; repeated requests cannot toggle data away.';
comment on function public.record_guest_consent(text,text,text,text) is
  'Service-only append-only analytics consent evidence with a fixed 20-transition-per-24-hour ceiling; grants fail closed and one durable emergency withdrawal may exceed the ceiling.';
comment on function public.capture_source_scan(text,text) is
  'Service-only atomic source event and first-touch assignment after log_event_v3 verifies server-backed analytics consent.';
comment on function public.create_shared_list(text,text[]) is
  'Service-only owned shared-list snapshot; fresh explicit shares are included in GuestRef export and erasure.';
comment on function public.export_guest_data(text) is
  'Service-only versioned export serialized with GuestRef erasure; revoked identities return an empty non-probing envelope.';
comment on function public.delete_guest_data(text) is
  'Service-only generic erasure with a hash-only durable revocation marker that prevents stale GuestRef resurrection.';
comment on function public.log_dish_feedback(text,text,text,text) is
  'Service-only redeemed-guest feedback; first write wins and at most one bounded row is retained per GuestRef and venue.';
comment on function public.release_readiness_v1() is
  'Service-only read-only credential and schema readiness probe through migration 0039; returns no tenant data.';
comment on table public.guest_ref_tombstones is
  'Hash-only durable revocation markers for erased random GuestRefs; raw GuestRefs are never retained here.';

commit;
