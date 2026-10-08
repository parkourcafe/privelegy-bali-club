-- wave-ubud-north-east-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-8lements-spa-saranam-why_its_here · 8lements-spa-saranam · why_its_here · restore before
update venues set why_its_here = 'The spa at HOMM Saranam in the Bedugul highlands, run under Banyan Group''s 8LEMENTS wellness brand with Banyan Tree Academy-trained therapists, set on a rooftop overlooking rice terraces and mountains. Open to non-guests.' where slug = '8lements-spa-saranam' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A rooftop spa at HOMM Saranam in the Bedugul highlands, looking out over rice terraces and mountains. It runs under Banyan Group''s 8LEMENTS wellness brand, with therapists trained at the Banyan Tree Academy. Non-guests are welcome.';
-- expect: UPDATE 1

-- 2. W-8lements-spa-saranam-best_for · 8lements-spa-saranam · best_for · restore before
update venues set best_for = 'A highland spa session with a rice-terrace view, on a Bedugul or North Bali day trip.' where slug = '8lements-spa-saranam' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A highland spa session with a rice-terrace view on a Bedugul or North Bali day trip';
-- expect: UPDATE 1

-- 3. W-air-terjun-tegenungan-why_its_here · air-terjun-tegenungan · why_its_here · restore before
update venues set why_its_here = 'A waterfall about 10 kilometres outside Ubud, next to Tegenungan village, Gianyar — big falls with steps down, one of the easiest waterfalls on the island to reach.' where slug = 'air-terjun-tegenungan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A big waterfall beside Tegenungan village in Gianyar, about 10 kilometres outside Ubud. It is easy to reach, and steps take you down to the falls.';
-- expect: UPDATE 1

-- 4. W-air-terjun-tegenungan-best_for · air-terjun-tegenungan · best_for · restore before
update venues set best_for = 'an easy waterfall stop near Ubud; travellers who want falls without a trek' where slug = 'air-terjun-tegenungan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A waterfall stop near Ubud for anyone who wants falls without a trek';
-- expect: UPDATE 1

-- 5. W-akar-ubud-why_its_here · akar-ubud · why_its_here · restore before
update venues set why_its_here = 'A jungle-setting restaurant north of Ubud with a clear breakfast-and-dinner decision and a special-occasion atmosphere.' where slug = 'akar-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Akar is a jungle restaurant at Kedisan in Tegallalang, north of Ubud. It does breakfast and dinner, and the setting suits a special occasion.';
-- expect: UPDATE 1

-- 6. W-akar-ubud-best_for · akar-ubud · best_for · restore before
update venues set best_for = 'Travellers looking for jungle views and a destination dinner.' where slug = 'akar-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A destination dinner with jungle views';
-- expect: UPDATE 1

-- 7. W-akar-ubud-not_for · akar-ubud · not_for · restore before
update venues set not_for = 'People wanting a central Ubud walk-in lunch.' where slug = 'akar-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A walk-in lunch while you are in central Ubud, because it is out of town to the north';
-- expect: UPDATE 1

-- 8. W-alchemy-why_its_here · alchemy · why_its_here · restore before
update venues set why_its_here = 'Ubud''s clearest dietary-first breakfast — a fully plant-based, gluten-free menu with a customisable raw breakfast bar and transparent pricing.' where slug = 'alchemy' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Alchemy is a breakfast spot in Penestanan where the whole menu is plant-based and gluten-free. At the raw breakfast bar you choose what goes on your plate, and the prices are clear before you order.';
-- expect: UPDATE 1

-- 9. W-alchemy-best_for · alchemy · best_for · restore before
update venues set best_for = 'Plant-based and gluten-free diners; a post-yoga breakfast; a customisable healthy start; off-peak laptop time' where slug = 'alchemy' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A plant-based, gluten-free meal, a breakfast after yoga, or laptop time off-peak';
-- expect: UPDATE 1

-- 10. W-alchemy-yoga-and-meditation-center-ubud-why_its_here · alchemy-yoga-and-meditation-center-ubud · why_its_here · restore before
update venues set why_its_here = 'A Penestanan yoga and meditation centre rooted in tantra and Hatha yoga, with a full daily class menu, meditation, sound healing and a weekly ecstatic-dance night; affiliated with the well-known Alchemy raw-vegan cafe next door.' where slug = 'alchemy-yoga-and-meditation-center-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Penestanan centre for yoga and meditation, with its roots in tantra and Hatha yoga. There is a full timetable of classes every day, plus meditation, sound healing and a weekly ecstatic-dance night. It is affiliated with the Alchemy raw-vegan cafe next door.';
-- expect: UPDATE 1

-- 11. W-alchemy-yoga-and-meditation-center-ubud-best_for · alchemy-yoga-and-meditation-center-ubud · best_for · restore before
update venues set best_for = 'Practitioners drawn to tantra-influenced yoga, meditation and community events like ecstatic dance, with a plant-based meal next door.' where slug = 'alchemy-yoga-and-meditation-center-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Practitioners drawn to tantra-influenced yoga and community events like ecstatic dance, with a plant-based meal next door';
-- expect: UPDATE 1

-- 12. W-alchemy-yoga-meditation-center-why_its_here · alchemy-yoga-meditation-center · why_its_here · restore before
update venues set why_its_here = 'A yoga and meditation centre in Penestanan, Ubud with two bamboo shalas, running daily drop-in classes across Hatha and Tantra vinyasa, Yin, meditation, ecstatic dance and sound-healing ceremonies, plus multi-class passes and Yoga Alliance 200hr and 300hr teacher trainings.' where slug = 'alchemy-yoga-meditation-center' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This yoga and meditation centre in Penestanan teaches in two bamboo shalas. Drop-in classes run every day across Hatha and Tantra vinyasa, Yin, meditation, ecstatic dance and sound-healing ceremonies. There are multi-class passes and Yoga Alliance teacher trainings at 200hr and 300hr.';
-- expect: UPDATE 1

-- 13. W-alchemy-yoga-meditation-center-best_for · alchemy-yoga-meditation-center · best_for · restore before
update venues set best_for = 'drop-in practitioners staying in Ubud or Penestanan; travellers wanting a varied daily class schedule without committing to a retreat; those interested in meditation, sound healing or teacher training' where slug = 'alchemy-yoga-meditation-center' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Drop-in practitioners staying in Ubud or Penestanan who want a varied daily schedule without committing to a retreat';
-- expect: UPDATE 1

-- 14. W-alchemy-yoga-meditation-center-not_for · alchemy-yoga-meditation-center · not_for · restore before
update venues set not_for = 'anyone after a gym-style or purely fitness workout; visitors wanting a beach or nightlife scene' where slug = 'alchemy-yoga-meditation-center' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A gym-style fitness workout or a beach and nightlife scene. This is yoga and meditation in Penestanan';
-- expect: UPDATE 1

-- 15. W-anomali-coffee-ubud-why_its_here · anomali-coffee-ubud · why_its_here · restore before
update venues set why_its_here = 'An Indonesian specialty-coffee roaster founded in Jakarta in 2007, now with outlets across Indonesia; its Ubud cafe pours single-origin beans sourced from across the archipelago with a rotating regional-origin selection.' where slug = 'anomali-coffee-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Jalan Raya Ubud café of Anomali, an Indonesian specialty-coffee roaster founded in Jakarta in 2007 that now has outlets across Indonesia. Its single-origin beans come from all over the archipelago, and the regions on offer rotate.';
-- expect: UPDATE 1

-- 16. W-anomali-coffee-ubud-best_for · anomali-coffee-ubud · best_for · restore before
update venues set best_for = 'Coffee-focused travelers who want to compare Indonesian single-origin beans (Aceh, Bali, Toraja, Java) in one sitting, plus casual all-day breakfast.' where slug = 'anomali-coffee-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Comparing single origins from Aceh, Bali, Toraja and Java in one sitting, or a casual all-day breakfast';
-- expect: UPDATE 1

-- 17. W-anomali-coffee-ubud-not_for · anomali-coffee-ubud · not_for · restore before
update venues set not_for = 'Travelers wanting a jungle or rice-field view setting — this is a street-front, town-café atmosphere on Jalan Raya Ubud.' where slug = 'anomali-coffee-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A jungle or rice-field view, because this is a street-front café in town';
-- expect: UPDATE 1

-- 18. W-bali-barber-ubud-why_its_here · bali-barber-ubud · why_its_here · restore before
update venues set why_its_here = 'Bali Barber''s central-Ubud shop, where men can get a proper cut, beard work or a traditional hot-towel shave.' where slug = 'bali-barber-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Barber''s shop in central Ubud, where men can walk in for a cut, beard work or a traditional hot-towel shave.';
-- expect: UPDATE 1

-- 19. W-bali-barber-ubud-best_for · bali-barber-ubud · best_for · restore before
update venues set best_for = 'Men wanting a reliable walk-in barber in central Ubud.' where slug = 'bali-barber-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A men''s cut or shave in central Ubud without booking ahead';
-- expect: UPDATE 1

-- 20. W-bali-bohemia-why_its_here · bali-bohemia · why_its_here · restore before
update venues set why_its_here = 'A boutique-hotel restaurant and bakery next to the Sacred Monkey Forest Sanctuary, built around fresh, wholesome East-Mediterranean-inspired cooking with a plant-forward focus, plus a standalone bakery arm and live-music evenings.' where slug = 'bali-bohemia' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A boutique hotel''s restaurant and bakery beside the Sacred Monkey Forest Sanctuary. The cooking is East-Mediterranean in style and leans plant-forward. The bakery also runs on its own, and some evenings have live music.';
-- expect: UPDATE 1

-- 21. W-bali-bohemia-best_for · bali-bohemia · best_for · restore before
update venues set best_for = 'Health-conscious travellers wanting a plant-forward breakfast, bakery pastries, or a relaxed dinner with live music in a colourful, creative setting.' where slug = 'bali-bohemia' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A plant-forward breakfast, bakery pastries, or dinner with live music in a colourful, creative setting';
-- expect: UPDATE 1

-- 22. W-bali-bohemia-not_for · bali-bohemia · not_for · restore before
update venues set not_for = 'Guests wanting a strictly local Balinese/Indonesian menu or a quiet, music-free dinner.' where slug = 'bali-bohemia' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A strictly Balinese or Indonesian menu, or a quiet dinner: the food is East-Mediterranean and some evenings have live music';
-- expect: UPDATE 1

-- 23. W-bali-botanica-spa-why_its_here · bali-botanica-spa · why_its_here · restore before
update venues set why_its_here = 'Day spa established in 2006 on the Sanggingan ridge overlooking jungle and rice fields; relaunched in 2024 under Oneworld Ayurveda as an Ayurvedic day spa combining Balinese and Ayurvedic treatments and programs.' where slug = 'bali-botanica-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Ayurvedic day spa on the Sanggingan ridge that looks over jungle and rice fields. It opened in 2006, and in 2024 it was relaunched under Oneworld Ayurveda with Balinese and Ayurvedic treatments and programs.';
-- expect: UPDATE 1

-- 24. W-bali-botanica-spa-best_for · bali-botanica-spa · best_for · restore before
update venues set best_for = 'Travellers wanting Ayurvedic treatments or day programs in a jungle-and-rice-field setting on the Sanggingan side of Ubud.' where slug = 'bali-botanica-spa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Ayurvedic treatments or a day program on the Sanggingan side of Ubud, with jungle and rice-field views';
-- expect: UPDATE 1

-- 25. W-bebek-bengil-why_its_here · bebek-bengil · why_its_here · restore before
update venues set why_its_here = 'The Ubud restaurant that popularised Balinese-style crispy duck, open since 1990, set among rice-paddy garden pavilions. The duck is steamed in Indonesian spices then deep-fried until the skin crackles while the meat stays tender.' where slug = 'bebek-bengil' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bebek Bengil is a duck restaurant in Ubud, open since 1990, with dining pavilions in a rice-paddy garden. Its Balinese-style crispy duck is steamed in Indonesian spices, then deep-fried until the skin crackles and the meat stays tender.';
-- expect: UPDATE 1

-- 26. W-bebek-bengil-best_for · bebek-bengil · best_for · restore before
update venues set best_for = 'first taste of balinese crispy duck; rice-paddy garden dinner; groups sharing regional dishes; visitors near monkey forest' where slug = 'bebek-bengil' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A first taste of Balinese crispy duck, or a group dinner of shared regional dishes near the Monkey Forest';
-- expect: UPDATE 1

-- 27. W-bebek-bengil-not_for · bebek-bengil · not_for · restore before
update venues set not_for = 'diners who want a quiet hidden local warung; vegetarians, since the menu centres on duck and meat' where slug = 'bebek-bengil' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Vegetarians, since the menu centres on duck and meat, or anyone looking for a quiet local warung';
-- expect: UPDATE 1

-- 28. W-big-dragon-villas-ubud-why_its_here · big-dragon-villas-ubud · why_its_here · restore before
update venues set why_its_here = 'A boutique villa retreat in the rice paddies at Pejeng near Tampaksiring, a short drive from central Ubud, with 17 rooms and suites set around an infinity pool. Opened in 2025.' where slug = 'big-dragon-villas-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A boutique villa property in the rice paddies at Pejeng, near Tampaksiring, opened in 2025. Its 17 rooms and suites sit around an infinity pool, and central Ubud is a short drive away.';
-- expect: UPDATE 1

-- 29. W-big-dragon-villas-ubud-best_for · big-dragon-villas-ubud · best_for · restore before
update venues set best_for = 'A quiet, nature-facing stay near Ubud with pool and rice-field views, away from the town centre.' where slug = 'big-dragon-villas-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A quiet stay away from the centre of Ubud, with views over the pool and rice fields';
-- expect: UPDATE 1

-- 30. W-cafe-wayan-and-bakery-why_its_here · cafe-wayan-and-bakery · why_its_here · restore before
update venues set why_its_here = 'Established in 1986 on Monkey Forest Road, a long-running Ubud institution with a bakery out front and a rice-paddy-view garden behind, serving a wide Indonesian/Thai/Italian menu plus a Sunday-evening traditional Balinese buffet.' where slug = 'cafe-wayan-and-bakery' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Open since 1986 on Monkey Forest Road, this restaurant has a bakery out front and a garden behind that looks over rice paddies. The menu is wide, running across Indonesian, Thai and Italian, and Sunday evenings bring a traditional Balinese buffet.';
-- expect: UPDATE 1

-- 31. W-cafe-wayan-and-bakery-best_for · cafe-wayan-and-bakery · best_for · restore before
update venues set best_for = 'Groups or families wanting an easy, established garden restaurant with a broad menu and a well-known dessert to share.' where slug = 'cafe-wayan-and-bakery' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Groups or families after a garden meal with a broad menu and a dessert to share';
-- expect: UPDATE 1

-- 32. W-cafe-wayan-and-bakery-not_for · cafe-wayan-and-bakery · not_for · restore before
update venues set not_for = 'Diners seeking a quiet, intimate table (it''s a large, high-turnover tourist institution).' where slug = 'cafe-wayan-and-bakery' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, intimate table: it is a large place with a fast turnover of tourists';
-- expect: UPDATE 1

-- 33. W-cantika-zest-why_its_here · cantika-zest · why_its_here · restore before
update venues set why_its_here = 'Streamside jungle spa at the edge of Penestanan village that makes and uses its own organic, garden-sourced skincare products across massage, facials, scrubs and outdoor flower baths, with a garden tour option.' where slug = 'cantika-zest' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A jungle spa beside a stream on the edge of Penestanan village. It makes its own organic skincare from garden-sourced ingredients and uses it for massages, facials, scrubs and outdoor flower baths. A garden tour is also an option.';
-- expect: UPDATE 1

-- 34. W-cantika-zest-best_for · cantika-zest · best_for · restore before
update venues set best_for = 'Eco-minded travellers who want natural, organic products in a quiet Penestanan garden setting.' where slug = 'cantika-zest' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A treatment with natural, organic products in a quiet Penestanan garden';
-- expect: UPDATE 1

-- 35. W-casa-luna-why_its_here · casa-luna · why_its_here · restore before
update venues set why_its_here = 'Ubud''s most enduring restaurant, opened in 1992 by food writer Janet DeNeefe on Jalan Raya Ubud; the menu moves between authentic Balinese cuisine (nasi campur, ceremonial curries, slow-cooked spice-paste dishes) and a modern Mediterranean side, with pastries from the sister Honeymoon Bakery.' where slug = 'casa-luna' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Food writer Janet DeNeefe opened this restaurant on Jalan Raya Ubud in 1992. The menu moves between Balinese cooking, from nasi campur to ceremonial curries and slow-cooked spice-paste dishes, and a modern Mediterranean side. Pastries come from Honeymoon Bakery, its sister business.';
-- expect: UPDATE 1

-- 36. W-casa-luna-best_for · casa-luna · best_for · restore before
update venues set best_for = 'Travellers wanting a genuine, long-established Balinese dining experience in the centre of Ubud, from breakfast through dinner.' where slug = 'casa-luna' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese meal in central Ubud, from breakfast through to dinner';
-- expect: UPDATE 1

-- 37. W-casa-luna-not_for · casa-luna · not_for · restore before
update venues set not_for = 'Very budget-conscious travellers looking for street-warung prices (a well-known, mid-range destination restaurant).' where slug = 'casa-luna' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A meal at street-warung prices, because this is a mid-range destination restaurant';
-- expect: UPDATE 1

-- 38. W-cascades-why_its_here · cascades · why_its_here · restore before
update venues set why_its_here = 'The gourmet restaurant of Viceroy Bali (also branded as part of CasCades Suites), perched atop the Valley of the Kings about five minutes'' drive from central Ubud, pairing panoramic jungle-valley views with a Balinese Rijsttafel tasting menu and Western dishes built on produce from its own organic gardens.' where slug = 'cascades' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Viceroy Bali''s restaurant, also branded as part of CasCades Suites, sits above the Valley of the Kings with jungle views. Central Ubud is about five minutes'' drive away. The kitchen does a Balinese Rijsttafel tasting menu and Western dishes, with produce from its own organic gardens.';
-- expect: UPDATE 1

-- 39. W-cascades-best_for · cascades · best_for · restore before
update venues set best_for = 'Couples or small groups wanting a scenic, sit-down valley-view meal with a curated Indonesian tasting format.' where slug = 'cascades' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples or a small group sitting down to the Indonesian tasting menu with a valley view';
-- expect: UPDATE 1

-- 40. W-cascades-not_for · cascades · not_for · restore before
update venues set not_for = 'Travellers without their own transport looking for a walk-in meal in central Ubud, or budget diners.' where slug = 'cascades' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Budget diners, or anyone without their own transport hoping to walk in from central Ubud: it is a five-minute drive out';
-- expect: UPDATE 1

-- 41. W-clear-cafe-why_its_here · clear-cafe · why_its_here · restore before
update venues set why_its_here = 'A long-running healthy and international café on Hanoman with a clear wellness angle.' where slug = 'clear-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Healthy, international food with a wellness focus, at a café on Jl. Hanoman in central Ubud.';
-- expect: UPDATE 1

-- 42. W-clear-cafe-best_for · clear-cafe · best_for · restore before
update venues set best_for = 'Healthy casual meals and café time in central Ubud.' where slug = 'clear-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A healthy, casual meal or time at a café table';
-- expect: UPDATE 1

-- 43. W-clear-cafe-not_for · clear-cafe · not_for · restore before
update venues set not_for = 'People seeking a formal fine-dining experience.' where slug = 'clear-cafe' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Formal fine dining. This is a casual café';
-- expect: UPDATE 1

-- 44. W-coco-nails-ubud-why_its_here · coco-nails-ubud · why_its_here · restore before
update venues set why_its_here = 'An Ubud nail salon offering manicures, pedicures and nail art in a central location.' where slug = 'coco-nails-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Manicures, pedicures and nail art at an Ubud nail salon in a central location.';
-- expect: UPDATE 1

-- 45. W-coco-nails-ubud-best_for · coco-nails-ubud · best_for · restore before
update venues set best_for = 'A quick, well-priced mani-pedi between Ubud''s shops and cafés.' where slug = 'coco-nails-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A quick mani-pedi between Ubud''s shops and cafés';
-- expect: UPDATE 1

-- 46. W-como-shambhala-at-como-uma-ubud-yoga-ubud-best_for · como-shambhala-at-como-uma-ubud-yoga-ubud · best_for · restore before
update venues set best_for = 'Guests and visitors wanting refined, resort-level yoga above the valley.' where slug = 'como-shambhala-at-como-uma-ubud-yoga-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A resort yoga class above the valley, for guests and visitors alike';
-- expect: UPDATE 1

-- 47. W-como-uma-ubud-fitness-why_its_here · como-uma-ubud-fitness · why_its_here · restore before
update venues set why_its_here = 'The fitness centre at COMO Uma Ubud, fitted with current cardio and strength machines and backed by the COMO Shambhala wellness programme. A resident fitness instructor builds private sessions for any level, from beginner upward. The same wellness area holds an open-air yoga pavilion, steam rooms and a 25-metre pool.' where slug = 'como-uma-ubud-fitness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'COMO Uma Ubud''s fitness centre has current cardio and strength machines, with the COMO Shambhala wellness programme behind it. A resident instructor builds private sessions for any level. In the same wellness area are an open-air yoga pavilion, steam rooms and a 25-metre pool.';
-- expect: UPDATE 1

-- 48. W-como-uma-ubud-fitness-best_for · como-uma-ubud-fitness · best_for · restore before
update venues set best_for = 'Guests in Ubud who want machine-based training with a resident instructor, alongside a jungle-facing yoga pavilion.' where slug = 'como-uma-ubud-fitness' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Guests in Ubud who want machine-based training with a resident instructor, alongside a jungle-facing yoga pavilion';
-- expect: UPDATE 1

-- 49. W-dala-spa-beauty-at-alaya-ubud-ubud-best_for · dala-spa-beauty-at-alaya-ubud-ubud · best_for · restore before
update venues set best_for = 'Resort visitors wanting salon-and-beauty treatments alongside a spa day.' where slug = 'dala-spa-beauty-at-alaya-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A salon or beauty treatment added to a spa day at the resort';
-- expect: UPDATE 1

-- 50. W-dicarik-warung-why_its_here · dicarik-warung · why_its_here · restore before
update venues set why_its_here = 'A rice-field-walk warung on Jl. Kajeng (Subak Juwuk Manis) north of central Ubud, run by a mother-daughter team, known primarily for its hands-on Balinese cooking class (garden spice ID, 7 dishes + 2 drinks) alongside a la carte Balinese food such as betutu bebek.' where slug = 'dicarik-warung' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A warung on Jl. Kajeng, on the rice-field walk north of central Ubud, run by a mother-daughter team. The hands-on Balinese cooking class teaches the garden spices, then 7 dishes and 2 drinks. There is à la carte Balinese food too, such as betutu bebek.';
-- expect: UPDATE 1

-- 51. W-dicarik-warung-best_for · dicarik-warung · best_for · restore before
update venues set best_for = 'travelers wanting a hands-on Balinese cooking class amid rice fields, or pre-ordered betutu bebek' where slug = 'dicarik-warung' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A hands-on Balinese cooking class among the rice fields, or betutu bebek ordered ahead';
-- expect: UPDATE 1

-- 52. W-dicarik-warung-not_for · dicarik-warung · not_for · restore before
update venues set not_for = 'those wanting walk-in a-la-carte dining without any advance notice' where slug = 'dicarik-warung' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A walk-in à la carte meal, because dishes like betutu bebek are ordered in advance';
-- expect: UPDATE 1

-- 53. W-donna-ubud-why_its_here · donna-ubud · why_its_here · restore before
update venues set why_its_here = 'A restaurant, lounge and rooftop bar in the middle of Jalan Monkey Forest blending Mediterranean and Latin American cuisine, open daily from late morning until late, with a Friday-night club upstairs and shisha available after 4pm.' where slug = 'donna-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In the middle of Jalan Monkey Forest, Donna is a restaurant, lounge and rooftop bar with a Mediterranean and Latin American menu. It opens daily from late morning until late. Shisha is served after 4pm, and the upstairs becomes a club on Friday nights.';
-- expect: UPDATE 1

-- 54. W-donna-ubud-best_for · donna-ubud · best_for · restore before
update venues set best_for = 'Groups or couples wanting a stylish dinner with cocktails and a lively nightlife atmosphere in central Ubud.' where slug = 'donna-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Groups or couples after dinner and cocktails that turn into a lively night out in central Ubud';
-- expect: UPDATE 1

-- 55. W-donna-ubud-not_for · donna-ubud · not_for · restore before
update venues set not_for = 'Guests wanting a quiet, early, low-key dinner (the venue turns into a nightclub on Friday nights).' where slug = 'donna-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, early, low-key dinner: on Friday nights the venue turns into a nightclub';
-- expect: UPDATE 1

-- 56. W-four-seasons-resort-bali-at-sayan-fitness-why_its_here · four-seasons-resort-bali-at-sayan-fitness · why_its_here · restore before
update venues set why_its_here = 'The Fitness Hub at Four Seasons Resort Bali at Sayan, a 536 sq m facility set high above the Ayung River with jungle views. Complimentary for guests, it holds a 75 sq m gym with Life Fitness and Prima Fit equipment, three private studios with trainers, a pilates studio with reformers, rings, weights and spine barrel, and a recovery room with ice bath, steam room, sauna, an infrared zero-gravity lounger and a PEMF mat. Locker rooms have steam and sauna, and a Fit Bar serves the floor.' where slug = 'four-seasons-resort-bali-at-sayan-fitness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Fitness Hub at Four Seasons Sayan, high above the Ayung River, is free for resort guests. Beyond the gym there are three private studios with trainers and a reformer pilates studio. The recovery room has an ice bath, a sauna and a steam room.';
-- expect: UPDATE 1

-- 57. W-four-seasons-resort-bali-at-sayan-fitness-best_for · four-seasons-resort-bali-at-sayan-fitness · best_for · restore before
update venues set best_for = 'Ubud-valley guests who want a full training and recovery set-up, from reformer pilates to ice bath, without leaving the resort.' where slug = 'four-seasons-resort-bali-at-sayan-fitness' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Guests who want a full training and recovery set-up, from reformer pilates to an ice bath, without leaving the resort';
-- expect: UPDATE 1

-- 58. W-gajah-putih-ubud-why_its_here · gajah-putih-ubud · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Ubud. The kitchen is described as modern gourmet cuisine. The published menu runs to 8 priced items — Pairing Alcohol Malam/Lingkaran, Pairing Non Alcohol Malam/Lingkaran and Pairing Wine Malam. Pairing Wine Malam is 400K IDR. Booking is on the venue''s own site.' where slug = 'gajah-putih-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Ubud restaurant whose cooking is billed as modern gourmet cuisine. Its published menu lists 8 priced items, including alcohol, non-alcohol and wine pairings; Pairing Wine Malam is 400K IDR. Booking is on the restaurant''s own website.';
-- expect: UPDATE 1

-- 59. W-gajah-putih-ubud-best_for · gajah-putih-ubud · best_for · restore before
update venues set best_for = 'A special-occasion dinner, not a quick casual meal.' where slug = 'gajah-putih-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special-occasion dinner';
-- expect: UPDATE 1

-- 60. W-gajah-putih-ubud-not_for · gajah-putih-ubud · not_for · restore before
update venues set not_for = 'A cheap casual meal — the menu starts at 400K IDR.' where slug = 'gajah-putih-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A cheap casual meal';
-- expect: UPDATE 1

-- 61. W-gelato-secrets-ubud-why_its_here · gelato-secrets-ubud · why_its_here · restore before
update venues set why_its_here = 'Artisanal Italian gelato brand that opened its first Bali shop in Ubud in 2009, making fresh daily gelato/sorbetto from all-natural ingredients, including Indonesian-inspired flavors like black rice and coconut pandan.' where slug = 'gelato-secrets-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Gelato Secrets is an Italian gelato brand that opened its shop in Ubud in 2009. The gelato and sorbetto are made fresh every day from all-natural ingredients. Some flavours are Indonesian-inspired, such as black rice and coconut pandan.';
-- expect: UPDATE 1

-- 62. W-gelato-secrets-ubud-best_for · gelato-secrets-ubud · best_for · restore before
update venues set best_for = 'A dessert or cool-down stop for families and travelers after sightseeing (e.g., near Monkey Forest / Jalan Raya Ubud).' where slug = 'gelato-secrets-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cool-down dessert after sightseeing, for families and everyone else, for example near Monkey Forest or Jalan Raya Ubud';
-- expect: UPDATE 1

-- 63. W-heart-space-bali-why_its_here · heart-space-bali · why_its_here · restore before
update venues set why_its_here = 'A calm, holistic studio at the Pengosekan/Nyuh Kuning corner specialising in slower, restorative practice, sound and Balinese healing.' where slug = 'heart-space-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A calm, holistic studio on the corner where Pengosekan meets Nyuh Kuning. It specialises in slower, restorative practice, sound and Balinese healing.';
-- expect: UPDATE 1

-- 64. W-heart-space-bali-best_for · heart-space-bali · best_for · restore before
update venues set best_for = 'Those wanting gentle Yin and restorative yoga, sound baths and cacao or healing ceremonies rather than a vigorous flow.' where slug = 'heart-space-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Gentle Yin and restorative yoga, sound baths, or a cacao or healing ceremony';
-- expect: UPDATE 1

-- 65. W-heart-space-bali-not_for · heart-space-bali · not_for · restore before
update venues set not_for = 'Practitioners after a strong, athletic or heated class.' where slug = 'heart-space-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A strong, athletic or heated class, because the practice here is slow and restorative';
-- expect: UPDATE 1

-- 66. W-hujan-locale-why_its_here · hujan-locale · why_its_here · restore before
update venues set why_its_here = 'A modern Indonesian restaurant in Ubud Center by chef Will Meyrick, housed in a stylishly renovated two-story building (bar downstairs, dining room with temple and street views upstairs), reworking street-food flavours from Java, Sumatra, Sulawesi and Bali with modern presentation and locally sourced ingredients.' where slug = 'hujan-locale' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Will Meyrick''s modern Indonesian restaurant in central Ubud, in a renovated two-storey building. The bar is downstairs; upstairs, the dining room looks over a temple and the street. The kitchen reworks street-food flavours from Java, Sumatra, Sulawesi and Bali with local ingredients and modern presentation.';
-- expect: UPDATE 1

-- 67. W-hujan-locale-best_for · hujan-locale · best_for · restore before
update venues set best_for = 'Travellers wanting an elevated, chef-driven take on Indonesian regional cooking for a dinner or shared meal.' where slug = 'hujan-locale' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A dinner or shared meal of chef-driven Indonesian regional cooking';
-- expect: UPDATE 1

-- 68. W-hujan-locale-not_for · hujan-locale · not_for · restore before
update venues set not_for = 'Diners wanting a cheap, no-frills traditional warung experience.' where slug = 'hujan-locale' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A cheap, no-frills warung meal: this is a chef''s restaurant';
-- expect: UPDATE 1

-- 69. W-ibu-rai-why_its_here · ibu-rai · why_its_here · restore before
update venues set why_its_here = 'A long-running restaurant and gallery on Jalan Monkey Forest founded by the family of Ibu Rai (born 1925, who ran a food stall near Ubud Palace); opened as a restaurant in 1992 and now serves a fusion of Indonesian specialties and European dishes in a central, art-filled setting.' where slug = 'ibu-rai' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ibu Rai, born in 1925, ran a food stall near Ubud Palace; her family founded this restaurant and gallery on Jalan Monkey Forest. It opened as a restaurant in 1992, and Indonesian specialties share the menu with European dishes in a room full of art.';
-- expect: UPDATE 1

-- 70. W-ibu-rai-best_for · ibu-rai · best_for · restore before
update venues set best_for = 'Travellers wanting an easy, centrally located sit-down meal that mixes Indonesian classics with familiar European comfort dishes.' where slug = 'ibu-rai' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sit-down meal in the centre of town that mixes Indonesian classics with familiar European comfort dishes';
-- expect: UPDATE 1

-- 71. W-ibu-rai-not_for · ibu-rai · not_for · restore before
update venues set not_for = 'Guests wanting a quiet, private table away from Ubud''s busiest tourist strip.' where slug = 'ibu-rai' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, private table, because it sits on Ubud''s busy tourist strip';
-- expect: UPDATE 1

-- 72. W-jaens-spa-why_its_here · jaens-spa · why_its_here · restore before
update venues set why_its_here = 'Popular ''affordable luxury'' Balinese spa with several Ubud outlets near the Monkey Forest, offering Balinese massage, facials, body care and full-day packages with free Ubud-area transport.' where slug = 'jaens-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Balinese spa with several outlets near the Monkey Forest, pitched as ''affordable luxury''. The menu covers Balinese massage, facials, body care and full-day packages with free transport in the Ubud area.';
-- expect: UPDATE 1

-- 73. W-jaens-spa-best_for · jaens-spa · best_for · restore before
update venues set best_for = 'Couples and travellers wanting a polished but affordable spa day near the Monkey Forest.' where slug = 'jaens-spa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A polished but affordable spa day near the Monkey Forest, as a couple or on your own';
-- expect: UPDATE 1

-- 74. W-karsa-spa-why_its_here · karsa-spa · why_its_here · restore before
update venues set why_its_here = 'Open-air spa sat among rice fields at the end of the Campuhan Ridge Walk, founded in 2012 and known for deep-tissue shiatsu, Balinese, Thai and sports massage plus Reiki and chakra healing using organic and Ayurvedic oils.' where slug = 'karsa-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An open-air spa in the rice fields at the end of the Campuhan Ridge Walk, founded in 2012. Massage runs from deep-tissue shiatsu to Balinese, Thai and sports styles. Reiki and chakra healing are offered too, and the oils used are organic and Ayurvedic.';
-- expect: UPDATE 1

-- 75. W-karsa-spa-best_for · karsa-spa · best_for · restore before
update venues set best_for = 'Walkers finishing the Campuhan Ridge Walk, and couples who want a rice-field, open-air massage setting away from the town noise.' where slug = 'karsa-spa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Walkers finishing the Campuhan Ridge Walk, or couples after an open-air massage in the rice fields away from town noise';
-- expect: UPDATE 1

-- 76. W-karsa-spa-not_for · karsa-spa · not_for · restore before
update venues set not_for = 'Travellers who need a central in-town location or same-day walk-in; it is a ~30-minute walk out and books up days ahead.' where slug = 'karsa-spa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A same-day walk-in from central Ubud: it is about a 30-minute walk out and books up days ahead';
-- expect: UPDATE 1

-- 77. W-kojin-teppanyaki-restaurant-ubud-by-wonderspace-why_its_here · kojin-teppanyaki-restaurant-ubud-by-wonderspace · why_its_here · restore before
update venues set why_its_here = 'Japanese restaurant at Kenderan, named after Kojin, a Japanese god of fire. Teppanyaki, kaiseki and omakase, cooked at the counter. Billed as the first irori grill in Bali. Open for lunch and dinner.' where slug = 'kojin-teppanyaki-restaurant-ubud-by-wonderspace' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Named after Kojin, a Japanese god of fire, this restaurant in Kenderan cooks teppanyaki, kaiseki and omakase at the counter. It opens for lunch and dinner.';
-- expect: UPDATE 1

-- 78. W-kush-ayurveda-yoga-barn-why_its_here · kush-ayurveda-yoga-barn · why_its_here · restore before
update venues set why_its_here = 'Ayurveda-focused spa inside The Yoga Barn where therapists first assess your dosha and then tailor treatments - Abhyanga, Shirodhara, hot-stone Shila massage and Ayurvedic facials with freshly prepared botanicals.' where slug = 'kush-ayurveda-yoga-barn' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Ayurvedic spa inside The Yoga Barn, where the therapists assess your dosha first and tailor the treatment to it. Abhyanga, Shirodhara, hot-stone Shila massage and Ayurvedic facials with freshly prepared botanicals are on the list.';
-- expect: UPDATE 1

-- 79. W-kush-ayurveda-yoga-barn-best_for · kush-ayurveda-yoga-barn · best_for · restore before
update venues set best_for = 'Yoga Barn visitors and travellers who specifically want authentic Ayurvedic treatment (dosha consultation, Shirodhara).' where slug = 'kush-ayurveda-yoga-barn' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga Barn visitors who want Ayurvedic treatment, such as a dosha consultation or Shirodhara';
-- expect: UPDATE 1

-- 80. W-kush-ayurveda-yoga-barn-not_for · kush-ayurveda-yoga-barn · not_for · restore before
update venues set not_for = 'Walk-ins - treatments must be booked in advance.' where slug = 'kush-ayurveda-yoga-barn' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Walk-ins, because treatments must be booked in advance';
-- expect: UPDATE 1

-- 81. W-la-portal-to-shamballah-why_its_here · la-portal-to-shamballah · why_its_here · restore before
update venues set why_its_here = 'Vegetarian restaurant and events space in Peliatan. Arabian, Indonesian and Asian dishes, with vegan and gluten-free options. Homemade bread, Euro-Arabia fusion plates and quesadillas. Live music, workshops and private healing rooms on site.' where slug = 'la-portal-to-shamballah' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A vegetarian restaurant and events space in Peliatan, cooking Arabian, Indonesian and Asian dishes with vegan and gluten-free options. The bread is homemade, and the menu runs to Euro-Arabia fusion plates and quesadillas. It also hosts live music and workshops and has private healing rooms.';
-- expect: UPDATE 1

-- 82. W-laka-leke-why_its_here · laka-leke · why_its_here · restore before
update venues set why_its_here = 'The sister restaurant of Cafe Wayan & Bakery, set in a garden bordering rice fields near Nyuh Kuning/Monkey Forest, with tree-shaded pavilions for private dining, afternoon craft workshops, and scheduled evenings with Balinese dance performances (Kecak/Fire Dance) and a group buffet.' where slug = 'laka-leke' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Cafe Wayan & Bakery''s sister restaurant, in a garden by the rice fields near Nyuh Kuning and the Monkey Forest. Private dining is in tree-shaded pavilions; craft workshops run in the afternoon. Scheduled evenings bring a Balinese dance show (Kecak/Fire Dance) and a group buffet.';
-- expect: UPDATE 1

-- 83. W-laka-leke-best_for · laka-leke · best_for · restore before
update venues set best_for = 'Groups wanting a scenic rice-field garden dinner with a Balinese cultural show, or a private-pavilion group meal.' where slug = 'laka-leke' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Groups after a garden dinner with a Balinese cultural show, or a meal in a private pavilion';
-- expect: UPDATE 1

-- 84. W-laka-leke-not_for · laka-leke · not_for · restore before
update venues set not_for = 'Solo travellers or those wanting a quick, casual walk-in meal without a cultural-show setting.' where slug = 'laka-leke' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Solo diners or a quick, casual walk-in meal: set evenings centre on a dance show and a group buffet';
-- expect: UPDATE 1

-- 85. W-locavore-nxt-why_its_here · locavore-nxt · why_its_here · restore before
update venues set why_its_here = 'Opened December 2023 in Lodtunduh as the more experimental, ingredient-driven sibling of Ubud''s famous fine-dining restaurant Locavore, led by chefs Eelke Plasmeijer and Ray Adriansyah; a 30-seat tasting-menu space using only local Indonesian ingredients with modern European technique, ranked among Asia''s 50 Best Restaurants.' where slug = 'locavore-nxt' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The more experimental, ingredient-driven sibling of Locavore, opened in Lodtunduh in December 2023 and led by chefs Eelke Plasmeijer and Ray Adriansyah. This 30-seat tasting-menu room uses only local Indonesian ingredients, cooked with modern European technique.';
-- expect: UPDATE 1

-- 86. W-locavore-nxt-best_for · locavore-nxt · best_for · restore before
update venues set best_for = 'Food-focused travellers wanting a multi-course, reservation-based tasting-menu experience celebrating Indonesian farmers, fishers and producers.' where slug = 'locavore-nxt' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A booked, multi-course tasting menu built on the work of Indonesian farmers, fishers and producers';
-- expect: UPDATE 1

-- 87. W-locavore-nxt-not_for · locavore-nxt · not_for · restore before
update venues set not_for = 'Casual walk-in diners, budget travellers, or anyone wanting a quick, low-key meal (advance-reservation, multi-course tasting format only).' where slug = 'locavore-nxt' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick, low-key or budget meal, or walking in: it is a multi-course tasting menu by reservation only';
-- expect: UPDATE 1

-- 88. W-mandapa-spa-ubud-why_its_here · mandapa-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'The spa at Mandapa, a Ritz-Carlton Reserve on the Ayung river in Kedewatan, one of Ubud''s most exclusive riverside sanctuaries.' where slug = 'mandapa-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The riverside spa at Mandapa, a Ritz-Carlton Reserve on the Ayung river in Kedewatan.';
-- expect: UPDATE 1

-- 89. W-mandapa-spa-ubud-best_for · mandapa-spa-ubud · best_for · restore before
update venues set best_for = 'Those seeking an ultra-luxury riverside spa experience.' where slug = 'mandapa-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An ultra-luxury spa visit by the Ayung river';
-- expect: UPDATE 1

-- 90. W-mango-tree-spa-loccitane-why_its_here · mango-tree-spa-loccitane · why_its_here · restore before
update venues set why_its_here = 'Luxury spa at Kupu Kupu Barong Villas in the Ayung River valley, with treatment rooms built into a giant mango tree, L''OCCITANE product rituals and one of the largest steam rooms in Bali.' where slug = 'mango-tree-spa-loccitane' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A luxury spa at Kupu Kupu Barong Villas in the Ayung River valley, with treatment rooms built into a giant mango tree. The rituals use L''OCCITANE products, and there is a steam room.';
-- expect: UPDATE 1

-- 91. W-mango-tree-spa-loccitane-best_for · mango-tree-spa-loccitane · best_for · restore before
update venues set best_for = 'A splurge or romantic luxury spa day with river-valley views and branded L''OCCITANE rituals.' where slug = 'mango-tree-spa-loccitane' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A splurge or a romantic spa day, with river-valley views and L''OCCITANE rituals';
-- expect: UPDATE 1

-- 92. W-mango-tree-spa-loccitane-not_for · mango-tree-spa-loccitane · not_for · restore before
update venues set not_for = 'Budget travellers or those wanting a central-town walk-in.' where slug = 'mango-tree-spa-loccitane' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget treatment or a walk-in from the centre of town — it is a luxury spa out in the Ayung valley';
-- expect: UPDATE 1

-- 93. W-maya-ubud-spa-ubud-why_its_here · maya-ubud-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'The wellness side of Maya Ubud Resort & Spa on the Peliatan ridge: a riverside spa with treatment pavilions set down in the Petanu valley, plus a yoga shala and a fitness centre overlooking the same valley.' where slug = 'maya-ubud-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The wellness side of Maya Ubud Resort & Spa, on the Peliatan ridge. Its riverside spa has treatment pavilions down in the Petanu valley. A yoga shala and a fitness centre look out over the same valley.';
-- expect: UPDATE 1

-- 94. W-maya-ubud-spa-ubud-best_for · maya-ubud-spa-ubud · best_for · restore before
update venues set best_for = 'Those wanting a scenic resort spa, yoga class or gym session away from central Ubud''s bustle.' where slug = 'maya-ubud-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A resort spa treatment, yoga class or gym session away from the bustle of central Ubud';
-- expect: UPDATE 1

-- 95. W-melting-wok-warung-why_its_here · melting-wok-warung · why_its_here · restore before
update venues set why_its_here = 'A tiny eight-table warung run by a French-Laotian couple, serving fragrant coconut curries, stir-fries and crepes off a short blackboard menu that changes daily. The Laotian herbs and French dessert touches make it distinct from standard Ubud warungs.' where slug = 'melting-wok-warung' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A French-Laotian couple runs this tiny eight-table warung on Jl. Gootama. The blackboard menu is short and changes daily: coconut curries, stir-fries and crepes. The cooking uses Laotian herbs, and the desserts have French touches.';
-- expect: UPDATE 1

-- 96. W-melting-wok-warung-best_for · melting-wok-warung · best_for · restore before
update venues set best_for = 'an intimate dinner; herb-forward coconut curries; a short curated menu; foodies after fusion flavour' where slug = 'melting-wok-warung' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An intimate dinner of herb-forward coconut curries and French-Laotian flavours';
-- expect: UPDATE 1

-- 97. W-melting-wok-warung-not_for · melting-wok-warung · not_for · restore before
update venues set not_for = 'large groups; walk-ins without a booking; anyone needing a wide menu or fast turnover' where slug = 'melting-wok-warung' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Large groups or walk-ins without a booking: there are eight tables and a short menu';
-- expect: UPDATE 1

-- 98. W-milk-and-madu-ubud-why_its_here · milk-and-madu-ubud · why_its_here · restore before
update venues set why_its_here = 'The easiest family and group brunch in Ubud — an all-day cafe with a clear 110K breakfast set, a kids menu and group bookings for up to 20.' where slug = 'milk-and-madu-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An all-day cafe on Jl. Suweta with a kids menu and group bookings for up to 20. There is a 110K breakfast set.';
-- expect: UPDATE 1

-- 99. W-milk-and-madu-ubud-best_for · milk-and-madu-ubud · best_for · restore before
update venues set best_for = 'Families with children; mixed groups; a central meeting point; anyone who wants a fixed breakfast bundle' where slug = 'milk-and-madu-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families with children, a mixed group, a central place to meet, or anyone who wants a fixed breakfast';
-- expect: UPDATE 1

-- 100. W-moksa-why_its_here · moksa · why_its_here · restore before
update venues set why_its_here = 'A plant-based restaurant with a permaculture garden and farm-to-table identity in Sayan.' where slug = 'moksa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A plant-based restaurant in Sayan with a permaculture garden and a farm-to-table kitchen.';
-- expect: UPDATE 1

-- 101. W-moksa-best_for · moksa · best_for · restore before
update venues set best_for = 'Plant-based diners seeking a destination meal and garden setting.' where slug = 'moksa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Plant-based diners making a trip of it for a meal in the garden';
-- expect: UPDATE 1

-- 102. W-moksa-not_for · moksa · not_for · restore before
update venues set not_for = 'Visitors wanting meat-heavy or central Ubud nightlife dining.' where slug = 'moksa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A meat-heavy meal or a night out in central Ubud: the menu is plant-based and it is out in Sayan';
-- expect: UPDATE 1

-- 103. W-monkey-bar-bali-why_its_here · monkey-bar-bali · why_its_here · restore before
update venues set why_its_here = 'A restaurant and bar built around an infinity pool at Bella Kita Mountain Retreat in the Klungkung hills of East Bali, with valley views toward the sea and produce from the property''s own farm. Entry runs on a pay-and-swim model with credit toward food.' where slug = 'monkey-bar-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Up in the hills of East Bali, this restaurant and bar is built around an infinity pool at Bella Kita Mountain Retreat. Valley views run toward the sea, and produce comes from the property''s own farm. Entry is pay-and-swim, and it includes credit toward food.';
-- expect: UPDATE 1

-- 104. W-monkey-bar-bali-best_for · monkey-bar-bali · best_for · restore before
update venues set best_for = 'A scenic pool-and-lunch stop on an East Bali day trip, away from the southern crowds.' where slug = 'monkey-bar-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A swim and lunch on an East Bali day trip, away from the southern crowds';
-- expect: UPDATE 1

-- 105. W-mozaic-why_its_here · mozaic · why_its_here · restore before
update venues set why_its_here = 'A long-running fine-dining anchor in Kedewatan founded by Chef Chris Salans and now led in the kitchen by head chef and co-owner Blake Thornley, built around French technique and Indonesian/Balinese ingredients, with a multi-course tasting menu plus a separate live-kitchen Chef''s Table.' where slug = 'mozaic' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Chef Chris Salans founded this Kedewatan fine-dining restaurant; head chef and co-owner Blake Thornley now leads the kitchen. The cooking applies French technique to Indonesian and Balinese ingredients. There is a multi-course tasting menu and, separately, a Chef''s Table at the live kitchen.';
-- expect: UPDATE 1

-- 106. W-mozaic-best_for · mozaic · best_for · restore before
update venues set best_for = 'special-occasion diners wanting French-Balinese tasting-menu fine dining in a garden setting' where slug = 'mozaic' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special occasion marked with a French-Balinese tasting menu in a garden';
-- expect: UPDATE 1

-- 107. W-mozaic-not_for · mozaic · not_for · restore before
update venues set not_for = 'travelers on a tight daily budget or wanting a quick casual meal' where slug = 'mozaic' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick, casual meal or a tight daily budget, because the format is a multi-course tasting menu';
-- expect: UPDATE 1

-- 108. W-nasi-ayam-kedewatan-ibu-mangku-best_for · nasi-ayam-kedewatan-ibu-mangku · best_for · restore before
update venues set best_for = 'Travellers looking for a focused Balinese rice-and-chicken meal in Kedewatan.' where slug = 'nasi-ayam-kedewatan-ibu-mangku' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese rice-and-chicken meal in Kedewatan';
-- expect: UPDATE 1

-- 109. W-norii-japanese-restaurant-ubud-why_its_here · norii-japanese-restaurant-ubud · why_its_here · restore before
update venues set why_its_here = 'Japanese restaurant in Peliatan, part of the Wonderspace group. Sushi, wagyu don, wagyu skewers and robatayaki beef. Cocktails built on yuzu, matcha and sake.' where slug = 'norii-japanese-restaurant-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Part of the Wonderspace group, this Japanese restaurant in Peliatan serves sushi, wagyu don, wagyu skewers and robatayaki beef. The cocktails lean on yuzu and matcha, with sake too.';
-- expect: UPDATE 1

-- 110. W-oneworld-ayurveda-why_its_here · oneworld-ayurveda · why_its_here · restore before
update venues set why_its_here = 'An authentic Panchakarma detox retreat on a palace property amid jungle and rice fields, with resident BAMS-qualified Ayurvedic doctors guiding multi-night programmes.' where slug = 'oneworld-ayurveda' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Oneworld Ayurveda runs Panchakarma detox programmes on a palace property in Pengosekan, among jungle and rice fields. Resident Ayurvedic doctors with BAMS qualifications guide each multi-night stay.';
-- expect: UPDATE 1

-- 111. W-oneworld-ayurveda-best_for · oneworld-ayurveda · best_for · restore before
update venues set best_for = 'Travellers ready to commit to a structured, doctor-supervised Ayurvedic detox of 7 nights or more.' where slug = 'oneworld-ayurveda' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Anyone ready to commit to a structured, doctor-supervised Ayurvedic detox of 7 nights or more';
-- expect: UPDATE 1

-- 112. W-oneworld-ayurveda-not_for · oneworld-ayurveda · not_for · restore before
update venues set not_for = 'Anyone wanting casual drop-in yoga or a short, self-directed visit.' where slug = 'oneworld-ayurveda' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Casual drop-in yoga or a short visit on your own terms, since the programmes run over multiple nights with a doctor';
-- expect: UPDATE 1

-- 113. W-onion-collective-why_its_here · onion-collective · why_its_here · restore before
update venues set why_its_here = 'A hotel/restaurant/coworking hangout on Jl. Raya Pengosekan with a pool, live music, and a menu built to serve vegan and non-vegan travelers alike — as much a daytime work spot as a dinner-and-drinks spot.' where slug = 'onion-collective' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A hotel, restaurant and coworking space on Jl. Raya Pengosekan that has a pool and live music. The menu works for vegans and non-vegans alike, and the place is as much a daytime work spot as somewhere for dinner and drinks.';
-- expect: UPDATE 1

-- 114. W-onion-collective-best_for · onion-collective · best_for · restore before
update venues set best_for = 'digital nomads and groups wanting an all-day hangout with vegan-friendly food, coworking, and live music' where slug = 'onion-collective' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Digital nomads and groups after an all-day base with coworking, vegan-friendly food and live music';
-- expect: UPDATE 1

-- 115. W-onion-collective-not_for · onion-collective · not_for · restore before
update venues set not_for = 'diners wanting a quiet, formal sit-down dinner' where slug = 'onion-collective' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A formal, quiet sit-down dinner. There is live music, and it doubles as a coworking space';
-- expect: UPDATE 1

-- 116. W-pinstripe-bar-ubud-why_its_here · pinstripe-bar-ubud · why_its_here · restore before
update venues set why_its_here = 'Bar in Ubud. A refined cocktail and wine bar offering handcrafted drinks and a gastro-style bar dining. Booking is by WhatsApp.' where slug = 'pinstripe-bar-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A cocktail and wine bar in Ubud that pairs handcrafted drinks with gastro-style bar dining. Booking is by WhatsApp.';
-- expect: UPDATE 1

-- 117. W-pinstripe-bar-ubud-best_for · pinstripe-bar-ubud · best_for · restore before
update venues set best_for = 'An evening out for drinks, not a full sit-down meal.' where slug = 'pinstripe-bar-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An evening out for drinks';
-- expect: UPDATE 1

-- 118. W-pinstripe-bar-ubud-not_for · pinstripe-bar-ubud · not_for · restore NULL
update venues set not_for = null where slug = 'pinstripe-bar-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full sit-down meal: the food is gastro-style bar dining';
-- expect: UPDATE 1

-- 119. W-putri-bali-spa-why_its_here · putri-bali-spa · why_its_here · restore before
update venues set why_its_here = 'Balinese day spa on Jl. Raya Sanggingan offering traditional massage, body treatments, aromatherapy and flower-bath packages, with complimentary pickup within the Ubud area.' where slug = 'putri-bali-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Traditional Balinese massage, body treatments, aromatherapy and flower-bath packages at a day spa on Jl. Raya Sanggingan. Pickup within the Ubud area is free.';
-- expect: UPDATE 1

-- 120. W-putri-bali-spa-best_for · putri-bali-spa · best_for · restore before
update venues set best_for = 'Travellers wanting a classic Balinese massage and flower bath with free hotel pickup.' where slug = 'putri-bali-spa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A classic Balinese massage and flower bath, with free pickup from your hotel';
-- expect: UPDATE 1

-- 121. W-pyramids-of-chi-why_its_here · pyramids-of-chi · why_its_here · restore before
update venues set why_its_here = 'A purpose-built sound-healing venue set among rice fields north of Ubud, with two large pyramids (one scaled to the Great Pyramid of Giza) used for group sound sessions.' where slug = 'pyramids-of-chi' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This purpose-built sound-healing venue in the rice fields north of Ubud has two large pyramids for group sound sessions. One of them is scaled to the Great Pyramid of Giza.';
-- expect: UPDATE 1

-- 122. W-pyramids-of-chi-best_for · pyramids-of-chi · best_for · restore before
update venues set best_for = 'Anyone wanting a signature Ubud sound-healing experience and a distinctive one-off wellness outing rather than a regular class.' where slug = 'pyramids-of-chi' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A one-off sound-healing session in Ubud rather than a regular class';
-- expect: UPDATE 1

-- 123. W-pyramids-of-chi-not_for · pyramids-of-chi · not_for · restore before
update venues set not_for = 'Those looking for a physical yoga workout, as the focus here is passive sound and vibration.' where slug = 'pyramids-of-chi' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A physical yoga workout. The focus here is passive sound and vibration';
-- expect: UPDATE 1

-- 124. W-radiantly-alive-why_its_here · radiantly-alive · why_its_here · restore before
update venues set why_its_here = 'A long-running central-Ubud studio known for dynamic Vinyasa flows, healing therapies and internationally attended teacher trainings, with an on-site plant-based cafe.' where slug = 'radiantly-alive' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A central-Ubud studio for dynamic Vinyasa flows and healing therapies, on Jl. Jembawan. Its teacher trainings draw students from abroad, and a plant-based cafe sits on site.';
-- expect: UPDATE 1

-- 125. W-radiantly-alive-best_for · radiantly-alive · best_for · restore before
update venues set best_for = 'Movement-focused practitioners who want strong, creative Vinyasa classes and those considering a yoga teacher training.' where slug = 'radiantly-alive' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Practitioners after strong, creative Vinyasa, or anyone weighing up a yoga teacher training';
-- expect: UPDATE 1

-- 126. W-room-4-dessert-why_its_here · room-4-dessert · why_its_here · restore before
update venues set why_its_here = 'A dedicated dessert tasting experience rather than a general restaurant, making the decision and format unusually clear.' where slug = 'room-4-dessert' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A dedicated dessert tasting venue on Jl. Raya Sanggingan in Kedewatan, rather than a general restaurant.';
-- expect: UPDATE 1

-- 127. W-room-4-dessert-best_for · room-4-dessert · best_for · restore before
update venues set best_for = 'Dessert-focused tasting menus and a planned evening experience.' where slug = 'room-4-dessert' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A planned evening built around a dessert tasting menu';
-- expect: UPDATE 1

-- 128. W-room-4-dessert-not_for · room-4-dessert · not_for · restore before
update venues set not_for = 'Anyone wanting a conventional lunch or quick dessert stop.' where slug = 'room-4-dessert' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A conventional lunch or a quick dessert stop — it runs as a tasting format';
-- expect: UPDATE 1

-- 129. W-room4dessert-why_its_here · room4dessert · why_its_here · restore before
update venues set why_its_here = 'Chef Will Goldfarb''s dessert-only tasting-menu restaurant in Kedewatan, set inside a large botanical garden tied to the dessert recipes themselves — a globally recognized pastry-chef concept rather than a conventional dinner spot.' where slug = 'room4dessert' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Chef Will Goldfarb''s dessert-only tasting-menu restaurant in Kedewatan. It sits inside a large botanical garden tied to the recipes themselves. This is a pastry chef''s concept rather than a conventional dinner spot.';
-- expect: UPDATE 1

-- 130. W-room4dessert-best_for · room4dessert · best_for · restore before
update venues set best_for = 'dessert-focused special occasions and pastry enthusiasts wanting a multi-course tasting experience' where slug = 'room4dessert' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Pastry enthusiasts, or a special occasion built around a multi-course dessert tasting';
-- expect: UPDATE 1

-- 131. W-room4dessert-not_for · room4dessert · not_for · restore before
update venues set not_for = 'travelers wanting a full savory dinner or a budget meal' where slug = 'room4dessert' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full savoury dinner or a budget meal, because every course is dessert';
-- expect: UPDATE 1

-- 132. W-sacred-river-spa-at-four-seasons-sayan-ubud-why_its_here · sacred-river-spa-at-four-seasons-sayan-ubud · why_its_here · restore before
update venues set why_its_here = 'The Sacred River Spa at the Four Seasons Resort Bali at Sayan, beside the Ayung river in one of Ubud''s most celebrated resorts.' where slug = 'sacred-river-spa-at-four-seasons-sayan-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The spa at Four Seasons Resort Bali at Sayan, beside the Ayung river.';
-- expect: UPDATE 1

-- 133. W-sacred-river-spa-at-four-seasons-sayan-ubud-best_for · sacred-river-spa-at-four-seasons-sayan-ubud · best_for · restore before
update venues set best_for = 'Those seeking a landmark five-star riverside spa day.' where slug = 'sacred-river-spa-at-four-seasons-sayan-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa day by the river';
-- expect: UPDATE 1

-- 134. W-sakti-dining-room-fivelements-retreat-bali-why_its_here · sakti-dining-room-fivelements-retreat-bali · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Fivelements Retreat Bali, Ubud.' where slug = 'sakti-dining-room-fivelements-retreat-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Restaurant in Fivelements Retreat Bali.';
-- expect: UPDATE 1

-- 135. W-sang-spa-why_its_here · sang-spa · why_its_here · restore before
update venues set why_its_here = 'Long-running (established 2008) affordable Balinese day spa with two central Ubud outlets, offering traditional Balinese massage, scrubs, flower baths, reflexology and four-hands massage.' where slug = 'sang-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Established in 2008, this Balinese day spa runs two outlets in central Ubud. Traditional Balinese massage, scrubs, flower baths, reflexology and four-hands massage are on the menu, at affordable prices.';
-- expect: UPDATE 1

-- 136. W-sang-spa-best_for · sang-spa · best_for · restore before
update venues set best_for = 'Budget-conscious travellers wanting authentic, well-priced Balinese massage a short walk from Ubud centre.' where slug = 'sang-spa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage on a budget, a short walk from the centre of Ubud';
-- expect: UPDATE 1

-- 137. W-sawobali-why_its_here · sawobali · why_its_here · restore before
update venues set why_its_here = 'A vegan/vegetarian warung and cake shop in Peliatan (Ubud) known for a budget, all-you-can-eat home-style buffet and made-in-house cakes; dishes are prepared without garlic or onion to also suit Buddhist diners.' where slug = 'sawobali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A vegan and vegetarian warung and cake shop in Peliatan, with a budget all-you-can-eat buffet of home-style food. The cakes are made in-house, and dishes are cooked without garlic or onion so that Buddhist diners can eat them too.';
-- expect: UPDATE 1

-- 138. W-sawobali-best_for · sawobali · best_for · restore before
update venues set best_for = 'Vegan, vegetarian, or allium-free travelers wanting an affordable, home-cooked-style lunch buffet.' where slug = 'sawobali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A budget home-style lunch buffet for vegans, vegetarians or anyone avoiding garlic and onion';
-- expect: UPDATE 1

-- 139. W-sawobali-not_for · sawobali · not_for · restore before
update venues set not_for = 'Travelers wanting a meat-forward menu or a formal/fine-dining setting.' where slug = 'sawobali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A meat-forward menu or a formal setting. This is a vegetarian warung';
-- expect: UPDATE 1

-- 140. W-sayuri-healing-food-why_its_here · sayuri-healing-food · why_its_here · restore before
update venues set why_its_here = 'A raw-vegan and plant-based cafe in central Ubud focused on living-food cooking, cold-pressed juices and a rotating case of raw desserts, with an attached plant-based academy. The kitchen leans into raw preparation rather than standard cooked vegan fare.' where slug = 'sayuri-healing-food' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A raw-vegan and plant-based cafe in Ubud with a plant-based academy attached. The kitchen leans towards raw, living food rather than standard cooked vegan dishes. There are cold-pressed juices too, and a rotating case of raw desserts.';
-- expect: UPDATE 1

-- 141. W-sayuri-healing-food-best_for · sayuri-healing-food · best_for · restore before
update venues set best_for = 'plant-based and raw eating; relaxed daytime meals; wellness-minded visitors; long cafe sits' where slug = 'sayuri-healing-food' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A long daytime cafe sit over raw, plant-based food';
-- expect: UPDATE 1

-- 142. W-sayuri-healing-food-not_for · sayuri-healing-food · not_for · restore before
update venues set not_for = 'committed meat-eaters; anyone wanting a fast, familiar hearty meal' where slug = 'sayuri-healing-food' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Committed meat-eaters, or anyone after a fast, familiar, hearty meal: the kitchen leans raw';
-- expect: UPDATE 1

-- 143. W-secret-garden-restaurant-why_its_here · secret-garden-restaurant · why_its_here · restore before
update venues set why_its_here = 'Family-run restaurant in Anturan, Lovina, set in a garden. Indonesian and Western dishes with a separate vegetarian menu. Seafood curry and goulash are regulars. Free pick-up and drop-off for guests staying in Lovina.' where slug = 'secret-garden-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A family-run garden restaurant in Anturan, Lovina. The cooking is Indonesian and Western, with a separate vegetarian menu, and seafood curry and goulash are regulars. Guests staying in Lovina get free pick-up and drop-off.';
-- expect: UPDATE 1

-- 144. W-seeds-of-life-why_its_here · seeds-of-life · why_its_here · restore before
update venues set why_its_here = 'A 100% raw & vegan restaurant and Taoist tonic bar in Ubud Center (on Jalan Goutama, operating since 2014), built around raw-food dishes made from fresh, locally grown produce, with Ashtanga yoga classes upstairs.' where slug = 'seeds-of-life' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A 100% raw and vegan restaurant on Jalan Goutama in central Ubud, with a Taoist tonic bar, open since 2014. The dishes are made from fresh, locally grown produce, and Ashtanga yoga classes run upstairs.';
-- expect: UPDATE 1

-- 145. W-seeds-of-life-best_for · seeds-of-life · best_for · restore before
update venues set best_for = 'Raw-food and vegan-focused travelers, and wellness/yoga-oriented visitors wanting a calm plant-based meal in central Ubud.' where slug = 'seeds-of-life' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm plant-based meal in central Ubud, for raw-food eaters and anyone into yoga';
-- expect: UPDATE 1

-- 146. W-seeds-of-life-not_for · seeds-of-life · not_for · restore before
update venues set not_for = 'Travelers wanting hearty non-vegan or cooked-comfort-food options.' where slug = 'seeds-of-life' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Hearty cooked comfort food or anything non-vegan: everything here is raw and vegan';
-- expect: UPDATE 1

-- 147. W-seniman-coffee-studio-why_its_here · seniman-coffee-studio · why_its_here · restore before
update venues set why_its_here = 'A well-known Ubud specialty coffee roaster and café near Ubud Palace, treating coffee as a craft with sourced-and-roasted Indonesian origin beans, multiple brew methods, and a food menu spanning Indonesian and Western dishes.' where slug = 'seniman-coffee-studio' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A specialty coffee roaster and café near Ubud Palace that sources and roasts Indonesian origin beans. The coffee is brewed several ways, and the food menu covers Indonesian and Western dishes.';
-- expect: UPDATE 1

-- 148. W-seniman-coffee-studio-best_for · seniman-coffee-studio · best_for · restore before
update venues set best_for = 'Remote workers and digital nomads wanting a serious specialty-coffee spot with room to sit and work; coffee enthusiasts wanting origin-focused brews.' where slug = 'seniman-coffee-studio' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Remote workers who need room to sit and work, or coffee enthusiasts chasing origin-focused brews';
-- expect: UPDATE 1

-- 149. W-seniman-coffee-studio-not_for · seniman-coffee-studio · not_for · restore before
update venues set not_for = 'Travelers wanting fast grab-and-go service — service here leans toward a slower, deliberate pace.' where slug = 'seniman-coffee-studio' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Fast grab-and-go coffee. The pace here is slower and deliberate';
-- expect: UPDATE 1

-- 150. W-shichirin-japanese-restaurant-ubud-why_its_here · shichirin-japanese-restaurant-ubud · why_its_here · restore before
update venues set why_its_here = 'The first Shichirin on the island, on Jl. Bisma. Japanese grill cooking: teppanyaki, gyukatsu and izakaya plates, with sushi and sashimi.' where slug = 'shichirin-japanese-restaurant-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Japanese grill restaurant on Jl. Bisma. The menu runs from teppanyaki and gyukatsu to izakaya plates. There is sushi and sashimi too.';
-- expect: UPDATE 1

-- 151. W-spring-spa-ubud-why_its_here · spring-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Largest outlet of the Spring Spa brand, set among rice terraces, with treatment rooms overlooking the fields plus a dedicated wellness zone of contrast-therapy plunges, saunas and relaxation lounges.' where slug = 'spring-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Spring Spa outlet among rice terraces, with treatment rooms that look out over the fields. A dedicated wellness zone holds contrast-therapy plunges, saunas and relaxation lounges.';
-- expect: UPDATE 1

-- 152. W-spring-spa-ubud-best_for · spring-spa-ubud · best_for · restore before
update venues set best_for = 'Travellers wanting a contemporary spa combined with wellness facilities (sauna, contrast plunges) and rice-field views.' where slug = 'spring-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A contemporary spa visit with a sauna and contrast plunges, looking out at the rice fields';
-- expect: UPDATE 1

-- 153. W-suka-espresso-ubud-why_its_here · suka-espresso-ubud · why_its_here · restore before
update venues set why_its_here = 'The safest all-round brunch in Ubud — Australian-style breakfast and specialty coffee from 7:30, with 60K breakfast specials running until 3pm and clear vegetarian, vegan and gluten-free labels.' where slug = 'suka-espresso-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Australian-style breakfast and specialty coffee on Jl. Raya Pengosekan, served from 7:30. Breakfast specials at 60K run until 3pm, and the menu labels vegetarian, vegan and gluten-free dishes clearly.';
-- expect: UPDATE 1

-- 154. W-suka-espresso-ubud-best_for · suka-espresso-ubud · best_for · restore before
update venues set best_for = 'A first brunch in Ubud; coffee lovers; solo diners and couples; a short off-peak laptop session' where slug = 'suka-espresso-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A first brunch in Ubud, a meal on your own or as a couple, or a short laptop session off-peak';
-- expect: UPDATE 1

-- 155. W-svaha-spa-why_its_here · svaha-spa · why_its_here · restore before
update venues set why_its_here = 'Award-winning sustainable holistic spa group with several Ubud outlets (flagship on Jl. Bisma near the Monkey Forest), offering Balinese and signature massages, body-purification rituals and couples packages.' where slug = 'svaha-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A sustainable, holistic spa group with several outlets around Ubud. The flagship is on Jl. Bisma near the Monkey Forest. Its menu covers Balinese and house massages, body-purification rituals and couples packages.';
-- expect: UPDATE 1

-- 156. W-svaha-spa-best_for · svaha-spa · best_for · restore before
update venues set best_for = 'Travellers wanting a modern, polished spa with signature-ritual and couples options.' where slug = 'svaha-spa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A modern, polished spa visit, including couples packages';
-- expect: UPDATE 1

-- 157. W-taksu-spa-beauty-ubud-why_its_here · taksu-spa-beauty-ubud · why_its_here · restore before
update venues set why_its_here = 'The beauty services at Taksu, a landmark healing-and-spa sanctuary in central Ubud set among gardens and koi ponds.' where slug = 'taksu-spa-beauty-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Beauty treatments at Taksu, a healing and spa centre among gardens and koi ponds in central Ubud.';
-- expect: UPDATE 1

-- 158. W-taksu-spa-beauty-ubud-best_for · taksu-spa-beauty-ubud · best_for · restore before
update venues set best_for = 'Those combining beauty with Taksu''s wider healing and spa menu.' where slug = 'taksu-spa-beauty-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A beauty treatment added to a healing or spa session at Taksu';
-- expect: UPDATE 1

-- 159. W-taksu-spa-ubud-why_its_here · taksu-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Taksu Spa, part of the well-known Taksu healing sanctuary in central Ubud, offering massage and holistic treatments among gardens and water features.' where slug = 'taksu-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Taksu Spa belongs to the Taksu healing sanctuary in central Ubud, where massage and holistic treatments are given among gardens and water features.';
-- expect: UPDATE 1

-- 160. W-taksu-spa-ubud-best_for · taksu-spa-ubud · best_for · restore before
update venues set best_for = 'Those who want a spa within a dedicated healing-and-wellness compound.' where slug = 'taksu-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa session inside a dedicated healing and wellness compound';
-- expect: UPDATE 1

-- 161. W-taksu-yoga-why_its_here · taksu-yoga · why_its_here · restore before
update venues set why_its_here = 'Yoga centre in a river valley in central Ubud, part of the Taksu spa and restaurant complex. Small classes for individual attention: beginner, hatha, vinyasa, yin and restorative. Daily classes, private sessions and training courses.' where slug = 'taksu-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The yoga centre of the Taksu spa and restaurant complex, in a river valley in central Ubud. Classes stay small for individual attention, running daily across beginner, hatha, vinyasa, yin and restorative. There are also private sessions and training courses.';
-- expect: UPDATE 1

-- 162. W-taksu-yoga-ubud-why_its_here · taksu-yoga-ubud · why_its_here · restore before
update venues set why_its_here = 'A wellness center hidden in a central-Ubud garden combining small-group yoga classes with an extensive spa, healing and beauty menu.' where slug = 'taksu-yoga-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A wellness centre in a central-Ubud garden on Jl. Goutama Selatan. Small-group yoga classes run alongside an extensive spa, healing and beauty menu.';
-- expect: UPDATE 1

-- 163. W-taksu-yoga-ubud-best_for · taksu-yoga-ubud · best_for · restore before
update venues set best_for = 'Those who want intimate, personalised classes and to pair a practice with a massage or spa treatment in the same visit.' where slug = 'taksu-yoga-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An intimate, personalised yoga class paired with a massage or spa treatment in the same visit';
-- expect: UPDATE 1

-- 164. W-the-elephant-why_its_here · the-elephant · why_its_here · restore before
update venues set why_its_here = 'An open-air, 100% vegetarian/vegan restaurant on the Campuhan side of Ubud (Jl. Raya Sanggingan) built around an elevated terrace overlooking Campuhan Ridge, open all day from breakfast through dinner, with an organic/local/slow-food sourcing philosophy.' where slug = 'the-elephant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Elephant is an open-air, 100% vegetarian and vegan restaurant on Jl. Raya Sanggingan. Its elevated terrace looks over Campuhan Ridge, and it serves all day from breakfast through dinner. The sourcing is organic and local, along slow-food lines.';
-- expect: UPDATE 1

-- 165. W-the-elephant-best_for · the-elephant · best_for · restore before
update venues set best_for = 'vegetarian and vegan travelers wanting an all-day scenic meal overlooking Campuhan Ridge' where slug = 'the-elephant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Vegetarians and vegans after a meal looking over Campuhan Ridge';
-- expect: UPDATE 1

-- 166. W-the-elephant-not_for · the-elephant · not_for · restore before
update venues set not_for = 'diners specifically wanting meat or seafood dishes' where slug = 'the-elephant' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Meat or seafood, because the whole menu is vegetarian and vegan';
-- expect: UPDATE 1

-- 167. W-the-shala-bali-why_its_here · the-shala-bali · why_its_here · restore before
update venues set why_its_here = 'A boutique yoga-retreat property in Sanggingan built on Balinese and Indian philosophy, pairing daily yoga with Ayurvedic spa treatments and on-site vegetarian dining and rooms.' where slug = 'the-shala-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Built on Balinese and Indian philosophy, The Shala is a boutique yoga property in Sanggingan. Daily yoga comes with Ayurvedic spa treatments, vegetarian dining and rooms on site.';
-- expect: UPDATE 1

-- 168. W-the-shala-bali-best_for · the-shala-bali · best_for · restore before
update venues set best_for = 'Visitors wanting a stay-and-practice retreat experience with Ayurvedic treatments, not just a walk-in class.' where slug = 'the-shala-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A stay built around daily practice and Ayurvedic treatments';
-- expect: UPDATE 1

-- 169. W-the-shala-bali-not_for · the-shala-bali · not_for · restore before
update venues set not_for = 'Travellers only after a quick single drop-in class.' where slug = 'the-shala-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A single drop-in class: the place is set up for staying and practising';
-- expect: UPDATE 1

-- 170. W-the-westin-resort-and-spa-ubud-fitness-studio-why_its_here · the-westin-resort-and-spa-ubud-fitness-studio · why_its_here · restore before
update venues set why_its_here = 'The 24-hour WestinWORKOUT studio at The Westin Resort & Spa Ubud in Lodtunduh, free to resort guests. It carries cardio machines, treadmills, bikes, stair climbers, free weights and weight machines plus a yoga area, and lends workout gear to guests travelling light. An open-air pavilion nearby hosts morning yoga and meditation, and the spa has five treatment rooms, four outdoor pavilions, a jacuzzi and a steam room.' where slug = 'the-westin-resort-and-spa-ubud-fitness-studio' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The 24-hour WestinWORKOUT studio at The Westin Ubud in Lodtunduh is free for resort guests. It has cardio and weight machines, free weights and a yoga area, and lends gear to guests travelling light. Morning yoga and meditation run in an open-air pavilion nearby.';
-- expect: UPDATE 1

-- 171. W-the-westin-resort-and-spa-ubud-fitness-studio-best_for · the-westin-resort-and-spa-ubud-fitness-studio · best_for · restore before
update venues set best_for = 'Ubud guests who want a full 24-hour gym and the option to borrow kit rather than pack it.' where slug = 'the-westin-resort-and-spa-ubud-fitness-studio' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort guests who want a 24-hour gym and would rather borrow kit than pack it';
-- expect: UPDATE 1

-- 172. W-the-yoga-barn-why_its_here · the-yoga-barn · why_its_here · restore before
update venues set why_its_here = 'Ubud''s largest and best-known wellness compound: a cluster of open-air shalas, a healing center, garden cafe and shop hosting dozens of daily yoga, meditation and sound classes.' where slug = 'the-yoga-barn' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A wellness compound on Jl. Raya Pengosekan, with a cluster of open-air shalas and a healing centre. A garden cafe and a shop sit alongside, and dozens of yoga, meditation and sound classes run every day.';
-- expect: UPDATE 1

-- 173. W-the-yoga-barn-best_for · the-yoga-barn · best_for · restore before
update venues set best_for = 'First-time visitors who want the full range of drop-in classes in one place, and anyone curious about Ubud''s ecstatic-dance and sound-healing scene.' where slug = 'the-yoga-barn' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'First-time visitors to Ubud who want the full range of drop-in classes in one place, or anyone curious about ecstatic dance and sound healing';
-- expect: UPDATE 1

-- 174. W-the-yoga-barn-not_for · the-yoga-barn · not_for · restore before
update venues set not_for = 'People seeking a small, quiet studio with individual attention, as classes here can be large.' where slug = 'the-yoga-barn' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A small, quiet studio with individual attention. Classes here can be large';
-- expect: UPDATE 1

-- 175. W-tukies-coconut-shop-why_its_here · tukies-coconut-shop · why_its_here · restore before
update venues set why_its_here = 'A coconut-focused dessert and drinks shop where everything is built around fresh coconut, including vegan coconut ice cream served in the shell with roasted coconut curls. A quick, cooling stop in central Ubud.' where slug = 'tukies-coconut-shop' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Everything at this dessert and drinks shop on Jl. Monkey Forest starts with fresh coconut. The vegan coconut ice cream comes in the shell with roasted coconut curls.';
-- expect: UPDATE 1

-- 176. W-tukies-coconut-shop-best_for · tukies-coconut-shop · best_for · restore before
update venues set best_for = 'a cooling coconut treat while walking ubud; vegan dessert; quick sweet break; fresh coconut drinks' where slug = 'tukies-coconut-shop' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A quick, cooling coconut break while you walk around central Ubud';
-- expect: UPDATE 1

-- 177. W-tukies-coconut-shop-not_for · tukies-coconut-shop · not_for · restore before
update venues set not_for = 'a full sit-down meal or savoury dinner; anyone avoiding coconut' where slug = 'tukies-coconut-shop' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full sit-down meal or a savoury dinner, and anyone avoiding coconut — it is in everything';
-- expect: UPDATE 1

-- 178. W-ubud-beauty-salon-why_its_here · ubud-beauty-salon · why_its_here · restore before
update venues set why_its_here = 'A central-Ubud beauty salon offering hair, nails and basic treatments.' where slug = 'ubud-beauty-salon' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Hair, nails and basic treatments at a beauty salon in central Ubud.';
-- expect: UPDATE 1

-- 179. W-ubud-beauty-salon-best_for · ubud-beauty-salon · best_for · restore before
update venues set best_for = 'Visitors wanting salon basics in the heart of Ubud.' where slug = 'ubud-beauty-salon' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Salon basics without leaving the centre of Ubud';
-- expect: UPDATE 1

-- 180. W-ubud-gym-best_for · ubud-gym · best_for · restore before
update venues set best_for = 'Budget-minded travellers who just want a place to train in Ubud.' where slug = 'ubud-gym' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A no-frills, budget training session in Ubud';
-- expect: UPDATE 1

-- 181. W-ubud-pilates-why_its_here · ubud-pilates · why_its_here · restore before
update venues set why_its_here = 'A boutique Pilates studio in Ubud offering mat and reformer classes.' where slug = 'ubud-pilates' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A boutique Pilates studio in Ubud with mat and reformer classes.';
-- expect: UPDATE 1

-- 182. W-ubud-pilates-best_for · ubud-pilates · best_for · restore before
update venues set best_for = 'Those who prefer low-impact Pilates over a gym in Ubud.' where slug = 'ubud-pilates' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Low-impact Pilates instead of a gym session in Ubud';
-- expect: UPDATE 1

-- 183. W-ubud-sari-health-resort-why_its_here · ubud-sari-health-resort · why_its_here · restore before
update venues set why_its_here = 'Long-standing health resort minutes from Ubud centre that pairs a day spa (Balinese, Lomi Hawaiian and four-hands massage) with wellness and detox programs and raw-food cuisine.' where slug = 'ubud-sari-health-resort' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Minutes from Ubud centre, this health resort has a day spa doing Balinese, Lomi Hawaiian and four-hands massage. It also runs wellness and detox programs and serves raw food.';
-- expect: UPDATE 1

-- 184. W-ubud-sari-health-resort-best_for · ubud-sari-health-resort · best_for · restore before
update venues set best_for = 'Wellness-focused travellers wanting spa treatments alongside detox, raw-food and longer revitalization programs.' where slug = 'ubud-sari-health-resort' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Spa treatments combined with a detox, raw food or a longer revitalization program';
-- expect: UPDATE 1

-- 185. W-ubud-traditional-spa-why_its_here · ubud-traditional-spa · why_its_here · restore before
update venues set why_its_here = 'Traditional Balinese massage spa in the village of Payogan next to the historic Pura Puncak temple, offering massage, body scrubs and flower baths with free transport to and from central Ubud.' where slug = 'ubud-traditional-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A traditional Balinese massage spa in Payogan village, next to Pura Puncak temple. Massage, body scrubs and flower baths are on the menu, and there is free transport to and from central Ubud.';
-- expect: UPDATE 1

-- 186. W-ubud-traditional-spa-best_for · ubud-traditional-spa · best_for · restore before
update venues set best_for = 'Travellers wanting an authentic, quieter village spa experience with free central-Ubud pickup.' where slug = 'ubud-traditional-spa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A massage in a quieter village setting, with free pickup from central Ubud';
-- expect: UPDATE 1

-- 187. W-ubud-traditional-spa-not_for · ubud-traditional-spa · not_for · restore before
update venues set not_for = 'Those wanting to walk in from Ubud centre - it is a short drive out.' where slug = 'ubud-traditional-spa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Walking over from Ubud centre: it is a short drive out';
-- expect: UPDATE 1

-- 188. W-ubud-yoga-house-why_its_here · ubud-yoga-house · why_its_here · restore before
update venues set why_its_here = 'A boutique, slightly off-the-beaten-path studio offering small classes in open-air shalas that overlook rice terraces and jungle.' where slug = 'ubud-yoga-house' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A boutique yoga studio a little out of the way on Jl. Subak Sokwayah. Classes are small and held in open-air shalas that look over rice terraces and jungle.';
-- expect: UPDATE 1

-- 189. W-ubud-yoga-house-best_for · ubud-yoga-house · best_for · restore before
update venues set best_for = 'Practitioners who prefer small classes with personalised attention and a quiet, green setting away from the crowds.' where slug = 'ubud-yoga-house' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Practitioners who want personal attention in a small class, somewhere quiet and green away from the crowds';
-- expect: UPDATE 1

-- 190. W-ubud-yoga-house-not_for · ubud-yoga-house · not_for · restore before
update venues set not_for = 'Anyone wanting a big buzzing studio with a packed daily timetable.' where slug = 'ubud-yoga-house' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A big, buzzing studio with a packed daily timetable: classes here are small';
-- expect: UPDATE 1

-- 191. W-warung-biah-biah-why_its_here · warung-biah-biah · why_its_here · restore before
update venues set why_its_here = 'A long-running home-style Balinese warung open since 2002, serving authentic nasi campur and local classics at warung prices. Known for its house chili sauce and a spread of Balinese sides.' where slug = 'warung-biah-biah' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A home-style Balinese warung on Jl. Goutama, open since 2002. Nasi campur and local classics come at warung prices, with a house chili sauce and a spread of Balinese sides.';
-- expect: UPDATE 1

-- 192. W-warung-biah-biah-best_for · warung-biah-biah · best_for · restore before
update venues set best_for = 'authentic Balinese food; budget local dining; nasi campur; a casual central Ubud meal' where slug = 'warung-biah-biah' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A casual, budget Balinese meal in central Ubud, like a plate of nasi campur';
-- expect: UPDATE 1

-- 193. W-warung-biah-biah-not_for · warung-biah-biah · not_for · restore before
update venues set not_for = 'diners wanting a quiet or upscale setting; groups needing lots of space during busy peak hours' where slug = 'warung-biah-biah' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet or upscale meal, or a group that needs space at busy peak hours. It is a home-style warung';
-- expect: UPDATE 1

-- 194. W-warung-semesta-best_for · warung-semesta · best_for · restore before
update venues set best_for = 'Healthy mixed-diet meals near Monkey Forest.' where slug = 'warung-semesta' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A healthy meal near the Monkey Forest for a table with mixed diets';
-- expect: UPDATE 1

-- 195. W-warung-semesta-not_for · warung-semesta · not_for · restore before
update venues set not_for = 'Anyone needing a formal fine-dining experience.' where slug = 'warung-semesta' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A formal fine-dining meal: this is an organic, mixed-diet restaurant';
-- expect: UPDATE 1

-- 196. W-warung-siam-why_its_here · warung-siam · why_its_here · restore before
update venues set why_its_here = 'A family-run Thai warung on Jl. Goutama in central Ubud, opened 2014, known for cooking dishes the traditional Thai way with fresh herbs, lime, and chilis rather than a Westernized menu.' where slug = 'warung-siam' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Thai food cooked the traditional way, with fresh herbs, lime and chillies, at a family-run warung on Jl. Goutama. It opened in 2014, and the menu is not westernised.';
-- expect: UPDATE 1

-- 197. W-warung-siam-best_for · warung-siam · best_for · restore before
update venues set best_for = 'travelers craving authentic home-style Thai food in central Ubud' where slug = 'warung-siam' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A home-style Thai meal in central Ubud';
-- expect: UPDATE 1

-- 198. W-warung-siam-not_for · warung-siam · not_for · restore before
update venues set not_for = 'large groups needing extensive seating — it''s a small patio/counter-style spot' where slug = 'warung-siam' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Large groups, because seating is a small patio and a counter';
-- expect: UPDATE 1

-- 199. W-watercress-ubud-why_its_here · watercress-ubud · why_its_here · restore before
update venues set why_its_here = 'The most polished early breakfast in Ubud — open from 7am with an unusually clear, current menu; breakfast service runs to 11:30.' where slug = 'watercress-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An early-breakfast spot on Jl. Monkey Forest, open from 7am, with breakfast served until 11:30.';
-- expect: UPDATE 1

-- 200. W-watercress-ubud-best_for · watercress-ubud · best_for · restore before
update venues set best_for = 'An early, composed breakfast; couples who want to talk; small early meetings; groups who book ahead' where slug = 'watercress-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An early breakfast for couples who want to talk, a small meeting or a group that books ahead';
-- expect: UPDATE 1

-- 201. W-whos-who-why_its_here · whos-who · why_its_here · restore before
update venues set why_its_here = 'A tucked-away Belgian bistro in the S-bend of south Ubud (near Jl. Raya Pengosekan) serving Belgian comfort classics alongside Indonesian-influenced touches, easy to walk past because of its small, unassuming signage.' where slug = 'whos-who' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Belgian bistro on the S-bend in south Ubud, near Jl. Raya Pengosekan. The menu is Belgian comfort classics with Indonesian-influenced touches.';
-- expect: UPDATE 1

-- 202. W-whos-who-best_for · whos-who · best_for · restore before
update venues set best_for = 'couples wanting a romantic, tucked-away dinner with Belgian comfort food' where slug = 'whos-who' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples after a romantic dinner of Belgian comfort food';
-- expect: UPDATE 1

-- 203. W-whos-who-not_for · whos-who · not_for · restore before
update venues set not_for = 'those wanting a highly visible, easy-to-spot street-front restaurant' where slug = 'whos-who' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A street-front place that is easy to spot, since the signage is small and unassuming';
-- expect: UPDATE 1

-- 204. W-zest-ubud-why_its_here · zest-ubud · why_its_here · restore before
update venues set why_its_here = 'The strongest creative vegan brunch in Ubud — an all-plant-based menu of substantial savoury dishes in a treetop Penestanan setting.' where slug = 'zest-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Zest serves vegan brunch up in the treetops of Penestanan. The whole menu is plant-based, and the savoury dishes are substantial.';
-- expect: UPDATE 1

-- 205. W-zest-ubud-best_for · zest-ubud · best_for · restore before
update venues set best_for = 'Vegan diners; a social brunch with friends; an atmosphere-led daytime meal; a date that does not need silence' where slug = 'zest-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A social brunch with friends, or a date that does not need silence';
-- expect: UPDATE 1

-- 206. W-zuna-yoga-ubud-why_its_here · zuna-yoga-ubud · why_its_here · restore before
update venues set why_its_here = 'A dedicated Ubud yoga school known for its classes and internationally recognised teacher trainings.' where slug = 'zuna-yoga-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A dedicated yoga school in Ubud that runs classes and teacher trainings.';
-- expect: UPDATE 1

-- 207. W-zuna-yoga-ubud-best_for · zuna-yoga-ubud · best_for · restore before
update venues set best_for = 'Committed practitioners and aspiring teachers who want structured training.' where slug = 'zuna-yoga-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Committed practitioners and aspiring teachers after structured training';
-- expect: UPDATE 1
