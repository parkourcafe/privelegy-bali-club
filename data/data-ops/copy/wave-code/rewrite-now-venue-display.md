# rewrite_now · venue-display (B1, B2, B3, B8)

Дата: 2026-10-06. Ветка `claude/pensive-ritchie-f9kkhp`, без коммита. База не тронута.

## Что изменено

- **B1, часы.** В `lib/opening-hours.ts` добавлен `humanOpeningHours()`. Он берёт
  ту же schema.org-строку и делает из неё текст для людей: «Daily 07:00–23:00»,
  а разные часы идут группами подряд идущих дней: «Mon–Fri 08:00–22:00 · Sat–Sun 09:00–23:00».
  Две смены в день остаются двумя («07:00–11:00, 18:00–22:00»). «23:59» показывается
  как есть. День, которого нет в строке, не называется закрытым и не склеивается
  через пропуск. Если хоть одна часть не разбирается, показывается исходная строка.
  Формат используется только в `<dd>` блока Hours (`app/places/[slug]/page.tsx`).
  `openingHours` и `openingHoursSpecification` в JSON-LD берутся из прежних
  значений и не изменились. Часы из реестра Uluwatu (`content.openingHours`)
  показываются как раньше.
- **B2, строка над названием.** Новый модуль `lib/venue-display.ts`,
  `venueKickerLine()`. Повтор района убирается без учёта регистра
  («Canggu · Canggu» → «Canggu», «Denpasar · denpasar» → «Denpasar»), «Unknown»
  выбрасывается, сырые slug получают подпись («ubud» → «Ubud», «karangasem» →
  «Karangasem»). Для slug, которых нет в карте, первая буква каждого слова
  становится заглавной, а дефисы заменяются пробелами («kuta» → «Kuta»).
  Текст, написанный человеком («Batu Bolong / Berawa»), идёт как есть.
  Подписи bangli, karangasem, tabanan, denpasar добавлены в отдельную карту
  только для показа. Карту `districtLabel` на странице я **не** менял: она
  попадает в meta title (`in ${district}`) и в `addressLocality` разметки,
  а метаданные и JSON-LD по заданию не трогаем.
- **B3, «Good to know».** `practicalTagsLine()`: rain-proof → «Rain-proof»,
  quiet-enough-to-talk → «Quiet enough to talk», big-groups → «Good for big groups»,
  parking → «Parking», walk-in-friendly → «Walk-in friendly», kid-friendly →
  «Kid-friendly», reservation-helpful → «Booking ahead helps», ac / air-con →
  «Air-con». Это 8 тегов из краула 2026-09-28 и миграции 0015. Для неизвестного
  тега дефисы заменяются пробелами, первая буква становится заглавной.
  Одинаковые подписи схлопываются. Функция используется в Practical и в
  practicalNote блока Quick decision.
- **B8, меню.** `StructuredMenu.tsx`: из видимого текста убрано « · version N».
  `MenuItem.tsx`: строка «No additional details are listed.» больше не выводится.
  У блюда без деталей нет подсказки «View item details» и пустого блока деталей,
  остаются название и цена. `data-menu-item-id` и `<details>` на месте.
- **Тесты.** `lib/opening-hours-display.test.ts` и `lib/venue-display.test.ts`
  добавлены в `npm test` (package.json, сразу после `lib/opening-hours.test.ts`).

## Проверки

- `node scripts/copy/check-rewrite.mjs <5 файлов> --ref HEAD` → exit 0, 0 FAIL,
  WARN не вырос (StructuredMenu 1 → 1). Две пометки STRUCTURE ожидаемы: в
  MenuItem удалена строка-заполнитель (было 3 единицы, стало 2), а
  `lib/venue-display.ts` новый.
- `npx eslint` по всем затронутым файлам: чисто. `npm run typecheck`: чисто.
- `node --import tsx --test`: новые тесты, `lib/opening-hours.test.ts`,
  performance/publication/wave1/structured-data/menu-action boundary проходят
  (29 + 56 pass). В `scripts/wave2-product-boundary.test.mjs` 2 падения уже есть
  на HEAD, и мои файлы тут ни при чём. Тесты ищут «Pilot free through 21 September 2026»
  в `app/for-venues` и `<StartYourShortlist` в `app/ubud`. Этого файла нет в `npm test`.
- Браузерной проверки не было.

## Что оставлено дословно и почему

- Подписи меню «Verified full menu», «Menu highlights», «Price not listed», строки об
  аллергенах и «Availability note … Confirm with the venue.» не менялись. Это
  контракт доверия к данным меню, в срез они не входят.
- Метаданные (`generateMetadata`, `districtLabel` для title) и весь JSON-LD остались
  как были.

## Сомнительные факты (замечены, не исправлены)

- **«23:59» может скрывать позднее закрытие.** `parseRange` обрезает и полночь,
  и закрытие после полуночи («8.00pm-4.00am») до 23:59. На странице тогда стоит
  «20:00–23:59», хотя заведение работает до 04:00. Это уже есть в разметке.
  Нужен отдельный разбор по источнику, менять формат молча нельзя.
- Meta title и `addressLocality` для районов bangli, karangasem, tabanan и denpasar
  дают «Bali», потому что в `districtLabel` страницы этих подписей нет. Добавить
  их туда значит изменить метаданные и разметку, на это нужно отдельное решение.
- `venues.area` содержит служебные и смешанные значения: «Unknown» (в аудите
  отмечено отдельно: NULL через базу), «Canggu; Berawa», «Uluwatu; Jimbaran»,
  «Jl. Danau Tamblingan» и «Jalan Danau Tamblingan» (улица вместо района),
  «Ubud Center» и «Ubud Centre». Код показывает их как есть. Это работа для data-ops.
- Строка реестра Uluwatu «Daily from 11:00 until late» показывается как есть.
  Формулировка «until late» осталась из источника.

## Проверка 2 (скептик)

**Находка (подтверждена, high):** в `MenuItem.tsx` у блюда без деталей подсказка
«View item details» исчезла, а обёртка `<details>/<summary>` осталась. Правило
`.structured-menu-item[open] h4 span:last-child { display: none; }`
(`app/globals.css:3126`) раньше скрывало только подсказку. Теперь последним
ребёнком `<h4>` становится название блюда, и после тапа оно пропадает: остаётся
одна цена. Тот же тап отправлял `menu_item_open` для пустого блюда.

**Исправление (только `components/menu/MenuItem.tsx`):** блюдо без деталей
выводится простым `<div className="structured-menu-item" data-menu-item-id=…>`
с `<div className="structured-menu-item-head">`. Внутри него название в `<h4>`
и цена. Атрибута `[open]` нет, поэтому CSS-правило не срабатывает. `<summary>`
тоже нет, поэтому `MenuAnalytics.tsx` (ищет `closest("summary")`) не шлёт
`menu_item_open`. Блюдо с деталями выводится как на HEAD: `<details>`, подсказка
«View item details» без условия, блок деталей. Отличие от HEAD одно: убрана
строка-заполнитель. `data-menu-item-id` сохранён в обеих ветках, он закреплён в
`scripts/performance-boundary.test.mjs`. `globals.css` не трогал, он вне среза.
Новых текстов нет. Подписи «View item details» и «Price not listed» оставлены
дословно.

**Проверки после исправления:**
- `node scripts/copy/check-rewrite.mjs` по 5 файлам среза `--ref HEAD` → exit 0,
  0 FAIL, WARN не вырос (StructuredMenu 1 → 1). STRUCTURE в MenuItem: было 3,
  стало 2, это ожидаемо (удалён заполнитель). `lib/venue-display.ts` новый.
- `npx eslint` по файлам среза и двум новым тестам: чисто. `tsc --noEmit`: по
  файлам среза ошибок нет.
- `node --import tsx --test`: opening-hours (старый и новый), venue-display,
  performance/publication/structured-data boundary, menu-action foundation/schema,
  lib/domain/menu. Итог 87 pass, 0 fail.
- Браузерной проверки не было. Вывод сделан по CSS и коду.

**Замечено, не исправлено:** `docs/audits/2026-09-28-web/tools/parse.mjs:303`
считает блюда меню как `details.structured-menu-item`. После этой правки блюда
без деталей в такой счёт не попадут. Это инструмент аудита, а не публичная
страница. При следующем краулинге счётчик нужно читать с учётом этого или
перевести на `[data-menu-item-id]`.
