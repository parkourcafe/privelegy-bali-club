# Reuse Gate Report V0.1

**Generated:** 2026-07-29T19:00:09.423Z
**Winner:** `OB-CAN-0011` — Choose a romantic dinner in Ubud (score 95)
**Backup:** `OB-CAN-0007` — Find breakfast open before 7 AM (score 88)

## Decision

```
EXTEND_EXISTING
```

**Duplicating an existing planning engine is forbidden**, and the winner is already served.

## Evidence: the winner already renders in production code

`app/bali/[district]/[intent]/page.tsx` renders an intent spoke for any (district, intent) pair
where `getIntentSpokes()` finds at least `SPOKE_MIN_VENUES` (= 4, `lib/data.ts:870`)
published venues carrying the intent's `jobSlug`.

The winner maps to `date-night` / `date_night_special` in `lib/intents.ts`. Live coverage:

| District | Published venues | Qualifies (>= 4) |
|---|---|---|
| canggu | 29 | yes |
| seminyak | 14 | yes |
| uluwatu-bukit | 13 | yes |
| ubud | 9 | yes |
| nusa-dua | 8 | yes |
| jimbaran | 5 | yes |
| sanur | 4 | yes |

**7 districts already qualify**, including Ubud with 9 published venues.
`/bali/ubud/date-night` therefore renders today, with metadata, canonical, FAQs, JSON-LD and an
internal-link mesh already implemented.

## Why not the other three options

| Option | Verdict |
|---|---|
| `NEW_TOOL` | **Rejected.** A new romantic-dinner tool would duplicate a live engine — explicitly forbidden. |
| `NEW_ENTRY_SAME_ENGINE` | **Rejected.** No new entry is needed; `date-night` already exists in `lib/intents.ts` and Ubud already qualifies. |
| `HOLD` | **Rejected.** Nothing is blocked: data is READY and the engine exists. Holding would misreport a live, working surface as blocked. |
| `EXTEND_EXISTING` | **Selected.** The remaining value is in the gap between the coarse spoke and the finer-grained source records. |

## The actual gap

The existing spoke answers "show me date-night venues in Ubud". Source records describe finer
decisions the spoke cannot express:

| Source | Job the spoke cannot answer today |
|---|---|
| `OB-INT-0017` | a dinner spot **without loud music** |
| `OB-INT-0015` | romantic dinner **with a sunset view** specifically |
| `OB-INT-0016` | **special-occasion / birthday** framing, distinct from date night |
| `OB-INT-0044` | **private-chef in-villa** dinner for two |
| `OB-INT-0045` | **secluded / private** setting for a proposal |

These are modifier and occasion refinements over an existing result set — an extension of the spoke's
filtering, not a second engine. Note that `special-occasion` is already an independent `OCCASION`
per the Stage 3 fixed decision and must not be modelled as a child of date-night.

## Constraint on implementation

Extending the spoke requires editing `lib/` and `app/` — outside the file scope authorised for this
run (`docs/intent-os/` and `scripts/intent-os/` only). See `final-status.md`.
