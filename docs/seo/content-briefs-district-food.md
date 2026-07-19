# District-food integration plan (обновлено после аудита кода)

> **Поправка к первой версии.** Аудит показал: district-food страницы **уже построены** и
> тянут published venue автоматически. Строить новые `/best-restaurants-in-canggu` НЕ нужно —
> работа в том, чтобы наши 24 venue корректно **попали** на существующие страницы и гайды
> были не тонкими. Schema (`ItemList` + `FAQPage`) на этих страницах **уже есть**.

## Как это реально работает

- Каждый район имеет spoke-страницы: `app/<district>/best-restaurants`, и т.д. Рендер — через
  `*GuideView` из курируемого объекта `guide` (`lib/<district>-guides.ts`).
- Venue берутся из `getCangguVenues()` / `getPublishedVenues()` и фильтруются предикатами
  гайда (`guide.base` + группы `g.match`). Никакого ручного pick-list — **published venue
  появляется сам**.
- Индексация: `isVenueIndexable = decisionReadyEditorial (whyItsHere + bestFor) && status=active
  && publication_status=published` (`lib/publication.ts`). Наши 24 это имеют (0039 добавил
  editorial, 0040 публикует) → они станут indexable и попадут в списки после наката на прод.
- Schema уже отдаётся: `ItemList` (guide-view + island-wide `best-X-in-bali`) и `FAQPage`
  (общий `FaqBlock`). Плюс на главной теперь `Organization`+`WebSite`/`SearchAction` (P0-фикс).

## Существующие spoke-страницы по районам

| Район | best-restaurants | cafes | warungs | прочее |
|---|---|---|---|---|
| canggu | ✅ | ✅ work-friendly-cafes | ✅ | best-brunch, best-spas, beach-clubs-sunset |
| ubud | ✅ | ✅ best-cafes-coffee | ✅ | best-yoga-wellness, itinerary, things-to-do |
| seminyak | ✅ | ✅ cafes-coffee | — | beach-clubs-sunset, spas-salons-wellness |
| sanur | ✅ | ✅ cafes-and-bars | — | best-hotels, spas-wellness, things-to-do |
| uluwatu | ✅ | — _(нет cafe-страницы)_ | — | best-brunch, date-night-restaurants, 48-hours |
| jimbaran | ✅ | — | — | spas-wellness, things-to-do |
| nusa-dua | ✅ | — | — | spas-wellness, things-to-do |
| **denpasar** | — | — | — | **spoke-страниц нет вообще** |

## Куда попадают наши 24 venue

| Venue | Категория | Целевая существующая страница |
|---|---|---|
| alma-tapas-bar, home-by-chef-wayan, sushimi-bali | restaurant · canggu | `/canggu/best-restaurants` |
| hungry-bird-coffee, secret-spot-bali, the-loft-bali | cafe · canggu | `/canggu/work-friendly-cafes` |
| bebek-bengil, kilig-bali, melting-wok-warung | restaurant · ubud | `/ubud/best-restaurants` |
| warung-biah-biah | warung · ubud | `/ubud/best-warungs` |
| sayuri-healing-food, tukies-coconut-shop | cafe · ubud | `/ubud/best-cafes-coffee` |
| bossman-burgers, motel-mexicola, saigon-street | restaurant · seminyak | `/seminyak/best-restaurants` |
| vincent-nigita, gusto-gelato, expat-roasters, nalu-bowls | cafe · seminyak | `/seminyak/cafes-coffee` |
| menega-cafe | restaurant · jimbaran | `/jimbaran/best-restaurants` |
| drifter-surf-cafe, the-cashew-tree | cafe · uluwatu-bukit | **микро-гэп: у uluwatu нет cafe-страницы** → пока только island-wide |
| ayam-betutu-khas-gilimanuk, warung-wardani | restaurant/warung · denpasar | **микро-гэп: у denpasar нет spoke-страниц** → пока только island-wide |

## Что реально сделать (в порядке приоритета)

1. **Накатить 0039 + 0040 на прод** — без этого venue не появятся нигде.
2. **Проверить предикаты гайдов** (`guide.base` + `g.match` в `lib/<district>-guides.ts`): попадает
   ли каждый наш venue в нужную группу. Если группировка идёт по тегам, а у venue тегов нет —
   он окажется в пуле, но может не попасть в группу. При необходимости — добавить теги/поля
   (это единственная возможная доработка данных).
3. **Island-wide покрытие — проверено:** `AREA_ORDER` в island-wide `best-X-in-bali` уже
   включает canggu/seminyak/ubud/**uluwatu-bukit**/**jimbaran**/sanur/nusa-dua, но **НЕ
   denpasar**. Значит menega (jimbaran) и drifter/cashew (uluwatu) покажутся island-wide, а
   **ayam-betutu и warung-wardani (denpasar) — нигде** (ни district, ни island-wide). Решение
   по denpasar — за основателем: (i) добавить `denpasar` в `AREA_ORDER` этих страниц, или
   (ii) оставить denpasar вне туристического «best restaurants in Bali» (он не туристический
   район). Мелкий локальный фикс, не блокер.
4. **Закрыть микро-гэпы маршрутов** (низкий приоритет):
   - `/uluwatu/best-cafes` (или добавить cafe-группу в существующую uluwatu-страницу) — для drifter, cashew tree.
   - Решение по **denpasar**: либо создать spoke-страницы (`/denpasar/best-warungs`,
     `/denpasar/best-restaurants`), либо оставить denpasar только island-wide. Denpasar —
     не туристический район, поэтому это осознанно низкий приоритет.
5. **Enrichment**: где district-гайд тонкий (мало venue в группе) — наши 24 как раз добавляют
   плотности; при желании дописать вводные абзацы/FAQ под PAA.

## Schema — статус (задача «b»)

Ничего добавлять не нужно, всё уже есть:
- `ItemList` — в `*GuideView` и island-wide `best-X-in-bali`.
- `FAQPage` — через общий `components/GuideBlocks.tsx → FaqBlock` (используется всеми гайдами).
- `Organization` + `WebSite`/`SearchAction` — добавлено на главную (`app/page.tsx`, P0).
- `BreadcrumbList` — через `components/Breadcrumbs.tsx`.
- Гард: нигде нет `aggregateRating` (не републикуем Google-рейтинги) — сохранить.

Единственный возможный schema-апгрейд на будущее: `Restaurant`/`LocalBusiness` per-venue на
страницах `/places/[slug]` — **уже отдаётся** (маппинг `restaurant → "Restaurant"`).

---

## Проверка предикатов «в» — результат: тегов никому не нужно

Прошёл `guide.base` + `g.match` по каждому из 24 venue:

- **Job-матчинг работает:** гайды матчат jobs через дефисы (`date-night-special`), наши venue
  хранят их через подчёркивания (`date_night_special`), но `venueHasJob` прогоняет обе стороны
  через `normalizeJobs` → совпадает. Значит editorial-jobs из 0039 корректно ловятся.
- **Ubud / Seminyak / Jimbaran гайды — без групп** (плоский список по `base` = category). Все
  наши restaurant/cafe/warung там проходят по category. Никакого group-риска.
- **Canggu — с группами**, но все наши canggu-venue попадают:
  - `/canggu/best-restaurants` (группы date/groups/family/occasion): alma (date+groups), home
    (date+occasion), sushimi (groups) — ✓ все.
  - `/canggu/work-friendly-cafes` (группа coffee = `category==="cafe"`): hungry-bird, secret-spot,
    the-loft — ✓ все.
- **Тегов (`vibeTags`/`practicalTags`) добавлять не требуется** — они используются только как
  необязательное уточнение внутри групп, всегда в `OR` с job/category, которые уже ловят наши venue.
- ⚠️ На будущее (не про наши 24): у `/canggu/best-restaurants` нет catch-all группы — будущий
  canggu-ресторан без job'ов date/groups/family/occasion станет невидимым. Стоит добавить
  fallback-группу «остальные» когда-нибудь.

## Микро-фикс «г» — сделано частично

- ✅ **Denpasar добавлен в island-wide** `best-restaurants-in-bali` и `best-warungs-in-bali`
  (`AREA_ORDER`, `pillar: undefined` — роута `/denpasar` нет). Теперь `ayam-betutu` и
  `warung-wardani` появятся island-wide после наката. Typecheck/lint/build — зелёные.
- ⚠️ **Uluwatu cafe-группа — НЕ микро-фикс.** Uluwatu district-страницы берут venue из отдельного
  реестра `lib/uluwatu/venues.ts`, а не из БД, поэтому наши `drifter` / `the-cashew-tree` (БД)
  туда не попадут добавлением группы — их надо заводить через реестр (отдельная задача). При этом
  они **уже видны island-wide**: в `best-cafes-in-bali` `AREA_ORDER` есть `uluwatu-bukit`. Так что
  срочности нет; отдельную `/uluwatu/best-cafes` можно сделать позже в рамках uluwatu-реестра.
