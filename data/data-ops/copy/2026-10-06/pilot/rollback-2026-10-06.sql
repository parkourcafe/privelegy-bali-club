-- copy-pilot-2026-10-06 — rollback for apply-2026-10-06.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-06 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. P-milk-and-madu-beach-road · milk-and-madu-beach-road · why_its_here · restore before
update venues set why_its_here = 'A spacious, palm-shaded all-day cafe on Batu Bolong beach road with a kids'' play area, brunch classics and lava-stone pizzas, part of the well-known Milk & Madu group.' where slug = 'milk-and-madu-beach-road' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An all-day cafe on Batu Bolong beach road, part of the Milk & Madu group. The room is spacious and shaded by palms, with a kids'' play area, and the kitchen does brunch classics and lava-stone pizzas.';
-- expect: UPDATE 1

-- 2. P-milk-and-madu-beach-road · milk-and-madu-beach-road · best_for · restore before
update venues set best_for = 'Families with young children and groups; brunch through to an easy early dinner, plus daily sunset sessions.' where slug = 'milk-and-madu-beach-road' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families with young children and groups, from brunch to an early dinner or the daily sunset session';
-- expect: UPDATE 1

-- 3. P-milk-and-madu-beach-road · milk-and-madu-beach-road · not_for · restore before
update venues set not_for = 'Couples seeking an intimate, quiet dining atmosphere.' where slug = 'milk-and-madu-beach-road' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Couples after a quiet, intimate dinner';
-- expect: UPDATE 1

-- 4. P-atlas-beach-club · atlas-beach-club · why_its_here · restore before
update venues set why_its_here = 'A large beachfront entertainment complex on Jl. Pantai Berawa running four venues on one site: Beach Club, Super Club, Wellness Club and a padel club. Its own site markets it as the world''s biggest beach club; we have not verified that claim. Entry is by day pass, with daybeds and sofas bookable separately.' where slug = 'atlas-beach-club' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A large beachfront complex on Jl. Pantai Berawa. It runs four venues on one site: a beach club, the Super Club, a wellness club and a padel club. Its own website calls it the world''s biggest beach club; we have not checked that. You enter on a day pass, and daybeds and sofas are booked separately.';
-- expect: UPDATE 1

-- 5. P-atlas-beach-club · atlas-beach-club · best_for · restore before
update venues set best_for = 'A big lively day out or event with a group; sunset drinks in a large party setting' where slug = 'atlas-beach-club' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A big, lively day out with a group, or sunset drinks in a party crowd';
-- expect: UPDATE 1

-- 6. P-atlas-beach-club · atlas-beach-club · not_for · restore before
update venues set not_for = 'Guests wanting a small, quiet or intimate venue' where slug = 'atlas-beach-club' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A small, quiet or intimate evening';
-- expect: UPDATE 1

-- 7. P-nook-umalas · nook-umalas · why_its_here · restore before
update venues set why_its_here = 'Long-running open-air café/restaurant set beside Umalas rice fields, serving all-day Western and Indonesian food from breakfast to late (8am–11pm). Known as a calm rice-paddy escape a short hop from Seminyak''s bustle.' where slug = 'nook-umalas' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An open-air café and restaurant beside the Umalas rice fields, open 8am to 11pm. The menu runs Western and Indonesian all day, from breakfast to late, with vegetarian, vegan and gluten-free dishes. Seminyak and its bustle are a short hop away.';
-- expect: UPDATE 1

-- 8. P-nook-umalas · nook-umalas · best_for · restore before
update venues set best_for = 'relaxed rice-field brunch or breakfast; couples/groups wanting a calm all-day meal off the strip; vegetarian/vegan and gluten-free diners' where slug = 'nook-umalas' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm breakfast or brunch looking at rice fields, for couples or a group staying off the strip';
-- expect: UPDATE 1

-- 9. P-nook-umalas · nook-umalas · not_for · restore before
update venues set not_for = 'anyone wanting a polished fine-dining or beachfront setting; nightlife seekers' where slug = 'nook-umalas' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Polished fine dining, a beachfront setting or a night out';
-- expect: UPDATE 1

-- 10. P-ji-restaurant-bali · ji-restaurant-bali · why_its_here · restore before
update venues set why_its_here = 'Japanese-contemporary dining set in a reconstructed antique temple at Hotel Tugu, right on Batu Bolong beach, with a terrace and sweeping ocean views. Sushi, Asian-fusion plates and cocktails in one of Canggu''s most atmospheric settings.' where slug = 'ji-restaurant-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Japanese-contemporary dining at Hotel Tugu, right on Batu Bolong beach. The room is a reconstructed antique temple, and the terrace looks straight at the ocean. Sushi, Asian-fusion plates and cocktails.';
-- expect: UPDATE 1

-- 11. P-ji-restaurant-bali · ji-restaurant-bali · best_for · restore before
update venues set best_for = 'Sunset dinner with a view; date night; a special occasion by the sea.' where slug = 'ji-restaurant-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sunset dinner with a view, a date, or a special occasion by the sea';
-- expect: UPDATE 1

-- 12. P-sensorium-bali · sensorium-bali · why_its_here · restore before
update venues set why_its_here = 'A daytime fusion cafe on Jl. Pantai Batu Mejan blending Australian cafe culture with Japanese-influenced flavours and minimalist design, from a chef with Australian fine-dining training.' where slug = 'sensorium-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A daytime cafe on Jl. Pantai Batu Mejan run by a chef trained in Australian fine dining. The food is Australian cafe cooking with Japanese flavours, and the room is minimalist.';
-- expect: UPDATE 1

-- 13. P-sensorium-bali · sensorium-bali · best_for · restore before
update venues set best_for = 'A brunch or lunch of fusion cafe dishes in a calm, design-led room; a laptop-friendly daytime stop.' where slug = 'sensorium-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Brunch or lunch in a calm, design-led room, or a daytime stop with a laptop';
-- expect: UPDATE 1

-- 14. P-sensorium-bali · sensorium-bali · not_for · restore before
update venues set not_for = 'Dinner or late-night dining (it runs daytime hours only).' where slug = 'sensorium-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dinner or late-night plans — it keeps daytime hours only';
-- expect: UPDATE 1

-- 15. P-fair-warung-bale · fair-warung-bale · why_its_here · restore before
update venues set why_its_here = 'A social-enterprise warung on Jalan Sriwedari (Taman Kaja) run by the Fair Future Foundation/Bali Sari Foundation, where restaurant proceeds fund free medical consultations for the local community; serves Indonesian, Asian-fusion and vegetarian dishes daily.' where slug = 'fair-warung-bale' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A ten-table warung on Jalan Sriwedari in Taman Kaja, run by the Fair Future Foundation and Bali Sari Foundation. What you pay here funds free medical consultations for local people. The menu is Indonesian, Asian-fusion and vegetarian, every day.';
-- expect: UPDATE 1

-- 16. P-fair-warung-bale · fair-warung-bale · best_for · restore before
update venues set best_for = 'Travellers wanting an easy, good-value Indonesian meal that also funds a local healthcare program; casual lunch or early dinner.' where slug = 'fair-warung-bale' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A casual lunch or early dinner that also funds free medical consultations locally';
-- expect: UPDATE 1

-- 17. P-fair-warung-bale · fair-warung-bale · not_for · restore before
update venues set not_for = 'Diners seeking upscale fine dining or a view/sunset setting (a simple, ten-table warung).' where slug = 'fair-warung-bale' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Upscale dining or a sunset view. It is a simple ten-table warung';
-- expect: UPDATE 1

-- 18. P-warung-mendez · warung-mendez · why_its_here · restore before
update venues set why_its_here = 'A small warung tucked in Penestanan village northwest of central Ubud, run by an all-women kitchen team, serving Indonesian and Javanese-influenced dishes with an MSG-free, low-plastic ethos.' where slug = 'warung-mendez' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A small warung in Penestanan village, northwest of central Ubud, with an all-women kitchen team. The cooking is Indonesian and Javanese, made without MSG and with little plastic.';
-- expect: UPDATE 1

-- 19. P-warung-mendez · warung-mendez · best_for · restore before
update venues set best_for = 'travelers wanting a quiet, home-style Indonesian meal off the main Ubud strip in Penestanan' where slug = 'warung-mendez' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A quiet, home-style Indonesian meal away from the main Ubud strip';
-- expect: UPDATE 1

-- 20. P-warung-mendez · warung-mendez · not_for · restore before
update venues set not_for = 'those wanting a central, easy-to-find location right in town' where slug = 'warung-mendez' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick stop in the centre of town; Penestanan takes finding';
-- expect: UPDATE 1

-- 21. P-wulan-vegetarian-warung · wulan-vegetarian-warung · why_its_here · restore before
update venues set why_its_here = 'A small, hole-in-the-wall all-vegan warung in the Peliatan area of Ubud, cash-only, serving an Indonesian menu of nasi goreng, tempeh, smoothies, and vegan sweets at very low prices.' where slug = 'wulan-vegetarian-warung' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A small all-vegan warung in Peliatan, Ubud, with floor-cushion seating and cash only. The menu is Indonesian: nasi goreng, tempeh, smoothies and vegan sweets, at very low prices.';
-- expect: UPDATE 1

-- 22. P-wulan-vegetarian-warung · wulan-vegetarian-warung · best_for · restore before
update venues set best_for = 'budget-conscious vegan and vegetarian travelers wanting simple, authentic Indonesian dishes' where slug = 'wulan-vegetarian-warung' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Vegan or vegetarian travellers on a budget who want simple Indonesian food';
-- expect: UPDATE 1

-- 23. P-wulan-vegetarian-warung · wulan-vegetarian-warung · not_for · restore before
update venues set not_for = 'diners wanting to pay by card or a polished sit-down setting — it''s cash-only, floor-cushion seating' where slug = 'wulan-vegetarian-warung' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Card payments or a table and chairs: it is cash only, with floor cushions';
-- expect: UPDATE 1

-- 24. P-bali-buda-ubud · bali-buda-ubud · why_its_here · restore before
update venues set why_its_here = 'Long-running Bali wholefoods institution (operating in Ubud since 1994) combining an organic grocery/bakery with an all-day restaurant covering raw vegan, Italian, and traditional Indonesian dishes.' where slug = 'bali-buda-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An organic grocery and bakery with an all-day restaurant attached, in Ubud since 1994. The kitchen covers raw vegan, Italian and traditional Indonesian dishes.';
-- expect: UPDATE 1

-- 25. P-bali-buda-ubud · bali-buda-ubud · best_for · restore before
update venues set best_for = 'Health-conscious travelers, longer-stay visitors, and mixed groups wanting a big menu with vegetarian, vegan, and gluten-free options (including Bali''s only gluten-free pizza base) in one place.' where slug = 'bali-buda-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A long stay or a mixed group that needs one big menu with vegetarian, vegan and gluten-free choices';
-- expect: UPDATE 1

-- 26. P-bali-buda-ubud · bali-buda-ubud · not_for · restore before
update venues set not_for = 'Travelers seeking an intimate fine-dining or special-occasion setting — it''s a casual, functional health-food restaurant and shop.' where slug = 'bali-buda-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A special occasion or an intimate dinner, because it is a casual health-food restaurant and shop';
-- expect: UPDATE 1

-- 27. P-kilig-bali · kilig-bali · why_its_here · restore before
update venues set why_its_here = 'A Filipino warung in Peliatan set in a bamboo hut with rice-field views, cooking home-style Filipino comfort food. It stands out as a dedicated Filipino kitchen in an area dominated by Balinese and Western menus.' where slug = 'kilig-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Filipino warung in Peliatan, in a bamboo hut looking over rice fields. The cooking is home-style Filipino comfort food, in an area where the menus are otherwise Balinese and Western.';
-- expect: UPDATE 1

-- 28. P-kilig-bali · kilig-bali · best_for · restore before
update venues set best_for = 'filipino comfort food; calm rice-field setting; shared table meals; family dinner' where slug = 'kilig-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Filipino comfort food at a shared table, or a calm family dinner looking over rice fields';
-- expect: UPDATE 1

-- 29. P-kilig-bali · kilig-bali · not_for · restore before
update venues set not_for = 'a quick central-Ubud stop given the Peliatan location; anyone avoiding rich, pork-forward dishes' where slug = 'kilig-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick stop from central Ubud, or anyone avoiding rich, pork-heavy dishes';
-- expect: UPDATE 1
