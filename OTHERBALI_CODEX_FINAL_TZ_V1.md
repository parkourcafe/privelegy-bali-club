# Other Bali — финальное ТЗ для Codex

**Версия:** 1.0  
**Дата:** 2026-07-22  
**Статус:** ready for execution  
**Владелец решения:** Selena  
**Первый режим запуска:** `AUDIT_ONLY`  
**Первый инженерный gate:** `T0`  

> Это не команда «перестроить весь сайт». Это gate-driven контракт для безопасного перехода от текущего production-репозитория к Other Bali V3.1. Первый запуск заканчивается диагностикой и документами. Исправление T0, контракты данных и последующие продуктовые задачи запускаются отдельными режимами.

---

## 0. Параметры текущего запуска

```text
RUN_MODE=AUDIT_ONLY
TARGET_TASK=T0
WRITE_AUDIT_DOCS=true
ALLOW_LOCAL_COMMITS=true
ALLOW_PUSH_OR_DEPLOY=false
```

---

## 1. Роль

Ты — senior software architect, Next.js/Supabase engineer, migration engineer, technical SEO lead и QA lead продукта **Other Bali**.

Твоя задача — исследовать текущую реализацию, закрепить утверждённые поправки V3.1, измерить T0-проблему `/places/[slug]` и подготовить минимальный, доказательный план исправления без потери страниц, SEO equity, данных, редакционного контента, медиа, partner portal и аналитики.

Это существующий production-продукт, не greenfield. Сначала доказательства и preservation map, затем изменения.

Публичный язык продукта — **English**. Внутренние документы, QA и пояснения владельцу — **Russian**.

---

## 2. Источники правды

### 2.1. Два разных вида правды

- **As-is truth:** точный commit репозитория, текущая схема БД, Storage, production responses и доступная аналитика показывают, что существует сейчас.
- **To-be truth:** live-canon, V3.1 corrections и Other Bali Master V3.0 определяют целевую продуктовую систему.

Текущий код не может молча переопределять target-архитектуру. Target-документ не может выдавать предполагаемую live-реализацию за факт.

### 2.2. Порядок приоритета

1. **Live-canon:** действующая money model, 10 audit corrections от 2026-07-21, T0 gate, honesty/publication/index rules.
2. **Этот V3.1 execution contract и Correction Addendum.**
3. **Other Bali Master Architecture V3.0.**
4. После утверждения: **Data Dictionary V1 → Taxonomy V1 → Migration Map V1**.
5. Утверждённые постраничные спецификации и acceptance matrices.
6. Репозиторий — доказательство текущего состояния.
7. Старые Bali Privilege/Canggu документы — только исторический материал.

При конфликте побеждает более высокий источник. Каждый конфликт записывается в Conflict Register; молчаливое усреднение запрещено.

### 2.3. Четыре приложенных файла — legacy-only

Следующие файлы имеют статус `HISTORICAL / READ-ONLY / NOT IMPLEMENTATION AUTHORITY`:

- `Bali_Privilege_Master_Architecture.md`
- `Bali_Privilege_Master_Architecture-2.md`
- `Bali_Privilege_Master_Architecture-3.md`
- `Bali_Privilege_v0.1_Canggu.md`

Не объединяй и не «усредняй» их. Они содержат отменённый Canggu-first канон, старую Venue-centric модель, paid listing/Featured/Route/Category tiers и Privileges как ядро.

Из legacy разрешено извлекать только:

- field acquisition tactics;
- partner onboarding/claim/update ideas;
- QR attribution experiments;
- redemption validation ideas;
- media/content production tactics;
- Canggu как возможный операционный пилот;
- GTM-гипотезы.

Для любого переиспользованного legacy-правила укажи `KEEP / ADAPT / REJECT`, исходный файл и причину.

Из legacy запрещено переносить:

- Canggu-specific ограничения схемы, каталога или навигации;
- `active_deep` как ограничение публичного продукта;
- запрет полноценных Place cards вне Canggu;
- Bali Privilege как отдельный основной продукт;
- paid listing, Featured Partner, Route Placement, Category Sponsorship;
- sponsored ranking или покупку органической позиции;
- старую упрощённую модель `Venue / District / Placement` вместо сущностей V3;
- старую roadmap как инженерный порядок работ;
- неподтверждённые рыночные цифры и старые данные о KORA.

Если полный Master V3.0 отсутствует, не подменяй его legacy-файлами. В `AUDIT_ONLY` разрешено закончить repository baseline и T0 diagnosis по этому контракту, но target contracts пометь `BLOCKED: MASTER_V3_MISSING` и не пытайся проектировать всю систему по старым документам.

---

## 3. Непересматриваемый канон текущего задания

1. **Other Bali** — единственный основной продукт для всего Бали.
2. **Today** помогает принять решение сейчас на острове; **Plan** готовит будущий день/поездку; **Explore** поддерживает самостоятельное исследование; **My Bali** хранит и активирует личный выбор.
3. Home fork: две travel-двери — `In Bali now` и `Planning` — плюс вторичный partner entry.
4. **Privileges** — необязательный контекстный коммерческий слой внутри релевантных карточек, а не основной продукт и не обязательный пункт навигации.
5. Вся Бали равна в модели данных. Порядок наполнения районов — операционный приоритет, не schema/IA constraint.
6. Core entities: `Organization`, `Place`, `Experience`, `Experience Offering`, `Event`, `Route`, `Collection`, `Area`, `Trip`, `Offer`, `MediaAsset`, `Source`, `Verification`, `Interaction event`, `Partner account`.
7. `Experience` — единый редакционный объект. `Experience Offering` — конкретный продаваемый вариант у оператора с расписанием, ценой, форматом и booking-механикой.
8. `PriceOption`, `Schedule`, `Availability`, `BookingOption`, `Policy`, `Package`, `TicketOption` и `Offer` не сворачиваются в один JSON blob и не подменяют друг друга.
9. Partner предлагает и подтверждает факты. Только Other Bali владеет editorial verdict, `best_for`, `not_ideal_for`, warnings и organic ranking.
10. Partner status, money и Privileges не влияют на organic editorial rank.
11. Единственный платный продукт текущего канона — фиксированный fee за реально подтверждённую seated-бронь через собственный booking rail. Outbound click не является бронью.
12. Discovery, intent и confirmed outcome измеряются раздельно. Business-critical outcomes не живут только в GA4/product analytics.
13. Каждое изменяемое утверждение имеет source/evidence, verification state и freshness. Нет данных — `null / needs_verification`, а не догадка.
14. `Offer.price` публикуется только из допустимого `[OFFICIAL]` источника, подтверждённого у первоисточника.
15. Publication gate и index gate — разные решения. Google indexing — мониторинг, а не engineering acceptance.
16. Existing routes, URLs, content, data, photos, videos, menus и documents сначала инвентаризируются и сохраняются.
17. `/route/[slug]` остаётся в единственном числе. Не переименовывать в `/routes` или `/trips`.
18. `/places`, `/places/[slug]`, `/plan`, `/collections`, `/guides`, `/bali/[district]/[intent]`, partner routes и существующие resort-F&B pages сохраняются до утверждённого mapping.
19. Redirect `/my-day → /today` не выполнять без отдельной проверки ссылок, SEO, аналитики и решения владельца.
20. Числа `447/517` не считать фактами БД. До использования запросить total/published/indexable из реального источника.
21. Первый и единственный инженерный таск до дальнейших waves — **T0**.

---

## 4. V3.1 Correction Addendum

Создай короткий addendum. Не переписывай весь Master V3.0.

### Correction 1 — Today shortcuts

Список Today смешивает разные измерения: scenario, intent, category, audience, transport constraint, location context и daypart.

До утверждения Taxonomy V1:

- не фиксировать «ровно шесть сценариев» в DB enum, schema или hard-coded business logic;
- считать их `candidate launch shortcuts`;
- описывать каждый shortcut как композицию taxonomy dimensions;
- `Near me`, `Solo`, `Without scooter`, `Warung`, `First evening` нельзя хранить как один и тот же тип `Scenario`;
- финальные шесть shortcuts предлагаются в Taxonomy V1, но не кодируются без owner approval.

### Correction 2 — sponsored visibility

До отдельного решения владельца всё, что относится к paid visibility, имеет статус:

```text
RESERVED / DISABLED / OUT OF SCOPE
```

Это включает:

- `SponsorshipCampaign`;
- sponsored results blocks;
- paid visibility tiers;
- sponsored admin controls;
- sponsored analytics;
- покупку места в route/category;
- влияние partner status или Privilege на organic ranking.

Не удаляй существующий код без Migration Map и отдельного решения. Найди его, опиши и предложи безопасный freeze/feature flag, если он уже существует.

Default для текущего scope:

- отдельную публичную витрину `/privileges` не создавать;
- verified offers показывать только контекстно в релевантных карточках;
- sponsored/visibility tier не продавать и не включать.

### Correction 3 — typed ownership вместо свободного polymorphic owner

Новые таблицы не проектировать через неконтролируемый `owner_type + owner_id` без реальной ссылочной целостности.

Для `PriceOption`, `Schedule`, `Availability`, `BookingOption`, `Policy` и аналогичных блоков целевой default:

```sql
place_id                  uuid null references places(id)
experience_offering_id    uuid null references experience_offerings(id)
event_id                  uuid null references events(id)
check (num_nonnulls(place_id, experience_offering_id, event_id) = 1)
```

Допустима типизированная association table, если live-schema или cardinality действительно требуют many-to-many. Выбор должен обеспечивать:

- настоящие foreign keys;
- явную `ON DELETE` policy;
- индексы;
- проверяемую RLS;
- отсутствие orphan records;
- понятную миграцию;
- ровно одного допустимого владельца там, где связь one-owner.

Выбор и аргументацию записать в Data Dictionary/ADR. До режима `CONTRACTS_ONLY` и утверждения документов schema не менять.

---

## 5. Разрешённые режимы

### 5.1. `AUDIT_ONLY` — текущий запуск

Разрешено:

- читать код, git history, конфигурацию, миграции и доступные read-only данные;
- запускать локальные диагностические команды и тесты;
- выполнять read-only HTTP/GSC/DB проверки;
- создавать только audit/architecture Markdown-документы;
- делать локальные docs-only commits, если это не затрагивает чужие изменения.

Запрещено:

- менять product code, schema, migrations, dependencies, CI или deployment;
- исправлять T0;
- редизайнить страницы;
- push/deploy;
- автоматически переходить к следующему gate.

### 5.2. `IMPLEMENT_T0`

Запускается отдельной командой после принятия `AUDIT_ONLY`.

Разрешены только:

- минимальный fix доказанной причины T0;
- regression tests;
- строго относящаяся к T0 CI-защита;
- 5xx monitoring/alert configuration в подтверждённом scope.

T1–T10, schema migration и redesign запрещены.

### 5.3. `CONTRACTS_ONLY`

Запускается после принятия T0. Docs-only:

1. Data Dictionary V1.
2. Taxonomy V1.
3. Migration Map V1.

Product code и migrations не менять.

### 5.4. `IMPLEMENT_TASK`

Разрешён только после утверждения трёх контрактов. Требует ровно один `TASK_ID`. Несколько несвязанных задач в одном запуске запрещены.

---

## 6. `AUDIT_ONLY`: обязательные действия

### 6.1. Repository baseline

Сначала прочитай все `AGENTS.md`, repository instructions, README, package scripts и существующие architecture/SEO/audit документы.

Зафиксируй:

- repository root;
- current branch и exact HEAD SHA;
- доступный `origin/main` SHA;
- git status и пользовательские изменения;
- framework/runtime/package versions;
- build, lint, typecheck и test commands;
- Next.js routes;
- middleware, redirects, headers, robots, sitemap, canonical и structured-data logic;
- Supabase migrations и current data model;
- publication/index gates;
- partner portal;
- media storage/use;
- interaction analytics и business outcomes;
- deploy/observability configuration.

Не переключай ветки и не изменяй git state.

Если worktree грязный:

- отдели пользовательские изменения от своих;
- не перезаписывай и не форматируй их;
- если они пересекаются с T0, остановись и укажи точные файлы/конфликт.

### 6.2. Current-to-target reconciliation

Составь таблицу:

```text
V3 requirement
→ current implementation
→ evidence: file/symbol/migration
→ status: exists / partial / missing / conflicts
→ risk
→ required action
→ task/gate
```

Отдельно проверь все core entities и коммерческие блоки. Существование похожего поля не считать доказательством правильной policy или semantics.

### 6.3. Preservation baseline

До любых структурных изменений собери baseline:

- Route Inventory;
- Page Preservation Map;
- Component Inventory;
- Media Asset Inventory / Reuse Registry;
- Current-to-Target Field Map;
- Internal Link Graph;
- Sitemap / HTTP Status Matrix;
- Analytics Current-to-Target Map;
- Redirect Proposal Register.

В `AUDIT_ONLY` это могут быть секции одного reconciliation report. Никаких redirects, renames, slug regeneration, canonical/noindex changes или deletions.

### 6.4. Legacy conflict register

Для каждого применимого legacy-тезиса запиши:

```text
source file → legacy rule → conflict with V3/live → KEEP / ADAPT / REJECT → reason
```

---

## 7. T0 — диагностика `/places/[slug]`

Известен только sampled route-level risk: detail page могла отдавать 500 для crawler/generic UA. Масштаб заранее неизвестен.

### 7.1. Реальные счётчики

При безопасном read-only доступе к БД получи:

- total Place records;
- published Place records;
- indexable Place records.

Приложи запросы и timestamp. Если доступа нет — `needs_verification`. Sitemap count не подменяет DB count.

### 7.2. Stratified 3-UA matrix

Построй документированную выборку из sitemap и live данных:

- indexable place detail pages;
- несколько районов и категорий;
- разные completeness/media/legacy profiles;
- известные проблемные URL;
- контрольные non-place pages;
- отсутствующий slug как negative control.

Если доступно 30 и более Place URL, используй не менее 30, стратифицированных по существующим сегментам. Если меньше — проверь все. Не заявляй coverage, которого sample не даёт.

Для каждого URL выполни fetch как:

1. обычный browser UA;
2. generic/curl UA;
3. Googlebot Smartphone UA.

Зафиксируй:

- requested URL и final URL;
- HTTP status и redirect chain;
- content-type;
- presence of valid server-rendered HTML;
- title/H1/content marker;
- canonical;
- meta robots и `X-Robots-Tag`;
- expected indexability;
- sitemap inclusion;
- internal-link evidence;
- observed error;
- timestamp и environment.

Не скрывай результаты, которые не подтверждают исходную гипотезу.

### 7.3. Root-cause evidence

Проверь:

- stack traces/logs, если доступны;
- route code и data loader;
- metadata generation;
- middleware/UA branching;
- cache/dynamic rendering;
- publication logic;
- nullable/unavailable data;
- bot/security protection;
- production-vs-local differences.

Root cause должен ссылаться на конкретные файлы, функции и воспроизводимый путь.

Если root cause не доказан, не предлагай случайный fix. Верни ranked hypotheses и минимальные следующие probes.

### 7.4. Search Console

При read-only доступе:

- собери Page Indexing reasons table;
- раздели 5xx, crawled-not-indexed, discovered-not-indexed, duplicate/canonical и intentional noindex;
- выполни доступные URL Inspection/Live URL проверки.

Если доступ отсутствует:

- не выдумывай результат;
- укажи точный blocker;
- дай короткую ручную инструкцию;
- пометь внешний gate как pending.

Google indexing не является acceptance criterion. Корректный управляемый ответ URL и GSC Live URL Test — часть проверки T0.

---

## 8. Deliverables первого запуска

Используй существующую структуру `docs`. Если эквивалентный документ уже существует, обнови его вместо создания дубликата.

1. `OTHERBALI_ARCHITECTURE_V3_1_CORRECTIONS.md`
   - три corrections;
   - source precedence;
   - date/status/owner/approver;
   - amended conflicts, без переписывания V3.

2. `OTHERBALI_CURRENT_STATE_RECONCILIATION_2026-07-22.md`
   - repository baseline;
   - current-to-target matrix;
   - legacy conflict register;
   - preservation baseline;
   - open owner decisions.

3. `OTHERBALI_T0_DIAGNOSIS_2026-07-22.md`
   - sample methodology;
   - 3-UA matrix;
   - DB counts или `needs_verification`;
   - GSC reasons или blocker;
   - proven root cause либо ranked hypotheses;
   - smallest proposed fix;
   - test plan;
   - rollback plan;
   - acceptance checklist.

4. `OTHERBALI_GATE_DRIVEN_IMPLEMENTATION_PLAN_V1.md`
   - T0;
   - contracts;
   - Wave 1;
   - Wave 2;
   - vertical slice;
   - dependencies;
   - stop conditions;
   - owner decisions.

В текущем режиме не создавай Data Dictionary, Taxonomy или Migration Map и не меняй код.

Во всех отчётах маркируй:

- `[ИЗВЛЕЧЕНО]` — прямо подтверждено документом, кодом, запросом или ответом системы;
- `[ИНТЕРПРЕТИРОВАНО]` — вывод из подтверждённых данных;
- `needs_verification` — проверить не удалось.

---

## 9. Stop / Go gates

| Этап | GO | STOP |
|---|---|---|
| T0 diagnosis | Exact branch/SHA; проблема воспроизведена или честно опровергнута; scope измерен 3-UA matrix | Неясный checkout, нет baseline, inaccessible target или конфликтующие пользовательские изменения |
| T0 fix | Root cause доказан; минимальный diff; regression test и rollback определены | Fix требует смены URL, schema, broad refactor или redesign |
| Data contracts | Legacy исключены как authority; V3.1 corrections зафиксированы; T0 принят | Нет Master V3, не решены semantics/ownership или sponsored boundary |
| Migration | Data Dictionary, Taxonomy и Migration Map утверждены; dry run/restore plan готовы | Есть inferred mapping, count/hash mismatch или destructive SQL |
| Production | CI green; ноль новых 4xx/5xx, SEO/media regressions; внешние gates выполнены | Canonical/noindex/redirect/media count меняются вне утверждённого плана |

Если безопасное продолжение требует догадки, удаления, переименования, массового backfill или изменения публичного URL — остановись, ничего не меняй и оформи blocker с доказательствами.

---

## 10. Acceptance для будущего режима `IMPLEMENT_T0`

T0 считается принятым только если:

- подтверждённая indexable `/places/[slug]` возвращает `200` для всех трёх UA;
- отдаётся валидный server-rendered HTML;
- canonical корректен и единственный;
- отсутствует случайный `noindex`/`X-Robots-Tag`;
- URL присутствует в правильном sitemap;
- существует проверяемый internal link;
- missing slug возвращает ожидаемый `404`, не `500`;
- build и typecheck проходят;
- lint/tests проходят либо baseline failures отдельно доказаны;
- relevant regression tests проходят;
- CI содержит regression protection либо есть утверждённый blocker;
- 5xx alert реализован либо честно вынесен в blocker;
- GSC Live URL Test пройден либо статус `PARTIAL — pending manual validation`;
- нет unrelated route/SEO/data changes.

Используй только `PASS / PARTIAL / BLOCKED`. Не объявляй полный PASS без обязательной внешней проверки.

---

## 11. Требования к будущему `CONTRACTS_ONLY`

### 11.1. Data Dictionary V1

Для каждого target field:

- entity/table и field;
- type и cardinality;
- required/nullability/default;
- validation;
- owner: editorial/partner/system;
- source/evidence requirement;
- confidence/freshness/review rule;
- privacy/public visibility;
- indexing/search use;
- current source field;
- transform;
- implementation status;
- unresolved decision.

Особенно явно разделить `Experience` и `Experience Offering`, а также выбрать безопасную FK-модель для коммерческих блоков.

### 11.2. Taxonomy V1

Разделить:

- geography;
- entity type;
- category/subcategory;
- intent;
- scenario;
- audience;
- mood;
- daypart;
- duration;
- budget;
- transport;
- weather fit;
- amenities/accessibility;
- dietary;
- warnings;
- commercial/editorial labels.

Обязательно:

- все девять Bali regencies/city;
- canonical key отдельно от public English label;
- synonyms не создают новые categories;
- version/deprecation policy;
- owner и evidence rule;
- Today shortcuts как композиции dimensions;
- шесть финальных shortcuts только как owner-decision proposal.

### 11.3. Migration Map V1

```text
current table.field
→ target entity.field
→ transform
→ source/evidence status
→ quality issue
→ keep / split / merge / deprecate
→ dependency
→ rollback
```

Также включить routes, URLs, components, media, redirect proposals, internal links, SEO metadata, sitemap, analytics events, partner data и saved/trip state.

Migration protocol:

1. inventory и current-to-target map;
2. проверяемый backup/export и restore plan;
3. только additive/idempotent migrations на первом проходе;
4. dry run и backfill в staging;
5. unresolved records → quarantine, не удалять и не угадывать;
6. feature-flagged read switch;
7. старые tables/assets сохранять до отдельного contract gate;
8. никаких `DROP`, `CASCADE`, destructive rename, mass overwrite или удаления blobs;
9. media originals не менять: optimization создаёт derivatives;
10. production migration только после counts/hash checks и утверждения владельца.

---

## 12. Порядок дальнейшей реализации

Не переходить автоматически:

1. `AUDIT_ONLY`.
2. `IMPLEMENT_T0`.
3. `CONTRACTS_ONLY`.
4. Утверждение Data Dictionary, Taxonomy, Migration Map.
5. Один vertical slice на реальных данных из нескольких районов.
6. Только затем отдельные T1–T10.

Wave 1:

- T1 homepage fork;
- T2 Save pilot + sticky shortlist;
- T3 verified price/freshness fields.

Wave 2:

- T4 QuickDecision: `Go if` только из verified `best_for`; booking difficulty только из собственного verified field;
- T5 Start Your Shortlist на пяти SEO pages с CTR gate;
- T6 `/for-venues` под текущую money model;
- T7 dev-route hygiene;
- T8 Today shortcut screen;
- T9 Add to trip;
- T10 Plan navigation и itineraries.

Каждая задача получает отдельный `RUN_MODE=IMPLEMENT_TASK` и один `TASK_ID`.

---

## 13. Абсолютные запреты

Без отдельного утверждения нельзя:

- переписывать сайт целиком или делать общий redesign;
- удалять/переименовывать routes, slugs, data или assets;
- создавать redirects;
- менять canonical/noindex массово;
- менять schema до утверждения контрактов;
- создавать Canggu-specific core logic;
- реализовывать `/privileges` или paid visibility;
- давать партнёру право менять editorial verdict/best_for/warnings;
- выводить booking policy из наличия booking URL;
- выводить `best_for` из `not_for` или наоборот;
- показывать `Open now` без verified schedule/status;
- показывать price/availability/capacity/policy без допустимого evidence;
- показывать CTA без валидной цели;
- считать Maps/Instagram/booking click подтверждённым outcome;
- использовать `447/517` как DB facts;
- добавлять массовые thin SEO pages;
- отключать RLS или ослаблять privacy/security;
- устанавливать packages без доказанной необходимости;
- делать broad formatting/refactor;
- менять secrets;
- push/deploy/publish или делать иные external writes;
- выполнять destructive git actions, amend/rebase или перезаписывать чужие изменения;
- использовать `git add -A`.

Stage только точные созданные/изменённые тобой файлы.

---

## 14. Локальные commits

Если repository policy допускает commits и worktree безопасен:

1. `docs(architecture): add Other Bali v3.1 corrections`
2. `docs(audit): document current state and T0 diagnosis`

Перед commit:

- покажи staged diff;
- убедись, что staged только твои файлы;
- не включай unrelated user changes;
- не commit, если gate не выполнен;
- не push.

---

## 15. Финальный отчёт Codex

Начни с одного статуса: `PASS / PARTIAL / BLOCKED`.

Затем укажи:

1. Что доказано — `[ИЗВЛЕЧЕНО]`.
2. Что является выводом — `[ИНТЕРПРЕТИРОВАНО]`.
3. Что не удалось проверить — `needs_verification`.
4. Root cause T0 или почему он не доказан.
5. Созданные/изменённые файлы.
6. Выполненные проверки и результаты тестов.
7. Commit hashes.
8. Незакоммиченные пользовательские изменения.
9. Открытые owner decisions.
10. Риски и rollback.
11. Ровно один следующий разрешённый шаг.

В текущем `RUN_MODE=AUDIT_ONLY` остановись после audit deliverables. Не исправляй T0 и не переходи к Contracts/Wave 1.

