# Rewrite-now: resort offers (C12)

Дата: 2026-10-06. Ветка `claude/pensive-ritchie-f9kkhp`. Без коммита.

## Что изменено

Файл: `data/resort-import/offers.json`. Изменены только 15 полей `editorialNote` у
офферов из `RESORT_PUBLISH_WHITELIST` (`lib/domain/resort-publication.ts`) —
это ровно 15 публичных страниц /day-passes/* и /brunches/*. `git diff --numstat`:
15 строк удалено, 15 добавлено, все 15 — строки `editorialNote`.
Остальные поля (`whatsIncluded`, `scheduleText`, `priceText`, цены, время,
условия, `bookingChannel`, статусы) байт-в-байт как в HEAD — это проверяет
скрипт-гейт (frozenFieldDiffs=0).

5 непубличных офферов с русскими операторскими заметками (Sofitel daypass,
Laguna Arwana, Mulia Soleil, Westin Dine and Dive, Nusa Dua Beach Hotel) не
тронуты: это внутренние причины удержания, на сайт они не выходят.

## Источник правды

`scripts/import-resort-csv.ts` пишет `offers.json` из CSV, поле
`editorialNote` берётся из колонки `honest_note`. Ближайший CSV в репозитории —
`data/resort-fnb/verified/Bali_Nusa_Dua_FnB_DayUse_20260719.csv`, но там
`honest_note` на русском с пометкой «[ИНТЕРПРЕТАЦИЯ]». Английские заметки
появились ручным переводом прямо в `offers.json` при первом операторском
просмотре 2026-07-20 (так написано в шапке `resort-publication.ts`). Значит,
публичный английский текст живёт только в `offers.json`, и правка сделана там.

**Внимание:** повторный импорт из CSV (`node --import tsx
scripts/import-resort-csv.ts <csv>`) перезапишет `offers.json` целиком и вернёт
русские `honest_note` вместо английских заметок — и старых, и новых. Это было
верно и до этой правки.

## Где поле отображается

- `components/resort/OfferDetail.tsx`: обычный абзац `<p>` под таблицей фактов.
- В JSON-LD (`Offer`) и в meta description поле не попадает (description
  страницы берётся из `whatsIncluded`).
- `lib/domain/resort-repo.ts` проверяет только наличие поля
  (`hasDecisionContent`); пустых заметок нет, гейт публикации не меняется.
- Тесты и скрипты эти строки не закрепляют (grep по `scripts/`, `*.test.*` —
  только `COVERAGE-AUDIT.md`). `node --import tsx --test
  lib/domain/resort-repo.test.ts lib/domain/resort-import.test.ts`: 13/13 pass.
- `npx eslint data/resort-import/offers.json`: 0 ошибок (JSON вне конфига
  eslint, файл проигнорирован).

## Гейт

Канонический гейт работает и для этого файла:

```
node scripts/copy/check-rewrite.mjs data/resort-import/offers.json --ref HEAD
data/resort-import/offers.json: 15 changed · 0 FAIL · WARN 4 → 2
  dropped [4]: LEX:premium
  dropped [12]: PROPER:Pricier
  dropped [15]: LEX:most
  dropped [15]: LEX:expensive
```

Код выхода 0, REJECT нет. WARN считается по всем прозаическим полям файла, не
только по `editorialNote`. Оставшиеся 2 WARN сидят в замороженных полях
`whatsIncluded`, которые эта правка не трогала: `[4]` Samabe (A5) и `[10]`
Laguna Arwana (A7). В заметках WARN после правки нет.

Дополнительная проверка (не замена гейту) — частный скрипт
`/tmp/claude-0/-home-user/f67fb683-5cbf-5c12-bdff-460bdda01ae2/scratchpad/wf-now/resort-offers/gate.mjs`.
Он проверяет, что поля кроме `editorialNote` совпадают с HEAD байт в байт, и
считает lint только по заметкам. Без аргументов он падает, нужны два пути:

```
git show HEAD:data/resort-import/offers.json > <scratch>/head.json
node <scratch>/gate.mjs <scratch>/head.json data/resort-import/offers.json
```

Итог: `changed=15 REJECT=0 FAIL=0 WARN before=2 after=0 frozenFieldDiffs=0`
(WARN здесь только по `editorialNote`, поэтому числа отличаются от канонических).

WARN до: A10 «solid» (Holiday Inn), A3 «genuinely» (Dip and Dine). После: 0.
ASCII-тире « -- » было в 6 заметках, его не видит правило A4; теперь их нет.

Замечания fact-diff (не REJECT):
- dropped «premium» (Samabe): оценку несёт следующая фраза о цене выше
  стандартного day pass.
- dropped «most expensive» (Astor): рейтинговое утверждение без доказательств,
  снято по заданию.
- dropped «Pricier» (Day Dream): заменено на «costs more», смысл тот же.
- NEW_TERM «clear» (Novotel, Bai Yun): форма слова «clearest / clearest-priced»
  без превосходной степени.
- POLARITY «2026» (Pala): «don't assume … without checking» → «check whether it
  still applies in 2026», смысл не изменился.

## До → после

| Оффер | До | После |
|---|---|---|
| holiday-inn…fun-day-pass | A solid official family day pass -- worth confirming exact hours before you go. | An official day pass for families. Confirm the exact hours before you go. |
| hotel-nikko…nikko-day-pass | An up-to-date official page; the pass is non-refundable and non-transferable, and ID is required. | The official page is up to date. The pass is non-refundable and non-transferable, and ID is required. |
| novotel-bali-benoa--day-pass | The clearest official day-pass pricing in Tanjung Benoa, with strong terms for children. | This Tanjung Benoa day pass has clear official pricing, including the terms for children. |
| samabe…a-day-at-beach-cabanas | A premium cabana day-use experience, not a simple pool pass -- priced well above a standard day pass. | This is cabana day use, not a simple pool pass. It's priced well above a standard day pass. |
| sofitel…cucina-sunday-brunch | A strong pick for a precise starting price plus confirmed pool access; the base rate is food-only. | The starting price is precise and pool access is confirmed. The base rate is food-only. |
| apurva…brunchcation-at-pala | Pricing is transparent; don't assume the previously advertised pool access still applies for 2026 without checking. | The pricing is transparent. Pool access was advertised before, so check whether it still applies in 2026. |
| apurva…dim-sum-brunch-at-bai-yun | One of the clearest-priced weekend brunches in the area, and it isn't Sunday-only. | The prices are clear, and this weekend brunch isn't Sunday-only. |
| apurva…izakaya-journey | A good alternative to a buffet -- closer to an unlimited-order lunch than a classic brunch. | This is an alternative to a buffet, closer to an unlimited-order lunch than a classic brunch. |
| royal-santrian…day-dream-experience | Pricier than a typical day pass, but an officially confirmed, well-rounded package. | It costs more than a typical day pass. The package is officially confirmed. |
| royal-santrian…dip-and-dine | A genuinely transparent offer -- most of the price comes back as F&B credit; opening hours aren't published. | The offer is transparent: most of the price comes back as F&B credit. Opening hours aren't published. |
| sakala…beach-club-day-pass | The booking engine shows a from-price; confirm exact hours and full inclusions for your date. | The booking engine shows a from-price. Confirm the exact hours and full inclusions for your date. |
| st-regis…astor-brunch-at-kayuputi | One of the most expensive regular brunches in the area; format and price are well confirmed. | This is a regular brunch, and both its format and price are confirmed. |
| st-regis…boneka-sunday-brunch | More family-oriented and cheaper than the Astor Brunch; confirm hours when booking. | It's more family-oriented than the Astor Brunch and cheaper. Confirm the hours when booking. |
| st-regis…brunch-at-kayuputi (Sat) | A premium Saturday brunch -- choose the beverage package carefully. | This is a premium Saturday brunch, so choose the beverage package carefully. |
| westin…prego-monthly-brunch | Not a weekly brunch -- check the month's calendar before booking. | It isn't a weekly brunch, so check the month's calendar before booking. |

## Оставлено дословно и почему

- `whatsIncluded`, `scheduleText`, `priceText`, `bookingChannel`, все цены,
  время и условия: по заданию это `keep_frozen`.
- «non-refundable and non-transferable, and ID is required» (Nikko): условия
  оффера, дословно.
- Сравнение «cheaper than the Astor Brunch» (Boneka) оставлено: оно следует из
  опубликованных цен (950 000 против 1 650 000 за еду). «Priced well above a
  standard day pass» (Samabe) оставлено по той же причине (6 000 000 за пару).
- Подвал `OfferDetail.tsx` («Resident-curated · no paid ranking…») — не мой
  файл и формулировка о ранжировании, не трогал.

## Сомнительные факты (замечены, не исправлены)

1. Boneka: `scheduleText` = «Sun [hours not fully exposed on offer page]» —
   служебная пометка выводится публично в строке «When».
2. Prego: `whatsIncluded` = «…selected non-alcoholic beverage inclusion should
   be reconfirmed» — операторская формулировка на публичной странице; при этом
   `priceStatus` = verified.
3. Pala: `whatsIncluded` = «Sunday brunch; current official page does not
   explicitly confirm pool access» — тоже язык оператора в поле «Includes».
4. Novotel `priceText` пишет «nett», Nikko и St. Regis — «net»; Royal Santrian
   Day Dream — «nett». Разнобой написания.
5. `openToNonGuests` для всех day_pass/brunch захардкожен в импортёре как true
   (уже отмечено в `resort-publication.ts`); для Samabe «Daily/by request» и
   Day Dream «by request» доступ без проживания стоит подтвердить.
6. Все цены проверены 2026-07-19; на дату правки им больше 2,5 месяца —
   свежесть цены для JSON-LD считает `isPriceFresh`, проверять не стал.

## Проверка 2 (скептик)

Замечание скептика: в разделе «Гейт» было написано, что режима `check-rewrite`
для `offers.json` нет, и приведены только числа частного скрипта (WARN 2 → 0).
Это неверно: канонический гейт файл обрабатывает и показывает WARN 4 → 2.
Частный скрипт к тому же без аргументов падает с `ERR_INVALID_ARG_TYPE`, так что
по тексту лога его числа было не воспроизвести.

Исправлено: раздел «Гейт» переписан. Теперь в нём вывод канонического гейта,
место двух оставшихся WARN (замороженные `whatsIncluded` у Samabe A5 и Laguna
Arwana A7) и командная строка частного скрипта как дополнительной проверки
замороженных полей. `offers.json` в этом проходе не менялся, менялся только лог.

Перепроверено 2026-10-06:
- `node scripts/copy/check-rewrite.mjs data/resort-import/offers.json --ref HEAD`:
  exit 0, `15 changed · 0 FAIL · WARN 4 → 2`; dropped premium / Pricier / most /
  expensive (разобраны выше в «Замечания fact-diff»).
- `node scripts/copy/check-rewrite.mjs --resort --ref HEAD`: exit 0,
  `pages.generated.json: 0 changed · 0 FAIL · WARN 25 → 25` (файл не мой, не
  тронут).
- Частный скрипт с HEAD-копией: `changed=15 REJECT=0 FAIL=0 WARN before=2
  after=0 frozenFieldDiffs=0`, exit 0.
- `node --import tsx --test lib/domain/resort-repo.test.ts
  lib/domain/resort-import.test.ts`: 13/13 pass.
- `npx eslint data/resort-import/offers.json`: 0 ошибок (1 предупреждение
  «File ignored» — JSON вне конфига eslint).

Новых сомнительных фактов не замечено. Список выше остаётся в силе.
