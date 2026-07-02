-- Curated routes (§8): ordered sequences of venues through a day/theme. Public
-- read like the rest of the planning layer. Falls back to seed if not applied.

create table if not exists routes (
  slug       text primary key,
  district   text not null references districts(slug),
  title      text not null,
  subtitle   text,
  rank       int not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists route_stops (
  id         uuid primary key default gen_random_uuid(),
  route_slug text not null references routes(slug) on delete cascade,
  venue_slug text not null references venues(slug) on delete cascade,
  rank       int not null default 100,
  note       text,
  created_at timestamptz not null default now()
);
create index if not exists route_stops_route_idx on route_stops(route_slug, rank);

alter table routes      enable row level security;
alter table route_stops enable row level security;
drop policy if exists "public read routes" on routes;
drop policy if exists "public read route_stops" on route_stops;
create policy "public read routes"      on routes      for select using (true);
create policy "public read route_stops" on route_stops for select using (true);

insert into routes (slug, district, title, subtitle, rank) values
  ('first-day','canggu','First day in Canggu','Land, settle, eat well',10),
  ('cafe-work','canggu','Café & work day','Good wifi, good coffee',20),
  ('sunset-run','canggu','Sunset run','Golden hour to nightcap',30)
on conflict (slug) do nothing;

insert into route_stops (route_slug, venue_slug, rank, note) values
  ('first-day','amber-cafe',10,'Coffee to shake off the flight.'),
  ('first-day','tide-surf',20,'Easy first surf, boards on the sand.'),
  ('first-day','dusk-beach-club',30,'Sunset — you earned it.'),
  ('first-day','ember-dinner',40,'Woodfire dinner, walk-in friendly.'),
  ('cafe-work','home-cafe',10,'Quiet start, dessert on the house.'),
  ('cafe-work','amber-cafe',20,'Switch desks, best filter in Berawa.'),
  ('cafe-work','root-warung',30,'Cheap fast lunch between calls.'),
  ('sunset-run','dusk-beach-club',10,'Get there by 17:00.'),
  ('sunset-run','ember-dinner',20,'Dinner as the light goes.'),
  ('sunset-run','neon-bar',30,'Records and cocktails to close.')
on conflict do nothing;
