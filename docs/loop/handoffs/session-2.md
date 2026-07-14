# Session 2 handoff

- Branch: `loop/02-menu-place-ui`
- Frozen baseline SHA: `1d77f1e`
- Environment metadata SHA: `51ab700`
- Implementation SHA: `eba6775`
- Status: complete

## Current-page audit (before implementation)

- Server inputs: `getVenueWithPerk`, `getPublishedVenues`, saved slugs, Uluwatu registry fallback, and publication/indexability helpers.
- Editorial masthead: approved photo when present; otherwise the existing category-tinted typographic treatment. Metadata, canonical, robots and LocalBusiness JSON-LD are server-rendered and must remain unchanged.
- Decision content: `Why it's here`, optional Uluwatu `What to expect`, and a flat `What to order` list from verified registry/editorial fields.
- Practical decision support: sticky desktop quick-read aside, verified hours/price/website/menu/Instagram/WhatsApp/Maps links, save control directly below the masthead.
- Action flows: current `ReserveButton`, official booking link, confirmed active-deep perk, tracked Maps/outbound links, and existing mobile `VenueActionBar` must remain intact.
- Trust/continuity: attributed owner voice, related Uluwatu guides, similar-place ranking, and verification note already exist.
- Responsive behaviour: single-column below 900px; sticky 320px aside at desktop; fixed 46px-target action bar below 900px; masthead contracts below 640px.
- Structured-menu gap: no menu repository is merged on this branch yet. The only public menu input is Uluwatu's verified official `menuUrl`. Frozen `MenuRecord` fixtures are development-only.

## Proposed component tree (recorded before editing)

```txt
VenuePage (server; metadata/indexability/JSON-LD preserved)
├─ Editorial masthead
├─ SaveButton (existing)
├─ Venue detail grid
│  ├─ Main
│  │  ├─ PlaceFitSummary (Why it fits / What to expect)
│  │  ├─ WhatToOrder (existing verified editorial list)
│  │  ├─ StructuredMenu
│  │  │  ├─ MenuHeader (title, version, source, verified/freshness line)
│  │  │  ├─ MenuSection[]
│  │  │  │  └─ MenuItem[] (optional price, restrained dietary/allergen tags,
│  │  │  │     partner recommendation, editorial pick/note, availability note)
│  │  │  ├─ OfficialMenuFallback
│  │  │  └─ MenuEmptyState / MenuStaleState
│  │  ├─ VenueActionIntegrationSlot (frozen VenueActionBarProps contract note;
│  │  │  current action components remain in place until Session 4 integration)
│  │  ├─ Confirmed offer (existing)
│  │  ├─ Owner voice (existing)
│  │  └─ Related guides / similar places / verification (existing)
│  └─ Quick-read and practical aside (existing)
└─ VenueActionBar (existing, unchanged)
```

## Scope delivered

- Added a server-rendered structured menu surface that consumes the frozen `MenuRecord` contract and sorts sections/items by their contract positions.
- Added explicit fresh, stale, unpublished, empty, and official-link fallback behaviour. Stale/unpublished records suppress item and price detail.
- Added restrained optional price, dietary, verified-allergen, availability, editorial-pick, editorial-note, and partner-recommendation treatments.
- Kept partner and Other Bali voices visually and verbally distinct, and added an explicit unknown-not-safe allergen rule in public copy.
- Preserved the existing metadata, canonical/robots, JSON-LD, publication gate, save, Maps, Reserve, perk/redeem and mobile action-bar paths.
- Added the frozen Session 3 seam using exactly `VenueActionBarProps`; it renders no public or competing action copy.
- Added a development-only fresh/stale fixture switch via `MENU_FIXTURE`; production never selects fixture content for rendering.

## Owned-file diff

- `app/places/[slug]/page.tsx`
- `app/globals.css` (narrow structured-menu and menu-state rules only)
- `components/menu/MenuItem.tsx`
- `components/menu/MenuSection.tsx`
- `components/menu/MenuStates.tsx`
- `components/menu/StructuredMenu.tsx`
- `components/menu/menu-model.ts`
- `components/place-detail/VenueActionIntegrationSlot.tsx`
- `docs/loop/handoffs/session-2.md`

## Decisions and architecture compliance

- Public UI remains English-only.
- Missing allergen data will be rendered as unknown, never as safe.
- Partner and Other Bali editorial voices will use distinct labels and visual treatments.
- No cart, checkout, availability, fulfilment, schema, data-repository or action-gateway work is in scope.
- Session 3 integration props are frozen as `VenueActionBarProps`; any mismatch becomes a contract request rather than an inferred change.

## Verification evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Focused tests | Pass | Contract-state checks performed through TypeScript plus browser assertions for fresh, stale and empty branches. |
| TypeScript | Pass | `tsc --noEmit` completed with no errors. |
| Lint | Pass | `npm run lint` completed with no warnings or errors. |
| Build | Pass | `npm run build` completed; all 27 static pages generated and `/places/[slug]` compiled. |
| Browser QA | Pass | Chrome at 320, 375, 430 and 1440 px: no horizontal overflow; fresh fixture showed source/freshness/section/item and hidden integration slot; stale fixture suppressed structured details; no-fixture branch showed the empty state. |

## Migrations, environment and founder steps

None expected; Session 2 does not own migrations.

## Contract requests and integration notes

- Session 1 repository output is not merged yet. Components consume the frozen contract and the official-menu fallback; development previews may import only `menu-action.fixtures.ts`.
- Session 3 should replace the documented integration slot during Session 4 integration using exactly `VenueActionBarProps`.

## Known limitations / blockers

- Structured menu production data is unavailable on this isolated branch until Session 1 integration.
- The existing fixed mobile Maps bar can visually pass over content while scrolling; this predates Session 2 and its action-flow component is outside this session's ownership.
- Production build needs network access for the project's existing Google Fonts and scene fetch prebuild step; the verified build completed with access enabled.
