-- 0041_insert_kora_chain_venues.sql
-- Insert 5 confirmed-in-Bali Indonesian F&B CHAIN outlets from the KORA prospects list
-- as DECISION-READY rows: web-verified currently-operating Bali outlet with a specific
-- street address + Google Maps link (research pass 2026-07-19) AND editorial in the
-- Other Bali voice (why_its_here / best_for / not_for / what_to_order / price_anchor /
-- area / jobs).
--
-- Each row is a chain, framed honestly as such (reliable/everyday, not a hidden find).
-- Guardrails held: no Google ratings/review counts; downsides only as fit-context
-- 'not_for'; prices as bands (never live menus); English only; jobs restricted to the
-- canonical set; official_url/instagram_url left null where a handle could not be
-- verified (no invented links). Photos NOT touched (none published without consent).
--
-- Repo convention (cf. 0031/0039): inserted at column-default publication_status =
-- 'review' (status 'active') — in the catalogue but NOT public until 0042 flips to
-- 'published'. Idempotent via `where not exists (slug)`. Production apply is a founder step.
--
-- Sources (per venue, research 2026-07-19):
--   toko-kopi-tuku     Kompas 2025-10-09 (first Bali store, Renon) — confidence high
--   sate-khas-senayan  Beachwalk official mall directory (unit L1 #E-22) — confidence high
--   bakso-boedjangan   baksoboedjangan.id locator + RadarBali (Jimbaran, outlet #61,
--                      opened 2025-05-30 — chosen over the Kuta outlet, which one
--                      aggregator flagged possibly-closed) — confidence high
--   gildak             PatroliPost + official FB 'Gildak Tukad Gangga Renon' — confidence high
--   fore-coffee        multiple Bali directory/news sources (Jimbaran outlet) — confidence high
--
-- Held OUT (needs_verification, NOT inserted — delivery-only / cloud-kitchen / stale
-- medium-confidence directory data): dailybox (delivery-focused, 2022-23 data),
-- bittersweet-by-najla (dessert-box brand, unreconfirmed), hangry / moon-chicken
-- (delivery-only cloud kitchen, no firm 2026 Bali kitchen), kurasu-bali (Pererenan
-- permanence still slightly ambiguous vs. ended Ubud pop-up).

begin;

-- ---------- denpasar (2) ----------
insert into venues (id, slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, not_for, what_to_order, price_anchor, jobs)
select gen_random_uuid()::text, $ob$toko-kopi-tuku$ob$, $ob$Toko Kopi Tuku$ob$, $ob$cafe$ob$, $ob$denpasar$ob$, $ob$Renon (Jl. Raya Puputan), Denpasar$ob$, $ob$Jl. Raya Puputan No. 10, Renon, Denpasar Selatan, Kota Denpasar, Bali 80234$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Toko%20Kopi%20Tuku%20Renon%20Denpasar%20Bali$ob$, null, null, $ob$Jakarta's cult neighbourhood coffee brand, here in its first Bali store, built around the Es Kopi Susu Tetangga — palm-sugar milk coffee — that made Tuku famous. The Renon outlet keeps the everyday, grab-and-go format on a quiet government-district street rather than the tourist strip.$ob$, $ob$an everyday palm-sugar milk coffee; a quick caffeine stop in Denpasar; coffee to go away from the tourist areas$ob$, $ob$a sit-down brunch or full meal; sunset or view seekers; anyone after alcohol or a bar scene$ob$, $ob$Es Kopi Susu Tetangga (palm-sugar milk coffee); Kopi Tetangga variants; light roti and snacks$ob$, $ob$$$ob$, array['local_food_calm']::text[]
where not exists (select 1 from venues where slug = $ob$toko-kopi-tuku$ob$);

insert into venues (id, slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, not_for, what_to_order, price_anchor, jobs)
select gen_random_uuid()::text, $ob$gildak-renon$ob$, $ob$Gildak$ob$, $ob$restaurant$ob$, $ob$denpasar$ob$, $ob$Renon (Jl. Tukad Gangga), Denpasar$ob$, $ob$Jl. Tukad Gangga No. 10X, Renon, Denpasar Selatan, Kota Denpasar, Bali 80226$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Gildak%20Tukad%20Gangga%20Renon%20Denpasar%20Bali$ob$, null, null, $ob$A Korean street-food chain (Nikmat Group) known for spicy corndogs, tteokbokki and sausages aimed at a young, casual crowd. The Renon outlet brings the grab-and-snack Korean street format to Denpasar at pocket-money prices.$ob$, $ob$a casual Korean street-food snack; spicy corndogs and tteokbokki; a cheap bite with friends$ob$, $ob$a full sit-down dinner; a quiet or refined setting; anyone avoiding spice or after alcohol$ob$, $ob$Korean corndog (gildak); tteokbokki (spicy rice cakes); cheese-filled corndog; Korean sausages$ob$, $ob$$$ob$, array['local_food_calm','group_dinner_share']::text[]
where not exists (select 1 from venues where slug = $ob$gildak-renon$ob$);

-- ---------- kuta-legian (1) ----------
insert into venues (id, slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, not_for, what_to_order, price_anchor, jobs)
select gen_random_uuid()::text, $ob$sate-khas-senayan-beachwalk$ob$, $ob$Sate Khas Senayan$ob$, $ob$restaurant$ob$, $ob$kuta-legian$ob$, $ob$Beachwalk mall, Kuta$ob$, $ob$Beachwalk Shopping Center, Level 1 #E-22, Jl. Pantai Kuta, Kuta, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Sate%20Khas%20Senayan%20Beachwalk%20Kuta%20Bali$ob$, null, null, $ob$A long-running Indonesian restaurant chain (Sarirasa Group) serving dependable, authentic classics — satay, soto, gado-gado — in an air-conditioned mall setting steps from Kuta beach. It's the reliable, family-safe Indonesian meal when you want the real thing without hunting for a warung.$ob$, $ob$a dependable Indonesian meal in air-conditioning; families and just-landed first dinners; a safe introduction to Indonesian classics near Kuta$ob$, $ob$warung prices; a romantic or scenic setting; travellers seeking a hidden local find$ob$, $ob$sate ayam with peanut sauce; sop buntut (oxtail soup); gado-gado; ayam goreng kremes; nasi kuning$ob$, $ob$$$$ob$, array['family_early_dinner','just_landed_easy_dinner','group_dinner_share']::text[]
where not exists (select 1 from venues where slug = $ob$sate-khas-senayan-beachwalk$ob$);

-- ---------- jimbaran (2) ----------
insert into venues (id, slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, not_for, what_to_order, price_anchor, jobs)
select gen_random_uuid()::text, $ob$bakso-boedjangan-jimbaran$ob$, $ob$Bakso Boedjangan$ob$, $ob$restaurant$ob$, $ob$jimbaran$ob$, $ob$Jimbaran (Jl. Raya Kampus Unud)$ob$, $ob$Jl. Raya Kampus Unud, Jimbaran, Kec. Kuta Selatan, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Bakso%20Boedjangan%20Jimbaran%20Kampus%20Unud%20Bali$ob$, null, null, $ob$A popular Indonesian bakso (meatball) chain — hearty and affordable — whose Jimbaran outlet opened in 2025. The draw is generous meatball bowls, including wagyu bakso, in comforting well-priced broth.$ob$, $ob$a cheap, comforting bowl of bakso; a quick casual local meal; groups after affordable Indonesian comfort food$ob$, $ob$fine dining or a scenic view; vegetarians, since it is broth- and meat-based; a quiet romantic dinner$ob$, $ob$bakso wagyu; bakso urat (tendon meatballs); bakso goreng; mie ayam bakso$ob$, $ob$$$ob$, array['local_food_calm','just_landed_easy_dinner','group_dinner_share']::text[]
where not exists (select 1 from venues where slug = $ob$bakso-boedjangan-jimbaran$ob$);

insert into venues (id, slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, not_for, what_to_order, price_anchor, jobs)
select gen_random_uuid()::text, $ob$fore-coffee-jimbaran$ob$, $ob$Fore Coffee$ob$, $ob$cafe$ob$, $ob$jimbaran$ob$, $ob$Jimbaran (Jl. Raya Kampus Unud)$ob$, $ob$Jl. Raya Kampus Unud No. 18-109, Jimbaran, Kec. Kuta Selatan, Kabupaten Badung, Bali 80361$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Fore%20Coffee%20Jimbaran%20Kampus%20Unud%20Bali$ob$, null, null, $ob$One of Indonesia's largest specialty-coffee chains — reliable and affordable, with several Bali outlets. Fore pulls consistent everyday espresso and signature palm-sugar (aren) lattes in a modern grab-and-go format.$ob$, $ob$a reliable, affordable specialty coffee; a quick aren latte on the go; an everyday caffeine fix$ob$, $ob$a destination-café ambience; a food-forward brunch; a quiet, design-led room for a long laptop session$ob$, $ob$Aren Latte (palm sugar); Butterscotch Sea Salt Latte; cold brew; classic espresso$ob$, $ob$$$ob$, array['local_food_calm','quiet_work_cafe']::text[]
where not exists (select 1 from venues where slug = $ob$fore-coffee-jimbaran$ob$);

commit;
