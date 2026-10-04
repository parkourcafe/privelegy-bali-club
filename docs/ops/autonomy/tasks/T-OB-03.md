# T-OB-03 — мобильный путь туриста Today / Explore / Plan / My Bali (O3)

```yaml
task_id: T-OB-03 (O3 в плане оркестратора)
repo: parkourcafe/privelegy-bali-club
base_sha: 2d3d3e7 (ветка claude/autonomy-ob-01 после T-OB-01; main @ beff274)
branch: claude/autonomy-ob-01
pr: #311 (draft)
дата: 2026-09-28
статус: DONE_CODE, TESTED_LOCAL (фикстурный режим, без прод-данных)
```

## Как поднималось

- `OTHER_BALI_ALLOW_FIXTURE_DATA=YES npx next dev` — штатный локальный режим
  из `.env.local.example`: без Supabase, на выдуманных демо-заведениях из
  `lib/seed.ts` и реестре Uluwatu (`lib/uluwatu/venues.ts`). Прод-БД, ключи и
  реальные данные не использовались.
- Браузер: Chromium из `/opt/pw-browsers`, `playwright-core` поставлен во
  временный каталог сессии (в репозиторий не добавлялся).
- Вьюпорт 360×780, `isMobile`, `hasTouch`. Баннер согласия закрывался кнопкой
  «Essential only», поэтому аналитика не отправлялась — так и задумано.
- Побочный эффект `next dev`: он дописывает блок в `AGENTS.md`. Правка
  откатывалась и в коммиты не попала.

## Что проверено (TESTED_LOCAL)

Маршруты: `/`, `/my-day` (Today), `/places` (Search/Explore), `/canggu`,
`/plan`, `/me` (Saved / My Bali), `/places/alchemy-uluwatu`, гайды
`/best-warungs-in-bali`, `/canggu/best-brunch`.

| Проверка | Результат |
| --- | --- |
| Горизонтальный скролл страницы (`scrollWidth > clientWidth`) | 0 px на всех страницах, до и после правок |
| Горизонтальные прокрутки внутри страницы | одна: лента моментов на `/plan` (видно 2 из 7) → исправлено |
| Нижняя навигация | 4 вкладки по 90×56 px; Search → `/places`, Saved → `/me`, Plan → `/plan` |
| Лист Explore | открывается, фокус уходит на «✕», Esc закрывает, переход по ссылке закрывает |
| Моменты на `/plan` | тап переключает `aria-pressed=true` |
| Карточка заведения | нижняя панель действий «Google Maps» 332×46 px, нижняя навигация скрыта |
| Хэнд-офф в Google Maps | `target=_blank rel=noreferrer`, открывается новая вкладка, исходная страница остаётся. Сама вкладка Google не загрузилась: сеть закрыта политикой |
| Ошибки JS на страницах | 0 |
| Сообщения CSP | только `eval` от dev-режима React, в production-сборке его нет |

Цели касания меньше 44 px (без встроенных ссылок в абзацах): было 46–90 на
страницу (641 на 10 страницах первого прохода), после правок 0–22 на 9 страницах повторного прохода.

## Найденные дефекты

### Исправлено (DONE_CODE, TESTED_LOCAL)

1. **Маршрут в списке ведёт на «Route not found».** `getRoutes()` считал
   остановки по определению маршрута, а `/route/<slug>` разрешает их по
   опубликованному каталогу. Разошедшийся маршрут попадал в `/plan`, sitemap,
   мобильную ленту и `generateStaticParams`, а открывался как «Route not found»
   (HTTP 200 + noindex). В фикстурном режиме так вели себя все карточки на `/plan`.
   Разрешение остановок вынесено без изменений в `lib/route-stops.ts`, список
   считает те же остановки, что и страница. Коммит `680aad2`.
   Тест: `lib/route-stops.test.ts` (3 теста). Старая логика первый тест не
   проходит: маршрут без опубликованных заведений давал 2 и 4 остановки.
   После правки в dev: `/plan` и `/sitemap.xml` не содержат мёртвых `/route/*`.
2. **Цели касания 40–42 px.** `.chip`, `.quiet-link`, `.criteria-chip`,
   `.criteria-clear`, `.lead-form .check-pill`, `.ob-compact-link`,
   кнопки `.decision-moments`/`.decision-view-toggle` и две кнопки баннера
   согласия подняты до 44 px (AGENTS.md §7). Коммит `0bc703e`.
3. **Горизонтальная лента моментов на `/plan`** прятала 5 из 7 обязательных
   вариантов. На ширине ≤ 640 px теперь сетка в две колонки, десктоп без
   изменений. Коммит `0bc703e`.
   Тест для 2 и 3: `scripts/mobile-touch-targets.test.mjs` (3 теста; на старом
   CSS 0/3, на новом 3/3).

### Не исправлено — описание (крупное или требует решения)

| # | Что | Где | Почему не правил |
| --- | --- | --- | --- |
| a | Ссылки футера 18 px в высоту (12 на странице) | `components/SiteFooter.tsx` | меняет раскладку футера на всех страницах; нужен дизайн-проход |
| b | Хлебные крошки 32 px | `app/globals.css` `.breadcrumbs a` | навигация, а не действие; поднять — решение по дизайну |
| c | Ссылка-логотип в шапке 177×23 px | `components/GlobalHeader.tsx` | то же |
| d | Кнопка «📍 Use my location» и ещё несколько кнопок на `min-h-10` (40 px) | `/my-day`, `/places` | точечные классы Tailwind; собрать списком в следующем проходе |
| e | Страница ненайденного маршрута отдаёт HTTP 200 с noindex, а не 404 | `app/route/[slug]/page.tsx:89-99` | после правки 1 на неё больше не ведут внутренние ссылки; смена кода ответа — отдельное решение |
| f | Сломанная картинка героя на `/` в локальном режиме | `/` | вероятно, это артефакт локальной среды: `prebuild`/`fetch-scenes` получает 403 от прокси. В проде не проверялось |

## Изменённые файлы

- `lib/route-stops.ts` — новый (перенос из `lib/data.ts` + `summarizeResolvableRoutes`)
- `lib/route-stops.test.ts` — новый
- `lib/data.ts` — `buildRoutes` использует общий модуль
- `scripts/wave3-product-boundary.test.mjs` — проверка слагов перенесена на `lib/route-stops.ts`
- `app/globals.css`, `components/ConsentBanner.tsx` — 44 px, сетка моментов
- `scripts/mobile-touch-targets.test.mjs` — новый
- `package.json` — два новых теста в `npm test`
- `ios-web/build-manifest.json` — `sourceHash` пересчитан `npm run mobile:build`
  (`package.json` входит в `sourceInputs`; без этого iOS-гард
  `scripts/ios-release-core.mjs:449` считал бы `ios-web` устаревшим)

## Команды и результаты (Node v22.22.2)

```txt
npm ci                 exit 0
npm run lint           exit 0 — 0 errors, 3 warnings (те же, что на 2d3d3e7)
npm run typecheck      exit 0
npm test               exit 0 — pretest 72/72; основной набор 604 tests: 603 pass, 0 fail, 1 skipped; seo-os validate "errors": []
npm run test:t0:unit   exit 0 — 12/12; 67/67
npm run build          exit 0 — /route/[slug] = ●, /sitemap.xml = ○ 5m
```

Первый прогон `npm test` упал на одном тесте
(`scripts/wave3-product-boundary.test.mjs` искал слаги fallback-маршрутов в
`lib/data.ts`). Проверку перенёс на новый файл, после этого набор зелёный.

## Что не проверено

- Прод и превью: сайт закрыт сетевой политикой. **BLOCKED_EXTERNAL**.
- Реальные данные: фикстурный режим содержит выдуманные демо-заведения.
- Разошедшиеся маршруты в проде — неизвестно; SQL для владельца ниже.
- Настоящие телефоны (iOS Safari, Android Chrome) и вкладка Google Maps.
- CI: воркфлоу запускается только вручную (`workflow_dispatch`), см. T-OB-01.

## SQL-проверка для владельца (только чтение)

```sql
-- Маршруты, у которых явные остановки не разрешаются в опубликованные
-- заведения того же района. Приблизительно: реестр Uluwatu и fallback по
-- категориям живут в коде. resolvable = 0 при defined > 0 → до правки
-- такой маршрут был в /plan и sitemap и открывался как «Route not found».
select r.slug, r.district,
       count(s.venue_slug) as defined_stops,
       count(v.slug) filter (
         where v.status = 'active' and v.publication_status = 'published'
           and v.district = r.district
           and coalesce(btrim(v.why_its_here), '') <> ''
           and coalesce(btrim(v.best_for), '') <> ''
       ) as resolvable_stops
from public.routes r
left join public.route_stops s on s.route_slug = r.slug
left join public.venues v on v.slug = s.venue_slug
group by r.slug, r.district
order by resolvable_stops, r.slug;
```

## Чек-лист владельцу на 5 минут (телефон, прод после деплоя)

1. Открыть `https://www.otherbali.com/plan` → моменты стоят сеткой 2×4, без
   прокрутки вбок.
2. Тапнуть любую карточку маршрута → открывается маршрут с остановками, а не
   «Route not found».
3. На главной принять или отклонить баннер согласия: кнопки удобно нажимать
   большим пальцем.
4. Нижняя навигация: Explore открывает лист, Search → «Explore Bali»,
   Saved → «My list», Plan → «Plan your Bali trip».
5. Открыть любую карточку заведения → «Google Maps» внизу открывает Google
   Maps (приложение или новую вкладку), назад — снова карточка.
6. Прокрутить `/`, `/places`, `/plan` — страница не ездит вбок.

## next_step

- Дизайн-проход по пунктам a–d (футер, крошки, логотип, точечные `min-h-10`).
- Решение по коду ответа для ненайденного маршрута (пункт e).
