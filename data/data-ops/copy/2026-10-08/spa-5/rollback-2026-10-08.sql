-- wave-spa-5-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-four-seasons-spa-ubud-why_its_here · four-seasons-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 24 items — Yoga, Spa Package and Couple Massage. Booking is on the venue''s own site.' where slug = 'four-seasons-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Four Seasons Spa is a day spa in Ubud with 24 treatments on its list, yoga and spa packages among them. There is a couple massage too, and booking is on the spa''s own website.';
-- expect: UPDATE 1

-- 2. W-four-seasons-spa-ubud-best_for · four-seasons-spa-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 240 minutes.' where slug = 'four-seasons-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, or anyone with up to four hours for a session';
-- expect: UPDATE 1

-- 3. W-gadsden-massage-studio-ubud-why_its_here · gadsden-massage-studio-ubud · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Ubud. The published treatment list runs to 41 items — Lomi Lomi, Traditional Massage and Swedish.' where slug = 'gadsden-massage-studio-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lomi lomi, Swedish and traditional massage are among the 41 treatments at Gadsden Massage Studio in Ubud, and the list includes a couple treatment.';
-- expect: UPDATE 1

-- 4. W-gadsden-massage-studio-ubud-best_for · gadsden-massage-studio-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 120 minutes.' where slug = 'gadsden-massage-studio-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A massage as a couple, or a session of up to two hours';
-- expect: UPDATE 1

-- 5. W-gratia-spa-monkey-forest-ubud-why_its_here · gratia-spa-monkey-forest-ubud · why_its_here · restore before
update venues set why_its_here = 'Spa in Ubud. The published treatment list runs to 79 items — Traditional Massage, Balinese Massage and Back Massage. Balinese Massage For Man is 180K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'gratia-spa-monkey-forest-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Gratia Spa Monkey Forest in Ubud lists 79 treatments, including traditional, Balinese and back massage. The Balinese massage for men is 180K IDR for an hour.';
-- expect: UPDATE 1

-- 6. W-gratia-spa-monkey-forest-ubud-best_for · gratia-spa-monkey-forest-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'gratia-spa-monkey-forest-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese massage for men, or a back massage';
-- expect: UPDATE 1

-- 7. W-green-tara-spa-ubud-why_its_here · green-tara-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 14 items — Reiki, Facial and Balinese Massage. Traditional balinese balance is 240K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'green-tara-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Green Tara Spa''s 14 treatments include reiki, facials and Balinese massage. The Ubud day spa prices its traditional Balinese balance treatment at 240K IDR for an hour, with booking through the spa''s site.';
-- expect: UPDATE 1

-- 8. W-green-tara-spa-ubud-best_for · green-tara-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 270 minutes; tired feet after a day of walking.' where slug = 'green-tara-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reiki, or the Balinese balance treatment';
-- expect: UPDATE 1

-- 9. W-hesa-wellness-spa-ubud-why_its_here · hesa-wellness-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 13 items — Balinese Massage, Hammam and Body Scrub. Balinese Massage is 600K IDR for 90 minutes. Booking is on the venue''s own site.' where slug = 'hesa-wellness-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Hesa Wellness Spa in Ubud charges 600K IDR for a 90-minute Balinese massage and takes bookings on its website. A hammam and body scrubs are also on the day spa''s list of 13 treatments.';
-- expect: UPDATE 1

-- 10. W-hesa-wellness-spa-ubud-best_for · hesa-wellness-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes.' where slug = 'hesa-wellness-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Three hours cleared for a long treatment';
-- expect: UPDATE 1

-- 11. W-hesa-wellness-spa-ubud-not_for · hesa-wellness-spa-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 600K IDR.' where slug = 'hesa-wellness-spa-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A spa visit for under 600K IDR: the 90-minute Balinese massage is the starting price';
-- expect: UPDATE 1

-- 12. W-hotel-spa-massage-ubud-why_its_here · hotel-spa-massage-ubud · why_its_here · restore before
update venues set why_its_here = 'Resort spa in Ubud. The published treatment list runs to 20 items — Traditional Massage, Thai Massage and Shirodhara. Booking is on the venue''s own site.' where slug = 'hotel-spa-massage-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Hotel Spa massage, a resort spa in Ubud that takes bookings on its own website, lists 20 treatments, including traditional massage, Thai massage and shirodhara.';
-- expect: UPDATE 1

-- 13. W-hotel-spa-massage-ubud-best_for · hotel-spa-massage-ubud · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'hotel-spa-massage-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Thai massage or shirodhara at a resort spa';
-- expect: UPDATE 1

-- 14. W-inka-ubud-spa-ubud-why_its_here · inka-ubud-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 4 items — Traditional Massage, Facial and Manicure. Booking runs through Zenoti.' where slug = 'inka-ubud-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'INKA Ubud Spa keeps a short day spa list of four treatments, including traditional massage, a facial and a manicure, and bookings go through Zenoti.';
-- expect: UPDATE 1

-- 15. W-inka-ubud-spa-ubud-best_for · inka-ubud-spa-ubud · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'inka-ubud-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A traditional massage, a facial or a manicure';
-- expect: UPDATE 1

-- 16. W-jero-traditional-spa-therapy-ubud-why_its_here · jero-traditional-spa-therapy-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 36 items — Balinese Massage, Deep Tissue and Aromatherapy. Traditional Balinese Massage is 200K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'jero-traditional-spa-therapy-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Jero Traditional Spa & Therapy is an Ubud day spa that takes bookings by WhatsApp. Traditional Balinese massage is 200K IDR for 60 minutes, and deep tissue and aromatherapy are among its 36 treatments.';
-- expect: UPDATE 1

-- 17. W-jero-traditional-spa-therapy-ubud-best_for · jero-traditional-spa-therapy-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'jero-traditional-spa-therapy-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Balinese massage or deep tissue, booked by WhatsApp';
-- expect: UPDATE 1

-- 18. W-jhagat-spa-centre-ubud-why_its_here · jhagat-spa-centre-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 57 items — Foot Massage, Manicure and Reflexology. Foot Massage is 190K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'jhagat-spa-centre-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Foot massage, reflexology and manicures are on the 57-treatment list at Jhagat Spa Centre in Ubud. This day spa''s foot massage is 190K IDR for 60 minutes, and bookings are on its website.';
-- expect: UPDATE 1

-- 19. W-jhagat-spa-centre-ubud-best_for · jhagat-spa-centre-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 120 minutes.' where slug = 'jhagat-spa-centre-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, or a foot massage and reflexology';
-- expect: UPDATE 1

-- 20. W-kappa-senses-ubud-ubud-why_its_here · kappa-senses-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'Resort spa in Ubud. The published treatment list runs to 4 items — Facial, Balinese Massage and Couple Massage. Traditional Balinese Massage is 90K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'kappa-senses-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kappa Senses Ubud has a resort spa menu of four treatments that includes a facial, Balinese massage and a couple massage. Traditional Balinese massage is listed at 90K IDR for 60 minutes, and the resort''s own website takes bookings.';
-- expect: UPDATE 1

-- 21. W-kappa-senses-ubud-ubud-best_for · kappa-senses-ubud-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 180 minutes.' where slug = 'kappa-senses-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial or a couple massage at a resort spa';
-- expect: UPDATE 1

-- 22. W-kaveri-spa-at-the-udaya-ubud-why_its_here · kaveri-spa-at-the-udaya-ubud · why_its_here · restore before
update venues set why_its_here = 'Spa in Ubud. The published treatment list runs to 6 items — Balinese Massage and Couple Massage. Booking is on the venue''s own site.' where slug = 'kaveri-spa-at-the-udaya-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kaveri Spa, the spa at The Udaya in Ubud, takes bookings on its own website. Its six treatments include Balinese massage and a couple massage.';
-- expect: UPDATE 1

-- 23. W-kaveri-spa-at-the-udaya-ubud-best_for · kaveri-spa-at-the-udaya-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'kaveri-spa-at-the-udaya-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples booking their massages as a pair';
-- expect: UPDATE 1

-- 24. W-kayumanis-spa-ubud-ubud-why_its_here · kayumanis-spa-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'Spa in Ubud. The published treatment list runs to 9 items — Traditional Massage and Hot Stone. RELAXING MASSAGE is 1025K IDR for 60 minutes.' where slug = 'kayumanis-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Kayumanis Spa Ubud keeps nine treatments on its spa menu, traditional massage and hot stone included. Its relaxing massage costs 1,025K IDR for an hour.';
-- expect: UPDATE 1

-- 25. W-kayumanis-spa-ubud-ubud-best_for · kayumanis-spa-ubud-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 360 minutes.' where slug = 'kayumanis-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A six-hour stretch of treatments with nowhere else to be';
-- expect: UPDATE 1

-- 26. W-kayumanis-spa-ubud-ubud-not_for · kayumanis-spa-ubud-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 1025K IDR.' where slug = 'kayumanis-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An hour of massage for less than 1,025K IDR, the lowest price on the nine-treatment list';
-- expect: UPDATE 1

-- 27. W-lemuria-spa-by-arya-arkananta-resort-spa-ubud-why_its_here · lemuria-spa-by-arya-arkananta-resort-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 4 items — Traditional Massage and Spa Package. Booking is on the venue''s own site.' where slug = 'lemuria-spa-by-arya-arkananta-resort-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lemuria Spa by Arya Arkananta Resort & Spa is a day spa in Ubud with four treatments, traditional massage and spa packages among them. Booking is on the venue''s own website.';
-- expect: UPDATE 1

-- 28. W-lemuria-spa-by-arya-arkananta-resort-spa-ubud-best_for · lemuria-spa-by-arya-arkananta-resort-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes.' where slug = 'lemuria-spa-by-arya-arkananta-resort-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa visit you can stretch to three hours';
-- expect: UPDATE 1

-- 29. W-lumiere-spa-bali-ubud-why_its_here · lumiere-spa-bali-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 15 items — Aromatherapy, Traditional Massage and Facial. Deep Back Tissue Massage is 380K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'lumiere-spa-bali-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In Ubud, lumiere spa bali is a day spa with 15 treatments, including aromatherapy, traditional massage and facials, and sessions of up to two hours. Deep back tissue massage there is 380K IDR for an hour.';
-- expect: UPDATE 1

-- 30. W-lumiere-spa-bali-ubud-best_for · lumiere-spa-bali-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'lumiere-spa-bali-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A tight back that needs deep tissue work';
-- expect: UPDATE 1

-- 31. W-mahamaya-spa-ubud-why_its_here · mahamaya-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 86 items — Traditional Massage, Facial and Body Scrub. Foot Reflexology is 390K IDR for 60 minutes. Booking runs through Fresha.' where slug = 'mahamaya-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mahamaya Spa in Ubud takes bookings through Fresha and has 86 treatments on its menu, including traditional massage, facials and body scrubs. Foot reflexology at this day spa is 390K IDR for an hour.';
-- expect: UPDATE 1

-- 32. W-mahamaya-spa-ubud-best_for · mahamaya-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'mahamaya-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Foot reflexology, a facial or a body scrub';
-- expect: UPDATE 1

-- 33. W-mango-tree-spa-ubud-why_its_here · mango-tree-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 15 items — Spa Package, Ayurvedic Treatment and Balinese Massage. Pure Balinese Massage is 1215K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'mango-tree-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ayurvedic treatments, spa packages and Balinese massage are on the 15-treatment list at Mango Tree Spa, a wellness spa in Ubud. Its pure Balinese massage is priced at 1,215K IDR for an hour.';
-- expect: UPDATE 1

-- 34. W-mango-tree-spa-ubud-best_for · mango-tree-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes.' where slug = 'mango-tree-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A session that runs as long as three hours';
-- expect: UPDATE 1

-- 35. W-mango-tree-spa-ubud-not_for · mango-tree-spa-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 1215K IDR.' where slug = 'mango-tree-spa-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'An Ayurvedic or Balinese treatment on a tight budget: the list starts at 1,215K IDR';
-- expect: UPDATE 1

-- 36. W-melati-spa-ubud-why_its_here · melati-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 17 items — Spa Package, Facial and Balinese Massage. Bali Foot Spa Ritual is 500K IDR for 60 minutes.' where slug = 'melati-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Melati Spa''s Bali foot spa ritual takes an hour and costs 500K IDR. This wellness spa in Ubud has 17 treatments, including spa packages, facials and Balinese massage.';
-- expect: UPDATE 1

-- 37. W-melati-spa-ubud-best_for · melati-spa-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'melati-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'The Bali foot spa ritual, or a facial';
-- expect: UPDATE 1

-- 38. W-mountain-wellness-resort-near-ubud-ubud-why_its_here · mountain-wellness-resort-near-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 11 items — Balinese Massage, Ayurvedic Treatment and Body Scrub.' where slug = 'mountain-wellness-resort-near-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mountain Wellness Resort near Ubud is a wellness spa with 11 treatments, including Balinese massage, Ayurvedic treatments and body scrubs.';
-- expect: UPDATE 1

-- 39. W-mountain-wellness-resort-near-ubud-ubud-best_for · mountain-wellness-resort-near-ubud-ubud · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'mountain-wellness-resort-near-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Ayurvedic treatments or a body scrub near Ubud';
-- expect: UPDATE 1

-- 40. W-nikmatul-choiroh-semassage-vaccinated-ubud-why_its_here · nikmatul-choiroh-semassage-vaccinated-ubud · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Ubud. The published treatment list runs to 5 items — Body Scrub. Booking is on the venue''s own site.' where slug = 'nikmatul-choiroh-semassage-vaccinated-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'This Ubud massage studio lists five treatments, with a body scrub among them, and takes bookings on its own website.';
-- expect: UPDATE 1

-- 41. W-nikmatul-choiroh-semassage-vaccinated-ubud-best_for · nikmatul-choiroh-semassage-vaccinated-ubud · best_for · restore before
update venues set best_for = 'Body scrub booked the same day.' where slug = 'nikmatul-choiroh-semassage-vaccinated-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A body scrub at a massage studio';
-- expect: UPDATE 1

-- 42. W-nusa-therapy-ubud-why_its_here · nusa-therapy-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 8 items — Neck & Shoulder, Foot Massage and Traditional Massage. Foot Massage is 95K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'nusa-therapy-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Foot massage at Nusa Therapy is 95K IDR for an hour. Neck and shoulder work and traditional massage are also on the eight-treatment list at this Ubud day spa, which takes bookings by WhatsApp.';
-- expect: UPDATE 1

-- 43. W-nusa-therapy-ubud-best_for · nusa-therapy-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'nusa-therapy-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot massage, or neck and shoulder work';
-- expect: UPDATE 1

-- 44. W-parina-spa-ubud-why_its_here · parina-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 10 items — Deep Tissue, Balinese Massage and Facial. Balinese Massage is 270K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'parina-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Deep tissue, Balinese massage and facials are on the ten-treatment list at Parina Spa, a day spa in Ubud. Booking is by WhatsApp, and Balinese massage is 270K IDR for 60 minutes.';
-- expect: UPDATE 1

-- 45. W-parina-spa-ubud-best_for · parina-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'parina-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial or deep tissue at a day spa';
-- expect: UPDATE 1

-- 46. W-parina-spa-ubud-ubud-why_its_here · parina-spa-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 10 items — Flower Bath, Balinese Massage and Aromatherapy. Booking is on the venue''s own site.' where slug = 'parina-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Parina Spa Ubud takes reservations on its own website and keeps ten treatments on its day spa list, a flower bath, Balinese massage and aromatherapy among them. The longest takes 160 minutes.';
-- expect: UPDATE 1

-- 47. W-parina-spa-ubud-ubud-best_for · parina-spa-ubud-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 160 minutes; tired feet after a day of walking.' where slug = 'parina-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A flower bath, or aromatherapy';
-- expect: UPDATE 1

-- 48. W-pengosekan-spa-hotels-ubud-why_its_here · pengosekan-spa-hotels-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 4 items — Balinese Massage, Yoga and Traditional Massage. Massage Services is 643K IDR. Booking is on the venue''s own site.' where slug = 'pengosekan-spa-hotels-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Yoga sits beside Balinese and traditional massage on the four-treatment list at Pengosekan Spa Hotels in Ubud. This wellness spa lists an item called massage services at 643K IDR and takes bookings on its own website.';
-- expect: UPDATE 1

-- 49. W-pengosekan-spa-hotels-ubud-best_for · pengosekan-spa-hotels-ubud · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'pengosekan-spa-hotels-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga, or a Balinese or traditional massage';
-- expect: UPDATE 1

-- 50. W-pengosekan-spa-hotels-ubud-not_for · pengosekan-spa-hotels-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 643K IDR.' where slug = 'pengosekan-spa-hotels-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Yoga or massage on a shoestring, because the list starts at 643K IDR';
-- expect: UPDATE 1

-- 51. W-putri-ubud-spa-ubud-why_its_here · putri-ubud-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 18 items — Traditional Massage, Ear Candle and Sports Massage. LEGS MASSAGE is 250K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'putri-ubud-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Leg massage at Putri Ubud Spa is 250K IDR for 60 minutes. The day spa''s 18 treatments also include ear candling, sports massage and traditional massage, and booking is on the spa''s own website.';
-- expect: UPDATE 1

-- 52. W-putri-ubud-spa-ubud-best_for · putri-ubud-spa-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'putri-ubud-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A leg massage or a sports massage';
-- expect: UPDATE 1

-- 53. W-reflexology-ubud-ubud-why_its_here · reflexology-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 8 items — Reflexology, Balinese Massage and Four Hands Massage. Booking is on the venue''s own site.' where slug = 'reflexology-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'You book Reflexology Ubud through its website. The wellness spa''s eight treatments include reflexology, Balinese massage and a four-hands massage.';
-- expect: UPDATE 1

-- 54. W-reflexology-ubud-ubud-best_for · reflexology-ubud-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'reflexology-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology, or a four-hands massage';
-- expect: UPDATE 1

-- 55. W-riverside-spa-at-ulaman-ubud-why_its_here · riverside-spa-at-ulaman-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 40 items — Body Wrap, Balinese Massage and Hot Stone. Balinese Massage is 750K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'riverside-spa-at-ulaman-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Riverside Spa at Ulaman charges 750K IDR for an hour of Balinese massage. Body wraps and hot stone massage are also among the 40 treatments at this Ubud day spa.';
-- expect: UPDATE 1

-- 56. W-riverside-spa-at-ulaman-ubud-best_for · riverside-spa-at-ulaman-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'riverside-spa-at-ulaman-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A body wrap or a hot stone massage';
-- expect: UPDATE 1

-- 57. W-riverside-spa-at-ulaman-ubud-not_for · riverside-spa-at-ulaman-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 550K IDR.' where slug = 'riverside-spa-at-ulaman-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Spa budgets below 550K IDR. The lowest of the 40 prices is 550K IDR';
-- expect: UPDATE 1

-- 58. W-royal-kirana-spa-ubud-why_its_here · royal-kirana-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 14 items — Couple Massage, Spa Package and Flower Bath. Luxury Romance Retreat for Couple is 2650K IDR. Booking is on the venue''s own site.' where slug = 'royal-kirana-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A romance retreat for couples costs 2,650K IDR at Royal Kirana Spa, a day spa in Ubud with 14 treatments. Couple massage, spa packages and a flower bath are on the list, and booking is on the spa''s website.';
-- expect: UPDATE 1

-- 59. W-royal-kirana-spa-ubud-best_for · royal-kirana-spa-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 420 minutes.' where slug = 'royal-kirana-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple massage, or a spa day of up to seven hours';
-- expect: UPDATE 1

-- 60. W-royal-kirana-spa-ubud-not_for · royal-kirana-spa-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 865K IDR.' where slug = 'royal-kirana-spa-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Spa time for less than 865K IDR, since that is the entry price';
-- expect: UPDATE 1

-- 61. W-royal-spa-wellness-ubud-why_its_here · royal-spa-wellness-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 4 items — Spa Package, Traditional Massage and Facial. Booking is on the venue''s own site.' where slug = 'royal-spa-wellness-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Royal Spa & Wellness in Ubud lists four treatments, including a spa package, traditional massage and a facial, and the day spa takes bookings on its own website.';
-- expect: UPDATE 1

-- 62. W-royal-spa-wellness-ubud-best_for · royal-spa-wellness-ubud · best_for · restore before
update venues set best_for = 'Spa package booked the same day.' where slug = 'royal-spa-wellness-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa package, or a facial';
-- expect: UPDATE 1

-- 63. W-sang-spa-ubud-why_its_here · sang-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 12 items — Balinese Massage, Couple Massage and Traditional Massage. Traditional Balinese Massage is 499K IDR for 90 minutes. Booking is on the venue''s own site.' where slug = 'sang-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A 90-minute traditional Balinese massage costs 499K IDR at Sang Spa, a wellness spa in Ubud. Its 12 treatments include Balinese and couple massage, and you book on the spa''s website.';
-- expect: UPDATE 1

-- 64. W-sang-spa-ubud-best_for · sang-spa-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 240 minutes.' where slug = 'sang-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, or a long visit of up to four hours';
-- expect: UPDATE 1

-- 65. W-sanggraloka-ubud-ubud-why_its_here · sanggraloka-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 4 items — Deep Tissue, Aromatherapy and Body Treatment. Booking is on the venue''s own site.' where slug = 'sanggraloka-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Sanggraloka Ubud keeps a short wellness spa list: deep tissue, aromatherapy and a body treatment are among its four treatments. Booking is online, through its own site.';
-- expect: UPDATE 1

-- 66. W-sanggraloka-ubud-ubud-best_for · sanggraloka-ubud-ubud · best_for · restore before
update venues set best_for = 'Deep tissue booked the same day.' where slug = 'sanggraloka-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Aromatherapy or a body treatment';
-- expect: UPDATE 1

-- 67. W-serayu-spa-at-the-kayon-resort-ubud-why_its_here · serayu-spa-at-the-kayon-resort-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 104 items — Traditional Massage, Spa Package and Haircut. Foot Reflexology is 725K IDR for 60 minutes.' where slug = 'serayu-spa-at-the-kayon-resort-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Serayu Spa at The Kayon Resort in Ubud lists 104 treatments, running from traditional massage and spa packages to haircuts. An hour of foot reflexology at the day spa is 725K IDR.';
-- expect: UPDATE 1

-- 68. W-serayu-spa-at-the-kayon-resort-ubud-best_for · serayu-spa-at-the-kayon-resort-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'serayu-spa-at-the-kayon-resort-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Foot reflexology, or a spa package';
-- expect: UPDATE 1

-- 69. W-shinto-spa-ubud-why_its_here · shinto-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 46 items — Traditional Massage, Head Massage and Facial. Foot Meridian Massage is 275K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'shinto-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bookings at Shinto Spa come in by WhatsApp, and the Ubud day spa has 46 treatments, including traditional massage, head massage and facials. Its 60-minute foot meridian massage is 275K IDR.';
-- expect: UPDATE 1

-- 70. W-shinto-spa-ubud-best_for · shinto-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'shinto-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot meridian massage for sore feet, or three hours at the spa';
-- expect: UPDATE 1

-- 71. W-starchild-spa-ubud-why_its_here · starchild-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 35 items — Traditional Massage, Body Scrub and Spa Package. Balinese Massage is 125K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'starchild-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'StarChild Spa charges 125K IDR for a 60-minute Balinese massage. The Ubud day spa''s 35 treatments also take in body scrubs, spa packages and traditional massage.';
-- expect: UPDATE 1

-- 72. W-starchild-spa-ubud-best_for · starchild-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 300 minutes; tired feet after a day of walking.' where slug = 'starchild-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A body scrub or a spa package';
-- expect: UPDATE 1

-- 73. W-swatma-ubud-why_its_here · swatma-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness centre in Ubud. The published treatment list runs to 9 items — Yoga and Balinese Massage. Authentic Balinese Healing Session is 350K IDR. Booking is on the venue''s own site.' where slug = 'swatma-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Swatma is a wellness centre in Ubud where yoga and Balinese massage are among nine treatments. A Balinese healing session costs 350K IDR, and you book on its own website.';
-- expect: UPDATE 1

-- 74. W-swatma-ubud-best_for · swatma-ubud · best_for · restore before
update venues set best_for = 'Yoga booked the same day.' where slug = 'swatma-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga, or a Balinese healing session';
-- expect: UPDATE 1

-- 75. W-taksu-ubud-why_its_here · taksu-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 56 items — Balinese Massage, Manicure and Pedicure. Booking is on the venue''s own site.' where slug = 'taksu-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Taksu in Ubud takes bookings on its own website, and its day spa list has 56 treatments, Balinese massage, manicures and pedicures included.';
-- expect: UPDATE 1

-- 76. W-taksu-ubud-best_for · taksu-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'taksu-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A pedicure and manicure, or a Balinese massage';
-- expect: UPDATE 1

-- 77. W-tegal-mesari-spa-ubud-why_its_here · tegal-mesari-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 28 items — Body Scrub, Traditional Massage and Facial. FACE MASSAGE is 275K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'tegal-mesari-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Tegal Mesari Spa takes bookings by WhatsApp for its 28 treatments, among them body scrubs, traditional massage and facials. Face massage at this Ubud day spa is 275K IDR for 60 minutes.';
-- expect: UPDATE 1

-- 78. W-tegal-mesari-spa-ubud-best_for · tegal-mesari-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes.' where slug = 'tegal-mesari-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Up to 150 minutes of treatments, arranged by WhatsApp';
-- expect: UPDATE 1

-- 79. W-terakota-spa-ubud-why_its_here · terakota-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 11 items — Foot Massage, Balinese Massage and Neck & Shoulder. Foot | Leg Massage is 115K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'terakota-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Terakota Spa, a day spa in Ubud, charges 115K IDR for an hour of foot and leg massage. Its 11 treatments also include Balinese massage and neck and shoulder work, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 80. W-terakota-spa-ubud-best_for · terakota-spa-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'terakota-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A foot and leg massage, or Balinese massage';
-- expect: UPDATE 1

-- 81. W-the-faces-world-ubud-why_its_here · the-faces-world-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 63 items — Traditional Massage, Facial and Spa Package. 2024 Reflexology Foot Massage (60 min) is 500K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'the-faces-world-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Faces World lists 63 treatments at its wellness spa in Ubud, including traditional massage, facials and spa packages. Its reflexology foot massage is 500K IDR for 60 minutes, with booking through its website.';
-- expect: UPDATE 1

-- 82. W-the-faces-world-ubud-best_for · the-faces-world-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 200 minutes; tired feet after a day of walking.' where slug = 'the-faces-world-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology foot massage or a facial';
-- expect: UPDATE 1

-- 83. W-the-kasih-spa-ubud-why_its_here · the-kasih-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 17 items — Balinese Massage, Aromatherapy and Head Massage. Signature Balinese Massage is 250K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'the-kasih-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Balinese massage, aromatherapy and head massage are all on the 17-treatment menu at The Kasih Spa in Ubud. The day spa''s own Balinese massage is 250K IDR for an hour, and booking is on its website.';
-- expect: UPDATE 1

-- 84. W-the-kasih-spa-ubud-best_for · the-kasih-spa-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 210 minutes.' where slug = 'the-kasih-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple treatment, or a visit of up to three and a half hours';
-- expect: UPDATE 1

-- 85. W-the-sacred-river-spa-at-sayan-ubud-why_its_here · the-sacred-river-spa-at-sayan-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 8 items — Spa Package, Steam and Hydrating Facial. Booking is on the venue''s own site.' where slug = 'the-sacred-river-spa-at-sayan-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Steam, a hydrating facial and spa packages are on the list at The Sacred River Spa at Sayan, a wellness spa in Ubud with eight treatments.';
-- expect: UPDATE 1

-- 86. W-the-sacred-river-spa-at-sayan-ubud-best_for · the-sacred-river-spa-at-sayan-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes.' where slug = 'the-sacred-river-spa-at-sayan-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Two and a half hours with nothing else planned';
-- expect: UPDATE 1

-- 87. W-the-samaya-ubud-bali-ubud-why_its_here · the-samaya-ubud-bali-ubud · why_its_here · restore before
update venues set why_its_here = 'Resort spa in Ubud. The published treatment list runs to 15 items — Balinese Massage, Couple Massage and Facial. Single Balinese Massage is 550K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'the-samaya-ubud-bali-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Samaya Ubud-Bali has a resort spa with 15 treatments, among them Balinese massage, a couple massage and facials. A single Balinese massage costs 550K IDR for an hour, and booking is on the resort''s website.';
-- expect: UPDATE 1

-- 88. W-the-samaya-ubud-bali-ubud-best_for · the-samaya-ubud-bali-ubud · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment; a long reset — treatments run up to 150 minutes.' where slug = 'the-samaya-ubud-bali-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A couple massage, or a resort spa visit of up to two and a half hours';
-- expect: UPDATE 1

-- 89. W-the-sanctoo-spa-wellness-ubud-why_its_here · the-sanctoo-spa-wellness-ubud · why_its_here · restore before
update venues set why_its_here = 'Spa in Ubud. The published treatment list runs to 5 items — Anti-aging Facial.' where slug = 'the-sanctoo-spa-wellness-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Sanctoo Spa & Wellness is a spa in Ubud with five treatments on its list, one of them an anti-aging facial.';
-- expect: UPDATE 1

-- 90. W-the-sanctoo-spa-wellness-ubud-best_for · the-sanctoo-spa-wellness-ubud · best_for · restore before
update venues set best_for = 'Anti-aging facial booked the same day.' where slug = 'the-sanctoo-spa-wellness-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An anti-aging facial in Ubud';
-- expect: UPDATE 1

-- 91. W-the-spa-kamandalu-ubud-why_its_here · the-spa-kamandalu-ubud · why_its_here · restore before
update venues set why_its_here = 'Spa in Ubud. The published treatment list runs to 32 items — Traditional Massage, Facial and Reflexology. Balinese Massage is 1100K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'the-spa-kamandalu-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In Ubud, the spa@kamandalu lists 32 treatments, including traditional massage, facials and reflexology. The longest sessions run six hours, and an hour of Balinese massage costs 1,100K IDR.';
-- expect: UPDATE 1

-- 92. W-the-spa-kamandalu-ubud-best_for · the-spa-kamandalu-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 360 minutes; tired feet after a day of walking.' where slug = 'the-spa-kamandalu-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology, or a traditional massage';
-- expect: UPDATE 1

-- 93. W-the-spa-kamandalu-ubud-not_for · the-spa-kamandalu-ubud · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 1100K IDR.' where slug = 'the-spa-kamandalu-ubud' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget massage — every treatment on the list is 1,100K IDR or more';
-- expect: UPDATE 1

-- 94. W-tjampuhan-spa-ubud-why_its_here · tjampuhan-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Day spa in Ubud. The published treatment list runs to 14 items — Traditional Massage, Javanese Lulur and Balinese Boreh. Booking is on the venue''s own site.' where slug = 'tjampuhan-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Tjampuhan Spa, a day spa in Ubud, has a Javanese lulur and a Balinese boreh on its 14-treatment list, next to traditional massage. Booking is on the spa''s website.';
-- expect: UPDATE 1

-- 95. W-tjampuhan-spa-ubud-best_for · tjampuhan-spa-ubud · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'tjampuhan-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Javanese lulur or a Balinese boreh';
-- expect: UPDATE 1

-- 96. W-tlaga-spa-ubud-why_its_here · tlaga-spa-ubud · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Ubud. The published treatment list runs to 15 items — Traditional Massage, Facial and Flower Bath. Balinesse Massage – Healing is 475K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'tlaga-spa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At tlaga spa in Ubud, the 15 treatments include traditional massage, facials and a flower bath. A 60-minute healing massage at this wellness spa costs 475K IDR.';
-- expect: UPDATE 1

-- 97. W-tlaga-spa-ubud-best_for · tlaga-spa-ubud · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 300 minutes.' where slug = 'tlaga-spa-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A full five hours of treatments in Ubud';
-- expect: UPDATE 1
