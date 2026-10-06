# Волна «человеческий текст»: resort F&B (17 страниц)

Дата: 2026-10-05. Ветка `claude/pensive-ritchie-f9kkhp`. Ничего не закоммичено, не задеплоено, в базу не писалось.

Правились только тексты внутри существующих элементов в `data/resort-fnb/source/*.html` (17 файлов). `pages.generated.json` пересобран только скриптом `scripts/resort-fnb/extract.py`. Три отложенные sunset-страницы (`canggu-sunset-beach-clubs`, `seminyak-sunset-beach-clubs`, `uluwatu-sunset-clubs`) не публикуются и не тронуты.

## Итог

- Изменено **126 единиц** на всех 17 страницах. `check-rewrite.mjs --resort` даёт exit 0: **0 FAIL**, все 126 PASS. Построчный отчёт: `resort.csv`.
- **WARN 162 → 23.** Все 23 оставшиеся отметки стоят в замороженных полях: `checkedNote` ×15, card `h3` ×6, `title`/`metaTitle` ×2 («Really»).
- **FAIL 8 → 1.** Все 7 hype-FAIL сняты, числа сохранены. Остался «A Day in Paradise»: это название продукта Hilton, ячейка не тронута, и в allowlist она уже есть. Ratchet с allowlist даёт 7 → 0.
- Проверки: ни одно число, цена, время, название, тег, атрибут, ссылка или порядок элементов не изменились (сравнение тегов HTML и структуры JSON с HEAD). JSON-LD и `<style>` побайтно совпадают с HEAD. Тесты `scripts/copy/*` проходят 150/150, ratchet регрессий не находит. Baseline (`--write`) не переписывался: это шаг после одобрения.
- JSON-LD синхронизировать было нечего. В исходниках нет блоков FAQPage и нет копий description: слово FAQPage встречается только в HTML-комментариях, а FAQPage собирает `ResortFnbHub` из `faq`.

| Страница | единиц | WARN до → после |
|---|---|---|
| bali-free-beach-clubs | 13 | 21 → 3 |
| bali-hotel-brunches | 7 | 6 → 1 |
| bali-resort-day-passes | 6 | 9 → 1 |
| bali-sunset-clubs | 11 | 15 → 1 |
| canggu-beach-club-day-passes | 6 | 9 → 1 |
| jimbaran-hotel-brunches | 3 | 3 → 1 |
| jimbaran-resort-day-passes | 5 | 7 → 1 |
| jimbaran-sunset-seafood | 7 | 6 → 1 |
| nusa-dua-hotel-brunches | 11 | 16 → 3 |
| nusa-dua-resort-day-passes | 8 | 12 → 1 |
| sanur-hotel-brunches | 5 | 4 → 1 |
| sanur-resort-day-passes | 13 | 21 → 3 |
| seminyak-beach-club-day-passes | 7 | 7 → 1 |
| seminyak-hotel-brunches | 5 | 4 → 1 |
| ubud-hotel-brunches | 3 | 4 → 1 |
| ubud-jungle-pool-day-passes | 9 | 10 → 1 |
| uluwatu-resort-pool-day-passes | 7 | 8 → 1 |

Что делалось в основном: длинные тире заменены точкой, двоеточием, запятой или точкой с запятой; предложения длиннее 25 слов разбиты; схема «X is the value pick; Y is the boutique pick; Z is the luxury one» разобрана на разные по форме фразы, чтобы страницы не шли по одному шаблону. Оговорки («verify», «confirm», «reported», «may be paused», «not confirmed») сохранены по смыслу везде, где они были.

## Удалено намеренно (оценки и ярлыки, не факты)

- Hype: «iconic» ×8 (free beach clubs, resort day passes, seminyak ×2, ubud ×3, uluwatu); «icon» как похвала ×6 («the icon is» на ubud и uluwatu, «Design icon», «The Seminyak icon», «Boho nautical icon» → «look», «cliff sunset icon» → «the sunset bar on the cliff»); «Signature» (ubud); «marquee» ×2, «vast» (nusa dua brunches); «grand» в «grand seafood spreads/brunches» ×2 (bali brunches). «The grand one» на ubud brunches оставлено.
- Популярность и отзывы: «the most photographed in Ubud»; «The best-known Sunday brunch on the island» (Mulia); «popular» ×2 (bali brunches); «most-searched / most searched» ×3 (nusa dua passes).
- Самооценка: «Honest guide», «The honest pattern», «quietly» (free beach clubs); «The complete … guide» ×2 в meta description (bali brunches, resort day passes); «brunch scene».
- «genuinely» в FAQ[0] free beach clubs: смысл держит «with no minimum».
- «One rule island-wide:» (resort day passes): правило в той же фразе касается только Sanur и части Nusa Dua.
- Адресат: «before promising it to a guest» → «before you count on it» (callout free beach clubs); «before promising a swim» → «if you want a swim» (nusa dua brunches). Это хвост текста для консьержа, а не для путешественника. Совет «уточните заранее» сохранён.
- Uluwatu: «(price not rendering)» → «(price not shown)», внутренняя формулировка.

**Три ячейки вне поля зрения гейта** (меньше 4 слов, `check-rewrite` их не видит; проверены вручную, слова взяты из той же строки таблицы):
- nusa-dua-hotel-brunches, Mulia, Best for: «The famous spread» → «Buffet + live grill»;
- ubud-jungle-pool-day-passes, Alila, Best for: «The iconic pool» → «The green pool»;
- nusa-dua-resort-day-passes, Club Med, Best for: «Families, most searched» → «Families, all-inclusive».

## Сомнительные факты: не правились, нужна проверка

1. **nusa-dua-hotel-brunches:** answer («bundles … pool, waterslide and beach access, so it doubles as a day pass»), FAQ[1] («explicitly includes pool…») и Best for («brunch + day pass») утверждают, что в Kempinski Brunchcation входит бассейн. Строка таблицы и карточка на той же странице говорят, что текущая официальная страница этого не подтверждает. Противоречие оставлено как есть.
2. **nusa-dua-hotel-brunches:** в answer Kayuputi стоит «from IDR 1,250,000». Это субботняя цена. В FAQ[3] и карточке воскресенье «from IDR 1,650,000».
3. **nusa-dua-hotel-brunches:** Mulia Soleil в таблице «889,000++ / 1,499,000++», в карточке «≈ 1,136,190». На bali-hotel-brunches St Regis и Mulia стоят «IDR 1.1–1.65M».
4. **nusa-dua-hotel-brunches:** Ritz-Carlton, «Sunday brunch referenced by guests». Существование подтверждено только упоминаниями гостей, то есть отзывами (риск по guardrail #2).
5. **bali-hotel-brunches:** у Nusa Dua в таблице «18», а в FAQ и ссылке «14 resort brunches». Старт в таблице «IDR 528,000», в FAQ диапазон начинается с «IDR 798,000». У Sanur в таблице «from IDR 490,000», на странице Sanur «from about IDR 550,000».
6. **sanur-hotel-brunches:** верх диапазона «1,250,000 per adult». Максимум в таблице 990k (Andaz free-flow), откуда 1,25M, не видно.
7. **canggu-beach-club-day-passes:** «COMO Uma Canggu, the only true luxury resort here». Утверждение «only» без источника.
8. **jimbaran-sunset-seafood / bali-sunset-clubs:** Rock Bar держит «sunset 16:00–17:00» для гостей отеля, остальных сажают с 19:30. При этом совет «book early / book far ahead» дан именно ради закатного напитка. Окно 16:00–17:00 к тому же раньше заката на Бали. Время нужно сверить.
9. **ubud-jungle-pool-day-passes:** Padma, «longest pool in Ubud» (превосходная степень без источника) и «a strong kids' setup» (впечатление).
10. **Byrd House:** на free beach clubs он «confirmed free», на sanur-resort-day-passes «Free (reported)». Статусы расходятся.
11. **nusa-dua-resort-day-passes:** у Kempinski Reef в FAQ «confirmed for 2026», а в ячейке цены метка «confirm terms».

## Не сделано / оставлено

- Замороженные поля не трогались: title, metaTitle, h1, card h3, вопросы FAQ, checkedNote, цены, метки [OFFICIAL]/verify, даты, названия.
- Meta description на 10 страницах (jimbaran ×2, nusa dua ×2, sanur brunches, seminyak ×2, ubud ×2, uluwatu) остались на общей рамке «X compared: …, and how to book. Names. Checked July 2026.». Каждая читается нормально, но вместе это шаблон. Кандидаты на следующий проход, если нужно.
- Первая фраза answer «… run from about IDR X to Y per adult» на районных страницах сохранена: это задуманный answer-first блок для цитирования.

## Проверка 2 (скептик)

Скептик подтвердил одну находку. Она исправлена.

- **bali-resort-day-passes, FAQ «Do you earn commission on these day passes?»** (source HTML, строка 58, и `pages.generated.json` faq[2]). Это заявление о комиссии и платном размещении, а такие фразы по правилу программы остаются байт в байт. В первом проходе тире заменили точкой, сделали «We» с заглавной и добавили «them». Смысл не изменился, но текст политики менять копирайтингом нельзя. Восстановлен исходник на 3e40897: «No. These district guides are coverage — we list passes so you can compare in one place, with no paid placement and no cut of the booking.» Тире оставлено: убирать его можно только с согласия владельца политики.
- Заодно проверены остальные фразы политики на resort-страницах. Плашка «Coverage, not commission.» (её первая фраза) и все «resident-curated, no paid placement.» в `.checked` совпадают с 3e40897. Во второй фразе плашки («Prices are checked … , so always confirm …») говорится о ценах, а не о политике, поэтому правка оставлена.
- После правки: `python3 scripts/resort-fnb/extract.py`, затем `node scripts/copy/check-rewrite.mjs --resort --ref 3e40897`. Код выхода 0: 125 changed, 0 FAIL, WARN 162 → 25.
