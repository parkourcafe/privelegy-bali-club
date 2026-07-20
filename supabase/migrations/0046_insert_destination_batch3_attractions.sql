-- 0046_insert_destination_batch3_attractions.sql
-- Insert 21 Bali destinations/attractions from the "Batch 3 decision candidate
-- enrichment" pass (data ops, 2026-07-20) as DRAFT (publication_status = 'review',
-- column default) rows in the existing venues table, category = 'attraction'.
-- No new domain entity (guardrail #13) -- attraction/activity are VenueCategory
-- values (see prior migration adding them to lib/types.ts).
--
-- Source: official Bali provincial tourism office (Dispar) pages, matched
-- coordinates + official_dispar_page per the data-ops enrichment pipeline.
-- Every row's own why_its_here text (where present) is built ONLY from that
-- pipeline's sourced access_guidance_raw field -- no invented hours, fees,
-- parking, contact links or editorial hype (guardrail #10). Rows without a
-- sourced blurb get why_its_here = null (unknown -> hidden, not invented).
--
-- gmaps_url is built directly from the pipeline's own verified coordinates.
-- official_url is the Dispar government page (legitimate official source).
--
-- Repo convention (cf. 0039/0041): inserted at column-default publication_status
-- = 'review' -- in the catalogue but NOT public/indexed until a follow-up
-- migration flips it to 'published', AFTER an editorial pass. The source
-- pipeline's own QA report scored decision_ready_candidate = false for all 23
-- rows it enriched (no verified opening hours/fee/parking for any of them), so
-- NONE are flipped to published here -- that is a deliberate, separate step.
--
-- Held OUT of this migration (not inserted; flagged back to the data-ops pass):
--   * Tourism Village Sangeh (Badung) -- no existing/added district fits its
--     inland Badung location; needs a manual district decision, not a forced guess.
--   * The duplicate 'Jatiluwih'/'Tourism Village Jatiluwih' rows (identical
--     coordinates, same Dispar page) were merged into the single 'jatiluwih' row.
--   * 'Tourism Village Gitgit' and 'Air Terjun Gitgit' were KEPT as two separate
--     rows -- coordinates are ~650m apart (village vs. waterfall), not an exact
--     duplicate, though the two are clearly related and worth a human look.
--
-- Production apply is a founder/operator step, same as 0039/0041.

begin;

-- New regency-level districts the batch3 destinations fall in, none of which
-- existed in the districts seed (cf. 0006/0015/0039) -- added additively so the
-- venues.district FK resolves. planning_only/no money loop, same as the 0039
-- Denpasar precedent. Idempotent.
insert into districts (slug, name, is_deep, status, monetization_enabled, qr_enabled)
values ($ob$tabanan$ob$, $ob$Tabanan$ob$, false, $ob$planning_only$ob$, false, false)
on conflict (slug) do nothing;

insert into districts (slug, name, is_deep, status, monetization_enabled, qr_enabled)
values ($ob$bangli$ob$, $ob$Bangli$ob$, false, $ob$planning_only$ob$, false, false)
on conflict (slug) do nothing;

insert into districts (slug, name, is_deep, status, monetization_enabled, qr_enabled)
values ($ob$karangasem$ob$, $ob$Karangasem$ob$, false, $ob$planning_only$ob$, false, false)
on conflict (slug) do nothing;

insert into districts (slug, name, is_deep, status, monetization_enabled, qr_enabled)
values ($ob$jembrana$ob$, $ob$Jembrana$ob$, false, $ob$planning_only$ob$, false, false)
on conflict (slug) do nothing;

-- ---------- attractions (21) ----------
insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$bunut-bolong$ob$, $ob$Bunut Bolong$ob$, $ob$attraction$ob$, $ob$jembrana$ob$, $ob$Manggis Sari village, Pekutatan, Jembrana$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.3634089%2C114.9187067$ob$, $ob$https://disparda.baliprov.go.id/bunut-bolong-trees/2020/04/$ob$, $ob$A natural tunnel formed by a giant banyan tree that the coastal road passes straight through, in Manggis Sari village, Pekutatan district, Jembrana.$ob$
where not exists (select 1 from venues where slug = $ob$bunut-bolong$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$jatiluwih$ob$, $ob$Jatiluwih$ob$, $ob$attraction$ob$, $ob$tabanan$ob$, $ob$Tabanan (700m altitude)$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.3574015%2C115.1187934$ob$, $ob$https://disparda.baliprov.go.id/1146-2/2020/04/$ob$, $ob$Rice terraces at roughly 700 metres altitude in Tabanan.$ob$
where not exists (select 1 from venues where slug = $ob$jatiluwih$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$tanah-lot$ob$, $ob$Tanah Lot$ob$, $ob$attraction$ob$, $ob$tabanan$ob$, $ob$Beraban village, Tabanan$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.6212286%2C115.0868849$ob$, $ob$https://disparda.baliprov.go.id/tanah-lot-temple/2020/04/$ob$, $ob$A sea temple in Beraban village, Tabanan regency.$ob$
where not exists (select 1 from venues where slug = $ob$tanah-lot$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$garuda-wisnu-kencana$ob$, $ob$Garuda Wisnu Kencana$ob$, $ob$attraction$ob$, $ob$uluwatu-bukit$ob$, $ob$Ungasan, Badung$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.8141627%2C115.166652$ob$, $ob$https://disparda.baliprov.go.id/garuda-wisnu-kencana-2/2021/09/$ob$, null
where not exists (select 1 from venues where slug = $ob$garuda-wisnu-kencana$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$pantai-kuta$ob$, $ob$Pantai Kuta$ob$, $ob$attraction$ob$, $ob$kuta-legian$ob$, $ob$Kuta, Badung$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.7182136%2C115.1687568$ob$, $ob$https://disparda.baliprov.go.id/pantai-kuta/2021/09/$ob$, null
where not exists (select 1 from venues where slug = $ob$pantai-kuta$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$pantai-pandawa$ob$, $ob$Pantai Pandawa$ob$, $ob$attraction$ob$, $ob$uluwatu-bukit$ob$, $ob$Bukit peninsula, Badung$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.8458046%2C115.1850876$ob$, $ob$https://disparda.baliprov.go.id/pantai-pandawa/2021/09/$ob$, null
where not exists (select 1 from venues where slug = $ob$pantai-pandawa$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$pantai-jimbaran$ob$, $ob$Pantai Jimbaran$ob$, $ob$attraction$ob$, $ob$jimbaran$ob$, $ob$Jimbaran, Badung$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.7923274%2C115.1231962$ob$, $ob$https://disparda.baliprov.go.id/pantai-jimbaran/2021/09/$ob$, null
where not exists (select 1 from venues where slug = $ob$pantai-jimbaran$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$tirta-empul$ob$, $ob$Tirta Empul$ob$, $ob$attraction$ob$, $ob$ubud$ob$, $ob$Tampaksiring, Gianyar$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.4143876%2C115.3159951$ob$, $ob$https://disparda.baliprov.go.id/tirta-empul/2021/01/$ob$, null
where not exists (select 1 from venues where slug = $ob$tirta-empul$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$air-terjun-tegenungan$ob$, $ob$Air Terjun Tegenungan$ob$, $ob$attraction$ob$, $ob$ubud$ob$, $ob$Tegenungan village, Gianyar$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.5752294%2C115.2907014$ob$, $ob$https://disparda.baliprov.go.id/nungnung-waterfall/2020/04/$ob$, $ob$A waterfall about 10 kilometres outside Ubud, next to Tegenungan village, Gianyar.$ob$
where not exists (select 1 from venues where slug = $ob$air-terjun-tegenungan$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$pura-kehen$ob$, $ob$Pura Kehen$ob$, $ob$attraction$ob$, $ob$bangli$ob$, $ob$Bangli$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.4418491%2C115.3600201$ob$, $ob$https://disparda.baliprov.go.id/pura-kehen/2021/10/$ob$, null
where not exists (select 1 from venues where slug = $ob$pura-kehen$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$desa-wisata-penglipuran$ob$, $ob$Desa Wisata Penglipuran$ob$, $ob$attraction$ob$, $ob$bangli$ob$, $ob$Bangli$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.4223453%2C115.3593125$ob$, $ob$https://disparda.baliprov.go.id/desa-wisata-penglipuran/2020/06/$ob$, null
where not exists (select 1 from venues where slug = $ob$desa-wisata-penglipuran$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$desa-wisata-undisan$ob$, $ob$Tourism Village Undisan$ob$, $ob$attraction$ob$, $ob$bangli$ob$, $ob$Undisan village, Bangli$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.4450777%2C115.3961784$ob$, $ob$https://disparda.baliprov.go.id/desa-wisata-undisan/2020/06/$ob$, $ob$A traditional village in Bangli, about 90 minutes' drive from Ngurah Rai airport or 45 minutes from Ubud.$ob$
where not exists (select 1 from venues where slug = $ob$desa-wisata-undisan$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$desa-wisata-tembuku$ob$, $ob$Tourism Village Tembuku$ob$, $ob$attraction$ob$, $ob$bangli$ob$, $ob$Bangli$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.4335942%2C115.3859581$ob$, $ob$https://disparda.baliprov.go.id/desa-tembuku/2020/06/$ob$, null
where not exists (select 1 from venues where slug = $ob$desa-wisata-tembuku$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$desa-wisata-besakih$ob$, $ob$Tourism Village Besakih$ob$, $ob$attraction$ob$, $ob$karangasem$ob$, $ob$Rendang, Karangasem$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.3575455%2C115.4644903$ob$, $ob$https://disparda.baliprov.go.id/besakih-temple/2020/04/$ob$, $ob$Bali's largest temple complex, in Besakih countryside, Rendang sub-district, Karangasem, on the east side of the island.$ob$
where not exists (select 1 from venues where slug = $ob$desa-wisata-besakih$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$desa-wisata-tenganan$ob$, $ob$Tourism Village Tenganan$ob$, $ob$attraction$ob$, $ob$karangasem$ob$, $ob$Karangasem$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.4764705%2C115.5722248$ob$, $ob$https://disparda.baliprov.go.id/tenganan-village/2020/04/$ob$, $ob$A traditional village in Karangasem, on the eastern side of Bali.$ob$
where not exists (select 1 from venues where slug = $ob$desa-wisata-tenganan$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$desa-wisata-bugbug$ob$, $ob$Tourism Village Bugbug$ob$, $ob$attraction$ob$, $ob$karangasem$ob$, $ob$Karangasem$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.4973091%2C115.5926613$ob$, $ob$https://disparda.baliprov.go.id/desa-wisata-bugbug/2020/06/$ob$, null
where not exists (select 1 from venues where slug = $ob$desa-wisata-bugbug$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$pantai-lovina$ob$, $ob$Pantai Lovina$ob$, $ob$attraction$ob$, $ob$lovina$ob$, $ob$Lovina, Buleleng$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.162918%2C115.0221696$ob$, $ob$https://disparda.baliprov.go.id/pantai-lovina/2021/10/$ob$, null
where not exists (select 1 from venues where slug = $ob$pantai-lovina$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$desa-wisata-gitgit$ob$, $ob$Tourism Village Gitgit$ob$, $ob$attraction$ob$, $ob$lovina$ob$, $ob$Gitgit, Buleleng$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.1970065%2C115.1390822$ob$, $ob$https://disparda.baliprov.go.id/air-terjun-gitgit/2021/10/$ob$, null
where not exists (select 1 from venues where slug = $ob$desa-wisata-gitgit$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$air-terjun-gitgit$ob$, $ob$Air Terjun Gitgit$ob$, $ob$attraction$ob$, $ob$lovina$ob$, $ob$Gitgit, Buleleng$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.2028961%2C115.1388673$ob$, $ob$https://disparda.baliprov.go.id/air-terjun-gitgit/2021/10/$ob$, null
where not exists (select 1 from venues where slug = $ob$air-terjun-gitgit$ob$);

insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$desa-wisata-sanur-kauh$ob$, $ob$Tourism Village Sanur Kauh$ob$, $ob$attraction$ob$, $ob$sanur$ob$, $ob$Sanur Kauh, Denpasar$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.6956574%2C115.2496763$ob$, $ob$https://disparda.baliprov.go.id/desa-wisata-sanur-kauh/2020/06/$ob$, null
where not exists (select 1 from venues where slug = $ob$desa-wisata-sanur-kauh$ob$);

-- Source data conflict, resolved (not silently): the batch3 CSV files this row
-- under regency="Denpasar", but Medewi Beach's own coordinates place it firmly
-- in Jembrana (West Bali), ~60km from Denpasar -- a labeling error in the
-- source pipeline. district is set from the coordinates, not the CSV regency
-- field; flagged back to the data-ops pass for their own register correction.
insert into venues (id, slug, name, category, district, area, gmaps_url, official_url, why_its_here)
select gen_random_uuid()::text, $ob$desa-wisata-medewi$ob$, $ob$Tourism Village Medewi$ob$, $ob$attraction$ob$, $ob$jembrana$ob$, $ob$West Bali$ob$, $ob$https://www.google.com/maps/search/?api=1&query=-8.378733%2C114.8231445$ob$, $ob$https://disparda.baliprov.go.id/medewi-beach/2020/06/$ob$, $ob$A beach at the western tip of Bali, in Jembrana.$ob$
where not exists (select 1 from venues where slug = $ob$desa-wisata-medewi$ob$);

commit;
