-- DRAFT ONLY — DO NOT APPLY (IA spec v1 Phase 2 §17.2).
-- README.md: migration history 0015–0019 is duplicated and must be reconciled
-- against live Supabase history before ANY new schema lands. This file
-- deliberately lives in docs/sql-drafts/, not supabase/migrations/, so no
-- tooling can pick it up by accident. After reconciliation it becomes a
-- numbered migration verbatim.
--
-- Model (IA spec §7-8): hospitality_properties → venues.parent_property_id →
-- hospitality_offers; experiences stand alone with a provider. [NO DATA] is
-- represented as NULL + explicit *_status enums, never as text.

create table if not exists public.hospitality_properties (
  id                text primary key,
  slug              text unique not null,
  name              text not null,
  property_type     text not null check (property_type in ('hotel','resort')),
  district          text not null references public.districts(slug),
  area              text,
  star_rating       int check (star_rating in (4,5)),
  official_url      text check (official_url is null or official_url ~ '^https://'),
  instagram_url     text check (instagram_url is null or instagram_url ~ '^https://'),
  google_maps_url   text check (google_maps_url is null or google_maps_url ~ '^https://'),
  status            text not null default 'review'
                    check (status in ('active','inactive','review')),
  publication_status text not null default 'review'
                    check (publication_status in ('published','review')),
  last_verified_at  timestamptz,
  created_at        timestamptz not null default now()
);

-- Venue → parent property (additive, nullable — compatible with every
-- existing venue row; hotel restaurants keep living in venues/`/places/[slug]`).
alter table public.venues
  add column if not exists parent_property_id text
    references public.hospitality_properties(id);
alter table public.venues
  add column if not exists open_to_non_guests boolean; -- null = not verified

create table if not exists public.hospitality_offers (
  id                 text primary key,
  slug               text unique not null,
  offer_type         text not null
                     check (offer_type in ('day_pass','brunch','pool_day_use','spa_package')),
  name               text not null,
  property_id        text references public.hospitality_properties(id),
  venue_slug         text references public.venues(slug),
  district           text not null references public.districts(slug),
  currency           text check (currency in ('IDR','USD')),
  price_minor        bigint check (price_minor is null or price_minor >= 0),
  price_min_minor    bigint,
  price_max_minor    bigint,
  price_text         text,
  price_status       text not null default 'not_published'
                     check (price_status in ('verified','not_published','call_to_confirm','stale')),
  whats_included     text,
  schedule_text      text,
  hours_text         text,
  open_to_non_guests boolean not null default true,
  booking_channel    text,
  booking_url        text check (booking_url is null or booking_url ~ '^https://'),
  audience_tags      text[] not null default '{}',
  editorial_note     text,
  source_type        text check (source_type in ('official','aggregator','booking_system','editorial_guide')),
  source_url         text check (source_url is null or source_url ~ '^https://'),
  accessed_at        date,
  price_verified_at  date,
  last_verified_at   timestamptz,
  availability_status text not null default 'review'
                     check (availability_status in ('active','seasonal','call_to_confirm','unavailable','review')),
  monetization_mode  text not null default 'coverage'
                     check (monetization_mode in ('seated','coverage')), -- internal only
  publication_status text not null default 'review'
                     check (publication_status in ('published','review')),
  created_at         timestamptz not null default now()
);
create index if not exists hospitality_offers_district_type_idx
  on public.hospitality_offers(district, offer_type);
create index if not exists hospitality_offers_property_idx
  on public.hospitality_offers(property_id);

create table if not exists public.experiences (
  id                 text primary key,
  slug               text unique not null,
  title              text not null,
  experience_type    text not null,
  provider_name      text not null,
  provider_url       text check (provider_url is null or provider_url ~ '^https://'),
  district           text references public.districts(slug),
  departure_areas    text[] not null default '{}',
  duration_text      text,
  format             text not null default 'both' check (format in ('private','group','both')),
  price_text         text,
  currency           text check (currency in ('IDR','USD')),
  whats_included     text,
  exclusions         text,
  pickup_text        text,
  booking_channel    text,
  booking_url        text check (booking_url is null or booking_url ~ '^https://'),
  audience_tags      text[] not null default '{}',
  editorial_note     text,
  source_url         text check (source_url is null or source_url ~ '^https://'),
  source_type        text,
  accessed_at        date,
  last_verified_at   timestamptz,
  publication_status text not null default 'review'
                     check (publication_status in ('published','review')),
  created_at         timestamptz not null default now()
);

-- RLS: public read of published rows only; writes via service role/operator
-- RPCs (same posture as venues).
alter table public.hospitality_properties enable row level security;
alter table public.hospitality_offers     enable row level security;
alter table public.experiences            enable row level security;

drop policy if exists "public read published properties" on public.hospitality_properties;
create policy "public read published properties" on public.hospitality_properties
  for select using (status = 'active' and publication_status = 'published');

drop policy if exists "public read published offers" on public.hospitality_offers;
create policy "public read published offers" on public.hospitality_offers
  for select using (publication_status = 'published');

drop policy if exists "public read published experiences" on public.experiences;
create policy "public read published experiences" on public.experiences
  for select using (publication_status = 'published');

-- Evidence extension: reuse venue_fact_sources' shape for offers/experiences
-- (source_url/source_type/accessed_at live inline above; full per-fact
-- evidence rows follow the existing venue_fact_sources pattern when the
-- migration lands — no parallel evidence system).
