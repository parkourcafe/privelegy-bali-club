# routes · wave-db · 2026-10-06 — подзаголовки маршрутов и заметки у остановок (B11, черновик)

Выход: `routes.csv`, 15 строк:
- `routes.subtitle` — 8;
- `route_stops.note` — 7.

Это черновик. В базу ничего не записано, колонка `decision` пустая, коммита нет. Доступа к базе не было, поэтому `before` взят из миграций — из последней, которая задаёт значение. Обновлений `routes`/`route_stops` после вставки в миграциях нет, так что последняя — она же единственная:

| Строки | Миграция |
|---|---|
| first-day, cafe-work, sunset-run (subtitle) | `0007_routes.sql` |
| ubud-culture-day (subtitle + 3 заметки) | `0048_ubud_culture_day_route.sql` |
| bangli-temple-village-day, east-bali-heritage-day (subtitle + 4 заметки) | `0049_bangli_karangasem_excursion_routes.sql` |
| canggu-food-route, canggu-rainy-day (subtitle) | `0059_wave3_canggu_routes.sql` |

`before` побайтово совпадает с текстом миграции: скрипт сверки ищет строку в файле. Перед любой записью каждую строку нужно сверить с живой — это сказано в колонке `source`.

**Ключ.** У `route_stops` id — uuid, миграции его не знают. Ключ записан как `route_slug/venue_slug#rank`: по паре `(route_slug, venue_slug)` миграции 0048/0049 сами проверяют `where not exists`.

## Итог

- **Изменено:** 14 строк (`replace`), 1 оставлена (`keep`, east-bali-heritage-day).
- **Lint** (`lintText`, по каждой строке): FAIL 0 до и 0 после; WARN 0 → 0.
- **fact-diff** (style, по строке; в `names` разрешено только название маршрута или остановки): 0 REJECT.
  - Выпало: `Bali's` в bangli-подзаголовке — вместе с «tidiest».
  - NEW_TERM: `somewhere` в canggu-rainy-day — пересказ «reset stops», не факт.
- **`check-rewrite.mjs routes.csv --ref HEAD`:** exit 0. Файл новый и не код, поэтому сравнивать ворота не с чем: «0 changed · not in HEAD». Настоящий гейт для этого списка — построчный прогон выше. Скрипт лежит в scratchpad, в репозиторий не добавлен.
- **eslint и тесты:** JS/TS-файлов не трогал, тестов не менял и не добавлял. Ни одна из строк не закреплена тестами: grep по `scripts/` и `*.test.*` пустой.

## Что изменено

- **«--» в заметках (5 строк).** Двойной дефис из SQL печатается на странице как есть. Где-то он заменён точкой, где-то запятой, а в pura-kehen у фрагмента появился глагол.
- **Подзаголовки-лозунги.** «Land, settle, eat well», «Good wifi, good coffee», «Golden hour to nightcap», «Holy spring, waterfall, crispy duck» — четыре таких схемы подряд звучат как один генератор. Они переписаны во фразы. Подзаголовок одновременно служит meta description страницы `/route/*`.
- **Удалены оценки и рейтинги без источника:**
  - cafe-work — два «good» (о качестве wifi и кофе данных нет);
  - bangli-temple-village-day — «Bali's tidiest village», тот же случай, что «one of north Bali's most visited falls» в clean-a;
  - bebek-bengil — «the restaurant that popularised Balinese crispy duck». Это рамка популярности, семейство R2 в `patterns.mjs`; сам линтер слово «popularised» не ловит. Факт заметки остался: обед в Убуде, балийская хрустящая утка.
- **Жаргон:** «low-friction» (canggu-food-route) удалён, «reset stops» → «somewhere to reset», «local/casual» → «local or casual».
- **Факты между полями не переносились,** даже внутри одного маршрута. Из-за этого подзаголовок Bangli стал тоньше: «Bangli's state temple, then the village». Можно взять «bamboo-roofed, car-free» из заметки той же остановки, но это решение рецензента, а не автора правки.

## Что оставлено дословно и почему

- **Названия маршрутов** (`routes.title`) — `keep_frozen` по COVERAGE-AUDIT. Их не трогал.
- **east-bali-heritage-day** «Bali's holiest temple, then a Bali Aga weaving village» — одна фраза, порядок дня и конкретная община, переписывать нечего.
- **Политика, деньги, ранжирование.** Таких фраз в этом срезе нет. Строку на странице маршрута «An ordered sequence of stops…» я не трогал: это `app/route/[slug]/page.tsx`, не мой файл.

## Сомнительные факты (замечены, не исправлены)

- **tegenungan** — «no trek required». К водопаду Тегенунган спускаются по длинной лестнице. Утверждение о лёгкости стоит проверить.
- **besakih** — «Bali's largest temple complex», «managed route up to the gate». Вторая фраза похожа на служебную формулировку. **east-bali-heritage-day** — «Bali's holiest temple». Источников в записи нет. Это превосходные степени, но о статусе храма, а не о популярности, поэтому оставлены.
- **tirta-empul** — «before the tour buses». Время приезда автобусов нигде не указано.
- **pura-kehen** — «quieter … away from the south-Bali circuit». Сравнение без источника.
- **Остановки маршрутов 0007.** Аудит насчитал 7 живых `route_stops` — это ровно 0048 + 0049. Десять остановок из 0007 ссылаются на демо-заведения из `supabase/seed.sql` (amber-cafe, tide-surf, dusk-beach-club…), и в живой базе их, видимо, нет. Поэтому в список они не включены. Если выгрузка покажет обратное, там есть что разбирать: «best filter in Berawa», «dessert on the house» (обещание оффера), «walk-in friendly».
- **Канггу-маршруты 0059** вставлены без остановок. Их заметки берутся из `lib/route-stops.ts` (фолбэк) и уже покрыты.

## Перед применением

- **`scripts/copy/build-copy-sql.mjs` пишет только в `venues`:**
  - `COPY_FIELDS` — поля карточки;
  - `STATUS_GUARD` — по `status`/`publication_status`;
  - колонка `slug_or_path`.

  Для этого списка нужен режим routes:
  - `update routes set subtitle = … where slug = … and subtitle = <before>`;
  - `update route_stops set note = … where route_slug = … and venue_slug = … and note = <before>`;
  - проверка `row_count = 1`, откат и live-проверка `/route/<slug>`.

  У `routes` нет `publication_status`, поэтому охранное условие другое. До этого строки применять нельзя.
- **Тот же текст есть в коде.** Его надо синхронизировать отдельной задачей владельца этих файлов, иначе фолбэк при недоступной базе покажет старые формулировки:
  - `lib/seed.ts:157–225` — фолбэк маршрутов, там тире «—» вместо «--»;
  - `app/dev/route-preview/page.tsx` — dev-превью.

## Проверка 2 (скептик)

**Замечание (medium, re-templated).** Три подзаголовка из восьми — first-day, canggu-food-route, canggu-rainy-day — оказались в одной схеме: вступление, двоеточие, список из трёх пунктов. Раньше так был построен только canggu-food. First-day и rainy-day автор правки сам привёл к этой схеме — к тому же «reveal colon», который убирал из заметок к остановкам. На /plan все три стоят рядом как карточки Канггу. Кроме того, «Your first day:» на `/route/first-day` повторяет H1 «First day in Canggu», который стоит прямо над подзаголовком.

**Исправлено (2 строки в `routes.csv`):**
- first-day: «Your first day: land, settle in and eat well» → «Land, settle in and eat well». Вступление снято, три глагола остаются одной фразой с «and». Вариант «Settle in after the flight…» не взят: «after the flight» есть только в заметке остановки из 0007, а факты между полями не переносим.
- canggu-rainy-day: «For when the weather turns: covered cafés, somewhere to reset and an easy dinner.» → «Covered cafés, somewhere to reset and an easy dinner when the weather turns.» Порядок исходника возвращён. Из правки осталась только замена жаргона «reset stops» → «somewhere to reset».
- canggu-food-route не трогал. Двоеточие там было в исходнике, и теперь такой подзаголовок один.
- `reason` у обеих строк сокращён до подмножества старого текста. Объяснение выбора записано здесь, а не в CSV: `check-rewrite` разбирает CSV как код и прогоняет fact-diff по ячейкам `reason`. С новыми словами в `reason` («H1», «one», «First») он выдавал REJECT, а с запятой ячейка попадала в кавычки и сдвигала пары юнитов.

**Гейты (повторно):**
- построчный прогон (`lintText` + `factDiff`, скрипт в scratchpad `wf-now/routes-fix/build.mjs`): 15 строк, FAIL 0, REJECT 0, WARN 0 → 0. У rainy-day по-прежнему NEW_TERM `somewhere` — это пересказ «reset stops», а не факт;
- `node scripts/copy/check-rewrite.mjs data/data-ops/copy/wave-db/routes.csv --ref HEAD`: exit 0, «2 changed · 0 FAIL · WARN 3 → 3». Файл теперь лежит в HEAD (коммит 207e38f), поэтому сравнение идёт с ним. Dropped: `first` — слово «first day» ушло из подзаголовка, в названии маршрута и в H1 оно есть;
- eslint не применим: JS/TS не трогал. Тесты не менял, ни одна из этих строк тестами не закреплена (grep по `scripts/` и `*.test.*` пустой);
- в базу ничего не записано, коммита нет.

**Сомнительные факты:** новых нет, список выше не изменился.
