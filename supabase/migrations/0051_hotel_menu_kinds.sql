-- 0051_hotel_menu_kinds.sql
-- Let a single venue carry more than one published menu at once, distinguished
-- by `kind` (a hotel's rooms / dining / spa / day-pass menus). Additive only,
-- no new domain entity (guardrail #13) -- `kind` is a column on the existing,
-- approved `menus` table.
--
-- publish_menu_version is SECURITY DEFINER and the sole path that flips a menu
-- to 'published' for EVERY venue already in the catalogue, not just hotels --
-- so this migration reproduces its 0032 body VERBATIM, changing ONLY:
--   (a) the auto-archive-on-publish UPDATE now scopes "archive the previously
--       published menu for this venue" to the SAME kind, so publishing a
--       hotel's new 'rooms' menu does not archive its already-published
--       'food' (dining) menu -- before this column existed, one venue could
--       only ever have one published menu, period;
--   (b) the advisory-lock key now includes kind, so concurrent publishes of
--       DIFFERENT kinds for the same venue don't serialize on each other
--       unnecessarily (the row-level "for update" lock a few lines down is
--       intentionally left scoped to the whole venue, not narrowed to kind --
--       over-locking there is conservative/safe, not a correctness bug).
-- Every other guard (service_role-only, status='review', completeness='full',
-- verified_at/expires_at/freshness, is_publishable_evidence_url, parent venue
-- published, non-empty menu) is unchanged.
--
-- menus.version stays a per-venue counter across ALL kinds (unique(venue_slug,
-- version) is untouched) -- create_partner_menu_draft already allocates
-- max(version)+1 globally per venue, not per kind, so a venue with 4 menus of
-- different kinds simply gets versions 1,2,3,4 in creation order. This
-- migration does not add partner self-serve authoring for non-food kinds
-- (create_partner_menu_draft is untouched) -- hotel menus remain
-- operator-authored via direct SQL for now, same as venues themselves
-- (0039/0041/0046); self-serve rooms/spa/day-pass authoring is a separate,
-- later decision.
--
-- Must run after 0032. Idempotent (add-column-if-not-exists / guarded
-- constraint / drop+recreate index / create-or-replace function).

begin;

alter table public.menus
  add column if not exists kind text not null default 'food';
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.menus'::regclass
      and conname = 'menus_kind_check'
  ) then
    alter table public.menus add constraint menus_kind_check
      check (kind in ('food','rooms','spa','day_pass'));
  end if;
end;
$$;

comment on column public.menus.kind is
  'Which facility this menu covers: food (default -- dining, the original '
  'menu type), rooms, spa, or day_pass. One published menu per (venue_slug, '
  'kind) -- see menus_one_published_per_venue_idx below.';

-- Was unique per venue_slug (one published menu, period); now scoped to
-- (venue_slug, kind) so a hotel can have a published rooms menu AND a
-- published dining menu AND a published spa menu at the same time, while
-- still allowing at most one published menu of any given kind per venue.
drop index if exists public.menus_one_published_per_venue_idx;
create unique index if not exists menus_one_published_per_venue_kind_idx
  on public.menus(venue_slug, kind) where status = 'published';

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
    hashtextextended('menu-publish:' || v_menu.venue_slug || ':' || v_menu.kind, 0)
  );
  perform 1
  from public.menus
  where venue_slug = v_menu.venue_slug
  for update;

  update public.menus
  set status = 'archived', updated_at = now()
  where venue_slug = v_menu.venue_slug
    and kind = v_menu.kind
    and status = 'published'
    and id <> p_menu_id;

  update public.menus
  set status = 'published', updated_at = now()
  where id = p_menu_id;

  return jsonb_build_object('ok', true);
end;
$$;

-- CREATE OR REPLACE on an unchanged signature (uuid) preserves existing
-- grants, but re-asserting them here matches this repo's own convention
-- (cf. 0044) and costs nothing.
revoke all on function public.publish_menu_version(uuid)
  from public, anon, authenticated;
grant execute on function public.publish_menu_version(uuid) to service_role;

commit;
