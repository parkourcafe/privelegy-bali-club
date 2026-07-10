# Cinematic premium redesign + Other Bali public rebrand — 2026-07-10

Implementation record for the homepage redesign executed from the
"Universal Premium Redesign" prompt, scoped to: **homepage + shared design
system + tourist-surface rebrand**. Subpages inherit the system; their
structure is unchanged.

## Strategy line

Other Bali gives Bali tourists one right answer per moment of the day —
human-curated Canggu places with verified vibes, honest prices and
venue-confirmed perks — and earns a fixed fee from venues only when a table
reserved through the TablePilot handoff is actually seated.

Headline chosen for the hero: **"The right place for the moment you're in."**
(the decided public tagline; commercial and emotional variants considered:
"Canggu, planned by the hour — with perks at the counter." / "Stop scrolling
reviews. Start having the day.")

## What shipped

- **Design system** (`app/globals.css`): restrained palette (ink
  `#101512`/`#1c221e`, paper `#f5efe2`, lagoon `#0b6d72`, brass `#b3874a`,
  clay `#a76043`), Fraunces (display serif) + Instrument Sans (body) via
  `next/font` (self-hosted, no CLS), cinematic dark/paper section rhythm,
  reduced-motion honored everywhere.
- **Homepage** (`app/page.tsx`): full-viewport CSS-scene hero with floating
  route card → chaos-vs-order → sticky mechanism (4 steps + demo reservation
  card, labeled "Demo") → route scenario cards → planning guide (existing
  PlanView, untouched logic) → 6 trust cards → honest comparison table →
  FAQ (native `<details>`) → final CTA. New components: `SiteHeader`,
  `SiteFooter`, `Reveal` (progressive-enhancement scroll reveal),
  `MobileStickyCTA`.
- **Rebrand (tourist surfaces only)**: layout metadata + OG, PWA manifest
  (`?v=4`), redeem confirmation, `/me`, route back-links now say
  **Other Bali**. NOT rebranded on purpose: admin QR sticker pages and the
  partner invite message — venues have seen/printed those; re-print is a
  founder decision.
- **CTA hierarchy fix (money model v0.3)**: on bookable venues
  "Reserve a table" is now the primary button, "Show offer" secondary;
  event logging (`reservation_click` etc.) unchanged.
- **SEO**: `app/sitemap.ts`, `app/robots.ts` (admin/partner/onboard/api/me/v
  disallowed), `metadataBase` → `https://otherbali.com`.

## Preserved routes & wiring (verified)

`/`, `/route/[slug]`, `/me`, `/v/[venue]/redeem`, `/partner/[venue]`,
`/admin/*`, `/onboard/[token]`, all `/api/*`. Funnel events, guest cookie,
TablePilot handoff (`source=bali_privilege`), WhatsApp fallback — untouched.

## Test checklist (run 2026-07-10, all pass)

- `npm run build` clean (fonts self-hosted at build); `npm run lint` clean.
- Playwright (prod server, seed data): 0 console errors; all 14 internal
  homepage links < 400; vibe/type filters respond; mobile sticky CTA shows
  after hero and hides over the guide; screenshots desktop 1440 / mobile 390.

## Assumptions

- Seed venues/perks remain placeholder — copy avoids claiming any specific
  venue count or testimonials (none exist yet; none invented).
- With seed data, vibe filters return "nothing matches" because seed venues
  have no `vibeTags` (pre-existing; fill via Field Kit).
- Hero/scenario visuals are art-directed CSS scenes, not stock. Swap-in of
  real Canggu photography is the single highest-leverage visual upgrade.

## Hidden backlog / no-go

- Real photography for hero + scenario cards (photoUrl pipeline exists).
- OG image (`opengraph-image`) matching the new hero.
- Re-print QR stickers / partner materials under Other Bali (founder call).
- NOT built (guardrails): chatbot, review scraping, internal booking,
  tourist payments, paid ranking, anti-lists, new entities.
