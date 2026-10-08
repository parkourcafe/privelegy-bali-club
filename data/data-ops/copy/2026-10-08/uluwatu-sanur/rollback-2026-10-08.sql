-- wave-uluwatu-sanur-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-360-move-uluwatu-why_its_here · 360-move-uluwatu · why_its_here · restore before
update venues set why_its_here = 'A community-focused gym and training centre on Jalan Pantai Suluban in Pecatu with two levels of equipment and an outdoor workout area. It is known for its wide class timetable spanning strength and conditioning, Hot Pilates, spin, HIIT, Muay Thai and BJJ.' where slug = '360-move-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A community-minded gym and training centre in Pecatu, on Jalan Pantai Suluban, with two levels of equipment and an outdoor workout area. Classes cover a lot of ground: strength and conditioning, Hot Pilates, spin, HIIT, Muay Thai and BJJ.';
-- expect: UPDATE 1

-- 2. W-360-move-uluwatu-best_for · 360-move-uluwatu · best_for · restore before
update venues set best_for = 'Travellers who want variety in one place, from open-gym sessions to group classes across many disciplines.' where slug = '360-move-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Training that mixes open-gym sessions with group classes across many disciplines, in one place';
-- expect: UPDATE 1

-- 3. W-ami-studio-why_its_here · ami-studio · why_its_here · restore before
update venues set why_its_here = 'A boutique reformer Pilates studio in Uluwatu with an ocean-view space, running reformer Pilates, mat Pilates and barre classes with a focus on strength, balance and controlled movement.' where slug = 'ami-studio' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Reformer and mat Pilates, plus barre, in an ocean-view studio in Uluwatu. Classes run in small groups and focus on strength, balance and controlled movement.';
-- expect: UPDATE 1

-- 4. W-ami-studio-best_for · ami-studio · best_for · restore before
update venues set best_for = 'Those seeking a calm, small-group boutique studio for reformer and barre.' where slug = 'ami-studio' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm reformer or barre class in a boutique studio';
-- expect: UPDATE 1

-- 5. W-andaz-bali-fitness-centre-why_its_here · andaz-bali-fitness-centre · why_its_here · restore before
update venues set why_its_here = 'Andaz Bali in Sanur has no gym of its own. Guests train at the Shankha Spa fitness centre in the adjoining Hyatt Regency, reached through a side entrance linking the two resorts and open 24 hours. The floor runs to about 2,000 sq ft of Precor cardio and strength machines, with a yoga studio, sauna, steam and hydrotherapy pools in the same complex. Free sunrise yoga runs on the beach.' where slug = 'andaz-bali-fitness-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Andaz Bali in Sanur has no gym of its own, so its guests train next door at the Hyatt Regency. The Shankha Spa fitness centre there is open 24 hours, with about 2,000 sq ft of Precor machines. Free sunrise yoga runs on the beach.';
-- expect: UPDATE 1

-- 6. W-andaz-bali-fitness-centre-best_for · andaz-bali-fitness-centre · best_for · restore before
update venues set best_for = 'Andaz guests who want a full 24-hour gym and are happy to walk next door for it.' where slug = 'andaz-bali-fitness-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Andaz guests who want a full 24-hour gym and are happy to walk next door through the side entrance';
-- expect: UPDATE 1

-- 7. W-aroma-spa-retreat-sanur-why_its_here · aroma-spa-retreat-sanur · why_its_here · restore before
update venues set why_its_here = 'A long-standing garden day spa in Sanur offering Balinese massage and treatments in a quiet retreat setting.' where slug = 'aroma-spa-retreat-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A day spa in a Sanur garden, with Balinese massage and other treatments. The setting is quiet and the pace unhurried.';
-- expect: UPDATE 1

-- 8. W-aroma-spa-retreat-sanur-best_for · aroma-spa-retreat-sanur · best_for · restore before
update venues set best_for = 'Sanur stayers wanting an unhurried, good-value massage.' where slug = 'aroma-spa-retreat-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage when you''re based in Sanur';
-- expect: UPDATE 1

-- 9. W-babi-guling-odah-sanur-why_its_here · babi-guling-odah-sanur · why_its_here · restore before
update venues set why_its_here = 'A dedicated Balinese roast-pork warung near Pasar Sindhu offering an unusually wide babi guling range, finished with its house sambal tabia (chili, roasted shrimp paste, lime).' where slug = 'babi-guling-odah-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Balinese roast-pork warung near Pasar Sindhu, with an unusually wide babi guling range. Plates are finished with the house sambal tabia: chili, roasted shrimp paste and lime.';
-- expect: UPDATE 1

-- 10. W-babi-guling-odah-sanur-best_for · babi-guling-odah-sanur · best_for · restore before
update venues set best_for = 'babi guling specialists and pork lovers; a quick, cheap, authentically Balinese lunch; solo diners' where slug = 'babi-guling-odah-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A quick, cheap Balinese lunch for pork lovers and babi guling specialists, solo diners included';
-- expect: UPDATE 1

-- 11. W-babi-guling-odah-sanur-not_for · babi-guling-odah-sanur · not_for · restore before
update venues set not_for = 'vegetarians, non-pork and halal diets; travellers wanting a broad or Western menu' where slug = 'babi-guling-odah-sanur' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Vegetarian, halal and no-pork diets, or anyone wanting a broad or Western menu: this is a babi guling warung';
-- expect: UPDATE 1

-- 12. W-bali-barber-sanur-sanur-why_its_here · bali-barber-sanur-sanur · why_its_here · restore before
update venues set why_its_here = 'The Sanur branch of the Bali Barber brand (established 2012), a men''s barbershop on Jl. Danau Tamblingan for cuts, classic hot-towel shaves, beard work and dreadlocks, co-located with The Shampoo Lounge and skilled with all international hair types.' where slug = 'bali-barber-sanur-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Barber''s Sanur shop on Jl. Danau Tamblingan, part of a men''s barbershop brand founded in 2012. Cuts, classic hot-towel shaves, beard work and dreadlocks, for all international hair types. It shares the space with The Shampoo Lounge.';
-- expect: UPDATE 1

-- 13. W-bali-barber-sanur-sanur-best_for · bali-barber-sanur-sanur · best_for · restore before
update venues set best_for = 'Male travellers wanting a proper barber cut, shave or beard trim in a relaxed shop where you can grab a coffee, beer or cocktail while you wait.' where slug = 'bali-barber-sanur-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Men who want a barber cut or a shave with a coffee, beer or cocktail while they wait';
-- expect: UPDATE 1

-- 14. W-balique-restaurant-why_its_here · balique-restaurant · why_its_here · restore before
update venues set why_its_here = 'A roadside cafe-restaurant on Jalan Raya Uluwatu in the Jimbaran fishing village, opened in 2012 by Belgian design-and-restaurateur couple Blaise Samoy and Zohra Boukhari, in a vintage-European-meets-colonial interior full of antiques the pair collected across the archipelago; the menu is Indonesian-led, with a multi-dish rijsttafel as the signature spread, rounded out by European and fusion plates.' where slug = 'balique-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Belgian couple Blaise Samoy and Zohra Boukhari opened this roadside cafe-restaurant in Jimbaran''s fishing village in 2012. Antiques they collected across the archipelago fill a vintage European and colonial interior. The menu is mostly Indonesian, with a multi-dish rijsttafel, plus European and fusion plates.';
-- expect: UPDATE 1

-- 15. W-balique-restaurant-best_for · balique-restaurant · best_for · restore before
update venues set best_for = 'A relaxed, atmospheric lunch or dinner for travellers who want Indonesian home-style cooking and characterful décor away from the beachfront.' where slug = 'balique-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A lunch or dinner of Indonesian home-style cooking, away from the beachfront';
-- expect: UPDATE 1

-- 16. W-bambu-fitness-bali-why_its_here · bambu-fitness-bali · why_its_here · restore before
update venues set why_its_here = 'A large open-plan gym in the Pecatu/Bingin area with bamboo architecture, equipped with Rogue and Eleiko gear across zones for Olympic weightlifting, functional fitness and cardio. It is known for group classes including CrossFit and Hyrox, plus an on-site cafe and a sauna-and-cold-plunge recovery area.' where slug = 'bambu-fitness-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A large open-plan bamboo gym in the Pecatu and Bingin area. Rogue and Eleiko gear fills zones for Olympic weightlifting, functional fitness and cardio. Group classes include CrossFit and Hyrox, and the site has a cafe plus a sauna and cold plunge for recovery.';
-- expect: UPDATE 1

-- 17. W-bambu-fitness-bali-best_for · bambu-fitness-bali · best_for · restore before
update venues set best_for = 'Serious lifters and CrossFit or Hyrox fans who want a full-featured strength gym with a social atmosphere.' where slug = 'bambu-fitness-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Lifters and CrossFit or Hyrox fans who want a full-featured strength gym with a social feel';
-- expect: UPDATE 1

-- 18. W-banana-lounge-bali-uluwatu-bukit-why_its_here · banana-lounge-bali-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Beach club in the Bukit. Relax & Unwind With Us in a beautifully designed tropical setting offering lounges and sunbeds, tasty food offerings, and impressive beverages. Booking is on the venue''s own site.' where slug = 'banana-lounge-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A beach club on the Bukit with lounges and sunbeds in a tropical setting. Food and drinks are served, and you book on the venue''s own website.';
-- expect: UPDATE 1

-- 19. W-banana-lounge-bali-uluwatu-bukit-best_for · banana-lounge-bali-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A day of sun loungers, pool and drinks by the beach.' where slug = 'banana-lounge-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A day of sun loungers, pool and drinks by the beach';
-- expect: UPDATE 1

-- 20. W-bella-cucina-why_its_here · bella-cucina · why_its_here · restore before
update venues set why_its_here = 'The Italian fine-dining restaurant at the InterContinental Bali Resort in Jimbaran, serving handmade pastas and Mediterranean-inflected mains from an open kitchen in an air-conditioned, chandelier-lit room, with a Sunday brunch featuring live music.' where slug = 'bella-cucina' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Italian fine dining at the InterContinental Bali Resort in Jimbaran. Handmade pastas and Mediterranean-leaning mains come from an open kitchen into an air-conditioned room lit by chandeliers. Sunday brunch has live music.';
-- expect: UPDATE 1

-- 21. W-bella-cucina-best_for · bella-cucina · best_for · restore before
update venues set best_for = 'A dressed-up dinner or leisurely Sunday brunch for couples and families wanting composed Italian cooking in a resort setting.' where slug = 'bella-cucina' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples and families dressing up for dinner, or taking their time over Sunday brunch';
-- expect: UPDATE 1

-- 22. W-bluvana-reformer-studio-why_its_here · bluvana-reformer-studio · why_its_here · restore before
update venues set why_its_here = 'Reformer studio on Jl. Pantai Cemongkak in Pecatu. Six reformers per class and eight signature 50-minute formats, each aimed at a zone or an energy level. Morning and evening sessions run daily, booked online.' where slug = 'bluvana-reformer-studio' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Classes at this reformer studio on Jl. Pantai Cemongkak in Pecatu are capped at six reformers. There are eight 50-minute formats, each aimed at a zone or an energy level. Sessions run daily, morning and evening, and you book online.';
-- expect: UPDATE 1

-- 23. W-d-nailbar-spa-uluwatu-why_its_here · d-nailbar-spa-uluwatu · why_its_here · restore before
update venues set why_its_here = 'A boutique nail bar on Jl. Labuansait near Padang Padang, offering gel, BIAB, extensions and nail art alongside lash and brow work — often described as one of the first dedicated nail bars in the Uluwatu area.' where slug = 'd-nailbar-spa-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Near Padang Padang, on Jl. Labuansait, this nail bar does gel, BIAB, extensions and nail art. Lash and brow work is done here too, and it fills up, so book ahead on WhatsApp.';
-- expect: UPDATE 1

-- 24. W-d-nailbar-spa-uluwatu-best_for · d-nailbar-spa-uluwatu · best_for · restore before
update venues set best_for = 'Travellers near Padang Padang or Uluwatu town who want a gel manicure or nail art; book ahead via WhatsApp as it fills up.' where slug = 'd-nailbar-spa-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A gel manicure or nail art when you''re near Padang Padang or Uluwatu town';
-- expect: UPDATE 1

-- 25. W-fisherman-s-club-best_for · fisherman-s-club · best_for · restore before
update venues set best_for = 'Travellers looking for a seafood meal beside Sanur beach.' where slug = 'fisherman-s-club' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A seafood meal beside Sanur beach';
-- expect: UPDATE 1

-- 26. W-fitness-plus-why_its_here · fitness-plus · why_its_here · restore before
update venues set why_its_here = 'The first 24-hour gym in Sanur, on Bypass Ngurah Rai. Modern equipment, locker rooms and a sauna. Group classes and personal training with local trainers.' where slug = 'fitness-plus' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Open 24 hours, this Sanur gym on Bypass Ngurah Rai has modern equipment, locker rooms and a sauna. Local trainers run group classes and personal training.';
-- expect: UPDATE 1

-- 27. W-fitness-plus-best_for · fitness-plus · best_for · restore before
update venues set best_for = 'A workout at an hour nothing else is open' where slug = 'fitness-plus' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A workout at any hour, day or night';
-- expect: UPDATE 1

-- 28. W-garuda-wisnu-kencana-why_its_here · garuda-wisnu-kencana · why_its_here · restore before
update venues set why_its_here = 'A cultural park in Ungasan, Badung, built around a giant bronze Vishnu-and-Garuda statue — one of the tallest statues in the world — with an amphitheatre and event spaces on the grounds.' where slug = 'garuda-wisnu-kencana' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A cultural park in Ungasan, Badung, built around a giant bronze statue of Vishnu and Garuda. The grounds also hold an amphitheatre and event spaces.';
-- expect: UPDATE 1

-- 29. W-garuda-wisnu-kencana-best_for · garuda-wisnu-kencana · best_for · restore before
update venues set best_for = 'seeing the GWK statue up close; combining with a Bukit-peninsula day out' where slug = 'garuda-wisnu-kencana' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Seeing the GWK statue up close, as part of a day out on the Bukit peninsula';
-- expect: UPDATE 1

-- 30. W-genius-cafe-why_its_here · genius-cafe · why_its_here · restore before
update venues set why_its_here = 'Beachfront cafe and co-working space on Mertasari Beach in south Sanur, with fast Wi-Fi, an all-day plant-forward menu, and toes-in-the-sand seating without a beach-club minimum. Open daily 7am–10pm.' where slug = 'genius-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A beachfront cafe and co-working space at Mertasari Beach in south Sanur, open daily 7am–10pm. The Wi-Fi is fast, the menu is plant-forward all day, and you can sit with your toes in the sand without a beach-club minimum spend.';
-- expect: UPDATE 1

-- 31. W-genius-cafe-best_for · genius-cafe · best_for · restore before
update venues set best_for = 'remote workers and long-stay visitors wanting a laptop-friendly beach cafe; healthy/plant-based eaters; relaxed daytime coffee or smoothie by the sand' where slug = 'genius-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A laptop day by the sand for remote workers, or a daytime coffee or smoothie for plant-based eaters';
-- expect: UPDATE 1

-- 32. W-genius-cafe-not_for · genius-cafe · not_for · restore before
update venues set not_for = 'anyone after a formal sit-down dinner or a traditional local warung' where slug = 'genius-cafe' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A formal dinner or a traditional warung meal: it''s a beach cafe with a plant-forward menu';
-- expect: UPDATE 1

-- 33. W-glo-day-spa-salon-sanur-sanur-why_its_here · glo-day-spa-salon-sanur-sanur · why_its_here · restore before
update venues set why_its_here = 'An Australian-owned, Western-style one-stop salon and day spa on Sanur''s main strip, part of the Glo group (Canggu, Seminyak, Echo Beach, Lembongan) known for hair, nails, bridal and massage under one roof.' where slug = 'glo-day-spa-salon-sanur-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Australian-owned salon and day spa on Sanur''s main strip. It belongs to the Glo group, which also has branches in Canggu, Seminyak, Echo Beach and Lembongan. It does hair and nails as well as bridal work and massage, all under one roof.';
-- expect: UPDATE 1

-- 34. W-glo-day-spa-salon-sanur-sanur-best_for · glo-day-spa-salon-sanur-sanur · best_for · restore before
update venues set best_for = 'Travellers who want familiar Western salon standards in one visit — a haircut, mani-pedi, waxing or brow work alongside a relaxing massage; brides and bridal parties prepping for an event.' where slug = 'glo-day-spa-salon-sanur-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A haircut, mani-pedi, waxing or brow work with a massage in one Western-style visit, or a bridal party getting ready for the day';
-- expect: UPDATE 1

-- 35. W-glo-day-spa-salon-sanur-sanur-not_for · glo-day-spa-salon-sanur-sanur · not_for · restore before
update venues set not_for = 'Anyone after a traditional Balinese temple-style spa ritual rather than a modern salon experience.' where slug = 'glo-day-spa-salon-sanur-sanur' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A temple-style Balinese spa ritual, because this is a modern salon';
-- expect: UPDATE 1

-- 36. W-gong-restaurant-why_its_here · gong-restaurant · why_its_here · restore before
update venues set why_its_here = 'Signature Indonesian and Balinese restaurant of Kayumanis Sanur (Jl. Tirta Akasa No. 28), offering an intimate resort setting focused on traditional dishes. Open daily 7am–10pm.' where slug = 'gong-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kayumanis Sanur''s Indonesian and Balinese restaurant, on Jl. Tirta Akasa No. 28, open daily 7am–10pm. The resort setting is intimate and the menu centres on traditional dishes.';
-- expect: UPDATE 1

-- 37. W-gong-restaurant-best_for · gong-restaurant · best_for · restore before
update venues set best_for = 'couples and small parties wanting a stylish traditional-Balinese dinner; a special evening centred on local cuisine' where slug = 'gong-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A special evening of traditional Balinese food for a couple or a small party';
-- expect: UPDATE 1

-- 38. W-gong-restaurant-not_for · gong-restaurant · not_for · restore before
update venues set not_for = 'a quick casual bite or a large, loud group' where slug = 'gong-restaurant' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick casual bite or a large, loud group. It is an intimate resort restaurant';
-- expect: UPDATE 1

-- 39. W-good-hair-day-sanur-why_its_here · good-hair-day-sanur · why_its_here · restore before
update venues set why_its_here = 'A Sanur hair salon known for cuts and colour by English-speaking stylists.' where slug = 'good-hair-day-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At this hair salon on the Sanur strip, the stylists speak English and do cuts and colour.';
-- expect: UPDATE 1

-- 40. W-good-hair-day-sanur-best_for · good-hair-day-sanur · best_for · restore before
update venues set best_for = 'Visitors wanting a dependable haircut along the Sanur strip.' where slug = 'good-hair-day-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A haircut along the Sanur strip without a language barrier';
-- expect: UPDATE 1

-- 41. W-holiday-inn-bali-sanur-gym-why_its_here · holiday-inn-bali-sanur-gym · why_its_here · restore before
update venues set why_its_here = 'The gym at Holiday Inn Bali Sanur, on the second floor and open 24 hours to hotel guests only. It is a small room: an upright bike, dumbbells, yoga mats and trainer balls. Guests describe it as basic but adequate for keeping a routine going.' where slug = 'holiday-inn-bali-sanur-gym' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Holiday Inn Bali Sanur keeps a small gym on its second floor, open 24 hours to hotel guests only. Inside there''s an upright bike, dumbbells, yoga mats and trainer balls.';
-- expect: UPDATE 1

-- 42. W-holiday-inn-bali-sanur-gym-best_for · holiday-inn-bali-sanur-gym · best_for · restore before
update venues set best_for = 'Hotel guests who need to keep a light routine ticking over, not a full training session.' where slug = 'holiday-inn-bali-sanur-gym' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Hotel guests keeping a light routine ticking over';
-- expect: UPDATE 1

-- 43. W-holiday-inn-bali-sanur-gym-not_for · holiday-inn-bali-sanur-gym · not_for · restore NULL
update venues set not_for = null where slug = 'holiday-inn-bali-sanur-gym' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full training session, because the gym is a small room';
-- expect: UPDATE 1

-- 44. W-island-grooming-barbershop-why_its_here · island-grooming-barbershop · why_its_here · restore before
update venues set why_its_here = 'A men''s barbershop with locations on Jl. Labuansait in Pecatu and on Jl. Pantai Bingin, focused on precision cuts, fades and grooming — widely cited as one of Uluwatu''s most established barbershops.' where slug = 'island-grooming-barbershop' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A men''s barbershop for precision cuts, fades and grooming, with shops on Jl. Labuansait in Pecatu and on Jl. Pantai Bingin.';
-- expect: UPDATE 1

-- 45. W-island-grooming-barbershop-best_for · island-grooming-barbershop · best_for · restore before
update venues set best_for = 'Men wanting a reliable haircut, fade or beard trim near either Uluwatu town or Bingin beach.' where slug = 'island-grooming-barbershop' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A haircut, fade or beard trim near Uluwatu town or Bingin beach';
-- expect: UPDATE 1

-- 46. W-karma-spa-at-karma-kandara-why_its_here · karma-spa-at-karma-kandara · why_its_here · restore before
update venues set why_its_here = 'A clifftop resort spa at Karma Kandara in Ungasan with a sauna and saltwater pool, offering massages, facials and wellness-focused treatments high above the ocean. It is known for its dramatic cliff setting and biohacking-style options.' where slug = 'karma-spa-at-karma-kandara' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Karma Kandara''s clifftop spa in Ungasan, high above the ocean, with a sauna and a saltwater pool. Treatments run from massages and facials to biohacking-style options.';
-- expect: UPDATE 1

-- 47. W-karma-spa-at-karma-kandara-best_for · karma-spa-at-karma-kandara · best_for · restore before
update venues set best_for = 'Those wanting a full spa-day escape with cliff views and access to sauna and pool facilities.' where slug = 'karma-spa-at-karma-kandara' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A full spa day with cliff views and use of the sauna and pool';
-- expect: UPDATE 1

-- 48. W-ko-japanese-teppanyaki-and-sushi-why_its_here · ko-japanese-teppanyaki-and-sushi · why_its_here · restore before
update venues set why_its_here = 'The Japanese restaurant at the InterContinental Bali Resort in Jimbaran, headed by chef Mitsuaki Senoo, serving teppanyaki grilled at open counters alongside a sushi and sashimi bar, with a private tatami room and a Balinese-Japanese interior.' where slug = 'ko-japanese-teppanyaki-and-sushi' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Chef Mitsuaki Senoo runs the Japanese restaurant at the InterContinental Bali Resort in Jimbaran. Teppanyaki is grilled at open counters, there''s a sushi and sashimi bar, and a private tatami room sits inside a Balinese-Japanese interior.';
-- expect: UPDATE 1

-- 49. W-ko-japanese-teppanyaki-and-sushi-best_for · ko-japanese-teppanyaki-and-sushi · best_for · restore before
update venues set best_for = 'Couples or groups wanting an interactive teppanyaki dinner or fresh sushi in a polished resort setting.' where slug = 'ko-japanese-teppanyaki-and-sushi' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple or a group sharing a teppanyaki dinner at the counter, or sushi from the bar';
-- expect: UPDATE 1

-- 50. W-koa-shala-sanur-why_its_here · koa-shala-sanur · why_its_here · restore before
update venues set why_its_here = 'A boutique yoga shala and holistic wellness centre in a tropical garden off Jl. Danau Tamblingan, running three daily open-air yoga classes plus meditation in a peaceful courtyard sanctuary.' where slug = 'koa-shala-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A yoga shala and holistic wellness centre in a tropical garden off Jl. Danau Tamblingan. Three open-air yoga classes run every day, plus meditation in the courtyard.';
-- expect: UPDATE 1

-- 51. W-koa-shala-sanur-best_for · koa-shala-sanur · best_for · restore before
update venues set best_for = 'Travellers based in central Sanur who want daily drop-in yoga in a calm garden, ideal for a morning practice before exploring the coast.' where slug = 'koa-shala-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A morning drop-in class in a calm garden, before exploring the coast from central Sanur';
-- expect: UPDATE 1

-- 52. W-koa-shala-spa-sanur-why_its_here · koa-shala-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'The spa side of Koa Shala, a boutique garden wellness centre down a banana-palm-lined lane off Jl. Danau Tamblingan, offering Balinese and holistic massage in a quiet courtyard sanctuary.' where slug = 'koa-shala-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Koa Shala''s spa does Balinese and holistic massage in a quiet courtyard. It sits down a banana-palm-lined lane off Jl. Danau Tamblingan, in central Sanur.';
-- expect: UPDATE 1

-- 53. W-koa-shala-spa-sanur-best_for · koa-shala-spa-sanur · best_for · restore before
update venues set best_for = 'Visitors staying central in Sanur who want a calm, unhurried massage in a garden setting, often paired with a yoga class at the same address.' where slug = 'koa-shala-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A calm, unhurried massage in a garden, often paired with a yoga class at the same address';
-- expect: UPDATE 1

-- 54. W-kuu-izakaya-dining-why_its_here · kuu-izakaya-dining · why_its_here · restore before
update venues set why_its_here = 'Japanese izakaya-style restaurant at Maya Sanur Resort & Spa serving sushi, sashimi, robatayaki skewers and tempura, with sake and cocktails.' where slug = 'kuu-izakaya-dining' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Japanese izakaya-style restaurant at Maya Sanur Resort & Spa. The kitchen turns out sushi, sashimi, robatayaki skewers and tempura, and there''s sake and cocktails to drink.';
-- expect: UPDATE 1

-- 55. W-kuu-izakaya-dining-best_for · kuu-izakaya-dining · best_for · restore before
update venues set best_for = 'groups sharing Japanese plates; couples wanting a stylish evening out; diners after quality sushi and grilled skewers' where slug = 'kuu-izakaya-dining' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Groups sharing Japanese plates, or a couple''s evening out over sushi and grilled skewers';
-- expect: UPDATE 1

-- 56. W-kuu-izakaya-dining-not_for · kuu-izakaya-dining · not_for · restore before
update venues set not_for = 'anyone wanting a quick, casual or budget meal' where slug = 'kuu-izakaya-dining' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quick, casual or budget meal: this is a resort restaurant';
-- expect: UPDATE 1

-- 57. W-la-tribu-why_its_here · la-tribu · why_its_here · restore before
update venues set why_its_here = 'Yoga and movement studio on Jl. Buana Sari, Pecatu, in an open-air space. Vinyasa, yin, power, kundalini and hatha, plus surf-conditioning yoga. Movement classes cover calisthenics, mobility, contemporary dance and capoeira. Classes run for adults and children, and there is a 50-hour teacher training.' where slug = 'la-tribu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Adults and children both train at this open-air yoga and movement studio on Jl. Buana Sari, Pecatu. Yoga runs from vinyasa, yin, power, kundalini and hatha to surf conditioning, and there''s a 50-hour teacher training. Movement classes cover calisthenics, mobility, contemporary dance and capoeira.';
-- expect: UPDATE 1

-- 58. W-la-tribu-bali-why_its_here · la-tribu-bali · why_its_here · restore before
update venues set why_its_here = 'A creative yoga and movement studio on Jl. Buana Sari in Pecatu, near Bingin. Alongside vinyasa, yin and mobility classes it teaches handstands, arm balances and hosts artistic workshops such as pottery and painting.' where slug = 'la-tribu-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A yoga and movement studio near Bingin, on Jl. Buana Sari in Pecatu, that also runs art workshops such as pottery and painting. It teaches handstands and arm balances as well as vinyasa, yin and mobility.';
-- expect: UPDATE 1

-- 59. W-la-tribu-bali-best_for · la-tribu-bali · best_for · restore before
update venues set best_for = 'Movement-curious practitioners who want playful classes and creative workshops.' where slug = 'la-tribu-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Playful classes for the movement-curious, with a pottery or painting workshop on the side';
-- expect: UPDATE 1

-- 60. W-leha-leha-spa-sanur-why_its_here · leha-leha-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'A relaxed neighbourhood day spa in Sanur offering massage and treatments at local prices.' where slug = 'leha-leha-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Massage and other treatments at local prices, in a neighbourhood day spa near Sanur''s beach path.';
-- expect: UPDATE 1

-- 61. W-leha-leha-spa-sanur-best_for · leha-leha-spa-sanur · best_for · restore before
update venues set best_for = 'Those wanting an easy, affordable massage near the beach path.' where slug = 'leha-leha-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An easy, affordable massage after a walk along the beach path';
-- expect: UPDATE 1

-- 62. W-lilla-pantai-why_its_here · lilla-pantai · why_its_here · restore before
update venues set why_its_here = 'A beachfront restaurant directly on the Sanur paved coastal walk (Jalan Duyung), serving Indonesian and European dishes plus seafood, cooked without MSG, with tables facing the sea. Open all day from breakfast to late evening.' where slug = 'lilla-pantai' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Tables face the sea at this beachfront restaurant on Sanur''s paved coastal walk, at Jalan Duyung. The kitchen cooks Indonesian and European dishes and seafood without MSG, from breakfast to late evening.';
-- expect: UPDATE 1

-- 63. W-lilla-pantai-best_for · lilla-pantai · best_for · restore before
update venues set best_for = 'couples and families wanting relaxed seafront tables; long-stay visitors after an easy, calm sit-down meal; anyone who wants toes-near-sand dining without a resort setting' where slug = 'lilla-pantai' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, families and long-stay visitors who want an easy seafront meal without a resort setting';
-- expect: UPDATE 1

-- 64. W-lilla-pantai-not_for · lilla-pantai · not_for · restore before
update venues set not_for = 'anyone needing a quiet indoor space to work' where slug = 'lilla-pantai' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet indoor space to work, because the tables face the sea on the coastal walk';
-- expect: UPDATE 1

-- 65. W-linga-longa-bar-why_its_here · linga-longa-bar · why_its_here · restore before
update venues set why_its_here = 'A long-running live-music bar with bands nightly across rock, pop and Top 40 — the main sets from around 8:30pm, with late rock sessions running past midnight — plus a Babi Guling (suckling pig) buffet on set days (Wednesdays and Sundays).' where slug = 'linga-longa-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A live-music bar with bands every night, playing rock, pop and Top 40. The main sets start around 8:30pm, late rock sessions run past midnight, and a babi guling (suckling pig) buffet goes on Wednesdays and Sundays.';
-- expect: UPDATE 1

-- 66. W-linga-longa-bar-best_for · linga-longa-bar · best_for · restore before
update venues set best_for = 'night out with live music and drinks; groups who want to sing along and stay late' where slug = 'linga-longa-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A night out with live music and drinks, for a group that wants to sing along and stay late';
-- expect: UPDATE 1

-- 67. W-linga-longa-bar-not_for · linga-longa-bar · not_for · restore before
update venues set not_for = 'anyone after a quiet dinner or an early night' where slug = 'linga-longa-bar' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet dinner or an early night — the bands play every night and the rock runs past midnight';
-- expect: UPDATE 1

-- 68. W-mantra-wellness-why_its_here · mantra-wellness · why_its_here · restore before
update venues set why_its_here = 'Wellness centre a short walk from Padang Padang beach. Movement in yoga and pilates, recovery in a sauna, cold plunge and mandala pool, plus a healthy cafe and coworking. Rooms on site are adults-only.' where slug = 'mantra-wellness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A short walk from Padang Padang beach, this wellness centre pairs yoga and pilates with a sauna, cold plunge and mandala pool for recovery. There''s a healthy cafe and coworking too, and the rooms on site are adults-only.';
-- expect: UPDATE 1

-- 69. W-mantra-wellness-not_for · mantra-wellness · not_for · restore NULL
update venues set not_for = null where slug = 'mantra-wellness' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A family stay: the rooms on site are adults-only';
-- expect: UPDATE 1

-- 70. W-marramba-fitness-why_its_here · marramba-fitness · why_its_here · restore before
update venues set why_its_here = 'Old-school bodybuilding gym in Renon, close to Sanur. The owner is a former professional bodybuilding champion. A full set of iron, personal training and clean showers. Upstairs there is a karate section for young people.' where slug = 'marramba-fitness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Old-school bodybuilding gym in Renon, close to Sanur. A full set of iron, personal training and clean showers. Upstairs there is a karate section for young people.';
-- expect: UPDATE 1

-- 71. W-martha-tilaar-salon-day-spa-sanur-why_its_here · martha-tilaar-salon-day-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'The Sanur outlet of Martha Tilaar, offering the Indonesian brand''s signature herbal spa rituals plus hair, nails and beauty basics.' where slug = 'martha-tilaar-salon-day-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Martha Tilaar''s Sanur branch, where the Indonesian brand does its herbal spa rituals, plus hair, nails and beauty basics.';
-- expect: UPDATE 1

-- 72. W-martha-tilaar-salon-day-spa-sanur-best_for · martha-tilaar-salon-day-spa-sanur · best_for · restore before
update venues set best_for = 'Visitors wanting authentic Indonesian spa rituals from a trusted local brand.' where slug = 'martha-tilaar-salon-day-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Herbal spa rituals from a local Indonesian brand, with hair or nails in the same visit';
-- expect: UPDATE 1

-- 73. W-maya-sanur-spa-sanur-why_its_here · maya-sanur-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'The beachfront spa at Maya Sanur Resort & Spa, a garden sanctuary of six private double suites offering traditional massage, body scrubs and facials from certified therapists.' where slug = 'maya-sanur-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Maya Sanur Resort & Spa''s beachfront spa has six private double suites in a garden. Certified therapists do traditional massage, body scrubs and facials.';
-- expect: UPDATE 1

-- 74. W-maya-sanur-spa-sanur-best_for · maya-sanur-spa-sanur · best_for · restore before
update venues set best_for = 'Couples and travellers wanting a polished resort-spa treatment by the beach; guests looking to combine a massage with a facial in a serene, upscale setting.' where slug = 'maya-sanur-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples after a polished resort-spa treatment by the beach, or a massage and facial together';
-- expect: UPDATE 1

-- 75. W-maya-sanur-yoga-studio-why_its_here · maya-sanur-yoga-studio · why_its_here · restore before
update venues set why_its_here = 'The yoga studio at Maya Sanur Resort & Spa, air-conditioned and contemporary, with several complimentary programmes for in-house guests: free style, restorative, aqua yoga and sun salutation, pitched at all levels of flexibility. Daily sessions also run at the beachfront plaza and the rooftop garden.' where slug = 'maya-sanur-yoga-studio' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An air-conditioned, contemporary yoga studio at Maya Sanur Resort & Spa, free for in-house guests at any level. Programmes run from free style and restorative to aqua yoga and sun salutation, with daily sessions also on the beachfront plaza and the rooftop garden.';
-- expect: UPDATE 1

-- 76. W-maya-sanur-yoga-studio-best_for · maya-sanur-yoga-studio · best_for · restore before
update venues set best_for = 'Sanur guests who want a free daily class and a choice between an air-conditioned room, the beach plaza or the roof.' where slug = 'maya-sanur-yoga-studio' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort guests who want a free daily class, indoors in the cool or out on the plaza or roof';
-- expect: UPDATE 1

-- 77. W-mona-lisa-cafe-why_its_here · mona-lisa-cafe · why_its_here · restore before
update venues set why_its_here = 'Long-running casual cafe on Jl. Danau Tamblingan serving Indonesian staples alongside international dishes, with vegetarian, vegan and halal options.' where slug = 'mona-lisa-cafe' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Indonesian staples and international dishes at a casual cafe on Jl. Danau Tamblingan, with vegetarian, vegan and halal options.';
-- expect: UPDATE 1

-- 78. W-mona-lisa-cafe-best_for · mona-lisa-cafe · best_for · restore before
update venues set best_for = 'families and long-stay visitors wanting an easy all-rounder; travellers after familiar Indonesian dishes in a relaxed setting' where slug = 'mona-lisa-cafe' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families and long-stay visitors who want an easy all-rounder with familiar Indonesian dishes';
-- expect: UPDATE 1

-- 79. W-mona-lisa-cafe-not_for · mona-lisa-cafe · not_for · restore before
update venues set not_for = 'anyone seeking a special-occasion or fine-dining evening' where slug = 'mona-lisa-cafe' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A special occasion or fine dining, because this is a casual cafe';
-- expect: UPDATE 1

-- 80. W-morning-light-yoga-why_its_here · morning-light-yoga · why_its_here · restore before
update venues set why_its_here = 'A small independent yoga studio on the Bukit running scheduled classes -- a low-key alternative to Uluwatu''s larger retreat centres.' where slug = 'morning-light-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A small independent yoga studio on the Bukit that runs scheduled classes. It''s a low-key alternative to Uluwatu''s larger retreat centres.';
-- expect: UPDATE 1

-- 81. W-morning-light-yoga-studio-why_its_here · morning-light-yoga-studio · why_its_here · restore before
update venues set why_its_here = 'An open-air, reclaimed-teak shala at Uluwatu Surf Villas on the clifftop above Balangan and the Uluwatu coastline. It runs a single daily morning class (a different style each day) known for its ocean views and a complimentary coconut afterwards at the Mana cafe.' where slug = 'morning-light-yoga-studio' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An open-air shala of reclaimed teak at Uluwatu Surf Villas, on the clifftop above Balangan and the Uluwatu coastline. There is one morning class a day, each day in a different style, with a free coconut afterwards at the Mana cafe.';
-- expect: UPDATE 1

-- 82. W-morning-light-yoga-studio-best_for · morning-light-yoga-studio · best_for · restore before
update venues set best_for = 'Travellers wanting one scenic sunrise clifftop class rather than a full studio timetable.' where slug = 'morning-light-yoga-studio' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A scenic sunrise class on the clifftop, with ocean views';
-- expect: UPDATE 1

-- 83. W-morning-light-yoga-studio-not_for · morning-light-yoga-studio · not_for · restore NULL
update venues set not_for = null where slug = 'morning-light-yoga-studio' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full studio timetable: there is one class a day';
-- expect: UPDATE 1

-- 84. W-nelayan-restaurant-and-puri-bar-why_its_here · nelayan-restaurant-and-puri-bar · why_its_here · restore before
update venues set why_its_here = 'The open-air beachfront restaurant and bar at Belmond Jimbaran Puri, set directly on the sand of Jimbaran Bay, serving grilled seafood and Mediterranean dishes with Indonesian spices and French technique; Puri Bar pours tropical cocktails and local arak with feet-in-the-sand views west across the bay at sunset.' where slug = 'nelayan-restaurant-and-puri-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Belmond Jimbaran Puri''s open-air restaurant and bar sit right on the sand of Jimbaran Bay. Nelayan grills seafood and cooks Mediterranean dishes with Indonesian spices and French technique. At Puri Bar, tropical cocktails and local arak come with the sunset across the bay.';
-- expect: UPDATE 1

-- 85. W-nelayan-restaurant-and-puri-bar-best_for · nelayan-restaurant-and-puri-bar · best_for · restore before
update venues set best_for = 'A sunset cocktail or unhurried seafood dinner on the beach for couples and resort guests wanting a calmer alternative to Jimbaran''s crowded grill row.' where slug = 'nelayan-restaurant-and-puri-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples and resort guests after a sunset cocktail or an unhurried seafood dinner, calmer than Jimbaran''s crowded grill row';
-- expect: UPDATE 1

-- 86. W-oranje-bar-why_its_here · oranje-bar · why_its_here · restore before
update venues set why_its_here = 'Small, cosy Dutch-run bar a short walk from Sindhu beach, good for a relaxed beer and snacks; known for Dutch bar food.' where slug = 'oranje-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A small Dutch-run bar a short walk from Sindhu beach, pouring beer and serving Dutch bar food and snacks.';
-- expect: UPDATE 1

-- 87. W-oranje-bar-best_for · oranje-bar · best_for · restore before
update venues set best_for = 'a casual beer and snacks after the beach; couples or solo travellers wanting a low-key spot' where slug = 'oranje-bar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A low-key beer and snacks after the beach, alone or as a couple';
-- expect: UPDATE 1

-- 88. W-oranje-bar-not_for · oranje-bar · not_for · restore before
update venues set not_for = 'large groups after a full sit-down dinner' where slug = 'oranje-bar' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A large group after a full sit-down dinner. It''s a small bar with snacks';
-- expect: UPDATE 1

-- 89. W-ours-bali-uluwatu-bukit-why_its_here · ours-bali-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Bar in the Bukit. The 4–6 PM window at Ours Bali is well-known for discounted cocktails and wines served in a celebrated all-day restaurant with a warm, open atmosphere. Happy hour: 4–6 PM Daily. Booking is on the venue''s own site.' where slug = 'ours-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ours Bali is an all-day restaurant and bar on the Bukit. Happy hour runs 4–6pm daily, with discounted cocktails and wines, and you book on the venue''s own website.';
-- expect: UPDATE 1

-- 90. W-ours-bali-uluwatu-bukit-best_for · ours-bali-uluwatu-bukit · best_for · restore before
update venues set best_for = 'An evening out for drinks, not a full sit-down meal.' where slug = 'ours-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Discounted cocktails and wine at happy hour';
-- expect: UPDATE 1

-- 91. W-ours-spa-boutique-why_its_here · ours-spa-boutique · why_its_here · restore before
update venues set why_its_here = 'A neighbourhood day spa on Jalan Labuan Sait known for Dermalogica facials, nails, hair and massage, with a sister cafe next door. It works largely with vegan and cruelty-free product lines.' where slug = 'ours-spa-boutique' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Dermalogica facials, nails, hair and massage at a neighbourhood day spa on Jalan Labuan Sait, with a sister cafe next door. It works largely with vegan and cruelty-free product lines.';
-- expect: UPDATE 1

-- 92. W-ours-spa-boutique-best_for · ours-spa-boutique · best_for · restore before
update venues set best_for = 'Travellers wanting facials, nails and beauty services alongside massage without leaving the Uluwatu strip.' where slug = 'ours-spa-boutique' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Facials, nails and beauty services with a massage, without leaving the Uluwatu strip';
-- expect: UPDATE 1

-- 93. W-piccolina-why_its_here · piccolina · why_its_here · restore before
update venues set why_its_here = 'A hair-first salon on Jl. Labuansait offering precision cuts, colour, keratin and blow-dries to European standards, with manicures and massage available; the space doubles as a small wine bottle shop.' where slug = 'piccolina' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Hair comes first at this salon on Jl. Labuansait: precision cuts, colour, keratin and blow-dries to European standards. Manicures and massage are available too, and the space doubles as a small wine bottle shop.';
-- expect: UPDATE 1

-- 94. W-piccolina-best_for · piccolina · best_for · restore before
update venues set best_for = 'Those after an expert cut or colour for men or women, with an easygoing wine-bar atmosphere.' where slug = 'piccolina' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An expert cut or colour for men or women';
-- expect: UPDATE 1

-- 95. W-power-of-now-oasis-sanur-why_its_here · power-of-now-oasis-sanur · why_its_here · restore before
update venues set why_its_here = 'A Yoga Alliance-accredited yoga and retreat centre established in 2010 in a striking 100% bamboo beachfront shala on Sanur''s Mertasari beach, running daily classes, teacher trainings and holistic treatments, with an organic cafe on site.' where slug = 'power-of-now-oasis-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A yoga and retreat centre in a beachfront shala made of 100% bamboo, on Mertasari beach in south Sanur. Open since 2010 and accredited by Yoga Alliance, it runs daily classes, teacher trainings and holistic treatments, with an organic cafe on site.';
-- expect: UPDATE 1

-- 96. W-power-of-now-oasis-sanur-best_for · power-of-now-oasis-sanur · best_for · restore before
update venues set best_for = 'Yoga travellers in south Sanur who want daily beachfront classes in an eco bamboo studio, or a deeper 200-hour teacher training or retreat.' where slug = 'power-of-now-oasis-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Daily classes on the beach in a bamboo studio, or a 200-hour teacher training or retreat';
-- expect: UPDATE 1

-- 97. W-puri-santrian-spa-sanur-why_its_here · puri-santrian-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'The spa at Puri Santrian, a long-standing family-owned beach resort in south Sanur, with nine double treatment rooms offering Balinese massage, aromatherapy, reflexology and facials using Phytomer and Sothys products.' where slug = 'puri-santrian-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The spa at Puri Santrian, a family-owned beach resort in south Sanur, has nine double treatment rooms. The menu covers Balinese massage, aromatherapy, reflexology and facials, using Phytomer and Sothys products.';
-- expect: UPDATE 1

-- 98. W-puri-santrian-spa-sanur-best_for · puri-santrian-spa-sanur · best_for · restore before
update venues set best_for = 'Travellers staying in south Sanur who want a full menu of classic and modern treatments in a beachfront resort; those pairing a massage with the resort''s morning beach yoga.' where slug = 'puri-santrian-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Classic or modern treatments at a beachfront resort, or a massage paired with its morning beach yoga';
-- expect: UPDATE 1

-- 99. W-puri-santrian-yoga-wellness-why_its_here · puri-santrian-yoga-wellness · why_its_here · restore before
update venues set why_its_here = 'A complimentary morning yoga class on the beach at Puri Santrian in south Sanur, open to in-house guests and led by the resort''s resident yoga master, built around gentle stretching and breathing. The property has a fitness suite, bicycles, and a spa with nine double treatment rooms using fresh fruit, herbs and plant material alongside Sothys Paris products.' where slug = 'puri-santrian-yoga-wellness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Puri Santrian''s resident yoga master leads a free morning beach class of gentle stretching and breathing for in-house guests. The south Sanur resort also has a fitness suite and bicycles. Its spa uses fresh fruit, herbs and plant material alongside Sothys products.';
-- expect: UPDATE 1

-- 100. W-puri-santrian-yoga-wellness-best_for · puri-santrian-yoga-wellness · best_for · restore before
update venues set best_for = 'Sanur guests who want an unhurried free beach class in the morning rather than a studio workout.' where slug = 'puri-santrian-yoga-wellness' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort guests who want an unhurried free class on the beach in the morning';
-- expect: UPDATE 1

-- 101. W-puri-santrian-yoga-wellness-not_for · puri-santrian-yoga-wellness · not_for · restore NULL
update venues set not_for = null where slug = 'puri-santrian-yoga-wellness' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A studio workout, since the class is gentle stretching and breathing on the beach';
-- expect: UPDATE 1

-- 102. W-raw-gym-uluwatu-why_its_here · raw-gym-uluwatu · why_its_here · restore before
update venues set why_its_here = 'An open-air, warehouse-style gym on Jalan Raya Uluwatu with a boxing ring and dedicated martial-arts space. It is known for Muay Thai, boxing and BJJ coaching alongside strength training, with membership valid across Raw Gym''s other Bali locations.' where slug = 'raw-gym-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Raw Gym''s Uluwatu branch is an open-air warehouse-style gym with a boxing ring and a martial-arts space, on Jalan Raya Uluwatu. Coaches teach Muay Thai, boxing and BJJ alongside strength training, and membership is valid at the other Bali locations too.';
-- expect: UPDATE 1

-- 103. W-raw-gym-uluwatu-best_for · raw-gym-uluwatu · best_for · restore before
update venues set best_for = 'People focused on combat sports and no-frills, high-intensity training.' where slug = 'raw-gym-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Combat sports, or no-frills high-intensity training';
-- expect: UPDATE 1

-- 104. W-reform-pilates-bali-why_its_here · reform-pilates-bali · why_its_here · restore before
update venues set why_its_here = 'A reformer Pilates studio that opened in Bingin in 2023 and later added a larger flagship near Suluban Beach with twelve reformers and a rooftop cafe. It is known for daily group reformer classes, private sessions and duets, with class packs usable across both locations.' where slug = 'reform-pilates-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A reformer Pilates studio that opened in Bingin in 2023, then added a larger flagship near Suluban Beach with twelve reformers and a rooftop cafe. Group reformer classes run daily, alongside private sessions and duets, and class packs work at both locations.';
-- expect: UPDATE 1

-- 105. W-reform-pilates-bali-best_for · reform-pilates-bali · best_for · restore before
update venues set best_for = 'Reformer Pilates regulars who want daily group classes or 1:1 sessions.' where slug = 'reform-pilates-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reformer Pilates regulars who want daily group classes or 1:1 sessions';
-- expect: UPDATE 1

-- 106. W-rose-petal-why_its_here · rose-petal · why_its_here · restore before
update venues set why_its_here = 'A full beauty centre on Jl. Labuansait bringing hair, facials, lashes, brows, nails and body treatments under one roof, with a lounge and sunset terrace; its colourists are trained in European and Asian techniques including balayage and lived-in colour.' where slug = 'rose-petal' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Hair, facials, lashes, brows, nails and body treatments under one roof, at a beauty centre on Jl. Labuansait with a lounge and a sunset terrace. Its colourists are trained in European and Asian techniques such as balayage and lived-in colour.';
-- expect: UPDATE 1

-- 107. W-rose-petal-best_for · rose-petal · best_for · restore before
update venues set best_for = 'Someone wanting hair colour or a fuller beauty day in an upmarket setting with a lounge to linger in.' where slug = 'rose-petal' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Hair colour or a fuller beauty day somewhere upmarket, with a lounge to linger in';
-- expect: UPDATE 1

-- 108. W-sala-bistro-why_its_here · sala-bistro · why_its_here · restore before
update venues set why_its_here = 'Modern bistro and specialty-coffee spot on Jl. Danau Tamblingan serving western-Asian comfort food, with distinct brunch and dinner menus.' where slug = 'sala-bistro' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Specialty coffee and western-Asian comfort food at a modern bistro on Jl. Danau Tamblingan, with separate brunch and dinner menus.';
-- expect: UPDATE 1

-- 109. W-sala-bistro-best_for · sala-bistro · best_for · restore before
update venues set best_for = 'brunch and coffee sessions; casual laptop-friendly daytime stops; travellers wanting comfort food in a relaxed setting' where slug = 'sala-bistro' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Brunch and coffee, or a casual daytime stop with a laptop';
-- expect: UPDATE 1

-- 110. W-sala-bistro-not_for · sala-bistro · not_for · restore before
update venues set not_for = 'anyone after traditional Balinese or a large-group banquet' where slug = 'sala-bistro' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Traditional Balinese food or a large-group banquet. The menus are western-Asian comfort food';
-- expect: UPDATE 1

-- 111. W-segara-the-seaside-why_its_here · segara-the-seaside · why_its_here · restore before
update venues set why_its_here = 'A beachfront bar and restaurant on Sanur''s shore at Jl. Segara Ayu, serving seafood, pasta, Indonesian dishes and pizza with ocean views, beach happy hour and live music.' where slug = 'segara-the-seaside' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A beachfront bar and restaurant right on Sanur''s shore at Jl. Segara Ayu, looking out over the ocean. Seafood, pasta, Indonesian dishes and pizza are on the menu, and there''s a beach happy hour and live music.';
-- expect: UPDATE 1

-- 112. W-segara-the-seaside-best_for · segara-the-seaside · best_for · restore before
update venues set best_for = 'groups wanting beachfront tables with drinks and live music; families dining early by the sea; a relaxed seafront meal' where slug = 'segara-the-seaside' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Groups after beachfront tables with drinks and live music, or families eating early by the sea';
-- expect: UPDATE 1

-- 113. W-segara-the-seaside-not_for · segara-the-seaside · not_for · restore before
update venues set not_for = 'anyone wanting a quiet dinner with no music' where slug = 'segara-the-seaside' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet, music-free dinner — the bar runs live music and a beach happy hour';
-- expect: UPDATE 1

-- 114. W-shankha-spa-and-fitness-at-hyatt-regency-bali-why_its_here · shankha-spa-and-fitness-at-hyatt-regency-bali · why_its_here · restore before
update venues set why_its_here = 'The fitness centre inside Shankha Spa at Hyatt Regency Bali in Sanur, open 24 hours, with roughly 2,000 sq ft of Precor cardio and strength equipment and natural light over the spa lagoon. The wider complex is the largest wellness facility in Sanur: ten freestanding spa villas around a lily pond, sauna, steam, hot and cold plunge pools, a 15.5-metre outdoor lap pool, an adults-only pool and a juice bar serving kombucha and jamu.' where slug = 'shankha-spa-and-fitness-at-hyatt-regency-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The 24-hour gym inside Shankha Spa at Hyatt Regency Bali in Sanur has about 2,000 sq ft of Precor cardio and strength kit. The complex adds ten spa villas around a lily pond, sauna, steam, hot and cold plunge pools and a 15.5-metre lap pool.';
-- expect: UPDATE 1

-- 115. W-shankha-spa-and-fitness-at-hyatt-regency-bali-best_for · shankha-spa-and-fitness-at-hyatt-regency-bali · best_for · restore before
update venues set best_for = 'Sanur guests who want a serious 24-hour gym with a full hydrotherapy circuit and lap pool attached.' where slug = 'shankha-spa-and-fitness-at-hyatt-regency-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A 24-hour gym with a full hydrotherapy circuit and a lap pool attached';
-- expect: UPDATE 1

-- 116. W-shankha-spa-hyatt-regency-bali-yoga-why_its_here · shankha-spa-hyatt-regency-bali-yoga · why_its_here · restore before
update venues set why_its_here = 'The open-air yoga studio in the Fitness Pavilion at Shankha Spa, Hyatt Regency Bali in Sanur. The schedule includes a sunrise class pitched at beginners and Hatha sessions, set in the spa''s garden alongside the lap pool.' where slug = 'shankha-spa-hyatt-regency-bali-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An open-air yoga studio in the Fitness Pavilion at Shankha Spa, Hyatt Regency Bali in Sanur. It sits in the spa''s garden beside the lap pool, and the schedule has a sunrise class pitched at beginners plus Hatha sessions.';
-- expect: UPDATE 1

-- 117. W-shankha-spa-hyatt-regency-bali-yoga-best_for · shankha-spa-hyatt-regency-bali-yoga · best_for · restore before
update venues set best_for = 'Sanur guests who want an open-air sunrise class that does not assume prior experience.' where slug = 'shankha-spa-hyatt-regency-bali-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sunrise class in the open air that doesn''t assume you''ve done yoga before';
-- expect: UPDATE 1

-- 118. W-six-senses-spa-uluwatu-why_its_here · six-senses-spa-uluwatu · why_its_here · restore before
update venues set why_its_here = 'The destination spa at Six Senses Uluwatu with eight treatment rooms, a yoga pavilion, gym and wellness screening, using the Ila product line and locally inspired rituals. It is built around bespoke wellness programmes and biomarker screening.' where slug = 'six-senses-spa-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Six Senses Uluwatu''s destination spa has treatment rooms, a yoga pavilion and a gym. It uses the Ila product line and locally inspired rituals, and builds bespoke programmes around wellness and biomarker screening.';
-- expect: UPDATE 1

-- 119. W-six-senses-spa-uluwatu-best_for · six-senses-spa-uluwatu · best_for · restore before
update venues set best_for = 'Guests wanting a comprehensive wellness day with screening, yoga and treatments at a clifftop resort.' where slug = 'six-senses-spa-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A wellness day of screening, yoga and treatments at a clifftop resort';
-- expect: UPDATE 1

-- 120. W-six-senses-uluwatu-fitness-centre-why_its_here · six-senses-uluwatu-fitness-centre · why_its_here · restore before
update venues set why_its_here = 'The resort gym at Six Senses Uluwatu, open 24 hours, with cardio and weight machines alongside functional training equipment, plus outdoor fitness circuits on the clifftop grounds. It sits within a wellness area that also holds ten treatment rooms, a relaxation lounge, spa bath, sauna and steam room.' where slug = 'six-senses-uluwatu-fitness-centre' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The resort gym at Six Senses Uluwatu is open 24 hours. Cardio and weight machines join functional training kit, with outdoor circuits on the clifftop grounds. The wellness area around it holds treatment rooms, a relaxation lounge, spa bath, sauna and steam room.';
-- expect: UPDATE 1

-- 121. W-six-senses-uluwatu-fitness-centre-best_for · six-senses-uluwatu-fitness-centre · best_for · restore before
update venues set best_for = 'Guests staying on the Bukit who want a round-the-clock gym without leaving the resort.' where slug = 'six-senses-uluwatu-fitness-centre' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A round-the-clock gym without leaving the resort';
-- expect: UPDATE 1

-- 122. W-six-senses-uluwatu-yoga-pavilion-why_its_here · six-senses-uluwatu-yoga-pavilion · why_its_here · restore before
update venues set why_its_here = 'An air-conditioned yoga pavilion at Six Senses Uluwatu. The resort includes complimentary daily meditation and an intro-to-yoga session of 30 minutes each; longer 45 to 60 minute sessions such as Yoga Nidra, traditional yoga and a yogic intestinal cleanse are charged separately.' where slug = 'six-senses-uluwatu-yoga-pavilion' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An air-conditioned yoga pavilion at Six Senses Uluwatu. Daily meditation and an intro-to-yoga session, 30 minutes each, are included for resort guests. Longer 45 to 60 minute sessions, such as Yoga Nidra, traditional yoga and a yogic intestinal cleanse, cost extra.';
-- expect: UPDATE 1

-- 123. W-six-senses-uluwatu-yoga-pavilion-best_for · six-senses-uluwatu-yoga-pavilion · best_for · restore before
update venues set best_for = 'Resort guests who want a daily practice indoors, out of the Bukit heat, with both free short sessions and longer paid ones.' where slug = 'six-senses-uluwatu-yoga-pavilion' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Resort guests after a daily indoor practice out of the Bukit heat, with free short sessions and longer paid ones';
-- expect: UPDATE 1

-- 124. W-snowcat-bali-ussr-cuisine-why_its_here · snowcat-bali-ussr-cuisine · why_its_here · restore before
update venues set why_its_here = 'Post-Soviet kitchen on Jl. Raya Uluwatu in Ungasan. Herring under a fur coat, pelmeni, olivier and draniki. Large portions and homemade infusions. Delivery, dine-in and bookings.' where slug = 'snowcat-bali-ussr-cuisine' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pelmeni, olivier, draniki and herring under a fur coat come out of this post-Soviet kitchen on Jl. Raya Uluwatu in Ungasan. Portions are large, with homemade infusions to drink. It does delivery as well as dine-in and bookings.';
-- expect: UPDATE 1

-- 125. W-soul-on-the-beach-why_its_here · soul-on-the-beach · why_its_here · restore before
update venues set why_its_here = 'A beachfront restaurant on Sanur''s Sindhu Beach (next to INNA Sindhu Beach Hotel), serving Indonesian, Asian and Western food from breakfast to dinner, with a swimmable white-sand beach and views toward Mount Agung and Nusa Penida. Vegetarian and vegan options available.' where slug = 'soul-on-the-beach' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Breakfast to dinner on Sindhu Beach: this beachfront restaurant next to INNA Sindhu Beach Hotel in Sanur serves Indonesian, Asian and Western food. The white-sand beach is swimmable, and the view runs to Mount Agung and Nusa Penida. Vegetarian and vegan options are available.';
-- expect: UPDATE 1

-- 126. W-soul-on-the-beach-best_for · soul-on-the-beach · best_for · restore before
update venues set best_for = 'families and groups wanting all-day beachfront dining; a relaxed seafront breakfast or early dinner; visitors wanting a swim-and-eat spot' where slug = 'soul-on-the-beach' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Families and groups eating on the beach from breakfast to an early dinner, with a swim in between';
-- expect: UPDATE 1

-- 127. W-soul-on-the-beach-not_for · soul-on-the-beach · not_for · restore before
update venues set not_for = 'anyone wanting a formal or fine-dining setting' where slug = 'soul-on-the-beach' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A formal, fine-dining setting. This is an all-day beach restaurant';
-- expect: UPDATE 1

-- 128. W-spa-at-mu-why_its_here · spa-at-mu · why_its_here · restore before
update venues set why_its_here = 'An open-air cliffside spa at Mu Bali resort overlooking Bingin beach and the Impossibles surf break, using natural and organic oils. It is known for al fresco massages with an ocean and temple view.' where slug = 'spa-at-mu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An open-air cliffside spa at Mu Bali resort that looks over Bingin beach and the Impossibles surf break. Massages are done al fresco with natural and organic oils, facing the ocean and a temple.';
-- expect: UPDATE 1

-- 129. W-spa-at-mu-best_for · spa-at-mu · best_for · restore before
update venues set best_for = 'Couples and surfers wanting a scenic outdoor massage on the Bingin cliffs.' where slug = 'spa-at-mu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A scenic outdoor massage on the Bingin cliffs, for a couple or a surfer';
-- expect: UPDATE 1

-- 130. W-spring-spa-uluwatu-why_its_here · spring-spa-uluwatu · why_its_here · restore before
update venues set why_its_here = 'A polished day spa on Jalan Labuan Sait with treatment rooms, a Davines hair salon and mani-pedi stations, using brands such as CODAGE Paris and Davines. It was named Asia''s Best Day Spa at the 2025 World Spa Awards.' where slug = 'spring-spa-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Treatment rooms, a Davines hair salon and mani-pedi stations make up this day spa on Jalan Labuan Sait. It uses brands such as CODAGE Paris and Davines.';
-- expect: UPDATE 1

-- 131. W-spring-spa-uluwatu-best_for · spring-spa-uluwatu · best_for · restore before
update venues set best_for = 'Those wanting a reliable full-service day of massage, facials, hair and nails in central Uluwatu.' where slug = 'spring-spa-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Massage, facials, hair and nails on the same visit in central Uluwatu';
-- expect: UPDATE 1

-- 132. W-studio-fondue-why_its_here · studio-fondue · why_its_here · restore before
update venues set why_its_here = 'A boutique Pilates studio in Uluwatu offering Reformer, Mat and Barre classes in a design-led space, with drop-in classes starting from 250K IDR.' where slug = 'studio-fondue' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A design-led Pilates studio in Uluwatu that teaches Reformer, Mat and Barre classes. A drop-in class starts from 250K IDR.';
-- expect: UPDATE 1

-- 133. W-studio-fondue-best_for · studio-fondue · best_for · restore before
update venues set best_for = 'Pilates-goers wanting a stylish boutique studio for reformer or mat sessions.' where slug = 'studio-fondue' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Pilates-goers after a design-led studio for reformer or mat sessions';
-- expect: UPDATE 1

-- 134. W-sudajiva-spa-at-sudamala-sanur-sanur-why_its_here · sudajiva-spa-at-sudamala-sanur-sanur · why_its_here · restore before
update venues set why_its_here = 'Sudajiva Spa ("Water of Life") is the 572 sqm spa at Sudamala Suites & Villas Sanur, blending traditional and modern healing techniques in an intimate boutique-resort setting.' where slug = 'sudajiva-spa-at-sudamala-sanur-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sudajiva Spa ("Water of Life") is the 572 sqm spa at Sudamala Suites & Villas Sanur. It mixes traditional and modern healing techniques in an intimate boutique-resort setting.';
-- expect: UPDATE 1

-- 135. W-sudajiva-spa-at-sudamala-sanur-sanur-best_for · sudajiva-spa-at-sudamala-sanur-sanur · best_for · restore before
update venues set best_for = 'Guests and visitors wanting a signature resort spa ritual in a quiet, boutique atmosphere away from Sanur''s busier stretches.' where slug = 'sudajiva-spa-at-sudamala-sanur-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A resort spa ritual somewhere quiet, away from Sanur''s busier stretches';
-- expect: UPDATE 1

-- 136. W-sudamala-resort-sanur-wellness-yoga-sanur-why_its_here · sudamala-resort-sanur-wellness-yoga-sanur · why_its_here · restore before
update venues set why_its_here = 'The wellness and yoga programme at Sudamala Suites & Villas Sanur, centred on a garden Yoga Pavilion with instructor-led classes and evening meditation, plus longer holistic Balinese-tradition journeys (melukat purification, jamu and boreh workshops).' where slug = 'sudamala-resort-sanur-wellness-yoga-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sudamala Suites & Villas Sanur runs its wellness and yoga programme from a garden Yoga Pavilion, with instructor-led classes and evening meditation. Longer holistic journeys in the Balinese tradition include melukat purification and jamu and boreh workshops.';
-- expect: UPDATE 1

-- 137. W-sudamala-resort-sanur-wellness-yoga-sanur-best_for · sudamala-resort-sanur-wellness-yoga-sanur · best_for · restore before
update venues set best_for = 'Resort guests and wellness-minded visitors wanting gentle garden yoga, meditation, or a full-day holistic Balinese wellness journey in a boutique setting.' where slug = 'sudamala-resort-sanur-wellness-yoga-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Gentle garden yoga and meditation, or a full-day holistic Balinese wellness journey';
-- expect: UPDATE 1

-- 138. W-supreme-indian-restaurant-why_its_here · supreme-indian-restaurant · why_its_here · restore before
update venues set why_its_here = 'A North and South Indian restaurant and bar on Jl. Raya Uluwatu in Ungasan, with an air-conditioned dining room and a broad vegetarian and vegan menu alongside tandoor dishes and curries.' where slug = 'supreme-indian-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'North and South Indian cooking on Jl. Raya Uluwatu in Ungasan, in an air-conditioned dining room with a bar. Tandoor dishes and curries share the menu with a broad vegetarian and vegan list.';
-- expect: UPDATE 1

-- 139. W-supreme-indian-restaurant-best_for · supreme-indian-restaurant · best_for · restore before
update venues set best_for = 'A comfortable, well-spiced Indian sit-down dinner in Uluwatu, including for vegetarians.' where slug = 'supreme-indian-restaurant' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A comfortable sit-down Indian dinner in Uluwatu, vegetarians included';
-- expect: UPDATE 1

-- 140. W-svaha-spa-bingin-why_its_here · svaha-spa-bingin · why_its_here · restore before
update venues set why_its_here = 'A cliffside day spa above Bingin with ocean views and a sustainable, holistic focus, offering Balinese massage, scrubs and jacuzzi rituals. It is widely reviewed as one of the best-value ocean-view spas on the Bukit.' where slug = 'svaha-spa-bingin' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A cliffside day spa above Bingin with ocean views, doing Balinese massage, scrubs and jacuzzi rituals. Its focus is sustainable and holistic.';
-- expect: UPDATE 1

-- 141. W-svaha-spa-bingin-best_for · svaha-spa-bingin · best_for · restore before
update venues set best_for = 'Surfers and beach-day travellers wanting a well-priced ocean-view treatment near Bingin and Impossibles.' where slug = 'svaha-spa-bingin' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An ocean-view treatment near Bingin and Impossibles, after a surf or a day on the beach';
-- expect: UPDATE 1

-- 142. W-taru-pramana-spa-sanur-why_its_here · taru-pramana-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'The day spa at The Meru Sanur, open to non-guests with 24-hour advance booking, offering Balinese massage, singing-bowl treatments and longer ritual packages. Daily 9am to 9pm.' where slug = 'taru-pramana-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Meru Sanur''s day spa takes non-guests if they book 24 hours ahead, and it''s open daily from 9am to 9pm. Treatments include Balinese massage, singing-bowl sessions and longer ritual packages.';
-- expect: UPDATE 1

-- 143. W-taru-pramana-spa-sanur-best_for · taru-pramana-spa-sanur · best_for · restore before
update venues set best_for = 'A booked spa ritual or massage in Sanur, including signature and Swissline facial options.' where slug = 'taru-pramana-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A booked spa ritual or massage in Sanur, with Swissline facials among the options';
-- expect: UPDATE 1

-- 144. W-terrace-sanur-the-1o1-bali-oasis-sanur-why_its_here · terrace-sanur-the-1o1-bali-oasis-sanur · why_its_here · restore before
update venues set why_its_here = 'Terrace Sanur is the dining outlet at THE 1O1 Bali Oasis Sanur on Jalan Danau Tamblingan. The hotel setting is organised around a lagoon-style pool and landscaped grounds.' where slug = 'terrace-sanur-the-1o1-bali-oasis-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Terrace Sanur is the restaurant of THE 1O1 hotel on Jalan Danau Tamblingan. The hotel is laid out around a lagoon-style pool and landscaped grounds.';
-- expect: UPDATE 1

-- 145. W-terrace-sanur-the-1o1-bali-oasis-sanur-best_for · terrace-sanur-the-1o1-bali-oasis-sanur · best_for · restore before
update venues set best_for = 'A hotel meal during a stay in central Sanur.' where slug = 'terrace-sanur-the-1o1-bali-oasis-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A hotel meal during a stay in central Sanur';
-- expect: UPDATE 1

-- 146. W-terrace-sanur-the-1o1-bali-oasis-sanur-not_for · terrace-sanur-the-1o1-bali-oasis-sanur · not_for · restore before
update venues set not_for = 'Travellers without a Sanur stop or diners seeking an independent street-side venue.' where slug = 'terrace-sanur-the-1o1-bali-oasis-sanur' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An independent street-side venue, or a meal when you''re not staying in Sanur: this is a hotel restaurant';
-- expect: UPDATE 1

-- 147. W-the-asa-maia-why_its_here · the-asa-maia · why_its_here · restore before
update venues set why_its_here = 'An adults-only wellness retreat in Uluwatu with a small spa, contrast therapy, infrared sauna and cold and hot plunge pools, using local and natural products. Its signature massage and tailored wellness approach are frequently praised.' where slug = 'the-asa-maia' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An adults-only wellness retreat in Uluwatu with a small spa, contrast therapy, an infrared sauna and hot and cold plunge pools. It uses local and natural products.';
-- expect: UPDATE 1

-- 148. W-the-asa-maia-best_for · the-asa-maia · best_for · restore before
update venues set best_for = 'Wellness-minded travellers wanting contrast therapy, yoga and a signature massage in one visit.' where slug = 'the-asa-maia' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Contrast therapy, yoga and a massage in one visit';
-- expect: UPDATE 1

-- 149. W-the-asa-maia-fitness-why_its_here · the-asa-maia-fitness · why_its_here · restore before
update venues set why_its_here = 'The gym at The Asa Maia, a family-owned adults-only wellness retreat in Uluwatu opened in 2021. It sits in the central pavilion and is fitted with a treadmill, power rack, barbell, kettlebells, dumbbells, slam balls, a stepper, a TRX system and a Pilates Cadillac. An infrared sauna is on site.' where slug = 'the-asa-maia-fitness' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Asa Maia, a family-owned adults-only wellness retreat in Uluwatu opened in 2021, has its gym in the central pavilion. The kit: treadmill, power rack, barbell, kettlebells, dumbbells, slam balls, a stepper, a TRX system and a Pilates Cadillac. An infrared sauna is on site.';
-- expect: UPDATE 1

-- 150. W-the-asa-maia-fitness-best_for · the-asa-maia-fitness · best_for · restore before
update venues set best_for = 'Retreat guests who want real strength equipment rather than a token hotel gym, within a structured wellness stay.' where slug = 'the-asa-maia-fitness' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Strength training with real equipment during a structured wellness stay';
-- expect: UPDATE 1

-- 151. W-the-asa-maia-pilates-best_for · the-asa-maia-pilates · best_for · restore before
update venues set best_for = 'Retreat guests who want daily pilates as part of a structured programme, including reformer-style work on the Cadillac.' where slug = 'the-asa-maia-pilates' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Retreat guests who want daily pilates as part of a structured programme, including work on the Cadillac';
-- expect: UPDATE 1

-- 152. W-the-asa-maia-yoga-why_its_here · the-asa-maia-yoga · why_its_here · restore before
update venues set why_its_here = 'Daily yoga at The Asa Maia, held in a shala on the top level of the central pavilion. Instructors run Hatha, Yin and Vinyasa classes and adapt them to each guest''s level. SOMA breathwork is the retreat''s signature practice, with Indonesian martial arts and Qi Gong also on the programme.' where slug = 'the-asa-maia-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Daily yoga at The Asa Maia, in a shala on the top level of the central pavilion. Instructors teach Hatha, Yin and Vinyasa, adapted to each guest''s level. SOMA breathwork is the retreat''s own practice; Indonesian martial arts and Qi Gong are also taught.';
-- expect: UPDATE 1

-- 153. W-the-asa-maia-yoga-best_for · the-asa-maia-yoga · best_for · restore before
update venues set best_for = 'Guests on a wellness stay in Uluwatu who want daily guided practice matched to their level rather than a fixed drop-in schedule.' where slug = 'the-asa-maia-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Daily guided practice matched to your level, during a wellness stay in Uluwatu';
-- expect: UPDATE 1

-- 154. W-the-asa-maia-yoga-not_for · the-asa-maia-yoga · not_for · restore NULL
update venues set not_for = null where slug = 'the-asa-maia-yoga' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A drop-in class on a fixed schedule: practice here is guided and matched to each guest''s level';
-- expect: UPDATE 1

-- 155. W-the-bvlgari-spa-why_its_here · the-bvlgari-spa · why_its_here · restore before
update venues set why_its_here = 'The spa at Bvlgari Resort Bali, set in a reconstructed antique Javanese joglo on the Uluwatu cliff about 150m above the sea, with eight whirlpool treatment rooms. It is known for its Royal Lulur couples ritual and beachside treatment option.' where slug = 'the-bvlgari-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bvlgari Resort Bali''s spa occupies a reconstructed antique Javanese joglo on the Uluwatu cliff, about 150m above the sea, with eight whirlpool treatment rooms. The Royal Lulur couples ritual is on the menu, and treatments can also be done by the beach.';
-- expect: UPDATE 1

-- 156. W-the-bvlgari-spa-best_for · the-bvlgari-spa · best_for · restore before
update venues set best_for = 'Luxury travellers wanting a signature high-end ritual with cliff or beach settings.' where slug = 'the-bvlgari-spa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Luxury travellers after a high-end ritual on the cliff or by the beach';
-- expect: UPDATE 1

-- 157. W-the-istana-wellness-club-best_for · the-istana-wellness-club · best_for · restore before
update venues set best_for = 'Visitors on the Bukit who want cryotherapy and sauna-based recovery alongside a serious meditation programme, with month-long membership rather than a hotel day pass.' where slug = 'the-istana-wellness-club' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Cryotherapy and sauna-based recovery with a meditation programme, on the Bukit';
-- expect: UPDATE 1

-- 158. W-the-istana-wellness-club-not_for · the-istana-wellness-club · not_for · restore NULL
update venues set not_for = null where slug = 'the-istana-wellness-club' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A one-off day pass, because membership runs in one-month blocks';
-- expect: UPDATE 1

-- 159. W-the-istana-yoga-why_its_here · the-istana-yoga · why_its_here · restore before
update venues set why_its_here = 'The yoga programme at The Istana on the Uluwatu cliffs, with around 20 class formats including Vinyasa, Qigong, Rebirthing Breathwork and Yoga Nidra, taught by internationally trained instructors. Teacher training runs in 200- and 300-hour formats. Drop-in classes start from 150,000 IDR, and Sunday sessions are donation-based.' where slug = 'the-istana-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Istana''s yoga programme on the Uluwatu cliffs has around 20 class formats, from Vinyasa and Qigong to Rebirthing Breathwork and Yoga Nidra. Instructors are internationally trained, teacher training runs in 200- and 300-hour formats, and drop-ins start from 150,000 IDR.';
-- expect: UPDATE 1

-- 160. W-the-istana-yoga-best_for · the-istana-yoga · best_for · restore before
update venues set best_for = 'Practitioners on the Bukit who want breadth of styles and a route into teacher training, with a donation-based Sunday class as a low-cost way in.' where slug = 'the-istana-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A wide range of styles and a route into teacher training, with the donation-based Sunday class as a low-cost way in';
-- expect: UPDATE 1

-- 161. W-the-space-bali-why_its_here · the-space-bali · why_its_here · restore before
update venues set why_its_here = 'A community hub in the Bingin/Uluwatu area with two upstairs bamboo shalas over a downstairs coworking cafe. It offers a broad daily schedule of vinyasa, yin, mobility and surf-mobility classes plus teacher trainings.' where slug = 'the-space-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A community hub in the Bingin and Uluwatu area with two bamboo shalas upstairs and a coworking cafe downstairs. The daily schedule is broad: vinyasa, yin, mobility and surf-mobility classes, plus teacher trainings.';
-- expect: UPDATE 1

-- 162. W-the-space-bali-best_for · the-space-bali · best_for · restore before
update venues set best_for = 'Digital nomads and longer-stay travellers who want daily classes and a work-plus-yoga base.' where slug = 'the-space-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Digital nomads and longer-stay travellers who want daily classes and a base for work and yoga';
-- expect: UPDATE 1

-- 163. W-the-temple-lodge-why_its_here · the-temple-lodge · why_its_here · restore before
update venues set why_its_here = 'A long-running family-run guesthouse on the Bingin clifftop overlooking Impossibles and Bingin, geared to a balanced surf-and-yoga lifestyle. It holds daily yoga in a clifftop shala (open to outside guests) with an on-site spa and healthy restaurant.' where slug = 'the-temple-lodge' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A family-run guesthouse set up for surf and yoga, on the Bingin clifftop above Impossibles and Bingin. Its clifftop shala holds daily yoga that outside guests can join, and the spa and healthy restaurant are on site.';
-- expect: UPDATE 1

-- 164. W-the-temple-lodge-best_for · the-temple-lodge · best_for · restore before
update venues set best_for = 'Surfers and couples wanting relaxed clifftop yoga tied to a laid-back stay.' where slug = 'the-temple-lodge' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Surfers and couples who want clifftop yoga built into their stay';
-- expect: UPDATE 1

-- 165. W-the-yoga-rescue-why_its_here · the-yoga-rescue · why_its_here · restore before
update venues set why_its_here = 'A quiet garden studio set between Ungasan and Jimbaran in the wider Uluwatu area, away from the busier clifftop crowds. It runs daily Hatha, Vinyasa, Ashtanga, Yin and aerial classes plus private sessions and workshops.' where slug = 'the-yoga-rescue' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A quiet garden studio between Ungasan and Jimbaran, away from the busier clifftop crowds. Daily classes cover Hatha, Vinyasa, Ashtanga, Yin and aerial, plus private sessions and workshops.';
-- expect: UPDATE 1

-- 166. W-the-yoga-rescue-best_for · the-yoga-rescue · best_for · restore before
update venues set best_for = 'Locals and repeat visitors wanting an unpretentious daily class close to Ungasan.' where slug = 'the-yoga-rescue' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Locals and repeat visitors after an unpretentious daily class near Ungasan';
-- expect: UPDATE 1

-- 167. W-ulu-active-recovery-why_its_here · ulu-active-recovery · why_its_here · restore before
update venues set why_its_here = 'An open-air fitness and recovery centre in Uluwatu combining functional training, group classes and holistic wellness, pairing strength, HIIT, yoga, Pilates and mobility with a recovery zone of sauna, steam rooms and hot-and-cold plunge pools, plus a cafe.' where slug = 'ulu-active-recovery' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An open-air fitness and recovery centre in Uluwatu, with a cafe. The training side covers strength, HIIT, yoga, Pilates and mobility, in functional training and group classes. The recovery zone has a sauna and steam rooms as well as hot-and-cold plunge pools.';
-- expect: UPDATE 1

-- 168. W-ulu-active-recovery-best_for · ulu-active-recovery · best_for · restore before
update venues set best_for = 'Those who want to combine training with structured recovery in one visit.' where slug = 'ulu-active-recovery' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Training and structured recovery in one visit';
-- expect: UPDATE 1

-- 169. W-ulu-yoga-bali-why_its_here · ulu-yoga-bali · why_its_here · restore before
update venues set why_its_here = 'A dedicated yoga school on Jl. Pantai Cemongkak in Pecatu, a few minutes inland from Bingin and Dreamland, in a modern air-conditioned ocean-view shala. It is best known for Yoga Alliance 200/300-hour and aerial teacher trainings alongside multi-style drop-in classes.' where slug = 'ulu-yoga-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A yoga school in a modern, air-conditioned ocean-view shala on Jl. Pantai Cemongkak in Pecatu, a few minutes inland from Bingin and Dreamland. It runs Yoga Alliance 200/300-hour and aerial teacher trainings alongside multi-style drop-in classes.';
-- expect: UPDATE 1

-- 170. W-ulu-yoga-bali-best_for · ulu-yoga-bali · best_for · restore before
update venues set best_for = 'Those pursuing teacher training or structured multi-style practice including aerial and acro.' where slug = 'ulu-yoga-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Teacher training, or structured multi-style practice that includes aerial and acro';
-- expect: UPDATE 1

-- 171. W-vela-spa-why_its_here · vela-spa · why_its_here · restore before
update venues set why_its_here = 'The intimate spa at The Ungasan Clifftop Resort, with treatment rooms overlooking the Indian Ocean and a menu of Balinese massage, scrubs and deep-tissue work. It is known for attentive resort-standard service on the Ungasan clifftop.' where slug = 'vela-spa' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An intimate spa at The Ungasan Clifftop Resort, with treatment rooms that look out over the Indian Ocean. Treatments include Balinese massage, scrubs and deep-tissue work.';
-- expect: UPDATE 1

-- 172. W-vela-spa-best_for · vela-spa · best_for · restore before
update venues set best_for = 'Couples wanting an upmarket ocean-view treatment, often paired with a Sundays Beach Club visit.' where slug = 'vela-spa' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An upmarket ocean-view treatment as a couple, often paired with a visit to Sundays Beach Club';
-- expect: UPDATE 1

-- 173. W-warung-babi-guling-sanur-bypass-why_its_here · warung-babi-guling-sanur-bypass · why_its_here · restore before
update venues set why_its_here = 'A well-known roadside Balinese babi guling warung on the Bypass, serving classic roast pork with rice and trimmings for dine-in, takeaway and delivery.' where slug = 'warung-babi-guling-sanur-bypass' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Classic Balinese roast pork with rice and trimmings, from a roadside babi guling warung on the Bypass. You can eat in, take away or order delivery.';
-- expect: UPDATE 1

-- 174. W-warung-babi-guling-sanur-bypass-best_for · warung-babi-guling-sanur-bypass · best_for · restore before
update venues set best_for = 'a fast, cheap babi guling plate; travellers passing along the Bypass; takeaway or delivery' where slug = 'warung-babi-guling-sanur-bypass' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A fast, cheap babi guling plate on the way along the Bypass, or as takeaway or delivery';
-- expect: UPDATE 1

-- 175. W-warung-babi-guling-sanur-bypass-not_for · warung-babi-guling-sanur-bypass · not_for · restore before
update venues set not_for = 'vegetarians, non-pork and halal diets; those wanting a beachside or atmospheric setting' where slug = 'warung-babi-guling-sanur-bypass' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A seat by the beach, or a vegetarian, halal or pork-free meal. It is a roadside babi guling warung';
-- expect: UPDATE 1

-- 176. W-warung-blanjong-why_its_here · warung-blanjong · why_its_here · restore before
update venues set why_its_here = 'A family-run warung open around 25 years, best known locally for its nasi campur and Balinese home cooking alongside some Indonesian and Western dishes.' where slug = 'warung-blanjong' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A family-run warung in south Sanur that has been open for around 25 years. The menu centres on nasi campur and Balinese home cooking, with some Indonesian and Western dishes too.';
-- expect: UPDATE 1

-- 177. W-warung-blanjong-best_for · warung-blanjong · best_for · restore before
update venues set best_for = 'nasi campur and Balinese home cooking in a relaxed sit-down setting; mixed groups where some want Western options; travellers in south Sanur' where slug = 'warung-blanjong' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Nasi campur and Balinese home cooking at a sit-down table, for a mixed group where some want Western options';
-- expect: UPDATE 1

-- 178. W-warung-blanjong-not_for · warung-blanjong · not_for · restore before
update venues set not_for = 'purists wanting a strictly local menu with no Western items' where slug = 'warung-blanjong' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Purists who want a strictly local menu, because some Western dishes are on it';
-- expect: UPDATE 1

-- 179. W-warung-coconut-tree-why_its_here · warung-coconut-tree · why_its_here · restore before
update venues set why_its_here = 'Long-standing Indonesian warung (since 2012) with a bohemian recycled-boat-timber interior, serving generous home-style Balinese plates; live music some evenings.' where slug = 'warung-coconut-tree' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Recycled boat timber makes up the bohemian interior of this Indonesian warung, open since 2012. The plates are generous and home-style Balinese, and there''s live music some evenings.';
-- expect: UPDATE 1

-- 180. W-warung-coconut-tree-best_for · warung-coconut-tree · best_for · restore before
update venues set best_for = 'relaxed local dinner; travellers wanting authentic Indonesian food with atmosphere' where slug = 'warung-coconut-tree' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A local dinner of Indonesian food in a bohemian room, sometimes with live music';
-- expect: UPDATE 1

-- 181. W-warung-coconut-tree-not_for · warung-coconut-tree · not_for · restore before
update venues set not_for = 'anyone wanting a quiet room on the nights live music plays' where slug = 'warung-coconut-tree' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A quiet room on the evenings when live music plays';
-- expect: UPDATE 1

-- 182. W-warung-little-bird-why_its_here · warung-little-bird · why_its_here · restore before
update venues set why_its_here = 'Laid-back, budget-friendly warung on Sanur''s main artery serving authentic Balinese and Indonesian dishes; easily walkable from the beach area.' where slug = 'warung-little-bird' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Balinese and Indonesian dishes at budget prices, in a warung on Sanur''s main road, an easy walk from the beach.';
-- expect: UPDATE 1

-- 183. W-warung-little-bird-best_for · warung-little-bird · best_for · restore before
update venues set best_for = 'cheap, relaxed local meal; long-stay travellers and solo diners' where slug = 'warung-little-bird' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cheap local meal for long-stay travellers and solo diners';
-- expect: UPDATE 1

-- 184. W-warung-little-bird-not_for · warung-little-bird · not_for · restore before
update venues set not_for = 'anyone after a formal or upscale dinner' where slug = 'warung-little-bird' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A formal or upscale dinner — this is a laid-back budget warung';
-- expect: UPDATE 1

-- 185. W-warung-makan-little-mars-why_its_here · warung-makan-little-mars · why_its_here · restore before
update venues set why_its_here = 'Small, tidy family-run warung serving Balinese, Indonesian and some Western dishes with plenty of vegetarian options, plus local coffee and fresh cocktails.' where slug = 'warung-makan-little-mars' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A small, tidy family-run warung with Balinese, Indonesian and some Western dishes, and plenty of vegetarian options. There''s local coffee and fresh cocktails to drink.';
-- expect: UPDATE 1

-- 186. W-warung-makan-little-mars-best_for · warung-makan-little-mars · best_for · restore before
update venues set best_for = 'relaxed local meal; vegetarians; travellers wanting a home-style, no-fuss dinner' where slug = 'warung-makan-little-mars' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A no-fuss, home-style dinner, with plenty for vegetarians';
-- expect: UPDATE 1

-- 187. W-warung-makan-little-mars-not_for · warung-makan-little-mars · not_for · restore before
update venues set not_for = 'large groups (it''s a very small space)' where slug = 'warung-makan-little-mars' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Large groups, because the space is small';
-- expect: UPDATE 1

-- 188. W-warung-pregina-why_its_here · warung-pregina · why_its_here · restore before
update venues set why_its_here = 'A long-running sit-down Balinese warung on the main Danau Tamblingan strip, known for home-style Balinese cooking built around duck and roast pork, in a traditional wood interior.' where slug = 'warung-pregina' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Duck and roast pork anchor the home-style Balinese cooking at this sit-down warung on the main Danau Tamblingan strip. The room is fitted out in traditional wood.';
-- expect: UPDATE 1

-- 189. W-warung-pregina-best_for · warung-pregina · best_for · restore before
update venues set best_for = 'a sit-down dinner of authentic Balinese classics; families and small groups; travellers wanting table-service rather than a hawker stall' where slug = 'warung-pregina' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sit-down dinner of Balinese classics with table service, for families and small groups';
-- expect: UPDATE 1

-- 190. W-warung-pregina-not_for · warung-pregina · not_for · restore before
update venues set not_for = 'grab-and-go or ultra-cheap street-stall budgets; diners who want a fast counter meal' where slug = 'warung-pregina' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Grab-and-go, a fast counter meal or a street-stall budget. This is a sit-down warung with table service';
-- expect: UPDATE 1

-- 191. W-white-orchid-sanur-why_its_here · white-orchid-sanur · why_its_here · restore before
update venues set why_its_here = 'Pan-Asian ("a Taste of Asia") restaurant on Jl. Danau Tamblingan No. 85, serving shareable Asian plates with live music in the evenings.' where slug = 'white-orchid-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Live music plays in the evenings at this pan-Asian restaurant on Jl. Danau Tamblingan No. 85, where the Asian plates are made for sharing.';
-- expect: UPDATE 1

-- 192. W-white-orchid-sanur-best_for · white-orchid-sanur · best_for · restore before
update venues set best_for = 'groups wanting to share a range of Asian dishes; couples and long-stay visitors after a relaxed evening with live music' where slug = 'white-orchid-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Shared Asian plates for a group, or an evening of live music as a couple';
-- expect: UPDATE 1

-- 193. W-white-orchid-sanur-not_for · white-orchid-sanur · not_for · restore before
update venues set not_for = 'anyone wanting a silent, low-key dinner on live-music nights' where slug = 'white-orchid-sanur' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A silent, low-key dinner: there''s live music in the evenings';
-- expect: UPDATE 1

-- 194. W-white-rabbit-lounge-uluwatu-bukit-why_its_here · white-rabbit-lounge-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Bar in the Bukit. White Rabbit strives to be a world-class cocktail bar in Uluwatu Bali. A place you feel like you''re drinking with friends, even when you''re here by yourself. Booking is on the venue''s own site.' where slug = 'white-rabbit-lounge-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'White Rabbit is a cocktail bar on the Bukit in Uluwatu. The bar says it wants you to feel like you''re drinking with friends, even when you come alone. Booking is on the venue''s own website.';
-- expect: UPDATE 1

-- 195. W-white-rabbit-lounge-uluwatu-bukit-best_for · white-rabbit-lounge-uluwatu-bukit · best_for · restore before
update venues set best_for = 'An evening out for drinks, not a full sit-down meal.' where slug = 'white-rabbit-lounge-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An evening of cocktails, on your own or with friends';
-- expect: UPDATE 1

-- 196. W-white-rabbit-lounge-uluwatu-bukit-not_for · white-rabbit-lounge-uluwatu-bukit · not_for · restore NULL
update venues set not_for = null where slug = 'white-rabbit-lounge-uluwatu-bukit' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A full sit-down meal, because this is a cocktail bar';
-- expect: UPDATE 1

-- 197. W-yinside-yoga-why_its_here · yinside-yoga · why_its_here · restore before
update venues set why_its_here = 'A small yin-focused studio and eco yoga shop on Jl. Pantai Bingin specialising in Yin Yoga classes, workshops, retreats and 50-hour yin teacher trainings. It also runs a boutique of locally made, plant-based yoga wear and props.' where slug = 'yinside-yoga' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Yin Yoga is the focus of this small studio on Jl. Pantai Bingin: classes, workshops, retreats and 50-hour yin teacher trainings. Its shop sells plant-based yoga wear and props, made locally.';
-- expect: UPDATE 1

-- 198. W-yinside-yoga-best_for · yinside-yoga · best_for · restore before
update venues set best_for = 'Practitioners seeking slow, restorative yin practice and sustainable yoga gear.' where slug = 'yinside-yoga' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Slow, restorative yin practice and sustainable yoga gear';
-- expect: UPDATE 1

-- 199. W-yoga-searcher-bali-why_its_here · yoga-searcher-bali · why_its_here · restore before
update venues set why_its_here = 'A yoga-focused eco-lodge on Jl. Labuan Sait near Padang Padang and Suluban, built from recycled-wood villas around a pool. It runs a daily yoga schedule with a plant-forward restaurant and spa, aimed at retreat-style stays.' where slug = 'yoga-searcher-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A yoga-centred eco-lodge with recycled-wood villas around a pool, on Jl. Labuan Sait near Padang Padang and Suluban. There''s yoga every day, a plant-forward restaurant and a spa, all set up for retreat-style stays.';
-- expect: UPDATE 1

-- 200. W-yoga-searcher-bali-best_for · yoga-searcher-bali · best_for · restore before
update venues set best_for = 'Guests wanting an all-in-one yoga retreat stay near the Suluban surf beaches.' where slug = 'yoga-searcher-bali' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An all-in-one yoga retreat stay near the Suluban surf beaches';
-- expect: UPDATE 1

-- 201. W-yoga-the-istana-why_its_here · yoga-the-istana · why_its_here · restore before
update venues set why_its_here = 'A clifftop yoga studio on Jl. Pantai Suluban with ocean views, hosting a resident yoga school and classes led by visiting teachers. It is paired with a wellness spa featuring sauna, steam and cold plunge.' where slug = 'yoga-the-istana' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A clifftop yoga studio with ocean views on Jl. Pantai Suluban, home to a resident yoga school and classes led by visiting teachers. Its wellness spa has a sauna, steam and a cold plunge.';
-- expect: UPDATE 1

-- 202. W-yoga-the-istana-best_for · yoga-the-istana · best_for · restore before
update venues set best_for = 'Travellers wanting cliff-edge classes combined with spa and cold-plunge recovery.' where slug = 'yoga-the-istana' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Cliff-edge classes combined with spa and cold-plunge recovery';
-- expect: UPDATE 1
