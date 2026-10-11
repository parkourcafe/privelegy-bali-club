-- wave-nusa-dua-jimbaran-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-akua-mediterranean-why_its_here · akua-mediterranean · why_its_here · restore before
update venues set why_its_here = 'A beachfront Mediterranean bar and restaurant on Jimbaran Beach (Pemelisan Agung No. 27), formerly AKUA de Bilbao, serving Spanish tapas, handmade pastas, sourdough pizzas, mezze and grilled seafood from Jimbaran Bay, with an upstairs open terrace facing the sunset over the bay.' where slug = 'akua-mediterranean' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A beachfront Mediterranean bar and restaurant on Jimbaran Beach, at Pemelisan Agung No. 27, formerly AKUA de Bilbao. The kitchen does Spanish tapas, mezze, handmade pastas, sourdough pizzas and grilled seafood from the bay, and the open terrace upstairs faces the sunset.';
-- expect: UPDATE 1

-- 2. W-akua-mediterranean-best_for · akua-mediterranean · best_for · restore before
update venues set best_for = 'Sunset drinks and shared plates by the sea, or a long, social seafood lunch with a group.' where slug = 'akua-mediterranean' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset drinks and shared plates by the sea, or a long, social seafood lunch with a group';
-- expect: UPDATE 1

-- 3. W-arkipela-spa-at-mo-venpick-jimbaran-jimbaran-best_for · arkipela-spa-at-mo-venpick-jimbaran-jimbaran · best_for · restore before
update venues set best_for = 'Visitors wanting a polished resort spa near Samasta''s shops and cafés.' where slug = 'arkipela-spa-at-mo-venpick-jimbaran-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A polished resort spa treatment near Samasta''s shops and cafés';
-- expect: UPDATE 1

-- 4. W-arwana-why_its_here · arwana · why_its_here · restore before
update venues set why_its_here = 'The beachfront grill restaurant at The Laguna, a Luxury Collection Resort & Spa in Nusa Dua, doing Basque-style wood grills of fresh seafood and dry-aged meats plus a Balinese menu, on a terrace beside the beach and lagoon pools.' where slug = 'arwana' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The beachfront grill restaurant at The Laguna, a Luxury Collection Resort & Spa in Nusa Dua. Fresh seafood and dry-aged meats are cooked over Basque-style wood grills, alongside a Balinese menu. Tables are on a terrace beside the beach and the lagoon pools.';
-- expect: UPDATE 1

-- 5. W-arwana-best_for · arwana · best_for · restore before
update venues set best_for = 'Resort guests and couples wanting a relaxed seaside grill lunch or dinner, or the Sunday brunch, with ocean views.' where slug = 'arwana' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A seaside grill lunch or dinner with an ocean view, or the Sunday brunch, for resort guests and couples';
-- expect: UPDATE 1

-- 6. W-ayana-fitness-centre-why_its_here · ayana-fitness-centre · why_its_here · restore before
update venues set why_its_here = 'The 24-hour fitness centre on the AYANA estate above Jimbaran Bay, part of a wellness complex that also holds steam and sauna rooms, a jacuzzi grotto and cold plunge pool, a salon and a cafe. There is a separate aerobics and yoga studio, and personal trainers can be booked. Lawn tennis, table tennis and billiards are on the same grounds.' where slug = 'ayana-fitness-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The 24-hour gym on the AYANA estate above Jimbaran Bay. Steam and sauna rooms, a jacuzzi grotto, a cold plunge pool and an aerobics and yoga studio share its wellness complex. Personal trainers can be booked, and the grounds have lawn tennis and table tennis.';
-- expect: UPDATE 1

-- 7. W-ayana-fitness-centre-best_for · ayana-fitness-centre · best_for · restore before
update venues set best_for = 'Guests on the AYANA estate who want a round-the-clock gym with sauna and cold plunge, and racquet sports on the same site.' where slug = 'ayana-fitness-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Guests on the AYANA estate who want a round-the-clock gym with sauna and cold plunge, and racquet sports on the same site';
-- expect: UPDATE 1

-- 8. W-azure-beach-restaurant-why_its_here · azure-beach-restaurant · why_its_here · restore before
update venues set why_its_here = 'A Mediterranean beachfront restaurant with a pool on Kelan Beach near Jimbaran, serving locally-sourced seafood under chef Frederic Boulay, with daybeds, direct beach access and no cover charge.' where slug = 'azure-beach-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A beachfront Mediterranean restaurant with a pool on Kelan Beach, near Jimbaran. The seafood is locally sourced, and the chef is Frederic Boulay. There are daybeds, direct beach access and no cover charge.';
-- expect: UPDATE 1

-- 9. W-azure-beach-restaurant-best_for · azure-beach-restaurant · best_for · restore before
update venues set best_for = 'Sunset seafood and an unhurried afternoon by the pool; also a handy last stop before an airport departure.' where slug = 'azure-beach-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset seafood and an unhurried afternoon by the pool, or a last stop before an airport departure';
-- expect: UPDATE 1

-- 10. W-bali-barber-jimbaran-why_its_here · bali-barber-jimbaran · why_its_here · restore before
update venues set why_its_here = 'A Jimbaran branch of Bali Barber, the men''s grooming chain — an easy walk-in for a cut, beard tidy or hot-towel shave near the bay.' where slug = 'bali-barber-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Barber''s Jimbaran branch, part of the men''s grooming chain. You can walk in for a cut, a beard tidy or a hot-towel shave near the bay.';
-- expect: UPDATE 1

-- 11. W-bali-barber-jimbaran-best_for · bali-barber-jimbaran · best_for · restore before
update venues set best_for = 'Men wanting a reliable, walk-in barber near Jimbaran Bay.' where slug = 'bali-barber-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Men after a walk-in cut or shave near Jimbaran Bay';
-- expect: UPDATE 1

-- 12. W-bali-beauty-salon-nusa-dua-best_for · bali-beauty-salon-nusa-dua · best_for · restore before
update venues set best_for = 'Resort-area visitors wanting salon basics off-property.' where slug = 'bali-beauty-salon-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Salon basics off-property while you''re in the resort area';
-- expect: UPDATE 1

-- 13. W-balquisse-heritage-hotel-yoga-jimbaran-why_its_here · balquisse-heritage-hotel-yoga-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Yoga at Balquisse Heritage Hotel, held in the boutique hotel''s tranquil inner-Jimbaran garden.' where slug = 'balquisse-heritage-hotel-yoga-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Yoga classes in the garden of Balquisse Heritage Hotel, a boutique hotel in inner Jimbaran.';
-- expect: UPDATE 1

-- 14. W-balquisse-heritage-hotel-yoga-jimbaran-best_for · balquisse-heritage-hotel-yoga-jimbaran · best_for · restore before
update venues set best_for = 'Guests and neighbours wanting a quiet, small-group class off the tourist track.' where slug = 'balquisse-heritage-hotel-yoga-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Guests and neighbours after a quiet, small-group class off the tourist track';
-- expect: UPDATE 1

-- 15. W-balquisse-spa-jimbaran-why_its_here · balquisse-spa-jimbaran · why_its_here · restore before
update venues set why_its_here = 'The spa at Balquisse, a Moroccan-Balinese boutique heritage hotel in inner Jimbaran, offering treatments in an intimate setting.' where slug = 'balquisse-spa-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The spa at Balquisse, a Moroccan-Balinese boutique heritage hotel in inner Jimbaran, where treatments take place in an intimate setting.';
-- expect: UPDATE 1

-- 16. W-balquisse-spa-jimbaran-best_for · balquisse-spa-jimbaran · best_for · restore before
update venues set best_for = 'Those who want a characterful, non-chain spa away from the beach strip.' where slug = 'balquisse-spa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A characterful, non-chain spa treatment away from the beach strip';
-- expect: UPDATE 1

-- 17. W-bawang-merah-beachfront-why_its_here · bawang-merah-beachfront · why_its_here · restore before
update venues set why_its_here = 'A beachfront seafood restaurant on Kelan Beach at the quiet northern end of Jimbaran Bay, with tables set on the sand and charcoal-grilled whole fish, prawns, squid and lobster sold by weight; nightly Balinese dance performances (around 7–9pm) run alongside the sunset over the Indian Ocean.' where slug = 'bawang-merah-beachfront' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A beachfront seafood restaurant with tables on the sand at Kelan Beach, the quiet northern end of Jimbaran Bay. Whole fish, prawns, squid and lobster are charcoal-grilled and sold by weight. Balinese dancers perform nightly, around 7–9pm, as the sun sets over the Indian Ocean.';
-- expect: UPDATE 1

-- 18. W-bawang-merah-beachfront-best_for · bawang-merah-beachfront · best_for · restore before
update venues set best_for = 'A sunset seafood dinner for couples or groups wanting toes-in-the-sand dining away from Jimbaran''s busier main strip.' where slug = 'bawang-merah-beachfront' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sunset seafood dinner with your toes in the sand, for couples or groups staying clear of Jimbaran''s busier main strip';
-- expect: UPDATE 1

-- 19. W-bejana-ritz-carlton-why_its_here · bejana-ritz-carlton · why_its_here · restore before
update venues set why_its_here = 'The signature Indonesian restaurant at The Ritz-Carlton, Bali in Sawangan (Nusa Dua), set on the cliffs above the Indian Ocean, serving regional Balinese and archipelago dishes across three levels including a Culinary Cave open kitchen; its centrepiece is the Archipelago Rijsttafel, a shared multi-dish Indonesian rice-table feast.' where slug = 'bejana-ritz-carlton' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Indonesian restaurant at The Ritz-Carlton, Bali, on the cliffs above the Indian Ocean at Sawangan, Nusa Dua. Regional Balinese and archipelago dishes are served across three levels, including the Culinary Cave open kitchen. The centrepiece is the Archipelago Rijsttafel, a shared multi-dish rice-table feast.';
-- expect: UPDATE 1

-- 20. W-bejana-ritz-carlton-best_for · bejana-ritz-carlton · best_for · restore before
update venues set best_for = 'An unhurried dinner for travellers who want elevated Indonesian cuisine and cliff-top ocean views over a special evening.' where slug = 'bejana-ritz-carlton' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An unhurried Indonesian dinner on a special evening, with cliff-top ocean views';
-- expect: UPDATE 1

-- 21. W-brook-nusa-dua-why_its_here · brook-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Benoa with a panoramic view of the Garuda statue, the ocean and the airport runway. American, European, Russian, Ukrainian and Asian dishes. Vintage Brooklyn styling and signature cocktails.' where slug = 'brook-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Benoa restaurant whose panoramic view takes in the airport runway as well as the Garuda statue and the ocean. The menu runs from American and European to Russian, Ukrainian and Asian dishes. It is styled like vintage Brooklyn and serves cocktails.';
-- expect: UPDATE 1

-- 22. W-bumbu-bali-why_its_here · bumbu-bali · why_its_here · restore before
update venues set why_its_here = 'A long-running authentic-Balinese restaurant and cooking school founded in 1996 by Swiss chef and cookbook author Heinz von Holzen, serving home- and ceremony-style dishes such as babi guling and a multi-course rijsttafel in a traditional courtyard-compound setting on Nusa Dua''s northern edge.' where slug = 'bumbu-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Balinese restaurant and cooking school on Nusa Dua''s northern edge, founded in 1996 by Swiss chef and cookbook author Heinz von Holzen. Home- and ceremony-style dishes such as babi guling and a multi-course rijsttafel are served in a traditional courtyard compound.';
-- expect: UPDATE 1

-- 23. W-bumbu-bali-best_for · bumbu-bali · best_for · restore before
update venues set best_for = 'Travellers who want to try a wide spread of traditional Balinese cooking, or take a market-and-cooking class, over a relaxed dinner.' where slug = 'bumbu-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Trying a wide spread of traditional Balinese cooking over dinner, or taking a market-and-cooking class';
-- expect: UPDATE 1

-- 24. W-camino-resto-and-bar-why_its_here · camino-resto-and-bar · why_its_here · restore before
update venues set why_its_here = 'Mediterranean kitchen in Jimbaran built around a grill and a smoker. Frutti di mare pasta, grilled fish and salmon. Molten lava cake for dessert.' where slug = 'camino-resto-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Mediterranean kitchen in Jimbaran built around a grill and a smoker. The menu has frutti di mare pasta, grilled fish and salmon, and there''s molten lava cake for dessert.';
-- expect: UPDATE 1

-- 25. W-canna-beach-club-why_its_here · canna-beach-club · why_its_here · restore before
update venues set why_its_here = 'A large multi-zone beachfront club on the southern side of Nusa Dua with a pool, daybeds, water sports and several dining areas including the oceanfront Cliff restaurant, running from daytime lounging into evening entertainment.' where slug = 'canna-beach-club' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A large, multi-zone beachfront club on the southern side of Nusa Dua. It has a pool, daybeds, water sports and several dining areas, the oceanfront Cliff restaurant among them. It runs from daytime lounging into evening entertainment.';
-- expect: UPDATE 1

-- 26. W-canna-beach-club-best_for · canna-beach-club · best_for · restore before
update venues set best_for = 'A full day-to-night outing for families or groups on Nusa Dua''s calm white-sand beach.' where slug = 'canna-beach-club' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A full day-to-night outing for families or groups on Nusa Dua''s calm white-sand beach';
-- expect: UPDATE 1

-- 27. W-club-med-bali-fitness-why_its_here · club-med-bali-fitness · why_its_here · restore before
update venues set why_its_here = 'The Club Med Gym at the all-inclusive Club Med Bali in the Nusa Dua ITDC estate, with a cardio training room, squash and tennis courts. Because the resort is all-inclusive, sport is bundled into the stay: padel, pickleball, basketball, badminton, table tennis, archery, beach volleyball and trapeze, plus aquafitness and water polo in the pool, all with instruction from the resort''s G.O. staff.' where slug = 'club-med-bali-fitness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The gym at the all-inclusive Club Med Bali, on the Nusa Dua ITDC estate, has a cardio room plus squash and tennis courts. Sport comes with the stay, coached by G.O. staff: padel, pickleball, archery, trapeze, plus aquafitness and water polo in the pool.';
-- expect: UPDATE 1

-- 28. W-club-med-bali-fitness-best_for · club-med-bali-fitness · best_for · restore before
update venues set best_for = 'Guests who want sport all day on one bill, from trapeze to padel, rather than a gym and nothing else.' where slug = 'club-med-bali-fitness' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sport all day on one bill, from trapeze to padel, rather than a gym and nothing else';
-- expect: UPDATE 1

-- 29. W-conrad-bali-fitness-centre-why_its_here · conrad-bali-fitness-centre · why_its_here · restore before
update venues set why_its_here = 'The 24-hour fitness centre at Conrad Bali in Tanjung Benoa, part of the Jiwa Spa complex that also holds 17 treatment rooms, garden pavilions, steam room, sauna and jacuzzi. Pilates is on the class list, and the resort has two floodlit tennis courts.' where slug = 'conrad-bali-fitness-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Conrad Bali''s 24-hour gym in Tanjung Benoa, inside the Jiwa Spa complex. The complex also holds 17 treatment rooms, garden pavilions, a steam room, a sauna and a jacuzzi. Pilates is on the class list, and the resort has two floodlit tennis courts.';
-- expect: UPDATE 1

-- 30. W-conrad-bali-fitness-centre-best_for · conrad-bali-fitness-centre · best_for · restore before
update venues set best_for = 'Nusa Dua and Tanjung Benoa guests who want a round-the-clock gym with spa, sauna and floodlit tennis on the same site.' where slug = 'conrad-bali-fitness-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Nusa Dua and Tanjung Benoa guests who want a round-the-clock gym with spa, sauna and floodlit tennis on the same site';
-- expect: UPDATE 1

-- 31. W-courtyard-by-marriott-nusa-dua-gym-why_its_here · courtyard-by-marriott-nusa-dua-gym · why_its_here · restore before
update venues set why_its_here = 'The fitness centre at Courtyard by Marriott Bali Nusa Dua, open to hotel guests 24 hours with staff on the floor from 06:00 to 23:00 and key access outside those hours. It holds cardio and strength equipment, and fitness classes with instructors run free of charge. The resort also has a yoga pavilion and a spa.' where slug = 'courtyard-by-marriott-nusa-dua-gym' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Courtyard by Marriott Bali Nusa Dua''s gym, with cardio and strength equipment, open to hotel guests 24 hours. Staff are on the floor 06:00–23:00, with key access outside those hours. Instructor-led classes are free, and the resort also has a yoga pavilion and a spa.';
-- expect: UPDATE 1

-- 32. W-courtyard-by-marriott-nusa-dua-gym-best_for · courtyard-by-marriott-nusa-dua-gym · best_for · restore before
update venues set best_for = 'Nusa Dua guests who want free instructor-led classes on top of a 24-hour gym.' where slug = 'courtyard-by-marriott-nusa-dua-gym' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Free instructor-led classes on top of a 24-hour gym during a Nusa Dua stay';
-- expect: UPDATE 1

-- 33. W-cuca-restaurant-why_its_here · cuca-restaurant · why_its_here · restore before
update venues set why_its_here = 'A standalone Jimbaran restaurant opened in 2013 by chef Kevin Cherkas (formerly of elBulli, Arzak and Daniel), serving globally inspired tapas, cocktails and desserts built on Indonesian ingredients; known for shared plates like BBQ octopus with Asian gazpacho and its Bali Breakfast dessert, and included in the 2025 Michelin Green Guide.' where slug = 'cuca-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A standalone Jimbaran restaurant opened in 2013 by chef Kevin Cherkas, formerly of elBulli, Arzak and Daniel. Its tapas are globally inspired and built on Indonesian ingredients; so are its cocktails and desserts.';
-- expect: UPDATE 1

-- 34. W-cuca-restaurant-best_for · cuca-restaurant · best_for · restore before
update venues set best_for = 'Couples and groups wanting a relaxed but ambitious tasting-style dinner of creative sharing plates.' where slug = 'cuca-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples and groups after a tasting-style dinner of sharing plates, from BBQ octopus with Asian gazpacho to the Bali Breakfast dessert';
-- expect: UPDATE 1

-- 35. W-dava-steak-and-seafood-why_its_here · dava-steak-and-seafood · why_its_here · restore before
update venues set why_its_here = 'The steakhouse and seafood grill at the AYANA Resort on Jimbaran''s clifftop, serving dry-aged and wagyu beef and Canadian lobster over a wood-fired grill, with a beef sommelier, a salt-cart sommelier, and elevated ocean and sunset views; dinners open in the Martini Bar before moving to the dining room, wine lounge or private rooms.' where slug = 'dava-steak-and-seafood' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The AYANA Resort''s steakhouse and seafood grill, up on Jimbaran''s clifftop with ocean and sunset views. Dry-aged and wagyu beef and Canadian lobster go over a wood-fired grill. A beef sommelier and a salt-cart sommelier are on hand, and dinner starts in the Martini Bar.';
-- expect: UPDATE 1

-- 36. W-dava-steak-and-seafood-best_for · dava-steak-and-seafood · best_for · restore before
update venues set best_for = 'A special-occasion dinner for couples or steak-and-wine lovers who want an upscale grill with a sunset ocean backdrop.' where slug = 'dava-steak-and-seafood' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special-occasion dinner for couples or steak-and-wine lovers who want an upscale grill with a sunset ocean backdrop';
-- expect: UPDATE 1

-- 37. W-dua-kafe-nusa-dua-why_its_here · dua-kafe-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'A stylish all-day café in Nusa Dua a short walk from the beach, known for its macadamia flat white and matcha latte.' where slug = 'dua-kafe-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An all-day café in Nusa Dua, a short walk from the beach. Drinks include a macadamia flat white and a matcha latte.';
-- expect: UPDATE 1

-- 38. W-dua-kafe-nusa-dua-best_for · dua-kafe-nusa-dua · best_for · restore before
update venues set best_for = 'a well-made flat white in Nusa Dua' where slug = 'dua-kafe-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A flat white or a matcha latte in Nusa Dua';
-- expect: UPDATE 1

-- 39. W-fore-coffee-jimbaran-why_its_here · fore-coffee-jimbaran · why_its_here · restore before
update venues set why_its_here = 'One of Indonesia''s largest specialty-coffee chains — reliable and affordable, with several Bali outlets. Fore pulls consistent everyday espresso and signature palm-sugar (aren) lattes in a modern grab-and-go format.' where slug = 'fore-coffee-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Jimbaran branch of Fore, a specialty-coffee chain from Indonesia with several outlets in Bali. It pulls everyday espresso and palm-sugar (aren) lattes in a modern grab-and-go format.';
-- expect: UPDATE 1

-- 40. W-fore-coffee-jimbaran-best_for · fore-coffee-jimbaran · best_for · restore before
update venues set best_for = 'a reliable, affordable specialty coffee; a quick aren latte on the go; an everyday caffeine fix' where slug = 'fore-coffee-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An affordable everyday coffee, or a quick aren latte on the go';
-- expect: UPDATE 1

-- 41. W-fore-coffee-jimbaran-not_for · fore-coffee-jimbaran · not_for · restore before
update venues set not_for = 'a destination-café ambience; a food-forward brunch; a quiet, design-led room for a long laptop session' where slug = 'fore-coffee-jimbaran' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A food-forward brunch or a long laptop session in a quiet, design-led room: the format is grab-and-go';
-- expect: UPDATE 1

-- 42. W-four-seasons-jimbaran-fitness-centre-why_its_here · four-seasons-jimbaran-fitness-centre · why_its_here · restore before
update venues set why_its_here = 'The fitness centre at Four Seasons Resort Bali at Jimbaran Bay, with a fully equipped gym and a sprung-floor aerobics studio. Personal trainers are on hand for one-off advice or a programme built for a longer stay, and there is an oceanfront bale used for training and practice.' where slug = 'four-seasons-jimbaran-fitness-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The gym at Four Seasons Resort Bali at Jimbaran Bay is fully equipped, and the aerobics studio has a sprung floor. Personal trainers give one-off advice or build a programme for a longer stay. There is also an oceanfront bale for training and practice.';
-- expect: UPDATE 1

-- 43. W-four-seasons-jimbaran-fitness-centre-best_for · four-seasons-jimbaran-fitness-centre · best_for · restore before
update venues set best_for = 'Resort guests who want a proper aerobics floor and personal training rather than a room of machines.' where slug = 'four-seasons-jimbaran-fitness-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort guests who want a sprung aerobics floor and personal training rather than a room of machines';
-- expect: UPDATE 1

-- 44. W-four-seasons-jimbaran-yoga-why_its_here · four-seasons-jimbaran-yoga · why_its_here · restore before
update venues set why_its_here = 'The yoga and meditation programme at Four Seasons Resort Bali at Jimbaran Bay, running daily classes across several styles: Yin, Kundalini, hot stone yoga, and Balinese sessions with a local teacher framed around Sekala and Niskala, the seen and unseen worlds. A visiting yoga master is in residence for two weeks each month, and classes also run on the beachfront.' where slug = 'four-seasons-jimbaran-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The yoga and meditation programme at Four Seasons Resort Bali at Jimbaran Bay, with daily classes in Yin, Kundalini and hot stone yoga. A local teacher runs Balinese sessions on Sekala and Niskala (the seen and unseen worlds). Classes also run on the beachfront.';
-- expect: UPDATE 1

-- 45. W-four-seasons-jimbaran-yoga-best_for · four-seasons-jimbaran-yoga · best_for · restore before
update venues set best_for = 'Guests who want variety and depth in a resort yoga schedule, including Balinese practice and periods with a visiting master.' where slug = 'four-seasons-jimbaran-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Variety and depth in a yoga practice, with Balinese sessions and a visiting master in residence two weeks a month';
-- expect: UPDATE 1

-- 46. W-gourmet-and-cafe-nusa-dua-why_its_here · gourmet-and-cafe-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'A café in Nusa Dua with a cosy, considered space serving food and health-forward drinks.' where slug = 'gourmet-and-cafe-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A café in Nusa Dua serving food and health-forward drinks in a cosy, considered space.';
-- expect: UPDATE 1

-- 47. W-gourmet-and-cafe-nusa-dua-best_for · gourmet-and-cafe-nusa-dua · best_for · restore before
update venues set best_for = 'a relaxed daytime café stop in Nusa Dua' where slug = 'gourmet-and-cafe-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A daytime stop for food and a health-forward drink in Nusa Dua';
-- expect: UPDATE 1

-- 48. W-grand-hyatt-bali-yoga-why_its_here · grand-hyatt-bali-yoga · why_its_here · restore before
update venues set why_its_here = 'The yoga programme at Grand Hyatt Bali, run from a dedicated studio in the Bay Club and outdoors on the resort lawns overlooking the water lily pond and the beach beyond. Sessions run daily.' where slug = 'grand-hyatt-bali-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Grand Hyatt Bali runs daily yoga sessions from a dedicated studio in the Bay Club, and outdoors on the resort lawns. The lawns overlook the water lily pond, with the beach beyond.';
-- expect: UPDATE 1

-- 49. W-grand-hyatt-bali-yoga-best_for · grand-hyatt-bali-yoga · best_for · restore before
update venues set best_for = 'Guests who would rather practise outdoors on the lawns than in a studio, with an indoor room as the fallback.' where slug = 'grand-hyatt-bali-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Guests who would rather practise outdoors on the lawns than in a studio, with an indoor room as the fallback';
-- expect: UPDATE 1

-- 50. W-healing-village-spa-at-four-seasons-jimbaran-jimbaran-why_its_here · healing-village-spa-at-four-seasons-jimbaran-jimbaran · why_its_here · restore before
update venues set why_its_here = 'The signature Healing Village Spa at the Four Seasons Resort Bali at Jimbaran Bay, set on the resort''s hillside with holistic, wellness-led treatments.' where slug = 'healing-village-spa-at-four-seasons-jimbaran-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Healing Village Spa is on the hillside of Four Seasons Resort Bali at Jimbaran Bay, and its treatments are holistic and wellness-led.';
-- expect: UPDATE 1

-- 51. W-healing-village-spa-at-four-seasons-jimbaran-jimbaran-best_for · healing-village-spa-at-four-seasons-jimbaran-jimbaran · best_for · restore before
update venues set best_for = 'Those seeking a top-tier destination spa experience and a five-star price.' where slug = 'healing-village-spa-at-four-seasons-jimbaran-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A destination-spa visit for anyone prepared to pay a five-star price';
-- expect: UPDATE 1

-- 52. W-intercontinental-bali-resort-beauty-services-jimbaran-why_its_here · intercontinental-bali-resort-beauty-services-jimbaran · why_its_here · restore before
update venues set why_its_here = 'The salon and beauty services at the InterContinental Bali Resort on Jimbaran Bay, offering hair, nails and grooming alongside the resort''s Spa Uluwatu.' where slug = 'intercontinental-bali-resort-beauty-services-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The salon and beauty services at the InterContinental Bali Resort on Jimbaran Bay cover hair, nails and grooming, alongside the resort''s Spa Uluwatu.';
-- expect: UPDATE 1

-- 53. W-intercontinental-bali-resort-beauty-services-jimbaran-best_for · intercontinental-bali-resort-beauty-services-jimbaran · best_for · restore before
update venues set best_for = 'Resort guests and visitors wanting salon treatments in a beachfront five-star setting.' where slug = 'intercontinental-bali-resort-beauty-services-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Salon treatments in a beachfront five-star setting, for resort guests or visitors';
-- expect: UPDATE 1

-- 54. W-izakaya-by-oku-why_its_here · izakaya-by-oku · why_its_here · restore before
update venues set why_its_here = 'The Japanese restaurant at The Apurva Kempinski Bali in Nusa Dua, an offshoot of the OKU restaurant in Jakarta, serving contemporary izakaya-style dishes in a bistro-chic room built around an open kitchen where diners watch the chefs work.' where slug = 'izakaya-by-oku' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Apurva Kempinski Bali''s Japanese restaurant in Nusa Dua, an offshoot of OKU in Jakarta. Contemporary izakaya-style dishes come out of an open kitchen at the centre of a bistro room, so you can watch the chefs work.';
-- expect: UPDATE 1

-- 55. W-izakaya-by-oku-best_for · izakaya-by-oku · best_for · restore before
update venues set best_for = 'Guests of the Apurva Kempinski or visitors wanting a polished, reservation-only Japanese dinner in Nusa Dua.' where slug = 'izakaya-by-oku' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Apurva Kempinski guests or visitors after a polished Japanese dinner in Nusa Dua';
-- expect: UPDATE 1

-- 56. W-izakaya-by-oku-not_for · izakaya-by-oku · not_for · restore NULL
update venues set not_for = null where slug = 'izakaya-by-oku' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A walk-in dinner, because it is reservation-only';
-- expect: UPDATE 1

-- 57. W-jimbaran-bay-beach-resort-spa-jimbaran-why_its_here · jimbaran-bay-beach-resort-spa-jimbaran · why_its_here · restore before
update venues set why_its_here = 'The spa at Jimbaran Bay Beach Resort near Kedonganan, offering Balinese massage and treatments steps from the sand.' where slug = 'jimbaran-bay-beach-resort-spa-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The spa at Jimbaran Bay Beach Resort near Kedonganan does Balinese massage and other treatments, steps from the sand.';
-- expect: UPDATE 1

-- 58. W-jimbaran-bay-beach-resort-spa-jimbaran-best_for · jimbaran-bay-beach-resort-spa-jimbaran · best_for · restore before
update venues set best_for = 'Beach-day visitors wanting an easy, beachfront massage.' where slug = 'jimbaran-bay-beach-resort-spa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An easy beachfront massage on a beach day';
-- expect: UPDATE 1

-- 59. W-jimbaran-hair-beauty-studio-why_its_here · jimbaran-hair-beauty-studio · why_its_here · restore before
update venues set why_its_here = 'A local hair-and-beauty studio in Jimbaran offering cuts, colour, nails and waxing.' where slug = 'jimbaran-hair-beauty-studio' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A local hair-and-beauty studio in Jimbaran for cuts, colour, nails and waxing.';
-- expect: UPDATE 1

-- 60. W-jimbaran-hair-beauty-studio-best_for · jimbaran-hair-beauty-studio · best_for · restore before
update venues set best_for = 'Visitors staying in Jimbaran who want salon basics without heading to Kuta.' where slug = 'jimbaran-hair-beauty-studio' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Salon basics while you''re staying in Jimbaran, without heading to Kuta';
-- expect: UPDATE 1

-- 61. W-karma-spa-at-karma-jimbaran-jimbaran-why_its_here · karma-spa-at-karma-jimbaran-jimbaran · why_its_here · restore before
update venues set why_its_here = 'The Karma Spa at Karma Jimbaran, a beachside villa resort near Jimbaran Bay, offering treatments (09:00–19:00).' where slug = 'karma-spa-at-karma-jimbaran-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Karma Spa at Karma Jimbaran, a beachside villa resort near Jimbaran Bay, runs treatments from 09:00 to 19:00.';
-- expect: UPDATE 1

-- 62. W-karma-spa-at-karma-jimbaran-jimbaran-best_for · karma-spa-at-karma-jimbaran-jimbaran · best_for · restore before
update venues set best_for = 'Karma resort guests wanting a spa session in a relaxed beachside setting.' where slug = 'karma-spa-at-karma-jimbaran-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A beachside spa session while staying at the Karma resort';
-- expect: UPDATE 1

-- 63. W-kayumanis-resto-jimbaran-why_its_here · kayumanis-resto-jimbaran · why_its_here · restore before
update venues set why_its_here = 'The Indonesian restaurant of the Kayumanis Jimbaran Private Estate & Spa, set in a garden of coconut palms and housed in a replica Javanese joglo built almost entirely of hardwood, serving archipelago classics built around market-fresh produce and catch-of-the-day seafood, with signature dishes like betutu duck, beef ribs and charcoal-grilled prawns.' where slug = 'kayumanis-resto-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Indonesian restaurant of the Kayumanis Jimbaran Private Estate & Spa: a replica Javanese joglo, almost entirely hardwood, in a garden of coconut palms. Archipelago classics are built on market-fresh produce and catch-of-the-day seafood; betutu duck, beef ribs and charcoal-grilled prawns are among them.';
-- expect: UPDATE 1

-- 64. W-kayumanis-resto-jimbaran-best_for · kayumanis-resto-jimbaran · best_for · restore before
update venues set best_for = 'A relaxed sit-down dinner of regional Indonesian cooking in a resort garden setting, for couples or travellers wanting an alternative to Jimbaran Bay''s beachfront seafood grills.' where slug = 'kayumanis-resto-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sit-down dinner of regional Indonesian cooking in a resort garden, as a change from Jimbaran Bay''s beachfront seafood grills';
-- expect: UPDATE 1

-- 65. W-kayuputi-why_its_here · kayuputi · why_its_here · restore before
update venues set why_its_here = 'The signature fine-dining restaurant at The St. Regis Bali Resort in Nusa Dua, serving Pan-Asian haute cuisine as multi-course degustation menus in a white, open-kitchen room facing the Indian Ocean, backed by an extensive wine list and a long-running champagne brunch.' where slug = 'kayuputi' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The fine-dining restaurant at The St. Regis Bali Resort in Nusa Dua, in a white, open-kitchen room facing the Indian Ocean. Pan-Asian haute cuisine comes as multi-course degustation menus, backed by an extensive wine list, and there is a champagne brunch.';
-- expect: UPDATE 1

-- 66. W-kayuputi-best_for · kayuputi · best_for · restore before
update venues set best_for = 'A special-occasion tasting-menu dinner or the weekend champagne brunch for travellers after upscale oceanfront dining.' where slug = 'kayuputi' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special-occasion tasting-menu dinner by the ocean, or the weekend champagne brunch';
-- expect: UPDATE 1

-- 67. W-kenja-ikan-bakar-nusa-dua-why_its_here · kenja-ikan-bakar-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'A sit-down Indonesian grilled-seafood restaurant on Jl. Pantai Mengiat, walkable from the Nusa Dua beach/ITDC area, specialising in ikan bakar and grilled fish and shellfish, with evening live music.' where slug = 'kenja-ikan-bakar-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ikan bakar and other grilled fish and shellfish are the speciality of this sit-down Indonesian restaurant on Jl. Pantai Mengiat. It is walkable from the Nusa Dua beach and ITDC area, with live music in the evening.';
-- expect: UPDATE 1

-- 68. W-kenja-ikan-bakar-nusa-dua-best_for · kenja-ikan-bakar-nusa-dua · best_for · restore before
update venues set best_for = 'dinner with grilled fish and seafood near Nusa Dua beach; travellers wanting a comfortable seated seafood meal without going to Jimbaran; those who like live music' where slug = 'kenja-ikan-bakar-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A comfortable, seated seafood dinner near Nusa Dua beach without the trip to Jimbaran';
-- expect: UPDATE 1

-- 69. W-kenja-ikan-bakar-nusa-dua-not_for · kenja-ikan-bakar-nusa-dua · not_for · restore before
update venues set not_for = 'budget travellers after hole-in-the-wall warung prices' where slug = 'kenja-ikan-bakar-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget meal at warung prices. This is a sit-down restaurant';
-- expect: UPDATE 1

-- 70. W-koral-why_its_here · koral · why_its_here · restore before
update venues set why_its_here = 'Bali''s first aquarium restaurant, set within The Apurva Kempinski Bali on Nusa Dua, where tables sit against large tanks holding 80-plus marine species; the kitchen serves seafood-focused degustation menus drawing on Indonesian coastal flavours and local ingredients, with wine pairings and a cocktail station.' where slug = 'koral' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An aquarium restaurant inside The Apurva Kempinski Bali on Nusa Dua, where tables sit against large tanks holding 80-plus marine species. Degustation menus focus on seafood, drawing on Indonesian coastal flavours and local ingredients, with wine pairings and a cocktail station.';
-- expect: UPDATE 1

-- 71. W-koral-best_for · koral · best_for · restore before
update venues set best_for = 'A special-occasion dinner for couples or design-minded diners who want a multi-course seafood tasting menu in an unusual aquarium setting.' where slug = 'koral' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A multi-course seafood tasting menu in an unusual aquarium setting, on a special occasion for couples or design-minded diners';
-- expect: UPDATE 1

-- 72. W-kriya-spa-at-grand-hyatt-bali-nusa-dua-why_its_here · kriya-spa-at-grand-hyatt-bali-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Kriya Spa — meaning ''rituals'' — sits within the Grand Hyatt Bali''s water-palace-inspired grounds, with garden gazebos beside tropical pools. Its menu is organised around themed rituals (Bliss, Harmony, Purity, Energy) rooted in traditional Balinese and Javanese wellness.' where slug = 'kriya-spa-at-grand-hyatt-bali-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kriya Spa sits in the Grand Hyatt Bali''s water-palace-inspired grounds, with garden gazebos beside tropical pools. Its menu is organised around themed rituals (Bliss, Harmony, Purity, Energy) rooted in traditional Balinese and Javanese wellness.';
-- expect: UPDATE 1

-- 73. W-kriya-spa-at-grand-hyatt-bali-nusa-dua-best_for · kriya-spa-at-grand-hyatt-bali-nusa-dua · best_for · restore before
update venues set best_for = 'Resort guests and couples who want a traditional Balinese massage in an open garden-pavilion setting; a heritage-style Lulur ritual.' where slug = 'kriya-spa-at-grand-hyatt-bali-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A traditional Balinese massage or a heritage-style Lulur ritual in an open garden pavilion, for resort guests and couples';
-- expect: UPDATE 1

-- 74. W-kriya-spa-at-grand-hyatt-bali-nusa-dua-not_for · kriya-spa-at-grand-hyatt-bali-nusa-dua · not_for · restore before
update venues set not_for = 'Anyone looking for a clinical urban day-spa or the cheapest option in the area.' where slug = 'kriya-spa-at-grand-hyatt-bali-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A clinical urban day spa or the cheapest option in the area: Kriya''s treatments are themed rituals in garden gazebos';
-- expect: UPDATE 1

-- 75. W-kubu-garden-restaurant-why_its_here · kubu-garden-restaurant · why_its_here · restore before
update venues set why_its_here = 'An all-day restaurant and coffee spot on Jl. Pratama in Tanjung Benoa, part of Kubu Garden Suites, serving Indonesian, Western and Italian dishes with bread baked in-house.' where slug = 'kubu-garden-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The all-day restaurant and coffee spot of Kubu Garden Suites, on Jl. Pratama in Tanjung Benoa. The kitchen cooks Indonesian, Western and Italian dishes, and the bread is baked in-house.';
-- expect: UPDATE 1

-- 76. W-kubu-garden-restaurant-best_for · kubu-garden-restaurant · best_for · restore before
update venues set best_for = 'A calm, well-priced sit-down meal or all-day breakfast near Nusa Dua, without a scene or a view.' where slug = 'kubu-garden-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm sit-down meal or an all-day breakfast near Nusa Dua';
-- expect: UPDATE 1

-- 77. W-kubu-garden-restaurant-not_for · kubu-garden-restaurant · not_for · restore NULL
update venues set not_for = null where slug = 'kubu-garden-restaurant' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A view or a scene, because it has neither';
-- expect: UPDATE 1

-- 78. W-manarai-beach-house-why_its_here · manarai-beach-house · why_its_here · restore before
update venues set why_its_here = 'An ISMAYA Group beach club on the white-sand beachfront of the Sofitel Bali Nusa Dua Beach Resort, laid out as a continuous run from restaurant through outdoor lounge to two infinity pools and rows of daybeds on the sand, with three bars, an all-day international-and-Balinese menu and DJ-driven sunset sessions.' where slug = 'manarai-beach-house' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An ISMAYA beach club on the white-sand beachfront of the Sofitel Bali Nusa Dua Beach Resort. A restaurant leads through an outdoor lounge to two infinity pools and daybeds on the sand. Three bars, an all-day international and Balinese menu, and DJ sets at sunset.';
-- expect: UPDATE 1

-- 79. W-manarai-beach-house-best_for · manarai-beach-house · best_for · restore before
update venues set best_for = 'Resort-goers and couples wanting a full-day pool-and-beach club with no entrance fee or minimum spend, best from midday into the golden-hour DJ hours.' where slug = 'manarai-beach-house' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort-goers and couples after a full pool-and-beach day with no entrance fee or minimum spend, from midday into the golden-hour DJ hours';
-- expect: UPDATE 1

-- 80. W-martha-tilaar-salon-day-spa-jimbaran-why_its_here · martha-tilaar-salon-day-spa-jimbaran · why_its_here · restore before
update venues set why_its_here = 'A Jimbaran salon-and-spa from Martha Tilaar, Indonesia''s homegrown beauty house, blending traditional Javanese-Balinese rituals with everyday hair and nail services.' where slug = 'martha-tilaar-salon-day-spa-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Jimbaran salon and day spa from Martha Tilaar, Indonesia''s homegrown beauty house. Traditional Javanese-Balinese rituals sit alongside everyday hair and nail services.';
-- expect: UPDATE 1

-- 81. W-martha-tilaar-salon-day-spa-jimbaran-best_for · martha-tilaar-salon-day-spa-jimbaran · best_for · restore before
update venues set best_for = 'Those who want authentic Indonesian spa rituals from a trusted local brand.' where slug = 'martha-tilaar-salon-day-spa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Traditional Indonesian spa rituals from a local brand';
-- expect: UPDATE 1

-- 82. W-mulia-fitness-centre-nusa-dua-why_its_here · mulia-fitness-centre-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'The fitness centre at The Mulia is a large, fully-equipped resort gym with cardio and weights, a movement studio running group classes, and racquet facilities including tennis and pickleball — part of the resort''s extensive leisure offering on Geger beach.' where slug = 'mulia-fitness-centre-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Mulia''s resort gym on Geger beach is large and fully equipped, with cardio and weights. A movement studio runs group classes, and the racquet facilities include tennis and pickleball.';
-- expect: UPDATE 1

-- 83. W-mulia-fitness-centre-nusa-dua-best_for · mulia-fitness-centre-nusa-dua · best_for · restore before
update venues set best_for = 'Resort guests and active travellers who want a proper, well-equipped gym and group classes without leaving the Nusa Dua strip.' where slug = 'mulia-fitness-centre-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort guests who want a well-equipped gym and group classes without leaving the Nusa Dua strip';
-- expect: UPDATE 1

-- 84. W-mulia-spa-nusa-dua-why_its_here · mulia-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'The 20-room spa at The Mulia is one of Bali''s largest and most decorated resort spas, built around an extensive hydrotherapy journey — Cleopatra-style hydrotonic pools with underwater jets, hot and cold plunge pools, Finnish saunas, steam and ice rooms — that guests move through before a tailored, Ayurvedic-inspired treatment.' where slug = 'mulia-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Mulia''s 20-room spa, built around a hydrotherapy circuit that guests move through before a tailored, Ayurvedic-inspired treatment. The circuit takes in hot and cold plunge pools, Finnish saunas, steam and ice rooms, and Cleopatra-style hydrotonic pools with underwater jets.';
-- expect: UPDATE 1

-- 85. W-mulia-spa-nusa-dua-best_for · mulia-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Travellers who want a full half-day wellness ritual with pools, saunas and a long massage, not just a quick treatment; couples staying on the Nusa Dua/Sawangan strip.' where slug = 'mulia-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A full half-day wellness ritual with pools, saunas and a long massage, for couples staying on the Nusa Dua/Sawangan strip';
-- expect: UPDATE 1

-- 86. W-mulia-spa-nusa-dua-not_for · mulia-spa-nusa-dua · not_for · restore before
update venues set not_for = 'Anyone after a fast, low-key neighbourhood massage or a budget price point.' where slug = 'mulia-spa-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A fast, low-key neighbourhood massage or a budget price point. The ritual here takes half a day';
-- expect: UPDATE 1

-- 87. W-nasi-banjar-mbok-mang-best_for · nasi-banjar-mbok-mang · best_for · restore before
update venues set best_for = 'early risers wanting an authentic pork-based Balinese breakfast or lunch; travellers eating pork; those wanting a genuinely local, non-touristy warung near Nusa Dua' where slug = 'nasi-banjar-mbok-mang' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An early pork-based Balinese breakfast or lunch at a local, non-touristy warung near Nusa Dua';
-- expect: UPDATE 1

-- 88. W-nasi-banjar-mbok-mang-not_for · nasi-banjar-mbok-mang · not_for · restore before
update venues set not_for = 'halal diners and non-pork eaters; late risers or dinner plans (morning-only, sells out early)' where slug = 'nasi-banjar-mbok-mang' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Halal diners, non-pork eaters and late risers: the plate is pork-forward, and the warung opens mornings only';
-- expect: UPDATE 1

-- 89. W-nusa-dua-beach-grill-why_its_here · nusa-dua-beach-grill · why_its_here · restore before
update venues set why_its_here = 'An independent, family-run beachfront restaurant on the sand at Geger Beach in Nusa Dua, running since 1995, where fresh grilled seafood (prawns, fish, lobster) shares the menu with Indonesian and Western dishes and pastas, all looking over the calm turquoise Geger Lagoon a short walk from The Mulia.' where slug = 'nusa-dua-beach-grill' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An independent, family-run beachfront restaurant on the sand at Geger Beach, Nusa Dua, running since 1995. Grilled seafood (prawns, fish, lobster) shares the menu with Indonesian and Western dishes and pastas. Tables look over the calm turquoise Geger Lagoon, a short walk from The Mulia.';
-- expect: UPDATE 1

-- 90. W-nusa-dua-beach-grill-best_for · nusa-dua-beach-grill · best_for · restore before
update venues set best_for = 'A relaxed all-day beach outing — breakfast, long lunch or sunset dinner — for families who want fresh seafood on the sand without resort prices, easily paired with a swim or snorkel in the lagoon.' where slug = 'nusa-dua-beach-grill' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families after fresh seafood on the sand without resort prices, from breakfast to sunset dinner, with a swim or snorkel in the lagoon';
-- expect: UPDATE 1

-- 91. W-nyoman-cafe-why_its_here · nyoman-cafe · why_its_here · restore before
update venues set why_its_here = 'A beachfront seafood grill on the Jimbaran Bay sands (Muaya Beach strip), running since 1994, where you pick lobster, prawns, crab, snapper and squid from the tanks to be barbecued and served at candlelit tables on the beach.' where slug = 'nyoman-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Nyoman Café has been grilling seafood on the Jimbaran Bay sands, along the Muaya Beach strip, since 1994. You pick lobster, prawns, crab, snapper or squid from the tanks to be barbecued and served at candlelit tables on the beach.';
-- expect: UPDATE 1

-- 92. W-nyoman-cafe-best_for · nyoman-cafe · best_for · restore before
update venues set best_for = 'Couples and groups wanting a relaxed sunset seafood dinner with your feet near the sand.' where slug = 'nyoman-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A candlelit seafood dinner at sunset, feet near the sand, for couples and groups';
-- expect: UPDATE 1

-- 93. W-pantai-jimbaran-why_its_here · pantai-jimbaran · why_its_here · restore before
update venues set why_its_here = 'A curving bay south of the airport, Badung, known for calm water, sunset views and beachfront seafood grills.' where slug = 'pantai-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A curving bay south of the airport in Badung, with calm water, sunset views and beachfront seafood grills.';
-- expect: UPDATE 1

-- 94. W-pantai-jimbaran-best_for · pantai-jimbaran · best_for · restore before
update venues set best_for = 'a sunset seafood dinner on the sand; calmer swimming than Kuta' where slug = 'pantai-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sunset seafood dinner on the sand, or a swim in calmer water than Kuta''s';
-- expect: UPDATE 1

-- 95. W-piasan-why_its_here · piasan · why_its_here · restore before
update venues set why_its_here = 'An Italian restaurant at Kayumanis Nusa Dua Private Villa & Spa inside the ITDC resort enclave, serving homemade pasta, wood-fired pizza and prime cuts in a glass-and-bamboo room overlooking manicured gardens; its signature is the Bistecca di Angus Nero alla Griglia, a chargrilled Black Angus steak with risotto, portobello and red-wine sauce.' where slug = 'piasan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Italian restaurant at Kayumanis Nusa Dua Private Villa & Spa, in a glass-and-bamboo room over manicured gardens. Homemade pasta and wood-fired pizza sit beside prime cuts. The Bistecca di Angus Nero alla Griglia is chargrilled Black Angus steak with risotto, portobello and red-wine sauce.';
-- expect: UPDATE 1

-- 96. W-piasan-best_for · piasan · best_for · restore before
update venues set best_for = 'Couples or small groups wanting an unhurried Italian dinner in a quiet garden setting away from the beach crowds.' where slug = 'piasan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples or small groups after an unhurried Italian dinner in a quiet garden, away from the beach crowds';
-- expect: UPDATE 1

-- 97. W-piramid-spa-why_its_here · piramid-spa · why_its_here · restore before
update venues set why_its_here = 'A large day spa in Jimbaran with pyramid-shaped treatment huts set over a koi pond, offering Balinese massage, body scrubs and specialty treatments, plus an on-site cafe.' where slug = 'piramid-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A large Jimbaran day spa whose treatment huts are pyramid-shaped and stand over a koi pond. You can book Balinese massage, body scrubs or specialty treatments, and there is a cafe on site.';
-- expect: UPDATE 1

-- 98. W-piramid-spa-best_for · piramid-spa · best_for · restore before
update venues set best_for = 'An affordable, photogenic spa session — often as a couples'' outing in the private pyramid rooms.' where slug = 'piramid-spa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An affordable, photogenic spa session, often a couples'' outing in the private pyramid rooms';
-- expect: UPDATE 1

-- 99. W-radja-seafood-cafe-why_its_here · radja-seafood-cafe · why_its_here · restore before
update venues set why_its_here = 'A beachfront seafood grill on Muaya Beach in Jimbaran Bay, where you pick fish, prawns, clams and lobster from an iced display to be charcoal-grilled and eaten at tables set out on the sand; known for its fresh grilled snapper and prawns and for sunset views over the bay.' where slug = 'radja-seafood-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Radja is a beachfront seafood grill on Muaya Beach in Jimbaran Bay, with tables set out on the sand. You choose fish, prawns, clams or lobster from an iced display, and it goes on the charcoal grill. The sun sets over the bay.';
-- expect: UPDATE 1

-- 100. W-radja-seafood-cafe-best_for · radja-seafood-cafe · best_for · restore before
update venues set best_for = 'Couples and groups wanting a casual feet-in-the-sand seafood dinner timed to the Jimbaran sunset.' where slug = 'radja-seafood-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Timing a casual seafood dinner on the sand to the Jimbaran sunset, as a couple or a group';
-- expect: UPDATE 1

-- 101. W-rev-v-wellness-resort-fitness-best_for · rev-v-wellness-resort-fitness · best_for · restore before
update venues set best_for = 'Guests on a structured wellness or fitness programme.' where slug = 'rev-v-wellness-resort-fitness' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Guests on a structured wellness or fitness programme';
-- expect: UPDATE 1

-- 102. W-revi-vo-spa-wellness-nusa-dua-best_for · revi-vo-spa-wellness-nusa-dua · best_for · restore before
update venues set best_for = 'Travellers who want a structured, results-oriented multi-day wellness programme, or a serious treatment beyond a standard hotel spa.' where slug = 'revi-vo-spa-wellness-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A structured, results-oriented multi-day wellness programme, or a treatment beyond a standard hotel spa';
-- expect: UPDATE 1

-- 103. W-revi-vo-spa-wellness-nusa-dua-not_for · revi-vo-spa-wellness-nusa-dua · not_for · restore before
update venues set not_for = 'Anyone after a quick, casual walk-in massage rather than a programme-led wellness experience.' where slug = 'revi-vo-spa-wellness-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick, casual walk-in massage, because the spa is built around doctor-guided programmes';
-- expect: UPDATE 1

-- 104. W-revi-vo-yoga-mindfulness-nusa-dua-why_its_here · revi-vo-yoga-mindfulness-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'The yoga and mindfulness programme at REVĪVŌ Wellness Resort in Sawangan, Nusa Dua, run in a dedicated yoga space and on an aerial-yoga deck, with guided meditation woven into its wellness retreats.' where slug = 'revi-vo-yoga-mindfulness-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'REVĪVŌ Wellness Resort in Sawangan, Nusa Dua, runs its yoga and mindfulness programme in a dedicated yoga space and on an aerial-yoga deck. Guided meditation is part of its wellness retreats.';
-- expect: UPDATE 1

-- 105. W-revi-vo-yoga-mindfulness-nusa-dua-best_for · revi-vo-yoga-mindfulness-nusa-dua · best_for · restore before
update venues set best_for = 'Wellness-retreat guests and travellers wanting structured yoga, aerial yoga and guided mindfulness in a cliff-top setting.' where slug = 'revi-vo-yoga-mindfulness-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Structured yoga, aerial yoga and guided mindfulness on a cliff top, for retreat guests and other travellers';
-- expect: UPDATE 1

-- 106. W-revi-vo-yoga-mindfulness-nusa-dua-not_for · revi-vo-yoga-mindfulness-nusa-dua · not_for · restore before
update venues set not_for = 'Anyone after a cheap drop-in neighbourhood class rather than a retreat-style programme.' where slug = 'revi-vo-yoga-mindfulness-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A cheap drop-in neighbourhood class — the yoga here comes as a retreat-style programme';
-- expect: UPDATE 1

-- 107. W-signa-cafe-why_its_here · signa-cafe · why_its_here · restore before
update venues set why_its_here = 'Family-run cafe on Jl. Raya Kampial in Benoa. Coffee, gourmet pizza, pasta and all-day breakfast. Wraps, desserts and cocktails. Dine-in, delivery and takeaway.' where slug = 'signa-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A family runs this Benoa cafe on Jl. Raya Kampial, and breakfast is served all day. There''s coffee, plus gourmet pizza, pasta, wraps, desserts and cocktails. It also does delivery and takeaway.';
-- expect: UPDATE 1

-- 108. W-sofitel-bali-fitness-centre-nusa-dua-why_its_here · sofitel-bali-fitness-centre-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'SoFIT is the fitness centre at Sofitel Bali Nusa Dua Beach Resort — a beachfront gym with cardio and strength equipment plus sauna and steam, running a schedule of classes from boxing and HIIT to aqua fitness.' where slug = 'sofitel-bali-fitness-centre-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'SoFIT is the beachfront gym at Sofitel Bali Nusa Dua Beach Resort, with cardio and strength equipment plus sauna and steam. Its class schedule runs from boxing and HIIT to aqua fitness.';
-- expect: UPDATE 1

-- 109. W-sofitel-bali-fitness-centre-nusa-dua-best_for · sofitel-bali-fitness-centre-nusa-dua · best_for · restore before
update venues set best_for = 'Sofitel and Nusa Dua guests who want a beachfront workout with a class timetable and recovery facilities.' where slug = 'sofitel-bali-fitness-centre-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A beachfront workout with a class timetable and recovery facilities, for Sofitel and Nusa Dua guests';
-- expect: UPDATE 1

-- 110. W-sofitel-bali-fitness-centre-nusa-dua-not_for · sofitel-bali-fitness-centre-nusa-dua · not_for · restore before
update venues set not_for = 'Travellers wanting a serious powerlifting-focused gym or a standalone budget option.' where slug = 'sofitel-bali-fitness-centre-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A powerlifting-focused gym or a standalone budget option: SoFIT is a resort gym with a class timetable';
-- expect: UPDATE 1

-- 111. W-sofitel-bali-yoga-why_its_here · sofitel-bali-yoga · why_its_here · restore before
update venues set why_its_here = 'Yoga at Sofitel Bali Nusa Dua runs on Mondays, Thursdays and Sundays at IDR 150,000++ per person for an hour. Private yoga, meditation, Qi Gong and inner-power sessions can be arranged for an added fee, and beach yoga sits alongside aqua aerobics, boot camps and archery on the resort activity list.' where slug = 'sofitel-bali-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sofitel Bali Nusa Dua runs yoga on Mondays, Thursdays and Sundays, at IDR 150,000++ per person for an hour. Private yoga and meditation cost extra, and so do Qi Gong and inner-power sessions. Beach yoga is on the resort activity list too.';
-- expect: UPDATE 1

-- 112. W-sofitel-bali-yoga-best_for · sofitel-bali-yoga · best_for · restore before
update venues set best_for = 'Nusa Dua guests who want a paid scheduled class a few times a week, with private sessions available on request.' where slug = 'sofitel-bali-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Nusa Dua guests who want a paid scheduled class a few times a week, with private sessions available on request';
-- expect: UPDATE 1

-- 113. W-soleil-at-mulia-why_its_here · soleil-at-mulia · why_its_here · restore before
update venues set why_its_here = 'The signature beachfront restaurant at The Mulia, Mulia Resort & Villas in Nusa Dua, serving Mediterranean and Pan-Asian dishes such as handcrafted pastas and grilled seafood in indoor and terrace settings facing the Indian Ocean; best known for its long-running Sunday Brunch with a seafood bar, live grill stations and Italian antipasti.' where slug = 'soleil-at-mulia' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The beachfront restaurant at The Mulia, Mulia Resort & Villas in Nusa Dua, facing the Indian Ocean from indoor and terrace tables. Mediterranean and Pan-Asian dishes run from handcrafted pastas to grilled seafood. Sunday Brunch adds a seafood bar, live grill stations and Italian antipasti.';
-- expect: UPDATE 1

-- 114. W-soleil-at-mulia-best_for · soleil-at-mulia · best_for · restore before
update venues set best_for = 'A resort occasion meal or its Sunday Brunch (11am–3pm) for couples and groups wanting oceanfront dining in Nusa Dua.' where slug = 'soleil-at-mulia' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples and groups after an oceanfront occasion meal, or the Sunday Brunch (11am–3pm)';
-- expect: UPDATE 1

-- 115. W-st-regis-bali-athletic-club-why_its_here · st-regis-bali-athletic-club · why_its_here · restore before
update venues set why_its_here = 'The fitness centre at The St. Regis Bali Resort in Nusa Dua, open 24 hours and kitted out with Life Fitness equipment, with separate zones for strength, cardio and movement work. It sits inside the resort''s Iridium Spa, and personal trainers can be booked.' where slug = 'st-regis-bali-athletic-club' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The St. Regis Bali Resort''s 24-hour gym sits inside its Iridium Spa in Nusa Dua. Life Fitness equipment is split into zones for strength, cardio and movement work, and personal trainers can be booked.';
-- expect: UPDATE 1

-- 116. W-st-regis-bali-athletic-club-best_for · st-regis-bali-athletic-club · best_for · restore before
update venues set best_for = 'Resort guests in Nusa Dua who want a full 24-hour gym and the option of a personal trainer on site.' where slug = 'st-regis-bali-athletic-club' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A full 24-hour gym with the option of a personal trainer, without leaving the resort';
-- expect: UPDATE 1

-- 117. W-sundara-why_its_here · sundara · why_its_here · restore before
update venues set why_its_here = 'The beach club and beachfront restaurant at the Four Seasons Resort Bali at Jimbaran Bay, terracing down from a bar and daybeds to a 57-metre infinity pool and the sands of Jimbaran Bay, with fire-led cooking of seafood and charred meats plus a rosé-soaked Sunday brunch.' where slug = 'sundara' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The beach club and beachfront restaurant at the Four Seasons Resort Bali at Jimbaran Bay. It steps down from a bar and daybeds to a 57-metre infinity pool and the sand. Seafood and charred meats are cooked over fire, and Sunday brings a rosé brunch.';
-- expect: UPDATE 1

-- 118. W-sundara-best_for · sundara · best_for · restore before
update venues set best_for = 'Sunset drinks and daybeds by the pool, or a special-occasion seafood dinner and the Sunday rosé brunch.' where slug = 'sundara' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset drinks and daybeds by the pool, or a special-occasion seafood dinner and the Sunday rosé brunch';
-- expect: UPDATE 1

-- 119. W-sunset-beach-bar-and-grill-why_its_here · sunset-beach-bar-and-grill · why_its_here · restore before
update venues set why_its_here = 'The open-air, toes-in-sand beach bar of the InterContinental Bali Resort on Jimbaran Bay, set among coconut palms on the white sand with 180-degree views west over the water, serving grilled dishes and cocktails to a soundtrack of daily live music as the sun goes down.' where slug = 'sunset-beach-bar-and-grill' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The InterContinental Bali Resort''s open-air beach bar on Jimbaran Bay, with your toes in the white sand among coconut palms. The view runs 180 degrees west over the water. Grilled dishes and cocktails come with live music every day as the sun goes down.';
-- expect: UPDATE 1

-- 120. W-sunset-beach-bar-and-grill-best_for · sunset-beach-bar-and-grill · best_for · restore before
update venues set best_for = 'Couples and groups who want a beach-facing table or bean bag for late-afternoon drinks and grilled bites timed to the Jimbaran Bay sunset.' where slug = 'sunset-beach-bar-and-grill' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples and groups who want a beach-facing table or bean bag for late-afternoon drinks and grilled bites timed to the Jimbaran Bay sunset';
-- expect: UPDATE 1

-- 121. W-tetaring-why_its_here · tetaring · why_its_here · restore before
update venues set why_its_here = 'A modern Indonesian restaurant at Kayumanis Nusa Dua Private Villa and Spa, named after the bamboo-and-palm-frond ceremonial roof structure and set in a glass-walled, bamboo-accented room serving archipelago dishes such as lemongrass Balinese chicken salad and black oxtail soup.' where slug = 'tetaring' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A modern Indonesian restaurant at Kayumanis Nusa Dua Private Villa and Spa, named after a ceremonial roof structure of bamboo and palm fronds. Its glass-walled, bamboo-accented room serves archipelago dishes such as lemongrass Balinese chicken salad and black oxtail soup.';
-- expect: UPDATE 1

-- 122. W-tetaring-best_for · tetaring · best_for · restore before
update venues set best_for = 'A relaxed lunch or dinner for travellers wanting regional Indonesian cooking in a quiet resort setting rather than a beachfront scene.' where slug = 'tetaring' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A lunch or dinner of regional Indonesian cooking in a quiet resort setting';
-- expect: UPDATE 1

-- 123. W-tetaring-not_for · tetaring · not_for · restore NULL
update venues set not_for = null where slug = 'tetaring' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A beachfront scene. Meals are served in a glass-walled room at a quiet resort';
-- expect: UPDATE 1

-- 124. W-the-apurva-kempinski-fitness-centre-nusa-dua-why_its_here · the-apurva-kempinski-fitness-centre-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'The fitness centre at The Apurva Kempinski is an ocean-view resort gym open early until late, with modern cardio and strength equipment and trainer-led sessions, set on the resort''s landmark tiered clifftop.' where slug = 'the-apurva-kempinski-fitness-centre-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Apurva Kempinski''s ocean-view resort gym, on the tiered clifftop, opens early and closes late. It has modern cardio and strength equipment, and trainers lead sessions.';
-- expect: UPDATE 1

-- 125. W-the-apurva-kempinski-fitness-centre-nusa-dua-best_for · the-apurva-kempinski-fitness-centre-nusa-dua · best_for · restore before
update venues set best_for = 'Apurva guests who want a well-equipped, ocean-view gym with the option of a personal trainer during a resort stay.' where slug = 'the-apurva-kempinski-fitness-centre-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Apurva guests who want a well-equipped, ocean-view gym with the option of a personal trainer during a resort stay';
-- expect: UPDATE 1

-- 126. W-the-apurva-kempinski-fitness-centre-nusa-dua-not_for · the-apurva-kempinski-fitness-centre-nusa-dua · not_for · restore before
update venues set not_for = 'Non-guests looking for a casual drop-in gym or a group-class community.' where slug = 'the-apurva-kempinski-fitness-centre-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Non-guests after a casual drop-in gym or a group-class community, because it is a resort gym';
-- expect: UPDATE 1

-- 127. W-the-apurva-kempinski-yoga-nusa-dua-why_its_here · the-apurva-kempinski-yoga-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'The Apurva Kempinski runs a varied yoga programme — sunrise Hatha and flow classes on the beach, plus aerial anti-gravity yoga and sound-healing sessions — set against the resort''s clifftop and ocean backdrop.' where slug = 'the-apurva-kempinski-yoga-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Yoga at The Apurva Kempinski means sunrise Hatha and flow classes on the beach, plus aerial anti-gravity yoga and sound-healing sessions. The resort''s clifftop and the ocean are the backdrop.';
-- expect: UPDATE 1

-- 128. W-the-apurva-kempinski-yoga-nusa-dua-best_for · the-apurva-kempinski-yoga-nusa-dua · best_for · restore before
update venues set best_for = 'Guests who want a scenic sunrise beach class or a novelty aerial/sound-healing session during their stay.' where slug = 'the-apurva-kempinski-yoga-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A scenic sunrise beach class, or a novelty aerial or sound-healing session during a stay';
-- expect: UPDATE 1

-- 129. W-the-apurva-kempinski-yoga-nusa-dua-not_for · the-apurva-kempinski-yoga-nusa-dua · not_for · restore before
update venues set not_for = 'Dedicated practitioners wanting a full independent studio timetable rather than a resort programme.' where slug = 'the-apurva-kempinski-yoga-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dedicated practitioners who want a full independent studio timetable: the classes belong to a resort programme';
-- expect: UPDATE 1

-- 130. W-the-apurva-spa-nusa-dua-why_its_here · the-apurva-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'The Apurva Spa is the award-winning wellness sanctuary of The Apurva Kempinski, built on traditional Balinese and Javanese healing — Lulur and Jamu rituals, sound healing and chakra work — set on the resort''s dramatic tiered clifftop above the Indian Ocean.' where slug = 'the-apurva-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Apurva Spa is part of The Apurva Kempinski, on the resort''s tiered clifftop above the Indian Ocean. Its treatments draw on traditional Balinese and Javanese healing: Lulur and Jamu rituals, sound healing and chakra work.';
-- expect: UPDATE 1

-- 131. W-the-apurva-spa-nusa-dua-best_for · the-apurva-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Guests who want a signature, story-led Indonesian treatment in a landmark clifftop resort; those pairing a massage with sound-healing or chakra sessions.' where slug = 'the-apurva-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A story-led Indonesian treatment on a clifftop, or a massage paired with sound-healing or chakra sessions';
-- expect: UPDATE 1

-- 132. W-the-apurva-spa-nusa-dua-not_for · the-apurva-spa-nusa-dua · not_for · restore before
update venues set not_for = 'Travellers wanting a simple, walk-in street-side massage or a quick express stop.' where slug = 'the-apurva-spa-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A simple, walk-in street-side massage or a quick express stop. Treatments here are story-led rituals';
-- expect: UPDATE 1

-- 133. W-the-bale-nusa-dua-yoga-why_its_here · the-bale-nusa-dua-yoga · why_its_here · restore before
update venues set why_its_here = 'Private yoga rooms at The Balé Nusa Dua, an adults-oriented retreat of 29 pavilions in the Geger area, each with its own pool. Yoga and pranayama are offered as part of the wellness menu alongside massage, energy treatments and detox programmes, and the property has a fitness centre and a quiet library.' where slug = 'the-bale-nusa-dua-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Private yoga rooms at The Balé Nusa Dua, an adults-oriented retreat of 29 pavilions in Geger, each with its own pool. Yoga and pranayama are on the wellness menu with massage, energy treatments and detox programmes. There''s also a fitness centre and a quiet library.';
-- expect: UPDATE 1

-- 134. W-the-bale-nusa-dua-yoga-best_for · the-bale-nusa-dua-yoga · best_for · restore before
update venues set best_for = 'Guests who want one-to-one practice in a private room rather than a group class.' where slug = 'the-bale-nusa-dua-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'One-to-one practice in a private room rather than a group class';
-- expect: UPDATE 1

-- 135. W-the-beach-grill-ritz-carlton-why_its_here · the-beach-grill-ritz-carlton · why_its_here · restore before
update venues set why_its_here = 'The beachfront grill restaurant at The Ritz-Carlton, Bali in Nusa Dua, cooking premium meats and locally sourced seafood — barramundi, snapper, king prawn — over a Josper charcoal oven, with indoor-outdoor seating facing the Indian Ocean; the menu rotates monthly around seasonal ingredients.' where slug = 'the-beach-grill-ritz-carlton' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At The Ritz-Carlton, Bali in Nusa Dua, this beachfront grill faces the Indian Ocean from indoor and outdoor tables. Premium meats and locally sourced seafood, such as barramundi, snapper and king prawn, go into a Josper charcoal oven. The menu rotates monthly around seasonal ingredients.';
-- expect: UPDATE 1

-- 136. W-the-beach-grill-ritz-carlton-best_for · the-beach-grill-ritz-carlton · best_for · restore before
update venues set best_for = 'Couples and resort guests wanting a relaxed grilled-seafood lunch or a candlelit oceanfront dinner, including private beach dinners for two.' where slug = 'the-beach-grill-ritz-carlton' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples and resort guests after a grilled-seafood lunch, a candlelit oceanfront dinner or a private beach dinner for two';
-- expect: UPDATE 1

-- 137. W-thermes-marins-bali-spa-at-ayana-jimbaran-why_its_here · thermes-marins-bali-spa-at-ayana-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Thermes Marins Bali at AYANA Resort — a landmark seawater-therapy and Aquatonic spa on the Jimbaran clifftop, among Bali''s best-known destination spas.' where slug = 'thermes-marins-bali-spa-at-ayana-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Thermes Marins Bali at AYANA Resort, a seawater-therapy destination spa on the Jimbaran clifftop with an Aquatonic pool.';
-- expect: UPDATE 1

-- 138. W-thermes-marins-bali-spa-at-ayana-jimbaran-best_for · thermes-marins-bali-spa-at-ayana-jimbaran · best_for · restore before
update venues set best_for = 'Those wanting a marquee spa day with the famous Aquatonic pool.' where slug = 'thermes-marins-bali-spa-at-ayana-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa day with the Aquatonic pool';
-- expect: UPDATE 1

-- 139. W-unique-rooftop-bar-and-restaurant-why_its_here · unique-rooftop-bar-and-restaurant · why_its_here · restore before
update venues set why_its_here = 'A two-level rooftop bar and pool club atop RIMBA by AYANA in Jimbaran, serving modern Mexican plates and tequila-led cocktails around a 25-metre infinity pool, with views over the Uluwatu hills and the Indian Ocean sunset.' where slug = 'unique-rooftop-bar-and-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A two-level rooftop bar and pool club on top of RIMBA by AYANA in Jimbaran. Modern Mexican plates and tequila-led cocktails are served around a 25-metre infinity pool. The view takes in the Uluwatu hills and the Indian Ocean sunset.';
-- expect: UPDATE 1

-- 140. W-unique-rooftop-bar-and-restaurant-best_for · unique-rooftop-bar-and-restaurant · best_for · restore before
update venues set best_for = 'Sunset drinks and a poolside afternoon that rolls into dinner, for couples or groups after a stylish rooftop setting.' where slug = 'unique-rooftop-bar-and-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A poolside afternoon on the roof that rolls into sunset drinks and dinner, for couples or groups';
-- expect: UPDATE 1

-- 141. W-warung-batan-bekul-best_for · warung-batan-bekul · best_for · restore before
update venues set best_for = 'seafood lovers wanting fresh, Balinese-spiced grilled fish at local prices; travellers willing to reserve ahead and arrive early; those seeking a hidden spot' where slug = 'warung-batan-bekul' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Fresh, Balinese-spiced grilled fish at local prices, if you''ll reserve ahead and arrive early';
-- expect: UPDATE 1

-- 142. W-warung-batan-bekul-not_for · warung-batan-bekul · not_for · restore before
update venues set not_for = 'walk-in or spontaneous diners (reservation advised, limited stock); anyone wanting an evening meal; non-seafood eaters' where slug = 'warung-batan-bekul' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A spontaneous walk-in or an evening meal, because it opens at midday and sells out early';
-- expect: UPDATE 1

-- 143. W-warung-dobiel-nusa-dua-why_its_here · warung-dobiel-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'A famous hole-in-the-wall babi guling (Balinese suckling pork) warung on Jl. Srikandi in Bualu village, Nusa Dua — a long-running local institution a short trip from the resort gates, known for its pork plate and rich pork soup, and often queued before it opens.' where slug = 'warung-dobiel-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A babi guling (Balinese suckling pork) warung in Bualu village, on Jl. Srikandi, a short trip from the Nusa Dua resort gates. It serves a pork plate and a rich pork soup, and there is often a queue before opening.';
-- expect: UPDATE 1

-- 144. W-warung-dobiel-nusa-dua-best_for · warung-dobiel-nusa-dua · best_for · restore before
update venues set best_for = 'Travellers staying in Nusa Dua who want an authentic, affordable local meal as a contrast to resort dining; babi guling lovers happy to go early.' where slug = 'warung-dobiel-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Babi guling lovers happy to go early, or anyone in Nusa Dua after an affordable local meal as a contrast to resort dining';
-- expect: UPDATE 1

-- 145. W-warung-halme-ikan-bakar-ala-jimbaran-why_its_here · warung-halme-ikan-bakar-ala-jimbaran · why_its_here · restore before
update venues set why_its_here = 'A casual grilled-seafood warung serving Jimbaran-style ikan bakar without heading to Jimbaran itself, at prices cheaper than the Jimbaran beach seafood strip.' where slug = 'warung-halme-ikan-bakar-ala-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A casual warung grilling Jimbaran-style ikan bakar without the trip to Jimbaran itself. Prices are cheaper than on the Jimbaran beach seafood strip.';
-- expect: UPDATE 1

-- 146. W-warung-halme-ikan-bakar-ala-jimbaran-best_for · warung-halme-ikan-bakar-ala-jimbaran · best_for · restore before
update venues set best_for = 'travellers wanting Jimbaran-style grilled seafood close to Nusa Dua/Benoa; groups sharing fish and prawns; lunch or dinner' where slug = 'warung-halme-ikan-bakar-ala-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Jimbaran-style grilled fish and prawns close to Nusa Dua and Benoa at lunch or dinner, including for a group sharing';
-- expect: UPDATE 1

-- 147. W-warung-halme-ikan-bakar-ala-jimbaran-not_for · warung-halme-ikan-bakar-ala-jimbaran · not_for · restore before
update venues set not_for = 'diners after a fine-dining or beachfront setting; non-seafood eaters' where slug = 'warung-halme-ikan-bakar-ala-jimbaran' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Non-seafood eaters, or anyone after fine dining or a beachfront setting: the menu is grilled seafood in a casual warung';
-- expect: UPDATE 1

-- 148. W-warung-mami-ikan-bakar-why_its_here · warung-mami-ikan-bakar · why_its_here · restore before
update venues set why_its_here = 'A no-frills, family-run roadside seafood warung on Jalan Uluwatu II in Jimbaran that grills just three things — fish, prawns and clams — served with three sambals plus free plecing kangkung and raw vegetables, and closes entirely on any day the catch isn''t fresh.' where slug = 'warung-mami-ikan-bakar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Just three things go on the grill at this no-frills, family-run roadside seafood warung on Jalan Uluwatu II, Jimbaran: fish, prawns and clams. They come with three sambals plus free plecing kangkung and raw vegetables. On any day the catch isn''t fresh, it closes entirely.';
-- expect: UPDATE 1

-- 149. W-warung-mami-ikan-bakar-best_for · warung-mami-ikan-bakar · best_for · restore before
update venues set best_for = 'Travellers who want cheap, genuinely fresh grilled seafood over the touristy Jimbaran beach-BBQ setups; come after it opens around 1pm and before the day''s catch sells out.' where slug = 'warung-mami-ikan-bakar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Cheap, fresh grilled seafood instead of the touristy Jimbaran beach-BBQ setups, from around 1pm until the day''s catch sells out';
-- expect: UPDATE 1

-- 150. W-warung-nasi-ayam-bu-oki-why_its_here · warung-nasi-ayam-bu-oki · why_its_here · restore before
update venues set why_its_here = 'A busy local nasi campur warung opposite Hotel Santika Siligita, serving Balinese mixed-rice plates built around chicken. One of the go-to cheap Balinese meals in the Nusa Dua/Bualu area.' where slug = 'warung-nasi-ayam-bu-oki' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A busy local nasi campur warung opposite Hotel Santika Siligita, in the Nusa Dua and Bualu area. The Balinese mixed-rice plates are cheap and built around chicken.';
-- expect: UPDATE 1

-- 151. W-warung-nasi-ayam-bu-oki-best_for · warung-nasi-ayam-bu-oki · best_for · restore before
update venues set best_for = 'a cheap authentic Balinese breakfast or lunch; solo travellers and families staying in Nusa Dua who want local food near the resorts; those who like a spice option' where slug = 'warung-nasi-ayam-bu-oki' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cheap Balinese breakfast or lunch near the resorts, for solo travellers or families, with a spice option';
-- expect: UPDATE 1

-- 152. W-warung-nasi-ayam-bu-oki-not_for · warung-nasi-ayam-bu-oki · not_for · restore before
update venues set not_for = 'diners wanting a quiet sit-down restaurant or full dinner service; anyone avoiding chicken' where slug = 'warung-nasi-ayam-bu-oki' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone avoiding chicken or after a quiet sit-down dinner, because the plates are built around chicken and the warung is a busy breakfast and lunch stop';
-- expect: UPDATE 1

-- 153. W-warung-ramayana-ikan-bakar-why_its_here · warung-ramayana-ikan-bakar · why_its_here · restore before
update venues set why_its_here = 'A beachfront seafood warung on Jimbaran Bay, operating since around 1990, serving Jimbaran-style ikan bakar — fish and seafood grilled over coconut husks with sambal — at tables set on the sand facing the sunset.' where slug = 'warung-ramayana-ikan-bakar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This beachfront warung on Jimbaran Bay has served Jimbaran-style ikan bakar since around 1990. Fish and seafood are grilled over coconut husks and come with sambal, at tables on the sand facing the sunset.';
-- expect: UPDATE 1

-- 154. W-warung-ramayana-ikan-bakar-best_for · warung-ramayana-ikan-bakar · best_for · restore before
update venues set best_for = 'Casual sunset seafood dinners with your feet near the sand, where you pick fresh catch sold by weight.' where slug = 'warung-ramayana-ikan-bakar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Picking fresh catch by weight for a casual sunset dinner with your feet near the sand';
-- expect: UPDATE 1

-- 155. W-westin-nusa-dua-fitness-studio-why_its_here · westin-nusa-dua-fitness-studio · why_its_here · restore before
update venues set why_its_here = 'The WestinWORKOUT studio at The Westin Resort Nusa Dua, open 24 hours. Since April 2026 it sits alongside a rebuilt wellness floor: a reformer pilates studio, a spin studio, a hot yoga sanctuary and a beachfront ice bath. Open-air beach workouts and outdoor HIIT run on the sand. A wellness day pass is sold, so access is not limited to room guests.' where slug = 'westin-nusa-dua-fitness-studio' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The WestinWORKOUT studio at The Westin Resort Nusa Dua is open 24 hours. A rebuilt wellness floor, open since April 2026, adds reformer pilates, spin, a hot yoga sanctuary and a beachfront ice bath. Open-air beach workouts and outdoor HIIT run on the sand.';
-- expect: UPDATE 1

-- 156. W-westin-nusa-dua-fitness-studio-best_for · westin-nusa-dua-fitness-studio · best_for · restore before
update venues set best_for = 'People in Nusa Dua who want reformer pilates, spin and ice bath in one place, including non-guests buying a day pass.' where slug = 'westin-nusa-dua-fitness-studio' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'People in Nusa Dua who want reformer pilates, spin and ice bath in one place, including non-guests buying a day pass';
-- expect: UPDATE 1

-- 157. W-westin-nusa-dua-yoga-why_its_here · westin-nusa-dua-yoga · why_its_here · restore before
update venues set why_its_here = 'The yoga programme at The Westin Resort Nusa Dua, run from a hot yoga sanctuary added in April 2026 and as group sessions alongside pilates and spin. Ashtanga is on the schedule for those wanting a harder class.' where slug = 'westin-nusa-dua-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Westin Resort Nusa Dua runs yoga from a hot yoga sanctuary added in April 2026, and as group sessions alongside pilates and spin. Ashtanga is on the schedule if you want a harder class.';
-- expect: UPDATE 1

-- 158. W-westin-nusa-dua-yoga-best_for · westin-nusa-dua-yoga · best_for · restore before
update venues set best_for = 'Guests and day-pass visitors who want hot yoga and a genuinely demanding Ashtanga class rather than a gentle resort session.' where slug = 'westin-nusa-dua-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Guests or day-pass visitors after hot yoga and a demanding Ashtanga class rather than a gentle resort session';
-- expect: UPDATE 1

-- 159. W-white-orchid-nusa-dua-why_its_here · white-orchid-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'A pan-Asian restaurant in the Bali Collection shopping-and-dining complex in the BTDC resort area of Nusa Dua, open from breakfast through dinner; known for shareable Asian plates and satay grilled on a Balinese barbecue, with outdoor tables and friendly, attentive service.' where slug = 'white-orchid-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A pan-Asian restaurant in the Bali Collection shopping-and-dining complex, in the BTDC resort area of Nusa Dua, open from breakfast through dinner. The menu runs to shareable Asian plates and satay grilled on a Balinese barbecue, and there are outdoor tables.';
-- expect: UPDATE 1

-- 160. W-white-orchid-nusa-dua-best_for · white-orchid-nusa-dua · best_for · restore before
update venues set best_for = 'Relaxed, good-value lunches or dinners for couples and families staying in the Nusa Dua resort area who want familiar Asian dishes without leaving the enclave.' where slug = 'white-orchid-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Familiar Asian dishes at lunch or dinner without leaving the enclave, for couples and families in the Nusa Dua resort area';
-- expect: UPDATE 1
