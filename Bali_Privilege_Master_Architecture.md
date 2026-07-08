# Bali Privilege / Other Bali — Master Architecture

**Status:** v0.4-current · repository source-of-truth rewrite · 2026-07-08.

**Lineage.** v0.2 was the Phase-0 architecture. v0.3 was the money-model pivot
(fixed venue fee per proven seated reservation). v0.4 reconciles repo reality,
TablePilot handoff, and the Other Bali public launch frame.

**Purpose.** This file is the canonical product/data-model source of truth named by
`CLAUDE.md`. It summarizes current decisions already present in `CLAUDE.md`,
`docs/money-model.md`, `docs/tablepilot-integration.md`,
`docs/tablepilot-bridge-handoff.md`, and real code paths. It must not invent new
canon.

**How to read this file.** The v0.4-current section is live canon. The original v0.2
body is preserved verbatim in **Appendix Z — History (v0.2 — Phase-0 architecture)**
for provenance only.

**Legend.** `[implemented]` = present in BP code/migrations or verified TablePilot
handoff docs. `[planned]` = decided direction but not present in BP code yet.
`OPEN — needs Selena's decision` = not canon; do not build without Selena's explicit
approval.

---

## 0. Authority and source order

On conflict, this order wins:

1. `CLAUDE.md` — hard guardrails, forbidden work, current project status.
2. This file — product/data-model architecture.
3. `docs/money-model.md` — detailed money-model v0.3.
4. `docs/tablepilot-integration.md`, `docs/tablepilot-bridge-handoff.md`,
   `docs/SESSION-HANDOFF.md`, `docs/backlog.md` — implementation notes / handoffs.
5. Actual BP code/migrations in this repo — implementation truth for BP.
6. TablePilot code / handoff docs — implementation truth for TablePilot.

If this file and `CLAUDE.md` diverge on a guardrail, stop and reconcile before coding.
If a doc says something is implemented but code does not prove it, mark it `[planned]`
or `pending verification`.

**Sources:** `CLAUDE.md` intro + hard guardrails; repo code audit.

---

## 1. Product thesis and public framing

**Internal / technical name:** Bali Privilege.

**Public product:** Other Bali.

**First launch surface:** Canggu Beta.

**Public promise:** “The right place for the moment you're in.”

Other Bali is a free tourist-facing decision guide for Bali. It helps travellers pick
where to go by context and moment, not by generic rankings. It monetizes venues, not
tourists.

The core strategy remains:

- **Bali-wide planning:** free planning/context layer for the island.
- **Canggu-deep execution:** perks, QR, reservation handoff, partner proof, and money
  live only in the active deep district. Canggu first; Ubud next only when unlocked.

**Current public rebrand status:** Other Bali is decided in `CLAUDE.md`, but public UI
and manifest may still say Bali Privilege / Canggu Perks until the rebrand task lands.
Treat that as P0 launch work, not a new strategy decision.

**Sources:** `CLAUDE.md` “What this project is” + “Public brand”; v0.2 thesis in
Appendix Z.

---

## 2. Executive rule — current

**No expansion beyond Canggu Beta until proof.** Phase 1A is unlocked, but the build
must stay inside the Canggu Beta proof loop: harden the existing app, improve trust,
prepare launch, and prove the money loop once.

### Allowed now

- Existing app/PWA hardening.
- Verified venue import and density work for Canggu.
- Other Bali public rebrand / Canggu Beta launch readiness.
- Static moment/JTBD surfaces that do not add new DB entities.
- Source attribution and QR/redemption integrity.
- TablePilot handoff work and seated report-back / reconciliation work.
- Aggregate partner reporting.

### Forbidden unless Selena explicitly unlocks a new gate

- BP-internal booking engine.
- Tourist-side payments.
- Paid ranking in organic surfaces.
- AI assistant/chatbot in the tourist product.
- Google Maps review scraping or republishing.
- Monetization, QR, paid listing, or partner placement outside `active_deep`.
- New DB entities/tables beyond explicitly approved additive fields.
- New districts/categories/features beyond this master.

**Sources:** `CLAUDE.md` Status + hard guardrails #1–#11; `docs/money-model.md`;
BP code `components/ReserveButton.tsx`, `app/api/event/route.ts`,
`supabase/migrations/0006_source_class_and_coverage.sql`,
`supabase/migrations/0010_tablepilot_bridge.sql`.

---

## 3. Money model (§5 current canon)

Other Bali / Bali Privilege earns money only from venues and only from a proven
reservation result. The tourist never pays.

**Billable rule:** revenue is a **fixed fee paid by the venue per BP-sourced confirmed
seated reservation** made through TablePilot.

The intended chain is:

```text
Find in BP/Other Bali → Reserve in TablePilot → Confirm → Arrive/Seated → Report → Fee
```

We earn only when all are true:

1. the tourist found the venue through BP/Other Bali;
2. the tourist made a table reservation through TablePilot with BP attribution;
3. the venue confirmed the reservation;
4. the guest arrived / was seated, or counted as seated per the agreed TablePilot
   status semantics;
5. the event is provable without exposing guest PII to BP partner reports.

### Explicitly not the money model

- No tourist-side payment.
- No flat subscription / paid tier as the money model.
- No “Tariff A / Tariff B”.
- No paid listing.
- No Featured Placement.
- No Route Placement or Category Sponsorship as standalone paid products.
- No percentage of cheque.
- No deposit.
- No per-redemption billing.

QR/perk remains useful as a tourist incentive and independent on-premise arrival/perk
proof. It is **not** the billed event.

**Sources:** `docs/money-model.md` (“The rule”, “What is explicitly killed”, “The
chain”); `CLAUDE.md` guardrail #5.

---

## 4. TablePilot / reservation bridge

BP does not build booking internally. TablePilot is the external reservation product.

The canonical connection is `VenueProductEnrollment(product=tablepilot)` at the
architecture level; current BP code also uses `venues.tablepilot_slug` as the concrete
handoff field.

### Implemented vs planned

| Piece | Status | Evidence / note |
|---|---:|---|
| BP bookable venue field `venues.tablepilot_slug` | `[implemented]` | `supabase/migrations/0010_tablepilot_bridge.sql`; `lib/data.ts` maps to `tablepilotSlug` |
| BP Reserve CTA handoff | `[implemented]` | `components/ReserveButton.tsx` opens `/book/<tablepilotSlug>?source=bali_privilege` |
| BP `reservation_click` before handoff | `[implemented]` | `components/ReserveButton.tsx`; `app/api/event/route.ts` allowlist |
| WhatsApp fallback for non-bookable venues | `[implemented]` | `components/ReserveButton.tsx`; explicitly not the fee loop |
| TablePilot accepts/persists `source=bali_privilege` | `[implemented]` per TablePilot proof docs | `docs/tablepilot-bridge-handoff.md`; local TablePilot checkout previously showed `BookingSource` includes `bali_privilege` |
| TablePilot billable semantics | `[implemented]` per TablePilot proof docs | billable = `source === "bali_privilege" && status ∈ {arrived, completed}` in `docs/tablepilot-bridge-handoff.md` |
| TablePilot aggregate partner report | `[implemented]` per handoff docs | `docs/tablepilot-bridge-handoff.md` reports live no-PII endpoint |
| BP pulling TablePilot aggregate report via `lib/tablepilot.ts` | `[planned / pending verification]` | `CLAUDE.md` guardrail #3 names this path, but current BP code audit did **not** find `lib/tablepilot.ts` |
| BP `/admin/phase0` showing seated/billable money-loop stats | `[planned / pending verification]` | current `app/admin/phase0/page.tsx` still reads old `phase0_overview()` redemption metrics |
| Live migration `0013_phase0_money_gate.sql` | `[planned / pending verification]` | current repo migrations stop at `0012_onboard_status.sql` |

### Seated semantics

Do not invent a new BP `seated` status. TablePilot's existing statuses `arrived` and
`completed` are the seated/billable signal per handoff docs.

**Sources:** `CLAUDE.md` guardrail #3; `docs/money-model.md` “Reservation engine =
TablePilot”; `docs/tablepilot-integration.md`; `docs/tablepilot-bridge-handoff.md`;
BP code paths `components/ReserveButton.tsx`, `app/api/event/route.ts`, `lib/data.ts`,
`app/admin/phase0/page.tsx`, `supabase/migrations/0010_tablepilot_bridge.sql`.

---

## 5. Data model and implementation status

Canonical architecture names remain:

```text
Venue · VenueProductEnrollment · District · ContentPage · RouteStop · Offer/Perk ·
Placement · Redemption · Event · User/Role · GuestRef · ConsentLog ·
VenueReservationConfig
```

Do not add booleans such as `is_partner`, `is_bp_partner`, or
`is_tablepilot_tenant`. Use enrollment/config concepts. Current code may use thinner
TypeScript names (`Venue`, `Perk`, `PlanEntry`, `RouteDef`, `RouteStopDef`) and must be
reconciled before schema changes.

### Implemented BP fields / flows

| Concept | Status | Evidence |
|---|---:|---|
| `venues.tablepilot_slug` | `[implemented]` | migration `0010_tablepilot_bridge.sql` |
| District `status`, `monetization_enabled`, `qr_enabled` | `[implemented]` | migration `0006_source_class_and_coverage.sql` |
| QR redemption blocked outside QR-enabled district | `[implemented]` | `record_redemption()` in migration `0006_source_class_and_coverage.sql` |
| External / in-venue / creator attribution buckets | `[implemented]` | `_source_class()` + `partner_report()` in migration `0006_source_class_and_coverage.sql` |
| Partner source breakdown + repeat | `[implemented]` | `partner_notes()` in migration `0008_partner_notes.sql` |
| Guest identity via httpOnly cookie | `[implemented]` | `CLAUDE.md` guardrail #10; `middleware.ts`; `lib/guest-server.ts` |
| My Perks | `[implemented]` | `my_redemptions()` in migration `0009_my_perks_and_feedback.sql` |
| Dish feedback event | `[implemented]` but not a quality-warning surface | `log_dish_feedback()` in migration `0009_my_perks_and_feedback.sql`; `app/api/dish/route.ts` |

### Reservation / event lifecycle status

Only the following are canon as implemented if code/docs prove them:

| Event / lifecycle item | Status | Evidence / note |
|---|---:|---|
| `landing_open` | `[implemented]` | `app/api/event/route.ts`; counted by `phase0_overview()` |
| `venue_card_open` | `[implemented]` | `app/api/event/route.ts`; reports |
| `perk_open` | `[implemented]` | `app/api/event/route.ts`; reports |
| `reservation_click` | `[implemented]` | `components/ReserveButton.tsx`; `app/api/event/route.ts` |
| `similar_open` | `[implemented]` | `app/api/event/route.ts` |
| `redemption` | `[implemented]` | `record_redemption()` inserts event |
| `dish_feedback` | `[implemented]` | `log_dish_feedback()` inserts event |
| TablePilot reservation created with `source=bali_privilege` | `[implemented]` per TablePilot docs | `docs/tablepilot-bridge-handoff.md` |
| TablePilot confirmed reservation | `[implemented]` in TablePilot, not BP | TablePilot status model in handoff/docs; BP does not own this state |
| TablePilot arrived/completed = seated/billable | `[implemented]` per TablePilot docs | `docs/tablepilot-bridge-handoff.md` |
| BP-side reservation report pull / storage | `[planned / pending verification]` | `CLAUDE.md` names `lib/tablepilot.ts`, but current BP code audit did not find it |
| BP billing/fee accounting | `[planned]` | no BP code/table verified |

### OPEN — needs Selena's decision

These concepts are not settled BP canon until Selena approves a concrete schema/flow:

- New BP tables such as `ReservationAttribution`, `ReservationProofEvent`,
  `BillingEvent`, `FeeEvent`, or similar.
- BP event names such as `reservation_created`, `reservation_confirmed`,
  `reservation_seated`, `reservation_cancelled`, `reservation_no_show`,
  `fee_event`, `billing_event` if they are not already present in code/docs.
- Exact BP-side storage model for TablePilot aggregate reports.
- Exact fee amount, invoice cadence, dispute/waiver rules.
- Whether `Placement` remains only a non-paid content/labeling concept or is removed
  from MVP surfaces. Money model v0.3 kills paid placement as a product.

### TODO — reconcile after app-branch merge

After the app branch containing `lib/tablepilot.ts`, `0013_phase0_money_gate.sql`, and
updated `/admin/phase0` money-loop dashboard lands in this repo, rerun a code audit and
update this master: move those TablePilot report-back / seated-billable items from
`[planned / pending verification]` to `[implemented]` only where the merged code proves
it. Do not leave the master understating repo reality after the app work is present.

**Sources:** `CLAUDE.md` data model section + guardrails #3–#5/#8–#11;
`docs/money-model.md`; `docs/tablepilot-integration.md`; `docs/tablepilot-bridge-handoff.md`;
BP migrations `0006`, `0008`, `0009`, `0010`; BP code `components/ReserveButton.tsx`,
`app/api/event/route.ts`, `app/admin/phase0/page.tsx`.

---

## 6. JTBD / moments and venue content layer

Other Bali's tourist UX is moment-based: help the traveller choose the right place for
the context they are in. This is not an AI chatbot and not a new entity system by
default.

### Canonical content direction

- Static/config moments are allowed.
- A deterministic “Moment Builder” / “Build my day” flow is allowed only if it is
  buttons → predefined content, not freeform AI.
- Venue fit context is allowed: `Best for` / `Not for` can describe WHO and WHEN a
  place suits.
- Dish/place quality warnings are forbidden: no `DishWarning`, no “Mixed feedback”,
  no “don't go here”. Bad options are excluded by absence.

### Current implemented venue card fields

Current `lib/types.ts` `Venue` fields include:

```text
vibeTags? · priceAnchor? · whatToOrder? · photoUrl? · whatsapp? · tablepilotSlug?
```

### Additive venue content fields — planned / pending schema approval

The desired JTBD fields are:

```text
whyItsHere? · bestFor? · notFor? · practicalTags? · jobsToBeDone?
```

Status: `[planned / pending schema migration]`. They are approved as the direction of
content, but current BP code does not yet contain these fields. Add them only via an
additive nullable migration and TypeScript changes; no new Moment/Scenario/Curator DB
entities without a master amendment.

**Sources:** `CLAUDE.md` public brand + guardrails #2, #7, #11; current `lib/types.ts`;
Other Bali engineering spec v2 as execution instruction, bounded by this file's
OPEN decisions.

---

## 7. Phase gates and KPIs — current

The old v0.2 redemption-only gate is superseded as the money gate. QR redemption still
matters, but it is not the billing event.

### Current gate chain

```text
intent → reservation → confirmed/seated → venue willingness to pay
```

Where:

- **intent** includes `reservation_click` and venue-card/perk engagement;
- **reservation** happens in TablePilot with `source=bali_privilege`;
- **confirmed/seated** means TablePilot reservation reaches the agreed billable status
  (`arrived` or `completed`);
- **venue willingness to pay** is proven by at least one real partner accepting the
  fixed-fee logic after seeing the proof.

### QR/redemption role

QR redemption remains an independent proof stream:

- arrival/perk proof;
- staff/trust proof;
- source attribution proof when external/in-venue/creator buckets are kept separate;
- not billing.

### Current implementation status

- `[implemented]` Phase 0 gate passed per `CLAUDE.md`.
- `[implemented]` BP emits `reservation_click`.
- `[implemented]` TablePilot source handoff exists per code/docs.
- `[planned / pending verification]` live BP dashboard showing TablePilot seated /
  billable counts. Current `/admin/phase0` code still shows redemption gate metrics.
- `[planned / pending verification]` migration `0013_phase0_money_gate.sql` and
  `TABLEPILOT_PARTNER_TOKEN` wiring; not present/verifiable in current repo checkout.

**Sources:** `CLAUDE.md` Status + guardrails #3/#5; `docs/money-model.md` “Phase 0
gate — shifted”; `components/ReserveButton.tsx`; `app/admin/phase0/page.tsx`; current
migrations directory.

---

## 8. Still-valid strategic constraints from v0.2

The following remain valid unless superseded above:

- Tourist never pays.
- Canggu is the first active deep district / Canggu Beta launch surface.
- Outside active_deep: planning content/RouteStops may exist; monetization, QR, and
  paid/partner placement are blocked.
- Google Maps is a navigation substrate, not a competitor to replace.
- No Google review scraping/republishing; manual consensus-check only.
- No AI assistant/chatbot in the tourist product.
- Organic editorial picks are separate from sponsored labels.
- Bad choices are excluded by absence; no anti-lists.

---

## 9. Version notes

- **v0.2 Phase-0 architecture** — original strategy and assumptions; preserved in
  Appendix Z for provenance.
- **v0.3 money model** — fixed venue fee per BP-sourced confirmed seated reservation;
  detailed in `docs/money-model.md`.
- **v0.4-current** — reconciles repo reality, TablePilot handoff, Other Bali public
  framing, and current implementation status. It does not convert planned lifecycle
  or billing concepts into canon until code/docs prove them or Selena decides them.


---

# Appendix Z — History (v0.2 — Phase-0 architecture)

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
