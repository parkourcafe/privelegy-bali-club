-- Batch 01 (canggu-boilerplate-01) preflight dry-run
-- One row: bokashi-bali-pererenan
-- Guard: exact-old why_its_here + booleproof status/publication_status
-- Rolled back immediately (no production change)

BEGIN;

UPDATE venues SET why_its_here = 'A Japanese-influenced restaurant built around a robatayaki charcoal grill on Jalan Pantai Pererenan. The menu names dishes including beef tartare, miso cod and chicken liver parfait. An on-site organic grocery store stocks produce from the LYD Organic farm in Bedugul.'
WHERE slug = 'bokashi-bali-pererenan' AND status='active' AND publication_status='published'
  AND why_its_here = 'Restaurant on Jalan Pantai Pererenan No.159 in Canggu.';

-- Expected: 1 row updated (exact-old guard matches)
SELECT 'why_its_here update' as field, ROW_COUNT() as rows_affected;

UPDATE venues SET best_for = 'A robatayaki grill dinner or a daytime poolside meal in Pererenan.'
WHERE slug = 'bokashi-bali-pererenan' AND status='active' AND publication_status='published'
  AND best_for = 'Travellers who want to check availability and reserve a table through Chope.';

-- Expected: 1 row updated
SELECT 'best_for update' as field, ROW_COUNT() as rows_affected;

-- Rollback (dry-run only)
ROLLBACK;
