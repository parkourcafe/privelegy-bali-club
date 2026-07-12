# Uluwatu deferred pages backlog (2026-07-12)

Pages the brief explicitly excludes from this release because the current
inventory has no structured data for them (brief §2/§6). Do NOT build any of
these without first running the same evidence pipeline (research import →
web/field verification → registry entry with per-fact sources → publication
gate).

| Deferred page | Blocking data gap | Unlock condition |
|---|---|---|
| `/uluwatu/best-hotels` | No hotel entity/rows at all; also a master-doc scope question (accommodation is a new category for the product) | Founder decision + master amendment + verified hotel dataset |
| `/uluwatu/villas` | Same as hotels | Same |
| `/uluwatu/best-spas` | Only spa signal in Uluwatu data is Svaha Spa *inside* Tropical Temptation | ≥6 verified standalone spa venues |
| `/uluwatu/gyms` / yoga / Pilates | Single adjacent signal (Alchemy Yoga); no gym rows | Verified wellness batch for the Bukit |
| `/uluwatu/things-to-do` | Attractions (temple, Kecak, beaches-as-attractions, surf breaks) are not in the verified data layer | Attraction research batch with the same evidence bar |
| `/uluwatu/surf-schools` | No surf-school rows | Verified surf-ops batch |
| Warung / local-food guide | No verified warung rows in Uluwatu | Next food research batch |

Sequencing recommendation once data exists: things-to-do → surf schools →
spas/yoga → hotels/villas (hotels last: heaviest verification + likely
affiliate/monetisation questions that need a master-doc decision first).
