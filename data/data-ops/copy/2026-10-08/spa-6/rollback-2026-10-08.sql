-- wave-spa-6-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-ubud-home-massage-service-ubud-why_its_here · ubud-home-massage-service-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 20 items — Traditional Massage, Foot Massage and Spa Package. Booking is by WhatsApp.' where slug = 'ubud-home-massage-service-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ubud Home Massage Service is a wellness spa in Ubud with 20 treatments, from traditional massage and foot massage to spa packages. Treatments run up to two hours, and bookings go through WhatsApp.';
-- expect: UPDATE 1

-- 2. W-ubud-home-massage-service-ubud-best_for · ubud-home-massage-service-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 120 minutes.' where slug = 'ubud-home-massage-service-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple treatment in Ubud, arranged over WhatsApp';
-- expect: UPDATE 1

-- 3. W-ubud-sari-spa-ubud-why_its_here · ubud-sari-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Spa in Ubud. The published treatment list runs to 17 items — Body Scrub, Traditional Massage and Neck & Shoulder. Ubud Sari Signature Massage is 250K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'ubud-sari-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A spa in Ubud with 17 treatments, including a body scrub, traditional massage and a neck and shoulder treatment. The Ubud Sari Signature Massage is 250K IDR for an hour, and the longest treatment runs five hours. Book by WhatsApp.';
-- expect: UPDATE 1

-- 4. W-ubud-sari-spa-ubud-best_for · ubud-sari-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 300 minutes; tired feet after a day of walking.' where slug = 'ubud-sari-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A stiff neck and shoulders, or a body scrub in Ubud';
-- expect: UPDATE 1

-- 5. W-ubud-village-resort-spa-ubud-why_its_here · ubud-village-resort-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Resort spa in Ubud. The published treatment list runs to 4 items — Traditional Massage and Balinese Massage. Booking is on the venue''s own site.' where slug = 'ubud-village-resort-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ubud Village Resort & Spa has a resort spa in Ubud with four treatments, traditional and Balinese massage among them. Treatments run up to two hours, and you book on the resort''s own website.';
-- expect: UPDATE 1

-- 6. W-ubud-village-resort-spa-ubud-best_for · ubud-village-resort-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'ubud-village-resort-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese or traditional massage at the resort in Ubud';
-- expect: UPDATE 1

-- 7. W-villa-sonia-ubud-ubud-why_its_here · villa-sonia-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 4 items — Balinese Massage. Balinese Deluxe room is 3491K IDR. Booking is on the venue''s own site.' where slug = 'villa-sonia-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Villa Sonia Ubud is a wellness spa in Ubud with four items on its list, a Balinese massage among them. Booking is on the venue''s own website.';
-- expect: UPDATE 1

-- 8. W-villa-sonia-ubud-ubud-best_for · villa-sonia-ubud-ubud · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'villa-sonia-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage at Villa Sonia';
-- expect: UPDATE 1

-- 9. W-villa-sonia-ubud-ubud-not_for · villa-sonia-ubud-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 3341K IDR.' where slug = 'villa-sonia-ubud-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from null;
-- expect: UPDATE 1

-- 10. W-vita-healing-massage-spa-ubud-why_its_here · vita-healing-massage-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Ubud. The published treatment list runs to 89 items — Traditional Massage, Spa Package and Cupping.' where slug = 'vita-healing-massage-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'There are 89 treatments on the list at Vita Healing Massage Spa, a massage studio in Ubud. They range from traditional massage and cupping to spa packages, and the longest treatment runs 165 minutes.';
-- expect: UPDATE 1

-- 11. W-vita-healing-massage-spa-ubud-best_for · vita-healing-massage-spa-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 165 minutes.' where slug = 'vita-healing-massage-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Cupping, or a couple treatment';
-- expect: UPDATE 1

-- 12. W-anantara-spa-uluwatu-bukit-why_its_here · anantara-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 11 items — Traditional Massage, Balinese Massage and Deep Tissue. Foot Reflexology is 750K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'anantara-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In the Bukit, Anantara Spa is a day spa with 11 treatments, from traditional and Balinese massage to deep tissue. An hour of foot reflexology costs 750K IDR, and booking is on the spa''s own website. The longest treatment runs two and a half hours.';
-- expect: UPDATE 1

-- 13. W-anantara-spa-uluwatu-bukit-best_for · anantara-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 150 minutes.' where slug = 'anantara-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, or deep tissue and Balinese massage';
-- expect: UPDATE 1

-- 14. W-anantara-spa-uluwatu-bukit-not_for · anantara-spa-uluwatu-bukit · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 750K IDR.' where slug = 'anantara-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A treatment for less than 750K IDR. Even an hour of foot reflexology costs 750K IDR.';
-- expect: UPDATE 1

-- 15. W-atmos-bodylab-uluwatu-bukit-why_its_here · atmos-bodylab-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in the Bukit. The published treatment list runs to 8 items — Traditional Massage, Deep Tissue and Recovery. Relaxation Massage is 700K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'atmos-bodylab-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'ATMOS BodyLab, a wellness spa in the Bukit, keeps eight treatments on its list, from traditional massage and deep tissue to recovery. A 60-minute relaxation massage costs 700K IDR, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 16. W-atmos-bodylab-uluwatu-bukit-best_for · atmos-bodylab-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'atmos-bodylab-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A traditional massage arranged by WhatsApp';
-- expect: UPDATE 1

-- 17. W-atmos-bodylab-uluwatu-bukit-not_for · atmos-bodylab-uluwatu-bukit · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 700K IDR.' where slug = 'atmos-bodylab-uluwatu-bukit' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A massage below 700K IDR, as nothing here is priced lower.';
-- expect: UPDATE 1

-- 18. W-ayana-spa-uluwatu-bukit-why_its_here · ayana-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Spa in the Bukit. The published treatment list runs to 23 items — Traditional Massage, Reflexology and Balinese Massage. Booking is by WhatsApp.' where slug = 'ayana-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'AYANA Spa in the Bukit has 23 treatments, with reflexology alongside traditional and Balinese massage. Treatments run up to three hours, and bookings are taken by WhatsApp.';
-- expect: UPDATE 1

-- 19. W-ayana-spa-uluwatu-bukit-best_for · ayana-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'ayana-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology once your feet have done a day of walking';
-- expect: UPDATE 1

-- 20. W-bali-bliss-massage-uluwatu-bukit-why_its_here · bali-bliss-massage-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Massage studio in the Bukit. The published treatment list runs to 22 items — Balinese Massage, Deep Tissue and Aromatherapy. Head, Neck & Shoulder is 250K IDR. Booking is on the venue''s own site.' where slug = 'bali-bliss-massage-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Bliss Massage is a massage studio in the Bukit with 22 treatments, including Balinese massage, deep tissue and aromatherapy. A head, neck & shoulder treatment costs 250K IDR, and booking is on the studio''s own website.';
-- expect: UPDATE 1

-- 21. W-bali-bliss-massage-uluwatu-bukit-best_for · bali-bliss-massage-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; tired feet after a day of walking.' where slug = 'bali-bliss-massage-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, or anyone choosing aromatherapy over deep tissue';
-- expect: UPDATE 1

-- 22. W-bali-surfing-camp-uluwatu-bukit-why_its_here · bali-surfing-camp-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Wellness centre in the Bukit. The published treatment list runs to 16 items — Yoga, Traditional Massage and Meditation. Booking is on the venue''s own site.' where slug = 'bali-surfing-camp-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Surfing Camp runs a wellness centre in the Bukit with 16 items on the list, from yoga and meditation to traditional massage. Booking is on the camp''s own website.';
-- expect: UPDATE 1

-- 23. W-bali-surfing-camp-uluwatu-bukit-best_for · bali-surfing-camp-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Yoga booked the same day.' where slug = 'bali-surfing-camp-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga in the Bukit';
-- expect: UPDATE 1

-- 24. W-bali-yoga-uluwatu-bukit-why_its_here · bali-yoga-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Yoga studio in the Bukit. The published treatment list runs to 16 items — Yoga, Meditation and Manicure. Booking is on the venue''s own site.' where slug = 'bali-yoga-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Yoga is a yoga studio in the Bukit whose 16 items run from yoga and meditation to a manicure. You book on the studio''s own website.';
-- expect: UPDATE 1

-- 25. W-bali-yoga-uluwatu-bukit-best_for · bali-yoga-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Yoga booked the same day.' where slug = 'bali-yoga-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga';
-- expect: UPDATE 1

-- 26. W-body-studio-bali-uluwatu-bukit-why_its_here · body-studio-bali-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Spa in the Bukit. The published treatment list runs to 15 items — Body Wrap, Body Treatment and Ice Bath. Booking is on the venue''s own site.' where slug = 'body-studio-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Body wraps, body treatments and an ice bath are among the 15 items at Body Studio Bali, a spa in the Bukit. The longest treatment lasts four hours, and booking is on the studio''s own website.';
-- expect: UPDATE 1

-- 27. W-body-studio-bali-uluwatu-bukit-best_for · body-studio-bali-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 240 minutes.' where slug = 'body-studio-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A body wrap or an ice bath in the Bukit';
-- expect: UPDATE 1

-- 28. W-d-nailbar-uluwatu-bukit-why_its_here · d-nailbar-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Beauty salon in the Bukit. The published treatment list runs to 34 items — Lashes, Traditional Massage and Brows. FOOT MASSAGE is 115K IDR. Booking is by WhatsApp.' where slug = 'd-nailbar-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lashes, brows and traditional massage are all on the list at D’Nailbar, a beauty salon in the Bukit with 34 treatments. A foot massage costs 115K IDR and the longest treatment runs two hours. You book by WhatsApp.';
-- expect: UPDATE 1

-- 29. W-d-nailbar-uluwatu-bukit-best_for · d-nailbar-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'd-nailbar-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Lashes and brows, or a foot massage after walking';
-- expect: UPDATE 1

-- 30. W-flex-flow-uluwatu-bukit-why_its_here · flex-flow-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in the Bukit. The published treatment list runs to 7 items — Lymphatic Massage, Sports Massage and Cupping. Sport Massage Bali is 400K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'flex-flow-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lymphatic massage, sports massage and cupping are on the seven-item list at Flex & Flow, a wellness spa in the Bukit. The Sport Massage Bali is 400K IDR for 60 minutes, booked on the spa''s own website.';
-- expect: UPDATE 1

-- 31. W-flex-flow-uluwatu-bukit-best_for · flex-flow-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Lymphatic massage booked the same day.' where slug = 'flex-flow-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A lymphatic massage in the Bukit';
-- expect: UPDATE 1

-- 32. W-fresh-beauty-lounge-uluwatu-bukit-why_its_here · fresh-beauty-lounge-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in the Bukit. The published treatment list runs to 30 items — Facial, Body Scrub and Head Massage. Classic Balinese Massage is 475K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'fresh-beauty-lounge-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Fresh Beauty Lounge, a wellness spa in the Bukit, does 30 treatments, from facials and body scrubs to head massage. A classic Balinese massage is 475K IDR for 60 minutes, and the longest treatment lasts three and a half hours. Bookings go through WhatsApp.';
-- expect: UPDATE 1

-- 33. W-fresh-beauty-lounge-uluwatu-bukit-best_for · fresh-beauty-lounge-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 210 minutes.' where slug = 'fresh-beauty-lounge-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Facials and head massage in the Bukit';
-- expect: UPDATE 1

-- 34. W-holiday-inn-resort-baruna-bali-tea-tree-spa-uluwatu-bukit-why_its_here · holiday-inn-resort-baruna-bali-tea-tree-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 4 items — Balinese Massage, Acupressure and Facial. Balinese Massage is 800K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'holiday-inn-resort-baruna-bali-tea-tree-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Tea Tree Spa is the day spa at Holiday Inn Resort Baruna Bali, in the Bukit. Its four treatments include Balinese massage, acupressure and a facial, and an hour of Balinese massage is 800K IDR. Book by WhatsApp.';
-- expect: UPDATE 1

-- 35. W-holiday-inn-resort-baruna-bali-tea-tree-spa-uluwatu-bukit-best_for · holiday-inn-resort-baruna-bali-tea-tree-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'holiday-inn-resort-baruna-bali-tea-tree-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage at Tea Tree Spa';
-- expect: UPDATE 1

-- 36. W-karma-spa-uluwatu-bukit-why_its_here · karma-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 18 items — Traditional Massage, Balinese Massage and Sauna. SIGNATURE ROYAL MASSAGE is 350K IDR for 75 minutes. Booking is on the venue''s own site.' where slug = 'karma-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Karma Spa, a day spa in the Bukit, has 18 treatments, from traditional and Balinese massage to the sauna, the longest treatment lasting three hours. The Signature Royal Massage runs 75 minutes and costs 350K IDR, and you book on the spa''s own website.';
-- expect: UPDATE 1

-- 37. W-karma-spa-uluwatu-bukit-best_for · karma-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 180 minutes.' where slug = 'karma-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple treatment, or time in the sauna';
-- expect: UPDATE 1

-- 38. W-laia-spa-uluwatu-bukit-why_its_here · laia-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Massage studio in the Bukit. The published treatment list runs to 23 items — Traditional Massage, Balinese Massage and Deep Tissue. Booking is by WhatsApp.' where slug = 'laia-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'LaiA Spa is a massage studio in the Bukit, and bookings for its 23 treatments go through WhatsApp. Traditional massage, Balinese massage and deep tissue are among them.';
-- expect: UPDATE 1

-- 39. W-laia-spa-uluwatu-bukit-best_for · laia-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'laia-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A traditional or deep-tissue massage in the Bukit';
-- expect: UPDATE 1

-- 40. W-luhur-spa-uluwatu-bukit-why_its_here · luhur-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Spa in the Bukit. The published treatment list runs to 48 items — Foot Massage, Spa Package and Balinese Massage. Head Massage is 210K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'luhur-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Luhur Spa in the Bukit lists 48 treatments, with foot massage, Balinese massage and spa packages among them; the longest treatment runs four hours. An hour-long head massage costs 210K IDR. To book, message the spa on WhatsApp.';
-- expect: UPDATE 1

-- 41. W-luhur-spa-uluwatu-bukit-best_for · luhur-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 240 minutes; tired feet after a day of walking.' where slug = 'luhur-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot massage when the walking is done, or an hour of head massage';
-- expect: UPDATE 1

-- 42. W-oaza-uluwatu-uluwatu-bukit-why_its_here · oaza-uluwatu-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 11 items — Facial, Traditional Massage and Spa Package. Four-Hand Massage is 470K IDR. Booking is by WhatsApp.' where slug = 'oaza-uluwatu-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A four-hand massage at OAZA Uluwatu, a day spa in the Bukit, costs 470K IDR. The other treatments among its 11 include facials, traditional massage and spa packages. The longest treatment takes 130 minutes, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 43. W-oaza-uluwatu-uluwatu-bukit-best_for · oaza-uluwatu-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 130 minutes.' where slug = 'oaza-uluwatu-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A four-hand massage, or a facial in the Bukit';
-- expect: UPDATE 1

-- 44. W-our-spa-boutique-bali-uluwatu-bukit-why_its_here · our-spa-boutique-bali-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 32 items — Facial, Hair Treatment and Traditional Massage. Booking is on the venue''s own site.' where slug = 'our-spa-boutique-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Facials, hair treatments and traditional massage all feature at Our Spa & Boutique Bali, a day spa in the Bukit with 32 treatments. Booking is on its own website.';
-- expect: UPDATE 1

-- 45. W-our-spa-boutique-bali-uluwatu-bukit-best_for · our-spa-boutique-bali-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; tired feet after a day of walking.' where slug = 'our-spa-boutique-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial and hair treatment, or a couple booking';
-- expect: UPDATE 1

-- 46. W-pandawa-cliff-estate-uluwatu-bukit-why_its_here · pandawa-cliff-estate-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in the Bukit. The published treatment list runs to 8 items — Balinese Massage, Reflexology and Body Scrub. Booking is on the venue''s own site.' where slug = 'pandawa-cliff-estate-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At Pandawa Cliff Estate, a wellness spa in the Bukit, the eight treatments include Balinese massage, reflexology and a body scrub. Bookings are made on the estate''s own website.';
-- expect: UPDATE 1

-- 47. W-pandawa-cliff-estate-uluwatu-bukit-best_for · pandawa-cliff-estate-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'pandawa-cliff-estate-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage or reflexology after a day walking the Bukit';
-- expect: UPDATE 1

-- 48. W-piccolina-bali-uluwatu-bukit-why_its_here · piccolina-bali-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Beauty salon in the Bukit. The published treatment list runs to 56 items — Neck & Shoulder, Head Massage and Haircut. Signature Foot Massage is 120K IDR. Booking runs through Fresha.' where slug = 'piccolina-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Piccolina Bali is a beauty salon in the Bukit that takes bookings through Fresha. Among its 56 treatments are haircuts, head massage and a neck & shoulder treatment, and the Signature Foot Massage is 120K IDR.';
-- expect: UPDATE 1

-- 49. W-piccolina-bali-uluwatu-bukit-best_for · piccolina-bali-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'piccolina-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot or head massage, booked on Fresha after a day of walking';
-- expect: UPDATE 1

-- 50. W-professional-massage-uluwatu-uluwatu-bukit-why_its_here · professional-massage-uluwatu-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in the Bukit. The published treatment list runs to 12 items — Traditional Massage, Spa Package and Hot Stone. Traditional Balinese Massage is 400K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'professional-massage-uluwatu-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Professional Massage Uluwatu, in the Bukit, is a wellness spa with 12 treatments: hot stone, traditional massage and spa packages among them. A traditional Balinese massage is 400K IDR for an hour, booked on the spa''s own website. Treatments run up to two hours.';
-- expect: UPDATE 1

-- 51. W-professional-massage-uluwatu-uluwatu-bukit-best_for · professional-massage-uluwatu-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'professional-massage-uluwatu-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A hot stone massage, or an hour of traditional Balinese massage';
-- expect: UPDATE 1

-- 52. W-rika-beauty-spa-uluwatu-bukit-why_its_here · rika-beauty-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 22 items — Balinese Massage, Traditional Massage and Waxing. Balinese Massage is 200K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'rika-beauty-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An hour of Balinese massage costs 200K IDR at Rika Beauty & Spa, a day spa in the Bukit. Its 22 treatments also include traditional massage and waxing, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 53. W-rika-beauty-spa-uluwatu-bukit-best_for · rika-beauty-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; tired feet after a day of walking.' where slug = 'rika-beauty-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Booking as a couple, or an hour of Balinese massage';
-- expect: UPDATE 1

-- 54. W-rose-petal-beauty-center-uluwatu-bukit-why_its_here · rose-petal-beauty-center-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Beauty salon in the Bukit. The published treatment list runs to 28 items — Facial, Lashes and Haircut. Booking runs through Fresha.' where slug = 'rose-petal-beauty-center-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Facials, lashes and haircuts are among the 28 treatments at Rose Petal Beauty Center, a beauty salon in the Bukit. You book through Fresha.';
-- expect: UPDATE 1

-- 55. W-rose-petal-beauty-center-uluwatu-bukit-best_for · rose-petal-beauty-center-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Facial booked the same day.' where slug = 'rose-petal-beauty-center-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial, booked on Fresha';
-- expect: UPDATE 1

-- 56. W-salty-face-bali-uluwatu-bukit-why_its_here · salty-face-bali-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 38 items — Facial, Balinese Massage and Lashes. 60 Minute Balinese Massage is 345K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'salty-face-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At salty face Bali, a day spa in the Bukit, the 38 treatments include facials, lashes and Balinese massage. A 60-minute Balinese massage costs 345K IDR, and booking is on the spa''s own website.';
-- expect: UPDATE 1

-- 57. W-salty-face-bali-uluwatu-bukit-best_for · salty-face-bali-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Facial booked the same day.' where slug = 'salty-face-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial';
-- expect: UPDATE 1

-- 58. W-sean-spa-bali-uluwatu-bukit-why_its_here · sean-spa-bali-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Spa in the Bukit. The published treatment list runs to 8 items — Balinese Massage, Deep Tissue and Hot Stone. Booking is on the venue''s own site.' where slug = 'sean-spa-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sean Spa Bali is a spa in the Bukit with eight treatments on its list, including Balinese massage, deep tissue and hot stone. Bookings go through the spa''s own website.';
-- expect: UPDATE 1

-- 59. W-sean-spa-bali-uluwatu-bukit-best_for · sean-spa-bali-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'sean-spa-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples in the Bukit choosing between Balinese massage and deep tissue';
-- expect: UPDATE 1

-- 60. W-senses-spa-at-biu-biu-resort-uluwatu-bukit-why_its_here · senses-spa-at-biu-biu-resort-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Spa in the Bukit. The published treatment list runs to 33 items — Couple Massage, Facial and Balinese Massage. Reflexology is 400K IDR for 50 minutes. Booking is by WhatsApp.' where slug = 'senses-spa-at-biu-biu-resort-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Senses Spa at Biu Biu Resort, in the Bukit, has 33 treatments, among them a couple massage, facials and Balinese massage, and the longest treatment runs two hours. Fifty minutes of reflexology is 400K IDR. Book by WhatsApp.';
-- expect: UPDATE 1

-- 61. W-senses-spa-at-biu-biu-resort-uluwatu-bukit-best_for · senses-spa-at-biu-biu-resort-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 120 minutes.' where slug = 'senses-spa-at-biu-biu-resort-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple massage at the resort, or 50 minutes of reflexology';
-- expect: UPDATE 1

-- 62. W-shiki-spa-uluwatu-bukit-why_its_here · shiki-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 77 items — Waxing, Lashes and Manicure. FOOT MASSAGE / REFLEXOLOGY is 150K IDR for 60 minutes.' where slug = 'shiki-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Shiki Spa is a day spa in the Bukit with a long list: 77 treatments, among them waxing, lashes and manicures. An hour of foot massage or reflexology costs 150K IDR. The longest treatment runs two hours.';
-- expect: UPDATE 1

-- 63. W-shiki-spa-uluwatu-bukit-best_for · shiki-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'shiki-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot massage when walking has worn you out, or lashes and waxing';
-- expect: UPDATE 1

-- 64. W-sohamsa-ocean-estate-uluwatu-bukit-why_its_here · sohamsa-ocean-estate-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Spa in the Bukit. The published treatment list runs to 4 items — Balinese Massage, Reflexology and Body Scrub. Booking is on the venue''s own site.' where slug = 'sohamsa-ocean-estate-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sohamsa Ocean Estate in the Bukit runs a spa with four treatments, among them a Balinese massage, reflexology and a body scrub. Booking is on the estate''s own website.';
-- expect: UPDATE 1

-- 65. W-sohamsa-ocean-estate-uluwatu-bukit-best_for · sohamsa-ocean-estate-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'sohamsa-ocean-estate-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology when a day on foot has left your feet tired';
-- expect: UPDATE 1

-- 66. W-spa-shell-uluwatu-bukit-why_its_here · spa-shell-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Spa in the Bukit. The published treatment list runs to 18 items — Balinese Massage, Deep Tissue and Reflexology. Balinese Massage is 220K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'spa-shell-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Spa Shell is a Bukit spa with 18 treatments, including Balinese massage, deep tissue and reflexology. An hour of Balinese massage costs 220K IDR, and you book on the spa''s own website.';
-- expect: UPDATE 1

-- 67. W-spa-shell-uluwatu-bukit-best_for · spa-shell-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'spa-shell-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A day of walking, then reflexology for your feet';
-- expect: UPDATE 1

-- 68. W-spring-spa-bingin-uluwatu-bukit-why_its_here · spring-spa-bingin-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Spa in the Bukit. The published treatment list runs to 6 items — Traditional Massage, Facial and Foot Massage.' where slug = 'spring-spa-bingin-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Spring Spa Bingin is a spa in the Bukit with six treatments on its list, among them traditional massage, a facial and a foot massage.';
-- expect: UPDATE 1

-- 69. W-spring-spa-bingin-uluwatu-bukit-best_for · spring-spa-bingin-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'spring-spa-bingin-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot massage in Bingin when you have walked enough for the day';
-- expect: UPDATE 1

-- 70. W-supernatural-wellbeing-uluwatu-bukit-why_its_here · supernatural-wellbeing-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Massage studio in the Bukit. The published treatment list runs to 4 items — Swedish, Aromatherapy and Hot Stone.' where slug = 'supernatural-wellbeing-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Supernatural Wellbeing is a massage studio in the Bukit with four treatments, among them Swedish, aromatherapy and hot stone massage.';
-- expect: UPDATE 1

-- 71. W-supernatural-wellbeing-uluwatu-bukit-best_for · supernatural-wellbeing-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Swedish booked the same day.' where slug = 'supernatural-wellbeing-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Swedish massage in the Bukit';
-- expect: UPDATE 1

-- 72. W-the-elysian-uluwatu-bukit-why_its_here · the-elysian-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in the Bukit. The published treatment list runs to 80 items — Facial, Traditional Massage and Body Scrub. Nail Gel Color Hand or Foot is 350K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'the-elysian-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Elysian is a wellness spa in the Bukit with 80 treatments, from facials and body scrubs to traditional massage, the longest treatment lasting three hours. Gel colour on hand or foot nails is 350K IDR for 60 minutes, and bookings go through WhatsApp.';
-- expect: UPDATE 1

-- 73. W-the-elysian-uluwatu-bukit-best_for · the-elysian-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 180 minutes.' where slug = 'the-elysian-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Gel nails and a facial, or a treatment as a couple';
-- expect: UPDATE 1

-- 74. W-the-istana-spa-uluwatu-bukit-why_its_here · the-istana-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 8 items — Ice Bath. Booking is on the venue''s own site.' where slug = 'the-istana-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Istana Spa is a day spa in the Bukit with eight items on its list, an ice bath among them; the longest treatment runs three hours. You book on the spa''s own website.';
-- expect: UPDATE 1

-- 75. W-the-istana-spa-uluwatu-bukit-best_for · the-istana-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes.' where slug = 'the-istana-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An ice bath at a Bukit day spa';
-- expect: UPDATE 1

-- 76. W-the-resting-koala-uluwatu-bukit-why_its_here · the-resting-koala-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 20 items — Foot Massage, Balinese Massage and Spa Package. The Foot Release is 210K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'the-resting-koala-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Resting Koala, a day spa in the Bukit, has 20 treatments, including foot massage, Balinese massage and spa packages, the longest treatment lasting two hours. Its Foot Release is 210K IDR for 60 minutes, and bookings go through WhatsApp.';
-- expect: UPDATE 1

-- 77. W-the-resting-koala-uluwatu-bukit-best_for · the-resting-koala-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'the-resting-koala-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'The Foot Release after a day of walking, or a Balinese massage';
-- expect: UPDATE 1

-- 78. W-the-spa-uluwatu-bukit-why_its_here · the-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 30 items — Traditional Massage, Spa Package and Hot Stone. Booking is on the venue''s own site.' where slug = 'the-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Spa, a day spa in the Bukit, lists 30 treatments, including traditional massage, hot stone and spa packages. The longest treatment runs two hours. Booking is on its own website.';
-- expect: UPDATE 1

-- 79. W-the-spa-uluwatu-bukit-best_for · the-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'the-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Hot stone or a spa package in the Bukit';
-- expect: UPDATE 1

-- 80. W-the-wellness-spa-uluwatu-bukit-why_its_here · the-wellness-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 116 items — Traditional Massage, Facial and Waxing. Foot Massage is 605K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'the-wellness-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'With 116 treatments, The Wellness Spa is a day spa in the Bukit that covers traditional massage, facials and waxing, with the longest treatment running four hours. A 60-minute foot massage is 605K IDR; book on the spa''s own website.';
-- expect: UPDATE 1

-- 81. W-the-wellness-spa-uluwatu-bukit-best_for · the-wellness-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 240 minutes.' where slug = 'the-wellness-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A partner treatment, or waxing and a facial';
-- expect: UPDATE 1

-- 82. W-win-bali-spa-uluwatu-bukit-why_its_here · win-bali-spa-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Spa in the Bukit. The published treatment list runs to 20 items — Balinese Massage, Traditional Massage and Neck & Shoulder. Foot Reflexology is 180K IDR for 60 minutes.' where slug = 'win-bali-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Win Bali Spa is a spa in the Bukit where an hour of foot reflexology costs 180K IDR. Its 20 treatments also take in Balinese massage, traditional massage and a neck and shoulder treatment, and the longest treatment runs two hours.';
-- expect: UPDATE 1

-- 83. W-win-bali-spa-uluwatu-bukit-best_for · win-bali-spa-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'win-bali-spa-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Foot reflexology after a long day on foot';
-- expect: UPDATE 1

-- 84. W-wrong-gym-uluwatu-bukit-why_its_here · wrong-gym-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Wellness centre in the Bukit. The published treatment list runs to 6 items — Ice Bath, Sauna and Steam.' where slug = 'wrong-gym-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Wrong Gym, a wellness centre in the Bukit, has six items on the list, from an ice bath to a sauna and steam.';
-- expect: UPDATE 1

-- 85. W-wrong-gym-uluwatu-bukit-best_for · wrong-gym-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Ice bath booked the same day.' where slug = 'wrong-gym-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An ice bath';
-- expect: UPDATE 1

-- 86. W-xin-spa-beauty-pecatu-uluwatu-bali-uluwatu-bukit-why_its_here · xin-spa-beauty-pecatu-uluwatu-bali-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Day spa in the Bukit. The published treatment list runs to 42 items — Nails, Traditional Massage and Balinese Massage. Booking is by WhatsApp.' where slug = 'xin-spa-beauty-pecatu-uluwatu-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Nails sit alongside traditional and Balinese massage at Xin Spa Beauty in Pecatu, a day spa in the Bukit with 42 treatments. Bookings are by WhatsApp.';
-- expect: UPDATE 1

-- 87. W-xin-spa-beauty-pecatu-uluwatu-bali-uluwatu-bukit-best_for · xin-spa-beauty-pecatu-uluwatu-bali-uluwatu-bukit · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'xin-spa-beauty-pecatu-uluwatu-bali-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Nails or a traditional massage in Pecatu';
-- expect: UPDATE 1

-- 88. W-zahra-spa-uluwatu-uluwatu-bukit-why_its_here · zahra-spa-uluwatu-uluwatu-bukit · why_its_here · restore before
update venues set why_its_here = 'Spa in the Bukit. The published treatment list runs to 22 items — Traditional Massage, Balinese Massage and Neck & Shoulder. Child Body Massage is 245K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'zahra-spa-uluwatu-uluwatu-bukit' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Zahra Spa Uluwatu is a spa in the Bukit with 22 treatments, from traditional and Balinese massage to a neck & shoulder treatment. They run up to two hours. A one-hour body massage for a child costs 245K IDR, booked on the spa''s own website.';
-- expect: UPDATE 1

-- 89. W-zahra-spa-uluwatu-uluwatu-bukit-best_for · zahra-spa-uluwatu-uluwatu-bukit · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'zahra-spa-uluwatu-uluwatu-bukit' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A family visit, with a body massage for the child';
-- expect: UPDATE 1
