-- One-shot transactional importer for the reviewed 2026-07-14 Data Ops
-- package. The client-side staging importer intentionally writes row by row;
-- production instead receives the same immutable package in one RPC so any
-- failure rolls the entire import back.

begin;

create table if not exists public.data_ops_import_runs (
  package_digest text primary key
    check (package_digest ~ '^[0-9a-f]{64}$'),
  input_digest text not null
    check (input_digest ~ '^[0-9a-f]{64}$'),
  menus_count integer not null check (menus_count >= 0),
  sections_count integer not null check (sections_count >= 0),
  items_count integer not null check (items_count >= 0),
  capabilities_count integer not null check (capabilities_count >= 0),
  maps_candidates_not_applied integer not null check (maps_candidates_not_applied >= 0),
  applied_at timestamptz not null default now(),
  applied_by text not null default auth.role()
);

alter table public.data_ops_import_runs enable row level security;
revoke all on table public.data_ops_import_runs from public, anon, authenticated;
grant select, insert on table public.data_ops_import_runs to service_role;

create or replace function public.import_data_ops_package(p_package jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_expected_package_digest constant text :=
    'ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081';
  v_expected_input_digest constant text :=
    '79eac95c0d8a93a18045b1a4d79691d2c1ac5fe869bd41ea9764010412844e9a';
  v_menu jsonb;
  v_section jsonb;
  v_item jsonb;
  v_capability jsonb;
  v_menu_id uuid;
  v_section_id uuid;
  v_menu_count integer := 0;
  v_section_count integer := 0;
  v_item_count integer := 0;
  v_capability_count integer := 0;
  v_nested_section_count integer;
  v_nested_item_count integer;
  v_capability_version integer;
  v_replaces_capability_id uuid;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('data-ops-import:' || v_expected_package_digest, 0)
  );

  if p_package is null
    or jsonb_typeof(p_package) <> 'object'
    or not (p_package ?& array[
      'packageDigest', 'inputDigest', 'expectedInputFiles', 'inputFiles',
      'forbiddenToPublish', 'releaseGates', 'menus', 'capabilities',
      'venueMapsCandidates'
    ])
    or coalesce(p_package->>'packageDigest', '') <> v_expected_package_digest
    or coalesce(p_package->>'inputDigest', '') <> v_expected_input_digest
    or (p_package->>'expectedInputFiles')::integer <> 55
    or (p_package->>'inputFiles')::integer <> 55
    or (p_package->>'forbiddenToPublish')::boolean is distinct from true
    or (p_package#>>'{releaseGates,denominatorReconciled}')::boolean is distinct from true
    or (p_package#>>'{releaseGates,readyForStagingApply}')::boolean is distinct from true
    or jsonb_typeof(p_package->'menus') <> 'array'
    or jsonb_typeof(p_package->'capabilities') <> 'array'
    or jsonb_typeof(p_package->'venueMapsCandidates') <> 'array'
  then
    raise exception using errcode = '22023', message = 'Data Ops package metadata mismatch';
  end if;

  if jsonb_array_length(p_package->'menus') <> 127
    or jsonb_array_length(p_package->'capabilities') <> 250
    or jsonb_array_length(p_package->'venueMapsCandidates') <> 50
  then
    raise exception using errcode = '22023', message = 'Data Ops top-level counts mismatch';
  end if;

  select count(*) into v_nested_section_count
  from jsonb_array_elements(p_package->'menus') menu(value)
  cross join lateral jsonb_array_elements(menu.value->'sections') section(value);

  select count(*) into v_nested_item_count
  from jsonb_array_elements(p_package->'menus') menu(value)
  cross join lateral jsonb_array_elements(menu.value->'sections') section(value)
  cross join lateral jsonb_array_elements(section.value->'items') item(value);

  if v_nested_section_count <> 165 or v_nested_item_count <> 881 then
    raise exception using errcode = '22023', message = 'Data Ops nested counts mismatch';
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_package->'menus') row(value)
    where not (value ?& array[
        'id', 'venueSlug', 'title', 'version', 'status', 'completeness',
        'sourceUrl', 'sourceLabel', 'capturedAt', 'verifiedAt', 'sections'
      ])
      or coalesce(value->>'id', '') !~ '^menu-[0-9a-f]{24}$'
      or (value->>'version')::integer <> 1
      or value->>'status' <> 'draft'
      or value->>'completeness' not in ('full', 'partial')
      or value->'verifiedAt' is distinct from 'null'::jsonb
      or value->>'sourceUrl' !~ '^https://'
      or jsonb_typeof(value->'sections') <> 'array'
  ) or exists (
    select 1 from jsonb_array_elements(p_package->'capabilities') row(value)
    where not (value ?& array[
        'id', 'venueSlug', 'kind', 'provider', 'version', 'url', 'status',
        'priority', 'confirmationRequired', 'sourceUrl', 'sourceLabel',
        'capturedAt', 'verifiedAt'
      ])
      or coalesce(value->>'id', '') !~ '^capability-[0-9a-f]{24}$'
      or (value->>'version')::integer <> 1
      or value->>'status' <> 'draft'
      or value->>'kind' = 'maps'
      or value->'verifiedAt' is distinct from 'null'::jsonb
      or value->>'url' !~ '^https://'
      or value->>'sourceUrl' !~ '^https://'
  ) then
    raise exception using errcode = '22023', message = 'Data Ops candidate safety invariant failed';
  end if;

  if (select count(distinct value->>'id') from jsonb_array_elements(p_package->'menus') row(value)) <> 127
    or (select count(distinct value->>'id') from jsonb_array_elements(p_package->'capabilities') row(value)) <> 250
  then
    raise exception using errcode = '22023', message = 'Data Ops candidate IDs are not unique';
  end if;

  -- Idempotency is evaluated only after the caller proves it still holds the
  -- exact reviewed package. A bad payload must never receive a successful
  -- "already imported" response merely because the ledger row exists.
  if exists (
    select 1 from public.data_ops_import_runs
    where package_digest = v_expected_package_digest
  ) then
    return (
      select jsonb_build_object(
        'ok', true,
        'alreadyImported', true,
        'packageDigest', package_digest,
        'menus', menus_count,
        'sections', sections_count,
        'items', items_count,
        'capabilities', capabilities_count,
        'venueMapsNotApplied', maps_candidates_not_applied
      )
      from public.data_ops_import_runs
      where package_digest = v_expected_package_digest
    );
  end if;

  if exists (
    select candidate.venue_slug
    from (
      select value->>'venueSlug' as venue_slug
      from jsonb_array_elements(p_package->'menus') row(value)
      union
      select value->>'venueSlug' as venue_slug
      from jsonb_array_elements(p_package->'capabilities') row(value)
    ) candidate
    left join public.venues venue on venue.slug = candidate.venue_slug
    where venue.slug is null
  ) then
    raise exception using errcode = '23503', message = 'Data Ops package references a missing venue';
  end if;

  if exists (select 1 from public.menus)
    or exists (select 1 from public.menu_sections)
    or exists (select 1 from public.menu_items)
  then
    raise exception using errcode = '55000', message = 'Data Ops menu target is not empty';
  end if;

  -- Migration 0032 may have created narrowly-scoped, evidence-backed
  -- compatibility actions before this package is imported. Preserve exactly
  -- those rows; reject every other pre-existing action shape.
  if exists (
    select 1
    from public.venue_action_capabilities action
    join public.venues venue on venue.slug = action.venue_slug
    left join public.districts district on district.slug = venue.district
    where (
      action.version = 1
      and action.status = 'confirmed'
      and action.replaces_capability_id is null
      and action.captured_at = venue.last_verified_at::timestamptz
      and action.verified_at = venue.last_verified_at::timestamptz
      and (
        (
          action.kind = 'reserve'
          and action.provider = 'tablepilot'
          and action.url = 'https://tablepilot-id.vercel.app/book/'
            || venue.tablepilot_slug || '?source=bali_privilege'
          and action.label = 'Reserve with TablePilot'
          and action.priority = 10
          and action.confirmation_required
          and action.source_url = coalesce(
            venue.official_url, 'https://tablepilot-id.vercel.app/'
          )
          and action.source_label = 'Verified venue / TablePilot connection'
          and action.expires_at = venue.last_verified_at::timestamptz + interval '30 days'
          and venue.publication_status = 'published'
          and district.status = 'active_deep'
          and district.monetization_enabled
        )
        or (
          action.kind = 'whatsapp'
          and action.provider = 'whatsapp'
          and action.url = 'https://wa.me/'
            || regexp_replace(venue.whatsapp, '[^0-9]', '', 'g')
          and action.label = 'Message venue'
          and action.priority = 80
          and not action.confirmation_required
          and action.source_url = coalesce(venue.official_url, venue.gmaps_url)
          and action.source_label = 'Verified official venue contact'
          and action.expires_at = venue.last_verified_at::timestamptz + interval '60 days'
          and venue.publication_status = 'published'
        )
      )
    ) is not true
  ) then
    raise exception using errcode = '55000', message = 'Data Ops action target contains an unapproved pre-existing row';
  end if;

  for v_menu in select value from jsonb_array_elements(p_package->'menus') row(value)
  loop
    v_menu_id := md5('otherbali:dataops:menu:' || (v_menu->>'id'))::uuid;
    insert into public.menus(
      id, venue_slug, title, version, status, completeness, source_url,
      source_label, captured_at, verified_at, expires_at
    ) values (
      v_menu_id,
      v_menu->>'venueSlug',
      v_menu->>'title',
      (v_menu->>'version')::integer,
      'draft',
      v_menu->>'completeness',
      v_menu->>'sourceUrl',
      v_menu->>'sourceLabel',
      (v_menu->>'capturedAt')::timestamptz,
      null,
      nullif(v_menu->>'expiresAt', '')::timestamptz
    );
    v_menu_count := v_menu_count + 1;

    for v_section in select value from jsonb_array_elements(v_menu->'sections') row(value)
    loop
      if coalesce(v_section->>'id', '') !~ '^section-[0-9a-f]{24}$'
        or jsonb_typeof(v_section->'items') <> 'array'
      then
        raise exception using errcode = '22023', message = 'Invalid Data Ops section ID';
      end if;
      v_section_id := md5('otherbali:dataops:section:' || (v_section->>'id'))::uuid;
      insert into public.menu_sections(
        id, menu_id, name, description, position
      ) values (
        v_section_id,
        v_menu_id,
        v_section->>'name',
        v_section->>'description',
        (v_section->>'position')::integer
      );
      v_section_count := v_section_count + 1;

      for v_item in select value from jsonb_array_elements(v_section->'items') row(value)
      loop
        if coalesce(v_item->>'id', '') !~ '^item-[0-9a-f]{24}$' then
          raise exception using errcode = '22023', message = 'Invalid Data Ops item ID';
        end if;
        insert into public.menu_items(
          id, menu_id, section_id, name, description, price_minor, currency,
          price_text, dietary_tags, verified_allergen_tags,
          partner_recommended, availability_note, position
        ) values (
          md5('otherbali:dataops:item:' || (v_item->>'id'))::uuid,
          v_menu_id,
          v_section_id,
          v_item->>'name',
          v_item->>'description',
          (v_item->>'priceMinor')::bigint,
          v_item->>'currency',
          coalesce(v_item->>'priceText', v_item->>'sourceDisplayPrice'),
          array(select jsonb_array_elements_text(coalesce(v_item->'dietaryTags', '[]'::jsonb))),
          array(select jsonb_array_elements_text(coalesce(v_item->'verifiedAllergenTags', '[]'::jsonb))),
          coalesce((v_item->>'partnerRecommended')::boolean, false),
          v_item->>'availabilityNote',
          (v_item->>'position')::integer
        );
        v_item_count := v_item_count + 1;
      end loop;
    end loop;
  end loop;

  for v_capability in select value from jsonb_array_elements(p_package->'capabilities') row(value)
  loop
    select coalesce(max(version), 0) + 1 into v_capability_version
    from public.venue_action_capabilities
    where venue_slug = v_capability->>'venueSlug'
      and kind = v_capability->>'kind'
      and provider = v_capability->>'provider';

    v_capability_version := greatest(
      (v_capability->>'version')::integer,
      v_capability_version
    );

    select id into v_replaces_capability_id
    from public.venue_action_capabilities
    where venue_slug = v_capability->>'venueSlug'
      and kind = v_capability->>'kind'
      and provider = v_capability->>'provider'
      and status = 'confirmed'
    order by version desc
    limit 1;

    insert into public.venue_action_capabilities(
      id, venue_slug, kind, provider, version, replaces_capability_id, url,
      label, status, priority, confirmation_required, source_url, source_label,
      captured_at, verified_at, expires_at
    ) values (
      md5('otherbali:dataops:capability:' || (v_capability->>'id'))::uuid,
      v_capability->>'venueSlug',
      v_capability->>'kind',
      v_capability->>'provider',
      v_capability_version,
      v_replaces_capability_id,
      v_capability->>'url',
      v_capability->>'label',
      'draft',
      (v_capability->>'priority')::integer,
      (v_capability->>'confirmationRequired')::boolean,
      v_capability->>'sourceUrl',
      v_capability->>'sourceLabel',
      (v_capability->>'capturedAt')::timestamptz,
      null,
      nullif(v_capability->>'expiresAt', '')::timestamptz
    );
    v_capability_count := v_capability_count + 1;
  end loop;

  if v_menu_count <> 127
    or v_section_count <> 165
    or v_item_count <> 881
    or v_capability_count <> 250
  then
    raise exception using errcode = '22023', message = 'Data Ops inserted counts mismatch';
  end if;

  insert into public.data_ops_import_runs(
    package_digest, input_digest, menus_count, sections_count, items_count,
    capabilities_count, maps_candidates_not_applied, applied_by
  ) values (
    v_expected_package_digest, v_expected_input_digest, v_menu_count,
    v_section_count, v_item_count, v_capability_count, 50, auth.role()
  );

  return jsonb_build_object(
    'ok', true,
    'alreadyImported', false,
    'packageDigest', v_expected_package_digest,
    'menus', v_menu_count,
    'sections', v_section_count,
    'items', v_item_count,
    'capabilities', v_capability_count,
    'venueMapsNotApplied', 50
  );
end;
$$;

revoke all on function public.import_data_ops_package(jsonb)
  from public, anon, authenticated;
grant execute on function public.import_data_ops_package(jsonb) to service_role;

commit;
