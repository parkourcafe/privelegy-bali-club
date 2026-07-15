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

## Menu, booking and delivery review overlay

- The password-protected restaurateur preview now overlays the compiled Data Ops package after a second server-side review-session check. Public `/places/<slug>` requests continue to use the strict published/confirmed repositories and cannot read draft records.
- Prepared review coverage: 127 menus (881 items; 1 full and 126 partial) and 250 action candidates across 131 venues (56 reserve, 17 delivery, 89 WhatsApp, 88 website).
- Every F&B detail page in private review mode keeps a visible Menu, Reserve and Delivery review surface. Official prepared links are actionable; a missing source is shown as `Owner ... link needed` and never replaced with an invented URL.
- Catalogue cards identify prepared menu/action coverage and link directly to the menu section. Draft menus are labelled `operator reviewed · owner confirmation pending`; private review clicks do not mark source records published or verified.
- Safety regression: a focused resolver test proves draft actions remain invisible in the public mode and are admitted only with the explicit protected-review option.
- Verification: `npm run typecheck` passed; `npm run lint` passed; `node --import tsx --test lib/actions/__tests__/resolve-actions.test.ts` passed (35/35); `npm run build` passed.
- Protected deployment: `dpl_qeqigi95TexJALvA9C8WncCCXzVa`; `https://review.otherbali.com` points to `privelegy-bali-club-3rcbob76s-yulaboober.vercel.app`.
- Live QA: unauthenticated catalogue returns 401; authenticated catalogue returns 200. Mamasan renders a prepared partial menu plus Reserve and Delivery; KYND renders the prepared full menu; BAKED Pererenan renders the explicit owner-needed states for Menu, Reserve and Delivery. Public `https://www.otherbali.com/` remains HTTP 200 and was not assigned to this deployment.
