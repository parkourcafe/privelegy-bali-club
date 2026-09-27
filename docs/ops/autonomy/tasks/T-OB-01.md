# T-OB-01 — GSC-исправления, закрытие handoff 2026-09-02, пилот QR/SEO

```yaml
task_id: T-OB-01
repo: parkourcafe/privelegy-bali-club
base_sha: beff274 (origin/main, merge #310)
branch: claude/autonomy-ob-01
дата: 2026-09-27
```

## Толкование меток

Разрешены только пять меток. Как они применены:

| Метка | Значение в этом отчёте |
| --- | --- |
| DONE_CODE | код или документ есть в репозитории (коммит/файл указан) |
| TESTED_LOCAL | подтверждено командой, запущенной в этой сессии (lint/typecheck/test/build или чтение кода/миграций) |
| BLOCKED_EXTERNAL | нужен доступ или действие вне репозитория (GSC, прод-БД, живой сайт, владелец) |
| BLOCKED_DECISION | нужно решение владельца |
| NOT_VERIFIED | не проверено: либо нужна проверка прода, либо пункт не начат — в строке сказано, что именно |

Состояние прода нигде не утверждается.

## Discovery

- Ветка создана от `origin/main` @ `beff274`, рабочее дерево чистое.
- Прочитаны: `AGENTS.md`, `CLAUDE.md`, `docs/HANDOFF_2026-09-02.md` (он же
  самый новый handoff), `docs/HANDOFF_2026-08-08.md`,
  `docs/MASTER_PLAN_304_TRIAGE.md`, `docs/MASTER_PLAN_304_RECONCILIATION_2026-08-06.md`,
  `docs/seo/SEARCH_BASELINE_AND_PRIORITY_PAGES_2026-07-18.md`,
  `docs/seo/SITEMAP_DRIFT_REVIEW_2026-08-25.md`, `package.json`, `app/sitemap.ts`,
  `next.config.ts` (redirects), код QR-атрибуции.
- PR #309 (`db19dc5`) и его ревью прочитаны через GitHub MCP; #310 (`c2f0aa3`)
  только отключает автозапуски и остаётся нетронутым.
- Документация Next.js 16 из `node_modules/next/dist/docs/` не читалась:
  изменений фреймворкового кода в задаче нет (только документы).

## Статус по частям

### Часть 1 — затронутые URL из GSC → правка sitemap/роутинга

**BLOCKED_EXTERNAL.** Списка затронутых URL в репозитории нет.

Где искал:

- `git grep` по `Search Console|GSC` во всём репозитории и по текстам причин
  GSC (`Not found (404)`, `Soft 404`, `Redirect error`, `Alternate page with
  proper canonical`, `Excluded by noindex`, `Crawled/Discovered – currently not
  indexed`) — совпадений с выгрузками нет;
- все `*.csv`/`*.xlsx` в репозитории — выгрузок GSC нет;
- issues репозитория (GitHub MCP, поиск по GSC/indexing/404) — 0 результатов;
- комментарии и ревью PR #309 — GSC упомянут только как follow-up.

Что есть и почему этого мало:

- `docs/seo/SEARCH_BASELINE_AND_PRIORITY_PAGES_2026-07-18.md:3-39` —
  сводка Performance за 6 дней июля, без Coverage и без списка URL;
- `OTHERBALI_T0_VERIFICATION_REPORT.md:167-203` — один URL
  (`/places/big-dragon-villas-ubud`), проверка прошла (PASS);
- `docs/seo/SITEMAP_DRIFT_REVIEW_2026-08-25.md` — 8 URL, выпавших из sitemap;
  это дрейф sitemap, а не данные GSC, и связь с проблемой в GSC не доказана.

По условию задачи без списка не гадаю: кода не менял, sitemap/редиректы не
трогал. Метаданные, canonical, robots и sitemap остались как на `beff274`.

Что нужно: выгрузка GSC → Indexing → Pages (по каждой причине — «Export»,
CSV со столбцами URL / Last crawled), положить в `docs/seo/gsc/` с датой.

### Часть 2 — закрытие `docs/HANDOFF_2026-09-02.md` после #309

**DONE_CODE** (документ). В handoff дописан раздел 10: каждый пункт сверен с
коммитом `db19dc5`, после которого в main вошёл только `c2f0aa3`.

| Пункт handoff | Статус |
| --- | --- |
| §1 кеширование (локаль на клиенте, `generateStaticParams` у `/places/[slug]`) | DONE_CODE, TESTED_LOCAL (сборка: гайды `○` 5m, `/places/[slug]` `●`) |
| §1 живой TTFB | NOT_VERIFIED (нужен прод) |
| §2 курируемые `best-*` | DONE_CODE, TESTED_LOCAL (`lib/seo/curated-list.test.ts` в `npm test`) |
| §3 `InStock` убран | DONE_CODE, TESTED_LOCAL (`scripts/structured-data-boundary.test.mjs`) |
| §4 дубль `BreadcrumbList` | DONE_CODE, TESTED_LOCAL (тот же тест) |
| §5 логотип | DONE_CODE, TESTED_LOCAL (`components/OtherBaliLogo.test.mjs` в `npm run test:t0:unit`) |
| §9.1 карточки на заглушках | BLOCKED_EXTERNAL (прод-БД) |
| §9.2 GSC Coverage | BLOCKED_EXTERNAL (доступ к GSC) |
| §9.3 живой TTFB | BLOCKED_EXTERNAL |
| §9.4 дубли сущностей, `Casa Tua → dandelion` | BLOCKED_EXTERNAL (прод-данные) |
| §9.5 meta description режется посреди слова | NOT_VERIFIED, не начато: `app/places/[slug]/page.tsx:185`, `app/route/[slug]/page.tsx:69` |
| §9.6 массовое отсутствие `lastChecked` | NOT_VERIFIED (прод-данные) |
| Ревью Codex #309: ISO-дата против гейта `check-page.mjs` | NOT_VERIFIED, не исправлено: `lib/seo/curated-list.ts:133`, `.agents/skills/otherbali-guide-page-standard/scripts/check-page.mjs:117` |
| Ревью Codex #309: обещание `Not for` у каждой карточки | NOT_VERIFIED, не исправлено: `app/best-restaurants-in-bali/page.tsx:158-159`, `lib/seo/curated-list.ts:21-23` |
| Ревью Codex #309: ссылка «все варунги» уже, чем подборка | NOT_VERIFIED, не исправлено: `app/best-warungs-in-bali/page.tsx:72-75`, `:235` |

Отдельный датированный handoff не создавался: раздел дописан в сам
`HANDOFF_2026-09-02.md`, чтобы закрытие жило рядом с открытыми пунктами.

### Часть 3 — пилот QR/SEO

**DONE_CODE** (документ `docs/ops/autonomy/OB_QR_SEO_PILOT.md`, на русском).

| Проверка | Статус |
| --- | --- |
| Механизм QR (`/admin` → постер → `/?s=` → `/api/source` → `source_scan`) существует | TESTED_LOCAL (чтение кода, тесты атрибуции в `npm test`) |
| QR-район — только Canggu (`qr_enabled`) | TESTED_LOCAL по миграциям; NOT_VERIFIED в проде |
| 20 выпущенных источников, `villa_canggu_01` | NOT_VERIFIED (есть только в прод-БД) |
| Конкретная площадка для QR | BLOCKED_DECISION (в репозитории не названа — не придумывалась) |
| Перк и подтверждение владельца | BLOCKED_EXTERNAL + BLOCKED_DECISION |
| 10 приоритетных URL + `/`: маршруты существуют, есть в реестре SEO OS, собираются | TESTED_LOCAL |
| Слаги `jari-menari-seminyak`, `pizza-fabbrica` есть в миграциях | TESTED_LOCAL |
| Индексируемость этих URL в проде | NOT_VERIFIED |
| Запрос индексации в GSC | BLOCKED_EXTERNAL (доступ к GSC) |
| Актуальность замороженного набора из 10 | BLOCKED_DECISION |

Ничего не опубликовано, не напечатано и не отправлено.

## Изменённые файлы

- `docs/HANDOFF_2026-09-02.md` — добавлен раздел 10 (закрытие после #309)
- `docs/ops/autonomy/OB_QR_SEO_PILOT.md` — новый
- `docs/ops/autonomy/tasks/T-OB-01.md` — новый (этот файл)

Код, миграции, sitemap, CI и `vercel.json` не менялись.

## Команды и результаты (на `beff274`, Node v22.22.2, npm 10.9.7)

```txt
npm ci               added 511 packages; npm audit: 7 vulnerabilities (1 moderate, 5 high, 1 critical) — не трогал
npm run lint         exit 0 — 0 errors, 3 warnings (AdminLoginForm.tsx:18, AdminSignOutButton.tsx:8, PhotoReviewPanel.tsx:13)
npm run typecheck    exit 0
npm test             exit 0 — pretest (mobile:build + test:wave1): 72 tests, 72 pass, 0 fail;
                     основной набор: 592 tests, 591 pass, 0 fail, 1 skipped;
                     seo-os validate: "errors": []
npm run test:t0:unit exit 0 — node --test: 12 tests, 12 pass; tsx-набор: 67 tests, 67 pass, 0 fail
npm run build        exit 0 — prebuild: fetch-scenes получил HTTP 403 на все сцены (прокси), сработал SVG-fallback;
                     /places/[slug] = ● (SSG/ISR), приоритетные гайды = ○ с revalidate 5m, /sitemap.xml = ○ 5m
```

После сборки и тестов `git status` чистый (артефакты не попали в дерево).

## Блокеры (точно, что нужно)

1. **GSC**: выгрузка Indexing → Pages по каждой причине исключения (CSV) или
   доступ к свойству `https://www.otherbali.com/` для исполнителя.
2. **Прод-БД Other Bali (read-only)**: для §9.1, §9.4, §9.6 handoff, списка
   `attribution_sources`, `districts.qr_enabled`, гейта индексации двух `/places/`.
3. **Решения владельца**: площадка QR в Canggu и её источник; перк для первой
   записи подтверждения; актуальность набора из 10 URL.
4. **Живой сайт**: замер TTFB после деплоя.

## next_step

1. Владелец выгружает GSC Pages → CSV в `docs/seo/gsc/<дата>/` — тогда
   T-OB-01 часть 1 выполняется по данным (маппинг URL → маршрут/sitemap,
   минимальная правка с тестом).
2. Без доступа к проду можно сделать отдельными PR: обрезку meta description
   по границе слова (§9.5) и три замечания ревью #309 — каждое с тестом.
