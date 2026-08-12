-- Batch 01 (canggu-boilerplate-01) apply
-- Editorial rewrite: boilerplate why_its_here / best_for with verified facts
-- 10 accepted venues (bokashi, hip-hop-soul, jen-deli, kedai-tepi-kali, khao,
--                      kong, one-eyed-jack, rasa-kitchen, samm-s-farm, turntable)
-- Guard: exact-old on target field only; status/publication_status always checked
-- Note: not_for and price_anchor are not written on this pass

BEGIN;

-- 1. bokashi-bali-pererenan
UPDATE venues SET why_its_here = 'A Japanese-influenced restaurant built around a robatayaki charcoal grill on Jalan Pantai Pererenan. The menu names dishes including beef tartare, miso cod and chicken liver parfait. An on-site organic grocery store stocks produce from the LYD Organic farm in Bedugul.'
WHERE slug = 'bokashi-bali-pererenan' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jalan Pantai Pererenan No.159 in Canggu.';

UPDATE venues SET best_for = 'A robatayaki grill dinner or a daytime poolside meal in Pererenan.'
WHERE slug = 'bokashi-bali-pererenan' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers who want to check availability and reserve a table through Chope.';

-- 2. hip-hop-soul-restaurant
UPDATE venues SET why_its_here = 'A Southern American soul food restaurant on Jalan Raya Canggu. The menu names dishes including lemon pepper honey fried chicken served with cornbread and honey butter. It also serves handcrafted cocktails and desserts.'
WHERE slug = 'hip-hop-soul-restaurant' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jalan Raya Canggu.';

UPDATE venues SET best_for = 'Southern and soul-food comfort dishes with cocktails in central Canggu.'
WHERE slug = 'hip-hop-soul-restaurant' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers who want to check availability and reserve a table through Chope.';

-- 3. jen-deli-restaurant-and-la-fortuna-bar-at-sense-canggu-beach-hotel
UPDATE venues SET why_its_here = 'The in-hotel dining of Sense Canggu Beach Hotel, a short walk from Echo and Batu Bolong beaches. JEN Deli serves all-day breakfast, lunch and dinner on an outdoor terrace, with a choice of buffet or à la carte. La Fortuna Bar pours cocktails, spirits and wines with occasional live music and performances.'
WHERE slug = 'jen-deli-restaurant-and-la-fortuna-bar-at-sense-canggu-beach-hotel' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jl. Munduk Kedungu No.55s in Canggu, open daily 7:00am-11:00pm.';

UPDATE venues SET best_for = 'Guests wanting all-day dining plus evening drinks a short walk from Echo and Batu Bolong beaches, and groups who want the option of either buffet or à la carte.'
WHERE slug = 'jen-deli-restaurant-and-la-fortuna-bar-at-sense-canggu-beach-hotel' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers looking for a current place to eat in Canggu; Pererenan.';

-- 4. kedai-tepi-kali-and-bar-at-tapa-tepi-kali-canggu
UPDATE venues SET why_its_here = 'The restaurant of Tapa Tepi Kali Canggu by Pramana, on Jl. Padang Linjong near Echo Beach. Kedai Tepi Kali serves Balinese and local cuisine made with fresh, locally sourced ingredients, open for breakfast, lunch and dinner. It also runs a hands-on Balinese cooking class led by local chefs.'
WHERE slug = 'kedai-tepi-kali-and-bar-at-tapa-tepi-kali-canggu' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jl. Canggu Padang Linjong, open daily 7:00am-11:00pm.';

UPDATE venues SET best_for = 'Travellers who want Balinese cooking near Echo Beach, and anyone interested in a hands-on, English-language Balinese cooking class with local chefs.'
WHERE slug = 'kedai-tepi-kali-and-bar-at-tapa-tepi-kali-canggu' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers looking for a current place to eat in Canggu.';

-- 5. khao-canggu (includes not_for update)
UPDATE venues SET why_its_here = 'A Thai restaurant on Jl. Pantai Batu Mejan by Echo Beach, Canggu. The kitchen is led by a chef from Roi Et, Thailand, cooking traditional Thai recipes with locally sourced ingredients. Signature dishes include Pad Thai and Tom Yam Goong Ma Praw Oon.'
WHERE slug = 'khao-canggu' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jl. Pantai Batu Mejan in Canggu, open daily 10:00am-11:00pm.';

UPDATE venues SET best_for = 'Diners who want traditional, regionally rooted Thai food near Echo Beach rather than a Western-Thai fusion take.'
WHERE slug = 'khao-canggu' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers looking for a current place to eat in Canggu.';

UPDATE venues SET not_for = 'Not for those looking for modern Thai fusion — the kitchen deliberately sticks to traditional recipes.'
WHERE slug = 'khao-canggu' AND status='active' AND publication_status='published'
  AND (not_for IS NULL OR not_for = '');

-- 6. kong-contemporary-bistro
UPDATE venues SET why_its_here = 'KONG is a contemporary bistro on Jl. Pantai Berawa in Berawa, Canggu. The kitchen serves Asian-inspired small-to-medium plates alongside a cocktail and wine list. A weekly Sunday Roast is a standing fixture.'
WHERE slug = 'kong-contemporary-bistro' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jl. Pantai Berawa No.14b in Canggu, open daily 11:00am-12:00am.';

UPDATE venues SET best_for = 'Groups sharing small-to-medium plates over dinner and cocktails in Berawa, and anyone after a Sunday Roast.'
WHERE slug = 'kong-contemporary-bistro' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers looking for a current place to eat in Canggu; Berawa.';

-- 7. one-eyed-jack
UPDATE venues SET why_its_here = 'One Eyed Jack is a contemporary izakaya on Jl. Pantai Berawa in Berawa, Canggu. It serves Japanese-style shared plates across bites, raw plates and sushi rolls, using ingredients such as uni, salmon roe and unagi. The bar pours cocktails including the Jack's Lychee Martini.'
WHERE slug = 'one-eyed-jack' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jl. Pantai Berawa No.c89 in Canggu, open daily 3:00-11:00pm.';

UPDATE venues SET best_for = 'Evening shared-plate dining and cocktails for people who like Japanese izakaya food, raw plates and sushi.'
WHERE slug = 'one-eyed-jack' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers looking for a current place to eat in Canggu; Berawa.';

-- 8. rasa-kitchen
UPDATE venues SET why_its_here = 'An Indonesian food spot on Jl. Canggu Padang Linjong in Canggu. Delivery is available via Grab and Gojek.'
WHERE slug = 'rasa-kitchen' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jl. Canggu Padang Linjong No.80A, open daily 10:00am-11:00pm.';

UPDATE venues SET best_for = 'A casual, all-day Indonesian meal in Canggu, or ordering in by Grab or Gojek.'
WHERE slug = 'rasa-kitchen' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers looking for a current place to eat in Canggu.';

-- 9. samm-s-farm
UPDATE venues SET why_its_here = 'A farm-to-table kitchen and brewery on Jl. Canggu Padang Linjong, sourcing from its own on-site regenerative farm. The menu runs from farm-fresh breakfast and lunch to dinner and tapas, alongside house brews. The team also roasts its own coffee.'
WHERE slug = 'samm-s-farm' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jl. Canggu Padang Linjong No.58, open daily 8:30am-10:00pm.';

UPDATE venues SET best_for = 'Diners who want farm-fresh, sustainably sourced food, plus coffee and house-brew drinkers.'
WHERE slug = 'samm-s-farm' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers looking for a current place to eat in Canggu.';

-- 10. turntable-canggu-steakhouse
UPDATE venues SET why_its_here = 'A steakhouse inside Valstar Hotel on Jl. Raya Babakan in Canggu. It serves steaks including wagyu beef.'
WHERE slug = 'turntable-canggu-steakhouse' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jl. Raya Babakan Canggu No.51, open daily 7:00am-11:00pm.';

UPDATE venues SET best_for = 'Steak and wagyu lovers after dinner in Canggu.'
WHERE slug = 'turntable-canggu-steakhouse' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers looking for a current place to eat in Canggu.';

COMMIT;

-- Summary: 10 accepted venues, 20-21 UPDATEs expected
-- (bokashi, hip-hop-soul, jen-deli, kedai-tepi-kali: 2 fields each = 8)
-- (khao, kong, one-eyed-jack, rasa-kitchen, samm-s-farm, turntable: 2 fields each = 12; khao +1 not_for = 13 total for khao)
-- Total: 8 + 13 = 21 UPDATEs
