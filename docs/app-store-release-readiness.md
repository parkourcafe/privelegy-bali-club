# Other Bali - App Store Release Readiness

Date: 2026-07-14
Status: Web/PWA production deployed; Capacitor iOS wrapper scaffolded and privacy/icon launch blockers fixed; submission remains blocked on architecture, signing, App Store Connect setup, screenshots, and device QA.

## Current Target

Other Bali is a Next.js/Vercel web app, installable PWA, and now has a Capacitor iOS wrapper scaffold:

- `capacitor.config.ts`
- `ios/App/App.xcodeproj`
- `ios-web/`
- bundle id `com.otherbali.app`
- native display name `Other Bali`

There is still no signed archive uploaded to App Store Connect yet.

## Recommended Native Path

Use a thin Capacitor iOS shell only if the app keeps enough app-like utility to pass review:

- native display name: `Other Bali`
- bundle id: `com.otherbali.app`
- app opens `https://www.otherbali.com`
- App Store Support URL: `https://www.otherbali.com/support`
- Privacy Policy URL: `https://www.otherbali.com/privacy`
- no tourist payments
- no account requirement
- no AI/chatbot
- no App Tracking Transparency prompt unless tracking is added
- no location permission unless a native feature genuinely needs it

Do not submit a plain "website in a wrapper" without the day-builder, saved offers, routes, and app-like mobile UX being visible in review.

## App Store Connect Metadata Draft

App name: `Other Bali`

Subtitle: `Curated Bali days`

Promotional text:
`Find the right place for the moment you are in - coffee, beach day, date night, family lunch, or sunset.`

Description:
`Other Bali is a free curated guide for Bali travellers. Tell us how you want the day to feel, who you are with, and where you want to go. The app turns that into a filtered map of places across Bali, with deeper Canggu routes and confirmed venue offers where available. Travellers never pay Other Bali; venues may pay only when a referred reservation becomes a real seated visit.`

Keywords:
`Bali, travel, restaurants, Canggu, Ubud, Seminyak, Uluwatu, cafes, guide, places`

Category:
`Travel`

Age rating:
Complete the current App Store Connect questionnaire truthfully. The catalogue
includes bars, beach clubs and alcohol references, so do not preselect `4+`.

Support URL:
`https://www.otherbali.com/support`

Privacy Policy URL:
`https://www.otherbali.com/privacy`

## Privacy Label Draft

Likely data collection to disclose:

- Contact Info: first name plus email or WhatsApp in the optional guide form; venue representative name/contact in onboarding.
- Identifiers: anonymous `bp_guest` first-party reference; IP/user-agent evidence for consent and abuse prevention.
- User Content: venue photos voluntarily submitted for private rights review.
- Usage Data: card opens, directions clicks, reservation clicks, source scans, saves, shares, and offer redemptions.
- Other Data: optional travel date, interests, language and source/campaign fields.

The exact App Store Connect answers are recorded in
`docs/store-privacy-declarations.md` and mirrored in the native privacy manifest.

Tracking:

- Answer `No` unless Other Bali links data with third-party data for advertising or shares data with a data broker.

Payments:

- No in-app purchases.
- No tourist-side purchases.
- Reservation handoff goes to an external venue/reservation flow; Other Bali does not sell digital goods.

## Review Notes Draft

`Other Bali is a free curated Bali travel guide. No account is required. The main flow is: open the app, choose how you want the day to feel in the Build Today tool, browse filtered places, open directions, or view confirmed offers where available. The app does not charge travellers and does not sell digital content. Venue monetization, if any, happens outside the traveller experience and is based on confirmed seated reservations through partner systems.`

If reviewer needs a path:

1. Open the app.
2. Tap `Build my Bali day`.
3. Choose day context.
4. Tap the map/places CTA.
5. Open a place card and directions.
6. Open `Your Canggu day` to see routes and confirmed offers.

No demo account is required.

## Web/PWA Verification

Local production verification on 2026-07-12:

- `npm run lint` passed.
- `npm run build` passed.
- Mobile audit passed for `/`, `/support`, `/privacy`, `/terms`, `/plan`, and `/places`.
- No horizontal overflow at 390px width.
- No small mobile tap targets on the audited pages.
- No console/status errors on the audited pages.
- `/places` has a safe editorial seed fallback when Supabase is unavailable, so the public catalogue does not render as an empty app in local or degraded review conditions. Production should still use Supabase as the source of truth.

## Release Blockers

P0 - Apple Developer signing team is not configured in Xcode.

P0 - App Store submissions now require Xcode 26+. This Mac can run Xcode 26.3,
but Xcode is not installed and the current 14 GB free disk space is insufficient.

P0 - App Store Connect app record for `com.otherbali.app` is not created yet.

P0 - No signed archive has been uploaded to App Store Connect yet.

P0 - Real iPhone and TestFlight QA are still required.

P1 - `support@otherbali.com` must be a real monitored mailbox before submission.

P1 - App Store screenshots are not prepared yet.

P1 - Apple Developer account, bundle id, signing team, and App Store Connect app record are not configured in repo.

P1 - Final privacy label must be confirmed against the archived binary. Analytics, crash reporting, push notification, or advertising SDKs would change the answers.

P1 - The current Capacitor wrapper loads `https://www.otherbali.com`; this is practical for the current Next/Supabase architecture, but remains an App Review risk if Apple treats it as a repackaged website.

P1 - Replacing `server.url` with a complete bundled shell requires an explicit
master-architecture amendment and a client/offline data design; it is not a
safe configuration-only change.

P2 - `/places` intentionally renders all venues. It is usable on mobile, but native release should consider district-first/lazy rendering before paid acquisition.
