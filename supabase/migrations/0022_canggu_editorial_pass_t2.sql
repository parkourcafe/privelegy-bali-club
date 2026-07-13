-- Canggu editorial evidence pass — tranche 2 (0022). Extends 0021 to the rest of
-- the active_deep flagship's active catalogue: 50 more established, currently-open
-- Canggu venues (Batu Bolong / Berawa / Pererenan / Seseh / Cemagi + wellness),
-- each verified in a fresh web-research pass against first-party sources (official
-- site / official IG / reputable non-review listings). Same bar and guardrails as
-- 0021: no review text / ratings / counts (#1); best_for/not_for are WHO/WHEN
-- fit-context only, never quality warnings or anti-lists (#7); prices as bands;
-- jobs use only the existing 9-slug vocabulary (#11); money loop untouched.
--
-- Two catalogue rows were deliberately NOT touched (left for founder review):
--   * dandelion  — the venue rebranded to "Casa Tua" (same owner/site); publishing
--                  it as Dandelion would be stale branding — needs a rename, not a fill.
--   * dicarik-warung — no confident first-party match in Canggu (exact name resolves
--                  to an Ubud warung); ambiguous — needs disambiguation.
--
-- Idempotent, fill-empties-only (coalesce/nullif); jobs only set when empty. Venue
-- detail pages stay noindex (no rights-cleared photos) — only /canggu guide surfaces
-- publish.

begin;

-- 1. lulu-bistrot
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A French bistro on Jl. Pantai Batu Bolong serving classic bistro cooking made with local, seasonal ingredients in a relaxed, grand-cafe-inspired room and bar. It opens in the evenings with an early happy hour.'),
    best_for = coalesce(nullif(best_for, ''), 'Couples and small groups wanting an unhurried French dinner and drinks in the evening.'),
    not_for = coalesce(nullif(not_for, ''), 'Not a quick warung stop or a budget meal.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.lulubistrot.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/lulu.bistrot/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share']::text[] else jobs end
where slug = 'lulu-bistrot' and district = 'canggu';

-- 2. moana-fish-eatery
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A Tahitian-Polynesian fish eatery on Jl. Raya Batu Bolong serving fresh seafood - poke bowls, sashimi, carpaccio, tartare and BBQ fish - in a laid-back setting, open from morning until late.'),
    best_for = coalesce(nullif(best_for, ''), 'Anyone wanting fresh, casual seafood for lunch or dinner without a formal setting.'),
    not_for = coalesce(nullif(not_for, ''), 'Not ideal for red-meat eaters or non-seafood diners.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Poke bowls and tuna carpaccio'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/moana.bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share','just_landed_easy_dinner']::text[] else jobs end
where slug = 'moana-fish-eatery' and district = 'canggu';

-- 3. bottega-italiana
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Gourmet Italian home-cooking from the Zibiru group (running since 2015), making its own fresh pasta, bread, cheese and desserts. The Berawa location ("Origano") on Jl. Pantai Berawa runs all day.'),
    best_for = coalesce(nullif(best_for, ''), 'Relaxed all-day Italian for families and groups sharing pasta, or a casual dinner.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Fresh handmade pasta'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.bottegaitalianabali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/bottegaitalianabali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share','family_early_dinner','date_night_special']::text[] else jobs end
where slug = 'bottega-italiana' and district = 'canggu';

-- 4. deus-ex-machina
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The flagship Deus "Temple of Enthusiasm" on Jl. Pantai Batu Mejan, combining a Pan-Asian cafe and bar with a motorcycle workshop, retail store, gallery and live-music venue, open from morning coffee until late.'),
    best_for = coalesce(nullif(best_for, ''), 'An all-day hangout - coffee and brunch by day, group dinners and drinks with live music and a scene by night.'),
    not_for = coalesce(nullif(not_for, ''), 'Not a quiet or intimate dinner.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://deuscustoms.co.id/pages/the-temple-of-enthusiasm-1'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','group_dinner_share']::text[] else jobs end
where slug = 'deus-ex-machina' and district = 'canggu';

-- 5. pizza-fabbrica
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A Neapolitan pizzeria on Jl. Batu Mejan turning out wood-fired, thin and light pizzas plus fresh pasta in an industrial-chic space, with a second branch in Umalas.'),
    best_for = coalesce(nullif(best_for, ''), 'A casual pizza dinner with friends or family, and groups sharing.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Wood-fired Neapolitan pizza'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://pizzafabbricabali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/pizzafabbricabali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share','family_early_dinner']::text[] else jobs end
where slug = 'pizza-fabbrica' and district = 'canggu';

-- 6. warung-nonii
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A long-running, affordable Indonesian warung (Waroeng Nonii) just up from Batu Bolong beach on Jl. Pantai Batu Bolong, open breakfast through dinner with nasi campur as its house plate and takeaway available.'),
    best_for = coalesce(nullif(best_for, ''), 'A cheap, easy local Indonesian meal at any time of day, including a low-key just-landed dinner.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Nasi campur'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','just_landed_easy_dinner']::text[] else jobs end
where slug = 'warung-nonii' and district = 'canggu';

-- 7. yuki-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A modern Japanese izakaya steps from Batu Bolong beach serving fusion sushi, wood-fired specialties and signature cocktails in a stylish yet laid-back room; bookings are essential.'),
    best_for = coalesce(nullif(best_for, ''), 'A stylish date night, special occasion or group dinner with cocktails.'),
    not_for = coalesce(nullif(not_for, ''), 'Not a budget or walk-in-anytime spot - reservations recommended.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.yuki-bali.com/canggu'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/yukibali_/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','special_occasion','group_dinner_share']::text[] else jobs end
where slug = 'yuki-canggu' and district = 'canggu';

-- 8. skool-kitchen
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An open-flame kitchen perched above Batu Bolong beach (above The Lawn), where Chef Val cooks grilled meats and smoky seafood over natural wood and charcoal, paired with cocktails and a wine list; dinner only, from 5pm.'),
    best_for = coalesce(nullif(best_for, ''), 'A special-occasion or date-night dinner with a beachside setting and drinks.'),
    not_for = coalesce(nullif(not_for, ''), 'Not a casual daytime or budget option - evenings only.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/skoolkitchen/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['special_occasion','date_night_special','sunset_drinks_view']::text[] else jobs end
where slug = 'skool-kitchen' and district = 'canggu';

-- 9. copenhagen-cafe-berawa
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A Scandinavian-inspired cafe serving an everyday "Nordic feast" - a build-your-own board of small dishes ticked off a menu card. The Berawa branch is the larger, calmer of its locations, open through the day.'),
    best_for = coalesce(nullif(best_for, ''), 'Daytime brunch and coffee, and shareable small-plate breakfasts in a photogenic setting.'),
    not_for = coalesce(nullif(not_for, ''), 'Not an evening dinner venue - daytime hours.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The shared Nordic feast board of small dishes'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://cphbali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/copenhagencafe.bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','group_dinner_share']::text[] else jobs end
where slug = 'copenhagen-cafe-berawa' and district = 'canggu';

-- 10. milu-by-nook
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A long-standing Berawa restaurant set in a garden overlooking a small rice paddy on Jl. Pantai Berawa, serving Balinese-Western dishes and coffee from morning until night.'),
    best_for = coalesce(nullif(best_for, ''), 'A relaxed brunch or dinner with rice-field views - couples and families wanting a green, calm setting.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/milubynook/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','family_early_dinner']::text[] else jobs end
where slug = 'milu-by-nook' and district = 'canggu';

-- 11. nude-berawa
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A popular healthy cafe at a busy Berawa junction on Jl. Pantai Berawa, serving wholesome bowls, salads, wraps, smoothies and coffee from breakfast to evening; part of a small Bali group.'),
    best_for = coalesce(nullif(best_for, ''), 'A healthy brunch or casual all-day meal - good for digital nomads and families.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://nude-bali.com/locations/berawa/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/nudebali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = 'nude-berawa' and district = 'canggu';

-- 12. oma-jamu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A budget vegan cafe and organic grocery near Batu Bolong''s Puseh temple, serving all-day plant-based Indonesian food, cold-pressed juices, kombucha and traditional jamu tonics.'),
    best_for = coalesce(nullif(best_for, ''), 'Affordable vegan and vegetarian eating, healthy breakfasts and jamu in a calm daytime setting.'),
    not_for = coalesce(nullif(not_for, ''), 'Not for diners wanting meat or a full-service dinner.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Jamu (traditional herbal tonic)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/omajamuvegan/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = 'oma-jamu' and district = 'canggu';

-- 13. riviera-bistro-berawa
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A modern Mediterranean bistro and wine bar in Berawa (open since 2020) with whitewashed arches, an extensive wine list and a daily Aperitivo hour; open from late morning until late, with a Saturday DJ night.'),
    best_for = coalesce(nullif(best_for, ''), 'Date night, aperitivo and dinner with drinks, and lively evenings.'),
    not_for = coalesce(nullif(not_for, ''), 'Not a quiet or budget spot.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://rivieragroupbali.com/riviera-bistro/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/rivierabistro.berawa/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','sunset_drinks_view','group_dinner_share']::text[] else jobs end
where slug = 'riviera-bistro-berawa' and district = 'canggu';

-- 14. baked-berawa
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An artisan bakehouse and specialty-coffee cafe in Berawa (Tibubeneng) known for laminated pastries and croissants alongside a full brunch menu; a busy morning-to-afternoon spot.'),
    best_for = coalesce(nullif(best_for, ''), 'Brunch, coffee and pastries, and morning meet-ups.'),
    not_for = coalesce(nullif(not_for, ''), 'Not a dinner venue and can get crowded at peak brunch.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Croissants and laminated pastries'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://baked.co.id/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/baked.indonesia/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = 'baked-berawa' and district = 'canggu';

-- 15. bokashi-berawa
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A Japanese-inspired cafe and teahouse above a sustainable grocery store in Berawa, with tatami dining upstairs and a menu blending Japanese and local Indonesian ingredients in a health-conscious way.'),
    best_for = coalesce(nullif(best_for, ''), 'A calm daytime meal, matcha and tea, and health-conscious Japanese plates.'),
    not_for = coalesce(nullif(not_for, ''), 'Not a party or late-night spot.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Chilled soba noodles'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/bokashiberawa/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['quiet_work_cafe','brunch_after_surf']::text[] else jobs end
where slug = 'bokashi-berawa' and district = 'canggu';

-- 16. neighbourhood-food-berawa
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A neighbourhood cafe and coffee shop in the heart of Berawa on Jl. Pantai Berawa, serving slow breakfasts, laid-back snacks and simple wholesome dishes made from local produce; daytime hours.'),
    best_for = coalesce(nullif(best_for, ''), 'A relaxed brunch, coffee and healthy casual daytime eating.'),
    not_for = coalesce(nullif(not_for, ''), 'Not an evening dinner venue - the Berawa branch closes at 6pm.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.neighbourhoodfood.co/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/neighbourhoodbali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = 'neighbourhood-food-berawa' and district = 'canggu';

-- 17. isla-by-earth-island
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The all-day cafe inside Earth Island''s surf compound on the Canggu shortcut: simple island food, coconuts and good coffee built around a surfer-and-creative community, with music, art and film events layered on top.'),
    best_for = coalesce(nullif(best_for, ''), 'Surfers refuelling after a session, casual daytime meals, and anyone who wants a relaxed community-hub cafe rather than a formal restaurant.'),
    not_for = coalesce(nullif(not_for, ''), 'A dressed-up dinner or a quiet fine-dining evening.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Smoothie bowls, surfer platters, fresh coconuts'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://earth-island.com/pages/islaislabyearthisland'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/earth___island/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe','local_food_calm']::text[] else jobs end
where slug = 'isla-by-earth-island' and district = 'canggu';

-- 18. tropical-nomad
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A long-running Canggu-shortcut coworking space with an integrated open-air cafe overlooking rice fields and garden, built for people who want to eat, sit with a laptop and stay a while.'),
    best_for = coalesce(nullif(best_for, ''), 'Digital nomads and remote workers who want fast wifi, big shared tables and a laptop-friendly cafe; casual daytime coffee stops.'),
    not_for = coalesce(nullif(not_for, ''), 'A romantic dinner or a special-occasion night out.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://tropical-nomad-coworking-space.webflow.io/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['quiet_work_cafe','brunch_after_surf']::text[] else jobs end
where slug = 'tropical-nomad' and district = 'canggu';

-- 19. riviera-cafe-cemagi
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A tranquil garden cafe in quiet Cemagi from the Riviera Group, leaning Mediterranean-Italian, with cozy interiors, greenery and live acoustic music on Saturday evenings.'),
    best_for = coalesce(nullif(best_for, ''), 'A calm, unhurried breakfast, lunch or relaxed evening meal away from the Canggu crowds; couples wanting a low-key setting.'),
    not_for = coalesce(nullif(not_for, ''), 'Beachfront views or a high-energy party scene.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://rivieragroupbali.com/riviera-cafe/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/rivieracafe.cemagi/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','date_night_special','quiet_work_cafe']::text[] else jobs end
where slug = 'riviera-cafe-cemagi' and district = 'canggu';

-- 20. beach-boy-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A lively Western dining-and-cocktails spot on Jl. Munduk Catu with live music most nights, built around crafted cocktails and generous mains at a fair price.'),
    best_for = coalesce(nullif(best_for, ''), 'Date night, group dinners and celebrations with live music and a proper cocktail list.'),
    not_for = coalesce(nullif(not_for, ''), 'A quiet solo laptop session or a fast grab-and-go lunch.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Wagyu steak; signature cocktails (Beach Boy Club, Cryptonite)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.beachboycanggu.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share','special_occasion']::text[] else jobs end
where slug = 'beach-boy-canggu' and district = 'canggu';

-- 21. baked-pererenan
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Pererenan outpost of BAKED, an artisanal bakehouse and specialty-coffee brand, set in a converted garage with an open-air terrace and a modern brunch menu built on house sourdough and pastries.'),
    best_for = coalesce(nullif(best_for, ''), 'A morning brunch after the beach, a pastry-and-coffee stop, and casual laptop-friendly daytime sitting.'),
    not_for = coalesce(nullif(not_for, ''), 'A late-night dinner or a formal sit-down occasion.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'House sourdough and pastries; specialty coffee'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://baked.co.id/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/baked.indonesia/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = 'baked-pererenan' and district = 'canggu';

-- 22. boheme-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An all-day kitchen at the Shore Amora hotel in Pererenan serving fresh Western food with a healthy, locally-sourced twist, with a pool, daybeds and a nomad work space on site.'),
    best_for = coalesce(nullif(best_for, ''), 'A slow brunch, a laptop-and-coffee day by the pool, and easy all-day eating.'),
    not_for = coalesce(nullif(not_for, ''), 'A high-energy nightlife or beachfront-view outing.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/bohemecanggu/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe','local_food_calm']::text[] else jobs end
where slug = 'boheme-canggu' and district = 'canggu';

-- 23. honey-kitchen
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An all-day kitchen with a Mediterranean flair set over Pererenan''s rice paddies, serving real, honest food from brunch through dinner.'),
    best_for = coalesce(nullif(best_for, ''), 'A rice-paddy-view brunch after surf, and an easy early dinner.'),
    not_for = coalesce(nullif(not_for, ''), 'Beachfront or party-scene expectations.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/honeykitchenbali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','date_night_special','local_food_calm']::text[] else jobs end
where slug = 'honey-kitchen' and district = 'canggu';

-- 24. rize-cafe
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A Pererenan cafe serving contemporary Indian home cooking alongside brunch classics, craft cocktails and house chai, with spices ground daily and dishes rooted in family recipes.'),
    best_for = coalesce(nullif(best_for, ''), 'Spice lovers wanting Indian food, a distinctive brunch, or cocktails and chai in a relaxed setting; small groups sharing dishes.'),
    not_for = coalesce(nullif(not_for, ''), 'Diners after a beach-club or sunset-view scene.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'South Indian dosa; house masala chai'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://rize-bali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/rize.bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','group_dinner_share','date_night_special']::text[] else jobs end
where slug = 'rize-cafe' and district = 'canggu';

-- 25. sensorium-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A daytime fusion cafe on Jl. Pantai Batu Mejan blending Australian cafe culture with Japanese-influenced flavours and minimalist design, from a chef with Australian fine-dining training.'),
    best_for = coalesce(nullif(best_for, ''), 'A brunch or lunch of fusion cafe dishes in a calm, design-led room; a laptop-friendly daytime stop.'),
    not_for = coalesce(nullif(not_for, ''), 'Dinner or late-night dining (it runs daytime hours only).'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Okonomiyaki; miso pancakes; ramen'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://sensoriumbali.co.id/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe','local_food_calm']::text[] else jobs end
where slug = 'sensorium-bali' and district = 'canggu';

-- 26. lyma-beach
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A beachfront bar and restaurant on Pantai Lima where the river meets the ocean, known for sunset views, cocktails and live entertainment through the week.'),
    best_for = coalesce(nullif(best_for, ''), 'Sunset drinks by the beach, group get-togethers, and a relaxed beachfront meal with live music.'),
    not_for = coalesce(nullif(not_for, ''), 'A quiet work session or an intimate fine-dining evening.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://lymabeach.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/lymabeach/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','group_dinner_share','date_night_special']::text[] else jobs end
where slug = 'lyma-beach' and district = 'canggu';

-- 27. shelter-restaurant
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A wood-fired Middle Eastern and Mediterranean restaurant in Pererenan built inside a Balinese joglo with open, plant-filled architecture, a UK chef and a rotating calendar of BBQs and vinyl DJ nights. Reservations recommended.'),
    best_for = coalesce(nullif(best_for, ''), 'Date night, group dinners and special occasions with an atmospheric, reservation-led setting.'),
    not_for = coalesce(nullif(not_for, ''), 'A walk-in quick lunch or a solo laptop session.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.shelterbali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/shelter.pererenan/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share','special_occasion']::text[] else jobs end
where slug = 'shelter-restaurant' and district = 'canggu';

-- 28. riviera-trattoria-pererenan
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Riviera Group''s Pererenan trattoria for authentic Italian: hand-rolled pastas, Neapolitan pizzas and an extensive wine and cocktail list in a cozy, lively room.'),
    best_for = coalesce(nullif(best_for, ''), 'Date night, group dinners over shared Italian plates and wine, and a lively casual evening.'),
    not_for = coalesce(nullif(not_for, ''), 'A quiet daytime work cafe or beachfront setting.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Spinach & ricotta ravioli; wood-fired prawns; tiramisu'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://rivieragroupbali.com/riviera-trattoria/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/riviera.pererenan/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share','special_occasion']::text[] else jobs end
where slug = 'riviera-trattoria-pererenan' and district = 'canggu';

-- 29. roots-pererenan
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An all-day plant-based restaurant in Pererenan built around a customizable build-your-own-bowl with 50+ ingredients, plus bold drinks, serving vegans, vegetarians and anyone eating less meat.'),
    best_for = coalesce(nullif(best_for, ''), 'Plant-based and health-focused eaters, a customizable brunch or bowl, and casual laptop-friendly daytime sitting.'),
    not_for = coalesce(nullif(not_for, ''), 'Meat-centric diners or a formal special-occasion dinner.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Build-your-own bowl'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/rootsinbali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe','local_food_calm']::text[] else jobs end
where slug = 'roots-pererenan' and district = 'canggu';

-- 30. touche-cafe-and-restaurant
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An island-chic all-day cafe near Pererenan beach with design-led interiors and an urban-leaning menu, open from early morning to late.'),
    best_for = coalesce(nullif(best_for, ''), 'A stylish brunch, a coffee-and-laptop daytime stop, and a relaxed casual meal.'),
    not_for = coalesce(nullif(not_for, ''), 'A beach-club scene or a big group party.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/touche.bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe','date_night_special']::text[] else jobs end
where slug = 'touche-cafe-and-restaurant' and district = 'canggu';

-- 31. udara-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Organic Ocean, the plant-forward restaurant at the Udara wellness retreat in Seseh, focused on healthy, community- and earth-conscious cooking, open daily to guests and visitors.'),
    best_for = coalesce(nullif(best_for, ''), 'Wellness- and health-minded diners wanting calm, organic food; a quiet, restorative meal near the beach.'),
    not_for = coalesce(nullif(not_for, ''), 'A lively nightlife scene or a heavy meat-and-cocktails night out.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.udara-bali.com/dining/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/udarabali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','quiet_work_cafe','brunch_after_surf']::text[] else jobs end
where slug = 'udara-bali' and district = 'canggu';

-- 32. neighbourhood-food-seseh
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A local eatery and coffee shop set among the tranquil Seseh fields, serving slow breakfasts, laid-back afternoon snacks and weekend dinners with fresh, simple dishes from local produce.'),
    best_for = coalesce(nullif(best_for, ''), 'A relaxed breakfast or brunch, an easy weekend dinner, and calm coffee stops away from the crowds.'),
    not_for = coalesce(nullif(not_for, ''), 'A high-energy party or beach-club atmosphere.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.neighbourhoodfood.co/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/neighbourhoodbali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','local_food_calm','quiet_work_cafe']::text[] else jobs end
where slug = 'neighbourhood-food-seseh' and district = 'canggu';

-- 33. seseh-general-store
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An Aussie-owned corner cafe bringing Melbourne coffee culture to coastal Cemagi/Seseh, doing well-made breads, sandwiches and salads a short step from the beach, with a community-hub feel.'),
    best_for = coalesce(nullif(best_for, ''), 'A morning coffee and pastry, a casual sandwich-and-salad lunch, and a laid-back neighbourhood cafe stop after the beach.'),
    not_for = coalesce(nullif(not_for, ''), 'A sit-down dinner or a formal evening out.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Milk-based coffee (flat white); sandwiches and salads'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.sesehgeneralstore.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/sesehgeneralstore/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe','local_food_calm']::text[] else jobs end
where slug = 'seseh-general-store' and district = 'canggu';

-- 34. miel-specialty-coffee-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A serious specialty-coffee cafe on Batu Bolong with a dedicated brew bar (V60, pour-over, cold brew) built on quality beans, set in a bright, plant-filled, high-ceilinged space. Spacious tables, quiet room and fast wifi make it a genuine work spot as much as a coffee stop.'),
    best_for = coalesce(nullif(best_for, ''), 'Coffee-focused solo travellers and remote workers who want a proper filter coffee and a calm table to sit and work for a few hours; also an easy morning brunch.'),
    not_for = coalesce(nullif(not_for, ''), 'Best in the daytime rather than as an evening or late-night hangout.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Filter/brew-bar coffee (V60 or pour-over) and their signature single-origin filters; Big Brekkie; French toast with vanilla poached pears'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/miel.bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['quiet_work_cafe','brunch_after_surf']::text[] else jobs end
where slug = 'miel-specialty-coffee-canggu' and district = 'canggu';

-- 35. rise-and-shine-cafe
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A long-running, colourful all-day breakfast and lunch cafe in Berawa (open since 2017) serving fresh, health-conscious comfort food, coffee and juices in an open-air, al-fresco setting.'),
    best_for = coalesce(nullif(best_for, ''), 'A bright, casual morning-after-the-beach breakfast or brunch, good for solo travellers, couples and small groups wanting healthy plates.'),
    not_for = coalesce(nullif(not_for, ''), 'A daytime breakfast-and-lunch spot rather than an evening dinner or drinks venue.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Breakfast burrito; super scramble; Morning Magic smoothie'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/riseandshine_bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = 'rise-and-shine-cafe' and district = 'canggu';

-- 36. ruko-cafe
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An Australian-style neighbourhood cafe about 300m from Berawa beach, serving locally sourced healthy food and its own Indonesian coffee blend, with 40-50% local organic produce. A reliable daily breakfast and brunch stop.'),
    best_for = coalesce(nullif(best_for, ''), 'Post-beach breakfast, brunch and coffee for solo travellers, couples and families who want fresh, organic-leaning food near Berawa.'),
    not_for = coalesce(nullif(not_for, ''), 'A daytime cafe rather than an evening or dinner destination.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Coffee on the house Indonesian blend; pancakes; avocado toast; fresh smoothies'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/rukocafe/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf']::text[] else jobs end
where slug = 'ruko-cafe' and district = 'canggu';

-- 37. satu-satu-coffee-company
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A family-run specialty coffee company in Berawa built on the Sudana family''s Balinese single-origin beans, roasted in-house, with a bright, eco-minded white space and a simple all-day menu of bowls, sandwiches and smoothies for the post-surf crowd.'),
    best_for = coalesce(nullif(best_for, ''), 'Coffee lovers and post-surf travellers wanting well-pulled espresso built on Indonesian single origins plus a healthy breakfast or lunch bowl.'),
    not_for = coalesce(nullif(not_for, ''), 'A daytime coffee-and-brunch spot rather than an evening venue.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Espresso or cold brew on their in-house-roasted Indonesian single origins; smoothie bowl (Lady Gaga bowl); ruccola panini; eggs Benedict'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/satusatucoffeecompany/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = 'satu-satu-coffee-company' and district = 'canggu';

-- 38. brunch-club-pererenan
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An all-day, family-friendly brunch cafe in Pererenan set under a large mango tree, with an open, breezy, high-ceilinged space serving big brunch plates, lunch and cocktails. Best known for its fluffy souffle ''Porncakes''.'),
    best_for = coalesce(nullif(best_for, ''), 'A lively all-day brunch or lunch with friends, couples or families; a relaxed sit-down for big sweet and savoury plates plus a cocktail.'),
    not_for = coalesce(nullif(not_for, ''), 'A brunch-and-lunch venue rather than a late-night dinner spot.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Souffle Porncakes; eggs Benedict; French toast; smashed avo'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://brunchclubbali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/brunch_club_bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf']::text[] else jobs end
where slug = 'brunch-club-pererenan' and district = 'canggu';

-- 39. bar-vera-bistro-and-wine-bar
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A new-generation European bistro and wine bar in Pererenan (about 65 seats, inside a boutique hotel) pairing timeless French technique and locally sourced produce with a diverse European wine list and an award-winning cocktail programme, in a warm terracotta-and-wood room open daily until midnight.'),
    best_for = coalesce(nullif(best_for, ''), 'A stylish, relaxed date night, a late dinner or a wine-and-cocktail-focused evening with friends; couples and small groups who want European bistro plates with serious wine and drinks.'),
    not_for = coalesce(nullif(not_for, ''), 'An evening dinner-and-drinks venue rather than a daytime coffee or work cafe.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'European wines by the glass and the cocktail/martini menu; barramundi with lime gelee; prawn risotto; charcoal-roasted chicken; banoffee souffle'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://barverabali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/bar.vera.bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share']::text[] else jobs end
where slug = 'bar-vera-bistro-and-wine-bar' and district = 'canggu';

-- 40. finns-recreation-club-finns-lifestyle-village
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'FINNS Recreation Club is the large membership sport, leisure and wellness club at FINNS Lifestyle Village in Berawa, combining a full gym, Olympic-sized pool, tennis and padel courts, a kids'' club, recovery facilities (ice baths, infrared sauna, compression therapy) and a full-service Balinese spa under one roof.'),
    best_for = coalesce(nullif(best_for, ''), 'Families and active travellers on a longer Canggu/Berawa stay who want gym, pool, courts, kids'' club and spa/recovery in one place; day-pass or membership visitors.'),
    not_for = coalesce(nullif(not_for, ''), 'Travellers wanting a quiet, intimate boutique-spa atmosphere rather than a big multi-facility club.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://finnsrecclub.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/finnsrecclub/')
where slug = 'finns-recreation-club-finns-lifestyle-village' and district = 'canggu';

-- 41. jungle-padel-canggu-shortcut
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Jungle Padel is a dedicated padel club in Canggu with panoramic international-standard courts set in tropical greenery, plus a warung/cafe, pro-shop, changing rooms and coaching, and an app for booking courts and finding playing partners.'),
    best_for = coalesce(nullif(best_for, ''), 'Padel players and active travellers wanting court rental, coaching or social games; groups looking for a sporty activity in Canggu.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone looking for spa, beauty or passive relaxation rather than an active racquet sport.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Padel court booking; coaching sessions'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://junglepadel.com/canggu/')
where slug = 'jungle-padel-canggu-shortcut' and district = 'canggu';

-- 42. bambou-cafe-and-lagree-cemagi
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Bambou Cafe Cemagi is a coffee-and-Lagree concept in Cemagi that pairs a Lagree (high-intensity, low-impact reformer-style) fitness studio with a specialty coffee cafe, so you can take a class and eat healthy food in the same relaxed setting.'),
    best_for = coalesce(nullif(best_for, ''), 'Fitness-minded travellers and locals who want a Lagree/reformer workout combined with a good coffee and healthy brunch, in the quieter Cemagi/Seseh area.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Lagree class'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/bamboucafecemagi/')
where slug = 'bambou-cafe-and-lagree-cemagi' and district = 'canggu';

-- 43. cutiepai-nails
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'CutiePai Nails is a cosy home-based nail salon in Pererenan, minutes from central Canggu, specialising in BIAB, gel nails, extensions, manicures, pedicures and custom hand-painted nail art, with sanitised tools between clients.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting a relaxed, appointment-based nail session (BIAB/gel/nail art) in a small private Pererenan setting, open seven days.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'BIAB / gel manicure; custom nail art'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://cutiepainails.com/')
where slug = 'cutiepai-nails' and district = 'canggu';

-- 44. estetica-belle
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Estetica Belle is a one-stop beauty studio on Jl. Pantai Pererenan (relocated from Canggu in 2025) offering lashes, brows, PMU/lip blush, nails, waxing, laser tattoo removal and advanced Dermalogica/Babor skin treatments, in a design-led stone-and-wood interior with internationally certified staff.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting a broad range of beauty services (lashes, brows, permanent makeup, facials, nails) in one elevated, design-forward Pererenan studio.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Lashes, brows & PMU lip blush; Dermalogica/Babor facials'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.esteticabelle.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/esteticabellecanggu/')
where slug = 'estetica-belle' and district = 'canggu';

-- 45. face-therapy-spa-pererenan
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Face Therapy Spa is a woman-owned boutique spa on Jl. Tukad Pingai in Pererenan, near the beach, focused on facial, head and neck rejuvenation with eco-conscious values and a calm, restorative atmosphere.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting a quiet, focused facial or head/neck massage treatment in a small Pererenan spa.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Facial treatments; head & neck massage'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://linktr.ee/facetherapy')
where slug = 'face-therapy-spa-pererenan' and district = 'canggu';

-- 46. mission-flow-studio
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Mission Flow Studio is a yoga and conscious-movement studio in Pererenan, set in a light-filled space with panoramic windows minutes from the sea, offering Vinyasa flow, Yin and Restorative classes with a rotating roster of experienced teachers.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers and locals wanting varied yoga classes (strong Vinyasa to gentle Yin/Restorative) in a serene Pererenan studio; drop-ins and regular practitioners.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Vinyasa flow; Yin & Restorative classes'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://missionflowstudio.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/missionflowstudio/')
where slug = 'mission-flow-studio' and district = 'canggu';

-- 47. nail-lesss-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Nail Lesss is a nail salon on Jalan Pantai Pererenan offering manicures, gel and acrylic extensions and classic eyelash extensions, known for a clean space and detailed, unhurried work.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting careful gel/acrylic manicures or lash extensions in Pererenan by appointment.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Gel & acrylic manicure; classic lash extensions'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/nail_lesss/')
where slug = 'nail-lesss-canggu' and district = 'canggu';

-- 48. only-nails-pererenan
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Only Nails is a nail salon on Jl. Raya Tiyingtutul in Pererenan specialising in the Russian manicure technique and long-wear gel systems, with an option for 4-hands manicure-and-pedicure service in a calm, retreat-like space.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting a precise Russian manicure or long-lasting gel work, including quick 4-hands mani-pedi sessions, in Pererenan.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Russian manicure; long-wear gel'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://onlynailsbali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/onlynailsbali/')
where slug = 'only-nails-pererenan' and district = 'canggu';

-- 49. wrong-gym-pererenan
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Wrong Gym is an all-inclusive gym and lifestyle club on Jl. Pantai Pererenan (opened 2023) with a large outdoor training area, functional/jungle gym, fitness classes, and recovery facilities including sauna, ice bath, swimming pool, yoga and spa.'),
    best_for = coalesce(nullif(best_for, ''), 'Fitness-focused travellers and digital nomads on a longer Pererenan stay wanting a full-service gym plus classes and recovery (sauna, ice bath, spa).'),
    not_for = coalesce(nullif(not_for, ''), 'Travellers wanting a budget drop-in gym or a purely passive spa visit.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Gym & functional classes; sauna & ice-bath recovery'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://wronggym.com/')
where slug = 'wrong-gym-pererenan' and district = 'canggu';

-- 50. udara-bali-yoga-detox-and-spa-organic-ocean
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Udara Bali is an integrated yoga, detox and wellness retreat resort at Seseh Beach near Canggu, with five ocean-view yoga shalas, Quantum Sound Domes for sound healing, a spa with a water-healing pool, seawater pools and the plant-forward Organic Ocean restaurant; it is adults-only (14+).'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting a dedicated wellness/detox or yoga retreat, sound healing and spa in a quiet adults-only oceanfront setting near Canggu; day-spa and retreat guests.'),
    not_for = coalesce(nullif(not_for, ''), 'Families with young children (adults-only, minimum age 14); anyone wanting a lively town-centre location.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Yoga & detox retreat; sound healing in the Quantum Sound Domes; spa treatments'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.udara-bali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/udarabali/')
where slug = 'udara-bali-yoga-detox-and-spa-organic-ocean' and district = 'canggu';

commit;