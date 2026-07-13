# Research prompt — Sanur eating & drinking (20 venues)

> Self-contained. Paste everything below the line into your deep-research tool.
> Output drops straight into migration `0021_enrich_thin_venues.sql`.

---

You are a local-verification researcher for **Other Bali**, a free Bali travel
guide that recommends places by the moment they suit (not by star rating). Your
job: produce **decision-ready editorial** for the 20 Sanur venues listed below,
so each one's page can be published and indexed. Verify every fact against
official or live sources (venue's own site, official social account, Google
Business listing for hours/location only). If a fact cannot be confirmed, leave
that field blank — never guess or pad.

## Context you need

Sanur is Bali's calm, walkable, sunrise-facing east-coast base: families,
long-stay visitors, couples, low-key evenings. Its strengths are beachfront
tables along the paved coastal path and honest warungs. It is a **sunrise**
coast — there is no ocean sunset here, so never describe a place as a
sunset-view spot.

## The 20 venues — use the EXACT slug, do not invent or rename

Bars
- `jalapeno` — Jalapeño
- `linga-longa-bar` — Linga Longa Bar
- `oranje-bar` — Oranje Bar
- `retro-kitchen-and-bar` — Retro Kitchen and Bar

Cafés
- `genius-cafe` — Genius Cafe
- `mona-lisa-cafe` — Mona Lisa Cafe
- `sala-bistro` — Sala Bistro
- `white-orchid-sanur` — White Orchid (Sanur)

Restaurants
- `bella-italia-sanur` — Bella Italia (Italian)
- `gong-restaurant` — Gong
- `kuu-izakaya-dining` — Kuu Izakaya (Japanese)
- `lilla-pantai` — Lilla Pantai (beachfront)
- `massimo-italian-restaurant` — Massimo (Italian / gelato)
- `pizzaria-hyatt` — Pizzaria (Hyatt)
- `red-manna` — Red Manna
- `segara-the-seaside` — Segara the Seaside (beachfront)
- `soul-on-the-beach` — Soul on the Beach (beachfront)

Warungs
- `warung-coconut-tree` — Warung Coconut Tree
- `warung-little-bird` — Warung Little Bird
- `warung-makan-little-mars` — Warung Makan Little Mars

## For EACH venue, return exactly these fields

| field | what to put |
|---|---|
| `slug` | the EXACT slug from the list above |
| `why_its_here` | 1–2 factual sentences, answer-first, no hype — why this place is worth a traveller's time |
| `best_for` | WHO and WHEN it suits, semicolon-separated (e.g. `families with kids; long lazy lunch; couples at golden hour`) |
| `not_for` | WHO/WHEN it does NOT suit — fit-context only (e.g. `late-night party crowd; anyone in a rush`). NOT a quality warning. Leave blank if nothing honest to say. |
| `what_to_order` | 3–5 signature dishes/drinks, semicolon-separated |
| `price_anchor` | a price BAND, e.g. `$$ · mains ~80–150K` — never a live menu |
| `jobs` | 1–4 slugs from the fixed list below, comma-separated |
| `area` | a more specific sub-area than "Sanur" if you can confirm one (e.g. `Sanur Beach path`, `Jalan Danau Tamblingan`); else leave blank |

### The `jobs` slugs — pick ONLY from these 9 (snake_case, exact):
`brunch_after_surf`, `date_night_special`, `family_early_dinner`,
`group_dinner_share`, `just_landed_easy_dinner`, `local_food_calm`,
`quiet_work_cafe`, `special_occasion`, `sunset_drinks_view`

**Sanur is a sunrise coast — do NOT use `sunset_drinks_view` for any Sanur venue.**

## Hard rules (the output must already comply)

1. **No Google ratings and no review counts** anywhere in the copy.
2. **No quality warnings, no anti-lists** ("skip the X", "service is slow",
   "overpriced"). The only allowed downside is `not_for`, and only as fit-context
   (who/when it doesn't suit), never a judgement of quality.
3. **Prices as a band**, not a live/exact menu price.
4. **English only.** Verified facts only. A blank field is better than a guess.
5. `jobs` must be from the 9-slug list above, exact snake_case.

## Output format

One block per venue, in this shape:

```
slug: segara-the-seaside
why_its_here: ...
best_for: ...
not_for: ...
what_to_order: ...
price_anchor: ...
jobs: family_early_dinner, group_dinner_share
area: Sanur Beach path
evidence: <official site / source you verified against>
status: publish        # or: revise (say what's missing)
```

Do all 20. If you can only confirm enough fields for some to pass the bar
(`why_its_here` + `best_for` + one of `what_to_order`/`price_anchor`), mark the
rest `revise` and note exactly which field is unverified.
