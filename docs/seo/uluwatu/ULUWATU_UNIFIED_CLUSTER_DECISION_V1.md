# Uluwatu unified cluster decision V1

Date: 2026-07-23. This document is the canonical Uluwatu architecture decision.

| Topic | Status | Exact canonical / target | Primary decision | Gate / overlap |
| --- | --- | --- | --- | --- |
| Pillar / who Uluwatu is for | P0_UPDATE | `https://www.otherbali.com/uluwatu` | Is this the right Bali base? | Use identity/geography claims only; hand off food, sunset and itinerary |
| Where to stay | HOLD | reserved `https://www.otherbali.com/uluwatu/where-to-stay` | Which micro-area before property choice? | Field/Maps/mobility evidence and GSC missing; no route |
| Best hotels | HOLD | reserved `https://www.otherbali.com/uluwatu/best-hotels` | Which verified property? | No ranked entity dataset or methodology |
| Things to do | HOLD | reserved `https://www.otherbali.com/uluwatu/things-to-do` | Which activity? | Attraction layer incomplete; overlaps temple route |
| Best beaches | HOLD | reserved `https://www.otherbali.com/uluwatu/best-beaches` | Which beach fits intended use/access tolerance? | Safety/access/field evidence missing |
| With kids | MERGE_INTO_EXISTING | `/uluwatu` | Can it work for this family? | Only a caveat after field evidence; no standalone URL |
| Without scooter | MERGE_INTO_EXISTING | future `/uluwatu/where-to-stay` | Can the stay work without riding? | No standalone URL; transport evidence missing |
| One-day/weekend itinerary | MERGE_INTO_EXISTING | `/uluwatu/48-hours` | What sequence is realistic? | Existing owner; P1 claim audit required |
| Uluwatu vs Canggu | MERGE_INTO_EXISTING | `/canggu-vs-uluwatu` | Which of two bases fits? | Existing owner; GSC review required |
| Uluwatu vs Nusa Dua | HOLD | reserved `/uluwatu-vs-nusa-dua` | Which base fits? | Weak evidence/demand; no route |
| Older travellers | MERGE_INTO_EXISTING | `/uluwatu` | Can it work with mobility constraints? | No claims until accessibility/transport field check |
| Existing restaurant/brunch/date/sunset pages | P1_UPDATE | existing canonicals | Narrow selection decisions | Keep separate; recertify claims |
| Resort pool day passes | P1_UPDATE | `/uluwatu/resort-pool-day-passes` | Which current resort-pool access option? | High-volatility owner/official refresh |

## Pillar decision

`/uluwatu` remains the only pillar. Do not create `/uluwatu/best-of-uluwatu`. Its P0 update removes unsupported walkability, transport, family, ranking, hours, price and venue-policy claims. It explains the planning-label caveat with verified Pecatu/Ungasan anchors and routes users to existing owners.

## Cannibalization controls

- Pillar: base fit and scope only.
- Food children: venue choice only.
- `/48-hours`: ordered itinerary; no new one-day/weekend URL.
- `/uluwatu-sunset-kecak`: temple/Kecak route; not general sunset ownership.
- `/beach-clubs-sunset`: sunset venue comparison; resort page owns daytime access/terms.
- Future where-to-stay: micro-area choice; future best-hotels: named property choice.

## P0 build order

1. Update `/uluwatu` only.

No P0_CREATE URL clears the publication gates today.
