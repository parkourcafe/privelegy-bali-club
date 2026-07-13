-- Canggu editorial evidence pass (0021) — the active_deep flagship's first
-- real editorial tranche. 34 established, currently-operating Canggu venues that
-- already exist in the catalogue, enriched from a verified web-research pass
-- (official sites / official IG / reputable non-review listings). This is what
-- flips /canggu + its four guide pages from empty to populated: the publication
-- gate needs why_its_here + best_for + (price_anchor | what_to_order), all set here.
--
-- PROVENANCE: the Drive research uploads turned out to be pipeline PROMPTS, not
-- finished output — no editorial existed to import. This tranche was researched
-- fresh to the same bar as the Uluwatu pass (0018), grounded in first-party
-- sources. GUARDRAILS: no Google/TripAdvisor review text, no star ratings, no
-- review counts (#1); best_for/not_for are WHO/WHEN fit-context only — never
-- quality warnings or anti-lists (#7); prices are bands. jobs use only the
-- existing 9-slug vocabulary (no new entities, #11). Canggu is active_deep so the
-- money loop stays ON via each venue's own tablepilot_slug/perk — untouched here.
--
-- Idempotent: every field is fill-empties-only (coalesce/nullif), so re-running
-- never clobbers existing or hand-edited data; jobs only set when currently empty.
-- Venue detail pages stay noindex (no rights-cleared photos yet) — only the
-- curated /canggu guide surfaces publish.

begin;

-- 1. the-slow
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The restaurant, bar and gallery inside The Slow, a design-led boutique hotel on Batu Bolong. The internationally-inspired kitchen runs all day and the room doubles as an art and events space, so it works as both a stylish breakfast stop and an evening destination.'),
    best_for = coalesce(nullif(best_for, ''), 'A design-conscious brunch or an unhurried dinner; drinks in a good-looking room; travellers who want somewhere polished a short walk from Batu Bolong beach.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','date_night_special']::text[] else jobs end
where slug = 'the-slow' and district = 'canggu';

-- 2. mason
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A moody, minimalist grill on Batu Bolong (trading as MASONRY.) built around wood-fired, Mediterranean-leaning cooking, in-house charcuterie and a serious wine and cocktail list. It''s one of Canggu''s go-to rooms for a proper sit-down dinner.'),
    best_for = coalesce(nullif(best_for, ''), 'Date night; a special dinner; groups who want to share grilled plates and cured meats over cocktails.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://masonrybali.com/canggu'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share','special_occasion']::text[] else jobs end
where slug = 'mason' and district = 'canggu';

-- 3. samesa-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A one-of-a-kind communal Italian dinner: everyone shares one long table for a multi-course, family-style set menu inspired by an Italian grandmother''s table. Dinner only, one seating, book ahead — it''s an event as much as a meal.'),
    best_for = coalesce(nullif(best_for, ''), 'Groups and social diners up for a shared, festive Italian feast; couples and solo travellers happy to sit with strangers.'),
    not_for = coalesce(nullif(not_for, ''), 'A quick a-la-carte bite or a quiet private table — it''s a communal, fixed-menu experience with one long shared table.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The Experience Dinner set menu (the only format); house-made limoncello.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://samesabali.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share','special_occasion','date_night_special']::text[] else jobs end
where slug = 'samesa-canggu' and district = 'canggu';

-- 4. luigis-hot-pizza
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A big, loud Neapolitan pizza joint on Jl. Batu Mejan built out of shipping containers, with a Napoli-imported wood-fired oven and weekly party nights. Pizza and good times are the whole point.'),
    best_for = coalesce(nullif(best_for, ''), 'Groups and friends who want pizza, drinks and a party atmosphere; casual late dinners that turn into a night out.'),
    not_for = coalesce(nullif(not_for, ''), 'A quiet or intimate dinner — it''s a high-energy, music-driven party venue.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Wood-fired Neapolitan-style pizzas.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://luigishotpizza.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share']::text[] else jobs end
where slug = 'luigis-hot-pizza' and district = 'canggu';

-- 5. the-shady-shack
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A breezy all-day vegetarian and vegan cafe overlooking the Berawa rice fields, from the team behind Betelnut. Big wholefood menu — all-day breakfast, smoothies, salads, share plates and vegan desserts — in a leafy, open setting.'),
    best_for = coalesce(nullif(best_for, ''), 'A healthy post-surf brunch; plant-based eaters; a relaxed early dinner with a rice-field view.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.theshadyshackbali.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','family_early_dinner','local_food_calm']::text[] else jobs end
where slug = 'the-shady-shack' and district = 'canggu';

-- 6. milk-and-madu-berawa
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Berawa flagship of Milk & Madu, a long-running all-day Canggu cafe brand doing hearty brunch, lava-stone pizzas and family-friendly dinners. A dependable, crowd-pleasing all-rounder.'),
    best_for = coalesce(nullif(best_for, ''), 'Families and groups; a big post-surf brunch; an easy all-day meal that suits fussy and hungry tables alike.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Ricotta hotcakes; lava-stone pizzas.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://milkandmadu.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://instagram.com/milkandmadu'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','family_early_dinner']::text[] else jobs end
where slug = 'milk-and-madu-berawa' and district = 'canggu';

-- 7. ji-restaurant-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Japanese-contemporary dining set in a reconstructed antique temple at Hotel Tugu, right on Batu Bolong beach, with a terrace and sweeping ocean views. Sushi, Asian-fusion plates and cocktails in one of Canggu''s most atmospheric settings.'),
    best_for = coalesce(nullif(best_for, ''), 'Sunset dinner with a view; date night; a special occasion by the sea.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://jirestaurantbali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://instagram.com/jirestaurantbali'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','date_night_special','special_occasion']::text[] else jobs end
where slug = 'ji-restaurant-bali' and district = 'canggu';

-- 8. luma
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An intimate, 30-seat open-air spot on Batu Bolong doing rustic Mediterranean small plates — Spanish- and Italian-style grazing — from chefs Cameron Emirali (10 Greek Street, London) and Kieran Morland (Merah Putih, Sangsaka). Draught beer, cocktails on tap and vinyl DJs on weekends.'),
    best_for = coalesce(nullif(best_for, ''), 'Golden-hour drinks and small plates; date night; a lively pre-dinner stop that becomes the evening.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Rustic Spanish- and Italian-style small plates for sharing.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.lumabali.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','sunset_drinks_view','group_dinner_share']::text[] else jobs end
where slug = 'luma' and district = 'canggu';

-- 9. santanera
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A stylish Latin American dining room and rooftop bar on Jl. Tanah Barak, blending Latin flavours with European technique and local ingredients across a sharing-focused menu. Contemporary artwork, a big seated room and a late-night bar make it a full evening out.'),
    best_for = coalesce(nullif(best_for, ''), 'Date night; group dinners built around shared plates; a special evening with cocktails on the rooftop.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Baby squid with black garlic mole; dry-aged duck.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.santanerabali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://instagram.com/santanerabali'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share','special_occasion']::text[] else jobs end
where slug = 'santanera' and district = 'canggu';

-- 10. revolver-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Canggu outpost of Revolver, a homegrown Bali coffee brand (est. 2012) that roasts its own beans. An all-day cafe on Jl. Nelayan doing serious espresso, full brunch and heavier evening plates, turning bar-ish after dark.'),
    best_for = coalesce(nullif(best_for, ''), 'Coffee-led brunch after surf; a laptop-friendly morning; an easy all-day sit-down.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'In-house-roasted specialty coffee; the Revolver Big Brekkie.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://revolverbali.com/pages/canggu'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://instagram.com/revolver.bali'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = 'revolver-canggu' and district = 'canggu';

-- 11. bali-buda-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Canggu branch of Bali Buda, a 25-year-old organic wholefoods cafe-and-store brand. Smoothie bowls, fresh juices, wholesome mains and an in-house bakery, with organic groceries and eco goods to take away.'),
    best_for = coalesce(nullif(best_for, ''), 'A wholesome, health-minded brunch or lunch; families; a calm cafe stop with groceries to grab on the way out.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe','family_early_dinner']::text[] else jobs end
where slug = 'bali-buda-canggu' and district = 'canggu';

-- 12. warung-bu-mi
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A local Indonesian warung on Jl. Pantai Batu Bolong doing buffet-style nasi campur — pick-your-own Balinese dishes with plenty of veg and vegan options, generous portions and famously good sambal, all halal and cheap.'),
    best_for = coalesce(nullif(best_for, ''), 'An easy, affordable local meal; just-landed travellers wanting authentic Indonesian food without fuss; solo and casual lunches or dinners.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Nasi campur (build-your-own plate); the house sambal.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://warungbumi.shop/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://instagram.com/warungbumicanggu'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','just_landed_easy_dinner']::text[] else jobs end
where slug = 'warung-bu-mi' and district = 'canggu';

-- 13. ulekan-berawa
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A sit-down Indonesian restaurant in Berawa celebrating dishes from across the archipelago — hand-ground spices, no MSG or palm oil, ingredients sourced from small-scale farmers and fishermen. A pretty, fairy-lit garden setting.'),
    best_for = coalesce(nullif(best_for, ''), 'A relaxed dinner of traditional Indonesian food; groups sharing classic dishes; an accessible introduction to the country''s cuisine.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Beef Rendang; Sate Ayam; Gado Gado.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.ulekanbali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://instagram.com/ulekanbali'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','group_dinner_share']::text[] else jobs end
where slug = 'ulekan-berawa' and district = 'canggu';

-- 14. hippie-fish-pererenan-beach
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A three-storey Mediterranean seafood restaurant and rooftop bar right on Pererenan Beach, with ocean views and a menu built around fresh fish. Casual cafe downstairs, air-conditioned dining above and an open-air rooftop for sunset.'),
    best_for = coalesce(nullif(best_for, ''), 'Beachfront sunset dinner and drinks; date night with a view; groups sharing seafood.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Grilled octopus; tuna crudo; king prawn tortellini.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://hippie-fish.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','date_night_special','group_dinner_share']::text[] else jobs end
where slug = 'hippie-fish-pererenan-beach' and district = 'canggu';

-- 15. woods-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A rustic Pererenan restaurant built entirely from reclaimed wood, serving a Mediterranean menu in a warm, greenery-filled chalet setting. Cafe by day, dinner room by night, with live jazz and vinyl evenings.'),
    best_for = coalesce(nullif(best_for, ''), 'A cosy, atmospheric dinner; date night; groups who want a relaxed evening with live music.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://woodsbali.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share']::text[] else jobs end
where slug = 'woods-bali' and district = 'canggu';

-- 16. crate-cafe
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A high-energy, industrial-style all-day breakfast institution on Jl. Batu Bolong, known for big smoothie bowls and a rotating menu chalked on the wall behind the counter.'),
    best_for = coalesce(nullif(best_for, ''), 'Backpackers and surfers wanting a lively, affordable brunch after a morning in the water; people who like buzz and don''t mind a crowd.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone after a quiet, calm sit-down meal or a spot for focused laptop work.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Smoothie bowls; all-day breakfast plates'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://lifescrate.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/cratecafe/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf']::text[] else jobs end
where slug = 'crate-cafe' and district = 'canggu';

-- 17. milk-and-madu-beach-road
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A spacious, palm-shaded all-day cafe on Batu Bolong beach road with a kids'' play area, brunch classics and lava-stone pizzas, part of the well-known Milk & Madu group.'),
    best_for = coalesce(nullif(best_for, ''), 'Families with young children and groups; brunch through to an easy early dinner, plus daily sunset sessions.'),
    not_for = coalesce(nullif(not_for, ''), 'Couples seeking an intimate, quiet dining atmosphere.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Ricotta hotcakes; smashed avocado; lava-stone pizzas'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://milkandmadu.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','family_early_dinner','group_dinner_share','sunset_drinks_view']::text[] else jobs end
where slug = 'milk-and-madu-beach-road' and district = 'canggu';

-- 18. cafe-vida-healthy-organic-restaurant-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A dedicated healthy organic cafe and espresso bar on Batu Bolong, sourcing local permaculture-grown produce, with no palm oil, cane sugar, wheat flour or MSG and plenty of vegan and raw options.'),
    best_for = coalesce(nullif(best_for, ''), 'Health-conscious eaters and vegans wanting an organic breakfast, lunch or dinner; a calm, wholesome brunch stop.'),
    not_for = coalesce(nullif(not_for, ''), 'Diners looking for classic indulgent comfort food or big meat-heavy plates.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Shakshuka; raw gluten-free cakes; turmeric jamu'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.facebook.com/cafevidabali/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/cafe_vida_bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','local_food_calm']::text[] else jobs end
where slug = 'cafe-vida-healthy-organic-restaurant-canggu' and district = 'canggu';

-- 19. samadi-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A yoga and wellness hub in the Padang Linjong / Berawa area of Canggu with an organic vegetarian cafe certified by the Slow Food movement, serving superfood bowls and traditional Indian dishes.'),
    best_for = coalesce(nullif(best_for, ''), 'Yoga-goers and wellness travellers wanting a calm, plant-based meal before or after a class.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone after meat dishes, alcohol or a high-energy social scene.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Superfood smoothie bowls; traditional Indian dishes'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://samadibali.com/home/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/samadicanggu/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','local_food_calm']::text[] else jobs end
where slug = 'samadi-bali' and district = 'canggu';

-- 20. motion-cafe
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A fitness-focused cafe in the Berawa area from Motion Fitness Foods, built around healthy, customizable meals, meal prep and macro-friendly plates.'),
    best_for = coalesce(nullif(best_for, ''), 'Gym-goers and fitness-minded travellers wanting clean, protein-forward food and healthy breakfasts.'),
    not_for = coalesce(nullif(not_for, ''), 'Diners looking for a rich, indulgent or traditional dining experience.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.motionfitnessbali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/motionfitnessfoods/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf']::text[] else jobs end
where slug = 'motion-cafe' and district = 'canggu';

-- 21. the-avocado-factory
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Billed as South East Asia''s first avocado bar, this Berawa-area cafe builds an entire menu around avocado, from truffle eggs benedict to avo pancakes and avocado basque cheesecake, with an eco-conscious build.'),
    best_for = coalesce(nullif(best_for, ''), 'Avocado and brunch lovers; a novelty-led daytime spot that also runs late with burgers into the evening.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone who dislikes avocado or wants a strictly traditional local menu.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Avocado dishes; truffle eggs benedict; avocado basque cheesecake'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://theavocadofactory.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','group_dinner_share']::text[] else jobs end
where slug = 'the-avocado-factory' and district = 'canggu';

-- 22. two-face-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A specialty coffee and brunch spot on Jl. Munduk Catu in Canggu, focused on well-made coffee, creative brunch dishes and a relaxed community atmosphere.'),
    best_for = coalesce(nullif(best_for, ''), 'Coffee-focused travellers wanting a solid morning brunch and specialty coffee in a welcoming space.'),
    not_for = coalesce(nullif(not_for, ''), 'Late-night diners; the kitchen is a daytime brunch operation.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Specialty coffee; brunch classics'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.twofacebali.com/two-face-canggu'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/twofacecoffee/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf']::text[] else jobs end
where slug = 'two-face-canggu' and district = 'canggu';

-- 23. zin-cafe-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An open-air bamboo cafe near Nelayan Beach that doubles as a genuinely free coworking space, with power outlets at most tables, fast wifi, a quiet upper room and in-house-roasted organic coffee.'),
    best_for = coalesce(nullif(best_for, ''), 'Digital nomads and remote workers wanting to work over breakfast and coffee; also good for a calm, healthy meal near the beach.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone wanting a lively bar scene or a fully quiet fine-dining room.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'House-roasted organic coffee; healthy breakfast plates'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://zin.world/zin-cafe/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/zin_cafe/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['quiet_work_cafe','brunch_after_surf']::text[] else jobs end
where slug = 'zin-cafe-canggu' and district = 'canggu';

-- 24. therapy-day-spa-pererenan
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A day spa on Jl. Pantai Pererenan built around plant-derived, toxin-free and cruelty-free rituals, offering massages, facials, body scrubs and scalp treatments in a calm sanctuary setting.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting a natural, clean-ingredient massage or facial in a serene Pererenan setting.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Balinese and toxin-free massages; facials; body scrubs; scalp rituals'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://therapy.co.id/')
where slug = 'therapy-day-spa-pererenan' and district = 'canggu';

-- 25. rite-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A wellness and recovery sanctuary on Jl. Pantai Pererenan pairing training with a recovery zone that includes a sauna, a cold plunge held at 7-9°C, a jacuzzi and a steam room.'),
    best_for = coalesce(nullif(best_for, ''), 'Active travellers and athletes wanting post-training recovery, contrast therapy and stillness in Pererenan.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone looking for a traditional pampering spa rather than an active recovery and fitness space.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Sauna; cold plunge; jacuzzi and steam room recovery'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://ritebali.com/')
where slug = 'rite-bali' and district = 'canggu';

-- 26. swarna-spa-and-wellness
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A complete spa and wellness destination in Pererenan offering authentic Balinese and hot stone massage, facials and a signature thermal ritual combining hot plunge, cold immersion and infrared sauna.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting a full pampering session of massage, facial and thermal/contrast therapy in one calm venue.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Balinese massage; hot stone massage; facials; thermal ritual (hot & cold plunge, infrared sauna)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://swarnaspa.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/swarnaspaandwellness/')
where slug = 'swarna-spa-and-wellness' and district = 'canggu';

-- 27. la-brisa-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A rustic, sustainability-minded beach club on the foreshore of Echo Beach, hand-built from reclaimed wood salvaged from old Indonesian fishing boats, with a saltwater pool, a raw/oyster bar and wood-fired Mediterranean food. Best known for its driftwood aesthetic and long, open sunset views over the surf break.'),
    best_for = coalesce(nullif(best_for, ''), 'Sunset drinks and a laid-back beach day with friends; a relaxed shared meal by the water'),
    not_for = coalesce(nullif(not_for, ''), 'Guests wanting a polished high-rise pool-party scene rather than a rustic barefoot setting'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Oysters from the raw/oyster bar'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://labrisa-bali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/labrisabali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','group_dinner_share','brunch_after_surf']::text[] else jobs end
where slug = 'la-brisa-bali' and district = 'canggu';

-- 28. the-lawn-canggu-beach-club
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A lifestyle beach club set directly on the black sand of Batu Bolong Beach, with an ocean-facing infinity pool, daybeds and a bar-restaurant known for sunset sessions and DJs over the Indian Ocean. A long-running Canggu spot for daytime lounging that shifts into golden-hour drinks.'),
    best_for = coalesce(nullif(best_for, ''), 'Sunset cocktails from a daybed; an easy day between surf sessions on Batu Bolong'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.thelawncanggu.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/thelawncanggu/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','brunch_after_surf','group_dinner_share']::text[] else jobs end
where slug = 'the-lawn-canggu-beach-club' and district = 'canggu';

-- 29. como-beach-club-canggu
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The upscale beachfront club and restaurant at COMO Uma Canggu on Echo Beach, pairing a large ocean-facing pool with sunset dining, live acoustic music and DJ sets. Known for a refined design, seafood and COMO Shambhala wellness cuisine, plus a popular weekly beachfront Sunday brunch.'),
    best_for = coalesce(nullif(best_for, ''), 'A polished sunset dinner or special occasion by the ocean; a leisurely Sunday brunch'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.comohotels.com/bali/como-uma-canggu/como-beach-club-canggu'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/comobeachclub.canggu/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','special_occasion','date_night_special','group_dinner_share']::text[] else jobs end
where slug = 'como-beach-club-canggu' and district = 'canggu';

-- 30. finns-beach-club
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'One of Canggu''s biggest and best-known day clubs, on a 170m stretch of Berawa beachfront with three pools (including swim-up bars), many bars and kitchens, and a daily lineup of DJs and live vocalists. The high-energy, pool-party end of the Canggu beach-club spectrum.'),
    best_for = coalesce(nullif(best_for, ''), 'A lively pool day and sunset party with a group; big-group high-energy days out'),
    not_for = coalesce(nullif(not_for, ''), 'Guests seeking a quiet, intimate or low-key setting'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://finnsbeachclub.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/finnsbeachclub/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','group_dinner_share']::text[] else jobs end
where slug = 'finns-beach-club' and district = 'canggu';

-- 31. atlas-beach-club
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A vast beach-club-and-super-club complex on Berawa Beach spread across roughly 2.9 hectares, billed as one of the world''s largest, with multiple pools, dining venues, bars, daily cultural performances and world-class entertainment and events. The spectacle-scale, all-day-into-night end of Canggu.'),
    best_for = coalesce(nullif(best_for, ''), 'A big lively day out or event with a group; sunset drinks in a large party setting'),
    not_for = coalesce(nullif(not_for, ''), 'Guests wanting a small, quiet or intimate venue'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://atlasbeachfest.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/atlasbeachfest/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','group_dinner_share','special_occasion']::text[] else jobs end
where slug = 'atlas-beach-club' and district = 'canggu';

-- 32. cafe-del-mar-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Bali edition of the Ibiza-born Café del Mar brand, a two-level, roughly 10,000 sqm beachfront pool club on Berawa Beach with expansive pools, cabanas and sun loungers, chill-house music and international DJs. Known for a summery Mediterranean-inspired sunset atmosphere and cocktails.'),
    best_for = coalesce(nullif(best_for, ''), 'Sunset drinks and a pool day with an Ibiza-style atmosphere; groups after the beach'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://cafedelmarbali.co.id/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/cafedelmarbali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','group_dinner_share']::text[] else jobs end
where slug = 'cafe-del-mar-bali' and district = 'canggu';

-- 33. mosto-berawa
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An intimate neo-bistro and natural wine bar in the heart of Berawa, billed as Indonesia''s first natural wine bar, with a compact room of around 60 covers and a curated list of 70+ natural-wine labels from small producers alongside ingredient-focused food. An evenings-only spot for food and wine lovers.'),
    best_for = coalesce(nullif(best_for, ''), 'A date or intimate dinner centred on natural wine; a small group of wine lovers'),
    not_for = coalesce(nullif(not_for, ''), 'Large groups or anyone after a big beachfront party scene'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Natural wine from the 70+ label list, paired with the seasonal small plates'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://mostobali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/mostobali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share']::text[] else jobs end
where slug = 'mosto-berawa' and district = 'canggu';

-- 34. 12-kitchen-and-wine
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A sleek kitchen-and-wine-bar on Jalan Pantai Berawa that runs from bright breakfasts and coffee by day to dim-lit, elegant evening dining with a DJ. Known for a dark marble-anchored dining room, Mediterranean-leaning sharing plates and grilled proteins, and a broad, curated wine list.'),
    best_for = coalesce(nullif(best_for, ''), 'A date or dressed-up dinner over wine; a small group sharing plates in the evening'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'A pour from the curated wine list alongside the sharing plates'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://12kitchenwine.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/12kitchenandwine/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share']::text[] else jobs end
where slug = '12-kitchen-and-wine' and district = 'canggu';

commit;