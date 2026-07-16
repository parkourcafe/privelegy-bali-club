# Other Bali — App Store review package

Date: 2026-07-16
Owner: Agent B (store readiness)
Status: build `1.0 (2)` is uploaded, processed and installed through
TestFlight. The entire 6.9-inch screenshot set was regenerated from a clean
build `1.0 (2)` simulator binary; signing, archive and the deployed public share
fallback are validated. Do not submit until the final TestFlight binary passes
the remaining real-device checks and the App Store Connect declarations are
complete.

## Product record

| Field | Value |
|---|---|
| App name | Other Bali |
| Platform | iOS |
| Bundle ID | `com.otherbali.app` |
| App Store Connect ID | `6791214357` |
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
device is offline. Use Share plan to open the native iOS Share Sheet. The shared
HTTPS link opens a read-only summary for recipients who do not have the app.
Place links using the otherbali://place/{slug} scheme add a local saved-place
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
1320 × 2868 portrait PNG. On 2026-07-16 all five files were regenerated in one
clean iPhone 17 Pro Max simulator run from `com.otherbali.app` version
`1.0 (2)`. The embedded `public/app-shell.js` SHA-256 matched the release
source exactly:
`286bc004068453e6be229495084a6fdb8c6195adab804f24126894fdfbfdeb43`.
Prepare any additional size requested by App Store Connect only after the
real-device/TestFlight comparison passes.

## Readiness checks recorded 2026-07-16

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
- Release archive: `/private/tmp/OtherBali-1.0-build2-20260716.xcarchive`.
- App Store IPA:
  `/private/tmp/OtherBali-1.0-build2-export/App.ipa`.
- IPA SHA-256:
  `6f2a05e42d9558c34edfde5505bfe9d28bbb4d6d562339abf6b2051045ecbad3`.
- The distribution payload reports version `1.0`, build `2`,
  `ITSAppUsesNonExemptEncryption=false`, `get-task-allow=false` and
  `beta-reports-active=true`; archive and IPA signatures validate.
- The founder confirmed creation of the `com.otherbali.app` App Store Connect
  record; Apple assigned app ID `6791214357`.
- Build `1.0 (1)` uploaded successfully on 2026-07-15. App Store Connect
  accepted and processed it; TestFlight build UUID:
  `d1321d49-990a-4fc7-872e-b2cc40142637`.
- Build `1.0 (2)` uploaded successfully through Xcode on 2026-07-16 at
  `09:30:53Z`. Upload identifier:
  `af6510e9-bb72-45e4-9eef-15d52f22aa7c`. Xcode reported no upload errors or
  warnings. Apple processed the build and TestFlight automatically installed
  it on the paired physical iPhone; device inspection reports version `1.0`,
  bundle version `2`.
- The build-level `What to Test` instructions describe mood/district/duration,
  plan restore, place deep links, offline restore and the native Share Sheet.
- Internal group `Founder QA` was created with automatic distribution and has
  build `1.0 (1)` assigned. On 2026-07-15 Apple finished synchronizing the
  existing Account Holder/Admin eligibility: `saidalarust@gmail.com` was added
  as the single internal tester and App Store Connect reports status `Invited`.
  No second App Store Connect user or Apple ID was created.
- Five 6.9-inch screenshots are committed at 1320 × 2868 PNG. After the mixed
  build-number evidence was discovered, the full set—not only the Share
  Sheet—was recaptured from a clean build `1.0 (2)` installation:
  - `01-home.png`:
    `3d0f292b2a4241161f186e05bb23f60578cd130205175a0f22a3fc54738a6797`
  - `02-builder-selection.png`:
    `cd966a8fbbe92161b9347b30f358e034a83c8525392656216a7513350d949d35`
  - `03-day-plan.png`:
    `42b68125b2b7e018d8324ea99a347d5db155d682d423be639a560bee0a72c845`
  - `04-saved-places.png`:
    `c8c330ff2214f813835b7d74db80727383cb9a04378bbb705ce0834419a475be`
  - `05-share-sheet.png`:
    `d16b14d11c5815b53563c96022037ac6c80f2bc5bdd9335f7fcebd538fa5b1bd`
- Simulator smoke checks passed for builder selection, plan persistence, three
  place deep links and the native Share Sheet. The final Share Sheet screenshot
  shows the public `otherbali.com` fallback rather than an app-only custom
  scheme.
- The noindex public route,
  `/plan/shared?m={mood}&district={district}&days={duration}`, validates every
  input against the app vocabulary and links recipients to the current district
  guide and places catalogue. It is merged in production release
  `2e7e30d9309ed34abee6a4011eea2f618aff11c9`; the exact Golden hour / Ubud /
  three-day URL returns HTTP 200 and a `noindex` robots directive.
- TestFlight build `1.0 (1)` installed and launched on the paired physical
  iPhone 16. Physical-device screenshots confirm plan creation, three saved
  places and local persistence after termination and relaunch.
- Physical Share Sheet and offline restore still need to be repeated with the
  distributed build `1.0 (2)`. Automated real-device control reached the signed
  WebDriverAgent twice, but iOS timed out before enabling automation mode.
- An independent physical-device persistence check was completed on the
  installed TestFlight build `1.0 (2)`:
  - `devicectl` launched the installed `com.otherbali.app`, confirmed its
    process, terminated it, and copied its WebKit local-storage database before
    and after the relaunch cycle;
  - both copies have SHA-256
    `94c680542ba9f151a08b140211208af42528bb896ee4da966d2a27dec79cf1cc`;
  - the database contains the saved plan
    `golden-hour / ubud / 3 days`, captured at
    `2026-07-16T08:30:02.016Z`;
  - it also contains three saved-place references:
    `locavore-nxt`, `room4dessert`, and `seniman-coffee-studio`.
- This proves physical build 2 persistence across termination and relaunch.
  The native Share Sheet and the explicit networking-disabled restore remain
  manual physical-device smoke checks; simulator evidence is not substituted
  for them.

## Founder-only sequence

1. Run the final Share Sheet and offline-restore smoke checks on the installed
   TestFlight build `1.0 (2)`.
2. Complete privacy, age rating, content rights, export compliance, support
   contact and review notes in App Store Connect.
3. Select build `1.0 (2)` and upload the five final screenshots.
4. Confirm the final App Review submission separately; do not submit merely
   because the build processed successfully.
