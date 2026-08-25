-- food menu snapshots, batch 2 (25 menus)
with target as (
  select slug from venues where slug = 'four-seasons-jimbaran-yoga' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Yoga & Meditation', 1, 'draft', 'partial', 'https://www.fourseasons.com/jimbaranbay/spa/yoga_and_meditation', 'Official Four Seasons Jimbaran Yoga menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'fed1ce78894c8d4154a24b4234f2c920c6c284f24a8161b886b3d324651282e3', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Private Sessions', 0), ('Couples Private Sessions', 1), ('Group Classes', 2), ('Mixed Sessions', 3), ('Price Note', 4)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Private Sessions', 'Hatha Yoga', 'A physical yet mindful practice for strengthened bodies and restful minds. Our Hatha Yoga involves a series of postures designed to open the body’s channels and promote the free flow of energy.', 950000, 'IDR', 0), ('Private Sessions', 'Sushumna Meditation', 'Start your day in soul-soothed awareness with this beautiful meditation to a backdrop of ocean music. Slow your breathing, experience the power of ''om'' chanting and discover your inner well of calm.', 600000, 'IDR', 1), ('Couples Private Sessions', 'Sekala Yoga', 'Explore the connection between Sekala, the seen physical world, and Niskala, the invisible spirit world. Includes an optional Balinese blessing by our Resort Priest afterwards.', 450000, 'IDR', 0), ('Couples Private Sessions', 'Chakra Darshan', 'Working through the body’s energy systems (chakras) this powerful practice helps facilitate the rise of divine Kundalini energy up the spine. Prana (life force) is freed and profound clarity realised.', 450000, 'IDR', 1), ('Couples Private Sessions', 'Yin Yoga', 'Yin Yoga is a slow, gentle and intuitive practice in which each pose is held for several minutes to help release tight connective tissue around joints and promote physical flexibility and mental peace.', 600000, 'IDR', 2), ('Couples Private Sessions', 'AntiGravity Yoga', 'A dynamic flying technique, AntiGravity Yoga uses suspended hammocks to support bodies of all ages and abilities in enhanced postures.', 800000, 'IDR', 3), ('Couples Private Sessions', 'Restorative Hot Stone Yoga', 'This practice involves the placement of hot river stones on the body and holding postures for longer periods, invoking a meditative, ''nidra'' state.', 150000, 'IDR', 4), ('Group Classes', 'Yin Yoga', 'Yin Yoga is a slow, gentle and intuitive practice in which each pose is held for several minutes, promoting physical flexibility and mental peace.', 600000, 'IDR', 0), ('Group Classes', 'Restorative Hot Stone Yoga', 'Like a big enveloping hug, this practice involves the placement of hot river stones on the body and holding postures for longer periods.', 150000, 'IDR', 1), ('Mixed Sessions', 'AntiGravity Yoga', 'Relieve stress and boost endorphins as you reach new gravity-defying heights through this suspended technique.', 800000, 'IDR', 0), ('Mixed Sessions', 'Group Class', 'Join a class for a more interactive experience with others, sharing the benefits of the practices.', 600000, 'IDR', 1), ('Price Note', 'Note', 'Advance booking is required. Prices and treatments are subject to change without notice. Prices are subject to 10% service charge and 11% government tax.', null, null, 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'healing-village-spa-at-four-seasons-jimbaran-jimbaran' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Healing Village Spa at Four Seasons Jimbaran menu', 1, 'draft', 'partial', 'https://www.fourseasons.com/jimbaranbay/spa/massages', 'Official Healing Village Spa at Four Seasons Jimbaran menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '40c0471e47815fcb91ef15710e653b8c8fed830ec36381beea6e81ac77ef0cbd', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Massages', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Massages', 'Bali Restore', 'Performed by our local Balinese healers using techniques passed down through generations, this full-body massage combines stretching, long strokes and skin-rolling with palm and thumb pressure. Choose from Grounding (Bali Spice with clove, ginger, fennel and vetivert), Calming (Peace of Bali with sandalwood, ylang-ylang and ginger), Uplifting (Bali Sunset with lemon, ylang-ylang and bergamot) or P', 3000000, 'IDR', 0), ('Massages', 'Rwa Bineda Thermo Heal', 'Alternating hot and cold marble massage stones cause blood vessels to dilate and constrict, exercising the capillaries, relaxing the muscles and balancing rwa bineda: the yin and yang energy within.', 3800000, 'IDR', 1), ('Massages', 'Extreme Ease', 'This targeted treatment combines an Indian-style head, neck and shoulder massage with reflexology for the feet and hands. Firm pressure eases the stresses of city living and restores a healthy equilibrium.', 3000000, 'IDR', 2), ('Massages', 'Cancer Care Massage', 'Using bespoke oils to soothe dry or radiation-irritated skin, release scar tissue and provide lymph support, each treatment is tailored to target specific areas and alleviate symptoms like anxiety and fatigue. Let our highly trained staff take care of you. Allow 15 minutes extra for a consultation before your first appointment. Highly beneficial as a series of six sessions (sixth session is compli', 2800000, 'IDR', 3), ('Massages', 'Anti-Cellulite Massage', 'A three-pronged attack on ''orange peel'' skin: detoxifying basil, lemon, grapefruit and juniper oils; massage, kneading and tapotement; and Jade gua sha tools to expel toxins for a smoother silhouette.', 3500000, 'IDR', 4), ('Massages', 'Four-Handed Harmony', 'Experience the restorative benefits of two therapists working in union as four seamlessly coordinated hands stretch your muscles during a dance of synchronized techniques from East and West.', 3800000, 'IDR', 5), ('Massages', 'Deep Knead', 'Target areas of tension with a warming Balinese massage, deep pressure point techniques using elbows and forearms, and balancing foot reflexology. For best results, warm muscles first in the steam room or sauna.', 3000000, 'IDR', 6), ('Massages', 'Mama-To-Be Massage', 'Healing hands release tension and send loving peace during this full-body experience featuring organic lavender and mandarin Prenatal Herbal Body Oil, rose quartz massage stones and 12-point marma facial. Not suitable during first trimester. Upgrade with an extra 30 minutes of: Rose Quartz crystal healing; flower-infused shea butter tummy mask; soothing eye mask; hand treatment; cooling foot mask ', 3500000, 'IDR', 7)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'jaansan-beach-house-restaurant-bar-and-lounge-at-kelan-beach' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Jaansan Beach House | Restaurant, Bar & Lounge at Kelan Beach menu', 1, 'draft', 'partial', 'https://jaansanbeachhouse.com/menu', 'Official Jaansan Beach House | Restaurant, Bar & Lounge at Kelan Beach menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '87a1e5bc5660a103768a823958da8f189a61c75b196fc05712fe5fce59dca701', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Appetizer', 0), ('Salad', 1), ('Soup', 2), ('Exclusive Seafood', 3), ('Meat Lovers', 4), ('Pasta', 5), ('Pizza', 6), ('Burger', 7), ('Sandwiches', 8), ('Rice Corner', 9), ('Ayam / Chicken', 10), ('Bebek / Duck', 11), ('Mi Goreng / Fried Noodles', 12), ('Sate House', 13), ('Janganan / Vegetables', 14), ('Thai Corner and Curry', 15), ('Kids Menu', 16)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Appetizer', 'SPRING ROLL', 'Make your choice of chicken, seafood, duck, or vegetables. In a roll, served with honey-peanut sauce or tamarind sauce and a small salad', 95000, 'IDR', 0), ('Appetizer', 'AUTUMN ROLL', 'Cold rolls of vegetables, cucumbers, lettuce, and coriander, served with Thai chilli sauce', 110000, 'IDR', 1), ('Appetizer', 'CALAMARI FRITTI', 'Golden fried calamari served on green salad with sweet-sour sauce or honey-orange sauce', 120000, 'IDR', 2), ('Appetizer', 'SEAFOOD COCKTAIL', 'Make your choice of avocado or pineapple or seasonal fruits, Thousand Island or tamarind sauce', 120000, 'IDR', 3), ('Appetizer', 'SAMOSA', 'Green bean, potato, carrot, served with tamarind sauce', 95000, 'IDR', 4), ('Appetizer', 'LAWAR (spicy)', 'Steamed vegetables with minced meat (chicken or beef) or seafood, and grated coconut dressing', 110000, 'IDR', 5), ('Appetizer', 'YOUNG PAPAYA SALAD', 'Shredded young papaya with tomato, cucumber, lettuce and shallot, garlic and honey-vinegar dressing or tamarind sauce', 110000, 'IDR', 6), ('Appetizer', 'BRUSCHETTA A LA PESCATORA', 'Garlic bread topped with seafood', 95000, 'IDR', 7), ('Appetizer', 'BRUSCHETTA A LA ROMANA', 'Garlic bread with fresh tomato, basil and extra virgin olive oil', 90000, 'IDR', 8), ('Appetizer', 'PRAWN COCKTAIL', 'Make your choice of avocado or pineapple or seasonal fruits, Thousand Island or tamarind sauce', 120000, 'IDR', 9), ('Appetizer', 'GADO – GADO', 'Boiled mixed vegetables served with honey-peanut sauce, boiled egg and crackers', 95000, 'IDR', 10), ('Salad', 'SEAFOOD SALAD', 'Garden salad with prawn, squid and honey-orange sauce or tamarind sauce', 140000, 'IDR', 0), ('Salad', 'SALAD UDANG KARANG / LOBSTER SALAD', 'Garden salad with apple, mango and grilled lobster, with honey-tamarind sauce or Thousand Island or Italian dressing', 350000, 'IDR', 1), ('Salad', 'RUJAK BALI', 'Garden salad with apple, mango, strawberry, pineapple, with honey, tamarind and chilli sauce (spicy)', 95000, 'IDR', 2), ('Salad', 'INSALATA MAMA’S', 'Lettuce with avocado, young mango, baby tomato, onion rings and apple, with Italian dressing', 110000, 'IDR', 3), ('Salad', 'INSALATA ITALIANA', 'Lettuce, tomato, black grapes, and onion rings with extra virgin olive oil and balsamic vinegar (Italian dressing)', 110000, 'IDR', 4), ('Salad', 'INSALATA CESARE', 'Traditional Caesar salad with garlic croutons and chopped grilled chicken, ham or beef bacon, and sprinkled with parmesan cheese', 110000, 'IDR', 5), ('Salad', 'INSALATA DI TONNO E PATATE', 'Grilled tuna, potatoes and green salad, served with honey-ginger mayonnaise', 140000, 'IDR', 6), ('Salad', 'THAI BEEF SALAD', 'Tender pieces of beef grilled and served on a bed of greens with cucumber, basil, coriander and spicy chilli Thai dressing', 140000, 'IDR', 7), ('Salad', 'GRILLED OCTOPUS SALAD', null, 145000, 'IDR', 8), ('Salad', 'YOUNG MANGO SALAD', 'with baby romana, lettuce, cherry tomato, Italian dressing', 95000, 'IDR', 9), ('Soup', 'BEEF GOULASH', 'Goulash is a stew of meat and vegetables usually seasoned with paprika and other spices', 120000, 'IDR', 0), ('Soup', 'SUP TOMAT', 'Traditional classic Balinese tomato soup, shallot, celery and prawn, a thick and creamy soup', 90000, 'IDR', 1), ('Soup', 'CRAM CAM', 'Clear chicken soup with shallots and celery', 90000, 'IDR', 2), ('Soup', 'SUP LANGUAN', 'Traditional Balinese Seafood soup with shallot, vegetables, and celery', 120000, 'IDR', 3), ('Soup', 'SUP JAMUR (spicy)', 'Authentic Balinese mushroom soup with shallot, chilli and ginger', 85000, 'IDR', 4), ('Soup', 'CORN SOUP', 'Creamy corn soup with shallot and celery', 75000, 'IDR', 5), ('Soup', 'BEEF SOUP (spicy)', 'Traditional Balinese Beef soup with carrot, shallot, garlic and celery', 110000, 'IDR', 6), ('Soup', 'CREMA DI FUNGHI', 'Mushroom Cream Soup', 90000, 'IDR', 7), ('Soup', 'CREMA DI ASPARAGUS', 'Asparagus Cream Soup', 90000, 'IDR', 8), ('Soup', 'CRAB CORN SOUP', null, 110000, 'IDR', 9), ('Soup', 'CRAB ASPARAGUS SOUP', null, 110000, 'IDR', 10), ('Soup', 'VEGETABLE CHICKEN AND NOODLE SOUP', null, 90000, 'IDR', 11), ('Soup', 'THAI TOM YAM GOONG SOUP', 'Prawn, calamari, champignon, and carrot, with the flavour of lemongrass', 110000, 'IDR', 12), ('Soup', 'LOBSTER CREAM SOUP', null, 175000, 'IDR', 13), ('Exclusive Seafood', 'GRILLED TUNA STEAK', 'with grilled eggplant, butter potato, salsa sauce and rice', 300000, 'IDR', 0), ('Exclusive Seafood', 'GRILLED FILLET RED SNAPPER OR GROUPER FISH (400g)', 'Served with yellow rice and urab, topped with onion and lemongrass, chilli sambal and torch flower sambal', 350000, 'IDR', 1), ('Exclusive Seafood', 'OCEAN GOLDEN STEAK (Red snapper or grouper)', 'Charcoal-grilled fillet red snapper or fillet grouper, with butter potato, potato puree, or French fries, vegetables of the season and with Bali black grape sauce', 350000, 'IDR', 2), ('Exclusive Seafood', 'GRILLED JUMBO PRAWNS (500g)', 'with rice, sambal, steamed vegetables, honey-butter lemon sauce', 400000, 'IDR', 3), ('Exclusive Seafood', 'GRILLED SQUID (800g)', 'with chilli sambal and onion sambal, rice and vegetables', 400000, 'IDR', 4), ('Meat Lovers', 'BEEF GOLDEN BLUE', 'Beef with potatoes, mixed vegetables and cream sauce', 300000, 'IDR', 0), ('Meat Lovers', 'CHICKEN GOLDEN BLUE', 'Chicken with potatoes, mixed vegetables and cream sauce', 200000, 'IDR', 1), ('Meat Lovers', 'CHICKEN STEAK', 'Served with sauteed vegetables, mashed potatoes and cream sauce', 200000, 'IDR', 2), ('Meat Lovers', 'BEEF SIRLOIN STEAK / AUS / 200g', 'Served with green salad, grilled vegetables, French fries, or butter potato with mushroom sauce', 400000, 'IDR', 3), ('Meat Lovers', 'BLACK PEPPER STEAK / AUS / ANGUS BEEF TENDERLOIN / 300g', 'Served with baked potato and sautéed vegetables', 500000, 'IDR', 4), ('Meat Lovers', 'GOLDEN BEEF TENDERLOIN STEAK / AUS / 300g', 'Served with mixed vegetables, baked potato and pepper sauce or grape mushroom sauce', 500000, 'IDR', 5), ('Meat Lovers', 'ANGUS RIBEYE / AUS / 300g', 'Served with mixed vegetables, potatoes and black pepper sauce', 450000, 'IDR', 6), ('Meat Lovers', 'ANGUS T-BONE STEAK / US / 500g', 'Served with baked potato or French fries and vegetables', 750000, 'IDR', 7), ('Meat Lovers', 'RINDSROULADEN / BEEF ROULADEN', 'Roll of beef filled with ham or beef bacon, cucumber dill, served with grape sauce, mashed potato or croquette, sautéed broccoli and zucchini', 300000, 'IDR', 8), ('Meat Lovers', 'FRIKADELLEN / MEATBALLS', 'Pan-fried minced meat with herbs, shaped nicely, served with grape sauce and mashed potato or crispy baked potato', 300000, 'IDR', 9), ('Pasta', 'MAKE YOUR CHOICE OF: PENNE / SPAGHETTI / FETTUCCINE', 'Choose your sauce:', null, null, 0), ('Pasta', 'BOLOGNESE', 'with minced beef blended in homemade tomato sauce', 145000, 'IDR', 1), ('Pasta', 'MARINARA', 'seafood with homemade tomato sauce', 145000, 'IDR', 2), ('Pasta', 'POMODORO E BASILICO', 'homemade tomato sauce and basil', 100000, 'IDR', 3), ('Pasta', 'A LA COZZE', 'tasty mussels and homemade tomato sauce', 130000, 'IDR', 4), ('Pasta', 'PRIMAVERA', 'mixed vegetables in a cream sauce', 110000, 'IDR', 5), ('Pasta', 'CREMA E FUNGHI', 'fresh mushroom and cream sauce', 110000, 'IDR', 6), ('Pasta', 'AL SALMONE', 'fresh salmon in cream sauce', 160000, 'IDR', 7), ('Pasta', 'AGLIO OLIO', 'with prawn and olive oil sauce', 140000, 'IDR', 8), ('Pizza', 'VEGGIE PIZZA', 'Tomato, oregano, eggplant, zucchini, mushroom, broccoli, onion, red pepper and mozzarella cheese', 130000, 'IDR', 0), ('Pizza', 'MARGARITA PIZZA', 'Tomato, oregano, tomato slice, fresh basil and mozzarella cheese', 130000, 'IDR', 1), ('Pizza', 'HAWAIIAN PIZZA', 'Tomato, oregano, ham, pineapple, and mozzarella cheese', 140000, 'IDR', 2), ('Pizza', 'MEAT LOVER PIZZA', 'Tomato, oregano, salami, bacon, ham, minced beef, mushroom, olive, and mozzarella cheese', 180000, 'IDR', 3), ('Pizza', 'MARINARA SPECIAL PIZZA', 'Tomato, oregano, prawn, squid and fish, green and red pepper, onion, mushroom, and mozzarella cheese', 180000, 'IDR', 4), ('Pizza', 'BALI GOLDEN PIZZA', 'Prawn, ham, chicken, mushroom, eggplant, zucchini, black olive, artichoke', 180000, 'IDR', 5), ('Pizza', 'PEPPERONI E SALAME PIZZA', 'Salami, pepperoni, onion, mushroom, tomato sauce', 150000, 'IDR', 6), ('Pizza', 'MEAT EXTRAVAGANZA PIZZA', 'Sausage, salami, ham and bacon, onion, green pepper', 180000, 'IDR', 7), ('Pizza', 'CHICKEN CARBONARA PIZZA', 'Garlic parmesan cream sauce, chicken, bacon, onion, and mozzarella cheese', 160000, 'IDR', 8), ('Pizza', 'LOBSTER PARADISE', 'Lobster, calamari, clam, pineapple, mushroom, onion, mozzarella cheese', 300000, 'IDR', 9), ('Burger', 'CLASSIC CHICKEN BURGER', 'Barbeque chicken patty, egg, melted cheese, lettuce, rucola, tomato, grilled zucchini, with FF', 140000, 'IDR', 0), ('Burger', 'CLASSIC BEEF BURGER', 'Barbeque beef patty, egg, lettuce, rucola, tomato, grilled zucchini, with FF', 150000, 'IDR', 1), ('Sandwiches', 'CLUB SANDWICH', 'Chicken, cheese, romaine lettuce, and tomato, layered between three pieces of toast and served with FF', 120000, 'IDR', 0), ('Sandwiches', 'CHICKEN HOUSE SANDWICH', 'Romaine lettuce, rucola, cheese, grilled chicken breast and house dressing atop toasted ciabatta bread with FF', 130000, 'IDR', 1), ('Sandwiches', 'BARBEQUE CHICKEN SANDWICH', 'BBQ chicken, iceberg lettuce, cheese, tomato, onion, and cheese with FF', 140000, 'IDR', 2), ('Sandwiches', 'BEEF STEAK SANDWICH', 'Chargrilled fillets of beef with sauteed onions, mushrooms, cheese, served on toasted ciabatta bread with FF', 160000, 'IDR', 3), ('Rice Corner', 'INDONESIAN FRIED RICE', 'Make your choice of chicken, beef, prawn, or vegetables, served with 2 pcs of sate, crackers, sunny side up egg, pickles', 120000, 'IDR', 0), ('Rice Corner', 'SEAFOOD JAMBALAYA', 'A wonderful combination of seafood, rice, and vegetables cooked in classic flavour of Cajun seasonings like onion, green bell pepper and celery, mixed with prawn, calamari, baby lobster', 350000, 'IDR', 1), ('Rice Corner', 'PAELLA VALENCIA WITH PRAWN, CALAMARI, AND BABY LOBSTER', 'A Spanish classic fried rice with a saffron seasoning, olive oil, onion, garlic, parsley, red paprika, oregano', 350000, 'IDR', 2), ('Rice Corner', 'RISOTTO', 'Make your choice of mushroom, chicken, or seafood Italian rice dish cooked with broth until it reaches a creamy consistency', 100000, 'IDR', 3), ('Rice Corner', 'INDIAN BIRYANI RICE', 'Indian fried rice with fine-cut vegetables', 140000, 'IDR', 4), ('Rice Corner', 'PATTAYA THAI FRIED RICE', 'Fried rice of vegetables and chicken or seafood, comes with fried egg, with the flavour of coriander', 140000, 'IDR', 5), ('Ayam / Chicken', 'AYAM SAMBAL BAWANG (spicy)', '½ grilled or fried chicken with onion, lemongrass, and chilli, with the flavour of kaffir lime and homemade coconut oil, served with yellow rice or red rice and urab (steamed long bean and bean sprout)', 195000, 'IDR', 0), ('Ayam / Chicken', 'AYAM BAKAR SAUS MADU', '½ grilled spring chicken, with honey-ginger sauce, served with rice, steamed long bean and bean sprout with coconut dressing', 175000, 'IDR', 1), ('Ayam / Chicken', 'AYAM BETUTU', '½ steamed spring chicken in complete Balinese condiments served with red rice or yellow rice and vegetables', 175000, 'IDR', 2), ('Ayam / Chicken', 'HONG KONG GRILLED CHICKEN', '½ grilled chicken with hoisin sauce, chilli sambal and Hainan rice', 225000, 'IDR', 3), ('Ayam / Chicken', 'AYAM TEPI PANTAI CHICKEN SET MENU', '200 STARTER Salad Ayam Sisir Sambal Bawang Shredded chicken onion sambal salad with lettuce, cucumber, and tomato MAIN COURSE Ayam Bakar Sambal Bawang 1/2 grilled chicken with onion sambal dressing, coconut oil, kaffir lime, sliced tomato, and cucumber SIDE DISHES Jukut Urab Steamed vegetables with grated coconut sambal and the flavour of kaffir lime Nasi (rice) DESSERT Bubur Injin (black rice pud', 200000, 'IDR', 4), ('Bebek / Duck', 'BEBEK GORENG / BEBEK PANGGANG', '½ duck steamed then fried or grilled on charcoal, served with onion, lemongrass sambal, and chilli sambal, also rice and steamed vegetables', 195000, 'IDR', 0), ('Bebek / Duck', 'BEBEK BETUTU', '½ duck steamed in complete Balinese condiments, with the flavour of lemongrass and Asian bay leaves, served with yellow or plain rice and urab (steamed vegetables with grated coconut dressing)', 195000, 'IDR', 1), ('Bebek / Duck', 'PEKING DUCK', '½ roasted duck Hong Kong style, served with hoisin sauce, chilli sauce, Hainan rice, and asparagus crab soup', 275000, 'IDR', 2), ('Bebek / Duck', 'BEBEK TEPI PANTAI DUCK SET MENU', '250 STARTER Lumpia Bebek Duck Spring Roll MAIN COURSE 1/2 ekor Bebek goreng atau bakar 1/2 Duck grilled or fried Jukut Urab Steamed vegetables with grated coconut, sambal, and the flavour of kaffir lime SIDE DISHES Sambal Matah (onion and chilli with coconut oil) Sambal Pelecing (chilli sambal) Sauce Madu (butter lemon honey sauce) Nasi Tiga Warna (white rice, yellow rice and red rice) DESSERT Bua', 250000, 'IDR', 3), ('Mi Goreng / Fried Noodles', 'MI GORENG AYAM', 'Fried noodles with chicken and vegetables', 110000, 'IDR', 0), ('Mi Goreng / Fried Noodles', 'MI GORENG SARI SEGARA', 'Fried noodles with seafood and vegetables', 110000, 'IDR', 1), ('Mi Goreng / Fried Noodles', 'MI GORENG UDANG', 'Fried noodles with shrimp and vegetables', 130000, 'IDR', 2), ('Sate House', 'SATE AYAM / CHICKEN SATAY', 'Chicken satay in chilli sauce or peanut sauce served with urab, yellow or red rice', 140000, 'IDR', 0), ('Sate House', 'SATE SAPI / BEEF SATAY', 'Beef satay in chilli sauce or peanut sauce served with urab, yellow or red rice', 160000, 'IDR', 1), ('Sate House', 'SATE LANGUAN / SEAFOOD SATAY', 'Seafood satay of prawn, fish and squid in chilli sauce or peanut sauce served with urab and rice', 160000, 'IDR', 2), ('Sate House', 'SATE LILIT', 'Minced meat of chicken or seafood with shredded young coconut, chilli and kaffir lime, on lemongrass skewer served with urab, yellow or red rice and peanut or tamarind sauce', 140000, 'IDR', 3), ('Sate House', 'KEBAB ON SKEWER', 'Beef or chicken with paprika, onion, pineapple grilled on skewer served with yellow rice or red rice with urab and peanut or tamarind sauce', 140000, 'IDR', 4), ('Janganan / Vegetables', 'JUKUT URAB', 'Mixed steamed vegetables with shredded coconut sambal', 75000, 'IDR', 0), ('Janganan / Vegetables', 'KACANG MEKALAS', 'Steamed long beans with coconut dressing', 75000, 'IDR', 1), ('Janganan / Vegetables', 'CHAP CHAY', 'Vegetable soup with chicken or seafood', 95000, 'IDR', 2), ('Janganan / Vegetables', 'BROCCOLI CHA', 'Plain Braised Broccoli', 95000, 'IDR', 3), ('Janganan / Vegetables', 'KANGKUNG CHA', 'Sauteed Chinese water spinach', 75000, 'IDR', 4), ('Janganan / Vegetables', 'CAH PAKCOY', 'Garlic ginger pakcoy (cabbage) with seafood', 120000, 'IDR', 5), ('Janganan / Vegetables', 'SAPO TAHU', null, 150000, 'IDR', 6), ('Thai Corner and Curry', 'GAENG DANG NUA / RED BEEF CURRY', 'Thai red beef curry with coconut milk, vegetables, basil and coriander', 160000, 'IDR', 0), ('Thai Corner and Curry', 'GAENG KIEW WARN NUA / GREEN BEEF CURRY', 'Thai green beef curry with coconut milk, vegetables, basil and coriander', 160000, 'IDR', 1), ('Thai Corner and Curry', 'NUA PAD MAN HOY', 'Stir-fried sliced beef with oyster sauce', 160000, 'IDR', 2), ('Thai Corner and Curry', 'GAENG DANG KAI / RED CHICKEN CURRY', 'Thai red chicken curry with coconut milk, vegetables, basil and coriander', 145000, 'IDR', 3), ('Thai Corner and Curry', 'GAENG KIW WARN KAI / GREEN CHICKEN CURRY', 'Thai green chicken curry with coconut milk, vegetables, basil and coriander', 145000, 'IDR', 4), ('Thai Corner and Curry', 'KAI PAMA MUAN', 'Stewed chicken with cashew nuts, served with rice', 145000, 'IDR', 5), ('Thai Corner and Curry', 'GAENG KIEW WARN TALAY', 'Prawns, calamari, and fish in Thai green curry with snake beans, pumpkin and fragrant basil', 195000, 'IDR', 6), ('Thai Corner and Curry', 'GOONG PAD BAI KRAPOW', 'Pan-fried prawns with basil, paprika and onions', 210000, 'IDR', 7), ('Thai Corner and Curry', 'CHOO CHEE TALAY', 'Prawns, calamari and fish with Thai dried curry paste and a dash of coconut milk', 210000, 'IDR', 8), ('Thai Corner and Curry', 'PAD THAI', 'Seafood Thai noodle', 210000, 'IDR', 9), ('Kids Menu', 'FISH AND CHIPS', 'with tomato sauce or mayonnaise', 90000, 'IDR', 0), ('Kids Menu', 'FRIED BRAIDED KING PRAWN', 'with potato puree or mashed potato', 90000, 'IDR', 1), ('Kids Menu', 'SPAGHETTI or PENNE or FETTUCINE', 'with mushroom cream sauce or freshly made tomato sauce', 70000, 'IDR', 2), ('Kids Menu', 'CHICKEN NUGGETS', 'served with tomato sauce or mayonnaise', 70000, 'IDR', 3), ('Kids Menu', 'CHICKEN SATAY', 'with tomato sauce or BBQ sauce', 70000, 'IDR', 4), ('Kids Menu', 'GRILLED CHICKEN STRIP', 'with mushroom cream sauce', 70000, 'IDR', 5), ('Kids Menu', 'PRAWN OMELETTE or CHICKEN OMELETTE', null, 80000, 'IDR', 6)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'jimbaran-bay-beach-resort-spa-jimbaran' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Lotus Spa', 1, 'draft', 'partial', 'https://www.jimbaranbaybeach.com/spa', 'Official Jimbaran Bay Beach Resort Spa menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'b1241621f1b8417e38cf8aeb36435c27bf1203448ea4806a5c8e86b7a55e44ba', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Regular Treatment', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Regular Treatment', 'Lotus Signature 60 Minutes', null, 450000, 'IDR', 0), ('Regular Treatment', 'Lotus Signature 90 Minutes', null, 510000, 'IDR', 1), ('Regular Treatment', 'Balinese Massage 60 Minutes', 'Full body massage with choices of massage oils, combining Balinese Ancient Technique with deep tissue and pressure point *Strong Massage*', 414000, 'IDR', 2), ('Regular Treatment', 'Balinese Massage 90 Minutes', 'Full body massage with choices of massage oils, combining Balinese Ancient Technique with deep tissue and pressure point *Strong Massage*', 474000, 'IDR', 3), ('Regular Treatment', 'Balinese Massage 120 Minutes', 'Full body massage with choices of massage oils, combining Balinese Ancient Technique with deep tissue and pressure point *Strong Massage*', 540000, 'IDR', 4), ('Regular Treatment', 'Relaxing Massage 60 Minutes', 'Full body massage with choices of massage oils to reduce stress and good for relaxation *Gentle-Medium Massage*', 360000, 'IDR', 5), ('Regular Treatment', 'Relaxing Massage 90 Minutes', 'Full body massage with choices of massage oils to reduce stress and good for relaxation *Gentle-Medium Massage*', 414000, 'IDR', 6), ('Regular Treatment', 'Relaxing Massage 120 Minutes', 'Full body massage with choices of massage oils to reduce stress and good for relaxation *Gentle-Medium Massage*', 510000, 'IDR', 7), ('Regular Treatment', 'Foot Reflexology 60 Minutes', 'Pressure point on feet area including short shoulder massage at the end', 402000, 'IDR', 8), ('Regular Treatment', 'Back, Neck and Shoulder 45 Minutes', 'Pressure point on Lower Back, shoulder, including gentle neck massage', 342000, 'IDR', 9), ('Regular Treatment', 'Pregnancy Massage 60 Minutes', 'Relaxing body massage for pregnant woman with minimum 3-month-old pregnancy', 342000, 'IDR', 10), ('Regular Treatment', 'Hot Stone Massage 120 Minutes', null, 660000, 'IDR', 11), ('Regular Treatment', 'Sunburn Body Mask 30 Minutes', null, 300000, 'IDR', 12), ('Regular Treatment', 'Body Scrub 30 Minutes', null, 270000, 'IDR', 13), ('Regular Treatment', 'Milk Bath / Flower Bath 30 Minutes', null, 210000, 'IDR', 14)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'karma-spa-at-karma-jimbaran-jimbaran' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Karma Spa Treatments', 1, 'draft', 'partial', 'https://karmagroup.com/find-destination/karma-resorts/karma-jimbaran/attachment/karma-jimbaran-spa-menu-4', 'Official Karma Spa at Karma Jimbaran menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '66b1fba1f4de2962d77832f6c999d54f3977247870f104c404f7e15d4d42066d', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Massage Therapy and Bodywork', 0), ('Get the Glow', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Massage Therapy and Bodywork', 'KARMA SURRENDER', 'This signature ‘wow’ neck and shoulder therapy is designed to release all the tension in your upper body, neck and shoulders. It consists of a warm aromatherapy compress to help ease you into deep surrender -- drift away!', 550000, 'IDR', 0), ('Massage Therapy and Bodywork', 'KARMA RHYTHM MASSAGE', 'Need a recharge? Our award-winning signature massage is loaded with extra back, neck, shoulder and lower back focus. Karma’s bodyworkers press the key points to boost circulation and flow. This treatment was devised by Traditional Chinese Medicine practitioner, Joko tri Li. Feel all your tension melt away.', 650000, 'IDR', 1), ('Massage Therapy and Bodywork', 'THERAPEUTIC JET LAG CURE', 'When you are feeling drained from the digital devices. Include a signature Karma Surrender neck and shoulder release enhanced with warm ginger compresses to reduce tension and inflammation. Designed to counter issues caused from staring down at our devices. Depart feeling happy and free.', 600000, 'IDR', 2), ('Get the Glow', 'YOGA ACUPRESSURE FACIAL', 'A beautifully slow facial treatment to nourish your skin and nurture your mind. Includes a mind-soothing facial massage with acupressure.', 450000, 'IDR', 0), ('Get the Glow', 'HOLISTIC FACIAL', 'This pure facial consists of a deep cleanse and exfoliation followed by hydration mask, creams and serums. It begins with a Karma Surrender neck and shoulder massage therapy.', 550000, 'IDR', 1), ('Get the Glow', 'MICRO-EXFOLIATION FACIAL', 'This is a gentle machine-based exfoliation recommended for reducing pigmentation, acne and fine lines. A gentle tip is smoothed around your face, neck and décolleté area to remove dead skin, stimulate collagen and enhance a clear complexion. Sunscreen is applied after this treatment.', 450000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'mapogu-coffee-and-eatery-mapogu-restaurant' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The full menu', 1, 'draft', 'partial', 'https://mapogu.com', 'Official Mapogu Coffee & Eatery Mapogu Restaurant menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'a476b6535479b1eba23ae35af1a4830eacef9caeee2bba28c39bd15e4fbe6553', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Breakfast', 0), ('B.Y.O.B — Build Your Own', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Breakfast', 'Mushroom Toast', 'Sautéed mushroom, kale, poached egg, bacon & smashed avocado on sourdough with tomato basil sauce and salad.', 70000, 'IDR', 0), ('Breakfast', 'Mapogu Breakfast Sandwich', 'Bacon, brown-butter scrambled egg & chilli mayo in a brioche bun with coleslaw.', 60000, 'IDR', 1), ('Breakfast', 'Avocado on Toast with Poached Egg', 'Smashed avocado, poached egg and cherry tomato on sourdough.', 60000, 'IDR', 2), ('Breakfast', 'Omelette & Kale', '3-egg omelette with kale & mushrooms, sourdough toast, grilled tomato and salad.', 60000, 'IDR', 3), ('Breakfast', 'Yellow Mellow Smoothie', 'Mango, banana & pineapple smoothie with granola, dried coconut, strawberry & banana. Add 25g whey +5g BCAA.', 60000, 'IDR', 4), ('Breakfast', 'Pitaya Smoothie Bowl', 'Dragon-fruit smoothie with granola, dried coconut, strawberry & banana. Add 25g whey +5g BCAA.', 60000, 'IDR', 5), ('B.Y.O.B — Build Your Own', '2 Eggs Your Way', null, 20000, 'IDR', 0), ('B.Y.O.B — Build Your Own', '2 Rashes of Bacon', null, 25000, 'IDR', 1), ('B.Y.O.B — Build Your Own', 'Grilled Chicken Breast', null, 30000, 'IDR', 2), ('B.Y.O.B — Build Your Own', '2 Chicken Sausages', null, 25000, 'IDR', 3), ('B.Y.O.B — Build Your Own', '2 Hash Browns', null, 25000, 'IDR', 4), ('B.Y.O.B — Build Your Own', 'Plain Croissant', null, 25000, 'IDR', 5), ('B.Y.O.B — Build Your Own', 'Mozzarella', null, 25000, 'IDR', 6), ('B.Y.O.B — Build Your Own', 'Sautéed Veggies', null, 25000, 'IDR', 7), ('B.Y.O.B — Build Your Own', 'Fries', null, 20000, 'IDR', 8), ('B.Y.O.B — Build Your Own', 'Smashed Avocado', null, 20000, 'IDR', 9), ('B.Y.O.B — Build Your Own', '2 Slices of Sourdough', null, 20000, 'IDR', 10), ('B.Y.O.B — Build Your Own', 'Mixed Salad', null, 20000, 'IDR', 11), ('B.Y.O.B — Build Your Own', '2 Flour Tortilla Wraps', null, 15000, 'IDR', 12), ('B.Y.O.B — Build Your Own', 'Sautéed Mushroom', null, 15000, 'IDR', 13), ('B.Y.O.B — Build Your Own', 'Rice', null, 15000, 'IDR', 14), ('B.Y.O.B — Build Your Own', 'Grilled Tomato', null, 10000, 'IDR', 15), ('B.Y.O.B — Build Your Own', 'Fried Tempe', null, 10000, 'IDR', 16), ('B.Y.O.B — Build Your Own', 'Fried Tofu', null, 10000, 'IDR', 17)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'movenpick-resort-and-spa-jimbaran-fitness' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Movenpick MS Hamees Sailing Dates 2026', 1, 'draft', 'partial', 'https://movenpick.accor.com/content/dam/brands/mov/hotels/africa/eg/nile-cruisers/movenpick-ms-hamees/pdf/msa_d_0000247.pdf', 'Official Mövenpick Resort & Spa Jimbaran Fitness menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '432daf786675310a36cfc58477b6706a76bb41f4135e53b3248443d328a38091', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'January 5th', null, 5000, 'IDR', 0), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'January 12th', null, 12000, 'IDR', 1), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'January 19th', null, 19000, 'IDR', 2), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'January 26th', null, 26000, 'IDR', 3), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'February 9th', null, 9000, 'IDR', 4), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'February 16th', null, 16000, 'IDR', 5), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'February 23rd', null, 23000, 'IDR', 6), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'March 9th', null, 9000, 'IDR', 7), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'March 16th', null, 16000, 'IDR', 8), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'March 23rd', null, 23000, 'IDR', 9), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'March 30th', null, 30000, 'IDR', 10), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'April 6th', null, 6000, 'IDR', 11), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'April 13th', null, 13000, 'IDR', 12), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'April 20th', null, 20000, 'IDR', 13), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'April 27th', null, 27000, 'IDR', 14), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'May 11th', null, 11000, 'IDR', 15), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'May 18th', null, 18000, 'IDR', 16), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'May 25th', null, 25000, 'IDR', 17), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'June 8th', null, 8000, 'IDR', 18), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'June 15th', null, 15000, 'IDR', 19), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'June 22nd', null, 22000, 'IDR', 20), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'June 29th', null, 29000, 'IDR', 21), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'July 6th', null, 6000, 'IDR', 22), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'July 13th', null, 13000, 'IDR', 23), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'July 20th', null, 20000, 'IDR', 24), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'July 27th', null, 27000, 'IDR', 25), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'August 10th', null, 10000, 'IDR', 26), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'August 17th', null, 17000, 'IDR', 27), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'August 24th', null, 24000, 'IDR', 28), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'August 31st', null, 31000, 'IDR', 29), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'September 7th', null, 7000, 'IDR', 30), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'September 14th', null, 14000, 'IDR', 31), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'September 21st', null, 21000, 'IDR', 32), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'September 28th', null, 28000, 'IDR', 33), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'October 5th', null, 5000, 'IDR', 34), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'October 12th', null, 12000, 'IDR', 35), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'October 19th', null, 19000, 'IDR', 36), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'October 26th', null, 26000, 'IDR', 37), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'November 9th', null, 9000, 'IDR', 38), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'November 16th', null, 16000, 'IDR', 39), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'November 23rd', null, 23000, 'IDR', 40), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'November 30th', null, 30000, 'IDR', 41), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'December 7th', null, 7000, 'IDR', 42), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'December 14th', null, 14000, 'IDR', 43), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'December 21st', null, 21000, 'IDR', 44), ('4 Nights / 5 Days Ex. Luxor ‒ Aswan', 'December 28th', null, 28000, 'IDR', 45)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'thermes-marins-bali-spa-at-ayana-jimbaran' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'SPA CAFÉ MENU', 1, 'draft', 'partial', 'https://share.ayana.com/bali/Spa%20Cafe%20Menu/files/assets/common/downloads/publication.pdf', 'Official Thermes Marins Bali Spa at AYANA menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '3eff82105c2b0813055b45ee9943a2c74a61f54c25c51024bba7dbeba15bad02', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('HEALTHY DRINK FOR MIND & BODY', 0), ('HAPPY JUICES', 1), ('SMOOTHIES AND MIX JUICE', 2), ('COFFEE, TEA & WATER', 3)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('HEALTHY DRINK FOR MIND & BODY', 'VITALITY', 'Carrot, Apple, Celery and Lemon', 80000, 'IDR', 0), ('HEALTHY DRINK FOR MIND & BODY', 'INDULGENCE', 'Banana, Fresh Pineapple, Pineapple Juice and Coconut Milk', 80000, 'IDR', 1), ('HEALTHY DRINK FOR MIND & BODY', 'ANTI OXIDANT', 'Carrot, Tomato and Bellpeppers', 80000, 'IDR', 2), ('HEALTHY DRINK FOR MIND & BODY', 'RESFRESHING', 'Fresh Orange, Guava Juice and Fresh Strawberry', 80000, 'IDR', 3), ('HEALTHY DRINK FOR MIND & BODY', 'REBALANCE', 'Apple, Cucumber, Fresh Ginger and Mint Leaf', 80000, 'IDR', 4), ('HAPPY JUICES', 'Banana, Yoghurt and Apple', null, 80000, 'IDR', 0), ('SMOOTHIES AND MIX JUICE', 'BALBOA SPECIAL', 'Banana, Non-fat Yogurt, Fresh Orange Juice', 80000, 'IDR', 0), ('SMOOTHIES AND MIX JUICE', 'GLOWING RED', 'Red Dragon Fruit, Pineapple, Banana', 80000, 'IDR', 1), ('SMOOTHIES AND MIX JUICE', 'FRUIT SMOOTHIES', 'Choice of 1 or 2 fruits: Orange, Apple, Pineapple, Grapefruit, Carrot, Strawberry', 80000, 'IDR', 2), ('SMOOTHIES AND MIX JUICE', 'CRANBERRY SUNRISE', 'Cranberry, Orange, Strawberry', 80000, 'IDR', 3), ('SMOOTHIES AND MIX JUICE', 'GOOD MORNING', 'Banana, Espresso, Non-fat Yogurt', 80000, 'IDR', 4), ('SMOOTHIES AND MIX JUICE', 'STRAWBERRY DAZZLER', 'Apple, Yogurt, Banana, Strawberry', 80000, 'IDR', 5), ('COFFEE, TEA & WATER', 'COFFEE', 'Various types of coffee', 65000, 'IDR', 0), ('COFFEE, TEA & WATER', 'SELECTION OF TEA', null, 50000, 'IDR', 1), ('COFFEE, TEA & WATER', 'FIJI WATER', 'Small and Large', 60000, 'IDR', 2), ('COFFEE, TEA & WATER', 'EQUIL NATURAL WATER / SPARKLING WATER', 'Small and Large', 45000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'brook-nusa-dua' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'BROOK Nusa Dua menu', 1, 'draft', 'partial', 'https://brookbali.com/menu', 'Official BROOK Nusa Dua menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '0c1f1d4d535033ff59f179ae163c947bf3c4e5e276af4961f590acd51c28392b', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Breakfast', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Breakfast', 'RICE PORRIGE WITH MANGO AND COCONUT', 'Creamy rice porridge made with coconut milk, topped with juicy mango, coconut sauce, and crunchy caramelized hazelnuts.', 55000, 'IDR', 0), ('Breakfast', 'OATMEAL WITH PUMPKIN AND HAZELNUT', 'Creamy oatmeal cooked with milk and water, served with honey, caramelized pumpkin, crunchy hazelnuts, and fragrant local basil.', 55000, 'IDR', 1), ('Breakfast', 'TOAST WITH SALTED SALMON AND GUACAMOLE', 'Grilled sourdough toast topped with creamy guacamole, lightly cured salmon, fresh cucumber, and a poached egg. Served with edamame, mixed greens, Parmesan cheese, and olive oil.', 130000, 'IDR', 2), ('Breakfast', 'TOAST POACHED EGG AND GUACAMOLE', 'Sourdough bread is grilled until crispy and golden, then cut into two pieces. Each piece is spread with fresh avocado guacamole, topped with two poached eggs, and finished with Niçoise sauce made from egg yolks, olive oil, mustard, vinegar, and honey. Garnish with fresh dill and olive oil before serving.', 75000, 'IDR', 3), ('Breakfast', 'OMLETTE WITH AVOCADO AND PARMEZAN', 'The omelette is made with three eggs seasoned with salt and cooked in butter until soft and fluffy. It is served on a plate with fresh sliced avocado and Montega cheese, then finished with grated parmesan cheese and olive oil on top.', 75000, 'IDR', 4), ('Breakfast', 'SHAKSHUKA', 'Traditional Middle Eastern shakshuka with two eggs gently poached in a rich tomato sauce with onions, paprika, fresh tomatoes, cumin, cilantro, parsley, and roasted chickpeas. Served with toasted pita bread.', 75000, 'IDR', 5), ('Breakfast', 'ENGLISH BREAKFAST', 'A hearty English breakfast with a chicken sausage, two fried eggs, baked beans in tomato sauce, Napoli sauce, fresh salad, butter, and toasted sourdough bread.', 115000, 'IDR', 6), ('Breakfast', 'SIRNIKI WITH COCONUT SAUCE, MANGO AND PEACH', 'Golden cottage cheese pancakes made with cream cheese, served with fresh mango coconut sauce, juicy peach, coconut chips, and finished with powdered sugar.', 105000, 'IDR', 7), ('Breakfast', 'SIRNIKI WITH RASPBERRY JAM AND SOURCREAM', 'Golden cottage cheese pancakes made with cream cheese and a hint of vanilla. Served with berry jam, sour cream, seasonal berries, and finished with powdered sugar.', 105000, 'IDR', 8), ('Breakfast', 'GREEN BUCKWHEAT WITH POACHED EGG', 'Warm green buckwheat dressed with olive oil, served with avocado, edamame, a poached egg, Parmesan cheese, and mixed greens. Accompanied by a creamy herb sauce.', 95000, 'IDR', 9), ('Breakfast', 'DRANIKI WITH SOURCREAM', 'Crispy Belarusian-style potato pancakes served with sour cream, herb butter, fresh dill, and parsley.', 75000, 'IDR', 10), ('Breakfast', 'CROISSANT WITH BACON AND CHEESE', 'A buttery croissant filled with crispy bacon and melted mozzarella, baked until golden.', 70000, 'IDR', 11), ('Breakfast', 'CROISSANT WITH BUTTER', 'A flaky butter croissant served with whipped New Zealand butter and your choice of jam.', 55000, 'IDR', 12), ('Breakfast', 'OYSTER', 'Fresh oysters with Mignonette sauce, lemon, seaweed', 25000, 'IDR', 13), ('Breakfast', 'LEBANESE HUMMUS AND PITA', 'Smooth chickpea hummus with creamy tahini paste, fresh lime juice, and olive oil. Perfect with crispy pita bread.', 75000, 'IDR', 14), ('Breakfast', 'TUNA TARTARE WITH MANGO, GUACAMOLE', 'Finely chopped raw tuna is seasoned with salt, pepper, and olive oil. Served with guacamole mixed with olive oil, salt, and cilantro, and ponzu sauce. The dish is garnished with sesame seeds, cilantro, and nori seaweed.', 95000, 'IDR', 15)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'giorgio-italian-restaurant-at-hotel-nikko-bali-benoa-beach' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Giorgio Chef Recommendation', 1, 'draft', 'partial', 'https://hotelnikkobali-benoabeach.com/dining/giorgio-italian-ristorante-pizzeria/', 'Official Giorgio Italian Restaurant at Hotel Nikko Bali Benoa Beach menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '3612ed1d8dc64559394ca952d54d543659e2755b8ca8ad56258bdad5f2738d5e', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Chef''s Special', 0), ('Pizza', 1), ('Pasta', 2), ('Risotto', 3), ('Starter', 4), ('Main Course', 5), ('Dessert', 6), ('Kids Menu', 7), ('Course Menu', 8), ('International', 9), ('Snack', 10), ('Pizza (2)', 11)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Chef''s Special', 'Linguini and Meatball', 'Flat spaghetti with meatballs in tomato sauce, grana padano, extra virgin olive oil.', 140000, 'IDR', 0), ('Chef''s Special', 'Lasagna al pollo i fungi', 'Lasagna with forest mushroom, smoke chicken, mascarpone cheese, tomato sauce, extra virgin olive oil.', 145405, 'IDR', 1), ('Chef''s Special', 'Tortelinne al formaggio di capra conpinoli', 'Homemade tortelinne with goat cheese, raisins, pine nuts, and noisette butter.', 165000, 'IDR', 2), ('Chef''s Special', 'Carpaccio Di Manzo', 'Fine silver beef, mixed salanova, balsamico, evo.', 135000, 'IDR', 3), ('Chef''s Special', 'Pollo alla Positano', 'Stuffed chicken breast with prosciutto, cheddar cheese, asparagus, summer veggies natural jus, and evo.', 210000, 'IDR', 4), ('Chef''s Special', 'Bistecca di Salmone', 'Pan-seared fresh salmon, spinach tagliatelle, avocado cream mustard, saute broccoli asparagus, and evo.', 250000, 'IDR', 5), ('Pizza', 'Schiacciatina Al Rosmarino', 'Pizza bread with rosemary.', 70000, 'IDR', 0), ('Pizza', 'Margherita Pizza', 'Tomato, mozzarella, fresh basil.', 135000, 'IDR', 1), ('Pizza', 'Calzone', 'Pizza pocket filled with, mozzarella, cherry tomato, mushrooms, and cooked pork ham.', 165000, 'IDR', 2), ('Pizza', 'Regina Pizza', 'Tomato, mozzarella, mushrooms, and cooked pork ham.', 170000, 'IDR', 3), ('Pizza', 'Giorgio Pizza', 'Tomato, prosciutto, burrata, rucola, cherry tomato, parmesan cheese.', 170000, 'IDR', 4), ('Pizza', 'Capricciosa Pizza', 'Tomato, mozzarella, mushrooms, cooked ham, artichokes, black olives.', 175000, 'IDR', 5), ('Pizza', 'Alla Diavola Pizza', 'Tomato, mozzarella, chilli-hot salami.', 175000, 'IDR', 6), ('Pizza', 'Frutti Di Mare Pizza', 'Tomato, mozzarella, seafood.', 190000, 'IDR', 7), ('Pizza', 'Quatro Formaggi Pizza', 'Four kinds of cheese, tomato, and ruccola.', 175000, 'IDR', 8), ('Pizza', 'Vegetariana Pizza', 'Tomato, mozzarella, mushrooms, eggplant, zucchini, bell pepper.', 165000, 'IDR', 9), ('Pasta', 'Spaghetti Aglio Olio Peperoncino', 'Spaghetti with garlic, olive oil, fresh chilli, and parsley.', 135000, 'IDR', 0), ('Pasta', 'Penne Alla Arrabiata', 'Penne with spicy tomato sauce.', 135000, 'IDR', 1), ('Pasta', 'Cannelloni Zucca E Mandorle', 'Roast pumpkin and almond cannelloni, sage, asparagus, burn butter and extra virgin olive oil.', 140000, 'IDR', 2), ('Pasta', 'Linguini Al Tonno', 'Flat spaghetti with fresh tuna, black olives, fresh cherry tomato, and lemon.', 135000, 'IDR', 3), ('Pasta', 'Rigatoni Alla Bollognese', 'Rigatoni with beef ragu in tomato sauce.', 155000, 'IDR', 4), ('Pasta', 'Penne Alla Amatriciana', 'Penne with pork bacon, onion, and tomato sauce.', 135000, 'IDR', 5), ('Pasta', 'Lasagna All Bolognese', 'Homemade lasagna bolognese.', 175000, 'IDR', 6), ('Pasta', 'Tortelline Al Formaggio Di Capra Con Pinoli', 'Homemade tortellini with goat cheese, raisins, pine nuts, and noisette butter.', 165000, 'IDR', 7), ('Pasta', 'Spaghetti Alla Carbonara', 'Spaghetti with egg, pork bacon, and black pepper.', 150000, 'IDR', 8), ('Pasta', 'Spaghetti All Scoglio', 'Spaghetti with seafood sauce.', 175000, 'IDR', 9), ('Risotto', 'Risotto Al Funghi', 'Italian arborio rice tossed with onion and fresh mushrooms.', 140000, 'IDR', 0), ('Risotto', 'Risotto Al Frutti Di Mare', 'Italian arborio rice tossed with seafood and light tomato sauce.', 190000, 'IDR', 1), ('Starter', 'Instalata Verde De Mista', 'Mixed salanova, balsamico and extra virgin olive oil.', 80000, 'IDR', 0), ('Starter', 'Melone Prosciutto', 'Fine sliver prosciutto, mixed salanova, balsamico and extra virgin olive oil.', 125000, 'IDR', 1), ('Starter', 'Calamari Fritti', 'Golden calamari and tartar sauce.', 125000, 'IDR', 2), ('Main Course', 'Pollo Arosto alla Romana', 'Roast half chicken in lemon mustard broth, potato wedges, summer veggie and extra virgin olive oil.', 165000, 'IDR', 0), ('Main Course', 'Contro Filetto Alla il Mio', 'Grilled beef sirloin, mashed potato, grilled vegetables, onion ring, natural jus and extra virgin olive oil.', 275000, 'IDR', 1), ('Dessert', 'Ice Cream', '1 scoop of ice cream of the day with fruits coulis and chocolate.', 55000, 'IDR', 0), ('Dessert', 'Baked Cheese Cake', 'Cheesecake served with chocolate sauce and fruit coulis.', 80000, 'IDR', 1), ('Kids Menu', 'Baby Turtle Fish Finger', 'With fries and tartar sauce.', 90000, 'IDR', 0), ('Kids Menu', 'Cheeky Chicken Nuggets', 'With fries & tomato ketchup.', 90000, 'IDR', 1), ('Course Menu', 'Giorgio Course Menu 1', 'Insalata Verde De Mista | Lasagna All Bolognese | Baked Cheese Cake', 275000, 'IDR', 0), ('International', 'Nasi Goreng Champion', 'Java-style fried rice, fried chicken wing, chicken satay, sunny side up, and bocah tua cracker.', 145000, 'IDR', 0), ('Snack', 'Deep-Fried Mini Spring Roll', 'Vegetable spring roll with sweet Thai chilli sauce.', 75000, 'IDR', 0), ('Snack', 'Truffle Fries', 'Shoestring fries, truffle oil, Parmesan cheese, and spring onion.', 75000, 'IDR', 1), ('Pizza (2)', 'Schiacciatina Al Rosmarino', 'Pizza bread with rosemary.', 70000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'ikan-restaurant-and-bar-at-the-westin-resort-nusa-dua-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Dinner Menu', 1, 'draft', 'partial', 'https://www.ikanrestaurant.com/resourcefiles/pdf/new-nightime-menu-july-2024.pdf', 'Official IKAN Restaurant and Bar at The Westin Resort Nusa Dua, Bali menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '127035b84237df68dfa8da1d97ae9ed9f4089c25b9a4acff1502712bd6f2e21f', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Starters', 0), ('Main Course', 1), ('Desserts', 2)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Starters', 'Spring Rolls', 'Crispy spring rolls filled with veggies.', 50000, 'IDR', 0), ('Starters', 'Chicken Satay', 'Skewered chicken served with peanut sauce.', 75000, 'IDR', 1), ('Main Course', 'Nasi Goreng', 'Fried rice with vegetables and chicken.', 85000, 'IDR', 0), ('Main Course', 'Vegan Curry', 'Rich curry made with seasonal vegetables.', 70000, 'IDR', 1), ('Desserts', 'Chocolate Cake', 'Moist chocolate cake with vanilla ice cream.', 60000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'jard-or-french-fusion-brasserie' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'JARD''OR French Fusion Brasserie menu', 1, 'draft', 'partial', 'https://cms.jardor.com/storage/menu-category-pdf/cfJviOC8NmYONSTu7Du2CDo0Yr5LSPICPo5XAXkS.pdf', 'Official JARD''OR French Fusion Brasserie menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'e7eb7beff80d68da49593e3e03dcdc794e38a6e84475c9f6fec2e65bbd928c27', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Desserts', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Desserts', 'Tarte Tatin Jard''Or', 'Our interpretation of a classic — caramelized apples served with caramel popcorn, creamy gelato, smooth mascarpone cream, and a crisp almond crumble.', 90000, 'IDR', 0), ('Desserts', 'Chocolate Millefeuille', '70% chocolate crèmeux complemented by raspberry ganache, airy chocolate espuma, and raspberry gel.', 110000, 'IDR', 1), ('Desserts', 'Pavlova Mangue-Fruits de la Passion', 'Light vanilla meringue topped with tropical mango and passion-fruit compote, finished with a zesty lime-mint lassi.', 90000, 'IDR', 2), ('Desserts', 'Grand Marnier Soufflé', 'A light and airy soufflé, served warm with creamy vanilla gelato and flambéed Grand Marnier.', 130000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'mulia-spa-nusa-dua' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Revitalizing Wellness Treatments', 1, 'draft', 'partial', 'https://www.themulia.com/bali/experiences/spas/revitalizing-wellness-treatments', 'Official Mulia Spa menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '940abed8fe5ca96750ffccb3feb4fed23d1373719694bf9c46d3871ea01655f3', 'spa'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'spa')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Wellness', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Wellness', 'Restorative Body Massage (90 minutes)', 'A fusion of lymphatic techniques, acupressure, and deep strokes to release tension and stimulate circulation.', 150000, 'IDR', 0), ('Wellness', 'Revitalizing Marine Algae Facial (90 minutes)', 'A nutrient-rich facial for all skin types, paired with a soothing foot massage.', 180000, 'IDR', 1), ('Wellness', 'Invigorating Body Treatment (75 minutes)', 'A blend of dry brushing, scrub or wrap, and a relaxing back or foot massage for circulation and skin radiance.', 160000, 'IDR', 2), ('Wellness', 'Hand & Foot Stress Reliever (60 minutes)', 'Targets lymphatic pathways and acupressure points to restore relaxation and well-being.', 120000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'nagisa-japanese-restaurant-at-hotel-nikko-bali-benoa-beach' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Our Menu', 1, 'draft', 'partial', 'https://hotelnikkobali-benoabeach.com/dining/nagisa-japanese-izakaya-experience/', 'Official Nagisa Japanese Restaurant at Hotel Nikko Bali Benoa Beach menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'd233e3936705e9342067319d2d26c42ac530594d9369e5d46f2ede3db1ebae45', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Chef''s Recommendation', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Chef''s Recommendation', 'Sushi Moriawase', 'Assorted sushi of fresh tuna, salmon, barramundi, prawn and sweet egg cake, served with miso soup', 280000, 'IDR', 0), ('Chef''s Recommendation', 'Yakitori Moriawase', 'Assorted chicken yakitori, shiitake mushroom with sweet soy sauce or salt seasoning', 120000, 'IDR', 1), ('Chef''s Recommendation', 'Chef''s Omakase', '7 kinds of seasonal Japanese appetizers, Professionally & beautifully arranged slices of seasonal sashimi from the sea of Bali, Grilled tokusen wagyu and garlic sauce, King prawn and vegetable tempura together with tasty dipping sauce, Japanese rice, Pickles, Miso soup, Tempura ice cream with sliced seasonal fruits', 580000, 'IDR', 2), ('Chef''s Recommendation', 'Omakase Sushi', 'For 2 (two) persons - Small appetizer, Assorted sushi, Assorted sushi rolled, Assorted sashimi, Miso soup, Dessert', 399000, 'IDR', 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'piasan-nusa-dua-restaurant-piasan-restaurant' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'New Year’s Eve Menu', 1, 'draft', 'partial', 'https://piasanrestaurant.com/new-years-eve-celebration-at-piasan-restaurant-4-course-italian-set-menu-with-wine', 'Official Piasan Nusa Dua Restaurant Piasan Restaurant menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '13adde852d68b0ceaae8c5d87f7905d8bbcf0e57f482c2fb11f714774828883a', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Starters', 0), ('Main Course', 1), ('Dessert', 2), ('Beverages', 3)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Starters', 'Watermelon Fetta Avocado Tuna Tartar', 'with honey lemon dressing', 950000, 'IDR', 0), ('Starters', 'Seafood Bisque', 'pan-seared prawn, scallop, fish, squid with creamy lobster bisque', 950000, 'IDR', 1), ('Main Course', 'Surf and Turf', 'pan-seared tenderloin steak, Cajun glazed lobster tail, mashed potato & vegetables', 950000, 'IDR', 0), ('Main Course', 'Roasted Crushed Macadamia Salmon', 'served with pumpkin ravioli, vegetables, and orange honey sauce', 950000, 'IDR', 1), ('Dessert', 'Banana Baileys Mousse Cake', 'glazed with salted caramel sauce and chopped pistachio', 950000, 'IDR', 0), ('Beverages', 'Coffee or Tea', null, 950000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'prego-at-the-westin-resort-nusa-dua-bali' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Our Menus', 1, 'draft', 'partial', 'https://www.pregobali.com/our-menus', 'Official Prego at The Westin Resort Nusa Dua, Bali menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '88b2b155cdd110f7c74d4f41437c25f338801b86b895ba72cbe585147e8b2490', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Lunch Menu', 0), ('Dinner Menu', 1), ('Kids Menu', 2), ('Dessert Menu', 3), ('Beverages Menu', 4)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Lunch Menu', 'Marinated Olives', 'A trio of Bella di Cerignola, leccino, kalamata olives, marinated with citrus, herbs.', 150000, 'IDR', 0), ('Lunch Menu', 'Bruschetta al Crudo di Parma', 'Stone baked ciabatta, charred artichoke cream, Parma ham and burrata cheese.', 220000, 'IDR', 1), ('Lunch Menu', 'Bruschetta al Pomodoro', 'Homemade chargrilled sourdough, sundry tomato pesto, Bedugul heirloom cherry tomato, cured beef tomato, cherry tomato confit, home grow fresh basil.', 210000, 'IDR', 2), ('Lunch Menu', 'Croquettes', 'Coppa di Martina Franca croquettes, grape must mayonnaise.', 190000, 'IDR', 3), ('Lunch Menu', 'Carpaccio di Salmone', '16 hours marinated smoked salmon, fennel, citrus dressing, olives, capers berry, red onion pickles, dill.', 230000, 'IDR', 4), ('Lunch Menu', 'Burrata', 'Fresh burrata cheese with cured tomatoes, peppermint-caper gremolata, home grown basil oil.', 240000, 'IDR', 5), ('Lunch Menu', 'Rucola', 'Rocket leaves, avocado, candied walnuts, cured tomatoes, balsamic glaze, olive tapenade, berries, mixed seeds.', 210000, 'IDR', 6), ('Lunch Menu', 'Parmigiana di Melanzane', 'Deep fried layered eggplant with tomato sauce, parmesan and basil topped with tomato coulis, parmesan fondue, Prego Garden basil pesto.', 220000, 'IDR', 7), ('Lunch Menu', 'Polpo', 'Locally sourced steamed octopus, potato basil sauce, kalamata olives, sun-dried cherry tomato, olive dust, lemon zest.', 210000, 'IDR', 8), ('Lunch Menu', 'Mama Style Meatballs', 'Angus beef meatballs in tomato sauce, basil pesto, crispy pancetta, charred sourdough.', 230000, 'IDR', 9), ('Lunch Menu', 'Cappuccino', 'Mixed mushroom soup served with truffle cream foam.', 210000, 'IDR', 10), ('Lunch Menu', 'Seafood Cioppino', 'Line caught barramundi, clams, prawn, cuttlefish served in slightly spicy tomato sauce, chargrilled sourdough.', 260000, 'IDR', 11), ('Lunch Menu', 'Margherita', 'Tomato sauce, mozzarella, basil, oregano.', 200000, 'IDR', 12), ('Lunch Menu', 'Quatro Formaggi', 'Cream, mozzarella, taleggio, gorgonzola, fontina, truffle oil, rocket leaves.', 240000, 'IDR', 13), ('Lunch Menu', 'Vesuviana', 'Tomato sauce, mozzarella, mama style meatballs, pecorino.', 240000, 'IDR', 14), ('Lunch Menu', 'Crudaiola', 'Mozzarella, heirloom tomato, basil pesto, shredded ricotta, rocket leaves.', 230000, 'IDR', 15), ('Lunch Menu', 'Calabrese', 'Tomato, mozzarella, homemade spicy pork sausage, grilled marinated eggplant.', 240000, 'IDR', 16), ('Lunch Menu', 'Prosciutto e Burrata', 'Tomato sauce, mozzarella, parma ham, burrata cheese, rocket leaves, balsamic reduction.', 290000, 'IDR', 17), ('Lunch Menu', 'Gnocchi di Patate alla Sorrentina', 'Handmade gnocchi, volcanic tomato sauce gratinated with mozzarella, parmesan, Prego garden basil.', 220000, 'IDR', 18), ('Lunch Menu', 'Ravioli Ricotta e Spinaci', 'Homemade ravioli filled with ricotta and spinach, butter sage sauce, roasted walnuts.', 225000, 'IDR', 19), ('Lunch Menu', 'Tagliatelle al Caffe', 'Homemade coffee flavored tagliatelle served with lamb ragout and wild mushrooms.', 230000, 'IDR', 20), ('Lunch Menu', 'Mezze Maniche al Gorgonzola', 'Rigatoni pasta served with creamy gorgonzola sauce, mix roasted nuts.', 235000, 'IDR', 21), ('Lunch Menu', 'Lasagna al Funghi', 'Wild mushroom lasagna, parmesan sauce, basil oil.', 240000, 'IDR', 22), ('Lunch Menu', 'Fagottino di Verdure', 'Crepes filled with mix vegetables caponata, raisin, pinenuts, zucchini-parsley sauce, goat cheese mousse, black pepper sprinkle.', 260000, 'IDR', 23), ('Lunch Menu', 'Barramundi', 'Pan seared Buleleng barramundi, sauteed Plaga spinach, asparagus, broccoli, green peas, beef tomato consommé infused with fresh oregano and our garden basil.', 450000, 'IDR', 24), ('Lunch Menu', 'Chicken Diavola', 'Slow-roasted half free range chicken, twice-baked baby potato, salsa al prezzemolo.', 290000, 'IDR', 25), ('Dinner Menu', 'Marinated Olives', 'A trio of Bella di Cerignola, leccino, kalamata olives, marinated with citrus, herbs.', 150000, 'IDR', 0), ('Dinner Menu', 'Bruschetta al Pomodoro', 'Homemade chargrilled sourdough, sundry tomato pesto, Bedugul heirloom cherry tomato, cured beef tomato, cherry tomato confit, home grow fresh basil.', 210000, 'IDR', 1), ('Dinner Menu', 'Bruschetta al Crudo di Parma', 'Stone baked ciabatta, charred artichoke cream, Parma ham and burrata cheese.', 220000, 'IDR', 2), ('Dinner Menu', 'Croquettes', 'Coppa di Martina Franca croquettes, grape must mayonnaise.', 190000, 'IDR', 3), ('Dinner Menu', 'Formaggi Misti', 'Selection of Italian traditional cheese served with homemade pickles, olives, walnuts, honeycomb, carta di musica.', 390000, 'IDR', 4), ('Dinner Menu', 'Carpaccio di Salmone', '16 hours marinated smoked salmon, fennel, citrus dressing, olives, capers berry, red onion pickles, dill.', 230000, 'IDR', 5), ('Dinner Menu', 'Carpaccio di Manzo', 'Black angus tenderloin beef carpaccio served with truffle mayo, parsley, parmesan fondue, balsamic reduction, dried cherry tomato.', 250000, 'IDR', 6), ('Dinner Menu', 'Burrata', 'Fresh burrata cheese with cured tomatoes, peppermint-caper gremolata, home grown basil oil.', 240000, 'IDR', 7), ('Dinner Menu', 'Rucola', 'Rocket leaves, avocado, candied walnuts, cured tomatoes, balsamic glaze, olive tapenade, berries, mixed seeds.', 210000, 'IDR', 8), ('Dinner Menu', 'Parmigiana di Melanzane', 'Deep fried layered eggplant with tomato sauce, parmesan and basil topped with tomato coulis, parmesan fondue, Prego Garden basil pesto.', 220000, 'IDR', 9), ('Dinner Menu', 'Polpo', 'Locally sourced steamed octopus, potato basil sauce, kalamata olives, sun-dried cherry tomato, olive dust, lemon zest.', 230000, 'IDR', 10), ('Dinner Menu', 'Gamberoni', 'Poached Jimbaran tiger prawn, smoked eggplant, Prego garden herbs, lemon, salsa al prezzemolo, aromatic bread crumbs, seaweed dust.', 280000, 'IDR', 11), ('Dinner Menu', 'Mama Style Meatballs', 'Angus beef meatballs in tomato sauce, basil pesto, crispy pancetta, charred sourdough.', 230000, 'IDR', 12), ('Dinner Menu', 'Cappuccino', 'Mixed mushroom soup served with truffle cream foam.', 210000, 'IDR', 13), ('Dinner Menu', 'Seafood Cioppino', 'Line caught barramundi, clams, prawn, cuttlefish served in slightly spicy tomato sauce, chargrilled sourdough.', 260000, 'IDR', 14), ('Dinner Menu', 'Margherita', 'Tomato sauce, mozzarella, basil, oregano.', 200000, 'IDR', 15), ('Dinner Menu', 'Quatro Formaggi', 'Cream, mozzarella, taleggio, gorgonzola, fontina, truffle oil, rocket leaves.', 240000, 'IDR', 16), ('Dinner Menu', 'Vesuviana', 'Tomato sauce, mozzarella, mama style meatballs, pecorino.', 240000, 'IDR', 17), ('Dinner Menu', 'Crudaiola', 'Mozzarella, heirloom tomato, basil pesto, shredded ricotta, rocket leaves.', 230000, 'IDR', 18), ('Dinner Menu', 'Calabrese', 'Tomato, mozzarella, homemade spicy pork sausage, grilled marinated eggplant.', 240000, 'IDR', 19), ('Dinner Menu', 'Prosciutto e Burrata', 'Tomato sauce, mozzarella, parma ham, burrata cheese, rocket leaves, balsamic reduction.', 290000, 'IDR', 20), ('Dinner Menu', 'Gnocchi di Patate alla Sorrentina', 'Handmade gnocchi, volcanic tomato sauce gratinated with mozzarella, parmesan, Prego garden basil.', 220000, 'IDR', 21), ('Dinner Menu', 'Ravioli Ricotta e Spinaci', 'Homemade ravioli filled with ricotta and spinach, butter sage sauce, roasted walnuts.', 225000, 'IDR', 22), ('Dinner Menu', 'Tagliatelle al Caffe', 'Homemade coffee flavored tagliatelle served with lamb ragout and wild mushrooms.', 230000, 'IDR', 23), ('Dinner Menu', 'Mezze Maniche al Gorgonzola', 'Rigatoni pasta served with creamy gorgonzola sauce, mix roasted nuts.', 235000, 'IDR', 24), ('Dinner Menu', 'Lobster Risotto', 'Bamboo lobster, saffron bisque, our garden tomatoes.', 360000, 'IDR', 25), ('Dinner Menu', 'Cavatelli al Ragout di Mare', 'Handmade cavatelli, locally catch of the day seafood ragout, lobster bisque, parsley.', 230000, 'IDR', 26), ('Dinner Menu', 'Lasagna al Funghi', 'Wild mushroom lasagna, parmesan sauce, basil oil.', 240000, 'IDR', 27), ('Dinner Menu', 'Orecchiette Broccoli e Salsiccia', 'Orecchiette pasta, broccoli sauce, pork sausage, parmesan.', 230000, 'IDR', 28), ('Dinner Menu', 'Fagottino di Verdure', 'Crepes filled with mix vegetables caponata, raisin, pinenuts, zucchini-parsley sauce, goat cheese mousse, black pepper sprinkle.', 260000, 'IDR', 29), ('Dinner Menu', 'Salmone', 'Crispy skin salmon steak, creamy clams-lime sauce, balsamic glazed king oyster mushroom, fresh herbs misticanza, salmon roe.', 370000, 'IDR', 30), ('Dinner Menu', 'Barramundi', 'Pan seared Buleleng barramundi, sauteed Plaga spinach, asparagus, broccoli, green peas, beef tomato consommé infused with fresh oregano and our garden basil.', 450000, 'IDR', 31), ('Dinner Menu', 'Chicken Diavola', 'Slow-roasted half free range chicken, twice-baked baby potato, salsa al prezzemolo.', 290000, 'IDR', 32), ('Dinner Menu', 'Stinco di Agnello', 'Slow braised lamb shank, mushroom, smoothy mash potato, lamb jus.', 440000, 'IDR', 33), ('Dinner Menu', 'Pancetta di Maiale', '24 hours slow cooked pork belly, pears cooked in red wine and spices coated with aromatic bread crumbs, potato mustard sauce.', 360000, 'IDR', 34), ('Dinner Menu', 'Sirloin', 'Grilled stockyard marble 3 sirloin, roasted root vegetables, black pepper sauce.', 680000, 'IDR', 35), ('Dinner Menu', 'Anatra', 'Half dry-aged roasted duck, root vegetables, chocolate-coffee jus.', 500000, 'IDR', 36), ('Kids Menu', 'Little Garden Greens', 'Mixed green lettuce, carrot, cucumber, cherry tomato.', 65000, 'IDR', 0), ('Kids Menu', 'Creamy Mushroom Bowl', 'Smooth local mushroom soup, light and comforting.', 75000, 'IDR', 1), ('Kids Menu', 'Margherita', 'Tomato sauce, mozzarella.', 90000, 'IDR', 2), ('Kids Menu', 'Ham and Cheese Pizza', 'Tomato sauce, mozzarella, cooked ham.', 95000, 'IDR', 3), ('Kids Menu', 'Penne Pomodoro', 'Penne pasta, tomato sauce, fresh basil, parmesan.', 90000, 'IDR', 4), ('Kids Menu', 'Spaghetti & Meatballs', 'Classic spaghetti, beef meatballs, rich Bolognese sauce.', 95000, 'IDR', 5), ('Kids Menu', 'Green Garden Fusilli', 'Fusilli pasta, creamy basil pesto, parmesan.', 95000, 'IDR', 6), ('Kids Menu', 'Spaghetti Alfredo', 'Spaghetti in a light butter cream sauce, parmesan.', 90000, 'IDR', 7), ('Kids Menu', 'Mini Cheeseburger & Fries', 'Wagyu beef patty with emmental cheese, tomato, and mayonnaise in a soft bun.', 95000, 'IDR', 8), ('Kids Menu', 'Chicken Parmigiana', 'Crispy chicken cutlet topped with tomato sauce, mozzarella, and parmesan, served with fries.', 90000, 'IDR', 9), ('Kids Menu', 'Crispy Fish & Chips', 'Golden fried white fish fillet with fries and a side of mayo.', 85000, 'IDR', 10), ('Kids Menu', 'Ice Cream Scoop', 'Your choice of vanilla, chocolate, or strawberry.', 55000, 'IDR', 11), ('Kids Menu', 'Ice Cream Sandwich', 'Milk-flavored ice cream between cookies, served with mango, chocolate, and strawberry sauces, finished with sprinkles.', 70000, 'IDR', 12), ('Kids Menu', 'Panna Cotta Duo', 'Vanilla panna cotta with strawberry and mango sauce.', 70000, 'IDR', 13), ('Dessert Menu', 'Tiramisu', 'Mascarpone cream with savoiardi.', 150000, 'IDR', 0), ('Dessert Menu', '68% Dark Chocolate Mousse', 'Dark chocolate with hazelnut crunch, raspberry sorbet and spiced chocolate crumbs.', 150000, 'IDR', 1), ('Dessert Menu', 'Torta All Olio D''Oliva E Riccota', 'Delicate sponge cake, mascarpone, ricotta cream, vanilla-rum anglaise, dolce di latte.', 150000, 'IDR', 2), ('Dessert Menu', 'Pannacotta', 'Chocolate cake with citrus compote.', 150000, 'IDR', 3), ('Dessert Menu', 'Gelato - Pistachio', 'Milk-based custard and high quality pistachio paste.', 130000, 'IDR', 4), ('Dessert Menu', 'Gelato - Hazelnut', 'Milk-based custard and high quality hazelnut paste.', 130000, 'IDR', 5), ('Dessert Menu', 'Gelato - Coffee Martini', 'Espresso, vodka and coffee liqueur.', 130000, 'IDR', 6), ('Dessert Menu', 'Gelato - Stracciatella', 'Milk-based custard and high quality chocolate crumbs.', 130000, 'IDR', 7), ('Dessert Menu', 'Sorbet - Limoncello', 'Dairy-free frozen dessert blended with simple syrup, lemon juice, zest, and Italian lemon liqueur.', 80000, 'IDR', 8), ('Dessert Menu', 'Sorbet - Mango Yoghurt', 'Creamy frozen dessert blended with frozen mango chunks with yoghurt.', 120000, 'IDR', 9), ('Dessert Menu', 'Sorbet - Raspberry', 'Dairy-free frozen dessert blended with simple syrup, puree raspberry and lemon juice.', 120000, 'IDR', 10), ('Beverages Menu', 'Sgroppino', 'Skyy Vodka, Limoncello, Lemon Oleo, Prosecco, Shaved Ice.', 195000, 'IDR', 0), ('Beverages Menu', 'Della Nonna', 'Skyy Vodka, Bianco Vermouth, Vanilla, Orange, Prosecco, Burrata Foam.', 185000, 'IDR', 1), ('Beverages Menu', 'Frutteto Margarita', 'Cazadores Blanco, Blood Orange, Limoncello, Lime, Fennel Salt.', 200000, 'IDR', 2), ('Beverages Menu', 'Amalfi Sour', 'Dewars White Label, Limoncello, Arancia Cordial, Lemon, Albumin.', 190000, 'IDR', 3), ('Beverages Menu', 'Improved Turf Cocktail', 'East Indies Gin, Dry Vermouth, Maraschino, Orange Bitters.', 200000, 'IDR', 4), ('Beverages Menu', 'Claypot Aged Negroni – Tanah & Api', 'Olive leaves infused East Indies Gin, 1757 Vermouth di Torino Rosso, Campari, East Indies Banda Spice Washed Truffle Oil, Amaro Lucano.', 200000, 'IDR', 5), ('Beverages Menu', 'Wooden Barrel Aged Negroni – Rasa Kayu', 'Cacao nibs infused Beefeater Gin, 1757 Vermouth di Torino Rosso, Campari.', 190000, 'IDR', 6), ('Beverages Menu', 'Coconut Shell Aged Negroni – Kelapa Asap', 'East Indies Gin Washed Coconut Oil, 1757 Vermouth di Torino, Campari, Mango infused Beefeater Gin.', 195000, 'IDR', 7), ('Beverages Menu', 'Gari-Bali', 'Campari, Plantation Pineapple, Luxardo Amaretto, Lime Juice, Pineapple Juice.', 185000, 'IDR', 8), ('Beverages Menu', 'Prego Spritz', 'Aperol, Guava, Prosecco, Soda Water.', 200000, 'IDR', 9), ('Beverages Menu', 'Caffè Tonico', 'Nusantara Cold Brew, Sweet Vermouth, Gin, Strawberry Cordial, Tonic Water.', 185000, 'IDR', 10), ('Beverages Menu', 'Negroni Al Montenegro', 'East Indies Gin, Campari, Sweet Vermouth, Amaro Montenegro.', 190000, 'IDR', 11), ('Beverages Menu', 'Negroni Sbagliato', 'East Indies Gin, Campari, Sweet Vermouth, Prosecco.', 185000, 'IDR', 12), ('Beverages Menu', 'Aperol Spritz', 'Sababay Ascaro, Aperol, Soda Water.', 185000, 'IDR', 13), ('Beverages Menu', 'Americano', 'Campari, Sweet Vermouth, Soda Water.', 185000, 'IDR', 14), ('Beverages Menu', 'Il Cardinale', 'Campari, Dry Vermouth, East Indies Gin.', 185000, 'IDR', 15), ('Beverages Menu', 'Bloody Mary', 'Skyy Vodka, L&P Sauce, Tomato, Tabasco, Salt.', 185000, 'IDR', 16)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'queen-s-of-india-at-nusa-dua' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Food Menu', 1, 'draft', 'partial', 'https://bali.queenstandoor.com/location/nusa-dua', 'Official Queen''s of India at Nusa Dua menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '7e4013969811375964252fe58975d1ec0c60d279f70e29cb364b1e888e45204f', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Starters', 0), ('Main Course', 1), ('Desserts', 2), ('Beverages', 3), ('Biryani', 4)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Starters', 'Macchi Harra Tikka Kebab', 'Delicious fish kebab marinated with spices.', 85000, 'IDR', 0), ('Starters', 'Pani Puri', 'Crispy puris filled with spicy water.', 45000, 'IDR', 1), ('Main Course', 'Butter Chicken', 'Creamy, rich chicken curry.', 120000, 'IDR', 0), ('Main Course', 'Daal Tadka', 'Lentils cooked with spices and topped with ghee and spices.', 55000, 'IDR', 1), ('Main Course', 'Fish Curry', 'Tender fish cooked with coconut milk and spices.', 90000, 'IDR', 2), ('Desserts', 'Gulab Jamun', 'Fried dough balls soaked in sugar syrup.', 35000, 'IDR', 0), ('Beverages', 'Lassi', 'Yogurt-based drink flavored with fruits.', 30000, 'IDR', 0), ('Biryani', 'Chicken Biryani', 'Spiced rice dish cooked with chicken and aromatics.', 95000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'sama-sama-yakiniku-and-japanese-restaurant-at-nusa-dua' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Sama Sama Yakiniku and Japanese Restaurant at Nusa Dua menu', 1, 'draft', 'partial', 'https://samasamabali.com/menu/lunch-set', 'Official Sama Sama Yakiniku and Japanese Restaurant at Nusa Dua menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'b4f4aef7da4fa642c5c61e5691a3ca18b1c2490ad7efb6f357d72eeefb8b8872', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Lunch Set', 0), ('Images', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Lunch Set', 'TOFU CHIGE SET', 'Tofu Chige, Kimuchi, Chidimi, Baby Potato, Salad, Rice', 80000, 'IDR', 0), ('Lunch Set', 'KIMUCHI CHIGE SET', 'Kimuchi Chige, Kimuchi, Chidimi, Baby Potato, Salad, Rice', 80000, 'IDR', 1), ('Lunch Set', 'BUTA AMAKARA ITAME SET', 'Tamago Yaki – Kimuchi Daikon – Kimuchi Akusai – Salad – Soup – Rice', 80000, 'IDR', 2), ('Lunch Set', 'US BEEF YAKINIKU SET', 'Jou Bara – Jou Karubi – Jou Buta Bara – Jou Tan – Kimuchi – Namuru – Chidimi – Salad – Soup – Rice', 150000, 'IDR', 3), ('Lunch Set', 'BEEF YAKINIKU SET', 'Rosu – Tan – Bara – Chicken – Kimuchi – Namuru – Chidimi – Salad – Soup – Rice', 100000, 'IDR', 4), ('Images', 'Image of TOFU CHIGE SET', null, null, null, 0), ('Images', 'Image of BUTA AMAKARA ITAME SET', null, null, null, 1), ('Images', 'Image of US BEEF YAKINIKU SET', null, null, null, 2), ('Images', 'Image of BEEF YAKINIKU SET', null, null, null, 3)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'signa-cafe' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Today''s Menu', 1, 'draft', 'partial', 'https://signa.cafe/menu.html', 'Official Signa Cafe menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'fc9056489f466c2cdcd8f400367ad35e47554d075048cf69b57af03812d718e0', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('EAT, TODAY', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('EAT, TODAY', 'Syrniki — cottage cheese pancakes', null, 93000, 'IDR', 0), ('EAT, TODAY', 'Big Breakfast', null, 79000, 'IDR', 1), ('EAT, TODAY', 'Best Scramble', null, 71000, 'IDR', 2), ('EAT, TODAY', 'Pizza Margarita', 'from 14:00', 69000, 'IDR', 3), ('EAT, TODAY', 'Creamy Bacon Pasta', null, 89000, 'IDR', 4), ('EAT, TODAY', 'Big Salmon Poke Bowl', '★ Chef''s', 145000, 'IDR', 5), ('EAT, TODAY', 'Caesar with chicken', null, 92000, 'IDR', 6), ('EAT, TODAY', 'Mango smoothie', null, 55000, 'IDR', 7)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'the-shore' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'The Shore Menu', 1, 'draft', 'partial', 'https://www.hilton.com/en/hotels/dpsbahi-hilton-bali-resort/dining/the-shore/', 'Official The Shore menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '4c06dc779f4205943c958e5621e8b1378ef49738392c865893fc96ef39756868', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Tasters', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Tasters', 'Oysters of the Day', 'with mignonette sauce', 40000, 'IDR', 0), ('Tasters', 'Ciabatta', 'broccoli hummus, chimichurri', 85000, 'IDR', 1), ('Tasters', 'Sourdough', 'roasted bone marrow butter', 95000, 'IDR', 2), ('Tasters', 'Quinoa-Crumbed Fish Fingers', 'fish skin crackling, smoked tofu & dill dip', 140000, 'IDR', 3), ('Tasters', 'S&P Calamari', 'lime aioli, fried garlic & chili salt', 140000, 'IDR', 4), ('Tasters', 'Soup of the Day', null, 80000, 'IDR', 5), ('Tasters', 'Prawn ''Popcorn''', 'nori crunch, wasabi caramel aioli', 160000, 'IDR', 6), ('Tasters', 'Wood roasted lobster & crab brioche rolls', null, 170000, 'IDR', 7), ('Tasters', 'Smashed beef pocket sliders', 'kohlrabi coleslaw, pickles', 155000, 'IDR', 8), ('Tasters', 'Tempura ice plant', 'asparagus, wasabi panna cotta, salicornia, sunflower seeds', 140000, 'IDR', 9), ('Tasters', 'Crispy tempura wood smoked baby corn', 'ponzu crema', 150000, 'IDR', 10), ('Tasters', 'Burrata', 'pomegranate, pomelo, tomato, pistachio crumble', 165000, 'IDR', 11), ('Tasters', 'Compressed watermelon', 'charred cabbage, lavender tabbouleh, date chia crumble', 145000, 'IDR', 12), ('Tasters', 'Cauliflower & soy crème mousse', 'sprigs, charred cauliflower, bailey', 145000, 'IDR', 13), ('Tasters', 'Salmon tartar', 'ripped apart labneh & potato wafers', 160000, 'IDR', 14), ('Tasters', 'Scallop ceviche', 'okra, chorizo, lavender, blueberries, puffed couscous wafer', 165000, 'IDR', 15)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'warung-nasi-ayam-bu-oki' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Eksplorasi Rasa Kuliner Kami', 1, 'draft', 'partial', 'https://nasiayamibuoki.com/menu', 'Official Warung Nasi Ayam Bu Oki menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '90e007e7ddfdb6b69763e98365ed75670c968c7343aad21ce24916058fdaf242', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Sajian Utama', 0), ('Tambahan / Ekstra Lauk', 1)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Sajian Utama', 'Nasi Campur (Pedas)', 'Nasi putih dengan lauk komplit: ayam betutu, sate lilit, ayam suwir, telur, sayur urap, lengkap dengan sambal matah & embe.', 32000, 'IDR', 0), ('Sajian Utama', 'Nasi Campur (Pisah Kuah)', 'Porsi Nasi Campur lengkap dengan varian kuah betutu yang dipisah dan tanpa sambal. Sangat cocok untuk anak-anak.', 25000, 'IDR', 1), ('Sajian Utama', 'Nasi Campur Spesial', 'Ekstra nasi dan tambahan dobel lauk pauk. Memberikan rasa kenyang maksimal bagi Anda yang sedang sangat lapar.', 40000, 'IDR', 2), ('Sajian Utama', 'Soto Ayam (Spesial Cabang)', 'Kuah kuning gurih, irisan ayam berlimpah, telur, dan sayur segar. Nikmat disantap selagi hangat.', 15000, 'IDR', 3), ('Tambahan / Ekstra Lauk', 'Ekstra Sate Lilit', 'Per Tusuk', 5000, 'IDR', 0), ('Tambahan / Ekstra Lauk', 'Ayam Betutu Kuah', 'Potongan Ayam + Kuah', 15000, 'IDR', 1), ('Tambahan / Ekstra Lauk', 'Ekstra Pindang Telur', 'Setengah / Bulat', 5000, 'IDR', 2)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'arunika-restaurant-by-the-meru-sanur' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Essence of Asia', 1, 'draft', 'partial', 'https://themerusanur.com/wp-content/uploads/2026/03/Essence-of-Asia-Special-April-Arunika-Menu.pdf', 'Official Arunika Restaurant by The Meru Sanur menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '8a4db8b3fb32cba82fa1dea1a3d8327b5e541d7b3756e0bde0bf22bd085a72ab', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Appetizer', 0), ('Main Course', 1), ('Dessert', 2)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Appetizer', 'Scallop', 'nam jim, lemongrass, chili, coriander, nasturtium', 120000, 'IDR', 0), ('Appetizer', 'Salmon', 'shallot dressing, shiso, nori, crispy garlic, crispy sheet, pickles', 130000, 'IDR', 1), ('Main Course', 'Miso Cod', 'caramelized cod fillet, pickled jicama, broccolini, dashi consommé', 200000, 'IDR', 0), ('Main Course', 'Lemongrass Chili Chicken', 'smoked chicken, chili lemongrass paste, keciwis, green vegetables', 190000, 'IDR', 1), ('Dessert', 'Thai Tea Egg Custard', null, 95000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'bali-beach-hotel-fitness-centre' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Activities', 1, 'draft', 'partial', 'https://balibeachsanur.com/wp-content/uploads/2026/03/Paid-Adult-Activities-1.pdf', 'Official Bali Beach Hotel Fitness Centre menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, '1551a649768a7feb1cf28e610a297fc1aa3347cb79ead31d6ff8694f73dca098', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Art of Canang Making', 0), ('Balinese Dance Lesson', 1), ('Bicycle Rental', 2), ('Sanur Bike Tour', 3), ('Sanur Village Walk', 4)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Art of Canang Making', 'Art of Canang Making', 'Engage in the sacred art of Canang creation using young coconut leaves and flowers.', 50000, 'IDR', 0), ('Balinese Dance Lesson', 'Balinese Dance Lesson', 'Immerse yourself in the graceful art of Balinese dance. Learn the meaning behind each movement and the traditions.', 150000, 'IDR', 0), ('Bicycle Rental', 'Bicycle Rental', 'Enjoy a complimentary extra hour of bike rental with a minimum booking of 2 hours and discover the beauty of Sanur.', 80000, 'IDR', 0), ('Sanur Bike Tour', 'Sanur Bike Tour', 'A guided cycling journey through Sanur, visiting cultural and historical landmarks.', 800000, 'IDR', 0), ('Sanur Village Walk', 'Sanur Village Walk', 'Discover the charm of Northern Sanur through a guided walk that offers a deeper insight into the area''s cultural heritage.', 450000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'bali-beach-hotel-yoga-wellness' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Activities and Lessons', 1, 'draft', 'partial', 'https://balibeachsanur.com/wp-content/uploads/2026/03/Paid-Adult-Activities-1.pdf', 'Official Bali Beach Hotel Yoga / Wellness menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'ae0a44c09e145ae539709556cb67ed3ca1375ee7443da14195484a788a231785', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Canang Making', 0), ('Dance Lessons', 1), ('Bike Services', 2), ('Walking Tours', 3)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Canang Making', 'Art of Canang Making', 'Engage in the sacred art of Canang creation using young coconut leaves and flowers.', 50000, 'IDR', 0), ('Dance Lessons', 'Balinese Dance Lesson', 'Immerse yourself in the graceful art of Balinese dance. Learn the meaning behind each movement and the traditions.', 150000, 'IDR', 0), ('Bike Services', 'Bicycle Rental', 'Enjoy a complimentary extra hour of bike rental with a minimum booking of 2 hours and discover the beauty of Sanur.', 80000, 'IDR', 0), ('Bike Services', 'Sanur Bike Tour', 'A guided cycling journey through Sanur, visiting cultural and historical landmarks.', 800000, 'IDR', 1), ('Walking Tours', 'Sanur Village Walk', 'Discover the charm of Northern Sanur through a guided walk that offers a deeper insight into the area''s cultural heritage.', 450000, 'IDR', 0)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

with target as (
  select slug from venues where slug = 'kayumanis-seaside-restaurant-sanur' and status = 'active' and publication_status = 'published'
), m as (
  insert into menus (venue_slug, title, version, status, completeness, source_url, source_label,
                     captured_at, verified_at, expires_at, content_digest, kind)
  select t.slug, 'Kayumanis Seaside Lunch & Dinner Menu', 1, 'draft', 'partial', 'https://kayumanisseaside.com/lunch-and-dinner-menu', 'Official Kayumanis Seaside Restaurant Sanur menu',
         '2026-08-25T01:47:06+00:00'::timestamptz, null, '2026-11-23T01:47:06+00:00'::timestamptz, 'a5428c75f209587bc84bd33ff83d08d972388558b565ef7d4997c1b5ead2cfa3', 'food'
  from target t
  where not exists (select 1 from menus x, target t2 where x.venue_slug = t2.slug and x.kind = 'food')
  returning id
), secs as (
  insert into menu_sections (menu_id, name, position)
  select m.id, s.name, s.pos from m, (values ('Finger Food', 0)) as s(name, pos)
  returning id, name
)
insert into menu_items (menu_id, section_id, name, description, price_minor, currency, position)
select m.id, secs.id, i.name, i.descr, i.price, i.cur, i.pos
from m, secs
join (values ('Finger Food', 'LUMPIA JAMUR', 'crispy spring rolls with mushroom, shredded vegetables served with tauco sauce', 55000, 'IDR', 0), ('Finger Food', 'WONTON GORENG', 'Chicken, cucumber, chili jam mayo, coral lettuce, mozzarella cheese', 60000, 'IDR', 1), ('Finger Food', 'MADRAS CHICKEN KEBAB', 'grilled marinated chicken kebab in aromatic spice served with potato wedges and madras mayo', 85000, 'IDR', 2), ('Finger Food', 'CRISPY GARLIC BUTTER CHICKEN WING', 'Deep fried chicken wing with garlic butter and potato wedges', 69000, 'IDR', 3), ('Finger Food', 'BBQ CHICKEN WING', 'grilled chicken wing with BBQ sauce served with potato wedges', 69000, 'IDR', 4), ('Finger Food', 'RISOLES MELEPUH', 'crunchy and melt cheese, smoked Beef with cucumber pickle', 60000, 'IDR', 5), ('Finger Food', 'CHICKEN GORDON BLEU', 'breaded chicken breast stuffing with beef ham, cheese and served with french fries or mash potato', 69000, 'IDR', 6), ('Finger Food', 'FISH FINGERS', 'breaded minced fish with salad, tartar sauce and french fries', 69000, 'IDR', 7), ('Finger Food', 'CRISPY CHICKEN', 'Fried chicken with big mac sauce', 79000, 'IDR', 8), ('Finger Food', 'CRISPY CUASADILLAS', 'Beef, guacamole, corral lettuce, spicy mayo served with tortilla', 69000, 'IDR', 9), ('Finger Food', 'TACOS TIGA RASA', 'Bolognaise, chicken lemon grass and puled pork pesto, with mozzarella and tomato sauce', 59000, 'IDR', 10)) as i(sec, name, descr, price, cur, pos) on i.sec = secs.name;

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
