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
