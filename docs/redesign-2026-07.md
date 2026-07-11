# Other Bali — redesign + Bali-wide planning layer (2026-07)

Record for the `claude/privelegy-bali-club-mjlzwq` branch after reconciling
with the mainline (`claude/bali-tourism-platform-fhd0l9`), which independently
landed its own Other Bali cinematic landing + JTBD/moments content layer.

## Reconciliation decision

The base branch is the mainline and owns the design system and architecture:
- Cinematic landing at `/` (dark espresso + brass, Fraunces/Geist, `--ob-*`
  tokens, `components/landing/*`), the working tool moved to `/plan`.
- `.page-dark` scope for tourist sub-pages; `.moment-*` day scenarios;
  `.fit-context` / `.why-here` JTBD fields; venue `area` sub-areas.
- Migration `0014_venue_areas_jtbd.sql`.

On merge, **base wins wholesale on design/architecture/rebrand.** This
branch's distinct, surviving contribution is the **Bali-wide planning layer**;
the branch's earlier standalone landing/design-system is superseded by base's
and was dropped during the merge (recoverable from history at `9c08704`).

## What this branch adds on top of base

- **`lib/districts.ts`** — 15 areas as an editorial planning layer with fit
  context (region · moment · Best for). Canggu = `active_deep`, Ubud =
  `next_deep`, the rest `planning_only`; Gili Islands & Lombok labelled
  "Beyond Bali · fast boat" (they are a different province — the framing
  stays honest).
- **`AroundBali` section** on the landing (`app/page.tsx`), authored in base's
  dark idiom (`Section`/`Reveal`/`--ob-*`), inserted after Comparison. Canggu
  card links to `/plan`; others link to Google Maps via `DistrictMapLink`.
- **`getDistrictsGuide()`** (`lib/data.ts`) — overrides a district's coverage
  status from the `districts` table when Supabase is configured, so flipping
  a status in the DB reflects without a deploy. (The landing itself uses the
  static list to stay static; this accessor is for `/plan` surfaces.)
- **`district_open`** growth event (`/api/event`) — growth-only, never
  partner-proof.
- **Migrations** `0015_planning_districts.sql` (11 areas) + `0016_gili_lombok.sql`
  — renumbered after base's `0014` so ordering is clean. `planning_only`,
  monetization/QR off (guardrail #4 holds at the DB level). **DB apply is the
  founder's** to run, in order, after the pending `0013`.
- **SEO** — `sitemap.ts` (adds `/`, `/plan`, `/route/*`), `robots.ts`
  (admin/partner/onboard/api/me/v disallowed), `metadataBase` + OpenGraph on
  the root layout.
- Nav gains an "Around Bali" anchor.

## Guardrails / notes

- Coverage discipline: no perks/QR/booking outside `active_deep`. District
  cards carry only a map link + a growth event.
- Master doc names Canggu/Ubud/Seminyak/Sanur/Uluwatu explicitly; the other
  planning_only areas (incl. Gili/Lombok) extend the documented Bali-wide
  planning layer per founder request (2026-07-11). Worth one line in the
  master doc for full guardrail-#11 cleanliness.
- No new entities, no chatbot, no invented numbers/testimonials/offers.

---

# Premium cinematic pass (2026-07-11, Higgsfield imagery)

Visual/motion-only upgrade of the landing per the premium-website brief.
Copy, section structure, FAQ, anchors, and every functional link — including
the day-builder's `/places?q=…&district=…&category=…&intent=1` URLs — are
byte-identical to the source (verified by Playwright assertions).

## Imagery & video (Higgsfield, 2026-07-11 set)
- 6 stills regenerated in ONE warm film grade (Kinfolk-editorial, golden
  hour, teal shadows / sand highlights, no people, no text): hero-sunset,
  moment-morning (café light), moment-warung (rain on banana leaves),
  moment-goldenhour (cliffside), moment-dinner (candlelit warung),
  human-dusk. Model: nano_banana_pro; filenames in scripts/fetch-scenes.mjs.
- ONE muted hero loop (seedance_2_0, 5s 720p, silent, generated FROM the
  hero still for grade continuity). Shipped via fetch-scenes with a hard
  3MB gate — over budget ⇒ not shipped, Ken Burns poster stays.
- The founder's Higgsfield CDN is unreachable from this sandbox (egress
  allowlist), so pixels could not be reviewed here; the fetch-scenes prebuild
  + SVG-art fallback keeps every failure mode graceful. Review on the Vercel
  preview.

## Motion (all gated by prefers-reduced-motion)
- Hero: Ken Burns on the still; lazy muted loop (desktop-only, post-load,
  Save-Data respected, fades in on canplaythrough, poster on any error).
- Moments: slow scroll parallax (one rAF listener), image breathe on hover,
  serif italic tags; on phones the four cards are swipeable full-width snap
  panels.
- Day-builder: brass selection glow + per-question graded washes, live
  "Your map brief" pulse (aria-live polite), shimmer on Build-my-map.
  Selection logic and built URLs untouched.
- Proof chain: steps light up sequentially with a brass thread drawing
  across (pure CSS off the existing Reveal).
- Comparison: editorial table restyle (serif row labels, ringed brass ticks).
- Human moment: parallax dusk scene + signature rules.

## Verified (Playwright + Lighthouse, local prod build)
- Anchors #day-builder/#how/#moments/#trust/#faq (+ all others) exist.
- Day-builder default URL exact; reacts to selection; moment hrefs exact.
- Zero broken internal links; zero console errors; reduced-motion clean;
  video never mounts on mobile; CLS 0.
- Lighthouse mobile (SVG-fallback worst case): Performance 96,
  Accessibility 100, Best Practices 96, TBT 30ms. With real scene images on
  prod the LCP element becomes the fetchpriority-high hero webp.
