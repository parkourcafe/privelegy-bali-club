-- wave-spa-2-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-respawn-spa-bali-canggu-why_its_here · respawn-spa-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 67 items — Traditional Massage, Body Treatment and Balinese Massage. Head massage is 250K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'respawn-spa-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A wellness spa in Canggu with 67 treatments, among them traditional massage, Balinese massage and body treatments. An hour of head massage costs 250K IDR, and the longest treatments run 150 minutes. Book by WhatsApp.';
-- expect: UPDATE 1

-- 2. W-respawn-spa-bali-canggu-best_for · respawn-spa-bali-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes; tired feet after a day of walking.' where slug = 'respawn-spa-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A head massage on its own, or a Balinese massage';
-- expect: UPDATE 1

-- 3. W-revive-bali-canggu-why_its_here · revive-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'Spa in Canggu. The published treatment list runs to 50 items — Manicure, Foot Massage and Body Scrub. Traditional Balinese Massage is 330K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'revive-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Revive Bali is a Canggu spa with 50 treatments on its list, from manicures to foot massage and body scrubs. A traditional Balinese massage is 330K IDR for an hour, and bookings go through WhatsApp.';
-- expect: UPDATE 1

-- 4. W-revive-bali-canggu-best_for · revive-bali-canggu · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'revive-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Getting your nails done, or a foot massage';
-- expect: UPDATE 1

-- 5. W-rosies-nail-bar-canggu-why_its_here · rosies-nail-bar-canggu · why_its_here · restore before
update venues set why_its_here = 'Nail salon in Canggu. The published treatment list runs to 45 items — Pedicure, Manicure and Nails. 30 minute Massage is 150K IDR. Booking is by WhatsApp.' where slug = 'rosies-nail-bar-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pedicures, manicures and nails all sit on the 45-treatment list at Rosies Nail Bar, a nail salon in Canggu. A 30-minute massage costs 150K IDR, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 6. W-rosies-nail-bar-canggu-best_for · rosies-nail-bar-canggu · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'rosies-nail-bar-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A pedicure, or a 30-minute massage';
-- expect: UPDATE 1

-- 7. W-six-senses-spas-canggu-why_its_here · six-senses-spas-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 16 items — Javanese Lulur, Deep Tissue and Traditional Massage.' where slug = 'six-senses-spas-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Six Senses Spas in Canggu is a wellness spa with 16 treatments, among them Javanese lulur, deep tissue and traditional massage.';
-- expect: UPDATE 1

-- 8. W-six-senses-spas-canggu-best_for · six-senses-spas-canggu · best_for · restore before
update venues set best_for = 'Javanese lulur booked the same day.' where slug = 'six-senses-spas-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Javanese lulur or a deep tissue massage';
-- expect: UPDATE 1

-- 9. W-swara-spa-canggu-why_its_here · swara-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 13 items — Couple Massage, Nails and Traditional Massage. Booking is on the venue''s own site.' where slug = 'swara-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Swara Spa, a day spa in Canggu, has 13 treatments on its list, with a couple massage alongside traditional massage and nails. Booking is on the spa''s own website.';
-- expect: UPDATE 1

-- 10. W-swara-spa-canggu-best_for · swara-spa-canggu · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'swara-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple massage in Canggu, with nails on the list too';
-- expect: UPDATE 1

-- 11. W-the-ark-recovery-canggu-why_its_here · the-ark-recovery-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness centre in Canggu. The published treatment list runs to 7 items — Traditional Massage, Balinese Massage and Deep Tissue. The Flow traditional balinese massage is 500K IDR. Booking runs through Fresha.' where slug = 'the-ark-recovery-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Ark Recovery is a wellness centre in Canggu with seven treatments, deep tissue and traditional Balinese massage among them. The longest run two hours. The Flow, a traditional Balinese massage, costs 500K IDR, and booking runs through Fresha.';
-- expect: UPDATE 1

-- 12. W-the-ark-recovery-canggu-best_for · the-ark-recovery-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'the-ark-recovery-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Deep tissue work, or a traditional Balinese massage';
-- expect: UPDATE 1

-- 13. W-the-ark-recovery-canggu-not_for · the-ark-recovery-canggu · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 500K IDR.' where slug = 'the-ark-recovery-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone hoping to pay less than 500K IDR, the lowest price on the list';
-- expect: UPDATE 1

-- 14. W-the-freebird-studio-canggu-why_its_here · the-freebird-studio-canggu · why_its_here · restore before
update venues set why_its_here = 'Yoga studio in Canggu. The published treatment list runs to 14 items — Yoga and Meditation. Core Circuit is 185K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'the-freebird-studio-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In Canggu, The Freebird Studio is a yoga studio with 14 sessions on its list, covering yoga and meditation, and the longest last two hours. Core Circuit costs 185K IDR for 60 minutes; book on the studio''s own website.';
-- expect: UPDATE 1

-- 15. W-the-freebird-studio-canggu-best_for · the-freebird-studio-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'the-freebird-studio-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A yoga class or a meditation session';
-- expect: UPDATE 1

-- 16. W-the-path-yoga-center-canggu-why_its_here · the-path-yoga-center-canggu · why_its_here · restore before
update venues set why_its_here = 'Yoga studio in Canggu. The published treatment list runs to 6 items — Spa Package and Yoga. Beginner Flow is 165K IDR for 75 minutes. Booking is on the venue''s own site.' where slug = 'the-path-yoga-center-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At The Path Yoga Center, a yoga studio in Canggu, the six-item list runs from yoga to a spa package. A 75-minute Beginner Flow costs 165K IDR, and booking is on the centre''s own website.';
-- expect: UPDATE 1

-- 17. W-the-path-yoga-center-canggu-best_for · the-path-yoga-center-canggu · best_for · restore before
update venues set best_for = 'Spa package booked the same day.' where slug = 'the-path-yoga-center-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga beginners, and anyone who would rather book the spa package';
-- expect: UPDATE 1

-- 18. W-therapy-day-spa-canggu-why_its_here · therapy-day-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Spa in Canggu. The published treatment list runs to 21 items — Scalp Treatment, Cream Bath and Spa Package. Reflexology is 300K IDR for 30 minutes. Booking is by WhatsApp.' where slug = 'therapy-day-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Therapy Day Spa is a Canggu spa whose 21 treatments include scalp treatments, cream baths and spa packages. Treatments last up to three hours, and 30 minutes of reflexology costs 300K IDR. Book by WhatsApp.';
-- expect: UPDATE 1

-- 19. W-therapy-day-spa-canggu-best_for · therapy-day-spa-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'therapy-day-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Thirty minutes of reflexology, a cream bath or a scalp treatment';
-- expect: UPDATE 1

-- 20. W-tonic-canggu-canggu-why_its_here · tonic-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 45 items — Traditional Massage, Balinese Massage and Deep Tissue. Super Relaxing Foot Massage is 250K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'tonic-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Deep tissue, traditional and Balinese massage are among the 45 treatments at Tonic Canggu, a day spa. A one-hour foot massage costs 250K IDR, the longest treatments run three hours, and you book on the spa''s own website.';
-- expect: UPDATE 1

-- 21. W-tonic-canggu-canggu-best_for · tonic-canggu-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'tonic-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Deep tissue, or the one-hour foot massage';
-- expect: UPDATE 1

-- 22. W-tyce-spa-bali-canggu-why_its_here · tyce-spa-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 85 items — Waxing, Traditional Massage and Foot Massage. Foot Massage is 160K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'tyce-spa-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Waxing sits next to traditional massage and foot massage on the 85-treatment list at Tyce Spa Bali, a wellness spa in Canggu. An hour of foot massage costs 160K IDR, and the longest treatments run two hours. Bookings are taken on the spa''s own website.';
-- expect: UPDATE 1

-- 23. W-tyce-spa-bali-canggu-best_for · tyce-spa-bali-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'tyce-spa-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Waxing, or a foot massage at 160K IDR';
-- expect: UPDATE 1

-- 24. W-udara-bali-spa-canggu-why_its_here · udara-bali-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 20 items — Balinese Massage, Deep Tissue and Foot Massage. Foot Massage is 540K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'udara-bali-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Udara Bali Spa is a Canggu day spa whose 20 treatments include Balinese massage, deep tissue and foot massage. A 60-minute foot massage is 540K IDR, and the longest sessions last two and a half hours. Book by WhatsApp.';
-- expect: UPDATE 1

-- 25. W-udara-bali-spa-canggu-best_for · udara-bali-spa-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes; tired feet after a day of walking.' where slug = 'udara-bali-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese or deep tissue massage';
-- expect: UPDATE 1

-- 26. W-umalas-canggu-why_its_here · umalas-canggu · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Canggu. The published treatment list runs to 13 items — Traditional Massage and Spa Package. BALINESE full body massage is 400K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'umalas-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'UMALAS is a massage studio in Canggu with 13 treatments, traditional massage and spa packages among them. A full-body Balinese massage costs 400K IDR for 60 minutes, and booking is on the studio''s own website.';
-- expect: UPDATE 1

-- 27. W-umalas-canggu-best_for · umalas-canggu · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'umalas-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Traditional massage or a spa package';
-- expect: UPDATE 1

-- 28. W-urban-oasis-canggu-why_its_here · urban-oasis-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 5 items — Spa Package, Thai Massage and Recovery. THAI FLOW is 550K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'urban-oasis-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Urban Oasis keeps its Canggu day spa list short: five treatments, among them a spa package, Thai massage and recovery sessions. An hour of Thai Flow is 550K IDR; book on the venue''s own website.';
-- expect: UPDATE 1

-- 29. W-urban-oasis-canggu-best_for · urban-oasis-canggu · best_for · restore before
update venues set best_for = 'Spa package booked the same day.' where slug = 'urban-oasis-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Thai massage or a recovery session';
-- expect: UPDATE 1

-- 30. W-wave-house-bali-canggu-why_its_here · wave-house-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 5 items — Balinese Massage, Body Scrub and Javanese Lulur. Booking is on the venue''s own site.' where slug = 'wave-house-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Wave House Bali is a day spa in Canggu with five treatments, including Balinese massage, body scrubs and Javanese lulur. Bookings go through its own website.';
-- expect: UPDATE 1

-- 31. W-wave-house-bali-canggu-best_for · wave-house-bali-canggu · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'wave-house-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Javanese lulur or a body scrub';
-- expect: UPDATE 1

-- 32. W-avisha-wellness-spa-bali-jimbaran-why_its_here · avisha-wellness-spa-bali-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Day spa in Jimbaran. The published treatment list runs to 22 items — Traditional Massage, Facial and Spa Package. Booking runs through Zenoti.' where slug = 'avisha-wellness-spa-bali-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'With 22 treatments on its list, Avisha Wellness & Spa Bali is a day spa in Jimbaran covering traditional massage, facials and spa packages. Booking runs through Zenoti.';
-- expect: UPDATE 1

-- 33. W-avisha-wellness-spa-bali-jimbaran-best_for · avisha-wellness-spa-bali-jimbaran · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes.' where slug = 'avisha-wellness-spa-bali-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A long block of treatments, up to two and a half hours';
-- expect: UPDATE 1

-- 34. W-ayana-spa-jimbaran-why_its_here · ayana-spa-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Spa in Jimbaran. The published treatment list runs to 23 items — Traditional Massage, Reflexology and Balinese Massage. Booking is by WhatsApp.' where slug = 'ayana-spa-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'AYANA Spa in Jimbaran lists 23 treatments, with reflexology alongside traditional and Balinese massage. Treatments run as long as three hours, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 35. W-ayana-spa-jimbaran-best_for · ayana-spa-jimbaran · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'ayana-spa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology, or a Balinese massage';
-- expect: UPDATE 1

-- 36. W-balangan-surf-resort-jimbaran-why_its_here · balangan-surf-resort-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Jimbaran. The published treatment list runs to 4 items — Balinese Massage. Booking is by WhatsApp.' where slug = 'balangan-surf-resort-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Balangan Surf Resort''s wellness spa in Jimbaran lists four treatments, Balinese massage among them. Booking is by WhatsApp.';
-- expect: UPDATE 1

-- 37. W-balangan-surf-resort-jimbaran-best_for · balangan-surf-resort-jimbaran · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'balangan-surf-resort-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage, booked by WhatsApp';
-- expect: UPDATE 1

-- 38. W-bamboo-spa-jimbaran-why_its_here · bamboo-spa-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Jimbaran. The published treatment list runs to 17 items — Reflexology, Couple Massage and Traditional Massage. Foot Reflexology is 350K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'bamboo-spa-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Foot reflexology at Bamboo Spa, a wellness spa in Jimbaran, costs 350K IDR for an hour. The 17-treatment list also has a couple massage and traditional massage, and the longest treatments run three hours. Bookings go through the spa''s own website.';
-- expect: UPDATE 1

-- 39. W-bamboo-spa-jimbaran-best_for · bamboo-spa-jimbaran · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 180 minutes.' where slug = 'bamboo-spa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple massage, or foot reflexology on your own';
-- expect: UPDATE 1

-- 40. W-bombora-balangan-resort-jimbaran-why_its_here · bombora-balangan-resort-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Spa in Jimbaran. The published treatment list runs to 9 items — Sports Massage, Detox Treatment and Hair Treatment. Booking is by WhatsApp.' where slug = 'bombora-balangan-resort-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bombora Balangan Resort runs a spa in Jimbaran with nine treatments, from sports massage to detox and hair treatments. Book by WhatsApp.';
-- expect: UPDATE 1

-- 41. W-bombora-balangan-resort-jimbaran-best_for · bombora-balangan-resort-jimbaran · best_for · restore before
update venues set best_for = 'Sports massage booked the same day.' where slug = 'bombora-balangan-resort-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sports massage, or a hair treatment';
-- expect: UPDATE 1

-- 42. W-calma-spa-jimbaran-jimbaran-why_its_here · calma-spa-jimbaran-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Day spa in Jimbaran. The published treatment list runs to 33 items — Spa Package, Body Scrub and Balinese Massage. Balinese Massage is 250K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'calma-spa-jimbaran-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Calma Spa Jimbaran is a day spa with 33 treatments, among them spa packages, body scrubs and Balinese massage. An hour of Balinese massage is 250K IDR, the longest session runs six hours, and booking is on the spa''s own website.';
-- expect: UPDATE 1

-- 43. W-calma-spa-jimbaran-jimbaran-best_for · calma-spa-jimbaran-jimbaran · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 360 minutes; tired feet after a day of walking.' where slug = 'calma-spa-jimbaran-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa package, or an hour of Balinese massage';
-- expect: UPDATE 1

-- 44. W-citrine-day-spa-jimbaran-why_its_here · citrine-day-spa-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Day spa in Jimbaran. The published treatment list runs to 16 items — Traditional Massage, Facial and Couple Massage. Booking is by WhatsApp.' where slug = 'citrine-day-spa-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Citrine Day Spa in Jimbaran has 16 treatments on its list, and traditional massage, facials and a couple massage are among them. The longest take two and a half hours, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 45. W-citrine-day-spa-jimbaran-best_for · citrine-day-spa-jimbaran · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 150 minutes.' where slug = 'citrine-day-spa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple massage, or a facial on your own';
-- expect: UPDATE 1

-- 46. W-de-wave-family-massage-beauty-salon-jimbaran-why_its_here · de-wave-family-massage-beauty-salon-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Beauty salon in Jimbaran. The published treatment list runs to 5 items — Traditional Massage, Aromatherapy and Reflexology. reflexology is 80K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'de-wave-family-massage-beauty-salon-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'De WAVE is a beauty salon in Jimbaran with five treatments, including traditional massage, aromatherapy and reflexology. An hour of reflexology costs 80K IDR; bookings are made on the salon''s own website.';
-- expect: UPDATE 1

-- 47. W-de-wave-family-massage-beauty-salon-jimbaran-best_for · de-wave-family-massage-beauty-salon-jimbaran · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'de-wave-family-massage-beauty-salon-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology at 80K IDR an hour, or an aromatherapy massage';
-- expect: UPDATE 1

-- 48. W-jimbaran-puri-spa-jimbaran-why_its_here · jimbaran-puri-spa-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Spa in Jimbaran. The published treatment list runs to 37 items — Traditional Massage, Body Scrub and Facial. Abhyanga is 1000K IDR for 60 minutes.' where slug = 'jimbaran-puri-spa-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Jimbaran Puri Spa keeps a list of 37 treatments, including traditional massage, body scrubs and facials, and the longest run three hours. An hour of abhyanga is 1,000K IDR.';
-- expect: UPDATE 1

-- 49. W-jimbaran-puri-spa-jimbaran-best_for · jimbaran-puri-spa-jimbaran · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 180 minutes.' where slug = 'jimbaran-puri-spa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, or anyone booking the abhyanga';
-- expect: UPDATE 1

-- 50. W-jimbaran-puri-spa-jimbaran-not_for · jimbaran-puri-spa-jimbaran · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 500K IDR.' where slug = 'jimbaran-puri-spa-jimbaran' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Massage budgets under 500K IDR: the 37-treatment list starts there';
-- expect: UPDATE 1

-- 51. W-lotus-spa-jimbaran-why_its_here · lotus-spa-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Jimbaran. The published treatment list runs to 20 items — Spa Package, Balinese Massage and Traditional Massage. Pregnancy Massage is 342K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'lotus-spa-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lotus Spa is a wellness spa in Jimbaran with 20 treatments, covering spa packages as well as Balinese and traditional massage. Treatments go up to two hours, and a 60-minute pregnancy massage costs 342K IDR. Book on the spa''s own website.';
-- expect: UPDATE 1

-- 52. W-lotus-spa-jimbaran-best_for · lotus-spa-jimbaran · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'lotus-spa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A pregnancy massage, or a spa package';
-- expect: UPDATE 1

-- 53. W-sean-spa-bali-jimbaran-why_its_here · sean-spa-bali-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Spa in Jimbaran. The published treatment list runs to 8 items — Balinese Massage, Deep Tissue and Hot Stone. Booking is on the venue''s own site.' where slug = 'sean-spa-bali-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Balinese massage, deep tissue and hot stone are among the eight treatments at Sean Spa Bali, a spa in Jimbaran. Booking is on its own website.';
-- expect: UPDATE 1

-- 54. W-sean-spa-bali-jimbaran-best_for · sean-spa-bali-jimbaran · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'sean-spa-bali-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples who want deep tissue or hot stone';
-- expect: UPDATE 1

-- 55. W-swara-spa-jimbaran-why_its_here · swara-spa-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Day spa in Jimbaran. The published treatment list runs to 13 items — Couple Massage, Nails and Traditional Massage. Booking is on the venue''s own site.' where slug = 'swara-spa-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A day spa in Jimbaran with 13 treatments, where a couple massage sits alongside traditional massage and nail care. Booking is on the venue''s own site.';
-- expect: UPDATE 1

-- 56. W-swara-spa-jimbaran-best_for · swara-spa-jimbaran · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'swara-spa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple''s massage in Jimbaran';
-- expect: UPDATE 1

-- 57. W-the-lotus-spa-jimbaran-why_its_here · the-lotus-spa-jimbaran · why_its_here · restore before
update venues set why_its_here = 'Day spa in Jimbaran. The published treatment list runs to 7 items — Traditional Massage, Body Scrub and Balinese Massage. Booking is on the venue''s own site.' where slug = 'the-lotus-spa-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Jimbaran day spa whose seven treatments include traditional massage, Balinese massage and body scrubs. The Lotus Spa takes bookings on its own website.';
-- expect: UPDATE 1

-- 58. W-the-lotus-spa-jimbaran-best_for · the-lotus-spa-jimbaran · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'the-lotus-spa-jimbaran' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A traditional massage or a body scrub in Jimbaran';
-- expect: UPDATE 1

-- 59. W-anjali-spa-kuta-legian-why_its_here · anjali-spa-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Spa in Legian. The published treatment list runs to 4 items — Balinese Massage, Acupressure and Head Massage. Traditional Balinese Massage is 300K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'anjali-spa-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Anjali Spa in Legian keeps to four treatments, including Balinese massage, acupressure and head massage. A traditional Balinese massage is 300K IDR for an hour, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 60. W-anjali-spa-kuta-legian-best_for · anjali-spa-kuta-legian · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'anjali-spa-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Acupressure or a head massage';
-- expect: UPDATE 1

-- 61. W-bali-green-spa-kuta-legian-why_its_here · bali-green-spa-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published treatment list runs to 10 items — Head Massage, Spa Package and Thai Massage. Traditional Balinese is 225K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'bali-green-spa-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Green Spa is a Legian day spa with ten treatments, including head massage, Thai massage and spa packages. Traditional Balinese massage is 225K IDR for 60 minutes, booked on the spa''s own website.';
-- expect: UPDATE 1

-- 62. W-bali-green-spa-kuta-legian-best_for · bali-green-spa-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 240 minutes.' where slug = 'bali-green-spa-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Booking four hours of treatments in Legian';
-- expect: UPDATE 1

-- 63. W-bali-orchid-spa-kuta-legian-why_its_here · bali-orchid-spa-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published treatment list runs to 10 items — Spa Package, Shirodhara and Balinese Massage. Traditional Balinese Massage is 385K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'bali-orchid-spa-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Shirodhara is on the list at Bali Orchid Spa, a day spa in Legian whose ten treatments also include spa packages and Balinese massage. An hour of traditional Balinese massage costs 385K IDR; book on the spa''s own website.';
-- expect: UPDATE 1

-- 64. W-bali-orchid-spa-kuta-legian-best_for · bali-orchid-spa-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes.' where slug = 'bali-orchid-spa-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Up to three hours of treatments in a single visit';
-- expect: UPDATE 1

-- 65. W-body-worship-bali-kuta-legian-why_its_here · body-worship-bali-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Legian. The published treatment list runs to 75 items — Spa Package, Traditional Massage and Hair Treatment. Foot & Leg Massage is 155K IDR for 60 minutes.' where slug = 'body-worship-bali-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Body Worship Bali, a wellness spa in Legian, has 75 treatments on its list, including spa packages, traditional massage and hair treatments. An hour of foot and leg massage is 155K IDR, and treatments run up to five hours.';
-- expect: UPDATE 1

-- 66. W-body-worship-bali-kuta-legian-best_for · body-worship-bali-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 300 minutes; tired feet after a day of walking.' where slug = 'body-worship-bali-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A hair treatment, or an hour of foot and leg massage';
-- expect: UPDATE 1

-- 67. W-cozy-spa-bali-kuta-legian-why_its_here · cozy-spa-bali-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published treatment list runs to 16 items — Reflexology, Traditional Massage and Head Massage. COZY FOOT Reflexology is 170K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'cozy-spa-bali-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'COZY SPA BALI is a day spa in Legian with 16 treatments, among them reflexology, traditional massage and head massage. Its foot reflexology is 170K IDR for an hour, and bookings go through WhatsApp.';
-- expect: UPDATE 1

-- 68. W-cozy-spa-bali-kuta-legian-best_for · cozy-spa-bali-kuta-legian · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'cozy-spa-bali-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An hour of foot reflexology after a walk around Legian';
-- expect: UPDATE 1

-- 69. W-galuh-bali-spa-kuta-kuta-legian-why_its_here · galuh-bali-spa-kuta-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Spa in Legian. The published treatment list runs to 28 items — Spa Package, Traditional Massage and Foot Massage. Foot Massage is 300K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'galuh-bali-spa-kuta-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Foot massage is 300K IDR for 60 minutes at Galuh Bali Spa Kuta, a spa in Legian with 28 treatments, spa packages and traditional massage among them. The longest last four hours, and booking is on the spa''s own website.';
-- expect: UPDATE 1

-- 70. W-galuh-bali-spa-kuta-kuta-legian-best_for · galuh-bali-spa-kuta-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 240 minutes; tired feet after a day of walking.' where slug = 'galuh-bali-spa-kuta-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa package, or a traditional massage';
-- expect: UPDATE 1

-- 71. W-glory-massage-bali-kuta-legian-why_its_here · glory-massage-bali-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Legian. The published treatment list runs to 9 items — Balinese Massage, Deep Tissue and Aromatherapy. Booking is by WhatsApp.' where slug = 'glory-massage-bali-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Nine treatments make up the list at Glory Massage Bali, a massage studio in Legian, and Balinese massage, deep tissue and aromatherapy are among them. Booking is by WhatsApp.';
-- expect: UPDATE 1

-- 72. W-glory-massage-bali-kuta-legian-best_for · glory-massage-bali-kuta-legian · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; tired feet after a day of walking.' where slug = 'glory-massage-bali-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, or a deep tissue massage';
-- expect: UPDATE 1

-- 73. W-glow-spa-bali-kuta-legian-why_its_here · glow-spa-bali-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published treatment list runs to 65 items — Facial, Traditional Massage and Balinese Massage. Shiatsu Massage is 450K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'glow-spa-bali-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Facials share the 65-treatment list with traditional and Balinese massage at Glow Spa Bali, a day spa in Legian. An hour of shiatsu massage costs 450K IDR, the longest treatments run four hours, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 74. W-glow-spa-bali-kuta-legian-best_for · glow-spa-bali-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 240 minutes; tired feet after a day of walking.' where slug = 'glow-spa-bali-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An hour of shiatsu, or one of the facials';
-- expect: UPDATE 1

-- 75. W-kokuo-family-massage-reflexology-kuta-legian-why_its_here · kokuo-family-massage-reflexology-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published treatment list runs to 4 items — Traditional Massage and Reflexology. Booking is by WhatsApp.' where slug = 'kokuo-family-massage-reflexology-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kokuo Family Massage & Reflexology, a day spa in Legian, has four treatments, traditional massage and reflexology among them. Booking is by WhatsApp.';
-- expect: UPDATE 1

-- 76. W-kokuo-family-massage-reflexology-kuta-legian-best_for · kokuo-family-massage-reflexology-kuta-legian · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'kokuo-family-massage-reflexology-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Traditional massage, or reflexology on its own';
-- expect: UPDATE 1

-- 77. W-la-karma-spa-kuta-legian-why_its_here · la-karma-spa-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published treatment list runs to 5 items — Facial, Spa Package and Nails. Booking is by WhatsApp.' where slug = 'la-karma-spa-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'La Karma Spa is a day spa in Legian with five treatments, covering facials, spa packages and nails. The longest treatment takes two and a half hours, and booking is by WhatsApp.';
-- expect: UPDATE 1

-- 78. W-la-karma-spa-kuta-legian-best_for · la-karma-spa-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes.' where slug = 'la-karma-spa-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial, or getting your nails done';
-- expect: UPDATE 1

-- 79. W-lux-day-spa-kuta-legian-why_its_here · lux-day-spa-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published treatment list runs to 5 items — Reflexology and Nails. Foot Reflexology is 190K IDR. Booking is on the venue''s own site.' where slug = 'lux-day-spa-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lux Day Spa in Legian has five treatments, reflexology and nails among them. Foot reflexology is 190K IDR, and you book on the spa''s own website.';
-- expect: UPDATE 1

-- 80. W-lux-day-spa-kuta-legian-best_for · lux-day-spa-kuta-legian · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'lux-day-spa-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Foot reflexology or a nail treatment';
-- expect: UPDATE 1

-- 81. W-ministry-of-villas-kuta-legian-why_its_here · ministry-of-villas-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Wellness centre in Legian. The published treatment list runs to 11 items — Balinese Massage and Traditional Massage. Traditional Balinese Aromatherapy Massage is 100K IDR for 60 minutes.' where slug = 'ministry-of-villas-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ministry of Villas runs a wellness centre in Legian with 11 treatments covering Balinese and traditional massage. An hour of traditional Balinese aromatherapy massage is 100K IDR.';
-- expect: UPDATE 1

-- 82. W-ministry-of-villas-kuta-legian-best_for · ministry-of-villas-kuta-legian · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'ministry-of-villas-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A traditional Balinese aromatherapy massage';
-- expect: UPDATE 1

-- 83. W-oaza-uluwatu-kuta-legian-why_its_here · oaza-uluwatu-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Day spa in Legian. The published treatment list runs to 11 items — Facial, Traditional Massage and Spa Package. Four-Hand Massage is 470K IDR. Booking is by WhatsApp.' where slug = 'oaza-uluwatu-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'OAZA Uluwatu is a day spa in Legian whose 11 treatments include facials, traditional massage and spa packages. A four-hand massage costs 470K IDR, treatments run up to 130 minutes, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 84. W-oaza-uluwatu-kuta-legian-best_for · oaza-uluwatu-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 130 minutes.' where slug = 'oaza-uluwatu-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Anyone curious about a four-hand massage';
-- expect: UPDATE 1

-- 85. W-putu-bali-spa-home-care-kuta-legian-why_its_here · putu-bali-spa-home-care-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Legian. The published treatment list runs to 5 items — Foot Massage and Aromatherapy. Foot Massage is 200K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'putu-bali-spa-home-care-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Foot massage and aromatherapy are on the five-treatment list at Putu Bali Spa Home Care, a wellness spa in Legian. An hour of foot massage is 200K IDR, booked by WhatsApp.';
-- expect: UPDATE 1

-- 86. W-putu-bali-spa-home-care-kuta-legian-best_for · putu-bali-spa-home-care-kuta-legian · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'putu-bali-spa-home-care-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Aromatherapy or a 60-minute foot massage';
-- expect: UPDATE 1

-- 87. W-revitalize-massage-kuta-legian-why_its_here · revitalize-massage-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Legian. The published treatment list runs to 5 items — Spa Package, Detox Treatment and Lymphatic Massage. Booking is on the venue''s own site.' where slug = 'revitalize-massage-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Revitalize Massage, a massage studio in Legian, has five treatments, including spa packages, detox treatments and lymphatic massage, and the longest run two hours. Book on its own website.';
-- expect: UPDATE 1

-- 88. W-revitalize-massage-kuta-legian-best_for · revitalize-massage-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'revitalize-massage-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Lymphatic massage or a detox treatment';
-- expect: UPDATE 1

-- 89. W-taman-air-spa-kuta-legian-why_its_here · taman-air-spa-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Legian. The published treatment list runs to 17 items — Balinese Massage, Couple Massage and Facial. Traditional Balinese Massage is 290K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'taman-air-spa-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Taman Air Spa is a Legian wellness spa with 17 treatments, among them Balinese massage, a couple massage and facials. An hour of traditional Balinese massage is 290K IDR, and treatments last up to two and a half hours. Book on the spa''s own website.';
-- expect: UPDATE 1

-- 90. W-taman-air-spa-kuta-legian-best_for · taman-air-spa-kuta-legian · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 150 minutes.' where slug = 'taman-air-spa-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples who want facials as well as massage';
-- expect: UPDATE 1

-- 91. W-th-home-service-spa-and-massage-kuta-legian-why_its_here · th-home-service-spa-and-massage-kuta-legian · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Legian. The published treatment list runs to 7 items — Deep Tissue, Traditional Massage and Facial. Booking is on the venue''s own site.' where slug = 'th-home-service-spa-and-massage-kuta-legian' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A wellness spa in Legian with seven treatments, including deep tissue, traditional massage and facials. Treatments run up to two hours; book on the venue''s own website.';
-- expect: UPDATE 1

-- 92. W-th-home-service-spa-and-massage-kuta-legian-best_for · th-home-service-spa-and-massage-kuta-legian · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'th-home-service-spa-and-massage-kuta-legian' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A deep tissue massage or a facial';
-- expect: UPDATE 1
