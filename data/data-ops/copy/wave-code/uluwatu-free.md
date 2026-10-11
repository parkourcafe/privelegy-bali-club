# Волна «человеческий текст»: Uluwatu, 8 заведений без записей batch 1

Дата: 2026-10-05. Ветка `claude/pensive-ritchie-f9kkhp`. Ничего не закоммичено, в базу не писалось.

Зона: `lib/uluwatu/venues.ts`, только 8 записей: `drifter-surf-cafe`, `the-cashew-tree`, `yeyes-warung-uluwatu`, `warung-local-pecatu`, `warung-bu-jonny-uluwatu`, `babi-guling-bali-ayu-pecatu`, `warung-ubay-ungasan`, `dbuchu-bingin`. Остальные 25 записей, шапка и хвост файла побайтно совпадают с `3e40897` (проверено скриптом по границам записей). Менялись только поля verdict, whyHere, whatToExpect, bestFor, notFor, visitContext. Не тронуты: evidence/`ev()`, URL, whatToOrder, priceBand, slug, имена, даты.

## Итог

- `check-rewrite.mjs lib/uluwatu/venues.ts --ref 3e40897`: **exit 0, 38 строк изменено, 38 PASS, 0 FAIL**. WARN по файлу **114 → 101**: все 13 WARN в этих 8 записях сняты (A4 тире ×7, A7 длинные фразы ×3, A10 proper/signature ×3). Новых lint-флагов и POLARITY-предупреждений нет.
- `node --import tsx --test lib/uluwatu/venues.test.ts`: 3/3. `node --test scripts/uluwatu-p0-boundary.test.mjs`: 4/4. `npx eslint lib/uluwatu/venues.ts`: 0.
- Поиск 4-словных фрагментов старого текста по всем 133 тестовым файлам репозитория дал 0 совпадений. Точных дублей новых строк среди прозы `lib/`, `app/` и `components/` нет (совпадает только неизменённый адрес Jl. Pantai Bingin).
- Не изменены, потому что не машинные или не видны гейту: verdict Warung Local, notFor D'Buchu (уже fit с причиной), visitContext Drifter, reservation и atmosphere (короче 4 слов, гейт их не видит; atmosphere нигде не рендерится).

## Что делалось

- Тире заменены двоеточием, точкой или разбивкой фразы. Длинные фразы разбиты.
- verdict теперь начинаются по-разному («Cheap, buffet-style nasi campur at…», «Everything is cooked to order at…», «Indonesian seafood and grilled dishes at…»), раньше все 8 начинались с «A …».
- bestFor: убраны «travellers wanting/after», «lovers», «sunset-hour eaters», «refuel». В каждом поле человек или момент, без точки в конце. Повтор «after a surf» на соседних карточках разведён («once you're out of the water» / «post-surf»).
- notFor: убрано «diners wanting/after», к каждому полю добавлена причина. Причина взята из той же записи (whatToExpect/whyHere), это restatement уровня rung 2 по `field-standard.md`, новых фактов нет. Способы присоединения причины чередуются: because / двоеточие / точка / тире / because / двоеточие / скобки (D'Buchu), три подряд одинаковых нет.

## Удалено намеренно (оценки и популярность, не факты)

- «favoured by local surf instructors» (Bu Jonny, verdict): язык популярности. В evidence только «Listed among the Bukit's local surfer warungs».
- «known for» (Ubay, verdict); «popular servings» и «popular items» (Babi Guling, whyHere и notFor), теперь «Some servings» / «items».
- «reliably good» (Yeye's), «doing one thing well», «done well», «authentic» ×2, «signature» ×2 (Babi Guling, Bu Jonny): неподтверждённая оценка качества.
- «generous portions» ×2 (Ubay, whyHere и bestFor): впечатление без источника, похоже на взятое из отзывов TripAdvisor (это единственный источник identity).
- «the Bingin community table», «the Bukit's surf-culture living room», «the Bukit's easygoing Thursday … night», «the post-surf café»: метафоры и самоназначенный статус.
- «proper» (кофе Drifter), «warm» (публика Cashew), «leafy», «laid-back», «staple», «well looked after».

## Сомнительные факты (не правил, только отмечаю)

У всех 8 записей evidence почти пустой: identity, micro_area и URL. Ниже то, что в тексте есть, а в evidence не подтверждено.

- **Drifter:** «since 2008» и «Javanese limasan». В evidence только живая страница кафе, год и конструкция в заметках не записаны.
- **The Cashew Tree:** «organic», «fitness and yoga space», «long-running» Thursday party. Часы четвергового вечера помечены в evidence как CONFLICTING SOURCES (сторонние сайты: Thu 08:00–00:00), сама «late» вечеринка подтверждена только третьими сайтами. «the café is still trading» проверено 2026-07-19, сейчас октябрь, нужна перепроверка.
- **Yeye's:** «long-running», «well over two decades», «one of the Bukit's originals»: возраст в evidence не записан.
- **Warung Bu Jonny:** «listed among the Bukit's surfer warungs» (формулировка S1-040) — это ссылка на блог серф-кэмпа (`balisurfingcamp.com`), а не на официальный источник. «house sambal» и «takeaway» без источника.
- **Babi Guling Bali Ayu:** «servings can sell out before closing» без источника (обычно так пишут в отзывах).
- **Warung Ubay:** «open through lunch and dinner» — это часы работы без официального источника (источник identity — TripAdvisor). По правилу файла непроверенные часы на страницу не выводятся.
- **D'Buchu:** «family-run», «opens in the late afternoon, dinner only» — часы без официального источника. Отдельно: в `data/data-ops/whatsapp-batch/new-warung-candidates.json` у D'Buchu контакт привязан к аккаунту `dbuchu.ubud` (район Ubud), а в реестре стоит `@d_buchuu` (Bingin). Идентичность и район нужно сверить.
- **Все 8:** `lastVerifiedAt` от июля 2026 (2026-07-14 / 2026-07-19). Дату я не менял: переписывание не является перепроверкой.

## Не делалось

- notFor для Warung Ubay не добавлял: поле отсутствует, а новое поле было бы новым контентом вне гейта.
- DB-строки этих заведений (`venues.why_its_here` и т.д.) не трогал. В `wave-db` черновиков по этим 8 slug нет.

## Проверка 2 (скептик)

Скептик нашёл 15 замечаний к тем же 8 записям. Все 15 исправлены в `lib/uluwatu/venues.ts`. Правки минимальные: где смысл ушёл, возвращена исходная формулировка, потом фраза сглажена. Другие записи, evidence, URL, whatToOrder и даты не тронуты (шапка, Ulu Artisan и хвост файла побайтно совпадают с `3e40897`).

Исправлено:

- **Yeye's, notFor (новое утверждение).** Убрано «You serve yourself from the buffet». Самообслуживание есть только у Warung Local, а whatToExpect Yeye's («point at what you want») ему противоречит. Причина теперь взята из той же карточки: «food comes from a buffet and the seats are by the road».
- **Yeye's, whyHere (утверждение расширилось).** Вернул категорию: «one of the Bukit's original cheap-eats warungs» вместо «one of the Bukit's originals». Фраза начинается с отличительного факта («Open on the Labuansait strip for well over two decades…»). Смена лица исправлена: «a mixed-rice plate of dishes they pick themselves».
- **Yeye's, bestFor.** «casual meals you can repeat» звучало так, будто повторяется само блюдо. Теперь «casual meals several days in a row».
- **Bu Jonny, verdict (новое утверждение).** «Everything is cooked to order» заменено на «A simple roadside warung near the Pecatu surf beaches that cooks to order». В whatToExpect по той же причине убрано «each»: «dishes cooked to order», как в оригинале.
- **Bu Jonny, bestFor (поводы склеились).** Повод для не-серферов вернулся вместе со словом «local»: «a cheap plate after a surf; an unfussy local meal; takeaway».
- **Drifter, bestFor.** «A healthy breakfast» снова отдельный повод: «a healthy breakfast; a post-surf meal; specialty coffee over a long, slow morning».
- **Cashew Tree, bestFor.** Plant-forward meal снова отдельный повод, не только бранч после сёрфа: «a healthy brunch near Bingin after a surf; a relaxed plant-forward meal; the Thursday live-music night».
- **Warung Ubay, bestFor.** Морепродукты больше не ограничены ужином, а ужин не обязан быть рыбным: «a seafood or grilled-fish meal; an inexpensive sit-down dinner in Ungasan; groups who want to share plates». Часы («lunch or dinner») из предложенного варианта в bestFor не переносил, они и так под сомнением.
- **Drifter, whyHere (потерянная оговорка).** Вернул «a kitchen that leans clean and local». Слово «good» заменено на «specialty coffee» из атрибутов этой же записи.
- **Drifter, verdict (подлежащее).** Снова кафе, а не магазин: «An all-day surf-shop café on Jl. Labuan Sait», как в оригинале. Вариант скептика «café in a surf shop» не взял, потому что он дословно повторил бы причину в notFor той же карточки.
- **Cashew Tree, whyHere (грамматика).** «The surf-and-wellness crowd stops here on the way between the beach and the cliff.» Одна аудитория, как в оригинале, и обстоятельство больше не читается как адрес кафе.
- **D'Buchu, whyHere (грамматика).** «In the late afternoon, this relaxed Bingin warung opens for dinner: fresh grilled seafood and everyday Indonesian plates.»
- **Шаблон whyHere у 6 варунгов.** Теперь каждый начинается по-своему: «Open on…» (Yeye's), «You put together…» (Local), «Listed among…» (Bu Jonny), «Roast pork is the speciality…» (Babi Guling), «Sit down to…» (Ubay), «In the late afternoon…» (D'Buchu). Новых фактов нет.
- **Шаблон verdict.** Рамка «<что> at a <прил.> warung <где>» осталась у двух карточек из шести (Yeye's, Ubay). Bu Jonny из неё вышел через исправление выше, поэтому Ubay не трогал.
- **Шаблон notFor «this is a <тип>».** Остался только у Drifter. Warung Local: «meals here are quick and self-serve». Bu Jonny: «because you get a short list of dishes and roadside seating». Способы присоединения причины по варунгам: двоеточие, тире, because, двоеточие, скобки. Трёх одинаковых подряд нет.

Остаточный риск, отмечаю, не правил: verdict Bu Jonny («A simple roadside warung near … that cooks to order») и D'Buchu («A small family-run roadside warung near Bingin that grills…») построены одинаково. Это две карточки, ниже порога «три подряд» из §9, и между ними в списке стоят две другие.

Проверки после правок: `check-rewrite.mjs lib/uluwatu/venues.ts --ref 3e40897` дал **exit 0, 38 изменено, 0 FAIL, WARN 114 → 101**. `npx eslint lib/uluwatu/venues.ts` дал 0 замечаний. `venues.test.ts` прошёл 3/3, `uluwatu-p0-boundary.test.mjs` прошёл 4/4. Ни одна новая фраза больше нигде в `lib/`, `app/`, `components/` и `data/` не встречается.
