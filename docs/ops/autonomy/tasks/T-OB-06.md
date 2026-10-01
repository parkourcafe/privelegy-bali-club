# T-OB-06 — площадки для первого QR и план посевов (запуск 4)

```yaml
task_id: T-OB-06
repo: parkourcafe/privelegy-bali-club
base_sha: d6fe224 (ветка claude/autonomy-ob-01); main @ beff274
branch: claude/autonomy-ob-01
pr: #311 (draft; новый PR не создавался)
дата: 2026-09-29
статус:
  задача 1 (кандидаты площадок QR): DONE_CODE (документ) — 3 кандидата, все «не связывались, согласия нет»; сайты BLOCKED_EXTERNAL (сетевая политика), факты по выдаче поиска
  задача 2 (план посевов): DONE_CODE (документ); путь /?s= → /api/source TESTED_LOCAL (фикстурный режим); запись source_scan и воронка /admin NOT_VERIFIED (нет Supabase)
изменения: только docs; код приложения, миграции, CI не трогались
```

Ничего не отправлено, не напечатано, не размещено. Прод-БД не читалась и не
писалась. CI не запускался (изменения только в документах).

## Discovery

- Ветка `claude/autonomy-ob-01` @ `d6fe224`, дерево чистое.
- Прочитаны: `docs/ops/autonomy/OB_QR_SEO_PILOT.md` (§2.1, §2.4, §5, §6),
  `docs/ops/autonomy/tasks/T-OB-04.md`, `T-OB-03.md` («Как поднималось»),
  `T-OB-05.md`, `AGENTS.md` (§2, §4, §12, §13), `docs/canon/OTHER_BALI_MESSAGING_SYSTEM.md`,
  `docs/content-style.md`, `docs/venue-outreach.md`, `docs/gtm/BALI_PRIVILEGE_SCRIPTS_AND_ASSETS.md`,
  `docs/gtm/BALI_PRIVILEGE_COMMUNITIES.csv`, `docs/gtm/BALI_PRIVILEGE_PARTNER_PROSPECTS.csv`,
  `docs/analytics/ANALYTICS_EVENT_MAP_2026-08-25.md`, `docs/gtm/BALI_PRIVILEGE_GROWTH_MEASUREMENT_SPEC.md`.
- Код: `app/admin/(protected)/qr/source/[source]/page.tsx`, `app/SourceCapture.tsx`,
  `app/api/source/route.ts`, `app/api/event/route.ts`, `app/api/save/route.ts`,
  `lib/source-attribution.ts`, `lib/admin-attribution.ts`, `lib/admin-operations.ts`,
  `lib/actions/event-store.ts`, `lib/actions/event-safety.ts`, `lib/actions/guest-source.ts`,
  `lib/analytics.ts`, `lib/data.ts` (setGuestSource / logEvent / getGuestAttributionSource),
  `components/PageViewTracker.tsx`, `components/SaveButton.tsx`,
  `components/TrackedDirectionsLink.tsx`, `components/CangguGuideView.tsx`,
  `app/places/[slug]/page.tsx`, `app/route/[slug]/page.tsx`, `lib/canggu-guides.ts`,
  `app/villas/page.tsx`, `app/hotels/page.tsx`, миграции с `qr_enabled`
  (0006, 0015, 0018, 0031, 0039, 0046), `0003_attribution_events.sql`.
- PR #311 прочитан через GitHub MCP (head `d6fe224`, draft).
- Документация Next.js из `node_modules/next/dist/docs/` не читалась: код не менялся.

## Изменённые файлы

- `docs/ops/autonomy/seeding/OB_SEEDING_2026-09-29.md` — новый: план посевов §0–§9.
- `docs/ops/autonomy/OB_QR_SEO_PILOT.md` — добавлен §7 (указатель на кандидатов и план).
- `docs/ops/autonomy/tasks/T-OB-06.md` — этот журнал.

## Задача 1 — кандидаты площадок для первого QR

Итог — `OB_SEEDING_2026-09-29.md` §3.1: Chesa Canggu (бутик-отель, Batu Bolong),
Sokkool (коливинг + коворкинг, Berawa), Matra Bali (коливинг + коворкинг,
Berawa/Semat). Отсев: Dojo Bali («officially closed» по выдаче), Outsite
Pererenan («no longer accepting bookings» по выдаче). Резерв: The Slow,
Hotel Tugu (уже в `docs/gtm/BALI_PRIVILEGE_PARTNER_PROSPECTS.csv`).

Ограничения из кода, на которые сослался документ:

| Факт | Где |
| --- | --- |
| QR включён только в `canggu` | `supabase/migrations/0006_source_class_and_coverage.sql:12`; `0015_publish_collected_venues.sql:21-28`; `0018_uluwatu_launch.sql:17`; `0039_publish_kora_new_venues.sql:22-24`; `0046_insert_destination_batch3_attractions.sql:42-56` |
| Текст постера «Find your Canggu day» | `app/admin/(protected)/qr/source/[source]/page.tsx:46` |
| Один источник на точку размещения | `…/qr/source/[source]/page.tsx:58-60` |
| Источник — только выпущенный активный | `lib/admin-attribution.ts:31-43`; список только в прод-БД (`OB_QR_SEO_PILOT.md` §2.3) |
| Метка только строчными | `lib/source-attribution.ts:1` |

Источник за площадкой не назначен — пустое место `s=______` в §5 плана.
Личные контакты не собирались; там, где выдача поиска показывала телефон или
email площадки, они в документ не перенесены.

## Задача 2 — план посевов

Файл `docs/ops/autonomy/seeding/OB_SEEDING_2026-09-29.md`, структура по заданию:
§0 главное · §1 источники · §2 тексты A/B/C (READY_FOR_PLACEMENT) · §3 площадки
(3 QR + 5 сообществ, из них TripAdvisor исключён по правилам) · §4 сопоставление ·
§5 URL (`/?s=` для QR; три decision pages; две конвенции UTM, выбор — BLOCKED_DECISION) ·
§6 критерий результата и события в коде · §7 очередь 30.09–13.10 (только владелец) ·
§8 чек-лист · §9 решения.

Ключевые находки по коду для §6:

- Открытие маршрута `/route/<slug>` не пишет ни одного события —
  в `app/route/[slug]/page.tsx` нет `PageViewTracker`/`track` (grep по файлу).
- `editorial_page_view`, `venue_detail_view`, `save`, `official_website_click`
  не входят в воронку `/admin` (`lib/admin-operations.ts:42-52`) — только SQL по `events`.
- UTM во внутреннее хранилище не попадает (`app/SourceCapture.tsx:16` читает
  только `s`/`source`); атрибуция decision page к сообществу возможна только
  через `?s=` выпущенного источника — вынесено в решения владельца.

## Проверки (TESTED_LOCAL)

Node v22.22.2. Команды и результат:

```txt
npm ci                                              exit 0
OTHER_BALI_ALLOW_FIXTURE_DATA=YES npx next dev -p 3456   поднялся за ~2 с (GET / 200)
curl GET  /?s=t-ob-06-test                          200; canonical https://www.otherbali.com
curl POST /api/source {"source":"t-ob-06-test"}     422 {"ok":false}   (нет Supabase → setGuestSource=false)
curl POST /api/source {"source":"OB-VIL-TEST-CHECKIN"}  400 {"ok":false}   (валидатор, прописные)
curl POST /api/event  без cookie согласия           200 {"ok":true,"skipped":"no-consent"}
curl POST /api/save   {"venueSlug":"alchemy-uluwatu","saved":true}  503 {"error":"unavailable"}
curl GET  /admin/qr/source/t-ob-06-test             307 → /admin/login
```

Браузерная трасса (Chromium `/opt/pw-browsers`, `playwright-core` 1.63.0 во
временном каталоге, 360×780, фикстурный режим). Перехватывались ответы
`/api/source`, `/api/event`, `/api/save`:

```txt
--- /?s=t-ob-06-test (согласие не выбрано)
POST /api/source {"source":"t-ob-06-test"} => 422          (×2 в dev — strict mode, интерпретация)
--- Essential only → /canggu/best-brunch → /places/alchemy-uluwatu → Maps
(ни одного POST /api/event; GET /api/save => 200 {"saved":false})
--- новый контекст, Accept на /?s=t-ob-06-test
POST /api/source => 422 ; POST /api/event {"type":"landing_open"} => 200
--- /canggu/best-brunch
POST /api/event {"type":"editorial_page_view","venueSlug":"canggu/best-brunch"} => 200
--- /places/alchemy-uluwatu
POST /api/event {"type":"venue_detail_view","venueSlug":"alchemy-uluwatu"} => 200
--- клик Google Maps
POST /api/event {"type":"action_handoff",…,"payload":{"action":"maps","provider":"google_maps"}} => 200
POST /api/event {"type":"direction_click","venueSlug":"alchemy-uluwatu"} => 200
--- Save: кнопка disabled в DOM, клик не выполнен (см. curl 503 выше)
--- /plan: ссылок /route/* в фикстурном режиме нет
```

Гайды Canggu в фикстурном режиме без карточек (`/canggu/best-brunch`: 0 ссылок
`/places/`), поэтому шаг «карточка → сохранить → Maps» пройден через реестр
Uluwatu (`/places/alchemy-uluwatu`).

`next dev` дописал блок `nextjs-agent-rules` в `AGENTS.md` — откачено
`git checkout -- AGENTS.md`, в коммит не вошло. `npm run lint` / `npm run build`
не запускались: изменений в коде нет (AGENTS.md §18 требует их для code-bearing
сессий).

## Что не проверено (NOT_VERIFIED / BLOCKED_EXTERNAL)

- Запись `source_scan` в `events`, привязка источника к гостю, подстановка
  `source` в последующие события, сохранение, воронка `/admin` — нужен Supabase.
- Значение `qr_enabled` и список `attribution_sources` в проде — прод-БД недоступна.
- Официальные сайты площадок и сами сообщества — `EGRESS_BLOCKED` для всех
  доменов (`chesacanggu.com`, `sokkool.com`, `matrabali.com` не запрашивался
  напрямую, `dojobali.org`, `outsite.co`, `baliforum.ru`, `t.me`, `facebook.com`,
  `reddit.com`); одна попытка на домен, вторая не делалась — блок детерминированный
  (proxy status: `selective: false`). Все факты — «по выдаче поиска, страница не открыта».
- Правила r/bali и двух групп Facebook — не получены (закрыто/за логином).
- Открытие маршрута — локально не воспроизведено (в фикстурном режиме нет
  разрешимых маршрутов); по коду события нет.

## Блокеры

| Блокер | Тип | Что нужно |
| --- | --- | --- |
| Площадка и закреплённый источник | BLOCKED_DECISION + BLOCKED_EXTERNAL | выбор владельца; список источников в прод-БД (SQL 4 из T-OB-04) |
| Конвенция UTM / формат метки | BLOCKED_DECISION | T-OB-04 §3 |
| `?s=` на ссылках для сообществ | BLOCKED_DECISION | §5, §9 плана |
| Правила r/bali, групп Facebook | BLOCKED_EXTERNAL | владелец читает после входа |
| Согласие площадки и модераторов | BLOCKED_EXTERNAL | текст A / B через публичный канал — отправляет владелец |

## next_step

- Владелец: очередь §7 плана с 30.09 (проверка трёх сайтов, SQL 3–5, решения §9).
- После первого `source_scan` — заполнить `OB_QR_SEO_PILOT.md` §2.4 и §2.6 фактами.
- Отдельное решение: событие открытия маршрута (`/route/<slug>`) — правка кода вне этого запуска.
