# /together — медиа-ассеты (Higgsfield)

Сгенерировано 2026-07-28. Модели: `nano_banana_pro` (2k) для фото, `kling3_0` (pro, sound off) для видео.

## Единый арт-дирекшн

Все кадры сняты в одном ключе, чтобы набор читался как одна серия:

- палитра привязана к токенам продукта — lagoon `#005962`, paper `#FAF6EF`, espresso `#2B1A13`, terracotta `#C4623F`, sand `#F6C688`;
- documentary editorial, не сток: мягкий свет, малая ГРИП, лёгкое зерно, «неприбранная» естественная сервировка;
- люди не идентифицируются — только руки, силуэты вне фокуса или пустой кадр;
- сквозной смысловой мотив — **одно свободное место за столом**.

## Соответствие слотам дизайн-канвы

| Файл в `public/scenes/` | Слот в канве | Что на кадре | Формат |
|---|---|---|---|
| `moment-dinner.webp` | `tog-hero` (desktop), п.3 задания | Стол на шестерых в сумерках, одно свободное место | 16:9, 2752×1536 |
| `moment-dinner-portrait.webp` | `tog-m-hero` (390px) | Тот же сюжет вертикально, низ кадра затемнён под заголовок | 9:16, 1536×2752 |
| `together-step-find.webp` | `tog-step-1`, `tog-m-step-1` | Кофе на мраморном столике, утренний свет | 16:9 |
| `together-step-send.webp` | `tog-step-2`, `tog-m-step-2`, `tog-m-act-1` | Рука с телефоном, экран без читаемого UI | 16:9 |
| `together-step-decide.webp` | `tog-step-3`, `tog-m-step-3` | Два кофе, телефон экраном вниз, руки двоих | 16:9 |
| `together-step-plan.webp` | `tog-step-4`, `tog-m-step-4` | Стол на четверых, золотой час | 16:9 |
| `together-dusk-wash.webp` | `tog-trust`, `tog-m-trust` | Абстрактная заливка сумерек под `opacity:.16` | 21:9, 3168×1344 |
| `together-shortlist-three.webp` | `tog-stage-2`, `tog-m-act-2` | Ровно три блюда сверху — «выбор из трёх» | 16:9 |
| `together-open-seat.webp` | `tog-stage-3`, `tog-m-stage-3` | Золотой час, одно свободное кресло | 16:9 |
| `together-scooters-golden.webp` | `tog-m-act-3` | Два скутера на переулке, золотой час | 16:9 |
| `together-hero-loop.mp4` | `tog-hero`, `tog-film` | 10s немой loop из `moment-dinner` | 1920×1080 |
| `together-hero-loop-portrait.mp4` | `tog-m-hero`, `tog-m-film` | 10s немой loop из портретного кадра | 1080×1920 |

`tog-stage-1` («One table, one find») закрывается повтором `together-step-find.webp`.

## Слоты, куда AI-графику ставить НЕЛЬЗЯ

По AGENTS.md §13 и правилу «fallback art must not be presented as venue photography»
эти четыре слота обязаны рендериться из опубликованных данных заведения:

- `tog-place-card` — «Published place cover — real data at runtime»
- `tog-recipient` — «Canonical place page hero — published data»
- `tog-m-place`
- `tog-m-recipient`

Сгенерированные кадры туда не подставлять ни как заглушку, ни как fallback.

## Условия использования

Кадры атмосферные и обобщённые: без вывесок, логотипов, читаемого текста,
номерных знаков и узнаваемых заведений. Это исключает риск выдать их за
фотографию конкретного партнёра. Ни один кадр не является доказательством
факта о заведении и не может использоваться в блоках, где нужен verified source.

## Видео

Оба ролика — `sound: off`, 10 секунд, один непрерывный план без склеек:
дрожание свечей, лёгкое движение листвы, едва заметный наезд камеры.
Под требование канвы «6–10s loop · muted».

Для вставки: `autoplay muted loop playsinline` + `poster` из соответствующего
статичного кадра, и обязательный `prefers-reduced-motion` фолбэк на статику —
п.13 задания требует reduced motion в QA.
