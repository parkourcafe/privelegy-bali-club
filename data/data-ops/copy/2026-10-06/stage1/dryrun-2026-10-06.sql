-- copy-stage1-2026-10-06: dry run of paste-2026-10-06.sql. Always ends in an exception, so nothing is kept.
do $apply$
declare n int;
begin
  -- 1. loloan-coastal-peruvian-raffles-bali / why_its_here / null
  update venues set why_its_here = null where slug = 'loloan-coastal-peruvian-raffles-bali' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'e3f5ea4abffe6a00253b4d05dc1d4757';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #1 (loloan-coastal-peruvian-raffles-bali why_its_here): expected 1 row, got %', n; end if;
  -- 2. merah-putih / why_its_here / null
  update venues set why_its_here = null where slug = 'merah-putih' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'e3f5ea4abffe6a00253b4d05dc1d4757';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #2 (merah-putih why_its_here): expected 1 row, got %', n; end if;
  -- 3. dining-corner-kayumanis-ubud / why_its_here / null
  update venues set why_its_here = null where slug = 'dining-corner-kayumanis-ubud' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'e3f5ea4abffe6a00253b4d05dc1d4757';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #3 (dining-corner-kayumanis-ubud why_its_here): expected 1 row, got %', n; end if;
  -- 4. pasar-senggol-at-grand-hyatt-bali / why_its_here / null
  update venues set why_its_here = null where slug = 'pasar-senggol-at-grand-hyatt-bali' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'd1636f174a8f01e4f819acdb31a09e5b';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #4 (pasar-senggol-at-grand-hyatt-bali why_its_here): expected 1 row, got %', n; end if;
  -- 5. hedonist-space-restaurant-lounge-bar / why_its_here / null
  update venues set why_its_here = null where slug = 'hedonist-space-restaurant-lounge-bar' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'f3662584ea5e004e9b2edc1f430d4022';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #5 (hedonist-space-restaurant-lounge-bar why_its_here): expected 1 row, got %', n; end if;
  -- 6. sarong / why_its_here / null
  update venues set why_its_here = null where slug = 'sarong' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '062512f32f386ff40114dba4d57cca31';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #6 (sarong why_its_here): expected 1 row, got %', n; end if;
  -- 7. sarong / best_for / null
  update venues set best_for = null where slug = 'sarong' and status = 'active' and publication_status = 'published' and md5(best_for) = '804ae9b8c349e631dd4d01bb9a2e381e';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #7 (sarong best_for): expected 1 row, got %', n; end if;
  -- 8. cafe-vida-healthy-organic-restaurant-canggu / why_its_here / replace
  update venues set why_its_here = 'An organic restaurant on Jl. Pantai Batu Bolong 38A serving breakfast, lunch and dinner daily from 7am to 10:30pm, with vegan, vegetarian and gluten-free options.' where slug = 'cafe-vida-healthy-organic-restaurant-canggu' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '7b62a42b21a99ca2caf397a2ef29e1ad';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #8 (cafe-vida-healthy-organic-restaurant-canggu why_its_here): expected 1 row, got %', n; end if;
  -- 9. babi-guling-men-agus / why_its_here / replace
  update venues set why_its_here = 'A roadside babi guling warung on Jl. Raya Canggu. Babi guling is Balinese spit-roast pork, normally served over rice with sides.' where slug = 'babi-guling-men-agus' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'e395f09e769ca4e0ead2381edff4e9ed';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #9 (babi-guling-men-agus why_its_here): expected 1 row, got %', n; end if;
  -- 10. babi-guling-men-agus / not_for / null
  update venues set not_for = null where slug = 'babi-guling-men-agus' and status = 'active' and publication_status = 'published' and md5(not_for) = '5bae040396088d514044e7ad3e55eebc';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #10 (babi-guling-men-agus not_for): expected 1 row, got %', n; end if;
  -- 11. babi-guling-men-lari / why_its_here / replace
  update venues set why_its_here = 'A babi guling warung in the Canggu area, operating as a branch of Men Lari in Mengwi. Babi guling is Balinese spit-roast pork, usually served over rice with sides.' where slug = 'babi-guling-men-lari' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'b741342468074c9fc54c33085a32170b';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #11 (babi-guling-men-lari why_its_here): expected 1 row, got %', n; end if;
  -- 12. lopodo-catering-and-events / why_its_here / replace
  update venues set why_its_here = 'Lopodo is a Halal-certified catering and event company on Jl. Raya Canggu, cooking Indonesian, Balinese, Javanese, Asian and Western menus for villas, weddings, corporate events and private-chef bookings, with its own event space in Canggu.' where slug = 'lopodo-catering-and-events' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '5f1a527f43ded4242755366be13179df';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #12 (lopodo-catering-and-events why_its_here): expected 1 row, got %', n; end if;
  -- 13. soma-fight-club-canggu / why_its_here / replace
  update venues set why_its_here = 'A Canggu combat-sports and functional-fitness club with striking, grappling and conditioning classes.' where slug = 'soma-fight-club-canggu' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '3a0dc85963fc485b0ccb0b589c4998d5';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #13 (soma-fight-club-canggu why_its_here): expected 1 row, got %', n; end if;
  -- 14. tonic-day-spa-botanicals-canggu / why_its_here / replace
  update venues set why_its_here = 'A Berawa day spa with a botanicals-led treatment menu, from massage to facials.' where slug = 'tonic-day-spa-botanicals-canggu' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '630c956ac96dd0c58c0ed0fc0c52f099';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #14 (tonic-day-spa-botanicals-canggu why_its_here): expected 1 row, got %', n; end if;
  -- 15. dala-spa-at-alaya-resort-ubud / why_its_here / replace
  update venues set why_its_here = 'The DaLa Spa at Alaya Resort Ubud in Pengosekan, a resort spa open daily until late.' where slug = 'dala-spa-at-alaya-resort-ubud' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '62b078d1cdcae239dd18276649ee575a';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #15 (dala-spa-at-alaya-resort-ubud why_its_here): expected 1 row, got %', n; end if;
  -- 16. jaens-spa-ubud-ubud / why_its_here / replace
  update venues set why_its_here = 'An Ubud day spa with Balinese massage and packages from around 295k.' where slug = 'jaens-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'c2b82b16a76ed6af9621acb3ff874776';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #16 (jaens-spa-ubud-ubud why_its_here): expected 1 row, got %', n; end if;
  -- 17. jaens-spa-ubud-ubud / best_for / replace
  update venues set best_for = 'A massage without resort prices' where slug = 'jaens-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and md5(best_for) = '3421f977c554a5dcfd7a9b45af87d024';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #17 (jaens-spa-ubud-ubud best_for): expected 1 row, got %', n; end if;
  -- 18. svaha-spa-bisma-ubud / why_its_here / replace
  update venues set why_its_here = 'The Bisma branch of Svaha Spa near Ubud centre, a day spa for massage and treatments.' where slug = 'svaha-spa-bisma-ubud' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'a309ee6a5cf398f85740ad775275ce2c';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #18 (svaha-spa-bisma-ubud why_its_here): expected 1 row, got %', n; end if;
  -- 19. svaha-spa-bisma-ubud / best_for / replace
  update venues set best_for = 'An easy-to-reach massage near Ubud centre' where slug = 'svaha-spa-bisma-ubud' and status = 'active' and publication_status = 'published' and md5(best_for) = '44b95c77bf3bd4514b9e6436a5d70d8d';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #19 (svaha-spa-bisma-ubud best_for): expected 1 row, got %', n; end if;
  -- 20. svaha-spa-beauty-ubud-ubud / best_for / replace
  update venues set best_for = U&'Nails, waxing or a facial near the Bisma caf\00E9s' where slug = 'svaha-spa-beauty-ubud-ubud' and status = 'active' and publication_status = 'published' and md5(best_for) = 'f75c280d784a941fd1a9d95c7b1e6894';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #20 (svaha-spa-beauty-ubud-ubud best_for): expected 1 row, got %', n; end if;
  -- 21. dorsey-s-barber-shop-uluwatu / why_its_here / replace
  update venues set why_its_here = 'A barbershop inside Habitat Village on Jl. Labuansait: haircuts, fades, shaves and beard trims.' where slug = 'dorsey-s-barber-shop-uluwatu' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '614e6f454c5adc376e16406a9781f01e';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #21 (dorsey-s-barber-shop-uluwatu why_its_here): expected 1 row, got %', n; end if;
  -- 22. dorsey-s-barber-shop-uluwatu / best_for / replace
  update venues set best_for = 'A cut or hot-towel shave in central Uluwatu' where slug = 'dorsey-s-barber-shop-uluwatu' and status = 'active' and publication_status = 'published' and md5(best_for) = '334f6ecdd8d411589a4c5d65fa5abb0a';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #22 (dorsey-s-barber-shop-uluwatu best_for): expected 1 row, got %', n; end if;
  -- 23. nasi-bali-men-weti / why_its_here / replace
  update venues set why_its_here = 'A Balinese nasi campur breakfast stall running since the 1970s, near the Sindhu beach access. Opens early and closes when the food runs out, usually by early afternoon.' where slug = 'nasi-bali-men-weti' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'b07f449c847ac6d2cc1a0b3ef26987a3';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #23 (nasi-bali-men-weti why_its_here): expected 1 row, got %', n; end if;
  -- 24. warung-mak-beng / best_for / replace
  update venues set best_for = 'a fast one-plate seafood lunch; solo diners and quick stops; travellers who want the set meal with no menu decisions' where slug = 'warung-mak-beng' and status = 'active' and publication_status = 'published' and md5(best_for) = 'b4da1326542e7997622e2631e7ac41d2';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #24 (warung-mak-beng best_for): expected 1 row, got %', n; end if;
  -- 25. jimbaran-warrior / why_its_here / replace
  update venues set why_its_here = 'A no-frills strength-and-conditioning gym in Jimbaran, with equipment for functional training.' where slug = 'jimbaran-warrior' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '26242836f9efb0e20883978a91b2b35d';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #25 (jimbaran-warrior why_its_here): expected 1 row, got %', n; end if;
  -- 26. the-practice-bali-canggu / why_its_here / replace
  update venues set why_its_here = U&'A Batu Bolong yoga studio with breath-led, alignment-focused classes in an upstairs shala (8am\20139pm).' where slug = 'the-practice-bali-canggu' and status = 'active' and publication_status = 'published' and md5(why_its_here) = '144d50545cdc266f81f35c61d6ac1399';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #26 (the-practice-bali-canggu why_its_here): expected 1 row, got %', n; end if;
  -- 27. toko-kopi-tuku / why_its_here / replace
  update venues set why_its_here = 'A Jakarta neighbourhood coffee brand, here in its first Bali store, built around the Es Kopi Susu Tetangga, a palm-sugar milk coffee. The Renon outlet keeps the everyday, grab-and-go format on a quiet government-district street rather than the tourist strip.' where slug = 'toko-kopi-tuku' and status = 'active' and publication_status = 'published' and md5(why_its_here) = 'd79fae82ef743f3e057d44da5174c50d';
  get diagnostics n = row_count; if n <> 1 then raise exception 'copy-stage1-2026-10-06 #27 (toko-kopi-tuku why_its_here): expected 1 row, got %', n; end if;
  select count(*) into n
  from (values
    ('loloan-coastal-peruvian-raffles-bali', 'why_its_here', null),
    ('merah-putih', 'why_its_here', null),
    ('dining-corner-kayumanis-ubud', 'why_its_here', null),
    ('pasar-senggol-at-grand-hyatt-bali', 'why_its_here', null),
    ('hedonist-space-restaurant-lounge-bar', 'why_its_here', null),
    ('sarong', 'why_its_here', null),
    ('sarong', 'best_for', null),
    ('cafe-vida-healthy-organic-restaurant-canggu', 'why_its_here', '265b4d3f287dfd8890ee78347bccfbaa'),
    ('babi-guling-men-agus', 'why_its_here', '46ea3e9dacc4773fb6e50424fbace461'),
    ('babi-guling-men-agus', 'not_for', null),
    ('babi-guling-men-lari', 'why_its_here', 'a3d62cc4abc502cd1ea778c00a2218e7'),
    ('lopodo-catering-and-events', 'why_its_here', '55284724d85c58a4ea35590d10d04df4'),
    ('soma-fight-club-canggu', 'why_its_here', 'db6ac060cf3d6c364d11449751fbfa6c'),
    ('tonic-day-spa-botanicals-canggu', 'why_its_here', 'c6a0c4b8d9aa31b3b18cdb45f1931ce0'),
    ('dala-spa-at-alaya-resort-ubud', 'why_its_here', 'e68ba00a6ff47fdd00fae2e743ef7716'),
    ('jaens-spa-ubud-ubud', 'why_its_here', '04750e3a71b63793e061cd4c8e382d8b'),
    ('jaens-spa-ubud-ubud', 'best_for', '899fc96547bcef7eeb552d5085c654f5'),
    ('svaha-spa-bisma-ubud', 'why_its_here', '58ff1df6fd8e38c54751d430321210a5'),
    ('svaha-spa-bisma-ubud', 'best_for', 'fc083d5b6f4cf7c93cd58e1370658815'),
    ('svaha-spa-beauty-ubud-ubud', 'best_for', '2ba5be0c831c1b013f932410435f84a8'),
    ('dorsey-s-barber-shop-uluwatu', 'why_its_here', '0c0fd58a703ea37c3b96ef7fea5bd004'),
    ('dorsey-s-barber-shop-uluwatu', 'best_for', '7a54973cb7906cacc76bad95900dc225'),
    ('nasi-bali-men-weti', 'why_its_here', '3f5ef1b401a68ae0d306d4797f9d0fa2'),
    ('warung-mak-beng', 'best_for', 'bc497525ab2aeb54fa20c1174ea77754'),
    ('jimbaran-warrior', 'why_its_here', '3ccf4baa755474039c1b56daa48ba4f5'),
    ('the-practice-bali-canggu', 'why_its_here', 'da960a6502021cab85110597ce8e9edc'),
    ('toko-kopi-tuku', 'why_its_here', 'a75a5dccb01274b9e55239e3709f536c')
  ) as d(slug, field, want)
  left join venues v on v.slug = d.slug
  where v.slug is null or case d.field when 'why_its_here' then md5(v.why_its_here) when 'best_for' then md5(v.best_for) when 'not_for' then md5(v.not_for) when 'price_anchor' then md5(v.price_anchor) when 'what_to_order' then md5(v.what_to_order) end is distinct from d.want;
  if n <> 0 then raise exception 'check: % field(s) differ from the intended text', n; end if;
  raise exception 'DRY RUN OK: % statement(s) applied and checked, rolled back', 27;
end $apply$;
