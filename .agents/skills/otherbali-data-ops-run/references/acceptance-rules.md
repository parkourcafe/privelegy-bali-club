# Acceptance rules by field

Every field type needs a **plausibility bound** — a rule that rejects a value
without needing to know the true answer. Without one, "looks about right" is
the only test, and it passes everything.

The rules below come from real rejections, not from theory.

---

## Opening hours

**Target column:** `venues.opening_hours` (schema.org string) and
`venues.opening_hours_json` (per-day, the only form that can express two
services in a day).

**Accept only if:**

- the source is the venue's own site, its Instagram, or its own booking page —
  **not** a hotel booking engine, not an aggregator;
- the value covers a full week or explicitly states which days are closed;
- the daily window is plausible for the category: a café opening before 05:00
  or closing before 14:00, a restaurant open 24 hours, a spa opening at 14:00 —
  all suspect;
- if the source lists several timetables (class schedule, happy hour, kitchen
  hours, breakfast service), the value is the **venue's** hours, not one of
  them. When you cannot tell which is which, reject.

**Known failure modes:**

| What happened | Why it passed | Rule it produced |
|---|---|---|
| `Mo-Su 14:00-23:59` for a yoga studio and a café | source was `hotels.cloudbeds.com` — 14:00 was hotel check-in | booking engines are not venue sources |
| `Mo-Su 09:30-12:00` for a café | a fragment of a schedule | implausible window for the category |
| `5.00-11.00pm` parsed as 05:00–23:00 | a trailing am/pm marker was not inherited by the first bound | see below |

**The am/pm rule.** A marker written once at the end applies to **both**
bounds. `5.00-11.00pm` is 17:00–23:00, not "open from five in the morning".
This is handled in `lib/opening-hours.ts` and covered by tests; if you write a
new parser anywhere, it must inherit the trailing marker or it will publish
evening venues as open at dawn.

**Midnight.** A closing time of `00:00`, or one earlier than the opening time,
cannot be expressed as a same-day span. Truncate to `23:59` rather than
emitting a backwards range.

---

## Coordinates

**Target columns:** `venues.latitude`, `venues.longitude`.

**Accept only if:**

- the point falls inside its district's bounding box:

  | district | latitude | longitude |
  |---|---|---|
  | canggu | −8.69 … −8.60 | 115.09 … 115.18 |
  | ubud | −8.58 … −8.40 | 115.21 … 115.32 |
  | uluwatu-bukit | −8.87 … −8.74 | 115.03 … 115.25 |

  These are deliberately loose. They catch a different island, not a wrong
  street.

- precision is at least five decimal places. `-8.65, 115.13` is roughly a
  kilometre — a village centre, not a venue;
- a geocoded result carries a result type of *building* or *point of
  interest*. A street, village or postcode centroid is the middle of an area
  and must be rejected, not rounded to "close enough".

**Free sources worth checking before commissioning any collection:**

- coordinates embedded in a stored Maps URL (`@-8.65,115.13`, or the `!3d…!4d…`
  place pin, which is the venue rather than the map viewport) — 22 rows came
  free this way, and 2 more on 2026-08-04;
- **Plus Codes** (Open Location Code) sitting in `venues.address`,
  `full_address` or a `q=` parameter. They look like `54Q9+W93` and decode to a
  3×3 m cell with arithmetic alone — no network, no API key, open standard.
  Five rows came free this way on 2026-08-04. Decode with the reference
  `open-location-code` library rather than a hand-rolled implementation, and
  prove the library round-trips a coordinate you already trust before believing
  its output. Short codes need a reference point to recover the omitted leading
  characters; a district centre is ample, since recovery is unambiguous within
  half a degree;
- `google_place_id`, where present. Measure first: on the 2026-08-04 run it was
  null for every venue missing coordinates.

> **Stored Maps links are an allowed source — founder decision, 2026-08-04.**
> Selena confirmed there is no rule forbidding it, and the 30-day Google
> storage limit does not apply to these. This settles a contradiction: the
> collection spec used to say "not Google Maps as such" while this file called
> the same source legitimate. Reversing it needs a new dated decision.
>
> This does **not** extend to aggregators or booking platforms — Chope,
> Cloudbeds, ClassPass, Playtomic, TripAdvisor. That is a different class of
> source and stays refused; two Chope coordinates were rejected the same day,
> both of them inside their district bounding box.

**Why the bar is higher here than for hours.** Wrong hours are visible — someone
arrives and the door is shut, and they tell you. A wrong coordinate sends
someone to a different place and the card still looks correct. Nobody reports
it.

---

## Phone numbers

**Target column:** `venues.phone`.

**Accept only if:**

- the source is the venue's own site or Instagram bio;
- the number is in international form with the Indonesian country code (`+62`),
  or convertible to it without guessing;
- it is not a booking platform's number, a group's head-office number shared
  across branches, or a personal mobile posted in a comment.

A shared brand number on a multi-branch venue is worse than none: it routes
guests to the wrong location and looks authoritative.

---

## Prices

**Target columns:** `venues.price_anchor` (human text), `venues.price_band`
(`$`…`$$$$`).

**Accept only if:**

- the price comes from the venue's own menu or site, with a **captured-at
  date**;
- the text names what the price is for. `Rp 120-180k` alone is not an anchor;
  `Nasi campur Rp 45k · Americano Rp 35k` is;
- it is not carried over from a review, a blog or an aggregator.

Prices expire. A price published without a captured-at date cannot be aged out
later, so it silently becomes a false claim. See the menu rules in `AGENTS.md`
§10.

---

## Street addresses

**Target column:** `venues.full_address`.

**Accept only if** the value is an actual postal address — it carries a street
marker (`Jl.`, `Jalan`, `Gang`, `Banjar`, `Br.`, or an English street word).

**Reject:**

- area notes: `Canggu/Batu Bolong/Berawa`, `Pecatu / uluwatu bukit`, `Ubud`;
- working notes: `Berawa boundary / verify pin`, `Canggu shortcut / verify
  branch`.

Both kinds are already sitting in the column, which is why
`publishableStreetAddress` in `lib/venue-presentation.ts` gates the field
before it reaches the markup. If a collection run writes to this column, it
must meet the same bar — the gate is a safety net, not a licence to store
notes there.

---

## Descriptions and editorial copy

Not a collection run. Descriptions are written against
`otherbali-venue-record-standard`, from evidence, one venue at a time.

Bulk-generated descriptions are explicitly out of scope: several hundred texts
produced from one template are the same problem as the placeholder they
replace, and search engines penalise them. If a request asks for a collection
run over `why_its_here`, `best_for` or `not_for`, redirect it to the record
standard and say why.
