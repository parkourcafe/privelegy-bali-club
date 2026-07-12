# Uluwatu gap register (2026-07-12)

Everything the launch deliberately did NOT claim or build because the
evidence isn't there yet. Each item names the missing evidence and the next
action. Nothing here blocks the shipped release — pages omit these claims.

## Per-venue fact gaps (kept off public pages)

| # | Gap | Venues affected | Next action |
|---|---|---|---|
| 1 | Opening hours not confirmable at source (aggregator-only or conflicting) | all except Tropical Temptation, Papi Sapi, YUKI | Field visit or WhatsApp confirmation with each venue; then fill `opening_hours` + evidence row |
| 2 | Exact street addresses conflict (Labuansait №10 collision) | MASONRY, Ulu Fishmarket, Suka Espresso | Verify house numbers on field visit before any print material |
| 3 | No official website exists / unconfirmed | Laggas, Son of a Baker, Artisan Uluwatu; Ulu Artisan (unverified artisangroup.id) | Ask venues directly during partner outreach |
| 4 | No official booking channel confirmed | oneeighty° (deposit process known, URL not), Laggas, ZALI, Gooseberry (Chope/DishCult unconfirmed as endorsed) | Confirm preferred booking channel during outreach |
| 5 | Price bands missing in research | White Rock, oneeighty°, ZALI | Add on next research pass |
| 6 | What-to-order lists are research-import provenance (2026-07-11), not menu-verified | most venues | Recheck against official menus on 60-day cadence; MASONRY already menu-verified |
| 7 | Instagram handle unconfirmed | White Rock (@whiterockbeachclub via listing), Alila Warung (omitted) | One confirmation pass on the accounts themselves |
| 8 | WhatsApp numbers seen in snippets but not published (unverified) | Single Fin, YUKI, ZALI, KALA, Papi Sapi, WAATU, Masonry, Seed, Tropical Temptation | Verify numbers during outreach; only then add `Message venue` CTAs |
| 9 | Venue photography: 0/25 have confirmed publication rights | all | Partner onboarding photo upload (existing `/onboard/[token]` flow) or licensed shoots; until then typographic covers only |
| 10 | Ulu Artisan (Ungasan) brand identity conflict | ulu-artisan-ungasan | Reconcile canonical name with the Artisan group; then flip `publication` to published |

## Structural gaps

- **Sparse-row upgrade path**: the 12 originally-sparse rows now carry
  verified areas/links, but their editorial copy was written from research +
  verification snippets, not site visits. Field visits will deepen
  `whatToExpect` and unlock vibe tags (master rule: vibe tags only after
  on-site visit — none were bulk-added in this launch).
- **Multi-image galleries**: the venue page template renders a single
  approved hero (venue-uploaded); the gallery grid section activates once
  image rights exist. Deliberately not built against empty data.
- **Lead delivery**: `guide_leads` stores leads (consent-stamped, deduped);
  NO email/WhatsApp delivery provider is wired. The UI never claims a message
  was sent. Next: pick provider (e.g. Resend / WhatsApp Business API),
  then wire a send + a `delivered_at` column.
- **Dreamland & Balangan**: named in the boundary but zero verified venues —
  excluded from the micro-area anchors table until researched.
- **Warung-level local food in Uluwatu**: no verified rows; the restaurants
  guide says so honestly. Add to next research batch.

## Deferred claims we refused to publish

- Aggregate ratings / review counts (no sourced current data → no
  `AggregateRating` schema anywhere).
- "Adults-only" for oneeighty° (disproven — VIP-deck-only restriction).
- Aggregator opening hours, prices in IDR, dish "signature" labels beyond
  research/menu evidence, hotel/spa/activity recommendations.
