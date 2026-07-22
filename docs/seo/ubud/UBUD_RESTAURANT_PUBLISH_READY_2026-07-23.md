# Ubud restaurant publication readiness — 2026-07-23

Это технический handoff, а не публикация. В него попадают только записи, где официальный сайт дал адрес/часы и существует отдельная Maps-поисковая ссылка. Перед SQL/import всё равно требуется проверить конкретный Maps entity и отсутствие дубля в `venues`.

## Уже существующие карточки — не создавать дубликаты

В repository/page registry уже присутствуют: `/places/casa-luna`, `/places/hujan-locale`, `/places/locavore-nxt`, `/places/mozaic` и `/places/sayuri-healing-food`. Для них нужен UPDATE/evidence refresh, а не новый Ubud slug.

## Предварительно publish-ready (после Maps entity check)

- Nusantara by Locavore — `/places/nusantara-by-locavore-ubud`
- Akar Ubud — `/places/akar-ubud`
- Mori Ubud — `/places/mori-ubud`
- Room 4 Dessert — `/places/room-4-dessert-ubud`
- Moksa — `/places/moksa-ubud`
- Herb Library — `/places/herb-library-ubud`
- Wild Vegan — `/places/wild-vegan-ubud`
- Bella by Sage — `/places/bella-by-sage-ubud`
- Flourish — `/places/flourish-ubud`
- Warung Semesta — `/places/warung-semesta-ubud`
- Bebek Tepi Sawah — `/places/bebek-tepi-sawah-ubud`
- Pica South American Kitchen — `/places/pica-south-american-kitchen-ubud`
- Clear Café — `/places/clear-cafe-ubud`

## Не допускать к публикации сейчас

- Bridges Bali — `REJECT` (current listing marked closed).
- Kubu at Mandapa — hotel-access confirmation required.
- Swept Away at The Samaya — hotel-access confirmation required.
- Sari Organik — current official status required.
- Nasi Ayam Kedewatan Ibu Mangku — field/owner verification required.
- Warung Babi Guling Ibu Oka — exact operating entity and field verification required.
- Apéritif, Locavore NXT, Rayjin, Shichirin, Kojin, Dumbo, Juna — at least one location/status gate remains open.

## Import gate

No record in this file should be inserted as `publication_status = 'published'` until a concrete Maps entity URL, duplicate check, editorial fields (`why_its_here`, `best_for`, `not_for`, `what_to_order`) and photo/license decision are recorded.
