# Other Bali — Visual Redesign Pilot Handoff

Date: 2026-07-24  
Branch: `visual/canggu-decision-pilot`  
Scope: first implementation slice from the public visual UX audit.

## Discovery

Read/checked:

- `AGENTS.md`
- `Other_Bali_Master_Architecture.md` V3.1 CORRECTED
- `CLAUDE.md`
- `package.json`
- local Next.js 16 image component docs after `npm install`: `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`
- public audit pack: `/Users/msnigmatullaeva/Documents/other-bali-public-site-audit/`
- current routes/components in scope:
  - `app/PlanView.tsx`
  - `app/plan/page.tsx`
  - `app/places/[slug]/page.tsx`
  - `components/PlaceCard.tsx`
  - `components/VenueCard.tsx`
  - `components/VenueImage.tsx`
  - `components/PlaceCover.tsx`
  - `components/GuideMedia.tsx`
  - `app/globals.css`

Missing source docs in repo:

- `OTHER_BALI_PUBLIC_EXPERIENCE_ARCHITECTURE_1.md`
- Data Dictionary / Taxonomy / Migration Map under those exact names

## Implemented slice

### `/plan` Canggu builder

Added a `result-triptych` decision-first summary inside `PlanView` before the long slot lists:

- one best fit per available daypart;
- backup chip when available;
- check/contrast chip when available;
- direct anchor to compare the full slot list.

This keeps the full list available but no longer makes it the first result state.

### Place cards

Added an explicit no-media disclosure over typographic fallback cards:

```text
Media pending · verified details below
```

This keeps placeholder/mood art honest and avoids implying factual venue proof.

### Place page template

For no-photo venue mastheads, added explicit disclosure:

```text
Media pending · verified details only
```

Moved `VenueActionBar` before the menu section so the page order becomes closer to:

```text
hero → save/add → quick decision/practical → action → menu/details
```

This reduces the “menu database first” issue on verified-menu place pages.

## Files changed

- `app/PlanView.tsx`
- `components/PlaceCard.tsx`
- `app/places/[slug]/page.tsx`
- `app/globals.css`
- `docs/visual-redesign-pilot-handoff.md`

## Verification run

```text
npm install
npm run typecheck
npm run lint
npm run build
npm run test:t0:unit
```

Results:

- `npm run typecheck` — PASS
- `npm run lint` — PASS with one pre-existing warning in `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx` about raw `<img>`
- `npm run build` — PASS
- `npm run test:t0:unit` — PASS, 48 tests

Local browser smoke:

- `npm run dev` started successfully on `http://localhost:3000`
- `/plan` rendered without console/build errors, but local dev lacks the production data needed to show Canggu result cards; it displayed the existing empty state (`Nothing matches that combo`). Production/preview data verification is still required.
- `/places/nude-berawa` returned local 404 because local data/env does not include production venue rows. Production/preview verification is still required.

## Remaining risks / next slice

1. Verify this branch against a Vercel preview with production-like data.
2. Add a true `DecisionDemo` to homepage hero.
3. Convert `/places` first result block into moment-first visual decision flow.
4. Convert `/canggu` fit/not-for and area table into visual components.
5. Add browser screenshot regression for:
   - `/plan`
   - `/places`
   - `/canggu`
   - one no-media place page
   - one verified-menu place page
6. Continue media provenance work separately; this slice does not add or replace factual media.

## Loop 2 — homepage 80/20 DecisionDemo

### What changed

- Removed the large opaque desktop decision card from the homepage hero so the first viewport remains media-dominant.
- Kept one concise hero headline, one supporting line and two existing actions over the scene.
- Rebuilt all six `Choose by moment` links as 4:5, full-media editorial cards.
- Measured the rendered bottom copy region at 20% of each card on desktop and 390 px mobile; the conservative media/text ratio is therefore exactly 80/20.
- Added a high-contrast `Illustrative scenario` disclosure to every generated scenario card and `Illustrative atmosphere` to the existing generated hero.
- Shortened supporting copy so every overlay remains one title plus one line.
- Added responsive `sizes` support to `SceneImage`; all six card images load lazily through `next/image` at the required responsive width.
- Generated six coherent editorial collage assets through the authenticated Higgsfield MCP. They are scenario illustrations, not factual venue or district media.
- Added the six source references to `scripts/fetch-scenes.mjs`; a clean prebuild reproduces the ignored WebP assets instead of relying on local untracked files.
- Updated the stale Wave 4 tagline assertion from `The right Bali...` to the canonical V3.1 promise `The right place...`.

### Media delivery

- Model requested: `nano_banana_pro`; completed jobs report backend status `nano_banana_2`.
- Cost: 12 credits; observed balance 728.41 → 716.41.
- Output: six 1440 × 1788 WebP files, quality 72, effort 6.
- File range: 72,658–140,820 bytes; every file is under the 180 KB target.
- Source PNGs were reviewed for text, logos, identifiable faces, real-place claims and crop safety.
- Prompts, job IDs, classification and delivery metadata are in `docs/media/higgsfield-homepage-batch.json`.
- Ephemeral source URLs are not committed because their CDN paths contain an account-scoped segment.

### Files added or changed in Loop 2

- `app/page.tsx`
- `components/landing/SceneImage.tsx`
- `lib/homepage.ts`
- `scripts/fetch-scenes.mjs`
- `scripts/wave4-homepage-boundary.test.mjs`
- `docs/media/homepage-decision-demo-manifest.md`
- `docs/media/higgsfield-homepage-batch.json`
- `docs/visual-redesign-pilot-handoff.md`

### Verification

- `npm run typecheck` — PASS.
- `npm run lint` — PASS with the same pre-existing raw `<img>` warning in `PhotoReviewPanel.tsx`; 0 errors.
- `npm run test:t0:unit` — PASS, 48 tests.
- `node --test scripts/wave1-home-boundary.test.mjs scripts/wave4-homepage-boundary.test.mjs` — PASS, 10 tests after correcting the stale canonical-tagline assertion.
- `npm run build` — PASS, 153 static pages generated.
- Clean `fetch-scenes.mjs` reproduction — PASS, six new homepage WebPs fetched and optimized.
- Desktop browser QA — PASS; 360 × 450 cards measure 80% media / 20% overlay.
- Mobile 390 × 844 QA — HTTP 200, no horizontal overflow; 350 × 438 cards measure 80% media / 20% overlay.
- Axe WCAG 2 A/AA/2.1 AA/2.2 AA — 0 automatic violations at 390 × 844 and 1440 × 900. Image/gradient contrast remains an automated incomplete; the new disclosures use an explicit dark 75–80% surface and white text, and bottom copy sits over a black 90% gradient.
- `next/image` runtime check — all six assets are lazy, use responsive `sizes`, have decorative empty alt text because visible link copy supplies the accessible name, and resolve to the 640 px candidate at the inspected viewport.

### Remaining risk / next visual slice

1. Vercel preview must confirm the clean prebuild downloads all six remote sources in the deployment network.
2. The rest of the homepage still mixes older low-media cards with the new premium DecisionDemo; address those sections incrementally rather than expanding this loop.
3. Continue `/places` and `/canggu` only with real approved factual media or the existing `Media pending` treatment.

## Loop 3 — Ready-made plans 80/20 correction

### What changed

- Replaced the `Ready-made Bali plans` cards' short image plus separate white copy panel, which rendered visually near 50/50.
- Each plan now uses one full-card illustrative route image with a compact bottom HTML overlay, one short supporting line and one 44 px arrow target.
- Added a high-contrast `Illustrative route` disclosure because these existing atmosphere assets are not factual route or venue proof.
- Shortened the five supporting lines before reducing type so the copy footprint remains consistent at narrow widths.

### Deterministic ratio and browser QA

- Desktop 1440 px: each plan card renders 536 × 402 px; copy region 80 px = 20%, conservative media share = 80%.
- Mobile 390 px: each plan card renders 350 × 438 px; copy region 80 px = 18%, conservative media share = 82%.
- Horizontal overflow at 390 px: 0 px.
- Desktop and mobile crops were visually reviewed; text, disclosure and arrow remain readable over the controlled bottom gradient.

### Verification

- `npm run typecheck` — PASS.
- `npm run lint` — PASS with 0 errors and the same pre-existing `PhotoReviewPanel.tsx` raw `<img>` warning.
- Homepage boundary tests — PASS, 10 tests.
- `npm run test:t0:unit` — PASS, 48 tests.
- `npm run build` — PASS, 153 static pages generated.
- Files changed: `app/page.tsx`, `lib/homepage.ts`, `docs/visual-redesign-pilot-handoff.md`.
- No URLs, canonical/indexability behaviour, data model, ranking or factual media were changed.

## Loop 4 — homepage tail media-ratio correction

### Trigger

- Founder screenshots showed two remaining split-card patterns after PR #204: the `Canggu deep guide` card and the three `Trust` principles still rendered near 50/50 media/copy.

### Changes

- Rebuilt the Canggu module as one full-width media card with a compact bottom overlay instead of a separate white copy panel.
- Preserved both Canggu destinations: the full card opens `/canggu`; the supporting text link opens `/canggu-first-day`.
- Kept the longer all-Bali availability qualification below the image rather than inside the media overlay.
- Added visible `Illustrative area` disclosure because `DistrictCover` uses generated atmospheric area media.
- Added an optional responsive `sizes` prop to `DistrictCover`; existing consumers keep the prior default while the new full-width card requests an appropriate source size.
- Rebuilt the three Trust principles as full-image cards with controlled bottom overlays and `Illustrative principle` disclosure.
- Shortened the principle labels to `Selected, not exhaustive`, `No paid ranking` and `Clear next steps`; updated the boundary-test assertion to the new canonical public wording.
- The shortlist panel remains a functional CTA module and was intentionally not forced into the media-card ratio rule.

### Deterministic ratio and browser QA

- Canggu desktop 1440 px: 1112 × 445 px card; copy region 85 px = 19%, conservative media share = 81%.
- Canggu mobile 390 px: 350 × 438 px card; copy region 85 px = 19%, conservative media share = 81%.
- Trust desktop 1440 px: each card 181 × 227 px; copy region 40 px = 18%, conservative media share = 82%.
- Trust mobile 390 px: each card 350 × 233 px; copy region 40 px = 17%, conservative media share = 83%.
- Horizontal overflow at 390 px: 0 px.
- Desktop/mobile crops, lazy-loaded media, disclosure labels, text contrast and CTA targets were visually reviewed.

### Verification

- `npm run typecheck` — PASS.
- `npm run lint` — PASS with 0 errors and the same pre-existing `PhotoReviewPanel.tsx` raw `<img>` warning.
- Homepage boundary tests — PASS, 10 tests.
- `npm run test:t0:unit` — PASS, 48 tests.
- `npm run build` — PASS, 153 static pages generated.
- Files changed: `app/page.tsx`, `components/landing/DistrictCover.tsx`, `lib/homepage.ts`, `scripts/wave1-home-boundary.test.mjs`, `docs/visual-redesign-pilot-handoff.md`.
- No routes, schema, ranking, public factual claims or media assets were added.
