-- spa menu snapshots, batch 2 (25 menus)
with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'thelotuspabali.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Lotus Spa treatment prices', 1, 'draft', 'partial', 'https://thelotuspabali.com/', 'Official The Lotus Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '8b02c216a94af9101832e1d74669f1a7e371d2cdae7a9a6f63085a9cbc6f3abe', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Aromatherapy', 1), ('Hot Stone', 2), ('Lomi Lomi', 3), ('Reflexology', 4), ('Traditional Massage', 5), ('Javanese Lulur', 6), ('Balinese Boreh', 7), ('Body Scrub', 8), ('Spa Package', 9)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Balinese Massage (60 min)', null, 250000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage (60 min)', null, 250000, 'IDR', 1), ('Aromatherapy', 'Aromatherapy Massage (60 min)', null, 265000, 'IDR', 0), ('Aromatherapy', 'Aromatherapy Massage (60 min)', null, 265000, 'IDR', 1), ('Hot Stone', 'Warm Stone Massage (60 min)', null, 270000, 'IDR', 0), ('Hot Stone', 'Warm Stone Massage (60 min)', null, 270000, 'IDR', 1), ('Lomi Lomi', 'Lomi - lomi Massage (60 min)', null, 300000, 'IDR', 0), ('Lomi Lomi', 'Lomi - lomi Massage (60 min)', null, 300000, 'IDR', 1), ('Reflexology', 'Reflexology (40 min)', null, 265000, 'IDR', 0), ('Reflexology', 'Reflexology (40 min)', null, 265000, 'IDR', 1), ('Traditional Massage', 'Stress Massage (40 min)', null, 200000, 'IDR', 0), ('Traditional Massage', 'Stress Massage (40 min)', null, 200000, 'IDR', 1), ('Javanese Lulur', 'Javanese Lulur (60 min)', null, 260000, 'IDR', 0), ('Javanese Lulur', 'Javanese Lulur (60 min)', null, 260000, 'IDR', 1), ('Balinese Boreh', 'Balinese Boreh (60 min)', null, 260000, 'IDR', 0), ('Balinese Boreh', 'Balinese Boreh (60 min)', null, 260000, 'IDR', 1), ('Body Scrub', 'Milk Scrub (60 min)', null, 260000, 'IDR', 0), ('Body Scrub', 'Coffee Scrub (60 min)', null, 260000, 'IDR', 1), ('Body Scrub', 'Milk Scrub (60 min)', null, 260000, 'IDR', 2), ('Body Scrub', 'Coffee Scrub (60 min)', null, 260000, 'IDR', 3), ('Spa Package', 'The Lotus Spa Romantic Package (160 min)', 'Balinese massage, body scrub & body mask', 400000, 'IDR', 0), ('Spa Package', 'The Lotus Spa Honeymoon Package (160 min)', 'Balinese massage, body scrub & creambath', 400000, 'IDR', 1), ('Spa Package', 'The Lotus Spa Package (90 min)', 'Balinese massage & body scrub', 380000, 'IDR', 2), ('Spa Package', 'The Lotus Spa Romantic Package (160 min)', '(Balinese massage, body scrub & body mask)', 400000, 'IDR', 3), ('Spa Package', 'The Lotus Spa Honeymoon Package (160 min)', '(Balinese massage, body scrub & creambath)', 400000, 'IDR', 4), ('Spa Package', 'The Lotus Spa Package (90 min)', '(Balinese massage & body scrub)', 380000, 'IDR', 5)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'baliorchidspa.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Bali Orchid Spa treatment prices', 1, 'draft', 'partial', 'https://baliorchidspa.com/', 'Official Bali Orchid Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'f57074ca65645a5dfa12a9d6ac0660334d9efc949b422099550108f6494daeac', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Javanese Lulur', 1), ('Spa Package', 2), ('Traditional Massage', 3), ('Lymphatic Massage', 4), ('Other', 5), ('Shirodhara', 6)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Traditional Balinese Massage (60 min)', null, 385000, 'IDR', 0), ('Javanese Lulur', 'Orchid Lulur Package (120 min)', null, 675000, 'IDR', 0), ('Spa Package', 'Orchid Refreshing Package (120 min)', null, 720000, 'IDR', 0), ('Spa Package', 'Orchid Angel Package (150 min)', null, 1015000, 'IDR', 1), ('Spa Package', 'Orchid Relaxing Package (180 min)', null, 1200000, 'IDR', 2), ('Traditional Massage', 'Strawberry Spa Massage (75 min)', null, 500000, 'IDR', 0), ('Lymphatic Massage', 'Lymphatic Massage (90 min)', null, 525000, 'IDR', 0), ('Other', 'Orchid Green Tea Anti Ageing (150 min)', null, 1000000, 'IDR', 0), ('Shirodhara', 'Shirodara Massage (60 min)', null, 735000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'heavenlyspabali.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Heavenly Spa by Westin treatment prices', 1, 'draft', 'partial', 'https://www.heavenlyspabali.com/', 'Official Heavenly Spa by Westin price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'dc98201f64404c6d06ad806df7e82d3cb90c0e1067fd40a255778efd40c5cc55', 'spa'
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
join (values ('Other', 'Heavenly Spa Day Pass', 'Take a pause from the everyday and enjoy a day dedicated entirely to yourself. Whether you''re seeking quiet relaxation or a moment to reset, Heavenly Spa invites you to unwind at your own pace.', 500000, 'IDR', 0), ('Other', 'Morning Spa Escape', 'Awaken your senses with a calming morning ritual at Heavenly Spa by WestinTM. Thoughtfully designed to restore balance and ease the body, this soothing massage experience brings clarity to the mind—leaving you refreshed and ready for the day ahead.', 800000, 'IDR', 1), ('Other', 'Heavenly Arrival Reset (60 min)', 'A calming massage designed to ease travel fatigue and restore balance after long journeys. Slow, lowing techniques release tension, improve circulation, and promote deep relaxation for a refreshed arrival.', 880000, 'IDR', 2), ('Other', 'Heavenly Arrival Reset (90 min)', 'A calming massage designed to ease travel fatigue and restore balance after long journeys. Slow, lowing techniques release tension, improve circulation, and promote deep relaxation for a refreshed arrival.', 1350000, 'IDR', 3), ('Other', 'Sonic Reset (30 min)', 'A restorative 30-minute ritual to ease travel fatigue and restore balance after your journey. Immerse in a curated sound journey, where restorative frequencies gently guide the mind and body into calm, balance, and renewal.', 500000, 'IDR', 4), ('Other', 'Eat Pray Spa', 'Embark in a rejuvenating & holistic wellbeing journey at Nusa Dua beachfront sanctuary.', 2750000, 'IDR', 5), ('Other', 'Eat Pray Spa', 'Embark in a rejuvenating & holistic wellbeing journey at Nusa Dua beachfront sanctuary.', 5000000, 'IDR', 6)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'chidayspas.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Chi Massage & Luxury Spa Nusa Dua Bali treatment prices', 1, 'draft', 'partial', 'https://www.chidayspas.com/nusa-dua-bali', 'Official Chi Massage & Luxury Spa Nusa Dua Bali price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'fa9ce98b7d33184a96399184fc7706d706afda939872e266ca23468e7f7e7b68', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Spa Package', 0), ('Head Massage', 1), ('Hair Treatment', 2), ('Aromatherapy', 3), ('Reflexology', 4), ('Manicure', 5), ('Nail Art', 6)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Spa Package', 'Five Element Energy Ritual (1 Therapist) (60 min)', 'Inspired by the Five Elements philosophy, this personalised treatment adapts to your body''s needs.', 680000, 'IDR', 0), ('Head Massage', 'Japanese Head Spa (60 min)', 'A specialised scalp therapy designed to release tension and promote deep relaxation.', 680000, 'IDR', 0), ('Hair Treatment', 'Indonesian Herbal Hair Mask (60 min)', 'A traditional herbal treatment that nourishes the hair and scalp.', 480000, 'IDR', 0), ('Aromatherapy', 'Full Body Aroma Massage (60 min)', 'Deep relaxation with customised techniques and aromatherapy.', 480000, 'IDR', 0), ('Reflexology', 'Foot Reflexology (60 min)', 'Stimulates circulation and promotes overall balance.', 380000, 'IDR', 0), ('Manicure', 'Classic Manicure', 'Clean, neat, and well-groomed nails.', 380000, 'IDR', 0), ('Manicure', 'Gel Finish Manicure', 'Long-lasting colour with a glossy finish.', 480000, 'IDR', 1), ('Nail Art', 'Creative 3D Nail Art', 'Custom-designed nail styling for a unique look.', 580000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'kayumanisspanusadua.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Kayumanis Spa Nusa Dua treatment prices', 1, 'draft', 'partial', 'http://kayumanisspanusadua.com/menus', 'Official Kayumanis Spa Nusa Dua price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '9c5f19eda4a2ccbd7fd496072fbc159f456e06f52118805e8301fc321011e14c', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Spa Package', 0), ('Traditional Massage', 1), ('Four Hands Massage', 2), ('Hot Stone', 3), ('Other', 4), ('Facial', 5)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Spa Package', 'Relaxing Ritual (120 min)', 'Experience the pleasure of overall indulgence with a nurturing treatment that pays attention to every part of the body.', 1970000, 'IDR', 0), ('Spa Package', 'Kayumanis Romantic Package (120 min)', 'Spend this romantic day at our Spa with a 2 hours treatment flow, including foot bath, body massage, body scrub and wine bath.', 2080000, 'IDR', 1), ('Spa Package', 'Ocean Ritual (120 min)', 'A rejuvenating ritual inspired by the sea.', 2125000, 'IDR', 2), ('Traditional Massage', 'Relaxing Massage (60 min)', 'Inspired by traditional Balinese massage techniques.', 1025000, 'IDR', 0), ('Traditional Massage', 'Kayumanis Massage (90 min)', 'A combination of Balinese massage, lomi lomi and therapeutic massage.', 1340000, 'IDR', 1), ('Traditional Massage', 'Energy Massage (60 min)', 'A firm and deep stroke massage treatment.', 1025000, 'IDR', 2), ('Traditional Massage', 'Herbal Compress Massage (90 min)', 'Uses selected indigenous herbs to alleviate pain or inflammation.', 1420000, 'IDR', 3), ('Four Hands Massage', 'Four Hands Massage (90 min)', 'A treatment done by two therapists simultaneously.', 1890000, 'IDR', 0), ('Hot Stone', 'Warm Stone Massage (90 min)', 'Uses heated natural volcanic stones to relax tight muscles.', 1420000, 'IDR', 0), ('Other', 'Celestrial Dream (60 min)', 'An exfoliating body treatment using natural products.', 1025000, 'IDR', 0), ('Other', 'Vibrant Recharge (90 min)', 'Recommended after a long journey to help recover from jet lag.', 1420000, 'IDR', 1), ('Other', 'Kayumanis Karma (120 min)', 'A balancing treatment designed to melt away stress.', 1970000, 'IDR', 2), ('Other', 'Executive Revival (180 min)', 'A masculine ritual encouraging self-indulgence.', 2600000, 'IDR', 3), ('Other', 'Sweet Serenade (180 min)', 'A feminine approach towards health and beauty.', 2750000, 'IDR', 4), ('Other', 'Kayumanis Journey (180 min)', 'A replenishing ritual to restore energy levels.', 2830000, 'IDR', 5), ('Facial', 'Refreshing Natural Facial (60 min)', 'Focuses on pure and natural ingredients known for nourishing properties.', 1025000, 'IDR', 0), ('Facial', 'Traditional Facial (60 min)', 'Combines garden-fresh ingredients with anti-aging products.', 1025000, 'IDR', 1)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'royalorchidspa.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Royal Orchid Spa treatment prices', 1, 'draft', 'partial', 'https://royalorchidspa.com/', 'Official Royal Orchid Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '6b462e0da0982013a8902ecf090a747298a8569dd73d6debd6b57028e3d78a16', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Shirodhara', 1), ('Lymphatic Massage', 2), ('Traditional Massage', 3), ('Flower Bath', 4), ('Other', 5), ('Spa Package', 6), ('Body Scrub', 7), ('Reflexology', 8), ('Facial', 9), ('Manicure', 10), ('Hot Stone', 11), ('Couple Massage', 12)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Royal Traditional Balinese Massage – 60 (60 min)', null, 385000, 'IDR', 0), ('Balinese Massage', 'Balinese Costume Photo – A (60 min)', null, 675000, 'IDR', 1), ('Shirodhara', 'Royal Shirodara Massage (60 min)', null, 975000, 'IDR', 0), ('Shirodhara', 'Royal Shirodara Package (180 min)', null, 1950000, 'IDR', 1), ('Lymphatic Massage', 'Royal Lymphatic Massage (90 min)', null, 525000, 'IDR', 0), ('Traditional Massage', 'Strawberry Spa Massage (75 min)', null, 500000, 'IDR', 0), ('Traditional Massage', 'Strawberry Spa Massage (75 min)', 'A wonderfully relaxing and fruity spa experience for kids. This soothing journey is designed to be safe and enjoyable for sensitive skin. Package includes: Gentle pressure massage with baby oil, Sweet and fragrant strawberry body scrub, Refreshing shower to finish.', 500000, 'IDR', 1), ('Flower Bath', 'Flower bath (30 min)', null, 400000, 'IDR', 0), ('Other', 'Princess Meni or Pedi (45 min)', null, 350000, 'IDR', 0), ('Other', 'Royal Creambath (60 min)', null, 480000, 'IDR', 1), ('Spa Package', 'Orchid Family Package (90 min)', null, 1785000, 'IDR', 0), ('Spa Package', 'Royal Iulur Package (120 min)', null, 680000, 'IDR', 1), ('Spa Package', 'Royal Refreshing Package (120 min)', null, 720000, 'IDR', 2), ('Spa Package', 'Royal Chocolate Package (120 min)', null, 900000, 'IDR', 3), ('Spa Package', 'Balinese Costume Photo Package – B (120 min)', null, 1125000, 'IDR', 4), ('Spa Package', 'Royal Sunburn Package (120 min)', null, 900000, 'IDR', 5), ('Spa Package', 'Royal Wine Package (120 min)', null, 1350000, 'IDR', 6), ('Spa Package', 'Royal Relaxing Package (180 min)', null, 1650000, 'IDR', 7), ('Spa Package', 'Royal Beauty Package (240 min)', null, 2100000, 'IDR', 8), ('Body Scrub', 'Princess Chocholate Scrub (30 min)', null, 280000, 'IDR', 0), ('Reflexology', 'Royal Foot/Reflexology Massage (60 min)', null, 420000, 'IDR', 0), ('Facial', 'Royal Facial (60 min)', null, 480000, 'IDR', 0), ('Manicure', 'Royal Manicure or Pedicure (60 min)', null, 525000, 'IDR', 0), ('Hot Stone', 'Royal Warm Stone Massage (120 min)', null, 975000, 'IDR', 0), ('Couple Massage', 'Royal Honeymoon Package – Couple (180 min)', null, 3600000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'zahraluxuryspa.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Zahra Luxury Spa treatment prices', 1, 'draft', 'partial', 'https://zahraluxuryspa.com/treatments', 'Official Zahra Luxury Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '323cb133d6342ca64218fb8660b8b31597b971029a49ba37b62aa83107761aef', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Foot Massage', 0), ('Deep Tissue', 1), ('Facial', 2), ('Balinese Massage', 3), ('Traditional Massage', 4), ('Thai Massage', 5), ('Shirodhara', 6), ('Pregnancy Massage', 7), ('Spa Package', 8), ('Couple Massage', 9)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Foot Massage', 'Foot Massage (60 min)', 'A complementary therapy applying targeted Pressure to specific points on the feet, hands, or ears to promote relaxation, stress reduction and overall Wellness', 410000, 'IDR', 0), ('Foot Massage', 'Foot Massage (90 min)', null, 610000, 'IDR', 1), ('Deep Tissue', 'Deep Tissue Massage (60 min)', 'The pressure utilized in a returned, neck and shoulders massage may also vary, even though the therapist has a tendency to apply a light to medium contact, until you request a deeper pressure.', 410000, 'IDR', 0), ('Deep Tissue', 'Deep Tissue Massage (90 min)', 'Massage technique that combines shiatsu palm pressing and pressure point that is firm and deeply releasing oil massage to soothe sore and help to treat muscle points.', 690000, 'IDR', 1), ('Deep Tissue', 'Deep Tissue Massage (120 min)', null, 920000, 'IDR', 2), ('Facial', 'Natural Facial (60 min)', 'A pure Natural facial From Nature product such as plant extracts, botanical oil, fruits, herbs, and clays without the use of Synthetic Chemicals. These facials focus on harnessing botanical power to deeply cleanse, nourish and rejuvenate the skin.', 425000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage (90 min)', 'Full body Massage Using a Blend with aroma of essential oil from Balinese flowers, techniques including skin rolling, kneading, Stroking and pressure Point stimulation.', 650000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage (120 min)', null, 880000, 'IDR', 1), ('Traditional Massage', 'Shiatshu Massage (60 min)', 'Form of massage that utilizes the hands, thumb or other body part, to apply direct pressure on various points or channels in the body. It is performed through loose clothing and does not use oil.', 470000, 'IDR', 0), ('Traditional Massage', 'Shiatshu Massage (90 min)', null, 690000, 'IDR', 1), ('Traditional Massage', 'Warmstone Massage (90 min)', 'This is a type of massage therapy, give a good warm feeling and relieves muscle points. During a warm stone massage, smooth, flat, heated stones are placed on specific parts of your body.', 690000, 'IDR', 2), ('Traditional Massage', 'Warmstone Massage (120 min)', null, 920000, 'IDR', 3), ('Traditional Massage', 'Syncronitic Massage (60 min)', 'A 4 Hands Massage with two therapists by Balinese Massage technique and the Same Movements of pressure, this Massage is focused On the same movements so that you feel much Calmer.', 890000, 'IDR', 4), ('Traditional Massage', 'Syncronitic Massage (90 min)', null, 1340000, 'IDR', 5), ('Traditional Massage', 'Relaxing Massage (90 min)', 'One of the most Relaxing Massage, Full body Massage With warm oil of essential oil. that’s good For Relaxing your body and Mind.', 690000, 'IDR', 6), ('Traditional Massage', 'Relaxing Massage (120 min)', null, 920000, 'IDR', 7), ('Traditional Massage', 'Herbal Massage (90 min)', 'A therapeutic treatment Combining traditional massage with warm herb-filled, steamed muslin pouches. It blends aroma, heat, and lemongrass to ease deep muscle tension, reduce inflammation and enhance relaxation.', 690000, 'IDR', 8), ('Traditional Massage', 'Herbal Massage (120 min)', null, 925000, 'IDR', 9), ('Thai Massage', 'Thai Massage (90 min)', 'Dry Massage, which uses pressing and stretching like yoga, or the techniques used by chiropractors. For relaxing the whole body on a deeper level to help relieve tension and muscle soreness.', 690000, 'IDR', 0), ('Thai Massage', 'Thai Massage (120 min)', null, 920000, 'IDR', 1), ('Shirodhara', 'Shirodhara Massage (90 min)', 'Classic Ayurvedic therapy, which includes pouring of warm herbal oil on the forehead in a continuous stream that is very effective in promoting physical health and stimulating the mind.', 690000, 'IDR', 0), ('Pregnancy Massage', 'Pregnant Massage (90 min)', 'A calming and Relaxing Massage for pregnant Mothers, combination with gentle Massage techniques.', 650000, 'IDR', 0), ('Pregnancy Massage', 'Pregnant Massage (120 min)', null, 880000, 'IDR', 1), ('Spa Package', 'Balinese Package (120 min)', 'Traditional Balinese Massage (60 Minutes), Pure Natural Facial (60 Minutes)', 835000, 'IDR', 0), ('Spa Package', 'Aromatic Package (150 min)', 'Heaven Aromatherapy massage (60 Minutes), Relaxing foot Massage (60 Minutes), Pure Natural Facial (30 Minutes)', 1075000, 'IDR', 1), ('Spa Package', 'Warm Package (150 min)', 'Warmstone massage (90 Minutes), Relaxing foot massage (30 Minutes), Pure Natural Facial (30 Minutes)', 1105000, 'IDR', 2), ('Spa Package', 'Twin Girl Package (150 min)', 'Zahra Signature massage (60 Minutes), Rice Powder scrub and mask (60 Minutes), Relaxing foot massage (30 Minutes)', 1525000, 'IDR', 3), ('Couple Massage', 'Heaven Couple Package (180 min)', 'Welcome drink with cold towel, Sea salt foot wash, Heaven aromatherapy massage, Rice powder scrub and Body Mask, Pure Natural Facial, Bubble bath, Ginger tea with cookies', 2785000, 'IDR', 0), ('Couple Massage', 'Luxury Couple Package (210 min)', 'Welcome drink with cold towel, Sea salt foot wash, Herbal Balinese massage, Pure Natural facial, Relaxing foot Reflexology, Jacuzzi, Ginger tea with cookies', 3350000, 'IDR', 1), ('Couple Massage', 'Honeymoon Couple Package (240 min)', 'Welcome Drink with Cold Towel, Sea Salt Foot Wash, Zahra Signature massage (4hands), Rice Powder Body Scrub and Body Mask, Pure Natural Facial, Relaxing Foot Massage, Jacuzzi / Flowerbath / Bubble bath', 4550000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'karmaspatherapy.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Karma Spa Therapy treatment prices', 1, 'draft', 'partial', 'https://karmaspatherapy.com/', 'Official Karma Spa Therapy price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '6fc3ccb31061b52a5858fd07cb7cc293a001e27ad48f90375ecdd76cd50941de', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Lomi Lomi', 1), ('Deep Tissue', 2), ('Hot Stone', 3), ('Reflexology', 4), ('Reiki', 5)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Balinese Massage (60 min)', 'Relaxing, traditional spa technique from Bali for ultimate rejuvenation and tranquility. Non strong massage.', 200000, 'IDR', 0), ('Lomi Lomi', 'Lomi Lomi Massage (60 min)', 'Hawaiian technique using both arms, promotes relaxation and balance through rhythmic movements.', 200000, 'IDR', 0), ('Deep Tissue', 'Deep Tissue Massage (60 min)', 'Targets deep muscle layers for intense relaxation.', 250000, 'IDR', 0), ('Hot Stone', 'Hot Stone Massage (60 min)', 'Therapeutic practice using heated stones on the body, promoting relaxation.', 250000, 'IDR', 0), ('Reflexology', 'Foot Reflexology (60 min)', 'Soothes muscles, improves circulation, and enhances overall relaxation for lower extremities.', 200000, 'IDR', 0), ('Reiki', 'Reiki Healing Treatment (60 min)', 'A gentle, non-invasive form of hands-on healing promoting relaxation and general well-being.', 250000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'sakalaresortbali.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'SAMUH BEACH treatment prices', 1, 'draft', 'partial', 'https://www.sakalaresortbali.com/wp-content/uploads/2019/10/MENU-SAMUH-BEACH-min.pdf', 'Official SAMUH BEACH price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '5c37ce26f9e74cdc294b46790d925a5d92225d0e6f543f7a55f79c1fff6ac3c0', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Other', 0), ('Thai Massage', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Other', 'GREEN SALAD', 'Mixed lettuce with tomato cherry vinaigrette balsamic', 70000, 'IDR', 0), ('Other', 'CHICKEN CAESAR SALAD', 'Romaine lettuce, crispy bacon, grilled chicken, crouton parmesan cheese with Caesar dressing', 85000, 'IDR', 1), ('Other', 'CLUB SANDWICH', 'Toasted bread topped with smoked chicken, bacon, ham, lettuce cucumber and cheese, served with potato chip', 95000, 'IDR', 2), ('Other', 'HAM & CHEESE SANDWICH', 'Ham and Cheese in toasted bread served with pot chip and tomato sauce', 95000, 'IDR', 3), ('Other', 'VEGETABLES SANDWICH', 'Grill Vegetables, onion, zucchini, eggplant, capsicum, pesto mayo and pot chip', 80000, 'IDR', 4), ('Other', 'Iced Lemon tea', null, 35000, 'IDR', 5), ('Other', 'Whole Coconut', null, 45000, 'IDR', 6), ('Other', 'Fruit Juices', 'Watermelon, Melon, Orange, Pineapple', 45000, 'IDR', 7), ('Other', 'Soft Drinks', 'Coke, diet coke, Ginger Ale and Sprite', 28000, 'IDR', 8), ('Other', 'Water', 'Sparkling water, RO water', 30000, 'IDR', 9), ('Other', 'Bintang Classic', null, 50000, 'IDR', 10), ('Other', 'Bintang Radler Lemon', null, 50000, 'IDR', 11), ('Other', 'Prost', null, 50000, 'IDR', 12), ('Other', 'Heineken', null, 60000, 'IDR', 13), ('Other', 'Beers Bucket (4 bottles)', 'Bintang Bucket, Prost Bucket', 150000, 'IDR', 14), ('Thai Massage', 'THAI BEEF SALAD', 'Thai stile beef salad with beef tenderloin, onion, tomato, mean leave, mix lettuce, Thai dressing', 90000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'ijenspa.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Ijen Spa treatment prices', 1, 'draft', 'partial', 'https://ijenspa.com/treatments', 'Official Ijen Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '2ea91b0c43b459da66e93a6e5535c7a10cee61e942bed203811b6d1794619329', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Deep Tissue', 0), ('Other', 1), ('Balinese Massage', 2), ('Spa Package', 3), ('Neck & Shoulder', 4), ('Body Mask', 5), ('Foot Massage', 6), ('Acupressure', 7), ('Reflexology', 8), ('Head Massage', 9)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Deep Tissue', 'Deep Tissue (60 min)', 'Firm, focused pressure for chronic tightness and sore muscles', 319000, 'IDR', 0), ('Deep Tissue', 'Deep Tissue (90 min)', 'Firm, focused pressure for chronic tightness and sore muscles', 419000, 'IDR', 1), ('Other', 'Ijen Signature (60 min)', 'Our house ritual — signature full body massage, includes facial mask, aromatherapy & premium oil', 349000, 'IDR', 0), ('Other', 'Ijen Signature (90 min)', 'Our house ritual — signature full body massage, includes facial mask, aromatherapy & premium oil', 449000, 'IDR', 1), ('Other', 'Ijen Full Escape (120 min)', '• Full-body massage — 60 min • Foot massage — 30 min • Body scrub — 30 min • Cold stone eye mask 15% below booking the treatments separately', 550000, 'IDR', 2), ('Other', 'Ijen Body Sculpt (75 min)', '75 minutes of lymphatic drainage and sculpting strokes — reduces puffiness and eases heavy legs', 479000, 'IDR', 3), ('Balinese Massage', 'Balinese (60 min)', 'Traditional long strokes and gentle stretches rooted in local healing', 299000, 'IDR', 0), ('Balinese Massage', 'Balinese (90 min)', 'Traditional long strokes and gentle stretches rooted in local healing', 399000, 'IDR', 1), ('Spa Package', 'Ijen Signature Spa Package (120 min)', '• Full-body massage — 60 min • Body scrub — 30 min • Body mask — 30 min • Facial mask • Aromatherapy oil 15% below booking the treatments separately', 610000, 'IDR', 0), ('Spa Package', 'Ijen Face & Body Ritual (120 min)', '• Full-body massage — 60 min • Face acupressure — 30 min • Herbal foot bath & scrub — 15 min • Facial mask 15% below booking the treatments separately', 575000, 'IDR', 1), ('Neck & Shoulder', 'Neck & Shoulder (30 min)', 'Release tension from work, travel, and daily stress', 179000, 'IDR', 0), ('Neck & Shoulder', 'Neck & Shoulder (60 min)', 'Release tension from work, travel, and daily stress', 299000, 'IDR', 1), ('Body Mask', 'Sun burn Hydrating Body Mask (60 min)', 'Deep hydration & sun burn relief', 399000, 'IDR', 0), ('Foot Massage', 'Foot Massage (30 min)', 'Reflexology-inspired relief for tired feet', 149000, 'IDR', 0), ('Foot Massage', 'Foot Massage (60 min)', 'Reflexology-inspired relief for tired feet', 249000, 'IDR', 1), ('Acupressure', 'Face Acupressure (30 min)', 'Natural lift, better sleep, brighter skin', 199000, 'IDR', 0), ('Acupressure', 'Face Acupressure (45 min)', 'Natural lift, better sleep, brighter skin', 250000, 'IDR', 1), ('Reflexology', 'Foot Reflexology Express (20 min)', 'Quick reflexology boost for tired feet', 99000, 'IDR', 0), ('Head Massage', 'Head Massage Express (20 min)', 'Calm the mind, ease headaches', 99000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'balirelaxing.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The U Spa by Bali Relaxing Resort treatment prices', 1, 'draft', 'partial', 'https://www.balirelaxing.com/spa.php', 'Official The U Spa by Bali Relaxing Resort price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '2b63c7bdca20b757039019eab0d57ac7cf55ee26bd280dfdfc67e27c6e1ea269', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Aromatherapy', 1), ('Thai Massage', 2), ('Hot Stone', 3), ('Traditional Massage', 4), ('Reflexology', 5), ('Javanese Lulur', 6), ('Other', 7), ('Spa Package', 8), ('Facial', 9), ('Body Scrub', 10), ('Body Mask', 11)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Balinese Massage (90 min)', 'Its unique blend of deep stroke massage and pressure point to reduce stress muscle aches.', 650000, 'IDR', 0), ('Aromatherapy', 'Aromatherapy Massage (90 min)', 'The inhaled aroma from essential oil heightens your senses with soft to medium pressure.', 650000, 'IDR', 0), ('Thai Massage', 'Thai Massage (90 min)', 'Thai style massage that involves stretching and deep massage. No oil are used in Thai massage.', 650000, 'IDR', 0), ('Hot Stone', 'Hot Stone Massage (90 min)', 'Heated stones are placed along the strategic energy points on the back of the body. Combination with the traditional massage to relax the muscles.', 650000, 'IDR', 0), ('Traditional Massage', 'Stress Reliever Massage (45 min)', 'It can reduce the tension, pain in shoulder, neck and back of the body.', 350000, 'IDR', 0), ('Reflexology', 'U Spa Reflexology Massage (45 min)', 'A foot massage that increases circulation and rebalancing of the body''s energy system.', 350000, 'IDR', 0), ('Javanese Lulur', 'Javanese Lulur (120 min)', 'This luxurious treatment starts with a traditional massage and continues with exfoliation scrub, followed by yogurt rub down. A smoothing soak in scented flower bath & ginger tea to complete the treatment.', 850000, 'IDR', 0), ('Other', 'Wine Spa (120 min)', 'This unique treatment uses the rose wine promoting more youthful and beautiful skin. It''s a mixture of massage and body scrub.', 925000, 'IDR', 0), ('Other', 'The Heaven (120 min)', 'This package is a combination of Balinese massage and Refreshing facial.', 925000, 'IDR', 1), ('Spa Package', 'The U Spa Ritual (180 min)', 'Refresh and renew with combination of our signature treatment, starting from foot bath ritual. Balinese Massage, green tea body scrub, seaweed body mask, Refreshing facial, and flower bath to complete the ritual.', 1545000, 'IDR', 0), ('Facial', 'Refreshing Facial (45 min)', 'Softening and rejuvenating the skin.', 655000, 'IDR', 0), ('Body Scrub', 'Milk Body Scrub (45 min)', 'Cleans, enriches and revitalizes the skin.', 455000, 'IDR', 0), ('Body Mask', 'Seaweed Body Mask (45 min)', 'The benefit firms the body and reduces cellulite.', 455000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'calmaspabali.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Calma Spa Jimbaran treatment prices', 1, 'draft', 'partial', 'https://calmaspabali.com/services-3', 'Official Calma Spa Jimbaran price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'af6edff1c03ec9abb7cb8c6f8b724f1252b984011b0ec462a7b1b19e284c43dc', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Aromatherapy', 1), ('Foot Massage', 2), ('Acupressure', 3), ('Traditional Massage', 4), ('Hot Stone', 5), ('Pregnancy Massage', 6), ('Body Scrub', 7), ('Javanese Lulur', 8), ('Balinese Boreh', 9), ('Body Wrap', 10), ('Other', 11), ('Facial', 12), ('Spa Package', 13)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Balinese Massage (60 min)', 'This relaxing massage has been handed down through generation. The techniques of rolling, long kneading strokes, acupressure and foot massage are believed to renew, strengthen and heal the body.', 450000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage (60 min)', 'Traditional massage using gentle pressure to relieve tension and ease muscle pain.', 250000, 'IDR', 1), ('Aromatherapy', 'Aromatherapy Massage (60 min)', 'Relieves stress, muscle tension and aches in problem areas while deep strokes and cross-fiber massage techniques stimulate overall blood circulation. Signature Calming Massage Oil and aromatherapy are applied during this treatment.', 450000, 'IDR', 0), ('Aromatherapy', 'Aromatherapy and Essential Oil Massage (90 min)', 'Relaxing massage with essential oils to improve well-being and decrease stress.', 350000, 'IDR', 1), ('Foot Massage', 'Foot Massage (60 min)', 'Signature Foot Massage. Massage acupressure point on the foot to restore balance and alleviate the body from build-up toxins.', 400000, 'IDR', 0), ('Acupressure', 'Acupressure Massage (60 min)', 'Based on acupressure theories of energy meridian, this pressure point massage is effective in relieving tension, headache and backaches. This massage focuses more on the back & shoulder. No oil is used in this full-body, firm-pressure massage.', 450000, 'IDR', 0), ('Traditional Massage', 'Tension Relief Massage (60 min)', 'Special massage for neck, shoulder and back of the body with combinations between Swedish, Indonesian and Hawaiian massages.', 450000, 'IDR', 0), ('Hot Stone', 'Hot Stone Massage (60 min)', 'This specialty massage is where a therapist combines full-body massage and followed by using smooth heated stones as an extension of the therapist’s own hands and placing them on key points of the body. The heat is useful to loosen tight muscles and give deep relaxing sensation.', 450000, 'IDR', 0), ('Hot Stone', 'Calma’s Hot Stone Spa (120 min)', 'Warm stones are aligned on your body key points, it’s used to help you relax and ease tense muscles and damaged soft tissues throughout your body. The heated basalt stone helps loosen muscle tension, improve blood circulation, promote good sleep, reduce stress and anxiety. It may help relieve symptoms of autoimmune disease and boost immunity.', 950000, 'IDR', 1), ('Pregnancy Massage', 'Calma’s Pregnancy Massage (60 min)', 'Special combination of three styles of massage Swedish, Thai and Japanese Shiatsu. Also suitable for women in early pregnancy.', 450000, 'IDR', 0), ('Body Scrub', 'Garden Scrub (60 min)', 'This treatment uses unique blend of ingredients to produce a cleaning and replenishing body scrub made from ground coffee beans, rice powder and other ingredients. This fine powder is mixed to form a paste, and is used to cleanse the pores and exfoliate dead skin particles. It may sound harsh, but the feeling is very soothing- cleansing relaxing. The treatment is concluded with soothing body lotio', 500000, 'IDR', 0), ('Body Scrub', 'Traditional Sea Salt Scrub (120 min)', 'For a total cleansing and toning treatment, this procedure involves a traditional Balinese massage combined with sea salt and oils, scrub to clean the skin, remove dead cells and impurities. The scrub is followed by a relaxing bath and essential oils. A cup of healthy beverage is served along the warm herbal bath session.', 850000, 'IDR', 1), ('Body Scrub', 'Body Scrub (90 min)', 'An exfoliating treatment that begins with a full body massage.', 300000, 'IDR', 2), ('Javanese Lulur', 'Lulur Bali (120 min)', 'Our Lulur Bali combines a Javanese ritual and the ultimate in pampering. First, a relaxing Balinese massage, then exfoliation with traditional ingredients, herb and spices that were specially blended for this ritual. Following the scrub, indulge in splash of milk body polish and enjoy a cup of healthy beverage is served as you relax in a warm soothing soak in flower bath.', 850000, 'IDR', 0), ('Javanese Lulur', 'Calma’s Java Lulur Spa (120 min)', 'The best & most well-known traditional spa throughout the world of traditional spa. Adapted from a Javanese Royal princess ritual. The Ritual begins with a footbath, a 60-min Balinese massage, “Lulur” Bali scrub, hot or cold shower & warm soak in a flower milk bath.', 950000, 'IDR', 1), ('Balinese Boreh', 'Boreh Bali (120 min)', 'This treatment combines a full body massage and curative body mask made from grounded natural & herbal ingredients. Our traditional Balinese treatment is perfect for relieving muscle aches and pains, stimulate better metabolism and add extra immunity. After the body mask application, guest will be wrapped in a blanket to allow the therapeutic properties of the mask to take effect, during which gue', 850000, 'IDR', 0), ('Balinese Boreh', 'Calma’s Boreh Bali Spa (120 min)', 'An ancient Balinese remedy created from botanical and herbal ingredients to increase your body immune, refreshing and energizing. It begins with a footbath, 60-min Balinese massage, Boreh Bali body mask, warm shower & warm soak in an Herbal bath. Enjoy signature healthy hot herbal tea before ending the ritual.', 950000, 'IDR', 1), ('Body Wrap', 'Aloe Avocado Wrap (60 min)', 'Hydrating luxuries blend of fresh avocado & aloe gel as the key ingredients. This soothing & energizing mask applied to the body and wrapped in banana leaves to cool soothe the body. Excellent for reconditioning and regeneration on sun burn skins. Treatment is finished with an application of moisturizing body lotion.', 500000, 'IDR', 0), ('Other', 'Calma’s Reborn Collagen (120 min)', 'Our Collagen Modern technology meets traditional treatment creating ultimate renewing and refreshing body treatment to make your whole skin reborn again. Enjoy Herbal tea in a warm flower bath after milk body mask. Ritual begin with foot bath, Signature Massage with Collagen Scrub, Milk body mask, Calma Signature Flower Bath, warm water shower & healthy beverages.', 850000, 'IDR', 0), ('Other', 'Calma’s Traditional Creambath (90 min)', 'Calma’s traditional hair treatment begin with back massage for our 90 min duration or full body massage for our 120 min duration and relaxing creambath by our therapist. Signature massage oil. It begins with a footbath, Body massage, continued with the creambath ritual, relaxing and energizing treatment for your hair.', 625000, 'IDR', 1), ('Other', 'Sense of Healing (120 min)', 'Refreshing two hours spa treatment with aroma therapy foot bath, garden scrub & foot massage. It begins with a footbath, 60 min foot massage, back massage, coffee scrub and warm shower (no bathtub session).', 850000, 'IDR', 2), ('Other', 'Calma Sparkling You (120 min)', 'Aroma therapy massage, manicure or pedicure set you ready to go for a great time. Our signature aroma therapy massage oil is all natural product created just for Calma Spa Jimbaran. It’s begin with footbath, 60 min aroma therapy massage (our signature oil), then Calma’s manicure or pedicure (both no polish), finished with warm water shower (no bathtub session).', 650000, 'IDR', 3), ('Other', 'Calma Spa Blessing Bliss (180 min)', 'As our anti-cellulite treatment, light & easy treatment to refresh your body and soul, escape for a moment from your daily activity. Signature massage oil, scrub & facial are applied in this treatment. It begins with a footbath, full body massage, signature coffee scrub, warm shower & warm soak in a flower bath. Calma’s facial with Biokos by Martha Tilaar facial product.', 1200000, 'IDR', 4), ('Other', 'Calma’s Young Indulgence (90 min)', 'Introduction to a pampering 90-min treatment, they will be refreshed and ready for another activity. 45-minute back, foot or shoulder massage, 45-minute manicure & pedicure without nail polish. Warm shower, a goodie bag or a snack for them.', 575000, 'IDR', 5), ('Other', 'Indulging Romantic SPA DAY (210 min)', 'Boosting the mood for a special occasion, celebration or other self-rewarding indulgence, our romantic package is the one you and your loved one will definitely enjoy. Our Signature product with a great therapist is to deliver intense romance feeling during treatment. Romantic lighting, aroma therapy, healthy meal and healthy beverages will be included.', 2850000, 'IDR', 6), ('Facial', 'Massage & Traditional Facial (120 min)', 'It’s begin with footbath, 60 min full body massage (our signature oil) based on your choice, then Traditional facial, finished with warm water shower (no bathtub session). Enjoy signature healthy hot herbal tea at the end of the ritual.', 850000, 'IDR', 0), ('Spa Package', 'Bali Darling Ritual by Sensatia Botanicals (180 min)', 'Full-body massage, sea salt scrub & signature facial. Aromatherapy foot bath and 60-minute Calma’s Signature Massage to begin the ritual. 30-minute Seaside Citrus Sea Salt Scrub, made with organic sea salt harvested on the east coast of Bali, this mineral-rich body scrub exfoliates to remove excess dirt and rejuvenate the skin. The active botanical from lavender, rosemary and white grapefruit adds', 1350000, 'IDR', 0), ('Spa Package', 'Calma’s Satyam Ritual (240 min)', 'Our Lulur Bali combines a Javanese ritual and the ultimate in pampering. First a relaxing Balinese massage, then exfoliating scrub, indulge in hot or cold shower and a healthy beverage is served as you relax in a warm soothing soak flower milk bath. Begin with foot bath, full body massage, revitalizing foot massage, Calma’s Signature “Java Lulur” scrub, hot or cold shower, energizing flower milk b', 1550000, 'IDR', 1), ('Spa Package', 'Calma’s Siwam Ritual (300 min)', 'This treatment combines a full body massage and curative body mask made from grounded natural & herbal ingredients. Our traditional Balinese treatment is perfect for relieving muscle aches and pains. After the body mask application, guest will be wrapped in a blanket to allow the therapeutic properties of the mask to take effect, during which guest will receive a calming head face massage. Treatme', 1850000, 'IDR', 2), ('Spa Package', 'Calma’s Sundaram Ritual (360 min)', 'For a total cleansing and toning treatment, this procedure involves a traditional Balinese massage combined with sea salt and oils, scrub to clean the skin, remove dead cells and impurities. The scrub is followed by a relaxing bath and essential oils. A cup of healthy beverage is served along the warm herbal bath session. Treatment sequenced as follows: foot bath, full body Balinese massage, Revit', 2150000, 'IDR', 3), ('Spa Package', 'Yours & Mine Spa PACKAGE (150 min)', 'Dedicated to re-energize you and your partner while sharing a quality time together. Special DETOXification treatment to rejuvenate both body & mind at the same time and prepare for an intimate time after treatment. A set of Signature products that we use for this treatment is created to boost positive vibes between a couple.', 2100000, 'IDR', 4), ('Spa Package', 'Glowing Pre wedding Spa PACKAGE (300 min)', 'A full-pampering signature product and treatment for a lovely couple. Full of romance and intimacy vibes. Indulge yourself and your loved ones before the vow, a happy and once-in-a-lifetime event.', 4000000, 'IDR', 5), ('Spa Package', 'Signature Spa Package (120 min)', 'Includes a combination of body treatment and massage for full rejuvenation.', 500000, 'IDR', 6)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'bamboospabali.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Bamboo Spa treatment prices', 1, 'draft', 'partial', 'https://www.bamboospabali.com/', 'Official Bamboo Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '29f4a1a68f4705d9ce61fc74cce59d150192dcb5f55de70ffc986ac0b8c2fa71', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Reflexology', 0), ('Couple Massage', 1), ('Traditional Massage', 2), ('Body Scrub', 3), ('Body Wrap', 4), ('Other', 5)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Reflexology', 'Foot Reflexology (60 min)', 'Foot reflexology works on the principle that all body organs are represented at the feet. By applying pressure to various points on the soles, the reflex nerves are stimulated.', 350000, 'IDR', 0), ('Couple Massage', 'Foot Reflexology for Couples (60 min)', 'Foot reflexology works on the principle that all body organs are represented at the feet.', 600000, 'IDR', 0), ('Traditional Massage', 'Soothing Natural Gel Aloe Vera Massage (75 min)', 'Aloe Vera is the gold standard treatment for sunburns and number one ingredient you need to soothe rash and skin irritations.', 700000, 'IDR', 0), ('Body Scrub', 'Delicious Body Scrub (45 min)', 'A choice of Bamboo Spa Signature body scrub will help to keep your skin soft, smooth, healthy and well nourished.', 400000, 'IDR', 0), ('Body Wrap', 'Delicious Body Wrap (45 min)', 'An expert body wrap to tone the skin, stimulate fat release and promote toxins'' elimination.', 400000, 'IDR', 0), ('Other', 'Try Me Love Me (165 min)', 'Select your favourite Body Massage and continue with Immortelle Secret of Youth Facial.', 2250000, 'IDR', 0), ('Other', 'Promenade (150 min)', 'Select your favorite Body Massage followed by the body scrub of your choice, then soak your body in a Floral Bubble Bath and continue with a glowing express Facial.', 2000000, 'IDR', 1), ('Other', 'Verbena Bamboo Fusion Therapy (60 min)', 'This Fusion Therapy is a specialized massage using traditional Balinese bamboo to stimulate the flow of energy within the body.', 1350000, 'IDR', 2), ('Other', 'Verbena Bamboo Well-being Escape (120 min)', 'A holistic treatment including exfoliation and a signature massage.', 2416500, 'IDR', 3), ('Other', 'Secret of Verbena Bamboo Deluxe (180 min)', 'A luxurious body treatment with a customized facial.', 3051000, 'IDR', 4), ('Other', 'Shea Ultra-Moisturizing Experience (120 min)', 'This Shea ultra-moisturizing treatment leaves skin perfectly nourished.', 2416500, 'IDR', 5), ('Other', 'Almond Silhouette Reshape Program (120 min)', 'An ideal treatment for new moms, focusing on areas with cellulite and fatty deposits.', 2416500, 'IDR', 6), ('Other', 'Try Me Love Me (165 min)', 'Favorite Body Massage 90 min + Immortelle Facial 75 min.', 1818000, 'IDR', 7), ('Other', 'Journey to Provence (135 min)', 'Aromachologie massage followed by customized facial.', 2095000, 'IDR', 8), ('Other', 'Verbena Bamboo Fusion Therapy (60 min)', 'Signature massage using heated bamboo and verbena oil.', 1091000, 'IDR', 9), ('Other', 'Promenade (150 min)', 'Massage, scrub, floral bubble bath, and express facial.', 1616000, 'IDR', 10), ('Other', 'Verbena Bamboo Well-being Escape (120 min)', 'Body polish, foaming bath, and Verbena Bamboo Fusion Therapy.', 1953000, 'IDR', 11)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'dewave.id' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'De WAVE Family Massage & Beauty Salon treatment prices', 1, 'draft', 'partial', 'https://www.dewave.id/post/de-wave-family-massage-beauty-salon-akan-hadir-di-palangka-raya-dengan-treatment-lebih-lengkap', 'Official De WAVE Family Massage & Beauty Salon price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'cb143158eebe5380780593ae89517e61d6ecfe41eef109991eaa4da63c06197d', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Traditional Massage', 0), ('Aromatherapy', 1), ('Reflexology', 2), ('Other', 3)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Traditional Massage', 'full body massage (60 min)', 'Merilekskan seluruh otot yang lelah', 100000, 'IDR', 0), ('Traditional Massage', 'Bio Massage (60 min)', 'Menggabungkan teknik pijat profesional dan bioenergi', 150000, 'IDR', 1), ('Aromatherapy', 'aromatherapy massage (60 min)', 'Memanjakan indera dengan aroma terapi pilihan', 120000, 'IDR', 0), ('Reflexology', 'reflexology (60 min)', 'Treatment kesehatan melalui titik-titik refleksi', 80000, 'IDR', 0), ('Other', 'beauty treatment (60 min)', 'Perawatan tubuh atau wajah yang mendalam', 200000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'anantara.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Anantara Spa treatment prices', 1, 'draft', 'partial', 'https://www.anantara.com/uploads/minor/anantara/documents/anantara-uluwatu-bali-resort/spa/spa-menu--price-list-2022.pdf', 'Official Anantara Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'b80201aaa05b25df04007baf7053c882a6080b4f61343a1278608b5fcf2a8d25', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Other', 0), ('Traditional Massage', 1), ('Balinese Massage', 2), ('Deep Tissue', 3), ('Reflexology', 4), ('Body Scrub', 5), ('Detox Treatment', 6), ('Couple Massage', 7)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Other', 'Borneo Island Odyssey (120 min)', 'A rich, invigorating scrub of Bornean black rice, cloves and flowers.', 1700000, 'IDR', 0), ('Other', 'Bali Island Indulgence (150 min)', 'A rejuvenating experience with various treatments.', 1800000, 'IDR', 1), ('Other', 'Make up', 'Professional makeup service.', 1500000, 'IDR', 2), ('Traditional Massage', 'Anantara Signature Massage (90 min)', 'A blend of oil combined with purposeful movements to stimulate circulation.', 1200000, 'IDR', 0), ('Traditional Massage', 'Anantara Signature Massage (90 min)', 'Our signature blend of oil, combined with purpose-designed movements, stimulates circulation and promotes deep relaxation, all whilst restoring the flow of energy, or prana, along the meridian lines.', 4950000, 'IDR', 1), ('Balinese Massage', 'Authentic Balinese Massage (60 min)', 'Kneading Balinese floral oil into your body to relieve tension.', 1000000, 'IDR', 0), ('Deep Tissue', 'Deep Tissue Massage (90 min)', 'A vigorous remedy that uses classic Swedish strokes.', 1200000, 'IDR', 0), ('Reflexology', 'Foot Reflexology (60 min)', 'Physical renewal through reflex points on the feet.', 750000, 'IDR', 0), ('Body Scrub', 'Pevonia Mango and Passion Fruit Body Scrub (60 min)', 'Divine aroma of tropical fruits for smooth skin.', 950000, 'IDR', 0), ('Detox Treatment', 'Detox IV', 'Boost your immune system with antioxidants.', 2500000, 'IDR', 0), ('Couple Massage', 'Sunset Couple''s blessing and healing ritual (90 min)', 'Share a memorable journey for two under the guidance of High Priestess Ibu Jero. Ideal for engagements, weddings or anniversary celebrations, move forward together through a past life and chakra cleanse, calming water purification, and traditional Balinese offering ceremony.', 4200000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'massageuluwatu.id' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Professional Massage Uluwatu treatment prices', 1, 'draft', 'partial', 'https://massageuluwatu.id/', 'Official Professional Massage Uluwatu price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '166262d76d0079407e06cef302c434974e49e0e4826b781cb773268ff95cfe45', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Traditional Massage', 1), ('Spa Package', 2), ('Hot Stone', 3), ('Foot Massage', 4), ('Flower Bath', 5)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Traditional Balinese Massage (60 min)', 'Classic Balinese massage in Uluwatu perfect for relaxation and recovery', 400000, 'IDR', 0), ('Traditional Massage', 'Deep Healing Massage Uluwatu (90 min)', 'Intensive spa treatment combining deep tissue work with traditional healing.', 550000, 'IDR', 0), ('Traditional Massage', '60-minute traditional massage (60 min)', 'Classic Balinese massage in Uluwatu perfect for relaxation and recovery.', 400000, 'IDR', 1), ('Traditional Massage', 'Deep Healing Massage Uluwatu (90 min)', 'Intensive spa treatment Uluwatu combining deep tissue work with traditional healing.', 550000, 'IDR', 2), ('Spa Package', 'Sacred Temple Massage Uluwatu Ritual (120 min)', 'Sacred spa treatment inspired by ancient temple healing traditions.', 750000, 'IDR', 0), ('Spa Package', 'Sacred Temple Massage Uluwatu Ritual (120 min)', 'Sacred spa treatment Uluwatu inspired by ancient temple healing traditions.', 750000, 'IDR', 1), ('Hot Stone', 'Volcanic Hot Stone Ritual', null, 200000, 'IDR', 0), ('Hot Stone', 'Volcanic Hot Stone Ritual', 'Therapeutic volcanic stones used in traditional Balinese medicine.', 200000, 'IDR', 1), ('Foot Massage', 'Balinese Foot Blessing Ceremony', null, 150000, 'IDR', 0), ('Foot Massage', 'Balinese Foot Blessing Ceremony', null, 150000, 'IDR', 1), ('Flower Bath', 'Sacred Flower Bath Experience', null, 300000, 'IDR', 0), ('Flower Bath', 'Sacred Flower Bath Experience', null, 300000, 'IDR', 1)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'theistana.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Istana Spa treatment prices', 1, 'draft', 'partial', 'https://theistana.com/facilities/spa/', 'Official The Istana Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '383416f2d282d595a84cc9413666c90a01301b8fff6955c4e27398d7154d1494', 'spa'
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
join (values ('Other', 'Morning Spa Session 1 (120 min)', null, 220000, 'IDR', 0), ('Other', 'Morning Spa Session 2 (120 min)', null, 330000, 'IDR', 1), ('Other', 'Afternoon Spa Session - Regular (150 min)', null, 380000, 'IDR', 2), ('Other', 'Afternoon Spa Session - Peak Times (Friday, Saturday, Sunday) (150 min)', null, 440000, 'IDR', 3), ('Other', 'Evening Spa Session - Regular (180 min)', null, 380000, 'IDR', 4), ('Other', 'Evening Spa Session - Peak Times (Friday, Saturday, Sunday) (180 min)', null, 440000, 'IDR', 5), ('Other', 'Midnight Spa Session (150 min)', null, 550000, 'IDR', 6)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'winbalispa.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Win Bali Spa treatment prices', 1, 'draft', 'partial', 'https://winbalispa.com/spa-treatments', 'Official Win Bali Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '49767faaf3cc4b30ca1c4998d4896e731637380603d119bd61a7153d2f61ba64', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Neck & Shoulder', 0), ('Reflexology', 1), ('Foot Massage', 2), ('Balinese Massage', 3), ('Head Massage', 4), ('Traditional Massage', 5), ('Pregnancy Massage', 6), ('Shiatsu', 7), ('Deep Tissue', 8), ('Lomi Lomi', 9), ('Thai Massage', 10), ('Ear Candle', 11)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Neck & Shoulder', 'Back & Neck Shoulder (60 min)', null, 180000, 'IDR', 0), ('Neck & Shoulder', 'Back & Neck Shoulder', null, 180000, 'IDR', 1), ('Reflexology', 'Foot Reflexology (60 min)', null, 180000, 'IDR', 0), ('Foot Massage', 'Foot & Back Massage (60 min)', null, 180000, 'IDR', 0), ('Foot Massage', 'Foot & Back Massage', null, 180000, 'IDR', 1), ('Balinese Massage', 'Balinese Massage (60 min)', null, 190000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage (90 min)', null, 275000, 'IDR', 1), ('Balinese Massage', 'Balinese Massage (120 min)', null, 370000, 'IDR', 2), ('Balinese Massage', 'Balinese Massage', null, 190000, 'IDR', 3), ('Head Massage', 'Head & Face Massage (60 min)', null, 190000, 'IDR', 0), ('Traditional Massage', 'Anticellulite Massage (60 min)', null, 220000, 'IDR', 0), ('Traditional Massage', 'Aromatheraphy Massage (60 min)', null, 220000, 'IDR', 1), ('Traditional Massage', 'Warmstone Massage (90 min)', null, 320000, 'IDR', 2), ('Traditional Massage', '4 Hand Massage (60 min)', null, 370000, 'IDR', 3), ('Pregnancy Massage', 'Pregnant Massage (60 min)', null, 190000, 'IDR', 0), ('Shiatsu', 'Shiatsu Massage (60 min)', null, 220000, 'IDR', 0), ('Deep Tissue', 'Deep Tissue Massage (60 min)', null, 220000, 'IDR', 0), ('Lomi Lomi', 'Lomi - Lomi Massage (60 min)', null, 220000, 'IDR', 0), ('Thai Massage', 'Thai Massage (90 min)', null, 320000, 'IDR', 0), ('Ear Candle', 'Ear Candle (30 min)', null, 135000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'zahraspauluwatu.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Zahra Spa Uluwatu treatment prices', 1, 'draft', 'partial', 'https://zahraspauluwatu.com/treatments/', 'Official Zahra Spa Uluwatu price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '156c9dd2e01cde5b7769b1e5e9652442d4321afdf4f25edd0f5de17600ec5345', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Neck & Shoulder', 0), ('Foot Massage', 1), ('Head Massage', 2), ('Reflexology', 3), ('Balinese Massage', 4), ('Traditional Massage', 5), ('Aromatherapy', 6), ('Pregnancy Massage', 7), ('Shiatsu', 8), ('Thai Massage', 9), ('Lomi Lomi', 10), ('Deep Tissue', 11), ('Ear Candle', 12), ('Facial', 13), ('Body Scrub', 14)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Neck & Shoulder', 'Back & Neck Shoulder (60 min)', null, 250000, 'IDR', 0), ('Foot Massage', 'Foot & Back Massage (60 min)', null, 250000, 'IDR', 0), ('Head Massage', 'Head & Face Massage (60 min)', null, 250000, 'IDR', 0), ('Reflexology', 'Reflexology (60 min)', null, 250000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage (60 min)', null, 295000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage (90 min)', null, 435000, 'IDR', 1), ('Balinese Massage', 'Balinese Massage (120 min)', null, 580000, 'IDR', 2), ('Traditional Massage', 'Anticelullite Massage (60 min)', null, 325000, 'IDR', 0), ('Traditional Massage', 'Anticelullite Massage (90 min)', null, 475000, 'IDR', 1), ('Traditional Massage', 'Warmstone Massage (90 min)', null, 475000, 'IDR', 2), ('Traditional Massage', '4 Hand Massage (60 min)', null, 590000, 'IDR', 3), ('Traditional Massage', 'Aloe Vera Massage (60 min)', null, 300000, 'IDR', 4), ('Traditional Massage', 'Child Body Massage (60 min)', null, 245000, 'IDR', 5), ('Aromatherapy', 'Aromatherapy Massage (60 min)', null, 325000, 'IDR', 0), ('Pregnancy Massage', 'Pregnant Massage (60 min)', null, 295000, 'IDR', 0), ('Shiatsu', 'Shiatsu Massage (60 min)', null, 325000, 'IDR', 0), ('Thai Massage', 'Thai Massage (60 min)', null, 325000, 'IDR', 0), ('Lomi Lomi', 'Lomi - Lomi Massage (60 min)', null, 325000, 'IDR', 0), ('Deep Tissue', 'Deep Tissue Massage (60 min)', null, 325000, 'IDR', 0), ('Ear Candle', 'Ear Candle', null, 165000, 'IDR', 0), ('Facial', 'Traditional Facial (60 min)', null, 275000, 'IDR', 0), ('Body Scrub', 'Body Scrub & Body Mask (60 min)', null, 250000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'atmos-steam.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'ATMOS BodyLab treatment prices', 1, 'draft', 'partial', 'https://atmos-steam.com/bali/bodylab', 'Official ATMOS BodyLab price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '99653d8c38fdb94138f1c64dfa7c15cd404be5235850e3022abbec778ad8cec6', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Deep Tissue', 0), ('Traditional Massage', 1), ('Recovery', 2)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Deep Tissue', 'Deep Tissue Massage (60 min)', 'Designed for muscle tension, surf recovery and post-training stiffness.', 800000, 'IDR', 0), ('Traditional Massage', 'Relaxation Massage (60 min)', 'Tailored for a serene and grounded experience.', 700000, 'IDR', 0), ('Traditional Massage', 'Signature Massage (90 min)', 'Blends multiple therapeutic techniques for deeper muscular release.', 1000000, 'IDR', 1), ('Recovery', 'Recovery Massage (60 min)', 'Focused on muscle recovery and nervous system reset.', 750000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'oazabali.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'OAZA Uluwatu treatment prices', 1, 'draft', 'partial', 'https://oazabali.com/uluwatu/', 'Official OAZA Uluwatu price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'ff00850f3544871511a4a59b6e28ae093a9b99aa010850660c2390fd24324366', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Other', 0), ('Facial', 1), ('Traditional Massage', 2), ('Spa Package', 3), ('Hot Stone', 4)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Other', 'Oaza Face & Body Retreat (130 min)', 'Full-body massage, signature facial, and footbath — all in one session.', 600000, 'IDR', 0), ('Other', 'Peak Performance (120 min)', 'Deep-tissue work for active guests — surfers, hikers, anyone carrying chronic muscle tightness.', 350000, 'IDR', 1), ('Other', 'Oaza Thermal Therapy (60 min)', 'Herbal bag heat followed by cold mask and cucumber. Includes a face mask.', 275000, 'IDR', 2), ('Other', 'Premium Feet & Sole Relief', 'Scrub, foot bath, and targeted massage for tired arches.', 210000, 'IDR', 3), ('Other', '60 Minutes Thermal Therapy (60 min)', 'Full heated herbal bag body massage, Aromatherapy oil selection, Post-treatment tea & snack', 350000, 'IDR', 4), ('Other', '90 Minutes Thermal Therapy (90 min)', 'Extended heated herbal bag body massage, Icy cool facial mask, Aromatherapy oil selection, Post-treatment tea & snack', 510000, 'IDR', 5), ('Other', '120 Minutes Thermal Therapy (120 min)', 'Full heated herbal bag body massage, Icy cool facial mask, Scalp & neck treatment, Aromatherapy oil selection, Post-treatment tea & snack', 650000, 'IDR', 6), ('Facial', 'The Oaza™ Facial (75 min)', 'Our signature facial with lip mask included. Deep cleanse, extraction, customized mask.', 525000, 'IDR', 0), ('Traditional Massage', 'Four-Hand Massage', 'Two therapists in complete sync.', 470000, 'IDR', 0), ('Spa Package', 'Glow Ritual (90 min)', 'Full-body renewal from head to toe. Includes scrub, body mask, footbath, and head massage.', 535000, 'IDR', 0), ('Hot Stone', 'Hot Stone Massage', 'Heated smooth basalt stones placed along the spine.', 350000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'pelangivillassidemen.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Pelangi Villa Sidemen treatment prices', 1, 'draft', 'partial', 'https://pelangivillassidemen.com/experience/', 'Official Pelangi Villa Sidemen price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'cb5e64bb4d9e9541e7cb3ef5716495c63cccba0a4f813614625bebbaf215face', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Yoga', 1), ('Other', 2)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Balinese Vegan Cooking Class', 'Discover the unique art of Balinese cooking with our specialty cooking class, hosted in our very own organic garden. You will be taken on an exciting journey from harvesting the fresh ingredients, to cooking with traditional techniques and utensils, using generations-old recipes with a delicious vegan twist.', 650000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage 60 mins (60 min)', null, 300000, 'IDR', 1), ('Balinese Massage', 'Balinese Massage 90 mins (90 min)', null, 400000, 'IDR', 2), ('Balinese Massage', 'Balinese Massage 150 mins (150 min)', null, 600000, 'IDR', 3), ('Yoga', 'Private Yoga Class (Hatha Vinyasa / Qigong / Yin Yoga) (90 min)', 'The strong spirituality of the Sidemen village makes it perfect for an atmospheric Yoga and Qigong session to heal your senses. The class will be taught by a certified and experienced instructor. Price includes deep meditation session and usage of all props.', 700000, 'IDR', 0), ('Other', 'Easy 3-hour Sidemen Village Trekking (180 min)', 'Witness the true beauty of the Sidemen village and its secret spots with this easy 3-hour village trekking. You will get to see the stunning views the rice fields, mountains, river, and temples. Price includes bottled water and fresh whole coconut upon returning to the resort.', 500000, 'IDR', 0), ('Other', 'Mount Agung Sunrise Trekking', 'For when you are feeling adventurous – why not try climbing to the highest point of Bali? Climbing Mount Agung is a challenge in its own but accomplish it and you will be rewarded with unmatched views of the rising sun. Rate includes personalised English speaking guide, boxed breakfast, drinking water, donations and relaxing massage upon returning to the property.', 1100000, 'IDR', 1), ('Other', 'White Water Rafting at Telaga Waja River', 'For the adrenaline junkies – experience a thrilling adventure in one of the most famous rafting venues in Bali, the White Water Rafting at the Telaga Waja River. Includes all rafting equipments and lunch.', 450000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'riversidespabyulaman.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Riverside Spa at Ulaman treatment prices', 1, 'draft', 'partial', 'https://riversidespabyulaman.com/treatments', 'Official Riverside Spa at Ulaman price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '694c0dbd7319c9d84ef7853fb41b0a8850c49fda62d3b9c4641ad122d650f1b1', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Lomi Lomi', 1), ('Other', 2), ('Lymphatic Massage', 3), ('Four Hands Massage', 4), ('Hot Stone', 5), ('Aromatherapy', 6), ('Foot Massage', 7), ('Scalp Treatment', 8), ('Body Scrub', 9), ('Javanese Lulur', 10), ('Body Wrap', 11), ('Balinese Boreh', 12)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Balinese Massage (60 min)', 'Experience our most popular Balinese massage, meticulously crafted to soothe your entire body. Our skilled therapists use gentle yet firm strokes that seamlessly glide along your muscles, guiding circulation toward your heart for ultimate relaxation and rejuvenation.', 750000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage (90 min)', 'Experience our most popular Balinese massage, meticulously crafted to soothe your entire body. Our skilled therapists use gentle yet firm strokes that seamlessly glide along your muscles, guiding circulation toward your heart for ultimate relaxation and rejuvenation.', 900000, 'IDR', 1), ('Balinese Massage', 'Balinese Sea Salt (50 min)', 'Produced in the east of Bali, where the manufacturing process has a rich history, sea salt is a wonderful exfoliant that softens the skin, removes flakiness, and infuses the upper layer of the skin with vitamins and minerals. This treatment concludes with a cucumber conditioner.', 850000, 'IDR', 2), ('Lomi Lomi', 'Lomi Lomi (75 min)', 'Experience the power of Lomi-Lomi, our most intense massage inspired by Hawaiian tradition. This technique is renowned for its long, rhythmic strokes utilizing forearms and elbows to apply deep pressure and intensity.', 900000, 'IDR', 0), ('Lomi Lomi', 'Lomi Lomi (90 min)', 'Experience the power of Lomi-Lomi, our most intense massage inspired by Hawaiian tradition. This technique is renowned for its long, rhythmic strokes utilizing forearms and elbows to apply deep pressure and intensity.', 1100000, 'IDR', 1), ('Other', 'Ulaman Esalen (75 min)', 'Ulaman Esalen massage integrates a holistic approach to massage therapy, blending techniques like lomi-lomi, stretching, long flowing strokes, gentle rocking and passive joint movements. This combination creates a deeply relaxing and nurturing experience, emphasizing the mind-body connection for enhanced relaxation, stress relief, and overall well-being.', 900000, 'IDR', 0), ('Other', 'Ulaman Esalen (90 min)', 'Ulaman Esalen massage integrates a holistic approach to massage therapy, blending techniques like lomi-lomi, stretching, long flowing strokes, gentle rocking and passive joint movements. This combination creates a deeply relaxing and nurturing experience, emphasizing the mind-body connection for enhanced relaxation, stress relief, and overall well-being.', 1100000, 'IDR', 1), ('Other', 'The Bamboo (60 min)', 'Our bamboo massage employs deep tissue massage techniques, utilizing bamboo to apply pressure, knead muscles, and roll over the body, delivering a deeply therapeutic experience. The firmness and smoothness of the bamboo facilitate effective muscle manipulation, promoting relaxation, relieving tension, and enhancing circulation.', 900000, 'IDR', 2), ('Other', 'The Bamboo (90 min)', 'Our bamboo massage employs deep tissue massage techniques, utilizing bamboo to apply pressure, knead muscles, and roll over the body, delivering a deeply therapeutic experience. The firmness and smoothness of the bamboo facilitate effective muscle manipulation, promoting relaxation, relieving tension, and enhancing circulation.', 1100000, 'IDR', 3), ('Other', 'The Candlenut (60 min)', 'This massage features warm candlenut and coconut oils that deeply hydrate, and nourish the skin, and muscles, melting away tension, and leaving you feeling truly relaxed and rejuvenated.', 800000, 'IDR', 4), ('Other', 'The Candlenut (90 min)', 'This massage features warm candlenut and coconut oils that deeply hydrate, and nourish the skin, and muscles, melting away tension, and leaving you feeling truly relaxed and rejuvenated.', 950000, 'IDR', 5), ('Other', 'Tension Relief (45 min)', 'This treatment focuses on the neck, shoulder, and back area, easing muscle stress resulting from strenuous exercise and repetitive activities.', 600000, 'IDR', 6), ('Other', 'Green Tea (50 min)', 'Green tea possesses natural skin-brightening and anti-aging properties, which helps oily skin by removing toxins, giving it a natural glow and is followed by our tomato conditioner application.', 850000, 'IDR', 7), ('Other', 'Seaweed (50 min)', 'This seaweed scrub and mask helps reduce excess oil on the skin by preserving skin elasticity with hyaluronic acid and enhancing collagen production to eliminate fatty deposits and cellulite.', 850000, 'IDR', 8), ('Other', 'Day Pass', 'Enjoy a relaxing day at Ulaman with access to Riverside Spa facilities and the E.A.R.T.H. Restaurant pool.', 1250000, 'IDR', 9), ('Lymphatic Massage', 'Lymphatic Detox (60 min)', 'Expertly designed to diminish cellulite through enhanced lymphatic drainage, employing a combination of techniques such as clapping, pinching, and rapid rubbing to stretch skin tissue and eliminate excess fluids and toxins.', 900000, 'IDR', 0), ('Four Hands Massage', 'Four Hands (60 min)', 'Indulge in supreme relaxation with our tandem Massage, where two therapists collaborate seamlessly, using synchronized movements to provide a deep therapeutic, and thorough massage experience. Therapeutic and comprehensive massage.', 1100000, 'IDR', 0), ('Four Hands Massage', 'Four Hands (75 min)', 'Indulge in supreme relaxation with our tandem Massage, where two therapists collaborate seamlessly, using synchronized movements to provide a deep therapeutic, and thorough massage experience. Therapeutic and comprehensive massage.', 1250000, 'IDR', 1), ('Hot Stone', 'Hot Stones (75 min)', 'This luxurious treatment harmoniously integrates the technique of Balinese massage with the soothing warmth of smooth, heated basalt stones. The heat from the stones permeates deep into your muscles melting away tension and stress.', 950000, 'IDR', 0), ('Hot Stone', 'Hot Stones (90 min)', 'This luxurious treatment harmoniously integrates the technique of Balinese massage with the soothing warmth of smooth, heated basalt stones. The heat from the stones permeates deep into your muscles melting away tension and stress.', 1100000, 'IDR', 1), ('Aromatherapy', 'Candle Aromatherapy (60 min)', 'Aromatic warm candle wax is gently poured over the body followed by thumb and palm long strokes. The non-oily wax leaves your body feeling silky, smooth, and fully moisturized.', 850000, 'IDR', 0), ('Aromatherapy', 'Candle Aromatherapy (90 min)', 'Aromatic warm candle wax is gently poured over the body followed by thumb and palm long strokes. The non-oily wax leaves your body feeling silky, smooth, and fully moisturized.', 1000000, 'IDR', 1), ('Foot Massage', 'Foot Massage (45 min)', '(Spa or poolside option) Our expert therapists apply firm massage techniques to soothe and release tension from your feet and lower legs promoting enhanced blood circulation and overall well-being.', 600000, 'IDR', 0), ('Scalp Treatment', 'Scalp Treatment (45 min)', 'Indulge in a luxurious scalp and shoulder massage with warm coconut oil, promoting relaxation, enhancing blood circulation, and supporting hair health.', 550000, 'IDR', 0), ('Body Scrub', 'Moringa Scrub (50 min)', 'Moringa is abundant in antioxidants that enhance the skin''s natural collagen formation and anti-aging properties. Followed by our carrot conditioner, this scrub revitalizes and repairs dead skin tissues.', 850000, 'IDR', 0), ('Javanese Lulur', 'Javanese Lulur (50 min)', 'Made from turmeric, sandalwood powder, ground nuts, and curcuma, this blend boasts antiseptic and anti-aging properties softening the skin with a yogurt-based skin conditioner.', 850000, 'IDR', 0), ('Body Wrap', 'Seaweed Body Wrap (50 min)', 'Enriched with vitamin E and rich in antioxidants, Ulaman seaweed body wrap repairs damaged skin cells, enhances elasticity, and fights cellulite, leaving your skin rejuvenated.', 850000, 'IDR', 0), ('Body Wrap', 'Green Tea Body Wrap (50 min)', 'Experience the soothing properties of green tea which is packed with antioxidants and vitamin B-2 helping maintain collagen levels and promoting skin firmness.', 850000, 'IDR', 1), ('Body Wrap', 'Moringa Body Wrap (50 min)', 'Indulge in the nourishing benefits of Moringa, rich in vitamins A, B, and C, in our signature body wrap. Enhance your skin''s natural repair process and maintain its youthful glow.', 850000, 'IDR', 2), ('Body Wrap', 'Bentonite Clay Wrap (50 min)', 'Made with Bentonite clay, sandalwood, peppermint, and Arak, this rejuvenating treatment draws out toxins, leaving you feeling renewed, and energized, and your skin silky smooth.', 850000, 'IDR', 3), ('Balinese Boreh', 'Balinese Boreh (50 min)', 'A traditional herbal remedy combining natural ingredients like ginger, cloves, cinnamon, turmeric, rice powder, galangal, nutmeg, and candlenut blended into a paste and applied to the body as a scrub or mask.', 850000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'amedrodaspa.com' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Amed Roda Spa treatment prices', 1, 'draft', 'partial', 'https://amedrodaspa.com/', 'Official Amed Roda Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '89e2830db29c0a6446c94a7a51b9fda81d7cea965aca640d15f9ea368830e6ac', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Head Massage', 1), ('Foot Massage', 2), ('Hot Stone', 3), ('Traditional Massage', 4), ('Aromatherapy', 5), ('Facial', 6), ('Body Scrub', 7), ('Flower Bath', 8), ('Hair Treatment', 9), ('Ear Candle', 10), ('Other', 11)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Balinese Massage (60 min)', 'Traditional Balinese full-body massage.', 170000, 'IDR', 0), ('Balinese Massage', 'Balinese Massage (90 min)', 'Traditional Balinese full-body massage.', 250000, 'IDR', 1), ('Head Massage', 'Back & Head Massage (45 min)', 'Relaxing massage focusing on head and back.', 150000, 'IDR', 0), ('Head Massage', 'Back & Head Massage (60 min)', 'Relaxing massage focusing on head and back.', 180000, 'IDR', 1), ('Head Massage', 'Head/Neck Massage (30 min)', 'Targeted massage for head and neck.', 90000, 'IDR', 2), ('Foot Massage', 'Foot Massage (45 min)', 'Refresh and relax your feet.', 130000, 'IDR', 0), ('Foot Massage', 'Foot Massage (60 min)', 'Refresh and relax your feet.', 180000, 'IDR', 1), ('Hot Stone', 'Hot Stone Massage (90 min)', 'Therapeutic massage with heated stones.', 240000, 'IDR', 0), ('Hot Stone', 'Hot Stone Massage (120 min)', 'Therapeutic massage with heated stones.', 340000, 'IDR', 1), ('Traditional Massage', 'Jamu - Jamu Massage (90 min)', 'Traditional Indonesian herbal massage.', 280000, 'IDR', 0), ('Traditional Massage', 'Jamu - Jamu Massage (120 min)', 'Traditional Indonesian herbal massage.', 370000, 'IDR', 1), ('Traditional Massage', 'Aloevera Massage (60 min)', 'Massage with soothing aloe vera gel.', 180000, 'IDR', 2), ('Traditional Massage', 'Aloevera Massage (90 min)', 'Massage with soothing aloe vera gel.', 280000, 'IDR', 3), ('Aromatherapy', 'Aromatherapy Massage (Warm Oil) (60 min)', 'Relaxing aromatherapy massage with warm oil.', 170000, 'IDR', 0), ('Aromatherapy', 'Aromatherapy Massage (Warm Oil) (90 min)', 'Relaxing aromatherapy massage with warm oil.', 260000, 'IDR', 1), ('Facial', 'Traditional Facial (60 min)', 'Rejuvenating facial treatment.', 200000, 'IDR', 0), ('Facial', 'Mini Facial (30 min)', 'Compact facial treatment.', 100000, 'IDR', 1), ('Body Scrub', 'Exotic Body Scrub (45 min)', 'Exfoliating and revitalizing body scrub.', 135000, 'IDR', 0), ('Body Scrub', 'Green Tea Body Scrub (45 min)', 'Revitalizing body scrub with green tea.', 150000, 'IDR', 1), ('Body Scrub', 'Green Tea Body Scrub (60 min)', 'Revitalizing body scrub with green tea.', 180000, 'IDR', 2), ('Flower Bath', 'Flower Bath (30 min)', 'Relaxing bath with flower petals.', 110000, 'IDR', 0), ('Hair Treatment', 'Hair Mask (60 min)', 'Nourishing hair treatment.', 170000, 'IDR', 0), ('Ear Candle', 'Ear Candle (60 min)', 'Traditional ear cleansing treatment.', 105000, 'IDR', 0), ('Other', 'Kids Roda Spa (60 min)', 'Spa package designed for children.', 205000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where split_part(regexp_replace(regexp_replace(official_url, '^https?://', ''), '^www\.', ''), '/', 1) = 'akashaamed.lovable.app' and status = 'active' and publication_status = 'published' order by slug limit 1
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Akasha Amed Spa treatment prices', 1, 'draft', 'partial', 'https://akashaamed.lovable.app/', 'Official Akasha Amed Spa price list',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '6fd20cc51331cf94cb40995de97f2bd0d976a1a6e146cbff0d85c02560b157b7', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Balinese Massage', 0), ('Traditional Massage', 1), ('Hot Stone', 2), ('Deep Tissue', 3), ('Body Scrub', 4), ('Facial', 5), ('Reflexology', 6), ('Manicure', 7), ('Pedicure', 8), ('Other', 9), ('Hair Braiding', 10), ('Spa Package', 11)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Balinese Massage', 'Akasha Balinese Massage (90 min)', 'Our signature traditional full-body massage with aromatherapy oil, stretching and acupressure.', 155000, 'IDR', 0), ('Traditional Massage', 'Warm Oil Massage (90 min)', 'Light rhythmic strokes with drizzles of warm oil to drain toxins and deeply relax.', 175000, 'IDR', 0), ('Traditional Massage', 'Akasha Four-Hands Massage (90 min)', 'Two therapists work in synchronized harmony on both sides of the body.', 320000, 'IDR', 1), ('Traditional Massage', 'Kids Massage (45 min)', 'A gentle, calming massage designed for younger guests.', 85000, 'IDR', 2), ('Hot Stone', 'Hot Stone Massage (90 min)', 'Warm stones placed on energy points to release tight muscles and tension.', 295000, 'IDR', 0), ('Deep Tissue', 'Deep Tissue Massage (90 min)', 'Slow, deep strokes targeting deeper muscle layers and connective tissue.', 185000, 'IDR', 0), ('Body Scrub', 'Body Scrub (45 min)', 'Antioxidant-rich exfoliation. Choose coffee, lavender or green tea.', 125000, 'IDR', 0), ('Facial', 'Rejuvenating Facial (60 min)', 'Cleansing, exfoliation, shoulder massage, mask and hand massage.', 225000, 'IDR', 0), ('Facial', 'Refreshing Facial (60 min)', 'Antioxidant cleansing scrub, neck & shoulder massage, refreshing mask.', 210000, 'IDR', 1), ('Facial', 'Express Facial (30 min)', 'A mini-facial: scrub, face massage, mask and moisturizer.', 110000, 'IDR', 2), ('Reflexology', 'Foot Reflexology (60 min)', 'Pressure-point stimulation on the feet to balance your energy.', 90000, 'IDR', 0), ('Manicure', 'Manicure (45 min)', 'Hand massage, nail filing, cuticles, shaping and polish.', 170000, 'IDR', 0), ('Pedicure', 'Pedicure (60 min)', 'Foot bath, trim and scrub, lower-leg massage and polish.', 205000, 'IDR', 0), ('Other', 'Kids Fingers & Toes (50 min)', 'A playful manicure and pedicure for little hands and feet.', 165000, 'IDR', 0), ('Other', 'Spa Journey (150 min)', 'Aromatic scrub, warm oil massage and a body mask to deeply relax.', 475000, 'IDR', 1), ('Other', 'Akasha Bliss (150 min)', 'Aromatherapy massage followed by a mini-facial and nail care.', 415000, 'IDR', 2), ('Other', 'Spa Sampler (120 min)', 'Release tension with a deep massage followed by reflexology.', 345000, 'IDR', 3), ('Other', 'Spa Journey (150 min)', 'Aromatic scrub, warm oil massage, and a body mask to deeply relax and restore the skin.', 475000, 'IDR', 4), ('Other', 'Akasha Bliss (150 min)', 'Aromatherapy massage followed by a mini-facial and nail care. A great all-rounder for a relaxed afternoon.', 415000, 'IDR', 5), ('Other', 'Spa Sampler (120 min)', 'Release tension with a deep massage followed by reflexology. Ideal for guests short on time.', 345000, 'IDR', 6), ('Hair Braiding', 'Half Hair Braiding', 'Beach-ready braids, halfway around.', 250000, 'IDR', 0), ('Hair Braiding', 'Full Hair Braiding', 'A full head of intricate braids.', 350000, 'IDR', 1), ('Spa Package', 'Indulgence Package (180 min)', 'A unique blend of treatments for your entire body. Pure heaven.', 550000, 'IDR', 0), ('Spa Package', 'Indulgence Package (180 min)', 'A unique blend of treatments for your entire body. Pure heaven. Our most popular package for guests who want the full spa experience.', 550000, 'IDR', 1)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

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
