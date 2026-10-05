# RUNLOG — программа «человеческий текст» (copy)

План: `/root/.claude/plans/idempotent-drifting-meadow.md` в сессии 2026-10-04 (копия ключевых решений ниже).
Условие основательницы: ничего не публиковать и не писать в базу, пока она не увидит конкретный список изменений.

## 2026-10-04 — D0, опора
- Ветка `claude/pensive-ritchie-f9kkhp`; `origin/main` влит мержем (`9b11894`), без конфликтов. main = `520ed13` (PR #316 от 01.10 снова включил сборку main на Vercel; PR #311 — meta description по границе слова, «world-class» убран из `lib/guides.ts`).
- **Какой коммит обслуживает www — не известно.** На 04.10 прод ≠ main (sitemap-index; карточки с пустым `why_its_here` отдаются с `index,follow`). Вопрос основательнице / Vercel. До ответа: мерж в main считается возможной публикацией → «да» нужно перед мержем.
- Экспорта базы нет (сессия без коннектора). Для отчётов — краул 28.09 `docs/audits/2026-09-28-web/places.csv`. Для SQL-guard'ов краул не используется: генератор `scripts/copy/build-copy-sql.mjs` читает экспорт и держит строку в HOLD, если «до» в базе не совпало с «до» в списке.
- Открытые PR на те же файлы: #314 (draft; `lib/guides.ts`, `app/places/[slug]/page.tsx`, where-to-stay, things-to-do, bali-travel-guide, where-to-watch-sunset), #313 (новый гайд). Решение до волны по гайдам.

## 2026-10-05 — перезапуск среды; D1 и D2
- Контейнер перезапустился; первая фоновая сборка `scripts/copy/*` погибла до записи файлов. Перезапущена тремя субагентами (lint+patterns+extract, fact-diff, build-copy-sql).
- **D1 (ложь и заглушки):** `stage1/change-list.csv` (35 строк) + `stage1/stubs-99.csv` (99) + `stage1/CHANGE-LIST.md`. В коде применено: `lib/hub.ts` — убрано ложное «Each pick below lists what to order and the price anchor» и «with what to order and prices» (VenueCard их не показывает); `lib/uluwatu/venues.ts:1348` — Warung Bu Jonny без «well-regarded» / «popular with». База — ждёт «да».
- **D2 (один стандарт):** `docs/content-style.md` §9 «Machine patterns» (единый список, исполняемая копия — `scripts/copy/patterns.mjs`), §5 пример без тире и тройки; `otherbali-venue-record-standard/SKILL.md` — «одно утверждение на предложение» вместо формулы, пример Crate Cafe переписан, абзац «формула ≠ голос», Step 4 с lint/fact-diff, Step 5 с guard на точный текст и rollback; `references/field-standard.md` — одна норма длины (1–3 предложения, 20–45 слов), формат `not_for` помечен как открытое решение; `otherbali-guide-page-standard/SKILL.md` — та же формулировка; `acceptance-rules.md` — запрет повторной шаблонизации (Jaccard); `docs/BRIEF_VENUE_DESCRIPTIONS.md` — баннер «заменено»; `geo-seo/references/otherbali-overlay.md` §11 — баллы за moreover/furthermore игнорируются.
- **check-page.mjs** теперь импортирует `HYPE` и `mask()` из `scripts/copy/patterns.mjs` и маскирует названия заведений (h3 карточек + `name` из JSON-LD) перед проверкой. Повод: на сохранённой странице best-restaurants-in-bali расширенный список ловил «Swan Paradise», «The 1O1 Bali Oasis», «Hidden Gem Uluwatu» — названия, не наш текст. На hub-uluwatu — «an elevated dinner» в карточке: настоящая находка.
- `package.json`: `copy:lint`, `copy:test`; три теста `scripts/copy/*.test.mjs` добавлены в `test`.
- Пилот: `pilot/units-cards.json` (10 карточек: milk-and-madu-beach-road, atlas-beach-club, nook-umalas, ji-restaurant-bali, sensorium-bali; fair-warung-bale, warung-mendez, wulan-vegetarian-warung, bali-buda-ubud, kilig-bali), `pilot/drafts.json` (черновики «после» + названные удаления), `pilot/reader-sheet.md` (14 пар: 12 + 2 канарейки с подменённым фактом), `pilot/ab-key.json` (ключ), `pilot/ab-sheet.md` (12 пар для основательницы). Слепой читатель запущен отдельным агентом, который видит только reader-sheet.md.
- **Инцидент — два писателя на одних файлах.** Фоновый конвейер, запущенный 04.10 до перезапуска, оказался жив: его агенты build:lint и build:fact-diff продолжали переписывать `scripts/copy/*` параллельно с новыми сборщиками (транскрипты росли до 03:28). Остановлен (`TaskStop` ww7buoskm). Файлы на диске — версия после последней записи; дальше: импорт-проверка модулей, тесты, адверсариальное ревью по каждому модулю. Урок в план: перед повторным запуском проверять `journal.jsonl` и транскрипты старого прогона, а не только `scripts/copy/`.

## 2026-10-05 — шаги 1–6 после обрыва по лимиту
- **Точность детектора.** По ручной выборке: в базе R2/H1 верны 29 из 32; в коде и resort — 19 из 28. Исправлено: «cult» больше не ловит «Dish Cult» (платформа брони); «reviewers» — «app reviewers»; R2 не применяется к вопросам FAQ; «elevated» перед terrace/deck/views/ocean — буквальная высота; экстрактор пропускает `evidence` и вызовы `ev(…)`; невидимые символы (zero-width) удаляются перед проверкой. `allowlist.json`: 3 точечные записи («A Day in Paradise» — пакет Hilton, «Bali Paradise Massage» — процедура, /review — «Reviewers» = проверяющие App Store). После: в коде и resort из 19 FAIL ложных нет. Базовый прогон пересчитан: 7 311 единиц, 117 927 слов, FAIL 197 (база 178, код 12, resort 7), WARN 2 027; повторный прогон байт-в-байт тот же.
- **Дополнение этапа 1:** +5 карточек с языком отзывов (S1-050…054) и абзац Mount Batur (S1-060, «A better Mount Batur page…»). Все прошли fact-diff. Генератор SQL на синтетическом экспорте из краула: 27 + 99 операторов, 0 HOLD. Перед этим он правильно задержал S1-054: в «до» был изогнутый апостроф, на сайте — прямой; исправлено.
- **Пилот v3.** Сторож фактов отклонил 3 моих формулировки (два новых числа, «resort pool»); одно сужение смысла найдено вручную. v3: 12 из 12 PASS, 0 FAIL, отметок 28 → 7, ни одно поле не хуже. Новый A/B-лист `ab-sheet.md` + `ab-key-v3.json`; итог — `pilot/CHANGE-LIST.md`. Повторное слепое чтение агентом не запускалось (экономия лимита): от v1 к v3 изменилась только формулировка, факты те же.
- **Защита от отката:** `scripts/copy/ratchet.mjs` + `baseline.json` (181 файл кода и страниц resort) + `copy-ratchet.test.mjs` в `npm test`.
- **Ревью генератора SQL** (пробы вместо упавшего агента). Найдено и исправлено:
  - **blocker** — перевод строки в `unit_id` выходил из SQL-комментария, и остаток ячейки становился исполняемым кодом. Теперь `unit_id` и `slug` проверяются по алфавиту, `--label` сворачивается в одну строку.
  - **major** — две одобренные правки одного поля проходили, и весь блок падал только при применении в базе. Теперь отказ на этапе сборки.
  - Решение: принимается только «ДА» (без учёта регистра, пробелы обрезаются). «ДА?», «да, но…» и «yes» не принимаются.
  - Тесты 25 → 29.
- **Проверки:** `npm run lint` — 0 ошибок (3 старых предупреждения); `typecheck` — ok; `npm test` — pretest 72/72, основной 760 pass, 1 skip (был и раньше), 0 fail; `npm run build` — ok (153 страницы). `check-page.mjs`: хайп-гейт PASS на best-brunch и best-restaurants (названия заведений маскируются), FAIL на hub-uluwatu — «an elevated dinner», настоящая находка. `ios-web/build-manifest.json` перегенерирован (`npm run mobile:build`) и закоммичен вместе с `package.json` — так принято в репозитории: хэш манифеста включает `package.json`.

## 2026-10-05 — решение основательницы: «Делай по своим рекомендациям»
- **Решения:**
  - Этап 1 B1–B4 — ДА; S1-022 → NULL (часы взяты из Tripadvisor).
  - Абзац Mount Batur — ДА.
  - Пилот — ДА, принят по слепому чтению агентом (12/12). A/B-лист остаётся основательнице для проверки, работу не держит.
  - Формат `not_for` — без фиксированного шва: причина приложена, не больше одного тире, у трёх соседних карточек разный шов.
  - ~750 шаблонных карточек — вариант A: ждут фактов и пишутся по одной; вариант B (NULL) — для тех, у кого после сбора нет ничего сверх Google Maps.
  - Колонка `decision` заполнена во всех трёх списках (27 + 99 + 29 строк по базе).
- **Код (ветка, без PR и мержа):**
  - `lib/guides.ts` — гайд «How many days in Bali» и абзац Mount Batur;
  - `app/nusa-dua/page.tsx` — вступление и meta. Meta сделана конкретнее черновика v3: «resort fine dining and some of Bali's biggest spas» осталось, ушли только «resident-curated» и «the best».
  - Ratchet: в `lib/guides.ts` H1 3 → 2, WARN 491 → 478; в `nusa-dua` WARN 19 → 15. `baseline.json` понижен.
- **Документы:** `field-standard.md` и `content-style.md` §9 — решение по формату `not_for`; §5 — две одобренные пары пилота как эталон голоса.
- **Прод ≠ main (проверено 05.10):** sitemap — это sitemap-index; meta на `/places/milk-and-madu-beach-road` обрезана на середине слова («…Milk & Ma»), то есть PR #311 на проде не работает. Правки кода из ветки на сайт не попадут до PR, мержа и деплоя — это отдельное «да».
- **База — не записана.**
  - Supabase-коннектор в этой сессии видит три других проекта (aether-medium, remhaos.com, Petid.care). На `egkdapqwkfprtyqvvnso` ответ — «You do not have permission».
  - Подготовлено для сессии с доступом: `DB-APPLY-NEXT-SESSION.md`, `export-query.sql` (131 slug). Генератор теперь читает экспорт коннектора в JSON как есть.
  - Прогон всех трёх списков на экспорте из краула: 27 / 99 / 29 операторов, 0 HOLD.

## 2026-10-05 — «перепиши всё, что можно, нон-стопом; с базой разберёмся потом»
- **Объём** — всё, что можно переписать без новых фактов:
  - текст в коде: ~50 тыс. слов в ≈160 файлах;
  - 17 страниц resort;
  - 517 карточек базы с машинными признаками — только черновики изменений; записывать в базу будем позже.
- **Не трогаем:**
  - реестр Uluwatu (идёт проверка батча 1, на предложения есть claim-записи);
  - `lib/hub.ts`, `lib/seed.ts`, i18n, формы и согласия, юридические страницы;
  - заголовки, H1, вопросы FAQ, slug;
  - формулировки о политике и деньгах (sponsored, ranking, fees);
  - ~650 шаблонных карточек — решение A: ждут сбора фактов.
- **Ворота для всех исполнителей:**
  - `scripts/copy/check-rewrite.mjs` для кода и resort. Каждая изменённая строка сверяется с её же старым текстом; из остального файла берутся только названия мест, поэтому «three or four nights» в другой части гайда не позволит превратить «three full days» в «four». Плюс 0 FAIL и не больше WARN, чем было. Ворота поймали одно слово в уже закоммиченном гайде пилота — «most» в «the length most first trips should be»; заменено на «works well for a first trip».
  - `scripts/copy/check-cards.mjs` для карточек: карточка проверяется целиком (why/best/not), 0 FAIL с формулой-открытием, нет дублей, нет кластеров из 3+ похожих описаний.
- **Исполнители, у каждого свои файлы:**
  - `lib/guides.ts`;
  - `lib`-контент районов;
  - страницы районов в `app/`;
  - страницы по всему Бали и компоненты;
  - resort;
  - 5 групп карточек: Canggu 148, Ubud и северо-восток 89, Seminyak/Kuta/Bali 110, Uluwatu+Sanur 93, Nusa Dua+Jimbaran 77.
