-- Controlled write gateway for G1. The identity/consent/proof tables are
-- service-role-only (default deny under RLS). Instead of shipping the
-- service_role secret to the app, we expose two SECURITY DEFINER functions to
-- the anon role — the only sanctioned way to touch those tables. This keeps the
-- secret out of the app/Vercel entirely.

-- Records a redemption: resolves/creates the anonymous guest, logs consent on
-- first contact, enforces consent, writes the proof event, returns the
-- staff-facing confirmation. Returns jsonb { ok, ... }.
create or replace function public.record_redemption(
  p_guest_ref text,
  p_venue_slug text,
  p_consent_granted boolean,
  p_user_agent text
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_venue venues%rowtype;
  v_perk_id text;
  v_perk_title text;
  v_code text;
  v_ts timestamptz := now();
begin
  if p_guest_ref is null or length(p_guest_ref) < 4 then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;

  select * into v_venue from venues where slug = p_venue_slug and status = 'active';
  if not found then
    return jsonb_build_object('ok', false, 'error', 'venue_not_found');
  end if;

  select id into v_guest_id from guest_refs where ref = p_guest_ref;
  if v_guest_id is null then
    insert into guest_refs(ref, first_district) values (p_guest_ref, v_venue.district)
      returning id into v_guest_id;
    insert into consent_log(guest_ref_id, consent_type, granted, user_agent)
      values (v_guest_id, 'redemption_tracking_v1', coalesce(p_consent_granted, false), left(p_user_agent, 300));
  end if;

  if not coalesce(p_consent_granted, false) then
    return jsonb_build_object('ok', false, 'error', 'consent_required');
  end if;

  select id, title into v_perk_id, v_perk_title
    from perks where venue_slug = p_venue_slug and active = true limit 1;

  v_code := lpad((floor(random() * 1000000))::int::text, 6, '0');

  insert into redemption_events(guest_ref_id, venue_slug, perk_id, confirm_code, source, ts)
    values (v_guest_id, p_venue_slug, v_perk_id, v_code, 'venue_qr', v_ts);

  return jsonb_build_object(
    'ok', true,
    'confirm_code', v_code,
    'venue_name', v_venue.name,
    'perk_title', coalesce(v_perk_title, 'Perk'),
    'ts', v_ts
  );
end;
$$;

-- Aggregate-only partner read (privacy): returns a count, never rows.
create or replace function public.venue_redemption_count(p_venue_slug text)
returns integer
language sql
security definer
set search_path = public, pg_temp
as $$
  select count(*)::int from redemption_events where venue_slug = p_venue_slug;
$$;

revoke all on function public.record_redemption(text, text, boolean, text) from public;
revoke all on function public.venue_redemption_count(text) from public;
grant execute on function public.record_redemption(text, text, boolean, text) to anon, authenticated;
grant execute on function public.venue_redemption_count(text) to anon, authenticated;
