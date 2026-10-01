# T-OB-07 — событие открытия маршрута (запуск 5)

```yaml
task_id: T-OB-07
repo: parkourcafe/privelegy-bali-club
base_sha: beff274 (main)
branch: claude/ob-route-open-event
pr: draft в main, независим от #311 (номер — в отчёте)
дата: 2026-10-01
статус:
  код (событие при открытии опубликованного маршрута): DONE_CODE
  юнит-тесты (валидация, запись с source гостя, не найден → нет события): TESTED_LOCAL
  ветка «Route not found» в браузере (фикстурный режим): TESTED_LOCAL — событие не пишется
  опубликованная ветка в браузере: NOT_VERIFIED — в фикстурном режиме ни один маршрут не разрешается
  запись в events / воронка: NOT_VERIFIED — нет Supabase
изменения: код страницы маршрута, новый хелпер, новый тест, список тестов в package.json,
  ios-web/build-manifest.json (пересобран, т.к. менялся package.json), карта событий, этот журнал
миграции: не нужны и не создавались
```

Ничего не отправлено, не опубликовано. Прод-БД не читалась и не писалась.
CI не запускался (запускает координатор).

## Discovery

- Ветка `claude/ob-route-open-event` от `main @ beff274`, дерево чистое на старте.
- Контекст прочитан через `git show origin/claude/autonomy-ob-01:…` (в ветку
  не копировался): `docs/ops/autonomy/tasks/T-OB-06.md`,
  `docs/ops/autonomy/seeding/OB_SEEDING_2026-09-29.md` §6.
- Код: `app/route/[slug]/page.tsx`, `components/PageViewTracker.tsx`,
  `components/CangguGuideView.tsx:66` (образец), `lib/analytics.ts`,
  `app/api/event/route.ts`, `lib/actions/event-safety.ts`,
  `lib/actions/event-store.ts`, `lib/data.ts` (`buildRoute`, `fetchRouteDefs`,
  `fetchPublishedVenues`), `lib/supabase/server.ts` (`isSeedFallbackAllowed`),
  `lib/seed.ts` (`ROUTES`), `lib/consent.ts`, `app/SourceCapture.tsx`.
- Миграции: `0003_attribution_events.sql`, `0032_menu_action_foundation.sql`
  (`log_event_v2`), `0058_shortlist_generated_event.sql` (`log_event`).
- Тесты-образцы: `lib/actions/event-store.test.ts`,
  `lib/actions/event-safety.test.ts`, `lib/actions/guest-source.test.ts`,
  `lib/source-attribution.test.ts`, `components/OtherBaliLogo.test.mjs`
  (проверка по исходнику).
- Документы: `AGENTS.md` (§3, §4.8, §7, §12, §18), `docs/analytics/ANALYTICS_EVENT_MAP_2026-08-25.md`,
  `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
  (серверная страница монтирует клиентский трекер — тот же приём, что у гайдов).
- `package.json`: тесты — `node --import tsx --test` с явным списком файлов
  (новый тест нужно вписать в скрипт `test`); `pretest` пересобирает мобильную
  оболочку (`ios-web/build-manifest.json` зависит от `package.json`).

## Решение: тип события

| Факт | Где |
| --- | --- |
| `events.type` — `text`, без check-constraint | `supabase/migrations/0003_attribution_events.sql:16-23`; позже constraint не добавлялся (grep по `supabase/migrations`) |
| Реестр типов есть в RPC `log_event`: неизвестный тип молча отбрасывается | `supabase/migrations/0058_shortlist_generated_event.sql:19-36` |
| `log_event_v2` принимает только шесть action/menu-типов | `supabase/migrations/0032_menu_action_foundation.sql:905-909` |
| Клиентский/серверный allowlist повторяет реестр | `lib/actions/event-safety.ts:7-37`; `lib/actions/event-safety.test.ts:5-42` фиксирует список |
| Субъект со слэшем допустим: `^[a-z0-9]+(-[a-z0-9]+)*(\/…)*$`, ≤120 | `lib/actions/event-safety.ts:78,83`; `0058:31-34` |
| Гайды пишут `editorial_page_view` с субъектом `canggu/<guide>` | `components/CangguGuideView.tsx:66` |

Вывод (интерпретация): новый тип (`route_open`) потребовал бы миграции
`log_event` + правок allowlist и теста-реестра — по ТЗ не вводится. Открытие
маршрута пишется как `editorial_page_view` с субъектом `route/<slug>`,
по интерпретации координатора. Выбор записан в карту событий
(`docs/analytics/ANALYTICS_EVENT_MAP_2026-08-25.md`, раздел «Page-View Subjects»).

## Изменённые файлы

- `lib/route-view-event.ts` — новый: `routeViewTracking(route)` →
  `{ event: "editorial_page_view", slug: "route/<slug>" }` для разрешённого
  маршрута; `null` для `null`/`undefined` (ветка «не найден») и для slug,
  который валидатор событий всё равно отбросил бы.
- `app/route/[slug]/page.tsx` — после ветки `if (!route)` вычисляется
  `view`, и в `<main>` опубликованной ветки монтируется
  `<PageViewTracker event={view.event} slug={view.slug} />` (по образцу
  `CangguGuideView.tsx:66`). Ветка «Route not found» не изменена, трекера
  в ней нет.
- `lib/route-view-event.test.ts` — новый, 6 тестов (см. ниже).
- `package.json` — `lib/route-view-event.test.ts` добавлен в скрипт `test`.
- `ios-web/build-manifest.json` — `sourceHash` пересчитан `npm run mobile:build`
  (входит `package.json`).
- `docs/analytics/ANALYTICS_EVENT_MAP_2026-08-25.md` — раздел «Page-View
  Subjects»: таблица гайд / карточка / маршрут, правила (один раз на mount,
  только после согласия, никогда из «not found»), SQL для подсчёта.
- `docs/ops/autonomy/tasks/T-OB-07.md` — этот журнал.

Механизм и согласие — те же, что у гайдов и карточек: `PageViewTracker` →
`track` (`lib/analytics.ts:78` — клиент не шлёт без согласия) → `POST /api/event`
(`app/api/event/route.ts:33-36` — сервер отвечает `skipped: "no-consent"`) →
`storeEvent` → `log_event` с `source` гостя (`app/api/event/route.ts:46-52`).
Клик/скан/открытие — Intent, не результат (AGENTS.md §4.8, §12).

## Проверки

Node v22.22.0, `npm ci` exit 0 (node_modules в контейнере не было).

### Юнит-тесты (`node --import tsx --test lib/route-view-event.test.ts`)

```txt
# tests 6  # pass 6  # fail 0
```

| Тест | Что проверяет |
| --- | --- |
| resolved route → `editorial_page_view` / `route/<slug>` | форма события |
| not-found route → `null` | ненайденный маршрут события не даёт |
| плохой slug (`""`, `First-Day`, `first day`, `first-day/`, `../etc`, >120) → `null` | трекер не монтируется под отказ валидатора |
| `parseEventRequest` принимает `{type, venueSlug: "route/canggu-food-route"}`, отвергает с payload | валидация `/api/event` |
| `storeEvent` → `log_event` с `p_venue_slug: "route/first-day"`, `p_source: "villa_canggu_01"` | сохраняется с `source` гостя, через legacy-RPC (как все page-view) |
| исходник `page.tsx`: в ветке `if (!route)` нет `PageViewTracker`/`routeViewTracking`; после неё — `const view = routeViewTracking(route)` и один `<PageViewTracker …/>` | страница монтирует трекер только в опубликованной ветке |

### Браузер (фикстурный режим, Chromium `/opt/pw-browsers/chromium`, `playwright-core` 1.63.0 во временном каталоге, 360×780)

`OTHER_BALI_ALLOW_FIXTURE_DATA=YES npx next dev -p 3456`, cookie
`bp_consent=granted` выставлена заранее, перехват `POST /api/event`:

| Страница | Статус / h1 | `POST /api/event` |
| --- | --- | --- |
| `/route/nope` | 200 · «Route not found» | только `landing_open` ×2 |
| `/route/first-day` | 200 · «Route not found» | только `landing_open` ×2 |
| `/canggu/best-brunch` (контроль) | 200 · «Best brunch in Canggu» | `editorial_page_view` `canggu/best-brunch`, затем `landing_open` ×2 |

`landing_open` шлёт `app/SourceCapture.tsx:31` при каждой загрузке с
согласием; ×2 — React strict mode в dev (интерпретация); к задаче не относится.
Вывод: ветка «не найден» события не пишет — выполнено (п. 2 ТЗ).

Опубликованная ветка в браузере **не воспроизведена**: в фикстурном режиме
все seed-маршруты (`lib/seed.ts:152` — `first-day`, `cafe-work`, `sunset-run`)
отдают «Route not found», потому что `buildRoute` требует ≥1 остановки
(`lib/data.ts:1313`), а фикстурные заведения не проходят `isPublicReadyVenue`
(`lib/data.ts:757`, интерпретация — совпадает с T-OB-06 §6.3). Рендер
страницы вне Next (react-dom/server) невозможен: `lib/supabase/service.ts:1`
импортирует `server-only`. Поэтому для опубликованной ветки — юнит-тесты и
проверка исходника (таблица выше), как и предусматривал п. 3 ТЗ.

`next dev` дописал блок в `AGENTS.md` — откачено `git checkout -- AGENTS.md`,
в коммит не вошло.

### AGENTS.md §18

| Команда | Результат |
| --- | --- |
| `npm run lint` | exit 0; 0 errors, 3 warnings — все предсуществующие (`AdminSignOutButton.tsx`, `PhotoReviewPanel.tsx`) |
| `npm run typecheck` | exit 0 |
| `npm test` | exit 0. `pretest` → `test:wave1`: 72 pass / 0 fail. Основной прогон: 598 tests, 597 pass, 0 fail, 1 skipped (предсуществующий `privacy evidence decodes the binary manifest emitted by Xcode`, `scripts/device-evidence.test.mjs`, нет Xcode). `seo-os.mjs validate` — ok |
| `npm run build` | exit 0; «Compiled successfully», 153 статических страниц, `/route/[slug]` — ● (ISR), как и до правки |
| `npm run mobile:build` | выполняется в `pretest`; `ios-web/build-manifest.json` обновлён (только `sourceHash`) |

## Что не проверено

- Запись строки в `events` и подстановка `source` — нет Supabase; покрыто
  только мок-клиентом `storeEvent`.
- Опубликованная ветка в браузере (см. выше).
- Дедупликация в `log_event` (5 с, `0058:45-52`) с реальной БД.
- Воронка `/admin` этот тип не показывает (`lib/admin-operations.ts:42-52`) —
  по ТЗ не трогалась; счёт — SQL из карты событий.

## Блокеры

Нет. BLOCKED_DECISION не потребовался: существующий тип покрывает задачу без
миграции.

## next_step

- Координатор: запустить CI вручную на PR; после мержа и деплоя — первый
  `select … where type='editorial_page_view' and venue_slug like 'route/%'`
  по проду (только чтение) как подтверждение VERIFIED_PRODUCTION.
- Отдельно (вне этой задачи): настоящий 404 для ненайденного маршрута —
  решение владельца (в.60); показ открытий маршрутов в `/admin`.
