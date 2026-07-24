-- Owner-confirmed publication batch (2026-07-24)
-- Source: venue_submissions.source = 'otherbali-research-2026-07-23'
-- Founder direction: all 30 venue identities and publication were confirmed.
-- This migration is intentionally conservative:
--   * no review text, ratings, prices, hours, offers or booking claims;
--   * no candidate media is attached;
--   * existing canonical slugs and stronger editorial copy are preserved;
--   * known duplicate review rows are never promoted.

begin;

create temporary table owner_confirmed_venues_20260724 (
  candidate_id text primary key,
  source_name text not null,
  verified_name text not null,
  target_slug text not null unique,
  category text not null,
  district text not null,
  area text,
  address text,
  gmaps_url text,
  official_url text,
  instagram_url text,
  why_its_here text not null,
  best_for text not null
) on commit drop;

insert into owner_confirmed_venues_20260724 (
  candidate_id, source_name, verified_name, target_slug, category, district,
  area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for
) values
  ('ob30-001', 'Sangsaka', 'Sangsaka', 'sangsaka', 'restaurant', 'seminyak', 'Kerobokan Kelod', 'Jalan Raya Pangkung Sari No.100X, Kerobokan Kelod, Kuta Utara, Badung, Bali 80361, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Sangsaka+Jalan+Raya+Pangkung+Sari+No.100X%2C+Kerobokan+Kelod%2C+Kuta+Utara%2C+Badung%2C+Bali+80361%2C+Indonesia', 'https://www.sangsakabali.com/', 'https://www.instagram.com/sangsakabali/', 'Sangsaka is a modern Indonesian restaurant in Kerobokan Kelod centred on wood-fired cooking.', 'Travellers looking for an elevated Indonesian dinner near Seminyak.'),
  ('ob30-002', 'Hujan Locale', 'Hujan Locale', 'hujan-locale', 'restaurant', 'ubud', 'Ubud', 'Jl. Sri Wedari No.5, Ubud, Kecamatan Ubud, Kabupaten Gianyar, Bali 80571, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Hujan+Locale+Jl.+Sri+Wedari+No.5%2C+Ubud%2C+Kecamatan+Ubud%2C+Kabupaten+Gianyar%2C+Bali+80571%2C+Indonesia', 'https://hujanlocale.com/', 'https://www.instagram.com/hujan_locale/', 'Hujan Locale is a modern Indonesian restaurant in central Ubud focused on Balinese and regional Indonesian cooking.', 'Travellers choosing a polished regional Indonesian meal in Ubud.'),
  ('ob30-003', 'Locavore NXT', 'Locavore NXT', 'locavore-nxt', 'restaurant', 'ubud', 'Lodtunduh', 'Jl. A.A. Gede Rai, Gang Pura Panti Bija, Lodtunduh, Ubud, Gianyar, Bali 80571, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Locavore+NXT+Jl.+A.A.+Gede+Rai%2C+Gang+Pura+Panti+Bija%2C+Lodtunduh%2C+Ubud%2C+Gianyar%2C+Bali+80571%2C+Indonesia', 'https://locavorenxt.com/', 'https://www.instagram.com/locavorenxt/', 'Locavore NXT is a contemporary tasting-menu restaurant in Lodtunduh built around hyperlocal Indonesian ingredients.', 'Food-focused travellers planning a dedicated tasting-menu experience near Ubud.'),
  ('ob30-004', 'Room4Dessert', 'Room 4 Dessert', 'room4dessert', 'restaurant', 'ubud', 'Kedewatan', 'Jl. Raya Sanggingan, Kedewatan, Ubud, Gianyar, Bali 80561, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Room+4+Dessert+Jl.+Raya+Sanggingan%2C+Kedewatan%2C+Ubud%2C+Gianyar%2C+Bali+80561%2C+Indonesia', 'https://www.room4dessert.com/', 'https://www.instagram.com/r4d_room4dessert/', 'Room4Dessert is a dessert-led tasting experience in Kedewatan rather than a conventional all-day restaurant.', 'Dessert enthusiasts planning a dedicated pastry and tasting-menu evening in Ubud.'),
  ('ob30-005', 'Mozaic', 'Mozaic Restaurant Gastronomique', 'mozaic', 'restaurant', 'ubud', 'Kedewatan', 'Jl. Raya Sanggingan, Kedewatan, Ubud, Gianyar, Bali 80571, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Mozaic+Restaurant+Gastronomique+Jl.+Raya+Sanggingan%2C+Kedewatan%2C+Ubud%2C+Gianyar%2C+Bali+80571%2C+Indonesia', 'https://www.mozaic-bali.com/', 'https://www.instagram.com/mozaicrestaurantubud/', 'Mozaic is a fine-dining restaurant in Kedewatan pairing Indonesian ingredients with European technique.', 'Special-occasion diners choosing a seasonal tasting-menu experience in Ubud.'),
  ('ob30-006', 'Aperitif Restaurant', 'Apéritif Restaurant', 'aperitif-restaurant', 'restaurant', 'ubud', 'Petulu', 'Br. Nagi, Jl. Lanyahan, Petulu, Kecamatan Ubud, Kabupaten Gianyar, Bali 80571, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Ap%C3%A9ritif+Restaurant+Br.+Nagi%2C+Jl.+Lanyahan%2C+Petulu%2C+Kecamatan+Ubud%2C+Kabupaten+Gianyar%2C+Bali+80571%2C+Indonesia', 'https://www.aperitif.com/', 'https://www.instagram.com/aperitifbali/', 'Apéritif Restaurant is a degustation restaurant in Petulu combining French, Japanese and Indonesian influences.', 'Travellers planning a formal tasting-menu meal near Ubud.'),
  ('ob30-007', 'Mauri Restaurant', 'MAURI Restaurant', 'mauri-restaurant', 'restaurant', 'seminyak', 'Petitenget', 'Jalan Petitenget No.100, Seminyak, Kuta Utara, Badung, Bali, Indonesia', 'https://www.google.com/maps/search/?api=1&query=MAURI+Restaurant+Jalan+Petitenget+No.100%2C+Seminyak%2C+Kuta+Utara%2C+Badung%2C+Bali%2C+Indonesia', 'https://mauri-restaurant.com/', 'https://www.instagram.com/mauri_restaurant/', 'MAURI Restaurant is a contemporary Italian restaurant in Petitenget with a Puglian influence.', 'Couples and special-occasion diners choosing refined Italian cooking in Seminyak.'),
  ('ob30-008', 'Fisherman''s Club', 'Fisherman’s Club', 'fisherman-s-club', 'restaurant', 'sanur', 'Sanur', 'Andaz Bali, Jalan Danau Tamblingan No.89A, Sanur, Denpasar Selatan, Denpasar, Bali 80228, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Fisherman%E2%80%99s+Club+Andaz+Bali%2C+Jalan+Danau+Tamblingan+No.89A%2C+Sanur%2C+Denpasar+Selatan%2C+Denpasar%2C+Bali+80228%2C+Indonesia', 'https://www.hyatt.com/andaz/id-ID/dpsaz-andaz-bali/dining', 'https://www.instagram.com/fishermansclubsanur/', 'Fisherman’s Club is a beachfront seafood restaurant at Andaz Bali in Sanur.', 'Travellers looking for a seafood meal beside Sanur beach.'),
  ('ob30-009', 'The Chowk Ubud', 'The Chowk Indian Gourmet House — Ubud', 'the-chowk-ubud', 'restaurant', 'ubud', 'Ubud', 'Museum Puri Lukisan, Jl. Raya Ubud, Ubud, Gianyar, Bali 80571, Indonesia', 'https://www.google.com/maps/search/?api=1&query=The+Chowk+Indian+Gourmet+House+%E2%80%94+Ubud+Museum+Puri+Lukisan%2C+Jl.+Raya+Ubud%2C+Ubud%2C+Gianyar%2C+Bali+80571%2C+Indonesia', 'https://www.thechowk.id/chowk-ubud', 'https://www.instagram.com/thechowk_id/', 'The Chowk Indian Gourmet House is an Indian restaurant at Museum Puri Lukisan in central Ubud.', 'Vegetarian and non-vegetarian diners choosing Indian food in central Ubud.'),
  ('ob30-010', 'Merah Putih', 'Merah Putih', 'merah-putih-indonesian-restaurant', 'restaurant', 'seminyak', 'Petitenget / Kerobokan Kelod', 'Jl. Petitenget No.100X, Kerobokan Kelod, Kuta Utara, Badung, Bali 80361, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Merah+Putih+Jl.+Petitenget+No.100X%2C+Kerobokan+Kelod%2C+Kuta+Utara%2C+Badung%2C+Bali+80361%2C+Indonesia', 'https://merahputihbali.com/', 'https://www.instagram.com/merahputihbali/', 'Merah Putih is a contemporary Indonesian restaurant in Petitenget focused on regional cooking.', 'Travellers choosing a special Indonesian dinner in Seminyak.'),
  ('ob30-011', 'Kaum Bali', 'Kaum Bali', 'kaum-bali', 'restaurant', 'seminyak', 'Petitenget', 'Desa Potato Head, Beach Club Ground Level, Jl. Petitenget No.51B, Seminyak, Kuta Utara, Badung, Bali 80361, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Kaum+Bali+Desa+Potato+Head%2C+Beach+Club+Ground+Level%2C+Jl.+Petitenget+No.51B%2C+Seminyak%2C+Kuta+Utara%2C+Badung%2C+Bali+80361%2C+Indonesia', 'https://seminyak.potatohead.co/feast/kaum', 'https://www.instagram.com/kaumrestaurant/', 'Kaum Bali is a regional Indonesian restaurant on the ground level of Desa Potato Head in Petitenget.', 'Groups wanting to explore regional Indonesian dishes in Seminyak.'),
  ('ob30-012', 'Barbacoa', 'Barbacoa Bali', 'barbacoa', 'restaurant', 'seminyak', 'Petitenget / Kerobokan Kelod', 'Jl. Petitenget No.14, Kerobokan Kelod, Kuta Utara, Badung, Bali 80361, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Barbacoa+Bali+Jl.+Petitenget+No.14%2C+Kerobokan+Kelod%2C+Kuta+Utara%2C+Badung%2C+Bali+80361%2C+Indonesia', 'https://barbacoa-bali.com/', 'https://www.instagram.com/barbacoabali/', 'Barbacoa Bali is a Latin American restaurant in Petitenget built around live-fire cooking and sharing plates.', 'Groups and couples choosing a live-fire dinner near Seminyak.'),
  ('ob30-013', 'Sarong', 'Sarong', 'sarong', 'restaurant', 'seminyak', 'Petitenget / Kerobokan Kelod', 'Jl. Petitenget No.19X, Kerobokan Kelod, Kuta Utara, Badung, Bali 80361, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Sarong+Jl.+Petitenget+No.19X%2C+Kerobokan+Kelod%2C+Kuta+Utara%2C+Badung%2C+Bali+80361%2C+Indonesia', null, 'https://www.instagram.com/sarongrestaurant/', 'Sarong is an owner-confirmed hospitality venue in Petitenget; its current detailed editorial format remains under review.', 'Travellers comparing Petitenget venues who will confirm the current format directly with the venue.'),
  ('ob30-014', 'Mama San', 'Mama San Bali', 'mamasan-bali', 'restaurant', 'seminyak', 'Kerobokan Kelod', 'Jl. Raya Kerobokan No.135, Kerobokan Kelod, Kuta Utara, Badung, Bali 80361, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Mama+San+Bali+Jl.+Raya+Kerobokan+No.135%2C+Kerobokan+Kelod%2C+Kuta+Utara%2C+Badung%2C+Bali+80361%2C+Indonesia', 'https://mamasanbali.com/', 'https://www.instagram.com/mamasanbali/', 'Mama San is a Southeast Asian restaurant in Kerobokan Kelod near Seminyak.', 'Couples and groups choosing a polished Southeast Asian dinner in Seminyak.'),
  ('ob30-015', 'Watercress Ubud', 'Watercress Ubud', 'watercress-ubud', 'cafe', 'ubud', 'Ubud', 'Jl. Monkey Forest, Ubud, Gianyar, Bali 80571, Indonesia', 'https://maps.app.goo.gl/uwHUepXkmVaZZ6kRA', 'https://watercressbali.com/', 'https://www.instagram.com/watercressbali/', 'Watercress Ubud is an all-day café on Monkey Forest Road serving breakfast, brunch and international dishes.', 'Travellers looking for breakfast or an easy all-day café meal in central Ubud.'),
  ('ob30-016', 'Watercress Seminyak', 'Watercress Seminyak', 'watercress-seminyak', 'cafe', 'seminyak', 'Batu Belig / Kerobokan Kelod', 'Jl. Batu Belig No.21A, Kerobokan Kelod, Kuta Utara, Badung, Bali 80361, Indonesia', 'https://maps.app.goo.gl/uvncVeNt3ptd9Jrm7', 'https://watercressbali.com/', 'https://www.instagram.com/watercressbali/', 'Watercress Seminyak is an all-day café in the Batu Belig area serving breakfast, brunch and international dishes.', 'Travellers looking for a relaxed breakfast or brunch near northern Seminyak.'),
  ('ob30-017', 'Watercress Berawa', 'Watercress Berawa', 'watercress-berawa', 'cafe', 'canggu', 'Berawa / Tibubeneng', 'Opposite Bali Equestrian Centre, Berawa, Tibubeneng, Kuta Utara, Badung, Bali, Indonesia', 'https://maps.app.goo.gl/Hmzc6VNVFdFLcG5E9', 'https://watercressbali.com/', 'https://www.instagram.com/watercressbali/', 'Watercress Berawa is an all-day café in Tibubeneng serving breakfast, brunch and international dishes.', 'Travellers choosing an easy breakfast or brunch in Berawa.'),
  ('ob30-018', 'Milk & Madu Uluwatu', 'Milk & Madu Uluwatu', 'milk-and-madu-uluwatu', 'cafe', 'uluwatu-bukit', 'Pecatu', 'Jalan Labuan Sait, Banjar Dinas Labuan Sait, Pecatu, Kuta Selatan, Badung, Bali 80361, Indonesia', 'https://maps.app.goo.gl/1BDUXs5ihRX2Vxmp8', 'https://milkandmadu.com/location/', 'https://www.instagram.com/milkandmadu/', 'Milk & Madu Uluwatu is a family-friendly all-day café in Pecatu serving breakfast, brunch, pizza and international dishes.', 'Families and groups choosing an easy all-day meal in Uluwatu.'),
  ('ob30-019', 'Milk & Madu Ubud', 'Milk & Madu Ubud', 'milk-and-madu-ubud', 'cafe', 'ubud', 'Ubud', 'Jl. Suweta No.3, Ubud, Gianyar, Bali 80571, Indonesia', 'https://maps.app.goo.gl/UmVZZDgFxPPTT8Mn7', 'https://milkandmadu.com/location/', 'https://www.instagram.com/milkandmadu/', 'Milk & Madu Ubud is a family-friendly all-day café in central Ubud serving breakfast, brunch, pizza and international dishes.', 'Families and groups choosing a flexible café meal in central Ubud.'),
  ('ob30-020', 'Milk & Madu Seminyak', 'Milk & Madu Seminyak', 'milk-and-madu-seminyak', 'cafe', 'seminyak', 'Seminyak', 'Jl. Raya Seminyak No.56, Seminyak, Kuta, Badung, Bali 80361, Indonesia', 'https://maps.app.goo.gl/bDp5TP1tb26gnsPY7', 'https://milkandmadu.com/location/', 'https://www.instagram.com/milkandmadu/', 'Milk & Madu Seminyak is a family-friendly all-day café on Jalan Raya Seminyak serving breakfast, brunch, pizza and international dishes.', 'Families and groups choosing an easy café meal in central Seminyak.'),
  ('ob30-021', 'Rockfish Cliffside', 'Rockfish Cliffside', 'rockfish-cliffside', 'restaurant', 'uluwatu-bukit', 'Pecatu', 'Br. Dinas Karang Boma, Jl. Batu Bolong, Pecatu, Kuta Selatan, Badung, Bali, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Rockfish+Cliffside+Br.+Dinas+Karang+Boma%2C+Jl.+Batu+Bolong%2C+Pecatu%2C+Kuta+Selatan%2C+Badung%2C+Bali%2C+Indonesia', 'https://rockfish-cliffside.com/', 'https://www.instagram.com/rockfish_cliffside/', 'Rockfish Cliffside is an owner-confirmed cliffside restaurant in Pecatu serving seafood and wagyu-led dishes.', 'Travellers planning a cliffside dinner in Uluwatu.'),
  ('ob30-022', 'Lola''s Cantina Uluwatu', 'Lola’s Cantina Mexicana — Uluwatu', 'lolas-cantina-uluwatu', 'restaurant', 'uluwatu-bukit', 'Pecatu', 'Jl. Labuansait No.10, Pecatu, Kuta Selatan, Badung, Bali 80361, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Lola%E2%80%99s+Cantina+Mexicana+%E2%80%94+Uluwatu+Jl.+Labuansait+No.10%2C+Pecatu%2C+Kuta+Selatan%2C+Badung%2C+Bali+80361%2C+Indonesia', 'https://www.lolasbali.com/', 'https://www.instagram.com/lolasbali/', 'Lola’s Cantina Uluwatu is a Mexican restaurant in Pecatu serving tacos, cocktails and vegetarian options.', 'Groups and couples choosing a casual Mexican meal in Uluwatu.'),
  ('ob30-023', 'Lola''s Cantina Canggu', 'Lola’s Cantina Mexicana — Canggu', 'lolas-cantina-canggu', 'restaurant', 'canggu', 'Canggu Shortcut / Tibubeneng', 'Canggu Shortcut, Tibubeneng, Kuta Utara, Badung, Bali 80361, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Lola%E2%80%99s+Cantina+Mexicana+%E2%80%94+Canggu+Canggu+Shortcut%2C+Tibubeneng%2C+Kuta+Utara%2C+Badung%2C+Bali+80361%2C+Indonesia', 'https://www.lolasbali.com/', 'https://www.instagram.com/lolasbali/', 'Lola’s Cantina Canggu is a Mexican restaurant on the Canggu Shortcut serving tacos and cocktails.', 'Groups and couples choosing a casual Mexican meal in Canggu.'),
  ('ob30-024', 'Chaskaa Ubud', 'CHASKAA Ubud', 'chaskaa-ubud', 'restaurant', 'ubud', 'Ubud', 'Jl. Suweta No.5, Ubud, Gianyar, Bali, Indonesia', 'https://www.google.com/maps/search/?api=1&query=CHASKAA+Ubud+Jl.+Suweta+No.5%2C+Ubud%2C+Gianyar%2C+Bali%2C+Indonesia', 'https://www.chaskaabali.com/outlets/', 'https://www.instagram.com/thechaskaabali/', 'CHASKAA Ubud is a modern Indian restaurant on Jalan Suweta serving curries, tandoor dishes and Indian street food.', 'Families and groups choosing modern Indian food in central Ubud.'),
  ('ob30-025', 'Chaskaa Jimbaran', 'CHASKAA GWK — Jimbaran', 'chaskaa-jimbaran', 'restaurant', 'jimbaran', 'Jimbaran / GWK', 'Jl. Raya Uluwatu, beside Indomaret, Jimbaran, Kuta Selatan, Badung, Bali, Indonesia', 'https://www.google.com/maps/search/?api=1&query=CHASKAA+GWK+%E2%80%94+Jimbaran+Jl.+Raya+Uluwatu%2C+beside+Indomaret%2C+Jimbaran%2C+Kuta+Selatan%2C+Badung%2C+Bali%2C+Indonesia', 'https://www.chaskaabali.com/outlets/', 'https://www.instagram.com/thechaskaabali/', 'CHASKAA GWK is a modern Indian restaurant near Jimbaran serving curries, tandoor dishes and Indian street food.', 'Families and groups choosing modern Indian food near Jimbaran and GWK.'),
  ('ob30-026', 'Revolver Espresso Seminyak', 'Revolver Seminyak', 'revolver-seminyak', 'cafe', 'seminyak', 'Seminyak', 'Jl. Kayu Aya No.51, Seminyak, Kuta, Badung, Bali, Indonesia', 'https://maps.app.goo.gl/HojKdwHwuSWqT7sp9', 'https://revolverbali.com/pages/seminyak', 'https://www.instagram.com/revolver.bali/', 'Revolver Seminyak is a specialty-coffee café on Jalan Kayu Aya with an all-day food menu.', 'Travellers choosing serious coffee and a sit-down brunch in Seminyak.'),
  ('ob30-027', 'The Avocado Factory', 'The Avocado Factory', 'the-avocado-factory', 'cafe', 'canggu', 'Batu Mejan', 'Jl. Pantai Batu Mejan, Canggu, Kuta Utara, Badung, Bali 80351, Indonesia', 'https://www.google.com/maps/search/?api=1&query=The+Avocado+Factory+Jl.+Pantai+Batu+Mejan%2C+Canggu%2C+Kuta+Utara%2C+Badung%2C+Bali+80351%2C+Indonesia', 'https://theavocadofactory.com/', 'https://www.instagram.com/theavocadofactory/', 'The Avocado Factory is an avocado-focused café on Jalan Pantai Batu Mejan in Canggu.', 'Plant-forward brunch diners and travellers who want an avocado-led menu.'),
  ('ob30-028', 'Kynd Community', 'KYND Community Seminyak', 'kynd-community', 'cafe', 'seminyak', 'Petitenget / Kerobokan Kelod', 'Jl. Petitenget No.12, Kerobokan Kelod, Kuta Utara, Badung, Bali 80361, Indonesia', 'https://www.google.com/maps/search/?api=1&query=KYND+Community+Seminyak+Jl.+Petitenget+No.12%2C+Kerobokan+Kelod%2C+Kuta+Utara%2C+Badung%2C+Bali+80361%2C+Indonesia', 'https://www.kyndcommunity.com/pages/kyndcafe', 'https://www.instagram.com/kyndcommunity/', 'KYND Community is a vegetarian, plant-forward café on Jalan Petitenget in Seminyak.', 'Vegetarian diners choosing colourful bowls, café dishes and juices in Seminyak.'),
  ('ob30-029', 'Warung Mak Beng', 'Warung Mak Beng', 'warung-mak-beng', 'warung', 'sanur', 'Sanur Kaja', 'Jl. Hang Tuah No.45, Sanur Kaja, Denpasar Selatan, Denpasar, Bali 80227, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Warung+Mak+Beng+Jl.+Hang+Tuah+No.45%2C+Sanur+Kaja%2C+Denpasar+Selatan%2C+Denpasar%2C+Bali+80227%2C+Indonesia', null, 'https://www.instagram.com/warungmakbengsanur/', 'Warung Mak Beng is a Balinese seafood warung in Sanur known for a focused fish soup, fried fish and rice meal.', 'Travellers wanting a straightforward local seafood meal in Sanur.'),
  ('ob30-030', 'Nasi Ayam Kedewatan Ibu Mangku', 'Nasi Ayam Kedewatan Ibu Mangku — Outlet Pusat Ubud', 'nasi-ayam-kedewatan-ibu-mangku', 'warung', 'ubud', 'Kedewatan', 'Jl. Raya Kedewatan No.18, Kedewatan, Ubud, Gianyar, Bali, Indonesia', 'https://www.google.com/maps/search/?api=1&query=Nasi+Ayam+Kedewatan+Ibu+Mangku+%E2%80%94+Outlet+Pusat+Ubud+Jl.+Raya+Kedewatan+No.18%2C+Kedewatan%2C+Ubud%2C+Gianyar%2C+Bali%2C+Indonesia', null, 'https://www.instagram.com/nasiayamkedewatan/', 'Nasi Ayam Kedewatan Ibu Mangku is a Balinese nasi ayam warung on Jalan Raya Kedewatan in Ubud.', 'Travellers looking for a focused Balinese rice-and-chicken meal in Kedewatan.');

do $$
declare
  source_count integer;
begin
  select count(*) into source_count
  from public.venue_submissions
  where source = 'otherbali-research-2026-07-23';

  if source_count <> 30 then
    raise exception 'Expected 30 source submissions, found %', source_count;
  end if;
end
$$;

-- Update the canonical row when it already exists. Do not overwrite stronger
-- editorial copy, but replace factual identity/contact fields with the
-- owner-confirmed batch values.
update public.venues as v
set
  category = c.category,
  district = c.district,
  area = c.area,
  address = c.address,
  full_address = c.address,
  gmaps_url = c.gmaps_url,
  official_url = c.official_url,
  instagram_url = c.instagram_url,
  status = 'active',
  publication_status = 'published',
  editorial_status = 'review',
  tier = coalesce(v.tier, 'editorial_seed'),
  is_sponsored = false,
  why_its_here = coalesce(nullif(btrim(v.why_its_here), ''), c.why_its_here),
  best_for = coalesce(nullif(btrim(v.best_for), ''), c.best_for),
  verified_at = now(),
  last_verified_at = current_date,
  verification_source = 'owner-confirmed batch otherbali-research-2026-07-23; publication approved 2026-07-24',
  photo_status = case
    when v.photo_url is null then 'approved_no_photo'
    else v.photo_status
  end
from owner_confirmed_venues_20260724 as c
where v.slug = c.target_slug;

-- Insert only candidates without an existing canonical target.
insert into public.venues (
  id, slug, name, category, district, area, address, full_address, gmaps_url,
  official_url, instagram_url, tier, status, publication_status,
  editorial_status, is_sponsored, why_its_here, best_for, verified_at,
  last_verified_at, verification_source, photo_status
)
select
  gen_random_uuid()::text,
  c.target_slug,
  c.verified_name,
  c.category,
  c.district,
  c.area,
  c.address,
  c.address,
  c.gmaps_url,
  c.official_url,
  c.instagram_url,
  'editorial_seed',
  'active',
  'published',
  'review',
  false,
  c.why_its_here,
  c.best_for,
  now(),
  current_date,
  'owner-confirmed batch otherbali-research-2026-07-23; publication approved 2026-07-24',
  'approved_no_photo'
from owner_confirmed_venues_20260724 as c
where not exists (
  select 1 from public.venues existing where existing.slug = c.target_slug
);

-- The review queue is the provenance record for this source batch.
update public.venue_submissions as s
set
  status = 'accepted',
  note = case
    when coalesce(s.note, '') ilike '%publication approved 2026-07-24%'
      then s.note
    else concat_ws(
      E'\n',
      nullif(s.note, ''),
      'Owner confirmation received; publication approved 2026-07-24. Canonical venue record published without unverified hours, prices, ratings, review copy or offers.'
    )
  end,
  updated_at = now()
from owner_confirmed_venues_20260724 as c
where s.source = 'otherbali-research-2026-07-23'
  and lower(btrim(s.name)) = lower(btrim(c.source_name));

do $$
declare
  canonical_count integer;
  public_count integer;
  accepted_count integer;
  thin_count integer;
begin
  select count(*) into canonical_count
  from owner_confirmed_venues_20260724 c
  join public.venues v on v.slug = c.target_slug;

  select count(*) into public_count
  from owner_confirmed_venues_20260724 c
  join public.venues v on v.slug = c.target_slug
  where v.status = 'active'
    and v.publication_status = 'published';

  select count(*) into thin_count
  from owner_confirmed_venues_20260724 c
  join public.venues v on v.slug = c.target_slug
  where nullif(btrim(v.why_its_here), '') is null
     or nullif(btrim(v.best_for), '') is null;

  select count(*) into accepted_count
  from public.venue_submissions
  where source = 'otherbali-research-2026-07-23'
    and status = 'accepted';

  if canonical_count <> 30 then
    raise exception 'Expected 30 canonical venue records, found %', canonical_count;
  end if;
  if public_count <> 30 then
    raise exception 'Expected 30 active published venue records, found %', public_count;
  end if;
  if thin_count <> 0 then
    raise exception 'Expected no venue without decision-ready copy, found %', thin_count;
  end if;
  if accepted_count <> 30 then
    raise exception 'Expected 30 accepted submissions, found %', accepted_count;
  end if;
  if exists (
    select 1 from public.venues
    where slug in ('merah-putih', 'room-4-dessert')
      and publication_status = 'published'
  ) then
    raise exception 'Known duplicate review row was promoted unexpectedly';
  end if;
end
$$;

commit;
