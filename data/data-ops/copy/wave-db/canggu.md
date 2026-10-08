# Canggu · wave-db · 2026-10-05 — стилевая переработка карточек (черновик)

Вход: `canggu.input.json` (148 карточек). Выход: `canggu.csv` (352 строки), отчёт ворот `canggu.gate.csv`.
Режим — rung 2: переписан только собственный текст записи, факты не перепроверялись, `last_verified_at` не трогать. В базу ничего не записано; колонка `decision` пустая.

## Итог

- Изменены все 148 карточек, без изменений — 0 (у каждой был lint-код или стоковая фраза).
- Полей изменено 352: `why_its_here` 140, `best_for` 139, `not_for` 73. Новое `not_for` одно (obsidian-gym-bali-canggu): «don't mind a premium day pass (449k)» перенесено из `best_for` как fit; новых фактов нет.
- Ворота: `check-cards.mjs` — 148/148 PASS, 0 batch problems, exit 0. WARN 181 → 1. Оставшийся — A10 у Shosan: «Signature» входит в название процедуры «Shosan Signature Massage».
- Длина `why_its_here`: 17–48 слов. У 16 карточек 46–48 слов: это плотные записи, и сокращать их дальше пришлось бы ценой фактов. У 3 карточек по 17 слов (Jungle Padel, RITE Yoga, The Canggu Studio Yoga): других фактов в записи нет.
- Каждое удаление названо в `reason` своей строки.

## Заметные удаления

- **Язык отзывов (guardrail #2), Victory Fitness Club:** удалено «Reviews are consistent on the value and mixed on cleanliness». Из `best_for` убрано «do not mind a rough-around-the-edges gym»: это оценка качества, а не fit (#9).
- **Популярность и рейтинги:**
  - FINNS Beach Club — «biggest and best-known»;
  - Warung Sika — «most popular»;
  - NÜDE — «popular»;
  - Desa Seni — «one of Canggu's most atmospheric»;
  - Mason — «go-to rooms»;
  - Milk & Madu Berawa — «dependable, crowd-pleasing».
- **«known for / best known for»:** Crate, Casa Tua, La Brisa, Lyma, Poule de Luxe, Goldust Beauty, Nail Lesss, The Lawn, HairShop.
- **«long-running / long-standing / institution» без даты:** Crate, Milk & Madu, Milu, The Lawn, Tropical Nomad, Warung Nonii, HairShop. Там, где в записи есть год, он остался.
- **Слоганы и самопозиционирование:**
  - Bali Buda — «Bali's original source…»;
  - Bar Vera — «new generation of European wine bars»;
  - Jungle Padel — «fast-growing racket sport»;
  - Sa'Mesa — «one-of-a-kind», «an event as much as a meal».
- **Оценки без источника:**
  - authentic;
  - quality beans;
  - well-taught;
  - careful;
  - well-run;
  - reliable / serious / proper / solid / trustworthy;
  - dependable.
- **Впечатления:**
  - удалены: relaxed, laid-back, serene, tranquil, stylish, chic, atmosphere;
  - перенесены в `not_for` как fit: Crate (loud, crowded), Mosto (compact room).
- **Факты, снятые сознательно:**
  - Copenhagen — другие точки группы (Padonan, Pererenan, Seseh) и «one of two cafe sites»;
  - Surya Fitness — перечень стандартного инвентаря (бренды оставлены);
  - Green Spot — улица (она есть в адресе).

## Сомнительные факты (не исправлялись — на проверку)

1. **saya-club** — «open around the clock» и «middle of the night», а видимые часы 06:00–22:00. Проверить до публикации.
2. **sia-grill-and-seafood-bar** — «opens at midday», а часы с 09:00.
3. **mia-asian-modern…** — «from evening», а часы с 12:00 (пн–чт).
4. **bonito-restaurant** — «dinner-only, Monday to Saturday», а часы с 12:00.
5. **bottega-italiana** — в тексте «Origano»; кухня 11:00–23:30, а видимые часы пн–пт 11:00–13:00.
6. **yuki-canggu** — бронь «essential» (why) против «recommended» (not_for).
7. **the-avocado-factory** — «Berawa-area», а адрес Jl. Pantai Batu Mejan.
8. **brunch-club-pererenan** — Berawa «reopening mid-2026»: дата прошла.
9. **sa-mesa-canggu-experience-dining / samesa-canggu** — одно название, разные улицы. Возможен дубль.
10. **jungle-padel-canggu-canggu / …-shortcut** — вероятный дубль. В area служебная пометка «verify branch».
11. **desa-seni-yoga** — в area служебная пометка «Berawa boundary / verify pin».
12. **the-shampoo-lounge-canggu** — slug не совпадает с именем HairShop Canggu (переименование?).
13. **therapy-canggu-canggu / therapy-hair-spa-canggu-canggu** — те же часы и услуги. Одно место?

## Открытия и швы

- **Новый шаблон в открытиях.** После первого прохода 101 из 148 описаний начинались с «<Name> is a …». Ворота этого не видят: названия разные. Переписаны 37 открытий. Теперь:
  - 62 — «<Name> is a»;
  - 53 — имя + глагол, приложение или вводный оборот («On…», «Off…», «From…», «Built…», «Opened in 2023…»);
  - 17 — «A/An …»;
  - 16 — «The …».
  Нигде нет трёх соседних карточек с одной формой. Заметка ворот о пяти одинаковых первых трёх словах — 0.
- **Убраны повторы, появившиеся при обходе правила списков:** «alongside» (15 раз) и концовки `not_for` вида «: this is a <тип>».
- **Швы `not_for`:** двоеточие, «because», точка, «since», тире — у трёх соседних карточек шов нигде не повторяется. Тире не больше одного.
- **Ложные срабатывания, которые полезно знать:**
  - A5 срабатывает на приложение с «and» в пределах четырёх слов после запятой («Bali Buda, an organic … cafe and shop»). Маскировка названия укорачивает фразу, и ловушка срабатывает чаще.
  - «°C.» читается как сокращение: предложения склеиваются, и срабатывает A7.
  - fact-diff принимает слово в начале предложения, которого нет в исходном тексте, за имя (Sister, Daytime, Turning, Using, Fight).
- **`scripts/copy/fact-diff.mjs` изменился на диске во время сессии** (не мной). Финальный прогон ворот сделан на текущей версии.

## Проверка 2 (скептик)

Скептик подтвердил девять замечаний. Исправления минимальные, только в колонке `after` (21 строка), скриптом через модуль csv. Колонка `before` и формат CSV не тронуты. Новых фактов нет: в каждой карточке использован только её собственный живой текст.

**Сдвиг смысла фактов:**
- **body-factory-bali-canggu / best_for.** «Recovery in one visit» больше не привязано к любому пассу: раньше это противоречило `not_for`, где recovery — отдельный тариф. Стало: «A gym or HYROX session on a 1, 3, 7 or 14-day pass or a four-week membership». Recovery остаётся в `not_for`.
- **beach-boy-canggu / why_its_here.** «Vegan» возвращено к кухне: «…steaks, seafood and pasta, with a vegan list; the cocktail and mocktail list is long.»
- **face-therapy-spa-pererenan / best_for.** Формула «после перелёта» относится только к jetlag-процедуре: «A jetlag-recovery face treatment after a long flight, or gua sha and buccal sculpting».
- **smoke-grill-master-and-barbeque-bali / why_its_here.** Условие «10+ гостей, бронь за 48 часов» снова относится и к barn, и к chef's table.
- **ruko-cafe.**
  - `why_its_here`: убрано «open daily» — часов в карточке нет.
  - `not_for`: «it is a daytime cafe». Как в живом тексте, без утверждения «только завтрак и бранч».
  - `best_for`: вернулись coffee и «after the beach».

**Сужение аудитории:**
- **jungle-padel-canggu-shortcut / best_for.** Урок теперь доступен и без группы из четырёх.
- **ulekan-berawa / best_for.** «A sit-down dinner of classic Indonesian dishes, shared as a group or as an accessible introduction to the cuisine». Вариант «first taste» ворота отклонили (LEX:first).
- **То же через «or» исправлено в:**
  - woods-bali: cosy dinner и date night разделены;
  - the-loft-bali: plant-based больше не условие для бранча и ноутбука;
  - satu-satu-coffee-company: кофе и «после сёрфа» разделены.
- **yema-kitchen / best_for.** «Tajine, couscous or pastilla, at the café by day or the bar by night». Убран выдуманный «day-into-night meal».

**Тик «X and Y as well as Z, plus W»:**
- Это обход A5. Заменён на простые одиночные списки в 8 карточках:
  - nirvana-strength-tibubeneng;
  - saya-club;
  - surya-fitness-gym;
  - sushimi-bali;
  - wrong-gym-pererenan;
  - top-gym;
  - bali-mma-canggu;
  - lowcal-cheatery-and-bar.
- У Nirvana класс-лист больше не висит на приложении. Открытие стало «Nirvana Strength, a wellness club…, runs…», а не «<Name> is a»: соседи seseh и nude уже начинаются с «is a».
- the-slow оставлен: «for breakfast as well as an evening out» — естественная пара, а не разбитый список.

**Ворота:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/canggu.csv` → 148 cards · 0 FAIL · batch problems 0, exit 0. Число WARN не выросло.

**Остаётся открытым (не трогалось):** lowcal-cheatery-and-bar — «a low-calorie menu that also covers paleolithic and ketogenic eating» делает low-calorie главным, хотя в источнике все три равноправны. Проверить в следующем проходе.

## Разнообразие начал (2026-10-06)

Повод: после проверки 2 описания всё ещё открывались шаблоном «<Name> is a/an/the …» (включая «<Name>, приложение, is a» и «The <branch> of X is a»), местами по три соседние карточки подряд. Ворота этого не видят. План взят из черновика предыдущего агента, но список строк пересчитан по текущему CSV, уже после правок скептика.

- **Счёт** (первое предложение `why_its_here` в порядке файла, 140 карточек):
  - было: 68 «<Name> is a/an/the», 14 соседних пар, 5 троек подряд;
  - стало: 23, соседних пар 0, троек 0.
- **Оставлены как есть (23).** Ни одна не стоит рядом с другой: beachtown-grocer, bonito, chow-chow, cutiepai, e-a-r-t-h, finns-recreation, goldust-spa, ju-bali, la-brisa, lyma-beach, miel, murmur, pizza-fabbrica, riviera-bistro, samadi, secret-spot, skool-kitchen, the-flow, hairshop, tropical-nomad, warung-local, workmates, zin.
- **Переписано 45 первых предложений.** Только перестановка слов самой карточки, без нового факта и без оценочных слов. Формы:
  - место впереди («On/At/Near/Among…», инверсия у Warung Nonii) — 11;
  - имя + глагол («has / pairs / serves / keeps…») — 10;
  - приложение «X, a …, глагол» — 12;
  - факт как подлежащее («Spices are ground daily at Rize…», «Weights and machines fill…») — 7;
  - вводный оборот («From early morning…», «Trading as MASONRY.…») — 2;
  - «A …, X глагол» — 3.

  Первое предложение по-прежнему говорит, что это за место (оно же мета-описание). Длина — не больше 25 слов, «offers» нет. Формулы «<Category> on Jl.» нет. У каждой изменённой карточки форма начала отличается от обоих соседей. Заметок ворот о пяти одинаковых первых трёх словах нет: чаще всего встречается «on jl pantai», 3 раза.
- **Udara / Organic Ocean.** Во второе предложение перенесено «open daily to guests and visitors»: оно стало концом первого. Слова те же.
- **Обход ловушки A5.** Три приложения («Swarna, a spa and wellness…», «Yema Kitchen, a café and restaurant…», «7AM Bakers… outlet, a bakery and…») давали ложный «X, Y and Z». Их переписали иначе, и WARN по карточкам не вырос: 10 → 10.
- **`best_for`.** Шли серии из 3–7 соседних карточек на «A …». Разорваны в 16 строках: ashe, baked-pererenan, bar-vera, billy-ho, copenhagen, dandelion, e-a-r-t-h, face-therapy, flex, home-by-chef-wayan, neighbourhood-food-berawa, revolver, riviera-cafe-cemagi, samesa, secret-spot, victory.
  - Приём: множественное число или неисчисляемое без артикля («Late dinners…», «Brunch, coffee or…»), либо вперёд выносится еда или люди («Japanese small plates and cocktails over a long lunch…», «Tables that mix meat, seafood and vegan eaters…»).
  - Теперь подряд не больше двух «A …».
  - Дублей с другими `wave-db/*.csv` и `wave-spa/*.csv` нет.
- **Как правили.** Скрипт на модуле csv. Сначала проверено, что файл читается и записывается обратно байт в байт. Менялась только колонка `after` (61 строка: 45 `why_its_here` и 16 `best_for`). В `reason` дописана пометка прохода. `before` не изменён.
- **Ворота:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/canggu.csv` → 148 cards · 0 FAIL · batch problems 0, exit 0. `canggu.gate.csv` не обновлялся.

## Решение основательницы 08.10

Правило 1: фраза, которая противоречит данным самой карточки (видимым часам, адресу, другому полю) или дате, которая уже прошла, удаляется из `after`. Взамен ничего не пишется. Правило 2: заявления «первый / единственный / крупнейший», награды, рейтинги и слава без названного источника в записи удаляются. Остаётся только то, что уже подано как слова самого заведения.

Правка затронула 9 карточек. Изменено 8 существующих строк `after`, добавлено 5 новых строк (`source` = `founder decision 2026-10-08`). Колонка `before` не тронута. Причина каждой правки дописана в `reason`.

- **saya-club** (правило 1). Видимые часы: пн–вс 06:00–22:00.
  - `why_its_here`: удалено «open around the clock».
  - `best_for`: новая строка, правка живого текста. Удалено «at any hour, including the middle of the night». Осталось одно слово «Training»: его можно оставить, но поле стало пустым по смыслу.
- **sia-grill-and-seafood-bar** (правило 1). Видимые часы начинаются в 09:00.
  - `why_its_here`: удалено «From midday to 11pm daily». Оборот снят целиком, без него фраза не держится.
  - `not_for`: новая строка, `action null`. Поле «Breakfast — the kitchen opens at midday.» целиком держится на «midday», после удаления ничего не остаётся.
- **mia-asian-modern-inspired-restaurant-and-bar** (правило 1). В `why_its_here` удалено «from evening»: с пн по чт место открывается в 12:00. Фраза «into the early hours at weekends» осталась. Выходные в видимых часах не показаны, так что ей противоречить нечему.
- **bonito-restaurant** (правило 1). `not_for`: новая строка, `action null`. «Lunch — current hours are dinner-only, Monday to Saturday.» противоречит часам с 12:00, и после удаления от поля ничего не остаётся.
- **bottega-italiana** (правило 1). Видимые часы: пн–пт 11:00–13:00.
  - `why_its_here`: новая строка. Удалено предложение «The Berawa location ("Origano") on Jl. Pantai Berawa runs all day.» Без сказуемого «runs all day» в нём не остаётся утверждения. Описание сократилось до 17 слов.
  - `best_for`: удалено «through the day, or a casual dinner». Осталось «Families and groups sharing pasta».
  - `not_for`: новая строка, удалено «, last order 11:30pm».
- **yuki-canggu** (правило 1). В `why_its_here` удалено «, and bookings are essential»: `not_for` той же карточки говорит «reservations are recommended». Убрана более сильная из двух формулировок.
- **the-avocado-factory** (правило 1). В `why_its_here` удалено «Berawa-area»: адрес — Jl. Pantai Batu Mejan.
- **brunch-club-pererenan** (правило 1). В `why_its_here` удалено «and lists Berawa as reopening mid-2026»: дата уже прошла.
- **mosto-berawa** (правило 2). В `why_its_here` удалено «Billed as Indonesia's first natural wine bar». Источник в записи не назван, а «billed as» не приписывает слова самому заведению.

**Ворота:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/canggu.csv` → `148 cards · 0 FAIL · batch problems 0`. `canggu.gate.csv` не обновлялся.

**Перед применением.**
- Пять новых строк взяли `before` из `canggu.input.json`. `check-cards` подтвердил, что он совпадает с текстом краула. Перед записью нужно сверить его с живой строкой, как и остальные.
- Для двух строк с `action null` (`sia-grill-and-seafood-bar`, `bonito-restaurant`, поле `not_for`) `build-copy-sql.mjs` выдаст `set not_for = null`.

**Сознательно не тронуто:**
- **the-avocado-factory, «bills itself as South East Asia's first avocado bar».** В `after` утверждение уже подано как слова самого заведения, поэтому по правилу 2 его можно оставить. Но в живом тексте стоит «Billed as», без указания, кто так говорит. Приписка «itself» появилась при переписывании. У Mosto та же формулировка удалена. Если формулировку «bills itself» не принимать, нужно удалить и это утверждение: «…at The Avocado Factory, a cafe.»
- **murmur-restaurant-lounge, «the room stays open to 2am».** В видимых часах пн–пт до 23:59, а суббота и воскресенье не показаны. При этом 23:59 у других карточек обозначает закрытие после полуночи: у 12 Urban так записана полночь, у MiA — «1am at weekends». Противоречие не доказано.
- **obsidian-gym-bali-canggu, «top-tier kit»** (`best_for`). Это оценка качества, а не первенство, награда или рейтинг. Под правило 2 не попадает. Решение за основательницей.
- **ju-bali** («Umalas» при адресе Jl. Bumbak Dauh, Kerobokan). **deus-ex-machina**, **pizza-fabbrica** и **samadi-bali**: улица названа точнее, чем широкое `where` («Canggu/Batu Bolong/Berawa»). Прямого противоречия адресу нет.
- **bottega-italiana, «Origano».** Вопрос о названии ушёл вместе с удалённым предложением. Сами видимые часы 11:00–13:00 выглядят неправдоподобно. Это вопрос к сбору фактов, а не к тексту.
- **Дубли и служебные пометки** (пункты 9–13 списка выше): sa-mesa / samesa, jungle-padel ×2, desa-seni-yoga, the-shampoo-lounge / HairShop, therapy ×2. Ими занимается отдельная очередь.
- **lowcal-cheatery-and-bar.** Перекос акцента в описании — вопрос стиля, а не правило 1 или 2.
- **Цены, часы и happy hour в прозе** (449k, 1100K IDR и др.) уходят в очередь сбора фактов.
- the-avocado-factory — после проверки убрано и «bills itself as South East Asia's first avocado bar» (правило 2). Самоназвание без источника, так же как у Mosto.
