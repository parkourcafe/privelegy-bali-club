-- Nusa Dua wellness enrichment + one local warung (0029). Fills the 9 empty active
-- Nusa Dua spa/fitness/yoga rows (resort facilities) and adds Warung Dobiel (Pak
-- Dobiel babi guling, Bualu) as the one genuinely-missing local contrast to the
-- resort dining. Verified web-research pass, first-party sources. Nusa Dua is
-- planning_only (resort enclave) -- no money loop, no booking language.
-- GUARDRAILS: no reviews/ratings (#1); best_for/not_for WHO/WHEN only (#7); prices
-- as bands (fitness centres are complimentary guest facilities -> price null, but
-- carry a what_to_order facility line so they still clear the gate); existing
-- categories (#11). Enrich is fill-empties-only; the insert is NOT EXISTS-guarded.

begin;
-- 1. mulia-spa-nusa-dua
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The 20-room spa at The Mulia is one of Bali''s largest and most decorated resort spas, built around an extensive hydrotherapy journey — Cleopatra-style hydrotonic pools with underwater jets, hot and cold plunge pools, Finnish saunas, steam and ice rooms — that guests move through before a tailored, Ayurvedic-inspired treatment.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers who want a full half-day wellness ritual with pools, saunas and a long massage, not just a quick treatment; couples staying on the Nusa Dua/Sawangan strip.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone after a fast, low-key neighbourhood massage or a budget price point.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The hot-and-cold hydrotherapy circuit with the Cleopatra hydrotonic pools; a signature warm coconut-shell (cup) massage.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.themulia.com/bali/experiences/mulia-spa')
where slug = 'mulia-spa-nusa-dua' and district = 'nusa-dua';

-- 2. the-apurva-spa-nusa-dua
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Apurva Spa is the award-winning wellness sanctuary of The Apurva Kempinski, built on traditional Balinese and Javanese healing — Lulur and Jamu rituals, sound healing and chakra work — set on the resort''s dramatic tiered clifftop above the Indian Ocean.'),
    best_for = coalesce(nullif(best_for, ''), 'Guests who want a signature, story-led Indonesian treatment in a landmark clifftop resort; those pairing a massage with sound-healing or chakra sessions.'),
    not_for = coalesce(nullif(not_for, ''), 'Travellers wanting a simple, walk-in street-side massage or a quick express stop.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The Gending Apurva signature massage — a 90-minute treatment using a warm poultice of 69 herbs and mineral salt.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.kempinski.com/en/the-apurva-kempinski-bali/luxury-spa')
where slug = 'the-apurva-spa-nusa-dua' and district = 'nusa-dua';

-- 3. kriya-spa-at-grand-hyatt-bali-nusa-dua
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Kriya Spa — meaning ''rituals'' — sits within the Grand Hyatt Bali''s water-palace-inspired grounds, with garden gazebos beside tropical pools. Its menu is organised around themed rituals (Bliss, Harmony, Purity, Energy) rooted in traditional Balinese and Javanese wellness.'),
    best_for = coalesce(nullif(best_for, ''), 'Resort guests and couples who want a traditional Balinese massage in an open garden-pavilion setting; a heritage-style Lulur ritual.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone looking for a clinical urban day-spa or the cheapest option in the area.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The Kriya Java Lulur traditional body scrub; a Balinese massage in a garden gazebo.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.hyatt.com/en-US/spas/Kriya-Spa/home.html')
where slug = 'kriya-spa-at-grand-hyatt-bali-nusa-dua' and district = 'nusa-dua';

-- 4. revi-vo-spa-wellness-nusa-dua
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'REVĪVŌ is a dedicated wellness resort tucked into a three-hectare teak forest in the Nusa Dua hills, where the spa is one part of a whole ''wellness as a system'' approach — hydrotherapy Vichy shower beds, hot and cold plunge pools, a vitality centre and expert-led treatments, delivered within multi-night signature retreats.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers who want a structured, programme-led wellness stay (detox, de-stress, sleep, longevity) rather than a one-off massage; solo reset trips.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone wanting a single quick treatment or a big-resort beach-club atmosphere.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The hydrotherapy circuit with Vichy hydro-jet shower beds and hot/cold plunge pools; a signature multi-night retreat (e.g. Press Reset, Destress & Relax).'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.revivoresorts.com/')
where slug = 'revi-vo-spa-wellness-nusa-dua' and district = 'nusa-dua';

-- 5. mulia-fitness-centre-nusa-dua
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Mulia''s fitness centre pairs a fully equipped gym with a dedicated movement studio, a daily programme of complimentary classes (strength, cardio, Pilates, water aerobics, trampoline) and outdoor tennis and pickleball courts — a genuinely full active offering inside the resort.'),
    best_for = coalesce(nullif(best_for, ''), 'Active resort guests who want daily group classes and racquet courts alongside the gym; travellers keeping a training routine on holiday.'),
    not_for = coalesce(nullif(not_for, ''), 'Non-guests — the fitness centre is reserved for those staying at The Mulia, Mulia Resort or Mulia Villas.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The complimentary movement-studio group classes and water-aerobics sessions; tennis and pickleball courts.'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.themulia.com/bali/experiences/facilities')
where slug = 'mulia-fitness-centre-nusa-dua' and district = 'nusa-dua';

-- 6. sofitel-bali-fitness-centre-nusa-dua
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'SoFIT is the Sofitel Bali Nusa Dua Beach Resort''s fitness centre — a well-equipped modern gym with sauna and separate male/female steam rooms, backed by a varied activity roster from boxing and HIIT to aqua-aerobics, badminton, beach volleyball and beach yoga.'),
    best_for = coalesce(nullif(best_for, ''), 'Guests who want gym work plus sociable group and beach activities; travellers who like a sauna/steam recovery after training.'),
    not_for = coalesce(nullif(not_for, ''), 'Those wanting a serious standalone strength gym rather than a resort leisure facility.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The SoFIT gym with sauna and steam rooms; boxing, HIIT and aqua-aerobics classes.'),
    official_url = coalesce(nullif(official_url, ''), 'https://sofitelbalinusadua.com/activities/sofit/'),
    instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/sofitelbalinusadua/')
where slug = 'sofitel-bali-fitness-centre-nusa-dua' and district = 'nusa-dua';

-- 7. the-apurva-kempinski-fitness-centre-nusa-dua
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Apurva Kempinski''s fitness centre is a modern, fully equipped gym with ocean views set within the resort''s wellness zone beside the infinity pool, open long daily hours (06:00–23:00) with personal trainers on hand.'),
    best_for = coalesce(nullif(best_for, ''), 'Guests who want an ocean-view workout with early-morning or late-evening flexibility; travellers who like trainer support on-site.'),
    not_for = coalesce(nullif(not_for, ''), 'Under-14s (not permitted on the equipment) and anyone not in proper athletic gear — the wellness zone enforces a dress code.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The ocean-view gym floor with personal-trainer coaching.'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.kempinski.com/en/the-apurva-kempinski-bali/luxury-spa/fitness-centre')
where slug = 'the-apurva-kempinski-fitness-centre-nusa-dua' and district = 'nusa-dua';

-- 8. revi-vo-yoga-mindfulness-nusa-dua
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'Movement and mindfulness are core to REVĪVŌ''s system, not add-ons: the resort has a yoga barn, an outdoor aerial-yoga space, a meditation room and a Pilates studio inside its 8,000-square-metre fitness and vitality centre, with guided mindfulness and emotional-balance programmes led by wellness coaches.'),
    best_for = coalesce(nullif(best_for, ''), 'Travellers seeking coach-guided yoga, meditation and mindfulness as part of a longer reset; those who want an aerial-yoga or Pilates option in a forest setting.'),
    not_for = coalesce(nullif(not_for, ''), 'Anyone looking for a single drop-in class rather than a programme-led experience.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'The yoga barn and open-air aerial-yoga deck; the guided mindfulness and emotional-balance sessions.'),
    price_anchor = coalesce(nullif(price_anchor, ''), '$$$$'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.revivoresorts.com/')
where slug = 'revi-vo-yoga-mindfulness-nusa-dua' and district = 'nusa-dua';

-- 9. the-apurva-kempinski-yoga-nusa-dua
update public.venues set
    why_its_here = coalesce(nullif(why_its_here, ''), 'The Apurva Kempinski runs open-air yoga against the Indian Ocean — sunrise Hatha and gentle flow on the lawn, plus aerial anti-gravity sessions — alongside daily Pilates and sound-healing, so guests can build a light daily movement and meditation practice without leaving the resort.'),
    best_for = coalesce(nullif(best_for, ''), 'Guests who want a dawn ocean-view yoga or meditation session; travellers curious to try aerial anti-gravity or sound healing.'),
    not_for = coalesce(nullif(not_for, ''), 'Serious practitioners after a dedicated studio and full class schedule rather than resort guest sessions.'),
    what_to_order = coalesce(nullif(what_to_order, ''), 'Sunrise Hatha or gentle-flow beach yoga; aerial anti-gravity yoga and a sound-healing session.'),
    official_url = coalesce(nullif(official_url, ''), 'https://www.kempinski.com/en/the-apurva-kempinski-bali/luxury-spa')
where slug = 'the-apurva-kempinski-yoga-nusa-dua' and district = 'nusa-dua';

-- 10. (NEW) warung-dobiel-nusa-dua
insert into public.venues (slug, name, category, district, area, why_its_here, best_for, not_for, what_to_order, price_anchor, jobs, tier, is_sponsored, status, id)
select 'warung-dobiel-nusa-dua', 'Warung Dobiel', 'warung', 'nusa-dua', 'Bualu, Nusa Dua (Jl. Srikandi)', 'A short drive from the resort gates on Jl. Srikandi, Warung Babi Guling Pak Dobiel has served suckling pork since 1990 and remains an everyday local institution — taxi drivers, hotel staff and students queue before it opens. It''s the honest, no-frills counterpoint to Nusa Dua''s resort dining.', 'Travellers who want authentic, inexpensive Balinese babi guling and a local room away from the resorts; an early lunch stop.', 'Vegetarians and anyone avoiding pork; those wanting air-conditioned comfort or a dinner-hour venue (it closes mid-afternoon).', 'The nasi babi guling plate — suckling pork with crackling, lawar and rice — with a bowl of pork soup on the side.', '$', array['local_food_calm']::text[], 'editorial_seed', false, 'active', gen_random_uuid()::text
where not exists (select 1 from public.venues where slug = 'warung-dobiel-nusa-dua');

commit;