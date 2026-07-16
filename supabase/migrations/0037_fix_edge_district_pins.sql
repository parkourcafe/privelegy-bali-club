-- 0037_fix_edge_district_pins.sql
--
-- Data patch closing issue #19 (district-pin audit). Enforces the master rule
-- "one venue = one district by its map pin". Café del Mar and Crate Cafe were
-- already corrected in an earlier patch; this migration resolves the three
-- remaining "edge" venues that sat under `seminyak` but pin to the Canggu belt,
-- and clears one stale address string.
--
-- Founder decision (2026-07-16): move all three Batu Belig / Umalas venues to
-- `canggu`, consistent with the already-moved Café del Mar (also Batu Belig).
--
-- Editorial-location fields only (district / area / address). No perks, QR,
-- TablePilot, ratings or ranking fields are touched (guardrails from 0015/0016).
-- Idempotent: keyed by slug, safe to re-run.

-- Batu Belig — follows the Café del Mar precedent onto the Canggu side.
update venues set district = 'canggu'
  where slug = 'poule-de-luxe-bali' and district <> 'canggu';

-- Umalas — the inland Canggu/Kerobokan belt, not Seminyak proper.
update venues set district = 'canggu'
  where slug in ('7am-bakers-umalas', 'nook-umalas') and district <> 'canggu';

-- Crate Cafe: area was already corrected to Batu Bolong; clear the now-stale
-- "Pererenan" address string so location fields agree.
update venues set address = 'Batu Bolong'
  where slug = 'crate-cafe' and address = 'Pererenan';
