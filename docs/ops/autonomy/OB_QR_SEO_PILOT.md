# Пилот QR + SEO (из MASTER_PLAN_304_TRIAGE)

```yaml
задача: T-OB-01, часть 3
дата: 2026-09-27
база: main @ beff274
статус документа: подготовка; ничего не опубликовано, не напечатано и не отправлено
источники: docs/MASTER_PLAN_304_TRIAGE.md · docs/MASTER_PLAN_304_RECONCILIATION_2026-08-06.md
           docs/HANDOFF_2026-08-08.md · docs/seo/SEARCH_BASELINE_AND_PRIORITY_PAGES_2026-07-18.md
```

Метки: `DONE_CODE` — в репозитории есть рабочий код; `TESTED_LOCAL` —
проверено локальной сборкой/тестами в этой сессии; `NOT_VERIFIED` —
проверка требует прод-БД, GSC или живого сайта, из этой среды недоступна;
`BLOCKED_EXTERNAL` — нужен доступ или действие владельца;
`BLOCKED_DECISION` — нужно решение владельца.

Этот документ не придумывает площадки. Там, где репозиторий не называет
конкретную виллу, коливинг или заведение, стоит пустое место и метка решения.

---

## 1. Откуда пилот

| Методика | Вердикт триажа | Что это значит для пилота | Ссылка |
| --- | --- | --- | --- |
| M-0182 Физические носители с QR | УЖЕ ЕСТЬ, ноль сканов | QR-часть пилота: разместить один выпущенный источник и получить первый `source_scan` | `docs/MASTER_PLAN_304_TRIAGE.md:202`, `:289` |
| M-0199 Полевой объезд | АДАПТИРУЕМ | размещение делается руками на месте, не кодом | `docs/MASTER_PLAN_304_TRIAGE.md:203` |
| M-0281 Запрос индексации в GSC | ДЕЛАЕМ, руками | SEO-часть пилота: вручную запросить индексацию ограниченного набора URL (~10 в сутки) | `docs/MASTER_PLAN_304_TRIAGE.md:124`, `:168` |
| M-0058 Доступ к Search Console | ДЕЛАЕМ | предусловие для M-0281 и для замера результата | `docs/MASTER_PLAN_304_TRIAGE.md:197`, `:268` |

Порядок из сверки: сначала одно подтверждение оффера владельцем, потом один
QR и первый `source_scan` (`docs/MASTER_PLAN_304_RECONCILIATION_2026-08-06.md:160-166`).
Ни один из этих шагов не требует кода.

---

## 2. QR-часть

### 2.1 Механизм (проверено по коду)

| Шаг | Где в коде | Статус |
| --- | --- | --- |
| Оператор выпускает источник (`id`, `label`, класс `external`/`creator`/`in_venue`) в `/admin` | `app/admin/(protected)/source-actions.ts:25`, `lib/admin-attribution.ts:7-12` | DONE_CODE |
| Постер печатается на `/admin/qr/source/<source>`; неизвестный или неактивный источник → «Source QR unavailable» | `app/admin/(protected)/qr/source/[source]/page.tsx:13-21`, `lib/admin-attribution.ts:31-45` | DONE_CODE |
| QR ведёт на `/` с `?s=<source>` | `app/admin/(protected)/qr/source/[source]/page.tsx:17-19` | DONE_CODE |
| На странице `SourceCapture` отправляет источник в `/api/source` | `app/SourceCapture.tsx:14-25`, подключён в `app/layout.tsx:136` | DONE_CODE |
| `/api/source` привязывает источник к гостю (first-touch) и пишет `source_scan` | `app/api/source/route.ts:11-35` | DONE_CODE |
| `source_scan` виден в воронке админки | `lib/admin-operations.ts:44` | DONE_CODE |
| `?s=` не плодит дубль главной для поиска: canonical главной — `/` | `app/page.tsx:25` | DONE_CODE |
| Юнит-тесты атрибуции и хранения событий | `lib/source-attribution.test.ts`, `lib/actions/guest-source.test.ts`, `lib/actions/event-store.test.ts` (входят в `npm test`) | TESTED_LOCAL |

Текст постера зашит под Canggu: «Find your Canggu day»
(`app/admin/(protected)/qr/source/[source]/page.tsx:46`).

### 2.2 Район

По миграциям QR включён только в Canggu: `qr_enabled = true` для `canggu`
(`supabase/migrations/0006_source_class_and_coverage.sql:12`,
`supabase/migrations/0015_publish_collected_venues.sql:21`), во всех остальных
районах `false` (`0015:22-28`, `0018_uluwatu_launch.sql:17`). Активация
перка вне такого района отклоняется (`0031_secure_partner_operator_rpcs.sql:470-472`).

| Проверка | Статус |
| --- | --- |
| Canggu — единственный район с `qr_enabled` в миграциях | TESTED_LOCAL (чтение миграций) |
| То же значение в проде | NOT_VERIFIED — прод-БД недоступна |

### 2.3 Источник (QR-метка)

| Факт | Откуда | Статус |
| --- | --- | --- |
| В проде выпущено 20 активных источников | `docs/MASTER_PLAN_304_RECONCILIATION_2026-08-06.md:28`, `:95` | NOT_VERIFIED — список `attribution_sources` в репозитории отсутствует, есть только в прод-БД |
| `villa_canggu_01` использовался в прод-dry-run (транзакция откатана) | `docs/MASTER_PLAN_304_RECONCILIATION_2026-08-06.md:108`, `:118` | NOT_VERIFIED как активный; в репозитории встречается ещё только в тестах |
| Сканов на 2026-08-08 — 0 | `docs/HANDOFF_2026-08-08.md:266`, `:292` | NOT_VERIFIED на сегодня |

### 2.4 Площадка размещения

| Поле | Значение | Статус |
| --- | --- | --- |
| Какая вилла / коливинг / заведение в Canggu | в репозитории не названо | BLOCKED_DECISION — выбирает владелец |
| Какой источник из 20 выпущенных закрепить за площадкой | не назначено | BLOCKED_DECISION + BLOCKED_EXTERNAL (список в прод-БД) |
| Согласие площадки на размещение | нет записи | BLOCKED_EXTERNAL |
| Печать постера | не выполнялась | BLOCKED_EXTERNAL (владелец) |

Правило из кода постера: один уникальный источник на одну точку размещения
(`app/admin/(protected)/qr/source/[source]/page.tsx:58-60`).

### 2.5 Связка с подтверждённой активацией

Первая подтверждённая активация упирается в одну запись в
`perk_offer_confirmations` для перка в Canggu
(`docs/MASTER_PLAN_304_RECONCILIATION_2026-08-06.md:160-163`,
`docs/HANDOFF_2026-08-08.md:264-265`). Какой перк и какое заведение —
в репозитории не решено. **BLOCKED_EXTERNAL** (подтверждение владельца
заведения) + **BLOCKED_DECISION** (выбор перка).

### 2.6 Критерий успеха QR-части

1. В `/admin` виден хотя бы один `source_scan` с источником площадки.
2. Последующие события этого гостя несут тот же `source` (механизм описан в
   `docs/MASTER_PLAN_304_RECONCILIATION_2026-08-06.md:80-87`).

Клик или скан — это Intent, не результат и не повод для счёта
(AGENTS.md §4.8, §12).

---

## 3. SEO-часть

### 3.1 Набор URL

Используется замороженный набор из десяти страниц
(`docs/seo/SEARCH_BASELINE_AND_PRIORITY_PAGES_2026-07-18.md:43-52`) плюс
главная как посадочная QR. Новые URL пилот не создаёт.

| # | URL | Файл маршрута | В реестре SEO OS (`docs/seo/os/page-registry.json`) | В локальной сборке | Слаг в миграциях | Индексируемость в проде |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `/` (посадка QR) | `app/page.tsx` | строка 29 | ○ static | — | NOT_VERIFIED |
| 1 | `/canggu/work-friendly-cafes` | `app/canggu/work-friendly-cafes/` | строка 874 | ○ 5m | — | NOT_VERIFIED |
| 2 | `/canggu/best-brunch` | `app/canggu/best-brunch/` | строка 848 | ○ 5m | — | NOT_VERIFIED |
| 3 | `/canggu/best-restaurants` | `app/canggu/best-restaurants/` | строка 835 | ○ 5m | — | NOT_VERIFIED |
| 4 | `/ubud/best-cafes-coffee` | `app/ubud/best-cafes-coffee/` | строка 1056 | ○ 5m | — | NOT_VERIFIED |
| 5 | `/uluwatu/beach-clubs-sunset` | `app/uluwatu/beach-clubs-sunset/` | строка 952 | ○ 5m | — | NOT_VERIFIED |
| 6 | `/seminyak/best-restaurants` | `app/seminyak/best-restaurants/` | строка 1186 | ○ 5m | — | NOT_VERIFIED |
| 7 | `/best-warungs-in-bali` | `app/best-warungs-in-bali/` | строка 289 | ○ 5m | — | NOT_VERIFIED |
| 8 | `/where-to-watch-sunset-in-bali` | `app/where-to-watch-sunset-in-bali/` | строка 276 | ○ 5m | — | NOT_VERIFIED |
| 9 | `/places/jari-menari-seminyak` | `app/places/[slug]/` | строка 6022 | ● (ISR, blocking) | `supabase/migrations/0027_seminyak_editorial_pass.sql:186` | NOT_VERIFIED — гейт `isVenueIndexable` зависит от прод-строки |
| 10 | `/places/pizza-fabbrica` | `app/places/[slug]/` | строка 3110 | ● (ISR, blocking) | `supabase/migrations/0015_publish_collected_venues.sql:55`, `0022_canggu_editorial_pass_t2.sql:74` | NOT_VERIFIED — то же |

Реестр — снимок живого sitemap, обновлённый 2026-08-25
(`docs/seo/SITEMAP_DRIFT_REVIEW_2026-08-25.md`); присутствие в нём не
доказывает присутствие в сегодняшнем sitemap.

Итог проверки по репозиторию: все 11 маршрутов существуют, все 11 путей есть
в реестре SEO OS, оба слага заведений есть в миграциях. **TESTED_LOCAL**
(сборка `npm run build` в этой сессии, см. `docs/ops/autonomy/tasks/T-OB-01.md`).

### 3.2 Действие

Для каждого URL из 3.1 в Search Console: URL Inspection → Test live URL →
Request indexing. Лимит ~10 URL в сутки (`docs/MASTER_PLAN_304_TRIAGE.md:168-172`),
набор как раз укладывается в одни сутки.

| Предусловие | Статус |
| --- | --- |
| Доступ к GSC для исполнителя | BLOCKED_EXTERNAL (`docs/HANDOFF_2026-08-08.md:276`, `docs/FIX_TZ_2026-08-09.md:178`) |
| Набор из 10 страниц всё ещё актуален (он был заморожен до первого полного 28-дневного окна) | BLOCKED_DECISION — решение по данным GSC, которых в репозитории нет |

### 3.3 Критерий успеха SEO-части

По каждому URL в GSC зафиксировать дату запроса, статус «URL is on Google» /
причину исключения до и через 14 дней. Скриншоты или экспорт положить в
репозиторий — тогда задача GSC-исправлений (T-OB-01, часть 1) перестанет быть
заблокированной.

---

## 4. Что пилот не делает

- не печатает, не размещает и не рассылает ничего — это делает владелец;
- не пишет в прод-БД (ни `attribution_sources`, ни `perk_offer_confirmations`);
- не создаёт новых URL и не меняет текст постера;
- не придумывает площадки, перки и источники.

## 5. Открытые решения владельца

1. Площадка в Canggu для первого QR и закреплённый за ней источник.
2. Перк в Canggu для первой записи подтверждения.
3. Подтвердить или заменить набор из 10 страниц для запроса индексации.
4. Выдать доступ к GSC (или сделать запросы самостоятельно и выгрузить результат).
