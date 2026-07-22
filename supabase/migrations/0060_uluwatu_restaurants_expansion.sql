-- Additive Uluwatu restaurant expansion (2026-07-23).
-- Public rows are limited to venue identity/branch, a first-party source and
-- conservative editorial fit copy. Review prose/ratings are not imported.

begin;

with additions(slug, name, area, official_url, opening_hours, price_band, why_its_here, best_for) as (
values
  ('ours-bali','Ours Bali','Pecatu (Jl. Labuansait)','https://oursbali.com/','Daily 08:00–23:00','$$','An all-day Uluwatu restaurant pairing Mediterranean-leaning food with a relaxed open-air room.','Breakfast through dinner; mixed groups; an easy first meal in Pecatu'),
  ('bartolo-bali','Bartolo','Pecatu (Jl. Melasti Labuan Sait)','https://www.bartolobali.com/','Daily 17:00–late','$$$','A French-Italian neighbourhood bistro and cocktail bar built for dinner and aperitivo.','Date night; cocktails; European bistro cooking'),
  ('avli-bali','AVLI','Pecatu','https://avlibali.com/','Daily 17:00–late','$$$','A modern Greek courtyard restaurant centred on sharing plates and grills.','Greek sharing plates; group dinners; a polished evening meal'),
  ('bb52-burgers-uluwatu','BB52 Burgers Uluwatu','Pecatu (Jl. Labuan Sait)','https://bb52burgers.com/',null,'$$','A late-opening burger restaurant on the Labuan Sait strip.','Burgers; late dinner; casual groups'),
  ('hidden-gem-uluwatu','Hidden Gem Uluwatu','Pecatu (Hidden Hills Villas)','https://www.hiddengemuluwatu.com/','Daily 07:30–23:00','$$$','A hilltop restaurant and wine lounge with an ocean-facing pool setting.','Sunset wine; occasion dinners; visitors staying around Pecatu'),
  ('abracadabra-at-mu','Abracadabra at Mu','Bingin','https://mu-bali.com/','Kitchen daily 07:30–21:45','$$$','Mu Bali''s all-day restaurant with an on-site bakery.','A long Bingin meal; house-made bakery items; sunset dinner'),
  ('tacos-aqui-uluwatu','Tacos Aqui Uluwatu','Pecatu (Jl. Labuansait)','https://tacosaquibali.com/about-us','Daily 16:00–23:00','$$','A colourful evening taqueria combining Mexican food with music-led nights.','Tacos and margaritas; casual groups; an energetic dinner'),
  ('la-baracca-uluwatu','La Baracca Uluwatu','Pecatu','https://www.labaraccabali.com/',null,'$$','An Italian restaurant focused on pizza, pasta and casual dining.','Pizza and pasta; families; uncomplicated group dinners'),
  ('tabu-bali','Tabu Bali','Pecatu','https://tabubali.com/',null,'$$$','A dinner-to-late venue combining Japanese-Mexican food, cocktails and music.','Lively group dinners; cocktails; staying out late'),
  ('lolas-cantina-uluwatu','Lola''s Cantina Uluwatu','Pecatu','https://www.lolascantina.com/',null,'$$','A casual Mexican cantina serving tacos, burritos and cocktails.','Casual Mexican food; groups; an easy dinner'),
  ('shaka-riki-uluwatu','Shaka Riki Uluwatu','Pecatu','https://www.shakariki432.com/',null,'$$','A compact Japanese restaurant and sake-bar concept in Uluwatu.','Japanese comfort food; sake; a low-key dinner'),
  ('the-cave-bali','The Cave','Pecatu (The edge)','https://www.theedgebali.com/en/gastronomy/cave/',null,'$$$','A 22-seat subterranean tasting-menu restaurant inside The edge resort.','A destination tasting menu; celebrations; advance-planned dinner'),
  ('cire-alila-uluwatu','CIRE','Pecatu (Alila Villas Uluwatu)','https://www.alilahotels.com/uluwatu/dining/',null,'$$$','Alila Villas Uluwatu''s contemporary resort restaurant overlooking the Indian Ocean.','Resort dining; special occasions; ocean-view lunch or dinner'),
  ('di-mare-karma-kandara','di Mare','Ungasan (Karma Kandara)','https://karmagroup.com/find-destination/karma-resorts/karma-kandara/',null,'$$$','Karma Kandara''s cliffside Italian restaurant.','Occasion dining; Italian food; a cliff-view meal'),
  ('double-ikat','Double Ikat','Ungasan (Renaissance Bali Uluwatu)','https://www.marriott.com/en-us/hotels/dpsuw-renaissance-bali-uluwatu-resort-and-spa/dining/','Daily 18:00–23:00','$$$','An Indonesian restaurant inside Renaissance Bali Uluwatu.','Indonesian dinner; resort guests; family-style sharing'),
  ('filini-uluwatu','Filini','Pecatu (Radisson Blu Bali Uluwatu)','https://www.radissonhotels.com/en-us/hotels/radisson-blu-bali-uluwatu/restaurant-bar',null,'$$$','Radisson Blu Uluwatu''s Italian restaurant.','Italian dinner; hotel guests; a quieter resort meal'),
  ('botol-biru','Botol Biru Bar & Grill','Pecatu (Anantara Uluwatu)','https://www.anantara.com/en/uluwatu-bali/restaurants',null,'$$$','Anantara Uluwatu''s open-air grill overlooking the coast.','Sunset drinks; grilled food; resort dining'),
  ('ulu-cliffhouse','Ulu Cliffhouse','Suluban, Pecatu','https://ulucliffhouse.com/',null,'$$$','A clifftop pool club with a restaurant, bar and sunset programming.','A long lunch; sunset; groups combining food and pool time'),
  ('the-beach-by-ours','The Beach by Ours','Thomas Beach, Pecatu','https://thebeachbyours.com/',null,'$$$','A beach-level Ours Group restaurant by the sand.','Beach lunch; sunset; barefoot group meals'),
  ('mood-by-ours','Mood by Ours','Pecatu','https://moodbyours.com/',null,'$$$','An Ours Group dining and nightlife venue in the Uluwatu area.','Dinner that continues into drinks; groups; a late evening'),
  ('analog-uluwatu','Analog Uluwatu','Pecatu','https://www.instagram.com/analog_uluwatu/',null,'$$','A Pecatu cafe-restaurant with a compact all-day format.','Coffee; brunch; a casual daytime stop'),
  ('baked-uluwatu','BAKED. Uluwatu','Pecatu','https://bakedindonesia.com/',null,'$$','A bakery-cafe centred on bread, pastries and brunch.','Pastries; brunch; coffee before the beach'),
  ('tanah-uluwatu','Tanah Uluwatu','Pecatu','https://www.instagram.com/tanahuluwatu/',null,'$$','A Uluwatu bakery and grill serving from daytime into dinner.','Bakery breakfast; brunch; casual grills'),
  ('milk-and-madu-uluwatu','Milk & Madu Uluwatu','Pecatu','https://milkandmadu.com/',null,'$$','A family-friendly all-day cafe with breakfast and pizza.','Families; brunch; groups with different appetites'),
  ('tarabelle-uluwatu','Tarabelle Uluwatu','Ungasan','https://tarabelle.com/',null,'$$','An all-day neighbourhood cafe and bakery in the Bukit.','Breakfast; pastries; working over coffee'),
  ('lands-end-cafe','Lands End Cafe','Pecatu','https://www.instagram.com/landsendbali/',null,'$$','A health-focused Uluwatu cafe geared to breakfast and post-surf meals.','Healthy breakfast; smoothies; a post-surf stop'),
  ('bukit-cafe','Bukit Cafe','Pecatu (Labuan Sait)','https://www.bukitcafe.com/',null,'$$','A long-running all-day cafe on the Labuan Sait corridor.','Breakfast; lunch; mixed-diet groups'),
  ('oliverra-umana-bali','Oliverra','Ungasan (Umana Bali)','https://www.hilton.com/en-gb/hotels/dpsolol-umana-bali-resort/dining/oliverra/','Daily 12:00–22:00','$$$','Umana Bali''s Mediterranean restaurant above the southern Bukit coast.','Special occasions; resort dining; sunset-facing dinner'),
  ('il-ristorante-niko-romito','Il Ristorante — Niko Romito','Pecatu (Bulgari Resort Bali)','https://www.bulgarihotels.com/en_US/bali/dining/il-ristorante-niko-romito','Daily 18:00–22:00; last order 21:00','$$$','Bulgari Resort Bali''s formal Italian dining room.','Fine dining; celebrations; a planned resort evening'),
  ('malini-uluwatu','Malini Uluwatu','Pecatu (Uluwatu Temple cliffs)','https://www.instagram.com/maliniuluwatubali/',null,'$$$','A cliff-edge restaurant near Uluwatu Temple with a sunset orientation.','Sunset; a meal near the temple; dramatic coastal views')
)
insert into public.venues (
  id, slug, name, category, district, address, gmaps_url, tier, status,
  is_sponsored, area, why_its_here, best_for, official_url, opening_hours,
  price_band, publication_status, last_verified_at
)
select
  'v_uluwatu_' || replace(slug, '-', '_'), slug, name, 'restaurant',
  'uluwatu-bukit', area || ', Bukit Peninsula',
  'https://www.google.com/maps/search/?api=1&query=' || replace(name || ' Bali', ' ', '%20'),
  'editorial_seed', 'active', false, area, why_its_here, best_for,
  official_url, opening_hours, price_band, 'published', date '2026-07-23'
from additions
on conflict (slug) do update set
  name = excluded.name,
  area = excluded.area,
  address = excluded.address,
  gmaps_url = excluded.gmaps_url,
  why_its_here = excluded.why_its_here,
  best_for = excluded.best_for,
  official_url = excluded.official_url,
  opening_hours = excluded.opening_hours,
  price_band = excluded.price_band,
  publication_status = excluded.publication_status,
  last_verified_at = excluded.last_verified_at;

insert into public.venue_fact_sources (
  venue_slug, field_name, source_type, source_url, verified_at, status, note
)
select slug, 'identity_and_location',
  case when official_url like '%instagram.com/%' then 'official_instagram' else 'official_website' end,
  official_url, date '2026-07-23', 'VERIFIED',
  'Official venue or parent-resort source identifies the Uluwatu/Bukit branch.'
from public.venues
where slug in (
  'ours-bali','bartolo-bali','avli-bali','bb52-burgers-uluwatu','hidden-gem-uluwatu','abracadabra-at-mu','tacos-aqui-uluwatu','la-baracca-uluwatu','tabu-bali','lolas-cantina-uluwatu','shaka-riki-uluwatu','the-cave-bali','cire-alila-uluwatu','di-mare-karma-kandara','double-ikat','filini-uluwatu','botol-biru','ulu-cliffhouse','the-beach-by-ours','mood-by-ours','analog-uluwatu','baked-uluwatu','tanah-uluwatu','milk-and-madu-uluwatu','tarabelle-uluwatu','lands-end-cafe','bukit-cafe','oliverra-umana-bali','il-ristorante-niko-romito','malini-uluwatu'
)
on conflict (venue_slug, field_name) do update set
  source_type = excluded.source_type,
  source_url = excluded.source_url,
  verified_at = excluded.verified_at,
  status = excluded.status,
  note = excluded.note,
  updated_at = now();

commit;
