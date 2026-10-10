-- Batch 1 (Uluwatu 25) + audit P0 — apply file for the session WITH production database access.
-- Generated 2026-10-01 by tools/build-apply-sql.ts. NOT executed in the session that wrote it (no DB access).
--
-- Approved by the founder on 2026-10-01: the ACCEPTED rows of CHANGE-LIST.md and removal of the
-- hijacked gambling websites. Not included: MANUAL_REVIEW rows, Single Fin hours and phone
-- (on hold after re-confirmation), open-ended hours. last_verified_at is not touched.
--
-- Order (otherbali-supabase-write):
--   0. Run the preflight SELECTs. Save the output in RUNLOG.md.
--   1. Fill every /*EXPECTED_FROM_PREFLIGHT*/ with the current value from step 0 (quoted literal).
--      Section A will not parse until this is done — deliberately.
--   2. Dry-run: run ONE statement from section A inside  begin; … ; rollback;  — expect UPDATE 1.
--   3. Run section A, then section B. Each is a single DO block: every statement asserts it
--      touched exactly 1 row, and any mismatch raises and rolls the whole block back.
--   4. Run the verification SELECTs; then check the live pages (DB-APPLY-NEXT-SESSION.md).

-- ===================== 0. PREFLIGHT (read-only) =====================

-- 0a. Every slug exists (expect 0 rows)
select d.slug from (values ('alchemy-uluwatu'), ('bgs-uluwatu'), ('gooseberry-french-restaurant-uluwatu'), ('papi-sapi'), ('seed-bingin'), ('single-fin'), ('suka-espresso'), ('ulu-garden'), ('waatu'), ('white-rock-beach-club'), ('yuki-uluwatu'), ('zali-uluwatu'), ('the-elephant'), ('karsa-cafe'), ('seminyak-yoga-shala'), ('cantika-zest'), ('sees-bali-cafe-and-eatery'), ('the-tree-international-bar-and-restaurant')) as d(slug)
left join venues v on v.slug = d.slug where v.slug is null;

-- 0b. Current values of every column this file writes
select slug, status, publication_status, official_url, full_address, phone, price_anchor,
       opening_hours_json, latitude, longitude, verified_at, verification_source, last_verified_at
from venues where slug in ('alchemy-uluwatu', 'bgs-uluwatu', 'gooseberry-french-restaurant-uluwatu', 'papi-sapi', 'seed-bingin', 'single-fin', 'suka-espresso', 'ulu-garden', 'waatu', 'white-rock-beach-club', 'yuki-uluwatu', 'zali-uluwatu', 'the-elephant', 'karsa-cafe', 'seminyak-yoga-shala', 'cantika-zest', 'sees-bali-cafe-and-eatery', 'the-tree-international-bar-and-restaurant')
order by slug;

-- 0c. Provider actions pointing at the hijacked domains (read-only; disabling them is a separate decision)
select venue_slug, kind, provider, url, status, verified_at, expires_at
from venue_action_capabilities
where url ~* '(elephantbali|karsacafe|seminyakyogashala|cantikazestbali|sendokbali)\.com'
   or venue_slug in ('the-elephant', 'karsa-cafe', 'seminyak-yoga-shala', 'cantika-zest', 'sees-bali-cafe-and-eatery', 'the-tree-international-bar-and-restaurant');

-- ===================== A. BATCH 1 — 27 rows (3 replacements need EXPECTED values) =====================

do $$
declare n int;
begin
  -- 1. alchemy-uluwatu · price_anchor · add · source https://www.alchemybali.com/alchemymenu?menu=alchemy-uluwatu-menu
  update venues set price_anchor = 'Poke bowl IDR 105,000; Margherita pizza IDR 105,000 (official Uluwatu menu, 2026-09-28)' where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #1 (alchemy-uluwatu · price_anchor): expected 1 row, got %', n; end if;

  -- 2. alchemy-uluwatu · opening_hours_json · add · source https://www.alchemybali.co/alchemy-ubud-bali-contact
  update venues set opening_hours_json = '{"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"],"Friday":["7.30am-10.00pm"],"Saturday":["7.30am-10.00pm"],"Sunday":["7.30am-10.00pm"]}'::jsonb where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and opening_hours_json is null;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #2 (alchemy-uluwatu · opening_hours_json): expected 1 row, got %', n; end if;

  -- 3. alchemy-uluwatu · phone · add · source https://www.alchemybali.co/alchemy-ubud-bali-contact
  update venues set phone = '+628113888143' where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #3 (alchemy-uluwatu · phone): expected 1 row, got %', n; end if;

  -- 4. alchemy-uluwatu · full_address · add · source https://www.alchemybali.co/alchemy-ubud-bali-contact
  update venues set full_address = 'Jalan Pantai Bingin No 8, Pecatu, Uluwatu, Bali 80361' where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #4 (alchemy-uluwatu · full_address): expected 1 row, got %', n; end if;

  -- 5. bgs-uluwatu · full_address · add · source https://bgsbali.com/store/bgs-uluwatu/
  update venues set full_address = 'Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361' where slug = 'bgs-uluwatu' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #5 (bgs-uluwatu · full_address): expected 1 row, got %', n; end if;

  -- 6. gooseberry-french-restaurant-uluwatu · opening_hours_json · add · source https://www.gooseberry-restaurant.com/
  update venues set opening_hours_json = '{"Monday":["8.00am-10.30pm"],"Tuesday":["8.00am-10.30pm"],"Wednesday":["8.00am-10.30pm"],"Thursday":["8.00am-10.30pm"],"Friday":["8.00am-10.30pm"],"Saturday":["8.00am-10.30pm"],"Sunday":["8.00am-10.30pm"]}'::jsonb where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and opening_hours_json is null;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #6 (gooseberry-french-restaurant-uluwatu · opening_hours_json): expected 1 row, got %', n; end if;

  -- 7. gooseberry-french-restaurant-uluwatu · phone · add · source https://www.gooseberry-restaurant.com/
  update venues set phone = '+6282144823166' where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #7 (gooseberry-french-restaurant-uluwatu · phone): expected 1 row, got %', n; end if;

  -- 8. gooseberry-french-restaurant-uluwatu · full_address · add · source https://www.gooseberry-restaurant.com/
  update venues set full_address = 'Gang Pirta, Pecatu, Kecamatan Kuta Selatan, Kabupaten Badung, Bali 80361' where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #8 (gooseberry-french-restaurant-uluwatu · full_address): expected 1 row, got %', n; end if;

  -- 9. gooseberry-french-restaurant-uluwatu · coordinates · add · source https://www.gooseberry-restaurant.com/ (official page's embedded map)
  update venues set latitude = -8.812029591240924, longitude = 115.11612367686756 where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and latitude is null and longitude is null;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #9 (gooseberry-french-restaurant-uluwatu · coordinates): expected 1 row, got %', n; end if;

  -- 10. papi-sapi · price_anchor · add · source https://papisapi.com/menu-bali
  update venues set price_anchor = 'sapi penyet burger 140K (menu-bali, 2026-09-28; grill cuts priced by weight at the showcase)' where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #10 (papi-sapi · price_anchor): expected 1 row, got %', n; end if;

  -- 11. papi-sapi · full_address · add · source https://papisapi.com/contact/
  update venues set full_address = 'Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361' where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #11 (papi-sapi · full_address): expected 1 row, got %', n; end if;

  -- 12. papi-sapi · opening_hours_json · add · source https://papisapi.com/
  update venues set opening_hours_json = '{"Monday":["4.00pm-11.30pm"],"Tuesday":["4.00pm-11.30pm"],"Wednesday":["4.00pm-11.30pm"],"Thursday":["4.00pm-11.30pm"],"Friday":["4.00pm-11.30pm"],"Saturday":["4.00pm-11.30pm"],"Sunday":["4.00pm-11.30pm"]}'::jsonb where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and opening_hours_json is null;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #12 (papi-sapi · opening_hours_json): expected 1 row, got %', n; end if;

  -- 13. papi-sapi · phone · add · source https://papisapi.com/
  update venues set phone = '+62 851 9590 3719' where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #13 (papi-sapi · phone): expected 1 row, got %', n; end if;

  -- 14. seed-bingin · price_anchor · add · source https://seedbingin.com/food-menu
  update venues set price_anchor = 'sumatran beef rendang 210k ++ (dinner menu, 2026-09-28)' where slug = 'seed-bingin' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #14 (seed-bingin · price_anchor): expected 1 row, got %', n; end if;

  -- 15. seed-bingin · full_address · add · source https://seedbingin.com/
  update venues set full_address = 'Jalan Pantai Bingin, Pecatu, South Kuta, Badung, Bali 80361' where slug = 'seed-bingin' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #15 (seed-bingin · full_address): expected 1 row, got %', n; end if;

  -- 16. seed-bingin · opening_hours_json · replace · source https://seedbingin.com/
  update venues set opening_hours_json = '{"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"],"Friday":["7.00am-11.00pm"],"Saturday":["7.00am-11.00pm"],"Sunday":["7.00am-11.00pm"]}'::jsonb where slug = 'seed-bingin' and status = 'active' and publication_status = 'published' and opening_hours_json = /*EXPECTED_FROM_PREFLIGHT*/::jsonb;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #16 (seed-bingin · opening_hours_json): expected 1 row, got %', n; end if;

  -- 17. single-fin · price_anchor · add · source https://www.singlefinbali.com/eat-drinks/
  update venues set price_anchor = 'nasi goreng single fin 135K incl. tax and service (eat & drinks menu, 2026-09-28)' where slug = 'single-fin' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #17 (single-fin · price_anchor): expected 1 row, got %', n; end if;

  -- 18. single-fin · full_address · add · source https://www.singlefinbali.com/
  update venues set full_address = 'Pantai Suluban, Jl. Labuan Sait, Pecatu, Uluwatu, Kuta Selatan, Kabupaten Badung, Bali 80361' where slug = 'single-fin' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #18 (single-fin · full_address): expected 1 row, got %', n; end if;

  -- 19. suka-espresso · full_address · replace · source https://www.bysuka.com/suka-uluwatu
  update venues set full_address = 'Jl. Labuansait, Uluwatu' where slug = 'suka-espresso' and status = 'active' and publication_status = 'published' and full_address = /*EXPECTED_FROM_PREFLIGHT*/;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #19 (suka-espresso · full_address): expected 1 row, got %', n; end if;

  -- 20. suka-espresso · opening_hours_json · add · source https://www.bysuka.com/suka-uluwatu
  update venues set opening_hours_json = '{"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"],"Friday":["7.30am-10.00pm"],"Saturday":["7.30am-10.00pm"],"Sunday":["7.30am-10.00pm"]}'::jsonb where slug = 'suka-espresso' and status = 'active' and publication_status = 'published' and opening_hours_json is null;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #20 (suka-espresso · opening_hours_json): expected 1 row, got %', n; end if;

  -- 21. ulu-garden · full_address · add · source https://ulutribe.com/contact/
  update venues set full_address = 'Jl. Pantai Padang-Padang, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361' where slug = 'ulu-garden' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #21 (ulu-garden · full_address): expected 1 row, got %', n; end if;

  -- 22. ulu-garden · opening_hours_json · add · source https://ulutribe.com/contact/
  update venues set opening_hours_json = '{"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"],"Friday":["7.00am-11.00pm"],"Saturday":["7.00am-11.00pm"],"Sunday":["7.00am-11.00pm"]}'::jsonb where slug = 'ulu-garden' and status = 'active' and publication_status = 'published' and opening_hours_json is null;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #22 (ulu-garden · opening_hours_json): expected 1 row, got %', n; end if;

  -- 23. waatu · full_address · add · source https://waatu.com/
  update venues set full_address = 'Jl. Pantai Sel. Gau, Ungasan, Kec. Kuta Sel., Kabupaten Badung, Bali 80362' where slug = 'waatu' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #23 (waatu · full_address): expected 1 row, got %', n; end if;

  -- 24. white-rock-beach-club · price_anchor · add · source https://whiterockbali.com/
  update venues set price_anchor = 'single sofa (2 pax) min. spend IDR 500K++; single bed (2 pax) min. spend IDR 2,000K++ — whiterockbali.com, 2026-09-28' where slug = 'white-rock-beach-club' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #24 (white-rock-beach-club · price_anchor): expected 1 row, got %', n; end if;

  -- 25. white-rock-beach-club · phone · add · source https://whiterockbali.com/
  update venues set phone = '+628113803003' where slug = 'white-rock-beach-club' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #25 (white-rock-beach-club · phone): expected 1 row, got %', n; end if;

  -- 26. yuki-uluwatu · full_address · add · source https://www.yuki-bali.com/ulu-reservations
  update venues set full_address = 'Jl. Labuansait, Pecatu, Kec. Kuta Selatan, Kabupaten Badung, Bali' where slug = 'yuki-uluwatu' and status = 'active' and publication_status = 'published' and (full_address is null or length(trim(full_address)) = 0);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #26 (yuki-uluwatu · full_address): expected 1 row, got %', n; end if;

  -- 27. zali-uluwatu · opening_hours_json · replace · source https://www.zalirestaurant.com/ · value corrected: official 'Everyday 8:00AM – 12:00AM'; '8.00am-23.59pm' would be dropped by toTime()
  update venues set opening_hours_json = '{"Monday":["8.00am-12.00am"],"Tuesday":["8.00am-12.00am"],"Wednesday":["8.00am-12.00am"],"Thursday":["8.00am-12.00am"],"Friday":["8.00am-12.00am"],"Saturday":["8.00am-12.00am"],"Sunday":["8.00am-12.00am"]}'::jsonb where slug = 'zali-uluwatu' and status = 'active' and publication_status = 'published' and opening_hours_json = /*EXPECTED_FROM_PREFLIGHT*/::jsonb;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'A #27 (zali-uluwatu · opening_hours_json): expected 1 row, got %', n; end if;
end $$;

-- ===================== B. AUDIT P0 — hijacked official websites: 6 cards, 5 domains =====================

do $$
declare n int;
begin
  -- 1. the-elephant · official_url → null · https://www.elephantbali.com/ → OLXTOTO slot site
  update venues set official_url = null where slug = 'the-elephant' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?elephantbali\.com(/|$)';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'B #1 (the-elephant · official_url → null): expected 1 row, got %', n; end if;

  -- 2. karsa-cafe · official_url → null · https://www.karsacafe.com/ → PG Soft slot demo site
  update venues set official_url = null where slug = 'karsa-cafe' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?karsacafe\.com(/|$)';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'B #2 (karsa-cafe · official_url → null): expected 1 row, got %', n; end if;

  -- 3. seminyak-yoga-shala · official_url → null · https://seminyakyogashala.com/ → Toto Macau site
  update venues set official_url = null where slug = 'seminyak-yoga-shala' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?seminyakyogashala\.com(/|$)';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'B #3 (seminyak-yoga-shala · official_url → null): expected 1 row, got %', n; end if;

  -- 4. cantika-zest · official_url → null · http://www.cantikazestbali.com/ → tevitoto99.com
  update venues set official_url = null where slug = 'cantika-zest' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?cantikazestbali\.com(/|$)';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'B #4 (cantika-zest · official_url → null): expected 1 row, got %', n; end if;

  -- 5. sees-bali-cafe-and-eatery · official_url → null · http://sendokbali.com/ → NAGALIGA game platform
  update venues set official_url = null where slug = 'sees-bali-cafe-and-eatery' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?sendokbali\.com(/|$)';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'B #5 (sees-bali-cafe-and-eatery · official_url → null): expected 1 row, got %', n; end if;

  -- 6. the-tree-international-bar-and-restaurant · official_url → null · https://www.sendokbali.com/ → same hijacked domain
  update venues set official_url = null where slug = 'the-tree-international-bar-and-restaurant' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?sendokbali\.com(/|$)';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'B #6 (the-tree-international-bar-and-restaurant · official_url → null): expected 1 row, got %', n; end if;
end $$;

-- ===================== 4. VERIFY =====================
select slug, official_url, full_address, phone, price_anchor, opening_hours_json, latitude, longitude, last_verified_at
from venues where slug in ('alchemy-uluwatu', 'bgs-uluwatu', 'gooseberry-french-restaurant-uluwatu', 'papi-sapi', 'seed-bingin', 'single-fin', 'suka-espresso', 'ulu-garden', 'waatu', 'white-rock-beach-club', 'yuki-uluwatu', 'zali-uluwatu', 'the-elephant', 'karsa-cafe', 'seminyak-yoga-shala', 'cantika-zest', 'sees-bali-cafe-and-eatery', 'the-tree-international-bar-and-restaurant')
order by slug;

-- Not applied (kept for the record):
--   single-fin · opening_hours_json · add — HOLD after re-confirmation on 2026-10-01 (see reconfirm-2026-10-01.json)
--   single-fin · phone · add — HOLD after re-confirmation on 2026-10-01 (see reconfirm-2026-10-01.json)
--   waatu · opening_hours_json · add — open-ended ("Daily 7.30am until late"): stays as registry text; no structured closing time is invented
--   yuki-uluwatu · opening_hours_json · add — open-ended ("Daily 11.00am until late"): stays as registry text; no structured closing time is invented

-- Hours as the site's parser reads them (lib/opening-hours.ts buildOpeningHoursSpec):
--   alchemy-uluwatu: Mo 07:30-22:00, Tu 07:30-22:00, We 07:30-22:00, Th 07:30-22:00, Fr 07:30-22:00, Sa 07:30-22:00, Su 07:30-22:00
--   gooseberry-french-restaurant-uluwatu: Mo 08:00-22:30, Tu 08:00-22:30, We 08:00-22:30, Th 08:00-22:30, Fr 08:00-22:30, Sa 08:00-22:30, Su 08:00-22:30
--   papi-sapi: Mo 16:00-23:30, Tu 16:00-23:30, We 16:00-23:30, Th 16:00-23:30, Fr 16:00-23:30, Sa 16:00-23:30, Su 16:00-23:30
--   seed-bingin: Mo 07:00-23:00, Tu 07:00-23:00, We 07:00-23:00, Th 07:00-23:00, Fr 07:00-23:00, Sa 07:00-23:00, Su 07:00-23:00
--   suka-espresso: Mo 07:30-22:00, Tu 07:30-22:00, We 07:30-22:00, Th 07:30-22:00, Fr 07:30-22:00, Sa 07:30-22:00, Su 07:30-22:00
--   ulu-garden: Mo 07:00-23:00, Tu 07:00-23:00, We 07:00-23:00, Th 07:00-23:00, Fr 07:00-23:00, Sa 07:00-23:00, Su 07:00-23:00
--   zali-uluwatu: Mo 08:00-23:59, Tu 08:00-23:59, We 08:00-23:59, Th 08:00-23:59, Fr 08:00-23:59, Sa 08:00-23:59, Su 08:00-23:59  [fixed: official 'Everyday 8:00AM – 12:00AM'; '8.00am-23.59pm' would be dropped by toTime()]
