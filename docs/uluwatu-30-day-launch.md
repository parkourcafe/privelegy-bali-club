# Uluwatu 30-day publication plan (start: D1 = first Monday after deploy)

Roles: **F** = founder (Selena — field, socials-on-camera, partner contact),
**A** = AI session (copy, assets, analytics pulls). Status column starts
`todo`; update in place. Weekly metric review uses GA4 (utm campaign
`uluwatu-launch-2026-07`) + internal events (`district_page_view`,
`editorial_page_view`, `venue_detail_view`, `booking_click`,
`guide_form_submitted`).

**Publication order rationale (brief §20):** the site pages ship together as
one deploy (all already pass the factual gate: venue detail pages went out in
one verified batch of 24, noindex holding the 25th), but public *promotion*
is staged: pillar → restaurants → brunch → clubs → date-night → 48h — each
promoted page gets a full content week around it. Email/WhatsApp sends are
manual (no delivery provider yet) — send to the `guide_leads` export by hand;
never promise automated delivery.

Sunset legend: IG = feed post (reel R#/carousel C# from
`docs/uluwatu-social-launch.md`), ST = story sequence S#, PIN = Pinterest
pin #.

| Day | Website | IG | ST | PIN | Email/WA | Target page | CTA | Asset needed | Resp. | Status | Metric to watch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| D1 | Deploy launch; submit sitemap in Search Console; verify index/noindex | — | S5 (AMA box) | — | — | /uluwatu | Open the guide | — | A | todo | GSC: pages discovered |
| D2 | Check GSC coverage; fix crawl issues | R1 | — | 1 | — | /uluwatu | Link in bio | R1 footage (cliff lane POV) | F+A | todo | district_page_view |
| D3 | — | — | S1 (sunset poll) | 2 | — | /uluwatu | Poll → link | — | F | todo | story link taps |
| D4 | — | C1 (5 zones) | — | — | — | /uluwatu | Save this | C1 design | A | todo | saves |
| D5 | Internal links audit from Canggu pages | — | S6 (verification) | — | — | /uluwatu | Trust story | ledger screenshot | A | todo | profile visits |
| D6 | — | R6 (how we verify) | — | — | — | /uluwatu | Link in bio | R6 screen-rec | A | todo | venue_detail_view |
| D7 | Weekly metric review W1 | — | S12 slot (UGC if any) | — | — | — | — | — | A | todo | W1 report |
| D8 | Restaurants week: refresh OG check | C3 (decision tree) | — | 3 | — | /best-restaurants | Link in bio | C3 design | A | todo | editorial_page_view |
| D9 | — | — | S8 (this-or-that) | 4 | — | /best-restaurants | Quiz → link | — | F | todo | link taps |
| D10 | — | R4 (date≠group) | — | — | — | /date-night-restaurants | Link in bio | R4 footage (two rooms) | F | todo | venue_card_click |
| D11 | Partner outreach batch 1: send owner-invite links to 5 verified restaurants (existing /admin/invites flow) | — | S10 (family picks) | — | — | /best-restaurants | — | invite messages | F | todo | onboarding responses |
| D12 | — | — | — | 9 | — | /date-night-restaurants | Pin | pin 9 design | A | todo | pinterest saves |
| D13 | — | C6 (4 bookings) | — | — | — | /48-hours | Save this | C6 design | A | todo | booking_click |
| D14 | Weekly metric review W2; venue-page CTR check | — | S2 (18+ quiz) | — | — | — | — | — | A | todo | W2 report |
| D15 | Brunch week | R2 (6am bakery) | — | 5 | — | /best-brunch | Link in bio | R2 dawn footage | F | todo | editorial_page_view |
| D16 | — | — | S3 (morning vlog) | 6 | — | /best-brunch | Link | morning footage | F | todo | link taps |
| D17 | — | C4 (before 8am) | — | — | — | /best-brunch | Save | C4 design | A | todo | saves |
| D18 | Hours-verification pass 1: WhatsApp 5 venues for hours (gap register #1) | — | S11 (slider) | — | — | /best-brunch | — | — | F | todo | facts VERIFIED count |
| D19 | — | — | — | — | — | — | — | — | — | todo | — |
| D20 | Clubs week | R3 (beach truth) | — | 7 | — | /beach-clubs-sunset | Link in bio | R3 footage (funicular, Melasti) | F | todo | editorial_page_view |
| D21 | Weekly review W3 | — | S9 (Single Fin Wed) | 8 | — | /beach-clubs-sunset | Link | — | F | todo | W3 report |
| D22 | — | C2 (7 sunsets) | — | — | — | /beach-clubs-sunset | Save | C2 design | A | todo | saves |
| D23 | Update evidence: apply confirmed hours to registry + 0019 data patch | — | S7 (rain day, if rains) | — | — | — | — | — | A | todo | STALE count ↓ |
| D24 | — | — | — | 10 | — | /date-night-restaurants | Pin | pin 10 design | A | todo | pin clicks |
| D25 | 48h week: guide highlight reel | R5 (48 hours) | S4 (countdown) | 11 | — | /48-hours | Get the plan | R5 fast-cut edit | F+A | todo | guide_form_started |
| D26 | — | — | S4 release frame | 12 | First manual email to leads: guide link + what's new (send by hand from guide_leads export; BCC, unsubscribe note) | /48-hours | Read the plan | email draft (docs/uluwatu-48h-guide-versions.md) | F | todo | guide_form_submitted |
| D27 | — | C5 ($ explainer) | — | — | WA broadcast to consented WhatsApp leads (guide link, one message, no spam) | /48-hours | Save the plan | WA text (same doc) | F | todo | whatsapp_guide_click |
| D28 | Weekly review W4; Lighthouse re-run | — | S12 (UGC) | — | — | — | — | — | A | todo | W4 report |
| D29 | Publish venue-page batch promo: 3 strongest place pages cross-linked from IG | carousel remix of 3 place pages | — | — | — | /places/kala-uluwatu etc. | View place | remix design | A | todo | venue_detail_view |
| D30 | Month review: full funnel (views → venue clicks → booking_clicks → leads); decide next district or deepen | — | — | — | — | — | — | month report | F+A | todo | month report |

## Standing rules

- Nothing ships to socials without publication rights on every frame.
- If a metric row stays flat for two weeks, swap the format (reel ↔
  carousel), not the honesty.
- Any fact learned in outreach (hours, WhatsApp, closures) goes into
  `lib/uluwatu/venues.ts` + a data migration patch BEFORE it appears in
  social copy.
- Uluwatu monetisation stays off regardless of traction — partner interest
  routes into the existing onboarding flow, not into perks/QR (guardrail #4).
