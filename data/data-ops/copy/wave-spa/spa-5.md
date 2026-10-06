# wave-spa, часть 5: переписаны карточки спа Убуда, 2026-10-05

Это черновик. В базу ничего не записано. Решение по каждой строке принимается в колонке `decision` файла `spa-5.csv`. Все правки на ступени 2: пересказан собственный текст карточки, факты заново не проверялись. Поэтому `last_verified_at` не трогать.

## Итог

- **Вход:** 45 карточек из `spa-5.input.json`, все в Убуде.
- **Изменено:** 45 карточек, 97 полей:
  - `why_its_here`: 45;
  - `best_for`: 45;
  - `not_for`: 7. Это все карточки, где поле было заполнено: Hesa, Kayumanis, Mango Tree, Pengosekan, Riverside, Royal Kirana, the spa@kamandalu.
- **Без изменений:** 0 карточек. Пустые `not_for` не заполнялись: начальной цены в остальных записях нет.
- **Проверка:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-5.csv` завершилась с кодом 0.
  - 45 карточек, 0 FAIL, 0 проблем на уровне пакета.
  - fact-diff: PASS по всем карточкам.
  - Дублей и кластеров почти одинаковых текстов нет.
- **WARN:** было 54, стало 0.
- **Начала `why_its_here`:** ни одно сочетание первых трёх слов не встречается больше двух раз.
- **Длина `why_its_here`:** от 20 до 41 слова, в среднем 31.
- **Сверка дублей.** `best_for` и `not_for` сверены с CSV в `wave-spa/` и `wave-db/`. Одно совпадение нашлось у Lemuria со `spa-3.csv` и переписано.
- **Join в `not_for`** у семи карточек везде разный: because, точка, as, двоеточие, since, точка, тире.

## Что удалено

- **«published».** Убрано во всех 45 карточках вместе с формулой «The published treatment list runs to N items —». Это происхождение списка, а не факт о месте.
- **Заготовка «a long reset».** Убрана из `best_for`. Длительность сохранена словами, например «three hours» или «four and a half hours».
- **«Luxury»** из названия пакета Royal Kirana «Luxury Romance Retreat for Couple». Это слово-оценка нашим голосом. Цена 2,650K IDR сохранена.
- **«Authentic»** из названия Swatma «Authentic Balinese Healing Session». Это тоже оценка. Осталось «Balinese healing session», 350K IDR.
- **«Signature»** у The Kasih Spa. Это мягкое слово из списка A10. Пересказано как «the spa's own Balinese massage».
- **«2024» и повтор «(60 min)»** в строке меню The Faces World.
- **«Balinesse»** (с опечаткой) у tlaga spa. Правильное «Balinese» fact-diff отклоняет: в записи этого слова нет. Поэтому процедура названа просто «healing massage».
- **Название Nikmatul choiroh SeMassage (Vaccinated)** в тексте не используется. Карточка начинается с «A massage studio in Ubud…».
- **Перенос длительности в `why_its_here`.** У lumiere spa bali, Parina Spa Ubud и the spa@kamandalu длительность перенесена из `best_for`, а `best_for` построен на процедуре из карточки. Всё названо в `reason`.

## Сомнительные факты (не исправлялись)

- **«Booked the same day».** Это заготовка генератора, свидетельства в записи нет. Смысл пересказан, не удалён. Карточки: Hotel Spa massage, INKA, Mountain Wellness, Nikmatul, Pengosekan, Royal Spa & Wellness, Sanggraloka, Swatma, Sanctoo.
- **«Tired feet after a day of walking».** Заготовка стоит там, где среди названных процедур нет ничего для ног: Gratia, Green Tara, Jero, Parina Spa, Parina Spa Ubud, Riverside, StarChild, Tjampuhan. Смысл пересказан.
- **Kappa Senses Ubud.** Это «resort spa», но часовой традиционный массаж стоит 90K IDR. Для курорта цена подозрительно низкая. В тексте написано «is listed at».
- **Возможный дубль.** `parina-spa-ubud` и `parina-spa-ubud-ubud`: в обеих по 10 процедур, но разные процедуры, каналы записи и длительности. Возможно, это одно место.
- **Цены, похожие на пересчёт из валюты:**
  - 1025K у Kayumanis;
  - 1215K у Mango Tree;
  - 643K у Pengosekan, где строка называется просто «Massage Services» и длительности нет.
- **Категории под вопросом:**
  - Four Seasons Spa и Lemuria Spa by Arya Arkananta Resort & Spa помечены как «day spa»;
  - Mountain Wellness Resort near Ubud помечен как «wellness spa», цены и способа записи нет;
  - Hotel Spa massage похож на служебную метку, а не на название.
- **Serayu Spa at The Kayon Resort.** В списке 104 процедуры, включая стрижку. Похоже, сюда попали услуги курорта. Часовая рефлексология стоит 725K IDR.
- **Nikmatul choiroh SeMassage (Vaccinated).** Пометка «(Vaccinated)» сидит в самом названии и в slug. Названа одна процедура из пяти.
- **Строчные названия** lumiere spa bali, tlaga spa и the spa@kamandalu оставлены как в записи. Поэтому предложения не начинаются с них.

## Проверка 2 (скептик), 2026-10-06

Скептик подтвердил двенадцать замечаний: восемь по отдельным карточкам и четыре по шаблонности всего пакета. Ниже то, что исправлено в `spa-5.csv`. Менялись только колонки `after` и `reason`; к `reason` дописано «skeptic pass 2026-10-06: …» с прежней формулировкой. Колонки `before`, `action`, `source` и `decision` не тронуты. Пункты «Booked the same day» и «Tired feet after a day of walking» в разделе «Сомнительные факты» выше больше не действуют: заготовки не пересказаны, а убраны.

### Итог правки

- **Изменено:** 71 строка в 44 карточках. Не тронута только Lemuria.
  - `best_for`: 35;
  - `why_its_here`: 35;
  - `not_for`: 1 (Pengosekan).
- **Проверка:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-5.csv` завершилась с кодом 0.
  - 45 карточек, 0 FAIL, 0 проблем на уровне пакета.
  - fact-diff: PASS по всем карточкам. Новые записи в «dropped» только двух видов: заготовка «Tired» и максимальная длительность списка у 9 карточек (см. ниже).
  - WARN по-прежнему 0. Первые версии Kaveri и StarChild дали A7 (предложение длиннее 25 слов) и были разбиты на два предложения.
  - Длина `why_its_here`: от 19 до 39 слов, в среднем 30. 19 слов только у The Sanctoo, текст не менялся.
  - Ни одно сочетание первых трёх слов `why_its_here` не повторяется.
- **Сверка дублей.** Ни одно новое значение не совпадает дословно со значениями в остальных CSV и JSON под `data/data-ops/copy/` (`wave-db`, `wave-spa/spa-1…4, 6`, `pilot`, `stage1`).

### Сдвиг факта: склеены «пары» и максимальная длительность

1. **Восемь карточек.** В заготовке было два отдельных факта: «в списке есть процедура для пар» и «процедуры идут до N минут». Переписанный текст сделал из них парный сеанс на N часов. Теперь факты снова раздельно.

   | Карточка | Было | Стало |
   |---|---|---|
   | Four Seasons Spa | Couples who want up to four hours of treatments together | Couples, or anyone with up to four hours for a session |
   | Gadsden | Couples in Ubud with up to two hours for lomi lomi or Swedish | A massage as a couple, or a session of up to two hours |
   | Jhagat | Two hours of treatments as a couple | Couples, or a foot massage and reflexology |
   | Sang Spa | Four hours at the spa as a couple | Couples, or a long visit of up to four hours |
   | Royal Kirana | Couples who want to make a day of it, up to seven hours | A couple massage, or a spa day of up to seven hours |
   | The Kasih Spa | Up to three and a half hours, booked as a couple | A couple treatment, or a visit of up to three and a half hours |
   | The Samaya | Two and a half hours at a resort spa, alone or with a partner | A couple massage, or a resort spa visit of up to two and a half hours |
   | Kappa Senses | A couple massage, with as long as three hours to spend | A facial or a couple massage at a resort spa |

   - У Gadsden lomi lomi и Swedish остались в `why_its_here`. Они больше не привязаны к парному формату и к двум часам.
   - Jhagat: `best_for` теперь держится на процедурах для ног, о которых вся карточка. 120 минут отброшены и записаны как «dropped».
   - The Kasih Spa: в `why_its_here` парной процедуры нет. Поэтому в `best_for` она названа как процедура, а не как тип гостя.
   - The Samaya: вместо подсказанного «on your own» написано «a resort spa visit». Признак «для одного» в карточке не назван, и в spa-4 скептик снимал его как приписанный.
   - **Kappa Senses** в списке скептика не было, но там та же склейка. Исправлена в этом же проходе, 180 минут отброшены.

### Pengosekan, `not_for`

2. Было «Yoga and massage on a shoestring, because the massage services cost 643K IDR». Причина говорила об одной строке меню и не объясняла йогу. Стало «Yoga or massage on a shoestring, because the list starts at 643K IDR». Порог списка восстановлен.
   - В `why_its_here` строка 643K теперь названа как отдельная позиция: «lists an item called massage services at 643K IDR». Раньше её можно было прочитать как цену любого массажа.

### Nikmatul, `why_its_here`

3. Было «A massage studio in Ubud with five treatments on its list, a body scrub among them.» Это фраза без глагола, та же формула категории с добавленным «A». Стало «This Ubud massage studio lists five treatments, with a body scrub among them, and takes bookings on its own website.» Название с «(Vaccinated)» по-прежнему не используется. «with» добавлено, чтобы уложиться в 20 слов по стандарту.

### Мотив «уставшие ноги после ходьбы»

4. Было 19 значений `best_for` из 45, ходьба названа в 11 из них по дословному поиску. Теперь ходьбы нет ни в одном значении. Ноги или рефлексология упомянуты в 8, и везде это процедура из карточки, а не прогулка по Убуду.
   - Мотив оставлен как процедура: Mahamaya, Melati, Nusa, Putri (массаж ног), Reflexology Ubud, Serayu, Shinto, Terakota, The Faces World, the spa@kamandalu, Taksu (педикюр).
   - Shinto не менялся: «A foot meridian massage for sore feet, or three hours at the spa» и так построен на процедуре, без ходьбы.
   - У Gratia, Green Tara, Jero, Parina Spa, Parina Spa Ubud, Riverside, StarChild и Tjampuhan процедур для ног нет. `best_for` собран из их собственных процедур. Пустым поле не оставлено.
   - Сняты и межфайловые почти-дубли: Putri «Legs and feet that have walked all day» и Mahamaya «Feet that walked Ubud all day».
   - У девяти карточек отброшена максимальная длительность из заготовки «a long reset»: Gratia, Green Tara, Jhagat, Kappa, Mahamaya, Parina Spa, Serayu, StarChild, The Faces World. Иначе «пара/процедура + N часов» стало бы следующим шаблоном. Длительность упоминается в `best_for` 14 раз из 45, было 23. В `reason` у каждой: «dropped: 'up to N minutes'».

### Заготовка «booked the same day»

5. Было 9 значений одной формы с разными идиомами: «when the mood strikes», «didn't plan ahead», «the same day you think of it», «fixed up that day», «for later today», «spur of the moment», «the same day you ask for it», «on the day you want it», «at short notice». Свидетельства в записи нет. Теперь таких значений 0. Заготовка убрана, а не пересказана.

   | Карточка | Стало |
   |---|---|
   | Hotel Spa massage | Thai massage or shirodhara at a resort spa |
   | INKA Ubud Spa | A traditional massage, a facial or a manicure |
   | Mountain Wellness Resort | Ayurvedic treatments or a body scrub near Ubud |
   | Nikmatul | A body scrub at a massage studio |
   | Pengosekan Spa Hotels | Yoga, or a Balinese or traditional massage |
   | Royal Spa & Wellness | A spa package, or a facial |
   | Sanggraloka Ubud | Aromatherapy or a body treatment |
   | Swatma | Yoga, or a Balinese healing session |
   | The Sanctoo | An anti-aging facial in Ubud |

   - INKA и Royal Spa & Wellness: в карточке не сказано, что процедуры можно взять одной записью или что пакет включает уход за лицом. Поэтому они перечислены через «or».
   - Сняты межфайловые почти-дубли: Sanctoo «at short notice» (spa-6, spa-2, spa-1) и Nikmatul «fixed up that day» (spa-4).

### Скелет `why_its_here`

6. Формулу категории убрали, но вместо неё получился один скелет. Переписаны 35 текстов, только перестановкой и сменой оборотов, без новых фактов. Счёт до и после по CSV одним и тем же поиском. У скептика числа немного другие (25, 24, 12, 30), потому что он считал вручную:

   | Признак | Было | Стало |
   |---|---|---|
   | вставка «, a day/wellness spa in Ubud,» и подобные | 29 | 10 |
   | «An hour of X costs/is NK IDR» | 18 | 2 |
   | «from X to Y» | 12 | 1 |
   | последнее предложение о записи | 39 | 23 |

   - **Цена.** Теперь её пишут по-разному: «X is NK IDR for an hour», «charges NK IDR for», «is priced at», «is listed at», «takes an hour and costs». У Jero, Jhagat и Kappa разные схемы.
   - **«from…to».** Оставлен только у Serayu: «from traditional massage and spa packages to haircuts». Это настоящий разброс. У Gratia и остальных теперь простой список через «including» или «include».
   - **Запись.** У 13 карточек канал записи перенесён в первое предложение или внутрь фразы: Hesa, Hotel Spa massage, INKA, Jero, Kaveri, Mahamaya, Nusa, Parina Spa Ubud, Reflexology Ubud, Royal Spa & Wellness, Shinto, Taksu, Tegal Mesari. У 8 фраза о записи убрана совсем: Gratia, lumiere, Mango Tree, Riverside, StarChild, The Sacred River, the spa@kamandalu, tlaga. Канал записи из этих карточек больше не виден в тексте. Если основатель хочет его вернуть, это отдельное решение. В `reason` записано «dropped: the booking clause».
   - **«among them».** После первой правки этот оборот вырос до 12 и стал новым повтором. Оставлен в 6 текстах.
   - Не менялись: Four Seasons, Gadsden, Lemuria, Mountain Wellness, Royal Kirana, Sang Spa, Swatma, Terakota, The Samaya, The Sanctoo.

### Что осталось

- **Пакет по-прежнему заполняет одни слоты.** Название, категория, число процедур, две-три процедуры, цена, канал записи. Пересказом это не исправить, других фактов в записи нет. Это тот же вопрос к основателю, что и в spa-1: выпускать ли спа-тексты ступени 2 вообще.
- **Форма `best_for` «X, or Y».** Почти все новые значения перечисляют одну-две процедуры из карточки. Стиль пилота такую форму допускает, но на одной странице Убуда это заметно. Чтобы её разнообразить, нужны факты о моменте или госте, а их в записи нет.
- **Сомнительные факты** из первой части не тронуты: Kappa 90K, пересчёт цен Kayumanis, Mango Tree и Pengosekan, категории Four Seasons, Lemuria и Mountain Wellness, 104 процедуры у Serayu, возможный дубль Parina.
