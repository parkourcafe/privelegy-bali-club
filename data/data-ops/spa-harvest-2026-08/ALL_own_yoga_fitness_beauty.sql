-- Other Bali — yoga/fitness/beauty price snapshots for OUR OWN already-published venues, 2026-08 Firecrawl harvest.
-- These venues already exist; only a price list is attached (no new venue records).
-- Apply with the founder, not from an agent session.

-- yoga/fitness/beauty price snapshots for our own venues, batch 0 (25 menus)
with target as (
  select slug from venues where slug = 'jet-black-ginger-canggu-canggu' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Jet Black Ginger Canggu prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.jetblackginger.com/pages/appointments', 'Official Jet Black Ginger Canggu price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '0e912bf7b9e78f41459bc5d7024165d2c2ccb02f32773d8cf5d92f9ff5b1ed41', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Hair Coloring (1 hour 30 minutes)', 'Transform your look with our expert color services.', 500000, 'IDR', 0), ('Prices', 'Haircut (1 hour)', 'Get a stylish haircut tailored to your preferences.', 300000, 'IDR', 1), ('Prices', 'Facial Treatment (1 hour)', 'Revitalize your skin with our soothing facial treatment.', 400000, 'IDR', 2), ('Prices', 'Manicure (45 minutes)', 'Pamper your hands with our manicure service.', 150000, 'IDR', 3), ('Prices', 'Pedicure (1 hour)', 'Indulge in a relaxing pedicure experience.', 200000, 'IDR', 4)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'the-shampoo-lounge-canggu' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'HairShop Canggu prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.hairshop.store/canggu', 'Official HairShop Canggu price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '8911099d2181403237dcda1886d81c1459630c806e588487f8f618fe6f1359c5', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'K-Tip Extensions (N/A)', 'Indonesian Hair Grade AAA', 2450000, 'IDR', 0), ('Prices', 'Premium Keratin Tip Extensions (N/A)', 'N/A', 3500000, 'IDR', 1), ('Prices', 'Tape-In Extensions (N/A)', 'Fast, flat & seamless', 4100000, 'IDR', 2), ('Prices', 'Weft Extensions (N/A)', 'Sewn-in, great for volume', 2600000, 'IDR', 3), ('Prices', 'Premium Weft Extensions (N/A)', 'N/A', 4000000, 'IDR', 4), ('Prices', 'Hair Coloring (N/A)', 'Hair coloring services including toner and highlights', 970000, 'IDR', 5), ('Prices', 'Haircut for Women (N/A)', 'All haircuts include wash, blow & styling.', 400000, 'IDR', 6), ('Prices', 'Keratin Treatment (N/A)', 'Chemical process that smooths and shines frizzy hair.', 2900000, 'IDR', 7), ('Prices', 'Olaplex Hair Treatment (N/A)', 'Treatment to nourish and hydrate your hair.', 1050000, 'IDR', 8)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'therapy-hair-spa-canggu-canggu' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Therapy Hair & Spa Canggu prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://therapy.co.id/', 'Official Therapy Hair & Spa Canggu price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '0133d45f5029eef637e0bfd9a4828f01eec7ec9c753716c191dc3d403c530372', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Mushroom Extract Niacinamide (Not specified)', 'A moisturizing night cream that balances and hydrates the skin with mushroom extract and niacinamide.', 731300, 'IDR', 0), ('Prices', 'Vitamin C + Niacinamide (Not specified)', 'A brightening day serum that combines vitamin C and niacinamide for a radiant complexion.', 597400, 'IDR', 1), ('Prices', 'Palmarosa + Cactus Extract (Not specified)', 'A gentle face wash infused with palmarosa and cactus extracts to cleanse and soothe the skin.', 535600, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'martha-tilaar-salon-day-spa-jimbaran' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Martha Tilaar Salon Day Spa Jimbaran prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://marthatilaarspa.com/spamenu', 'Official Martha Tilaar Salon Day Spa Jimbaran price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '6d3939f983f8728c65f7dc6dee5991f4ba42318fb8d756fe71aa0745dd446b72', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Body Treatment (60 minutes)', 'Full body treatment to rejuvenate and relax the skin.', 100000, 'IDR', 0), ('Prices', 'Face Treatment (60 minutes)', 'Facial services for improved skin health and appearance.', 150000, 'IDR', 1), ('Prices', 'Hair Treatment (30 minutes)', 'Deep conditioning and revitalizing hair treatment.', 80000, 'IDR', 2), ('Prices', 'Hand & Foot Treatment (45 minutes)', 'Pampering treatment for hands and feet.', 90000, 'IDR', 3), ('Prices', 'Make Up (90 minutes)', 'Professional make up services for various occasions.', 200000, 'IDR', 4), ('Prices', 'Pre Wedding Spa Package (3 hours)', 'Special spa package designed for pre-wedding relaxation.', 500000, 'IDR', 5), ('Prices', 'Signature Treatment (2 hours)', 'Unique blend of treatments designed for ultimate relaxation.', 300000, 'IDR', 6)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'bali-barber-sanur-sanur' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Bali Barber Sanur prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.balibarber.com/bookingwedding', 'Official Bali Barber Sanur price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'b282c69a32bbb669214d05bc1cc2e20b9ad7d5853b06d7db71b47fe0618833c4', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Groomsmen Barber Service (Up to 4 hours for 5 persons)', 'Exclusive Groomsmen Service providing a mobile barber setup at wedding venues.', 5330000, 'IDR', 0), ('Prices', 'Extra Person (N/A)', 'For additional persons requiring service beyond the initial package.', 728000, 'IDR', 1), ('Prices', 'Extra Barber & Chair (N/A)', 'Booking an additional barber and chair for faster service.', 1300000, 'IDR', 2), ('Prices', 'Travel Fee (N/A)', 'Fee for traveling to the venue, starting from a base price.', 1300000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'bodyworks-beauty-seminyak-seminyak' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Bodyworks Beauty Seminyak prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.bodyworksbali.com/treatments', 'Official Bodyworks Beauty Seminyak price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'e6ffb1bd28504e20fd7c34d6f3ee0acd9c3e74c1fe263eb5deb781d36ede9c3f', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Full Body Massage (Balinese) (70 mins + shower)', 'Enjoy 70 minutes of massage, using blends of essential oils from Indonesian spices and flowers. Our massage therapists incorporate a variety of techniques to relax every day muscular tensions, aches and pains. A planet away from the Bali beach massage – end with a warm shower.', 650000, 'IDR', 0), ('Prices', 'Exfoliation Massage (Mandi Lulur) (110 mins)', 'This treatment begins with a 65 minute Balinese massage, then the entire body is painted in a brown, granular paste (the traditional Javanese ‘lulur’) containing turmeric, sandalwood, cinnamon, and rice powder. The paste is then gently rubbed to exfoliate the skin. After a quick rinse, the body is covered in fresh yoghurt. The enzymes stimulate cell activity and restore the pH balance of the skin,', 800000, 'IDR', 1), ('Prices', 'Aromatherapy Massage (65 mins + bath)', 'During this treatment, the subtle aromas from the essential oils help strengthen the body’s healing potential and deepen relaxation. Choose from a variety carefully crafted premium quality blends to suit your personal needs (headache & migraine, PMS, cold & flu etc). This treatment includes an aromatherapy bath.', 690000, 'IDR', 2), ('Prices', 'Magnesium Massage (80 mins)', 'A deeply restorative massage using high quality magnesium oil specifically formulated to enhance tissue recovery, ease muscle aches and inflammation, and improve tendon flexibility. Magnesium is a mineral that supports healthy muscle function, and is a favourite among those with physically active lifestyles. In order to allow the oil to have maximum benefit, we do not recommend a shower immediatel', 690000, 'IDR', 3), ('Prices', 'Hot Stone Massage (70 mins + shower)', 'Hot stone therapy is a powerful massage technique that involves heated riverbed stones. The effects of this ancient form of healing have been proven to release tension in muscles, increase blood circulation, trigger relaxation response in the nervous system and restore fluidity to the connective tissue joints. You will find it a wonderful alternative to your normal massage schedule.', 690000, 'IDR', 4), ('Prices', 'Tension Release Massage (70 mins + shower)', 'This massage combines Japanese Shiatsu palm pressing and pressure points along the energy meridian lines followed by a firm and deeply releasing oil massage to soothe sore and tired muscles.', 680000, 'IDR', 5), ('Prices', 'Thai Massage (80 mins)', 'A Thai massage is more energizing and rigorous than other classic forms of massage. It is also known as the Thai Yoga massage, as the therapist will use her hands, knees, legs and feet to guide you into a series of yoga-like stretches.', 680000, 'IDR', 6), ('Prices', 'Shiatsu Massage (80 mins)', 'A traditional Japanese finger pressure massage using slow, deep penetration of key points along the acupuncture meridians. The dispersing of excess or blocked energy can promote circulation to deficient areas of the body, stimulate the immune system and restore balance.', 680000, 'IDR', 7), ('Prices', 'Bodyworks Bliss Massage (70 mins + shower)', 'The synchronized movement and skills of two therapists working on your body make this a truly unique massage experience.', 1150000, 'IDR', 8), ('Prices', 'Pregnancy Massage (70 mins + shower)', 'This is a very gentle massage using side-lying pregnancy massage techniques. For the first trimester, we suggest using our non-scented oil only. As for the second and third trimester, we have a pregnancy safe aromatherapy oil designed to calm and release muscle tension.', 650000, 'IDR', 9), ('Prices', 'Slimming Massage (110 mins)', 'This treatment begins with a 20-minute full body anti-cellulite scrub enriched with green tea, ginkgo biloba, Japanese seaweed and bamboo micro beads. The scrub is buffed off the body with warm towels and a detox body mask and serum is applied. The body is then fully covered in sarongs to infuse while receiving a 10-minute scalp massage. The mask contains high antioxidant green tea extract and whi', 980000, 'IDR', 10), ('Prices', 'Flower Bath (30 mins)', 'Upgrade your massage with some flower power - includes a hot pot of tea and handful of dates to enjoy while you soak in the tub.', 215000, 'IDR', 11), ('Prices', 'Foot Massage (60 mins)', 'For a more gentle alternative to reflexology, enjoy our relaxing foot massage.', 320000, 'IDR', 12)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'the-shampoo-lounge-seminyak-seminyak' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Shampoo Lounge Seminyak prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.shampoolounge.com/bookingseminyak', 'Official The Shampoo Lounge Seminyak price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'db0222a9166107bdc3ed5695a819714251a260b40663a3a8ed9107f9c91a4888', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Women''s Cut & Blow by Stylist (-)', 'Your Bali ready cut with a polished salon finish.', 400000, 'IDR', 0), ('Prices', 'Women''s Cut & Blow by Sr. Stylist (-)', 'Your Bali ready cut with a polished salon finish.', 600000, 'IDR', 1), ('Prices', 'Women''s Cut & Blow w/Hair Extensions (-)', 'Your Bali ready cut with a polished salon finish.', 550000, 'IDR', 2), ('Prices', 'Fringe Trim/Bang Cut (-)', 'Your Bali ready cut with a polished salon finish.', 150000, 'IDR', 3), ('Prices', 'Wash Blow Glow Extensions (-)', 'Your Bali ready cut with a polished salon finish.', 400000, 'IDR', 4), ('Prices', 'Updo (-)', 'Your Bali ready cut with a polished salon finish.', 400000, 'IDR', 5), ('Prices', 'Men''s Cut (-)', 'Your Bali ready cut with a polished salon finish.', 250000, 'IDR', 6), ('Prices', 'Girl''s Cut <10y/o (-)', 'Your Bali ready cut with a polished salon finish.', 200000, 'IDR', 7), ('Prices', 'Kids Updo <10y/o (-)', 'Your Bali ready cut with a polished salon finish.', 235000, 'IDR', 8), ('Prices', 'Wash Blow Glow (-)', 'Your Bali ready cut with a polished salon finish.', 220000, 'IDR', 9), ('Prices', 'Molecular Wash Blow (-)', 'Your Bali ready cut with a polished salon finish.', 350000, 'IDR', 10), ('Prices', 'Ayurvedic Combo (-)', 'Restore and nourish after sun & sea​', 550000, 'IDR', 11), ('Prices', 'Virgin Coconut Creambath (-)', 'Restore and nourish after sun & sea​', 450000, 'IDR', 12), ('Prices', 'Olive Oil Head & Scalp Treatment (-)', 'Restore and nourish after sun & sea​', 385000, 'IDR', 13), ('Prices', 'Luscious Lock Treatment by L''oréal (-)', 'Restore and nourish after sun & sea​', 385000, 'IDR', 14), ('Prices', 'Hair Filler Treatment (-)', 'Restore and nourish after sun & sea​', 715000, 'IDR', 15), ('Prices', 'Argan Deep Conditioning Treatment (-)', 'Restore and nourish after sun & sea​', 420000, 'IDR', 16), ('Prices', 'Olaplex (-)', 'Restore and nourish after sun & sea​', 950000, 'IDR', 17), ('Prices', 'Ice Mint Creambath (-)', 'Restore and nourish after sun & sea​', 495000, 'IDR', 18), ('Prices', 'Princess Hair Spa <10y/o (-)', 'Restore and nourish after sun & sea​', 330000, 'IDR', 19), ('Prices', 'Additional Hot Stone (-)', 'Restore and nourish after sun & sea​', 55000, 'IDR', 20), ('Prices', 'Ear Candle Treatment (-)', 'Restore and nourish after sun & sea​', 180000, 'IDR', 21), ('Prices', 'Hair Coloring (-)', 'Your colour, your way. Done right in Bali.​', 800000, 'IDR', 22), ('Prices', 'Full Body Laser Hair Removal (-)', 'Smooth skin that lasts.​', 4500000, 'IDR', 23), ('Prices', 'Full Face Laser Hair Removal (-)', 'Smooth skin that lasts.​', 1200000, 'IDR', 24), ('Prices', 'Upper Lip Laser Hair Removal (-)', 'Smooth skin that lasts.​', 245000, 'IDR', 25), ('Prices', 'Chin Laser Hair Removal (-)', 'Smooth skin that lasts.​', 245000, 'IDR', 26), ('Prices', 'Cheek Laser Hair Removal (-)', 'Smooth skin that lasts.​', 245000, 'IDR', 27), ('Prices', 'Neck Front/Back Laser Hair Removal (-)', 'Smooth skin that lasts.​', 383000, 'IDR', 28), ('Prices', 'Underarms Laser Hair Removal (-)', 'Smooth skin that lasts.​', 379000, 'IDR', 29), ('Prices', 'Tummy Laser Hair Removal (-)', 'Smooth skin that lasts.​', 497000, 'IDR', 30), ('Prices', 'Half Back Laser Hair Removal (-)', 'Smooth skin that lasts.​', 900000, 'IDR', 31), ('Prices', 'Half Arms Laser Hair Removal (-)', 'Smooth skin that lasts.​', 700000, 'IDR', 32), ('Prices', 'Full Back Laser Hair Removal (-)', 'Smooth skin that lasts.​', 1737000, 'IDR', 33), ('Prices', 'Full Arms Laser Hair Removal (-)', 'Smooth skin that lasts.​', 1200000, 'IDR', 34), ('Prices', 'Full Legs Laser Hair Removal (-)', 'Smooth skin that lasts.​', 1700000, 'IDR', 35), ('Prices', 'Half Legs Laser Hair Removal (-)', 'Smooth skin that lasts.​', 770000, 'IDR', 36), ('Prices', 'Buttocks Laser Hair Removal (-)', 'Smooth skin that lasts.​', 723000, 'IDR', 37), ('Prices', 'Inner Thighs Laser Hair Removal (-)', 'Smooth skin that lasts.​', 383000, 'IDR', 38), ('Prices', 'Lower Back Laser Hair Removal (-)', 'Smooth skin that lasts.​', 383000, 'IDR', 39), ('Prices', 'Shoulders Laser Hair Removal (-)', 'Smooth skin that lasts.​', 383000, 'IDR', 40), ('Prices', 'Feet & Toes Laser Hair Removal (-)', 'Smooth skin that lasts.​', 245000, 'IDR', 41), ('Prices', 'Hands & Fingers Laser Hair Removal (-)', 'Smooth skin that lasts.​', 245000, 'IDR', 42), ('Prices', 'Stomach Line Laser Hair Removal (-)', 'Smooth skin that lasts.​', 245000, 'IDR', 43), ('Prices', 'Nipple Laser Hair Removal (-)', 'Smooth skin that lasts.​', 245000, 'IDR', 44), ('Prices', 'Bikini Line Laser Hair Removal (-)', 'Smooth skin that lasts.​', 497000, 'IDR', 45), ('Prices', 'Brazilian Laser Hair Removal (-)', 'Smooth skin that lasts.​', 797000, 'IDR', 46), ('Prices', 'Eyebrow Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 120000, 'IDR', 47), ('Prices', 'Upper Lip Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 95000, 'IDR', 48), ('Prices', 'Chin Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 60000, 'IDR', 49), ('Prices', 'Nose Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 90000, 'IDR', 50), ('Prices', 'Cheek Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 100000, 'IDR', 51), ('Prices', 'Ear Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 75000, 'IDR', 52), ('Prices', 'Face Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 255000, 'IDR', 53), ('Prices', 'Half Leg Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 220000, 'IDR', 54), ('Prices', 'Full Leg Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 330000, 'IDR', 55), ('Prices', 'Half Arm Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 195000, 'IDR', 56), ('Prices', 'Full Arm Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 230000, 'IDR', 57), ('Prices', 'Under Arm Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 150000, 'IDR', 58), ('Prices', 'Back & Shoulder Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 220000, 'IDR', 59), ('Prices', 'Bikini Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 315000, 'IDR', 60), ('Prices', 'Brazilian Waxing (-)', 'Smooth, clean skin with professional waxing treatments designed for comfort and confidence.', 340000, 'IDR', 61), ('Prices', 'Acrylic Full Set w/Polish (-)', 'Perfectly polished nails for your Bali self-care moment.', 495000, 'IDR', 62), ('Prices', 'Acrylic Full Set w/Gel (-)', 'Perfectly polished nails for your Bali self-care moment.', 630000, 'IDR', 63), ('Prices', 'Acrylic French Full Set (-)', 'Perfectly polished nails for your Bali self-care moment.', 600000, 'IDR', 64), ('Prices', 'BIAB (-)', 'Perfectly polished nails for your Bali self-care moment.', 500000, 'IDR', 65), ('Prices', 'Gel Mani (-)', 'Perfectly polished nails for your Bali self-care moment.', 350000, 'IDR', 66), ('Prices', 'Russian Sport Mani (-)', 'Perfectly polished nails for your Bali self-care moment.', 275000, 'IDR', 67), ('Prices', 'Russian Gel Mani (-)', 'Perfectly polished nails for your Bali self-care moment.', 450000, 'IDR', 68), ('Prices', 'Sport Mani (-)', 'Perfectly polished nails for your Bali self-care moment.', 165000, 'IDR', 69), ('Prices', 'Classic Mani + Polish (-)', 'Perfectly polished nails for your Bali self-care moment.', 200000, 'IDR', 70), ('Prices', 'Spa Mani + Polish (-)', 'Perfectly polished nails for your Bali self-care moment.', 280000, 'IDR', 71), ('Prices', 'Spa Mani + Gel (-)', 'Perfectly polished nails for your Bali self-care moment.', 450000, 'IDR', 72), ('Prices', 'Kids Mani <10y/o (-)', 'Perfectly polished nails for your Bali self-care moment.', 120000, 'IDR', 73), ('Prices', 'Sport Pedi (-)', 'Perfectly polished nails for your Bali self-care moment.', 200000, 'IDR', 74), ('Prices', 'Classic Pedi + Polish (-)', 'Perfectly polished nails for your Bali self-care moment.', 230000, 'IDR', 75), ('Prices', 'Spa Pedi + Polish (-)', 'Perfectly polished nails for your Bali self-care moment.', 320000, 'IDR', 76), ('Prices', 'Spa Pedi + Gel (-)', 'Perfectly polished nails for your Bali self-care moment.', 500000, 'IDR', 77), ('Prices', 'Gel Pedi (-)', 'Perfectly polished nails for your Bali self-care moment.', 420000, 'IDR', 78), ('Prices', 'Hot Stone Pedi (-)', 'Perfectly polished nails for your Bali self-care moment.', 320000, 'IDR', 79), ('Prices', 'Kids Pedi <10y/o (-)', 'Perfectly polished nails for your Bali self-care moment.', 120000, 'IDR', 80), ('Prices', 'Simple Polish Only (Hands OR Feet) (-)', 'Perfectly polished nails for your Bali self-care moment.', 165000, 'IDR', 81), ('Prices', 'Gel Polish Only (Hands OR Feet) (-)', 'Perfectly polished nails for your Bali self-care moment.', 220000, 'IDR', 82), ('Prices', 'Add French (-)', 'Perfectly polished nails for your Bali self-care moment.', 70000, 'IDR', 83), ('Prices', 'Nail Art (-)', 'Perfectly polished nails for your Bali self-care moment.', 13000, 'IDR', 84), ('Prices', 'Infill (-)', 'Perfectly polished nails for your Bali self-care moment.', 370000, 'IDR', 85), ('Prices', 'Nail Repair (-)', 'Perfectly polished nails for your Bali self-care moment.', 80000, 'IDR', 86), ('Prices', 'Acrylic Soak Off (-)', 'Perfectly polished nails for your Bali self-care moment.', 135000, 'IDR', 87), ('Prices', 'Nail Trim with Clippers (-)', 'Perfectly polished nails for your Bali self-care moment.', 65000, 'IDR', 88), ('Prices', 'Xpress Nail Extensions / Gel X Nail Refill (-)', 'Perfectly polished nails for your Bali self-care moment.', 420000, 'IDR', 89), ('Prices', 'Rubber Gel Base (-)', 'Perfectly polished nails for your Bali self-care moment.', 55000, 'IDR', 90)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'think-pink-nails-seminyak' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Think Pink Nails Seminyak prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://thinkpinknails.com/sitemap.xml', 'Official Think Pink Nails Seminyak price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'e04bb8c0e03dd8eae8a2e0f9d673af45ea8fd25532eb667b246121f16eef253d', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Manicure (30 minutes)', 'Classic manicure to nourish and beautify your nails.', 200, 'IDR', 0), ('Prices', 'Pedicure (30 minutes)', 'Relaxing pedicure with soothing foot bath.', 250, 'IDR', 1), ('Prices', 'Gel Nails (60 minutes)', 'Long-lasting gel polish for a perfect finish.', 500, 'IDR', 2), ('Prices', 'Nail Art (60 minutes)', 'Creative designs to enhance your nail look.', 300, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'flex-gym-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Flex Gym Bali prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://flexgym.co.id/membership', 'Official Flex Gym Bali price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '91c9571e866fcc3de08c7e029f253e4d892fa7540ce3596358dca32f6145b252', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Daily Package - Daily (1 Day)', null, 150, 'IDR', 0), ('Prices', 'Daily Package - 7 Days', null, 450, 'IDR', 1), ('Prices', 'Daily Package - 14 Days', null, 650, 'IDR', 2), ('Prices', 'Monthly Package - 1 Month', null, 850, 'IDR', 3), ('Prices', 'Monthly Package - 3 Months', null, 2100, 'IDR', 4), ('Prices', 'Monthly Package - 6 Months', null, 3300, 'IDR', 5), ('Prices', 'Monthly Package - 12 Months', null, 4990, 'IDR', 6), ('Prices', 'Group Package - 6 Months', null, 2990, 'IDR', 7), ('Prices', 'Group Package - 12 Months', null, 4550, 'IDR', 8)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'body-factory-bali-canggu' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Body Factory Bali prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://bodyfactorybali.com/', 'Official Body Factory Bali price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'ad8921bde1441d843169904f5f0659c4c2215ef4ce599407325f57886d6e919b', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Gym Memberships (Monthly)', 'Full access to gym facilities and classes.', 100, 'IDR', 0), ('Prices', 'Personal Training (Session)', 'One-on-one training sessions with a dedicated coach.', 50, 'IDR', 1), ('Prices', 'Meal Plans (Monthly)', 'Nutrition plans designed to optimize your health and fitness goals.', 30, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'amplitude-skate-and-bike-park' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Amplitude Skatepark Bali prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://raceamplitude.com', 'Official Amplitude Skatepark Bali price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '95280e39e3aad9b89e939ea10ea678c07341059d4594a6a0aa47bf320c09a19c', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'General Admission (1 day)', 'Access to all bowls and ramps for a day of skating.', 100000, 'IDR', 0), ('Prices', 'Special Package (1 day)', 'Includes skate rental and protection gear for a full day.', 150000, 'IDR', 1), ('Prices', 'Skate Rental (1 day)', 'Daily rental of a skateboard and helmet.', 50000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'soma-fight-club-canggu' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'SOMA Fight Club prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://somafightclub.com/', 'Official SOMA Fight Club price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'e7981071dde48db6f4f4f2dbb89c80112326c71739c3b16cb97afae4b255e41b', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Daily Pass (1 Day)', 'Access to all classes and facilities for one day.', 375000, 'IDR', 0), ('Prices', '3-Day Pass (3 Days)', 'Access to all classes and facilities for three consecutive days.', 950000, 'IDR', 1), ('Prices', 'Weekly Membership (1 Week)', 'Access to all classes and facilities for one week.', 1600000, 'IDR', 2), ('Prices', '2 Weeks Membership', 'Access to all classes and facilities for two weeks.', 2400000, 'IDR', 3), ('Prices', 'Monthly Membership (1 Month)', 'Access to all classes and facilities for one month.', 3500000, 'IDR', 4), ('Prices', 'Quarterly Membership (3 Months)', 'Access to all classes and facilities for three months.', 8900000, 'IDR', 5), ('Prices', 'Yearly Membership (1 Year)', 'Access to all classes and facilities for one year.', 25000000, 'IDR', 6), ('Prices', 'Open Gym & Recovery (Daily Pass) (1 Day)', 'Access for open gym and recovery facilities for one day.', 250000, 'IDR', 7), ('Prices', 'Open Gym & Recovery (Monthly) (1 Month)', 'Access for open gym and recovery facilities for one month.', 2000000, 'IDR', 8), ('Prices', 'Glove Hire (1 Use)', 'Hire gloves for one use during class.', 50000, 'IDR', 9)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'intercontinental-bali-resort-fitness-centre' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'InterContinental Bali Resort Fitness Centre prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.ihg.com/intercontinental/hotels/us/en/bali/dpsha/hoteldetail', 'Official InterContinental Bali Resort Fitness Centre price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '6e01668a9681ed5f3bbfd17eccd73d9bcbc8e9b50bbe88fee127e68df83a52aa', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Personal Training Session (60 Minutes)', 'One-on-one personal training session tailored to your fitness goals.', 100, 'USD', 0), ('Prices', 'Yoga Class (60 Minutes)', 'Group yoga class focusing on relaxation and flexibility.', 30, 'USD', 1), ('Prices', 'Group Fitness Class (60 Minutes)', 'Join a group fitness class featuring various workout styles.', 20, 'USD', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'karma-jimbaran-fitness-jimbaran' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Karma Spa prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://storage.karmagroup.com/assets/karmagroup.com/2024/07/K_Spa-Menu_20240531.pdf', 'Official Karma Spa price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'b1a083ce4698ce999b7f2faebd864eeba76fe330a193c5c9638fdd0d5f170312', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Fire + Ice - Infrared Sauna and Ice Bath Immersion (60 minutes)', 'Optimize your mood and energy levels with contrast therapy featuring sessions in the Infrared Sauna and Ice Bath.', 650, 'IDR', 0), ('Prices', '3 Hours Couples Connect', 'Enjoy three hours of divine treatments with your choice of massage, salty body scrubs, holistic facials and manicures and pedicures.', 4500, 'IDR', 1), ('Prices', '4 Hours Ocean Spa Retreat', 'Four hours of divine treatments with your choice of massages, salty body scrubs, holistic facials, manicure or pedicures.', 5500, 'IDR', 2), ('Prices', 'Feel Liberated - Sauna + Ice Bath + Detox Scrub + Massage (120 minutes)', 'A warm sea salt scrub followed by a full body massage of your choice, complemented with an invigorating Infrared Sauna + Ice Bath.', 2900, 'IDR', 3), ('Prices', '2 Hours Island Siesta (120 minutes)', '60 minutes Balinese Massage + 30 minutes Karma Yoga Facial + 30 minute Feel Good Foot + Leg Massage', 1900, 'IDR', 4), ('Prices', 'Karma Rhythm Signature Massage (60 minutes)', 'Long and flowing massage movements with deep therapeutic bodywork delivered with Coconut and Candlenut oils.', 1150, 'IDR', 5), ('Prices', 'Sacred Balinese Massage (60 minutes)', 'Delivered with long, flowing movements and Balinese oils. Feel relaxed and restored.', 1150, 'IDR', 6), ('Prices', 'Thai (Yoga) Massage + Infrared Sauna (60 minutes)', 'Therapeutic massage with gentle stretching and acupressure, based on yoga and ayurveda.', 1150, 'IDR', 7), ('Prices', 'Karma Surrender (60 minutes)', 'Focused therapy for back, neck and shoulders delivered with wildflower oils.', 1150, 'IDR', 8), ('Prices', 'Karma Fit – Deep Tissue Recovery (30 minutes)', 'Post-workout treatment with pressure point and gentle stretching to activate circulation.', 950, 'IDR', 9), ('Prices', 'Cellulite Massage (60 minutes)', 'Full body massage delivered with a purifying blend of essential oils to break down toxins and fats.', 1150, 'IDR', 10), ('Prices', 'Manual Lymphatic Face and Body Treatment (75 minutes)', 'A feather-light skin massage to activate the lymphatic system.', 1250, 'IDR', 11), ('Prices', 'The Karma Signature (75 minutes)', 'A soothing neck and shoulder massage followed by deep cleansing and exfoliation.', 1150, 'IDR', 12), ('Prices', 'Karma Yoga Face Massage (45 minutes)', 'A meditative facial massage combining marma point therapy.', 750, 'IDR', 13), ('Prices', 'Ultimate Oxygen Facial (120 minutes)', 'High-performance facial that includes infusion of oxygen and hyaluronic acid.', 1500, 'IDR', 14), ('Prices', 'Balinese Temple Blessing Ceremony (3 hours)', 'Authentic Balinese priest blessing with flowers, holy water and prayer, includes massage, scrub, and facial.', 2500, 'IDR', 15), ('Prices', 'Pain Relief Acupuncture (30-60 minutes)', 'Treatment using gentle techniques to activate vital energy and stimulate sensations.', 1050, 'IDR', 16)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'mulia-fitness-centre-nusa-dua' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Mulia Fitness Centre prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.themulia.com/bali', 'Official Mulia Fitness Centre price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '74a6b945ce20735322c016ed8751f5889632e9bbc8e86c858bdce43c3b68d03e', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Personal Training (60 minutes)', 'One-on-one guided exercise sessions with a certified trainer.', 100, 'USD', 0), ('Prices', 'Yoga Class (60 minutes)', 'Group yoga sessions to enhance flexibility and relaxation.', 20, 'USD', 1), ('Prices', 'Swimming Pool Access (Full Day)', 'Unlimited access to the swimming pool facilities.', 15, 'USD', 2), ('Prices', 'Group Fitness Class (60 minutes)', 'Collective workout sessions with various exercise formats.', 25, 'USD', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'st-regis-bali-athletic-club' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'St. Regis Bali Athletic Club prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.marriott.com/en-us/hotels/dpsxr-the-st-regis-bali-resort/overview/', 'Official St. Regis Bali Athletic Club price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '232786199780b2a024b408f6c5115639efbd56648a809fa4a61e305836f87e9b', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Fitness Cardio Classes (1 hour)', 'Group classes focusing on cardio workouts.', 250000, 'IDR', 0), ('Prices', 'Yoga Classes (1 hour)', 'Mind and body yoga sessions aimed at relaxation.', 200000, 'IDR', 1), ('Prices', 'Personal Training (1 hour)', 'One-on-one training sessions customized to your fitness goals.', 500000, 'IDR', 2), ('Prices', 'Iridium Spa Treatment (2 hours)', 'Luxurious spa treatments including massages and facials.', 1000000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'prana-spa-yoga-fitness-adjacent-seminyak' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Prana Spa prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://pranaspaseminyakbali.com/prana-spa-packages.html', 'Official Prana Spa price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '24908461f80fd430feefccfcee6f0e8aaadb8d11ecbb6e721c9ea2f43dcf85e3', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'MYSTIQUE DREAM PACKAGE (120 minutes)', 'with Afternoon Tea Refreshment - based on two people', 2400000, 'IDR', 0), ('Prices', 'AYURVEDIC COMPLETE PACKAGE (120 minutes)', 'with Afternoon Tea Refreshment - based on two people', 2755000, 'IDR', 1), ('Prices', 'ROMANTIC COUPLE PACKAGE (120 minutes)', 'with Dinner or Lunch - based on two people', 2895000, 'IDR', 2), ('Prices', 'Deluxe Sun & Moon Sensation (180 minutes)', 'with Dining and Airport dropoff', 2833600, 'IDR', 3), ('Prices', 'Prana Spa Day Use Package (120 minutes)', 'with Dining and Airport dropoff', 4066975, 'IDR', 4), ('Prices', 'IMPIANA BLISS WELLNESS RETREAT (3 nights)', '3 Nights Stay with Daily Spa - based on two people', 1195, 'USD', 5)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'titi-batu-ubud-club-ubud' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Titi Batu Ubud Club prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://titibatu.com/', 'Official Titi Batu Ubud Club price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'a7616ebf546cd84c91ee7a28b6bad222c679a2afb4090f29a04c87447c74a546', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Day Pass (1 Day)', 'Access to facilities for a day.', 350000, 'IDR', 0), ('Prices', 'Monthly Membership (1 Month)', 'Monthly access to all facilities.', 1500000, 'IDR', 1), ('Prices', 'Personal Training Session (1 hour)', 'Private session with certified trainers.', 500000, 'IDR', 2), ('Prices', 'Yoga Class (1 Class)', 'Group yoga sessions open for all skill levels.', 100000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'the-asa-maia-fitness' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Asa Maia prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.theasamaia.com/resources/media/user/1774856811-Spa_Menu.pdf', 'Official The Asa Maia price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '8095c915dede2bdb500e194baf46813f2ff23335a86d1b79a9ecef34bc61fe69', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Signature Massage (1 Hour 30 Minutes)', 'Introducing you to The Asa Maia experience. The Signature treatment uses continuous long soothing strokes, and thumb and palm pressure to ease muscles and aids the circulatory systems. Decompress with our signature treatment and enter a state of well-deserved holiday bliss after your journey.', 1300000, 'IDR', 0), ('Prices', 'Deep Tissue (1 Hour)', 'Strong firm massage strokes focusing on the pressure points of your body, help to ease muscle aches and tension and relieve tiredness. It’s designed for active people who need to reset from busy lifestyle.', 1150000, 'IDR', 1), ('Prices', 'Deep Tissue (1 Hour 30 Minutes)', 'Strong firm massage strokes focusing on the pressure points of your body, help to ease muscle aches and tension and relieve tiredness. It’s designed for active people who need to reset from busy lifestyle.', 1200000, 'IDR', 2), ('Prices', 'Indonesian Massage (1 Hour)', 'Feel nurtured and nourished by this deeply relaxing and intuitive treatment derived from ancient local wisdom. This head-to-toe massage and stretching uses soft to medium pressure to improve energy levels, increase sound sleep and melt away muscle tension.', 900000, 'IDR', 3), ('Prices', 'Indonesian Massage (1 Hour 30 Minutes)', 'Feel nurtured and nourished by this deeply relaxing and intuitive treatment derived from ancient local wisdom. This head-to-toe massage and stretching uses soft to medium pressure to improve energy levels, increase sound sleep and melt away muscle tension.', 1100000, 'IDR', 4), ('Prices', 'Gua Sha Body Detox Treatment (1 Hour 30 Minutes)', 'A full body treatment using oils and specialized crystal tools to melt your tension and stimulate healing detoxification via the deep surface layers of the fascia.', 2000000, 'IDR', 5), ('Prices', 'Foot Reflexology (1 Hour)', 'Reflexology is an accent art that focuses on releasing blocked energy, or Qi, from the body to allow innate healing to unfold. Pressure applied to certain parts of the feet can reduce stress and pain in the body.', 850000, 'IDR', 6), ('Prices', 'Express Upper Body Massage (30 Minutes)', 'Short of time? Ease tension where you need it most with this fast acting de-stressing treatment. Focusing on the neck, shoulders and upper back.', 600000, 'IDR', 7), ('Prices', 'Express Lower Leg Massage (30 Minutes)', 'This revitalising treatment is for tired feet and heavy legs, helps reduce puffiness and soothes aches and pains, especially after a long journey.', 600000, 'IDR', 8), ('Prices', 'Express Gua Sha Detox Treatment (30 Minutes)', 'A targeted treatment using oils and specialized crystal tools to melt your tension and stimulate healing detoxification via the deep surface layers of the fascia and cellulites. A perfect add-on to elevate your massage treatment.', 600000, 'IDR', 9), ('Prices', 'Traditional Body Scrub (1 Hour)', 'A decadent, skin-softening exfoliation treatment leaving your skin nourished, smooth and supple.', 900000, 'IDR', 10), ('Prices', 'Traditional Body Mask (1 Hour)', 'Unwind with an indulgent full body mask treatment. This regenerating treatment in which the body is covered with organic clay, assist in releasing trapped toxins while deeply soothing the skin.', 900000, 'IDR', 11), ('Prices', 'Cool Down (30 Minutes)', 'If you''ve been out enjoying the Uluwatu sun and are in need of a soothing skin renewal treatment, Cool down is the one for you. Calm sun-kissed skin, with a banana leaf, organic aloe vera and cucumber wrap.', 950000, 'IDR', 12), ('Prices', 'Mandi Rempah (30 Minutes)', 'Immerse yourself in an aromatic bath of healing herbs and flowers, rose petals and frangipani. This Indonesian heritage bathing ritual soothes the skin and relaxes the mind.', 950000, 'IDR', 13), ('Prices', 'Natural Body Firming Treatment (1 Hour 15 Minutes)', 'A specialized treatment concentrating on the areas of the body prone to cellulite. Followed by a detoxifying seaweed body wrap using banana leaves combined with a relaxing head massage.', 1150000, 'IDR', 14), ('Prices', 'Natural Facial By Sensatia Botanicals® (1 Hour)', 'A special facial using Sensatia Botanical products, made from pure botanical ingredients, combines tendon massage techniques to stimulate the muscles of the face and rejuvenate the skin.', 1200000, 'IDR', 15), ('Prices', 'Pure Radiance By Nature (1 Hour)', 'This uses all-natural fresh ingredients, such as carrots, honey, cashew milk, rice powder and yogurt, that are known to help maximize blood flow.', 900000, 'IDR', 16), ('Prices', 'Celluma Light Therapy® (40 Minutes)', 'Celluma light therapy improves cellular health to reduce the signs of aging, reduce the appearance of fine lines and wrinkles, treat existing blemishes and minimize future breakout.', 500000, 'IDR', 17), ('Prices', 'Essential Manicure (1 Hour)', 'Take wellness to a new level by going beyond traditional manicures and pedicures. A fusion of traditional exfoliating and beautifying techniques, these treatments nourish your nails.', 650000, 'IDR', 18), ('Prices', 'Buff and Shine Only (45 Minutes)', 'A simple treatment that adds shine and smoothness to your nails without full manicure.', 400000, 'IDR', 19), ('Prices', 'Nail Polish by Cote® (30 Minutes)', 'A luxurious line that produces the cleanest, safest nail polish & nail care products available - all vegan, toxin free and cruelty free.', 300000, 'IDR', 20), ('Prices', 'Essential Pedicure (1 Hour)', 'A complete foot treatment to keep your feet looking their best and healthy through traditional beauty techniques.', 650000, 'IDR', 21), ('Prices', 'Nail Gel Remover Only (45 Minutes)', 'A simple treatment to remove gel nail polish without damage.', 250000, 'IDR', 22), ('Prices', 'Relaxation & Aromatherapy Scalp Massage (30 Minutes)', 'A specialized product will be selected to match your scalp''s needs in this immersive experience. Massaging the scalp reduces muscle tension, stimulates the nervous system and stimulates hair growth.', 350000, 'IDR', 23), ('Prices', 'Creambath (1 Hour)', 'A cream bath is a traditional scalp massage that uses fragrant hair cream, restoring moisture, softness, and brightness to your locks.', 800000, 'IDR', 24), ('Prices', 'Wash and Blow Dry (1 Hour)', 'Sink into pampering bliss with our luxury wash and blow dry treatment.', 500000, 'IDR', 25)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'the-practice-bali-canggu' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Practice Bali prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.thepracticebali.com/womens-yoga-and-wellness-retreat', 'Official The Practice Bali price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '5f7e160ff1e537e6f8fc411d8d08eca49db891f7830d9ec6f591b37c109ae44e', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Bungalows (6 nights)', 'Private king-sized bed, working desk, custom bath tub, waterfall shower, swim deck, relax net, strong wifi, ceiling fan and air conditioner.', 4000, 'USD', 0), ('Prices', 'King Suites (6 nights)', 'Private bedroom with king-sized bed, patio or balcony, waterfall shower, strong wi-fi, ceiling fan and air conditioner.', 3500, 'USD', 1), ('Prices', 'Shared Suites (6 nights)', 'Equipped with 2 single beds, patio or balcony, waterfall shower, strong wi-fi, ceiling fan and air conditioner.', 3000, 'USD', 2), ('Prices', 'Quad Room (6 nights)', 'Room with 4 single beds, privacy curtains, lockable drawers, personal outlets, and reading light.', 2500, 'USD', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'pranava-yoga' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Pranava Yoga prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.matrabali.com/pranava-yoga', 'Official Pranava Yoga price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '608ba3aafadc4fceffeac9c66ee644e83b9076acee477a542e8174639b015f4e', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Single Pass Foreigner (1 class)', 'A single yoga class pass for foreigners', 110, 'IDR', 0), ('Prices', 'Single Pass KITAS (1 class)', 'A single yoga class pass for KITAS holders', 100, 'IDR', 1), ('Prices', 'Single Pass Indonesian (1 class)', 'A single yoga class pass for Indonesian nationals', 88, 'IDR', 2), ('Prices', '5 Class Pass Foreigner (5 classes)', 'A 5 class pass for foreigners', 500, 'IDR', 3), ('Prices', '5 Class Pass KITAS (5 classes)', 'A 5 class pass for KITAS holders', 450, 'IDR', 4), ('Prices', '5 Class Pass Indonesian (5 classes)', 'A 5 class pass for Indonesian nationals', 400, 'IDR', 5), ('Prices', '12 Class Pass Foreigner (12 classes)', 'A 12 class pass for foreigners', 1100, 'IDR', 6), ('Prices', '12 Class Pass KITAS (12 classes)', 'A 12 class pass for KITAS holders', 990, 'IDR', 7), ('Prices', '12 Class Pass Indonesian (12 classes)', 'A 12 class pass for Indonesian nationals', 880, 'IDR', 8)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'guan-yin-yoga-canggu' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Guan Yin Yoga Shala prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://tuguhotels.com/hotels/bali/guan-yin-yoga-shala/', 'Official Guan Yin Yoga Shala price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'eb34a76dda2d261d4fec675367e375e9e6db420635e6029b0032006afb306dd4', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Single Class (1 session)', 'Walk in price', 150000, 'IDR', 0), ('Prices', '10 Days Pass Program', 'Access to classes for 10 days', 1350000, 'IDR', 1), ('Prices', 'Private Class (1 session)', 'Personalized yoga session', 750000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'jimbaran-hub-yoga-jimbaran' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Jimbaran Hub Yoga prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://jimbaranhub.com/', 'Official Jimbaran Hub Yoga price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'd393d15e974fcb8815f7046084483bb7e3b449f7ce82b5b8cdd327b62794faf0', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Yoga Class (1 hour)', 'Find peace and flexibility with our guided yoga sessions.', 150000, 'IDR', 0), ('Prices', 'Ballet Class (1 hour)', 'Engage in creative movement and ballet techniques in a supportive environment.', 200000, 'IDR', 1), ('Prices', 'Karate Class (1 hour)', 'Develop discipline and fitness through our karate training sessions.', 250000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'sunset-pilates-legian' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Sunset Pilates Legian prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://sunsetpilatesbali.com/legian-studio/', 'Official Sunset Pilates Legian price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '895496bddb8ed9b6b620c7016ca4104aea0e2771b9a08fbd8362cac496ec075a', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Total Body (1 hour)', 'Moving with the flow concentrating on the dynamic of the movement pattern while paying attention to the rhythm of your breathing pattern. Preferable for those who are already familiar with classical movements.', 330000, 'IDR', 0), ('Prices', 'Prenatal & Postnatal Class (1 hour)', 'Pilates is an ideal form of exercise during pregnancy as it works your core muscles and pelvic floor enabling a fast post-natal recovery. Pregnancy classes are an hour long and hold up to 4 women so the instructors can provide safe personal care and attention.', 800000, 'IDR', 1), ('Prices', 'Sculpt Class (1 hour)', 'Stretch Strength and more stretch to work and body alignment, balance, feeling your body, lengthen and strongly recommended for those with muscle tightness and areas that need toning.', 330000, 'IDR', 2), ('Prices', 'Classical Repertoire (1 hour)', 'Original Contrology movement emphasises fundamental exercises, alignment posture correction, and correct breathing patterns.', 330000, 'IDR', 3), ('Prices', 'Circuit Class (1 hour)', 'A circuit class is a program designed to have a full-body workout in a fun way boosting your cardio, strength and flexibility.', 330000, 'IDR', 4), ('Prices', 'Private Class (1 hour)', 'A personalized hour-long session designed to concentrate on each individual’s needs.', 800000, 'IDR', 5), ('Prices', 'Couples Class (1 hour)', 'Similar to a private session, couples classes are designed for those wanting to have individualised attention and share it with a partner or friend.', 950000, 'IDR', 6), ('Prices', 'Group Class (1 hour)', 'Get the most out of your workout in a fun and exciting group setting.', 330000, 'IDR', 7), ('Prices', 'Rehabilitation Class (1 hour)', 'Live your best life with our private Pilates rehabilitation programmes designed to meet your specific goals.', 800000, 'IDR', 8)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'yoga-108-bali-kuta-legian' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Yoga 108 Bali prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://yoga108bali.com/', 'Official Yoga 108 Bali price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'ae4456ab362f91e54fd4e9759595df0c93a53a7d1e77aec006aadc10b393ff6b', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Walk-in Yoga Class (75 minutes)', 'A single drop-in yoga class.', 150000, 'IDR', 0), ('Prices', '10 Class Pass (75 minutes per class)', 'Pass for ten yoga classes.', 1200000, 'IDR', 1), ('Prices', '10 Class Pass (KITAS & Locals) (75 minutes per class)', 'Pass for ten yoga classes with discount for KITAS and locals.', 1100000, 'IDR', 2), ('Prices', '5 Class Pass (75 minutes per class)', 'Pass for five yoga classes.', 700000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

update menus set status = 'source_snapshot', source_snapshot_published_at = '2026-08-25T08:03:37+00:00'::timestamptz
where status = 'draft'
  and completeness = 'partial'
  and verified_at is null
  and content_digest is not null
  and expires_at > now()
  and created_at >= '2026-08-25T08:03:37+00:00'::timestamptz
  and exists (select 1 from menu_sections s join menu_items it
              on it.section_id = s.id and it.menu_id = s.menu_id
              where s.menu_id = menus.id);

-- yoga/fitness/beauty price snapshots for our own venues, batch 1 (11 menus)
with target as (
  select slug from venues where slug = 'puri-santrian-yoga-wellness' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Puri Santrian Yoga / Wellness prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.santrian.com/puri-santrian/', 'Official Puri Santrian Yoga / Wellness price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '40a5d9f375de235c51782653c5da637efd1de061ff1f02fe9516f74961175268', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'SANTRIAN CHILL GETAWAY (2 Nights)', 'Room includes breakfast for 2 people, free wi-fi, local beer, pizza, late check out, and discount on food & beverages.', 5000000, 'IDR', 0), ('Prices', 'Harmonious Indulgence (3 Nights / 4 Days)', 'A unique and holistic wellness journey.', 9900000, 'IDR', 1), ('Prices', 'Get Away & Reconnect (4 Days 3 Nights)', 'Inclusions include free upgrade to a higher room category and a wellness treatment.', 8250000, 'IDR', 2), ('Prices', 'Irresistibly Bali (4 Days 3 Nights)', 'Includes Balinese massage, Indonesian set lunch, and daily wellness activities.', 8550000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'power-of-now-oasis-sanur' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Power of Now Oasis prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://powerofnowoasis.com/', 'Official Power of Now Oasis price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'd127af1c88aea7bd92fd752f439bf78538730402d73c884335f292ac59bbda2c', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Yoga Classes (1 Class)', 'Daily classes suitable for all levels including Hatha, Yin, Vinyasa, Iyengar.', 140000, 'IDR', 0), ('Prices', '5 Class Card (N/A)', '5 classes at a discounted rate.', 650000, 'IDR', 1), ('Prices', '10 Class Card (N/A)', '10 classes at a discounted rate.', 1200000, 'IDR', 2), ('Prices', 'Monthly Unlimited Class Pass (N/A)', 'Unlimited classes in a month.', 2000000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'alila-seminyak-yoga' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Alila Seminyak Yoga prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.hyatt.com/alila-hotels-and-resorts/en-US/dpsas-alila-seminyak', 'Official Alila Seminyak Yoga price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '80a02c5ffc3f4fc67c65fb675e7a5ca2664a4a505af8fffdcadd16d4b74f54f1', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Harmony Through Movement and Mindfulness (4 hours)', 'Set out on a soulful journey of renewal, where your body and mind are recalibrated through Tai Chi, numerology and restorative massage.', 2200000, 'IDR', 0), ('Prices', 'Feeding A Sense of Community (4 hours)', 'Step into the heart of community by preparing meals at the RAGAM Community Kitchen, then personally delivering them to local families in need.', 2200000, 'IDR', 1), ('Prices', 'Seasalt Journey—The Salt & Tradition Trail (8 hours)', 'Travel from Alila Seminyak to the volcanic beaches of Kusamba and the ancestral looms of Tenganan to witness two sacred Balinese traditions—salt farming and double ikat weaving—before dining seaside at Seasalt, our sister resort’s restaurant.', 3500000, 'IDR', 2), ('Prices', 'Spirit of Serenity—A Sacred Temple Ritual (3-4 hours)', 'Step into the quiet rituals of Balinese temple life through offering-making, a Melukat water blessing and a meaningful Tridatu bracelet ceremony.', 950000, 'IDR', 3), ('Prices', 'Jeweler, Artisan, Storyteller—The John Hardy Workshop (6 hours)', 'Become an artisan for the day at the legendary John Hardy Workshop, where you’ll design silver jewelry in wax and share stories over a communal feast.', 3300000, 'IDR', 4)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'prana-yoga-seminyak' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Prana Yoga prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://pranaspaseminyakbali.com/prana-spa-packages.html', 'Official Prana Yoga price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'd63fc60b3ad384e3a9dae7e8339b0549c61975afc79b4de884aa12d08cfc5705', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'MYSTIQUE DREAM PACKAGE with Afternoon Tea Refreshment (120 minutes)', 'Spa treatment for two including body scrub, massage, and afternoon tea.', 2400000, 'IDR', 0), ('Prices', 'AYURVEDIC COMPLETE PACKAGE with Afternoon Tea Refreshment (120 minutes)', 'Includes Steam, Body Massage, Shirodara treatment, and afternoon tea.', 2755000, 'IDR', 1), ('Prices', 'ROMANTIC COUPLE PACKAGE with Dinner or Lunch (120 minutes)', 'Spa treatment and a set menu dinner or lunch.', 2895000, 'IDR', 2), ('Prices', 'Deluxe Sun & Moon Sensation with Dining and Airport dropoff (180 minutes)', 'Full spa package with healthy set menu and airport drop off.', 2833600, 'IDR', 3), ('Prices', 'Prana Spa Day Use Package with Dining and Airport dropoff (120 minutes)', 'Full day use package with spa treatments and dining.', 4066975, 'IDR', 4), ('Prices', 'IMPIANA BLISS WELLNESS RETREAT 3 Nights Stay with Daily Spa (N/A)', 'Includes daily breakfast, spa treatment, and aqua yoga class.', 1195, 'USD', 5)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'intuitive-flow' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Intuitive Flow prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://intuitiveflow.com/', 'Official Intuitive Flow price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'f9e12ad0ff340cae814fca7df93f201d9f94a4511a7ed406b4c93772a1decb01', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Drop-In Class (1 class)', 'Regular yoga class where participants can drop in without prior commitment.', 150000, 'IDR', 0), ('Prices', 'Gentle Yoga (1 class)', 'A supportive and soft way to get accustomed to asanas, ideal for beginners.', 150000, 'IDR', 1), ('Prices', 'Balinese Discount (1 class)', 'Discounted rate for locals or Indonesian residents for the Drop-In Class.', 65000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'the-yoga-barn' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Yoga Barn prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://theyogabarn.com/classes/private-yoga-classes', 'Official The Yoga Barn price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '931f57b75afc9d6273f0b7cc367ca7193e49a1b5cf6e3e718f747fceb86b6812', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Private Class (60 mins / 90 mins)', 'Personalized yoga class tailored to individual needs and goals. Includes Yoga, Meditation, Mobility, Breathwork, Kundalini, Prenatal Yoga and more.', 1000000, 'IDR', 0), ('Prices', 'Group Class (60 mins / 90 mins)', 'Group private classes for 10-15 people. Casual and group-oriented practice.', 3000000, 'IDR', 1), ('Prices', 'Additional Student (60 mins / 90 mins)', 'Cost per additional student in a group class.', 200000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'ubud-yoga-house' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Ubud Yoga House prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://ubudyogahouse.com/', 'Official Ubud Yoga House price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'd37c05a8cd36c86c2f188718cffb8bf481e29dca9a2fe23296c886a12676d41f', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', '200 Hour Yoga Teacher Training (November 8-28, 2026)', 'Join us for an immersive practice, learning and transformation', 30600000, 'IDR', 0), ('Prices', 'Private Room - 200 Hour Yoga Teacher Training (20 Nights)', 'Includes 20 Nights Accommodation, Breakfast @Pukako, Course Fee, Training Manual, Yoga Alliance Certificate', 42500000, 'IDR', 1), ('Prices', 'Single Drop-in Class (1 Class)', 'Drop in class for daily sessions', 185000, 'IDR', 2), ('Prices', '3 Class Card (3 Classes)', '3 classes valid for 30 days', 495000, 'IDR', 3), ('Prices', '5 Class Card (5 Classes)', '5 classes valid for 30 days', 775000, 'IDR', 4), ('Prices', '10 Class Card (10 Classes)', '10 classes valid for 30 days', 1450000, 'IDR', 5), ('Prices', '20 Class Card (20 Classes)', '20 classes valid for 60 days', 2000000, 'IDR', 6), ('Prices', '30 Day Unlimited Class (30 Days)', 'Unlimited classes for 30 days', 2500000, 'IDR', 7), ('Prices', 'Private Class - 60 Minutes', 'Private class for 1 or 2 students', 950000, 'IDR', 8), ('Prices', 'Private Class - 90 Minutes', 'Private class for 1 or 2 students', 1150000, 'IDR', 9)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'ulu-yoga-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'ULU Yoga Bali prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://uluyoga.com/yoga-teacher-training-bali', 'Official ULU Yoga Bali price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '7fca2bbd9ef4cabc8dc28790748736641737771ff93dcc0cac49ef7b1f2c11de', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', '200‑Hour Multi‑Style YTT (Starting every month)', 'RYT-200 Certificate', 1600, 'USD', 0), ('Prices', '300‑Hour Multi‑Style YTT (Starting every month)', 'RYT-300 Certificate', 1600, 'USD', 1), ('Prices', '500‑Hour Multi‑Style YTT', 'RYT-500 Certificate', 4000, 'USD', 2), ('Prices', '50‑Hour Aerial YTT', 'YACEP Certificate', 700, 'USD', 3), ('Prices', '50‑Hour Yin YTT', 'YACEP Certificate', 700, 'USD', 4), ('Prices', '50-Hr Ashtanga Yoga Training', 'YACEP Certificate', 700, 'USD', 5), ('Prices', '200 Hour Online Multi Style YTT', 'RYT-200 Certificate', 600, 'USD', 6), ('Prices', '300 Hour Online YTT', 'RYT-300 Certificate', 600, 'USD', 7), ('Prices', '500 Hour Online YTT', 'RYT-500 Certificate', 900, 'USD', 8), ('Prices', '50 Hour Online Aerial YTT', 'YACEP Certificate', 399, 'USD', 9), ('Prices', '50 Hour Online Yin Yoga Training Course', 'YACEP Certificate', 99, 'USD', 10)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'yoga-searcher-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Yoga Searcher Bali prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://yogasearcher-bali.com/', 'Official Yoga Searcher Bali price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, 'cbca9e35abcf70ff1e67cc37d422ccc0f2d6cb9f8862b7e8aafd4aceda565bbb', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Yoga Class (Single Class)', 'Class suitable for all levels led by experienced instructors.', 150000, 'IDR', 0), ('Prices', 'Yoga Class Pack (5 Classes)', 'Pack of 5 yoga classes.', 650000, 'IDR', 1), ('Prices', 'Yoga Class Pack (10 Classes)', 'Pack of 10 yoga classes.', 1200000, 'IDR', 2), ('Prices', 'Open Shala (Hourly)', 'Access to Yoga Shala per hour.', 75000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'the-asa-maia-pilates' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Asa Maia Pilates prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://www.theasamaia.com/resources/media/user/1774856811-Spa_Menu.pdf', 'Official The Asa Maia Pilates price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '4a981e0536aacc25400e9723d993c10fad12b3b9d721723976ead7d446e86f47', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Signature Massage (1 Hour 30 Minutes)', 'Introducing you to The Asa Maia experience. The Signature treatment uses continuous long soothing strokes, and thumb and palm pressure to ease muscles and aids the circulatory systems. Decompress with our signature treatment and enter a state of well-deserved holiday bliss after your journey.', 1300000, 'IDR', 0), ('Prices', 'Deep Tissue (1 Hour)', 'Strong firm massage strokes focusing on the pressure points of your body, help to ease muscle aches and tension and relieve tiredness. It’s designed for active people who need to reset from busy lifestyle.', 1150000, 'IDR', 1), ('Prices', 'Deep Tissue (1 Hour 30 Minutes)', 'Strong firm massage strokes focusing on the pressure points of your body, help to ease muscle aches and tension and relieve tiredness. It’s designed for active people who need to reset from busy lifestyle.', 1200000, 'IDR', 2), ('Prices', 'Indonesian Massage (1 Hour)', 'Feel nurtured and nourished by this deeply relaxing and intuitive treatment derived from ancient local wisdom. This head-to-toe massage and stretching uses soft to medium pressure to improve energy levels, increase sound sleep and melt away muscle tension.', 900000, 'IDR', 3), ('Prices', 'Indonesian Massage (1 Hour 30 Minutes)', 'Feel nurtured and nourished by this deeply relaxing and intuitive treatment derived from ancient local wisdom. This head-to-toe massage and stretching uses soft to medium pressure to improve energy levels, increase sound sleep and melt away muscle tension.', 1100000, 'IDR', 4), ('Prices', 'Gua Sha Body Detox Treatment (1 Hour 30 Minutes)', 'A full body treatment using oils and specialized crystal tools to melt your tension and stimulate healing detoxification via the deep surface layers of the fascia. Full body gua sha can help increase circulation, hydrate fascia, drain lymph, loosen muscle knots, release tightness and will likely help your body feel more nourished and energized in general.', 2000000, 'IDR', 5), ('Prices', 'Foot Reflexology (1 Hour)', 'Reflexology is an accent art that focuses on releasing blocked energy, or Qi, from the body to allow innate healing to unfold. Pressure applied to certain parts of the feet can reduce stress and pain in the body.', 850000, 'IDR', 6), ('Prices', 'Express Upper Body Massage (30 Minutes)', 'Short of time? Ease tension where you need it most with this fast acting de-stressing treatment. Focusing on the neck, shoulders and upper back.', 600000, 'IDR', 7), ('Prices', 'Express Lower Leg Massage (30 Minutes)', 'This revitalising treatment is for tired feet and heavy legs, helps reduce puffiness and soothes aches and pains, especially after a long journey.', 600000, 'IDR', 8), ('Prices', 'Traditional Body Scrub (1 Hour)', 'A decadent, skin-softening exfoliation treatment leaving your skin nourished, smooth and supple. Dead skin cells are gently buffed away before the organic scrub is applied.', 900000, 'IDR', 9), ('Prices', 'Traditional Body Mask (1 Hour)', 'Unwind with an indulgent full body mask treatment. This regenerating treatment in which the body is covered with organic clay, assist in releasing trapped toxins while deeply soothing the skin.', 900000, 'IDR', 10), ('Prices', 'Cool Down (30 Minutes)', 'Calm sun-kissed skin, with a banana leaf, organic aloe vera and cucumber wrap. Drift away during a gentle head massage, followed by an application of aloe vera gel.', 950000, 'IDR', 11), ('Prices', 'Mandi Rempah (30 Minutes)', 'Immerse yourself in an aromatic bath of healing herbs and flowers, rose petals and frangipani. This Indonesian heritage bathing ritual soothes the skin, relaxes the mind and tenses muscles.', 950000, 'IDR', 12), ('Prices', 'Natural Body Firming Treatment (1 Hour 15 Minutes)', 'A specialized treatment concentrating on the areas of the body prone to cellulite. An exfoliation with a special blend of sea salt and oil, followed by a detoxifying seaweed body wrap.', 1150000, 'IDR', 13), ('Prices', 'Natural Facial By Sensatia Botanicals (1 Hour)', 'A special facial using Sensatia Botanical products, made from pure botanical ingredients, combines tendon massage techniques to stimulate the muscles of the face and rejuvenate the skin.', 1200000, 'IDR', 14), ('Prices', 'Pure Radiance By Nature (1 Hour)', 'This uses all-natural fresh ingredients, combines the healing energise of jade or rose quartz crystal guashas and face rollers. Finishing with the cooling, soothing properties of rosewater.', 900000, 'IDR', 15), ('Prices', 'Celluma Light Therapy (40 Minutes)', 'Celluma light therapy improves cellular health to reduce the signs of aging, reduce the appearance of fine lines and wrinkles, treat existing blemishes and minimize future breakout.', 500000, 'IDR', 16), ('Prices', 'Essential Manicure (1 Hour)', 'A fusion of traditional exfoliating and beautifying techniques, these treatments nourish your nails.', 650000, 'IDR', 17), ('Prices', 'Buff and Shine Only (45 Minutes)', 'A simple service to make your nails shine without polish.', 400000, 'IDR', 18), ('Prices', 'Essential Pedicure (1 Hour)', 'A fusion of traditional exfoliating and beautifying techniques, these treatments nourish your nails and feet.', 650000, 'IDR', 19), ('Prices', 'Nail Gel Remover Only (45 Minutes)', 'A service to remove gel nail polish only.', 250000, 'IDR', 20), ('Prices', 'Relaxation & Aromatherapy Scalp Massage (30 Minutes)', 'A specialized product will be selected to match your scalps needs in this immersive and transportive experience, reducing muscle tension and stimulating hair growth.', 350000, 'IDR', 21), ('Prices', 'Creambath (1 Hour)', 'A traditional scalp massage using fragrant hair cream, which restores moisture, softness and brightness to your locks.', 800000, 'IDR', 22), ('Prices', 'Wash and Blow Dry (1 Hour)', 'A luxury wash and blow dry treatment for fabulous looking hair whenever you need it.', 500000, 'IDR', 23)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'the-istana-yoga' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Istana Yoga prices',
         coalesce((select max(mx.version) from menus mx where mx.venue_slug = t.slug), 0) + 1,
         'draft', 'partial', 'https://theistana.com/price-list', 'Official The Istana Yoga price page',
         '2026-08-25T08:03:37+00:00'::timestamptz, null, '2026-11-23T08:03:37+00:00'::timestamptz, '9ad6234a8df254bef76b79eea7dbe4e65cf2ce8a304d69d03423c980781cfea3', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug
                    and x.status in ('source_snapshot', 'published'))
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Prices', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Prices', 'Spa Session (Variable)', 'Single sessions', 150000, 'IDR', 0), ('Prices', 'Cryotherapy Session (Variable)', 'Sessions', 1000000, 'IDR', 1), ('Prices', 'Soft Chamber - 60min (60 minutes)', 'Hyperbaric oxygen therapy session', 1000000, 'IDR', 2), ('Prices', 'Soft Chamber - 90min (90 minutes)', 'Hyperbaric oxygen therapy session', 1200000, 'IDR', 3), ('Prices', 'Soft Chamber - 120min (120 minutes)', 'Hyperbaric oxygen therapy session', 1500000, 'IDR', 4), ('Prices', 'Hard Chamber - 60min (60 minutes)', 'Hyperbaric oxygen therapy session', 1200000, 'IDR', 5), ('Prices', 'Hard Chamber - 90min (90 minutes)', 'Hyperbaric oxygen therapy session', 1500000, 'IDR', 6), ('Prices', 'Hard Chamber - 120min (120 minutes)', 'Hyperbaric oxygen therapy session', 1800000, 'IDR', 7), ('Prices', 'Sensory Deprivation Tank - 30min (30 minutes)', 'Session in sensory deprivation tank', 500000, 'IDR', 8), ('Prices', 'Sensory Deprivation Tank - 60min (60 minutes)', 'Session in sensory deprivation tank', 800000, 'IDR', 9), ('Prices', 'Sensory Deprivation Tank - 90min (90 minutes)', 'Session in sensory deprivation tank', 1000000, 'IDR', 10), ('Prices', 'Sensory Deprivation Tank - 120min (120 minutes)', 'Session in sensory deprivation tank', 1200000, 'IDR', 11), ('Prices', 'Luxury Ocean View Suite (1 night)', 'Accommodation per night', 5500000, 'IDR', 12), ('Prices', 'Luxury Garden View Suite (1 night)', 'Accommodation per night', 5000000, 'IDR', 13), ('Prices', 'Double Room (1 night)', 'Accommodation per night', 3500000, 'IDR', 14), ('Prices', 'King Size Dorm Bed (1 night)', 'Spa Detox Dorm Package per night', 1750000, 'IDR', 15), ('Prices', 'Queen Size Dorm Bed (1 night)', 'Spa Detox Dorm Package per night', 1400000, 'IDR', 16)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

update menus set status = 'source_snapshot', source_snapshot_published_at = '2026-08-25T08:03:37+00:00'::timestamptz
where status = 'draft'
  and completeness = 'partial'
  and verified_at is null
  and content_digest is not null
  and expires_at > now()
  and created_at >= '2026-08-25T08:03:37+00:00'::timestamptz
  and exists (select 1 from menu_sections s join menu_items it
              on it.section_id = s.id and it.menu_id = s.menu_id
              where s.menu_id = menus.id);

