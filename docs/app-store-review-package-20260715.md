# Other Bali — App Store review package

Date: 2026-07-15
Owner: Agent B (store readiness)
Status: release candidate in progress. Signing, archive export and the 6.9-inch
screenshot set are validated; do not submit until the final binary passes
real-device/TestFlight QA and App Store Connect declarations are complete.

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

`Start with the day you actually want: a slow morning, focused work, a midday reset, golden hour, a late dinner or a special occasion. Choose your area and trip length, then keep the plan on your iPhone.`

`Inside the app you can:`

- build a Bali day around mood, district and trip length;
- keep the latest plan available offline on the device;
- save Other Bali place references without creating an account;
- share a plan through the native iOS Share Sheet;
- open the live Other Bali guide for current places, menus, directions and
  verified booking or delivery channels.

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

To review the main flow, open the app, select a mood, district and trip length,
then tap Build my day. The plan is stored locally and remains available when the
device is offline. Use Share plan to open the native iOS Share Sheet. Place
links using the otherbali://place/{slug} scheme add a local saved-place
reference. Browse the full guide opens the live Other Bali website for current
places, menus, directions and verified venue actions. There are no in-app
purchases or paid digital goods.

No account is required to review the traveller experience. The app-only plan,
saved-place references and offline restore do not require WhatsApp, Maps or
TablePilot; those services are optional handoff destinations in the live guide.
```

If the final build does not yet contain the app-only flow or offline/local save
behaviour, do not use this note unchanged. Apple requires more than a
repackaged website under guideline 4.2.

## Screenshot shot list

Capture from the final release-candidate binary on the 6.9-inch iPhone
Simulator, then compare against a real iPhone/TestFlight smoke run. Do not use
browser chrome, desktop screenshots, private admin routes, placeholder content,
or future UI.

1. Home — mood, district and duration builder.
2. Builder selection — Golden hour selected.
3. Saved day plan — Ubud, three days, stored on device.
4. Saved places — three deep-linked venue references stored locally.
5. Native Share Sheet — read-only plan link handoff.

The committed set is under `store-assets/screenshots/ios-6.9/`; every file is a
1320 × 2868 portrait PNG from the exact iPhone 17 Pro Max simulator build.
Prepare any additional size requested by App Store Connect only after the
real-device/TestFlight comparison passes.

## Readiness checks recorded 2026-07-15

- `https://www.otherbali.com/support` → HTTP 200.
- `https://www.otherbali.com/privacy` → HTTP 200.
- `https://www.otherbali.com/terms` → HTTP 200.
- `otherbali.com` has Zoho MX records; mailbox send/receive is still not
  tested.
- Xcode 26.3 is installed on the current Mac.
- Apple Team `KB7VPWHTTM` and bundle ID `com.otherbali.app` are configured.
- A Release archive exported successfully with an Apple Distribution
  certificate and App Store profile; `get-task-allow=false` and
  `beta-reports-active=true` were verified.
- Final archive: `/private/tmp/OtherBali-1.0-build1-final-20260715.xcarchive`.
  Final IPA SHA-256:
  `6c9d8d06e92f9d988274853fb0264aad5326cf3ebb38e42e856aab5469ea2e27`.
- The first upload reached App Store Connect authentication and failed only
  because the `com.otherbali.app` app record did not yet exist
  (`missingApp(bundleId: "com.otherbali.app")`).
- The App Store Connect creation form is prepared but has not been submitted;
  creating the cloud record still requires explicit founder confirmation.
- Five 6.9-inch screenshots are committed at 1320 × 2868 PNG.
- Simulator smoke checks passed for builder selection, plan persistence, three
  place deep links and the native Share Sheet.
- The same final development archive installed and launched successfully on a
  paired physical iPhone 16 Pro Max. The complete interactive/offline scenario
  still needs to be repeated from the distributed TestFlight build.

## Founder-only sequence

1. Confirm creation of the prepared iOS app record in App Store Connect.
2. Upload the final signed build and wait for App Store processing.
3. Test that exact build on a real iPhone through TestFlight.
4. Compare the TestFlight flow with the committed five-shot simulator set.
5. Complete privacy, age rating, content rights, export compliance and review
   notes.
6. Confirm the final App Review submission separately; do not submit merely
   because the build processed successfully.
