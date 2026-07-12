# Uluwatu evidence ledger & data-readiness matrix (2026-07-12)

The machine-readable, per-fact ledger lives in **`lib/uluwatu/venues.ts`**
(`evidence[]` on every venue: field, source type, source URL, verification
date, status, note) and is mirrored to the DB by migration
`0018_uluwatu_launch.sql` (`venue_fact_sources`). This document is the
human-readable summary.

## Verification method & its limits (honest)

- Internal research layer: OZO_BaliWali venue dashboard exports, imported
  2026-07-11 (migrations 0015/0016) — source of editorial fit data
  (best-for, jobs, what-to-order, price bands).
- Web verification pass: 2026-07-12, five parallel research agents using web
  search. **Limitation:** this sandbox's egress proxy blocked direct page
  fetches (HTTP 403), so official-site facts were confirmed at
  search-index/snippet level (live official domains, own subpages, addresses,
  policies), not by end-to-end page fetches. That is why several link facts
  carry status `VERIFIED` with a snippet-verification note, and why NO
  aggregator-sourced opening hours were published.
- Publication rule applied: opening hours appear on a page ONLY when sourced
  from the venue's own domain (3 venues qualify); everything else is
  off-page with status `STALE — RECHECK REQUIRED` or `CONFLICTING SOURCES`.
- Recheck cadence: 60 days for links/status, before print for anything used
  in offline material. `last_verified_at` renders on every venue page.

## Data-readiness matrix (25 venues)

Statuses: ✅ VERIFIED · 📄 research-import (verified at import, recheck
cadence) · ⚠️ CONFLICTING · ⛔ MISSING.

| Venue | Operating | Boundary/area | Official site | Instagram | Booking | Hours (on-page) | Price band | Publication |
|---|---|---|---|---|---|---|---|---|
| Single Fin | ✅ | ✅ Suluban, Pecatu | ✅ | ✅ | ✅ SevenRooms | ⚠️ off-page | 📄 $$ | **published** |
| Mana Uluwatu | ✅ | ✅ Suluban, Pecatu | ✅ (resort page) | ✅ | ⚠️ official page only | ⛔ off-page | 📄 $$$ | **published** |
| Sundays Beach Club | ✅ | ✅ Ungasan | ✅ | ✅ | ✅ own site | ⛔ off-page | 📄 $$$ | **published** |
| White Rock Beach Club | ✅ | ✅ Melasti | ✅ | ⚠️ recheck handle | ✅ own subdomain | ⚠️ off-page | ⛔ | **published** |
| Tropical Temptation | ✅ | ✅ Melasti | ✅ | ✅ | ✅ own subdomain | ✅ 10:00–21:00 | 📄 $$$ | **published** |
| El Kabrón | ✅ | ✅ Cemongkak, Pecatu | ✅ | ✅ | ✅ /book-now | ⚠️ off-page | 📄 $$$ | **published** |
| oneeighty° | ✅ | ✅ Pecatu cliffs | ✅ | ✅ | ⛔ | ⚠️ off-page | ⛔ | **published** |
| The Warung (Alila) | ✅ | ✅ Pecatu cliffs | ✅ | ⚠️ omitted | ✅ TableCheck | ⛔ off-page | 📄 $$$ | **published** |
| Gooseberry | ✅ | ✅ Bingin | ✅ | ✅ | ⚠️ omitted | ⛔ off-page | 📄 $$$ | **published** |
| YUKI Uluwatu | ✅ | ✅ Labuan Sait | ✅ | ✅ | ✅ own page | ✅ 11:00–late | 📄 $$$ | **published** |
| ZALI Uluwatu | ✅ | ✅ Suluban | ✅ | ✅ | ⚠️ omitted | ⛔ off-page | ⛔ | **published** |
| KALA Uluwatu | ✅ | ✅ Padang Padang | ✅ | ✅ | ✅ SevenRooms | ⚠️ off-page | 📄 $$$ | **published** |
| Papi Sapi | ✅ | ✅ Labuan Sait | ✅ | ✅ | ✅ own page | ✅ 16:00–23:30 | 📄 $$$ | **published** |
| MASONRY Uluwatu | ✅ (real 2nd location) | ✅ Labuan Sait | ✅ | ✅ | ✅ own page | ⚠️ off-page | 📄 $$$ | **published** |
| Ulu Fishmarket | ✅ | ✅ Labuan Sait | ✅ | ✅ | ✅ Chope | ⚠️ off-page | 📄 $$ | **published** |
| Ulu Garden | ✅ | ✅ Padang Padang | ✅ (ULU Tribe) | ✅ | ✅ Dish Cult | ⚠️ off-page | 📄 $$ | **published** |
| WAATU | ✅ | ✅ Ungasan clifftop | ✅ (2 domains) | ✅ | ✅ own page | ⚠️ off-page | 📄 $$$ | **published** |
| Seed | ✅ | ✅ Bingin | ✅ | ✅ | ✅ Chope | ⚠️ off-page | 📄 $$ | **published** |
| Laggas | ✅ | ✅ Bingin | ⛔ (clone-site risk noted) | ✅ | ⛔ | ⚠️ off-page | 📄 $$ | **published** |
| Suka Espresso | ✅ | ✅ Labuan Sait | ✅ (By/Suka page) | ✅ | — walk-in | ⚠️ off-page | 📄 $$ | **published** |
| Artisan Uluwatu | ✅ | ✅ Suluban | ⛔ | ✅ | ✅ Chope | ⚠️ off-page | 📄 $$ | **published** |
| BGS Uluwatu | ✅ | ✅ Suluban | ✅ | ✅ | — walk-in | ⚠️ off-page | 📄 $ | **published** |
| Son of a Baker | ✅ (IG-anchored) | ✅ Labuan Sait | ⛔ (none exists) | ✅ | — walk-in | ⚠️ off-page | 📄 $$ | **published** |
| Alchemy Uluwatu | ✅ | ✅ Bingin | ✅ | ✅ | — walk-in | ⚠️ off-page | 📄 $$ | **published** |
| Ulu Artisan (Ungasan) | ✅ | ✅ Ungasan | ⚠️ unconfirmed | ✅ (brand acct) | ⚠️ | ⚠️ | 📄 $$ | **REVIEW (noindex)** |

**Result: 24 published / 1 held in review.** Images: 0/25 have confirmed
rights → all public surfaces use the explicitly typographic editorial cover
(no fake or unlicensed photos anywhere).

## Notable verification outcomes

1. **MASONRY Uluwatu is NOT a duplicate** of Canggu `mason` — masonrybali.com
   runs dedicated /uluwatu pages; recorded as a genuine second location.
2. **oneeighty° is NOT adults-only** (research jobs implied adults focus):
   under-12 restriction applies to the VIP deck only. Copy corrected.
3. **Tropical Temptation** was renamed from Cattamaran Beach Club (2022);
   18+ policy confirmed on the venue's own blog.
4. **Laggas** has no first-party site; the top-ranking `laggasuluwatu.shop`
   matches SEO-clone patterns and was deliberately rejected as a source.
5. **Address collision**: MASONRY, Ulu Fishmarket and Suka all list
   "Jl. Labuansait No.10" — same plot/strip or aggregator copying. Street
   numbers are flagged `CONFLICTING SOURCES` and mostly kept off pages.
6. **Ulu Artisan (Ungasan)** held in review: identity confirmed but the brand
   name conflicts across platforms (Ulu Artisan / Artisan Ungasan / ARTISAN -
   UNGASAN with duplicate Chope listings).
