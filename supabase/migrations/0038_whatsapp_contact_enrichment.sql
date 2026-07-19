-- 0038_whatsapp_contact_enrichment.sql
-- Enrich existing venue rows with a public business WhatsApp number (and, where
-- present, official Instagram / a real Google Maps place link) from an external
-- contact-lookup pass over Bali restaurants & cafes.
--
-- Source: WhatsApp lookup batch (ALL_RESTAURANTS_CAFES_FOUND), captured 2026-07-19,
--   drawn from each venue's own Instagram bio / official website / Google Maps and
--   a few high-confidence directories. Numbers are the venue's public ordering
--   contact for the whatsapp action gateway (wa.me) — not personal PII.
-- Scope: 63 venues that already exist in the catalogue. Enrichment only.
-- Non-destructive: every field uses coalesce(existing, new) so a value already set
--   is never overwritten; re-running is idempotent. whatsapp stored digits-only, intl.
-- Not included: 8 unverified NEW warung candidates (Warung Ceria/Biah/Cerita cluster,
--   D'Buchu) are staged as needs_verification under data/data-ops/kora-leads and are
--   intentionally NOT inserted here until confirmed as real, distinct venues.

begin;

-- ---------- canggu (7) ----------
update venues set whatsapp = coalesce(whatsapp, $ob$6281337810257$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/babiguling.sarikembar99/$ob$) where slug = $ob$babi-guling-sari-kembar-99$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6282341298975$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/copenhagencafe.bali/$ob$), gmaps_url = coalesce(gmaps_url, $ob$https://www.google.com/maps/place/Copenhagen%2BBerawa/%40-8.6597001%2C115.1317603%2C16.5z/data%3D%214m10%211m2%212m1%211copenhagen%2Bcafe%213m6%211s0x2dd2474e93e803ed%3A0x53cc824630314d84%218m2%213d-8.6589493%214d115.1381321%2115sCg9jb3BlbmhhZ2VuIGNhZmVaESIPY29wZW5oYWdlbiBjYWZlkgEKcmVzdGF1cmFudOABAA%2116s%2Fg%2F11t75tr_hn$ob$) where slug = $ob$copenhagen-cafe-berawa$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281916261429$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warungjawabusricanggu/$ob$) where slug = $ob$warung-jawa-bu-sri$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281236081580$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/waroengnonii/$ob$) where slug = $ob$warung-nonii$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281337874958$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warung_sika/$ob$) where slug = $ob$warung-sika$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281936630710$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warungvaruna/$ob$) where slug = $ob$warung-varuna$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281353688196$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warungyess/$ob$) where slug = $ob$warung-yess$ob$;

-- ---------- jimbaran (8) ----------
update venues set whatsapp = coalesce(whatsapp, $ob$62816800542$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/akua.mediterranean/$ob$) where slug = $ob$akua-mediterranean$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6287738449169$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/bawangmerahbeachfront/$ob$) where slug = $ob$bawang-merah-beachfront$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281138208768$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/korestaurantbali/$ob$) where slug = $ob$ko-japanese-teppanyaki-and-sushi$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6285333043866$ob$) where slug = $ob$nelayan-restaurant-and-puri-bar$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$62811380381$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/nyomancafejimbaranseafood/$ob$) where slug = $ob$nyoman-cafe$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$628123607490$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/sunsetbar.jimbaran/$ob$) where slug = $ob$sunset-beach-bar-and-grill$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6282228507788$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/uniquerooftopbar/$ob$) where slug = $ob$unique-rooftop-bar-and-restaurant$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$628113920776$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warunghalmeikanbakar/$ob$) where slug = $ob$warung-halme-ikan-bakar-ala-jimbaran$ob$;

-- ---------- nusa-dua (8) ----------
update venues set whatsapp = coalesce(whatsapp, $ob$6281918498988$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/bejana.indonesian/$ob$) where slug = $ob$bejana-ritz-carlton$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281237269788$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/kenjaikanbakar/$ob$) where slug = $ob$kenja-ikan-bakar-nusa-dua$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281990008685$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/nasibanjar.mbokmang/$ob$) where slug = $ob$nasi-banjar-mbok-mang$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6285162908592$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/tetaringrestaurant/$ob$) where slug = $ob$tetaring$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6282144655057$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/thebeachgrillbali/$ob$) where slug = $ob$the-beach-grill-ritz-carlton$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281237040511$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/batanbekultb/$ob$) where slug = $ob$warung-batan-bekul$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6285737063545$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/babiguling_pakdobil/$ob$) where slug = $ob$warung-dobiel-nusa-dua$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6282146364579$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warungibuoki_bali/$ob$) where slug = $ob$warung-nasi-ayam-bu-oki$ob$;

-- ---------- sanur (8) ----------
update venues set whatsapp = coalesce(whatsapp, $ob$6281237265995$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/babiguling_odahsanur/$ob$) where slug = $ob$babi-guling-odah-sanur$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281339961875$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/jalapenobali/$ob$) where slug = $ob$jalapeno$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6287767775050$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/lilla.bali/$ob$) where slug = $ob$lilla-pantai$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281238990448$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/menweti_sanur/$ob$) where slug = $ob$nasi-bali-men-weti$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281585321056$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/pizzariasanur/$ob$) where slug = $ob$pizzaria-hyatt$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281239003818$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/segara_theseaside/$ob$) where slug = $ob$segara-the-seaside$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6285815045860$ob$) where slug = $ob$warung-babi-guling-sanur-bypass$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6285211221669$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/preginabalii/$ob$) where slug = $ob$warung-pregina$ob$;

-- ---------- seminyak (20) ----------
update venues set whatsapp = coalesce(whatsapp, $ob$6287750782338$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warungbabigulingpakmalen/$ob$) where slug = $ob$babi-guling-pak-malen$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281901051999$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/bamburestaurant.bali/$ob$) where slug = $ob$bambu$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281339609258$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/cornerhousebali/$ob$) where slug = $ob$corner-house-bali$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281246167618$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/kilokitchenbali/$ob$) where slug = $ob$kilo-kitchen-bali-seminyak$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281916417867$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/linglingsbali/$ob$) where slug = $ob$ling-lings-bali$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281806126700$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/mamasanbali/$ob$) where slug = $ob$mamasan-bali$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281338578815$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/merahputihbali/$ob$) where slug = $ob$merah-putih-indonesian-restaurant$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6285211113232$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/moonlite.kitchen.bar/$ob$) where slug = $ob$moonlite-kitchen-and-bar$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281337316293$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/natysrestaurant/$ob$) where slug = $ob$natys-restaurant-seminyak$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$628113994411$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/naughtynuris/$ob$) where slug = $ob$naughty-nuris-warung-seminyak$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$628131151199$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/pison.petitenget/$ob$) where slug = $ob$pison-petitenget$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281238428343$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/revolver_seminyak/$ob$) where slug = $ob$revolver-seminyak$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281236959895$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/sangsaka_bali/$ob$) where slug = $ob$sangsaka$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$628113867544$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/seasaltbali/$ob$) where slug = $ob$seasalt$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281919459503$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/waroeng.sulawesi/$ob$) where slug = $ob$waroeng-sulawesi-petitenget$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$628176780001$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warungblanjong/$ob$) where slug = $ob$warung-blanjong$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6287761556688$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warungenys/$ob$) where slug = $ob$warung-enys$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6289663993501$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warungmelati/$ob$) where slug = $ob$warung-melati-nakula$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6283182837692$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/warung_nia_/$ob$) where slug = $ob$warung-nia-balinese-food-and-pork-ribs$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6285102808030$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/watercress_seminyak/$ob$) where slug = $ob$watercress-seminyak$ob$;

-- ---------- ubud (5) ----------
update venues set whatsapp = coalesce(whatsapp, $ob$6281338239921$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/casalunaubud/$ob$) where slug = $ob$casa-luna$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$62812391696480$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/dicarikwarung/$ob$) where slug = $ob$dicarik-warung$ob$; -- confidence: medium
update venues set whatsapp = coalesce(whatsapp, $ob$628124698147$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/ibu_rai_ubud/$ob$) where slug = $ob$ibu-rai$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281338692319$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/sukaespresso.ubud/$ob$) where slug = $ob$suka-espresso-ubud$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6282340065048$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/zestubud/$ob$) where slug = $ob$zest-ubud$ob$;

-- ---------- uluwatu-bukit (7) ----------
update venues set whatsapp = coalesce(whatsapp, $ob$6282144823166$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/gooseberry_uluwatu/$ob$) where slug = $ob$gooseberry-french-restaurant-uluwatu$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$62817555365$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/manauluwatu/$ob$) where slug = $ob$mana-uluwatu$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6282146765177$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/masonry.restaurant/$ob$) where slug = $ob$masonry-restaurant$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6282342173719$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/papisapi.bali/$ob$) where slug = $ob$papi-sapi$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6285958951520$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/singlefinbali/$ob$) where slug = $ob$single-fin$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281226662445$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/sonofabaker.bali/$ob$) where slug = $ob$son-of-a-baker$ob$;
update venues set whatsapp = coalesce(whatsapp, $ob$6281246527605$ob$), instagram_url = coalesce(instagram_url, $ob$https://www.instagram.com/sukaespresso/$ob$) where slug = $ob$suka-espresso$ob$;

commit;
