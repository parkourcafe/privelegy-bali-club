-- USE THIS FILE: SUPABASE SQL EDITOR COMPATIBLE VERSION 3 (2026-07-14).
-- Emergency production-only lockdown for the legacy onboarding-token leak.
--
-- This is deliberately one DO statement. Supabase SQL Editor may execute
-- pasted top-level statements through different pooled connections, so this
-- version uses no temporary tables and is atomic as a single statement.

do $lockdown$
declare
  v_before_token_count bigint;
  v_before_venue_count bigint;
  v_before_token_digest text;
  v_after_token_count bigint;
  v_after_venue_count bigint;
  v_after_token_digest text;
begin
  lock table public.venue_onboard_tokens in access exclusive mode;

  select
    count(*)::bigint,
    count(distinct venue_slug)::bigint,
    md5(coalesce(string_agg(token, '' order by venue_slug, token), ''))
  into
    v_before_token_count,
    v_before_venue_count,
    v_before_token_digest
  from public.venue_onboard_tokens;

  if v_before_token_count = 0 then
    raise exception 'Lockdown refused: venue_onboard_tokens is empty';
  end if;

  if v_before_token_count <> v_before_venue_count then
    raise exception
      'Lockdown refused: expected one token per venue before rotation (tokens %, venues %)',
      v_before_token_count,
      v_before_venue_count;
  end if;

  update public.venue_onboard_tokens
  set token = encode(gen_random_bytes(32), 'hex'),
      created_at = clock_timestamp();

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.venue_onboard_tokens'::regclass
      and conname = 'venue_onboard_tokens_strong_token_check'
  ) then
    execute $ddl$
      alter table public.venue_onboard_tokens
        add constraint venue_onboard_tokens_strong_token_check
        check (token ~ '^[0-9a-f]{64}$')
    $ddl$;
  end if;

  execute $ddl$
    create unique index if not exists venue_onboard_tokens_one_per_venue_idx
      on public.venue_onboard_tokens(venue_slug)
  $ddl$;

  execute $function$
    create or replace function public.get_or_create_onboard_token(p_venue_slug text)
    returns text
    language plpgsql
    security definer
    set search_path = public, pg_temp
    as $body$
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
    $body$
  $function$;

  execute $function$
    create or replace function public.invite_roster()
    returns jsonb
    language plpgsql
    security definer
    set search_path = public, pg_temp
    as $body$
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
    $body$
  $function$;

  execute 'revoke all on table public.venue_onboard_tokens from public, anon, authenticated';
  execute 'revoke all on function public.get_or_create_onboard_token(text) from public, anon, authenticated';
  execute 'revoke all on function public.invite_roster() from public, anon, authenticated';
  execute 'grant select, insert on table public.venue_onboard_tokens to service_role';
  execute 'grant execute on function public.get_or_create_onboard_token(text) to service_role';
  execute 'grant execute on function public.invite_roster() to service_role';

  select
    count(*)::bigint,
    count(distinct venue_slug)::bigint,
    md5(coalesce(string_agg(token, '' order by venue_slug, token), ''))
  into
    v_after_token_count,
    v_after_venue_count,
    v_after_token_digest
  from public.venue_onboard_tokens;

  if v_after_token_count <> v_before_token_count
     or v_after_venue_count <> v_before_venue_count then
    raise exception 'Lockdown verification failed: token/venue counts changed';
  end if;

  if v_after_token_digest = v_before_token_digest then
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
$lockdown$;
