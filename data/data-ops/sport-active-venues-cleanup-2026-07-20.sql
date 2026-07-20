-- Cleanup: remove venues confirmed closed or duplicate by Cowork's deep
-- research pass. These 4 slugs were part of the earlier 189-row insert
-- and should NOT remain in the venues table, even hidden as 'review'.

-- Pretty Poison Bowl (exclude_closed)
delete from venues where slug = 'pretty-poison-bowl';

-- Hotel Together Bali Pilates (merge_or_exclude_duplicate)
delete from venues where slug = 'hotel-together-bali-pilates';

-- Jamu wellness (exclude_closed)
delete from venues where slug = 'jamu-wellness';

-- Kuta Futsal (merge_or_exclude_duplicate)
delete from venues where slug = 'kuta-futsal';
