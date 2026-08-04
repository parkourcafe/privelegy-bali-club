# Brief — bring the listing pages to the guide page standard

**Status:** open · **Created:** 2026-08-04 · **For:** any agent (Codex, Claude Code, other)

Hand this file to an agent as its assignment. It is self-contained: everything
needed is in this repository, and no prior conversation is required.

---

## The assignment

Bring the public listing pages to `.agents/skills/otherbali-guide-page-standard/SKILL.md`,
one page at a time, without inventing a single fact.

`/canggu/best-brunch` is already done and is the worked reference. Read
`.agents/skills/otherbali-guide-page-standard/references/worked-example.md`
before starting — it shows the standard applied to a real page, including what
was deliberately left unfinished.

## Read first, in this order

1. `AGENTS.md` — the operating contract. Its guardrails override anything here.
2. `.agents/skills/otherbali-guide-page-standard/SKILL.md` — the target shape.
3. `.agents/skills/otherbali-venue-record-standard/SKILL.md` — how the fields
   that fill it are written, and the provenance ladder.
4. The page's route, its data source, and the component that renders its cards.

`docs/content-style.md` governs article prose and is not the standard for these
pages. The district SEO pipeline skill decides which URLs should exist; this
brief does not create or delete URLs.

## The one thing that will mislead you

**Do not start by writing copy.** On these pages the public text is assembled at
render time from `venues` rows, so weak-looking output is usually a rendering
gap, not a writing gap. On `/canggu/best-brunch` the audit found `not_for`
written and reviewed for 36 of 43 venues and rendered on no surface at all, and
`opening_hours_json` populated for 501 of 1185 published venues and read
nowhere. Rendering what already exists was most of the win.

So the first step on every page is an audit, and the first question is *"what
do the records already hold, and does anything render it?"*

## Known state, so you do not rediscover it

**Already fixed:** `PlaceCard` renders `notFor`, and `lib/canggu.ts`
`toCangguPlaceCard` passes it. All Canggu guide pages therefore show `Not for`.

**Also fixed:** `lib/uluwatu/venues.ts` `toPlaceCard` now passes `notFor` too.
The registry had carried it for 32 venues since the launch pass while the card
never received it — the same defect as Canggu, surviving in a second code path.
Verified by render: `Not for` now shows on 22/22 cards on `/uluwatu/best-brunch`,
19/19 on `/uluwatu/best-restaurants`, 7/7 on `/uluwatu/beach-clubs-sunset` and
9/9 on `/uluwatu/date-night-restaurants`.

**Known open gap — a good first task.** The four Uluwatu pages above render
through `components/GuideBlocks.tsx`, which has no answer-first block, no
freshness line, and thin Good to know sections. The gate measures it exactly —
on `/uluwatu/best-brunch` it currently reports:

```
FAIL  answer block present before the list   no .guide-answer section
FAIL  5-8 Good to know questions             4 questions
FAIL  visible last-checked date              no 'Last checked' line
WARN  title <= 60 chars                      77 chars
```

`components/CangguGuideView.tsx` already solves all three for the Canggu path;
the work is bringing that capability to the registry-driven path without
duplicating it. Run the gate yourself first — these numbers age.

**Page inventory.** District guides under `app/<district>/<topic>/page.tsx` for
canggu, seminyak, ubud, uluwatu; Bali-wide lists at `app/best-*`,
`app/where-to-*`, `app/things-to-do-in-bali`. Canggu guides render through
`components/CangguGuideView.tsx`; Uluwatu through `components/GuideBlocks.tsx`.
The Bali-wide pages are hand-authored and each needs its own look.

**Suggested order** — highest value per unit of risk:

1. The Uluwatu `notFor` wiring (one code path, four pages).
2. Remaining Canggu guides — same component, so answer blocks are cheap to add.
3. Ubud and Seminyak district guides.
4. Bali-wide list pages.

## The loop, per page

Work one page at a time. Do not batch.

1. **Audit before touching anything.** Query the records behind the page. Record
   which fields are populated, and separately which are rendered. Both numbers.
2. **Classify the gap.** Rendering gap → code. Empty fields → record work, which
   means SQL for the founder, not a page edit. Both can be true.
3. **Fix the smallest complete slice.** Prefer wiring an existing field over
   writing new copy.
4. **Run the gate:**
   ```bash
   node .agents/skills/otherbali-guide-page-standard/scripts/check-page.mjs <url>
   ```
   Against a preview URL, or `--file` on saved SSR HTML. It exits non-zero on a
   fail. A green run is not a sign-off — it checks only what a machine can
   decide, and prints what it cannot.
5. **Do the human checklist** in the standard: provenance, fit-vs-quality
   wording, sections that promise more than they hold.
6. **Verify:** `npm run lint`, `npm run typecheck`, `npm run build`, plus the
   focused tests for what you touched.
7. **Bump the sitemap `lastmod`** in `lib/seo/sitemap-last-modified.ts` for any
   page whose content genuinely changed — to the real change date, never today
   by reflex. A false lastmod teaches crawlers to distrust the whole sitemap.
8. **Record the result** in a short handoff note: what changed, what the gate
   said before and after, what stays open and why.

## Hard boundaries

- **Never invent a fact.** Unknown stays `null`, hidden, or unsaid. This
  applies with full force to opening hours, prices, queue times and booking
  policy. A wrong opening time is the most damaging thing a travel page can
  carry, and once a model repeats it the error outlives the correction.
- **Do not write to the database.** Produce SQL under `data/data-ops/` for the
  founder to apply, following
  `.agents/skills/otherbali-venue-record-standard/assets/venue-record-update-TEMPLATE.sql`.
  Guard every UPDATE on the field being empty, address rows by slug, and state
  the provenance rung in the file header.
- **Do not bump `last_verified_at`** for copy derived from an existing record.
  That date drives the public "Last checked" line and the sitemap; dating
  derived copy as freshly verified corrupts the only freshness signal the site
  has, undetectably.
- **No schema changes** without an architecture decision (`AGENTS.md` §9).
- **Do not change a URL.** These pages have ranking history.
- **Do not add Google ratings, review counts, or review-derived claims.**
- **Do not create a pull request unless asked.**

## Definition of done, per page

- The gate passes, and the human checklist is genuinely worked, not skimmed.
- Lint, typecheck and build pass; focused tests pass.
- Every claim traces to a verified record; nothing invented.
- Sitemap `lastmod` reflects the real change.
- The handoff note states what remains open — including anything that cannot be
  fixed by writing, such as missing price anchors or absent hours.

## Escalate instead of guessing

Stop and write it down when: a fact is needed and no source holds it; the fix
requires a schema change; a section cannot be filled honestly and folding it is
a content decision; the standard and `AGENTS.md` appear to disagree; or the
records are fine and the real problem is competition and links, which no page
edit will solve.

A precise blocker is useful. Confident improvisation is the failure mode this
whole standard exists to prevent.
