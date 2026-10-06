# wave-spa · spa-2 — переписывание спа-карточек (2026-10-05)

Список изменений: `spa-2.csv` (92 строки). Вход: `spa-2.input.json` (45 карточек: Canggu 15, Jimbaran 13, Kuta & Legian 17).
Режим: пересказ собственных фактов карточки (ступень 2), факты заново не проверялись. В базу ничего не записано.

## Гейт

`node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-2.csv` →
`45 cards · 0 FAIL · batch problems 0`, код выхода 0. Гейт запускался после 15, 30 и 45 карточек.
WARN после переписывания: 0 на каждой карточке (до него было 1–2, везде A4: тире).
Одинаковое начало из трёх слов встречается не больше двух раз («a wellness spa» ×2).

## Изменено / не изменено

- Изменены все 45 карточек: why_its_here 45, best_for 45, not_for 2.
- Без изменений не осталось ни одной карточки.
- not_for пуст у 43 карточек. Новые not_for не придумывались: у этих карточек нет факта о цене «от», который можно было бы пересказать.
- Тонкие карточки, которые не дописывались до нормы: six-senses-spas-canggu (21 слово, нет цены и способа записи) и balangan-surf-resort-jimbaran (18 слов).

## Заметные удаления

- Слово «published» (о происхождении списка) убрано со всех 45 карточек. Слово «items» заменено на «treatments».
- tonic-canggu: убрана маркетинговая часть названия процедуры «Super Relaxing», осталось «foot massage».
- cozy-spa-bali: убрана метка «COZY FOOT», осталось «foot reflexology».
- best_for: в 16 карточках две заготовки через «;» сведены в одно предложение. Длительность («up to N minutes») перенесена в why_its_here, а где она осталась в best_for, записана словами (two hours, three-hour). На части карточек «tired» или «after a day of walking» подразумевается и в текст не попало (в reason указано, где именно).
- Сужения в best_for (отмечены в reason): freebird и revitalize (120 минут привязаны к названным процедурам), ministry-of-villas («Balinese massage» сужен до aromatherapy massage).

## Сомнительные факты (не исправлялись)

- **Заготовка «booked the same day»** (10 карточек: six-senses, path-yoga, umalas, urban-oasis, wave-house, balangan, bombora, the-lotus-spa, anjali, ministry-of-villas). Кроме самой заготовки, в записи нет ничего, что подтверждало бы запись в тот же день. Формулировку я сохранил, но её стоит проверить.
- **Дубли:** у swara-spa-canggu и swara-spa-jimbaran один и тот же список (13 позиций, те же три метки, запись на сайте). Похоже, это копия одной записи. Ещё lotus-spa-jimbaran и the-lotus-spa-jimbaran: два заведения с почти одинаковым названием в одном районе.
- **Тип или место под вопросом:** six-senses-spas указан в Canggu. oaza-uluwatu с «Uluwatu» в названии стоит в Legian. Курорты balangan-surf-resort и bombora-balangan-resort записаны как спа, вилла-компания ministry-of-villas как wellness centre. putu-bali-spa-home-care и th-home-service-spa по названию похожи на выездной сервис, а в карточке это «wellness spa in Legian». Все 17 карточек Kuta & Legian генератор поместил в «Legian», хотя часть из них может быть в Kuta.
- **Цены:** udara-bali-spa: foot massage 540K IDR за 60 минут, заметно выше остальных (160–300K). therapy-day-spa: reflexology 300K IDR за 30 минут. ministry-of-villas: 100K IDR за 60 минут ароматерапии. jimbaran-puri-spa: abhyanga 1000K IDR. У the-ark-recovery (The Flow 500K), lux-day-spa (190K) и oaza-uluwatu (four-hand 470K) цена указана без длительности.
- **Длительности:** calma-spa: максимум 360 минут. body-worship: 300 минут.
- **Йога-студии со «списком процедур»:** у the-path-yoga-center есть метка «Spa Package». У the-freebird-studio «Core Circuit» похоже на фитнес-класс. В записи такие позиции названы «treatments», а в тексте я назвал их «sessions».
- **Метки вместо процедур:** в списках встречаются «Nails», «Recovery», «Spa Package», «Detox Treatment», «Body Treatment». Это категории генератора, а не названия процедур.
- **Пары:** у glory-massage и sean-spa «couple treatment» есть только в best_for, в списке процедур в why_its_here её нет.
