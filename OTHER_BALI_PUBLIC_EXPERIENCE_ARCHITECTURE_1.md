# Other Bali — Public Experience Architecture

**Версия:** 1.1 (reconciled + accepted)
**Дата:** 22 июля 2026
**Статус:** ПРИНЯТ как experience-слой продукта — уровень «утверждённые постраничные спеки» в иерархии master v3.2 (§24.1, п.4). Внешний вердикт: **accepted as v1.0**; четыре дополнения ревью внесены в v1.1 (§19–§22 + hero-связка) — D-008. При конфликте выигрывают канон решений и Unified Master v3.2; этот документ детализирует их до уровня копирайта, шаблонов страниц и навигационных правил. Исполнительный пакет: `other-bali/pea-implementation-pack-v1.md`.
**Источник:** внешний драфт «идеальной публичной архитектуры» (22.07), сверенный с master v3.2, Addendum C1 и Decision Log (D-007, D-008).
**Язык:** внутренняя рамка — Russian; публичный копирайт — English (копируется в продукт как есть).

---

# 0. Сверка драфта с каноном: что изменено и почему

Драфт принят почти целиком — он не противоречит ядру V3.2, а достраивает публичный слой. Изменены только точки трения с уже принятыми решениями:

| # | В драфте | Канон | В PEA v1.0 |
|---|---|---|---|
| 1 | На главной нет партнёрского входа | Коррекция №7 / T1: 2 двери + видимый вторичный вход партнёра | Hero = 2 CTA; вход «I run a place» остаётся видимым вторичным (header/footer → /for-venues + «Check your venue page») |
| 2 | Section 3 — «три двери» (добавлена Where to stay) | Hero-fork = 2 двери | Не конфликт: hero остаётся 2-дверным; «три decision-jobs» — блок ниже fold. Where to stay принят как третий job контента |
| 3 | Saved = `/me` | Master §5: `/my-bali` | `/my-bali` (label — Saved / My Bali) |
| 4 | `/for-villas` | Live: `/villas` (деплой 20.07) | Контент принят полностью; URL остаётся `/villas`; переименование — только через Redirect Register |
| 5 | `/[district]/best-restaurants` и т. п. | Live: `/bali/[district]/[intent]`; preservation-правила §19 | Целевой паттерн зафиксирован как **кандидат**; выбор и редиректы решает Migration Map V1, не этот документ **[ПРОВЕРИТЬ]** |
| 6 | Rollout: сразу nav-fix + hero | Коррекция №10: T0 — единственный первый инженерный таск | Копирайт и шаблоны готовятся сейчас; код — после документированной T0-диагностики. Rollout замаплен на существующие волны (§16) |
| 7 | Карточки «Explore by what you need» | C1-1: входы = launch shortcuts, не термины Scenario | Приняты как need-пресеты shortcut-слоя; словарь — Taxonomy V1 |
| 8 | /for-venues: «pays only when commercial model is activated» | Money-model канон: платный продукт уже определён | Копия /for-venues использует канон: **fixed fee per confirmed seated reservation** (T6) |
| 9 | Nav: Explore = `/places` | Master: Explore ⊃ Places · Experiences · Events · Areas · Guides | Допустимо как текущий горизонт (live); целевой `/explore` — по master §5, мост — Migration Map |
| 10 | Hero H1 версии A/B/C | Публичное обещание master: «The right place for the moment you're in» | **Связка вместо выбора (D-008):** eyebrow = brand tagline, H1 = версия A. Подтверждение связки — ревью 28.07 |
| 11 | Nav-баг: «Uluwatu & the Bukit» → `/uluwatu-sunset-kecak` | Новый [ИЗВЛЕЧЕНО]-факт драфта | Зарегистрирован задачей; предусловие — проверить, что pillar `/uluwatu` существует **[ПРОВЕРИТЬ]** |

Всё остальное — позиционирование, доктрина, trust-блок, шаблоны страниц, /my-day-спека, метрика organic decision rate, QA-модель — принято.

---

# 1. Product promise и доктрина

## 1.1. Позиционирование одной фразой

> **Other Bali is a Bali decision layer: it turns tourist uncertainty into a short, trusted next step — where to stay, where to go now, what to do today, and how to plan the trip.**

## 1.2. Promise-стек

**Primary promise (H1-уровень):**

> Choose the right Bali place, area or day plan — without endless lists.

**Support promise:**

> Tell us your area, mood and timing. Other Bali gives you a short, practical shortlist with why it fits, what to check, and where to go next.

**Trust promise:**

> No paid ranking. No copied reviews. No fake "top 100". Selected guidance for real traveller decisions.

**Brand tagline (сохраняется из master):**

> The right place for the moment you're in.

Что продукт продаёт туристу: **меньше хаоса → быстрее правильное решение.** Не «места на Бали», не «лучшие рестораны», не «гайд».

## 1.3. Доктрина четырёх «не» (принята дословно)

- **Not a directory.** Directory отвечает «what exists?». Other Bali отвечает «what fits my situation, and what should I do next?»
- **Not a booking platform.** Booking владеет availability, payment, confirmation, cancellation. Other Bali владеет **decision, explanation, trusted handoff, attribution.**
- **Not an article farm.** Ферма делает страницы под keywords. Other Bali создаёт страницу только когда есть: real traveller decision + enough evidence + useful next action.
- **Not a review site.** Review-сайт спрашивает «what do strangers rate highest?». Other Bali спрашивает «what fits this trip, this area, this time, this group?»

---

# 2. Audience roles

| Роль | Ситуация | Первая поверхность |
|---|---|---|
| Tourist now | Уже на острове, нужно место сегодня | Today (/my-day) |
| First-time planner | Первая поездка, всё непонятно | First-time path + Plan |
| Area chooser | Выбирает базу/район | Where to stay + district pillars |
| SEO visitor | Пришёл с конкретным запросом | Decision page (best-X, versus) |
| Villa / concierge guest | QR в вилле/отеле | First day / Find a place today |
| Venue owner | Увидел свою страницу / получил outreach | /for-venues + claim flow |

---

# 3. Homepage architecture

Главная — не портал, а **демо продукта**. За 10 секунд она доказывает: сайт понимает ситуацию → не показывает списки → помогает выбрать → ему можно доверять.

## Section 1 — Hero (copy-ready, hero-связка — D-008)

~~~text
Eyebrow (small line above H1):
The right place for the moment you're in.

H1:
Choose the right Bali place, area or day plan — without endless lists.

Subheadline:
Tell us your area, mood and timing. Other Bali gives you a short, practical
shortlist with why it fits, what to check, and where to go next.

Primary CTA:   Find a place for today
Secondary CTA: Plan my Bali trip

Trust line:
No paid ranking · No copied reviews · Fit notes over hype · Practical actions only
~~~

**Связка вместо выбора (D-008):** brand poetry сохраняется в eyebrow, hero остаётся конкретным. Версия B не отброшена, а поглощена: её строка живёт как eyebrow (в канонической формулировке master-tagline), её trust-тон («Selected, not sponsored») — в trust-блоке Section 7. «Resident-curated» из hero trust line убран — этот claim допустим только рядом с объяснением «how we choose» (guardrail §20).

Правила hero (канон): ровно 2 туристические CTA; партнёрский вход «I run a place» — видимый вторичный элемент (header/footer), не третья hero-дверь; каждая строка trust line обязана быть буквально истинной (honesty канон); claims с социальным доказательством («Resident-curated», «recommended by locals») — только рядом с объяснением процесса (§20).

## Section 2 — Product demo: «Try a Bali decision»

Ключевой недостающий блок. Статичная демонстрация decision-логики:

~~~text
Try a Bali decision
See how Other Bali turns a vague Bali plan into a practical next step.

Example input:
I'm in Uluwatu · with my partner · want sunset and dinner

1. Compare sunset spots
   Best if you want golden hour with a full setting.
   Not ideal if you only want a quick temple stop.
   CTA: Compare Uluwatu sunset spots

2. Pick a date-night dinner
   Quiet, view-led and occasion restaurants separated from general "best restaurants".
   CTA: Choose a dinner

3. Consider Temple + Kecak
   Best if culture is the main event, not a beach-club afternoon.
   CTA: Plan Temple + Kecak

CTA: Build my own shortlist
~~~

Правило честности: примеры в демо — только реальные опубликованные карточки/гайды; вариативные факты не утверждаются, а помечаются «check before going».

## Section 3 — Decision jobs (ниже fold)

**What are you trying to decide?**

| Job | Пользователь | CTA |
|---|---|---|
| I'm in Bali now | Нужно место сегодня/вечером | Find a place now |
| I'm planning a trip | Нужны районы, маршруты, длина поездки | Plan my trip |
| I'm choosing where to stay | Нужно сравнить районы/базу | Compare areas |

## Section 4 — First-time path

**First trip to Bali? Start here.** Карточки: Where should I stay? (сравнение Canggu/Seminyak/Uluwatu/Ubud/Sanur → Choose your base) · How many days do I need? (3/5/7/10 → Pick trip length) · Can I do Bali without a scooter? (→ Plan without a scooter) · What should I do on day one? (→ Open first-day plan) · Build a simple plan (→ Plan my trip).

## Section 5 — Area decision layer

**Choose the part of Bali that fits your trip.** Единая структура карточки района:

~~~text
Area name
Best for: …
Not for: …
Start with: [district pillar]
~~~

Примеры: Uluwatu — best for cliffs, surf, sunsets, dramatic dinners; not for walking everywhere. Canggu — best for cafés, social energy, surf, work-friendly days; not for calm traffic-free Bali. Ubud — best for culture, jungle, wellness, slower days; not for beach days.

## Section 6 — Explore by what you need

Вместо только внутренних категорий — карточки туристских вопросов (это **need-пресеты shortcut-слоя**, C1-1; не термины Scenario): Where to eat well · Where to watch sunset · Where to spend a beach day · Where to reset · What to do with kids · What to do when it rains · Where to go for date night · Where to work from a café.

## Section 7 — Trust block

**How Other Bali chooses** (полный текст — §9).

## Section 8 — Save / My Bali

**Keep your Bali shortlist in one place.** «Save places and guides as you plan. Use them later when you're choosing dinner, building a day or comparing areas.» CTA: Start saving places / View my shortlist.

---

# 4. Today tool — `/my-day`

Самая важная продуктовая поверхность. Это не guide — это «I'm here now» decision tool. URL остаётся `/my-day` (D-005: ревизия на месте; redirect на /today — только по правилу Phase 4).

## Структура

**H1:** Find a place for today in Bali
**Sub:** Answer a few quick questions. Get a short list that fits your area, company, mood and timing.

**Inputs (пресеты, порядок фиксирован):**

~~~text
Where are you?        [All Bali] [Canggu] [Uluwatu] [Ubud] [Seminyak] […]
Who are you with?     [Solo] [Couple] [Family] [Friends]
What do you want?     [Quiet] [A view] [Local] [Lively] [Reset]
Budget?               [Keep it cheap] [Mid-range] [Treat ourselves]
How should it end?    [Sunset] [Dinner] [Something special] [Early night]
~~~

**Visible selected state (обязателен — без него инструмент «ощущается фейком»):**

> Your shortlist: **Uluwatu · Couple · A view · Sunset**

**Результат — ровно три слота:**

1. **Best first choice** — why it fits · not ideal if · check before going · next action (Maps / View place / Save).
2. **Backup nearby** — why it fits · not ideal if · next action.
3. **If you want something different instead** (контраст-вариант: культура вместо пляжа и т. п.).

**Transparency line (обязательна):**

> This is not a paid ranking. Results come from published Other Bali pages and verified-enough place data. Check volatile details before going.

Канон-правила: «Fits this moment», никогда не «open now» без verified hours; `check before going` — для вариативных фактов вместо их утверждения; выдача только из published-карточек.

---

# 5. Plan (кратко — детали в master §4.5)

`/plan` = pre-trip: trip length 3/5/7/10 · ready-made routes · day-builder-пилоты. Не дублирует Today. First-time path главной ведёт сюда.

---

# 6. District pillar template

Каждый pillar отвечает «Should I spend time or stay here?», а не «вот гайд по району».

~~~text
H1: Is [District] the right Bali base for you?

Above the fold:
Best for: …
Not for: …
Choose this area if: …
Skip or split it if: …
Start with: [next-decision cards]
~~~

Пример Uluwatu: best for — cliffs, surf, sunsets, dramatic dinners, temple/Kecak sequence; not for — walking everywhere, cheap taxis between every stop, calm swimming beaches; choose if — you want views, surf energy and destination dinners; skip/split if — you need easy movement, family-flat beaches or dense café hopping.

**Next-decision cards** (для Uluwatu): Where to eat · Where to brunch · Where to watch sunset · Temple/Kecak route · 48-hour plan · Compare with Canggu (`/canggu-vs-uluwatu`).

Правило навигации: **широкий area-label всегда ведёт на district pillar**, никогда на узкую страницу (баг «Uluwatu & the Bukit» → `/uluwatu-sunset-kecak` — именно это нарушение). URL-паттерн district-детей (`/[district]/best-restaurants` vs live `/bali/[district]/[intent]`) решает Migration Map V1.

---

# 7. SEO decision page template

Каждая SEO-страница — decision page, не listicle.

~~~text
H1: Best [thing] in [area] — chosen by fit, not by hype

Answer-first intro:
If you want [job], start with [top 2–3 choices].
If you need [different job], skip to [section].

Quick decision table:
Best for · Not for · Area · Price band · Best time · Booking/check needed · Official action

Shortlist (каждый пункт):
why it fits · not ideal if · what to check · next action

Comparison: Which should you choose?
FAQ: 4–6 real tourist questions
Internal links: parent district · sibling guides · Bali-wide owner · Today/Plan action
~~~

Index-правило (= index gate master §12.3 в терминах страницы): страница индексируется только если у неё есть distinct traveller job + enough verified material + useful decision value + clear action path.

---

# 8. Place page template (micro-decision)

Каждая `/places/[slug]` — микро-решение, не карточка каталога.

~~~text
H1: [Place name]

Decision summary:
Best for · Not for · Go when · Area · Price (known/unknown) ·
Booking (official status/unknown) · Last checked [date]

Why go: короткое человеческое объяснение.

What to check before going:
hours · booking/minimum spend · menu/current policy · transport/access

Actions:
Maps (только verified entity URL — иначе явно label «search») ·
official website/menu · Instagram · WhatsApp/booking if verified · Save

Internal links: district guide · тематические соседи · similar places
~~~

Канон: `Price: unknown` и `Booking: unknown` — легитимные значения (пусто лучше выдуманного); «Go if» только из verified `best_for`; данные best_for/not_for/price_anchor уже в модели (migration 0039) — это render-задача.

---

# 9. Trust architecture — `/how-we-choose`

Отдельная страница + повторяемый блок на главной. Нужна туристам, venue-owners, villa-партнёрам, SEO/AEO trust (добавить в llms.txt).

**H1: How Other Bali chooses what to show**

> Other Bali is selected, not exhaustive. We do not try to list every place in Bali. We publish places and guides only when they help a real traveller decision: where to stay, where to eat, what to do now, or how to plan the day.

1. **Selected, not exhaustive.**
2. **No paid ranking.** A venue cannot buy its way into a "best" position.
3. **No copied reviews.** We do not republish Google review prose or pretend ratings are truth; reviews are discovery clues, not public proof.
4. **Fit over hype.** Best for whom, not ideal for whom, what to check before going.
5. **Official handoffs.** Maps, booking, WhatsApp and menus go to official sources when verified.
6. **Unknown stays unknown.** Volatile hours, prices and policies are marked or handed to the source.
7. **Why some places are missing.**

Все семь пунктов — прямое публичное отражение уже принятого канона (money-model, honesty rules, editorial independence). Новых обязательств не создают.

---

# 10. Navigation rules

**Primary mobile/bottom nav (4 пункта = 4 поверхности master):**

| Label | URL сейчас | URL target | Job |
|---|---|---|---|
| Today | `/my-day` | `/today` (по D-005) | I need a place now |
| Explore | `/places` | `/explore` (master §5) | I want to browse |
| Plan | `/plan` | `/plan` | I'm planning a trip |
| Saved | `/my-bali` | `/my-bali` | My shortlist |

Explore-меню группируется по need/категориям (Eat & Drink · Beach & Pool · Wellness · Things to Do · Areas). Правила: широкий area-label → district pillar (никогда — узкая страница); партнёрский вход «I run a place» — постоянный вторичный элемент header/footer; навигация не зеркалит сущности БД (master §23.3).

---

# 11. CTA rules

Один primary CTA на состояние. CTA — только при валидной цели (master §7.4): нельзя изображать booking при наличии лишь website. Канонические глаголы: Find / Plan / Compare / Choose / Save / Open / Check. Maps-действие — только verified entity URL, иначе явная метка search/unverified. Trust microline сопровождает primary CTA на главной и /my-day.

---

# 12. Internal linking rules

Каждая decision page линкует: parent district pillar · sibling guides (та же тема, соседний район) · Bali-wide owner-страницу темы · действие (Today/Plan). Ссылки строятся из entity relations и user need (master §18), не из «просто добавим ссылок». Every pillar → его children; every child → pillar + versus + place pages.

---

# 13. Publication gates

Без изменений — действуют гейты master §12.3 (publication ≠ index). PEA добавляет только формулировку index-критерия в терминах страницы (§7 выше). Новые страницы этого документа (/how-we-choose, where-to-stay, versus-страницы) проходят те же гейты.

---

# 14. Measurement

## Core product metric

~~~text
Organic decision rate =
  organic engaged landing sessions with ≥1 действие из
  {item_saved, maps_clicked, whatsapp_clicked, booking_clicked,
   route_opened_in_maps, item_added_to_trip, trip_created}
  ÷ organic engaged landing sessions
~~~

Это **Intent-уровень** по шкале §15.1 master (не outcome) — так и называем; события уже в обязательном списке §15.2.

## Page-level (для каждого indexable URL)
impressions · clicks · CTR · landing sessions · engaged sessions · save rate · Maps/action handoff rate · internal next-click rate · return usage · stale fact count · missing action count.

## Venue-level (кормит partner reports §14 master)
page views · saves · Maps clicks · WhatsApp clicks · booking clicks · menu clicks · freshness status · owner-confirmed status.

---

# 15. Internal QA / page audit model

Для каждой публичной страницы — аудит-строка (генерируемый отчёт, F-трек):

~~~text
URL · intent owner · page family · indexability · sitemap status · canonical ·
incoming/outgoing internal links · title · H1 · schema · last reviewed ·
evidence status · missing facts · Maps entity status · action status ·
publication gate status
~~~

Источники — существующие таблицы (publication_states, field_evidence, redirects) + Internal Link Graph из preservation-артефактов §19 master. Это и есть механизм «расти, не превращаясь в article farm».

---

# 16. B2B experience

## `/for-venues` (T6 — копия по канону)

Аудитория: restaurants, cafés, beach clubs, spas, bars, studios. Core promise:

> Other Bali sends fewer, better-fit travellers — people who already know why your place fits their moment.

Обязательно объясняет: ranking нельзя купить · факты можно исправить (claim flow) · официальные actions добавляются партнёром · Other Bali измеряет saves/Maps/WhatsApp/booking handoffs · **платная модель: fixed fee per confirmed seated reservation — ничего другого** (money-model канон; вместо расплывчатого «when commercial model is activated»). CTA reverse-magnet: «Check your venue page».

## `/villas` (URL live; контент = villa/concierge distribution)

Аудитория: villa managers, boutique hotels, concierges, guest-experience teams. Core promise:

> Give guests a simple Bali decision guide without turning your team into a 24/7 WhatsApp concierge.

Use cases: QR in villa · first-day guide · where to eat nearby · rainy-day options · family day · sunset plan · no-scooter plan. Правила: виллы — **distribution partners, не accommodation inventory**; no paid ranking; no fake concierge recommendations; guest value first. (Соответствует hotel-partner-track: бартер, взаимность 30 дней → бейдж.)

---

# 17. Rollout: маппинг на существующие волны

PEA **не создаёт второй план работ**. Копирайт и шаблоны готовятся сейчас (контент, не код); инженерные изменения идут по волнам master §21 — T0 первый (коррекция №10). Пошаговая детализация задач с файлами, копией и QA-чеками — в implementation pack (`other-bali/pea-implementation-pack-v1.md`).

| Шаг PEA | Носитель в существующем плане | Когда |
|---|---|---|
| Nav-fix: «Uluwatu & the Bukit» → district pillar | Новая мелкая задача; предусловие — pillar `/uluwatu` существует [ПРОВЕРИТЬ] | Wave 1 (после T0-диагностики) |
| Hero rewrite + trust block | **T1** (homepage fork) — PEA даёт готовую копию | Wave 1 |
| «Try a Bali decision» demo | Семья **T8** (decision screen) | Wave 2–3 |
| `/my-day` upgrade (selected state, 3 слота, because-you-chose) | **T4** QuickDecision + D-005 revise-in-place | Wave 2 |
| First-time path на главной | **T10** + D-трек контента (itineraries 3/5) | Wave 2–3 |
| SEO decision template retrofit | D-трек: Uluwatu cluster → Canggu → Bali-wide best-of | После T0-реиндексации |
| Maps-actions чистка (entity URL или label) | Вместе с T4/T3 полями | Wave 2 |
| Place page → micro-decision | **T4 + T3** (данные уже в модели, render-задача) | Wave 2 |
| `/how-we-choose` | Новая контент-страница + llms.txt | Wave 1–2 |
| `/for-venues` канон-копия | **T6** | Wave 2 |
| `/villas` контент-ревизия | B-трек (hotel-partner-track) | По борду B |
| QA-отчёт по страницам | F-трек (данные) | W3+ |

---

# 18. Итоговая формула

Идеальный Other Bali ощущается так:

> «Я не читаю очередной блог про Бали. Я быстро понимаю, какой район/место/план подходит мне — и почему.»

10 секунд на главной, 30 секунд на любой SEO-странице. Если это выполняется — сайт не SEO-проект, а продукт.

**Порядок правды:** канон решений → Unified Master v3.2 → три контракта (Data Dictionary / Taxonomy / Migration Map) → **этот документ** → отдельные страницы. Изменения — через Decision Log.

---

# 19. Surface Definition of Done (v1.1)

Поверхность считается готовой только при выполнении всех пунктов. DoD — приёмочный чеклист для implementation pack и QA-модели §15.

## 19.1. Homepage DoD

- Hero за 5 секунд объясняет: что делает Other Bali · чем лучше endless lists · куда нажать сейчас.
- Ровно 2 туристические CTA; partner entry видим, но не конкурирует с ними.
- Есть Product Demo block («Try a Bali decision»).
- Trust block — above/near fold.
- Есть First-time path.
- Каждая area card ведёт на district pillar (Uluwatu card → `/uluwatu`).
- Все CTA ведут на финальный canonical URL (не на цепочку редиректов).
- Первый мобильный экран не закрыт cookie/banner/overlay.

## 19.2. `/my-day` DoD

- Выбранные фильтры visibly selected; есть строка `Your shortlist: …`.
- Результат меняется от выбора — или явно объясняет, почему не меняется.
- Ровно 3 recommendation slots (best / backup / contrast).
- У каждой рекомендации есть: Why this fits · Not ideal if · Check before going · Next action.
- Нет claims «open now» без verified hours («Fits this moment»).
- Maps action — либо verified entity URL, либо явно labelled search.
- Пустое состояние честное: «недостаточно decision-ready мест под этот набор» + ближайшая альтернатива, никогда — фейковая выдача.

## 19.3. SEO decision page DoD

- Answer-first intro — above fold.
- Есть decision table.
- Shortlist: у каждого пункта why fits / not ideal if / what to check / next action.
- FAQ — из реальных туристских вопросов (4–6).
- Internal links: parent district · siblings · Bali-wide owner · Today/Plan action.
- Canonical self; sitemap membership корректен.
- Нет второй страницы с тем же intent owner (дедуп по семье запросов).

## 19.4. District pillar DoD

- Above-fold fit-блок: Best for · Not for · Choose if · Skip/split if.
- ≥4 next-decision cards, все ведут на живые страницы.
- Правило «широкий label → pillar» выполнено во всех входящих nav-ссылках.
- Versus-ссылка, если сосед-конкурент существует.
- Транспортные утверждения — только с evidence (никаких «walkable» без основания, §20).

## 19.5. Place page DoD

- Decision summary заполнен или содержит явные `unknown` (пусто лучше выдуманного).
- Why go + What to check before going присутствуют.
- Actions валидны: Maps entity или labelled search; booking — только официальный путь.
- Last checked date отображается.
- Internal links: pillar + ≥2 тематических соседа/similar.
- Рендер только из verified полей: booking_difficulty не выводится из ссылок, «Go if» не выводится инверсией not_for.

---

# 20. Public Copy Prohibited Claims («do not say»)

Обязателен для команды, копирайтеров и AI-генерации. Проверка — prohibited-claims скан в QA-отчёте (§15, F-трек).

**Нельзя писать:**

- «best in Bali» без decision basis;
- «verified» без конкретного verification status и даты;
- «open now» без verified current hours;
- «book now», если это не официальный booking path;
- «official Maps», если это search URL;
- «recommended by locals» / «resident-curated» без объяснения editorial-процесса рядом;
- «hidden gem» как пустое SEO-клише;
- «must visit» без контекста;
- «perfect for everyone»;
- «cheap» без price anchor;
- «family-friendly» без evidence;
- «walkable» без transport/access evidence.

**Вместо этого:**

| Вместо | Пишем |
|---|---|
| best / must visit | `Best for…` + `Not ideal if…` |
| open now | `Fits this moment` / `Check hours before going` |
| verified (голое) | `Last checked [date]` / конкретный статус |
| book now (неофиц.) | `Official booking not verified` / `Check with the venue` |
| official Maps (search) | `Search on Maps` |
| cheap | price band / anchor |
| неизвестное | `Unknown` — легитимное значение |

Плюс базовый словарь: `Good if…` · `Not ideal if…` · `Check before going…` · `Use this if…`.

---

# 21. Tourist anxiety map

Каждая страница обязана отвечать на конкретную тревогу. Поле «intent owner» в QA-модели §15 называет её явно.

| Состояние туриста | Тревога | Ответ Other Bali |
|---|---|---|
| First trip | «Не знаю, где остановиться» | Compare areas по fit / not-for |
| On island now | «Куда пойти сегодня вечером?» | 3-slot shortlist с next action |
| Choosing Uluwatu | «Он не слишком разбросан?» | Transport reality + micro-areas в pillar |
| Food search | «Какой ресторан под мой вечер?» | Occasion/price/booking decision table |
| Villa guest | «Не хочу опять дёргать хоста» | QR → first-day / nearby / sunset path |
| Rain just started | «План рушится» | Rainy backup shortcut + indoor-варианты |
| No scooter | «Я заперт в отеле» | Transport-fit + walkable/driver-планы |

---

# 22. Execution principle — главный тест архитектуры

~~~text
Every public surface must answer three questions within 10–30 seconds:

1. What decision is this page helping me make?
2. Why should I trust this recommendation?
3. What should I do next?

If a page cannot answer all three, it is not ready to be indexable or promoted.
~~~

Это публичная форма index gate (master §12.3): тест «decide / trust / act» входит в publication-чеклист каждой поверхности.

Канон-строка всего experience-слоя:

> **Every Other Bali page must help the traveller decide, trust, and act.**
