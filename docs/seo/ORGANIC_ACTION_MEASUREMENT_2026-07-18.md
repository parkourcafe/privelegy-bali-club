# Organic action measurement — 2026-07-18

## Current state

Production does not currently load `gtag.js`: the HTML contains neither
`googletagmanager` nor measurement ID `G-F3TEVWTWX4`. The production environment
flag `NEXT_PUBLIC_ENABLE_ANALYTICS` is off.

The application event contracts are already PII-free and bounded to entity
identifiers. This release makes GA loading conditional on explicit analytics
consent and completes the TablePilot Reserve acquisition signal.

## Event matrix

| User action | GA4 acquisition event | Required breakdown | Internal proof event |
|---|---|---|---|
| Maps | `direction_click` | `venue_slug` | `direction_click` |
| Reserve | `booking_click` and `action_handoff` | `action=reserve`, `provider`, `venue_slug` | TablePilot only: `reservation_click` |
| WhatsApp | `action_handoff` and `booking_click` | `action=whatsapp`, `provider=whatsapp`, `venue_slug` | `booking_click` |
| Menu | `menu_open`, `menu_item_open` | `venue_slug`, `menu_id`, optional `menu_item_id` | same safe events |
| Delivery | `delivery_click` and `action_handoff` | `action=delivery`, `provider`, `venue_slug` | same safe events |

`booking_click` is intentionally an acquisition event, not proof that a booking
was completed. TablePilot remains the fulfilment source of truth.

## Organic-session report

In GA4, report these events with:

- dimension: **Session default channel group** = `Organic Search`;
- secondary dimension: **Landing page + query string** or **Page path**;
- event name: the event matrix above;
- custom dimensions: `action`, `provider`, `venue_slug`;
- denominator: consenting organic sessions only.

Never infer completed bookings, orders, or venue arrivals from a click.

## Founder deployment gate

After the technical PR is merged:

1. Confirm the production privacy disclosure matches consent-gated GA4.
2. Set `NEXT_PUBLIC_ENABLE_ANALYTICS=1` in the production Vercel project.
3. Redeploy from the protected production branch.
4. Accept analytics on one test device and verify a page view plus one event of
   each action family in GA4 Realtime/DebugView.
5. Verify **Essential only** loads no Google analytics script and sends no
   behavioural events.
6. Create GA4 custom dimensions for `action`, `provider`, and `venue_slug`.
7. Do not mark actions as conversions until the naming and duplicate-event smoke
   check passes.

No names, phones, payments, URLs with tokens, menu text, or guest PII may enter
either analytics sink.

