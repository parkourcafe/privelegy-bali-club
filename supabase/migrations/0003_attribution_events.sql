-- Phase 0 core: source attribution (§22), event funnel (§18), partner report (§11).
--
-- The treacherous seam from the master doc: a redemption QR on the counter only
-- proves "people like free stuff". To prove WE brought the guest, the guest must
-- have touched an external SOURCE (villa/coliving/Reels) BEFORE the venue. We
-- capture that source on first touch and mark redemptions as externally
-- attributed vs in-venue.
--
-- Backward compatible: record_redemption keeps its 4-arg signature, so the
-- currently-deployed app keeps working whether or not this migration is applied
-- yet. Source is attached to the guest via a separate set_guest_source call.

alter table guest_refs add column if not exists source text;
alter table redemption_events add column if not exists externally_attributed boolean not null default false;

create table if not exists events (
  id            uuid primary key default gen_random_uuid(),
  type          text not null,   -- source_scan | landing_open | venue_card_open | perk_open | redemption
  guest_ref_id  uuid references guest_refs(id) on delete set null,
  venue_slug    text,
  source        text,
  ts            timestamptz not null default now()
);
create index if not exists events_type_ts_idx on events(type, ts);
create index if not exists events_venue_idx on events(venue_slug);
alter table events enable row level security; -- default deny; written only via SECURITY DEFINER RPCs

-- Classify a source tag: external (villa/coliving/reels/flyer) vs in-venue/none.
create or replace function public._is_external_source(p_source text)
returns boolean language sql immutable as $$
  select p_source is not null and p_source <> '' and p_source not like 'venue%' and p_source <> 'in_venue';
$$;

-- First-touch source capture (idempotent; first source wins).
create or replace function public.set_guest_source(p_guest_ref text, p_source text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare v_id uuid; v_existing text;
begin
  if p_guest_ref is null or length(p_guest_ref) < 4 then return; end if;
  select id, source into v_id, v_existing from guest_refs where ref = p_guest_ref;
  if v_id is null then
    insert into guest_refs(ref, first_district, source) values (p_guest_ref, 'canggu', p_source);
  elsif p_source is not null and v_existing is null then
    update guest_refs set source = p_source where id = v_id;
  end if;
end; $$;

-- Lightweight funnel logger.
create or replace function public.log_event(p_type text, p_guest_ref text, p_venue_slug text, p_source text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare v_id uuid;
begin
  if p_type is null then return; end if;
  select id into v_id from guest_refs where ref = p_guest_ref;
  insert into events(type, guest_ref_id, venue_slug, source) values (p_type, v_id, p_venue_slug, p_source);
end; $$;

-- Redemption (same 4-arg signature) — now reads guest source, sets attribution,
-- and logs a redemption event.
create or replace function public.record_redemption(
  p_guest_ref text, p_venue_slug text, p_consent_granted boolean, p_user_agent text
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_guest_id uuid; v_venue venues%rowtype; v_perk_id text; v_perk_title text;
  v_code text; v_ts timestamptz := now(); v_source text; v_external boolean;
begin
  if p_guest_ref is null or length(p_guest_ref) < 4 then
    return jsonb_build_object('ok', false, 'error', 'bad_request'); end if;

  select * into v_venue from venues where slug = p_venue_slug and status = 'active';
  if not found then return jsonb_build_object('ok', false, 'error', 'venue_not_found'); end if;

  select id, source into v_guest_id, v_source from guest_refs where ref = p_guest_ref;
  if v_guest_id is null then
    insert into guest_refs(ref, first_district) values (p_guest_ref, v_venue.district) returning id into v_guest_id;
    insert into consent_log(guest_ref_id, consent_type, granted, user_agent)
      values (v_guest_id, 'redemption_tracking_v1', coalesce(p_consent_granted,false), left(p_user_agent,300));
  end if;

  if not coalesce(p_consent_granted, false) then
    return jsonb_build_object('ok', false, 'error', 'consent_required'); end if;

  v_external := public._is_external_source(v_source);
  select id, title into v_perk_id, v_perk_title from perks where venue_slug = p_venue_slug and active = true limit 1;
  v_code := lpad((floor(random()*1000000))::int::text, 6, '0');

  insert into redemption_events(guest_ref_id, venue_slug, perk_id, confirm_code, source, ts, externally_attributed)
    values (v_guest_id, p_venue_slug, v_perk_id, v_code, coalesce(v_source,'in_venue'), v_ts, v_external);
  insert into events(type, guest_ref_id, venue_slug, source) values ('redemption', v_guest_id, p_venue_slug, v_source);

  return jsonb_build_object('ok', true, 'confirm_code', v_code, 'venue_name', v_venue.name,
    'perk_title', coalesce(v_perk_title,'Perk'), 'ts', v_ts, 'externally_attributed', v_external);
end; $$;

-- Partner mini-report: Reach / Intent / Proof, aggregate-only, attribution split.
create or replace function public.partner_report(p_venue_slug text)
returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'venue_card_opens', (select count(*) from events where venue_slug = p_venue_slug and type = 'venue_card_open'),
    'perk_opens',       (select count(*) from events where venue_slug = p_venue_slug and type = 'perk_open'),
    'redemptions',      (select count(*) from redemption_events where venue_slug = p_venue_slug),
    'externally_attributed', (select count(*) from redemption_events where venue_slug = p_venue_slug and externally_attributed),
    'in_venue',         (select count(*) from redemption_events where venue_slug = p_venue_slug and not externally_attributed)
  );
$$;

revoke all on function public.set_guest_source(text,text) from public;
revoke all on function public.log_event(text,text,text,text) from public;
revoke all on function public.partner_report(text) from public;
grant execute on function public.set_guest_source(text,text) to anon, authenticated;
grant execute on function public.log_event(text,text,text,text) to anon, authenticated;
grant execute on function public.partner_report(text) to anon, authenticated;
grant execute on function public.record_redemption(text,text,boolean,text) to anon, authenticated;
