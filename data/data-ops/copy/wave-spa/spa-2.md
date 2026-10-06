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

## Проверка 2 (скептик)

Исправлены 13 подтверждённых замечаний. Изменены 60 строк `spa-2.csv`: колонки `after` и `reason`, у каждой правки в `reason` есть пометка `skeptic pass 2026-10-06`. Колонка `before` и формат CSV не тронуты. Новых фактов нет, всё взято из собственных фактов карточки.

Гейт: `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-2.csv` →
`45 cards · 0 FAIL · batch problems 0`, код выхода 0. WARN ни на одной карточке не вырос. fact-diff отмечает выпавшие токены: «Tired» ×7 (заготовка про уставшие ноги), «budget» и «Super Relaxing Foot Massage». Оба последних были выпадением ещё в первом проходе.

**Длительность, привязанная к процедуре** (jimbaran-puri, tyce, bamboo, citrine, the-ark, th-home, revitalize, а также freebird, у которой та же ошибка). Максимум по списку больше не стоит рядом с названной процедурой или парой. Он перенесён в why_its_here, а best_for пишется из списка процедур. Пример: jimbaran-puri — «Couples, or anyone booking the abhyanga», 180 минут теперь в why. Так же перенесены 180 минут у tonic, 240 у galuh и glow.

**Момент «после ходьбы»** (19 best_for). Теперь он остался в одной карточке, cozy-spa-bali («An hour of foot reflexology after a walk around Legian»): у неё ножная процедура названа и оценена. Предложенные lux, kokuo, putu и de-wave тоже переписаны без ходьбы, потому что их формулировки почти дословно повторяли другие партии: spa-4 asha-wellness и spa-3 hotel-nikko («after a long walk»), spa-6 shiki-spa («when walking has worn you out»), spa-4 bali-wellness (putu), spa-6 spa-shell (de-wave). Остальные написаны из своего списка: shiatsu/facial у glow, hair treatment у body-worship, scalp treatment и cream bath у therapy, manicure у revive и т. д. У calma и respawn ножных процедур нет, у них «уставшие ноги» убраны совсем.

**«Booked the same day»** (10 карточек: six-senses, the-path, umalas, urban-oasis, wave-house, balangan, bombora, the-lotus-spa, anjali, ministry-of-villas). Утверждение снято из всех десяти, усиления «today», «last-minute», «spur-of-the-moment» и «at short notice» тоже ушли. В `reason` стоит пометка needs_verification. Вернуть его можно только по данным провайдера (AGENTS §11).

**«from X to Y» в why_its_here.** Было 21 из 45, осталось 3: revive (manicures → body scrubs), the-path (yoga → spa package) и bombora (sports massage → hair treatments). В этих трёх между пунктами есть реальный разброс. Остальные 18 переписаны через «include», «including», «among them», «covering» или «alongside».

**Повтор внутри страницы Kuta & Legian:** galuh и glow больше не совпадают («A spa package, or a traditional massage» и «An hour of shiatsu, or one of the facials»). Длительность у обеих перенесена в why_its_here.

### Что не исправлялось и остаётся риском

- Теперь в большинстве best_for одна схема: «процедура, или другая процедура». Каждая пара процедур своя и взята из списка карточки, но читатель, который видит три такие строки подряд, может принять их за шаблон. Без новых фактов (кто ходит, когда, сколько стоит) этот выбор сильно не разнообразить.
- Best_for, построенные только на длительности, остались у avisha («up to two and a half hours»), bali-green («four hours of treatments») и bali-orchid («up to three hours of treatments»). В замечаниях скептика их не было, но по форме они повторяют такие же строки в spa-1, spa-3, spa-4, spa-5 и spa-6. Их стоит смотреть вместе со всей волной, а не по одной партии.
- Сомнения из первого прохода (дубль swara, тип и место заведений, подозрительные цены и длительности) остаются в силе. В этом проходе факты не перепроверялись.
