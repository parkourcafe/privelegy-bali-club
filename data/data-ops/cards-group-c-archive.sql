-- Группа C: 3 карточки без показов, без кликов и без ссылок из гидов.
-- Описание у всех — шаблонная строка «verified … venue», собственного
-- содержания нет, и никто на них не приходит.
--
-- Снимаем с публикации, а НЕ удаляем: удаление порвёт внешние ссылки и
-- потеряет данные заведения.
--
-- Почему именно 'review', а не 'archived': миграция 0018 ограничивает
-- venues.publication_status значениями ('published','review') — другого
-- значения база не примет. По замыслу схемы 'review' и означает
-- «внутренний, не индексируется»: публичные чтения требуют
-- status='active' AND publication_status='published', поэтому страница
-- перестаёт отдаваться сразу. Вернуть на сайт можно тем же запросом
-- наоборот, когда у карточки появится настоящее описание.

update venues
set publication_status = 'review',
    editorial_status   = 'review'
where slug in (
  'kowhai-restaurant-at-maua-nusa-penida',
  'waka-bar-and-restaurant-wakagangga-boutique-resort',
  'warnakali-restaurant-at-adiwana-warnakali-resort'
)
and publication_status = 'published';

-- проверка: три строки, все в review
select slug, name, district, publication_status
from venues
where slug in (
  'kowhai-restaurant-at-maua-nusa-penida',
  'waka-bar-and-restaurant-wakagangga-boutique-resort',
  'warnakali-restaurant-at-adiwana-warnakali-resort'
);
