# Волна «человеческий текст»: `lib/guides.ts`

Дата: 2026-10-05. Ветка `claude/pensive-ritchie-f9kkhp`. Ничего не закоммичено, не задеплоено, в базу не писалось. Трогал только `lib/guides.ts` и этот лог (+ отчёт `guides.csv`).

## Итог

- Изменено **249 строк** во всех 39 гидах (G12 не трогал, см. ниже). `check-rewrite.mjs lib/guides.ts --report …/guides.csv`: **exit 0, все 249 PASS**, fact-diff REJECT нет.
- **WARN 478 → 111. FAIL 3 → 0** (все три в G33 «Which Bali temple»: «stunning» ×2, «famous for» ×1).
- Проверки: `npx eslint lib/guides.ts` — 0; `npm run typecheck` — 0; `scripts/copy/ratchet.mjs` — регрессий нет.
- HEAD за время работы сдвигался дважды (3e40897 — коммит пилотной фразы; 100f53f — district pages); `lib/guides.ts` после 3e40897 в коммитах не менялся, база сравнения та же.

Из 111 оставшихся WARN: 12 — frozen heading/title, 14 — блёрбы `related`/`PILLAR_LINKS`/`GUIDE_GROUPS` (по заданию не трогаются), 30 — вопросы в блоках «Before you book, ask the operator» (A6), 46 — списки «X, Y и Z» с реальным содержимым (места, блюда, типы остановок; A5 считается на строку, дробить ради счётчика не стал), 5 — фразы о политике Other Bali (оставлены дословно), 3 — одобренный пилот G12, 1 — строка маршрута со стрелками в G28.

| Гид | строк | WARN до → после |
|---|---|---|
| G0–G9 (description бесшовных страниц) | 10 | 14 → 0 |
| G10 is-bali-safe | 27 | 47 → 2 |
| G11 nusa-penida-day-trip | 24 | 49 → 7 |
| G12 how-many-days-in-bali | 0 | 3 → 3 |
| G13–G15 (3/5 дней, Canggu без скутера) | 10 | 18 → 4 |
| G16–G19 (7/10 дней, сезон, транспорт) | 29 | 47 → 4 |
| G20–G24 (пары, семьи, «vs») | 22 | 45 → 18 |
| G25–G27 (бюджет, номады, дождь) | 26 | 43 → 8 |
| G28–G33 (Ubud день, Canggu первый день, дети, Sanur/Nusa Dua, Jimbaran, храмы) | 66 | 110 → 17 |
| G34–G38 (day trips) | 35 | 99 → 45 |

Что делалось. Длинные тире (во всём файле 236 → 27; оставшиеся — в frozen-строках, блёрбах ссылок, фразах о политике и G12) → точка, двоеточие, запятая или скобки. Фразы длиннее 25 слов разбиты. Конструкции «The draw isn't X — it's Y», «The mistake isn't X — it's Y», «The risk isn't X — it's Y» переписаны прямо. Пустые зачины убраны: «Here's how…» ×3, «sweet spot» ×3 (замена по одобренной паре: «works well»), «whether you…» ×3, «The honest picture/caveats/catch», «The move is…» ×2, «the winning move», «The secret to…». Шаблонные карточки day trips («Title — …; best for …; watch out for …») разбиты на предложения. Meta description ужаты: все переписанные ≤ ~160 знаков (было до 201).

## Удалено намеренно (оценки, не факты)

- Популярность и отзывы: «famous for» (FAQ Lempuyang), «famous» (T-Rex cliff Kelingking, tree house), «(very) popular and» ×2 (Bali для соло-путешественниц, раздел и FAQ), «popular» (манта-трип → «common»), «it's a favourite» (FAQ Jimbaran), «another sunset favourite» → «another sunset spot» (Tanah Lot). Итого popular 21 → 18, famous 15 → 12, favourite 2 → 0; оставшиеся — про толпы (fit) или во frozen-строках.
- Hype и пустые оценки: «stunning» ×2, «Bali at its most cinematic», «the wow», «Seminyak delivers», «signature experience… hard to beat», «signature night», «memorable» ×2, «buzzy», «the real prize», «a genuine headline draw», «authentic» (meta варунгов), «honest Indonesian food».
- Утверждение без опоры: «and most people find it more than worth it» (Jimbaran).
- Интенсификаторы и soft words: very ×12 (в т.ч. ответ FAQ «Very.» → «Yes.»), genuinely ×5, genuine ×2, actually ×2, «Critically», proper ×5, serious ×2, signature ×2, solid, reliable ×1. «honest» 6 → 2 (остались title G10 и блёрб в `PILLAR_LINKS`, оба frozen). Где смысл нужно было удержать: «serious trafficking» → «major trafficking», «proper shoes» → «good shoes», «a proper dinner» → «a good dinner», «reliable fallback» → «good fallback». Ослабления, которые стоит видеть: «very likely» → «likely» ×2 (манты), «very affordable» → «affordable» ×2, «very early» → «early» ×2 (Batur; так же, как в одобренном абзаце), «very cheap» → «cheap» (метанол).
- Из meta убраны повторы и хвосты: «Sorted by district.» (G7, G8 — дубль «by area»), «the island icons», «Landed in Canggu?», «trying to see all of Bali», «not all day», «how to do it well», «without rushing».
- Строки «dropped» в выводе гейта — только перечисленное выше плюс служебные PROPER (Trying, Prefer, Sorted): это глаголы в начале предложения, которые экстрактор принимает за имена.

## Сомнительные факты (не правил, только отмечаю)

- **Противоречие внутри файла:** G10 «Calmer, family-friendly swimming is on the east and south-east: Sanur, Nusa Dua's protected bay, and Jimbaran Bay» — Jimbaran на западной стороне перешейка; в G32 тот же залив назван «west-facing bay».
- G11: «Ubud, Uluwatu, Amed and Lovina are the furthest from the harbour» — Ubud и Uluwatu примерно в часе от Sanur, как Canggu; далеко только Amed и Lovina.
- G22: Uluwatu «a longer haul from the airport» — обычно Uluwatu ближе к аэропорту, чем Canggu.
- G31: Sanur «a roughly 5 km flat, paved beachfront path» — по логу lib-content тест `sanur-p0-boundary` считает «5 km» неподтверждённым.
- G37 пишет «Gate of Heaven», G33 — «Gates of Heaven».
- G19: meta обещает «what each option roughly costs», а в тексте цифр нет («modest daily rate», «good-value»).
- Привязано ко времени, нужна дата проверки: G10 «Mount Agung has been calm recently»; уровни travel advisory («exercise increased/high caution»); УК «in force from January 2026» и «no marital-status checks at hotels»; G11 «Since late 2022 most boats leave from… Sanur Harbour», первые лодки «around 6.30–7.30am», последняя «around 5pm».
- Без источника в файле: G10 «the number-one cause of tourist injury and death»; G11 «There is no Grab, Gojek or taxi network on the island», «ATMs are few… frequently run empty», «most tours, rentals and eateries are cash-only»; G25 «the same money at a beach club buys a single coffee»; G22 «some of the best surf in the world».

## Пропущено и почему

- **G12 how-many-days-in-bali** целиком и **абзац Batur в G38 (sections[4])** — тексты, одобренные основателем в пилоте (коммит 430e751). 3 WARN в G12 остаются.
- **Дословно оставлены фразы о политике Other Bali:** G34 lede «Other Bali is not a tour marketplace — …», G34 правило «verified Other Bali itinerary only after we check…», блок «The Other Bali rule», ответы FAQ G34 (не бронируемые туры, публикуем только проверенное, «under verification»); дисклеймеры G35 «This page is not a finished itinerary yet — …» и «These are planning notes, not calculated drive times — …», G36/G38 «This page is a route-fit guide, not…»; блёрб `GUIDE_GROUPS` «…not a marketplace».
- **Вопросы оператору** (G11, G35–G38) оставлены прямыми вопросами: это чек-лист, который читатель отправляет водителю, а не риторика. Заменены только тире внутри.
- Headings, titles, eyebrow, FAQ q, slugs, hrefs, `related`/`PILLAR_LINKS`/`GUIDE_GROUPS` — по заданию не трогались (в т.ч. heading «…: the sweet spot» в G18).
- Ровные конкретные строки без признаков генерации не переписывал (churn).

## Проверка 2 (скептик)

Скептик подтвердил 6 находок, исправлены все 6. Правило: вернуть исходный смысл минимальной правкой и сохранить простой голос.

- **G11, манты, абзац и ответ FAQ (стр. 262, 307):** «likely» → снова «very likely» в обоих местах. «Very» здесь задаёт вероятность встречи, это факт, а не усилитель. Ответ FAQ уходит в FAQPage, поэтому ослабление цитировалось бы наружу.
- **G38 Batur, «Best starting areas» (стр. 1653):** возвращено «if you dislike very early transfers». Строка снова дословно совпадает с оригиналом. На «very» держится контраст: Sanur с ранним трансфером против юга и запада с очень ранним.
- **G25 ubud-vs-canggu, «Do both» (стр. 865):** маршрут снова одно предложение, «…in Ubud for culture and calm, then a few in Canggu…». Слово «inland» убрано, чтобы уложиться в 25 слов. Факт не теряется: в lede есть «inland rice terraces», а в секции Ubud сказано «there's no beach».
- **G32 Sanur, «Choose Sanur if…» (стр. 1228):** подлежащее снова Sanur: «Its water on the sunrise coast is calm and swimmable. Its local warungs and cafés have a neighbourhood feel.» Утверждение о спокойной воде больше не распространяется на всё восточное побережье. Вариант из находки с запятыми («Its water, on the sunrise coast, is…, and its…») давал WARN A5: гейт принимает «coast, is calm and swimmable» за второй список. Поэтому здесь два предложения.
- **G28 rainy day, Ubud (стр. 1002):** обрывок «Or an art gallery, or…» заменён полным предложением с глаголом: «Art galleries and a calm hotel day with a tea or coffee tasting work too.» Состав вариантов тот же. Исходный единый список (27 слов) не возвращал, чтобы не нарушать лимит 25 слов.

Гейт `check-rewrite.mjs --ref 3e40897`: 0 FAIL, WARN 478 → 114 (до проверки было 111). Прирост +3 — это WARN A3 (плотность усилителей) на трёх возвращённых «very», которые несут факт. Сознательно оставлены. `eslint lib/guides.ts` проходит, exit 0.

Вне находок, только отмечаю: в G38 sections[1] (стр. 1635) оригинальное «a very early pickup» тоже стало «early pickup». Скептик эту правку не поднимал, поэтому я её не трогал. Если нужна та же логика, что для стр. 1653, её стоит рассмотреть отдельно.
