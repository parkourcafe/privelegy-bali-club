# Other Bali messaging release handoff — 2026-07-30

Status: code and local preview verified; not deployed; not submitted to stores.

## Release source

- Repository: `parkourcafe/privelegy-bali-club`
- Branch: `codex/discover-bali-messaging-20260730`
- Baseline: `64818bebe180cfa5204fe6e8378b6b75f9de05a0`
- Target identity: `com.otherbali.app`
- Target versions: iOS `1.0 (5)`; Android `1.0.0 (4)`

## Implemented

- Canonical product promise: `The right place for the moment you’re in.`
- Campaign line: `Discover Bali together.`
- Product proof: `Resident-curated places, routes and plans for every Bali moment.`
- Outcome: `Less searching. More Bali.`
- Homepage, mobile shell, metadata, social graphic, PWA manifest, footer and
  store-copy draft use the same hierarchy.
- `/together` now describes choosing and sharing with existing travel
  companions. It no longer promises friend discovery, people search, voting,
  universal booking, generated `/r/...` links or fake copy/share states.
- `/together` sends an unselected visitor to the real `/places` catalogue and
  shows canonical public place-page sharing.
- `/plan/shared` is described as a bounded starting point rather than a stored
  itinerary, live booking surface or live inventory.
- Google Play feature graphic is regenerated at `1024 x 500`, opaque RGB.
- Store metadata is aligned to the current mobile feature set and the current
  iOS/Android release contract.

## Verification

- `npm test`: PASS — 324 tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS with one pre-existing
  `@next/next/no-img-element` warning in the partner photo-review panel.
- `next build`: PASS — 153 static pages generated.
- `npm run store:assets:verify`: PASS.
- Local visual smoke at desktop and `390 x 844`: PASS for `/`, `/together` and
  `/plan/shared`; no horizontal overflow, broken images or browser errors.
- Messaging regression tests reject the removed friend-discovery, fake-link,
  collaborative-choice and live-booking claims.

## Deliberate NO-GO gates

- `npm run store:package:verify`: expected FAIL because the iPhone and Android
  screenshot evidence belongs to the previous app build/source.
- Existing screenshots remain `stale`; do not upload them.
- No current signed IPA/AAB/APK has been produced from this source.
- No physical iPhone or Samsung device evidence has been collected for this
  source.
- Current live events feed was observed empty during the audit; do not capture
  a populated `What's On` screenshot unless real active events are published.
- Owner/legal fields in `store-assets/package-manifest.json` remain pending.

## Next safe sequence

1. Review the branch preview.
2. Obtain explicit approval before production merge/deployment.
3. Build the signed IPA, Play AAB and RuStore APK from one clean commit.
4. Clean-install and test those exact artifacts on physical iPhone and Samsung.
5. Recapture both screenshot sets and bind them to the new source/artifact
   evidence.
6. Complete owner/legal/privacy declarations.
7. Obtain separate action-time approval before any store metadata save,
   reviewer reply, submission or publication.
