-- Ubud wellness discovery pass (0025) -- NEW venue rows. The Ubud catalogue had
-- ZERO yoga/spa/wellness venues despite that being Ubud's signature category; this
-- is a discovery task (new rows), not enrichment. 24 established, currently-operating
-- Ubud yoga / spa / sound-healing / retreat venues, each found and verified against
-- first-party sources (official site / official IG / reputable non-review listings).
--
-- All use the existing 'spa' umbrella category (no new category -> guardrail #11).
-- Ubud is planning/next_deep: NO money loop, no perks/tablepilot, no booking-as-a-
-- feature language (#4). GUARDRAILS: no review text/ratings (#1); best_for/not_for
-- are WHO/WHEN fit-context only, never quality warnings (#7); prices as bands.
-- jobs left null (the job vocabulary is dining-oriented; none fit wellness).
--
-- Each insert is NOT EXISTS-guarded on slug, so re-running is a no-op. Venue detail
-- pages stay noindex (no rights-cleared photos yet); these surface on /ubud's new
-- wellness guide + pillar section (shipped in the same branch commit).
--
-- Geography note: venues that market themselves as "Ubud" but sit outside Ubud and
-- its villages were deliberately DROPPED during research (Fivelements/Mambal,
-- Yoga Searcher/Uluwatu, The Practice/Canggu, House of Om/Bona, Nirarta/Sidemen).

begin;

-- 1. the-yoga-barn
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'the-yoga-barn', 'The Yoga Barn', 'spa', 'ubud', 'Padang Tegal / Pengosekan, Ubud', 'Jl. Raya Pengosekan, Padang Tegal, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=The+Yoga+Barn+Ubud+Bali', 'https://theyogabarn.com/', 'Ubud''s largest and best-known wellness compound: a cluster of open-air shalas, a healing center, garden cafe and shop hosting dozens of daily yoga, meditation and sound classes.', 'First-time visitors who want the full range of drop-in classes in one place, and anyone curious about Ubud''s ecstatic-dance and sound-healing scene.', 'People seeking a small, quiet studio with individual attention, as classes here can be large.', 'Vinyasa and hatha flow; ecstatic dance (Friday nights, Sunday mornings); sound healing; meditation', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'the-yoga-barn');

-- 2. radiantly-alive
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'radiantly-alive', 'Radiantly Alive', 'spa', 'ubud', 'Padang Tegal / Pengosekan, Ubud', 'Jl. Jembawan No. 3, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=Radiantly+Alive+Ubud+Bali', 'https://www.radiantlyalive.com/', 'https://www.instagram.com/radiantlyaliveyoga/', 'A long-running central-Ubud studio known for dynamic Vinyasa flows, healing therapies and internationally attended teacher trainings, with an on-site plant-based cafe.', 'Movement-focused practitioners who want strong, creative Vinyasa classes and those considering a yoga teacher training.', 'Dynamic Vinyasa flow; Yin; healing therapies; 200/300hr teacher trainings', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'radiantly-alive');

-- 3. ubud-yoga-house
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, not_for, price_anchor, price_band, tier, is_sponsored, status, id)
select 'ubud-yoga-house', 'Ubud Yoga House', 'spa', 'ubud', 'Sokwayah, Ubud', 'Jl. Subak Sokwayah, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=Ubud+Yoga+House+Bali', 'https://ubudyogahouse.com/', 'A boutique, slightly off-the-beaten-path studio offering small classes in open-air shalas that overlook rice terraces and jungle.', 'Practitioners who prefer small classes with personalised attention and a quiet, green setting away from the crowds.', 'Anyone wanting a big buzzing studio with a packed daily timetable.', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'ubud-yoga-house');

-- 4. ubud-yoga-centre
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'ubud-yoga-centre', 'Ubud Yoga Centre', 'spa', 'ubud', 'Nyuh Kuning, Ubud', 'Jl. Raya Singakerta No. 108, Nyuh Kuning, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=Ubud+Yoga+Centre+Bali', 'https://ubudyogacentre.com/', 'A contemporary two-tier complex on the edge of Nyuh Kuning, best known as Ubud''s dedicated hot-yoga studio, with a gong centre, kids centre and cafe.', 'Practitioners specifically after a heated practice (Bikram/hot Ashtanga) and families wanting a kids programme.', 'Anyone who dislikes heat or prefers gentle, cool-room classes.', 'Hot yoga (Bikram and hot Ashtanga); gong sessions', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'ubud-yoga-centre');

-- 5. taksu-yoga-ubud
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'taksu-yoga-ubud', 'Taksu Yoga & Wellness Center', 'spa', 'ubud', 'Central Ubud (Jl. Goutama Selatan)', 'Jl. Goutama Selatan, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=Taksu+Wellness+Center+Ubud+Bali', 'https://taksu.org/', 'A wellness center hidden in a central-Ubud garden combining small-group yoga classes with an extensive spa, healing and beauty menu.', 'Those who want intimate, personalised classes and to pair a practice with a massage or spa treatment in the same visit.', 'Small-group hatha, vinyasa, yin and restorative yoga; spa and healing treatments', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'taksu-yoga-ubud');

-- 6. intuitive-flow
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'intuitive-flow', 'Intuitive Flow', 'spa', 'ubud', 'Penestanan Kelod, Ubud', 'Nalanda School, Penestanan Kelod, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=Intuitive+Flow+Yoga+Penestanan+Ubud+Bali', 'https://www.intuitiveflow.com/', 'A long-established Penestanan studio with a glass-walled, open-air shala perched above the rice fields, reached by the hillside footpath near Alchemy.', 'Practitioners who want daily drop-in classes across many styles in one of Ubud''s most scenic garden settings; good for beginners.', 'Anyone unable to manage the short uphill walk from the road.', 'Hatha, Vinyasa, Ashtanga and Yin drop-in classes', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'intuitive-flow');

-- 7. pyramids-of-chi
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'pyramids-of-chi', 'Pyramids of Chi', 'spa', 'ubud', 'Bentuyung, north of Ubud', 'Jl. Kelebang Moding, Bentuyung Sari, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=Pyramids+of+Chi+Ubud+Bali', 'https://ubud.pyramidsofchi.com/', 'A purpose-built sound-healing venue set among rice fields north of Ubud, with two large pyramids (one scaled to the Great Pyramid of Giza) used for group sound sessions.', 'Anyone wanting a signature Ubud sound-healing experience and a distinctive one-off wellness outing rather than a regular class.', 'Those looking for a physical yoga workout, as the focus here is passive sound and vibration.', 'Ancient Sound Healing; Light Sound Vibration (LSV); moon ceremonies; breath and voice workshops', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'pyramids-of-chi');

-- 8. alchemy-yoga-meditation-center
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'alchemy-yoga-meditation-center', 'Alchemy Yoga & Meditation Center', 'spa', 'ubud', 'Penestanan, Ubud', 'Jl. Penestanan Kelod No. 75, Penestanan, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=Alchemy+Yoga+Meditation+Center+Ubud+Bali', 'https://www.alchemyyogacenter.com/', 'A Penestanan center focused on traditional tantra yoga with a large daily class menu, meditation and a weekly ecstatic-dance night, attached to the well-known Alchemy vegan cafe.', 'Practitioners drawn to tantra-influenced yoga, meditation and community events like ecstatic dance, plus a plant-based meal afterwards.', 'Tantra-inspired yoga; meditation; RISE ecstatic dance (Tuesday evenings)', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'alchemy-yoga-meditation-center');

-- 9. heart-space-bali
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'heart-space-bali', 'Heart Space Bali', 'spa', 'ubud', 'Nyuh Kuning / Pengosekan, Ubud', 'Jl. Nyuh Kuning No. 1, MAS, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=Heart+Space+Bali+Ubud', 'https://www.heartspacebali.com/', 'https://www.instagram.com/heartspace.bali/', 'A calm, holistic studio at the Pengosekan/Nyuh Kuning corner specialising in slower, restorative practice, sound and Balinese healing.', 'Those wanting gentle Yin and restorative yoga, sound baths and cacao or healing ceremonies rather than a vigorous flow.', 'Practitioners after a strong, athletic or heated class.', 'Yin and restorative yoga; sound healing; cacao ceremony; Balinese healing', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'heart-space-bali');

-- 10. the-shala-bali
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'the-shala-bali', 'The Shala Bali', 'spa', 'ubud', 'Sanggingan / Penestanan Kaja, Ubud', 'Jl. Sanggingan No. 90, Penestanan Kaja, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=The+Shala+Bali+Ubud', 'https://www.theshalabali.com/', 'https://www.instagram.com/theshalabali/', 'A boutique yoga-retreat property in Sanggingan built on Balinese and Indian philosophy, pairing daily yoga with Ayurvedic spa treatments and on-site vegetarian dining and rooms.', 'Visitors wanting a stay-and-practice retreat experience with Ayurvedic treatments, not just a walk-in class.', 'Travellers only after a quick single drop-in class.', 'Multi-day yoga retreat packages; Ayurvedic spa treatments', '$$$', '$$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'the-shala-bali');

-- 11. oneworld-ayurveda
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'oneworld-ayurveda', 'Oneworld Ayurveda', 'spa', 'ubud', 'Pengosekan, Ubud', 'Pengosekan, Ubud, Gianyar 80571', 'https://www.google.com/maps/search/?api=1&query=Oneworld+Ayurveda+Ubud+Bali', 'https://oneworldayurveda.com/ubud/', 'An authentic Panchakarma detox retreat on a palace property amid jungle and rice fields, with resident BAMS-qualified Ayurvedic doctors guiding multi-night programmes.', 'Travellers ready to commit to a structured, doctor-supervised Ayurvedic detox of 7 nights or more.', 'Anyone wanting casual drop-in yoga or a short, self-directed visit.', '7/14/21-night Panchakarma detox programs', '$$$$', '$$$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'oneworld-ayurveda');

-- 12. karsa-spa
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'karsa-spa', 'Karsa Spa', 'spa', 'ubud', 'Campuhan Ridge / Bangkiang Sidem', 'Bangkiang Sidem, on the Artist''s Trail at the end of the Campuhan Ridge Walk, Ubud', 'https://www.google.com/maps/search/?api=1&query=Karsa+Spa+Ubud+Bali', 'https://karsaspa.com/', 'https://www.instagram.com/karsaspa/', 'Open-air spa sat among rice fields at the end of the Campuhan Ridge Walk, founded in 2012 and known for deep-tissue shiatsu, Balinese, Thai and sports massage plus Reiki and chakra healing using organic and Ayurvedic oils.', 'Walkers finishing the Campuhan Ridge Walk, and couples who want a rice-field, open-air massage setting away from the town noise.', 'Travellers who need a central in-town location or same-day walk-in; it is a ~30-minute walk out and books up days ahead.', 'Balinese massage; deep-tissue shiatsu; sacred clay body mask followed by a hot flower bath; couples package', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'karsa-spa');

-- (Taksu Spa merged into taksu-yoga-ubud above — same venue/site/address, split by
--  the two research passes; kept as a single Taksu Yoga & Wellness Center entry.)

-- 14. sang-spa
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'sang-spa', 'Sang Spa & Yoga', 'spa', 'ubud', 'Padang Tegal / Pengosekan', 'Jl. Jembawan No. 13B, Padang Tegal, Ubud (with a second Pengosekan outlet)', 'https://www.google.com/maps/search/?api=1&query=Sang+Spa+Ubud+Bali', 'https://sangspa.com/', 'https://www.instagram.com/sangspaubud/', 'Long-running (established 2008) affordable Balinese day spa with two central Ubud outlets, offering traditional Balinese massage, scrubs, flower baths, reflexology and four-hands massage.', 'Budget-conscious travellers wanting authentic, well-priced Balinese massage a short walk from Ubud centre.', 'Traditional Balinese massage; scrub and flower-bath package; four-hands massage', '$', '$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'sang-spa');

-- 15. kush-ayurveda-yoga-barn
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'kush-ayurveda-yoga-barn', 'KUSH Ayurvedic Rejuvenation Spa at The Yoga Barn', 'spa', 'ubud', 'Padang Tegal / Peliatan (The Yoga Barn)', 'Jl. Sukma / Pengosekan, at The Yoga Barn, Ubud', 'https://www.google.com/maps/search/?api=1&query=Kush+Ayurvedic+Spa+Yoga+Barn+Ubud+Bali', 'https://theyogabarn.com/', 'Ayurveda-focused spa inside The Yoga Barn where therapists first assess your dosha and then tailor treatments - Abhyanga, Shirodhara, hot-stone Shila massage and Ayurvedic facials with freshly prepared botanicals.', 'Yoga Barn visitors and travellers who specifically want authentic Ayurvedic treatment (dosha consultation, Shirodhara).', 'Walk-ins - treatments must be booked in advance.', 'Abhyanga massage; Shirodhara; Ayurvedic dosha-based treatments and facial', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'kush-ayurveda-yoga-barn');

-- 16. bali-botanica-spa
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'bali-botanica-spa', 'Bali Botanica by Oneworld Ayurveda', 'spa', 'ubud', 'Sanggingan / Kedewatan', 'Jl. Raya Sanggingan, Kedewatan, Ubud', 'https://www.google.com/maps/search/?api=1&query=Bali+Botanica+Day+Spa+Ubud+Bali', 'https://balibotanica.com/', 'Day spa established in 2006 on the Sanggingan ridge overlooking jungle and rice fields; relaunched in 2024 under Oneworld Ayurveda as an Ayurvedic day spa combining Balinese and Ayurvedic treatments and programs.', 'Travellers wanting Ayurvedic treatments or day programs in a jungle-and-rice-field setting on the Sanggingan side of Ubud.', 'Ayurvedic Abhyanga massage; warming Balinese Boreh body wrap; Ayurvedic day programs', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'bali-botanica-spa');

-- 17. putri-bali-spa
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'putri-bali-spa', 'Putri Bali Spa', 'spa', 'ubud', 'Sanggingan', 'Jl. Raya Sanggingan, Ubud', 'https://www.google.com/maps/search/?api=1&query=Putri+Bali+Spa+Ubud+Bali', 'https://www.putribalispa.com/', 'Balinese day spa on Jl. Raya Sanggingan offering traditional massage, body treatments, aromatherapy and flower-bath packages, with complimentary pickup within the Ubud area.', 'Travellers wanting a classic Balinese massage and flower bath with free hotel pickup.', 'Balinese massage; flower-bath package', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'putri-bali-spa');

-- 18. mango-tree-spa-loccitane
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'mango-tree-spa-loccitane', 'Mango Tree Spa by L''OCCITANE', 'spa', 'ubud', 'Kedewatan / Ayung River valley', 'At Kupu Kupu Barong Villas, Ayung River valley, Kedewatan, Ubud', 'https://www.google.com/maps/search/?api=1&query=Mango+Tree+Spa+by+LOCCITANE+Ubud+Bali', 'https://www.mangotreespabali.com/', 'Luxury spa at Kupu Kupu Barong Villas in the Ayung River valley, with treatment rooms built into a giant mango tree, L''OCCITANE product rituals and one of the largest steam rooms in Bali.', 'A splurge or romantic luxury spa day with river-valley views and branded L''OCCITANE rituals.', 'Budget travellers or those wanting a central-town walk-in.', 'L''OCCITANE signature rituals; fresh-mango body treatment; tree-top massage', '$$$', '$$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'mango-tree-spa-loccitane');

-- 19. jaens-spa
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'jaens-spa', 'Jaens Spa', 'spa', 'ubud', 'Pengosekan / Monkey Forest', 'Jl. Raya Pengosekan, Ubud (multiple outlets near Monkey Forest)', 'https://www.google.com/maps/search/?api=1&query=Jaens+Spa+Ubud+Bali', 'https://jaensspa.com/', 'https://www.instagram.com/jaensspa/', 'Popular ''affordable luxury'' Balinese spa with several Ubud outlets near the Monkey Forest, offering Balinese massage, facials, body care and full-day packages with free Ubud-area transport.', 'Couples and travellers wanting a polished but affordable spa day near the Monkey Forest.', 'Traditional Balinese massage; couples package; full-day spa journey', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'jaens-spa');

-- 20. cantika-zest
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'cantika-zest', 'Cantika Zest', 'spa', 'ubud', 'Penestanan', 'Jl. Raya Katik Lantang, Penestanan Kelod, Ubud', 'https://www.google.com/maps/search/?api=1&query=Cantika+Zest+Spa+Penestanan+Ubud+Bali', 'http://www.cantikazestbali.com/', 'https://www.instagram.com/cantikazestspa/', 'Streamside jungle spa at the edge of Penestanan village that makes and uses its own organic, garden-sourced skincare products across massage, facials, scrubs and outdoor flower baths, with a garden tour option.', 'Eco-minded travellers who want natural, organic products in a quiet Penestanan garden setting.', 'Balinese massage; organic body scrub; outdoor herb-and-flower bath', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'cantika-zest');

-- 21. ubud-traditional-spa
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, not_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'ubud-traditional-spa', 'Ubud Traditional Spa', 'spa', 'ubud', 'Payogan (west of Ubud)', 'Payogan village, near Pura Puncak temple, ~4 km west of Ubud centre', 'https://www.google.com/maps/search/?api=1&query=Ubud+Traditional+Spa+Payogan+Bali', 'https://ubudtraditionalspa.com/', 'Traditional Balinese massage spa in the village of Payogan next to the historic Pura Puncak temple, offering massage, body scrubs and flower baths with free transport to and from central Ubud.', 'Travellers wanting an authentic, quieter village spa experience with free central-Ubud pickup.', 'Those wanting to walk in from Ubud centre - it is a short drive out.', 'Traditional Balinese massage; body scrub and flower bath', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'ubud-traditional-spa');

-- 22. ubud-sari-health-resort
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'ubud-sari-health-resort', 'Ubud Sari Health Resort', 'spa', 'ubud', 'Central Ubud (near centre)', '~5 minutes from Ubud centre, Ubud', 'https://www.google.com/maps/search/?api=1&query=Ubud+Sari+Health+Resort+Ubud+Bali', 'https://ubudsari.com/', 'Long-standing health resort minutes from Ubud centre that pairs a day spa (Balinese, Lomi Hawaiian and four-hands massage) with wellness and detox programs and raw-food cuisine.', 'Wellness-focused travellers wanting spa treatments alongside detox, raw-food and longer revitalization programs.', 'Ubud Sari signature massage; Lomi Hawaiian-style massage; multi-day detox and revitalization programs', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'ubud-sari-health-resort');

-- 23. svaha-spa
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, instagram_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'svaha-spa', 'Svaha Spa', 'spa', 'ubud', 'Multiple Ubud outlets (flagship on Jl. Bisma)', 'Jl. Bisma, Ubud (plus Teges, Kenderan and other Ubud outlets)', 'https://www.google.com/maps/search/?api=1&query=Svaha+Spa+Bisma+Ubud+Bali', 'https://svahaspa.com/', 'https://www.instagram.com/svaha.spa/', 'Award-winning sustainable holistic spa group with several Ubud outlets (flagship on Jl. Bisma near the Monkey Forest), offering Balinese and signature massages, body-purification rituals and couples packages.', 'Travellers wanting a modern, polished spa with signature-ritual and couples options.', 'Svaha signature massage; traditional Balinese massage; couples ritual', '$$', '$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'svaha-spa');

-- 24. spring-spa-ubud
insert into public.venues (slug, name, category, district, area, address, gmaps_url, official_url, why_its_here, best_for, what_to_order, price_anchor, price_band, tier, is_sponsored, status, id)
select 'spring-spa-ubud', 'Spring Spa Ubud', 'spa', 'ubud', 'Ubud (rice-field setting)', 'Ubud, Bali (rice-terrace setting)', 'https://www.google.com/maps/search/?api=1&query=Spring+Spa+Ubud+Bali', 'https://www.springspa.com/locations/bali/ubud', 'Largest outlet of the Spring Spa brand, set among rice terraces, with treatment rooms overlooking the fields plus a dedicated wellness zone of contrast-therapy plunges, saunas and relaxation lounges.', 'Travellers wanting a contemporary spa combined with wellness facilities (sauna, contrast plunges) and rice-field views.', 'Massages and facials; contrast-therapy and sauna wellness circuit', '$$$', '$$$', 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'spring-spa-ubud');

commit;