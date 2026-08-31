# Sundays Beach Club — data change proposal

**State:** `PREPARED_NOT_AUTHORIZED`  
**Target:** existing slug `sundays-beach-club`  
**SQL / database write:** not prepared or executed

| Field | Before | Proposed |
|---|---|---|
| `openingHours` | `null` | `Daily 7:30am-10pm` |
| `opening_hours_json` | null/absent | every day: `7.30am-10.00pm` |
| admission/booking | daily pass page labelled Book direct | daily pass = walk-in; VIP = SevenRooms reservation |
| `whatToOrder` | mahi mahi tacos; BBQ lobster; wood-fired pizza | crispy mahi mahi taco; whole lobster; wood-fired pizza |
| price evidence | relative `$$$` only | add two-tier food range and neutral surcharge note where supported |
| `lastVerifiedAt` | `2026-07-12` | `2026-08-30` for refreshed fields only |

Before implementation, verify the exact production row and the UI model for
separate walk-in and VIP actions. A guarded update must affect exactly one row.
