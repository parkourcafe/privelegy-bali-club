# wave-spa · spa-3: переписывание спа-карточек (2026-10-05)

Список изменений: `spa-3.csv`, 94 строки. Вход: `spa-3.input.json`, 45 карточек (Kuta & Legian 1, Lovina 5, Munduk 8, Nusa Dua 26, Sanur 5).
Режим: пересказ собственных фактов карточки (ступень 2). Факты заново не проверялись. В базу ничего не записано.
Тексты `before` совпадают с краулом `docs/audits/2026-09-28-web/places.csv` байт в байт по всем 94 строкам.

## Гейт

`node scripts/copy/check-cards.mjs data/data-ops/copy/wave-spa/spa-3.csv` →
`45 cards · 0 FAIL · batch problems 0`, код выхода 0. Гейт запускался после 15, 30 и 45 карточек и ещё раз после последних правок.
WARN после переписывания: 0 на каждой карточке. До переписывания было 1–2: A4 (тире), а у royal-orchid и samuh-beach ещё по одному.
Одинаковое начало из трёх слов встречается не больше двух раз: «the spa at» ×2, «bali relaxing resort» ×2.

## Изменено / не изменено

- Изменены все 45 карточек: why_its_here 45, best_for 45, not_for 4 (frangipani, heavenly, kayumanis, samuh-beach).
- Без изменений не осталось ни одной карточки.
- У остальных 41 карточки not_for пуст. Новые not_for не придумывались: цена в why_its_here относится к одной процедуре и не говорит, с какой суммы начинается список.
- Связки в not_for разные: because (frangipani), одно тире (heavenly), двоеточие (kayumanis), точка (samuh-beach).
- Тонкие карточки, которые не дописывались: jiwa-spa (21 слово), sanctua-bedugul, ayu-spa-salon, bali-relaxing-resort-spa (по 23 слова; у последней нет ни цены, ни способа записи), heavenly-spa (24 слова). У bali-relaxing-resort-and-spa нет длительности и способа записи, их тоже не добавляли.

## Заметные удаления

- Слово «published» убрано со всех 45 карточек. Слово «items» заменено на «treatments».
- **samuh-beach:** удалено «THAI BEEF SALAD is 90K IDR». Это цена блюда, а в формуле она стояла как цена процедуры.
- royal-orchid: из названия процедуры убран хвост «– 60». Сами 60 минут в тексте остались.
- koa-spa: метка «Customise your massage with our add ons» переписана как «massage add-ons».
- frangipani: «Frangipani Quick Couple Massage» записано как «the quick couple massage».
- Названия сокращены там, где хвост дублировал район: «Bali Dream Spa» (без « - Lovina»), «Chi Massage & Luxury Spa» (без « Nusa Dua Bali»). «Adi Spa Healing healthy and Wellness Nusa Dua» сокращено до «Adi Spa».
- best_for: заготовка «a long reset» убрана везде. Длительности записаны словами (two hours, three hours, five-hour и т. п.). У earthbound и mahony длительность перенесена в why_its_here. У bali-dream «couple treatment» перенесено из best_for в why_its_here.
- Слово «tired» в 14 карточках не повторено дословно: оно перефразировано (walked-out, sore, worn out, had enough) или подразумевается. В reason для каждой карточки сказано, что именно сделано.

## Сомнительные факты (не исправлялись)

- **The Ritz-Carlton Spa, Amelia Island** стоит в Nusa Dua. Amelia Island находится во Флориде, так что это, вероятно, чужая запись или чужое меню (58 позиций).
- **Возможные дубли:**
  - Три записи вокруг Bali Relaxing Resort: bali-relaxing-resort-and-spa-nusa-dua (7 позиций, foot massage 350K без длительности), bali-relaxing-resort-spa (4 позиции) и the-u-spa-by-bali-relaxing-resort (14 позиций).
  - bamboo-spa-at-munduk-moding-plantation и munduk-moding-plantation: один курорт, но 16 позиций против 9 и разные способы записи (сайт и WhatsApp).
  - putu-bali-spa-home-care: эта же запись с тем же списком (5 позиций, foot massage 200K за 60 минут, WhatsApp) есть в spa-2 как Legian, а здесь она стоит в Munduk. По названию это, похоже, выездной сервис.
- **Место:** Mondo Surf & Lifestyle Village (surf village) записан как массажная студия в Munduk, это горы. Sanctua Bedugul тоже стоит в Munduk. Yes Spa Bali из района Kuta & Legian генератор поставил в «Legian».
- **samuh-beach:** not_for «A resort-spa setting — this is a neighbourhood price list» выведен, судя по всему, из той же цены салата (90K). Смысл я сохранил, поменял только связку, но факт стоит проверить.
- **Заготовка «booked the same day»** на трёх карточках: munduk-moding-plantation, ayu-spa-salon, heavenly-spa. Кроме самой заготовки, в записи нет ничего, что подтверждало бы запись в тот же день. У heavenly-spa из 11 позиций названа только yoga, хотя тип карточки «day spa».
- **Цены:**
  - kayumanis: relaxing massage 1025K IDR за 60 минут.
  - frangipani: список «начинается» с quick couple massage за 800K. Скорее всего, это цена на двоих, и тогда not_for про бюджет может быть неточным.
  - griya-santrian: reflexology 443K. chi-massage: foot reflexology 380K.
  - koa-spa: 200K за 30 минут, но это цена допуслуги (add-on), а не процедуры.
  - bali-relaxing-resort-and-spa: цена без длительности.
- **Длительности:** earthbound до 360 минут. 3d-relaxation, frangipani и sekar-jagat до 300 минут.
- **Пары:** у rnd, santhika, 3d-relaxation, royal-orchid, the-ritz-carlton, blissful-senja и bali-dream «couple treatment» был только в best_for, в трёх названных процедурах его нет.
- **Метки вместо процедур:** «Spa Package», «Recovery», «Detox Treatment», «Body Treatment», «Hair Treatment». Это категории генератора. У sofitel-spa-with-clarins всего 5 позиций для отельного спа, список, возможно, неполный.
