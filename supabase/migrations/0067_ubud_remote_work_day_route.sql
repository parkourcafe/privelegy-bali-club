-- 0067_ubud_remote_work_day_route.sql
-- Pilot for the scenario/plan content layer proposed in the Ubud 48-scenario
-- registry (external analysis, 2026-08-12): "guide -> scenario -> place pages".
-- The Ubud unified cluster decision V1 (docs/seo/ubud/) freezes new P0_CREATE
-- URLs and assigns café/coffee topics to P1_UPDATE of the existing canonical
-- (/ubud/best-cafes-coffee), not a new standalone guide -- so this ships as a
-- `route` (the same entity/URL shape already used by ubud-culture-day, 0048),
-- explicitly scoped by the founder as a one-pair pilot to test the connection
-- on live code before the other 19 proposed intent owners are reconciled.
--
-- Reuses the existing routes/route_stops entity (0007) -- no new domain
-- entity, no new URL namespace. All three stops are already-published Ubud
-- cafés carrying the `quiet_work_cafe` job tag from the 0024 editorial pass
-- (seniman-coffee-studio, anomali-coffee-ubud, bali-buda-ubud) -- nothing
-- invented; no wifi-speed, socket or call-suitability claim is made because
-- none of those specific facts are on the venue record (guardrail #10).
--
-- Must run after 0024 (jobs tagging) and 0015 (venues published). Idempotent
-- via `on conflict do nothing` / `where not exists`, matching 0048.

begin;

insert into routes (slug, district, title, subtitle, rank)
values ($ob$ubud-remote-work-day$ob$, $ob$ubud$ob$, $ob$A remote work day in Ubud$ob$, $ob$Three cafés, in order, for a focused session, a coffee break and a long lunch$ob$, 20)
on conflict (slug) do nothing;

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$ubud-remote-work-day$ob$, $ob$seniman-coffee-studio$ob$, 10, $ob$Start here for the longer, deep-work block -- editorially tagged for a quiet work session, slower-paced service.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$ubud-remote-work-day$ob$ and venue_slug = $ob$seniman-coffee-studio$ob$);

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$ubud-remote-work-day$ob$, $ob$anomali-coffee-ubud$ob$, 20, $ob$Switch desks mid-afternoon -- a street-front town café, good for a shorter sit and a coffee flight between calls.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$ubud-remote-work-day$ob$ and venue_slug = $ob$anomali-coffee-ubud$ob$);

insert into route_stops (route_slug, venue_slug, rank, note)
select $ob$ubud-remote-work-day$ob$, $ob$bali-buda-ubud$ob$, 30, $ob$Long lunch that can stretch into more work -- wholefoods restaurant and grocery, big menu, room to linger.$ob$
where not exists (select 1 from route_stops where route_slug = $ob$ubud-remote-work-day$ob$ and venue_slug = $ob$bali-buda-ubud$ob$);

commit;
