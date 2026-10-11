-- wave-clean-a-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-12-kitchen-and-wine-why_its_here · 12-kitchen-and-wine · why_its_here · restore before
update venues set why_its_here = 'An all-day restaurant and wine bar on Jalan Pantai Berawa, open 8am to midnight every day. Its own site describes cooking done on the grill using local ingredients, alongside breakfast service and a large wine list. Booking is offered through the website or WhatsApp but is not required.' where slug = '12-kitchen-and-wine' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An all-day restaurant and wine bar on Jalan Pantai Berawa, open 8am to midnight daily. Its own site describes grill cooking with local ingredients, a breakfast service and a large wine list. You can book through the website or WhatsApp, but you don''t have to.';
-- expect: UPDATE 1

-- 2. W-12-kitchen-and-wine-best_for · 12-kitchen-and-wine · best_for · restore before
update venues set best_for = 'A date or unhurried dinner over wine; open 8am to midnight, seven days' where slug = '12-kitchen-and-wine' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A date or an unhurried dinner over wine';
-- expect: UPDATE 1

-- 3. W-2-aces-massage-and-spa-seminyak-why_its_here · 2-aces-massage-and-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Seminyak. The published list covers Traditional Massage.' where slug = '2-aces-massage-and-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from '2 Aces, a massage studio in Seminyak, does traditional massage.';
-- expect: UPDATE 1

-- 4. W-2-aces-massage-and-spa-seminyak-best_for · 2-aces-massage-and-spa-seminyak · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = '2-aces-massage-and-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A traditional massage';
-- expect: UPDATE 1

-- 5. W-afterglow-bar-and-kitchen-at-tribe-bali-kuta-beach-why_its_here · afterglow-bar-and-kitchen-at-tribe-bali-kuta-beach · why_its_here · restore before
update venues set why_its_here = 'Afterglow Bar and Kitchen is the rooftop restaurant at TRIBE Bali Kuta Beach. It overlooks Kuta''s shoreline, and the rooftop also includes an infinity pool. The venue opens daily from 07:00 to 23:00.' where slug = 'afterglow-bar-and-kitchen-at-tribe-bali-kuta-beach' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Afterglow Bar and Kitchen is the rooftop restaurant at TRIBE Bali Kuta Beach, open daily from 07:00 to 23:00. It looks out over Kuta''s shoreline, and there is an infinity pool on the same rooftop.';
-- expect: UPDATE 1

-- 6. W-afterglow-bar-and-kitchen-at-tribe-bali-kuta-beach-not_for · afterglow-bar-and-kitchen-at-tribe-bali-kuta-beach · not_for · restore before
update venues set not_for = 'Diners who prefer to avoid rooftop and beach-strip settings.' where slug = 'afterglow-bar-and-kitchen-at-tribe-bali-kuta-beach' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A meal away from rooftops and the beach strip, since this one sits above Kuta''s shoreline';
-- expect: UPDATE 1

-- 7. W-air-terjun-gitgit-why_its_here · air-terjun-gitgit · why_its_here · restore before
update venues set why_its_here = 'A multi-tier waterfall on the mountain road between south Bali and Singaraja, Buleleng, one of north Bali''s most visited falls.' where slug = 'air-terjun-gitgit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A multi-tier waterfall in Buleleng, on the mountain road between south Bali and Singaraja.';
-- expect: UPDATE 1

-- 8. W-air-terjun-gitgit-best_for · air-terjun-gitgit · best_for · restore before
update venues set best_for = 'a waterfall stop on the drive to/from north Bali' where slug = 'air-terjun-gitgit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A waterfall stop on the drive to or from north Bali';
-- expect: UPDATE 1

-- 9. W-aliya-salon-and-day-spa-canggu-why_its_here · aliya-salon-and-day-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published list covers Traditional Massage and Reflexology. The Aliya Full Body Massage is 195K IDR for 60 minutes. Booking runs through Fresha.' where slug = 'aliya-salon-and-day-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Aliya, a salon and day spa in Canggu, the full body massage is 195K IDR for 60 minutes. The list covers traditional massage and reflexology, and you book through Fresha.';
-- expect: UPDATE 1

-- 10. W-aliya-salon-and-day-spa-canggu-best_for · aliya-salon-and-day-spa-canggu · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'aliya-salon-and-day-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology for tired feet after a day of walking';
-- expect: UPDATE 1

-- 11. W-alma-tapas-bar-why_its_here · alma-tapas-bar · why_its_here · restore before
update venues set why_its_here = 'A Spanish tapas bar on Jalan Pantai Berawa serving from 3pm daily, with food until 10.30pm and drinks until 11.30pm. The February 2026 menu runs from jamon and charcuterie through plancha seafood to beef cheeks and tartares, alongside separate wine and bar lists. A second Alma operates at Pantai Bingin in Uluwatu.' where slug = 'alma-tapas-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Spanish tapas bar on Jalan Pantai Berawa, serving from 3pm daily, with food until 10.30pm and drinks until 11.30pm. The February 2026 menu goes from jamon and charcuterie to plancha seafood, beef cheeks and tartares, with separate wine and bar lists. A second Alma is at Pantai Bingin in Uluwatu.';
-- expect: UPDATE 1

-- 12. W-alma-tapas-bar-best_for · alma-tapas-bar · best_for · restore before
update venues set best_for = 'Shared plates and wine over a long evening; small groups grazing from 3pm' where slug = 'alma-tapas-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Shared plates and wine over a long evening, or a small group grazing from 3pm';
-- expect: UPDATE 1

-- 13. W-alma-tapas-bar-not_for · alma-tapas-bar · not_for · restore before
update venues set not_for = 'Opens at 3pm - no breakfast or lunch at the Berawa site' where slug = 'alma-tapas-bar' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Breakfast or lunch: the Berawa site opens at 3pm';
-- expect: UPDATE 1

-- 14. W-amandari-ubud-why_its_here · amandari-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published list covers Balinese Massage. Booking is on the venue''s own site.' where slug = 'amandari-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The spa at Amandari in Ubud lists Balinese massage, booked through Amandari''s website.';
-- expect: UPDATE 1

-- 15. W-amandari-ubud-best_for · amandari-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'amandari-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Two hours set aside for the spa at Amandari';
-- expect: UPDATE 1

-- 16. W-amplitude-skate-and-bike-park-why_its_here · amplitude-skate-and-bike-park · why_its_here · restore before
update venues set why_its_here = 'A 3000 square metre concrete skatepark in Kerobokan, split between a street course and a bowl park with three bowls, the largest an Olympic-size 10ft. Its own site welcomes skateboards, kickboards, cruisers and inline skates. The on-site school runs 1.5-hour group and private lessons from age four, with boards included in the price.' where slug = 'amplitude-skate-and-bike-park' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A 3000 square metre concrete skatepark in Kerobokan. It has a street course and a bowl park with three bowls, the largest an Olympic-size 10ft. Its own site welcomes skateboards, kickboards, cruisers and inline skates. The on-site school runs 1.5-hour group and private lessons from age four, boards included.';
-- expect: UPDATE 1

-- 17. W-amplitude-skate-and-bike-park-not_for · amplitude-skate-and-bike-park · not_for · restore before
update venues set not_for = 'Lessons by prior booking and non-refundable; minimum age 4' where slug = 'amplitude-skate-and-bike-park' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A lesson for anyone under 4, or a booking you may cancel, since lessons start at age 4, are booked ahead and are non-refundable';
-- expect: UPDATE 1

-- 18. W-anandinii-sidemen-why_its_here · anandinii-sidemen · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Sidemen. The published list covers Balinese Massage. Balinese Massage 60 minutes is 300K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'anandinii-sidemen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A 60-minute Balinese massage costs 300K IDR at Anandinii, a massage studio in Sidemen. Book on the studio''s own site.';
-- expect: UPDATE 1

-- 19. W-anandinii-sidemen-best_for · anandinii-sidemen · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes.' where slug = 'anandinii-sidemen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Balinese massage for an hour, or a longer treatment of up to 150 minutes';
-- expect: UPDATE 1

-- 20. W-anantara-ubud-bali-resort-ubud-why_its_here · anantara-ubud-bali-resort-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published list covers Thai Massage. Thai Warrior Stretching Massage is 2850K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'anantara-ubud-bali-resort-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Thai massage at Anantara Ubud Bali Resort''s day spa includes the Thai Warrior Stretching Massage, 2850K IDR for 60 minutes. Bookings go through the resort''s website.';
-- expect: UPDATE 1

-- 21. W-anantara-ubud-bali-resort-ubud-best_for · anantara-ubud-bali-resort-ubud · best_for · restore before
update venues set best_for = 'Thai massage booked the same day.' where slug = 'anantara-ubud-bali-resort-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An hour of Thai Warrior stretching at Anantara';
-- expect: UPDATE 1

-- 22. W-anantara-ubud-bali-resort-ubud-not_for · anantara-ubud-bali-resort-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 2850K IDR.' where slug = 'anantara-ubud-bali-resort-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A massage on a budget: the list starts at 2850K IDR';
-- expect: UPDATE 1

-- 23. W-ankhusa-restaurant-ubud-by-wonderspace-why_its_here · ankhusa-restaurant-ubud-by-wonderspace · why_its_here · restore before
update venues set why_its_here = 'Restaurant at Aksari Resort in Kenderan, north of Ubud. Balinese, Indonesian and international dishes: roast duck, chicken satay, nasi goreng, oxtail. Royal Dining follows the Balinese megibung tradition and is served as a shared feast. Outdoor tables face the jungle.' where slug = 'ankhusa-restaurant-ubud-by-wonderspace' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ankhusa is the restaurant at Aksari Resort in Kenderan, north of Ubud. The menu is Balinese, Indonesian and international: roast duck, chicken satay, nasi goreng, oxtail. Royal Dining is a shared Balinese megibung feast. Outdoor tables face the jungle.';
-- expect: UPDATE 1

-- 24. W-aperitif-restaurant-why_its_here · aperitif-restaurant · why_its_here · restore before
update venues set why_its_here = 'Apéritif Restaurant is a degustation restaurant in Petulu combining French, Japanese and Indonesian influences.' where slug = 'aperitif-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Apéritif is a degustation restaurant in Petulu, near Ubud, where the cooking mixes French, Japanese and Indonesian influences.';
-- expect: UPDATE 1

-- 25. W-aperitif-restaurant-best_for · aperitif-restaurant · best_for · restore before
update venues set best_for = 'Travellers planning a formal tasting-menu meal near Ubud.' where slug = 'aperitif-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A formal tasting-menu meal near Ubud';
-- expect: UPDATE 1

-- 26. W-avli-bali-why_its_here · avli-bali · why_its_here · restore before
update venues set why_its_here = 'AVLI is a modern Greek restaurant in Pecatu with an open-air courtyard. AVLI serves sharing plates with pita, dips, grilled meats and seasonal seafood. Greek chef Angelos Lantos leads the kitchen.' where slug = 'avli-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'AVLI is a modern Greek restaurant in Pecatu with an open-air courtyard. Greek chef Angelos Lantos runs the kitchen, which sends out sharing plates of pita, dips, grilled meats and seasonal seafood.';
-- expect: UPDATE 1

-- 27. W-avli-bali-best_for · avli-bali · best_for · restore before
update venues set best_for = 'Dinner with shared plates; courtyard celebrations and private dining.' where slug = 'avli-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Dinner over shared plates, a courtyard celebration or private dining';
-- expect: UPDATE 1

-- 28. W-avli-bali-not_for · avli-bali · not_for · restore before
update venues set not_for = 'Lunch plans - AVLI publishes a 5 pm opening time.' where slug = 'avli-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Lunch, because AVLI''s published opening time is 5pm';
-- expect: UPDATE 1

-- 29. W-ayam-betutu-khas-gilimanuk-why_its_here · ayam-betutu-khas-gilimanuk · why_its_here · restore before
update venues set why_its_here = 'A long-running Denpasar specialist in ayam betutu, the Gilimanuk-style chicken slow-cooked in Balinese spice paste until it falls off the bone. It is a focused, no-frills local kitchen where the betutu and the sambals are the whole point.' where slug = 'ayam-betutu-khas-gilimanuk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Denpasar kitchen that specialises in ayam betutu: Gilimanuk-style chicken slow-cooked in Balinese spice paste until it falls off the bone. It is a focused, no-frills local place where the betutu and the sambals are the reason to come.';
-- expect: UPDATE 1

-- 30. W-ayam-betutu-khas-gilimanuk-best_for · ayam-betutu-khas-gilimanuk · best_for · restore before
update venues set best_for = 'trying a genuine balinese classic; a spice-forward local lunch; eating where residents eat away from the tourist strip' where slug = 'ayam-betutu-khas-gilimanuk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spice-forward Balinese lunch where residents eat, away from the tourist strip';
-- expect: UPDATE 1

-- 31. W-ayam-betutu-khas-gilimanuk-not_for · ayam-betutu-khas-gilimanuk · not_for · restore before
update venues set not_for = 'people avoiding chilli or wanting mild flavours; anyone after a western menu, cocktails or a scenic view' where slug = 'ayam-betutu-khas-gilimanuk' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Mild food, a Western menu, cocktails or a view: it is a spice-forward local kitchen';
-- expect: UPDATE 1

-- 32. W-babi-guling-sari-kembar-99-best_for · babi-guling-sari-kembar-99 · best_for · restore before
update venues set best_for = 'Babi guling in Canggu; one of several outlets trading as Sari Kembar 99' where slug = 'babi-guling-sari-kembar-99' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A plate of babi guling, Balinese spit-roast pork, in Canggu';
-- expect: UPDATE 1

-- 33. W-babi-guling-swari-why_its_here · babi-guling-swari · why_its_here · restore before
update venues set why_its_here = 'Warung Babi Guling Swari serves Balinese roast pork with crispy skin and bumbu genep. Its official link hub lists a Canggu branch and ordering through GrabFood, GoFood and ShopeeFood.' where slug = 'babi-guling-swari' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Warung Babi Guling Swari serves Balinese roast pork with crispy skin and bumbu genep. Its official links list a Canggu branch and ordering through GrabFood, GoFood and ShopeeFood.';
-- expect: UPDATE 1

-- 34. W-babi-guling-swari-best_for · babi-guling-swari · best_for · restore before
update venues set best_for = 'Pork eaters planning a straightforward babi guling stop in Canggu.' where slug = 'babi-guling-swari' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A straightforward babi guling stop in Canggu';
-- expect: UPDATE 1

-- 35. W-babi-guling-swari-not_for · babi-guling-swari · not_for · restore before
update venues set not_for = 'Vegetarian, halal or otherwise pork-free dining plans.' where slug = 'babi-guling-swari' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Vegetarian or halal diners, or anyone avoiding pork, since babi guling is roast pork';
-- expect: UPDATE 1

-- 36. W-bahari-balinese-spa-spa-nusa-dua-why_its_here · bahari-balinese-spa-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published list covers Head Massage. Head To Toes is 350K IDR for 90 minutes. Booking is on the venue''s own site.' where slug = 'bahari-balinese-spa-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bahari Balinese Spa is a Nusa Dua day spa that does head massage. Its Head To Toes treatment runs 90 minutes for 350K IDR, and you can book on its website.';
-- expect: UPDATE 1

-- 37. W-bahari-balinese-spa-spa-nusa-dua-best_for · bahari-balinese-spa-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Head massage booked the same day.' where slug = 'bahari-balinese-spa-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A head massage, or head to toes over 90 minutes';
-- expect: UPDATE 1

-- 38. W-bali-beach-hotel-fitness-centre-why_its_here · bali-beach-hotel-fitness-centre · why_its_here · restore before
update venues set why_its_here = 'A new 24-hour fitness centre at Bali Beach Hotel in north Sanur, free but restricted to hotel guests. The room is large and well equipped. It sits on a property built around a 57 by 37 metre beachfront pool facing the Indian Ocean.' where slug = 'bali-beach-hotel-fitness-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A new 24-hour fitness centre at Bali Beach Hotel in north Sanur, free for hotel guests. The room is large and well equipped, and the property is built around a 57 by 37 metre beachfront pool facing the Indian Ocean.';
-- expect: UPDATE 1

-- 39. W-bali-beach-hotel-fitness-centre-best_for · bali-beach-hotel-fitness-centre · best_for · restore before
update venues set best_for = 'Guests of the hotel who want a modern round-the-clock gym; day visitors are not admitted.' where slug = 'bali-beach-hotel-fitness-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A round-the-clock workout in a modern gym while staying at Bali Beach Hotel';
-- expect: UPDATE 1

-- 40. W-bali-beach-hotel-fitness-centre-not_for · bali-beach-hotel-fitness-centre · not_for · restore NULL
update venues set not_for = null where slug = 'bali-beach-hotel-fitness-centre' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Day visitors, since it is restricted to hotel guests';
-- expect: UPDATE 1

-- 41. W-bali-beach-hotel-yoga-wellness-why_its_here · bali-beach-hotel-yoga-wellness · why_its_here · restore before
update venues set why_its_here = 'Sunrise yoga at 06:00 at Bali Beach Hotel in north Sanur, alongside the Taru Pramana Spa & Wellness, open 09:00-21:00. The hotel''s main pool measures 57 by 37 metres and faces Sanur Beach.' where slug = 'bali-beach-hotel-yoga-wellness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Beach Hotel in north Sanur runs sunrise yoga at 06:00, and its Taru Pramana Spa & Wellness is open 09:00-21:00. The main pool measures 57 by 37 metres and faces Sanur Beach.';
-- expect: UPDATE 1

-- 42. W-bali-padel-academy-why_its_here · bali-padel-academy · why_its_here · restore before
update venues set why_its_here = 'A padel centre on Jalan Babakan Kubu in Canggu, open 7am to 11pm daily except Nyepi, with court time booked through the Playtomic app. It runs one-hour coached lessons alongside open court hire, and has a recovery area with a sauna and ice bath. Its own site describes it as the international headquarters of the NOX Future Academy.' where slug = 'bali-padel-academy' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A padel centre on Jalan Babakan Kubu in Canggu, open 7am to 11pm daily except Nyepi. Courts book through the Playtomic app, and there are one-hour coached lessons and a recovery area with a sauna and ice bath. Its own site calls it the international headquarters of the NOX Future Academy.';
-- expect: UPDATE 1

-- 43. W-bali-padel-academy-best_for · bali-padel-academy · best_for · restore before
update venues set best_for = 'Booked padel courts, hour-long coached lessons, sauna and ice-bath recovery.' where slug = 'bali-padel-academy' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A coached padel hour, or a game followed by the sauna and ice bath';
-- expect: UPDATE 1

-- 44. W-bali-padel-academy-not_for · bali-padel-academy · not_for · restore before
update venues set not_for = 'Courts book through the Playtomic app; 50% fee to cancel inside 24h.' where slug = 'bali-padel-academy' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Plans that might change: cancelling inside 24h carries a 50% fee';
-- expect: UPDATE 1

-- 45. W-bali-reflexology-tabanan-why_its_here · bali-reflexology-tabanan · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Tabanan. The published list covers Balinese Massage. Booking is on the venue''s own site.' where slug = 'bali-reflexology-tabanan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In Tabanan, Bali Reflexology is a wellness spa with Balinese massage on offer.';
-- expect: UPDATE 1

-- 46. W-bali-reflexology-tabanan-best_for · bali-reflexology-tabanan · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'bali-reflexology-tabanan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage';
-- expect: UPDATE 1

-- 47. W-bali-tropic-resort-nusa-dua-why_its_here · bali-tropic-resort-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Nusa Dua. The published list covers Traditional Massage. Warm Herbal Pouch Massage is 618K IDR for 60 minutes.' where slug = 'bali-tropic-resort-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Tropic Resort''s wellness spa in Nusa Dua does traditional massage, and a 60-minute Warm Herbal Pouch Massage costs 618K IDR.';
-- expect: UPDATE 1

-- 48. W-bali-tropic-resort-nusa-dua-best_for · bali-tropic-resort-nusa-dua · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'bali-tropic-resort-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A warm herbal pouch massage at the resort''s wellness spa';
-- expect: UPDATE 1

-- 49. W-bali-tropic-resort-nusa-dua-not_for · bali-tropic-resort-nusa-dua · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 618K IDR.' where slug = 'bali-tropic-resort-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget massage, since the list starts at 618K IDR';
-- expect: UPDATE 1

-- 50. W-bali-yoga-school-ubud-why_its_here · bali-yoga-school-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published list covers Ayurvedic Treatment. Booking is on the venue''s own site.' where slug = 'bali-yoga-school-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Yoga School in Ubud offers Ayurvedic treatment.';
-- expect: UPDATE 1

-- 51. W-bali-yoga-school-ubud-best_for · bali-yoga-school-ubud · best_for · restore before
update venues set best_for = 'Ayurvedic treatment booked the same day.' where slug = 'bali-yoga-school-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Ayurvedic treatment';
-- expect: UPDATE 1

-- 52. W-balumba-surf-school-uluwatu-why_its_here · balumba-surf-school-uluwatu · why_its_here · restore before
update venues set why_its_here = 'A surf school running lessons around Uluwatu''s breaks -- Dreamland, Padang Padang and Balangan.' where slug = 'balumba-surf-school-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A surf school that teaches at Uluwatu''s breaks: Dreamland, Padang Padang and Balangan.';
-- expect: UPDATE 1

-- 53. W-balumba-surf-school-uluwatu-best_for · balumba-surf-school-uluwatu · best_for · restore before
update venues set best_for = 'surf lessons across the Bukit''s beaches' where slug = 'balumba-surf-school-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Surf lessons across the Bukit''s beaches';
-- expect: UPDATE 1

-- 54. W-bambou-cafe-and-lagree-cemagi-why_its_here · bambou-cafe-and-lagree-cemagi · why_its_here · restore before
update venues set why_its_here = 'A cafe on Jl. Pantai Mengening in Cemagi serving coffee, brunch and dinner, with a Lagree reformer studio on the same site. Its own Instagram bills the venue as Coffee & Lagree, while the studio itself trades as Kysko Studio Bali and takes class bookings through ClassPass. The cafe lists a phone number for bookings and also takes walk-ins.' where slug = 'bambou-cafe-and-lagree-cemagi' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A cafe on Jl. Pantai Mengening in Cemagi for coffee, brunch and dinner, with a Lagree reformer studio on site. On Instagram the venue is Coffee & Lagree; the studio trades as Kysko Studio Bali and takes class bookings through ClassPass. The cafe takes walk-ins and phone bookings.';
-- expect: UPDATE 1

-- 55. W-bambou-cafe-and-lagree-cemagi-best_for · bambou-cafe-and-lagree-cemagi · best_for · restore before
update venues set best_for = 'Coffee and a sit-down brunch or dinner in Cemagi, with a Lagree studio on site.' where slug = 'bambou-cafe-and-lagree-cemagi' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Coffee after a Lagree class, or a sit-down brunch or dinner in Cemagi';
-- expect: UPDATE 1

-- 56. W-bebek-tepi-sawah-why_its_here · bebek-tepi-sawah · why_its_here · restore before
update venues set why_its_here = 'A rice-field restaurant built around crispy duck and traditional Balinese setting.' where slug = 'bebek-tepi-sawah' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A rice-field restaurant in Teges, Peliatan, built around crispy duck. The setting is traditional Balinese.';
-- expect: UPDATE 1

-- 57. W-bebek-tepi-sawah-best_for · bebek-tepi-sawah · best_for · restore before
update venues set best_for = 'Family-friendly Balinese dining with a scenic setting.' where slug = 'bebek-tepi-sawah' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A family-friendly Balinese meal out among the rice fields';
-- expect: UPDATE 1

-- 58. W-bebek-tepi-sawah-not_for · bebek-tepi-sawah · not_for · restore before
update venues set not_for = 'People wanting a quick central-Ubud walk-in meal.' where slug = 'bebek-tepi-sawah' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick walk-in meal in central Ubud: it sits out in the rice fields at Peliatan';
-- expect: UPDATE 1

-- 59. W-bella-by-sage-why_its_here · bella-by-sage · why_its_here · restore before
update venues set why_its_here = 'A vegan plant-based kitchen in Penestanan with pizzas, pastas, salads and gluten-free accommodation.' where slug = 'bella-by-sage' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A vegan kitchen in Penestanan doing pizzas, pastas and salads, with gluten-free diets catered for.';
-- expect: UPDATE 1

-- 60. W-bella-by-sage-best_for · bella-by-sage · best_for · restore before
update venues set best_for = 'Vegan, gluten-free and casual Italian-style dining.' where slug = 'bella-by-sage' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A casual Italian-style vegan meal, gluten-free if you need it';
-- expect: UPDATE 1

-- 61. W-bella-by-sage-not_for · bella-by-sage · not_for · restore before
update venues set not_for = 'People wanting a traditional local warung or fine dining tasting menu.' where slug = 'bella-by-sage' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A traditional local warung or a fine-dining tasting menu, because this is a casual vegan pizza-and-pasta kitchen';
-- expect: UPDATE 1

-- 62. W-bella-canggu-why_its_here · bella-canggu · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Canggu. The kitchen is described as contemporary Mediterranean & Middle Eastern. The published menu includes ‘It was all a dream’, ‘Geisha’ and ‘Kopi Martini’. Booking is on the venue''s own site.' where slug = 'bella-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bella''s kitchen in Canggu is contemporary Mediterranean and Middle Eastern. ''Geisha'' and ''Kopi Martini'' are both on the menu, and you can book online.';
-- expect: UPDATE 1

-- 63. W-bella-canggu-best_for · bella-canggu · best_for · restore before
update venues set best_for = 'Contemporary Mediterranean & Middle Eastern in Canggu.' where slug = 'bella-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Mediterranean or Middle Eastern meal in Canggu';
-- expect: UPDATE 1

-- 64. W-bella-italia-sanur-why_its_here · bella-italia-sanur · why_its_here · restore before
update venues set why_its_here = 'Italian restaurant on Jalan Cemara (Sanur Kauh) serving wood-fired pizza, homemade pasta and Italian desserts, with vegetarian options.' where slug = 'bella-italia-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Italian restaurant on Jalan Cemara in Sanur Kauh. Expect wood-fired pizza, homemade pasta and Italian desserts, with vegetarian options.';
-- expect: UPDATE 1

-- 65. W-bella-italia-sanur-best_for · bella-italia-sanur · best_for · restore before
update venues set best_for = 'families and groups wanting familiar Italian food; casual dinners and pizza nights' where slug = 'bella-italia-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A casual pizza night or a familiar Italian dinner with family or a group';
-- expect: UPDATE 1

-- 66. W-bella-italia-sanur-not_for · bella-italia-sanur · not_for · restore before
update venues set not_for = 'anyone specifically seeking Indonesian or Balinese cuisine' where slug = 'bella-italia-sanur' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone set on Indonesian or Balinese food, since the menu here is Italian';
-- expect: UPDATE 1

-- 67. W-boheme-canggu-why_its_here · boheme-canggu · why_its_here · restore before
update venues set why_its_here = 'The all-day restaurant and bar inside Shore Amora Canggu on Jl. Pantai Pererenan No.159, open 7am-10pm daily to hotel and day guests alike. The kitchen serves Western food built on local, seasonal produce, with vegan, gluten-free and lactose-free options. An infinity pool with daybeds and an air-conditioned coworking space open until 10pm sit alongside it.' where slug = 'boheme-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The all-day restaurant and bar at Shore Amora Canggu on Jl. Pantai Pererenan, open 7am-10pm daily to hotel and day guests. The Western menu uses local, seasonal produce, with vegan, gluten-free and lactose-free options. Next to it are an infinity pool with daybeds and an air-conditioned coworking space open until 10pm.';
-- expect: UPDATE 1

-- 68. W-boheme-canggu-best_for · boheme-canggu · best_for · restore before
update venues set best_for = 'A slow brunch, a laptop-and-coffee day by the pool, and easy all-day eating.' where slug = 'boheme-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A slow brunch, or a laptop-and-coffee day by the pool';
-- expect: UPDATE 1

-- 69. W-boheme-canggu-not_for · boheme-canggu · not_for · restore before
update venues set not_for = 'Closes 10pm; rice-field views rather than beachfront, and not a nightlife spot.' where slug = 'boheme-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A beachfront table or a night out: it closes at 10pm and looks over rice fields';
-- expect: UPDATE 1

-- 70. W-bokashi-berawa-why_its_here · bokashi-berawa · why_its_here · restore before
update venues set why_its_here = 'A cafe and teahouse upstairs above the Bokashi organic grocery store on Jl. Subak Sari in Berawa, seating about 30. The menu is Japanese-leaning brunch, bento, soba and donburi alongside single-origin Indonesian teas and matcha. The group''s Pererenan branch is closed until further notice.' where slug = 'bokashi-berawa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A cafe and teahouse above the Bokashi organic grocery store on Jl. Subak Sari in Berawa, with about 30 seats. The food is Japanese-leaning brunch, bento, soba and donburi, with single-origin Indonesian teas and matcha to drink. The group''s Pererenan branch is closed until further notice.';
-- expect: UPDATE 1

-- 71. W-bokashi-berawa-best_for · bokashi-berawa · best_for · restore before
update venues set best_for = 'A calm daytime meal, matcha and tea, and health-conscious Japanese plates.' where slug = 'bokashi-berawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm daytime meal of health-conscious Japanese plates, with matcha or tea';
-- expect: UPDATE 1

-- 72. W-bokashi-berawa-not_for · bokashi-berawa · not_for · restore before
update venues set not_for = 'Closes early evening; a small upstairs room of about 30 seats.' where slug = 'bokashi-berawa' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dinner, since it closes in the early evening, or a group that needs space: the upstairs room is small, about 30 seats';
-- expect: UPDATE 1

-- 73. W-brie-restaurant-and-cheesery-why_its_here · brie-restaurant-and-cheesery · why_its_here · restore before
update venues set why_its_here = 'The only restaurant in Bali with its own cheesery. Milk comes from the group''s farm in Java and becomes cheese within twelve hours, five times a week. Cheese board, truffle tagliatelle, brie burger and house burrata. The open kitchen is downstairs, the bar above.' where slug = 'brie-restaurant-and-cheesery' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A restaurant with its own cheesery. Milk comes from the group''s farm in Java and becomes cheese within twelve hours, five times a week. Cheese board, truffle tagliatelle, brie burger and house burrata. The open kitchen is downstairs, the bar above.';
-- expect: UPDATE 1

-- 74. W-caffe-torino-by-venticinque-group-at-grand-srikandi-mansion-why_its_here · caffe-torino-by-venticinque-group-at-grand-srikandi-mansion · why_its_here · restore before
update venues set why_its_here = 'An Italian cafe and restaurant from the Venticinque Group, set inside Grand Srikandi Mansion on Jl. Cepaka Utama in Dalung, inland from the Canggu coast. Its Chope listing describes rice-field views and an all-day menu running from breakfast panini through cured-meat boards to pasta.' where slug = 'caffe-torino-by-venticinque-group-at-grand-srikandi-mansion' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Italian cafe and restaurant from the Venticinque Group, inside Grand Srikandi Mansion on Jl. Cepaka Utama in Dalung, inland from the Canggu coast. Its Chope listing describes rice-field views and an all-day menu, from breakfast panini to cured-meat boards and pasta.';
-- expect: UPDATE 1

-- 75. W-casa-de-lokha-mexican-grill-and-fusion-the-lokha-ubud-why_its_here · casa-de-lokha-mexican-grill-and-fusion-the-lokha-ubud · why_its_here · restore before
update venues set why_its_here = 'Casa de Lokha is The Lokha Ubud''s Mexican grill and fusion restaurant in Keliki. Its current offer pairs Tacos Tuesday with a separate two-for-one cocktail programme at the resort.' where slug = 'casa-de-lokha-mexican-grill-and-fusion-the-lokha-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Casa de Lokha is the Mexican grill and fusion restaurant at The Lokha Ubud in Keliki. Its current offer is Tacos Tuesday, and the resort runs a separate two-for-one cocktail programme.';
-- expect: UPDATE 1

-- 76. W-casa-de-lokha-mexican-grill-and-fusion-the-lokha-ubud-best_for · casa-de-lokha-mexican-grill-and-fusion-the-lokha-ubud · best_for · restore before
update venues set best_for = 'Small groups planning tacos and cocktails at a Ubud resort.' where slug = 'casa-de-lokha-mexican-grill-and-fusion-the-lokha-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Tacos and cocktails with a small group at a Ubud resort';
-- expect: UPDATE 1

-- 77. W-casa-de-lokha-mexican-grill-and-fusion-the-lokha-ubud-not_for · casa-de-lokha-mexican-grill-and-fusion-the-lokha-ubud · not_for · restore before
update venues set not_for = 'Diners seeking a strictly traditional Mexican-only menu.' where slug = 'casa-de-lokha-mexican-grill-and-fusion-the-lokha-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A strictly traditional Mexican menu, since the kitchen does Mexican grill and fusion';
-- expect: UPDATE 1

-- 78. W-celebrity-fitness-why_its_here · celebrity-fitness · why_its_here · restore before
update venues set why_its_here = 'The first international gym chain to open in Bali, at Lippo Plaza on Sunset Road. A full floor with a cycling studio, pilates, free weights and cardio, plus personal training and group classes. Membership tiers run from a single club to access across the chain abroad.' where slug = 'celebrity-fitness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An international gym chain at Lippo Plaza on Sunset Road. A full floor with a cycling studio, pilates, free weights and cardio, plus personal training and group classes. Membership tiers run from a single club to access across the chain abroad.';
-- expect: UPDATE 1

-- 79. W-celestine-spa-kuta-legian-why_its_here · celestine-spa-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Spa in Legian. Booking is by WhatsApp.' where slug = 'celestine-spa-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Celestine is a spa in Legian that takes bookings by WhatsApp.';
-- expect: UPDATE 1

-- 80. W-celestine-spa-kuta-legian-best_for · celestine-spa-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'celestine-spa-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Time for a long treatment in Legian: the list runs to 120 minutes';
-- expect: UPDATE 1

-- 81. W-celestine-spa-kuta-legian-not_for · celestine-spa-kuta-legian · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 1300K IDR.' where slug = 'celestine-spa-kuta-legian' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget massage: prices on the list start at 1300K IDR';
-- expect: UPDATE 1

-- 82. W-chamas-brazilian-churrascaria-at-kuta-not_for · chamas-brazilian-churrascaria-at-kuta · not_for · restore before
update venues set not_for = 'A quick, light meal or a vegetarian-led dinner.' where slug = 'chamas-brazilian-churrascaria-at-kuta' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick, light meal or a vegetarian-led dinner, since passadores serve open-flame meats tableside, rodízio-style';
-- expect: UPDATE 1

-- 83. W-chaskaa-jimbaran-best_for · chaskaa-jimbaran · best_for · restore before
update venues set best_for = 'Families and groups choosing modern Indian food near Jimbaran and GWK.' where slug = 'chaskaa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A family or group meal of modern Indian food near Jimbaran and GWK';
-- expect: UPDATE 1

-- 84. W-chaskaa-modern-indian-cuisine-and-bar-at-jimbaran-why_its_here · chaskaa-modern-indian-cuisine-and-bar-at-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Restaurant on Uluwatu St in Uluwatu Bukit, open daily 11:00am-11:30pm.' where slug = 'chaskaa-modern-indian-cuisine-and-bar-at-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Restaurant on Uluwatu St, open daily 11:00am-11:30pm.';
-- expect: UPDATE 1

-- 85. W-chaskaa-ubud-best_for · chaskaa-ubud · best_for · restore before
update venues set best_for = 'Families and groups choosing modern Indian food in central Ubud.' where slug = 'chaskaa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Curries and tandoor dishes for a family or group in central Ubud';
-- expect: UPDATE 1

-- 86. W-chill-reflexology-seminyak-why_its_here · chill-reflexology-seminyak · why_its_here · restore before
update venues set why_its_here = 'Reflexology studio in Seminyak. Booking is on the venue''s own site.' where slug = 'chill-reflexology-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Chill Reflexology is a reflexology studio in Seminyak.';
-- expect: UPDATE 1

-- 87. W-chill-reflexology-seminyak-best_for · chill-reflexology-seminyak · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'chill-reflexology-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Up to 120 minutes of reflexology in Seminyak';
-- expect: UPDATE 1

-- 88. W-cocomo-at-canggu-why_its_here · cocomo-at-canggu · why_its_here · restore before
update venues set why_its_here = 'An island bistro on Jl. Pantai Batu Bolong, a short way back from the shoreline, serving seafood and grill. Its Chope listing describes a recent repositioning into a seafood-led coastal bistro. Open daily 11:00-23:00, split into a lunch sitting until 5pm and dinner from 5pm.' where slug = 'cocomo-at-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An island bistro on Jl. Pantai Batu Bolong, a short way back from the shoreline, serving seafood and grilled dishes. Its Chope listing says it recently turned into a seafood-led coastal bistro. It is open 11:00-23:00 daily, with a lunch sitting until 5pm and dinner from 5pm.';
-- expect: UPDATE 1

-- 89. W-cocomo-at-canggu-best_for · cocomo-at-canggu · best_for · restore before
update venues set best_for = 'Seafood and grill plates a short way back from Batu Bolong beach; lunch or dinner' where slug = 'cocomo-at-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Seafood or grill plates for lunch or dinner, a short way back from Batu Bolong beach';
-- expect: UPDATE 1

-- 90. W-conrad-bali-yoga-best_for · conrad-bali-yoga · best_for · restore before
update venues set best_for = 'Resort guests who want a daily class and are willing to pay separately for it, including aerial yoga and sound sessions.' where slug = 'conrad-bali-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A daily class, aerial yoga or a sound session during a stay at Conrad';
-- expect: UPDATE 1

-- 91. W-conrad-bali-yoga-not_for · conrad-bali-yoga · not_for · restore NULL
update venues set not_for = null where slug = 'conrad-bali-yoga' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone expecting classes in the room rate, since they carry an extra charge';
-- expect: UPDATE 1

-- 92. W-crumb-and-coaster-kuta-why_its_here · crumb-and-coaster-kuta · why_its_here · restore before
update venues set why_its_here = 'A long-standing Kuta breakfast spot mixing Indonesian dishes with pasta and Thai curry, alongside a wide hot-and-cold coffee list.' where slug = 'crumb-and-coaster-kuta' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Kuta breakfast spot whose menu mixes Indonesian dishes with pasta and Thai curry. There is a wide coffee list, hot and cold.';
-- expect: UPDATE 1

-- 93. W-crumb-and-coaster-kuta-best_for · crumb-and-coaster-kuta · best_for · restore before
update venues set best_for = 'an all-day breakfast stop in Kuta' where slug = 'crumb-and-coaster-kuta' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An all-day breakfast in Kuta';
-- expect: UPDATE 1

-- 94. W-d-made-restaurant-the-kalyana-ubud-resort-why_its_here · d-made-restaurant-the-kalyana-ubud-resort · why_its_here · restore before
update venues set why_its_here = 'D''Made is The Kalyana Ubud Resort''s 26-seat restaurant in Mas. It serves Indonesian and Balinese food beside the resort pool and surrounding greenery. Daily service runs from 07:00 to 23:00.' where slug = 'd-made-restaurant-the-kalyana-ubud-resort' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'D''Made is The Kalyana Ubud Resort''s 26-seat restaurant in Mas, serving Indonesian and Balinese food beside the pool and the greenery around it. It is open daily from 07:00 to 23:00.';
-- expect: UPDATE 1

-- 95. W-d-made-restaurant-the-kalyana-ubud-resort-best_for · d-made-restaurant-the-kalyana-ubud-resort · best_for · restore before
update venues set best_for = 'A small-table Indonesian or Balinese meal beside the resort pool.' where slug = 'd-made-restaurant-the-kalyana-ubud-resort' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An Indonesian or Balinese meal at a small table by the resort pool';
-- expect: UPDATE 1

-- 96. W-d-made-restaurant-the-kalyana-ubud-resort-not_for · d-made-restaurant-the-kalyana-ubud-resort · not_for · restore before
update venues set not_for = 'Large groups that need a high-capacity dining room.' where slug = 'd-made-restaurant-the-kalyana-ubud-resort' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Large groups: the restaurant seats 26';
-- expect: UPDATE 1

-- 97. W-desa-wisata-besakih-why_its_here · desa-wisata-besakih · why_its_here · restore before
update venues set why_its_here = 'Bali''s largest and holiest temple complex, on the slopes of Mount Agung in Rendang, Karangasem. A single foreigner ticket bundles a local guide, sarong and shuttle up to the gate.' where slug = 'desa-wisata-besakih' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A temple complex on the slopes of Mount Agung in Rendang, Karangasem. A single foreigner ticket bundles a local guide, sarong and shuttle up to the gate.';
-- expect: UPDATE 1

-- 98. W-desa-wisata-besakih-best_for · desa-wisata-besakih · best_for · restore before
update venues set best_for = 'a guided visit to Bali''s holiest temple complex; travellers comfortable with a managed, ticketed route' where slug = 'desa-wisata-besakih' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A guided visit to the temple complex, if you are fine with a managed, ticketed route';
-- expect: UPDATE 1

-- 99. W-desa-wisata-bugbug-why_its_here · desa-wisata-bugbug · why_its_here · restore before
update venues set why_its_here = 'One of Karangasem''s largest and oldest traditional (desa adat) villages, on the coast near Candidasa, with ceremonial traditions held through the year. The nearby Bukit Asah hilltop looks out over Pulau Kuan, a small whale-shaped island just offshore.' where slug = 'desa-wisata-bugbug' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A traditional (desa adat) village on the coast near Candidasa, with ceremonial traditions held through the year. The nearby Bukit Asah hilltop looks out over Pulau Kuan, a small whale-shaped island just offshore.';
-- expect: UPDATE 1

-- 100. W-desa-wisata-bugbug-best_for · desa-wisata-bugbug · best_for · restore before
update venues set best_for = 'traditional Balinese village culture and ceremony; combining with Virgin Beach or Bukit Asah nearby' where slug = 'desa-wisata-bugbug' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Traditional village culture and ceremony, with Virgin Beach or Bukit Asah close by';
-- expect: UPDATE 1

-- 101. W-desa-wisata-gitgit-why_its_here · desa-wisata-gitgit · why_its_here · restore before
update venues set why_its_here = 'The village at the base of the well-known Gitgit waterfall, on the mountain road between south Bali and Singaraja, Buleleng.' where slug = 'desa-wisata-gitgit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The village at the foot of the Gitgit waterfall, on the mountain road between south Bali and Singaraja in Buleleng.';
-- expect: UPDATE 1

-- 102. W-desa-wisata-gitgit-best_for · desa-wisata-gitgit · best_for · restore before
update venues set best_for = 'a waterfall stop on the drive to/from north Bali' where slug = 'desa-wisata-gitgit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A village stop below the Gitgit falls on the mountain road to or from Singaraja';
-- expect: UPDATE 1

-- 103. W-desa-wisata-sanur-kauh-why_its_here · desa-wisata-sanur-kauh · why_its_here · restore before
update venues set why_its_here = 'A village in South Denpasar on Mertasari beach -- white sand and calm water facing north, so it catches both sunrise and sunset. Pura Dalam Pengembak Mertasari, on the beach, is used for melukat purification bathing.' where slug = 'desa-wisata-sanur-kauh' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A village in South Denpasar on Mertasari beach, with white sand and calm water. The beach faces north, so it catches both sunrise and sunset. On the sand, Pura Dalam Pengembak Mertasari is used for melukat purification bathing.';
-- expect: UPDATE 1

-- 104. W-desa-wisata-sanur-kauh-best_for · desa-wisata-sanur-kauh · best_for · restore before
update venues set best_for = 'a quieter beach than central Sanur; the Mertasari melukat temple; a flat rice-field jogging route' where slug = 'desa-wisata-sanur-kauh' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A quieter beach than central Sanur, the Mertasari temple used for melukat bathing, or a flat jogging route through rice fields';
-- expect: UPDATE 1

-- 105. W-dua-umalas-seminyak-why_its_here · dua-umalas-seminyak · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Seminyak. The kitchen is described as local and western. The published menu includes Pumpkin Ginger Soup, Green Juice and Wet Scrambled Eggs. Booking is by WhatsApp.' where slug = 'dua-umalas-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Wet scrambled eggs and pumpkin ginger soup share the menu at Dua Umalas, a Seminyak restaurant cooking local and Western food. Bookings are by WhatsApp.';
-- expect: UPDATE 1

-- 106. W-dua-umalas-seminyak-best_for · dua-umalas-seminyak · best_for · restore before
update venues set best_for = 'Local and western in Seminyak.' where slug = 'dua-umalas-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Wet scrambled eggs and a green juice in Seminyak';
-- expect: UPDATE 1

-- 107. W-empower-balance-tabanan-why_its_here · empower-balance-tabanan · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Tabanan. The published list covers Yoga.' where slug = 'empower-balance-tabanan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Yoga is on the menu at Empower Balance, a wellness spa in Tabanan.';
-- expect: UPDATE 1

-- 108. W-empower-balance-tabanan-best_for · empower-balance-tabanan · best_for · restore before
update venues set best_for = 'Yoga booked the same day.' where slug = 'empower-balance-tabanan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A yoga session';
-- expect: UPDATE 1

-- 109. W-eskq-bar-steak-house-why_its_here · eskq-bar-steak-house · why_its_here · restore before
update venues set why_its_here = 'A steakhouse and wine bar on Jl. Raya Babakan, describing itself as serving premium steaks against a list of 50+ wines. Wood-fired cuts run from Australian grain-fed skirt and picanha up to a pre-order Tomahawk, alongside Italian pasta and risotto. The kitchen runs 6pm to 2am, Tuesday to Sunday, with a live jazz night programmed on Fridays.' where slug = 'eskq-bar-steak-house' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A steakhouse and wine bar on Jl. Raya Babakan with a list of 50+ wines. Wood-fired cuts go from Australian grain-fed skirt and picanha to a pre-order Tomahawk, and there is Italian pasta and risotto. The kitchen runs 6pm to 2am, Tuesday to Sunday, with live jazz on Fridays.';
-- expect: UPDATE 1

-- 110. W-eskq-bar-steak-house-best_for · eskq-bar-steak-house · best_for · restore before
update venues set best_for = 'Late steak and wine dinners, kitchen open to 2am; Friday live jazz' where slug = 'eskq-bar-steak-house' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A late steak-and-wine dinner, or live jazz on a Friday';
-- expect: UPDATE 1

-- 111. W-eskq-bar-steak-house-not_for · eskq-bar-steak-house · not_for · restore before
update venues set not_for = 'Dinner only from 6pm; closed Mondays' where slug = 'eskq-bar-steak-house' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Lunch or a Monday night: it opens for dinner only, from 6pm, and is closed Mondays';
-- expect: UPDATE 1

-- 112. W-flourish-why_its_here · flourish · why_its_here · restore before
update venues set why_its_here = 'A central healthy restaurant with explicit gluten-free and vegan positioning.' where slug = 'flourish' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A healthy restaurant on Nyuh Kuning Rd in central Ubud that markets itself on gluten-free and vegan food.';
-- expect: UPDATE 1

-- 113. W-flourish-best_for · flourish · best_for · restore before
update venues set best_for = 'Early breakfast and gluten-free dining in Ubud.' where slug = 'flourish' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An early breakfast or a gluten-free meal in Ubud';
-- expect: UPDATE 1

-- 114. W-flourish-not_for · flourish · not_for · restore before
update venues set not_for = 'People seeking cocktails or a luxury tasting menu.' where slug = 'flourish' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Cocktails or a luxury tasting menu, since it is a healthy restaurant with a gluten-free and vegan focus';
-- expect: UPDATE 1

-- 115. W-fresh-spa-ubud-why_its_here · fresh-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published list covers Foot Massage.' where slug = 'fresh-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Fresh! Spa, a day spa in Ubud, does foot massage.';
-- expect: UPDATE 1

-- 116. W-fresh-spa-ubud-best_for · fresh-spa-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'fresh-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot massage after a day of walking around Ubud';
-- expect: UPDATE 1

-- 117. W-galangal-spa-nusa-dua-why_its_here · galangal-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Spa in Nusa Dua. The published list covers Traditional Massage. Booking is by WhatsApp.' where slug = 'galangal-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Galangal Spa takes WhatsApp bookings for traditional massage in Nusa Dua.';
-- expect: UPDATE 1

-- 118. W-galangal-spa-nusa-dua-best_for · galangal-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'galangal-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Traditional massage at Galangal Spa';
-- expect: UPDATE 1

-- 119. W-gather-canggu-why_its_here · gather-canggu · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Canggu. The kitchen is described as breakfast and brunch. The published menu includes The Classic Brekkie, The Avo Set and The Gather Plate. Booking is by WhatsApp.' where slug = 'gather-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Gather is a breakfast and brunch restaurant in Canggu, and you book a table by WhatsApp. The menu has The Classic Brekkie, The Avo Set and The Gather Plate.';
-- expect: UPDATE 1

-- 120. W-gather-canggu-best_for · gather-canggu · best_for · restore before
update venues set best_for = 'Breakfast and brunch in Canggu.' where slug = 'gather-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Breakfast or brunch in Canggu: the Classic Brekkie or the Avo Set';
-- expect: UPDATE 1

-- 121. W-glow-spa-mandira-kuta-legian-why_its_here · glow-spa-mandira-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published list covers Balinese Massage and Traditional Massage. Traditional Balinese Aromatherapy Massage is 100K IDR for 60 minutes.' where slug = 'glow-spa-mandira-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Glow Spa Mandira in Legian charges 100K IDR for a 60-minute Traditional Balinese Aromatherapy Massage. The day spa does both Balinese and traditional massage.';
-- expect: UPDATE 1

-- 122. W-glow-spa-mandira-kuta-legian-best_for · glow-spa-mandira-kuta-legian · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'glow-spa-mandira-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese aromatherapy massage for 100K IDR';
-- expect: UPDATE 1

-- 123. W-grillos-cafe-and-eatery-why_its_here · grillos-cafe-and-eatery · why_its_here · restore before
update venues set why_its_here = 'A cafe and coffee shop on Jl. Veteran at Buduk, inland from Canggu in Mengwi, open 07:00-23:00 daily. Its own Grab listing describes the kitchen as Western cooking with Eastern flavours alongside a coffee shop. No readable menu is published online, so no dishes or prices are recorded here.' where slug = 'grillos-cafe-and-eatery' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A cafe and coffee shop on Jl. Veteran at Buduk, inland from Canggu in Mengwi, open 07:00-23:00 daily. Its own Grab listing describes the kitchen as Western cooking with Eastern flavours.';
-- expect: UPDATE 1

-- 124. W-grillos-cafe-and-eatery-best_for · grillos-cafe-and-eatery · best_for · restore before
update venues set best_for = 'All-day cafe and coffee shop on Jl. Veteran at Buduk, open 7am to 11pm' where slug = 'grillos-cafe-and-eatery' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A coffee or a meal inland at Buduk, in a cafe open 7am to 11pm';
-- expect: UPDATE 1

-- 125. W-grillos-cafe-and-eatery-not_for · grillos-cafe-and-eatery · not_for · restore before
update venues set not_for = 'Out at Buduk in Mengwi, not walkable from the Canggu beach strip' where slug = 'grillos-cafe-and-eatery' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone on foot from the Canggu beach strip, because Buduk is out in Mengwi';
-- expect: UPDATE 1

-- 126. W-hakkoku-bali-sushi-omakase-restaurant-not_for · hakkoku-bali-sushi-omakase-restaurant · not_for · restore before
update venues set not_for = 'Diners looking for an à-la-carte menu or an open-ended arrival time.' where slug = 'hakkoku-bali-sushi-omakase-restaurant' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An à-la-carte meal or turning up when you like: it is a fixed 15-course omakase with set lunch and dinner times';
-- expect: UPDATE 1

-- 127. W-herb-library-why_its_here · herb-library · why_its_here · restore before
update venues set why_its_here = 'A contemporary all-day venue with plant-based dishes and responsibly sourced fish and chicken options.' where slug = 'herb-library' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Herb Library is an all-day spot on Jl. Jembawan in Ubud, with plant-based dishes and responsibly sourced fish and chicken.';
-- expect: UPDATE 1

-- 128. W-herb-library-best_for · herb-library · best_for · restore before
update venues set best_for = 'Mixed-diet groups wanting healthy all-day dining.' where slug = 'herb-library' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A group with mixed diets wanting a healthy meal at any time of day';
-- expect: UPDATE 1

-- 129. W-herb-library-not_for · herb-library · not_for · restore before
update venues set not_for = 'People looking specifically for a traditional Balinese warung.' where slug = 'herb-library' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A traditional Balinese warung meal, since this is a contemporary all-day spot';
-- expect: UPDATE 1

-- 130. W-hidden-gem-uluwatu-uluwatu-bukit-why_its_here · hidden-gem-uluwatu-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Restaurant in the Bukit. The kitchen is described as California-inspired cuisine. The published menu includes Warm Chocolate Lava Cake, Three colored crispy soft shell tacos and Tuna Tartare. Booking runs through Chope.' where slug = 'hidden-gem-uluwatu-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Hidden Gem Uluwatu cooks California-inspired food in the Bukit: tuna tartare, crispy soft shell tacos in three colours and a warm chocolate lava cake. Tables are booked through Chope.';
-- expect: UPDATE 1

-- 131. W-hidden-gem-uluwatu-uluwatu-bukit-best_for · hidden-gem-uluwatu-uluwatu-bukit · best_for · restore before
update venues set best_for = 'California-inspired cuisine in the Bukit.' where slug = 'hidden-gem-uluwatu-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Tuna tartare and soft shell tacos in the Bukit';
-- expect: UPDATE 1

-- 132. W-hippie-fish-pererenan-beach-best_for · hippie-fish-pererenan-beach · best_for · restore before
update venues set best_for = 'Beachfront sunset dinner and drinks; date night with a view; groups sharing seafood' where slug = 'hippie-fish-pererenan-beach' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A beachfront sunset dinner, a date night with a view, or seafood shared with a group';
-- expect: UPDATE 1

-- 133. W-hippie-fish-pererenan-beach-not_for · hippie-fish-pererenan-beach · not_for · restore before
update venues set not_for = 'Opens midday; the venue says booking is essential' where slug = 'hippie-fish-pererenan-beach' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Walk-ins or breakfast, since it opens at midday and says booking is essential';
-- expect: UPDATE 1

-- 134. W-home-cafe-mengwi-why_its_here · home-cafe-mengwi · why_its_here · restore before
update venues set why_its_here = 'Cafe in Tiying Tutul, Pererenan. The kitchen describes its own cooking as healthy brunch.' where slug = 'home-cafe-mengwi' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A brunch cafe in Tiying Tutul, Pererenan. It describes its own cooking as healthy.';
-- expect: UPDATE 1

-- 135. W-house-of-orange-beauty-canggu-canggu-not_for · house-of-orange-beauty-canggu-canggu · not_for · restore before
update venues set not_for = 'No extensions or electric files; natural nails only.' where slug = 'house-of-orange-beauty-canggu-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Extensions or electric-file work, because it does natural nails only';
-- expect: UPDATE 1

-- 136. W-hungry-bird-coffee-not_for · hungry-bird-coffee · not_for · restore before
update venues set not_for = 'Closes 5pm daily - no dinner service.' where slug = 'hungry-bird-coffee' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dinner: it closes at 5pm daily';
-- expect: UPDATE 1

-- 137. W-imbu-restaurant-the-kemilau-ubud-why_its_here · imbu-restaurant-the-kemilau-ubud · why_its_here · restore before
update venues set why_its_here = 'IMBU is an open-layout restaurant at The Kemilau Ubud on Jalan Raya Pengosekan. Its menu pairs dishes such as tuna yukhoe and cured salmon with slow-cooked beef and regional Indonesian flavours. The dining room accommodates up to 100 guests.' where slug = 'imbu-restaurant-the-kemilau-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'IMBU is an open-layout restaurant at The Kemilau Ubud on Jalan Raya Pengosekan, seating up to 100. Dishes such as tuna yukhoe and cured salmon sit next to slow-cooked beef and regional Indonesian flavours.';
-- expect: UPDATE 1

-- 138. W-imbu-restaurant-the-kemilau-ubud-not_for · imbu-restaurant-the-kemilau-ubud · not_for · restore before
update venues set not_for = 'A low-cost local-warung meal or a small, secluded dining room.' where slug = 'imbu-restaurant-the-kemilau-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A small, secluded room, since the dining room seats up to 100, or a low-cost local-warung meal';
-- expect: UPDATE 1

-- 139. W-inklusiv-warung-not_for · inklusiv-warung · not_for · restore before
update venues set not_for = 'Drag-show nights Wed, Fri and Sun from 8pm, 150K per person.' where slug = 'inklusiv-warung' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A low-key evening on Wed, Fri or Sun, when drag shows run from 8pm (150K per person)';
-- expect: UPDATE 1

-- 140. W-intercontinental-bali-resort-fitness-centre-why_its_here · intercontinental-bali-resort-fitness-centre · why_its_here · restore before
update venues set why_its_here = 'The 24-hour fitness centre at InterContinental Bali Resort in Jimbaran, described by guests as large and well stocked with machines. A jogging track runs through the grounds, and the resort has tennis courts and six pools. Personal training is available, and Pencak Silat martial-arts sessions are on the activity list.' where slug = 'intercontinental-bali-resort-fitness-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'InterContinental Bali Resort in Jimbaran has a 24-hour fitness centre, a jogging track through the grounds, tennis courts and six pools. Personal training is available, and Pencak Silat martial-arts sessions are on the activity list.';
-- expect: UPDATE 1

-- 141. W-intercontinental-bali-resort-fitness-centre-best_for · intercontinental-bali-resort-fitness-centre · best_for · restore before
update venues set best_for = 'Jimbaran guests who want a big 24-hour gym plus a jogging track and tennis without leaving the resort.' where slug = 'intercontinental-bali-resort-fitness-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A run on the jogging track, tennis or the 24-hour gym without leaving the resort';
-- expect: UPDATE 1

-- 142. W-intercontinental-bali-resort-yoga-why_its_here · intercontinental-bali-resort-yoga · why_its_here · restore before
update venues set why_its_here = 'Yoga at InterContinental Bali Resort in Jimbaran, offered through the 24-hour fitness centre and outdoors as seaside practice, with morning and sunset groups. A yoga instructor is available to guests.' where slug = 'intercontinental-bali-resort-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Yoga at InterContinental Bali Resort in Jimbaran happens in the 24-hour fitness centre and outdoors by the sea, with morning and sunset groups. A yoga instructor is available to guests.';
-- expect: UPDATE 1

-- 143. W-intuitive-flow-why_its_here · intuitive-flow · why_its_here · restore before
update venues set why_its_here = 'A long-established Penestanan studio with a glass-walled, open-air shala perched above the rice fields, reached by the hillside footpath near Alchemy.' where slug = 'intuitive-flow' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Penestanan studio whose glass-walled, open-air shala sits above the rice fields, reached by the hillside footpath near Alchemy.';
-- expect: UPDATE 1

-- 144. W-intuitive-flow-best_for · intuitive-flow · best_for · restore before
update venues set best_for = 'Practitioners who want daily drop-in classes across many styles in one of Ubud''s most scenic garden settings; good for beginners.' where slug = 'intuitive-flow' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Daily drop-in classes in many styles, beginners included, in a garden setting';
-- expect: UPDATE 1

-- 145. W-jatiluwih-why_its_here · jatiluwih · why_its_here · restore before
update venues set why_its_here = 'UNESCO-listed rice terraces at roughly 700 metres altitude in Tabanan, among the largest and most intact subak (traditional irrigation) landscapes on the island.' where slug = 'jatiluwih' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'UNESCO-listed subak (traditional irrigation) rice terraces at roughly 700 metres altitude in Tabanan.';
-- expect: UPDATE 1

-- 146. W-jatiluwih-best_for · jatiluwih · best_for · restore before
update venues set best_for = 'walking or cycling through UNESCO-listed rice terraces; a quieter alternative to Tegallalang' where slug = 'jatiluwih' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Walking or cycling the rice terraces, as a quieter alternative to Tegallalang';
-- expect: UPDATE 1

-- 147. W-jungle-flower-restaurant-why_its_here · jungle-flower-restaurant · why_its_here · restore before
update venues set why_its_here = 'Restaurant inside Jungle Flower Villas in Lodtunduh, open since 2024. Jungle setting south of central Ubud.' where slug = 'jungle-flower-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The restaurant inside Jungle Flower Villas, in a jungle setting at Lodtunduh, south of central Ubud. It has been open since 2024.';
-- expect: UPDATE 1

-- 148. W-kafe-ubud-why_its_here · kafe-ubud · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Ubud. The kitchen is described as varied international. The published menu includes Meg''s Big Salad Bowl, Meg''s Mini Bowl and Kale Detox Salad. Booking is on the venue''s own site.' where slug = 'kafe-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The menu at Kafe in Ubud is varied and international, with Meg''s Big Salad Bowl and a Kale Detox Salad on it. Its website takes bookings.';
-- expect: UPDATE 1

-- 149. W-kafe-ubud-best_for · kafe-ubud · best_for · restore before
update venues set best_for = 'Varied international in Ubud.' where slug = 'kafe-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A big salad bowl or something international in Ubud';
-- expect: UPDATE 1

-- 150. W-karsa-cafe-why_its_here · karsa-cafe · why_its_here · restore before
update venues set why_its_here = 'A rice-paddy and jungle-valley hideaway café along the Campuhan Ridge Walk, serving organic meals, seasonal fruit smoothies, and gourmet coffee with unobstructed green views.' where slug = 'karsa-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A café in the rice paddies and jungle valley along the Campuhan Ridge Walk. It serves organic meals, seasonal fruit smoothies and coffee, with open green views.';
-- expect: UPDATE 1

-- 151. W-karsa-cafe-best_for · karsa-cafe · best_for · restore before
update venues set best_for = 'Travelers finishing the Campuhan Ridge Walk who want a calm, scenic break with healthy food; quiet daytime pause surrounded by rice fields.' where slug = 'karsa-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm break with healthy food after the Campuhan Ridge Walk';
-- expect: UPDATE 1

-- 152. W-kekeb-restaurant-nusa-dua-why_its_here · kekeb-restaurant-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Nusa Dua. The kitchen is described as Indonesian, Balinese, Seafood. The published menu includes Rendang package, Chicken Betutu and Sate. Booking is by WhatsApp.' where slug = 'kekeb-restaurant-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kekeb in Nusa Dua is an Indonesian and Balinese restaurant that also does seafood. Chicken betutu, sate and a rendang package are on the menu, and WhatsApp is how you book.';
-- expect: UPDATE 1

-- 153. W-kekeb-restaurant-nusa-dua-best_for · kekeb-restaurant-nusa-dua · best_for · restore before
update venues set best_for = 'Indonesian, Balinese, Seafood in Nusa Dua.' where slug = 'kekeb-restaurant-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Rendang, chicken betutu or seafood in Nusa Dua';
-- expect: UPDATE 1

-- 154. W-ku-de-ta-why_its_here · ku-de-ta · why_its_here · restore before
update venues set why_its_here = 'Bali''s original beachfront club, on the sand at Seminyak Beach, running from morning through sunset into late night with dining, a bar, pool and daybeds. An all-day beach-club-plus-restaurant rather than a quick stop.' where slug = 'ku-de-ta' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A beachfront club right on the sand at Seminyak Beach. It runs from morning through sunset into late night, with dining, a bar, a pool and daybeds. It is an all-day beach club and restaurant rather than a quick stop.';
-- expect: UPDATE 1

-- 155. W-ku-de-ta-best_for · ku-de-ta · best_for · restore before
update venues set best_for = 'sunset drinks on the beach; a long lunch-into-evening on a daybed; a special occasion by the ocean' where slug = 'ku-de-ta' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset drinks on the beach, a long lunch into evening on a daybed, or a special occasion by the ocean';
-- expect: UPDATE 1

-- 156. W-ku-de-ta-not_for · ku-de-ta · not_for · restore before
update venues set not_for = 'budget travellers (daybeds/sofas carry a minimum spend); anyone wanting a small, quiet intimate dinner' where slug = 'ku-de-ta' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A tight budget, since daybeds and sofas carry a minimum spend, or a small, quiet dinner';
-- expect: UPDATE 1

-- 157. W-kush-day-spa-ubud-why_its_here · kush-day-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published list covers Ayurvedic Treatment. Booking is on the venue''s own site.' where slug = 'kush-day-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kush is a day spa in Ubud with Ayurvedic treatment.';
-- expect: UPDATE 1

-- 158. W-kush-day-spa-ubud-best_for · kush-day-spa-ubud · best_for · restore before
update venues set best_for = 'Ayurvedic treatment booked the same day.' where slug = 'kush-day-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An Ayurvedic treatment at Kush';
-- expect: UPDATE 1

-- 159. W-la-joya-uluwatu-bukit-why_its_here · la-joya-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Resort spa in the Bukit. The published list covers Couple Massage. Booking is on the venue''s own site.' where slug = 'la-joya-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'La Joya, a resort spa in the Bukit, does a couple massage, and you book on its own site.';
-- expect: UPDATE 1

-- 160. W-la-joya-uluwatu-bukit-best_for · la-joya-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'la-joya-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples booking a massage together';
-- expect: UPDATE 1
