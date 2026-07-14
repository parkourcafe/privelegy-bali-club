-- C-06 guest consent, export and deletion database foundation.
--
-- All functions are service-role only. The public API must resolve the
-- httpOnly GuestRef cookie server-side; no endpoint accepts a caller-supplied
-- identifier. No IP address is accepted or retained by these functions.

begin;

create index if not exists consent_log_guest_type_ts_idx
  on public.consent_log(guest_ref_id, consent_type, ts desc)
  where guest_ref_id is not null;

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
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_state not in ('essential_only', 'analytics_allowed')
    or p_consent_version is null
    or length(btrim(p_consent_version)) not between 1 and 80
    or (p_guest_ref is not null and p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$')
    or (p_state = 'analytics_allowed' and p_guest_ref is null) then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  -- A fresh essential-only choice must not create analytics identity.
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

  -- Withdrawing before any server identity existed is still a successful,
  -- privacy-preserving operation and creates no row.
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
    clock_timestamp()
  );

  return jsonb_build_object(
    'ok', true,
    'state', p_state,
    'recorded', true
  );
end;
$$;

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
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$' then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

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

  -- A generic completion response prevents identifier-existence probing.
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$' then
    return jsonb_build_object('ok', true, 'status', 'completed');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('guest-data:' || p_guest_ref, 0)
  );

  select id into v_guest_id
  from public.guest_refs
  where ref = p_guest_ref
  for update;

  if v_guest_id is not null then
    -- Dish feedback contains bounded but still user-authored free text. Delete
    -- those rows before removing the identity so that content cannot survive
    -- as an otherwise-unlinked aggregate event.
    delete from public.events
    where guest_ref_id = v_guest_id
      and type = 'dish_feedback';

    -- Shared list snapshots are guest-created content, so remove them rather
    -- than merely applying the historical ON DELETE SET NULL behavior.
    delete from public.shared_lists
    where guest_ref_id = v_guest_id;

    -- consent_log, redemption_events and saved_places cascade. Remaining
    -- bounded usage events use ON DELETE SET NULL, preserving only aggregate
    -- facts that contain no user-authored content.
    delete from public.guest_refs
    where id = v_guest_id;
  end if;

  return jsonb_build_object('ok', true, 'status', 'completed');
end;
$$;

revoke all on function public.record_guest_consent(text,text,text,text)
  from public, anon, authenticated;
revoke all on function public.export_guest_data(text)
  from public, anon, authenticated;
revoke all on function public.delete_guest_data(text)
  from public, anon, authenticated;

grant execute on function public.record_guest_consent(text,text,text,text)
  to service_role;
grant execute on function public.export_guest_data(text)
  to service_role;
grant execute on function public.delete_guest_data(text)
  to service_role;

comment on function public.record_guest_consent(text,text,text,text) is
  'Append-only analytics consent evidence. Essential-only without an existing GuestRef creates no identity.';
comment on function public.export_guest_data(text) is
  'Service-only versioned export for the current httpOnly GuestRef.';
comment on function public.delete_guest_data(text) is
  'Service-only generic deletion response; user-authored event content is erased and bounded usage events become irreversibly anonymous.';

commit;
