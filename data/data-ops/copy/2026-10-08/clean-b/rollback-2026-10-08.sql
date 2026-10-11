-- wave-clean-b-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-laddu-restaurant-the-sankara-suites-and-villas-best_for · laddu-restaurant-the-sankara-suites-and-villas · best_for · restore before
update venues set best_for = 'A small resort dining room for an all-day Asian-fusion meal.' where slug = 'laddu-restaurant-the-sankara-suites-and-villas' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An all-day Asian-fusion meal in a small resort dining room';
-- expect: UPDATE 1

-- 2. W-laddu-restaurant-the-sankara-suites-and-villas-not_for · laddu-restaurant-the-sankara-suites-and-villas · not_for · restore before
update venues set not_for = 'Large groups that need a high-capacity dining room.' where slug = 'laddu-restaurant-the-sankara-suites-and-villas' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Large groups: the room seats 24';
-- expect: UPDATE 1

-- 3. W-le-meridien-bali-jimbaran-fitness-why_its_here · le-meridien-bali-jimbaran-fitness · why_its_here · restore before
update venues set why_its_here = 'The 24-hour gym at Le Méridien Bali Jimbaran, free to hotel guests, with cardio machines, exercise bikes, treadmills, free weights and weight machines. Explore Spa is on the same property.' where slug = 'le-meridien-bali-jimbaran-fitness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Le Méridien Bali Jimbaran''s gym is open 24 hours and free to hotel guests. It has cardio machines, exercise bikes, treadmills, free weights and weight machines, and Explore Spa is on the same property.';
-- expect: UPDATE 1

-- 4. W-le-meridien-bali-jimbaran-fitness-best_for · le-meridien-bali-jimbaran-fitness · best_for · restore before
update venues set best_for = 'Jimbaran guests who want a straightforward round-the-clock gym included in the room rate.' where slug = 'le-meridien-bali-jimbaran-fitness' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Hotel guests who want a workout at any hour, included in the room rate';
-- expect: UPDATE 1

-- 5. W-lkp-tirtasari-spa-tabanan-why_its_here · lkp-tirtasari-spa-tabanan · why_its_here · restore before
update venues set why_its_here = 'Spa in Tabanan. The published list covers Balinese Massage. Booking is by WhatsApp.' where slug = 'lkp-tirtasari-spa-tabanan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In Tabanan, LKP Tirtasari Spa does Balinese massage, and you book it by WhatsApp.';
-- expect: UPDATE 1

-- 6. W-lkp-tirtasari-spa-tabanan-best_for · lkp-tirtasari-spa-tabanan · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'lkp-tirtasari-spa-tabanan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage in Tabanan';
-- expect: UPDATE 1

-- 7. W-lluvia-spa-seminyak-why_its_here · lluvia-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'Spa in Seminyak. The published list covers Head Massage. Japanese Head Spa is 399K IDR for 90 minutes.' where slug = 'lluvia-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lluvia Spa in Seminyak does head massage: its Japanese Head Spa is 90 minutes for 399K IDR.';
-- expect: UPDATE 1

-- 8. W-lluvia-spa-seminyak-best_for · lluvia-spa-seminyak · best_for · restore before
update venues set best_for = 'Head massage booked the same day.' where slug = 'lluvia-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Ninety minutes of Japanese head spa in Seminyak';
-- expect: UPDATE 1

-- 9. W-lolas-cantina-canggu-best_for · lolas-cantina-canggu · best_for · restore before
update venues set best_for = 'Groups and couples choosing a casual Mexican meal in Canggu.' where slug = 'lolas-cantina-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Casual tacos and cocktails with a group or as a couple';
-- expect: UPDATE 1

-- 10. W-lolas-cantina-uluwatu-best_for · lolas-cantina-uluwatu · best_for · restore before
update venues set best_for = 'Groups and couples choosing a casual Mexican meal in Uluwatu.' where slug = 'lolas-cantina-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Groups and couples after a casual Mexican meal in Uluwatu';
-- expect: UPDATE 1

-- 11. W-luigis-hot-pizza-why_its_here · luigis-hot-pizza · why_its_here · restore before
update venues set why_its_here = 'A big, loud Neapolitan pizza joint on Jl. Batu Mejan built out of shipping containers, with a Napoli-imported wood-fired oven and weekly party nights. Pizza and good times are the whole point.' where slug = 'luigis-hot-pizza' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A big, loud Neapolitan pizza place on Jl. Batu Mejan, built out of shipping containers. The wood-fired oven was imported from Napoli, and there are party nights every week.';
-- expect: UPDATE 1

-- 12. W-luigis-hot-pizza-best_for · luigis-hot-pizza · best_for · restore before
update venues set best_for = 'Pizza, drinks and a party from 4pm, in a shipping-container room on Batu Mejan.' where slug = 'luigis-hot-pizza' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Pizza and drinks any day from 4pm, or one of the weekly party nights';
-- expect: UPDATE 1

-- 13. W-luna-and-sol-pilates-yoga-why_its_here · luna-and-sol-pilates-yoga · why_its_here · restore before
update venues set why_its_here = 'Pilates studio on Jl. Raya Semat. Classes run on equipment - reformer, chair and springboard - alongside mat and yoga. Mixed beginner and intermediate levels. Some classes also run on Zoom.' where slug = 'luna-and-sol-pilates-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Luna & Sol teaches pilates on Jl. Raya Semat, with classes on the reformer, chair and springboard as well as the mat, plus yoga. Levels mix beginner and intermediate, and some classes also run on Zoom.';
-- expect: UPDATE 1

-- 14. W-luxme-bali-jimbaran-why_its_here · luxme-bali-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Spa in Jimbaran. The published list covers Four Hands Massage.' where slug = 'luxme-bali-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'LuxMe Bali is a spa in Jimbaran that does four hands massage.';
-- expect: UPDATE 1

-- 15. W-luxme-bali-jimbaran-best_for · luxme-bali-jimbaran · best_for · restore before
update venues set best_for = 'Four hands massage booked the same day.' where slug = 'luxme-bali-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A four hands massage in Jimbaran';
-- expect: UPDATE 1

-- 16. W-luxury-spa-nusa-dua-why_its_here · luxury-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published list covers Pilates. Booking is on the venue''s own site.' where slug = 'luxury-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Luxury Spa is a Nusa Dua day spa that does pilates. You book through its website.';
-- expect: UPDATE 1

-- 17. W-luxury-spa-nusa-dua-best_for · luxury-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Pilates booked the same day.' where slug = 'luxury-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Pilates at a Nusa Dua day spa';
-- expect: UPDATE 1

-- 18. W-m-boutique-resort-uluwatu-bukit-why_its_here · m-boutique-resort-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Resort spa in the Bukit. The published list covers Yoga. Booking is on the venue''s own site.' where slug = 'm-boutique-resort-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mû Boutique Resort in the Bukit runs yoga at its spa. Bookings go through the resort''s website.';
-- expect: UPDATE 1

-- 19. W-m-boutique-resort-uluwatu-bukit-best_for · m-boutique-resort-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Yoga booked the same day.' where slug = 'm-boutique-resort-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga at a boutique resort in the Bukit';
-- expect: UPDATE 1

-- 20. W-mandapa-fitness-centre-why_its_here · mandapa-fitness-centre · why_its_here · restore before
update venues set why_its_here = 'The 24-hour fitness centre at Mandapa, a Ritz-Carlton Reserve, in the Ayung river valley near Ubud, free to use for resort guests. It sits alongside the Mandapa Spa & Wellness Centre, whose yoga classes run in a river-facing pavilion and on platforms set over the rice terraces.' where slug = 'mandapa-fitness-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mandapa, a Ritz-Carlton Reserve in the Ayung river valley near Ubud, has a 24-hour fitness centre that resort guests use free. The Mandapa Spa & Wellness Centre sits alongside it, with yoga in a river-facing pavilion and on platforms over the rice terraces.';
-- expect: UPDATE 1

-- 21. W-mandapa-fitness-centre-best_for · mandapa-fitness-centre · best_for · restore before
update venues set best_for = 'Guests staying in the Ubud river valley who want a round-the-clock gym plus yoga in the paddy-field pavilions.' where slug = 'mandapa-fitness-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort guests who want the gym at any hour and yoga above the rice terraces';
-- expect: UPDATE 1

-- 22. W-mantra-wellness-bali-uluwatu-bukit-why_its_here · mantra-wellness-bali-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in the Bukit. The published list covers Balinese Massage, Yoga and Traditional Massage. Booking is on the venue''s own site.' where slug = 'mantra-wellness-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mantra Wellness Bali is a wellness spa in the Bukit with Balinese and traditional massage, plus yoga. You book on its website.';
-- expect: UPDATE 1

-- 23. W-mantra-wellness-bali-uluwatu-bukit-best_for · mantra-wellness-bali-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'mantra-wellness-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Massage or yoga at a wellness spa in the Bukit';
-- expect: UPDATE 1

-- 24. W-mapogu-coffee-and-eatery-mapogu-restaurant-why_its_here · mapogu-coffee-and-eatery-mapogu-restaurant · why_its_here · restore before
update venues set why_its_here = 'Cafe and coworking space in Goa Gong, Jimbaran, open since 2022. Korean-leaning dishes alongside Indonesian and international plates. Free wifi, parking, and live music at weekends.' where slug = 'mapogu-coffee-and-eatery-mapogu-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mapogu is a cafe and coworking space in Goa Gong, Jimbaran, open since 2022. The kitchen mixes Korean-leaning dishes with Indonesian and international plates. Wifi is free, there is parking, and live music plays at weekends.';
-- expect: UPDATE 1

-- 25. W-massimo-italian-restaurant-why_its_here · massimo-italian-restaurant · why_its_here · restore before
update venues set why_its_here = 'A long-running Italian restaurant on Sanur''s main Jalan Danau Tamblingan strip, making pasta, mozzarella/burrata and gelato in-house daily, with wood-fired naturally-leavened pizza. The owner has produced Italian gelato in Sanur since 1996, with 48+ flavours.' where slug = 'massimo-italian-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Italian restaurant on Jalan Danau Tamblingan, Sanur''s main strip. Pasta, mozzarella, burrata and gelato are made in-house daily, and the pizza is wood-fired and naturally leavened. The owner has made Italian gelato in Sanur since 1996, with 48+ flavours.';
-- expect: UPDATE 1

-- 26. W-massimo-italian-restaurant-best_for · massimo-italian-restaurant · best_for · restore before
update venues set best_for = 'families and groups wanting familiar Italian food; a casual sit-down dinner on the main street; a dedicated gelato stop' where slug = 'massimo-italian-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families and groups after familiar Italian food at a casual sit-down dinner, or a stop for gelato';
-- expect: UPDATE 1

-- 27. W-massimo-italian-restaurant-not_for · massimo-italian-restaurant · not_for · restore before
update venues set not_for = 'anyone wanting beachfront or sea-view seating (it is on the street, not the shore)' where slug = 'massimo-italian-restaurant' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Beachfront or sea-view seating: it is on the street, not the shore';
-- expect: UPDATE 1

-- 28. W-maya-sanur-fitness-centre-why_its_here · maya-sanur-fitness-centre · why_its_here · restore before
update venues set why_its_here = 'The air-conditioned fitness centre at Maya Sanur Resort & Spa, free to use for in-house guests, fitted with cardio and strength machines. It sits on a beachfront property with the resort''s long lagoon pool and four restaurants.' where slug = 'maya-sanur-fitness-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Maya Sanur Resort & Spa has an air-conditioned fitness centre with cardio and strength machines, free for in-house guests. The property is beachfront, with the resort''s long lagoon pool and four restaurants.';
-- expect: UPDATE 1

-- 29. W-maya-sanur-fitness-centre-best_for · maya-sanur-fitness-centre · best_for · restore before
update venues set best_for = 'Sanur guests who want an air-conditioned gym at no extra charge, a few steps from the beach.' where slug = 'maya-sanur-fitness-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort guests who want an air-conditioned workout at no extra charge, a few steps from the beach';
-- expect: UPDATE 1

-- 30. W-maya-ubud-fitness-centre-ubud-why_its_here · maya-ubud-fitness-centre-ubud · why_its_here · restore before
update venues set why_its_here = 'The fitness centre at Maya Ubud Resort & Spa on the Peliatan ridge, overlooking the Petanu river valley.' where slug = 'maya-ubud-fitness-centre-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Maya Ubud Resort & Spa sits on the Peliatan ridge, and its fitness centre overlooks the Petanu river valley.';
-- expect: UPDATE 1

-- 31. W-maya-ubud-fitness-centre-ubud-best_for · maya-ubud-fitness-centre-ubud · best_for · restore before
update venues set best_for = 'Maya Ubud guests who want a workout with a valley view.' where slug = 'maya-ubud-fitness-centre-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Maya Ubud guests who want to train with a view of the valley';
-- expect: UPDATE 1

-- 32. W-maya-ubud-yoga-ubud-why_its_here · maya-ubud-yoga-ubud · why_its_here · restore before
update venues set why_its_here = 'Yoga at Maya Ubud Resort & Spa, held in a shala overlooking the Petanu valley.' where slug = 'maya-ubud-yoga-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Yoga classes at Maya Ubud Resort & Spa are held in a shala that overlooks the Petanu valley.';
-- expect: UPDATE 1

-- 33. W-maya-ubud-yoga-ubud-best_for · maya-ubud-yoga-ubud · best_for · restore before
update venues set best_for = 'Maya Ubud guests wanting a scenic class as part of a spa stay.' where slug = 'maya-ubud-yoga-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A class in the valley-view shala as part of a spa stay';
-- expect: UPDATE 1

-- 34. W-menega-cafe-why_its_here · menega-cafe · why_its_here · restore before
update venues set why_its_here = 'A long-running Jimbaran Bay seafood cafe where you pick fresh seafood by weight from the display and it is grilled over coconut-husk fires. Tables sit directly on Muaya Beach for toes-in-the-sand dining at sunset.' where slug = 'menega-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A seafood cafe on Jimbaran Bay. You pick fresh seafood by weight from the display, and it is grilled over coconut-husk fires. Tables sit directly on the sand of Muaya Beach for dinner at sunset.';
-- expect: UPDATE 1

-- 35. W-menega-cafe-best_for · menega-cafe · best_for · restore before
update venues set best_for = 'beachfront seafood dinner; sunset over the bay; groups sharing a seafood spread; special evening out' where slug = 'menega-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special evening or a group seafood spread on the beach, with the sun going down over the bay';
-- expect: UPDATE 1

-- 36. W-menega-cafe-not_for · menega-cafe · not_for · restore before
update venues set not_for = 'budget quick bites; vegetarians seeking variety; anyone wanting a quiet or air-conditioned room' where slug = 'menega-cafe' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Vegetarians wanting variety, a budget quick bite or a quiet, air-conditioned room — dinner here is seafood on the sand';
-- expect: UPDATE 1

-- 37. W-mercure-bali-sanur-resort-sanur-why_its_here · mercure-bali-sanur-resort-sanur · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Sanur. The published list covers Reflexology and Traditional Massage. Reflexology Treatment is 299K IDR for 45 minutes. Booking is on the venue''s own site.' where slug = 'mercure-bali-sanur-resort-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The wellness spa at Mercure Bali Sanur Resort does reflexology and traditional massage, and 45 minutes of reflexology costs 299K IDR. Book on the resort''s own site.';
-- expect: UPDATE 1

-- 38. W-mercure-bali-sanur-resort-sanur-best_for · mercure-bali-sanur-resort-sanur · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'mercure-bali-sanur-resort-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology at the end of a walking day in Sanur';
-- expect: UPDATE 1

-- 39. W-milk-and-madu-seminyak-best_for · milk-and-madu-seminyak · best_for · restore before
update venues set best_for = 'Families and groups choosing an easy café meal in central Seminyak.' where slug = 'milk-and-madu-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families and groups after an easy café meal in central Seminyak';
-- expect: UPDATE 1

-- 40. W-milk-and-madu-uluwatu-best_for · milk-and-madu-uluwatu · best_for · restore before
update venues set best_for = 'Families and groups choosing an easy all-day meal in Uluwatu.' where slug = 'milk-and-madu-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An easy all-day meal in Uluwatu with the family or a group';
-- expect: UPDATE 1

-- 41. W-moonlite-kitchen-and-bar-why_its_here · moonlite-kitchen-and-bar · why_its_here · restore before
update venues set why_its_here = 'Rooftop bar and restaurant on top of Anantara Seminyak Bali Resort, serving modern Southeast Asian dishes with ocean views. Nightly live bands and DJ sets give it an energetic, dressed-up evening feel.' where slug = 'moonlite-kitchen-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The rooftop bar and restaurant at Anantara Seminyak Bali Resort serves a modern Southeast Asian menu with ocean views. Live bands and DJ sets play every night.';
-- expect: UPDATE 1

-- 42. W-moonlite-kitchen-and-bar-best_for · moonlite-kitchen-and-bar · best_for · restore before
update venues set best_for = 'couples wanting a rooftop dinner with a view; travellers after cocktails at golden hour; a lively night out with music' where slug = 'moonlite-kitchen-and-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple''s rooftop dinner with a view, cocktails at golden hour, or a lively night out with music';
-- expect: UPDATE 1

-- 43. W-moonlite-kitchen-and-bar-not_for · moonlite-kitchen-and-bar · not_for · restore before
update venues set not_for = 'anyone wanting a quiet, low-key meal (live music/DJ most nights)' where slug = 'moonlite-kitchen-and-bar' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, low-key meal, because of the live music and DJ sets';
-- expect: UPDATE 1

-- 44. W-mori-ubud-best_for · mori-ubud · best_for · restore before
update venues set best_for = 'Special-occasion diners choosing Japanese fine dining in Ubud.' where slug = 'mori-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special occasion over Japanese fine dining or teppanyaki';
-- expect: UPDATE 1

-- 45. W-mori-ubud-not_for · mori-ubud · not_for · restore before
update venues set not_for = 'Budget diners or people seeking a quick daytime meal.' where slug = 'mori-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget or quick daytime meal: this is fine dining';
-- expect: UPDATE 1

-- 46. W-motion-skatepark-why_its_here · motion-skatepark · why_its_here · restore before
update venues set why_its_here = 'Indoor skatepark on Sunset Road, rebuilt in 2019. Street-style layout with transitions around the perimeter and a mini ramp to one side, obstacles from easy to hard. There is a skate shop on site, and locals will teach if asked.' where slug = 'motion-skatepark' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An indoor skatepark on Sunset Road, rebuilt in 2019. The layout is street-style, with transitions around the edge, a mini ramp to one side and obstacles from easy to hard. There is a skate shop on site, and locals will teach if you ask.';
-- expect: UPDATE 1

-- 47. W-movenpick-jimbaran-yoga-why_its_here · movenpick-jimbaran-yoga · why_its_here · restore before
update venues set why_its_here = 'Yoga at Mövenpick Resort & Spa Jimbaran, run through the resort''s 24-hour fitness centre in the Samasta complex. Some classes are free, including the Sunday vinyasa session; others are charged. Pilates runs on the same timetable.' where slug = 'movenpick-jimbaran-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Yoga at Mövenpick Resort & Spa Jimbaran runs through the 24-hour fitness centre in the Samasta complex. Some classes are free, including the Sunday vinyasa session; others are charged. Pilates runs on the same timetable.';
-- expect: UPDATE 1

-- 48. W-movenpick-jimbaran-yoga-best_for · movenpick-jimbaran-yoga · best_for · restore before
update venues set best_for = 'Guests who want to try a class without paying, starting with the free Sunday vinyasa.' where slug = 'movenpick-jimbaran-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Guests trying a class without paying, starting with the free Sunday vinyasa';
-- expect: UPDATE 1

-- 49. W-movenpick-resort-and-spa-jimbaran-fitness-why_its_here · movenpick-resort-and-spa-jimbaran-fitness · why_its_here · restore before
update venues set why_its_here = 'The 24-hour gym at Mövenpick Resort & Spa Jimbaran, stocked with current cardio machines and weight stations. A class programme runs alongside it covering yoga, pilates, aqua aerobics and water volleyball, and cycling is available on the property.' where slug = 'movenpick-resort-and-spa-jimbaran-fitness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The 24-hour gym at Mövenpick Resort & Spa Jimbaran has current cardio machines and weight stations. Alongside it runs a class programme of yoga, pilates, aqua aerobics and water volleyball, and you can cycle on the property.';
-- expect: UPDATE 1

-- 50. W-movenpick-resort-and-spa-jimbaran-fitness-best_for · movenpick-resort-and-spa-jimbaran-fitness · best_for · restore before
update venues set best_for = 'Jimbaran guests who want round-the-clock machines plus a scheduled class list including pool-based sessions.' where slug = 'movenpick-resort-and-spa-jimbaran-fitness' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A workout at any hour, with aqua aerobics and water volleyball on the class list';
-- expect: UPDATE 1

-- 51. W-nari-fire-influenced-bistro-best_for · nari-fire-influenced-bistro · best_for · restore before
update venues set best_for = 'A wood-fire lunch or dinner with a Campuhan Ridge outlook.' where slug = 'nari-fire-influenced-bistro' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A wood-fire lunch or dinner with a Campuhan Ridge outlook';
-- expect: UPDATE 1

-- 52. W-nari-fire-influenced-bistro-not_for · nari-fire-influenced-bistro · not_for · restore before
update venues set not_for = 'Diners seeking a low-cost warung meal.' where slug = 'nari-fire-influenced-bistro' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A low-cost warung meal, since this is a contemporary bistro';
-- expect: UPDATE 1

-- 53. W-naya-uluwatu-why_its_here · naya-uluwatu · why_its_here · restore before
update venues set why_its_here = 'Semi-private pilates studio in Bingin, Uluwatu. Five reformers per class, so the format stays small and precise.' where slug = 'naya-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'NAYA runs semi-private pilates in Bingin, Uluwatu. Each class has five reformers, so it stays small.';
-- expect: UPDATE 1

-- 54. W-nirvana-life-bali-canggu-why_its_here · nirvana-life-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'A Berawa fitness-and-wellness club open 6am–11pm, combining gym, classes and recovery under one roof.' where slug = 'nirvana-life-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Nirvana Life is a fitness and wellness club in Berawa, open 6am–11pm, with a gym, classes and recovery in the same building.';
-- expect: UPDATE 1

-- 55. W-nirvana-life-bali-canggu-best_for · nirvana-life-bali-canggu · best_for · restore before
update venues set best_for = 'Canggu stayers who want long hours and a mix of training and recovery.' where slug = 'nirvana-life-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Training and recovery in one place, open from 6am to 11pm';
-- expect: UPDATE 1

-- 56. W-noonik-bistro-why_its_here · noonik-bistro · why_its_here · restore before
update venues set why_its_here = 'NOONIK is a modern Asian bistro in Mas, Ubud. Its all-day menu spans breakfast through dinner with Asian and Indonesian dishes. It opens daily from 07:00 to 22:30.' where slug = 'noonik-bistro' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A modern Asian bistro in Mas, Ubud, open daily from 07:00 to 22:30. The menu runs from breakfast to dinner, mixing Asian and Indonesian dishes.';
-- expect: UPDATE 1

-- 57. W-noonik-bistro-best_for · noonik-bistro · best_for · restore before
update venues set best_for = 'An all-day Asian meal in Mas, from breakfast through dinner.' where slug = 'noonik-bistro' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Breakfast through dinner in Mas, Asian or Indonesian';
-- expect: UPDATE 1

-- 58. W-noonik-bistro-not_for · noonik-bistro · not_for · restore before
update venues set not_for = 'A fixed-course dinner centred on one cuisine or one service window.' where slug = 'noonik-bistro' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A fixed-course dinner of a single cuisine, since the menu is all-day and mixes Asian and Indonesian dishes';
-- expect: UPDATE 1

-- 59. W-nui-da-mano-beachfront-restaurant-in-batu-belig-why_its_here · nui-da-mano-beachfront-restaurant-in-batu-belig · why_its_here · restore before
update venues set why_its_here = 'Nui da Mano is a Polynesian-inspired restaurant directly on Batu Belig Beach. Its menu reinterprets Polynesian flavours with local ingredients. The open-air setting is arranged around shared plates by the sea.' where slug = 'nui-da-mano-beachfront-restaurant-in-batu-belig' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Polynesian-inspired restaurant directly on Batu Belig Beach, cooking Polynesian flavours with local ingredients. Seating is open-air, and the food comes as shared plates by the sea.';
-- expect: UPDATE 1

-- 60. W-nui-da-mano-beachfront-restaurant-in-batu-belig-best_for · nui-da-mano-beachfront-restaurant-in-batu-belig · best_for · restore before
update venues set best_for = 'Beachfront sharing plates by the sea in Batu Belig.' where slug = 'nui-da-mano-beachfront-restaurant-in-batu-belig' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sharing plates at a beachfront table in Batu Belig';
-- expect: UPDATE 1

-- 61. W-nui-da-mano-beachfront-restaurant-in-batu-belig-not_for · nui-da-mano-beachfront-restaurant-in-batu-belig · not_for · restore before
update venues set not_for = 'Diners seeking a strictly traditional, single-island Polynesian menu.' where slug = 'nui-da-mano-beachfront-restaurant-in-batu-belig' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A strictly traditional, single-island Polynesian menu, as the kitchen reworks it with local ingredients';
-- expect: UPDATE 1

-- 62. W-nusa-dua-beach-hotel-yoga-best_for · nusa-dua-beach-hotel-yoga · best_for · restore before
update venues set best_for = 'ITDC-estate guests who want a fixed morning class slot with a garden or beach setting.' where slug = 'nusa-dua-beach-hotel-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A daily 7am class at the Yoga Bale, with other classes on the beach and in the gardens';
-- expect: UPDATE 1

-- 63. W-olop-iyengar-yoga-why_its_here · olop-iyengar-yoga · why_its_here · restore before
update venues set why_its_here = 'A dedicated Iyengar-yoga studio in Seminyak focused on alignment and props-based practice.' where slug = 'olop-iyengar-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Olop is an Iyengar yoga studio in Seminyak, where practice centres on alignment and props.';
-- expect: UPDATE 1

-- 64. W-olop-iyengar-yoga-best_for · olop-iyengar-yoga · best_for · restore before
update venues set best_for = 'Practitioners who specifically want precise, Iyengar-method classes.' where slug = 'olop-iyengar-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Practitioners set on the Iyengar method';
-- expect: UPDATE 1

-- 65. W-oma-jamu-why_its_here · oma-jamu · why_its_here · restore before
update venues set why_its_here = 'A budget vegan cafe and organic grocery near Batu Bolong''s Puseh temple, serving all-day plant-based Indonesian food, cold-pressed juices, kombucha and traditional jamu tonics.' where slug = 'oma-jamu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A budget vegan cafe and organic grocery near the Puseh temple in Batu Bolong. Plant-based Indonesian food runs all day, alongside cold-pressed juices, kombucha and traditional jamu tonics.';
-- expect: UPDATE 1

-- 66. W-oma-jamu-best_for · oma-jamu · best_for · restore before
update venues set best_for = 'Affordable vegan and vegetarian eating, healthy breakfasts and jamu in a calm daytime setting.' where slug = 'oma-jamu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Affordable vegan or vegetarian eating by day, from a healthy breakfast to a jamu tonic';
-- expect: UPDATE 1

-- 67. W-oma-jamu-not_for · oma-jamu · not_for · restore before
update venues set not_for = 'Not for diners wanting meat or a full-service dinner.' where slug = 'oma-jamu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Diners wanting meat or a full-service dinner, since it is a vegan cafe';
-- expect: UPDATE 1

-- 68. W-padang-padang-surf-camp-uluwatu-why_its_here · padang-padang-surf-camp-uluwatu · why_its_here · restore before
update venues set why_its_here = 'A Bingin-based surf coaching operation running since 2005, led by a coach who grew up surfing Bingin.' where slug = 'padang-padang-surf-camp-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Padang Padang Surf Camp has coached surfers in Bingin since 2005, and its lead coach grew up surfing there.';
-- expect: UPDATE 1

-- 69. W-padang-padang-surf-camp-uluwatu-best_for · padang-padang-surf-camp-uluwatu · best_for · restore before
update venues set best_for = 'structured surf coaching for progressing surfers at Bingin' where slug = 'padang-padang-surf-camp-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Surfers who are progressing and want structured coaching at Bingin';
-- expect: UPDATE 1

-- 70. W-padma-resort-legian-kuta-legian-why_its_here · padma-resort-legian-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published list covers Hair Treatment. Booking is on the venue''s own site.' where slug = 'padma-resort-legian-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Padma Resort Legian has a day spa that does hair treatments, and the resort takes bookings on its website.';
-- expect: UPDATE 1

-- 71. W-padma-resort-legian-kuta-legian-best_for · padma-resort-legian-kuta-legian · best_for · restore before
update venues set best_for = 'Hair treatment booked the same day.' where slug = 'padma-resort-legian-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A hair treatment at a Legian resort';
-- expect: UPDATE 1

-- 72. W-padma-resort-legian-kuta-legian-not_for · padma-resort-legian-kuta-legian · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 770K IDR.' where slug = 'padma-resort-legian-kuta-legian' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget massage: the list starts at 770K IDR';
-- expect: UPDATE 1

-- 73. W-pak-gula-why_its_here · pak-gula · why_its_here · restore before
update venues set why_its_here = 'Two-storey restaurant in Bingin from the team behind The Cashew Tree. Sharing plates: char siu pork bao, vegetable dumplings, chicken satay, braised beef curry. The ground floor is casual; upstairs is a dinner room with low light, communal tables and a bar.' where slug = 'pak-gula' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'PAK GULA is a two-storey restaurant in Bingin from the team behind The Cashew Tree. Sharing plates include char siu pork bao, vegetable dumplings, chicken satay and braised beef curry. Downstairs is casual; upstairs is a low-lit dinner room with communal tables and a bar.';
-- expect: UPDATE 1

-- 74. W-pala-spa-munduk-why_its_here · pala-spa-munduk · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Munduk. The published list covers Balinese Massage. Booking is on the venue''s own site.' where slug = 'pala-spa-munduk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pala Spa is a wellness spa in Munduk where you can book a Balinese massage online.';
-- expect: UPDATE 1

-- 75. W-pala-spa-munduk-best_for · pala-spa-munduk · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'pala-spa-munduk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage while you''re in Munduk';
-- expect: UPDATE 1

-- 76. W-pantai-lovina-best_for · pantai-lovina · best_for · restore before
update venues set best_for = 'a dawn dolphin-watching boat trip; a quieter north-Bali beach base' where slug = 'pantai-lovina' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A dawn dolphin-watching boat trip, or a quieter beach base in north Bali';
-- expect: UPDATE 1

-- 77. W-pantai-pandawa-why_its_here · pantai-pandawa · why_its_here · restore before
update venues set why_its_here = 'A white-sand beach on the Bukit peninsula, Badung, reached by a road cut through the cliffs, with statues of the Pandawa brothers lining the entrance.' where slug = 'pantai-pandawa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A white-sand beach on the Bukit peninsula in Badung. You reach it on a road cut through the cliffs, and statues of the Pandawa brothers line the entrance.';
-- expect: UPDATE 1

-- 78. W-pantai-pandawa-best_for · pantai-pandawa · best_for · restore before
update venues set best_for = 'calmer water than the west-coast surf beaches; families and swimmers' where slug = 'pantai-pandawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families and swimmers who want calmer water than the west-coast surf beaches';
-- expect: UPDATE 1

-- 79. W-paradise-padel-bali-why_its_here · paradise-padel-bali · why_its_here · restore before
update venues set why_its_here = 'Padel club on Jalan Subak Sari. Equipment rental, parking, a shop, restaurant and changing rooms. Courts book through Playtomic, and a 60-minute session with a coach starts at 900,000 IDR. Tournaments and mixed-level sessions run regularly.' where slug = 'paradise-padel-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The padel club on Jalan Subak Sari rents equipment and has parking, a shop, a restaurant and changing rooms. Courts book through Playtomic, and a 60-minute session with a coach starts at 900,000 IDR. Tournaments and mixed-level sessions run regularly.';
-- expect: UPDATE 1

-- 80. W-parigata-resorts-and-spa-sanur-bali-sanur-why_its_here · parigata-resorts-and-spa-sanur-bali-sanur · why_its_here · restore before
update venues set why_its_here = 'Spa in Sanur. The published list covers Balinese Massage and Spa Package. Booking is on the venue''s own site.' where slug = 'parigata-resorts-and-spa-sanur-bali-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Parigata Resorts and Spa in Sanur does Balinese massage and a spa package; bookings are on its own site.';
-- expect: UPDATE 1

-- 81. W-parigata-resorts-and-spa-sanur-bali-sanur-best_for · parigata-resorts-and-spa-sanur-bali-sanur · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'parigata-resorts-and-spa-sanur-bali-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage or a spa package, with treatments of up to 120 minutes';
-- expect: UPDATE 1

-- 82. W-piasan-nusa-dua-restaurant-piasan-restaurant-why_its_here · piasan-nusa-dua-restaurant-piasan-restaurant · why_its_here · restore before
update venues set why_its_here = 'Italian restaurant in the BTDC area of Nusa Dua, at Kayumanis. The dining room is built from over 15,000 bamboo stems, with floating partitions and a raised ceiling. The name comes from a Balinese term for a ceremonial structure.' where slug = 'piasan-nusa-dua-restaurant-piasan-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Piasan is an Italian restaurant at Kayumanis, in the BTDC area of Nusa Dua. The dining room is built from over 15,000 bamboo stems, with floating partitions and a raised ceiling. The name comes from a Balinese term for a ceremonial structure.';
-- expect: UPDATE 1

-- 83. W-pica-south-american-kitchen-why_its_here · pica-south-american-kitchen · why_its_here · restore before
update venues set why_its_here = 'A small South American kitchen in central Ubud with a distinctive cuisine angle absent from most local lists.' where slug = 'pica-south-american-kitchen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A small South American kitchen in central Ubud, cooking Peruvian and South American flavours.';
-- expect: UPDATE 1

-- 84. W-pica-south-american-kitchen-best_for · pica-south-american-kitchen · best_for · restore before
update venues set best_for = 'Diners seeking Peruvian and South American flavours in Ubud.' where slug = 'pica-south-american-kitchen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Diners after Peruvian and South American flavours';
-- expect: UPDATE 1

-- 85. W-pica-south-american-kitchen-not_for · pica-south-american-kitchen · not_for · restore before
update venues set not_for = 'People looking for Balinese food or a large family room.' where slug = 'pica-south-american-kitchen' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Balinese food or a large family group: this is a small South American restaurant';
-- expect: UPDATE 1

-- 86. W-pizzaria-hyatt-why_its_here · pizzaria-hyatt · why_its_here · restore before
update venues set why_its_here = 'The Italian beachfront restaurant and bar at Hyatt Regency Bali, on Sanur Beach, serving antipasti, wood-fired sourdough pizza, pasta, seafood and meat with sea views. Lunch and dinner daily, plus a Sunday Brunch with live grills and carvings.' where slug = 'pizzaria-hyatt' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pizzaria is Hyatt Regency Bali''s beachfront Italian restaurant and bar on Sanur Beach, with sea views. Antipasti, wood-fired sourdough pizza, pasta, seafood and meat are served at lunch and dinner daily. Sunday Brunch adds live grills and carvings.';
-- expect: UPDATE 1

-- 87. W-pizzaria-hyatt-best_for · pizzaria-hyatt · best_for · restore before
update venues set best_for = 'couples wanting an upscale beachfront resort dinner; a special-occasion meal; Sunday brunch with a group; families dining early at the resort' where slug = 'pizzaria-hyatt' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An upscale beachfront dinner as a couple or for a special occasion, Sunday brunch with a group, or an early family meal';
-- expect: UPDATE 1

-- 88. W-pizzaria-hyatt-not_for · pizzaria-hyatt · not_for · restore before
update venues set not_for = 'anyone after a quick, budget, casual street meal' where slug = 'pizzaria-hyatt' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick, casual street meal on a budget: this is a beachfront resort restaurant';
-- expect: UPDATE 1

-- 89. W-poggy-bali-surf-school-uluwatu-why_its_here · poggy-bali-surf-school-uluwatu · why_its_here · restore before
update venues set why_its_here = 'A surf school based at Padang Padang beach coaching all levels across the Bukit''s breaks -- Padang Padang, Bingin, Dreamland and others.' where slug = 'poggy-bali-surf-school-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A surf school based at Padang Padang beach. It coaches all levels across the Bukit''s breaks, including Padang Padang, Bingin and Dreamland.';
-- expect: UPDATE 1

-- 90. W-poggy-bali-surf-school-uluwatu-best_for · poggy-bali-surf-school-uluwatu · best_for · restore before
update venues set best_for = 'tailored surf coaching across the Bukit''s breaks' where slug = 'poggy-bali-surf-school-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Coaching tailored to your level, moving between the Bukit''s breaks';
-- expect: UPDATE 1

-- 91. W-pole-studio-bali-why_its_here · pole-studio-bali · why_its_here · restore before
update venues set why_its_here = 'Pole studio in Seminyak. Beginner classes cover spins, climbs and transitions; intermediate and advanced work through routines. Flexibility and conditioning classes run alongside, and private lessons are available.' where slug = 'pole-studio-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Pole Studio Bali, beginner classes cover spins, climbs and transitions, and intermediate and advanced students work through routines. Flexibility and conditioning classes run alongside, and private lessons are available.';
-- expect: UPDATE 1

-- 92. W-prime-plaza-hotel-sanur-fitness-centre-why_its_here · prime-plaza-hotel-sanur-fitness-centre · why_its_here · restore before
update venues set why_its_here = 'The fitness centre at Prime Plaza Hotel Sanur, open to the public as well as hotel guests. It carries treadmills, stationary bikes, dumbbells, free weights, weight machines and cardio and resistance kit, with a changing room, hot and cold showers and lockers. Guests train free; walk-ins pay 100,000 IDR at peak and 75,000 IDR off peak, which includes locker, shower and spa access. Personal trainers can be booked ahead by the hour, day or week. The property also has a hot tub, a sauna, eight spa treatment rooms and a 110-metre free-form pool.' where slug = 'prime-plaza-hotel-sanur-fitness-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Prime Plaza Hotel Sanur''s gym is open to the public; hotel guests train free. Walk-ins pay 100,000 IDR at peak and 75,000 IDR off peak, which includes a locker, hot and cold showers and spa access. The gym has treadmills and stationary bikes alongside free weights and machines. Personal trainers can be booked ahead by the hour or by the day or week. The property also has a sauna and a hot tub, plus a 110-metre pool.';
-- expect: UPDATE 1

-- 93. W-prime-plaza-hotel-sanur-fitness-centre-best_for · prime-plaza-hotel-sanur-fitness-centre · best_for · restore before
update venues set best_for = 'Anyone in Sanur wanting a well-equipped gym on a cheap walk-in basis, with sauna and hot tub included in the entry price.' where slug = 'prime-plaza-hotel-sanur-fitness-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cheap walk-in workout in Sanur, with locker, shower and spa access in the entry price';
-- expect: UPDATE 1

-- 94. W-pullman-bali-legian-beach-kuta-legian-why_its_here · pullman-bali-legian-beach-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Resort spa in Legian. The published list covers Traditional Massage. Booking is on the venue''s own site.' where slug = 'pullman-bali-legian-beach-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pullman Bali Legian Beach has a resort spa for traditional massage; book on the hotel''s own website.';
-- expect: UPDATE 1

-- 95. W-pullman-bali-legian-beach-kuta-legian-best_for · pullman-bali-legian-beach-kuta-legian · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'pullman-bali-legian-beach-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Traditional massage at the Pullman in Legian';
-- expect: UPDATE 1

-- 96. W-reform-pilates-bingin-why_its_here · reform-pilates-bingin · why_its_here · restore before
update venues set why_its_here = 'The first reformer pilates studio in Bingin, opened in 2023 by Abbey. Classes include Booty & Core, Body Blast and deep stretch. Pre- and post-natal reformer classes run for the first and second trimesters. Booking is online.' where slug = 'reform-pilates-bingin' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A reformer pilates studio in Bingin, opened in 2023 by Abbey. Classes include Booty & Core, Body Blast and deep stretch. Pre- and post-natal reformer classes run for the first and second trimesters. Booking is online.';
-- expect: UPDATE 1

-- 97. W-reform-uluwatu-why_its_here · reform-uluwatu · why_its_here · restore before
update venues set why_its_here = 'Reform+ is the second Reform Pilates location, in Uluwatu. Reformer classes with online booking.' where slug = 'reform-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Reform+ is the second Reform Pilates location, in Uluwatu, running reformer classes that you book online.';
-- expect: UPDATE 1

-- 98. W-retro-kitchen-and-bar-why_its_here · retro-kitchen-and-bar · why_its_here · restore before
update venues set why_its_here = 'Broad-menu kitchen-and-bar on the main Sanur strip mixing Australian steaks, Western favourites and Indonesian dishes, with a dedicated kids'' section.' where slug = 'retro-kitchen-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Retro Kitchen and Bar sits on the main Sanur strip and keeps a broad menu. Australian steaks and Western favourites run beside Indonesian dishes, and there is a kids'' section of its own.';
-- expect: UPDATE 1

-- 99. W-retro-kitchen-and-bar-best_for · retro-kitchen-and-bar · best_for · restore before
update venues set best_for = 'families with kids; groups wanting varied Western-and-local options in one place' where slug = 'retro-kitchen-and-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families with kids, or a group that wants Western and Indonesian options in one place';
-- expect: UPDATE 1

-- 100. W-rip-curl-school-of-surf-why_its_here · rip-curl-school-of-surf · why_its_here · restore before
update venues set why_its_here = 'Surf school on Sanur beach inside the Prama Sanur Beach hotel, running since 1998. Surfing, kitesurfing, stand-up paddle, windsurfing, wakeboarding, diving and foiling, with certification and rentals. The Little Ripper programme is for under-13s.' where slug = 'rip-curl-school-of-surf' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Rip Curl''s surf school is on Sanur beach inside the Prama Sanur Beach hotel and has run since 1998. It also teaches kitesurfing, stand-up paddle, windsurfing, wakeboarding, diving and foiling, with certification and rentals. The Little Ripper programme is for under-13s.';
-- expect: UPDATE 1

-- 101. W-rockfish-cliffside-why_its_here · rockfish-cliffside · why_its_here · restore before
update venues set why_its_here = 'Rockfish Cliffside is an owner-confirmed cliffside restaurant in Pecatu serving seafood and wagyu-led dishes.' where slug = 'rockfish-cliffside' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Rockfish Cliffside is a restaurant on the cliffs in Pecatu, with a menu led by seafood and wagyu.';
-- expect: UPDATE 1

-- 102. W-rockfish-cliffside-best_for · rockfish-cliffside · best_for · restore before
update venues set best_for = 'Travellers planning a cliffside dinner in Uluwatu.' where slug = 'rockfish-cliffside' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cliffside dinner in Uluwatu, seafood or wagyu';
-- expect: UPDATE 1

-- 103. W-rokkyu-teppanyaki-grand-istana-rama-hotel-kuta-best_for · rokkyu-teppanyaki-grand-istana-rama-hotel-kuta · best_for · restore before
update venues set best_for = 'Lunch or dinner with live teppanyaki cooking in Kuta.' where slug = 'rokkyu-teppanyaki-grand-istana-rama-hotel-kuta' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Lunch or dinner with live teppanyaki cooking in Kuta';
-- expect: UPDATE 1

-- 104. W-rokkyu-teppanyaki-grand-istana-rama-hotel-kuta-not_for · rokkyu-teppanyaki-grand-istana-rama-hotel-kuta · not_for · restore before
update venues set not_for = 'Breakfast or an early-morning meal.' where slug = 'rokkyu-teppanyaki-grand-istana-rama-hotel-kuta' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Breakfast or an early-morning meal: the doors open at 12:00';
-- expect: UPDATE 1

-- 105. W-roots-pererenan-why_its_here · roots-pererenan · why_its_here · restore before
update venues set why_its_here = 'An all-day plant-based restaurant in Pererenan built around a customizable build-your-own-bowl with 50+ ingredients, plus bold drinks, serving vegans, vegetarians and anyone eating less meat.' where slug = 'roots-pererenan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An all-day plant-based restaurant in Pererenan for vegans, vegetarians and anyone eating less meat. The menu is built around a bowl you make yourself from 50+ ingredients.';
-- expect: UPDATE 1

-- 106. W-roots-pererenan-best_for · roots-pererenan · best_for · restore before
update venues set best_for = 'Plant-based and health-focused eaters, a customizable brunch or bowl, and casual laptop-friendly daytime sitting.' where slug = 'roots-pererenan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Plant-based eaters after a bowl built their way, or a casual daytime laptop session';
-- expect: UPDATE 1

-- 107. W-roots-pererenan-not_for · roots-pererenan · not_for · restore before
update venues set not_for = 'Meat-centric diners or a formal special-occasion dinner.' where slug = 'roots-pererenan' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Meat-centric diners or a formal special-occasion dinner — it is a casual plant-based place';
-- expect: UPDATE 1

-- 108. W-rosehill-spa-nusa-dua-why_its_here · rosehill-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published list covers Traditional Massage and Reflexology. Foot Reflexology is 300K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'rosehill-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An hour of foot reflexology costs 300K IDR at Rosehill Spa, a day spa in Nusa Dua that also does traditional massage. Booking is on the spa''s own site.';
-- expect: UPDATE 1

-- 109. W-rosehill-spa-nusa-dua-best_for · rosehill-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'rosehill-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology after a day on your feet';
-- expect: UPDATE 1

-- 110. W-rotisserie-by-cashew-tree-why_its_here · rotisserie-by-cashew-tree · why_its_here · restore before
update venues set why_its_here = 'Rotisserie from The Cashew Tree in Pecatu. Slow-roasted meats with fresh sides and sauces.' where slug = 'rotisserie-by-cashew-tree' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Cashew Tree''s rotisserie in Pecatu slow-roasts meats and serves them with fresh sides and sauces.';
-- expect: UPDATE 1

-- 111. W-s2s-crossfit-why_its_here · s2s-crossfit · why_its_here · restore before
update venues set why_its_here = 'CrossFit box on Jl. Raya Semat, the first CrossFit affiliate on the island. CrossFit, weightlifting, high-intensity cardio and personal training. A drop-in is 200,000 IDR and needs no booking - arrive ten minutes before class.' where slug = 's2s-crossfit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'S2S is a CrossFit box on Jl. Raya Semat. It runs CrossFit, weightlifting, high-intensity cardio and personal training. A drop-in costs 200,000 IDR with no booking needed; arrive ten minutes before class.';
-- expect: UPDATE 1

-- 112. W-sanur-surf-school-why_its_here · sanur-surf-school · why_its_here · restore before
update venues set why_its_here = 'Surf school in Sanur teaching at Baby Reef, a short boat ride offshore where the waves break smaller and softer than in the south. Private lessons and semi-private for two, from a first wave to refining technique. Children are welcome and foiling is taught as well.' where slug = 'sanur-surf-school' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sanur Surf School teaches at Baby Reef, a short boat ride offshore, where the waves break smaller and softer than in the south. Lessons are private or semi-private for two, from a first wave to refining technique. Children are welcome, and foiling is taught too.';
-- expect: UPDATE 1

-- 113. W-seabird-bistro-and-coworking-canggu-by-wonderspace-why_its_here · seabird-bistro-and-coworking-canggu-by-wonderspace · why_its_here · restore before
update venues set why_its_here = 'Bistro and coworking space on Jl. Nelayan, part of the Wonderspace group. Italian comfort food with a French turn: grilled lobster tagliatelle, wagyu steak frites, rigatoni vodka. Vegetarian and vegan options, local wines and cocktails.' where slug = 'seabird-bistro-and-coworking-canggu-by-wonderspace' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Seabird is a bistro and coworking space on Jl. Nelayan, part of the Wonderspace group. The kitchen does Italian comfort food with a French turn, such as grilled lobster tagliatelle, wagyu steak frites and rigatoni vodka. Vegetarian and vegan options sit alongside local wines and cocktails.';
-- expect: UPDATE 1

-- 114. W-seasalt-why_its_here · seasalt · why_its_here · restore before
update venues set why_its_here = 'Beachfront seafood-led fine dining inside Alila, strongest for coastal date nights and brunch splurges.' where slug = 'seasalt' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Seasalt is beachfront fine dining inside Alila, and the menu leads with seafood. Come for a date night by the coast or a brunch splurge.';
-- expect: UPDATE 1

-- 115. W-seasalt-best_for · seasalt · best_for · restore before
update venues set best_for = 'date night special; sunset drinks view; special occasion' where slug = 'seasalt' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A date night or a special occasion, with drinks at sunset';
-- expect: UPDATE 1

-- 116. W-serenity-bali-yogi-spa-canggu-why_its_here · serenity-bali-yogi-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Spa in Canggu. The published list covers Balinese Massage. Balinese Massage is 250K IDR for 60 minutes. Booking runs through Fresha.' where slug = 'serenity-bali-yogi-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Serenity Bali Yogi Spa in Canggu does Balinese massage at 250K IDR for 60 minutes, and bookings run through Fresha.';
-- expect: UPDATE 1

-- 117. W-serenity-bali-yogi-spa-canggu-best_for · serenity-bali-yogi-spa-canggu · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'serenity-bali-yogi-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A 60-minute Balinese massage for 250K IDR, booked through Fresha';
-- expect: UPDATE 1

-- 118. W-serenity-eco-guesthouse-yoga-canggu-why_its_here · serenity-eco-guesthouse-yoga-canggu · why_its_here · restore before
update venues set why_its_here = 'The long-running yoga shala at Serenity Eco Guesthouse in Nelayan, with a busy daily timetable and a wellness day pass (249k).' where slug = 'serenity-eco-guesthouse-yoga-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Serenity Eco Guesthouse in Nelayan has a yoga shala with a busy daily timetable. A wellness day pass costs 249k.';
-- expect: UPDATE 1

-- 119. W-serenity-eco-guesthouse-yoga-canggu-best_for · serenity-eco-guesthouse-yoga-canggu · best_for · restore before
update venues set best_for = 'Budget-minded yogis who want plentiful daily classes in a friendly eco setting.' where slug = 'serenity-eco-guesthouse-yoga-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yogis on a budget who want plenty of classes every day';
-- expect: UPDATE 1

-- 120. W-sista-dumpling-why_its_here · sista-dumpling · why_its_here · restore before
update venues set why_its_here = 'Sista Dumpling is a modern dumpling bistro on Jl. Raya Semat in Berawa, built around sharing plates and drinks, open from late morning to 11pm. There is a second branch in Uluwatu; everything recorded here is the Berawa room.' where slug = 'sista-dumpling' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sista Dumpling is a modern dumpling bistro on Jl. Raya Semat in Berawa, open from late morning to 11pm. The menu is built around sharing plates, with drinks alongside. There is a second branch in Uluwatu; the details here are for the Berawa room.';
-- expect: UPDATE 1

-- 121. W-sista-dumpling-best_for · sista-dumpling · best_for · restore before
update venues set best_for = 'A dumpling bistro in Berawa built for sharing, open from late morning.' where slug = 'sista-dumpling' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Shared dumplings and drinks from late morning';
-- expect: UPDATE 1

-- 122. W-six-senses-uluwatu-pilates-best_for · six-senses-uluwatu-pilates · best_for · restore before
update venues set best_for = 'Resort guests who want a mat-based session alongside the yoga schedule rather than a standalone studio.' where slug = 'six-senses-uluwatu-pilates' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort guests who want mat pilates to go with the yoga schedule';
-- expect: UPDATE 1

-- 123. W-skai-beach-club-legian-why_its_here · skai-beach-club-legian · why_its_here · restore before
update venues set why_its_here = 'A beach club at Padma Resort Legian with a semi-alfresco terrace and an infinity pool set over the Legian surf, built around sunset.' where slug = 'skai-beach-club-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'S.K.A.I is the beach club at Padma Resort Legian, with a semi-alfresco terrace and an infinity pool set over the Legian surf. Sunset is the main event.';
-- expect: UPDATE 1

-- 124. W-skai-beach-club-legian-best_for · skai-beach-club-legian · best_for · restore before
update venues set best_for = 'sunset over an infinity pool in Legian' where slug = 'skai-beach-club-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset from an infinity pool in Legian';
-- expect: UPDATE 1

-- 125. W-spa-at-rimba-by-ayana-bali-jimbaran-why_its_here · spa-at-rimba-by-ayana-bali-jimbaran · why_its_here · restore before
update venues set why_its_here = 'The spa at RIMBA by AYANA on the vast AYANA estate above Jimbaran, one of Bali''s largest resort-and-wellness complexes.' where slug = 'spa-at-rimba-by-ayana-bali-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The spa at RIMBA by AYANA sits on the vast AYANA estate above Jimbaran, a resort-and-wellness complex.';
-- expect: UPDATE 1

-- 126. W-spa-at-rimba-by-ayana-bali-jimbaran-best_for · spa-at-rimba-by-ayana-bali-jimbaran · best_for · restore before
update venues set best_for = 'RIMBA and AYANA guests wanting resort treatments with access to the wider estate.' where slug = 'spa-at-rimba-by-ayana-bali-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'RIMBA and AYANA guests after a resort treatment with access to the wider estate';
-- expect: UPDATE 1

-- 127. W-spa-sidemen-sidemen-why_its_here · spa-sidemen-sidemen · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Sidemen. The published list covers Balinese Massage. Balinese Massage is 250K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'spa-sidemen-sidemen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Spa Sidemen is a massage studio in Sidemen where a 60-minute Balinese massage costs 250K IDR. Book by WhatsApp.';
-- expect: UPDATE 1

-- 128. W-spa-sidemen-sidemen-best_for · spa-sidemen-sidemen · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'spa-sidemen-sidemen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Up to two hours of massage in Sidemen';
-- expect: UPDATE 1

-- 129. W-st-regis-bali-yoga-why_its_here · st-regis-bali-yoga · why_its_here · restore before
update venues set why_its_here = 'The yoga and movement programme at The St. Regis Bali Resort, run from a dedicated yoga room inside the Iridium Spa. A complimentary schedule covers beachside yoga, stand-up paddle yoga, meditation and Tai Chi sessions in the resort amphitheatre.' where slug = 'st-regis-bali-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The St. Regis Bali Resort runs its yoga and movement programme from a yoga room inside the Iridium Spa. The free schedule covers beachside yoga, stand-up paddle yoga, meditation and Tai Chi in the resort amphitheatre.';
-- expect: UPDATE 1

-- 130. W-st-regis-bali-yoga-best_for · st-regis-bali-yoga · best_for · restore before
update venues set best_for = 'Guests who want a free daily practice on the beach or on the water, not just a mat in a hotel gym.' where slug = 'st-regis-bali-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort guests who want a free daily practice on the beach or on the water, rather than a mat in a hotel gym';
-- expect: UPDATE 1

-- 131. W-sunset-pilates-legian-why_its_here · sunset-pilates-legian · why_its_here · restore before
update venues set why_its_here = 'A Legian pilates studio with scheduled classes you can drop into -- a lower-impact alternative to yoga for a morning session near the beach.' where slug = 'sunset-pilates-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A pilates studio in Legian with a class schedule you can drop into. It is a lower-impact option than yoga for a morning session near the beach.';
-- expect: UPDATE 1

-- 132. W-sunset-pilates-legian-best_for · sunset-pilates-legian · best_for · restore before
update venues set best_for = 'a drop-in pilates class in Legian' where slug = 'sunset-pilates-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A drop-in pilates class near the beach in Legian';
-- expect: UPDATE 1

-- 133. W-svaha-spa-melasti-uluwatu-bukit-why_its_here · svaha-spa-melasti-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published list covers Balinese Massage and Spa Package. Booking is on the venue''s own site.' where slug = 'svaha-spa-melasti-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Svaha Spa Melasti, a day spa in the Bukit, you can have a Balinese massage or a spa package. Its website takes bookings.';
-- expect: UPDATE 1

-- 134. W-svaha-spa-melasti-uluwatu-bukit-best_for · svaha-spa-melasti-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'svaha-spa-melasti-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa package, or just a Balinese massage';
-- expect: UPDATE 1

-- 135. W-swan-restaurant-keramas-desa-swan-villas-and-spa-why_its_here · swan-restaurant-keramas-desa-swan-villas-and-spa · why_its_here · restore before
update venues set why_its_here = 'Restaurant in Desa Swan Villas and Spa Jalan Pantai Selukat, Ubud.' where slug = 'swan-restaurant-keramas-desa-swan-villas-and-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Restaurant in Desa Swan Villas and Spa Jalan Pantai Selukat.';
-- expect: UPDATE 1

-- 136. W-takk-bali-why_its_here · takk-bali · why_its_here · restore before
update venues set why_its_here = 'TAKK is a casual fine-dining restaurant on Jalan Petitenget. Its dinner menu uses Bali ingredients in refined plates. Listed signatures include sea-salt cured salmon, charred local lamb and a cocoa-and-citrus dessert.' where slug = 'takk-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'TAKK is a casual fine-dining restaurant on Jalan Petitenget, cooking dinner with Bali ingredients. The dishes it lists include sea-salt cured salmon, charred local lamb and a cocoa-and-citrus dessert.';
-- expect: UPDATE 1

-- 137. W-takk-bali-best_for · takk-bali · best_for · restore before
update venues set best_for = 'An intimate Wednesday-to-Sunday fine-dining dinner in Petitenget.' where slug = 'takk-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An intimate fine-dining dinner in Petitenget, Wednesday to Sunday';
-- expect: UPDATE 1

-- 138. W-takk-bali-not_for · takk-bali · not_for · restore before
update venues set not_for = 'Daytime meals or Monday-to-Tuesday dinner plans.' where slug = 'takk-bali' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A daytime meal, or dinner on a Monday or Tuesday: it serves dinner Wednesday to Sunday';
-- expect: UPDATE 1

-- 139. W-tanah-lot-why_its_here · tanah-lot · why_its_here · restore before
update venues set why_its_here = 'Bali''s most photographed sea temple, on an offshore rock framed by the sunset. The inner sanctum is closed to non-worshippers; the rock base is reachable only at low tide.' where slug = 'tanah-lot' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Tanah Lot is a sea temple on an offshore rock, framed by the sunset. The inner sanctum is closed to non-worshippers, and you can reach the rock base only at low tide.';
-- expect: UPDATE 1

-- 140. W-tanah-lot-best_for · tanah-lot · best_for · restore before
update venues set best_for = 'sunset photography; a short coastal walk timed to low tide' where slug = 'tanah-lot' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Sunset photography, or a short coastal walk timed to low tide';
-- expect: UPDATE 1

-- 141. W-the-chowk-ubud-best_for · the-chowk-ubud · best_for · restore before
update venues set best_for = 'Vegetarian and non-vegetarian diners choosing Indian food in central Ubud.' where slug = 'the-chowk-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An Indian meal in central Ubud, vegetarian or not';
-- expect: UPDATE 1

-- 142. W-the-free-bird-studio-why_its_here · the-free-bird-studio · why_its_here · restore before
update venues set why_its_here = 'Movement studio in Berawa. The programme runs to movement, healing, ceremony and activation.' where slug = 'the-free-bird-studio' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A movement studio in Berawa whose programme covers movement, healing, ceremony and activation.';
-- expect: UPDATE 1

-- 143. W-the-garcia-ubud-ubud-why_its_here · the-garcia-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'Spa in Ubud. The published list covers Balinese Massage. Traditional Balinese Massage is 690K IDR. Booking is on the venue''s own site.' where slug = 'the-garcia-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Garcia Ubud is a spa in Ubud where a traditional Balinese massage costs 690K IDR. It takes bookings on its own website.';
-- expect: UPDATE 1

-- 144. W-the-garcia-ubud-ubud-best_for · the-garcia-ubud-ubud · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'the-garcia-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A traditional Balinese massage in Ubud';
-- expect: UPDATE 1

-- 145. W-the-garcia-ubud-ubud-not_for · the-garcia-ubud-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 690K IDR.' where slug = 'the-garcia-ubud-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A massage on a budget: the traditional Balinese massage is 690K IDR';
-- expect: UPDATE 1

-- 146. W-the-jungle-club-ubud-by-wonderspace-why_its_here · the-jungle-club-ubud-by-wonderspace · why_its_here · restore before
update venues set why_its_here = 'Adults-only day club on roughly two hectares of jungle in Celuk. An infinity pool, a jungle deck, a boho cave and a jetty. Svaha Spa sits on the same grounds. Live music and themed events.' where slug = 'the-jungle-club-ubud-by-wonderspace' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An adults-only day club on roughly two hectares of jungle in Celuk. The grounds hold an infinity pool, a jungle deck, a boho cave and a jetty, and Svaha Spa shares the site. The club also puts on live music and themed events.';
-- expect: UPDATE 1

-- 147. W-the-little-hill-terrace-why_its_here · the-little-hill-terrace · why_its_here · restore before
update venues set why_its_here = 'Restaurant inside The Little Hill Suites in Munduk. Locally sourced cooking from the farms of North Bali. The terrace looks over green hills and valleys.' where slug = 'the-little-hill-terrace' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The restaurant at The Little Hill Suites in Munduk cooks with produce sourced from North Bali farms. Its terrace looks over green hills and valleys.';
-- expect: UPDATE 1

-- 148. W-the-northview-bali-ngiring-ngewedang-restaurant-and-coffee-c-why_its_here · the-northview-bali-ngiring-ngewedang-restaurant-and-coffee-c · why_its_here · restore before
update venues set why_its_here = 'Restaurant and coffee corner on a hilltop in Munduk village. Asian and Indonesian dishes with Balinese coffee and teas. Crispy duck and banana fritters are regulars. The open dining room faces the hills and valleys.' where slug = 'the-northview-bali-ngiring-ngewedang-restaurant-and-coffee-c' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A hilltop restaurant and coffee corner in Munduk village, cooking Asian and Indonesian dishes and pouring Balinese coffee and teas. Crispy duck and banana fritters are regulars, and the open dining room faces the hills and valleys.';
-- expect: UPDATE 1

-- 149. W-the-sanur-sanur-why_its_here · the-sanur-sanur · why_its_here · restore before
update venues set why_its_here = 'Day spa in Sanur. The published list covers Balinese Massage and Aromatherapy. Balinese Massage is 350K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'the-sanur-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Sanur, a day spa in Sanur, does Balinese massage and aromatherapy. A 60-minute Balinese massage is 350K IDR; book on the spa''s own site.';
-- expect: UPDATE 1

-- 150. W-the-sanur-sanur-best_for · the-sanur-sanur · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'the-sanur-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Aromatherapy, or an hour of Balinese massage for 350K IDR';
-- expect: UPDATE 1

-- 151. W-the-tanjung-benoa-beach-resort-nusa-dua-why_its_here · the-tanjung-benoa-beach-resort-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Resort spa in Nusa Dua. The published list covers Balinese Massage, Aromatherapy and Facial. Balinese Massage is 450K IDR for 60 minutes.' where slug = 'the-tanjung-benoa-beach-resort-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The spa at The Tanjung Benoa Beach Resort in Nusa Dua covers Balinese massage, aromatherapy and facials. A 60-minute Balinese massage costs 450K IDR.';
-- expect: UPDATE 1

-- 152. W-the-tanjung-benoa-beach-resort-nusa-dua-best_for · the-tanjung-benoa-beach-resort-nusa-dua · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'the-tanjung-benoa-beach-resort-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial or aromatherapy at a beach resort';
-- expect: UPDATE 1

-- 153. W-the-ungasan-uluwatu-bukit-why_its_here · the-ungasan-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in the Bukit. The published list covers Facial. Booking is by WhatsApp.' where slug = 'the-ungasan-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Ungasan is a wellness spa in the Bukit; message it on WhatsApp to book a facial.';
-- expect: UPDATE 1

-- 154. W-the-ungasan-uluwatu-bukit-best_for · the-ungasan-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Facial booked the same day.' where slug = 'the-ungasan-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial in the Bukit';
-- expect: UPDATE 1

-- 155. W-think-pink-nails-canggu-canggu-best_for · think-pink-nails-canggu-canggu · best_for · restore before
update venues set best_for = 'A quick, well-priced mani-pedi between beach and café.' where slug = 'think-pink-nails-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A quick, well-priced mani-pedi between the beach and a café';
-- expect: UPDATE 1

-- 156. W-tirta-empul-why_its_here · tirta-empul · why_its_here · restore before
update venues set why_its_here = 'A temple built around a sacred spring where Balinese Hindus, and visitors, perform melukat, a purification ritual moving spout to spout through the bathing pool. A sarong is required and provided at the gate.' where slug = 'tirta-empul' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A temple built around a sacred spring. Balinese Hindus and visitors perform melukat here, a purification ritual that moves from spout to spout through the bathing pool. A sarong is required and provided at the gate.';
-- expect: UPDATE 1

-- 157. W-tirta-empul-best_for · tirta-empul · best_for · restore before
update venues set best_for = 'the melukat purification ritual; a culturally rich half-day near Ubud' where slug = 'tirta-empul' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A half-day near Ubud built around the melukat purification ritual';
-- expect: UPDATE 1

-- 158. W-tirta-padma-tribhuwana-padma-why_its_here · tirta-padma-tribhuwana-padma · why_its_here · restore before
update venues set why_its_here = 'Tirta Padma is the dining outlet at Tribhuwana Padma in Kedisan, Kintamani. The resort''s lakeside setting frames the meal around Mount Batur and the surrounding highland landscape.' where slug = 'tirta-padma-tribhuwana-padma' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Tirta Padma is the restaurant at Tribhuwana Padma, a lakeside resort in Kedisan, Kintamani, with views of Mount Batur and the highlands around it.';
-- expect: UPDATE 1

-- 159. W-tirta-padma-tribhuwana-padma-best_for · tirta-padma-tribhuwana-padma · best_for · restore before
update venues set best_for = 'A lakeside meal during a planned Kintamani visit.' where slug = 'tirta-padma-tribhuwana-padma' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A lakeside meal on a planned Kintamani visit';
-- expect: UPDATE 1

-- 160. W-tirta-padma-tribhuwana-padma-not_for · tirta-padma-tribhuwana-padma · not_for · restore before
update venues set not_for = 'A quick meal during a tightly timed south-Bali beach itinerary.' where slug = 'tirta-padma-tribhuwana-padma' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick bite on a tight south-Bali beach schedule, as it sits up in Kintamani';
-- expect: UPDATE 1

-- 161. W-titi-batu-ubud-club-ubud-best_for · titi-batu-ubud-club-ubud · best_for · restore before
update venues set best_for = 'Families and long-stayers who want a full day-club rather than just a gym.' where slug = 'titi-batu-ubud-club-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families and long-stayers who want a full day-club rather than just a gym';
-- expect: UPDATE 1

-- 162. W-tonic-kuta-legian-why_its_here · tonic-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Legian. The published list covers Aromatherapy and Couple Massage. Couples Spa Package is 750K IDR for 90 minutes. Booking is on the venue''s own site.' where slug = 'tonic-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Tonic is a wellness spa in Legian for aromatherapy and couple massage. Its Couples Spa Package runs 90 minutes for 750K IDR, and you book on the spa''s own site.';
-- expect: UPDATE 1

-- 163. W-tonic-kuta-legian-best_for · tonic-kuta-legian · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'tonic-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples booking a treatment together';
-- expect: UPDATE 1

-- 164. W-tsune-japanese-restaurant-sanur-by-wonderspace-why_its_here · tsune-japanese-restaurant-sanur-by-wonderspace · why_its_here · restore before
update venues set why_its_here = 'Japanese restaurant in Sanur with Indonesia''s first floating sushi: plates travel to the table along a waterway. A Japanese fish grill runs alongside. Live music on Saturday evenings, and 10% off lunch every day.' where slug = 'tsune-japanese-restaurant-sanur-by-wonderspace' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Japanese restaurant in Sanur with floating sushi: plates travel to the table along a waterway. A Japanese fish grill runs alongside. Live music on Saturday evenings, and 10% off lunch every day.';
-- expect: UPDATE 1

-- 165. W-ubud-bodyworks-centre-ubud-why_its_here · ubud-bodyworks-centre-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published list covers Deep Tissue. Booking is by WhatsApp.' where slug = 'ubud-bodyworks-centre-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ubud Bodyworks Centre takes WhatsApp bookings for deep tissue massage at its wellness spa.';
-- expect: UPDATE 1

-- 166. W-ubud-bodyworks-centre-ubud-best_for · ubud-bodyworks-centre-ubud · best_for · restore before
update venues set best_for = 'Deep tissue booked the same day.' where slug = 'ubud-bodyworks-centre-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A deep tissue massage, booked over WhatsApp';
-- expect: UPDATE 1

-- 167. W-ubud-bodyworks-centre-ubud-not_for · ubud-bodyworks-centre-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 750K IDR.' where slug = 'ubud-bodyworks-centre-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone keeping massage costs low, since the list starts at 750K IDR';
-- expect: UPDATE 1

-- 168. W-ubud-fitness-center-best_for · ubud-fitness-center · best_for · restore before
update venues set best_for = 'Ubud stayers who want a straightforward gym rather than a hotel fitness room.' where slug = 'ubud-fitness-center' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Anyone staying in Ubud who wants a plain gym, not a hotel fitness room';
-- expect: UPDATE 1

-- 169. W-ubud-yoga-centre-why_its_here · ubud-yoga-centre · why_its_here · restore before
update venues set why_its_here = 'A contemporary two-tier complex on the edge of Nyuh Kuning, best known as Ubud''s dedicated hot-yoga studio, with a gong centre, kids centre and cafe.' where slug = 'ubud-yoga-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A hot-yoga studio in a contemporary two-tier complex on the edge of Nyuh Kuning. The complex also has a gong centre, a kids centre and a cafe.';
-- expect: UPDATE 1

-- 170. W-ubud-yoga-centre-best_for · ubud-yoga-centre · best_for · restore before
update venues set best_for = 'Practitioners specifically after a heated practice (Bikram/hot Ashtanga) and families wanting a kids programme.' where slug = 'ubud-yoga-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Heated practice such as Bikram or hot Ashtanga, or a kids programme for families';
-- expect: UPDATE 1

-- 171. W-ubud-yoga-centre-not_for · ubud-yoga-centre · not_for · restore before
update venues set not_for = 'Anyone who dislikes heat or prefers gentle, cool-room classes.' where slug = 'ubud-yoga-centre' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone who dislikes heat or wants gentle, cool-room classes, since this is a hot-yoga studio';
-- expect: UPDATE 1

-- 172. W-urban-seaside-restaurant-and-bar-why_its_here · urban-seaside-restaurant-and-bar · why_its_here · restore before
update venues set why_its_here = 'Urban Seaside is a beachfront restaurant on Jalan Segara Samuh in Nusa Dua. Its menu combines daily fresh catch, international comfort dishes and Asian-influenced flavours. It opens daily from 08:00 to 23:00.' where slug = 'urban-seaside-restaurant-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Urban Seaside is a beachfront restaurant on Jalan Segara Samuh in Nusa Dua, open daily from 08:00 to 23:00. The menu runs from the daily fresh catch to international comfort dishes and Asian-influenced flavours.';
-- expect: UPDATE 1

-- 173. W-urban-seaside-restaurant-and-bar-best_for · urban-seaside-restaurant-and-bar · best_for · restore before
update venues set best_for = 'A casual beachfront lunch or dinner in Nusa Dua.' where slug = 'urban-seaside-restaurant-and-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A casual beachfront lunch or dinner in Nusa Dua';
-- expect: UPDATE 1

-- 174. W-urban-seaside-restaurant-and-bar-not_for · urban-seaside-restaurant-and-bar · not_for · restore before
update venues set not_for = 'A tightly timed day when travelling to Nusa Dua would add a long detour.' where slug = 'urban-seaside-restaurant-and-bar' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A tight day elsewhere on the island, if getting to Nusa Dua means a long detour';
-- expect: UPDATE 1

-- 175. W-usadha-spa-kuta-legian-why_its_here · usadha-spa-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Spa in Legian. The published list covers Balinese Massage. Booking is on the venue''s own site.' where slug = 'usadha-spa-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Usadha Spa in Legian takes bookings on its website for Balinese massage.';
-- expect: UPDATE 1

-- 176. W-usadha-spa-kuta-legian-best_for · usadha-spa-kuta-legian · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'usadha-spa-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage in Legian, booked online';
-- expect: UPDATE 1

-- 177. W-warung-bu-mi-why_its_here · warung-bu-mi · why_its_here · restore before
update venues set why_its_here = 'Warung Bu Mi serves Indonesian home-style food in Batu Bolong. Its official profile states that all food is halal and lists service from 09:00 to 22:00.' where slug = 'warung-bu-mi' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A warung in Batu Bolong serving Indonesian home-style food. Its official profile lists service from 09:00 to 22:00 and says all the food is halal.';
-- expect: UPDATE 1

-- 178. W-warung-bu-mi-best_for · warung-bu-mi · best_for · restore before
update venues set best_for = 'An Indonesian home-style meal in Batu Bolong.' where slug = 'warung-bu-mi' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An Indonesian home-style meal in Batu Bolong';
-- expect: UPDATE 1

-- 179. W-warung-bu-mi-not_for · warung-bu-mi · not_for · restore before
update venues set not_for = 'A formal multi-course dinner or a special-occasion restaurant setting.' where slug = 'warung-bu-mi' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A formal multi-course dinner: this is a home-style warung';
-- expect: UPDATE 1

-- 180. W-warung-jawa-bu-sri-why_its_here · warung-jawa-bu-sri · why_its_here · restore before
update venues set why_its_here = 'A small family-run Javanese-Balinese warung serving home-style nasi campur at lunch. Semi-indoor with street views; open roughly 10am–5pm, closed Sundays.' where slug = 'warung-jawa-bu-sri' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A small family-run warung cooking Javanese-Balinese home-style nasi campur for lunch. It is semi-indoor with street views, open roughly 10am–5pm and closed on Sundays.';
-- expect: UPDATE 1

-- 181. W-warung-jawa-bu-sri-best_for · warung-jawa-bu-sri · best_for · restore before
update venues set best_for = 'home-style Javanese nasi campur; a midday lunch; vegetarians (plentiful veg options); travellers near Padang Linjong or Echo Beach wanting an unfussy local plate' where slug = 'warung-jawa-bu-sri' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An unfussy nasi campur lunch near Padang Linjong or Echo Beach, with plenty of veg options';
-- expect: UPDATE 1

-- 182. W-warung-jawa-bu-sri-not_for · warung-jawa-bu-sri · not_for · restore before
update venues set not_for = 'dinner or Sunday diners (lunch-only, closed Sundays); large groups wanting lots of table space' where slug = 'warung-jawa-bu-sri' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Dinner, a Sunday, or a large group that needs table space — it is a small lunch-only warung, closed on Sundays';
-- expect: UPDATE 1

-- 183. W-warung-varuna-why_its_here · warung-varuna · why_its_here · restore before
update venues set why_its_here = 'Buffet-style Indonesian warung with 30-plus dishes in a glass case; you build a plate of rice, proteins and vegetables at low prices. Open daily 8am–10pm.' where slug = 'warung-varuna' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A buffet-style Indonesian warung with 30-plus dishes in a glass case. You build a plate of rice, proteins and vegetables at low prices, any day from 8am to 10pm.';
-- expect: UPDATE 1

-- 184. W-warung-varuna-best_for · warung-varuna · best_for · restore before
update venues set best_for = 'budget eaters near Batu Bolong beach; vegetarians and mixed groups who want to see and pick dishes; big-plate value seekers' where slug = 'warung-varuna' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Budget eaters near Batu Bolong beach, and vegetarian or mixed groups who like to see the dishes before they pick';
-- expect: UPDATE 1

-- 185. W-warung-varuna-not_for · warung-varuna · not_for · restore before
update venues set not_for = 'diners who want food cooked hot-to-order rather than from a display' where slug = 'warung-varuna' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Diners who want food cooked hot to order rather than served from a display';
-- expect: UPDATE 1

-- 186. W-warung-yess-why_its_here · warung-yess · why_its_here · restore before
update venues set why_its_here = 'A long-running Pererenan nasi campur warung with indoor and garden seating, known locally for its sambal matah. You pick from a daily fresh display to build a mixed-rice plate.' where slug = 'warung-yess' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A nasi campur warung in Pererenan with indoor and garden seating. You build a mixed-rice plate from the day''s fresh display, and the warung has its own sambal matah.';
-- expect: UPDATE 1

-- 187. W-warung-yess-best_for · warung-yess · best_for · restore before
update venues set best_for = 'nasi campur and sambal matah lovers; a sit-down garden lunch; Pererenan-side stays; groups wanting greenery over a roadside stall' where slug = 'warung-yess' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sit-down garden lunch of nasi campur and sambal matah, for anyone staying on the Pererenan side';
-- expect: UPDATE 1

-- 188. W-warung-yess-not_for · warung-yess · not_for · restore before
update venues set not_for = 'diners after Western dishes or a bar/nightlife setting' where slug = 'warung-yess' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Western dishes or a night out at a bar: this is a nasi campur warung';
-- expect: UPDATE 1

-- 189. W-watercress-berawa-best_for · watercress-berawa · best_for · restore before
update venues set best_for = 'Travellers choosing an easy breakfast or brunch in Berawa.' where slug = 'watercress-berawa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An easy breakfast or brunch in Berawa';
-- expect: UPDATE 1

-- 190. W-wild-vegan-why_its_here · wild-vegan · why_its_here · restore before
update venues set why_its_here = 'A 100% vegan restaurant with medicinal-plant and whole-food positioning in central Ubud.' where slug = 'wild-vegan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A 100% vegan restaurant in central Ubud, cooking with whole foods and medicinal plants.';
-- expect: UPDATE 1

-- 191. W-wild-vegan-best_for · wild-vegan · best_for · restore before
update venues set best_for = 'Vegan and wellness-focused travellers.' where slug = 'wild-vegan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Vegans, and anyone eating for wellness';
-- expect: UPDATE 1

-- 192. W-wild-vegan-not_for · wild-vegan · not_for · restore before
update venues set not_for = 'Anyone looking for meat or alcohol-led dining.' where slug = 'wild-vegan' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Meat (everything here is vegan), or a meal built around alcohol';
-- expect: UPDATE 1

-- 193. W-zahra-spa-nusa-dua-nusa-dua-why_its_here · zahra-spa-nusa-dua-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Spa in Nusa Dua. The published list covers Neck & Shoulder, Balinese Massage and Aromatherapy. Balinese Massage is 375K IDR. Booking is on the venue''s own site.' where slug = 'zahra-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Zahra Spa in Nusa Dua does neck and shoulder treatments, aromatherapy and Balinese massage, which costs 375K IDR. Bookings are made on the spa''s website.';
-- expect: UPDATE 1

-- 194. W-zahra-spa-nusa-dua-nusa-dua-best_for · zahra-spa-nusa-dua-nusa-dua · best_for · restore before
update venues set best_for = 'Neck & shoulder booked the same day.' where slug = 'zahra-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A neck and shoulder treatment, or a Balinese massage for 375K IDR';
-- expect: UPDATE 1

-- 195. W-zando-fight-camp-uluwatu-why_its_here · zando-fight-camp-uluwatu · why_its_here · restore before
update venues set why_its_here = 'Muay Thai gym in Ungasan. Group and private sessions, technique for beginners through advanced, pad work and conditioning. A drop-in is 150,000 IDR and a month 1,600,000.' where slug = 'zando-fight-camp-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Zando Fight Camp is a Muay Thai gym in Ungasan running group and private sessions, from beginner technique to advanced, with pad work and conditioning. A drop-in costs 150,000 IDR and a month 1,600,000.';
-- expect: UPDATE 1
