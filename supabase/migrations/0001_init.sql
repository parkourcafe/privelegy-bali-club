-- Bali Privilege — initial schema (G0 planning + G1 redemption proof).
-- Two-layer thesis encoded: districts (Bali-wide planning) vs the single
-- active deep district (Canggu) where perks + QR redemption live.
--
-- Privacy posture: guests are anonymous (guest_refs.ref token only). Consent is
-- explicit and append-only (consent_log). Partner-facing reads are aggregate by
-- default — no public SELECT on redemption_events; counts go through the
-- service role in a server route.

create extension if not exists "pgcrypto";

-- ---------- Reference / planning layer (public-readable) ----------

create table if not exists districts (
  slug        text primary key,
  name        text not null,
  is_deep     boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists venues (
  id           text primary key,
  slug         text unique not null,
  name         text not null,
  category     text not null,
  district     text not null references districts(slug),
  address      text,
  gmaps_url    text,
  tier         text not null default 'editorial_seed',
  is_sponsored boolean not null default false,
  status       text not null default 'active',
  created_at   timestamptz not null default now()
);
create index if not exists venues_district_idx on venues(district);

create table if not exists perks (
  id          text primary key,
  venue_slug  text not null references venues(slug) on delete cascade,
  title       text not null,
  terms       text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists perks_venue_idx on perks(venue_slug);

create table if not exists plan_entries (
  id          uuid primary key default gen_random_uuid(),
  district    text not null references districts(slug),
  venue_slug  text not null references venues(slug) on delete cascade,
  slot        text not null check (slot in ('morning','day','sunset','evening')),
  rank        int not null default 100,
  blurb       text,
  created_at  timestamptz not null default now()
);
create index if not exists plan_entries_district_slot_idx on plan_entries(district, slot, rank);

-- ---------- Identity / consent / proof (service-role only) ----------

create table if not exists guest_refs (
  id              uuid primary key default gen_random_uuid(),
  ref             text unique not null,
  first_district  text references districts(slug),
  created_at      timestamptz not null default now()
);

create table if not exists consent_log (
  id            uuid primary key default gen_random_uuid(),
  guest_ref_id  uuid not null references guest_refs(id) on delete cascade,
  consent_type  text not null,
  granted       boolean not null,
  user_agent    text,
  ts            timestamptz not null default now()
);
create index if not exists consent_guest_idx on consent_log(guest_ref_id);

create table if not exists redemption_events (
  id            uuid primary key default gen_random_uuid(),
  guest_ref_id  uuid not null references guest_refs(id) on delete cascade,
  venue_slug    text not null references venues(slug),
  perk_id       text references perks(id),
  confirm_code  text not null,
  source        text not null default 'venue_qr',
  ts            timestamptz not null default now()
);
create index if not exists redemption_venue_ts_idx on redemption_events(venue_slug, ts);

-- ---------- RLS ----------
-- Planning layer: public read, no public write.
-- Identity/consent/proof: no public access at all — only the service role
-- (which bypasses RLS) may touch these, via server routes.

alter table districts          enable row level security;
alter table venues             enable row level security;
alter table perks              enable row level security;
alter table plan_entries       enable row level security;
alter table guest_refs         enable row level security;
alter table consent_log        enable row level security;
alter table redemption_events  enable row level security;

create policy "public read districts"    on districts    for select using (true);
create policy "public read venues"       on venues       for select using (true);
create policy "public read perks"        on perks        for select using (true);
create policy "public read plan_entries" on plan_entries for select using (true);

-- No anon/authenticated policies on guest_refs / consent_log /
-- redemption_events => default deny. Service role bypasses RLS.
