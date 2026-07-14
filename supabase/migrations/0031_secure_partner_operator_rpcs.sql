-- Forward-only repair for legacy onboarding RPC privileges.
-- 0011/0016 may already be applied, so this migration intentionally replaces
-- only the operator functions and their ACLs without editing history.

begin;

-- The legacy roster was anon-enumerable, so every existing credential is
-- treated as compromised. Rotate all links under an exclusive lock, collapse
-- accidental duplicates to one credential per venue, and make the stronger
-- invariant permanent. venue_confirmations and legacy consent evidence are
-- keyed by venue_slug, so their audit history survives credential rotation.
lock table public.venue_onboard_tokens in access exclusive mode;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.venue_onboard_tokens'::regclass
      and conname = 'venue_onboard_tokens_strong_token_check'
  ) then
    delete from public.venue_onboard_tokens current_token
    using (
      select token
      from (
        select
          token,
          row_number() over (
            partition by venue_slug
            order by created_at, token
          ) as token_rank
        from public.venue_onboard_tokens
      ) ranked_tokens
      where token_rank > 1
    ) duplicate_token
    where current_token.token = duplicate_token.token;

    update public.venue_onboard_tokens
    set token = replace(gen_random_uuid()::text, '-', '')
      || replace(gen_random_uuid()::text, '-', ''),
        created_at = clock_timestamp();

    alter table public.venue_onboard_tokens
      add constraint venue_onboard_tokens_strong_token_check
      check (token ~ '^[0-9a-f]{64}$');
  end if;
end;
$$;

create unique index if not exists venue_onboard_tokens_one_per_venue_idx
  on public.venue_onboard_tokens(venue_slug);

comment on constraint venue_onboard_tokens_strong_token_check
  on public.venue_onboard_tokens is
  'All pre-0031 onboarding links were forcibly invalidated after public roster exposure; operators must resend the rotated link.';

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
    -- Two independent UUIDs provide a 256-bit unguessable credential without
    -- relying on the extension schema used by a particular Supabase project.
    v_token := replace(gen_random_uuid()::text, '-', '')
      || replace(gen_random_uuid()::text, '-', '');
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

  -- Serialize roster generation so two operator requests cannot mint parallel
  -- credentials for the same venue.
  perform pg_advisory_xact_lock(hashtextextended('invite-roster', 0));

  insert into public.venue_onboard_tokens(token, venue_slug)
  select
    replace(gen_random_uuid()::text, '-', '')
      || replace(gen_random_uuid()::text, '-', ''),
    v.slug
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

-- RLS remains the data boundary; these explicit ACLs prevent direct token or
-- confirmation-table access even if project default privileges change later.
revoke all on table public.venue_onboard_tokens from public, anon, authenticated;
revoke all on table public.venue_confirmations from public, anon, authenticated;
revoke all on table public.venue_onboard_tokens from service_role;
revoke all on table public.venue_confirmations from service_role;
grant select, insert on table public.venue_onboard_tokens to service_role;
grant select on table public.venue_confirmations to service_role;

revoke all on function public.get_or_create_onboard_token(text)
  from public, anon, authenticated;
revoke all on function public.invite_roster()
  from public, anon, authenticated;
grant execute on function public.get_or_create_onboard_token(text) to service_role;
grant execute on function public.invite_roster() to service_role;

-- Repair the original fail-open planning policies. Anonymous clients may see
-- only explicitly active, published venues and their eligible public children.
drop policy if exists "public read venues" on public.venues;
drop policy if exists "public read active published venues" on public.venues;
create policy "public read active published venues"
on public.venues for select to anon, authenticated
using (status = 'active' and publication_status = 'published');

drop policy if exists "public read perks" on public.perks;
drop policy if exists "public read eligible perks" on public.perks;

-- Offers are versioned consent-bearing facts, not a legacy active boolean.
-- Existing rows intentionally remain drafts until the venue approves the
-- exact title/terms and an operator verifies a bounded freshness window.
alter table public.perks add column if not exists publication_status text
  not null default 'draft';
alter table public.perks add column if not exists verified_at timestamptz;
alter table public.perks add column if not exists expires_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.perks'::regclass
      and conname = 'perks_publication_status_check'
  ) then
    alter table public.perks add constraint perks_publication_status_check
      check (publication_status in ('draft','confirmed','disabled'));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.perks'::regclass
      and conname = 'perks_confirmed_evidence_check'
  ) then
    alter table public.perks add constraint perks_confirmed_evidence_check
      check (
        publication_status <> 'confirmed'
        or (verified_at is not null and expires_at is not null and expires_at > verified_at)
      );
  end if;
end;
$$;

create table if not exists public.perk_offer_confirmations (
  id uuid primary key default gen_random_uuid(),
  perk_id text not null references public.perks(id) on delete cascade,
  venue_slug text not null references public.venues(slug) on delete cascade,
  perk_title text not null,
  perk_terms text,
  confirmed_by text not null check (length(btrim(confirmed_by)) between 2 and 120),
  agreed boolean not null check (agreed),
  user_agent text check (user_agent is null or length(user_agent) <= 300),
  ts timestamptz not null default now()
);
create index if not exists perk_offer_confirmations_perk_ts_idx
  on public.perk_offer_confirmations(perk_id, ts desc);
alter table public.perk_offer_confirmations enable row level security;
revoke all on table public.perk_offer_confirmations from public, anon, authenticated;
revoke all on table public.perk_offer_confirmations from service_role;
grant select, insert on table public.perk_offer_confirmations to service_role;

create or replace function public.prevent_consent_evidence_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  raise exception 'consent evidence is append-only';
end;
$$;

drop trigger if exists venue_confirmations_append_only_trigger
  on public.venue_confirmations;
create trigger venue_confirmations_append_only_trigger
before update or delete on public.venue_confirmations
for each row execute function public.prevent_consent_evidence_mutation();

drop trigger if exists perk_offer_confirmations_append_only_trigger
  on public.perk_offer_confirmations;
create trigger perk_offer_confirmations_append_only_trigger
before update or delete on public.perk_offer_confirmations
for each row execute function public.prevent_consent_evidence_mutation();

create policy "public read eligible perks"
on public.perks for select to anon, authenticated
using (
  active
  and publication_status = 'confirmed'
  and verified_at is not null
  and expires_at > now()
  and exists (
    select 1 from public.perk_offer_confirmations confirmation
    where confirmation.perk_id = perks.id
      and confirmation.venue_slug = perks.venue_slug
      and confirmation.agreed
      and confirmation.perk_title = perks.title
      and coalesce(confirmation.perk_terms, '') = coalesce(perks.terms, '')
      and confirmation.ts >= perks.verified_at
  )
  and exists (
    select 1
    from public.venues v
    join public.districts d on d.slug = v.district
    where v.slug = venue_slug
      and v.status = 'active'
      and v.publication_status = 'published'
      and d.status = 'active_deep'
      and d.monetization_enabled
  )
);

drop policy if exists "public read plan_entries" on public.plan_entries;
drop policy if exists "public read published plan entries" on public.plan_entries;
create policy "public read published plan entries"
on public.plan_entries for select to anon, authenticated
using (
  exists (
    select 1 from public.venues v
    where v.slug = venue_slug
      and v.status = 'active'
      and v.publication_status = 'published'
  )
);

-- Runtime-required public taxonomy field, absent from the historical chain.
alter table public.venues
  add column if not exists wellness_categories text[] not null default '{}';

revoke all on table public.venues from anon, authenticated;
grant select (
  id, slug, name, category, district, address, gmaps_url, tier,
  is_sponsored, status, vibe_tags, price_anchor, what_to_order, photo_url,
  area, why_its_here, best_for, not_for,
  practical_tags, jobs, owner_note, publication_status, wellness_categories
) on public.venues to anon, authenticated;

-- Anonymous identifiers are server-issued fixed-length random values. The
-- NOT VALID form preserves legacy rows while enforcing the shape for all new
-- inserts and updates.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.guest_refs'::regclass
      and conname = 'guest_refs_issued_shape_check'
  ) then
    alter table public.guest_refs add constraint guest_refs_issued_shape_check
      check (ref ~ '^g_[A-Za-z0-9_-]{16}$') not valid;
  end if;
end;
$$;

-- Attribution proof accepts only operator-issued source IDs. An arbitrary
-- query string can no longer manufacture an externally attributed visit.
create table if not exists public.attribution_sources (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9_-]{0,63}$'),
  label text not null check (length(btrim(label)) between 1 and 160),
  source_class text not null check (source_class in ('external','creator','in_venue')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.attribution_sources enable row level security;
revoke all on table public.attribution_sources from public, anon, authenticated;
grant select, insert, update on table public.attribution_sources to service_role;

drop function if exists public.set_guest_source(text,text);
create function public.set_guest_source(p_guest_ref text, p_source text)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_existing text;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
    or p_source !~ '^[a-z0-9][a-z0-9_-]{0,63}$'
    or not exists (
      select 1 from public.attribution_sources s
      where s.id = p_source and s.active
    ) then
    return false;
  end if;

  select id, source into v_id, v_existing
  from public.guest_refs where ref = p_guest_ref;
  if v_id is null then
    insert into public.guest_refs(ref, first_district, source)
    values (p_guest_ref, 'canggu', p_source);
  elsif v_existing is null then
    update public.guest_refs set source = p_source where id = v_id;
  end if;
  return true;
end;
$$;

create or replace function public.log_event(
  p_type text,
  p_guest_ref text,
  p_venue_slug text,
  p_source text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_type not in (
    'source_scan','landing_open','venue_card_open','perk_open',
    'direction_click','reservation_click','similar_open','district_open',
    'district_page_view','editorial_page_view','venue_detail_view',
    'venue_card_click','booking_click','official_website_click',
    'instagram_click','menu_click','partner_offer_click',
    'guide_form_started','guide_form_submitted','whatsapp_guide_click',
    'internal_guide_click','menu_open','menu_item_open','action_handoff',
    'delivery_click','takeaway_click','preorder_click'
  )
    or (p_guest_ref is not null and p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$')
    or (p_venue_slug is not null and (
      length(p_venue_slug) > 120
      or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$'
    )) then
    return;
  end if;
  if p_source is not null and not exists (
    select 1 from public.attribution_sources s
    where s.id = p_source and s.active
  ) then
    return;
  end if;
  if p_type = 'source_scan' and p_source is null then return; end if;

  select id into v_id from public.guest_refs where ref = p_guest_ref;
  if exists (
    select 1 from public.events e
    where e.type = p_type
      and e.guest_ref_id is not distinct from v_id
      and e.venue_slug is not distinct from p_venue_slug
      and e.source is not distinct from p_source
      and e.ts > clock_timestamp() - interval '5 seconds'
  ) then return; end if;

  insert into public.events(type, guest_ref_id, venue_slug, source)
  values (p_type, v_id, p_venue_slug, p_source);
end;
$$;

create index if not exists redemption_guest_venue_ts_idx
  on public.redemption_events(guest_ref_id, venue_slug, ts desc);

create or replace function public.record_redemption(
  p_guest_ref text,
  p_venue_slug text,
  p_consent_granted boolean,
  p_user_agent text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_guest_id uuid;
  v_venue public.venues%rowtype;
  v_perk_id text;
  v_perk_title text;
  v_code text;
  v_ts timestamptz := clock_timestamp();
  v_source text;
  v_class text := 'in_venue';
  v_external boolean := false;
  v_existing_ts timestamptz;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
    or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
    return jsonb_build_object('ok', false, 'error', 'bad_request');
  end if;
  if not coalesce(p_consent_granted, false) then
    return jsonb_build_object('ok', false, 'error', 'consent_required');
  end if;

  select * into v_venue
  from public.venues
  where slug = p_venue_slug
    and status = 'active'
    and publication_status = 'published';
  if not found then
    return jsonb_build_object('ok', false, 'error', 'venue_not_found');
  end if;
  if not exists (
    select 1 from public.districts d
    where d.slug = v_venue.district and d.qr_enabled
  ) then
    return jsonb_build_object('ok', false, 'error', 'qr_disabled_for_district');
  end if;

  select p.id, p.title into v_perk_id, v_perk_title
  from public.perks p
  where p.venue_slug = p_venue_slug
    and p.active
    and p.publication_status = 'confirmed'
    and p.verified_at is not null
    and p.expires_at > v_ts
    and exists (
      select 1 from public.perk_offer_confirmations confirmation
      where confirmation.perk_id = p.id
        and confirmation.venue_slug = p.venue_slug
        and confirmation.agreed
        and confirmation.perk_title = p.title
        and coalesce(confirmation.perk_terms, '') = coalesce(p.terms, '')
        and confirmation.ts >= p.verified_at
    )
  order by p.verified_at desc
  limit 1;
  if v_perk_id is null then
    return jsonb_build_object('ok', false, 'error', 'no_confirmed_perk');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('redemption:' || p_guest_ref || ':' || p_venue_slug, 0)
  );
  select id, source into v_guest_id, v_source
  from public.guest_refs where ref = p_guest_ref;
  if v_guest_id is null then
    insert into public.guest_refs(ref, first_district)
    values (p_guest_ref, v_venue.district)
    returning id into v_guest_id;
  end if;

  if v_source is not null then
    select s.source_class into v_class
    from public.attribution_sources s
    where s.id = v_source and s.active;
    v_class := coalesce(v_class, 'in_venue');
  end if;
  v_external := v_class = 'external';

  select confirm_code, ts into v_code, v_existing_ts
  from public.redemption_events
  where guest_ref_id = v_guest_id
    and venue_slug = p_venue_slug
    and ts > v_ts - interval '20 hours'
  order by ts desc
  limit 1;
  if v_code is not null then
    return jsonb_build_object(
      'ok', true, 'confirm_code', v_code, 'venue_name', v_venue.name,
      'perk_title', v_perk_title, 'ts', v_existing_ts,
      'externally_attributed', v_external, 'deduplicated', true
    );
  end if;

  insert into public.consent_log(
    guest_ref_id, consent_type, granted, user_agent
  ) values (
    v_guest_id, 'redemption_tracking_v1', true,
    left(coalesce(p_user_agent, ''), 300)
  );
  v_code := lpad((floor(random() * 1000000))::int::text, 6, '0');
  insert into public.redemption_events(
    guest_ref_id, venue_slug, perk_id, confirm_code, source,
    source_class, ts, externally_attributed
  ) values (
    v_guest_id, p_venue_slug, v_perk_id, v_code,
    case when v_class = 'in_venue' then 'in_venue' else v_source end,
    v_class, v_ts, v_external
  );
  insert into public.events(type, guest_ref_id, venue_slug, source)
  values ('redemption', v_guest_id, p_venue_slug, v_source);

  return jsonb_build_object(
    'ok', true, 'confirm_code', v_code, 'venue_name', v_venue.name,
    'perk_title', v_perk_title, 'ts', v_ts,
    'externally_attributed', v_external, 'deduplicated', false
  );
end;
$$;

create or replace function public.confirm_onboarding(
  p_token text,
  p_name text,
  p_agreed boolean,
  p_user_agent text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_slug text;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  select venue_slug into v_slug
  from public.venue_onboard_tokens where token = p_token;
  if v_slug is null then
    return jsonb_build_object('ok', false, 'error', 'bad_token');
  end if;
  if not coalesce(p_agreed, false) or length(btrim(coalesce(p_name, ''))) < 2 then
    return jsonb_build_object('ok', false, 'error', 'agreement_required');
  end if;
  insert into public.venue_confirmations(
    venue_slug, confirmed_by, agreed, user_agent
  ) values (
    v_slug, left(btrim(p_name), 120), true,
    left(coalesce(p_user_agent, ''), 300)
  );
  -- Listing consent is audit evidence only. Publication/status remain an
  -- independent operator decision and are never changed by a partner token.
  return jsonb_build_object('ok', true, 'venue_slug', v_slug);
end;
$$;

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
  v_id uuid;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
    or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or p_verdict not in ('worth_it','meh') then return; end if;
  select id into v_id from public.guest_refs where ref = p_guest_ref;
  if v_id is null or not exists (
    select 1 from public.redemption_events r
    where r.guest_ref_id = v_id and r.venue_slug = p_venue_slug
  ) then return; end if;
  insert into public.events(type, guest_ref_id, venue_slug, meta)
  values (
    'dish_feedback', v_id, p_venue_slug,
    jsonb_build_object('dish', left(coalesce(p_dish, ''), 120), 'verdict', p_verdict)
  );
end;
$$;

revoke all on function public.set_guest_source(text,text)
  from public, anon, authenticated;
revoke all on function public.log_event(text,text,text,text)
  from public, anon, authenticated;
revoke all on function public.record_redemption(text,text,boolean,text)
  from public, anon, authenticated;
revoke all on function public.confirm_onboarding(text,text,boolean,text)
  from public, anon, authenticated;
revoke all on function public.log_dish_feedback(text,text,text,text)
  from public, anon, authenticated;
revoke all on function public.my_redemptions(text)
  from public, anon, authenticated;
revoke all on function public.phase0_overview()
  from public, anon, authenticated;
revoke all on function public.onboard_status()
  from public, anon, authenticated;
revoke all on function public.toggle_saved_place(text,text)
  from public, anon, authenticated;
revoke all on function public.saved_places_for(text)
  from public, anon, authenticated;
revoke all on function public.create_shared_list(text,text[])
  from public, anon, authenticated;

grant execute on function public.set_guest_source(text,text) to service_role;
grant execute on function public.log_event(text,text,text,text) to service_role;
grant execute on function public.record_redemption(text,text,boolean,text) to service_role;
grant execute on function public.confirm_onboarding(text,text,boolean,text) to service_role;
grant execute on function public.log_dish_feedback(text,text,text,text) to service_role;
grant execute on function public.my_redemptions(text) to service_role;
grant execute on function public.phase0_overview() to service_role;
grant execute on function public.onboard_status() to service_role;
grant execute on function public.toggle_saved_place(text,text) to service_role;
grant execute on function public.saved_places_for(text) to service_role;
grant execute on function public.create_shared_list(text,text[]) to service_role;

-- Partner analytics are commercially sensitive. Until partner-scoped auth is
-- implemented, they are operator-only and run through the server service role.
revoke all on function public.partner_report(text) from public, anon, authenticated;
revoke all on function public.partner_notes(text) from public, anon, authenticated;
revoke all on function public.venue_redemption_count(text) from public, anon, authenticated;
grant execute on function public.partner_report(text) to service_role;
grant execute on function public.partner_notes(text) to service_role;
grant execute on function public.venue_redemption_count(text) to service_role;

-- A venue token may update only the owner's clearly attributed words. Other
-- fit/editorial fields remain Other Bali operator-owned.
create or replace function public.set_venue_jtbd(
  p_token text,
  p_best_for text,
  p_not_for text,
  p_jobs text[],
  p_practical_tags text[],
  p_owner_note text default null
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_slug text;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  select venue_slug into v_slug
  from public.venue_onboard_tokens
  where token = p_token;
  if v_slug is null then
    return jsonb_build_object('ok', false, 'error', 'bad_token');
  end if;

  update public.venues
  set owner_note = nullif(left(btrim(coalesce(p_owner_note, '')), 2000), '')
  where slug = v_slug;
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.set_venue_jtbd(text,text,text,text[],text[],text)
  from public, anon, authenticated;
grant execute on function public.set_venue_jtbd(text,text,text,text[],text[],text)
  to service_role;

commit;
