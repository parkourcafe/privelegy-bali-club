# wave-spa, часть 6: переписаны карточки спа, 2026-10-05

Черновик, в базу ничего не записано. Решение по каждой строке принимается в колонке `decision` файла `spa-6.csv`. Все правки на ступени 2: пересказан собственный текст карточки, факты заново не проверялись, поэтому `last_verified_at` не трогать.

## Итог

- **Вход:** 43 карточки из `spa-6.input.json`: Ubud 5, Uluwatu (Bukit) 38.
- **Изменено:** 43 карточки, 89 полей: `why_its_here` 43, `best_for` 43, `not_for` 3 (все заполненные: Villa Sonia Ubud, Anantara Spa, ATMOS BodyLab).
- **Без изменений:** 0 карточек. Пустые `not_for` (40) не заполнялись: начальной цены в этих записях нет.
- **Проверка:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-6.csv` завершилась с кодом 0: 43 карточки, 0 FAIL, 0 проблем пакета, fact-diff PASS везде. Все сочетания первых трёх слов `why_its_here` разные.
- **WARN:** было 53, стало 3. Оставшиеся 3 дают слово «Signature» в названиях позиций меню (Ubud Sari Signature Massage, Signature Royal Massage у Karma Spa, Signature Foot Massage у Piccolina Bali); в живом тексте оно было и раньше.
- **Длина `why_its_here`:** от 20 до 41 слова, в среднем 31. Тонкие карточки (Supernatural Wellbeing, Wrong Gym, Spring Spa Bingin, The Istana Spa) не дописывались.
- **Дубли:** точных совпадений нет ни внутри части, ни с `spa-1`–`spa-4`, `wave-db`, `pilot`, ни с живым краулом 2026-09-28.

## Что удалено

- **Слово «published»** во всех 43 карточках, вместе с формулой «The published treatment list runs to N items —».
- **Ярлык заготовки «a long reset»** везде, где он был; длительность сохранена (120 минут → «two hours» и т. п.).
- **«Tired feet»** в 8 карточках, где в тексте не названо ни одной процедуры для ног: Ubud Sari Spa, Bali Bliss Massage, Our Spa & Boutique Bali, Professional Massage Uluwatu, Rika Beauty & Spa, The Spa, Xin Spa Beauty, Zahra Spa Uluwatu. Момент «после дня ходьбы» оставлен и привязан к процедуре из списка.
- **Повтор длительности** у salty face Bali («60 Minute Balinese Massage … for 60 minutes»): теперь сказано один раз.
- **Регистр:** SIGNATURE ROYAL MASSAGE, FOOT MASSAGE, FOOT MASSAGE / REFLEXOLOGY приведены к обычному виду. «Nail Gel Color Hand or Foot» у The Elysian записано как «gel colour on hand or foot nails» (британское «colour»).
- **Название:** у Holiday Inn Resort Baruna Bali - Tea Tree Spa спа и отель названы раздельно; у Xin Spa Beauty Pecatu Uluwatu Bali в тексте «Xin Spa Beauty in Pecatu». Все слова взяты из названия в записи.

## Сомнительные факты (не исправлялись)

- **Villa Sonia Ubud.** В качестве цены стоит «Balinese Deluxe room is 3491K IDR», то есть цена номера, а не процедуры. `not_for` «the list starts at 3341K IDR», скорее всего, тоже цена номера: похоже, в спа-меню попал прайс виллы. В тексте номер назван номером; до публикации нужно проверить источник.
- **The Wellness Spa.** Час массажа стоп за 605K IDR. Ровно такая же цена за час рефлексологии стоп была у Grand Seminyak Spa в `spa-4`. У большинства соседей по этой части процедуры для ног стоят 115–210K, дороже только Anantara Spa (750K). Возможно, это одна и та же ошибка разбора или цена пакета.
- **«Booked the same day».** Это заготовка генератора, свидетельства о записи в тот же день нет. Стоит у 11 карточек: Villa Sonia, ATMOS BodyLab, Bali Surfing Camp, Bali Yoga, Flex & Flow, Tea Tree Spa, LaiA Spa, Rose Petal, salty face Bali, Supernatural Wellbeing, Wrong Gym. Смысл пересказан, не удалён.
- **Категории под вопросом:**
  - Ubud Home Massage Service: по названию выездной массаж, а помечен как «wellness spa»;
  - Bali Surfing Camp: сёрф-лагерь, помечен как «wellness centre»;
  - Pandawa Cliff Estate и Sohamsa Ocean Estate: по названию виллы или поместья, помечены как спа;
  - Bali Yoga: в списке йога-студии есть маникюр;
  - The Istana Spa: из 8 позиций дневного спа названа только ледяная ванна.
- **ATMOS BodyLab.** Позиция «Recovery» непонятна: это процедура, пакет или раздел меню.
- **Без способа записи:** Vita Healing Massage Spa, Shiki Spa, Spring Spa Bingin, Supernatural Wellbeing, Win Bali Spa, Wrong Gym. Без длительности у цены: D’Nailbar, Bali Bliss Massage, OAZA Uluwatu, Piccolina Bali. Ничего не добавлялось.

## Проверка 2 (скептик), 2026-10-06

Скептик подтвердил семь замечаний, все по `best_for`. Ниже перечислено, что исправлено в `spa-6.csv`. Менялись только колонки `after` и `reason`, в `reason` к каждой правке дописано «skeptic pass 2026-10-06: …». Колонки `before`, `action`, `source` и `decision` не тронуты. Строка выше в разделе «Что удалено» («Момент «после дня ходьбы» оставлен и привязан к процедуре из списка») больше не действует: в карточках без процедуры для ног момент ходьбы теперь убран.

### Итог правки

- **Изменено:** 46 строк в 25 карточках.
  - `best_for`: 25;
  - `why_its_here`: 21. Каждая из этих правок переносит в текст самую долгую процедуру, которая раньше стояла в `best_for`: «the longest treatment runs N» или «Treatments run up to N». Остальной текст не менялся.
- **Проверка:** `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-6.csv` завершилась с кодом 0.
  - 43 карточки, 0 FAIL, 0 проблем на уровне пакета.
  - fact-diff: PASS везде. Ни одна длительность не потеряна. Из прежних заметок «dropped» ушли `PROPER:Couples` у Anantara и The Elysian, новых не появилось.
  - WARN: как и раньше, 3, все про «Signature» в `why_its_here`. В первой версии «Signature» было ещё в двух `best_for` (Ubud Sari, Karma), и WARN выросли. Эти `best_for` переписаны.
  - Отклонены промежуточные формулировки: «for two» (fact-diff читает «two» как новое число), «Sore …», «Parents …» и «Partners …» (заглавное слово, которого нет в карточке, fact-diff читает как имя собственное).
- **Длина `why_its_here`:** все в пределах 31–45 слов.

### 1. The Spa: «tired feet» осталось вопреки списку выше

Было «Tired feet in the Bukit, with two hours to give them». The Spa стоит в списке карточек без процедуры для ног, где «tired feet» якобы снято, а в тексте оно было. Кроме того, 120 минут читались как двухчасовая процедура для ног. Стало «Hot stone or a spa package in the Bukit». В `why_its_here` добавлено «The longest treatment runs two hours».

### 2–4. Длительность прикреплена не к той процедуре

2. **Win Bali Spa.** Было «Foot reflexology after walking, with sessions up to two hours». В карточке рефлексология идёт 60 минут. Стало «Foot reflexology after a long day on foot». Два часа перенесены в `why_its_here` как самая долгая процедура.
3. **Vita Healing Massage Spa.** Было «Cupping or a couple treatment, with sessions up to 165 minutes». Стало «Cupping, or a couple treatment». 165 минут перенесены в `why_its_here`.
4. **The Elysian.** Было «A three-hour reset, solo or with a partner»: слово-заготовка «reset» и трёхчасовая процедура для пары, которой в карточке нет. Стало «Gel nails and a facial, or a treatment as a couple». Три часа перенесены в `why_its_here`.

### 5. Момент «после дня ходьбы» без процедуры для ног

Ходьба убрана из всех карточек, где не названа процедура для ног. `best_for` построен на том, что в карточке действительно есть:

- Bali Bliss Massage: «Couples, or anyone choosing aromatherapy over deep tissue»;
- Ubud Sari Spa: «A stiff neck and shoulders, or a body scrub in Ubud» (в списке есть neck & shoulder);
- Professional Massage Uluwatu: «A hot stone massage, or an hour of traditional Balinese massage»;
- Xin Spa Beauty: «Nails or a traditional massage in Pecatu»;
- Zahra Spa Uluwatu: «A family visit, with a body massage for the child» (в списке есть Child Body Massage);
- Rika Beauty & Spa: «Booking as a couple, or an hour of Balinese massage»;
- Our Spa & Boutique Bali: «A facial and hair treatment, or a couple booking».

Ходьба или «day on foot» осталась только в 11 карточках, где есть процедура для ног или рефлексология: AYANA, Luhur, Shiki, Spa Shell, Spring Spa, Resting Koala, Sohamsa, Piccolina, D’Nailbar, Win, Pandawa. Слово «walk» теперь стоит в 9 `best_for` из 43, а было в 18. У Luhur, D’Nailbar и Win формулировки разведены.

### 6. Схема «<X>, or <длительность>»

Длительность не может быть всем `best_for`: это не человек и не момент. Во всех перечисленных карточках она перенесена в `why_its_here` как самая долгая процедура. «A four-hour block of treatments» (Body Studio) и «Five hours of treatments» (Ubud Sari) превращали самую долгую процедуру в блок из нескольких. Теперь сказано «the longest treatment lasts four hours» и «the longest treatment runs five hours».

- OAZA Uluwatu: «A four-hand massage, or a facial in the Bukit»;
- Ubud Village Resort & Spa: «A Balinese or traditional massage at the resort in Ubud»;
- Fresh Beauty Lounge: «Facials and head massage in the Bukit». Первое предложение `why_its_here` вышло длинным (WARN A7), поэтому длительность встала во второе;
- Body Studio Bali: «A body wrap or an ice bath in the Bukit»;
- Luhur Spa: «A foot massage when the walking is done, or an hour of head massage»;
- Shiki Spa: «A foot massage when walking has worn you out, or lashes and waxing»;
- Senses Spa at Biu Biu: «A couple massage at the resort, or 50 minutes of reflexology»;
- Karma Spa: «A couple treatment, or time in the sauna»;
- D’Nailbar: «Lashes and brows, or a foot massage after walking»;
- Ubud Home Massage Service: «A couple treatment in Ubud, arranged over WhatsApp»;
- The Istana Spa: «An ice bath at a Bukit day spa»;
- The Resting Koala: «The Foot Release after a day of walking, or a Balinese massage». Скептик эту карточку не называл, но «or two hours off your feet» — та же схема.

В `best_for` длительность осталась в четырёх местах, и везде она относится к своей процедуре: часовой head massage у Luhur, часовой Balinese massage у Professional Massage и Rika, 50 минут рефлексологии у Senses. «Or» по-прежнему стоит во многих `best_for`, но альтернативы «<процедура> или <число часов>» больше нет.

### 7. Приписанное «on your own / alone / solo»

В карточке нигде не сказано, что долгая процедура для одного человека. Это условие убрано везде:

- Anantara Spa: было «You and a partner, or two and a half hours on your own». Стало «Couples, or deep tissue and Balinese massage». 150 минут перенесены в `why_its_here`;
- The Wellness Spa: было «A partner treatment, or four hours on your own». Стало «A partner treatment, or waxing and a facial». 240 минут перенесены в `why_its_here`;
- Our Spa & Boutique Bali и The Elysian: см. пп. 5 и 4.

### Сверка дублей

Гейт проверяет дубли только внутри `spa-6`. Поэтому новые `best_for` дополнительно сверены поиском по CSV и JSON в `data/data-ops/copy/`: дословных совпадений нет. Близкие по смыслу формулировки (не дословные) не сверялись.
