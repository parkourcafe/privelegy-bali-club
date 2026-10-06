-- copy-stage1-2026-10-06 — venue copy (why_its_here, best_for, not_for, price_anchor, what_to_order): apply file for the session WITH production database access.
-- Generated 2026-10-06 by scripts/copy/build-copy-sql.mjs. NOT executed by the tool that wrote it (no DB access).
-- Inputs: changes=data/data-ops/copy/stage1/change-list.csv · export=data/data-ops/copy/2026-10-06/venues-export.json
-- Counts: 27 statement(s) (19 replace, 8 null) · 0 held (holds.csv) · 0 not applied (decision <> ДА)
-- Only the five copy columns above are written. Publication state and verification timestamps are not touched.
--
-- Order (otherbali-supabase-write):
--   0. Preflight (read-only): 0a every slug exists (expect 0 rows); 0b current values of the touched columns
--      for all slugs — compare with the `before` guard of every statement; a difference means the export is stale.
--   1. Dry-run: run section 1, ONE statement inside begin … rollback — expect UPDATE 1.
--   2. Run section 2, a single DO block: every statement asserts it touched exactly 1 row, and any
--      mismatch raises and rolls the whole block back.
--   3. Run the verify SELECT (section 3); then check the live pages with verify-live.txt.
--   To undo: rollback-2026-10-06.sql restores every `before`.

-- ===================== 0. PREFLIGHT (read-only) =====================

-- 0a. Every slug exists (expect 0 rows)
select d.slug from (values ('loloan-coastal-peruvian-raffles-bali'), ('merah-putih'), ('dining-corner-kayumanis-ubud'), ('pasar-senggol-at-grand-hyatt-bali'), ('hedonist-space-restaurant-lounge-bar'), ('sarong'), ('cafe-vida-healthy-organic-restaurant-canggu'), ('babi-guling-men-agus'), ('babi-guling-men-lari'), ('lopodo-catering-and-events'), ('soma-fight-club-canggu'), ('tonic-day-spa-botanicals-canggu'), ('dala-spa-at-alaya-resort-ubud'), ('jaens-spa-ubud-ubud'), ('svaha-spa-bisma-ubud'), ('svaha-spa-beauty-ubud-ubud'), ('dorsey-s-barber-shop-uluwatu'), ('nasi-bali-men-weti'), ('warung-mak-beng'), ('jimbaran-warrior'), ('the-practice-bali-canggu'), ('toko-kopi-tuku')) as d(slug)
left join venues v on v.slug = d.slug where v.slug is null;

-- 0b. Current values of every column this file writes (expect 22 rows; compare with the `before` guards)
select slug, status, publication_status, why_its_here, best_for, not_for
from venues where slug in ('loloan-coastal-peruvian-raffles-bali', 'merah-putih', 'dining-corner-kayumanis-ubud', 'pasar-senggol-at-grand-hyatt-bali', 'hedonist-space-restaurant-lounge-bar', 'sarong', 'cafe-vida-healthy-organic-restaurant-canggu', 'babi-guling-men-agus', 'babi-guling-men-lari', 'lopodo-catering-and-events', 'soma-fight-club-canggu', 'tonic-day-spa-botanicals-canggu', 'dala-spa-at-alaya-resort-ubud', 'jaens-spa-ubud-ubud', 'svaha-spa-bisma-ubud', 'svaha-spa-beauty-ubud-ubud', 'dorsey-s-barber-shop-uluwatu', 'nasi-bali-men-weti', 'warung-mak-beng', 'jimbaran-warrior', 'the-practice-bali-canggu', 'toko-kopi-tuku')
order by slug;

-- ===================== 1. DRY-RUN (one statement, rolled back) =====================
begin;
update venues set why_its_here = null where slug = 'loloan-coastal-peruvian-raffles-bali' and status = 'active' and publication_status = 'published' and why_its_here = 'A verified Bali restaurant listing with table reservations handled externally by Chope.';
-- expect: UPDATE 1
rollback;

-- ===================== 2. APPLY — 27 statement(s), one DO block =====================

do $apply$
declare n int;
begin
  -- 1. S1-010 · loloan-coastal-peruvian-raffles-bali · why_its_here · null · source аудит G5/S1
  update venues set why_its_here = null where slug = 'loloan-coastal-peruvian-raffles-bali' and status = 'active' and publication_status = 'published' and why_its_here = 'A verified Bali restaurant listing with table reservations handled externally by Chope.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #1 (loloan-coastal-peruvian-raffles-bali · why_its_here): expected 1 row, got %', n; end if;

  -- 2. S1-011 · merah-putih · why_its_here · null · source аудит G5/S1
  update venues set why_its_here = null where slug = 'merah-putih' and status = 'active' and publication_status = 'published' and why_its_here = 'A verified Bali restaurant listing with table reservations handled externally by Chope.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #2 (merah-putih · why_its_here): expected 1 row, got %', n; end if;

  -- 3. S1-012 · dining-corner-kayumanis-ubud · why_its_here · null · source аудит G5/S1
  update venues set why_its_here = null where slug = 'dining-corner-kayumanis-ubud' and status = 'active' and publication_status = 'published' and why_its_here = 'A verified Bali restaurant listing with table reservations handled externally by Chope.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #3 (dining-corner-kayumanis-ubud · why_its_here): expected 1 row, got %', n; end if;

  -- 4. S1-013 · pasar-senggol-at-grand-hyatt-bali · why_its_here · null · source аудит G5/S1
  update venues set why_its_here = null where slug = 'pasar-senggol-at-grand-hyatt-bali' and status = 'active' and publication_status = 'published' and why_its_here = 'Pasar Senggol at Grand Hyatt Bali is a verified dining venue in Nusa Dua.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #4 (pasar-senggol-at-grand-hyatt-bali · why_its_here): expected 1 row, got %', n; end if;

  -- 5. S1-014 · hedonist-space-restaurant-lounge-bar · why_its_here · null · source аудит G5/S1
  update venues set why_its_here = null where slug = 'hedonist-space-restaurant-lounge-bar' and status = 'active' and publication_status = 'published' and why_its_here = 'HEDONIST SPACE restaurant | lounge | bar is a verified dining venue in Uluwatu.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #5 (hedonist-space-restaurant-lounge-bar · why_its_here): expected 1 row, got %', n; end if;

  -- 6. S1-015 · sarong · why_its_here · null · source аудит G5/S1
  update venues set why_its_here = null where slug = 'sarong' and status = 'active' and publication_status = 'published' and why_its_here = 'Sarong is an owner-confirmed hospitality venue in Petitenget; its current detailed editorial format remains under review.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #6 (sarong · why_its_here): expected 1 row, got %', n; end if;

  -- 7. S1-016 · sarong · best_for · null · source аудит G5/S1
  update venues set best_for = null where slug = 'sarong' and status = 'active' and publication_status = 'published' and best_for = 'Travellers comparing Petitenget venues who will confirm the current format directly with the venue.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #7 (sarong · best_for): expected 1 row, got %', n; end if;

  -- 8. S1-020 · cafe-vida-healthy-organic-restaurant-canggu · why_its_here · replace · source аудит G1
  update venues set why_its_here = 'An organic restaurant on Jl. Pantai Batu Bolong 38A serving breakfast, lunch and dinner daily from 7am to 10:30pm, with vegan, vegetarian and gluten-free options.' where slug = 'cafe-vida-healthy-organic-restaurant-canggu' and status = 'active' and publication_status = 'published' and why_its_here = 'An organic restaurant on Jl. Pantai Batu Bolong 38A serving breakfast, lunch and dinner daily from 7am to 10:30pm, with vegan, vegetarian and gluten-free options. Its Tripadvisor profile describes a premium organic restaurant built on locally sourced ingredients. That listing now runs under the name Vida Organic Restaurant.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #8 (cafe-vida-healthy-organic-restaurant-canggu · why_its_here): expected 1 row, got %', n; end if;

  -- 9. S1-021 · babi-guling-men-agus · why_its_here · replace · source аудит G1
  update venues set why_its_here = 'A roadside babi guling warung on Jl. Raya Canggu. Babi guling is Balinese spit-roast pork, normally served over rice with sides.' where slug = 'babi-guling-men-agus' and status = 'active' and publication_status = 'published' and why_its_here = 'A roadside babi guling warung on Jl. Raya Canggu. Babi guling is Balinese spit-roast pork, normally served over rice with sides. Its Tripadvisor listing shows an inexpensive price band and hours of 8am to 8pm daily.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #9 (babi-guling-men-agus · why_its_here): expected 1 row, got %', n; end if;

  -- 10. S1-022 · babi-guling-men-agus · not_for · null · source аудит G1 (вывод)
  update venues set not_for = null where slug = 'babi-guling-men-agus' and status = 'active' and publication_status = 'published' and not_for = 'Closes 8pm; no late-night service';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #10 (babi-guling-men-agus · not_for): expected 1 row, got %', n; end if;

  -- 11. S1-023 · babi-guling-men-lari · why_its_here · replace · source аудит G1
  update venues set why_its_here = 'A babi guling warung in the Canggu area, operating as a branch of Men Lari in Mengwi. Babi guling is Balinese spit-roast pork, usually served over rice with sides.' where slug = 'babi-guling-men-lari' and status = 'active' and publication_status = 'published' and why_its_here = 'A babi guling warung in the Canggu area, operating as a branch of Men Lari in Mengwi. Babi guling is Balinese spit-roast pork, usually served over rice with sides. The Mengwi original carries an inexpensive price band on Tripadvisor; the Canggu branch has no listing of its own.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #11 (babi-guling-men-lari · why_its_here): expected 1 row, got %', n; end if;

  -- 12. S1-024 · lopodo-catering-and-events · why_its_here · replace · source аудит G1
  update venues set why_its_here = 'Lopodo is a Halal-certified catering and event company on Jl. Raya Canggu, cooking Indonesian, Balinese, Javanese, Asian and Western menus for villas, weddings, corporate events and private-chef bookings, with its own event space in Canggu.' where slug = 'lopodo-catering-and-events' and status = 'active' and publication_status = 'published' and why_its_here = 'Lopodo is a Halal-certified catering and event company on Jl. Raya Canggu, cooking Indonesian, Balinese, Javanese, Asian and Western menus for villas, weddings, corporate events and private-chef bookings, with its own event space in Canggu. Note that its Tripadvisor listing is filed as a restaurant with dine-in reviews — the two accounts of this business do not agree.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #12 (lopodo-catering-and-events · why_its_here): expected 1 row, got %', n; end if;

  -- 13. S1-025 · soma-fight-club-canggu · why_its_here · replace · source аудит G1
  update venues set why_its_here = 'A Canggu combat-sports and functional-fitness club with striking, grappling and conditioning classes.' where slug = 'soma-fight-club-canggu' and status = 'active' and publication_status = 'published' and why_its_here = 'A well-regarded Canggu combat-sports and functional-fitness club offering striking, grappling and conditioning classes.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #13 (soma-fight-club-canggu · why_its_here): expected 1 row, got %', n; end if;

  -- 14. S1-026 · tonic-day-spa-botanicals-canggu · why_its_here · replace · source аудит G1
  update venues set why_its_here = 'A Berawa day spa with a botanicals-led treatment menu, from massage to facials.' where slug = 'tonic-day-spa-botanicals-canggu' and status = 'active' and publication_status = 'published' and why_its_here = 'A highly rated Berawa day spa with a botanicals-led treatment menu, from massage to facials, in a serene setting.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #14 (tonic-day-spa-botanicals-canggu · why_its_here): expected 1 row, got %', n; end if;

  -- 15. S1-027 · dala-spa-at-alaya-resort-ubud · why_its_here · replace · source аудит G1
  update venues set why_its_here = 'The DaLa Spa at Alaya Resort Ubud in Pengosekan, a resort spa open daily until late.' where slug = 'dala-spa-at-alaya-resort-ubud' and status = 'active' and publication_status = 'published' and why_its_here = 'The DaLa Spa at Alaya Resort Ubud in Pengosekan, a well-regarded resort spa open daily until late.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #15 (dala-spa-at-alaya-resort-ubud · why_its_here): expected 1 row, got %', n; end if;

  -- 16. S1-028 · jaens-spa-ubud-ubud · why_its_here · replace · source аудит G1
  update venues set why_its_here = 'An Ubud day spa with Balinese massage and packages from around 295k.' where slug = 'jaens-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here = 'A highly rated Ubud day spa offering great-value Balinese massage and packages from around 295k, a long-standing local favourite.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #16 (jaens-spa-ubud-ubud · why_its_here): expected 1 row, got %', n; end if;

  -- 17. S1-029 · jaens-spa-ubud-ubud · best_for · replace · source аудит G1 (перепроверка)
  update venues set best_for = 'A massage without resort prices' where slug = 'jaens-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for = 'Value-seekers who want an excellent-rated massage without resort prices.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #17 (jaens-spa-ubud-ubud · best_for): expected 1 row, got %', n; end if;

  -- 18. S1-030 · svaha-spa-bisma-ubud · why_its_here · replace · source аудит G1
  update venues set why_its_here = 'The Bisma branch of Svaha Spa near Ubud centre, a day spa for massage and treatments.' where slug = 'svaha-spa-bisma-ubud' and status = 'active' and publication_status = 'published' and why_its_here = 'The Bisma branch of Svaha Spa near Ubud centre, a highly rated day spa for massage and treatments.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #18 (svaha-spa-bisma-ubud · why_its_here): expected 1 row, got %', n; end if;

  -- 19. S1-031 · svaha-spa-bisma-ubud · best_for · replace · source аудит G1 (перепроверка)
  update venues set best_for = 'An easy-to-reach massage near Ubud centre' where slug = 'svaha-spa-bisma-ubud' and status = 'active' and publication_status = 'published' and best_for = 'Central-Ubud visitors wanting a top-rated, easy-to-reach massage.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #19 (svaha-spa-bisma-ubud · best_for): expected 1 row, got %', n; end if;

  -- 20. S1-032 · svaha-spa-beauty-ubud-ubud · best_for · replace · source аудит G1 (перепроверка)
  update venues set best_for = 'Nails, waxing or a facial near the Bisma cafés' where slug = 'svaha-spa-beauty-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for = 'Central-Ubud visitors wanting well-rated beauty near the Bisma cafés.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #20 (svaha-spa-beauty-ubud-ubud · best_for): expected 1 row, got %', n; end if;

  -- 21. S1-033 · dorsey-s-barber-shop-uluwatu · why_its_here · replace · source аудит G1
  update venues set why_its_here = 'A barbershop inside Habitat Village on Jl. Labuansait: haircuts, fades, shaves and beard trims.' where slug = 'dorsey-s-barber-shop-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here = 'A barbershop inside Habitat Village on Jl. Labuansait, offering haircuts, fades, shaves and beard trims in a clean, styled interior; reviewers note skilled barbers and a slightly premium price point for the area.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #21 (dorsey-s-barber-shop-uluwatu · why_its_here): expected 1 row, got %', n; end if;

  -- 22. S1-034 · dorsey-s-barber-shop-uluwatu · best_for · replace · source аудит G1 (вывод)
  update venues set best_for = 'A cut or hot-towel shave in central Uluwatu' where slug = 'dorsey-s-barber-shop-uluwatu' and status = 'active' and publication_status = 'published' and best_for = 'Men who want a polished cut or hot-towel shave in central Uluwatu and don''t mind paying a little more.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #22 (dorsey-s-barber-shop-uluwatu · best_for): expected 1 row, got %', n; end if;

  -- 23. S1-050 · nasi-bali-men-weti · why_its_here · replace · source copy-lint R2 (вне аудита G1)
  update venues set why_its_here = 'A Balinese nasi campur breakfast stall running since the 1970s, near the Sindhu beach access. Opens early and closes when the food runs out, usually by early afternoon.' where slug = 'nasi-bali-men-weti' and status = 'active' and publication_status = 'published' and why_its_here = 'A legendary Balinese nasi campur breakfast stall running since the 1970s, near the Sindhu beach access. Opens early and closes when the food runs out, usually by early afternoon.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #23 (nasi-bali-men-weti · why_its_here): expected 1 row, got %', n; end if;

  -- 24. S1-051 · warung-mak-beng · best_for · replace · source copy-lint R2 (вне аудита G1)
  update venues set best_for = 'a fast one-plate seafood lunch; solo diners and quick stops; travellers who want the set meal with no menu decisions' where slug = 'warung-mak-beng' and status = 'active' and publication_status = 'published' and best_for = 'a fast, famous one-plate seafood lunch; solo diners and quick stops; travellers who want the legendary set meal with no menu decisions';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #24 (warung-mak-beng · best_for): expected 1 row, got %', n; end if;

  -- 25. S1-052 · jimbaran-warrior · why_its_here · replace · source copy-lint R2 (вне аудита G1)
  update venues set why_its_here = 'A no-frills strength-and-conditioning gym in Jimbaran, with equipment for functional training.' where slug = 'jimbaran-warrior' and status = 'active' and publication_status = 'published' and why_its_here = 'A no-frills strength-and-conditioning gym in Jimbaran, popular with locals and long-stayers for its equipment and functional training.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #25 (jimbaran-warrior · why_its_here): expected 1 row, got %', n; end if;

  -- 26. S1-053 · the-practice-bali-canggu · why_its_here · replace · source copy-lint R2 (вне аудита G1)
  update venues set why_its_here = 'A Batu Bolong yoga studio with breath-led, alignment-focused classes in an upstairs shala (8am–9pm).' where slug = 'the-practice-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here = 'A beloved Batu Bolong yoga studio known for breath-led, alignment-focused classes in a warm upstairs shala (8am–9pm).';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #26 (the-practice-bali-canggu · why_its_here): expected 1 row, got %', n; end if;

  -- 27. S1-054 · toko-kopi-tuku · why_its_here · replace · source copy-lint R2 (вне аудита G1)
  update venues set why_its_here = 'A Jakarta neighbourhood coffee brand, here in its first Bali store, built around the Es Kopi Susu Tetangga, a palm-sugar milk coffee. The Renon outlet keeps the everyday, grab-and-go format on a quiet government-district street rather than the tourist strip.' where slug = 'toko-kopi-tuku' and status = 'active' and publication_status = 'published' and why_its_here = 'Jakarta''s cult neighbourhood coffee brand, here in its first Bali store, built around the Es Kopi Susu Tetangga — palm-sugar milk coffee — that made Tuku famous. The Renon outlet keeps the everyday, grab-and-go format on a quiet government-district street rather than the tourist strip.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-stage1-2026-10-06 #27 (toko-kopi-tuku · why_its_here): expected 1 row, got %', n; end if;
end $apply$;

-- ===================== 3. VERIFY (expect 22 rows) =====================
select slug, why_its_here, best_for, not_for
from venues where slug in ('loloan-coastal-peruvian-raffles-bali', 'merah-putih', 'dining-corner-kayumanis-ubud', 'pasar-senggol-at-grand-hyatt-bali', 'hedonist-space-restaurant-lounge-bar', 'sarong', 'cafe-vida-healthy-organic-restaurant-canggu', 'babi-guling-men-agus', 'babi-guling-men-lari', 'lopodo-catering-and-events', 'soma-fight-club-canggu', 'tonic-day-spa-botanicals-canggu', 'dala-spa-at-alaya-resort-ubud', 'jaens-spa-ubud-ubud', 'svaha-spa-bisma-ubud', 'svaha-spa-beauty-ubud-ubud', 'dorsey-s-barber-shop-uluwatu', 'nasi-bali-men-weti', 'warung-mak-beng', 'jimbaran-warrior', 'the-practice-bali-canggu', 'toko-kopi-tuku')
order by slug;

-- Not applied (surface = db, decision <> ДА):
--   (none)

-- Held (see holds.csv):
--   (none)
