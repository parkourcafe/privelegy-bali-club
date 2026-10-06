# Волна карточек: Seminyak, Kuta & Legian, Bali — черновик правок (2026-10-05)

Это черновик. База не трогалась, колонка `decision` пустая, коммита нет. Источник в каждой строке: «wave-db 2026-10-05: style rewrite of the record's own text (rung 2); facts not re-verified». `last_verified_at` не меняется.

Файлы:
- `seminyak-kuta-bali.csv` — 220 строк, по одной на изменённое поле;
- `seminyak-kuta-bali.gate.csv` — отчёт ворот по каждой карточке.

## Итог

| | |
|---|---|
| Карточек во входе | 110 (Seminyak 83, Kuta & Legian 20, Bali 7) |
| Изменено | 108 карточек, 220 полей |
| По полям | why_its_here 94, best_for 85, not_for 41 |
| Новые not_for | 6, только перенос из самой записи (см. ниже) |
| Без изменений | 2: Makan Place, The Laneway (причины ниже) |

**Ворота.** `check-cards.mjs`: 108 PASS, 0 FAIL, проблем на уровне батча 0, exit 0.

**Линтер на изменённых полях:**
- FAIL: было F1 ×14, H1 ×6, A9 ×4 → стало 0.
- WARN: было 123 → стало 14. Остался только A5 (лишний список «X, Y и Z»). Ни в одной карточке WARN не вырос.

**Форма полей:**
- why_its_here длиннее 45 слов: было 14 → стало 0; средняя длина 34,8 → 34,4 слова.
- best_for с точкой в конце: 53 → 0.
- best_for с цепочкой из трёх и более частей через «;»: 27 → 0.

**Проверка генератором SQL** (в памяти, decision = ДА, экспорт собран из входа): 220 операторов, 0 HOLD.

## Что удалено

Каждое удаление названо в колонке `reason` своей строки.

**Популярность.** «known for / best known for» убрано в 24 полях. Факт остался, ушла только рамка популярности. Где это было блюдо, оно стало «the dishes to order» — по образцу Crate Cafe.

**Утверждения без источника.** Удалены и вынесены в список проверки:
- Bali Fitness: «the first place in Bali to run Les Mills group classes»;
- Jiwa: «Bali's first hot-yoga studio»;
- Rai Fitness Sunset Bali: «The first mega gym in Bali»;
- Rai Fitness Sunset Road: «one of Bali's original mega-gyms»;
- Hammerhead: «the heaviest free weights on the island»;
- Prana Spa: «One of Bali's largest and most theatrical»;
- Prana Yoga: «one of Seminyak's largest spas»;
- Shampoo Lounge: «Billed as Bali's original…» и «one of Bali's largest bridal… teams»;
- Pantai Kuta: «Bali's original and best-known beach»;
- Potato Head: «put Seminyak's beach-club scene on the map»;
- Kynd: «Seminyak's strongest plant-forward brunch»;
- Bodyworks: «A pioneer of the modern Seminyak day-spa model»;
- Revolver: «One of Seminyak's pioneering…»;
- Made's Warung: «One of Kuta's oldest names» (год 1969 остался).

**Пересказ отзывов (guardrail #2).** W Bali: «guests also report HIIT and strength classes».

**Хайп и оценки:**
- elevated ×3, landmark ×2, iconic, famous, institution ×4, authentic ×6;
- striking, dramatic, soaring;
- signature ×9, serious ×6, proper ×4, reliable / dependable ×8 (счёт по полям);
- long-running ×10 — в записи нет даты.

**Зачины best_for.** Зачины вида «Travellers wanting / who», «Visitors who / wanting», «Those who», «Anyone wanting», «Guests who» убраны в 42 полях best_for; похожие зачины в not_for тоже ушли.

**Сокращения до 45 слов** (каждый факт назван в reason):
- Boy'N'Cow: «premium», интерьер;
- Desa Potato Head: «behind the Library»;
- Undisan: «the traditional way», «Balinese» в названии ремесла;
- Merah Putih: «soaring», «full … program»;
- Potato Head: «sustainability-minded», слово «architect»;
- Rai Fitness Sunset Bali: «world bodybuilding champion», garden, «licensed instructors»;
- The Legian: название зала «The Studio», «mindfulness», «group»;
- W Bali: «warm and cold».

## Без изменений

- **Makan Place** — шаблонная карточка. Единственная отметка (тире) стоит внутри названия блюда. Названия меню с опечатками источника, см. ниже. Ждёт сбора фактов (решение A).
- **The Laneway** — «priced items» похожи на ошибку разбора, см. ниже. Переписать по-человечески значит узаконить мусор. Ждёт сбора фактов.

Ещё четыре шаблонные карточки генератора переписаны только по стилю: ломаный список блюд, капслок, «signature», «Authentic». Это Fire, Mades Warung (Seminyak), Pavilion Surf Club и THE GOAT. Полноценный текст для них тоже ждёт сбора фактов.

## Сомнительные факты

В тексте их не правили. Они уходят в сбор доказательств.

**Место и район:**
- Anika Gym: район Kuta & Legian, а адрес — Padangsambian Klod, Denpasar.
- Crossfit Seminyak: район Kuta & Legian, а в тексте «near Seminyak beach».
- Drifter: район Kuta & Legian, а адрес на Jl. Kayu Aya в Seminyak.
- Sangsaka: в тексте Jl. Petitenget, в адресе карточки Jalan Raya Pangkung Sari No.100X.
- «Eat Street» описан по-разному. У Boy'N'Cow это Jl. Raya Kerobokan. У Natys — Jl. Kayu Aya (Oberoi). У Corner House — Eat Street и угол Oberoi Road.

**Возможные дубли записей:**
- Rai Fitness Sunset Bali и Rai Fitness Sunset Road. Похоже на один зал. Основатель описан по-разному: «world bodybuilding champion» и «bodybuilding icon».
- Think Pink Nails Seminyak и Think Pink Salon & Nails Bali — обе на Batu Belig.
- Yoga 108 Bali: одна карточка в Kuta-Legian, другая — Jl. Drupadi 108, Seminyak.
- Prana: три записи на одно место. Стиль назван тремя способами: Moorish / Moroccan / Indian-Middle-Eastern.
- Soham: четыре записи на один центр.

**Записи с ошибками источника:**
- Medewi: карточка называется «Tourism Village», а текст описывает пляж.
- Makan Place: в меню «Asparagouz Soup» и «Grilled Chickec – Honey Edition».
- The Laneway: в «меню» стоят Berawa Cocktail, In-Villa BBQ и Wednesday Night Market. Ярлык «fine dining» сомнителен. Berawa — это Canggu.

**Оставлено, но не проверено (бренд и история):**
- Kilo: «first overseas outpost».
- Shichirin: «third on the island», «January 2025».
- Tenganan: «one of Bali's oldest Bali Aga villages».

**Изменчивые данные без даты:**
- Rai Fitness: 55 000 IDR за день, 699 000 за месяц.
- BO$$MAN: «until roughly 5am».
- Pavilion: 140K, 1+1.
- THE GOAT: Cake Cups 75K.
- Fire: устрицы 75K.
- Kros: «open around the clock».
- Warung Melati: «best around 12–1pm».

## Шаблоны и открытия

**Первые предложения.** Около 30% начинаются с «A/An …». Остальные — с названия, места, людей, года или главного блюда. Ни одно начало из трёх слов не повторяется на 3 и более карточках. Ворота отмечают повтор только с 5.

**Свои шаблоны, пойманные по ходу:**
- Хвост not_for «…: this is a …» встретился 12 раз. Переписан, осталось 2.
- Пять соседних варунгов начинали best_for одинаково («A … budget lunch …»). Разнесено.
- Шесть описаний варунгов подряд начинались с «A … warung». Разнесено.
- Два соседних описания начинались с шефа; две карточки Rai Fitness стояли рядом в одной форме. Разнесено.

**Шов в not_for.** Чередуются because, двоеточие, точка, одно тире и since. Нигде нет трёх одинаковых подряд.

**best_for.** С «A/An» начинаются 33 из 85.

**Новые not_for (6).** Это только перенос того, что запись уже говорит:
- dinner-only — Bambu, Gambinos;
- «over a big-box gym» — 15FIT;
- «rather than a relaxation spa» — Cocoon;
- «lively, DJ after dark» — Ling-Ling's;
- «rather than a quiet meal» — Potato Head.

**Пять «room» откатила к словам записи.** Там, где в записи было «setting», «space» или «restaurant», я поначалу написала «room», и это утверждало закрытое помещение. Вернула исходные слова.

## Заметка по инструменту

`scripts/copy/fact-diff.mjs` читает «12–1pm» и «12–3pm» как 00:00–13:00 и 00:00–15:00: при диапазоне через полдень 12 считается полуночью. Здесь это безвредно — «до» и «после» читаются одинаково. Но верная замена «12–3pm» → «noon to 3pm» будет ложно отклонена (проверено: REJECT). Файл общий, я его не правила.

## Проверка 2 (скептик)

Скептик подтвердил одну находку (низкая важность), исправлено.

- **you-spa-umalas / why_its_here.** В правке было «The specials include a Sport Massage and a "Black Room" treatment.» На карточке спа или ресторана «specials» обычно читается как акция или скидка. Такого предложения в записи нет, а граница Offer в V3.1 строгая (guardrail #10). Кроме того, «experience» → «treatment» без доказательств записывало Black Room в процедуры. Стало: «The spa's own options include a Sport Massage and a "Black Room" session.» «The spa's own» передаёт смысл исходного «signature» (собственные позиции спа) без слова из списка A10. «session» нейтрально и Black Room не переклассифицирует. Колонку reason обновила, колонку before не трогала.
- Вариант скептика («Its own treatments include… session») не взят дословно: в предыдущем предложении уже стоит «Treatments include», и повтор снова назвал бы Black Room процедурой.
- `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/seminyak-kuta-bali.csv`: 108 карточек, 0 FAIL, проблем пакета 0, exit 0.
