# Other Bali — Photo Policy v3: Interim Pre-Launch Owner Preview

Версия: 3.0  
Статус: temporary product-owner override  
Дата решения: 2026-07-20  
Действует до: formal tourist public launch или отдельной отмены владельцем продукта

---

## 1. Причина изменения

На текущем pre-launch этапе основной реальный зритель Other Bali — владелец или команда заведения, отеля, резорта или виллы, которым показывают уже подготовленную страницу.

Визуально пустая карточка или пустой hero ослабляет pitch и создаёт неверное впечатление, что страница не готова. Поэтому прежнее правило «не показывать никакое venue imagery до owner approval» временно уточняется.

Это официальное изменение продуктовой политики. Оно не является разрешением публиковать любые найденные изображения без контроля.

---

## 2. Новое правило

Во время interim pre-launch каждая owner-facing карточка и detail preview должна иметь визуальный слой.

Допустимые состояния:

1. `owner_approved` — фотография загружена/подтверждена владельцем или командой venue.
2. `editorial_licensed` — фотография принадлежит Other Bali или имеется подтверждённое право использования.
3. `official_provisional_preview` — временное изображение из подтверждённого официального источника, используемое только в контролируемом owner-preview режиме до approve/replace/remove.
4. `designed_fallback` — качественный branded/category/district visual, который не изображает конкретное venue и не выдаётся за его реальную фотографию.
5. `revoked` — фотография запрещена/отозвана и немедленно заменяется fallback.

Ни одна карточка не должна рендериться как пустой белый/серый media box.

---

## 3. Приоритет выбора изображения

```text
owner_approved
→ editorial_licensed
→ official_provisional_preview (только разрешённая preview surface)
→ designed_fallback
```

`revoked`, invalid, expired или missing image никогда не выбирается.

Если загрузка изображения не удалась, UI должен бесшовно переключиться на `designed_fallback` без layout shift и broken-image icon.

---

## 4. Official provisional preview

Временное официальное изображение допустимо только если:

- подтверждено, что источник принадлежит самому venue/hotel/resort/villa;
- сохранены `source_url`, `source_type`, `captured_at` и имя проверившего оператора;
- изображение не берётся из Google Reviews, TripAdvisor, блогов, агрегаторов или чужого social account;
- оно имеет статус `official_provisional_preview`;
- оно не используется в Open Graph, sitemap, JSON-LD image или public feed как approved asset;
- owner может одним действием approve, replace или remove;
- после revoke/expiry система возвращает безопасный fallback.

Предпочтительная поверхность — token-scoped partner/onboarding preview с `noindex,nofollow`, отсутствующая в sitemap.

Если изображение показывается на открытой pre-launch странице, оно должно быть явно отделено от approved public assets в данных и автоматически исключаться при переключении продукта в tourist-launch mode.

---

## 5. Механика approve / replace / remove

Owner-facing preview должен предлагать:

- `Approve this photo`;
- `Upload a better photo`;
- `Remove this photo`;
- короткое объяснение, где фотография будет использоваться.

### Approve

- записать identity/consent event;
- сохранить timestamp и actor;
- перевести image status в `owner_approved`;
- только после этого разрешить public card, detail hero, Open Graph и structured data use.

### Replace

- новая фотография проходит существующий private staging/operator review;
- старая provisional фотография остаётся audit record, но перестаёт рендериться;
- после approval новая становится `owner_approved`.

### Remove / Revoke

- немедленно перестать рендерить фотографию;
- перевести статус в `revoked`;
- показать `designed_fallback`;
- удалить public/cache derivatives в рамках существующей безопасной photo pipeline;
- сохранить минимальный audit record без повторного публичного использования.

---

## 6. Механика возврата фото

Система должна быть обратимой.

1. Не удалять предыдущую подтверждённую фотографию при временной смене отображения.
2. Хранить active image pointer отдельно от image records.
3. При revoke/expiry provisional image возвращать последний eligible `owner_approved` или `editorial_licensed` asset.
4. Если такого asset нет — возвращать `designed_fallback`.
5. После повторного owner approval можно снова активировать eligible image без ручного восстановления всей карточки.
6. Все transitions логируются: previous status, next status, actor, timestamp, reason.

---

## 7. Минимальная модель данных

```ts
type PhotoUsageStatus =
  | "owner_approved"
  | "editorial_licensed"
  | "official_provisional_preview"
  | "designed_fallback"
  | "revoked";

type VenuePhotoRecord = {
  id: string;
  venueSlug: string;
  sourceUrl?: string | null;
  sourceType: "owner_upload" | "editorial" | "official_website" | "official_instagram" | "generated_fallback";
  usageStatus: PhotoUsageStatus;
  previewOnly: boolean;
  capturedAt?: string | null;
  approvedAt?: string | null;
  approvedBy?: string | null;
  revokedAt?: string | null;
  expiresAt?: string | null;
  operatorNote?: string | null;
};
```

Исполнитель должен сначала проверить существующие photo staging, owner consent и operator review tables/contracts и расширить их минимально. Не создавать параллельную несовместимую photo system.

---

## 8. Public vs preview behavior

### Partner preview

- разрешён `official_provisional_preview`;
- `noindex,nofollow`;
- не входит в sitemap;
- нет JSON-LD/OG image из provisional asset;
- видны approve/replace/remove actions.

### Interim public pre-launch

- карточка всегда имеет visual;
- по умолчанию owner-approved/licensed asset, иначе designed fallback;
- provisional asset может быть включён только явным feature flag/product-owner override;
- provisional asset не становится silently approved;
- public page должна выдерживать мгновенное переключение на fallback.

### Tourist public launch

- `official_provisional_preview` полностью исключён из публичного рендера;
- допускаются только `owner_approved`, `editorial_licensed` и `designed_fallback`;
- launch checklist должен проверить отсутствие provisional assets на public surfaces.

---

## 9. Feature flags / configuration

Предпочтительно использовать явный mode, например:

```text
OTHER_BALI_AUDIENCE_MODE=owner_prelaunch | tourist_public
```

Требования:

- production default после tourist launch — `tourist_public`;
- отсутствие/невалидное значение fail-closed к безопасному public behavior;
- preview-only image нельзя открыть одной подменой client query parameter;
- решение о допустимости принимается server-side.

---

## 10. Запрещено

- выдавать generated/category art за реальную фотографию venue;
- использовать third-party review/aggregator photos как provisional official photo;
- автоматически считать official-source photo разрешённой навсегда;
- включать provisional image в OG/JSON-LD;
- оставлять broken/empty image box;
- обходить owner revoke;
- удалять audit history;
- применять новую схему к production без отдельного review миграций;
- ослаблять существующую private staging и consent механику.

---

## 11. Acceptance criteria

1. В owner pre-launch режиме нет пустых карточек или пустых hero.
2. Реальная фотография и designed fallback визуально/семантически не смешиваются.
3. У каждого provisional image есть официальный source record.
4. Owner может approve, replace или remove photo.
5. Remove/revoke немедленно возвращает eligible approved image или fallback.
6. Preview-only photo не попадает в sitemap, OG и JSON-LD.
7. Tourist public mode не показывает provisional assets.
8. Broken URL автоматически возвращает fallback.
9. Все status transitions имеют audit trail.
10. Новое правило документировано и покрыто тестами.

