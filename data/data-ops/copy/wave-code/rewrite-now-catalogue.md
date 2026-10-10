# Волна rewrite_now: каталог, /plan, страницы ошибок, llms.txt, запасная meta маршрута

Дата: 2026-10-06. Ветка `claude/pensive-ritchie-f9kkhp`. Ничего не закоммичено, в базу не писалось.

Пункты COVERAGE-AUDIT: C6, C7, C8, C9, C10 (только aria в моих файлах), C11 (только запасная meta маршрута).

Файлы: `app/places/PlacesView.tsx`, `app/PlanView.tsx`, `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/llms.txt/route.ts`, `app/route/[slug]/page.tsx`. Файл `app/places/[slug]/error.tsx` проверен и оставлен без изменений.

## Итог проверок

- `node scripts/copy/check-rewrite.mjs <8 файлов> --ref HEAD`: **exit 0**, изменено 12 единиц, все PASS, 0 FAIL. WARN: PlacesView 5 → 0, not-found 1 → 0, error 1 → 0, в остальных было 0 и осталось 0.
- Гейт показал одно выпадение `LEX:first` в PlacesView: «Best fit first» во фразе-подзаголовке подборки. Порядок сохранён по смыслу («These are the closest matches. The rest are further down.»). Заголовок «Best fit first» в режиме момента не менялся.
- `npx eslint` по 8 файлам: 0 ошибок.
- `node --test scripts/performance-boundary.test.mjs scripts/publication-boundary.test.mjs scripts/mobile-touch-targets.test.mjs`: 27/27. `node --import tsx --test lib/route-view-event.test.ts`: 6/6. Никакой тест эти строки не закрепляет. Grep по `scripts/` и `*.test.*` совпадений не дал.

## Что изменено

C6, `/places`:
- «Best fit first — widen below for the rest.» → «These are the closest matches. The rest are further down.»
- «… published places — every district below, strongest cards first. Pick a district or narrow with the filters above.» → «… published places. Each district below starts with its strongest cards. Pick a district, or narrow the list with the filters above.» Слово «strongest» оставлено: превью района действительно отсортировано по баллу `scoreCatalogueVenue` в `app/places/page.tsx`. Вариант «Pick one» гейт отклонил как новое число (COUNT:one), поэтому «Pick a district».
- «… for your full brief — remove a criterion to widen it.» → «… for your full brief. Remove a filter to see more.»
- «No ranked shortlist for this brief — showing everything that fits.» → «No ranked shortlist for this brief. Everything that fits is below.»
- «… inside this district — but your brief matched nearby:» → «… in this district. These places nearby match your brief:». Вместо «Clear a filter to widen the map.» теперь «Clear a filter to see more.» Карты на странице нет, метафора вводила в заблуждение.

C7, `/plan`:
- «We show one strong fit per daypart first. The full list stays below for travellers who want to compare more.» → «First, one strong fit for each part of the day. The full list is below if you want to compare more.» Ушли «daypart» (жаргон) и «travellers» (§5: говорить с одним читателем).

C8, ошибки:
- 404: «… Nothing is lost — pick up your day from one of these.» → «… You can carry on planning from one of these.»
- error.tsx: «A hiccup on our end, not yours. Try again — or head back and keep planning.» → «The problem is on our side, not yours. Try again, or browse places and keep planning.» Здесь «browse places» повторяет кнопку «Browse places», которая стоит рядом.
- global-error.tsx: «A hiccup on our end, not yours. Reload to try again.» → «The problem is on our side, not yours. Reload the page to try again.»

C9, llms.txt:
- «> with what to order, price anchors and directions. Travellers never pay.» → «> with directions and, where we have them, what to order and a price. Travellers never pay.» Обещание блюд и цены для каждой карточки снято. Цена есть только у ~276 из 1 609 карточек. Новых фактов нет, число строк в блоке то же.

C10, aria (только в моих файлах):
- PlacesView: «Your active brief — choose a chip to remove it» → «Your brief: the filters and search words you chose. Select one to remove it.» Слово «chip» скринридеру ничего не говорит. «Your brief» оставлен, чтобы совпадать с видимой подписью. Перечень «filters and search words» точен: в ряду стоят слова поиска, район, тип, момент, миссия и длительность.
- PlacesView: «Nearby — outside {district}» → «Places nearby, outside {district}».
- not-found: «Popular districts» → «District guides». У слова «popular» нет данных, а ссылки ведут на гайды районов (/canggu, /uluwatu, /ubud, /seminyak, /sanur).

C11, маршрут:
- Запасная meta `A {N}-stop day in {district}.` → `A day in {district}: {N} stop(s), in order.` Факты те же: число остановок и район. Убрана форма «1-stop day»: при одной остановке пишется «1 stop». Слова «in order» подтверждает сама страница маршрута («An ordered sequence of stops»). Срабатывает, только если у маршрута нет `subtitle`.

## Оставлено дословно и почему

- «Ranked by how strongly each place's own record matches this moment.» Это фраза о ранжировании, по правилу программы она остаётся дословно.
- «Travellers never pay.», «Facts are verified; there are no paid rankings.» в llms.txt: политика и деньги, дословно.
- Заголовки H1/H2 не тронуты по жёсткому правилу задачи («do not touch headings, H1»), хотя часть из них названа в C6–C8. Предложения ниже, решение за координатором или основательницей. Страницы ошибок закрыты от индексации (`robots: index false` на 404), так что для поиска правка безопасна. Но правило не делает исключения для H1.
  - `not-found.tsx` H1 «This page slipped off the map.» → предложение: «We can't find this page.»
  - `error.tsx` и `global-error.tsx` H1 «Something went sideways.» → предложение: «Something went wrong.»
  - `PlacesView.tsx` H2 «Top picks for your brief»: обычный заголовок, словарь «brief» (C14).
  - `PlanView.tsx` H2 «Start with the best fits, then open detail if needed.» → предложение: «Start with the best fits, then open the details.»
- `app/places/[slug]/error.tsx`: «This place didn't load» (H1) и «Something went wrong on our side. Try again in a moment.» уже написаны просто, не менял.
- «Nothing matches that combo. Clear a filter.» (/plan) уже простое, оставлено.
- Плашка Uluwatu «New: the full Uluwatu guide → best restaurants, brunch, sunset clubs and a 48-hour plan.» не входит в C6, не менял.

## Вопросы основательнице (C14, только жаргон, не переписывал)

- «Your brief» (подпись ряда фильтров в /places) и «Top picks for your brief». Слово «brief» встречается в 6 строках каталога. Остаётся ли оно голосом бренда, или заменить на «Your filters» / «Top picks for your filters»?
- «Matched because:» перед причинами в топ-подборке. Это понятная подпись, но голос машинный. Возможная замена: «Why it's here:».
- «Decision-first view» (надзаголовок /plan) уже стоит в C14. Это внутренний язык, путешественнику он ничего не говорит.
- Чипы /plan «Best fit», «Backup: …», «Check: …» понятны, но «Check:» перед текстом Not for читается как приказ. Нужно решение по словарю.
- Видимая подпись «Nearby — outside {district}» осталась: короткая подпись интерфейса, тире допустимо.

## Сомнительные факты (замечено, не правил)

- llms.txt: «Facts are verified» стоит дословно как политика. При этом у многих карточек нет `last_verified_at` или статус `needs_verification` (A1/A4 аудита: 369 карточек-шаблонов, 102 без описания). Утверждение сильнее данных. Решать основательнице.
- llms.txt: «A free, curated Bali trip-planning guide» и генерируемые строки «{N} curated places» относятся к вопросу о слове «curated» (C1/C2), не трогал.
- llms.txt: «Places are recommended by the moment they suit (breakfast, sunset, family dinner, work-friendly cafe)». Список моментов не сверял с `lib/moments.ts` и `lib/catalogue-moments.ts`.
- `/plan`: «one strong fit for each part of the day» (как и прежнее «per daypart»). `decisionPicks` обрезается до 4 блоков (`.slice(0, 4)`), так что при 5+ частях дня утверждение неточно. Это унаследовано от старого текста.
- `/places`: превью «strongest cards» — это баллы за заполненность записи (фото, bestFor, цена или блюдо), а не за качество места. Слово «strongest» читатель может понять как оценку качества.
