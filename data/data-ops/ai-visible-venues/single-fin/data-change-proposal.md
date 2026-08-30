# Single Fin — data change proposal

**State:** `PREPARED_NOT_AUTHORIZED`  
**Target:** existing slug `single-fin`  
**SQL / database write:** not prepared or executed

| Field | Before | Proposed |
|---|---|---|
| `openingHours` | `null` | `Monday, Tuesday, Thursday, Friday and Saturday 8am-10pm; Wednesday and Sunday 8am-2am` |
| `opening_hours_json` | absent/null | keep null pending truthful overnight support |
| `whatToOrder` | `pizza; tacos; sliders` | `ahi tuna tartare; grilled tiger prawns; nasi goreng Single Fin` |
| price evidence | relative `$$` only | retain `$$`; add editorial anchor `food 60K–175K; tax and service included` where the data model supports it |
| `lastVerifiedAt` | `2026-07-12` | `2026-08-30` only for fields refreshed from this pack |

Do not copy this table directly into production. First verify the exact row and
the supported field model, obtain editorial approval, then prepare a guarded
one-row diff with expected row count `1`.
