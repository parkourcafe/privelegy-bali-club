-- Batch 1 (Uluwatu 25) — DRAFT, NOT EXECUTED. Generated 2026-09-28 from change-list.csv (decision = ACCEPTED, target DB/BOTH → DB columns).
-- Before running: (1) SELECT the current values below and paste each into /*EXPECTED_FROM_PREFLIGHT*/; (2) dry-run ONE row inside begin/rollback;
-- (3) state the expected row count. A replace never runs without the live current value. See .agents/skills/otherbali-supabase-write/SKILL.md.
-- last_verified_at is NOT bumped here: it moves only when every F-claim of a card is accepted or removed (decided per venue by the founder).

-- 0. Current values (read-only)
select slug, status, publication_status, opening_hours_json, phone, full_address, price_anchor, category, official_url, instagram_url, latitude, longitude, verified_at, verification_source
from venues where slug in ('alchemy-uluwatu', 'bgs-uluwatu', 'gooseberry-french-restaurant-uluwatu', 'papi-sapi', 'seed-bingin', 'single-fin', 'suka-espresso', 'ulu-garden', 'waatu', 'white-rock-beach-club', 'yuki-uluwatu', 'zali-uluwatu') order by slug;

-- 1. alchemy-uluwatu · price_anchor · add · source https://www.alchemybali.com/alchemymenu?menu=alchemy-uluwatu-menu · quote: POKE BOWL Rice/grain or choice, edamame, cucumber, sesame nori, platbased "tuna", avocado, Asian sla
update venues set price_anchor = 'Poke bowl IDR 105,000; Margherita pizza IDR 105,000 (official Uluwatu menu, 2026-09-28)' where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor::text)) = 0); -- expect: UPDATE 1

-- 2. alchemy-uluwatu · opening_hours_json · add · source https://www.alchemybali.co/alchemy-ubud-bali-contact · quote: Alchemy Uluwatu Jalan Pantai Bingin No 8 Pecatu Uluwatu - Bali Indonesia - 80361 +62 811 3888 143 hi
update venues set opening_hours_json = '{"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"],"Friday":["7.30am-10.00pm"],"Saturday":["7.30am-10.00pm"],"Sunday":["7.30am-10.00pm"]}'::jsonb where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and (opening_hours_json is null or length(trim(opening_hours_json::text)) = 0); -- expect: UPDATE 1

-- 3. alchemy-uluwatu · phone · add · source https://www.alchemybali.co/alchemy-ubud-bali-contact · quote: Alchemy Uluwatu Jalan Pantai Bingin No 8 Pecatu Uluwatu - Bali Indonesia - 80361 +62 811 3888 143 hi
update venues set phone = '+628113888143' where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone::text)) = 0); -- expect: UPDATE 1

-- 4. alchemy-uluwatu · full_address · add · source https://www.alchemybali.co/alchemy-ubud-bali-contact · quote: Alchemy Uluwatu Jalan Pantai Bingin No 8 Pecatu Uluwatu - Bali Indonesia - 80361 +62 811 3888 143 hi
update venues set full_address = 'Jalan Pantai Bingin No 8, Pecatu, Uluwatu, Bali 80361' where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address::text)) = 0); -- expect: UPDATE 1

-- 5. bgs-uluwatu · full_address · add · source https://bgsbali.com/store/bgs-uluwatu/ · quote: Store Info Address Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361 Open Hours 0
update venues set full_address = 'Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361' where slug = 'bgs-uluwatu' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address::text)) = 0); -- expect: UPDATE 1

-- 6. gooseberry-french-restaurant-uluwatu · opening_hours_json · add · source https://www.gooseberry-restaurant.com/ · quote: Address Gang Pirta Pecatu Kecamatan Kuta Selatan Kabupaten Badung Bali 80361 Opening Hours Monday – 
update venues set opening_hours_json = '{"Monday":["8.00am-10.30pm"],"Tuesday":["8.00am-10.30pm"],"Wednesday":["8.00am-10.30pm"],"Thursday":["8.00am-10.30pm"],"Friday":["8.00am-10.30pm"],"Saturday":["8.00am-10.30pm"],"Sunday":["8.00am-10.30pm"]}'::jsonb where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and (opening_hours_json is null or length(trim(opening_hours_json::text)) = 0); -- expect: UPDATE 1

-- 7. gooseberry-french-restaurant-uluwatu · phone · add · source https://www.gooseberry-restaurant.com/ · quote: Talk To Us Call Us Text Us on WhatsApp
update venues set phone = '+6282144823166' where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone::text)) = 0); -- expect: UPDATE 1

-- 8. gooseberry-french-restaurant-uluwatu · full_address · add · source https://www.gooseberry-restaurant.com/ · quote: Address Gang Pirta Pecatu Kecamatan Kuta Selatan Kabupaten Badung Bali 80361 Opening Hours Monday – 
update venues set full_address = 'Gang Pirta, Pecatu, Kecamatan Kuta Selatan, Kabupaten Badung, Bali 80361' where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address::text)) = 0); -- expect: UPDATE 1

-- 9. gooseberry-french-restaurant-uluwatu · coordinates · add · source https://www.gooseberry-restaurant.com/
update venues set latitude = -8.812029591240924, longitude = 115.11612367686756 where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and latitude is null and longitude is null; -- expect: UPDATE 1

-- 10. papi-sapi · price_anchor · add · source https://papisapi.com/menu-bali · quote: SAPI PENYET Two super smashed australian beef patties, caramelised white onion, american cheese, pic
update venues set price_anchor = 'sapi penyet burger 140K (menu-bali, 2026-09-28; grill cuts priced by weight at the showcase)' where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor::text)) = 0); -- expect: UPDATE 1

-- 11. papi-sapi · full_address · add · source https://papisapi.com/contact/ · quote: Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361
update venues set full_address = 'Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361' where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address::text)) = 0); -- expect: UPDATE 1

-- 12. papi-sapi · opening_hours_json · add · source https://papisapi.com/ · quote: OPENING HOURS Everyday 04 : 00 pm - 11:30 pm
update venues set opening_hours_json = '{"Monday":["4.00pm-11.30pm"],"Tuesday":["4.00pm-11.30pm"],"Wednesday":["4.00pm-11.30pm"],"Thursday":["4.00pm-11.30pm"],"Friday":["4.00pm-11.30pm"],"Saturday":["4.00pm-11.30pm"],"Sunday":["4.00pm-11.30pm"]}'::jsonb where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and (opening_hours_json is null or length(trim(opening_hours_json::text)) = 0); -- expect: UPDATE 1

-- 13. papi-sapi · phone · add · source https://papisapi.com/ · quote: Bali +62 851 9590 3719 hello@papisapi.com
update venues set phone = '+62 851 9590 3719' where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone::text)) = 0); -- expect: UPDATE 1

-- 14. seed-bingin · price_anchor · add · source https://seedbingin.com/food-menu · quote: Sumatran Beef Rendang Slow cooked beef cheek in a rich blend of fresh spices. 210k
update venues set price_anchor = 'sumatran beef rendang 210k ++ (dinner menu, 2026-09-28)' where slug = 'seed-bingin' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor::text)) = 0); -- expect: UPDATE 1

-- 15. seed-bingin · full_address · add · source https://seedbingin.com/ · quote: Jalan Pantai Bingin Pecatu, South Kuta Badung, Bali 80361
update venues set full_address = 'Jalan Pantai Bingin, Pecatu, South Kuta, Badung, Bali 80361' where slug = 'seed-bingin' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address::text)) = 0); -- expect: UPDATE 1

-- 16. seed-bingin · opening_hours_json · replace · source https://seedbingin.com/ · quote: Open Daily 7 AM to 11 PM
update venues set opening_hours_json = '{"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"],"Friday":["7.00am-11.00pm"],"Saturday":["7.00am-11.00pm"],"Sunday":["7.00am-11.00pm"]}'::jsonb where slug = 'seed-bingin' and status = 'active' and publication_status = 'published' and opening_hours_json::text = /*EXPECTED_FROM_PREFLIGHT*/; -- expect: UPDATE 1 — fill the current value from step 0 first

-- 17. single-fin · price_anchor · add · source https://www.singlefinbali.com/eat-drinks/ · quote: NASI GORENG SINGLE FIN Indonesian fried rice, chicken satay, fried egg, shrimp crackers, carrot & cu
update venues set price_anchor = 'nasi goreng single fin 135K incl. tax and service (eat & drinks menu, 2026-09-28)' where slug = 'single-fin' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor::text)) = 0); -- expect: UPDATE 1

-- 18. single-fin · full_address · add · source https://www.singlefinbali.com/ · quote: Pantai Suluban, Jl. Labuan Sait, Pecatu, Uluwatu, Kuta Selatan, Kabupaten Badung, Bali 80361
update venues set full_address = 'Pantai Suluban, Jl. Labuan Sait, Pecatu, Uluwatu, Kuta Selatan, Kabupaten Badung, Bali 80361' where slug = 'single-fin' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address::text)) = 0); -- expect: UPDATE 1

-- 19. single-fin · opening_hours_json · add · source https://www.singlefinbali.com/ · quote: Monday 8 AM – 10 PM Tuesday 8 AM – 10 PM Wednesday 8 AM – 2 AM Thursday 8 AM – 10 PM Friday 8 AM – 1
update venues set opening_hours_json = '{"Monday":["8.00am-10.00pm"],"Tuesday":["8.00am-10.00pm"],"Wednesday":["8.00am-23.59pm"],"Thursday":["8.00am-10.00pm"],"Friday":["8.00am-10.00pm"],"Saturday":["8.00am-10.00pm"],"Sunday":["8.00am-23.59pm"]}'::jsonb where slug = 'single-fin' and status = 'active' and publication_status = 'published' and (opening_hours_json is null or length(trim(opening_hours_json::text)) = 0); -- expect: UPDATE 1

-- 20. single-fin · phone · add · source https://www.singlefinbali.com/contact/ · quote: Phone. +6281996305521
update venues set phone = '+6281996305521' where slug = 'single-fin' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone::text)) = 0); -- expect: UPDATE 1

-- 21. suka-espresso · full_address · replace · source https://www.bysuka.com/suka-uluwatu · quote: lOCATION: Jl. Labuansait, ULUWATU
update venues set full_address = 'Jl. Labuansait, Uluwatu' where slug = 'suka-espresso' and status = 'active' and publication_status = 'published' and full_address::text = /*EXPECTED_FROM_PREFLIGHT*/; -- expect: UPDATE 1 — fill the current value from step 0 first

-- 22. suka-espresso · opening_hours_json · add · source https://www.bysuka.com/suka-uluwatu · quote: HOURS: 7:30AM - 10PM
update venues set opening_hours_json = '{"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"],"Friday":["7.30am-10.00pm"],"Saturday":["7.30am-10.00pm"],"Sunday":["7.30am-10.00pm"]}'::jsonb where slug = 'suka-espresso' and status = 'active' and publication_status = 'published' and (opening_hours_json is null or length(trim(opening_hours_json::text)) = 0); -- expect: UPDATE 1

-- 23. ulu-garden · full_address · add · source https://ulutribe.com/contact/ · quote: Jl. Pantai Padang-Padang, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361
update venues set full_address = 'Jl. Pantai Padang-Padang, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361' where slug = 'ulu-garden' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address::text)) = 0); -- expect: UPDATE 1

-- 24. ulu-garden · opening_hours_json · add · source https://ulutribe.com/contact/ · quote: Garden 7AM – 11PM
update venues set opening_hours_json = '{"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"],"Friday":["7.00am-11.00pm"],"Saturday":["7.00am-11.00pm"],"Sunday":["7.00am-11.00pm"]}'::jsonb where slug = 'ulu-garden' and status = 'active' and publication_status = 'published' and (opening_hours_json is null or length(trim(opening_hours_json::text)) = 0); -- expect: UPDATE 1

-- 25. waatu · full_address · add · source https://waatu.com/ · quote: Jl. Pantai Sel. Gau, Ungasan, Kec. Kuta Sel., Kabupaten Badung, Bali 80362, Indonesia
update venues set full_address = 'Jl. Pantai Sel. Gau, Ungasan, Kec. Kuta Sel., Kabupaten Badung, Bali 80362' where slug = 'waatu' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address::text)) = 0); -- expect: UPDATE 1

-- 26. waatu · opening_hours_json · SKIPPED: open-ended hours ("Daily 7.30am until late") stay as registry text; no structured closing time is invented.

-- 27. white-rock-beach-club · price_anchor · add · source https://whiterockbali.com/ · quote: SINGLE SOFA (2 pax) MIN. SPEND IDR 500K++
update venues set price_anchor = 'single sofa (2 pax) min. spend IDR 500K++; single bed (2 pax) min. spend IDR 2,000K++ — whiterockbali.com, 2026-09-28' where slug = 'white-rock-beach-club' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor::text)) = 0); -- expect: UPDATE 1

-- 28. white-rock-beach-club · phone · add · source https://whiterockbali.com/ · quote: [+62] 811 3803 003
update venues set phone = '+628113803003' where slug = 'white-rock-beach-club' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone::text)) = 0); -- expect: UPDATE 1

-- 29. yuki-uluwatu · full_address · add · source https://www.yuki-bali.com/ulu-reservations · quote: Jl Labuansait, Pecatu, Kec. Kuta Selatan, Kabupaten Badung, Bali, Indonesia
update venues set full_address = 'Jl. Labuansait, Pecatu, Kec. Kuta Selatan, Kabupaten Badung, Bali' where slug = 'yuki-uluwatu' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address::text)) = 0); -- expect: UPDATE 1

-- 30. yuki-uluwatu · opening_hours_json · SKIPPED: open-ended hours ("Daily 11.00am until late") stay as registry text; no structured closing time is invented.

-- 31. zali-uluwatu · opening_hours_json · replace · source https://www.zalirestaurant.com/ · quote: Uluwatu +62 877 7813 7273 Everyday 8:00AM &ndash; 12:00AM
update venues set opening_hours_json = '{"Monday":["8.00am-23.59pm"],"Tuesday":["8.00am-23.59pm"],"Wednesday":["8.00am-23.59pm"],"Thursday":["8.00am-23.59pm"],"Friday":["8.00am-23.59pm"],"Saturday":["8.00am-23.59pm"],"Sunday":["8.00am-23.59pm"]}'::jsonb where slug = 'zali-uluwatu' and status = 'active' and publication_status = 'published' and opening_hours_json::text = /*EXPECTED_FROM_PREFLIGHT*/; -- expect: UPDATE 1 — fill the current value from step 0 first

-- Verify: select slug, opening_hours_json, phone, full_address, price_anchor, latitude, longitude from venues where slug in ('alchemy-uluwatu', 'bgs-uluwatu', 'gooseberry-french-restaurant-uluwatu', 'papi-sapi', 'seed-bingin', 'single-fin', 'suka-espresso', 'ulu-garden', 'waatu', 'white-rock-beach-club', 'yuki-uluwatu', 'zali-uluwatu');
