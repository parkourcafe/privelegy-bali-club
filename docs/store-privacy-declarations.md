# Other Bali Store Privacy Declarations

Date: 2026-07-14
Status: code-aligned draft for App Store Connect and RuStore Console

This is the operator checklist for the submitted iOS and Android builds. It
must be reviewed again whenever analytics, crash reporting, advertising,
location, push notifications, payments, accounts, or native SDKs are added.

## Shared Answers

- Tracking across third-party apps or websites: **No**.
- Advertising or data-broker sharing: **No**.
- Google Analytics in the submitted production build: **Disabled**.
- Account required: **No**.
- Tourist payments or in-app purchases: **No**.
- Precise or coarse device location permission: **Not requested**.
- Contacts, microphone, health, financial information: **Not collected**.

## Data Collected

| Store category | What Other Bali collects | Required? | Linked to identity? | Purpose |
| --- | --- | --- | --- | --- |
| Name | First name in the optional guide form; venue representative name in onboarding | Optional | Yes | App functionality |
| Email address | Optional guide contact or venue contact | Optional | Yes | App functionality |
| Phone number | Optional WhatsApp guide contact or venue contact | Optional | Yes | App functionality |
| User ID | Random `bp_guest` first-party cookie | Automatic | No | App functionality, analytics |
| Device ID | IP address and user agent retained with limited consent evidence | Conditional | Yes when attached to a consent record | App functionality / fraud prevention |
| Photos or videos | Venue photos submitted for private rights review | Optional, partner flow | Yes | App functionality |
| Product interaction | Page/card opens, saves, shares, directions, booking handoffs, redemptions | Consent-controlled | No | App functionality, analytics |
| Other data | Optional travel date, interests, language, source and campaign fields in the guide form | Optional | Yes | App functionality |

The random guest reference and first-party interaction events are not joined to
guide-lead contact records. Venue-facing reporting uses aggregate counts by
default. Other Bali does not use these data for cross-app tracking.

## App Store Connect

Set **Data Used to Track You** to `No` for every category.

Declare as **Data Linked to You**:

- Contact Info: Name, Email Address, Phone Number.
- User Content: Photos or Videos.
- Identifiers: Device ID, conservatively, because IP/user-agent evidence may be
  stored with an identifiable consent submission.
- Other Data: optional travel date, trip interests, language and campaign data.

Declare as **Data Not Linked to You**:

- Identifiers: User ID (`bp_guest`, a random first-party reference).
- Usage Data: Product Interaction.

Purposes:

- App Functionality for all declared categories.
- Analytics only for anonymous User ID and Product Interaction.

Do not declare crash or performance diagnostics unless the final binary adds a
native crash-reporting SDK. Ordinary processor/server security logs remain
covered by the public privacy policy and processor agreements.

## RuStore Data Safety

Use the same factual scope in the RuStore data declaration:

- personal data is collected only where the user or venue representative
  submits it;
- first-party usage events and a random device reference support saves,
  sharing, attribution and aggregate product measurement;
- data is encrypted in transit over HTTPS;
- no data is sold and no advertising tracking is used;
- deletion/reset is available at `/privacy/choices`, with full requests through
  `support@otherbali.com` once the mailbox is operational;
- privacy policy URL: `https://www.otherbali.com/privacy`.

## Release Verification

Before answering the store questionnaires, verify the exact production binary:

1. Inspect all native dependencies and merged privacy manifests.
2. Confirm no analytics, advertising, crash or push SDK was added.
3. Confirm the binary requests no location, camera, microphone or contacts
   permission. A web file picker for a voluntary venue-photo submission is not a
   broad Photos-library permission.
4. Confirm `/privacy`, `/privacy/choices`, `/support` and `/terms` are reachable.
5. Confirm `support@otherbali.com` accepts mail and is monitored.
