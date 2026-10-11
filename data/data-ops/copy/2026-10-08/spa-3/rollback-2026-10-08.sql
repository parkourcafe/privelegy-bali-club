-- wave-spa-3-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-yes-spa-bali-yes-hair-bliss-kuta-legian-why_its_here · yes-spa-bali-yes-hair-bliss-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published treatment list runs to 59 items — Facial, Spa Package and Foot Massage. Foot & Leg Massage is 130K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'yes-spa-bali-yes-hair-bliss-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Foot and leg massage at Yes Spa Bali & Yes Hair Bliss, a Legian day spa, costs 130K IDR for an hour. Facials and spa packages are among its 59 treatments, and the longest lasts three hours. You book on its website.';
-- expect: UPDATE 1

-- 2. W-yes-spa-bali-yes-hair-bliss-kuta-legian-best_for · yes-spa-bali-yes-hair-bliss-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'yes-spa-bali-yes-hair-bliss-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot and leg massage for tired legs';
-- expect: UPDATE 1

-- 3. W-bali-dream-spa-lovina-lovina-why_its_here · bali-dream-spa-lovina-lovina · why_its_here · restore before
update venues set why_its_here = 'Day spa in Lovina. The published treatment list runs to 7 items — Balinese Massage, Manicure and Facial. Booking is by WhatsApp.' where slug = 'bali-dream-spa-lovina-lovina' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Dream Spa, a Lovina day spa you book by WhatsApp, lists seven treatments: Balinese massage, facials, manicures and a couple treatment.';
-- expect: UPDATE 1

-- 4. W-bali-dream-spa-lovina-lovina-best_for · bali-dream-spa-lovina-lovina · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'bali-dream-spa-lovina-lovina' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples who want to book a treatment together';
-- expect: UPDATE 1

-- 5. W-earthbound-lovina-why_its_here · earthbound-lovina · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Lovina. The published treatment list runs to 19 items — Foot Massage, Hot Stone and Body Scrub. Booking is on the venue''s own site.' where slug = 'earthbound-lovina' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In Lovina, Earthbound is a wellness spa whose 19 treatments include foot massage, hot stone and body scrubs. The longest treatment runs six hours, and booking is on its own website.';
-- expect: UPDATE 1

-- 6. W-earthbound-lovina-best_for · earthbound-lovina · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 360 minutes; tired feet after a day of walking.' where slug = 'earthbound-lovina' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A body scrub in Lovina';
-- expect: UPDATE 1

-- 7. W-jaya-spa-lovina-why_its_here · jaya-spa-lovina · why_its_here · restore before
update venues set why_its_here = 'Day spa in Lovina. The published treatment list runs to 15 items — Traditional Massage, Hair Treatment and Anti-aging Facial. Traditional Lovina Body Massage is 350K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'jaya-spa-lovina' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Jaya Spa, a day spa in Lovina, charges 350K IDR for an hour of its traditional Lovina body massage. Hair treatments and anti-aging facials are also on the 15-treatment list, and the longest session runs three hours. Book on the spa''s website.';
-- expect: UPDATE 1

-- 8. W-jaya-spa-lovina-best_for · jaya-spa-lovina · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'jaya-spa-lovina' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An anti-aging facial while you''re in Lovina';
-- expect: UPDATE 1

-- 9. W-rnd-lovina-spa-lovina-why_its_here · rnd-lovina-spa-lovina · why_its_here · restore before
update venues set why_its_here = 'Day spa in Lovina. The published treatment list runs to 20 items — Body Scrub, Facial and Foot Massage. Balinese Massage is 140K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'rnd-lovina-spa-lovina' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Body scrubs, facials, foot massage and a couple treatment are among the 20 treatments at RND Lovina Spa, a day spa. A 60-minute Balinese massage costs 140K IDR, treatments go up to two hours, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 10. W-rnd-lovina-spa-lovina-best_for · rnd-lovina-spa-lovina · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 120 minutes.' where slug = 'rnd-lovina-spa-lovina' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An hour of Balinese massage for 140K IDR';
-- expect: UPDATE 1

-- 11. W-santhika-retreat-center-lovina-why_its_here · santhika-retreat-center-lovina · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Lovina. The published treatment list runs to 66 items — Traditional Massage, Facial and Balinese Massage. Full Body Balinese Massage is 200K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'santhika-retreat-center-lovina' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Santhika Retreat Center, a Lovina wellness spa, lists 66 treatments including traditional massage, facials and a couple treatment. A full-body Balinese massage costs 200K IDR for an hour. The longest session is 150 minutes, and you book on the centre''s website.';
-- expect: UPDATE 1

-- 12. W-santhika-retreat-center-lovina-best_for · santhika-retreat-center-lovina · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 150 minutes.' where slug = 'santhika-retreat-center-lovina' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A long list of treatments to choose from';
-- expect: UPDATE 1

-- 13. W-bamboo-spa-at-munduk-moding-plantation-nature-re-munduk-why_its_here · bamboo-spa-at-munduk-moding-plantation-nature-re-munduk · why_its_here · restore before
update venues set why_its_here = 'Spa in Munduk. The published treatment list runs to 16 items — Aromatherapy, Balinese Massage and Traditional Massage. Booking is on the venue''s own site.' where slug = 'bamboo-spa-at-munduk-moding-plantation-nature-re-munduk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bamboo Spa is the spa at Munduk Moding Plantation Nature Resort, with 16 treatments including aromatherapy, Balinese massage and traditional massage. The longest takes 135 minutes, and booking is on the resort''s website.';
-- expect: UPDATE 1

-- 14. W-bamboo-spa-at-munduk-moding-plantation-nature-re-munduk-best_for · bamboo-spa-at-munduk-moding-plantation-nature-re-munduk · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 135 minutes; tired feet after a day of walking.' where slug = 'bamboo-spa-at-munduk-moding-plantation-nature-re-munduk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Aromatherapy at the plantation resort';
-- expect: UPDATE 1

-- 15. W-mahony-spa-wellness-munduk-why_its_here · mahony-spa-wellness-munduk · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Munduk. The published treatment list runs to 22 items — Traditional Massage, Spa Package and Balinese Massage. Munduk Foot Ritual is 399K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'mahony-spa-wellness-munduk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mahony Spa & Wellness in Munduk charges 399K IDR for an hour of its Munduk foot ritual. Spa packages and traditional and Balinese massage are also on the 22-treatment list, with the longest at two and a half hours. Book on its website.';
-- expect: UPDATE 1

-- 16. W-mahony-spa-wellness-munduk-best_for · mahony-spa-wellness-munduk · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes; tired feet after a day of walking.' where slug = 'mahony-spa-wellness-munduk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'The Munduk foot ritual when your feet have had a long day';
-- expect: UPDATE 1

-- 17. W-mondo-surf-lifestyle-village-munduk-why_its_here · mondo-surf-lifestyle-village-munduk · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Munduk. The published treatment list runs to 6 items — Balinese Massage, Reflexology and Four Hands Massage. Reflexology Foot Massage is 230K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'mondo-surf-lifestyle-village-munduk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mondo Surf & Lifestyle Village has a massage studio in Munduk with six treatments, among them Balinese massage, reflexology and a four-hands massage. An hour of reflexology foot massage is 230K IDR, booked on its own website.';
-- expect: UPDATE 1

-- 18. W-mondo-surf-lifestyle-village-munduk-best_for · mondo-surf-lifestyle-village-munduk · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'mondo-surf-lifestyle-village-munduk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A four-hands massage or reflexology';
-- expect: UPDATE 1

-- 19. W-munduk-moding-plantation-munduk-why_its_here · munduk-moding-plantation-munduk · why_its_here · restore before
update venues set why_its_here = 'Resort spa in Munduk. The published treatment list runs to 9 items — Balinese Massage, Sauna and Yoga. Booking is by WhatsApp.' where slug = 'munduk-moding-plantation-munduk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Munduk Moding Plantation has a resort spa with nine treatments on its list, Balinese massage, sauna and yoga among them. Booking is by WhatsApp.';
-- expect: UPDATE 1

-- 20. W-munduk-moding-plantation-munduk-best_for · munduk-moding-plantation-munduk · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'munduk-moding-plantation-munduk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage at the resort';
-- expect: UPDATE 1

-- 21. W-munduk-tentrem-resort-munduk-why_its_here · munduk-tentrem-resort-munduk · why_its_here · restore before
update venues set why_its_here = 'Spa in Munduk. The published treatment list runs to 52 items — Shiatsu, Balinese Massage and Aromatherapy. Booking is on the venue''s own site.' where slug = 'munduk-tentrem-resort-munduk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The spa at Munduk Tentrem Resort has 52 treatments, with shiatsu, Balinese massage and aromatherapy on the list. Treatments last up to two and a half hours, and you book on the resort''s website.';
-- expect: UPDATE 1

-- 22. W-munduk-tentrem-resort-munduk-best_for · munduk-tentrem-resort-munduk · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes; tired feet after a day of walking.' where slug = 'munduk-tentrem-resort-munduk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Shiatsu at Munduk Tentrem Resort';
-- expect: UPDATE 1

-- 23. W-okana-spa-munduk-why_its_here · okana-spa-munduk · why_its_here · restore before
update venues set why_its_here = 'Day spa in Munduk. The published treatment list runs to 33 items — Traditional Massage, Facial and Manicure. Booking is on the venue''s own site.' where slug = 'okana-spa-munduk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'With 33 treatments on its list, OKANA Spa in Munduk is a day spa covering traditional massage, facials and manicures. The longest treatment runs four hours, and bookings go through the spa''s website.';
-- expect: UPDATE 1

-- 24. W-okana-spa-munduk-best_for · okana-spa-munduk · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 240 minutes; tired feet after a day of walking.' where slug = 'okana-spa-munduk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'When you want a manicure as well as a massage';
-- expect: UPDATE 1

-- 25. W-putu-bali-spa-home-care-munduk-why_its_here · putu-bali-spa-home-care-munduk · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Munduk. The published treatment list runs to 5 items — Foot Massage and Aromatherapy. Foot Massage is 200K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'putu-bali-spa-home-care-munduk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Putu Bali Spa Home Care, a wellness spa in Munduk, takes bookings by WhatsApp for its five treatments. Foot massage is 200K IDR for 60 minutes, and aromatherapy is on the list too.';
-- expect: UPDATE 1

-- 26. W-putu-bali-spa-home-care-munduk-best_for · putu-bali-spa-home-care-munduk · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'putu-bali-spa-home-care-munduk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot massage arranged by WhatsApp';
-- expect: UPDATE 1

-- 27. W-sanctua-bedugul-munduk-why_its_here · sanctua-bedugul-munduk · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Munduk. The published treatment list runs to 13 items — Couple Massage. Booking is on the venue''s own site.' where slug = 'sanctua-bedugul-munduk' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A couple massage is one of the 13 treatments at Sanctua Bedugul, a wellness spa in Munduk. You book on its website.';
-- expect: UPDATE 1

-- 28. W-sanctua-bedugul-munduk-best_for · sanctua-bedugul-munduk · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'sanctua-bedugul-munduk' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple massage with your partner';
-- expect: UPDATE 1

-- 29. W-3d-relaxation-center-nusa-dua-why_its_here · 3d-relaxation-center-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Spa in Nusa Dua. The published treatment list runs to 87 items — Manicure, Traditional Massage and Spa Package. Reflexology (foot massage) is 175K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = '3d-relaxation-center-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The 87 treatments at 3D Relaxation Center, a Nusa Dua spa, include manicures, traditional massage, spa packages and a couple treatment. The longest is five hours. Foot reflexology costs 175K IDR for 60 minutes, booked on the centre''s website.';
-- expect: UPDATE 1

-- 30. W-3d-relaxation-center-nusa-dua-best_for · 3d-relaxation-center-nusa-dua · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 300 minutes.' where slug = '3d-relaxation-center-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Getting a manicure and a traditional massage at the same spa';
-- expect: UPDATE 1

-- 31. W-adi-spa-healing-healthy-and-wellness-nusa-dua-nusa-dua-why_its_here · adi-spa-healing-healthy-and-wellness-nusa-dua-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Spa in Nusa Dua. The published treatment list runs to 5 items — Balinese Massage, Couple Massage and Traditional Massage. Booking is on the venue''s own site.' where slug = 'adi-spa-healing-healthy-and-wellness-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Adi Spa in Nusa Dua keeps five treatments on its list, including Balinese, traditional and couple massage. Booking is on the spa''s own website.';
-- expect: UPDATE 1

-- 32. W-adi-spa-healing-healthy-and-wellness-nusa-dua-nusa-dua-best_for · adi-spa-healing-healthy-and-wellness-nusa-dua-nusa-dua · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; tired feet after a day of walking.' where slug = 'adi-spa-healing-healthy-and-wellness-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A traditional massage in Nusa Dua';
-- expect: UPDATE 1

-- 33. W-bali-relaxing-resort-and-spa-nusa-dua-nusa-dua-why_its_here · bali-relaxing-resort-and-spa-nusa-dua-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Resort spa in Nusa Dua. The published treatment list runs to 7 items — Aromatherapy, Thai Massage and Foot Massage. Foot Massage is 350K IDR.' where slug = 'bali-relaxing-resort-and-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Relaxing Resort And Spa Nusa Dua runs a resort spa with seven treatments, among them aromatherapy, Thai massage and foot massage. A foot massage is 350K IDR.';
-- expect: UPDATE 1

-- 34. W-bali-relaxing-resort-and-spa-nusa-dua-nusa-dua-best_for · bali-relaxing-resort-and-spa-nusa-dua-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'bali-relaxing-resort-and-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Thai massage at a resort spa';
-- expect: UPDATE 1

-- 35. W-bali-relaxing-resort-spa-nusa-dua-why_its_here · bali-relaxing-resort-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Resort spa in Nusa Dua. The published treatment list runs to 4 items — Balinese Massage, Flower Bath and Reflexology.' where slug = 'bali-relaxing-resort-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Relaxing Resort & Spa has a resort spa in Nusa Dua with four treatments, including Balinese massage, a flower bath and reflexology.';
-- expect: UPDATE 1

-- 36. W-bali-relaxing-resort-spa-nusa-dua-best_for · bali-relaxing-resort-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'bali-relaxing-resort-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A flower bath at a Nusa Dua resort spa';
-- expect: UPDATE 1

-- 37. W-chi-massage-luxury-spa-nusa-dua-bali-nusa-dua-why_its_here · chi-massage-luxury-spa-nusa-dua-bali-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 11 items — Spa Package, Reflexology and Manicure. Foot Reflexology is 380K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'chi-massage-luxury-spa-nusa-dua-bali-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An hour of foot reflexology at Chi Massage & Luxury Spa costs 380K IDR. The Nusa Dua day spa also lists spa packages and manicures among its 11 treatments, and you book on its website.';
-- expect: UPDATE 1

-- 38. W-chi-massage-luxury-spa-nusa-dua-bali-nusa-dua-best_for · chi-massage-luxury-spa-nusa-dua-bali-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'chi-massage-luxury-spa-nusa-dua-bali-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Foot reflexology when the walking is over';
-- expect: UPDATE 1

-- 39. W-frangipani-bali-spa-nusa-dua-why_its_here · frangipani-bali-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Nusa Dua. The published treatment list runs to 10 items — Couple Massage, Balinese Massage and Anti-aging Facial. Frangipani Quick Couple Massage is 800K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'frangipani-bali-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Frangipani Bali Spa is a Nusa Dua wellness spa whose ten treatments include a couple massage, Balinese massage and an anti-aging facial. The quick couple massage costs 800K IDR for an hour. Treatments can run to five hours, and bookings go by WhatsApp.';
-- expect: UPDATE 1

-- 40. W-frangipani-bali-spa-nusa-dua-best_for · frangipani-bali-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 300 minutes.' where slug = 'frangipani-bali-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Booking a couple massage by WhatsApp';
-- expect: UPDATE 1

-- 41. W-frangipani-bali-spa-nusa-dua-not_for · frangipani-bali-spa-nusa-dua · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 800K IDR.' where slug = 'frangipani-bali-spa-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone on a budget, because every treatment here costs 800K IDR or more';
-- expect: UPDATE 1

-- 42. W-heavenly-spa-by-westin-nusa-dua-why_its_here · heavenly-spa-by-westin-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 11 items — Yoga. Booking is on the venue''s own site.' where slug = 'heavenly-spa-by-westin-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Yoga is among the 11 treatments at Heavenly Spa by Westin, a day spa in Nusa Dua. Booking is on the spa''s own website.';
-- expect: UPDATE 1

-- 43. W-heavenly-spa-by-westin-nusa-dua-best_for · heavenly-spa-by-westin-nusa-dua · best_for · restore before
update venues set best_for = 'Yoga booked the same day.' where slug = 'heavenly-spa-by-westin-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga at the Westin in Nusa Dua';
-- expect: UPDATE 1

-- 44. W-heavenly-spa-by-westin-nusa-dua-not_for · heavenly-spa-by-westin-nusa-dua · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 500K IDR.' where slug = 'heavenly-spa-by-westin-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone after a massage for less than 500K IDR. That is the Westin spa''s starting price';
-- expect: UPDATE 1

-- 45. W-ijen-spa-nusa-dua-why_its_here · ijen-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 19 items — Deep Tissue, Balinese Massage and Spa Package. Foot Massage is 249K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'ijen-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Ijen Spa in Nusa Dua, a 60-minute foot massage is 249K IDR. The day spa''s 19 treatments also include deep tissue, Balinese massage and spa packages, and none runs past two hours. Book on its website.';
-- expect: UPDATE 1

-- 46. W-ijen-spa-nusa-dua-best_for · ijen-spa-nusa-dua · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'ijen-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Someone who wants a deep tissue massage';
-- expect: UPDATE 1

-- 47. W-jiwa-spa-nusa-dua-why_its_here · jiwa-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Spa in Nusa Dua. The published treatment list runs to 6 items — Traditional Massage, Detox Treatment and Spa Package.' where slug = 'jiwa-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Jiwa Spa in Nusa Dua has six treatments on its list, among them traditional massage, a detox treatment and spa packages.';
-- expect: UPDATE 1

-- 48. W-jiwa-spa-nusa-dua-best_for · jiwa-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'jiwa-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Someone curious about a detox treatment';
-- expect: UPDATE 1

-- 49. W-karma-spa-therapy-nusa-dua-why_its_here · karma-spa-therapy-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 7 items — Balinese Massage, Lomi Lomi and Deep Tissue. Balinese Massage is 200K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'karma-spa-therapy-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Seven treatments make up the list at Karma Spa Therapy, a day spa in Nusa Dua, among them lomi lomi and deep tissue. A 60-minute Balinese massage costs 200K IDR; bookings are by WhatsApp.';
-- expect: UPDATE 1

-- 50. W-karma-spa-therapy-nusa-dua-best_for · karma-spa-therapy-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'karma-spa-therapy-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Anyone who has not tried lomi lomi';
-- expect: UPDATE 1

-- 51. W-kayumanis-spa-nusa-dua-nusa-dua-why_its_here · kayumanis-spa-nusa-dua-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Nusa Dua. The published treatment list runs to 19 items — Traditional Massage, Spa Package and Facial. Relaxing Massage is 1025K IDR for 60 minutes. Booking runs through Fresha.' where slug = 'kayumanis-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An hour of relaxing massage costs 1,025K IDR at Kayumanis Spa Nusa Dua, a wellness spa you book through Fresha. Its 19 treatments include traditional massage, spa packages and facials, and the longest runs three hours.';
-- expect: UPDATE 1

-- 52. W-kayumanis-spa-nusa-dua-nusa-dua-best_for · kayumanis-spa-nusa-dua-nusa-dua · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes.' where slug = 'kayumanis-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa package booked through Fresha';
-- expect: UPDATE 1

-- 53. W-kayumanis-spa-nusa-dua-nusa-dua-not_for · kayumanis-spa-nusa-dua-nusa-dua · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 1025K IDR.' where slug = 'kayumanis-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A massage for under a million rupiah, as the list starts at 1,025K IDR';
-- expect: UPDATE 1

-- 54. W-merusaka-spa-nusa-dua-why_its_here · merusaka-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 27 items — Spa Package, Balinese Massage and Facial. Warm Oil Massage is 675K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'merusaka-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Merusaka Spa''s warm oil massage is 675K IDR for an hour. The Nusa Dua day spa lists 27 treatments, among them spa packages, Balinese massage and facials, with sessions of up to three hours. Book on the spa''s website.';
-- expect: UPDATE 1

-- 55. W-merusaka-spa-nusa-dua-best_for · merusaka-spa-nusa-dua · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'merusaka-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A warm oil massage at a Nusa Dua day spa';
-- expect: UPDATE 1

-- 56. W-mim-spa-nusa-dua-why_its_here · mim-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Nusa Dua. The published treatment list runs to 26 items — Traditional Massage, Facial and Detox Treatment. Booking is on the venue''s own site.' where slug = 'mim-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'MIM SPA, a wellness spa in Nusa Dua, lists 26 treatments, traditional massage, facials and detox treatments among them. You book on its website.';
-- expect: UPDATE 1

-- 57. W-mim-spa-nusa-dua-best_for · mim-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'mim-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Someone choosing between a facial and a traditional massage';
-- expect: UPDATE 1

-- 58. W-mybalihealing-nusa-dua-why_its_here · mybalihealing-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 10 items — Aromatherapy, Deep Tissue and Reflexology. Booking is by WhatsApp.' where slug = 'mybalihealing-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At myBALIhealing, a Nusa Dua day spa booked by WhatsApp, the ten treatments on the list include aromatherapy, deep tissue and reflexology.';
-- expect: UPDATE 1

-- 59. W-mybalihealing-nusa-dua-best_for · mybalihealing-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'mybalihealing-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology or aromatherapy in Nusa Dua';
-- expect: UPDATE 1

-- 60. W-royal-orchid-spa-nusa-dua-why_its_here · royal-orchid-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Spa in Nusa Dua. The published treatment list runs to 25 items — Spa Package, Balinese Massage and Shirodhara. Royal Traditional Balinese Massage – 60 is 385K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'royal-orchid-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Shirodhara and Balinese massage sit alongside spa packages and a couple treatment on the 25-treatment list at Royal Orchid Spa in Nusa Dua. The royal traditional Balinese massage is 385K IDR for 60 minutes, and treatments go up to four hours. Book on the spa''s website.';
-- expect: UPDATE 1

-- 61. W-royal-orchid-spa-nusa-dua-best_for · royal-orchid-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 240 minutes.' where slug = 'royal-orchid-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Shirodhara, or the royal traditional Balinese massage';
-- expect: UPDATE 1

-- 62. W-samantha-spa-at-santika-beach-resort-nusa-dua-why_its_here · samantha-spa-at-santika-beach-resort-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 9 items — Traditional Massage, Body Treatment and Spa Package. Booking is on the venue''s own site.' where slug = 'samantha-spa-at-santika-beach-resort-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Samantha Spa is the day spa at Santika Beach Resort in Nusa Dua. Traditional massage, body treatments and spa packages are among its nine treatments, and you book on its website.';
-- expect: UPDATE 1

-- 63. W-samantha-spa-at-santika-beach-resort-nusa-dua-best_for · samantha-spa-at-santika-beach-resort-nusa-dua · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 240 minutes.' where slug = 'samantha-spa-at-santika-beach-resort-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Four hours given over to the spa';
-- expect: UPDATE 1

-- 64. W-samuh-beach-nusa-dua-why_its_here · samuh-beach-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Spa in Nusa Dua. The published treatment list runs to 28 items — Thai Massage, Couple Massage and Traditional Massage. THAI BEEF SALAD is 90K IDR. Booking is on the venue''s own site.' where slug = 'samuh-beach-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Thai, traditional and couple massage are on the 28-treatment list at SAMUH BEACH, a spa in Nusa Dua. Treatments run up to three hours, and booking is on the venue''s site.';
-- expect: UPDATE 1

-- 65. W-samuh-beach-nusa-dua-best_for · samuh-beach-nusa-dua · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 180 minutes.' where slug = 'samuh-beach-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple massage or Thai massage in Nusa Dua';
-- expect: UPDATE 1

-- 66. W-samuh-beach-nusa-dua-not_for · samuh-beach-nusa-dua · not_for · restore before
update venues set not_for = 'A resort-spa setting — this is a neighbourhood price list.' where slug = 'samuh-beach-nusa-dua' and status = 'active' and publication_status = 'published' and not_for is not distinct from null;
-- expect: UPDATE 1

-- 67. W-sekar-jagat-spa-nusa-dua-nusa-dua-why_its_here · sekar-jagat-spa-nusa-dua-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 7 items — Traditional Massage, Shirodhara and Spa Package. Bali Massage is 375K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'sekar-jagat-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'For an hour of Bali massage, Sekar Jagat Spa Nusa Dua charges 375K IDR. Traditional massage, shirodhara and spa packages are also among the day spa''s seven treatments, and you book on its website.';
-- expect: UPDATE 1

-- 68. W-sekar-jagat-spa-nusa-dua-nusa-dua-best_for · sekar-jagat-spa-nusa-dua-nusa-dua · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 300 minutes.' where slug = 'sekar-jagat-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Anyone ready to spend five hours on treatments';
-- expect: UPDATE 1

-- 69. W-serene-bali-spa-nusa-dua-why_its_here · serene-bali-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 13 items — Traditional Massage, Aromatherapy and Shirodhara. Booking is by WhatsApp.' where slug = 'serene-bali-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Serene Bali Spa, a day spa in Nusa Dua, has 13 treatments, with aromatherapy and shirodhara next to traditional massage. Bookings go by WhatsApp.';
-- expect: UPDATE 1

-- 70. W-serene-bali-spa-nusa-dua-best_for · serene-bali-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'serene-bali-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Anyone who wants to try shirodhara';
-- expect: UPDATE 1

-- 71. W-sofitel-spa-with-clarins-nusa-dua-why_its_here · sofitel-spa-with-clarins-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Nusa Dua. The published treatment list runs to 5 items — Spa Package, Recovery and Balinese Massage. Booking is on the venue''s own site.' where slug = 'sofitel-spa-with-clarins-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sofitel Spa with Clarins, a wellness spa in Nusa Dua, has five treatments, with a spa package, recovery sessions and Balinese massage among them. You book on the spa''s own website.';
-- expect: UPDATE 1

-- 72. W-sofitel-spa-with-clarins-nusa-dua-best_for · sofitel-spa-with-clarins-nusa-dua · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes.' where slug = 'sofitel-spa-with-clarins-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa visit that runs to three hours';
-- expect: UPDATE 1

-- 73. W-sunshine-spa-nusa-dua-nusa-dua-why_its_here · sunshine-spa-nusa-dua-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 29 items — Traditional Massage, Facial and Balinese Massage. Booking is by WhatsApp.' where slug = 'sunshine-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sunshine Spa Nusa Dua is a day spa whose 29 treatments cover facials as well as traditional and Balinese massage. Bookings are by WhatsApp.';
-- expect: UPDATE 1

-- 74. W-sunshine-spa-nusa-dua-nusa-dua-best_for · sunshine-spa-nusa-dua-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'sunshine-spa-nusa-dua-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial, booked by WhatsApp';
-- expect: UPDATE 1

-- 75. W-the-ritz-carlton-spa-amelia-island-nusa-dua-why_its_here · the-ritz-carlton-spa-amelia-island-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Spa in Nusa Dua. The published treatment list runs to 58 items — Facial, Traditional Massage and Manicure. Booking is on the venue''s own site.' where slug = 'the-ritz-carlton-spa-amelia-island-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Facials, traditional massage, manicures and a couple treatment are among the 58 treatments at The Ritz-Carlton Spa, Amelia Island, a spa in Nusa Dua. Treatments last up to 150 minutes; book on the spa''s website.';
-- expect: UPDATE 1

-- 76. W-the-ritz-carlton-spa-amelia-island-nusa-dua-best_for · the-ritz-carlton-spa-amelia-island-nusa-dua · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 150 minutes.' where slug = 'the-ritz-carlton-spa-amelia-island-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, or anyone after a facial or manicure';
-- expect: UPDATE 1

-- 77. W-the-spa-at-hotel-nikko-bali-benoa-beach-nusa-dua-why_its_here · the-spa-at-hotel-nikko-bali-benoa-beach-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Nusa Dua. The published treatment list runs to 15 items — Traditional Massage, Body Scrub and Balinese Massage. Balinese Massage is 400K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'the-spa-at-hotel-nikko-bali-benoa-beach-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Spa at Hotel Nikko Bali Benoa Beach, a wellness spa in Nusa Dua, lists 15 treatments, including body scrubs and traditional and Balinese massage. An hour of Balinese massage costs 400K IDR; book by WhatsApp.';
-- expect: UPDATE 1

-- 78. W-the-spa-at-hotel-nikko-bali-benoa-beach-nusa-dua-best_for · the-spa-at-hotel-nikko-bali-benoa-beach-nusa-dua · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'the-spa-at-hotel-nikko-bali-benoa-beach-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A body scrub or Balinese massage at Hotel Nikko';
-- expect: UPDATE 1

-- 79. W-the-u-spa-by-bali-relaxing-resort-nusa-dua-why_its_here · the-u-spa-by-bali-relaxing-resort-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Spa in Nusa Dua. The published treatment list runs to 14 items — Balinese Massage, Aromatherapy and Thai Massage. Stress Reliever Massage is 350K IDR for 45 minutes. Booking is on the venue''s own site.' where slug = 'the-u-spa-by-bali-relaxing-resort-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A 45-minute stress reliever massage costs 350K IDR at The U Spa by Bali Relaxing Resort, a spa in Nusa Dua. Its 14 treatments include Balinese and Thai massage and aromatherapy, and run as long as three hours. Book on the spa''s website.';
-- expect: UPDATE 1

-- 80. W-the-u-spa-by-bali-relaxing-resort-nusa-dua-best_for · the-u-spa-by-bali-relaxing-resort-nusa-dua · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'the-u-spa-by-bali-relaxing-resort-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A 45-minute stress reliever massage';
-- expect: UPDATE 1

-- 81. W-tunjungsari-spa-nusa-dua-why_its_here · tunjungsari-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Day spa in Nusa Dua. The published treatment list runs to 40 items — Body Scrub, Body Mask and Facial. Shiatsu is 350K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'tunjungsari-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Shiatsu at Tunjungsari Spa, a day spa in Nusa Dua, costs 350K IDR for an hour. The longest of its 40 treatments takes three hours, and the list also includes body scrubs, body masks and facials. Book on the spa''s website.';
-- expect: UPDATE 1

-- 82. W-tunjungsari-spa-nusa-dua-best_for · tunjungsari-spa-nusa-dua · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'tunjungsari-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A body scrub and mask, or an hour of shiatsu';
-- expect: UPDATE 1

-- 83. W-zahra-luxury-spa-nusa-dua-why_its_here · zahra-luxury-spa-nusa-dua · why_its_here · restore before
update venues set why_its_here = 'Spa in Nusa Dua. The published treatment list runs to 38 items — Traditional Massage, Spa Package and Couple Massage. Foot Massage is 410K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'zahra-luxury-spa-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Zahra Luxury Spa in Nusa Dua has 38 treatments, a couple massage among them, along with traditional massage and spa packages. A 60-minute foot massage costs 410K IDR, and the longest treatment lasts four hours. Book on the spa''s website.';
-- expect: UPDATE 1

-- 84. W-zahra-luxury-spa-nusa-dua-best_for · zahra-luxury-spa-nusa-dua · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 240 minutes.' where slug = 'zahra-luxury-spa-nusa-dua' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot massage, booked on the spa''s website';
-- expect: UPDATE 1

-- 85. W-ayu-spa-salon-sanur-why_its_here · ayu-spa-salon-sanur · why_its_here · restore before
update venues set why_its_here = 'Spa in Sanur. The published treatment list runs to 5 items — Facial, Hair Treatment and Haircut. Booking is on the venue''s own site.' where slug = 'ayu-spa-salon-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Facials, hair treatments and haircuts are on the five-treatment list at Ayu Spa & Salon in Sanur, booked through its website.';
-- expect: UPDATE 1

-- 86. W-ayu-spa-salon-sanur-best_for · ayu-spa-salon-sanur · best_for · restore before
update venues set best_for = 'Facial booked the same day.' where slug = 'ayu-spa-salon-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial or a haircut in Sanur';
-- expect: UPDATE 1

-- 87. W-blissful-senja-sanur-why_its_here · blissful-senja-sanur · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Sanur. The published treatment list runs to 31 items — Traditional Massage, Reflexology and Deep Tissue. Foot Massage is 200K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'blissful-senja-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Blissful Senja, a massage studio in Sanur, charges 200K IDR for an hour of foot massage. Its 31 treatments include traditional massage, reflexology, deep tissue and a couple treatment. The longest treatment is two hours, and you book on the studio''s website.';
-- expect: UPDATE 1

-- 88. W-blissful-senja-sanur-best_for · blissful-senja-sanur · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 120 minutes.' where slug = 'blissful-senja-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Deep tissue massage in Sanur';
-- expect: UPDATE 1

-- 89. W-griya-santrian-beach-resort-spa-sanur-why_its_here · griya-santrian-beach-resort-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'Day spa in Sanur. The published treatment list runs to 25 items — Manicure, Pedicure and Reflexology. Reflexology is 443K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'griya-santrian-beach-resort-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Reflexology at the day spa of Griya Santrian Beach Resort & Spa in Sanur costs 443K IDR for an hour. The 25 treatments also take in manicures and pedicures, and bookings go by WhatsApp.';
-- expect: UPDATE 1

-- 90. W-griya-santrian-beach-resort-spa-sanur-best_for · griya-santrian-beach-resort-spa-sanur · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'griya-santrian-beach-resort-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Anyone due a pedicure';
-- expect: UPDATE 1

-- 91. W-koa-spa-sanur-why_its_here · koa-spa-sanur · why_its_here · restore before
update venues set why_its_here = 'Day spa in Sanur. The published treatment list runs to 12 items — Traditional Massage, Balinese Massage and Reflexology. Customise your massage with our add ons is 200K IDR for 30 minutes. Booking is by WhatsApp.' where slug = 'koa-spa-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'You book Koa Spa, a day spa in Sanur, by WhatsApp. Its 12 treatments include traditional and Balinese massage and reflexology, and massage add-ons cost 200K IDR for 30 minutes.';
-- expect: UPDATE 1

-- 92. W-koa-spa-sanur-best_for · koa-spa-sanur · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'koa-spa-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Anyone who likes to customise a massage with add-ons';
-- expect: UPDATE 1

-- 93. W-massage-sanur-sanur-why_its_here · massage-sanur-sanur · why_its_here · restore before
update venues set why_its_here = 'Wellness centre in Sanur. The published treatment list runs to 14 items — Balinese Massage, Deep Tissue and Hot Stone. Traditional Balinese Massage is 400K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'massage-sanur-sanur' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Hot stone, deep tissue and Balinese massage are on the 14-treatment list at Massage Sanur, a wellness centre. A traditional Balinese massage costs 400K IDR for an hour, treatments run to two hours, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 94. W-massage-sanur-sanur-best_for · massage-sanur-sanur · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'massage-sanur-sanur' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Anyone who wants a hot stone massage';
-- expect: UPDATE 1
