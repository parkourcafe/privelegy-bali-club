-- food menu snapshots, batch 4 (25 menus)
with target as (
  select slug from venues where slug = 'izzi-rooftop-lounge-and-restaurant-and-bar-and-shisha' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'IZZI ROOFTOP LOUNGE & RESTAURANT & BAR & SHISHA menu', 1, 'draft', 'partial', 'https://izzibali.com/food_menu', 'Official IZZI ROOFTOP LOUNGE & RESTAURANT & BAR & SHISHA menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'bd8093cc8fb9f88e7a7a0eecfdfec1f56a42c267c00513e7ae20ebac510be3c8', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Salads', 0), ('Starters & Snacks', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Salads', 'Crab Salad', 'Tender crab sticks, cucumber, sweet corn, boiled rice, creamy mayonnaise, crispy krupuk and microgreens', 120000, 'IDR', 0), ('Salads', 'Caesar Salad', 'Crisp romaine, cherry tomatoes, parmesan shavings, golden croutons, creamy anchovy dressing', 125000, 'IDR', 1), ('Salads', 'Olivier Salad', 'Eggs, potatoes, carrots, pickles, cucumber, creamy mayonnaise, fresh microgreens', 75000, 'IDR', 2), ('Salads', 'Olivier Salad with Doctor Kolbasa', 'The classic, made with Doktorskaya sausage', 125000, 'IDR', 3), ('Salads', 'Greek Salad', 'Romaine, tomatoes, cucumber, red onion, black olives, feta, olive oil and oregano', 125000, 'IDR', 4), ('Salads', 'Chef''s Thai Beef Salad', 'Tender beef, romaine, cucumber, hot chili, red onion, sesame, peanuts, coriander, Thai dressing', 115000, 'IDR', 5), ('Starters & Snacks', 'Cheburek', 'Crispy golden pastry, juicy filling', 75000, 'IDR', 0), ('Starters & Snacks', 'Crepes', 'Savoury filled crepes', 95000, 'IDR', 1), ('Starters & Snacks', 'Crispy Fried Spicy Tofu', 'Breaded tofu, hot chili, spring onion, garlic', 85000, 'IDR', 2), ('Starters & Snacks', 'Beer Snack Platter', 'Crispy chicken fillet, French fries, fried chicken dumplings, krupuk, garlic mayo', 175000, 'IDR', 3), ('Starters & Snacks', 'Eggplant Rolls', 'Eggplant, garlic cream cheese, walnuts, coriander, cherry tomatoes, pomegranate', 75000, 'IDR', 4), ('Starters & Snacks', 'Chicken Strips', 'With dipping sauce', 90000, 'IDR', 5), ('Starters & Snacks', 'Chicken Wings', 'BBQ or sweet chili', 90000, 'IDR', 6)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'jackson-lily-s-by-ginger-moon' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Jackson Lily''s by Ginger Moon menu', 1, 'draft', 'partial', 'https://jacksonlilys.com/gm-menus/Food/All-Day-Dining/7.%20All%20day%20menu%20-%20Salads.pdf', 'Official Jackson Lily''s by Ginger Moon menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'fba889d10eb349ab21f7638042b67836b2625c566468e1f879b411fe642620f9', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Salads', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Salads', 'Summer Rolls', 'Rice noodles, lettuce, mint, garlic chives + hoi sin peanut sauce', null, null, 0), ('Salads', 'Prawn + pork belly', null, 110000, 'IDR', 1), ('Salads', 'Tempeh, tropical fruit & vegetables', null, 65000, 'IDR', 2), ('Salads', 'Ginger Moons Gado Gado', 'Vegetable salad, peanut sauce, crackers', 85000, 'IDR', 3), ('Salads', 'Watermelon & Dragon Fruit', 'Tomatoes, feta, salak vinaigrette, cumin crisp, flowers', 88000, 'IDR', 4), ('Salads', 'Tropical Lobster Cocktail', 'approx. 600gm Green apple, pomelo, mint, basil, lemon aioli, baby gem', 690000, 'IDR', 5), ('Salads', 'Tropical Island', 'Fruits, vegetables, green herbs, cashews, lime & chili dressing + a choice of:', null, null, 6), ('Salads', 'Tempura tofu', null, 99000, 'IDR', 7), ('Salads', 'Salt & pepper squid', null, 188000, 'IDR', 8)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'jari-menari-seminyak' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Jari Menari menu', 1, 'draft', 'partial', 'https://www.jarimenari.com/chinese-spa-menu', 'Official Jari Menari menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '3f37567e2c6f42aac3a7c7c03b9f5b6fb8ab7ee9545a5bfaefba53921b6f263b', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('按摩', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('按摩', '完美按摩', '90分钟', 585000, 'IDR', 0), ('按摩', '胴体增强按摩', '90分钟', 585000, 'IDR', 1), ('按摩', '基本按摩', '75分钟', 515000, 'IDR', 2), ('按摩', '4手连弹 (双人)按摩', '60分钟', 660000, 'IDR', 3), ('按摩', '佳丽蒙丽娜的最爱:移动式按摩', '90分钟', 585000, 'IDR', 4), ('按摩', '使用草药球,无精油对背部,头部,足部的按摩', '60分钟', 480000, 'IDR', 5), ('按摩', '滋润面部护理', '45分钟', 620000, 'IDR', 6), ('按摩', '背部按摩', '45分钟', 425000, 'IDR', 7), ('按摩', '足部按摩', '45分钟', 425000, 'IDR', 8), ('按摩', '儿童按摩', '45分钟', 425000, 'IDR', 9), ('按摩', '磨砂面膜和脚部去角质', '45分钟', 425000, 'IDR', 10), ('按摩', '芬芳花浴', '45分钟', 100000, 'IDR', 11)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'kaum-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Kaum Restaurant Menu', 1, 'draft', 'partial', 'https://seminyak.potatohead.co/feast/kaum', 'Official Kaum Bali menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '5fe044ef016475ad34b811273d95dfb915fd81175ad34563233972ec76f4b177', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('to start', 0), ('small plates', 1), ('sate', 2), ('from the grill', 3), ('large plates', 4), ('vegetables', 5), ('rice', 6), ('sambal', 7), ('dessert', 8)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('to start', 'panada — north sulawesi', 'Manadonese fried bread stuffed with shredded grill tuna jowl, kemangi leaves, served with chili and lime relish.', 80000, 'IDR', 0), ('to start', 'perkedel kentang — sumatera', 'Fried potato croquette stuffed with jackfruit rendang, red chili relish.', 75000, 'IDR', 1), ('to start', 'otak otak — riau', 'Traditional grilled fish cake wrapped in banana leaves, served together with mixed nut sauce.', 70000, 'IDR', 2), ('to start', 'aneka kerupuk — java', 'Assorted crackers made of pounded rice, paddy oats (melinjo), and breadfruit chips.', 65000, 'IDR', 3), ('small plates', 'gohu ikan - maluku', 'Fresh market fish marinated in coconut oil, fresh calamansi juice, belimbing, kenari nuts, ginseng leaves, served with banana chips.', 120000, 'IDR', 0), ('small plates', 'rujak pomelo — indonesia', 'Pomelo, green papaya, jicama, cherry tomato, purple cabbage.', 85000, 'IDR', 1), ('small plates', 'gado gado kaum — jakarta', 'Assorted blanched garden vegetables tossed in peanut dressing, served with free-range egg, fried tofu, fried shallots and garlic crackers.', null, null, 2), ('small plates', 'dendeng lambok - west sumatera', 'Smoked wagyu beef brisket slices marinated in coconut water, bay leaves, lemongrass and kaffir lime leaves, served with green chilli relish.', 130000, 'IDR', 3), ('sate', 'sate banjar - south kalimantan', 'Chargrilled marinated chicken thigh, sweet and spicy peanut sauce, soy, crispy shallot.', 160000, 'IDR', 0), ('sate', 'sate ragey - north sulawesi', 'Minahasan grilled marinated pork belly, crushed lemongrass, ginger, red chilli, fresh ginger relish.', 165000, 'IDR', 1), ('sate', 'sate sapi maranggi - central java', 'Chargrilled beef tenderloin, baby leek, coriander soy glaze, served with sambal kecap.', 170000, 'IDR', 2), ('sate', 'sate platter (3 varieties)', 'Sate banjar, sate ragey, sate sapi maranggi.', 375000, 'IDR', 3), ('from the grill', 'ikan bakar sambal dabu dabu — north sulawesi', 'Grilled fillet of market fish marinated with tamarind and turmeric, served with dabu dabu – Manado’s fresh chili and vegetable sambal.', 250000, 'IDR', 0), ('from the grill', 'udang bakar kecombrang — west java', 'Chargrilled marinated king prawn, served in a torch ginger flower emulsion.', 325000, 'IDR', 1), ('from the grill', 'gurita bakar jimbaran — bali', 'Chargrilled octopus with jimbaran glaze, tomato, pickle cabbage, green chilli.', 190000, 'IDR', 2), ('from the grill', 'ayam bakar biromaru — central sulawesi', 'Chargrilled young free-range chicken, bumbu biromaru from highlands of Sigi, served with moringa and smoked tuna urap, sambal dabu bakar, and spiced chicken broth.', 225000, 'IDR', 3), ('large plates', 'beef rendang - west sumatera', 'Slow cooked and braised wagyu beef brisket with coconut milk and spices of Padang.', 185000, 'IDR', 0), ('large plates', 'bebek se’i - east nusa tenggara', 'Padi hay smoked duck breast, charred green chilli relish.', 190000, 'IDR', 1), ('large plates', 'gulai bebek - aceh', 'Marinated seared duck breast in spicy Acehnese curry sauce with cherry tomatoes, chayote, potato, sweet chili, wing bean.', 195000, 'IDR', 2), ('large plates', 'selat solo - central java', 'Grilled wagyu short rib/ spice beef jus/ farm vegetables.', 485000, 'IDR', 3), ('vegetables', 'bobor daun kelor kelapa muda — central java', 'Moringa leaves and snake gourds slow-cooked in fresh coconut milk and turmeric broth.', 110000, 'IDR', 0), ('vegetables', 'keciwis madu — kaum', 'Fried baby cabbage, honey rica rica - a spice paste from North Sulawesi, garlic chips.', 60000, 'IDR', 1), ('vegetables', 'kalasan kacang panjang — bali', 'Shredded steamed long bean tossed in Balinese spice dressing.', 65000, 'IDR', 2), ('vegetables', 'tumis toge pete* — kaum', 'Sauteed bean sprout, garlic top, green onion, pete bean and fried shallot.', 60000, 'IDR', 3), ('rice', 'nasi putih or nasi merah', 'Steamed white rice or organic brown rice.', 35000, 'IDR', 0), ('rice', 'nasi kuning', 'White rice cooked in fresh coconut milk and turmeric.', 40000, 'IDR', 1), ('rice', 'nasi goreng babi – bali', 'Wok-fried rice, egg, braised pork meat, assorted green vegetables, fried egg on top.', 145000, 'IDR', 2), ('rice', 'nasi goreng pete udang — kaum', 'Wok-fried rice with smoked chilli paste, assorted vegetables, pete and sweet shrimp.', 150000, 'IDR', 3), ('sambal', 'sambal lado merah - west sumatera', 'Red chilli sambal with red tomato, salted whitebait, and pete bean.', 35000, 'IDR', 0), ('sambal', 'sambal ikan teri bakar - java', 'Salted whitebait and red chilli relish.', 35000, 'IDR', 1), ('sambal', 'sambal rica rica - north sulawesi', 'Crushed lemongrass, ginger, red chilli – Manado style.', 35000, 'IDR', 2), ('sambal', 'sambal matah - bali', 'Shallot, lemongrass, torch ginger, red bird’s eye chilli and coconut oil.', 35000, 'IDR', 3), ('dessert', 'kacang mete karamel — kaum', 'East Bali cashew nuts, coconut shortbread, amed sea salt, caramel served with sea salt ice cream.', 80000, 'IDR', 0), ('dessert', 'kue kojo kukus saus kopi — south sumatra', 'Steamed pandan and coconut cake, coconut sugar, grated coconut crumble served with coffee sauce.', 70000, 'IDR', 1), ('dessert', 'pisang — kaum', 'Banana skin caramel, peanut praline, banana cinnamon cream, sea salt caramel, roasted banana sorbet.', 80000, 'IDR', 2), ('dessert', 'colenak — west java', 'Tape singkong, smoked chili, burnt shortbread served with passion fruit palm sugar coconut sauce.', 75000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'la-favela-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Restaurant Menu', 1, 'draft', 'partial', 'https://lafavelabali.com/menus', 'Official La Favela Bali menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '63ffba5f1a38617f04f23ec47eccad8f59c7e08951698d7e0c04642c70a777b3', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Appetizers', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Appetizers', 'PICKLED CUCUMBER', 'Soy & mirin dressing, sesame seeds, togarashi', 35000, 'IDR', 0), ('Appetizers', 'PRAWN TOAST', 'Sweet chili sauce, coriander, sesame seeds, fried shallots', 90000, 'IDR', 1), ('Appetizers', 'CHICKEN & PRAWN DUMPLINGS', 'Black bean chili dressing, chives, sesame oil', 85000, 'IDR', 2), ('Appetizers', 'YANGZHOU FRIED RICE', 'Lap cheong-sausage, shrimp, egg, carrot, peas, scallion', 100000, 'IDR', 3), ('Appetizers', 'BRAISED PORK BELLY', 'Jasmine rice, bok choy, plum sauce, pineapple salsa', 105000, 'IDR', 4), ('Appetizers', 'STEAMED CHICKEN', 'Soy & ginger sauce, coriander, scallion, chili', 95000, 'IDR', 5)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'la-plancha' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Food Menus', 1, 'draft', 'partial', 'https://laplancha-bali.com/menus', 'Official La Plancha menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'd9a8073b9453fce191092306adfea5ea0e86b40fa34240463e22100f6a34a594', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Food Specials', 0), ('FESTIVE SPECIALS', 1), ('Chinese New Year Specials Package', 2), ('Brunch', 3), ('Food', 4), ('Dips & Breads', 5), ('Snacks & Small Plates', 6), ('Kids Menu', 7), ('Skewers | From the Grill', 8), ('Sweets', 9), ('La Plancha Pizza', 10), ('Drinks', 11), ('Wine & Spirits', 12), ('Ice Cream', 13), ('Special Packages', 14), ('Desserts', 15)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Food Specials', 'BRUSCHETTA (vt)', 'Sourdough, whipped ricotta, cherry tomatoes, balsamic glaze, almonds', 80000, 'IDR', 0), ('Food Specials', 'CHICKEN & BLACK BEAN BURRITO', 'Garlic & chipotle rice, jalapeno, mozzarella cheese, guacamole, smoked paprika', 95000, 'IDR', 1), ('Food Specials', 'GRILLED CHICKEN BREAST', 'Green peas fricassee, pork bacon, smoked paprika, fried scallion', 100000, 'IDR', 2), ('Food Specials', 'MATCHA SPONGE CAKE (vt)', 'Almonds & vanilla ice cream', 40000, 'IDR', 3), ('FESTIVE SPECIALS', 'SHARING PLATTER + DESSERT', 'Cajun chicken skewers, pork skewers, beef skewers & pineapple skewers', 690000, 'IDR', 0), ('FESTIVE SPECIALS', 'CHOCOLATE FUDGE BROWNIE (VT)', 'Vanilla ice cream & cashew nuts', null, null, 1), ('Chinese New Year Specials Package', 'Grilled Grouper Fish', null, 399000, 'IDR', 0), ('Chinese New Year Specials Package', 'Chinese Bolognese', null, null, null, 1), ('Chinese New Year Specials Package', 'Mango Sago', null, null, null, 2), ('Chinese New Year Specials Package', 'Vanilla Jasmine Tea', null, null, null, 3), ('Brunch', 'HAM & CHEESE CIABATTA TOASTIE', 'Mozzarella & cheddar cheese, caramelized onions, kewpie mayo, chips', 85000, 'IDR', 0), ('Brunch', 'LA PLANCHA FRENCH TOAST (vt)', 'Vanilla ice cream, honey, strawberry, almond flakes, coconut flakes', 65000, 'IDR', 1), ('Brunch', 'GRANOLA BOWL (vt)', 'Mango, strawberry, banana, yogurt, honey, fresh milk', 65000, 'IDR', 2), ('Brunch', 'SMOOTHIE BOWL (v)', 'Dragon fruit, mango, banana, blueberries, strawberry, housemade granola', 70000, 'IDR', 3), ('Brunch', 'SMASHED AVOCADO ON TOAST (vt)', 'Sourdough, spiced cashew dukkah, feta cheese', 65000, 'IDR', 4), ('Brunch', 'BREAKFAST BAGUETTE', 'Scrambled eggs, avocado, pork bacon, basil & kemangi pesto', 80000, 'IDR', 5), ('Brunch', 'BIG BREAKFAST', 'Sourdough, avocado, grilled tomato, pork sausage, pork bacon, scrambled eggs', 110000, 'IDR', 6), ('Brunch', 'EGGS BENEDICT', 'English muffins, poached eggs, hollandaise sauce, pork bacon, watercress', 70000, 'IDR', 7), ('Brunch', 'EGGS MUFFIN', 'Scrambled eggs, cheddar cheese, pork bacon, kewpie mayo, chips', 65000, 'IDR', 8), ('Brunch', 'TOASTED SOURDOUGH (vt)', 'Scrambled eggs, parmesan cheese', 50000, 'IDR', 9), ('Brunch', 'SEASONAL FRUIT PLATTER (gf, v)', null, 60000, 'IDR', 10), ('Food', 'STICKY PORK RIBS', '350gr marinated pork ribs, BBQ sauce, grilled corn salsa', 155000, 'IDR', 0), ('Food', 'MOUSSAKA PIE', 'Braised beef, potato, eggplant, mornay sauce, parmesan cheese', 115000, 'IDR', 1), ('Food', 'BEEF NACHOS', 'Pulled wagyu beef, corn tortilla, caramelized onions, tomato salsa, cheese sauce, avocado crema', 150000, 'IDR', 2), ('Food', 'BOLOGNESE LINGUINE', 'Braised beef ragu, basil, butter, parmesan cheese', 120000, 'IDR', 3), ('Food', 'PRAWN LINGUINE', 'Blistered cherry tomato, white wine, confit garlic, parsley, lemon, butter, chili flakes', 170000, 'IDR', 4), ('Food', 'SNAPPER CEVICHE (gf)', 'Jimbaran market fish, leche de tigre, mango, cucumber, onions, coriander, potato crisp', 120000, 'IDR', 5), ('Food', 'BURRATA SALAD (vt)', 'Green peas, kemangi gremolata, fried kemangi, sourdough', 125000, 'IDR', 6), ('Food', 'WATERMELON & LYD TOMATO SALAD (gf, vt)', 'Pickled onion, mint, basil, feta cheese, balsamic vinaigrette', 70000, 'IDR', 7), ('Food', 'GEM LETTUCE SALAD', 'Green peas, cucumber, parmesan cheese, sourdough crumb, vinaigrette', 65000, 'IDR', 8), ('Dips & Breads', 'GUACAMOLE DIP (gf, v)', 'Corn tortilla chips, smoked paprika, pico de gallo', 75000, 'IDR', 0), ('Dips & Breads', 'GREEN PEA HUMMUS (gf, v)', 'Toasted mix spices & seeds, smoked paprika, corn tortilla chips', 70000, 'IDR', 1), ('Snacks & Small Plates', 'TUNA TOSTADAS', 'Corn tortilla, smash avocado, chipotle & lime mayo, coriander', 80000, 'IDR', 0), ('Snacks & Small Plates', 'MARINATED CHILLED OCTOPUS', 'Olives, lemon, parsley, capers, apple cider vinegar, sourdough', 80000, 'IDR', 1), ('Snacks & Small Plates', 'FRIED CALAMARI', 'Sriracha mayo, parsley, lime', 90000, 'IDR', 2), ('Snacks & Small Plates', 'BEEF EMPAÑADAS (3pcs)', 'Braised beef ragu, green peas, mozzarella cheese, chipotle salsa', 90000, 'IDR', 3), ('Snacks & Small Plates', 'ALBONDIGAS', 'Spanish beef meatballs, tomato ragu sauce, sourdough, smoked paprika, parmesan cheese', 95000, 'IDR', 4), ('Snacks & Small Plates', 'CHICKEN WINGS', 'BBQ sauce, furikake spice, lime', 90000, 'IDR', 5), ('Snacks & Small Plates', 'TRUFFLE CHICKEN CROQUETAS', 'Salsa tartufata, truffle aioli, parmesan cheese', 90000, 'IDR', 6), ('Snacks & Small Plates', 'TEQUEÑOS (3pcs)', 'Fried stuffed cheddar cheese sticks, avocado sauce', 70000, 'IDR', 7), ('Snacks & Small Plates', 'STEAMED EDAMAME (gf, v)', 'Bali sea salt', 50000, 'IDR', 8), ('Snacks & Small Plates', 'FRENCH FRIES (vt)', 'Bali sea salt, aioli', 70000, 'IDR', 9), ('Kids Menu', 'MINI KIDS BURGER', 'Cheddar cheese, mayo & tomato ketchup, potato chips', 65000, 'IDR', 0), ('Kids Menu', 'MINI HOTDOG', 'Vienna pork sausage, mayo & tomato ketchup, potato chips', 65000, 'IDR', 1), ('Skewers | From the Grill', 'WHOLE GRILLED MARKET FISH', 'Scallion, ginger, red chili, coriander, garlic, light soy sauce', 260000, 'IDR', 0), ('Skewers | From the Grill', 'ANGUS BEEF SKEWERS', 'Seaweed & rosemary garlic salt, Balinese sambal matah, lime', 175000, 'IDR', 1), ('Skewers | From the Grill', 'CAJUN CHICKEN SKEWERS', 'Chimichurri, cucumber & cheese salsa, lemon', 115000, 'IDR', 2), ('Skewers | From the Grill', 'PORK SKEWERS', 'Coconut & fish sauce marinated pork, balinese sambal matah', 105000, 'IDR', 3), ('Skewers | From the Grill', 'OCTOPUS SKEWER', null, 100000, 'IDR', 4), ('Skewers | From the Grill', 'PRAWN SKEWER', null, 95000, 'IDR', 5), ('Skewers | From the Grill', 'SWORDFISH SKEWER', null, 90000, 'IDR', 6), ('Skewers | From the Grill', 'BABY SQUID SKEWER', null, 90000, 'IDR', 7), ('Skewers | From the Grill', 'SARDINE SKEWER', null, 70000, 'IDR', 8), ('Sweets', 'FRIED CHURROS (vt)', 'Chocolate ganache, cinnamon sugar', 60000, 'IDR', 0), ('Sweets', 'ICE CREAM SUNDAE (vt)', 'Vanilla ice cream, caramel sauce, rainbow sprinkles', 50000, 'IDR', 1), ('Sweets', 'BRULEE BASQUE CHEESECAKE (gf, vt)', null, 55000, 'IDR', 2), ('Sweets', 'FRUITS & LIME GRANITA (gf, vt)', 'Mango, rock melon, watermelon, strawberry, lime zest', 50000, 'IDR', 3), ('Sweets', 'ORANGE CHOCOLATE TART (vt)', 'Tamarillo yogurt', 55000, 'IDR', 4), ('La Plancha Pizza', 'MARGHERITA (vt)', 'Tomato sauce, mozzarella cheese, basil oil', 135000, 'IDR', 0), ('La Plancha Pizza', 'VEGETARIANA (vt)', 'Tomato sauce, mozzarella cheese, zucchini, roasted peppers, button mushrooms, onions', 135000, 'IDR', 1), ('La Plancha Pizza', 'FOUR CHEESE (vt)', 'Mozzarella cheese, ricotta cheese, feta & parmesan cheese', 150000, 'IDR', 2), ('La Plancha Pizza', 'BALAMI', 'Local salami, raw tomato sambal, chili oil, mozzarella cheese', 155000, 'IDR', 3), ('La Plancha Pizza', 'BEEF PEPPERONI', 'Tomato, Jonos artisan pepperoni, mozzarella & parmesan cheese, garlic oil', 155000, 'IDR', 4), ('La Plancha Pizza', 'CHICKEN & MUSHROOM', 'Cream base, rosemary chicken, mozzarella cheese, button mushrooms, onions, parmesan cream', 155000, 'IDR', 5), ('La Plancha Pizza', 'SUPREME', 'Tomato sauce, mozzarella cheese, Jonos pepperoni, salami, roasted peppers, black olives, button mushrooms', 170000, 'IDR', 6), ('Drinks', 'MANGO HARMONY (D)', 'Mango puree, fresh milk, matcha, wafer', 70000, 'IDR', 0), ('Drinks', 'COCONUT CLOUD', 'Coconut water, vanilla syrup, matcha foam', 70000, 'IDR', 1), ('Drinks', 'HAZELNUT COFFEE (D)', 'Coffee, hazelnut syrup, fresh milk, cream', 70000, 'IDR', 2), ('Drinks', 'OCEAN ICED TEA', 'Butterfly pea tea, mixed citrus, honey blossom', 70000, 'IDR', 3), ('Drinks', 'TROPICAL ICED TEA (D)', 'Mango tea, mixed citrus, honey blossom, mango foam', 70000, 'IDR', 4), ('Wine & Spirits', 'HOUSE PROSECCO NV, Glera – IT', null, 160000, 'IDR', 0), ('Wine & Spirits', 'VILLA SANDI, Dolce Sandi Moscato NV – IT', null, 750000, 'IDR', 1), ('Ice Cream', 'VEGAN ICE CREAM', null, 45000, 'IDR', 0), ('Ice Cream', 'PALETAS WEY', 'Fruity', 45000, 'IDR', 1), ('Special Packages', 'F&B PACKAGES', '690K/COUPLE', 690000, 'IDR', 0), ('Desserts', 'Chocolate Fondant', null, null, null, 0), ('Desserts', 'Chocolate Lava Cake (vt)', null, null, null, 1)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'merah-putih' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'VEGAN TASTING MENU', 1, 'draft', 'partial', 'https://merahputihbali.com/wp-content/uploads/2024/05/vegan-menu-may-2024.pdf', 'Official Merah Putih menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '7a673fca8400ac0b4e44e60421b043eb3211038ca980ea287b5397cfd4912336', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Vegan Dishes', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Vegan Dishes', 'RUJAK', 'Green mango, pomelo, tamarind, cucumber', 480000, 'IDR', 0), ('Vegan Dishes', 'PERKEDEL', 'Sweetcorn fritter, balado, chili', 480000, 'IDR', 1), ('Vegan Dishes', 'SOTO', 'Black bean, leek, fried shallot, chive', 480000, 'IDR', 2), ('Vegan Dishes', 'BAK PAO', 'Young jackfruit steamed bun, coriander leaves', 480000, 'IDR', 3), ('Vegan Dishes', 'PANGSIT', 'Mushroom dumpling, andaliman, tomato', 480000, 'IDR', 4), ('Vegan Dishes', 'BUNGA KOL', 'Cauliflower, apsaragus, onion, tofu', 480000, 'IDR', 5), ('Vegan Dishes', 'ASAM PADEH', 'Minang curry, chayote, roasted pumpkin', 480000, 'IDR', 6), ('Vegan Dishes', 'Coconut rice + sambal', null, 480000, 'IDR', 7), ('Vegan Dishes', 'BELIMBING', 'Starfruit sorbet, raspberry granita', 480000, 'IDR', 8), ('Vegan Dishes', 'COKLAT', 'Chocolate tart, passion coconut, poached mango', 480000, 'IDR', 9)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'neon-palms' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'NEON PALMS’ MENU', 1, 'draft', 'partial', 'https://www.neonpalms.com/menu', 'Official NEON PALMS menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'f90bb205e8a769e62d33b3d129ca6fb8b502eb080e08f49a0d4cfc7e51b63210', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Breakfast', 0), ('Drinks', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Breakfast', 'Avocado Toast', 'Toasted sourdough with smashed avocado, cherry tomatoes, and feta cheese.', 8000, 'IDR', 0), ('Breakfast', 'Eggs Benedict', 'Poached eggs on an English muffin with hollandaise sauce.', 10000, 'IDR', 1), ('Breakfast', 'Pancakes', 'Fluffy pancakes served with maple syrup and fresh berries.', 9000, 'IDR', 2), ('Drinks', 'Mimosa', 'Sparkling wine with orange juice.', 7000, 'IDR', 0), ('Drinks', 'Fresh Juice', 'Choose from orange, apple, or watermelon.', 5000, 'IDR', 1)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'noaa-asian-bistro' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Food Menu', 1, 'draft', 'partial', 'https://noaa.live/food-menu', 'Official NOAA Asian Bistro menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'b53a1f5df283c3445201349751da0bac7189cfc20b2993dcf267de6cb01a90e8', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Food', 0), ('Drinks', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Food', 'Dish Name 1', 'Description of Dish 1', 100000, 'IDR', 0), ('Food', 'Dish Name 2', 'Description of Dish 2', 150000, 'IDR', 1), ('Drinks', 'Drink Name 1', 'Description of Drink 1', 50000, 'IDR', 0), ('Drinks', 'Drink Name 2', 'Description of Drink 2', 75000, 'IDR', 1)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'okamura-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Food Menu', 1, 'draft', 'partial', 'https://okamurabali.crayonsite.com/p/2', 'Official Okamura Bali menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '1286b7f4a366ac33d21edc29d32095150ce2da014cf2f3b0839e59b283247034', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Sushi Roll / Nigiri / Hand Roll', 0), ('Sashimi', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Sushi Roll / Nigiri / Hand Roll', 'Okamura Roll', null, 95000, 'IDR', 0), ('Sushi Roll / Nigiri / Hand Roll', 'Salmon Roll', null, 98000, 'IDR', 1), ('Sushi Roll / Nigiri / Hand Roll', 'Special Sushi fried', null, 79000, 'IDR', 2), ('Sushi Roll / Nigiri / Hand Roll', 'California Roll', null, 69000, 'IDR', 3), ('Sushi Roll / Nigiri / Hand Roll', 'Spicy Tuna Roll', null, 79000, 'IDR', 4), ('Sushi Roll / Nigiri / Hand Roll', 'Spicy Salmon Roll', null, 82000, 'IDR', 5), ('Sushi Roll / Nigiri / Hand Roll', 'Teriyaki Chicken Roll', null, 79000, 'IDR', 6), ('Sushi Roll / Nigiri / Hand Roll', 'Tuna Katsu Roll', null, 45000, 'IDR', 7), ('Sushi Roll / Nigiri / Hand Roll', 'Crab Salad Roll', null, 45000, 'IDR', 8), ('Sushi Roll / Nigiri / Hand Roll', 'Salmon Negitoro Maki', null, 45000, 'IDR', 9), ('Sushi Roll / Nigiri / Hand Roll', 'Salmon Maki', null, 42000, 'IDR', 10), ('Sushi Roll / Nigiri / Hand Roll', 'Tekka Maki', null, 35000, 'IDR', 11), ('Sushi Roll / Nigiri / Hand Roll', 'Negitoro Maki', null, 40000, 'IDR', 12), ('Sushi Roll / Nigiri / Hand Roll', 'Salmon Skin Roll', null, 35000, 'IDR', 13), ('Sushi Roll / Nigiri / Hand Roll', 'Kappa Maki', null, 28000, 'IDR', 14), ('Sushi Roll / Nigiri / Hand Roll', 'Egg Maki', null, 32000, 'IDR', 15), ('Sushi Roll / Nigiri / Hand Roll', 'Okamura Sushi Set', null, 168000, 'IDR', 16), ('Sushi Roll / Nigiri / Hand Roll', 'Okamura Nigiri Set', null, 168000, 'IDR', 17), ('Sushi Roll / Nigiri / Hand Roll', 'Nigiri Tuna', null, 37000, 'IDR', 18), ('Sushi Roll / Nigiri / Hand Roll', 'Nigiri Salmon', null, 39000, 'IDR', 19), ('Sushi Roll / Nigiri / Hand Roll', 'Nigiri Squid', null, 33000, 'IDR', 20), ('Sushi Roll / Nigiri / Hand Roll', 'Nigiri Snapper', null, 33000, 'IDR', 21), ('Sushi Roll / Nigiri / Hand Roll', 'Nigiri Shrimp', null, 34000, 'IDR', 22), ('Sushi Roll / Nigiri / Hand Roll', 'Nigiri Egg', null, 25000, 'IDR', 23), ('Sushi Roll / Nigiri / Hand Roll', 'Salmon aburi nigiri', null, 41000, 'IDR', 24), ('Sushi Roll / Nigiri / Hand Roll', 'Tuna aburi nigiri', null, 39000, 'IDR', 25), ('Sushi Roll / Nigiri / Hand Roll', 'Tobiko Gunkan', null, 42000, 'IDR', 26), ('Sushi Roll / Nigiri / Hand Roll', 'Salmon Avocado Hand Roll', null, 45000, 'IDR', 27), ('Sushi Roll / Nigiri / Hand Roll', 'California Hand Roll', null, 45000, 'IDR', 28), ('Sushi Roll / Nigiri / Hand Roll', 'Spicy Tuna Hand Roll', null, 42000, 'IDR', 29), ('Sushi Roll / Nigiri / Hand Roll', 'Tuna Katsu Hand Roll', null, 35000, 'IDR', 30), ('Sushi Roll / Nigiri / Hand Roll', 'Tuna Zuke Nigiri', null, 40000, 'IDR', 31), ('Sushi Roll / Nigiri / Hand Roll', 'Salmon Zuke Nigiri', null, 44000, 'IDR', 32), ('Sushi Roll / Nigiri / Hand Roll', 'Unagi Roll', null, 147000, 'IDR', 33), ('Sushi Roll / Nigiri / Hand Roll', 'Unagi Maki', null, 42000, 'IDR', 34), ('Sushi Roll / Nigiri / Hand Roll', 'Unagi Nigiri', null, 48000, 'IDR', 35), ('Sashimi', 'Okamura Sashimi Set', null, 147000, 'IDR', 0), ('Sashimi', 'Salmon Set', null, 75000, 'IDR', 1), ('Sashimi', 'Tuna Set', null, 65000, 'IDR', 2), ('Sashimi', 'Salmon Fuji Set', null, 155000, 'IDR', 3), ('Sashimi', 'Tuna Fuji Set', null, 135000, 'IDR', 4), ('Sashimi', 'Sashimi Tuna', null, 45000, 'IDR', 5), ('Sashimi', 'Sashimi Salmon', null, 48000, 'IDR', 6), ('Sashimi', 'Sashimi Snapper', null, 45000, 'IDR', 7), ('Sashimi', 'Sashimi Squid', null, 42000, 'IDR', 8)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'prana-spa-seminyak' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Prana Spa Treatment Menu', 1, 'draft', 'partial', 'https://pranaspaseminyakbali.com/images/PranaSpa_Nov2024.pdf', 'Official Prana Spa menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '42996bb5838a4d913e52e5ac20b222feb7593efc0e8caae5eedfc1d5a23691b5', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Aromatic Body & Beauty', 0), ('Signature Facials - Seaweed or Clay', 1), ('Ayurvedic Treatments', 2), ('Pevonia Facials', 3), ('Ayurvedic Treatments (2)', 4), ('Aromatherapy Massages', 5)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Aromatic Body & Beauty', 'Baths - Flower, Vanilla', '30 minutes', 300000, 'IDR', 0), ('Aromatic Body & Beauty', 'Body Scrub and Vichi Shower', '30 minutes - Sea Salt, Coffee, Lulur or Milk', 450000, 'IDR', 1), ('Aromatic Body & Beauty', 'Body Masks - Seaweed or Clay', '30 minutes', 350000, 'IDR', 2), ('Aromatic Body & Beauty', 'Milk Bath', '30 minutes', 400000, 'IDR', 3), ('Aromatic Body & Beauty', 'Hair cream bath', '60 minutes', 500000, 'IDR', 4), ('Aromatic Body & Beauty', 'Prana Manicure', '60 minutes', 320000, 'IDR', 5), ('Aromatic Body & Beauty', 'Prana Pedicure', '60 minutes', 320000, 'IDR', 6), ('Signature Facials - Seaweed or Clay', 'Milk Bath', '30 minutes', 400000, 'IDR', 0), ('Signature Facials - Seaweed or Clay', 'Hair cream bath', '60 minutes', 500000, 'IDR', 1), ('Ayurvedic Treatments', 'Prana Pedicure', '60 minutes', 320000, 'IDR', 0), ('Pevonia Facials', 'Pevonia Balancing Facial', '60 minutes', 800000, 'IDR', 0), ('Pevonia Facials', 'Pevonia Men Revival Facial', '60 minutes', 850000, 'IDR', 1), ('Ayurvedic Treatments (2)', 'Shirodhara', '60 minutes', 900000, 'IDR', 0), ('Aromatherapy Massages', 'Signature Body Massage', '60 minutes', 750000, 'IDR', 0), ('Aromatherapy Massages', 'Signature Body Massage', '90 minutes', 850000, 'IDR', 1), ('Aromatherapy Massages', 'Deep Tissue Massage', '60 minutes', 850000, 'IDR', 2), ('Aromatherapy Massages', 'Deep Tissue Massage', '90 minutes', 950000, 'IDR', 3), ('Aromatherapy Massages', 'Pregnancy Massage', '60 minutes', 850000, 'IDR', 4)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'queen-s-of-angsoka-by-queen-s-tandoor-at-ramada-by-wyndham-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Wine List', 1, 'draft', 'partial', 'https://bali.queenstandoor.com/upload/Queens%20Tandoor%20Indian%20Restaurant%20Wine%20Menu%20June%202024.pdf', 'Official Queen''s of Angsoka By Queen''s Tandoor at Ramada by Wyndham Bali menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'eb23ee9338f3fc103203dadd37fbc32a99e1e422875aed569cc8c106f0765343', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Red', 0), ('Sparkling & Champagne', 1), ('White', 2), ('Other Red', 3), ('Red Continued', 4)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Red', 'CORONAS TORRES 2020', null, 940000, 'IDR', 0), ('Red', 'CÔTE DE BROUILLY, HENRY FESSY, 2018', null, 950000, 'IDR', 1), ('Red', 'EVANS & TATE BREATHING, 2018', null, 720000, 'IDR', 2), ('Red', 'LUIS FELIPE EDWARDS GRAN RESERVA, 2016', null, 810000, 'IDR', 3), ('Red', 'LUIS FELIPE EDWARDS GRAN RESERVA, 2017', null, 810000, 'IDR', 4), ('Red', 'MARTIN MOUNT ROZIER TOBACCO STR, 2019', null, 620000, 'IDR', 5), ('Red', 'MARTIN MOUNT ROZIER, 2021', null, 620000, 'IDR', 6), ('Red', 'SANGRE DE TORO TORRES, 2021', null, 810000, 'IDR', 7), ('Red', 'TWO ISLANDS, 2019', null, 480000, 'IDR', 8), ('Red', 'ZONIN MONTEPULCIANO D''ABRUZZO DOC, NV', null, 680000, 'IDR', 9), ('Sparkling & Champagne', 'MASCHIO PROSECCO DOCG VALDOBBIADENE X DRY, NV', 'PINOT GRIGIO', 530000, 'IDR', 0), ('White', 'ALEXIS LICHINE, 2019', null, 700000, 'IDR', 0), ('White', 'EVANS & TATE BREATHING, 2018', 'PINOT GRIS', 720000, 'IDR', 1), ('White', 'EVANS & TATE BREATHING, 2018', 'SAUVIGNON BLANC', 720000, 'IDR', 2), ('White', 'HUNTER''S CHARDONNAY, 2020', null, 850000, 'IDR', 3), ('White', 'LOUIS LATOUR ARDECHE, 2019', null, 890000, 'IDR', 4), ('White', 'MOUNT ROZIER THE FLOWER GARDEN, 2021', null, 620000, 'IDR', 5), ('White', 'MOUNT ROZIER THE WILD PEACOCK, 2020', null, 620000, 'IDR', 6), ('White', 'TALL HORSE, 2020', null, 520000, 'IDR', 7), ('White', 'TWO ISLANDS, 2019', 'PINOT GRIGIO', 480000, 'IDR', 8), ('Other Red', 'CLASSIC MARLBOROUGH, 2022', 'BLEND', 920000, 'IDR', 0), ('Other Red', 'MONTADO TEMPRANILLO, 2021', null, 500000, 'IDR', 1), ('Other Red', 'MOUNT ROZIER THE FROG CHORUS, 2020', 'BLEND', 620000, 'IDR', 2), ('Other Red', 'TWO ISLANDS, 2019', 'GRENACHE', 450000, 'IDR', 3), ('Red Continued', 'ANTIGAL UNO, 2017', 'BLEND', 920000, 'IDR', 0), ('Red Continued', 'BABICH CLASSIC MARLBOROUGH, 2019', 'MERLOT-CABERNET', 920000, 'IDR', 1)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'queen-s-tandoor-indian-restaurant-seminyak-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Queen''s Tandoor - Indian Restaurant Seminyak Bali menu', 1, 'draft', 'partial', 'https://bali.queenstandoor.com/location/seminyak', 'Official Queen''s Tandoor - Indian Restaurant Seminyak Bali menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '4882b06cb61a9227af4aad3a895fe3786b123fd7c0c7780279b24fa9cc0e7b8c', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Indian Cuisine', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Indian Cuisine', 'Tandoori Chicken', 'Marinated chicken cooked in a traditional tandoor oven.', 150000, 'IDR', 0), ('Indian Cuisine', 'Palak Paneer', 'Spinach and cottage cheese curry, a vegetarian delicacy.', 100000, 'IDR', 1), ('Indian Cuisine', 'Butter Chicken', 'Rich and creamy sauce with tender chicken pieces.', 120000, 'IDR', 2), ('Indian Cuisine', 'Vegetable Biryani', 'Fragrant basmati rice cooked with seasonal vegetables.', 90000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'revive-pilates-umalas' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'R+PUMALASSCHEDULE', 1, 'draft', 'partial', 'https://www.reviveandpilates.studio/umalas-schedule', 'Official Revive + Pilates Umalas menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'dec1551af96078ca751dc2c482f6e7477eaac73dcccc7a58d14885c9c4825c17', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Classes', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Classes', 'Gluteformer', 'Our Gluteformer class focuses on building a strong lower body; we’ll target your glutes, hamstrings, quads and of course your abs. The result: toned abs, sculpted legs and a peachy booty.', 275000, 'IDR', 0), ('Classes', 'All Levels', 'Reformer All Levels is suitable for everybody! Whether you''re just starting out or a long-term lover of the more classical pilates moves. Each exercise is layered to support you at your current fitness level.', 275000, 'IDR', 1), ('Classes', 'Strongformer', 'Strongformer is a reformer class with an extra kick. This session combines the strength of heavier springs and dumbbells for an intense, full-body workout.', 275000, 'IDR', 2), ('Classes', 'Stretch + Flex', 'Designed to ease tension and release tight muscles. This class will help Increase your flexibility, mobility and improve your range of motion.', 275000, 'IDR', 3), ('Classes', 'Pre + Postnatal Reformer', 'Pre and Postnatal Reformer is a specially designed reformer class tailored for expectant and new mothers. This gentle yet effective workout uses controlled resistance and mindful movements to support and strengthen your body throughout pregnancy and postnatal recovery.', 275000, 'IDR', 4), ('Classes', 'Sweatformer', 'Sweatformer is a reformer class with that extra bit of spice. A high intensity cardio style class with higher reps and shorter rest times. This class works the whole body, gets your heart rate up and guarantees that pilates shake.', 275000, 'IDR', 5)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'rooftop-sunset-bar-at-double-six-luxury-hotel' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Rooftop Sunset Bar Menu', 1, 'draft', 'partial', 'https://doublesixrooftop.com/wp-content/uploads/2024/11/RT-Menu-drink-list-2024.pdf', 'Official Rooftop Sunset Bar at Double Six Luxury Hotel menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'b6b0215c5846eb2afd0ced1daa9966df94dfad0d3a464116ed656d1731930eb7', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Sweet', 0), ('LET’S DRINK', 1), ('No Alcohol Needed', 2), ('Bigger Plate', 3), ('Pizza', 4)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Sweet', 'Carrot Cake', 'Cream cheese & candied carrot', 85000, 'IDR', 0), ('Sweet', 'Strawberry Granita', 'With lemon, honey yoghurt, cookie crumble & Bedugul strawberry', 85000, 'IDR', 1), ('Sweet', 'Creme Caramel', 'Vanilla custard, butterscotch & sugar floss', 85000, 'IDR', 2), ('Sweet', 'Chocolate Mousse', 'With berry compote, grated coconut, almond & orange toile', 85000, 'IDR', 3), ('LET’S DRINK', 'Crafted Signature Cocktails', null, null, null, 0), ('LET’S DRINK', 'Hop-Hop Rabbit', 'Chenniang baiju, blackberry liqueur, watermelon and passion puree, balance with sweet and sour', 130000, 'IDR', 1), ('LET’S DRINK', 'Coco Mango Mojito', 'Light rum, lime, mint leaves, mango puree, caster sugar, topped with coconut water', 130000, 'IDR', 2), ('LET’S DRINK', 'Red Ferrari', 'Vodka, sweet vermouth, strawberry, red bitter, lime juice and caster sugar', 130000, 'IDR', 3), ('LET’S DRINK', 'Melon Kuning Martini', 'Yellow watermelon, vodka, triple sec, lime juice, simple syrup and passion fruit puree', 130000, 'IDR', 4), ('LET’S DRINK', 'Passion Fruit Martini', 'Vodka, passion fruit puree, vanilla syrup, lime juice', 130000, 'IDR', 5), ('LET’S DRINK', 'Last Markisa', 'Vodka, lime juice, simple syrup, passion fruit puree, topped with sparkling wine', 130000, 'IDR', 6), ('LET’S DRINK', 'London Calling', 'Gin, elderflower syrup, lime juice, aromatic bitter, chamomile ice cube topped with tonic water and sparkling wine', 180000, 'IDR', 7), ('LET’S DRINK', 'Copacabana', 'Dark rum, passion fruit puree, vanilla syrup, colada mix', 140000, 'IDR', 8), ('LET’S DRINK', 'Double Six Spice Colada', 'Spiced rum, coconut liqueur and home made colada mix', 130000, 'IDR', 9), ('LET’S DRINK', 'Arak Cocktails', null, null, null, 10), ('LET’S DRINK', 'Arak Attack', 'Premium arak, local honey, topped with lemonade', 120000, 'IDR', 11), ('LET’S DRINK', 'Arak Passion', 'Premium arak, green chilli, apple syrup, passion puree, tamarind syrup, lime juice', 120000, 'IDR', 12), ('LET’S DRINK', 'Top 9 Classic Cocktails', null, null, null, 13), ('LET’S DRINK', 'Mojito', 'Light rum, lime wedges, caster sugar, mint leaves, topped with soda water', 140000, 'IDR', 14), ('LET’S DRINK', 'Long Island Iced Tea', 'Vodka, gin, tequila, light rum, triple sec, lime juice, topped with coke', 140000, 'IDR', 15), ('LET’S DRINK', 'Pina Colada', 'Light rum, coconut liqueur, pineapple juice, and coconut milk', 140000, 'IDR', 16), ('LET’S DRINK', 'Cosmopolitan', 'Vodka, triple sec liqueur, lime juice, cranberry juice', 140000, 'IDR', 17), ('LET’S DRINK', 'Margarita', 'Tequila, triple sec liqueur, lime juice', 140000, 'IDR', 18), ('LET’S DRINK', 'Caipirosca', 'Vodka, caster sugar, lime wedges', 140000, 'IDR', 19), ('LET’S DRINK', 'Tequila Sunrise', 'Tequila, orange juice, grenadine syrup', 140000, 'IDR', 20), ('LET’S DRINK', 'Negroni', 'Gin, campari, sweet vermouth', 160000, 'IDR', 21), ('LET’S DRINK', 'Daiquiri', 'Light rum, triple sec liqueur, lime juice', 140000, 'IDR', 22), ('No Alcohol Needed', 'Vanila Manila', 'Orange juice, plain yogurt, vanilla syrup, peach puree, lime juice', 55000, 'IDR', 0), ('No Alcohol Needed', 'Cocochee', 'Pineapple juice, lychee juice, coconut cream, simple syrup, lime juice', 55000, 'IDR', 1), ('No Alcohol Needed', 'Sunset Fizz', 'Orange juice, mango juice, soda water and splash of grenadine syrup', 55000, 'IDR', 2), ('No Alcohol Needed', '66 Heirloom', 'Banana, mango juice, pineapple juice and coconut milk', 55000, 'IDR', 3), ('No Alcohol Needed', 'Flavored Ice Tea', 'Flavor choice of: Original, Lychee and Lemon', 55000, 'IDR', 4), ('Bigger Plate', 'Vodka Pene', 'Vodka infused tomato cream sauce with poor man’s parmesan', 125000, 'IDR', 0), ('Bigger Plate', 'Fisherman Fried Rice', 'Prawn, squid, fried poached egg, togarashi, garlic, spring onions', 135000, 'IDR', 1), ('Bigger Plate', 'Dandan Noodles', 'With minced pork, scallion and Szechuan pepper', 125000, 'IDR', 2), ('Bigger Plate', 'Korean Wagyu Platter', 'Sliced wagyu brisket 8+, bulgogi, kimchi, cucumber, pickled green chili, lettuce', 295000, 'IDR', 3), ('Pizza', 'Margherita', 'Mozzarella, basil, tomato sauce', 100000, 'IDR', 0), ('Pizza', 'White Pizza', 'Potato, mozzarella, rosemary, garlic, jalapeno, cream sauce, chili flakes', 110000, 'IDR', 1), ('Pizza', 'Hawaiian', 'Ham, bacon, onions, pineapple, basil, mozzarella & tomato sauce', 125000, 'IDR', 2), ('Pizza', 'Pepperoni', 'Beef pepperoni, mozzarella, tomato sauce, chili flakes', 125000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'saia-wellness-saia-pilates-umalas' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Private Class Rate', 1, 'draft', 'partial', 'https://www.saiawellness.co/services-7-1', 'Official SAIA Wellness / SAIA Pilates Umalas menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'ed53a23d1b4e17e372f50d7d1b40f21191fe2127b694614e9e609ec51641e51e', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Sari', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Sari', 'Trial Session', null, 425000, 'IDR', 0), ('Sari', '1 Session', null, 425000, 'IDR', 1), ('Sari', '4 Sessions', null, 850000, 'IDR', 2), ('Sari', '10 Sessions', null, 6000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'saltlick' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'SALTLICK MENU', 1, 'draft', 'partial', 'https://saltlickbali.com/menu', 'Official Saltlick menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'f5401dccad869b72161994fb9c277c8652c29bff52eebce6ab9ea6b458e9ae70', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('SALTY SNACKS', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('SALTY SNACKS', 'Levantine Olives, Rose Harissa, Fennel, Bell Pepper', null, 80000, 'IDR', 0), ('SALTY SNACKS', 'Edamame, Chinese Chili Jam, Gruyere', null, 80000, 'IDR', 1), ('SALTY SNACKS', 'Maple & Chili Chimney Smoked Nuts', null, 90000, 'IDR', 2), ('SALTY SNACKS', 'Smoky Beef Tongue Fritters, Gribiche Puree', null, 120000, 'IDR', 3), ('SALTY SNACKS', 'Red Wine Glazed Chorizo On Sourdough', null, 120000, 'IDR', 4), ('SALTY SNACKS', 'Angus Tsukune, Sesame, Lime Kosho, Shitake Tare', null, 110000, 'IDR', 5), ('SALTY SNACKS', 'Crispy Fried T-Hawk Rib Meat, Tiger Bite Sauce', null, 140000, 'IDR', 6), ('SALTY SNACKS', 'A5 Wagyu Kushipinto, Wasabi Root Pickle, Sesame-Sansho', null, 350000, 'IDR', 7)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'satoshi' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Bar Menu', 1, 'draft', 'partial', 'https://satoshibali.com/barmenu', 'Official Satoshi menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'd5ae792986b8f325452a771573c44755bbb38273e9c25b72c1e09c507e6089cf', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Cocktails', 0), ('Sake', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Cocktails', 'Mojito', 'Refreshing cocktail with mint and lime.', 85000, 'IDR', 0), ('Cocktails', 'Pina Colada', 'Tropical mix of coconut and pineapple.', 90000, 'IDR', 1), ('Sake', 'Junmai', 'Pure rice sake.', 120000, 'IDR', 0), ('Sake', 'Nigori', 'Cloudy sake for a smooth taste.', 150000, 'IDR', 1)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'shishi-nightclub-and-izakaya-lounge' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Drink Menu', 1, 'draft', 'partial', 'https://www.shishibali.com/s/SHiSHi-Drink-Menu-16-September-final-edit-2024.pdf', 'Official ShiShi Nightclub & Izakaya Lounge menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '57476598888fd88b4104000cace8e0c4197a7cd932b9a26289465473cbbc92b0', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Spirits', 0), ('Tequila', 1), ('Liqueurs', 2), ('Aperitif', 3), ('Imported Wines', 4), ('Beer & Cider', 5), ('Soju & Sake', 6), ('Soft Drinks', 7)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Spirits', 'Standard-Smirnoff Red Vodka', 'Vodka', 100000, 'IDR', 0), ('Spirits', 'Superior-Absolut Blue', 'Vodka', 125000, 'IDR', 1), ('Spirits', 'Premium-Belvedere Vodka', 'Vodka', 150000, 'IDR', 2), ('Spirits', 'Premium-Grey Goose', 'Vodka', 150000, 'IDR', 3), ('Spirits', 'Standard-Captain Morgan Spiced Gold', 'Rum', 100000, 'IDR', 4), ('Spirits', 'Standard-Captain Morgan White Rum', 'Rum', 100000, 'IDR', 5), ('Spirits', 'Superior-Bacardi Superior Rum', 'Rum', 125000, 'IDR', 6), ('Spirits', 'Superior-Bacardi Spiced Rum', 'Rum', 125000, 'IDR', 7), ('Spirits', 'Standard-Gordon''s London Dry Gin', 'Gin', 100000, 'IDR', 8), ('Spirits', 'Superior-Tanqueray London Dry Gin', 'Gin', 125000, 'IDR', 9), ('Spirits', 'Premium-Hendrick''s Scotland Gin', 'Gin', 150000, 'IDR', 10), ('Spirits', 'Standard-JW Red Label Whisky', 'Scotch Whisky', 100000, 'IDR', 11), ('Spirits', 'Superior-JW Black Label Whisky', 'Scotch Whisky', 150000, 'IDR', 12), ('Spirits', 'Premium-JW Gold Label Whisky', 'Scotch Whisky', 220000, 'IDR', 13), ('Spirits', 'Standard-Jim Beam Bourbon Whiskey', 'American/Iirish Whiskey', 100000, 'IDR', 14), ('Spirits', 'Superior-John Jameson Whiskey', 'American/Iirish Whiskey', 125000, 'IDR', 15), ('Spirits', 'Premium-Jack Daniel''s Bourbon Whiskey', 'American/Iirish Whiskey', 150000, 'IDR', 16), ('Tequila', 'Jose Cuervo Tradicional Silver / Reposado', 'Tequila', 150000, 'IDR', 0), ('Tequila', '1800 Silver / Reposado', 'Tequila', 165000, 'IDR', 1), ('Tequila', 'Cuervo Reserva De La Familia Platino', 'Tequila', 285000, 'IDR', 2), ('Liqueurs', 'Archers Peach Schnapps', 'Liqueur', 125000, 'IDR', 0), ('Liqueurs', 'Baileys Irish Cream', 'Liqueur', 125000, 'IDR', 1), ('Liqueurs', 'Cointreau Orange Liqueur', 'Liqueur', 125000, 'IDR', 2), ('Aperitif', 'Aperol', 'Aperitif', 125000, 'IDR', 0), ('Aperitif', 'Campari', 'Aperitif', 125000, 'IDR', 1), ('Imported Wines', 'Wolf Blass Bilyara Shiraz', 'Red Wine', 150000, 'IDR', 0), ('Imported Wines', 'Wolf Blass Bilyara Chardonnay', 'White Wine', 150000, 'IDR', 1), ('Beer & Cider', 'Bintang Crystal', 'Beer', 65000, 'IDR', 0), ('Beer & Cider', 'Heineken', 'Beer', 65000, 'IDR', 1), ('Beer & Cider', 'San Miguel Light', 'Beer', 65000, 'IDR', 2), ('Soju & Sake', 'Daebak Original Soju', 'Soju', 170000, 'IDR', 0), ('Soju & Sake', 'Sesshu Otokoyama Futsushu Sake', 'Sake', 199000, 'IDR', 1), ('Soft Drinks', 'Coke', 'Soft Drink', 30000, 'IDR', 0), ('Soft Drinks', 'Sprite', 'Soft Drink', 30000, 'IDR', 1), ('Soft Drinks', 'Orange Juice', 'Juice', 50000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'shooters-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'SHOOTERS MENU 2026', 1, 'draft', 'partial', 'https://www.shootersbali.com/welcome', 'Official Shooters Bali menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '8c2d8dc2e4779b011f521a1ca27e667fe239d8091b6bca28ef0f67f3e24b9696', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Games', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Games', 'Mini Golf', null, 50000, 'IDR', 0), ('Games', 'Photo Booth', null, 75000, 'IDR', 1), ('Games', 'Axe Throwing', null, 100000, 'IDR', 2), ('Games', 'Shooting Range', null, 100000, 'IDR', 3), ('Games', 'Basketball Arcade', '20k per coin', 20000, 'IDR', 4), ('Games', 'Boxing Machine', '20k per coin', 20000, 'IDR', 5), ('Games', 'Other Games', 'Free', null, null, 6)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'soham-pilates-class-program-seminyak' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Membership', 1, 'draft', 'partial', 'https://sohamwellnesscenter.com/membership', 'Official Soham Pilates / Class Program menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'bc19c73a21716e469e61b93be608390adbc6571155f3cbf3d120d184f048bf6c', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Soham Package', 0), ('Soham Membership', 1), ('Personal Training', 2)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Soham Package', 'CASUAL PACKAGE - One Pass', 'Access to various facilities as listed in benefits.', 325000, 'IDR', 0), ('Soham Package', 'CASUAL PACKAGE - 4 Pass (Valid for 1 month)', 'Access to various facilities as listed in benefits.', 975000, 'IDR', 1), ('Soham Membership', 'DIAMOND', 'Various access and benefits as listed.', 5500, 'IDR', 0), ('Personal Training', '1 Session', 'Personal training session with a qualified trainer.', 500000, 'IDR', 0), ('Personal Training', '24 Sessions', 'Pack of training sessions for a duration.', 9600, 'IDR', 1), ('Personal Training', '36 Sessions', 'Pack of training sessions for a duration.', 14040, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'soham-wellness-center-seminyak' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Wellness Membership', 1, 'draft', 'partial', 'https://sohamwellnesscenter.com/membership', 'Official Soham Wellness Center menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'e11fca6a740f077da992f1410d1c706d39e4227f110bff4eb66b2b514eec3bcc', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Packages', 0), ('Memberships', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Packages', 'Casual Package - One Pass', null, 325000, 'IDR', 0), ('Packages', 'Casual Package - 4 Pass (Valid for 1 month)', null, 975000, 'IDR', 1), ('Memberships', 'Soham Membership - Gold Semester', null, 7450, 'IDR', 0), ('Memberships', 'Soham Membership - Gold Annual', null, 13999, 'IDR', 1), ('Memberships', 'Soham Membership - Platinum Quarterly', null, 8150, 'IDR', 2), ('Memberships', 'Soham Membership - Platinum Semester', null, 14499, 'IDR', 3), ('Memberships', 'Soham Membership - Platinum Annual', null, 27299, 'IDR', 4), ('Memberships', 'Soham Membership - Diamond Monthly', null, 5500, 'IDR', 5), ('Memberships', 'Soham Membership - Diamond Quarterly', null, 14949, 'IDR', 6), ('Memberships', 'Soham Membership - Diamond Semester', null, 26699, 'IDR', 7), ('Memberships', 'Soham Membership - Diamond Annual', null, 51000, 'IDR', 8)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'spring-spa-seminyak' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Treatments', 1, 'draft', 'partial', 'https://www.springspa.com/treatments/uluwatu', 'Official Spring Spa Seminyak menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '97417defa3334d938b593d6130d2f1bb4b10c064bdc286726c06777cbb5110b9', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Promotions', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Promotions', 'The Polished Ritual', 'More info', 800000, 'IDR', 0), ('Promotions', 'Sole & Scalp Reset', 'More info', 390000, 'IDR', 1), ('Promotions', 'The Spring Reset', 'More info', 600000, 'IDR', 2), ('Promotions', 'The Bali Pause', 'More info', 420000, 'IDR', 3), ('Promotions', 'The Polish', 'More info', 650000, 'IDR', 4), ('Promotions', 'The Skin Reset', 'More info', 920000, 'IDR', 5), ('Promotions', 'The Hair Reset', 'More info', 550000, 'IDR', 6)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'takumi-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'NIGIRI JUKKAN', 1, 'draft', 'partial', 'https://takumibali.com/wp-content/uploads/2026/08/takumi-menu-10-course-nigiri-black.pdf', 'Official Takumi Bali menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '97856fd9e0e4c65d34084ca7e84df676276f5f7a04d2075613eedaff1be08695', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Ichi-no-sara', 0), ('Ni-no-sara', 1), ('San-no-sara', 2)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Ichi-no-sara', 'Maguro Akami', 'lean tuna, chimichurri', null, null, 0), ('Ichi-no-sara', 'Kuruma Ebi', 'prawn, kimizushi, wasabi', null, null, 1), ('Ichi-no-sara', 'Ni-hama', 'simmered clam, tsume sauce, sansho pepper', 150000, 'IDR', 2), ('Ni-no-sara', 'Shiromi-Kobujime', 'kombu cured white fish, Japanese turnip, apricot, shiso, cucumber Ika squid, yuzu, shiokoji', null, null, 0), ('Ni-no-sara', 'Kinmedai', 'alfonsino, red wine, salt, lime', null, null, 1), ('Ni-no-sara', 'Hotate', 'scallop, ume, matcha dust, Balinese sea salt', 150000, 'IDR', 2), ('San-no-sara', 'Salmon', 'salmon, umeshu-no-ume, yuzukosho, shiso', null, null, 0), ('San-no-sara', 'Maguro Toro', 'tuna fatty belly, karashi-sumiso, shiraga negi', null, null, 1), ('San-no-sara', 'Wagyu Aburi', 'MB9 wagyu, truffled shiokombu, egg yolk, ikura', 150000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'takumi-japanese-fine-dining' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Cocktails and Drinks Menu', 1, 'draft', 'partial', 'https://takumibali.com/wp-content/uploads/2025/06/beverage-Takumi-Menu.pdf', 'Official Takumi 匠 Japanese Fine Dining menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '9c7202dbb1195970efcd9c2a9de3d465b20a6afc76cfb290027fbd70955e19d6', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Japanese Inspired Cocktails', 0), ('Takumi Temperance Drinks', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Japanese Inspired Cocktails', 'Fuji Fizz', 'aperol, homemade black rice liqueur, soda water, crafted apple pie whiskey, homemade thyme plum syrup, crispy black rice, orange aperol caviar black walnut bitters, rock sugar', 180000, 'IDR', 0), ('Japanese Inspired Cocktails', 'Apple Pie Old Fashioned', null, 190000, 'IDR', 1), ('Japanese Inspired Cocktails', 'Akita Daisy', 'homemade campari passion fruit, cocchi rosso, yuzu gin, crafted matcha green apple cordial, japanese vodka, lemon, homemade yuzu sparkling, served with yuzu ginger pearl & mint homemade matcha sour foam, soda', 185000, 'IDR', 2), ('Japanese Inspired Cocktails', 'Matcha Ringo Sour', null, 195000, 'IDR', 3), ('Japanese Inspired Cocktails', 'Gold Umeboshi Martini', 'crafted gin umeboshi, cocchi bianco, homemade matcha tequila Anejo, tangerine, cucumber, lemon, sliced plum with gold flake agave nectar, jalapeno pickle, matcha', 185000, 'IDR', 4), ('Japanese Inspired Cocktails', 'Kyūri Matcha Margarita', null, 195000, 'IDR', 5), ('Japanese Inspired Cocktails', 'Geisha Aviation', 'traditional japanese sake, crafted fresh elderberry liqueur, homemade pandan syrup, lime, lemon', 190000, 'IDR', 6), ('Takumi Temperance Drinks', 'Suika Yuzu Cooler', 'clarified watermelon yuzu, punch of mint, soda, yuzu ginger pearl, watermelon slice', 70000, 'IDR', 0), ('Takumi Temperance Drinks', 'Guajiau Spice Smash', 'clarified pineapple coriander, homemade red ginger beer, kaffir lime, guajiau', null, null, 1), ('Takumi Temperance Drinks', 'Kokonuttsu Crush', 'kaffir lime, lemon, coconut water, coconut cream, splash lemonade', null, null, 2), ('Takumi Temperance Drinks', 'Sparkling Murasaki imo', 'homemade murasaki imo syrup, lemon, green apple, soda', null, null, 3), ('Takumi Temperance Drinks', 'Jasumin Drift', 'blueberry pearl, lychee, lemon, lime, homemade jasmine sparkling', null, null, 4)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

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
