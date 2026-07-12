# Ubud district product — audit + launch notes (2026-07-12)

Third district product, mirroring Canggu/Uluwatu, on current mainline. Also fixes a
duplication introduced by the Canggu launch.

## 0. Fix shipped alongside: Canggu hub/pillar duplication

The hand-built `/canggu` pillar (PR #30) and the programmatic `/bali/canggu` hub were
**both live**, competing for the same queries — the exact thing `HUB_EXCLUDE_DISTRICTS`
exists to prevent. Fixed: `canggu` (and `ubud`) added to `HUB_EXCLUDE_DISTRICTS`, so the
programmatic hub no longer generates `/bali/canggu` or `/bali/ubud`; those districts are
owned by their pillars. (`uluwatu-bukit` was already excluded.)

## 1. Ubud is planning / next_deep — money loop OFF

Unlike Canggu (active_deep), Ubud has no perks/QR/TablePilot (guardrail #4). Cards use the
same `PlaceCard` but carry **no Reserve/offer** (`toUbudPlaceCard` sets no `tablepilotSlug`/
`hasOffer`; perks never attach outside Canggu anyway). Venues hand off to their own channels.

## 2. Data ceiling (honest — nothing invented, §4)

Per `docs/seo-strategy.md` + the DB: Ubud has **28 venues (19 restaurant, 8 café + …)**,
editorial fields (`why_its_here`/`best_for`) present, but:
- **ZERO `jobs` tags** → can't build honest decision-organised guides (date-night, work,
  etc.) — those groups would be empty. So Ubud guides are **category-organised curated
  lists**, not decision groups.
- **No yoga / spa / retreat / wellness venue rows** yet — despite being Ubud's signature.
  Those guides can't be built without the data.

Founder note (2026-07-12): yoga data found; remaining Ubud data is being loaded in a
separate chat. So this release ships the food/coffee product now; the richer Ubud
(wellness/retreat + intent spokes + indexable venue pages) lands with that **evidence pass**.

## 3. Shipped

- `lib/ubud.ts` (`getUbudVenues`, `toUbudPlaceCard` — no money loop) + `lib/ubud-guides.ts`
  (category guides) + `components/UbudGuideView.tsx`.
- `/ubud` pillar + `/ubud/best-restaurants` + `/ubud/best-cafes-coffee` — curated from real
  DB editorial data.
- `/places/[slug]` extended: Ubud breadcrumbs + category→guide links.
- Sitemap `/ubud` + 2 children; BreadcrumbList + ItemList JSON-LD; page-view events;
  internal links. Venue detail pages stay **noindex** until the evidence pass.
- Canggu duplication fixed (§0).

## 4. Follow-up (the evidence pass — loaded separately)

Same bar as Uluwatu #26: verified hours/price/official links + rights-cleared images +
per-fact evidence → flips venue detail pages from noindex to indexed. Plus: backfill `jobs`
for Ubud (unlocks decision guides + `/bali/ubud/[intent]`-style spokes), import the yoga /
wellness / retreat venues → build Ubud's signature guides.

## Русское резюме
Ubud — planning/next_deep, поэтому **денежной петли нет** (в отличие от Ченгу). Данные Ubud:
редакторские поля есть, но **нет `jobs`-тегов и нет заведений йоги/спа/ретритов** — поэтому
честно собрать можно только **категорийные** гиды (рестораны, кафе), без decision-групп и без
wellness-страниц (не из чего, §4). Йогу вы уже нашли, остальное грузите в другом чате — это и
есть **evidence-проход**; когда данные придут, добавим wellness-гиды и снимем noindex со
страниц заведений. Заодно **починила дубль Ченгу** (`/canggu` vs `/bali/canggu`).
