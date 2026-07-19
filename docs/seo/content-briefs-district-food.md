# Content briefs — district-food страницы (первая волна)

Исполнение раздела 3 SEO-стратегии (`docs/SEO_STRATEGY.md`). Пять страниц закрывают самый
выигрышный контент-гэп: district-специфичная еда, где TripAdvisor/крепостей в топе нет.
Каждая наполняется нашими **decision-ready** venue (миграции 0039/0040) + добором из каталога.

**Общие правила (гарды):**
- Публичный EN; без Google-рейтингов/отзывов; «минусы» — только fit-контекст.
- Каждая карточка venue: 1-строчный «why», «Best for», price band, действие (reserve/whatsapp/directions).
- `ItemList` + `BreadcrumbList` schema на страницу; `Restaurant`/`LocalBusiness` на venue. Без `aggregateRating`.
- Индексация — только когда страница decision-ready (`lib/publication.ts`): ≥6–8 наполненных карточек, свежесть-дата.
- Prices as of `<date>`. Внутренние ссылки: district hub ↔ эта страница ↔ venue ↔ related «best X».

---

## 1. best-restaurants-in-canggu  _(NEW)_
- **Target:** `best restaurants in canggu` · intent: shortlist · difficulty **medium** (TripAdvisor НЕ в топе — реально пробиться).
- **Beat:** midnightblueelephant.com, johnnyafrica.com, willflyforfood.net (стареющие блог-листиклы).
- **Title/H1:** «Best Restaurants in Canggu (2026) — where residents actually eat» · **meta:** decision-first, freshness-2026, action.
- **URL:** `/best-restaurants-in-canggu`
- **Наши venue:** `alma-tapas-bar` (Spanish tapas), `home-by-chef-wayan` (modern Balinese, Pererenan), `sushimi-bali` (Japanese/sushi train) + добор из каталога (canggu, category=restaurant).
- **Структура (H2):** intro (кто и для какого момента) → «By moment» (date night / group share / late-night / healthy) → карточки по под-районам (Berawa / Batu Bolong / Pererenan) → FAQ.
- **PAA/FAQ:** «Where do locals eat in Canggu?», «Canggu restaurants for dinner with a view?», «Cheap eats in Canggu?»
- **Рычаг:** 2026-openings freshness + action layer + линки из `canggu` hub.

## 2. best-cafes-in-canggu  _(NEW)_
- **Target:** `best cafes in canggu` · intent: shortlist/WFH · difficulty **medium** (Honeycombers/TripAdvisor, но geo-ниша).
- **Title/H1:** «Best Cafes in Canggu — laptop-friendly, specialty coffee, brunch» · **URL:** `/best-cafes-in-canggu`
- **Наши venue:** `secret-spot-bali` (plant-based), `hungry-bird-coffee` (roastery), `the-loft-bali` (brunch) + добор (canggu, cafe).
- **Структура:** «For working (wifi/power/laptop-policy)» / «For brunch» / «For specialty coffee» → под-районы → FAQ.
- **PAA/FAQ:** «Best cafes to work from in Canggu?», «Canggu cafes with fast wifi?»
- **Рычаг:** hyper-local (WFH-пригодность, часы, наличие розеток, no-reservation) — чего тонкие блоги не дают. Пересечение с `digital-nomad-bali-cafes`.

## 3. best-restaurants-in-seminyak  _(NEW)_
- **Target:** `best restaurants in seminyak` · intent: shortlist · difficulty **medium** (map pack + mid-blogs).
- **Title/H1:** «Best Restaurants in Seminyak (2026) — by the moment you're in» · **URL:** `/best-restaurants-in-seminyak`
- **Наши venue:** `bossman-burgers` (late-night burgers), `motel-mexicola` (Mexican cantina/party), `saigon-street` (Vietnamese), `vincent-nigita` (patisserie/dessert), `gusto-gelato` (gelato) + добор (seminyak, restaurant).
- **Структура:** «By moment» (group night out / date / late-night / dessert) → Petitenget vs Kayu Aya → FAQ.
- **PAA/FAQ:** «Best fine dining Seminyak?», «Where to eat late night in Seminyak?»
- **Рычаг:** verified action layer (reserve/menu/directions) + which-moment framing над статичными списками.

## 4. where-to-eat-in-ubud  _(усилить/новая под intent)_
- **Target:** `where to eat in ubud` · intent: informational/PAA · difficulty **medium** (PAA-heavy, нет доминанта).
- **Title/H1:** «Where to Eat in Ubud — from warungs to fine dining» · **URL:** `/where-to-eat-in-ubud`
- **Наши venue:** `warung-biah-biah` (Balinese), `bebek-bengil` (crispy duck), `kilig-bali` (Filipino), `melting-wok-warung` (fusion), `sayuri-healing-food` (raw vegan), `tukies-coconut-shop` (dessert) + добор (ubud).
- **Структура:** прямой ответ на intent → сегменты «Authentic warung» / «Fine dining» / «Healthy/vegan» / «Sweet stop» → PAA-заголовки как H2 → FAQ.
- **PAA/FAQ:** «Where do locals eat in Ubud?», «Best budget food in Ubud?», «Vegan restaurants Ubud?»
- **Рычаг:** буквальный ответ на intent + сегментация + PAA-таргетинг + резидентские пики.

## 5. best-restaurants-in-ubud  _(NEW — отд. от where-to-eat)_
- **Target:** `best restaurants in ubud` · intent: shortlist «best» · difficulty **medium**.
- **Title/H1:** «Best Restaurants in Ubud (2026)» · **URL:** `/best-restaurants-in-ubud`
- **Наши venue:** `bebek-bengil`, `kilig-bali`, `melting-wok-warung` + добор (ubud, restaurant; fine dining из каталога).
- **Структура:** сегменты «Fine dining» / «Authentic Balinese» / «Global/fusion» / «Healthy» → FAQ. Кросс-линк на `where-to-eat-in-ubud` (разный intent, не каннибализировать — разное H1/angle).
- **Рычаг:** intent-сегментация + menu/reserve actions + freshness.

---

### Порядок запуска
1. `best-restaurants-in-canggu` (самый лёгкий break-in) → 2. `where-to-eat-in-ubud` → 3. `best-cafes-in-canggu` → 4. `best-restaurants-in-seminyak` → 5. `best-restaurants-in-ubud`.
Публиковать страницу только когда ≥6–8 карточек decision-ready; иначе `noindex` до наполнения.
