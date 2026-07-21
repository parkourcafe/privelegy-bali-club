-- Wave 3 T10: add missing Canggu planning routes through the existing
-- routes/route_stops engine. No venue publication or monetization changes.

begin;

insert into public.routes (slug, district, title, subtitle, rank)
select 'canggu-food-route', 'canggu', 'Canggu food route', 'A low-friction Canggu food day: brunch, local/casual lunch, then dinner nearby.', 14
where not exists (select 1 from public.routes where slug = 'canggu-food-route');

insert into public.routes (slug, district, title, subtitle, rank)
select 'canggu-rainy-day', 'canggu', 'Canggu rainy-day route', 'Covered cafés, reset stops and an easy dinner when the weather turns.', 15
where not exists (select 1 from public.routes where slug = 'canggu-rainy-day');

commit;
