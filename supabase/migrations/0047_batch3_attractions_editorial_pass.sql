-- 0047_batch3_attractions_editorial_pass.sql
-- Light editorial pass on the 21 batch3 attraction venues inserted by 0046:
-- add/enrich why_its_here + best_for for the 17 slugs where the facts are
-- either (a) already independently verified elsewhere in this repo
-- (lib/bali-things.ts covers Tanah Lot, Tirta Empul, Besakih, Tegenungan --
-- cross-referenced and reused here, not re-invented) or (b) well-established,
-- uncontroversial public facts about a famous landmark (a beach's name and
-- general character, a statue's subject, a village's known craft) -- never a
-- specific operational fact (hours, fee, parking, contact) that would need
-- fresh field verification. best_for is fit-context judgement, not a sourced
-- fact, matching how every other venue's best_for is written.
--
-- The remaining 4 rows are deliberately HELD BACK in 'review' -- Tourism
-- Village Undisan / Tembuku / Bugbug / Sanur Kauh -- there is nothing beyond
-- an administrative label for them yet; writing a best_for would be a guess,
-- not an editorial judgement. They need an actual research/field pass before
-- they can publish -- flagged back to the data-ops queue, not silently skipped.
--
-- Second half of this migration flips exactly these 17 slugs to
-- publication_status='published' (repo convention, cf. 0042) -- scoped,
-- idempotent (guarded by `where publication_status = 'review'`).
--
-- Must run AFTER 0046. Production apply is a founder/operator step.

begin;

update venues set why_its_here = $ob$Bali's most photographed sea temple, on an offshore rock framed by the sunset. The inner sanctum is closed to non-worshippers; the rock base is reachable only at low tide.$ob$, best_for = $ob$sunset photography; a short coastal walk timed to low tide$ob$
where slug = $ob$tanah-lot$ob$;

update venues set why_its_here = $ob$A temple built around a sacred spring where Balinese Hindus, and visitors, perform melukat, a purification ritual moving spout to spout through the bathing pool. A sarong is required and provided at the gate.$ob$, best_for = $ob$the melukat purification ritual; a culturally rich half-day near Ubud$ob$
where slug = $ob$tirta-empul$ob$;

update venues set why_its_here = $ob$Bali's largest and holiest temple complex, on the slopes of Mount Agung in Rendang, Karangasem. A single foreigner ticket bundles a local guide, sarong and shuttle up to the gate.$ob$, best_for = $ob$a guided visit to Bali's holiest temple complex; travellers comfortable with a managed, ticketed route$ob$
where slug = $ob$desa-wisata-besakih$ob$;

update venues set why_its_here = $ob$A waterfall about 10 kilometres outside Ubud, next to Tegenungan village, Gianyar — big falls with steps down, one of the easiest waterfalls on the island to reach.$ob$, best_for = $ob$an easy waterfall stop near Ubud; travellers who want falls without a trek$ob$
where slug = $ob$air-terjun-tegenungan$ob$;

update venues set why_its_here = $ob$UNESCO-listed rice terraces at roughly 700 metres altitude in Tabanan, among the largest and most intact subak (traditional irrigation) landscapes on the island.$ob$, best_for = $ob$walking or cycling through UNESCO-listed rice terraces; a quieter alternative to Tegallalang$ob$
where slug = $ob$jatiluwih$ob$;

update venues set why_its_here = $ob$A cultural park in Ungasan, Badung, built around a giant bronze Vishnu-and-Garuda statue — one of the tallest statues in the world — with an amphitheatre and event spaces on the grounds.$ob$, best_for = $ob$seeing the GWK statue up close; combining with a Bukit-peninsula day out$ob$
where slug = $ob$garuda-wisnu-kencana$ob$;

update venues set why_its_here = $ob$Bali's original and best-known beach, a long stretch of sand in Kuta, Badung, known for sunset and surf breaks close to shore.$ob$, best_for = $ob$sunset by the water; beginner-friendly surf close to the airport$ob$
where slug = $ob$pantai-kuta$ob$;

update venues set why_its_here = $ob$A white-sand beach on the Bukit peninsula, Badung, reached by a road cut through the cliffs, with statues of the Pandawa brothers lining the entrance.$ob$, best_for = $ob$calmer water than the west-coast surf beaches; families and swimmers$ob$
where slug = $ob$pantai-pandawa$ob$;

update venues set why_its_here = $ob$A curving bay south of the airport, Badung, known for calm water, sunset views and beachfront seafood grills.$ob$, best_for = $ob$a sunset seafood dinner on the sand; calmer swimming than Kuta$ob$
where slug = $ob$pantai-jimbaran$ob$;

update venues set why_its_here = $ob$Bangli's state temple, a multi-tiered terraced complex set into a hillside, known for antique Chinese porcelain plates set into its walls.$ob$, best_for = $ob$a quieter temple visit away from the main south-Bali circuit$ob$
where slug = $ob$pura-kehen$ob$;

update venues set why_its_here = $ob$A traditional Bali Aga village in Bangli known for its uniform bamboo-roofed houses and car-free main street.$ob$, best_for = $ob$a walk through traditional Balinese village architecture; an easy stop between Kintamani and south Bali$ob$
where slug = $ob$desa-wisata-penglipuran$ob$;

update venues set why_its_here = $ob$A black-sand beach on Bali's north coast, Buleleng, the base for early-morning dolphin-watching boat trips.$ob$, best_for = $ob$a dawn dolphin-watching boat trip; a quieter north-Bali beach base$ob$
where slug = $ob$pantai-lovina$ob$;

update venues set best_for = $ob$a quick photo stop on the Denpasar-Gilimanuk route through West Bali$ob$
where slug = $ob$bunut-bolong$ob$;

update venues set why_its_here = $ob$One of Bali's oldest Bali Aga (indigenous pre-Hindu Balinese) villages, in Karangasem, known for its double-ikat geringsing weaving.$ob$, best_for = $ob$traditional Balinese weaving and village architecture; a stop on an east-Bali day out$ob$
where slug = $ob$desa-wisata-tenganan$ob$;

update venues set why_its_here = $ob$A black-sand beach on Bali's west coast, in Jembrana, known for a long left-hand point break.$ob$, best_for = $ob$surfers looking for a long, mellow left-hander; a quieter west-Bali beach stop$ob$
where slug = $ob$desa-wisata-medewi$ob$;

update venues set why_its_here = $ob$The village at the base of the well-known Gitgit waterfall, on the mountain road between south Bali and Singaraja, Buleleng.$ob$, best_for = $ob$a waterfall stop on the drive to/from north Bali$ob$
where slug = $ob$desa-wisata-gitgit$ob$;

update venues set why_its_here = $ob$A multi-tier waterfall on the mountain road between south Bali and Singaraja, Buleleng, one of north Bali's most visited falls.$ob$, best_for = $ob$a waterfall stop on the drive to/from north Bali$ob$
where slug = $ob$air-terjun-gitgit$ob$;

-- Flip the 17 editorially-cleared slugs to published. The 4 held-back slugs
-- (listed in the header comment) are intentionally NOT in this list.
update venues set publication_status = 'published'
where publication_status = 'review'
  and slug in (
    $ob$tanah-lot$ob$,
    $ob$tirta-empul$ob$,
    $ob$desa-wisata-besakih$ob$,
    $ob$air-terjun-tegenungan$ob$,
    $ob$jatiluwih$ob$,
    $ob$garuda-wisnu-kencana$ob$,
    $ob$pantai-kuta$ob$,
    $ob$pantai-pandawa$ob$,
    $ob$pantai-jimbaran$ob$,
    $ob$pura-kehen$ob$,
    $ob$desa-wisata-penglipuran$ob$,
    $ob$pantai-lovina$ob$,
    $ob$bunut-bolong$ob$,
    $ob$desa-wisata-tenganan$ob$,
    $ob$desa-wisata-medewi$ob$,
    $ob$desa-wisata-gitgit$ob$,
    $ob$air-terjun-gitgit$ob$
  );

commit;
