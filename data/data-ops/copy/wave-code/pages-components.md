# Волна code: страницы и компоненты — лог переписывания (2026-10-05)

Ветка `claude/pensive-ritchie-f9kkhp`. Ничего не закоммичено, не задеплоено, в БД не писалось.

## Итог

- Гейт `node scripts/copy/check-rewrite.mjs <52 файла> --report data/data-ops/copy/wave-code/pages-components.csv` — **exit 0**: 134 изменённых юнита, 0 FAIL, WARN **229 → 73** (ни в одном файле не вырос).
- Ещё 23 строки гейт не видит (ключ `note` в `AREA_ORDER`/`CLUSTERS` и хвост абзаца на /hotels, начинавшийся с «?»). По ним fact-diff прогнан вручную: PASS; единственный REJECT — ложный `PROPER:If` (слово «If» в начале фразы, это не имя).
- `npx eslint <мои файлы>` — 0 ошибок; `npm run typecheck` — 0; `node scripts/copy/ratchet.mjs` — 181 файл на базовом уровне или ниже; `npm run copy:test` — 150/150.
- Тесты, задевающие мои файлы, зелёные: wave1-home, wave4-homepage, partner-pages-reachable, mobile-touch-targets, performance, publication, wave1-trip, plan-route-hierarchy, canggu-*, ubud/uluwatu/sanur-p0, internal-links, t0-indexability, seo-os, structured-data, metadata-title-template.
- `scripts/wave2-product-boundary.test.mjs` падает 2/5 и на HEAD, и после правок: у /ubud нет `<StartYourShortlist`, в /for-venues нет строк «Pilot free through 21 September 2026» и т. п. К этой волне отношения не имеет.

## Правило для политики и денег

Фраза, в которой есть условие или обещание (бесплатно, комиссии, оплата, ранжирование, «одобряете до публикации», «ничего не храним», гейт публикации, «клик — это намерение»), оставлена байт в байт, включая тире. Из-за этого две ранние правки откатил (for-venues шаг 3, collections «Collections we're still building — …»). На B2B-страницах (for-venues, hotels, villas, list-your-property) переписаны только описательные фразы. Заголовки, title, вопросы FAQ, подписи кнопок и чипов, легенды форм, alt и aria не трогал.

## По файлам (строк изменено · WARN до → после)

| Файл | Строк | WARN |
|---|---|---|
| app/bali-travel-guide/page.tsx | 11 + 5 note | 19 → 0 |
| app/bali/page.tsx | 6 | 8 → 3 |
| app/best-beach-clubs-in-bali/page.tsx | 6 + 3 note | 3 → 0 |
| app/best-cafes-in-bali/page.tsx | 7 + 1 note | 8 → 0 |
| app/best-coffee-in-bali/page.tsx | 4 + 2 note | 7 → 0 |
| app/best-restaurants-in-bali/page.tsx | 5 + 4 note | 7 → 0 |
| app/best-spas-in-bali/page.tsx | 5 + 3 note | 9 → 0 |
| app/best-warungs-in-bali/page.tsx | 7 + 2 note | 8 → 0 |
| app/collections/page.tsx | 2 | 5 → 3 |
| app/for-venues/page.tsx (B2B) | 4 | 8 → 4 |
| app/guides/page.tsx | 4 | 4 → 1 |
| app/hotel-restaurants/page.tsx | 2 | 3 → 0 |
| app/hotels/page.tsx (B2B) | 13 + хвост абзаца | 25 → 10 |
| app/list-your-property/page.tsx (B2B) | 2 | 11 → 9 |
| app/my-day/page.tsx | 1 | 3 → 2 |
| app/page.tsx | 3 | 7 → 4 |
| app/places/[slug]/page.tsx | 2 | 2 → 0 |
| app/places/page.tsx | 2 | 6 → 4 |
| app/things-to-do-in-bali/page.tsx | 4 | 5 → 0 |
| app/villas/page.tsx (B2B) | 10 | 23 → 12 |
| app/where-to-stay-in-bali/page.tsx | 15 | 19 → 1 |
| app/where-to-watch-sunset-in-bali/page.tsx | 7 + 2 note | 7 → 0 |
| components/JimbaranGuideView.tsx | 1 | 1 → 0 |
| components/NusaDuaGuideView.tsx | 1 | 1 → 0 |
| components/landing/DayIntentBuilder.tsx | 2 | 9 → 7 |
| components/my-day/DayBuilderForm.tsx | 4 | 6 → 2 |
| components/resort/HotelRestaurantsHub.tsx | 1 | 5 → 4 |
| components/venue/HotelSections.tsx | 3 | 4 → 1 |

Что осталось в WARN: замороженные title и H2 с тире или вопросом; вопросы FAQ; легенды формы DayIntentBuilder/DayBuilderForm («Where are you today?»); подписи ссылок («Need a trip plan? →», «Need a decision for today? Open Today →»); на B2B — фразы-условия, оставленные байт в байт; несколько A5, где списки и есть содержание (мета /bali, мета /places, мета /for-venues, standfirst /my-day).

## Намеренные удаления (fact-diff показывает как dropped)

- Хайп и самопохвала: «Curated» ×3 и «deep, hand-crafted», «Hand-crafted» (/bali); «honest» (/bali-travel-guide, /guides, /hotel-restaurants); «Practical, honest, no fluff.» и «No fluff, just what actually helps you plan.» (/guides); «Deep» (district guides); «beautiful» (Uluwatu в /where-to-stay, Sanur в /sunset); «genuinely» (hotels, villas); «serious» (кафе, спа); «signature» (/hotel-restaurants, цена массажа в /best-spas); «very» (дёшево).
- Вводные фразы без содержания: «Bali eats extraordinarily well.», «Café culture is one of Bali's great pleasures.», «Bali takes coffee seriously.», «Wellness is one of Bali's great strengths.», «the smart move is to».
- «popular» в FAQ о минимальном чеке (/best-beach-clubs). В FAQ о бронировании (/best-restaurants, /sunset) «popular» оставлен: там это спрос.
- «best» в «are best treated as» (FAQ о бюджете): это оборот, а не утверждение.
- /hotels: из мета-описания (270 → 168 символов) убраны список удобств и «the resident-curated guide» — то и другое есть в OG и на странице. В абзаце про удобства убрано «everything around the pool» (бассейн назван в H3 над абзацем); риторический вопрос «Run a …?» стал утверждением.
- /for-venues, мета: «photos, video» → «media», как в twitter-описании.
- «PROPER:See / Looking / Prefer / Practical» в отчёте — это глаголы и прилагательные в начале фразы, а не имена.

## Сомнительные факты (не исправлял)

1. /where-to-watch-sunset: в FAQ закат в декабре–феврале «about 6:40pm», в чипе на той же странице «~6:35 pm».
2. /things-to-do: «The icons are scattered: temples in the east…» — Танах Лот (запад) и Улувату (юг) тоже в списке.
3. Утверждения о происхождении без источника: «where Bali's beach-club scene began» (Seminyak, beach clubs), «Where Bali's third-wave coffee scene got started» (Seminyak, coffee), «Bali's original fine-dining and long-lunch address» (Seminyak, рестораны), «Bali's original style strip» (/where-to-stay).
4. «gated resorts and safe beaches» (Nusa Dua, FAQ /where-to-stay) — общее утверждение о безопасности.
5. «ethically sourced» (FAQ про Kopi Luwak) — обобщение о всей сцене.
6. «Bali's densest spa scene» (блёрб Seminyak, повторяется на нескольких страницах) — превосходная степень.
7. /villas, шаг 1: «… right here on WhatsApp», хотя основная кнопка страницы ведёт на форму /list-your-property.
8. components/venue/HotelSections: подзаголовок «open to non-guests» показывается у любого отеля с меню ресторана, без проверки по заведению.
9. «The best food in Bali is often the cheapest» (/best-warungs) — редакционное обобщение; оставлено.

## Не правил и почему

- app/plan, app/plan/shared, app/route/[slug], app/bali/[district], app/list/[slug], app/collections/[taste]: признаков машинного текста нет; единственный WARN — динамический title или фраза о политике; строки plan/shared закреплены тестом wave4.
- components: Sanur/Seminyak/Ubud/CangguGuideView, CangguNow, DecisionRail, GuideArticle, BrowseBar, PlanRouteCard, OfferDetail, ScenarioView, StartYourShortlist, TripPlanner, VenueCard — 0 WARN, текст чистый. SimilarPlaces — только подпись `<summary>`. SiteFooter — A7 на SVG-пути (ложное срабатывание), строки бренда закреплены тестом. LightDistrictLanding — только H2. ResortFnbHub — только фраза «Placement can't be bought — …».
- Шаблон мета-описания места `${name} — ${category} in ${district}, Bali.` не трогал: это запасной вариант для заведения без вердикта, и гейт не считает его прозой.
- Текст карточек, коллекций, районов и достопримечательностей живёт в lib/*.ts — это не мои файлы.

## Для следующего прохода

- `check-rewrite.mjs` сопоставляет JSX-юниты по порядку внутри пути `<JSX>`. Если строка становится прозой или перестаёт ею быть (например, исчезает «?» в начале), все последующие пары сдвигаются и дают ложные REJECT. На /hotels абзац пришлось перестроить так, чтобы число юнитов не изменилось.
- fact-diff считает «If» в начале фразы именем, если в исходной строке нет строчного «if». В файлах, где «If» уже начинает какую-то фразу, гейт его пропускает (так на /for-venues).
- Ключ `note` гейт пропускает целиком, хотя на best-*-страницах и в /bali-travel-guide это публичный текст под H2. Стоит убрать `note` из `SKIP_KEYS` или проверять такие строки отдельно.

## Проверка 2 (скептик)

Подтверждено и исправлено 2 замечания (pages-b):

- app/page.tsx, абзац со ссылками на Canggu под кнопкой «Start with Canggu now»: «When you land this week, the …» → «If you land this week, the …». Исходный вопрос «Landing this week?» был условием для тех, кто прилетает на этой неделе; «When» превращал его в допущение для всех читателей главной. «If» возвращает условие и не создаёт риторического вопроса; вторая половина абзаца («Working from here, …») снова звучит параллельно.
- app/where-to-stay-in-bali/page.tsx, AREAS[0].forWho (Canggu) и AREAS[1].forWho (Seminyak): двоеточие заменено обратно на исходное тире. На странице строка выводится после «Best for:», и получалось два двоеточия в одной короткой строке. content-style.md §9 разрешает одно тире в Best for / Not for, так что правка не требовалась гейтом; строки теперь совпадают с 3e40897.

Гейт `check-rewrite.mjs` по всем 14 файлам области (--ref 3e40897): exit 0, 0 FAIL, WARN ни в одном файле не вырос. `npx eslint` по двум изменённым файлам: без ошибок.

## Проверка 2 (скептик) — pages-a

Подтверждено и исправлено 3 замечания (pages-a):

- app/hotels/page.tsx, metadata.description: фраза об условиях партнёрства возвращена дословно: «You add your own details and photos, we review and publish, and travellers reach you directly». Цепочка с точками с запятой и выпавшее «your own» убраны. «your own» указывает, что фото должны быть свои, с правом на публикацию (это есть в STEPS и в OG-описании). Переписано только вступление, вопрос заменён на «Partner your Bali hotel, resort or boutique property with Other Bali, the resident-curated guide.», как на /villas. Хвост «— for your rooms and your restaurant, pool, spa and day pass» в мета-описание не вернул: этот охват сохранён в OG-описании и в standfirst страницы, а описание без него короче. Гейт даёт здесь +1 WARN A5: два перечня «X, Y и Z», и один из них сидит в неизменяемой фразе условий. Общий WARN по файлу 25 → 11.
- app/best-beach-clubs-in-bali/page.tsx, FAQ «Do beach clubs in Bali cost money to enter?»: возвращено «especially at the popular sunset clubs». Здесь «popular» сужает охват до востребованных клубов. Без него требование минимального чека распространялось на все закатные клубы, то есть почти на весь список. Это не запрещённый шаблон «popular with/for». Вариант «busiest» отклонён: fact-diff считает «busy/busiest» новым словом-утверждением.
- app/guides/page.tsx, guide-lede: исправлена грамматика. Было «help you decide … and the island-wide best-of», то есть «best-of» становился дополнением к «decide». Стало «Practical guides to help you decide how long to go and when, and where to stay for the trip you're taking, plus the island-wide best-of.» Слово «lists» не добавлял, потому что с ним предложение становится длиннее 25 слов (A7). Число JSX-блоков не изменилось.

Гейт `check-rewrite.mjs` по всем 14 файлам области (--ref 3e40897): exit 0, 0 FAIL, ни в одном файле WARN не выше исходного (beach clubs 6 → 0, guides 4 → 1, hotels 25 → 11). `npx eslint` по трём изменённым файлам: без ошибок.
