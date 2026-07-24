# Ubud unified cluster decision V1

Date: 2026-07-23. This is the sole Ubud architecture decision.

| Topic | Status | Exact canonical / target | Primary decision | Gate / overlap |
|---|---|---|---|---|
| Pillar / who Ubud is for | P0_UPDATE | `https://www.otherbali.com/ubud` | Is Ubud the right Bali base? | use area-level verified claims only |
| Where to stay | HOLD | reserved `https://www.otherbali.com/ubud/where-to-stay` | Which location pattern should I choose before a hotel? | distinct SERP; GSC, field and Maps missing; no route |
| Best hotels | HOLD | reserved `https://www.otherbali.com/ubud/best-hotels` | Which verified property should I choose? | no ranked verified dataset; no route |
| Things to do | P1_UPDATE | `https://www.otherbali.com/ubud/things-to-do` | Which attraction or activity fits? | entity and schedule audit required |
| One day | P1_UPDATE | `https://www.otherbali.com/ubud-one-day` | What is a realistic one-day sequence? | preserve owner; GSC and route audit required |
| Two or three days | P1_UPDATE | `https://www.otherbali.com/ubud/itinerary` | What is a realistic multi-day sequence? | preserve owner; GSC and route audit required |
| Culture/rice-terrace day trip | HOLD | `/ubud-culture-rice-terraces-waterfalls` and `/route/ubud-culture-day` | Is this day-trip pattern right and how is it sequenced? | competing owners; no redirect or merge before GSC |
| Ubud vs Canggu | P1_UPDATE | `https://www.otherbali.com/ubud-vs-canggu` | Which base fits? | comparison claim audit required |
| With kids | MERGE_INTO_EXISTING | `/ubud` | Can Ubud work for this family? | field-verified caveat only; no standalone URL |
| Without scooter | MERGE_INTO_EXISTING | future `/ubud/where-to-stay` | Which location pattern reduces transport dependency? | no standalone URL; field evidence missing |
| Older/limited-mobility travellers | MERGE_INTO_EXISTING | `/ubud` | Can Ubud work with these access needs? | no wording before field verification |
| Food, coffee, wellness, brunch and pool pages | P1_UPDATE | existing canonicals | Which current venue fits the occasion? | official/owner recertification required |

## Pillar and cannibalization controls

`/ubud` remains the pillar. It owns broad base fit and high-level planning labels, not hotel ranking, detailed neighbourhood comparison, attraction ranking or itinerary sequencing. `/ubud-one-day` and `/ubud/itinerary` remain separate because duration changes the decision, but neither may absorb the culture-route pages without GSC evidence. No `best-of-ubud`, family, mobility or no-scooter duplicate may be created.

## P0 build order

1. Update `/ubud` using only the approved claim ledger.

No P0_CREATE URL clears publication gates today.
