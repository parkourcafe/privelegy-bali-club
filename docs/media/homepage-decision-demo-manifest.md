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
| `home-bali-first-day` | `/` moment card | Low-friction arrival scenario | AI illustrative | 4:3 source → 4:5 card crop | No real venue, airport, hotel or landmark | approved Bali replacement |
| `home-bali-sunset` | `/` moment card | Choose a sunset mood before golden hour | AI illustrative | 4:3 source → 4:5 card crop | No named beach or documentary coast claim | approved Bali replacement |
| `home-bali-with-kids` | `/` moment card | Calm family day with low friction | AI illustrative | 4:3 source → 4:5 card crop | No identifiable venue or facility claim | approved Bali replacement |
| `home-bali-rainy-day` | `/` moment card | Covered-plan decision when weather turns | AI illustrative | 4:3 source → 4:5 card crop | No live weather or real location implication | approved Bali replacement |
| `home-bali-romantic` | `/` moment card | Quiet route for two | AI illustrative | 4:3 source → 4:5 card crop | No named restaurant, villa or beach | approved Bali replacement |
| `home-bali-trip-lengths` | `/` moment card | Visual planning across three, five or seven days | AI illustrative | 4:3 source → 4:5 card crop | Illustrative planning map; not navigation | approved Bali replacement |

## Shared art direction

Premium Bali-specific editorial scenario imagery rather than documentary place proof:

- realistic editorial lighting with restrained warm, deep green and ocean tones;
- subtle analog film grain and calm premium travel-magazine grade;
- one clear scenario and a dark, visually quiet lower overlay zone;
- no text baked into the asset;
- no logos, watermarks, branded products or identifiable businesses;
- no named venue or copied venue/landmark composition;
- consistent grade across all six assets;
- mobile-safe central subject and edge-safe crop.

## Web delivery targets

- Source generation: landscape `4:3`, high-quality still; responsive `object-fit: cover` supplies the reviewed portrait `4:5` card crop.
- Shipped format: optimized WebP or AVIF.
- Target width: 1200 px for the current card slots.
- Target weight: preferably under 180 KB per card after visual review.
- `next/image` with explicit responsive `sizes`.
- Decorative/illustrative alt handling must not repeat visible card text.
- No video added to the moment grid in this slice; the existing gated hero loop remains the motion layer.

## Generation and delivery record

- The original Nano Banana collage pilot remains recorded in `docs/media/higgsfield-homepage-batch.json` for audit history.
- The first Bali replacement batch remains in `docs/media/higgsfield-homepage-bali-batch.json` as audit history, but is marked superseded: its pinned 60 KB WebPs failed decoding and returned HTTP 400 through `next/image` after deployment.
- Site-readiness recovery model: Higgsfield `gpt_image_2`, generated 2026-07-24 UTC. One black first-day frame was rejected and regenerated.
- Six approved source PNGs were visually reviewed together and individually for Bali specificity, scenario clarity, text, logos, identifiable businesses, factual-place claims, anatomy and crop safety.
- Six shipped files are 1200 × 896 WebP at quality 72 with encoder effort 6; all passed Sharp decoder metadata checks.
- Final homepage file sizes are 42,346–124,866 bytes.
- Exact reviewed source filenames, the rejected frame and delivery mappings are recorded in `docs/media/higgsfield-site-readiness-recovery-batch.json`. Ephemeral source URLs are intentionally omitted because their CDN paths contain an account-scoped segment.

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
