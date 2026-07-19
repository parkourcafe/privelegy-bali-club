-- 0039_publish_kora_new_venues.sql
-- Insert 24 new Bali venues sourced from the KORA prospects list, now with a
-- researched street address + Google Maps link (parallel web-research pass,
-- captured 2026-07-19: official sites, Google Maps, Tripadvisor/Chope/Foursquare).
--
-- Follows the repo convention (cf. 0031): new venues are inserted at the column
-- default publication_status = 'review' (status = 'active', tier = 'editorial_seed').
-- They enter the catalogue in REVIEW state and are NOT publicly visible until an
-- operator flips publication_status to 'published' (public reads require active +
-- published). Editorial copy (why_its_here/best_for/...) is intentionally left null
-- and can be enriched before publishing; a thin row is noindex per lib/publication.ts.
--
-- Idempotent: guarded by 'where not exists (slug)'. Addresses/Maps carry source
-- attribution in data/data-ops/kora-leads/new-bali-venue-candidates.json.
-- Held OUT (needs_verification, not inserted): kurasu-bali (unconfirmed pop-up),
-- dapur-bali-mula (North Bali, outside guide districts).
-- Production apply is a separate founder step.

begin;

-- ---------- canggu (6) ----------
insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$alma-tapas-bar$ob$, $ob$Alma Tapas Bar$ob$, $ob$restaurant$ob$, $ob$canggu$ob$, $ob$Jl. Pantai Berawa No.89C, Canggu, Kec. Kuta Utara, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Alma%20Tapas%20Bar%20Canggu%20Berawa%20Bali$ob$, $ob$https://almatapasbar.com/$ob$, $ob$https://www.instagram.com/almatapasbar/$ob$
where not exists (select 1 from venues where slug = $ob$alma-tapas-bar$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$home-by-chef-wayan$ob$, $ob$HOME by Chef Wayan$ob$, $ob$restaurant$ob$, $ob$canggu$ob$, $ob$Jl. Pantai Pererenan No. 92, Pererenan, Kec. Mengwi, Kabupaten Badung, Bali 80351$ob$, $ob$https://maps.app.goo.gl/mET5aM7JhTn8TbwW8$ob$, $ob$https://bychefwayan.com/$ob$, $ob$https://www.instagram.com/home.by.chefwayan/$ob$
where not exists (select 1 from venues where slug = $ob$home-by-chef-wayan$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$hungry-bird-coffee$ob$, $ob$Hungry Bird Coffee Roaster$ob$, $ob$cafe$ob$, $ob$canggu$ob$, $ob$Jl. Segara Perancak No.86, Tibubeneng, Kuta Utara, Badung Regency, Bali 80361, Indonesia$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Hungry%20Bird%20Coffee%20Roaster%20Canggu%20Bali$ob$, $ob$https://www.coffeeinsurrection.com/hungry-bird-coffee-roaster.html$ob$, $ob$https://www.instagram.com/hungrybirdcoffee/$ob$
where not exists (select 1 from venues where slug = $ob$hungry-bird-coffee$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$secret-spot-bali$ob$, $ob$Secret Spot$ob$, $ob$cafe$ob$, $ob$canggu$ob$, $ob$Jl. Tanah Barak No. 7, Canggu, Kec. Kuta Utara, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Secret%20Spot%20Canggu%20Tanah%20Barak%20Bali$ob$, $ob$https://www.instagram.com/secretspot.bali/$ob$, $ob$https://www.instagram.com/secretspot.bali/$ob$
where not exists (select 1 from venues where slug = $ob$secret-spot-bali$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$sushimi-bali$ob$, $ob$Sushimi Bali$ob$, $ob$restaurant$ob$, $ob$canggu$ob$, $ob$Jl. Pantai Berawa No.101C, Tibubeneng, Kuta Utara, Badung Regency, Bali 80361, Indonesia$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Sushimi%20Berawa%20Canggu%20Bali$ob$, $ob$http://www.sushimibali.com/$ob$, $ob$https://www.instagram.com/sushimibali/$ob$
where not exists (select 1 from venues where slug = $ob$sushimi-bali$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$the-loft-bali$ob$, $ob$The Loft$ob$, $ob$cafe$ob$, $ob$canggu$ob$, $ob$Jl. Pantai Batu Bolong No. 50A, Canggu, Kec. Kuta Utara, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/place/The+Loft+Canggu/@-8.6509484,115.1334429,17z/data=!3m1!4b1!4m5!3m4!1s0x2dd2387eacbd2f6d:0xa70ea493a2c5a8d0!8m2!3d-8.6509484!4d115.1356316$ob$, $ob$https://linktr.ee/theloftbali$ob$, $ob$https://www.instagram.com/theloftbali/$ob$
where not exists (select 1 from venues where slug = $ob$the-loft-bali$ob$);

-- ---------- denpasar (2) ----------
insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$ayam-betutu-khas-gilimanuk$ob$, $ob$Ayam Betutu Khas Gilimanuk$ob$, $ob$restaurant$ob$, $ob$denpasar$ob$, $ob$Jl. Merdeka No. 88, Renon, Denpasar Timur, Kota Denpasar, Bali 80235$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Ayam%20Betutu%20Khas%20Gilimanuk%20Merdeka%20Renon%20Denpasar%20Bali$ob$, $ob$http://betutugilimanuk.com/$ob$, $ob$https://www.instagram.com/ayambetutugilimanuk_/$ob$
where not exists (select 1 from venues where slug = $ob$ayam-betutu-khas-gilimanuk$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$warung-wardani$ob$, $ob$Warung Wardani$ob$, $ob$warung$ob$, $ob$denpasar$ob$, $ob$Jl. Yudistira No.2, Dangin Puri Kauh, Kec. Denpasar Utara, Kota Denpasar, Bali 80232$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Warung%20Wardani%20Yudistira%20Denpasar%20Bali$ob$, null, $ob$https://www.instagram.com/warungwardanibali/$ob$
where not exists (select 1 from venues where slug = $ob$warung-wardani$ob$);

-- ---------- jimbaran (1) ----------
insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$menega-cafe$ob$, $ob$Menega Cafe$ob$, $ob$restaurant$ob$, $ob$jimbaran$ob$, $ob$Muaya Beach (Pantai Muaya), Jimbaran, Kec. Kuta Selatan, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Menega%20Cafe%20Muaya%20Beach%20Jimbaran%20Bali$ob$, null, null
where not exists (select 1 from venues where slug = $ob$menega-cafe$ob$);

-- ---------- seminyak (7) ----------
insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$bossman-burgers$ob$, $ob$BO$$MAN$ob$, $ob$restaurant$ob$, $ob$seminyak$ob$, $ob$Jl. Kayu Cendana No. 8B, Seminyak, Kec. Kuta Utara, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=BOSSMAN%20Burgers%20Kayu%20Cendana%20Seminyak%20Bali$ob$, $ob$https://bossmanbali.com/$ob$, $ob$https://www.instagram.com/bossmanbali/$ob$
where not exists (select 1 from venues where slug = $ob$bossman-burgers$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$expat-roasters$ob$, $ob$Expat. Roasters$ob$, $ob$cafe$ob$, $ob$seminyak$ob$, $ob$Jl. Petitenget No. 1A, Kerobokan Kelod, Kec. Kuta Utara, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Expat%20Roasters%20Petitenget%20Seminyak%20Bali$ob$, $ob$https://expatroasters.com/$ob$, null
where not exists (select 1 from venues where slug = $ob$expat-roasters$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$gusto-gelato$ob$, $ob$Gusto Gelato & Caffe$ob$, $ob$cafe$ob$, $ob$seminyak$ob$, $ob$Jl. Mertanadi No.46B, Kerobokan Kelod, Kec. Kuta Utara, Kabupaten Badung, Bali 80361, Indonesia$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Gusto%20Gelato%20Caffe%20Mertanadi%20Kerobokan%20Bali$ob$, $ob$https://gusto-gelateria.com/$ob$, $ob$https://www.instagram.com/gustogelatocaffe/$ob$
where not exists (select 1 from venues where slug = $ob$gusto-gelato$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$motel-mexicola$ob$, $ob$Motel Mexicola$ob$, $ob$restaurant$ob$, $ob$seminyak$ob$, $ob$Jl. Kayu Jati No.9, Petitenget, Seminyak, Kuta, Badung Regency, Bali 80361, Indonesia$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Motel%20Mexicola%20Seminyak%20Bali$ob$, $ob$https://motelmexicola.info/$ob$, $ob$https://www.instagram.com/motelmexicola/$ob$
where not exists (select 1 from venues where slug = $ob$motel-mexicola$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$nalu-bowls$ob$, $ob$Nalu Bowls$ob$, $ob$cafe$ob$, $ob$seminyak$ob$, $ob$Jl. Drupadi 1 No.2A, Seminyak, Kec. Kuta, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Nalu%20Bowls%20Seminyak%20Drupadi%20Bali$ob$, $ob$https://nalubowls.com/$ob$, $ob$https://www.instagram.com/nalubowls/$ob$
where not exists (select 1 from venues where slug = $ob$nalu-bowls$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$saigon-street$ob$, $ob$Saigon Street$ob$, $ob$restaurant$ob$, $ob$seminyak$ob$, $ob$Jl. Petitenget No. 77X, Kerobokan, Kec. Kuta Utara, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Saigon%20Street%20Petitenget%20Seminyak%20Bali$ob$, $ob$https://www.facebook.com/saigonstreetbali/$ob$, null
where not exists (select 1 from venues where slug = $ob$saigon-street$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$vincent-nigita$ob$, $ob$Vincent Nigita$ob$, $ob$cafe$ob$, $ob$seminyak$ob$, $ob$Kanvaz Village Resort, Jl. Petitenget No. 188, Seminyak, Kec. Kuta Utara, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Kanvaz%20Patisserie%20Vincent%20Nigita%20Petitenget%20Seminyak%20Bali$ob$, $ob$https://vincentnigita.com/$ob$, $ob$https://www.instagram.com/kanvazpatisserievincentnigita/$ob$
where not exists (select 1 from venues where slug = $ob$vincent-nigita$ob$);

-- ---------- ubud (6) ----------
insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$bebek-bengil$ob$, $ob$Bebek Bengil$ob$, $ob$restaurant$ob$, $ob$ubud$ob$, $ob$Jl. Hanoman, Padang Tegal, Ubud, Gianyar Regency, Bali 80571, Indonesia$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Bebek%20Bengil%20Dirty%20Duck%20Diner%20Padang%20Tegal%20Ubud%20Bali$ob$, $ob$https://www.bebekbengil.co.id/en$ob$, $ob$https://www.instagram.com/bebekbengilrestaurant/$ob$
where not exists (select 1 from venues where slug = $ob$bebek-bengil$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$kilig-bali$ob$, $ob$Kilig Bali$ob$, $ob$restaurant$ob$, $ob$ubud$ob$, $ob$Jl. Raya Goa Gajah No.94, Peliatan, Ubud, Kec. Ubud, Kabupaten Gianyar, Bali 80582$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Kilig%20Filipino%20Warung%20Ubud%20Bali$ob$, $ob$https://kiligbali.com$ob$, $ob$https://www.instagram.com/kiligbali/$ob$
where not exists (select 1 from venues where slug = $ob$kilig-bali$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$melting-wok-warung$ob$, $ob$Melting Wok Warung$ob$, $ob$restaurant$ob$, $ob$ubud$ob$, $ob$Jl. Gootama No.13, Ubud, Kec. Ubud, Gianyar Regency, Bali 80571, Indonesia$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Melting%20Wok%20Warung%20Jalan%20Gootama%20Ubud%20Bali$ob$, $ob$https://www.instagram.com/melting_wok_warung/$ob$, $ob$https://www.instagram.com/melting_wok_warung/$ob$
where not exists (select 1 from venues where slug = $ob$melting-wok-warung$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$sayuri-healing-food$ob$, $ob$Sayuri Healing Food$ob$, $ob$cafe$ob$, $ob$ubud$ob$, $ob$Jl. Sukma Kesuma No.2, Peliatan, Ubud, Gianyar Regency, Bali 80571, Indonesia$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Sayuri%20Healing%20Food%20Peliatan%20Ubud%20Bali$ob$, $ob$https://sayurihealingfood.com/$ob$, $ob$https://www.instagram.com/sayuri_healing_food/$ob$
where not exists (select 1 from venues where slug = $ob$sayuri-healing-food$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$tukies-coconut-shop$ob$, $ob$Tukies Coconut Shop$ob$, $ob$cafe$ob$, $ob$ubud$ob$, $ob$Jl. Monkey Forest No.15, Ubud, Gianyar Regency, Bali 80571, Indonesia$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Tukies%20Coconut%20Shop%20Monkey%20Forest%20Ubud%20Bali$ob$, $ob$https://www.facebook.com/tukies.online/$ob$, $ob$https://www.instagram.com/tukiescoconutshop/$ob$
where not exists (select 1 from venues where slug = $ob$tukies-coconut-shop$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$warung-biah-biah$ob$, $ob$Warung Biah Biah$ob$, $ob$warung$ob$, $ob$ubud$ob$, $ob$Jl. Goutama Sel. No.13, Ubud, Kecamatan Ubud, Kabupaten Gianyar, Bali 80571, Indonesia$ob$, $ob$https://www.google.com/maps/place/Warung+Biah+Biah/@-8.5093263,115.2620118,17z/data=!3m1!4b1!4m5!3m4!1s0x2dd23d6bba632509:0x6d31d114697259f4!8m2!3d-8.5093401!4d115.2642563$ob$, $ob$https://www.facebook.com/warungbiahbiah/$ob$, $ob$https://www.instagram.com/warung_biahbiah/$ob$
where not exists (select 1 from venues where slug = $ob$warung-biah-biah$ob$);

-- ---------- uluwatu-bukit (2) ----------
insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$drifter-surf-cafe$ob$, $ob$Drifter Surf Shop & Cafe$ob$, $ob$cafe$ob$, $ob$uluwatu-bukit$ob$, $ob$Jl. Labuansait No.52, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Drifter%20Surf%20Shop%20Cafe%20Uluwatu%20Bali$ob$, $ob$https://driftersurf.com/pages/cafe$ob$, $ob$https://www.instagram.com/driftersurfshop/$ob$
where not exists (select 1 from venues where slug = $ob$drifter-surf-cafe$ob$);

insert into venues (id, slug, name, category, district, address, gmaps_url, official_url, instagram_url)
select gen_random_uuid()::text, $ob$the-cashew-tree$ob$, $ob$The Cashew Tree$ob$, $ob$cafe$ob$, $ob$uluwatu-bukit$ob$, $ob$Jl. Pantai Bingin No.9, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/place/The+Cashew+Tree/@-8.8084415,115.112652,17z/data=!4m6!3m5!1s0x2dd245479b8f1853:0xc76fa2acc632056a!8m2!3d-8.8069026!4d115.1170434!16s/g/11byck_jvr$ob$, null, $ob$https://www.instagram.com/thecashewtree.collective/$ob$
where not exists (select 1 from venues where slug = $ob$the-cashew-tree$ob$);

commit;
