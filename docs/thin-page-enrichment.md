# Thin venue pages — what's needed to open them for indexing

39 active venue pages are still `noindex` because they're **thin** (no editorial).
This doc explains exactly what turns a page indexable, lists the 39, and gives
two ready-to-run research prompts (Sanur eating, Seminyak) whose output drops
straight into a migration — same pipeline as the Ubud/Seminyak brunch imports.

## The bar: what makes a venue page indexable

A venue page flips to `index,follow` (and enters the sitemap) the moment its DB
row passes the **decision-ready** bar — all of:

- `why_its_here` — 1–2 factual editorial sentences (answer-first, no hype), AND
- `best_for` — WHO/WHEN it suits, AND
- **at least one of** `what_to_order` **or** `price_anchor`.

Optional but recommended: `not_for` (fit-context only — WHO/WHEN it does NOT
suit; never a quality warning), `jobs` (1–4 canonical intent slugs), `area`.

That's it. Fill those fields → the page indexes automatically. No code change.

### The DB fields to return (per venue)

| field | notes |
|---|---|
| `slug` | use the EXACT slug from the list below (do not invent) |
| `why_its_here` | 1–2 factual sentences; answer-first; no hype |
| `best_for` | WHO/WHEN it suits (semicolon-separated) |
| `not_for` | WHO/WHEN it doesn't suit — fit-context only |
| `what_to_order` | 3–5 signature items, semicolon-separated |
| `price_anchor` | band, e.g. `$$ · mains ~80–150K` |
| `jobs` | 1–4 of: brunch_after_surf, date_night_special, family_early_dinner, group_dinner_share, just_landed_easy_dinner, local_food_calm, quiet_work_cafe, special_occasion, sunset_drinks_view |
| `area` | sub-area, if more specific than what we have |

### Guardrails (the output must already comply)
1. **No Google ratings / review counts** in the copy (guardrail #1).
2. **No quality warnings / anti-lists** — downsides only as `not_for` fit-context (#7).
3. **Prices as a band**, not a live menu.
4. **English only**; verified facts only; leave a field blank if unverified — don't invent.
5. `jobs` slugs must be from the 9-word list above, snake_case.

---

## The 39 thin venues

### Sanur — 20 (all `sanur`, area "Sanur")
Bars: `jalapeno` Jalapeño · `linga-longa-bar` Linga Longa Bar · `oranje-bar`
Oranje Bar · `retro-kitchen-and-bar` Retro Kitchen and Bar
Cafés: `genius-cafe` Genius Cafe · `mona-lisa-cafe` Mona Lisa Cafe ·
`sala-bistro` Sala Bistro · `white-orchid-sanur` White Orchid (Sanur)
Restaurants: `bella-italia-sanur` Bella Italia · `gong-restaurant` Gong ·
`kuu-izakaya-dining` Kuu Izakaya · `lilla-pantai` Lilla Pantai ·
`massimo-italian-restaurant` Massimo · `pizzaria-hyatt` Pizzaria (Hyatt) ·
`red-manna` Red Manna · `segara-the-seaside` Segara the Seaside ·
`soul-on-the-beach` Soul on the Beach
Warungs: `warung-coconut-tree` Warung Coconut Tree · `warung-little-bird`
Warung Little Bird · `warung-makan-little-mars` Warung Makan Little Mars

### Seminyak — 18
Bar/beach club: `moonlite-kitchen-and-bar` MOONLITE KITCHEN & BAR ·
`ku-de-ta` KU DE TA
Cafés: `corner-house-bali` Corner House Bali · `revolver-seminyak` Revolver
Restaurants: `7am-bakers-umalas` 7AM Bakers Umalas · `ginger-moon-canteen`
Ginger Moon · `hog-wild-with-chef-bruno` Hog Wild with Chef Bruno ·
`la-casetta-bali` La Casetta · `mauri-restaurant` Mauri ·
`natys-restaurant-seminyak` Natys · `nook-umalas` Nook Umalas ·
`poule-de-luxe-bali` Poule de Luxe · `naughty-nuris-warung-seminyak`
Naughty Nuri's Warung
Spa / wellness (Umalas / Kerobokan): `bk-wellness-studio-umalas-by-blue-karma-secrets`
BK Wellness Studio · `revive-pilates-umalas` Revive + Pilates ·
`saia-wellness-saia-pilates-umalas` SAIA Wellness · `think-pink-salon-and-nails-bali`
Think Pink Salon & Nails · `you-spa-umalas` You Spa Umalas

### Uluwatu — 1 (special case)
`white-rock-beach-club` White Rock Beach Club. **Not** enriched via DB editorial —
Uluwatu is gated by the evidence registry `lib/uluwatu/venues.ts`. To publish it,
it needs a registry entry with recorded evidence (identity, boundary, hours,
editorial summary + best-for + a practical detail + verification date), same as
the other published Uluwatu venues. That's the Uluwatu research process, not this
one.

---

## Prompt A — Sanur eating & drinking (fills the 20 Sanur venues)

> Paste into your deep-research tool.

You are a local-verification researcher for **Other Bali**, a free Bali guide
that recommends places by the moment they suit. Produce **decision-ready
editorial** for these 20 Sanur venues so their pages can be published. Verify
each against live/official sources; where a fact can't be confirmed, leave the
field blank — never guess.

Venues (use the EXACT slug):
`jalapeno` Jalapeño (bar) · `linga-longa-bar` (bar) · `oranje-bar` (bar) ·
`retro-kitchen-and-bar` (bar) · `genius-cafe` (café) · `mona-lisa-cafe` (café) ·
`sala-bistro` (café) · `white-orchid-sanur` (café) · `bella-italia-sanur`
(restaurant) · `gong-restaurant` · `kuu-izakaya-dining` (Japanese) ·
`lilla-pantai` (beachfront) · `massimo-italian-restaurant` · `pizzaria-hyatt` ·
`red-manna` · `segara-the-seaside` (beachfront) · `soul-on-the-beach`
(beachfront) · `warung-coconut-tree` · `warung-little-bird` ·
`warung-makan-little-mars`.

Context: Sanur is the calm, sunrise-facing, walkable east-coast base — families,
long-stay, couples, low-key. Beachfront tables and warungs are its strengths.

For EACH venue return these fields (see field table above): `slug`,
`why_its_here`, `best_for`, `not_for`, `what_to_order`, `price_anchor`, `jobs`
(from the 9-slug list; Sanur is a sunrise coast, so do NOT use
`sunset_drinks_view`), and a corrected `area` if you have a more specific one.

Guardrails: no Google ratings/review counts; downsides only as `not_for`
fit-context, never quality warnings; prices as bands; English only; verified
facts only.

Output: one block per venue with the fields above, plus a short evidence note
(official site / source) and a `publish`/`revise` status.

---

## Prompt B — Seminyak (fills the 18 Seminyak venues)

> Paste into your deep-research tool.

Same role and rules as Prompt A. Produce **decision-ready editorial** for these
18 Seminyak-district venues (note: several sit in the Umalas / Kerobokan /
Batu Belig fringe, which we file under Seminyak).

Restaurants & cafés: `moonlite-kitchen-and-bar` (rooftop bar) · `ku-de-ta`
(iconic beach club) · `corner-house-bali` (café) · `revolver-seminyak`
(specialty coffee) · `7am-bakers-umalas` · `ginger-moon-canteen` ·
`hog-wild-with-chef-bruno` (BBQ) · `la-casetta-bali` (Italian) ·
`mauri-restaurant` (Italian/fine) · `natys-restaurant-seminyak` ·
`nook-umalas` (rice-field café) · `poule-de-luxe-bali` · `naughty-nuris-warung-seminyak`
(ribs).
Spa / wellness (Umalas): `bk-wellness-studio-umalas-by-blue-karma-secrets` ·
`revive-pilates-umalas` · `saia-wellness-saia-pilates-umalas` ·
`think-pink-salon-and-nails-bali` · `you-spa-umalas`.

For food/drink venues return the same fields as Prompt A (`why_its_here`,
`best_for`, `not_for`, `what_to_order`, `price_anchor`, `jobs`, `area`). For
the **spa/wellness** venues: `what_to_order` doesn't apply — give `why_its_here`,
`best_for`, `not_for`, `price_anchor` (treatment/class price band), and leave
`jobs` empty (the 9 intent slugs are food/drink only, so wellness venues simply
won't appear on intent pages — that's fine; they still get an indexable page
once `why_its_here` + `best_for` + `price_anchor` are filled).

Guardrails identical to Prompt A.

---

## After you run them

Send me the filled fields (any format — even pasted per-venue blocks). I'll
validate the `jobs` slugs, filter anything past the guardrails, and turn it into
one migration (`0021_enrich_thin_venues.sql`) — applying it flips those pages to
`index,follow` and adds them to the sitemap automatically. Then do a GSC
*Request indexing* on a few of them to speed up pickup (`docs/gsc-setup.md`).
