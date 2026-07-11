# Other Bali Venue Data Collection Prompt

Date: 2026-07-11  
Scope: post-import QA for the public planning catalogue.

## Current Rule

We publish collected venues first as a planning guide, then improve data quality.
This is not a perks launch for every venue.

Published layer:

- Venue name, district, area, category, Google Maps link.
- Safe editorial fit context when available: why it is here, best for, vibe,
  practical tags, signature items.

Not published unless confirmed:

- Perks / offers.
- QR redemption.
- TablePilot booking monetization.
- Venue photos without rights.
- Raw complaints, red flags, rating disputes, or internal confidence notes.

## Source Guardrails

- Do not scrape or republish Google review text.
- Google Maps can be used only for factual checks: place existence, map URL,
  address, hours, phone, website link.
- For public copy, use own field notes, official venue sources, and direct venue
  confirmation.
- `Not for` must describe fit context only, such as "not for laptop work" or
  "not for quiet dinner"; never publish quality warnings like "bad service" or
  "do not order X".

## What We Need, From Whom

### 1. Field Scout

Collect this from an actual visit or direct local check.

Required:

- Is it currently open?
- Exact Google Maps URL.
- Correct district and area.
- Category: cafe, restaurant, beach club, bar, warung, spa/wellness, surf.
- Current vibe: quiet, lively, romantic, family, work-friendly, view.
- Practical tags: parking, walk-in-friendly, reservation-helpful, kid-friendly,
  rain-proof, quiet-enough-to-talk, big-groups, laptop-friendly, sockets.
- Best moment: slow morning, work session, midday reset, golden hour, late dinner,
  family day.
- One sentence: why this place belongs in Other Bali.
- One sentence: best for who / when.
- One safe fit limitation, only if useful.
- 1-3 own photos or venue-approved photos.

Optional:

- Price anchor: example coffee, cocktail, main dish, or average meal range.
- What to order: 1-3 signature items, only if confirmed by menu or staff.
- Accessibility notes: stairs, beach access, stroller difficulty.

### 2. Venue Owner Or Manager

Ask directly.

Required:

- Official venue name.
- Official Instagram.
- Official website or menu link.
- Correct WhatsApp or reservation contact.
- Permission to show venue-provided photos.
- Whether they want to be listed now.
- Whether the public description is accurate.

Optional commercial fields:

- Confirmed guest offer, if they want one.
- Offer terms: days, hours, minimum spend, one-per-guest rule.
- TablePilot slug or reservation link, if they use TablePilot.
- Staff instruction for guests who arrive from Other Bali.

### 3. Editorial Owner

Decide what appears publicly.

Required:

- Keep / hide / needs more QA.
- Public one-liner.
- Final `why_its_here`.
- Final `best_for`.
- Final `not_for`, only fit context.
- Final category and district.
- Whether the venue should appear in a route.

Do not publish:

- Rating disputes.
- Complaints from review sites.
- Unverified perks.
- "Best in Bali" claims unless we have a clear editorial basis.

### 4. TablePilot / Admin

Only relevant for active deep district monetization.

Required for bookable Canggu venues:

- TablePilot venue slug.
- Confirm that `source=bali_privilege` is accepted.
- Confirm that BP-sourced reservations appear in the aggregate partner report.
- Confirm what counts as arrived/completed/seated.

Never build:

- Internal booking engine.
- Tourist-side payments.
- Paid ranking.

## Copy-Paste Prompt For Research

For each venue below, collect only factual, usable fields. Do not scrape or quote
Google reviews. Use official venue sources, Google Maps factual data, direct
venue confirmation, and field visit notes.

Return one row per venue with these fields:

```text
venue_name:
district:
area:
category:
google_maps_url:
official_instagram:
official_website:
menu_url:
reservation_url_or_whatsapp:
currently_open:
opening_hours_source:
best_moment:
vibe_tags:
practical_tags:
why_its_here_public:
best_for_public:
not_for_public_fit_only:
what_to_order_confirmed:
price_anchor:
photo_rights_source:
venue_contact_name:
venue_confirmed_listing_yes_no:
confirmed_offer_title:
confirmed_offer_terms:
tablepilot_slug:
editorial_decision_keep_hide_needs_qa:
notes_internal_not_public:
```

For missing fields, write `unknown`, not a guess.

## Priority Order

1. Canggu venues already visible or likely to receive traffic.
2. First publish candidates with good factual enrichment.
3. Ubud and Seminyak high-confidence restaurants/cafes.
4. Uluwatu/Bukit high-confidence sunset and beach-club candidates.
5. Sanur, Jimbaran, and Nusa Dua longlist venues that need basic factual QA.
6. Low-confidence or review-pressure candidates only after field check.
