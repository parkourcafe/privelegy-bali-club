-- Contact enrichment for 9 previously-Unknown venues (Cowork follow-up pass).
-- Run this if the venues were already inserted by the earlier INSERT script
-- (a re-run of that script would just skip these rows via ON CONFLICT DO NOTHING).
-- Safe to run even if the rows don't exist yet -- each UPDATE just affects 0 rows.

update venues set official_url = 'https://nirvanalife.com/bali/', instagram_url = null where slug = 'nirvana-strength-tibubeneng';
update venues set official_url = 'https://app.playtomic.com/tenant/4b52e8ac-646c-4e33-998e-57b0633948f5', instagram_url = null where slug = 'prana-padel';
update venues set official_url = 'https://s2scrossfit.com/', instagram_url = 'https://www.instagram.com/s2scrossfit_bali/' where slug = 's2s-crossfit';
update venues set official_url = 'https://thefreebirdstudio.com/', instagram_url = 'https://www.instagram.com/the_free_bird_studio/' where slug = 'the-free-bird-studio';
update venues set official_url = 'https://crossfitseminyak.com/', instagram_url = null where slug = 'crossfit-seminyak';
update venues set official_url = 'https://driftersurf.com/', instagram_url = 'https://www.instagram.com/driftersurf/' where slug = 'drifter-kayu-aya';
update venues set official_url = 'https://powerofnowoasis.com/', instagram_url = 'https://www.instagram.com/powerofnowoasis_bali/' where slug = 'power-of-now-yoga';
update venues set official_url = 'https://ripcurlschoolofsurf.com/', instagram_url = 'https://www.instagram.com/ripcurlschoolofsurf/' where slug = 'rip-curl-surf-school-canggu';
update venues set official_url = 'https://ripcurlschoolofsurf.com/', instagram_url = 'https://www.instagram.com/ripcurlschoolofsurf/' where slug = 'rip-curl-surf-school-kuta-legian';
