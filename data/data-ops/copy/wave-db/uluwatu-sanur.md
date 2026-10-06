# Uluwatu + Sanur: правка карточек в базе, 2026-10-05

Это черновик. В базу ничего не записано. Решение по каждой строке принимается в колонке `decision` файла `uluwatu-sanur.csv`. Все правки на ступени 2 (переписан собственный текст записи), поэтому `last_verified_at` не трогать.

## Итог

- **Вход.** 93 карточки:
  - Uluwatu: 50 карточек из базы, реестр `lib/uluwatu/venues.ts` не входит;
  - Sanur: 43 карточки.
- **Изменено.** 90 карточек, 200 полей:
  - `why_its_here`: 88;
  - `best_for`: 85;
  - `not_for`: 27, из них 7 были пустыми (см. ниже).
- **Без изменений: 3 карточки.** Тексты уже простые и конкретные:
  - `marramba-fitness`;
  - `power-of-now-yoga`;
  - `the-asa-maia-pilates`.
- **Не тронуты отдельные поля в изменённых карточках:**
  - `why_its_here`: `fisherman-s-club`, `the-istana-wellness-club`;
  - `best_for`: `bluvana-reformer-studio`, `la-tribu`, `mantra-wellness`, `morning-light-yoga`, `snowcat-bali-ussr-cuisine`.
- **Проверка.** `node scripts/copy/check-cards.mjs … --report uluwatu-sanur.gate.csv` завершилась с кодом 0:
  - 90 карточек, 0 FAIL, 0 проблем на уровне пакета;
  - fact-diff: PASS по всем карточкам.
- **Дубли не найдены:**
  - ни внутри пакета;
  - ни с остальным краулом (около 1 600 карточек);
  - ни с CSV соседних волн, уже лежащими в `wave-db/` (790 строк на момент проверки).
- **Нарушения в изменённых полях:**
  - FAIL: было 8, стало 0 (F1 ×6, H1 ×2);
  - WARN: было 92, стало 1 (было A7 47, A5 21, A10 16, A4 4, A8 2, A1 1, A3 1). Остался один A5 у `la-tribu`, он был и до правки.
- **Длина `why_its_here`.**
  - Длиннее 45 слов: было 9, стало 0.
  - В 5 тонких записях осталось 16–19 слов. Дописывать было нечем, ничего не добавлено.
- **Каждый удалённый факт назван в `reason` своей строки.** Это проверено сверкой со списком `dropped` в отчёте проверки.

## Что удалено

- **Язык отзывов (правило №2):**
  - «Guests describe it as basic but adequate» — Holiday Inn;
  - «widely reviewed as one of the best-value…» — Svaha;
  - «frequently praised» — The Asa Maia;
  - «known for attentive resort-standard service» — Vela;
  - «widely cited as one of Uluwatu's most established» — Island Grooming;
  - «often described as one of the first…» — D'Nailbar.
- **Ранги и утверждения «первый» или «единственный» без источника:**
  - «the largest wellness facility in Sanur» — Shankha;
  - «The first 24-hour gym in Sanur» и «nothing else is open» — Fitness plus.
- **Хайп и реклама самого заведения:**
  - «world-class» — White Rabbit. Обещание бара теперь приписано самому бару;
  - «Relax & Unwind With Us», «beautifully designed», «tasty», «impressive» — Banana Lounge;
  - «well-known», «celebrated», «warm, open atmosphere» — Ours Bali;
  - слоган «a Taste of Asia» — White Orchid.
- **Повторяющиеся шаблонные слова:**
  - «known for» и «long-running/long-standing» без года;
  - «authentic»;
  - «good-value» и «well-priced» без цены;
  - «signature», «serious», «reliable», «proper»;
  - «offering», «featuring», «set in», «blending», «relaxed», «atmosphere».
- **Второстепенные факты, срезанные ради нормы 20–45 слов (3 карточки):**
  - Andaz: типы тренажёров и йога-студия, сауна, парная, гидробассейны. Всё это есть в карточке Shankha.
  - Shankha: свет над лагуной, отдельно стоящие виллы, бассейн только для взрослых, бар с комбучей и джаму.
  - Puri Santrian Yoga: девять двойных кабинетов спа. Они есть в карточке Puri Santrian Spa.
- **Общая строка `best_for`.** «An evening out for drinks, not a full sit-down meal.» стояла дословно у Ours Bali и у White Rabbit. Обе заменены на разные.

## Поле not_for заполнено с нуля (7 карточек)

- `holiday-inn-bali-sanur-gym`;
- `mantra-wellness`;
- `morning-light-yoga-studio`;
- `puri-santrian-yoga-wellness`;
- `the-asa-maia-yoga`;
- `the-istana-wellness-club`;
- `white-rabbit-lounge-uluwatu-bukit`.

Везде перенесено то, что уже было в той же записи:

- оговорка «rather than / not a …» из `best_for`;
- или ограничение из `why_its_here`: только для гостей, только для взрослых, абонемент блоками по месяцу.

Каждую из этих строк можно отклонить отдельно, остальные строки карточки от этого не зависят.

## Сомнительные факты (не исправлял)

1. `ours-bali-uluwatu-bukit`. В `why_its_here` это «all-day restaurant». Старый `best_for` говорил «drinks, not a full sit-down meal» — это генерированная строка. Отрицание удалено; категорию «Bar» надо проверить.
2. Six Senses: в карточке спа 8 процедурных кабинетов, в карточке фитнес-центра 10. Одно из чисел неверно.
3. `morning-light-yoga` и `morning-light-yoga-studio` противоречат друг другу. В первой — «независимая студия с расписанием», во второй — «шала в Uluwatu Surf Villas, одно занятие в день». Похоже на дубль записи.
4. Ещё пары записей, похожих на одно место:
   - `la-tribu` и `la-tribu-bali`;
   - `power-of-now-oasis-sanur` и `power-of-now-yoga`. В одной пляж Mertasari, в другой «Sanur beach, у лагуны»;
   - `andaz-bali-fitness-centre` и `shankha-spa-and-fitness-at-hyatt-regency-bali`. Это один и тот же зал на 2 000 sq ft.
5. `spring-spa-uluwatu`: «Asia's Best Day Spa, World Spa Awards 2025». Оставлено, как в записи; нужен источник.
6. `garuda-wisnu-kencana`: «one of the tallest statues in the world». Оставлено; высоты в записи нет.
7. `piccolina`: в `why_its_here` «wine bottle shop», в `best_for` «wine-bar».
8. `terrace-sanur-the-1o1-bali-oasis-sanur`: в `why_its_here` написано «THE 1O1» (с буквой O), в `where` — «The 101» (цифрами). В новом тексте отель назван брендом, «THE 1O1 hotel». Причина: полное имя содержит «Oasis», и проверка H1 считает это хайпом даже в живом тексте. Полное имя остаётся в названии карточки.
9. `marramba-fitness`: «in Renon, close to Sanur». Зал находится в Реноне (Денпасар), а карточка стоит в списке Sanur.
10. `the-asa-maia-pilates` (без изменений): «reformer-style work on the Cadillac». Cadillac — не реформер.
11. Летучие факты оставлены дословно и без даты:
    - часы: Genius Cafe, Gong, Taru Pramana, Istana Club;
    - цены: Studio Fondue 250K, Istana 150 000, Power of Now 100 000;
    - выступления в Linga Longa: с 8:30 вечера, после полуночи, буфет по средам и воскресеньям;
    - happy hour в Ours Bali.

## Начала текстов и связки в not_for

- **Начала `why_its_here`.**
  - Ни одно начало из трёх слов не повторяется 5 и больше раз; проверка не дала ни одного замечания.
  - Чаще всего встречаются «A yoga …» (4 раза) и «An open-air …» (4 раза).
  - Шаблона «<Category> on Jl. X in Y» нет. Тексты начинаются с факта, имени, людей, блюда или места: «Tables face the sea…», «Duck and roast pork anchor…», «Recycled boat timber makes up…».
- **Группы карточек одного отеля написаны разными конструкциями:**
  - Six Senses, The Asa Maia, Istana, Shankha, Maya Sanur — по 3;
  - Puri Santrian, Koa Shala — по 2.

  Соседние карточки Six Senses начинаются по-разному.
- **Связка причины в `not_for`:**
  - because или since — 9;
  - двоеточие — 8;
  - точка — 6;
  - тире — 3;
  - « - » — 2, в карточках без изменений;
  - без связки — 1.

  Три соседние карточки с одинаковой связкой не встречаются.

## Файлы

- `uluwatu-sanur.csv`: 200 строк, колонка `decision` пустая.
- `uluwatu-sanur.gate.csv`: отчёт проверки, 90 PASS.
- Черновики и вспомогательные скрипты лежат во временной папке сессии и в репозиторий не входят.

## Проверка 2 (скептик)

Скептик подтвердил два замечания уровня low. Оба исправлены в `uluwatu-sanur.csv`. Колонка `before` не менялась, колонка `decision` по-прежнему пустая.

- **`gong-restaurant` / `why_its_here` — сдвиг смысла.**
  - В исходнике «focused on traditional dishes», то есть в основном традиционные блюда.
  - Переписанное «the menu sticks to traditional dishes» означает «только традиционные». Это более сильное утверждение о меню, чем есть в записи. У ресторана при курорте, открытого с 7 утра до 10 вечера, вполне могут быть и другие блюда.
  - Исправлено на «the menu centres on traditional dishes». Пояснение в колонке `reason` дополнено.
- **`six-senses-uluwatu-yoga-pavilion` / `best_for` — потерянная оговорка.**
  - Бесплатные короткие занятия доступны только гостям курорта.
  - В переписанном `best_for` не было слов «Resort guests», поэтому «free short sessions» читалось как предложение для всех. Карточка в режиме visualFirst (`PlaceCard.tsx`) показывает `best_for` без `why_its_here`.
  - Исправлено на «Resort guests after a daily indoor practice out of the Bukit heat, with free short sessions and longer paid ones».
  - Связка «and» оставлена, как в исходнике («both … and»), а не «or» из предложенной правки: в исходнике сказано, что доступны оба вида занятий, а не одно из двух. Пояснение в `reason` переписано.

Отклонённых замечаний нет.

Проверка: `node scripts/copy/check-cards.mjs data/data-ops/copy/wave-db/uluwatu-sanur.csv` — 90 карточек, 0 FAIL, проблем по пакету 0, код выхода 0. Файл `uluwatu-sanur.gate.csv` не перегенерировался.
