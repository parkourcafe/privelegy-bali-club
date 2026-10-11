-- wave-spa-4-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-sari-day-spa-sanur-why_its_here · sari-day-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'Day spa in Sanur. The published treatment list runs to 39 items — Traditional Massage, Deep Tissue and Balinese Massage. Foot Massage is 165K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'sari-day-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sari Day Spa in Sanur lists 39 treatments, with traditional massage, deep tissue and Balinese massage among them. A one-hour foot massage is 165K IDR, and you book on the spa''s own website.';
-- expect: UPDATE 1

-- 2. W-sari-day-spa-sanur-best_for · sari-day-spa-sanur · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'sari-day-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Walking all day, then a foot massage or a two-hour reset';
-- expect: UPDATE 1

-- 3. W-the-nest-beachside-spa-sanur-why_its_here · the-nest-beachside-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'Day spa in Sanur. The published treatment list runs to 36 items — Manicure, Waxing and Pedicure. Foot Reflexology is 130K IDR for 30 minutes.' where slug = 'the-nest-beachside-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Manicures, pedicures and waxing are on the 36-treatment list at The Nest Beachside Spa, a day spa in Sanur. Half an hour of foot reflexology costs 130K IDR.';
-- expect: UPDATE 1

-- 4. W-the-nest-beachside-spa-sanur-best_for · the-nest-beachside-spa-sanur · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes; tired feet after a day of walking.' where slug = 'the-nest-beachside-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Walking-weary feet, or a session of up to two and a half hours';
-- expect: UPDATE 1

-- 5. W-the-nest-boutique-spa-sanur-why_its_here · the-nest-boutique-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'Day spa in Sanur. The published treatment list runs to 79 items — Lashes, Manicure and Pedicure. Foot Reflexology With Peppermint Foot Mask is 235K IDR for 60 minutes.' where slug = 'the-nest-boutique-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Sanur day spa with a long list: 79 treatments, from lashes to manicures and pedicures. Foot reflexology with a peppermint foot mask is 235K IDR for an hour, and the longest treatments run two and a half hours.';
-- expect: UPDATE 1

-- 6. W-the-nest-boutique-spa-sanur-best_for · the-nest-boutique-spa-sanur · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes; tired feet after a day of walking.' where slug = 'the-nest-boutique-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Feet that carried you around Sanur all day';
-- expect: UPDATE 1

-- 7. W-asha-wellness-spa-seminyak-why_its_here · asha-wellness-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 53 items — Pedicure, Foot Massage and Manicure. Foot Reflexology is 200K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'asha-wellness-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Asha Wellness & Spa is a Seminyak day spa with 53 treatments, among them pedicures, manicures and foot massage. For an hour of foot reflexology you pay 200K IDR, and bookings are by WhatsApp.';
-- expect: UPDATE 1

-- 8. W-asha-wellness-spa-seminyak-best_for · asha-wellness-spa-seminyak · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'asha-wellness-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A pedicure or a foot massage after a long walk around Seminyak';
-- expect: UPDATE 1

-- 9. W-atman-spa-kerobokan-seminyak-why_its_here · atman-spa-kerobokan-seminyak · why_its_here · restore before
update venues set why_its_here = 'Spa in Seminyak. The published treatment list runs to 8 items — Traditional Massage, Body Treatment and Nails. Balinese massage is 700K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'atman-spa-kerobokan-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Atman Spa Kerobokan, a spa in Seminyak, keeps eight treatments on its list, from traditional massage and body treatments to nails. Balinese massage costs 700K IDR for an hour, booked on the spa''s own website.';
-- expect: UPDATE 1

-- 10. W-atman-spa-kerobokan-seminyak-best_for · atman-spa-kerobokan-seminyak · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 180 minutes.' where slug = 'atman-spa-kerobokan-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple treatment, or a reset that can stretch to three hours';
-- expect: UPDATE 1

-- 11. W-atman-spa-kerobokan-seminyak-not_for · atman-spa-kerobokan-seminyak · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 700K IDR.' where slug = 'atman-spa-kerobokan-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A Balinese massage for under 700K IDR; an hour costs 700K IDR here.';
-- expect: UPDATE 1

-- 12. W-body-soul-massage-seminyak-why_its_here · body-soul-massage-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 26 items — Body Scrub, Body Mask and Facial. Traditional Balinese Massage is 270K IDR for 60 minutes.' where slug = 'body-soul-massage-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Body & Soul Massage, a day spa in Seminyak, the 26 treatments run from body scrubs and masks to facials. A traditional Balinese massage is 270K IDR for 60 minutes.';
-- expect: UPDATE 1

-- 13. W-body-soul-massage-seminyak-best_for · body-soul-massage-seminyak · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'body-soul-massage-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A two-hour session';
-- expect: UPDATE 1

-- 14. W-bodyworks-bali-seminyak-why_its_here · bodyworks-bali-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 13 items — Traditional Massage, Javanese Lulur and Aromatherapy. Foot Massage is 320K IDR for 60 minutes.' where slug = 'bodyworks-bali-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Traditional massage, Javanese lulur and aromatherapy are on the list at Bodyworks Bali, a Seminyak day spa with 13 treatments. Expect to pay 320K IDR for a one-hour foot massage.';
-- expect: UPDATE 1

-- 15. W-bodyworks-bali-seminyak-best_for · bodyworks-bali-seminyak · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'bodyworks-bali-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An hour-long foot massage when your feet have had enough';
-- expect: UPDATE 1

-- 16. W-coolcontours-spa-beauty-seminyak-why_its_here · coolcontours-spa-beauty-seminyak · why_its_here · restore before
update venues set why_its_here = 'Beauty salon in Seminyak. The published treatment list runs to 5 items — Reflexology, Nail Art and Pedicure. Booking is on the venue''s own site.' where slug = 'coolcontours-spa-beauty-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Coolcontours Spa & Beauty is a beauty salon in Seminyak with five treatments, including reflexology, nail art and pedicures. You book on its own website.';
-- expect: UPDATE 1

-- 17. W-coolcontours-spa-beauty-seminyak-best_for · coolcontours-spa-beauty-seminyak · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'coolcontours-spa-beauty-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology or a pedicure for walked-out feet';
-- expect: UPDATE 1

-- 18. W-deanna-spa-caf-seminyak-why_its_here · deanna-spa-caf-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 8 items — Cream Bath, Facial and Balinese Massage. Booking is by WhatsApp.' where slug = 'deanna-spa-caf-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In Seminyak, Deanna Spa & Café runs a day spa with eight treatments, from cream baths and facials to Balinese massage. Bookings are made by WhatsApp.';
-- expect: UPDATE 1

-- 19. W-deanna-spa-caf-seminyak-best_for · deanna-spa-caf-seminyak · best_for · restore before
update venues set best_for = 'Cream bath booked the same day.' where slug = 'deanna-spa-caf-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cream bath or a facial';
-- expect: UPDATE 1

-- 20. W-executive-bali-massage-seminyak-why_its_here · executive-bali-massage-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 7 items — Balinese Massage, Deep Tissue and Swedish. Balinese Massage is 300K IDR for 90 minutes. Booking is by WhatsApp.' where slug = 'executive-bali-massage-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A seven-treatment day spa in Seminyak, covering Balinese, deep tissue and Swedish massage. Ninety minutes of Balinese massage costs 300K IDR, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 21. W-executive-bali-massage-seminyak-best_for · executive-bali-massage-seminyak · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; tired feet after a day of walking.' where slug = 'executive-bali-massage-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A massage as a couple';
-- expect: UPDATE 1

-- 22. W-grand-seminyak-spa-seminyak-why_its_here · grand-seminyak-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 35 items — Traditional Massage, Facial and Balinese Massage. Foot Reflexology is 605K IDR for 60 minutes.' where slug = 'grand-seminyak-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Grand Seminyak Spa is a day spa whose 35 treatments take in facials as well as traditional and Balinese massage. An hour of foot reflexology costs 605K IDR.';
-- expect: UPDATE 1

-- 23. W-grand-seminyak-spa-seminyak-best_for · grand-seminyak-spa-seminyak · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'grand-seminyak-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Taking three hours out after a day of walking';
-- expect: UPDATE 1

-- 24. W-hotel-indigo-bali-seminyak-beach-seminyak-why_its_here · hotel-indigo-bali-seminyak-beach-seminyak · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Seminyak. The published treatment list runs to 14 items — Balinese Massage, Acupressure and Body Scrub. Booking is on the venue''s own site.' where slug = 'hotel-indigo-bali-seminyak-beach-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The wellness spa at Hotel Indigo Bali Seminyak Beach has 14 treatments, with Balinese massage, acupressure and body scrubs among them. Bookings go through the hotel''s own website.';
-- expect: UPDATE 1

-- 25. W-hotel-indigo-bali-seminyak-beach-seminyak-best_for · hotel-indigo-bali-seminyak-beach-seminyak · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'hotel-indigo-bali-seminyak-beach-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Acupressure or a body scrub at the hotel spa';
-- expect: UPDATE 1

-- 26. W-jari-menari-spa-seminyak-bali-seminyak-why_its_here · jari-menari-spa-seminyak-bali-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 13 items — Traditional Massage. Booking is on the venue''s own site.' where slug = 'jari-menari-spa-seminyak-bali-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Jari Menari Spa, a day spa in Seminyak, has 13 treatments on its list, traditional massage among them. You book on its own website.';
-- expect: UPDATE 1

-- 27. W-jari-menari-spa-seminyak-bali-seminyak-best_for · jari-menari-spa-seminyak-bali-seminyak · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'jari-menari-spa-seminyak-bali-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Traditional massage at a Seminyak day spa';
-- expect: UPDATE 1

-- 28. W-jazb-beauty-space-seminyak-why_its_here · jazb-beauty-space-seminyak · why_its_here · restore before
update venues set why_its_here = 'Beauty salon in Seminyak. The published treatment list runs to 29 items — Facial, Lashes and Haircut. Foot Reflexology / Foot Massage is 210K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'jazb-beauty-space-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Jazb Beauty Space is a beauty salon in Seminyak with 29 treatments, from facials and lashes to haircuts. An hour of foot reflexology or foot massage is 210K IDR; book on the salon''s own website.';
-- expect: UPDATE 1

-- 29. W-jazb-beauty-space-seminyak-best_for · jazb-beauty-space-seminyak · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'jazb-beauty-space-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Tired feet after walking, or a fresh haircut';
-- expect: UPDATE 1

-- 30. W-no-1-wellness-seminyak-why_its_here · no-1-wellness-seminyak · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Seminyak. The published treatment list runs to 4 items — Traditional Massage and Body Treatment. Booking is by WhatsApp.' where slug = 'no-1-wellness-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Traditional massage and body treatments are on the four-item list at No.1 Wellness, a wellness spa in Seminyak. Bookings are by WhatsApp.';
-- expect: UPDATE 1

-- 31. W-no-1-wellness-seminyak-best_for · no-1-wellness-seminyak · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'no-1-wellness-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Body treatments and traditional massage';
-- expect: UPDATE 1

-- 32. W-no-1-wellness-seminyak-not_for · no-1-wellness-seminyak · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 500K IDR.' where slug = 'no-1-wellness-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget massage. At No.1 Wellness, prices begin at 500K IDR.';
-- expect: UPDATE 1

-- 33. W-one-eleven-luxe-spa-seminyak-why_its_here · one-eleven-luxe-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 32 items — Body Scrub, Sports Massage and Facial. Balinese Massage​ is 370K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'one-eleven-luxe-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'One Eleven Luxe Spa is a Seminyak day spa with 32 treatments, among them body scrubs, sports massage and facials. The longest treatment lasts five hours, and an hour of Balinese massage is 370K IDR. Book on the spa''s own website.';
-- expect: UPDATE 1

-- 34. W-one-eleven-luxe-spa-seminyak-best_for · one-eleven-luxe-spa-seminyak · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 300 minutes; tired feet after a day of walking.' where slug = 'one-eleven-luxe-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sports massage';
-- expect: UPDATE 1

-- 35. W-ortus-wellness-seminyak-why_its_here · ortus-wellness-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 40 items — Facial, Traditional Massage and Deep Tissue. Booking is on the venue''s own site.' where slug = 'ortus-wellness-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Ortus Wellness, a day spa in Seminyak, the 40 treatments include facials, traditional massage and deep tissue. There is a couple treatment too, and you book on the spa''s own website.';
-- expect: UPDATE 1

-- 36. W-ortus-wellness-seminyak-best_for · ortus-wellness-seminyak · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 120 minutes.' where slug = 'ortus-wellness-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, or a session of up to two hours';
-- expect: UPDATE 1

-- 37. W-spa-at-peppers-seminyak-seminyak-why_its_here · spa-at-peppers-seminyak-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 7 items — Balinese Massage, Body Scrub and Detox Treatment. Booking is on the venue''s own site.' where slug = 'spa-at-peppers-seminyak-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Spa at Peppers Seminyak is a day spa with seven treatments, including Balinese massage, a body scrub and a detox treatment. You book on its own website.';
-- expect: UPDATE 1

-- 38. W-spa-at-peppers-seminyak-seminyak-best_for · spa-at-peppers-seminyak-seminyak · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'spa-at-peppers-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage or a body scrub in Seminyak';
-- expect: UPDATE 1

-- 39. W-spa-bali-moon-seminyak-why_its_here · spa-bali-moon-seminyak · why_its_here · restore before
update venues set why_its_here = 'Spa in Seminyak. The published treatment list runs to 28 items — Couple Massage, Traditional Massage and Balinese Massage. Balinese Massage - Relaxing is 159K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'spa-bali-moon-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Spa Bali Moon in Seminyak has 28 treatments on its list, with couple massage next to traditional and Balinese massage. The relaxing version of the Balinese massage costs 159K IDR for an hour; book by WhatsApp.';
-- expect: UPDATE 1

-- 40. W-spa-bali-moon-seminyak-best_for · spa-bali-moon-seminyak · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 120 minutes.' where slug = 'spa-bali-moon-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple massage, or up to two hours of treatments';
-- expect: UPDATE 1

-- 41. W-spa-bali-seminyak-why_its_here · spa-bali-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 11 items — Couple Massage, Body Scrub and Traditional Massage. SERENITY COUPLE ESCAPE is 1650K IDR for 150 minutes. Booking runs through Zenoti.' where slug = 'spa-bali-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'SPA BALI is a Seminyak day spa with 11 treatments, from couple massage to body scrubs and traditional massage. Its Serenity Couple Escape runs 150 minutes for 1650K IDR, and bookings go through Zenoti.';
-- expect: UPDATE 1

-- 42. W-spa-bali-seminyak-best_for · spa-bali-seminyak · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 360 minutes.' where slug = 'spa-bali-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'The Serenity Couple Escape, or a day of treatments up to six hours';
-- expect: UPDATE 1

-- 43. W-spa-bali-seminyak-not_for · spa-bali-seminyak · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 560K IDR.' where slug = 'spa-bali-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget massage: even the lowest price on the list is 560K IDR.';
-- expect: UPDATE 1

-- 44. W-ssamaya-day-spa-seminyak-why_its_here · ssamaya-day-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 5 items — Shiatsu, Traditional Massage and Facial. Booking is on the venue''s own site.' where slug = 'ssamaya-day-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ssamaya Day Spa in Seminyak keeps a five-treatment list, with shiatsu, traditional massage and a facial on it. Bookings go through its own website.';
-- expect: UPDATE 1

-- 45. W-ssamaya-day-spa-seminyak-best_for · ssamaya-day-spa-seminyak · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'ssamaya-day-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Shiatsu or a facial in Seminyak';
-- expect: UPDATE 1

-- 46. W-svaha-spa-seminyak-seminyak-why_its_here · svaha-spa-seminyak-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 19 items — Couple Massage, Balinese Massage and Aromatherapy. Booking is by WhatsApp.' where slug = 'svaha-spa-seminyak-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Balinese massage, aromatherapy and a couple massage are among the 19 treatments at Svaha Spa Seminyak, a day spa. You book by WhatsApp.';
-- expect: UPDATE 1

-- 47. W-svaha-spa-seminyak-seminyak-best_for · svaha-spa-seminyak-seminyak · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'svaha-spa-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple massage booked over WhatsApp';
-- expect: UPDATE 1

-- 48. W-terra-spa-wellness-seminyak-why_its_here · terra-spa-wellness-seminyak · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Seminyak. The published treatment list runs to 14 items — Balinese Massage, Deep Tissue and Thai Massage. Balinese is 400K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'terra-spa-wellness-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In Seminyak, Terra Spa & Wellness is a wellness spa whose 14 treatments include Balinese, deep tissue and Thai massage. Balinese massage is 400K IDR for 60 minutes, and you book on its own website.';
-- expect: UPDATE 1

-- 49. W-terra-spa-wellness-seminyak-best_for · terra-spa-wellness-seminyak · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 120 minutes.' where slug = 'terra-spa-wellness-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'The couple treatment, or Thai or deep tissue massage';
-- expect: UPDATE 1

-- 50. W-the-art-of-body-seminyak-why_its_here · the-art-of-body-seminyak · why_its_here · restore before
update venues set why_its_here = 'Wellness centre in Seminyak. The published treatment list runs to 9 items — Pilates and Couple Massage. Booking is on the venue''s own site.' where slug = 'the-art-of-body-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Art of Body is a wellness centre in Seminyak whose nine-item list runs from Pilates to a couple massage. You book on its own website.';
-- expect: UPDATE 1

-- 51. W-the-art-of-body-seminyak-best_for · the-art-of-body-seminyak · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'the-art-of-body-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Pilates and a couple massage in the same place';
-- expect: UPDATE 1

-- 52. W-the-care-day-spa-seminyak-why_its_here · the-care-day-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 12 items — Traditional Massage, Deep Tissue and Hot Stone.' where slug = 'the-care-day-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Care Day Spa in Seminyak has 12 treatments on its list, covering traditional, deep tissue and hot stone massage.';
-- expect: UPDATE 1

-- 53. W-the-care-day-spa-seminyak-best_for · the-care-day-spa-seminyak · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'the-care-day-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Deep tissue or hot stone massage in Seminyak';
-- expect: UPDATE 1

-- 54. W-the-lotus-spa-seminyak-why_its_here · the-lotus-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Seminyak. The published treatment list runs to 26 items — Spa Package, Body Scrub and Balinese Massage. Balinese Massage is 250K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'the-lotus-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Body scrubs, spa packages and Balinese massage share the 26-treatment list at The Lotus Spa, a wellness spa in Seminyak. A 60-minute Balinese massage costs 250K IDR, and bookings are by WhatsApp.';
-- expect: UPDATE 1

-- 55. W-the-lotus-spa-seminyak-best_for · the-lotus-spa-seminyak · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 160 minutes; tired feet after a day of walking.' where slug = 'the-lotus-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Up to 160 minutes of treatments';
-- expect: UPDATE 1

-- 56. W-the-seminyak-beach-resort-spa-seminyak-why_its_here · the-seminyak-beach-resort-spa-seminyak · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Seminyak. The published treatment list runs to 4 items — Body Treatment, Facial and Traditional Massage. Booking is by WhatsApp.' where slug = 'the-seminyak-beach-resort-spa-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Seminyak Beach Resort & Spa runs a wellness spa with four treatments, including a body treatment, a facial and traditional massage. Book by WhatsApp.';
-- expect: UPDATE 1

-- 57. W-the-seminyak-beach-resort-spa-seminyak-best_for · the-seminyak-beach-resort-spa-seminyak · best_for · restore before
update venues set best_for = 'Body treatment booked the same day.' where slug = 'the-seminyak-beach-resort-spa-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial or body treatment at the resort spa';
-- expect: UPDATE 1

-- 58. W-the-seminyak-beach-resort-spa-seminyak-not_for · the-seminyak-beach-resort-spa-seminyak · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 500K IDR.' where slug = 'the-seminyak-beach-resort-spa-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Massage on a budget — all four treatments cost 500K IDR or more.';
-- expect: UPDATE 1

-- 59. W-the-shampoo-lounge-seminyak-why_its_here · the-shampoo-lounge-seminyak · why_its_here · restore before
update venues set why_its_here = 'Beauty salon in Seminyak. The published treatment list runs to 23 items — Ayurvedic Treatment, Head Massage and Hair Treatment. Olive Oil Head & Scalp Treatment is 385K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'the-shampoo-lounge-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Head massage, hair treatments and Ayurvedic treatments are on the 23-item list at The Shampoo Lounge, a Seminyak beauty salon. Its olive oil head and scalp treatment costs 385K IDR for an hour; book on the salon''s own website.';
-- expect: UPDATE 1

-- 60. W-the-shampoo-lounge-seminyak-best_for · the-shampoo-lounge-seminyak · best_for · restore before
update venues set best_for = 'Ayurvedic treatment booked the same day.' where slug = 'the-shampoo-lounge-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Scalp and hair care, or an Ayurvedic treatment';
-- expect: UPDATE 1

-- 61. W-the-spa-at-the-samaya-seminyak-seminyak-why_its_here · the-spa-at-the-samaya-seminyak-seminyak · why_its_here · restore before
update venues set why_its_here = 'Day spa in Seminyak. The published treatment list runs to 10 items — Balinese Massage, Aromatherapy and Shirodhara. TRADITIONAL BALINESE MASSAGE is 850K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'the-spa-at-the-samaya-seminyak-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Spa at The Samaya Seminyak is a day spa with ten treatments, among them Balinese massage, aromatherapy and shirodhara. An hour of traditional Balinese massage costs 850K IDR. Book on the spa''s own website.';
-- expect: UPDATE 1

-- 62. W-the-spa-at-the-samaya-seminyak-seminyak-best_for · the-spa-at-the-samaya-seminyak-seminyak · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 240 minutes.' where slug = 'the-spa-at-the-samaya-seminyak-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A reset with up to four hours to give it';
-- expect: UPDATE 1

-- 63. W-the-spa-at-the-samaya-seminyak-seminyak-not_for · the-spa-at-the-samaya-seminyak-seminyak · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 850K IDR.' where slug = 'the-spa-at-the-samaya-seminyak-seminyak' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget treat, since the traditional Balinese massage at 850K IDR an hour is where the list starts.';
-- expect: UPDATE 1

-- 64. W-wellness-by-the-legian-seminyak-why_its_here · wellness-by-the-legian-seminyak · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Seminyak. The published treatment list runs to 4 items — Spa Package, Yoga and Balinese Massage. Booking is on the venue''s own site.' where slug = 'wellness-by-the-legian-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Seminyak wellness spa, Wellness by The Legian has four items on its list, including yoga, a spa package and Balinese massage. You book on its own website.';
-- expect: UPDATE 1

-- 65. W-wellness-by-the-legian-seminyak-best_for · wellness-by-the-legian-seminyak · best_for · restore before
update venues set best_for = 'Spa package booked the same day.' where slug = 'wellness-by-the-legian-seminyak' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga at The Legian, or a spa package';
-- expect: UPDATE 1

-- 66. W-anandinii-organic-garden-kitchen-sidemen-why_its_here · anandinii-organic-garden-kitchen-sidemen · why_its_here · restore before
update venues set why_its_here = 'Wellness centre in Sidemen. The published treatment list runs to 8 items — Balinese Massage, Yoga and Energy Healing. Balinese Massage 60 minutes is 300K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'anandinii-organic-garden-kitchen-sidemen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Anandinii Organic Garden & Kitchen runs a wellness centre in Sidemen with eight treatments, from yoga and energy healing to Balinese massage. An hour of Balinese massage is 300K IDR; you book on its own website.';
-- expect: UPDATE 1

-- 67. W-anandinii-organic-garden-kitchen-sidemen-best_for · anandinii-organic-garden-kitchen-sidemen · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes.' where slug = 'anandinii-organic-garden-kitchen-sidemen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A long reset in Sidemen, up to two and a half hours';
-- expect: UPDATE 1

-- 68. W-kapha-spa-sidemen-why_its_here · kapha-spa-sidemen · why_its_here · restore before
update venues set why_its_here = 'Day spa in Sidemen. The published treatment list runs to 32 items — Traditional Massage, Nails and Aromatherapy. Kapha Spice and Citrus Foot Care is 650K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'kapha-spa-sidemen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kapha Spa is a day spa in Sidemen with 32 treatments, from traditional massage and aromatherapy to nails. Its Kapha spice and citrus foot care costs 650K IDR for an hour, and you book on the spa''s own website.';
-- expect: UPDATE 1

-- 69. W-kapha-spa-sidemen-best_for · kapha-spa-sidemen · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'kapha-spa-sidemen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'The spice and citrus foot care after a day of walking in Sidemen';
-- expect: UPDATE 1

-- 70. W-lattranaya-sidemen-why_its_here · lattranaya-sidemen · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Sidemen. The published treatment list runs to 11 items — Reiki, Yoga and Sound Healing.' where slug = 'lattranaya-sidemen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lattranaya, a wellness spa in Sidemen, lists 11 treatments, among them Reiki, yoga and sound healing.';
-- expect: UPDATE 1

-- 71. W-lattranaya-sidemen-best_for · lattranaya-sidemen · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'lattranaya-sidemen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reiki or sound healing';
-- expect: UPDATE 1

-- 72. W-pelangi-villa-sidemen-sidemen-why_its_here · pelangi-villa-sidemen-sidemen · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Sidemen. The published treatment list runs to 8 items — Balinese Massage and Yoga. Balinese Massage 60 mins is 300K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'pelangi-villa-sidemen-sidemen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pelangi Villa Sidemen has a wellness spa with eight treatments, covering Balinese massage and yoga. Balinese massage is 300K IDR for an hour, and bookings are by WhatsApp.';
-- expect: UPDATE 1

-- 73. W-pelangi-villa-sidemen-sidemen-best_for · pelangi-villa-sidemen-sidemen · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes.' where slug = 'pelangi-villa-sidemen-sidemen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Treatments of up to three hours in Sidemen';
-- expect: UPDATE 1

-- 74. W-wapa-di-ume-sidemen-sidemen-why_its_here · wapa-di-ume-sidemen-sidemen · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Sidemen. The published treatment list runs to 4 items — Yoga. Booking is on the venue''s own site.' where slug = 'wapa-di-ume-sidemen-sidemen' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Wapa di Ume Sidemen runs a wellness spa with four items on its list, yoga among them. Bookings are on its own website.';
-- expect: UPDATE 1

-- 75. W-wapa-di-ume-sidemen-sidemen-best_for · wapa-di-ume-sidemen-sidemen · best_for · restore before
update venues set best_for = 'Yoga booked the same day.' where slug = 'wapa-di-ume-sidemen-sidemen' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga in Sidemen';
-- expect: UPDATE 1

-- 76. W-alam-shanti-wellness-ubud-why_its_here · alam-shanti-wellness-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 15 items — Ice Bath, Traditional Massage and Hot Stone. Foot Reflexology is 250K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'alam-shanti-wellness-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Alam Shanti Wellness, an Ubud wellness spa, puts an ice bath on its 15-treatment list next to traditional and hot stone massage. An hour of foot reflexology costs 250K IDR. Book on its own website.';
-- expect: UPDATE 1

-- 77. W-alam-shanti-wellness-ubud-best_for · alam-shanti-wellness-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 165 minutes; tired feet after a day of walking.' where slug = 'alam-shanti-wellness-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Up to 165 minutes of treatment to undo a day of walking';
-- expect: UPDATE 1

-- 78. W-alaya-ubud-ubud-why_its_here · alaya-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 6 items — Couple Massage, Spa Package and Balinese Boreh. DALA COUPLE RITUAL is 1424K IDR for 90 minutes. Booking runs through Zenoti.' where slug = 'alaya-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The day spa at Alaya Ubud has six treatments, among them a couple massage, spa packages and Balinese boreh. The Dala Couple Ritual is 90 minutes for 1424K IDR, booked through Zenoti.';
-- expect: UPDATE 1

-- 79. W-alaya-ubud-ubud-best_for · alaya-ubud-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 150 minutes.' where slug = 'alaya-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples booking the Dala Couple Ritual, or a visit of up to two and a half hours';
-- expect: UPDATE 1

-- 80. W-alaya-ubud-ubud-not_for · alaya-ubud-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 1122K IDR.' where slug = 'alaya-ubud-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Spa time on a budget: the six treatments start at 1122K IDR.';
-- expect: UPDATE 1

-- 81. W-aura-therapy-spa-ubud-why_its_here · aura-therapy-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 16 items — Facial, Balinese Boreh and Spa Package. Head Massage with Coconut Oil is 110K IDR for 15 minutes. Booking is by WhatsApp.' where slug = 'aura-therapy-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Aura Therapy Spa, a day spa in Ubud, has 16 treatments, among them facials, Balinese boreh and spa packages. Fifteen minutes of head massage with coconut oil costs 110K IDR; you book by WhatsApp.';
-- expect: UPDATE 1

-- 82. W-aura-therapy-spa-ubud-best_for · aura-therapy-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes.' where slug = 'aura-therapy-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A quick head massage or a three-hour reset';
-- expect: UPDATE 1

-- 83. W-bali-botanica-ubud-ubud-why_its_here · bali-botanica-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 31 items — Ayurvedic Treatment, Spa Package and Facial. Foot Spa is 275K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'bali-botanica-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Bali Botanica Ubud, a day spa, the 31 treatments run from Ayurvedic treatments and facials to spa packages. The longest take 375 minutes, and an hour-long foot spa is 275K IDR. Book on the spa''s own website.';
-- expect: UPDATE 1

-- 84. W-bali-botanica-ubud-ubud-best_for · bali-botanica-ubud-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 375 minutes; tired feet after a day of walking.' where slug = 'bali-botanica-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot spa after walking around Ubud all day';
-- expect: UPDATE 1

-- 85. W-bali-spirit-hotel-and-spa-ubud-why_its_here · bali-spirit-hotel-and-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 4 items — Traditional Massage, Balinese Massage and Aromatherapy. Traditional Balinese Massage is 200K IDR for 60 minutes.' where slug = 'bali-spirit-hotel-and-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Spirit Hotel and Spa runs a day spa in Ubud with four treatments, including traditional and Balinese massage and aromatherapy. A traditional Balinese massage costs 200K IDR for an hour.';
-- expect: UPDATE 1

-- 86. W-bali-spirit-hotel-and-spa-ubud-best_for · bali-spirit-hotel-and-spa-ubud · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'bali-spirit-hotel-and-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Aromatherapy, or a traditional Balinese massage';
-- expect: UPDATE 1

-- 87. W-bali-tao-center-ubud-why_its_here · bali-tao-center-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 46 items — Traditional Massage, Scalp Treatment and Thai Massage. Booking is on the venue''s own site.' where slug = 'bali-tao-center-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali TAO Center, a day spa in Ubud, has 46 treatments, from traditional and Thai massage to scalp treatments. A couple treatment is on the list as well, and bookings go through its own website.';
-- expect: UPDATE 1

-- 88. W-bali-tao-center-ubud-best_for · bali-tao-center-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; tired feet after a day of walking.' where slug = 'bali-tao-center-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple treatment';
-- expect: UPDATE 1

-- 89. W-bali-wellness-spa-ubud-why_its_here · bali-wellness-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 35 items — Facial, Spa Package and Deep Tissue. BALI FOOT SPA RITUAL is 500K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'bali-wellness-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Wellness Spa in Ubud has a 35-treatment list that runs from facials and deep tissue massage to spa packages. Its Bali Foot Spa Ritual is an hour for 500K IDR. Book on the spa''s own website.';
-- expect: UPDATE 1

-- 90. W-bali-wellness-spa-ubud-best_for · bali-wellness-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 300 minutes; tired feet after a day of walking.' where slug = 'bali-wellness-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Five hours of treatments once the walking is done';
-- expect: UPDATE 1

-- 91. W-balian-springs-ubud-why_its_here · balian-springs-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 93 items — Traditional Massage, Facial and Foot Massage. Booking runs through Zenoti.' where slug = 'balian-springs-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Traditional massage, facials and foot massage are among the 93 treatments at Balian Springs, a day spa in Ubud. Bookings go through Zenoti.';
-- expect: UPDATE 1

-- 92. W-balian-springs-ubud-best_for · balian-springs-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'balian-springs-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot massage when the walking has caught up with you';
-- expect: UPDATE 1

-- 93. W-banyan-tree-spa-macau-ubud-why_its_here · banyan-tree-spa-macau-ubud · why_its_here · restore before
update venues set why_its_here = 'Spa in Ubud. The published treatment list runs to 20 items — Facial, Hair Styling and Hot Stone. Booking is on the venue''s own site.' where slug = 'banyan-tree-spa-macau-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Ubud spa with 20 treatments on the list, from facials and hair styling to hot stone. Bookings are on its own website.';
-- expect: UPDATE 1

-- 94. W-banyan-tree-spa-macau-ubud-best_for · banyan-tree-spa-macau-ubud · best_for · restore before
update venues set best_for = 'Facial booked the same day.' where slug = 'banyan-tree-spa-macau-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Facials and hot stone treatments';
-- expect: UPDATE 1

-- 95. W-chatraka-spa-ubud-why_its_here · chatraka-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 6 items — Detox Treatment and Couple Massage. Booking is on the venue''s own site.' where slug = 'chatraka-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Chatraka Spa is a day spa in Ubud with six treatments, a detox treatment and a couple massage among them. You book on the spa''s own website.';
-- expect: UPDATE 1

-- 96. W-chatraka-spa-ubud-best_for · chatraka-spa-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'chatraka-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Booking a couple massage while in Ubud';
-- expect: UPDATE 1

-- 97. W-chatraka-spa-ubud-not_for · chatraka-spa-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 900K IDR.' where slug = 'chatraka-spa-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget massage; 900K IDR is the lowest price at Chatraka Spa.';
-- expect: UPDATE 1
