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
