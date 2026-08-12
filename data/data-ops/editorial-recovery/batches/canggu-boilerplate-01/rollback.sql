-- Batch 01 (canggu-boilerplate-01) rollback
-- Reverse all 21 UPDATEs from apply.sql

BEGIN;

-- 1. bokashi-bali-pererenan
UPDATE venues SET why_its_here = 'Restaurant on Jalan Pantai Pererenan No.159 in Canggu.'
WHERE slug = 'bokashi-bali-pererenan' AND status='active' AND publication_status='published'
  AND why_its_here = 'A Japanese-influenced restaurant built around a robatayaki charcoal grill on Jalan Pantai Pererenan. The menu names dishes including beef tartare, miso cod and chicken liver parfait. An on-site organic grocery store stocks produce from the LYD Organic farm in Bedugul.';

UPDATE venues SET best_for = 'Travellers who want to check availability and reserve a table through Chope.'
WHERE slug = 'bokashi-bali-pererenan' AND status='active' AND publication_status='published'
  AND best_for = 'A robatayaki grill dinner or a daytime poolside meal in Pererenan.';

-- 2. hip-hop-soul-restaurant
UPDATE venues SET why_its_here = 'Restaurant on Jalan Raya Canggu.'
WHERE slug = 'hip-hop-soul-restaurant' AND status='active' AND publication_status='published'
  AND why_its_here = 'A Southern American soul food restaurant on Jalan Raya Canggu. The menu names dishes including lemon pepper honey fried chicken served with cornbread and honey butter. It also serves handcrafted cocktails and desserts.';

UPDATE venues SET best_for = 'Travellers who want to check availability and reserve a table through Chope.'
WHERE slug = 'hip-hop-soul-restaurant' AND status='active' AND publication_status='published'
  AND best_for = 'Southern and soul-food comfort dishes with cocktails in central Canggu.';

-- 3. jen-deli-restaurant-and-la-fortuna-bar-at-sense-canggu-beach-hotel
UPDATE venues SET why_its_here = 'Restaurant on Jl. Munduk Kedungu No.55s in Canggu, open daily 7:00am-11:00pm.'
WHERE slug = 'jen-deli-restaurant-and-la-fortuna-bar-at-sense-canggu-beach-hotel' AND status='active' AND publication_status='published'
  AND why_its_here = 'The in-hotel dining of Sense Canggu Beach Hotel, a short walk from Echo and Batu Bolong beaches. JEN Deli serves all-day breakfast, lunch and dinner on an outdoor terrace, with a choice of buffet or à la carte. La Fortuna Bar pours cocktails, spirits and wines with occasional live music and performances.';

UPDATE venues SET best_for = 'Travellers looking for a current place to eat in Canggu; Pererenan.'
WHERE slug = 'jen-deli-restaurant-and-la-fortuna-bar-at-sense-canggu-beach-hotel' AND status='active' AND publication_status='published'
  AND best_for = 'Guests wanting all-day dining plus evening drinks a short walk from Echo and Batu Bolong beaches, and groups who want the option of either buffet or à la carte.';

-- 4. kedai-tepi-kali-and-bar-at-tapa-tepi-kali-canggu
UPDATE venues SET why_its_here = 'Restaurant on Jl. Canggu Padang Linjong, open daily 7:00am-11:00pm.'
WHERE slug = 'kedai-tepi-kali-and-bar-at-tapa-tepi-kali-canggu' AND status='active' AND publication_status='published'
  AND why_its_here = 'The restaurant of Tapa Tepi Kali Canggu by Pramana, on Jl. Padang Linjong near Echo Beach. Kedai Tepi Kali serves Balinese and local cuisine made with fresh, locally sourced ingredients, open for breakfast, lunch and dinner. It also runs a hands-on Balinese cooking class led by local chefs.';

UPDATE venues SET best_for = 'Travellers looking for a current place to eat in Canggu.'
WHERE slug = 'kedai-tepi-kali-and-bar-at-tapa-tepi-kali-canggu' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers who want Balinese cooking near Echo Beach, and anyone interested in a hands-on, English-language Balinese cooking class with local chefs.';

-- 5. khao-canggu
UPDATE venues SET why_its_here = 'Restaurant on Jl. Pantai Batu Mejan in Canggu, open daily 10:00am-11:00pm.'
WHERE slug = 'khao-canggu' AND status='active' AND publication_status='published'
  AND why_its_here = 'A Thai restaurant on Jl. Pantai Batu Mejan by Echo Beach, Canggu. The kitchen is led by a chef from Roi Et, Thailand, cooking traditional Thai recipes with locally sourced ingredients. Signature dishes include Pad Thai and Tom Yam Goong Ma Praw Oon.';

UPDATE venues SET best_for = 'Travellers looking for a current place to eat in Canggu.'
WHERE slug = 'khao-canggu' AND status='active' AND publication_status='published'
  AND best_for = 'Diners who want traditional, regionally rooted Thai food near Echo Beach rather than a Western-Thai fusion take.';

UPDATE venues SET not_for = NULL
WHERE slug = 'khao-canggu' AND status='active' AND publication_status='published'
  AND not_for = 'Not for those looking for modern Thai fusion — the kitchen deliberately sticks to traditional recipes.';

-- 6. kong-contemporary-bistro
UPDATE venues SET why_its_here = 'Restaurant on Jl. Pantai Berawa No.14b in Canggu, open daily 11:00am-12:00am.'
WHERE slug = 'kong-contemporary-bistro' AND status='active' AND publication_status='published'
  AND why_its_here = 'KONG is a contemporary bistro on Jl. Pantai Berawa in Berawa, Canggu. The kitchen serves Asian-inspired small-to-medium plates alongside a cocktail and wine list. A weekly Sunday Roast is a standing fixture.';

UPDATE venues SET best_for = 'Travellers looking for a current place to eat in Canggu; Berawa.'
WHERE slug = 'kong-contemporary-bistro' AND status='active' AND publication_status='published'
  AND best_for = 'Groups sharing small-to-medium plates over dinner and cocktails in Berawa, and anyone after a Sunday Roast.';

-- 7. one-eyed-jack
UPDATE venues SET why_its_here = 'Restaurant on Jl. Pantai Berawa No.c89 in Canggu, open daily 3:00-11:00pm.'
WHERE slug = 'one-eyed-jack' AND status='active' AND publication_status='published'
  AND why_its_here = 'One Eyed Jack is a contemporary izakaya on Jl. Pantai Berawa in Berawa, Canggu. It serves Japanese-style shared plates across bites, raw plates and sushi rolls, using ingredients such as uni, salmon roe and unagi. The bar pours cocktails including the Jack's Lychee Martini.';

UPDATE venues SET best_for = 'Travellers looking for a current place to eat in Canggu; Berawa.'
WHERE slug = 'one-eyed-jack' AND status='active' AND publication_status='published'
  AND best_for = 'Evening shared-plate dining and cocktails for people who like Japanese izakaya food, raw plates and sushi.';

-- 8. rasa-kitchen
UPDATE venues SET why_its_here = 'Restaurant on Jl. Canggu Padang Linjong No.80A, open daily 10:00am-11:00pm.'
WHERE slug = 'rasa-kitchen' AND status='active' AND publication_status='published'
  AND why_its_here = 'An Indonesian food spot on Jl. Canggu Padang Linjong in Canggu. Delivery is available via Grab and Gojek.';

UPDATE venues SET best_for = 'Travellers looking for a current place to eat in Canggu.'
WHERE slug = 'rasa-kitchen' AND status='active' AND publication_status='published'
  AND best_for = 'A casual, all-day Indonesian meal in Canggu, or ordering in by Grab or Gojek.';

-- 9. samm-s-farm
UPDATE venues SET why_its_here = 'Restaurant on Jl. Canggu Padang Linjong No.58, open daily 8:30am-10:00pm.'
WHERE slug = 'samm-s-farm' AND status='active' AND publication_status='published'
  AND why_its_here = 'A farm-to-table kitchen and brewery on Jl. Canggu Padang Linjong, sourcing from its own on-site regenerative farm. The menu runs from farm-fresh breakfast and lunch to dinner and tapas, alongside house brews. The team also roasts its own coffee.';

UPDATE venues SET best_for = 'Travellers looking for a current place to eat in Canggu.'
WHERE slug = 'samm-s-farm' AND status='active' AND publication_status='published'
  AND best_for = 'Diners who want farm-fresh, sustainably sourced food, plus coffee and house-brew drinkers.';

-- 10. turntable-canggu-steakhouse
UPDATE venues SET why_its_here = 'Restaurant on Jl. Raya Babakan Canggu No.51, open daily 7:00am-11:00pm.'
WHERE slug = 'turntable-canggu-steakhouse' AND status='active' AND publication_status='published'
  AND why_its_here = 'A steakhouse inside Valstar Hotel on Jl. Raya Babakan in Canggu. It serves steaks including wagyu beef.';

UPDATE venues SET best_for = 'Travellers looking for a current place to eat in Canggu.'
WHERE slug = 'turntable-canggu-steakhouse' AND status='active' AND publication_status='published'
  AND best_for = 'Steak and wagyu lovers after dinner in Canggu.';

COMMIT;

-- Summary: 21 UPDATEs (reverse of apply.sql)
