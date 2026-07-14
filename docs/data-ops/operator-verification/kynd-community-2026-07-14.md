# KYND Community operator verification - 2026-07-14

## Decision

- Venue: `kynd-community` (Seminyak)
- Candidate: `menu-c167cbd855b1c24d2c564cdf`
- Decision: approved for review/publication after draft import
- Required display-title correction: `KYND Community shared sample food & drinks menu - May 2026`
- Verification time: `2026-07-14T07:56:22Z`
- Freshness window: 60 days from verification

## Official evidence

- Official venues page: `https://www.kyndcommunity.com/pages/venus`
- Official cafe page: `https://www.kyndcommunity.com/pages/kyndcafe`
- Official PDF linked by the venue: `https://cdn.shopify.com/s/files/1/0051/1685/4321/files/KYND_MENU___WEBSITE_MAY_2026.pdf?v=1778470614`
- PDF SHA-256: `14ee0e82406a0ae1d5ca04a1408b8752926ee7b9d4e02353da8705a3df90ca71`

The official venues page identifies Seminyak as KYND's largest Bali venue and
publishes the same menu asset, Seminyak map, and Seminyak WhatsApp contact. The
official cafe page describes the linked files as a sample shared across the
three Bali locations, so the public title must say `shared sample` rather than
implying a branch-exclusive or exhaustive menu.

## File and transcription checks

- PDF metadata creation and modification time: `2026-05-11T11:36:15+08:00`
- PDF pages: 4
- PDF is unencrypted and contains no JavaScript.
- All four rendered pages were visually inspected.
- Compiled candidate: 22 sections and 120 item/add-on rows.
- Automated normalized-name comparison matched 115 of 120 rows directly.
- The five layout-dependent rows were visually confirmed:
  - custom smoothie-bowl garnish (`+25k`);
  - dirty coffee add-on (`+15k`);
  - three wines sharing the printed `600k per bottle` price.
- Repeated group prices in the PDF (cocktails, smoothies, juices, water, wine)
  are intentionally copied to the individual structured rows.
- The PDF states that prices are subject to 10% tax and 6% service; this must
  remain visible through the official source link and must not be represented
  as an all-inclusive price.

## Publication constraints

- Publish the menu only after the exact imported draft is checked against this
  evidence and renamed as specified above.
- Set `verified_at` through the operator workflow, not through Data Ops import.
- Set `expires_at` to 60 days after the operator verification timestamp.
- No photo rights are implied by this verification.
- Do not publish the Canggu dinner-booking redirect for the Seminyak venue.
- The Seminyak WhatsApp action and shared website/menu actions may be reviewed
  separately against their exact official links.
