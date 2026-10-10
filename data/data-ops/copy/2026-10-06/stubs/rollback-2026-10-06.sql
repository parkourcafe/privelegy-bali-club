-- copy-stubs-2026-10-06: rollback. Restores both stubs where both columns are still NULL; UPDATE 0 means the card was edited since and must be looked at by hand.
-- 1. amber-resto-seminyak
update venues set why_its_here = 'Amber Resto Seminyak is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'amber-resto-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 2. amok-sunset-restaurant-and-bar
update venues set why_its_here = 'Amok Sunset Restaurant & Bar is an owner-confirmed dining venue in Nusa Penida.', best_for = 'Travellers looking for a verified place to eat in Nusa Penida.' where slug = 'amok-sunset-restaurant-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 3. aribar-tapas-cantina
update venues set why_its_here = 'Aribar Tapas Cantina is an owner-confirmed dining venue in Kuta.', best_for = 'Travellers looking for a verified place to eat in Kuta.' where slug = 'aribar-tapas-cantina' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 4. arunika-restaurant-by-the-meru-sanur
update venues set why_its_here = 'Arunika Restaurant by The Meru Sanur is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'arunika-restaurant-by-the-meru-sanur' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 5. arya-arkananta-resort-and-spa
update venues set why_its_here = 'Arya Arkananta Resort & Spa is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'arya-arkananta-resort-and-spa' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 6. avocuts-coffee-and-eatery
update venues set why_its_here = 'Avocuts Coffee & Eatery is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'avocuts-coffee-and-eatery' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 7. big-fish-grill
update venues set why_its_here = 'Big Fish Grill is an owner-confirmed dining venue in Kuta; Legian.', best_for = 'Travellers looking for a verified place to eat in Kuta; Legian.' where slug = 'big-fish-grill' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 8. blue-mountains-bali
update venues set why_its_here = 'Blue Mountains Bali is an owner-confirmed dining venue in Unknown.', best_for = 'Travellers looking for a verified place to eat in Unknown.' where slug = 'blue-mountains-bali' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 9. boardwalk-restaurant-bali
update venues set why_its_here = 'Boardwalk Restaurant Bali is an owner-confirmed dining venue in Kuta.', best_for = 'Travellers looking for a verified place to eat in Kuta.' where slug = 'boardwalk-restaurant-bali' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 10. bulan-madu-restaurant-at-amora-ubud-boutique-villas
update venues set why_its_here = 'Bulan Madu Restaurant at Amora Ubud Boutique Villas is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'bulan-madu-restaurant-at-amora-ubud-boutique-villas' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 11. burma-noodles-and-curry
update venues set why_its_here = 'Burma Noodles & Curry is an owner-confirmed dining venue in Nusa Dua.', best_for = 'Travellers looking for a verified place to eat in Nusa Dua.' where slug = 'burma-noodles-and-curry' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 12. cafe-lotus
update venues set why_its_here = 'Cafe Lotus is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'cafe-lotus' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 13. casa-bambu-cantina
update venues set why_its_here = U&'Casa Bamb\00F9 Cantina is an owner-confirmed dining venue in Unknown.', best_for = 'Travellers looking for a verified place to eat in Unknown.' where slug = 'casa-bambu-cantina' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 14. casa-blanca-bali
update venues set why_its_here = 'Casa Blanca Bali is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'casa-blanca-bali' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 15. casadia-restaurant-and-bar
update venues set why_its_here = 'Casadia Restaurant & Bar is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'casadia-restaurant-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 16. cherry-pepper-ubud
update venues set why_its_here = 'Cherry Pepper Ubud is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'cherry-pepper-ubud' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 17. cliff-at-canna
update venues set why_its_here = 'Cliff at CANNA is an owner-confirmed dining venue in Nusa Dua.', best_for = 'Travellers looking for a verified place to eat in Nusa Dua.' where slug = 'cliff-at-canna' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 18. cocoon-seminyak
update venues set why_its_here = 'Cocoon Seminyak is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'cocoon-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 19. costa-beach-restaurant
update venues set why_its_here = 'COSTA - Beach Restaurant Sanur is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'costa-beach-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 20. daily-social
update venues set why_its_here = 'Daily Social is an owner-confirmed dining venue in Kuta.', best_for = 'Travellers looking for a verified place to eat in Kuta.' where slug = 'daily-social' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 21. deeva-restaurant-at-the-udaya
update venues set why_its_here = 'Deeva Restaurant at The Udaya is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'deeva-restaurant-at-the-udaya' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 22. desa-swan-villas-and-spa-keramas
update venues set why_its_here = 'Desa Swan Villas & SPA, Keramas is an owner-confirmed dining venue in Gianyar.', best_for = 'Travellers looking for a verified place to eat in Gianyar.' where slug = 'desa-swan-villas-and-spa-keramas' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 23. di-mare-restaurant-karma-kandara
update venues set why_its_here = 'di Mare Restaurant - Karma Kandara is an owner-confirmed dining venue in Uluwatu.', best_for = 'Travellers looking for a verified place to eat in Uluwatu.' where slug = 'di-mare-restaurant-karma-kandara' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 24. dice-at-the-craft-hotel
update venues set why_its_here = 'Dice at The Craft Hotel is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'dice-at-the-craft-hotel' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 25. dining-corner-restaurant
update venues set why_its_here = 'Dining Corner Restaurant is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'dining-corner-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 26. ely-s-kitchen-ubud
update venues set why_its_here = 'Ely''s Kitchen Ubud is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'ely-s-kitchen-ubud' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 27. enchante
update venues set why_its_here = 'Enchante is an owner-confirmed dining venue in Uluwatu.', best_for = 'Travellers looking for a verified place to eat in Uluwatu.' where slug = 'enchante' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 28. envy-restaurant
update venues set why_its_here = 'ENVY Restaurant is an owner-confirmed dining venue in Kuta.', best_for = 'Travellers looking for a verified place to eat in Kuta.' where slug = 'envy-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 29. fermeto-ubud-restaurant
update venues set why_its_here = 'Fermeto Ubud Restaurant is an owner-confirmed dining venue in Ubud; Gianyar.', best_for = 'Travellers looking for a verified place to eat in Ubud; Gianyar.' where slug = 'fermeto-ubud-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 30. ferro-grill-restaurant-and-bar
update venues set why_its_here = 'FERRO Grill Restaurant & Bar is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'ferro-grill-restaurant-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 31. flame-bar-and-grill-ubud
update venues set why_its_here = 'Flame Bar & Grill Ubud is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'flame-bar-and-grill-ubud' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 32. flamingo-beach-club-bali
update venues set why_its_here = 'Flamingo Beach Club Bali is an owner-confirmed dining venue in Gianyar.', best_for = 'Travellers looking for a verified place to eat in Gianyar.' where slug = 'flamingo-beach-club-bali' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 33. fu-house-seminyak
update venues set why_its_here = 'Fu House | Seminyak is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'fu-house-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 34. honey-and-smoke
update venues set why_its_here = 'Honey & Smoke is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'honey-and-smoke' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 35. huge-restaurant
update venues set why_its_here = 'Huge Restaurant is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'huge-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 36. infinity-beach-club
update venues set why_its_here = 'Infinity Beach Club is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'infinity-beach-club' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 37. isaya-teppanyaki-boutique-seminyak
update venues set why_its_here = 'Isaya Teppanyaki Boutique Seminyak is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'isaya-teppanyaki-boutique-seminyak' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 38. jaansan-beach-house-restaurant-bar-and-lounge-at-kelan-beach
update venues set why_its_here = 'Jaansan Beach House | Restaurant, Bar & Lounge at Kelan Beach is an owner-confirmed dining venue in Jimbaran.', best_for = 'Travellers looking for a verified place to eat in Jimbaran.' where slug = 'jaansan-beach-house-restaurant-bar-and-lounge-at-kelan-beach' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 39. jackson-lily-s-by-ginger-moon
update venues set why_its_here = 'Jackson Lily''s by Ginger Moon is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'jackson-lily-s-by-ginger-moon' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 40. jingga-restaurant-at-bumi-kinar
update venues set why_its_here = 'Jingga Restaurant at Bumi Kinar is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'jingga-restaurant-at-bumi-kinar' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 41. kabar-grill
update venues set why_its_here = 'KaBar Grill is an owner-confirmed dining venue in Kuta.', best_for = 'Travellers looking for a verified place to eat in Kuta.' where slug = 'kabar-grill' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 42. kayumanis-seaside-restaurant-sanur
update venues set why_its_here = 'Kayumanis Seaside Restaurant Sanur is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'kayumanis-seaside-restaurant-sanur' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 43. kepitu-restaurant-by-the-kayon-resort
update venues set why_its_here = 'Kepitu Restaurant by The Kayon Resort is an owner-confirmed dining venue in Ubud; Gianyar.', best_for = 'Travellers looking for a verified place to eat in Ubud; Gianyar.' where slug = 'kepitu-restaurant-by-the-kayon-resort' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 44. kepitu-restaurant-by-the-kayon-valley-resort
update venues set why_its_here = 'Kepitu Restaurant by The Kayon Valley Resort is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'kepitu-restaurant-by-the-kayon-valley-resort' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 45. kimukatsu-icon-bali
update venues set why_its_here = 'Kimukatsu Icon Bali is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'kimukatsu-icon-bali' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 46. kokoon-uluwatu-at-vanara-resort-and-spa
update venues set why_its_here = 'Kokoon Uluwatu at VANARA Resort & Spa is an owner-confirmed dining venue in Uluwatu.', best_for = 'Travellers looking for a verified place to eat in Uluwatu.' where slug = 'kokoon-uluwatu-at-vanara-resort-and-spa' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 47. kukusan-bali-restaurant-at-the-artini-dijiwa-ubud
update venues set why_its_here = 'Kukusan Bali Restaurant at The Artini Dijiwa Ubud is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'kukusan-bali-restaurant-at-the-artini-dijiwa-ubud' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 48. la-favela-bali
update venues set why_its_here = 'La Favela Bali is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'la-favela-bali' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 49. la-santa-rosa
update venues set why_its_here = 'La Santa Rosa is an owner-confirmed dining venue in Jimbaran.', best_for = 'Travellers looking for a verified place to eat in Jimbaran.' where slug = 'la-santa-rosa' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 50. lava-gastrobar-grill
update venues set why_its_here = 'Lava Gastrobar & Grill is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'lava-gastrobar-grill' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 51. luca-bali-sanur
update venues set why_its_here = 'Luca Bali is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'luca-bali-sanur' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 52. malverde-tequileria-and-nightclub
update venues set why_its_here = 'Malverde Tequileria & Nightclub is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'malverde-tequileria-and-nightclub' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 53. mase-kitchen-and-bar
update venues set why_its_here = 'Mase Kitchen & Bar is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'mase-kitchen-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 54. mensa-asian-bistro-and-bar
update venues set why_its_here = 'Mensa Asian Bistro and Bar is an owner-confirmed dining venue in Uluwatu.', best_for = 'Travellers looking for a verified place to eat in Uluwatu.' where slug = 'mensa-asian-bistro-and-bar' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 55. momo-bar-at-the-courtyard-by-marriott-bali-nusa-dua
update venues set why_its_here = 'MoMo Bar at The Courtyard by Marriott Bali Nusa Dua is an owner-confirmed dining venue in Nusa Dua.', best_for = 'Travellers looking for a verified place to eat in Nusa Dua.' where slug = 'momo-bar-at-the-courtyard-by-marriott-bali-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 56. moonstone-beach-lounge
update venues set why_its_here = 'Moonstone Beach Lounge is an owner-confirmed dining venue in Gianyar.', best_for = 'Travellers looking for a verified place to eat in Gianyar.' where slug = 'moonstone-beach-lounge' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 57. mozza-sanur
update venues set why_its_here = 'Mozza Sanur is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'mozza-sanur' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 58. natti-s-indian-specialty-restaurant-ubud
update venues set why_its_here = 'Natti''s Indian Specialty Restaurant Ubud is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'natti-s-indian-specialty-restaurant-ubud' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 59. natys-restaurant-jimbaran
update venues set why_its_here = 'Natys Restaurant Jimbaran is an owner-confirmed dining venue in Uluwatu; Jimbaran.', best_for = 'Travellers looking for a verified place to eat in Uluwatu; Jimbaran.' where slug = 'natys-restaurant-jimbaran' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 60. noaa-asian-bistro
update venues set why_its_here = 'NOAA Asian Bistro is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'noaa-asian-bistro' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 61. ocean-terrace-restaurant-at-legian-beach-hotel
update venues set why_its_here = 'Ocean Terrace Restaurant at Legian Beach Hotel is an owner-confirmed dining venue in Kuta; Legian.', best_for = 'Travellers looking for a verified place to eat in Kuta; Legian.' where slug = 'ocean-terrace-restaurant-at-legian-beach-hotel' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 62. pasir-restaurant-ubud
update venues set why_its_here = 'PASIR Restaurant Ubud is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'pasir-restaurant-ubud' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 63. rosso-vivo-dine-and-lounge
update venues set why_its_here = 'Rosso Vivo Dine & Lounge is an owner-confirmed dining venue in Kuta.', best_for = 'Travellers looking for a verified place to eat in Kuta.' where slug = 'rosso-vivo-dine-and-lounge' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 64. sacred-rice-restaurant
update venues set why_its_here = 'SACRED RICE Restaurant is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'sacred-rice-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 65. saltlick
update venues set why_its_here = 'Saltlick is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'saltlick' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 66. sana-uluwatu
update venues set why_its_here = 'Sana Uluwatu is an owner-confirmed dining venue in Uluwatu.', best_for = 'Travellers looking for a verified place to eat in Uluwatu.' where slug = 'sana-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 67. sapa-seafood-and-grill-nusa-dua
update venues set why_its_here = 'Sapa Seafood & Grill - Nusa Dua is an owner-confirmed dining venue in Nusa Dua.', best_for = 'Travellers looking for a verified place to eat in Nusa Dua.' where slug = 'sapa-seafood-and-grill-nusa-dua' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 68. satoshi
update venues set why_its_here = 'Satoshi is an owner-confirmed dining venue in Kerobokan.', best_for = 'Travellers looking for a verified place to eat in Kerobokan.' where slug = 'satoshi' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 69. sayan-valley
update venues set why_its_here = 'Sayan Valley is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'sayan-valley' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 70. semara-grill-at-inara-alas-harum
update venues set why_its_here = 'Semara Grill at Inara Alas Harum is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'semara-grill-at-inara-alas-harum' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 71. seres-springs-resort-and-spa-singakerta-ubud
update venues set why_its_here = 'SereS Springs Resort & Spa Singakerta, Ubud is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'seres-springs-resort-and-spa-singakerta-ubud' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 72. shinraku-teppanyaki
update venues set why_its_here = 'Shinraku Teppanyaki is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'shinraku-teppanyaki' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 73. shooters-bali
update venues set why_its_here = 'Shooters Bali is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'shooters-bali' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 74. spice-by-blake
update venues set why_its_here = 'Spice by Blake is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'spice-by-blake' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 75. sumitra-luxury-villas-and-resort-by-pramana
update venues set why_its_here = 'Sumitra Luxury Villas & Resort by Pramana is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'sumitra-luxury-villas-and-resort-by-pramana' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 76. sunset-bloom-restaurant-at-swan-paradise-a-pramana-experience
update venues set why_its_here = 'Sunset Bloom Restaurant at Swan Paradise A Pramana Experience is an owner-confirmed dining venue in Gianyar.', best_for = 'Travellers looking for a verified place to eat in Gianyar.' where slug = 'sunset-bloom-restaurant-at-swan-paradise-a-pramana-experience' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 77. tacos-aqui-uluwatu
update venues set why_its_here = 'Tacos Aqui Uluwatu is an owner-confirmed dining venue in Uluwatu.', best_for = 'Travellers looking for a verified place to eat in Uluwatu.' where slug = 'tacos-aqui-uluwatu' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 78. tarabelle
update venues set why_its_here = 'Tarabelle is an owner-confirmed dining venue in Uluwatu.', best_for = 'Travellers looking for a verified place to eat in Uluwatu.' where slug = 'tarabelle' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 79. temple-by-ginger-moon
update venues set why_its_here = 'Temple by Ginger Moon is an owner-confirmed dining venue in Kuta.', best_for = 'Travellers looking for a verified place to eat in Kuta.' where slug = 'temple-by-ginger-moon' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 80. tenji-sushi
update venues set why_its_here = 'Tenji Sushi is an owner-confirmed dining venue in Nusa Dua.', best_for = 'Travellers looking for a verified place to eat in Nusa Dua.' where slug = 'tenji-sushi' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 81. the-1o1-bali-oasis-sanur
update venues set why_its_here = 'THE 1O1 Bali Oasis Sanur is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'the-1o1-bali-oasis-sanur' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 82. the-bandha-hotel-and-suites
update venues set why_its_here = 'The Bandha Hotel & Suites is an owner-confirmed dining venue in Legian.', best_for = 'Travellers looking for a verified place to eat in Legian.' where slug = 'the-bandha-hotel-and-suites' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 83. the-butchers-club-steakhouse
update venues set why_its_here = 'The Butchers Club Steakhouse is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'the-butchers-club-steakhouse' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 84. the-cepaka-bistro-bali
update venues set why_its_here = 'The Cepaka Bistro Bali is an owner-confirmed dining venue in Gianyar.', best_for = 'Travellers looking for a verified place to eat in Gianyar.' where slug = 'the-cepaka-bistro-bali' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 85. the-grumpy-butcher
update venues set why_its_here = 'The Grumpy Butcher is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'the-grumpy-butcher' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 86. the-island-grill-and-lounge
update venues set why_its_here = 'The Island Grill & Lounge is an owner-confirmed dining venue in Seminyak.', best_for = 'Travellers looking for a verified place to eat in Seminyak.' where slug = 'the-island-grill-and-lounge' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 87. the-naked-tiger
update venues set why_its_here = 'THE NAKED TIGER is an owner-confirmed dining venue in Kuta.', best_for = 'Travellers looking for a verified place to eat in Kuta.' where slug = 'the-naked-tiger' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 88. the-sankara-suites-and-villas
update venues set why_its_here = 'The Sankara Suites & Villas is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'the-sankara-suites-and-villas' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 89. the-sayan-house-restaurant-ubud
update venues set why_its_here = 'The Sayan House Restaurant Ubud is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'the-sayan-house-restaurant-ubud' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 90. the-tempayan-at-tanah-gajah-a-resort-by-hadiprana
update venues set why_its_here = 'The Tempayan at Tanah Gajah, a Resort by Hadiprana is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'the-tempayan-at-tanah-gajah-a-resort-by-hadiprana' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 91. the-village-cucina-italiana
update venues set why_its_here = 'The Village Cucina Italiana is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'the-village-cucina-italiana' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 92. three-elements-restaurant
update venues set why_its_here = 'Three Elements Restaurant is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'three-elements-restaurant' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 93. tree-bar-at-maya-sanur-resort-and-spa
update venues set why_its_here = 'Tree Bar at Maya Sanur Resort & Spa is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'tree-bar-at-maya-sanur-resort-and-spa' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 94. tree-bar-at-maya-ubud
update venues set why_its_here = 'Tree Bar at Maya Ubud is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'tree-bar-at-maya-ubud' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 95. tsune-japanese-restaurant-bali-by-wonderspace
update venues set why_its_here = 'Tsune Japanese Restaurant Bali by Wonderspace is an owner-confirmed dining venue in Sanur.', best_for = 'Travellers looking for a verified place to eat in Sanur.' where slug = 'tsune-japanese-restaurant-bali-by-wonderspace' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 96. uma-cucina
update venues set why_its_here = 'Uma Cucina is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'uma-cucina' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 97. wanna-jungle-pool-and-bar-at-the-kayon-jungle-resort
update venues set why_its_here = 'Wanna Jungle Pool and Bar at The Kayon Jungle Resort is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'wanna-jungle-pool-and-bar-at-the-kayon-jungle-resort' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 98. warung-damar
update venues set why_its_here = 'Warung Damar is an owner-confirmed dining venue in Kuta.', best_for = 'Travellers looking for a verified place to eat in Kuta.' where slug = 'warung-damar' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 99. wet-plate-kitchen
update venues set why_its_here = 'Wet Plate Kitchen is an owner-confirmed dining venue in Uluwatu.', best_for = 'Travellers looking for a verified place to eat in Uluwatu.' where slug = 'wet-plate-kitchen' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 100. whisper-cove-bar-ubud
update venues set why_its_here = 'Whisper Cove Bar Ubud is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'whisper-cove-bar-ubud' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
-- 101. wild-ginger-restaurant-at-nandini-jungle-by-hanging-gardens
update venues set why_its_here = 'Wild Ginger Restaurant at Nandini Jungle by Hanging Gardens is an owner-confirmed dining venue in Ubud.', best_for = 'Travellers looking for a verified place to eat in Ubud.' where slug = 'wild-ginger-restaurant-at-nandini-jungle-by-hanging-gardens' and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;
