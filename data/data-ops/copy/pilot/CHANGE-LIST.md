# Пилот «человеческий текст» — список изменений на утверждение

Дата: 2026-10-05. Ничего не опубликовано и не записано в базу. Версия черновиков — v3 (`drafts.json`).

## Зачем пилот
Перед тем как переписывать сотни карточек и десятки статей, нужно убедиться в трёх вещах на малом объёме:
- переписанный текст действительно читается лучше — по мнению человека, а не линтера;
- при переписывании не меняются факты;
- голос совпадает с тем, что вы хотите видеть на сайте.

## Состав (≈1,5 тыс. слов)
| Что | Сколько | Где |
|---|---|---|
| Карточки, написанные «одним голосом» | 10: Milk & Madu Beach Road, Atlas, Nook Umalas, Ji, Sensorium (Canggu); Fair Warung Bale, Warung Mendez, Wulan, Bali Buda, Kilig (Ubud) | база, `why_its_here` / `best_for` / `not_for` |
| Гайд | 1: «How many days in Bali» | `lib/guides.ts` |
| Вступление пиллара | 1: Nusa Dua (текст под заголовком + meta description) | `app/nusa-dua/page.tsx` |
| Шаблоны hub-страниц | 2 правки — уже в ветке (этап 1, S1-001/002) | `lib/hub.ts` |
| Контроль «не менять» | 3: Artisan Pererenan, AT06, Bali Climbing | — |
| Шаблонные карточки «пока не трогаем» | 2: Air Cafe at The Sebali (Ubud), Alma Spa (Canggu) | — |

Карточки выбраны по числу редакционных ссылок на них (`stage-b-queue.csv`) — это самые видимые карточки «одним голосом» в Canggu и Ubud. Шаблонные карточки в пилот не взяты: в записи нет фактов, «очеловечить» их можно только выдумкой.

## Результаты проверок

**Слепой читатель** (отдельный агент видел только пары A/B в случайном порядке, без меток; версия v1):
- переписанный вариант предпочтён в **12 из 12** пар, в том числе **10 из 10** карточек;
- средняя оценка «читается как человек»: **3,9** против **2,2** (из 5);
- обе контрольные пары с подменённым фактом («lava-stone» → «wood-fired», «ten-table» → «twenty-table») пойманы;
- замечание читателя, учтённое в v2: хвост «Not for: X, because it is Y» повторялся в пяти карточках подряд — сам стал шаблоном.

**Сторож фактов** (`scripts/copy/fact-diff.mjs`) на v3: 12 из 12 единиц PASS, 0 новых чисел, имён, блюд и оценочных слов.

**Линтер** (`scripts/copy/lint.mjs`) на v3: 0 FAIL; отметок по пилоту **28 → 7**. Ни одно поле не стало хуже.

**Что сторож поймал в моих собственных черновиках** (исправлено в v3):
- Milk & Madu: «A quiet, intimate dinner for two» — в записи было «couples», число 2 добавила я;
- Kilig: «shared at one table» — новое число;
- мета Nusa Dua: «beyond the resort pool» — бассейна в сравниваемом тексте не было;
- вручную, сторож такого не видит: Fair Warung — «What you pay for lunch funds…» сузило «restaurant proceeds» до обеда.

## Что удалено намеренно (по каждой единице)
Удаляется только оценка, ярлык или утверждение без источника. Факты остаются.

| Единица | Удалено |
|---|---|
| Milk & Madu | «well-known» (популярность без источника) |
| Atlas | «entertainment» (ярлык), «event» в best_for (за ним ничего нет) |
| Nook | «Long-running» (в записи нет даты), «Known as a calm rice-paddy escape» (формулировка из отзывов) |
| Ji | «sweeping», «one of Canggu's most atmospheric settings» (рейтинг без источника) |
| Sensorium | «fusion» ×2 и «blending … culture» (конкретное описание осталось) |
| Fair Warung | «social-enterprise» (механизм описан словами), «easy, good-value» |
| Warung Mendez | «tucked in», «ethos» (обе практики названы прямо) |
| Wulan | «hole-in-the-wall», «authentic» |
| Bali Buda | «institution», «Long-running» (год говорит сам), **«Bali's only gluten-free pizza base»** — утверждение «единственный на Бали» без источника, перенесено в список проверки фактов |
| Kilig | «It stands out as» (факт остался) |
| Гайд | «sweet spot» ×2, «Here's», «really», «go deep rather than wide», «launchpad» |
| Пиллар | «curated from places we actually rate», «low-friction», каркас «This guide covers…», «the best things to do» в meta |

## Список проверки фактов (не правится в тексте, уходит в сбор доказательств)
- Bali Buda: «Bali's only gluten-free pizza base».
- Toko Kopi Tuku: «first Bali store» (этап 1, S1-054).
- Atlas: «the world's biggest beach club» — в тексте остаётся как слова владельца: «its own website calls it…; we have not checked that».

## Что нужно от вас

**1. Слепой A/B** — `ab-sheet.md`, 12 пар, 30–40 минут. На каждую пару: A или B, те же ли факты, отличишь ли место от соседнего. Ключ — `ab-key-v3.json`, его лучше открыть после ответов.
Порог: если переписанный вариант выигрывает меньше 8 из 10 карточек — сначала перекалибровка голоса, потом масштабирование.

**2. Построчно** — `change-list.csv`, колонка `decision`: ДА / НЕТ / ПРАВКА. Строки HOLD и NO CHANGE уже проставлены.

**3. Что будет после «да»:**
- карточки — guarded SQL (`scripts/copy/build-copy-sql.mjs`, проверка на точный старый текст, `rollback.sql`), применяет сессия с Supabase-коннектором;
- гайд и пиллар — коммит в ветку;
- одобренные пары становятся каноническими примерами в `docs/content-style.md` §5.

## Файлы
- `drafts.json` — все версии (v1, которую читал слепой читатель; v2; v3) и удаления.
- `change-list.csv` — 50 строк для решения.
- `gates.json` — полный вывод сторожа фактов.
- `ab-sheet.md` + `ab-key-v3.json` — ваш A/B.
- `reader-sheet.md` + `ab-key.json` + `reader-verdicts.json` — слепое чтение агентом (v1, 14 пар, 2 из них — канарейки).
- `tools/build-change-list.mjs` — пересборка таблицы из черновиков.
