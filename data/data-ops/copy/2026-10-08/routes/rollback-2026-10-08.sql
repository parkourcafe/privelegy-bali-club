-- routes 2026-10-08 rollback
update routes set subtitle = 'Land, settle, eat well' where slug = 'first-day' and md5(subtitle) = 'f191abaa94573b7981b4780ab873f992';
update routes set subtitle = 'Good wifi, good coffee' where slug = 'cafe-work' and md5(subtitle) = 'f68abee2b78893c75d8124c97990b640';
update routes set subtitle = 'Golden hour to nightcap' where slug = 'sunset-run' and md5(subtitle) = '9690df10b858d823b888a201d4e3a799';
update routes set subtitle = 'Holy spring, waterfall, crispy duck' where slug = 'ubud-culture-day' and md5(subtitle) = 'f630e54108cd5ecc1e864089053b2c21';
update routes set subtitle = 'State temple, then Bali''s tidiest village' where slug = 'bangli-temple-village-day' and md5(subtitle) = '3536c1ca1f391bbf04eb32e96f299e48';
update routes set subtitle = 'Bali''s holiest temple, then a Bali Aga weaving village' where slug = 'east-bali-heritage-day' and md5(subtitle) = '0bbc1e479f672527e8752097f402935b';
update routes set subtitle = 'A low-friction Canggu food day: brunch, local/casual lunch, then dinner nearby.' where slug = 'canggu-food-route' and md5(subtitle) = 'dd7e5fa43f6ee7f253dfefff76e90114';
update routes set subtitle = U&'Covered caf\00E9s, reset stops and an easy dinner when the weather turns.' where slug = 'canggu-rainy-day' and md5(subtitle) = 'a95cc12a36257ac9686aeef9aa9ebec9';
update route_stops set note = 'Start at the holy spring for melukat -- go early, before the tour buses.' where route_slug = 'ubud-culture-day' and venue_slug = 'tirta-empul' and rank = 10 and md5(note) = 'e6a2a4aa6a159dbce235b09b99c7d28b';
update route_stops set note = 'An easy waterfall stop on the way into Ubud -- no trek required.' where route_slug = 'ubud-culture-day' and venue_slug = 'air-terjun-tegenungan' and rank = 20 and md5(note) = 'db45d3d8c766bd07563b4e3d3547d8d9';
update route_stops set note = 'Lunch: the Ubud restaurant that popularised Balinese crispy duck.' where route_slug = 'ubud-culture-day' and venue_slug = 'bebek-bengil' and rank = 30 and md5(note) = '38e555bb88bb3cc7ef10f80cd6da4625';
update route_stops set note = 'Bangli''s state temple -- a quieter start away from the south-Bali circuit.' where route_slug = 'bangli-temple-village-day' and venue_slug = 'pura-kehen' and rank = 10 and md5(note) = '11f8c5873e7c03c37f5ec5485284db9f';
update route_stops set note = 'A short drive on: the bamboo-roofed, car-free village.' where route_slug = 'bangli-temple-village-day' and venue_slug = 'desa-wisata-penglipuran' and rank = 20 and md5(note) = '331327b997156f075f60d87fcd3b86be';
update route_stops set note = 'Start at Bali''s largest temple complex -- go early for the managed route up to the gate.' where route_slug = 'east-bali-heritage-day' and venue_slug = 'desa-wisata-besakih' and rank = 10 and md5(note) = '5177d4ea1053035be379dae048b82f80';
update route_stops set note = 'Head on toward the coast: a Bali Aga village known for double-ikat weaving.' where route_slug = 'east-bali-heritage-day' and venue_slug = 'desa-wisata-tenganan' and rank = 20 and md5(note) = 'fec826dd38a24a8a335e57ab6451ab02';
