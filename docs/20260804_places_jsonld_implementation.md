# Реализация ТЗ: показать уже собранные данные заведений

```yaml
дата: 2026-08-04
исходное_тз: 20260804__templatespec.md
репозиторий: privelegy-bali-club
базовый_commit: 2ab0a53
статус: implemented_and_locally_verified
production_deploy: not_performed
```

## Что обнаружено при сверке

ТЗ частично описывало состояние до commit `2ab0a53`: поля
`opening_hours_json` и `opening_hours` уже входили в публичную выборку, а
`schemaOpeningHours` уже безопасно нормализовал часы в schema.org-строку.
Хардкод `SCHEMA_HOURS` всё ещё существовал на странице и удалён.

## Реализовано

- В `PUBLIC_PLACES_VENUE_COLUMNS` добавлены `latitude`, `longitude`, `phone`,
  `full_address`, `price_min_idr`, `price_max_idr`, `price_text` и
  `google_place_id`.
- Поля добавлены в доменный `Venue` и маппинг snake_case → camelCase.
- Координаты проверяются на числовой тип, finite и WGS84-диапазоны перед
  публикацией `GeoCoordinates`.
- Полный адрес предпочитается короткому редакционному адресу.
- Телефон публикуется только при непустом значении.
- В JSON-LD публикуется только уже разрешённый `venue.photoUrl`; сырое
  `photo_url` не используется.
- `opening_hours_json` преобразуется в `openingHoursSpecification`.
- Каждая смена одного дня становится отдельным объектом спецификации.
- Некорректные интервалы и неизвестные значения не публикуются.
- Удалён `SCHEMA_HOURS`; для строгого legacy schema.org-значения сохранён
  совместимый fallback `openingHours`.

## Осознанно не реализовано

`aggregateRating`, `google_rating` и `google_reviews` не подключены. Это
противоречит действующему guardrail проекта: Google ratings и review product
не публикуются. Boundary-тест дополнительно запрещает `aggregateRating`.

## Проверка

```text
node --import tsx --test lib/opening-hours.test.ts scripts/publication-boundary.test.mjs
12 tests passed

npm run typecheck
passed
```

Добавлены проверки двухсменного расписания, malformed/empty часов, наличия
geo/telephone/image/openingHoursSpecification и отсутствия рейтингов и
захардкоженных часов.

## Осталось перед production

1. Получить preview deployment ветки.
2. Проверить 2–3 карточки с координатами, телефоном, фото и двумя сменами.
3. Провалидировать JSON-LD через Schema Markup Validator / Rich Results Test.
4. Только после QA объединить ветку и выполнить production deploy.
