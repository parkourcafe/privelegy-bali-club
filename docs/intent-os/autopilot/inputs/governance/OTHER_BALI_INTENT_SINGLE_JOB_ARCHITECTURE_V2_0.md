# OTHER BALI INTENT-TO-SURFACE & SINGLE-JOB GROWTH ARCHITECTURE

**Версия:** 2.0  
**Дата:** 28 июля 2026 года  
**Статус:** новая master-архитектура; заменяет прежний линейный план «Intent Library → 1 000 страниц»  
**Текущая фаза:** dual discovery уже выполняется  
**Активные агенты:** Hermes — внутренний read-only аудит; GenSpark — внешнее исследование интентов и спроса  
**Следующий формальный этап:** приемка двух результатов, а не повторная постановка первого задания

## 0. Как читать документ

- **[Извлечено]** — прямо следует из документа `VOICE_BABY_TRACKER_SINGLE_JOB_PAGES_STRATEGY_2026-07-28.docx` или уже зафиксированного статуса проекта.
- **[Интерпретировано]** — архитектурное решение, адаптирующее исходный документ к Other Bali.
- **[Открытое решение]** — вопрос, который нельзя честно закрыть до результатов Hermes, GenSpark или проверки текущего репозитория.

---

# 1. Исполнительный вердикт

## 1.1. Что принимается

1. **[Извлечено]** Single-job page должна полностью закрывать одну работу без регистрации, email и искусственного ограничения результата.
2. **[Извлечено]** Второй job показывается только после получения полного бесплатного результата.
3. **[Извлечено]** Первый пилот Other Bali нельзя выбирать только по идее или частотности. Нужны scorecard, keyword map, SERP review и проверка данных.
4. **[Извлечено]** Bali Day Planner — предварительный кандидат, а не утвержденный победитель.
5. **[Извлечено]** Общий reusable tool kit извлекается только после двух реальных пилотов.
6. **[Извлечено]** Product usage оценивается отдельно от SEO: первые продуктовые окна — 14/30 дней, органический сигнал — 8–12 недель после индексации и при достаточной выборке.

## 1.2. Главное изменение архитектуры

**[Интерпретировано]** Other Bali Intent OS больше не является фабрикой страниц. Это система принятия решения:

`Evidence → Canonical intent → Surface decision → Candidate score → Pilot → Measurement → Reuse → Controlled scale`

Каждый интент сначала получает подходящую продуктовую поверхность. Он может стать:

- существующим сценарием `/plan` или `/my-day`;
- фильтром или коллекцией;
- editorial/decision page;
- интерактивным single-job tool;
- частью маршрута;
- product-only intent без отдельного URL;
- отклоненным кандидатом.

## 1.3. Что не делаем

- не запускаем новый аудит теми же словами, потому что Hermes и GenSpark уже выполняют первый этап;
- не создаем 1 000 URL сейчас;
- не строим универсальный Tool Framework до двух пилотов;
- не считаем каждый keyword отдельным intent;
- не создаем новый `/tools/bali-day-planner`, пока не проверено, не дублирует ли он существующий `/plan`;
- не передаем Codex задачу на production build до выбора winner и утверждения pilot brief;
- не индексируем страницу до data, QA, privacy и SEO readiness.

---

# 2. Аудит исходного документа

## 2.1. Оценка

- **Как стратегический memo по single-job mechanics:** 92/100.
- **Как готовая архитектура Other Bali:** 79/100.
- **После адаптации в этот план:** 96/100.

## 2.2. С чем согласны

- Полный бесплатный результат должен быть доступен без signup.
- Сильный второй job важнее грубой частотности.
- Нельзя строить «фабрику» до реального пилота.
- Нужны разные временные окна для product и SEO.
- Аналитика не должна передавать содержимое пользовательского результата.
- У каждого инструмента должны быть privacy line, источники, error states и переносимый результат.

## 2.3. Что исправлено

1. Исходный 120-дневный план смешивает Other Bali и voice baby tracker. В новой архитектуре baby tracker полностью вынесен из контура Other Bali.
2. Географии keyword research нельзя механически брать из baby-tracker части. Для Other Bali сначала используются реальные страны из GSC, затем дополнительные рынки.
3. Метрики `copy/download/print` недостаточны для travel-product. Добавлены job-specific outcomes: `open_maps`, `view_place`, `save`, `add_to_trip`, `route_open`.
4. Добавлен обязательный **Reuse Gate**: сначала выяснить, можно ли усилить существующий `/plan`, а не создавать второй движок с похожим результатом.
5. Добавлен слой **Surface Decision**, которого не было в исходном memo.

## 2.4. Три критических недостатка исходного документа для Other Bali

1. Не формализована связь `Intent → Surface → URL/Tool`.
2. Не учитывается риск дублирования уже существующих `/plan`, `/my-day`, collections и place pages.
3. Не описана единая управленческая модель артефактов, решений, версий и агентских handoff.

---

# 3. Текущий статус программы

| Поток | Исполнитель | Текущая задача | Статус | Что будет сделано после получения |
|---|---|---|---|---|
| Internal discovery | Hermes | Read-only аудит репозитория, данных, страниц, сценариев и контрактов | RUNNING | Независимая приемка и gap list |
| External discovery | GenSpark | Исследование реальных jobs, запросов, SERP, конкурентов и evidence | RUNNING | Проверка ссылок, дедупликация и source audit |
| Architecture | ChatGPT | Новая master-архитектура и будущая reconciliation | ACTIVE | Сведение двух потоков |
| Implementation | Codex | Пока не назначается | BLOCKED | Подключается после winner decision и pilot brief |
| Owner decisions | Selena | Scope, winner, backup, budget cap, launch sign-off | WAITING FOR GATES | Решения только по спорным пунктам |

**Правило:** текущий этап не перезапускается. Если отчет одного агента слабый, ему возвращается конкретный delta-fix, а не новое широкое задание.

---

# 4. Целевая архитектура

```text
┌──────────────────────────────────────────────────────────────┐
│ 0. GOVERNANCE                                               │
│ Decision Log · Event Log · Versioning · Owner approvals      │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ 1. EVIDENCE LAYER                                           │
│ Hermes internal evidence + GenSpark external evidence       │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ 2. INTENT KNOWLEDGE GRAPH                                   │
│ Canonical intents · modifiers · evidence · data support     │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ 3. SURFACE DECISION ENGINE                                  │
│ Existing feature / tool / decision page / collection / none │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ 4. CANDIDATE & SCORECARD                                    │
│ 20–30 jobs · keyword map · SERP · data readiness · score    │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ 5. PILOT PRODUCT                                            │
│ One job · full free result · no signup · second job         │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ 6. MEASUREMENT                                              │
│ Product 14/30d · SEO 8–12w · Go/Hold/Improve/Noindex        │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ 7. SECOND PILOT                                             │
│ Проверка повторяемости решений                              │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ 8. REUSABLE TOOL KIT                                        │
│ Только реально повторившиеся компоненты                     │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────┐
│ 9. CONTROLLED SCALE                                         │
│ Tools + decision pages + collections + geo pages            │
└──────────────────────────────────────────────────────────────┘
```

---

# 5. Доменные сущности

## 5.1. Canonical Intent

Базовая работа пользователя, независимая от конкретного района и URL.

Обязательные поля:

- `intent_id`;
- `canonical_name`;
- `user_job`;
- `trigger`;
- `desired_outcome`;
- `journey_stage`;
- `traveler_type`;
- `eligible_place_types`;
- `required_venue_fields`;
- `evidence_status`;
- `data_support_status`;
- `product_surfaces`;
- `owner_scope_status`.

## 5.2. Modifier

Контекст, который уточняет intent, но не создает новый canonical intent автоматически:

- district;
- time/daypart;
- budget;
- companion;
- weather;
- transport;
- occasion;
- dietary need;
- accessibility;
- trip stage.

## 5.3. Surface Assignment

Решение, где именно закрывается работа:

- `EXISTING_PLAN_FLOW`;
- `EXISTING_MY_DAY_FLOW`;
- `SEARCH_FILTER`;
- `COLLECTION`;
- `DECISION_PAGE`;
- `INTERACTIVE_TOOL`;
- `ITINERARY_MODULE`;
- `PLACE_PAGE_SUPPORT`;
- `PRODUCT_ONLY_NO_URL`;
- `NO_BUILD`.

## 5.4. Page Candidate

Конкретный индексируемый URL-кандидат. Не создается автоматически из каждой комбинации.

Поля:

- `page_candidate_id`;
- `intent_id`;
- `modifiers`;
- `proposed_url`;
- `unique_value_statement`;
- `content/data dependencies`;
- `cannibalization_target`;
- `indexability_status`;
- `canonical_target`.

## 5.5. Tool Candidate

Интерактивная реализация одной работы.

Поля:

- `tool_candidate_id`;
- `intent_id`;
- `free_job_definition`;
- `required_inputs`;
- `free_result`;
- `portable_outcomes`;
- `second_job`;
- `second_job_destination`;
- `browser_completion_possible`;
- `data_dependencies`;
- `risk_tier`;
- `maintenance_risk`;
- `scorecard`;
- `candidate_status`.

## 5.6. Experiment

Зафиксированная версия пилота:

- hypothesis;
- variant/version;
- audience/source;
- traffic start date;
- metrics;
- sample thresholds;
- decision date;
- decision: `SCALE`, `IMPROVE`, `HOLD`, `NOINDEX`, `RETIRE`.

## 5.7. Evidence Record

- source type;
- source URL/file/path;
- extracted text or faithful paraphrase;
- checked date;
- relevance;
- confidence;
- linked intent/page/tool;
- fact vs interpretation.

---

# 6. Последовательный план исполнения

## Фаза 0. Текущий freeze

**Статус:** ACTIVE NOW.

До получения Hermes и GenSpark запрещено:

- создавать новые routes;
- запускать page generation;
- менять sitemap;
- строить reusable tool platform;
- вручную собирать параллельную keyword library;
- назначать третьему агенту еще одну «финальную» intent library.

Разрешено:

- принять этот master-plan;
- зафиксировать текущие события;
- подготовить шаблон приемки результатов;
- обеспечить агентам доступ к нужным источникам, если они сообщат blocker.

### Gate 0

- два активных задания не дублируются;
- production не меняется;
- следующая разрешенная операция — приемка результатов.

---

## Фаза 1. Получение и фиксация raw outputs

**Триггер:** Hermes и/или GenSpark завершили работу.

Действия:

1. Сохранить каждый исходный файл без редактирования.
2. Зафиксировать дату, версию, исполнителя, статус и заявленный quality score.
3. Создать запись в Event Log.
4. Не объединять два результата до независимой приемки.

Ожидаемые logical artifacts:

- `HERMES_INTERNAL_INTENT_AUDIT_RAW`;
- `GENSPARK_EXTERNAL_INTENT_RESEARCH_RAW`;
- `DISCOVERY_INTAKE_REGISTER`.

**[Открытое решение]** Физические пути в репозитории выбираются после аудита существующей структуры документов. Новый параллельный `/docs/intent-os/` не создается автоматически, если уже существует master docs contour.

---

## Фаза 2. Acceptance audit двух исследований

**Исполнитель:** ChatGPT.  
**Ориентир:** 1–2 рабочих дня после получения полных файлов.

### Hermes проверяется по:

- покрытию архитектуры, Decision Log, routes, schemas, `/plan`, `/my-day`, collections, venue data;
- точным file/path/code references;
- разделению извлеченного и интерпретированного;
- выявлению дублей и data gaps;
- отсутствию изменений production.

### GenSpark проверяется по:

- прямым рабочим evidence URL;
- разнообразию источников;
- корректности user job;
- дедупликации;
- разделению intent и modifier;
- отсутствию выдуманных volume/traffic;
- датам проверки;
- SERP и competitor evidence.

### Выборочная проверка

- все записи без evidence;
- все confidence >90;
- 20 случайных evidence links или не менее 10% набора;
- все подозрительные дубли;
- все claims о частотности, конкурентах и product availability.

### Выход

`OTHER_BALI_DISCOVERY_ACCEPTANCE_REPORT_V1_0`

### Quality Gate

- каждый отчет: не менее 90/100;
- нет критического blocker;
- при провале — точечный correction brief, а не новый полный research.

---

## Фаза 3. Reconciliation и Canonical Intent Library

**Вход:** два принятых исследования.

Действия:

1. Нормализовать формулировки.
2. Объединить синонимы.
3. Отделить modifiers от canonical intents.
4. Связать каждый intent с external evidence и internal support.
5. Присвоить статус:
   - `ACCEPT`;
   - `ACCEPT_AFTER_DATA`;
   - `PRODUCT_ONLY`;
   - `RESEARCH_MORE`;
   - `MERGE`;
   - `REJECT`.
6. Зафиксировать спорные owner decisions.

Выходы:

- `OTHER_BALI_INTENT_RECONCILIATION_REPORT_V1_0`;
- `OTHER_BALI_CANONICAL_INTENT_LIBRARY_V1_0`;
- machine-readable CSV/JSON;
- evidence map;
- merge/reject register.

### Quality Gate

- artifact quality ≥93/100;
- 100% canonical intents имеют source status;
- 100% имеют data support status;
- нет географических дублей, замаскированных под разные intents;
- ни один intent еще не считается автоматически будущей страницей.

---

## Фаза 4. Surface Decision Pass

Для каждого canonical intent назначается лучший способ решения.

### Порядок решения

1. Существует ли уже подходящая поверхность?
2. Можно ли усилить ее без нового URL?
3. Нужен ли интерактивный результат?
4. Достаточна ли decision page или collection?
5. Имеет ли отдельный URL уникальную ценность?
6. Есть ли риск cannibalization?
7. Есть ли данные для честного результата?

### Reuse Gate для `/plan`

До выбора Bali Day Planner обязательно установить:

- что уже умеет `/plan`;
- доступен ли полный результат без auth;
- можно ли copy/open maps/save locally;
- куда ведет existing second job;
- какие данные и алгоритмы уже используются;
- нужен ли новый acquisition route или достаточно улучшить `/plan`;
- если нужен `/tools/...`, может ли он использовать один и тот же planning engine, а не второй набор логики.

### Выход

`OTHER_BALI_INTENT_SURFACE_MAP_V1_0`

### Quality Gate

- 100% accepted intents имеют surface assignment;
- каждый новый URL имеет уникальную роль;
- нет двух движков, решающих одну работу;
- unresolved conflicts вынесены владельцу.

---

## Фаза 5. Формирование shortlist из 20–30 single-job candidates

В shortlist попадают только jobs, которые:

- имеют action/completion intent;
- могут быть завершены в браузере;
- дают полный переносимый результат;
- имеют естественный second job;
- поддерживаются текущими или достижимыми данными;
- не требуют ручного concierge для каждого пользователя.

Начальный candidate pool из memo:

- Bali Day Planner;
- Bali Rainy Day Planner;
- Bali Sunset Finder;
- Best Area to Stay Quiz;
- Bali Restaurant Picker;
- Ubud One-Day Planner;
- Bali Trip Budget Calculator.

Это не закрытый список. Hermes и GenSpark могут добавить или исключить кандидатов.

---

## Фаза 6. Keyword Map + SERP Review + Scorecard

**Ориентир:** 4–6 дней.

### Географии

Не использовать автоматически US/UK/Canada/Australia. Порядок:

1. взять фактические страны из Google Search Console;
2. выбрать top markets по impressions/clicks и стратегической ценности;
3. отдельно учитывать Indonesia/resident intent, если данные подтверждают;
4. документировать рынок для каждого volume/competition value.

### Собираемые поля

- query и вариации;
- volume и источник;
- traffic potential;
- difficulty;
- CPC как косвенный сигнал;
- current SERP intent;
- top URLs;
- existing interactive tools;
- seasonality;
- mobile/desktop, если доступно;
- zero-click/direct-answer risk;
- связь с second job;
- data readiness;
- cannibalization risk.

### Scorecard

| Критерий | Вес |
|---|---:|
| Ясность намерения | 20 |
| Полнота решения в браузере | 15 |
| Сила второго job | 20 |
| Повторяемость / история | 10 |
| SERP opportunity | 10 |
| Уникальная полезность | 10 |
| Safety / compliance | 10 |
| Стоимость поддержки | 5 |

### Интерпретация балла

- 75–100: build-eligible по memo;
- 60–74: prototype/paid-search test;
- ниже 60: reject.

Для **первого пилота Other Bali** вводится более строгий внутренний порог:

- winner: ≥85, FULL data support, no hard blockers;
- backup: ≥80;
- если подходящего winner нет — HOLD, а не искусственное назначение победителя.

Важно: quality score отчета должен быть >90, но сам opportunity score кандидата не обязан магически стать 90. Подмена анализа красивой цифрой обычно заканчивается красивой, но бесполезной страницей.

### Выход

- `OTHER_BALI_SINGLE_JOB_SCORECARD_V1_0`;
- `OTHER_BALI_KEYWORD_SERP_MAP_V1_0`;
- winner, backup и rejected list.

---

## Фаза 7. Winner Decision и Build-vs-Extend Decision

Owner утверждает:

- winner;
- backup;
- максимальный budget/time cap;
- build, extend или acquisition wrapper;
- launch market/language;
- second-job destination.

### Допустимые решения

1. **EXTEND_EXISTING** — улучшить `/plan` или другую поверхность.
2. **NEW_ENTRY_SAME_ENGINE** — создать `/tools/...`, но использовать существующий domain engine.
3. **NEW_TOOL** — новая реализация, если текущей логики действительно нет.
4. **HOLD** — данные или SERP не подтверждают build.

### Выход

`OTHER_BALI_PILOT_SELECTION_DECISION_V1_0`

Без этой записи Codex не запускается.

---

## Фаза 8. Pilot Product Brief + Wireflow

**Ориентир:** 3–5 дней.

Обязательные разделы:

1. One-sentence job.
2. Целевая ситуация и пользователь.
3. 1–4 обязательных input.
4. Метод формирования результата.
5. Полный бесплатный output.
6. Portable actions: copy, print, open maps, route, local save.
7. Second job и destination.
8. Privacy/storage profile.
9. Data dependencies и freshness.
10. Empty/loading/error/offline states.
11. Accessibility.
12. Event taxonomy.
13. QA cases.
14. SEO shell и indexation rule.
15. Feature flag и rollback.

### Pass Bar

Незнакомый пользователь может:

- понять работу за 5 секунд;
- начать без инструкции;
- завершить без аккаунта;
- получить полный результат;
- перенести результат;
- уйти без email;
- при желании перейти во второй job.

### Quality Gate

Pilot brief ≥95/100 и ни одного hard blocker.

---

## Фаза 9. Minimal Technical Contract

До первого build создается не framework, а минимальный контракт.

### Обязательные логические элементы

- `Tool/Experience Manifest`;
- `Input Contract`;
- `Result Contract`;
- `Outcome Actions`;
- `Privacy Line`;
- `Evidence/Source Block`;
- `Second Job Contract`;
- `Analytics Contract`;
- `Error/Empty States`;
- `Indexability State`.

### Что не строится заранее

- generic visual builder;
- universal formula engine;
- десятки speculative components;
- универсальная CMS для всех будущих tools;
- автоматическая page factory.

---

## Фаза 10. Codex Implementation

**Ориентир:** 7–12 дней после утвержденного brief.

### Задание Codex делится на два прохода

#### Pass A. Read-only implementation gap audit

- сверить winner с текущей архитектурой;
- найти reusable code;
- проверить route/canonical conflicts;
- подтвердить data sources;
- описать минимальный change set;
- не менять код.

#### Pass B. Build

- реализовать только approved scope;
- mobile/desktop;
- без signup перед результатом;
- без незапланированного backend;
- feature flag;
- deterministic fallbacks;
- content-free analytics;
- copy/open maps/save actions;
- tests;
- rollback.

### Hard stops

- новая backend-система вне brief;
- дублирование существующего planning engine;
- guessed venue facts;
- результат скрыт за auth/email;
- analytics передает itinerary/content;
- sitemap/index до launch sign-off.

---

## Фаза 11. QA, Privacy и Launch Readiness

**Ориентир:** 2–4 дня QA + 2–3 дня launch content.

Проверяется:

- factual correctness;
- result coverage по валидным input combinations;
- отсутствие пустых или фиктивных fallback;
- mobile/desktop;
- keyboard/screen reader;
- performance;
- error recovery;
- storage/delete/reset;
- analytics payload;
- title/H1/canonical;
- schema только при соответствии;
- internal links;
- sitemap exclusion до READY;
- unique explanatory content;
- source date/method;
- second-job CTA только после completion.

### Launch state machine

`DRAFT → QA → READY_NO_INDEX → LIVE_NOINDEX → LIVE_INDEXABLE`

Переход в `LIVE_INDEXABLE` допускается только после полного sign-off.

### Quality Gate

Implementation/launch readiness ≥95/100 и 0 critical blockers.

---

## Фаза 12. Measurement

### Общая event taxonomy

- `tool_view`;
- `tool_start`;
- `tool_complete`;
- `result_copy`;
- `result_print`;
- `result_open_maps`;
- `result_route_open`;
- `place_view`;
- `save_to_my_bali`;
- `add_to_trip`;
- `second_job_cta_view`;
- `second_job_cta_click`;
- `return_same_device_7d/30d` при допустимой privacy-модели.

Нельзя передавать:

- полный itinerary;
- точные пользовательские ответы;
- email до opt-in;
- содержимое заметок;
- персональные данные поездки.

### Product window

- первичный readout: 14 дней;
- второй readout: 30 дней;
- решение по downstream metrics — только после ≥500 релевантных визитов, ≥100 starts и ≥100 eligible completions;
- меньшая выборка = `HOLD/INCONCLUSIVE`.

### Базовые thresholds

| Метрика | Go | Hold/Improve | Kill/Noindex |
|---|---:|---:|---:|
| Start rate | ≥35% | 15–34% | <15% |
| Completion from start | ≥55% | 25–54% | <25% |
| Meaningful outcome action | ≥20% | 8–19% | <8% |
| Second-job CTA click | ≥8% | 2–7% | <2% |
| Transition to core product | ≥3% | 1–2.9% | <1% |
| Return 30d for repeat jobs | ≥15% | 5–14% | <5% |

`Meaningful outcome action` задается по job: для planner это может быть copy/route/add-to-trip; для restaurant picker — place view/directions/save.

### SEO window

Не раньше 8–12 недель после индексации и отдельно от product score:

- index coverage;
- impressions;
- query coverage;
- average positions;
- CTR;
- organic starts/completions;
- cannibalization;
- page quality/freshness.

### Decisions

- `SCALE`;
- `IMPROVE`;
- `KEEP_AS_FREE_UTILITY`;
- `HOLD`;
- `NOINDEX`;
- `RETIRE`.

---

## Фаза 13. Второй пилот

Запускается только после 14/30-day product readout первого пилота.

Цель второго пилота:

- подтвердить, какие решения повторяются;
- проверить другой тип input/result;
- не копировать первый tool только с новым названием;
- протестировать reuse без преждевременной платформы.

Выбор второго пилота выполняется из обновленного scorecard. Он не назначается сейчас.

---

## Фаза 14. Reusable Tool Kit

Создается только после двух пилотов.

Кандидаты на выделение:

- `ToolShell`;
- `ToolIntro`;
- `InputSchema`;
- `ResultCard`;
- `OutcomeActions`;
- `StorageProfile`;
- `SourceBlock`;
- `SafetyBoundary`;
- `SecondJobCTA`;
- `RelatedTools`;
- `AnalyticsAdapter`;
- `MetadataFactory`;
- `StructuredData`;
- `AccessibilityContract`;
- `ErrorBoundary`.

Правило: компонент выделяется, если он реально повторился или уже доказан двумя реализациями. Спекулятивная универсальность не считается архитектурой, это просто дорогая форма воображения.

### Выход

`OTHER_BALI_REUSABLE_TOOL_KIT_SPEC_V1_0`

### Quality Gate

- повторяемость доказана двумя пилотами;
- API не привязан к одному tool;
- нет speculative abstraction;
- tests и versioning описаны;
- score ≥95/100.

---

## Фаза 15. Controlled Scale к 1 000 страницам

Цель «1 000 страниц» сохраняется как возможный downstream portfolio, но не как обязательная квота.

### Портфель поверхностей

1. **Interactive single-job tools** — немного, только сильные jobs.
2. **Decision pages** — ответ на конкретное решение с уникальными данными.
3. **Scenario pages** — first day, rainy day, last night, with kids и т. п.
4. **Collections** — курируемые наборы с ясным критерием.
5. **District intent pages** — только там, где район существенно меняет ответ.
6. **Route/itinerary pages** — реальная последовательность, а не список ссылок.
7. **Existing place/entity pages** — текущий самостоятельный контур.

### Scale gates

- Batch 1: 1 pilot;
- Batch 2: 2 pilots;
- Batch 3: 10–25 approved page candidates;
- Batch 4: 100 страниц;
- Batch 5: 250;
- Batch 6: 500;
- Batch 7: до 1 000 только при подтвержденной уникальности, indexation health и отсутствии scaled-content pattern.

Для каждого page candidate обязательны:

- distinct intent/result;
- evidence;
- sufficient data;
- unique value;
- no cannibalization;
- correct canonical;
- indexability approval;
- maintenance owner/freshness rule.

---

# 7. Data и privacy policy для Other Bali tools

## Risk A — non-sensitive

Примеры: Restaurant Picker, Sunset Finder, Area Quiz.

- server persistence не нужна;
- допустимы обычные local preferences;
- clear reset;
- content-free analytics.

## Risk B — personal trip context

Примеры: Day Planner, сохраненная поездка.

- ephemeral by default;
- local save только с ясным обозначением;
- cloud sync только после отдельного действия;
- не логировать itinerary;
- export/delete/reset.

## Risk C

Для текущего Other Bali single-job pilot не планируется. Если tool начнет обрабатывать документы, health или иные sensitive data, нужен отдельный threat model и новая архитектурная программа.

---

# 8. Governance и Source of Truth

## 8.1. Не создавать параллельную бюрократию

Hermes должен показать, где уже находятся:

- master architecture;
- Decision Log;
- Event Log или release log;
- data contracts;
- SEO contracts.

Новые документы встраиваются туда. Отдельная папка создается только при отсутствии существующего контура.

## 8.2. Logical artifact set

1. Master Architecture V2.0.
2. Discovery Intake Register.
3. Discovery Acceptance Report.
4. Reconciliation Report.
5. Canonical Intent Library.
6. Evidence Register.
7. Intent Surface Map.
8. Single-Job Candidate Scorecard.
9. Keyword/SERP Map.
10. Pilot Selection Decision.
11. Pilot Product Brief.
12. Event Taxonomy.
13. Risk/Storage Policy.
14. Codex Implementation Brief.
15. QA/Launch Report.
16. 14/30-day Product Readout.
17. 8–12-week SEO Readout.
18. Second Pilot Decision.
19. Reusable Tool Kit Spec.
20. Controlled Scale Spec.

## 8.3. Handoff block

Каждый агентский отчет заканчивается:

- `STATUS`;
- `FILES_CREATED`;
- `FILES_CHANGED`;
- `SOURCES_REVIEWED`;
- `UNRESOLVED_ISSUES`;
- `OWNER_DECISIONS_REQUIRED`;
- `QUALITY_SCORE`;
- `RECOMMENDED_NEXT_STEP`.

## 8.4. Decision rules

- изменение архитектуры без Decision Log — не принято;
- raw research не редактируется;
- derived data имеет версию и source references;
- `final-final-2` не является версией, это симптом;
- следующий gate не открывается без принятого предыдущего.

---

# 9. RACI

| Работа | Selena | ChatGPT | Hermes | GenSpark | Codex |
|---|---|---|---|---|---|
| Внутренний аудит | Informed | Reviewer | Responsible | — | — |
| Внешнее исследование | Informed | Reviewer | — | Responsible | — |
| Acceptance audit | Approver | Responsible | Corrects gaps | Corrects gaps | — |
| Reconciliation | Approver | Responsible | Consulted | Consulted | — |
| Surface map | Approver | Responsible | Consulted | Consulted | — |
| Keyword/SERP scorecard | Approver | Responsible | Data input | Research input | — |
| Winner decision | Accountable | Prepares decision | — | — | — |
| Pilot brief | Approver | Responsible | Consulted | Consulted | Consulted |
| Implementation | Informed/Approver | QA/spec owner | — | — | Responsible |
| Launch sign-off | Accountable | Responsible QA | — | — | Fixes |
| Measurement decision | Accountable | Responsible | — | — | Data/implementation support |

---

# 10. Quality model

## 10.1. Что должно быть выше 90

- качество internal audit;
- качество external research;
- acceptance report;
- reconciliation;
- canonical library;
- surface map;
- pilot selection report;
- product brief;
- implementation/QA;
- reusable kit spec.

## 10.2. Что не обязано быть выше 90

Opportunity score отдельного кандидата. Для него действует бизнес-порог scorecard. Если насильно повысить его до 90 без новых данных, мы не улучшили идею, а всего лишь подправили арифметику.

## 10.3. Оценка этого архитектурного плана

| Критерий | Вес | Балл |
|---|---:|---:|
| Верность исходному memo | 10 | 10 |
| Учет текущих Hermes/GenSpark assignments | 10 | 10 |
| Последовательность и зависимости | 15 | 15 |
| Защита от преждевременного scale | 15 | 15 |
| Intent/Surface/Data model | 15 | 14 |
| Pilot и measurement contract | 15 | 14 |
| Governance и handoff | 10 | 9 |
| Rollback/indexation safety | 10 | 9 |
| **Итого** | **100** | **96** |

Оставшиеся 4 балла нельзя честно закрыть до результатов Hermes: неизвестны точные repo paths, текущая реализация `/plan`, существующая analytics taxonomy и полный data contract.

---

# 11. Три главных риска программы

1. **Дублирование `/plan`.** Новый tool может оказаться второй версией уже существующей логики.
2. **Данные не поддерживают обещание.** Маршрут/подборщик может выглядеть красиво, но давать слабые или неверные результаты из-за часов, coverage и travel-time gaps.
3. **Комбинаторный scale.** Intent × district × mood × budget легко создает тысячи формально разных, но фактически одинаковых страниц.

Меры контроля уже встроены: Reuse Gate, Data Readiness, Surface Decision, batch scale и noindex state.

---

# 12. Что происходит прямо сейчас

## Уже выполняется

- Hermes: internal read-only discovery.
- GenSpark: external intent/evidence research.

## Мы не запускаем новое первое задание

Следующий шаг после получения файлов:

1. зафиксировать raw outputs;
2. провести acceptance audit;
3. выдать точечные correction briefs при необходимости;
4. только после 90+ принять оба исследования;
5. создать Reconciliation Report;
6. собрать Canonical Intent Library;
7. выполнить Surface Decision;
8. отобрать 20–30 tool candidates;
9. провести keyword/SERP/scorecard;
10. выбрать winner и backup;
11. затем подключить Codex.

## Следующее формальное событие

`RECEIVE_HERMES_AND_GENSPARK_OUTPUTS`

До этого события от Selena не требуется ручной сбор keywords. Нужны только ответы агентам, если они сообщат конкретный blocker доступа.

---

# 13. Финальное решение

**[Интерпретировано]** Other Bali строит не «1 000 страниц», а управляемую систему, которая решает, какая из 1 000 потенциальных идей заслуживает URL, какая — интерактивный tool, какая — существующий `/plan`, а какая не заслуживает ничего, кроме спокойного удаления из backlog.

Текущие Hermes и GenSpark задания остаются первым этапом. Новый план начинается с их приемки. Bali Day Planner остается кандидатом. Codex подключается только после evidence, surface decision, scorecard и owner approval. Reusable architecture появляется после двух пилотов, а масштаб — после реальных продуктовых и SEO-сигналов.
