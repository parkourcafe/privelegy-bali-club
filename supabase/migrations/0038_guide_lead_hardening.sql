-- Guide-lead P1 hardening.
--
-- The legacy 0018 RPC was executable by anon/authenticated, which allowed a
-- caller with the public Supabase anon key to bypass the bounded Next.js API.
-- This forward-only repair makes the RPC service-role-only and adds an atomic
-- fixed-window limit to each already-deduplicated contact row. No IP address or
-- additional contact fingerprint is collected.

begin;

do $dependencies$
begin
  if to_regclass('public.guide_leads') is null then
    raise exception using
      errcode = '55000',
      message = '0038 requires public.guide_leads from migration 0018';
  end if;
end
$dependencies$;

alter table public.guide_leads
  add column if not exists submission_window_started_at timestamptz,
  add column if not exists submission_window_count integer not null default 0;

do $constraint$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.guide_leads'::regclass
      and conname = 'guide_leads_submission_window_count_check'
  ) then
    alter table public.guide_leads
      add constraint guide_leads_submission_window_count_check
      check (submission_window_count between 0 and 5);
  end if;
end
$constraint$;

create or replace function public.submit_guide_lead(
  p_first_name text,
  p_channel text,
  p_email text,
  p_whatsapp text,
  p_travel_date text default null,
  p_interests text[] default null,
  p_language text default null,
  p_source text default null,
  p_utm jsonb default null,
  p_consent boolean default false,
  p_user_agent text default null
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_first text := nullif(btrim(coalesce(p_first_name, '')), '');
  v_email text := nullif(btrim(lower(coalesce(p_email, ''))), '');
  v_wa text := nullif(regexp_replace(coalesce(p_whatsapp, ''), '[^0-9]', '', 'g'), '');
  v_contact text;
  v_duplicate boolean := false;
  v_existing_id uuid;
  v_travel date := null;
  v_now timestamptz := clock_timestamp();
  v_window_started_at timestamptz;
  v_window_count integer := 0;
  v_next_window_started_at timestamptz;
  v_next_window_count integer;
  v_retry_after integer;
  v_window constant interval := interval '15 minutes';
  v_max_submissions constant integer := 5;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;

  if not coalesce(p_consent, false) then
    return jsonb_build_object('ok', false, 'error', 'consent_required');
  end if;
  if v_first is null or char_length(v_first) > 80 then
    return jsonb_build_object('ok', false, 'error', 'name_required');
  end if;
  if p_channel is null
    or p_channel not in ('email', 'whatsapp')
    or char_length(coalesce(p_email, '')) > 200
    or char_length(coalesce(p_whatsapp, '')) > 20
    or char_length(coalesce(p_language, '')) > 12
    or char_length(coalesce(p_source, '')) > 64
    or char_length(coalesce(p_user_agent, '')) > 400
    or coalesce(cardinality(p_interests), 0) > 8
    or exists (
      select 1 from unnest(coalesce(p_interests, '{}')) interest
      where interest is null or char_length(btrim(interest)) not between 1 and 40
    )
    or (
      p_utm is not null
      and (jsonb_typeof(p_utm) <> 'object' or octet_length(p_utm::text) > 2048)
    ) then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;
  if p_channel = 'email' and (
    v_email is null
    or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    or v_wa is not null
  ) then
    return jsonb_build_object('ok', false, 'error', 'bad_email');
  end if;
  if p_channel = 'whatsapp' and (
    v_wa is null
    or length(v_wa) < 7
    or length(v_wa) > 16
    or v_email is not null
  ) then
    return jsonb_build_object('ok', false, 'error', 'bad_whatsapp');
  end if;
  if p_language is not null and btrim(p_language) <> ''
    and btrim(p_language) not in ('en', 'ru') then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;
  if p_source is not null and btrim(p_source) <> ''
    and btrim(p_source) !~ '^[a-z0-9][a-z0-9_-]{0,63}$' then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  if nullif(btrim(coalesce(p_travel_date, '')), '') is not null then
    begin
      v_travel := btrim(p_travel_date)::date;
    exception when others then
      return jsonb_build_object('ok', false, 'error', 'bad_request');
    end;
  end if;

  v_contact := case when p_channel = 'email' then v_email else v_wa end;

  -- One transaction serializes the counter check and duplicate suppression
  -- for this contact. Possession of an email address or phone number is not
  -- proof of control, so a duplicate must never overwrite the original lead's
  -- profile or trip preferences.
  perform pg_advisory_xact_lock(
    hashtextextended('guide-lead:uluwatu-48-hours:' || v_contact, 0)
  );
  -- Measure the window only after any concurrent submission releases the lock.
  v_now := clock_timestamp();

  select id, submission_window_started_at, submission_window_count
    into v_existing_id, v_window_started_at, v_window_count
  from public.guide_leads
  where guide_slug = 'uluwatu-48-hours'
    and coalesce(nullif(email, ''), whatsapp) = v_contact
  for update;

  v_duplicate := v_existing_id is not null;
  if v_duplicate
    and v_window_started_at is not null
    and v_window_started_at > v_now - v_window then
    if v_window_count >= v_max_submissions then
      v_retry_after := greatest(
        1,
        ceil(extract(epoch from (v_window_started_at + v_window - v_now)))::integer
      );
      return jsonb_build_object(
        'ok', false,
        'error', 'rate_limited',
        'retry_after_seconds', v_retry_after
      );
    end if;
    v_next_window_started_at := v_window_started_at;
    v_next_window_count := v_window_count + 1;
  else
    v_next_window_started_at := v_now;
    v_next_window_count := 1;
  end if;

  insert into public.guide_leads (
    guide_slug, first_name, channel, email, whatsapp, travel_date,
    interests, language, source, utm, consent_granted, user_agent,
    submission_window_started_at, submission_window_count
  ) values (
    'uluwatu-48-hours', v_first, p_channel,
    case when p_channel = 'email' then v_email else null end,
    case when p_channel = 'whatsapp' then v_wa else null end,
    v_travel,
    case when p_interests is null then null else
      (select array(select distinct btrim(interest)
        from unnest(p_interests) interest limit 8))
    end,
    nullif(btrim(coalesce(p_language, '')), ''),
    nullif(btrim(coalesce(p_source, '')), ''),
    p_utm,
    true,
    nullif(p_user_agent, ''),
    v_next_window_started_at,
    v_next_window_count
  )
  on conflict (guide_slug, coalesce(nullif(email, ''), whatsapp)) do update set
    -- Abuse-window metadata only. Unverified callers cannot edit an existing
    -- person's submitted name, date, interests, language, source or UTM data.
    submission_window_started_at = excluded.submission_window_started_at,
    submission_window_count = excluded.submission_window_count,
    updated_at = v_now;

  return jsonb_build_object('ok', true, 'duplicate', v_duplicate);
end;
$$;

revoke all on table public.guide_leads from public, anon, authenticated;
revoke all on function public.submit_guide_lead(
  text,text,text,text,text,text[],text,text,jsonb,boolean,text
) from public, anon, authenticated, service_role;
grant execute on function public.submit_guide_lead(
  text,text,text,text,text,text[],text,text,jsonb,boolean,text
) to service_role;

comment on function public.submit_guide_lead(
  text,text,text,text,text,text[],text,text,jsonb,boolean,text
) is 'Service-only guide lead insert with duplicate suppression and an atomic 5-per-15-minute contact limit; duplicate callers cannot overwrite profile data and no IP address is stored.';

commit;
