# Волна wave-db: Ubud и север/восток. Журнал

2026-10-05. Это черновик: в базу ничего не записано, колонка `decision` пустая. Источник — `ubud-north-east.input.json` (89 карточек: Ubud 86, Munduk 1, Amed 1, Lovina 1). Режим — переписывание стиля по собственному тексту записи (rung 2). Факты заново не проверялись, `last_verified_at` не трогается.

## Итог
- **Изменено 87 карточек, 205 строк**: `why_its_here` 82, `best_for` 81, `not_for` 42.
- **Без изменений 2**: `kemukus-restaurant-kuwarasan-a-pramana-experience` и `sakti-dining-room-fivelements-retreat-bali`. Это шаблон «Restaurant in X, Ubud.», и кроме названия и улицы в записи ничего нет. Ждут сбора фактов, как Air Cafe в пилоте.
- **`why_its_here` оставлен как есть** (простой и конкретный) у 5 карточек, у них правился только `best_for`: como-shambhala, dala-spa-beauty, nasi-ayam-kedewatan, ubud-gym, warung-semesta.
- **`best_for` оставлен** у 6: kojin, la-portal, norii, secret-garden, shichirin, taksu-yoga.
- **Новый `not_for` один**: pinstripe-bar-ubud. Отрицание «not a full sit-down meal» перенесено из `best_for`, новых фактов нет. У остальных 39 карточек `not_for` остался пустым, как у Ji в пилоте: заполнять его — отдельная задача, а не стилевая волна.
- **Гейт** `check-cards.mjs … --report ubud-north-east.gate.csv`: 87 PASS, 0 FAIL, 0 batch problems, exit 0.
  - Стилевые WARN по изменённым полям: 77 → 0.
  - Ни один новый текст не совпадает дословно с полем другой карточки в крауле 28.09.

## Что удалено (названо в `reason` каждой строки)
- **Рейтинги и превосходные степени без источника**:
  - одна генераторная семья из 5 бранч-карточек: «Ubud's clearest / easiest / safest / most polished / strongest … breakfast/brunch» (alchemy, milk-and-madu, suka, watercress, zest);
  - «one of the easiest waterfalls on the island» (Tegenungan), «Ubud's most enduring restaurant» (Casa Luna), «one of Ubud's most exclusive…» (Mandapa), «one of Ubud's most celebrated resorts» (Sacred River), «Ubud's largest and best-known» (Yoga Barn), «one of the largest steam rooms in Bali» (Mango Tree).
- **Популярность и репутация**: «well-known» ×5, «Popular» (Jaens), «famous» (Locavore NXT), «popularised» (Bebek Bengil), «known for» ×7, «Award-winning» (Svaha), «globally recognized» (Room4Dessert), «internationally recognised» (Zuna), «institution» ×2.
- **Хайп и штампы**: «landmark» ×2, «elevated» в best_for (Hujan), «tucked-away», «hidden», «set in / set among / sat among» ×7, «authentic» ×8, «experience» ×12, «atmosphere», «stylish», «curated», «blending», «fragrant».
- **Мягкие слова**: «signature», «proper», «reliable», «serious».
- **Тик «clear decision»**: Akar, Room 4 Dessert, Clear Café, Watercress.
- **Длинные записи сокращены до 20–45 слов**:
  - Four Seasons Fitness: 87 → 45 слов. Выпали площади 536/75 кв. м, бренды тренажёров, PEMF, Fit Bar, раздевалки.
  - Westin Fitness: 66 → 44 слова. Выпали детали спа: 5 кабинетов, 4 павильона, джакузи.
  - COMO Fitness: 50 → 44 слова.
  - Всё выпавшее перечислено в `reason`, вернуть можно из `before`.
- **Смысловые сдвиги, которые сторож фактов не видит.** Я поймал и исправил их в своих же черновиках:
  - Karsa: масла относились ко всем процедурам, а не только к Reiki;
  - Jaens: бесплатный трансфер привязан к full-day packages;
  - Sang Spa: 2008 — год основания, а не обоих филиалов;
  - Ibu Rai: «opened as a restaurant in 1992», а не галерея;
  - Laka Leke: «solo» и «quick walk-in» — две разные группы.

## Сомнительные факты (в тексте не исправлены)
1. **gajah-putih-ubud.** `not_for` (без изменений) говорит «the menu starts at 400K IDR», но 400K — цена Pairing Wine Malam, то есть винного сопровождения, а не минимальный чек.
2. **monkey-bar-bali.** Район записи — Amed, а в тексте Bella Kita в холмах Klungkung.
3. **sakti-dining-room-…** В тексте «Ubud», адрес — Banjar Baturning, Mambal, Abiansemal (Badung). У kemukus в тексте «Jalan Cinta, Ubud», а адрес — Penusuan, Tegallalang.
4. **sayuri-healing-food.** В тексте «in central Ubud», а адрес — Jl. Sukma Kesuma, Peliatan.
5. **Похоже на дубли записей**:
   - alchemy-yoga-and-meditation-center-ubud и alchemy-yoga-meditation-center;
   - room-4-dessert и room4dessert;
   - taksu-yoga и taksu-yoga-ubud.

   Тексты разведены, чтобы гейт не считал их почти одинаковыми, но вопрос о дублях — к данным, не к тексту.
6. **Оставлено в тексте, нужна проверка**:
   - Locavore NXT — «ranked among Asia's 50 Best Restaurants»;
   - Gelato Secrets — «first Bali shop … 2009»;
   - Shichirin — «first … on the island»;
   - Kojin — «billed as the first irori grill in Bali»;
   - Spring Spa — «largest outlet»;
   - Jaens — «'affordable luxury'»: оставлено как формулировка самого спа.
7. **Удалено, но может вернуться с источником**:
   - Bebek Bengil — «popularised crispy duck»;
   - Mango Tree — самая большая парная;
   - Svaha — награды;
   - Zuna — «internationally recognised»: если это аккредитация, её можно назвать прямо.
8. **Вне текста.** Контекстное поле часов у трёх карточек Taksu — 09:00–12:00. Похоже на время одного занятия, а не на часы работы. Передать в data-ops.

## Начала и швы
- **`why_its_here`**:
  - первые слова: A 31, The 11, An 6, This 2, Chef 2;
  - ещё 30 карточек начинаются по-своему: с названия («Akar is…», «Bebek Bengil is…»), с человека («Food writer Janet DeNeefe…», «Ibu Rai, born in 1925…»), с места («Up in the Klungkung hills…», «In the middle of Jalan Monkey Forest…»), с факта («Open since 1986…», «Established in 2008…», «Named after Kojin…»);
  - ни одно начало из трёх слов не повторяется;
  - формула «<Категория> in X» ушла у Gajah Putih, Pinstripe, Putri, Taksu Yoga, Kojin, La Portal и Norii;
  - тире в описаниях нет.
- **Швы `not_for`** (по всем 50 карточкам, где он есть): двоеточие 17, because/since 14, тире 10 (из них 7 — живые поля без изменений), точка 8, без шва 1 (alchemy — не правился). Ни у трёх соседних карточек подряд нет одного и того же шва, в каждом поле не больше одного тире.
- **Короткие `why_its_here`** (11–14 слов, гейт пишет заметку): coco-nails, mandapa, moksa, sacred-river, ubud-beauty-salon, ubud-pilates, zuna. В записи больше ничего нет, нужны факты первого уровня (rung 1).

## Как применять
После `ДА` в `decision`: `scripts/copy/build-copy-sql.mjs --changes data/data-ops/copy/wave-db/ubud-north-east.csv …` по порядку из `../DB-APPLY-NEXT-SESSION.md`. `before` = текст краула 28.09; где база с тех пор изменилась, строка уйдёт в HOLD.
