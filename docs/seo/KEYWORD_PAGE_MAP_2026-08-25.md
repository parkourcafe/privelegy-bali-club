# Keyword And Page Map - Other Bali - 2026-08-25

## Positioning

Other Bali should be mapped as a curated Bali guide and planning product, not a generic directory. The strongest intent clusters are high-choice traveller decisions where freshness, locality, and trade-offs matter.

## Current Page Architecture

| Intent cluster | Existing URL pattern | Primary user task | Status |
|---|---|---|---|
| Bali-wide planning | `/bali-travel-guide`, `/first-time-in-bali`, `/bali-itinerary-*`, `/how-many-days-in-bali` | Plan trip length, timing, first-day decisions. | Active. |
| District discovery | `/canggu`, `/ubud`, `/seminyak`, `/uluwatu`, `/sanur`, `/jimbaran`, `/nusa-dua` | Choose area and understand what each district is for. | Active. |
| District food/drink | `/{district}/best-restaurants`, `/{district}/best-brunch`, `/{district}/cafes-*`, `/{district}/best-warungs` | Pick where to eat by area and moment. | Active for core districts. |
| Beach/pool/sunset | `/best-beach-clubs-in-bali`, `/bali-sunset-clubs`, `/{district}/beach-clubs-sunset`, `/{district}/resort-day-passes` | Choose beach club, day pass, or sunset plan. | Active. |
| Wellness/spa | `/best-spas-in-bali`, `/{district}/spas-*`, `/{district}/best-yoga-wellness` | Choose spa, wellness, yoga, recovery. | Active. |
| Traveller constraints | `/bali-on-a-budget`, `/bali-with-kids`, `/romantic-bali`, `/is-bali-safe`, `/how-to-get-around-bali` | Resolve trip constraints and objections. | Active. |
| Tools | `/my-day`, `/plan`, `/collections`, `/places` | Build or browse a route/list. | Active. |
| Partner acquisition | `/for-venues`, `/villas`, `/hotels`, `/list-your-property` | Venue/property owner acquisition. | Active, commercial B2B. |

## 20/80 Priority Pages

| Priority | URL | Why it matters | Next SEO action |
|---:|---|---|---|
| 1 | `/my-day` | Differentiated planning product and AI-answer-friendly direct utility. | Deploy title/canonical fix; add clear updated-method copy if product logic changes. |
| 2 | `/seminyak/best-restaurants` | Strong commercial local food intent. | Keep venue evidence fresh; compare against GSC query data. |
| 3 | `/canggu/work-friendly-cafes` | Distinct traveller/nomad intent with high decision value. | Add proof/freshness note from field data when available. |
| 4 | `/where-to-watch-sunset-in-bali` | High top-of-funnel Bali planning intent. | Add comparison table by area, access difficulty, weather caveat. |
| 5 | `/for-venues` | Partner acquisition path for supply growth. | Add measurable UTM/source capture for GBP/partner links. |

## Gaps To Validate With GSC

| Gap | Hypothesis | Data needed |
|---|---|---|
| Query-to-page cannibalization | Bali-wide "best restaurants" may overlap with district restaurant pages. | GSC query/page export by clicks, impressions, CTR, average position. |
| Venue long-tail quality | 1271 venue URLs in sitemap may include thin or weak evidence pages. | Index coverage, low-click/high-impression URLs, manual sample QA. |
| Partner B2B discovery | `for venues`, `list property`, `hotel partner` queries may need stronger exact-match support. | GSC queries and partner lead source data. |
| AI citation source gap | AI systems may cite OnBali/Bali.com/blogs for Bali planning rather than Other Bali. | Controlled prompt run with cited URLs. |

## Page Governance

- Do not create one page per wording variant.
- Create or update pages only when the user task, evidence, and conversion path differ.
- Keep volatile facts such as hours, prices, booking conditions, and availability tied to verification dates.
- New pages must be added to SEO OS registry and pass `seo:os:check`.
