-- copy-pilot-2026-10-06: 29 statement(s). Paste into the Supabase SQL editor and run.
-- Every statement must change exactly 1 row; if one does not, the whole block rolls back and nothing is written.
-- Generated 2026-10-06 by scripts/copy/build-copy-sql.mjs. Guards: md5 of the current text; every literal is ASCII.
do $apply$
declare n int;
begin
  -- 1. milk-and-madu-beach-road / why_its_here / replace
  update venues set why_its_here = 'An all-day cafe on Batu Bolong beach road, part of the Milk & Madu group. The room is spacious and shaded by palms, with a kids'' play area, and the kitchen does brunch classics and lava-stone pizzas.' where slug = 'milk-and-madu-beach-road' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '0748e95f6c49ce02e6ab5ea70f8bf6e5';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #1 (milk-and-madu-beach-road why_its_here): expected 1 row, got %', n; end if;
  -- 2. milk-and-madu-beach-road / best_for / replace
  update venues set best_for = 'Families with young children and groups, from brunch to an early dinner or the daily sunset session' where slug = 'milk-and-madu-beach-road' and status = 'active' and publication_status = 'published' and md5(best_for) = '4e8da344161f8a5beff5f8e243316522';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #2 (milk-and-madu-beach-road best_for): expected 1 row, got %', n; end if;
  -- 3. milk-and-madu-beach-road / not_for / replace
  update venues set not_for = 'Couples after a quiet, intimate dinner' where slug = 'milk-and-madu-beach-road' and status = 'active' and publication_status = 'published' and md5(not_for) = '1d5f69119a6d94bde19873fb553be246';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #3 (milk-and-madu-beach-road not_for): expected 1 row, got %', n; end if;
  -- 4. atlas-beach-club / why_its_here / replace
  update venues set why_its_here = 'A large beachfront complex on Jl. Pantai Berawa. It runs four venues on one site: a beach club, the Super Club, a wellness club and a padel club. Its own website calls it the world''s biggest beach club; we have not checked that. You enter on a day pass, and daybeds and sofas are booked separately.' where slug = 'atlas-beach-club' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '12f27138f329e140c020ea56c69f69ac';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #4 (atlas-beach-club why_its_here): expected 1 row, got %', n; end if;
  -- 5. atlas-beach-club / best_for / replace
  update venues set best_for = 'A big, lively day out with a group, or sunset drinks in a party crowd' where slug = 'atlas-beach-club' and status = 'active' and publication_status = 'published' and md5(best_for) = 'c2b9fb07d31251c49b835e07806e7780';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #5 (atlas-beach-club best_for): expected 1 row, got %', n; end if;
  -- 6. atlas-beach-club / not_for / replace
  update venues set not_for = 'A small, quiet or intimate evening' where slug = 'atlas-beach-club' and status = 'active' and publication_status = 'published' and md5(not_for) = 'a18dfbbd8fe037b56362a4377cbb89aa';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #6 (atlas-beach-club not_for): expected 1 row, got %', n; end if;
  -- 7. nook-umalas / why_its_here / replace
  update venues set why_its_here = U&'An open-air caf\00E9 and restaurant beside the Umalas rice fields, open 8am to 11pm. The menu runs Western and Indonesian all day, from breakfast to late, with vegetarian, vegan and gluten-free dishes. Seminyak and its bustle are a short hop away.' where slug = 'nook-umalas' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'e2e1a38e58ff30a1026acca87281f9c3';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #7 (nook-umalas why_its_here): expected 1 row, got %', n; end if;
  -- 8. nook-umalas / best_for / replace
  update venues set best_for = 'A calm breakfast or brunch looking at rice fields, for couples or a group staying off the strip' where slug = 'nook-umalas' and status = 'active' and publication_status = 'published' and md5(best_for) = '32f7572bbbe2c6b0ee8290e4d962d6b0';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #8 (nook-umalas best_for): expected 1 row, got %', n; end if;
  -- 9. nook-umalas / not_for / replace
  update venues set not_for = 'Polished fine dining, a beachfront setting or a night out' where slug = 'nook-umalas' and status = 'active' and publication_status = 'published' and md5(not_for) = '4a789dd1f73cf3e55941eb6130056d34';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #9 (nook-umalas not_for): expected 1 row, got %', n; end if;
  -- 10. ji-restaurant-bali / why_its_here / replace
  update venues set why_its_here = 'Japanese-contemporary dining at Hotel Tugu, right on Batu Bolong beach. The room is a reconstructed antique temple, and the terrace looks straight at the ocean. Sushi, Asian-fusion plates and cocktails.' where slug = 'ji-restaurant-bali' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '0bf9ed9f370f2067913711e0165406e1';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #10 (ji-restaurant-bali why_its_here): expected 1 row, got %', n; end if;
  -- 11. ji-restaurant-bali / best_for / replace
  update venues set best_for = 'A sunset dinner with a view, a date, or a special occasion by the sea' where slug = 'ji-restaurant-bali' and status = 'active' and publication_status = 'published' and md5(best_for) = '1a8cf6414afcec9522f16b9e15de924f';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #11 (ji-restaurant-bali best_for): expected 1 row, got %', n; end if;
  -- 12. sensorium-bali / why_its_here / replace
  update venues set why_its_here = 'A daytime cafe on Jl. Pantai Batu Mejan run by a chef trained in Australian fine dining. The food is Australian cafe cooking with Japanese flavours, and the room is minimalist.' where slug = 'sensorium-bali' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '0a6e6c780c7f8561379decc387a9ba68';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #12 (sensorium-bali why_its_here): expected 1 row, got %', n; end if;
  -- 13. sensorium-bali / best_for / replace
  update venues set best_for = 'Brunch or lunch in a calm, design-led room, or a daytime stop with a laptop' where slug = 'sensorium-bali' and status = 'active' and publication_status = 'published' and md5(best_for) = 'cbb896544163a18d1fb61d5e8530585c';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #13 (sensorium-bali best_for): expected 1 row, got %', n; end if;
  -- 14. sensorium-bali / not_for / replace
  update venues set not_for = U&'Dinner or late-night plans \2014 it keeps daytime hours only' where slug = 'sensorium-bali' and status = 'active' and publication_status = 'published' and md5(not_for) = '49dab13721423d38a8822fdd90ce0da6';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #14 (sensorium-bali not_for): expected 1 row, got %', n; end if;
  -- 15. fair-warung-bale / why_its_here / replace
  update venues set why_its_here = 'A ten-table warung on Jalan Sriwedari in Taman Kaja, run by the Fair Future Foundation and Bali Sari Foundation. What you pay here funds free medical consultations for local people. The menu is Indonesian, Asian-fusion and vegetarian, every day.' where slug = 'fair-warung-bale' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'f1a315b9047d954ebf605e83e6d26ccc';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #15 (fair-warung-bale why_its_here): expected 1 row, got %', n; end if;
  -- 16. fair-warung-bale / best_for / replace
  update venues set best_for = 'A casual lunch or early dinner that also funds free medical consultations locally' where slug = 'fair-warung-bale' and status = 'active' and publication_status = 'published' and md5(best_for) = '0999d51d72296b3dbdf1ddcf2a9e53ff';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #16 (fair-warung-bale best_for): expected 1 row, got %', n; end if;
  -- 17. fair-warung-bale / not_for / replace
  update venues set not_for = 'Upscale dining or a sunset view. It is a simple ten-table warung' where slug = 'fair-warung-bale' and status = 'active' and publication_status = 'published' and md5(not_for) = 'f1197410a8e33d56e3fef62564a2896c';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #17 (fair-warung-bale not_for): expected 1 row, got %', n; end if;
  -- 18. warung-mendez / why_its_here / replace
  update venues set why_its_here = 'A small warung in Penestanan village, northwest of central Ubud, with an all-women kitchen team. The cooking is Indonesian and Javanese, made without MSG and with little plastic.' where slug = 'warung-mendez' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '6df999f0def9cabe28c2f1aed3ea210f';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #18 (warung-mendez why_its_here): expected 1 row, got %', n; end if;
  -- 19. warung-mendez / best_for / replace
  update venues set best_for = 'A quiet, home-style Indonesian meal away from the main Ubud strip' where slug = 'warung-mendez' and status = 'active' and publication_status = 'published' and md5(best_for) = 'b4b71123fa51b580b3e13921c93e1dd8';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #19 (warung-mendez best_for): expected 1 row, got %', n; end if;
  -- 20. warung-mendez / not_for / replace
  update venues set not_for = 'A quick stop in the centre of town; Penestanan takes finding' where slug = 'warung-mendez' and status = 'active' and publication_status = 'published' and md5(not_for) = '190ee771db96a917712c7ea6293b38e6';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #20 (warung-mendez not_for): expected 1 row, got %', n; end if;
  -- 21. wulan-vegetarian-warung / why_its_here / replace
  update venues set why_its_here = 'A small all-vegan warung in Peliatan, Ubud, with floor-cushion seating and cash only. The menu is Indonesian: nasi goreng, tempeh, smoothies and vegan sweets, at very low prices.' where slug = 'wulan-vegetarian-warung' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'cf75ef29151bd213f5d6d4aa63e36046';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #21 (wulan-vegetarian-warung why_its_here): expected 1 row, got %', n; end if;
  -- 22. wulan-vegetarian-warung / best_for / replace
  update venues set best_for = 'Vegan or vegetarian travellers on a budget who want simple Indonesian food' where slug = 'wulan-vegetarian-warung' and status = 'active' and publication_status = 'published' and md5(best_for) = '885d4df1a2a9ab96d634cd12df147c53';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #22 (wulan-vegetarian-warung best_for): expected 1 row, got %', n; end if;
  -- 23. wulan-vegetarian-warung / not_for / replace
  update venues set not_for = 'Card payments or a table and chairs: it is cash only, with floor cushions' where slug = 'wulan-vegetarian-warung' and status = 'active' and publication_status = 'published' and md5(not_for) = '67f309837e73b7f82386a7b31f2be1b7';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #23 (wulan-vegetarian-warung not_for): expected 1 row, got %', n; end if;
  -- 24. bali-buda-ubud / why_its_here / replace
  update venues set why_its_here = 'An organic grocery and bakery with an all-day restaurant attached, in Ubud since 1994. The kitchen covers raw vegan, Italian and traditional Indonesian dishes.' where slug = 'bali-buda-ubud' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '38049551a7708301a15f3942208a616d';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #24 (bali-buda-ubud why_its_here): expected 1 row, got %', n; end if;
  -- 25. bali-buda-ubud / best_for / replace
  update venues set best_for = 'A long stay or a mixed group that needs one big menu with vegetarian, vegan and gluten-free choices' where slug = 'bali-buda-ubud' and status = 'active' and publication_status = 'published' and md5(best_for) = '32f4583669479f3acb839c7cfb1743c2';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #25 (bali-buda-ubud best_for): expected 1 row, got %', n; end if;
  -- 26. bali-buda-ubud / not_for / replace
  update venues set not_for = 'A special occasion or an intimate dinner, because it is a casual health-food restaurant and shop' where slug = 'bali-buda-ubud' and status = 'active' and publication_status = 'published' and md5(not_for) = '4b732763b0cf319314c13655847fc21f';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #26 (bali-buda-ubud not_for): expected 1 row, got %', n; end if;
  -- 27. kilig-bali / why_its_here / replace
  update venues set why_its_here = 'A Filipino warung in Peliatan, in a bamboo hut looking over rice fields. The cooking is home-style Filipino comfort food, in an area where the menus are otherwise Balinese and Western.' where slug = 'kilig-bali' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '9f182db884153bdd08fb69ddb7a64eaa';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #27 (kilig-bali why_its_here): expected 1 row, got %', n; end if;
  -- 28. kilig-bali / best_for / replace
  update venues set best_for = 'Filipino comfort food at a shared table, or a calm family dinner looking over rice fields' where slug = 'kilig-bali' and status = 'active' and publication_status = 'published' and md5(best_for) = 'da51a99e56e173bc2a79c1d5de013e08';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #28 (kilig-bali best_for): expected 1 row, got %', n; end if;
  -- 29. kilig-bali / not_for / replace
  update venues set not_for = 'A quick stop from central Ubud, or anyone avoiding rich, pork-heavy dishes' where slug = 'kilig-bali' and status = 'active' and publication_status = 'published' and md5(not_for) = '79aa53b8e3ba27169e089e4edaf6c62c';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-pilot-2026-10-06 #29 (kilig-bali not_for): expected 1 row, got %', n; end if;
end $apply$;

-- Check: expect 0 rows.
select d.slug, d.field
from (values
  ('milk-and-madu-beach-road', 'why_its_here', '533a7e3c1ec5fca748d98eed89478b45'),
  ('milk-and-madu-beach-road', 'best_for', '97388b1facc43129d8d45070ac0823cd'),
  ('milk-and-madu-beach-road', 'not_for', '6f8370c0c067f62cc0c208b666604b47'),
  ('atlas-beach-club', 'why_its_here', '8036b2828f79d88a5db37200a6d9d0a3'),
  ('atlas-beach-club', 'best_for', '9445629366aca7bd813b8b8478fa4744'),
  ('atlas-beach-club', 'not_for', '33e8a3108cd7c45d25baee0ee80a0563'),
  ('nook-umalas', 'why_its_here', 'ec4b2161ba16bfbad76f20b2c62593e7'),
  ('nook-umalas', 'best_for', 'ebd9eaa31cdd42271ae7ac404f75056d'),
  ('nook-umalas', 'not_for', '509f2a8de761721ece7b604781937e48'),
  ('ji-restaurant-bali', 'why_its_here', 'dda183a1818aa2e9cd7a1683cadc13ce'),
  ('ji-restaurant-bali', 'best_for', '3938cdc40fb0d23fbacb8120fd2e7f16'),
  ('sensorium-bali', 'why_its_here', 'd2884b2f41c3fb7c8f8b67f61346af2c'),
  ('sensorium-bali', 'best_for', 'ab062fc45e7b7bd4e3369c3015d5f9dd'),
  ('sensorium-bali', 'not_for', '357f6a56af536557bdda41c4e83e6f7c'),
  ('fair-warung-bale', 'why_its_here', 'ad95da40f1ebb8a69909baaaaa2d283b'),
  ('fair-warung-bale', 'best_for', 'f7c407de1b42393798fd68a53576664b'),
  ('fair-warung-bale', 'not_for', '33129efb36327d67ff923c940ba93806'),
  ('warung-mendez', 'why_its_here', '11bb073c20dc12f9eca30d486e06362e'),
  ('warung-mendez', 'best_for', '1033be3b0e4e6d050f79a8807ba72e32'),
  ('warung-mendez', 'not_for', 'e8c0645b2c9436da68b86bb530a56625'),
  ('wulan-vegetarian-warung', 'why_its_here', 'd601aabd0e72c0943d4a8635e9edf338'),
  ('wulan-vegetarian-warung', 'best_for', '17b28a5d1d042088b02088ab9e81d191'),
  ('wulan-vegetarian-warung', 'not_for', '0f8eb7748855dec0c8df6329490f7f78'),
  ('bali-buda-ubud', 'why_its_here', '817a878d28270159e3ac4b6fae296ddf'),
  ('bali-buda-ubud', 'best_for', '89b49ea9aa50522d40eced3b914363e1'),
  ('bali-buda-ubud', 'not_for', 'f02a3e708e5b5e67fbc171b570e53488'),
  ('kilig-bali', 'why_its_here', 'e9f5ecd96ef951554c40412cecef61d4'),
  ('kilig-bali', 'best_for', 'c5e8e502928b40d1a820d5e57535bfb8'),
  ('kilig-bali', 'not_for', 'c0219f9b2f75a81741a1adbf3df1a8d1')
) as d(slug, field, want)
left join venues v on v.slug = d.slug
where v.slug is null or case d.field when 'why_its_here' then md5(v.why_its_here) when 'best_for' then md5(v.best_for) when 'not_for' then md5(v.not_for) when 'price_anchor' then md5(v.price_anchor) when 'what_to_order' then md5(v.what_to_order) end is distinct from d.want
order by 1, 2;
