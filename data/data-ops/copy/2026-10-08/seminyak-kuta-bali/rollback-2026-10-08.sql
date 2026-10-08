-- wave-seminyak-kuta-bali-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-15fit-seminyak-best_for · 15fit-seminyak · best_for · restore before
update venues set best_for = 'Those who want focused PT or small-group sessions over a big-box gym.' where slug = '15fit-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Focused personal training or a small-group session';
-- expect: UPDATE 1

-- 2. W-15fit-seminyak-not_for · 15fit-seminyak · not_for · restore NULL
update venues set not_for = null where slug = '15fit-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A big-box gym — the studio is compact and built around PT and small groups';
-- expect: UPDATE 1

-- 3. W-2befit-bali-best_for · 2befit-bali · best_for · restore before
update venues set best_for = 'Visitors wanting a straightforward full gym in central Seminyak.' where slug = '2befit-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Weights, cardio or a group class in central Seminyak';
-- expect: UPDATE 1

-- 4. W-anika-gym-why_its_here · anika-gym · why_its_here · restore before
update venues set why_its_here = 'A no-frills local gym on Jl. Gn. Tangkuban Perahu in Padangsambian Klod, Denpasar, known for rock-bottom prices. Enquiries and sign-up go through WhatsApp or the @anika_fitness_club Instagram account.' where slug = 'anika-gym' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A no-frills local gym in Padangsambian Klod, Denpasar, with rock-bottom prices. It''s on Jl. Gn. Tangkuban Perahu, and enquiries and sign-up go through WhatsApp or the @anika_fitness_club Instagram account.';
-- expect: UPDATE 1

-- 5. W-anika-gym-best_for · anika-gym · best_for · restore before
update venues set best_for = 'Long-stay residents after the cheapest straightforward gym option away from the tourist strip.' where slug = 'anika-gym' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Long-stay residents after a cheap, no-frills gym away from the tourist strip';
-- expect: UPDATE 1

-- 6. W-avenue-fitness-bali-best_for · avenue-fitness-bali · best_for · restore before
update venues set best_for = 'Travellers who want a proper gym close to the Seminyak strip.' where slug = 'avenue-fitness-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A gym session close to the Seminyak strip';
-- expect: UPDATE 1

-- 7. W-azul-beach-club-legian-why_its_here · azul-beach-club-legian · why_its_here · restore before
update venues set why_its_here = 'A bamboo tree-house beach club on the Legian beachfront, built across three open-air tiered levels facing the ocean, with a dedicated Tiki bar and a kitchen doing playful takes on Indonesian classics.' where slug = 'azul-beach-club-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A bamboo tree-house beach club on the Legian beachfront, built over three open-air tiered levels that face the ocean. It has its own Tiki bar, and the kitchen does playful takes on Indonesian classics.';
-- expect: UPDATE 1

-- 8. W-babi-guling-pak-malen-why_its_here · babi-guling-pak-malen · why_its_here · restore before
update venues set why_its_here = 'A long-running specialist serving essentially one thing — nasi campur babi guling (Balinese roast suckling pig with rice) — with crispy skin, pork satay and green-chili sambal. Typically sells out by early afternoon.' where slug = 'babi-guling-pak-malen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pak Malen''s warung serves essentially one thing: nasi campur babi guling, Balinese roast suckling pig with rice. The plate comes with crispy skin, pork satay and green-chili sambal. It typically sells out by early afternoon.';
-- expect: UPDATE 1

-- 9. W-babi-guling-pak-malen-best_for · babi-guling-pak-malen · best_for · restore before
update venues set best_for = 'pork eaters wanting the classic babi guling plate; an early lunch; solo or quick-stop diners' where slug = 'babi-guling-pak-malen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An early lunch of classic babi guling, solo or as a quick stop';
-- expect: UPDATE 1

-- 10. W-babi-guling-pak-malen-not_for · babi-guling-pak-malen · not_for · restore before
update venues set not_for = 'halal and vegetarian diners (pork-only menu); late arrivals after it sells out; anyone wanting a broad or air-conditioned setting' where slug = 'babi-guling-pak-malen' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Halal or vegetarian diners, or anyone after air-con and space: this is a pork-only warung';
-- expect: UPDATE 1

-- 11. W-bali-barber-seminyak-seminyak-why_its_here · bali-barber-seminyak-seminyak · why_its_here · restore before
update venues set why_its_here = 'A premium men''s barbershop brand (original location since 2012) with English-speaking master barbers offering scissor cuts, clipper fades, hot-towel shaves and beard work, plus grooming add-ons like facials and massage. The Seminyak branch shares a building with The Shampoo Lounge.' where slug = 'bali-barber-seminyak-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Seminyak branch of Bali Barber, a premium men''s barbershop brand whose original location dates from 2012. English-speaking master barbers do scissor cuts, clipper fades, hot-towel shaves and beard work, with add-ons such as facials and massage. It shares a building with The Shampoo Lounge.';
-- expect: UPDATE 1

-- 12. W-bali-barber-seminyak-seminyak-best_for · bali-barber-seminyak-seminyak · best_for · restore before
update venues set best_for = 'Men who want a proper barber cut, beard trim or hot-towel shave while travelling.' where slug = 'bali-barber-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Men after a barber cut, beard trim or hot-towel shave while travelling';
-- expect: UPDATE 1

-- 13. W-bali-barber-seminyak-seminyak-not_for · bali-barber-seminyak-seminyak · not_for · restore before
update venues set not_for = 'Travellers seeking a full women''s salon or a relaxation spa.' where slug = 'bali-barber-seminyak-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full women''s salon or a relaxation spa. The menu is men''s cuts, shaves and beard work';
-- expect: UPDATE 1

-- 14. W-bali-fitness-seminyak-seminyak-why_its_here · bali-fitness-seminyak-seminyak · why_its_here · restore before
update venues set why_its_here = 'Full-service gym on Sunset Road and the first place in Bali to run Les Mills group classes, with a dedicated bike/spin studio plus a fully equipped weights-and-cardio floor and personal training.' where slug = 'bali-fitness-seminyak-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'On Sunset Road, a full-service gym that runs Les Mills group classes. There''s a dedicated bike and spin studio, a fully equipped weights-and-cardio floor, and personal training.';
-- expect: UPDATE 1

-- 15. W-bali-fitness-seminyak-seminyak-best_for · bali-fitness-seminyak-seminyak · best_for · restore before
update venues set best_for = 'Travellers who want a proper, fully-equipped commercial gym and structured Les Mills group classes while staying in the Seminyak area.' where slug = 'bali-fitness-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Les Mills classes and a fully equipped gym while you''re based around Seminyak';
-- expect: UPDATE 1

-- 16. W-bali-green-surf-why_its_here · bali-green-surf · why_its_here · restore before
update venues set why_its_here = 'A Kuta beach surf school offering instructor-led lessons and board rental on the same beginner-friendly break -- a straightforward way to get in the water with guidance.' where slug = 'bali-green-surf' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A surf school on Kuta beach that runs instructor-led lessons and rents boards on the same beginner-friendly break. It''s a straightforward way to get in the water with guidance.';
-- expect: UPDATE 1

-- 17. W-bambu-why_its_here · bambu · why_its_here · restore before
update venues set why_its_here = 'A dinner-only Indonesian restaurant on Jl. Petitenget from the La Lucciola team, serving regional archipelago recipes — slow-roasted betutu duck, sambals, babi guling — across a candlelit garden of open-air pavilions around a koi pond.' where slug = 'bambu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The La Lucciola team runs this dinner-only Indonesian restaurant on Jl. Petitenget. Tables sit in open-air pavilions around a koi pond, across a candlelit garden. The kitchen cooks regional recipes from the archipelago: slow-roasted betutu duck, sambals and babi guling.';
-- expect: UPDATE 1

-- 18. W-bambu-best_for · bambu · best_for · restore before
update venues set best_for = 'An unhurried, atmospheric evening for travellers wanting elevated traditional Indonesian food in a romantic garden setting.' where slug = 'bambu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An unhurried, romantic dinner of traditional Indonesian food in the garden';
-- expect: UPDATE 1

-- 19. W-bambu-not_for · bambu · not_for · restore NULL
update venues set not_for = null where slug = 'bambu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A lunch booking, because Bambu opens for dinner only';
-- expect: UPDATE 1

-- 20. W-biku-why_its_here · biku · why_its_here · restore before
update venues set why_its_here = 'A tea lounge, restaurant and antique bookstore set inside a 150-year-old teak joglo on Petitenget, best known for its high tea (traditional, Asian and breakfast versions) and a curated list of 50-plus teas from China, India and Indonesia alongside a menu of Indonesian and Western dishes.' where slug = 'biku' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Inside a 150-year-old teak joglo on Petitenget, Biku is a tea lounge, restaurant and antique bookstore at once. High tea comes in traditional, Asian and breakfast versions, and there are 50-plus teas from China, India and Indonesia. The menu is Indonesian and Western.';
-- expect: UPDATE 1

-- 21. W-biku-best_for · biku · best_for · restore before
update venues set best_for = 'Afternoon high tea or a relaxed daytime meal for those who want atmosphere, books and a long sit-down.' where slug = 'biku' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Afternoon high tea, or a long daytime sit-down among the books';
-- expect: UPDATE 1

-- 22. W-bk-wellness-studio-umalas-by-blue-karma-secrets-best_for · bk-wellness-studio-umalas-by-blue-karma-secrets · best_for · restore before
update venues set best_for = 'travellers wanting yoga or sound healing in a quiet villa-garden setting; those combining a class with a spa or retreat stay; Sunday sound-bath drop-ins' where slug = 'bk-wellness-studio-umalas-by-blue-karma-secrets' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga or sound healing in a quiet villa garden, or a Sunday sound-bath drop-in';
-- expect: UPDATE 1

-- 23. W-bk-wellness-studio-umalas-by-blue-karma-secrets-not_for · bk-wellness-studio-umalas-by-blue-karma-secrets · not_for · restore before
update venues set not_for = 'people after a high-energy fitness/reformer gym; anyone wanting a walk-in studio on the Seminyak strip rather than a tucked-away village' where slug = 'bk-wellness-studio-umalas-by-blue-karma-secrets' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'High-energy gym or reformer work, or a walk-in class on the Seminyak strip. The studio is out in Umalas';
-- expect: UPDATE 1

-- 24. W-bodyworks-beauty-seminyak-seminyak-why_its_here · bodyworks-beauty-seminyak-seminyak · why_its_here · restore before
update venues set why_its_here = 'The beauty side of Bodyworks, a long-established Seminyak spa on Jl. Kayu Jati in Petitenget, offering nails, waxing, facials and hair daily 9:00–22:00.' where slug = 'bodyworks-beauty-seminyak-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The beauty side of Bodyworks, a Seminyak spa on Jl. Kayu Jati in Petitenget. It does nails, waxing, facials and hair daily, 9:00–22:00.';
-- expect: UPDATE 1

-- 25. W-bodyworks-beauty-seminyak-seminyak-best_for · bodyworks-beauty-seminyak-seminyak · best_for · restore before
update venues set best_for = 'Visitors wanting a full beauty menu at a Seminyak institution.' where slug = 'bodyworks-beauty-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A full beauty menu, from nails to hair, in Petitenget';
-- expect: UPDATE 1

-- 26. W-bodyworks-spa-seminyak-why_its_here · bodyworks-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'A pioneer of the modern Seminyak day-spa model, open for over two decades, now in a striking pink Moroccan-style building with a central pool. Combines a full massage and spa menu with hair, nails, facials and waxing under one roof.' where slug = 'bodyworks-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Seminyak day spa, open for over two decades, now in a pink Moroccan-style building with a central pool. The full massage and spa menu sits alongside hair, nails, facials and waxing under one roof.';
-- expect: UPDATE 1

-- 27. W-bodyworks-spa-seminyak-best_for · bodyworks-spa-seminyak · best_for · restore before
update venues set best_for = 'Groups and friends who want a photogenic, one-stop pampering day mixing massage with hair and nail services; booking ahead on busy days.' where slug = 'bodyworks-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Groups of friends making a day of massage, hair and nails, booked ahead on busy days';
-- expect: UPDATE 1

-- 28. W-bodyworks-spa-seminyak-not_for · bodyworks-spa-seminyak · not_for · restore before
update venues set not_for = 'Travellers wanting a quiet, ultra-minimal treatment room away from the crowds.' where slug = 'bodyworks-spa-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, ultra-minimal treatment room: Bodyworks is a pink Moroccan-style building that gets busy';
-- expect: UPDATE 1

-- 29. W-bossman-burgers-why_its_here · bossman-burgers · why_its_here · restore before
update venues set why_its_here = 'A Seminyak burger joint built on Australian-beef smash and gourmet patties with house-made sauces and freshly baked buns. It runs late, serving until roughly 5am, which makes it a reliable post-night-out stop.' where slug = 'bossman-burgers' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This Seminyak burger joint serves until roughly 5am, which makes it a post-night-out stop. The patties are Australian beef, smash or gourmet, with house-made sauces and freshly baked buns.';
-- expect: UPDATE 1

-- 30. W-bossman-burgers-best_for · bossman-burgers · best_for · restore before
update venues set best_for = 'late-night cravings; casual meat-forward meals; after a night out; quick group bite' where slug = 'bossman-burgers' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A late burger after a night out, or a quick bite with a group';
-- expect: UPDATE 1

-- 31. W-bossman-burgers-not_for · bossman-burgers · not_for · restore before
update venues set not_for = 'a quiet, refined sit-down dinner; anyone avoiding meat-heavy fare' where slug = 'bossman-burgers' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, refined sit-down dinner, or anyone avoiding meat-heavy food — it''s a beef burger joint';
-- expect: UPDATE 1

-- 32. W-boyncow-why_its_here · boyncow · why_its_here · restore before
update venues set why_its_here = 'A premium steakhouse and cocktail lounge on Seminyak''s Eat Street (Jl. Raya Kerobokan), open since 2017, serving dry-aged cuts cured on site for at least 30 days plus Australian, US and Japanese Wagyu including A5 grades; the industrial meat-boutique room pairs share-style steaks with a mezzanine speakeasy bar known for barrel-aged cocktails and single malts.' where slug = 'boyncow' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Boy''N''Cow has been a steakhouse and cocktail lounge on Seminyak''s Eat Street (Jl. Raya Kerobokan) since 2017. Cuts are dry-aged on site for at least 30 days; the Wagyu is Australian, US and Japanese, A5 included. A mezzanine speakeasy pours barrel-aged cocktails and single malts.';
-- expect: UPDATE 1

-- 33. W-boyncow-best_for · boyncow · best_for · restore before
update venues set best_for = 'A carnivore-focused dinner out or a special occasion for serious steak and Wagyu lovers who want cocktails alongside.' where slug = 'boyncow' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A carnivore''s dinner or special occasion over share-style steaks, Wagyu and cocktails';
-- expect: UPDATE 1

-- 34. W-caseys-spa-beauty-salon-legian-why_its_here · caseys-spa-beauty-salon-legian · why_its_here · restore before
update venues set why_its_here = 'A spa and beauty salon on Jalan Melasti in Legian, opposite Legian Beach Hotel, offering Balinese massage, facials, body scrubs and manicure/pedicure alongside hair treatments.' where slug = 'caseys-spa-beauty-salon-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This spa and beauty salon on Jalan Melasti sits opposite Legian Beach Hotel. It does Balinese massage, facials, body scrubs, manicures and pedicures, plus hair treatments.';
-- expect: UPDATE 1

-- 35. W-cocoon-medical-spa-seminyak-seminyak-best_for · cocoon-medical-spa-seminyak-seminyak · best_for · restore before
update venues set best_for = 'Those wanting clinical-grade aesthetics rather than a relaxation spa.' where slug = 'cocoon-medical-spa-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Clinical-grade skin, laser or injectable treatments';
-- expect: UPDATE 1

-- 36. W-cocoon-medical-spa-seminyak-seminyak-not_for · cocoon-medical-spa-seminyak-seminyak · not_for · restore NULL
update venues set not_for = null where slug = 'cocoon-medical-spa-seminyak-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A relaxation spa visit, because Cocoon is a medical-aesthetic clinic';
-- expect: UPDATE 1

-- 37. W-coffee-cartel-legian-why_its_here · coffee-cartel-legian · why_its_here · restore before
update venues set why_its_here = 'A boutique specialty-coffee spot in Legian, part of a small Bali chain, known for premium blends and unusual lattes -- matcha, charcoal, beetroot -- alongside the classics.' where slug = 'coffee-cartel-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Part of a small Bali chain, this Legian specialty-coffee spot pours premium blends alongside the classics. The unusual lattes are made with matcha, charcoal or beetroot.';
-- expect: UPDATE 1

-- 38. W-corner-house-bali-why_its_here · corner-house-bali · why_its_here · restore before
update venues set why_its_here = 'All-day cafe and bistro on Seminyak''s "Eat Street," serving Western/modern-Australian classics from breakfast and brunch through burgers, char-grilled steaks and pizza. Casual, generous, colonial-house setting on the corner of Oberoi Road.' where slug = 'corner-house-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An all-day cafe and bistro in a colonial house on the corner of Oberoi Road, on Seminyak''s Eat Street. The cooking is casual Western and modern Australian: breakfast and brunch, then burgers, char-grilled steaks and pizza.';
-- expect: UPDATE 1

-- 39. W-corner-house-bali-best_for · corner-house-bali · best_for · restore before
update venues set best_for = 'brunch after the beach; an easy first-night dinner; a relaxed group meal of familiar Western food' where slug = 'corner-house-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Brunch after the beach, or an easy first-night dinner of familiar Western food with a group';
-- expect: UPDATE 1

-- 40. W-corner-house-bali-not_for · corner-house-bali · not_for · restore before
update venues set not_for = 'travellers specifically after Indonesian/local cuisine (menu is Western-focused)' where slug = 'corner-house-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone set on Indonesian food, because the menu is Western';
-- expect: UPDATE 1

-- 41. W-crossfit-seminyak-why_its_here · crossfit-seminyak · why_its_here · restore before
update venues set why_its_here = 'Open-air CrossFit box near Seminyak beach. CrossFit, bootcamp, movement, mobility and olympic lifting. Rigs, bumpers, rowers and assault bikes. Showers and towels are provided, and classes run in English.' where slug = 'crossfit-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An open-air CrossFit box with classes in CrossFit, bootcamp, movement, mobility and olympic lifting. The kit runs to rigs, bumpers, rowers and assault bikes. Showers and towels are provided, and classes are in English.';
-- expect: UPDATE 1

-- 42. W-de-nyuh-spa-seminyak-best_for · de-nyuh-spa-seminyak · best_for · restore before
update venues set best_for = 'Anyone wanting an easy, well-priced spa hour in Seminyak.' where slug = 'de-nyuh-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An easy, well-priced spa hour in Seminyak';
-- expect: UPDATE 1

-- 43. W-desa-potato-head-wellness-why_its_here · desa-potato-head-wellness · why_its_here · restore before
update venues set why_its_here = 'The wellbeing programme at Desa Potato Head on Jl. Petitenget in Seminyak. Weekly all-level yoga is free for guests of the Suites and Studios and open to everyone else by donation. Sanctuary, the venue''s wellness space behind the Library, was built with the founders of Pyramids of Chi in Ubud and runs vibroacoustic light therapy, sound healing, breathwork and ice bath sessions.' where slug = 'desa-potato-head-wellness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Desa Potato Head''s wellbeing programme on Jl. Petitenget runs all-level yoga: free for Suites and Studios guests, by donation for others. Its Sanctuary was built with the founders of Pyramids of Chi in Ubud and runs vibroacoustic light therapy, sound healing, breathwork and ice baths.';
-- expect: UPDATE 1

-- 44. W-desa-potato-head-wellness-best_for · desa-potato-head-wellness · best_for · restore before
update venues set best_for = 'Seminyak visitors who want donation-based yoga and unusual sound and light meditation formats rather than a standard studio class.' where slug = 'desa-potato-head-wellness' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Weekly yoga by donation, or unusual sound and light meditation instead of a standard studio class';
-- expect: UPDATE 1

-- 45. W-desa-wisata-penglipuran-why_its_here · desa-wisata-penglipuran · why_its_here · restore before
update venues set why_its_here = 'A traditional Bali Aga village in Bangli known for its uniform bamboo-roofed houses and car-free main street.' where slug = 'desa-wisata-penglipuran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Penglipuran is a traditional Bali Aga village in Bangli. Its houses are uniform and bamboo-roofed, and the main street is car-free.';
-- expect: UPDATE 1

-- 46. W-desa-wisata-penglipuran-best_for · desa-wisata-penglipuran · best_for · restore before
update venues set best_for = 'a walk through traditional Balinese village architecture; an easy stop between Kintamani and south Bali' where slug = 'desa-wisata-penglipuran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A walk through traditional Balinese village architecture, as an easy stop between Kintamani and south Bali';
-- expect: UPDATE 1

-- 47. W-desa-wisata-tembuku-why_its_here · desa-wisata-tembuku · why_its_here · restore before
update venues set why_its_here = 'A village in Bangli surrounded by rice terraces and forest, home to Tukad Cepung waterfall -- water falling through a narrow rock crevice about 15 metres high, roughly 8km from Bangli town.' where slug = 'desa-wisata-tembuku' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Rice terraces and forest surround Tembuku, a village in Bangli. It is home to Tukad Cepung waterfall, roughly 8km from Bangli town, where water falls through a narrow rock crevice about 15 metres high.';
-- expect: UPDATE 1

-- 48. W-desa-wisata-tembuku-best_for · desa-wisata-tembuku · best_for · restore before
update venues set best_for = 'a lesser-known waterfall away from the main tourist circuit; traditional cooking and craft demonstrations' where slug = 'desa-wisata-tembuku' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A waterfall away from the main tourist circuit, or traditional cooking and craft demonstrations';
-- expect: UPDATE 1

-- 49. W-desa-wisata-tenganan-why_its_here · desa-wisata-tenganan · why_its_here · restore before
update venues set why_its_here = 'One of Bali''s oldest Bali Aga (indigenous pre-Hindu Balinese) villages, in Karangasem, known for its double-ikat geringsing weaving.' where slug = 'desa-wisata-tenganan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Tenganan, in Karangasem, is a Bali Aga village; the Bali Aga are the indigenous pre-Hindu Balinese. Double-ikat geringsing cloth is woven here.';
-- expect: UPDATE 1

-- 50. W-desa-wisata-tenganan-best_for · desa-wisata-tenganan · best_for · restore before
update venues set best_for = 'traditional Balinese weaving and village architecture; a stop on an east-Bali day out' where slug = 'desa-wisata-tenganan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Traditional Balinese weaving and village architecture on an east-Bali day out';
-- expect: UPDATE 1

-- 51. W-desa-wisata-undisan-why_its_here · desa-wisata-undisan · why_its_here · restore before
update venues set why_its_here = 'A traditional village in Bangli, about 90 minutes from Ngurah Rai airport or 45 minutes from Ubud, built around rice-farming and craft traditions -- including matekap, ploughing rice fields with oxen the traditional way, and Balinese gold-and-silver flower craftwork. Air Terjun Tangkup waterfall is roughly a 45-minute walk from the main road.' where slug = 'desa-wisata-undisan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Undisan, a traditional village in Bangli, is about 90 minutes from Ngurah Rai airport or 45 minutes from Ubud. Its traditions include matekap, ploughing rice fields with oxen, and gold-and-silver flower craftwork. Air Terjun Tangkup waterfall is roughly a 45-minute walk from the main road.';
-- expect: UPDATE 1

-- 52. W-desa-wisata-undisan-best_for · desa-wisata-undisan · best_for · restore before
update venues set best_for = 'traditional rice-field ploughing and craft demonstrations; a waterfall walk away from the tourist trail' where slug = 'desa-wisata-undisan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Rice-field ploughing and craft demonstrations, or a waterfall walk away from the tourist trail';
-- expect: UPDATE 1

-- 53. W-drifter-kayu-aya-why_its_here · drifter-kayu-aya · why_its_here · restore before
update venues set why_its_here = 'Surf shop, cafe and bookstore on Jl. Kayu Aya, opened in 2009 by surfers Tim Russo and Jake MacKenzie. Hand-shaped boards and independent brands, books and artwork. The cafe pours coffee from Sumatran beans. Gallery openings, film screenings and live music run in season.' where slug = 'drifter-kayu-aya' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Surfers Tim Russo and Jake MacKenzie opened this surf shop, cafe and bookstore on Jl. Kayu Aya in 2009. It sells hand-shaped boards and independent brands alongside books and artwork, and the coffee is Sumatran. Gallery openings, film screenings and live music run in season.';
-- expect: UPDATE 1

-- 54. W-engine-room-legian-why_its_here · engine-room-legian · why_its_here · restore before
update venues set why_its_here = 'A three-storey nightclub on the Legian strip where the main dance floor opens straight onto the sidewalk, with resident DJs running hip-hop, dubstep and trap sets.' where slug = 'engine-room-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A three-storey nightclub on the Legian strip. The main dance floor opens straight onto the sidewalk, and resident DJs play hip-hop, dubstep and trap.';
-- expect: UPDATE 1

-- 55. W-expat-roasters-best_for · expat-roasters · best_for · restore before
update venues set best_for = 'serious coffee lovers; single-origin tasting; laptop-friendly morning work; buying beans and brew gear' where slug = 'expat-roasters' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Single-origin tasting, a laptop morning, or buying beans and brew gear';
-- expect: UPDATE 1

-- 56. W-expat-roasters-not_for · expat-roasters · not_for · restore before
update venues set not_for = 'a full sit-down meal; a lively bar or nightlife scene; anyone after a beach or view setting' where slug = 'expat-roasters' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full sit-down meal or a lively night out: the food is a small menu of light bites';
-- expect: UPDATE 1

-- 57. W-fire-restaurant-seminyak-why_its_here · fire-restaurant-seminyak · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Seminyak. The kitchen is described as open-fire cooking. The published menu runs to 52 priced items — Flatbread, za’atar, honey yogurt, Sourdough bread, brown butter and Fresh Lombok oysters, green apple, mint vinaigrette, sea fennel. Fresh Lombok oysters, green apple, mint vinaigrette, sea fennel is 75K IDR. Booking is on the venue''s own site.' where slug = 'fire-restaurant-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An open-fire kitchen in Seminyak that takes bookings on its own site. The published menu runs to 52 priced items; flatbread comes with za’atar and honey yogurt, and sourdough with brown butter. Lombok oysters with green apple, mint vinaigrette and sea fennel are 75K IDR.';
-- expect: UPDATE 1

-- 58. W-fire-restaurant-seminyak-best_for · fire-restaurant-seminyak · best_for · restore before
update venues set best_for = 'A special-occasion dinner, not a quick casual meal.' where slug = 'fire-restaurant-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special-occasion dinner of open-fire cooking, not a quick casual meal';
-- expect: UPDATE 1

-- 59. W-gambinos-bali-why_its_here · gambinos-bali · why_its_here · restore before
update venues set why_its_here = 'A premium steakhouse on Jl. Kayu Aya in Seminyak serving Australian grain-fed and dry-aged beef alongside handmade pasta, in a two-floor room with a retractable roof upstairs. Dinner only.' where slug = 'gambinos-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A premium Seminyak steakhouse for Australian grain-fed and dry-aged beef, with handmade pasta too. The two-floor room on Jl. Kayu Aya has a retractable roof upstairs. It serves dinner only.';
-- expect: UPDATE 1

-- 60. W-gambinos-bali-best_for · gambinos-bali · best_for · restore before
update venues set best_for = 'A steak dinner or special-occasion meal in central Seminyak.' where slug = 'gambinos-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A steak dinner or a special occasion in central Seminyak';
-- expect: UPDATE 1

-- 61. W-gambinos-bali-not_for · gambinos-bali · not_for · restore NULL
update venues set not_for = null where slug = 'gambinos-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A lunchtime steak. Gambinos opens for dinner only';
-- expect: UPDATE 1

-- 62. W-ginger-moon-canteen-why_its_here · ginger-moon-canteen · why_its_here · restore before
update venues set why_its_here = 'Modern-Asian sharing restaurant on Seminyak''s Oberoi/Laksmana strip from chef Dean Keddell, open since 2012. Built around ordering several shareable plates for the table rather than individual mains.' where slug = 'ginger-moon-canteen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Chef Dean Keddell''s modern-Asian sharing restaurant on Seminyak''s Oberoi/Laksmana strip, open since 2012. You order several plates for the table rather than individual mains.';
-- expect: UPDATE 1

-- 63. W-ginger-moon-canteen-best_for · ginger-moon-canteen · best_for · restore before
update venues set best_for = 'a group who want to share a spread of Asian plates; a relaxed dinner with friends or family; couples happy to graze across the menu' where slug = 'ginger-moon-canteen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Friends, family or a couple sharing a spread of Asian plates';
-- expect: UPDATE 1

-- 64. W-ginger-moon-canteen-not_for · ginger-moon-canteen · not_for · restore before
update venues set not_for = 'solo diners wanting a single quick plate (format is built around sharing)' where slug = 'ginger-moon-canteen' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Solo diners after a single quick plate, because the format is built around sharing';
-- expect: UPDATE 1

-- 65. W-glo-day-spa-salon-seminyak-seminyak-why_its_here · glo-day-spa-salon-seminyak-seminyak · why_its_here · restore before
update venues set why_its_here = 'A 480 sqm Western-style hair salon and day spa on Jl. Kayu Aya (opened 2022), managed by Australian senior stylists and known for colouring, cutting, keratin work and bridal hair and make-up, alongside spa treatment rooms, beauty rooms and a mani-pedi lounge.' where slug = 'glo-day-spa-salon-seminyak-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Opened in 2022 on Jl. Kayu Aya, this 480 sqm Western-style hair salon and day spa is managed by Australian senior stylists. The hair side does colour, cuts, keratin and bridal hair and make-up; the spa has treatment rooms, beauty rooms and a mani-pedi lounge.';
-- expect: UPDATE 1

-- 66. W-glo-day-spa-salon-seminyak-seminyak-best_for · glo-day-spa-salon-seminyak-seminyak · best_for · restore before
update venues set best_for = 'Travellers who want Western-standard hair colour/cut/keratin or bridal hair and make-up, plus salon-and-spa services in one place.' where slug = 'glo-day-spa-salon-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Western-standard colour, cuts or keratin, or bridal hair and make-up, with the spa in the same place';
-- expect: UPDATE 1

-- 67. W-glo-day-spa-salon-seminyak-seminyak-not_for · glo-day-spa-salon-seminyak-seminyak · not_for · restore before
update venues set not_for = 'Anyone specifically seeking a purely traditional Balinese massage house.' where slug = 'glo-day-spa-salon-seminyak-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A purely traditional Balinese massage house, since Glo is a Western-style salon and spa';
-- expect: UPDATE 1

-- 68. W-gusto-gelato-why_its_here · gusto-gelato · why_its_here · restore before
update venues set why_its_here = 'An artisan gelateria and caffe turning out house-made gelato in a wide flavour range, from classic fior di latte to local twists like lemongrass, ginger and sesame. It also pours proper coffee in a calm sit-down space.' where slug = 'gusto-gelato' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A gelateria and caffe that makes its own gelato in a wide range of flavours. They run from classic fior di latte to local twists like lemongrass, ginger and sesame. It also pours coffee in a calm sit-down space.';
-- expect: UPDATE 1

-- 69. W-gusto-gelato-best_for · gusto-gelato · best_for · restore before
update venues set best_for = 'afternoon dessert stop; cooling off in the heat; family treat with kids; coffee-and-gelato pause' where slug = 'gusto-gelato' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Cooling off with gelato and coffee in the afternoon, kids included';
-- expect: UPDATE 1

-- 70. W-gusto-gelato-not_for · gusto-gelato · not_for · restore before
update venues set not_for = 'anyone looking for a full sit-down meal or dinner service' where slug = 'gusto-gelato' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full meal or dinner service: Gusto is gelato and coffee';
-- expect: UPDATE 1

-- 71. W-hammerhead-fitness-why_its_here · hammerhead-fitness · why_its_here · restore before
update venues set why_its_here = 'Old-school gym on the third floor of Kasih Market on Jl. Nakula. Six hundred air-conditioned square metres, more than 80 stations, and the heaviest free weights on the island. A large cardio floor and a stretching area. Four full-time trainers, plus classes in boxing, zumba, dangdut and belly dance.' where slug = 'hammerhead-fitness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Hammerhead is an old-school gym on the third floor of Kasih Market, Jl. Nakula: six hundred air-conditioned square metres and more than 80 stations. There''s a large cardio floor and a stretching area, plus four full-time trainers. Classes cover boxing, zumba, dangdut and belly dance.';
-- expect: UPDATE 1

-- 72. W-hog-wild-with-chef-bruno-why_its_here · hog-wild-with-chef-bruno · why_its_here · restore before
update venues set why_its_here = 'Casual American BBQ joint on Jalan Batu Belig (Kerobokan) built around family-style tables and low-fuss grilled fare, with a largely gluten-free menu. Signature slow-cooked ribs are the draw.' where slug = 'hog-wild-with-chef-bruno' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Slow-cooked ribs are the draw at this casual American BBQ joint on Jalan Batu Belig in Kerobokan. Tables are family-style, the grilled food is low-fuss, and the menu is largely gluten-free.';
-- expect: UPDATE 1

-- 73. W-hog-wild-with-chef-bruno-best_for · hog-wild-with-chef-bruno · best_for · restore before
update venues set best_for = 'groups sharing BBQ platters family-style; families with a relaxed early dinner; gluten-free diners' where slug = 'hog-wild-with-chef-bruno' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A group sharing BBQ platters family-style, or an early family dinner, gluten-free diners included';
-- expect: UPDATE 1

-- 74. W-hog-wild-with-chef-bruno-not_for · hog-wild-with-chef-bruno · not_for · restore before
update venues set not_for = 'fine-dining or romantic quiet-table seekers; vegetarians (menu is meat/BBQ-led)' where slug = 'hog-wild-with-chef-bruno' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Fine dining, a quiet romantic table or a vegetarian meal: the menu leads with meat and BBQ';
-- expect: UPDATE 1

-- 75. W-izzi-rooftop-lounge-and-restaurant-and-bar-and-shisha-why_its_here · izzi-rooftop-lounge-and-restaurant-and-bar-and-shisha · why_its_here · restore before
update venues set why_its_here = 'Rooftop bar, restaurant and shisha lounge at Batu Belig Square. The shisha list runs past 200 tobaccos. Sunset view over the ocean, with DJs, board games and a PlayStation.' where slug = 'izzi-rooftop-lounge-and-restaurant-and-bar-and-shisha' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A rooftop bar, restaurant and shisha lounge at Batu Belig Square, looking over the ocean at sunset. The shisha list runs past 200 tobaccos; DJs play, and there are board games and a PlayStation.';
-- expect: UPDATE 1

-- 76. W-jari-menari-seminyak-why_its_here · jari-menari-seminyak · why_its_here · restore before
update venues set why_its_here = 'A Seminyak massage institution open since 2001 whose name means "dancing fingers." Therapists (traditionally an all-male team) are trained in a signature rhythmic, flowing full-body technique in open-air rooms set around a water wall and hand-carved stone.' where slug = 'jari-menari-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Seminyak massage house open since 2001, whose name means "dancing fingers". Its therapists, traditionally an all-male team, are trained in a rhythmic, flowing full-body technique. Its open-air rooms are set around a water wall and hand-carved stone.';
-- expect: UPDATE 1

-- 77. W-jari-menari-seminyak-best_for · jari-menari-seminyak · best_for · restore before
update venues set best_for = 'Travellers who want a serious, technique-led massage rather than a resort pampering session; couples and solo visitors who value a calm, no-frills sanctuary.' where slug = 'jari-menari-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm, technique-led massage rather than resort pampering, solo or as a couple';
-- expect: UPDATE 1

-- 78. W-jasmine-aromatic-house-why_its_here · jasmine-aromatic-house · why_its_here · restore before
update venues set why_its_here = 'A long-running Balinese day spa in Tuban, minutes from the airport, offering aromatherapy massage, body scrubs and hair treatments, with free airport transfers, showers and luggage storage.' where slug = 'jasmine-aromatic-house' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Minutes from the airport in Tuban, this Balinese day spa does aromatherapy massage, body scrubs and hair treatments. Showers and luggage storage are on site, and airport transfers are free.';
-- expect: UPDATE 1

-- 79. W-jasmine-aromatic-house-best_for · jasmine-aromatic-house · best_for · restore before
update venues set best_for = 'A reliable massage near the airport before a night flight or on arrival.' where slug = 'jasmine-aromatic-house' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A massage near the airport before a night flight or on arrival';
-- expect: UPDATE 1

-- 80. W-jiwa-bikram-yoga-bali-seminyak-why_its_here · jiwa-bikram-yoga-bali-seminyak · why_its_here · restore before
update venues set why_its_here = 'Bali''s first hot-yoga studio, in Petitenget (north Seminyak): the classic Bikram 26-posture sequence (90 and 60 min) plus Sumits, hot Vinyasa, Ashtanga, Yin and hot Pilates in an unpretentious, small-class setting.' where slug = 'jiwa-bikram-yoga-bali-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A hot-yoga studio in Petitenget, north Seminyak, teaching the classic Bikram 26-posture sequence (90 and 60 min). Sumits, hot Vinyasa, Ashtanga, Yin and hot Pilates fill out the timetable. Classes are small, in an unpretentious setting.';
-- expect: UPDATE 1

-- 81. W-jiwa-bikram-yoga-bali-seminyak-best_for · jiwa-bikram-yoga-bali-seminyak · best_for · restore before
update venues set best_for = 'Bikram and hot-yoga lovers, and travellers wanting an established sweat with near-private class sizes.' where slug = 'jiwa-bikram-yoga-bali-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Bikram and hot-yoga fans who want a sweat in near-private class sizes';
-- expect: UPDATE 1

-- 82. W-jiwa-bikram-yoga-bali-seminyak-not_for · jiwa-bikram-yoga-bali-seminyak · not_for · restore before
update venues set not_for = 'Anyone who prefers a cool, gentle practice or a scenic open-air studio.' where slug = 'jiwa-bikram-yoga-bali-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A cool, gentle practice or a scenic open-air studio. This is hot yoga';
-- expect: UPDATE 1

-- 83. W-kilo-kitchen-bali-seminyak-why_its_here · kilo-kitchen-bali-seminyak · why_its_here · restore before
update venues set why_its_here = 'The first overseas outpost of Singapore''s Kilo, on Jl. Drupadi in Seminyak, serving Asian-fusion sharing plates — squid-ink rice with soft-shell crab, beef-tongue tacos, Japanese ceviche — in a tropical-industrial space of concrete, wood and glass.' where slug = 'kilo-kitchen-bali-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This outpost of Singapore''s Kilo is on Jl. Drupadi in Seminyak. The kitchen does Asian-fusion sharing plates such as squid-ink rice with soft-shell crab, beef-tongue tacos and Japanese ceviche. The space is tropical-industrial: concrete, wood and glass.';
-- expect: UPDATE 1

-- 84. W-kros-tennis-bali-why_its_here · kros-tennis-bali · why_its_here · restore before
update venues set why_its_here = 'Indoor smart court on Jl. Patih Jelantik in Kuta, with AI tracking and performance readouts. Court booking, coaching from beginner upwards, and women''s doubles sessions. The space also rents for events and shoots. Open around the clock.' where slug = 'kros-tennis-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kros is an indoor smart tennis court on Jl. Patih Jelantik in Kuta, with AI tracking and performance readouts. Book the court, take coaching from beginner up or join women''s doubles; it''s open around the clock. The space also rents out for events and shoots.';
-- expect: UPDATE 1

-- 85. W-kynd-community-why_its_here · kynd-community · why_its_here · restore before
update venues set why_its_here = 'Seminyak''s strongest plant-forward brunch — a big, walk-in cafe known for smoothie bowls and colourful comfort food.' where slug = 'kynd-community' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kynd is a big walk-in cafe on Jl. Petitenget for plant-forward brunch: smoothie bowls and colourful comfort food.';
-- expect: UPDATE 1

-- 86. W-kynd-community-best_for · kynd-community · best_for · restore before
update venues set best_for = 'Vegan and vegetarian brunch; an iconic smoothie-bowl stop; a lighter reset day' where slug = 'kynd-community' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A vegan or vegetarian brunch with a smoothie bowl, on a lighter day';
-- expect: UPDATE 1

-- 87. W-la-casetta-bali-why_its_here · la-casetta-bali · why_its_here · restore before
update venues set why_its_here = 'A home-style Italian restaurant serving daily-baked bread and cornetti, fresh pasta and wood-fired pizza in a rustic, cozy setting, running from breakfast through lunch to dinner.' where slug = 'la-casetta-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A home-style Italian restaurant in Umalas, open from breakfast through lunch to dinner. Bread and cornetti are baked daily, the pasta is fresh and the pizza is wood-fired. The setting is rustic and cozy.';
-- expect: UPDATE 1

-- 88. W-la-casetta-bali-best_for · la-casetta-bali · best_for · restore before
update venues set best_for = 'a cozy, unhurried Italian dinner; a relaxed breakfast or lunch; a laid-back family or couples meal' where slug = 'la-casetta-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An unhurried Italian breakfast, lunch or dinner, for a family or a couple';
-- expect: UPDATE 1

-- 89. W-la-casetta-bali-not_for · la-casetta-bali · not_for · restore before
update venues set not_for = 'travellers wanting a beachfront or main-Seminyak-strip location (it sits inland in Umalas/Bumbak)' where slug = 'la-casetta-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A beachfront table or the main Seminyak strip: it sits inland, in Umalas/Bumbak';
-- expect: UPDATE 1

-- 90. W-lagoon-spa-seminyak-seminyak-why_its_here · lagoon-spa-seminyak-seminyak · why_its_here · restore before
update venues set why_its_here = 'A villa-set spa within Villa Seminyak Estate & Spa, running since 2003, with private spa villas, treatment rooms and a reflexology chill room. Known for multi-hour Balinese ritual packages (massage, scrub, flower bath, creambath, facial).' where slug = 'lagoon-spa-seminyak-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The spa at Villa Seminyak Estate & Spa has run since 2003. It has private spa villas and treatment rooms, plus a reflexology chill room. Its multi-hour Balinese ritual packages combine massage, scrub, flower bath, creambath and facial.';
-- expect: UPDATE 1

-- 91. W-lagoon-spa-seminyak-seminyak-best_for · lagoon-spa-seminyak-seminyak · best_for · restore before
update venues set best_for = 'Guests who want a long, unhurried multi-treatment ritual in a resort-garden setting; couples.' where slug = 'lagoon-spa-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A long, unhurried multi-treatment ritual in a resort garden, couples included';
-- expect: UPDATE 1

-- 92. W-lagoon-spa-seminyak-seminyak-not_for · lagoon-spa-seminyak-seminyak · not_for · restore before
update venues set not_for = 'Anyone after a fast walk-in 30-minute foot rub.' where slug = 'lagoon-spa-seminyak-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A fast walk-in 30-minute foot rub. Rituals here run for hours';
-- expect: UPDATE 1

-- 93. W-ling-lings-bali-why_its_here · ling-lings-bali · why_its_here · restore before
update venues set why_its_here = 'A lively Asian-fusion restaurant and cocktail spot on Jl. Petitenget in Seminyak, leaning Japanese and Korean with sushi rolls, Korean tacos, bao buns and pork ribs, plus a DJ and a long drinks list after dark.' where slug = 'ling-lings-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Asian-fusion restaurant and cocktail spot on Jl. Petitenget that leans Japanese and Korean. Sushi rolls, Korean tacos, bao buns and pork ribs are on the menu, and after dark there''s a DJ and a long drinks list.';
-- expect: UPDATE 1

-- 94. W-ling-lings-bali-best_for · ling-lings-bali · best_for · restore before
update venues set best_for = 'Groups and dates wanting a shared-plates dinner that rolls into cocktails and music.' where slug = 'ling-lings-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Groups or a date over shared plates that roll into cocktails and music';
-- expect: UPDATE 1

-- 95. W-ling-lings-bali-not_for · ling-lings-bali · not_for · restore NULL
update venues set not_for = null where slug = 'ling-lings-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A low-key dinner: Ling-Ling''s gets lively, with a DJ after dark';
-- expect: UPDATE 1

-- 96. W-mades-warung-kuta-why_its_here · mades-warung-kuta · why_its_here · restore before
update venues set why_its_here = 'One of Kuta''s oldest names, started as a roadside food stall in 1969 and grown into a full Balinese restaurant on Jalan Pantai Kuta, known for nasi campur and ayam goreng bumbu Bali.' where slug = 'mades-warung-kuta' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Made''s Warung started as a roadside food stall in 1969 and has grown into a full Balinese restaurant on Jalan Pantai Kuta. Order the nasi campur or the ayam goreng bumbu Bali.';
-- expect: UPDATE 1

-- 97. W-mades-warung-seminyak-why_its_here · mades-warung-seminyak · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Seminyak. The kitchen is described as Authentic Indonesian. The published menu includes Traditional Nasi Campur, Beef Rendang and Sate Lilit. Booking is on the venue''s own site.' where slug = 'mades-warung-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Indonesian kitchen in Seminyak whose published menu includes traditional nasi campur, beef rendang and sate lilit. You book on the venue''s own site.';
-- expect: UPDATE 1

-- 98. W-mades-warung-seminyak-best_for · mades-warung-seminyak · best_for · restore before
update venues set best_for = 'Authentic Indonesian in Seminyak.' where slug = 'mades-warung-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Nasi campur, beef rendang or sate lilit in Seminyak';
-- expect: UPDATE 1

-- 99. W-makan-place-kuta-legian-why_its_here · makan-place-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Legian. The kitchen is described as modern Indonesian. The published menu includes Onion Toast, Asparagouz Soup and Grilled Chickec – Honey Edition. Booking is on the venue''s own site.' where slug = 'makan-place-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Legian restaurant whose kitchen is described as modern Indonesian. The published menu includes Onion Toast. Booking is on the venue''s own site.';
-- expect: UPDATE 1

-- 100. W-mamasan-bali-why_its_here · mamasan-bali · why_its_here · restore before
update venues set why_its_here = 'Chef Will Meyrick''s long-running pan-Asian dining room in Seminyak, plating elevated Southeast Asian street food — from Penang to Bangkok to Indonesian rendang — inside a dramatic 1920s Shanghai-style room of dark timber, green banquettes and chandeliers, with an upstairs supper-club bar.' where slug = 'mamasan-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Chef Will Meyrick''s pan-Asian dining room in Seminyak cooks Southeast Asian street food, from Penang to Bangkok to Indonesian rendang. The room is 1920s Shanghai-style, with dark timber, green banquettes and chandeliers, and there''s a supper-club bar upstairs.';
-- expect: UPDATE 1

-- 101. W-mamasan-bali-best_for · mamasan-bali · best_for · restore before
update venues set best_for = 'A dressed-up dinner or cocktails for couples and groups who want polished Asian flavours in an atmospheric setting.' where slug = 'mamasan-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples or groups out for a dressed-up dinner or cocktails over polished Asian flavours';
-- expect: UPDATE 1

-- 102. W-mauri-restaurant-why_its_here · mauri-restaurant · why_its_here · restore before
update venues set why_its_here = 'Contemporary southern-Italian fine-dining restaurant on Jl. Petitenget, Seminyak, led by Apulian chef Maurizio Bombini, with a live kitchen, à la carte and seasonal tasting menus, and a rooftop hydroponic garden supplying produce.' where slug = 'mauri-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This contemporary southern-Italian fine-dining restaurant on Jl. Petitenget is led by Apulian chef Maurizio Bombini. There''s a live kitchen, à la carte and seasonal tasting menus, and a rooftop hydroponic garden that supplies produce.';
-- expect: UPDATE 1

-- 103. W-mauri-restaurant-best_for · mauri-restaurant · best_for · restore before
update venues set best_for = 'special-occasion and celebration dinners; couples wanting a refined tasting-menu evening; Sunday seafood brunch' where slug = 'mauri-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special-occasion dinner, a couple''s tasting-menu evening or the Sunday seafood brunch';
-- expect: UPDATE 1

-- 104. W-mauri-restaurant-not_for · mauri-restaurant · not_for · restore before
update venues set not_for = 'budget or quick-casual diners; families wanting a relaxed early dinner' where slug = 'mauri-restaurant' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget or quick casual meal, or an easy early family dinner, because Mauri is fine dining with tasting menus';
-- expect: UPDATE 1

-- 105. W-merah-putih-indonesian-restaurant-why_its_here · merah-putih-indonesian-restaurant · why_its_here · restore before
update venues set why_its_here = 'Modern Indonesian dining in a soaring, greenhouse-cathedral building on Jl. Petitenget in Seminyak by Inspiral Architects, with 10-metre vaulted ceilings and rainwater-filtering columns; open since 2013, its kitchen plates archipelago classics and contemporary takes — Balinese yellowfin tuna, babi guling — alongside a full cocktail and wine program.' where slug = 'merah-putih-indonesian-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Modern Indonesian dining on Jl. Petitenget since 2013, in a greenhouse-cathedral building by Inspiral Architects. It has 10-metre vaulted ceilings and rainwater-filtering columns. The kitchen does archipelago classics and contemporary takes, like Balinese yellowfin tuna and babi guling, with cocktails and wine.';
-- expect: UPDATE 1

-- 106. W-merah-putih-indonesian-restaurant-best_for · merah-putih-indonesian-restaurant · best_for · restore before
update venues set best_for = 'A dressed-up dinner or special occasion when you want refined Indonesian food in a landmark setting.' where slug = 'merah-putih-indonesian-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Refined Indonesian food for a special occasion or a dressed-up dinner';
-- expect: UPDATE 1

-- 107. W-motion-fitness-bali-seminyak-best_for · motion-fitness-bali-seminyak · best_for · restore before
update venues set best_for = 'Those who prefer class-based training in central Seminyak.' where slug = 'motion-fitness-bali-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Class-based training in central Seminyak';
-- expect: UPDATE 1

-- 108. W-natys-restaurant-seminyak-why_its_here · natys-restaurant-seminyak · why_its_here · restore before
update venues set why_its_here = 'All-day restaurant on Jl. Kayu Aya (Oberoi/Eat Street), Seminyak, serving Indonesian, seafood and European dishes; a front fishmonger display lets guests pick fresh fish for the grill. Open breakfast through late night, with cocktails and shisha.' where slug = 'natys-restaurant-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At the front of this all-day restaurant on Jl. Kayu Aya (Oberoi/Eat Street), a fishmonger display lets you pick fresh fish for the grill. The menu is Indonesian, seafood and European, and it runs from breakfast to late night with cocktails and shisha.';
-- expect: UPDATE 1

-- 109. W-natys-restaurant-seminyak-best_for · natys-restaurant-seminyak · best_for · restore before
update venues set best_for = 'groups sharing grilled seafood and ribs; visitors wanting all-day/late dining on Eat Street; cocktail-and-shisha evenings' where slug = 'natys-restaurant-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A group sharing grilled seafood and ribs, or a late evening of cocktails and shisha on Eat Street';
-- expect: UPDATE 1

-- 110. W-natys-restaurant-seminyak-not_for · natys-restaurant-seminyak · not_for · restore before
update venues set not_for = 'diners seeking a quiet rice-field or off-strip setting' where slug = 'natys-restaurant-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet rice-field or off-strip setting — this is all-day dining on Eat Street';
-- expect: UPDATE 1

-- 111. W-naughty-nuris-warung-seminyak-why_its_here · naughty-nuris-warung-seminyak · why_its_here · restore before
update venues set why_its_here = 'The Seminyak-area (Batu Belig) branch, opened in 2016, of the Ubud institution — known for Balinese-style barbecued pork ribs and its potent martinis, in a casual warung format.' where slug = 'naughty-nuris-warung-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Naughty Nuri''s opened this Batu Belig branch of its Ubud original in 2016. It''s a casual warung for Balinese-style barbecued pork ribs and potent martinis.';
-- expect: UPDATE 1

-- 112. W-naughty-nuris-warung-seminyak-best_for · naughty-nuris-warung-seminyak · best_for · restore before
update venues set best_for = 'a group here for smoky ribs and martinis; a casual, no-fuss dinner; an easy meal soon after landing' where slug = 'naughty-nuris-warung-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A group out for smoky ribs and martinis, or an easy dinner soon after landing';
-- expect: UPDATE 1

-- 113. W-naughty-nuris-warung-seminyak-not_for · naughty-nuris-warung-seminyak · not_for · restore before
update venues set not_for = 'diners wanting a refined, quiet dining room, or those avoiding pork (ribs are the draw)' where slug = 'naughty-nuris-warung-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone avoiding pork or after a refined, quiet room: ribs are the draw at this casual warung';
-- expect: UPDATE 1

-- 114. W-norii-japanese-restaurant-seminyak-why_its_here · norii-japanese-restaurant-seminyak · why_its_here · restore before
update venues set why_its_here = 'Japanese restaurant in Umalas, part of the Wonderspace group. Sushi, wagyu don and wagyu skewers. Robatayaki beef with charred vegetables. Cocktails built on yuzu, matcha and sake.' where slug = 'norii-japanese-restaurant-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Part of the Wonderspace group, this Japanese restaurant in Umalas does sushi, wagyu don and wagyu skewers. Robatayaki beef comes with charred vegetables, and the cocktails are built on yuzu, matcha and sake.';
-- expect: UPDATE 1

-- 115. W-pantai-kuta-why_its_here · pantai-kuta · why_its_here · restore before
update venues set why_its_here = 'Bali''s original and best-known beach, a long stretch of sand in Kuta, Badung, known for sunset and surf breaks close to shore.' where slug = 'pantai-kuta' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pantai Kuta is a long stretch of sand in Badung, with surf breaks close to shore and sunsets by the water.';
-- expect: UPDATE 1

-- 116. W-pavilion-surf-club-kuta-legian-why_its_here · pavilion-surf-club-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Bar in Legian. Cold beer for the game, wine with dinner and signature cocktails as the sun goes down over Legian Beach. Happy hour: COCKTAIL SPECIAL: 140K each - BUY ONE GET ONE FREE. Booking is by WhatsApp.' where slug = 'pavilion-surf-club-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Legian bar for cold beer during the game, wine with dinner and cocktails as the sun goes down over Legian Beach. At happy hour, cocktails are 140K each, buy one get one free. Booking is by WhatsApp.';
-- expect: UPDATE 1

-- 117. W-pavilion-surf-club-kuta-legian-best_for · pavilion-surf-club-kuta-legian · best_for · restore before
update venues set best_for = 'An evening out for drinks, not a full sit-down meal.' where slug = 'pavilion-surf-club-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Drinks as the sun goes down over Legian Beach';
-- expect: UPDATE 1

-- 118. W-pison-petitenget-why_its_here · pison-petitenget · why_its_here · restore before
update venues set why_its_here = 'A long-running Asian-Western café on Jl. Petitenget, open since 2014, set in a two-storey red-brick building with high ceilings and exposed beams, doing all-day brunch with an Asian twist alongside serious locally-sourced coffee — known for its espresso-avocado, crispy pork belly fried rice, and live music most nights.' where slug = 'pison-petitenget' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Since 2014, Pison has been an Asian-Western café in a two-storey red-brick building on Jl. Petitenget, with high ceilings and exposed beams. All-day brunch has an Asian twist; the espresso-avocado and crispy pork belly fried rice are the orders. The coffee is locally sourced.';
-- expect: UPDATE 1

-- 119. W-pison-petitenget-best_for · pison-petitenget · best_for · restore before
update venues set best_for = 'Brunch, a good flat white, or an easy evening with cocktails and live music around Petitenget.' where slug = 'pison-petitenget' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Brunch with a flat white, or cocktails and live music most nights around Petitenget';
-- expect: UPDATE 1

-- 120. W-potato-head-beach-club-why_its_here · potato-head-beach-club · why_its_here · restore before
update venues set why_its_here = 'The venue that put Seminyak''s beach-club scene on the map, opened in 2010 on Jl. Petitenget behind an amphitheatre facade of around 5,000 vintage teakwood shutters by architect Andra Matin, with an oceanfront infinity pool, lawn beanbags and sunset DJ sets. Now the anchor of the sustainability-minded Desa Potato Head resort, it serves cocktails and an international-meets-Indonesian menu through the day.' where slug = 'potato-head-beach-club' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Potato Head Beach Club opened on Jl. Petitenget in 2010, behind an amphitheatre facade of around 5,000 vintage teakwood shutters by Andra Matin. DJs play at sunset. It anchors the Desa Potato Head resort and serves cocktails and an international-meets-Indonesian menu through the day.';
-- expect: UPDATE 1

-- 121. W-potato-head-beach-club-best_for · potato-head-beach-club · best_for · restore before
update venues set best_for = 'Sunset drinks, DJ sessions and a daybed by the pool — best for a stylish afternoon-into-evening rather than a quiet meal.' where slug = 'potato-head-beach-club' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset drinks from a daybed by the oceanfront infinity pool or a beanbag on the lawn, into the evening';
-- expect: UPDATE 1

-- 122. W-potato-head-beach-club-not_for · potato-head-beach-club · not_for · restore NULL
update venues set not_for = null where slug = 'potato-head-beach-club' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet meal: the afternoon runs into DJ sets and sunset drinks';
-- expect: UPDATE 1

-- 123. W-prana-spa-seminyak-why_its_here · prana-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'One of Bali''s largest and most theatrical day spas, set at Impiana Private Villas (formerly The Villas) on Jl. Kunti. Moorish-inspired interiors, domed ceilings, mosaic tiles and candle-lit corridors house an Indian- and Middle-Eastern-influenced treatment menu including traditional Ayurveda, plus plunge pools, saunas and steam rooms.' where slug = 'prana-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A day spa at Impiana Private Villas (formerly The Villas) on Jl. Kunti, with Moorish-inspired interiors: domed ceilings, mosaic tiles and candle-lit corridors. The treatment menu is Indian- and Middle-Eastern-influenced, including traditional Ayurveda, and there are plunge pools, saunas and steam rooms.';
-- expect: UPDATE 1

-- 124. W-prana-spa-seminyak-best_for · prana-spa-seminyak · best_for · restore before
update venues set best_for = 'Guests who want an immersive, design-forward spa half-day and are curious about Ayurvedic rituals; special-occasion pampering.' where slug = 'prana-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An immersive spa half-day with Ayurvedic rituals, or pampering for a special occasion';
-- expect: UPDATE 1

-- 125. W-prana-spa-seminyak-not_for · prana-spa-seminyak · not_for · restore before
update venues set not_for = 'Travellers looking for a quick, low-key neighbourhood massage.' where slug = 'prana-spa-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick, low-key neighbourhood massage — Prana is theatrical, built for a spa half-day';
-- expect: UPDATE 1

-- 126. W-prana-spa-yoga-fitness-adjacent-seminyak-why_its_here · prana-spa-yoga-fitness-adjacent-seminyak · why_its_here · restore before
update venues set why_its_here = 'The movement side of the landmark Moroccan-styled Prana Spa at Seminyak''s Impiana resort, offering yoga and fitness alongside its famous spa.' where slug = 'prana-spa-yoga-fitness-adjacent-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The movement side of Prana Spa, the Moroccan-styled spa at Seminyak''s Impiana resort: yoga and fitness alongside the treatments.';
-- expect: UPDATE 1

-- 127. W-prana-spa-yoga-fitness-adjacent-seminyak-best_for · prana-spa-yoga-fitness-adjacent-seminyak · best_for · restore before
update venues set best_for = 'Those who want to pair movement with a treatment at a destination spa.' where slug = 'prana-spa-yoga-fitness-adjacent-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga or a workout paired with a treatment at a destination spa';
-- expect: UPDATE 1

-- 128. W-prana-yoga-seminyak-why_its_here · prana-yoga-seminyak · why_its_here · restore before
update venues set why_its_here = 'The dedicated Yoga Centre at Prana Spa (Impiana Private Villas, Jl. Kunti 118X) — one of Seminyak''s largest spas — running daily and private classes across Vinyasa, Anusara, Power Vinyasa, Meditative Flow and Sivananda in an ornate Indian/Middle-Eastern-inspired setting.' where slug = 'prana-yoga-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Prana Spa''s dedicated Yoga Centre runs daily and private classes at Impiana Private Villas, Jl. Kunti 118X. Classes cover Vinyasa, Anusara, Power Vinyasa, Meditative Flow and Sivananda, in an ornate Indian/Middle-Eastern-inspired setting.';
-- expect: UPDATE 1

-- 129. W-prana-yoga-seminyak-best_for · prana-yoga-seminyak · best_for · restore before
update venues set best_for = 'Villa and spa guests wanting a calm, upscale yoga class they can combine with a treatment.' where slug = 'prana-yoga-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm, upscale yoga class to combine with a treatment, for villa and spa guests';
-- expect: UPDATE 1

-- 130. W-pura-kehen-why_its_here · pura-kehen · why_its_here · restore before
update venues set why_its_here = 'Bangli''s state temple, a multi-tiered terraced complex set into a hillside, known for antique Chinese porcelain plates set into its walls.' where slug = 'pura-kehen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pura Kehen is Bangli''s state temple, a multi-tiered terraced complex set into a hillside. Antique Chinese porcelain plates are set into its walls.';
-- expect: UPDATE 1

-- 131. W-rai-fitness-sunset-bali-why_its_here · rai-fitness-sunset-bali · why_its_here · restore before
update venues set why_its_here = 'The first mega gym in Bali, opened in 2013 by Ade Rai, a world bodybuilding champion. Life Fitness equipment and more than 40 group classes powered by Les Mills, plus zumba, pilates and yoga with licensed instructors. A pool, sauna, garden, basketball and futsal courts, and free parking. A day is 55,000 IDR and a month 699,000.' where slug = 'rai-fitness-sunset-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ade Rai opened this mega gym in 2013, with Life Fitness equipment and more than 40 Les Mills classes, plus zumba, pilates and yoga. There''s a pool, a sauna, basketball and futsal courts, and free parking. A day costs 55,000 IDR and a month 699,000.';
-- expect: UPDATE 1

-- 132. W-rai-fitness-sunset-road-seminyak-why_its_here · rai-fitness-sunset-road-seminyak · why_its_here · restore before
update venues set why_its_here = 'Founded by Indonesian bodybuilding icon Ade Rai, this is one of Bali''s original mega-gyms on Sunset Road: an enormous Life Fitness weight floor, big cardio section, 40+ Les Mills and other group classes, plus pool, sauna and free parking.' where slug = 'rai-fitness-sunset-road-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This mega-gym on Sunset Road was founded by Ade Rai. It has an enormous Life Fitness weight floor, a big cardio section and 40+ Les Mills and other group classes. There''s a pool and a sauna, and parking is free.';
-- expect: UPDATE 1

-- 133. W-rai-fitness-sunset-road-seminyak-best_for · rai-fitness-sunset-road-seminyak · best_for · restore before
update venues set best_for = 'Serious lifters and travellers who want a large, fully-kitted gym with a wide class timetable and are happy to ride out to Sunset Road.' where slug = 'rai-fitness-sunset-road-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Lifters after a large, fully kitted gym with a wide class timetable, happy to ride out to Sunset Road';
-- expect: UPDATE 1

-- 134. W-rai-fitness-sunset-road-seminyak-not_for · rai-fitness-sunset-road-seminyak · not_for · restore before
update venues set not_for = 'Anyone wanting a small studio within walking distance of central Seminyak.' where slug = 'rai-fitness-sunset-road-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A small studio within walking distance of central Seminyak, because the gym is big and out on Sunset Road';
-- expect: UPDATE 1

-- 135. W-rejuvie-aesthetic-bali-seminyak-seminyak-best_for · rejuvie-aesthetic-bali-seminyak-seminyak · best_for · restore before
update venues set best_for = 'Visitors after results-focused skin and aesthetic treatments.' where slug = 'rejuvie-aesthetic-bali-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Results-focused skin and aesthetic treatments';
-- expect: UPDATE 1

-- 136. W-revive-pilates-umalas-why_its_here · revive-pilates-umalas · why_its_here · restore before
update venues set why_its_here = 'A reformer Pilates studio with an Umalas location (and one in Canggu), running a high-volume weekly schedule of reformer and mat classes across beginner to advanced levels, plus signature Gluteformer and Sweatformer formats. On-site café serves coffee, matcha and protein smoothies.' where slug = 'revive-pilates-umalas' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Revive''s reformer Pilates studio in Umalas (there''s another in Canggu) runs a high-volume weekly schedule of reformer and mat classes, beginner to advanced. Its own formats include Gluteformer and Sweatformer, and the on-site café serves coffee, matcha and protein smoothies.';
-- expect: UPDATE 1

-- 137. W-revive-pilates-umalas-best_for · revive-pilates-umalas · best_for · restore before
update venues set best_for = 'long-stay residents wanting a busy timetable and many slots; reformer regulars across all levels; those pairing a class with a café stop' where slug = 'revive-pilates-umalas' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reformer regulars at any level, or long-stay residents after a busy timetable with plenty of slots';
-- expect: UPDATE 1

-- 138. W-revive-pilates-umalas-not_for · revive-pilates-umalas · not_for · restore before
update venues set not_for = 'people wanting a slow, low-intensity or spa-style wellness session' where slug = 'revive-pilates-umalas' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A slow, low-intensity or spa-style session. Revive runs a high-volume reformer schedule';
-- expect: UPDATE 1

-- 139. W-revolver-seminyak-why_its_here · revolver-seminyak · why_its_here · restore before
update venues set why_its_here = 'One of Seminyak''s pioneering specialty-coffee cafes, open since 2012 and roasting its own beans locally, tucked down a lane off Jl. Kayu Aya. Known for its dark, timber-and-brick "hidden bar" interior and a hearty brunch alongside the coffee.' where slug = 'revolver-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Down a lane off Jl. Kayu Aya, Revolver is a specialty-coffee cafe, open since 2012, that roasts its own beans locally. The interior is dark timber and brick, like a hidden bar, and the brunch is hearty.';
-- expect: UPDATE 1

-- 140. W-revolver-seminyak-best_for · revolver-seminyak · best_for · restore before
update venues set best_for = 'serious coffee before or after the beach; a sit-down brunch; a caffeine stop while exploring the Oberoi strip' where slug = 'revolver-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Coffee before or after the beach, a sit-down brunch, or a stop while exploring the Oberoi strip';
-- expect: UPDATE 1

-- 141. W-revolver-seminyak-not_for · revolver-seminyak · not_for · restore before
update venues set not_for = 'anyone needing a quiet laptop/work session or space for a large group' where slug = 'revolver-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet laptop session or a large group: the space suits neither';
-- expect: UPDATE 1

-- 142. W-rip-curl-surf-school-kuta-legian-why_its_here · rip-curl-surf-school-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Kuta''s long, gentle beach break is one of the classic places to learn to surf in Bali, and this school runs guided lessons with boards and instructors right off the sand in central Kuta.' where slug = 'rip-curl-surf-school-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Rip Curl''s surf school runs guided lessons right off the sand in central Kuta, boards and instructors included. Kuta''s beach break is long and gentle.';
-- expect: UPDATE 1

-- 143. W-rob-peetoom-hair-spa-bali-seminyak-why_its_here · rob-peetoom-hair-spa-bali-seminyak · why_its_here · restore before
update venues set why_its_here = 'The Bali outpost (opened 2012) of Dutch salon brand Rob Peetoom, at Petitenget St No. 16 overlooking rice paddies. Set across three Balinese-village-inspired pavilions, it offers expert hair styling, colour, make-up and signature hair-and-scalp rituals.' where slug = 'rob-peetoom-hair-spa-bali-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Dutch salon brand Rob Peetoom opened this Bali outpost in 2012 at Petitenget St No. 16, overlooking rice paddies. Across three pavilions modelled on a Balinese village, it does hair styling, colour, make-up and hair-and-scalp rituals.';
-- expect: UPDATE 1

-- 144. W-rob-peetoom-hair-spa-bali-seminyak-best_for · rob-peetoom-hair-spa-bali-seminyak · best_for · restore before
update venues set best_for = 'Travellers wanting international-standard hair styling and colour, or a hair-and-scalp ritual in a scenic rice-field setting.' where slug = 'rob-peetoom-hair-spa-bali-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'International-standard styling and colour, or a hair-and-scalp ritual looking over the rice fields';
-- expect: UPDATE 1

-- 145. W-saia-wellness-saia-pilates-umalas-why_its_here · saia-wellness-saia-pilates-umalas · why_its_here · restore before
update venues set why_its_here = 'A modern reformer Pilates studio, part of the SAIA Wellness group, with an Umalas location open seven days a week; classes run on new reformers, capped at 7 clients, across all levels with form-focused instruction. Private sessions are also offered.' where slug = 'saia-wellness-saia-pilates-umalas' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The SAIA Wellness group runs this modern reformer Pilates studio in Umalas, open seven days a week. Classes on new reformers are capped at 7 clients, cover all levels and focus on form, and private sessions are available too.';
-- expect: UPDATE 1

-- 146. W-saia-wellness-saia-pilates-umalas-best_for · saia-wellness-saia-pilates-umalas · best_for · restore before
update venues set best_for = 'reformer beginners through advanced who want small-group attention; travellers wanting a calm, design-led studio; those booking one-off drop-ins' where slug = 'saia-wellness-saia-pilates-umalas' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Small-group reformer classes at any level in a calm, design-led studio, drop-ins included';
-- expect: UPDATE 1

-- 147. W-saia-wellness-saia-pilates-umalas-not_for · saia-wellness-saia-pilates-umalas · not_for · restore before
update venues set not_for = 'anyone seeking large open-gym or spa/massage treatments rather than structured Pilates classes' where slug = 'saia-wellness-saia-pilates-umalas' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A large open gym or spa and massage treatments: the classes are structured Pilates';
-- expect: UPDATE 1

-- 148. W-sangsaka-why_its_here · sangsaka · why_its_here · restore before
update venues set why_its_here = 'Modern Indonesian restaurant on Jl. Petitenget from Kieran and Yunika Morland, cooking heritage recipes over a wood-fired oven and charcoal grills with regional ingredients from across the archipelago — known for its beef rendang, smoked and grilled seafood, and a rooftop bar called Diatas.' where slug = 'sangsaka' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kieran and Yunika Morland''s modern Indonesian restaurant cooks heritage recipes over a wood-fired oven and charcoal grills. Ingredients are regional, from across the archipelago. Beef rendang and smoked and grilled seafood are the dishes to order; the rooftop bar is called Diatas.';
-- expect: UPDATE 1

-- 149. W-sangsaka-best_for · sangsaka · best_for · restore before
update venues set best_for = 'A relaxed but elevated dinner for travellers wanting inventive Indonesian cooking beyond the usual tourist menus.' where slug = 'sangsaka' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A dinner of inventive Indonesian cooking beyond the usual tourist menus';
-- expect: UPDATE 1

-- 150. W-sardine-why_its_here · sardine · why_its_here · restore before
update venues set why_its_here = 'A long-running seafood restaurant on Jl. Petitenget set in a bamboo pavilion that looks out over a working rice paddy, serving fresh Indian Ocean catch (yellowfin tuna, snapper, scallops) with French technique and organic produce from its own Bedugul farm.' where slug = 'sardine' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A seafood restaurant in a bamboo pavilion on Jl. Petitenget, looking out over a working rice paddy. The kitchen cooks fresh Indian Ocean catch, such as yellowfin tuna, snapper and scallops, with French technique and organic produce from its own Bedugul farm.';
-- expect: UPDATE 1

-- 151. W-sate-khas-senayan-beachwalk-why_its_here · sate-khas-senayan-beachwalk · why_its_here · restore before
update venues set why_its_here = 'A long-running Indonesian restaurant chain (Sarirasa Group) serving dependable, authentic classics — satay, soto, gado-gado — in an air-conditioned mall setting steps from Kuta beach. It''s the reliable, family-safe Indonesian meal when you want the real thing without hunting for a warung.' where slug = 'sate-khas-senayan-beachwalk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Sarirasa Group chain restaurant cooking Indonesian classics in an air-conditioned mall, steps from Kuta beach. Satay, soto and gado-gado are on the menu: a family-safe Indonesian meal without hunting for a warung.';
-- expect: UPDATE 1

-- 152. W-sate-khas-senayan-beachwalk-best_for · sate-khas-senayan-beachwalk · best_for · restore before
update venues set best_for = 'a dependable Indonesian meal in air-conditioning; families and just-landed first dinners; a safe introduction to Indonesian classics near Kuta' where slug = 'sate-khas-senayan-beachwalk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A first Indonesian dinner after landing, or a family meal in air-conditioning near Kuta';
-- expect: UPDATE 1

-- 153. W-sate-khas-senayan-beachwalk-not_for · sate-khas-senayan-beachwalk · not_for · restore before
update venues set not_for = 'warung prices; a romantic or scenic setting; travellers seeking a hidden local find' where slug = 'sate-khas-senayan-beachwalk' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Warung prices or a romantic, scenic setting: you''re eating at a chain restaurant inside a mall';
-- expect: UPDATE 1

-- 154. W-sea-circus-why_its_here · sea-circus · why_its_here · restore before
update venues set why_its_here = 'A colourful, long-running café and bar on Jl. Kayu Aya, open since 2010, known for all-day brunch, tacos and cocktails in a playful coral-pink-striped setting; the menu runs from acai bowls, benedicts and breakfast burritos to pulled-pork and baja fish tacos, with plenty of vegan and gluten-free options.' where slug = 'sea-circus' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Open since 2010, this café and bar on Jl. Kayu Aya does all-day brunch, tacos and cocktails in a playful coral-pink-striped setting. The menu runs from acai bowls, benedicts and breakfast burritos to pulled-pork and baja fish tacos, with plenty of vegan and gluten-free options.';
-- expect: UPDATE 1

-- 155. W-seminyak-yoga-shala-best_for · seminyak-yoga-shala · best_for · restore before
update venues set best_for = 'Visitors wanting accessible daily classes near the Seminyak strip.' where slug = 'seminyak-yoga-shala' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Accessible daily classes near the Seminyak strip';
-- expect: UPDATE 1

-- 156. W-shichirin-japanese-restaurant-seminyak-why_its_here · shichirin-japanese-restaurant-seminyak · why_its_here · restore before
update venues set why_its_here = 'Japanese grill restaurant on Jl. Dewi Saraswati, open since January 2025. The third Shichirin on the island, after Ubud and Canggu. Teppanyaki, gyukatsu, sushi and sashimi.' where slug = 'shichirin-japanese-restaurant-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Japanese grill doing teppanyaki, gyukatsu, sushi and sashimi on Jl. Dewi Saraswati. It opened in January 2025.';
-- expect: UPDATE 1

-- 157. W-sisterfields-why_its_here · sisterfields · why_its_here · restore before
update venues set why_its_here = 'A long-running Australian-style cafe on Jl. Kayu Cendana in central Seminyak, opposite Seminyak Village, serving an all-day brunch menu and specialty coffee in a bright, tiled minimalist space — signature plates include truffle scrambled eggs, bacon benedict, smashed avocado and acai bowls.' where slug = 'sisterfields' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Opposite Seminyak Village on Jl. Kayu Cendana, Sisterfields is an Australian-style cafe doing all-day brunch and specialty coffee. The space is bright, tiled and minimalist, and plates include truffle scrambled eggs, bacon benedict, smashed avocado and acai bowls.';
-- expect: UPDATE 1

-- 158. W-sisterfields-best_for · sisterfields · best_for · restore before
update venues set best_for = 'Brunch and good coffee between Seminyak shopping — a lively, dependable all-day cafe.' where slug = 'sisterfields' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Brunch and coffee between Seminyak shops, at a lively all-day cafe';
-- expect: UPDATE 1

-- 159. W-soham-pilates-class-program-seminyak-best_for · soham-pilates-class-program-seminyak · best_for · restore before
update venues set best_for = 'Those who want structured Pilates within a full wellness centre.' where slug = 'soham-pilates-class-program-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Structured Pilates, on the mat or on equipment, inside a full wellness centre';
-- expect: UPDATE 1

-- 160. W-soham-wellness-center-seminyak-why_its_here · soham-wellness-center-seminyak · why_its_here · restore before
update venues set why_its_here = 'A ~2,500 sqm all-in-one wellness complex in Petitenget: a fully-equipped gym, a half-Olympic swimming pool, a broad group-class timetable (Pilates, HIIT, spinning, TRX, yoga, dance), a luxe spa, plus steam, sauna and hot/cold plunge pools and a healthy cafe.' where slug = 'soham-wellness-center-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An all-in-one wellness complex of about 2,500 sqm in Petitenget, with a fully equipped gym and a half-Olympic pool. The group-class timetable is broad (Pilates, HIIT, spinning, TRX, yoga, dance). A luxe spa, steam, sauna and hot/cold plunge pools sit alongside a healthy cafe.';
-- expect: UPDATE 1

-- 161. W-soham-wellness-center-seminyak-best_for · soham-wellness-center-seminyak · best_for · restore before
update venues set best_for = 'Travellers and longer-stay guests who want gym, classes, pool and spa under one roof for a full wellness day.' where slug = 'soham-wellness-center-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A full wellness day of gym, classes, pool and spa under one roof';
-- expect: UPDATE 1

-- 162. W-soham-wellness-center-seminyak-not_for · soham-wellness-center-seminyak · not_for · restore before
update venues set not_for = 'Anyone after a quick, low-cost drop-in gym rather than a full resort-style facility.' where slug = 'soham-wellness-center-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick, low-cost drop-in gym rather than a full resort-style facility';
-- expect: UPDATE 1

-- 163. W-soham-wellness-spa-seminyak-best_for · soham-wellness-spa-seminyak · best_for · restore before
update venues set best_for = 'Visitors who want spa, yoga and Pilates under one Petitenget roof.' where slug = 'soham-wellness-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Spa, yoga and Pilates under one Petitenget roof';
-- expect: UPDATE 1

-- 164. W-soham-yoga-seminyak-best_for · soham-yoga-seminyak · best_for · restore before
update venues set best_for = 'Guests who want daily yoga as part of a one-stop wellness centre.' where slug = 'soham-yoga-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Daily yoga as part of a one-stop wellness centre';
-- expect: UPDATE 1

-- 165. W-spring-spa-seminyak-why_its_here · spring-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'The Seminyak branch of Spring Spa, an island-wide chain of bright, dependable salons for nails, waxing, massage and facials at fair prices.' where slug = 'spring-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Seminyak branch of Spring Spa, an island-wide chain of bright salons for nails, waxing, massage and facials at fair prices.';
-- expect: UPDATE 1

-- 166. W-spring-spa-seminyak-best_for · spring-spa-seminyak · best_for · restore before
update venues set best_for = 'Visitors wanting a reliable, walk-in mani-pedi or quick massage.' where slug = 'spring-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A walk-in mani-pedi or a quick massage';
-- expect: UPDATE 1

-- 167. W-sundari-day-spa-seminyak-why_its_here · sundari-day-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'A long-running Petitenget day spa (branded Sundari Wellness) blending modern and traditional techniques with natural products, offering massages, body treatments, facials and mani-pedis across a wide menu, open late into the evening.' where slug = 'sundari-day-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Petitenget day spa, branded Sundari Wellness, that mixes modern and traditional techniques with natural products. The wide menu covers massages, body treatments, facials and mani-pedis, and it stays open late into the evening.';
-- expect: UPDATE 1

-- 168. W-sundari-day-spa-seminyak-best_for · sundari-day-spa-seminyak · best_for · restore before
update venues set best_for = 'Visitors who want a full menu of treatments in one calm Petitenget address, including evening appointments after the beach.' where slug = 'sundari-day-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Evening appointments after the beach, or a full menu of treatments at one calm Petitenget address';
-- expect: UPDATE 1

-- 169. W-the-goat-seminyak-why_its_here · the-goat-seminyak · why_its_here · restore before
update venues set why_its_here = 'Bar in Seminyak. Open for Breakfast, Lunch, Dinner and Late Night Bites, with Live Music and DJ''s every night from 8pm. Cake Cups is 75K IDR. Booking is on the venue''s own site.' where slug = 'the-goat-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This Seminyak bar is open for breakfast, lunch, dinner and late-night bites. Live music and DJs play every night from 8pm. Cake Cups are 75K IDR, and booking is on the venue''s own site.';
-- expect: UPDATE 1

-- 170. W-the-goat-seminyak-best_for · the-goat-seminyak · best_for · restore before
update venues set best_for = 'An evening out for drinks, not a full sit-down meal.' where slug = 'the-goat-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Live music and drinks on a night out';
-- expect: UPDATE 1

-- 171. W-the-laneway-restaurant-seminyak-why_its_here · the-laneway-restaurant-seminyak · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Seminyak. The kitchen is described as fine dining. The published menu runs to 4 priced items — Berawa Cocktail, In-Villa BBQ and Wednesday Night Market. Arak Cocktail is 100K IDR. Booking is on the venue''s own site.' where slug = 'the-laneway-restaurant-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Seminyak restaurant whose published menu runs to 4 priced items. Arak Cocktail is 100K IDR. Booking is on the venue''s own site.';
-- expect: UPDATE 1

-- 172. W-the-legian-seminyak-wellness-yoga-why_its_here · the-legian-seminyak-wellness-yoga · why_its_here · restore before
update venues set why_its_here = 'Wellness by The Legian on Jl. Kayu Aya, open to outside visitors as well as hotel guests. The Studio runs daily yoga and pilates, mindfulness meditation, HIIT, aqua-aerobics and group spin; the gymnasium is kitted out with Technogym equipment and personal trainers. Steam, sauna and hot and cold plunge sit alongside a relaxation lounge, and a day pass covers pool access and classes.' where slug = 'the-legian-seminyak-wellness-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Wellness by The Legian, on Jl. Kayu Aya, is open to non-guests too. Daily classes cover yoga, pilates, meditation, HIIT, aqua-aerobics and spin; the gym has Technogym equipment and personal trainers. Steam and sauna rooms and a hot/cold plunge sit beside a relaxation lounge.';
-- expect: UPDATE 1

-- 173. W-the-legian-seminyak-wellness-yoga-best_for · the-legian-seminyak-wellness-yoga · best_for · restore before
update venues set best_for = 'Seminyak visitors who want a full class timetable and Technogym floor on a day pass, not only as a hotel guest.' where slug = 'the-legian-seminyak-wellness-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A day pass covering the pool, the class timetable and the Technogym floor';
-- expect: UPDATE 1

-- 174. W-the-shampoo-lounge-seminyak-seminyak-why_its_here · the-shampoo-lounge-seminyak-seminyak · why_its_here · restore before
update venues set why_its_here = 'Billed as Bali''s original integrated salon-spa-barber (since 2012) on Jl. Raya Basangkasa, offering hair cuts, colour, keratin and extensions, plus nails, lashes, facials, massage and a men''s barber, with one of Bali''s largest bridal hair-and-make-up teams.' where slug = 'the-shampoo-lounge-seminyak-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An integrated salon, spa and barber on Jl. Raya Basangkasa, running since 2012. Hair covers cuts, colour, keratin and extensions; there are also nails, lashes, facials, massage, a men''s barber and a bridal hair-and-make-up team.';
-- expect: UPDATE 1

-- 175. W-the-shampoo-lounge-seminyak-seminyak-best_for · the-shampoo-lounge-seminyak-seminyak · best_for · restore before
update venues set best_for = 'Groups and families who want hair, beauty, nails and barber services together in one Seminyak spot; bridal parties.' where slug = 'the-shampoo-lounge-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families and groups, bridal parties included, doing hair, beauty, nails and barber together in one Seminyak spot';
-- expect: UPDATE 1

-- 176. W-the-shampoo-lounge-seminyak-seminyak-not_for · the-shampoo-lounge-seminyak-seminyak · not_for · restore before
update venues set not_for = 'Anyone seeking a quiet single-treatment retreat.' where slug = 'the-shampoo-lounge-seminyak-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, single-treatment visit — hair, beauty, nails and barber all run in one place';
-- expect: UPDATE 1

-- 177. W-therapy-hair-spa-seminyak-why_its_here · therapy-hair-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'Therapy''s Seminyak branch, where a hair salon and a day spa share one address — cuts and colour alongside facials and massage.' where slug = 'therapy-hair-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Therapy''s Seminyak branch, where a hair salon and a day spa share one address. Cuts and colour sit alongside facials and massage.';
-- expect: UPDATE 1

-- 178. W-therapy-hair-spa-seminyak-best_for · therapy-hair-spa-seminyak · best_for · restore before
update venues set best_for = 'Anyone wanting hair and beauty under one roof in Seminyak.' where slug = 'therapy-hair-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Hair and beauty under one roof in Seminyak';
-- expect: UPDATE 1

-- 179. W-think-pink-nails-seminyak-why_its_here · think-pink-nails-seminyak · why_its_here · restore before
update venues set why_its_here = 'The Seminyak flagship of Think Pink on Jl. Batu Belig — manicures, pedicures, BIAB and nail art alongside hair and skin services, with a private Netflix room for treatments.' where slug = 'think-pink-nails-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Think Pink runs its Seminyak flagship on Jl. Batu Belig, doing manicures, pedicures, BIAB and nail art. It also does hair and skin, and there''s a private Netflix room for treatments. A separate Think Pink branch runs in Canggu.';
-- expect: UPDATE 1

-- 180. W-think-pink-nails-seminyak-best_for · think-pink-nails-seminyak · best_for · restore before
update venues set best_for = 'A colourful, well-priced mani-pedi or nail-art session in central Seminyak; a separate Think Pink branch runs in Canggu.' where slug = 'think-pink-nails-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A colourful, well-priced mani-pedi or nail-art session in central Seminyak';
-- expect: UPDATE 1

-- 181. W-think-pink-salon-and-nails-bali-why_its_here · think-pink-salon-and-nails-bali · why_its_here · restore before
update venues set why_its_here = 'A long-running nail, hair and skin salon offering manicures, pedicures, BIAB and nail art with an extensive polish range, plus hair and skin services. Rooms include a private space for a treatment while watching Netflix.' where slug = 'think-pink-salon-and-nails-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A nail salon in Batu Belig with an extensive polish range for manicures, pedicures, BIAB and nail art. Hair and skin services run alongside, and there''s a private room for watching Netflix during a treatment.';
-- expect: UPDATE 1

-- 182. W-think-pink-salon-and-nails-bali-best_for · think-pink-salon-and-nails-bali · best_for · restore before
update venues set best_for = 'nails, lash and beauty appointments; friends going together for a pampering session; travellers wanting a wide gel/BIAB and nail-art menu' where slug = 'think-pink-salon-and-nails-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A nail, lash or gel/BIAB appointment, or a nail-art session with friends';
-- expect: UPDATE 1

-- 183. W-think-pink-salon-and-nails-bali-not_for · think-pink-salon-and-nails-bali · not_for · restore before
update venues set not_for = 'walk-ins expecting immediate slots (advance booking is advised); those wanting massage/spa-focused wellness rather than salon services' where slug = 'think-pink-salon-and-nails-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Walk-ins expecting an immediate slot, or a massage-focused spa visit: booking ahead is advised, and the focus is salon work';
-- expect: UPDATE 1

-- 184. W-to-the-moon-cafe-why_its_here · to-the-moon-cafe · why_its_here · restore before
update venues set why_its_here = 'Cafe in Umalas serving signature sushi rolls alongside Western plates. Beef and salmon steaks, gourmet burgers, pancakes and smoothie bowls. Dine-in, takeaway and delivery, with free parking.' where slug = 'to-the-moon-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sushi rolls share the menu with Western plates at this Umalas cafe on Jl. Bumbak: beef and salmon steaks, gourmet burgers, pancakes and smoothie bowls. It does takeaway and delivery as well as dine-in, and parking is free.';
-- expect: UPDATE 1

-- 185. W-vincent-nigita-why_its_here · vincent-nigita · why_its_here · restore before
update venues set why_its_here = 'A French patisserie inside Kanvaz resort from Bordeaux-trained pastry chef Vincent Nigita, pairing classical French technique with Indonesian flavours. Classic pastries sit alongside a weekend tea-room experience of plated desserts.' where slug = 'vincent-nigita' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bordeaux-trained pastry chef Vincent Nigita runs this French patisserie inside Kanvaz resort, pairing classical French technique with Indonesian flavours. Classic pastries sit alongside plated desserts in a weekend tea room.';
-- expect: UPDATE 1

-- 186. W-vincent-nigita-best_for · vincent-nigita · best_for · restore before
update venues set best_for = 'afternoon pastry and tea; a sweet treat with care; a calm indulgent pause; a special sweet moment' where slug = 'vincent-nigita' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Afternoon pastry and tea, or plated desserts in the weekend tea room';
-- expect: UPDATE 1

-- 187. W-vincent-nigita-not_for · vincent-nigita · not_for · restore before
update venues set not_for = 'a full savoury meal or a budget-casual bite; those after a quick grab-and-go snack' where slug = 'vincent-nigita' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full savoury meal, a budget bite or a quick grab-and-go snack: the kitchen makes pastries and plated desserts';
-- expect: UPDATE 1

-- 188. W-w-bali-wellness-yoga-why_its_here · w-bali-wellness-yoga · why_its_here · restore before
update venues set why_its_here = 'The yoga and class programme at W Bali in Seminyak, run out of FIT, the resort''s 24-hour gym overlooking the Indian Ocean. Weekly classes cover Hatha, Vinyasa and Power yoga, with sunrise sessions on the schedule; guests also report HIIT and strength classes. Access includes a steam room, an oxygen room and warm and cold plunge pools, and AWAY Spa runs private meditation sessions.' where slug = 'w-bali-wellness-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'W Bali''s yoga and class programme runs out of FIT, the resort''s 24-hour gym overlooking the Indian Ocean. Weekly classes cover Hatha, Vinyasa and Power yoga, with sunrise sessions on the schedule. There''s an oxygen room too, and AWAY Spa runs private meditation sessions.';
-- expect: UPDATE 1

-- 189. W-w-bali-wellness-yoga-best_for · w-bali-wellness-yoga · best_for · restore before
update venues set best_for = 'Seminyak guests who want ocean-view classes at sunrise plus plunge pools and a steam room afterwards.' where slug = 'w-bali-wellness-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Ocean-view classes at sunrise, then the plunge pools and steam room';
-- expect: UPDATE 1

-- 190. W-waroeng-bernadette-why_its_here · waroeng-bernadette · why_its_here · restore before
update venues set why_its_here = 'A homestyle Indonesian warung on Jl. Kayu Aya in Seminyak, known for a 12-hour slow-cooked beef rendang alongside oxtail soup, rawon and corn fritters — everything cooked traditionally from scratch, with adjustable spice levels and plenty of vegetarian and vegan options.' where slug = 'waroeng-bernadette' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This homestyle Indonesian warung on Jl. Kayu Aya cooks everything traditionally from scratch, and the spice level is adjustable. Its 12-hour slow-cooked beef rendang leads a menu of oxtail soup, rawon, corn fritters and plenty of vegetarian and vegan options.';
-- expect: UPDATE 1

-- 191. W-waroeng-bernadette-best_for · waroeng-bernadette · best_for · restore before
update venues set best_for = 'A relaxed sit-down lunch or dinner for travellers wanting approachable, spice-adjustable Indonesian classics in central Seminyak.' where slug = 'waroeng-bernadette' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sit-down lunch or dinner of approachable Indonesian classics, spice adjusted to taste, in central Seminyak';
-- expect: UPDATE 1

-- 192. W-waroeng-sulawesi-petitenget-why_its_here · waroeng-sulawesi-petitenget · why_its_here · restore before
update venues set why_its_here = 'A self-service warung on Petitenget serving home-cooked Sulawesi and Indonesian dishes — walk the counter and build a plate with white, yellow or red rice. Known for spicy regional plates.' where slug = 'waroeng-sulawesi-petitenget' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A self-service warung on Petitenget with home-cooked Sulawesi and Indonesian dishes. You walk the counter and build a plate on white, yellow or red rice, and the regional plates run spicy.';
-- expect: UPDATE 1

-- 193. W-waroeng-sulawesi-petitenget-best_for · waroeng-sulawesi-petitenget · best_for · restore before
update venues set best_for = 'adventurous eaters wanting spicy regional (Sulawesi) cooking; a budget lunch; solo diners and self-serve fans' where slug = 'waroeng-sulawesi-petitenget' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Spicy Sulawesi cooking for a budget lunch, solo or self-serve';
-- expect: UPDATE 1

-- 194. W-waroeng-sulawesi-petitenget-not_for · waroeng-sulawesi-petitenget · not_for · restore before
update venues set not_for = 'diners who dislike heat and spice; anyone wanting full table service or a polished room' where slug = 'waroeng-sulawesi-petitenget' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone who dislikes heat and spice, or wants table service and a polished room. It''s a self-service warung';
-- expect: UPDATE 1

-- 195. W-warung-enys-why_its_here · warung-enys · why_its_here · restore before
update venues set why_its_here = 'A small family-run warung on Petitenget known for a soulful nasi campur, run by Ibu Eny and her husband with an open kitchen and mostly local produce, cooked fresh daily.' where slug = 'warung-enys' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ibu Eny and her husband run this small family warung on Petitenget, with an open kitchen and mostly local produce, cooked fresh daily. Nasi campur is the plate to order.';
-- expect: UPDATE 1

-- 196. W-warung-enys-best_for · warung-enys · best_for · restore before
update venues set best_for = 'travellers wanting a personal, home-cooked nasi campur; couples or small groups; those curious about the open kitchen' where slug = 'warung-enys' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples or a small group over home-cooked nasi campur, with the open kitchen in view';
-- expect: UPDATE 1

-- 197. W-warung-enys-not_for · warung-enys · not_for · restore before
update venues set not_for = 'large groups (very small space); diners wanting a fast in-and-out or a fixed printed menu' where slug = 'warung-enys' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Large groups, since the space is small, or diners after a fast in-and-out or a fixed printed menu';
-- expect: UPDATE 1

-- 198. W-warung-kampung-legian-why_its_here · warung-kampung-legian · why_its_here · restore before
update venues set why_its_here = 'A Balinese-run local warung in Legian known for its nasi goreng and mie goreng at everyday prices.' where slug = 'warung-kampung-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Nasi goreng and mie goreng at everyday prices, from a Balinese-run local warung in Legian.';
-- expect: UPDATE 1

-- 199. W-warung-melati-nakula-why_its_here · warung-melati-nakula · why_its_here · restore before
update venues set why_its_here = 'A family-run Javanese warung in a quiet alley on the Seminyak–Legian border, cooking from early morning so nasi campur and sides are ready by late morning. Advertised as non-MSG and halal.' where slug = 'warung-melati-nakula' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In a quiet alley on the Seminyak–Legian border, this family-run warung cooks Javanese food. The kitchen starts early in the morning, so nasi campur and sides are ready by late morning. It is advertised as non-MSG and halal.';
-- expect: UPDATE 1

-- 200. W-warung-melati-nakula-best_for · warung-melati-nakula · best_for · restore before
update venues set best_for = 'halal diners; a midday lunch (best around 12–1pm); travellers wanting simple home-style Javanese food' where slug = 'warung-melati-nakula' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Halal diners, or anyone after simple home-style Javanese food, ideally at lunch around 12–1pm';
-- expect: UPDATE 1

-- 201. W-warung-melati-nakula-not_for · warung-melati-nakula · not_for · restore before
update venues set not_for = 'late-night diners (kitchen winds down by early evening); anyone specifically after Balinese pork dishes (halal, no pork)' where slug = 'warung-melati-nakula' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Late-night diners or anyone after Balinese pork dishes, because the kitchen winds down by early evening and it is halal, with no pork';
-- expect: UPDATE 1

-- 202. W-warung-murah-petitenget-best_for · warung-murah-petitenget · best_for · restore before
update venues set best_for = 'budget diners; a quick local lunch after the beach; travellers who like choosing dishes by sight' where slug = 'warung-murah-petitenget' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Choosing dishes by sight for a quick budget lunch after the beach';
-- expect: UPDATE 1

-- 203. W-warung-murah-petitenget-not_for · warung-murah-petitenget · not_for · restore before
update venues set not_for = 'late arrivals (best dishes go early); diners wanting table service or a set menu' where slug = 'warung-murah-petitenget' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Late arrivals, since dishes go early, or anyone wanting table service or a set menu';
-- expect: UPDATE 1

-- 204. W-warung-nia-balinese-food-and-pork-ribs-why_its_here · warung-nia-balinese-food-and-pork-ribs · why_its_here · restore before
update venues set why_its_here = 'A casual Balinese warung in Kayu Aya Square on Jl. Kayu Aya (the Oberoi strip), best known for slow-cooked, spice-marinated pork ribs sold by weight with a range of chilli levels, plus babi guling, satay and rijsttafel.' where slug = 'warung-nia-balinese-food-and-pork-ribs' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A casual Balinese warung in Kayu Aya Square on Jl. Kayu Aya, the Oberoi strip. The pork ribs are slow-cooked and spice-marinated, sold by weight with a choice of chilli levels. Babi guling, satay and rijsttafel are on the menu too.';
-- expect: UPDATE 1

-- 205. W-warung-nia-balinese-food-and-pork-ribs-best_for · warung-nia-balinese-food-and-pork-ribs · best_for · restore before
update venues set best_for = 'A relaxed, well-priced local lunch or dinner for travellers wanting authentic Balinese pork ribs without the fine-dining setting.' where slug = 'warung-nia-balinese-food-and-pork-ribs' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Balinese pork ribs at a well-priced local lunch or dinner, without the fine-dining setting';
-- expect: UPDATE 1

-- 206. W-warung-taman-bambu-why_its_here · warung-taman-bambu · why_its_here · restore before
update venues set why_its_here = 'A tucked-away pick-and-mix warung off the main road where you choose dishes from a cabinet, with nasi campur and Indonesian home-cooking the core, in a calmer garden-style setting.' where slug = 'warung-taman-bambu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Off the main road, this pick-and-mix warung has a calmer, garden-style setting. You choose dishes from a cabinet, and nasi campur and Indonesian home cooking are the core.';
-- expect: UPDATE 1

-- 207. W-warung-taman-bambu-best_for · warung-taman-bambu · best_for · restore before
update venues set best_for = 'a budget lunch away from the crowds; vegetarians (multiple veg options); couples or small groups wanting a quiet local meal' where slug = 'warung-taman-bambu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A quiet budget lunch away from the crowds for a couple or a small group, vegetarians included';
-- expect: UPDATE 1

-- 208. W-warung-taman-bambu-not_for · warung-taman-bambu · not_for · restore before
update venues set not_for = 'diners wanting evening or late service (closes early evening); anyone expecting à-la-carte ordering' where slug = 'warung-taman-bambu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Evening or late service, or à-la-carte ordering. It closes early evening, and you pick from a cabinet';
-- expect: UPDATE 1

-- 209. W-warung-wardani-why_its_here · warung-wardani · why_its_here · restore before
update venues set why_its_here = 'A decades-old Denpasar warung known for nasi campur Bali, plated with items such as satay, dendeng and vegetables over rice. It is a longtime local institution also recognised for serving halal Balinese food, open daytime only.' where slug = 'warung-wardani' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Decades old and open in the daytime only, this Denpasar warung on Jl. Yudistira serves halal Balinese food. The nasi campur Bali comes with items such as satay, dendeng and vegetables over rice.';
-- expect: UPDATE 1

-- 210. W-warung-wardani-best_for · warung-wardani · best_for · restore before
update venues set best_for = 'authentic Balinese nasi campur; quick local lunch; halal Balinese food; solo or budget dining' where slug = 'warung-wardani' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Halal Balinese nasi campur for a quick lunch, solo or on a budget';
-- expect: UPDATE 1

-- 211. W-warung-wardani-not_for · warung-wardani · not_for · restore before
update venues set not_for = 'dinner or late-night meals; alcohol and a bar scene; an upscale or scenic setting' where slug = 'warung-wardani' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dinner, late-night meals, alcohol or an upscale, scenic setting — it is a daytime-only warung';
-- expect: UPDATE 1

-- 212. W-watercress-seminyak-why_its_here · watercress-seminyak · why_its_here · restore before
update venues set why_its_here = 'A spacious, work-friendly brunch on Seminyak''s northern Batu Belig edge — easy for a longer catch-up or a laptop morning.' where slug = 'watercress-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A spacious, work-friendly brunch spot on Seminyak''s northern edge, in Batu Belig. It suits a longer catch-up or a laptop morning.';
-- expect: UPDATE 1

-- 213. W-watercress-seminyak-best_for · watercress-seminyak · best_for · restore before
update venues set best_for = 'A longer, spacious brunch; a work-friendly morning; groups; a north-Seminyak stay' where slug = 'watercress-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A long brunch or a laptop morning, for a group or anyone staying in north Seminyak';
-- expect: UPDATE 1

-- 214. W-watercress-seminyak-not_for · watercress-seminyak · not_for · restore before
update venues set not_for = 'A five-minute walk from Eat Street — it sits on the northern edge of the cluster' where slug = 'watercress-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone who wants to be within a five-minute walk of Eat Street: it sits on the northern edge of the cluster';
-- expect: UPDATE 1

-- 215. W-yoga-108-bali-kuta-legian-why_its_here · yoga-108-bali-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'A drop-in yoga studio in the Kuta-Legian area -- useful when you want a single class without committing to a multi-day retreat.' where slug = 'yoga-108-bali-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A drop-in yoga studio in the Kuta-Legian area, for a single class without committing to a multi-day retreat.';
-- expect: UPDATE 1

-- 216. W-yoga-108-bali-seminyak-why_its_here · yoga-108-bali-seminyak · why_its_here · restore before
update venues set why_its_here = 'An authentic, unpretentious drop-in studio in central Seminyak (Jl. Drupadi 108) with daily classes across Hatha, Vinyasa, Ashtanga, Yin and meditation for all levels, plus a Yoga Alliance 200-hour teacher training, workshops and retreats.' where slug = 'yoga-108-bali-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An unpretentious drop-in studio at Jl. Drupadi 108 in central Seminyak, with daily classes for all levels. Hatha, Vinyasa, Ashtanga, Yin and meditation run alongside a Yoga Alliance 200-hour teacher training, workshops and retreats.';
-- expect: UPDATE 1

-- 217. W-yoga-108-bali-seminyak-best_for · yoga-108-bali-seminyak · best_for · restore before
update venues set best_for = 'Drop-in travellers of any level who want traditional, non-heated yoga in the heart of Seminyak with mats and props provided.' where slug = 'yoga-108-bali-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Traditional, non-heated yoga at any level in the heart of Seminyak, mats and props provided';
-- expect: UPDATE 1

-- 218. W-you-spa-umalas-why_its_here · you-spa-umalas · why_its_here · restore before
update venues set why_its_here = 'A day spa in Umalas offering Balinese and holistic body massages, body masks, facials, plus hair and nail treatments, using its own line of natural products. Signature options include a Sport Massage and a "Black Room" experience.' where slug = 'you-spa-umalas' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Umalas day spa that works with its own line of natural products. Treatments include Balinese and holistic body massages, body masks, facials, and hair and nail care. The spa''s own options include a Sport Massage and a "Black Room" session.';
-- expect: UPDATE 1

-- 219. W-you-spa-umalas-best_for · you-spa-umalas · best_for · restore before
update venues set best_for = 'travellers wanting a full-service massage/facial session between Seminyak and Canggu; those after signature or longer ritual treatments; residents booking recurring spa time' where slug = 'you-spa-umalas' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A full massage or facial session between Seminyak and Canggu, or recurring spa time for residents';
-- expect: UPDATE 1

-- 220. W-you-spa-umalas-not_for · you-spa-umalas · not_for · restore before
update venues set not_for = 'anyone looking for active fitness/Pilates rather than treatment-based relaxation' where slug = 'you-spa-umalas' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Active fitness or Pilates — the menu is treatment-based relaxation';
-- expect: UPDATE 1
