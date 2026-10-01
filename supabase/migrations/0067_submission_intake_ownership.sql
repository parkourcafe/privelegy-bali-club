-- Public intake must not treat a venue name and district as authorization to
-- change an existing applicant's contacts, note, or media capability.
-- A duplicate is acknowledged without returning the existing row's ID. The
-- versioned RPC makes a web deploy fail closed until this migration is applied;
-- replacing the old RPC first also protects the old deployed web during rollout.
-- Apply only after the production migration ledger has been reconciled.

begin;

create or replace function public.submit_venue_application(
  p_name text,
  p_category text default null,
  p_district text default null,
  p_whatsapp text default null,
  p_email text default null,
  p_instagram_url text default null,
  p_website_url text default null,
  p_note text default null,
  p_consent boolean default false,
  p_source text default null,
  p_utm jsonb default null,
  p_user_agent text default null
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_name  text := nullif(left(btrim(coalesce(p_name, '')), 160), '');
  v_cat   text := nullif(left(btrim(lower(coalesce(p_category, ''))), 40), '');
  v_dist  text := nullif(left(btrim(lower(coalesce(p_district, ''))), 60), '');
  v_wa    text := nullif(regexp_replace(coalesce(p_whatsapp, ''), '[^0-9]', '', 'g'), '');
  v_email text := nullif(left(btrim(lower(coalesce(p_email, ''))), 200), '');
  v_ig    text := nullif(left(btrim(coalesce(p_instagram_url, '')), 300), '');
  v_web   text := nullif(left(btrim(coalesce(p_website_url, '')), 300), '');
  v_note  text := nullif(left(btrim(coalesce(p_note, '')), 1000), '');
  v_id    uuid;
  v_status text;
  v_ref   text;
begin
  if not coalesce(p_consent, false) then
    return jsonb_build_object('ok', false, 'error', 'consent_required');
  end if;
  if v_name is null then
    return jsonb_build_object('ok', false, 'error', 'name_required');
  end if;
  if v_wa is null and v_email is null and v_ig is null and v_web is null then
    return jsonb_build_object('ok', false, 'error', 'contact_required');
  end if;
  if v_wa is not null and (length(v_wa) < 7 or length(v_wa) > 16) then
    return jsonb_build_object('ok', false, 'error', 'bad_whatsapp');
  end if;
  if v_email is not null and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return jsonb_build_object('ok', false, 'error', 'bad_email');
  end if;

  insert into public.venue_submissions (
    name, category, district, whatsapp, email, instagram_url, website_url,
    note, consent_granted, source, utm, user_agent
  ) values (
    v_name, v_cat, v_dist, v_wa, v_email, v_ig, v_web,
    v_note, true,
    nullif(left(btrim(coalesce(p_source, '')), 80), ''),
    p_utm,
    nullif(left(coalesce(p_user_agent, ''), 400), '')
  )
  on conflict (lower(btrim(name)), coalesce(lower(btrim(district)), '')) do nothing
  returning id, status into v_id, v_status;

  if v_id is null then
    return jsonb_build_object('ok', true, 'duplicate', true);
  end if;

  v_ref := 'OB-' || upper(substr(replace(v_id::text, '-', ''), 1, 6));
  return jsonb_build_object(
    'ok', true,
    'duplicate', false,
    'id', v_id,
    'reference', v_ref,
    'status', v_status
  );
end; $$;

create or replace function public.submit_venue_application_v2(
  p_name text,
  p_category text default null,
  p_district text default null,
  p_whatsapp text default null,
  p_email text default null,
  p_instagram_url text default null,
  p_website_url text default null,
  p_note text default null,
  p_consent boolean default false,
  p_source text default null,
  p_utm jsonb default null,
  p_user_agent text default null
) returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select public.submit_venue_application(
    p_name, p_category, p_district, p_whatsapp, p_email, p_instagram_url,
    p_website_url, p_note, p_consent, p_source, p_utm, p_user_agent
  );
$$;

revoke all on function public.submit_venue_application(text,text,text,text,text,text,text,text,boolean,text,jsonb,text) from public;
grant execute on function public.submit_venue_application(text,text,text,text,text,text,text,text,boolean,text,jsonb,text) to anon, authenticated;
revoke all on function public.submit_venue_application_v2(text,text,text,text,text,text,text,text,boolean,text,jsonb,text) from public;
grant execute on function public.submit_venue_application_v2(text,text,text,text,text,text,text,text,boolean,text,jsonb,text) to anon, authenticated;

commit;
