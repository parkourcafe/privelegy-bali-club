-- spa menu snapshots, batch 4 (8 menus)
with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'santrian.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Griya Santrian Beach Resort & Spa treatment prices', 1, 'draft', 'partial', 'https://santrian.com/griya-santrian/spa/treatment-at-ayodhya-bale.html', 'Official Griya Santrian Beach Resort & Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '7e627c0ecd457adc26263573ebd50f506c393556873a3fcc99f2ff8f23cc29b3', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Reflexology', 0), ('Manicure', 1), ('Pedicure', 2), ('Other', 3), ('Nails', 4)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Reflexology', 'Reflexology (60 min)', 'An ancient healing method based on the principle that all body organs are connected to reflex points on the feet, clearing energy flow and creating body balance. Great for curing fluid retention and digestive issues.', 442750, 'IDR', 0), ('Manicure', 'Sita’s Manicure - With OPI Nail Polish (75 min)', 'Nail shaping, cuticle care, relaxing hand massage.', 442750, 'IDR', 0), ('Manicure', 'Sita’s Manicure - With Creative Play® Nail Polish (75 min)', 'Nail shaping, cuticle care, relaxing hand massage.', 442750, 'IDR', 1), ('Manicure', 'Sita’s Manicure - With SHELLAC® Nail Polish (90 min)', 'Nail shaping, cuticle care, relaxing hand massage.', 569250, 'IDR', 2), ('Manicure', 'Manicure Express - With OPI Nail Polish (45 min)', null, 278300, 'IDR', 3), ('Manicure', 'Manicure Express - With Creative Play® Nail Polish (45 min)', null, 278300, 'IDR', 4), ('Manicure', 'Manicure Express - With SHELLAC® Nail Polish (60 min)', null, 442740, 'IDR', 5), ('Manicure', 'French Manicure or Pedicure (30 min)', null, 189750, 'IDR', 6), ('Pedicure', 'Sita’s Pedicure - With OPI Nail Polish (75 min)', 'Buffing, nail shaping, cuticle care, exfoliation, relaxing foot massage.', 506000, 'IDR', 0), ('Pedicure', 'Sita’s Pedicure - With Creative Play® Nail Polish (75 min)', 'Buffing, nail shaping, cuticle care, exfoliation, relaxing foot massage.', 506000, 'IDR', 1), ('Pedicure', 'Sita’s Pedicure - With SHELLAC® Nail Polish (90 min)', 'Buffing, nail shaping, cuticle care, exfoliation, relaxing foot massage.', 695750, 'IDR', 2), ('Pedicure', 'Pedicure Express - With OPI Nail Polish (45 min)', null, 278300, 'IDR', 3), ('Pedicure', 'Pedicure Express - With Creative Play® Nail Polish (45 min)', null, 278300, 'IDR', 4), ('Pedicure', 'Pedicure Express - With SHELLAC® Nail Polish (60 min)', null, 442740, 'IDR', 5), ('Other', 'SHELLAC® Soak Off (30 min)', 'Gel nail polish removal, buffing, cuticle cleaning, and nail vitamin.', 189750, 'IDR', 0), ('Other', 'Indulgence Escape', '3 Days 2 Nights', 18980000, 'IDR', 1), ('Other', 'SANTRIAN CHILL GETAWAY', 'Minimum 2 night stay', 5000000, 'IDR', 2), ('Other', 'Harmonious Indulgence', '3 Nights / 4 Days', 9900000, 'IDR', 3), ('Other', 'Get Away & Reconnect', '4 Days 3 Nights', 8250000, 'IDR', 4), ('Other', 'Irresistibly Bali', '4 Days 3 Nights', 26500000, 'IDR', 5), ('Other', 'Irresistibly Bali', '4 Days / 3 Nights stay', 7900000, 'IDR', 6), ('Other', 'Irresistibly Bali', '4 Days 3 Nights', 8550000, 'IDR', 7), ('Other', 'Wellness Vacation', '4 Days 3 Nights', 8400000, 'IDR', 8), ('Other', 'Romantic Escape', '4 Days 3 Nights', 26753100, 'IDR', 9), ('Nails', 'OPI Nail Hands or Feet Polish Only (30 min)', null, 189750, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'shampoolounge.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Shampoo Lounge treatment prices', 1, 'draft', 'partial', 'https://www.shampoolounge.com/bookingseminyak', 'Official The Shampoo Lounge price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'ffb2bf5c6cb2e9d625cd2de428ccc0c8077284297bbd277b274c99a7da35b946', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Other', 0), ('Ayurvedic Treatment', 1), ('Head Massage', 2), ('Hair Treatment', 3), ('Hot Stone', 4), ('Ear Candle', 5), ('Hair Colouring', 6)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Other', 'Women''s Cut & Blow by Stylist (60 min)', 'Your Bali ready cut with a polished salon finish.', 400000, 'IDR', 0), ('Other', 'Women''s Cut & Blow by Sr. Stylist (60 min)', 'Your Bali ready cut with a polished salon finish.', 600000, 'IDR', 1), ('Other', 'Women''s Cut & Blow w/Hair Extensions (60 min)', 'Your Bali ready cut with a polished salon finish.', 550000, 'IDR', 2), ('Other', 'Fringe Trim/Bang Cut (30 min)', 'Your Bali ready cut with a polished salon finish.', 150000, 'IDR', 3), ('Other', 'Wash Blow Glow Extensions (60 min)', 'Your Bali ready cut with a polished salon finish.', 400000, 'IDR', 4), ('Other', 'Updo (60 min)', 'Your Bali ready cut with a polished salon finish.', 400000, 'IDR', 5), ('Other', 'Men''s Cut (30 min)', 'Your Bali ready cut with a polished salon finish.', 250000, 'IDR', 6), ('Other', 'Girl''s Cut <10y/o (30 min)', 'Your Bali ready cut with a polished salon finish.', 200000, 'IDR', 7), ('Other', 'Kids Updo <10y/o (30 min)', 'Your Bali ready cut with a polished salon finish.', 235000, 'IDR', 8), ('Other', 'Wash Blow Glow (60 min)', 'Your Bali ready cut with a polished salon finish.', 220000, 'IDR', 9), ('Other', 'Molecular Wash Blow (60 min)', 'Your Bali ready cut with a polished salon finish.', 350000, 'IDR', 10), ('Other', 'Virgin Coconut Creambath (60 min)', 'Restore and nourish after sun & sea.', 450000, 'IDR', 11), ('Other', 'Luscious Lock Treatment by L''oréal (60 min)', 'Restore and nourish after sun & sea.', 385000, 'IDR', 12), ('Other', 'Hair Filler Treatment', 'Restore and nourish after sun & sea.', 715000, 'IDR', 13), ('Other', 'Argan Deep Conditioning Treatment (60 min)', 'Restore and nourish after sun & sea.', 420000, 'IDR', 14), ('Other', 'Olaplex', 'Restore and nourish after sun & sea.', 950000, 'IDR', 15), ('Other', 'Ice Mint Creambath (60 min)', 'Restore and nourish after sun & sea.', 495000, 'IDR', 16), ('Ayurvedic Treatment', 'Ayurvedic Combo', 'Restore and nourish after sun & sea.', 550000, 'IDR', 0), ('Head Massage', 'Olive Oil Head & Scalp Treatment (60 min)', 'Restore and nourish after sun & sea.', 385000, 'IDR', 0), ('Hair Treatment', 'Princess Hair Spa <10y/o', 'Restore and nourish after sun & sea.', 330000, 'IDR', 0), ('Hot Stone', 'Additional Hot Stone', 'Add extra treatment for relaxation.', 55000, 'IDR', 0), ('Ear Candle', 'Ear Candle Treatment', 'Relaxation and detox.', 180000, 'IDR', 0), ('Hair Colouring', 'Hair Color', 'Your color, your way done right in Bali.', 800000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'theasamaia.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Asa Maia treatment prices', 1, 'draft', 'partial', 'https://www.theasamaia.com/resources/media/user/1774856811-Spa_Menu.pdf', 'Official The Asa Maia price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'e20d0291bbe319e6fe08258c80f2b2ff75f794ad2090b482b83c443701f57539', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Traditional Massage', 0), ('Deep Tissue', 1), ('Gua Sha', 2), ('Reflexology', 3), ('Body Scrub', 4), ('Body Mask', 5), ('Other', 6), ('Facial', 7), ('Manicure', 8), ('Nails', 9), ('Pedicure', 10), ('Aromatherapy', 11), ('Hair Styling', 12)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Traditional Massage', 'Signature Massage (90 min)', 'Introducing you to The Asa Maia experience. The Signature treatment uses continuos long soothing strokes, and thumb and palm pressure to ease muscles and aids the circulatory systems. Decompress with our signature treatment and enter a state of welldeserved holiday bliss after your journey.', 1300000, 'IDR', 0), ('Traditional Massage', 'Indonesian Massage (60 min)', 'Feel nurtured and nourished by this deeply relaxing and intuitive treatment derived from ancient local wisdom.', 900000, 'IDR', 1), ('Traditional Massage', 'Indonesian Massage (90 min)', 'Feel nurtured and nourished by this deeply relaxing and intuitive treatment derived from ancient local wisdom.', 1100000, 'IDR', 2), ('Traditional Massage', 'Express Upper Body Massage (30 min)', 'Ease tension where you need it most with this fast acting de-stressing treatment.', 600000, 'IDR', 3), ('Traditional Massage', 'Express Lower Leg Massage (30 min)', 'A treatment for tired feet and heavy legs.', 600000, 'IDR', 4), ('Deep Tissue', 'Deep Tissue (60 min)', 'Strong firm massage strokes focusing on the pressure points of your body, help to ease muscle aches and tension and relive tiredness.', 1150000, 'IDR', 0), ('Deep Tissue', 'Deep Tissue (90 min)', 'Strong firm massage strokes focusing on the pressure points of your body, help to ease muscle aches and tension and relive tiredness.', 1200000, 'IDR', 1), ('Gua Sha', 'Gua Sha Body Detox Treatment (90 min)', 'A full body treatment using oils and specialized crystal tools to melt your tension and stimulate healing detoxification.', 2000000, 'IDR', 0), ('Reflexology', 'Foot Reflexology (60 min)', 'Reflexology is an accent art that focuses on releasing blocked energy from the body to allow innate healing to unfold.', 850000, 'IDR', 0), ('Body Scrub', 'Traditional Body Scrub (60 min)', 'A decadent, skin-softening exfoliation treatment leaving your skin nourished, smooth and supple.', 900000, 'IDR', 0), ('Body Mask', 'Traditional Body Mask (60 min)', 'An indulgent full body mask treatment.', 900000, 'IDR', 0), ('Other', 'Cool Down (30 min)', 'A soothing skin renewal treatment for sun-kissed skin.', 950000, 'IDR', 0), ('Other', 'Mandi Rempah (30 min)', 'An aromatic bath of healing herbs and flowers.', 950000, 'IDR', 1), ('Other', 'Natural Body Firming Treatment (75 min)', 'A specialized treatment concentrating on areas prone to cellulite.', 1150000, 'IDR', 2), ('Other', 'Pure Radiance By Nature (60 min)', 'A bespoke facial treatment that promises a healthy glowing complexion.', 900000, 'IDR', 3), ('Other', 'Celluma Light Therapy® (40 min)', 'Celluma light therapy improves cellular health to reduce the signs of aging.', 500000, 'IDR', 4), ('Other', 'Celluma Light Therapy® (30 min)', 'Celluma light therapy improves cellular health to reduce the signs of aging.', 350000, 'IDR', 5), ('Other', 'Buff and Shine Only (45 min)', null, 400000, 'IDR', 6), ('Other', 'Buff and Shine Only (45 min)', null, 400000, 'IDR', 7), ('Other', 'Creambath (60 min)', 'A traditional scalp massage using fragrant hair cream.', 800000, 'IDR', 8), ('Facial', 'Natural Facial By Sensatia Botanicals® (60 min)', 'A special facial using Sensatia Botanical products.', 1200000, 'IDR', 0), ('Manicure', 'Essential Manicure (60 min)', null, 650000, 'IDR', 0), ('Nails', 'Nail Polish by Cote® (30 min)', null, 300000, 'IDR', 0), ('Nails', 'Nail Polish by Cote® (30 min)', null, 300000, 'IDR', 1), ('Nails', 'Nail Gel Remover Only (45 min)', null, 250000, 'IDR', 2), ('Pedicure', 'Essential Pedicure (60 min)', null, 650000, 'IDR', 0), ('Aromatherapy', 'Relaxation & Aromatherapy Scalp Massage (30 min)', 'A specialized product selected to match your scalp''s needs in this immersive experience.', 350000, 'IDR', 0), ('Hair Styling', 'Wash and Blow Dry (60 min)', 'A luxury wash and blow dry treatment.', 500000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'thefreebirdstudio.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Freebird Studio treatment prices', 1, 'draft', 'partial', 'https://thefreebirdstudio.com/bookings', 'Official The Freebird Studio price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '3117e7b4a5d85838175142cf22a16857c7e2f88850683965ca02b3f57601995b', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Other', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Other', 'Core Circuit (60 min)', 'CORE training workout builds strength, stability, and endurance in the muscles that support your spine—including the abs, glutes, hips, and lower back.', 185000, 'IDR', 0), ('Other', 'The Body Reset & Release (90 min)', 'A deeply restorative healing journey to unwind pain, release long-held tension, calm your nervous system, and restore your natural ease of movement.', 444000, 'IDR', 1), ('Other', 'BodyPump HEAVY (45 min)', 'Designed for maximum muscle growth by using heavier weights than traditional BODYPUMP.', 185000, 'IDR', 2), ('Other', 'BODYPUMP (60 min)', 'A full-body, high-rep strength training class that uses barbells and motivating music to tone, sculpt, and build muscular endurance.', 185000, 'IDR', 3), ('Other', 'Kundalini Activation - Release to Rise (120 min)', 'A fusion of Kundalini Activation, Shamanic practices, Light Language, and NLP Parts Integration.', 555000, 'IDR', 4), ('Other', 'Strength Development Class (60 min)', 'Muscle is Medicine. This class heros the essential elements of resistance training.', 185000, 'IDR', 5), ('Other', 'Quantum Reset (90 min)', 'A guided breath, movement, and visualization class that shifts your state and drops you into the version of you that’s already living your vision.', 555000, 'IDR', 6)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'thetemplelodge.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Temple Lodge treatment prices', 1, 'draft', 'partial', 'https://thetemplelodge.com', 'Official The Temple Lodge price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'ce07bad7a70547262abe2912203eb0a000793fdc8c23884565e846f440d6f120', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Deep Tissue', 1), ('Hot Stone', 2), ('Body Scrub', 3), ('Facial', 4)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Balinese massage (60 min)', 'A traditional Balinese massage using natural oils and heat.', 250000, 'IDR', 0), ('Balinese Massage', 'Balinese massage (90 min)', 'A traditional Balinese massage using natural oils and heat.', 350000, 'IDR', 1), ('Balinese Massage', 'Balinese massage (60 min)', 'Traditional Balinese massage', 250000, 'IDR', 2), ('Balinese Massage', 'Balinese massage (90 min)', 'Traditional Balinese massage', 350000, 'IDR', 3), ('Deep Tissue', 'Deep tissue massage (60 min)', 'A deep tissue massage targeting tense muscles.', 300000, 'IDR', 0), ('Deep Tissue', 'Deep tissue massage (90 min)', 'A deep tissue massage targeting tense muscles.', 375000, 'IDR', 1), ('Deep Tissue', 'Deep tissue massage (60 min)', 'Intensive muscle therapy', 300000, 'IDR', 2), ('Deep Tissue', 'Deep tissue massage (90 min)', 'Intensive muscle therapy', 375000, 'IDR', 3), ('Hot Stone', 'Hot stone massage (90 min)', 'Therapeutic hot stone massage for relaxation.', 350000, 'IDR', 0), ('Hot Stone', 'Hot stone massage (90 min)', 'Relaxing hot stone treatment', 350000, 'IDR', 1), ('Body Scrub', 'Scrub & massage (90 min)', 'Relaxing scrub combined with a soothing massage.', 350000, 'IDR', 0), ('Body Scrub', 'Scrub & massage (90 min)', 'Exfoliation followed by a massage', 350000, 'IDR', 1), ('Facial', 'Facial massage (90 min)', 'Gentle facial massage using natural products.', 350000, 'IDR', 0), ('Facial', 'Facial massage (90 min)', 'Relaxing treatment for the face', 350000, 'IDR', 1)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'theyogabarn.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Yoga Barn Wellness treatment prices', 1, 'draft', 'partial', 'https://theyogabarn.com/wp-content/uploads/2026/05/YBW-All-Menu-Mei2026-A3.pdf', 'Official Yoga Barn Wellness price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '5c9f855f80051f2e0cb8adf9a38fc13a6bcad8a2c7a9b91850f6542e10691e4d', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Body Scrub', 0), ('Thai Massage', 1), ('Pregnancy Massage', 2), ('Yoga', 3), ('Balinese Massage', 4), ('Traditional Massage', 5), ('Head Massage', 6), ('Facial', 7), ('Abhyanga', 8), ('Back Massage', 9), ('Foot Massage', 10), ('Nails', 11), ('Other', 12), ('Sauna', 13), ('Sound Healing', 14)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Body Scrub', 'Body Scrub (60 min)', null, 1600000, 'IDR', 0), ('Body Scrub', 'Body Massage + Scrub (90 min)', null, 380000, 'IDR', 1), ('Thai Massage', 'KUSH Thai (60 min)', null, 450000, 'IDR', 0), ('Thai Massage', 'KUSH Thai (90 min)', null, 550000, 'IDR', 1), ('Pregnancy Massage', 'Prenatal Massage (90 min)', null, 2500000, 'IDR', 0), ('Yoga', 'Balancing Ayuryoga (60 min)', null, 450000, 'IDR', 0), ('Balinese Massage', 'Balinese Herbal Cocoon (90 min)', null, 550000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage (60 min)', null, 400000, 'IDR', 1), ('Traditional Massage', 'Bamboo Tension Release Massage (90 min)', null, 450000, 'IDR', 0), ('Head Massage', 'Herbal Head Stamp (30 min)', null, 170000, 'IDR', 0), ('Facial', 'Natural Facial Treatment (60 min)', null, 400000, 'IDR', 0), ('Abhyanga', 'Mukha Abhyanga (Ayurvedic Face Massage) (60 min)', null, 330000, 'IDR', 0), ('Abhyanga', 'Shiro Abhyanga (Ayurvedic Head Massage) (60 min)', null, 370000, 'IDR', 1), ('Back Massage', 'Back Massage (45 min)', null, 370000, 'IDR', 0), ('Foot Massage', 'Foot Accupressure (60 min)', null, 400000, 'IDR', 0), ('Foot Massage', 'Foot & Nail Treatment (60 min)', null, 370000, 'IDR', 1), ('Nails', 'Hand & Nail Treatment (45 min)', null, 270000, 'IDR', 0), ('Other', 'Herbal Medicine Oil (15 min)', null, 75000, 'IDR', 0), ('Other', 'Colon Hydrotherapy (60 min)', null, 1900000, 'IDR', 1), ('Other', 'Hypnotherapy (Inner Child Healing & Relationship Healing) (90 min)', null, 2200000, 'IDR', 2), ('Other', 'Vedic Astrology Reading (60 min)', null, 2200000, 'IDR', 3), ('Other', 'Women’s Hormonal Health (60 min)', null, 2200000, 'IDR', 4), ('Sauna', 'Infra-red Sauna (60 min)', null, 1467000, 'IDR', 0), ('Sound Healing', 'Private Sound Healing (60 min)', null, 1800000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'ubudsari.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Ubud Sari Spa treatment prices', 1, 'draft', 'partial', 'https://ubudsari.com/ubud-sari-basic-spa-treatment', 'Official Ubud Sari Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '0bf53f8c48f9ebd9661f5dd71d818ba9a1e0af440ef1fa0fcd463d02d71ce70a', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Neck & Shoulder', 0), ('Traditional Massage', 1), ('Foot Massage', 2), ('Lomi Lomi', 3), ('Four Hands Massage', 4), ('Hot Stone', 5), ('Javanese Lulur', 6), ('Body Scrub', 7), ('Balinese Boreh', 8), ('Spa Package', 9)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Neck & Shoulder', 'Neck and Shoulder Massage (30 min)', 'Half an hour Quick Relaxing touch to ease your busy day.', 150000, 'IDR', 0), ('Traditional Massage', 'Ubud Sari Signature Massage (60 min)', 'Relaxation Massage designed in 60 minute is a synergistic blend that uses light to deep long strokes to relieve muscle tension and improve circulation.', 250000, 'IDR', 0), ('Traditional Massage', 'Ubud Sari Signature Massage (300 min)', 'A deeply Relaxing full body massage that use combination techniques from different massage styles in every movement, touch and kneading. Slowly washes away tensions and stimulate natural energy flow.', 375000, 'IDR', 1), ('Foot Massage', 'Foot Massage', null, 150000, 'IDR', 0), ('Lomi Lomi', 'Lomi – Lomi Hawaiian Style Massage (60 min)', 'Hawaiian Style Massage concentrate in gently and deeply into the muscles with continuous flowing strokes made by the therapist’s fingers, thumbs, arms and elbows.', 375000, 'IDR', 0), ('Four Hands Massage', 'Four Hands Massage (60 min)', 'A synchronized technical massage movement Combining of Double Therapist with long kneading strokes and acupressure to increase the level of muscle relaxation and puts the entire body and mind in a deeper state of calmness.', 425000, 'IDR', 0), ('Hot Stone', 'Hot Stone Therapy Massage (300 min)', 'Heat has long been known to reduce various muscle tension that feel stiff and painful. Heat can increase blood flow to tense area. The stones used for a hot stone massage are applied onto specific areas of the body, such as : The Back, Stomach, Face,Hands and Feet.', 400000, 'IDR', 0), ('Javanese Lulur', 'Mandi Lulur Javanese Ritual (120 min)', 'Javanese Lulur Skin Exfoliation scrub is a Traditional Javanese Beauty Ritual. The “Lulur” contains organic herbal of tropical plant leaves and spices in a rice powder base. Designed with the signature relaxing massage, a 120minutes of treatment is traditionally use since centuries to cleanse, smooth, softenand rejuvenate the skin ended with flower bath.', 450000, 'IDR', 0), ('Body Scrub', 'Mandi Kemiri / Hazelnut Scrub (120 min)', 'Candlenut has a fairly high oil content, contains important antioxidant compounds that can protect the skin and prevent free radical damage to skin cells. Treatments designed with a combination of relaxing massage will provide a sensation of calmness, smoothing and rejuvenating the skin.', 450000, 'IDR', 0), ('Body Scrub', 'Mandi Chocolate Scrub (120 min)', 'Chocolate is proven to boost the moisture content of your skin, resulting in cell renewal. Another interesting benefit of chocolate treatments is its caffeine content. When used periodically, the caffeine increases circulation and skin firming.', 450000, 'IDR', 1), ('Body Scrub', 'Cucumber or Carrot Scrub (120 min)', 'The massage is specially designed with a combination of shiatsu, deep tissue and Lomi-Lomi which is packed with a choice of cucumber or carrot scrub.', 385000, 'IDR', 2), ('Balinese Boreh', 'Balinese Boreh Scrub (120 min)', 'Balinese boreh have been used by local for centuries. A traditional exfoliation to rejuvenate skin as much as warming the body. Mixed of Clove, Ginger, Turmeric, Cinnamon, Nutmeg and Rice powder. Rubbed all over the skin.', 450000, 'IDR', 0), ('Spa Package', 'Nyuh Sparkling Ritual (300 min)', 'A sparkling & eco-friendly package based on “Nyuh” (Balinese name for coconut) is a very known as a “multy benefits fruit”. Fresh coconut rich in ion electrolits, enzymes and antioxidant. This is the main reason why we used the fruit of the God as a major ingredient in this beauty ritual to neutrelize free radicals, nourish your skin and leaving your skin smooth, shiny and fresh.', 650000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'youspaexperience.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'UMALAS treatment prices', 1, 'draft', 'partial', 'https://youspaexperience.com/wp-content/uploads/2025/03/You-Spa-Umalas-Menu_compressed.pdf', 'Official UMALAS price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '97888f683cd1e7e58aa8eab35e3676a99480257a1d1437efa4b591694d545798', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Traditional Massage', 0), ('Other', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Traditional Massage', 'SIGNATURE full body massage (75 min)', 'Indulge in our signature massage, where traditional techniques, gentle stretches, and precise acupressure come together to restore balance, melt away tension, and rejuvenate your body and mind.', 500000, 'IDR', 0), ('Traditional Massage', 'BALINESE full body massage (60 min)', 'Experience the art of a traditional Balinese massage, combining rhythmic strokes, acupressure, and aromatic oils to soothe muscles, improve circulation, and restore harmony to body and mind.', 400000, 'IDR', 1), ('Traditional Massage', 'BALINESE full body massage (90 min)', 'Experience the art of a traditional Balinese massage, combining rhythmic strokes, acupressure, and aromatic oils to soothe muscles, improve circulation, and restore harmony to body and mind.', 540000, 'IDR', 2), ('Other', 'RELEASE (30 min)', 'Relieve tension in your back and neck with this focused 30-minute massage, designed to target areas of stress, relax tight muscles, and restore comfort for a refreshed, rejuvenated feeling.', 270000, 'IDR', 0), ('Other', 'EXPAND (30 min)', 'Experience the incredible benefits of a head, neck, and shoulder massage. Improve circulation to ease headaches, neck tension, and shoulder discomfort.', 270000, 'IDR', 1), ('Other', 'SUPPORT (30 min)', 'Soothe your tired hands with a gentle massage. This treatment targets pressure points and helps relieve joint strain, offering relaxation and comfort.', 270000, 'IDR', 2), ('Other', 'REST (30 min)', 'Give your feet and legs the care they deserve after travel or a day of exploration. This soothing treatment includes reflexology and extends up to the knees, releasing tension throughout your body and promoting deep relaxation and ultimate relief.', 270000, 'IDR', 3), ('Other', 'RELAXING (30 min)', 'This 30-minute facial includes a soothing face, neck, and scalp massage to promote deep relaxation and refresh your skin in a short amount of time. It leaves your skin feeling invigorated and rejuvenated, perfect for those with busy schedules.', 390000, 'IDR', 4), ('Other', 'REFRESHING (60 min)', 'Ideal for those with fragile skin exposed to the elements, including the ocean, sun, wind, and dust. This facial soothes and nourishes the skin, reducing inflammation and restoring a healthy, radiant glow. Perfect for calming irritated skin, it provides deep hydration and protection.', 540000, 'IDR', 5), ('Other', 'ENERGY face treatment (60 min)', 'This face care treatment is designed for normal to dry skin, providing deep hydration and nourishment. It restores moisture, soothes dryness, and helps maintain a smooth, refreshed complexion. Perfect for keeping skin soft, balanced, and protected throughout the day.', 540000, 'IDR', 6), ('Other', 'RELAX (105 min)', 'This indulgent experience includes a 75-minute Signature massage, designed to release tension and promote deep relaxation, followed by a 30-minute Relaxing Facial to refresh and rejuvenate your skin.', 700000, 'IDR', 7), ('Other', 'RENEW (90 min)', 'Pamper yourself with a 60-minute facial to cleanse, refresh, and nourish your skin. Follow it with a 30-minute feet massage to release tension and promote relaxation.', 730000, 'IDR', 8)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

update menus set status = 'source_snapshot', source_snapshot_published_at = '2026-08-25T01:47:06+00:00'::timestamptz
where status = 'draft'
  and completeness = 'partial'
  and verified_at is null
  and content_digest is not null
  and expires_at > now()
  and created_at >= '2026-08-25T01:47:06+00:00'::timestamptz
  and exists (select 1 from menu_sections s join menu_items it
              on it.section_id = s.id and it.menu_id = s.menu_id
              where s.menu_id = menus.id);
