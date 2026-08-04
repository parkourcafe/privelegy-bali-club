-- Координаты, партия 1 — 4 записи, прошедшие проверку.
--
-- Источник: внутренние данные репозитория и базы, а НЕ прогон сбора.
-- Сетевой доступ из сессии закрыт политикой egress (см.
-- docs/COORDS_RUN_2026-08-04.md), поэтому пройти по сайтам заведений,
-- как требует data/data-ops/coords-collection-spec.md, было невозможно.
-- Собрано только то, что уже лежало внутри:
--
--   2 строки — координаты в сохранённом venues.gmaps_url (пин !3d/!4d);
--   2 строки — data/data-ops/compiled/venue-maps.json, где координата
--              получена разрешением короткой ссылки с САЙТА заведения.
--
-- Шесть кандидатов найдено, четыре приняты, два отклонены — причины в конце.
--
-- Перед запуском выполнен обязательный dry-run одной строки (см.
-- otherbali-supabase-write): UPDATE 1, откат чистый, координаты снова null.

-- ── ПРОВЕРКА ГРАНИЦ ───────────────────────────────────────────────────
-- Все четыре точки лежат внутри рамки своего района (canggu:
-- lat −8.69…−8.60, lng 115.09…115.18) и имеют точность не грубее
-- пятого знака.

-- ── APPLY ─────────────────────────────────────────────────────────────
-- ожидается: UPDATE 4
update venues as v
set latitude = d.lat,
    longitude = d.lng,
    last_verified_at = '2026-08-04'
from (values
  ('copenhagen-cafe-berawa', -8.6589493::double precision, 115.1381321::double precision),
  ('revolver-canggu',        -8.6531518,                   115.1355510),
  ('santanera',              -8.6518446,                   115.1310906),
  ('ulekan-berawa',          -8.6602040,                   115.1429730)
) as d(slug, lat, lng)
where v.slug = d.slug
  -- Черновики и снятые с публикации не трогаем: партия импорта — не место
  -- менять состояние публикации.
  and v.status = 'active'
  and v.publication_status = 'published';


-- ── VERIFY ────────────────────────────────────────────────────────────
-- ожидается: 4. Меньше — значит slug не совпал, а НЕ «часть была уже верна».
select count(*) from venues
where slug in ('copenhagen-cafe-berawa','revolver-canggu','santanera','ulekan-berawa')
  and latitude is not null and longitude is not null;

-- Какие slug не совпали, если счёт короче:
select d.slug
from (values ('copenhagen-cafe-berawa'),('revolver-canggu'),('santanera'),('ulekan-berawa')) as d(slug)
left join venues v on v.slug = d.slug
where v.slug is null;


-- ── ОТКЛОНЕНО ─────────────────────────────────────────────────────────
--
-- chupacabras    «-8.480143986608011, 115.2459691464901»
--   Источник: https://www.chope.co/bali-restaurants/restaurant/chupacabras-ubud
--   Chope — сторонняя платформа бронирования, то есть ровно тот класс
--   источника, который правила приёмки запрещают (не страница заведения).
--   Сама запись помечена verification_status = verification_pending,
--   recommended_action = hold, publication_guard.can_publish = false.
--   Точка попадает в рамку Убуда — то есть проверка границ её НЕ отсеяла бы;
--   отсеял тип источника. 16 знаков после запятой — признак вычисленного
--   центроида, а не снятого пина.
--
-- habitat-bistro «-8.516359999999999, 115.2576139»
--   Источник: https://www.chope.co/bali-restaurants/restaurant/habitat-bistro-ubud
--   То же самое: Chope, verification_pending, can_publish = false. Адрес в
--   записи — «Kaamala Resort Ubud», то есть координата может указывать на
--   отель, внутри которого ресторан, а не на сам ресторан. Это тот же тип
--   ошибки, что дал 14:00 (время заселения) вместо часов кафе в прогоне по
--   часам 4 августа.
--
-- ── ПРИНЯТО С ОГОВОРКОЙ ───────────────────────────────────────────────
--
-- copenhagen-cafe-berawa, revolver-canggu: координата взята из пина
--   !3d/!4d в сохранённом venues.gmaps_url. Правила приёмки
--   (.agents/skills/otherbali-data-ops-run/references/acceptance-rules.md)
--   прямо называют этот источник бесплатным и уже использованным — так
--   пришли 22 строки в прошлый раз. Но §«Порядок поиска» спеки сбора столь
--   же прямо говорит «не Google Maps как таковой» и что результаты Google
--   нельзя хранить дольше 30 дней. Это противоречие между двумя
--   утверждёнными документами, и оно требует датированного решения Селены,
--   а не молчаливого выбора агентом. Если решение будет «нельзя» — эти две
--   строки снимаются, остаются две с сайтов заведений.
--
-- santanera, ulekan-berawa: источник — сайт самого заведения
--   (santanerabali.com/book, ulekanbali.com), в venue-maps.json записана
--   evidence-note с самой координатой. Оговорка одна: у обеих записей
--   verifiedAt = null и status = draft, то есть операторской сверки не было.
--   Перепроверить при первом же прогоне с доступом в сеть.
