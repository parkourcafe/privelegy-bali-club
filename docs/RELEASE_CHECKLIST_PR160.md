# Release checklist — PR #160 (`claude/new-session-pbevlv` → `main`)

Что содержит PR, в каком порядке выкатывать и что проверить. **13 коммитов, 19 файлов.**
Ключевой принцип: **код** едет через merge+Vercel-деплой, **данные** — через ручной накат
миграций на прод-Supabase. Оба нужны для полного эффекта.

---

## 0. Что в PR (сводка)

| Блок | Файлы | Механизм go-live |
|---|---|---|
| Миграция 0038 — WhatsApp у 63 существующих venue | `supabase/migrations/0038_*.sql` | **накат на Supabase** |
| Миграция 0039 — вставка 24 KORA venue (decision-ready, `review`) | `supabase/migrations/0039_*.sql` | **накат на Supabase** |
| Миграция 0040 — публикация 24 (`review→published`) | `supabase/migrations/0040_*.sql` | **накат на Supabase (после 0039)** |
| Миграция 0041 — вставка 5 сетевых venue (Tuku/Sate Senayan/Bakso Boedjangan/Gildak/Fore, `review`) | `supabase/migrations/0041_*.sql` | **накат на Supabase** |
| Миграция 0042 — публикация 5 сетевых (`review→published`) | `supabase/migrations/0042_*.sql` | **накат на Supabase (после 0041)** |
| SEO-пиллар `/bali-travel-guide` (хаб-страница + запись в реестре гайдов) | `app/bali-travel-guide/page.tsx`, `lib/guides.ts` | **merge+деплой (БД не нужна)** |
| Бренд-schema на главной (Organization/WebSite/SearchAction) | `app/page.tsx` | merge+деплой |
| Denpasar в island-wide `AREA_ORDER` | `app/best-restaurants-in-bali`, `best-warungs-in-bali` | merge+деплой _(венью видны после 0039/0040)_ |
| Uluwatu: Drifter + The Cashew Tree в реестре | `lib/uluwatu/venues.ts`, `app/uluwatu/best-brunch` | **merge+деплой (БД не нужна)** |
| Стейджинг-артефакты (kora-leads, whatsapp-batch) | `data/data-ops/**` | без наката (файлы) |
| Доки (SEO, соц-стратегия, брифы, чеклисты) | `docs/**` | без эффекта в рантайме |

> Нюанс: 24 KORA-venue и WhatsApp появляются **только после наката 0038–0040**. А uluwatu-кафе
> (Drifter/Cashew) идут из реестра-кода — им накат **не нужен**, только деплой.

---

## 1. Pre-merge

- [ ] Ревью диффа PR #160 (особенно 3 миграции + `app/page.tsx`).
- [ ] CI зелёный (`ci.yml` собирает без Supabase-кредов — это ожидаемо, миграции он не катит).
- [ ] Проверено локально/в ветке: `npm run typecheck`, `npm run lint`, `npm run build` — зелёные (было при коммитах).
- [ ] В диффе нет секретов/ключей, нет service-role в клиентском коде.
- [ ] Просмотреть **10 адресов medium-confidence** из шапки `0040` (Alma, Drifter, Kilig, Nalu, Warung Wardani, Ayam Betutu, Menega, Secret Spot, Sushimi, Hungry Bird) — при желании подтвердить перед публикацией.

## 2. Merge → деплой (код)

- [ ] Смёрджить PR #160 в `main`.
- [ ] Дождаться деплоя Vercel (регион sin1).
- [ ] После деплоя **сразу живо** (без БД): бренд-schema на главной; Drifter + The Cashew Tree на `/uluwatu/best-brunch`; слот `denpasar` в island-wide (пустой, пока нет данных).

## 3. Накат миграций на прод-Supabase (шаг основателя)

Применять **вручную, по порядку, один раз** (Supabase Studio SQL editor / `supabase db push` / psql
на прод). Все три идемпотентны (`coalesce` / `where not exists` / scoped update) — повторный прогон безопасен.

- [ ] **0038** — `update … coalesce(whatsapp/instagram/gmaps)` для 63 существующих venue. Неразрушающе.
- [ ] **0039** — вставка 24 venue со `status=active`, `publication_status='review'` (пока НЕ публично).
- [ ] **0040** — flip `review→published` для тех же 24 (делает публичными). **Строго после 0039.**
- [ ] **0041** — вставка 5 сетевых venue (Toko Kopi Tuku, Sate Khas Senayan, Bakso Boedjangan, Gildak, Fore Coffee) со `status=active`, `publication_status='review'` (пока НЕ публично). Все high-confidence, адреса web-verified 2026-07-19.
- [ ] **0042** — flip `review→published` для тех же 5 (делает публичными). **Строго после 0041.**
- [ ] Зафиксировать факт наката (дата/кто) — как принято в репозитории (ср. коммент в 0031).

_Порядок обязателен: 0039→0040 (24 venue), 0041→0042 (5 сетей), 0038 независим (можно первым)._

## 4. Post-apply верификация

**Индексация / бренд (P0):**
- [ ] Подтвердить **`VERCEL_ENV === "production"`** на прод-деплое — иначе `app/robots.ts` отдаёт
  `Disallow: /` и блокирует индексацию (самая вероятная причина «не индексируется»).
- [ ] Rich Results / Schema-валидатор на главной → `Organization` + `WebSite`/`SearchAction` валидны.
- [ ] GSC: домен **www.otherbali.com** подтверждён, sitemap submit, Coverage — растёт число проиндексированных.
- [ ] Поиск `other bali` → сайт первым результатом (со временем).

**Данные live (после 0038–0040):**
- [ ] Открыть `/places/bebek-bengil` (и ещё 1–2 из 24) — карточка живая, адрес + Google Maps + editorial.
- [ ] У venue с WhatsApp — работает действие WhatsApp (wa.me, номер digits-only).
- [ ] `/best-restaurants-in-bali` — появилась секция **Denpasar** (ayam-betutu); `/best-warungs-in-bali` — Warung Wardani.
- [ ] `/uluwatu/best-brunch` — видны **Drifter** и **The Cashew Tree** (это уже после деплоя, без БД).
- [ ] District-гайды района подтянули новые venue (напр. `/canggu/best-restaurants` — Alma/HOME/Sushimi).
- [ ] После 0041/0042: 5 сетевых карточек живые (`/places/toko-kopi-tuku`, `/places/fore-coffee-jimbaran` и т.п.); Denpasar/Jimbaran/Kuta-district-гайды их подтянули.

**Код без БД:**
- [ ] `/bali-travel-guide` открывается (SEO-пиллар), все кластерные ссылки ведут на существующие маршруты; есть в `/sitemap.xml` и на `/guides`.

## 5. Отложено / НЕ в этом релизе

- **Kurasu**, **Dapur Bali Mula** — `needs_verification`, НЕ вставлены (поп-ап / вне районов гида).
- **Сети-кандидаты, отложены** (`data/data-ops/kora-leads/chain-venue-candidates.json`, `needs_verification`): **Dailybox** (delivery, stale-data), **Bittersweet by Najla** (dessert-box, unreconfirmed), **Hangry/Moon Chicken** (cloud-kitchen only), **Kurasu** (permanence Pererenan под вопросом). НЕ вставлены.
- **8 whatsapp-кандидатов** (`data/data-ops/whatsapp-batch`) — `needs_verification`, НЕ вставлены.
- Uluwatu-кафе живут в **реестре** (`lib/uluwatu/venues.ts`), не в БД — им накат не нужен; для district-страниц других районов (denpasar) — нужен `AREA_ORDER` (сделан) + данные из БД.

## 6. Rollback

- Код: откат = revert merge-commit в `main` + редеплой.
- 0038 (whatsapp/coalesce): чтобы снять — точечный `update … set whatsapp=null where slug in (…)` (только если поле было пустым до наката).
- 0039/0040: снять публикацию — `update venues set publication_status='review' where slug in (24)`;
  удалить строки — `delete from venues where slug in (24)` (они гард `where not exists`, так что чистые вставки).

---

**Definition of done релиза:** PR смёрджен и задеплоен; 0038→0039→0040 применены к проду по порядку;
`VERCEL_ENV=production` подтверждён; бренд-schema валидна; 24 карточки и WhatsApp видны; Denpasar и
uluwatu-кафе на месте; sitemap в GSC. Отложенные позиции задокументированы.
