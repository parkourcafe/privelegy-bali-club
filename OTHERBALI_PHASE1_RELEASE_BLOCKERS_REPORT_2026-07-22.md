# Other Bali — Phase 1 Release Blockers Report

Дата: 2026-07-22  
Branch: `codex/phase1-release-blockers-clean-2026-07-22`  
Base: `origin/main` at `62a026e9df1f85bb36378bf44f7548b3ce4bb437`  
Status: **PASS — PR open, CI green, preview deployment ready; no production deploy performed.**

PR: https://github.com/parkourcafe/privelegy-bali-club/pull/194  
Preview deployment: https://otherbali-site-5ds46falm-yulaboober.vercel.app  
Preview note: the deployment is `Ready`, but public unauthenticated HTTP checks receive Vercel SSO protection (`302 → vercel.com/sso-api`, `x-robots-tag: noindex`). Route matrix evidence therefore uses production/local app checks; preview visual review requires an authenticated Vercel session or protection bypass token.

## 1. Scope

Phase 1 scope was limited to release blockers:

- route failures;
- `/collections`;
- `/places`, `/plan`, `/my-day` data loading;
- incorrect Plan/Uluwatu/Bali-without-a-scooter links;
- confirmed axe contrast issues;
- visible focus styles.

No Chope work, production DB writes, migrations, production deploy, media restoration, or broad redesign was performed.

## 2. Changes

| File | Change | Reason |
|---|---|---|
| `components/MobileNav.tsx` | Mobile bottom-nav `Plan` target changed from `/guides` to `/plan`. | Confirmed incorrect Plan link; bottom nav should open the actual planning surface. |
| `app/globals.css` | Added global visible `:focus-visible` fallback for links, buttons, inputs, selects, textarea, summary, role buttons and tabbables. | Ensures all interactive elements have a clear keyboard focus indicator, not only component-specific cases. |
| `app/collections/page.tsx` | Removed opacity dimming from “In research” chips. | Confirmed axe color-contrast violation on `/collections`; opacity reduced chip contrast below WCAG AA. |
| `scripts/wave3-product-boundary.test.mjs` | Updated stale mobile Plan assertion from `/guides` to `/plan`. | CI still encoded the old incorrect Plan contract; Phase 1 fix requires mobile Plan to point to `/plan`. |

## 3. Route blocker verification

Live HTTP route matrix checked against `https://www.otherbali.com`.

| Route | Status |
|---|---|
| `/uluwatu` | 200 |
| `/uluwatu/48-hours` | 200 |
| `/uluwatu/beach-clubs-sunset` | 200 |
| `/uluwatu/best-brunch` | 200 |
| `/uluwatu/best-restaurants` | 200 |
| `/uluwatu/date-night-restaurants` | 200 |
| `/uluwatu/resort-pool-day-passes` | 200 |
| `/route/cafe-work` | 200 |
| `/route/canggu-rainy-day` | 200 |
| `/route/first-day` | 200 |
| `/route/sunset-run` | 200 |
| `/places` | 200, non-empty |
| `/plan` | 200, non-empty |
| `/my-day` | 200, non-empty |
| `/collections` | 200, useful public entry |
| `/canggu-without-a-scooter` | 200 |
| `/how-many-days-in-bali` | 200 |

Result: no live route blocker reproduced.

## 4. Accessibility and focus verification

Local production build, Chrome headless, viewport `390×844`.

Pages checked with local `axe-core`:

- `/`;
- `/places`;
- `/plan`;
- `/my-day`;
- `/collections`.

Result:

```text
axe violations: 0
serious/critical: 0
mobile Plan href: /plan
horizontal overflow at 390px: none
first 25 visible focusable elements missing visible focus: 0
```

## 5. Commands run

```text
npm install
npm run test:t0:unit
npm run test:wave1
npm test
npm run typecheck
npm run lint
npm run build
```

Results:

| Command | Result |
|---|---|
| `npm install` | PASS; dependencies installed locally in clean worktree. |
| `npm run test:t0:unit` | PASS — 48/48. |
| `npm run test:wave1` | PASS — 46/46. |
| `npm test` | PASS — full repository test command used by CI. |
| `npm run typecheck` | PASS. |
| `npm run lint` | PASS with 1 pre-existing warning in `app/partner/venues/[venue]/[section]/PhotoReviewPanel.tsx` about `<img>`. No lint errors. |
| `npm run build` | PASS. |

## 6. CI / preview status

GitHub Actions run: https://github.com/parkourcafe/privelegy-bali-club/actions/runs/29926176000

| Check | Result |
|---|---|
| `lint · typecheck · build` | PASS |
| `Capacitor Android lint · tests · debug package` | PASS |
| `iOS unsigned device archive · privacy · shell` | SKIPPED by workflow |
| Vercel — `otherbali-site` | PASS / Ready |
| Vercel — `otherbali-phase0-source` | PASS / Ready |
| Vercel — `otherbali-release-current` | PASS / Ready |
| Vercel — `privelegy-bali-club` | PASS / Ready |

## 7. Excluded artifacts

`npm run build` runs `prebuild`, which downloaded `public/scenes/venues-story.mp4`. That generated media artifact was removed from the clean branch and is not included in this Phase 1 diff.

## 8. Remaining non-blocking follow-ups

1. Remove stale typo sitemap submissions in GSC UI: `sitemap.xml.` and `sitemap.url`.
2. Improve internal links for the 71 venue URLs that are sitemap-crawlable but not found from non-place sitemap pages.
3. Address the pre-existing lint warning in partner photo review separately if desired.
