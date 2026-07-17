# Other Bali 1.0 — store submission package

Date: 2026-07-18

Status: copy and capture plan are ready for owner review. Do not upload these
materials as a release claim until the exact signed IPA/AAB/APK has passed the
final device matrix. Store submission and publication require separate owner
approval.

## Canonical product facts

- Product name: **Other Bali**
- Apple bundle ID / Android application ID: `com.otherbali.app`
- Apple version: `1.0` (`build 4`)
- Android version: `1.0.0` (`versionCode 2`)
- Category: Travel
- Price: Free
- Current in-app language: English
- Account creation or sign-in: not available and not required
- Payments, subscriptions, in-app purchases and paid digital goods: none
- Advertising: none
- Core product: `Places`, `Routes` and `Saved`
- Primary website: `https://www.otherbali.com`
- Support URL: `https://www.otherbali.com/support`
- Privacy policy URL: `https://www.otherbali.com/privacy`
- Support email: `support@otherbali.com` — verify inbound delivery before submission

The app provides a resident-curated catalogue of Bali places, public venue
details and ready-made routes. A user can save place and route summaries on the
device for later/offline reference, share a place or route with the native
share sheet, and open an external map or a venue's official website. The app
does not promise live availability, opening hours, prices or booking inventory.

## Apple App Store

### Listing copy

**Name**

`Other Bali`

**Subtitle**

`Curated Bali places & routes`

**Promotional text**

`Browse resident-curated places and routes around Bali, save useful public summaries for offline reference, and share a place or route from your device.`

**Description**

`Other Bali is a resident-curated guide to places and routes around Bali.`

`Explore cafés, restaurants, warungs, bars, beach clubs, spas and other useful places across the island. Open a place to read a concise public summary, see practical details, and continue to Maps or the venue's official website when available.`

`Use Other Bali to:`

`- browse curated places and filter the catalogue by area or category;`
`- open practical venue details;`
`- follow ready-made routes and view their stops;`
`- save places and routes on your device for later or offline reference;`
`- share a place or route using your device's share sheet;`
`- open directions in an external maps app or visit an official venue page.`

`No account is required. Other Bali contains no subscriptions, in-app purchases, paid digital content or advertising. The current app interface is in English.`

`Venue information is editorial and may change. Confirm time-sensitive details directly with the venue before travelling.`

**Keywords**

`bali,travel,guide,places,routes,cafes,restaurants,ubud,canggu,uluwatu,seminyak`

Check the final comma-separated value in App Store Connect; it must remain
within Apple's current keyword limit.

**Primary category**

`Travel`

**Copyright**

`2026 [LEGAL RIGHTS HOLDER]`

The bracket is intentional: use the legal person or entity that owns the app;
do not infer it from the brand or developer-account display name.

**Version 1.0 release notes**

`First release of Other Bali, with curated places, ready-made routes, on-device saves, offline access to saved summaries, native sharing and external map links.`

### App Review notes

`Other Bali is a free, English-language Bali guide. It has no registration, login, subscription, payment, in-app purchase, advertising or paid digital content. No demo account is needed.`

`Review flow: launch the app and allow the Places catalogue to load; open any place; save it; return to Places; open Routes and select a route; save or share it; then open Saved to confirm the locally stored items. Maps and official-site actions intentionally open an external application or browser.`

`Saved place and route summaries are stored locally on the device and can be opened offline after they have been saved. Venue information is not live inventory and should be confirmed with the venue.`

Review contact name, phone number and email: `[APP REVIEW CONTACT — OWNER INPUT REQUIRED]`.

### App privacy and age rating

- Use the verified answers in `docs/store-privacy-declarations.md`; do not select
  “Data Not Collected” merely because the app has no account. Production API
  request metadata and every third-party SDK/service must be included in the
  final assessment.
- Select **Tracking: No** unless the shipped binary or production stack changes.
- Answer the current age-rating questionnaire truthfully. The catalogue can
  contain bars, beach clubs and references to alcohol, and the app opens
  external Maps and official websites. Do not preselect or advertise a `4+`
  rating; accept the rating calculated by App Store Connect.

## Google Play

### Main store listing

**App name**

`Other Bali`

**Short description**

`Resident-curated Bali places and routes, saved for offline use.`

**Full description**

`Other Bali is a resident-curated guide to places and routes around Bali.`

`Explore cafés, restaurants, warungs, bars, beach clubs, spas and other useful places across the island. Each place has a concise public summary and practical details, with links to an external maps app or the venue's official website when available.`

`With Other Bali you can:`

`• browse curated places by area or category;`
`• read practical venue summaries;`
`• explore ready-made routes and their stops;`
`• save places and routes on your device;`
`• reopen saved summaries when you are offline;`
`• share a place or route using Android's share sheet;`
`• open external directions or an official venue page.`

`No account is required. Other Bali contains no subscriptions, in-app purchases, paid digital content or advertising. The current interface is in English.`

`Venue information may change. Confirm time-sensitive details directly with the venue before travelling.`

**Release name**

`1.0.0 (2)`

**Release notes**

`First release: curated Bali places, ready-made routes, on-device saves, offline access to saved summaries, sharing and external map links.`

### Google Play review and declarations

- App access: **All functionality is available without special access**; no
  credentials or instructions are required.
- Ads: **No**.
- In-app purchases/subscriptions: **None**.
- Target audience/content rating: answer the current questionnaires using the
  actual catalogue. Include alcohol references and external links; let Google
  calculate the final rating rather than assuming a child-safe rating.
- Data safety: copy only the verified classifications from
  `docs/store-privacy-declarations.md`. Reconfirm them against the exact AAB,
  production API/log retention and Play SDK Index before submission.
- Reviewer note: `Open Places, select a venue, save it, open Routes and select a route, then open Saved. No login or payment is required. Maps and official-site actions leave the app intentionally.`

## RuStore

The listing may be written in Russian, but it must state clearly that version
1.0 has an English interface.

**Название**

`Other Bali`

**Краткое описание**

`Отобранные места и маршруты по Бали с сохранением для офлайн-доступа.`

**Подробное описание**

`Other Bali — гид по местам и маршрутам Бали, составленный людьми, которые живут на острове.`

`В каталоге собраны кафе, рестораны, варунги, бары, пляжные клубы, спа и другие полезные места. В карточке места можно прочитать краткое описание и практическую информацию, а затем открыть маршрут во внешнем приложении карт или официальный сайт заведения, если ссылка доступна.`

`В приложении можно:`

`• просматривать отобранные места по районам и категориям;`
`• читать практические описания мест;`
`• открывать готовые маршруты и их остановки;`
`• сохранять места и маршруты на устройстве;`
`• просматривать сохранённые материалы без подключения к интернету;`
`• делиться местом или маршрутом через системное меню;`
`• переходить во внешние карты и на официальные страницы заведений.`

`Регистрация не требуется. В Other Bali нет подписок, встроенных покупок, платного цифрового контента и рекламы. Интерфейс версии 1.0 доступен на английском языке.`

`Информация о заведениях может меняться. Перед поездкой уточняйте актуальные сведения непосредственно у заведения.`

**Что нового в версии 1.0.0**

`Первый выпуск: каталог мест Бали, готовые маршруты, сохранение на устройстве, офлайн-доступ к сохранённым материалам, отправка через системное меню и ссылки на карты.`

**Комментарий модератору**

`Регистрация, тестовый аккаунт и оплата не требуются. Для проверки откройте Places, выберите место и сохраните его; затем откройте Routes, выберите маршрут и перейдите в Saved. Кнопки карт и официального сайта намеренно открывают внешнее приложение или браузер. Интерфейс приложения — английский.`

For the RuStore age rating, disclose references to bars/alcohol and external
links. Do not assume the same numeric/label rating as Apple or Google; use the
rating produced by the current RuStore questionnaire.

## Final screenshot shot list

Capture screenshots only from the exact signed, device-tested release build.
Use real public catalogue data, a clean status bar, no debug overlays, no
browser chrome, no test credentials, no private admin views and no claims about
features that are not in version 1.0. Keep captions in English because the
shipped UI is English; a Russian RuStore listing must not imply Russian UI.

Capture this five-screen narrative on both iPhone and Android:

1. **Places overview** — a populated catalogue with the app identity and useful
   area/category controls visible.
2. **Place detail** — a strong representative venue showing the editorial
   summary and actions, without sensitive or unstable promotional claims.
3. **Routes overview** — the list of available curated routes.
4. **Route detail** — a route with its stops and save/share affordances visible.
5. **Saved** — at least one saved place and route, demonstrating on-device
   utility; capture online unless the visible offline state is intentional.

Optional sixth image, if the store slot and final UI support it: a saved item
opened while the app shows its genuine offline/cached state.

For Apple, provide every screenshot family required by the enabled device
destinations in App Store Connect. For the current iPhone marketing set, capture
portrait screenshots at an accepted 6.9-inch size (for example `1320 x 2868`)
and let App Store Connect scale only where it explicitly supports scaling. If
the submitted binary supports iPad and App Store Connect requests iPad media,
capture genuine iPad screenshots rather than enlarging phone images.

For Google Play and RuStore, export clean portrait `9:16` screenshots (a
practical source size is `1080 x 1920`) and confirm the current portal's count,
file-size and dimension validations at upload time. Do not reuse the temporary
debug QA captures as store artwork.

## Required visual and listing assets

- Apple App Store icon: `store-assets/app-store-icon-1024.png`, `1024 x 1024`
  PNG, opaque/no alpha, and visually identical to the icon in the signed IPA.
- Google Play icon: `store-assets/google-play-icon-512.png`, `512 x 512` PNG.
- RuStore icon: `store-assets/rustore-icon-512.png`, `512 x 512` PNG; reconfirm
  the current portal format at upload.
- Google Play feature graphic: create a `1024 x 500` PNG or JPEG using the
  canonical Other Bali identity. Do not place store badges, pricing claims,
  awards or unreadable screenshots in it.
- Store screenshots: create the final iPhone and Android sets described above.
- Support/privacy URLs: verify both return HTTPS 200 without authentication on
  the day of submission.
- Legal seller/developer name, copyright holder, App Review contact and store
  support contact: enter owner-verified legal data; do not copy a brand name
  into legal fields by assumption.

Before upload, compare every icon, version string, screenshot and declaration
with the exact signed artifact. A metadata-ready document is not evidence that
the binary is signed, tested, submitted or approved.
