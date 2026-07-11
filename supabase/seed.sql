-- Seed mirrors lib/seed.ts. PLACEHOLDER curation — replace every venue/perk
-- with a signed Editorial Seed partner before any tourist sees it. [ПРОВЕРИМ]

insert into districts (slug, name, is_deep) values
  ('canggu', 'Canggu', true)
on conflict (slug) do nothing;

-- Bali-wide planning layer (mirrors lib/districts.ts; coverage flags stay at
-- their planning_only/false defaults — no money surface outside active_deep).
insert into districts (slug, name, is_deep) values
  ('ubud',          'Ubud',                       false),
  ('seminyak',      'Seminyak',                   false),
  ('kuta-legian',   'Kuta & Legian',              false),
  ('jimbaran',      'Jimbaran',                   false),
  ('uluwatu-bukit', 'Uluwatu & the Bukit',        false),
  ('nusa-dua',      'Nusa Dua',                   false),
  ('sanur',         'Sanur',                      false),
  ('sidemen',       'Sidemen',                    false),
  ('amed',          'Amed & the east coast',      false),
  ('munduk',        'Munduk & the highlands',     false),
  ('lovina',        'Lovina',                     false),
  ('nusa-islands',  'Nusa Penida & the islands',  false)
on conflict (slug) do nothing;

insert into venues (id, slug, name, category, district, address, gmaps_url, tier, is_sponsored) values
  ('v_home','home-cafe','Home Cafe','cafe','canggu','Canggu (see map)','https://maps.app.goo.gl/v5HGaAzKoXdvQh6i9','editorial_seed',false),
  ('v_amber','amber-cafe','Amber Specialty Coffee','cafe','canggu','Jl. Pantai Berawa, Canggu','https://maps.google.com/?q=Canggu+coffee','editorial_seed',false),
  ('v_loka','loka-brunch','Loka Brunch House','restaurant','canggu','Jl. Batu Bolong, Canggu','https://maps.google.com/?q=Canggu+brunch','editorial_seed',false),
  ('v_tide','tide-surf','Tide Surf Co.','surf','canggu','Echo Beach, Canggu','https://maps.google.com/?q=Echo+Beach+surf','launch',false),
  ('v_root','root-warung','Root Warung','warung','canggu','Jl. Pererenan, Canggu','https://maps.google.com/?q=Pererenan+warung','editorial_seed',false),
  ('v_lull','lull-spa','Lull Spa & Sauna','spa','canggu','Jl. Nelayan, Canggu','https://maps.google.com/?q=Canggu+spa','founding',true),
  ('v_dusk','dusk-beach-club','Dusk Beach Club','beach_club','canggu','Pantai Berawa, Canggu','https://maps.google.com/?q=Berawa+beach+club','founding',false),
  ('v_ember','ember-dinner','Ember Woodfire','restaurant','canggu','Jl. Batu Mejan, Canggu','https://maps.google.com/?q=Canggu+dinner','launch',false),
  ('v_neon','neon-bar','Neon Listening Bar','bar','canggu','Jl. Pantai Berawa, Canggu','https://maps.google.com/?q=Canggu+bar','editorial_seed',false)
on conflict (id) do nothing;

insert into perks (id, venue_slug, title, terms) values
  ('p_home','home-cafe','Free dessert with any main','One per guest. Dine-in only.'),
  ('p_amber','amber-cafe','Free filter coffee with any breakfast','One per guest. Dine-in only.'),
  ('p_loka','loka-brunch','15% off the full bill before 11:00','One per guest, per day.'),
  ('p_tide','tide-surf','Free board upgrade on a 2h rental','Subject to availability.'),
  ('p_root','root-warung','Free es kelapa with any main','One per guest. Dine-in only.'),
  ('p_lull','lull-spa','20% off any 60-min treatment','Booking recommended. One per guest.'),
  ('p_dusk','dusk-beach-club','Welcome drink + no minimum spend daybed','Before 16:00. Subject to availability.'),
  ('p_ember','ember-dinner','Free starter with two mains','Dine-in, evenings only.'),
  ('p_neon','neon-bar','2-for-1 on the first round','Before 20:00. One per guest.')
on conflict (id) do nothing;

insert into plan_entries (district, venue_slug, slot, rank, blurb) values
  ('canggu','home-cafe','morning',5,'Cozy local cafe — order a main, dessert is on the house.'),
  ('canggu','amber-cafe','morning',10,'Start slow. Best filter in Berawa, opens 7:00.'),
  ('canggu','loka-brunch','morning',20,'Long brunch if you skipped the early coffee.'),
  ('canggu','tide-surf','day',10,'Beginner-friendly break, boards on the sand.'),
  ('canggu','root-warung','day',20,'Cheap, fast, local lunch between sessions.'),
  ('canggu','lull-spa','day',30,'Reset after surf — sauna then cold plunge.'),
  ('canggu','dusk-beach-club','sunset',10,'The golden-hour anchor. Get there by 17:00.'),
  ('canggu','ember-dinner','evening',10,'Woodfire, no-fuss, walk-in friendly.'),
  ('canggu','neon-bar','evening',20,'Last stop. Records, low lights, real cocktails.')
on conflict do nothing;
