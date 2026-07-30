# Other Bali Store Privacy Declarations

Date: 2026-07-30
Status: audit draft for iOS 1.0 (7) and Android 1.0.0 (4)

Use this document only for the current `com.otherbali.app` release candidate.
It records what the source and merged native manifests do; it is not evidence
that the corresponding answers have already been entered in a store console.
Re-audit after any account, analytics, advertising, crash reporting, push,
payment, map-provider, sync, or retention change.

## Verified native scope

- No account, login, payment, subscription, in-app purchase, advertising, sale
  of data, or cross-app tracking.
- No advertising, analytics, crash-reporting, or push SDK is active in the
  native binary.
- The merged Android release manifests request exactly:
  `INTERNET`, `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`,
  `ACCESS_NETWORK_STATE`, and the app-signature-only
  `com.otherbali.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`. The last item is
  an Android compatibility permission and is not a user data permission.
- iOS requests When In Use location. Android requests approximate/precise
  location only after the user taps **Use my current area**. The selection flow
  uses `enableHighAccuracy: false`, maps the returned coordinates to the nearest
  supported Bali area in memory, and sends only that area slug to the decision
  service. The raw device-location fix is not persisted or transmitted by this
  flow. Denial preserves the manual-area path.
- Device location and IP-derived location are separate disclosures. A device
  location fix is processed locally after an explicit action. Online requests
  expose an IP address to Vercel, which derives an approximate city/country.
- No advertising ID, contacts, camera, microphone, or Photos permission is
  requested.
- Offline Mapbox Level 3 remains fail-closed on both platforms, with different
  native boundaries. The iOS binary does not link or embed Mapbox Maps,
  Navigation, Directions, Common, or Turf; its registered local Capacitor bridge
  reports all availability flags false and zero storage. Android still includes
  the Mapbox provider, but the public manifest reports
  `blocked_pending_acceptance`, exposes no downloadable regions, and provider
  telemetry defaults disabled. No current user flow sends device location to
  Mapbox or starts onboard routing.

## Server-side collection introduced by sync

The current candidate is **not local-only**:

- Saved, Today, Trip, Visited, and Note changes are stored locally first and are
  then sent to `https://www.otherbali.com/api/mobile/v1/sync`.
- The app creates a random installation-scoped `g_…` reference from 12
  cryptographically random bytes, stores it in Capacitor Preferences, displays
  it under **My Bali → Privacy & device data**, and sends it only in the
  `X-Other-Bali-Guest` header. The website uses a separate `bp_guest` httpOnly
  cookie.
- Supabase stores that reference together with saved venue slugs, Today items,
  trip structure, visited state, free-form note text, mutation timestamps,
  entity versions, idempotency keys, and bounded mutation payloads.
- The candidate provides a two-step in-app deletion action. The client accepts
  deletion only after the server returns HTTP success and `{ "ok": true }`;
  it then discards the old sync queue, clears local personal plans, deletes the
  old reference, and rotates to a fresh empty reference. A failed or partial
  cleanup keeps personal writes and sync quarantined until a successful retry.
- Mutable sync state is retained until the traveller uses the in-app deletion
  action or supplies the displayed reference in a supported deletion request.
  Uninstalling alone cannot notify the server, so the app tells the traveller
  to delete first or save the reference before uninstalling.
- After confirmed deletion, only a bare revoked reference and erasure timestamp
  remain indefinitely to reject delayed/replayed writes. Source, area, Saved,
  Today, Trip, notes, visited, decision, feed, sync, and unrelated consent state
  are removed. Existing redemption proof and its corresponding granted consent
  evidence are detached to an unreachable proof anchor; device fields such as
  consent user agent are removed.
- Catalogue, place, route, event, decision, and sync requests also cause Vercel
  to process the request path, IP address, IP-derived approximate location, user
  agent, request ID, response status, and operational diagnostics. The public
  policy currently says those runtime logs are accessible for up to one day.

The source privacy policy now describes this scope and deletion model. It must
be deployed and its HTTP 200 response verified before store submission. The
processor/service-provider classification of Vercel and Supabase and any
retained redemption-proof obligation still require owner/legal confirmation;
the store forms must not overstate that review as complete.

## App Store Connect

Set **Data Used to Track You** to **No** for every category.

Use the following conservative disclosure for the current sync-enabled
candidate. All purposes are **App Functionality** and tracking is **No**.

| App Store category | Data type | Why it is collected |
| --- | --- | --- |
| Location | Coarse Location | On-device GPS is immediately reduced to an area before transmission; online requests also expose IP-derived approximate location |
| Identifiers | Device ID | Random installation-scoped `g_…` reference used only to bind and delete sync state |
| User Content | Other User Content | Trip structure and optional note text sent by the user |
| Usage Data | Product Interaction | Requested paths, saved/Today/Trip actions, and selected public entities |
| Diagnostics | Other Diagnostic Data | Request IDs, response status, and operational diagnostics |

Mark all five types as **Data Linked to You** as a conservative answer because
sync records are bound to an installation-scoped Device ID and network requests
may be associated with that device through the identifier or operational
metadata. This does not claim that every public catalogue request carries the
`g_…` identifier. Mark tracking **No**. Do not declare Precise Location: Apple
says a location fix that is immediately coarsened on device before transmission
is disclosed as Coarse Location, and the current area-selection flow does not
send raw coordinates.

Do not declare Name, Email Address, Phone Number, Photos or Videos, Purchases,
Financial Information, Contacts, Advertising Data, or User ID for this
release unless a final binary/provider inspection finds a new collection path.

### iOS privacy manifest

The source `ios/App/App/PrivacyInfo.xcprivacy` and exact verifier declare:

- `NSPrivacyCollectedDataTypeCoarseLocation`
- `NSPrivacyCollectedDataTypeDeviceID`
- `NSPrivacyCollectedDataTypeOtherUserContent`
- `NSPrivacyCollectedDataTypeProductInteraction`
- `NSPrivacyCollectedDataTypeOtherDiagnosticData`

Each is linked, not used for tracking, and used for App Functionality. The
signed IPA and App Store Connect answers must be rebuilt/updated from this exact
source before upload; the older IPA is stale evidence.

## Google Play Data safety

- Does the app collect data? **Yes**.
- Does the app share data? **Owner/legal evidence pending.** Answer **No** only
  after confirming that both Vercel and Supabase qualify as service providers
  processing on the developer's behalf under the applicable agreements.
- Is all data encrypted in transit? **Yes**, HTTPS only.
- Account creation/deletion requirement: **No account is created**, but the
  app does create a persistent anonymous sync identifier and server-side state.
- Is collection optional? Online operational metadata is required while using
  online features. Device location is optional and locally processed. Saved,
  Today, Trip, Visited, and Note sync occurs after the corresponding user
  action. The release has no separate “local only” switch for those actions.
- Is all collection ephemeral? **No**. Mutable sync state persists until
  confirmed deletion. A stripped revocation marker remains indefinitely for
  replay prevention. Vercel runtime logs are currently described as retained
  for up to one day.
- Advertising, cross-app tracking, or sale of data: **No**.

Declare, subject to the current Play Console wording:

| Google Play type | Purpose |
| --- | --- |
| Approximate location | App functionality |
| App interactions | App functionality |
| Other user-generated content | App functionality (trip structure and notes) |
| Device or other IDs | App functionality (anonymous sync binding and deletion) |
| Diagnostics | App functionality; Analytics (service operation and troubleshooting) |

The Data safety form, public privacy policy, data-deletion answer, and actual
operator procedure must agree. The app has no user account, so select **My app
does not allow users to create an account**. The separate Data safety deletion
question may state that an in-app mechanism is available after the final
endpoint is deployed and tested.

## RuStore data safety

Use the same factual scope:

- приложение запрашивает геолокацию только после нажатия пользователем
  **Use my current area**; координаты используются локально для выбора района,
  не сохраняются и не передаются этим сценарием;
- при онлайн-запросах Vercel обрабатывает IP-адрес, приблизительное
  местоположение по IP, путь и технические данные запроса;
- мобильное приложение создаёт установочный анонимный идентификатор `g_…` и
  синхронизирует сохранённые места, Today, Trip, статусы посещения и заметки с
  Supabase; сайт отдельно использует браузерный `bp_guest`;
- аккаунтов, платежей, рекламы и рекламного идентификатора нет;
- данные передаются по HTTPS и не используются Other Bali для рекламы или
  межсервисного трекинга;
- пользователь видит свой анонимный reference-код и может удалить облачное и
  локальное персональное состояние внутри приложения; старый код после удаления
  остаётся только как заблокированная метка против повторной записи;
- статус Vercel и Supabase как обработчиков по поручению разработчика и
  удержание отделённых redemption-proof записей должны быть подтверждены
  владельцем до отправки;
- privacy policy: `https://www.otherbali.com/privacy`.

## Release verification

Before answering the store questionnaires for the exact signed binaries:

1. Apply migration `0065_v12_guest_privacy_erasure.sql` to preview first and
   prove delete-wins for both sync-before-delete and delete-before-late-sync.
2. Deploy the matching server/privacy source to its exact preview and verify
   the mobile DELETE, CORS, `/privacy`, and `/privacy/choices` behavior.
3. Inspect merged native privacy manifests, dependencies, permissions, and
   linked SDKs. Confirm the iOS app has no Mapbox/Turf framework, bundle,
   privacy manifest, linked library, binary marker, or access-token key. Confirm
   the Android Mapbox implementation remains gated with telemetry defaulting
   off.
4. Confirm the Vercel and Supabase processor/service-provider status and the
   current hosting-log retention.
5. Rebuild and reverify the IPA/AAB/APK, then test deletion, identity rotation,
   queue quarantine, and normal post-deletion sync on physical devices.
6. Confirm `/privacy`, `/support`, and `/terms` return HTTP 200 and
   `support@otherbali.com` is monitored.
7. Have the owner/legal reviewer approve the final lawful basis, retention,
   processor list, and selected store-console answers.
8. Re-run this audit after any feature or provider change. Never answer “Data Not
   Collected” while operational metadata or sync state is retained.
