# clean-a · wave-db · 2026-10-05 — перечитка «чистых» карточек (черновик)

Вход: `clean-a.input.json` (135 карточек, которые не сработали на автоматических детекторах). Выход: `clean-a.csv`, 154 строки.

Это черновик. В базу ничего не записано, колонка `decision` пустая, коммита нет. Режим — rung 2: переписан только собственный текст записи, факты заново не проверялись. `last_verified_at` не трогать.

## Итог

- **Прочитано:** 135 карточек.
- **Изменено:** 75 карточек, 154 поля:
  - `why_its_here` — 62;
  - `best_for` — 61;
  - `not_for` — 31.
- **Без изменений:** 60 карточек (разбивка ниже).
- **Ворота:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/clean-a.csv` — 75/75 PASS, 0 batch problems, exit 0.
- **Lint по изменённым полям:** 0 FAIL, 0 WARN, до правки и после.
- **Новые `not_for` (2):** bali-beach-hotel-fitness-centre и conrad-bali-yoga. В обоих случаях условие перенесено из `best_for`/`why_its_here` («day visitors are not admitted», «extra charge on top of the room rate»). Новых фактов нет.
- **Длина `why_its_here`:** от 11 до 51 слова.
  - Короче 20 слов — 15 карточек: 7 спа-карточек и 8 коротких записей (air-terjun-gitgit, aperitif, balumba, bebek-tepi-sawah, bella-by-sage, flourish, home-cafe, intuitive-flow). Других фактов в этих записях нет. Исходники были такими же короткими или короче, кроме air-terjun-gitgit: там снята фраза о популярности.
  - Длиннее 45 слов 8 плотных записей (46–51). Все короче исходного текста или равны ему, кроме bokashi (+2) и cocomo (+1).
- **Удаления:** каждое названо в `reason` своей строки.

## Что изменено

### Редакционные карточки (52)

Убраны:
- цепочки через точку с запятой в `best_for`/`not_for` и строчные буквы в начале;
- зачины «Travellers/People/Diners/Practitioners who…»;
- `not_for` без причины.

Переписаны «runs from … through … to …, alongside», «offer pairs … with», «explicit … positioning», «link hub».

Заметные удаления:
- **Язык отзывов (guardrail #2):** intercontinental-bali-resort-fitness-centre — «described by guests as large and well stocked with machines» и производное от него «big» в `best_for`.
- **Служебный текст на публичной карточке:** grillos-cafe-and-eatery — «No readable menu is published online, so no dishes or prices are recorded here».
- **Популярность и ранги без источника:**
  - air-terjun-gitgit — «one of north Bali's most visited falls»;
  - desa-wisata-gitgit — «well-known»;
  - intuitive-flow — «one of Ubud's most scenic garden settings».
- **Возраст без даты:**
  - ayam-betutu — «long-running»;
  - crumb-and-coaster — «long-standing»;
  - intuitive-flow — «long-established».
- **Маркетинговые слова и самоописания:**
  - eskq — «premium steaks»;
  - karsa — «hideaway», «gourmet»;
  - ayam-betutu — «genuine».
- **Дубль между карточками:** у air-terjun-gitgit и desa-wisata-gitgit `best_for` совпадал слово в слово. Теперь тексты разные.

### Спа-карточки (17)

Это тонкая спа-формула «Day spa in X. The published list covers Y.», которой нет во входах wave-spa. По решению основательницы от 05.10 («спа-карточки — сейчас») они переписаны:
- формула-открытие заменена;
- склеенная строка исправлена (anandinii: «Balinese Massage 60 minutes is 300K IDR for 60 minutes»);
- шаблоны «A long reset — …», «A budget massage — the list starts at …» и «Tired feet after a day of walking» переформулированы под каждую карточку.

**Удалено на 11 карточках:** «booked the same day». Это обещание доступности, которое генератор ставил на каждую карточку шаблона без источника (AGENTS.md §11). Вместо него — процедура или цена из той же записи.

Формы первых предложений разнесены, но данных в этих записях почти нет, поэтому тексты остаются короткими.

**Нужно сделать:** включить эти 17 slug в межчастную дедупликацию wave-spa, чтобы формулировки не совпали дословно с её карточками.

### Шаблонные карточки ресторанов с меню (6)

Шаблон «Restaurant in X. The kitchen is described as… The published menu includes…»:
- bella-canggu;
- dua-umalas-seminyak;
- gather-canggu;
- hidden-gem-uluwatu-uluwatu-bukit;
- kafe-ubud;
- kekeb-restaurant-nusa-dua.

Переписаны только по стилю, как четыре такие карточки в seminyak-kuta-bali. Главная причина — сломанный `best_for` («Varied international in Ubud.», «Indonesian, Balinese, Seafood in Nusa Dua.»). Полноценный текст для них ждёт сбора фактов (решение A).

## Без изменений (60)

- **31 заготовка ресторана** «Restaurant/Cafe in X, open daily …» с пустыми `best_for`/`not_for`. Это решение A: в записи только адрес и часы, они уже есть на карточке. Любая «тёплая» фраза была бы выдумкой. Ждут сбора фактов.
- **29 редакционных карточек**, которые читаются нормально:
  - alchemy-yoga;
  - alila-seminyak-yoga;
  - ants-pants;
  - ayana-bali-yoga;
  - bambu-pilates;
  - barbacoa;
  - bistro-anwa;
  - brie;
  - bunut-bolong;
  - cantina-classe (обе);
  - celebrity-fitness;
  - cemara-point;
  - chupacabras (обе);
  - dodo-pizza;
  - focaccia-buddies;
  - grand-hyatt-fitness;
  - habitat-bistro;
  - hawa-gym;
  - honey-kitchen;
  - intercontinental-sanur-fitness;
  - jade-by-todd-english;
  - jalapeno;
  - jimbaran-hub (обе);
  - karma-jimbaran-fitness;
  - kaum-bali;
  - kupu-kupu-day-spa.

  У части из них `best_for` кончается точкой. Ради одной точки поля не переписывались.

## Швы `not_for`

Использованы since, двоеточие, because и точка. Ни у трёх соседних изменённых карточек шов не повторяется. Тире в новых `not_for` нет. Ворота отмечают пять одинаковых первых трёх слов в `why_its_here`; здесь таких 0.

## Сомнительные факты (не исправлялись — на проверку)

1. **anantara-ubud-bali-resort-ubud:** Thai Warrior Stretching Massage — 2850K IDR за 60 минут, и «the list starts at 2850K». Похоже на ошибку разбора цены.
2. **celestine-spa-kuta-legian:** «the list starts at 1300K IDR», при этом ни одной процедуры в записи нет.
3. **bali-yoga-school-ubud:** название — школа йоги, а запись — «wellness spa» с Ayurvedic Treatment. Тип места под вопросом.
4. **desa-wisata-sanur-kauh:** «faces north, so it catches both sunrise and sunset». Мертасари — южная оконечность Санура, ориентация сомнительна.
5. **brie-restaurant-and-cheesery** (без изменений): «The only restaurant in Bali with its own cheesery». Превосходная степень без источника.
6. **celebrity-fitness** (без изменений): «The first international gym chain to open in Bali». То же.
7. **ku-de-ta:** «Bali's original beachfront club». Оставлено, не проверено.
8. **Вероятные дубли записей:**
   - chupacabras / chupacabras-south-american-prime-meats — один стейкхаус в Kedewatan;
   - chaskaa-jimbaran / chaskaa-modern-indian-cuisine-and-bar-at-jimbaran — CHASKAA GWK. У второй район Uluwatu и «Uluwatu Bukit», хотя адрес в Jimbaran.
9. **hawa-gym-tukad-yeh-aya:** район Sanur, а адрес — Renon, Denpasar.
10. **inklusiv-warung:** «150K per person». Неясно, это плата за шоу или за еду. В `not_for` сохранено как есть.
11. **Изменчивое без даты или с датой, которая уходит:**
    - bokashi — «Pererenan branch is closed until further notice»;
    - alma — «February 2026 menu»;
    - cocomo — «recently» (бывшее «recent repositioning»);
    - bali-beach-hotel-fitness-centre — «new».
12. **Заготовки со сломанной строкой места** (не правились, решение A). При сборе фактов исправить первыми:
    - house-of-tundra — «Restaurant in M5VG+GWM» (plus-код вместо места);
    - jack-fruit — «in H6MW+VJ»;
    - cabana-lounge — «in Inside Alila Ubud»;
    - ikan — «in The Westin Resort Nusa Dua Kawasan Pariwisata Nusa Dua».
13. **«booked the same day»:** снято здесь на 11 карточках, но та же строка стоит на множестве других карточек в базе. Это вопрос к сбору фактов, а не к стилю.

## Проверка 2 (скептик)

Применены все 19 замечаний второго читателя. Изменено 55 ячеек `after` в 42 карточках: `why_its_here` — 26, `best_for` — 19, `not_for` — 10. В каждой изменённой строке переписан и `reason`. Другие колонки не трогались, `decision` пустая, коммита нет.

**Ворота после правки:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/clean-a.csv` — 75 карточек, 0 FAIL, 0 batch problems, exit 0. Lint по 55 изменённым ячейкам: 0 FAIL, 0 WARN. Ни у трёх соседних `not_for` нет одинакового шва. Дословных совпадений с живым кроулом (`places.csv`) и другими файлами в `data/data-ops/copy` нет.

### Новые утверждения и сдвиги смысла

- **flourish `not_for`:** «It is a healthy, gluten-free and vegan restaurant» читалось как обещание, что всё меню без глютена и веганское. Теперь «since it is a healthy restaurant with a gluten-free and vegan focus»: «focus» соответствует записи («positioning»). Склейка «фрагмент. предложение без точки» убрана.
- **herb-library `not_for`:** «plant-based kitchen» → «contemporary all-day spot». На той же карточке есть рыба и курица.
- **inklusiv-warung `not_for`:** снято «нельзя поужинать без шоу» и намёк, что 150K платит каждый гость. Теперь «A low-key evening on Wed, Fri or Sun, when drag shows run from 8pm (150K per person)». Цена привязана к шоу, как в записи.
- **bokashi-berawa `not_for`:** две оговорки снова раздельные. Ужин не подходит никому, потому что закрываются рано вечером. Группе нужно место, а зал на ~30 мест.
- **amplitude `not_for`:** возраст 4+ относится к урокам, а не ко всему парку. «Non-refundable» теперь адресовано тому, кто может отменить бронь.
- **ku-de-ta, imbu `not_for`:** причина стоит только при своём пункте: минимальный чек — при бюджете, 100 мест — при уединённом зале.
- **aperitif `best_for`:** снято «planned in advance». Про бронь в записи ничего нет.
- **desa-wisata-sanur-kauh `best_for`:** храм снова описан как «used for melukat bathing». Не утверждается, что туристу можно участвовать.
- **grillos `best_for`:** «any time from 7am to 11pm» → «in a cafe open 7am to 11pm». Это часы работы, а не часы кухни.
- **babi-guling-swari `why_its_here`:** приложения доставки снова приписаны собственным ссылкам заведения. Обещания «you can order» и зоны доставки нет (§11).
- **amandari `why_its_here`:** «Amandari is a wellness spa» → «The spa at Amandari». Слово «resort» не добавлено: в записи его нет.
- **bali-yoga-school `why_its_here`:** ярлык генератора «wellness spa» снят. Тип места остаётся в сомнительных фактах (п. 3).

### Шаблоны

- **17 спа-карточек, `why_its_here`:** «published list» убрано везде. Порядок информации разный: с цены (anandinii, glow), с процедуры (anantara, empower), с места (bali-reflexology), через приложение (2-aces, fresh, la-joya), «The spa at…» (amandari). На странице каждого района у спа-карточек разные зачины.
- **Строка «Booking is on the venue's own site» снята** там, где кроме категории других фактов нет: bali-reflexology, bali-yoga-school, chill, kush. Бронь через сайт остаётся у anandinii и la-joya, у amandari, anantara и bahari сформулирована иначе. WhatsApp и Fresha остались.
- **Спа `best_for` вида «<процедура> in <район>»:**
  - карточки, где есть факт, привязаны к нему: anantara — названная процедура и 60 минут; bali-tropic — процедура и курорт; amandari, anandinii, celestine и chill — длительность, на четырёх разных формах.
  - **Где факта нет** (2-aces, bali-reflexology, bali-yoga-school, empower, galangal, kush), строка сокращена до процедуры без района. Причина записана в `reason`.
  - **Не обнулено намеренно:** пустой `best_for` снимает заведение с публикации (`lib/publication.ts`, `decisionReadyEditorial` требует `why_its_here` и `best_for`).
- **Шесть шаблонных меню-карточек:** общий каркас «<Name> is a <District> restaurant… The menu includes A, B and C, and you book…» разбит.
  - dua начинается с блюд, kafe — с меню;
  - у gather бронь перенесена в первое предложение;
  - hidden-gem даёт список через двоеточие;
  - у kekeb бронь в конце;
  - у bella и kafe список сокращён до двух позиций: сняты 'It was all a dream' и Meg's Mini Bowl.
- **Фитнес и йога `best_for`:** зачины «<X> guests who want» заменены моментом. Для отеля — «while staying», для Conrad — «during a stay».
- **«from … to» для не-диапазонов:** ankhusa и gather — обычный список и выбор.

### Грамматика и швы

- bebek, casa-de-lokha, celestine, flourish: один шов на поле, без «фрагмент. предложение без точки».
- cocomo: «cooking seafood and grill» → «serving seafood and grilled dishes».
- home-cafe-mengwi: самоописание вынесено в отдельное предложение и относится к кафе, а не к Pererenan.

### Что изменилось в итогах выше

`why_its_here` короче 15 слов теперь у 13 карточек, было 7. Это тонкие спа-записи:
- у chill и bali-yoga-school (по 8 слов) и kush (10) снята строка о брони;
- fresh (10) сведён в одно предложение.

Других фактов в этих записях нет. Ворота считают это заметкой, а не ошибкой. Карточки ждут сбора фактов. Цифры о длине в разделе «Итог» выше относятся к первому проходу.
