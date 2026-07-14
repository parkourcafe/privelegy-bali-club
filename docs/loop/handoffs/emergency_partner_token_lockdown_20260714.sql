-- Emergency production-only lockdown for the legacy onboarding-token leak.
-- Apply as one tracked Supabase migration named:
--   emergency_partner_token_lockdown_20260714
--
-- This intentionally contains only the urgent operator boundary and token
-- rotation. The full release schema remains staged separately.

begin;

lock table public.venue_onboard_tokens in access exclusive mode;

create temporary table _other_bali_token_lockdown_before
on commit drop
as
select
  count(*)::bigint as token_count,
  count(distinct venue_slug)::bigint as venue_count,
  md5(coalesce(string_agg(token, '' order by venue_slug, token), '')) as token_set_digest
from public.venue_onboard_tokens;

do $$
declare
  v_token_count bigint;
  v_venue_count bigint;
begin
  select token_count, venue_count
  into v_token_count, v_venue_count
  from _other_bali_token_lockdown_before;

  if v_token_count = 0 then
    raise exception 'Lockdown refused: venue_onboard_tokens is empty';
  end if;

  if v_token_count <> v_venue_count then
    raise exception
      'Lockdown refused: expected one token per venue before rotation (tokens %, venues %)',
      v_token_count,
      v_venue_count;
  end if;
end;
$$;

update public.venue_onboard_tokens
set token = encode(gen_random_bytes(32), 'hex'),
    created_at = clock_timestamp();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.venue_onboard_tokens'::regclass
      and conname = 'venue_onboard_tokens_strong_token_check'
  ) then
    alter table public.venue_onboard_tokens
      add constraint venue_onboard_tokens_strong_token_check
      check (token ~ '^[0-9a-f]{64}$');
  end if;
end;
$$;

create unique index if not exists venue_onboard_tokens_one_per_venue_idx
  on public.venue_onboard_tokens(venue_slug);

create or replace function public.get_or_create_onboard_token(p_venue_slug text)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_token text;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'operator role required';
  end if;

  if not exists (select 1 from public.venues where slug = p_venue_slug) then
    return null;
  end if;

  perform pg_advisory_xact_lock(hashtextextended('onboard-token:' || p_venue_slug, 0));

  select token
  into v_token
  from public.venue_onboard_tokens
  where venue_slug = p_venue_slug
  order by created_at, token
  limit 1;

  if v_token is null then
    v_token := encode(gen_random_bytes(32), 'hex');
    insert into public.venue_onboard_tokens(token, venue_slug)
    values (v_token, p_venue_slug);
  end if;

  return v_token;
end;
$$;

create or replace function public.invite_roster()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'operator role required';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('invite-roster', 0));

  insert into public.venue_onboard_tokens(token, venue_slug)
  select encode(gen_random_bytes(32), 'hex'), v.slug
  from public.venues v
  where not exists (
    select 1
    from public.venue_onboard_tokens t
    where t.venue_slug = v.slug
  );

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'slug', v.slug,
      'name', v.name,
      'district', v.district,
      'status', v.status,
      'whatsapp', v.whatsapp,
      'token', tk.token,
      'confirmed', exists (
        select 1
        from public.venue_confirmations c
        where c.venue_slug = v.slug and c.agreed
      ),
      'has_photo', v.photo_url is not null
    ) order by v.district, v.name)
    from public.venues v
    join lateral (
      select token
      from public.venue_onboard_tokens t
      where t.venue_slug = v.slug
      order by created_at, token
      limit 1
    ) tk on true
  ), '[]'::jsonb);
end;
$$;

revoke all on table public.venue_onboard_tokens from public, anon, authenticated;
revoke all on function public.get_or_create_onboard_token(text)
  from public, anon, authenticated;
revoke all on function public.invite_roster()
  from public, anon, authenticated;

grant select, insert on table public.venue_onboard_tokens to service_role;
grant execute on function public.get_or_create_onboard_token(text) to service_role;
grant execute on function public.invite_roster() to service_role;

do $$
declare
  v_before _other_bali_token_lockdown_before%rowtype;
  v_after_count bigint;
  v_after_venues bigint;
  v_after_digest text;
begin
  select * into v_before from _other_bali_token_lockdown_before;

  select
    count(*)::bigint,
    count(distinct venue_slug)::bigint,
    md5(coalesce(string_agg(token, '' order by venue_slug, token), ''))
  into v_after_count, v_after_venues, v_after_digest
  from public.venue_onboard_tokens;

  if v_after_count <> v_before.token_count
     or v_after_venues <> v_before.venue_count then
    raise exception 'Lockdown verification failed: token/venue counts changed';
  end if;

  if v_after_digest = v_before.token_set_digest then
    raise exception 'Lockdown verification failed: token set did not rotate';
  end if;

  if exists (
    select 1
    from public.venue_onboard_tokens
    where token !~ '^[0-9a-f]{64}$'
  ) then
    raise exception 'Lockdown verification failed: invalid token format remains';
  end if;

  if has_function_privilege('anon', 'public.invite_roster()', 'EXECUTE')
     or has_function_privilege('authenticated', 'public.invite_roster()', 'EXECUTE')
     or has_function_privilege('anon', 'public.get_or_create_onboard_token(text)', 'EXECUTE')
     or has_function_privilege('authenticated', 'public.get_or_create_onboard_token(text)', 'EXECUTE') then
    raise exception 'Lockdown verification failed: public operator EXECUTE remains';
  end if;

  if not has_function_privilege('service_role', 'public.invite_roster()', 'EXECUTE')
     or not has_function_privilege('service_role', 'public.get_or_create_onboard_token(text)', 'EXECUTE') then
    raise exception 'Lockdown verification failed: service-role operator access missing';
  end if;
end;
$$;

commit;
