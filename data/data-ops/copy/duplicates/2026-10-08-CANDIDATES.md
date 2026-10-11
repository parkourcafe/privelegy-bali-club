# Кандидаты в дубли карточек мест · 2026-10-08

**Что это.** Список мест, которые заведены в таблице `venues` несколькими записями. Источник — заметки переписчиков в `data/data-ops/copy/wave-db/*.md` и `wave-spa/*.md` (разделы «Сомнительные факты», «Возможные дубли», «Похоже на дубли записей», «Что осталось открытым»). Слаги сверены с `*.input.json` этих папок и с `docs/audits/2026-09-28-web/places.csv`. Затем каждая запись прочитана в живой базе: только SELECT, 2026-10-08.

**Ничего не снято с публикации и не изменено.** Это список на решение основателя. Пока по группе нет решения, все карточки остаются как есть. Колонка `decision` в `2026-10-08-candidates.csv` пустая.

**Объём.** 26 групп, 66 записей. Из них 57 опубликованы и 9 в статусе `review`: это пустые записи-близнецы без суффикса района, публично они не видны. Уверенность: высокая — 20 групп, средняя — 5, низкая — 1. Группы G24–G26 в заметках не названы, их нашли при сверке слагов.

**Чем подтверждали.** Совпадение сайта, телефона или WhatsApp, Instagram, адреса, `google_place_id` и описания в самой записи. Проверка координат («в пределах ~50 м») не сработала ни в одной группе: координаты почти везде пустые, и ни в одной группе их нет хотя бы у двух записей.

**Варианты решения по группе** (вписать в `decision`):

- `оставить одну карточку и снять остальные с публикации` — какую оставить, предлагает колонка `suggested_keep`. Перед снятием стоит перенести в оставляемую карточку недостающие поля (телефон, адрес, place_id);
- `это разные места` — группа закрывается, карточки остаются;
- `проверить` — нужен источник: сайт, звонок или Google Maps.

Снятие с публикации — запись в `venues`. Её делают отдельным шагом по `.agents/skills/otherbali-supabase-write/SKILL.md`, с пробным прогоном одной строки. Старые URL снятых карточек нужно перенаправить на оставленную.

## Группы

### G01 · Soham — 7 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `soham-wellness-center-seminyak` **(оставить?)** | Soham Wellness Center | Petitenget / Seminyak | published |
| `soham-wellness-spa-seminyak` | Soham Wellness Spa | Petitenget / Seminyak | published |
| `soham-yoga-seminyak` | Soham Yoga | Petitenget / Seminyak | published |
| `soham-pilates-class-program-seminyak` | Soham Pilates / Class Program | Petitenget / Seminyak | published |
| `soham-wellness-center` | Soham Wellness Center | — | review |
| `soham-yoga` | Soham Yoga | — | review |
| `soham-pilates-class-program` | Soham Pilates / Class Program | — | review |

**Почему:** Заметки seminyak-kuta-bali.md: «четыре записи на один центр». Один сайт sohamwellnesscenter.com, один WhatsApp 6287774741616 и Instagram soham_wellnesscenter у всех опубликованных; телефоны +62 361 4741616 и +62 821 4618 6424 делят пары; адрес у всех «Petitenget / Seminyak». Йога, пилатес и спа — направления одного центра. Ещё 3 записи без суффикса в статусе review (не публичны). Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `soham-wellness-center-seminyak`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G02 · Prana — 5 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `prana-spa-seminyak` **(оставить?)** | Prana Spa | Seminyak | published |
| `prana-yoga-seminyak` | Prana Yoga | Seminyak | published |
| `prana-spa-yoga-fitness-adjacent-seminyak` | Prana Spa / Yoga fitness-adjacent | Seminyak | published |
| `prana-yoga` | Prana Yoga | — | review |
| `prana-spa-yoga-fitness-adjacent` | Prana Spa / Yoga fitness-adjacent | — | review |

**Почему:** Заметки seminyak-kuta-bali.md: «три записи на одно место», стиль назван тремя способами. Один сайт pranaspaseminyakbali.com и один Instagram pranaspabali у всех; адрес только «Seminyak». Ещё 2 записи без суффикса в статусе review. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `prana-spa-seminyak`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G03 · Rai Fitness Sunset Road — 3 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `rai-fitness-sunset-road-seminyak` **(оставить?)** | Rai Fitness Sunset Road | — | published |
| `rai-fitness-sunset-bali` | Rai Fitness Sunset Bali | — | published |
| `rai-fitness-sunset-road` | Rai Fitness Sunset Road | — | review |

**Почему:** Заметки seminyak-kuta-bali.md. Один Instagram raifitnessbali, обе опубликованные карточки — мега-зал Ade Rai на Sunset Road (Life Fitness, 40+ классов Les Mills, бассейн, сауна). Разный только район записи (kuta-legian и seminyak). Третья запись rai-fitness-sunset-road — review. Адреса, телефона и сайта нет ни у одной. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `rai-fitness-sunset-road-seminyak`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G04 · Think Pink (Seminyak / Batu Belig) — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `think-pink-nails-seminyak` **(оставить?)** | Think Pink Nails Seminyak | Seminyak | published |
| `think-pink-salon-and-nails-bali` | Think Pink Salon & Nails Bali | Kerobokan / Batu Belig / Batu Belig | published |

**Почему:** Заметки seminyak-kuta-bali.md: обе на Batu Belig. Один WhatsApp 6287700188116 и Instagram thinkpink.salon; оба текста про ногти, волосы, кожу и приватную комнату с Netflix. Сайты отличаются (thinkpinknails.com и thinkpinksalon.com). Филиал think-pink-nails-canggu-canggu — отдельное место, в группу не входит. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `think-pink-nails-seminyak`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G05 · Yoga 108 Bali — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `yoga-108-bali-seminyak` **(оставить?)** | Yoga 108 Bali | — | published |
| `yoga-108-bali-kuta-legian` | Yoga 108 Bali | — | published |

**Почему:** Заметки seminyak-kuta-bali.md. Одинаковые название, сайт yoga108bali.com и Instagram yoga108bali; у обеих area «Sunset Road». Текст одной говорит Jl. Drupadi 108, Seminyak, у другой — «Kuta-Legian area». Разный только район записи. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `yoga-108-bali-seminyak`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G06 · Alchemy Yoga & Meditation Center (Ubud) — 3 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `alchemy-yoga-meditation-center` **(оставить?)** | Alchemy Yoga & Meditation Center | Jl. Penestanan Kelod No. 75, Penestanan, Ubud, Gianyar 80571 | published |
| `alchemy-yoga-and-meditation-center-ubud` | Alchemy Yoga and Meditation Center | Penestanan | published |
| `alchemy-yoga-and-meditation-center` | Alchemy Yoga and Meditation Center | — | review |

**Почему:** Заметки ubud-north-east.md. Один сайт alchemyyogacenter.com и Instagram alchemyyogaubud, у всех Penestanan. У alchemy-yoga-meditation-center полный адрес Jl. Penestanan Kelod No. 75 и google_place_id, но категория spa; у -ubud есть телефон. Третья запись — review. Филиал alchemy-yoga-and-meditation-center-uluwatu — отдельное место, не входит. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `alchemy-yoga-meditation-center`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G07 · Room4Dessert — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `room4dessert` **(оставить?)** | Room4Dessert | Jl. Raya Sanggingan, Kedewatan, Ubud, Gianyar, Bali 80561, Indonesia | published |
| `room-4-dessert` | Room 4 Dessert | Jl. Raya Sanggingan, Kedewatan, Ubud, Gianyar 80561 | published |

**Почему:** Заметки ubud-north-east.md. Один адрес Jl. Raya Sanggingan, Kedewatan, один сайт room4dessert.com. У room4dessert есть google_place_id, WhatsApp и Instagram. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `room4dessert`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G08 · Taksu Yoga — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `taksu-yoga` **(оставить?)** | Taksu Yoga | — | published |
| `taksu-yoga-ubud` | Taksu Yoga & Wellness Center | Jl. Goutama Selatan, Ubud, Gianyar 80571 | published |

**Почему:** Заметки ubud-north-east.md. Один сайт taksu.org и Instagram taksuwellnesscenter; у taksu-yoga-ubud адрес Jl. Goutama Selatan, у taksu-yoga — google_place_id. У taksu-yoga-ubud категория spa. См. также G25 (Taksu Spa в том же центре). Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `taksu-yoga`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G09 · La Tribu — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `la-tribu-bali` **(оставить?)** | La Tribu Bali | — | published |
| `la-tribu` | La Tribu | — | published |

**Почему:** Заметки uluwatu-sanur.md. Оба текста: студия йоги и движения на Jl. Buana Sari, Pecatu. У la-tribu сайт — страница ClassPass, у la-tribu-bali собственный сайт latribubali.id и Instagram. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `la-tribu-bali`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G10 · Power of Now Oasis — 3 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `power-of-now-oasis-sanur` **(оставить?)** | Power of Now Oasis | Mertasari / South Sanur | published |
| `power-of-now-yoga` | Power Of Now (Yoga) | — | published |
| `power-of-now-oasis` | Power of Now Oasis | — | review |

**Почему:** Заметки uluwatu-sanur.md (Mertasari против «Sanur beach у лагуны» — Мертасари и есть пляж Санура). Один сайт powerofnowoasis.com и Instagram powerofnowoasis_bali; оба текста — бамбуковая шала на пляже. Третья запись — review. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `power-of-now-oasis-sanur`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G11 · Зал Shankha Spa (Hyatt Regency / Andaz) — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `shankha-spa-and-fitness-at-hyatt-regency-bali` **(оставить?)** | Shankha Spa & Fitness at Hyatt Regency Bali | — | published |
| `andaz-bali-fitness-centre` | Andaz Bali Fitness Centre | — | published |

**Почему:** Заметки uluwatu-sanur.md. Текст andaz-bali-fitness-centre сам говорит, что своего зала у Andaz нет и гости ходят в фитнес Shankha Spa в соседнем Hyatt Regency; в обоих текстах тот же зал ~2 000 sq ft Precor, 24 часа. Связанная, но отдельная по функции карточка shankha-spa-hyatt-regency-bali-yoga (йога-студия того же комплекса) в группу не включена. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `shankha-spa-and-fitness-at-hyatt-regency-bali`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G12 · Morning Light Yoga — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `morning-light-yoga-studio` **(оставить?)** | Morning Light Yoga Studio | — | published |
| `morning-light-yoga` | Morning Light Yoga | — | published |

**Почему:** Заметки uluwatu-sanur.md: тексты противоречат друг другу. Один сайт uluwatusurfvillas.com/yoga/ у обеих. Текст -studio конкретнее (шала в Uluwatu Surf Villas). Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `morning-light-yoga-studio`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G13 · Sa'Mesa Canggu — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `samesa-canggu` **(оставить?)** | Sa'Mesa Canggu | Jl. Canggu Padang Linjong No.1e, Canggu, Kec. Kuta Utara, Kabupaten Badung, Bali 80351 | published |
| `sa-mesa-canggu-experience-dining` | Sa'Mesa Canggu / Experience Dining | Jalan Tanah Barak No.1e, Canggu, Bali 80351 (поле address; full_address пусто) | published |

**Почему:** Заметки canggu.md: одно название, разные улицы. Один сайт samesabali.com, один номер дома 1e (Jl. Canggu Padang Linjong и Jalan Tanah Barak), оба текста — итальянский ужин за одним длинным столом. У samesa-canggu есть координаты, google_place_id и телефон; у второй координат нет, расстояние не посчитать. Адрес нужно свести к одному.

**Предложение оставить:** `samesa-canggu`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G14 · Jungle Padel Canggu — 3 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `jungle-padel-canggu-shortcut` **(оставить?)** | Jungle Padel Canggu Shortcut | Canggu / Canggu shortcut | published |
| `jungle-padel-canggu-canggu` | Jungle Padel Canggu | Canggu shortcut / verify branch | published |
| `jungle-padel-canggu` | Jungle Padel Canggu | — | review |

**Почему:** Заметки canggu.md: в area служебная пометка «verify branch». Один WhatsApp 6281236664126, Instagram junglepadel, у обеих опубликованных Canggu shortcut и часы 07:00–23:59. У -shortcut есть google_place_id, но категория spa (для падела неверно). Третья запись — review. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `jungle-padel-canggu-shortcut`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G15 · Therapy Canggu — 2 зап., уверенность средняя

| slug | название | адрес | статус |
|---|---|---|---|
| `therapy-canggu-canggu` **(оставить?)** | Therapy Canggu | Batu Bolong / Canggu | published |
| `therapy-hair-spa-canggu-canggu` | Therapy Hair & Spa Canggu | Canggu | published |

**Почему:** Заметки canggu.md: те же часы и услуги. Общие телефон +62 878 6213 7603, сайт therapy.co.id, часы 09:00–20:00. Но тот же телефон стоит и у therapy-hair-spa-seminyak — это общий номер сети, а у Therapy несколько филиалов. Адресов нет (Batu Bolong против просто Canggu). Надо проверить, один ли это салон. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `therapy-canggu-canggu`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G16 · Swara Spa — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `swara-spa-canggu` **(оставить?)** | Swara Spa | — | published |
| `swara-spa-jimbaran` | Swara Spa | — | published |

**Почему:** Заметки spa-2.md: один и тот же список из 13 позиций. У обеих subarea «Pererenan, Canggu» (в том числе у записи с district jimbaran), один сайт swarnaspa.com и одинаковая ссылка в Google Maps. Запись в Jimbaran выглядит копией. Сама запись тоже сомнительна: сайт swarnaspa.com не совпадает с названием, Instagram ancora_themes — аккаунт разработчика шаблона. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `swara-spa-canggu`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G17 · Bali Relaxing Resort (Tanjung Benoa) — 3 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `the-u-spa-by-bali-relaxing-resort-nusa-dua` **(оставить?)** | The U Spa by Bali Relaxing Resort | Jl. Pratama No.62, Benoa, Kec. Kuta Sel., Kabupaten Badung, Bali 80361 | published |
| `bali-relaxing-resort-and-spa-nusa-dua-nusa-dua` | Bali Relaxing Resort And Spa Nusa Dua | Jalan Pratama No.62 Tanjung Benoa,Badung - Bali--, Nusa Dua (Bali), Indonesia | published |
| `bali-relaxing-resort-spa-nusa-dua` | Bali Relaxing Resort & Spa | Jl. Pratama No.62, Tanjung Benoa, 80361, Indonesia | published |

**Почему:** Заметки spa-3.md. У всех трёх адрес Jl. Pratama No.62, Tanjung Benoa. У the-u-spa собственный сайт balirelaxing.com, телефон и список из 14 позиций; у двух других сайты — агрегаторы (all-balihotels.net, trivago.ae). Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `the-u-spa-by-bali-relaxing-resort-nusa-dua`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G18 · Chupacabras — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `chupacabras-south-american-prime-meats` **(оставить?)** | CHUPACABRAS - South American / Prime Meats | Kedewatan, Ubud, Gianyar Regency, Bali 80571 | published |
| `chupacabras` | Chupacabras | Kedewatan, Ubud, Gianyar Regency, Bali (поле address; full_address пусто) | published |

**Почему:** Заметки clean-a.md: один стейкхаус в Kedewatan. Один сайт chupacabrasbali.com, адрес Kedewatan у обеих. Координаты только у -prime-meats (-8.48014, 115.24597), сравнить не с чем. Телефон и Instagram есть только у chupacabras — перенести.

**Предложение оставить:** `chupacabras-south-american-prime-meats`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G19 · CHASKAA Jimbaran (GWK) — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `chaskaa-modern-indian-cuisine-and-bar-at-jimbaran` **(оставить?)** | Chaskaa Modern Indian Cuisine and Bar at Jimbaran | Uluwatu St, Jimbaran, South Kuta, Badung Regency, Bali 80361 | published |
| `chaskaa-jimbaran` | CHASKAA GWK — Jimbaran | Jl. Raya Uluwatu, beside Indomaret, Jimbaran, Kuta Selatan, Badung, Bali, Indonesia | published |

**Почему:** Заметки clean-a.md: CHASKAA GWK. Один бренд и сайт chaskaabali.com, обе на Jl. Raya Uluwatu в Jimbaran; у -at-jimbaran район uluwatu-bukit, хотя адрес в Jimbaran. Координаты и google_place_id только у -at-jimbaran. Филиалы в Kuta, Seminyak и Ubud — отдельные места, не входят.

**Предложение оставить:** `chaskaa-modern-indian-cuisine-and-bar-at-jimbaran`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G20 · Lotus Spa (Jimbaran) — 2 зап., уверенность низкая

| slug | название | адрес | статус |
|---|---|---|---|
| `lotus-spa-jimbaran` | Lotus Spa | — | published |
| `the-lotus-spa-jimbaran` | The Lotus Spa | — | published |

**Почему:** Заметки spa-2.md: почти одинаковые названия в одном районе. Против дубля: разные сайты (jimbaranbaybeach.com и lotuswellnessjimbaran.com), разные списки (20 и 7 позиций), WhatsApp только у одной. Похоже на два разных спа. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** неясно

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G21 · Munduk Moding Plantation — 2 зап., уверенность средняя

| slug | название | адрес | статус |
|---|---|---|---|
| `munduk-moding-plantation-munduk` | Munduk Moding Plantation | — | published |
| `bamboo-spa-at-munduk-moding-plantation-nature-re-munduk` | Bamboo Spa at Munduk Moding Plantation Nature Resort | Jl. Asah Gobleg, Gobleg, Kec. Banjar, Kabupaten Buleleng, Bali 81152, Indonesia | published |

**Почему:** Заметки spa-3.md: один курорт, 16 позиций против 9, разные способы записи. Bamboo Spa — спа внутри курорта. Разные телефоны (6285237288707 и 628113810123); у bamboo сайт — агрегатор gowabi.com, у munduk-moding — собственный сайт. Решить: одна карточка спа или курорт и спа раздельно. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** неясно

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G22 · Parina Spa — 2 зап., уверенность средняя

| slug | название | адрес | статус |
|---|---|---|---|
| `parina-spa-ubud` **(оставить?)** | Parina Spa | Jl. Monkey Forest No.88x, Ubud, Kecamatan Ubud, Kabupaten Gianyar, Bali 80571 | published |
| `parina-spa-ubud-ubud` | Parina Spa Ubud | Ubud, Bali | published |

**Почему:** Заметки spa-5.md: по 10 процедур, но разные процедуры, каналы записи и длительности. У parina-spa-ubud адрес Jl. Monkey Forest No.88x, собственный сайт и WhatsApp; у -ubud-ubud адрес «Ubud, Bali» и сайт activities.marriott.com. Похоже на одно место, но списки не совпадают. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `parina-spa-ubud`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G23 · Putu Bali Spa Home Care — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `putu-bali-spa-home-care-kuta-legian` **(оставить?)** | Putu Bali Spa Home Care | Jln. dewi sri legian, Badung-kuta, Bali | published |
| `putu-bali-spa-home-care-munduk` | Putu Bali Spa Home Care | Jln. dewi sri legian, Badung-kuta, Bali | published |

**Почему:** Заметки spa-3.md. Полностью совпадают телефон 6285737021198, WhatsApp, сайт, Instagram и адрес «Jln. dewi sri legian»; у обеих subarea «South Bali». Запись в Munduk — копия с неверным районом. По названию это выездной сервис. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `putu-bali-spa-home-care-kuta-legian`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G24 · Therapy Day Spa Pererenan — 2 зап., уверенность средняя

| slug | название | адрес | статус |
|---|---|---|---|
| `therapy-day-spa-pererenan` **(оставить?)** | Therapy Day Spa Pererenan | Badung / Pererenan | published |
| `therapy-day-spa-canggu` | Therapy Day Spa | — | published |

**Почему:** Не из заметок — найдено при сверке слагов. Обе в Pererenan (у therapy-day-spa-canggu subarea «Pererenan, Bali»), один сайт therapy.co.id и WhatsApp 6287862137603 (общий номер сети Therapy). Нужна проверка. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `therapy-day-spa-pererenan`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G25 · Taksu Spa (Jl. Goutama Selatan) — 3 зап., уверенность средняя

| slug | название | адрес | статус |
|---|---|---|---|
| `taksu-ubud` **(оставить?)** | Taksu | Jalan Goutama Selatan, Ubud - Bali | published |
| `taksu-spa-ubud` | Taksu Spa | Ubud Centre | published |
| `taksu-spa-beauty-ubud` | Taksu Spa Beauty | Ubud Centre | published |

**Почему:** Не из заметок — найдено при сверке слагов (заметка ubud-north-east.md упоминает «три карточки Taksu» с одинаковыми часами). У taksu-ubud и taksu-spa-ubud общие телефон +62 361 4792525 и WhatsApp 6281138835555; у всех трёх сайт taksu.org и Instagram taksuwellnesscenter. Taksu Spa Beauty может быть отдельной услугой того же центра. См. также G08 (йога в том же центре). Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `taksu-ubud`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

### G26 · The Shampoo Lounge Seminyak — 2 зап., уверенность высокая

| slug | название | адрес | статус |
|---|---|---|---|
| `the-shampoo-lounge-seminyak` **(оставить?)** | The Shampoo Lounge | Jl. Raya Basangkasa 8X, Seminyak, Bali | published |
| `the-shampoo-lounge-seminyak-seminyak` | The Shampoo Lounge Seminyak | Seminyak | published |

**Почему:** Не из заметок — найдено при сверке слагов. Один телефон: +62 819-1924-3824 у одной и WhatsApp 6281919243824 у другой; один сайт shampoolounge.com. Адрес Jl. Raya Basangkasa 8X есть только у the-shampoo-lounge-seminyak. Координат нет ни у одной записи группы, проверка «в пределах 50 м» невозможна.

**Предложение оставить:** `the-shampoo-lounge-seminyak`

**Решение:** ☐ оставить одну карточку и снять остальные с публикации · ☐ это разные места · ☐ проверить

## Что, скорее всего, не дубль

- **G20 Lotus Spa / The Lotus Spa (Jimbaran).** Разные сайты, разные списки процедур и разные каналы записи. Похоже на два разных спа. Оставлено в списке, потому что на него указали заметки.
- В группы не включены другие филиалы тех же брендов, с собственным адресом или районом: `think-pink-nails-canggu-canggu`, `alchemy-yoga-and-meditation-center-uluwatu`, `therapy-hair-spa-seminyak`, `chaskaa-…-at-kuta`, `-at-seminyak`, `chaskaa-ubud`. Не включены и места с похожим названием: `alchemy` (кафе), `sohamsa-ocean-estate-uluwatu-bukit`, `pranava-yoga`, `prana-padel`, `the-shampoo-lounge-canggu` (это HairShop Canggu). Тоже не включены `shankha-spa-hyatt-regency-bali-yoga` (йога-студия комплекса Shankha) и пара Six Senses spa / fitness: это разные залы одного курорта, а не копии записи.

## Вне этого списка

Сверка всей таблицы по общему телефону и `google_place_id` находит ещё пары-кандидаты, которых нет в заметках. Большинство из них — рестораны и спа одного отеля с общим номером, это не дубли. Но несколько похожи на дубли записей: `hotel-indigo-bali-seminyak-beach-*` (3 записи, у двух общий place_id), `rumari` / `rumari-counter-at-raffles-bali` (общий place_id), `oaza-uluwatu-uluwatu-bukit` / `oaza-uluwatu-kuta-legian`, `ayana-spa-jimbaran` / `ayana-spa-uluwatu-bukit`, `serene-bali-spa-denpasar` / `-nusa-dua`, `takumi-bali` / `takumi-japanese-fine-dining`, `livingstone` / `livingstone-holyground`, `koa-shala-*` / `koa-spa-sanur` (3), `rite-bali-*` (3), `the-canggu-studio-*` (2), `ganesha-ek-sanskriti-*` (2, общий place_id). Это материал для отдельного прохода, здесь они не разбирались.
