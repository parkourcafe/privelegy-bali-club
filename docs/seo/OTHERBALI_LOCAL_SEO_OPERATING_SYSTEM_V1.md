# OtherBali Local SEO Operating System — pilot v1

**Дата:** 2026-07-22
**Домен:** `https://www.otherbali.com`
**Режим:** shadow governance; production‑публикация, merge, redirect, retirement и deindex не автоматизированы
**Рабочая ветка:** `codex/otherbali-local-seo-os-pilot-2026-07-22`

## Результат

- **[ИНТЕРПРЕТИРОВАНО]** Пилот превращает SEO из генератора страниц в систему допуска: инвентаризация → intent ownership → evidence → draft → human QA → технический QA → публикация → измерение → ежемесячное решение.
- **[ИНТЕРПРЕТИРОВАНО]** Один индексируемый URL должен владеть одной самостоятельной задачей путешественника. Найденный keyword сам по себе не даёт права создать страницу.
- **[ИНТЕРПРЕТИРОВАНО]** Текущие 673 URL сначала наблюдаются в shadow‑режиме. Пилот не снимает с индекса 518 venue pages массово: это разрешено только после GSC, evidence review и утверждённого redirect/retirement решения.
- **[ИНТЕРПРЕТИРОВАНО]** AI может подготовить brief или черновик. AI не является источником, не ставит `facts_verified`, не публикует, не меняет canonical и не создаёт redirect.

## Как читать документ

- **[ИЗВЛЕЧЕНО]** — наблюдаемый live‑факт, факт из кода/репозитория или документированный исторический baseline.
- **[ИНТЕРПРЕТИРОВАНО]** — правило пилота, рабочая гипотеза или решение команды. Это не выдаётся за правило Google или уже подтверждённый результат.

## 1. Зафиксированный baseline

| Состояние на 2026-07-22 | Метка | Результат |
|---|---|---|
| Live sitemap | **[ИЗВЛЕЧЕНО]** | 673 уникальных sitemap URL; нет duplicate `<loc>` и чужих origin |
| Основные семейства | **[ИЗВЛЕЧЕНО]** | 518 venue, 45 area collection, 16 collection, 12 area hub, 8 route; остальные 74 URL относятся к home, catalogue, editorial, offer, guide, tool и B2B поверхностям |
| `lastmod` | **[ИЗВЛЕЧЕНО]** | 239 URL имеют `lastmod`; 434 не имеют |
| Priority intent owners | **[ИЗВЛЕЧЕНО]** | Исторический frozen set содержит 10 URL; в пилот добавлены 3 существующих owner URL для проверки близких интентов |
| Live QA owner pages | **[ИЗВЛЕЧЕНО]** | 13 URL × generic/browser/Googlebot = 39/39: HTTP 200, title, H1, self‑canonical, без неожиданного `noindex`, JSON‑LD синтаксически валиден |
| Venue template sample | **[ИЗВЛЕЧЕНО]** | Дополнительная стратифицированная live‑выборка карточек от начала до конца sitemap возвращает 200 и server HTML Googlebot |
| Historical GSC | **[ИЗВЛЕЧЕНО]** | Сохранённый baseline охватывает только 2026-07-11…2026-07-16: 3 clicks, 141 impressions, CTR 2.1%, average position 28.4, 68 queries, 47 pages |
| `/v/*/redeem` | **[ИЗВЛЕЧЕНО]** | Страницы отдают `noindex`, но production robots запрещает `/v/`; старые redeem URL всё ещё обнаруживаются поиском |
| GBP eligibility | **[ИЗВЛЕЧЕНО]** | Публичные данные подтверждают онлайн‑гид, но не staffed customer-facing location и не очное обслуживание клиентов |

- **[ИНТЕРПРЕТИРОВАНО]** 39/39 live‑проверок доказывают управляемые технические свойства выбранных ответов, но не индексацию всех 673 URL. Реальный index state, Google‑selected canonical и query ownership должны прийти из Search Console.
- **[ИНТЕРПРЕТИРОВАНО]** Одновременные `Disallow: /v/` и `noindex` конфликтуют: crawler не может регулярно прочитать `noindex`. В этой ветке `/v/` удалён из robots disallow, а сами redemption pages остаются `noindex`; merge требует обычного review.
- **[ИНТЕРПРЕТИРОВАНО]** Другие открытые риски: механически обрезанные descriptions на части venue pages, непроверенный internal-link graph для 518 карточек, автоматическое включение всех publication‑eligible venues в sitemap и 520 KB server HTML у `/places`. Это backlog аудита, не основание для массового deindex.

## 2. Что пилот не делает

- **[ИНТЕРПРЕТИРОВАНО]** Не создаёт district × service × audience матрицу URL.
- **[ИНТЕРПРЕТИРОВАНО]** Не копирует страницы конкурентов, их формулировки или отзывы.
- **[ИНТЕРПРЕТИРОВАНО]** Не считает search volume, CPC или наличие похожей статьи достаточным доказательством отдельного intent.
- **[ИНТЕРПРЕТИРОВАНО]** Не включает GBP и не создаёт районные профили от имени OtherBali до документального подтверждения eligibility.
- **[ИНТЕРПРЕТИРОВАНО]** Не трактует sitemap, schema или HTTP 200 как гарантию индексации/ранжирования.
- **[ИНТЕРПРЕТИРОВАНО]** Не смешивает GSC clicks и GA4 sessions в одно «точное» число.

## 3. Управляющие артефакты

| Артефакт | Назначение | Enforcement в v1 |
|---|---|---|
| `docs/seo/os/page-registry.json` | Live snapshot заявленных в sitemap URL и route types | Sitemap drift, duplicate и schema validation; index state остаётся unknown до проверки |
| `docs/seo/os/intent-registry.json` | Один активный indexable owner на `intent_key` | Duplicate owner блокирует check |
| `docs/seo/os/evidence-registry.json` | Claim-level source ledger | S4/AI запрещён как verification evidence |
| `docs/seo/os/redirect-registry.json` | Явные old → exact replacement решения | Self redirect, duplicate old URL, non-HTTPS и missing target блокируются |
| `docs/seo/os/monthly-decision-log.json` | HOLD/UPDATE/MERGE/EXPAND/RETAIN/RETIRE_REDIRECT | Решение может быть proposed; execution требует human approval |
| `scripts/seo-os.mjs` | Snapshot, registry check и 3-UA live audit | Локально/CI; production не изменяет |

### Команды

```bash
npm run seo:os:snapshot  # обновить timestamp без URL drift; governance annotations сохраняются
npm run seo:os:snapshot -- --approve-drift  # только после утверждённого изменения IA
npm run seo:os:validate  # offline CI gate для пяти committed registries
npm run seo:os:check     # проверить пять реестров и нулевой sitemap drift
npm run seo:os:audit     # проверить active intent owners тремя user-agent
npm run test:seo-os      # unit tests правил OS
```

- **[ИНТЕРПРЕТИРОВАНО]** `snapshot` нельзя запускать, чтобы молча «одобрить» неожиданный URL. Сначала `check` должен показать drift, затем владелец объясняет изменение, и только после review обновляется snapshot.
- **[ИНТЕРПРЕТИРОВАНО]** Исчезнувший из sitemap URL не удаляется из истории: он остаётся tombstone с `sitemap_included=false` и `refresh_due`. Само исчезновение не доказывает `noindex`, redirect или retirement; техническое состояние проверяется отдельно.
- **[ИНТЕРПРЕТИРОВАНО]** `declared_index_intent` — сигнал сайта, а `observed_index_state` — результат технической/GSC проверки. Для 13 owner pages записан `technical_sample_passed`; это не означает `gsc_indexed`.

## 4. Разрешённая архитектура страниц

| Семейство | Самостоятельная задача | Indexable после gates |
|---|---|---|
| Home | выбрать способ начать решение | Да |
| Area directory / hub | выбрать или понять район | Условно |
| Area collection | выбрать вариант в районе для конкретного момента | Условно |
| Bali-wide collection | сравнить варианты по острову | Условно |
| Moment/scenario | решить, что подходит прямо в заданном контексте | Условно |
| Route | выполнить осмысленную последовательность остановок | Условно |
| Planning guide | принять pre-arrival решение | Условно |
| `/places/[slug]` | решить, подходит ли конкретное место | Условно |
| Partner/B2B | подключить venue/property к OtherBali | Да, если содержание уникально |
| Redeem/private/filter/search | операционная или персональная задача | Нет; `noindex`/не в sitemap |

- **[ИНТЕРПРЕТИРОВАНО]** Административная география (`province`, `regency_or_city`, `district_kecamatan`) и туристическая (`tourist_area`, `micro_area`, `island_group`) хранятся отдельно. Полнота Bali в данных не означает автоматическое создание девяти административных landing pages.
- **[ИНТЕРПРЕТИРОВАНО]** Алиас, перестановка слов, новый год, `best/top/good` или смена категории venue не создают новый URL.
- **[ИНТЕРПРЕТИРОВАНО]** Один физический филиал — одна entity page. Разные реальные адреса сети могут иметь отдельные сущности.

## 5. Intent ownership и защита от каннибализации

```text
intent_key = geo_scope | user_job | subject | scenario | audience | time_horizon
```

- **[ИНТЕРПРЕТИРОВАНО]** Unique rule: один `intent_key` может иметь только одного владельца со `status=active` и `indexable=true`.
- **[ИНТЕРПРЕТИРОВАНО]** Совпадение запросов не доказывает каннибализацию само по себе. Конфликт подтверждается, когда две страницы решают одну задачу, имеют высокий query/decision overlap и Google систематически меняет owner.
- **[ИНТЕРПРЕТИРОВАНО]** Canonical не используется как пластырь для двух редакционных дублей. После человеческого решения страницы объединяются, internal links и sitemap обновляются, старый URL получает один permanent redirect на точный replacement.

### Разрешённые owner pages пилота

| URL | Intent | Статус |
|---|---|---|
| `/canggu/work-friendly-cafes` | work-friendly café в Canggu | Existing owner; GSC conflict review с Bali-wide collection |
| `/canggu/best-brunch` | brunch в Canggu | Existing owner |
| `/canggu/best-restaurants` | restaurants в Canggu | Existing owner |
| `/ubud/best-cafes-coffee` | café/coffee в Ubud | Existing owner |
| `/uluwatu/beach-clubs-sunset` | Uluwatu beach club для sunset | Existing owner |
| `/seminyak/best-restaurants` | restaurants в Seminyak | Existing owner |
| `/best-warungs-in-bali` | warungs по Bali | Existing owner |
| `/where-to-watch-sunset-in-bali` | sunset spots по Bali | Existing owner |
| `/places/jari-menari-seminyak` | entity decision Jari Menari | Existing owner |
| `/places/pizza-fabbrica` | entity decision Pizza Fabbrica | Existing owner |
| `/first-time-in-bali` | Bali-wide first-day orientation and base choice | Existing owner; GSC conflict review |
| `/route/first-day` | sequenced first day in Canggu | Existing owner; GSC conflict review; generic slug |
| `/collections/work-friendly-cafes` | work-friendly cafés across Bali | Existing owner; GSC conflict review |

- **[ИЗВЛЕЧЕНО]** Первые десять URL взяты из frozen priority set 2026-07-18.
- **[ИНТЕРПРЕТИРОВАНО]** Последние три добавлены не как новые страницы, а чтобы формально описать ближайшие пары риска. Полные keys и differentiation notes находятся в `intent-registry.json`.
- **[ИНТЕРПРЕТИРОВАНО]** `existing_url_only` не разрешает новую публикацию. Новый URL остаётся `candidate`, пока не пройдёт семь gates.

## 6. Семь gates новой или существенно переработанной страницы

| Gate | Блокирующее условие | Ответственный |
|---|---|---|
| User job | Нет одного конкретного решения путешественника | SEO/Product |
| Intent owner | Есть активный owner того же intent или конфликт не разобран | SEO/Product |
| Inventory | Недостаточно проверенного материала для честного output | Research |
| Decision value | Получается список/пересказ без причин, ограничений и next action | Editor |
| Evidence | Mutable facts без допустимого source/date/status | Research Lead |
| Maintenance | Нет owner и `review_due_at` | SEO/Product |
| Technical | Не-200, пустой SSR HTML, canonical/noindex/schema/sitemap/internal-link ошибка | Engineer + QA |

- **[ИНТЕРПРЕТИРОВАНО]** Только прошедшая все gates страница получает `os_gate_status=approved`. Полезная продуктовая страница без SEO-intent может существовать с `noindex`.
- **[ИНТЕРПРЕТИРОВАНО]** Автор черновика не может единолично закрыть evidence, editorial и release gates.

## 7. Draft-only content workflow

```text
candidate → researching → facts_verified → editorial_approved
          → technical_qa → ready_to_publish → published → monitoring → stable
```

Дополнительные состояния: `blocked`, `refresh_due`, `merge_review`, `retire_review`.

1. **[ИНТЕРПРЕТИРОВАНО]** Brief создаётся только для зарегистрированного `intent_id`; он содержит user job, decision output, competing owners и источники.
2. **[ИНТЕРПРЕТИРОВАНО]** AI пишет только draft и обязан сохранять placeholders вместо неподтверждённых price/hours/booking/accessibility/safety claims.
3. **[ИНТЕРПРЕТИРОВАНО]** Research Lead сверяет каждый mutable fact и переводит только подтверждённые claims в `verified`.
4. **[ИНТЕРПРЕТИРОВАНО]** Editor проверяет уникальную пользу, ясность, ограничения и соответствие голосу OtherBali; keyword density не является gate.
5. **[ИНТЕРПРЕТИРОВАНО]** Engineer/Data QA проверяют HTML, schema, canonical, sitemap, internal link и events.
6. **[ИНТЕРПРЕТИРОВАНО]** SEO/Product Owner разрешает `ready_to_publish`; deploy automation выполняет только уже разрешённую публикацию.
7. **[ИНТЕРПРЕТИРОВАНО]** Индексация и позиции переходят в monitoring; они не подменяют release acceptance.

## 8. Evidence policy

| Tier | Источник | Разрешение |
|---|---|---|
| S0 | Government/regulator/official transport or attraction | правила, safety, билеты, legal, transport |
| S1 | Official venue site/menu/booking/channel | услуги, цены, часы, условия |
| S1D | Direct visit/call/WhatsApp/email | прямая проверка с датой и verifier |
| S2 | GBP/major booking platform/authoritative media | corroboration, не единственный источник volatile fact |
| S3 | Reviews/social/aggregator | discovery only |
| S4 | AI output | никогда не источник |

- **[ИНТЕРПРЕТИРОВАНО]** `booking_difficulty` публикуется только из отдельного проверенного поля; `not_for` не выводится обратным преобразованием `best_for`.
- **[ИНТЕРПРЕТИРОВАНО]** Каждый factual claim обязан явно иметь `volatility=stable|volatile`; это не выводится из свободного `field_name`. Volatile‑факты получают `verified_at` и `valid_until`, а истёкшее значение не участвует в approval.
- **[ИНТЕРПРЕТИРОВАНО]** `kid-friendly`, `work-friendly`, `quiet`, `swimmable`, accessibility и safety не выводятся из фотографий или единичных отзывов.
- **[ИНТЕРПРЕТИРОВАНО]** Слово `verified` публично разрешено только после direct verification; partner-supplied data хранится с соответствующей меткой.

## 9. Технический release gate

### До merge

- **[ИНТЕРПРЕТИРОВАНО]** Registry check: валидны пять реестров, sitemap drift объяснён, duplicate/foreign URLs = 0.
- **[ИНТЕРПРЕТИРОВАНО]** Для каждого изменённого template автоматика требует HTTP 200, useful server HTML, title, H1, expected canonical/robots и хотя бы один синтаксически валидный JSON‑LD block.
- **[ИНТЕРПРЕТИРОВАНО]** Engineer/QA вручную подтверждают, что тип и поля schema соответствуют видимому содержанию страницы; автоматическая проверка v1 не доказывает семантическую корректность schema.
- **[ИНТЕРПРЕТИРОВАНО]** Indexable URL находится в sitemap и имеет хотя бы одну crawlable contextual link от indexable parent. Noindex/private/filter/redeem URL в sitemap отсутствует.
- **[ИНТЕРПРЕТИРОВАНО]** Три user-agent получают одинаковый смысловой title/H1/canonical/main content; никакого отдельного Googlebot content.
- **[ИНТЕРПРЕТИРОВАНО]** Redirect map не имеет chain/loop; internal links и sitemap уже указывают на target.
- **[ИНТЕРПРЕТИРОВАНО]** Events срабатывают один раз, имеют bounded enums и не содержат PII/token URL.

### После deploy

- **[ИНТЕРПРЕТИРОВАНО]** Production smoke повторяет три UA и проверяет изменённые URL.
- **[ИНТЕРПРЕТИРОВАНО]** Manual GSC Live URL Test выполняется минимум для одного URL каждого изменённого template. URL Inspection API не заменяет Live Test.
- **[ИНТЕРПРЕТИРОВАНО]** GSC indexing — наблюдаемый outcome на D+3/D+7/D+14/D+28, а не обещание релиза.

## 10. Search Console + product measurement

### GSC ingestion contract

- **[ИЗВЛЕЧЕНО]** Целевая property: `sc-domain:otherbali.com`. Доступ service account и актуальный API backfill в репозитории пока не подтверждены.
- **[ИНТЕРПРЕТИРОВАНО]** Credential — read-only secret вне Git и логов; email service account получает минимально достаточный доступ к domain property.
- **[ИНТЕРПРЕТИРОВАНО]** Job ежедневно определяет latest available date и идемпотентно перезагружает D-10…latest. Исторический backfill берёт весь доступный период.
- **[ИНТЕРПРЕТИРОВАНО]** Property totals загружаются отдельно от page/query detail. Достижение 50,000 detail rows помечается `possibly_truncated=true`.
- **[ИНТЕРПРЕТИРОВАНО]** CTR = `SUM(clicks)/SUM(impressions)`; position — impression-weighted. GSC хранит `source_date_pt`; GA4 живёт в `Asia/Makassar`; соединение допускается на week/28-day уровне.
- **[ИНТЕРПРЕТИРОВАНО]** URL Inspection API планируется для новых/изменённых URL на D+3/D+7/D+14/D+28 и monthly registry sample. Он показывает indexed version, а не выполняет Live Test.

### Existing event contract

- **[ИЗВЛЕЧЕНО]** Код уже имеет consent-gated, bounded, PII-safe events: `venue_detail_view`, `action_handoff`, `booking_click`, `direction_click`, `official_website_click`, `menu_open`, `save`, `route_add`, `shortlist_generated` и связанные action events.
- **[ИЗВЛЕЧЕНО]** `booking_click` означает click/acquisition action, а не завершённое бронирование. `reservation_click` для TablePilot остаётся internal proof event.
- **[ИНТЕРПРЕТИРОВАНО]** В v1 не вводится дублирующий универсальный event. Decision session определяется наличием хотя бы одного существующего `action_handoff`, `save` или `route_add` в consenting organic landing session.

```text
Organic decision rate =
organic engaged landing sessions with ≥1 action_handoff/save/route_add
÷ organic engaged landing sessions
```

- **[ИНТЕРПРЕТИРОВАНО]** Dashboard показывает рядом GSC impressions/clicks и GA4 organic landings/decision sessions, но не утверждает, что clicks = sessions.

## 11. Dashboard и alerts

| View | Что отвечает |
|---|---|
| Executive funnel | impressions → clicks → organic landings → decision sessions |
| Search demand | query/intent clusters по page, route type, area, country, device |
| Index health | registry → sitemap → inspected → Google canonical |
| Content opportunity | impressions/CTR в сопоставимом position band, queries без owner |
| Decision product | action/save/route-add по landing, venue и placement |
| QA operations | drift, stale facts, broken links, release blockers, data freshness |
| Experiments | hypothesis, cohorts, maturity, lift, guardrails |

| Alert | Пилотный threshold |
|---|---|
| P0 release | Новый indexable URL дважды не-200, noindex, чужой canonical или пустой main |
| P0 template | Любая top-20 landing или ≥5% stratified sample ломается для одного UA |
| P1 data | Latest GSC date старше D-4 или две ingestion jobs подряд failed |
| P1 sitemap | Не-Success или drift > `max(5 URL, 2%)` |
| P1 analytics | Required params <98% при ≥100 events или duplicate event >2% |
| P2 search | 28-day clicks −30% при baseline ≥100 clicks; investigation, не auto rollback |

- **[ИНТЕРПРЕТИРОВАНО]** Эти thresholds — консервативные правила пилота, а не официальные пороги Google. После 2–3 полных циклов они калибруются на фактической дисперсии OtherBali.

## 12. Ежемесячное решение

| Decision | Пилотное правило |
|---|---|
| HOLD | URL моложе 28 дней или <100 impressions; недостаточно данных |
| UPDATE | Critical fact истёк; intent раскрыт неполно; CTR/decision rate существенно хуже сопоставимой группы |
| MERGE | Weighted query overlap ≥60%, отдельный user job не доказан, visibility делится между URL |
| EXPAND | Отдельный cluster ≥100 impressions/28d, нет owner, есть evidence и уникальный decision output |
| RETAIN | Facts fresh, owner стабилен, search/product guardrails в норме |
| RETIRE_REDIRECT | Страница устарела или подтверждён duplicate; есть точный replacement и утверждённый redirect map |

- **[ИНТЕРПРЕТИРОВАНО]** Ноль clicks сам по себе не является основанием удалить страницу.
- **[ИНТЕРПРЕТИРОВАНО]** Query overlap считается взвешенно по impressions за одинаковое окно; merge всё равно требует human review страницы, SERP и decision output.
- **[ИНТЕРПРЕТИРОВАНО]** Закрытое venue может остаться 200 с честным статусом и альтернативами, если entity query и польза сохраняются; иначе 404/410 или exact replacement определяется отдельно.
- **[ИЗВЛЕЧЕНО]** В initial log десяти frozen pages назначен только `proposed HOLD`, потому что сохранённый GSC baseline содержит шесть дней. Это не утверждённое действие.

## 13. GBP policy

- **[ИЗВЛЕЧЕНО]** Google Business Profile предназначен для бизнеса, который очно контактирует с клиентами; online-only business не соответствует eligibility.
- **[ИНТЕРПРЕТИРОВАНО]** Для пилота `GBP = N/A — online guide`. Нельзя создавать профили OtherBali по районам и нельзя управлять профилями venues от имени OtherBali.
- **[ИНТЕРПРЕТИРОВАНО]** Повторная eligibility review возможна только после появления реального staffed customer-facing location или настоящего выездного обслуживания и документального подтверждения.

## 14. Волны внедрения

| Wave | Scope | Exit criterion |
|---|---|---|
| A — foundation | Реестры, sitemap drift, 3-UA audit, tests, `/v/` robots correction | Все локальные проверки зелёные; branch review, без auto publish |
| B — GSC read-only | Secret, property access, backfill, daily D-10 refresh, inspection queue | Freshness visible; totals/detail separated; no credential in Git/logs |
| C — measurement | GA4 DebugView, required dimensions, organic decision dashboard | One event per action, PII absent, source lag/timezone visible |
| D — controlled enforcement | Evidence backfill, orphan crawl, metadata QA, `seo_eligible` proposal | Только reviewed pages меняют sitemap/index directive |

- **[ИНТЕРПРЕТИРОВАНО]** Wave B заблокирована до безопасного предоставления service-account JSON/secret и подтверждения доступа к `sc-domain:otherbali.com`.
- **[ИНТЕРПРЕТИРОВАНО]** Wave D не начинается с массового выключения venue pages. Сначала формируется evidence gap report и proposal queue; каждое действие утверждается отдельно.

## 15. Acceptance criteria v1

- **[ИНТЕРПРЕТИРОВАНО]** Live sitemap и page registry совпадают; duplicate/foreign/drift = 0.
- **[ИНТЕРПРЕТИРОВАНО]** Нет двух active indexable owners одного `intent_key`.
- **[ИНТЕРПРЕТИРОВАНО]** Verified claim не может ссылаться на S4/AI и имеет source/date/verifier.
- **[ИНТЕРПРЕТИРОВАНО]** Новый URL не становится approved без owner, intent, evidence, maintenance и technical QA.
- **[ИНТЕРПРЕТИРОВАНО]** Active owner sample проходит HTTP/render/title/H1/canonical/robots/schema/sitemap QA тремя UA.
- **[ИНТЕРПРЕТИРОВАНО]** `/v/` отсутствует в sitemap и остаётся crawlable только для чтения explicit `noindex`.
- **[ИНТЕРПРЕТИРОВАНО]** Monthly job предлагает решение, но не публикует, не объединяет, не удаляет и не перенаправляет автоматически.
- **[ИНТЕРПРЕТИРОВАНО]** GBP module остаётся отключённым.

## Официальные ограничения платформ

- **[ИЗВЛЕЧЕНО]** Google: sitemap помогает discovery, но не гарантирует crawl/indexing — [Sitemaps overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).
- **[ИЗВЛЕЧЕНО]** Google: `noindex` должен быть доступен crawler, иначе правило не будет прочитано — [Block Search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- **[ИЗВЛЕЧЕНО]** Google: массовый контент без дополнительной пользы может нарушать spam policies — [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies).
- **[ИЗВЛЕЧЕНО]** Google: URL Inspection API проверяет indexed version, не Live URL — [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect).
- **[ИЗВЛЕЧЕНО]** Google: Search Analytics API имеет reporting delay/limits и может не вернуть все detail rows — [Search Console API data guide](https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data).
- **[ИЗВЛЕЧЕНО]** Google: structured data должна соответствовать видимому содержимому и не гарантирует rich result — [Structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
- **[ИЗВЛЕЧЕНО]** Google: online-only business не подходит для GBP — [Business eligibility](https://support.google.com/business/answer/13763036?hl=en).

## Исторические документы

- **[ИЗВЛЕЧЕНО]** `docs/seo/SEARCH_BASELINE_AND_PRIORITY_PAGES_2026-07-18.md` остаётся историческим baseline и источником frozen ten-page set.
- **[ИНТЕРПРЕТИРОВАНО]** Этот документ операционно заменяет старые инструкции там, где они разрешали action без registry/evidence/QA или описывали устаревший GSC/GBP setup. Исторические документы не удаляются и их факты не переписываются задним числом.
