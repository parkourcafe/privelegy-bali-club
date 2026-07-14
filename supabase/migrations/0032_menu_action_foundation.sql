-- Other Bali structured menus and verified external action handoffs.
-- Additive only. Public reads fail closed on publication, evidence and freshness.

begin;

alter table public.events add column if not exists payload jsonb;

create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 160),
  version integer not null check (version > 0),
  status text not null default 'draft'
    check (status in ('draft','review','published','archived')),
  completeness text not null default 'partial'
    check (completeness in ('full','partial')),
  source_url text not null check (source_url ~ '^https://[^[:space:]]+$'),
  source_label text not null check (length(btrim(source_label)) between 1 and 160),
  captured_at timestamptz not null,
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_slug, version),
  check (expires_at is null or expires_at > captured_at),
  check (
    status <> 'published'
    or (completeness = 'full' and verified_at is not null and expires_at is not null)
  )
);

alter table public.menus
  add column if not exists completeness text not null default 'partial';
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.menus'::regclass
      and conname = 'menus_completeness_check'
  ) then
    alter table public.menus add constraint menus_completeness_check
      check (completeness in ('full','partial'));
  end if;
end;
$$;

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
create unique index if not exists menu_sections_id_menu_idx
  on public.menu_sections(id, menu_id);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  section_id uuid not null,
  name text not null check (length(btrim(name)) between 1 and 200),
  description text check (description is null or length(description) <= 2000),
  price_minor bigint check (price_minor is null or price_minor >= 0),
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  price_text text check (price_text is null or length(price_text) <= 120),
  dietary_tags text[] not null default '{}',
  verified_allergen_tags text[] not null default '{}',
  partner_recommended boolean not null default false,
  editorial_pick boolean not null default false,
  editorial_note text check (editorial_note is null or length(editorial_note) <= 1000),
  availability_note text check (availability_note is null or length(availability_note) <= 500),
  position integer not null default 0 check (position >= 0),
  unique (section_id, position),
  check ((price_minor is null) = (currency is null)),
  foreign key (section_id, menu_id)
    references public.menu_sections(id, menu_id) on delete cascade
);
create index if not exists menu_sections_menu_position_idx
  on public.menu_sections(menu_id, position);
create index if not exists menu_items_menu_section_position_idx
  on public.menu_items(menu_id, section_id, position);

-- Capabilities are versioned. Directions remain on venues.gmaps_url and are
-- intentionally not duplicated in this registry. A partner proposal is always
-- a new draft row;
-- the currently confirmed row remains live until an operator publishes the
-- replacement in one transaction.
create table if not exists public.venue_action_capabilities (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  kind text not null
    check (kind in ('reserve','delivery','takeaway','preorder','website','whatsapp')),
  provider text not null
    check (length(btrim(provider)) between 1 and 80 and provider = lower(btrim(provider))),
  version integer not null check (version > 0),
  replaces_capability_id uuid
    references public.venue_action_capabilities(id) on delete set null,
  url text not null check (url ~ '^https://[^[:space:]]+$'),
  label text check (label is null or length(label) <= 160),
  status text not null default 'draft'
    check (status in ('draft','review','confirmed','disabled','archived')),
  priority integer not null default 100 check (priority >= 0),
  confirmation_required boolean not null default true,
  source_url text not null check (source_url ~ '^https://[^[:space:]]+$'),
  source_label text not null check (length(btrim(source_label)) between 1 and 160),
  captured_at timestamptz not null,
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_slug, kind, provider, version),
  check (replaces_capability_id is null or replaces_capability_id <> id),
  check (expires_at is null or expires_at > captured_at),
  check (status <> 'confirmed' or (verified_at is not null and expires_at is not null))
);
create unique index if not exists venue_actions_one_confirmed_provider_idx
  on public.venue_action_capabilities(venue_slug, kind, provider)
  where status = 'confirmed';
create index if not exists venue_actions_public_lookup_idx
  on public.venue_action_capabilities(
    venue_slug, status, kind, priority, version desc, expires_at
  );
create index if not exists venue_actions_replacement_idx
  on public.venue_action_capabilities(replaces_capability_id)
  where replaces_capability_id is not null;

-- A confirmed capability is immutable evidence. Replacements must be new
-- versioned drafts; only lifecycle status and updated_at may change in place.
create or replace function public.protect_verified_action_record()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    if old.verified_at is not null then
      raise exception 'verified action capabilities cannot be deleted';
    end if;
    return old;
  end if;
  if old.verified_at is not null and row(
    new.venue_slug, new.kind, new.provider, new.version,
    new.replaces_capability_id, new.url, new.label, new.priority,
    new.confirmation_required, new.source_url, new.source_label,
    new.captured_at, new.verified_at, new.expires_at, new.created_at
  ) is distinct from row(
    old.venue_slug, old.kind, old.provider, old.version,
    old.replaces_capability_id, old.url, old.label, old.priority,
    old.confirmation_required, old.source_url, old.source_label,
    old.captured_at, old.verified_at, old.expires_at, old.created_at
  ) then
    raise exception 'verified action capability evidence is immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_verified_action_record_trigger
  on public.venue_action_capabilities;
create trigger protect_verified_action_record_trigger
before update or delete on public.venue_action_capabilities
for each row execute function public.protect_verified_action_record();

-- A verified menu is an immutable factual snapshot. Publication/archive may
-- change its state, but neither the evidence-bearing parent nor any child
-- content can be edited after operator verification.
create or replace function public.protect_verified_menu_record()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    if old.verified_at is not null then
      raise exception 'verified menu snapshots cannot be deleted';
    end if;
    return old;
  end if;

  if old.verified_at is not null and row(
    new.venue_slug, new.title, new.version, new.completeness,
    new.source_url, new.source_label,
    new.captured_at, new.verified_at, new.expires_at, new.created_at
  ) is distinct from row(
    old.venue_slug, old.title, old.version, old.completeness,
    old.source_url, old.source_label,
    old.captured_at, old.verified_at, old.expires_at, old.created_at
  ) then
    raise exception 'verified menu snapshot evidence is immutable';
  end if;
  return new;
end;
$$;

create or replace function public.protect_verified_menu_children()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_old_menu_id uuid;
  v_new_menu_id uuid;
begin
  if tg_op <> 'INSERT' then v_old_menu_id := old.menu_id; end if;
  if tg_op <> 'DELETE' then v_new_menu_id := new.menu_id; end if;
  if exists (
    select 1 from public.menus m
    where m.id in (v_old_menu_id, v_new_menu_id)
      and m.verified_at is not null
  ) then
    raise exception 'verified menu snapshot content is immutable';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists protect_verified_menu_record_trigger on public.menus;
create trigger protect_verified_menu_record_trigger
before update or delete on public.menus
for each row execute function public.protect_verified_menu_record();

drop trigger if exists protect_verified_menu_sections_trigger on public.menu_sections;
create trigger protect_verified_menu_sections_trigger
before insert or update or delete on public.menu_sections
for each row execute function public.protect_verified_menu_children();

drop trigger if exists protect_verified_menu_items_trigger on public.menu_items;
create trigger protect_verified_menu_items_trigger
before insert or update or delete on public.menu_items
for each row execute function public.protect_verified_menu_children();

alter table public.menus enable row level security;
alter table public.menu_sections enable row level security;
alter table public.menu_items enable row level security;
alter table public.venue_action_capabilities enable row level security;

-- Deny direct writes. Token-scoped partner changes go through factual-only
-- SECURITY DEFINER RPCs; operator changes use the service role.
revoke all on table public.menus from public, anon, authenticated;
revoke all on table public.menu_sections from public, anon, authenticated;
revoke all on table public.menu_items from public, anon, authenticated;
revoke all on table public.venue_action_capabilities from public, anon, authenticated;
grant select on table public.menus, public.menu_sections, public.menu_items,
  public.venue_action_capabilities to anon, authenticated;
-- The public action policy checks district monetization for TablePilot. Keep
-- this public directory ACL explicit so policy evaluation returns zero rows
-- rather than a permission error on a freshly replayed production schema.
grant select on table public.districts to anon, authenticated;
grant select, insert, update, delete on table public.menus, public.menu_sections,
  public.menu_items, public.venue_action_capabilities to service_role;

drop policy if exists "public read fresh published menus" on public.menus;
create policy "public read fresh published menus"
on public.menus for select to anon, authenticated
using (
  status = 'published'
  and completeness = 'full'
  and verified_at is not null
  and captured_at is not null
  and expires_at > now()
  and exists (
    select 1
    from public.venues v
    where v.slug = venue_slug
      and v.status = 'active'
      and v.publication_status = 'published'
  )
);

drop policy if exists "public read published menu sections" on public.menu_sections;
create policy "public read published menu sections"
on public.menu_sections for select to anon, authenticated
using (
  exists (
    select 1
    from public.menus m
    join public.venues v on v.slug = m.venue_slug
    where m.id = menu_id
      and m.status = 'published'
      and m.completeness = 'full'
      and m.verified_at is not null
      and m.expires_at > now()
      and v.status = 'active'
      and v.publication_status = 'published'
  )
);

drop policy if exists "public read published menu items" on public.menu_items;
create policy "public read published menu items"
on public.menu_items for select to anon, authenticated
using (
  exists (
    select 1
    from public.menus m
    join public.venues v on v.slug = m.venue_slug
    where m.id = menu_id
      and m.status = 'published'
      and m.completeness = 'full'
      and m.verified_at is not null
      and m.expires_at > now()
      and v.status = 'active'
      and v.publication_status = 'published'
  )
);

drop policy if exists "public read fresh confirmed actions"
  on public.venue_action_capabilities;
create policy "public read fresh confirmed actions"
on public.venue_action_capabilities for select to anon, authenticated
using (
  status = 'confirmed'
  and verified_at is not null
  and captured_at is not null
  and expires_at > now()
  and exists (
    select 1
    from public.venues v
    where v.slug = venue_slug
      and v.status = 'active'
      and v.publication_status = 'published'
  )
  and (
    kind <> 'reserve'
    or provider <> 'tablepilot'
    or exists (
      select 1
      from public.venues v
      join public.districts d on d.slug = v.district
      where v.slug = venue_slug
        and d.status = 'active_deep'
        and d.monetization_enabled
    )
  )
);

-- Publish a reviewed replacement atomically. The previous public version is
-- archived in the same transaction, so readers see either old or new, never a
-- half-published state.
create or replace function public.is_publishable_evidence_url(p_url text)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_authority text;
  v_host text;
begin
  if p_url is null or p_url !~ '^https://[^[:space:]]+$' then return false; end if;
  v_authority := substring(lower(p_url) from '^https://([^/?#]+)');
  if v_authority is null
    or v_authority ~ '@'
    or v_authority !~ '^[a-z0-9.-]+(:443)?$' then return false; end if;
  v_host := regexp_replace(v_authority, ':443$', '');
  if v_host !~ '^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$'
    or v_host not like '%.%'
    or v_host like '%..%'
    or v_host ~ '^[0-9.]+$'
    or v_host = 'example.com'
    or v_host like '%.example.com'
    or v_host like '%.invalid'
    or v_host like '%.test' then return false; end if;
  return true;
end;
$$;

revoke all on function public.is_publishable_evidence_url(text)
  from public, anon, authenticated;
grant execute on function public.is_publishable_evidence_url(text) to service_role;

create or replace function public.publish_menu_version(p_menu_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_menu public.menus%rowtype;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select * into v_menu
  from public.menus
  where id = p_menu_id
  for update;

  if not found
    or v_menu.status <> 'review'
    or v_menu.completeness <> 'full'
    or v_menu.verified_at is null
    or v_menu.expires_at is null
    or v_menu.expires_at <= now()
    or not public.is_publishable_evidence_url(v_menu.source_url) then
    return jsonb_build_object('ok', false, 'error', 'not_publishable');
  end if;

  if not exists (
    select 1
    from public.venues v
    where v.slug = v_menu.venue_slug
      and v.status = 'active'
      and v.publication_status = 'published'
  ) then
    return jsonb_build_object('ok', false, 'error', 'parent_not_publishable');
  end if;

  if not exists (
    select 1
    from public.menu_sections s
    join public.menu_items i on i.section_id = s.id and i.menu_id = s.menu_id
    where s.menu_id = p_menu_id
  ) then
    return jsonb_build_object('ok', false, 'error', 'empty_menu');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('menu-publish:' || v_menu.venue_slug, 0)
  );
  perform 1
  from public.menus
  where venue_slug = v_menu.venue_slug
  for update;

  update public.menus
  set status = 'archived', updated_at = now()
  where venue_slug = v_menu.venue_slug
    and status = 'published'
    and id <> p_menu_id;

  update public.menus
  set status = 'published', updated_at = now()
  where id = p_menu_id;

  return jsonb_build_object('ok', true);
end;
$$;

-- Database-side provider gate. UI validation is advisory; this function is
-- the final protection against credentialed URLs, lookalike hosts, example
-- domains and provider/action mismatches.
create or replace function public.is_publishable_action_capability(
  p_kind text,
  p_provider text,
  p_url text,
  p_source_url text
)
returns boolean
language plpgsql
immutable
set search_path = public, pg_temp
as $$
declare
  v_target_authority text;
  v_source_authority text;
  v_target_host text;
  v_source_host text;
  v_allowed_hosts text[];
  v_matches boolean;
begin
  if p_url !~ '^https://[^[:space:]]+$'
    or p_source_url !~ '^https://[^[:space:]]+$' then
    return false;
  end if;

  v_target_authority := substring(lower(p_url) from '^https://([^/?#]+)');
  v_source_authority := substring(lower(p_source_url) from '^https://([^/?#]+)');
  if v_target_authority is null or v_source_authority is null
    or v_target_authority ~ '@' or v_source_authority ~ '@'
    or v_target_authority !~ '^[a-z0-9.-]+(:443)?$'
    or v_source_authority !~ '^[a-z0-9.-]+(:443)?$' then
    return false;
  end if;

  v_target_host := regexp_replace(v_target_authority, ':443$', '');
  v_source_host := regexp_replace(v_source_authority, ':443$', '');
  if v_target_host !~ '^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$'
    or v_source_host !~ '^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$'
    or v_target_host not like '%.%'
    or v_source_host not like '%.%'
    or v_target_host like '%..%'
    or v_source_host like '%..%'
    or v_target_host ~ '^[0-9.]+$'
    or v_source_host ~ '^[0-9.]+$'
    or v_target_host in ('example.com', 'www.example.com', 'tablepilot.example')
    or v_source_host in ('example.com', 'www.example.com', 'tablepilot.example')
    or v_target_host like '%.example.com'
    or v_source_host like '%.example.com' then
    return false;
  end if;

  if p_provider = 'official' then
    if p_kind not in ('reserve','delivery','takeaway','preorder','website') then
      return false;
    end if;
    return v_target_host = v_source_host
      or right(v_target_host, length(v_source_host) + 1) = '.' || v_source_host
      or right(v_source_host, length(v_target_host) + 1) = '.' || v_target_host;
  elsif p_provider = 'tablepilot' and p_kind = 'reserve' then
    v_allowed_hosts := array['tablepilot-id.vercel.app'];
  elsif p_provider = 'whatsapp' and p_kind = 'whatsapp' then
    v_allowed_hosts := array['wa.me','whatsapp.com'];
  elsif p_provider = 'grabfood' and p_kind in ('delivery','takeaway') then
    v_allowed_hosts := array['grab.com','grab.onelink.me'];
  elsif p_provider = 'gofood' and p_kind in ('delivery','takeaway') then
    v_allowed_hosts := array['gofood.co.id','gofood.link','gojek.com','gojek.page.link'];
  elsif p_provider = 'shopeefood' and p_kind in ('delivery','takeaway') then
    v_allowed_hosts := array['shopee.co.id','shopeefood.co.id'];
  elsif p_provider = 'sevenrooms' and p_kind = 'reserve' then
    v_allowed_hosts := array['sevenrooms.com'];
  elsif p_provider = 'tablecheck' and p_kind = 'reserve' then
    v_allowed_hosts := array['tablecheck.com'];
  elsif p_provider = 'chope' and p_kind = 'reserve' then
    v_allowed_hosts := array['chope.co','chope.co.id'];
  elsif p_provider = 'resdiary' and p_kind = 'reserve' then
    v_allowed_hosts := array['resdiary.com'];
  elsif p_provider = 'dishcult' and p_kind = 'reserve' then
    v_allowed_hosts := array['dishcult.com'];
  else
    return false;
  end if;

  select exists (
    select 1 from unnest(v_allowed_hosts) as allowed(host)
    where v_target_host = allowed.host
      or right(v_target_host, length(allowed.host) + 1) = '.' || allowed.host
  ) into v_matches;
  return v_matches;
end;
$$;

revoke all on function public.is_publishable_action_capability(text,text,text,text)
  from public, anon, authenticated;
grant execute on function public.is_publishable_action_capability(text,text,text,text)
  to service_role;

create or replace function public.publish_action_capability(p_capability_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_action public.venue_action_capabilities%rowtype;
  v_previous_id uuid;
  v_verified_at timestamptz := clock_timestamp();
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select * into v_action
  from public.venue_action_capabilities
  where id = p_capability_id
  for update;

  if not found
    or v_action.status not in ('draft', 'review')
    or not public.is_publishable_action_capability(
      v_action.kind, v_action.provider, v_action.url, v_action.source_url
    )
    or nullif(btrim(v_action.source_label), '') is null
    or (v_action.expires_at is not null and v_action.expires_at <= v_verified_at) then
    return jsonb_build_object('ok', false, 'error', 'not_publishable');
  end if;

  if not exists (
    select 1
    from public.venues v
    where v.slug = v_action.venue_slug
      and v.status = 'active'
      and v.publication_status = 'published'
  ) then
    return jsonb_build_object('ok', false, 'error', 'parent_not_publishable');
  end if;

  if v_action.kind = 'reserve' and v_action.provider = 'tablepilot'
    and not exists (
      select 1
      from public.venues v
      join public.districts d on d.slug = v.district
      where v.slug = v_action.venue_slug
        and d.status = 'active_deep'
        and d.monetization_enabled
    ) then
    return jsonb_build_object('ok', false, 'error', 'coverage_not_publishable');
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    concat_ws(':', 'action-publish', v_action.venue_slug, v_action.kind, v_action.provider),
    0
  ));

  select id into v_previous_id
  from public.venue_action_capabilities
  where venue_slug = v_action.venue_slug
    and kind = v_action.kind
    and provider = v_action.provider
    and status = 'confirmed'
    and id <> p_capability_id
  order by version desc
  limit 1
  for update;

  update public.venue_action_capabilities
  set status = 'archived', updated_at = v_verified_at
  where venue_slug = v_action.venue_slug
    and kind = v_action.kind
    and provider = v_action.provider
    and status = 'confirmed'
    and id <> p_capability_id;

  update public.venue_action_capabilities
  set status = 'confirmed',
      verified_at = v_verified_at,
      expires_at = coalesce(expires_at, v_verified_at + interval '30 days'),
      replaces_capability_id = coalesce(replaces_capability_id, v_previous_id),
      updated_at = v_verified_at
  where id = p_capability_id;

  return jsonb_build_object(
    'ok', true,
    'capability_id', p_capability_id,
    'replaced_capability_id', v_previous_id
  );
end;
$$;

-- Partner token paths create factual drafts only. Editorial fields and
-- publication state are not writable through these signatures.
create or replace function public.create_partner_menu_draft(
  p_token text,
  p_title text,
  p_source_url text,
  p_source_label text,
  p_captured_at timestamptz,
  p_expires_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_slug text;
  v_id uuid;
  v_version integer;
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
  if p_source_url is null
    or not public.is_publishable_evidence_url(p_source_url)
    or p_captured_at is null
    or nullif(btrim(p_title), '') is null
    or nullif(btrim(p_source_label), '') is null
    or (p_expires_at is not null and p_expires_at <= p_captured_at) then
    return jsonb_build_object('ok', false, 'error', 'invalid_evidence');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('partner-menu:' || v_slug, 0)
  );
  select coalesce(max(version), 0) + 1 into v_version
  from public.menus
  where venue_slug = v_slug;

  insert into public.menus(
    venue_slug, title, version, status, completeness, source_url, source_label,
    captured_at, expires_at
  )
  values (
    v_slug, left(btrim(p_title), 160), v_version, 'draft', 'partial', p_source_url,
    left(btrim(p_source_label), 160), p_captured_at,
    coalesce(p_expires_at, p_captured_at + interval '60 days')
  )
  returning id into v_id;

  return jsonb_build_object('ok', true, 'menu_id', v_id, 'version', v_version);
end;
$$;

create or replace function public.create_partner_action_draft(
  p_token text,
  p_kind text,
  p_provider text,
  p_url text,
  p_label text,
  p_priority integer,
  p_confirmation_required boolean,
  p_source_url text,
  p_source_label text,
  p_captured_at timestamptz,
  p_expires_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_slug text;
  v_id uuid;
  v_provider text := lower(btrim(coalesce(p_provider, '')));
  v_version integer;
  v_live_id uuid;
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
  if p_kind is null
    or p_kind not in ('reserve','delivery','takeaway','preorder','website','whatsapp')
    or length(v_provider) not between 1 and 80
    or p_url is null
    or p_url !~ '^https://[^[:space:]]+$'
    or p_source_url is null
    or p_source_url !~ '^https://[^[:space:]]+$'
    or nullif(btrim(p_source_label), '') is null
    or p_captured_at is null
    or (p_expires_at is not null and p_expires_at <= p_captured_at) then
    return jsonb_build_object('ok', false, 'error', 'invalid_input');
  end if;

  perform pg_advisory_xact_lock(hashtextextended(
    concat_ws(':', 'partner-action', v_slug, p_kind, v_provider),
    0
  ));

  select id into v_live_id
  from public.venue_action_capabilities
  where venue_slug = v_slug
    and kind = p_kind
    and provider = v_provider
    and status = 'confirmed'
  order by version desc
  limit 1;

  select coalesce(max(version), 0) + 1 into v_version
  from public.venue_action_capabilities
  where venue_slug = v_slug
    and kind = p_kind
    and provider = v_provider;

  insert into public.venue_action_capabilities(
    venue_slug, kind, provider, version, replaces_capability_id, url, label,
    status, priority, confirmation_required, source_url, source_label,
    captured_at, expires_at
  )
  values (
    v_slug, p_kind, v_provider, v_version, v_live_id, p_url,
    nullif(left(btrim(coalesce(p_label, '')), 160), ''), 'draft',
    greatest(coalesce(p_priority, 100), 0),
    case when p_kind = 'preorder' then true
      else coalesce(p_confirmation_required, true) end,
    p_source_url, left(btrim(p_source_label), 160), p_captured_at,
    coalesce(p_expires_at, p_captured_at + interval '30 days')
  )
  returning id into v_id;

  return jsonb_build_object(
    'ok', true,
    'capability_id', v_id,
    'version', v_version,
    'replaces_capability_id', v_live_id
  );
end;
$$;

create or replace function public.upsert_partner_menu_item(
  p_token text,
  p_menu_id uuid,
  p_section_name text,
  p_section_position integer,
  p_name text,
  p_description text,
  p_price_minor bigint,
  p_currency text,
  p_dietary_tags text[],
  p_verified_allergen_tags text[],
  p_partner_recommended boolean,
  p_availability_note text,
  p_item_position integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_slug text;
  v_section_id uuid;
  v_item_id uuid;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  select venue_slug into v_slug
  from public.venue_onboard_tokens
  where token = p_token;

  if v_slug is null or not exists (
    select 1
    from public.menus m
    where m.id = p_menu_id
      and m.venue_slug = v_slug
      and m.status = 'draft'
  ) then
    return jsonb_build_object('ok', false, 'error', 'bad_token_or_menu');
  end if;
  if nullif(btrim(p_section_name), '') is null
    or nullif(btrim(p_name), '') is null
    or (p_price_minor is not null
      and (p_price_minor < 0 or coalesce(p_currency, '') !~ '^[A-Z]{3}$')) then
    return jsonb_build_object('ok', false, 'error', 'invalid_item');
  end if;

  insert into public.menu_sections(menu_id, name, position)
  values (
    p_menu_id,
    left(btrim(p_section_name), 160),
    greatest(coalesce(p_section_position, 0), 0)
  )
  on conflict (menu_id, position) do update
    set name = excluded.name
  returning id into v_section_id;

  insert into public.menu_items(
    menu_id, section_id, name, description, price_minor, currency,
    dietary_tags, verified_allergen_tags, partner_recommended,
    editorial_pick, editorial_note, availability_note, position
  )
  values (
    p_menu_id,
    v_section_id,
    left(btrim(p_name), 200),
    nullif(left(btrim(coalesce(p_description, '')), 2000), ''),
    p_price_minor,
    case when p_price_minor is null then null else p_currency end,
    coalesce(p_dietary_tags, '{}'),
    coalesce(p_verified_allergen_tags, '{}'),
    coalesce(p_partner_recommended, false),
    false,
    null,
    nullif(left(btrim(coalesce(p_availability_note, '')), 500), ''),
    greatest(coalesce(p_item_position, 0), 0)
  )
  on conflict (section_id, position) do update set
    name = excluded.name,
    description = excluded.description,
    price_minor = excluded.price_minor,
    currency = excluded.currency,
    dietary_tags = excluded.dietary_tags,
    verified_allergen_tags = excluded.verified_allergen_tags,
    partner_recommended = excluded.partner_recommended,
    editorial_pick = false,
    editorial_note = null,
    availability_note = excluded.availability_note
  returning id into v_item_id;

  return jsonb_build_object('ok', true, 'item_id', v_item_id);
end;
$$;

-- Safe analytics v2 keeps acquisition source unchanged and accepts only the
-- whitelisted, bounded, PII-free payload keys.
create or replace function public.log_event_v2(
  p_type text,
  p_guest_ref text,
  p_venue_slug text,
  p_source text,
  p_payload jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_clean jsonb;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;
  if p_type is null or p_type not in (
    'menu_open','menu_item_open','action_handoff','delivery_click',
    'takeaway_click','preorder_click'
  ) then
    return;
  end if;
  if p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$'
    or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or p_payload is null
    or jsonb_typeof(p_payload) <> 'object'
    or p_payload->>'venueSlug' is distinct from p_venue_slug then
    return;
  end if;

  if p_type in ('menu_open','menu_item_open') then
    if exists (
      select 1 from jsonb_object_keys(p_payload) as keys(key)
      where key not in ('venueSlug','menuId','menuItemId')
    )
      or coalesce(p_payload->>'menuId', '') !~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$'
      or (p_type = 'menu_open' and p_payload ? 'menuItemId')
      or (p_type = 'menu_item_open' and
        coalesce(p_payload->>'menuItemId', '') !~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$') then
      return;
    end if;
    v_clean := jsonb_strip_nulls(jsonb_build_object(
      'venueSlug', p_payload->>'venueSlug',
      'menuId', p_payload->>'menuId',
      'menuItemId', p_payload->>'menuItemId'
    ));
  else
    if exists (
      select 1 from jsonb_object_keys(p_payload) as keys(key)
      where key not in ('action','provider','capabilityId','venueSlug')
    )
      or coalesce(p_payload->>'provider', '') !~ '^[a-z0-9][a-z0-9_-]{0,63}$'
      or (p_payload ? 'capabilityId' and
        coalesce(p_payload->>'capabilityId', '') !~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,119}$')
      or coalesce(p_payload->>'action', '') not in (
        'reserve','delivery','takeaway','preorder','website','whatsapp','maps'
      )
      or (p_type = 'delivery_click' and p_payload->>'action' <> 'delivery')
      or (p_type = 'takeaway_click' and p_payload->>'action' <> 'takeaway')
      or (p_type = 'preorder_click' and p_payload->>'action' <> 'preorder') then
      return;
    end if;
    v_clean := jsonb_strip_nulls(jsonb_build_object(
      'action', p_payload->>'action',
      'provider', p_payload->>'provider',
      'capabilityId', p_payload->>'capabilityId',
      'venueSlug', p_payload->>'venueSlug'
    ));
  end if;

  if p_source is not null and not exists (
    select 1 from public.attribution_sources s
    where s.id = p_source and s.active
  ) then return; end if;

  select id into v_id
  from public.guest_refs
  where ref = p_guest_ref;

  if exists (
    select 1 from public.events e
    where e.type = p_type
      and e.guest_ref_id is not distinct from v_id
      and e.venue_slug = p_venue_slug
      and e.payload = v_clean
      and e.ts > clock_timestamp() - interval '5 seconds'
  ) then return; end if;

  insert into public.events(type, guest_ref_id, venue_slug, source, payload)
  values (p_type, v_id, p_venue_slug, p_source, v_clean);
end;
$$;

revoke all on function public.publish_menu_version(uuid)
  from public, anon, authenticated;
revoke all on function public.publish_action_capability(uuid)
  from public, anon, authenticated;
revoke all on function public.create_partner_menu_draft(
  text,text,text,text,timestamptz,timestamptz
) from public, anon, authenticated;
revoke all on function public.create_partner_action_draft(
  text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz
) from public, anon, authenticated;
revoke all on function public.upsert_partner_menu_item(
  text,uuid,text,integer,text,text,bigint,text,text[],text[],boolean,text,integer
) from public, anon, authenticated;
revoke all on function public.log_event_v2(text,text,text,text,jsonb)
  from public, anon, authenticated;

grant execute on function public.publish_menu_version(uuid) to service_role;
grant execute on function public.publish_action_capability(uuid) to service_role;
grant execute on function public.create_partner_menu_draft(
  text,text,text,text,timestamptz,timestamptz
) to service_role;
grant execute on function public.create_partner_action_draft(
  text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz
) to service_role;
grant execute on function public.upsert_partner_menu_item(
  text,uuid,text,integer,text,text,bigint,text,text[],text[],boolean,text,integer
) to service_role;
grant execute on function public.log_event_v2(text,text,text,text,jsonb)
  to service_role;

-- Idempotent, evidence-backed compatibility backfill. No menu items are
-- invented. TablePilot is limited to active-deep monetized coverage.
insert into public.venue_action_capabilities(
  venue_slug, kind, provider, version, url, label, status, priority,
  confirmation_required, source_url, source_label, captured_at, verified_at,
  expires_at
)
select
  v.slug,
  'reserve',
  'tablepilot',
  1,
  'https://tablepilot-id.vercel.app/book/' || v.tablepilot_slug
    || '?source=bali_privilege',
  'Reserve with TablePilot',
  'confirmed',
  10,
  true,
  coalesce(v.official_url, 'https://tablepilot-id.vercel.app/'),
  'Verified venue / TablePilot connection',
  v.last_verified_at::timestamptz,
  v.last_verified_at::timestamptz,
  v.last_verified_at::timestamptz + interval '30 days'
from public.venues v
join public.districts d on d.slug = v.district
where nullif(btrim(v.tablepilot_slug), '') is not null
  and v.last_verified_at is not null
  and v.publication_status = 'published'
  and d.status = 'active_deep'
  and d.monetization_enabled
on conflict (venue_slug, kind, provider, version) do nothing;

insert into public.venue_action_capabilities(
  venue_slug, kind, provider, version, url, label, status, priority,
  confirmation_required, source_url, source_label, captured_at, verified_at,
  expires_at
)
select
  v.slug,
  'whatsapp',
  'whatsapp',
  1,
  'https://wa.me/' || regexp_replace(v.whatsapp, '[^0-9]', '', 'g'),
  'Message venue',
  'confirmed',
  80,
  false,
  coalesce(v.official_url, v.gmaps_url),
  'Verified official venue contact',
  v.last_verified_at::timestamptz,
  v.last_verified_at::timestamptz,
  v.last_verified_at::timestamptz + interval '60 days'
from public.venues v
where nullif(regexp_replace(coalesce(v.whatsapp, ''), '[^0-9]', '', 'g'), '')
    is not null
  and v.last_verified_at is not null
  and v.publication_status = 'published'
  and coalesce(v.official_url, v.gmaps_url) ~ '^https://[^[:space:]]+$'
on conflict (venue_slug, kind, provider, version) do nothing;

commit;
