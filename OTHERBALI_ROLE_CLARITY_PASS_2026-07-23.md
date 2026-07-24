# Other Bali Role Clarity Pass

Дата: 2026-07-23  
Статус: implemented pass на ветке `codex/role-clarity-pass-2026-07-23`

Цель: закрепить уникальную роль ключевых публичных страниц, чтобы они не читались как повторы друг друга. Это не меняет publication gate, SEO gate, data model, money model или маршруты.

## Page role map

| Page family | Product mode | Unique role | Visual pattern | Media rule | Primary CTA | Must not duplicate |
|---|---|---|---|---|---|---|
| `/` | Home | Explain Other Bali and send the traveller into Today or Plan | Cinematic brand hero + six scenario cards + compact planning/category/trust layers | Hero video/image plus section scene cards | `Find a place now`, `Plan my trip` | Full catalogue, full planner, B2B pitch, Canggu-only promise |
| `/my-day` | Today | Convert current context into a short actionable shortlist | Guide hero + question form + day slots | Hero media plus section media for the form and day explanation | Answer today questions; open/save/place/Maps from results | Future-trip planning, all-place browsing, route engine |
| `/places` | Explore | Compare published places by district, type, moment and search | Cinematic catalogue masthead + filters + district directory/cards | Catalogue hero video/image; district/card media from existing sources | Search/filter; open place detail | Generated day plan, ordered route, “every place in Bali” claim |
| `/plan` | Plan | Start future-trip planning from itineraries, routes and saved trip flow | Planning hero + trip starter cards + ready-made routes + Canggu pilot module | Hero media plus route/planning section media | Start with trip length; browse ready-made routes | Today shortlist, generic catalogue, Canggu-only page identity |
| `/collections` | Explore | Themed editorial shortlists by taste or moment | Guide hero + grouped collection cards | Hero media plus collection card art | Open a collection | Full catalogue, generated day, ordered route |
| `/collections/[taste]` | Explore | One themed shortlist grouped by area | Guide hero + jump chips + area card groups | Hero media; place card media from published places | Open place detail or related collection | Route sequence, future itinerary, all places |
| `/route/[slug]` | Plan / Route | Ordered sequence of stops for a specific day | Route hero + route media + numbered timeline | Hero media plus stop cards | Follow stop sequence; open place detail | Catalogue filters, generated shortlist, area landing |
| `/places/[slug]` | Place detail | Decide whether one place fits and take the next action | Venue masthead + quick decision + practical/action blocks | Venue photo if allowed; fallback art if no approved photo | Save, Add to trip, Maps, verified venue action | Area guide, full collection, route engine |
| `/canggu` | Area / active-deep | Explain Canggu and expose the deepest current execution layer | District masthead + Canggu Now + guide cards + local picks | District media plus Canggu-specific guide/place media | Open Canggu guide/builder/picks | Global home promise, all-Bali equivalence for active-deep ops |
| `/bali` and area pages | Areas | Help pick a territory and understand local fit | Area guide/index cards + practical guide sections | District or guide media | Open area guide, filter area places, plan trip | Full catalogue, Today form, Canggu-only CTAs on non-Canggu areas |

## Anti-duplication rules

1. `Today` copy must say “today”, “now”, “shortlist” or equivalent immediate-decision language.
2. `Plan` copy must say “future trip”, “itinerary”, “route” or “trip length”; Canggu builder is allowed only as a labelled pilot module.
3. `Explore` copy must say “compare”, “search”, “filter”, “published places” or “collections”; it must not promise a complete travel plan.
4. `Collections` are themed shortlists, not all places and not ordered routes.
5. `Route` pages are ordered sequences, not browse grids.
6. `Area` pages explain territory fit; they may link to filtered places but should not become the catalogue.
7. `Place detail` pages answer one-place decision and actions; they should not restate area/page-level strategy.
8. B2B/partner copy remains secondary and does not compete with tourist page roles.
9. No page may imply paid placement affects organic order.
10. No page may claim `Open now`, booking difficulty, live availability, travel time, ratings or review counts without verified structured source data.

## Current implementation changes in this pass

- `/places`: masthead copy now frames the page as Explore mode and uses `published places` language.
- `/plan`: hero and metadata now frame the page as future-trip planning; route cards are Bali-wide; the Canggu day builder is explicitly labelled as a pilot module.
- `/my-day`: hero and metadata now frame the page as Today/immediate decision rather than another planner.
- `/collections`: hub and detail copy now frame collections as themed shortlists; collection pages now get hero media.
- `/route/[slug]`: route pages now explain ordered sequence semantics and include route hero media; Canggu routes link back to `/canggu`.
- Area hub CTA: non-Canggu area pages no longer show `Build a Canggu day`; Canggu links to the builder anchor explicitly.
- `/uluwatu` and `/sanur`: pilot district pages now mount the existing `StartYourShortlist` pattern from publication-gated venue sources, matching Canggu, Ubud and Seminyak.
- Footer: links now surface distinct modes: Today, Explore, Plan, Areas, Collections.
