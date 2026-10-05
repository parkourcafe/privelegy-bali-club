# Волна «человеческий текст»: страницы районов (`app/<район>/**/page.tsx`)

Дата: 2026-10-05. Ветка `claude/pensive-ritchie-f9kkhp`. Ничего не закоммичено, не задеплоено, в базу не писалось.

Зона: 59 файлов `page.tsx` в canggu, uluwatu, ubud, sanur, seminyak, nusa-dua, jimbaran, nusa-penida, amed, sidemen, munduk, lovina. Собственная проза есть в 21 файле. В остальных 38 только шаблон заголовка `{guide.h1} · Other Bali`: это frozen title, а текст страниц живёт в `lib/` и `components/`, вне моей зоны.

## Итог

- Изменено **155 строк**. Из них **145 проверены гейтом**: `check-rewrite.mjs` по всем 59 файлам даёт exit 0, все 145 PASS. Построчный отчёт: `district-pages.csv`.
- Ещё **10 строк гейт не видит**: 9 `note:` в `ubud/itinerary` и `uluwatu/48-hours` (экстрактор пропускает ключ `note`) и подпись из 3 токенов в `uluwatu/best-brunch`. Их я прогнал тем же `factDiff` и `lintText` отдельным скриптом: 0 REJECT, 0 FAIL.
- **WARN 238 → 47** по гейту, в note-строках **10 → 0**. **FAIL 4 → 0**: «famous for» ×3, «iconic» ×1. Что осталось в 47: title, h1–h3 и заголовки остановок (frozen), одна строка, закреплённая тестом, политика (оставлена дословно) и одна ячейка таблицы.
- Проверки: `npx eslint` по 59 файлам — 0; `npm run typecheck` — 0; пиннинг-тесты (sanur, ubud, uluwatu, canggu ×2) — 28/28; `scripts/copy/ratchet.mjs` — регрессий нет.
- Masthead `copy=` и meta description в `nusa-dua/page.tsx` (коммит 430e751) не тронуты.

| Файл | строк | WARN до → после | что осталось |
|---|---|---|---|
| canggu/page | 11 | 14 → 1 | title |
| jimbaran/page | 10 | 16 → 2 | title, h2 |
| jimbaran/things-to-do | 3 | 5 → 1 | title |
| nusa-dua/page | 10 | 15 → 3 | title, h2, дисклеймер иллюстраций |
| nusa-dua/hotel-restaurants | 2 | 6 → 0 | — |
| nusa-dua/things-to-do | 3 | 9 → 1 | title |
| nusa-penida/page | 14 | 27 → 3 | title, h2, дисклеймер иллюстраций |
| sanur/page | 1 | 1 → 0 | — |
| sanur/best-hotels | 4 | 6 → 2 | title, meta-line о тарифах |
| sanur/things-to-do | 4 | 7 → 1 | title |
| sanur/where-to-stay | 3 | 4 → 3 | закреплённый тестом standfirst, h2-вопрос, title-вопрос |
| seminyak/page | 7 | 9 → 1 | title |
| ubud/page | 1 | 3 → 2 | headline-вопрос, фраза о политике |
| ubud/itinerary | 6 + 5 note | 14 → 3; note 5 → 0 | title, заголовок остановки, headline |
| ubud/things-to-do | 7 | 12 → 1 | title |
| uluwatu/page | 4 | 7 → 1 | headline-вопрос |
| uluwatu/48-hours | 12 + 4 note | 25 → 13; note 5 → 0 | 13 заголовков (остановки, h2, title) |
| uluwatu/beach-clubs-sunset | 11 | 12 → 1 | ячейка таблицы |
| uluwatu/best-brunch | 10 + 1 подпись | 13 → 2 | title, h2 |
| uluwatu/best-restaurants | 11 | 16 → 3 | title, 2 строки политики |
| uluwatu/date-night-restaurants | 11 | 17 → 3 | title, h2, FAQ о дресс-коде (политика) |

Что делалось в основном. Длинные тире заменены точкой, двоеточием или запятой. Фразы длиннее 25 слов разбиты. Двойные «X, Y and Z» разобраны. Риторические вопросы в теле текста («Gentle swim?», «Wednesday or Sunday?», вопрос в кавычках на sanur/best-hotels) убраны. Убраны «Here's what», «whether you», «not just…» и стаккато «Food-first: KALA. Mood-first: …». В шести meta description длина ужата с 176–232 до ~150–160 знаков.

## Удалено намеренно (оценки и ярлыки, не факты)

- Популярность и отзывы: «famous for» ×3 (jimbaran ×2, nusa-penida); «famous» ×3 (the famous grilled-seafood dinner, several famous spots, a couple of famous rooms); «the icons» (nusa-penida).
- Hype: «iconic» (uluwatu/beach-clubs-sunset).
- Суперлативы без опоры: «some of Bali's most serious resort spas» (jimbaran: meta и masthead); «the district's serious Indonesian table» (uluwatu/best-restaurants); «the enclave at its best» (nusa-dua/things-to-do); «Sanur at its low-stress best».
- Soft words и интенсификаторы: serious ×6, signature ×3, proper ×5, genuinely ×5, really, actually ×3.
- Самопохвала: «resident-curated» в meta ×4 (canggu, jimbaran, nusa-penida, seminyak — как в одобренной nusa-dua), «honest booking notes», «compared honestly» / «the honest comparison» / «the honest date-night taxonomy» ×6, «The honest hierarchy:», «the honest answer is that…».
- Афоризм-концовка «The plan bends, it doesn't break.» (48-hours).
- Из meta убраны пункты-перечисления: «who the island suits» (nusa-penida), «The best … and resort … signature venues» (nusa-dua/hotel-restaurants), «hidden» (jimbaran/things-to-do). Названия мест остались.

## Сомнительные факты (не правил, только отмечаю)

- jimbaran/page: в CTA «ten minutes from the airport», а в practical note «Roughly 15–30 minutes from Ngurah Rai». Это противоречие внутри одной страницы. Там же «family-safe» о воде.
- uluwatu/best-brunch: число мест расходится. Meta: «Nine verified … spots», в `ALL_BRUNCH` 9 слагов; standfirst: «seven spots», meta-line: «7 places».
- uluwatu/48-hours, beach-clubs-sunset, best-brunch, best-restaurants, date-night: blurb «Micro-areas, quick picks and practical notes» и CTA «The pillar guide breaks Uluwatu into micro-areas with quick picks» описывают старый столп Uluwatu. Нынешний устроен иначе, тест запрещает на нём `VenuePicks`. Слово «pillar» — внутренний жаргон. Счётчики «twelve rooms», «Seven golden-hour venues», «Seven breakfast answers, from 6 a.m.» не сверены.
- Формулировки, которые тесты запрещают на страницах-столпах как неподтверждённые, но которые живут на дочерних страницах:
  - ubud/itinerary: «Nightly traditional performances», «Drive up early (~30 min)», «A gentle hour»;
  - ubud/things-to-do: «about an hour from the coast»;
  - sanur/things-to-do: «the 5 km promenade»;
  - nusa-dua/things-to-do: «5 km beach promenade».
- nusa-penida: «Bali's most-photographed view», «year-round manta rays», «No Grab, Gojek or taxis», «ATMs … frequently run empty», «steep enough to overwhelm scooter brakes», «Angel's Billabong is safe to enter only at low tide».
- nusa-dua/page: «among the safest swimming beaches in south Bali».
- Суперлативы без источника в файле: seminyak «the island's densest spa-and-salon scene», «Bali's spa capital», «the original dining strip»; ubud «the wellness capital», «culture-and-nature heart».
- Часы и годы без источника в файле: «Open from around 6 a.m. (closed Mondays)», «since 2016» (48-hours), «current listings show 6 a.m., Mondays off» (best-brunch).
- canggu/page: inline-blurbs в RelatedGuides («the island's best sunsets», «Use the active-deep pilot…») перекрываются `CANGGU_GUIDE_MEDIA` и не рендерятся. Не трогал.

## Пропущено и почему

- Политика и деньги (дословно): «researched, not sponsored · no paid ranking», «not by anyone's ad budget», FAQ о ценовых полосах $$, «We don't publish prices we can't keep current», «We publish dress codes only if a venue states one», «Other Bali does not currently promise…», «curated from places we actually rate / verified research — not sponsored».
- Дисклеймеры «These area-mood scenes are illustrative…» (A5): это правило о картинках, оставлены дословно.
- ubud/page: язык верификации («verified destination identity», «Official visitor information…») — позиция редакции о проверенных утверждениях. Правил только meta.
- Ячейка таблицы «No — 18+ policy»: тире служит разделителем во всех ячейках, правка одной сломала бы единообразие.
- Frozen: title, h1–h3, заголовки остановок (`DAY*.title`), kicker, chips, вопросы FAQ, alt, закреплённые тестами строки.
- ubud/things-to-do meta (~180 знаков) оставлен: признаков машинного текста в нём нет.

## Находка про инструмент

`extract-code-prose.mjs` держит `note` в `SKIP_KEYS`, поэтому публичные строки `note:` (остановки маршрутов в `ubud/itinerary` и `uluwatu/48-hours`) не попадают ни в гейт, ни в ratchet. Предлагаю отдельной правкой сузить пропуск (это не мой файл).
