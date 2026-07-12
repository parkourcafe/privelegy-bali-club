# Canggu district product — audit + launch notes (2026-07-12)

Mirrors the Uluwatu launch (#26) for Canggu, on top of current mainline, reusing #26's
components (`PlaceCard`, `Breadcrumbs`, `GuideBlocks`, `PageViewTracker`). Two deliberate
differences from Uluwatu.

## 1. Canggu is active_deep — the money loop stays ON

Unlike planning-only Uluwatu, Canggu carries perks, QR, TablePilot (guardrail #4). The
reused `PlaceCard` already renders **Reserve** (TablePilot handoff, guardrail #3) when a
venue has `tablepilot_slug`, and an offer hint when a confirmed perk exists. `getPublishedVenues`
attaches perks **only** inside Canggu (active_deep), so `hasOffer` is correct. `/plan` (the
deep money-loop tool) is untouched — the new `/canggu` editorial pillar funnels into it.

## 2. No hand-verified Canggu evidence registry yet — content from the DB only

#26's Uluwatu launch shipped a hand-researched evidence registry (`lib/uluwatu/venues.ts`)
with per-fact source URLs + verification dates for 24 venues. **No equivalent research pass
exists for Canggu**, and facts are never invented (brief §4). So Canggu content is sourced
**only from the existing DB editorial fields** (`why_its_here`, `best_for`, `jobs`, tags —
from migrations 0015/0016). Consequences:
- Pillar + child guides are editorial and indexable — built from real curated data.
- **Venue detail pages stay `noindex`** (same publication gate as Uluwatu) until a Canggu
  evidence pass fills verified hours/price/official links/images.

## 3. Data (migrations 0015/0016, district `canggu`)

85 Canggu venue rows: 52 restaurant · 14 spa · 13 café · 3 beach_club · 3 bar. Editorial
fields (`why_its_here`, `best_for`, `jobs`) present on the deepened rows. Job vocabulary is
island-wide (`date-night-special`, `group-dinner-share`, `special-occasion`,
`family-early-dinner`, `sunset-drinks-view`, `quiet-work-cafe`, `brunch-after-surf`).

## 4. Shipped

- `lib/canggu.ts` — `getCangguVenues` (DB, editorial-ready), `toCangguPlaceCard` (keeps
  money loop), job/tag helpers. No `uluwatu ↔ uluwatu-bukit`-style mapping needed (Canggu's
  public name IS its DB slug).
- `lib/canggu-guides.ts` + `components/CangguGuideView.tsx` — decision-organised editorial
  lists from DB data.
- `/canggu` pillar + 4 child guides: `best-restaurants`, `work-friendly-cafes` (digital-nomad
  SEO), `best-spas` (14 spas), `beach-clubs-sunset`. Categories chosen by what the data
  supports (§4 — no page ships to fill a count).
- Venue detail `/places/[slug]` extended: Canggu breadcrumbs + category→guide links; money
  loop unchanged.
- Sitemap: `/canggu` + 4 children (venue pages stay noindex, unlisted). BreadcrumbList +
  ItemList JSON-LD; `district_page_view` / `editorial_page_view` events; internal links.

## 5. Deferred / follow-up

- **Canggu evidence pass** — verified hours/price/official links + rights-cleared images →
  flips venue detail pages from noindex to indexed (same pipeline as Uluwatu #26).
- More child guides once data supports (warung/local food, brunch, family, nightlife).
- Social pack + 30-day plan (need real assets) — mirror `docs/uluwatu-social-launch.md`.
- A `48 hours in Canggu` itinerary once the evidence pass lands.

## Русское резюме
Ченгу — active_deep, поэтому **денежная петля сохранена** (Reserve/перки на карточках через
`PlaceCard`, `/plan` не тронут). Проверенного реестра фактов по Ченгу нет (в отличие от
Улувату #26), выдумывать нельзя (§4) — контент берём **только из существующих редакторских
полей БД**. Поэтому pillar и подстраницы индексируются, а **страницы заведений — noindex**,
пока не проведём такой же evidence-проход, как для Улувату. Сделано: `/canggu` + 4 подстраницы
(рестораны, work-friendly кафе, спа, beach clubs/sunset), breadcrumbs/sitemap/аналитика.
