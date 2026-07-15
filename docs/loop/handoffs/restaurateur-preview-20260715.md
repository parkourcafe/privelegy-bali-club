# Restaurateur production preview — 2026-07-15

## Corrected production baseline

- Branch: `loop/08-restaurateur-preview`.
- Baseline: production commit `1bdbe2420bf969bfa6e861add165607b93688aeb` from `claude/bali-tourism-platform-fhd0l9`.
- The baseline includes the premium venue redesign, all 15 Around Bali district mood images, the current island guide set, the branded favicon and the latest production build fix.
- The earlier `/developer/site` implementation based on the release-integration catalogue was rejected as a regression and replaced. It must not be shared with venues.

## Protected restaurateur experience

- `/developer/site` renders the actual current production landing page. A small non-blocking review control links to the photo-complete catalogue.
- `/developer/site/places` renders the actual production catalogue denominator: 440 live cards. Candidate photography is overlaid only where the private package has a matching venue.
- 299 live cards receive a prepared candidate cover; the other 141 retain their existing production photo or designed category art.
- The complete private package remains 814 review photos. Clicking a card redirects to the actual premium `/places/<slug>` page in protected `photo-review=1` mode.
- Protected venue pages preserve the production editorial copy, menus, action gateway, quick-read blocks and related content. The first candidate becomes the masthead image and every candidate is rendered in a review gallery.
- Example QA venue: Atlas Beach Club renders 3 candidate photos, the premium masthead and the production action gateway.
- The preview remains Basic-authenticated, noindex, no-store and read-only. Viewing it does not update public `photo_url` values or publication state.

## Verification

- Unauthenticated `/developer/site`: HTTP 401.
- Authenticated landing, catalogue and Atlas detail: HTTP 200.
- Public `/`: HTTP 200.
- Browser QA at 1440×1100: 15 district image elements, 440 catalogue cards and images, 3 Atlas review images, action gateway present, zero horizontal overflow.
- Local checks: lint passed; TypeScript passed; focused photo/security tests 3/3 passed; production build passed.
- Final deployment: `dpl_GYZxbsTYfuWKwfYcVebxrG5FTNoE`.
- Production alias: `https://www.otherbali.com`.
- Implementation commits: `fbff4a3`, `91236ac`.
