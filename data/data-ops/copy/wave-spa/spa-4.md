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

## Проверка 2 (скептик), 2026-10-06

Скептик подтвердил пять замечаний: три о сдвиге факта, одно о шаблоне и одно о приписанном признаке. Ниже то, что исправлено в `spa-4.csv`. Менялись только колонки `after` и `reason`. Колонки `before`, `action`, `source` и `decision` не тронуты. Пункт «Booked the same day» в разделе «Сомнительные факты» выше больше не действует: заготовка не пересказана, а убрана.

### Итог правки

- **Изменено:** 17 строк в 17 карточках.
  - `best_for`: 16;
  - `not_for`: 1 (Chatraka).
- **Проверка:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-4.csv` завершилась с кодом 0.
  - 45 карточек, 0 FAIL, 0 проблем на уровне пакета.
  - fact-diff: PASS по всем карточкам. Из отброшенного в заметках только «120 minutes» у Terra (см. п. 5).
  - WARN не выросли: по-прежнему 0.
  - Первая версия SPA BALI («The Serenity Couple Escape for two, …») не прошла fact-diff: «two» читается как новое число. Слова «for two» убраны.
- **Сверка дублей.** Ни одно новое значение не совпадает дословно со значениями в остальных CSV и JSON под `data/data-ops/copy/` (`wave-db`, `wave-spa/spa-1…3, 5, 6`, `pilot`, `stage1`).

### Сдвиг факта: склеены два факта заготовки

В заготовке было два отдельных факта: «в списке есть процедура для пар» и «процедуры идут до N минут». Переписанный текст склеил их, и максимальная длительность стала читаться как длительность парной процедуры. Теперь факты снова раздельно.

1. **Alaya Ubud.** Было «Couples who can give it two and a half hours». Это расходится с `why_its_here` той же карточки: Dala Couple Ritual длится 90 минут. Стало «Couples booking the Dala Couple Ritual, or a visit of up to two and a half hours».
2. **Ortus Wellness.** Было «Couples in Seminyak with a two-hour window». Стало «Couples, or a session of up to two hours».
3. **SPA BALI.** Было «Couples, with treatments that stretch to six hours». В `why_its_here` Serenity Couple Escape длится 150 минут. Стало «The Serenity Couple Escape, or a day of treatments up to six hours».

### Сдвиг факта: Chatraka, `not_for`

4. Было «Couples hoping to spend less than 900K IDR, which is where prices start.». Порог цены для всего списка был привязан к парам. Из-за этого 900K читалось как цена на двоих, а `not_for` противоречил `best_for` («Booking a couple massage while in Ubud»). Стало «A budget massage; 900K IDR is the lowest price at Chatraka Spa.». Дословного совпадения с Nikara (spa-1), из-за которого текст меняли 2026-10-05, нет.

### Приписанный признак «для одного»

5. **Terra Spa & Wellness и Spa Bali Moon.** В карточке не сказано, что двухчасовая процедура для одного человека. Скептик заметил и общую форму: «пары + два часа для себя».
   - Terra: было «The couple treatment, or a solo session of up to two hours». Стало «The couple treatment, or Thai or deep tissue massage». Факт «до 120 минут» отброшен: это максимум списка, а не тип гостя. Если оставить его отдельно, повторилась бы форма Ortus и Spa Bali Moon. В `reason` это записано как «dropped».
   - Spa Bali Moon: было «Two hours to yourself, or a massage with your partner». Стало «A couple massage, or up to two hours of treatments».

### Шаблон «[процедура] + [глагол] + same day»

6. Было 11 значений `best_for` одной формы. Менялся только глагол: arranged, booked, sorted out, fixed up, «the same day», «on the day», «that day». У The Care и Bali Spirit был тот же смысл другими словами: «without planning days ahead», «booked the day you want it». Свидетельства о записи в тот же день в карточках нет. Теперь таких значений 0. Заготовка убрана, а не пересказана. `best_for` собран из процедур самой карточки, канал записи из `why_its_here` не повторяется.

   | Карточка | Стало |
   |---|---|
   | Deanna Spa & Café | A cream bath or a facial |
   | Hotel Indigo Bali Seminyak Beach | Acupressure or a body scrub at the hotel spa |
   | Jari Menari Spa | Traditional massage at a Seminyak day spa |
   | No.1 Wellness | Body treatments and traditional massage |
   | The Seminyak Beach Resort & Spa | A facial or body treatment at the resort spa |
   | The Shampoo Lounge | Scalp and hair care, or an Ayurvedic treatment |
   | Wellness by The Legian | Yoga at The Legian, or a spa package |
   | Wapa di Ume Sidemen | Yoga in Sidemen |
   | Banyan Tree Spa Macau | Facials and hot stone treatments |
   | The Care Day Spa | Deep tissue or hot stone massage in Seminyak |
   | Bali Spirit Hotel and Spa | Aromatherapy, or a traditional Balinese massage |

   - The Care и Bali Spirit в списке слагов этого замечания не стояли, но в его тексте названы среди одиннадцати. Поэтому они исправлены в этом же проходе.
   - У Jari Menari и Wapa di Ume в карточке названа только одна процедура. `best_for` держится на ней и на типе места или районе. Пустым поле не оставлено: процедура названа в самой карточке.
   - Banyan Tree: название заведения в тексте по-прежнему не повторяется. Вопрос про меню из Макао (см. «Сомнительные факты») остаётся открытым.

## Решение основательницы 08.10

Правила: 1 — противоречие данным самой карточки или прошедший срок убирается; 2 — неподтверждённые заявления о престиже убираются. Менялись только `after` и `reason`, к `reason` дописано «2026-10-08 founder rule …». Новых строк нет. Гейт: `45 cards · 0 FAIL · batch problems 0`.

Заготовка «tired feet after a day of walking» убрана у всех восьми карточек, где в записи нет процедуры для ног (правило 1, заготовка без опоры в записи):

- **body-soul-massage-seminyak, `best_for`** — убрано «after a long day on foot». Стало «A two-hour session».
- **executive-bali-massage-seminyak, `best_for`** — убрано «or for feet that have walked all day». Стало «A massage as a couple».
- **one-eleven-luxe-spa-seminyak, `best_for`** — убрано «for legs that walked Seminyak all day». Стало «A sports massage».
- **spa-at-peppers-seminyak-seminyak, `best_for`** — убрано «once the day's walking is done». Стало «A Balinese massage».
- **ssamaya-day-spa-seminyak, `best_for`** — убрано «after a day on foot». Стало «Shiatsu or a facial in Seminyak».
- **the-lotus-spa-seminyak, `best_for`** — убрано «when your feet are tired». Стало «Up to 160 minutes of treatments».
- **lattranaya-sidemen, `best_for`** — убрано «after a long day of walking». Стало «Reiki or sound healing».
- **bali-tao-center-ubud, `best_for`** — убрано «Feet worn out from walking, or». Стало «A couple treatment».

Правило 2: в `after` нет ни одного заявления о престиже.

Сознательно не тронуто:
- **Мотив ходьбы** у Sari, The Nest Beachside, The Nest Boutique, Asha, Bodyworks, Coolcontours, Grand Seminyak, Jazb, Kapha, Alam Shanti, Bali Botanica, Bali Wellness и Balian Springs. У каждой в карточке названа рефлексология, массаж или уход для ног, так что мотив опирается на запись. «Booked the same day» снята ещё проверкой 2.
- **Banyan Tree Spa Macau** (возможно, меню из Макао) — вопрос, своя ли это запись. Решается отдельно, источник надо проверить до публикации.
- **Grand Seminyak 605K и Executive 300K за 90 минут** — это цены, они идут в очередь сбора фактов.
- **Пороги в `not_for`** у Atman, No.1, SPA BALI, The Seminyak Beach Resort, The Samaya, Alaya и Chatraka. Сверено с ценами в тексте карточек, противоречий нет.
- **Lattranaya без массажа, Anandinii и отели или виллы, помеченные как спа** — вопрос категории, решается отдельно.
- **Atman Spa Kerobokan в Seminyak.** Текст совпадает с полем district, расхождение есть между названием и районом внутри записи.
