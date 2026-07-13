-- Sanur wellness enrichment (0028) -- fills the 9 empty active Sanur spa/yoga/
-- beauty rows (the food/drink rows were done by 0026_enrich_thin_venues). Verified
-- web-research pass, first-party sources. Sanur is planning_only (sunrise coast) --
-- no money loop, no booking language, no sunset framing. GUARDRAILS: no reviews/
-- ratings (#1); best_for/not_for WHO/WHEN only (#7); prices as bands; existing
-- categories (#11). Fill-empties-only, idempotent.
--
-- Two two-facet resort/centre pairs kept as distinct rows (different services,
-- one address) -- Koa Shala spa+yoga, Sudamala spa+wellness -- consistent with the
-- Seminyak Prana spa/yoga split.

begin;
-- 1. glo-day-spa-salon-sanur-sanur
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'An Australian-owned, Western-style one-stop salon and day spa on Sanur''s main strip, part of the Glo group (Canggu, Seminyak, Echo Beach, Lembongan) known for hair, nails, bridal and massage under one roof.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers who want familiar Western salon standards in one visit — a haircut, mani-pedi, waxing or brow work alongside a relaxing massage; brides and bridal parties prepping for an event.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone after a traditional Balinese temple-style spa ritual rather than a modern salon experience.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.glospabali.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/glosalonandbeauty/')
where slug = 'glo-day-spa-salon-sanur-sanur' and district = 'sanur';

-- 2. koa-shala-spa-sanur
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The spa side of Koa Shala, a boutique garden wellness centre down a banana-palm-lined lane off Jl. Danau Tamblingan, offering Balinese and holistic massage in a quiet courtyard sanctuary.'),
    best_for = coalesce(nullif(best_for, ''), 'Visitors staying central in Sanur who want a calm, unhurried massage in a garden setting, often paired with a yoga class at the same address.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Chakra Dhara massage'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.koashala.com/spa'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/koashala/')
where slug = 'koa-shala-spa-sanur' and district = 'sanur';

-- 3. maya-sanur-spa-sanur
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The beachfront spa at Maya Sanur Resort & Spa, a garden sanctuary of six private double suites offering traditional massage, body scrubs and facials from certified therapists.'),
    best_for = coalesce(nullif(best_for, ''), 'Couples and travellers wanting a polished resort-spa treatment by the beach; guests looking to combine a massage with a facial in a serene, upscale setting.'),
    what_to_order = coalesce(nullif(what_to_order, ''), '90-minute Pure Indulgence (foot ritual, full-body massage, plus facial or foot massage)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://mayaresorts.com/sanur/spa')
where slug = 'maya-sanur-spa-sanur' and district = 'sanur';

-- 4. puri-santrian-spa-sanur
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The spa at Puri Santrian, a long-standing family-owned beach resort in south Sanur, with nine double treatment rooms offering Balinese massage, aromatherapy, reflexology and facials using Phytomer and Sothys products.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers staying in south Sanur who want a full menu of classic and modern treatments in a beachfront resort; those pairing a massage with the resort''s morning beach yoga.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.santrian.com/puri-santrian/spa/')
where slug = 'puri-santrian-spa-sanur' and district = 'sanur';

-- 5. sudajiva-spa-at-sudamala-sanur-sanur
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Sudajiva Spa ("Water of Life") is the 572 sqm spa at Sudamala Suites & Villas Sanur, blending traditional and modern healing techniques in an intimate boutique-resort setting.'),
    best_for = coalesce(nullif(best_for, ''), 'Guests and visitors wanting a signature resort spa ritual in a quiet, boutique atmosphere away from Sanur''s busier stretches.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Sudajiva Signature Massage (papaya oil, body scrub and homemade papaya lotion)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.sudamalaresorts.com/experience/sanur-wellness/')
where slug = 'sudajiva-spa-at-sudamala-sanur-sanur' and district = 'sanur';

-- 6. bali-barber-sanur-sanur
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Sanur branch of the Bali Barber brand (established 2012), a men''s barbershop on Jl. Danau Tamblingan for cuts, classic hot-towel shaves, beard work and dreadlocks, co-located with The Shampoo Lounge and skilled with all international hair types.'),
    best_for = coalesce(nullif(best_for, ''), 'Male travellers wanting a proper barber cut, shave or beard trim in a relaxed shop where you can grab a coffee, beer or cocktail while you wait.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Classic hot-towel shave'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.balibarber.com/sanur'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/balibarber/')
where slug = 'bali-barber-sanur-sanur' and district = 'sanur';

-- 7. koa-shala-sanur
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A boutique yoga shala and holistic wellness centre in a tropical garden off Jl. Danau Tamblingan, running three daily open-air yoga classes plus meditation in a peaceful courtyard sanctuary.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers based in central Sanur who want daily drop-in yoga in a calm garden, ideal for a morning practice before exploring the coast.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.koashala.com/yoga'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/koashala/')
where slug = 'koa-shala-sanur' and district = 'sanur';

-- 8. power-of-now-oasis-sanur
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'A Yoga Alliance-accredited yoga and retreat centre established in 2010 in a striking 100% bamboo beachfront shala on Sanur''s Mertasari beach, running daily classes, teacher trainings and holistic treatments, with an organic cafe on site.'),
    best_for = coalesce(nullif(best_for, ''), 'Yoga travellers in south Sanur who want daily beachfront classes in an eco bamboo studio, or a deeper 200-hour teacher training or retreat.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Daily drop-in yoga class in the bamboo beach shala'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$'),
    official_url = coalesce(nullif(official_url, ''), 'https://powerofnowoasis.com/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/powerofnowoasis_bali/')
where slug = 'power-of-now-oasis-sanur' and district = 'sanur';

-- 9. sudamala-resort-sanur-wellness-yoga-sanur
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The wellness and yoga programme at Sudamala Suites & Villas Sanur, centred on a garden Yoga Pavilion with instructor-led classes and evening meditation, plus longer holistic Balinese-tradition journeys (melukat purification, jamu and boreh workshops).'),
    best_for = coalesce(nullif(best_for, ''), 'Resort guests and wellness-minded visitors wanting gentle garden yoga, meditation, or a full-day holistic Balinese wellness journey in a boutique setting.'),
    what_to_order = coalesce(nullif(what_to_order, ''), '6-hour holistic wellness journey (yoga/meditation, melukat purification, boreh and jamu workshop, Balinese spa)'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.sudamalaresorts.com/experience/sanur-wellness/')
where slug = 'sudamala-resort-sanur-wellness-yoga-sanur' and district = 'sanur';

commit;