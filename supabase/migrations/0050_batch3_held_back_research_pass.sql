-- 0050_batch3_held_back_research_pass.sql
-- Research pass on the 4 batch3 attraction venues deliberately held back by
-- 0047 (no why_its_here/best_for beyond an administrative label at the time).
-- Each row below is now backed by a real web-research pass (2026-07-20,
-- Bali provincial Dispar pages cross-checked against independent travel
-- sources -- Kompas, IDN Times, Bali.com, local desa/kabupaten sites) --
-- facts only (what the place is, what's there), no invented hours, fees,
-- parking or contact details. Sources per venue in the comments below.
--
-- Flips these 4 slugs to publication_status='published' (repo convention,
-- cf. 0042/0047) once content is set. Must run after 0046 (insert). Idempotent.

begin;

-- Sources: https://disparda.baliprov.go.id/desa-wisata-undisan/2020/06/ ;
-- https://travel.kompas.com/read/2022/08/13/090657027/ ;
-- https://bali.idntimes.com/travel/destination/desa-undisan-di-bangli-c1c2-01-z9kr1-l4d18w
update venues set
  why_its_here = $ob$A traditional village in Bangli, about 90 minutes from Ngurah Rai airport or 45 minutes from Ubud, built around rice-farming and craft traditions -- including matekap, ploughing rice fields with oxen the traditional way, and Balinese gold-and-silver flower craftwork. Air Terjun Tangkup waterfall is roughly a 45-minute walk from the main road.$ob$,
  best_for = $ob$traditional rice-field ploughing and craft demonstrations; a waterfall walk away from the tourist trail$ob$
where slug = $ob$desa-wisata-undisan$ob$;

-- Sources: https://disparda.baliprov.go.id/desa-tembuku/2020/06/ ;
-- https://www.tembuku.desa.id/artikel/2025/12/18/pesona-tukad-cepung-wisata-alam-tembuku-yang-masih-ramai-sejak-2018
update venues set
  why_its_here = $ob$A village in Bangli surrounded by rice terraces and forest, home to Tukad Cepung waterfall -- water falling through a narrow rock crevice about 15 metres high, roughly 8km from Bangli town.$ob$,
  best_for = $ob$a lesser-known waterfall away from the main tourist circuit; traditional cooking and craft demonstrations$ob$
where slug = $ob$desa-wisata-tembuku$ob$;

-- Sources: https://disparda.baliprov.go.id/desa-wisata-bugbug/2020/06/ ;
-- https://www.desaadatbugbug.com/karangasem-bali/ ;
-- https://bali.idntimes.com/travel/destination/hidden-gem-di-bugbug-karangasem-c1c2-01-1vgs2-xr2srq
update venues set
  why_its_here = $ob$One of Karangasem's largest and oldest traditional (desa adat) villages, on the coast near Candidasa, with ceremonial traditions held through the year. The nearby Bukit Asah hilltop looks out over Pulau Kuan, a small whale-shaped island just offshore.$ob$,
  best_for = $ob$traditional Balinese village culture and ceremony; combining with Virgin Beach or Bukit Asah nearby$ob$
where slug = $ob$desa-wisata-bugbug$ob$;

-- Sources: https://disparda.baliprov.go.id/desa-wisata-sanur-kauh/2020/06/ ;
-- https://www.pariwisata.denpasarkota.go.id/artikel/sanur-kauh-sebagai-desa-wisata-populer-di-kota-denpasar ;
-- https://www.sanurkauh.denpasarkota.go.id/
update venues set
  why_its_here = $ob$A village in South Denpasar on Mertasari beach -- white sand and calm water facing north, so it catches both sunrise and sunset. Pura Dalam Pengembak Mertasari, on the beach, is used for melukat purification bathing.$ob$,
  best_for = $ob$a quieter beach than central Sanur; the Mertasari melukat temple; a flat rice-field jogging route$ob$
where slug = $ob$desa-wisata-sanur-kauh$ob$;

update venues set publication_status = 'published'
where publication_status = 'review'
  and slug in (
    $ob$desa-wisata-undisan$ob$,
    $ob$desa-wisata-tembuku$ob$,
    $ob$desa-wisata-bugbug$ob$,
    $ob$desa-wisata-sanur-kauh$ob$
  );

commit;
