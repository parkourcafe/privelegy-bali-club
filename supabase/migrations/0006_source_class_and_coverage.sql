-- Phase 1A reconciliation gaps #8 and #4 (master v0.2-final).
--  #4: coverage policy as data constraints — district status + monetization/qr
--      flags so a non-active district (Ubud=next_deep) is technically
--      un-monetizable. Redemption is blocked at the write path when qr disabled.
--  #8: source_class — creator-perk redemptions are a SEPARATE bucket, excluded
--      from partner-proof (not "we brought them", not in-venue either).

-- ---------- #4 Coverage policy (first, so functions can reference the flags) ----------
alter table districts add column if not exists status text not null default 'planning_only';
alter table districts add column if not exists monetization_enabled boolean not null default false;
alter table districts add column if not exists qr_enabled boolean not null default false;
update districts set status = 'active_deep', monetization_enabled = true, qr_enabled = true where slug = 'canggu';
insert into districts (slug, name, is_deep, status, monetization_enabled, qr_enabled)
values ('ubud', 'Ubud', false, 'next_deep', false, false)
on conflict (slug) do nothing;

-- ---------- #8 Source class ----------
create or replace function public._source_class(p_source text)
returns text language sql immutable as $$
  select case
    when p_source is null or p_source = '' or p_source = 'in_venue' or p_source like 'venue%' then 'in_venue'
    when p_source like 'creator%' then 'creator'
    else 'external'
  end;
$$;

alter table redemption_events add column if not exists source_class text;
update redemption_events set source_class = public._source_class(source) where source_class is null;

-- record_redemption: enforce coverage (#4) + set source_class (#8).
create or replace function public.record_redemption(
  p_guest_ref text, p_venue_slug text, p_consent_granted boolean, p_user_agent text
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_guest_id uuid; v_venue venues%rowtype; v_perk_id text; v_perk_title text;
  v_code text; v_ts timestamptz := now(); v_source text; v_class text; v_external boolean;
  v_qr_enabled boolean;
begin
  if p_guest_ref is null or length(p_guest_ref) < 4 then
    return jsonb_build_object('ok', false, 'error', 'bad_request'); end if;
  select * into v_venue from venues where slug = p_venue_slug and status = 'active';
  if not found then return jsonb_build_object('ok', false, 'error', 'venue_not_found'); end if;

  -- Coverage policy (#4): no QR redemption outside a qr-enabled district.
  select qr_enabled into v_qr_enabled from districts where slug = v_venue.district;
  if not coalesce(v_qr_enabled, false) then
    return jsonb_build_object('ok', false, 'error', 'qr_disabled_for_district'); end if;

  select id, source into v_guest_id, v_source from guest_refs where ref = p_guest_ref;
  if v_guest_id is null then
    insert into guest_refs(ref, first_district) values (p_guest_ref, v_venue.district) returning id into v_guest_id;
    insert into consent_log(guest_ref_id, consent_type, granted, user_agent)
      values (v_guest_id, 'redemption_tracking_v1', coalesce(p_consent_granted,false), left(p_user_agent,300));
  end if;
  if not coalesce(p_consent_granted, false) then
    return jsonb_build_object('ok', false, 'error', 'consent_required'); end if;

  v_class := public._source_class(v_source);
  v_external := (v_class = 'external');
  select id, title into v_perk_id, v_perk_title from perks where venue_slug = p_venue_slug and active = true limit 1;
  v_code := lpad((floor(random()*1000000))::int::text, 6, '0');
  insert into redemption_events(guest_ref_id, venue_slug, perk_id, confirm_code, source, source_class, ts, externally_attributed)
    values (v_guest_id, p_venue_slug, v_perk_id, v_code, coalesce(v_source,'in_venue'), v_class, v_ts, v_external);
  insert into events(type, guest_ref_id, venue_slug, source) values ('redemption', v_guest_id, p_venue_slug, v_source);
  return jsonb_build_object('ok', true, 'confirm_code', v_code, 'venue_name', v_venue.name,
    'perk_title', coalesce(v_perk_title,'Perk'), 'ts', v_ts, 'externally_attributed', v_external);
end; $$;

create or replace function public.partner_report(p_venue_slug text)
returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'venue_card_opens', (select count(*) from events where venue_slug = p_venue_slug and type = 'venue_card_open'),
    'perk_opens',       (select count(*) from events where venue_slug = p_venue_slug and type = 'perk_open'),
    'redemptions',      (select count(*) from redemption_events where venue_slug = p_venue_slug),
    'externally_attributed', (select count(*) from redemption_events where venue_slug = p_venue_slug and source_class = 'external'),
    'in_venue',         (select count(*) from redemption_events where venue_slug = p_venue_slug and source_class = 'in_venue'),
    'creator',          (select count(*) from redemption_events where venue_slug = p_venue_slug and source_class = 'creator')
  );
$$;

create or replace function public.phase0_overview()
returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'funnel', jsonb_build_object(
      'source_scan',     (select count(*) from events where type = 'source_scan'),
      'landing_open',    (select count(*) from events where type = 'landing_open'),
      'venue_card_open', (select count(*) from events where type = 'venue_card_open'),
      'perk_open',       (select count(*) from events where type = 'perk_open'),
      'redemption',      (select count(*) from redemption_events)
    ),
    'venues', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'slug', v.slug, 'name', v.name,
        'perk_opens',            (select count(*) from events e where e.venue_slug = v.slug and e.type = 'perk_open'),
        'redemptions',           (select count(*) from redemption_events r where r.venue_slug = v.slug),
        'externally_attributed', (select count(*) from redemption_events r where r.venue_slug = v.slug and r.source_class = 'external'),
        'in_venue',              (select count(*) from redemption_events r where r.venue_slug = v.slug and r.source_class = 'in_venue'),
        'creator',               (select count(*) from redemption_events r where r.venue_slug = v.slug and r.source_class = 'creator')
      ) order by v.name), '[]'::jsonb)
      from venues v where v.district = 'canggu' and v.status = 'active'
    )
  );
$$;

grant execute on function public.record_redemption(text,text,boolean,text) to anon, authenticated;
grant execute on function public.partner_report(text) to anon, authenticated;
grant execute on function public.phase0_overview() to anon, authenticated;
