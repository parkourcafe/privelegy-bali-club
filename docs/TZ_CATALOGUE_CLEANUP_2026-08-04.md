# ТЗ: чистка каталога и описания группы A

```yaml
дата: 2026-08-04
кому: Selena + исполнитель по описаниям
объём: четыре задачи, из них три — час работы, одна — два-три вечера
блокирует: сбор координат по 355 заведениям (задача 1)
```

## Порядок

Задачи 1–3 — гигиена данных, делаются до сбора координат. Задача 4 —
единственная, где нужен человек с текстом, и единственная, где отдача
начинается сразу.

| # | Задача | Объём | Кто | Срочность |
|---|---|---|---|---|
| 1 | Дубли заведений | ~25 групп | решение Selena, SQL мой | **блокирует сбор координат** |
| 2 | Мусор в поле сайта | 4 строки | SQL, 5 минут | сейчас портит разметку |
| 3 | Instagram как `@handle` | 13 строк | SQL, 5 минут | поле молча теряется |
| 4 | Описания группы A | 44 карточки | человек, 2–3 вечера | трафик уже есть |

---

# Задача 1. Дубли заведений

## Почему это первое

Если не свести дубли, мы дважды заплатим за сбор координат по одному и тому
же месту и опубликуем две карточки на одно заведение. Google это видит как
дублирующийся контент.

## Чего делать НЕ надо

**Одинаковое название — ещё не дубль.** Мы на этом уже ошибались: Milk & Madu,
BAKED, Bali Buda и Neighbourhood Food — это настоящие разные филиалы с общим
сайтом бренда. Схлопнуть их значило бы стереть реальные заведения.

Правило различения:

```txt
ДУБЛЬ         одно название + один район + один адрес/координаты
ФИЛИАЛ        одно название + разные адреса → обе записи остаются
УСЛУГА        один адрес + разные услуги (спа / йога / зал)
              → решение отдельное, см. ниже
```

## Шаг 1. Подтвердить дубли запросом

```sql
select lower(trim(name)) as имя, district,
       count(*) as записей,
       array_agg(slug order by slug) as slugs,
       array_agg(coalesce(full_address,'—') order by slug) as адреса,
       array_agg(coalesce(latitude::text,'—') order by slug) as широта
from venues
where publication_status = 'published'
group by lower(trim(name)), district
having count(*) > 1
order by count(*) desc, имя;
```

Где адреса и координаты совпадают или пусты у обеих — дубль. Где различаются —
филиал, обе остаются.

## Шаг 2. Кандидаты, которые я вижу глазами

Это не итог, а список на проверку запросом выше.

**Чангу**

| Оставить | Убрать | Признак |
|---|---|---|
| `bali-mma` | `bali-mma-canggu` | одно имя, один сайт |
| `body-factory-bali` | `body-factory-bali-canggu` | одно имя |
| `canggu-yoga-centre` | `canggu-yoga-centre-canggu` | одно имя |
| `f45-training-canggu` | `f45-training-canggu-canggu` | одно имя |
| `jungle-padel-canggu` | `jungle-padel-canggu-canggu` | одно имя |
| `nirvana-life-bali` | `nirvana-life-bali-canggu` | одно имя |
| `obsidian-gym-bali` | `obsidian-gym-bali-canggu` | одно имя |
| `soma-fight-club` | `soma-fight-club-canggu` | одно имя |
| `the-canggu-studio` | `the-canggu-studio-canggu` | одно имя |
| `the-practice-bali` | `the-practice-bali-canggu` | одно имя |
| `goldust-spa-canggu` | `goldust-beauty-facials-canggu` | один сайт `goldustspa.com` |

**Убуд**

| Оставить | Убрать | Признак |
|---|---|---|
| `alchemy-yoga-meditation-center` | `alchemy-yoga-and-meditation-center`, `alchemy-yoga-and-meditation-center-ubud` | **три записи одного места** |
| `zuna-yoga` | `zuna-yoga-ubud` | одно имя |
| `taksu-yoga-ubud` | `taksu-yoga` | одно имя |
| `taksu-spa-ubud` | `taksu-spa-beauty-ubud` | один сайт, одно место |
| `jaens-spa` | `jaens-spa-ubud-ubud` | одно имя |
| `dala-spa-at-alaya-resort-ubud` | `dala-spa-beauty-at-alaya-ubud-ubud` | один отель |
| `svaha-spa-bisma-ubud` | `svaha-spa-beauty-ubud-ubud` | один адрес «Bisma / Ubud Centre edge» |

**Улувату**

| Оставить | Убрать | Признак |
|---|---|---|
| `la-tribu-bali` | `la-tribu` | у второго сайт — ClassPass, не заведение |
| `morning-light-yoga-studio` | `morning-light-yoga` | одно имя, один сайт |
| `bambu-fitness-bali` | `bambu-pilates` | один сайт `bambufitnessbali.com` |

**Не трогать — это разные места, хотя названия похожи:**

- `jungle-padel-canggu-shortcut` — отдельная площадка на шорткате, свой URL;
- `therapy-day-spa-pererenan` и `therapy-canggu-canggu` — Переренан и Чангу;
- `reform-pilates-bingin` и `reform-uluwatu` — Бингин и Улувату;
- `alchemy-uluwatu` (кафе) и `alchemy-yoga-and-meditation-center-uluwatu` (йога);
- `neighbourhood-food-berawa` и `neighbourhood-food-seseh`, `baked-berawa` и
  `baked-pererenan`, `milk-and-madu-*` — настоящие филиалы.

## Шаг 3. Отдельное решение — услуги в одном здании

Три группы, где записи не дубли, но и не самостоятельные места:

- `rite-bali` · `rite-bali-recovery-canggu` · `rite-bali-yoga-canggu`
- `maya-ubud-spa-ubud` · `maya-ubud-yoga-ubud` · `maya-ubud-fitness-centre-ubud`
- `the-canggu-studio` · `the-canggu-studio-yoga-canggu`
- `body-factory-bali` · `body-factory-bali-recovery-canggu`

Это одна площадка с разными услугами. Они имеют право на отдельные карточки
**только если у каждой есть собственное «зачем сюда идти»** — своя причина,
своя аудитория, свои часы. Если у трёх карточек описание будет одинаковым, это
три пустые страницы на один адрес, и лучше одна.

**Нужно ваше решение**, и оно же станет правилом для сетей вроде Svaha Spa с
её 21 филиалом.

## Шаг 4. Как убирать

Не удалять. Ставить `publication_status = 'review'` — это внутреннее состояние,
страница уходит из индекса, а запись и её история остаются.

```sql
update venues
set publication_status = 'review'
where slug in (
  -- подтверждённые дубли из шага 1
  'bali-mma-canggu'
  -- …
)
  and publication_status = 'published';
```

Перед запуском — прогнать одну строку и откатить, по
`.agents/skills/otherbali-supabase-write/SKILL.md`. Напоминаю: `archived` база
не примет, только `published` и `review`.

## Приёмка

Повторить запрос шага 1 — групп с `count(*) > 1` должно остаться только
столько, сколько вы сознательно оставили филиалами, и по каждой должно быть
понятно, почему.

---

# Задача 2. Мусор в поле сайта

## Что не так

У четырёх заведений в `official_url` лежит не ссылка, а ссылка с комментарием
внутри. Это поле уходит в разметку страницы как `sameAs` — то есть мы
сообщаем Google несуществующий адрес.

| slug | что лежит сейчас | что должно быть |
|---|---|---|
| `espace-spa-canggu-canggu` | `https://espacespabali.com/ (HTTP 403, could not read pages directly)` | `https://espacespabali.com/` |
| `glo-day-spa-salon-canggu-canggu` | `https://www.glospabali.com/ (listed glodayspabali.com is dead / DNS not found)` | `https://www.glospabali.com/` |
| `therapy-canggu-canggu` | `https://therapy.co.id/ (therapybali.com 301-redirects here)` | `https://therapy.co.id/` |
| `svaha-spa-beauty-ubud-ubud` | `https://svahawellness.com/ (svahaspa.com/bisma)` | `https://svahawellness.com/` |

Комментарии в скобках — рабочие заметки сборщика. Они полезны, но их место не в
поле, которое публикуется.

## SQL

```sql
update venues
set official_url = regexp_replace(official_url, '\s*\(.*$', '')
where official_url like '%(%'
  and publication_status = 'published';
```

## Приёмка

```sql
select slug, official_url from venues
where official_url like '%(%' or official_url like '% %';
```

Должно вернуть ноль строк.

---

# Задача 3. Instagram записан как `@handle`

## Что не так

У тринадцати заведений в `instagram_url` лежит не ссылка, а имя аккаунта.
Поле проходит через нормализацию, и значение просто теряется — на странице
Instagram не появляется, хотя данные есть.

`360-move-uluwatu` · `d-nailbar-spa-uluwatu` · `dorsey-s-barber-shop-uluwatu` ·
`guan-yin-yoga-canggu` · `island-grooming-barbershop` · `ours-spa-boutique` ·
`piccolina` · `reform-pilates-bali` · `studio-fondue` · `svaha-spa-bingin` ·
`the-yoga-rescue` · `ulu-active-recovery` · `yinside-yoga`

## SQL

```sql
update venues
set instagram_url = 'https://www.instagram.com/' || ltrim(trim(instagram_url), '@') || '/'
where trim(instagram_url) like '@%'
  and publication_status = 'published';
```

## Приёмка

```sql
select count(*) from venues where trim(instagram_url) like '@%';
```

Должно вернуть `0`.

## Заодно — не в этой задаче, но записать

Ещё примерно у десяти заведений в `official_url` стоит не их сайт, а
платформа записи: ClassPass, Playtomic, Momence, Facebook, Instagram
(`ami-studio`, `bluvana-reformer-studio`, `mantra-wellness`,
`uluwatu-collective`, `prana-padel`, `naya-uluwatu`, `secret-spot-bali`,
`melting-wok-warung`, `cafe-vida-…`, `tukies-coconut-shop`).

Это не мусор, но и не официальный сайт: для разметки `sameAs` это слабый
сигнал, а для сбора данных — источник, на котором нет ни карты, ни часов. При
следующем прогоне по этим заведениям сайт стоит поискать заново.

---

# Задача 4. Описания группы A — 44 карточки

## Почему именно эти 44

Это заведения, которые **Google находит прямо сейчас**, а карточка молчит:
вместо описания стоит автоматическая фраза «*is a verified dining venue in
Ubud*». Пять из них стоят на первой странице выдачи. Каждый заход на такую
карточку тратится впустую.

Всего пустых карточек 377. Эти 44 отобраны по одному признаку — по ним уже
идут показы. Остальные могут ждать.

## Рабочий файл

`data/data-ops/cards-group-a-worksheet.csv` — отсортирован по важности,
сверху те, кого находят чаще. В нём уже проставлены район, число показов,
позиция в выдаче, текущий текст, и где известно — адрес, сайт и Instagram.

Заполнить три колонки: `НОВОЕ_ОПИСАНИЕ`, `источник_факта`, `проверено_дата`.

## Первая десятка, чтобы было видно порядок

| # | Заведение | Район | Показы за 90 дней |
|---|---|---|---|
| 1 | LowCal, Cheatery and Bar | Чангу | 17 |
| 2 | NOONIK Bistro | Убуд | 15 |
| 3 | NARI — Fire Influenced Bistro | Убуд | 7 |
| 4 | CHUPACABRAS — South American \| Prime Meats | Убуд | 6 |
| 5 | Hakkoku Bali — Sushi Omakase | Убуд | 5 |
| 6 | Caffè Torino by Venticinque Group | Чангу | 5 |
| 7 | Tirta Padma (Tribhuwana Padma) | Бангли | 5 |
| 8 | Casa de Lokha Mexican Grill | Убуд | 4 |
| 9 | CHORA Mediterranean Restaurant & Bar | Убуд | 4 |
| 10 | GORO GORO CAFE & KITCHEN | Санур | 3 |

Дальше по файлу — ещё 34.

## Что считается хорошим описанием

Не красивый текст, а **проверяемые факты, которых нет в Google Maps**. Иначе
смысла нет: Maps даёт часы, фото, отзывы и маршрут, по этим пунктам мы не
выиграем.

Плохо (так сейчас):

> Bliss Lounge Bar is a verified dining venue in Seminyak.

Хорошо (реальное описание с нашего же сайта):

> A popular healthy cafe at a busy Berawa junction on Jl. Pantai Berawa,
> serving wholesome bowls, salads, wraps, smoothies and coffee from breakfast
> to evening; part of a small Bali group.

Разница — перекрёсток, улица, что подают, с какого времени, часть сети. Пять
проверяемых фактов вместо нуля.

### Формула — три предложения

```txt
1. ЧТО ЭТО И ЧЕМ ОТЛИЧАЕТСЯ — одна конкретная деталь, не оценка.
   Не «уютное место», а «на углу такой-то улицы», «во дворе виллы»,
   «дровяная печь», «единственный вегетарианский в районе».

2. ЧТО ЗАКАЗАТЬ + ориентир по цене.
   «Утка по-балийски, Rp 120–180 тыс. на человека».

3. КОГДА И КОМУ ИДТИ — повод, а не атмосфера.
   «Завтрак перед сёрфом», «ужин с детьми», «поработать до обеда».
```

Длина 30–45 слов. Язык — английский, это язык сайта.

## Жёсткие правила

1. **Ничего не выдумывать.** Каждый факт откуда-то взят: сайт заведения, его
   Instagram, меню, личный визит. Фактов не нашлось — строка остаётся пустой и
   это отмечается. Пустая строка честнее выдуманной.
2. **Указывать источник.** Колонка `источник_факта` — ссылка или «личный
   визит». **Строка без источника не принимается.** Через месяц никто не
   вспомнит, откуда взялась информация, и защитить её будет нечем.
3. **Не писать оценок.** «Лучший», «потрясающий», «уютный» — не проверяется и
   ничего не сообщает.
4. **Не переносить текст из отзывов Google.** Прочитать отзывы, чтобы понять,
   на что смотреть, — можно. Переписывать в описание — нельзя.
5. **Не генерировать пачкой нейросетью.** 44 текста по одному шаблону — это та
   же проблема, что сейчас, только другими словами, и поисковики за это
   наказывают вплоть до исключения сайта из выдачи. Писать по одному, глядя на
   конкретное заведение.

## Приёмка

Две проверки на любых трёх готовых описаниях:

1. **Можно ли по ним выбрать между двумя заведениями?** Если оба описания
   подошли бы любому ресторану на острове — нет.
2. **Есть ли хоть один факт, которого нет в Google Maps?** Если нет — карточке
   незачем существовать.

Заполненный файл возвращается мне, я делаю один запрос — и все 44 карточки,
районные страницы и гиды, где они стоят, обновляются разом. Переписывать
страницы руками не нужно: они собираются из этих полей.

---

# Что после

Когда задачи 1–3 закрыты, разблокируется сбор координат по 355 заведениям —
спека лежит в `data/data-ops/coords-collection-spec.md`.

Задача 4 ни от чего не зависит и может идти параллельно.
