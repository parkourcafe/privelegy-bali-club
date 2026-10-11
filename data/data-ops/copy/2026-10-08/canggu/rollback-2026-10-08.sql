-- wave-canggu-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-12-urban-cafe-breakfast-and-dinner-movie-night-cocktail-bar-canggu-why_its_here · 12-urban-cafe-breakfast-and-dinner-movie-night-cocktail-bar-canggu · why_its_here · restore before
update venues set why_its_here = 'An all-day cafe and cocktail bar on Jalan Pantai Batu Mejan, open 8am to midnight every day. The main menu runs from pasta and risotto to schnitzel, seafood and a rib eye steak, with separate brunch, bar and wine-cocktail menus. Tables can be booked through the site or Chope.' where slug = '12-urban-cafe-breakfast-and-dinner-movie-night-cocktail-bar-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A cafe and cocktail bar on Jalan Pantai Batu Mejan, open 8am to midnight daily. The main menu goes from pasta and risotto to schnitzel and seafood, with a rib eye steak. Brunch, the bar and wine cocktails have their own menus. Book through the site or Chope.';
-- expect: UPDATE 1

-- 2. W-7am-bakers-umalas-why_its_here · 7am-bakers-umalas · why_its_here · restore before
update venues set why_its_here = 'A bakery and all-day cafe on Jalan Bumbak Dauh in Umalas, one of seven 7AM Bakers outlets across Bali and Jakarta. Its own outlet page describes freshly baked artisan pastries, specialty coffee and international dishes, with delivery through GoFood and GrabFood and online table booking.' where slug = '7am-bakers-umalas' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'On Jalan Bumbak Dauh, 7AM Bakers runs its Umalas outlet as a bakery and all-day cafe. The brand has seven outlets across Bali and Jakarta, and this one''s page describes freshly baked artisan pastries, specialty coffee and international dishes. Tables book online; GoFood and GrabFood deliver.';
-- expect: UPDATE 1

-- 3. W-7am-bakers-umalas-not_for · 7am-bakers-umalas · not_for · restore before
update venues set not_for = 'Daytime only - closes in the evening, no late dinner' where slug = '7am-bakers-umalas' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A late dinner: it keeps daytime hours and closes in the evening';
-- expect: UPDATE 1

-- 4. W-adda-yoga-why_its_here · adda-yoga · why_its_here · restore before
update venues set why_its_here = 'A yoga studio on Jalan Kayu Manis in Canggu, above the Awan co-working space. The schedule covers vinyasa, ashtanga, hatha, yin and restorative classes plus pranayama, meditation, sound healing and kundalini sessions, and the studio runs 200- and 300-hour teacher trainings. Drop-in rates are tiered by tourist visa, KITAS and Indonesian ID.' where slug = 'adda-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A yoga studio above the Awan co-working space on Jalan Kayu Manis in Canggu. Classes run from vinyasa and ashtanga to hatha, yin and restorative, with pranayama and meditation alongside sound healing and kundalini. The studio also runs 200- and 300-hour teacher trainings.';
-- expect: UPDATE 1

-- 5. W-adda-yoga-best_for · adda-yoga · best_for · restore before
update venues set best_for = 'Walk-in yoga in Canggu with KITAS and local pricing; sound and kundalini sessions' where slug = 'adda-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A walk-in class, with drop-in rates tiered by tourist visa, KITAS or Indonesian ID';
-- expect: UPDATE 1

-- 6. W-adda-yoga-not_for · adda-yoga · not_for · restore before
update venues set not_for = 'No online booking or payment - register and pay at the counter' where slug = 'adda-yoga' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Booking or paying online: you register and pay at the counter';
-- expect: UPDATE 1

-- 7. W-amo-spa-canggu-canggu-why_its_here · amo-spa-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'A Batu Bolong wellness spot pairing traditional Balinese spa treatments with AMO Baths -- a self-guided sauna, ice-bath and mineral-soak recovery circuit -- plus clinical facials and a cold-pressed juice cafe, running since 2008.' where slug = 'amo-spa-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Batu Bolong wellness spa, open since 2008, that pairs traditional Balinese treatments with AMO Baths. The baths are a self-guided recovery circuit: sauna, ice bath and mineral soak. There are clinical facials too, and a cold-pressed juice cafe.';
-- expect: UPDATE 1

-- 8. W-amo-spa-canggu-canggu-best_for · amo-spa-canggu-canggu · best_for · restore before
update venues set best_for = 'A slow, personalized massage or facial, or the hot-cold AMO Baths circuit.' where slug = 'amo-spa-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A slow, personalized massage or facial, or the hot-cold AMO Baths circuit';
-- expect: UPDATE 1

-- 9. W-ashe-grill-and-bar-why_its_here · ashe-grill-and-bar · why_its_here · restore before
update venues set why_its_here = 'A wood-fired grill and bar on Jl. Pantai Pererenan, open evenings only. The venue describes a kitchen built around live fire, with cooking drawn from Global South traditions, and takes its name from a Yoruba concept meaning life force. It opened in December 2025.' where slug = 'ashe-grill-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ashe runs a wood-fired grill and bar on Jl. Pantai Pererenan, open evenings only. It opened in December 2025 with a kitchen built, by its own account, around live fire and Global South cooking traditions. The name is a Yoruba concept meaning life force.';
-- expect: UPDATE 1

-- 10. W-ashe-grill-and-bar-best_for · ashe-grill-and-bar · best_for · restore before
update venues set best_for = 'Wood-fired grill cooking at a late dinner on the Pererenan beach road' where slug = 'ashe-grill-and-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Late dinners of wood-fired grill cooking on the Pererenan beach road';
-- expect: UPDATE 1

-- 11. W-ashe-grill-and-bar-not_for · ashe-grill-and-bar · not_for · restore before
update venues set not_for = 'Dinner only; kitchen opens 5pm' where slug = 'ashe-grill-and-bar' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Lunch: it serves dinner only, and the kitchen opens at 5pm';
-- expect: UPDATE 1

-- 12. W-aunty-ji-s-why_its_here · aunty-ji-s · why_its_here · restore before
update venues set why_its_here = 'A Mumbai-inspired Indian kitchen on Batu Bolong, built around family aunty recipes -- curries, biryani, naan and street food like vada pav -- open to midnight with GoFood/GrabFood delivery.' where slug = 'aunty-ji-s' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Aunty Ji''s, a Mumbai-inspired Indian kitchen on Batu Bolong, cooks from family aunty recipes. Expect curries, biryani, naan and street food such as vada pav. It stays open to midnight and delivers through GoFood and GrabFood.';
-- expect: UPDATE 1

-- 13. W-aunty-ji-s-best_for · aunty-ji-s · best_for · restore before
update venues set best_for = 'Indian comfort food — curries, biryani, vada pav — plus weekend brunch.' where slug = 'aunty-ji-s' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A craving for Indian comfort food, from curries and biryani to vada pav, or a weekend brunch';
-- expect: UPDATE 1

-- 14. W-aunty-ji-s-not_for · aunty-ji-s · not_for · restore before
update venues set not_for = 'A quiet meal — casual room built around sharing plates.' where slug = 'aunty-ji-s' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet meal. The room is casual and built around sharing plates';
-- expect: UPDATE 1

-- 15. W-baked-berawa-why_its_here · baked-berawa · why_its_here · restore before
update venues set why_its_here = 'An artisanal bakehouse and specialty-coffee cafe on Jl. Raya Semat in Berawa (Tibubeneng), one of several BAKED. outlets in Bali. The brand''s own site describes the offer as gourmet breads, laminated pastries and specialty coffee across breakfast, brunch and lunch.' where slug = 'baked-berawa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'One of several BAKED. bakehouses in Bali, this one on Jl. Raya Semat in Berawa (Tibubeneng) pairs artisanal baking with specialty coffee. The brand''s site lists gourmet breads and laminated pastries for breakfast, brunch and lunch.';
-- expect: UPDATE 1

-- 16. W-baked-berawa-best_for · baked-berawa · best_for · restore before
update venues set best_for = 'Brunch, coffee and pastries, and morning meet-ups.' where slug = 'baked-berawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A morning meet-up over brunch, coffee and pastries';
-- expect: UPDATE 1

-- 17. W-baked-berawa-not_for · baked-berawa · not_for · restore before
update venues set not_for = 'Closes 7pm — daytime only, not a dinner spot.' where slug = 'baked-berawa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dinner, because it closes at 7pm';
-- expect: UPDATE 1

-- 18. W-baked-pererenan-why_its_here · baked-pererenan · why_its_here · restore before
update venues set why_its_here = 'The Pererenan outpost of BAKED., an artisanal bakehouse and specialty-coffee brand with several Bali locations, on Jl. Pantai Pererenan. The brand''s own site describes the offer as gourmet breads, laminated pastries and specialty coffee across breakfast, brunch and lunch.' where slug = 'baked-pererenan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Pererenan branch of BAKED., an artisanal bakehouse and specialty-coffee brand with several locations around Bali. It is on Jl. Pantai Pererenan, and its website describes gourmet breads and laminated pastries from breakfast through brunch to lunch.';
-- expect: UPDATE 1

-- 19. W-baked-pererenan-best_for · baked-pererenan · best_for · restore before
update venues set best_for = 'Morning brunch and a pastry-and-coffee stop on the Pererenan beach road.' where slug = 'baked-pererenan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Morning brunch, or a pastry-and-coffee stop on the Pererenan beach road';
-- expect: UPDATE 1

-- 20. W-bali-barber-canggu-why_its_here · bali-barber-canggu · why_its_here · restore before
update venues set why_its_here = 'The Canggu outpost of the Bali Barber chain, doing scissor cuts, clipper fades, beard work and classic hot-towel shaves for men in a relaxed setting.' where slug = 'bali-barber-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Canggu branch of the Bali Barber chain, a barber for men. It does scissor cuts, clipper fades, beard work and classic hot-towel shaves.';
-- expect: UPDATE 1

-- 21. W-bali-barber-canggu-best_for · bali-barber-canggu · best_for · restore before
update venues set best_for = 'Men wanting a reliable, walk-in barber in central Canggu.' where slug = 'bali-barber-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Men after a walk-in cut, fade or shave in central Canggu';
-- expect: UPDATE 1

-- 22. W-bali-buda-canggu-why_its_here · bali-buda-canggu · why_its_here · restore before
update venues set why_its_here = 'The Canggu branch of Bali Buda, an organic wholefoods cafe and shop that its own site calls Bali''s original source for eating well and living simply, operating on the island for over 25 years. The menu runs wholefood breakfasts, bowls, salads, mains, bakery items, juices and smoothies, with vegan, gluten-free and paleo options marked.' where slug = 'bali-buda-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Buda has been on the island for over 25 years; its Canggu branch is an organic wholefoods cafe and shop. The menu covers breakfasts, bowls, salads and mains, plus bakery items and a list of juices and smoothies.';
-- expect: UPDATE 1

-- 23. W-bali-buda-canggu-best_for · bali-buda-canggu · best_for · restore before
update venues set best_for = 'Wholefoods brunch or lunch with an organic shop to raid on the way out.' where slug = 'bali-buda-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A wholefoods brunch or lunch with vegan, gluten-free and paleo options marked, then a raid on the organic shop';
-- expect: UPDATE 1

-- 24. W-bali-mma-canggu-why_its_here · bali-mma-canggu · why_its_here · restore before
update venues set why_its_here = 'Bali MMA is a dedicated combat-sports gym on Jalan Raya Padonan in Canggu, with boxing, Muay Thai, BJJ, no-gi grappling and MMA sparring across daily sessions (Mon-Fri 6am-10pm, Sat-Sun 7am-6pm), plus a weight room, ice bath and sauna. Open to all levels, with kids classes too.' where slug = 'bali-mma-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'On Jalan Raya Padonan, Bali MMA runs a combat-sports gym for all levels, kids classes included. Boxing, Muay Thai, BJJ, no-gi grappling and MMA sparring run daily: 6am-10pm on weekdays, 7am-6pm at weekends. There''s a weight room, an ice bath and a sauna.';
-- expect: UPDATE 1

-- 25. W-bali-mma-canggu-best_for · bali-mma-canggu · best_for · restore before
update venues set best_for = 'Boxing, Muay Thai, BJJ and MMA sparring in Padonan — day passes from 240K.' where slug = 'bali-mma-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A fight-training session at any level on a day pass, from 240K';
-- expect: UPDATE 1

-- 26. W-bar-vera-bistro-and-wine-bar-why_its_here · bar-vera-bistro-and-wine-bar · why_its_here · restore before
update venues set why_its_here = 'A 65-seat European bistro and wine bar on Jl. Pantai Pererenan, drawing on the new generation of European wine bars with classic technique and produce-driven food. The wine list is European-focused, with a separate cocktail and aperitif card and a lunch menu that runs to breakfast plates and coffee. Bookings go through the venue''s own site via SevenRooms.' where slug = 'bar-vera-bistro-and-wine-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A 65-seat European bistro and wine bar on Jl. Pantai Pererenan, cooking produce-driven food with classic technique. The wine list is European-focused, cocktails and aperitifs have their own card, and lunch runs to breakfast plates and coffee. Bookings go through SevenRooms on the venue''s site.';
-- expect: UPDATE 1

-- 27. W-bar-vera-bistro-and-wine-bar-best_for · bar-vera-bistro-and-wine-bar · best_for · restore before
update venues set best_for = 'A relaxed date night or late dinner built around European wine and bistro plates.' where slug = 'bar-vera-bistro-and-wine-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'European wine and bistro plates over a date night or late dinner';
-- expect: UPDATE 1

-- 28. W-beach-boy-canggu-why_its_here · beach-boy-canggu · why_its_here · restore before
update venues set why_its_here = 'A restaurant and cocktail bar on Jl. Munduk Catu seating up to 132 across five indoor and outdoor areas, including a rooftop. The kitchen runs steaks, seafood and pasta alongside a long cocktail, mocktail and vegan list. Live acoustic sessions run on Saturdays, and happy hour is 4-7pm daily, buy two get one free on cocktails.' where slug = 'beach-boy-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A restaurant and cocktail bar on Jl. Munduk Catu seating up to 132 across five indoor and outdoor areas, rooftop included. The kitchen does steaks, seafood and pasta, with a vegan list; the cocktail and mocktail list is long. Happy hour (4-7pm daily): buy two cocktails, get one free.';
-- expect: UPDATE 1

-- 29. W-beach-boy-canggu-best_for · beach-boy-canggu · best_for · restore before
update venues set best_for = 'Date-night and group dinners, birthdays and events; Saturday live acoustic sessions.' where slug = 'beach-boy-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A date night, a group dinner or a birthday, with live acoustic sessions on Saturdays';
-- expect: UPDATE 1

-- 30. W-beach-boy-canggu-not_for · beach-boy-canggu · not_for · restore before
update venues set not_for = 'A quiet solo laptop session or a fast grab-and-go lunch.' where slug = 'beach-boy-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet solo laptop session or a fast grab-and-go lunch: the restaurant seats up to 132 across five areas';
-- expect: UPDATE 1

-- 31. W-beachtown-grocer-why_its_here · beachtown-grocer · why_its_here · restore before
update venues set why_its_here = 'Beachtown Grocer is a New York deli-style café and grocery counter inside Secana Beachtown in Berawa, open 6am-11pm with a rotating 99K daily special, indoor and alfresco seating, and grab-and-go breakfast and grocery items.' where slug = 'beachtown-grocer' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Beachtown Grocer is a New York deli-style café and grocery counter inside Secana Beachtown in Berawa, open 6am to 11pm. The daily special rotates and costs 99K. Sit indoors or alfresco, or take breakfast and groceries to go.';
-- expect: UPDATE 1

-- 32. W-beachtown-grocer-best_for · beachtown-grocer · best_for · restore before
update venues set best_for = 'A 99K daily-special menu, deli breakfasts, and a grab-and-go grocery counter in Berawa.' where slug = 'beachtown-grocer' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A deli breakfast or the 99K daily special, with groceries to grab on the way out';
-- expect: UPDATE 1

-- 33. W-billy-ho-japanese-restaurant-why_its_here · billy-ho-japanese-restaurant · why_its_here · restore before
update venues set why_its_here = 'A modern Japanese kitchen and cocktail bar on Batu Bolong -- yakitori, sushi and shareable plates through a long lunch-to-dinner run, with weekend DJs and hand-carved ice for the cocktail list.' where slug = 'billy-ho-japanese-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Billy Ho pairs a modern Japanese kitchen with a cocktail bar on Batu Bolong, open through a long run from lunch to dinner. Yakitori, sushi and shareable plates make up the menu, the cocktails get hand-carved ice, and DJs play at weekends.';
-- expect: UPDATE 1

-- 34. W-billy-ho-japanese-restaurant-best_for · billy-ho-japanese-restaurant · best_for · restore before
update venues set best_for = 'Modern Japanese small plates and cocktails for a long lunch into dinner.' where slug = 'billy-ho-japanese-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Japanese small plates and cocktails over a long lunch that rolls into dinner';
-- expect: UPDATE 1

-- 35. W-body-factory-bali-canggu-why_its_here · body-factory-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'A large gym at Jl. Nelayan No.27 in Canggu, open 6am-10pm daily, with 50+ classes covering HYROX, strength, boxing, mat pilates, mobility and yoga. A recovery area adds hot tub, sauna, ice bath, cold plunge and pool. Membership runs in four-week blocks, with 1, 3, 7 and 14-day passes also sold.' where slug = 'body-factory-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Jl. Nelayan No.27, Body Factory''s large gym opens 6am-10pm daily. More than 50 classes cover HYROX, strength, boxing, mat pilates, mobility and yoga. Recovery runs from hot tub and sauna to ice bath and cold plunge, with a pool too.';
-- expect: UPDATE 1

-- 36. W-body-factory-bali-canggu-best_for · body-factory-bali-canggu · best_for · restore before
update venues set best_for = 'A full gym plus HYROX classes and ice-bath, sauna and pool recovery in one visit.' where slug = 'body-factory-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A gym or HYROX session on a 1, 3, 7 or 14-day pass or a four-week membership';
-- expect: UPDATE 1

-- 37. W-body-factory-bali-canggu-not_for · body-factory-bali-canggu · not_for · restore before
update venues set not_for = 'Recovery (ice bath, sauna) is a separate pass tier from gym access.' where slug = 'body-factory-bali-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A gym-only pass if you want the ice bath and sauna, because recovery is a separate tier';
-- expect: UPDATE 1

-- 38. W-body-factory-bali-recovery-canggu-why_its_here · body-factory-bali-recovery-canggu · why_its_here · restore before
update venues set why_its_here = 'The recovery wing of Body Factory in Nelayan — ice baths, sauna and bodywork aimed at post-training recovery, open 6am–10pm.' where slug = 'body-factory-bali-recovery-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The recovery wing of Body Factory in Nelayan, open 6am to 10pm. Ice baths, sauna and bodywork here are aimed at recovery after training.';
-- expect: UPDATE 1

-- 39. W-body-factory-bali-recovery-canggu-best_for · body-factory-bali-recovery-canggu · best_for · restore before
update venues set best_for = 'Active travellers who want cold plunge and sauna recovery rather than a traditional spa.' where slug = 'body-factory-bali-recovery-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'After training, when you want cold plunge and sauna rather than a traditional spa';
-- expect: UPDATE 1

-- 40. W-bonito-restaurant-why_its_here · bonito-restaurant · why_its_here · restore before
update venues set why_its_here = 'A rooftop seafood-and-Mediterranean kitchen atop the Kleo Hotel in Kerobokan Kelod, from the team behind MAURI Seminyak -- handmade pasta, daily fresh seafood, and a Thursday all-you-can-eat oyster-and-pasta night.' where slug = 'bonito-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bonito is a seafood and Mediterranean kitchen on the roof of the Kleo Hotel in Kerobokan Kelod, run by the team behind MAURI Seminyak. Pasta is handmade and seafood comes in fresh daily. Thursday is an all-you-can-eat oyster-and-pasta night.';
-- expect: UPDATE 1

-- 41. W-bonito-restaurant-best_for · bonito-restaurant · best_for · restore before
update venues set best_for = 'A rooftop dinner over Mediterranean seafood and pasta, shared or tasting-menu style.' where slug = 'bonito-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A rooftop dinner of Mediterranean seafood and pasta, shared or as a tasting menu';
-- expect: UPDATE 1

-- 42. W-bonito-restaurant-not_for · bonito-restaurant · not_for · restore before
update venues set not_for = 'Lunch — current hours are dinner-only, Monday to Saturday.' where slug = 'bonito-restaurant' and status = 'active' and publication_status = 'published' and not_for is not distinct from null;
-- expect: UPDATE 1

-- 43. W-bottega-italiana-why_its_here · bottega-italiana · why_its_here · restore before
update venues set why_its_here = 'Gourmet Italian home-cooking from the Zibiru group (running since 2015), making its own fresh pasta, bread, cheese and desserts. The Berawa location ("Origano") on Jl. Pantai Berawa runs all day.' where slug = 'bottega-italiana' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Gourmet Italian home-cooking from the Zibiru group (running since 2015), making its own fresh pasta, bread, cheese and desserts.';
-- expect: UPDATE 1

-- 44. W-bottega-italiana-best_for · bottega-italiana · best_for · restore before
update venues set best_for = 'Relaxed all-day Italian for families and groups sharing pasta, or a casual dinner.' where slug = 'bottega-italiana' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families and groups sharing pasta';
-- expect: UPDATE 1

-- 45. W-bottega-italiana-not_for · bottega-italiana · not_for · restore before
update venues set not_for = 'Breakfast — the kitchen opens at 11am, last order 11:30pm.' where slug = 'bottega-italiana' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Breakfast — the kitchen opens at 11am.';
-- expect: UPDATE 1

-- 46. W-brother-gym-why_its_here · brother-gym · why_its_here · restore before
update venues set why_its_here = 'A weights and machines gym at Jl. Raya Babakan No.14 in Canggu, open 6.30am-10pm daily, selling day passes as well as weekly, monthly and annual memberships. Personal training is sold by the session or in packs. An in-house counter serves juices, protein shakes, coffee and supplements by the scoop.' where slug = 'brother-gym' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Weights and machines fill Brother Gym at Jl. Raya Babakan No.14, open 6.30am-10pm daily. Day passes are sold, and so are weekly, monthly and annual memberships. Its counter adds protein shakes and scoops of supplements to the juice and coffee.';
-- expect: UPDATE 1

-- 47. W-brother-gym-best_for · brother-gym · best_for · restore before
update venues set best_for = 'A low-cost weights gym with day passes and an in-house juice and coffee bar.' where slug = 'brother-gym' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A low-cost weights session on a day pass, with personal training by the session or in packs';
-- expect: UPDATE 1

-- 48. W-brother-gym-not_for · brother-gym · not_for · restore before
update venues set not_for = 'First visit adds a one-off 30K admin fee; locker key needs a 50K deposit.' where slug = 'brother-gym' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Paying for the day pass and nothing else: a first visit adds a one-off 30K admin fee, and the locker key needs a 50K deposit';
-- expect: UPDATE 1

-- 49. W-brunch-club-pererenan-why_its_here · brunch-club-pererenan · why_its_here · restore before
update venues set why_its_here = 'An all-day, family-friendly cafe on Jl. Pantai Pererenan serving brunch, lunch and cocktails. It is the Pererenan branch of Brunch Club Bali, which also runs a Legian site and a Berawa site the group lists as reopening mid-2026. The signature is a stacked pancake the group calls Porncakes, sold in 14 flavours as a two- or three-stack.' where slug = 'brunch-club-pererenan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Brunch Club Bali''s Pererenan branch on Jl. Pantai Pererenan does brunch, lunch and cocktails all day. The group also has a Legian site. The house dish is Porncakes, a stacked pancake sold as a two- or three-stack in 14 flavours.';
-- expect: UPDATE 1

-- 50. W-brunch-club-pererenan-best_for · brunch-club-pererenan · best_for · restore before
update venues set best_for = 'All-day brunch with friends or family; big sweet and savoury plates plus cocktails' where slug = 'brunch-club-pererenan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Friends or family over an all-day brunch of big sweet and savoury plates, with cocktails';
-- expect: UPDATE 1

-- 51. W-brunch-club-pererenan-not_for · brunch-club-pererenan · not_for · restore before
update venues set not_for = 'Brunch and lunch only; no dinner service listed' where slug = 'brunch-club-pererenan' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dinner: brunch and lunch are the only services listed';
-- expect: UPDATE 1

-- 52. W-cafe-del-mar-bali-why_its_here · cafe-del-mar-bali · why_its_here · restore before
update venues set why_its_here = 'The Bali site of the Café del Mar brand, a beachfront club on Jl. Subak Sari in Tibubeneng with an infinity pool, DJ sets and events. Its kitchen describes itself as premium casual dining drawn from the cuisines of the Mediterranean Basin, alongside signature desserts and cocktails. Open daily 11:00-20:00.' where slug = 'cafe-del-mar-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Café del Mar''s Bali site, a beachfront club on Jl. Subak Sari in Tibubeneng, has an infinity pool, DJ sets and events. The kitchen calls itself premium casual dining from the Mediterranean Basin. Its desserts and cocktails are house creations. Open daily, 11:00 to 20:00.';
-- expect: UPDATE 1

-- 53. W-cafe-del-mar-bali-best_for · cafe-del-mar-bali · best_for · restore before
update venues set best_for = 'Sunset drinks and a pool day with an Ibiza-style atmosphere; groups after the beach' where slug = 'cafe-del-mar-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset drinks or a pool day, Ibiza-style, with a group after the beach';
-- expect: UPDATE 1

-- 54. W-cafe-del-mar-bali-not_for · cafe-del-mar-bali · not_for · restore before
update venues set not_for = 'Closes 8pm daily; not a late-night venue' where slug = 'cafe-del-mar-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A late night out, because it closes at 8pm daily';
-- expect: UPDATE 1

-- 55. W-canggu-club-tennis-centre-why_its_here · canggu-club-tennis-centre · why_its_here · restore before
update venues set why_its_here = 'Tennis centre at FINNS Recreation Club on Jl. Pantai Berawa, formerly the Canggu Club. Three indoor floodlit courts with a Flexipave surface, a pro shop, cafe and bar. Coaches, hitting partners and ball boys are on hand. Day passes and memberships are both open to the public.' where slug = 'canggu-club-tennis-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The tennis centre of FINNS Recreation Club, formerly the Canggu Club, on Jl. Pantai Berawa. It has three indoor floodlit courts on a Flexipave surface, plus a pro shop, cafe and bar. Coaches and hitting partners are on hand, ball boys too.';
-- expect: UPDATE 1

-- 56. W-canggu-club-tennis-centre-best_for · canggu-club-tennis-centre · best_for · restore before
update venues set best_for = 'Tennis out of the sun on a floodlit court' where slug = 'canggu-club-tennis-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Tennis out of the sun on a floodlit court, on a day pass or a membership open to the public';
-- expect: UPDATE 1

-- 57. W-canggu-yoga-centre-canggu-why_its_here · canggu-yoga-centre-canggu · why_its_here · restore before
update venues set why_its_here = 'A yoga studio in Pererenan running Ashtanga, hot yoga and hot-pilates-style HIIT from early morning, with showers, a cafe and gear on-site. The published timetable shifts, so confirm the day''s classes before turning up.' where slug = 'canggu-yoga-centre-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'From early morning, Canggu Yoga Centre teaches Ashtanga, hot yoga and hot-pilates-style HIIT at its Pererenan studio. Showers and a cafe are on site, as is gear. The published timetable shifts, so check the day''s classes before you go.';
-- expect: UPDATE 1

-- 58. W-canggu-yoga-centre-canggu-best_for · canggu-yoga-centre-canggu · best_for · restore before
update venues set best_for = 'An accessible morning practice — Ashtanga, hot yoga or hot pilates — in Pererenan.' where slug = 'canggu-yoga-centre-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An accessible morning practice in Pererenan: Ashtanga, hot yoga or hot pilates';
-- expect: UPDATE 1

-- 59. W-canggu-yoga-centre-canggu-not_for · canggu-yoga-centre-canggu · not_for · restore before
update venues set not_for = 'A fixed weekly timetable — confirm the day’s classes before going.' where slug = 'canggu-yoga-centre-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A fixed weekly routine: the published timetable shifts';
-- expect: UPDATE 1

-- 60. W-chow-chow-bali-why_its_here · chow-chow-bali · why_its_here · restore before
update venues set why_its_here = 'Chow Chow Bali is a contemporary Asian-fusion restaurant in Batu Bolong — sushi rolls, bao buns, slow-cooked pork ribs, and poke bowls, open daily from late morning to midnight with cocktails and a kids menu.' where slug = 'chow-chow-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Chow Chow Bali is a contemporary Asian-fusion restaurant in Batu Bolong, open daily from late morning to midnight. The menu runs to sushi rolls, bao buns, slow-cooked pork ribs and poke bowls. Cocktails and a kids menu round it out.';
-- expect: UPDATE 1

-- 61. W-chow-chow-bali-best_for · chow-chow-bali · best_for · restore before
update venues set best_for = 'Asian-fusion sushi, bao, and poke bowls in Batu Bolong, lunch to late night.' where slug = 'chow-chow-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'From lunch to late night: Asian-fusion sushi, bao and poke bowls in Batu Bolong';
-- expect: UPDATE 1

-- 62. W-como-beach-club-canggu-why_its_here · como-beach-club-canggu · why_its_here · restore before
update venues set why_its_here = 'The beach club and restaurant at COMO Uma Canggu, on the sand at Batu Mejan, running breakfast through to a 10pm dinner close with live music and DJ sets. It works from separate menus for the main kitchen, a seafood BBQ, the COMO Shambhala Kitchen and a Sunday family-style brunch billed at 680K per person.' where slug = 'como-beach-club-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The beach club and restaurant at COMO Uma Canggu, on the sand at Batu Mejan. It runs from breakfast to a 10pm dinner close with live music and DJ sets. Separate menus cover the main kitchen, a seafood BBQ and the COMO Shambhala Kitchen.';
-- expect: UPDATE 1

-- 63. W-como-beach-club-canggu-best_for · como-beach-club-canggu · best_for · restore before
update venues set best_for = 'A polished sunset dinner or special occasion by the ocean; a leisurely Sunday brunch' where slug = 'como-beach-club-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A polished sunset dinner or special occasion by the ocean, or a leisurely family-style Sunday brunch at 680K per person';
-- expect: UPDATE 1

-- 64. W-como-beach-club-canggu-not_for · como-beach-club-canggu · not_for · restore before
update venues set not_for = 'Reservations required for non-staying guests' where slug = 'como-beach-club-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Walking in unbooked, because guests not staying at COMO Uma Canggu need a reservation';
-- expect: UPDATE 1

-- 65. W-como-uma-canggu-wellness-spa-canggu-why_its_here · como-uma-canggu-wellness-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'The COMO Shambhala Retreat at COMO Uma Canggu, the resort''s spa and wellness floor near Echo Beach, open 10am to 7pm. The treatment menu runs massages and body therapies alongside Sundari and Guinot facial lines, nail care, and privately booked yoga, Pilates, meditation and breathwork sessions.' where slug = 'como-uma-canggu-wellness-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Near Echo Beach, COMO Uma Canggu keeps its spa and wellness floor, the COMO Shambhala Retreat, open 10am to 7pm. Massages and body therapies share the menu with Sundari and Guinot facials and nail care. Yoga, Pilates, meditation and breathwork are booked as private sessions.';
-- expect: UPDATE 1

-- 66. W-como-uma-canggu-wellness-spa-canggu-best_for · como-uma-canggu-wellness-spa-canggu · best_for · restore before
update venues set best_for = '75-90 minute resort massages, Guinot and Sundari facials, private yoga and Pilates' where slug = 'como-uma-canggu-wellness-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A 75-90 minute massage or a facial at a resort spa, or a private yoga or Pilates session';
-- expect: UPDATE 1

-- 67. W-como-uma-canggu-wellness-spa-canggu-not_for · como-uma-canggu-wellness-spa-canggu · not_for · restore before
update venues set not_for = 'Appointment-based; open 10am-7pm only' where slug = 'como-uma-canggu-wellness-spa-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A treatment before 10am or after 7pm: it runs by appointment within those hours';
-- expect: UPDATE 1

-- 68. W-copenhagen-cafe-berawa-why_its_here · copenhagen-cafe-berawa · why_its_here · restore before
update venues set why_its_here = 'A Nordic-inspired cafe and bakery built around a build-your-own feast - a board of small dishes ticked off a menu card - alongside smørrebrød, lunch bowls and house-baked pastries. Berawa is one of two cafe sites; the group also runs bakeries at Padonan, Pererenan and Seseh. Feast service runs 6am-6pm, with Berawa lunch from 12pm.' where slug = 'copenhagen-cafe-berawa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Nordic-inspired cafe and bakery in Berawa, built around a build-your-own feast: small dishes ticked off a menu card and served on a board. Smørrebrød, lunch bowls and house-baked pastries fill out the menu. Feasts run 6am-6pm, and lunch starts at 12pm.';
-- expect: UPDATE 1

-- 69. W-copenhagen-cafe-berawa-best_for · copenhagen-cafe-berawa · best_for · restore before
update venues set best_for = 'Daytime brunch and coffee; build-your-own Nordic breakfast boards from 6am' where slug = 'copenhagen-cafe-berawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Build-your-own Nordic breakfast boards from 6am, or daytime brunch and coffee';
-- expect: UPDATE 1

-- 70. W-copenhagen-cafe-berawa-not_for · copenhagen-cafe-berawa · not_for · restore before
update venues set not_for = 'Laptop-free cafe; food service ends 6pm, no dinner' where slug = 'copenhagen-cafe-berawa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Laptop work or dinner: the cafe is laptop-free and food stops at 6pm';
-- expect: UPDATE 1

-- 71. W-crate-cafe-why_its_here · crate-cafe · why_its_here · restore before
update venues set why_its_here = 'A high-energy, industrial-style all-day breakfast institution on Jl. Batu Bolong, known for big smoothie bowls and a rotating menu chalked on the wall behind the counter.' where slug = 'crate-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An industrial-style all-day breakfast place on Jl. Batu Bolong. The smoothie bowls are big, and the menu rotates, chalked on the wall behind the counter.';
-- expect: UPDATE 1

-- 72. W-crate-cafe-best_for · crate-cafe · best_for · restore before
update venues set best_for = 'A loud, affordable all-day brunch on Batu Bolong, busiest straight after a surf.' where slug = 'crate-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An affordable all-day brunch on Batu Bolong, straight after a surf';
-- expect: UPDATE 1

-- 73. W-crate-cafe-not_for · crate-cafe · not_for · restore before
update venues set not_for = 'A quiet sit-down or laptop work — it''s a crowded, high-turnover room.' where slug = 'crate-cafe' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet sit-down or laptop work, because the room is loud, crowded and high-turnover, busiest after a surf';
-- expect: UPDATE 1

-- 74. W-cutiepai-nails-why_its_here · cutiepai-nails · why_its_here · restore before
update venues set why_its_here = 'CutiePai Nails is a cosy home-based nail salon in Pererenan, minutes from central Canggu, specialising in BIAB, gel nails, extensions, manicures, pedicures and custom hand-painted nail art, with sanitised tools between clients. Open daily 9am-7pm, appointment-based, with a mobile/home-visit option too.' where slug = 'cutiepai-nails' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'CutiePai Nails is a home-based nail salon in Pererenan, minutes from central Canggu, open daily 9am-7pm by appointment. It specialises in BIAB, gel nails, extensions, manicures, pedicures and custom hand-painted nail art, and sanitises tools between clients. Home visits are an option too.';
-- expect: UPDATE 1

-- 75. W-cutiepai-nails-best_for · cutiepai-nails · best_for · restore before
update venues set best_for = 'Travellers wanting a relaxed, appointment-based nail session (BIAB/gel/nail art) in a small private Pererenan setting, open seven days.' where slug = 'cutiepai-nails' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A booked BIAB, gel or nail-art session in a small, private Pererenan setting';
-- expect: UPDATE 1

-- 76. W-dandelion-why_its_here · dandelion · why_its_here · restore before
update venues set why_its_here = 'A long-running (est. 2014) Indonesian restaurant on Batu Bolong serving Balinese family-recipe dishes in a romantic, plant-filled setting split between open-air tables and cosy indoor nooks -- known for its free-roaming resident rabbits. Previously traded as Dandelion; same venue, team and menu, now under the Casa Tua name.' where slug = 'dandelion' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Casa Tua, an Indonesian restaurant on Batu Bolong, has cooked Balinese family recipes since 2014. The plant-filled room splits between open-air tables and cosy indoor nooks, and resident rabbits roam free. It used to trade as Dandelion; the team and menu have not changed.';
-- expect: UPDATE 1

-- 77. W-dandelion-best_for · dandelion · best_for · restore before
update venues set best_for = 'Balinese home cooking in a plant-filled room on Batu Bolong, with resident rabbits.' where slug = 'dandelion' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Balinese home cooking over a romantic meal among plants, with resident rabbits';
-- expect: UPDATE 1

-- 78. W-dandelion-not_for · dandelion · not_for · restore before
update venues set not_for = 'Free-running rabbits share the dining area.' where slug = 'dandelion' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone who''d rather not share the floor with animals: free-running rabbits roam the dining area';
-- expect: UPDATE 1

-- 79. W-desa-seni-yoga-why_its_here · desa-seni-yoga · why_its_here · restore before
update venues set why_its_here = 'The yoga programme at Desa Seni, a village-style resort near Berawa, running daily classes in an open-air wooden shala that has long been one of Canggu''s most atmospheric places to practise.' where slug = 'desa-seni-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Daily classes in an open-air wooden shala make up the yoga programme of Desa Seni, a village-style resort near Berawa.';
-- expect: UPDATE 1

-- 80. W-desa-seni-yoga-best_for · desa-seni-yoga · best_for · restore before
update venues set best_for = 'Travellers who want a serene, well-taught drop-in class in a garden setting, ideally paired with the resort''s organic café.' where slug = 'desa-seni-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A drop-in class in a garden setting, then a meal at the resort''s organic café';
-- expect: UPDATE 1

-- 81. W-deus-ex-machina-why_its_here · deus-ex-machina · why_its_here · restore before
update venues set why_its_here = 'The flagship Deus "Temple of Enthusiasm" on Jl. Pantai Batu Mejan, combining a Pan-Asian cafe and bar with a motorcycle workshop, retail store, gallery and live-music venue, open from morning coffee until late.' where slug = 'deus-ex-machina' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'On Jl. Pantai Batu Mejan, Deus''s flagship "Temple of Enthusiasm" pairs a Pan-Asian cafe and bar with a motorcycle workshop. A retail store, a gallery and a live-music venue share the site, open from morning coffee until late.';
-- expect: UPDATE 1

-- 82. W-deus-ex-machina-best_for · deus-ex-machina · best_for · restore before
update venues set best_for = 'Coffee and brunch by day, live music and a crowd by night, on Batu Mejan.' where slug = 'deus-ex-machina' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Coffee and brunch by day, or a night of live music with a crowd';
-- expect: UPDATE 1

-- 83. W-downtown-kedungu-restaurant-and-bar-why_its_here · downtown-kedungu-restaurant-and-bar · why_its_here · restore before
update venues set why_its_here = 'Downtown Kedungu is a Latin American restaurant and bar at Kedungu beach in Tabanan, about twenty minutes up the coast from Canggu, running a different themed special every day of the week.' where slug = 'downtown-kedungu-restaurant-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Downtown Kedungu, a Latin American restaurant and bar at Kedungu beach in Tabanan, sits about twenty minutes up the coast from Canggu. Every day of the week brings a different themed special.';
-- expect: UPDATE 1

-- 84. W-downtown-kedungu-restaurant-and-bar-best_for · downtown-kedungu-restaurant-and-bar · best_for · restore before
update venues set best_for = 'Latin American plates and a daily themed special, 20 minutes up the coast from Canggu.' where slug = 'downtown-kedungu-restaurant-and-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A trip up the coast for Latin American plates and the day''s themed special';
-- expect: UPDATE 1

-- 85. W-downtown-kedungu-restaurant-and-bar-not_for · downtown-kedungu-restaurant-and-bar · not_for · restore before
update venues set not_for = 'A spontaneous Sunday — the roast sells out and the site asks you to book ahead.' where slug = 'downtown-kedungu-restaurant-and-bar' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A spontaneous Sunday. The roast sells out, and the site asks you to book ahead';
-- expect: UPDATE 1

-- 86. W-e-a-r-t-h-by-ulaman-why_its_here · e-a-r-t-h-by-ulaman · why_its_here · restore before
update venues set why_its_here = 'E.A.R.T.H is the restaurant and lounge of the Ulaman Eco Luxury Resort in Buwit, Tabanan, built in bamboo among jungle, river and waterfalls. Chef Alvin''s kitchen works Balinese and Nusantara cooking alongside Italian, Thai and international dishes, with set experiences from a chef''s selection to a waterfall-deck dinner.' where slug = 'e-a-r-t-h-by-ulaman' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'E.A.R.T.H is the bamboo-built restaurant and lounge of the Ulaman Eco Luxury Resort in Buwit, Tabanan. Chef Alvin cooks Balinese and Nusantara food, and Italian, Thai and international dishes too. Set options range from a chef''s selection to a waterfall-deck dinner.';
-- expect: UPDATE 1

-- 87. W-e-a-r-t-h-by-ulaman-best_for · e-a-r-t-h-by-ulaman · best_for · restore before
update venues set best_for = 'Balinese and Nusantara plates inside the Ulaman eco resort, in a jungle setting.' where slug = 'e-a-r-t-h-by-ulaman' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Balinese or Nusantara meals at the Ulaman eco resort, among jungle, river and waterfalls';
-- expect: UPDATE 1

-- 88. W-ecosfera-yoga-canggu-canggu-best_for · ecosfera-yoga-canggu-canggu · best_for · restore before
update venues set best_for = 'Practitioners who want a laid-back class near Batu Mejan / Echo Beach.' where slug = 'ecosfera-yoga-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A yoga class by the water, near Batu Mejan and Echo Beach';
-- expect: UPDATE 1

-- 89. W-ele-restaurant-bar-and-terrace-why_its_here · ele-restaurant-bar-and-terrace · why_its_here · restore before
update venues set why_its_here = 'ELE is an all-day restaurant, bar and terrace on Jl. Pantai Batu Bolong in Canggu, serving breakfast through late dinner. The venue publishes no website — only a link page — so our record of it is thinner than most: the format and the address are confirmed, the menu is not.' where slug = 'ele-restaurant-bar-and-terrace' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'ELE keeps an all-day restaurant, bar and terrace on Jl. Pantai Batu Bolong in Canggu, serving breakfast through late dinner. It has no website, only a link page, so we have confirmed the format and the address but not the menu.';
-- expect: UPDATE 1

-- 90. W-ele-restaurant-bar-and-terrace-best_for · ele-restaurant-bar-and-terrace · best_for · restore before
update venues set best_for = 'An all-day room on Batu Bolong — breakfast through late dinner.' where slug = 'ele-restaurant-bar-and-terrace' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Any meal from breakfast to a late dinner on Batu Bolong';
-- expect: UPDATE 1

-- 91. W-espace-spa-canggu-canggu-why_its_here · espace-spa-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'A day spa on Jl. Pura Batu Mejan near Batu Bolong, with a published price list covering aromatherapy massage, body scrubs and wraps, facials, cream bath, manicure and pedicure, and sugaring hair removal. It also runs private massage classes and sells massage tables and chairs.' where slug = 'espace-spa-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Espace Spa, a day spa on Jl. Pura Batu Mejan near Batu Bolong, publishes its price list. It covers aromatherapy massage, body scrubs, wraps, facials, cream bath, manicures, pedicures and sugaring hair removal. It also runs private massage classes and sells massage tables and chairs.';
-- expect: UPDATE 1

-- 92. W-espace-spa-canggu-canggu-best_for · espace-spa-canggu-canggu · best_for · restore before
update venues set best_for = 'Fixed-price massage, scrub, facial and nails menu bookable online in Batu Bolong.' where slug = 'espace-spa-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A fixed-price massage, scrub, facial or nail treatment booked online in Batu Bolong';
-- expect: UPDATE 1

-- 93. W-estetica-belle-why_its_here · estetica-belle · why_its_here · restore before
update venues set why_its_here = 'A beauty studio at Jl. Pantai Pererenan No.69 covering lashes and brows, nails, waxing, permanent make-up, skin needling, laser tattoo removal and clinical facials using Dermalogica, Doctor Babor and Mesoestetic products. Its skin-treatment price list is published on its own site.' where slug = 'estetica-belle' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Estetica Belle works from a beauty studio at Jl. Pantai Pererenan No.69. It does lashes, brows, nails, waxing, permanent make-up, skin needling and laser tattoo removal. Clinical facials use Dermalogica and Doctor Babor products, plus Mesoestetic. The skin-treatment price list is on its own site.';
-- expect: UPDATE 1

-- 94. W-estetica-belle-best_for · estetica-belle · best_for · restore before
update venues set best_for = 'Lashes, brows, nails, waxing and clinical facials in one Pererenan studio.' where slug = 'estetica-belle' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Lashes, brows, nails, waxing and clinical facials in one Pererenan studio';
-- expect: UPDATE 1

-- 95. W-estetica-belle-not_for · estetica-belle · not_for · restore before
update venues set not_for = 'Closes 6pm daily; treatments are booked by appointment.' where slug = 'estetica-belle' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An evening or walk-in treatment: it closes at 6pm daily and works by appointment';
-- expect: UPDATE 1

-- 96. W-f45-training-canggu-canggu-why_its_here · f45-training-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'The Canggu studio of the global F45 franchise, at Jl. Pantai Batu Bolong No.83, running 45-minute classes that combine HIIT, circuit and functional training. Its ClassPass schedule rotates cardio on Mondays and Wednesdays, resistance on Tuesdays, Thursdays and Sundays, and hybrid sessions on Fridays and Saturdays.' where slug = 'f45-training-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Canggu studio of the global F45 franchise, at Jl. Pantai Batu Bolong No.83, running 45-minute classes. Its ClassPass schedule puts cardio on Mondays and Wednesdays and resistance on Tuesdays, Thursdays and Sundays. Fridays and Saturdays are hybrid sessions.';
-- expect: UPDATE 1

-- 97. W-f45-training-canggu-canggu-best_for · f45-training-canggu-canggu · best_for · restore before
update venues set best_for = 'Coached 45-minute HIIT and circuit classes on a fixed daily timetable.' where slug = 'f45-training-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A coached 45-minute class mixing HIIT, circuit and functional training';
-- expect: UPDATE 1

-- 98. W-f45-training-canggu-canggu-not_for · f45-training-canggu-canggu · not_for · restore before
update venues set not_for = 'Fixed class timetable; sessions must be booked in advance.' where slug = 'f45-training-canggu-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A spur-of-the-moment visit, because sessions run to a fixed timetable and must be booked in advance';
-- expect: UPDATE 1

-- 99. W-face-therapy-spa-pererenan-why_its_here · face-therapy-spa-pererenan · why_its_here · restore before
update venues set why_its_here = 'A face-massage spa on Jl. Tukad Pingai in Pererenan, open 8am to 10pm daily, with a menu of gua sha, buccal sculpting, lymphatic and jetlag-recovery face treatments. Its Fresha listing marks it woman-owned, kid-friendly and pet-friendly, and names a second branch in Umalas.' where slug = 'face-therapy-spa-pererenan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Face Therapy, a face-massage spa on Jl. Tukad Pingai in Pererenan, opens 8am to 10pm daily. Treatments cover gua sha, buccal sculpting, lymphatic work and jetlag recovery. Its Fresha listing says woman-owned and kid- and pet-friendly, and names a second branch in Umalas.';
-- expect: UPDATE 1

-- 100. W-face-therapy-spa-pererenan-best_for · face-therapy-spa-pererenan · best_for · restore before
update venues set best_for = 'Face massage specialists: gua sha, buccal sculpting and lymphatic work.' where slug = 'face-therapy-spa-pererenan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Gua sha and buccal sculpting, or a jetlag-recovery face treatment after a long flight';
-- expect: UPDATE 1

-- 101. W-face-therapy-spa-pererenan-not_for · face-therapy-spa-pererenan · not_for · restore before
update venues set not_for = 'Appointment-based; treatments run 60-120 minutes.' where slug = 'face-therapy-spa-pererenan' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick drop-in, since treatments are booked ahead and run 60-120 minutes';
-- expect: UPDATE 1

-- 102. W-finns-beach-club-why_its_here · finns-beach-club · why_its_here · restore before
update venues set why_its_here = 'One of Canggu''s biggest and best-known day clubs, on a 170m stretch of Berawa beachfront with three pools (including swim-up bars), many bars and kitchens, and a daily lineup of DJs and live vocalists. The high-energy, pool-party end of the Canggu beach-club spectrum.' where slug = 'finns-beach-club' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'On a 170m stretch of Berawa beachfront, FINNS Beach Club is a day club with three pools, including swim-up bars. There are many bars and kitchens, and a daily lineup of DJs and live vocalists. It is the high-energy, pool-party end of Canggu''s beach clubs.';
-- expect: UPDATE 1

-- 103. W-finns-beach-club-best_for · finns-beach-club · best_for · restore before
update venues set best_for = 'A lively pool day and sunset party with a group; big-group high-energy days out' where slug = 'finns-beach-club' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A lively, high-energy pool day and sunset party with a big group';
-- expect: UPDATE 1

-- 104. W-finns-recreation-club-finns-lifestyle-village-why_its_here · finns-recreation-club-finns-lifestyle-village · why_its_here · restore before
update venues set why_its_here = 'FINNS Recreation Club is the large membership sport, leisure and wellness club at FINNS Lifestyle Village in Berawa, combining a full gym, Olympic-sized pool, tennis and padel courts, a kids'' club, recovery facilities (ice baths, infrared sauna, compression therapy) and a full-service Balinese spa under one roof.' where slug = 'finns-recreation-club-finns-lifestyle-village' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'FINNS Recreation Club is the large membership club at FINNS Lifestyle Village in Berawa. It has a full gym, an Olympic-sized pool, tennis and padel courts and a kids'' club. Recovery means ice baths and an infrared sauna plus compression therapy; the spa is full-service Balinese.';
-- expect: UPDATE 1

-- 105. W-finns-recreation-club-finns-lifestyle-village-best_for · finns-recreation-club-finns-lifestyle-village · best_for · restore before
update venues set best_for = 'Families and active travellers on a longer Canggu/Berawa stay who want gym, pool, courts, kids'' club and spa/recovery in one place; day-pass or membership visitors.' where slug = 'finns-recreation-club-finns-lifestyle-village' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families and active travellers on a longer Canggu or Berawa stay, on a day pass or a membership';
-- expect: UPDATE 1

-- 106. W-finns-recreation-club-finns-lifestyle-village-not_for · finns-recreation-club-finns-lifestyle-village · not_for · restore before
update venues set not_for = 'Travellers wanting a quiet, intimate boutique-spa atmosphere rather than a big multi-facility club.' where slug = 'finns-recreation-club-finns-lifestyle-village' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, intimate boutique spa. The club is big and has many facilities';
-- expect: UPDATE 1

-- 107. W-fitness-plus-canggu-why_its_here · fitness-plus-canggu · why_its_here · restore before
update venues set why_its_here = 'A 24-hour gym at Jl. Tanah Barak No.19 in Canggu, part of the Indonesian Fitness Plus chain. Its branch site lists 100+ machines, a sauna, lockers, showers, towels and parking, and eight group programmes including Les Mills BodyPump, RPM, BodyCombat and Ceremony, Positive Spin, Mat Pilates, yoga and Zumba.' where slug = 'fitness-plus-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Fitness Plus Canggu, part of the Indonesian Fitness Plus chain, runs a 24-hour gym at Jl. Tanah Barak No.19. Its branch site lists more than 100 machines. The eight group programmes are Les Mills BodyPump, RPM, BodyCombat and Ceremony; Positive Spin; Mat Pilates; yoga; and Zumba.';
-- expect: UPDATE 1

-- 108. W-fitness-plus-canggu-best_for · fitness-plus-canggu · best_for · restore before
update venues set best_for = '24-hour gym floor with Les Mills classes, on Jl. Tanah Barak in Canggu.' where slug = 'fitness-plus-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A workout at any hour, with a sauna, lockers, showers, towels and parking on site';
-- expect: UPDATE 1

-- 109. W-flex-gym-bali-why_its_here · flex-gym-bali · why_its_here · restore before
update venues set why_its_here = 'A single-location gym on Gang Heliconia off Jl. Raya Canggu. The floor is split between strength equipment - squat racks and machines - and a cardio area with treadmills, rowers and air bikes, alongside lockers, changing rooms and parking. Passes run from a single day to twelve months.' where slug = 'flex-gym-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Flex Gym has a single location: a gym on Gang Heliconia, off Jl. Raya Canggu. Strength equipment, from squat racks to machines, shares the floor with treadmills, rowers and air bikes. Passes run from a single day to twelve months. It has lockers and changing rooms, and parking.';
-- expect: UPDATE 1

-- 110. W-flex-gym-bali-best_for · flex-gym-bali · best_for · restore before
update venues set best_for = 'Drop-in strength training on a 150K day pass; squat racks, 06:30 weekday opens.' where slug = 'flex-gym-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Drop-in strength sessions on a 150K day pass, from 06:30 on weekdays';
-- expect: UPDATE 1

-- 111. W-flex-gym-bali-not_for · flex-gym-bali · not_for · restore before
update venues set not_for = 'Weekend hours are shorter: closes 18:00 Saturday and Sunday.' where slug = 'flex-gym-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An evening workout at the weekend, because it closes at 18:00 on Saturday and Sunday';
-- expect: UPDATE 1

-- 112. W-genius-bistro-why_its_here · genius-bistro · why_its_here · restore before
update venues set why_its_here = 'A French, Mediterranean and steakhouse bistro on Jl. Sempol, set among rice fields north of central Canggu, with indoor and al fresco seating for about 50. The kitchen leans French: duck served at the table, braised lamb shank, duck a l''orange. Reservations run through Chope.' where slug = 'genius-bistro' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Among rice fields north of central Canggu, Genius Bistro cooks French, Mediterranean and steakhouse food on Jl. Sempol. About 50 seats split between indoors and al fresco. The kitchen leans French: duck served at the table, braised lamb shank, duck a l''orange. Book through Chope.';
-- expect: UPDATE 1

-- 113. W-genius-bistro-best_for · genius-bistro · best_for · restore before
update venues set best_for = 'Sit-down French cooking and steak in the rice fields north of central Canggu.' where slug = 'genius-bistro' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sit-down meal of French cooking or steak among rice fields north of central Canggu';
-- expect: UPDATE 1

-- 114. W-glo-day-spa-salon-canggu-canggu-why_its_here · glo-day-spa-salon-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'One of five Bali branches of Glo Salon & Beauty, formerly Glo Day Spa & Salon, at Jl. Subak Sari 90 opposite Popular supermarket. The Canggu salon covers hair, facials, nails, waxing and threading, lash and brow, spray tanning and makeup, and opens 10am to 8pm.' where slug = 'glo-day-spa-salon-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'One of five Bali branches of Glo Salon & Beauty, which used to trade as Glo Day Spa & Salon. It sits at Jl. Subak Sari 90, opposite Popular supermarket. It covers hair, facials, nails, waxing, threading, lash and brow, spray tanning and makeup.';
-- expect: UPDATE 1

-- 115. W-glo-day-spa-salon-canggu-canggu-best_for · glo-day-spa-salon-canggu-canggu · best_for · restore before
update venues set best_for = 'Hair, nails, waxing and facials in one Canggu salon, open 10am to 8pm.' where slug = 'glo-day-spa-salon-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Hair, nails, waxing and facials in one Canggu salon, open 10am to 8pm';
-- expect: UPDATE 1

-- 116. W-glo-day-spa-salon-canggu-canggu-not_for · glo-day-spa-salon-canggu-canggu · not_for · restore before
update venues set not_for = 'Opens 10am, closes 8pm - no early-morning or late-evening slots.' where slug = 'glo-day-spa-salon-canggu-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An early-morning or late-evening slot: it opens at 10am and closes at 8pm';
-- expect: UPDATE 1

-- 117. W-goldust-beauty-facials-canggu-why_its_here · goldust-beauty-facials-canggu · why_its_here · restore before
update venues set why_its_here = 'The facial-and-beauty side of Goldust, a polished Canggu day spa known for results-focused treatments like its Express Lifting Facial.' where slug = 'goldust-beauty-facials-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The facial and beauty side of Goldust, a Canggu day spa. Its treatments are results-focused, the Express Lifting Facial among them.';
-- expect: UPDATE 1

-- 118. W-goldust-beauty-facials-canggu-best_for · goldust-beauty-facials-canggu · best_for · restore before
update venues set best_for = 'Anyone after a serious facial or skin treatment rather than a quick massage.' where slug = 'goldust-beauty-facials-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A results-focused facial or skin treatment rather than a quick massage';
-- expect: UPDATE 1

-- 119. W-goldust-spa-canggu-why_its_here · goldust-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'A day spa on Gg. Nyepi off Jl. Pantai Batu Bolong, laid out as one venue with massage suites, a poolside lounge, a nail lounge and a couple''s room. The list runs from 30-minute poolside massages to 24k Gold facials and two-and-a-half-hour couple''s packages, with sports, lymphatic drainage and Madero body sculpting among the named bodywork.' where slug = 'goldust-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Goldust Spa is a day spa on Gg. Nyepi, off Jl. Pantai Batu Bolong. Under one roof are massage suites, a poolside lounge, a nail lounge and a couple''s room. The list runs from 30-minute poolside massages to 24k Gold facials and two-and-a-half-hour couple''s packages.';
-- expect: UPDATE 1

-- 120. W-goldust-spa-canggu-best_for · goldust-spa-canggu · best_for · restore before
update venues set best_for = 'Those wanting therapeutic, sports-oriented bodywork rather than a basic massage.' where slug = 'goldust-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Therapeutic bodywork, from sports and lymphatic drainage to Madero body sculpting, rather than a basic massage';
-- expect: UPDATE 1

-- 121. W-gravity-stretching-canggu-why_its_here · gravity-stretching-canggu · why_its_here · restore before
update venues set why_its_here = 'A stretching studio built on suspended ropes: the exercises are done in relaxation rather than tension, so gravity takes the load off the muscles. The Bali operation runs studios in Canggu and Ubud, offering group classes, private Gravity Therapy sessions and a children''s class.' where slug = 'gravity-stretching-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A stretching studio built on suspended ropes: the exercises are done in relaxation rather than tension, so gravity takes the load off the muscles. The Bali operation has studios in Canggu and Ubud, with group classes, private Gravity Therapy sessions and a children''s class.';
-- expect: UPDATE 1

-- 122. W-gravity-stretching-canggu-not_for · gravity-stretching-canggu · not_for · restore before
update venues set not_for = 'Appointment-based: classes booked through the studio app or WhatsApp' where slug = 'gravity-stretching-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An unbooked visit: classes go through the studio app or WhatsApp';
-- expect: UPDATE 1

-- 123. W-green-spot-cafe-why_its_here · green-spot-cafe · why_its_here · restore before
update venues set why_its_here = 'The cafe attached to Ecosfera Hotel on Jl. Batu Mejan at Echo Beach, serving an all-day international menu of breakfasts, burgers, bowls and grills. Its own menu page lists breakfast from 35K and lunch mains up to 115K, and runs fixed weekly deals including a Wednesday burger-and-drink and Sunday two-for-one smoothies.' where slug = 'green-spot-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Green Spot, the cafe of Ecosfera Hotel at Echo Beach, serves an all-day international menu of breakfasts, burgers, bowls and grills. Its menu page lists breakfast from 35K and lunch mains up to 115K, plus weekly deals like a Wednesday burger-and-drink and Sunday two-for-one smoothies.';
-- expect: UPDATE 1

-- 124. W-green-spot-cafe-best_for · green-spot-cafe · best_for · restore before
update venues set best_for = 'Big low-priced breakfasts and burgers at Echo Beach; all-day kitchen to 11pm' where slug = 'green-spot-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A big, low-priced breakfast or burger at Echo Beach, with the kitchen open until 11pm';
-- expect: UPDATE 1

-- 125. W-guan-yin-yoga-canggu-why_its_here · guan-yin-yoga-canggu · why_its_here · restore before
update venues set why_its_here = 'A yoga shala on the upper floor of Hotel Tugu Bali, on Jl. Pantai Batu Bolong at Canggu Beach. The published timetable runs Vinyasa, Yin, Hatha Flow, Ashtanga, Kundalini, Qigong, gentle Pilates and guided meditation, and classes are open to non-guests on a walk-in basis.' where slug = 'guan-yin-yoga-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Guan Yin has its yoga shala on the upper floor of Hotel Tugu Bali, on Jl. Pantai Batu Bolong at Canggu Beach. The published timetable runs Vinyasa, Yin, Hatha Flow, Ashtanga, Kundalini, Qigong, gentle Pilates and guided meditation. Non-guests can walk in.';
-- expect: UPDATE 1

-- 126. W-guan-yin-yoga-canggu-best_for · guan-yin-yoga-canggu · best_for · restore before
update venues set best_for = 'Small drop-in yoga upstairs at Hotel Tugu, Batu Bolong; walk-ins welcome' where slug = 'guan-yin-yoga-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A small drop-in class upstairs at Hotel Tugu, walk-ins welcome';
-- expect: UPDATE 1

-- 127. W-guan-yin-yoga-canggu-not_for · guan-yin-yoga-canggu · not_for · restore before
update venues set not_for = 'Timetabled classes only; check the weekly schedule before turning up' where slug = 'guan-yin-yoga-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dropping in at any hour, because classes run only on the weekly timetable';
-- expect: UPDATE 1

-- 128. W-home-by-chef-wayan-why_its_here · home-by-chef-wayan · why_its_here · restore before
update venues set why_its_here = 'Modern Balinese cooking from Chef Wayan Kresna Yasa, on Jl. Pantai Pererenan near the beach, reworking family and island recipes with contemporary technique. The menu marks vegan dishes across every course, alongside sate, seafood and traditional mains.' where slug = 'home-by-chef-wayan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Near the beach on Jl. Pantai Pererenan, Chef Wayan Kresna Yasa runs HOME, a modern Balinese restaurant. The kitchen reworks family and island recipes with contemporary technique. Vegan dishes are marked on every course, next to sate, seafood and traditional mains.';
-- expect: UPDATE 1

-- 129. W-home-by-chef-wayan-best_for · home-by-chef-wayan · best_for · restore before
update venues set best_for = 'A considered Balinese dinner; a table mixing meat, seafood and vegan diners' where slug = 'home-by-chef-wayan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Tables that mix meat, seafood and vegan eaters over a considered Balinese dinner';
-- expect: UPDATE 1

-- 130. W-home-by-chef-wayan-not_for · home-by-chef-wayan · not_for · restore before
update venues set not_for = 'The restaurant asks you to book a table in advance' where slug = 'home-by-chef-wayan' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A walk-in table. The restaurant asks you to book ahead';
-- expect: UPDATE 1

-- 131. W-indigo-why_its_here · indigo · why_its_here · restore before
update venues set why_its_here = 'Indigo has been serving Japanese food in Berawa since 2017, under Kyoto-trained chef Morita Shigehiko — a sushi and sashimi selection alongside yakimono cooked over charcoal. The room is small and deliberately plain: shoji-style doors, timeworn teak, indigo denim cushions.' where slug = 'indigo' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Indigo has served Japanese food in Berawa since 2017 under Kyoto-trained chef Morita Shigehiko. There is a sushi and sashimi selection, and yakimono cooked over charcoal. The room is small and deliberately plain, with shoji-style doors, timeworn teak and indigo denim cushions.';
-- expect: UPDATE 1

-- 132. W-indigo-best_for · indigo · best_for · restore before
update venues set best_for = 'Japanese sushi and charcoal-grilled yakimono in a small, quiet Berawa room.' where slug = 'indigo' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A quiet meal of sushi and charcoal-grilled yakimono in a small Berawa room';
-- expect: UPDATE 1

-- 133. W-isla-by-earth-island-why_its_here · isla-by-earth-island · why_its_here · restore before
update venues set why_its_here = 'The all-day cafe attached to Earth Island''s surf shop at Jl. Subak Canggu No.77, on the Canggu shortcut. Its own menu runs from breakfast and coffee through seafood snacks, grilled mains and cocktails. The site also describes it as a space for events, music, art and film.' where slug = 'isla-by-earth-island' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'ISLA, the all-day cafe at Earth Island''s surf shop, sits at Jl. Subak Canggu No.77 on the Canggu shortcut. The menu goes from breakfast and coffee through seafood snacks and grilled mains to cocktails. The site calls it a space for events, music, art and film.';
-- expect: UPDATE 1

-- 134. W-isla-by-earth-island-best_for · isla-by-earth-island · best_for · restore before
update venues set best_for = 'Post-surf breakfast and seafood snacks at the Earth Island surf shop.' where slug = 'isla-by-earth-island' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Breakfast or seafood snacks after a surf, at the Earth Island surf shop';
-- expect: UPDATE 1

-- 135. W-isla-by-earth-island-not_for · isla-by-earth-island · not_for · restore before
update venues set not_for = 'Closes 7pm Sun-Thu; only Fri and Sat run to 9pm.' where slug = 'isla-by-earth-island' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dinner from Sunday to Thursday, because it closes at 7pm; only Friday and Saturday run to 9pm';
-- expect: UPDATE 1

-- 136. W-jet-black-ginger-canggu-canggu-best_for · jet-black-ginger-canggu-canggu · best_for · restore before
update venues set best_for = 'Travellers who want a proper cut or colour by stylists used to international hair.' where slug = 'jet-black-ginger-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cut or colour by stylists used to international hair';
-- expect: UPDATE 1

-- 137. W-ju-bali-why_its_here · ju-bali · why_its_here · restore before
update venues set why_its_here = 'Casual restaurant in Umalas with a jacuzzi club. International comfort food with a Balinese turn: pasta, burgers and wood-fired pizza. Vegetarian and vegan plates include tandoori cauliflower and mushroom tagliatelle. 200 seats, a kids menu and parking for cars and scooters.' where slug = 'ju-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ju Bali is a casual Umalas restaurant with a jacuzzi club. International comfort food with a Balinese turn: pasta, burgers and wood-fired pizza. Vegetarian and vegan plates include tandoori cauliflower and mushroom tagliatelle. Its 200 seats come with a kids menu and parking for cars and scooters.';
-- expect: UPDATE 1

-- 138. W-ju-bali-not_for · ju-bali · not_for · restore before
update venues set not_for = 'A quiet dinner for two - it seats 200 as a family venue' where slug = 'ju-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet dinner for two, because it is a 200-seat family venue';
-- expect: UPDATE 1

-- 139. W-jungle-padel-canggu-canggu-why_its_here · jungle-padel-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'Canggu padel courts open early until late, offering court hire and social games of the fast-growing racket sport.' where slug = 'jungle-padel-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Jungle Padel runs padel courts in Canggu, open early until late for court hire and social games.';
-- expect: UPDATE 1

-- 140. W-jungle-padel-canggu-canggu-best_for · jungle-padel-canggu-canggu · best_for · restore before
update venues set best_for = 'Groups and couples who want a fun, active session on court rather than a gym.' where slug = 'jungle-padel-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Groups and couples after a fun, active session on court instead of a gym';
-- expect: UPDATE 1

-- 141. W-jungle-padel-canggu-shortcut-why_its_here · jungle-padel-canggu-shortcut · why_its_here · restore before
update venues set why_its_here = 'A dedicated padel racket-sport club on the Canggu shortcut with panoramic glass-walled courts set in tropical greenery. Courts are booked by the hour through the Jungle Padel app, with racket hire, coaching, a pro shop, changing rooms and an on-site café.' where slug = 'jungle-padel-canggu-shortcut' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A padel club on the Canggu shortcut, with panoramic glass-walled courts among tropical greenery. Courts are booked by the hour on the Jungle Padel app. Racket hire, coaching, a pro shop, changing rooms and an on-site café are all there.';
-- expect: UPDATE 1

-- 142. W-jungle-padel-canggu-shortcut-best_for · jungle-padel-canggu-shortcut · best_for · restore before
update venues set best_for = 'active travellers who want a padel game between beach sessions; groups of four booking a court together; players needing rental rackets or a lesson' where slug = 'jungle-padel-canggu-shortcut' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A game between beach sessions: book a court for four, or come for a lesson, with racket hire on site';
-- expect: UPDATE 1

-- 143. W-jungle-padel-canggu-shortcut-not_for · jungle-padel-canggu-shortcut · not_for · restore before
update venues set not_for = 'total downtime or a spa-style wellness stop; anyone without a pre-booked court at peak times' where slug = 'jungle-padel-canggu-shortcut' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Total downtime or a spa-style wellness stop: this is a sports club, and peak-time courts need booking';
-- expect: UPDATE 1

-- 144. W-kecambah-restaurant-at-lalasa-villas-why_its_here · kecambah-restaurant-at-lalasa-villas · why_its_here · restore before
update venues set why_its_here = 'Kecambah is the street-front restaurant of Lalasa Villas on Pantai Berawa — a casual all-day room serving breakfast through late, with an Indonesian emphasis alongside Western dishes, plus a Balinese rijsttafel evening and a booked-ahead afternoon tea.' where slug = 'kecambah-restaurant-at-lalasa-villas' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lalasa Villas on Pantai Berawa has Kecambah as its street-front restaurant, a casual room open from breakfast until late. The cooking leans Indonesian, with Western dishes too. There is a Balinese rijsttafel evening, and afternoon tea is booked ahead.';
-- expect: UPDATE 1

-- 145. W-kecambah-restaurant-at-lalasa-villas-best_for · kecambah-restaurant-at-lalasa-villas · best_for · restore before
update venues set best_for = 'An all-day, street-front breakfast-to-late menu at Lalasa Villas in Berawa.' where slug = 'kecambah-restaurant-at-lalasa-villas' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Breakfast through to a late dinner at Lalasa Villas, or the Balinese rijsttafel evening';
-- expect: UPDATE 1

-- 146. W-kopiten-best_for · kopiten · best_for · restore before
update venues set best_for = 'Remote workers and long-stay visitors who want a quiet, low-key coffee stop away from the busier Canggu cafes.' where slug = 'kopiten' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Remote workers and long-stay visitors after a quiet, low-key coffee away from the busier Canggu cafes';
-- expect: UPDATE 1

-- 147. W-la-brisa-bali-why_its_here · la-brisa-bali · why_its_here · restore before
update venues set why_its_here = 'A rustic, sustainability-minded beach club on the foreshore of Echo Beach, hand-built from reclaimed wood salvaged from old Indonesian fishing boats, with a saltwater pool, a raw/oyster bar and wood-fired Mediterranean food. Best known for its driftwood aesthetic and long, open sunset views over the surf break.' where slug = 'la-brisa-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'La Brisa is a rustic beach club on Echo Beach, hand-built from wood salvaged from old Indonesian fishing boats. It has a saltwater pool, a raw and oyster bar and wood-fired Mediterranean food. Expect a driftwood look and long, open sunset views over the surf break.';
-- expect: UPDATE 1

-- 148. W-la-brisa-bali-best_for · la-brisa-bali · best_for · restore before
update venues set best_for = 'Sunset drinks and a laid-back beach day with friends; a relaxed shared meal by the water' where slug = 'la-brisa-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset drinks and a beach day with friends, or a shared meal by the water';
-- expect: UPDATE 1

-- 149. W-la-brisa-bali-not_for · la-brisa-bali · not_for · restore before
update venues set not_for = 'Daybeds and cabanas carry a 1M-3.5M++ minimum spend after 4pm.' where slug = 'la-brisa-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A low-spend sunset on a daybed: after 4pm, daybeds and cabanas carry a 1M-3.5M++ minimum spend';
-- expect: UPDATE 1

-- 150. W-loop-cafe-why_its_here · loop-cafe · why_its_here · restore before
update venues set why_its_here = 'High-protein breakfast cafe in Pererenan. The menu is built on eggs, salmon, chicken, cottage cheese, Greek yoghurt, oats and sourdough. Six protein shakes for after training. Specialty coffee, smoothie bowls, wraps and vegan options.' where slug = 'loop-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Eggs, salmon, chicken, cottage cheese, Greek yoghurt, oats and sourdough make up the menu at LOOP, a high-protein breakfast cafe in Pererenan. Six protein shakes are made for after training. Specialty coffee and smoothie bowls share the menu with wraps and vegan options.';
-- expect: UPDATE 1

-- 151. W-loop-cafe-not_for · loop-cafe · not_for · restore before
update venues set not_for = 'Dinner - the kitchen closes at 18:00' where slug = 'loop-cafe' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dinner, since the kitchen closes at 18:00';
-- expect: UPDATE 1

-- 152. W-lowcal-cheatery-and-bar-why_its_here · lowcal-cheatery-and-bar · why_its_here · restore before
update venues set why_its_here = 'LowCal builds its menu around low-calorie, paleolithic and ketogenic options. The venue trains and employs deaf team members across kitchen, bar and service roles. Dinner choices include chicken, pork, fish and vegetarian dishes with low-carb sides.' where slug = 'lowcal-cheatery-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'LowCal, on Jalan Pantai Batu Bolong, builds a low-calorie menu that also covers paleolithic and ketogenic eating. It trains and employs deaf team members across kitchen, bar and service roles. Dinner choices include chicken, pork, fish and vegetarian dishes, with low-carb sides.';
-- expect: UPDATE 1

-- 153. W-lowcal-cheatery-and-bar-best_for · lowcal-cheatery-and-bar · best_for · restore before
update venues set best_for = 'Health-led dining that includes low-carb choices and an inclusive service team.' where slug = 'lowcal-cheatery-and-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A health-led meal with low-carb choices, served by an inclusive team';
-- expect: UPDATE 1

-- 154. W-lowcal-cheatery-and-bar-not_for · lowcal-cheatery-and-bar · not_for · restore before
update venues set not_for = 'Diners seeking a traditional Balinese warung meal.' where slug = 'lowcal-cheatery-and-bar' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A traditional Balinese warung meal, because the menu is built around low-calorie, paleolithic and ketogenic food';
-- expect: UPDATE 1

-- 155. W-lulu-bistrot-why_its_here · lulu-bistrot · why_its_here · restore before
update venues set why_its_here = 'A French bistro on Jl. Pantai Batu Bolong serving classic bistro cooking made with local, seasonal ingredients in a relaxed, grand-cafe-inspired room and bar. It opens in the evenings with an early happy hour.' where slug = 'lulu-bistrot' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'On Jl. Pantai Batu Bolong, Lulu Bistrot cooks classic French bistro dishes with local, seasonal ingredients. The room and bar take their cue from the grand cafes. It opens in the evenings, with an early happy hour.';
-- expect: UPDATE 1

-- 156. W-lulu-bistrot-best_for · lulu-bistrot · best_for · restore before
update venues set best_for = 'Couples and small groups wanting an unhurried French dinner and drinks in the evening.' where slug = 'lulu-bistrot' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples and small groups after an unhurried French dinner and drinks';
-- expect: UPDATE 1

-- 157. W-lulu-bistrot-not_for · lulu-bistrot · not_for · restore before
update venues set not_for = 'Not a quick warung stop or a budget meal.' where slug = 'lulu-bistrot' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick warung stop or a budget meal: Lulu serves unhurried French bistro dinners';
-- expect: UPDATE 1

-- 158. W-luma-why_its_here · luma · why_its_here · restore before
update venues set why_its_here = 'An intimate, 30-seat open-air spot on Batu Bolong doing rustic Mediterranean small plates — Spanish- and Italian-style grazing — from chefs Cameron Emirali (10 Greek Street, London) and Kieran Morland (Merah Putih, Sangsaka). Draught beer, cocktails on tap and vinyl DJs on weekends.' where slug = 'luma' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An intimate, 30-seat open-air spot on Batu Bolong, Luma cooks rustic Mediterranean small plates. The chefs are Cameron Emirali, of 10 Greek Street in London, and Kieran Morland, of Merah Putih and Sangsaka. Beer and cocktails are on tap; vinyl DJs play at weekends.';
-- expect: UPDATE 1

-- 159. W-luma-best_for · luma · best_for · restore before
update venues set best_for = 'Golden-hour drinks and small plates; date night; a lively pre-dinner stop that becomes the evening.' where slug = 'luma' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Spanish- and Italian-style grazing over golden-hour drinks, on a date or as a lively pre-dinner stop that becomes the evening';
-- expect: UPDATE 1

-- 160. W-lyma-beach-why_its_here · lyma-beach · why_its_here · restore before
update venues set why_its_here = 'A beachfront bar and restaurant on Pantai Lima where the river meets the ocean, known for sunset views, cocktails and live entertainment through the week.' where slug = 'lyma-beach' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lyma Beach is a beachfront bar and restaurant on Pantai Lima, where the river meets the ocean. Expect sunset views, cocktails and live entertainment through the week.';
-- expect: UPDATE 1

-- 161. W-lyma-beach-best_for · lyma-beach · best_for · restore before
update venues set best_for = 'Sunset drinks by the beach, group get-togethers, and a relaxed beachfront meal with live music.' where slug = 'lyma-beach' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset drinks with a group, or a beachfront meal to live music';
-- expect: UPDATE 1

-- 162. W-lyma-beach-not_for · lyma-beach · not_for · restore before
update venues set not_for = 'A quiet work session or an intimate fine-dining evening.' where slug = 'lyma-beach' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet work session or an intimate fine-dining evening, because there''s live entertainment through the week';
-- expect: UPDATE 1

-- 163. W-manhattan-cocktail-hookah-kitchen-why_its_here · manhattan-cocktail-hookah-kitchen · why_its_here · restore before
update venues set why_its_here = 'Manhattan is a cocktail bar with shisha service and a kitchen on Jl. Pantai Batu Bolong. It publishes no website — only a link page — and its menu is not readable online, so what we can confirm is the format, the address and that booking runs through WhatsApp.' where slug = 'manhattan-cocktail-hookah-kitchen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Manhattan puts shisha service and a kitchen alongside a cocktail bar on Jl. Pantai Batu Bolong. It publishes no website beyond a link page, and its menu is not readable online. We can confirm the format, the address and WhatsApp booking.';
-- expect: UPDATE 1

-- 164. W-manhattan-cocktail-hookah-kitchen-best_for · manhattan-cocktail-hookah-kitchen · best_for · restore before
update venues set best_for = 'Cocktails and shisha with a kitchen attached, on Batu Bolong.' where slug = 'manhattan-cocktail-hookah-kitchen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Cocktails and shisha with a kitchen attached, on Batu Bolong';
-- expect: UPDATE 1

-- 165. W-mason-why_its_here · mason · why_its_here · restore before
update venues set why_its_here = 'A moody, minimalist grill on Batu Bolong (trading as MASONRY.) built around wood-fired, Mediterranean-leaning cooking, in-house charcuterie and a serious wine and cocktail list. It''s one of Canggu''s go-to rooms for a proper sit-down dinner.' where slug = 'mason' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Trading as MASONRY., Mason runs a moody, minimalist grill on Batu Bolong. The cooking is wood-fired and leans Mediterranean, the charcuterie is made in-house, and there is a wine and cocktail list.';
-- expect: UPDATE 1

-- 166. W-mason-best_for · mason · best_for · restore before
update venues set best_for = 'Wood-fired grill and charcuterie with a serious wine list, from midday to late.' where slug = 'mason' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sit-down meal of wood-fired grill, charcuterie and wine, from midday to late';
-- expect: UPDATE 1

-- 167. W-mason-not_for · mason · not_for · restore before
update venues set not_for = 'The Chop House room — it runs dinner only, Tuesday to Saturday.' where slug = 'mason' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Lunch in the Chop House room, which runs dinner only, Tuesday to Saturday';
-- expect: UPDATE 1

-- 168. W-mia-asian-modern-inspired-restaurant-and-bar-why_its_here · mia-asian-modern-inspired-restaurant-and-bar · why_its_here · restore before
update venues set why_its_here = 'MiA is a modern Asian restaurant and bar off Jl. Raya Semat, built around a sharing format — sushi rolls, raw plates, curries, wok and grill — running from evening into the early hours at weekends.' where slug = 'mia-asian-modern-inspired-restaurant-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Off Jl. Raya Semat, MiA is a modern Asian restaurant and bar built around sharing. Sushi rolls, raw plates, curries, wok and grill dishes make up the menu, and it runs into the early hours at weekends.';
-- expect: UPDATE 1

-- 169. W-mia-asian-modern-inspired-restaurant-and-bar-best_for · mia-asian-modern-inspired-restaurant-and-bar · best_for · restore before
update venues set best_for = 'Modern Asian sharing plates and sushi, dinner into late, off Jl. Raya Semat.' where slug = 'mia-asian-modern-inspired-restaurant-and-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Dinner into the late hours over modern Asian sharing plates and sushi';
-- expect: UPDATE 1

-- 170. W-miel-specialty-coffee-canggu-why_its_here · miel-specialty-coffee-canggu · why_its_here · restore before
update venues set why_its_here = 'A serious specialty-coffee cafe on Batu Bolong with a dedicated brew bar (V60, pour-over, cold brew) built on quality beans, set in a bright, plant-filled, high-ceilinged space. Spacious tables, quiet room and fast wifi make it a genuine work spot as much as a coffee stop.' where slug = 'miel-specialty-coffee-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'MIEL is a specialty-coffee cafe on Batu Bolong with a brew bar for V60, pour-over and cold brew. The space is bright and plant-filled, with high ceilings. Spacious tables and fast wifi in a quiet room make it a work spot too.';
-- expect: UPDATE 1

-- 171. W-miel-specialty-coffee-canggu-best_for · miel-specialty-coffee-canggu · best_for · restore before
update venues set best_for = 'Coffee-focused solo travellers and remote workers who want a proper filter coffee and a calm table to sit and work for a few hours; also an easy morning brunch.' where slug = 'miel-specialty-coffee-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Remote workers after filter coffee and a calm table for a few hours, or an easy morning brunch';
-- expect: UPDATE 1

-- 172. W-miel-specialty-coffee-canggu-not_for · miel-specialty-coffee-canggu · not_for · restore before
update venues set not_for = 'Best in the daytime rather than as an evening or late-night hangout.' where slug = 'miel-specialty-coffee-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An evening or late-night hangout; it is at its best in the daytime';
-- expect: UPDATE 1

-- 173. W-milk-and-madu-berawa-why_its_here · milk-and-madu-berawa · why_its_here · restore before
update venues set why_its_here = 'The Berawa flagship of Milk & Madu, a long-running all-day Canggu cafe brand doing hearty brunch, lava-stone pizzas and family-friendly dinners. A dependable, crowd-pleasing all-rounder.' where slug = 'milk-and-madu-berawa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Berawa flagship of Milk & Madu, an all-day Canggu cafe brand. It does hearty brunch, lava-stone pizzas and family-friendly dinners.';
-- expect: UPDATE 1

-- 174. W-milk-and-madu-berawa-best_for · milk-and-madu-berawa · best_for · restore before
update venues set best_for = 'Families and groups; a big post-surf brunch; an easy all-day meal that suits fussy and hungry tables alike.' where slug = 'milk-and-madu-berawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families and groups, from a big post-surf brunch to an easy all-day meal for fussy and hungry tables alike';
-- expect: UPDATE 1

-- 175. W-milk-and-madu-berawa-not_for · milk-and-madu-berawa · not_for · restore before
update venues set not_for = 'Couples seeking an intimate, quiet dining atmosphere.' where slug = 'milk-and-madu-berawa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, intimate dinner for a couple, because the dinners here are family-friendly';
-- expect: UPDATE 1

-- 176. W-milu-by-nook-why_its_here · milu-by-nook · why_its_here · restore before
update venues set why_its_here = 'A long-standing Berawa restaurant set in a garden overlooking a small rice paddy on Jl. Pantai Berawa, serving Balinese-Western dishes and coffee from morning until night.' where slug = 'milu-by-nook' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Milu by Nook, a restaurant on Jl. Pantai Berawa, has a garden looking over a small rice paddy. It serves Balinese-Western dishes and coffee from morning until night.';
-- expect: UPDATE 1

-- 177. W-milu-by-nook-best_for · milu-by-nook · best_for · restore before
update venues set best_for = 'A calm garden brunch or dinner over a Berawa rice paddy.' where slug = 'milu-by-nook' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm garden brunch or dinner over a Berawa rice paddy';
-- expect: UPDATE 1

-- 178. W-mission-flow-studio-why_its_here · mission-flow-studio · why_its_here · restore before
update venues set why_its_here = 'Mission Flow Studio is a yoga and conscious-movement studio in Pererenan, set in a light-filled space with panoramic windows minutes from the sea, offering Vinyasa flow, Yin and Restorative classes with a rotating roster of experienced teachers.' where slug = 'mission-flow-studio' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Minutes from the sea in Pererenan, Mission Flow Studio is a light-filled space for yoga and conscious movement, with panoramic windows. Classes cover Vinyasa flow, Yin and Restorative, taught by a rotating roster of experienced teachers.';
-- expect: UPDATE 1

-- 179. W-mission-flow-studio-best_for · mission-flow-studio · best_for · restore before
update venues set best_for = 'Travellers and locals wanting varied yoga classes (strong Vinyasa to gentle Yin/Restorative) in a serene Pererenan studio; drop-ins and regular practitioners.' where slug = 'mission-flow-studio' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Drop-ins and regular practitioners, from strong Vinyasa to gentle Yin or Restorative';
-- expect: UPDATE 1

-- 180. W-moana-fish-eatery-why_its_here · moana-fish-eatery · why_its_here · restore before
update venues set why_its_here = 'A Tahitian-Polynesian fish eatery on Jl. Pantai Batu Bolong serving fresh seafood — poke bowls, sashimi, carpaccio, tartare and BBQ fish — in a laid-back setting, open from morning until late.' where slug = 'moana-fish-eatery' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Moana, a Tahitian-Polynesian fish eatery on Jl. Pantai Batu Bolong, opens from morning until late. The fresh seafood runs to poke bowls, sashimi, carpaccio, tartare and BBQ fish.';
-- expect: UPDATE 1

-- 181. W-moana-fish-eatery-best_for · moana-fish-eatery · best_for · restore before
update venues set best_for = 'Tahitian-Polynesian raw fish and poke, casual, from morning to late.' where slug = 'moana-fish-eatery' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A casual plate of Tahitian-Polynesian raw fish or poke, any time from morning to late';
-- expect: UPDATE 1

-- 182. W-mosto-berawa-why_its_here · mosto-berawa · why_its_here · restore before
update venues set why_its_here = 'An intimate neo-bistro and natural wine bar in the heart of Berawa, billed as Indonesia''s first natural wine bar, with a compact room of around 60 covers and a curated list of 70+ natural-wine labels from small producers alongside ingredient-focused food. An evenings-only spot for food and wine lovers.' where slug = 'mosto-berawa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mosto is a neo-bistro in Berawa. The room seats around 60, and the list runs to more than 70 natural-wine labels from small producers. Food is ingredient-focused, and it opens evenings only.';
-- expect: UPDATE 1

-- 183. W-mosto-berawa-best_for · mosto-berawa · best_for · restore before
update venues set best_for = 'A date or intimate dinner centred on natural wine; a small group of wine lovers' where slug = 'mosto-berawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A date, an intimate dinner over natural wine, or a small group of wine lovers';
-- expect: UPDATE 1

-- 184. W-mosto-berawa-not_for · mosto-berawa · not_for · restore before
update venues set not_for = 'Large groups or anyone after a big beachfront party scene' where slug = 'mosto-berawa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Large groups or a big beachfront party scene, since the room is compact and seats around 60';
-- expect: UPDATE 1

-- 185. W-motion-cafe-best_for · motion-cafe · best_for · restore before
update venues set best_for = 'Gym-goers and fitness-minded travellers wanting clean, protein-forward food and healthy breakfasts.' where slug = 'motion-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Gym-goers and fitness-minded travellers after clean, protein-forward food or a healthy breakfast';
-- expect: UPDATE 1

-- 186. W-motion-cafe-not_for · motion-cafe · not_for · restore before
update venues set not_for = 'Diners looking for a rich, indulgent or traditional dining experience.' where slug = 'motion-cafe' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A rich, indulgent or traditional meal, because the menu is built around macro-friendly plates and meal prep';
-- expect: UPDATE 1

-- 187. W-murmur-restaurant-lounge-why_its_here · murmur-restaurant-lounge · why_its_here · restore before
update venues set why_its_here = 'Murmur is a two-storey all-day restaurant and lounge on Jl. Anggrek with over a hundred seats, a VIP room for eleven, and tables looking over the rice fields at sunset. Breakfast runs to 4pm, then the kitchen switches to the dinner menu and the room stays open to 2am.' where slug = 'murmur-restaurant-lounge' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Murmur is a two-storey all-day restaurant and lounge on Jl. Anggrek, with over a hundred seats and a VIP room for eleven. Tables look over the rice fields at sunset. Breakfast runs to 4pm before the dinner menu starts, and the room stays open to 2am.';
-- expect: UPDATE 1

-- 188. W-murmur-restaurant-lounge-best_for · murmur-restaurant-lounge · best_for · restore before
update venues set best_for = 'A two-floor all-day room over the rice fields — breakfast to 4pm, then dinner.' where slug = 'murmur-restaurant-lounge' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sunset table over the rice fields, with breakfast until 4pm and dinner after';
-- expect: UPDATE 1

-- 189. W-nail-lesss-canggu-why_its_here · nail-lesss-canggu · why_its_here · restore before
update venues set why_its_here = 'Nail Lesss is a nail salon on Jalan Pantai Pererenan offering manicures, gel and acrylic extensions and classic eyelash extensions, known for a clean space and detailed, unhurried work.' where slug = 'nail-lesss-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Nail Lesss, a nail salon on Jalan Pantai Pererenan, the work is manicures, gel and acrylic extensions and classic eyelash extensions.';
-- expect: UPDATE 1

-- 190. W-nail-lesss-canggu-best_for · nail-lesss-canggu · best_for · restore before
update venues set best_for = 'Travellers wanting careful gel/acrylic manicures or lash extensions in Pererenan by appointment.' where slug = 'nail-lesss-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A booked gel or acrylic manicure, or lash extensions, in Pererenan';
-- expect: UPDATE 1

-- 191. W-neighbourhood-food-berawa-why_its_here · neighbourhood-food-berawa · why_its_here · restore before
update venues set why_its_here = 'A neighbourhood cafe and coffee shop in the heart of Berawa on Jl. Pantai Berawa, serving slow breakfasts, laid-back snacks and simple wholesome dishes made from local produce; daytime hours.' where slug = 'neighbourhood-food-berawa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Neighbourhood Food''s Berawa cafe and coffee shop, on Jl. Pantai Berawa, keeps daytime hours. It serves slow breakfasts, snacks and simple wholesome dishes made from local produce.';
-- expect: UPDATE 1

-- 192. W-neighbourhood-food-berawa-best_for · neighbourhood-food-berawa · best_for · restore before
update venues set best_for = 'A relaxed brunch, coffee and healthy casual daytime eating.' where slug = 'neighbourhood-food-berawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Brunch, coffee or a healthy, casual daytime meal';
-- expect: UPDATE 1

-- 193. W-neighbourhood-food-berawa-not_for · neighbourhood-food-berawa · not_for · restore before
update venues set not_for = 'Not an evening dinner venue - the Berawa branch closes at 6pm.' where slug = 'neighbourhood-food-berawa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dinner: the Berawa branch closes at 6pm';
-- expect: UPDATE 1

-- 194. W-neighbourhood-food-seseh-why_its_here · neighbourhood-food-seseh · why_its_here · restore before
update venues set why_its_here = 'A local eatery and coffee shop set among the tranquil Seseh fields, serving slow breakfasts, laid-back afternoon snacks and weekend dinners with fresh, simple dishes from local produce.' where slug = 'neighbourhood-food-seseh' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Among the Seseh fields, Neighbourhood Food has a local eatery and coffee shop. It serves slow breakfasts, afternoon snacks and weekend dinners, with fresh, simple dishes from local produce.';
-- expect: UPDATE 1

-- 195. W-neighbourhood-food-seseh-best_for · neighbourhood-food-seseh · best_for · restore before
update venues set best_for = 'A relaxed breakfast or brunch, an easy weekend dinner, and calm coffee stops away from the crowds.' where slug = 'neighbourhood-food-seseh' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm breakfast, brunch or coffee away from the crowds, or an easy weekend dinner';
-- expect: UPDATE 1

-- 196. W-neighbourhood-food-seseh-not_for · neighbourhood-food-seseh · not_for · restore before
update venues set not_for = 'A high-energy party or beach-club atmosphere.' where slug = 'neighbourhood-food-seseh' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A high-energy party or a beach-club scene. Meals here are slow breakfasts and weekend dinners in the fields';
-- expect: UPDATE 1

-- 197. W-nirvana-strength-tibubeneng-why_its_here · nirvana-strength-tibubeneng · why_its_here · restore before
update venues set why_its_here = 'Wellness club on Jl. Pantai Berawa with more than 100 classes a week: strength, yoga, pilates, mobility, breathwork and sound. Recovery runs to ice baths, saunas, steam rooms, hot tubs and pools. A day pass covers 20+ classes and the recovery spa.' where slug = 'nirvana-strength-tibubeneng' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Nirvana Strength, a wellness club on Jl. Pantai Berawa, runs more than 100 classes a week across strength, yoga, pilates, mobility, breathwork and sound. Recovery means ice baths, saunas, steam rooms, hot tubs and pools.';
-- expect: UPDATE 1

-- 198. W-nirvana-strength-tibubeneng-best_for · nirvana-strength-tibubeneng · best_for · restore before
update venues set best_for = 'A day pass that covers training and recovery' where slug = 'nirvana-strength-tibubeneng' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A day pass covering 20-plus classes and the recovery spa';
-- expect: UPDATE 1

-- 199. W-nude-berawa-why_its_here · nude-berawa · why_its_here · restore before
update venues set why_its_here = 'A popular healthy cafe at a busy Berawa junction on Jl. Pantai Berawa, serving wholesome bowls, salads, wraps, smoothies and coffee from breakfast to evening; part of a small Bali group.' where slug = 'nude-berawa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At a busy junction on Jl. Pantai Berawa, NÜDE runs a healthy cafe, part of a small Bali group. From breakfast to evening it serves wholesome bowls, salads, wraps, smoothies and coffee.';
-- expect: UPDATE 1

-- 200. W-nude-berawa-best_for · nude-berawa · best_for · restore before
update venues set best_for = 'A healthy brunch or casual all-day meal - good for digital nomads and families.' where slug = 'nude-berawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Digital nomads and families after a healthy brunch or a casual all-day meal';
-- expect: UPDATE 1

-- 201. W-nude-berawa-not_for · nude-berawa · not_for · restore before
update venues set not_for = 'A quiet, tucked-away table — it sits on a busy Berawa junction.' where slug = 'nude-berawa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet table out of the way, because it sits on a busy Berawa junction';
-- expect: UPDATE 1

-- 202. W-obsidian-gym-bali-canggu-best_for · obsidian-gym-bali-canggu · best_for · restore before
update venues set best_for = 'Serious lifters who want top-tier kit and don''t mind a premium day pass (449k).' where slug = 'obsidian-gym-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Lifters after top-tier kit, with recovery on site';
-- expect: UPDATE 1

-- 203. W-obsidian-gym-bali-canggu-not_for · obsidian-gym-bali-canggu · not_for · restore NULL
update venues set not_for = null where slug = 'obsidian-gym-bali-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A low-cost drop-in: the premium day pass is 449k';
-- expect: UPDATE 1

-- 204. W-only-nails-pererenan-why_its_here · only-nails-pererenan · why_its_here · restore before
update venues set why_its_here = 'Only Nails is a nail salon on Jl. Raya Tiyingtutul in Pererenan specialising in the Russian manicure technique and long-wear gel systems, with an option for 4-hands manicure-and-pedicure service in a calm, retreat-like space.' where slug = 'only-nails-pererenan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Russian manicure technique and long-wear gel are the speciality at Only Nails, a nail salon on Jl. Raya Tiyingtutul in Pererenan. A 4-hands service does manicure and pedicure at once, and the space is calm.';
-- expect: UPDATE 1

-- 205. W-only-nails-pererenan-best_for · only-nails-pererenan · best_for · restore before
update venues set best_for = 'Travellers wanting a precise Russian manicure or long-lasting gel work, including quick 4-hands mani-pedi sessions, in Pererenan.' where slug = 'only-nails-pererenan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A precise Russian manicure or long-lasting gel, or a quick 4-hands mani-pedi';
-- expect: UPDATE 1

-- 206. W-paed-thai-canggu-why_its_here · paed-thai-canggu · why_its_here · restore before
update venues set why_its_here = 'Thai restaurant on Jl. Canggu Padang Linjong, part of the Wonderspace group. Tom yum goong, pad thai, green curry and mango sticky rice. Indoor and outdoor seating facing rice fields.' where slug = 'paed-thai-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Part of the Wonderspace group, Paed Thai cooks Thai food on Jl. Canggu Padang Linjong. The menu has tom yum goong, pad thai, green curry and mango sticky rice. Indoor and outdoor tables face rice fields.';
-- expect: UPDATE 1

-- 207. W-pizza-fabbrica-why_its_here · pizza-fabbrica · why_its_here · restore before
update venues set why_its_here = 'A Neapolitan pizzeria on Jl. Batu Mejan turning out wood-fired, thin and light pizzas plus fresh pasta in an industrial-chic space, with a second branch in Umalas.' where slug = 'pizza-fabbrica' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pizza Fabbrica is a Neapolitan pizzeria on Jl. Batu Mejan, with a second branch in Umalas. The pizzas are wood-fired, thin and light, the pasta is fresh, and the room is industrial in style.';
-- expect: UPDATE 1

-- 208. W-pizza-fabbrica-best_for · pizza-fabbrica · best_for · restore before
update venues set best_for = 'A casual pizza dinner with friends or family, and groups sharing.' where slug = 'pizza-fabbrica' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A casual pizza dinner with friends, family or a group sharing';
-- expect: UPDATE 1

-- 209. W-poule-de-luxe-bali-why_its_here · poule-de-luxe-bali · why_its_here · restore before
update venues set why_its_here = 'French patisserie and bakery on Jl. Batu Belig serving authentic pastries; best known for its cream puffs, plus macarons, tarts and viennoiserie. Take-away/eat-in, and supplies desserts to villas, parties and restaurants.' where slug = 'poule-de-luxe-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Poule de Luxe makes cream puffs, macarons, tarts and viennoiserie in its French patisserie and bakery on Jl. Batu Belig. You can eat in or take away. It also supplies desserts to villas and restaurants, and for parties.';
-- expect: UPDATE 1

-- 210. W-poule-de-luxe-bali-best_for · poule-de-luxe-bali · best_for · restore before
update venues set best_for = 'a pastry or coffee stop and sweet take-away; celebration/letter cakes and gifts; grab-and-go breakfast pastries' where slug = 'poule-de-luxe-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A pastry with coffee, a grab-and-go breakfast, or a letter cake or gift for a celebration';
-- expect: UPDATE 1

-- 211. W-poule-de-luxe-bali-not_for · poule-de-luxe-bali · not_for · restore before
update venues set not_for = 'anyone wanting a full sit-down meal or savoury dinner' where slug = 'poule-de-luxe-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full sit-down meal or a savoury dinner, since it bakes pastries and cakes';
-- expect: UPDATE 1

-- 212. W-revolver-canggu-why_its_here · revolver-canggu · why_its_here · restore before
update venues set why_its_here = 'The Canggu outpost of Revolver, a homegrown Bali coffee brand (est. 2012) that roasts its own beans. An all-day cafe on Jl. Nelayan doing serious espresso, full brunch and heavier evening plates, turning bar-ish after dark.' where slug = 'revolver-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Revolver, a Bali coffee brand founded in 2012, roasts its own beans; this is its all-day cafe on Jl. Nelayan in Canggu. Espresso and full brunch run by day, heavier plates in the evening, and it turns bar-ish after dark.';
-- expect: UPDATE 1

-- 213. W-revolver-canggu-best_for · revolver-canggu · best_for · restore before
update venues set best_for = 'Coffee-led brunch after surf; a laptop-friendly morning; an easy all-day sit-down.' where slug = 'revolver-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Coffee-led brunch after a surf, a morning on the laptop, or an easy all-day sit-down';
-- expect: UPDATE 1

-- 214. W-revolver-canggu-not_for · revolver-canggu · not_for · restore before
update venues set not_for = 'A calm evening meal -- it turns bar-ish after dark.' where slug = 'revolver-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A calm evening meal, since it turns bar-ish after dark';
-- expect: UPDATE 1

-- 215. W-rise-and-shine-cafe-why_its_here · rise-and-shine-cafe · why_its_here · restore before
update venues set why_its_here = 'A long-running, colourful all-day breakfast and lunch cafe on Jl. Padang Linjong in Canggu (open since 2017) serving fresh, health-conscious comfort food, coffee and juices in an open-air, al-fresco setting.' where slug = 'rise-and-shine-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Open since 2017 on Jl. Padang Linjong, Rise and Shine is a colourful all-day breakfast and lunch cafe. It serves fresh, health-conscious comfort food with coffee and juices, all in the open air.';
-- expect: UPDATE 1

-- 216. W-rise-and-shine-cafe-best_for · rise-and-shine-cafe · best_for · restore before
update venues set best_for = 'A bright, casual morning-after-the-beach breakfast or brunch, good for solo travellers, couples and small groups wanting healthy plates.' where slug = 'rise-and-shine-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A healthy breakfast or brunch after the beach, for solo travellers, couples and small groups';
-- expect: UPDATE 1

-- 217. W-rise-and-shine-cafe-not_for · rise-and-shine-cafe · not_for · restore before
update venues set not_for = 'A daytime breakfast-and-lunch spot rather than an evening dinner or drinks venue.' where slug = 'rise-and-shine-cafe' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Evening dinner or drinks, because it serves breakfast and lunch by day';
-- expect: UPDATE 1

-- 218. W-rite-bali-why_its_here · rite-bali · why_its_here · restore before
update venues set why_its_here = 'A wellness club on Jl. Pantai Pererenan combining a gym, yoga classes and a recovery zone with a sauna, a cold plunge held at 7-9°C, a jacuzzi and a steam room. Recovery and gym access are bundled on a day pass (500k).' where slug = 'rite-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'RITE Bali, a wellness club on Jl. Pantai Pererenan, has a gym, yoga classes and a recovery zone. Recovery pairs a sauna and steam room with a jacuzzi and a 7-9°C cold plunge. A 500k day pass bundles recovery with gym access.';
-- expect: UPDATE 1

-- 219. W-rite-bali-best_for · rite-bali · best_for · restore before
update venues set best_for = 'Active travellers and athletes who want training, yoga and contrast recovery in one Pererenan spot.' where slug = 'rite-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Athletes and active travellers after training, yoga and contrast recovery in one Pererenan spot';
-- expect: UPDATE 1

-- 220. W-rite-bali-not_for · rite-bali · not_for · restore before
update venues set not_for = 'Anyone looking for a traditional pampering spa rather than an active recovery and fitness space.' where slug = 'rite-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A traditional pampering spa. Recovery here is sauna, steam room, jacuzzi and cold plunge';
-- expect: UPDATE 1

-- 221. W-rite-bali-recovery-canggu-why_its_here · rite-bali-recovery-canggu · why_its_here · restore before
update venues set why_its_here = 'The recovery-and-spa side of RITE Bali in Pererenan — sauna, ice bath and bodywork bundled with gym access on a day pass (500k).' where slug = 'rite-bali-recovery-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The recovery-and-spa side of RITE Bali in Pererenan. Sauna, ice bath and bodywork come bundled with gym access on a 500k day pass.';
-- expect: UPDATE 1

-- 222. W-rite-bali-recovery-canggu-best_for · rite-bali-recovery-canggu · best_for · restore before
update venues set best_for = 'Fitness travellers who want training plus contrast recovery in one Pererenan spot.' where slug = 'rite-bali-recovery-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Fitness travellers pairing training with contrast recovery on one day pass';
-- expect: UPDATE 1

-- 223. W-rite-bali-yoga-canggu-why_its_here · rite-bali-yoga-canggu · why_its_here · restore before
update venues set why_its_here = 'The yoga strand of RITE Bali in Pererenan, offering classes alongside the club''s gym and recovery facilities.' where slug = 'rite-bali-yoga-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The yoga strand of RITE Bali in Pererenan, with classes alongside the club''s gym and recovery facilities.';
-- expect: UPDATE 1

-- 224. W-rite-bali-yoga-canggu-best_for · rite-bali-yoga-canggu · best_for · restore before
update venues set best_for = 'Members and visitors who want yoga bundled with training and recovery.' where slug = 'rite-bali-yoga-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Members and visitors after yoga bundled with training and recovery';
-- expect: UPDATE 1

-- 225. W-riviera-bistro-berawa-why_its_here · riviera-bistro-berawa · why_its_here · restore before
update venues set why_its_here = 'A modern Mediterranean bistro and wine bar in Berawa (open since 2020) with whitewashed arches, an extensive wine list and a daily Aperitivo hour; open from late morning until late, with a Saturday DJ night.' where slug = 'riviera-bistro-berawa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Riviera Bistro, open since 2020, is a modern Mediterranean bistro and wine bar in Berawa with whitewashed arches. The wine list is extensive, Aperitivo hour runs daily, and Saturday is DJ night. It opens from late morning until late.';
-- expect: UPDATE 1

-- 226. W-riviera-bistro-berawa-best_for · riviera-bistro-berawa · best_for · restore before
update venues set best_for = 'Date night, aperitivo and dinner with drinks, and lively evenings.' where slug = 'riviera-bistro-berawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A date night, aperitivo, or a lively evening of dinner and drinks';
-- expect: UPDATE 1

-- 227. W-riviera-bistro-berawa-not_for · riviera-bistro-berawa · not_for · restore before
update venues set not_for = 'Not a quiet or budget spot.' where slug = 'riviera-bistro-berawa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet or budget spot. Evenings here are lively, with a Saturday DJ night';
-- expect: UPDATE 1

-- 228. W-riviera-cafe-cemagi-why_its_here · riviera-cafe-cemagi · why_its_here · restore before
update venues set why_its_here = 'A tranquil garden cafe in quiet Cemagi from the Riviera Group, leaning Mediterranean-Italian, with cozy interiors, greenery and live acoustic music on Saturday evenings.' where slug = 'riviera-cafe-cemagi' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Riviera Group''s garden cafe in quiet Cemagi leans Mediterranean-Italian, with cozy interiors and greenery. Live acoustic music plays on Saturday evenings.';
-- expect: UPDATE 1

-- 229. W-riviera-cafe-cemagi-best_for · riviera-cafe-cemagi · best_for · restore before
update venues set best_for = 'A calm, unhurried breakfast, lunch or relaxed evening meal away from the Canggu crowds; couples wanting a low-key setting.' where slug = 'riviera-cafe-cemagi' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Calm breakfasts, lunches or evening meals away from the Canggu crowds, or a low-key night for a couple';
-- expect: UPDATE 1

-- 230. W-riviera-cafe-cemagi-not_for · riviera-cafe-cemagi · not_for · restore before
update venues set not_for = 'Beachfront views or a high-energy party scene.' where slug = 'riviera-cafe-cemagi' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Beachfront views or a high-energy party scene: the cafe sits in a garden in quiet Cemagi';
-- expect: UPDATE 1

-- 231. W-riviera-trattoria-pererenan-why_its_here · riviera-trattoria-pererenan · why_its_here · restore before
update venues set why_its_here = 'The Riviera Group''s Pererenan trattoria for authentic Italian: hand-rolled pastas, Neapolitan pizzas and an extensive wine and cocktail list in a cozy, lively room.' where slug = 'riviera-trattoria-pererenan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Riviera Group''s Italian trattoria in Pererenan does hand-rolled pastas and Neapolitan pizzas, with an extensive wine and cocktail list. The room is cozy and lively.';
-- expect: UPDATE 1

-- 232. W-riviera-trattoria-pererenan-best_for · riviera-trattoria-pererenan · best_for · restore before
update venues set best_for = 'Date night, group dinners over shared Italian plates and wine, and a lively casual evening.' where slug = 'riviera-trattoria-pererenan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A date night, a group dinner over shared plates and wine, or a lively, casual evening';
-- expect: UPDATE 1

-- 233. W-riviera-trattoria-pererenan-not_for · riviera-trattoria-pererenan · not_for · restore before
update venues set not_for = 'A quiet daytime work cafe or beachfront setting.' where slug = 'riviera-trattoria-pererenan' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet daytime work session or a beachfront table, because the trattoria room is cozy and lively';
-- expect: UPDATE 1

-- 234. W-rize-cafe-why_its_here · rize-cafe · why_its_here · restore before
update venues set why_its_here = 'A Pererenan cafe serving contemporary Indian home cooking alongside brunch classics, craft cocktails and house chai, with spices ground daily and dishes rooted in family recipes.' where slug = 'rize-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Spices are ground daily at Rize, a Pererenan cafe serving contemporary Indian home cooking rooted in family recipes. Brunch classics, craft cocktails and house chai fill out the menu.';
-- expect: UPDATE 1

-- 235. W-rize-cafe-best_for · rize-cafe · best_for · restore before
update venues set best_for = 'Spice lovers wanting Indian food, a distinctive brunch, or cocktails and chai in a relaxed setting; small groups sharing dishes.' where slug = 'rize-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Spice lovers and small groups sharing Indian dishes, a distinctive brunch, or cocktails and chai';
-- expect: UPDATE 1

-- 236. W-rize-cafe-not_for · rize-cafe · not_for · restore before
update venues set not_for = 'Diners after a beach-club or sunset-view scene.' where slug = 'rize-cafe' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A beach-club or sunset-view scene, because the focus is Indian home cooking';
-- expect: UPDATE 1

-- 237. W-ruko-cafe-why_its_here · ruko-cafe · why_its_here · restore before
update venues set why_its_here = 'An Australian-style neighbourhood cafe about 300m from Berawa beach, serving locally sourced healthy food and its own Indonesian coffee blend, with 40-50% local organic produce. A reliable daily breakfast and brunch stop.' where slug = 'ruko-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'About 300m from Berawa beach, Ruko is an Australian-style neighbourhood cafe for breakfast and brunch. The food is healthy and locally sourced, 40-50% of the produce is local and organic, and the coffee is its own Indonesian blend.';
-- expect: UPDATE 1

-- 238. W-ruko-cafe-best_for · ruko-cafe · best_for · restore before
update venues set best_for = 'Post-beach breakfast, brunch and coffee for solo travellers, couples and families who want fresh, organic-leaning food near Berawa.' where slug = 'ruko-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families, couples or solo travellers after a fresh, organic-leaning breakfast or brunch and coffee after the beach';
-- expect: UPDATE 1

-- 239. W-ruko-cafe-not_for · ruko-cafe · not_for · restore before
update venues set not_for = 'A daytime cafe rather than an evening or dinner destination.' where slug = 'ruko-cafe' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An evening out or dinner: it is a daytime cafe';
-- expect: UPDATE 1

-- 240. W-sa-mesa-canggu-experience-dining-why_its_here · sa-mesa-canggu-experience-dining · why_its_here · restore before
update venues set why_its_here = 'An Italian communal-dining restaurant in Canggu, open since early 2021 and built around a single long table. There is no menu: guests are served a set procession of roughly 14-18 shared dishes that changes daily, with plates such as tuna crudo, grilled octopus and house fettuccine placed down the middle of the table.' where slug = 'sa-mesa-canggu-experience-dining' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'One long communal table is the centre of Sa''Mesa, an Italian restaurant in Canggu open since early 2021. There is no menu: guests share a set procession of roughly 14-18 dishes that changes daily. Plates like tuna crudo, grilled octopus and house fettuccine go down the middle.';
-- expect: UPDATE 1

-- 241. W-sa-mesa-canggu-experience-dining-best_for · sa-mesa-canggu-experience-dining · best_for · restore before
update venues set best_for = 'Groups and solo travellers up for a set-menu Italian dinner where you share one table with strangers rather than order for yourself.' where slug = 'sa-mesa-canggu-experience-dining' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Groups or solo diners happy to share one table with strangers over a set Italian dinner';
-- expect: UPDATE 1

-- 242. W-sama-sama-prime-why_its_here · sama-sama-prime · why_its_here · restore before
update venues set why_its_here = 'Sama Sama Prime is a steakhouse and sushi bar on Jl. Raya Semat, part of the Sama Sama group. Its own site describes it two ways — a steakhouse sushi bar on the homepage, a modern premium Japanese restaurant on the about page — and we have left that unreconciled rather than pick one.' where slug = 'sama-sama-prime' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sama Sama Prime, from the Sama Sama group, combines a steakhouse and a sushi bar on Jl. Raya Semat. Its own site calls it a steakhouse sushi bar on the homepage and a modern premium Japanese restaurant on the about page. We have not settled which.';
-- expect: UPDATE 1

-- 243. W-sama-sama-prime-best_for · sama-sama-prime · best_for · restore before
update venues set best_for = 'Steak and sushi under one roof, on Jl. Raya Semat in Canggu.' where slug = 'sama-sama-prime' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Steak and sushi under one roof, on Jl. Raya Semat in Canggu';
-- expect: UPDATE 1

-- 244. W-samadi-bali-why_its_here · samadi-bali · why_its_here · restore before
update venues set why_its_here = 'A yoga and wellness hub on Jl. Padang Linjong in Canggu''s Batu Bolong area, with an organic vegetarian cafe certified by the Slow Food movement, serving superfood bowls and traditional Indian dishes.' where slug = 'samadi-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Samadi is a yoga and wellness hub on Jl. Padang Linjong, in the Batu Bolong part of Canggu. Its organic vegetarian cafe is certified by the Slow Food movement and serves superfood bowls and traditional Indian dishes.';
-- expect: UPDATE 1

-- 245. W-samadi-bali-best_for · samadi-bali · best_for · restore before
update venues set best_for = 'Yoga-goers and wellness travellers wanting a calm, plant-based meal before or after a class.' where slug = 'samadi-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm, plant-based meal on either side of a yoga class';
-- expect: UPDATE 1

-- 246. W-samadi-bali-not_for · samadi-bali · not_for · restore before
update venues set not_for = 'Anyone after meat dishes, alcohol or a high-energy social scene.' where slug = 'samadi-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Meat, alcohol or a high-energy social scene: the cafe is vegetarian and the hub is built around yoga';
-- expect: UPDATE 1

-- 247. W-samesa-canggu-why_its_here · samesa-canggu · why_its_here · restore before
update venues set why_its_here = 'A one-of-a-kind communal Italian dinner: everyone shares one long table for a multi-course, family-style set menu inspired by an Italian grandmother''s table. Dinner only, one seating, book ahead — it''s an event as much as a meal.' where slug = 'samesa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A communal Italian dinner where everyone shares one long table. The multi-course set menu is family-style, inspired by an Italian grandmother''s table. There is one seating, dinner only, and you book ahead.';
-- expect: UPDATE 1

-- 248. W-samesa-canggu-best_for · samesa-canggu · best_for · restore before
update venues set best_for = 'A communal Italian set-menu dinner at one long shared table, one seating a night.' where slug = 'samesa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Communal Italian set-menu dinners at one long shared table, one seating a night';
-- expect: UPDATE 1

-- 249. W-santanera-why_its_here · santanera · why_its_here · restore before
update venues set why_its_here = 'A stylish Latin American dining room and rooftop bar on Jl. Tanah Barak, blending Latin flavours with European technique and local ingredients across a sharing-focused menu. Contemporary artwork, a big seated room and a late-night bar make it a full evening out.' where slug = 'santanera' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'On Jl. Tanah Barak, Santanera pairs a Latin American dining room with a rooftop bar. The sharing menu mixes Latin flavours with European technique and local ingredients. Contemporary artwork, a big seated room and a late-night bar make a full evening of it.';
-- expect: UPDATE 1

-- 250. W-santanera-best_for · santanera · best_for · restore before
update venues set best_for = 'Date night; group dinners built around shared plates; a special evening with cocktails on the rooftop.' where slug = 'santanera' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special evening of rooftop cocktails and shared plates, as a date or with a group';
-- expect: UPDATE 1

-- 251. W-satu-satu-coffee-company-why_its_here · satu-satu-coffee-company · why_its_here · restore before
update venues set why_its_here = 'A family-run specialty coffee company in Berawa built on the Sudana family''s Balinese single-origin beans, roasted in-house, with a bright, eco-minded white space and a simple all-day menu of bowls, sandwiches and smoothies for the post-surf crowd.' where slug = 'satu-satu-coffee-company' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Built on the Sudana family''s Balinese single-origin beans, roasted in-house, Satu-Satu is a family-run specialty coffee company in Berawa. The bright white space is eco-minded. A simple all-day menu of bowls, sandwiches and smoothies feeds the post-surf crowd.';
-- expect: UPDATE 1

-- 252. W-satu-satu-coffee-company-best_for · satu-satu-coffee-company · best_for · restore before
update venues set best_for = 'Coffee lovers and post-surf travellers wanting well-pulled espresso built on Indonesian single origins plus a healthy breakfast or lunch bowl.' where slug = 'satu-satu-coffee-company' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Well-pulled espresso from Indonesian single origins for coffee lovers, or a healthy breakfast or lunch bowl after a surf';
-- expect: UPDATE 1

-- 253. W-satu-satu-coffee-company-not_for · satu-satu-coffee-company · not_for · restore before
update venues set not_for = 'A daytime coffee-and-brunch spot rather than an evening venue.' where slug = 'satu-satu-coffee-company' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An evening out: coffee and brunch here are daytime affairs';
-- expect: UPDATE 1

-- 254. W-saya-club-why_its_here · saya-club · why_its_here · restore before
update venues set why_its_here = 'Gym and coworking space in Berawa, open around the clock. Personal training and classes in pilates, reformer, boxing and yoga. Ice bath, sauna, pool and a cafe-bar on site.' where slug = 'saya-club' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Saya Club combines a gym and coworking space in Berawa. There is personal training, and classes in pilates, reformer, boxing and yoga. On site are an ice bath, a sauna, a pool and a cafe-bar.';
-- expect: UPDATE 1

-- 255. W-saya-club-best_for · saya-club · best_for · restore before
update venues set best_for = 'Training at any hour, including the middle of the night' where slug = 'saya-club' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Training';
-- expect: UPDATE 1

-- 256. W-secana-rooftop-bali-why_its_here · secana-rooftop-bali · why_its_here · restore before
update venues set why_its_here = 'Secana Rooftop sits on top of the Secana Beachtown resort in Berawa — a pool bar and restaurant open from morning to 11pm, with daybeds by day, a menu moving between Mediterranean and comfort cooking, and DJ sunset sessions on Fridays and Sundays.' where slug = 'secana-rooftop-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'On top of the Secana Beachtown resort in Berawa, Secana Rooftop is a pool bar and restaurant open from morning to 11pm. There are daybeds by day, the menu moves between Mediterranean and comfort cooking, and DJs play sunset sessions on Fridays and Sundays.';
-- expect: UPDATE 1

-- 257. W-secana-rooftop-bali-best_for · secana-rooftop-bali · best_for · restore before
update venues set best_for = 'A rooftop pool bar in Berawa — daybeds by day, DJ sunsets Friday and Sunday.' where slug = 'secana-rooftop-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A daybed by the rooftop pool, or a DJ sunset on Friday or Sunday';
-- expect: UPDATE 1

-- 258. W-secret-spot-bali-why_its_here · secret-spot-bali · why_its_here · restore before
update venues set why_its_here = 'A fully plant-based cafe serving vegan breakfast through dinner, with vegan croissants, bowls, curries and ramen, plus coffee roasted weekly on the island. Extras like Monday pasta nights with live jazz and a chicory coffee alternative round out the character.' where slug = 'secret-spot-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Secret Spot is a fully plant-based cafe serving vegan food from breakfast through dinner: croissants, bowls, curries and ramen. The coffee is roasted weekly on the island, with chicory as an alternative. Monday is pasta night, with live jazz.';
-- expect: UPDATE 1

-- 259. W-secret-spot-bali-best_for · secret-spot-bali · best_for · restore before
update venues set best_for = 'vegan breakfast and brunch; plant-based croissants and pastries; island-roasted coffee; relaxed all-day dining' where slug = 'secret-spot-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Vegan breakfast or brunch of plant-based croissants and pastries, with island-roasted coffee';
-- expect: UPDATE 1

-- 260. W-secret-spot-bali-not_for · secret-spot-bali · not_for · restore before
update venues set not_for = 'diners set on meat or seafood dishes; anyone wanting a fast grab-and-go stop' where slug = 'secret-spot-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Meat or seafood eaters, or a fast grab-and-go stop: the menu is fully plant-based';
-- expect: UPDATE 1

-- 261. W-seseh-general-store-why_its_here · seseh-general-store · why_its_here · restore before
update venues set why_its_here = 'An Aussie-owned corner cafe bringing Melbourne coffee culture to coastal Cemagi/Seseh, doing well-made breads, sandwiches and salads a short step from the beach, with a community-hub feel.' where slug = 'seseh-general-store' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Melbourne coffee culture comes to coastal Cemagi and Seseh at Seseh General Store, an Aussie-owned corner cafe a short step from the beach. It does well-made breads, sandwiches and salads, and has the feel of a community hub.';
-- expect: UPDATE 1

-- 262. W-seseh-general-store-best_for · seseh-general-store · best_for · restore before
update venues set best_for = 'A morning coffee and pastry, a casual sandwich-and-salad lunch, and a laid-back neighbourhood cafe stop after the beach.' where slug = 'seseh-general-store' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A morning coffee and pastry, a casual sandwich-and-salad lunch, or a stop after the beach';
-- expect: UPDATE 1

-- 263. W-seseh-general-store-not_for · seseh-general-store · not_for · restore before
update venues set not_for = 'A sit-down dinner or a formal evening out.' where slug = 'seseh-general-store' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A sit-down dinner or a formal evening out, because the food is breads, sandwiches and salads';
-- expect: UPDATE 1

-- 264. W-shelter-restaurant-why_its_here · shelter-restaurant · why_its_here · restore before
update venues set why_its_here = 'A wood-fired Middle Eastern and Mediterranean restaurant in Pererenan built inside a Balinese joglo with open, plant-filled architecture, a UK chef and a rotating calendar of BBQs and vinyl DJ nights. Reservations recommended.' where slug = 'shelter-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Shelter, a wood-fired Middle Eastern and Mediterranean restaurant in Pererenan, is built inside a Balinese joglo with open, plant-filled architecture. A UK chef runs the kitchen, and a rotating calendar brings BBQs and vinyl DJ nights. Booking is recommended.';
-- expect: UPDATE 1

-- 265. W-shelter-restaurant-best_for · shelter-restaurant · best_for · restore before
update venues set best_for = 'Date night, group dinners and special occasions with an atmospheric, reservation-led setting.' where slug = 'shelter-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Special occasions, date nights and group dinners, booked ahead';
-- expect: UPDATE 1

-- 266. W-shelter-restaurant-not_for · shelter-restaurant · not_for · restore before
update venues set not_for = 'A walk-in quick lunch or a solo laptop session.' where slug = 'shelter-restaurant' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick walk-in lunch or a solo laptop session, because reservations are recommended';
-- expect: UPDATE 1

-- 267. W-shichirin-japanese-restaurant-canggu-why_its_here · shichirin-japanese-restaurant-canggu · why_its_here · restore before
update venues set why_its_here = 'Japanese grill restaurant in Berawa, part of the Wonderspace group. Teppanyaki, gyukatsu and izakaya plates, with sushi and sashimi. Black cod in saikyo miso and breaded Santuri wagyu are signatures.' where slug = 'shichirin-japanese-restaurant-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Shichirin brings Japanese grill cooking to Berawa as part of the Wonderspace group. The menu has teppanyaki, gyukatsu and izakaya plates. Sushi and sashimi are on it too. The house dishes are black cod in saikyo miso and breaded Santuri wagyu.';
-- expect: UPDATE 1

-- 268. W-shosan-holistic-spa-canggu-why_its_here · shosan-holistic-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published list covers Head Massage and Traditional Massage. Shosan Signature Massage is 1100K IDR for 90 minutes. Booking runs through Fresha.' where slug = 'shosan-holistic-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Shosan, a wellness spa in Canggu, takes bookings through Fresha. Its published list covers head massage and traditional massage, and the 90-minute Shosan Signature Massage costs 1100K IDR.';
-- expect: UPDATE 1

-- 269. W-shosan-holistic-spa-canggu-best_for · shosan-holistic-spa-canggu · best_for · restore before
update venues set best_for = 'Head massage booked the same day.' where slug = 'shosan-holistic-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A head massage booked the same day';
-- expect: UPDATE 1

-- 270. W-shosan-holistic-spa-canggu-not_for · shosan-holistic-spa-canggu · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 1100K IDR.' where slug = 'shosan-holistic-spa-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget massage: the published list starts at 1100K IDR';
-- expect: UPDATE 1

-- 271. W-sia-grill-and-seafood-bar-why_its_here · sia-grill-and-seafood-bar · why_its_here · restore before
update venues set why_its_here = 'SIA is a casual seafood and grill bar on the Canggu Shortcut, working fresh fish with Balinese ingredients and Asian influences, with a cocktail programme alongside. Open from midday to 11pm daily.' where slug = 'sia-grill-and-seafood-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'SIA is a casual seafood and grill bar on the Canggu Shortcut. Fresh fish meets Balinese ingredients and Asian influences, and there is a cocktail programme.';
-- expect: UPDATE 1

-- 272. W-sia-grill-and-seafood-bar-best_for · sia-grill-and-seafood-bar · best_for · restore before
update venues set best_for = 'Fresh seafood and grill with a cocktail bar, on the Canggu Shortcut.' where slug = 'sia-grill-and-seafood-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Fresh seafood and grill plates with cocktails on the Canggu Shortcut';
-- expect: UPDATE 1

-- 273. W-sia-grill-and-seafood-bar-not_for · sia-grill-and-seafood-bar · not_for · restore before
update venues set not_for = 'Breakfast — the kitchen opens at midday.' where slug = 'sia-grill-and-seafood-bar' and status = 'active' and publication_status = 'published' and not_for is not distinct from null;
-- expect: UPDATE 1

-- 274. W-skool-kitchen-why_its_here · skool-kitchen · why_its_here · restore before
update venues set why_its_here = 'An open-flame kitchen on Jl. Pura Dalem in Canggu, cooking meats and seafood over wood and charcoal — a tasting menu alongside à la carte plates and cuts priced by weight. Dinner only, from 5pm. It shares its address with The Lawn Canggu; both are Project Black venues.' where slug = 'skool-kitchen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'SKOOL Kitchen is an open-flame kitchen on Jl. Pura Dalem that cooks meats and seafood over wood and charcoal. Dinner only, from 5pm: a tasting menu, à la carte plates and cuts priced by weight. It shares an address with The Lawn Canggu, another Project Black venue.';
-- expect: UPDATE 1

-- 275. W-skool-kitchen-best_for · skool-kitchen · best_for · restore before
update venues set best_for = 'A special-occasion or date-night dinner with a beachside setting and drinks.' where slug = 'skool-kitchen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special-occasion or date-night dinner by the beach, with drinks';
-- expect: UPDATE 1

-- 276. W-skool-kitchen-not_for · skool-kitchen · not_for · restore before
update venues set not_for = 'Daytime — it opens at 5pm daily.' where slug = 'skool-kitchen' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Daytime plans, since it opens at 5pm daily';
-- expect: UPDATE 1

-- 277. W-smoke-grill-master-and-barbeque-bali-why_its_here · smoke-grill-master-and-barbeque-bali · why_its_here · restore before
update venues set why_its_here = 'SMOKE is an open-fire barbecue restaurant at Echo Beach, seating guests outdoors, in a tent or indoors, with a private backyard barn and a chef''s table for groups of ten or more booked 48 hours ahead.' where slug = 'smoke-grill-master-and-barbeque-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'SMOKE cooks open-fire barbecue at Echo Beach, with seating outdoors, in a tent or indoors. It also has a private backyard barn and a chef''s table, for groups of ten or more booked 48 hours ahead.';
-- expect: UPDATE 1

-- 278. W-smoke-grill-master-and-barbeque-bali-best_for · smoke-grill-master-and-barbeque-bali · best_for · restore before
update venues set best_for = 'Open-fire barbecue at Echo Beach — tent, indoor or garden seating.' where slug = 'smoke-grill-master-and-barbeque-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Open-fire barbecue at Echo Beach, in the tent, indoors or in the garden';
-- expect: UPDATE 1

-- 279. W-spring-spa-canggu-why_its_here · spring-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'A dependable branch of the island-wide Spring Spa chain on the Batu Bolong strip, doing brisk, well-priced manicures, waxing, massage and facials in a bright, clean salon a short walk from Canggu''s cafés.' where slug = 'spring-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Spring Spa''s Batu Bolong branch belongs to an island-wide chain and sits a short walk from Canggu''s cafés. It does brisk, well-priced manicures, waxing, massage and facials in a bright, clean salon.';
-- expect: UPDATE 1

-- 280. W-spring-spa-canggu-best_for · spring-spa-canggu · best_for · restore before
update venues set best_for = 'Visitors who want a reliable walk-in mani-pedi or a quick massage between beach and brunch, without committing to a hotel spa.' where slug = 'spring-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A walk-in mani-pedi or a quick massage between beach and brunch, without a hotel-spa booking';
-- expect: UPDATE 1

-- 281. W-surya-fitness-gym-why_its_here · surya-fitness-gym · why_its_here · restore before
update venues set why_its_here = 'Gym and fight club in Pererenan. Equipment from Life Fitness, Hammer Strength and TechnoGym: racks, barbells, bumpers, kettlebells, benches and conditioning machines. The fight club runs boxing, Muay Thai, pad work and sparring. A rooftop for stretching, a cafe and billiards sit on site. Memberships include air conditioning, water, towels, showers and lockers.' where slug = 'surya-fitness-gym' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A gym and fight club in Pererenan, Surya Fitness uses Life Fitness, Hammer Strength and TechnoGym equipment. The fight club runs boxing, Muay Thai, pad work and sparring. On site are a stretching rooftop and a cafe, plus billiards.';
-- expect: UPDATE 1

-- 282. W-surya-fitness-gym-best_for · surya-fitness-gym · best_for · restore before
update venues set best_for = 'Lifting and striking under one roof' where slug = 'surya-fitness-gym' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Lifting and striking under one roof, with air conditioning, water, towels, showers and lockers in the membership';
-- expect: UPDATE 1

-- 283. W-sushimi-bali-why_its_here · sushimi-bali · why_its_here · restore before
update venues set why_its_here = 'A sushi-train restaurant on Jl. Pantai Berawa serving classic and creative sushi and maki plus an izakaya-style a la carte range. The menu extends to poke bowls, donburi, sushi burritos and sushi donuts, with gluten-free, vegan and vegetarian options.' where slug = 'sushimi-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'On Jl. Pantai Berawa, Sushimi''s sushi train carries classic and creative sushi and maki, plus an izakaya-style a la carte range. The menu extends to poke bowls, donburi, sushi burritos and sushi donuts. There are gluten-free, vegan and vegetarian options.';
-- expect: UPDATE 1

-- 284. W-sushimi-bali-best_for · sushimi-bali · best_for · restore before
update venues set best_for = 'casual sushi with friends; interactive sushi-train dining; solo diners; mixed dietary groups' where slug = 'sushimi-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Casual sushi off the train, with friends, on your own or with a group of mixed diets';
-- expect: UPDATE 1

-- 285. W-sushimi-bali-not_for · sushimi-bali · not_for · restore before
update venues set not_for = 'a formal or high-end omakase occasion; a quiet intimate dinner; anyone wanting a sea view' where slug = 'sushimi-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A formal or high-end omakase, a quiet intimate dinner or a sea view, because this is a casual sushi train';
-- expect: UPDATE 1

-- 286. W-swarna-spa-and-wellness-why_its_here · swarna-spa-and-wellness · why_its_here · restore before
update venues set why_its_here = 'A complete spa and wellness destination in Pererenan offering authentic Balinese and hot stone massage, facials and a signature thermal ritual combining hot plunge, cold immersion and infrared sauna.' where slug = 'swarna-spa-and-wellness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Swarna does Balinese and hot stone massage and facials at its spa and wellness venue in Pererenan. Its house thermal ritual combines a hot plunge and cold immersion with an infrared sauna.';
-- expect: UPDATE 1

-- 287. W-swarna-spa-and-wellness-best_for · swarna-spa-and-wellness · best_for · restore before
update venues set best_for = 'Travellers wanting a full pampering session of massage, facial and thermal/contrast therapy in one calm venue.' where slug = 'swarna-spa-and-wellness' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A full pampering session of massage, facial and hot-cold therapy in one calm venue';
-- expect: UPDATE 1

-- 288. W-the-avocado-factory-why_its_here · the-avocado-factory · why_its_here · restore before
update venues set why_its_here = 'Billed as South East Asia''s first avocado bar, this Berawa-area cafe builds an entire menu around avocado, from truffle eggs benedict to avo pancakes and avocado basque cheesecake, with an eco-conscious build.' where slug = 'the-avocado-factory' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Avocado runs through the whole menu at The Avocado Factory, a cafe. Dishes run from truffle eggs benedict to avo pancakes and avocado basque cheesecake, in an eco-conscious build.';
-- expect: UPDATE 1

-- 289. W-the-avocado-factory-best_for · the-avocado-factory · best_for · restore before
update venues set best_for = 'Avocado and brunch lovers; a novelty-led daytime spot that also runs late with burgers into the evening.' where slug = 'the-avocado-factory' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Avocado and brunch lovers by day, or burgers late into the evening';
-- expect: UPDATE 1

-- 290. W-the-avocado-factory-not_for · the-avocado-factory · not_for · restore before
update venues set not_for = 'Anyone who dislikes avocado or wants a strictly traditional local menu.' where slug = 'the-avocado-factory' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone who dislikes avocado or wants a strictly traditional local menu, since every dish is built around it';
-- expect: UPDATE 1

-- 291. W-the-canggu-studio-canggu-best_for · the-canggu-studio-canggu · best_for · restore before
update venues set best_for = 'Those who prefer low-impact reformer Pilates and intimate, well-taught classes over a big gym.' where slug = 'the-canggu-studio-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Low-impact reformer Pilates in an intimate class rather than a big gym';
-- expect: UPDATE 1

-- 292. W-the-canggu-studio-yoga-canggu-why_its_here · the-canggu-studio-yoga-canggu · why_its_here · restore before
update venues set why_its_here = 'The yoga-and-mat side of The Canggu Studio, offering small-group classes on a clean Mon–Sat timetable (drop-in 170k).' where slug = 'the-canggu-studio-yoga-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The yoga-and-mat side of The Canggu Studio, with small-group classes on a clean Mon–Sat timetable (drop-in 170k).';
-- expect: UPDATE 1

-- 293. W-the-canggu-studio-yoga-canggu-best_for · the-canggu-studio-yoga-canggu · best_for · restore before
update venues set best_for = 'Those who like intimate, well-taught classes over big drop-in halls.' where slug = 'the-canggu-studio-yoga-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An intimate yoga class instead of a big drop-in hall';
-- expect: UPDATE 1

-- 294. W-the-flow-bali-why_its_here · the-flow-bali · why_its_here · restore before
update venues set why_its_here = 'The Flow Bali is a char-grill restaurant in Pererenan working modern plates with Mediterranean and Asian influences, from croquettas and carpaccio up to prime cuts on the wood fire.' where slug = 'the-flow-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Flow Bali is a char-grill restaurant in Pererenan cooking modern plates with Mediterranean and Asian influences. The menu runs from croquettas and carpaccio up to prime cuts on the wood fire.';
-- expect: UPDATE 1

-- 295. W-the-flow-bali-best_for · the-flow-bali · best_for · restore before
update venues set best_for = 'Char-grilled Mediterranean-Asian plates and prime cuts in Pererenan.' where slug = 'the-flow-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Char-grilled Mediterranean-Asian plates and prime cuts in Pererenan';
-- expect: UPDATE 1

-- 296. W-the-lawn-canggu-beach-club-why_its_here · the-lawn-canggu-beach-club · why_its_here · restore before
update venues set why_its_here = 'A lifestyle beach club set directly on the black sand of Batu Bolong Beach, with an ocean-facing infinity pool, daybeds and a bar-restaurant known for sunset sessions and DJs over the Indian Ocean. A long-running Canggu spot for daytime lounging that shifts into golden-hour drinks.' where slug = 'the-lawn-canggu-beach-club' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Right on the black sand of Batu Bolong Beach, The Lawn is a beach club with an ocean-facing infinity pool and daybeds. Its bar-restaurant runs sunset sessions with DJs over the Indian Ocean, as daytime lounging shifts into golden-hour drinks.';
-- expect: UPDATE 1

-- 297. W-the-lawn-canggu-beach-club-best_for · the-lawn-canggu-beach-club · best_for · restore before
update venues set best_for = 'Sunset cocktails from a daybed; an easy day between surf sessions on Batu Bolong' where slug = 'the-lawn-canggu-beach-club' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset cocktails from a daybed, or an easy day between surf sessions';
-- expect: UPDATE 1

-- 298. W-the-lawn-canggu-beach-club-not_for · the-lawn-canggu-beach-club · not_for · restore before
update venues set not_for = 'A full beach club rather than a quick, cheap breakfast stop.' where slug = 'the-lawn-canggu-beach-club' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick, cheap breakfast stop: this is a full beach club';
-- expect: UPDATE 1

-- 299. W-the-loft-bali-why_its_here · the-loft-bali · why_its_here · restore before
update venues set why_its_here = 'A Bondi-inspired all-day brunch cafe on Batu Bolong with specialty coffee and a large plant-based selection. It leans to healthy breakfast staples, bowls and toasts in a relaxed Canggu setting.' where slug = 'the-loft-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Loft serves specialty coffee and a large plant-based selection at its Bondi-inspired all-day brunch cafe on Batu Bolong. The food leans to healthy breakfast staples, bowls and toasts.';
-- expect: UPDATE 1

-- 300. W-the-loft-bali-best_for · the-loft-bali · best_for · restore before
update venues set best_for = 'a slow brunch after the beach; specialty coffee and a laptop; plant-based and healthy breakfast eaters' where slug = 'the-loft-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A slow brunch after the beach, specialty coffee with a laptop, or a plant-based, healthy breakfast';
-- expect: UPDATE 1

-- 301. W-the-loft-bali-not_for · the-loft-bali · not_for · restore before
update venues set not_for = 'anyone seeking a quiet non-touristy local spot or a traditional balinese meal' where slug = 'the-loft-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, non-touristy local spot or a traditional Balinese meal: the cafe is Bondi-inspired, with healthy breakfast staples';
-- expect: UPDATE 1

-- 302. W-the-shady-shack-why_its_here · the-shady-shack · why_its_here · restore before
update venues set why_its_here = 'A breezy all-day vegetarian and vegan cafe overlooking the Berawa rice fields, from the team behind Betelnut. Big wholefood menu — all-day breakfast, smoothies, salads, share plates and vegan desserts — in a leafy, open setting.' where slug = 'the-shady-shack' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'From the team behind Betelnut, The Shady Shack is an all-day vegetarian and vegan cafe looking over the Berawa rice fields. The wholefood menu is big: all-day breakfast, smoothies, salads, share plates and vegan desserts, in a leafy, open setting.';
-- expect: UPDATE 1

-- 303. W-the-shady-shack-best_for · the-shady-shack · best_for · restore before
update venues set best_for = 'A healthy post-surf brunch; plant-based eaters; a relaxed early dinner with a rice-field view.' where slug = 'the-shady-shack' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Plant-based eaters, from a healthy brunch after a surf to an early dinner with a rice-field view';
-- expect: UPDATE 1

-- 304. W-the-shady-shack-not_for · the-shady-shack · not_for · restore before
update venues set not_for = 'Diners set on meat or seafood -- the menu is entirely vegetarian and vegan.' where slug = 'the-shady-shack' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Diners set on meat or seafood, because the menu is entirely vegetarian and vegan';
-- expect: UPDATE 1

-- 305. W-the-shampoo-lounge-canggu-why_its_here · the-shampoo-lounge-canggu · why_its_here · restore before
update venues set why_its_here = 'A long-running Bali hair-salon brand''s Canggu outpost, known for reliable cuts, colour and blow-outs by English-speaking stylists in a relaxed, air-conditioned space.' where slug = 'the-shampoo-lounge-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'HairShop is the Canggu branch of a Bali hair-salon brand, in Tegal Gundul Square on Jl. Pantai Berawa. English-speaking stylists do cuts, colour and blow-outs in an air-conditioned space.';
-- expect: UPDATE 1

-- 306. W-the-shampoo-lounge-canggu-best_for · the-shampoo-lounge-canggu · best_for · restore before
update venues set best_for = 'Visitors who want a trustworthy haircut or colour on the road, with easy WhatsApp booking.' where slug = 'the-shampoo-lounge-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A haircut or colour on the road, booked easily by WhatsApp';
-- expect: UPDATE 1

-- 307. W-the-slow-why_its_here · the-slow · why_its_here · restore before
update venues set why_its_here = 'The restaurant, bar and gallery inside The Slow, a design-led boutique hotel on Batu Bolong. The internationally-inspired kitchen runs all day and the room doubles as an art and events space, so it works as both a stylish breakfast stop and an evening destination.' where slug = 'the-slow' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The restaurant, bar and gallery inside The Slow, a design-led boutique hotel on Batu Bolong. The kitchen is internationally inspired and runs all day, and the room doubles as an art and events space. It works for breakfast as well as an evening out.';
-- expect: UPDATE 1

-- 308. W-the-slow-best_for · the-slow · best_for · restore before
update venues set best_for = 'A design-led brunch or dinner inside The Slow hotel on Batu Bolong.' where slug = 'the-slow' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A design-led brunch or dinner inside The Slow hotel on Batu Bolong';
-- expect: UPDATE 1

-- 309. W-therapy-canggu-canggu-why_its_here · therapy-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'The Batu Bolong flagship of the Therapy group, blending massage, facials and beauty in a calm, well-run space (9am–8pm).' where slug = 'therapy-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Batu Bolong flagship of the Therapy group, open 9am to 8pm, with massage, facials and beauty treatments in a calm space.';
-- expect: UPDATE 1

-- 310. W-therapy-canggu-canggu-best_for · therapy-canggu-canggu · best_for · restore before
update venues set best_for = 'Anyone wanting spa and beauty together near the Batu Bolong strip.' where slug = 'therapy-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Spa and beauty treatments together, near the Batu Bolong strip';
-- expect: UPDATE 1

-- 311. W-therapy-day-spa-pererenan-why_its_here · therapy-day-spa-pererenan · why_its_here · restore before
update venues set why_its_here = 'A day spa on Jl. Pantai Pererenan built around plant-derived, toxin-free and cruelty-free rituals, offering massages, facials, body scrubs and scalp treatments in a calm sanctuary setting.' where slug = 'therapy-day-spa-pererenan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Therapy Day Spa on Jl. Pantai Pererenan is built around plant-derived rituals that are toxin-free and cruelty-free. Massages, facials, body scrubs and scalp treatments run in a calm setting.';
-- expect: UPDATE 1

-- 312. W-therapy-day-spa-pererenan-best_for · therapy-day-spa-pererenan · best_for · restore before
update venues set best_for = 'Travellers wanting a natural, clean-ingredient massage or facial in a serene Pererenan setting.' where slug = 'therapy-day-spa-pererenan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A natural, clean-ingredient massage or facial in a calm Pererenan setting';
-- expect: UPDATE 1

-- 313. W-therapy-hair-spa-canggu-canggu-why_its_here · therapy-hair-spa-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'The Canggu salon of the Therapy group, pairing hairdressing — cuts, colour, blow-outs — with spa-style facials and massage (9am–8pm).' where slug = 'therapy-hair-spa-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Therapy group''s Canggu salon, open 9am to 8pm, pairs hairdressing with spa-style facials and massage. On the hair side there are cuts, colour and blow-outs.';
-- expect: UPDATE 1

-- 314. W-therapy-hair-spa-canggu-canggu-best_for · therapy-hair-spa-canggu-canggu · best_for · restore before
update venues set best_for = 'Anyone wanting hair and beauty under one roof near Batu Bolong.' where slug = 'therapy-hair-spa-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Hair and beauty under one roof, near Batu Bolong';
-- expect: UPDATE 1

-- 315. W-top-gym-why_its_here · top-gym · why_its_here · restore before
update venues set why_its_here = 'Boutique gym of 400 square metres near Batu Bolong, with rice field views. TechnoGym equipment throughout. The recovery area has a panoramic terrace, two ice baths, a sauna, a smoothie bar and loungers. Group classes cover stretching, yoga, pilates, functional training, boxing and dance.' where slug = 'top-gym' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A 400-square-metre boutique gym near Batu Bolong, Top Gym has rice field views and TechnoGym equipment throughout. The recovery area has a panoramic terrace, two ice baths, a sauna, a smoothie bar and loungers.';
-- expect: UPDATE 1

-- 316. W-top-gym-best_for · top-gym · best_for · restore before
update venues set best_for = 'Training and recovery in one stop' where slug = 'top-gym' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Training and recovery in one stop, with group classes in stretching, yoga, pilates, functional training, boxing and dance';
-- expect: UPDATE 1

-- 317. W-touche-cafe-and-restaurant-why_its_here · touche-cafe-and-restaurant · why_its_here · restore before
update venues set why_its_here = 'An island-chic all-day cafe near Pererenan beach with design-led interiors and an urban-leaning menu, open from early morning to late.' where slug = 'touche-cafe-and-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Near Pererenan beach, Touché keeps all-day cafe hours from early morning to late, with design-led interiors and an urban-leaning menu.';
-- expect: UPDATE 1

-- 318. W-touche-cafe-and-restaurant-best_for · touche-cafe-and-restaurant · best_for · restore before
update venues set best_for = 'A stylish brunch, a coffee-and-laptop daytime stop, and a relaxed casual meal.' where slug = 'touche-cafe-and-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Brunch among design-led interiors, a daytime coffee with the laptop, or a casual meal';
-- expect: UPDATE 1

-- 319. W-touche-cafe-and-restaurant-not_for · touche-cafe-and-restaurant · not_for · restore before
update venues set not_for = 'A beach-club scene or a big group party.' where slug = 'touche-cafe-and-restaurant' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A beach-club scene or a big group party: it is an all-day cafe';
-- expect: UPDATE 1

-- 320. W-tropical-nomad-why_its_here · tropical-nomad · why_its_here · restore before
update venues set why_its_here = 'A long-running Canggu-shortcut coworking space with an integrated open-air cafe overlooking rice fields and garden, built for people who want to eat, sit with a laptop and stay a while.' where slug = 'tropical-nomad' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Tropical Nomad is a coworking space on the Canggu shortcut with an open-air cafe built in that looks over rice fields and a garden. It is made for eating, sitting with a laptop and staying a while.';
-- expect: UPDATE 1

-- 321. W-tropical-nomad-best_for · tropical-nomad · best_for · restore before
update venues set best_for = 'Digital nomads and remote workers who want fast wifi, big shared tables and a laptop-friendly cafe; casual daytime coffee stops.' where slug = 'tropical-nomad' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Digital nomads and remote workers after fast wifi and big shared tables, or a casual daytime coffee';
-- expect: UPDATE 1

-- 322. W-tropical-nomad-not_for · tropical-nomad · not_for · restore before
update venues set not_for = 'A romantic dinner or a special-occasion night out.' where slug = 'tropical-nomad' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A romantic dinner or a special-occasion night out, because this is a coworking space with a cafe';
-- expect: UPDATE 1

-- 323. W-two-face-canggu-why_its_here · two-face-canggu · why_its_here · restore before
update venues set why_its_here = 'A specialty coffee and brunch spot on Jl. Munduk Catu in Canggu, focused on well-made coffee, creative brunch dishes and a relaxed community atmosphere.' where slug = 'two-face-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Well-made coffee and creative brunch dishes are the focus at TWO FACE, a specialty coffee and brunch cafe on Jl. Munduk Catu in Canggu. It has a community feel.';
-- expect: UPDATE 1

-- 324. W-two-face-canggu-best_for · two-face-canggu · best_for · restore before
update venues set best_for = 'Coffee-focused travellers wanting a solid morning brunch and specialty coffee in a welcoming space.' where slug = 'two-face-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A morning brunch and specialty coffee in a welcoming space';
-- expect: UPDATE 1

-- 325. W-udara-bali-why_its_here · udara-bali · why_its_here · restore before
update venues set why_its_here = 'Organic Ocean, the plant-forward restaurant at the Udara wellness retreat in Seseh, focused on healthy, community- and earth-conscious cooking, open daily to guests and visitors.' where slug = 'udara-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Organic Ocean, the plant-forward restaurant at the Udara wellness retreat in Seseh, is open daily to guests and visitors. The cooking is healthy and conscious of community and earth.';
-- expect: UPDATE 1

-- 326. W-udara-bali-best_for · udara-bali · best_for · restore before
update venues set best_for = 'Wellness- and health-minded diners wanting calm, organic food; a quiet, restorative meal near the beach.' where slug = 'udara-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Health-minded diners after a quiet, restorative and organic meal near the beach';
-- expect: UPDATE 1

-- 327. W-udara-bali-not_for · udara-bali · not_for · restore before
update venues set not_for = 'A lively nightlife scene or a heavy meat-and-cocktails night out.' where slug = 'udara-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A lively nightlife scene or a heavy meat-and-cocktails night out: the kitchen is plant-forward';
-- expect: UPDATE 1

-- 328. W-udara-bali-yoga-detox-and-spa-organic-ocean-why_its_here · udara-bali-yoga-detox-and-spa-organic-ocean · why_its_here · restore before
update venues set why_its_here = 'Udara Bali is an integrated yoga, detox and wellness retreat resort at Seseh Beach near Canggu, with five ocean-view yoga shalas, Quantum Sound Domes for sound healing, a spa with a water-healing pool, seawater pools and the plant-forward Organic Ocean restaurant; it is adults-only (14+).' where slug = 'udara-bali-yoga-detox-and-spa-organic-ocean' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Seseh Beach, Udara Bali is a yoga, detox and wellness retreat resort for adults only (14+). It has five ocean-view yoga shalas and Quantum Sound Domes for sound healing. Its spa has a water-healing pool; there are seawater pools too, and the plant-forward Organic Ocean restaurant.';
-- expect: UPDATE 1

-- 329. W-udara-bali-yoga-detox-and-spa-organic-ocean-best_for · udara-bali-yoga-detox-and-spa-organic-ocean · best_for · restore before
update venues set best_for = 'Travellers wanting a dedicated wellness/detox or yoga retreat, sound healing and spa in a quiet adults-only oceanfront setting near Canggu; day-spa and retreat guests.' where slug = 'udara-bali-yoga-detox-and-spa-organic-ocean' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A yoga or detox retreat, sound healing or a spa day in a quiet adults-only setting by the ocean';
-- expect: UPDATE 1

-- 330. W-udara-bali-yoga-detox-and-spa-organic-ocean-not_for · udara-bali-yoga-detox-and-spa-organic-ocean · not_for · restore before
update venues set not_for = 'Families with young children (adults-only, minimum age 14); anyone wanting a lively town-centre location.' where slug = 'udara-bali-yoga-detox-and-spa-organic-ocean' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Families with young children or a lively town-centre base, because it is adults-only (14+) and out at Seseh Beach';
-- expect: UPDATE 1

-- 331. W-ulekan-berawa-why_its_here · ulekan-berawa · why_its_here · restore before
update venues set why_its_here = 'A sit-down Indonesian restaurant in Berawa celebrating dishes from across the archipelago — hand-ground spices, no MSG or palm oil, ingredients sourced from small-scale farmers and fishermen. A pretty, fairy-lit garden setting.' where slug = 'ulekan-berawa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ulekan, a sit-down Indonesian restaurant in Berawa, cooks dishes from across the archipelago. Spices are ground by hand and there is no MSG or palm oil; ingredients come from small-scale farmers and fishermen. Tables sit in a fairy-lit garden.';
-- expect: UPDATE 1

-- 332. W-ulekan-berawa-best_for · ulekan-berawa · best_for · restore before
update venues set best_for = 'A relaxed dinner of traditional Indonesian food; groups sharing classic dishes; an accessible introduction to the country''s cuisine.' where slug = 'ulekan-berawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sit-down dinner of classic Indonesian dishes, shared as a group or as an accessible introduction to the cuisine';
-- expect: UPDATE 1

-- 333. W-victory-fitness-club-why_its_here · victory-fitness-club · why_its_here · restore before
update venues set why_its_here = 'A budget gym at Jl. Pantai Pererenan No.89 in Canggu, open daily 07:00-20:30. Equipment is spread over two floors, with a punching bag and loan gloves upstairs and a smoothie bar on the ground floor; an ice bath and sauna are also on site. Day access runs around EUR 3. Reviews are consistent on the value and mixed on cleanliness.' where slug = 'victory-fitness-club' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Open daily 07:00-20:30, Victory Fitness Club is a budget gym at Jl. Pantai Pererenan No.89. Equipment spreads over two floors, with a punching bag and loan gloves upstairs and a smoothie bar below. An ice bath and sauna are on site.';
-- expect: UPDATE 1

-- 334. W-victory-fitness-club-best_for · victory-fitness-club · best_for · restore before
update venues set best_for = 'Travellers in Pererenan who want a cheap, no-frills lifting session with ice bath and sauna and do not mind a rough-around-the-edges gym.' where slug = 'victory-fitness-club' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Cheap, no-frills lifting with ice bath and sauna, at around EUR 3 for the day';
-- expect: UPDATE 1

-- 335. W-wanderlust-fitness-village-canggu-best_for · wanderlust-fitness-village-canggu · best_for · restore before
update venues set best_for = 'Visitors who want a full day of varied training and community vibe in one spot.' where slug = 'wanderlust-fitness-village-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A full day of varied training in one spot, with a community feel';
-- expect: UPDATE 1

-- 336. W-warung-local-why_its_here · warung-local · why_its_here · restore before
update venues set why_its_here = 'A semi-open Indonesian warung on the Batu Bolong strip serving Halal local staples — nasi campur, nasi goreng and satay — with an outdoor seating section. Open daily 10am–10pm.' where slug = 'warung-local' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Warung Local is a semi-open Indonesian warung on the Batu Bolong strip, open daily 10am to 10pm. The kitchen is Halal and cooks local staples such as nasi campur, nasi goreng and satay, and there is an outdoor seating section.';
-- expect: UPDATE 1

-- 337. W-warung-local-best_for · warung-local · best_for · restore before
update venues set best_for = 'Halal diners; a central Batu Bolong location; casual dinner as well as lunch; travellers wanting familiar local staples in an easy setting' where slug = 'warung-local' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Halal diners after familiar local staples, at lunch or a casual dinner in central Batu Bolong';
-- expect: UPDATE 1

-- 338. W-warung-local-not_for · warung-local · not_for · restore before
update venues set not_for = 'anyone specifically after pork dishes (Halal kitchen); diners seeking a quiet, no-scene warung' where slug = 'warung-local' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Pork dishes or a quiet, no-scene warung: the kitchen is Halal and it sits on the Batu Bolong strip';
-- expect: UPDATE 1

-- 339. W-warung-nonii-why_its_here · warung-nonii · why_its_here · restore before
update venues set why_its_here = 'A long-running, affordable Indonesian warung (Waroeng Nonii) just up from Batu Bolong beach on Jl. Pantai Batu Bolong, open breakfast through dinner with nasi campur as its house plate and takeaway available.' where slug = 'warung-nonii' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Just up from the beach on Jl. Pantai Batu Bolong sits Warung Nonii, also written Waroeng Nonii, an affordable Indonesian warung. It is open from breakfast through dinner, nasi campur is the house plate, and takeaway is available.';
-- expect: UPDATE 1

-- 340. W-warung-nonii-best_for · warung-nonii · best_for · restore before
update venues set best_for = 'A cheap, easy local Indonesian meal at any time of day, including a low-key just-landed dinner.' where slug = 'warung-nonii' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cheap, easy local meal at any time of day, including a low-key dinner straight off the plane';
-- expect: UPDATE 1

-- 341. W-warung-sika-why_its_here · warung-sika · why_its_here · restore before
update venues set why_its_here = 'A family-run point-and-pick nasi campur warung where you choose rice then add vegetables and meats from the display. One of Canggu''s most popular local rice stalls, open daily 9am–9pm.' where slug = 'warung-sika' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Family-run Warung Sika serves nasi campur, open daily 9am to 9pm. It is point-and-pick: you choose rice, then add vegetables and meats from the display.';
-- expect: UPDATE 1

-- 342. W-warung-sika-best_for · warung-sika · best_for · restore before
update venues set best_for = 'cheap authentic nasi campur; solo diners and quick lunches; build-your-own plate eaters; first-timers who want a low-friction, English-friendly setup' where slug = 'warung-sika' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Solo diners and first-timers after a cheap, build-your-own nasi campur lunch in an English-friendly setup';
-- expect: UPDATE 1

-- 343. W-warung-sika-not_for · warung-sika · not_for · restore before
update venues set not_for = 'diners wanting table service or a quiet sit-down dinner; anyone avoiding a busy, canteen-style room' where slug = 'warung-sika' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Table service or a quiet sit-down dinner, because the room is busy and canteen-style';
-- expect: UPDATE 1

-- 344. W-woods-bali-why_its_here · woods-bali · why_its_here · restore before
update venues set why_its_here = 'A rustic Pererenan restaurant built entirely from reclaimed wood, serving a Mediterranean menu in a warm, greenery-filled chalet setting. Cafe by day, dinner room by night, with live jazz and vinyl evenings.' where slug = 'woods-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Built entirely from reclaimed wood, Woods is a rustic Pererenan restaurant cooking a Mediterranean menu in a warm, greenery-filled chalet. It runs as a cafe by day and a dinner room by night, with live jazz and vinyl evenings.';
-- expect: UPDATE 1

-- 345. W-woods-bali-best_for · woods-bali · best_for · restore before
update venues set best_for = 'A cosy, atmospheric dinner; date night; groups who want a relaxed evening with live music.' where slug = 'woods-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cosy dinner or a date night, or a group evening with live music';
-- expect: UPDATE 1

-- 346. W-workmates-coworking-space-and-cafe-why_its_here · workmates-coworking-space-and-cafe · why_its_here · restore before
update venues set why_its_here = 'Coworking space and cafe in Canggu, part of the Wonderspace group. Desks, fast wifi and a poolside view. The kitchen does chicken parmigiana, Indonesian plates and bowls.' where slug = 'workmates-coworking-space-and-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Workmates is a coworking space and cafe in Canggu, part of the Wonderspace group. Desks and fast wifi come with a poolside view. The kitchen does chicken parmigiana, Indonesian plates and bowls.';
-- expect: UPDATE 1

-- 347. W-wrong-gym-pererenan-why_its_here · wrong-gym-pererenan · why_its_here · restore before
update venues set why_its_here = 'The Wrong Gym is an all-inclusive gym and lifestyle club on Jl. Pantai Pererenan (opened 2023) with a large outdoor training area, functional/jungle gym, fitness classes, and recovery facilities including sauna, ice bath, swimming pool, yoga and spa.' where slug = 'wrong-gym-pererenan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Opened in 2023 on Jl. Pantai Pererenan, The Wrong Gym is an all-inclusive gym and lifestyle club. It has a large outdoor training area, a functional jungle gym and fitness classes. Recovery means sauna, ice bath, pool, yoga and spa.';
-- expect: UPDATE 1

-- 348. W-wrong-gym-pererenan-best_for · wrong-gym-pererenan · best_for · restore before
update venues set best_for = 'Fitness-focused travellers and digital nomads on a longer Pererenan stay wanting a full-service gym plus classes and recovery (sauna, ice bath, spa).' where slug = 'wrong-gym-pererenan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Digital nomads and fitness-focused travellers on a longer Pererenan stay, after a full-service gym with classes and recovery';
-- expect: UPDATE 1

-- 349. W-wrong-gym-pererenan-not_for · wrong-gym-pererenan · not_for · restore before
update venues set not_for = 'Travellers wanting a budget drop-in gym or a purely passive spa visit.' where slug = 'wrong-gym-pererenan' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget drop-in or a purely passive spa visit: the club is all-inclusive and built around training';
-- expect: UPDATE 1

-- 350. W-yema-kitchen-why_its_here · yema-kitchen · why_its_here · restore before
update venues set why_its_here = 'Yema Kitchen is a café and restaurant on Jl. Tanah Barak that calls itself Mediterranean but cooks closer to North African and Levantine — tajine, couscous, pastilla, shawarma, pide — running as a café by day and a bar by night.' where slug = 'yema-kitchen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A café and restaurant on Jl. Tanah Barak, Yema Kitchen runs as a café by day and a bar by night. It calls itself Mediterranean but cooks closer to North African and Levantine: tajine, couscous, pastilla, shawarma and pide.';
-- expect: UPDATE 1

-- 351. W-yema-kitchen-best_for · yema-kitchen · best_for · restore before
update venues set best_for = 'North African and Levantine cooking — tajine, couscous, pastilla — day into night.' where slug = 'yema-kitchen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Tajine, couscous or pastilla, at the café by day or the bar by night';
-- expect: UPDATE 1

-- 352. W-yuki-canggu-why_its_here · yuki-canggu · why_its_here · restore before
update venues set why_its_here = 'A modern Japanese izakaya steps from Batu Bolong beach serving fusion sushi, wood-fired specialties and signature cocktails in a stylish yet laid-back room; bookings are essential.' where slug = 'yuki-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Steps from Batu Bolong beach, YUKI is a modern Japanese izakaya. It serves fusion sushi, wood-fired specialties and house cocktails.';
-- expect: UPDATE 1

-- 353. W-yuki-canggu-best_for · yuki-canggu · best_for · restore before
update venues set best_for = 'A stylish date night, special occasion or group dinner with cocktails.' where slug = 'yuki-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A date night, special occasion or group dinner with cocktails';
-- expect: UPDATE 1

-- 354. W-yuki-canggu-not_for · yuki-canggu · not_for · restore before
update venues set not_for = 'Not a budget or walk-in-anytime spot - reservations recommended.' where slug = 'yuki-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget meal or a walk-in at any hour: reservations are recommended';
-- expect: UPDATE 1

-- 355. W-zin-cafe-canggu-why_its_here · zin-cafe-canggu · why_its_here · restore before
update venues set why_its_here = 'An open-air bamboo cafe near Nelayan Beach that doubles as a genuinely free coworking space, with power outlets at most tables, fast wifi, a quiet upper room and in-house-roasted organic coffee.' where slug = 'zin-cafe-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'ZIN is an open-air bamboo cafe near Nelayan Beach that doubles as a free coworking space. Most tables have power outlets, the wifi is fast and there is a quiet upper room. The coffee is organic and roasted in-house.';
-- expect: UPDATE 1

-- 356. W-zin-cafe-canggu-best_for · zin-cafe-canggu · best_for · restore before
update venues set best_for = 'Digital nomads and remote workers wanting to work over breakfast and coffee; also good for a calm, healthy meal near the beach.' where slug = 'zin-cafe-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Remote workers and digital nomads working over breakfast and coffee, or a calm, healthy meal near the beach';
-- expect: UPDATE 1

-- 357. W-zin-cafe-canggu-not_for · zin-cafe-canggu · not_for · restore before
update venues set not_for = 'Anyone wanting a lively bar scene or a fully quiet fine-dining room.' where slug = 'zin-cafe-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A lively bar scene or a fully quiet fine-dining room: people come here to work';
-- expect: UPDATE 1
