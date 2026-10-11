-- copy-stage1-2026-10-06 — rollback for apply-2026-10-06.sql: restores every `before` where the written value is still in place.
-- Generated 2026-10-06 by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;
-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.

-- 1. S1-010 · loloan-coastal-peruvian-raffles-bali · why_its_here · restore before
update venues set why_its_here = 'A verified Bali restaurant listing with table reservations handled externally by Chope.' where slug = 'loloan-coastal-peruvian-raffles-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from null;
-- expect: UPDATE 1

-- 2. S1-011 · merah-putih · why_its_here · restore before
update venues set why_its_here = 'A verified Bali restaurant listing with table reservations handled externally by Chope.' where slug = 'merah-putih' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from null;
-- expect: UPDATE 1

-- 3. S1-012 · dining-corner-kayumanis-ubud · why_its_here · restore before
update venues set why_its_here = 'A verified Bali restaurant listing with table reservations handled externally by Chope.' where slug = 'dining-corner-kayumanis-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from null;
-- expect: UPDATE 1

-- 4. S1-013 · pasar-senggol-at-grand-hyatt-bali · why_its_here · restore before
update venues set why_its_here = 'Pasar Senggol at Grand Hyatt Bali is a verified dining venue in Nusa Dua.' where slug = 'pasar-senggol-at-grand-hyatt-bali' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from null;
-- expect: UPDATE 1

-- 5. S1-014 · hedonist-space-restaurant-lounge-bar · why_its_here · restore before
update venues set why_its_here = 'HEDONIST SPACE restaurant | lounge | bar is a verified dining venue in Uluwatu.' where slug = 'hedonist-space-restaurant-lounge-bar' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from null;
-- expect: UPDATE 1

-- 6. S1-015 · sarong · why_its_here · restore before
update venues set why_its_here = 'Sarong is an owner-confirmed hospitality venue in Petitenget; its current detailed editorial format remains under review.' where slug = 'sarong' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from null;
-- expect: UPDATE 1

-- 7. S1-016 · sarong · best_for · restore before
update venues set best_for = 'Travellers comparing Petitenget venues who will confirm the current format directly with the venue.' where slug = 'sarong' and status = 'active' and publication_status = 'published' and best_for is not distinct from null;
-- expect: UPDATE 1

-- 8. S1-020 · cafe-vida-healthy-organic-restaurant-canggu · why_its_here · restore before
update venues set why_its_here = 'An organic restaurant on Jl. Pantai Batu Bolong 38A serving breakfast, lunch and dinner daily from 7am to 10:30pm, with vegan, vegetarian and gluten-free options. Its Tripadvisor profile describes a premium organic restaurant built on locally sourced ingredients. That listing now runs under the name Vida Organic Restaurant.' where slug = 'cafe-vida-healthy-organic-restaurant-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An organic restaurant on Jl. Pantai Batu Bolong 38A serving breakfast, lunch and dinner daily from 7am to 10:30pm, with vegan, vegetarian and gluten-free options.';
-- expect: UPDATE 1

-- 9. S1-021 · babi-guling-men-agus · why_its_here · restore before
update venues set why_its_here = 'A roadside babi guling warung on Jl. Raya Canggu. Babi guling is Balinese spit-roast pork, normally served over rice with sides. Its Tripadvisor listing shows an inexpensive price band and hours of 8am to 8pm daily.' where slug = 'babi-guling-men-agus' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A roadside babi guling warung on Jl. Raya Canggu. Babi guling is Balinese spit-roast pork, normally served over rice with sides.';
-- expect: UPDATE 1

-- 10. S1-022 · babi-guling-men-agus · not_for · restore before
update venues set not_for = 'Closes 8pm; no late-night service' where slug = 'babi-guling-men-agus' and status = 'active' and publication_status = 'published' and not_for is not distinct from null;
-- expect: UPDATE 1

-- 11. S1-023 · babi-guling-men-lari · why_its_here · restore before
update venues set why_its_here = 'A babi guling warung in the Canggu area, operating as a branch of Men Lari in Mengwi. Babi guling is Balinese spit-roast pork, usually served over rice with sides. The Mengwi original carries an inexpensive price band on Tripadvisor; the Canggu branch has no listing of its own.' where slug = 'babi-guling-men-lari' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A babi guling warung in the Canggu area, operating as a branch of Men Lari in Mengwi. Babi guling is Balinese spit-roast pork, usually served over rice with sides.';
-- expect: UPDATE 1

-- 12. S1-024 · lopodo-catering-and-events · why_its_here · restore before
update venues set why_its_here = 'Lopodo is a Halal-certified catering and event company on Jl. Raya Canggu, cooking Indonesian, Balinese, Javanese, Asian and Western menus for villas, weddings, corporate events and private-chef bookings, with its own event space in Canggu. Note that its Tripadvisor listing is filed as a restaurant with dine-in reviews — the two accounts of this business do not agree.' where slug = 'lopodo-catering-and-events' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'Lopodo is a Halal-certified catering and event company on Jl. Raya Canggu, cooking Indonesian, Balinese, Javanese, Asian and Western menus for villas, weddings, corporate events and private-chef bookings, with its own event space in Canggu.';
-- expect: UPDATE 1

-- 13. S1-025 · soma-fight-club-canggu · why_its_here · restore before
update venues set why_its_here = 'A well-regarded Canggu combat-sports and functional-fitness club offering striking, grappling and conditioning classes.' where slug = 'soma-fight-club-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Canggu combat-sports and functional-fitness club with striking, grappling and conditioning classes.';
-- expect: UPDATE 1

-- 14. S1-026 · tonic-day-spa-botanicals-canggu · why_its_here · restore before
update venues set why_its_here = 'A highly rated Berawa day spa with a botanicals-led treatment menu, from massage to facials, in a serene setting.' where slug = 'tonic-day-spa-botanicals-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Berawa day spa with a botanicals-led treatment menu, from massage to facials.';
-- expect: UPDATE 1

-- 15. S1-027 · dala-spa-at-alaya-resort-ubud · why_its_here · restore before
update venues set why_its_here = 'The DaLa Spa at Alaya Resort Ubud in Pengosekan, a well-regarded resort spa open daily until late.' where slug = 'dala-spa-at-alaya-resort-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The DaLa Spa at Alaya Resort Ubud in Pengosekan, a resort spa open daily until late.';
-- expect: UPDATE 1

-- 16. S1-028 · jaens-spa-ubud-ubud · why_its_here · restore before
update venues set why_its_here = 'A highly rated Ubud day spa offering great-value Balinese massage and packages from around 295k, a long-standing local favourite.' where slug = 'jaens-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'An Ubud day spa with Balinese massage and packages from around 295k.';
-- expect: UPDATE 1

-- 17. S1-029 · jaens-spa-ubud-ubud · best_for · restore before
update venues set best_for = 'Value-seekers who want an excellent-rated massage without resort prices.' where slug = 'jaens-spa-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A massage without resort prices';
-- expect: UPDATE 1

-- 18. S1-030 · svaha-spa-bisma-ubud · why_its_here · restore before
update venues set why_its_here = 'The Bisma branch of Svaha Spa near Ubud centre, a highly rated day spa for massage and treatments.' where slug = 'svaha-spa-bisma-ubud' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'The Bisma branch of Svaha Spa near Ubud centre, a day spa for massage and treatments.';
-- expect: UPDATE 1

-- 19. S1-031 · svaha-spa-bisma-ubud · best_for · restore before
update venues set best_for = 'Central-Ubud visitors wanting a top-rated, easy-to-reach massage.' where slug = 'svaha-spa-bisma-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'An easy-to-reach massage near Ubud centre';
-- expect: UPDATE 1

-- 20. S1-032 · svaha-spa-beauty-ubud-ubud · best_for · restore before
update venues set best_for = 'Central-Ubud visitors wanting well-rated beauty near the Bisma cafés.' where slug = 'svaha-spa-beauty-ubud-ubud' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'Nails, waxing or a facial near the Bisma cafés';
-- expect: UPDATE 1

-- 21. S1-033 · dorsey-s-barber-shop-uluwatu · why_its_here · restore before
update venues set why_its_here = 'A barbershop inside Habitat Village on Jl. Labuansait, offering haircuts, fades, shaves and beard trims in a clean, styled interior; reviewers note skilled barbers and a slightly premium price point for the area.' where slug = 'dorsey-s-barber-shop-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A barbershop inside Habitat Village on Jl. Labuansait: haircuts, fades, shaves and beard trims.';
-- expect: UPDATE 1

-- 22. S1-034 · dorsey-s-barber-shop-uluwatu · best_for · restore before
update venues set best_for = 'Men who want a polished cut or hot-towel shave in central Uluwatu and don''t mind paying a little more.' where slug = 'dorsey-s-barber-shop-uluwatu' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'A cut or hot-towel shave in central Uluwatu';
-- expect: UPDATE 1

-- 23. S1-050 · nasi-bali-men-weti · why_its_here · restore before
update venues set why_its_here = 'A legendary Balinese nasi campur breakfast stall running since the 1970s, near the Sindhu beach access. Opens early and closes when the food runs out, usually by early afternoon.' where slug = 'nasi-bali-men-weti' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Balinese nasi campur breakfast stall running since the 1970s, near the Sindhu beach access. Opens early and closes when the food runs out, usually by early afternoon.';
-- expect: UPDATE 1

-- 24. S1-051 · warung-mak-beng · best_for · restore before
update venues set best_for = 'a fast, famous one-plate seafood lunch; solo diners and quick stops; travellers who want the legendary set meal with no menu decisions' where slug = 'warung-mak-beng' and status = 'active' and publication_status = 'published' and best_for is not distinct from 'a fast one-plate seafood lunch; solo diners and quick stops; travellers who want the set meal with no menu decisions';
-- expect: UPDATE 1

-- 25. S1-052 · jimbaran-warrior · why_its_here · restore before
update venues set why_its_here = 'A no-frills strength-and-conditioning gym in Jimbaran, popular with locals and long-stayers for its equipment and functional training.' where slug = 'jimbaran-warrior' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A no-frills strength-and-conditioning gym in Jimbaran, with equipment for functional training.';
-- expect: UPDATE 1

-- 26. S1-053 · the-practice-bali-canggu · why_its_here · restore before
update venues set why_its_here = 'A beloved Batu Bolong yoga studio known for breath-led, alignment-focused classes in a warm upstairs shala (8am–9pm).' where slug = 'the-practice-bali-canggu' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Batu Bolong yoga studio with breath-led, alignment-focused classes in an upstairs shala (8am–9pm).';
-- expect: UPDATE 1

-- 27. S1-054 · toko-kopi-tuku · why_its_here · restore before
update venues set why_its_here = 'Jakarta''s cult neighbourhood coffee brand, here in its first Bali store, built around the Es Kopi Susu Tetangga — palm-sugar milk coffee — that made Tuku famous. The Renon outlet keeps the everyday, grab-and-go format on a quiet government-district street rather than the tourist strip.' where slug = 'toko-kopi-tuku' and status = 'active' and publication_status = 'published' and why_its_here is not distinct from 'A Jakarta neighbourhood coffee brand, here in its first Bali store, built around the Es Kopi Susu Tetangga, a palm-sugar milk coffee. The Renon outlet keeps the everyday, grab-and-go format on a quiet government-district street rather than the tourist strip.';
-- expect: UPDATE 1
