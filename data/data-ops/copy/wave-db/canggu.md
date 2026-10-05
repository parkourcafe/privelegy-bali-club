# Canggu · wave-db · 2026-10-05 — стилевая переработка карточек (черновик)

Вход: `canggu.input.json` (148 карточек). Выход: `canggu.csv` (352 строки), отчёт ворот `canggu.gate.csv`.
Режим — rung 2: переписан только собственный текст записи, факты не перепроверялись, `last_verified_at` не трогать. В базу ничего не записано; колонка `decision` пустая.

## Итог

- Изменены все 148 карточек, без изменений — 0 (у каждой был lint-код или стоковая фраза).
- Полей изменено 352: `why_its_here` 140, `best_for` 139, `not_for` 73. Новое `not_for` одно (obsidian-gym-bali-canggu): «don't mind a premium day pass (449k)» перенесено из `best_for` как fit; новых фактов нет.
- Ворота: `check-cards.mjs` — 148/148 PASS, 0 batch problems, exit 0. WARN 181 → 1. Оставшийся — A10 у Shosan: «Signature» входит в название процедуры «Shosan Signature Massage».
- Длина `why_its_here`: 17–48 слов. У 16 карточек 46–48 слов: это плотные записи, и сокращать их дальше пришлось бы ценой фактов. У 3 карточек по 17 слов (Jungle Padel, RITE Yoga, The Canggu Studio Yoga): других фактов в записи нет.
- Каждое удаление названо в `reason` своей строки.

## Заметные удаления

- **Язык отзывов (guardrail #2), Victory Fitness Club:** удалено «Reviews are consistent on the value and mixed on cleanliness». Из `best_for` убрано «do not mind a rough-around-the-edges gym»: это оценка качества, а не fit (#9).
- **Популярность и рейтинги:**
  - FINNS Beach Club — «biggest and best-known»;
  - Warung Sika — «most popular»;
  - NÜDE — «popular»;
  - Desa Seni — «one of Canggu's most atmospheric»;
  - Mason — «go-to rooms»;
  - Milk & Madu Berawa — «dependable, crowd-pleasing».
- **«known for / best known for»:** Crate, Casa Tua, La Brisa, Lyma, Poule de Luxe, Goldust Beauty, Nail Lesss, The Lawn, HairShop.
- **«long-running / long-standing / institution» без даты:** Crate, Milk & Madu, Milu, The Lawn, Tropical Nomad, Warung Nonii, HairShop. Там, где в записи есть год, он остался.
- **Слоганы и самопозиционирование:**
  - Bali Buda — «Bali's original source…»;
  - Bar Vera — «new generation of European wine bars»;
  - Jungle Padel — «fast-growing racket sport»;
  - Sa'Mesa — «one-of-a-kind», «an event as much as a meal».
- **Оценки без источника:**
  - authentic;
  - quality beans;
  - well-taught;
  - careful;
  - well-run;
  - reliable / serious / proper / solid / trustworthy;
  - dependable.
- **Впечатления:**
  - удалены: relaxed, laid-back, serene, tranquil, stylish, chic, atmosphere;
  - перенесены в `not_for` как fit: Crate (loud, crowded), Mosto (compact room).
- **Факты, снятые сознательно:**
  - Copenhagen — другие точки группы (Padonan, Pererenan, Seseh) и «one of two cafe sites»;
  - Surya Fitness — перечень стандартного инвентаря (бренды оставлены);
  - Green Spot — улица (она есть в адресе).

## Сомнительные факты (не исправлялись — на проверку)

1. **saya-club** — «open around the clock» и «middle of the night», а видимые часы 06:00–22:00. Проверить до публикации.
2. **sia-grill-and-seafood-bar** — «opens at midday», а часы с 09:00.
3. **mia-asian-modern…** — «from evening», а часы с 12:00 (пн–чт).
4. **bonito-restaurant** — «dinner-only, Monday to Saturday», а часы с 12:00.
5. **bottega-italiana** — в тексте «Origano»; кухня 11:00–23:30, а видимые часы пн–пт 11:00–13:00.
6. **yuki-canggu** — бронь «essential» (why) против «recommended» (not_for).
7. **the-avocado-factory** — «Berawa-area», а адрес Jl. Pantai Batu Mejan.
8. **brunch-club-pererenan** — Berawa «reopening mid-2026»: дата прошла.
9. **sa-mesa-canggu-experience-dining / samesa-canggu** — одно название, разные улицы. Возможен дубль.
10. **jungle-padel-canggu-canggu / …-shortcut** — вероятный дубль. В area служебная пометка «verify branch».
11. **desa-seni-yoga** — в area служебная пометка «Berawa boundary / verify pin».
12. **the-shampoo-lounge-canggu** — slug не совпадает с именем HairShop Canggu (переименование?).
13. **therapy-canggu-canggu / therapy-hair-spa-canggu-canggu** — те же часы и услуги. Одно место?

## Открытия и швы

- **Новый шаблон в открытиях.** После первого прохода 101 из 148 описаний начинались с «<Name> is a …». Ворота этого не видят: названия разные. Переписаны 37 открытий. Теперь:
  - 62 — «<Name> is a»;
  - 53 — имя + глагол, приложение или вводный оборот («On…», «Off…», «From…», «Built…», «Opened in 2023…»);
  - 17 — «A/An …»;
  - 16 — «The …».
  Нигде нет трёх соседних карточек с одной формой. Заметка ворот о пяти одинаковых первых трёх словах — 0.
- **Убраны повторы, появившиеся при обходе правила списков:** «alongside» (15 раз) и концовки `not_for` вида «: this is a <тип>».
- **Швы `not_for`:** двоеточие, «because», точка, «since», тире — у трёх соседних карточек шов нигде не повторяется. Тире не больше одного.
- **Ложные срабатывания, которые полезно знать:**
  - A5 срабатывает на приложение с «and» в пределах четырёх слов после запятой («Bali Buda, an organic … cafe and shop»). Маскировка названия укорачивает фразу, и ловушка срабатывает чаще.
  - «°C.» читается как сокращение: предложения склеиваются, и срабатывает A7.
  - fact-diff принимает слово в начале предложения, которого нет в исходном тексте, за имя (Sister, Daytime, Turning, Using, Fight).
- **`scripts/copy/fact-diff.mjs` изменился на диске во время сессии** (не мной). Финальный прогон ворот сделан на текущей версии.
