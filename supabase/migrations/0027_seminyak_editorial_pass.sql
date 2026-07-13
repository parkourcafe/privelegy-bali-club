-- Seminyak editorial evidence pass (0027) -- same verified-source bar and guardrails
-- as the Canggu/Ubud passes: 33 established, currently-open Seminyak-area venues
-- (restaurants, cafes, a bar, a beach club, a warung, spas, beauty salons, fitness
-- studios and yoga) enriched from a fresh web-research pass grounded in official
-- sites / official IG / reputable non-review listings. Seminyak is planning_only
-- (guardrail #4) -- no money loop, no booking-as-a-feature language.
--
-- Also cleans up 7 rows the research flagged (deactivated, NOT enriched):
--   Duplicates collapsed to one canonical venue:
--     soham-pilates-class-program / soham-yoga / soham-wellness-spa  -> soham-wellness-center-seminyak
--     prana-spa-yoga-fitness-adjacent                               -> prana-yoga-seminyak (Prana Spa's yoga centre)
--     bodyworks-beauty                                              -> bodyworks-spa-seminyak (one Bodyworks venue)
--   Mis-districted (verified real, but NOT in Seminyak) -> deactivated for honesty:
--     cocoon-medical-spa (nearest branch Legian), rejuvie-aesthetic (Kuta/Sanur).
--
-- GUARDRAILS: no review text/ratings (#1); best_for/not_for are WHO/WHEN fit-context
-- only, never quality warnings (#7); prices as bands; jobs use the existing 9-slug
-- vocabulary (#11); spa/beauty/fitness/yoga carry no dining jobs. Idempotent:
-- enrich is fill-empties-only; deactivations are guarded to still-active rows.

begin;

-- Deactivate duplicate / mis-districted rows (dedupe + honesty).
update public.venues set status='inactive' where slug='bodyworks-beauty-seminyak-seminyak' and district='seminyak' and status='active';
update public.venues set status='inactive' where slug='cocoon-medical-spa-seminyak-seminyak' and district='seminyak' and status='active';
update public.venues set status='inactive' where slug='prana-spa-yoga-fitness-adjacent-seminyak' and district='seminyak' and status='active';
update public.venues set status='inactive' where slug='rejuvie-aesthetic-bali-seminyak-seminyak' and district='seminyak' and status='active';
update public.venues set status='inactive' where slug='soham-pilates-class-program-seminyak' and district='seminyak' and status='active';
update public.venues set status='inactive' where slug='soham-wellness-spa-seminyak' and district='seminyak' and status='active';
update public.venues set status='inactive' where slug='soham-yoga-seminyak' and district='seminyak' and status='active';

-- 1. moonlite-kitchen-and-bar
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'One of Seminyak''s original rooftop venues, perched atop the Anantara Seminyak Bali Resort with an open-air deck and lounge overlooking Seminyak Beach and the Indian Ocean. Asian-fusion plates and cocktails with nightly live music.'),
    best_for = coalesce(nullif(best_for, ''), 'Couples and small groups wanting a sunset drink or an elevated dinner with an ocean view.'),
    not_for = coalesce(nullif(not_for, ''), 'Travellers after a cheap quick bite or a quiet local warung setting.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Balinese crispy duck; Bali baby pork ribs'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.moonlitebali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/moonlitebali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','date_night_special','special_occasion']::text[] else jobs end
where slug = 'moonlite-kitchen-and-bar' and district = 'seminyak';

-- 2. ku-de-ta
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Bali''s original beach club (est. 1999) on the sand at Seminyak Beach, the benchmark oceanfront day-to-night destination — daybeds and dining that roll from laid-back afternoons into golden-hour sunsets and DJ nights.'),
    best_for = coalesce(nullif(best_for, ''), 'Sunset drinks on the beach, day-to-night groups, and marking a special occasion by the ocean.'),
    not_for = coalesce(nullif(not_for, ''), 'Budget travellers or anyone wanting a quiet, intimate meal.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://kudeta.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['sunset_drinks_view','special_occasion','date_night_special','group_dinner_share']::text[] else jobs end
where slug = 'ku-de-ta' and district = 'seminyak';

-- 3. corner-house-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'All-day cafe and social spot on Jl. Kayu Aya (Eat Street), blending casual island dining with an elevated touch — hearty plates, crafted cocktails and warm hospitality, open from breakfast until late.'),
    best_for = coalesce(nullif(best_for, ''), 'All-day brunch, casual dining and drinks with friends in the heart of Seminyak.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone wanting a quiet focused workspace or formal fine dining.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://cornerhousebali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/cornerhousebali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','date_night_special','group_dinner_share']::text[] else jobs end
where slug = 'corner-house-bali' and district = 'seminyak';

-- 4. revolver-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Bali''s original specialty-coffee institution (opened 2012), hidden down a narrow laneway off Jl. Kayu Aya. House-roasted local Arabica, an Australian-style espresso bar and a hearty brunch menu in a dark-timber, exposed-brick room.'),
    best_for = coalesce(nullif(best_for, ''), 'Serious coffee and a solid brunch; laptop-and-espresso mornings.'),
    not_for = coalesce(nullif(not_for, ''), 'Large groups (tight space) or anyone after late-night dining.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'House-roasted espresso / flat white'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://revolverbali.com/pages/seminyak'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/revolver.bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = 'revolver-seminyak' and district = 'seminyak';

-- 5. 7am-bakers-umalas
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'French loft-style bakery in Umalas run by a French baker, one of the area''s go-to early-morning spots. Sourdough, viennoiserie and pastries baked in-house, plus coffee and light breakfast/lunch; open 7am-7pm daily.'),
    best_for = coalesce(nullif(best_for, ''), 'Early breakfast, pastries and coffee, and relaxed casual work.'),
    not_for = coalesce(nullif(not_for, ''), 'Evening dining or a night out.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Sourdough loaves; croissants and viennoiseries'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://sevenambakers.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/7am.bakers/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = '7am-bakers-umalas' and district = 'seminyak';

-- 6. ginger-moon-canteen
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Long-running Seminyak modern-Asian canteen from chef Dean Keddell (open since 2012) on Eat Street, built around shareable Indonesian- and Balinese-inflected plates and a community-sourcing ethos.'),
    best_for = coalesce(nullif(best_for, ''), 'Shared modern-Asian dinners with groups or family in a relaxed setting.'),
    not_for = coalesce(nullif(not_for, ''), 'Diners wanting Western comfort food or a formal fine-dining room.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.gingermoonbali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/gingermoonbali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share','date_night_special','family_early_dinner']::text[] else jobs end
where slug = 'ginger-moon-canteen' and district = 'seminyak';

-- 7. hog-wild-with-chef-bruno
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Boisterous family-style rib joint from French chef Bruno Fortin near Batu Belig/Petitenget, known across Bali for fall-off-the-bone pork ribs and stiff martinis served at big shared tables.'),
    best_for = coalesce(nullif(best_for, ''), 'Loud, sharing-style group rib feasts.'),
    not_for = coalesce(nullif(not_for, ''), 'Quiet, intimate or formal fine-dining occasions.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Pork ribs (honey-ginger or BBQ sauce); martinis'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://hogwild.id/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share','family_early_dinner']::text[] else jobs end
where slug = 'hog-wild-with-chef-bruno' and district = 'seminyak';

-- 8. la-casetta-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Family-run authentic Italian home-style kitchen in Umalas (since 2013) that doubles as a cafe, bakery and deli — comfort-forward pasta and pizza in a casual neighbourhood setting.'),
    best_for = coalesce(nullif(best_for, ''), 'Casual, authentic Italian with couples or families.'),
    not_for = coalesce(nullif(not_for, ''), 'Diners seeking local Indonesian food or a nightlife scene.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.lacasettabali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/lacasetta.bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','family_early_dinner','group_dinner_share']::text[] else jobs end
where slug = 'la-casetta-bali' and district = 'seminyak';

-- 9. mauri-restaurant
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Contemporary Italian fine-dining room on Jl. Petitenget from chef Maurizio Bombini (since 2018), serving a modern Apulian menu of handmade pasta and a signature tasting menu in an all-white space with a rooftop lounge; a Wine Spectator honouree.'),
    best_for = coalesce(nullif(best_for, ''), 'Special-occasion fine dining, wine lovers and couples.'),
    not_for = coalesce(nullif(not_for, ''), 'Budget or casual quick meals, and families with young children.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Signature Tasting Menu; handmade pastas'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$$'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['special_occasion','date_night_special']::text[] else jobs end
where slug = 'mauri-restaurant' and district = 'seminyak';

-- 10. natys-restaurant-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Balinese and Indonesian restaurant on Jl. Kayu Aya at Natya Hotel & Resort, serving authentic savoury Indonesian cuisine in a relaxed room with soft lighting and live music.'),
    best_for = coalesce(nullif(best_for, ''), 'Authentic Indonesian food in a calm, welcoming setting; couples and families.'),
    not_for = coalesce(nullif(not_for, ''), 'Diners after Western food or a party atmosphere.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://natysrestaurant.com/natys-restaurant-seminyak/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/natys_restaurant/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','family_early_dinner','date_night_special']::text[] else jobs end
where slug = 'natys-restaurant-seminyak' and district = 'seminyak';

-- 11. nook-umalas
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Open-air garden restaurant set among the rice paddies of Umalas, known locally as ''the rice-field restaurant'', serving Western comfort dishes alongside Balinese and Indonesian plates with a 360-degree paddy view.'),
    best_for = coalesce(nullif(best_for, ''), 'Scenic rice-field breakfast or lunch; families and relaxed groups.'),
    not_for = coalesce(nullif(not_for, ''), 'Nightlife or a buzzy see-and-be-seen scene.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Big Nook Burger; Nasi Campur Bali Ayam; Pork Belly Sambal Matah'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','family_early_dinner','local_food_calm','group_dinner_share']::text[] else jobs end
where slug = 'nook-umalas' and district = 'seminyak';

-- 12. poule-de-luxe-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'French-style luxury patisserie and bakery in Seminyak specialising in macarons, custom cakes and pastries, with a cafe menu of baked goods and coffee.'),
    best_for = coalesce(nullif(best_for, ''), 'Coffee and pastries, dessert lovers and picking up a cake or sweet treat.'),
    not_for = coalesce(nullif(not_for, ''), 'A full savoury dinner or an evening out.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Macarons; custom cakes; French pastries'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.pouledeluxe.fr/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/pouledeluxebali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['quiet_work_cafe','brunch_after_surf']::text[] else jobs end
where slug = 'poule-de-luxe-bali' and district = 'seminyak';

-- 13. naughty-nuris-warung-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Seminyak branch (opened 2016) of the legendary Bali warung on Jl. Mertanadi, famous for Balinese-spiced, charcoal-grilled pork spare ribs and its potent martinis in a casual roadside setting.'),
    best_for = coalesce(nullif(best_for, ''), 'Casual, sharing-style pork rib feasts with a group.'),
    not_for = coalesce(nullif(not_for, ''), 'Fine dining, vegetarians, or a quiet romantic dinner.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Pork spare ribs; martini'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.naughtynurisseminyak.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/naughtynurisseminyak/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share','family_early_dinner']::text[] else jobs end
where slug = 'naughty-nuris-warung-seminyak' and district = 'seminyak';

-- 14. jari-menari-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A Seminyak massage institution open since 2001 whose name means "dancing fingers." Therapists (traditionally an all-male team) are trained in a signature rhythmic, flowing full-body technique in open-air rooms set around a water wall and hand-carved stone.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers who want a serious, technique-led massage rather than a resort pampering session; couples and solo visitors who value a calm, no-frills sanctuary.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone after a glossy medi-spa or a full hair-and-nails salon day out.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Signature Jari Menari full-body massage (or the four-hands version)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://jarimenari.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/jarimenari_seminyak/')
where slug = 'jari-menari-seminyak' and district = 'seminyak';

-- 15. prana-spa-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'One of Bali''s largest and most theatrical day spas, set at Impiana Private Villas (formerly The Villas) on Jl. Kunti. Moorish-inspired interiors, domed ceilings, mosaic tiles and candle-lit corridors house an Indian- and Middle-Eastern-influenced treatment menu including traditional Ayurveda, plus plunge pools, saunas and steam rooms.'),
    best_for = coalesce(nullif(best_for, ''), 'Guests who want an immersive, design-forward spa half-day and are curious about Ayurvedic rituals; special-occasion pampering.'),
    not_for = coalesce(nullif(not_for, ''), 'Travellers looking for a quick, low-key neighbourhood massage.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Ayurvedic Shirodhara ritual'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://pranaspaseminyakbali.com/')
where slug = 'prana-spa-seminyak' and district = 'seminyak';

-- 16. sundari-day-spa-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A long-running Petitenget day spa (branded Sundari Wellness) blending modern and traditional techniques with natural products, offering massages, body treatments, facials and mani-pedis across a wide menu, open late into the evening.'),
    best_for = coalesce(nullif(best_for, ''), 'Visitors who want a full menu of treatments in one calm Petitenget address, including evening appointments after the beach.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone seeking a minimalist single-therapy studio.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'http://sundari-wellness.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/sundari.wellness/')
where slug = 'sundari-day-spa-seminyak' and district = 'seminyak';

-- 17. bodyworks-spa-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A pioneer of the modern Seminyak day-spa model, open for over two decades, now in a striking pink Moroccan-style building with a central pool. Combines a full massage and spa menu with hair, nails, facials and waxing under one roof.'),
    best_for = coalesce(nullif(best_for, ''), 'Groups and friends who want a photogenic, one-stop pampering day mixing massage with hair and nail services; booking ahead on busy days.'),
    not_for = coalesce(nullif(not_for, ''), 'Travellers wanting a quiet, ultra-minimal treatment room away from the crowds.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Traditional Balinese massage with a flower bath'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.bodyworksbali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/bodyworksbali/')
where slug = 'bodyworks-spa-seminyak' and district = 'seminyak';

-- 18. lagoon-spa-seminyak-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A villa-set spa within Villa Seminyak Estate & Spa, running since 2003, with private spa villas, treatment rooms and a reflexology chill room. Known for multi-hour Balinese ritual packages (massage, scrub, flower bath, creambath, facial).'),
    best_for = coalesce(nullif(best_for, ''), 'Guests who want a long, unhurried multi-treatment ritual in a resort-garden setting; couples.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone after a fast walk-in 30-minute foot rub.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Balinese Spa Experience (3-hour ritual package)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.lagoonspaseminyak.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/lagoonspaseminyak/')
where slug = 'lagoon-spa-seminyak-seminyak' and district = 'seminyak';

-- 19. bk-wellness-studio-umalas-by-blue-karma-secrets
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A quiet yoga, Pilates and holistic-healing studio in Umalas, part of the Blue Karma Secrets group. Offers hatha yoga, Pilates, meditation and workshops, plus a dedicated sound-healing dome and sessions with Balinese healers.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers seeking a low-key, spiritually-oriented wellness practice away from the busier Seminyak/Canggu strips; sound-healing and meditation seekers.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone after a high-energy commercial gym or a glossy salon.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Sound-healing dome session'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://bluekarmasecrets.dijiwasanctuaries.com/at/bluekarmavillage/facility/bk-wellness-studio-umalas'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/bluekarmawellness/')
where slug = 'bk-wellness-studio-umalas-by-blue-karma-secrets' and district = 'seminyak';

-- 20. revive-pilates-umalas
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A modern reformer-Pilates studio in Umalas (sister to a Canggu location) running 80+ reformer, mat and barre classes a week, with signature formats like Sweatformer, Gluteformer and Powerformer across all levels.'),
    best_for = coalesce(nullif(best_for, ''), 'Fitness-minded travellers who want a structured reformer-Pilates class in a clean, contemporary studio; drop-in and ClassPass users.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone looking for a passive spa massage or relaxation-only session.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Reformer Pilates class (Sweatformer or Gluteformer)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.reviveandpilates.studio/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/reviveandpilates.studio/')
where slug = 'revive-pilates-umalas' and district = 'seminyak';

-- 21. saia-wellness-saia-pilates-umalas
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A light-filled reformer-Pilates and gym studio in quiet Umalas (with a Canggu sibling), known for brand-new reformers and small classes (max ~6) that mix mat and reformer work in a calm, design-led space.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers who want small-group, well-equipped reformer Pilates in a peaceful setting; all fitness levels.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone seeking a spa treatment or a large-crowd commercial gym.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Small-group reformer Pilates class'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.saiawellness.co/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/saiapilates.bali/')
where slug = 'saia-wellness-saia-pilates-umalas' and district = 'seminyak';

-- 22. think-pink-salon-and-nails-bali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Positioned as Bali''s original nail salon (since 2012), a New York-style spot on Jl. Batu Belig with a huge wall of polishes (OPI to Chanel) and pedicure massage chairs, now expanded to include facials, lashes, waxing, scalp massage and a private Netflix treatment room.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers who want a polished, hygienic manicure/pedicure or nail art, and friends who want a fun pampering session together.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone seeking traditional Balinese healing rituals or a full body-spa experience.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Manicure & pedicure (nail art)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.thinkpinksalon.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/thinkpink.salon/')
where slug = 'think-pink-salon-and-nails-bali' and district = 'seminyak';

-- 23. you-spa-umalas
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A nature-inspired spa in Umalas (opened early 2025, run by PAUSE Group, with a Gili Trawangan sister) offering massages, body masks, facials, haircare and nail treatments, using its own exclusive line of natural products.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers based between Seminyak and Canggu who want a serene, newer spa with a broad treatment menu; product-focused wellness fans.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone specifically after a long-established heritage spa name.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://youspaexperience.com/')
where slug = 'you-spa-umalas' and district = 'seminyak';

-- 24. bali-barber-seminyak-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A premium men''s barbershop brand (original location since 2012) with English-speaking master barbers offering scissor cuts, clipper fades, hot-towel shaves and beard work, plus grooming add-ons like facials and massage. The Seminyak branch shares a building with The Shampoo Lounge.'),
    best_for = coalesce(nullif(best_for, ''), 'Men who want a proper barber cut, beard trim or hot-towel shave while travelling.'),
    not_for = coalesce(nullif(not_for, ''), 'Travellers seeking a full women''s salon or a relaxation spa.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Haircut with hot-towel shave'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.balibarber.com/seminyak')
where slug = 'bali-barber-seminyak-seminyak' and district = 'seminyak';

-- 25. glo-day-spa-salon-seminyak-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A 480 sqm Western-style hair salon and day spa on Jl. Kayu Aya (opened 2022), managed by Australian senior stylists and known for colouring, cutting, keratin work and bridal hair and make-up, alongside spa treatment rooms, beauty rooms and a mani-pedi lounge.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers who want Western-standard hair colour/cut/keratin or bridal hair and make-up, plus salon-and-spa services in one place.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone specifically seeking a purely traditional Balinese massage house.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Keratin smoothing treatment (or bridal hair & make-up)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.glospabali.com/')
where slug = 'glo-day-spa-salon-seminyak-seminyak' and district = 'seminyak';

-- 26. rob-peetoom-hair-spa-bali-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Bali outpost (opened 2012) of Dutch salon brand Rob Peetoom, at Petitenget St No. 16 overlooking rice paddies. Set across three Balinese-village-inspired pavilions, it offers expert hair styling, colour, make-up and signature hair-and-scalp rituals.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting international-standard hair styling and colour, or a hair-and-scalp ritual in a scenic rice-field setting.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone looking for a body-massage spa or a budget quick cut.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Hair & scalp ritual'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://robpeetoom.com/en-us/pages/salon-seminyak')
where slug = 'rob-peetoom-hair-spa-bali-seminyak' and district = 'seminyak';

-- 27. the-shampoo-lounge-seminyak-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Billed as Bali''s original integrated salon-spa-barber (since 2012) on Jl. Raya Basangkasa, offering hair cuts, colour, keratin and extensions, plus nails, lashes, facials, massage and a men''s barber, with one of Bali''s largest bridal hair-and-make-up teams.'),
    best_for = coalesce(nullif(best_for, ''), 'Groups and families who want hair, beauty, nails and barber services together in one Seminyak spot; bridal parties.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone seeking a quiet single-treatment retreat.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Hair cut & colour (or keratin transformation)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.shampoolounge.com/seminyak')
where slug = 'the-shampoo-lounge-seminyak-seminyak' and district = 'seminyak';

-- 28. bali-fitness-seminyak-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Full-service gym on Sunset Road and the first place in Bali to run Les Mills group classes, with a dedicated bike/spin studio plus a fully equipped weights-and-cardio floor and personal training.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers who want a proper, fully-equipped commercial gym and structured Les Mills group classes while staying in the Seminyak area.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone looking for a quiet boutique studio or a yoga-only wellness space.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'A Les Mills group class (e.g. BodyPump on the Smart Tech kit)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.balifitness.asia/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/balifitnessseminyak/')
where slug = 'bali-fitness-seminyak-seminyak' and district = 'seminyak';

-- 29. rai-fitness-sunset-road-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Founded by Indonesian bodybuilding icon Ade Rai, this is one of Bali''s original mega-gyms on Sunset Road: an enormous Life Fitness weight floor, big cardio section, 40+ Les Mills and other group classes, plus pool, sauna and free parking.'),
    best_for = coalesce(nullif(best_for, ''), 'Serious lifters and travellers who want a large, fully-kitted gym with a wide class timetable and are happy to ride out to Sunset Road.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone wanting a small studio within walking distance of central Seminyak.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/raifitnessbali/')
where slug = 'rai-fitness-sunset-road-seminyak' and district = 'seminyak';

-- 30. soham-wellness-center-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A ~2,500 sqm all-in-one wellness complex in Petitenget: a fully-equipped gym, a half-Olympic swimming pool, a broad group-class timetable (Pilates, HIIT, spinning, TRX, yoga, dance), a luxe spa, plus steam, sauna and hot/cold plunge pools and a healthy cafe.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers and longer-stay guests who want gym, classes, pool and spa under one roof for a full wellness day.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone after a quick, low-cost drop-in gym rather than a full resort-style facility.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://sohamwellnesscenter.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/soham_wellnesscenter/')
where slug = 'soham-wellness-center-seminyak' and district = 'seminyak';

-- 31. jiwa-bikram-yoga-bali-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Bali''s first hot-yoga studio, in Petitenget (north Seminyak): the classic Bikram 26-posture sequence (90 and 60 min) plus Sumits, hot Vinyasa, Ashtanga, Yin and hot Pilates in an unpretentious, small-class setting.'),
    best_for = coalesce(nullif(best_for, ''), 'Bikram and hot-yoga lovers, and travellers wanting an established sweat with near-private class sizes.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone who prefers a cool, gentle practice or a scenic open-air studio.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'A Bikram (26-posture) hot yoga class'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://jiwabali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/jiwayogabali/')
where slug = 'jiwa-bikram-yoga-bali-seminyak' and district = 'seminyak';

-- 32. prana-yoga-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The dedicated Yoga Centre at Prana Spa (Impiana Private Villas, Jl. Kunti 118X) — one of Seminyak''s largest spas — running daily and private classes across Vinyasa, Anusara, Power Vinyasa, Meditative Flow and Sivananda in an ornate Indian/Middle-Eastern-inspired setting.'),
    best_for = coalesce(nullif(best_for, ''), 'Villa and spa guests wanting a calm, upscale yoga class they can combine with a treatment.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone seeking a dedicated hot/Bikram studio or a bare-bones budget drop-in.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://pranaspaseminyakbali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/pranaspabali/')
where slug = 'prana-yoga-seminyak' and district = 'seminyak';

-- 33. yoga-108-bali-seminyak
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An authentic, unpretentious drop-in studio in central Seminyak (Jl. Drupadi 108) with daily classes across Hatha, Vinyasa, Ashtanga, Yin and meditation for all levels, plus a Yoga Alliance 200-hour teacher training, workshops and retreats.'),
    best_for = coalesce(nullif(best_for, ''), 'Drop-in travellers of any level who want traditional, non-heated yoga in the heart of Seminyak with mats and props provided.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone specifically after hot or Bikram-style yoga.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://yoga108bali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/yoga108bali/')
where slug = 'yoga-108-bali-seminyak' and district = 'seminyak';

commit;