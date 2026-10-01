# T-OB-04 — проверка ссылок и мест QR-пилота для отелей и вилл (O4)

```yaml
task_id: T-OB-04 (O4 в плане оркестратора)
repo: parkourcafe/privelegy-bali-club
base_sha: 0bc703e (ветка claude/autonomy-ob-01)
branch: claude/autonomy-ob-01
pr: #311 (draft)
дата: 2026-09-28
статус: TESTED_LOCAL по коду; прод-часть BLOCKED_EXTERNAL; нейминг и UTM BLOCKED_DECISION
документ пилота: docs/ops/autonomy/OB_QR_SEO_PILOT.md (раздел 6 добавлен этой задачей)
```

Ничего не напечатано, не размещено, не отправлено. В прод-БД ничего не
читалось и не писалось.

## Как проверялось

- Production-сборка `npm run build` без переменных Supabase, затем
  `next start` локально. Публичные данные в этом режиме закрыты (fail closed):
  маршруты рендерятся, а списки заведений пустые.
- `curl` по каждому URL пилота: код ответа, `<link rel=canonical>`,
  `<meta name=robots>`.
- Гейт `.agents/skills/otherbali-guide-page-standard/scripts/check-page.mjs`
  на каждом гайде. Провалы разделены на зависящие от данных и зашитые в коде.
- Валидатор источника `lib/source-attribution.ts` и `POST /api/source` на
  локальном сервере.

## 1. Маршруты существуют (TESTED_LOCAL)

| URL | Локально | canonical | robots |
| --- | --- | --- | --- |
| `/` | 200 | `https://www.otherbali.com` | индексируется |
| `/?s=villa_canggu_01&utm_…` (посадка QR) | 200 | `https://www.otherbali.com` — параметры не плодят дубль | индексируется |
| `/canggu/work-friendly-cafes` | 200 | self | индексируется |
| `/canggu/best-brunch` | 200 | self | индексируется |
| `/canggu/best-restaurants` | 200 | self | индексируется |
| `/ubud/best-cafes-coffee` | 200 | self | индексируется |
| `/uluwatu/beach-clubs-sunset` | **404** без данных | — | noindex |
| `/seminyak/best-restaurants` | 200 | self | индексируется |
| `/best-warungs-in-bali` | 200 | self | индексируется |
| `/where-to-watch-sunset-in-bali` | 200 | self | индексируется |
| `/places/jari-menari-seminyak` | 404 без данных | — | noindex |
| `/places/pizza-fabbrica` | 404 без данных | — | noindex |
| `/villas`, `/hotels` (B2B-страницы для отелей и вилл) | 200 | self | индексируется |

`/uluwatu/beach-clubs-sunset` закрыт гейтом
`components/UluwatuVenueGuideGate.tsx:17-26` из
`app/uluwatu/beach-clubs-sunset/layout.tsx:4-12`. Страница отдаёт 404, если
хотя бы одно из 7 заведений не `district = 'uluwatu-bukit'`, не `active` или
не `published`. В реестре кода все 7 — `published` (проверено вызовом
`getUluwatuContent`). Сторона БД — **BLOCKED_EXTERNAL**, SQL ниже.

## 2. Пропустят ли гейты публикации (TESTED_LOCAL по коду)

`check-page.mjs` на локальном рендере без данных. Провалы, зависящие от
данных (0 карточек, «Best for», «Not for», «Last checked», а у Canggu — ещё и
блок ответа), здесь не показательны. Ниже только то, что **зашито в коде** и
не исчезнет в проде:

| Страница | Провал в коде | Источник |
| --- | --- | --- |
| `/canggu/best-brunch` | нет | — |
| `/canggu/work-friendly-cafes` | FAQ: 1 вопрос (нужно 5–8) | `lib/canggu-guides.ts` (`guide.faq`) |
| `/canggu/best-restaurants` | FAQ: 2 вопроса | `lib/canggu-guides.ts` |
| `/ubud/best-cafes-coffee` | нет блока `.guide-answer` в компоненте; FAQ: 1 | `components/UbudGuideView.tsx`, `lib/ubud-guides.ts` |
| `/seminyak/best-restaurants` | нет `.guide-answer`; FAQ: 2 | `components/SeminyakGuideView.tsx`, `lib/seminyak-guides.ts` |
| `/best-warungs-in-bali` | нет `.guide-answer`; FAQ: 4 | `app/best-warungs-in-bali/page.tsx` |
| `/where-to-watch-sunset-in-bali` | нет `.guide-answer`; FAQ: 4; «world-class» в карточке связанного гайда | `app/where-to-watch-sunset-in-bali/page.tsx:329` |

Предупреждения (не провалы): `<title>` длиннее 60 символов на пяти районных
гайдах.

Вывод: сегодня `check-page.mjs` полностью не проходит ни один из 7 проверенных
гайдов (`/uluwatu/beach-clubs-sunset` без данных отдаёт 404 и не проверялся,
`/` — не листинг). Провалы в коде — на 6 из 7; у `/canggu/best-brunch`
остались только провалы, зависящие от данных.
Запрос индексации эти провалы не блокирует: страницы индексируемы
(200, self-canonical, без noindex). Но по стандарту гайда они не «готовы к
публикации».

Исправление — контентная работа по `otherbali-guide-page-standard` с
источниками: дописывать FAQ без источника нельзя (AGENTS.md §13). Поэтому
в этом запуске не правилось.

## 3. UTM и метка источника (BLOCKED_DECISION)

Факты:

- QR ведёт на `/?s=<source>` без UTM
  (`app/admin/(protected)/qr/source/[source]/page.tsx:13-21`).
- Туристская сторона читает только `s`/`source` (`app/SourceCapture.tsx:14-15`);
  `utm_*` сохраняют только формы партнёров
  (`components/PropertySubmissionForm.tsx:95-99`,
  `components/VenueSubmissionForm.tsx:130-134`,
  `components/GuideLeadForm.tsx:45-49`). Для туриста UTM дойдёт только в GA4
  и только после согласия.
- В репозитории **две несовместимые конвенции UTM**:
  - `docs/analytics/ANALYTICS_EVENT_MAP_2026-08-25.md:16-25`:
    `utm_source` = `partner_site` / `google_business_profile` / `ai_search`,
    `utm_medium` = `referral` / `organic_local` / `ai`,
    `utm_campaign` = `bali_discovery_2026_q3`;
  - `docs/gtm/BALI_PRIVILEGE_GROWTH_MEASUREMENT_SPEC.md:51-55`:
    `utm_source` = `property|driver|creator|community|meta|qr`,
    `utm_medium` = `prearrival|checkin|incar|…`,
    `utm_campaign` = `gtm90-{wave}-{id}`.
- Нейминг QR-кода из той же спеки (`…SPEC.md:58`, пример
  `OB-VIL-CABO-CHECKIN`) **не проходит** валидатор источника: разрешены
  только `^[a-z0-9][a-z0-9_-]{0,63}$` (`lib/source-attribution.ts:1`, то же
  ограничение CHECK в `supabase/migrations/0031_secure_partner_operator_rpcs.sql:321`).
  Локально `POST /api/source {"source":"OB-VIL-CABO-CHECKIN"}` → **400**, а
  `SourceCapture` глотает ошибку молча: скан с таким кодом не засчитается, и
  этого никто не увидит. Та же метка в нижнем регистре
  (`ob-vil-cabo-checkin`) проходит валидатор.
- Допустимый id без выпуска в БД → **422** (локально БД нет) — так и задумано:
  засчитываются только выпущенные оператором источники.

Предложение (решает владелец, код не менялся):

- авторитетная атрибуция — `s=<id>`; id только строчные, по образцу спеки:
  `ob-vil-<площадка>-checkin`, одна метка на точку размещения;
- UTM для QR — по GTM-спеке, раз пилот идёт из неё:
  `utm_source=property&utm_medium=checkin&utm_campaign=gtm90-w1-<площадка>`;
- в `ANALYTICS_EVENT_MAP` отметить, какая конвенция действует для офлайн-носителей.

Текст постера зашит под Canggu («Find your Canggu day»,
`…/qr/source/[source]/page.tsx:46`), а посадка `/` — общебалийская главная.
Если площадка вне Canggu, текст постера не совпадёт с посадкой. **BLOCKED_DECISION**.

## 4. Места размещения

В репозитории нет ни одной названной виллы или отеля для пилота
(`OB_QR_SEO_PILOT.md` §2.4). Площадки не придумывались. **BLOCKED_DECISION**.

## SQL для владельца (только чтение, прод)

```sql
-- 1. Гейт /uluwatu/beach-clubs-sunset: ждём 7 строк, все
--    district='uluwatu-bukit', status='active', publication_status='published'.
select slug, district, status, publication_status
from public.venues
where slug in ('sundays-beach-club','white-rock-beach-club',
  'tropical-temptation-adult-only-beach-club','el-kabron-bali',
  'oneeighty','single-fin','mana-uluwatu')
order by slug;

-- 2. Гейт двух /places/ пилота: status='active', publication_status='published',
--    has_why и has_best_for = true.
select slug, district, status, publication_status,
       coalesce(btrim(why_its_here), '') <> '' as has_why,
       coalesce(btrim(best_for), '') <> ''     as has_best_for
from public.venues
where slug in ('jari-menari-seminyak', 'pizza-fabbrica');

-- 3. Где включён QR.
select slug, qr_enabled from public.districts order by slug;

-- 4. Выпущенные источники (метки не копировать в публичный репозиторий).
select id, source_class, active, created_at
from public.attribution_sources order by created_at;

-- 5. Сканы по источникам.
select source, count(*) as scans, max(ts) as last_scan
from public.events where type = 'source_scan'
group by source order by scans desc;
```

## Чек-лист владельцу на 5 минут

1. Выполнить SQL 1–2. Любая строка не в ожидаемом состоянии означает, что
   URL пилота отдаёт 404, и запрашивать его индексацию бессмысленно.
2. Выбрать конвенцию UTM и строчную метку источника (раздел 3).
3. В `/admin` открыть постер нужного источника → в подписи под QR виден URL
   `https://www.otherbali.com/?s=<id>`; отсканировать телефоном.
4. После скана в воронке `/admin` появился `source_scan` с этим id (SQL 5).
5. Назвать площадку (вилла или отель) и получить её согласие на размещение.

## next_step

- Решения владельца: конвенция UTM и метки, площадка, текст постера вне Canggu.
- Контентный проход по стандарту гайда для 6 страниц из раздела 2
  (FAQ с источниками, блок ответа для Ubud, Seminyak и двух общебалийских гайдов).
