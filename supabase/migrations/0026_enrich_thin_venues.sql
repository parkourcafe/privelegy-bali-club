-- 0026_enrich_thin_venues.sql
-- Decision-ready editorial for the last thin venue pages (Sanur + Seminyak/Umalas).
-- Every field below was verified against official sites / venue socials in a
-- fresh web-research pass (Other Bali local-verification cycle). Guardrails held:
-- no Google ratings or review counts; downsides only as fit-context "not_for";
-- prices as bands, never live menus; English only; unverified fields left blank.
--
-- Effect: rows that gain why_its_here + best_for + (what_to_order OR price_anchor)
-- clear the decision-ready bar and their /places/<slug> pages flip to
-- index,follow + enter the sitemap automatically (lib/publication.ts).
--
-- Not covered here on purpose:
--   * revive-pilates-umalas  — editorial written, but no class/drop-in price band
--       could be verified (official pricing page 403s). It gets its real copy but
--       stays noindex until a price band is confirmed.
--   * white-rock-beach-club  — Uluwatu is gated by the evidence registry
--       (lib/uluwatu/venues.ts), not DB editorial. Handled separately.
--   * jobs slugs restricted to the canonical 9; wellness rows carry no jobs
--       (the intent vocabulary is food/drink only) and publish on price alone.
--   * natys-restaurant-seminyak — sunset_drinks_view dropped (ocean view was
--       unconfirmed by the source).

begin;

-- ============================ SANUR (20) ============================

update venues set
  why_its_here = $ob$Modern Tex-Mex and Mexican restaurant-bar on Sanur's main strip, serving tequila-based craft cocktails and house-made tortillas and salsas; open since 2014.$ob$,
  best_for = $ob$groups sharing plates and margaritas; a lively casual dinner out$ob$,
  not_for = $ob$anyone after a quiet, low-key meal$ob$,
  what_to_order = $ob$loaded nachos; burritos; birria tacos; papas con chorizo; margaritas$ob$,
  price_anchor = $ob$$$$ob$,
  jobs = ARRAY['group_dinner_share','date_night_special'],
  area = $ob$Jalan Danau Tamblingan$ob$
where slug = $ob$jalapeno$ob$;

update venues set
  why_its_here = $ob$Long-running live-music bar with bands nightly from 6pm across rock, pop and Top 40, running late; also does a Babi Guling (suckling pig) buffet on set days.$ob$,
  best_for = $ob$night out with live music and drinks; groups who want to sing along and stay late$ob$,
  not_for = $ob$anyone after a quiet dinner or an early night$ob$,
  what_to_order = $ob$cold beers; Babi Guling (suckling pig, buffet days); bar drinks$ob$,
  jobs = ARRAY['group_dinner_share'],
  area = $ob$Jalan Cemara$ob$
where slug = $ob$linga-longa-bar$ob$;

update venues set
  why_its_here = $ob$Small, cosy Dutch-run bar a short walk from Sindhu beach, good for a relaxed beer and snacks; known for Dutch bar food.$ob$,
  best_for = $ob$a casual beer and snacks after the beach; couples or solo travellers wanting a low-key spot$ob$,
  not_for = $ob$large groups after a full sit-down dinner$ob$,
  what_to_order = $ob$bitterballen; frikandel; uitsmijter (ham-and-cheese eggs on bread); fries with sauce$ob$,
  price_anchor = $ob$$ · snacks/small plates$ob$,
  jobs = ARRAY['just_landed_easy_dinner'],
  area = $ob$Jalan Pantai Sindhu$ob$
where slug = $ob$oranje-bar$ob$;

update venues set
  why_its_here = $ob$Broad-menu kitchen-and-bar on the main Sanur strip mixing Australian steaks, Western favourites and Indonesian dishes, with a dedicated kids' section.$ob$,
  best_for = $ob$families with kids; groups wanting varied Western-and-local options in one place$ob$,
  what_to_order = $ob$rib-eye steak; steak with coconut rice; tuna steak wasabi; rendang daging sapi; mixed grill skewers$ob$,
  price_anchor = $ob$$$–$$$ (steaks at the top end)$ob$,
  jobs = ARRAY['family_early_dinner','group_dinner_share'],
  area = $ob$Jalan Danau Tamblingan$ob$
where slug = $ob$retro-kitchen-and-bar$ob$;

update venues set
  why_its_here = $ob$Long-standing Indonesian warung (since 2012) with a bohemian recycled-boat-timber interior, serving generous home-style Balinese plates; live music some evenings.$ob$,
  best_for = $ob$relaxed local dinner; travellers wanting authentic Indonesian food with atmosphere$ob$,
  not_for = $ob$anyone wanting a quiet room on the nights live music plays$ob$,
  what_to_order = $ob$nasi goreng; chicken satay; mie goreng; grilled fish; gado gado$ob$,
  price_anchor = $ob$$ · warung mains$ob$,
  jobs = ARRAY['local_food_calm','group_dinner_share'],
  area = $ob$Jalan Danau Tamblingan$ob$
where slug = $ob$warung-coconut-tree$ob$;

update venues set
  why_its_here = $ob$Laid-back, budget-friendly warung on Sanur's main artery serving authentic Balinese and Indonesian dishes; easily walkable from the beach area.$ob$,
  best_for = $ob$cheap, relaxed local meal; long-stay travellers and solo diners$ob$,
  not_for = $ob$anyone after a formal or upscale dinner$ob$,
  what_to_order = $ob$nasi goreng; satay; smoothie bowls$ob$,
  price_anchor = $ob$$ · mains ~40–80K$ob$,
  jobs = ARRAY['local_food_calm','just_landed_easy_dinner'],
  area = $ob$Jalan Danau Tamblingan$ob$
where slug = $ob$warung-little-bird$ob$;

update venues set
  why_its_here = $ob$Small, tidy family-run warung serving Balinese, Indonesian and some Western dishes with plenty of vegetarian options, plus local coffee and fresh cocktails.$ob$,
  best_for = $ob$relaxed local meal; vegetarians; travellers wanting a home-style, no-fuss dinner$ob$,
  not_for = $ob$large groups (it's a very small space)$ob$,
  what_to_order = $ob$nasi campur; chicken rendang; gado-gado; babi sambal matah; vegetable curry$ob$,
  price_anchor = $ob$$ · warung mains$ob$,
  jobs = ARRAY['local_food_calm','family_early_dinner'],
  area = $ob$Jalan Cemara$ob$
where slug = $ob$warung-makan-little-mars$ob$;

update venues set
  why_its_here = $ob$Beachfront cafe and co-working space on Mertasari Beach in south Sanur, with fast Wi-Fi, an all-day plant-forward menu, and toes-in-the-sand seating without a beach-club minimum. Open daily 7am–10pm.$ob$,
  best_for = $ob$remote workers and long-stay visitors wanting a laptop-friendly beach cafe; healthy/plant-based eaters; relaxed daytime coffee or smoothie by the sand$ob$,
  not_for = $ob$anyone after a formal sit-down dinner or a traditional local warung$ob$,
  what_to_order = $ob$plant-based bowls; Genius Nasi Goreng; curries and pizzas; smoothie frappes and juices; cocktails (Tropical Mojito, Passion Wave)$ob$,
  jobs = ARRAY['quiet_work_cafe'],
  area = $ob$Mertasari Beach, South Sanur$ob$
where slug = $ob$genius-cafe$ob$;

update venues set
  why_its_here = $ob$Long-running casual cafe on Jl. Danau Tamblingan serving Indonesian staples alongside international dishes, with vegetarian, vegan and halal options.$ob$,
  best_for = $ob$families and long-stay visitors wanting an easy all-rounder; travellers after familiar Indonesian dishes in a relaxed setting$ob$,
  not_for = $ob$anyone seeking a special-occasion or fine-dining evening$ob$,
  what_to_order = $ob$Nasi Goreng Special; Gado-Gado; Chicken Satay; Bebek Betutu; grilled red snapper$ob$,
  jobs = ARRAY['family_early_dinner','local_food_calm'],
  area = $ob$Jl. Danau Tamblingan$ob$
where slug = $ob$mona-lisa-cafe$ob$;

update venues set
  why_its_here = $ob$Modern bistro and specialty-coffee spot on Jl. Danau Tamblingan serving western-Asian comfort food, with distinct brunch and dinner menus.$ob$,
  best_for = $ob$brunch and coffee sessions; casual laptop-friendly daytime stops; travellers wanting comfort food in a relaxed setting$ob$,
  not_for = $ob$anyone after traditional Balinese or a large-group banquet$ob$,
  what_to_order = $ob$Eggs Benedict; smashed avocado toast; smoothie bowls; truffle pasta; burgers$ob$,
  jobs = ARRAY['quiet_work_cafe','just_landed_easy_dinner'],
  area = $ob$Jl. Danau Tamblingan$ob$
where slug = $ob$sala-bistro$ob$;

update venues set
  why_its_here = $ob$Pan-Asian ("a Taste of Asia") restaurant on Jl. Danau Tamblingan No. 85, serving shareable Asian plates with live music in the evenings.$ob$,
  best_for = $ob$groups wanting to share a range of Asian dishes; couples and long-stay visitors after a relaxed evening with live music$ob$,
  not_for = $ob$anyone wanting a silent, low-key dinner on live-music nights$ob$,
  what_to_order = $ob$corn fritters with sambal; bao; salt & pepper squid; pork belly; sate ayam$ob$,
  jobs = ARRAY['group_dinner_share','date_night_special'],
  area = $ob$Jl. Danau Tamblingan$ob$
where slug = $ob$white-orchid-sanur$ob$;

update venues set
  why_its_here = $ob$Italian restaurant on Jalan Cemara (Sanur Kauh) serving wood-fired pizza, homemade pasta and Italian desserts, with vegetarian options.$ob$,
  best_for = $ob$families and groups wanting familiar Italian food; casual dinners and pizza nights$ob$,
  not_for = $ob$anyone specifically seeking Indonesian or Balinese cuisine$ob$,
  what_to_order = $ob$Pizza Margherita; Quattro Formaggi; spaghetti carbonara; spaghetti alle vongole; tiramisu$ob$,
  jobs = ARRAY['family_early_dinner','group_dinner_share'],
  area = $ob$Jalan Cemara, Sanur Kauh$ob$
where slug = $ob$bella-italia-sanur$ob$;

update venues set
  why_its_here = $ob$Signature Indonesian and Balinese restaurant of Kayumanis Sanur (Jl. Tirta Akasa No. 28), offering an intimate resort setting focused on traditional dishes. Open daily 7am–10pm.$ob$,
  best_for = $ob$couples and small parties wanting a stylish traditional-Balinese dinner; a special evening centred on local cuisine$ob$,
  not_for = $ob$a quick casual bite or a large, loud group$ob$,
  what_to_order = $ob$Balinese Rijsttafel; slow-cooked bebek betutu; pork ribs in local spice paste; lawar; nasi campur$ob$,
  jobs = ARRAY['date_night_special','special_occasion'],
  area = $ob$Kayumanis Sanur, Jl. Tirta Akasa$ob$
where slug = $ob$gong-restaurant$ob$;

update venues set
  why_its_here = $ob$Japanese izakaya-style restaurant at Maya Sanur Resort & Spa serving sushi, sashimi, robatayaki skewers and tempura, with sake and cocktails.$ob$,
  best_for = $ob$groups sharing Japanese plates; couples wanting a stylish evening out; diners after quality sushi and grilled skewers$ob$,
  not_for = $ob$anyone wanting a quick, casual or budget meal$ob$,
  what_to_order = $ob$assorted sashimi; Dragon Maki; Rainbow Maki; robatayaki/yakitori skewers; tempura$ob$,
  jobs = ARRAY['group_dinner_share','date_night_special'],
  area = $ob$Maya Sanur Resort & Spa, Jl. Danau Tamblingan$ob$
where slug = $ob$kuu-izakaya-dining$ob$;

update venues set
  why_its_here = $ob$A beachfront restaurant directly on the Sanur paved coastal walk (Jalan Duyung), serving Indonesian and European dishes plus seafood, cooked without MSG, with tables facing the sea. Open all day from breakfast to late evening.$ob$,
  best_for = $ob$couples and families wanting relaxed seafront tables; long-stay visitors after an easy, calm sit-down meal; anyone who wants toes-near-sand dining without a resort setting$ob$,
  not_for = $ob$anyone needing a quiet indoor space to work$ob$,
  what_to_order = $ob$grilled/fresh seafood; Indonesian mains; vegetarian dishes; fresh signature juices; cocktails such as a lemongrass mojito$ob$,
  jobs = ARRAY['family_early_dinner','local_food_calm','group_dinner_share'],
  area = $ob$Sanur beachwalk near Jalan Duyung$ob$
where slug = $ob$lilla-pantai$ob$;

update venues set
  why_its_here = $ob$A long-running Italian restaurant on Sanur's main Jalan Danau Tamblingan strip, making pasta, mozzarella/burrata and gelato in-house daily, with wood-fired naturally-leavened pizza. The owner has produced Italian gelato in Sanur since 1996, with 48+ flavours.$ob$,
  best_for = $ob$families and groups wanting familiar Italian food; a casual sit-down dinner on the main street; a dedicated gelato stop$ob$,
  not_for = $ob$anyone wanting beachfront or sea-view seating (it is on the street, not the shore)$ob$,
  what_to_order = $ob$wood-fired pizza; handmade pasta (fettuccine, tortellini, ravioli); burrata/mozzarella; homemade gelato$ob$,
  jobs = ARRAY['family_early_dinner','group_dinner_share','just_landed_easy_dinner'],
  area = $ob$Jalan Danau Tamblingan$ob$
where slug = $ob$massimo-italian-restaurant$ob$;

update venues set
  why_its_here = $ob$The Italian beachfront restaurant and bar at Hyatt Regency Bali, on Sanur Beach, serving antipasti, wood-fired sourdough pizza, pasta, seafood and meat with sea views. Lunch and dinner daily, plus a Sunday Brunch with live grills and carvings.$ob$,
  best_for = $ob$couples wanting an upscale beachfront resort dinner; a special-occasion meal; Sunday brunch with a group; families dining early at the resort$ob$,
  not_for = $ob$anyone after a quick, budget, casual street meal$ob$,
  what_to_order = $ob$wood-fired sourdough pizza with burrata, prosciutto and arugula; homemade pasta; fresh shrimp pasta with garlic bread; Sunday Brunch spread$ob$,
  price_anchor = $ob$$$$$ob$,
  jobs = ARRAY['date_night_special','special_occasion','family_early_dinner','group_dinner_share'],
  area = $ob$Hyatt Regency Bali beachfront, Sanur Beach$ob$
where slug = $ob$pizzaria-hyatt$ob$;

update venues set
  why_its_here = $ob$A Sanur restaurant known for grilled seafood and mixed BBQ platters alongside Indonesian mains, open all day, with live acoustic music at dinner.$ob$,
  best_for = $ob$groups sharing a seafood/grill platter; families wanting an early dinner; visitors after casual Indonesian grilled food$ob$,
  not_for = $ob$anyone wanting a silent dinner (live acoustic music plays in the evening)$ob$,
  what_to_order = $ob$mixed grilled seafood platter (crab, fish, prawns, squid); satay ayam; beef rendang; grilled snapper; black rice pudding$ob$,
  price_anchor = $ob$$$ · mains ~100–200K$ob$,
  jobs = ARRAY['group_dinner_share','family_early_dinner','local_food_calm']
where slug = $ob$red-manna$ob$;

update venues set
  why_its_here = $ob$A beachfront bar and restaurant on Sanur's shore at Jl. Segara Ayu, serving seafood, pasta, Indonesian dishes and pizza with ocean views, beach happy hour and live music.$ob$,
  best_for = $ob$groups wanting beachfront tables with drinks and live music; families dining early by the sea; a relaxed seafront meal$ob$,
  not_for = $ob$anyone wanting a quiet dinner with no music$ob$,
  what_to_order = $ob$grilled fish of the day; linguine del mare (seafront pasta); fish and chips; nasi goreng; beef rendang$ob$,
  jobs = ARRAY['group_dinner_share','family_early_dinner','local_food_calm'],
  area = $ob$Jl. Segara Ayu beachfront$ob$
where slug = $ob$segara-the-seaside$ob$;

update venues set
  why_its_here = $ob$A beachfront restaurant on Sanur's Sindhu Beach (next to INNA Sindhu Beach Hotel), serving Indonesian, Asian and Western food from breakfast to dinner, with a swimmable white-sand beach and views toward Mount Agung and Nusa Penida. Vegetarian and vegan options available.$ob$,
  best_for = $ob$families and groups wanting all-day beachfront dining; a relaxed seafront breakfast or early dinner; visitors wanting a swim-and-eat spot$ob$,
  not_for = $ob$anyone wanting a formal or fine-dining setting$ob$,
  what_to_order = $ob$fish and chips; fish tacos; wood-fired/stone pizza; sliders; smashed avocado and corn fritters$ob$,
  jobs = ARRAY['family_early_dinner','group_dinner_share','local_food_calm'],
  area = $ob$Jl. Pantai Sindhu (Sindhu Beach)$ob$
where slug = $ob$soul-on-the-beach$ob$;

-- ======================= SEMINYAK / UMALAS (18) =======================

update venues set
  why_its_here = $ob$Rooftop bar and restaurant on top of Anantara Seminyak Bali Resort, serving modern Southeast Asian dishes with ocean views. Nightly live bands and DJ sets give it an energetic, dressed-up evening feel.$ob$,
  best_for = $ob$couples wanting a rooftop dinner with a view; travellers after cocktails at golden hour; a lively night out with music$ob$,
  not_for = $ob$anyone wanting a quiet, low-key meal (live music/DJ most nights)$ob$,
  what_to_order = $ob$Balinese crispy duck; Bali baby pork ribs; Black Snow signature cocktail; Black Mamba signature cocktail$ob$,
  price_anchor = $ob$$$$ · mains ~85–375K; drinks from ~60K$ob$,
  jobs = ARRAY['sunset_drinks_view','date_night_special','special_occasion'],
  area = $ob$Seminyak beachside (Anantara, Jl. Abimanyu / Dhyana Pura)$ob$
where slug = $ob$moonlite-kitchen-and-bar$ob$;

update venues set
  why_its_here = $ob$Bali's original beachfront club, on the sand at Seminyak Beach, running from morning through sunset into late night with dining, a bar, pool and daybeds. An all-day beach-club-plus-restaurant rather than a quick stop.$ob$,
  best_for = $ob$sunset drinks on the beach; a long lunch-into-evening on a daybed; a special occasion by the ocean$ob$,
  not_for = $ob$budget travellers (daybeds/sofas carry a minimum spend); anyone wanting a small, quiet intimate dinner$ob$,
  what_to_order = $ob$miso black cod; crispy duck salad; grilled seafood platter; signature cocktails; chocolate lava cake$ob$,
  price_anchor = $ob$$$$$ · daybed/sofa minimum-spend applies; premium mains$ob$,
  jobs = ARRAY['sunset_drinks_view','special_occasion','group_dinner_share'],
  area = $ob$Seminyak Beach / Jl. Kayu Aya (Oberoi)$ob$
where slug = $ob$ku-de-ta$ob$;

update venues set
  why_its_here = $ob$All-day cafe and bistro on Seminyak's "Eat Street," serving Western/modern-Australian classics from breakfast and brunch through burgers, char-grilled steaks and pizza. Casual, generous, colonial-house setting on the corner of Oberoi Road.$ob$,
  best_for = $ob$brunch after the beach; an easy first-night dinner; a relaxed group meal of familiar Western food$ob$,
  not_for = $ob$travellers specifically after Indonesian/local cuisine (menu is Western-focused)$ob$,
  what_to_order = $ob$modern Australian breakfast; burgers; char-grilled steak; fish and chips; wood-fired pizza$ob$,
  price_anchor = $ob$$$–$$$$ob$,
  jobs = ARRAY['brunch_after_surf','just_landed_easy_dinner','group_dinner_share'],
  area = $ob$Oberoi / Jl. Laksmana (Eat Street)$ob$
where slug = $ob$corner-house-bali$ob$;

update venues set
  why_its_here = $ob$One of Seminyak's pioneering specialty-coffee cafes, open since 2012 and roasting its own beans locally, tucked down a lane off Jl. Kayu Aya. Known for its dark, timber-and-brick "hidden bar" interior and a hearty brunch alongside the coffee.$ob$,
  best_for = $ob$serious coffee before or after the beach; a sit-down brunch; a caffeine stop while exploring the Oberoi strip$ob$,
  not_for = $ob$anyone needing a quiet laptop/work session or space for a large group$ob$,
  what_to_order = $ob$espresso from house-roasted Bali/regional Arabica; filter/single-origin coffee; brunch plates$ob$,
  price_anchor = $ob$$$$ob$,
  jobs = ARRAY['brunch_after_surf'],
  area = $ob$Gang off Jl. Kayu Aya (Oberoi), Seminyak$ob$
where slug = $ob$revolver-seminyak$ob$;

update venues set
  why_its_here = $ob$Modern-Asian sharing restaurant on Seminyak's Oberoi/Laksmana strip from chef Dean Keddell, open since 2012. Built around ordering several shareable plates for the table rather than individual mains.$ob$,
  best_for = $ob$a group who want to share a spread of Asian plates; a relaxed dinner with friends or family; couples happy to graze across the menu$ob$,
  not_for = $ob$solo diners wanting a single quick plate (format is built around sharing)$ob$,
  what_to_order = $ob$Dim Sum & Then Sum set; Peking/Chinese-style duck; dumplings and steamed buns; chicken satay; grilled meats and seafood$ob$,
  price_anchor = $ob$$$–$$$ · Dim Sum & Then Sum set ~116K$ob$,
  jobs = ARRAY['group_dinner_share','date_night_special'],
  area = $ob$Jl. Kayu Aya / Oberoi–Laksmana, Seminyak$ob$
where slug = $ob$ginger-moon-canteen$ob$;

update venues set
  why_its_here = $ob$Home-style Italian restaurant (from the Mauri group) serving daily-baked bread and cornetti, fresh pasta and wood-fired pizza in a rustic, cozy setting. Runs from breakfast through lunch to dinner.$ob$,
  best_for = $ob$a cozy, unhurried Italian dinner; a relaxed breakfast or lunch; a laid-back family or couples meal$ob$,
  not_for = $ob$travellers wanting a beachfront or main-Seminyak-strip location (it sits inland in Umalas/Bumbak)$ob$,
  what_to_order = $ob$daily-baked cornetti and bread; fresh pasta; homemade pizza; classic cocktails$ob$,
  price_anchor = $ob$$$–$$$$ob$,
  jobs = ARRAY['date_night_special','family_early_dinner','group_dinner_share'],
  area = $ob$Jl. Bumbak, Umalas (Kerobokan)$ob$
where slug = $ob$la-casetta-bali$ob$;

update venues set
  why_its_here = $ob$The Seminyak-area branch (opened 2017) of the Ubud institution, known for barbecued pork ribs seasoned Balinese-style and its potent martinis. Casual warung format.$ob$,
  best_for = $ob$a group here for smoky ribs and martinis; a casual, no-fuss dinner; an easy meal soon after landing$ob$,
  not_for = $ob$diners wanting a refined, quiet dining room, or those avoiding pork (ribs are the draw)$ob$,
  what_to_order = $ob$BBQ pork ribs; martinis; Thursday sushi night$ob$,
  price_anchor = $ob$$$$ob$,
  jobs = ARRAY['group_dinner_share','family_early_dinner','just_landed_easy_dinner'],
  area = $ob$Jl. Mertanadi, Kerobokan (Seminyak-adjacent)$ob$
where slug = $ob$naughty-nuris-warung-seminyak$ob$;

update venues set
  why_its_here = $ob$French loft-style artisan bakery and café in Umalas, opening early at 7am when most neighbouring cafés are still shut. Two-storey space known for sourdough, pastries and fresh coffee, with strong wifi and outdoor seating.$ob$,
  best_for = $ob$early risers wanting breakfast/brunch before other cafés open; laptop/remote workers on strong wifi; sourdough and pastry lovers$ob$,
  not_for = $ob$late-night diners (kitchen is daytime-oriented); anyone wanting beachfront or nightlife$ob$,
  what_to_order = $ob$sourdough; croissants and pastries; avocado toast; paninis/sandwiches; fresh cold-pressed juices$ob$,
  jobs = ARRAY['quiet_work_cafe','brunch_after_surf','local_food_calm'],
  area = $ob$Umalas$ob$
where slug = $ob$7am-bakers-umalas$ob$;

update venues set
  why_its_here = $ob$Casual American BBQ joint on Jalan Batu Belig (Kerobokan) built around family-style tables and low-fuss grilled fare, with a largely gluten-free menu. Signature slow-cooked ribs are the draw.$ob$,
  best_for = $ob$groups sharing BBQ platters family-style; families with a relaxed early dinner; gluten-free diners$ob$,
  not_for = $ob$fine-dining or romantic quiet-table seekers; vegetarians (menu is meat/BBQ-led)$ob$,
  what_to_order = $ob$Wicked Ribs; pork chop with fries; BBQ chicken; beef skewers; Brutal Martini$ob$,
  jobs = ARRAY['group_dinner_share','family_early_dinner','just_landed_easy_dinner'],
  area = $ob$Batu Belig$ob$
where slug = $ob$hog-wild-with-chef-bruno$ob$;

update venues set
  why_its_here = $ob$Contemporary southern-Italian fine-dining restaurant on Jl. Petitenget, Seminyak, led by Apulian chef Maurizio Bombini, with a live kitchen, à la carte and seasonal tasting menus, and a rooftop hydroponic garden supplying produce.$ob$,
  best_for = $ob$special-occasion and celebration dinners; couples wanting a refined tasting-menu evening; Sunday seafood brunch$ob$,
  not_for = $ob$budget or quick-casual diners; families wanting a relaxed early dinner$ob$,
  what_to_order = $ob$signature six-course tasting menu; Tortelli beef ragu; Sunday seafood brunch; creative vegetarian menu; wine pairing$ob$,
  price_anchor = $ob$$$$$ · six-course signature tasting ~650K++ per person$ob$,
  jobs = ARRAY['special_occasion','date_night_special'],
  area = $ob$Seminyak (Petitenget)$ob$
where slug = $ob$mauri-restaurant$ob$;

update venues set
  why_its_here = $ob$All-day restaurant on Jl. Kayu Aya (Oberoi/Eat Street), Seminyak, serving Indonesian, seafood and European dishes; a front fishmonger display lets guests pick fresh fish for the grill. Open breakfast through late night, with cocktails and shisha.$ob$,
  best_for = $ob$groups sharing grilled seafood and ribs; visitors wanting all-day/late dining on Eat Street; cocktail-and-shisha evenings$ob$,
  not_for = $ob$diners seeking a quiet rice-field or off-strip setting$ob$,
  what_to_order = $ob$fresh grilled fish from the fishmonger display; Indonesian grilled chicken; giant grilled ribs; fresh Balinese-fruit juices; cocktails$ob$,
  jobs = ARRAY['group_dinner_share','just_landed_easy_dinner'],
  area = $ob$Seminyak (Kayu Aya)$ob$
where slug = $ob$natys-restaurant-seminyak$ob$;

update venues set
  why_its_here = $ob$Long-running open-air café/restaurant set beside Umalas rice fields, serving all-day Western and Indonesian food from breakfast to late (8am–11pm). Known as a calm rice-paddy escape a short hop from Seminyak's bustle.$ob$,
  best_for = $ob$relaxed rice-field brunch or breakfast; couples/groups wanting a calm all-day meal off the strip; vegetarian/vegan and gluten-free diners$ob$,
  not_for = $ob$anyone wanting a polished fine-dining or beachfront setting; nightlife seekers$ob$,
  what_to_order = $ob$Eggs Benedict; Big Nook Burger; Nasi Campur Bali Ayam; pork belly sambal matah; fresh juices and smoothies$ob$,
  jobs = ARRAY['brunch_after_surf','local_food_calm','family_early_dinner'],
  area = $ob$Umalas$ob$
where slug = $ob$nook-umalas$ob$;

update venues set
  why_its_here = $ob$French patisserie and bakery on Jl. Batu Belig serving authentic pastries; best known for its cream puffs, plus macarons, tarts and viennoiserie. Take-away/eat-in, and supplies desserts to villas, parties and restaurants.$ob$,
  best_for = $ob$a pastry or coffee stop and sweet take-away; celebration/letter cakes and gifts; grab-and-go breakfast pastries$ob$,
  not_for = $ob$anyone wanting a full sit-down meal or savoury dinner$ob$,
  what_to_order = $ob$cream puffs; macarons; caramel/chocolate tart; lemon meringue tart; croissants and pain au chocolat$ob$,
  price_anchor = $ob$$ · pastries ~25–45K each$ob$,
  area = $ob$Batu Belig$ob$
where slug = $ob$poule-de-luxe-bali$ob$;

-- Wellness (no jobs — the intent vocabulary is food/drink only; publish on price)

update venues set
  why_its_here = $ob$A yoga and healing studio inside Blue Karma Village in Umalas, running daily hatha yoga plus Pilates, workshops, and sessions with Balinese healers. It has a dedicated sound-healing dome for sound baths and floating sound healing.$ob$,
  best_for = $ob$travellers wanting yoga or sound healing in a quiet villa-garden setting; those combining a class with a spa or retreat stay; Sunday sound-bath drop-ins$ob$,
  not_for = $ob$people after a high-energy fitness/reformer gym; anyone wanting a walk-in studio on the Seminyak strip rather than a tucked-away village$ob$,
  price_anchor = $ob$$$$ · sound healing session ~500K (before tax & service)$ob$,
  area = $ob$Umalas (Blue Karma Village)$ob$
where slug = $ob$bk-wellness-studio-umalas-by-blue-karma-secrets$ob$;

-- revive-pilates-umalas: real editorial, but no verified price band -> stays noindex.
update venues set
  why_its_here = $ob$A reformer Pilates studio with an Umalas location (and one in Canggu), running a high-volume weekly schedule of reformer and mat classes across beginner to advanced levels, plus signature Gluteformer and Sweatformer formats. On-site café serves coffee, matcha and protein smoothies.$ob$,
  best_for = $ob$long-stay residents wanting a busy timetable and many slots; reformer regulars across all levels; those pairing a class with a café stop$ob$,
  not_for = $ob$people wanting a slow, low-intensity or spa-style wellness session$ob$,
  area = $ob$Umalas (Jl. Bumbak, Kerobokan Kelod)$ob$
where slug = $ob$revive-pilates-umalas$ob$;

update venues set
  why_its_here = $ob$A modern reformer Pilates studio, part of the SAIA Wellness group, with an Umalas location open seven days a week; classes run on new reformers, capped at 7 clients, across all levels with form-focused instruction. Private sessions are also offered.$ob$,
  best_for = $ob$reformer beginners through advanced who want small-group attention; travellers wanting a calm, design-led studio; those booking one-off drop-ins$ob$,
  not_for = $ob$anyone seeking large open-gym or spa/massage treatments rather than structured Pilates classes$ob$,
  price_anchor = $ob$$$ · group reformer from ~275K; private session ~600–700K$ob$,
  area = $ob$Umalas$ob$
where slug = $ob$saia-wellness-saia-pilates-umalas$ob$;

update venues set
  why_its_here = $ob$A long-running nail, hair and skin salon offering manicures, pedicures, BIAB and nail art with an extensive polish range, plus hair and skin services. Rooms include a private space for a treatment while watching Netflix.$ob$,
  best_for = $ob$nails, lash and beauty appointments; friends going together for a pampering session; travellers wanting a wide gel/BIAB and nail-art menu$ob$,
  not_for = $ob$walk-ins expecting immediate slots (advance booking is advised); those wanting massage/spa-focused wellness rather than salon services$ob$,
  price_anchor = $ob$$$ · pedicure ~200–360K / manicure & BIAB ~500K+$ob$,
  area = $ob$Batu Belig / Kerobokan Kelod$ob$
where slug = $ob$think-pink-salon-and-nails-bali$ob$;

update venues set
  why_its_here = $ob$A day spa in Umalas offering Balinese and holistic body massages, body masks, facials, plus hair and nail treatments, using its own line of natural products. Signature options include a Sport Massage and a "Black Room" experience.$ob$,
  best_for = $ob$travellers wanting a full-service massage/facial session between Seminyak and Canggu; those after signature or longer ritual treatments; residents booking recurring spa time$ob$,
  not_for = $ob$anyone looking for active fitness/Pilates rather than treatment-based relaxation$ob$,
  price_anchor = $ob$$$$ · massages from ~390K; 60-min rituals from ~1M$ob$,
  area = $ob$Umalas (Jl. Bumbak)$ob$
where slug = $ob$you-spa-umalas$ob$;

commit;
