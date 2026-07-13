# Canggu editorial evidence pass — 2026-07-12

First real editorial tranche for the **active_deep flagship**. Flips `/canggu` +
its four guide pages from empty to populated.

## Why this was needed (the honest finding)

The production DB had **104 Canggu venue stubs with ZERO `why_its_here` / `best_for`**
— so the `/canggu` pillar and guides (shipped in PR #30) rendered empty, because the
publication gate (`legacyDecisionReady`) requires `why_its_here` + `best_for` +
(`price_anchor` | `what_to_order`).

The founder's Drive research uploads ("Other Bali Agent Prompts", files `00`–`21`)
were audited in full. **They are pipeline _prompts / templates_, not finished
research output.** The completed tables (with why/best-for/verified facts) were never
saved to Drive. 67 venue names were recoverable from candidate lists embedded in the
prompts, but with **0** synthesized editorial. So there was nothing editorial to import.

## What was done instead

A fresh, verified web-research pass — same bar as the Uluwatu launch (#26 / migration
0018) — on **34 established, currently-operating Canggu venues that already exist in the
catalogue**. Each was verified against first-party sources (official site / official
Instagram / reputable non-review listings). Migration: `0021_canggu_editorial_pass.sql`.

Fields set (fill-empties-only, idempotent): `why_its_here`, `best_for`, `not_for`,
`what_to_order`, `price_anchor` (bands), `official_url`, `instagram_url`, `jobs`.

Coverage after apply (publishable = passes the gate): **34 / 34**
- restaurants 18, cafés 8, beach clubs 3, bars 2, spas 3
- guide groups all populated: date-night 11, groups 18, family 4, special-occasion 7,
  work-café 4, brunch 13, sunset 10.

## Guardrails honoured

- No Google/TripAdvisor review text, no star ratings, no review counts (#1).
- `best_for` / `not_for` are WHO/WHEN fit-context only — never quality warnings or
  anti-lists (#7).
- Prices as bands ($–$$$$), not invented anchors.
- `jobs` use only the existing 9-slug vocabulary — no new entities (#11).
- Canggu is active_deep: the money loop (TablePilot handoff via each venue's own
  `tablepilot_slug` / perk) is untouched.

## Bug fixed alongside

`lib/canggu.ts` `venueHasJob` did a raw `includes()` — but the DB stores underscore job
slugs (`date_night_special`) while `canggu-guides.ts` authors hyphen slugs
(`date-night-special`), so no guide group could ever match. Now normalises both sides via
`normalizeJobs` (same as the intent spokes). Latent until now because Canggu had almost no
jobs data.

## Tranche 2 — 2026-07-12 (migration `0022_canggu_editorial_pass_t2.sql`)

Extended the same verified pass to the rest of the active catalogue: **50 more
venues** (Batu Bolong / Berawa / Pererenan / Seseh / Cemagi restaurants, remaining
cafés, one wine bar, and the wellness/spa/beauty/fitness set), all verified against
first-party sources, all clearing the publication gate. Same guardrails as tranche 1.

Two catalogue rows were deliberately left untouched for founder review:
- **`dandelion`** — the venue rebranded to **"Casa Tua"** (same owner/site). Publishing
  it as Dandelion would be stale branding — it needs a rename, not a fill.
- **`dicarik-warung`** — no confident first-party Canggu match (the exact name resolves
  to an Ubud warung; a similarly-named "Waroeng D'Carik" sits in Kerobokan). Ambiguous —
  needs disambiguation before publish.

Category note surfaced by the research: `jungle-padel-canggu-shortcut` (padel courts),
`wrong-gym-pererenan` (gym) and `finns-recreation-club-...` are keyed `category = spa`
but are really sport/fitness — they'll currently surface under the "spas & wellness"
guide. Recategorisation (to a `fitness` category) is a separate, optional cleanup.

After tranche 1 + 2, essentially the entire **active** Canggu catalogue carries
editorial. Remaining empties are inactive/archived rows and a few duplicates.

## What still remains

- **Photos: none, any district.** Venue detail pages stay `noindex` until a
  rights-cleared image pass. Only the curated `/canggu` guide surfaces publish — no thin
  venue pages get indexed.
- **`dandelion` rename → Casa Tua** and **`dicarik-warung` disambiguation** (above).
- Optional: recategorise the 3 sport/fitness rows out of `spa`.
- **Apply status:** tranche 1 (`0021`) is applied to the production DB. Tranche 2
  (`0022`) is committed but its **prod apply is a founder step (pending)** — run the
  migration's SQL against prod to take the extra 50 live. The `/canggu` page code ships
  when the branch's PR merges and deploys.
