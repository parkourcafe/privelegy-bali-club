-- 0049_bangli_karangasem_excursion_routes.sql
-- Two more excursions, same pattern as 0048 (multi-district routes, no new
-- domain entity): stops are batch3 attraction venues published by 0047.
-- No F&B venue is published yet in either district, so both routes are
-- attraction-only for now -- a lunch stop can be added later without a
-- schema change once one exists.
--
-- Must run after 0047 (Pura Kehen / Penglipuran / Besakih / Tenganan publish).
-- Idempotent: `on conflict do nothing` for routes (slug is the real PK);
-- `where not exists` for route_stops (no unique constraint on that table,
-- same as 0007/0048).

begin;

insert into routes (slug, district, title, subtitle, rank) values
  ($ob$bangli-temple-village-day$ob$, $ob$bangli$ob$, $ob$A Bangli temple & village day$ob$, $ob$State temple, then Bali's tidiest village$ob$, 10),
  ($ob$east-bali-heritage-day$ob$, $ob$karangasem$ob$, $ob$An East Bali heritage day$ob$, $ob$Bali's holiest temple, then a Bali Aga weaving village$ob$, 10)
on conflict (slug) do nothing;

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$bangli-temple-village-day$ob$, $ob$pura-kehen$ob$, 10, $ob$Bangli's state temple -- a quieter start away from the south-Bali circuit.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$bangli-temple-village-day$ob$ and venue_slug = $ob$pura-kehen$ob$);

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$bangli-temple-village-day$ob$, $ob$desa-wisata-penglipuran$ob$, 20, $ob$A short drive on: the bamboo-roofed, car-free village.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$bangli-temple-village-day$ob$ and venue_slug = $ob$desa-wisata-penglipuran$ob$);

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$east-bali-heritage-day$ob$, $ob$desa-wisata-besakih$ob$, 10, $ob$Start at Bali's largest temple complex -- go early for the managed route up to the gate.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$east-bali-heritage-day$ob$ and venue_slug = $ob$desa-wisata-besakih$ob$);

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$east-bali-heritage-day$ob$, $ob$desa-wisata-tenganan$ob$, 20, $ob$Head on toward the coast: a Bali Aga village known for double-ikat weaving.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$east-bali-heritage-day$ob$ and venue_slug = $ob$desa-wisata-tenganan$ob$);

commit;
