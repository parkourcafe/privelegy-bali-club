# wave-spa, часть 1: переписаны карточки спа, 2026-10-05

Это черновик. В базу ничего не записано. Решение по каждой строке принимается в колонке `decision` файла `spa-1.csv`. Все правки на ступени 2: пересказан собственный текст карточки, факты заново не проверялись. Поэтому `last_verified_at` не трогать.

## Итог

- **Вход:** 45 карточек из `spa-1.input.json` (Amed, восток Бали, Denpasar, Tabanan, Canggu).
- **Изменено:** 45 карточек, 94 поля:
  - `why_its_here`: 45;
  - `best_for`: 45;
  - `not_for`: 4. Это все карточки, где поле было заполнено: Andre, Korra, Maja, Nikara.
- **Без изменений:** 0 карточек. Пустые `not_for` не заполнялись: начальной цены в остальных записях нет.
- **Проверка:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-1.csv` завершилась с кодом 0.
  - 45 карточек, 0 FAIL, 0 проблем на уровне пакета.
  - fact-diff: PASS по всем карточкам.
  - Дублей и кластеров почти одинаковых текстов нет.
  - Ни одно сочетание первых трёх слов не повторяется.
- **WARN:** было 46, стало 1.
  - 45 из 46 приходились на длинное тире в формуле.
  - Остался один A10 у `mello-spa-canggu`: в названии процедуры «Mello Signature Massage» есть слово «signature». Он был и до правки.
- **Длина `why_its_here`:** от 20 до 41 слова, в среднем 30.
- **Сверка дублей.** Совпадений нет с краулом 2026-09-28 и с CSV в `wave-db/` и `wave-spa/`.
  - Одно совпадение с уже лежащим `spa-2.csv` (`not_for` у Nikara) найдено и переписано.

## Что удалено

- **Слово «published».** Убрано во всех 45 карточках вместе с формулой «The published treatment list runs to N items —». Это происхождение списка, а не факт о месте.
- **Название «Bali Paradise Massage»** (`beautyfulspa-canggu`). Слово «paradise» не проходит правило H1 даже внутри названия из меню. Цена и длительность сохранены: «A 90-minute massage from the list costs 270K IDR».
- **«Tired feet» как формулировка.** В 7 карточках смысл перенесён в момент, например «after a day of walking», «a day on your feet» или «worn out». Карточки: Palm Garden, Nusa Indah, Serene, Espace, Nomads Haus, Jaya, Manori. В `reason` это названо.
- **Мелочи** (в `reason` каждой строки):
  - повтор «(60 minutes) … for 60 minutes» у Hotel Uyah;
  - повтор «Hydrating Facial and Facial» у Maja;
  - категория «Nails», которая повторяет название, у Only Nails;
  - вторая половина названия «Foot Serenity – Foot Reflexology» у Hati Thai.
- **Опечатка.** Исправлено «aromatheraphy» → «aromatherapy» у Espace.

## Сомнительные факты (не исправлялись)

- **Andre Bali Spa.** `not_for` говорит, что прайс начинается с 850K IDR. Но в списке есть маникюр и педикюр, а 850K стоит часовой массаж. «Начальная цена» скорее всего посчитана только по массажам.
- **Bali Dream Villa Resort.** Единственная цена в списке процедур — «Sweet Couple Dinner», 1500K IDR. Это ужин, не процедура. Похоже, генератор взял строку из пакетного меню курорта.
- **«Booked the same day».** Это заготовка генератора, свидетельства о записи в тот же день в записи нет. Она стоит в `best_for` у 14 карточек (Blue Earth, Candi, Nirjhara, RPS, Spa Spa Bali, Suenyo, Air Seseh, Alam, AMO, Beautyfulspa, Cocoon, COMO, Ecosfera, Only Nails). Смысл пересказан, не удалён.
- **«Tired feet after a day of walking».** Тоже заготовка. Она стоит у карточек, где среди названных процедур нет ничего для ног: Amed Roda, Palm Garden, Aaron, Bali Healing Touch, Daura, Harmony, Jaya, Nusa Indah, Serene, Ameline, Bali Serene Nature, Blue Karma, Glo, Korra, Nomads. Возможно, процедура для ног есть в полном списке, но в карточке этого не видно.
- **Категории под вопросом:**
  - Blue Earth Village и Nomads Haus помечены как «day spa», хотя по названию это скорее жильё;
  - у Candi Beach Resort из 5 «процедур» названа только йога;
  - у Air Seseh Recovery Club названа только сауна.
- **Цены, похожие на пересчёт из валюты:** 847K IDR у Jaya Spa («Puri Sense Body Massage»), 505K IDR у Fajar. Длительность у Fajar не указана.
- **Maja.** При пяти процедурах прайс начинается с 1080K IDR. Это правдоподобно, но проверить стоит.
- **Only Nails Bali.** fact-diff выдаёт предупреждение POLARITY: слово «Only» в названии читается как отрицание. Это ложное срабатывание, текст в порядке.

## Проверка 2 (скептик), 2026-10-05

Скептик подтвердил шесть замечаний: три по отдельным карточкам и три по шаблонности всего пакета. Ниже то, что исправлено в `spa-1.csv`. Колонки `before`, `action`, `source` и `decision` не тронуты. Пункты «Booked the same day» и «Tired feet after a day of walking» в разделе «Сомнительные факты» выше больше не действуют: заготовки не пересказаны, а убраны.

### Итог правки

- **Изменено:** 39 строк в 35 карточках.
  - `best_for`: 35;
  - `why_its_here`: 4.
- **Проверка:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-1.csv` завершилась с кодом 0.
  - 45 карточек, 0 FAIL, 0 проблем на уровне пакета.
  - fact-diff: PASS по всем карточкам. Из отброшенного в заметках только заготовка «Tired».
  - WARN не выросли: остался один A10 у Mello.
- **Сверка дублей.** Ни одно новое значение не совпадает дословно со значениями в `wave-db/*`, `wave-spa/spa-2…6`, `pilot` и `stage1`.

### По карточкам

1. **Korra.** Было «A two-hour treatment for feet that have done a day of walking». Двухчасовая процедура оказалась привязана к ногам, хотя в карточке нет ничего для ног. Стало «A body scrub or a facial, with treatments running up to two hours». Заготовка про ноги убрана.
2. **Beautyfulspa.** Было «booked a few hours ahead». Срок записи придуман, в записи его нет. Стало «A 90-minute massage or aromatherapy». `reason` теперь описывает этот текст, а не старую формулировку.
3. **Ecosfera.** Заготовка «same day» была расширена на маникюр и педикюр, чтобы обойти проверку дублей. Стало «A traditional massage, or a manicure and pedicure, at the hotel spa in Canggu». Заготовка убрана, а не расширена.

### По пакету

4. **Мотив «уставшие ноги после ходьбы».** Было 25 значений `best_for` из 45. Скептик насчитал 24, двадцать пятое у Jaya: «a long day exploring». Стало 9.
   - Мотив оставлен только там, где в списке есть процедура для ног или рефлексология: Alala, Hotel Uyah, Aquaria, Bloo, The Green Spa, Beach House, Espace, Hati Thai, Manori.
   - У Alala, Aquaria, Bloo, The Green Spa и Manori переписана формулировка, чтобы «a day of walking» не повторялось. Дословно эта фраза теперь не встречается ни разу (было 14).
   - У остальных 16 `best_for` собран из процедур самой карточки: Amed Roda, Palm Garden, Aaron, Andre, Bali Healing Touch, Daura, Harmony, Jaya, Nusa Indah, Serene, Ameline, Bali Serene Nature, Blue Karma, Glo, Korra, Nomads. В `reason` у каждой: «dropped: 'tired feet after a day of walking'».
   - Andre: в списке есть педикюр, но в списке скептика для мотива его нет. Педикюр не процедура для уставших ног, поэтому мотив снят.
5. **Скелет «[процедура] (in [район]), booked the same day».** Было 14 значений, стало 0. Синонимы тоже убраны: same-day, on the day, for today, at short notice, that day, a few hours ahead.
   - Карточки: Blue Earth, Candi, Nirjhara, RPS, Spa Spa Bali, Suenyo, Air Seseh, Alam, AMO, Beautyfulspa, Cocoon, COMO, Ecosfera, Only Nails.
   - Выбрано «переписать», а не «отложить до свидетельств»: у каждой карточки есть хотя бы одна названная процедура, место или канал записи. Если основатель предпочитает отложить, достаточно поставить `HOLD` в `decision`. Тогда на сайте останется старая заготовка, и это тоже надо учесть.
6. **`why_its_here`: фраза генератора «the venue's own site».** Заменена у четырёх карточек:
   - Nusa Indah: «the resort's website»;
   - Blue Karma: «its own site»;
   - COMO: «its website»;
   - Nomads Haus: «the Nomads Haus site».

### Нужно решение основателя

- **Выпускать ли спа-тексты ступени 2 вообще.** Все 45 `why_its_here` по-прежнему заполняют одни и те же слоты: название или категория, число процедур, две-три процедуры, затем цена и канал записи. Пересказом это не исправить, других фактов в записи нет. Пилот придержал именно этот шаблон (`templates_not_rewritten`, alma-spa-canggu: «Evidence first»). По content-style §9 пакет шаблонный, сколько бы ни менялся порядок слов.

### Что осталось

- **Повтор длительности.** Самая длинная процедура («up to two hours», «a three-hour session» и подобное) названа в 15 значениях `best_for` из 45. Скептик это не отмечал, но это следующая повторяющаяся форма. Её источник тоже заготовка «A long reset».
- **Другие файлы волны.** Мотив ходьбы и скелет «same day» остаются в `spa-2…spa-6`: по счёту скептика, около 98 значений с ходьбой. Эти файлы ведут другие исполнители, нужна та же правка.
- **Сомнительные факты из первой части** не тронуты: Andre 850K, ужин у Bali Dream, Jaya 847K, Fajar 505K, Maja, категории Blue Earth, Nomads, Candi и Air Seseh.
- **Как fact-diff читает текст.** Слово с заглавной буквы в начале `best_for`, которого нет в записи, считается новым именем. Так были отклонены «Sore…», «Choosing…» и «Keeping…». «One» считается числом, а «not» меняет полярность. Начинать `best_for` лучше со слова из самой карточки.
