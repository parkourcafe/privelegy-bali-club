-- aug-import-editorial: why_its_here / best_for / not_for for the August BPC import.
-- Date: 2026-08-10. Target: /places/[slug] detail pages, district hubs, /places explorer.
--
-- WHY THIS BATCH EXISTS
-- 61 rows imported on 2026-08-04 sit active+published with empty why_its_here and
-- best_for. lib/publication.ts holds them at review -> 404 + noindex, by design.
-- Filling the two fields opens them with no deploy (route is force-dynamic, 5-min cache).
--
-- PROVENANCE
-- rung 1  venue's own site / own booking page / own about page
-- rung 2  restatement of facts the sources above state, recast as fit context
-- No rung 3. Nothing here was inferred from atmosphere, ratings or reviews.
-- Collected 2026-08-10 by web search from: venue official sites (thewonderspace.com,
-- loopbali.com, antspantsbali.com, laterrazzauluwatu.com, ulabali.com, mapogu.com,
-- signa.cafe, brie.chaika.team, ju-bali.com, anwabali.com, lemanjabali.com,
-- jungleclububud.com, sevenpaintingsubud.com, dusunbedugulasri.com,
-- thelittlehillterrace.com, ngiringngewedang.com, at06bali.com, dodopizza.co.id,
-- caminobali.com, izzibali.com, brookbali.com, piasanrestaurant.com,
-- laportaltoshamballah.com, mamulounge.com, humansbali.com, tothemoonbali.com,
-- artisangroup.id, amavicanggu.grandcentralgroup.co.id), plus dated editorial guides
-- for opening facts (balibuddies, thehoneycombers, spiritedasia, luxuriousmagazine).
-- Full raw capture: data/data-ops/aug-import-editorial/collected-raw.json
--
-- last_verified_at: NOT TOUCHED. This is editorial writing over collected public copy,
-- not a re-verification visit. Bumping it would corrupt sitemap lastmod and the public
-- "Last checked" line.
--
-- publication_status: NOT TOUCHED anywhere in this file.
--
-- EXCLUDED ON PURPOSE (8 of 61) - no publishable source found, so the fields stay null
-- and the gate keeps them at review, which is correct:
--   kopiten, blu-cafe-chef-made, momento-daily-resto, nuna-bali, wohl-cafe,
--   xo-rooftop, gains
--   white-water-bingin - ALSO an operating-status question: 48 structures on Bingin
--   beach were demolished in July 2025 and rebuild only began May 2026. Verify the
--   venue still exists before anything is written. Do not publish on assumption.
--
-- Re-run safety: every statement is guarded on the field still being empty.

begin;

-- amavi-canggu-bali
update venues set why_its_here = 'Restaurant, bar lounge and pool on Jl. Pantai Berawa. Mediterranean concept with rice field views. The menu runs from nasi goreng and sate ayam to Angus ribeye and pizza.'
  where slug = 'amavi-canggu-bali' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Long lunches by the pool with a rice field view'
  where slug = 'amavi-canggu-bali' and (best_for is null or length(trim(best_for)) = 0);

-- ankhusa-restaurant-ubud-by-wonderspace
update venues set why_its_here = 'Restaurant at Aksari Resort in Kenderan, north of Ubud. Balinese, Indonesian and international dishes: roast duck, chicken satay, nasi goreng, oxtail. Royal Dining follows the Balinese megibung tradition and is served as a shared feast. Outdoor tables face the jungle.'
  where slug = 'ankhusa-restaurant-ubud-by-wonderspace' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A shared Balinese feast with a group'
  where slug = 'ankhusa-restaurant-ubud-by-wonderspace' and (best_for is null or length(trim(best_for)) = 0);

-- ants-pants-uluwatu
update venues set why_its_here = 'Restaurant and pool at Family Nest Villas near Bingin. Contemporary Australian cooking, breakfast all day and pizza from midday. The ground floor is open-air; upstairs is an air-conditioned coworking room. Poolside cabanas and sunbeds are held with a deposit that comes off the bill.'
  where slug = 'ants-pants-uluwatu' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A work morning that ends by the pool'
  where slug = 'ants-pants-uluwatu' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'Dinner - the kitchen stops at 19:00'
  where slug = 'ants-pants-uluwatu' and (not_for is null or length(trim(not_for)) = 0);

-- artisan-pererenan
update venues set why_its_here = 'Modern Italian cooking in Pererenan. The fourth Artisan outlet on the island, after Uluwatu, Ungasan and Bingin. Golden risotto with grilled prawn, and gnocchi with duck and porcini ragu.'
  where slug = 'artisan-pererenan' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A sit-down Italian dinner in Pererenan'
  where slug = 'artisan-pererenan' and (best_for is null or length(trim(best_for)) = 0);

-- at06
update venues set why_its_here = 'Restaurant, coworking space and gym on one site in Canggu. European-Asian menu with vegetarian and vegan options. The gym has a cold plunge and a jacuzzi. Rebranded from Kajan Eatery in September 2024.'
  where slug = 'at06' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A work morning and a gym session in the same place'
  where slug = 'at06' and (best_for is null or length(trim(best_for)) = 0);

-- bistro-anwa
update venues set why_its_here = 'Western bistro on the ground floor of Anwa Bali in Umalas. Organic and fresh ingredients, from all-day brunch to pizza and pasta. Resident chef Josh came from Byron Bay. A rooftop bar and a spa sit upstairs.'
  where slug = 'bistro-anwa' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Brunch that runs into a spa afternoon'
  where slug = 'bistro-anwa' and (best_for is null or length(trim(best_for)) = 0);

-- brie-restaurant-and-cheesery
update venues set why_its_here = 'The only restaurant in Bali with its own cheesery. Milk comes from the group''s farm in Java and becomes cheese within twelve hours, five times a week. Cheese board, truffle tagliatelle, brie burger and house burrata. The open kitchen is downstairs, the bar above.'
  where slug = 'brie-restaurant-and-cheesery' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Anyone who came to Bali and misses cheese'
  where slug = 'brie-restaurant-and-cheesery' and (best_for is null or length(trim(best_for)) = 0);

-- brook-nusa-dua
update venues set why_its_here = 'Restaurant in Benoa with a panoramic view of the Garuda statue, the ocean and the airport runway. American, European, Russian, Ukrainian and Asian dishes. Vintage Brooklyn styling and signature cocktails.'
  where slug = 'brook-nusa-dua' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Sunset drinks with a view of the runway'
  where slug = 'brook-nusa-dua' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'Breakfast or lunch - it opens at 14:00'
  where slug = 'brook-nusa-dua' and (not_for is null or length(trim(not_for)) = 0);

-- camino-resto-and-bar
update venues set why_its_here = 'Mediterranean kitchen in Jimbaran built around a grill and a smoker. Frutti di mare pasta, grilled fish and salmon. Molten lava cake for dessert.'
  where slug = 'camino-resto-and-bar' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A grilled seafood dinner in Jimbaran'
  where slug = 'camino-resto-and-bar' and (best_for is null or length(trim(best_for)) = 0);

-- cantina-classe-canggu
update venues set why_its_here = 'Italian restaurant on Jl. Canggu Padang Linjong, part of the Wonderspace group. Handmade pizza and fresh pasta. Fettuccine truffle carbonara and a four-cheese pizza are on the menu.'
  where slug = 'cantina-classe-canggu' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Pizza and pasta after a day at Batu Bolong'
  where slug = 'cantina-classe-canggu' and (best_for is null or length(trim(best_for)) = 0);

-- cantina-classe-ubud
update venues set why_its_here = 'Italian restaurant in Payangan, north-west of Ubud, part of the Wonderspace group. Handmade pizza and pasta, including fettuccine truffle carbonara and a four-cheese pizza.'
  where slug = 'cantina-classe-ubud' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Italian food on the road through Payangan'
  where slug = 'cantina-classe-ubud' and (best_for is null or length(trim(best_for)) = 0);

-- cemara-point-by-dusun-bedugul-asri
update venues set why_its_here = 'Bar at Dusun Bedugul Asri in Candikuning. It stands between a koi pond and a vineyard, inside a flower garden. Wine, tea and light snacks, with workshops on the schedule. Dapur Cemara is the resort''s main restaurant.'
  where slug = 'cemara-point-by-dusun-bedugul-asri' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A glass of wine in the Bedugul cool'
  where slug = 'cemara-point-by-dusun-bedugul-asri' and (best_for is null or length(trim(best_for)) = 0);

-- de-maison-bali-restaurant-and-bar
update venues set why_its_here = 'Coffee shop on Jl. Tukad Badung in Renon, Denpasar.'
  where slug = 'de-maison-bali-restaurant-and-bar' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Working from a cafe in Denpasar'
  where slug = 'de-maison-bali-restaurant-and-bar' and (best_for is null or length(trim(best_for)) = 0);

-- dewas-landing-cafe
update venues set why_its_here = 'Cafe on Jl. Raya Uluwatu in Pecatu. A local gathering point that runs football watch parties.'
  where slug = 'dewas-landing-cafe' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Watching a match with the Pecatu crowd'
  where slug = 'dewas-landing-cafe' and (best_for is null or length(trim(best_for)) = 0);

-- dodo-pizza
update venues set why_its_here = 'Pizzeria on Jl. Anggrek, part of the Dodo chain. Dine-in and delivery. The delivery promise is 30 minutes, with a free-pizza code if it runs late.'
  where slug = 'dodo-pizza' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A pizza delivered to the villa'
  where slug = 'dodo-pizza' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'An independent kitchen - this is an international chain'
  where slug = 'dodo-pizza' and (not_for is null or length(trim(not_for)) = 0);

-- focaccia-buddies
update venues set why_its_here = 'Focaccia sandwiches in Pererenan, run by two friends. Toppings include mortadella and stracciatella, and you can build your own. Coffee and matcha alongside.'
  where slug = 'focaccia-buddies' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A sandwich and coffee between surfs'
  where slug = 'focaccia-buddies' and (best_for is null or length(trim(best_for)) = 0);

-- habitat-bistro
update venues set why_its_here = 'Bistro on Jl. Bisma with a jungle view, a pool and hammock beds. French and Italian cooking: handmade pasta, wood-fired pizza, antipasti. Lobster spaghetti with Calabrian chilli, ribeye with herb butter, roast salmon with cauliflower puree.'
  where slug = 'habitat-bistro' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A long lunch by a pool in central Ubud'
  where slug = 'habitat-bistro' and (best_for is null or length(trim(best_for)) = 0);

-- home-cafe-mengwi
update venues set why_its_here = 'Cafe in Tiying Tutul, Pererenan. The kitchen describes its own cooking as healthy brunch.'
  where slug = 'home-cafe-mengwi' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Brunch away from the Batu Bolong strip'
  where slug = 'home-cafe-mengwi' and (best_for is null or length(trim(best_for)) = 0);

-- humans-cafe
update venues set why_its_here = 'Cafe on Jl. Bali Cliff in Ungasan. Asian, Indonesian and European plates with specialty coffee. There is a playground for children.'
  where slug = 'humans-cafe' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Coffee while the children have somewhere to go'
  where slug = 'humans-cafe' and (best_for is null or length(trim(best_for)) = 0);

-- izzi-rooftop-lounge-and-restaurant-and-bar-and-shisha
update venues set why_its_here = 'Rooftop bar, restaurant and shisha lounge at Batu Belig Square. The shisha list runs past 200 tobaccos. Sunset view over the ocean, with DJs, board games and a PlayStation.'
  where slug = 'izzi-rooftop-lounge-and-restaurant-and-bar-and-shisha' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A late shisha night that starts at sunset'
  where slug = 'izzi-rooftop-lounge-and-restaurant-and-bar-and-shisha' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'Non-smokers and a quiet table - shisha is served throughout'
  where slug = 'izzi-rooftop-lounge-and-restaurant-and-bar-and-shisha' and (not_for is null or length(trim(not_for)) = 0);

-- ju-bali
update venues set why_its_here = 'Casual restaurant in Umalas with a jacuzzi club. International comfort food with a Balinese turn: pasta, burgers and wood-fired pizza. Vegetarian and vegan plates include tandoori cauliflower and mushroom tagliatelle. 200 seats, a kids menu and parking for cars and scooters.'
  where slug = 'ju-bali' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Families and groups who need space and parking'
  where slug = 'ju-bali' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'A quiet dinner for two - it seats 200 as a family venue'
  where slug = 'ju-bali' and (not_for is null or length(trim(not_for)) = 0);

-- jungle-flower-restaurant
update venues set why_its_here = 'Restaurant inside Jungle Flower Villas in Lodtunduh, open since 2024. Jungle setting south of central Ubud.'
  where slug = 'jungle-flower-restaurant' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A meal outside central Ubud'
  where slug = 'jungle-flower-restaurant' and (best_for is null or length(trim(best_for)) = 0);

-- kojin-teppanyaki-restaurant-ubud-by-wonderspace
update venues set why_its_here = 'Japanese restaurant at Kenderan, named after Kojin, a Japanese god of fire. Teppanyaki, kaiseki and omakase, cooked at the counter. Billed as the first irori grill in Bali. Open for lunch and dinner.'
  where slug = 'kojin-teppanyaki-restaurant-ubud-by-wonderspace' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A counter dinner watching the chef work'
  where slug = 'kojin-teppanyaki-restaurant-ubud-by-wonderspace' and (best_for is null or length(trim(best_for)) = 0);

-- la-portal-to-shamballah
update venues set why_its_here = 'Vegetarian restaurant and events space in Peliatan. Arabian, Indonesian and Asian dishes, with vegan and gluten-free options. Homemade bread, Euro-Arabia fusion plates and quesadillas. Live music, workshops and private healing rooms on site.'
  where slug = 'la-portal-to-shamballah' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A vegetarian dinner with live music'
  where slug = 'la-portal-to-shamballah' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'Diners set on meat - the kitchen is entirely vegetarian'
  where slug = 'la-portal-to-shamballah' and (not_for is null or length(trim(not_for)) = 0);

-- la-terrazza-uluwatu
update venues set why_its_here = 'Italian restaurant on the cliff above Suluban, started by two Italians from Pisa. Chef Lucia Nicolo works Italian tradition alongside international dishes. Tables sit at the cliff edge, so the pizza arrives with an ocean view. Breakfast through dinner, with a happy hour between.'
  where slug = 'la-terrazza-uluwatu' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Pizza at the cliff edge before sunset'
  where slug = 'la-terrazza-uluwatu' and (best_for is null or length(trim(best_for)) = 0);

-- lemanja-uluwatu
update venues set why_its_here = 'Cafe, bar and coworking space with a pool on Jl. Labuansait. Breakfast starts at 07:30, with plates from 20,000 IDR. Pan-grilled prawns and tuna tataki, vegan quesadillas and plant-based pizza. Pastries alongside the cocktail list.'
  where slug = 'lemanja-uluwatu' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'An early breakfast before the surf'
  where slug = 'lemanja-uluwatu' and (best_for is null or length(trim(best_for)) = 0);

-- loop-cafe
update venues set why_its_here = 'High-protein breakfast cafe in Pererenan. The menu is built on eggs, salmon, chicken, cottage cheese, Greek yoghurt, oats and sourdough. Six protein shakes for after training. Specialty coffee, smoothie bowls, wraps and vegan options.'
  where slug = 'loop-cafe' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Breakfast before the gym or after a surf'
  where slug = 'loop-cafe' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'Dinner - the kitchen closes at 18:00'
  where slug = 'loop-cafe' and (not_for is null or length(trim(not_for)) = 0);

-- made-s-bakery-cafe-playground
update venues set why_its_here = 'Bakery and cafe on Jl. Dharmawangsa in Ungasan, open since 2025 after growing out of a small warung. Pastries, desserts and coffee, with breakfast served all day and large portions. The playground is free to use.'
  where slug = 'made-s-bakery-cafe-playground' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Families who need the children occupied'
  where slug = 'made-s-bakery-cafe-playground' and (best_for is null or length(trim(best_for)) = 0);

-- mamu-ubud-cafe-shisha-hookah
update venues set why_its_here = 'Cafe and shisha lounge on Jl. Made Lebah in Mas. One of the widest shisha lists on the island, with Darkside, Musthave and Duft. Bowls, roasted vegetables, warm dips and shawarma. An air-conditioned lounge and a garden terrace.'
  where slug = 'mamu-ubud-cafe-shisha-hookah' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A long evening over shisha'
  where slug = 'mamu-ubud-cafe-shisha-hookah' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'Non-smokers and families - shisha is served throughout'
  where slug = 'mamu-ubud-cafe-shisha-hookah' and (not_for is null or length(trim(not_for)) = 0);

-- mapogu-coffee-and-eatery-mapogu-restaurant
update venues set why_its_here = 'Cafe and coworking space in Goa Gong, Jimbaran, open since 2022. Korean-leaning dishes alongside Indonesian and international plates. Free wifi, parking, and live music at weekends.'
  where slug = 'mapogu-coffee-and-eatery-mapogu-restaurant' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A work day in Jimbaran with lunch on site'
  where slug = 'mapogu-coffee-and-eatery-mapogu-restaurant' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'A Sunday visit - the kitchen is closed that day'
  where slug = 'mapogu-coffee-and-eatery-mapogu-restaurant' and (not_for is null or length(trim(not_for)) = 0);

-- mavammy
update venues set why_its_here = 'Cafe and patisserie on Jl. Pantai Batu Bolong. All-day breakfast and a dessert counter built on Belgian chocolate. Carrot cake with mango and passion fruit, and Lotus cheesecake. Strong wifi and air conditioning.'
  where slug = 'mavammy' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Cake and a laptop in the afternoon'
  where slug = 'mavammy' and (best_for is null or length(trim(best_for)) = 0);

-- norii-japanese-restaurant-seminyak
update venues set why_its_here = 'Japanese restaurant in Umalas, part of the Wonderspace group. Sushi, wagyu don and wagyu skewers. Robatayaki beef with charred vegetables. Cocktails built on yuzu, matcha and sake.'
  where slug = 'norii-japanese-restaurant-seminyak' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Wagyu and sushi close to Canggu'
  where slug = 'norii-japanese-restaurant-seminyak' and (best_for is null or length(trim(best_for)) = 0);

-- norii-japanese-restaurant-ubud
update venues set why_its_here = 'Japanese restaurant in Peliatan, part of the Wonderspace group. Sushi, wagyu don, wagyu skewers and robatayaki beef. Cocktails built on yuzu, matcha and sake.'
  where slug = 'norii-japanese-restaurant-ubud' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A Japanese dinner east of central Ubud'
  where slug = 'norii-japanese-restaurant-ubud' and (best_for is null or length(trim(best_for)) = 0);

-- paed-thai-canggu
update venues set why_its_here = 'Thai restaurant on Jl. Canggu Padang Linjong, part of the Wonderspace group. Tom yum goong, pad thai, green curry and mango sticky rice. Indoor and outdoor seating facing rice fields.'
  where slug = 'paed-thai-canggu' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Thai food at the end of a Canggu day'
  where slug = 'paed-thai-canggu' and (best_for is null or length(trim(best_for)) = 0);

-- pak-gula
update venues set why_its_here = 'Two-storey restaurant in Bingin from the team behind The Cashew Tree. Sharing plates: char siu pork bao, vegetable dumplings, chicken satay, braised beef curry. The ground floor is casual; upstairs is a dinner room with low light, communal tables and a bar.'
  where slug = 'pak-gula' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A shared dinner in Bingin'
  where slug = 'pak-gula' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'Walking in at dinner - booking is recommended'
  where slug = 'pak-gula' and (not_for is null or length(trim(not_for)) = 0);

-- piasan-nusa-dua-restaurant-piasan-restaurant
update venues set why_its_here = 'Italian restaurant in the BTDC area of Nusa Dua, at Kayumanis. The dining room is built from over 15,000 bamboo stems, with floating partitions and a raised ceiling. The name comes from a Balinese term for a ceremonial structure.'
  where slug = 'piasan-nusa-dua-restaurant-piasan-restaurant' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'An Italian dinner in Nusa Dua'
  where slug = 'piasan-nusa-dua-restaurant-piasan-restaurant' and (best_for is null or length(trim(best_for)) = 0);

-- porch
update venues set why_its_here = 'Coffee shop on Jl. Raya Semat. Thirteen kinds of cheesecake are the reason to come.'
  where slug = 'porch' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Coffee and cheesecake'
  where slug = 'porch' and (best_for is null or length(trim(best_for)) = 0);

-- rotisserie-by-cashew-tree
update venues set why_its_here = 'Rotisserie from The Cashew Tree in Pecatu. Slow-roasted meats with fresh sides and sauces.'
  where slug = 'rotisserie-by-cashew-tree' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A plate of roast meat after the beach'
  where slug = 'rotisserie-by-cashew-tree' and (best_for is null or length(trim(best_for)) = 0);

-- seabird-bistro-and-coworking-canggu-by-wonderspace
update venues set why_its_here = 'Bistro and coworking space on Jl. Nelayan, part of the Wonderspace group. Italian comfort food with a French turn: grilled lobster tagliatelle, wagyu steak frites, rigatoni vodka. Vegetarian and vegan options, local wines and cocktails.'
  where slug = 'seabird-bistro-and-coworking-canggu-by-wonderspace' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A working morning that turns into lunch'
  where slug = 'seabird-bistro-and-coworking-canggu-by-wonderspace' and (best_for is null or length(trim(best_for)) = 0);

-- secret-garden-restaurant
update venues set why_its_here = 'Family-run restaurant in Anturan, Lovina, set in a garden. Indonesian and Western dishes with a separate vegetarian menu. Seafood curry and goulash are regulars. Free pick-up and drop-off for guests staying in Lovina.'
  where slug = 'secret-garden-restaurant' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Dinner on a Lovina evening'
  where slug = 'secret-garden-restaurant' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'Breakfast or a daytime stop - it opens at 17:00'
  where slug = 'secret-garden-restaurant' and (not_for is null or length(trim(not_for)) = 0);

-- seven-paintings-ubud-restaurant
update venues set why_its_here = 'A seven-course dinner staged as a show. Each course is matched to an artist, from Michelangelo to Van Gogh, against 3D projections. Sixteen seats a session, Tuesday to Sunday. Doors at 18:00, the show starts at 19:00.'
  where slug = 'seven-paintings-ubud-restaurant' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A booked-ahead dinner for an occasion'
  where slug = 'seven-paintings-ubud-restaurant' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'Children under six and walk-ins - seats are booked ahead'
  where slug = 'seven-paintings-ubud-restaurant' and (not_for is null or length(trim(not_for)) = 0);

-- shichirin-japanese-restaurant-canggu
update venues set why_its_here = 'Japanese grill restaurant in Berawa, part of the Wonderspace group. Teppanyaki, gyukatsu and izakaya plates, with sushi and sashimi. Black cod in saikyo miso and breaded Santuri wagyu are signatures.'
  where slug = 'shichirin-japanese-restaurant-canggu' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A grill dinner with a group'
  where slug = 'shichirin-japanese-restaurant-canggu' and (best_for is null or length(trim(best_for)) = 0);

-- shichirin-japanese-restaurant-seminyak
update venues set why_its_here = 'Japanese grill restaurant on Jl. Dewi Saraswati, open since January 2025. The third Shichirin on the island, after Ubud and Canggu. Teppanyaki, gyukatsu, sushi and sashimi.'
  where slug = 'shichirin-japanese-restaurant-seminyak' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A Japanese grill dinner in Seminyak'
  where slug = 'shichirin-japanese-restaurant-seminyak' and (best_for is null or length(trim(best_for)) = 0);

-- shichirin-japanese-restaurant-ubud
update venues set why_its_here = 'The first Shichirin on the island, on Jl. Bisma. Japanese grill cooking: teppanyaki, gyukatsu and izakaya plates, with sushi and sashimi.'
  where slug = 'shichirin-japanese-restaurant-ubud' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A Japanese grill dinner in central Ubud'
  where slug = 'shichirin-japanese-restaurant-ubud' and (best_for is null or length(trim(best_for)) = 0);

-- signa-cafe
update venues set why_its_here = 'Family-run cafe on Jl. Raya Kampial in Benoa. Coffee, gourmet pizza, pasta and all-day breakfast. Wraps, desserts and cocktails. Dine-in, delivery and takeaway.'
  where slug = 'signa-cafe' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'All-day breakfast near Nusa Dua'
  where slug = 'signa-cafe' and (best_for is null or length(trim(best_for)) = 0);

-- snowcat-bali-ussr-cuisine
update venues set why_its_here = 'Post-Soviet kitchen on Jl. Raya Uluwatu in Ungasan. Herring under a fur coat, pelmeni, olivier and draniki. Large portions and homemade infusions. Delivery, dine-in and bookings.'
  where slug = 'snowcat-bali-ussr-cuisine' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Russian-speaking guests who want food from home'
  where slug = 'snowcat-bali-ussr-cuisine' and (best_for is null or length(trim(best_for)) = 0);

-- the-jungle-club-ubud-by-wonderspace
update venues set why_its_here = 'Adults-only day club on roughly two hectares of jungle in Celuk. An infinity pool, a jungle deck, a boho cave and a jetty. Svaha Spa sits on the same grounds. Live music and themed events.'
  where slug = 'the-jungle-club-ubud-by-wonderspace' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A day by a pool without leaving the jungle'
  where slug = 'the-jungle-club-ubud-by-wonderspace' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'Families - the club is adults-only'
  where slug = 'the-jungle-club-ubud-by-wonderspace' and (not_for is null or length(trim(not_for)) = 0);

-- the-little-hill-terrace
update venues set why_its_here = 'Restaurant inside The Little Hill Suites in Munduk. Locally sourced cooking from the farms of North Bali. The terrace looks over green hills and valleys.'
  where slug = 'the-little-hill-terrace' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A mountain lunch on the way through Munduk'
  where slug = 'the-little-hill-terrace' and (best_for is null or length(trim(best_for)) = 0);

-- the-northview-bali-ngiring-ngewedang-restaurant-and-coffee-c
update venues set why_its_here = 'Restaurant and coffee corner on a hilltop in Munduk village. Asian and Indonesian dishes with Balinese coffee and teas. Crispy duck and banana fritters are regulars. The open dining room faces the hills and valleys.'
  where slug = 'the-northview-bali-ngiring-ngewedang-restaurant-and-coffee-c' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Coffee and a sunset over the Munduk hills'
  where slug = 'the-northview-bali-ngiring-ngewedang-restaurant-and-coffee-c' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'A quick stop - it is three hours from the airport'
  where slug = 'the-northview-bali-ngiring-ngewedang-restaurant-and-coffee-c' and (not_for is null or length(trim(not_for)) = 0);

-- to-the-moon-cafe
update venues set why_its_here = 'Cafe in Umalas serving signature sushi rolls alongside Western plates. Beef and salmon steaks, gourmet burgers, pancakes and smoothie bowls. Dine-in, takeaway and delivery, with free parking.'
  where slug = 'to-the-moon-cafe' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'Sushi without driving to Seminyak'
  where slug = 'to-the-moon-cafe' and (best_for is null or length(trim(best_for)) = 0);

-- tsune-japanese-restaurant-sanur-by-wonderspace
update venues set why_its_here = 'Japanese restaurant in Sanur with Indonesia''s first floating sushi: plates travel to the table along a waterway. A Japanese fish grill runs alongside. Live music on Saturday evenings, and 10% off lunch every day.'
  where slug = 'tsune-japanese-restaurant-sanur-by-wonderspace' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A sushi dinner that doubles as a show'
  where slug = 'tsune-japanese-restaurant-sanur-by-wonderspace' and (best_for is null or length(trim(best_for)) = 0);

-- ula-cafe
update venues set why_its_here = 'Cafe on Jl. Pantai Balangan. Chef Mags builds the menu from scratch, with separate breakfast and mains lists. Woven textures, ocean air and vinyl in the background. Wifi and power outlets throughout.'
  where slug = 'ula-cafe' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A slow breakfast with a laptop'
  where slug = 'ula-cafe' and (best_for is null or length(trim(best_for)) = 0);
update venues set not_for = 'A weekend evening - it closes at 16:00 on Saturday and Sunday'
  where slug = 'ula-cafe' and (not_for is null or length(trim(not_for)) = 0);

-- workmates-coworking-space-and-cafe
update venues set why_its_here = 'Coworking space and cafe in Canggu, part of the Wonderspace group. Desks, fast wifi and a poolside view. The kitchen does chicken parmigiana, Indonesian plates and bowls.'
  where slug = 'workmates-coworking-space-and-cafe' and (why_its_here is null or length(trim(why_its_here)) = 0);
update venues set best_for = 'A full day of work with lunch on site'
  where slug = 'workmates-coworking-space-and-cafe' and (best_for is null or length(trim(best_for)) = 0);

commit;

-- ---------------------------------------------------------------------------
-- EXPECTED: 53 rows gain why_its_here, 53 gain best_for, 14 gain not_for.
-- ---------------------------------------------------------------------------

-- AFTER RUNNING: coverage of the August import.
select count(*) as august_published,
       count(*) filter (where why_its_here is not null and length(trim(why_its_here))>0
                          and best_for is not null and length(trim(best_for))>0) as now_open
from venues
where status='active' and publication_status='published' and created_at >= '2026-08-01';