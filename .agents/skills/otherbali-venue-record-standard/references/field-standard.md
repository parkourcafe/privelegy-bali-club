# Field standard — `venues` row

One section per field: what it is for, format, evidence required, and a real
before/after. All examples are actual production records.

- [why_its_here](#why_its_here)
- [best_for](#best_for)
- [not_for](#not_for)
- [price_anchor](#price_anchor)
- [what_to_order](#what_to_order)
- [opening_hours_json / opening_hours](#opening_hours_json--opening_hours)
- [last_verified_at](#last_verified_at)
- [jobs and area](#jobs-and-area)

---

## why_its_here

**Job:** what this place is, and the facts that decide it. The editorial line on
every card.

**Format:** two to four short sentences, one fact each. Present tense. No
opening throat-clear ("Nestled in…", "Known for its…").

**Evidence:** rung 1 or 2. Everything here is public copy.

The failure mode is a single sentence carrying location, atmosphere, menu and
history at once. It reads fine and extracts to nothing.

**Before** (Bali Buda Canggu, real):

> The Canggu branch of Bali Buda, an organic wholefoods cafe-and-store brand
> established in 1994 — smoothie bowls, fresh juices, wholesome mains and an
> in-house bakery, with organic groceries and eco goods to take away.

**After:**

> Organic wholefoods café and store, part of a Bali brand established in 1994.
> Smoothie bowls, juices, wholesome mains and an in-house bakery. Organic
> groceries and eco goods to take away.

Same facts, same length, three liftable statements instead of one.

---

## best_for

**Job:** the moment or person this place suits, in the traveller's words.

**Format:** one clause. Start with the person or the moment, not with "Perfect
for" or "Ideal for".

Keep it to the positive case only. If you find yourself writing "…and people who
don't mind a crowd", that is the negative wearing a disguise — it belongs in
`not_for`, where it is far more useful.

**Before** (Crate Cafe, real):

> Backpackers and surfers wanting a lively, affordable brunch after a morning in
> the water; people who like buzz and don't mind a crowd.

**After:**

> Surfers and backpackers after a morning in the water.

---

## not_for

**Job:** who or what this place does **not** suit. The highest-value field on
the record and the one competitors do not publish.

**Format:** one clause, ideally with the reason attached — "A quiet table — it
is loud and busy" beats "Not for quiet".

**The line that must not be crossed:** this is *fit context*, never a quality
warning (`AGENTS.md` guardrail #9). The test that settles every borderline case:
**would the owner read it and agree it is accurate?**

| | |
|---|---|
| ✅ Fit | "A quiet table or focused laptop work — it is loud and busy." |
| ✅ Fit | "A budget breakfast — mains run 100,000–250,000 IDR." |
| ✅ Fit | "Diners set on meat or seafood — the menu is entirely vegetarian and vegan." |
| ❌ Quality | "Service is slow and the staff are rude." |
| ❌ Quality | "Overpriced for what you get." |
| ❌ Invented | "Expect a 30-minute wait at weekends." (unless recorded) |

Most `not_for` values can be written at rung 2 from the record's own
`why_its_here` — the negative is usually already implied by the positive. That
is a restatement, so do not bump `last_verified_at` for it.

---

## price_anchor

**Job:** what a visit costs, at a glance.

**Canonical format** (`docs/content-style.md` §1): a band, optionally with a
concrete anchor.

```
$$ · mains 90–150K
```

**Known drift — do not paper over it.** Production data currently holds at least
three incompatible formats on a single page:

| Format | Example | Count on /canggu/best-brunch |
|---|---|---|
| Band only | `$$` | most |
| Range, short | `35k-70k IDR` | Crate Cafe |
| Range, long | `Rp 100.000 - 250.000` | Milu by Nook |

Because of this, **never state a page-wide price range in prose** — you cannot
compute one from mixed formats without inventing it. Name specific venues with
specific numbers instead, and say "most of this list sits in the mid band" for
the rest.

Normalising the stored values is a content decision for the founder, not a
silent agent rewrite. Surface the audit query, propose the canonical format,
and let her choose.

---

## what_to_order

**Job:** the consensus-checked dish, not your favourite.

**Format:** semicolon-separated list, lowercase, no sentence. The code splits on
`;` — see `publicWhatToOrderItems` in `lib/venue-completeness.ts`.

```
vegan croissants; pancakes; full English breakfast; chicory coffee
```

**Evidence gate is enforced in code, not by convention.**
`hasWhatToOrderEvidence` publishes this field only when the venue has a current
structured menu or a validated official menu URL. A general venue verification
date is deliberately **not** menu evidence — dishes change faster than venues do.

So a beautifully written `what_to_order` on a venue with no menu source renders
nothing. Check the menu evidence before writing the field, or you are writing
into a void.

---

## opening_hours_json / opening_hours

**Job:** structured hours. `opening_hours_json` (jsonb) is the real one;
`opening_hours` (text) is legacy.

**Shape** — copy it verbatim from existing rows so imports stay consistent:

```json
{"Monday":["7.00am-10.00pm"], "Tuesday":["7.00am-10.00pm"], ...}
```

- Closed that day → empty array: `"Monday": []`
- Split service → two entries: `"Monday": ["8.00am-2.00pm","6.00pm-10.00pm"]`

**Current state:** 501 of 1185 published venues carry `opening_hours_json`, and
**no public surface reads it** — the column is absent from the public column
list in `lib/data.ts` and from the `Venue` type. Filling more rows will not put
hours on any page until that mapping exists. If the ask is "show opening hours",
the work is code first, data second.

Hours are the most volatile fact on the record and the most damaging to get
wrong. Never derive them from prose, a neighbouring venue, or a plausible
pattern. Fill only from the venue's own source, and only what you actually
checked — a partly filled table is correct, a completed guess is not.

---

## last_verified_at

**Job:** the date the record's facts were last checked against a real source.

This is the most consequential field on the row and the easiest to corrupt,
because bumping it costs nothing and looks like progress. It drives:

- the public "Last checked <date>" line on district guide pages,
- `lastmod` in the sitemap, which tells crawlers the page genuinely changed.

**Bump it when:** you re-checked the venue's own source, an owner confirmed the
facts, or an editorial visit was recorded.

**Do not bump it when:** you rephrased existing copy, moved a fact between
fields, fixed a typo, or restated `why_its_here` as `not_for`. Rung-2 work
produces better copy from the same evidence — the evidence is not newer.

A stale-but-honest date is recoverable. A fresh-but-false date destroys the only
freshness signal the site has, and nothing downstream can detect it.

---

## jobs and area

Not prose, but they decide **which page a venue appears on**, so they are part of
the content standard.

`jobs` drives list membership. `/canggu/best-brunch` is literally
`venueHasJob(v, ["brunch-after-surf"])` — a venue with perfect copy and the wrong
job appears nowhere. The database stores underscore slugs
(`brunch_after_surf`); guide definitions use hyphens; `normalizeJobs` collapses
both, so either reads correctly, but stay consistent with existing rows when
writing.

`area` is the micro-area shown on the card (Batu Bolong, Berawa, Pererenan).
Free text today, and it has drifted — `Berawa`, `Berawa / Semat`, `Berawa near
Finns` and `Berawa / Tegal Gundul` all exist. Match the dominant spelling for
the area when adding a row rather than inventing a new variant, or grouping and
counting by area quietly breaks.
