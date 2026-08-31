# Single Fin — AI-visible venue evidence pack

**Status:** `HOLD_PREPARED`  
**Captured:** 2026-08-30  
**Publication:** forbidden  
**Database write:** not performed

## Outcome

Single Fin already has a live Other Bali card at `/places/single-fin`. The
correct action is an update, not a new record. Its official site now provides
current address and weekly hours, and the official Eat & Drinks page exposes a
machine-readable menu with prices. No OCR is needed for this venue.

The existing card still says information was checked on 2026-07-12, omits
hours, and proposes `sliders` despite no slider appearing in the captured
current food menu. The draft replaces that suggestion with current named menu
items and prepares a dated price anchor. It does not change the live site.

## Fact matrix

| Field | State | Evidence / decision |
|---|---|---|
| Identity | VERIFIED | Official site and current Other Bali page agree on Single Fin in Suluban/Pecatu. |
| Existing card | VERIFIED | `/places/single-fin` is live; update this slug and do not create a duplicate. |
| Address | VERIFIED | Official site publishes Pantai Suluban, Jl. Labuan Sait, Pecatu, Uluwatu, Kuta Selatan, Badung, Bali 80361. |
| Hours | VERIFIED | Mon, Tue, Thu, Fri, Sat 08:00–22:00; Wed and Sun 08:00–02:00. |
| Structured hours | HOLD | The current parser turns an overnight close into 23:59; keep JSON null rather than publish a false close. |
| Menu format | VERIFIED TEXT | Official page renders food and drink names, descriptions and prices in HTML. |
| Menu prices | VERIFIED | Representative food selection runs from 60K desserts to 175K pizza; prices include tax and service. |
| Booking | VERIFIED HANDOFF | Official site routes reservations to the Single Fin Uluwatu SevenRooms entity. |
| Event cadence | HOLD | Existing Other Bali copy names Wednesday/Sunday party nights; this run did not capture a dated official event schedule. |
| Hero/media | UNCHANGED | No new image is proposed in this venue run. |

## Prepared data decision

- Retain existing slug, category, district, public identity, address context
  and current editorial positioning unless the editor changes it.
- Add a human-readable current weekly schedule.
- Keep `opening_hours_json` null until overnight hours can be represented
  correctly.
- Replace the stale generic `pizza; tacos; sliders` list with the editorial
  proposal `ahi tuna tartare; grilled tiger prawns; nasi goreng Single Fin`.
- Add the evidence-backed price anchor `food 60K–175K; tax and service included`.
- Do not publish recurring-event claims from this pack.

## Remaining gates

1. Editorial approval of `what_to_order`, `not_for` and the price anchor.
2. Read-only verification of the exact production row before any guarded write.
3. Engineering decision on truthful post-midnight structured hours.
4. Separate authorization for a data write, publication and production check.
