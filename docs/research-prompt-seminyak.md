# Research prompt — Seminyak eating, drinking & wellness (18 venues)

> Self-contained. Paste everything below the line into your deep-research tool.
> Output drops straight into migration `0021_enrich_thin_venues.sql`.

---

You are a local-verification researcher for **Other Bali**, a free Bali travel
guide that recommends places by the moment they suit (not by star rating). Your
job: produce **decision-ready editorial** for the 18 Seminyak-district venues
listed below, so each one's page can be published and indexed. Verify every fact
against official or live sources (venue's own site, official social account,
Google Business listing for hours/location only). If a fact cannot be confirmed,
leave that field blank — never guess or pad.

## Context you need

Seminyak is Bali's polished, design-led beach-and-dining strip: rooftop bars,
iconic beach clubs, specialty coffee, considered restaurants. Several venues
below actually sit on the **Umalas / Kerobokan / Batu Belig** fringe — quieter,
rice-field, expat-residential — and we file that fringe under Seminyak. There
are two kinds of venue in this list, handled slightly differently:

- **Food & drink** venues — fill all fields.
- **Spa / wellness** venues — `what_to_order` does not apply; see the note below.

## The 18 venues — use the EXACT slug, do not invent or rename

Bars & beach clubs
- `moonlite-kitchen-and-bar` — MOONLITE Kitchen & Bar (rooftop)
- `ku-de-ta` — KU DE TA (iconic beach club)

Cafés / coffee
- `corner-house-bali` — Corner House Bali
- `revolver-seminyak` — Revolver (specialty coffee)

Restaurants
- `7am-bakers-umalas` — 7AM Bakers (Umalas)
- `ginger-moon-canteen` — Ginger Moon
- `hog-wild-with-chef-bruno` — Hog Wild with Chef Bruno (BBQ)
- `la-casetta-bali` — La Casetta (Italian)
- `mauri-restaurant` — Mauri (Italian / fine dining)
- `natys-restaurant-seminyak` — Natys
- `nook-umalas` — Nook (Umalas, rice-field café)
- `poule-de-luxe-bali` — Poule de Luxe
- `naughty-nuris-warung-seminyak` — Naughty Nuri's Warung (ribs)

Spa / wellness (Umalas / Kerobokan)
- `bk-wellness-studio-umalas-by-blue-karma-secrets` — BK Wellness Studio
- `revive-pilates-umalas` — Revive + Pilates
- `saia-wellness-saia-pilates-umalas` — SAIA Wellness
- `think-pink-salon-and-nails-bali` — Think Pink Salon & Nails
- `you-spa-umalas` — You Spa (Umalas)

## For EACH venue, return these fields

| field | what to put |
|---|---|
| `slug` | the EXACT slug from the list above |
| `why_its_here` | 1–2 factual sentences, answer-first, no hype |
| `best_for` | WHO and WHEN it suits, semicolon-separated |
| `not_for` | WHO/WHEN it does NOT suit — fit-context only, never a quality warning. Blank if nothing honest. |
| `what_to_order` | food/drink: 3–5 signature items, semicolon-separated. **Wellness: leave blank.** |
| `price_anchor` | a price BAND. Food: e.g. `$$$ · mains ~150–300K`. Wellness: treatment/class band, e.g. `$$ · class ~150K / massage ~350K`. |
| `jobs` | food/drink: 1–4 slugs from the fixed list below. **Wellness: leave blank.** |
| `area` | more specific sub-area if you can confirm it (e.g. `Umalas`, `Batu Belig`, `Petitenget`); else blank |

### The `jobs` slugs — pick ONLY from these 9 (snake_case, exact):
`brunch_after_surf`, `date_night_special`, `family_early_dinner`,
`group_dinner_share`, `just_landed_easy_dinner`, `local_food_calm`,
`quiet_work_cafe`, `special_occasion`, `sunset_drinks_view`

The 9 intent slugs are food/drink only. **For the 5 spa/wellness venues, leave
`jobs` blank** — they still get a valid indexable page once `why_its_here` +
`best_for` + `price_anchor` are filled; they just won't appear on the intent
pages, which is correct.

## Hard rules (the output must already comply)

1. **No Google ratings and no review counts** anywhere in the copy.
2. **No quality warnings, no anti-lists.** The only allowed downside is
   `not_for`, and only as fit-context (who/when it doesn't suit).
3. **Prices as a band**, not a live/exact menu price.
4. **English only.** Verified facts only. A blank field beats a guess.
5. `jobs` must be from the 9-slug list above, exact snake_case.

## Output format

One block per venue:

```
slug: revolver-seminyak
why_its_here: ...
best_for: ...
not_for: ...
what_to_order: ...
price_anchor: ...
jobs: quiet_work_cafe, brunch_after_surf
area: Petitenget
evidence: <official site / source you verified against>
status: publish        # or: revise (say what's missing)
```

Wellness block example (note the blank food fields):

```
slug: you-spa-umalas
why_its_here: ...
best_for: ...
not_for: ...
what_to_order:
price_anchor: $$ · massage ~250–400K
jobs:
area: Umalas
evidence: ...
status: publish
```

Do all 18. Where you can't confirm enough to pass the bar, mark `revise` and
name the exact missing field.
