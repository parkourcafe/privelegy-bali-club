-- C-04 additive venue normalization foundation.
--
-- This migration deliberately keeps every legacy column and public path. Only
-- unambiguous legacy values are copied. Ambiguous geography, price prose,
-- jobs/occasions and photo rights remain review work; they are never invented.

begin;

alter table public.venues add column if not exists venue_type text;
alter table public.venues add column if not exists subarea text;
alter table public.venues add column if not exists full_address text;
alter table public.venues add column if not exists latitude double precision;
alter table public.venues add column if not exists longitude double precision;
alter table public.venues add column if not exists google_place_id text;
alter table public.venues add column if not exists price_min_idr bigint;
alter table public.venues add column if not exists price_max_idr bigint;
alter table public.venues add column if not exists price_band text;
alter table public.venues add column if not exists opening_hours_json jsonb;
alter table public.venues add column if not exists verified_at timestamptz;
alter table public.venues add column if not exists verification_source text;
alter table public.venues add column if not exists editorial_status text;
alter table public.venues add column if not exists occasions text[] not null default '{}';
alter table public.venues add column if not exists meal_periods text[] not null default '{}';
alter table public.venues add column if not exists photo_status text;

alter table public.venues alter column editorial_status set default 'review';
alter table public.venues alter column photo_status set default 'missing';

-- Deterministic compatibility backfill. No price range is parsed from prose,
-- no occasion is inferred from category/jobs and no no-photo approval is
-- manufactured.
update public.venues
set venue_type = category
where venue_type is null
  and category in (
    'bar','beach_club','beauty','cafe','fitness',
    'restaurant','spa','surf','warung','yoga'
  );

update public.venues
set full_address = nullif(btrim(address), '')
where full_address is null
  and nullif(btrim(address), '') is not null;

update public.venues
set subarea = nullif(btrim(area), '')
where subarea is null
  and nullif(btrim(area), '') is not null
  and area !~ '/';

update public.venues
set verified_at = last_verified_at::timestamp at time zone 'UTC'
where verified_at is null
  and last_verified_at is not null;

update public.venues venue
set verification_source = 'venue_fact_sources'
where venue.verification_source is null
  and venue.verified_at is not null
  and exists (
    select 1
    from public.venue_fact_sources source
    where source.venue_slug = venue.slug
      and source.status = 'VERIFIED'
  );

update public.venues venue
set opening_hours_json = to_jsonb(venue.opening_hours)
where venue.opening_hours_json is null
  and nullif(btrim(venue.opening_hours), '') is not null
  and exists (
    select 1
    from public.venue_fact_sources source
    where source.venue_slug = venue.slug
      and source.field_name = 'opening_hours'
      and source.status = 'VERIFIED'
  );

update public.venues
set editorial_status = case
  when publication_status = 'review' then 'review'
  when publication_status = 'published'
    and verified_at is not null
    and nullif(btrim(verification_source), '') is not null
    then 'published'
  else 'review'
end
where editorial_status is null;

update public.venues
set photo_status = case
  when nullif(btrim(photo_url), '') is null then 'missing'
  else 'needs_verification'
end
where photo_status is null;

do $constraints$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venues'::regclass
      and conname = 'venues_venue_type_check'
  ) then
    alter table public.venues add constraint venues_venue_type_check check (
      venue_type is null or venue_type in (
        'bar','beach_club','beauty','cafe','fitness',
        'restaurant','spa','surf','warung','yoga'
      )
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venues'::regclass
      and conname = 'venues_coordinates_check'
  ) then
    alter table public.venues add constraint venues_coordinates_check check (
      (latitude is null and longitude is null)
      or (
        latitude between -90 and 90
        and longitude between -180 and 180
      )
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venues'::regclass
      and conname = 'venues_google_place_id_check'
  ) then
    alter table public.venues add constraint venues_google_place_id_check check (
      google_place_id is null
      or google_place_id ~ '^[A-Za-z0-9_-]{8,255}$'
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venues'::regclass
      and conname = 'venues_price_range_check'
  ) then
    alter table public.venues add constraint venues_price_range_check check (
      (price_min_idr is null or price_min_idr >= 0)
      and (price_max_idr is null or price_max_idr >= 0)
      and (
        price_min_idr is null
        or price_max_idr is null
        or price_min_idr <= price_max_idr
      )
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venues'::regclass
      and conname = 'venues_price_band_normalized_check'
  ) then
    alter table public.venues add constraint venues_price_band_normalized_check check (
      price_band is null or price_band in ('$', '$$', '$$$', '$$$$')
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venues'::regclass
      and conname = 'venues_verification_source_check'
  ) then
    alter table public.venues add constraint venues_verification_source_check check (
      verification_source is null
      or length(btrim(verification_source)) between 1 and 500
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venues'::regclass
      and conname = 'venues_editorial_status_check'
  ) then
    alter table public.venues add constraint venues_editorial_status_check check (
      editorial_status is null
      or editorial_status in ('draft','review','published','archived')
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venues'::regclass
      and conname = 'venues_published_requires_verification_check'
  ) then
    alter table public.venues add constraint venues_published_requires_verification_check check (
      editorial_status is distinct from 'published'
      or (
        verified_at is not null
        and nullif(btrim(verification_source), '') is not null
      )
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venues'::regclass
      and conname = 'venues_meal_periods_check'
  ) then
    alter table public.venues add constraint venues_meal_periods_check check (
      meal_periods <@ array[
        'breakfast','brunch','lunch','dinner','late_night','all_day'
      ]::text[]
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venues'::regclass
      and conname = 'venues_photo_status_check'
  ) then
    alter table public.venues add constraint venues_photo_status_check check (
      photo_status is null or photo_status in (
        'missing','needs_verification','approved_no_photo',
        'approved','published','rejected'
      )
    ) not valid;
  end if;
end
$constraints$;

alter table public.venues validate constraint venues_venue_type_check;
alter table public.venues validate constraint venues_coordinates_check;
alter table public.venues validate constraint venues_google_place_id_check;
alter table public.venues validate constraint venues_price_range_check;
alter table public.venues validate constraint venues_price_band_normalized_check;
alter table public.venues validate constraint venues_verification_source_check;
alter table public.venues validate constraint venues_editorial_status_check;
alter table public.venues validate constraint venues_published_requires_verification_check;
alter table public.venues validate constraint venues_meal_periods_check;
alter table public.venues validate constraint venues_photo_status_check;

create table if not exists public.venue_photos (
  id uuid primary key default gen_random_uuid(),
  venue_id text not null references public.venues(id) on delete cascade,
  storage_path text,
  source_url text,
  rights_basis text,
  rights_holder text,
  credit_line text,
  alt_text text,
  is_primary boolean not null default false,
  width integer,
  height integer,
  verified_at timestamptz,
  status text not null default 'review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $photo_constraints$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venue_photos'::regclass
      and conname = 'venue_photos_source_check'
  ) then
    alter table public.venue_photos add constraint venue_photos_source_check check (
      nullif(btrim(storage_path), '') is not null
      or nullif(btrim(source_url), '') is not null
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venue_photos'::regclass
      and conname = 'venue_photos_source_url_check'
  ) then
    alter table public.venue_photos add constraint venue_photos_source_url_check check (
      source_url is null or source_url ~ '^https://'
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venue_photos'::regclass
      and conname = 'venue_photos_storage_path_check'
  ) then
    alter table public.venue_photos add constraint venue_photos_storage_path_check check (
      storage_path is null
      or (
        storage_path !~ '(^/|(^|/)\.\.(/|$))'
        and length(storage_path) <= 500
      )
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venue_photos'::regclass
      and conname = 'venue_photos_dimensions_check'
  ) then
    alter table public.venue_photos add constraint venue_photos_dimensions_check check (
      (width is null and height is null)
      or (width > 0 and height > 0)
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venue_photos'::regclass
      and conname = 'venue_photos_status_check'
  ) then
    alter table public.venue_photos add constraint venue_photos_status_check check (
      status in ('review','approved','published','archived','rejected')
    ) not valid;
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.venue_photos'::regclass
      and conname = 'venue_photos_published_evidence_check'
  ) then
    alter table public.venue_photos add constraint venue_photos_published_evidence_check check (
      status <> 'published'
      or (
        verified_at is not null
        and nullif(btrim(rights_basis), '') is not null
        and nullif(btrim(rights_holder), '') is not null
      )
    ) not valid;
  end if;
end
$photo_constraints$;

alter table public.venue_photos validate constraint venue_photos_source_check;
alter table public.venue_photos validate constraint venue_photos_source_url_check;
alter table public.venue_photos validate constraint venue_photos_storage_path_check;
alter table public.venue_photos validate constraint venue_photos_dimensions_check;
alter table public.venue_photos validate constraint venue_photos_status_check;
alter table public.venue_photos validate constraint venue_photos_published_evidence_check;

create index if not exists venue_photos_venue_idx
  on public.venue_photos(venue_id);
create unique index if not exists venue_photos_one_primary_idx
  on public.venue_photos(venue_id)
  where is_primary;

alter table public.venue_photos enable row level security;
alter table public.venue_photos force row level security;
revoke all on table public.venue_photos from public, anon, authenticated;
grant select, insert, update, delete on table public.venue_photos to service_role;

grant select (
  venue_type, subarea, full_address, latitude, longitude, google_place_id,
  price_min_idr, price_max_idr, price_band, opening_hours_json, verified_at,
  verification_source, editorial_status, occasions, meal_periods, photo_status
) on public.venues to anon, authenticated;

-- Service-only report for values that cannot be migrated without editorial or
-- provenance judgement.
create or replace function public.venue_model_backfill_review()
returns table (
  venue_slug text,
  field_name text,
  legacy_value text,
  reason text
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;

  return query
  select venue.slug, 'venue_type', venue.category,
    'legacy category is outside the approved venue taxonomy'
  from public.venues venue
  where venue.venue_type is null
    and nullif(btrim(venue.category), '') is not null
  union all
  select venue.slug, 'subarea', venue.area,
    'legacy area contains multiple slash-delimited candidates'
  from public.venues venue
  where venue.subarea is null
    and venue.area ~ '/'
  union all
  select venue.slug, 'verified_at', venue.publication_status,
    'legacy published row has no recorded verification timestamp'
  from public.venues venue
  where venue.publication_status = 'published'
    and venue.verified_at is null
  union all
  select venue.slug, 'verification_source', venue.verified_at::text,
    'verification timestamp exists without a machine-readable source pointer'
  from public.venues venue
  where venue.verified_at is not null
    and venue.verification_source is null
  union all
  select venue.slug, 'occasions', array_to_string(venue.jobs, ','),
    'legacy jobs require editorial classification before becoming occasions'
  from public.venues venue
  where coalesce(array_length(venue.jobs, 1), 0) > 0
    and coalesce(array_length(venue.occasions, 1), 0) = 0
  union all
  select venue.slug, 'photo_status', venue.photo_url,
    'legacy photo URL has no exact rights record in venue_photos'
  from public.venues venue
  where nullif(btrim(venue.photo_url), '') is not null
    and venue.photo_status = 'needs_verification'
  order by 1, 2;
end;
$$;

revoke all on function public.venue_model_backfill_review()
  from public, anon, authenticated;
grant execute on function public.venue_model_backfill_review()
  to service_role;

comment on table public.venue_photos is
  'Private canonical venue-photo evidence. No public read until exact rights and publication policy are exposed through a safe boundary.';
comment on column public.venues.price_anchor is
  'Legacy display fallback retained during C-04 migration; never parsed into numeric prices without source evidence.';
comment on function public.venue_model_backfill_review() is
  'Service-only deterministic C-04 manual-review report; it never mutates venue data.';

commit;
