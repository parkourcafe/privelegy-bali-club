# Other Bali — App Store review package

Date: 2026-07-15
Owner: Agent B (store readiness)
Status: ready for founder review; do not submit until the signed build passes
real-device QA.

## Product record

| Field | Value |
|---|---|
| App name | Other Bali |
| Platform | iOS |
| Bundle ID | `com.otherbali.app` |
| SKU | `other-bali-ios` |
| Primary category | Travel |
| Price | Free |
| Primary language | English |
| Support URL | https://www.otherbali.com/support |
| Privacy URL | https://www.otherbali.com/privacy |
| Marketing URL | https://www.otherbali.com |

The legal seller/developer name, Apple Team ID, agreements, tax/banking
details, and App Store Connect Apple ID are founder-only fields and are not
invented in this repository.

## Listing copy

### Subtitle

`Curated places for your day`

### Promotional text

`Tell us the moment you want. Other Bali turns it into a focused shortlist of places, routes and practical next steps across Bali.`

### Description

`Other Bali is a curated guide for deciding where to go across Bali.`

`Start with the day you actually want: a slow morning, a beach day, a date, time with family, focused work or a sunset finish. Choose your area and who you are with, then explore a shortlist built around that moment.`

`Inside the app you can:`

- build a Bali day around mood, district and group;
- browse curated places across the island;
- compare practical notes on who a place suits and what to expect;
- open district guides and ready-made routes;
- save places without creating an account;
- share a read-only list with travel companions;
- continue to directions or a venue's verified booking channel.

`Other Bali is free for travellers. Offers appear only where a venue has confirmed them. Other Bali does not sell digital content or take tourist payments.`

### Keywords

`bali,travel,restaurants,cafes,beaches,canggu,ubud,uluwatu,seminyak,guide,routes`

### Age rating and content rights

Complete the current App Store Connect questionnaire truthfully. The catalogue
contains bars, beach clubs and alcohol references, so do not preselect `4+`.
Confirm that the founder has rights to the name, icon, screenshots, venue
photos and editorial content used in the submitted build.

## Privacy declaration

Use [docs/store-privacy-declarations.md](store-privacy-declarations.md) as the
working answer sheet. Current intended answers:

- Tracking: No.
- Advertising/data-broker sharing: No.
- Account required for travellers: No.
- In-app purchases and tourist payments: None.
- Contact Info: optional name, email and phone from voluntary forms.
- User Content: venue photos submitted for private rights review.
- Identifiers: anonymous first-party guest reference and consent evidence.
- Product Interaction: saves, shares, card opens, directions and booking
  handoffs.
- Other Data: optional trip preferences and campaign fields.

These answers must be rechecked against the final native binary. Adding
analytics, advertising, crash reporting, location, push, or payment SDKs
changes the declaration.

## Review notes

```text
Other Bali is a free curated Bali travel guide. No account or payment is required.

To review the main flow, open the app, choose Build my Bali day, select a moment
and district, open the resulting places, save a place, and use Share list.
District guides and ready-made routes are available from the home and places
screens. Directions and reservation buttons hand off to the venue's verified
external channel. There are no in-app purchases or paid digital goods.

Venue representatives may access a private tokenized onboarding flow, but no
account is required to review the traveller experience. The app remains useful
without installing WhatsApp, Maps or TablePilot; those are optional handoff
destinations.
```

If the final build does not yet contain the app-only flow or offline/local save
behaviour, do not use this note unchanged. Apple requires more than a
repackaged website under guideline 4.2.

## Screenshot shot list

Capture from the final signed build on a real iPhone. Do not use browser chrome,
desktop screenshots, private admin routes, placeholder content, or future UI.

1. Home / Build my Bali day — the product value is understandable without a
   caption.
2. Completed day builder — selected moment, district and group with resulting
   shortlist.
3. Curated places — district/category controls and editorial decision notes.
4. Venue detail — practical fit, directions and verified action handoff.
5. Saved plan/list — local save and Share list action.

Preferred first capture size: 6.9-inch iPhone portrait, 1320 × 2868 PNG.
Prepare the other required iPhone sizes in App Store Connect after the first
device QA pass. Screenshots are not complete in this repository yet.

## Readiness checks recorded 2026-07-15

- `https://www.otherbali.com/support` → HTTP 200.
- `https://www.otherbali.com/privacy` → HTTP 200.
- `https://www.otherbali.com/terms` → HTTP 200.
- `otherbali.com` has Zoho MX records; mailbox send/receive is still not
  tested.
- Xcode 26.3 is installed on the current Mac.
- No `DEVELOPMENT_TEAM` is configured in the Xcode project.
- No signed archive or TestFlight build has been uploaded.
- No final App Store screenshots are present under `store-assets/`.
- Simulator service is currently unavailable in this environment; real iPhone
  smoke testing remains outstanding.

## Founder-only sequence

1. Accept the latest Apple agreement in App Store Connect.
2. Create the iOS app record with the product values above.
3. Select the Apple Developer Team for `com.otherbali.app` in Xcode.
4. Archive and upload a signed build.
5. Test the build on a real iPhone through TestFlight.
6. Capture the five screenshots from that exact build.
7. Complete privacy, age rating, content rights, export compliance and review
   notes.
8. Submit to App Review only after the app-only scenario passes.

