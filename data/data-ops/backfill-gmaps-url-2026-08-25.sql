-- Other Bali — backfill gmaps_url for every venue published today (2026-08-25).
--
-- Gap found by the founder after today's four harvests (spa wave 2, rental,
-- yoga/fitness/beauty, restaurants): none of make_cards.py's INSERT column
-- lists included gmaps_url, so all 407 new/updated venues published today
-- shipped with no Google Maps link at all -- no Directions/Search action on
-- their pages. Confirmed by query: 311 spa + 63 rental + 20 restaurant +
-- 10 beauty + 3 yoga = 407 rows with last_verified_at = 2026-08-25 and
-- gmaps_url null.
--
-- Fix costs zero Firecrawl credits: name + district/subarea, already on
-- every row, is enough to build a Google Maps *search* deep link --
-- https://www.google.com/maps/search/?api=1&query=<name>,<area>,Bali,Indonesia.
-- This is the same pattern already used elsewhere in the codebase
-- (lib/seed.ts's editorial-seed rows use "https://maps.google.com/?q=...").
-- lib/external-links.ts's classifyGoogleMapsHandoff() recognises this shape
-- as "search" (not "exact" -- no place_id/cid), and the UI labels it "Search
-- in Google Maps" rather than "Directions": an honest, already-sanctioned
-- fallback, not an invented precise pin. A verified place-ID link can
-- replace it later without any schema change.
--
-- Dry-run against production (begin/rollback) already done for this exact
-- statement before this file was written: the-wellness-spa-uluwatu-bukit
-- came back "https://www.google.com/maps/search/?api=1&query=The%20Wellness%20Spa,%20Pandawa,%20Bali,%20Indonesia".
--
-- Idempotent: only touches rows where gmaps_url is currently null/empty, so
-- a re-run changes nothing.

begin;

update venues
set gmaps_url = 'https://www.google.com/maps/search/?api=1&query=' || replace(
    encode(convert_to(trim(name) || ', ' || coalesce(nullif(subarea, ''), replace(district, '-', ' ')) || ', Bali, Indonesia', 'UTF8'), 'escape'),
    ' ', '%20'
  )
where last_verified_at = '2026-08-25'
  and (gmaps_url is null or gmaps_url = '')
  and status = 'active'
  and publication_status = 'published';

commit;
