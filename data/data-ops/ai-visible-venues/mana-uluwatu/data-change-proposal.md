# Mana Uluwatu — data change proposal

**State:** `PREPARED_NOT_AUTHORIZED`  
**Target:** existing slug `mana-uluwatu`  
**SQL / database write:** not prepared or executed

| Field | Before | Proposed |
|---|---|---|
| `openingHours` | `null` | `Daily 7am-11pm` |
| `opening_hours_json` | null/absent | every day: `7.00am-11.00pm` |
| `bookingUrl` | official restaurant page | direct official TableCheck landing URL |
| `whatToOrder` | pork belly tacos; tuna nachos; beef rendang | crispy pork belly taco; tuna nachos; beef short rib rendang |
| category | `bar` | editorial review: `restaurant` is the official primary positioning |
| price evidence | relative `$$$` only | add dated plate/steak range and +21% exclusion where supported |
| `lastVerifiedAt` | `2026-07-12` | `2026-08-30` for refreshed fields only |

Before implementation, confirm the exact production row and final category.
Any guarded update must expect exactly one affected row.
