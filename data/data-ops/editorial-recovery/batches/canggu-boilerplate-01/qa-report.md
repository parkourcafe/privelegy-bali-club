# Batch 01 (canggu-boilerplate-01) QA Report

**Date:** 2026-08-12  
**Status:** ✅ Acceptance complete; ready for preflight/apply/rollback  
**Authored by:** Acceptance pass (4 parallel collectors → row-by-row acceptance)

---

## Summary

| Metric | Count |
|--------|-------|
| Candidates received | 12 |
| Accepted (ready for apply) | 10 |
| Rejected (reasons documented) | 2 |
| **Expected UPDATEs (apply.sql)** | **21** |
| Fields rewritten | `why_its_here` (10), `best_for` (10), `not_for` (1) |

---

## Acceptance Tally

### ✅ Accepted (10)

1. **bokashi-bali-pererenan**  
   Sources: bokashibali.com (2 pages)  
   Fields: `why_its_here`, `best_for`

2. **hip-hop-soul-restaurant**  
   Sources: hiphopsoul.net, @hiphopsoul.bali (IG)  
   Fields: `why_its_here`, `best_for`

3. **jen-deli-restaurant-and-la-fortuna-bar-at-sense-canggu-beach-hotel**  
   Sources: sensecanggubeach.com (2 pages)  
   Fields: `why_its_here`, `best_for`

4. **kedai-tepi-kali-and-bar-at-tapa-tepi-kali-canggu**  
   Sources: tapatepikali.com (2 pages)  
   Fields: `why_its_here`, `best_for`

5. **khao-canggu**  
   Sources: khaobali.com (3 pages), @khaocanggu (IG)  
   Fields: `why_its_here`, `best_for`, **`not_for`** (new field)

6. **kong-contemporary-bistro**  
   Sources: kongbali.com (4 pages incl. menu)  
   Fields: `why_its_here`, `best_for`

7. **one-eyed-jack**  
   Sources: oneeyedjackbali.com (3 pages incl. menus)  
   Fields: `why_its_here`, `best_for`

8. **rasa-kitchen**  
   Sources: @rasa_kitchen_canggu (IG, own geotag)  
   Fields: `why_its_here`, `best_for`

9. **samm-s-farm**  
   Sources: sammsfarm.com (3 pages), @sammsfarm (IG)  
   Fields: `why_its_here`, `best_for`

10. **turntable-canggu-steakhouse**  
    Sources: @turntable.canggu (IG, 2 posts)  
    Fields: `why_its_here`, `best_for`

---

## ❌ Rejected (2)

### 1. honeycomb-bali

**Reason:** Identity mismatch

- **Record says:** Cafe on Jalan Raya Canggu  
- **Actual venue:** Honeycomb Hookah & Eatery (Pererenan hookah lounge w/ food)  
- **Sources found:** @honeycomb.bali (IG only; confirms hookah/eatery, not cafe)  
- **Status:** Cannot verify slug identity from official sources. Forbidden aggregators only show the mismatch.  

**Acceptance gate failed:** Source is venue's own page (IG ✓), but venue identity does not match record (✗).

**Action:** Reject row. Recommend: verify slug intent in production record before any rewrite.

---

### 2. milano

**Reason:** Unverifiable identity and sources

- **Record says:** Restaurant on Jl. Pantai Berawa in Canggu, Berawa  
- **Findings:**  
  - Two official-looking IG handles: @milano.bali and @milanocanggu  
  - Street address (Berawa) unverified from official source  
  - No confirmable dishes or prices on official pages  
  - Second location (Umalas) referenced  
- **Status:** Cannot establish primary identity or confirm data for this slug.  

**Acceptance gate failed:** Venue identity unclear; multiple competing official sources; address unverified (✗).

**Action:** Reject row. Recommend: resolve slug identity with partner before rewrite.

---

## Acceptance Discipline

All 10 accepted rows passed:
- ✅ Source is venue's own official page (website / own IG, never aggregators)  
- ✅ Copy is rung 1/2 (verified facts or restatement), never rung 3 (invention)  
- ✅ `not_for` is fit-context, not a quality complaint (khao-canggu only)  
- ✅ Source URL is present in every row (no source → no accept)  

---

## SQL Artifacts

### Counts

- **preflight.sql:** Dry-run one row (bokashi-bali-pererenan); rolled back immediately  
  - Expected: 2 UPDATEs (why_its_here, best_for)  
  - Detects exact-old guard match/drift  

- **apply.sql:** 10 venues, 21 UPDATEs  
  - bokashi (2), hip-hop-soul (2), jen-deli (2), kedai-tepi-kali (2)  
  - khao (3: why + best + not_for), kong (2), one-eyed-jack (2)  
  - rasa-kitchen (2), samm-s-farm (2), turntable (2)  

- **rollback.sql:** Reverse all 21 UPDATEs (exact-old inverse)  

### Guard Design

```sql
UPDATE venues SET why_its_here = :new
WHERE slug = :slug AND status='active' AND publication_status='published'
  AND why_its_here = :exact_old_boilerplate;
```

- Guard protects against drift on the **single field being rewritten** only  
- `status` and `publication_status` always checked (row must remain live+published)  
- `last_verified_at` is **not** touched (editorial rewrite ≠ re-verification visit)  
- `price_anchor` is not written on this pass (no official prices collected)  

---

## Hand-off to Apply

All three SQL files are dry-run safe:
- **preflight.sql:** Must be run first (one-row confirmation, rolled back)  
- **apply.sql:** Runs after preflight confirms guard logic  
- **rollback.sql:** Available if apply must be reversed  

No production writes are implied until the founder explicitly runs apply.sql.

---

## Next Batch

Once Batch 01 is applied (or explicitly skipped):
- Batch 02 candidates: Ubud districts (editorial queue next tier)  
- Priority: `P1_REWRITE_BOILERPLATE` class (same guard discipline as Batch 01)  
- Collectors: Parallel agents per venue subset  

---

## Footnotes

- All 10 source URLs are captured and linked in source-ledger.csv for traceability  
- Editorial changes CSV shows old→new transition for every field  
- Rejection reasons are documented per row (not silently dropped) per playbook §2  
- No aggregators, no third-party ratings, no invented copy  
