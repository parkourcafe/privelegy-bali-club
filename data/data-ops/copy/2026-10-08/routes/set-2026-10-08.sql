-- routes 2026-10-08: 15 statement(s); each must change exactly 1 row.
do $apply$
declare n int;
begin
  update routes set subtitle = 'Land, settle in and eat well' where slug = 'first-day' and md5(subtitle) = '02112f824bb93865e3135a92c6cfd476';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes first-day subtitle: expected 1 row, got %', n; end if;
  update routes set subtitle = 'Coffee and wifi for a working day' where slug = 'cafe-work' and md5(subtitle) = 'eb8c3454ee53295c81d8178ae9742e7a';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes cafe-work subtitle: expected 1 row, got %', n; end if;
  update routes set subtitle = 'From golden hour to a nightcap' where slug = 'sunset-run' and md5(subtitle) = '224c98c41b1fc265012537384cb5f2e5';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes sunset-run subtitle: expected 1 row, got %', n; end if;
  update routes set subtitle = 'A holy spring and a waterfall, then crispy duck' where slug = 'ubud-culture-day' and md5(subtitle) = 'cd5d1d052a4f20c19de8779274c88839';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes ubud-culture-day subtitle: expected 1 row, got %', n; end if;
  update routes set subtitle = 'Bangli''s state temple, then the village' where slug = 'bangli-temple-village-day' and md5(subtitle) = 'd3b41239e54e659907ed8b0e5b10bb45';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes bangli-temple-village-day subtitle: expected 1 row, got %', n; end if;
  update routes set subtitle = 'A temple, then a Bali Aga weaving village' where slug = 'east-bali-heritage-day' and md5(subtitle) = 'f008bbf71ceca5f0a397c4a6d639876b';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes east-bali-heritage-day subtitle: expected 1 row, got %', n; end if;
  update routes set subtitle = 'A food day in Canggu: brunch, a local or casual lunch, then dinner nearby.' where slug = 'canggu-food-route' and md5(subtitle) = 'f9743e8c0a4993da897ca2a692954036';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes canggu-food-route subtitle: expected 1 row, got %', n; end if;
  update routes set subtitle = U&'Covered caf\00E9s, somewhere to reset and an easy dinner when the weather turns.' where slug = 'canggu-rainy-day' and md5(subtitle) = '4b6f85f443380e78e5d03b37ebeb2b33';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes canggu-rainy-day subtitle: expected 1 row, got %', n; end if;
  update route_stops set note = 'Start at the holy spring for melukat. Go early, before the tour buses.' where route_slug = 'ubud-culture-day' and venue_slug = 'tirta-empul' and rank = 10 and md5(note) = '510569a9178bc76bcbf1275de3e29a93';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes ubud-culture-day/tirta-empul#10 note: expected 1 row, got %', n; end if;
  update route_stops set note = 'An easy waterfall stop on the way into Ubud, with no trek required.' where route_slug = 'ubud-culture-day' and venue_slug = 'air-terjun-tegenungan' and rank = 20 and md5(note) = '2ff4e7b93057a2cf9995836cfaf78e57';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes ubud-culture-day/air-terjun-tegenungan#20 note: expected 1 row, got %', n; end if;
  update route_stops set note = 'Balinese crispy duck for lunch in Ubud.' where route_slug = 'ubud-culture-day' and venue_slug = 'bebek-bengil' and rank = 30 and md5(note) = '1bb77dbb47ba20bfdce7a462ad78b5b5';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes ubud-culture-day/bebek-bengil#30 note: expected 1 row, got %', n; end if;
  update route_stops set note = 'Bangli''s state temple makes a quieter start, away from the south-Bali circuit.' where route_slug = 'bangli-temple-village-day' and venue_slug = 'pura-kehen' and rank = 10 and md5(note) = 'c07fa8ee8bf5c2192c9253ea4560c462';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes bangli-temple-village-day/pura-kehen#10 note: expected 1 row, got %', n; end if;
  update route_stops set note = 'Drive a short way on to the bamboo-roofed, car-free village.' where route_slug = 'bangli-temple-village-day' and venue_slug = 'desa-wisata-penglipuran' and rank = 20 and md5(note) = '1ccb38ca2d20d71e8da6bec91d5ab805';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes bangli-temple-village-day/desa-wisata-penglipuran#20 note: expected 1 row, got %', n; end if;
  update route_stops set note = 'Start at the temple complex. Go early for the managed route up to the gate.' where route_slug = 'east-bali-heritage-day' and venue_slug = 'desa-wisata-besakih' and rank = 10 and md5(note) = '932df95e626563fa34ecf2ab575699fb';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes east-bali-heritage-day/desa-wisata-besakih#10 note: expected 1 row, got %', n; end if;
  update route_stops set note = 'Head on toward the coast, to a Bali Aga village known for double-ikat weaving.' where route_slug = 'east-bali-heritage-day' and venue_slug = 'desa-wisata-tenganan' and rank = 20 and md5(note) = 'ff53605f3b23dbb5e97c6e9cf9c81884';
  get diagnostics n = row_count; if n <> 1 then raise exception 'routes east-bali-heritage-day/desa-wisata-tenganan#20 note: expected 1 row, got %', n; end if;
end $apply$;
