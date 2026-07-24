# `/plan` route cards — media and implementation manifest

Date: 2026-07-25

Branch: `visual/plan-route-hierarchy`

Route: `/plan`

## Discovery note

The production page rendered published routes as equal-weight text links beneath one large generic section image. Travellers could not scan the difference between an Ubud culture day, a Bangli village day, a Canggu rainy day or a café-and-work route. On mobile the legacy route strip also became a horizontally scrolling list.

This slice changes presentation only. Published `Route` records remain the source of titles, subtitles, districts and stop counts. There are no schema, ranking, booking, route-stop, factual-content or canonical metadata changes.

## Choice hierarchy

The page now presents decisions in this order:

```text
trip length / base → Bali-wide day routes → Canggu practical routes → route detail
```

Each route remains one organic, unpaid choice. District and partner status do not alter order.

## Media truth boundary

All assets below are `AI_ILLUSTRATIVE_ALLOWED` composite planning scenes. They are not documentary records of the route, district, temple, venue, artisan, menu, road, weather or transport conditions and **must not be used as factual place proof**.

Public UI disclosure: `Illustrative route`.

The scenes use empty decorative alt text because the visible card title and metadata already name the destination. Named-place and venue proof remains `REAL_MEDIA_REQUIRED`.

## Approved route asset set

| ID | Route slug | Purpose | Class | Aspect | Content restriction | Status |
|---|---|---|---|---|---|---|
| `plan-route-first-day` | `first-day` | Low-friction arrival and settling-in route | AI illustrative | 4:3 | No real hotel, villa, airport or venue | approved |
| `plan-route-ubud-culture` | `ubud-culture-day` | Generic Ubud culture atmosphere | AI illustrative | 4:3 | No named temple, ceremony or waterfall claim | approved |
| `plan-route-bangli-temple-village` | `bangli-temple-village-day` | Highland village and gateway atmosphere | AI illustrative | 4:3 | No exact temple or village claim | approved |
| `plan-route-east-bali-heritage` | `east-bali-heritage-day` | Generic weaving and East Bali landscape | AI illustrative | 4:3 | No named artisan, product or workshop claim | approved |
| `plan-route-canggu-food` | `canggu-food-route` | Fictional café-to-dinner food day | AI illustrative | 4:3 | No restaurant, menu or dish provenance claim | approved |
| `plan-route-canggu-rain` | `canggu-rainy-day` | Sheltered monsoon-day planning scenario | AI illustrative | 4:3 | No live weather or real café implication | approved |
| `plan-route-cafe-work` | `cafe-work` | Fictional tropical café work session | AI illustrative | 4:3 | No coworking/café identity or connectivity claim | approved |
| `plan-route-sunset-run` | `sunset-run` | Sunset-to-evening route mood | AI illustrative | 4:3 | No named beach, restaurant or nightlife venue | approved |

## Shared art direction

- premium photorealistic Bali travel editorial stills;
- restrained warm sand, deep tropical green and ocean tones;
- one clear route scenario per frame;
- calm, slightly darker lower third for the card copy;
- no baked text, labels, logos, watermarks or branded products;
- no identifiable business, named venue or copied landmark composition;
- people shown from behind or in non-identifying profile;
- consistent 4:3 crop with mobile-safe central subjects.

## Generation and delivery record

- The original route source set remains historical but was not shipped: commit `81e99b1` pinned corrupt 60 KB WebPs and simultaneously removed the route hierarchy that consumed them.
- Recovery model: Higgsfield `gpt_image_2`; generated 2026-07-24 UTC.
- Five route-specific source PNGs plus three reviewed homepage scenarios provide the eight route cards. Reuse is limited to exact semantic matches: first day, rainy day and sunset.
- All unique frames were visually reviewed for route relevance, Bali specificity, anatomy, text/logos, identifiable businesses, false named-place implication and overlay crop safety.
- Shipped assets are 1200 × 896 WebP at quality 72 with encoder effort 6; all passed Sharp decoder metadata checks.
- Final weights are 75,924–135,300 bytes per image.
- Exact source filenames and reuse mappings are recorded in `docs/media/higgsfield-plan-route-batch.json` and `docs/media/higgsfield-site-readiness-recovery-batch.json`.
- `scripts/fetch-scenes.mjs` reproduces any missing WebP from the reviewed source filenames; fetch failure remains non-blocking and falls back to the existing generated SVG art.

## Acceptance checks

- Generic section banners above trip starters and ready-made routes are removed.
- Published routes are grouped into Bali-wide and Canggu practical choices.
- Every current route has a distinct thematic image and a safe district fallback for future routes.
- Every card displays district, title, optional route result, stop count and `Open route`.
- `Illustrative route` is visible on every generated card.
- Route choices use a responsive grid and do not rely on hidden horizontal scrolling.
- Whole-card links remain keyboard focusable and mobile action height remains at least 44 px.
- No generated asset is used as factual place proof.

## Rendered QA record

- Desktop development preview: all eight images loaded; 3-column groups, crops, overlay contrast, title wrapping, stop counts, disclosures and CTAs passed visual review.
- Mobile Chrome at 390 × 844: `clientWidth = 390`, `scrollWidth = 390`; both grids resolved to one 358 px column with `overflow-x: visible`.
- All eight mobile cards measured 358 × 269 px; copy overflow was false and each metadata/CTA row measured 44 px.
- A normal viewport captured at the absolute page bottom confirmed the final rainy-day title, summary, stop count and CTA remain fully above the fixed navigation.
