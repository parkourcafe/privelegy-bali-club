# Other Bali - App Store Release Readiness

Date: 2026-07-12
Status: Web/PWA ready for wrapper work; App Store submission is blocked until a native iOS target exists.

## Current Target

Other Bali is currently a Next.js/Vercel web app and installable PWA. The repo does not yet contain:

- `ios/`
- `*.xcodeproj` or `*.xcworkspace`
- `capacitor.config.*`
- Expo/EAS app config
- native signing, bundle id, build number, launch screen, or App Store archive config

Because of that, there is no binary that can be uploaded to App Store Connect yet.

## Recommended Native Path

Use a thin Capacitor iOS shell only if the app keeps enough app-like utility to pass review:

- native display name: `Other Bali`
- bundle id: `com.otherbali.app`
- app opens `https://otherbali.com`
- App Store Support URL: `https://otherbali.com/support`
- Privacy Policy URL: `https://otherbali.com/privacy`
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
`4+` if no unrestricted web browsing, alcohol-focused content, user-generated content, or mature venue content is added. Reassess before submission.

Support URL:
`https://otherbali.com/support`

Privacy Policy URL:
`https://otherbali.com/privacy`

## Privacy Label Draft

Likely data collection to disclose:

- Identifiers: anonymous app/device reference via httpOnly cookie, used for app functionality and analytics.
- Usage Data: card opens, directions clicks, reservation clicks, source scans, offer redemptions, used for app functionality and analytics.
- Diagnostics: only if Vercel/runtime error logs are treated as app diagnostics in the submitted native wrapper.
- Contact Info: not collected from travellers by default. Venue onboarding can collect venue contact name, but that is partner/admin-side, not tourist app signup.

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

P0 - No native iOS target or archive exists.

P1 - `support@otherbali.com` must be a real monitored mailbox before submission.

P1 - App Store screenshots are not prepared yet.

P1 - Apple Developer account, bundle id, signing team, and App Store Connect app record are not configured in repo.

P1 - Final privacy label must be confirmed against the actual native wrapper SDKs. Capacitor, analytics, crash reporting, or push notification SDKs can change the privacy answers.

P2 - `/places` intentionally renders all venues. It is usable on mobile, but native release should consider district-first/lazy rendering before paid acquisition.
