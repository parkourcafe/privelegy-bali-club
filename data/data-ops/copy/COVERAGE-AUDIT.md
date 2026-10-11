# Аудит полноты: какой публичный текст программа «человеческий текст» не покрывает

Дата: 2026-10-05. Ветка `claude/pensive-ritchie-f9kkhp`. Только чтение: ни один файл, кроме этого отчёта, не менялся, в базу ничего не писалось.

## Короткий ответ

**Нет, не все тексты.** Программа проверяет три источника:
- поля карточек из краула 28.09: описание, best_for, not_for;
- длинные строки в `lib/**/*.ts`, `app/**/page.tsx`, `components/**/*.tsx`;
- 17 страниц resort.

Это примерно 119 тыс. слов. Вне программы остаются пять групп:
1. **417 карточек из 1 609** не попали ни в один список правок. 369 из них — шаблоны «Restaurant on Jl. …», они отложены решением A.
2. **Поля карточек, которые не проверялись вообще.** Часы, строка над названием, «Good to know», Spend, адрес, меню, маршруты.
3. **Страницы и тексты, которые экстрактор не видит.** Главные метаданные сайта, /about, /together, каталог /places, ошибки 404 и 500, llms.txt, мобильное приложение, листинги в сторах, aria-подписи, короткие подписи интерфейса.
4. **Исключено решением.** Реестр Uluwatu, `lib/hub.ts`, формы и согласия, юридические страницы, заголовки и вопросы FAQ, фразы о политике и деньгах.
5. **Непубличное и не на сайте.** Админка, рассылки владельцам, соцсети.

Важно: даже покрытое ещё не на сайте. Правки карточек — черновики, база не записана. Правки кода живут в ветке, а прод ≠ main (RUNLOG 05.10).

## Что покрыто (для сравнения)

| Источник | Объём | Где |
|---|---|---|
| Карточки, поля why/best/not | 1 192 из 1 609 карточек краула | `stage1/` (35 + 99), `pilot/` (10), `wave-db/` (788, включая 271 «чистую» на перечитку), `wave-spa/` (268) |
| Код | 3 775 единиц, 55,8 тыс. слов; после волн WARN 1 122 → 400, FAIL 12 → 1 | `wave-code/` |
| Resort | 17 страниц, 519 единиц | `wave-code/resort.md` |

Ещё не закончены: Canggu (148), Nusa Dua + Jimbaran (77), спа-часть 6 (нет `spa-6.csv`). Это покрытые, но незавершённые части; ниже их нет.

## Где программа слепа и почему

У экстрактора `scripts/copy/extract-code-prose.mjs` четыре слепых зоны:
- **Список файлов.** Он читает только `lib/**/*.ts`, `app/**/page.tsx` и `components/**/*.tsx`. Не видит `layout.tsx`, `not-found.tsx`, `error.tsx`, `route.ts` (llms.txt), `opengraph-image.tsx`, клиентские компоненты в `app/` (`PlacesView.tsx`, `PlanView.tsx`, `RedeemFlow.tsx`, `onboard/*`), `public/`, `mobile/`.
- **Короткие строки.** Строка короче 4 слов, или строка без служебного слова и без точки, считается «не прозой». Это кнопки, чипы, навигация и короткие заголовки: ~1 800 публичных строк, ~4 200 слов.
- **`aria-*`.** Эти атрибуты пропускаются целиком.
- **Шаблоны с подстановками.** Строка `${…}` выпадает, если подстановок больше трети слов. Так теряются сгенерированные предложения: запасной meta description карточки, вступления хабов, причины в мобильном приложении.

По базе краул даёт только видимые поля карточки. В линт из них пошли описание (`why_its_here` / verdict), `what_to_expect`, `best_for` и `not_for`. Строку над названием, часы, «Spend», «Good to know», адрес и меню никто не проверял. Маршруты, планы, перки и меню из базы в краул-линт не входят вообще.

## Список непокрытого

Слов — примерно. «Решение» — рекомендация аудита:
- `rewrite_now` — можно переписать без новых фактов;
- `needs_facts_first` — переписывание выдумает факт;
- `keep_frozen` — не трогать;
- `not_public` — не публично;
- `needs_founder_decision` — нужно ваше решение.

### A. Карточки мест, не вошедшие ни в один список

| # | Что | Где | Слов | Почему не покрыто | Решение |
|---|---|---|---|---|---|
| A1 | 369 карточек-шаблонов: одно предложение «Restaurant on Jl. X[, open daily …]», без best_for и not_for. На проде 28.09 все с `index, follow` | `venues.why_its_here`. Районы: Ubud 108, Seminyak 75, Kuta 60, Nusa Dua 31, Canggu 30, Uluwatu 28 и др. | ~3 600 | Решение A (05.10): рестораны-шаблоны ждут фактов | `needs_facts_first`. Если после сбора фактов нет ничего сверх Google Maps — вариант B, NULL |
| A2 | 13 карточек с настоящим содержанием, но со «шаблонным» началом. В список не попали, потому что линт отнёс их к семейству `street-template`: amavi-canggu-bali, cafe-coach, mavammy, porch, pranava-yoga, mamu-ubud-cafe-shisha-hookah, dewas-landing-cafe, humans-cafe, lemanja-uluwatu, made-s-bakery-cafe-playground, ula-cafe, uluwatu-collective, de-maison-bali-restaurant-and-bar | `venues.why_its_here / best_for / not_for` | ~500 | Ложное попадание под решение A: факты в карточке уже есть | `rewrite_now`. Править только первую фразу, через `check-cards.mjs` |
| A3 | manga-madu: описания нет, а best_for и not_for машинные («budget travelers wanting…», «diners seeking a fine-dining atmosphere…»). Ещё две пустые карточки: casa-bambu-cantina, blue-mountains-bali (в строке над названием «Unknown») | `venues` | ~30 | Пустое описание: экстрактор карточку не выбрал | manga-madu — `rewrite_now`; две пустые — `needs_facts_first` |
| A4 | 102 карточки без описания. Их meta description строится в коде по шаблону «<Name> — Restaurant in <District>, Bali.». В основном это заглушки из `stubs-99.csv`; список снимает у них только best_for | `app/places/[slug]/page.tsx:185` | ~1 000 | Шаблон с подстановками экстрактор пропускает | `needs_facts_first` |
| A5 | 24 карточки реестра Uluwatu в краул-списке, всего 25 записей реестра. 81 помеченная единица, из них 1 FAIL: Single Fin, verdict «The Bukit's landmark cliff bar…» | `lib/uluwatu/venues.ts`. 8 из 33 записей уже переписаны (`wave-code/uluwatu-free.md`) | ~3 100 | Исключено: идёт проверка батча 1, к предложениям привязаны claim-записи | `keep_frozen` до закрытия батча 1, затем переписать с перепривязкой claim-записей |
| A6 | Карточки, изменённые или опубликованные после краула 28.09, и карточки, открытые не из sitemap | база | неизвестно | Основа всей программы — краул 28.09, а не база. `export-query.sql` выгружает только 131 slug | `needs_facts_first`: нужна полная выгрузка `venues` и повторный `lint.mjs --export` |

### B. Поля карточки, которые никто не проверял

| # | Что видит читатель | Где | Объём | Почему не покрыто | Решение |
|---|---|---|---|---|---|
| B1 | **Часы в машинном формате.** «Mo 07:00-23:00, Tu 07:00-23:00, We …» на 608 карточках; у 88 полночь записана как «23:59». В реестре Uluwatu формат человеческий («Daily 10:00–21:00») | `app/places/[slug]/page.tsx` (блок Hours) показывает строку schema.org из `schemaOpeningHours()`; функции для людей в `lib/opening-hours.ts` нет | 608 карточек | Это форматирование в коде, а не текст поля | `rewrite_now`: форматтер для людей, разметка без изменений. «23:59» оставить как есть, в «midnight» не превращать без источника |
| B2 | **Строка над названием.** Район дважды («Restaurant · Canggu · Canggu») — 536 карточек. Сырые slug и «Unknown» («Restaurant · ubud · Ubud», «Wellness · karangasem», «Restaurant · Unknown · bangli») — 119 | `app/places/[slug]/page.tsx:520` + `venues.area`; в `districtLabel` нет bangli, karangasem, tabanan, denpasar | ~650 карточек | Не текстовое поле | `rewrite_now`: убрать дубль и «Unknown», добавить подписи районов; `area = 'Unknown'` → NULL отдельным списком в базу |
| B3 | **«Good to know» сырыми тегами.** «rain-proof · quiet-enough-to-talk · big-groups · parking» в Practical и Quick decision. 8 тегов | `venues.practical_tags` → `practicalTags.join(" · ")` | ~40 карточек | Массив slug, не проза | `rewrite_now`: словарь «тег → подпись» в коде |
| B4 | **Spend / price_anchor.** 317 значений с текстом: «Chope average 250-400K per person», «$$ · Balinese Massage 60 min 150K», «$$ — relative to the area» | `venues.price_anchor` | ~2 600 | В краул-линт не входило | `needs_facts_first`: цены без даты; правило «prices as of <date>» и формат цены из `otherbali-guide-page-standard` |
| B5 | what_to_order (список блюд) | `venues.what_to_order` | неизвестно | В краул-CSV нет колонки, линт поле не видел | `needs_facts_first`: блюда — это факты. Объём по выгрузке |
| B6 | «From the owner» — слова владельца | `venues.owner_note` | неизвестно (`has_owner_note` в выгрузке E1) | Это голос владельца | `keep_frozen`: по AGENTS §13 слова владельца подписываются, не переписываются |
| B7 | Адрес (Where): 540 адресов в формате Google («…, Kec. Kuta Utara, Kabupaten Badung, Bali 80361, Indonesia»), 119 цепочек через «/», 13 с повторами («Cemagi / Mengwi / Cemagi / Mengening») | `venues.address` | ~9 500 | Данные, не проза | `needs_facts_first`: нормализация адресов — прогон data-ops, правило `otherbali-schema-markup` про `full_address` |
| B8 | Блок меню (202 карточки). «Menu highlights · version 1» — номер версии виден туристу. Под каждым блюдом без описания — «No additional details are listed.» | `components/menu/StructuredMenu.tsx:21`, `MenuItem.tsx:30` | 2 строки × 202 | «· version» короче 4 слов; вторая фраза линт проходит | `rewrite_now`: убрать «version N», фразу-заполнитель показывать один раз или скрыть |
| B9 | Названия и описания блюд в меню. Это текст заведения, бывает индонезийский («Rayakan Hari Kemerdekaan…») | `menu_items.name / description` | ~400 описаний в пакете импорта | Чужой текст | `keep_frozen`: источник — меню заведения |
| B10 | availability_note у блюд; заголовок раздела «Review subset» — у 92 из 127 меню в пакете импорта | `menu_items.availability_note` (38 в пакете), `menu_sections.name` | неизвестно / 92 раздела | Не в краул-линте | availability_note — `rewrite_now` по выгрузке. «Review subset» не публиковать как есть: служебная метка станет заголовком на странице |
| B11 | Маршруты: подзаголовок (он же meta description, например «Good wifi, good coffee») и заметки у остановок из базы («Start at the holy spring for melukat -- go early…», «the Ubud restaurant that popularised Balinese crispy duck») | `routes.subtitle` (8), `route_stops.note` (7, рендерятся на /route/*) | ~150 | Таблицы не в краул-линте; заметки из `lib/route-stops.ts` покрыты, из базы — нет | `rewrite_now` для подзаголовков и заметок; названия маршрутов — `keep_frozen` |
| B12 | /plan: короткая строка у места, когда нет best_for | `plan_entries.blurb` (Canggu) | неизвестно | Не в краул-линте | `rewrite_now` по выгрузке |
| B13 | Перки: «15% discount», условия очищены | `perks.title / terms` | десятки строк по 2 слова | Деньги и предложения | `keep_frozen` (решение 04.08, `bpc-perks-retitle-2026-08-04.sql`) |
| B14 | Подписи кнопок действий («Reserve», «Order on GoFood», «Official menu») | `venue_action_capabilities.label` | короткие | Контракт действий | `keep_frozen` |

### C. Страницы и тексты, которые экстрактор не видит

| # | Что | Где | Слов | Почему не покрыто | Решение |
|---|---|---|---|---|---|
| C1 | **Описание сайта по умолчанию:** «Discover Bali together with resident-curated places, routes and practical plans for every moment. Less searching. More Bali.» Оно же в OG/Twitter, в JSON-LD WebSite, в PWA-манифесте и на OG-картинке («Resident-curated places, routes and plans for every Bali moment.») | `app/layout.tsx`, `public/manifest.webmanifest`, `app/opengraph-image.tsx` (`twitter-image.tsx` её реэкспортирует) | ~120 | `layout.tsx` и `public/` вне списка файлов | `needs_founder_decision`. «resident-curated» уже снято с meta Nusa Dua как неподтверждённое, но осталось в главном описании и в описании гайдов: нужна одна позиция по этому слову и по слогану |
| C2 | **Листинги в App Store и Google Play** (EN): «resident-curated decision and planning guide», список функций | `docs/store-submission-package.md` (App Store, Google Play; RuStore — по-русски) | ~650 | Вне сайта и вне программы | `needs_founder_decision`: правка уходит на повторное ревью стора |
| C3 | **/about.** Отвечает 200 на проде, есть в sitemap, индексируется (title «About Other Bali»). В ветке исходника нет: ни `app/about`, ни упоминания в доступной истории (клон неполный) | только прод | неизвестно | Прод собран не из этой ветки | `needs_founder_decision`. Найти исходник; после деплоя main страница, вероятно, отдаст 404 |
| C4 | **/together.** Статичный бандл-макет, есть в sitemap, индексируется. На странице видны служебные пометки дизайнера: «Actual place-sharing states · one button width and aria-live status», «Closing the system share sheet returns to the guide and is not treated as an error.» Плюс обещания о приватности и ранжировании («Does sharing make a place rank higher?») | `public/together/index.html`, rewrite в `next.config.ts:82` | ~700 | `public/` не сканируется; текст внутри JS-бандла | `needs_founder_decision`: убрать служебные пометки, решить судьбу страницы; фразы о политике — дословно |
| C5 | **Мобильное приложение и его API** — самый «машинный» текст продукта: «No client-side ranking was substituted», «Map view awaits route-safe coordinates from the shared Place contract», «No map region can be downloaded until all three Level 3 capabilities are verified», «Mapbox Level 3 remains disabled until physical iOS and Android acceptance gates pass», «Offline · last updated 2026-…T…Z» (сырой ISO) | `mobile/src/App.tsx`, `SelectionExperience.tsx`, `app/api/mobile/v1/*`, `lib/mobile-api/discovery.ts:222`, `lib/journey/offline-sync.ts:108`, `mobile/public/offline.html`, `ios-web/offline.html` | ~1 400 | `mobile/` и `app/api/` вне программы | `needs_founder_decision`: выпуск через стор, много фраз о приватности и ранжировании. Описательные состояния можно переписать сразу после «да» |
| C6 | **Каталог /places** (и 71 страница пагинации): «Your brief», «Top picks for your brief», «Best fit first — widen below for the rest», «every district below, strongest cards first», «Matched because:» | `app/places/PlacesView.tsx` | ~380 | Клиентский компонент вне `page.tsx` | `rewrite_now`. Фраза «Ranked by how strongly each place's own record matches this moment.» — про ранжирование, оставить дословно |
| C7 | **/plan:** «Decision-first view», «We show one strong fit per daypart first. The full list stays below for travellers who want to compare more.» | `app/PlanView.tsx` | ~70 | Вне списка файлов | `rewrite_now` |
| C8 | **Ошибки:** «This page slipped off the map.», «Something went sideways.», «A hiccup on our end, not yours.», «This place didn't load» | `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/places/[slug]/error.tsx` | ~150 | Вне списка файлов | `rewrite_now` |
| C9 | **llms.txt** — что читают AI-краулеры: «…with what to order, price anchors and directions. Travellers never pay. Facts are verified; there are no paid rankings.» Строка «what to order, price anchors» обещает больше, чем есть: в краул-статистике цифра цены есть у 276 карточек из 1 609. Это тот же тип ложного утверждения, что D1 убрал из `lib/hub.ts` | `app/llms.txt/route.ts` | ~45 + сгенерированные строки | `route.ts` вне списка | `rewrite_now` для фразы про блюда и цены (прецедент D1). «Travellers never pay», «no paid rankings», «Facts are verified» — политика, дословно |
| C10 | **aria-подписи** (их читают скринридеры): «Plan page role», «Bali districts signal», «{hub.name} signal», «Result view», «{name} editorial scene», «Operator preview», «Your active brief — choose a chip to remove it» | ~25 файлов в `app/` и `components/` | 62 строки, ~180 | `aria-*` пропускаются целиком | `rewrite_now`. Тестами закреплены только «Move … earlier/later» в `TripPlanner` (`scripts/wave1-trip-boundary.test.mjs`) и подпись логотипа (`OtherBaliLogo.test.mjs`) — их не трогать |
| C11 | **Шаблоны с подстановками:** запасная meta маршрута «A {N}-stop day in {district}.» (`app/route/[slug]/page.tsx:69`); «{priceText} (reported, as of …)» (`OfferDetail.tsx:29`); «Last checked …» (`CangguGuideView.tsx:100`); title места `lib/seo/venue-metadata.ts:16` | разные | ~60 | Больше трети слов — подстановки | Запасная meta маршрута — `rewrite_now`; title — `keep_frozen`; остальное нормально. Экстрактор стоит научить видеть такие строки |
| C12 | **Страницы предложений resort:** /day-passes/* и /brunches/* (15 страниц). Редакционные заметки с оценками и ASCII-тире: «A solid official family day pass -- …», «A strong pick…», «A genuinely transparent offer», «One of the most expensive regular brunches in the area», «with strong terms for children» | `data/resort-import/offers.json` (поля `editorialNote`, `whatsIncluded`, `scheduleText`, `priceText`), собирается `scripts/import-resort-csv.ts` | заметки 215; факты ~350 | Программа читает только `pages.generated.json` (хабы), а не детальные страницы | `editorialNote` — `rewrite_now`: оценки снять, не добавлять. Править в исходнике импорта, иначе перезапишется. Состав, цены, часы — `keep_frozen` |
| C13 | Короткий текст интерфейса (кнопки, чипы, навигация, короткие заголовки, подписи карточек) | `app/`, `components/`, `lib/navigation.ts` и др. | ~1 800 строк, ~4 200 | Короче 4 слов или нет служебного слова | `keep_frozen`: подписи кнопок и чипов — решение 05.10; английские подписи навигации — ключи переводов в `lib/i18n` |
| C14 | Внутри C13 — ~30 строк продуктового жаргона: «Maps handoff», «Ferry handoff», «Deepest local layer», «One verified town anchor», «Your map brief», «Your next decision», «Decision-first view», «Resident-curated.», «Editorial order» | там же | ~100 | То же | `needs_founder_decision`: это словарь продукта («brief», «fit», «moment», «handoff»). Нужно решить, какие слова — голос бренда, а какие — внутренний язык |
| C15 | Служебные данные хабов resort: JSON-LD, «related», заголовки таблиц | `data/resort-fnb/pages.generated.json` | ~840 | Не входят в `resortUnits()` | `keep_frozen`: это названия и заголовки |

### D. Исключено решением (в программе сознательно не трогается)

| # | Что | Где | Слов | Причина исключения | Решение |
|---|---|---|---|---|---|
| D1 | Хабы и споки районов: «Other Bali tracks {N} places in {X} — … clustered around …» и ответы FAQ. Ответ спока «browse {noun}, prices and directions at no cost» обещает цены, которых в карточках часто нет | `lib/hub.ts` → /bali/[district], /bali/[district]/[intent] (в sitemap) | ~150 шаблонного текста × число хабов и споков | RUNLOG 05.10: «не трогаем `lib/hub.ts`» | `needs_founder_decision`. Шаблоны можно переписать без новых фактов; ответы FAQ про оплату — политика, дословно; «prices» — та же ошибка, что D1 убрал |
| D2 | Формы и согласия: заявка заведения, отеля и виллы, загрузка фото, форма гайда, баннер согласия. 40 помеченных единиц | `components/VenueSubmissionForm.tsx`, `PropertySubmissionForm.tsx`, `PropertyMediaUploader.tsx`, `GuideLeadForm.tsx`, `ConsentBanner.tsx` | ~980 | «формы и согласия» | `needs_founder_decision`: подсказки к полям можно переписать, текст согласий — только дословно |
| D3 | Юридические страницы | `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/privacy/choices/*` | ~2 000 | «юридические страницы»; путь в `SKIP_FILES` | `needs_founder_decision`: правит юрист, не стилист |
| D4 | Онбординг владельца по приватной ссылке: формы профиля, черновики, согласие на фото | `app/onboard/[token]/PartnerProfileForm.tsx`, `OnboardActions.tsx`, `PartnerMaintenanceDrafts.tsx` | ~1 200 | Вне списка файлов; формы и согласия | `needs_founder_decision`: это первое, что видит владелец из рассылки |
| D5 | Погашение предложения по QR у заведения: согласие, «What did you order? Was it worth it?», «Worth it / Meh / Skip» | `app/v/[venue]/redeem/RedeemFlow.tsx` | ~225 | Вне списка файлов; старый слой Offer, согласие | `needs_founder_decision` |
| D6 | B2B-страницы: фразы об условиях, деньгах, ранжировании, публикации. Описательные фразы уже переписаны; осталось 32 помеченные единицы | `app/for-venues`, `hotels`, `villas`, `list-your-property` | ~2 000 всего, переписана часть | «формулировки о политике и деньгах» | `keep_frozen`: дословно |
| D7 | Заголовки, H1, meta title, вопросы FAQ, slug. 95 помеченных, из них 91 — за длинное тире, что для заголовка нормально | код и resort | ~960 единиц, ~6 000 | Риск для позиций в поиске | `keep_frozen` |
| D8 | Переводы интерфейса (id, zh, ko, fr, ru) | `lib/i18n/dictionaries.ts` | ~1 200 | Не английский; ключи — английские подписи | `keep_frozen`: менять английскую подпись — значит ломать перевод. Переводы требуют человеческой проверки (AGENTS, locale note) |
| D9 | Предзаполненные сообщения WhatsApp и шаринга: «Hi {venue}! I'd like to request a table. I found you on Other Bali.», «Hi Other Bali 👋 I'd like to add my villa…» | `lib/integrations/whatsapp.ts`, `lib/contact.ts`, `components/GuideLeadForm.tsx:109`, `ShareButton.tsx` | ~150 | Шаблон с подстановками; транзакционный текст | `keep_frozen`: «I found you on Other Bali» — подтверждение для партнёра (атрибуция); текст уже естественный |

### E. Не публично или не на сайте

| # | Что | Где | Слов | Решение |
|---|---|---|---|---|
| E1 | Кабинет партнёра (за входом, закрыт в robots) | `app/partner/*` | ~1 500 | `not_public` |
| E2 | Админка, служебные письма оператору, сообщения проверок | `app/admin/*`, `lib/notify.ts`, `app/api/venue-submission`, `app/api/onboard/profile`, `components/admin/freshness-model.ts` | ~3 500 | `not_public` |
| E3 | Превью для разработки (в проде `notFound`), офлайн-каталог (не используется, когда база подключена), realm App Review в `proxy.ts` | `app/dev/*`, `lib/seed.ts`, `proxy.ts` | ~900 | `not_public` |
| E4 | Русские заметки оператора в resort-импорте: видны только в режиме `owner_prelaunch`, в whitelist 0 заведений | `data/resort-import/venues.json` | — | `not_public` |
| E5 | robots.txt, sitemap — прозы нет | `app/robots.ts`, `app/sitemap.ts` | 0 | `not_public` |
| E6 | Вне сайта: черновики соцсетей (`docs/social/*`, `docs/uluwatu-social-launch.md`, `docs/marketing/*`, ~8 600 слов), рассылки владельцам (`data/data-ops/whatsapp-batch/`, скилл `venue-reverse-magnet`), письма входа Supabase (шаблоны в панели Supabase, в репозитории их нет) | — | ~8 600 + | `not_public` для сайта. Если основательница хочет единый голос и там — отдельное решение и отдельный проход |

## Что сделать, по порядку

1. **Без новых фактов и без риска (`rewrite_now`), ~2 000 слов плюс исправления отображения в коде:**
   - часы для людей (B1);
   - строка над названием (B2);
   - словарь тегов «Good to know» (B3);
   - «version N» в меню (B8);
   - каталог /places (C6);
   - /plan (C7);
   - страницы ошибок (C8);
   - фраза про блюда и цены в llms.txt (C9);
   - aria-подписи (C10);
   - редакционные заметки 15 предложений resort (C12);
   - 13 карточек с шаблонным началом (A2) и manga-madu (A3);
   - подзаголовки маршрутов и заметки у остановок (B11).
   
   Ворота — те же: `check-rewrite.mjs` / `check-cards.mjs`, фразы о политике дословно.
2. **Решения основательницы:**
   - слово «resident-curated» и слоган в главном описании, манифесте, OG и сторах (C1, C2);
   - /about (C3);
   - /together (C4);
   - мобильное приложение (C5);
   - продуктовый жаргон (C14);
   - `lib/hub.ts` (D1);
   - формы, онбординг, QR (D2, D4, D5);
   - юридические страницы — к юристу (D3).
3. **После выгрузки базы** (полная `venues` + `routes`, `route_stops`, `plan_entries`, `menus`, `menu_items`):
   - повторный `lint.mjs --export` — закроет A6 и измерит B5, B6, B10, B12;
   - в тот же прогон — нормализация адресов (B7) и цены с датой (B4) через `otherbali-data-ops-run`.
4. **Ждут фактов:** 369 карточек-шаблонов (A1) и 102 карточки без описания (A4) — по решению A.
5. **Экстрактор** (чтобы следующий аудит не повторял эту работу руками):
   - добавить `app/**/*.tsx` кроме `api|admin|dev|partner`, `app/**/route.ts`, `public/together`, `mobile/src`;
   - убрать `aria-label` из пропуска;
   - шаблоны с подстановками проверять по тексту без подстановок;
   - короткие строки отдавать отдельным отчётом «chrome».

## Как считалось

- Каждая строка и каждый текстовый узел JSX в `app/`, `components/`, `lib/` и `proxy.ts` (20 634 строки) разобраны тем же парсером TypeScript, что и в экстракторе. У каждой записана причина, по которой экстрактор её пропускает: файл вне списка, файл в `SKIP_FILES`, атрибут, ключ, короче 4 слов, нет служебного слова, шаблон. Скрипт и выход лежат в рабочей папке и в репозиторий не входят.
- Текущее состояние кода: `lint.mjs --places … --code --resort` в рабочую папку, отчёт в репозитории не перезаписан. Итог: код 3 775 единиц, FAIL 1, WARN 400.
- Карточки: slug из `*.input.json` всех волн и `surface = db` из трёх CSV-списков сверены с 1 609 карточками краула. Непокрытые разобраны по семейству из `queue.csv`, по наличию best_for и not_for и по числу предложений (сокращения «Jl.», «No.» не считаются концом предложения).
- Видимые поля карточек (часы, строка над названием, Spend, «Good to know», адрес, меню) взяты из `places.csv` и проверены по сохранённым страницам в `docs/audits/2026-09-28-web/raw/`.
- Маршруты, планы, перки и меню — по миграциям, `lib/data.ts` и пакету импорта `data/data-ops/compiled/candidates.json`. Живую базу этот аудит не читал (доступа нет), поэтому числа по B5, B6, B10, B12, A6 неизвестны.
- /about и /together: адреса краула с ответом 200 сверены с маршрутами в `app/`. Для /about исходника в ветке нет; клон неполный (`--is-shallow-repository = true`).
