-- C-07 atomic, consent-backed event logging with a fixed per-GuestRef limit.
-- No IP address is accepted, hashed or retained. Limits are server constants,
-- not caller-controlled parameters.

begin;

do $dependencies$
begin
  if to_regclass('public.events') is null
    or to_regclass('public.guest_refs') is null
    or to_regclass('public.consent_log') is null
    or to_regclass('public.attribution_sources') is null then
    raise exception using
      errcode = '55000',
      message = '0037 requires the tracked schema chain through 0036 (including attribution_sources)';
  end if;
end
$dependencies$;

create index if not exists events_guest_ts_idx
  on public.events(guest_ref_id, ts desc)
  where guest_ref_id is not null;

create or replace function public.log_event_v3(
  p_type text,
  p_guest_ref text,
  p_venue_slug text default null,
  p_source text default null,
  p_payload jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_latest_consent boolean;
  v_clean jsonb;
  v_count integer;
  v_oldest timestamptz;
  v_retry_after integer;
  v_event_id uuid;
  v_now timestamptz := clock_timestamp();
  v_window constant interval := interval '60 seconds';
  v_max_events constant integer := 30;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
    or p_type not in (
      'source_scan','landing_open','venue_card_open','perk_open','direction_click',
      'reservation_click','similar_open','district_open',
      'district_page_view','editorial_page_view','venue_detail_view',
      'venue_card_click','booking_click','official_website_click',
      'instagram_click','menu_click','partner_offer_click',
      'guide_form_started','guide_form_submitted','whatsapp_guide_click',
      'internal_guide_click','menu_open','menu_item_open','action_handoff',
      'delivery_click','takeaway_click','preorder_click'
    )
    or (
      p_venue_slug is not null
      and (
        length(p_venue_slug) > 120
        or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$'
      )
    )
    or (
      p_type = 'source_scan'
      and (p_source is null or p_venue_slug is not null)
    ) then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  if p_type in ('menu_open','menu_item_open') then
    if p_venue_slug is null
      or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      or p_payload is null
      or jsonb_typeof(p_payload) <> 'object'
      or p_payload->>'venueSlug' is distinct from p_venue_slug
      or exists (
        select 1 from jsonb_object_keys(p_payload) as keys(key)
        where key not in ('venueSlug','menuId','menuItemId')
      )
      or coalesce(p_payload->>'menuId', '') !~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$'
      or (p_type = 'menu_open' and p_payload ? 'menuItemId')
      or (
        p_type = 'menu_item_open'
        and coalesce(p_payload->>'menuItemId', '') !~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$'
      ) then
      return jsonb_build_object('ok', false, 'error', 'bad_request');
    end if;
    v_clean := jsonb_strip_nulls(jsonb_build_object(
      'venueSlug', p_payload->>'venueSlug',
      'menuId', p_payload->>'menuId',
      'menuItemId', p_payload->>'menuItemId'
    ));
  elsif p_type in ('action_handoff','delivery_click','takeaway_click','preorder_click') then
    if p_venue_slug is null
      or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      or p_payload is null
      or jsonb_typeof(p_payload) <> 'object'
      or p_payload->>'venueSlug' is distinct from p_venue_slug
      or exists (
        select 1 from jsonb_object_keys(p_payload) as keys(key)
        where key not in ('action','provider','capabilityId','venueSlug')
      )
      or coalesce(p_payload->>'provider', '') !~ '^[a-z0-9][a-z0-9_-]{0,63}$'
      or (
        p_payload ? 'capabilityId'
        and coalesce(p_payload->>'capabilityId', '') !~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$'
      )
      or coalesce(p_payload->>'action', '') not in (
        'reserve','delivery','takeaway','preorder','website','whatsapp','maps'
      )
      or (p_type = 'delivery_click' and p_payload->>'action' <> 'delivery')
      or (p_type = 'takeaway_click' and p_payload->>'action' <> 'takeaway')
      or (p_type = 'preorder_click' and p_payload->>'action' <> 'preorder') then
      return jsonb_build_object('ok', false, 'error', 'bad_request');
    end if;
    v_clean := jsonb_strip_nulls(jsonb_build_object(
      'action', p_payload->>'action',
      'provider', p_payload->>'provider',
      'capabilityId', p_payload->>'capabilityId',
      'venueSlug', p_payload->>'venueSlug'
    ));
  elsif p_payload is not null then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  if p_source is not null and not exists (
    select 1
    from public.attribution_sources source
    where source.id = p_source
      and source.active
  ) then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  -- This lock makes consent check, deduplication, rate count and insert one
  -- serial critical section for a GuestRef. It also coordinates with delete.
  perform pg_advisory_xact_lock(
    hashtextextended('guest-data:' || p_guest_ref, 0)
  );

  select id into v_guest_id
  from public.guest_refs
  where ref = p_guest_ref;

  if v_guest_id is null then
    return jsonb_build_object('ok', false, 'error', 'analytics_consent_required');
  end if;

  select consent.granted into v_latest_consent
  from public.consent_log consent
  where consent.guest_ref_id = v_guest_id
    and consent.consent_type = 'analytics'
  order by consent.ts desc, consent.id desc
  limit 1;

  if v_latest_consent is distinct from true then
    return jsonb_build_object('ok', false, 'error', 'analytics_consent_required');
  end if;

  if exists (
    select 1
    from public.events event
    where event.guest_ref_id = v_guest_id
      and event.type = p_type
      and event.venue_slug is not distinct from p_venue_slug
      and event.source is not distinct from p_source
      and event.payload is not distinct from v_clean
      and event.ts > v_now - interval '5 seconds'
  ) then
    return jsonb_build_object(
      'ok', true,
      'stored', false,
      'deduplicated', true
    );
  end if;

  select count(*)::integer, min(event.ts)
    into v_count, v_oldest
  from public.events event
  where event.guest_ref_id = v_guest_id
    and event.ts > v_now - v_window;

  if v_count >= v_max_events then
    v_retry_after := greatest(
      1,
      ceil(extract(epoch from (v_oldest + v_window - v_now)))::integer
    );
    return jsonb_build_object(
      'ok', false,
      'error', 'rate_limited',
      'retry_after_seconds', v_retry_after
    );
  end if;

  insert into public.events(
    type,
    guest_ref_id,
    venue_slug,
    source,
    payload,
    ts
  ) values (
    p_type,
    v_guest_id,
    p_venue_slug,
    p_source,
    v_clean,
    v_now
  )
  returning id into v_event_id;

  return jsonb_build_object(
    'ok', true,
    'stored', true,
    'deduplicated', false,
    'event_id', v_event_id
  );
end;
$$;

revoke all on function public.log_event_v3(text,text,text,text,jsonb)
  from public, anon, authenticated;
grant execute on function public.log_event_v3(text,text,text,text,jsonb)
  to service_role;

comment on function public.log_event_v3(text,text,text,text,jsonb) is
  'Service-only consent-backed event insert with an atomic fixed 30-per-60-second GuestRef limit and no IP retention.';

commit;
