# T-OB-05 — остаток мобильного прохода (пункт d из T-OB-03) + T-OB-CI

```yaml
task_id: T-OB-05 (+ T-OB-CI)
repo: parkourcafe/privelegy-bali-club
base_sha: 6f27d47 (claude/autonomy-ob-01); main @ beff274
branch: claude/autonomy-ob-01 (PR #311, draft); claude/ob-ci-android (PR #312, draft)
дата: 2026-09-28
статус: T-OB-05 — DONE_CODE, TESTED_LOCAL (фикстурный режим); T-OB-CI — DONE_CODE, CI не запускался
```

## T-OB-CI — Android job

- Диагноз (ручной прогон 36370020206, со слов координатора; лог сам не открывал):
  `android-actions/setup-android@v3` по умолчанию ставит `packages: 'tools platform-tools'`.
  В cmdline-tools 16.0 legacy-пакета `tools` нет, `sdkmanager` выходит с кодом 1.
- Правка: `with: packages: 'platform-tools'` (`.github/workflows/ci.yml`). Platform 36 и
  build-tools 36.0.0 по-прежнему ставит шаг `Install Android SDK 36`. Триггеры не менялись.
- Ветка `claude/ob-ci-android` от main, коммит `f065aa9`, draft PR #312 в main.
- Cherry-pick в `claude/autonomy-ob-01`: коммит `8c98d27`.
- Проверено: YAML разбирается (`yaml.safe_load`). Сам Android job локально не запускался.
  Нужен ручной прогон CI; его запускает координатор.

## T-OB-05 — как мерил

`OTHER_BALI_ALLOW_FIXTURE_DATA=YES next dev`, Chromium `/opt/pw-browsers`, вьюпорт 360×780,
`isMobile`/`hasTouch`. Скрипт считает `a, button, input, select, summary` ниже 44 px.
Исключены: ссылки внутри абзацев, футер и хлебные крошки (решение владельца).
Прод-данные не использовались. `next dev` снова дописал блок в `AGENTS.md`. Правку откатил,
в коммиты она не попала.

| Страница | до | после | что осталось |
| --- | --- | --- | --- |
| /my-day | 4 | 3 | названия в `.place-card` (см. ниже) |
| /places | 9 | 6 | логотип 40 px; названия карточек |
| /plan | 1 | 1 | логотип 40 px |
| / | 2 | 0 | — |
| /me, /canggu, /bali, /best-warungs-in-bali, /canggu/best-brunch | 0 | 0 | — |
| /places/alchemy-uluwatu | 2 | 2 | названия карточек |
| /uluwatu | — | 6 | логотип; 5 ссылок внутри таблицы сравнения (18 px) |
| /uluwatu/best-brunch | — | 10 | названия карточек |

Остаток после правок — не дефект:
- **Название в `.place-card` (37 px).** Ссылка растянута на всю карточку через
  `.place-card-name a::after { inset: 0 }` (`app/globals.css:1138-1146`), поэтому реальная
  зона касания — вся карточка. Скрипт видит только сам текст — это ложное срабатывание.
- **Логотип `BrandHomeLink` (40 px).** По заданию не трогал: решение владельца.
- **Ссылки в ячейках таблицы на /uluwatu (18 px).** Это ссылки внутри текста таблицы, как
  встроенные в абзац. Оставил. Если владелец хочет крупнее, это дизайн-правка таблицы.

## Что исправлено (коммит `d3cc2fd`)

| Цель | Было | Файл |
| --- | --- | --- |
| «📍 Use my location» | `min-h-10` (40) | `components/my-day/DayBuilderForm.tsx` |
| «All N →» на фото района | 34 px | `app/places/PlacesView.tsx` |
| «Need a trip plan? →» | 20 px | `app/places/page.tsx` |
| «Explore Bali areas →», «See all Bali plans →» | 24 px | `app/page.tsx` |
| `.chip` в виде ссылки (`a.chip`) | 35 px: у inline-элемента min-height не работает | `app/globals.css` (`a.chip { display: inline-flex }`) |
| `.topline` в виде ссылки | 40 px | `app/globals.css` (`a.topline`; `<p class=topline>` не затронут) |
| `.ob-site-nav a` | 40 px | `app/globals.css` |
| Кнопка «Похожие места → Maps» | `min-h-8` (32) | `components/SimilarPlaces.tsx` |
| Кнопка меню лендинга | `h-10 w-10` | `components/landing/LandingChrome.tsx` |
| Переключатель villa/hotel | `min-h-10` | `components/PropertySubmissionForm.tsx` |
| «Open workspace» в кабинете партнёра | `min-h-10` | `app/partner/page.tsx` |

Тест: `scripts/mobile-touch-targets.test.mjs` +2 теста (всего 5). На старом коде новые
тесты падают (3 pass / 2 fail), на новом проходят (5/5).

## «world-class» (коммит `f689603`)

`check-page.mjs` проверяет весь текст страницы (`check-page.mjs:100,139`), и слово попадает
в проверку hype. Общий блёрб связанного гайда «Cliff-edge sunsets, world-class surf…»
оказывался почти на каждой гайд-странице. Заменены 17 вхождений в `app/**` и `lib/guides.ts`:
«world-class surf» → «reef-break surf»; «world-class sunsets» → «ocean sunsets».
В двух местах слово просто удалено. Предложение про сёрф в Canggu vs Uluwatu переписано без
оценки: «Uluwatu's reef breaks suit experienced surfers». Термин «reef breaks» уже был в
исходном тексте.
FAQ и answer-блоки не дописывались.

`check-page.mjs` на dev-рендере (фикстуры): `/where-to-watch-sunset-in-bali`,
`/bali-travel-guide`, `/canggu-vs-uluwatu` — «no hype filler adjectives» = PASS.
Страницы в целом по-прежнему не проходят: 4–5 FAIL, связанных с фактами и FAQ (см. T-OB-04).
Это вне задачи.

## Команды и результаты (Node v22.22.2)

```txt
npm ci              exit 0
npm run lint        exit 0 — 0 errors, 3 warnings (те же, что раньше)
npm run typecheck   exit 0
npm test            exit 0 — pretest 72/72; основной набор 606: 605 pass, 0 fail, 1 skipped; seo-os "errors": []
npm run build       exit 0
```

`ios-web/build-manifest.json` не пересчитывался: ни один изменённый файл не входит в `sourceInputs`.

## Не проверено

- Прод/превью (сеть закрыта) — **BLOCKED_EXTERNAL**.
- Реальные телефоны.
- Android job в CI — ждёт ручного прогона координатором.

## Решения владельца (не делал)

- Размер логотипа, ссылок футера (18 px), хлебных крошек (32 px) — BLOCKED_DECISION.
- Ссылки в таблице сравнения /uluwatu (18 px) — новое: крупнее или оставить как текст.
- Код ответа «Route not found» (200 или 404) — BLOCKED_DECISION.
- UTM/QR-конвенция, площадки QR, постер вне Canggu, выгрузка GSC — BLOCKED_DECISION.

## Чек-лист владельцу на 5 минут (после деплоя превью, телефон)

1. `/my-day`: кнопка «📍 Use my location» не ниже соседних чипов, тап срабатывает.
2. `/places`: «All N →» на фото района и «Need a trip plan? →» легко попасть пальцем.
3. `/uluwatu`: чипы гайдов в ряд, без обрезки.
4. Любая гайд-страница: в блоке «связанные гайды» написано «reef-break surf».

## next_step

Координатор: ручной прогон CI на #312/#311, чтобы проверить Android job. Дальше — ответы
владельца по списку выше.
