# Волна wave-db: Nusa Dua + Jimbaran — черновик правок карточек

Дата: 2026-10-05. **В базу ничего не записано.** Режим: стилевое переписывание собственного текста записи (rung 2), факты не перепроверялись, `last_verified_at` не трогается.

- `nusa-dua-jimbaran.csv` — 160 строк, колонка `decision` пустая. `before` побайтно совпадает с живым текстом (вход и краул 28.09).
- `nusa-dua-jimbaran.gate.csv` — отчёт ворот.

## Итог
- Карточек на входе 77. Изменено 76, без изменений 1: **Wellness Spa at The Sakala Resort Bali**. Это шаблон spa-formula («Wellness spa in Nusa Dua. The published list covers…»), и по решению A от 05.10 он ждёт сбора фактов.
- Изменено 160 полей:
  - `why_its_here` — 70;
  - `best_for` — 73, из них в 12 снята только точка в конце, текст тот же;
  - `not_for` — 17: 14 переписаны с причиной из самой записи, 3 новых только переносом из `best_for`. Это Izakaya by OKU («reservation-only»), Kubu Garden («without a scene or a view») и Tetaring («rather than a beachfront scene»). Для пустого поля генератор SQL ставит guard «null или пусто».
- Ворота `check-cards.mjs`: 76/76 PASS, проблем партии 0, exit 0. Отметки WARN по изменённым полям: 106 → 0.
- Длина `why_its_here`: до правки 20 карточек длиннее 45 слов (максимум 63), после — ни одной. 10 карточек короче 20 слов: фактов в записи больше нет, добавлять нечего.
- Без изменений оставлены, потому что уже простые и конкретные:
  - `why_its_here`: Arkipela, Bali Beauty Salon, Nasi Banjar Mbok Mang, REVĪVŌ Fitness, REVĪVŌ Spa, Warung Batan Bekul;
  - `not_for`: BROOK, Mulia Fitness, Warung Dobiel.

## Что удалено намеренно
Каждое удаление названо в колонке `reason` своей строки.

**Популярность и репутация:**
- «known for» — 7 карточек;
- famous — 2;
- best-known, go-to, well-made;
- institution, hole-in-the-wall — 2.

**Утверждения без источника** (см. список ниже):
- «Bali's first» — Koral;
- «one of Bali's largest and most decorated» — Mulia Spa;
- award-winning — The Apurva Spa;
- «one of Indonesia's largest» — Fore.

**Хайп и мягкие слова:**
- signature — 9;
- relaxed — 11;
- authentic — 5;
- landmark — 3;
- elevated, stylish — по 2;
- genuinely — 3;
- reliable, serious — по 2;
- proper, chic, marquee, tranquil, top-tier, sanctuary, dramatic.

**Оценки цены и сервиса:**
- well-priced, good-value;
- «friendly, attentive service» — White Orchid, оценка качества в стиле отзывов.

**Стоковые обороты про людей:** travellers/visitors wanting|who, those who/wanting/seeking — 28 вхождений, в основном в начале `best_for`.

**Факты, убранные ради нормы 20–45 слов:**
- AYANA Fitness: салон, кафе, бильярд;
- Club Med: баскетбол, бадминтон, настольный теннис, пляжный волейбол;
- DAVA: куда ужин переходит после Martini Bar;
- Piasan: «inside the ITDC resort enclave»;
- Sofitel Yoga: пункты списка, не относящиеся к йоге;
- Radja: snapper — он стоял внутри «known for».

**Перенесено между полями, не потеряно:**
- блюда Cuca → `best_for`;
- две недели в месяц у приглашённого мастера Four Seasons Yoga → `best_for`;
- day pass Westin остался только в `best_for`.

## Сомнительные факты
В тексте не исправлялись, нужен источник.
1. **Cuca** — «included in the 2025 Michelin Green Guide» оставлено как в записи. Green Guide — туристический путеводитель Michelin, а не ресторанный гид, и источника в записи нет.
2. **Koral** — «Bali's first aquarium restaurant». Из текста удалено.
3. **Mulia Spa** — «one of Bali's largest and most decorated resort spas». Удалено.
4. **The Apurva Spa** — «award-winning», награда не названа. Удалено.
5. **Fore Coffee** — «one of Indonesia's largest specialty-coffee chains». Удалено.
6. **Thermes Marins** — «among Bali's best-known destination spas». Удалено как утверждение о популярности.
7. **Kriya Spa** — «Kriya, meaning 'rituals'» оставлено. Kriya обычно переводят как «действие» или «ремесло», стоит сверить с сайтом отеля.
8. **Изменчивые факты в прозе без даты.** Оставлены, но по стандарту им нужна дата или отдельное поле.
   - Часы: Arkipela 09:00–21:00, Karma Spa 09:00–19:00, персонал Courtyard 06:00–23:00, BROOK с 14:00, Warung Mami около 13:00, Warung Dobiel около 9:00, танцы в Bawang Merah около 19–21, бранч Soleil 11am–3pm.
   - Цена: Sofitel Yoga IDR 150,000++.
   - Условия: «no entrance fee or minimum spend» у Manarai, «no cover charge» у Azure.
   - Дата: «since April 2026» у Westin.

## Открытия и швы
- **Открытия `why_its_here`.** До правки «The fitness centre at…» открывало 5 карточек, «A beachfront seafood…» — 4. После правки ни одна тройка первых слов не встречается больше двух раз. Формулу «<Category> on Jl. X in Y» или «<Category> in Y» убрали у BROOK, Kenja, Kubu, Piramid, Signa и Warung Mami.
- **Форма `best_for`.** 47 начинаются с момента, 11 — «люди + after», 10 — «момент, for …», 9 — «люди who want». Трёх соседей подряд с одной формой нет.
- **Швы `not_for`.** 20 заполненных полей: because 6, двоеточие 6, точка 4, тире 4. Трёх соседей с одним швом нет. Хвост «this is a …» остался один раз (Kenja).
