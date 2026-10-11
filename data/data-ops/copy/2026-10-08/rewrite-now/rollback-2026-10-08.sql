-- wave-rewrite-now-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-amavi-canggu-bali-why_its_here · amavi-canggu-bali · why_its_here · restore before
update venues set why_its_here = 'Restaurant, bar lounge and pool on Jl. Pantai Berawa. Mediterranean concept with rice field views. The menu runs from nasi goreng and sate ayam to Angus ribeye and pizza.' where slug = 'amavi-canggu-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The menu at AMAVI goes from nasi goreng and sate ayam to Angus ribeye and pizza. It''s a restaurant and bar lounge on Jl. Pantai Berawa, run on a Mediterranean concept, with a pool and rice field views.';
-- expect: UPDATE 1

-- 2. W-cafe-coach-why_its_here · cafe-coach · why_its_here · restore before
update venues set why_its_here = 'Cafe Coach is an all-day café and wellness-coaching space on Jl. Nelayan in Canggu, known for a large breakfast-through-dinner menu — benedicts, poke bowls, burgers — plus coffee, cocktails, and hosted workshops.' where slug = 'cafe-coach' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'On Jl. Nelayan in Canggu, Cafe Coach is an all-day café that doubles as a wellness-coaching space and hosts workshops. The large menu runs from breakfast to dinner (benedicts, poke bowls, burgers), with coffee and cocktails.';
-- expect: UPDATE 1

-- 3. W-cafe-coach-best_for · cafe-coach · best_for · restore before
update venues set best_for = 'An all-day café — big breakfast menu, coffee, and dinner into cocktails.' where slug = 'cafe-coach' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Breakfast, or dinner that runs into cocktails';
-- expect: UPDATE 1

-- 4. W-mavammy-why_its_here · mavammy · why_its_here · restore before
update venues set why_its_here = 'Cafe and patisserie on Jl. Pantai Batu Bolong. All-day breakfast and a dessert counter built on Belgian chocolate. Carrot cake with mango and passion fruit, and Lotus cheesecake. Strong wifi and air conditioning.' where slug = 'mavammy' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mavammy''s dessert counter is built on Belgian chocolate, and breakfast runs all day at this café and patisserie on Jl. Pantai Batu Bolong. The cakes include carrot cake with mango and passion fruit, and a Lotus cheesecake. The wifi is strong and there''s air conditioning.';
-- expect: UPDATE 1

-- 5. W-porch-why_its_here · porch · why_its_here · restore before
update venues set why_its_here = 'Coffee shop on Jl. Raya Semat. Thirteen kinds of cheesecake are the reason to come.' where slug = 'porch' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Thirteen kinds of cheesecake are the reason to come to Porch, a coffee shop on Jl. Raya Semat.';
-- expect: UPDATE 1

-- 6. W-pranava-yoga-why_its_here · pranava-yoga · why_its_here · restore before
update venues set why_its_here = 'Yoga studio at the Matrabali guesthouse on Jl. Pantai Berawa, opened in April 2016 by Vicki and Yuni. Rates are kept below the premium Canggu studios so local residents can practise too. Classes suit every level.' where slug = 'pranava-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Vicki and Yuni opened Pranava Yoga in April 2016, at the Matrabali guesthouse on Jl. Pantai Berawa. Rates sit below the premium Canggu studios so local residents can practise too, and classes suit every level.';
-- expect: UPDATE 1

-- 7. W-mamu-ubud-cafe-shisha-hookah-why_its_here · mamu-ubud-cafe-shisha-hookah · why_its_here · restore before
update venues set why_its_here = 'Cafe and shisha lounge on Jl. Made Lebah in Mas. One of the widest shisha lists on the island, with Darkside, Musthave and Duft. Bowls, roasted vegetables, warm dips and shawarma. An air-conditioned lounge and a garden terrace.' where slug = 'mamu-ubud-cafe-shisha-hookah' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Darkside, Musthave and Duft are on the shisha list at MAMU, a café and shisha lounge on Jl. Made Lebah in Mas. The food is bowls, roasted vegetables, warm dips and shawarma, and there is an air-conditioned lounge as well as a garden terrace.';
-- expect: UPDATE 1

-- 8. W-dewas-landing-cafe-why_its_here · dewas-landing-cafe · why_its_here · restore before
update venues set why_its_here = 'Cafe on Jl. Raya Uluwatu in Pecatu. A local gathering point that runs football watch parties.' where slug = 'dewas-landing-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Dewas Landing Cafe, on Jl. Raya Uluwatu in Pecatu, is a local gathering point that runs football watch parties.';
-- expect: UPDATE 1

-- 9. W-humans-cafe-why_its_here · humans-cafe · why_its_here · restore before
update venues set why_its_here = 'Cafe on Jl. Bali Cliff in Ungasan. Asian, Indonesian and European plates with specialty coffee. There is a playground for children.' where slug = 'humans-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'HUMANS CAFE, on Jl. Bali Cliff in Ungasan, serves Asian, Indonesian and European plates with specialty coffee. There''s a playground for children.';
-- expect: UPDATE 1

-- 10. W-lemanja-uluwatu-why_its_here · lemanja-uluwatu · why_its_here · restore before
update venues set why_its_here = 'Cafe, bar and coworking space with a pool on Jl. Labuansait. Breakfast starts at 07:30, with plates from 20,000 IDR. Pan-grilled prawns and tuna tataki, vegan quesadillas and plant-based pizza. Pastries alongside the cocktail list.' where slug = 'lemanja-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Breakfast at Lemanjá Uluwatu starts at 07:30. It''s a café, bar and coworking space with a pool on Jl. Labuansait. Plates start at 20,000 IDR, and the menu runs to pan-grilled prawns, tuna tataki, vegan quesadillas and plant-based pizza, with pastries alongside the cocktails.';
-- expect: UPDATE 1

-- 11. W-made-s-bakery-cafe-playground-why_its_here · made-s-bakery-cafe-playground · why_its_here · restore before
update venues set why_its_here = 'Bakery and cafe on Jl. Dharmawangsa in Ungasan, open since 2025 after growing out of a small warung. Pastries, desserts and coffee, with breakfast served all day and large portions. The playground is free to use.' where slug = 'made-s-bakery-cafe-playground' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Made’s Bakery Cafe Playground grew out of a small warung and has been a bakery and café on Jl. Dharmawangsa in Ungasan since 2025. Expect pastries, desserts and coffee, breakfast all day in large portions, and a playground that is free to use.';
-- expect: UPDATE 1

-- 12. W-ula-cafe-why_its_here · ula-cafe · why_its_here · restore before
update venues set why_its_here = 'Cafe on Jl. Pantai Balangan. Chef Mags builds the menu from scratch, with separate breakfast and mains lists. Woven textures, ocean air and vinyl in the background. Wifi and power outlets throughout.' where slug = 'ula-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Chef Mags builds the menu from scratch at Ula Cafe on Jl. Pantai Balangan and keeps separate breakfast and mains lists. There are woven textures, ocean air and vinyl in the background, plus wifi and power outlets throughout.';
-- expect: UPDATE 1

-- 13. W-uluwatu-collective-why_its_here · uluwatu-collective · why_its_here · restore before
update venues set why_its_here = 'Gym above Pepito Express on Jl. Raya Uluwatu, high-ceilinged and open-air. CrossFit, Metcon, HIIT, weightlifting, functional training and yoga run as group classes. Access comes daily, weekly, monthly or yearly; a month is 1,450,000 IDR.' where slug = 'uluwatu-collective' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Uluwatu Collective, CrossFit, Metcon, HIIT, weightlifting, functional training and yoga run as group classes. The gym is high-ceilinged and open-air, above Pepito Express on Jl. Raya Uluwatu. Access is sold daily, weekly, monthly or yearly, and a month is 1,450,000 IDR.';
-- expect: UPDATE 1

-- 14. W-de-maison-bali-restaurant-and-bar-why_its_here · de-maison-bali-restaurant-and-bar · why_its_here · restore before
update venues set why_its_here = 'Coffee shop on Jl. Tukad Badung in Renon, Denpasar.' where slug = 'de-maison-bali-restaurant-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'De Maison Bali Restaurant & Bar, in Renon, Denpasar, is a coffee shop on Jl. Tukad Badung.';
-- expect: UPDATE 1

-- 15. W-manga-madu-best_for · manga-madu · best_for · restore before
update venues set best_for = 'budget travelers wanting classic Indonesian comfort food close to central Ubud' where slug = 'manga-madu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A budget meal of classic Indonesian comfort food close to central Ubud';
-- expect: UPDATE 1

-- 16. W-manga-madu-not_for · manga-madu · not_for · restore before
update venues set not_for = 'diners seeking a fine-dining atmosphere or an extensive wine list' where slug = 'manga-madu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A fine-dining atmosphere or an extensive wine list: this is a budget warung';
-- expect: UPDATE 1
