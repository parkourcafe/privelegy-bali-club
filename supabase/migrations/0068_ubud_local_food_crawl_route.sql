-- 0068_ubud_local_food_crawl_route.sql
-- S08 from the Ubud scenario-layer addendum (2026-08-13): a local-food-crawl
-- route reusing the already-live /ubud/best-warungs canonical (I10 was
-- rejected as a standalone guide -- the warungs owner already exists) rather
-- than a new guide URL. Same `route` entity/URL shape as ubud-culture-day
-- (0048) and ubud-remote-work-day (0067) -- no new domain entity.
--
-- All three stops are already-published Ubud warungs with real editorial
-- copy from the 0024 pass, chosen to be genuinely distinct (not just three
-- "Indonesian food" cards) while staying Balinese/Indonesian-rooted --
-- Warung Siam (Thai) and Dicarik Warung (pre-order-only betutu duck) were
-- deliberately excluded: the former doesn't fit a "local food" frame, the
-- latter would mislead a drop-in crawl. Nothing invented; no "authentic"
-- claim beyond what each venue's own why_its_here already states.
--
-- Must run after 0024 (editorial pass) and 0015 (venues published).
-- Idempotent via `on conflict do nothing` / `where not exists`.

begin;

insert into routes (slug, district, title, subtitle, rank)
values ($ob$ubud-local-food-crawl$ob$, $ob$ubud$ob$, $ob$A local-food crawl in Ubud$ob$, $ob$Three warungs, in order, for honey-glazed chicken, a healthcare-funding lunch and an all-vegan finish$ob$, 30)
on conflict (slug) do nothing;

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$ubud-local-food-crawl$ob$, $ob$manga-madu$ob$, 10, $ob$Start central at Warung Mangga Madu -- straightforward, affordable Indonesian comfort food; the honey-glazed chicken is the order.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$ubud-local-food-crawl$ob$ and venue_slug = $ob$manga-madu$ob$);

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$ubud-local-food-crawl$ob$, $ob$fair-warung-bale$ob$, 20, $ob$Fair Warung Balé -- restaurant proceeds fund free medical consultations for the local community; an easy lunch that isn't just a meal.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$ubud-local-food-crawl$ob$ and venue_slug = $ob$fair-warung-bale$ob$);

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$ubud-local-food-crawl$ob$, $ob$wulan-vegetarian-warung$ob$, 30, $ob$Finish in Peliatan at Wulan Vegetarian Warung -- a hole-in-the-wall, cash-only, all-vegan Indonesian menu at very low prices.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$ubud-local-food-crawl$ob$ and venue_slug = $ob$wulan-vegetarian-warung$ob$);

commit;
