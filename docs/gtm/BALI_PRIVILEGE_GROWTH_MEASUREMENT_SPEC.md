# Bali Privilege / Other Bali — Growth Measurement Spec (90-day GTM)

**Окно:** 20 июл – 17 окт 2026 · **Дата:** 2026-07-19
Принцип (из AGENTS.md §12, обязателен): **growth-метрики и partner-value-метрики — раздельные семейства, не смешивать.** Клик — это intent, не billable-результат. Никакого PII в событиях.

---

## 1. North-star learning metric (одна на 90 дней)

> **Verified on-island activations, привязанные к каналу:** число гостей, которые пришли из отслеживаемого источника (partner-QR / creator-код / community / ads) и совершили qualified venue action в Canggu (direction_click / whatsapp click / reservation_click / QR-perk redemption).

Это не revenue-метрика — это **метрика обучения**: она одновременно доказывает (а) что канал доставляет туристов, (б) что продукт двигает их до заведения. Цель 90 дней — не абсолют, а **знание CAC→activation по каждому каналу** (формулы в §8 GTM-дока).

## 2. Ступени воронки (определения — жёсткие)

| Ступень | Определение | Событие/факт |
|---|---|---|
| Visitor | любой визит на otherbali.com | page_view |
| Identifiable lead | согласованный opt-in (email/WhatsApp) ИЛИ сохранённый trip с GuestRef | consent_log + save |
| Planned traveller | lead с указанными датами поездки | trip dates в saved trip |
| Activated on-island | ≥1 действие в active_deep в даты поездки | moment_started / venue_detail_view с geo-контекстом |
| Qualified venue action | direction_click · whatsapp · reservation_click · menu_open→save | соответствующие события |
| Redemption | подтверждённое погашение перка (QR) | redemption_events (source_class) |
| Confirmed reservation | TablePilot confirmed → arrived | partner-proof пайплайн |
| Repeat user | ≥2 сессии в разные дни on-island | GuestRef повторный |
| Advocate/fan | см. §5 | поведенческий композит |
| Partner-attributed visitor | redemption/arrival с атрибуцией конкретному partner-QR/коду | source + safe payload |

## 3. Метрики по семействам

**Growth (продукт, для нас):**
- weekly visitors; visits→save %; save→dates %; PWA installs; share-события; moment_started; shortlist_generated.

**Pre-arrival:**
- opt-ins по каналам (property / creator / community / ads); cost per opt-in (только для платных); дата-донесение: % лидов с датами.

**On-island activation:**
- % planned travellers, открывших продукт on-island в даты поездки; qualified actions / activated user; активации по district (д.б. ≥80% Canggu — иначе трафик мимо deep-слоя).

**Partner-value (для заведений — отдельный отчёт):**
- card views; direction_clicks; whatsapp clicks; reservation_click→confirmed→arrived; QR redemptions по venue; повторные визиты. **Никогда** не показываем партнёру «показы Instagram» как ценность.

**Fan/referral:**
- fans по определению §5; приглашения/шеринги → activated referred users; вклад (поправки/фото-консенты) от fans.

**Cost:**
- cash по каналам; founder-часы по каналам (журнал раз в неделю, грубо); CAC до lead / до activation (только каналы с ≥20 лидами — иначе шум).

## 4. Правила атрибуции и нейминг

**UTM (обязателен на всех внешних ссылках):**
```
utm_source = {property|driver|creator|community|meta|qr}
utm_medium = {prearrival|checkin|incar|organic|paid|event}
utm_campaign = gtm90-{wave}-{идентификатор}   напр. gtm90-w1-cabobali
```

**QR/код-нейминг:** `OB-{тип}-{партнёр}-{место}` → `OB-VIL-CABO-CHECKIN`, `OB-DRV-NUSA-CAR`, `OB-CRT-{handle}`. Один партнёр = один код на touchpoint (не один на партнёра — иначе не увидим, работает ли чек-ин против pre-arrival письма).

**Правила:**
1. Acquisition `source` фиксируется при первом касании и **не перезаписывается** провайдером (гардрейл §12).
2. Партнёрская атрибуция — last property-touch до активации (если гость пришёл от виллы и от креатора — виллы для partner-отчёта, креатору — в creator-отчёте по его коду; двойной счёт допустим в learning-метриках, недопустим в billable).
3. Analytics-сбой никогда не блокирует действие туриста.

## 5. Определение «фана» (поведенческое)

Fan = GuestRef, за 30 дней набравший **≥3 из**: ≥5 saves · ≥1 route use · ≥1 redemption/confirmed reservation · ≥1 share/invite, приведший визит · ≥1 полезная поправка (сообщение об ошибке/закрытии) · повторный on-island день ≥3. Лайк/подписка/комментарий — **не** сигнал.

## 6. Минимальная событийная таксономия (уже в проде — из §12 AGENTS.md)

```
moment_started · shortlist_generated · venue_detail_view · menu_open · menu_item_open
save · share · direction_click · [whatsapp click] · reservation_click
redemption (QR, source_class) · consent_log
```
Достроить для GTM (в бэклог, S-размер): `optin_submitted{channel}` · `trip_dates_set` · `referral_invite_sent/accepted`. Без новых сущностей — это события, не таблицы.

## 7. Каденс

- **Monday dashboard (30 мин):** воронка за неделю по каналам (visitors→optins→dated→activated→qualified→redeemed), cash+часы, аномалии.
- **Friday decision (30 мин):** по каждому живому эксперименту — continue/iterate/kill против порога из карточки; решения письменно в decision log.
- Партнёрские отчёты — еженедельно, только partner-value поля, агрегаты.
