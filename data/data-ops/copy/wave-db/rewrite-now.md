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

## Проверка 2 (скептик)

Скептик подтвердил три замечания. Все три исправлены в `rewrite-now.csv`. Колонки `before`, `unit_id`, `source` и `decision` не тронуты. Поменялись только `after` и `reason` у 11 строк. Формат прежний: CRLF, 17 строк.

**1. Новый шаблон в начале карточки.** В первой версии 10 из 13 `why_its_here` начинались одинаково: «<Name> is a <category> on/at Jl. …». Строки 1–6 шли подряд. Значит, фраза «Формы начала разнесены» выше была неверной. Теперь у 11 карт новое начало. Нигде больше двух карт подряд не начинаются одинаково:
- **меню / товар:** amavi («The menu at AMAVI goes from…»), mavammy («Mavammy's dessert counter…»), porch («Thirteen kinds of cheesecake are the reason to come to Porch…»), mamu («Darkside, Musthave and Duft are on the shisha list at MAMU…»), lemanja («Breakfast at Lemanjá Uluwatu starts at 07:30.»);
- **история / человек:** pranava («Vicki and Yuni opened Pranava Yoga in April 2016…»), ula («Chef Mags builds the menu…»). Made's без изменений («…grew out of a small warung…»);
- **адрес впереди:** cafe-coach («On Jl. Nelayan in Canggu, Cafe Coach is…»);
- **«At …»:** uluwatu-collective («At Uluwatu Collective, CrossFit… run as group classes.»);
- **приложение (название, место):** dewas и humans без изменений, de-maison («De Maison Bali Restaurant & Bar, in Renon, Denpasar, is a coffee shop…»). Dewas и humans стоят рядом, это две подряд, третьей нет.

Формы «<Name> is a <category> on Jl.» в выходе больше нет. Порядок строк такой: меню, адрес, меню, товар, история, товар, приложение, приложение, товар, история, человек, «At», приложение.

**2. porch: добавлен факт.** «…the cheesecake, which it makes in thirteen kinds» говорило, что чизкейк пекут сами. В записи этого нет. Теперь: «Thirteen kinds of cheesecake are the reason to come to Porch, a coffee shop on Jl. Raya Semat.» Слова исходного текста, утверждения о производстве нет.

**3. cafe-coach: грамматика и сдвиг смысла.**
- `why_its_here`: «The large menu runs from breakfast to dinner (benedicts, poke bowls, burgers), with coffee and cocktails.» Блюда снова примеры, а не концы диапазона. Лишнего «from» нет.
- `best_for`: «Breakfast, or dinner that runs into cocktails». Формулировка «a big breakfast» убрана: исходное «big breakfast menu» говорило о размере меню, а не порции. Фраза снова о моменте, а не о меню. «dinner into cocktails» взято из исходного текста. Слова «big» и «coffee» из `best_for` ушли, это видно в отчёте (dropped LEX:big). «coffee» остаётся в `why_its_here`. «large menu» там тоже есть.

**Ворота:**
- `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/rewrite-now.csv`: 14 карт, 0 FAIL, batch problems 0, exit 0.
- WARN по картам: 8 → 4. В первой версии было 5. Ни на одной карте WARN не вырос. Остались списки из трёх в исходных составах (mamu, lemanja, ula, uluwatu-collective).
- Fact-diff по каждой строке отдельно, before → after. REJECT дают только две вещи: название места, которое берётся из имени записи, и «budget» в `not_for` manga-madu, которое пришло из `best_for` той же карты. Обе на уровне карты разрешены, `check-cards` их пропускает. Чисел, цен, времени и блюд сверх исходного текста нет.
- Новое значение `best_for` у cafe-coach нигде в `data/` и в краул-файле `places.csv` больше не встречается.
- `node scripts/copy/check-rewrite.mjs … --ref HEAD`: exit 1, 37 «FAIL». Эти ворота к CSV не применимы. `extract-code-prose.mjs` разбирает файл как TypeScript, поэтому единицы `<expr>` режутся по кавычкам CSV и сопоставляются вслепую: `before` одной колонки сравнивается с `reason` или `after` другой строки. В первом проходе файла не было в HEAD, и ворота дали 0 единиц. Теперь он есть в коммите 207e38f, и вывод — шум разбора. Для данных карточек правильные ворота — `check-cards` (выше).
- `npx eslint` на CSV: файл не входит в конфигурацию, 0 ошибок, 1 предупреждение «ignored».
- `node --test scripts/copy/*.test.mjs`: 152 pass, 0 fail. Тесты не менялись. Ни одна строка этого CSV не закреплена тестом.

**Оставлено дословно:** manga-madu (`best_for`, `not_for`), dewas, humans, made's. Цены, время и числа те же: 07:30; 20,000 IDR; 1,450,000 IDR; thirteen; April 2016; 2025.

**Новых сомнительных фактов не найдено.** Список выше в силе. Одна мелочь: в mamu слово «lounge» стоит дважды («shisha lounge» и «air-conditioned lounge»). Так было и в исходном тексте, фактом это не является.

## Решение основательницы 08.10

Строки `rewrite-now.csv` проверены по правилам 1 и 2:
- правило 1 — фраза противоречит часам, адресу или другому полю карточки, или дата в ней уже прошла;
- правило 2 — заявления «первый / единственный / крупнейший», награды, рейтинги, известность без названного источника.

**Карточек изменено: 0. CSV не менялся.** У карточек этого списка в `rewrite-now.input.json` нет видимых часов (`context_not_for_copy`), так что противоречить часам нечему. Все улицы и районы в тексте совпадают с `where`. Единственное заявление о первенстве («One of the widest shisha lists on the island», mamu) было удалено ещё при переписывании.

**Ворота:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/rewrite-now.csv` → `14 cards · 0 FAIL · batch problems 0`.

**Сознательно не тронуто** (пункты из «Сомнительные факты»):
- **de-maison-bali-restaurant-and-bar.** Запись называет место «coffee shop», хотя в названии «Restaurant & Bar». `best_for` про работу из кафе в записи ничем не подкреплён. Это вопрос категории и сбора фактов: прямого противоречия данным карточки нет, а без этих слов поле пустеет.
- **pranava-yoga, «below the premium Canggu studios».** Это сравнение цен, а не первенство, награда или рейтинг. Цена — изменчивый факт и уходит в очередь сбора.
- **ula-cafe** («closes at 16:00 on Saturday and Sunday») и **uluwatu-collective** («closes at 19:00»). Часов на карточке нет, противоречия нет. Нужно проверить `opening_hours_json` в очереди сбора фактов.
- **uluwatu-collective** «1,450,000 IDR» и **lemanja-uluwatu** «from 20,000 IDR». Это цены, они уходят в очередь сбора.
- **made-s-bakery-cafe-playground** «since 2025» и **porch** «thirteen kinds». Даты, которые уже прошли, здесь нет. Это изменчивые факты.
- **manga-madu** «close to central Ubud», «budget». С `where` = «Ubud» не расходится.
- **mavammy**, **lemanja-uluwatu**, **amavi-canggu-bali**. Моменты «afternoon», «before the surf» и «long lunches» взяты из живого `best_for` и данным карточки не противоречат.
