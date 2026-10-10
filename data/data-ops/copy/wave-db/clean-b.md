# wave-db · clean-b · 2026-10-05: перечитка «чистых» карточек (черновик)

**Вход и выход:**
- вход — `clean-b.input.json`, 136 карточек. Ни одна не сработала на автоматические детекторы;
- выход — `clean-b.csv`, 192 строки.

**Режим:** rung 2. Переписан только собственный текст записи, факты заново не проверялись, поэтому `last_verified_at` не трогать. В базу ничего не записано, колонка `decision` пустая.

## Итог

- **Прочитано:** 136 карточек.
- **Изменено:** 101 карточка, 192 поля:
  - `why_its_here` — 85;
  - `best_for` — 82;
  - `not_for` — 25.

  Пустые `not_for` не заполнялись.
- **Без изменений:** 35 карточек, список ниже.
- **Ворота:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/clean-b.csv` завершилась с кодом 0.
  - 101 карточка, 0 FAIL, 0 проблем на уровне пакета.
  - fact-diff: PASS по всем карточкам.
  - WARN 0 → 0.
- **Дубли.** Новые тексты сверены с краулом 2026-09-28 и со всеми CSV в `data/data-ops/copy/`.
  - Найдено одно совпадение: `best_for` у Mantra Wellness совпал с `spa-2.csv` (balangan-surf-resort-jimbaran). Переписан.
  - Три первых слова `why_its_here` совпадают только у двух карточек: «The spa at …» у RIMBA и у Tanjung Benoa. Порог ворот — пять.
- **Длина `why_its_here`:** от 12 до 54 слов.
  - 23 описания короче 20 слов. Это тонкие записи, в основном спа, и фактов на 20 слов в них нет. Короче 15 слов: LuxMe (12), Free Bird (13), LKP Tirtasari, Pica, Wild Vegan (по 14).
  - Длиннее 45 слов: Seabird — 46, Prime Plaza — 54. Prime Plaza сокращён с 95 слов.

## Что переписано

- **23 спа-карточки шаблона «Spa in X. The published list covers Y. Booking is…».** Основание — решение основательницы от 05.10: «спа-карточки — сейчас». Ни в одну из шести частей wave-spa эти карточки не вошли.
  - Убраны формула-открытие и слово «published».
  - Убран повторяющийся по всему каталогу `best_for` «<процедура> booked the same day.» и «Tired feet after a day of walking.».
  - Шов в `not_for` «A budget massage — the list starts at…» у Padma, Garcia и Ubud Bodyworks сделан разным: двоеточие, точка, «since».
  - Открытия разведены, чтобы схема «<Name> is a … spa» не стала новым шаблоном: такое открытие осталось у 5 из 23.
- **Остальные карточки:**
  - открытия-формулы без глагола («Pilates studio on Jl. Raya Semat.», «Movement studio in Berawa.»);
  - цепочки фрагментов без глаголов;
  - `best_for` и `not_for` со строчной буквы, через точку с запятой;
  - сгенерированный оборот «<люди> choosing …»;
  - точки в конце `best_for`;
  - `not_for` без причины. Причина везде взята из самой карточки.

## Заметные удаления (каждое названо в `reason`)

- **Популярность и рейтинги без источника:**
  - Tanah Lot — «Bali's most photographed»;
  - Spa at RIMBA — «one of Bali's largest»;
  - Ubud Yoga Centre — «best known as Ubud's dedicated»;
  - Warung Yess — «known locally for»;
  - Pica — «absent from most local lists».
- **«long-running» без даты:** Massimo (год 1996 для джелато сохранён), Menega, Serenity Eco, Warung Yess.
- **Впечатления:**
  - Luigi's — «Pizza and good times are the whole point»;
  - Moonlite — «energetic, dressed-up evening feel»;
  - NAYA — «precise»;
  - Roots — «bold drinks»;
  - Oma Jamu — «calm … setting»;
  - Serenity Eco — «friendly eco setting»;
  - Tirta Empul — «culturally rich»;
  - TAKK — «refined plates», «signatures»;
  - Le Méridien, Ubud Fitness — «straightforward»;
  - Prime Plaza — «well-equipped»;
  - Menega — «toes-in-the-sand».
- **Служебное:**
  - Rockfish — «owner-confirmed». Если статус нужен публично, это бейдж, а не текст;
  - Sista Dumpling — «everything recorded here is»;
  - Warung Bu Mi — «Its official profile states», оставлено как «according to its official profile»;
  - Wild Vegan — «positioning».
- **Prime Plaza, 95 → 54 слова.** Убраны:
  - changing room;
  - «hot and cold» перед showers;
  - восемь спа-кабинетов;
  - бассейн 110 м;
  - повторы списка оборудования.

  Sauna и hot tub остались в `best_for`.

## Без изменений — 35 карточек

- **30 ресторанных шаблонов**, по решению A: ждут сбора фактов.
  - Список: lion-x, livingstone, melons-nusa-dua, menjamu-seminyak, mozzarella-restaurant-at-the-magani-hotel-and-spa, mychef-canggu, nagisa-…, nampu-japanese-restaurant, natys-bar-and-grill-ubud, paoman-…, plantation-restaurant-at-alila-ubud, prego-…, queen-s-of-india-at-nusa-dua, rempah-…, river-warung-at-bambu-indah, santai-beach-house-nusa-dua, sundara-jimbaran, swan-restaurant-keramas-…, t-dung-…, takir-…, tanah-liat-…, the-cave-restaurant-uluwatu-bukit, the-coffee-club-legian-…, the-kelusa-at-samsara-ubud, the-one-legian-hotel-kuta-legian, this-is-bali-ubud, uma-garden-canggu, wajik-…, waka-bar-…, warnakali-….
  - У восьми из них `best_for` сломан генератором, например «International in Nusa Dua.» или «Wood-fire in Canggu.». Чинить его нужно вместе с фактами, а не перестановкой слов.
- **5 написанных вручную карточек читаются нормально:** la-terrazza-uluwatu, reform-pilates-bingin, seven-paintings-ubud-restaurant, takumi-bali, tsune-japanese-restaurant-sanur-by-wonderspace.
- **Изменены только `best_for`/`not_for`, `why_its_here` оставлен:** Laddu, Lola's ×2, Milk & Madu ×2, Mori, NARI, Nusa Dua Beach Hotel Yoga, Pantai Lovina, Six Senses Pilates, The Chowk, Think Pink, Titi Batu, Ubud Fitness Center, Watercress, Rokkyu.

## Сомнительные факты (не исправлялись)

- **mychef-canggu** (не тронута). `not_for` говорит «the menu starts at 850K IDR», но 850K — это Wine Pairing. Тот же случай, что Gajah Putih в волне Seminyak.
- **Padma Resort Legian.** В списке только hair treatment, а `not_for` говорит о массаже от 770K. Начальная цена, видимо, посчитана генератором.
- **Ubud Bodyworks.** В записи нет ни одной цены, а `not_for` называет 750K.
- **The Garcia.** «Начинается с 690K» выведено из единственной цены в записи.
- **Moonlite.** В `why_its_here` живая музыка «nightly», в `not_for` — «most nights». В новом тексте «every night» стоит только в `why_its_here`, частота в `not_for` убрана.
- **Prime Plaza.** Входной билет включает «locker, shower and spa access». `best_for` трактует это как «sauna and hot tub included». Сохранено как в записи, нужна проверка.
- **Pole Studio Bali.** Район в записи — Kuta & Legian, а в тексте — Seminyak.
- **Утверждения «first» без источника, сохранены как в записи:**
  - S2S — «the first CrossFit affiliate on the island»;
  - Reform Pilates Bingin — «the first reformer pilates studio in Bingin»;
  - Tsune — «Indonesia's first floating sushi».
- **Reform Pilates Bingin** (не тронута). Фраза «Pre- and post-natal reformer classes run for the first and second trimesters»: postnatal и триместры не сочетаются.
- **Luxury Spa (Nusa Dua) и Mû Boutique Resort.** В «списке процедур» спа только pilates и только yoga. Похоже, генератор взял одну категорию.

## Проверка 2 (скептик)

Применены все 21 подтверждённая находка: 56 полей в 38 карточках, менялись только колонки `after` и `reason`. Ворота `check-cards.mjs` дали код 0: 101 карточка, 0 FAIL, 0 проблем на уровне пакета. Дублей с другими CSV в `data/data-ops/copy/` и с краулом 2026-09-28 нет.

- **Смысл восстановлен:**
  - **Luigi's.** `best_for` больше не обещает вечеринку каждый день. Вечеринки названы еженедельными.
  - **Warung Yess.** Убрано «add sambal matah». Осталось «the warung has its own sambal matah».
  - **The Garcia.** `not_for` называет единственную цену в записи вместо «Prices here start at».
  - **Urban Seaside.** Условие «if getting to Nusa Dua means a long detour» возвращено.
  - **Lola's Canggu.** Тако и коктейли больше не делятся между группой и парой. Слово «casual» сохранено.
  - **Moonlite.** «Couples» относится только к ужину.
  - **Sista Dumpling.** Делиться предлагается тарелками, а не напитками. Из `best_for` убрано «any time».
  - **Nirvana Life.** 6am–11pm подано как часы работы клуба.
  - **Wild Vegan.** Причина «vegan» относится только к мясу.
  - **The Chowk.** Убрана придуманная смешанная компания.
  - **Nusa Dua Beach Hotel Yoga.** Убрано утверждение об аудитории. Класс в 7am теперь стоит у Yoga Bale, как в записи, а классы на пляже и в саду идут отдельно.
- **Оговорки возвращены:**
  - **Maya Sanur.** «Resort guests».
  - **St. Regis.** «Resort guests».
  - **Mövenpick Yoga.** «Guests».
  - **Warung Bu Mi.** Halal убран из `best_for`. В `why_its_here` и halal, и часы снова атрибутированы официальному профилю. Это заменяет строку про Warung Bu Mi в разделе «Заметные удаления».
- **Prime Plaza.** В `why_its_here` возвращены sauna, hot tub, бассейн 110 м, «hot and cold showers» и «personal trainers can be booked ahead». Длина — 77 слов, это заметка, а не FAIL. `best_for` теперь говорит «locker, shower and spa access in the entry price». Трактовка «sauna and hot tub included» снята, она не проверена. Это заменяет строки «95 → 54» и «Sauna и hot tub остались в `best_for`» выше.
- **Спа, `best_for` (21 карточка).** Ротация «same day / short notice / fitted in / on the day» убрана полностью. Каждый `best_for` собран из фактов своей карточки: процедура, район, цена, длительность или канал записи. Формы разведены внутри страниц района.
  - Rosehill — «Reflexology after a day on your feet».
  - Spa Sidemen — «Up to two hours of massage in Sidemen».
  - Parigata — массаж или спа-пакет с процедурами до 120 минут.
- **Спа, `why_its_here`.** Обороты «list covers», «on its/the list» и «lists» убраны у Lluvia, LuxMe, Luxury Spa, Mû, Mantra, Padma, Pala, Parigata, The Garcia, Svaha, The Ungasan, Ubud Bodyworks, Usadha и Zahra. Остались простые глаголы: does, runs, takes bookings.
  - Фраза о записи не удалена, а переформулирована и местами перенесена в середину предложения. Кнопка записи на странице места появляется только при проверенном `booking_url`, поэтому без этой фразы канал записи мог бы исчезнуть с карточки.
  - На странице Nusa Dua открытие «treatment-first … on the list at» больше не встречается.
- **Грамматика:**
  - **Pica.** «this is a small South American restaurant».
  - **Pizzaria.** «An upscale beachfront dinner as a couple or for a special occasion…».
  - **Moonlite.** «A couple's rooftop dinner…».
- **Длина `why_its_here` после правок:** от 12 слов (LuxMe, Usadha) до 77 (Prime Plaza). Короче 20 слов — 25 описаний, длиннее 45 — два.
- **Не исправлялось, вне находок:** `not_for` у Padma («the list starts at 770K») и Ubud Bodyworks («the list starts at 750K»). Обе цены остаются в разделе «Сомнительные факты» и требуют проверки по источнику.

## Решение основательницы 08.10

Правило 1 — убрать то, что противоречит данным самой карточки (часы, адрес, район, другое поле) или дате, которая уже прошла. Правило 2 — убрать «первый / единственный / крупнейший», рейтинги и награды без названного проверяемого источника в записи. Ничего не добавлялось. Изменены 5 полей в 5 карточках: 2 существующие строки и 3 новых (у этих полей в CSV не было строки; `before` взят из живого текста, `source` = `founder decision 2026-10-08`). Ворота: `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/clean-b.csv` — 104 cards · 0 FAIL · batch problems 0.

- **pole-studio-bali** (`why_its_here`) — убрано «in Seminyak»: район карточки — Kuta & Legian, адреса в записи нет. Правило 1.
- **reform-pilates-bingin** (новая строка `why_its_here`) — убрано «The first»; теперь «A reformer pilates studio in Bingin, opened in 2023 by Abbey». Правило 2.
- **s2s-crossfit** (`why_its_here`) — убрано «and the first CrossFit affiliate on the island». Правило 2.
- **swan-restaurant-keramas-desa-swan-villas-and-spa** (новая строка `why_its_here`) — убрано «, Ubud»: адрес карточки — Keramas Beach, Gianyar, это побережье, а не Убуд. Правило 1. Неверный район в метаданных (Ubud) остаётся в очереди data-ops.
- **tsune-japanese-restaurant-sanur-by-wonderspace** (новая строка `why_its_here`) — убрано «Indonesia's first»; теперь «with floating sushi». Правило 2.

### Сомнительные факты, которые сознательно не тронуты

- **mychef-canggu (850K = Wine Pairing), Padma (770K), Ubud Bodyworks (750K), The Garcia (690K)** — цены. Ими занимается отдельная очередь сбора фактов. У Padma `not_for` говорит о массаже, хотя `why_its_here` называет только hair treatment. Строка в `not_for` — ценовой факт без источника, а не опровержение другого поля. Оставлена для сбора фактов.
- **Moonlite** — расхождение «nightly / most nights» уже снято второй проверкой: частота осталась только в `why_its_here`.
- **Prime Plaza** — трактовка «sauna and hot tub included» уже снята второй проверкой.
- **Reform Pilates Bingin** — «Pre- and post-natal … for the first and second trimesters». Фраза противоречит сама себе. Правило 1 тут не срабатывает: данных карточки, с которыми она спорит, нет, а убрать одну из половин значило бы выбрать факт. Нужна проверка по источнику.
- **Luxury Spa, Mû Boutique Resort** («список» — только pilates или yoga) — ошибка данных генератора, очередь сбора фактов.
- **Заготовки «in <деревня>, Ubud» с адресом в Payangan / Tegallalang** (the-kelusa, paoman, t-dung) — «Ubud» здесь название большого района. Это ошибка района в метаданных, очередь data-ops. Swan — исключение: Keramas находится на побережье.
- **mapogu** — «live music plays at weekends» при кухне, закрытой в воскресенье. Это не противоречие: музыка может быть в субботу, а закрыта кухня, а не заведение.
