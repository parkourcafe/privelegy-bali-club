# План посевов OtherBali — первая волна (QR в виллах/отелях + decision pages)

```yaml
задача: T-OB-06 (запуск 4)
дата: 2026-09-29
база: claude/autonomy-ob-01 @ d6fe224 (main @ beff274)
формат: ТЗ п.7 (исследование площадок, одобрено владельцем 28.09)
статус документа: подготовка; ничего не отправлено, не напечатано, не размещено
источники: docs/ops/autonomy/OB_QR_SEO_PILOT.md · docs/ops/autonomy/tasks/T-OB-04.md
           AGENTS.md · код атрибуции (ссылки на строки ниже) · открытые источники (§3)
```

Метки те же, что в пилоте: `DONE_CODE`, `TESTED_LOCAL`, `NOT_VERIFIED`,
`BLOCKED_EXTERNAL`, `BLOCKED_DECISION`. Тексты в §2 имеют статус
**READY_FOR_PLACEMENT** — они не отправлялись. Все площадки в §3 —
**«кандидат — не связывались, согласия нет»**.

Официальные сайты площадок и сами сообщества из этой среды не открывались:
сетевая политика возвращает `EGRESS_BLOCKED` для каждого домена
(`chesacanggu.com`, `sokkool.com`, `dojobali.org`, `outsite.co`, `baliforum.ru`,
`t.me`, `facebook.com`, `reddit.com` — по одной попытке на домен, 2026-09-29).
Все факты о площадках — **по выдаче поиска, страница не открыта**. Владелец
проверяет их сам (§8).

---

## §0. Главное за 30 секунд

1. Первая волна по ТЗ: QR-постер в одной вилле/отеле/коливинге Canggu +
   ссылки на три существующие decision pages Canggu в сообществах.
   Измеряемое действие: открытие места, сохранение или официальный контакт.
2. Кандидаты на QR (§3.1, только Canggu, по коду QR включён только там):
   **Chesa Canggu** (бутик-отель, Batu Bolong), **Sokkool** (коливинг +
   коворкинг, Berawa), **Matra Bali** (коливинг + коворкинг, Berawa/Semat).
   Источник (`s=`) за площадкой не назначен — список выпущенных источников
   есть только в прод-БД.
3. Площадки для decision pages (§3.2): БалиЧат Чангу (RU, правила открыты),
   r/bali, две группы Facebook о Canggu/номадах (EN, правила закрыты логином).
   TripAdvisor-форум проверен и исключён: ссылки на свой ресурс запрещены.
4. Тексты A/B/C (§2) собраны из утверждённых формулировок репозитория; без
   перков, чисел, кейсов и «world-class». Статус READY_FOR_PLACEMENT.
5. QR-путь до `source_scan` проверен локально (§6.3): `/?s=…` → `POST /api/source`
   доходит; без Supabase ответ 422 — источник не выпущен, это штатно.
   Прописная метка даёт 400 и молча теряется.
6. Что видно без внешней аналитики: `source_scan` в воронке `/admin`;
   `venue_detail_view`, `save`, `official_website_click` — только SQL по
   таблице `events`. Открытие маршрута `/route/<slug>` **не пишет события**.
7. Открытые решения владельца — §9 (площадка и источник, конвенция UTM,
   `?s=` на ссылках для сообществ).

---

## §1. Источники в репозитории

| Что | Где | Что берём |
| --- | --- | --- |
| Механизм QR и `?s=` | `docs/ops/autonomy/OB_QR_SEO_PILOT.md` §2.1 | таблица шагов с ссылками на код |
| QR включён только в Canggu | `supabase/migrations/0006_source_class_and_coverage.sql:12`; `0015_publish_collected_venues.sql:21-28`; `0018_uluwatu_launch.sql:17`; `0039_publish_kora_new_venues.sql:22-24`; `0046_insert_destination_batch3_attractions.sql:42-56` (все новые районы `qr_enabled=false`) | ограничение площадки |
| Текст постера | `app/admin/(protected)/qr/source/[source]/page.tsx:43-56`: «Other Bali» · «Find your Canggu day» · «Hand-picked spots for the kind of day you want.» · «Scan to open the map» | текст A, C |
| Один источник на точку размещения | `…/qr/source/[source]/page.tsx:58-60` | правило для §5 |
| Валидатор метки | `lib/source-attribution.ts:1` — `^[a-z0-9][a-z0-9_-]{0,63}$`; T-OB-04 §3 (CHECK в `0031:321`) | только строчные |
| Посадка QR и canonical | `app/page.tsx:25` — canonical `/` | §5 |
| Decision pages | `lib/canggu-guides.ts:108-141` (h1, lede, FAQ) | текст B; §5 |
| Бренд-правила | `AGENTS.md` §2 (tagline), §4 (без перков как основы, без выдуманных фактов, без платного ранжирования), §13; `docs/canon/OTHER_BALI_MESSAGING_SYSTEM.md` (promise, proof, voice); `docs/content-style.md` §1 (без hype-прилагательных) | тексты §2 |
| Утверждённые формулировки для вилл/отелей | `app/villas/page.tsx:36-52, 104-111`; `app/hotels/page.tsx:145-151` | текст A, C |
| Ранее написанные, но не отправленные скрипты | `docs/gtm/BALI_PRIVILEGE_SCRIPTS_AND_ASSETS.md` M-2, M-5, M-9, M-10 (draft, «НЕ отправлять») | опора для A, B; переписаны без чисел и обещаний отчётов |
| Две конвенции UTM | `docs/analytics/ANALYTICS_EVENT_MAP_2026-08-25.md:16-25`; `docs/gtm/BALI_PRIVILEGE_GROWTH_MEASUREMENT_SPEC.md:51-58` | §5 |
| Список сообществ (EN), собранный раньше | `docs/gtm/BALI_PRIVILEGE_COMMUNITIES.csv` | §3.2, перепроверено поиском |
| Список площадок-виллы (EN), собранный раньше | `docs/gtm/BALI_PRIVILEGE_PARTNER_PROSPECTS.csv` (The Slow, Hotel Tugu, управляющие компании) | §3.1, резерв |
| События и согласие | `app/SourceCapture.tsx`, `app/api/source/route.ts`, `app/api/event/route.ts`, `lib/analytics.ts`, `lib/actions/event-safety.ts`, `lib/actions/event-store.ts`, `lib/actions/guest-source.ts`, `lib/admin-operations.ts` | §6 |

---

## §2. Три текста (EN, READY_FOR_PLACEMENT — не отправлены)

Правила сборки: только формулировки из §1; без перков, чисел, кейсов,
обещаний трафика и отчётов; без «world-class» и hype-слов
(`docs/content-style.md` §1); без личных имён и контактов — подпись
«Other Bali team» по образцу `docs/venue-outreach.md`. Скан или клик —
Intent, не результат (AGENTS.md §4.8, §12): в текстах нет обещаний «гостей»
или «бронирований».

### A. Менеджеру виллы / отеля / коливинга — о QR-постере

> Subject: A free Canggu guide for your guests — one small poster
>
> Hi {property} team,
>
> We run Other Bali (otherbali.com) — a free guide to the right place for the
> moment you're in. Resident-curated places, routes and plans for every Bali
> moment. No ads, no paid ranking, and travellers never pay.
>
> We'd like to ask one thing: permission to place a small printed poster at
> your reception or on your welcome / Wi-Fi card. It reads "Find your Canggu
> day — hand-picked spots for the kind of day you want" and carries a QR that
> opens the guide. Nothing to sign, no cost, no guest data — guests simply
> scan if they want to.
>
> Would that be all right? If yes, tell us where a poster fits your space and
> we'll bring one. If not, no problem at all.
>
> Other Bali team

Откуда: «the right place for the moment you're in» (`AGENTS.md` §2);
«Resident-curated places, routes and plans for every Bali moment»
(`docs/canon/OTHER_BALI_MESSAGING_SYSTEM.md`); «No ads, no paid ranking»
(`app/page.tsx:24`); «travellers never pay» (`docs/venue-outreach.md`);
текст постера (`…/qr/source/[source]/page.tsx:46-54`); «Our QR on your
welcome / Wi-Fi card» и «nothing to sign, no cost» (`app/villas/page.tsx:50-52`,
`docs/venue-outreach.md`).

### B. Модератору сообщества — о decision page

> Hi {admin / moderators},
>
> Before posting anything, I'd like to ask permission. We run Other Bali
> (otherbali.com), a free, resident-curated guide to Bali — no ads, no paid
> ranking, travellers never pay.
>
> We have three Canggu pages that answer questions members ask here:
> "Work-friendly cafés in Canggu" (wifi, sockets, a seat that lasts),
> "Best brunch in Canggu" and "Best restaurants in Canggu" (sorted by the
> dinner you're planning).
>
> Would you be open to us sharing one of them as a one-off resource, with the
> affiliation stated plainly? If your rules don't allow it, we'll keep it to
> answering questions without links. Thank you either way.
>
> Other Bali team

Откуда: названия и подзаголовки страниц — `lib/canggu-guides.ts:109-110,
128-129` и `:46-47`; формула запроса модератору — M-10 в
`docs/gtm/BALI_PRIVILEGE_SCRIPTS_AND_ASSETS.md` (без «недель участия» — это
обещание, которого в задании нет); раскрытие аффилиации — норма Reddit и
TripAdvisor по выдаче поиска (§3.2).

### C. Короткое объяснение владельцу площадки, что такое OtherBali

> Other Bali is a free guide to Bali: the right place for the moment you're in.
> Resident-curated places, routes and plans — cafés to work from, brunch,
> dinner, sunset — with Best for / Not for context so a guest knows why to go
> today. No ads, no paid ranking, no booking upsell; travellers never pay, and
> nothing about a property publishes without its owner's approval. Guests open
> it from a QR or a link, save places to their own list and continue to the
> venue's website, WhatsApp or Google Maps. Less searching. More Bali.

Откуда: `AGENTS.md` §2; `app/page.tsx:22-24` («Best for / Not for context — so
you know why to go today. No ads, no paid ranking. Less searching. More Bali.»);
`app/villas/page.tsx:40, 58` («nothing publishes without you», «continue
straight to your website, WhatsApp or booking page»); «no booking upsell» —
M-2 в `docs/gtm/BALI_PRIVILEGE_SCRIPTS_AND_ASSETS.md`.

---

## §3. Площадки

Все строки: **кандидат — не связывались, согласия нет.** Дата проверки —
2026-09-29, по выдаче поиска (страницы не открывались, см. шапку).
Аудитория указана только там, где её называет сам источник. Личные
телефоны и email не собирались; там, где выдача поиска их показывала, они
намеренно не перенесены.

### §3.1 Кандидаты на первый QR (Canggu)

Отсев: **Dojo Bali** (Echo Beach) — по выдаче поиска «officially closed»;
**Outsite Pererenan** — по выдаче «no longer accepting bookings». Оба не
включены. **The Slow** (Batu Bolong, 12 rooms, `theslow.com`) и **Hotel
Tugu Bali** уже есть в `docs/gtm/BALI_PRIVILEGE_PARTNER_PROSPECTS.csv` —
резерв, если три кандидата ниже не подойдут.

| # | Площадка | Тип | Публичная ссылка-источник | Язык | Что говорит источник о месте и аудитории | Где по описанию мог бы стоять постер | Правила размещения |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **Chesa Canggu** | бутик-отель, 36 номеров | `https://www.chesacanggu.com/` (в выдаче: «Home — Chesa Canggu \| Official Site»); подтверждающие: `nowbali.co.id`, `luxuristmag.com`, Expedia (страница с отзывами 2026) | EN | «36-room boutique hotel in the heart of Canggu, 5 minutes from Batu Bolong Beach»; ресторан-бар THARA («all-day restaurant and bar»), два бассейна; в перечне удобств Expedia — «lobby bar». Аудитория: источник не описывает | В выдаче упомянут lobby bar — значит, есть лобби; конкретная точка (ресепшен, стойка THARA) — источник не говорит | неизвестно |
| 2 | **Sokkool** | коливинг + коворкинг | `https://sokkool.com/coliving` и `https://www.sokkool.com/`; подтверждающие: `coliving.com`, Hotels.com (листинг «Sokkool Canggu — Coworking & Coliving») | EN | «coliving and coworking space in Canggu … located in Berawa»; «private AC room … fast Wi-Fi desk, ensuite, and access to a rooftop kitchen, pool, and 24/7 coworking space»; «rooftop lounge». Аудитория: источник называет формат coliving/coworking, портрет гостя не описывает | Rooftop lounge / общая кухня / коворкинг названы источником; ресепшен не упомянут | неизвестно |
| 3 | **Matra Bali** (Matra Coliving & Coworking) | коливинг + коворкинг (по Booking — также guest house) | `https://www.matrabali.com/coliving-and-coworking-space`; `https://www.matrabali.com/contact` (страница контактов существует); подтверждающие: `bali.com`, Booking.com, Tripadvisor | EN | «set in a quiet, central part of Canggu … the perfect base for digital nomads in Bali»; «situated between the main roads Berawa and Semat»; «working space is situated on the fourth floor»; «in-house cafe». Аудитория по источнику: digital nomads | Коворкинг на 4-м этаже и собственное кафе названы источником; ресепшен не упомянут | неизвестно |

Совпадение аудитории с decision pages (интерпретация по описаниям выше):

| Площадка | `/canggu/work-friendly-cafes` | `/canggu/best-brunch` | `/canggu/best-restaurants` |
| --- | --- | --- | --- |
| Chesa Canggu | косвенно (портрет гостя не описан) | да — Batu Bolong, отель с завтраком вне номера не подтверждён источником, но брунч-гайд про тот же район | да — «date night / groups / special occasion» в гайде (`lib/canggu-guides.ts:114-119`) для гостей отеля |
| Sokkool | да — формат coliving/coworking; гайд про «wifi, sockets, a seat that lasts» | да — Berawa рядом с Batu Bolong | частично |
| Matra Bali | да — источник прямо называет digital nomads; у площадки свой коворкинг, поэтому гайд «работать вне дома» — дополнение, не замена | да | частично |

Что владелец проверяет сам перед контактом (по каждой площадке):

1. Сайт открывается, площадка работает в 2026 (страницы не открывались из этой среды).
2. Адрес действительно в районе `canggu` по смыслу миграций (Batu Bolong / Berawa / Pererenan / Echo Beach); иначе текст постера «Find your Canggu day» не совпадёт с местом (T-OB-04 §3).
3. Публичный деловой канал на официальном сайте (форма или общий адрес компании) — писать только туда.
4. Есть ли у площадки внутренние правила про сторонние материалы на ресепшене (источник не называет — спросить в письме A).
5. Один источник на эту точку размещения — метка ещё не назначена (§5).

### §3.2 Площадки для decision pages (сообщества и каналы, EN/RU)

Критерий: публичное сообщество о Canggu/Бали с открытыми правилами, где
ссылка на гайд уместна. Там, где правила не видны без входа, стоит
«неизвестно» — размещать нельзя, пока владелец не прочитает правила сам.

| # | Площадка | Тип | Публичная ссылка-источник | Язык | Аудитория (только со слов источника) | Правила размещения (по выдаче поиска) | Уместна ли ссылка |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **БалиЧат Чангу** (БалиФорум) | Telegram-чат | `https://t.me/balichat_canggu`; правила: `https://baliforum.ru/p/chaty-baliforuma-i-pravila-publikatsiy` | RU | «для любых обсуждений, связанных с районом Чангу» | Реклама товаров, услуг и мероприятий запрещена без согласования с отделом маркетинга; «саморекомендация в чатах также считается рекламой»; ссылки на другие чаты/группы запрещены без согласования; разрешены ссылки на локации в Google Maps по теме обсуждения. Согласование — через публичный аккаунт маркетинга БалиФорума (`@baliforum`, указан на странице правил) | Только после согласования с маркетингом БалиФорума (текст B — им). Без согласования — только ответы без ссылок |
| 2 | **r/bali** | Reddit | `https://www.reddit.com/r/bali` | EN | «General Bali trip planning, itineraries, visas» (`docs/gtm/BALI_PRIVILEGE_COMMUNITIES.csv`) | Правила сабреддита не получены (Reddit закрыт для этой среды); общая норма Reddit по выдаче: не более ~10 % собственных ссылок, раскрывать аффилиацию, читать правила сабреддита перед постом | неизвестно — владелец читает `r/bali/about/rules`; запрос модераторам (текст B) через modmail |
| 3 | **CANGGU COMMUNITY (Expat & Local)** | группа Facebook | `https://www.facebook.com/groups/communitycanggu/` | EN | «Canggu daily life, recommendations» (репозиторий); источник в выдаче не описывает | неизвестно — правила за логином | неизвестно — до прочтения правил владельцем |
| 4 | **Digital Nomads Bali** | группа Facebook | `https://www.facebook.com/groups/digitalnomadsinbali/` | EN | «Nomads living/working in Bali» (репозиторий); индексированы вопросы про meetup-группы в Canggu | неизвестно — правила за логином | неизвестно — до прочтения правил владельцем |
| 5 | **TripAdvisor Bali Forum** | форум | `https://www.tripadvisor.com/ShowForum-g294226-i7220-Bali.html`; правила: `https://www.tripadvisor.com/Trust-lvZWuQ2603YY.html` | EN | открытый форум путешественников | По выдаче: «Self-promotion, advertisements, solicitation and SPAM are strictly prohibited»; «may not link to a strictly commercial website or a blog affiliated with or promoting any one property or business» | **Нет** — ссылка на гайд не размещается. Проверен, чтобы не тратить очередь |

Не включены: «Активный Чангу, Бали» (Telegram, по выдаче tgstat) — публичный
handle и правила по открытым источникам не установлены; Whirlpool (AU) и
Bali Bogans — правила запрещают коммерческие посты / за логином
(`docs/gtm/BALI_PRIVILEGE_COMMUNITIES.csv`).

---

## §4. Сопоставление текст ↔ площадка

| Площадка | Текст | Канал (только публичный деловой) | Что вкладываем |
| --- | --- | --- | --- |
| Chesa Canggu | A (+ C как второй абзац при вопросе «что это») | форма/контакты официального сайта | описание постера; без ссылки на постер — он печатается только после согласия и выпуска источника |
| Sokkool | A (+ C) | форма/контакты официального сайта | то же |
| Matra Bali | A (+ C) | страница `/contact` официального сайта | то же |
| БалиЧат Чангу | B (RU-перевод делает владелец; публичный канонический язык — EN, `AGENTS.md` §4.15, а сообщение модератору — внутренняя переписка) | публичный аккаунт маркетинга БалиФорума | одну из трёх страниц §5, по теме чата |
| r/bali | B | modmail | одну страницу §5 |
| CANGGU COMMUNITY / Digital Nomads Bali | B | «Message admins» после вступления, только если правила разрешают | `/canggu/work-friendly-cafes` для номадов; `/canggu/best-brunch` для общей группы |
| TripAdvisor Bali Forum | — | — | не размещаем |

---

## §5. Landing URL: `?s=` и UTM

### QR (площадка §3.1)

- URL постера формирует код: `https://www.otherbali.com/?s=<source>`
  (`app/admin/(protected)/qr/source/[source]/page.tsx:13-20`; origin из
  `currentSiteOrigin`). UTM код **не добавляет**; посадка `/` с canonical `/`
  (`app/page.tsx:25`), дубль для поиска не создаётся (T-OB-04 §1).
- `<source>` — только выпущенный в `/admin` активный источник
  (`lib/admin-attribution.ts:31-43`), класс `external`
  (`lib/admin-attribution.ts:7-12`), один на точку размещения
  (`…/qr/source/[source]/page.tsx:58-60`). Список выпущенных — только в
  прод-БД (`OB_QR_SEO_PILOT.md` §2.3). **Место для источника:** `s=______`
  — BLOCKED_EXTERNAL + BLOCKED_DECISION.
- Метка проходит валидатор **только в нижнем регистре**
  (`lib/source-attribution.ts:1`; проверено локально: `OB-VIL-TEST-CHECKIN`
  → 400, §6.3). Если владелец выбирает нейминг из GTM-спеки, то в виде
  `ob-vil-<площадка>-checkin` (предложение T-OB-04 §3, решение открыто).

### Decision pages (площадки §3.2)

Существующие URL из `OB_QR_SEO_PILOT.md` §3.1, новых не создаём:

| # | URL | Для кого из §3.2 |
| --- | --- | --- |
| 1 | `https://www.otherbali.com/canggu/work-friendly-cafes` | Digital Nomads Bali, r/bali (вопросы «где работать») |
| 2 | `https://www.otherbali.com/canggu/best-brunch` | CANGGU COMMUNITY, БалиЧат Чангу |
| 3 | `https://www.otherbali.com/canggu/best-restaurants` | БалиЧат Чангу, r/bali |

UTM — **одна из двух конвенций репозитория; выбор конвенции — открытое
решение владельца (T-OB-04 §3, BLOCKED_DECISION)**. Ни одна не выбрана здесь.

| Конвенция | Источник | Пример для строки 2 |
| --- | --- | --- |
| A — Analytics Event Map | `docs/analytics/ANALYTICS_EVENT_MAP_2026-08-25.md:16-25` | `…/canggu/best-brunch?utm_source=<площадка_строчными>&utm_medium=referral&utm_campaign=bali_discovery_2026_q3&utm_content=community_post` |
| B — GTM measurement spec | `docs/gtm/BALI_PRIVILEGE_GROWTH_MEASUREMENT_SPEC.md:51-55` | `…/canggu/best-brunch?utm_source=community&utm_medium=organic&utm_campaign=gtm90-w1-<площадка>` |

Ограничение, важное для §6: туристская сторона читает только `s`/`source`
(`app/SourceCapture.tsx:16`); `utm_*` во внутреннее хранилище событий **не
попадают** и доходят только до GA4 после согласия (T-OB-04 §3). Значит,
без внешней аналитики UTM на ссылке для сообщества ничего не покажет.

Вариант для решения владельца (не применён): ссылки для сообществ могут нести
`?s=<источник класса external>` — `SourceCapture` смонтирован в
`app/layout.tsx:136` и читает query на любой странице, canonical гайда — self
(`app/canggu/best-brunch/page.tsx:10`), дубль не создаётся. Тогда first-touch
атрибуция сработает так же, как у QR. Цена: по одному выпущенному источнику
на сообщество (правило «один источник на точку»). **BLOCKED_DECISION.**

---

## §6. Критерий результата и что видно без внешней аналитики

### §6.1 QR

1. В `/admin` в воронке появился хотя бы один `source_scan` — счётчик
   `sourceScan` из `phase0_overview` (`lib/admin-operations.ts:44`;
   `supabase/migrations/0006_source_class_and_coverage.sql:85`). Разбивка по
   источнику — SQL 5 из T-OB-04 (`events where type='source_scan' group by source`).
2. Последующие события того же гостя несут тот же `source`: `/api/event`
   подставляет first-touch источник гостя в каждое событие
   (`app/api/event/route.ts:41-52` → `getGuestAttributionSource`,
   `lib/data.ts` → `resolveGuestAttributionSource`, `lib/actions/guest-source.ts:24-43`).
   Источник подставляется, только пока он активен; неактивный даёт `null`,
   событие сохраняется без атрибуции (`guest-source.ts:10-15`).

Скан — Intent, не результат (AGENTS.md §4.8, §12).

### §6.2 Decision pages — какое событие фиксирует действие

| Действие из ТЗ | Событие | Где в коде срабатывает | Согласие | Видно в `/admin`? |
| --- | --- | --- | --- | --- |
| Открыл гайд | `editorial_page_view` (slug `canggu/<guide>`) | `components/CangguGuideView.tsx:66` → `components/PageViewTracker.tsx:19` → `lib/analytics.ts` → `POST /api/event` | клиент не шлёт без согласия (`lib/analytics.ts:78`); сервер отвечает `skipped: no-consent` (`app/api/event/route.ts:33-36`) | нет — в `phase0_overview` нет этого типа (`lib/admin-operations.ts:42-52`); только SQL |
| Открыл место | `venue_detail_view` | `app/places/[slug]/page.tsx:512` | то же | нет — только SQL. `venueCardOpen` в воронке — это `venue_card_open` из потока погашения (`app/v/[venue]/redeem/RedeemFlow.tsx:54-56`), не открытие карточки из гайда |
| Открыл маршрут | **нет события** | `app/route/[slug]/page.tsx` не содержит `PageViewTracker`/`track` (grep по файлу) | — | **не измеряется** сегодня. `route_add` пишется только при добавлении места в план (`components/AddToTripButton.tsx:22`) |
| Сохранил | `save` | `components/SaveButton.tsx:58` — только после ответа `/api/save` с `saved: true` | то же | нет — только SQL |
| Официальный контакт | `official_website_click` (`app/places/[slug]/page.tsx:796`), `action_handoff` с `action: whatsapp/website` (`lib/analytics.ts:156`), `direction_click` для Maps (`components/TrackedDirectionsLink.tsx:6-13`) | там же | `direction_click` клиент шлёт всегда, сервер без согласия не пишет; остальные — как выше | `directionClick` — да (`lib/admin-operations.ts:48`); остальные — SQL |

Что видно без внешней аналитики: строки таблицы `events`
(`supabase/migrations/0003_attribution_events.sql:16-23`: `type`,
`guest_ref_id`, `venue_slug`, `source`, `ts`). Реферер и UTM в неё не
пишутся, поэтому «откуда пришёл гость на decision page» видно **только**
через `source` — а он привязывается только через `?s=` выпущенного
источника (§5, вариант для решения). Без `?s=` результат по сообществу
не отделим от органики.

SQL владельцу (только чтение, прод):

```sql
-- События волны по типу и источнику
select type, source, count(*) as n, min(ts) as first_ts, max(ts) as last_ts
from public.events
where ts >= '2026-09-30'
  and type in ('source_scan','landing_open','editorial_page_view',
               'venue_detail_view','save','route_add','direction_click',
               'official_website_click','action_handoff')
group by type, source
order by source nulls last, type;

-- Цепочка одного источника по гостям (критерий §6.1 п.2)
select guest_ref_id, type, venue_slug, ts
from public.events
where source = '<source>'
order by guest_ref_id, ts;
```

### §6.3 Проверка пути до тестового события (TESTED_LOCAL, фикстурный режим)

Как поднималось: `npm ci` (exit 0), затем
`OTHER_BALI_ALLOW_FIXTURE_DATA=YES npx next dev -p 3456` — как в T-OB-03; без
Supabase, ключей и реальных данных. Chromium из `/opt/pw-browsers`,
`playwright-core` во временном каталоге сессии (в репозиторий не добавлялся),
вьюпорт 360×780. `next dev` дописал блок в `AGENTS.md` — откачено, в коммит
не вошло.

| Шаг | Результат | Вывод |
| --- | --- | --- |
| `GET /?s=t-ob-06-test` | 200; canonical `https://www.otherbali.com` | посадка с `?s=` рендерится, дубля нет |
| Браузер открыл `/?s=t-ob-06-test` | `POST /api/source {"source":"t-ob-06-test"}` → **422** `{"ok":false}` | `SourceCapture` доходит до `/api/source` (`SourceCapture.tsx:18-25`); 422 — `setGuestSource` вернул `false`, т.к. без Supabase `serviceClient()` пуст (`lib/data.ts` → `setGuestSource`, `app/api/source/route.ts:25-28`). Это штатный отказ «источник не выпущен» |
| `curl POST /api/source {"source":"OB-VIL-TEST-CHECKIN"}` | **400** | прописная метка отбрасывается валидатором до БД; `SourceCapture` ошибку глотает (`.catch(() => {})`) — скан не засчитается и этого никто не увидит (совпадает с T-OB-04 §3) |
| `curl POST /api/event` без cookie согласия | 200 `{"ok":true,"skipped":"no-consent"}` | серверный гейт согласия работает |
| Браузер, «Essential only», затем `/canggu/best-brunch` → `/places/alchemy-uluwatu` | ни одного `POST /api/event`; только `GET /api/save` (200, `saved:false`) | без согласия воронка пуста, как задумано |
| Браузер, «Accept» на `/?s=…` | `landing_open` → 200 | первое событие после согласия |
| `/canggu/best-brunch` (согласие есть) | `editorial_page_view` slug `canggu/best-brunch` → 200 | открытие гайда фиксируется |
| `/places/alchemy-uluwatu` | `venue_detail_view` → 200 | открытие места фиксируется |
| Клик «Google Maps» | `action_handoff {action: maps, provider: google_maps}` и `direction_click` → 200 | оба события уходят |
| Кнопка Save | `disabled` в DOM, клик не выполнен; `curl POST /api/save` → **503** `{"error":"unavailable"}` | без Supabase сохранение недоступно, событие `save` не возникает (`SaveButton.tsx:58` — только при `saved:true`). Не проверяется локально |
| `/plan` → маршрут | ссылок `/route/*` нет (фикстурные маршруты не разрешаются в опубликованные места после правки T-OB-03) | открытие маршрута локально не воспроизведено; по коду событие и так не пишется |
| `/admin/qr/source/t-ob-06-test` без сессии | 307 → `/admin/login` | постер защищён; сам постер без Supabase не проверить («Source QR unavailable», `page.tsx:14-15`) |
| Гайды Canggu в фикстурном режиме | 0 ссылок `/places/` на `/canggu/best-brunch` | путь «гайд → карточка» локально пройден через реестр Uluwatu, не через Canggu |

Наблюдения (интерпретация): `POST /api/source` и `landing_open` в dev
уходят по два раза — двойной `useEffect` strict mode React, в production-сборке
один раз; `landing_open` уходит при каждой полной загрузке любой страницы,
потому что `SourceCapture` живёт в layout (`SourceCapture.tsx:27-34`), — имя
события шире его смысла.

Что без Supabase **не проверяется**: запись `source_scan` в `events`
(`app/api/source/route.ts:29` → `logEvent`, `lib/data.ts` — `serviceClient()`
пуст, RPC не вызывается); привязка источника к гостю (`set_guest_source`);
подстановка `source` в последующие события; сохранение (`/api/save` → 503);
воронка `/admin` (`phase0_overview`). Всё это — **NOT_VERIFIED**, проверяется
владельцем по чек-листу T-OB-04 (скан собственным телефоном → SQL 5).

---

## §7. Очередь на 14 дней (30.09 – 13.10) — только действия владельца

В задании нет отправок: исполнитель ничего не шлёт, не печатает и не
размещает. Каждая строка — действие владельца; «→» — условие перехода.

| Даты | Шаг | Действие владельца | Результат / условие |
| --- | --- | --- | --- |
| 30.09 – 01.10 | Проверка площадок | Открыть три официальных сайта §3.1, пройти пункты «что проверяет сам»; выбрать одну площадку; выполнить SQL 3–5 из T-OB-04 (QR в проде, список источников, сканы) | → выбрана площадка; известно, есть ли свободный источник |
| 01.10 | Решения §9 | Конвенция UTM и формат метки; нужен ли `?s=` на ссылках для сообществ | → §5 заполнен |
| 02.10 – 03.10 | Запрос согласия площадки | Текст A через публичную форму официального сайта | → ответ площадки. Нет ответа к 08.10 — вторая площадка из §3.1 |
| 02.10 – 03.10 | Правила сообществ | Прочитать полные правила БалиЧат Чангу (страница правил), `r/bali/about/rules`, правила двух групп Facebook после вступления | → в §3.2 «неизвестно» заменено на «разрешено / запрещено / по согласованию» |
| 04.10 – 06.10 | Источник и постер | При согласии: в `/admin` выпустить или выбрать источник класса `external`, открыть `/admin/qr/source/<id>`, отсканировать своим телефоном | → `source_scan` с этим id по SQL 5 (чек-лист T-OB-04 п.3–4) |
| 06.10 | Печать | Печать постера с `/admin/qr/source/<id>` (Ctrl-P) | → напечатано |
| 07.10 – 08.10 | Размещение | Разместить там, где площадка сказала; записать дату и точку в своих заметках | → дата размещения в `OB_QR_SEO_PILOT.md` §2.4 |
| 07.10 – 08.10 | Запрос модератору | Только для сообществ, где правила допускают: текст B модератору / маркетингу БалиФорума | → согласие или отказ; без согласия — ничего не публикуется |
| 09.10 – 13.10 | Замер QR | Раз в день SQL §6.2; первый `source_scan` с источником площадки = критерий §6.1 п.1; цепочка гостя = п.2 | → строка в §2.6 пилота |
| 09.10 – 13.10 | Замер decision pages | Если модератор согласился и ссылка размещена: SQL §6.2 по `editorial_page_view`, `venue_detail_view`, `save`, `official_website_click`; атрибуция к сообществу — только при `?s=` | → строка в §6 этого документа |
| 13.10 | Итог | Заполнить §2.4 и §2.6 пилота фактами; решить, вторая площадка или нет | → следующий запуск |

---

## §8. Чек-лист владельца (перед любым контактом)

1. Площадка (§3.1): сайт открывается; работает в 2026; адрес в Canggu;
   контакт — только публичная форма/общий адрес компании с официального сайта.
2. `select slug, qr_enabled from public.districts` — `canggu = true`
   (SQL 3, T-OB-04); в миграциях так, в проде NOT_VERIFIED.
3. Свободный активный источник класса `external` есть или выпущен (SQL 4);
   id — строчные буквы/цифры/`_`/`-`.
4. Собственный тестовый скан дал `source_scan` (SQL 5) **до** печати.
5. Постер: текст «Find your Canggu day» совпадает с районом площадки.
6. Сообщество (§3.2): правила прочитаны целиком; ссылка допустима или
   получено согласие модератора; аффилиация в посте раскрыта.
7. Ничего не обещать площадке и сообществу: ни гостей, ни цифр, ни отчётов.
   Скан и клик — Intent.
8. Ни одна ссылка не ведёт на новый URL: только `/` c `?s=` и три страницы §5.

## §9. Решения владельца

| # | Решение | Статус | Где применяется |
| --- | --- | --- | --- |
| 1 | Площадка для первого QR — одна из §3.1 (или резерв) | BLOCKED_DECISION | §3.1, §7 |
| 2 | Какой выпущенный источник закрепить за площадкой | BLOCKED_DECISION + BLOCKED_EXTERNAL (список в прод-БД) | §5 |
| 3 | Конвенция UTM: A (Event Map) или B (GTM-спека); формат метки строчными | BLOCKED_DECISION (T-OB-04 §3) | §5 |
| 4 | Ставить ли `?s=<external>` на ссылки для сообществ, чтобы видеть их результат внутри `events` | BLOCKED_DECISION | §5, §6.2 |
| 5 | RU-перевод текста B для БалиЧат Чангу (публичный язык продукта — EN) | BLOCKED_DECISION | §4 |
| 6 | Нужно ли событие открытия маршрута (`/route/<slug>` сегодня не пишет ничего) — это правка кода, вне этого запуска | BLOCKED_DECISION | §6.2 |
| 7 | Идти ли во вторую площадку, если первая не ответит к 08.10 | BLOCKED_DECISION | §7 |
