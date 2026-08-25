-- Other Bali — two fixes applied after the founder asked "what Google Maps
-- data did you find" and then asked to keep Cretya Ubud / CP Lounge despite
-- them not being beach clubs, 2026-08-25.
--
-- 1. gmaps_url backfill for the 11 nightlife venues published earlier today.
--    Same bug as this morning's spa/rental/restaurant harvests: none of
--    nightlife/make_cards.py's INSERT column lists included gmaps_url. Fixed
--    the same way -- a zero-credit Google Maps *search* deep link built from
--    name + district, the already-sanctioned fallback pattern
--    (lib/external-links.ts classifyGoogleMapsHandoff()).
--
-- 2. New category `day_club` -- Cretya Ubud (Tegallalang, rice terraces) and
--    CP Lounge (Ubud) were built and classified beach_club by the extraction
--    model, then correctly held out earlier today for being in a district
--    with no coastline. The founder overrode that: these are real, wanted
--    venues even though "beach club" is the wrong label for them. Rather
--    than mislabel them, added `day_club` as its own category -- same
--    free-text-category, NULL-venue_type pattern as nightclub/hookah_lounge
--    added earlier (code changes committed separately: lib/types.ts,
--    lib/venue-validation.ts, lib/venue-presentation.ts, and the five
--    duplicated categoryLabel maps).
--
-- Cretya Ubud: full facts from its own site (cretyaubud.com) -- address,
-- phone, WhatsApp, Instagram, hours, a 220K IDR first-drink-charge cover fact
-- and priced menu items up to a 2,000,000 IDR hammock rental.
-- CP Lounge: own site (cp-lounge.com) gives hours, Instagram, booking link
-- and an explicit "Free Entry" fact, but no address and no priced items --
-- every price field is NULL rather than guessed.
--
-- Both dry-run against production (begin/rollback) before this file was
-- written, then applied for real and verified.

begin;

update venues
set gmaps_url = 'https://www.google.com/maps/search/?api=1&query=' || replace(
    encode(convert_to(trim(name) || ', ' || coalesce(nullif(subarea, ''), replace(district, '-', ' ')) || ', Bali, Indonesia', 'UTF8'), 'escape'),
    ' ', '%20'
  )
where slug in ('the-goat-seminyak','mesa-bali-canggu','the-shisha-house-seminyak',
'hubble-canggu','pavilion-surf-club-kuta-legian','white-rabbit-lounge-uluwatu-bukit','ours-bali-uluwatu-bukit',
'banana-lounge-bali-uluwatu-bukit','pinstripe-bar-ubud','ubud-shisha-ubud','impresario-clubhouse-nusa-dua')
  and (gmaps_url is null or gmaps_url = '');

insert into venues (id, slug, name, category, district, venue_type, subarea, why_its_here, best_for, not_for, price_anchor, what_to_order, official_url, instagram_url, booking_url, whatsapp, phone, opening_hours, full_address, price_min_idr, price_max_idr, verification_source, gmaps_url, status, publication_status, editorial_status, verified_at, last_verified_at)
select gen_random_uuid()::text, 'cretya-ubud-ubud', 'Cretya Ubud', 'day_club', 'ubud', null, 'Tegallalang',
  'Day club in Ubud, in Tegallalang among the rice terraces. A tropical day club with a multi-dimensional dining experience in a luxurious setting. First drink charge is 220K IDR. Morning Gateway breakfast package is 400K IDR. Booking is on the venue''s own site.',
  'A day of rice-terrace views, pool time and dining, not a beach day or a late-night club.',
  'A quick casual visit — entry carries a 220K IDR first-drink charge.',
  '$$ · First drink charge 220K', 'First drink charge — 220K IDR.',
  'https://cretyaubud.com', 'https://www.instagram.com/cretyaubud', 'https://cretyaubud.com/en/cretya-ubud/day-clubs',
  '6281238021174', '623619585999', 'Open daily 7 AM - 9 PM',
  'Jl. Raya Tegallalang, Tegallalang, Bali, Indonesia', 220000, 2000000,
  'https://cretyaubud.com/en/cretya-ubud',
  'https://www.google.com/maps/search/?api=1&query=Cretya%20Ubud,%20Tegallalang,%20Bali,%20Indonesia',
  'active', 'published', 'published', '2026-08-25T21:30:00+00:00'::timestamptz, '2026-08-25'::date
where not exists (select 1 from venues v where v.slug = 'cretya-ubud-ubud')
  and not exists (select 1 from venues v where lower(v.name) = lower('Cretya Ubud') and v.district = 'ubud');

insert into venues (id, slug, name, category, district, venue_type, subarea, why_its_here, best_for, not_for, price_anchor, what_to_order, official_url, instagram_url, booking_url, whatsapp, phone, opening_hours, full_address, price_min_idr, price_max_idr, verification_source, gmaps_url, status, publication_status, editorial_status, verified_at, last_verified_at)
select gen_random_uuid()::text, 'cp-lounge-ubud-bali-ubud', 'CP Lounge', 'day_club', 'ubud', null, 'Ubud',
  'Day club and lounge in Ubud. Daytime relaxation by the pool, live music, DJs, dancing and Balinese dance performances after dark. Free entry. Also offers shisha. Booking is on the venue''s own site.',
  'A mixed day-into-night out — pool time by day, live music and dancing after dark.',
  null, null, null,
  'https://cp-lounge.com', 'https://www.instagram.com/CPLounge', 'https://www.cp-lounge.com/ubud-oasis',
  null, null, 'Open Daily 1 PM - 3 AM',
  null, null, null,
  'https://www.cp-lounge.com/',
  'https://www.google.com/maps/search/?api=1&query=CP%20Lounge,%20Ubud,%20Bali,%20Indonesia',
  'active', 'published', 'published', '2026-08-25T21:30:00+00:00'::timestamptz, '2026-08-25'::date
where not exists (select 1 from venues v where v.slug = 'cp-lounge-ubud-bali-ubud')
  and not exists (select 1 from venues v where lower(v.name) = lower('CP Lounge') and v.district = 'ubud');

commit;
