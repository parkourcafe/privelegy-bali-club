# Прогон: публикация заведений из `venue_submissions`

```yaml
дата: 2026-08-07
скилл: .agents/skills/otherbali-data-ops-run/SKILL.md
задача: разместить на сайте заведения из venue_submissions, которых нет в каталоге
supabase: bali-privilege / egkdapqwkfprtyqvvnso
записано в базу: ничего
```

## Итог одной строкой

Заявленный разрыв — 16 заведений — оказался **пятью**. Одиннадцать из
двенадцати research-заведений уже опубликованы под слегка другим названием.
Из оставшихся пяти четыре пришли от владельцев и годны к работе, одно
опирается на TripAdvisor и Google Maps и по guardrail #2 не принимается.

## Шаг 1. Измерение (до любого сбора)

`venue_submissions` — 52 строки, но это не 52 заявки:

| source | Строк | Что это |
| --- | --- | --- |
| `web` | 6 | настоящие обращения с формы сайта |
| `otherbali-research-2026-07-23` | 30 | внутренний research-прогон |
| `otherbali-manus-wide-research-2026-07-24` | 16 | внутренний research-прогон |

Сверка с каталогом по точному совпадению имени дала 16 «отсутствующих».
**Это число было неверным** — точное сравнение имён не находит заведение,
записанное иначе.

## Шаг 2. Развязка дублей — то, что изменило задачу

Скилл требует снимать дубли до сбора: «Collecting twice costs twice and
publishes two cards for one place». Поиск по вхождению вместо точного
совпадения показал, что почти всё уже на сайте.

| Заявлено как отсутствующее | На самом деле в каталоге | Статус |
| --- | --- | --- |
| Chaskaa Ubud | `chaskaa-ubud` | опубликовано |
| Chaskaa Jimbaran | `chaskaa-jimbaran` | опубликовано |
| Lola's Cantina Canggu | `lolas-cantina-canggu` | опубликовано |
| Lola's Cantina Uluwatu | `lolas-cantina-uluwatu` | опубликовано |
| Revolver Espresso Seminyak | `revolver-seminyak` | опубликовано |
| The Chowk Ubud | `the-chowk-ubud` | опубликовано |
| Nasi Ayam Kedewatan Ibu Mangku | `nasi-ayam-kedewatan-ibu-mangku` | опубликовано |
| Chora Mediterranean | `chora-mediterranean-restaurant-and-bar` | опубликовано |
| Zia Tina Eatery | `zia-tina-eatery` | опубликовано |
| TIS CAFE UBUD | `tis-cafe-ubud` | опубликовано |
| **Mama San** | **`mamasan-bali`** | опубликовано — отличается только пробелом |

Одиннадцать из двенадцати. Если бы прогон пошёл сразу к вставке, каталог
получил бы одиннадцать дублей — ровно то, что репозиторий разгребал 4 августа,
когда снимал с публикации 23 группы.

## Шаг 5. Приёмка оставшихся пяти

| Заведение | Район | Источник | Решение |
| --- | --- | --- | --- |
| Aperitif Restaurant | ubud | Google Maps search + TripAdvisor | **отклонено** |
| Garlic Bali restaurant | nusa-dua | заявка владельца, есть сайт и Instagram | принято в работу |
| Jagat bali massage | kuta | заявка владельца, сайт, Instagram, часы | принято в работу |
| Kora Food Hall (`korafoodhall.com`) | seminyak | заявка владельца, day-pass 1500, кнопка WhatsApp | принято в работу |
| Sandat Mas Uluwatu | uluwatu-bukit | заявка владельца, только Instagram | принято в работу |

**Почему Aperitif отклонён.** Его единственные источники — ссылка поиска
Google Maps и страница TripAdvisor. Скилл называет их прямо: «What never
counts: review aggregators, TripAdvisor, directory clones… These are the
sources that produced every bad row so far», а guardrail #2 запрещает
переносить содержимое отзывов Google. Это не про согласие владельца — вопрос
согласия закрыт решением от 2026-08-07 — а про то, что источник не годится.

**Что сами строки говорят о себе.** Три manus-строки несут в поле `note`
текст «Internal research intake only; do not publish without editorial
verification», девять research-строк помечены «Staged candidate ob30-NNN» с
пометками «Verify branch identity, address, hours», «Verify official source»,
«Review has mixed signal». То есть их автор пометил их как непроверенные.

## Чего этот прогон сделать не смог

**Нет исходящей сети.** Шаг 3 скилла требует открыть сайт заведения и его
Instagram. В этой среде прокси закрывает все внешние хосты — тот же блокер,
что был зафиксирован в прогоне по координатам 4 августа. Поэтому проверить
адрес, часы и текущий статус четырёх принятых заявок отсюда нельзя.

**Публикация требует редакционного текста.** Гейт публикации пропускает строку
только с непустыми `why_its_here` и `best_for`. Это редакционный голос Other
Bali: §5 прямо запрещает партнёру управлять `best_for`, а guardrail #10
запрещает выдумывать. Заявка владельца даёт факты — название, категорию,
район, контакты, часы, — но не даёт основания для «зачем сюда идти».

Поэтому в базу не записано ничего. Строки остаются в `/admin/submissions`,
где им и место до проверки.

## Следующий шаг

Для четырёх принятых нужен прогон в среде с доступом в интернет: открыть сайт
и Instagram каждого, подтвердить адрес, часы и что заведение работает, затем
написать `why_its_here` и `best_for` по стандарту
`otherbali-venue-record-standard` и залить через dry-run по
`otherbali-supabase-write`. Ожидаемое число строк UPDATE — 4.

Aperitif попадёт в тот же прогон только если найдётся его собственный сайт или
подтверждённый визит; с TripAdvisor он не проходит ни при каких условиях.
