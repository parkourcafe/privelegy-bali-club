-- 0048_ubud_culture_day_route.sql
-- First "excursion" example built on the multi-district routes support added
-- in this same change (lib/data.ts fetchRouteDefs no longer hardcodes
-- district='canggu'; app/route/[slug]/page.tsx and app/plan/page.tsx were
-- updated to stay correct for both Canggu and non-Canggu routes).
--
-- Reuses the existing routes/route_stops entity (0007) -- no new domain
-- entity. Stops are two batch3 attraction venues published by 0047 (Tirta
-- Empul, Tegenungan waterfall) plus one already-published Ubud restaurant
-- (Bebek Bengil, published by 0040) for lunch -- nothing invented, every stop
-- is a real catalogue row.
--
-- Must run after 0047 (Tirta Empul / Tegenungan publish) and 0040 (Bebek
-- Bengil publish). Idempotent via `on conflict do nothing`.

begin;

insert into routes (slug, district, title, subtitle, rank)
values ($ob$ubud-culture-day$ob$, $ob$ubud$ob$, $ob$An Ubud culture day$ob$, $ob$Holy spring, waterfall, crispy duck$ob$, 10)
on conflict (slug) do nothing;

-- route_stops has no unique constraint beyond its uuid id (matching the 0007
-- precedent), so idempotency here is via `where not exists` on the natural
-- key (route_slug, venue_slug) rather than `on conflict`.
insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$ubud-culture-day$ob$, $ob$tirta-empul$ob$, 10, $ob$Start at the holy spring for melukat -- go early, before the tour buses.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$ubud-culture-day$ob$ and venue_slug = $ob$tirta-empul$ob$);

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$ubud-culture-day$ob$, $ob$air-terjun-tegenungan$ob$, 20, $ob$An easy waterfall stop on the way into Ubud -- no trek required.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$ubud-culture-day$ob$ and venue_slug = $ob$air-terjun-tegenungan$ob$);

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$ubud-culture-day$ob$, $ob$bebek-bengil$ob$, 30, $ob$Lunch: the Ubud restaurant that popularised Balinese crispy duck.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$ubud-culture-day$ob$ and venue_slug = $ob$bebek-bengil$ob$);

commit;
