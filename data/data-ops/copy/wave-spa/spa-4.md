# wave-spa, часть 4: переписаны карточки спа, 2026-10-05

Это черновик, в базу ничего не записано. Решение по каждой строке принимается в колонке `decision` файла `spa-4.csv`. Все правки на ступени 2: пересказан собственный текст карточки, факты заново не проверялись. Поэтому `last_verified_at` не трогать.

## Итог

- **Вход:** 45 карточек из `spa-4.input.json`: Sanur 3, Seminyak 27, Sidemen 5, Ubud 10.
- **Изменено:** 45 карточек, 97 полей:
  - `why_its_here`: 45;
  - `best_for`: 45;
  - `not_for`: 7. Это все карточки, где поле было заполнено: Atman, No.1 Wellness, SPA BALI, The Seminyak Beach Resort & Spa, The Spa at The Samaya, Alaya Ubud, Chatraka.
- **Без изменений:** 0 карточек. Пустые `not_for` (38) не заполнялись: начальной цены в этих записях нет.
- **Проверка:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-4.csv` завершилась с кодом 0.
  - 45 карточек, 0 FAIL, 0 проблем на уровне пакета.
  - fact-diff: PASS по всем карточкам.
  - Каждое сочетание первых трёх слов `why_its_here` встречается один раз.
- **WARN:** было 51, стало 0. Из них 45 давало длинное тире формулы, ещё 6 давало второе тире в `best_for` вида «Couples — …; a long reset — …».
- **Длина `why_its_here`:** от 16 до 41 слова, в среднем 30. Короче 20 слов только Lattranaya (16): ни цены, ни способа записи в записи нет, поэтому текст не дописывался.
- **Сверка дублей.** Точных совпадений нет ни с краулом 2026-09-28, ни с CSV в `wave-db/`, ни с `spa-1`–`spa-3`. Близкие по началу `best_for` и `not_for` из соседних частей разведены.

## Что удалено

- **Слово «published».** Убрано во всех 45 карточках вместе с формулой «The published treatment list runs to N items —».
- **Хвост «the list includes a couple treatment».** Он сказан один раз: либо в `why_its_here`, либо как «a couple treatment» или «couple massage» в `best_for`. Подходящий тип гостя «пары» не потерян ни в одной карточке.
- **«Tired feet».** В трёх карточках слова «tired feet» убраны: в карточке не названо ни одной процедуры для ног. Это Spa at Peppers, Ssamaya, Lattranaya. Момент «после дня ходьбы» оставлен и привязан к процедуре из списка. В остальных карточках смысл пересказан, в `reason` это названо.
- **Повтор длительности в названии позиции.** У Anandinii и Pelangi было «Balinese Massage 60 minutes … for 60 minutes». Теперь длительность сказана один раз.
- **Невидимый символ.** Zero-width space после «Balinese Massage» в живом тексте One Eleven Luxe Spa в новый текст не перенесён. В `before` он сохранён.
- **Регистр.** Названия позиций, записанные капсом, приведены к обычному регистру: Serenity Couple Escape, Dala Couple Ritual, Bali Foot Spa Ritual, traditional Balinese massage. Название заведения SPA BALI оставлено как в записи. «Asha Wellness& Spa» записано с пробелом: «Asha Wellness & Spa».
- **Название Banyan Tree Spa Macau** в тексте не повторено. Причина в разделе ниже.

## Сомнительные факты (не исправлялись)

- **Banyan Tree Spa Macau (Ubud).** В названии Макао, в списке есть «hair styling». Похоже, к убудской записи привязано меню Banyan Tree в Макао. Нужно проверить источник до публикации.
- **«Tired feet after a day of walking».** Это заготовка генератора. В 8 карточках среди названных процедур нет ничего для ног: Body & Soul, Executive Bali Massage, One Eleven, Spa at Peppers, Ssamaya, The Lotus Spa, Lattranaya, Bali TAO Center. Возможно, такая процедура есть в полном списке, но в карточке её не видно.
- **«Booked the same day».** Тоже заготовка, свидетельства о записи в тот же день нет. Она стоит у 11 карточек: Deanna, Hotel Indigo, Jari Menari, No.1 Wellness, The Care, The Seminyak Beach Resort, The Shampoo Lounge, Wellness by The Legian, Wapa di Ume, Bali Spirit, Banyan Tree. Смысл пересказан, не удалён.
- **Grand Seminyak Spa.** Час рефлексологии стопы стоит 605K IDR, у соседей 130–250K. Возможна ошибка разбора меню или это цена пакета.
- **Lattranaya.** Помечена как «wellness spa», но в списке только Reiki, йога и sound healing. Массажа и цены нет.
- **Категории под вопросом:**
  - отели и виллы помечены как спа: Hotel Indigo, The Seminyak Beach Resort & Spa, Pelangi Villa Sidemen, Bali Spirit Hotel and Spa, Alaya Ubud. В тексте сказано «спа при отеле/вилле», но сама категория не проверялась;
  - Anandinii Organic Garden & Kitchen по названию ресторан, а помечен как «wellness centre»;
  - у Wapa di Ume из 4 позиций названа только йога.
- **Atman Spa Kerobokan.** В названии Kerobokan, а район в записи Seminyak.
- **Executive Bali Massage.** 90 минут балийского массажа за 300K IDR, это дешевле часа у большинства соседей. Правдоподобно, но стоит проверить.
