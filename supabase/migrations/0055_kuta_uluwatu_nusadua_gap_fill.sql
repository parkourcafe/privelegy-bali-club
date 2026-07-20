-- 0055_kuta_uluwatu_nusadua_gap_fill.sql
-- Fills real content gaps identified by the coverage report (2026-07-20) for
-- Kuta-Legian, Uluwatu-Bukit and Nusa Dua: categories with zero active venues
-- that are genuinely missing data, not structural (hotel/resort/activity are
-- separate, ongoing tracks and are NOT touched here).
--
-- Sourcing: real, independently-established Bali venues found via web search
-- (Tripadvisor / Honeycombers / Klook / Wanderlog / operator sites, July 2026).
-- why_its_here is built only from what those sources actually describe (what
-- the place is, its known specialty/format); no invented hours, prices,
-- ratings or "open to non-guests" claims (guardrail #10). best_for is
-- Other-Bali editorial fit-context judgement, same as every other venue.
-- gmaps_url is a name+area Google Maps SEARCH link (not a guessed pin),
-- matching the 0041 Kora-chain precedent -- Maps resolves the real location,
-- nothing is fabricated here.
--
-- Held OUT deliberately (not enough confidence to place correctly, so left
-- for a real research pass rather than guessed): Warung Melati and Warung
-- Padmasari (sub-area within Kuta/Legian not confirmed), HQ Beach Club
-- (thin, undifferentiated description).
--
-- Inserted directly at publication_status='published' with full editorial
-- copy in hand (no separate review buffer needed -- unlike the batch3
-- destinations, which had no sourced copy at insert time). Idempotent
-- (`where not exists`). Production apply is a founder/operator step.

begin;

-- ---------- kuta-legian: bar (2) ----------
insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$engine-room-legian$ob$, $ob$Engine Room$ob$, $ob$bar$ob$, $ob$kuta-legian$ob$, $ob$Legian$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Engine%20Room%20Legian%20Bali$ob$, $ob$A three-storey nightclub on the Legian strip where the main dance floor opens straight onto the sidewalk, with resident DJs running hip-hop, dubstep and trap sets.$ob$, $ob$late-night dancing and DJ sets on the Legian strip$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$engine-room-legian$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$paddys-pub-legian$ob$, $ob$Paddy's Pub$ob$, $ob$bar$ob$, $ob$kuta-legian$ob$, $ob$Legian$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Paddy%27s%20Pub%20Legian%20Bali$ob$, $ob$A long-running Legian nightlife name carrying on the legacy of the original Paddy's Club, known for themed party nights and a high-energy crowd.$ob$, $ob$themed party nights in Legian$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$paddys-pub-legian$ob$);

-- ---------- kuta-legian: beach_club (2) ----------
insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$azul-beach-club-legian$ob$, $ob$Azul Beach Club$ob$, $ob$beach_club$ob$, $ob$kuta-legian$ob$, $ob$Legian beachfront$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Azul%20Beach%20Club%20Legian%20Bali$ob$, $ob$A bamboo tree-house beach club on the Legian beachfront, built across three open-air tiered levels facing the ocean, with a dedicated Tiki bar and a kitchen doing playful takes on Indonesian classics.$ob$, $ob$a design-forward beach club day in Legian$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$azul-beach-club-legian$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$skai-beach-club-legian$ob$, $ob$S.K.A.I Beach Club$ob$, $ob$beach_club$ob$, $ob$kuta-legian$ob$, $ob$Padma Resort Legian, Legian$ob$, $ob$https://www.google.com/maps/search/?api=1&query=SKAI%20Beach%20Club%20Padma%20Resort%20Legian%20Bali$ob$, $ob$A beach club at Padma Resort Legian with a semi-alfresco terrace and an infinity pool set over the Legian surf, built around sunset.$ob$, $ob$sunset over an infinity pool in Legian$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$skai-beach-club-legian$ob$);

-- ---------- kuta-legian: cafe (3) ----------
insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$crumb-and-coaster-kuta$ob$, $ob$Crumb & Coaster$ob$, $ob$cafe$ob$, $ob$kuta-legian$ob$, $ob$Kuta$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Crumb%20and%20Coaster%20Kuta%20Bali$ob$, $ob$A long-standing Kuta breakfast spot mixing Indonesian dishes with pasta and Thai curry, alongside a wide hot-and-cold coffee list.$ob$, $ob$an all-day breakfast stop in Kuta$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$crumb-and-coaster-kuta$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$coffee-cartel-legian$ob$, $ob$Coffee Cartel$ob$, $ob$cafe$ob$, $ob$kuta-legian$ob$, $ob$Legian$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Coffee%20Cartel%20Legian%20Bali$ob$, $ob$A boutique specialty-coffee spot in Legian, part of a small Bali chain, known for premium blends and unusual lattes -- matcha, charcoal, beetroot -- alongside the classics.$ob$, $ob$specialty coffee and an unusual latte in Legian$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$coffee-cartel-legian$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$dear-lucy-cafe-kuta$ob$, $ob$Dear Lucy Cafe$ob$, $ob$cafe$ob$, $ob$kuta-legian$ob$, $ob$Kuta$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Dear%20Lucy%20Cafe%20Kuta%20Bali$ob$, $ob$A café in the heart of Kuta pairing a considered coffee blend with fresh pastries.$ob$, $ob$coffee and pastries in central Kuta$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$dear-lucy-cafe-kuta$ob$);

-- ---------- kuta-legian: warung (2) ----------
insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$mades-warung-kuta$ob$, $ob$Made's Warung$ob$, $ob$warung$ob$, $ob$kuta-legian$ob$, $ob$Jl. Pantai Kuta, Kuta$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Made%27s%20Warung%20Jl%20Pantai%20Kuta%20Bali$ob$, $ob$One of Kuta's oldest names, started as a roadside food stall in 1969 and grown into a full Balinese restaurant on Jalan Pantai Kuta, known for nasi campur and ayam goreng bumbu Bali.$ob$, $ob$classic Balinese nasi campur in Kuta$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$mades-warung-kuta$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$warung-kampung-legian$ob$, $ob$Warung Kampung$ob$, $ob$warung$ob$, $ob$kuta-legian$ob$, $ob$Legian$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Warung%20Kampung%20Legian%20Bali$ob$, $ob$A Balinese-run local warung in Legian known for its nasi goreng and mie goreng at everyday prices.$ob$, $ob$an affordable, local nasi or mie goreng in Legian$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$warung-kampung-legian$ob$);

-- ---------- kuta-legian: beauty (2) ----------
insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$caseys-spa-beauty-salon-legian$ob$, $ob$Casey's Spa & Beauty Salon$ob$, $ob$beauty$ob$, $ob$kuta-legian$ob$, $ob$Jl. Melasti, Legian$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Casey%27s%20Spa%20and%20Beauty%20Salon%20Jl%20Melasti%20Legian%20Bali$ob$, $ob$A spa and beauty salon on Jalan Melasti in Legian, opposite Legian Beach Hotel, offering Balinese massage, facials, body scrubs and manicure/pedicure alongside hair treatments.$ob$, $ob$a full spa-and-salon stop in Legian$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$caseys-spa-beauty-salon-legian$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$kupu-kupu-day-spa-legian$ob$, $ob$Kupu Kupu Day Spa$ob$, $ob$beauty$ob$, $ob$kuta-legian$ob$, $ob$overlooking Kuta Beach, Legian$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Kupu%20Kupu%20Day%20Spa%20Legian%20Kuta%20Beach%20Bali$ob$, $ob$A day spa overlooking Kuta Beach doing manicures, pedicures and hair treatments with OPI products, plus a blow-dry bar.$ob$, $ob$a beachfront mani-pedi and blow-dry near Kuta Beach$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$kupu-kupu-day-spa-legian$ob$);

-- ---------- uluwatu-bukit: surf (3) ----------
insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$poggy-bali-surf-school-uluwatu$ob$, $ob$Poggy Bali Surf School$ob$, $ob$surf$ob$, $ob$uluwatu-bukit$ob$, $ob$Padang Padang, Bukit peninsula$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Poggy%20Bali%20Surf%20School%20Padang%20Padang%20Uluwatu%20Bali$ob$, $ob$A surf school based at Padang Padang beach coaching all levels across the Bukit's breaks -- Padang Padang, Bingin, Dreamland and others.$ob$, $ob$tailored surf coaching across the Bukit's breaks$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$poggy-bali-surf-school-uluwatu$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$padang-padang-surf-camp-uluwatu$ob$, $ob$Padang Padang Surf Camp$ob$, $ob$surf$ob$, $ob$uluwatu-bukit$ob$, $ob$Bingin, Bukit peninsula$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Padang%20Padang%20Surf%20Camp%20Bingin%20Uluwatu%20Bali$ob$, $ob$A Bingin-based surf coaching operation running since 2005, led by a coach who grew up surfing Bingin.$ob$, $ob$structured surf coaching for progressing surfers at Bingin$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$padang-padang-surf-camp-uluwatu$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$balumba-surf-school-uluwatu$ob$, $ob$Balumba Surf School$ob$, $ob$surf$ob$, $ob$uluwatu-bukit$ob$, $ob$Bukit peninsula$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Balumba%20Surf%20School%20Uluwatu%20Bali$ob$, $ob$A surf school running lessons around Uluwatu's breaks -- Dreamland, Padang Padang and Balangan.$ob$, $ob$surf lessons across the Bukit's beaches$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$balumba-surf-school-uluwatu$ob$);

-- ---------- nusa-dua: cafe (2) ----------
insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$dua-kafe-nusa-dua$ob$, $ob$DUA Kafe$ob$, $ob$cafe$ob$, $ob$nusa-dua$ob$, $ob$Nusa Dua$ob$, $ob$https://www.google.com/maps/search/?api=1&query=DUA%20Kafe%20Nusa%20Dua%20Bali$ob$, $ob$A stylish all-day café in Nusa Dua a short walk from the beach, known for its macadamia flat white and matcha latte.$ob$, $ob$a well-made flat white in Nusa Dua$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$dua-kafe-nusa-dua$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, why_its_here, best_for, publication_status)
select gen_random_uuid()::text, $ob$gourmet-and-cafe-nusa-dua$ob$, $ob$Gourmet and Cafe Nusa Dua$ob$, $ob$cafe$ob$, $ob$nusa-dua$ob$, $ob$Nusa Dua$ob$, $ob$https://www.google.com/maps/search/?api=1&query=Gourmet%20and%20Cafe%20Nusa%20Dua%20Bali$ob$, $ob$A café in Nusa Dua with a cosy, considered space serving food and health-forward drinks.$ob$, $ob$a relaxed daytime café stop in Nusa Dua$ob$, $ob$published$ob$
where not exists (select 1 from venues where slug = $ob$gourmet-and-cafe-nusa-dua$ob$);

commit;
