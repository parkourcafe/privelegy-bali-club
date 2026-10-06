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
