# Other Bali Store Privacy Declarations

Date: 2026-07-18
Status: native release-candidate answers for iOS 1.0 (4) and Android 1.0.0 (2)

Use this document for the submitted `com.otherbali.app` binaries. Website forms
and the browser-only `bp_guest` cookie are described in the public privacy policy
but are not part of the native app's store declaration. Re-audit these answers if
an account, analytics, advertising, crash reporting, push, payments, or another
native SDK is added.

## Verified native scope

- No account, login, payment, subscription, or in-app purchase.
- No advertising, sale of data, or tracking across apps or websites.
- No analytics, advertising, crash-reporting, or push SDK in the native binary.
- No device location, advertising ID, contacts, camera, microphone, or Photos
  permission.
- Saved places, saved routes, cached catalogue data, and navigation state remain
  on the device.
- The app calls `https://www.otherbali.com/api/mobile/v1/*` to load catalogue,
  venue, and route data. Vercel processes the request path, full IP address,
  IP-derived approximate city/country, user agent, request ID, response status,
  and operational diagnostics. On the current Pro plan runtime logs are
  accessible for approximately one day.
- Mobile API responses do not create `bp_guest` or another persistent identifier.
- External Maps, official sites, and the system share sheet open only after a
  user action and operate under their own privacy terms.

## App Store Connect

Set **Data Used to Track You** to **No** for every category.

Declare these three types as **Data Linked to You**. This is deliberately
conservative because IP address and user agent are not anonymized before the
hosting provider retains the operational request record.

| App Store category | Data type | Required | Purpose | Tracking |
| --- | --- | --- | --- | --- |
| Location | Coarse Location | Yes, for online catalogue requests | App Functionality | No |
| Usage Data | Product Interaction | Yes, request paths reveal a catalogue, place, or route request | App Functionality | No |
| Diagnostics | Other Diagnostic Data | Yes, operational request/status diagnostics | App Functionality | No |

Do not declare Name, Email Address, Phone Number, Photos or Videos, User ID,
Device ID, Precise Location, Purchases, Financial Information, Contacts, or
Advertising Data for this native release.

The source `PrivacyInfo.xcprivacy` must contain exactly the same three collected
data types, `NSPrivacyTracking = false`, and the existing Capacitor Preferences
required-reason declaration `UserDefaults / CA92.1`.

## Google Play Data safety

- Does the app collect data? **Yes**.
- Does the app share data? **No**. Vercel is the contracted service provider
  processing data on the developer's behalf.
- Is all data encrypted in transit? **Yes**, HTTPS only.
- Is collection optional? **No** while the user uses the online catalogue.
- Account creation/deletion requirement: **Not applicable; the app has no
  accounts**.
- Advertising, cross-app tracking, or sale of data: **No**.

Declare:

| Google Play type | Purpose |
| --- | --- |
| Approximate location | App functionality; Fraud prevention, security and compliance |
| App interactions | App functionality |
| Diagnostics | App functionality; Analytics for operational health; Fraud prevention, security and compliance |

Do not declare Device or other IDs unless a persistent identifier is introduced
later. Do not describe ordinary runtime troubleshooting as advertising or
cross-app analytics.

## RuStore data safety

Use the same factual scope:

- приложение обрабатывает приблизительное местоположение по IP, путь запроса и
  технические данные запроса для загрузки каталога, безопасности и устранения
  ошибок;
- данные обязательны только при использовании онлайн-каталога и передаются по
  HTTPS;
- данные не продаются, не используются для рекламы и не передаются независимым
  третьим лицам; Vercel выступает обработчиком по поручению разработчика;
- аккаунтов, платежей и рекламного идентификатора нет;
- сохранённые места, маршруты и кеш находятся на устройстве;
- privacy policy: `https://www.otherbali.com/privacy`.

## Release verification

Before answering the store questionnaires for the exact signed binaries:

1. Inspect merged native privacy manifests, dependencies, permissions, and
   linked SDKs.
2. Confirm no analytics, advertising, crash, push, account, or payment SDK was
   added.
3. Confirm the three App Store types above exactly match
   `PrivacyInfo.xcprivacy` and App Store Connect.
4. Recheck the current hosting log fields and retention; update the public policy
   if either changes.
5. Confirm `/privacy`, `/support`, and `/terms` return HTTP 200 and that
   `support@otherbali.com` is monitored.
6. Re-run this audit after any feature or provider change. Never answer “Data Not
   Collected” while operational request metadata is retained.
