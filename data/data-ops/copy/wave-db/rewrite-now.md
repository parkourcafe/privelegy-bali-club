# wave-db · rewrite-now · 2026-10-06: шаблонное начало (A2) и manga-madu (A3)

**Вход и выход:**
- вход: `rewrite-now.input.json`, 14 карточек из `docs/audits/2026-09-28-web/places.csv`. Форма та же, что у `clean-a.input.json`, `why_its_here` = живой текст (`verdict`);
- выход: `rewrite-now.csv`, 16 строк. Формат `clean-a.csv`, CRLF, `before` побайтно равен живому тексту, `decision` пустая.

**Режим:** rung 2. Переписан только собственный текст записи, факты заново не проверялись, `last_verified_at` не трогать. В базу ничего не записано, коммита нет.

## Предварительная проверка

Ни один из 14 slug не встречается ни в одном `data/data-ops/copy/**/*.csv` или `*.input.json`. Пропущенных карточек нет.

## Итог

- **Изменено:** 14 карточек, 16 полей:
  - `why_its_here` — 13;
  - `best_for` — 2 (cafe-coach, manga-madu);
  - `not_for` — 1 (manga-madu).
- **Ворота:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/rewrite-now.csv` — 14/14 PASS, 0 batch problems, exit 0. Fact-diff REJECT нет.
- **WARN по картам:** сумма 8 → 5. Не выросла ни на одной карте. Оставшиеся 5 — списки из трёх (A5), которые есть в исходном тексте: составы меню, классы, «café, bar and coworking space».
- **Дубли `best_for`/`not_for`:** все 19 итоговых значений этих 14 карт (изменённые и оставленные) сверены с полем `after` во всех `wave-db/*.csv` и `wave-spa/*.csv` (1 157 строк) и с живыми значениями краула. Точных совпадений 0.
- **`check-rewrite.mjs`:** к CSV не применим (это ворота для прозы в коде; файла нет в HEAD, 0 единиц). Eslint и тесты не затронуты: кода нет.
- **Длина `why_its_here`:** от 17 до 44 слов. Короче 20 слов две карты — de-maison (17) и dewas-landing-cafe (19). Других фактов в этих записях нет.

## Что изменено

**Первая фраза (13 карт).** Формула «<Категория> on Jl. …» заменена началом с названия места: «Porch is a coffee shop on Jl. Raya Semat…», «HUMANS CAFE, on Jl. Bali Cliff in Ungasan, serves…».

В тех же карточках убраны:
- рубленые фразы без глагола (mavammy, mamu, lemanja, ula, humans, amavi);
- «known for» и два тире в одной фразе (cafe-coach).

Формы начала разнесены, чтобы 13 карт не читались одной схемой.

**`best_for`:**
- cafe-coach описывал заведение («An all-day café — big breakfast menu…») и кончался точкой. Теперь это момент: «Anything from a big breakfast to dinner and cocktails»;
- manga-madu: «budget travelers wanting…» → «A budget meal of classic Indonesian comfort food close to central Ubud».

**`not_for` у manga-madu:** «diners seeking…» → «A fine-dining atmosphere or an extensive wine list: this is a budget warung». Причина взята из самой записи: название Warung и бюджетная пригодность из `best_for`.

**`why_its_here` у manga-madu не тронут.** Он пустой, и написать его не из чего. Карта остаётся в `needs_facts_first` по описанию.

**Удаление (одно):** mamu-ubud-cafe-shisha-hookah — «One of the widest shisha lists on the island». Это рейтинг по всему острову без источника, тот же класс, что сняли в clean-a. Марки Darkside, Musthave и Duft остались.

## Оставлено дословно

- Остальные `best_for`/`not_for` этих карт. Они уже одна фраза о моменте или о пригодности с причиной, и правка была бы ради правки. Аудит A2 просит править только начало.
- Цены, время и числа перенесены без изменений: 07:30; 20,000 IDR; 1,450,000 IDR; thirteen; April 2016; 2025.
- Фраз о политике, деньгах, ранжировании и приватности в этих полях нет.

## Сомнительные факты (замечены, не исправлены)

- **de-maison-bali-restaurant-and-bar.** Название «Restaurant & Bar», а запись называет место coffee shop. `best_for` «Working from a cafe in Denpasar» ничем в записи не подкреплён: про wifi и розетки там ничего нет. Нужна сверка категории.
- **mavammy** «in the afternoon», **lemanja-uluwatu** «before the surf», **amavi-canggu-bali** «Long lunches». Этих моментов в фактах записи нет, они пришли из живого `best_for`. Оставлены как есть.
- **pranava-yoga.** «below the premium Canggu studios» — сравнение без источника и без даты. Строки `where` нет совсем.
- **uluwatu-collective** «a month is 1,450,000 IDR», **lemanja-uluwatu** «from 20,000 IDR». Цены без даты «as of».
- **ula-cafe.** `not_for` ссылается на закрытие в 16:00 по выходным, но часов на карточке нет. Проверить, что они есть в `opening_hours_json`.
- **manga-madu.** `where` = «Ubud», адреса нет. «close to central Ubud» и «budget» ($) не проверены.
- **made-s-bakery-cafe-playground** «open since 2025», **porch** «thirteen kinds». Без даты проверки.
