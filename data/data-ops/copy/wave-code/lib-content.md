# Волна «человеческий текст»: контент-реестры в `lib/`

Дата: 2026-10-05. Ветка `claude/pensive-ritchie-f9kkhp`. Ничего не закоммичено, не задеплоено, в базу не писалось.

Зона: 24 файла `lib/` (список из задания). Правки в 16 из них, 8 файлов оставлены без изменений (почему — ниже).

## Итог

- Изменено **262 строки** в 16 файлах. `check-rewrite.mjs` по всем 24 файлам: **exit 0, все 262 PASS**, fact-diff REJECT нет. Построчный отчёт: `lib-content.csv`.
- **WARN 380 → 48. FAIL 4 → 0**: «famous for» ×2 (Lempuyang, FAQ Nusa Penida), «popular with» ×1 (FAQ Sanur), «iconic» ×1 (meta Seminyak).
- Из 48 оставшихся WARN: 42 приходятся на frozen title/metaTitle/heading, 1 на фразу о политике (`CURATION_NOTE`, оставлена дословно), 5 на неизбежные списки «X, Y и Z» в ответах-перечнях (A5).
- Проверки: `npx eslint` по 24 файлам — 0 ошибок; `npm run typecheck` — 0; основной `npm test` (без pretest) — 761 pass / 0 fail / 1 skip, как в базовом прогоне; `scripts/copy/ratchet.mjs` — регрессий нет; `canggu-guide-answer` 6/6, `ubud-p0-boundary` 5/5. Отдельный поиск 4-словных фрагментов старого текста по всем `*.test.*` (защита от пиннинга в середине строки) — 0 совпадений.

| Файл | строк | WARN до → после | что осталось |
|---|---|---|---|
| bali-things | 18 | 27 → 2 | title Lempuyang; A5 в FAQ-перечне |
| nusa-penida/content | 13 | 18 → 0 | — |
| sanur/content | 12 | 19 → 3 | title; A5 в spec-строке Andaz; A5 в FAQ[0] |
| seminyak-guides | 16 | 22 → 6 | 4 metaTitle; 2 × A5 (spa meta, spa sectionNote) |
| canggu-guides | 15 | 21 → 6 | 6 metaTitle |
| collections | 36 | 55 → 10 | 9 metaTitle; `CURATION_NOTE` (политика) |
| jimbaran-guides | 11 | 15 → 2 | 2 metaTitle |
| jimbaran/content | 15 | 23 → 0 | — |
| light-districts | 46 | 63 → 2 | 2 title |
| nusa-dua-guides | 9 | 13 → 2 | 2 metaTitle |
| nusa-dua/content | 11 | 20 → 0 | — |
| pillars | 1 | 1 → 0 | — |
| sanur-guides | 13 | 17 → 3 | 3 metaTitle |
| scenarios | 17 | 25 → 7 | 4 metaTitle, 3 heading |
| ubud-guides | 18 | 30 → 4 | 4 metaTitle |
| ubud-things | 11 | 11 → 1 | title |

Что делалось в основном. Длинные тире (226 в изменённых строках → 0) заменены точкой, двоеточием, запятой или скобками. Фразы длиннее 25 слов разбиты. Двойные «X, Y and Z» разобраны. Риторический вопрос в meta (scenarios, «Staying a month in Bali?») убран. «Here's where to book/be/sit» → «Choose by what you want, then book» и т.п. Формула «honest about what each is for» (16 раз) → «and we say what each is for». Практические советы в light-districts вида «Совет — причина» стали «Совет: причина» / «Совет. Причина» (рендерятся обычным `<li>`, по тире не режутся — проверено в `components/LightDistrictLanding.tsx`). Meta description Sidemen и Lovina ужаты до ~155–165 знаков.

## Удалено намеренно (оценки и ярлыки, не факты)

- Популярность и отзывы: «famous for» ×2, «famous» ×5 (tree house, USAT Liberty, ужин в Jimbaran, храмы в scenarios, Tegallalang), «popular with» → «That's why it suits families, long-stay travellers and retirees» (те же группы, популярность → fit), «Bali's most photographed» (Tanah Lot), «The image that put Nusa Penida on every feed», «Bali's best-known» (Rock Bar), «much-photographed» (Ulun Danu Beratan), «some of Bali's best-loved warungs» → «local warungs».
- Hype: «iconic», «hidden» ×2 (Tegal Wangi), «quietly striking» (Puja Mandala), «pure» (Handara), «scenic» (Sidemen), «emerald» → «green», слоган «the two-in-one that defines a Jimbaran stay», «no fuss, no drama», «and let the island come to you», «A genuine headline:», «Be warned:», «Honest caveat —», «tactical advantage», «defining»/«emotional».
- Суперлатив без опоры: «some of Bali's most serious spas» (meta Jimbaran) → «The resort spas on Jimbaran's headland»; предложения «One of the island's signature east-side sights» (Diamond) и «One of Bali's signature dive sites» (Liberty) удалены целиком.
- Soft words и интенсификаторы: proper ×13, signature ×9, serious ×9, actually ×16, very ×7 (в т.ч. «very likely» → «likely» ×2, «very much so» → «yes»), genuinely ×6, genuine, reliable, solid, simply. Замены, где смысл нужно было сохранить: «serious hikes» → «tough hikes», «serious coffee» → «good coffee», «proper/serious swim» → «real swim», «small but solid» → «small but good», «signature tasting menus» → «headline tasting menus» (без определителя фраза стала бы шире: «most of the island's tasting menus»).
- «honest» как самопохвала: 24 → 1. Осталось «the plate is honest» в meta local-and-calm (часть образа, не про нас).
- Из meta убраны пункты: «who it suits» (Sidemen, Lovina), «and honest local eating» (варунги Ubud), «curated:» (дубль «Resident-curated» в meta yoga Ubud).

## Сомнительные факты (не правил, только отмечаю)

- **Противоречие между файлами:** Tegallalang — «~20 min north of Ubud» (`bali-things`) и «North of Ubud (~30 min)» (`ubud-things`).
- **«5 km» про променады**: тест `sanur-p0-boundary` запрещает «5 km» на столпе Sanur как неподтверждённое, но оно живёт в `sanur/content` («roughly 5 km», «~5 km») и в `nusa-dua/content` («commonly cited at around 5 km», «~5 km beach promenade»).
- **Устаревает:** Tandjung Sari — «A July 2026 repair notice was live, so check before booking» (сейчас октябрь).
- **Награды без источника:** «most awarded» spas/treatment rooms (Jimbaran ×2, Nusa Dua ×2), «Award-winning resort spas» (Nusa Dua).
- Turtle Island названа «a turtle conservation island» — статус этого места как природоохранного спорный.
- Часы и расписания: GWK «hourly Balinese dance», «Kecak around 6pm», «Open daily ~8am–10pm»; Water Blow «roughly 9am–5pm»; Museum Pasifika «roughly 10am–6pm»; Devdan «Mon/Wed/Fri/Sat at 7.30pm»; Ubud Palace «around 7.30pm» и «Tickets are sold at the gate in the afternoon»; Kedonganan «around 6–7am»; Muaya «from around 5.30pm»; Batur «around 3.30–4am»; закат в Seminyak «Roughly 6–6.30pm year-round».
- Правила и цены, которые часто меняются: Besakih (единый билет с гидом, саронгом и шаттлом), Sekumpul «since 2025, a mandatory village guide», обязательные гиды в FAQ bali-things, Rock Bar «cashless», «reservation-prioritised».
- Числа: Uluwatu «~70m», GWK «121-metre», Pura Ulun Siwi «believed 18th-century», Goa Gajah «9th–11th-century», Le Mayeur «88 paintings», харбор Sanur «operational since 2022», переправа «30–60 minute», количество номеров отелей Sanur, «Olympic-size beachfront pool», Amed «roughly 10 km», «roughly two to three hours» до Amed, «roughly three hours» до Lovina, Jimbaran «roughly 15–30 minutes» до аэропорта (на странице Jimbaran, по логу district-pages, в CTA «ten minutes»).
- Суперлативы и «известен как»: «one of the world's most accessible wreck dives», «one of Asia's freediving hubs», «Bali's largest Buddhist monastery», «often called the Ubud of a generation ago», «Seminyak invented Bali's sunset-on-the-sand scene», «Bali's original dining strip», «one of the best-value plates in Asia», «one of Asia's best places to eat plant-based», «most kitchens do strong vegetarian and vegan plates», «Bali's original jungle-resort cluster».
- Безопасность без источника в файле: Angel's Billabong «rogue waves have swept people out»; Nusa Penida «ATMs are few and often empty»; «Mantas are present essentially year-round».

## Пропущено и почему

- **8 файлов без правок:** `districts`, `homepage`, `intents`, `moments`, `day-builder`, `start-shortlist`, `trip-missions`, `resort-fnb/index`. В них 0 WARN; это короткие UI-строки (лейблы, hints, теглайны, однострочники карточек), часть подставляется в шаблоны предложений, hero на главной закреплён тестами.
- **Строки с ключом `note`, которые гейт не видит:** экстрактор пропускает ключ `note`, хотя эти строки публичные. Не трогал, чтобы не делать правок вне проверки:
  - `BALI_THING_GROUPS[].note`: «Sea temples, lake temples and holy springs — bring a sarong; most provide one.» и «Evening dance and coffee agrotourism — easy to slot into any base.» (тире);
  - `CANGGU_GUIDES[].groups[].note`: «Bowls, eggs, good coffee — and a seat that lasts.», «Bigger menus and a proper sit-down spread.», «Serious coffee, calmer mornings.», «A proper wind-down after beach and board.».
- **Frozen:** title, metaTitle, h1, heading, sectionHeading, eyebrow, ctaLabel, вопросы FAQ, лейблы зон и регионов — не тронуты.
- **Политика дословно:** `CURATION_NOTE` («No ratings, no paid placements — …»), «Travellers never pay.» во всех meta scenarios. В Canggu «Reserve a table in a tap where you see the Reserve button» формулировка сохранена, только отделена точкой.
- **Оставлено, хотя можно спорить** (линтер молчит, правки были бы вкусовыми): «honest, cheap/affordable warungs» в lede варунгов Canggu и Ubud, «hidden coves» в теглайне Nusa Penida (`pillars`), «add texture to a stay» (Le Mayeur), «tucked just off the main street» (Saraswati), «best known for» (Lovina, Teletubbies Hills), «most-photographed» в intro romantic (там это аргумент про толпы), spec-строки отелей Sanur (fact/bestFor), фрагменты-открытия коллекций («Low light, a good bottle…»).

## Проверка 2 (скептик)

Скептик подтвердил две находки. Исправлены обе, правки минимальные.

- **`lib/bali-things.ts`, Ulun Danu Beratan (`BALI_ICONS[2].blurb`).** После переписывания фраза «cool and misty, so go early for calm-water reflections» стала объяснять ранний приезд туманом, а туман отражения скорее прячет. В оригинале это были два отдельных утверждения: высота даёт прохладные туманные утра, а ехать рано стоит из-за спокойной воды. Разбил на два предложения: «At about 1,200m the mornings are cool and misty. Go early for calm-water reflections.»
- **`lib/nusa-penida/content.ts`, манты (блёрб в `NUSA_PENIDA_THINGS_TO_DO` и ответ в `NUSA_PENIDA_FAQ`).** Замена «very likely → likely ×2» из раздела про интенсификаторы выше была ошибкой: это оценка шансов, а не усилитель, и после замены читатель видел вероятность ниже исходной. Сначала вернул «very likely», но «very» даёт WARN A3 (плотность интенсификаторов: 1 на 52–56 слов при лимите 1 на 100). Поэтому в обоих местах стоит «sightings are highly likely, though never guaranteed»: сила утверждения та же, линтер молчит.
- Гейт `node scripts/copy/check-rewrite.mjs <16 файлов> --ref 3e40897` прошёл с exit 0 и 0 FAIL во всех файлах. WARN: `bali-things` 29 → 4, `nusa-penida/content` 18 → 0.
