# wave-spa · spa-3: переписывание спа-карточек (2026-10-05)

Список изменений: `spa-3.csv`, 94 строки. Вход: `spa-3.input.json`, 45 карточек (Kuta & Legian 1, Lovina 5, Munduk 8, Nusa Dua 26, Sanur 5).
Режим: пересказ собственных фактов карточки (ступень 2). Факты заново не проверялись. В базу ничего не записано.
Тексты `before` совпадают с краулом `docs/audits/2026-09-28-web/places.csv` байт в байт по всем 94 строкам.

## Гейт

`node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-3.csv` →
`45 cards · 0 FAIL · batch problems 0`, код выхода 0. Гейт запускался после 15, 30 и 45 карточек и ещё раз после последних правок.
WARN после переписывания: 0 на каждой карточке. До переписывания было 1–2: A4 (тире), а у royal-orchid и samuh-beach ещё по одному.
Одинаковое начало из трёх слов встречается не больше двух раз: «the spa at» ×2, «bali relaxing resort» ×2.

## Изменено / не изменено

- Изменены все 45 карточек: why_its_here 45, best_for 45, not_for 4 (frangipani, heavenly, kayumanis, samuh-beach).
- Без изменений не осталось ни одной карточки.
- У остальных 41 карточки not_for пуст. Новые not_for не придумывались: цена в why_its_here относится к одной процедуре и не говорит, с какой суммы начинается список.
- Связки в not_for разные: because (frangipani), одно тире (heavenly), двоеточие (kayumanis), точка (samuh-beach).
- Тонкие карточки, которые не дописывались: jiwa-spa (21 слово), sanctua-bedugul, ayu-spa-salon, bali-relaxing-resort-spa (по 23 слова; у последней нет ни цены, ни способа записи), heavenly-spa (24 слова). У bali-relaxing-resort-and-spa нет длительности и способа записи, их тоже не добавляли.

## Заметные удаления

- Слово «published» убрано со всех 45 карточек. Слово «items» заменено на «treatments».
- **samuh-beach:** удалено «THAI BEEF SALAD is 90K IDR». Это цена блюда, а в формуле она стояла как цена процедуры.
- royal-orchid: из названия процедуры убран хвост «– 60». Сами 60 минут в тексте остались.
- koa-spa: метка «Customise your massage with our add ons» переписана как «massage add-ons».
- frangipani: «Frangipani Quick Couple Massage» записано как «the quick couple massage».
- Названия сокращены там, где хвост дублировал район: «Bali Dream Spa» (без « - Lovina»), «Chi Massage & Luxury Spa» (без « Nusa Dua Bali»). «Adi Spa Healing healthy and Wellness Nusa Dua» сокращено до «Adi Spa».
- best_for: заготовка «a long reset» убрана везде. Длительности записаны словами (two hours, three hours, five-hour и т. п.). У earthbound и mahony длительность перенесена в why_its_here. У bali-dream «couple treatment» перенесено из best_for в why_its_here.
- Слово «tired» в 14 карточках не повторено дословно: оно перефразировано (walked-out, sore, worn out, had enough) или подразумевается. В reason для каждой карточки сказано, что именно сделано.

## Сомнительные факты (не исправлялись)

- **The Ritz-Carlton Spa, Amelia Island** стоит в Nusa Dua. Amelia Island находится во Флориде, так что это, вероятно, чужая запись или чужое меню (58 позиций).
- **Возможные дубли:**
  - Три записи вокруг Bali Relaxing Resort: bali-relaxing-resort-and-spa-nusa-dua (7 позиций, foot massage 350K без длительности), bali-relaxing-resort-spa (4 позиции) и the-u-spa-by-bali-relaxing-resort (14 позиций).
  - bamboo-spa-at-munduk-moding-plantation и munduk-moding-plantation: один курорт, но 16 позиций против 9 и разные способы записи (сайт и WhatsApp).
  - putu-bali-spa-home-care: эта же запись с тем же списком (5 позиций, foot massage 200K за 60 минут, WhatsApp) есть в spa-2 как Legian, а здесь она стоит в Munduk. По названию это, похоже, выездной сервис.
- **Место:** Mondo Surf & Lifestyle Village (surf village) записан как массажная студия в Munduk, это горы. Sanctua Bedugul тоже стоит в Munduk. Yes Spa Bali из района Kuta & Legian генератор поставил в «Legian».
- **samuh-beach:** not_for «A resort-spa setting — this is a neighbourhood price list» выведен, судя по всему, из той же цены салата (90K). Смысл я сохранил, поменял только связку, но факт стоит проверить.
- **Заготовка «booked the same day»** на трёх карточках: munduk-moding-plantation, ayu-spa-salon, heavenly-spa. Кроме самой заготовки, в записи нет ничего, что подтверждало бы запись в тот же день. У heavenly-spa из 11 позиций названа только yoga, хотя тип карточки «day spa».
- **Цены:**
  - kayumanis: relaxing massage 1025K IDR за 60 минут.
  - frangipani: список «начинается» с quick couple massage за 800K. Скорее всего, это цена на двоих, и тогда not_for про бюджет может быть неточным.
  - griya-santrian: reflexology 443K. chi-massage: foot reflexology 380K.
  - koa-spa: 200K за 30 минут, но это цена допуслуги (add-on), а не процедуры.
  - bali-relaxing-resort-and-spa: цена без длительности.
- **Длительности:** earthbound до 360 минут. 3d-relaxation, frangipani и sekar-jagat до 300 минут.
- **Пары:** у rnd, santhika, 3d-relaxation, royal-orchid, the-ritz-carlton, blissful-senja и bali-dream «couple treatment» был только в best_for, в трёх названных процедурах его нет.
- **Метки вместо процедур:** «Spa Package», «Recovery», «Detox Treatment», «Body Treatment», «Hair Treatment». Это категории генератора. У sofitel-spa-with-clarins всего 5 позиций для отельного спа, список, возможно, неполный.

## Проверка 2 (скептик), 2026-10-06

Скептик подтвердил 15 замечаний. Три касаются сдвига факта (frangipani `not_for`, MIM, Ayu), восемь касаются склеенных фактов («пары + N часов», «ноги + N часов»), четыре пакетных относятся к шаблонам. Ниже то, что исправлено в `spa-3.csv`. Менялись только колонки `after` и `reason`: к `reason` дописано «check 2 (skeptic) 2026-10-06: …». Колонки `before`, `action`, `source` и `decision` не тронуты. Использованы только факты из `spa-3.input.json`.

### Итог правки

- **Изменено:** 68 строк в 42 карточках.
  - `why_its_here`: 31;
  - `best_for`: 36;
  - `not_for`: 1 (frangipani).
- **Без изменений:** heavenly-spa, munduk-moding-plantation, sofitel-spa-with-clarins.
- **Проверка:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-3.csv` завершилась с кодом 0.
  - 45 карточек, 0 FAIL, 0 проблем на уровне пакета.
  - fact-diff: PASS по всем карточкам.
  - WARN по-прежнему 0 на каждой карточке.
  - Промежуточные версии не прошли fact-diff: «Sessions …» в начале предложения читалось как имя собственное, «under one roof» как число, «Choosing …» как имя. Эти слова заменены.
- **Сверка дублей** по `wave-db` и `wave-spa` (скрипты `xwave.mjs` и `near.mjs` из общего scratchpad, `dedupe/`):
  - дословных совпадений 0;
  - пар с Jaccard ≥ 0,7 у spa-3 не осталось.
  - Первая версия frangipani `best_for` («A couple massage booked over WhatsApp») дословно совпала с svaha-spa (spa-4). У mondo и nikko нашлись близкие пары в clean-b и spa-4. Все три переписаны.

### Сдвиг факта

1. **frangipani, `not_for`.** Было «Couples on a budget, since even the quick couple massage costs 800K IDR». Факт о нижней границе всего списка стал фактом об одной процедуре, предупреждение сузилось до пар, а «even» намекал, что другие процедуры дешевле. Стало «Anyone on a budget, because every treatment here costs 800K IDR or more». Это снова факт о нижней границе списка, и адресован он всем.
   - Вариант скептика «A budget massage, because the list starts at 800K IDR» не взят. 2026-10-05 его уже меняли из-за дубля с andre-bali-spa (spa-1). Кроме того, он почти совпадает с «A budget massage: the list starts at 770K IDR» (padma, clean-b, Jaccard 0,73) и «…, since the list starts at 618K IDR» (bali-tropic, clean-a).
   - Сомнение «800K может быть ценой на двоих» в текст не внесено. Оно остаётся в разделе «Сомнительные факты» выше, его нужно проверить.
2. **MIM, `why_its_here`.** «fill the 26-treatment list» → «lists 26 treatments, traditional massage, facials and detox treatments among them». Три примера больше не выдаются за весь список.
3. **Ayu, `best_for`.** «A facial or a haircut fitted in on the day» → «A facial or a haircut in Sanur». Заявление «в тот же день» снято. На стрижки оно не распространяется.

### Склеенные факты

Заготовка держала «в списке есть процедура для пар» и «процедуры идут до N минут» как два отдельных факта. Переписанный текст склеил их в одну фразу «пары + N часов».

- **Где склеено:** 3d-relaxation, royal-orchid, samuh-beach, zahra, blissful-senja, rnd. У massage-sanur, tunjungsari и munduk-tentrem так же склеены «ноги + N часов».
- **Как исправлено:** длительность перенесена в `why_its_here` отдельным предложением или отдельной частью предложения, не рядом с парной процедурой. «Пары» тоже перенесены в `why_its_here` там, где их там не было: rnd, santhika, 3d, royal-orchid, the-ritz-carlton, blissful-senja.
- **Что теперь в `best_for`:** один факт карточки. Например, 3d: «Getting a manicure and a traditional massage at the same spa». royal-orchid: «Shirodhara, or the royal traditional Balinese massage». blissful-senja: «Deep tissue massage in Sanur». massage-sanur: «Anyone who wants a hot stone massage». Ножной процедуры в этой карточке нет, поэтому «ноги» сняты.
- **Длительность в `best_for`** осталась у трёх карточек: samantha, sekar-jagat, sofitel. У них нет «пар» и «ног», так что склеивать не с чем.

### Шаблоны (пакет)

- **«Ноги после ходьбы» в `best_for`:** было 27 из 45, стало 3. Остались yes-spa («A foot and leg massage for tired legs»), mahony («The Munduk foot ritual when your feet have had a long day») и chi («Foot reflexology when the walking is over»). Во всех трёх фраза начинается с названной процедуры.
  - 4-грамма «a day of walking» во всём `spa-3.csv` встречается 0 раз.
  - «Walked-out» убрано: у tunjungsari и bali-relaxing-resort-spa.
  - Остальные `best_for` опираются на свой факт карточки: lomi lomi (karma), four-hands (mondo), flower bath (bali-relaxing-resort-spa), add-ons (koa), Fresha (kayumanis), shirodhara (serene), pedicure (griya) и т. д.
- **«Couples + N часов»:** «Couples» открывает 2 `best_for` из 45, было 10: bali-dream и the-ritz-carlton. Длительность списка (максимум) есть в 3 `best_for` из 45, было 24. Ещё 3 называют длительность одной процедуры: rnd («an hour»), the-u-spa («45-minute»), tunjungsari («an hour of shiatsu»).
- **Открытие `why_its_here`:**
  - формула «<Name> is a <type> in <District> with N treatments, from X to Y» больше не встречается;
  - «from … to …» и «range from» по трём примерам: 0, было 13. Вместо них «including», «among them», «also on the list»;
  - порядок сломан: у 12 карточек цена процедуры стоит в первом предложении (yes-spa, jaya, mahony, chi, ijen, kayumanis, merusaka, sekar-jagat, the-u-spa, tunjungsari, blissful-senja, griya). У 8 переписанных карточек первым идёт список процедур (rnd, sanctua, 3d, royal-orchid, samuh-beach, the-ritz-carlton, ayu, massage-sanur), у 4 впереди способ записи (bali-dream, putu, mybalihealing, koa).
- **Фраза о записи:** «own website/site» осталось на 5 карточках, было 27. Фраза о записи по-прежнему стоит в конце у большинства карточек. Вперёд или в середину она перенесена у bali-dream, putu, mybalihealing, koa, kayumanis и ayu.

### Что осталось открытым

- **Заготовка «same day»** осталась на munduk-moding-plantation («A same-day Balinese massage at the resort») и heavenly-spa («Same-day yoga at the Westin in Nusa Dua»). Скептик их не отмечал, поэтому они не правились. Основание у них такое же слабое, как было у Ayu. Нужно решение: снять заготовку или оставить `HOLD`, пока запись в тот же день не подтверждена.
- **Цена frangipani.** Остаётся сомнение «800K за пару?» (см. «Сомнительные факты»).

## Решение основательницы 08.10

Правила: 1 — противоречие данным самой карточки или прошедший срок убирается; 2 — неподтверждённые заявления о престиже убираются. Менялись только `after` и `reason`, к `reason` дописано «2026-10-08 founder rule …». Новых строк нет. Гейт: `45 cards · 0 FAIL · batch problems 0`.

- **munduk-moding-plantation-munduk, `best_for`** — убрано «same-day» (правило 1). Это заготовка генератора, в записи нет ничего о записи в тот же день. Стало «A Balinese massage at the resort».
- **heavenly-spa-by-westin-nusa-dua, `best_for`** — убрано «Same-day» (правило 1), по той же причине. Стало «Yoga at the Westin in Nusa Dua».

Так закрыт пункт «Заготовка "same day"» из раздела «Что осталось открытым».

Правило 2: в `after` нет ни одного заявления о престиже.

Сознательно не тронуто:
- **The Ritz-Carlton Spa, Amelia Island в Nusa Dua.** Это вопрос, своя ли это запись: возможен дубль или чужая запись. Решается отдельно.
- **Возможные дубли** Bali Relaxing (три записи), Munduk Moding / Bamboo Spa и putu-bali-spa-home-care решаются отдельно.
- **Место и тип.** Mondo Surf в Munduk, Sanctua Bedugul в Munduk, Yes Spa в «Legian». Текст совпадает с полем district, расхождение внутри самой записи.
- **samuh-beach, `not_for`** «A resort-spa setting. Prices here are neighbourhood prices». Его основание, цена салата 90K, из `why_its_here` уже снято. Но в карточке нет данных, которым поле противоречит, так что правило 1 к нему не применимо. Поле держится целиком на этом основании. Снять его можно только очисткой поля (`action null`), а это выходит за рамки правки `after`/`reason`. **Нужно решение основательницы.**
- **frangipani 800K** (возможно, цена на двоих), а также kayumanis, griya-santrian, chi, koa и цена без длительности у bali-relaxing — это цены, они идут в очередь сбора фактов. Порог «800K or more» не противоречит цене в тексте.
- **heavenly-spa, `not_for`, 500K.** В карточке нет более дешёвой цены, которая бы ему противоречила.
- **Мотив ходьбы** у yes-spa, mahony и chi. Ножная процедура названа в карточке, мотив опирается на запись.
- **Длительности, пары и метки вместо процедур** не противоречат карточке и не трогались.
- samuh-beach-nusa-dua — `not_for` очищено целиком (правило 1, решение после проверки агента): «neighbourhood prices» держалось только на цене салата, которой в тексте уже нет.
