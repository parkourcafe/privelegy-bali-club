-- batch-1 Uluwatu + audit P0, 2026-10-06: 32 statements (10 add, 16 replace, 6 remove). Paste into the Supabase SQL editor and run.
-- Every statement must change exactly 1 row; if one does not, the whole block rolls back and nothing is written.
-- Built from apply-2026-10-01.sql by tools/build-apply-2026-10-06.mjs. Replacements are guarded by the value production held on 2026-10-06.
-- Not written: seed-bingin / full_address: not written, the column already holds a full street address. last_verified_at is not touched.
do $apply$
declare n int;
begin
  -- 1. alchemy-uluwatu / price_anchor / replace
  update venues set price_anchor = 'Poke bowl IDR 105,000; Margherita pizza IDR 105,000 (official Uluwatu menu, 2026-09-28)' where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and price_anchor = '$$';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #1 (alchemy-uluwatu price_anchor): expected 1 row, got %', n; end if;
  -- 2. alchemy-uluwatu / opening_hours_json / add
  update venues set opening_hours_json = '{"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"],"Friday":["7.30am-10.00pm"],"Saturday":["7.30am-10.00pm"],"Sunday":["7.30am-10.00pm"]}'::jsonb where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and opening_hours_json is null;
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #2 (alchemy-uluwatu opening_hours_json): expected 1 row, got %', n; end if;
  -- 3. alchemy-uluwatu / phone / add
  update venues set phone = '+628113888143' where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone)) = 0);
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #3 (alchemy-uluwatu phone): expected 1 row, got %', n; end if;
  -- 4. alchemy-uluwatu / full_address / replace
  update venues set full_address = 'Jalan Pantai Bingin No 8, Pecatu, Uluwatu, Bali 80361' where slug = 'alchemy-uluwatu' and status = 'active' and publication_status = 'published' and full_address = 'Uluwatu/Bukit';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #4 (alchemy-uluwatu full_address): expected 1 row, got %', n; end if;
  -- 5. bgs-uluwatu / full_address / replace
  update venues set full_address = 'Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361' where slug = 'bgs-uluwatu' and status = 'active' and publication_status = 'published' and full_address = 'Uluwatu/Bukit';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #5 (bgs-uluwatu full_address): expected 1 row, got %', n; end if;
  -- 6. gooseberry-french-restaurant-uluwatu / opening_hours_json / add
  update venues set opening_hours_json = '{"Monday":["8.00am-10.30pm"],"Tuesday":["8.00am-10.30pm"],"Wednesday":["8.00am-10.30pm"],"Thursday":["8.00am-10.30pm"],"Friday":["8.00am-10.30pm"],"Saturday":["8.00am-10.30pm"],"Sunday":["8.00am-10.30pm"]}'::jsonb where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and opening_hours_json is null;
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #6 (gooseberry-french-restaurant-uluwatu opening_hours_json): expected 1 row, got %', n; end if;
  -- 7. gooseberry-french-restaurant-uluwatu / phone / add
  update venues set phone = '+6282144823166' where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone)) = 0);
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #7 (gooseberry-french-restaurant-uluwatu phone): expected 1 row, got %', n; end if;
  -- 8. gooseberry-french-restaurant-uluwatu / full_address / replace
  update venues set full_address = 'Gang Pirta, Pecatu, Kecamatan Kuta Selatan, Kabupaten Badung, Bali 80361' where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and full_address = 'Pecatu / uluwatu bukit';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #8 (gooseberry-french-restaurant-uluwatu full_address): expected 1 row, got %', n; end if;
  -- 9. gooseberry-french-restaurant-uluwatu / latitude / add
  update venues set latitude = -8.812029591240924, longitude = 115.11612367686756 where slug = 'gooseberry-french-restaurant-uluwatu' and status = 'active' and publication_status = 'published' and latitude is null and longitude is null;
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #9 (gooseberry-french-restaurant-uluwatu latitude): expected 1 row, got %', n; end if;
  -- 10. papi-sapi / price_anchor / replace
  update venues set price_anchor = 'sapi penyet burger 140K (menu-bali, 2026-09-28; grill cuts priced by weight at the showcase)' where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and price_anchor = '$$$';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #10 (papi-sapi price_anchor): expected 1 row, got %', n; end if;
  -- 11. papi-sapi / full_address / replace
  update venues set full_address = 'Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361' where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and full_address = 'Uluwatu/Bukit';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #11 (papi-sapi full_address): expected 1 row, got %', n; end if;
  -- 12. papi-sapi / opening_hours_json / replace
  update venues set opening_hours_json = '{"Monday":["4.00pm-11.30pm"],"Tuesday":["4.00pm-11.30pm"],"Wednesday":["4.00pm-11.30pm"],"Thursday":["4.00pm-11.30pm"],"Friday":["4.00pm-11.30pm"],"Saturday":["4.00pm-11.30pm"],"Sunday":["4.00pm-11.30pm"]}'::jsonb where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and opening_hours_json = to_jsonb(U&'Daily 16:00\201323:30'::text);
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #12 (papi-sapi opening_hours_json): expected 1 row, got %', n; end if;
  -- 13. papi-sapi / phone / add
  update venues set phone = '+62 851 9590 3719' where slug = 'papi-sapi' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone)) = 0);
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #13 (papi-sapi phone): expected 1 row, got %', n; end if;
  -- 14. seed-bingin / price_anchor / replace
  update venues set price_anchor = 'sumatran beef rendang 210k ++ (dinner menu, 2026-09-28)' where slug = 'seed-bingin' and status = 'active' and publication_status = 'published' and price_anchor = '$$$';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #14 (seed-bingin price_anchor): expected 1 row, got %', n; end if;
  -- 15. seed-bingin / opening_hours_json / replace
  update venues set opening_hours_json = '{"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"],"Friday":["7.00am-11.00pm"],"Saturday":["7.00am-11.00pm"],"Sunday":["7.00am-11.00pm"]}'::jsonb where slug = 'seed-bingin' and status = 'active' and publication_status = 'published' and opening_hours_json = '{"Monday":["7.30am-11.00pm"],"Tuesday":["7.30am-11.00pm"],"Wednesday":["7.30am-11.00pm"],"Thursday":["7.30am-11.00pm"],"Friday":["7.30am-11.00pm"],"Saturday":["7.30am-11.00pm"],"Sunday":["7.30am-11.00pm"]}'::jsonb;
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #15 (seed-bingin opening_hours_json): expected 1 row, got %', n; end if;
  -- 16. single-fin / price_anchor / replace
  update venues set price_anchor = 'nasi goreng single fin 135K incl. tax and service (eat & drinks menu, 2026-09-28)' where slug = 'single-fin' and status = 'active' and publication_status = 'published' and price_anchor = '$$';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #16 (single-fin price_anchor): expected 1 row, got %', n; end if;
  -- 17. single-fin / full_address / replace
  update venues set full_address = 'Pantai Suluban, Jl. Labuan Sait, Pecatu, Uluwatu, Kuta Selatan, Kabupaten Badung, Bali 80361' where slug = 'single-fin' and status = 'active' and publication_status = 'published' and full_address = 'Pecatu / uluwatu bukit';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #17 (single-fin full_address): expected 1 row, got %', n; end if;
  -- 18. suka-espresso / full_address / replace
  update venues set full_address = 'Jl. Labuansait, Uluwatu' where slug = 'suka-espresso' and status = 'active' and publication_status = 'published' and full_address = 'Pecatu / uluwatu bukit';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #18 (suka-espresso full_address): expected 1 row, got %', n; end if;
  -- 19. suka-espresso / opening_hours_json / add
  update venues set opening_hours_json = '{"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"],"Friday":["7.30am-10.00pm"],"Saturday":["7.30am-10.00pm"],"Sunday":["7.30am-10.00pm"]}'::jsonb where slug = 'suka-espresso' and status = 'active' and publication_status = 'published' and opening_hours_json is null;
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #19 (suka-espresso opening_hours_json): expected 1 row, got %', n; end if;
  -- 20. ulu-garden / full_address / replace
  update venues set full_address = 'Jl. Pantai Padang-Padang, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361' where slug = 'ulu-garden' and status = 'active' and publication_status = 'published' and full_address = 'Uluwatu/Bukit';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #20 (ulu-garden full_address): expected 1 row, got %', n; end if;
  -- 21. ulu-garden / opening_hours_json / add
  update venues set opening_hours_json = '{"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"],"Friday":["7.00am-11.00pm"],"Saturday":["7.00am-11.00pm"],"Sunday":["7.00am-11.00pm"]}'::jsonb where slug = 'ulu-garden' and status = 'active' and publication_status = 'published' and opening_hours_json is null;
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #21 (ulu-garden opening_hours_json): expected 1 row, got %', n; end if;
  -- 22. waatu / full_address / replace
  update venues set full_address = 'Jl. Pantai Sel. Gau, Ungasan, Kec. Kuta Sel., Kabupaten Badung, Bali 80362' where slug = 'waatu' and status = 'active' and publication_status = 'published' and full_address = 'Uluwatu/Bukit';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #22 (waatu full_address): expected 1 row, got %', n; end if;
  -- 23. white-rock-beach-club / price_anchor / add
  update venues set price_anchor = U&'single sofa (2 pax) min. spend IDR 500K++; single bed (2 pax) min. spend IDR 2,000K++ \2014 whiterockbali.com, 2026-09-28' where slug = 'white-rock-beach-club' and status = 'active' and publication_status = 'published' and (price_anchor is null or length(trim(price_anchor)) = 0);
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #23 (white-rock-beach-club price_anchor): expected 1 row, got %', n; end if;
  -- 24. white-rock-beach-club / phone / add
  update venues set phone = '+628113803003' where slug = 'white-rock-beach-club' and status = 'active' and publication_status = 'published' and (phone is null or length(trim(phone)) = 0);
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #24 (white-rock-beach-club phone): expected 1 row, got %', n; end if;
  -- 25. yuki-uluwatu / full_address / replace
  update venues set full_address = 'Jl. Labuansait, Pecatu, Kec. Kuta Selatan, Kabupaten Badung, Bali' where slug = 'yuki-uluwatu' and status = 'active' and publication_status = 'published' and full_address = 'Pecatu / uluwatu bukit';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #25 (yuki-uluwatu full_address): expected 1 row, got %', n; end if;
  -- 26. zali-uluwatu / opening_hours_json / replace
  update venues set opening_hours_json = '{"Monday":["8.00am-12.00am"],"Tuesday":["8.00am-12.00am"],"Wednesday":["8.00am-12.00am"],"Thursday":["8.00am-12.00am"],"Friday":["8.00am-12.00am"],"Saturday":["8.00am-12.00am"],"Sunday":["8.00am-12.00am"]}'::jsonb where slug = 'zali-uluwatu' and status = 'active' and publication_status = 'published' and opening_hours_json = '{"Monday":["8.00am-11.30pm"],"Tuesday":["8.00am-11.30pm"],"Wednesday":["8.00am-11.30pm"],"Thursday":["8.00am-11.30pm"],"Friday":["8.00am-11.30pm"],"Saturday":["8.00am-11.30pm"],"Sunday":["8.00am-11.30pm"]}'::jsonb;
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #26 (zali-uluwatu opening_hours_json): expected 1 row, got %', n; end if;
  -- 27. the-elephant / official_url / remove
  update venues set official_url = null where slug = 'the-elephant' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?elephantbali\.com(/|$)';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #27 (the-elephant official_url): expected 1 row, got %', n; end if;
  -- 28. karsa-cafe / official_url / remove
  update venues set official_url = null where slug = 'karsa-cafe' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?karsacafe\.com(/|$)';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #28 (karsa-cafe official_url): expected 1 row, got %', n; end if;
  -- 29. seminyak-yoga-shala / official_url / remove
  update venues set official_url = null where slug = 'seminyak-yoga-shala' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?seminyakyogashala\.com(/|$)';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #29 (seminyak-yoga-shala official_url): expected 1 row, got %', n; end if;
  -- 30. cantika-zest / official_url / remove
  update venues set official_url = null where slug = 'cantika-zest' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?cantikazestbali\.com(/|$)';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #30 (cantika-zest official_url): expected 1 row, got %', n; end if;
  -- 31. sees-bali-cafe-and-eatery / official_url / remove
  update venues set official_url = null where slug = 'sees-bali-cafe-and-eatery' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?sendokbali\.com(/|$)';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #31 (sees-bali-cafe-and-eatery official_url): expected 1 row, got %', n; end if;
  -- 32. the-tree-international-bar-and-restaurant / official_url / remove
  update venues set official_url = null where slug = 'the-tree-international-bar-and-restaurant' and status = 'active' and publication_status = 'published' and official_url ~* '^https?://(www\.)?sendokbali\.com(/|$)';
  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #32 (the-tree-international-bar-and-restaurant official_url): expected 1 row, got %', n; end if;
end $apply$;

-- Check: expect 0 rows.
select 'alchemy-uluwatu' as slug, 'price_anchor' as col from venues where slug = 'alchemy-uluwatu' and price_anchor is distinct from 'Poke bowl IDR 105,000; Margherita pizza IDR 105,000 (official Uluwatu menu, 2026-09-28)'
union all select 'alchemy-uluwatu' as slug, 'opening_hours_json' as col from venues where slug = 'alchemy-uluwatu' and opening_hours_json is distinct from '{"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"],"Friday":["7.30am-10.00pm"],"Saturday":["7.30am-10.00pm"],"Sunday":["7.30am-10.00pm"]}'::jsonb
union all select 'alchemy-uluwatu' as slug, 'phone' as col from venues where slug = 'alchemy-uluwatu' and phone is distinct from '+628113888143'
union all select 'alchemy-uluwatu' as slug, 'full_address' as col from venues where slug = 'alchemy-uluwatu' and full_address is distinct from 'Jalan Pantai Bingin No 8, Pecatu, Uluwatu, Bali 80361'
union all select 'bgs-uluwatu' as slug, 'full_address' as col from venues where slug = 'bgs-uluwatu' and full_address is distinct from 'Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361'
union all select 'gooseberry-french-restaurant-uluwatu' as slug, 'opening_hours_json' as col from venues where slug = 'gooseberry-french-restaurant-uluwatu' and opening_hours_json is distinct from '{"Monday":["8.00am-10.30pm"],"Tuesday":["8.00am-10.30pm"],"Wednesday":["8.00am-10.30pm"],"Thursday":["8.00am-10.30pm"],"Friday":["8.00am-10.30pm"],"Saturday":["8.00am-10.30pm"],"Sunday":["8.00am-10.30pm"]}'::jsonb
union all select 'gooseberry-french-restaurant-uluwatu' as slug, 'phone' as col from venues where slug = 'gooseberry-french-restaurant-uluwatu' and phone is distinct from '+6282144823166'
union all select 'gooseberry-french-restaurant-uluwatu' as slug, 'full_address' as col from venues where slug = 'gooseberry-french-restaurant-uluwatu' and full_address is distinct from 'Gang Pirta, Pecatu, Kecamatan Kuta Selatan, Kabupaten Badung, Bali 80361'
union all select 'gooseberry-french-restaurant-uluwatu' as slug, 'latitude' as col from venues where slug = 'gooseberry-french-restaurant-uluwatu' and latitude is distinct from -8.812029591240924
union all select 'gooseberry-french-restaurant-uluwatu' as slug, 'longitude' as col from venues where slug = 'gooseberry-french-restaurant-uluwatu' and longitude is distinct from 115.11612367686756
union all select 'papi-sapi' as slug, 'price_anchor' as col from venues where slug = 'papi-sapi' and price_anchor is distinct from 'sapi penyet burger 140K (menu-bali, 2026-09-28; grill cuts priced by weight at the showcase)'
union all select 'papi-sapi' as slug, 'full_address' as col from venues where slug = 'papi-sapi' and full_address is distinct from 'Jl. Labuansait, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361'
union all select 'papi-sapi' as slug, 'opening_hours_json' as col from venues where slug = 'papi-sapi' and opening_hours_json is distinct from '{"Monday":["4.00pm-11.30pm"],"Tuesday":["4.00pm-11.30pm"],"Wednesday":["4.00pm-11.30pm"],"Thursday":["4.00pm-11.30pm"],"Friday":["4.00pm-11.30pm"],"Saturday":["4.00pm-11.30pm"],"Sunday":["4.00pm-11.30pm"]}'::jsonb
union all select 'papi-sapi' as slug, 'phone' as col from venues where slug = 'papi-sapi' and phone is distinct from '+62 851 9590 3719'
union all select 'seed-bingin' as slug, 'price_anchor' as col from venues where slug = 'seed-bingin' and price_anchor is distinct from 'sumatran beef rendang 210k ++ (dinner menu, 2026-09-28)'
union all select 'seed-bingin' as slug, 'opening_hours_json' as col from venues where slug = 'seed-bingin' and opening_hours_json is distinct from '{"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"],"Friday":["7.00am-11.00pm"],"Saturday":["7.00am-11.00pm"],"Sunday":["7.00am-11.00pm"]}'::jsonb
union all select 'single-fin' as slug, 'price_anchor' as col from venues where slug = 'single-fin' and price_anchor is distinct from 'nasi goreng single fin 135K incl. tax and service (eat & drinks menu, 2026-09-28)'
union all select 'single-fin' as slug, 'full_address' as col from venues where slug = 'single-fin' and full_address is distinct from 'Pantai Suluban, Jl. Labuan Sait, Pecatu, Uluwatu, Kuta Selatan, Kabupaten Badung, Bali 80361'
union all select 'suka-espresso' as slug, 'full_address' as col from venues where slug = 'suka-espresso' and full_address is distinct from 'Jl. Labuansait, Uluwatu'
union all select 'suka-espresso' as slug, 'opening_hours_json' as col from venues where slug = 'suka-espresso' and opening_hours_json is distinct from '{"Monday":["7.30am-10.00pm"],"Tuesday":["7.30am-10.00pm"],"Wednesday":["7.30am-10.00pm"],"Thursday":["7.30am-10.00pm"],"Friday":["7.30am-10.00pm"],"Saturday":["7.30am-10.00pm"],"Sunday":["7.30am-10.00pm"]}'::jsonb
union all select 'ulu-garden' as slug, 'full_address' as col from venues where slug = 'ulu-garden' and full_address is distinct from 'Jl. Pantai Padang-Padang, Pecatu, Kec. Kuta Sel., Kabupaten Badung, Bali 80361'
union all select 'ulu-garden' as slug, 'opening_hours_json' as col from venues where slug = 'ulu-garden' and opening_hours_json is distinct from '{"Monday":["7.00am-11.00pm"],"Tuesday":["7.00am-11.00pm"],"Wednesday":["7.00am-11.00pm"],"Thursday":["7.00am-11.00pm"],"Friday":["7.00am-11.00pm"],"Saturday":["7.00am-11.00pm"],"Sunday":["7.00am-11.00pm"]}'::jsonb
union all select 'waatu' as slug, 'full_address' as col from venues where slug = 'waatu' and full_address is distinct from 'Jl. Pantai Sel. Gau, Ungasan, Kec. Kuta Sel., Kabupaten Badung, Bali 80362'
union all select 'white-rock-beach-club' as slug, 'price_anchor' as col from venues where slug = 'white-rock-beach-club' and price_anchor is distinct from U&'single sofa (2 pax) min. spend IDR 500K++; single bed (2 pax) min. spend IDR 2,000K++ \2014 whiterockbali.com, 2026-09-28'
union all select 'white-rock-beach-club' as slug, 'phone' as col from venues where slug = 'white-rock-beach-club' and phone is distinct from '+628113803003'
union all select 'yuki-uluwatu' as slug, 'full_address' as col from venues where slug = 'yuki-uluwatu' and full_address is distinct from 'Jl. Labuansait, Pecatu, Kec. Kuta Selatan, Kabupaten Badung, Bali'
union all select 'zali-uluwatu' as slug, 'opening_hours_json' as col from venues where slug = 'zali-uluwatu' and opening_hours_json is distinct from '{"Monday":["8.00am-12.00am"],"Tuesday":["8.00am-12.00am"],"Wednesday":["8.00am-12.00am"],"Thursday":["8.00am-12.00am"],"Friday":["8.00am-12.00am"],"Saturday":["8.00am-12.00am"],"Sunday":["8.00am-12.00am"]}'::jsonb
union all select 'the-elephant' as slug, 'official_url' as col from venues where slug = 'the-elephant' and official_url is distinct from null
union all select 'karsa-cafe' as slug, 'official_url' as col from venues where slug = 'karsa-cafe' and official_url is distinct from null
union all select 'seminyak-yoga-shala' as slug, 'official_url' as col from venues where slug = 'seminyak-yoga-shala' and official_url is distinct from null
union all select 'cantika-zest' as slug, 'official_url' as col from venues where slug = 'cantika-zest' and official_url is distinct from null
union all select 'sees-bali-cafe-and-eatery' as slug, 'official_url' as col from venues where slug = 'sees-bali-cafe-and-eatery' and official_url is distinct from null
union all select 'the-tree-international-bar-and-restaurant' as slug, 'official_url' as col from venues where slug = 'the-tree-international-bar-and-restaurant' and official_url is distinct from null;
