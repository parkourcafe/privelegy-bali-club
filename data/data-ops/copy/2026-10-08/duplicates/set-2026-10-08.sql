-- duplicates 2026-10-08: 20 duplicate cards go from published to review (founder decision 2026-10-08).
do $apply$
declare n int;
begin
  update venues set publication_status = 'review' where slug in ('soham-wellness-spa-seminyak', 'soham-yoga-seminyak', 'soham-pilates-class-program-seminyak', 'prana-yoga-seminyak', 'prana-spa-yoga-fitness-adjacent-seminyak', 'rai-fitness-sunset-bali', 'think-pink-salon-and-nails-bali', 'yoga-108-bali-kuta-legian', 'room-4-dessert', 'taksu-yoga-ubud', 'la-tribu', 'power-of-now-yoga', 'andaz-bali-fitness-centre', 'morning-light-yoga', 'sa-mesa-canggu-experience-dining', 'bali-relaxing-resort-and-spa-nusa-dua-nusa-dua', 'bali-relaxing-resort-spa-nusa-dua', 'chupacabras', 'putu-bali-spa-home-care-munduk', 'the-shampoo-lounge-seminyak-seminyak') and publication_status = 'published';
  get diagnostics n = row_count; if n <> 20 then raise exception 'duplicates: expected 20 rows, got %', n; end if;
end $apply$;
