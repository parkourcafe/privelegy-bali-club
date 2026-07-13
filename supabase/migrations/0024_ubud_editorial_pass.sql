-- Ubud editorial evidence pass (0024) -- same verified-source bar and guardrails
-- as the Canggu passes (0021/0022): 27 established, currently-open Ubud venues
-- (20 restaurants/warungs incl. dicarik-warung, which 0023 correctly relocated
-- here from Canggu, + 7 cafes) enriched from a fresh web-research pass grounded
-- in official sites / official IG / reputable non-review listings. Ubud is
-- planning/next_deep (guardrail #4) -- no money loop, no booking language.
--
-- Fixes one spelling slip alongside: 'manga-madu' -> 'Warung Mangga Madu' (the
-- real venue drops no letters; DB had lost a 'g'). Direct overwrite of name only,
-- editorial fields fill-empty as usual.
--
-- No jobs-based decision guides exist for Ubud yet (lib/ubud-guides.ts is
-- category-only), so jobs here are stored for future use, not yet surfaced.
--
-- GUARDRAILS: no review text/ratings (#1); best_for/not_for are WHO/WHEN
-- fit-context only, never quality warnings (#7); prices as bands; jobs use the
-- existing 9-slug vocabulary (#11). Idempotent, fill-empties-only except the
-- one direct name correction noted above.

begin;

-- 1. anomali-coffee-ubud
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Bali-founded specialty coffee roaster (est. 2007, ~10 outlets across Indonesia) with an Ubud café pouring single-origin beans sourced from across the archipelago, with a rotating regional-origin selection.'),
    best_for = coalesce(nullif(best_for, ''), 'Coffee-focused travelers who want to compare Indonesian single-origin beans (Aceh, Bali, Toraja, Java) in one sitting, plus casual all-day breakfast.'),
    not_for = coalesce(nullif(not_for, ''), 'Travelers wanting a jungle or rice-field view setting — this is a street-front, town-café atmosphere on Jalan Raya Ubud.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Single-origin flight across Indonesian regions, or a piccolo made with Bali Ulian beans; nitro cold brew.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://anomalicoffee.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/anomali.bali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['quiet_work_cafe','brunch_after_surf']::text[] else jobs end
where slug = 'anomali-coffee-ubud' and district = 'ubud';

-- 2. bali-buda-ubud
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Long-running Bali wholefoods institution (operating in Ubud since 1994) combining an organic grocery/bakery with an all-day restaurant covering raw vegan, Italian, and traditional Indonesian dishes.'),
    best_for = coalesce(nullif(best_for, ''), 'Health-conscious travelers, longer-stay visitors, and mixed groups wanting a big menu with vegetarian, vegan, and gluten-free options (including Bali''s only gluten-free pizza base) in one place.'),
    not_for = coalesce(nullif(not_for, ''), 'Travelers seeking an intimate fine-dining or special-occasion setting — it''s a casual, functional health-food restaurant and shop.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Cassava pancakes; gluten-free pizza; nasi campur or gado gado.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://balibuda.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/balibuda/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','quiet_work_cafe','brunch_after_surf']::text[] else jobs end
where slug = 'bali-buda-ubud' and district = 'ubud';

-- 3. gelato-secrets-ubud
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Artisanal Italian gelato brand that opened its first Bali shop in Ubud in 2009, making fresh daily gelato/sorbetto from all-natural ingredients, including Indonesian-inspired flavors like black rice and coconut pandan.'),
    best_for = coalesce(nullif(best_for, ''), 'A dessert or cool-down stop for families and travelers after sightseeing (e.g., near Monkey Forest / Jalan Raya Ubud).'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Black rice gelato (with espresso, made from locally selected black rice); Coconut Pandan; Chocolate Valrhona.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://gelatosecrets.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/gelatosecrets/')
where slug = 'gelato-secrets-ubud' and district = 'ubud';

-- 4. karsa-cafe
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A rice-paddy and jungle-valley hideaway café along the Campuhan Ridge Walk, serving organic meals, seasonal fruit smoothies, and gourmet coffee with unobstructed green views.'),
    best_for = coalesce(nullif(best_for, ''), 'Travelers finishing the Campuhan Ridge Walk who want a calm, scenic break with healthy food; quiet daytime pause surrounded by rice fields.'),
    not_for = coalesce(nullif(not_for, ''), 'Large groups or late-night plans — it''s a small daytime venue (8am-6pm) reached by a walk down into the valley.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Seasonal fruit smoothie (changes with what''s in season); vegetarian local Indonesian dishes.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.karsacafe.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/karsakafe/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','brunch_after_surf']::text[] else jobs end
where slug = 'karsa-cafe' and district = 'ubud';

-- 5. sawobali
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A vegan/vegetarian warung and cake shop in Peliatan (Ubud) known for a budget, all-you-can-eat home-style buffet and made-in-house cakes; dishes are prepared without garlic or onion to also suit Buddhist diners.'),
    best_for = coalesce(nullif(best_for, ''), 'Vegan, vegetarian, or allium-free travelers wanting an affordable, home-cooked-style lunch buffet.'),
    not_for = coalesce(nullif(not_for, ''), 'Travelers wanting a meat-forward menu or a formal/fine-dining setting.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The daily vegan buffet (glass noodles, house-made sauerkraut, braised kidney beans, carrot fritters); Mango Velvet Cake or Durian Chantilly Cake by the slice.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/sawobali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','brunch_after_surf']::text[] else jobs end
where slug = 'sawobali' and district = 'ubud';

-- 6. seeds-of-life
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A 100% raw & vegan restaurant and Taoist tonic bar in Ubud Center (on Jalan Goutama, operating since 2014), built around raw-food dishes made from fresh, locally grown produce, with Ashtanga yoga classes upstairs.'),
    best_for = coalesce(nullif(best_for, ''), 'Raw-food and vegan-focused travelers, and wellness/yoga-oriented visitors wanting a calm plant-based meal in central Ubud.'),
    not_for = coalesce(nullif(not_for, ''), 'Travelers wanting hearty non-vegan or cooked-comfort-food options.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Raw lasagne (zucchini, Napoli tomato sauce, cashew-nut sauce); cauliflower gnocchi with cashew pesto; SOL Bowl; choc-berry smoothie bowl.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://theseedsoflifecafe.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/seedsoflifebali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','brunch_after_surf','quiet_work_cafe']::text[] else jobs end
where slug = 'seeds-of-life' and district = 'ubud';

-- 7. seniman-coffee-studio
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A well-known Ubud specialty coffee roaster and café near Ubud Palace, treating coffee as a craft with sourced-and-roasted Indonesian origin beans, multiple brew methods, and a food menu spanning Indonesian and Western dishes.'),
    best_for = coalesce(nullif(best_for, ''), 'Remote workers and digital nomads wanting a serious specialty-coffee spot with room to sit and work; coffee enthusiasts wanting origin-focused brews.'),
    not_for = coalesce(nullif(not_for, ''), 'Travelers wanting fast grab-and-go service — service here leans toward a slower, deliberate pace.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Espresso or filter brews from Indonesian single origins; detox juice (beetroot, lime, ginger, carrot); sate or soto ayam.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.senimancoffee.com/seniman-ubud/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/senimancoffee/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['quiet_work_cafe','brunch_after_surf','local_food_calm']::text[] else jobs end
where slug = 'seniman-coffee-studio' and district = 'ubud';

-- 8. bali-bohemia
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A boutique-hotel restaurant and bakery next to the Sacred Monkey Forest Sanctuary, built around fresh, wholesome East-Mediterranean-inspired cooking with a plant-forward focus, plus a standalone bakery arm and live-music evenings.'),
    best_for = coalesce(nullif(best_for, ''), 'Health-conscious travellers wanting a plant-forward breakfast, bakery pastries, or a relaxed dinner with live music in a colourful, creative setting.'),
    not_for = coalesce(nullif(not_for, ''), 'Guests wanting a strictly local Balinese/Indonesian menu or a quiet, music-free dinner.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://balibohemia.com/restaurant'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/rotibohemia/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','quiet_work_cafe']::text[] else jobs end
where slug = 'bali-bohemia' and district = 'ubud';

-- 9. cafe-wayan-and-bakery
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Established in 1986 on Monkey Forest Road, a long-running Ubud institution with a bakery out front and a rice-paddy-view garden behind, serving a wide Indonesian/Thai/Italian menu plus a Sunday-evening traditional Balinese buffet.'),
    best_for = coalesce(nullif(best_for, ''), 'Groups or families wanting an easy, established garden restaurant with a broad menu and a well-known dessert to share.'),
    not_for = coalesce(nullif(not_for, ''), 'Diners seeking a quiet, intimate table (it''s a large, high-turnover tourist institution).'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Death by Chocolate cake (the cafe''s signature, decades-old dessert)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://cafewayan.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/cafewayanbakeryubud/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share','family_early_dinner','local_food_calm']::text[] else jobs end
where slug = 'cafe-wayan-and-bakery' and district = 'ubud';

-- 10. casa-luna
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Ubud''s most enduring restaurant, opened in 1992 by food writer Janet DeNeefe on Jalan Raya Ubud; the menu moves between authentic Balinese cuisine (nasi campur, ceremonial curries, slow-cooked spice-paste dishes) and a modern Mediterranean side, with pastries from the sister Honeymoon Bakery.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting a genuine, long-established Balinese dining experience in the centre of Ubud, from breakfast through dinner.'),
    not_for = coalesce(nullif(not_for, ''), 'Very budget-conscious travellers looking for street-warung prices (a well-known, mid-range destination restaurant).'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Lime tart (a limited daily-morning batch that regularly sells out by mid-afternoon); Balinese-style paella; smoked duck feast for two'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://casalunabali.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','group_dinner_share','special_occasion']::text[] else jobs end
where slug = 'casa-luna' and district = 'ubud';

-- 11. cascades
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The gourmet restaurant of Viceroy Bali (also branded as part of CasCades Suites), perched atop the Valley of the Kings about five minutes'' drive from central Ubud, pairing panoramic jungle-valley views with a Balinese Rijsttafel tasting menu and Western dishes built on produce from its own organic gardens.'),
    best_for = coalesce(nullif(best_for, ''), 'Couples or small groups wanting a scenic, sit-down valley-view meal with a curated Indonesian tasting format.'),
    not_for = coalesce(nullif(not_for, ''), 'Travellers without their own transport looking for a walk-in meal in central Ubud, or budget diners.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Royal Rijsttafel tasting plate; Wild Mushroom & Truffle Risotto'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.cascadesbali.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','special_occasion','sunset_drinks_view']::text[] else jobs end
where slug = 'cascades' and district = 'ubud';

-- 12. donna-ubud
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A restaurant, lounge and rooftop bar in the middle of Jalan Monkey Forest blending Mediterranean and Latin American cuisine, open daily from late morning until late, with a Friday-night club upstairs and shisha available after 4pm.'),
    best_for = coalesce(nullif(best_for, ''), 'Groups or couples wanting a stylish dinner with cocktails and a lively nightlife atmosphere in central Ubud.'),
    not_for = coalesce(nullif(not_for, ''), 'Guests wanting a quiet, early, low-key dinner (the venue turns into a nightclub on Friday nights).'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Seafood/Peruvian paella; 24k Gold Wagyu steak with truffle mash; grilled octopus'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://donnaubud.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/donnaubud/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share','sunset_drinks_view']::text[] else jobs end
where slug = 'donna-ubud' and district = 'ubud';

-- 13. fair-warung-bale
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A social-enterprise warung on Jalan Sriwedari (Taman Kaja) run by the Fair Future Foundation/Bali Sari Foundation, where restaurant proceeds fund free medical consultations for the local community; serves Indonesian, Asian-fusion and vegetarian dishes daily.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting an easy, good-value Indonesian meal that also funds a local healthcare program; casual lunch or early dinner.'),
    not_for = coalesce(nullif(not_for, ''), 'Diners seeking upscale fine dining or a view/sunset setting (a simple, ten-table warung).'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Chicken satay; tuna fillet; cashew chicken'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://fairwarungbale.shop/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/fairwarungbaleubud/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','just_landed_easy_dinner','family_early_dinner']::text[] else jobs end
where slug = 'fair-warung-bale' and district = 'ubud';

-- 14. hujan-locale
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A modern Indonesian restaurant in Ubud Center by chef Will Meyrick, housed in a stylishly renovated two-story building (bar downstairs, dining room with temple and street views upstairs), reworking street-food flavours from Java, Sumatra, Sulawesi and Bali with modern presentation and locally sourced ingredients.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting an elevated, chef-driven take on Indonesian regional cooking for a dinner or shared meal.'),
    not_for = coalesce(nullif(not_for, ''), 'Diners wanting a cheap, no-frills traditional warung experience.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Nasi Bakar Babi (slow-cooked pork belly with black-nut rice in banana leaf, grilled over coconut husk, served with black bean broth)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://hujanlocale.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/hujan_locale/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','group_dinner_share','local_food_calm']::text[] else jobs end
where slug = 'hujan-locale' and district = 'ubud';

-- 15. ibu-rai
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A long-running restaurant and gallery on Jalan Monkey Forest founded by the family of Ibu Rai (born 1925, who ran a food stall near Ubud Palace); opened as a restaurant in 1992 and now serves a fusion of Indonesian specialties and European dishes in a central, art-filled setting.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers wanting an easy, centrally located sit-down meal that mixes Indonesian classics with familiar European comfort dishes.'),
    not_for = coalesce(nullif(not_for, ''), 'Guests wanting a quiet, private table away from Ubud''s busiest tourist strip.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Nasi goreng; honey ginger prawns'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/iburairestaurant/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','just_landed_easy_dinner','family_early_dinner']::text[] else jobs end
where slug = 'ibu-rai' and district = 'ubud';

-- 16. laka-leke
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The sister restaurant of Cafe Wayan & Bakery, set in a garden bordering rice fields near Nyuh Kuning/Monkey Forest, with tree-shaded pavilions for private dining, afternoon craft workshops, and scheduled evenings with Balinese dance performances (Kecak/Fire Dance) and a group buffet.'),
    best_for = coalesce(nullif(best_for, ''), 'Groups wanting a scenic rice-field garden dinner with a Balinese cultural show, or a private-pavilion group meal.'),
    not_for = coalesce(nullif(not_for, ''), 'Solo travellers or those wanting a quick, casual walk-in meal without a cultural-show setting.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Nasi campur; smoked marlin pate; bebek putu (duck) — crispy duck is a noted favourite'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.lakaleke.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share','special_occasion','family_early_dinner']::text[] else jobs end
where slug = 'laka-leke' and district = 'ubud';

-- 17. locavore-nxt
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Opened December 2023 in Lodtunduh as the more experimental, ingredient-driven sibling of Ubud''s famous fine-dining restaurant Locavore, led by chefs Eelke Plasmeijer and Ray Adriansyah; a 30-seat tasting-menu space using only local Indonesian ingredients with modern European technique, ranked among Asia''s 50 Best Restaurants.'),
    best_for = coalesce(nullif(best_for, ''), 'Food-focused travellers wanting a multi-course, reservation-based tasting-menu experience celebrating Indonesian farmers, fishers and producers.'),
    not_for = coalesce(nullif(not_for, ''), 'Casual walk-in diners, budget travellers, or anyone wanting a quick, low-key meal (advance-reservation, multi-course tasting format only).'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://locavorenxt.com/family/locavorenxt'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','special_occasion']::text[] else jobs end
where slug = 'locavore-nxt' and district = 'ubud';

-- 18. manga-madu
update public.venues set
    name = 'Warung Mangga Madu',
    why_its_here = coalesce(nullif(why_its_here, ''), 'A central-Ubud warung (found online as "Warung Mangga Madu" — note the DB entry drops one ''g'') serving straightforward, affordable Indonesian comfort food near Jl. Gunung Sari, a short walk off the main Ubud strip.'),
    best_for = coalesce(nullif(best_for, ''), 'budget travelers wanting classic Indonesian comfort food close to central Ubud'),
    not_for = coalesce(nullif(not_for, ''), 'diners seeking a fine-dining atmosphere or an extensive wine list'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Ayam Bakar Madu (honey-glazed grilled chicken); Nasi Goreng; Beef Rendang'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://warungmanggamadu.shop/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/warungmanggamadu/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','family_early_dinner']::text[] else jobs end
where slug = 'manga-madu' and district = 'ubud';

-- 19. mozaic
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A long-running fine-dining anchor in Kedewatan led by Chef Chris Salans, built around French technique and Indonesian/Balinese ingredients, with a multi-course tasting-menu format and a separate live-kitchen Chef''s Table.'),
    best_for = coalesce(nullif(best_for, ''), 'special-occasion diners wanting French-Balinese tasting-menu fine dining in a garden setting'),
    not_for = coalesce(nullif(not_for, ''), 'travelers on a tight daily budget or wanting a quick casual meal'),
    what_to_order = coalesce(nullif(what_to_order, ''), '6-course seasonal tasting menu; 8-course tasting menu; vegetarian botanical tasting menu'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.mozaic-bali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/mozaicrestaurantubud/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','special_occasion']::text[] else jobs end
where slug = 'mozaic' and district = 'ubud';

-- 20. onion-collective
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A hotel/restaurant/coworking hangout on Jl. Raya Pengosekan with a pool, live music, and a menu built to serve vegan and non-vegan travelers alike — as much a daytime work spot as a dinner-and-drinks spot.'),
    best_for = coalesce(nullif(best_for, ''), 'digital nomads and groups wanting an all-day hangout with vegan-friendly food, coworking, and live music'),
    not_for = coalesce(nullif(not_for, ''), 'diners wanting a quiet, formal sit-down dinner'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://theonionco.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/theonionco/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['group_dinner_share','quiet_work_cafe']::text[] else jobs end
where slug = 'onion-collective' and district = 'ubud';

-- 21. room4dessert
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Chef Will Goldfarb''s dessert-only tasting-menu restaurant in Kedewatan, set inside a large botanical garden tied to the dessert recipes themselves — a globally recognized pastry-chef concept rather than a conventional dinner spot.'),
    best_for = coalesce(nullif(best_for, ''), 'dessert-focused special occasions and pastry enthusiasts wanting a multi-course tasting experience'),
    not_for = coalesce(nullif(not_for, ''), 'travelers wanting a full savory dinner or a budget meal'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Full dessert tasting menu (with pairings); Spiritless tasting menu (non-alcoholic pairing)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.room4dessert.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','special_occasion']::text[] else jobs end
where slug = 'room4dessert' and district = 'ubud';

-- 22. the-elephant
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An open-air, 100% vegetarian/vegan restaurant on the Campuhan side of Ubud (Jl. Raya Sanggingan) built around an elevated terrace overlooking Campuhan Ridge, open all day from breakfast through dinner, with an organic/local/slow-food sourcing philosophy.'),
    best_for = coalesce(nullif(best_for, ''), 'vegetarian and vegan travelers wanting an all-day scenic meal overlooking Campuhan Ridge'),
    not_for = coalesce(nullif(not_for, ''), 'diners specifically wanting meat or seafood dishes'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'vegetarian bolognese pasta; veggie burger; lumpia'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.elephantbali.com/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['brunch_after_surf','sunset_drinks_view']::text[] else jobs end
where slug = 'the-elephant' and district = 'ubud';

-- 23. warung-mendez
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A small, Mexican-owned warung tucked in Penestanan village northwest of central Ubud, run by an all-women kitchen team, serving Indonesian/Javanese and fusion dishes with an MSG-free, low-plastic ethos.'),
    best_for = coalesce(nullif(best_for, ''), 'travelers wanting a quiet, home-style Indonesian meal off the main Ubud strip in Penestanan'),
    not_for = coalesce(nullif(not_for, ''), 'those wanting a central, easy-to-find location right in town'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Nasi Goreng Magelangan (rice-noodle mix with chicken satay); chicken satay'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','just_landed_easy_dinner']::text[] else jobs end
where slug = 'warung-mendez' and district = 'ubud';

-- 24. warung-siam
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A family-run Thai warung on Jl. Goutama in central Ubud, opened 2014, known for cooking dishes the traditional Thai way with fresh herbs, lime, and chilis rather than a Westernized menu.'),
    best_for = coalesce(nullif(best_for, ''), 'travelers craving authentic home-style Thai food in central Ubud'),
    not_for = coalesce(nullif(not_for, ''), 'large groups needing extensive seating — it''s a small patio/counter-style spot'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Tom Yum soup; Tom Kha Gai; spicy basil chicken; Mango Sticky Rice'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/warungsiam/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','group_dinner_share']::text[] else jobs end
where slug = 'warung-siam' and district = 'ubud';

-- 25. whos-who
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A tucked-away Belgian bistro in the S-bend of south Ubud (near Jl. Raya Pengosekan) serving Belgian comfort classics alongside Indonesian-influenced touches, easy to walk past because of its small, unassuming signage.'),
    best_for = coalesce(nullif(best_for, ''), 'couples wanting a romantic, tucked-away dinner with Belgian comfort food'),
    not_for = coalesce(nullif(not_for, ''), 'those wanting a highly visible, easy-to-spot street-front restaurant'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Stoofvlees (Flemish beef stew); spinach crackers starter; Lumpia'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/whoswhobali/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['date_night_special','local_food_calm']::text[] else jobs end
where slug = 'whos-who' and district = 'ubud';

-- 26. wulan-vegetarian-warung
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A small, hole-in-the-wall all-vegan warung in the Peliatan area of Ubud, cash-only, serving an Indonesian menu of nasi goreng, tempeh, smoothies, and vegan sweets at very low prices.'),
    best_for = coalesce(nullif(best_for, ''), 'budget-conscious vegan and vegetarian travelers wanting simple, authentic Indonesian dishes'),
    not_for = coalesce(nullif(not_for, ''), 'diners wanting to pay by card or a polished sit-down setting — it''s cash-only, floor-cushion seating'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Ultimate Nasi Goreng (vegan); vegan tempeh; tropical fruit smoothie'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/wulanveg/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm','brunch_after_surf']::text[] else jobs end
where slug = 'wulan-vegetarian-warung' and district = 'ubud';

-- 27. dicarik-warung
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A rice-field-walk warung on Jl. Kajeng (Subak Juwuk Manis) north of central Ubud, run by a mother-daughter team, known primarily for its hands-on Balinese cooking class (garden spice ID, 7 dishes + 2 drinks) alongside a la carte Balinese food such as betutu bebek.'),
    best_for = coalesce(nullif(best_for, ''), 'travelers wanting a hands-on Balinese cooking class amid rice fields, or pre-ordered betutu bebek'),
    not_for = coalesce(nullif(not_for, ''), 'those wanting walk-in a-la-carte dining without any advance notice'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Betutu Bebek (slow-roasted duck, pre-order required); hands-on Balinese cooking class (7 dishes + 2 drinks)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/dicarikwarung/'),
    jobs = case when jobs is null or array_length(jobs,1) is null then array['local_food_calm']::text[] else jobs end
where slug = 'dicarik-warung' and district = 'ubud';

commit;