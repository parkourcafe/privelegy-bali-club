-- Other Bali structured menus and verified external action handoffs.
-- Additive only. Public reads fail closed on publication, evidence and freshness.

alter table public.events add column if not exists payload jsonb;

create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 160),
  version integer not null check (version > 0),
  status text not null default 'draft' check (status in ('draft','review','published','archived')),
  source_url text not null check (source_url ~ '^https://'),
  source_label text not null check (length(btrim(source_label)) between 1 and 160),
  captured_at timestamptz not null,
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_slug, version),
  check (expires_at is null or expires_at > captured_at),
  check (status <> 'published' or verified_at is not null)
);

create unique index if not exists menus_one_published_per_venue_idx
  on public.menus(venue_slug) where status = 'published';
create index if not exists menus_public_lookup_idx
  on public.menus(venue_slug, status, version desc, expires_at);

create table if not exists public.menu_sections (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 160),
  description text check (description is null or length(description) <= 1000),
  position integer not null default 0 check (position >= 0),
  unique (menu_id, position)
);
create unique index if not exists menu_sections_id_menu_idx on public.menu_sections(id, menu_id);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  section_id uuid not null,
  name text not null check (length(btrim(name)) between 1 and 200),
  description text check (description is null or length(description) <= 2000),
  price_minor bigint check (price_minor is null or price_minor >= 0),
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  dietary_tags text[] not null default '{}',
  verified_allergen_tags text[] not null default '{}',
  partner_recommended boolean not null default false,
  editorial_pick boolean not null default false,
  editorial_note text check (editorial_note is null or length(editorial_note) <= 1000),
  availability_note text check (availability_note is null or length(availability_note) <= 500),
  position integer not null default 0 check (position >= 0),
  unique (section_id, position),
  check ((price_minor is null) = (currency is null)),
  foreign key (section_id, menu_id) references public.menu_sections(id, menu_id) on delete cascade
);
create index if not exists menu_sections_menu_position_idx on public.menu_sections(menu_id, position);
create index if not exists menu_items_menu_section_position_idx on public.menu_items(menu_id, section_id, position);

create table if not exists public.venue_action_capabilities (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  kind text not null check (kind in ('reserve','delivery','takeaway','preorder','website','whatsapp','maps')),
  provider text not null check (length(btrim(provider)) between 1 and 80),
  url text not null check (url ~ '^https://'),
  label text check (label is null or length(label) <= 160),
  status text not null default 'draft' check (status in ('draft','review','confirmed','disabled','archived')),
  priority integer not null default 100 check (priority >= 0),
  confirmation_required boolean not null default true,
  source_url text not null check (source_url ~ '^https://'),
  source_label text not null check (length(btrim(source_label)) between 1 and 160),
  captured_at timestamptz not null,
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_slug, kind, provider),
  check (expires_at is null or expires_at > captured_at),
  check (status <> 'confirmed' or verified_at is not null)
);
create index if not exists venue_actions_public_lookup_idx
  on public.venue_action_capabilities(venue_slug, status, priority, expires_at);

-- Versioned owner/representative consent evidence. Existing photo_url values
-- are retained but are not proof by themselves; future publication gates can
-- require a matching granted row for the active consent version.
create table if not exists public.venue_media_consents (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  consented_by text not null check (length(btrim(consented_by)) between 1 and 120),
  consent_version text not null check (length(btrim(consent_version)) between 1 and 40),
  channel text not null check (channel in ('onboarding','email','whatsapp','written','admin_recorded')),
  granted boolean not null,
  consented_at timestamptz not null,
  source_url text,
  created_at timestamptz not null default now(),
  unique (venue_slug, consent_version, consented_at)
);

alter table public.menus enable row level security;
alter table public.menu_sections enable row level security;
alter table public.menu_items enable row level security;
alter table public.venue_action_capabilities enable row level security;
alter table public.venue_media_consents enable row level security;

drop policy if exists "public read fresh published menus" on public.menus;
create policy "public read fresh published menus" on public.menus for select to anon, authenticated
using (
  status = 'published' and verified_at is not null and captured_at is not null
  and (expires_at is null or expires_at > now())
  and exists (select 1 from public.venues v where v.slug = venue_slug
    and v.status = 'active' and v.publication_status = 'published')
);

drop policy if exists "public read published menu sections" on public.menu_sections;
create policy "public read published menu sections" on public.menu_sections for select to anon, authenticated
using (exists (select 1 from public.menus m where m.id = menu_id));

drop policy if exists "public read published menu items" on public.menu_items;
create policy "public read published menu items" on public.menu_items for select to anon, authenticated
using (exists (select 1 from public.menus m where m.id = menu_id));

drop policy if exists "public read fresh confirmed actions" on public.venue_action_capabilities;
create policy "public read fresh confirmed actions" on public.venue_action_capabilities for select to anon, authenticated
using (
  status = 'confirmed' and verified_at is not null and captured_at is not null
  and (expires_at is null or expires_at > now())
  and exists (select 1 from public.venues v where v.slug = venue_slug
    and v.status = 'active' and v.publication_status = 'published')
  and (kind <> 'reserve' or provider <> 'tablepilot' or exists (
    select 1 from public.venues v join public.districts d on d.slug = v.district
    where v.slug = venue_slug and d.status = 'active_deep' and d.monetization_enabled
  ))
);

-- Publish a reviewed replacement atomically; the previous version remains
-- public until this call succeeds. Admin/service role only.
create or replace function public.publish_menu_version(p_menu_id uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_menu public.menus%rowtype;
begin
  if auth.role() <> 'service_role' then return jsonb_build_object('ok', false, 'error', 'forbidden'); end if;
  select * into v_menu from public.menus where id = p_menu_id for update;
  if not found or v_menu.status <> 'review' or v_menu.verified_at is null then
    return jsonb_build_object('ok', false, 'error', 'not_publishable');
  end if;
  if not exists (select 1 from public.menu_sections s join public.menu_items i on i.section_id = s.id where s.menu_id = p_menu_id) then
    return jsonb_build_object('ok', false, 'error', 'empty_menu');
  end if;
  update public.menus set status = 'archived', updated_at = now()
    where venue_slug = v_menu.venue_slug and status = 'published' and id <> p_menu_id;
  update public.menus set status = 'published', updated_at = now() where id = p_menu_id;
  return jsonb_build_object('ok', true);
end; $$;

-- Partner token path creates factual drafts only. Editorial fields are absent
-- from the signature and therefore cannot be set through this path.
create or replace function public.create_partner_menu_draft(
  p_token text, p_title text, p_source_url text, p_source_label text,
  p_captured_at timestamptz, p_expires_at timestamptz default null
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_slug text; v_id uuid; v_version integer;
begin
  select venue_slug into v_slug from public.venue_onboard_tokens where token = p_token;
  if v_slug is null then return jsonb_build_object('ok', false, 'error', 'bad_token'); end if;
  if p_source_url !~ '^https://' or p_captured_at is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_evidence'); end if;
  select coalesce(max(version),0)+1 into v_version from public.menus where venue_slug = v_slug;
  insert into public.menus(venue_slug,title,version,status,source_url,source_label,captured_at,expires_at)
  values(v_slug,left(btrim(p_title),160),v_version,'draft',p_source_url,left(btrim(p_source_label),160),p_captured_at,p_expires_at)
  returning id into v_id;
  return jsonb_build_object('ok', true, 'menu_id', v_id, 'version', v_version);
end; $$;

create or replace function public.create_partner_action_draft(
  p_token text, p_kind text, p_provider text, p_url text, p_label text,
  p_priority integer, p_confirmation_required boolean, p_source_url text,
  p_source_label text, p_captured_at timestamptz, p_expires_at timestamptz default null
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_slug text; v_id uuid;
begin
  select venue_slug into v_slug from public.venue_onboard_tokens where token = p_token;
  if v_slug is null then return jsonb_build_object('ok', false, 'error', 'bad_token'); end if;
  if p_kind not in ('reserve','delivery','takeaway','preorder','website','whatsapp','maps')
    or p_url !~ '^https://' or p_source_url !~ '^https://' or p_captured_at is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_input'); end if;
  insert into public.venue_action_capabilities(
    venue_slug,kind,provider,url,label,status,priority,confirmation_required,
    source_url,source_label,captured_at,expires_at)
  values(v_slug,p_kind,left(btrim(p_provider),80),p_url,nullif(left(btrim(coalesce(p_label,'')),160),''),
    'draft',greatest(coalesce(p_priority,100),0),coalesce(p_confirmation_required,true),
    p_source_url,left(btrim(p_source_label),160),p_captured_at,p_expires_at)
  on conflict(venue_slug,kind,provider) do update set
    url=excluded.url,label=excluded.label,status='draft',priority=excluded.priority,
    confirmation_required=excluded.confirmation_required,source_url=excluded.source_url,
    source_label=excluded.source_label,captured_at=excluded.captured_at,verified_at=null,
    expires_at=excluded.expires_at,updated_at=now()
  returning id into v_id;
  return jsonb_build_object('ok', true, 'capability_id', v_id);
end; $$;

create or replace function public.upsert_partner_menu_item(
  p_token text, p_menu_id uuid, p_section_name text, p_section_position integer,
  p_name text, p_description text, p_price_minor bigint, p_currency text,
  p_dietary_tags text[], p_verified_allergen_tags text[],
  p_partner_recommended boolean, p_availability_note text, p_item_position integer
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_slug text; v_section_id uuid; v_item_id uuid;
begin
  select venue_slug into v_slug from public.venue_onboard_tokens where token = p_token;
  if v_slug is null or not exists (
    select 1 from public.menus m where m.id=p_menu_id and m.venue_slug=v_slug and m.status='draft'
  ) then return jsonb_build_object('ok', false, 'error', 'bad_token_or_menu'); end if;
  if p_price_minor is not null and (p_price_minor < 0 or coalesce(p_currency,'') !~ '^[A-Z]{3}$') then
    return jsonb_build_object('ok', false, 'error', 'invalid_price'); end if;
  insert into public.menu_sections(menu_id,name,position)
  values(p_menu_id,left(btrim(p_section_name),160),greatest(coalesce(p_section_position,0),0))
  on conflict(menu_id,position) do update set name=excluded.name returning id into v_section_id;
  insert into public.menu_items(
    menu_id,section_id,name,description,price_minor,currency,dietary_tags,
    verified_allergen_tags,partner_recommended,editorial_pick,editorial_note,
    availability_note,position)
  values(p_menu_id,v_section_id,left(btrim(p_name),200),nullif(left(btrim(coalesce(p_description,'')),2000),''),
    p_price_minor,case when p_price_minor is null then null else p_currency end,
    coalesce(p_dietary_tags,'{}'),coalesce(p_verified_allergen_tags,'{}'),
    coalesce(p_partner_recommended,false),false,null,
    nullif(left(btrim(coalesce(p_availability_note,'')),500),''),greatest(coalesce(p_item_position,0),0))
  on conflict(section_id,position) do update set
    name=excluded.name,description=excluded.description,price_minor=excluded.price_minor,
    currency=excluded.currency,dietary_tags=excluded.dietary_tags,
    verified_allergen_tags=excluded.verified_allergen_tags,
    partner_recommended=excluded.partner_recommended,editorial_pick=false,
    editorial_note=null,availability_note=excluded.availability_note
  returning id into v_item_id;
  return jsonb_build_object('ok', true, 'item_id', v_item_id);
end; $$;

create or replace function public.record_venue_media_consent(
  p_token text, p_consented_by text, p_consent_version text,
  p_channel text, p_granted boolean, p_consented_at timestamptz
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_slug text; v_id uuid;
begin
  select venue_slug into v_slug from public.venue_onboard_tokens where token=p_token;
  if v_slug is null then return jsonb_build_object('ok',false,'error','bad_token'); end if;
  if p_channel not in ('onboarding','email','whatsapp','written','admin_recorded')
    or nullif(btrim(p_consented_by),'') is null
    or nullif(btrim(p_consent_version),'') is null or p_consented_at is null then
    return jsonb_build_object('ok',false,'error','invalid_consent'); end if;
  insert into public.venue_media_consents(
    venue_slug,consented_by,consent_version,channel,granted,consented_at)
  values(v_slug,left(btrim(p_consented_by),120),left(btrim(p_consent_version),40),
    p_channel,coalesce(p_granted,false),p_consented_at)
  returning id into v_id;
  return jsonb_build_object('ok',true,'consent_id',v_id);
end; $$;

-- Preserve the deployed two-argument API while tightening its authorization:
-- a photo can become the public venue photo only after versioned owner consent.
create or replace function public.set_venue_photo(p_token text, p_url text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_slug text;
begin
  select venue_slug into v_slug from public.venue_onboard_tokens where token=p_token;
  if v_slug is null then return jsonb_build_object('ok',false,'error','bad_token'); end if;
  if p_url not like 'https://egkdapqwkfprtyqvvnso.supabase.co/storage/v1/object/public/venue-photos/%' then
    return jsonb_build_object('ok',false,'error','bad_url'); end if;
  if not exists (
    select 1 from public.venue_media_consents c where c.venue_slug=v_slug and c.granted
      and not exists (select 1 from public.venue_media_consents later
        where later.venue_slug=c.venue_slug and later.consented_at>c.consented_at and not later.granted)
  ) then return jsonb_build_object('ok',false,'error','media_consent_required'); end if;
  update public.venues set photo_url=p_url where slug=v_slug;
  return jsonb_build_object('ok',true);
end; $$;

-- Safe analytics v2 keeps acquisition source unchanged and accepts only the
-- four whitelisted, bounded, PII-free payload keys.
create or replace function public.log_event_v2(
  p_type text, p_guest_ref text, p_venue_slug text, p_source text, p_payload jsonb default null
) returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare v_id uuid; v_clean jsonb;
begin
  if p_type is null or p_type not in ('menu_open','menu_item_open','action_handoff','delivery_click','takeaway_click','preorder_click') then return; end if;
  if p_payload is not null and (
    jsonb_typeof(p_payload) <> 'object' or
    exists (select 1 from jsonb_object_keys(p_payload) as keys(key) where key not in ('action','provider','capabilityId','venueSlug')) or
    length(coalesce(p_payload->>'provider','')) > 80 or length(coalesce(p_payload->>'capabilityId','')) > 120 or
    length(coalesce(p_payload->>'venueSlug','')) > 120 or
    coalesce(p_payload->>'action','') not in ('reserve','delivery','takeaway','preorder','website','whatsapp','maps')
  ) then return; end if;
  select id into v_id from public.guest_refs where ref = p_guest_ref;
  v_clean := case when p_payload is null then null else jsonb_strip_nulls(jsonb_build_object(
    'action',p_payload->>'action','provider',p_payload->>'provider',
    'capabilityId',p_payload->>'capabilityId','venueSlug',p_payload->>'venueSlug')) end;
  insert into public.events(type,guest_ref_id,venue_slug,source,payload)
  values(p_type,v_id,p_venue_slug,p_source,v_clean);
end; $$;

revoke all on function public.publish_menu_version(uuid) from public;
revoke all on function public.create_partner_menu_draft(text,text,text,text,timestamptz,timestamptz) from public;
revoke all on function public.create_partner_action_draft(text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz) from public;
revoke all on function public.upsert_partner_menu_item(text,uuid,text,integer,text,text,bigint,text,text[],text[],boolean,text,integer) from public;
revoke all on function public.record_venue_media_consent(text,text,text,text,boolean,timestamptz) from public;
revoke all on function public.log_event_v2(text,text,text,text,jsonb) from public;
grant execute on function public.publish_menu_version(uuid) to service_role;
grant execute on function public.create_partner_menu_draft(text,text,text,text,timestamptz,timestamptz) to anon, authenticated;
grant execute on function public.create_partner_action_draft(text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz) to anon, authenticated;
grant execute on function public.upsert_partner_menu_item(text,uuid,text,integer,text,text,bigint,text,text[],text[],boolean,text,integer) to anon, authenticated;
grant execute on function public.record_venue_media_consent(text,text,text,text,boolean,timestamptz) to anon, authenticated;
grant execute on function public.log_event_v2(text,text,text,text,jsonb) to anon, authenticated;

-- Idempotent, evidence-backed compatibility backfill. No menu items are
-- invented. TablePilot is limited to active-deep monetized coverage.
insert into public.venue_action_capabilities(
  venue_slug,kind,provider,url,label,status,priority,confirmation_required,
  source_url,source_label,captured_at,verified_at)
select v.slug,'reserve','tablepilot',
  'https://tablepilot-id.vercel.app/book/' || v.tablepilot_slug || '?source=bali_privilege',
  'Reserve with TablePilot','confirmed',10,true,
  coalesce(v.official_url,'https://tablepilot-id.vercel.app/'),
  'Verified venue / TablePilot connection',v.last_verified_at::timestamptz,v.last_verified_at::timestamptz
from public.venues v join public.districts d on d.slug=v.district
where nullif(btrim(v.tablepilot_slug),'') is not null and v.last_verified_at is not null
  and v.publication_status='published' and d.status='active_deep' and d.monetization_enabled
on conflict(venue_slug,kind,provider) do nothing;

insert into public.venue_action_capabilities(
  venue_slug,kind,provider,url,label,status,priority,confirmation_required,
  source_url,source_label,captured_at,verified_at)
select v.slug,'whatsapp','whatsapp','https://wa.me/' || regexp_replace(v.whatsapp,'[^0-9]','','g'),
  'Message venue','confirmed',80,false,coalesce(v.official_url,v.gmaps_url),
  'Verified official venue contact',v.last_verified_at::timestamptz,v.last_verified_at::timestamptz
from public.venues v
where nullif(regexp_replace(coalesce(v.whatsapp,''),'[^0-9]','','g'),'') is not null
  and v.last_verified_at is not null and v.publication_status='published'
  and coalesce(v.official_url,v.gmaps_url) ~ '^https://'
on conflict(venue_slug,kind,provider) do nothing;

insert into public.venue_action_capabilities(
  venue_slug,kind,provider,url,label,status,priority,confirmation_required,
  source_url,source_label,captured_at,verified_at)
select v.slug,'maps','google_maps',v.gmaps_url,'Open in Google Maps','confirmed',100,false,
  v.gmaps_url,'Verified Google Maps handoff',v.last_verified_at::timestamptz,v.last_verified_at::timestamptz
from public.venues v
where v.gmaps_url ~ '^https://' and v.last_verified_at is not null and v.publication_status='published'
on conflict(venue_slug,kind,provider) do nothing;
