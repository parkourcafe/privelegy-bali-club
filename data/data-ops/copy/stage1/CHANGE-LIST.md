# Этап 1 — ложь и заглушки: список изменений на утверждение

Дата подготовки: 2026-10-05. Ничего не записано в базу. Правки кода лежат в ветке `claude/pensive-ritchie-f9kkhp` и не выезжают на сайт (деплой только из main).

Файлы: `change-list.csv` (35 строк) и `stubs-99.csv` (99 строк заглушек `best_for`). Колонка `decision` пустая — заполняется ДА / НЕТ / ПРАВКА построчно. Генератор SQL берёт только `db` + `ДА`.

**Как читать «before».** Это текст с живого сайта по краулу 28.09, а не из базы. В сессии с коннектором генератор `scripts/copy/build-copy-sql.mjs` сверит каждую строку с экспортом базы: если «до» не совпало — строка не пишется, уходит в `holds.csv`.

## A. Код — применено в ветке (2 правки)

| # | Где | Было | Стало | Почему |
|---|---|---|---|---|
| S1-001 | `lib/hub.ts` spokeIntro | «…Each pick below lists what to order and the price anchor.» | предложение убрано | Карточки на `/bali/<район>/<intent>` (VenueCard) не показывают ни «что заказать», ни цену — обещание ложное на каждой из страниц |
| S1-002 | `lib/hub.ts` spokeMetaDescription | «…N brunch spots with what to order and prices. Free to use; travellers never pay.» | «…N brunch spots picked by Other Bali. Free to use; travellers never pay.» | та же ложь в `<meta description>` |
| S1-040 | `lib/uluwatu/venues.ts:1348` Warung Bu Jonny, whyHere | «…popular with surf instructors and resort staff for cheap, freshly cooked Indonesian plates and a well-regarded house sambal.» | «…listed among the Bukit's surfer warungs: cheap, freshly cooked Indonesian plates and a house sambal.» | «well-regarded», «popular with» — язык отзывов (guardrail #2). «resort staff» удалено: источника в evidence нет. Новая формулировка — дословно из записи evidence |

## B. База — ждёт «да» (33 строки + 99 заглушек)

### B1. Заглушки вместо описания (7 строк, S1-010…016) → NULL
Шесть карточек с текстом вида «A verified Bali restaurant listing with table reservations handled externally by Chope» / «X is a verified dining venue in Y» и Sarong с служебной фразой «remains under review» (плюс её best_for про «confirm the current format»).

Последствие: под гейтом main (`lib/publication.ts:40-42`) карточка без `why_its_here` уходит в `noindex` и из best-*-списков. У пяти из шести `best_for` уже пуст — они под этим гейтом и так noindex. Sarong теряет индексацию (у неё была и заглушка best_for).

Альтернатива: написать настоящие описания — но фактов в записях нет (пустые spend, hours, reservations). Это работа сбора фактов, не правки текста.

### B2. Язык отзывов и Tripadvisor как источник (15 строк, S1-020…034) → переписано минимально
Правило: убрать только то, что выведено из отзывов или названо со ссылкой на агрегатор; остальные факты не трогать и не перепроверять (это этап фактов, не этот). Каждое удаление названо в колонке `reason`.

Примеры:
- Cafe Vida: убраны два предложения про Tripadvisor (в т.ч. смена названия — тоже из агрегатора).
- Babi Guling Men Agus: убрано предложение «Its Tripadvisor listing shows an inexpensive price band and hours of 8am to 8pm daily»; **not_for «Closes 8pm» (S1-022) выведен из того же источника** — предлагаю NULL или HOLD до проверки часов по месту. Это решение отдельное.
- Jaens Spa: «highly rated», «great-value», «long-standing local favourite» убраны; цена «from around 295k» оставлена как была.
- Dorsey's Barber: убрано всё, что «reviewers note», и «don't mind paying a little more» из best_for.
- Три `best_for` (S1-029, -031, -032) переписаны с «Visitors wanting…» на момент («A massage without resort prices») — по стандарту best_for.

### B3. 99 заглушек best_for «Travellers looking for a verified place to eat in <район>.» → NULL (`stubs-99.csv`)
Ubud 39, Seminyak 19, Kuta & Legian 12, Sanur 12, Uluwatu 9, Nusa Dua 5, Jimbaran 2, Nusa Penida 1. У всех 99 на сайте пустой `why_its_here` — под гейтом main они уже noindex, индексация не меняется, уходит только видимый читателю текст. Писать NULL, не пустую строку: `''` даёт пустой `<meta description>`.

**Что я не знаю:** какой гейт работает на проде (прод ≠ main). На проде эти карточки отдаются с `index,follow`. После первой записи — проверить одну карточку `curl`: robots, meta, отсутствие «Best for».

## Решения для основательницы
1. B1: NULL у 7 заглушек (с уходом Sarong в noindex) — да / нет?
2. B2: 15 строк построчно; отдельно S1-022 (часы Men Agus из Tripadvisor): NULL или HOLD?
3. B3: NULL у 99 заглушек — да / нет?

## Как применяется после «да»
Сессия с Supabase-коннектором: read-only экспорт → `node scripts/copy/build-copy-sql.mjs --changes change-list.csv --export <export.csv> --out stage1/apply --date <дата>` (и то же для `stubs-99.csv`) → preflight → dry-run одной строки в `begin…rollback` → DO-блок (каждый оператор проверяет `row_count = 1`) → verify → `curl` трёх страниц → запись в RUNLOG. `rollback-<дата>.sql` лежит рядом.
