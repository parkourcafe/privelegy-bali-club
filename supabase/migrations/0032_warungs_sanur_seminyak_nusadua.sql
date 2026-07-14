-- 0032_warungs_sanur_seminyak_nusadua.sql
-- Local-food / warung cluster across Sanur, Seminyak and Nusa Dua (verified
-- discovery pass, official IG/sites). category='warung' for the genuine warungs;
-- Kenja (Nusa Dua) is a fuller seafood restaurant so it stays 'restaurant'.
-- Guardrails held (no ratings/review counts; downsides only as not_for
-- fit-context; prices as bands). status/tier/publication use column defaults.
-- Uluwatu warungs are handled via the evidence registry, not here. Applied to
-- prod by the founder.

insert into venues
  (id, slug, name, category, district, area,
   why_its_here, best_for, not_for, what_to_order, price_anchor,
   official_url, instagram_url)
values
-- ===== SANUR (6) =====
($ob$v_warung-pregina$ob$, $ob$warung-pregina$ob$, $ob$Pregina Warung$ob$, $ob$warung$ob$, $ob$sanur$ob$, $ob$Jl. Danau Tamblingan$ob$,
 $ob$A long-running sit-down Balinese warung on the main Danau Tamblingan strip, known for home-style Balinese cooking built around duck and roast pork, in a traditional wood interior.$ob$,
 $ob$a sit-down dinner of authentic Balinese classics; families and small groups; travellers wanting a table-service warung rather than a hawker stall$ob$,
 $ob$grab-and-go or ultra-cheap street-stall budgets; diners who want a fast counter meal$ob$,
 $ob$bebek betutu (slow-cooked duck, often order ahead); bebek goreng (crispy duck); babi guling; sate; nasi campur Bali$ob$,
 $ob$$$ · mains ~45–95K$ob$, null, null),

($ob$v_warung-mak-beng$ob$, $ob$warung-mak-beng$ob$, $ob$Warung Mak Beng$ob$, $ob$warung$ob$, $ob$sanur$ob$, $ob$Jl. Hang Tuah, north Sanur$ob$,
 $ob$A Sanur institution serving since 1941 with a single set menu: fried fish, spicy fish-head soup and steamed rice. One dish, done one way, for generations.$ob$,
 $ob$a fast, famous one-plate seafood lunch; solo diners and quick stops; travellers who want the legendary set meal with no menu decisions$ob$,
 $ob$vegetarians and non-fish eaters; anyone wanting menu variety or a quiet table (it is busy and no-frills)$ob$,
 $ob$the set package only — ikan goreng (fried fish) + sup kepala ikan (fish-head soup) + rice$ob$,
 $ob$$ · set meal ~35–45K$ob$, $ob$https://warungmakbeng.id/$ob$, null),

($ob$v_nasi-bali-men-weti$ob$, $ob$nasi-bali-men-weti$ob$, $ob$Nasi Bali Men Weti$ob$, $ob$warung$ob$, $ob$sanur$ob$, $ob$Jl. Segara Ayu, Sindhu$ob$,
 $ob$A legendary Balinese nasi campur breakfast stall running since the 1970s, near the Sindhu beach access. Opens early and closes when the food runs out, usually by early afternoon.$ob$,
 $ob$early-morning authentic nasi campur Bali; a budget breakfast or brunch; travellers happy to queue for a local classic$ob$,
 $ob$late risers or dinner plans (it sells out and closes by around midday); those wanting a spacious sit-down setting$ob$,
 $ob$nasi campur Bali (rice with shredded chicken, sambal, urab vegetables, egg, fried peanuts and crispy chicken skin)$ob$,
 $ob$$ · plate ~30–40K$ob$, null, $ob$https://www.instagram.com/menweti_sanur/$ob$),

($ob$v_babi-guling-odah-sanur$ob$, $ob$babi-guling-odah-sanur$ob$, $ob$Babi Guling Odah Sanur$ob$, $ob$warung$ob$, $ob$sanur$ob$, $ob$Jl. Danau Tamblingan (near Pasar Sindhu)$ob$,
 $ob$A dedicated Balinese roast-pork warung near Pasar Sindhu offering an unusually wide babi guling range, finished with its house sambal tabia (chili, roasted shrimp paste, lime).$ob$,
 $ob$babi guling specialists and pork lovers; a quick, cheap, authentically Balinese lunch; solo diners and locals-style eating$ob$,
 $ob$vegetarians, non-pork and halal diets; travellers wanting a broad or Western menu$ob$,
 $ob$nasi babi guling (roast pork with rice); babi guling nyatnyat; babi guling kuah (in broth); kikil babi guling (trotters)$ob$,
 $ob$$ · plate ~30–55K$ob$, null, null),

($ob$v_warung-blanjong$ob$, $ob$warung-blanjong$ob$, $ob$Warung Blanjong$ob$, $ob$warung$ob$, $ob$sanur$ob$, $ob$Jl. Danau Poso, south Sanur$ob$,
 $ob$A family-run warung open around 25 years, best known locally for its nasi campur and Balinese home cooking alongside some Indonesian and Western dishes.$ob$,
 $ob$nasi campur and Balinese home cooking in a relaxed sit-down setting; mixed groups where some want Western options; travellers in south Sanur$ob$,
 $ob$purists wanting a strictly local menu with no Western items$ob$,
 $ob$nasi campur Bali; chicken satay; grilled or fresh fish (barracuda when available); Balinese daily specials$ob$,
 $ob$$$ · mains ~40–75K$ob$, $ob$https://warungblanjong.shop/$ob$, null),

($ob$v_warung-babi-guling-sanur-bypass$ob$, $ob$warung-babi-guling-sanur-bypass$ob$, $ob$Warung Babi Guling Sanur$ob$, $ob$warung$ob$, $ob$sanur$ob$, $ob$Jl. Bypass Ngurah Rai, Sanur$ob$,
 $ob$A well-known roadside Balinese babi guling warung on the Bypass, serving classic roast pork with rice and trimmings for dine-in, takeaway and delivery.$ob$,
 $ob$a fast, cheap babi guling plate; travellers passing along the Bypass; takeaway or delivery$ob$,
 $ob$vegetarians, non-pork and halal diets; those wanting a beachside or atmospheric setting$ob$,
 $ob$nasi babi guling (roast pork with rice, crackling and sides)$ob$,
 $ob$$ · plate ~30–55K$ob$, null, null),

-- ===== SEMINYAK (6) =====
($ob$v_babi-guling-pak-malen$ob$, $ob$babi-guling-pak-malen$ob$, $ob$Warung Babi Guling Pak Malen$ob$, $ob$warung$ob$, $ob$seminyak$ob$, $ob$Jl. Sunset Road$ob$,
 $ob$A long-running specialist serving essentially one thing — nasi campur babi guling (Balinese roast suckling pig with rice) — with crispy skin, pork satay and green-chili sambal. Typically sells out by early afternoon.$ob$,
 $ob$pork eaters wanting the classic Balinese babi guling plate; an early lunch; solo or quick-stop diners$ob$,
 $ob$halal and vegetarian diners (pork-only menu); late-afternoon arrivals after it sells out; anyone wanting a broad or air-conditioned setting$ob$,
 $ob$nasi campur babi guling; crispy pork skin (kulit); pork satay; lawar; pork soup$ob$,
 $ob$$ · nasi campur babi guling ~40–50K$ob$, null, $ob$https://www.instagram.com/babi_guling_pak_malen/$ob$),

($ob$v_warung-enys$ob$, $ob$warung-enys$ob$, $ob$Warung Eny's$ob$, $ob$warung$ob$, $ob$seminyak$ob$, $ob$Jl. Petitenget$ob$,
 $ob$A small family-run warung on Petitenget known for a soulful nasi campur, run by Ibu Eny and her husband with an open kitchen and mostly local produce, cooked fresh daily.$ob$,
 $ob$travellers wanting a personal, home-cooked nasi campur; couples or small groups; those curious about the open kitchen$ob$,
 $ob$large groups (very small space); diners wanting a fast in-and-out or a fixed printed menu$ob$,
 $ob$nasi campur; roast chicken; spicy pork; sautéed water spinach (kangkung); tofu and tempeh$ob$,
 $ob$$ · nasi campur ~40–70K$ob$, null, $ob$https://www.instagram.com/warung_enys/$ob$),

($ob$v_warung-murah-petitenget$ob$, $ob$warung-murah-petitenget$ob$, $ob$Warung Murah$ob$, $ob$warung$ob$, $ob$seminyak$ob$, $ob$Jl. Petitenget (near Double Six)$ob$,
 $ob$A traditional pick-and-mix Balinese warung where you point at pre-cooked dishes on the counter and pay for what you take, with nasi campur the staple. Tables fill early.$ob$,
 $ob$budget diners; a quick local lunch after Seminyak or Double Six beach; travellers who like choosing dishes by sight$ob$,
 $ob$late arrivals (best dishes go early); diners wanting table service or a set menu$ob$,
 $ob$nasi campur; beef rendang; gado-gado; corn fritters (bakwan jagung); water spinach with sambal matah$ob$,
 $ob$$ · pick-and-mix plates ~30–50K$ob$, null, null),

($ob$v_waroeng-sulawesi-petitenget$ob$, $ob$waroeng-sulawesi-petitenget$ob$, $ob$Waroeng Sulawesi$ob$, $ob$warung$ob$, $ob$seminyak$ob$, $ob$Jl. Petitenget, Kerobokan Kelod$ob$,
 $ob$A self-service warung on Petitenget serving home-cooked Sulawesi and Indonesian dishes — walk the counter and build a plate with white, yellow or red rice. Known for spicy regional plates.$ob$,
 $ob$adventurous eaters wanting spicy regional (Sulawesi) cooking; a budget lunch; solo diners and self-serve fans$ob$,
 $ob$diners who dislike heat and spice; anyone wanting full table service or a polished room$ob$,
 $ob$ayam woku (spicy chicken); ikan cakalang (skipjack tuna); nasi campur; chicken curry; yellow or red rice$ob$,
 $ob$$ · budget, pay-by-selection plates$ob$, null, null),

($ob$v_warung-taman-bambu$ob$, $ob$warung-taman-bambu$ob$, $ob$Warung Taman Bambu$ob$, $ob$warung$ob$, $ob$seminyak$ob$, $ob$Jl. Plawa$ob$,
 $ob$A tucked-away pick-and-mix warung off the main road where you choose dishes from a cabinet, with nasi campur and Indonesian home-cooking the core, in a calmer garden-style setting.$ob$,
 $ob$a budget lunch away from the crowds; vegetarians (multiple veg options at the counter); couples or small groups wanting a quiet local meal$ob$,
 $ob$diners wanting evening or late service (closes early evening); anyone expecting à-la-carte table ordering$ob$,
 $ob$nasi campur; mixed vegetable dishes; chicken; fish; tempeh and tofu sides$ob$,
 $ob$$ · budget, pay-by-selection plates$ob$, null, null),

($ob$v_warung-melati-nakula$ob$, $ob$warung-melati-nakula$ob$, $ob$Warung Melati$ob$, $ob$warung$ob$, $ob$seminyak$ob$, $ob$Jl. Nakula (Seminyak–Legian border)$ob$,
 $ob$A family-run Javanese warung in a quiet alley on the Seminyak–Legian border, cooking from early morning so nasi campur and sides are ready by late morning. Advertised as non-MSG and halal.$ob$,
 $ob$halal diners; a midday lunch (best around 12–1pm); travellers wanting simple home-style Javanese food$ob$,
 $ob$late-night diners (kitchen winds down by early evening); anyone specifically after Balinese pork dishes (halal, no pork)$ob$,
 $ob$nasi campur; tempe manis (sweet tempeh); sayur urap; ayam; tofu and tempeh sides$ob$,
 $ob$$ · nasi campur ~35–60K$ob$, null, null),

-- ===== NUSA DUA (5) =====
($ob$v_warung-nasi-ayam-bu-oki$ob$, $ob$warung-nasi-ayam-bu-oki$ob$, $ob$Warung Nasi Ayam Bu Oki$ob$, $ob$warung$ob$, $ob$nusa-dua$ob$, $ob$Bualu (Jl. Siligita)$ob$,
 $ob$A busy local nasi campur warung opposite Hotel Santika Siligita, serving Balinese mixed-rice plates built around chicken. One of the go-to cheap Balinese meals inside the Nusa Dua/Bualu area.$ob$,
 $ob$a cheap authentic Balinese breakfast or lunch; solo travellers and families staying in Nusa Dua who want local food near the resorts; those who like a spice option$ob$,
 $ob$diners wanting a quiet sit-down restaurant or full dinner service; anyone avoiding chicken (menu is chicken-centred)$ob$,
 $ob$nasi campur ayam (ayam betutu, sate lilit, ayam suwir, sayur urab, telur pindang); nasi campur pedas; ayam betutu; sate lilit; soto ayam$ob$,
 $ob$$ · plates ~15–35K$ob$, $ob$https://nasiayamibuoki.com/$ob$, $ob$https://www.instagram.com/warungibuoki_bali/$ob$),

($ob$v_nasi-banjar-mbok-mang$ob$, $ob$nasi-banjar-mbok-mang$ob$, $ob$Nasi Banjar Mbok Mang$ob$, $ob$warung$ob$, $ob$nusa-dua$ob$, $ob$Bualu (Jl. Kurusetra)$ob$,
 $ob$A pork-forward Balinese nasi campur warung in Bualu village serving a banjar-style mixed-rice plate. Opens mornings only and frequently sells out within a few hours.$ob$,
 $ob$early risers wanting an authentic pork-based Balinese breakfast or lunch; travellers eating pork (lawar, tum, urutan); those wanting a genuinely local, non-touristy warung near Nusa Dua$ob$,
 $ob$halal diners and non-pork eaters (menu is largely pork); late risers or dinner plans (morning-only, sells out early)$ob$,
 $ob$nasi campur with lawar babi; tum babi; urutan (Balinese pork sausage); samcan goreng; sambal matah$ob$,
 $ob$$ · plate ~25K, varies with lauk$ob$, null, $ob$https://www.instagram.com/nasibanjar.mbokmang/$ob$),

($ob$v_warung-batan-bekul$ob$, $ob$warung-batan-bekul$ob$, $ob$Warung Batan Bekul$ob$, $ob$warung$ob$, $ob$nusa-dua$ob$, $ob$Tanjung Benoa (Jl. Taman Sari)$ob$,
 $ob$A hidden seafood warung down a lane off Jl. Taman Sari in Tanjung Benoa, grilling fish bought fresh from fishermen each morning. Opens midday only and commonly sells out by early afternoon.$ob$,
 $ob$seafood lovers wanting fresh, Balinese-spiced grilled fish at local prices; travellers willing to reserve ahead and arrive early; those seeking a hidden, non-touristy spot$ob$,
 $ob$walk-in or spontaneous diners (reservation advised, limited daily stock); anyone wanting an evening meal (closes mid-afternoon); non-seafood eaters$ob$,
 $ob$ikan bakar (grilled fish); udang bakar (grilled prawns); kerang bakar (grilled clams); kepiting kuah (crab in broth); pepes ikan$ob$,
 $ob$$$ · fresh seafood, market/by-weight pricing$ob$, null, $ob$https://www.instagram.com/batanbekultb/$ob$),

($ob$v_warung-halme-ikan-bakar-ala-jimbaran$ob$, $ob$warung-halme-ikan-bakar-ala-jimbaran$ob$, $ob$Warung Hal-Me Ikan Bakar ala Jimbaran$ob$, $ob$warung$ob$, $ob$nusa-dua$ob$, $ob$Benoa (Jl. Raya Nusa Dua Selatan)$ob$,
 $ob$A casual grilled-seafood warung serving Jimbaran-style ikan bakar without heading to Jimbaran itself, at prices cheaper than the Jimbaran beach seafood strip.$ob$,
 $ob$travellers wanting Jimbaran-style grilled seafood close to Nusa Dua/Benoa; groups sharing fish and prawns; lunch or dinner (open into the evening)$ob$,
 $ob$diners after a fine-dining or beachfront setting (it is a simple, no-frills warung); non-seafood eaters$ob$,
 $ob$ikan bakar (grilled fish); grilled king prawns; grilled lobster; mussels; with Jimbaran-style sambal$ob$,
 $ob$$$ · grilled seafood, cheaper than Jimbaran beach venues$ob$, null, $ob$https://www.instagram.com/warunghalmeikanbakar/$ob$),

($ob$v_kenja-ikan-bakar-nusa-dua$ob$, $ob$kenja-ikan-bakar-nusa-dua$ob$, $ob$Kenja Ikan Bakar & Seafood$ob$, $ob$restaurant$ob$, $ob$nusa-dua$ob$, $ob$Nusa Dua (Jl. Pantai Mengiat)$ob$,
 $ob$A sit-down Indonesian grilled-seafood restaurant on Jl. Pantai Mengiat, walkable from the Nusa Dua beach/ITDC area, specialising in ikan bakar and other grilled fish and shellfish, with evening live music.$ob$,
 $ob$dinner with grilled fish and seafood near Nusa Dua beach; travellers wanting a comfortable seated seafood meal without going to Jimbaran; those who like live music in the evening$ob$,
 $ob$budget travellers after hole-in-the-wall warung prices (this is a fuller-service seafood restaurant)$ob$,
 $ob$grilled red snapper; grilled grouper; king prawns; grilled or steamed lobster; fried seafood platter$ob$,
 $ob$$$–$$$ · grilled fish & seafood mains$ob$, $ob$https://kenjaikanbakar.com/$ob$, null)
on conflict (slug) do update set
  name          = excluded.name,
  category      = excluded.category,
  district      = excluded.district,
  area          = excluded.area,
  why_its_here  = excluded.why_its_here,
  best_for      = excluded.best_for,
  not_for       = excluded.not_for,
  what_to_order = excluded.what_to_order,
  price_anchor  = excluded.price_anchor,
  official_url  = excluded.official_url,
  instagram_url = excluded.instagram_url;
