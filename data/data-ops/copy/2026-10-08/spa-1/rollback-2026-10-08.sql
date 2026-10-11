-- wave-spa-1-2026-10-08 — rollback for apply-2026-10-08.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-08 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. W-alala-amed-spa-boutique-amed-why_its_here · alala-amed-spa-boutique-amed · why_its_here · restore before
update venues set why_its_here = 'Day spa in Amed. The published treatment list runs to 18 items — Traditional Massage, Shirodhara and Deep Tissue. Foot Reflexology is 100K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'alala-amed-spa-boutique-amed' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A day spa in Amed with 18 treatments on the list, from traditional massage to shirodhara and deep tissue. An hour of foot reflexology costs 100K IDR. Book by WhatsApp.';
-- expect: UPDATE 1

-- 2. W-alala-amed-spa-boutique-amed-best_for · alala-amed-spa-boutique-amed · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'alala-amed-spa-boutique-amed' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Foot reflexology when you''ve walked enough, or a three-hour reset';
-- expect: UPDATE 1

-- 3. W-amed-roda-spa-amed-why_its_here · amed-roda-spa-amed · why_its_here · restore before
update venues set why_its_here = 'Day spa in Amed. The published treatment list runs to 24 items — Traditional Massage, Head Massage and Body Scrub. Balinese Massage is 170K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'amed-roda-spa-amed' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Amed Roda Spa is a day spa in Amed with 24 treatments, among them traditional massage, head massage and a body scrub. A 60-minute Balinese massage is 170K IDR, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 4. W-amed-roda-spa-amed-best_for · amed-roda-spa-amed · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'amed-roda-spa-amed' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A head massage, or up to two hours of treatment in Amed';
-- expect: UPDATE 1

-- 5. W-blue-earth-village-amed-why_its_here · blue-earth-village-amed · why_its_here · restore before
update venues set why_its_here = 'Day spa in Amed. The published treatment list runs to 7 items — Facial, Cupping and Deep Tissue. Booking is by WhatsApp.' where slug = 'blue-earth-village-amed' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Facials, cupping and deep tissue are among the seven treatments at Blue Earth Village, a day spa in Amed. Bookings are taken by WhatsApp.';
-- expect: UPDATE 1

-- 6. W-blue-earth-village-amed-best_for · blue-earth-village-amed · best_for · restore before
update venues set best_for = 'Facial booked the same day.' where slug = 'blue-earth-village-amed' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cupping session or a facial, arranged by WhatsApp';
-- expect: UPDATE 1

-- 7. W-hotel-uyah-amed-spa-resort-amed-why_its_here · hotel-uyah-amed-spa-resort-amed · why_its_here · restore before
update venues set why_its_here = 'Spa in Amed. The published treatment list runs to 32 items — Traditional Massage, Manicure and Reflexology. Traditional Full Body “Pijat” Massage (60 minutes) is 120K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'hotel-uyah-amed-spa-resort-amed' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The spa at Hotel Uyah Amed & Spa Resort lists 32 treatments, from traditional massage to manicures and reflexology. An hour of the full-body pijat massage costs 120K IDR. Book on the hotel''s own site.';
-- expect: UPDATE 1

-- 8. W-hotel-uyah-amed-spa-resort-amed-best_for · hotel-uyah-amed-spa-resort-amed · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'hotel-uyah-amed-spa-resort-amed' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A three-hour treatment, or reflexology for feet tired from walking';
-- expect: UPDATE 1

-- 9. W-palm-garden-spa-amed-why_its_here · palm-garden-spa-amed · why_its_here · restore before
update venues set why_its_here = 'Day spa in Amed. The published treatment list runs to 7 items — Balinese Massage, Four Hands Massage and Facial. Booking is on the venue''s own site.' where slug = 'palm-garden-spa-amed' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Palm Garden Spa, a day spa in Amed, keeps seven treatments on its list, including Balinese massage, a four-hands massage and a facial. Booking is on the spa''s own site.';
-- expect: UPDATE 1

-- 10. W-palm-garden-spa-amed-best_for · palm-garden-spa-amed · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'palm-garden-spa-amed' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A four-hands massage or a facial in Amed';
-- expect: UPDATE 1

-- 11. W-aaron-spa-denpasar-why_its_here · aaron-spa-denpasar · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Denpasar. The published treatment list runs to 7 items — Aromatherapy, Manicure and Meditation. Booking is on the venue''s own site.' where slug = 'aaron-spa-denpasar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Aaron Spa is a massage studio in Denpasar with seven treatments. Aromatherapy, a manicure and meditation are among them, and you book through the studio''s own site.';
-- expect: UPDATE 1

-- 12. W-aaron-spa-denpasar-best_for · aaron-spa-denpasar · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'aaron-spa-denpasar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Meditation in Denpasar, with a manicure on the same list';
-- expect: UPDATE 1

-- 13. W-andre-bali-spa-karangasem-why_its_here · andre-bali-spa-karangasem · why_its_here · restore before
update venues set why_its_here = 'Day spa in east Bali. The published treatment list runs to 13 items — Facial, Pedicure and Manicure. Balinese DNA Massage is 850K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'andre-bali-spa-karangasem' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Andre Bali Spa is a day spa in east Bali with 13 treatments, from facials to pedicures and manicures. Its Balinese DNA Massage costs 850K IDR for an hour, and booking is on the spa''s own site.';
-- expect: UPDATE 1

-- 14. W-andre-bali-spa-karangasem-best_for · andre-bali-spa-karangasem · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'andre-bali-spa-karangasem' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial, a manicure or a pedicure in east Bali';
-- expect: UPDATE 1

-- 15. W-andre-bali-spa-karangasem-not_for · andre-bali-spa-karangasem · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 850K IDR.' where slug = 'andre-bali-spa-karangasem' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A massage for less than 850K IDR';
-- expect: UPDATE 1

-- 16. W-aquaria-s-inner-temple-spa-sanctuary-karangasem-why_its_here · aquaria-s-inner-temple-spa-sanctuary-karangasem · why_its_here · restore before
update venues set why_its_here = 'Day spa in east Bali. The published treatment list runs to 55 items — Foot Massage, Traditional Massage and Manicure. Balinese massage & healing oil without foot bath is 150K IDR for 50 minutes.' where slug = 'aquaria-s-inner-temple-spa-sanctuary-karangasem' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Aquaria''s Inner Temple spa sanctuary is a day spa in east Bali with 55 treatments, from foot massage and traditional massage to manicures. A 50-minute Balinese massage with healing oil, without the foot bath, is 150K IDR.';
-- expect: UPDATE 1

-- 17. W-aquaria-s-inner-temple-spa-sanctuary-karangasem-best_for · aquaria-s-inner-temple-spa-sanctuary-karangasem · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 210 minutes; tired feet after a day of walking.' where slug = 'aquaria-s-inner-temple-spa-sanctuary-karangasem' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Up to three and a half hours of treatment, or a foot massage between walks';
-- expect: UPDATE 1

-- 18. W-bali-healing-touch-karangasem-why_its_here · bali-healing-touch-karangasem · why_its_here · restore before
update venues set why_its_here = 'Massage studio in east Bali. The published treatment list runs to 10 items — Traditional Massage, Sports Massage and Deep Tissue. Booking is by WhatsApp.' where slug = 'bali-healing-touch-karangasem' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A massage studio in east Bali, Bali Healing Touch has ten treatments on its list, from traditional and sports massage to deep tissue. Bookings go through WhatsApp.';
-- expect: UPDATE 1

-- 19. W-bali-healing-touch-karangasem-best_for · bali-healing-touch-karangasem · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'bali-healing-touch-karangasem' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sports or deep tissue massage in east Bali';
-- expect: UPDATE 1

-- 20. W-bloo-lagoon-spa-wellness-karangasem-why_its_here · bloo-lagoon-spa-wellness-karangasem · why_its_here · restore before
update venues set why_its_here = 'Spa in east Bali. The published treatment list runs to 23 items — Traditional Massage, Facial and Hair Treatment. REFLEXOLOGY FOOT MASSAGE is 285K IDR for 60 minutes. Booking is by WhatsApp.' where slug = 'bloo-lagoon-spa-wellness-karangasem' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In east Bali, Bloo Lagoon Spa & Wellness is a spa whose 23 treatments cover traditional massage, facials and hair treatments. Reflexology foot massage costs 285K IDR for an hour, and you book by WhatsApp.';
-- expect: UPDATE 1

-- 21. W-bloo-lagoon-spa-wellness-karangasem-best_for · bloo-lagoon-spa-wellness-karangasem · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'bloo-lagoon-spa-wellness-karangasem' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A reflexology foot massage after a long day out, or up to two hours of treatment';
-- expect: UPDATE 1

-- 22. W-candi-beach-resort-spa-karangasem-why_its_here · candi-beach-resort-spa-karangasem · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in east Bali. The published treatment list runs to 5 items — Yoga. Booking is on the venue''s own site.' where slug = 'candi-beach-resort-spa-karangasem' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Candi Beach Resort & Spa has a wellness spa in east Bali with five items on its list, yoga among them. Booking is on the resort''s own site.';
-- expect: UPDATE 1

-- 23. W-candi-beach-resort-spa-karangasem-best_for · candi-beach-resort-spa-karangasem · best_for · restore before
update venues set best_for = 'Yoga booked the same day.' where slug = 'candi-beach-resort-spa-karangasem' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga at a beach resort in east Bali';
-- expect: UPDATE 1

-- 24. W-daura-candidasa-spa-karangasem-why_its_here · daura-candidasa-spa-karangasem · why_its_here · restore before
update venues set why_its_here = 'Spa in east Bali. The published treatment list runs to 32 items — Traditional Massage, Balinese Massage and Aromatherapy. Booking is by WhatsApp.' where slug = 'daura-candidasa-spa-karangasem' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A spa in east Bali with 32 treatments, Daura CandiDasa Spa covers traditional and Balinese massage as well as aromatherapy. WhatsApp is how you book.';
-- expect: UPDATE 1

-- 25. W-daura-candidasa-spa-karangasem-best_for · daura-candidasa-spa-karangasem · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'daura-candidasa-spa-karangasem' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Aromatherapy, or a Balinese massage set up over WhatsApp';
-- expect: UPDATE 1

-- 26. W-harmony-beauty-and-spa-bali-karangasem-why_its_here · harmony-beauty-and-spa-bali-karangasem · why_its_here · restore before
update venues set why_its_here = 'Day spa in east Bali. The published treatment list runs to 55 items — Traditional Massage, Hair Braiding and Nails. Booking is on the venue''s own site.' where slug = 'harmony-beauty-and-spa-bali-karangasem' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Hair braiding and nails sit beside traditional massage at Harmony Beauty and Spa Bali, a day spa in east Bali with 55 treatments. You book on its own site.';
-- expect: UPDATE 1

-- 27. W-harmony-beauty-and-spa-bali-karangasem-best_for · harmony-beauty-and-spa-bali-karangasem · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'harmony-beauty-and-spa-bali-karangasem' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Getting your hair braided or your nails done';
-- expect: UPDATE 1

-- 28. W-jaya-spa-karangasem-why_its_here · jaya-spa-karangasem · why_its_here · restore before
update venues set why_its_here = 'Day spa in east Bali. The published treatment list runs to 24 items — Traditional Massage, Hair Treatment and Scalp Treatment. Puri Sense Body Massage is 847K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'jaya-spa-karangasem' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Jaya Spa is an east Bali day spa where the 24 treatments go beyond traditional massage to hair and scalp treatments. An hour of the Puri Sense Body Massage costs 847K IDR. Book on the spa''s own site.';
-- expect: UPDATE 1

-- 29. W-jaya-spa-karangasem-best_for · jaya-spa-karangasem · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'jaya-spa-karangasem' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A hair or scalp treatment, or a session of up to three hours';
-- expect: UPDATE 1

-- 30. W-nirjhara-tabanan-why_its_here · nirjhara-tabanan · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Tabanan. The published treatment list runs to 8 items — Reiki, Traditional Massage and Body Scrub. Booking is by WhatsApp.' where slug = 'nirjhara-tabanan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In Tabanan, Nirjhara is a wellness spa with eight treatments, including reiki, traditional massage and a body scrub. Bookings are by WhatsApp.';
-- expect: UPDATE 1

-- 31. W-nirjhara-tabanan-best_for · nirjhara-tabanan · best_for · restore before
update venues set best_for = 'Reiki booked the same day.' where slug = 'nirjhara-tabanan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reiki or a body scrub in Tabanan';
-- expect: UPDATE 1

-- 32. W-nusa-indah-bungalows-villa-karangasem-why_its_here · nusa-indah-bungalows-villa-karangasem · why_its_here · restore before
update venues set why_its_here = 'Resort spa in east Bali. The published treatment list runs to 18 items — Traditional Massage, Balinese Massage and Hot Stone. Booking is on the venue''s own site.' where slug = 'nusa-indah-bungalows-villa-karangasem' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Nusa Indah Bungalows & Villa has a resort spa in east Bali, and its 18 treatments include traditional and Balinese massage and hot stone. You book on the resort''s website.';
-- expect: UPDATE 1

-- 33. W-nusa-indah-bungalows-villa-karangasem-best_for · nusa-indah-bungalows-villa-karangasem · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'nusa-indah-bungalows-villa-karangasem' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A hot stone or Balinese massage at the resort spa';
-- expect: UPDATE 1

-- 34. W-rps-spa-bali-denpasar-why_its_here · rps-spa-bali-denpasar · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Denpasar. The published treatment list runs to 6 items — Traditional Massage. Booking is by WhatsApp.' where slug = 'rps-spa-bali-denpasar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'RPS Spa Bali is a wellness spa in Denpasar with six treatments on its list, traditional massage among them. Book over WhatsApp.';
-- expect: UPDATE 1

-- 35. W-rps-spa-bali-denpasar-best_for · rps-spa-bali-denpasar · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'rps-spa-bali-denpasar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Anyone in Denpasar after a traditional massage';
-- expect: UPDATE 1

-- 36. W-serene-bali-spa-denpasar-why_its_here · serene-bali-spa-denpasar · why_its_here · restore before
update venues set why_its_here = 'Day spa in Denpasar. The published treatment list runs to 13 items — Traditional Massage, Aromatherapy and Shirodhara. Booking is by WhatsApp.' where slug = 'serene-bali-spa-denpasar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'In Denpasar, Serene Bali Spa is a day spa with 13 treatments, among them traditional massage, aromatherapy and shirodhara. You book by WhatsApp.';
-- expect: UPDATE 1

-- 37. W-serene-bali-spa-denpasar-best_for · serene-bali-spa-denpasar · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'serene-bali-spa-denpasar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Shirodhara or aromatherapy in Denpasar';
-- expect: UPDATE 1

-- 38. W-spa-spa-bali-denpasar-why_its_here · spa-spa-bali-denpasar · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Denpasar. The published treatment list runs to 9 items — Body Scrub, Ear Candle and Spa Package.' where slug = 'spa-spa-bali-denpasar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A wellness spa in Denpasar, Spa Spa Bali has nine treatments on its list. A body scrub, an ear candle and spa packages are among them.';
-- expect: UPDATE 1

-- 39. W-spa-spa-bali-denpasar-best_for · spa-spa-bali-denpasar · best_for · restore before
update venues set best_for = 'Body scrub booked the same day.' where slug = 'spa-spa-bali-denpasar' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An ear candle treatment, with body scrubs and spa packages also on the list';
-- expect: UPDATE 1

-- 40. W-suenyo-eco-retreat-tabanan-why_its_here · suenyo-eco-retreat-tabanan · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Tabanan. The published treatment list runs to 5 items — Traditional Massage and Spa Package.' where slug = 'suenyo-eco-retreat-tabanan' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Suenyo Eco Retreat in Tabanan is a wellness spa with five treatments, among them traditional massage and a spa package.';
-- expect: UPDATE 1

-- 41. W-suenyo-eco-retreat-tabanan-best_for · suenyo-eco-retreat-tabanan · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'suenyo-eco-retreat-tabanan' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A spa package or traditional massage at an eco retreat in Tabanan';
-- expect: UPDATE 1

-- 42. W-the-green-spa-karangasem-why_its_here · the-green-spa-karangasem · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in east Bali. The published treatment list runs to 18 items — Traditional Massage, Aromatherapy and Foot Massage. FOOT & LEG MASSAGE is 230K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'the-green-spa-karangasem' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Green Spa is a wellness spa in east Bali with 18 treatments, including traditional massage and aromatherapy. An hour of foot and leg massage costs 230K IDR, booked on the spa''s own site.';
-- expect: UPDATE 1

-- 43. W-the-green-spa-karangasem-best_for · the-green-spa-karangasem · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 150 minutes; tired feet after a day of walking.' where slug = 'the-green-spa-karangasem' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Two and a half hours of treatment, or a foot and leg massage after sightseeing';
-- expect: UPDATE 1

-- 44. W-air-seseh-recovery-club-canggu-why_its_here · air-seseh-recovery-club-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness centre in Canggu. The published treatment list runs to 6 items — Sauna. Booking is on the venue''s own site.' where slug = 'air-seseh-recovery-club-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A wellness centre in Canggu, Air Seseh Recovery Club has six things on its list, a sauna among them. Book on the club''s own site.';
-- expect: UPDATE 1

-- 45. W-air-seseh-recovery-club-canggu-best_for · air-seseh-recovery-club-canggu · best_for · restore before
update venues set best_for = 'Sauna booked the same day.' where slug = 'air-seseh-recovery-club-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sauna at a recovery club in Canggu';
-- expect: UPDATE 1

-- 46. W-alam-wellness-bali-canggu-why_its_here · alam-wellness-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 9 items — Traditional Massage, Body Scrub and Facial. Booking is on the venue''s own site.' where slug = 'alam-wellness-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Alam Wellness Bali, a wellness spa in Canggu, has nine treatments, among them traditional massage, a body scrub and a facial. Book through its own site.';
-- expect: UPDATE 1

-- 47. W-alam-wellness-bali-canggu-best_for · alam-wellness-bali-canggu · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'alam-wellness-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A body scrub or a facial in Canggu';
-- expect: UPDATE 1

-- 48. W-ameline-beauty-spa-canggu-why_its_here · ameline-beauty-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Spa in Canggu. The published treatment list runs to 20 items — Traditional Massage, Balinese Massage and Hot Stone. Booking is on the venue''s own site.' where slug = 'ameline-beauty-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ameline Beauty & Spa is a spa in Canggu with 20 treatments. Hot stone sits on the list next to traditional and Balinese massage, and you book on the spa''s own site.';
-- expect: UPDATE 1

-- 49. W-ameline-beauty-spa-canggu-best_for · ameline-beauty-spa-canggu · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'ameline-beauty-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Hot stone, or a Balinese massage if you''d rather';
-- expect: UPDATE 1

-- 50. W-amo-spa-canggu-why_its_here · amo-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 4 items — Balinese Massage, Balinese Boreh and Javanese Lulur. Balinese Massage is 500K IDR for 60 minutes.' where slug = 'amo-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Four treatments make up the list at AMO Spa, a day spa in Canggu, including Balinese massage, a Balinese boreh and a Javanese lulur. An hour of Balinese massage costs 500K IDR.';
-- expect: UPDATE 1

-- 51. W-amo-spa-canggu-best_for · amo-spa-canggu · best_for · restore before
update venues set best_for = 'Balinese massage booked the same day.' where slug = 'amo-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Balinese boreh or a Javanese lulur in Canggu';
-- expect: UPDATE 1

-- 52. W-bali-dream-villa-resort-echo-beach-canggu-canggu-why_its_here · bali-dream-villa-resort-echo-beach-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'Resort spa in Canggu. The published treatment list runs to 6 items — Couple Massage and Traditional Massage. Sweet Couple Dinner is 1500K IDR. Booking is on the venue''s own site.' where slug = 'bali-dream-villa-resort-echo-beach-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Dream Villa Resort Echo Beach Canggu has a resort spa with six items, among them a couple massage and a traditional massage. Book on the resort''s own site.';
-- expect: UPDATE 1

-- 53. W-bali-dream-villa-resort-echo-beach-canggu-canggu-best_for · bali-dream-villa-resort-echo-beach-canggu-canggu · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'bali-dream-villa-resort-echo-beach-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, with a couple massage on the list';
-- expect: UPDATE 1

-- 54. W-bali-serene-nature-canggu-why_its_here · bali-serene-nature-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 10 items — Facial, Traditional Massage and Balinese Massage. Booking is on the venue''s own site.' where slug = 'bali-serene-nature-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Bali Serene Nature, a day spa in Canggu, has ten treatments, from a facial to traditional and Balinese massage. Book on its own site.';
-- expect: UPDATE 1

-- 55. W-bali-serene-nature-canggu-best_for · bali-serene-nature-canggu · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'bali-serene-nature-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial, with traditional and Balinese massage too';
-- expect: UPDATE 1

-- 56. W-beach-house-by-tonic-canggu-why_its_here · beach-house-by-tonic-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 60 items — Traditional Massage, Balinese Massage and Deep Tissue. Super Relaxing Foot Massage is 250K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'beach-house-by-tonic-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Beach House by Tonic is a day spa in Canggu with a 60-item treatment list that takes in traditional, Balinese and deep tissue massage. The Super Relaxing Foot Massage is 250K IDR for an hour, booked on the spa''s own site.';
-- expect: UPDATE 1

-- 57. W-beach-house-by-tonic-canggu-best_for · beach-house-by-tonic-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 180 minutes; tired feet after a day of walking.' where slug = 'beach-house-by-tonic-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A three-hour session, or a foot massage after a day on your feet';
-- expect: UPDATE 1

-- 58. W-beautyfulspa-canggu-why_its_here · beautyfulspa-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 6 items — Traditional Massage and Aromatherapy. Bali Paradise Massage is 270K IDR for 90 minutes. Booking is on the venue''s own site.' where slug = 'beautyfulspa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Beautyfulspa in Canggu is a day spa whose six treatments include traditional massage and aromatherapy. A 90-minute massage from the list costs 270K IDR. Book on the spa''s own site.';
-- expect: UPDATE 1

-- 59. W-beautyfulspa-canggu-best_for · beautyfulspa-canggu · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'beautyfulspa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A 90-minute massage or aromatherapy';
-- expect: UPDATE 1

-- 60. W-blue-karma-village-canggu-why_its_here · blue-karma-village-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 9 items — Balinese Massage, Yoga and Pilates. Booking is on the venue''s own site.' where slug = 'blue-karma-village-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Blue Karma Village is a wellness spa in Canggu where the nine-item list mixes Balinese massage with yoga and Pilates. Booking is on its own site.';
-- expect: UPDATE 1

-- 61. W-blue-karma-village-canggu-best_for · blue-karma-village-canggu · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'blue-karma-village-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Yoga or Pilates while you''re in Canggu';
-- expect: UPDATE 1

-- 62. W-cocoon-medical-spa-canggu-why_its_here · cocoon-medical-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 10 items — Spa Package, Anti-aging Facial and Detox Treatment. Booking is by WhatsApp.' where slug = 'cocoon-medical-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An anti-aging facial, a detox treatment and spa packages are on the ten-item list at Cocoon Medical Spa, a wellness spa in Canggu. Book by WhatsApp.';
-- expect: UPDATE 1

-- 63. W-cocoon-medical-spa-canggu-best_for · cocoon-medical-spa-canggu · best_for · restore before
update venues set best_for = 'Spa package booked the same day.' where slug = 'cocoon-medical-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An anti-aging facial or a detox treatment';
-- expect: UPDATE 1

-- 64. W-como-shambhala-uma-canggu-canggu-why_its_here · como-shambhala-uma-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 14 items — Traditional Massage, Javanese Lulur and Body Wrap. Booking is on the venue''s own site.' where slug = 'como-shambhala-uma-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'At COMO Shambhala Uma Canggu, the wellness spa has 14 treatments, including traditional massage, a Javanese lulur and a body wrap. Bookings are made on its website.';
-- expect: UPDATE 1

-- 65. W-como-shambhala-uma-canggu-canggu-best_for · como-shambhala-uma-canggu-canggu · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'como-shambhala-uma-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A Javanese lulur, with body wraps on the list too';
-- expect: UPDATE 1

-- 66. W-ecosfera-hotel-canggu-why_its_here · ecosfera-hotel-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 6 items — Traditional Massage, Manicure and Pedicure.' where slug = 'ecosfera-hotel-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Ecosfera Hotel''s wellness spa in Canggu keeps six treatments on its list, from traditional massage to a manicure and a pedicure.';
-- expect: UPDATE 1

-- 67. W-ecosfera-hotel-canggu-best_for · ecosfera-hotel-canggu · best_for · restore before
update venues set best_for = 'Traditional massage booked the same day.' where slug = 'ecosfera-hotel-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A traditional massage, or a manicure and pedicure, at the hotel spa in Canggu';
-- expect: UPDATE 1

-- 68. W-espace-spa-bali-canggu-why_its_here · espace-spa-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'Massage studio in Canggu. The published treatment list runs to 22 items — Deep Tissue, Pregnancy Massage and Four Hands Massage. Crystal aromatheraphy foot reflexology is 299K IDR for 60 minutes. Booking is on the venue''s own site.' where slug = 'espace-spa-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Espace Spa Bali is a massage studio in Canggu with 22 treatments, including deep tissue, pregnancy massage and a four-hands massage. An hour of crystal aromatherapy foot reflexology costs 299K IDR, booked on the studio''s own site.';
-- expect: UPDATE 1

-- 69. W-espace-spa-bali-canggu-best_for · espace-spa-bali-canggu · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'espace-spa-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An hour of crystal aromatherapy reflexology for walking-sore feet';
-- expect: UPDATE 1

-- 70. W-fajar-bali-luxury-spa-canggu-why_its_here · fajar-bali-luxury-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 34 items — Spa Package, Facial and Traditional Massage. Mom to Be Massage is 505K IDR. Booking is by WhatsApp.' where slug = 'fajar-bali-luxury-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'With 34 treatments, Fajar Bali Luxury Spa is a day spa in Canggu covering spa packages, facials and traditional massage. The Mom to Be Massage costs 505K IDR, and booking is by WhatsApp.';
-- expect: UPDATE 1

-- 71. W-fajar-bali-luxury-spa-canggu-best_for · fajar-bali-luxury-spa-canggu · best_for · restore before
update venues set best_for = 'Couples — the list includes a couple treatment.' where slug = 'fajar-bali-luxury-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Couples, since a couple treatment is on the list';
-- expect: UPDATE 1

-- 72. W-glo-bali-canggu-why_its_here · glo-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'Beauty salon in Canggu. The published treatment list runs to 34 items — Facial, Traditional Massage and Spa Package. Booking is on the venue''s own site.' where slug = 'glo-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Facials, traditional massage and spa packages are part of the 34-treatment list at Glo Bali, a beauty salon in Canggu. Booking is on the salon''s own site.';
-- expect: UPDATE 1

-- 73. W-glo-bali-canggu-best_for · glo-bali-canggu · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'glo-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A facial at a beauty salon in Canggu';
-- expect: UPDATE 1

-- 74. W-hati-thai-canggu-why_its_here · hati-thai-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 33 items — Traditional Massage, Balinese Massage and Thai Massage. Foot Serenity – Foot Reflexology is 160K IDR for 60 minutes. Booking runs through Fresha.' where slug = 'hati-thai-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Thai massage sits alongside traditional and Balinese at Hati Thai, a day spa in Canggu with 33 treatments. An hour of Foot Serenity reflexology costs 160K IDR, and bookings run through Fresha.';
-- expect: UPDATE 1

-- 75. W-hati-thai-canggu-best_for · hati-thai-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'hati-thai-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology for tired feet, or a session as long as two hours';
-- expect: UPDATE 1

-- 76. W-korra-spa-canggu-why_its_here · korra-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 18 items — Balinese Massage, Facial and Body Scrub. Booking is on the venue''s own site.' where slug = 'korra-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Korra Spa in Canggu is a day spa with 18 treatments, including Balinese massage, a facial and a body scrub. Booking is on the spa''s own site.';
-- expect: UPDATE 1

-- 77. W-korra-spa-canggu-best_for · korra-spa-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'korra-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A body scrub or a facial, with treatments running up to two hours';
-- expect: UPDATE 1

-- 78. W-korra-spa-canggu-not_for · korra-spa-canggu · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 650K IDR.' where slug = 'korra-spa-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A low-cost massage: Korra Spa''s prices start at 650K IDR';
-- expect: UPDATE 1

-- 79. W-koya-spa-canggu-why_its_here · koya-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 22 items — Traditional Massage, Deep Tissue and Four Hands Massage. BALI BLISS MASSAGE is 350K IDR for 60 minutes. Booking runs through Fresha.' where slug = 'koya-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'KOYA SPA, a wellness spa in Canggu, lists 22 treatments, from traditional massage to deep tissue and a four-hands massage. The Bali Bliss Massage costs 350K IDR for an hour; book through Fresha.';
-- expect: UPDATE 1

-- 80. W-koya-spa-canggu-best_for · koya-spa-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'koya-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Up to two hours on the massage table in Canggu';
-- expect: UPDATE 1

-- 81. W-maja-canggu-why_its_here · maja-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 5 items — Traditional Massage, Hydrating Facial and Facial. Booking is on the venue''s own site.' where slug = 'maja-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Maja is a wellness spa in Canggu with five treatments, including traditional massage and a hydrating facial. Book on its own site.';
-- expect: UPDATE 1

-- 82. W-maja-canggu-best_for · maja-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes.' where slug = 'maja-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Two hours set aside for a treatment';
-- expect: UPDATE 1

-- 83. W-maja-canggu-not_for · maja-canggu · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 1080K IDR.' where slug = 'maja-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'Anyone after a budget massage — prices start at 1080K IDR';
-- expect: UPDATE 1

-- 84. W-manori-spa-canggu-why_its_here · manori-spa-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 21 items — Traditional Massage, Reflexology and Pregnancy Massage. Therapeutic massage - Traditional Oriental – Full Body is 200K IDR for 60 minutes.' where slug = 'manori-spa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Pregnancy massage and reflexology sit next to traditional massage at Manori Spa, a wellness spa in Canggu with 21 treatments. An hour of therapeutic massage, traditional oriental and full body, costs 200K IDR.';
-- expect: UPDATE 1

-- 85. W-manori-spa-canggu-best_for · manori-spa-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 120 minutes; tired feet after a day of walking.' where slug = 'manori-spa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Reflexology after walking all day, or a treatment of up to two hours';
-- expect: UPDATE 1

-- 86. W-mello-spa-canggu-canggu-why_its_here · mello-spa-canggu-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 43 items — Facial, Spa Package and Traditional Massage. Mello Signature Massage is 650K IDR for 60 minutes. Booking runs through Zenoti.' where slug = 'mello-spa-canggu-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Mello Spa Canggu is a wellness spa with 43 treatments, from facials and spa packages to traditional massage. An hour of the Mello Signature Massage is 650K IDR. Bookings go through Zenoti.';
-- expect: UPDATE 1

-- 87. W-mello-spa-canggu-canggu-best_for · mello-spa-canggu-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 245 minutes.' where slug = 'mello-spa-canggu-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Up to 245 minutes of treatments, booked through Zenoti';
-- expect: UPDATE 1

-- 88. W-nikara-spa-berawa-canggu-why_its_here · nikara-spa-berawa-canggu · why_its_here · restore before
update venues set why_its_here = 'Wellness spa in Canggu. The published treatment list runs to 14 items — Spa Package, Balinese Massage and Facial. Balinese Harmony Healing Massage is 590K IDR for 90 minutes. Booking is on the venue''s own site.' where slug = 'nikara-spa-berawa-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Balinese massage, facials and spa packages share the 14-treatment list at Nikara Spa Berawa, a wellness spa in Canggu. The 90-minute Balinese Harmony Healing Massage costs 590K IDR; book on the spa''s own site.';
-- expect: UPDATE 1

-- 89. W-nikara-spa-berawa-canggu-best_for · nikara-spa-berawa-canggu · best_for · restore before
update venues set best_for = 'A long reset — treatments run up to 210 minutes.' where slug = 'nikara-spa-berawa-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Three and a half hours of treatments in Berawa';
-- expect: UPDATE 1

-- 90. W-nikara-spa-berawa-canggu-not_for · nikara-spa-berawa-canggu · not_for · restore before
update venues set not_for = 'A budget massage — the list starts at 500K IDR.' where slug = 'nikara-spa-berawa-canggu' and status = 'active' and publication_status = 'published' and not_for is not distinct from 'A budget massage. Nothing on the list costs under 500K IDR';
-- expect: UPDATE 1

-- 91. W-nomads-haus-canggu-why_its_here · nomads-haus-canggu · why_its_here · restore before
update venues set why_its_here = 'Day spa in Canggu. The published treatment list runs to 8 items — Facial, Sports Massage and Balinese Massage. Booking is on the venue''s own site.' where slug = 'nomads-haus-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Nomads Haus in Canggu is a day spa whose eight treatments include a facial, a sports massage and a Balinese massage. You book on the Nomads Haus site.';
-- expect: UPDATE 1

-- 92. W-nomads-haus-canggu-best_for · nomads-haus-canggu · best_for · restore before
update venues set best_for = 'Tired feet after a day of walking.' where slug = 'nomads-haus-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A sports massage or a facial in Canggu';
-- expect: UPDATE 1

-- 93. W-only-nails-bali-canggu-why_its_here · only-nails-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'Nail salon in Canggu. The published treatment list runs to 25 items — Manicure, Pedicure and Nails. One Finger Repair is 50K IDR. Booking is on the venue''s own site.' where slug = 'only-nails-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Only Nails Bali is a nail salon in Canggu with 25 treatments, manicures and pedicures among them. A one-finger repair costs 50K IDR, and you book on the salon''s own site.';
-- expect: UPDATE 1

-- 94. W-only-nails-bali-canggu-best_for · only-nails-bali-canggu · best_for · restore before
update venues set best_for = 'Manicure booked the same day.' where slug = 'only-nails-bali-canggu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A manicure, a pedicure or a one-finger repair';
-- expect: UPDATE 1
