-- copy-pilot-2026-10-06 — venue copy (why_its_here, best_for, not_for, price_anchor, what_to_order): apply file for the session WITH production database access.
-- Generated 2026-10-06 by scripts/copy/build-copy-sql.mjs. NOT executed by the tool that wrote it (no DB access).
-- Inputs: changes=data/data-ops/copy/pilot/change-list.csv · export=data/data-ops/copy/2026-10-06/venues-export.json
-- Counts: 29 statement(s) (29 replace, 0 null) · 0 held (holds.csv) · 5 not applied (decision <> ДА)
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
select d.slug from (values ('milk-and-madu-beach-road'), ('atlas-beach-club'), ('nook-umalas'), ('ji-restaurant-bali'), ('sensorium-bali'), ('fair-warung-bale'), ('warung-mendez'), ('wulan-vegetarian-warung'), ('bali-buda-ubud'), ('kilig-bali')) as d(slug)
left join venues v on v.slug = d.slug where v.slug is null;

-- 0b. Current values of every column this file writes (expect 10 rows; compare with the `before` guards)
select slug, status, publication_status, why_its_here, best_for, not_for
from venues where slug in ('milk-and-madu-beach-road', 'atlas-beach-club', 'nook-umalas', 'ji-restaurant-bali', 'sensorium-bali', 'fair-warung-bale', 'warung-mendez', 'wulan-vegetarian-warung', 'bali-buda-ubud', 'kilig-bali')
order by slug;

-- ===================== 1. DRY-RUN (one statement, rolled back) =====================
begin;
update venues set why_its_here = 'An all-day cafe on Batu Bolong beach road, part of the Milk & Madu group. The room is spacious and shaded by palms, with a kids'' play area, and the kitchen does brunch classics and lava-stone pizzas.' where slug = 'milk-and-madu-beach-road' and status = 'active' and publication_status = 'published' and why_its_here = 'A spacious, palm-shaded all-day cafe on Batu Bolong beach road with a kids'' play area, brunch classics and lava-stone pizzas, part of the well-known Milk & Madu group.';
-- expect: UPDATE 1
rollback;

-- ===================== 2. APPLY — 29 statement(s), one DO block =====================

do $apply$
declare n int;
begin
  -- 1. P-milk-and-madu-beach-road · milk-and-madu-beach-road · why_its_here · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set why_its_here = 'An all-day cafe on Batu Bolong beach road, part of the Milk & Madu group. The room is spacious and shaded by palms, with a kids'' play area, and the kitchen does brunch classics and lava-stone pizzas.' where slug = 'milk-and-madu-beach-road' and status = 'active' and publication_status = 'published' and why_its_here = 'A spacious, palm-shaded all-day cafe on Batu Bolong beach road with a kids'' play area, brunch classics and lava-stone pizzas, part of the well-known Milk & Madu group.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #1 (milk-and-madu-beach-road · why_its_here): expected 1 row, got %', n; end if;

  -- 2. P-milk-and-madu-beach-road · milk-and-madu-beach-road · best_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set best_for = 'Families with young children and groups, from brunch to an early dinner or the daily sunset session' where slug = 'milk-and-madu-beach-road' and status = 'active' and publication_status = 'published' and best_for = 'Families with young children and groups; brunch through to an easy early dinner, plus daily sunset sessions.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #2 (milk-and-madu-beach-road · best_for): expected 1 row, got %', n; end if;

  -- 3. P-milk-and-madu-beach-road · milk-and-madu-beach-road · not_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set not_for = 'Couples after a quiet, intimate dinner' where slug = 'milk-and-madu-beach-road' and status = 'active' and publication_status = 'published' and not_for = 'Couples seeking an intimate, quiet dining atmosphere.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #3 (milk-and-madu-beach-road · not_for): expected 1 row, got %', n; end if;

  -- 4. P-atlas-beach-club · atlas-beach-club · why_its_here · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set why_its_here = 'A large beachfront complex on Jl. Pantai Berawa. It runs four venues on one site: a beach club, the Super Club, a wellness club and a padel club. Its own website calls it the world''s biggest beach club; we have not checked that. You enter on a day pass, and daybeds and sofas are booked separately.' where slug = 'atlas-beach-club' and status = 'active' and publication_status = 'published' and why_its_here = 'A large beachfront entertainment complex on Jl. Pantai Berawa running four venues on one site: Beach Club, Super Club, Wellness Club and a padel club. Its own site markets it as the world''s biggest beach club; we have not verified that claim. Entry is by day pass, with daybeds and sofas bookable separately.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #4 (atlas-beach-club · why_its_here): expected 1 row, got %', n; end if;

  -- 5. P-atlas-beach-club · atlas-beach-club · best_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set best_for = 'A big, lively day out with a group, or sunset drinks in a party crowd' where slug = 'atlas-beach-club' and status = 'active' and publication_status = 'published' and best_for = 'A big lively day out or event with a group; sunset drinks in a large party setting';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #5 (atlas-beach-club · best_for): expected 1 row, got %', n; end if;

  -- 6. P-atlas-beach-club · atlas-beach-club · not_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set not_for = 'A small, quiet or intimate evening' where slug = 'atlas-beach-club' and status = 'active' and publication_status = 'published' and not_for = 'Guests wanting a small, quiet or intimate venue';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #6 (atlas-beach-club · not_for): expected 1 row, got %', n; end if;

  -- 7. P-nook-umalas · nook-umalas · why_its_here · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set why_its_here = 'An open-air café and restaurant beside the Umalas rice fields, open 8am to 11pm. The menu runs Western and Indonesian all day, from breakfast to late, with vegetarian, vegan and gluten-free dishes. Seminyak and its bustle are a short hop away.' where slug = 'nook-umalas' and status = 'active' and publication_status = 'published' and why_its_here = 'Long-running open-air café/restaurant set beside Umalas rice fields, serving all-day Western and Indonesian food from breakfast to late (8am–11pm). Known as a calm rice-paddy escape a short hop from Seminyak''s bustle.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #7 (nook-umalas · why_its_here): expected 1 row, got %', n; end if;

  -- 8. P-nook-umalas · nook-umalas · best_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set best_for = 'A calm breakfast or brunch looking at rice fields, for couples or a group staying off the strip' where slug = 'nook-umalas' and status = 'active' and publication_status = 'published' and best_for = 'relaxed rice-field brunch or breakfast; couples/groups wanting a calm all-day meal off the strip; vegetarian/vegan and gluten-free diners';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #8 (nook-umalas · best_for): expected 1 row, got %', n; end if;

  -- 9. P-nook-umalas · nook-umalas · not_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set not_for = 'Polished fine dining, a beachfront setting or a night out' where slug = 'nook-umalas' and status = 'active' and publication_status = 'published' and not_for = 'anyone wanting a polished fine-dining or beachfront setting; nightlife seekers';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #9 (nook-umalas · not_for): expected 1 row, got %', n; end if;

  -- 10. P-ji-restaurant-bali · ji-restaurant-bali · why_its_here · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set why_its_here = 'Japanese-contemporary dining at Hotel Tugu, right on Batu Bolong beach. The room is a reconstructed antique temple, and the terrace looks straight at the ocean. Sushi, Asian-fusion plates and cocktails.' where slug = 'ji-restaurant-bali' and status = 'active' and publication_status = 'published' and why_its_here = 'Japanese-contemporary dining set in a reconstructed antique temple at Hotel Tugu, right on Batu Bolong beach, with a terrace and sweeping ocean views. Sushi, Asian-fusion plates and cocktails in one of Canggu''s most atmospheric settings.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #10 (ji-restaurant-bali · why_its_here): expected 1 row, got %', n; end if;

  -- 11. P-ji-restaurant-bali · ji-restaurant-bali · best_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set best_for = 'A sunset dinner with a view, a date, or a special occasion by the sea' where slug = 'ji-restaurant-bali' and status = 'active' and publication_status = 'published' and best_for = 'Sunset dinner with a view; date night; a special occasion by the sea.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #11 (ji-restaurant-bali · best_for): expected 1 row, got %', n; end if;

  -- 12. P-sensorium-bali · sensorium-bali · why_its_here · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set why_its_here = 'A daytime cafe on Jl. Pantai Batu Mejan run by a chef trained in Australian fine dining. The food is Australian cafe cooking with Japanese flavours, and the room is minimalist.' where slug = 'sensorium-bali' and status = 'active' and publication_status = 'published' and why_its_here = 'A daytime fusion cafe on Jl. Pantai Batu Mejan blending Australian cafe culture with Japanese-influenced flavours and minimalist design, from a chef with Australian fine-dining training.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #12 (sensorium-bali · why_its_here): expected 1 row, got %', n; end if;

  -- 13. P-sensorium-bali · sensorium-bali · best_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set best_for = 'Brunch or lunch in a calm, design-led room, or a daytime stop with a laptop' where slug = 'sensorium-bali' and status = 'active' and publication_status = 'published' and best_for = 'A brunch or lunch of fusion cafe dishes in a calm, design-led room; a laptop-friendly daytime stop.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #13 (sensorium-bali · best_for): expected 1 row, got %', n; end if;

  -- 14. P-sensorium-bali · sensorium-bali · not_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set not_for = 'Dinner or late-night plans — it keeps daytime hours only' where slug = 'sensorium-bali' and status = 'active' and publication_status = 'published' and not_for = 'Dinner or late-night dining (it runs daytime hours only).';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #14 (sensorium-bali · not_for): expected 1 row, got %', n; end if;

  -- 15. P-fair-warung-bale · fair-warung-bale · why_its_here · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set why_its_here = 'A ten-table warung on Jalan Sriwedari in Taman Kaja, run by the Fair Future Foundation and Bali Sari Foundation. What you pay here funds free medical consultations for local people. The menu is Indonesian, Asian-fusion and vegetarian, every day.' where slug = 'fair-warung-bale' and status = 'active' and publication_status = 'published' and why_its_here = 'A social-enterprise warung on Jalan Sriwedari (Taman Kaja) run by the Fair Future Foundation/Bali Sari Foundation, where restaurant proceeds fund free medical consultations for the local community; serves Indonesian, Asian-fusion and vegetarian dishes daily.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #15 (fair-warung-bale · why_its_here): expected 1 row, got %', n; end if;

  -- 16. P-fair-warung-bale · fair-warung-bale · best_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set best_for = 'A casual lunch or early dinner that also funds free medical consultations locally' where slug = 'fair-warung-bale' and status = 'active' and publication_status = 'published' and best_for = 'Travellers wanting an easy, good-value Indonesian meal that also funds a local healthcare program; casual lunch or early dinner.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #16 (fair-warung-bale · best_for): expected 1 row, got %', n; end if;

  -- 17. P-fair-warung-bale · fair-warung-bale · not_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set not_for = 'Upscale dining or a sunset view. It is a simple ten-table warung' where slug = 'fair-warung-bale' and status = 'active' and publication_status = 'published' and not_for = 'Diners seeking upscale fine dining or a view/sunset setting (a simple, ten-table warung).';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #17 (fair-warung-bale · not_for): expected 1 row, got %', n; end if;

  -- 18. P-warung-mendez · warung-mendez · why_its_here · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set why_its_here = 'A small warung in Penestanan village, northwest of central Ubud, with an all-women kitchen team. The cooking is Indonesian and Javanese, made without MSG and with little plastic.' where slug = 'warung-mendez' and status = 'active' and publication_status = 'published' and why_its_here = 'A small warung tucked in Penestanan village northwest of central Ubud, run by an all-women kitchen team, serving Indonesian and Javanese-influenced dishes with an MSG-free, low-plastic ethos.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #18 (warung-mendez · why_its_here): expected 1 row, got %', n; end if;

  -- 19. P-warung-mendez · warung-mendez · best_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set best_for = 'A quiet, home-style Indonesian meal away from the main Ubud strip' where slug = 'warung-mendez' and status = 'active' and publication_status = 'published' and best_for = 'travelers wanting a quiet, home-style Indonesian meal off the main Ubud strip in Penestanan';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #19 (warung-mendez · best_for): expected 1 row, got %', n; end if;

  -- 20. P-warung-mendez · warung-mendez · not_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set not_for = 'A quick stop in the centre of town; Penestanan takes finding' where slug = 'warung-mendez' and status = 'active' and publication_status = 'published' and not_for = 'those wanting a central, easy-to-find location right in town';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #20 (warung-mendez · not_for): expected 1 row, got %', n; end if;

  -- 21. P-wulan-vegetarian-warung · wulan-vegetarian-warung · why_its_here · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set why_its_here = 'A small all-vegan warung in Peliatan, Ubud, with floor-cushion seating and cash only. The menu is Indonesian: nasi goreng, tempeh, smoothies and vegan sweets, at very low prices.' where slug = 'wulan-vegetarian-warung' and status = 'active' and publication_status = 'published' and why_its_here = 'A small, hole-in-the-wall all-vegan warung in the Peliatan area of Ubud, cash-only, serving an Indonesian menu of nasi goreng, tempeh, smoothies, and vegan sweets at very low prices.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #21 (wulan-vegetarian-warung · why_its_here): expected 1 row, got %', n; end if;

  -- 22. P-wulan-vegetarian-warung · wulan-vegetarian-warung · best_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set best_for = 'Vegan or vegetarian travellers on a budget who want simple Indonesian food' where slug = 'wulan-vegetarian-warung' and status = 'active' and publication_status = 'published' and best_for = 'budget-conscious vegan and vegetarian travelers wanting simple, authentic Indonesian dishes';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #22 (wulan-vegetarian-warung · best_for): expected 1 row, got %', n; end if;

  -- 23. P-wulan-vegetarian-warung · wulan-vegetarian-warung · not_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set not_for = 'Card payments or a table and chairs: it is cash only, with floor cushions' where slug = 'wulan-vegetarian-warung' and status = 'active' and publication_status = 'published' and not_for = 'diners wanting to pay by card or a polished sit-down setting — it''s cash-only, floor-cushion seating';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #23 (wulan-vegetarian-warung · not_for): expected 1 row, got %', n; end if;

  -- 24. P-bali-buda-ubud · bali-buda-ubud · why_its_here · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set why_its_here = 'An organic grocery and bakery with an all-day restaurant attached, in Ubud since 1994. The kitchen covers raw vegan, Italian and traditional Indonesian dishes.' where slug = 'bali-buda-ubud' and status = 'active' and publication_status = 'published' and why_its_here = 'Long-running Bali wholefoods institution (operating in Ubud since 1994) combining an organic grocery/bakery with an all-day restaurant covering raw vegan, Italian, and traditional Indonesian dishes.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #24 (bali-buda-ubud · why_its_here): expected 1 row, got %', n; end if;

  -- 25. P-bali-buda-ubud · bali-buda-ubud · best_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set best_for = 'A long stay or a mixed group that needs one big menu with vegetarian, vegan and gluten-free choices' where slug = 'bali-buda-ubud' and status = 'active' and publication_status = 'published' and best_for = 'Health-conscious travelers, longer-stay visitors, and mixed groups wanting a big menu with vegetarian, vegan, and gluten-free options (including Bali''s only gluten-free pizza base) in one place.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #25 (bali-buda-ubud · best_for): expected 1 row, got %', n; end if;

  -- 26. P-bali-buda-ubud · bali-buda-ubud · not_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set not_for = 'A special occasion or an intimate dinner, because it is a casual health-food restaurant and shop' where slug = 'bali-buda-ubud' and status = 'active' and publication_status = 'published' and not_for = 'Travelers seeking an intimate fine-dining or special-occasion setting — it''s a casual, functional health-food restaurant and shop.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #26 (bali-buda-ubud · not_for): expected 1 row, got %', n; end if;

  -- 27. P-kilig-bali · kilig-bali · why_its_here · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set why_its_here = 'A Filipino warung in Peliatan, in a bamboo hut looking over rice fields. The cooking is home-style Filipino comfort food, in an area where the menus are otherwise Balinese and Western.' where slug = 'kilig-bali' and status = 'active' and publication_status = 'published' and why_its_here = 'A Filipino warung in Peliatan set in a bamboo hut with rice-field views, cooking home-style Filipino comfort food. It stands out as a dedicated Filipino kitchen in an area dominated by Balinese and Western menus.';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #27 (kilig-bali · why_its_here): expected 1 row, got %', n; end if;

  -- 28. P-kilig-bali · kilig-bali · best_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set best_for = 'Filipino comfort food at a shared table, or a calm family dinner looking over rice fields' where slug = 'kilig-bali' and status = 'active' and publication_status = 'published' and best_for = 'filipino comfort food; calm rice-field setting; shared table meals; family dinner';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #28 (kilig-bali · best_for): expected 1 row, got %', n; end if;

  -- 29. P-kilig-bali · kilig-bali · not_for · replace · source pilot v3: style rewrite of the record's own text (rung 2); facts not re-verified
  update venues set not_for = 'A quick stop from central Ubud, or anyone avoiding rich, pork-heavy dishes' where slug = 'kilig-bali' and status = 'active' and publication_status = 'published' and not_for = 'a quick central-Ubud stop given the Peliatan location; anyone avoiding rich, pork-forward dishes';
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'copy-pilot-2026-10-06 #29 (kilig-bali · not_for): expected 1 row, got %', n; end if;
end $apply$;

-- ===================== 3. VERIFY (expect 10 rows) =====================
select slug, why_its_here, best_for, not_for
from venues where slug in ('milk-and-madu-beach-road', 'atlas-beach-club', 'nook-umalas', 'ji-restaurant-bali', 'sensorium-bali', 'fair-warung-bale', 'warung-mendez', 'wulan-vegetarian-warung', 'bali-buda-ubud', 'kilig-bali')
order by slug;

-- Not applied (surface = db, decision <> ДА):
--   P-hold-air-cafe-and-lounge-at-the-sebali-resort · air-cafe-and-lounge-at-the-sebali-resort · why_its_here · decision=HOLD · The only facts are a street and hours; both already show elsewhere on the card. Any 'warmer' sentence would be invented. Waits for the evidence batch (stage-b-queue) before it gets prose.
--   P-hold-alma-spa-canggu · alma-spa-canggu · why_its_here · decision=HOLD · The spa formula: a count, three menu names, a booking channel, and a best_for shared with 70 other cards. Rewriting it 'by hand' would still produce the same thin sentence, because there is nothing else in the record. Evidence first.
--   P-control-artisan-pererenan · artisan-pererenan · why_its_here · decision=NO CHANGE · no change — three plain facts, named dishes, no tells
--   P-control-at06 · at06 · why_its_here · decision=NO CHANGE · no change — dated fact, concrete amenities
--   P-control-bali-climbing-bouldering-gym · bali-climbing-bouldering-gym · why_its_here · decision=NO CHANGE · no change — the best_for is a real moment, the facts are checkable

-- Held (see holds.csv):
--   (none)
