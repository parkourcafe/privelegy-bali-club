-- Часы работы, партия 1 — 29 записей, прошедшие проверку.
--
-- Источник: прогон агента сбора (HOURS_CANDIDATES_QA.csv, 2026-08-04).
-- Агент пометил 33 строки как ready; после построчной сверки четыре из них
-- сюда НЕ вошли — причины в конце файла. Остальные проверены: полная неделя,
-- официальный источник заведения, правдоподобное окно работы.

update venues as v set opening_hours = d.hours, last_verified_at = '2026-08-04'
from (values
  ('seniman-coffee-studio','Mo-Su 07:30-22:00'),
  ('karsa-spa','Mo-Su 09:00-19:00'),
  ('jungle-padel-canggu','Mo-Su 07:00-23:59'),
  ('jungle-padel-canggu-shortcut','Mo-Su 07:00-23:59'),
  ('zin-cafe-canggu','Mo-Su 06:30-23:59'),
  ('crate-cafe','Mo-Su 07:00-23:00'),
  ('saya-club','Mo-Su 06:00-22:00'),
  ('face-therapy-spa-pererenan','Mo-Su 08:00-22:00'),
  ('amo-spa-canggu-canggu','Mo-Su 08:00-22:00'),
  ('the-avocado-factory','Mo-Su 07:00-23:00'),
  ('tis-cafe-ubud','Mo-Su 08:00-23:00'),
  ('woods-bali','Mo-Su 08:00-23:00'),
  ('ely-s-kitchen-ubud','Mo-Su 07:00-23:00'),
  ('black-garlic-ubud','Mo-Su 07:00-23:00'),
  ('enclave-ubud-at-plataran-ubud','Mo-Su 11:00-23:30'),
  ('french-kiss-restaurant','Mo-Su 07:00-23:00'),
  ('kemangi-ubud-resto-at-adiwana-svarga-loka','Mo-Su 07:00-22:00'),
  ('kunang-kunang-restaurant-at-the-sun-of-granary-resort-and-villas','Mo-Su 07:00-23:00'),
  ('ngajeng-restaurant','Mo-Su 07:00-22:00'),
  ('tablespoon-ubud-at-adiwana-suweta','Mo-Su 07:00-23:00'),
  ('uname-ubud-by-pramana','Mo-Su 07:00-21:30'),
  ('juggan-sky','Mo-Su 12:00-23:00'),
  ('shrida','Mo-Su 07:00-22:00'),
  ('alma-tapas-bar','Mo-Su 15:00-22:30'),
  ('one-eyed-jack','Mo-Su 15:00-22:30'),
  ('estetica-belle','Mo-Su 10:00-18:00'),
  ('only-nails-pererenan','Mo-Su 10:00-19:30'),
  ('espace-spa-canggu-canggu','Mo-Su 10:00-21:00'),
  ('brother-gym','Mo-Su 06:30-22:00')
) as d(slug, hours)
where v.slug = d.slug
  and v.status = 'active'
  and v.publication_status = 'published';

-- проверка: должно обновиться 29 строк
select count(*) from venues
where last_verified_at = '2026-08-04' and opening_hours is not null;


-- ── ОТКЛОНЕНО, хотя агент пометил «ready» ─────────────────────────────
--
-- ecosfera-yoga-canggu-canggu   «Mo-Su 14:00-23:59»
-- green-spot-cafe               «Mo-Su 14:00-23:59»
--   Оба взяты с hotels.cloudbeds.com/reservation/2zHyUw — это движок
--   бронирования отеля, а не страница заведения. 14:00 — это время
--   заселения, что подтверждает примечание самого агента: «Check-Out
--   Time - 12:00. Late Check-Out from 12:00 - 18:00…». Часы заселения
--   в отель записаны как часы работы кафе и йога-студии.
--
-- motion-cafe                   «Mo-Su 09:30-12:00»
--   Кафе, работающее два с половиной часа в день, неправдоподобно.
--   Примечание агента — «дополнительные расписания отдельных дней
--   исключены как события или сервисные часы» — говорит, что он взял
--   фрагмент расписания, а не часы работы.
--
-- ── ВЗЯТО С ОГОВОРКОЙ ─────────────────────────────────────────────────
-- brother-gym: источник brother-gym-canggu.pages.dev — это страница-
--   заглушка, а не полноценный сайт. Часы правдоподобны (06:30-22:00
--   для зала), поэтому записаны, но при случае стоит перепроверить.
--
-- face-therapy-spa-pererenan: источник linktr.ee, помечен агентом как
--   official_website. Это агрегатор ссылок, а не сайт; часы оттуда
--   допустимы, но source_type указан неверно.
