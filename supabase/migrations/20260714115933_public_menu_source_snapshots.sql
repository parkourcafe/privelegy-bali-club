-- Public, explicitly unverified partial menu snapshots.
--
-- `published` keeps its existing meaning: a full, operator-verified menu.
-- `source_snapshot` is a separate public state for a partial transcription of
-- a named source. It is time-bounded, immutable while public and never gains a
-- verification timestamp as a side effect of publication.

begin;

alter table public.menus drop constraint if exists menus_status_check;
alter table public.menus add constraint menus_status_check
  check (status in (
    'draft', 'review', 'source_snapshot', 'published', 'archived'
  ));

alter table public.menus
  add column if not exists source_snapshot_published_at timestamptz;

-- Both publication RPCs are SECURITY INVOKER and service-only. Make their
-- read dependency on venue publication state explicit instead of relying on
-- project-wide default privileges.
grant select on table public.venues to service_role;

alter table public.menus
  drop constraint if exists menus_source_snapshot_shape_check;
alter table public.menus add constraint menus_source_snapshot_shape_check
  check (
    status <> 'source_snapshot'
    or (
      completeness = 'partial'
      and verified_at is null
      and source_snapshot_published_at is not null
      and source_snapshot_published_at >= captured_at
      and expires_at is not null
      and expires_at > captured_at
      and public.is_publishable_evidence_url(source_url)
    )
  );

alter table public.menus
  drop constraint if exists menus_source_snapshot_marker_check;
alter table public.menus add constraint menus_source_snapshot_marker_check
  check (
    source_snapshot_published_at is null
    or status in ('source_snapshot', 'archived')
  );

-- There must never be two public menu representations for one venue. A later
-- verified full menu replaces and archives the public source snapshot.
drop index if exists public.menus_one_published_per_venue_idx;
create unique index if not exists menus_one_public_per_venue_idx
  on public.menus(venue_slug)
  where status in ('source_snapshot', 'published');

-- Once either a verified menu or a source snapshot is public, its evidence is
-- immutable. Lifecycle status and updated_at may still change so an operator
-- can archive it without rewriting the captured facts.
create or replace function public.protect_verified_menu_record()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    if old.verified_at is not null
      or old.source_snapshot_published_at is not null then
      raise exception 'public menu snapshots cannot be deleted';
    end if;
    return old;
  end if;

  if (
    old.verified_at is not null
    or old.source_snapshot_published_at is not null
  ) and row(
    new.venue_slug, new.title, new.version, new.completeness,
    new.source_url, new.source_label,
    new.captured_at, new.verified_at, new.expires_at, new.created_at,
    new.source_snapshot_published_at
  ) is distinct from row(
    old.venue_slug, old.title, old.version, old.completeness,
    old.source_url, old.source_label,
    old.captured_at, old.verified_at, old.expires_at, old.created_at,
    old.source_snapshot_published_at
  ) then
    raise exception 'public menu snapshot evidence is immutable';
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
      and (
        m.verified_at is not null
        or m.source_snapshot_published_at is not null
      )
  ) then
    raise exception 'public menu snapshot content is immutable';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

-- Defense in depth for direct service-role writes: a source snapshot cannot
-- enter its public state without a publishable parent and at least one item.
create or replace function public.validate_source_snapshot_transition()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.status <> 'source_snapshot' then
    return new;
  end if;

  if new.completeness <> 'partial'
    or new.verified_at is not null
    or new.source_snapshot_published_at is null
    or new.expires_at is null
    or new.expires_at <= now()
    or not public.is_publishable_evidence_url(new.source_url)
  then
    raise exception 'source snapshot is not publishable';
  end if;

  if not exists (
    select 1
    from public.venues v
    where v.slug = new.venue_slug
      and v.status = 'active'
  ) then
    raise exception 'source snapshot parent is not publishable';
  end if;

  if not exists (
    select 1
    from public.menu_sections s
    join public.menu_items i
      on i.section_id = s.id and i.menu_id = s.menu_id
    where s.menu_id = new.id
  ) then
    raise exception 'source snapshot cannot be empty';
  end if;

  if exists (
    select 1
    from public.menu_items i
    where i.menu_id = new.id
      and (
        coalesce(cardinality(i.dietary_tags), 0) > 0
        or coalesce(cardinality(i.verified_allergen_tags), 0) > 0
        or i.partner_recommended
        or i.editorial_pick
        or i.editorial_note is not null
      )
  ) then
    raise exception 'source snapshot contains unverified signals';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_source_snapshot_transition_trigger
  on public.menus;
create trigger validate_source_snapshot_transition_trigger
before insert or update of status, completeness, verified_at, expires_at,
  source_url, venue_slug
on public.menus
for each row execute function public.validate_source_snapshot_transition();

-- The normal venues RLS deliberately hides review-only place profiles. Menu
-- snapshots need a narrower parent check: confirm only that their referenced
-- venue is still active, without making that venue row publicly selectable.
-- Keep the SECURITY DEFINER helper outside the exposed public schema. It
-- returns true only for an otherwise-public snapshot UUID, so its narrowly
-- granted EXECUTE permission is not a general venue lookup oracle.
create schema if not exists menu_security;
revoke all on schema menu_security from public;
grant usage on schema menu_security to anon, authenticated, service_role;

drop function if exists public.is_active_source_snapshot_parent(uuid);
create or replace function menu_security.is_active_source_snapshot_parent(
  p_menu_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, pg_temp
as $$
  select exists (
    select 1
    from public.menus m
    join public.venues v on v.slug = m.venue_slug
    where m.id = p_menu_id
      and m.status = 'source_snapshot'
      and m.completeness = 'partial'
      and m.verified_at is null
      and m.source_snapshot_published_at is not null
      and m.expires_at > now()
      and v.status = 'active'
  );
$$;

revoke all on function menu_security.is_active_source_snapshot_parent(uuid)
  from public, anon, authenticated;
grant execute on function menu_security.is_active_source_snapshot_parent(uuid)
  to anon, authenticated, service_role;

-- Anonymous and authenticated readers may see either a fresh verified full
-- menu or a fresh, explicitly partial and unverified source snapshot. Drafts,
-- reviews and expired rows remain invisible. Verified menus require a public
-- venue profile; source snapshots require only an existing active venue so a
-- dedicated /menus route need not expose an unreviewed /places profile.
drop policy if exists "public read fresh published menus" on public.menus;
create policy "public read fresh published menus"
on public.menus for select to anon, authenticated
using (
  (
    (
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
    )
    or
    (
      status = 'source_snapshot'
      and completeness = 'partial'
      and verified_at is null
      and source_snapshot_published_at is not null
      and captured_at is not null
      and expires_at > now()
      and menu_security.is_active_source_snapshot_parent(id)
    )
  )
);

drop policy if exists "public read published menu sections"
  on public.menu_sections;
create policy "public read published menu sections"
on public.menu_sections for select to anon, authenticated
using (
  exists (
    select 1
    from public.menus m
    where m.id = menu_id
      and (
        (
          m.status = 'published'
          and m.completeness = 'full'
          and m.verified_at is not null
          and m.captured_at is not null
          and m.expires_at > now()
          and exists (
            select 1
            from public.venues v
            where v.slug = m.venue_slug
              and v.status = 'active'
              and v.publication_status = 'published'
          )
        )
        or
        (
          m.status = 'source_snapshot'
          and m.completeness = 'partial'
          and m.verified_at is null
          and m.source_snapshot_published_at is not null
          and m.captured_at is not null
          and m.expires_at > now()
          and menu_security.is_active_source_snapshot_parent(m.id)
        )
      )
  )
);

drop policy if exists "public read published menu items"
  on public.menu_items;
create policy "public read published menu items"
on public.menu_items for select to anon, authenticated
using (
  exists (
    select 1
    from public.menus m
    where m.id = menu_id
      and (
        (
          m.status = 'published'
          and m.completeness = 'full'
          and m.verified_at is not null
          and m.captured_at is not null
          and m.expires_at > now()
          and exists (
            select 1
            from public.venues v
            where v.slug = m.venue_slug
              and v.status = 'active'
              and v.publication_status = 'published'
          )
        )
        or
        (
          m.status = 'source_snapshot'
          and m.completeness = 'partial'
          and m.verified_at is null
          and m.source_snapshot_published_at is not null
          and m.captured_at is not null
          and m.expires_at > now()
          and menu_security.is_active_source_snapshot_parent(m.id)
        )
      )
  )
);

-- A verified full replacement wins over any public partial snapshot. This is
-- otherwise the same fail-closed publication gate introduced by migration
-- 0032.
create or replace function public.publish_menu_version(p_menu_id uuid)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_menu public.menus%rowtype;
begin
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
    and status in ('source_snapshot', 'published')
    and id <> p_menu_id;

  update public.menus
  set status = 'published', updated_at = now()
  where id = p_menu_id;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.publish_menu_version(uuid)
  from public, anon, authenticated;
grant execute on function public.publish_menu_version(uuid) to service_role;

-- One-time, idempotent activation boundary for the exact reviewed Data Ops
-- package. transaction_timestamp() was used by both imported menu defaults and
-- the package ledger in 0034, so created_at = applied_at identifies the exact
-- atomic import without matching unrelated future drafts.
create or replace function public.publish_data_ops_source_snapshots(
  p_package_digest text
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_expected_digest constant text :=
    'ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081';
  v_applied_at timestamptz;
  v_total_count integer;
  v_section_count integer;
  v_item_count integer;
  v_verified_full_count integer;
  v_candidate_count integer;
  v_public_count integer;
  v_updated_count integer;
begin
  if p_package_digest is distinct from v_expected_digest then
    return jsonb_build_object('ok', false, 'error', 'package_digest_mismatch');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('data-ops-source-snapshots:' || v_expected_digest, 0)
  );

  select applied_at into v_applied_at
  from public.data_ops_import_runs
  where package_digest = v_expected_digest
    and menus_count = 127
    and sections_count = 165
    and items_count = 881
    and capabilities_count = 250
    and maps_candidates_not_applied = 50;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'import_ledger_mismatch');
  end if;

  select count(*) into v_total_count
  from public.menus m
  where m.created_at = v_applied_at;

  if v_total_count <> 127 then
    return jsonb_build_object('ok', false, 'error', 'imported_menu_count_mismatch');
  end if;

  select count(*) into v_section_count
  from public.menu_sections s
  join public.menus m on m.id = s.menu_id
  where m.created_at = v_applied_at;

  select count(*) into v_item_count
  from public.menu_items i
  join public.menus m on m.id = i.menu_id
  where m.created_at = v_applied_at;

  if v_section_count <> 165 or v_item_count <> 881 then
    return jsonb_build_object('ok', false, 'error', 'live_menu_child_count_mismatch');
  end if;

  select count(*) into v_verified_full_count
  from public.menus m
  where m.created_at = v_applied_at
    and m.version = 1
    and m.status = 'published'
    and m.completeness = 'full'
    and m.verified_at is not null
    and m.expires_at > now()
    and public.is_publishable_evidence_url(m.source_url)
    and exists (
      select 1
      from public.venues v
      where v.slug = m.venue_slug
        and v.status = 'active'
        and v.publication_status = 'published'
    )
    and exists (
      select 1
      from public.menu_sections s
      join public.menu_items i
        on i.section_id = s.id and i.menu_id = s.menu_id
      where s.menu_id = m.id
    );

  if v_verified_full_count <> 1 then
    return jsonb_build_object('ok', false, 'error', 'verified_full_menu_precondition_failed');
  end if;

  select count(*) into v_public_count
  from public.menus m
  where m.created_at = v_applied_at
    and m.completeness = 'partial'
    and m.status = 'source_snapshot';

  if v_public_count = 126 then
    if exists (
      select 1
      from public.menus m
      where m.created_at = v_applied_at
        and m.status = 'source_snapshot'
        and (
          m.completeness <> 'partial'
          or m.verified_at is not null
          or m.source_snapshot_published_at is null
          or m.expires_at <= now()
          or not public.is_publishable_evidence_url(m.source_url)
          or not exists (
            select 1
            from public.menu_sections s
            join public.menu_items i
              on i.section_id = s.id and i.menu_id = s.menu_id
            where s.menu_id = m.id
          )
          or not exists (
            select 1
            from public.venues v
            where v.slug = m.venue_slug
              and v.status = 'active'
          )
          or exists (
            select 1
            from public.menu_items i
            where i.menu_id = m.id
              and (
                coalesce(cardinality(i.dietary_tags), 0) > 0
                or coalesce(cardinality(i.verified_allergen_tags), 0) > 0
                or i.partner_recommended
                or i.editorial_pick
                or i.editorial_note is not null
              )
          )
        )
    ) then
      return jsonb_build_object('ok', false, 'error', 'published_source_snapshot_gate_failed');
    end if;
    return jsonb_build_object(
      'ok', true,
      'alreadyPublished', true,
      'packageDigest', v_expected_digest,
      'sourceSnapshots', v_public_count
    );
  elsif v_public_count <> 0 then
    return jsonb_build_object('ok', false, 'error', 'partial_batch_publication');
  end if;

  select count(*) into v_candidate_count
  from public.menus m
  where m.created_at = v_applied_at
    and m.version = 1
    and m.status = 'draft'
    and m.completeness = 'partial'
    and m.verified_at is null;

  if v_candidate_count <> 126 then
    return jsonb_build_object('ok', false, 'error', 'source_snapshot_candidate_mismatch');
  end if;

  if exists (
    select 1
    from public.menus m
    where m.created_at = v_applied_at
      and m.status = 'draft'
      and m.completeness = 'partial'
      and (
        m.verified_at is not null
        or m.captured_at + interval '60 days' <= now()
        or not public.is_publishable_evidence_url(m.source_url)
        or not exists (
          select 1
          from public.menu_sections s
          join public.menu_items i
            on i.section_id = s.id and i.menu_id = s.menu_id
          where s.menu_id = m.id
        )
        or not exists (
          select 1
          from public.venues v
          where v.slug = m.venue_slug
            and v.status = 'active'
        )
        or exists (
          select 1
          from public.menu_items i
          where i.menu_id = m.id
            and (
              coalesce(cardinality(i.dietary_tags), 0) > 0
              or coalesce(cardinality(i.verified_allergen_tags), 0) > 0
              or i.partner_recommended
              or i.editorial_pick
              or i.editorial_note is not null
            )
        )
      )
  ) then
    return jsonb_build_object('ok', false, 'error', 'source_snapshot_gate_failed');
  end if;

  perform 1
  from public.menus m
  where m.created_at = v_applied_at
    and m.status = 'draft'
    and m.completeness = 'partial'
  order by m.id
  for update;

  update public.menus m
  set status = 'source_snapshot',
      source_snapshot_published_at = now(),
      expires_at = m.captured_at + interval '60 days',
      updated_at = now()
  where m.created_at = v_applied_at
    and m.version = 1
    and m.status = 'draft'
    and m.completeness = 'partial'
    and m.verified_at is null;

  get diagnostics v_updated_count = row_count;
  if v_updated_count <> 126 then
    raise exception using
      errcode = '55000',
      message = 'Data Ops source snapshot update was not atomic';
  end if;

  return jsonb_build_object(
    'ok', true,
    'alreadyPublished', false,
    'packageDigest', v_expected_digest,
    'sourceSnapshots', v_updated_count
  );
end;
$$;

revoke all on function public.publish_data_ops_source_snapshots(text)
  from public, anon, authenticated;
grant execute on function public.publish_data_ops_source_snapshots(text)
  to service_role;

-- Activate the exact package when this migration is replayed over the reviewed
-- production import. Clean schema replays have no matching ledger row and stay
-- data-free; repeated production runs are idempotent.
do $activate_reviewed_source_snapshots$
declare
  v_result jsonb;
begin
  if exists (
    select 1
    from public.data_ops_import_runs
    where package_digest =
      'ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081'
  ) then
    v_result := public.publish_data_ops_source_snapshots(
      'ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081'
    );
    if coalesce((v_result->>'ok')::boolean, false) is distinct from true then
      raise exception 'Public menu source snapshot activation failed: %',
        v_result;
    end if;
  end if;
end;
$activate_reviewed_source_snapshots$;

commit;

-- SQL Editor confirmation row. On the reviewed production package this must
-- report 127 public menus: 1 verified full menu and 126 source snapshots.
with reviewed_run as (
  select applied_at
  from public.data_ops_import_runs
  where package_digest =
    'ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081'
), reviewed_menus as (
  select m.*
  from public.menus m
  join reviewed_run r on r.applied_at = m.created_at
)
select jsonb_build_object(
  'ok',
    count(*) filter (where status = 'published') = 1
    and count(*) filter (where status = 'source_snapshot') = 126,
  'verified_full_menus', count(*) filter (where status = 'published'),
  'partial_source_snapshots',
    count(*) filter (where status = 'source_snapshot'),
  'total_public_menus',
    count(*) filter (where status in ('published', 'source_snapshot'))
) as public_menu_coverage
from reviewed_menus;
