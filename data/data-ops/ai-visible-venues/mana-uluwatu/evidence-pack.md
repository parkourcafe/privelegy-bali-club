# Mana Uluwatu — AI-visible venue evidence pack

**Status:** `HOLD_PREPARED`  
**Captured:** 2026-08-30  
**Publication:** forbidden  
**Database write:** not performed

## Outcome

Mana already has a live Other Bali card at `/places/mana-uluwatu`; this is an
update candidate, not a new venue. Its official restaurant page confirms daily
07:00–23:00 service, breakfast/lunch/dinner, public access, two dining settings,
phone and a direct TableCheck handoff.

The official breakfast, lunch and dinner menus are images. All item names and
prices needed for restaurant discovery were visually checked and transcribed
into text in `raw-evidence/2026-08-30-official-menu-transcription.md`.

## Fact matrix

| Field | State | Evidence / decision |
|---|---|---|
| Identity | VERIFIED | Mana Uluwatu Restaurant & Pool at Uluwatu Surf Villas. |
| Existing card | VERIFIED | Update `/places/mana-uluwatu`; do not create a duplicate. |
| Hours | VERIFIED | Daily 07:00–23:00. |
| Service periods | VERIFIED | Breakfast 07:00–11:30; lunch 12:00–16:00; dinner 16:30–23:00. |
| Address | VERIFIED PARENT PROPERTY | Jalan Pantai Suluban, Uluwatu, Pecatu, Bali; no separate unit is published. |
| Phone | VERIFIED | +62 817 555 365 on the official restaurant page. |
| Menu format | VERIFIED IMAGE-ONLY | Official page currently links 2026/03 image assets. |
| Price treatment | VERIFIED | Menu amounts are thousand IDR; 11% government tax + 10% service are excluded. |
| Booking | VERIFIED HANDOFF | Official link resolves to TableCheck venue `uluwatu-surf-villas-mana`. |
| Current recommendations | VERIFIED MENU / EDITORIAL REVIEW | Crispy pork belly taco, tuna nachos and beef short rib rendang are present and priced. |
| Public freshness | STALE | Existing card says last checked 2026-07-12 and omits current hours/menu. |

## Prepared decision

- Add current human and structured hours, repeating one schedule across all
  seven operating days as required.
- Replace the page-level booking link with the exact official TableCheck
  handoff.
- Preserve current editorial positioning but use exact current item names.
- Add price context: most captured plates are 40K–215K, while steaks are
  520K–680K, before 11% tax and 10% service.
- Do not publish this pack or infer a review/rating.

## Remaining gates

1. Editorial approval of the exact recommendations and price anchor.
2. Read-only verification of the exact production row.
3. Guarded one-row implementation, preview QA and production verification under
   separate authorization.
