# P0 технический чеклист — индексация и владение брендом

Исполнение раздела 4 + пункта №1 executive summary (`docs/SEO_STRATEGY.md`). **Блокер до всего
остального:** бренд-SERP не наш — `otherbali.com` не выходит по `other bali` / бренд не индексируется,
имя «other» конфликтует с `onebali`/`anybali`/`baliapp.com`/Hungry in Bali. Пока это не решено,
органика утекает.

## A. Индексация (сначала подтвердить факты)
- [ ] Google Search Console: подтвердить домен, открыть **Coverage/Pages** — сколько реально проиндексировано.
- [ ] Проверить `app/robots.ts` — не отдаёт ли `Disallow: /` или лишний `noindex` на прод.
- [ ] Проверить, что прод не за `X-Robots-Tag: noindex` / basic-auth / staging-флагом.
- [ ] `app/sitemap.ts` + `lib/seo/sitemap-last-modified.ts`: published venue и «best X» страницы попадают в sitemap с корректным `lastmod`. Submit sitemap в GSC.
- [ ] `curl -sI https://otherbali.com/` и `/places/<slug>` — статус 200, нет мета-`noindex` на published-страницах.
- [ ] `lib/publication.ts`: убедиться, что decision-ready страницы отдают `index,follow`, тонкие — `noindex` (ожидаемо), и что это не блокирует всё подряд.

## B. Бренд-сущность (Organization / entity)
- [ ] `Organization` + `WebSite` + `SearchAction` JSON-LD на главной (name, url, logo, sameAs → соцпрофили).
- [ ] Главная: чёткий `<title>` и H1 с «Other Bali» (не generic); краткое «what is Other Bali».
- [ ] Единый NAP + соцпрофили (IG/FB/TikTok) с одинаковым именем/URL — сигналы сущности.
- [ ] Заявка/попадание в существующие ранжирующиеся подборки «best Bali apps» + app-директории.
- [ ] Рассмотреть дизамбигуацию имени в тайтлах/брендинге («Other Bali — the right place for the moment»), чтобы Google не читал как «другой Бали».
- [ ] (Позже) knowledge-panel сигналы: Wikidata-запись, консистентные упоминания.

## C. Schema на типах страниц
- [ ] Venue: `Restaurant`/`LocalBusiness` (name, address, geo, url, servesCuisine, priceRange, sameAs). **Без `aggregateRating`** (гард).
- [ ] Листиклы («best X»): `ItemList` + `BreadcrumbList`.
- [ ] Гайды/itinerary: `Article` + `FAQPage` под PAA-запросы.
- [ ] Валидация в Rich Results Test.

## D. Core Web Vitals / PWA
- [ ] Lighthouse на ключевых шаблонах (главная, district hub, «best X», venue); зафиксировать LCP/CLS/INP.
- [ ] Публичные данные — server-render (RSC); без hydration-critical контента для основного текста.
- [ ] Тач-таргеты 44–46px; без горизонтального скролла, прячущего выбор.
- [ ] PWA-install доступен (актив для pre-arrival «открывают до Бали»).

## E. Гигиена индекса
- [ ] Canonical на каждой странице; не плодить вариант-каннибализацию (`best area to stay` = вариант `where to stay` → консолидировать, не отдельная тонкая страница).
- [ ] Пустые/будущие district-food страницы — `noindex` до наполнения (≥6–8 карточек).
- [ ] RU-контент (founder/admin) — `noindex`, не в sitemap.

**Definition of done P0:** бренд-запросы отдают наш сайт первым результатом; GSC показывает ожидаемое число проиндексированных страниц; Organization/WebSite schema валидна; ключевые шаблоны в «good» по CWV.
