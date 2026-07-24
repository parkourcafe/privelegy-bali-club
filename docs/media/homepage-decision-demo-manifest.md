# Homepage DecisionDemo — media and implementation manifest

Date: 2026-07-24  
Branch: `visual/canggu-decision-pilot`  
Route: `/`

## Discovery note

The current homepage hero is full-bleed media, but a large opaque decision card covers a substantial part of the desktop first viewport. The `Choose by moment` cards devote less than half their height to media and then repeat title, body and CTA in a large white text panel. This makes the page feel like a directory before it feels like a premium visual decision product.

The next slice is limited to the homepage hero/DecisionDemo and `Choose by moment` presentation. It does not change URL structure, canonical metadata, required homepage links, ranking, booking, data models or factual place media.

## Approved visual rule

For every media-led component:

```text
minimum: 70% media / 30% text and controls
preferred: 80% media / 20% text and controls
```

This is a component-level rule, not a requirement to add decorative media to forms, legal pages or data-heavy functional surfaces.

## Media truth boundary

All assets in this manifest are `AI_ILLUSTRATIVE_ALLOWED` scenario media. They must not be presented as documentary evidence of a named place, district, venue, road, menu, room, facility or transport condition.

Public UI disclosure: `Illustrative scenario`.

Named place and district proof remains `REAL_MEDIA_REQUIRED`; when unavailable the existing `Media pending` state remains.

## DecisionDemo concept

The first viewport should communicate:

```text
traveller situation → one useful route/guide → why it fits → next action
```

The visual remains dominant. Text is limited to one short headline, one supporting line and one primary action. The opaque desktop card is replaced by a lighter decision overlay that preserves at least 70% visible scene area.

## Pilot asset set

| ID | Target | Purpose | Class | Aspect | Content restriction | Status |
|---|---|---|---|---|---|---|
| `home-first-day` | `/` moment card | Low-friction arrival scenario | AI illustrative | 4:5 | No real venue, airport, hotel or landmark | approved pilot |
| `home-sunset` | `/` moment card | Choose a sunset mood before golden hour | AI illustrative | 4:5 | No named beach or documentary coast claim | approved pilot |
| `home-with-kids` | `/` moment card | Calm family day with low friction | AI illustrative | 4:5 | No identifiable child, venue or facility claim | approved pilot |
| `home-rainy-day` | `/` moment card | Covered-plan decision when weather turns | AI illustrative | 4:5 | No live weather or real location implication | approved pilot |
| `home-romantic` | `/` moment card | Quiet route for two | AI illustrative | 4:5 | No named restaurant, villa or beach | approved pilot |
| `home-trip-lengths` | `/` moment card | Visual planning across three, five or seven days | AI illustrative | 4:5 | Abstract route/planning scene only | approved pilot |

## Shared art direction

Premium editorial travel collage rather than documentary photography:

- restrained warm sand, deep lagoon, oxidized coral and ink palette;
- analog film grain, paper texture and subtle route-line graphics;
- one clear subject and generous negative space;
- no text baked into the asset;
- no logos, watermarks, branded products or identifiable businesses;
- no copied landmark composition;
- consistent grade across all six assets;
- mobile-safe central subject and edge-safe crop.

## Web delivery targets

- Source generation: portrait `4:5`, high-quality still.
- Shipped format: optimized WebP or AVIF.
- Target width: 1200–1600 px.
- Target weight: preferably under 180 KB per card after visual review.
- `next/image` with explicit responsive `sizes`.
- Decorative/illustrative alt handling must not repeat visible card text.
- No video added to the moment grid in this slice; the existing gated hero loop remains the motion layer.

## Generation and delivery record

- Requested Higgsfield model: `nano_banana_pro`; completed jobs report the backend model status as `nano_banana_2`.
- Generated: 2026-07-24.
- Cost: 12 credits total; balance moved from 728.41 to 716.41.
- Six source PNGs were visually reviewed for text, logos, identifiable faces, place claims and crop safety.
- Six approved files are reproduced by the prebuild media pipeline as 1440 × 1788 WebP at quality 72 with encoder effort 6.
- Final file sizes: 72,658–140,820 bytes; every card asset is under the 180 KB target.
- Exact prompts and job IDs are recorded in `docs/media/higgsfield-homepage-batch.json`. Ephemeral source URLs are intentionally omitted because their CDN paths contain an account-scoped segment.

## Implemented ratio evidence

Runtime DOM measurements on desktop (360 × 450 px cards) and mobile (350 × 438 px cards) report a 20% text-overlay region and an 80% media region for all six cards. The image remains full-card media underneath the gradient; the measured overlay footprint is used as the conservative ratio.

## Acceptance checks

- Homepage hero purpose and primary action remain understandable in 5–10 seconds.
- Media occupies at least 70% of every moment card, with 80/20 as the target.
- The first viewport does not become an opaque two-column text layout.
- Every required homepage link remains present and keyboard accessible.
- `Illustrative scenario` is visible without dominating the composition.
- Mobile 390 px crop keeps the subject and CTA usable.
- Reduced-motion and Save-Data behaviour of the hero loop remains unchanged.
- No generated asset is used as factual place proof.
