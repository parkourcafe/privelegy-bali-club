# Волна code / C10 — aria-подписи (срез aria)

Дата: 2026-10-06. Ветка `claude/pensive-ritchie-f9kkhp`. Коммитов нет, в базу ничего не писалось.

## Что сделано

Пройдены все `aria-label` / `aria-description` / `aria-roledescription` в `app/` и `components/`
в пределах среза (без PlacesView, PlanView, страниц ошибок, `places/[slug]/page.tsx`,
`components/menu/*`, partner/admin/dev/api, privacy/terms, форм и согласий, onboard, v).
В срезе найдено 58 подписей в 33 файлах; `aria-description` и `aria-roledescription` в срезе нет,
проп `ariaLabel` у `HomeAnalyticsLink` нигде не передаётся.

Переписано 11 подписей в 10 файлах. Правило: подпись области называет её содержимое,
подпись кнопки — действие и объект. Новых фактов нет; интерполяции `{name}` / `{hub.name}`
сохранены, чтобы повторяющиеся области оставались различимыми.

| Файл | Было | Стало |
|---|---|---|
| `app/plan/page.tsx` | `Plan page role` | `Planning steps` |
| `app/bali/[district]/page.tsx` | `` `${hub.name} signal` `` | `` `How many ${hub.name} places we list` `` |
| `app/bali/[district]/page.tsx` | `` `${hub.name} by the moment` `` | `` `${hub.name} guides by moment` `` |
| `app/bali/page.tsx` | `Bali districts signal` | `Number of district guides` |
| `components/resort/HotelRestaurantsHub.tsx` | `Operator preview` | `Imported rows awaiting review, not public` |
| `components/DecisionRail.tsx` | `Result view` | `Show results as a list or a map` |
| `components/VenueVisual.tsx` | `` `${name} editorial scene` `` | `` `${name}: illustration, not a photo` `` |
| `app/collections/page.tsx` | `Collections in research` | `Collections we are still building` |
| `components/CangguGuideView.tsx` | `Quick picks` | `Jump to a section of this list` |
| `app/nusa-penida/page.tsx` | `Nusa Penida guide` | `Nusa Penida topics` |
| `components/landing/BrowsePill.tsx` | `` `Browse by ${active}` `` («Browse by where») | подсказка активной оси из `AXES`: `Pick an area` / `Pick a craving` / `Pick the night` |

Пояснения:
- `VenueVisual`: это CSS-заглушка без фото. Новая подпись прямо говорит, что это иллюстрация —
  в духе правила «fallback art must not be presented as venue photography».
- `HotelRestaurantsHub`: секция видна только в owner-prelaunch режиме; подпись взята из её же текста
  («imported rows awaiting review», «not public»). Заголовок H2 «Operator preview · not public» не тронут.
- `BrowsePill`: подпись области строилась из внутреннего ключа (`where` / `taste` / `moment`).
  Теперь берётся видимая подсказка той же оси — новых слов нет.
- `${hub.name} by the moment` → `guides by moment`: ссылки ведут на страницы-споки района.
  Слово «moment» оставлено — это словарь продукта (C14, решение основательницы).

## Оставлено дословно

| Подпись | Почему |
|---|---|
| `Fits this moment` (`components/CangguNow.tsx`) | Закреплена тестом `scripts/wave3-product-boundary.test.mjs` (`assert.match(source, /Fits this moment/)`) |
| `Move … earlier` / `Move … later` (`components/TripPlanner.tsx`) | Закреплены `scripts/wave1-trip-boundary.test.mjs` |
| `Other Bali` (`components/OtherBaliLogo.tsx`) | Закреплена `OtherBaliLogo.test.mjs` |
| `Explore Bali categories`, `Close`, `Primary`, `{g.label}` (MobileNav, GlobalHeader) | Идут через `t(locale, …)` — это ключи переводов, правка сломала бы локализацию |
| `Other Bali for venues — a 35-second introduction` (`app/for-venues`) | Уже говорит, что это видео; «35» совпадает с подписью под видео |
| Остальные 38 подписей (в т. ч. динамические `{ariaLabel}`, `${action.label}. ${action.disclosure}`, `Language: …`; Breadcrumb, Main, Quick actions, Choose language, Save to your list, «X guides», Jump to area, Related collections, Approximate sunset time by month, Who this trip is for, Build your day и т. п.) | Уже простые и называют содержимое или действие |

«Your active brief — choose a chip to remove it» из аудита C10 лежит в `app/places/PlacesView.tsx`
— вне моего среза, не тронута.

## Проверки

- `node scripts/copy/check-rewrite.mjs <10 файлов> --ref HEAD` → exit 0; 0 REJECT, 0 FAIL, WARN не вырос
  (bali 3→3, HotelRestaurantsHub 4→4, collections 3→3, nusa-penida 3→3, остальные 0→0).
  Гейт aria-* пропускает, поэтому сверка «было → стало» — таблица выше.
- `npx eslint` по 10 файлам → чисто.
- Тесты, ссылающиеся на изменённые файлы (`node --import tsx --test`): canggu-guide-answer 6/6,
  canggu-visual-first 10/10, performance-boundary 15/15, plan-route-hierarchy 6/6,
  wave3-product-boundary 6/6. Тесты не менялись.
- Ни одна изменённая строка не встречается в тестах (grep по `scripts/`, `*.test.*`).

## Сомнительные факты (замечены, не исправлены)

- `app/plan/page.tsx`: видимый текст «Planning stays separate from paid placement.» — упоминание
  платного размещения на публичной странице; guardrail #7 говорит, что такого понятия нет. Фраза о политике, дословно, не моя зона.
- `app/bali/[district]/page.tsx`: «{N} curated places in {hub}» и `app/bali/page.tsx`
  «{PILLARS.length + hubs.length} district guides» — счётчики считаются в коде; если район есть и в
  PILLARS, и в hubs, число может задвоиться. Не проверял.
- `app/collections/page.tsx`: в подписи и тексте — «decision-ready places», жаргон (C14), не тронут.

## Проверка 2 (скептик)

Скептик подтвердил одну находку, она исправлена минимальной правкой.

- `components/VenueVisual.tsx`, ветка без фото: подпись возвращена к версии HEAD
  `` `${name} editorial scene` ``. Теперь файл совпадает с HEAD, диффа нет.
  Почему: подпись `` `${name}: illustration, not a photo` `` добавляла утверждение о происхождении
  и носителе. Его не было в старом тексте, и оно неточно: в этой ветке нет изображения,
  только CSS-градиент из полос (`app/globals.css`, `.scene-*`). Называть его «illustration» —
  преувеличение. Строка выше в таблице «Было → Стало» для `VenueVisual` больше не действует.

Конфликт правил — на решение продукта, мной не решается (AGENTS §20):
- AGENTS.md, «Content publication rule»: «Fallback art must not be presented as venue photography».
  Это довод за то, чтобы как-то раскрыть, что перед пользователем заглушка.
- `scripts/performance-boundary.test.mjs`, тест «public venue media does not expose internal
  fallback or provenance labels»: он читает этот же файл и запрещает «Media pending»,
  «venue-media-disclosure», «venue-visual-label». Смысл теста — не показывать на публичных
  медиа подписи о заглушке и происхождении. Список запретов буквальный, поэтому прошлая подпись
  прошла тест формально, но против его смысла.
- Нужно решение: раскрывать ли заглушку (в aria-label или видимо) и какими словами,
  не утверждая про носитель. Пока решения нет, остаётся подпись HEAD.

Сомнительный факт (замечен, не исправлен): в подписи HEAD «editorial scene» тоже есть
утверждение. «Editorial» намекает на редакционный материал, а это декоративный градиент.
Оставлено как есть по указанию «вернуть HEAD».

Перепроверка после правки:
- `node scripts/copy/check-rewrite.mjs <10 файлов среза> --ref HEAD` → exit 0; 0 REJECT, 0 FAIL;
  WARN не вырос (bali 3→3, HotelRestaurantsHub 4→4, collections 3→3, nusa-penida 3→3, остальные 0→0).
- `npx eslint <10 файлов>` → чисто.
- `node --import tsx --test`: canggu-guide-answer 6/6, canggu-visual-first 10/10,
  performance-boundary 15/15, plan-route-hierarchy 6/6, wave3-product-boundary 6/6. Тесты не менялись.
- Итог среза: изменены 10 подписей в 9 файлах. Коммитов нет, в базу ничего не писалось.
