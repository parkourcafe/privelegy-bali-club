# Bali Privilege — Master Architecture

**Status:** v0.4-current · sync rewrite for repository source-of-truth · 2026-07.

**Purpose.** This is the canonical product/data-model source of truth referenced by
`CLAUDE.md`. It is a sync of decisions already made in `CLAUDE.md`,
`docs/money-model.md`, `docs/tablepilot-bridge-handoff.md`,
`docs/tablepilot-integration.md`, and the current code. It intentionally does not
invent new product concepts.

**How to read this file.** Current canon is above the history appendix. The original
v0.2 Phase-0 architecture is preserved verbatim in **Appendix Z — History** for audit
trail and context, but it is superseded where this v0.4 section says so.

**Legend.** `[implemented]` = present in the repo/code or verified handoff docs.
`[planned]` = decided direction, not implemented in BP code yet. `OPEN — needs
Selena's decision` = not canonical; do not build without Selena's explicit decision.

---

## 0. Sources and authority

1. `CLAUDE.md` — hard guardrails for coding agents and current project status.
2. This file — product/data-model architecture source of truth.
3. `docs/money-model.md` — detailed canonical money decision v0.3.
4. `docs/tablepilot-bridge-handoff.md` and `docs/tablepilot-integration.md` —
   reservation bridge implementation notes and proof/handoff status.
5. Actual code/migrations in this repo — implementation truth for BP.
6. TablePilot repo/code — implementation truth for TablePilot.

If this file and `CLAUDE.md` diverge on a guardrail, stop and reconcile before coding.
If this file and current code diverge on implementation status, mark the feature as
`[planned]` until code proves otherwise.

---

## 1. Current product thesis

Bali Privilege is the internal architecture name for a free trip-planning and
on-island decision guide for Bali tourists. The public surface may be branded
separately; this document does not change public naming unless `CLAUDE.md` or a
separate brand spec explicitly does so.

Core strategy remains:

- **Bali-wide planning:** broad, free planning content and route/context pages.
- **Canggu-deep execution:** one active deep district at a time, starting with
  Canggu, where curated venues, perks, QR redemption, reservation handoff, and
  partner reporting live.

**Source:** v0.2 master thesis in Appendix Z; `CLAUDE.md` “What this project is”.

---

## 2. Executive rule — current

**No expansion beyond Canggu-deep proof.** Phase 1A is unlocked, but scope remains
constrained: harden the existing Canggu redemption/reservation surface and prove the
business loop before expanding product ambition.

### Allowed now

- Existing app/PWA hardening already unlocked by `CLAUDE.md` Phase 1A.
- Density readiness work: real Canggu venues/perks/routes, verified tags, price
  anchors, and route wiring.
- Source attribution and QR/redemption integrity work.
- TablePilot handoff and reconciliation work that does **not** build a booking engine
  inside BP.
- Aggregate partner reporting.

### Still forbidden without a new explicit gate

- BP-internal booking engine.
- Tourist-side payments of any kind.
- Paid ranking in organic results.
- Google Maps review scraping or republishing.
- AI assistant/chatbot in the tourist product.
- Monetization, QR, paid listing, or partner placement outside `active_deep`.
- New entities/features beyond this master without Selena's explicit decision.

**Sources:** `CLAUDE.md` Status, guardrails #1–#11, guardrail reconciliation note;
`docs/money-model.md`; BP code `components/ReserveButton.tsx` and
`supabase/migrations/0010_tablepilot_bridge.sql`.

---

## 3. Money model (§5 current canon)

Bali Privilege earns money only from venues and only from a proven reservation result.
The tourist never pays.

**Billable rule:** BP earns a **fixed fee per confirmed seated reservation** made by a
tourist through the BP → TablePilot reservation path.

We earn only when all are true:

1. the tourist found the venue through BP;
2. the tourist made a table reservation through TablePilot;
3. the venue confirmed the reservation;
4. the guest arrived / was seated, or counted as seated per the venue's rules;
5. the event is provable in the system.

### Explicitly not the money model

- No flat monthly subscription as the canonical model.
- No “Tariff A / Tariff B”.
- No paid listing / Featured / Route Placement / Category Sponsorship / Seasonal
  Campaign as standalone paid products.
- No percentage of cheque.
- No deposit.
- No fee for “being in the catalogue”.

The perk/QR flow remains valuable, but as a **tourist incentive and independent
arrival/perk proof**, not the billed event.

**Sources:** `docs/money-model.md` (“The rule”, “What is explicitly killed”, “The
chain”); `CLAUDE.md` guardrail #5.

---

## 4. TablePilot and reservation bridge

BP does not build a booking engine internally. Reservations are handled by the
external TablePilot product.

### Current implemented pieces

| Piece | Status | Evidence |
|---|---:|---|
| BP venue can carry a TablePilot slug | `[implemented]` | `supabase/migrations/0010_tablepilot_bridge.sql`; `lib/data.ts` maps `tablepilot_slug` → `tablepilotSlug` |
| BP “Reserve a table” handoff to TablePilot | `[implemented]` | `components/ReserveButton.tsx` opens `/book/<tablepilotSlug>?source=bali_privilege` |
| BP logs demand before handoff | `[implemented]` | `components/ReserveButton.tsx` logs `reservation_click`; `app/api/event/route.ts` allows it |
| TablePilot accepts/persists `source=bali_privilege` | `[implemented]` | `docs/tablepilot-bridge-handoff.md` says TablePilot commit `41a5270` was merged/deployed; local TablePilot checkout shows `BookingSource` includes `bali_privilege` and `sourceFromSearchParams()` |
| TablePilot partner report for BP | `[implemented]` per handoff/prod proof | `docs/tablepilot-bridge-handoff.md` reports live `GET /api/partner/bali-privilege/report` returning no guest PII |
| BP-side storage/aggregation of TablePilot seated report | `[planned]` | `docs/tablepilot-integration.md` Step 2 says BP can pull/push report; no BP-side reconciliation table/code verified in this repo |

### Seated semantics

TablePilot does **not** add a new `seated` status. Its existing reservation statuses
include `arrived` and `completed`; the bridge handoff defines billable/seated as:

```text
source === "bali_privilege" AND status ∈ {arrived, completed}
```

**Sources:** `CLAUDE.md` guardrail #3; `docs/money-model.md` “Reservation engine =
TablePilot”; `docs/tablepilot-bridge-handoff.md` lines describing LIVE prod proof,
seated semantics, and no-PII report; BP code paths above; local TablePilot code paths
`src/lib/types.ts`, `src/App.tsx`, `src/lib/domain.ts`.

---

## 5. Current data model

Canonical names remain:

```text
Venue · VenueProductEnrollment · District · ContentPage · RouteStop · Offer/Perk ·
Placement · Redemption · Event · User/Role · GuestRef · ConsentLog ·
VenueReservationConfig
```

Do not add booleans such as `is_partner`, `is_bp_partner`, or
`is_tablepilot_tenant`. Use enrollment/config concepts.

### Implemented BP fields / flows

| Concept | Status | Evidence |
|---|---:|---|
| `venues.tablepilot_slug` | `[implemented]` | `supabase/migrations/0010_tablepilot_bridge.sql` |
| District status / monetization / QR flags | `[implemented]` | `supabase/migrations/0006_source_class_and_coverage.sql` |
| QR write blocked outside QR-enabled district | `[implemented]` | `record_redemption()` in migration `0006_source_class_and_coverage.sql` |
| Creator / external / in-venue redemption buckets | `[implemented]` | `_source_class()` and `partner_report()` in migration `0006_source_class_and_coverage.sql` |
| Partner Notes source breakdown + repeat | `[implemented]` | `partner_notes()` in migration `0008_partner_notes.sql`; `CLAUDE.md` unlock log |
| Guest identity via httpOnly cookie | `[implemented]` | `CLAUDE.md` reconciliation #10; code paths `middleware.ts`, `lib/guest-server.ts` |
| My Perks | `[implemented]` | `my_redemptions()` in migration `0009_my_perks_and_feedback.sql` |
| Dish feedback | `[implemented]` | `log_dish_feedback()` in migration `0009_my_perks_and_feedback.sql`; `app/api/dish/route.ts` |

### Event / loop status

Only describe event names as canonical if they exist in docs/code below.

| Event / loop | Status | Evidence / notes |
|---|---:|---|
| `landing_open` | `[implemented]` | allowed by `app/api/event/route.ts`; counted by `phase0_overview()` |
| `venue_card_open` | `[implemented]` | allowed by `app/api/event/route.ts`; counted by reports |
| `perk_open` | `[implemented]` | allowed by `app/api/event/route.ts`; counted by reports |
| `reservation_click` | `[implemented]` | allowed by `app/api/event/route.ts`; logged by `ReserveButton` |
| `similar_open` | `[implemented]` | allowed by `app/api/event/route.ts` |
| `redemption` | `[implemented]` | inserted by `record_redemption()` |
| `dish_feedback` | `[implemented]` | inserted by `log_dish_feedback()` |
| TablePilot `source=bali_privilege` reservation creation | `[implemented]` | `docs/tablepilot-bridge-handoff.md` prod proof; TablePilot code checkout |
| TablePilot billable report (`arrived`/`completed`) | `[implemented]` per TablePilot handoff | `docs/tablepilot-bridge-handoff.md` prod proof |
| BP-side seated reconciliation / fee accounting | `[planned]` | direction in `docs/money-model.md` and `docs/tablepilot-integration.md`; no BP code verified |

### OPEN — needs Selena's decision

These names/concepts are **not** canon yet. Do not implement them just because they
sound useful:

- New BP tables for reservation lifecycle or billing, including names like
  `ReservationAttribution`, `ReservationProofEvent`, `BillingEvent`, or `fee_event`.
- Exact BP-side reconciliation storage model for TablePilot reports.
- Exact fee amount, invoice cadence, dispute/waiver rules, or whether a confirmed
  but not arrived booking can ever be billable.
- Whether `Placement` remains only a non-paid content/labeling concept or is removed
  from MVP surfaces. Money model v0.3 kills paid placement as a product.

**Sources:** `CLAUDE.md` data model section and guardrails #3–#5/#8–#11;
`docs/money-model.md`; `docs/tablepilot-integration.md`; migrations `0006`, `0008`,
`0009`, `0010`; BP code `components/ReserveButton.tsx`, `app/api/event/route.ts`.

---

## 6. Product surface and content rules

Public UI is English-only. Russian is allowed only for admin/founder-facing surfaces.
The tourist product remains mobile-first.

Current differentiator: BP is not a generic catalogue. It must answer “where should I
go and why?” using curated venue cards, verified vibe tags, price anchors, routes,
perks, and reservation handoff for bookable venues.

### Current implemented card fields

`Venue` currently includes: `vibeTags`, `priceAnchor`, `whatToOrder`, `photoUrl`,
`whatsapp`, and `tablepilotSlug` as optional fields in `lib/types.ts`.

### OPEN — needs Selena's decision

The following “moment / JTBD” content fields are discussed in product work but are
not present in current BP code and are not canon until Selena approves the schema:

- `whyItsHere`
- `bestFor`
- `notFor`
- `practicalTags`
- `jobsToBeDone`
- Any new “Moment” table/entity

If introduced, prefer additive optional fields or static/config content first; do not
create new entities without explicit approval.

**Sources:** `CLAUDE.md` stack/language/guardrails; `lib/types.ts`; no matching code
found for the JTBD field names in current BP repo.

---

## 7. Roadmap / gates — current

`CLAUDE.md` is current for build status:

- `[implemented]` Phase 0 gate passed; `BUILD: UNLOCKED — Phase 1A`.
- `[implemented]` localStorage removed in favor of httpOnly guest cookie.
- `[implemented]` creator bucket + coverage flags.
- `[implemented]` execution surface: vibe/category filters, routes, partner Notes.
- `[planned / field work]` density readiness: ≥30 places · ≥15 perks.

Money-model gate shifted from QR redemption alone to the reservation chain described
in `docs/money-model.md`: do tourists reserve through BP/TablePilot, do reservations
convert to arrived/seated guests, and will venues pay a fixed fee for those proven
seated guests?

QR/perk redemption remains useful for arrival/perk proof and partner trust, but it is
not the billed event.

**Sources:** `CLAUDE.md` Status and Unlock log; `docs/money-model.md` “Phase 0 gate —
shifted”; BP migrations/code cited above.

---

## 8. Still-valid strategic constraints from v0.2

The following v0.2 strategic constraints remain current unless superseded above:

- Tourist never pays.
- Canggu is the first active deep district.
- Outside active_deep: planning content/RouteStops may exist; monetization, QR, and
  paid/partner placement are blocked.
- Google Maps is a navigation substrate, not a competitor to replace.
- No Google review scraping/republishing; manual consensus-check only.
- No AI assistant/chatbot in the tourist product.
- Organic editorial picks are separate from sponsored/partner labeling.
- Bad choices are excluded by absence; no anti-lists.

---

## 9. Version notes

- **v0.2 Phase-0 architecture** — original strategy, preserved in Appendix Z.
- **v0.3 money model** — fixed fee per BP-sourced confirmed seated reservation;
  detailed in `docs/money-model.md`.
- **v0.4-current** — this rewrite: reconciles the master with current `CLAUDE.md`,
  money model v0.3, TablePilot bridge handoff/proof notes, and BP implementation
  status without inventing new canon.


---

# Appendix Z — History (v0.2 Phase-0 architecture)

> Preserved verbatim for audit trail. Current canon is the v0.4-current section above.

# Bali Privilege — Полная архитектура

**Master-документ.** Единый источник правды: стратегия, продукт, техника, роадмап.
Версия: 0.2. Собирается секциями: каждая пишется → ревью (1–100) → фиксация → следующая.

Линзы автора: senior platform-инженер · GTM-стратег · маркетолог рынка Бали.
Легенда меток: **[ЗНАЕМ]** — установленный факт · **[ПРЕДПОЛАГАЕМ]** — рабочая гипотеза · **[ПРОВЕРИМ]** — подтверждается только землёй.

> ## ⛔ EXECUTIVE RULE — никакого расширения архитектуры до результатов Phase 0
> Документ достаточно умный, чтобы выйти в поле. Дальше прогресс измеряется **в данных с земли, а не в новых секциях.**
>
> **Разрешено до Phase 0:** field-test label · 5 perks заведений · 2–3 source-QR вилл/coliving · трекинг по источникам · WhatsApp/Linktree/landing · ручной mini-report партнёру.
>
> **Запрещено до Phase 0:** билд PWA · полная CMS · partner dashboard · SEO planning-страницы · любая работа по TablePilot · нейминг сверх field-test label.

---

## Статус секций

| # | Секция | Статус |
|---|---|---|
| **A. Стратегия и рынок** | | |
| 1 | Тезис и позиционирование | ✅ зафиксировано |
| 2 | Рынок и сегменты туристов Бали | ✅ зафиксировано |
| 3 | Конкуренты и щель | ✍️ на ревью |
| 4 | Ценность: турист и заведение | ✍️ на ревью |
| 5 | Модель денег | ✍️ на ревью |
| 6 | Бренд, нейминг, тон | ✍️ на ревью |
| **B. Продукт и UX** | | |
| 7 | Поверхности: Web vs PWA | ✍️ на ревью |
| 8 | Информационная архитектура | ✍️ на ревью |
| 9 | Пользовательские сценарии | ✍️ на ревью |
| 10 | Фичи туриста | ✍️ на ревью |
| 11 | Фичи партнёра | ✍️ на ревью |
| 12 | Фичи админа | ✍️ на ревью |
| 13 | Контент-система | ✍️ на ревью |
| **C. Техническая архитектура** | | |
| 14 | Стек и обоснование | ✍️ на ревью |
| 15 | Модель данных | ✍️ на ревью |
| 16 | Coverage policy как constraints | ✍️ на ревью |
| 17 | QR / redemption flow | ✍️ на ревью |
| 18 | Аналитика и event-pipeline | ✍️ на ревью |
| 19 | Auth, роли, мультитенант, приватность | ✍️ на ревью |
| 20 | Интеграции и security baseline | ✍️ на ревью |
| **D. Роадмап и исполнение** | | |
| 21 | Поэтапный роадмап с гейтами | ✍️ на ревью |
| 22 | KPI и gate-числа | ✍️ на ревью |
| 23 | Costs / opEx | ✍️ на ревью |
| 24 | Риски и kill-criteria | ✍️ на ревью |
| **E. Мета** | | |
| 25 | Реестр гипотез | ✍️ на ревью |
| 26 | Открытые решения и версии | ✍️ на ревью |

---

# Часть A. Стратегия и рынок

## 1. Тезис и позиционирование

### 1.1. Одно предложение

> **Bali Privilege — бесплатный планировщик поездки по Бали, который зарабатывает не на туристах, а на заведениях, и делает это через глубину одного района за раз, начиная с Canggu.**

### 1.2. Двухслойный тезис (несущая конструкция всего продукта)

Продукт живёт в двух слоях, и их нельзя путать:

- **Широкий слой — Bali-wide planning.** Турист видит весь Бали как планировщик: маршруты, сравнения районов, itineraries. Это дешёвый слой: контент, трафик, верх воронки. Здесь **нет** монетизации.
- **Узкий слой — Canggu-deep execution.** В одном активном районе: курированные места, perks, QR, redemption, partner dashboard. Это дорогой слой: операции и деньги.

Правило, которое защищает тезис: **планирование — широкое и бесплатное; глубина, перки и деньги — только в активном deep-районе.** Широкий слой кормит узкий трафиком; узкий слой кормит бизнес деньгами.

### 1.3. Позиционные формулировки

**Для туриста (внешнее):**
> Plan your whole Bali trip — then get the deepest curated guide with routes and real perks, starting in Canggu.

**Для заведения (B2B):**
> Get discovered by tourists who are already planning their trip — and prove it with real redemptions, not vanity views.

**Внутреннее (для команды):**
> Bali-wide planning, Canggu-deep execution.

### 1.4. Чем мы НЕ являемся (границы позиционирования)

- **Не** скидочная карта. Турист не покупает доступ; perks — часть ценности, а не товар. **[ЗНАЕМ]** — решено по модели денег.
- **Не** островной справочник мест. На каталоге мест нас раздавит Bali Bible (широкий охват, бренд, SEO-след). **[ПРЕДПОЛАГАЕМ]** — щель в глубине, не ширине.
- **Не** замена Google Maps. Maps отвечает «где это?»; мы отвечаем «куда пойти и почему» + perk. Мы — **слой выбора и привилегий поверх Maps**, а Maps у нас — кнопка навигации. **[ЗНАЕМ]**
- **Не** супер-апп. Без AI-ассистента, booking-движка, отзывов, loyalty на старте. **[ЗНАЕМ]**

### 1.5. Почему именно так (логика позиционирования)

1. **Турист скачивает заранее только то, что решает проблему до поездки.** Не «скидку в неизвестном месте», а «как провести Бали без хаоса». Поэтому ядро — планирование, а не перки. **[ПРЕДПОЛАГАЕМ]**
2. **Платит заведение, а заведение платит за результат, не за присутствие.** Значит продукт обязан доказывать redemptions, а не показы. Это диктует всю архитектуру метрик. **[ЗНАЕМ — принцип]**
3. **Маленький новый игрок выигрывает не шириной, а плотностью.** Один район с реальной плотностью перков ощущается как продукт; пять районов по чуть-чуть — как пустой каталог. **[ПРЕДПОЛАГАЕМ]**

### 1.6. Главный риск тезиса

Самое непроверенное звено: **гасят ли туристы QR, и платит ли заведение за доказанные redemptions.** Вся остальная архитектура — надстройка над этим одним фактом. Поэтому Phase 0 роадмапа (Часть D) — не билд, а полевой тест именно этого. **[ПРОВЕРИМ]**

---

### Решения по секции 1 (зафиксировано)

1. **Имя «Bali Privilege» — техническое.** Рабочий лейбл для документа; финальный нейминг прорабатываем в секции 6. Риск слова «Privilege» (тянет к «клубности/карте») держим в уме до тех пор. **[ЗНАЕМ — решено]**
2. **Якорь зафиксирован: active_deep = Canggu.** KORA (**Ubud**, открытие дек 2026) — future-anchor района №2: **next_deep = Ubud, дата-якорь = открытие KORA.** Логика: 12 кухонь KORA = мгновенный кластер Founding-партнёров, свой персонал = чистый redemption-учёт (лаборатория процесса). Подготовка Убуда делегирована полевому оператору по отдельному документу (Ubud_Preparation_Handbook.md) — разведка и тёплые договорённости без запуска; монетизация Убуда — только по гейту (Canggu-proof или открытие KORA). Если Canggu-gate провалится, Ubud×KORA — первый кандидат в «другой первый район». **[ЗНАЕМ — решено]**

---

## 2. Рынок и сегменты туристов Бали

> Источник чисел — BPS Bali (официальная статистика), 2025–2026. Помечено [ЗНАЕМ] там, где это официальные данные; [ПРЕДПОЛАГАЕМ] — там, где это интерпретация под Чангу.

### 2.1. Размер рынка

- **[ЗНАЕМ]** За 2025 год Бали принял ≈ 6,95 млн прямых иностранных прибытий (+9,72% к 2024). Плюс внутренний турпоток — в 2024 это 10,1 млн внутренних туристов из 16,4 млн общего.
- **[ЗНАЕМ]** Сезонность выражена: пик — июль (≈625 тыс.) и август (≈617 тыс.); лучшие shoulder-сезоны — апрель–начало июня и сентябрь–октябрь. Для нас это значит: запуск и набор плотности лучше целить в shoulder/peak, не в низкий сезон.
- **[ПРЕДПОЛАГАЕМ]** Нам не нужен весь поток. Нужна доля, которая (а) едет в зону Чангу и (б) планирует заранее. Точное число — [ПРОВЕРИМ] на земле через acquisition-каналы.

### 2.2. Топ source-рынки (2025, BPS)

**[ЗНАЕМ]** За 2025: Австралия — 1,63 млн (23,44% всего потока), Индия ≈569 тыс., Китай ≈537 тыс., Южная Корея ≈347 тыс., Великобритания ≈318 тыс., Франция ≈279 тыс., США ≈275 тыс., Малайзия ≈251 тыс., Сингапур ≈211 тыс., Япония ≈209 тыс.

**Маркетинговое прочтение:**
- **Австралия — доминирующий рынок** и при этом англоязычный, ездит часто, знает Чангу. Это первичный язык продукта и первичная аудитория контента. **[ЗНАЕМ — данные; ПРЕДПОЛАГАЕМ — приоритет]**
- **Англоязычное ядро** (AU + UK + US) — ≈2,2 млн/год. Контент и UX на английском покрывают самый ценный сегмент без локализации. **[ПРЕДПОЛАГАЕМ]**
- Индия и Китай большие, но требуют отдельного контента/каналов и часто travel-agent-моделей; **откладываем** как локализацию после англо-MVP. **[ЗНАЕМ — решение по scope]**

### 2.3. Почему именно Чангу (соответствие аудитории)

**[ПРЕДПОЛАГАЕМ]** Чангу — это самоподбор нужной нам аудитории:
- Молодые independent-путешественники, digital nomads, серф/кафе/beach-club культура — то есть люди, которые **планируют сами в телефоне** и не ходят через турагента.
- Высокая плотность кафе, бранчей, beach-club'ов, SPA — категории, которые дают perks и хотят туристического трафика.
- Соцсетево-родной район (Reels/TikTok про Чангу — огромный объём), что совпадает с нашим acquisition-каналом B.
- Англоязычная среда — наш язык MVP работает без трения.

**Риск-флаг [ПРОВЕРИМ]:** Чангу перенасыщен экспатами и долгосрочниками, которые «и так всё знают». Наша цель — **приезжий турист**, а не местный экспат. Это нужно проверить на acquisition-этапе: даёт ли вилла/coliving-канал именно туристов, а не резидентов.

### 2.4. Целевые сегменты v0.1 (приоритизация)

| Сегмент | Почему он | Приоритет |
|---|---|---|
| AU / UK / US independent traveller, 25–40 | Англоязычный, планирует сам, ядро Чангу | **Первичный** |
| Digital nomad / long-stay visitor | Высокая частота посещения заведений, ценит perks | **Вторичный** |
| Пары / honeymoon | Высокий чек, романтика/sunset/dining | Вторичный |
| Семьи с детьми | Отдельные потребности (family-маршруты) | Поздний |
| Индия / Китай / внутренний РФ-поток | Большие, но требуют локализации/каналов | Отложен |

**[ПРЕДПОЛАГАЕМ]** Первичный + вторичный сегменты дают достаточно плотности спроса в Чангу, чтобы заведению было ради чего платить. Это ключевая гипотеза, которую проверяет Phase 0.

### 2.5. Поведенческая основа (на чём держится воронка)

- **[ПРЕДПОЛАГАЕМ]** До-трип планирование первичного сегмента живёт в Google / Instagram / TikTok / YouTube, не в app-сторах. → web-first acquisition, а не «скачай приложение».
- **[ПРЕДПОЛАГАЕМ]** На острове решение «где поесть сейчас / куда на закат» — импульсное, рядом-сейчас. → on-island PWA с near-me + perk.
- **[ПРОВЕРИМ]** Готовность гасить QR ради perk — самое непроверенное поведение. Прямо измеряется в Phase 0.

### Решения по секции 2 (зафиксировано)

1. **Язык.** Публичный продукт на старте — **только английский** (покрывает первичный сегмент AU/UK/US, быстрее всего). **Русский — рабочий слой для основателя** (админка + драфты контента дублируются на русский), а **не** полная локализация продукта. Русская локализация для рынка — отложена до пост-MVP. **[ЗНАЕМ — решено]**
2. **Сезонное окно — открыто.** Целить Phase 0 в ближайший shoulder/peak ради максимума туристов, или стартовать по готовности? Влияет на роадмап (секция 21). *(ждёт решения)*

> **Сквозной приоритет: СКОРОСТЬ.** Везде, где есть развилка «быстрее vs полнее», по умолчанию выбираем быстрее. Самый быстрый путь к сигналу — Phase 0 (печатный QR + WhatsApp, без билда), а не ускоренная разработка приложения. Это зашито в роадмап (Часть D).

---

## 3. Конкуренты и щель

### 3.1. Конкурентная карта (3 уровня)

1. **Прямой инкумбент** — The Bali Bible.
2. **Платформа-подложка** — Google Maps (не воюем, используем).
3. **Фоновые/референсы** — BaliCard, Bali Buddies, TripAdvisor/Yelp (модели, не прямые конкуренты в нашей нише).

### 3.2. The Bali Bible — прямой инкумбент

**[ПРЕДПОЛАГАЕМ — цифры верифицированы поиском, но требуют source-link перед внешним использованием]** Широкий островной справочник: ≈16 000+ листингов, аудитория ≈2,5 млн, бесплатное офлайн-приложение с deals, активны в 2026. Команда ≈12 человек (Tracxn, апр. 2026), не профинансированы крупно.

- **Их сила:** бренд, аудитория, SEO-след, большая база мест, привычка пользователя, deals.
- **Их слабость (наша щель):** широкий охват **без районной глубины**; команда из ≈12 человек физически не курирует плотность по каждому району; это **listing-форма** (справочник), а не opinionated planning + perks с доказанными redemption.

### 3.3. Google Maps — не конкурент, а подложка

**[ЗНАЕМ]** Maps выигрывает вопрос «где это?»: больше мест, отзывы, навигация, привычка. Мы **не воюем** на этом поле — проиграем. Maps у нас = кнопка навигации внутри карточки. Наш ответ — на другой вопрос: **«куда пойти и почему»** + perk + маршрут. Мы — слой выбора и привилегий поверх Maps.

### 3.4. Фоновые и референсы (коротко)

- **Teepee (Бали) — adjacent, следить.** Бесплатное приложение «заведения ↔ криэйторы»: perks (бранчи/SPA/beach clubs) в обмен на контент, QR при приходе, offers instant/по одобрению, без минимума подписчиков. **Не прямой конкурент** (barter «контент за perk» vs наш «гид за подписку заведения»), но: (а) уже приучил заведения Чангу к QR-perk-механике — рынок образован, онбординг легче; (б) риск разворота в сторону туристов — мониторить. **[ЗНАЕМ — верифицировано, июль 2026]**
- **BaliCard (Bali.com)** — скидочная карта. Мы шире (планировщик, не карта ради скидки) и без монетизации туриста.
- **Bali Buddies** — media/SEO-гид. Сильный контент, но без perks/QR/redemption-слоя.
- **TripAdvisor / Yelp** — **модель** B2B-видимости (бизнес платит за видимость, пользователь бесплатно), не территориальный конкурент. Берём механику.
- **Российские паттерны (референс, не конкуренты):** Greatlist × T2 Selection — perks дистрибутируются как привилегия телеком/банковской экосистемы (white-label модель → в North-star); RUSSPASS — гос-планировщик «маршруты+гид+бронь» (связка жизнеспособна); Горбилет/ВсемЕда — скидочные агрегаторы (модель, от которой мы ушли: выжигает маржу, тянет охотников за скидками).

### 3.5. Наша щель — в одном предложении

> Глубина одного района + opinionated planning + perks с **доказанными redemption** — то, что широкий справочник и Google Maps структурно не делают.

### 3.6. Защитная позиция (почему не догонят мгновенно)

- **[ПРЕДПОЛАГАЕМ]** Плотность в районе + тёплая локальная сеть (твой актив: 3 года, Bali Horeca) — не покупается деньгами за неделю.
- **[ПРЕДПОЛАГАЕМ]** Redemption-proof на каждого партнёра как B2B-аргумент — у Bali Bible есть deals, но (гипотеза) без жёсткого per-partner redemption-tracking, который мы делаем ядром.
- **[ПРОВЕРИМ]** Главный незакрытый вопрос: видят ли заведения разницу и готовы ли платить **нам**, уже имея Bali Bible. Проверяется в Phase 0/1 напрямую.

### 3.7. Главный конкурентный риск

**[ПРЕДПОЛАГАЕМ]** Bali Bible может добавить «районную курацию» — у них бренд и аудитория, чтобы это масштабировать. Наша единственная защита — **скорость набора плотности в Чангу + отношения**, пока они большие и медленные (≈12 человек на весь остров). Отсюда сквозной приоритет скорости.

### Открытые решения по секции 3

1. **Публичное позиционирование против Bali Bible.** Делаем явный контраст наружу («не справочник — курируемый гид»), или строим тихо, а контраст используем только в B2B-разговоре с заведением («redemption-proof vs просто listing»)? Моя рекомендация — тихо наружу, контраст в продажах.

---

## 4. Ценность: турист и заведение

Это два разных продукта для двух разных клиентов. Турист получает ценность бесплатно; заведение платит. Путать их сообщения нельзя.

### 4.1. Ценность для туриста (почему он скачивает и возвращается)

| Момент | Боль | Что даём |
|---|---|---|
| До поездки | «Не понимаю Бали, боюсь хаоса, плохих мест, лишней беготни» | Готовые маршруты, сравнения районов, план на 3/5/7 дней |
| На острове | «Где поесть рядом сейчас, куда на закат, что в дождь» | Near-me карта, курированные места, perk |
| В заведении | «Хочу почувствовать, что меня нормально встретили» | Perk (welcome drink, десерт, upgrade) через QR |

**Ключ:** ценность туриста — **снятие хаоса + ощущение привилегии**, а не «скидка». **[ПРЕДПОЛАГАЕМ]**

### 4.2. Ценность для заведения (за что платит)

Заведение платит **не за присутствие в приложении**, а за: доступ к туристам, которые уже планируют или находятся рядом, + **доказательство результата**. Конкретно: показы карточки, клики Maps/WhatsApp, сохранения, открытия perk, **QR-redemptions**, повторные визиты.

**Продаём не «листинг», а:** «мы приводим гостей в твоём районе и показываем это в цифрах». **[ЗНАЕМ — принцип]**

### 4.3. Почему perks, а не скидки

Скидка 10% = «считай копейки», дёшево. Perk (welcome drink, бесплатный десерт, комплимент, late checkout) = «меня встретили». Дороже воспринимается, дешевле обходится заведению, лучше для бренда обеих сторон. **[ПРЕДПОЛАГАЕМ]**

### Открытые решения по секции 4
1. Минимальный стандарт perk: задаём ли мы планку («perk должен быть осязаемым, не «−5%»») или принимаем любой? Рекомендация — задаём планку, иначе ценность размывается.

---

## 5. Модель денег

> **⚠️ SUPERSEDED (2026-07-06) — §5.1a ниже устарел.** Money model v0.3
> (канонический текст: `docs/money-model.md`, зафиксирован в CLAUDE.md
> guardrail #5) отменяет «два тарифа A/B». Актуально: доход = **фиксированная
> плата за подтверждённую состоявшуюся бронь (seated reservation)** через нашу
> reservation-систему (TablePilot). Никаких listing/featured/subscription/tiers,
> никакого процента с чека. Perk + QR остаются стимулом туриста и доказательством
> прихода, но **не** являются биллируемым событием. Разделы §5.1a/§5.3/§5.4 ниже
> сохранены как исторический контекст решения; при расхождении — верно
> `docs/money-model.md`.

### 5.1. Принцип
Турист не платит **никогда**. Доход — только с заведений, и только в active_deep районе. Без premium-туриста, без пластиковой карты как ядра. **[ЗНАЕМ — решено]**

### 5.1a. Два тарифа на выбор заведения (оба — с заведения, не с туриста)
- **Тариф A — Фиксированный (с MVP).** Выше месячный платёж, **без** платы за брони. Для тех, кто не хочет считать брони и боится «налога на гостя».
- **Тариф B — Лёгкий + плата за бронь (будущий).** Низкий месячный + **небольшая фиксированная сумма за каждую доказанную бронь** (фикс за приведённый стол — **не** процент с чека, не процент с депозита, в кассу заведения не лезем). Для тех, кто хочет платить мало вперёд.
- **Гейт Тарифа B:** включается ТОЛЬКО когда есть система, считающая брони end-to-end (с подтверждением и no-show). Фикс убирает спор «сколько платить», но не убирает «доказать, что бронь была» — на WhatsApp-редиректе это невозможно. **[ПРЕДПОЛАГАЕМ — будущая линия, гейт на booking-движок]**

Выбор тарифа закрывает страх: боишься платы за брони — берёшь A; хочешь платить меньше вперёд — берёшь B. Турист в обоих случаях не платит никогда.

### 5.2. Партнёрская лестница (статусы)
```
Editorial Seed → Launch Partner → Founding Partner → [proof] → Paid tiers
```
- **Editorial Seed** — добавлены ради качества гида, не платят.
- **Launch Partner** — 60–90 дней пилота, perk + карточка + аналитика, потом тариф или выход.
- **Founding Partner** — платит сниженный launch-тариф за founding-статус + контент-пакет (НЕ за «гарантированный трафик»). Со-инвестор в proof-фазу.

### 5.3. Платные форматы (включаются только после redemption-proof)
1. **Basic Listing** — карточка, карта, категория, 1 perk, базовая статистика.
2. **Featured Partner** — выше в списке, бейдж, подборки, видео, расширенная аналитика.
3. **Route Placement** — место в маршруте (ценнее каталога: турист уже планирует день). *Ключевой defensible-формат.*
4. **Category Sponsorship** — Featured в категории района, **ограниченное число слотов**.
5. **Seasonal Campaign** — высокий сезон/праздники.

### 5.4. Ориентир цен **[ПРЕДПОЛАГАЕМ — валидировать на земле]**
Basic $20–30/мес · Featured $60–100/мес · Route/Category $100–250/мес · Seasonal — разово. Верх тарифов потянут beach clubs / SPA / виллы.

### 5.5. Что НЕ продаём
Первое место в Organic · paid ranking в редакционной выдаче · эксклюзив категории без proof · гарантию потока · автопродление без результата · **любую плату с туриста (включая комиссию с брони — она только venue-side)**. **[ЗНАЕМ — Trust-правило]**

### Решения по секции 5 (зафиксировано)
- **Биллинг** — ручной до ~10 платящих, провайдер позже. **[ЗНАЕМ]**
- **Доход** — два тарифа на выбор заведения: A (фикс, с MVP) и B (лёгкий + фикс-плата за бронь, будущий, гейт на booking-движок). Турист не платит никогда. **[ЗНАЕМ]**

---

## 6. Бренд, нейминг, тон

> Рабочее имя «Bali Privilege» — **техническое**. Финальное имя выбираем здесь.

### 6.1. Критерии имени
- Короткое, легко произносится англоговорящим **и** местным индонезийцем.
- **Чистое значение на Bahasa Indonesia** (проверка обязательна — урок «guli-guli»).
- **Не** производное от Bali Bible (никаких «BiBi», «Bali B…», рифм к их бренду) — trademark + копикат-риск.
- Свободны: домен `.com`, IG-хэндл, App Store / Play имя.
- Не запирает в один район (не «Canggu…»), но и не обещает «всё про Бали» как справочник.

### 6.2. Антипаттерны
«Guli/Guli-guli» (вульгарное значение на Bahasa) · «BiBi*» (Bali Bible) · «Discount/Card/Club» (тянет к скидочной карте) · слишком общее «Bali Guide».

### 6.3. Направления для имени **[ПРОВЕРИМ — нужна проверка доменов/трейдмарков/Bahasa]**
- Намёк на «местный инсайдер / своя тропа» (напр. в духе *Lokal*, *Warung-, Jalan-* осторожно, проверив значения).
- Намёк на «план/маршрут без хаоса».
- Короткое выдуманное бренд-слово (легче с трейдмарком и доменом).

*Конкретные кандидаты накидаю отдельным проходом с проверкой доступности — это самостоятельная задача, не делается «из головы».*

### 6.4. Тон
Практичный, не поэтичный. Карточки коротко и по делу («это голодный турист, а не роман»). Никакого «уникального гастрономического путешествия». Дружелюбный, уверенный, без рекламного пафоса.

### 6.5. Field-test label для Phase 0 (временный, НЕ бренд) **[ЗНАЕМ — решено]**
На QR-наклейках и стойках в Phase 0 — нейтральный лейбл **без «Club / Card / Privilege»**, иначе тест измерит «готовность связаться с клубной картой», а не «готовность гасить perk» (грязный тест). Варианты: *Canggu Perks Map · Canggu Food & Perks · Canggu Local Picks*. Важно: это именно field-test label — он сужает до района и **не годится в бренд** (бренд не должен запирать в Чангу). Внутри документа рабочее имя — Bali Privilege.

### Решения по секции 6 (зафиксировано)
- **Полный нейминг — после Phase 0** (не тормозит валидацию). Field-test label — сейчас, нейтральный. **[ЗНАЕМ — решено]**

---

# Часть B. Продукт и UX

## 7. Поверхности: Web vs PWA

Два разных home-экрана под две фазы пути. Один общий экран сломал бы стратегию.

**Web (до приезда)** — SEO/шеринг, планирование:
```
Plan your Bali trip
- 5-day / 7-day itinerary
- Where to stay (area comparison)
- Ubud day trip / Uluwatu sunset
- Canggu deep guide  ← вход в монетизируемый слой
```

**PWA (на острове)** — действие рядом-сейчас:
```
What do you want to do in Canggu now?
- Near me · Food · Breakfast · Beach clubs · Spa · Sunset
- Vibe: Quiet · Work · Party · Romantic · View · Family   ← фильтр по состоянию, не категории
- Show saved · My perks
```

**[ЗНАЕМ — решено]** Web = planning (широкий, бесплатный). PWA = execution (Canggu, perks, QR). Турист приходит с настроением («хочу тихо поработать»), а не с категорией — vibe-ряд отвечает на это.

## 8. Информационная архитектура

```
PUBLIC WEB
 ├─ Home (Plan your Bali trip)
 ├─ Itineraries (3/5/7 days, first-timer, with kids)
 ├─ Area comparisons (Canggu vs Seminyak vs Ubud …)
 ├─ Canggu Deep Guide
 │   ├─ Categories (Food / Breakfast / Beach clubs / Spa)
 │   ├─ Routes (food / sunset / rainy day / first day)
 │   └─ Venue cards (+ perk, Maps, WhatsApp, Save)
 └─ Save / Install prompt → PWA

PWA (Canggu)
 ├─ Near me · Map · Categories
 ├─ Routes · Saved · My perks
 └─ Venue card → Show perk (QR)
```
Принцип: listing-карточки мест существуют **только** в Canggu Deep; вне Чангу — только planning-страницы и RouteStop (не партнёрские листинги). **[ЗНАЕМ — coverage policy]**

## 9. Пользовательские сценарии

1. **Pre-trip (главная воронка):** Google «Bali 7 day itinerary» → web-страница → видит маршрут/карту → «Save this trip» → ставит PWA → сохраняет места.
2. **On-island impulse:** в Чангу открывает PWA → «Breakfast near me» → карточка → Open in Maps → приходит → Show perk → персонал сканирует QR → redemption зафиксирован.
3. **Villa arrival:** заселяется → QR в номере/на ресепшене → ставит PWA уже тёплым.

## 10. Фичи туриста (MVP)
Карта Чангу · фильтры (район/категория) · карточки мест · готовые маршруты · сохранение мест · perks + Show perk (QR) · Open in Google Maps · WhatsApp · английский. **Регистрация не обязательна** — сначала польза, аккаунт потом. **[ЗНАЕМ — scope]**

**Таксономия Vibe v1 (ядро персонализации без AI):**
```
quiet · lively · party · romantic · view · family
work-friendly (= стабильный wifi + розетки + приемлемый шум; для nomad-сегмента)
```
**Правило верификации:** vibe-тег присваивается ТОЛЬКО после визита на место (проверка шума/wifi/розеток — в чек-листе отбора заведений, Field Kit). Тег «на глаз» = деградация до уровня Google Maps; **проверенный тег — то, что Maps и Bali Bible структурно не дают, и главная причина, почему курация одного района бьёт каталог на 16 000 мест.** AI-слой (отложен, §10 «не делаем») в будущем сядет поверх этих же тегов. **[ЗНАЕМ — решено]**

**«What to order» — блюда на карточке (три честных метки + правило):**
```
Bestseller        — со слов заведения («что заказывают чаще всего»), атрибуция владельцу. С Phase 0.
Verified by us    — 1–2 блюда, попробованные нами при визите. С Phase 0.
Guests' favourite — из наших redemption-опросов («рекомендуют N гостей»). С Phase 1.
```
**Consensus-check (железное правило):** при визите полевой человек читает топ-отзывы Google по заведению (внутренняя заметка: что хвалят/ругают — легально, без парсинга и без публикации). Наши «What to order» **не могут противоречить видимому Google-консенсусу**: ругаемое блюдо не попадает в подборку, даже если владелец зовёт его бестселлером. Мы не против толпы — мы поверх неё. Анти-списков не публикуем: плохое отсекается отсутствием, не чёрным списком. Кнопка «Open in Google Maps» остаётся — встраиваемся в привычку читать отзывы, не подменяем её. Автопарсинг отзывов Google — запрещён (юр. риск + зависимость + билд до Phase 0). **[ЗНАЕМ — решено]**

**Price anchors (персональный якорь цены):** фиксированный набор, собираемый при визите: `американо · Bintang · коктейль · main · завтрак-сет`, с датой проверки («verified Mar 2026»). Турист один раз выбирает **свой** якорь (кофеман → американо, мясоед → main) — карточки показывают его первым. Устарело > N мес → диапазон вместо точной цифры. Обновление — при каждом партнёрском ревизите. Якоря обязательны для всех карточек, не предмет торга с партнёром; подача без оценочности (цифры, не «дорого»). **[ЗНАЕМ — решено]**

**Карточка заведения (минимальная структура):**
```
Название
Категория · Район · Vibe (quiet / lively / party / romantic / view / family / work-friendly)
Фото / видео
Короткое описание (без «уникального гастрономического путешествия» — это голодный турист, а не роман)
Средний чек · Price anchors (личный якорь первым) · Часы · Кухня/тип
What to order: Bestseller · Verified by us · Guests' favourite (Phase 1)
Perk / bonus
[Open in Google Maps] [WhatsApp] [Save] [Show perk] [Share] [Add to trip]
[Reserve table] ← опционально, показывается только если у заведения настроены брони
QR для активации бонуса
```

**Reservation bridge (тонкий, product-agnostic):** карточка может показать «Reserve table», но в MVP это ведёт в **WhatsApp или простую форму-заявку** — не в booking-движок. Поле `mode: tablepilot` зарезервировано на будущее (см. §15 и North-star), но **в MVP не реализуется**. Так петля Find → Perk → Reserve → Redeem остаётся целью, а ставка на конкретный второй продукт в стройку не входит.

## 11. Фичи партнёра (MVP)
Личный кабинет · редактирование карточки · загрузка фото · выбор/настройка perk · QR для учёта визитов · **аналитика** (показы, клики Maps/WhatsApp, сохранения, perk opens, redemptions, повторные) · простая оплата (ручная на старте).

**Структура отчёта партнёру (причинная цепочка, не просто красивая цифра):**
1. **Reach** — показы карточки · появления в маршрутах/категориях · клики Maps · клики WhatsApp.
2. **Intent** — perk opens · сохранения · reservation clicks (если включено).
3. **Proof** — **externally-attributed redemptions** · total redemptions · repeat redemptions.
4. **Notes** — разбивка по источникам: villa / coliving / Reels / direct / in-venue.

Так заведение видит не «20 redemptions», а сколько из них мы реально **привели** (externally-attributed) против тех, кто и так был внутри.

## 12. Фичи админа (MVP)
CMS заведений · модерация фото/контента · категории · районы (статусы) · сборка маршрутов · назначение платных размещений и sponsored-слотов · вкл/выкл offers · аналитика · биллинг/инвойсы · контроль активности партнёров. Без админки команда утонет в таблицах и «поменяйте нам фото».

## 13. Контент-система
- **Типы:** planning-страница · deep-guide · route · venue-card.
- **Quality floor:** не-Чангу страница живёт только если даёт реальную planning-пользу. Заглушек нет.
- **Бюджет v0.1:** 4–6 planning-страниц (не энциклопедия). Драфт — Claude Code + ты (проверка фактов), русский дубль для тебя.
- **Organic ≠ Sponsored:** редакционные подборки отбираются по качеству; платное помечено Featured/Sponsored/Partner.

### Открытые решения по Части B
1. Аккаунт туриста: гость-режим + опциональный логин (рекомендация) vs обязательная регистрация для сохранения? Рекомендация — гость-режим, меньше трения.

---

# Часть C. Техническая архитектура

## 14. Стек и обоснование
- **Билдер:** Claude Code (уже оплачен).
- **Фронт:** Next.js + Tailwind + next-pwa.
- **Бэк/данные:** Supabase (Postgres + Auth + Storage + RLS + Edge Functions/cron).
- **Хостинг:** Vercel.
- **Карты:** Google Maps (или Mapbox). **QR:** библиотека.
- **WhatsApp:** один платформенный номер, transactional-only (не AI-консьерж). **[ПРОВЕРИМ — политика WhatsApp Business API для сторонних ботов в 2026, сверить перед интеграцией]**

Обоснование: дёшево (free-tier на старте), быстро собирается через Claude Code, RLS даёт мультитенант-изоляцию из коробки. Self-host не нужен — преждевременная инженерная гордость.

## 15. Модель данных (ядро)
```
Venue            (canonical; партнёрский листинг только внутри active_deep)
VenueProductEnrollment (product, status, plan)  ← задел под будущие продукты, но в MVP только bali_privilege
District         (name, status: planning_only / active_deep / next_deep, monetization_enabled, qr_enabled)
ContentPage      (type: planning/deep_guide/route, district_scope, quality_status, publish_status)
RouteStop        (name, coords, editorial_note, not_partner_listing)
Offer/Perk       (type, conditions, limit, code/QR, status, redemptions)
VenueReservationConfig (mode: none/whatsapp/request_form [tablepilot — future, не MVP], booking_url?, whatsapp_template?, manual_confirmation_required)
Placement        (partner, type, district, route, period, price, status, impressions, clicks)
Redemption       (venue, perk, guest_ref, ts)
Event            (type, venue_id, guest_ref, ts, payload)
User/Role        (минимально: tourist guest, partner, admin)
GuestRef         (anonymous_id, phone_hash?, consent_status, source)
ConsentLog       (guest_ref, consent_type, accepted_at, source)
```

## 16. Coverage policy как data-constraints
Стратегия зашивается в данные, не остаётся «абзацем»:
```
Вне active_deep района:
  RouteStop — разрешён.
  Venue Placement — запрещён.
  QR — запрещён.
  Paid listing — запрещён.
District.monetization_enabled / qr_enabled управляют этим на уровне БД.
```
Так «партнёр из Убуда очень просил» технически невозможно без смены статуса района. **[ЗНАЕМ — защита стратегии]**

## 17. QR / redemption flow
```
Турист открывает perk в PWA → показывает QR/код → персонал сканирует
→ Redemption(venue, perk, guest_ref, ts) пишется → партнёр видит в dashboard.
```
Fallback на старте: «Show perk» + промокод, если сканер неудобен. QR надёжнее для доверия. В Phase 0 — **печатный** QR, без PWA.

## 18. Аналитика и event-pipeline
Два **раздельных** набора метрик:
- **Growth (для нас):** web users, installs, saves, search.
- **Partner-proof (для заведения, гейт монетизации):** card views, map/WhatsApp clicks, perk opens, **redemptions**, repeat. 
Events пишутся в одну таблицу, агрегируются в dashboard. Гейт платных слотов = **redemptions**, не web-трафик.

**Reservation-события:** в MVP — только `reservation_click` (есть ли вообще спрос на бронь через нас). Остальные (`reservation_request_submitted / confirmed / cancelled / no_show`) — **post-proof**, появляются вместе с реальным booking-слоем, не в MVP.

**Dish-feedback (Phase 1):** после redemption гостю — один вопрос в один тап: «Что заказывал? Стоило?» → событие `dish_feedback(venue, dish, verdict)`. Кормит метку «Guests' favourite» — собственные отзывы на уровне блюд, которых нет ни у Google (шум на уровне заведения), ни у Bali Bible. Данные-moat.

## 19. Auth, роли, мультитенант, приватность
- Роли: guest tourist (без логина) · partner · admin. RLS-изоляция: партнёр A **не видит** гостей/данные партнёра B.
- Приватность: партнёр по умолчанию видит **агрегат**; идентифицируемые данные гостя — только когда гость сам отдал контакт (бронь/заявка) этому заведению. GuestRef + ConsentLog.

## 20. Интеграции и security baseline
- Google Maps (навигация), WhatsApp (transactional), опц. Resend (письма).
- Baseline: Supabase Auth, RLS на всех партнёрских таблицах, секреты в env, Sentry для ошибок (минимально). Не строим корпоративный AuditLog/billing-automation до первых 30 redemptions.

### Открытые решения по Части C
1. Карты: Google Maps (привычнее туристу, дороже при росте) vs Mapbox (дешевле, гибче)? Рекомендация — Google на MVP (free-tier хватит), пересмотр при росте.

---

# Часть D. Роадмап и исполнение

## 21. Поэтапный роадмап (gate-driven, не календарный)

```
PHASE 0 — Field Test (fastest signal, без билда)
  5 заведений Чангу · печатный QR/perk · WhatsApp/Linktree · 2–3 виллы
  Цель: измерить redemption rate.
  GATE → есть осмысленные redemptions? Заведение видит ценность?

PHASE 1A — Canggu Redemption MVP (build, fast)
  PWA-lite / mobile web · venue cards · perks · QR redemption · basic partner report.
  БЕЗ полной контент-системы, БЕЗ 4–6 planning-страниц пока.
  GATE → District proof + Partner proof (см. §22).

PHASE 1B — Web Planning Layer
  4–6 planning-страниц · save/install prompt · Canggu deep guide.
  GATE → органик/share-трафик начинает кормить Canggu Deep.

PHASE 1.5 — Monetization proof
  Включаем платные слоты для Founding/Launch → Paid.
  GATE → первые платящие + продления/повторная ценность.

PHASE 2 — SEO scale + content
  Расширяем planning-слой, наращиваем органику.
  GATE → стабильный органический трафик + воронка install.

PHASE 3 — District #2 (next_deep)
  Только после retention + операционной ёмкости в Чангу.
```

**Операционные роли на засеве (кто что делает):**
- Отбор мест — основатель/редактор по чек-листу качества (не по оплате).
- Фото/описания — внутренний контент или локальный подрядчик.
- Договор о perks + обучение персонала QR — полевой человек на земле в Чангу.
- Первый трафик — основной канал виллы/coliving (см. §22).

### 21a. Пять усилений MVP (из конкурентного прохода, июль 2026)

1. **Creator-perks как контент-машина (Phase 0–1; урок Teepee).** Отдельный пул perks для микро-криэйторов в обмен на Reels с меткой-ссылкой: perk производит контент И трафик, канал B перестаёт быть «сделай 20 роликов сам». **Правило:** creator-redemptions маркируются отдельно и в partner-proof НЕ считаются (атрибуция §22). **[ПРЕДПОЛАГАЕМ]**
2. **Perk-упоминание в WhatsApp-брони = дешёвая атрибуция (Phase 0).** Кнопка Reserve шлёт pre-filled текст: «Hi! Booking via [label], perk: welcome drink». Заведение видит источник в каждом сообщении — атрибуция работает, даже если персонал забыл сканировать QR. Латает слабейшее место Phase 0. **[ЗНАЕМ — внедрить]**
3. **Shareable trip-link без аккаунта (Phase 1B; урок Wanderlog).** Маршрут живёт по URL, шарится в WhatsApp-чат поездки; один сохранивший = 3–5 увидевших. Виральность до-триповой воронки без регистрации. **[ПРЕДПОЛАГАЕМ]**
4. **Arrival-SEO под официальные приложения (Phase 1B/2).** Каждый турист 2026 обязан пройти Love Bali / e-CD → гуглит «Bali tourist levy how to pay». 1–2 utility-страницы («Levy paid — now what? First day in Canggu») ловят 100%-ное до-триповое касание с нулевой конкуренцией. **[ЗНАЕМ — механика; ПРОВЕРИМ — конверсию]**
5. **Villa-manager как канал ×10 (Phase 0–1).** Не подписывать виллы по одной: управляющие компании Чангу держат 10–50 объектов, один договор = QR во всех. Тот же паттерн позже — экосистемы (банки/eSIM/телеком, урок Greatlist×T2) как North-star дистрибуция. **[ПРЕДПОЛАГАЕМ]**

## 22. KPI и gate-числа **[ПРЕДПОЛАГАЕМ — калибровать на земле]**

> ### ⚠️ ПРАВИЛО АТРИБУЦИИ (самый коварный шов — read first)
> **source QR ≠ redemption QR.** Если QR лежит на столе в заведении, redemption доказывает только «люди любят бесплатное», а не «мы привели гостя».
> - **Source QR** — на вилле / coliving / в Reels / флаере. Уникальная метка на источник (`villa_01`, `coliving_02`, `reels_001`). Доказывает, **откуда** пришёл турист.
> - **Redemption QR** — сканирует персонал в заведении. Доказывает **факт** использования perk.
> - **Partner-proof = только redemptions с внешним источником ДО визита.** In-venue redemptions считаются отдельно, как engagement, и **исключаются из acquisition-proof.**
>
> Цепочка событий (уникальные ссылки на каждый источник): `source_scan → landing_open → venue_card_open → perk_open → redemption`.

**Phase 0 — РЕШАЮЩИЙ gate (3 числа, go/no-go):**
- **redemption rate ≥ 15–30%** от perk_opens;
- **≥ 3 из 5 заведений** получили хотя бы 1 **externally-attributed** redemption (venue spread);
- **≥ 2 заведения** говорят «готовы продолжать / платить после пилота».

**Phase 0 — flow и обвязка:**
- 5 заведений + 2–3 внешних source-источника (виллы/coliving/Reels), уникальный трекинг на каждый.
- Диагностическая цепочка: source_scan (300+) → perk_open (100+) → redemption (20–30) → redemption rate.
- In-venue QR — допустим только как вторичный engagement-тест, **не** как acquisition-proof.

**Density readiness (supply-side, готовность района к запуску):**
- ≥ 30 мест · ≥ 15 perks · ≥ 3 маршрута · 3–4 категории (из них ≥ 10 мест в самой сильной) · ≥ 3–5 мест, встроенных в маршруты.

**Exit-проверка Чангу (7–10 дней до запуска, go/no-go):**
- реально ли собрать 30–40 заведений; готовы ли 10–15 дать нормальный perk; есть ли 5–10 потенциальных Founding-партнёров; хватает ли маршрутов; есть ли SEO-темы; есть ли **туристы** (а не только экспаты). Не проходит → сменить район (Seminyak / Sanur). Принцип неизменен: район → плотность → доказательство → следующий район.

**Phase 1 — District proof (demand-side):**
- 1 000+ web users/мес · 300+ Canggu guide opens/мес · 100+ Maps/WhatsApp clicks/мес · 30+ redemptions · 10+ партнёров с ≥1 redemption · 5+ партнёров с ≥3 redemptions.

**Phase 1 — Partner proof (на каждое заведение):**
- card views · clicks · perk opens · redemptions · repeat. Партнёр видит «за месяц пришло N».

**Phase 1.5:**
- первые 5–10 платящих · ≥1 цикл продления/подтверждённой ценности.

## 23. Costs / opEx (реалистично, founder-led)
**Инфраструктура:** Supabase $0→$25 · Vercel $0→$20 · домен ~$15/год · карты/QR $0 на MVP · Claude Code $0 (оплачен). → **≈ $0–45/мес.**

**Реальные деньги — поле (mini-opEx даже для founder-led):**
- транспорт по Чангу $50–150 · QR-материалы/наклейки $20–80 · контент/фото/реквизит $50–200 · онбординг партнёров $50–150.
- **Итого ≈ $170–625/мес**, не считая времени основателя.
- Наёмный полевой (ускорение): +$400–800/мес, окупается на ~15–30 платящих.

**[ЗНАЕМ]** Дорого не приложение (≈$0), а присутствие на земле. Время основателя = потолок скорости.

## 24. Риски и kill-criteria
| Риск | Сигнал | Реакция |
|---|---|---|
| Туристы не гасят QR | Phase 0 redemption rate близок к нулю | **Kill / пересмотр модели** — это убивает гипотезу дёшево |
| Чангу = экспаты, не туристы | Acquisition даёт резидентов | Сменить канал или район |
| Заведения не платят при наличии Bali Bible | Launch→Paid конверсия низкая | Усилить redemption-proof или пересмотреть цену/формат |
| Внимание основателя размазано (KORA) | Сроки плывут, поле стоит | Нанять полевого или заморозить до открытия KORA |
| Bali Bible копирует курацию | Появляется их районный продукт | Ускорить плотность + отношения |

**Главный kill-criterion:** если Phase 0 не показывает, что туристы гасят perks, а заведения видят ценность — не строим Phase 1.

---

# Часть E. Мета

## 25. Реестр гипотез

**[ЗНАЕМ] (решено/факт):**
- Модель денег: B2B, турист бесплатно.
- Стек, двухслойность, coverage policy, partner-лестница, разделение метрик, приватность.
- Рынок: размеры/сегменты (BPS), англоязычное ядро первично.
- Bali Bible — широкий справочник (цифры верифицированы, но как assumptions для внешнего использования).

**[ПРЕДПОЛАГАЕМ] (рабочие гипотезы):**
- Чангу = правильный первый район.
- Perks > скидки в восприятии.
- Цены тарифов $20–250.
- Тёплая сеть даёт первых партнёров.

**[ПРОВЕРИМ] (только земля):**
- Туристы гасят QR ради perk.
- Заведения платят нам при наличии Bali Bible.
- Виллы-канал даёт туристов, не резидентов.
- Реальный redemption rate и его экономика.

## 26. Открытые решения и версии

**Решения закрыты (v0.2):**
1. **Сезон Phase 0** — запускаемся по готовности; если shoulder/peak рядом — целим туда; выводы корректируем на сезон. **[ЗНАЕМ]**
2. **Контраст с Bali Bible** — наружу тихо («Curated Canggu guide with real perks»), в B2B прямо («Not just listing — we prove redemptions»). **[ЗНАЕМ]**
3. **Планка perk** — обязательна. Разрешено: welcome drink / free dessert / appetizer / upgrade / priority access / special set. Запрещено: «−5%», размытое «special offer», «ask staff». **[ЗНАЕМ]**
4. **Биллинг** — ручной (инвойс/перевод/WhatsApp/таблица) до первых ~10 платящих; провайдер позже. **[ЗНАЕМ]**
5. **Нейминг** — полный после Phase 0; нейтральный field-test label сейчас (§6.5). **[ЗНАЕМ]**
6. **Гость-режим** — да; аккаунт только для save/sync позже; для redemption — anonymous guest + опц. WhatsApp. **[ЗНАЕМ]**
7. **Карты** — Google Maps для MVP (привычно туристу); Mapbox позже, если цена/кастомизация начнут кусаться. **[ЗНАЕМ]**

**North-star (направление, не MVP):**
> Замкнутая петля **Find → Perk → Reserve → Arrive → Redeem → Report**: BP приводит туриста + perk, booking-слой (в будущем — TablePilot) ведёт бронь. **Условие разпарковки:** TablePilot проходит собственную валидацию спроса; до тех пор reservation bridge остаётся product-agnostic (§10, §15). Product-agnostic мост — это on-ramp к интеграции, а не отказ от неё.

**Версионирование:** документ — **v0.2**. Меняем по мере land-проверок: каждая [ПРОВЕРИМ]-гипотеза, подтверждённая или убитая на земле, двигает версию и переписывает секцию.

---

## Приложение A — данные по инкумбенту (Bali Bible)

> Используется как подтверждение стратегии, не как её опора. **[ПРЕДПОЛАГАЕМ — цифры верифицированы поиском; требуют source-link перед внешним/инвесторским использованием].**

- ≈16 000+ листингов · аудитория ≈2,5 млн+ · бесплатное офлайн-приложение с deals/перками · активны в 2026.
- Команда ≈12 человек (источник: Tracxn, апр. 2026); не профинансированы крупно.
- **Вывод:** широкий охват без районной глубины и курации; команда из ≈12 человек не способна дать плотность по каждому району — это и есть наша щель «глубина в одном районе».
- **Правило:** не использовать цифры конкурента во внешних материалах без ссылки на источник и даты.

---

## Приложение B — Evidence / Sources

> Правило: **никакого внешнего использования рыночных/конкурентных цифр без ссылки на источник.** Для каждого внешнего утверждения — строка ниже.

| Claim | Источник (URL) | Дата источника | Confidence | Внешнее использование |
|---|---|---|---|---|
| Бали ≈6,95 млн иностр. прибытий 2025 | BPS Bali / ANTARA | фев 2026 | high | yes (со ссылкой) |
| Австралия ≈23,4% потока | BPS Bali | 2025 | high | yes (со ссылкой) |
| Bali Bible ≈16 000 листингов / 2,5 млн аудитория | сайт Bali Bible | 2026 | medium | **no** — пометить «по данным компании» |
| Bali Bible ≈12 сотрудников | Tracxn | апр 2026 | medium | **no** до проверки |

*Заполняется по мере появления новых внешних утверждений. Без строки в этой таблице цифра во внешний документ не идёт.*

---

*Это единый канонический документ по Bali Privilege. Он включает и заменяет ранние черновики (BP v0.1/v0.2). Документ по трём продуктам (KORA / TablePilot) живёт отдельно и сюда не входит — по твоему решению делать только Bali Privilege.*

*Статус: **v0.2-final (Phase 0-ready)**. Деньги: два тарифа на выбор заведения (A — фикс без брони, с MVP; B — лёгкий + фикс за бронь, гейт на booking-движок). Внесены: attribution rule (source QR ≠ redemption QR), partner report split (Reach/Intent/Proof), executive-rule, Appendix B, конкурентный проход июль-2026 (Teepee + российские паттерны, §3.4) и пять усилений MVP (§21a). **Дальше — не v0.3, а Phase 0 Field Kit и выход на землю.***
